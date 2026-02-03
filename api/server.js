const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

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
        joined: new Date().toISOString()
    };

    db.users.push(newUser);
    
    // Initialize empty expenses for the new user
    db.expenses[newUser.id] = { expenses: [], income: 50000, updatedAt: new Date() };
    
    writeData(db);

    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json({ message: 'User created successfully', user: userWithoutPassword });
});

// Login
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const db = readData();
    
    const user = db.users.find(u => u.email === email && u.password === password);

    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json({ message: 'Login successful', user: userWithoutPassword });
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

// 3. Health Check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', server: 'Gullak Local Backend', storage: 'JSON File' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Gullak Backend running on http://localhost:${PORT}`);
    console.log(`Persistent storage active at: ${DB_FILE}`);
});
