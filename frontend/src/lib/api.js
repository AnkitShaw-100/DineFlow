const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export const apiClient = {
  // ==================== ORDERS ====================
  getOrders: async () => {
    const res = await fetch(`${API_BASE_URL}/orders`)
    return res.json()
  },

  getOrder: async (id) => {
    const res = await fetch(`${API_BASE_URL}/orders/${id}`)
    return res.json()
  },

  createOrder: async (order) => {
    const res = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    })
    return res.json()
  },

  updateOrder: async (id, order) => {
    const res = await fetch(`${API_BASE_URL}/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    })
    return res.json()
  },

  deleteOrder: async (id) => {
    const res = await fetch(`${API_BASE_URL}/orders/${id}`, {
      method: 'DELETE',
    })
    return res.json()
  },

  // ==================== TABLES ====================
  getTables: async () => {
    const res = await fetch(`${API_BASE_URL}/tables`)
    return res.json()
  },

  createTable: async (table) => {
    const res = await fetch(`${API_BASE_URL}/tables`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(table),
    })
    return res.json()
  },

  updateTable: async (id, table) => {
    const res = await fetch(`${API_BASE_URL}/tables/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(table),
    })
    return res.json()
  },

  deleteTable: async (id) => {
    const res = await fetch(`${API_BASE_URL}/tables/${id}`, {
      method: 'DELETE',
    })
    return res.json()
  },

  // ==================== CATEGORIES ====================
  getCategories: async () => {
    const res = await fetch(`${API_BASE_URL}/categories`)
    return res.json()
  },

  createCategory: async (category) => {
    const res = await fetch(`${API_BASE_URL}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(category),
    })
    return res.json()
  },

  deleteCategory: async (id) => {
    const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'DELETE',
    })
    return res.json()
  },

  // ==================== ITEMS ====================
  getItems: async () => {
    const res = await fetch(`${API_BASE_URL}/items`)
    return res.json()
  },

  getItem: async (id) => {
    const res = await fetch(`${API_BASE_URL}/items/${id}`)
    return res.json()
  },

  createItem: async (item) => {
    const res = await fetch(`${API_BASE_URL}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    })
    return res.json()
  },

  updateItem: async (id, item) => {
    const res = await fetch(`${API_BASE_URL}/items/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    })
    return res.json()
  },

  deleteItem: async (id) => {
    const res = await fetch(`${API_BASE_URL}/items/${id}`, {
      method: 'DELETE',
    })
    return res.json()
  },

  // ==================== STATS ====================
  getStats: async () => {
    const res = await fetch(`${API_BASE_URL}/stats`)
    return res.json()
  },

  // ==================== HEALTH ====================
  healthCheck: async () => {
    const res = await fetch(`${API_BASE_URL}/health`)
    return res.json()
  },
}
