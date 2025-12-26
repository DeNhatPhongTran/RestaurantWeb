import express from 'express'
import Table from '../database/schema/table_schema.js'
import { verifyToken } from './auth.js'

const router = express.Router()

// GET /api/tables/list - Get all tables
router.get('/list', async (req, res) => {
  try {
    const tables = await Table.find()
      .select('_id name capacity currentStatus')
      .sort({ name: 1 })
    
    res.json({
      success: true,
      message: 'Tables fetched successfully',
      data: tables,
      count: tables.length
    })
  } catch (error) {
    console.error('Error fetching tables:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tables',
      error: error.message
    })
  }
})

// GET /api/tables/:id - Get single table by ID
router.get('/:id', async (req, res) => {
  try {
    const table = await Table.findById(req.params.id)
      .select('_id name capacity currentStatus')
    
    if (!table) {
      return res.status(404).json({
        success: false,
        message: 'Table not found'
      })
    }
    
    res.json({
      success: true,
      message: 'Table fetched successfully',
      data: table
    })
  } catch (error) {
    console.error('Error fetching table:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch table',
      error: error.message
    })
  }
})

// GET /api/tables/by-status/:status - Get tables by status (empty, serving)
router.get('/by-status/:status', async (req, res) => {
  try {
    const { status } = req.params
    
    if (!['empty', 'serving'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be "empty" or "serving"'
      })
    }
    
    const tables = await Table.find({ currentStatus: status })
      .select('_id name capacity currentStatus')
      .sort({ name: 1 })
    
    res.json({
      success: true,
      message: `Tables with status "${status}" fetched successfully`,
      data: tables,
      count: tables.length
    })
  } catch (error) {
    console.error('Error fetching tables by status:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tables',
      error: error.message
    })
  }
})

// POST /api/tables - Create new table
router.post('/', verifyToken, async (req, res) => {
  try {
    const { name, capacity } = req.body
    
    // Validate required fields
    if (!name || !capacity) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        error: 'Name and capacity are required'
      })
    }
    
    // Check if table name already exists
    const existingTable = await Table.findOne({ name })
    if (existingTable) {
      return res.status(400).json({
        success: false,
        message: 'Table name already exists'
      })
    }
    
    const newTable = new Table({
      name,
      capacity,
      currentStatus: 'empty'
    })
    
    await newTable.save()
    
    res.status(201).json({
      success: true,
      message: 'Table created successfully',
      data: newTable
    })
  } catch (error) {
    console.error('Error creating table:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to create table',
      error: error.message
    })
  }
})

// PUT /api/tables/:id - Update table
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { name, capacity, currentStatus } = req.body
    
    // Check if new name already exists (if name is being updated)
    if (name) {
      const existingTable = await Table.findOne({ name, _id: { $ne: req.params.id } })
      if (existingTable) {
        return res.status(400).json({
          success: false,
          message: 'Table name already exists'
        })
      }
    }
    
    const updateData = {}
    if (name) updateData.name = name
    if (capacity) updateData.capacity = capacity
    if (currentStatus && ['empty', 'serving'].includes(currentStatus)) {
      updateData.currentStatus = currentStatus
    }
    
    const table = await Table.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
    
    if (!table) {
      return res.status(404).json({
        success: false,
        message: 'Table not found'
      })
    }
    
    res.json({
      success: true,
      message: 'Table updated successfully',
      data: table
    })
  } catch (error) {
    console.error('Error updating table:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update table',
      error: error.message
    })
  }
})

// DELETE /api/tables/:id - Delete table
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const table = await Table.findByIdAndDelete(req.params.id)
    
    if (!table) {
      return res.status(404).json({
        success: false,
        message: 'Table not found'
      })
    }
    
    res.json({
      success: true,
      message: 'Table deleted successfully',
      data: table
    })
  } catch (error) {
    console.error('Error deleting table:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to delete table',
      error: error.message
    })
  }
})

export default router
