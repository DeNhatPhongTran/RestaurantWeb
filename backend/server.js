import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './db.js';
import User from './models/User.js';
import bcrypt from 'bcryptjs';

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

// LOGIN ROUTE
app.post('/api/login', async (req, res) => {
  const { username, password, isGuest } = req.body;

  if (isGuest) {
    return res.json({ 
      _id: 'guest_id', 
      username: 'Guest',
      fullname: 'Guest', 
      role: 'guest' 
    });
  }

  const user = await User.findOne({ username });
  
if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user._id,
      customId: user.customId,
      fullname: user.fullname,
      username: user.username,
      role: user.role,
      phone: user.phone,
      state: user.state,
      avatar: user.avatar
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// PASSWORD RECOVERY STEP 1: Verify Identity
app.post('/api/verify-user', async (req, res) => {
  const { username, phone } = req.body;
  const user = await User.findOne({ username, phone });

  if (user) {
    res.json({ valid: true, userId: user._id });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// PASSWORD RECOVERY STEP 2: Reset Password
app.post('/api/reset-password', async (req, res) => {
  const { userId, newPassword } = req.body;
  
  const user = await User.findById(userId);
  if (user) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();
    res.json({ message: 'Password updated successfully' });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// CHANGE PASSWORD ROUTE (Authenticated)
app.post('/api/change-password', async (req, res) => {
  const { userId, oldPassword, newPassword } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 1. Check if Old Password matches DB hash
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect old password' });
    }

    // 2. Hash the New Password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    
    await user.save();
    
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));