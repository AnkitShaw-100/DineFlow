const { db, getNextId } = require('../models/db')
const { sendSuccess, sendError } = require('../utils/response')

// Get all orders
exports.getAllOrders = (req, res) => {
  try {
    sendSuccess(res, db.orders, 'Orders retrieved successfully')
  } catch (error) {
    sendError(res, 'Failed to retrieve orders', 500, error.message)
  }
}

// Get order by ID
exports.getOrderById = (req, res) => {
  try {
    const order = db.orders.find((o) => o.id === parseInt(req.params.id))

    if (!order) {
      return sendError(res, 'Order not found', 404)
    }

    sendSuccess(res, order, 'Order retrieved successfully')
  } catch (error) {
    sendError(res, 'Failed to retrieve order', 500, error.message)
  }
}

// Create new order
exports.createOrder = (req, res) => {
  try {
    const { tableNumber, items, total } = req.body

    if (!tableNumber || !items || !total) {
      return sendError(res, 'Missing required fields', 400)
    }

    const newOrder = {
      id: getNextId(db.orders),
      tableNumber,
      items,
      total,
      status: 'pending',
      time: new Date().toLocaleTimeString(),
    }

    db.orders.push(newOrder)
    sendSuccess(res, newOrder, 'Order created successfully', 201)
  } catch (error) {
    sendError(res, 'Failed to create order', 500, error.message)
  }
}

// Update order
exports.updateOrder = (req, res) => {
  try {
    const order = db.orders.find((o) => o.id === parseInt(req.params.id))

    if (!order) {
      return sendError(res, 'Order not found', 404)
    }

    Object.assign(order, req.body)
    sendSuccess(res, order, 'Order updated successfully')
  } catch (error) {
    sendError(res, 'Failed to update order', 500, error.message)
  }
}

// Delete order
exports.deleteOrder = (req, res) => {
  try {
    const index = db.orders.findIndex((o) => o.id === parseInt(req.params.id))

    if (index === -1) {
      return sendError(res, 'Order not found', 404)
    }

    const deletedOrder = db.orders.splice(index, 1)[0]
    sendSuccess(res, deletedOrder, 'Order deleted successfully')
  } catch (error) {
    sendError(res, 'Failed to delete order', 500, error.message)
  }
}
