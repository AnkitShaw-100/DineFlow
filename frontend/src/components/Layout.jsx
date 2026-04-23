import { Outlet, Link, useLocation } from 'react-router-dom'
import { UserButton } from '@clerk/react'
import { Menu, Moon, Sun } from 'lucide-react'
import { useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import { Button } from './ui/button'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from './ui/navigation-menu'
import { cn } from '../lib/utils'

export default function Layout() {
  const [isOpen, setIsOpen] = useState(false)
  const { isDark, toggleTheme } = useTheme()
  const location = useLocation()

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/orders', label: 'Orders' },
    { path: '/tables', label: 'Tables' },
    { path: '/admin', label: 'Admin' },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <div className='min-h-screen bg-background'>
      <header className='sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60'>
        <div className='container mx-auto px-4 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-8'>
              <Link to='/' className='flex items-center gap-2'>
                <span className='font-bold text-xl hidden md:inline'>DineFlow</span>
              </Link>

              <NavigationMenu className='hidden md:flex'>
                <NavigationMenuList className='gap-2'>
                  {navItems.map((item) => (
                    <NavigationMenuItem key={item.path}>
                      <Link to={item.path}>
                        <NavigationMenuLink
                          className={cn(
                            'px-4 py-2 rounded-md transition-colors text-sm font-medium',
                            isActive(item.path)
                              ? 'bg-primary text-primary-foreground'
                              : 'hover:bg-accent text-foreground'
                          )}
                        >
                          {item.label}
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            <div className='flex items-center gap-4'>
              <Button
                variant='ghost'
                size='icon'
                onClick={toggleTheme}
                className='w-9 h-9'
              >
                {isDark ? (
                  <Sun className='w-4 h-4' />
                ) : (
                  <Moon className='w-4 h-4' />
                )}
              </Button>
              <div className='hidden md:block'>
                <UserButton />
              </div>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className='md:hidden p-2 hover:bg-accent rounded-md'
              >
                <Menu className='w-5 h-5' />
              </button>
            </div>
          </div>

          {isOpen && (
            <div className='md:hidden mt-4 space-y-2 border-t border-border pt-4'>
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'block px-4 py-2 rounded-md transition-colors',
                    isActive(item.path)
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-accent'
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <div className='px-4 py-2'>
                <UserButton />
              </div>
            </div>
          )}
        </div>
      </header>

      <main className='container mx-auto px-4 py-8'>
        <Outlet />
      </main>
    </div>
  )
}
