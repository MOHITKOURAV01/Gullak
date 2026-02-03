const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// --- Email Config ---
const transporter = nodemailer.createTransport({
    service: 'gmail', // Use 'gmail' or your provider
    auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com', // Set these in .env
        pass: process.env.EMAIL_PASS || 'your-app-password'
    }
});

const sendEmail = async (to, subject, text) => {
    if (!process.env.EMAIL_USER) {
        console.log(`[MOCK EMAIL] To: ${to} | Subject: ${subject} | Body: ${text}`);
        return;
    }
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            text
        });
        console.log(`Email sent to ${to}`);
    } catch (err) {
        console.error("Email error:", err);
    }
};

// --- File-Based Database Setup ---
const DB_FILE = path.join(__dirname, 'db.json');

// Helper: Read Database
const readData = () => {
    if (!fs.existsSync(DB_FILE)) {
        // Initialize default structure if file prevents errors
        const defaultData = { users: [], expenses: {}, searchHistory: [] };
        writeData(defaultData);
        return defaultData;
    }
    try {
        const data = fs.readFileSync(DB_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error("Error reading DB:", err);
        return { users: [], expenses: {}, searchHistory: [] };
    }
};

// Helper: Write Database
const writeData = (data) => {
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    } catch (err) {
        console.error("Error writing DB:", err);
    }
};

// --- API Routes ---

// 0. Authentication

// Signup
app.post('/api/auth/signup', (req, res) => {
    const { name, email, password } = req.body;
    const db = readData();

    if (db.users.find(u => u.email === email)) {
        return res.status(400).json({ message: 'Email already exists' });
    }

    const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password, // In a real production app, you MUST hash this password!
        joined: new Date().toISOString(),
        twoFactorEnabled: false,
        twoFactorSecret: null
    };

    db.users.push(newUser);

    // Initialize empty expenses for the new user
    db.expenses[newUser.id] = { expenses: [], income: 50000, updatedAt: new Date() };

    writeData(db);

    const { password: _, twoFactorSecret: __, ...userWithoutPassword } = newUser;
    res.status(201).json({ message: 'User created successfully', user: userWithoutPassword });
});

// Login (Step 1)
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const db = readData();

    const user = db.users.find(u => u.email === email && u.password === password);

    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check 2FA
    if (user.twoFactorEnabled) {
        return res.json({
            message: '2FA Verification Required',
            require2fa: true,
            userId: user.id
        });
    }

    sendEmail(email, "New Login Detected", "You just logged into your Gullak account.");

    const { password: _, twoFactorSecret: __, ...userWithoutPassword } = user;
    res.json({ message: 'Login successful', user: userWithoutPassword });
});

// Login (Step 2: Verify 2FA - App or Email OTP)
app.post('/api/auth/login/2fa', (req, res) => {
    const { userId, token } = req.body;
    const db = readData();
    const user = db.users.find(u => u.id === userId);

    if (!user) return res.status(404).json({ message: 'User not found' });

    let verified = false;

    // Check 1: Time-based OTP (Google Authenticator)
    if (user.twoFactorSecret) {
        verified = speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            encoding: 'base32',
            token: token
        });
    }

    // Check 2: Email OTP fallback
    if (!verified && user.emailOtp && user.emailOtp === token) {
        if (Date.now() < user.emailOtpExpires) {
            verified = true;
            delete user.emailOtp;        // Consume OTP
            delete user.emailOtpExpires;
            writeData(db);
        }
    }

    if (verified) {
        sendEmail(user.email, "Login Successful", "2FA Verification completed successfully.");
        const { password: _, twoFactorSecret: __, ...userWithoutPassword } = user;
        res.json({ message: 'Login successful', user: userWithoutPassword });
    } else {
        res.status(401).json({ message: 'Invalid 2FA Token' });
    }
});

// Send Email OTP for 2FA
app.post('/api/auth/login/2fa/send-email', (req, res) => {
    const { userId } = req.body;
    const db = readData();
    const user = db.users.find(u => u.id === userId);

    if (!user) return res.status(404).json({ message: 'User not found' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit
    user.emailOtp = otp;
    user.emailOtpExpires = Date.now() + 5 * 60000; // 5 mins
    writeData(db);

    sendEmail(user.email, "Your 2FA Login Code", `Your verification code is: ${otp}`);
    res.json({ message: 'OTP sent to email' });
});

// 2FA Setup: Generate Secret & QR
app.post('/api/auth/2fa/setup', (req, res) => {
    const { userId } = req.body;
    const db = readData();
    const user = db.users.find(u => u.id === userId);

    if (!user) return res.status(404).json({ message: 'User not found' });

    const secret = speakeasy.generateSecret({ length: 20, name: `Gullak (${user.email})` });

    // Temporarily store the secret (or you could store pending secrets differently)
    // Here we will rely on the client sending it back to verify, or save it to DB temporarily
    // For simplicity, let's update the user but keep enabled=false until verified

    user.tempSecret = secret.base32;
    writeData(db);

    QRCode.toDataURL(secret.otpauth_url, (err, data_url) => {
        if (err) return res.status(500).json({ message: 'Error generating QR code' });
        res.json({ secret: secret.base32, qrCode: data_url });
    });
});

// 2FA Setup: Verify & Enable
app.post('/api/auth/2fa/verify', (req, res) => {
    const { userId, token } = req.body;
    const db = readData();
    const user = db.users.find(u => u.id === userId);

    if (!user || !user.tempSecret) return res.status(400).json({ message: 'Setup not initialized' });

    const verified = speakeasy.totp.verify({
        secret: user.tempSecret,
        encoding: 'base32',
        token: token
    });

    if (verified) {
        user.twoFactorSecret = user.tempSecret;
        user.twoFactorEnabled = true;
        delete user.tempSecret;
        writeData(db);
        res.json({ message: 'Two-Factor Authentication Enabled Successfully' });
    } else {
        res.status(400).json({ message: 'Invalid Token. Please try again.' });
    }
});

// Forgot Password (Mock)
app.post('/api/auth/forgot-password', (req, res) => {
    const { email } = req.body;
    const db = readData();
    const user = db.users.find(u => u.email === email);

    if (!user) {
        return res.status(404).json({ message: 'No account found with this email' });
    }

    console.log(`[AUTH] Password Reset for ${email}: ${user.password}`);
    res.json({ message: 'Password recovery instruction sent (Check server console for demo)' });
});

// 1. Search History (Global for now, can be made user-specific)
app.get('/api/search/history', (req, res) => {
    const db = readData();
    res.json(db.searchHistory.slice(0, 10));
});

app.post('/api/search/history', (req, res) => {
    const { query, timestamp } = req.body;
    const db = readData();

    const newEntry = { id: Date.now().toString(), query, timestamp: timestamp || new Date() };
    db.searchHistory = [newEntry, ...db.searchHistory].slice(0, 50);

    writeData(db);
    res.status(201).json(newEntry);
});

// 2. Expense Data (User Specific)

// Get Expenses
app.get('/api/expenses', (req, res) => {
    const userId = req.query.userId; // Expect userId in query param
    const db = readData();

    if (!userId) {
        // Fallback for backward compatibility or guest mode (returns global/first or empty)
        // For now, let's return a default structure if no user
        return res.json({ expenses: [], income: 0 });
    }

    const userData = db.expenses[userId] || { expenses: [], income: 50000 };
    res.json(userData);
});

// Save Expenses
app.post('/api/expenses', (req, res) => {
    const { userId, expenses, income } = req.body;

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required to save data' });
    }

    const db = readData();
    db.expenses[userId] = {
        expenses,
        income,
        updatedAt: new Date().toISOString()
    };

    writeData(db);
    res.status(200).json({ message: 'Saved successfully', data: db.expenses[userId] });
});

const { GoogleGenerativeAI } = require('@google/generative-ai');

// Gemini Setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// API Routes

// ... (previous routes)

// 4. Card Expert AI Assistant
app.post('/api/ai/card-expert', async (req, res) => {
    const { cardName, cardData, userMessage, history } = req.body;
    console.log(`[AI Request] User: ${userMessage.substring(0, 50)}... Card: ${cardName}`);

    if (!process.env.GEMINI_API_KEY) {
        console.error('SERVER ERROR: GEMINI_API_KEY not found in .env');
        return res.status(500).json({ error: 'Gemini API Key is not configured.' });
    }

    try {
        // Use gemini-flash-lite-latest as it has a separate/higher quota than full flash
        const model = genAI.getGenerativeModel({ model: "gemini-flash-lite-latest" });

        const historyText = history ? history.map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n') : '';

        const personaPrompt = `
You are "Gullak AI" from meraGullak.com 🇮🇳.

MISSION:
Always show the user "Paisa Vasool" by telling them "Kitna bachega" (How much they save).
If they spend 50,000, calculate the exact cashback or points value based on the card data.

FEATURED TOP CARDS (Recommend these for general queries):
1. HDFC Millennia: 5% Cashback on shopping (Save 2,500 on 50k).
2. Axis Atlas: 5 Miles per 100 on travel.
3. Amex Platinum: Luxury Lounges & massive travel credits.
4. IDFC First WOW: 6X Rewards & Zero Fee.

FORBIDDEN SYMBOLS:
- Never use ** (bolding).
- Never use - (hyphens/bullets). 
- Use plain text and new lines.

PERSONA:
- Super short.
- Only card and savings talk.
- Natural Hinglish.

CONTEXT:
Card: ${cardName}
Data: ${JSON.stringify(cardData, null, 2)}

HISTORY:
${historyText}

USER MESSAGE: ${userMessage}

Calculate savings (Kitna bachega) clearly. No bolding. No hyphens.
`;

        const result = await model.generateContent(personaPrompt);
        const response = await result.response;
        const text = response.text();

        console.log(`[AI Response] Length: ${text.length} chars`);
        res.json({ reply: text });
    } catch (error) {
        console.error('--- Gemini Error Details ---');
        console.error('Message:', error.message);
        if (error.response) console.error('Response Data:', error.response.data);
        res.status(500).json({ error: 'Failed to fetch response from AI', details: error.message });
    }
});

// 3. Health Check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', server: 'Gullak Local Backend', storage: 'JSON File' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Gullak Backend running on http://localhost:${PORT}`);
    console.log(`Persistent storage active at: ${DB_FILE}`);
});
