import bcrypt from 'bcryptjs';
import User from '../models/user.models.js';
import { sendVerificationEmail } from '../utils/mailer.js';

function generateFourDigitCode() {
  // For development/testing purposes, always return 5555
  return '5555';
}

export const register = async (req, res) => {
  try {
    const { name, username, email, password } = req.body || {};
    if (!name || !username || !email || !password) {
      return res.status(400).json({ message: 'Name, username, email and password are required' });
    }

    const existing = await User.findOne({ $or: [ { email: email.toLowerCase() }, { username } ] });
    if (existing) {
      return res.status(409).json({ message: 'User with that email or username already exists' });
    }

    const code = generateFourDigitCode();
    const salt = await bcrypt.genSalt(10);
    const codeHash = await bcrypt.hash(code, salt);
    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    const user = await User.create({
      name,
      username,
      email: email.toLowerCase(),
      password,
      isVerified: false,
      verificationCodeHash: codeHash,
      verificationCodeExpiry: expiry,
    });

    try {
      await sendVerificationEmail(email, code);
    } catch (mailErr) {
      console.error('Email sending failed:', mailErr);
      // Even if email fails, keep the unverified user; client can request resend in the future
    }

    return res.status(201).json({ success: true, message: 'Verification code sent to email', email });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const verify = async (req, res) => {
  try {
    const { email, code } = req.body || {};
    if (!email || !code) {
      return res.status(400).json({ message: 'Email and code are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+verificationCodeHash +verificationCodeExpiry');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified === true) {
      return res.json({ success: true, message: 'Account already verified' });
    }

    if (!user.verificationCodeExpiry || user.verificationCodeExpiry.getTime() < Date.now()) {
      // Delete expired unverified account immediately
      await User.deleteOne({ _id: user._id });
      return res.status(400).json({ message: 'Verification code expired. Please register again.' });
    }

    const match = await bcrypt.compare(code, user.verificationCodeHash || '');
    if (!match) {
      return res.status(400).json({ message: 'Invalid verification code' });
    }

    user.isVerified = true;
    user.verificationCodeHash = undefined;
    user.verificationCodeExpiry = undefined;
    await user.save();

    return res.json({ success: true, message: 'Account verified successfully' });
  } catch (err) {
    console.error('Verify error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


