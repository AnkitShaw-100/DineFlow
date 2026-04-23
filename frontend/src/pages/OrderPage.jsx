import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Input } from '../components/ui/input'
import { Search, Plus, Eye, Edit, Trash2 } from 'lucide-react'
import { apiClient } from '../lib/api'

export default function OrderPage() {
  const [orders, setOrders] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const res = await apiClient.getOrders()
      if (res.success) {
        setOrders(res.data)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteOrder = async (id) => {
    try {
      const res = await apiClient.deleteOrder(id)
      if (res.success) {
        setOrders(orders.filter(o => o.id !== id))
        setSelectedOrder(null)
      }
    } catch (error) {
      console.error('Error deleting order:', error)
    }
  }

  const handleMarkCompleted = async (id) => {
    try {
      const order = orders.find(o => o.id === id)
      const res = await apiClient.updateOrder(id, { ...order, status: 'completed' })
      if (res.success) {
        setOrders(orders.map(o => o.id === id ? res.data : o))
        setSelectedOrder(res.data)
      }
    } catch (error) {
      console.error('Error updating order:', error)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-700 dark:text-green-400'
      case 'preparing':
        return 'bg-blue-500/20 text-blue-700 dark:text-blue-400'
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400'
      default:
        return 'bg-gray-500/20 text-gray-700 dark:text-gray-400'
    }
  }

  const filteredOrders = orders.filter(
    (order) =>
      order.tableNumber.toString().includes(searchTerm) ||
      order.items.some((item) => item.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold mb-2'>Orders</h1>
        <p className='text-muted-foreground'>
          Manage all orders for your restaurant
        </p>
      </div>

      <div className='flex gap-4 items-center'>
        <div className='relative flex-1'>
          <Search className='absolute left-3 top-3 w-4 h-4 text-muted-foreground' />
          <Input
            placeholder='Search by table number or item...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='pl-10'
          />
        </div>
        <Button className='gap-2'>
          <Plus className='w-4 h-4' />
          New Order
        </Button>
      </div>

      {loading ? (
        <div className='flex justify-center py-8'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
        </div>
      ) : (
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          <div className='lg:col-span-2 space-y-4'>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <Card
                  key={order.id}
                  className='hover:shadow-lg transition-shadow cursor-pointer'
                  onClick={() => setSelectedOrder(order)}
                >
                  <CardContent className='pt-6'>
                    <div className='flex items-start justify-between mb-4'>
                      <div>
                        <h3 className='font-semibold text-lg'>Table {order.tableNumber}</h3>
                        <p className='text-sm text-muted-foreground'>{order.time}</p>
                      </div>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </div>

                    <div className='mb-4'>
                      <p className='text-sm font-medium mb-2'>Items:</p>
                      <div className='flex flex-wrap gap-2'>
                        {order.items.map((item, i) => (
                          <Badge key={i} variant='secondary'>
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className='flex items-center justify-between pt-4 border-t border-border'>
                      <div>
                        <p className='text-sm text-muted-foreground'>Total</p>
                        <p className='text-xl font-bold'>₹{order.total}</p>
                      </div>
                      <div className='flex gap-2'>
                        <Button size='sm' variant='outline' className='gap-2'>
                          <Eye className='w-4 h-4' />
                          View
                        </Button>
                        <Button size='sm' variant='outline' className='gap-2'>
                          <Edit className='w-4 h-4' />
                          Edit
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className='pt-6'>
                  <p className='text-muted-foreground text-center'>No orders found</p>
                </CardContent>
              </Card>
            )}
          </div>

          {selectedOrder && (
            <Card>
              <CardHeader>
                <CardTitle>Order Details</CardTitle>
                <CardDescription>Table {selectedOrder.tableNumber}</CardDescription>
              </CardHeader>
              <CardContent className='space-y-6'>
                <div>
                  <h4 className='font-semibold mb-3'>Items Ordered:</h4>
                  <div className='space-y-2'>
                    {selectedOrder.items.map((item, i) => (
                      <div
                        key={i}
                        className='flex justify-between items-center p-2 bg-accent/50 rounded'
                      >
                        <span>{item}</span>
                        <span className='font-medium'>₹{Math.floor(selectedOrder.total / selectedOrder.items.length)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className='border-t border-border pt-4'>
                  <div className='flex justify-between mb-2'>
                    <span className='text-muted-foreground'>Subtotal:</span>
                    <span>₹{selectedOrder.total}</span>
                  </div>
                  <div className='flex justify-between mb-2'>
                    <span className='text-muted-foreground'>Tax:</span>
                    <span>₹{Math.floor(selectedOrder.total * 0.1)}</span>
                  </div>
                  <div className='flex justify-between font-bold text-lg pt-2 border-t border-border'>
                    <span>Total:</span>
                    <span>₹{Math.floor(selectedOrder.total * 1.1)}</span>
                  </div>
                </div>

                <div className='space-y-2'>
                  <Button 
                    className='w-full' 
                    onClick={() => handleMarkCompleted(selectedOrder.id)}
                    disabled={selectedOrder.status === 'completed'}
                  >
                    Mark as Completed
                  </Button>
                  <Button 
                    variant='destructive' 
                    className='w-full gap-2'
                    onClick={() => handleDeleteOrder(selectedOrder.id)}
                  >
                    <Trash2 className='w-4 h-4' />
                    Cancel Order
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
