const { db, getNextId } = require('../models/db')
const { sendSuccess, sendError } = require('../utils/response')

// Get all categories
exports.getAllCategories = (req, res) => {
  try {
    sendSuccess(res, db.categories, 'Categories retrieved successfully')
  } catch (error) {
    sendError(res, 'Failed to retrieve categories', 500, error.message)
  }
}

// Get category by ID
exports.getCategoryById = (req, res) => {
  try {
    const category = db.categories.find((c) => c.id === parseInt(req.params.id))

    if (!category) {
      return sendError(res, 'Category not found', 404)
    }

    sendSuccess(res, category, 'Category retrieved successfully')
  } catch (error) {
    sendError(res, 'Failed to retrieve category', 500, error.message)
  }
}

// Create new category
exports.createCategory = (req, res) => {
  try {
    const { name, color } = req.body

    if (!name || !color) {
      return sendError(res, 'Missing required fields', 400)
    }

    const newCategory = {
      id: getNextId(db.categories),
      name,
      color,
    }

    db.categories.push(newCategory)
    sendSuccess(res, newCategory, 'Category created successfully', 201)
  } catch (error) {
    sendError(res, 'Failed to create category', 500, error.message)
  }
}

// Update category
exports.updateCategory = (req, res) => {
  try {
    const category = db.categories.find((c) => c.id === parseInt(req.params.id))

    if (!category) {
      return sendError(res, 'Category not found', 404)
    }

    Object.assign(category, req.body)
    sendSuccess(res, category, 'Category updated successfully')
  } catch (error) {
    sendError(res, 'Failed to update category', 500, error.message)
  }
}

// Delete category
exports.deleteCategory = (req, res) => {
  try {
    const index = db.categories.findIndex((c) => c.id === parseInt(req.params.id))

    if (index === -1) {
      return sendError(res, 'Category not found', 404)
    }

    const deletedCategory = db.categories.splice(index, 1)[0]
    sendSuccess(res, deletedCategory, 'Category deleted successfully')
  } catch (error) {
    sendError(res, 'Failed to delete category', 500, error.message)
  }
}
