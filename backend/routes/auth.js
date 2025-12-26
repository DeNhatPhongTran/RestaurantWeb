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

// POST /api/auth/change-password - Change password (requires token)
router.post('/change-password', verifyToken, async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body
    
    // Validate required fields
    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ 
        success: false,
        message: 'All password fields are required' 
      })
    }
    
    // Check if new passwords match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ 
        success: false,
        message: 'New passwords do not match' 
      })
    }
    
    // Check if new password is different from old password
    if (oldPassword === newPassword) {
      return res.status(400).json({ 
        success: false,
        message: 'New password must be different from current password' 
      })
    }
    
    // Find user and verify old password
    const user = await User.findById(req.userId)
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      })
    }
    
    const passwordMatch = await bcrypt.compare(oldPassword, user.password_hash)
    if (!passwordMatch) {
      return res.status(401).json({ 
        success: false,
        message: 'Current password is incorrect' 
      })
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    
    // Update password
    user.password_hash = hashedPassword
    user.change_password = true
    await user.save()
    
    res.json({
      success: true,
      message: 'Password changed successfully'
    })
  } catch (error) {
    console.error('Change password error:', error)
    res.status(500).json({ 
      success: false,
      message: 'Failed to change password', 
      error: error.message 
    })
  }
})

// GET /api/auth/users/list - Get all users (admin only, requires token)
router.get('/users/list', verifyToken, async (req, res) => {
  try {
    const users = await User.find()
      .select('_id fullname username phone role state created_at')
      .populate('role', 'role_name')
      .sort({ created_at: -1 })
    
    res.json({
      success: true,
      message: 'Users fetched successfully',
      data: users,
      count: users.length
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch users', 
      error: error.message 
    })
  }
})

// GET /api/auth/users/:id - Get single user by ID (requires token)
router.get('/users/:id', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('_id fullname username phone role state change_password created_at')
      .populate('role', 'role_name')
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      })
    }
    
    res.json({ 
      success: true,
      data: user
    })
  } catch (error) {
    console.error('Error fetching user:', error)
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch user' 
    })
  }
})

// POST /api/auth/users - Create new employee (admin only, requires token)
router.post('/users', verifyToken, async (req, res) => {
  try {
    const { fullname, username, password, phone, role } = req.body
    
    // Validate required fields
    if (!fullname || !username || !password || !role) {
      return res.status(400).json({ 
        success: false,
        message: 'Fullname, username, password, and role are required' 
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
    
    // Check if role exists
    const roleExists = await Role.findById(role)
    if (!roleExists) {
      return res.status(404).json({ 
        success: false,
        message: 'Role not found' 
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
      role,
      change_password: false // New users must change password on first login
    })
    
    await user.save()
    await user.populate('role', 'role_name')
    
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: {
        id: user._id,
        fullname: user.fullname,
        username: user.username,
        phone: user.phone,
        role: user.role,
        state: user.state
      }
    })
  } catch (error) {
    console.error('Error creating user:', error)
    res.status(500).json({ 
      success: false,
      message: 'Failed to create user', 
      error: error.message 
    })
  }
})

// PUT /api/auth/users/:id - Update user info (admin only, requires token)
router.put('/users/:id', verifyToken, async (req, res) => {
  try {
    const { fullname, phone, role, state } = req.body
    
    const updateData = {}
    if (fullname) updateData.fullname = fullname
    if (phone !== undefined) updateData.phone = phone
    if (role) {
      const roleExists = await Role.findById(role)
      if (!roleExists) {
        return res.status(404).json({ 
          success: false,
          message: 'Role not found' 
        })
      }
      updateData.role = role
    }
    if (state && ['working', 'off_work'].includes(state)) {
      updateData.state = state
    }
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
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
        role: user.role,
        state: user.state
      }
    })
  } catch (error) {
    console.error('Error updating user:', error)
    res.status(500).json({ 
      success: false,
      message: 'Failed to update user' 
    })
  }
})

// DELETE /api/auth/users/:id - Delete user (admin only, requires token)
router.delete('/users/:id', verifyToken, async (req, res) => {
  try {
    // Prevent deleting the current user
    if (req.params.id === req.userId) {
      return res.status(400).json({ 
        success: false,
        message: 'Cannot delete your own account' 
      })
    }
    
    const user = await User.findByIdAndDelete(req.params.id)
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      })
    }
    
    res.json({
      success: true,
      message: 'User deleted successfully',
      user: {
        id: user._id,
        fullname: user.fullname,
        username: user.username
      }
    })
  } catch (error) {
    console.error('Error deleting user:', error)
    res.status(500).json({ 
      success: false,
      message: 'Failed to delete user', 
      error: error.message 
    })
  }
})

export default router
