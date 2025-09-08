import React from 'react'
import './Sidebar.css'
import {Link, useLocation} from 'react-router-dom'
import add_product from '../../assets/add_product.png'
import list_product from '../../assets/list_product.png'
import information from '../../assets/information.png'

const Sidebar = () => {
  const location = useLocation();
  
  return (
    <div className='sidebar'>
      <Link 
        to={'/ordershistory'} 
        className={`slidebar-link ${location.pathname === '/ordershistory' || location.pathname === '/' ? 'active' : ''}`}
      >
        <div className="sidebar-item">
          <img src={information} alt="" />
          <p>Orders History</p>
        </div>
      </Link>
      
      <Link 
        to={'/addproduct'} 
        className={`slidebar-link ${location.pathname === '/addproduct' ? 'active' : ''}`}
      >
        <div className="sidebar-item">
          <img src={add_product} alt="" />
          <p>Add Product</p>
        </div>
      </Link>
      
      <Link 
        to={'/listproduct'} 
        className={`slidebar-link ${location.pathname === '/listproduct' ? 'active' : ''}`}
      >
        <div className="sidebar-item">
          <img src={list_product} alt="" />
          <p>List Product</p>
        </div>
      </Link>
    </div>
  )
}

export default Sidebar