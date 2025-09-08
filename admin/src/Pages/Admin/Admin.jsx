import React from 'react'
import './Admin.css'
import Slidebar from '../../Components/Sidebar/Sidebar'
import { Route, Routes, useNavigate } from 'react-router-dom'
import AddProduct from '../../Components/AddProduct/AddProduct'
import ListProduct from '../../Components/ListProduct/ListProduct'
import OrdersHistory from '../../Components/OrdersHistory/ordersHistory'
import AdminContextProvider from '../../Context/AdminContext'
import AdminGlobalAlert from './../../Components/GlobalAlert/AdminGlobalAlert'

const Admin = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    navigate(0); // reloads the page to show login
  };
  
  return (
    <div className='admin'>
      <AdminContextProvider>
        <div className="admin-logout-container">
          <button onClick={handleLogout} className="admin-logout-btn">
            Logout
          </button>
        </div>
        <Slidebar />
        <Routes>
          {/* Default route - show OrdersHistory when no specific path is matched */}
          <Route path="/" element={<OrdersHistory />} />
          <Route path="/addproduct" element={<AddProduct />} />
          <Route path="/listproduct" element={<ListProduct />} />
          <Route path="/ordershistory" element={<OrdersHistory />} />
        </Routes>
        <AdminGlobalAlert />
      </AdminContextProvider>
    </div>
  )
}

export default Admin