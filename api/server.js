const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for demonstration (if MongoDB is not connected)
let searchHistory = [];
let userExpenses = [];
let users = []; // New users array

// API Routes

// 0. Authentication
app.post('/api/auth/signup', (req, res) => {
    const { name, email, password } = req.body;

    if (users.find(u => u.email === email)) {
        return res.status(400).json({ message: 'Email already exists' });
    }

    const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password, // In real app, hash this!
        joined: new Date()
    };

    users.push(newUser);
    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json({ message: 'User created', user: userWithoutPassword });
});

app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json({ message: 'Login successful', user: userWithoutPassword });
});

app.post('/api/auth/forgot-password', (req, res) => {
    const { email } = req.body;
    const user = users.find(u => u.email === email);

    if (!user) {
        return res.status(404).json({ message: 'No account found with this email' });
    }

    // In a real app, send an email. For demo, we'll log it to console.
    console.log(`[AUTH] Password Reset Request for ${email}: Password is "${user.password}"`);
    res.json({ message: 'Password reset link sent to your email (Demo: Check server console)' });
});

// 1. Search History
app.get('/api/search/history', (req, res) => {
    res.json(searchHistory.slice(0, 10));
});

app.post('/api/search/history', (req, res) => {
    const { query, timestamp } = req.body;
    const newEntry = { id: Date.now().toString(), query, timestamp: timestamp || new Date() };
    searchHistory = [newEntry, ...searchHistory].slice(0, 50); // Keep last 50
    res.status(201).json(newEntry);
});

// 2. Expense Data (Save/Load)
app.get('/api/expenses', (req, res) => {
    res.json(userExpenses);
});

app.post('/api/expenses', (req, res) => {
    const { expenses, income } = req.body;
    userExpenses = { expenses, income, updatedAt: new Date() };
    res.status(200).json({ message: 'Saved successfully', data: userExpenses });
});

// 3. Health Check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', server: 'Gullak Backend', version: '1.0.0' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Gullak Backend running on http://localhost:${PORT}`);
});

// Optional: MongoDB Connection
if (process.env.MONGODB_URI) {
    mongoose.connect(process.env.MONGODB_URI)
        .then(() => console.log('Connected to MongoDB'))
        .catch(err => console.error('MongoDB connection error:', err));
} else {
    console.log('No MongoDB URI found, using in-memory storage.');
}
