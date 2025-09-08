import React from 'react'
import './Hero.css'
import { Link } from 'react-router-dom'
import hero_img from '../Assets/images/HeroImages/iphone-16-hero-01.webp'

const Hero = () => {



  return (
    <div className='hero'>
      <div className="hero-left">
        <div>
          <h2>Your new iPhone awaits.</h2>
          <h2> Make it yours.</h2>
          <p>Latest iPhones Are Here.</p>
        </div>
        <div className="">
          <Link to='/iphone' className='hero-left-link'>
          <button className='hero-btn' >Shop Now</button>
          </Link> 
           </div>
      </div>
      <div className="hero-right">
        <img src={hero_img} className='hero-img' alt="" />
      </div>
    </div>
  )
}

export default Hero