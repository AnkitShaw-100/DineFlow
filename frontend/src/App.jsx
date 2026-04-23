import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth, RedirectToSignIn } from '@clerk/react'
import { useTheme } from './context/ThemeContext'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import OrderPage from './pages/OrderPage'
import TablePage from './pages/TablePage'
import AdminPage from './pages/AdminPage'
import AuthPage from './pages/AuthPage'

function App() {
  const { isDark } = useTheme()
  const { isSignedIn, isLoaded } = useAuth()

  if (!isLoaded) {
    return (
      <div className={isDark ? 'dark' : ''}>
        <div className='min-h-screen bg-background text-foreground flex items-center justify-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
        </div>
      </div>
    )
  }

  return (
    <div className={isDark ? 'dark' : ''}>
      <div className='min-h-screen bg-background text-foreground transition-colors duration-300'>
        <Router>
          <Routes>
            {!isSignedIn ? (
              <>
                <Route path="/*" element={<AuthPage />} />
              </>
            ) : (
              <>
                <Route
                  element={<Layout />}
                >
                  <Route index element={<HomePage />} />
                  <Route path="orders" element={<OrderPage />} />
                  <Route path="tables" element={<TablePage />} />
                  <Route path="admin" element={<AdminPage />} />
                </Route>
              </>
            )}
          </Routes>
        </Router>
      </div>
    </div>
  )
}

export default App

