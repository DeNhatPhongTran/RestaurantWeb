import express from 'express'
import Invoice from '../database/schema/invoice_schema.js'
import Reservation from '../database/schema/reservation_schema.js'
import OrderItem from '../database/schema/order_item_schema.js'
import ReservationTable from '../database/schema/reservation_table_schema.js'
import User from '../database/schema/user_schema.js'
import { verifyToken } from './auth.js'

const router = express.Router()

// GET /api/invoices/cashier/unpaid - Get unpaid invoices for cashier display
router.get('/cashier/unpaid', async (req, res) => {
  try {
    const reservations = await Reservation.find({
      status: { $in: ['confirmed', 'checked-in'] }
    })
      .select('_id customer_name customer_phone guest_count status datetime_checkin')
      .sort({ datetime_checkin: -1 })

    const invoiceData = await Promise.all(
      reservations.map(async (res) => {
        const orderItems = await OrderItem.find({ reservation: res._id })
          .populate('item', 'name price')
          .select('_id item quantity note status serving_status price_at_time')

        const resTable = await ReservationTable.findOne({ reservationId: res._id })
          .populate('tableId', 'name')

        // Calculate total and check if all items are served
        const subtotal = orderItems.reduce((sum, item) => sum + item.price_at_time * item.quantity, 0)
        const tax = subtotal * 0.12
        const totalAmount = subtotal + tax
        const allServed = orderItems.every(item => item.serving_status === 'served')

        return {
          _id: res._id,
          customer_name: res.customer_name,
          customer_phone: res.customer_phone,
          guest_count: res.guest_count,
          table_name: resTable?.tableId?.name || 'N/A',
          order_items: orderItems,
          subtotal,
          tax,
          total_amount: totalAmount,
          all_items_served: allServed,
          payment_status: 'unpaid',
          created_at: res.datetime_checkin
        }
      })
    )

    res.json({
      success: true,
      message: 'Unpaid invoices fetched successfully',
      data: invoiceData,
      count: invoiceData.length
    })
  } catch (error) {
    console.error('Error fetching unpaid invoices:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch unpaid invoices',
      error: error.message
    })
  }
})

// GET /api/invoices/cashier/paid - Get paid invoices (latest 20)
router.get('/cashier/paid', async (req, res) => {
  try {
    const invoices = await Invoice.find()
      .populate('reservation', 'customer_name customer_phone guest_count status datetime_out')
      .populate('cashier', 'fullname')
      .select('_id reservation total_price payment_method paid_at cashier')
      .sort({ paid_at: -1 })
      .limit(20);

    console.log('Invoices fetched:', invoices); // Log kết quả hóa đơn

    const enrichedInvoices = await Promise.all(
      invoices.map(async (inv) => {
        try {
          const resTable = await ReservationTable.findOne({ reservationId: inv.reservation._id })
            .populate('tableId', 'name');

          return {
            _id: inv._id,
            reservation_id: inv.reservation._id,
            customer_name: inv.reservation.customer_name,
            customer_phone: inv.reservation.customer_phone,
            table_name: resTable?.tableId?.name || 'N/A',
            total_amount: inv.total_price,
            payment_method: inv.payment_method,
            paid_at: inv.paid_at,
            cashier_name: inv.cashier?.fullname,
            payment_status: 'paid'
          };
        } catch (err) {
          console.error('Error mapping invoice:', inv._id, err);
          throw new Error(`Error processing invoice ${inv._id}: ${err.message}`);
        }
      })
    );

    console.log('Enriched invoices:', enrichedInvoices); // Log kết quả enriched

    res.json({
      success: true,
      message: 'Paid invoices fetched successfully',
      data: enrichedInvoices,
      count: enrichedInvoices.length
    });
  } catch (error) {
    console.error('Error fetching paid invoices:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch paid invoices',
      error: error.message
    });
  }
});

// PUT /api/invoices/:reservationId/process-payment - Process payment and mark as paid
router.put('/:reservationId/process-payment', verifyToken, async (req, res) => {
  try {
    const { reservationId } = req.params
    const { payment_method, total_price } = req.body

    if (!payment_method || !total_price) {
      return res.status(400).json({
        success: false,
        message: 'Payment method and total price are required'
      })
    }

    // Validate payment method
    if (!['cash', 'card', 'bank', 'ewallet'].includes(payment_method)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment method'
      })
    }

    // Check if reservation exists
    const reservation = await Reservation.findById(reservationId)
    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found'
      })
    }

    // Check if all items are served
    const orderItems = await OrderItem.find({ reservation: reservationId })
    const allServed = orderItems.every(item => item.serving_status === 'served')
    
    if (!allServed) {
      return res.status(400).json({
        success: false,
        message: 'Không thể thanh toán khi chưa phục vụ hết các món'
      })
    }

    // Create invoice
    const newInvoice = new Invoice({
      reservation: reservationId,
      total_price,
      payment_method,
      cashier: req.userId,
      paid_at: new Date()
    })

    await newInvoice.save()

    // Update reservation status and checkout time
    const updatedReservation = await Reservation.findByIdAndUpdate(
      reservationId,
      {
        status: 'finished',
        datetime_out: new Date()
      },
      { new: true }
    )

    res.json({
      success: true,
      message: 'Thanh toán thành công',
      data: {
        invoice: newInvoice,
        reservation: updatedReservation
      }
    })
  } catch (error) {
    console.error('Error processing payment:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to process payment',
      error: error.message
    })
  }
})

// GET /api/invoices/list - Get all invoices
router.get('/list', async (req, res) => {
  try {
    const invoices = await Invoice.find()
      .populate('reservation', 'customer_name customer_phone guest_count status')
      .populate('cashier', 'fullname username')
      .select('_id reservation total_price payment_method paid_at cashier')
      .sort({ paid_at: -1 })
    
    res.json({
      success: true,
      message: 'Invoices fetched successfully',
      data: invoices,
      count: invoices.length
    })
  } catch (error) {
    console.error('Error fetching invoices:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch invoices',
      error: error.message
    })
  }
})

// GET /api/invoices/:id - Get single invoice by ID
router.get('/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('reservation', 'customer_name customer_phone guest_count status')
      .populate('cashier', 'fullname username')
    
    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      })
    }
    
    res.json({
      success: true,
      message: 'Invoice fetched successfully',
      data: invoice
    })
  } catch (error) {
    console.error('Error fetching invoice:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch invoice',
      error: error.message
    })
  }
})

// GET /api/invoices/reservation/:reservationId - Get invoice by reservation
router.get('/reservation/:reservationId', async (req, res) => {
  try {
    const invoice = await Invoice.findOne({ reservation: req.params.reservationId })
      .populate('reservation', 'customer_name customer_phone guest_count status')
      .populate('cashier', 'fullname username')
    
    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found for this reservation'
      })
    }
    
    res.json({
      success: true,
      message: 'Invoice fetched successfully',
      data: invoice
    })
  } catch (error) {
    console.error('Error fetching invoice:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch invoice',
      error: error.message
    })
  }
})

// GET /api/invoices/by-method/:method - Get invoices by payment method
router.get('/by-method/:method', async (req, res) => {
  try {
    const { method } = req.params
    
    if (!['cash', 'card', 'bank', 'ewallet'].includes(method)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment method. Must be "cash", "card", "bank", or "ewallet"'
      })
    }
    
    const invoices = await Invoice.find({ payment_method: method })
      .populate('reservation', 'customer_name')
      .populate('cashier', 'fullname')
      .select('_id reservation total_price payment_method paid_at')
      .sort({ paid_at: -1 })
    
    res.json({
      success: true,
      message: `Invoices with payment method "${method}" fetched successfully`,
      data: invoices,
      count: invoices.length
    })
  } catch (error) {
    console.error('Error fetching invoices:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch invoices',
      error: error.message
    })
  }
})

// GET /api/invoices/cashier/:cashierId - Get invoices by cashier
router.get('/cashier/:cashierId', async (req, res) => {
  try {
    const invoices = await Invoice.find({ cashier: req.params.cashierId })
      .populate('reservation', 'customer_name')
      .select('_id reservation total_price payment_method paid_at')
      .sort({ paid_at: -1 })
    
    res.json({
      success: true,
      message: 'Invoices fetched successfully',
      data: invoices,
      count: invoices.length
    })
  } catch (error) {
    console.error('Error fetching invoices:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch invoices',
      error: error.message
    })
  }
})

// POST /api/invoices - Create new invoice
router.post('/', verifyToken, async (req, res) => {
  try {
    const { reservation, total_price, payment_method } = req.body
    
    // Validate required fields
    if (!reservation || !total_price || !payment_method) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        error: 'reservation, total_price, and payment_method are required'
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
    
    // Check if invoice already exists for this reservation
    const existingInvoice = await Invoice.findOne({ reservation })
    if (existingInvoice) {
      return res.status(400).json({
        success: false,
        message: 'Invoice already exists for this reservation'
      })
    }
    
    // Validate payment method
    if (!['cash', 'card', 'bank', 'ewallet'].includes(payment_method)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment method. Must be "cash", "card", "bank", or "ewallet"'
      })
    }
    
    const newInvoice = new Invoice({
      reservation,
      total_price,
      payment_method,
      cashier: req.userId // Current user is the cashier
    })
    
    await newInvoice.save()
    await newInvoice.populate('reservation', 'customer_name')
    await newInvoice.populate('cashier', 'fullname')
    
    res.status(201).json({
      success: true,
      message: 'Invoice created successfully',
      data: newInvoice
    })
  } catch (error) {
    console.error('Error creating invoice:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to create invoice',
      error: error.message
    })
  }
})

// PUT /api/invoices/:id - Update invoice (payment method update)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { payment_method } = req.body
    
    const updateData = {}
    if (payment_method && ['cash', 'card', 'bank', 'ewallet'].includes(payment_method)) {
      updateData.payment_method = payment_method
    }
    
    const invoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('reservation', 'customer_name')
      .populate('cashier', 'fullname')
    
    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      })
    }
    
    res.json({
      success: true,
      message: 'Invoice updated successfully',
      data: invoice
    })
  } catch (error) {
    console.error('Error updating invoice:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update invoice',
      error: error.message
    })
  }
})

// DELETE /api/invoices/:id - Delete invoice
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id)
    
    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      })
    }
    
    res.json({
      success: true,
      message: 'Invoice deleted successfully',
      data: invoice
    })
  } catch (error) {
    console.error('Error deleting invoice:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to delete invoice',
      error: error.message
    })
  }
})

export default router
