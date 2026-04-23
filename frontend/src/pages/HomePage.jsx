import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { TrendingUp, Users, Utensils, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { apiClient } from '../lib/api'

export default function HomePage() {
  const [stats, setStats] = useState({
    totalRevenue: '₹0',
    ordersToday: 0,
    activeTables: 0,
    avgOrderTime: '0m',
  })
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, ordersRes] = await Promise.all([
          apiClient.getStats(),
          apiClient.getOrders(),
        ])

        if (statsRes.success) {
          setStats({
            totalRevenue: `₹${statsRes.data.totalRevenue}`,
            ordersToday: statsRes.data.ordersToday,
            activeTables: statsRes.data.activeTables,
            avgOrderTime: statsRes.data.avgOrderTime,
          })
        }

        if (ordersRes.success) {
          setOrders(ordersRes.data.slice(0, 3))
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const statCards = [
    {
      title: 'Total Revenue',
      value: stats.totalRevenue,
      description: 'Today\'s earnings',
      icon: TrendingUp,
      color: 'text-green-500',
    },
    {
      title: 'Orders Today',
      value: stats.ordersToday,
      description: 'Orders completed',
      icon: Users,
      color: 'text-blue-500',
    },
    {
      title: 'Active Tables',
      value: stats.activeTables,
      description: 'Currently occupied',
      icon: Utensils,
      color: 'text-orange-500',
    },
    {
      title: 'Avg. Time',
      value: stats.avgOrderTime,
      description: 'Per order',
      icon: Clock,
      color: 'text-purple-500',
    },
  ]

  return (
    <div className='space-y-8'>
      <div>
        <h1 className='text-4xl font-bold mb-2'>Welcome to DineFlow</h1>
        <p className='text-muted-foreground text-lg'>
          Manage your restaurant operations efficiently
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className='hover:shadow-lg transition-shadow'>
              <CardHeader className='pb-3'>
                <div className='flex items-center justify-between'>
                  <CardTitle className='text-sm font-medium'>
                    {stat.title}
                  </CardTitle>
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>{stat.value}</div>
                <p className='text-xs text-muted-foreground mt-1'>
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Last orders from today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {loading ? (
                <p className='text-muted-foreground'>Loading orders...</p>
              ) : orders.length > 0 ? (
                orders.map((order) => (
                  <div
                    key={order.id}
                    className='flex items-center justify-between p-3 bg-accent/50 rounded-lg'
                  >
                    <div>
                      <p className='font-medium'>Table {order.tableNumber}</p>
                      <p className='text-sm text-muted-foreground'>₹{order.total}</p>
                    </div>
                    <span className='text-xs bg-green-500/20 text-green-700 dark:text-green-400 px-2 py-1 rounded'>
                      {order.status}
                    </span>
                  </div>
                ))
              ) : (
                <p className='text-muted-foreground'>No orders yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your restaurant</CardDescription>
          </CardHeader>
          <CardContent className='space-y-3'>
            <Link to='/orders' className='block'>
              <Button className='w-full justify-start' variant='outline'>
                View All Orders
              </Button>
            </Link>
            <Link to='/tables' className='block'>
              <Button className='w-full justify-start' variant='outline'>
                Manage Tables
              </Button>
            </Link>
            <Link to='/admin' className='block'>
              <Button className='w-full justify-start' variant='outline'>
                Admin Panel
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
