const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const DB_FILE = path.join(__dirname, 'db.json');

// --- Helper: Get Transporter ---
// We create it inside the route or helper to ensure it uses the latest process.env
const getTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
};

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
    console.log("[FORGOT_PASSWORD] Request received for:", req.body.email);
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    try {
        let user;
        let isMongo = false;

        if (process.env.MONGODB_URI) {
            isMongo = true;
            const User = mongoose.model('User');
            user = await User.findOne({ email });
        } else {
            const db = readData();
            user = db.users.find(u => u.email === email);
        }

        if (!user) {
            return res.status(404).json({ message: 'No account found with this email. Please check your spelling or register first.' });
        }

        // Store OTP
        if (isMongo) {
            user.resetOtp = otp;
            user.resetOtpExpires = Date.now() + 10 * 60000;
            await user.save();
        } else {
            const db = readData();
            const localUser = db.users.find(u => u.email === email);
            localUser.resetOtp = otp;
            localUser.resetOtpExpires = Date.now() + 10 * 60000;
            writeData(db);
        }

        // Send Email
        const transporter = getTransporter();
        const mailOptions = {
            from: `"Gullak Support" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: '🔐 Your Gullak Password Reset OTP',
            html: `
                <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 500px; margin: auto;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <h2 style="color: #FFD700; margin: 0;">Gullak</h2>
                        <p style="color: #888; margin: 5px 0;">Simple. Smart. Savings.</p>
                    </div>
                    <div style="background: #fafafa; padding: 20px; border-radius: 10px; text-align: center;">
                        <p style="margin-top: 0;">You requested to reset your password. Use the code below:</p>
                        <div style="font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #FFD700; margin: 20px 0; font-family: monospace;">
                            ${otp}
                        </div>
                        <p style="font-size: 13px; color: #666;">This code is valid for 10 minutes only.</p>
                    </div>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                    <p style="font-size: 11px; color: #aaa; text-align: center;">If you didn't request this, please ignore this email.</p>
                </div>
            `
        };

        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            throw new Error("SMTP Credentials (EMAIL_USER/PASS) missing in Server Environment.");
        }

        await transporter.sendMail(mailOptions);
        res.json({ message: 'Success! OTP sent to your email.' });

    } catch (err) {
        console.error("Forgot Password Fatal Error:", err);
        res.status(500).json({
            message: `Server Error: ${err.message}`,
            details: "Please check if your EMAIL_USER and EMAIL_PASS are correctly set in Render dashboard."
        });
    }
});

// 2. Verify OTP & Reset
router.post('/verify-otp', async (req, res) => {
    const { email, otp, newPassword } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        if (process.env.MONGODB_URI) {
            const User = mongoose.model('User');
            const user = await User.findOne({ email });
            if (!user || user.resetOtp !== otp || Date.now() > user.resetOtpExpires) {
                return res.status(400).json({ message: 'Invalid or expired OTP. Please request a new one.' });
            }
            user.password = hashedPassword;
            user.resetOtp = null;
            user.resetOtpExpires = null;
            await user.save();
        } else {
            const db = readData();
            const user = db.users.find(u => u.email === email);
            if (!user || user.resetOtp !== otp || Date.now() > user.resetOtpExpires) {
                return res.status(400).json({ message: 'Invalid or expired OTP. Please request a new one.' });
            }
            user.password = hashedPassword;
            delete user.resetOtp;
            delete user.resetOtpExpires;
            writeData(db);
        }
        res.json({ message: 'Victory! Password updated. Redirecting to login...' });
    } catch (err) {
        res.status(500).json({ message: `Reset failed: ${err.message}` });
    }
});

module.exports = router;
