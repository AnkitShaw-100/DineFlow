const { db } = require('../models/db')
const { sendSuccess, sendError } = require('../utils/response')

// Get dashboard statistics
exports.getStats = (req, res) => {
  try {
    const completedOrders = db.orders.filter((o) => o.status === 'completed')
    const totalRevenue = completedOrders.reduce((sum, o) => sum + o.total, 0)
    const occupiedTables = db.tables.filter((t) => t.status === 'occupied').length

    const stats = {
      totalRevenue,
      ordersToday: db.orders.length,
      activeTables: occupiedTables,
      avgOrderTime: '28m',
    }

    sendSuccess(res, stats, 'Statistics retrieved successfully')
  } catch (error) {
    sendError(res, 'Failed to retrieve statistics', 500, error.message)
  }
}

// Health check
exports.healthCheck = (req, res) => {
  try {
    sendSuccess(res, { status: 'ok' }, 'Server is running')
  } catch (error) {
    sendError(res, 'Health check failed', 500, error.message)
  }
}
