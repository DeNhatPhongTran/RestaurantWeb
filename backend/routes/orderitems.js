import express from 'express'
import OrderItem from '../database/schema/order_item_schema.js'
import MenuItem from '../database/schema/menu_item_schema.js'
import Reservation from '../database/schema/reservation_schema.js'
import { verifyToken } from './auth.js'

const router = express.Router()

// GET /api/orderitems/list - Get all order items
router.get('/list', async (req, res) => {
  try {
    const orderItems = await OrderItem.find()
      .populate('item', 'name price category')
      .populate('reservation', 'customer_name status')
      .select('_id item reservation quantity note status price_at_time')
      .sort({ _id: -1 })
    
    res.json({
      success: true,
      message: 'Order items fetched successfully',
      data: orderItems,
      count: orderItems.length
    })
  } catch (error) {
    console.error('Error fetching order items:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order items',
      error: error.message
    })
  }
})

// GET /api/orderitems/reservation/:reservationId - Get order items by reservation
router.get('/reservation/:reservationId', async (req, res) => {
  try {
    const orderItems = await OrderItem.find({ reservation: req.params.reservationId })
      .populate('item', 'name price category description')
      .select('_id item quantity note status price_at_time')
    
    if (orderItems.length === 0) {
      return res.status(404).json({
        success: true,
        message: 'No order items found for this reservation',
        data: []
      })
    }
    
    res.json({
      success: true,
      message: 'Order items fetched successfully',
      data: orderItems,
      count: orderItems.length
    })
  } catch (error) {
    console.error('Error fetching order items:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order items',
      error: error.message
    })
  }
})

// GET /api/orderitems/:id - Get single order item by ID
router.get('/:id', async (req, res) => {
  try {
    const orderItem = await OrderItem.findById(req.params.id)
      .populate('item', 'name price category')
      .populate('reservation', 'customer_name status')
    
    if (!orderItem) {
      return res.status(404).json({
        success: false,
        message: 'Order item not found'
      })
    }
    
    res.json({
      success: true,
      message: 'Order item fetched successfully',
      data: orderItem
    })
  } catch (error) {
    console.error('Error fetching order item:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order item',
      error: error.message
    })
  }
})

// GET /api/orderitems/by-status/:status - Get order items by status
router.get('/by-status/:status', async (req, res) => {
  try {
    const { status } = req.params
    
    if (!['waiting', 'cooking', 'cooked'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be "waiting", "cooking", or "cooked"'
      })
    }
    
    const orderItems = await OrderItem.find({ status })
      .populate('item', 'name price category')
      .populate('reservation', 'customer_name guest_count')
      .select('_id item reservation quantity note status price_at_time')
    
    res.json({
      success: true,
      message: `Order items with status "${status}" fetched successfully`,
      data: orderItems,
      count: orderItems.length
    })
  } catch (error) {
    console.error('Error fetching order items:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order items',
      error: error.message
    })
  }
})

// POST /api/orderitems - Create new order item
router.post('/', verifyToken, async (req, res) => {
  try {
    const { reservation, item, quantity, note, price_at_time } = req.body
    
    // Validate required fields
    if (!reservation || !item || !quantity || !price_at_time) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        error: 'reservation, item, quantity, and price_at_time are required'
      })
    }
    
    // Check if reservation exists
    const reservationExists = await Reservation.findById(reservation)
    if (!reservationExists) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found'
      })
    }
    
    // Check if menu item exists
    const menuItem = await MenuItem.findById(item)
    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      })
    }
    
    const newOrderItem = new OrderItem({
      reservation,
      item,
      quantity,
      note: note || '',
      price_at_time,
      status: 'waiting'
    })
    
    await newOrderItem.save()
    await newOrderItem.populate('item', 'name price category')
    
    res.status(201).json({
      success: true,
      message: 'Order item created successfully',
      data: newOrderItem
    })
  } catch (error) {
    console.error('Error creating order item:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to create order item',
      error: error.message
    })
  }
})

// PUT /api/orderitems/:id - Update order item
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { quantity, note, status } = req.body
    
    const updateData = {}
    if (quantity) updateData.quantity = quantity
    if (note !== undefined) updateData.note = note
    if (status && ['waiting', 'cooking', 'cooked'].includes(status)) {
      updateData.status = status
    }
    
    const orderItem = await OrderItem.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('item', 'name price category')
    
    if (!orderItem) {
      return res.status(404).json({
        success: false,
        message: 'Order item not found'
      })
    }
    
    res.json({
      success: true,
      message: 'Order item updated successfully',
      data: orderItem
    })
  } catch (error) {
    console.error('Error updating order item:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update order item',
      error: error.message
    })
  }
})

// DELETE /api/orderitems/:id - Delete order item
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const orderItem = await OrderItem.findByIdAndDelete(req.params.id)
    
    if (!orderItem) {
      return res.status(404).json({
        success: false,
        message: 'Order item not found'
      })
    }
    
    res.json({
      success: true,
      message: 'Order item deleted successfully',
      data: orderItem
    })
  } catch (error) {
    console.error('Error deleting order item:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to delete order item',
      error: error.message
    })
  }
})

export default router
