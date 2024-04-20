const express = require('express');
const User = require('../../models/User');
const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;


const twilioClient = twilio(accountSid, authToken);

// Function to generate OTP
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Controller to register a new user
const RegisterUser = async (req, res) => {
    try {

        const { phone } = req.body;
        // Check if phone number is already registered
        const existingUser = await User.findOne({ phone: phone });

        if (existingUser) {
            return res.status(400).json({ message: 'registered' });
        }

        // Generate OTP
        const otp = generateOTP();


        // Send OTP via Twilio
        await twilioClient.messages.create({
            body: `Your OTP for registration: ${otp}`,
            from: twilioPhoneNumber,
            to: phone
        });
        // Save user with OTP to the database
        const newUser = new User({ phone, otp });
        await newUser.save();

        // Set a timeout to delete the user if OTP is not verified within 2 minutes
        setTimeout(async () => {
            const userToDelete = await User.findOne({ phone: phone, otp: otp });
            if (userToDelete && !userToDelete.verified) {
                await User.deleteOne({ phone: phone, otp: otp });
            }
        }, 2 * 60 * 1000); // 2 minutes in milliseconds

        res.status(200).json({ message: 'success' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'failed' });
    }
};

// Controller to verify OTP and update user details
const VerifyOtp = async (req, res) => {
    try {
        const { phone, otp } = req.body;

        // Find user by phone number and OTP
        const user = await User.findOne({ phone: phone, otp: otp });
        if (!user) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        // Mark user as verified and clear OTP
        user.verified = true;
        user.otp = null;
        await user.save();

        res.json({ message: 'success' });
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ message: 'Failed to verify OTP' });
    }
};

const ResendOTP = async (req, res) => {
    try {
        const { phone } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ phone: phone });

        if (!existingUser) {
            return res.status(400).json({ message: 'not_registered' });
        }

        // Generate new OTP
        const otp = generateOTP();

        // Resend OTP via Twilio
        await sendOTP(phone, otp);

        // Update OTP in the database
        existingUser.otp = otp;
        await existingUser.save();

        res.status(200).json({ message: 'otp_sent' });
    } catch (error) {
        console.error('Error resending OTP:', error);
        res.status(500).json({ message: 'failed' });
    }
};

const sendOTP = async (phone, otp) => {
    // Send OTP via Twilio
    await twilioClient.messages.create({
        body: `Your OTP for registration: ${otp}`,
        from: twilioPhoneNumber,
        to: phone
    });
};

const SaveUserData = async (req, res) => {
    try {
        const { phone, name, dob, city, gender, language } = req.body;
        const user = await User.findOne({ phone: phone });
        if (!user || !user.verified) {
            return res.status(400).json({ message: 'User not found or OTP not verified' });
        }
        user.name = name;
        user.dob = dob;
        user.city = city;
        user.gender = gender;
        user.language = language;
        await user.save();

        res.json({ message: 'success' });
    } catch (error) {
        console.error('Error saving user data:', error);
        res.status(500).json({ message: 'Failed to save user data' });
    }
};

const LoginUser = async (req, res) => {
    try {
        const { phone } = req.body;

        // Check if user with the provided phone number exists
        const existingUser = await User.findOne({ phone });
        if (!existingUser) {
            return res.status(404).json({ message: 'not_registered' });
        }

        // Generate OTP
        const otp = generateOTP();

        // Save OTP to the user in the database
        existingUser.otp = otp;
        await existingUser.save();

        // Send OTP via Twilio
        await twilioClient.messages.create({
            body: `Your OTP for login: ${otp}`,
            from: twilioPhoneNumber,
            to: phone
        });

        res.json({ message: 'success' });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: 'Failed to log in user' });
    }
};

// Controller function to verify OTP and complete login
const VerifyLogin = async (req, res) => {
    try {
        const { phone, otp } = req.body;

        // Find user by phone number and OTP
        const user = await User.findOne({ phone, otp });
        if (!user) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        // Clear OTP after successful login
        user.otp = null;
        await user.save();

        res.json({ message: 'success' });
    } catch (error) {
        console.error('Error verifying login OTP:', error);
        res.status(500).json({ message: 'Failed to verify login OTP' });
    }
};

module.exports = { RegisterUser, VerifyOtp, ResendOTP, SaveUserData, LoginUser, VerifyLogin };
