import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { sendOtpEmail } from '../utils/emailService.js';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

export const login = async (req, res) => {
  try {
    const email = req.body.email?.toLowerCase();
    const { password } = req.body;
    let user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user.password !== password) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    
    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, token, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const register = async (req, res) => {
  try {
    const email = req.body.email?.toLowerCase();
    const { name, password, phone } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      if (user.isVerified) return res.status(400).json({ success: false, message: 'Email already exists' });
      // If not verified, we can resend OTP (update existing unverified user)
    } else {
      user = new User({ name, email, password, phone });
    }
    
    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60000); // 10 minutes
    
    await user.save();
    
    // Send email asynchronously but await its result to confirm
    const emailSent = await sendOtpEmail(email, otp);
    if (!emailSent) {
      return res.status(500).json({ success: false, message: 'Failed to send OTP email. Please try again.' });
    }
    
    res.json({ success: true, message: 'OTP sent successfully', userId: user._id });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const email = req.body.email?.toLowerCase();
    const { code } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user.otp !== code) return res.status(400).json({ success: false, message: 'Invalid OTP' });
    if (user.otpExpires < new Date()) return res.status(400).json({ success: false, message: 'OTP expired' });
    
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();
    
    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, token, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const email = req.body.email?.toLowerCase();
    let user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    
    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60000); // 10 minutes
    await user.save();
    
    // Send email asynchronously but await its result
    const emailSent = await sendOtpEmail(email, otp);
    if (!emailSent) {
      return res.status(500).json({ success: false, message: 'Failed to send OTP email. Please try again.' });
    }
    
    res.json({ success: true, message: 'Password reset OTP sent' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    // If the user went through verifyOtp, they have a valid token
    const userId = req.headers['x-user-id'];
    const email = req.body.email?.toLowerCase(); // fallback to email if not protected, but we will protect it
    const { password } = req.body;

    let user;
    if (userId) {
      user = await User.findById(userId);
    } else if (email) {
      user = await User.findOne({ email }); // Fallback if someone didn't protect it
    }
    
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    
    user.password = password;
    await user.save();
    
    res.json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getMe = async (req, res) => {
  try {
    // Gateway verifies JWT and passes x-user-id header
    const userId = req.headers['x-user-id'];
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
    
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
    
    const user = await User.findByIdAndUpdate(userId, req.body, { new: true });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const addAddress = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
    
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const newAddress = req.body;
    if (newAddress.isDefault) {
      user.addresses.forEach(a => a.isDefault = false);
    }
    user.addresses.push(newAddress);
    await user.save();
    
    res.json({ success: true, addresses: user.addresses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateAddress = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
    
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const { addressId } = req.params;
    const address = user.addresses.id(addressId);
    if (!address) return res.status(404).json({ success: false, message: 'Address not found' });
    
    const updates = req.body;
    if (updates.isDefault) {
      user.addresses.forEach(a => a.isDefault = false);
    }
    
    address.set(updates);
    await user.save();
    
    res.json({ success: true, addresses: user.addresses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const removeAddress = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
    
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const { addressId } = req.params;
    user.addresses.pull(addressId);
    await user.save();
    
    res.json({ success: true, addresses: user.addresses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const addToWishlist = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
    
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const { productId } = req.body;
    if (!user.wishlist.includes(productId)) {
      user.wishlist.push(productId);
      await user.save();
    }
    
    res.json({ success: true, wishlist: user.wishlist });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
    
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const { productId } = req.params;
    user.wishlist = user.wishlist.filter(id => id !== productId);
    await user.save();
    
    res.json({ success: true, wishlist: user.wishlist });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ success: false, message: 'No refresh token' });
    
    const decoded = jwt.verify(refreshToken, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const newAccessToken = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, data: { accessToken: newAccessToken } });
  } catch (err) {
    res.status(401).json({ success: false, message: 'Invalid refresh token' });
  }
};
