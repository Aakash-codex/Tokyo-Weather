import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import AuthForm from './components/AuthForm'
import Dashboard from './components/Dashboard'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate checking session
    const savedUser = localStorage.getItem('auth_user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setTimeout(() => setIsLoading(false), 800)
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
    localStorage.setItem('auth_user', JSON.stringify(userData))
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('auth_user')
  }

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
      </div>
    )
  }

  return (
    <div className="app-container">
      <AnimatePresence mode="wait">
        {user ? (
          <Dashboard key="dashboard" user={user} onLogout={handleLogout} />
        ) : (
          <AuthForm key="auth" onLogin={handleLogin} />
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
