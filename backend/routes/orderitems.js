import express from 'express'
import OrderItem from '../database/schema/order_item_schema.js'
import MenuItem from '../database/schema/menu_item_schema.js'
import Reservation from '../database/schema/reservation_schema.js'
import reservationTableSchema from '../database/schema/reservation_table_schema.js';

import { verifyToken } from './auth.js'

const router = express.Router()


const getTableName = async (reservationId) => {
  if (!reservationId) {
    console.error('Reservation ID is missing');
    return 'N/A'; // Nếu không có reservationId, trả về giá trị mặc định
  }

  try {
    const resTable = await reservationTableSchema.default
      .findOne({ reservationId })
      .populate('tableId', 'name');
    return resTable?.tableId?.name || 'N/A';
  } catch (error) {
    console.error('Error fetching table name:', error);
    return 'N/A';
  }
};

const enrichItems = async (items) => {
  if (!items || items.length === 0) {
    return [];
  }

  return Promise.all(items.map(async (item) => {
    try {
      const tableName = await getTableName(item.reservation ? item.reservation._id : null);
      return { ...item, table_name: tableName };
    } catch (error) {
      console.error('Error enriching item:', error);
      return { ...item, table_name: 'N/A' };
    }
  }));
};

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
router.post('/', async (req, res) => {
  try {
    const { reservation, item, quantity, note, price_at_time, status = 'waiting', serving_status = 'unserved', ordered_at } = req.body

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
      status: status || 'waiting',
      serving_status: serving_status || 'unserved',
      ordered_at: ordered_at ? new Date(ordered_at) : new Date()
    })

    await newOrderItem.save()
    await newOrderItem.populate('item', 'name price category')

    // Add to reservation's orderItems array if not already there
    if (!reservationExists.orderItems.includes(newOrderItem._id)) {
      reservationExists.orderItems.push(newOrderItem._id)
      await reservationExists.save()
    }

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
router.put('/:id', async (req, res) => {
  try {
    const { quantity, note, status, serving_status, item } = req.body

    const updateData = {}
    if (quantity) updateData.quantity = quantity
    if (note !== undefined) updateData.note = note
    if (status && ['waiting', 'cooking', 'cooked'].includes(status)) {
      updateData.status = status
    }
    if (serving_status && ['served', 'unserved'].includes(serving_status)) {
      updateData.serving_status = serving_status
    }
    if (item) {
      // Verify menu item exists
      const menuItem = await MenuItem.findById(item)
      if (!menuItem) {
        return res.status(404).json({
          success: false,
          message: 'Menu item not found'
        })
      }
      updateData.item = item
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

    // Remove from reservation's orderItems array
    await Reservation.findByIdAndUpdate(
      orderItem.reservation,
      { $pull: { orderItems: orderItem._id } }
    )

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

// GET /api/orderitems/waiter/delivery - Get orders grouped for waiter (delivery)
// Only 2 categories: served and unserved
// unserved sorted by status: cooked → cooking → waiting
router.get('/waiter/delivery', async (req, res) => {
  try {
    // Query OrderItems by status
    const [cooked, cooking, waiting, served] = await Promise.all([
      OrderItem.find({ status: 'cooked', serving_status: { $ne: 'served' } }) // Món đã nấu nhưng chưa phục vụ
        .populate('item', 'name price image category')
        .populate('reservation', '_id')
        .sort({ ordered_at: 1 })
        .lean(),
      
      OrderItem.find({ status: 'cooking', serving_status: { $ne: 'served' } }) // Món đang nấu nhưng chưa phục vụ
        .populate('item', 'name price image category')
        .populate('reservation', '_id')
        .sort({ ordered_at: 1 })
        .lean(),

      OrderItem.find({ status: 'waiting', serving_status: { $ne: 'served' } }) // Món đang chờ nhưng chưa phục vụ
        .populate('item', 'name price image category')
        .populate('reservation', '_id')
        .sort({ ordered_at: 1 })
        .lean(),

      OrderItem.find({ serving_status: 'served' }) // Món đã phục vụ
        .populate('item', 'name price image category')
        .populate('reservation', '_id')
        .sort({ ordered_at: -1 })
        .limit(20)
        .lean()
    ]);

    // Reverse served items to sort oldest first
    served.reverse();

    // Helper function to enrich items with table names
    const enrichItems = async (items) => {
      return Promise.all(items.map(async (item) => {
        try {
          const resTable = await reservationTableSchema
            .findOne({ reservationId: item.reservation._id })
            .populate('tableId', 'name');

          return {
            ...item,
            table_name: resTable?.tableId?.name || 'N/A'
          };
        } catch (error) {
          console.error('Error enriching table information for item:', item._id, error);
          return item; // Return item without enrichment if error occurs
        }
      }));
    };

    // Enrich each status group with table names
    const enrichedCooked = await enrichItems(cooked);
    const enrichedCooking = await enrichItems(cooking);
    const enrichedWaiting = await enrichItems(waiting);
    const enrichedServed = await enrichItems(served);

    // Combine unserved: cooked → cooking → waiting
    const unserved = [...enrichedCooked, ...enrichedCooking, ...enrichedWaiting];

    // Send response with enriched data
    res.json({
      success: true,
      data: {
        served: enrichedServed,
        unserved: unserved
      }
    });

  } catch (error) {
    console.error('Error fetching waiter orders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch waiter orders',
      error: error.message
    });
  }
});


// GET /api/orderitems/chef/orders - Get orders for chef (kitchen)
// Only 3 categories: waiting, cooking, cooked (no served items)
router.get('/chef/orders', async (req, res) => {
  try {
    // Query items by status (exclude served items)
    const waiting = await OrderItem.find({ status: 'waiting' })
      .populate('item', 'name price image category')
      .populate('reservation', '_id') // Ensure reservation is populated
      .sort({ ordered_at: 1 })
      .lean();

    const cooking = await OrderItem.find({ status: 'cooking' })
      .populate('item', 'name price image category')
      .populate('reservation', '_id') // Ensure reservation is populated
      .sort({ ordered_at: 1 })
      .lean();

    // Get cooked items (max 20 most recent, exclude served)
    const cooked = await OrderItem.find({ status: 'cooked', serving_status: 'unserved' })
      .populate('item', 'name price image category')
      .populate('reservation', '_id') // Ensure reservation is populated
      .sort({ ordered_at: -1 })
      .limit(20)
      .lean();

    cooked.reverse(); // Sort oldest first

    // Enrich items with table names (ensuring table relationships exist)
    const enrichItems = async (items) => {
      return Promise.all(items.map(async (item) => {
        // Ensure reservationId exists before proceeding
        if (!item.reservation || !item.reservation._id) {
          return { ...item, table_name: 'N/A' }; // If no reservation, set default
        }

        try {
          const resTable = await reservationTableSchema
            .findOne({ reservationId: item.reservation._id }) // Ensure the reservationId exists
            .populate('tableId', 'name'); // Ensure tableId exists

          return {
            ...item,
            table_name: resTable?.tableId?.name || 'N/A' // Fallback to 'N/A' if no table is found
          };
        } catch (err) {
          console.error('Error enriching item with table:', err);
          return { ...item, table_name: 'N/A' }; // Handle error gracefully
        }
      }));
    };

    const enrichedWaiting = await enrichItems(waiting);
    const enrichedCooking = await enrichItems(cooking);
    const enrichedCooked = await enrichItems(cooked);

    // Send response
    res.json({
      success: true,
      data: {
        waiting: enrichedWaiting,
        cooking: enrichedCooking,
        cooked: enrichedCooked
      }
    });

  } catch (error) {
    console.error('Error fetching chef orders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch chef orders',
      error: error.message
    });
  }
});


export default router
