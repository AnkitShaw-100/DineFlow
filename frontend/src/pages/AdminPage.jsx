import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Badge } from '../components/ui/badge'
import { Plus, Trash2, Edit2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog'
import { apiClient } from '../lib/api'

export default function AdminPage() {
  const [categories, setCategories] = useState([])
  const [items, setItems] = useState([])
  const [tables, setTables] = useState([])
  const [loading, setLoading] = useState(true)

  const [newCategory, setNewCategory] = useState('')
  const [newCategoryColor, setNewCategoryColor] = useState('#EF4444')
  const [newItem, setNewItem] = useState({ name: '', category: '', price: '' })
  const [newTable, setNewTable] = useState({ number: '', capacity: '' })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [catsRes, itemsRes, tablesRes] = await Promise.all([
        apiClient.getCategories(),
        apiClient.getItems(),
        apiClient.getTables(),
      ])

      if (catsRes.success) setCategories(catsRes.data)
      if (itemsRes.success) setItems(itemsRes.data)
      if (tablesRes.success) setTables(tablesRes.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const addCategory = async () => {
    if (newCategory) {
      try {
        const res = await apiClient.createCategory({
          name: newCategory,
          color: newCategoryColor,
        })
        if (res.success) {
          setCategories([...categories, res.data])
          setNewCategory('')
          setNewCategoryColor('#EF4444')
        }
      } catch (error) {
        console.error('Error adding category:', error)
      }
    }
  }

  const deleteCategory = async (id) => {
    try {
      const res = await apiClient.deleteCategory(id)
      if (res.success) {
        setCategories(categories.filter(c => c.id !== id))
      }
    } catch (error) {
      console.error('Error deleting category:', error)
    }
  }

  const addItem = async () => {
    if (newItem.name && newItem.category && newItem.price) {
      try {
        const res = await apiClient.createItem({
          name: newItem.name,
          category: newItem.category,
          price: parseInt(newItem.price),
        })
        if (res.success) {
          setItems([...items, res.data])
          setNewItem({ name: '', category: categories[0]?.name || '', price: '' })
        }
      } catch (error) {
        console.error('Error adding item:', error)
      }
    }
  }

  const deleteItem = async (id) => {
    try {
      const res = await apiClient.deleteItem(id)
      if (res.success) {
        setItems(items.filter(i => i.id !== id))
      }
    } catch (error) {
      console.error('Error deleting item:', error)
    }
  }

  const addTable = async () => {
    if (newTable.number && newTable.capacity) {
      try {
        const res = await apiClient.createTable({
          number: parseInt(newTable.number),
          capacity: parseInt(newTable.capacity),
        })
        if (res.success) {
          setTables([...tables, res.data])
          setNewTable({ number: '', capacity: '' })
        }
      } catch (error) {
        console.error('Error adding table:', error)
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
        <h1 className='text-3xl font-bold mb-2'>Admin Panel</h1>
        <p className='text-muted-foreground'>
          Manage categories, items, and tables
        </p>
      </div>

      <Tabs defaultValue='items' className='w-full'>
        <TabsList className='grid w-full grid-cols-3'>
          <TabsTrigger value='items'>Menu Items</TabsTrigger>
          <TabsTrigger value='categories'>Categories</TabsTrigger>
          <TabsTrigger value='tables'>Tables</TabsTrigger>
        </TabsList>

        <TabsContent value='items' className='space-y-4'>
          <Card>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle>Menu Items</CardTitle>
                  <CardDescription>Add and manage restaurant menu items</CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className='gap-2'>
                      <Plus className='w-4 h-4' />
                      Add Item
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Item</DialogTitle>
                      <DialogDescription>Add a new item to your menu</DialogDescription>
                    </DialogHeader>
                    <div className='space-y-4'>
                      <div>
                        <Label htmlFor='item-name'>Item Name</Label>
                        <Input
                          id='item-name'
                          placeholder='e.g., Butter Chicken'
                          value={newItem.name}
                          onChange={(e) =>
                            setNewItem({ ...newItem, name: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor='item-category'>Category</Label>
                        <select
                          id='item-category'
                          className='w-full px-3 py-2 border border-input rounded-md bg-background'
                          value={newItem.category}
                          onChange={(e) =>
                            setNewItem({ ...newItem, category: e.target.value })
                          }
                        >
                          <option value=''>Select a category</option>
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.name}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Label htmlFor='item-price'>Price (₹)</Label>
                        <Input
                          id='item-price'
                          placeholder='e.g., 350'
                          type='number'
                          value={newItem.price}
                          onChange={(e) =>
                            setNewItem({ ...newItem, price: e.target.value })
                          }
                        />
                      </div>
                      <Button onClick={addItem} className='w-full'>
                        Add Item
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className='space-y-3'>
                {items.length > 0 ? (
                  items.map((item) => (
                    <div
                      key={item.id}
                      className='flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition'
                    >
                      <div className='flex items-center gap-4 flex-1'>
                        <span className='text-2xl'>🍽️</span>
                        <div>
                          <p className='font-semibold'>{item.name}</p>
                          <div className='flex items-center gap-2 mt-1'>
                            <Badge variant='secondary'>{item.category}</Badge>
                            <span className='text-sm text-muted-foreground'>₹{item.price}</span>
                          </div>
                        </div>
                      </div>
                      <div className='flex gap-2'>
                        <Button size='sm' variant='outline' className='gap-2'>
                          <Edit2 className='w-4 h-4' />
                        </Button>
                        <Button
                          size='sm'
                          variant='destructive'
                          onClick={() => deleteItem(item.id)}
                          className='gap-2'
                        >
                          <Trash2 className='w-4 h-4' />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className='text-muted-foreground text-center py-4'>No items yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='categories' className='space-y-4'>
          <Card>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle>Categories</CardTitle>
                  <CardDescription>Manage menu categories</CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className='gap-2'>
                      <Plus className='w-4 h-4' />
                      Add Category
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Category</DialogTitle>
                      <DialogDescription>Create a new menu category</DialogDescription>
                    </DialogHeader>
                    <div className='space-y-4'>
                      <div>
                        <Label htmlFor='cat-name'>Category Name</Label>
                        <Input
                          id='cat-name'
                          placeholder='e.g., North Indian'
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor='cat-color'>Color</Label>
                        <div className='flex gap-2'>
                          <input
                            id='cat-color'
                            type='color'
                            value={newCategoryColor}
                            onChange={(e) => setNewCategoryColor(e.target.value)}
                            className='w-12 h-10 rounded cursor-pointer'
                          />
                          <span className='text-sm text-muted-foreground mt-2'>
                            {newCategoryColor}
                          </span>
                        </div>
                      </div>
                      <Button onClick={addCategory} className='w-full'>
                        Add Category
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className='space-y-3'>
                {categories.length > 0 ? (
                  categories.map((cat) => (
                    <div
                      key={cat.id}
                      className='flex items-center justify-between p-4 border border-border rounded-lg'
                    >
                      <div className='flex items-center gap-4'>
                        <div
                          className='w-6 h-6 rounded-full'
                          style={{ backgroundColor: cat.color }}
                        />
                        <p className='font-semibold'>{cat.name}</p>
                      </div>
                      <Button
                        size='sm'
                        variant='destructive'
                        onClick={() => deleteCategory(cat.id)}
                        className='gap-2'
                      >
                        <Trash2 className='w-4 h-4' />
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className='text-muted-foreground text-center py-4'>No categories yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='tables' className='space-y-4'>
          <Card>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle>Tables</CardTitle>
                  <CardDescription>Manage restaurant tables</CardDescription>
                </div>
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
                        <Label htmlFor='table-num'>Table Number</Label>
                        <Input
                          id='table-num'
                          placeholder='e.g., 9'
                          value={newTable.number}
                          onChange={(e) =>
                            setNewTable({ ...newTable, number: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor='table-cap'>Capacity</Label>
                        <Input
                          id='table-cap'
                          placeholder='e.g., 4'
                          value={newTable.capacity}
                          onChange={(e) =>
                            setNewTable({ ...newTable, capacity: e.target.value })
                          }
                        />
                      </div>
                      <Button onClick={addTable} className='w-full'>
                        Add Table
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className='space-y-3'>
                {tables.length > 0 ? (
                  tables.map((table) => (
                    <div
                      key={table.id}
                      className='flex items-center justify-between p-4 border border-border rounded-lg'
                    >
                      <div>
                        <p className='font-semibold'>Table {table.number}</p>
                        <p className='text-sm text-muted-foreground'>
                          Capacity: {table.capacity} persons
                        </p>
                      </div>
                      <Button
                        size='sm'
                        variant='destructive'
                        onClick={() => deleteTable(table.id)}
                        className='gap-2'
                      >
                        <Trash2 className='w-4 h-4' />
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className='text-muted-foreground text-center py-4'>No tables yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
