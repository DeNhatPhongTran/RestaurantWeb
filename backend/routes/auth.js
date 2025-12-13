import express from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs';
import User from '../database/schema/user_schema.js'
import Role from '../database/schema/role_schema.js'

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

// Middleware to verify token
export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) {
    return res.status(401).json({ message: 'No token provided' })
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.userId = decoded.userId
    next()
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' })
  }
}

// Register
router.post('/register', async (req, res) => {
  try {
    const { fullname, username, password, phone } = req.body

    if (!fullname || !username || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Fullname, username, and password are required' 
      })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ username })
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        message: 'Username already exists' 
      })
    }

    // Get default waiter role
    const waiterRole = await Role.findOne({ role_name: 'waiter' })
    if (!waiterRole) {
      return res.status(500).json({ 
        success: false,
        message: 'Waiter role not found' 
      })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new user
    const user = new User({
      fullname,
      username,
      password_hash: hashedPassword,
      phone: phone || '',
      role: waiterRole._id
    })

    await user.save()
    await user.populate('role', 'role_name')

    // Generate token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '24h' })

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: user._id,
        fullname: user.fullname,
        username: user.username,
        phone: user.phone,
        role: user.role
      },
      token
    })
  } catch (error) {
    console.error('Register error:', error)
    res.status(500).json({ 
      success: false,
      message: 'Registration failed', 
      error: error.message 
    })
  }
})

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Username and password are required' 
      })
    }

    // Find user
    const user = await User.findOne({ username }).populate('role', 'role_name')
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid username or password' 
      })
    }

    // Check password
    const passwordMatch = await bcrypt.compare(password, user.password_hash)
    if (!passwordMatch) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid username or password' 
      })
    }

    // Generate token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '24h' })

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        fullname: user.fullname,
        username: user.username,
        phone: user.phone,
      .select('-password_hash')
      .populate('role', 'role_name')
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      })
    }
    
    res.json({ 
      success: true,
      user: {
        id: user._id,
        fullname: user.fullname,
        username: user.username,
        phone: user.phone,
        role: user.role
      }
    })
  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({ 
      success: false,
      message: 'Failed to get user' 
   
      success: false,
      message: 'Login failed', 
      error: error.message 
    })
  }
})fullname, phone } = req.body
    const user = await User.findByIdAndUpdate(
      req.userId,
      { fullname, phone },
      { new: true, runValidators: true }
    )
      .select('-password_hash')
      .populate('role', 'role_name')

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      })
    }

    res.json({
      success: true,
      message: 'User updated successfully',
      user: {
        id: user._id,
        fullname: user.fullname,
        username: user.username,
        phone: user.phone,
        role:
    success: true,
    message: 'Logged out successfully' 
 
      }
    })
  } catch (error) {
    console.error('Update user error:', error)
    res.status(500).json({ 
      success: false,
      message: 'Failed to update user' 
   
  try {
    const { name, phone } = req.body
    const user = await User.findByIdAndUpdate(
      req.userId,
      { name, phone },
      { new: true }
    ).select('-password')

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json({
      message: 'User updated successfully',
      user
    })
  } catch (error) {
    console.error('Update user error:', error)
    res.status(500).json({ message: 'Failed to update user' })
  }
})

// Logout
router.post('/logout', verifyToken, (req, res) => {
  // Token is stored on client, so logout just confirms the action
  res.json({ message: 'Logged out successfully' })
})

export default router
