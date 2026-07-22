import User from '../models/User.js';
import AuditLog from '../models/AuditLog.js';
import Ticket from '../models/Ticket.js';
import Setting from '../models/Setting.js';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { sendOtpEmail } from '../utils/emailService.js';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

export const login = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(500).json({ 
        success: false, 
        message: 'Database Error: MONGO_URI is missing or database is not connected on Render. Please check MONGO_URI environment variable on Render.' 
      });
    }

    const email = req.body.email?.toLowerCase();
    const { password } = req.body;
    let user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user.password !== password) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    if (user.status === 'blocked') return res.status(403).json({ success: false, message: 'Account is blocked. Contact support.' });
    
    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name, role: user.role, permissions: user.permissions || [] },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
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
    } else {
      user = new User({ name, email, password, phone });
    }
    
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60000);
    
    await user.save();
    
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
    
    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name, role: user.role, permissions: user.permissions || [] },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
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
    
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60000);
    await user.save();
    
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
    const userId = req.headers['x-user-id'];
    const email = req.body.email?.toLowerCase();
    const { password } = req.body;

    let user;
    if (userId) {
      user = await User.findById(userId);
    } else if (email) {
      user = await User.findOne({ email });
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

    const newAccessToken = jwt.sign(
      { id: user._id, email: user.email, role: user.role, permissions: user.permissions || [] },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({ success: true, data: { accessToken: newAccessToken } });
  } catch (err) {
    res.status(401).json({ success: false, message: 'Invalid refresh token' });
  }
};

// ==========================================
// ADMIN CONTROLLERS (Auth Service)
// ==========================================

export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, role, status } = req.query;
    const query = {};

    if (role) query.role = role;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password -otp -otpExpires')
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      users,
      pagination: { total, page: Number(page), pages: Math.ceil(total / limit) }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select('-password -otp -otpExpires');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const adminId = req.headers['x-user-id'];
    const { id } = req.params;
    const { role, permissions } = req.body;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const oldRole = user.role;
    user.role = role || user.role;
    if (Array.isArray(permissions)) {
      user.permissions = permissions;
    }
    await user.save();

    // Audit Event
    await AuditLog.create({
      adminId,
      action: 'UPDATE_USER_ROLE',
      targetEntity: 'User',
      targetId: id,
      details: { oldRole, newRole: user.role, permissions: user.permissions }
    });

    res.json({ success: true, message: 'User role updated successfully', user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const toggleUserStatus = async (req, res) => {
  try {
    const adminId = req.headers['x-user-id'];
    const { id } = req.params;
    const { status, reason } = req.body;

    if (!['active', 'blocked', 'suspended'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const oldStatus = user.status;
    user.status = status;
    await user.save();

    // Audit Event
    await AuditLog.create({
      adminId,
      action: 'TOGGLE_USER_STATUS',
      targetEntity: 'User',
      targetId: id,
      details: { oldStatus, newStatus: status, reason: reason || 'N/A' }
    });

    res.json({ success: true, message: `User status changed to ${status}`, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAuditLogs = async (req, res) => {
  try {
    const { page = 1, limit = 50, action } = req.query;
    const query = {};
    if (action) query.action = action;

    const logs = await AuditLog.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await AuditLog.countDocuments(query);
    res.json({
      success: true,
      logs,
      pagination: { total, page: Number(page), pages: Math.ceil(total / limit) }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAllTicketsAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, priority } = req.query;
    const query = {};
    if (status) query.status = status;
    if (priority) query.priority = priority;

    const tickets = await Ticket.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ updatedAt: -1 });

    const total = await Ticket.countDocuments(query);
    res.json({
      success: true,
      tickets,
      pagination: { total, page: Number(page), pages: Math.ceil(total / limit) }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const replyToTicketAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, status, priority } = req.body || {};
    const adminId = req.headers['x-user-id'];

    const ticket = await Ticket.findById(id);
    if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });

    if (text) {
      ticket.messages.push({
        sender: 'admin',
        text,
        timestamp: new Date()
      });
    }

    if (status) ticket.status = status;
    if (priority) ticket.priority = priority;

    await ticket.save();

    // Audit Event
    await AuditLog.create({
      adminId,
      action: 'REPLY_TICKET',
      targetEntity: 'Ticket',
      targetId: id,
      details: { text: text ? text.slice(0, 100) : '', status, priority }
    });

    res.json({ success: true, message: 'Reply sent and ticket updated', ticket });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getStoreSettingsAdmin = async (req, res) => {
  try {
    const settings = await Setting.find({});
    res.json({ success: true, settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateStoreSettingAdmin = async (req, res) => {
  try {
    const adminId = req.headers['x-user-id'];
    const { key, value } = req.body || {};

    if (!key) return res.status(400).json({ success: false, message: 'Key is required' });

    const setting = await Setting.findOneAndUpdate(
      { key },
      { value },
      { new: true, upsert: true }
    );

    // Audit Event
    await AuditLog.create({
      adminId,
      action: 'UPDATE_SETTING',
      targetEntity: 'Setting',
      targetId: setting._id,
      details: { key, value }
    });

    res.json({ success: true, message: `Setting '${key}' updated successfully`, setting });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getOrCreateMyTicket = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    if (!userId) return res.status(401).json({ success: false, message: 'User identity missing' });

    let ticket = await Ticket.findOne({ userId });
    if (!ticket) {
      ticket = new Ticket({
        userId,
        title: 'Customer Helpdesk Chat',
        status: 'open',
        priority: 'medium',
        messages: [{
          sender: 'admin',
          text: 'Hello! How can we assist you today?',
          timestamp: new Date()
        }]
      });
      await ticket.save();
    }
    res.json({ success: true, ticket });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const replyToMyTicket = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    console.log('[DEBUG replyToMyTicket] Headers:', req.headers);
    console.log('[DEBUG replyToMyTicket] Body:', req.body);
    const { text } = req.body || {};
    if (!userId) return res.status(401).json({ success: false, message: 'User identity missing' });
    if (!text) return res.status(400).json({ success: false, message: 'Message text is required' });

    let ticket = await Ticket.findOne({ userId });
    if (!ticket) {
      ticket = new Ticket({
        userId,
        title: 'Customer Helpdesk Chat',
        status: 'open',
        priority: 'medium',
        messages: [{
          sender: 'admin',
          text: 'Hello! How can we assist you today?',
          timestamp: new Date(Date.now() - 1000) // 1 second in the past so order is correct
        }, {
          sender: 'customer',
          text,
          timestamp: new Date()
        }]
      });
    } else {
      ticket.messages.push({
        sender: 'customer',
        text,
        timestamp: new Date()
      });
      ticket.status = 'open'; // Auto reopen when customer sends a message
    }

    await ticket.save();
    res.json({ success: true, ticket });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getPublicSettings = async (req, res) => {
  try {
    const keys = ['cod_enabled', 'free_shipping_limit', 'store_name', 'support_email', 'support_phone'];
    const settings = await Setting.find({ key: { $in: keys } });
    res.json({ success: true, settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

