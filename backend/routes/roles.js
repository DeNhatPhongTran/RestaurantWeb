import express from 'express'
import Role from '../database/schema/role_schema.js'
import User from '../database/schema/user_schema.js'
import { verifyToken } from './auth.js'

const router = express.Router()

// GET /api/roles/list - Get all roles
router.get('/list', async (req, res) => {
  try {
    const roles = await Role.find()
      .select('_id role_name')
      .sort({ role_name: 1 })
    
    res.json({
      success: true,
      message: 'Roles fetched successfully',
      data: roles,
      count: roles.length
    })
  } catch (error) {
    console.error('Error fetching roles:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch roles',
      error: error.message
    })
  }
})

// GET /api/roles/:id - Get single role by ID
router.get('/:id', async (req, res) => {
  try {
    const role = await Role.findById(req.params.id)
      .select('_id role_name')
    
    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      })
    }
    
    // Get users with this role
    const users = await User.find({ role: req.params.id })
      .select('_id fullname username')
      .count()
    
    res.json({
      success: true,
      message: 'Role fetched successfully',
      data: role,
      userCount: users
    })
  } catch (error) {
    console.error('Error fetching role:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch role',
      error: error.message
    })
  }
})

// GET /api/roles/:id/users - Get all users with specific role
router.get('/:id/users', async (req, res) => {
  try {
    const role = await Role.findById(req.params.id)
    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      })
    }
    
    const users = await User.find({ role: req.params.id })
      .select('_id fullname username phone state created_at')
      .sort({ fullname: 1 })
    
    res.json({
      success: true,
      message: 'Users fetched successfully',
      role: role.role_name,
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

// POST /api/roles - Create new role (admin only)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { role_name } = req.body
    
    // Validate required fields
    if (!role_name) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        error: 'role_name is required'
      })
    }
    
    // Check if role already exists
    const existingRole = await Role.findOne({ role_name })
    if (existingRole) {
      return res.status(400).json({
        success: false,
        message: 'Role name already exists'
      })
    }
    
    const newRole = new Role({ role_name })
    await newRole.save()
    
    res.status(201).json({
      success: true,
      message: 'Role created successfully',
      data: newRole
    })
  } catch (error) {
    console.error('Error creating role:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to create role',
      error: error.message
    })
  }
})

// PUT /api/roles/:id - Update role (admin only)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { role_name } = req.body
    
    if (!role_name) {
      return res.status(400).json({
        success: false,
        message: 'role_name is required'
      })
    }
    
    // Check if new role_name already exists
    const existingRole = await Role.findOne({ 
      role_name, 
      _id: { $ne: req.params.id } 
    })
    if (existingRole) {
      return res.status(400).json({
        success: false,
        message: 'Role name already exists'
      })
    }
    
    const role = await Role.findByIdAndUpdate(
      req.params.id,
      { role_name },
      { new: true, runValidators: true }
    )
    
    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      })
    }
    
    res.json({
      success: true,
      message: 'Role updated successfully',
      data: role
    })
  } catch (error) {
    console.error('Error updating role:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update role',
      error: error.message
    })
  }
})

// DELETE /api/roles/:id - Delete role (admin only)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    // Check if any users have this role
    const usersWithRole = await User.find({ role: req.params.id }).count()
    if (usersWithRole > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete role. ${usersWithRole} user(s) assigned to this role.`
      })
    }
    
    const role = await Role.findByIdAndDelete(req.params.id)
    
    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      })
    }
    
    res.json({
      success: true,
      message: 'Role deleted successfully',
      data: role
    })
  } catch (error) {
    console.error('Error deleting role:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to delete role',
      error: error.message
    })
  }
})

export default router
