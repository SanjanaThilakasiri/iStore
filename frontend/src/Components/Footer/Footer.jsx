import React from 'react'
import { Link } from 'react-router-dom'
import './Footer.css'
import logo from '../Assets/logo.png'
import instagram from '../Assets/instagram_icon.png'
import whatsapp from '../Assets/whatsapp_icon.png'
import facebook from '../Assets/facebook.png'
import tiktok from '../Assets/tik-tok.png'
import mail from '../Assets/mail.png'

const Footer = () => {
  return (
    <div className='footer'>
        <div className="footer-logo">
            <img src={logo} alt="Company Logo" />
         </div>
                       
        <div className="footer-social-icon">
            <a href="https://web.facebook.com/apple/?_rdc=1&_rdr#" target="_blank" rel="noopener noreferrer">
                <div className="footer-icons-container">
                    <img src={facebook} alt="Facebook" className='footer-icon' />
                </div>
            </a>
            <a href="https://www.instagram.com/apple/" target="_blank" rel="noopener noreferrer">
                <div className="footer-icons-container">
                    <img src={instagram} alt="Instagram" className='footer-icon' />
                </div>
            </a>
            <a href="https://www.whatsapp.com/" target="_blank" rel="noopener noreferrer">
                <div className="footer-icons-container">
                    <img src={whatsapp} alt="WhatsApp" className='footer-icon' />
                </div>
            </a>
            <a href="https://www.tiktok.com/@apple?lang=en" target="_blank" rel="noopener noreferrer">
                <div className="footer-icons-container">
                    <img src={tiktok} alt="TikTok" className='footer-icon' />
                </div>
            </a>
            <a href="istore@gmail.com">
                <div className="footer-icons-container">
                    <img src={mail} alt="Email" className='footer-icon' />
                </div>
            </a>
        </div>
        <div className="footer-copyright">
            <hr />
            <p>Copyright @2025 iStore</p>
        </div>
    </div>
  )
}

export default Footer