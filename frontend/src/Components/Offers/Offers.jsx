import React from 'react';
import './Offers.css';
import { Link } from 'react-router-dom'
import hero_img from '../Assets/images/HeroImages/airpods-hero.jpg';

const Offers = () => {
  return (
    <div className='offers'>
      <img src={hero_img} alt="AirPods" className='offers-bg' />
      <div className="offers-content">
        <h2>The</h2>
        <h2>Next Evolution of</h2>
        <h2>Sound and Comfort.</h2>
        <p>Latest AirPods Are Here.</p>
        <Link to='/airpods' className='offers-content-link'>
        <button className='offers-btn'>Shop Now</button>
        </Link>
        
      </div>
    </div>
  );
};

export default Offers;
