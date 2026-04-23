const { db, getNextId } = require('../models/db')
const { sendSuccess, sendError } = require('../utils/response')

// Get all items
exports.getAllItems = (req, res) => {
  try {
    sendSuccess(res, db.items, 'Items retrieved successfully')
  } catch (error) {
    sendError(res, 'Failed to retrieve items', 500, error.message)
  }
}

// Get item by ID
exports.getItemById = (req, res) => {
  try {
    const item = db.items.find((i) => i.id === parseInt(req.params.id))

    if (!item) {
      return sendError(res, 'Item not found', 404)
    }

    sendSuccess(res, item, 'Item retrieved successfully')
  } catch (error) {
    sendError(res, 'Failed to retrieve item', 500, error.message)
  }
}

// Create new item
exports.createItem = (req, res) => {
  try {
    const { name, category, price } = req.body

    if (!name || !category || !price) {
      return sendError(res, 'Missing required fields', 400)
    }

    const newItem = {
      id: getNextId(db.items),
      name,
      category,
      price,
    }

    db.items.push(newItem)
    sendSuccess(res, newItem, 'Item created successfully', 201)
  } catch (error) {
    sendError(res, 'Failed to create item', 500, error.message)
  }
}

// Update item
exports.updateItem = (req, res) => {
  try {
    const item = db.items.find((i) => i.id === parseInt(req.params.id))

    if (!item) {
      return sendError(res, 'Item not found', 404)
    }

    Object.assign(item, req.body)
    sendSuccess(res, item, 'Item updated successfully')
  } catch (error) {
    sendError(res, 'Failed to update item', 500, error.message)
  }
}

// Delete item
exports.deleteItem = (req, res) => {
  try {
    const index = db.items.findIndex((i) => i.id === parseInt(req.params.id))

    if (index === -1) {
      return sendError(res, 'Item not found', 404)
    }

    const deletedItem = db.items.splice(index, 1)[0]
    sendSuccess(res, deletedItem, 'Item deleted successfully')
  } catch (error) {
    sendError(res, 'Failed to delete item', 500, error.message)
  }
}
