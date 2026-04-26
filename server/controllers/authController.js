const User = require('../models/User');
const OTP = require('../models/OTP');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendOTPEmail } = require('../utils/email');

// Generate 6-digit OTP (always string)
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Generate JWT Token
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '30d' });
};



// ================= REGISTER =================
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = await User.create({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            role: 'user',
            isVerified: false
        });

        const otp = generateOTP();

        // 🔥 Ensure only one OTP exists
        await OTP.findOneAndDelete({ email, action: 'account_verification' });

        await OTP.create({
            email,
            otp,
            action: 'account_verification',
            createdAt: new Date()
        });

        await sendOTPEmail(email, otp, 'account_verification');

        res.status(201).json({
            message: 'OTP sent to email. Please verify.',
            email: user.email
        });

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};



// ================= LOGIN =================
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // If not verified → send OTP again
        if (!user.isVerified && user.role !== 'admin') {
            const otp = generateOTP();

            await OTP.findOneAndDelete({ email: user.email, action: 'account_verification' });

            await OTP.create({
                email: user.email,
                otp,
                action: 'account_verification',
                createdAt: new Date()
            });

            await sendOTPEmail(user.email, otp, 'account_verification');

            return res.status(403).json({
                message: 'Account not verified',
                needsVerification: true,
                email: user.email
            });
        }

        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user.id, user.role)
        });

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};



// ================= VERIFY OTP =================
exports.verifyOTP = async (req, res) => {
    try {
        let { email, otp } = req.body;

        otp = otp.toString(); // 🔥 fix type issue

        const validOTP = await OTP.findOne({
            email,
            otp,
            action: 'account_verification'
        });

        if (!validOTP) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        // 🔥 Expiry check (5 minutes)
        const diff = Date.now() - new Date(validOTP.createdAt).getTime();
        const fiveMinutes = 5 * 60 * 1000;

        if (diff > fiveMinutes) {
            await OTP.deleteOne({ _id: validOTP._id });
            return res.status(400).json({ message: 'OTP expired' });
        }

        const user = await User.findOneAndUpdate(
            { email },
            { isVerified: true },
            { new: true }
        );

        // Delete OTP after success
        await OTP.deleteOne({ _id: validOTP._id });

        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user.id, user.role)
        });

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};