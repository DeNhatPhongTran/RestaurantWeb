import express from 'express'
import ReservationInvoice from '../database/schema/reservation_invoice_schema.js'
import Reservation from '../database/schema/reservation_schema.js'
import Invoice from '../database/schema/invoice_schema.js'

const router = express.Router()

// Get all ReservationInvoice with joined data
router.get('/list', async (req, res) => {
  try {
    const data = await ReservationInvoice.aggregate([
      {
        $lookup: {
          from: 'reservations',
          localField: 'reservationId',
          foreignField: '_id',
          as: 'reservation',
        },
      },
      {
        $lookup: {
          from: 'invoices',
          let: { resId: '$reservationId' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$reservation', '$$resId'] },
              },
            },
          ],
          as: 'invoice',
        },
      },
      {
        $project: {
          reservationId: 1,
          reservation: { $arrayElemAt: ['$reservation', 0] },
          invoice: { $arrayElemAt: ['$invoice', 0] },
        },
      },
    ])

    res.json({
      success: true,
      data,
    })
  } catch (err) {
    console.error('Error fetching ReservationInvoices:', err)
    res.status(500).json({
      success: false,
      error: 'Lỗi server',
    })
  }
})

// Get ReservationInvoice by Reservation ID
router.get('/by-reservation/:reservationId', async (req, res) => {
  try {
    const { reservationId } = req.params

    const resInvoice = await ReservationInvoice.findOne({
      reservationId,
    }).populate('reservationId')

    if (!resInvoice) {
      return res.json({
        success: true,
        data: null,
      })
    }

    res.json({
      success: true,
      data: resInvoice,
    })
  } catch (err) {
    console.error('Error fetching ReservationInvoice:', err)
    res.status(500).json({
      success: false,
      error: 'Lỗi server',
    })
  }
})

// Create ReservationInvoice
router.post('/create', async (req, res) => {
  try {
    const { reservationId } = req.body

    if (!reservationId) {
      return res.status(400).json({
        success: false,
        error: 'reservationId là bắt buộc',
      })
    }

    // Check if reservation exists
    const reservation = await Reservation.findById(reservationId)
    if (!reservation) {
      return res.status(404).json({
        success: false,
        error: 'Không tìm thấy đơn đặt bàn',
      })
    }

    // Check if ReservationInvoice already exists
    const existing = await ReservationInvoice.findOne({ reservationId })
    if (existing) {
      return res.status(409).json({
        success: false,
        error: 'ReservationInvoice đã tồn tại cho đơn đặt bàn này',
      })
    }

    const newResInvoice = await ReservationInvoice.create({
      reservationId,
    })

    res.status(201).json({
      success: true,
      data: newResInvoice,
      message: 'Tạo ReservationInvoice thành công',
    })
  } catch (err) {
    console.error('Error creating ReservationInvoice:', err)
    res.status(500).json({
      success: false,
      error: 'Lỗi server',
    })
  }
})

// Delete ReservationInvoice
router.delete('/:reservationId', async (req, res) => {
  try {
    const { reservationId } = req.params

    const deleted = await ReservationInvoice.findOneAndDelete({
      reservationId,
    })

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Không tìm thấy ReservationInvoice cần xóa',
      })
    }

    res.json({
      success: true,
      message: 'Xóa ReservationInvoice thành công',
      data: deleted,
    })
  } catch (err) {
    console.error('Error deleting ReservationInvoice:', err)
    res.status(500).json({
      success: false,
      error: 'Lỗi server',
    })
  }
})

export default router
