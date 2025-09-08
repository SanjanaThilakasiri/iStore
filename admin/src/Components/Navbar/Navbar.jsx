import React from 'react'
import './Navbar.css'
import logo from '../../assets/iStore.png'
import profile from '../../assets/user.png'

const Navbar = () => {
  return (
    <div className='navbar'>
        <img src={logo} className='nav-logo' alt="" />
    </div>
  )
}

export default Navbar