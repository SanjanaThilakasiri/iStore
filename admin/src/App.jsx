import React, { useState, useEffect } from 'react'
import Navbar from './Components/Navbar/Navbar'
import Admin from './Pages/Admin/Admin'
import AdminLogin from './Pages/AdminLogin'

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem('isAdminLoggedIn') === 'true')
  }, [])

  const handleLogin = () => setIsLoggedIn(true)

  return (
    <div>
      <Navbar />
      {isLoggedIn ? <Admin /> : <AdminLogin onLogin={handleLogin} />}
    </div>
  )
}

export default App