// In-memory database for DineFlow
// This can be replaced with MongoDB in production

let db = {
  orders: [
    {
      id: 1,
      tableNumber: 5,
      items: ['Butter Chicken', 'Naan', 'Biryani'],
      total: 850,
      status: 'completed',
      time: '2:30 PM',
    },
    {
      id: 2,
      tableNumber: 3,
      items: ['Tandoori Chicken', 'Paratha'],
      total: 620,
      status: 'preparing',
      time: '2:45 PM',
    },
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
  ],
}

// Helper function to get next ID
const getNextId = (arr) => {
  return arr.length > 0 ? Math.max(...arr.map((item) => item.id)) + 1 : 1
}

module.exports = {
  db,
  getNextId,
}
