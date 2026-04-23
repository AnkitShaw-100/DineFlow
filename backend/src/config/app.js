const express = require('express')
const cors = require('cors')

// Middleware imports
const errorHandler = require('../middleware/errorHandler')

// Route imports
const orderRoutes = require('../routes/orderRoutes')
const tableRoutes = require('../routes/tableRoutes')
const categoryRoutes = require('../routes/categoryRoutes')
const itemRoutes = require('../routes/itemRoutes')
const statsRoutes = require('../routes/statsRoutes')

// Create Express app
const app = express()

// ==================== MIDDLEWARE ====================
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ==================== ROUTES ====================
app.use('/api/orders', orderRoutes)
app.use('/api/tables', tableRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/items', itemRoutes)
app.use('/api', statsRoutes)

// ==================== HEALTH CHECK ====================
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' })
})

// ==================== 404 HANDLER ====================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  })
})

// ==================== ERROR HANDLER ====================
app.use(errorHandler)

module.exports = app
