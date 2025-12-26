import express from 'express'
import LeaveRequest from '../database/schema/leave_request_schema.js'
import User from '../database/schema/user_schema.js'
import { verifyToken } from './auth.js'

const router = express.Router()

// GET /api/leaverequests/list - Get all leave requests
router.get('/list', async (req, res) => {
  try {
    const leaveRequests = await LeaveRequest.find()
      .populate('user', 'fullname username phone')
      .populate('approved_by', 'fullname username')
      .select('_id user leave_type start_date end_date total_days reason status approved_by created_at')
      .sort({ created_at: -1 })
    
    res.json({
      success: true,
      message: 'Leave requests fetched successfully',
      data: leaveRequests,
      count: leaveRequests.length
    })
  } catch (error) {
    console.error('Error fetching leave requests:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch leave requests',
      error: error.message
    })
  }
})

// GET /api/leaverequests/user/:userId - Get leave requests by user
router.get('/user/:userId', async (req, res) => {
  try {
    const leaveRequests = await LeaveRequest.find({ user: req.params.userId })
      .populate('user', 'fullname username')
      .populate('approved_by', 'fullname username')
      .select('_id leave_type start_date end_date total_days reason status approved_by created_at')
      .sort({ created_at: -1 })
    
    res.json({
      success: true,
      message: 'Leave requests fetched successfully',
      data: leaveRequests,
      count: leaveRequests.length
    })
  } catch (error) {
    console.error('Error fetching leave requests:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch leave requests',
      error: error.message
    })
  }
})

// GET /api/leaverequests/:id - Get single leave request by ID
router.get('/:id', async (req, res) => {
  try {
    const leaveRequest = await LeaveRequest.findById(req.params.id)
      .populate('user', 'fullname username phone')
      .populate('approved_by', 'fullname username')
    
    if (!leaveRequest) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found'
      })
    }
    
    res.json({
      success: true,
      message: 'Leave request fetched successfully',
      data: leaveRequest
    })
  } catch (error) {
    console.error('Error fetching leave request:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch leave request',
      error: error.message
    })
  }
})

// GET /api/leaverequests/by-status/:status - Get leave requests by status
router.get('/by-status/:status', async (req, res) => {
  try {
    const { status } = req.params
    
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be "pending", "approved", or "rejected"'
      })
    }
    
    const leaveRequests = await LeaveRequest.find({ status })
      .populate('user', 'fullname username')
      .populate('approved_by', 'fullname')
      .select('_id user leave_type start_date end_date status approved_by')
      .sort({ created_at: -1 })
    
    res.json({
      success: true,
      message: `Leave requests with status "${status}" fetched successfully`,
      data: leaveRequests,
      count: leaveRequests.length
    })
  } catch (error) {
    console.error('Error fetching leave requests:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch leave requests',
      error: error.message
    })
  }
})

// POST /api/leaverequests - Create new leave request
router.post('/', verifyToken, async (req, res) => {
  try {
    const { leave_type, start_date, end_date, total_days, reason } = req.body
    
    // Validate required fields
    if (!leave_type || !start_date || !end_date || !total_days) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        error: 'leave_type, start_date, end_date, and total_days are required'
      })
    }
    
    // Validate leave type
    const validLeaveTypes = ['nghi_thuong', 'nghi_phep', 'nghi_che_do', 'nghi_le']
    if (!validLeaveTypes.includes(leave_type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid leave type',
        error: `Must be one of: ${validLeaveTypes.join(', ')}`
      })
    }
    
    // Validate dates
    const startDate = new Date(start_date)
    const endDate = new Date(end_date)
    if (startDate >= endDate) {
      return res.status(400).json({
        success: false,
        message: 'Invalid dates',
        error: 'end_date must be after start_date'
      })
    }
    
    const newLeaveRequest = new LeaveRequest({
      user: req.userId, // Current user
      leave_type,
      start_date: startDate,
      end_date: endDate,
      total_days,
      reason: reason || ''
    })
    
    await newLeaveRequest.save()
    await newLeaveRequest.populate('user', 'fullname username')
    
    res.status(201).json({
      success: true,
      message: 'Leave request created successfully',
      data: newLeaveRequest
    })
  } catch (error) {
    console.error('Error creating leave request:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to create leave request',
      error: error.message
    })
  }
})

// PUT /api/leaverequests/:id - Update leave request (only pending can be updated by requester)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { leave_type, start_date, end_date, total_days, reason } = req.body
    
    const leaveRequest = await LeaveRequest.findById(req.params.id)
    if (!leaveRequest) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found'
      })
    }
    
    // Only allow update if status is pending and user is the requester
    if (leaveRequest.status !== 'pending' || leaveRequest.user.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Only pending leave requests by the requester can be updated'
      })
    }
    
    const updateData = {}
    if (leave_type) updateData.leave_type = leave_type
    if (start_date) updateData.start_date = new Date(start_date)
    if (end_date) updateData.end_date = new Date(end_date)
    if (total_days) updateData.total_days = total_days
    if (reason !== undefined) updateData.reason = reason
    
    const updated = await LeaveRequest.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('user', 'fullname username')
    
    res.json({
      success: true,
      message: 'Leave request updated successfully',
      data: updated
    })
  } catch (error) {
    console.error('Error updating leave request:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update leave request',
      error: error.message
    })
  }
})

// POST /api/leaverequests/:id/approve - Approve leave request (manager only)
router.post('/:id/approve', verifyToken, async (req, res) => {
  try {
    const leaveRequest = await LeaveRequest.findById(req.params.id)
    if (!leaveRequest) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found'
      })
    }
    
    if (leaveRequest.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Only pending leave requests can be approved'
      })
    }
    
    leaveRequest.status = 'approved'
    leaveRequest.approved_by = req.userId
    await leaveRequest.save()
    await leaveRequest.populate('user', 'fullname')
    await leaveRequest.populate('approved_by', 'fullname')
    
    res.json({
      success: true,
      message: 'Leave request approved successfully',
      data: leaveRequest
    })
  } catch (error) {
    console.error('Error approving leave request:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to approve leave request',
      error: error.message
    })
  }
})

// POST /api/leaverequests/:id/reject - Reject leave request (manager only)
router.post('/:id/reject', verifyToken, async (req, res) => {
  try {
    const leaveRequest = await LeaveRequest.findById(req.params.id)
    if (!leaveRequest) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found'
      })
    }
    
    if (leaveRequest.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Only pending leave requests can be rejected'
      })
    }
    
    leaveRequest.status = 'rejected'
    leaveRequest.approved_by = req.userId
    await leaveRequest.save()
    await leaveRequest.populate('user', 'fullname')
    await leaveRequest.populate('approved_by', 'fullname')
    
    res.json({
      success: true,
      message: 'Leave request rejected successfully',
      data: leaveRequest
    })
  } catch (error) {
    console.error('Error rejecting leave request:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to reject leave request',
      error: error.message
    })
  }
})

// DELETE /api/leaverequests/:id - Delete leave request (pending only)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const leaveRequest = await LeaveRequest.findById(req.params.id)
    if (!leaveRequest) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found'
      })
    }
    
    if (leaveRequest.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Only pending leave requests can be deleted'
      })
    }
    
    await LeaveRequest.findByIdAndDelete(req.params.id)
    
    res.json({
      success: true,
      message: 'Leave request deleted successfully',
      data: leaveRequest
    })
  } catch (error) {
    console.error('Error deleting leave request:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to delete leave request',
      error: error.message
    })
  }
})

export default router
