import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Plus, Users, Clock } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { apiClient } from '../lib/api'

export default function TablePage() {
  const [tables, setTables] = useState([])
  const [newTableNumber, setNewTableNumber] = useState('')
  const [newTableCapacity, setNewTableCapacity] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTables()
  }, [])

  const fetchTables = async () => {
    try {
      const res = await apiClient.getTables()
      if (res.success) {
        setTables(res.data)
      }
    } catch (error) {
      console.error('Error fetching tables:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    return status === 'occupied'
      ? 'bg-red-500/20 text-red-700 dark:text-red-400'
      : 'bg-green-500/20 text-green-700 dark:text-green-400'
  }

  const addTable = async () => {
    if (newTableNumber && newTableCapacity) {
      try {
        const res = await apiClient.createTable({
          number: parseInt(newTableNumber),
          capacity: parseInt(newTableCapacity),
        })
        if (res.success) {
          setTables([...tables, res.data])
          setNewTableNumber('')
          setNewTableCapacity('')
        }
      } catch (error) {
        console.error('Error adding table:', error)
      }
    }
  }

  const toggleTableStatus = async (id) => {
    const table = tables.find(t => t.id === id)
    if (table) {
      try {
        const updatedStatus = table.status === 'occupied' ? 'empty' : 'occupied'
        const res = await apiClient.updateTable(id, {
          ...table,
          status: updatedStatus,
          occupiedSince: updatedStatus === 'occupied' ? new Date().toLocaleTimeString() : null,
        })
        if (res.success) {
          setTables(tables.map(t => t.id === id ? res.data : t))
        }
      } catch (error) {
        console.error('Error updating table:', error)
      }
    }
  }

  const deleteTable = async (id) => {
    try {
      const res = await apiClient.deleteTable(id)
      if (res.success) {
        setTables(tables.filter(t => t.id !== id))
      }
    } catch (error) {
      console.error('Error deleting table:', error)
    }
  }

  const occupiedCount = tables.filter(t => t.status === 'occupied').length
  const totalCapacity = tables.reduce((sum, t) => sum + t.capacity, 0)

  if (loading) {
    return (
      <div className='flex justify-center py-8'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold mb-2'>Tables Management</h1>
        <p className='text-muted-foreground'>
          Manage all tables and their status
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <Card>
          <CardHeader className='pb-3'>
            <CardTitle className='text-sm font-medium'>Total Tables</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{tables.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='pb-3'>
            <CardTitle className='text-sm font-medium'>Occupied</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-red-500'>{occupiedCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='pb-3'>
            <CardTitle className='text-sm font-medium'>Total Capacity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{totalCapacity}</div>
          </CardContent>
        </Card>
      </div>

      <div className='flex justify-end'>
        <Dialog>
          <DialogTrigger asChild>
            <Button className='gap-2'>
              <Plus className='w-4 h-4' />
              Add Table
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Table</DialogTitle>
              <DialogDescription>Add a new table to your restaurant</DialogDescription>
            </DialogHeader>
            <div className='space-y-4'>
              <div>
                <Label htmlFor='table-number'>Table Number</Label>
                <Input
                  id='table-number'
                  placeholder='e.g., 9'
                  value={newTableNumber}
                  onChange={(e) => setNewTableNumber(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor='table-capacity'>Capacity</Label>
                <Input
                  id='table-capacity'
                  placeholder='e.g., 4'
                  value={newTableCapacity}
                  onChange={(e) => setNewTableCapacity(e.target.value)}
                />
              </div>
              <Button onClick={addTable} className='w-full'>
                Add Table
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {tables.map((table) => (
          <Card
            key={table.id}
            className={`hover:shadow-lg transition-all cursor-pointer ${
              table.status === 'occupied' ? 'border-red-500/30' : 'border-green-500/30'
            }`}
            onClick={() => toggleTableStatus(table.id)}
          >
            <CardHeader className='pb-3'>
              <div className='flex items-start justify-between'>
                <div>
                  <CardTitle className='text-2xl'>Table {table.number}</CardTitle>
                  <CardDescription className='flex items-center gap-1 mt-1'>
                    <Users className='w-3 h-3' />
                    Capacity: {table.capacity}
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(table.status)}>
                  {table.status === 'occupied' ? 'Occupied' : 'Available'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {table.occupiedSince && (
                <p className='text-sm text-muted-foreground flex items-center gap-2'>
                  <Clock className='w-3 h-3' />
                  Since {table.occupiedSince}
                </p>
              )}
              <div className='mt-4 flex gap-2'>
                <Button
                  size='sm'
                  variant='outline'
                  className='flex-1'
                  onClick={(e) => {
                    e.stopPropagation()
                  }}
                >
                  View Order
                </Button>
                <Button
                  size='sm'
                  variant='destructive'
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteTable(table.id)
                  }}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
