const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const mongoose = require('mongoose')

dotenv.config()

const app = express()

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// MongoDB Connection (Mock for now - can be replaced with real MongoDB)
// In production, connect to MongoDB Atlas
// mongoose.connect(process.env.MONGODB_URI)

// In-memory database for demo
const db = {
  orders: [
    { id: 1, tableNumber: 5, items: ['Butter Chicken', 'Naan', 'Biryani'], total: 850, status: 'completed', time: '2:30 PM' },
    { id: 2, tableNumber: 3, items: ['Tandoori Chicken', 'Paratha'], total: 620, status: 'preparing', time: '2:45 PM' },
  ],
  tables: [
    { id: 1, number: 1, capacity: 2, status: 'empty', occupiedSince: null },
    { id: 2, number: 2, capacity: 4, status: 'occupied', occupiedSince: '2:15 PM' },
  ],
  categories: [
    { id: 1, name: 'North Indian', color: '#EF4444' },
    { id: 2, name: 'South Indian', color: '#F59E0B' },
  ],
  items: [
    { id: 1, name: 'Butter Chicken', category: 'North Indian', price: 350 },
    { id: 2, name: 'Naan', category: 'North Indian', price: 80 },
  ]
}

// ==================== ORDERS ROUTES ====================
app.get('/api/orders', (req, res) => {
  res.json({
    success: true,
    data: db.orders
  })
})

app.get('/api/orders/:id', (req, res) => {
  const order = db.orders.find(o => o.id === parseInt(req.params.id))
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' })
  }
  res.json({ success: true, data: order })
})

app.post('/api/orders', (req, res) => {
  const { tableNumber, items, total } = req.body
  const newOrder = {
    id: Math.max(...db.orders.map(o => o.id), 0) + 1,
    tableNumber,
    items,
    total,
    status: 'pending',
    time: new Date().toLocaleTimeString()
  }
  db.orders.push(newOrder)
  res.status(201).json({ success: true, data: newOrder })
})

app.put('/api/orders/:id', (req, res) => {
  const order = db.orders.find(o => o.id === parseInt(req.params.id))
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' })
  }
  Object.assign(order, req.body)
  res.json({ success: true, data: order })
})

app.delete('/api/orders/:id', (req, res) => {
  const index = db.orders.findIndex(o => o.id === parseInt(req.params.id))
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Order not found' })
  }
  const deletedOrder = db.orders.splice(index, 1)
  res.json({ success: true, data: deletedOrder[0] })
})

// ==================== TABLES ROUTES ====================
app.get('/api/tables', (req, res) => {
  res.json({
    success: true,
    data: db.tables
  })
})

app.post('/api/tables', (req, res) => {
  const { number, capacity } = req.body
  const newTable = {
    id: Math.max(...db.tables.map(t => t.id), 0) + 1,
    number,
    capacity,
    status: 'empty',
    occupiedSince: null
  }
  db.tables.push(newTable)
  res.status(201).json({ success: true, data: newTable })
})

app.put('/api/tables/:id', (req, res) => {
  const table = db.tables.find(t => t.id === parseInt(req.params.id))
  if (!table) {
    return res.status(404).json({ success: false, message: 'Table not found' })
  }
  Object.assign(table, req.body)
  res.json({ success: true, data: table })
})

app.delete('/api/tables/:id', (req, res) => {
  const index = db.tables.findIndex(t => t.id === parseInt(req.params.id))
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Table not found' })
  }
  const deletedTable = db.tables.splice(index, 1)
  res.json({ success: true, data: deletedTable[0] })
})

// ==================== CATEGORIES ROUTES ====================
app.get('/api/categories', (req, res) => {
  res.json({
    success: true,
    data: db.categories
  })
})

app.post('/api/categories', (req, res) => {
  const { name, color } = req.body
  const newCategory = {
    id: Math.max(...db.categories.map(c => c.id), 0) + 1,
    name,
    color
  }
  db.categories.push(newCategory)
  res.status(201).json({ success: true, data: newCategory })
})

app.delete('/api/categories/:id', (req, res) => {
  const index = db.categories.findIndex(c => c.id === parseInt(req.params.id))
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Category not found' })
  }
  const deletedCategory = db.categories.splice(index, 1)
  res.json({ success: true, data: deletedCategory[0] })
})

// ==================== ITEMS ROUTES ====================
app.get('/api/items', (req, res) => {
  res.json({
    success: true,
    data: db.items
  })
})

app.get('/api/items/:id', (req, res) => {
  const item = db.items.find(i => i.id === parseInt(req.params.id))
  if (!item) {
    return res.status(404).json({ success: false, message: 'Item not found' })
  }
  res.json({ success: true, data: item })
})

app.post('/api/items', (req, res) => {
  const { name, category, price } = req.body
  const newItem = {
    id: Math.max(...db.items.map(i => i.id), 0) + 1,
    name,
    category,
    price
  }
  db.items.push(newItem)
  res.status(201).json({ success: true, data: newItem })
})

app.put('/api/items/:id', (req, res) => {
  const item = db.items.find(i => i.id === parseInt(req.params.id))
  if (!item) {
    return res.status(404).json({ success: false, message: 'Item not found' })
  }
  Object.assign(item, req.body)
  res.json({ success: true, data: item })
})

app.delete('/api/items/:id', (req, res) => {
  const index = db.items.findIndex(i => i.id === parseInt(req.params.id))
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Item not found' })
  }
  const deletedItem = db.items.splice(index, 1)
  res.json({ success: true, data: deletedItem[0] })
})

// ==================== DASHBOARD STATS ROUTE ====================
app.get('/api/stats', (req, res) => {
  const completedOrders = db.orders.filter(o => o.status === 'completed')
  const totalRevenue = completedOrders.reduce((sum, o) => sum + o.total, 0)
  const occupiedTables = db.tables.filter(t => t.status === 'occupied').length
  
  res.json({
    success: true,
    data: {
      totalRevenue,
      ordersToday: db.orders.length,
      activeTables: occupiedTables,
      avgOrderTime: '28m'
    }
  })
})

// ==================== HEALTH CHECK ====================
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`)
  console.log(` API Documentation available at http://localhost:${PORT}/api`)
})
