import express from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import User from '../database/schema/user_schema.js'
import Role from '../database/schema/role_schema.js'

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

// Middleware to verify token
export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) {
    return res.status(401).json({ 
      success: false,
      message: 'No token provided' 
    })
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.userId = decoded.userId
    next()
  } catch (error) {
    res.status(401).json({ 
      success: false,
      message: 'Invalid token' 
    })
  }
}

// POST /api/auth/register - Register new user
router.post('/register', async (req, res) => {
  try {
    const { fullname, username, password, phone } = req.body

    // Validate required fields
    if (!fullname || !username || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Fullname, username, and password are required' 
      })
    }

    // Check if username already exists
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

    // Generate JWT token
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

// POST /api/auth/login - Login user
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body

    // Validate required fields
    if (!username || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Username and password are required' 
      })
    }

    // Find user by username
    const user = await User.findOne({ username }).populate('role', 'role_name')
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid username or password' 
      })
    }

    // Compare password with hashed password
    const passwordMatch = await bcrypt.compare(password, user.password_hash)
    if (!passwordMatch) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid username or password' 
      })
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '24h' })

    res.json({
      success: true,
      message: 'Login successful',
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
    console.error('Login error:', error)
    res.status(500).json({ 
      success: false,
      message: 'Login failed', 
      error: error.message 
    })
  }
})

// GET /api/auth/me - Get current user info (requires token)
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
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
    })
  }
})

// PUT /api/auth/me - Update current user info (requires token)
router.put('/me', verifyToken, async (req, res) => {
  try {
    const { fullname, phone } = req.body
    
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
        role: user.role
      }
    })
  } catch (error) {
    console.error('Update user error:', error)
    res.status(500).json({ 
      success: false,
      message: 'Failed to update user' 
    })
  }
})

// POST /api/auth/logout - Logout user (requires token)
router.post('/logout', verifyToken, (req, res) => {
  // Token is stored on client side, so logout just confirms the action
  res.json({ 
    success: true,
    message: 'Logged out successfully' 
  })
})

export default router
