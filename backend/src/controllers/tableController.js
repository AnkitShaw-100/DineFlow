const { db, getNextId } = require('../models/db')
const { sendSuccess, sendError } = require('../utils/response')

// Get all tables
exports.getAllTables = (req, res) => {
  try {
    sendSuccess(res, db.tables, 'Tables retrieved successfully')
  } catch (error) {
    sendError(res, 'Failed to retrieve tables', 500, error.message)
  }
}

// Get table by ID
exports.getTableById = (req, res) => {
  try {
    const table = db.tables.find((t) => t.id === parseInt(req.params.id))

    if (!table) {
      return sendError(res, 'Table not found', 404)
    }

    sendSuccess(res, table, 'Table retrieved successfully')
  } catch (error) {
    sendError(res, 'Failed to retrieve table', 500, error.message)
  }
}

// Create new table
exports.createTable = (req, res) => {
  try {
    const { number, capacity } = req.body

    if (!number || !capacity) {
      return sendError(res, 'Missing required fields', 400)
    }

    const newTable = {
      id: getNextId(db.tables),
      number,
      capacity,
      status: 'empty',
      occupiedSince: null,
    }

    db.tables.push(newTable)
    sendSuccess(res, newTable, 'Table created successfully', 201)
  } catch (error) {
    sendError(res, 'Failed to create table', 500, error.message)
  }
}

// Update table
exports.updateTable = (req, res) => {
  try {
    const table = db.tables.find((t) => t.id === parseInt(req.params.id))

    if (!table) {
      return sendError(res, 'Table not found', 404)
    }

    Object.assign(table, req.body)
    sendSuccess(res, table, 'Table updated successfully')
  } catch (error) {
    sendError(res, 'Failed to update table', 500, error.message)
  }
}

// Delete table
exports.deleteTable = (req, res) => {
  try {
    const index = db.tables.findIndex((t) => t.id === parseInt(req.params.id))

    if (index === -1) {
      return sendError(res, 'Table not found', 404)
    }

    const deletedTable = db.tables.splice(index, 1)[0]
    sendSuccess(res, deletedTable, 'Table deleted successfully')
  } catch (error) {
    sendError(res, 'Failed to delete table', 500, error.message)
  }
}
