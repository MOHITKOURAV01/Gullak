const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const DB_FILE = path.join(__dirname, 'db.json');

// --- User Schema for MongoDB (Mirror of server.js) ---
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    joined: { type: Date, default: Date.now },
    twoFactorEnabled: { type: Boolean, default: false },
    twoFactorSecret: { type: String, default: null },
    resetOtp: { type: String, default: null },
    resetOtpExpires: { type: Date, default: null }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

// --- Email Transporter ---
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Helper: Read DB
const readData = () => {
    try {
        if (!fs.existsSync(DB_FILE)) return { users: [] };
        return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    } catch (err) {
        return { users: [] };
    }
};

// Helper: Write DB
const writeData = (data) => {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

// 1. Forgot Password - Send OTP
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    try {
        if (process.env.MONGODB_URI) {
            // MongoDB Path
            const user = await User.findOne({ email });
            if (!user) return res.status(404).json({ message: 'User not found with this email' });

            user.resetOtp = otp;
            user.resetOtpExpires = Date.now() + 10 * 60000;
            await user.save();
        } else {
            // Local JSON Path
            const db = readData();
            const user = db.users.find(u => u.email === email);
            if (!user) return res.status(404).json({ message: 'User not found with this email' });

            user.resetOtp = otp;
            user.resetOtpExpires = Date.now() + 10 * 60000;
            writeData(db);
        }

        // Send Email
        const mailOptions = {
            from: `"Gullak Support" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: '🔐 Your Gullak Password Reset OTP',
            html: `
                <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #FFD700;">Gullak Password Reset</h2>
                    <p>Hello,</p>
                    <p>Use the following OTP to reset your password:</p>
                    <div style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #FFD700; margin: 20px 0;">
                        ${otp}
                    </div>
                    <p>Valid for 10 minutes.</p>
                </div>
            `
        };

        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            throw new Error("Email credentials missing");
        }
        await transporter.sendMail(mailOptions);
        res.json({ message: 'OTP sent to your email successfully.' });

    } catch (err) {
        console.error("Forgot Password Error:", err);
        res.status(500).json({ message: 'Error processing request', error: err.message });
    }
});

// 2. Verify OTP & Reset
router.post('/verify-otp', async (req, res) => {
    const { email, otp, newPassword } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        if (process.env.MONGODB_URI) {
            const user = await User.findOne({ email });
            if (!user || user.resetOtp !== otp || Date.now() > user.resetOtpExpires) {
                return res.status(400).json({ message: 'Invalid or expired OTP' });
            }
            user.password = hashedPassword;
            user.resetOtp = null;
            user.resetOtpExpires = null;
            await user.save();
        } else {
            const db = readData();
            const user = db.users.find(u => u.email === email);
            if (!user || user.resetOtp !== otp || Date.now() > user.resetOtpExpires) {
                return res.status(400).json({ message: 'Invalid or expired OTP' });
            }
            user.password = hashedPassword;
            delete user.resetOtp;
            delete user.resetOtpExpires;
            writeData(db);
        }
        res.json({ message: 'Password reset successful!' });
    } catch (err) {
        res.status(500).json({ message: 'Reset error' });
    }
});

module.exports = router;
