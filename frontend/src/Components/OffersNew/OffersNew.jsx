

import React from 'react';
import './OffersNew.css';
import { Link } from 'react-router-dom'
import hero_img from '../Assets/images/HeroImages/ipad-hero-02.webp';

const OffersNew = () => {
  return (
    <div className='offersNew'>
      <img src={hero_img} alt="AirPods" className='offersNew-bg' />
      <div className="offersNew-content">
               <h2>Touch,</h2>
               <h2>draw, and type</h2>
               <h2>on one magical device.</h2>
               <p>Latest iPads Are Here.</p>
               <Link to='/ipad' className='offersNew-content-link'>
               <button className='offersNew-btn'>Shop Now</button>
               </Link>
               
      </div>
    </div>
  );
};

export default OffersNew;
