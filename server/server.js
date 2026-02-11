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

// --- Naya Forgot Password Feature ---

const forgotPasswordRouter = require('./forgotPassword');
app.use('/api', forgotPasswordRouter);


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

// --- Database Setup ---
const mongoose = require('mongoose');
const DB_FILE = path.join(__dirname, 'db.json');

// Define User Schema for MongoDB
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    joined: { type: Date, default: Date.now },
    twoFactorEnabled: { type: Boolean, default: false },
    twoFactorSecret: { type: String, default: null },
    expenses: {
        items: { type: Array, default: [] },
        income: { type: Number, default: 50000 },
        updatedAt: { type: Date, default: Date.now }
    },
    resetOtp: { type: String, default: null },
    resetOtpExpires: { type: Date, default: null }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

let localDb = { users: [], expenses: {}, searchHistory: [] };

// Initialize MongoDB or JSON File
const initDB = async () => {
    if (process.env.MONGODB_URI) {
        try {
            await mongoose.connect(process.env.MONGODB_URI);
            console.log('Connected to MongoDB Atlas');
        } catch (err) {
            console.error('MongoDB connection error:', err);
            loadJSONDB();
        }
    } else {
        loadJSONDB();
    }
};

const loadJSONDB = () => {
    if (!fs.existsSync(DB_FILE)) {
        fs.writeFileSync(DB_FILE, JSON.stringify(localDb, null, 2));
    } else {
        try {
            const data = fs.readFileSync(DB_FILE, 'utf8');
            localDb = JSON.parse(data);
        } catch (err) {
            console.error("Error reading DB:", err);
        }
    }
    console.log(`JSON Database active at: ${DB_FILE}`);
};

initDB();

// --- API Routes ---

// Signup
app.post('/api/auth/signup', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        if (process.env.MONGODB_URI) {
            const existingUser = await User.findOne({ email });
            if (existingUser) return res.status(400).json({ message: 'Email already exists' });

            const newUser = new User({ name, email, password });
            await newUser.save();
            const { password: _, ...userWithoutPassword } = newUser.toObject();
            return res.status(201).json({ message: 'User created successfully', user: userWithoutPassword });
        } else {
            // Local JSON Fallback
            if (localDb.users.find(u => u.email === email)) {
                return res.status(400).json({ message: 'Email already exists' });
            }
            const newUser = { id: Date.now().toString(), name, email, password, joined: new Date() };
            localDb.users.push(newUser);
            fs.writeFileSync(DB_FILE, JSON.stringify(localDb, null, 2));
            return res.status(201).json({ message: 'User created (Local)', user: newUser });
        }
    } catch (err) {
        res.status(500).json({ message: 'Signup error', error: err.message });
    }
});

// Login
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        let user;
        if (process.env.MONGODB_URI) {
            user = await User.findOne({ email, password });
        } else {
            user = localDb.users.find(u => u.email === email && u.password === password);
        }

        if (!user) return res.status(401).json({ message: 'Invalid credentials' });

        if (user.twoFactorEnabled) {
            return res.json({ message: '2FA Required', require2fa: true, userId: user._id || user.id });
        }

        sendEmail(email, "New Login Detected", "You just logged into your Gullak account.");
        const { password: _, ...userWithoutPassword } = user.toObject ? user.toObject() : user;
        res.json({ message: 'Login successful', user: userWithoutPassword });
    } catch (err) {
        res.status(500).json({ message: 'Login error' });
    }
});

// Login (Step 2: Verify 2FA - App or Email OTP)
app.post('/api/auth/login/2fa', async (req, res) => {
    const { userId, token } = req.body;
    try {
        let user;
        if (process.env.MONGODB_URI) {
            user = await User.findById(userId);
        } else {
            user = localDb.users.find(u => u.id === userId);
        }

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
            if (Date.now() < (user.emailOtpExpires || 0)) {
                verified = true;
                if (user.toObject) {
                    user.emailOtp = undefined;
                    user.emailOtpExpires = undefined;
                    await user.save();
                } else {
                    delete user.emailOtp;
                    delete user.emailOtpExpires;
                    fs.writeFileSync(DB_FILE, JSON.stringify(localDb, null, 2));
                }
            }
        }

        if (verified) {
            sendEmail(user.email, "Login Successful", "2FA Verification completed successfully.");
            const { password: _, ...userWithoutPassword } = user.toObject ? user.toObject() : user;
            res.json({ message: 'Login successful', user: userWithoutPassword });
        } else {
            res.status(401).json({ message: 'Invalid 2FA Token' });
        }
    } catch (err) {
        res.status(500).json({ message: '2FA error' });
    }
});

// Send Email OTP for 2FA
app.post('/api/auth/login/2fa/send-email', async (req, res) => {
    const { userId } = req.body;
    try {
        let user;
        if (process.env.MONGODB_URI) {
            user = await User.findById(userId);
        } else {
            user = localDb.users.find(u => u.id === userId);
        }

        if (!user) return res.status(404).json({ message: 'User not found' });

        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit
        user.emailOtp = otp;
        user.emailOtpExpires = Date.now() + 5 * 60000; // 5 mins

        if (user.save) await user.save();
        else fs.writeFileSync(DB_FILE, JSON.stringify(localDb, null, 2));

        sendEmail(user.email, "Your 2FA Login Code", `Your verification code is: ${otp}`);
        res.json({ message: 'OTP sent to email' });
    } catch (err) {
        res.status(500).json({ message: 'Error sending OTP' });
    }
});

// 2FA Setup: Generate Secret & QR (OPTIMIZED for < 1s response)
app.post('/api/auth/2fa/setup', async (req, res) => {
    const { userId } = req.body;
    try {
        let user;
        if (process.env.MONGODB_URI) {
            user = await User.findById(userId);
        } else {
            user = localDb.users.find(u => u.id === userId);
        }

        if (!user) return res.status(404).json({ message: 'User not found' });

        // Speed Optimization: Generate secret instantly
        const secret = speakeasy.generateSecret({ length: 20, name: `Gullak (${user.email})` });
        user.tempSecret = secret.base32;

        // Use a high-speed QR API for instant delivery (no server processing wait)
        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(secret.otpauth_url)}`;

        // FIRE AND FORGET: Save to DB in background, don't wait for it
        const saveToDb = async () => {
            try {
                if (user.save) await user.save();
                else fs.writeFileSync(DB_FILE, JSON.stringify(localDb, null, 2));
                console.log(`[2FA] Secret saved in background for ${user.email}`);
            } catch (saveErr) {
                console.error("[2FA] Background save failed:", saveErr);
            }
        };
        saveToDb();

        // Return immediately
        res.json({ secret: secret.base32, qrCode: qrCodeUrl });
    } catch (err) {
        console.error("2FA Setup Error:", err);
        res.status(500).json({ message: '2FA Setup error' });
    }
});

// 2FA Setup: Verify & Enable
app.post('/api/auth/2fa/verify', async (req, res) => {
    const { userId, token } = req.body;
    try {
        let user;
        if (process.env.MONGODB_URI) {
            user = await User.findById(userId);
        } else {
            user = localDb.users.find(u => u.id === userId);
        }

        if (!user || !user.tempSecret) return res.status(400).json({ message: 'Setup not initialized' });

        const verified = speakeasy.totp.verify({
            secret: user.tempSecret,
            encoding: 'base32',
            token: token
        });

        if (verified) {
            user.twoFactorSecret = user.tempSecret;
            user.twoFactorEnabled = true;
            user.tempSecret = undefined;

            if (user.save) await user.save();
            else {
                delete user.tempSecret;
                fs.writeFileSync(DB_FILE, JSON.stringify(localDb, null, 2));
            }
            res.json({ message: 'Two-Factor Authentication Enabled Successfully' });
        } else {
            res.status(400).json({ message: 'Invalid Token. Please try again.' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Verification error' });
    }
});

// Forgot Password (Mock)
app.post('/api/auth/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        let user;
        if (process.env.MONGODB_URI) {
            user = await User.findOne({ email });
        } else {
            user = localDb.users.find(u => u.email === email);
        }

        if (!user) return res.status(404).json({ message: 'No account found with this email' });

        console.log(`[AUTH] Password Reset for ${email}: ${user.password}`);
        res.json({ message: 'Password recovery instruction sent (Check server console for demo)' });
    } catch (err) {
        res.status(500).json({ message: 'Error processing forgot password' });
    }
});

// 1. Search History (Global for now, can be made user-specific)
app.get('/api/search/history', (req, res) => {
    res.json(localDb.searchHistory.slice(0, 10));
});

app.post('/api/search/history', (req, res) => {
    const { query, timestamp } = req.body;
    const newEntry = { id: Date.now().toString(), query, timestamp: timestamp || new Date() };
    localDb.searchHistory = [newEntry, ...localDb.searchHistory].slice(0, 50);
    if (!process.env.MONGODB_URI) fs.writeFileSync(DB_FILE, JSON.stringify(localDb, null, 2));
    res.status(201).json(newEntry);
});

// 2. Expense Data (User Specific)

// Get Expenses
app.get('/api/expenses', async (req, res) => {
    const userId = req.query.userId;
    try {
        if (process.env.MONGODB_URI && userId) {
            const user = await User.findById(userId);
            if (user) return res.json(user.expenses || { items: [], income: 50000 });
        }

        // Local Fallback
        const userData = localDb.expenses[userId] || { items: [], income: 50000 };
        res.json(userData);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching expenses' });
    }
});

// Save Expenses
app.post('/api/expenses', async (req, res) => {
    const { userId, expenses, income } = req.body;
    if (!userId) return res.status(400).json({ message: 'User ID is required' });

    try {
        if (process.env.MONGODB_URI) {
            const user = await User.findById(userId);
            if (user) {
                user.expenses = { items: expenses, income, updatedAt: new Date() };
                await user.save();
                return res.status(200).json({ message: 'Saved to MongoDB', data: user.expenses });
            }
        }

        // Local Fallback
        localDb.expenses[userId] = { expenses, income, updatedAt: new Date() };
        fs.writeFileSync(DB_FILE, JSON.stringify(localDb, null, 2));
        res.status(200).json({ message: 'Saved to Local JSON', data: localDb.expenses[userId] });
    } catch (err) {
        res.status(500).json({ message: 'Save error' });
    }
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
        // Using Gemma 3 4B - Ultra-fast 3-series model for instant replies
        const model = genAI.getGenerativeModel({ model: "gemma-3-4b-it" });

        const historyText = history ? history.map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n') : '';

        const personaPrompt = `
You are "Gullak AI" from meraGullak.com 🇮🇳.

MISSION:
1. Always show the user "Paisa Vasool" by telling them "Kitna bachega" (How much they save).
2. Tell them "Kahan use karein" (Where to use it) in clear points.
If they spend 50,000, calculate the exact cashback or points value based on the card data.

FEATURED TOP CARDS:
1. HDFC Millennia: 5% Cashback. Use: Amazon/Flipkart.
2. Axis Atlas: 5 Miles per 100. Use: Flights/Hotels.
3. Amex Platinum: Luxury Lounges. Use: International Travel.
4. IDFC First WOW: 6X Rewards. Use: Everywhere (Zero Fee).

RULES:
- Never use ** (bolding).
- Use clear points (1. 2. or bullets) for usage.
- Use plain text and new lines.

PERSONA:
- Friendly and direct.
- Only card, usage context, and savings talk.
- Natural Hinglish only.

CONTEXT:
Card: ${cardName}
Data: ${JSON.stringify(cardData, null, 2)}

USER MESSAGE: ${userMessage}

Structure response:
Kahan use karein:
(Points here)

Kitna bachega:
(Clear calculation)

Use Hinglish. No bolding. Use points.
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

// 3. Health Check (Pulse Endpoint)
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        server: 'Gullak Production-Ready Backend',
        timestamp: new Date().toISOString(),
        storage: process.env.MONGODB_URI ? 'MongoDB' : 'Local JSON'
    });
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Gullak Backend running on http://0.0.0.0:${PORT}`);
    console.log(`Persistent storage active at: ${DB_FILE}`);
});
