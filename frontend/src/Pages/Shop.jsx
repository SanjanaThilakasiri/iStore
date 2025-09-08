import React from 'react'
import Hero from '../Components/Hero/Hero'
import Latest from '../Components/Latest/Latest'
import Offers from '../Components/Offers/Offers'
import NewProducts from '../Components/NewProducts/NewProducts'
import OffersNew from '../Components/OffersNew/OffersNew'

const Shop = () => {
  return (
    <div>
      <Hero/>
      <Latest/>
      <Offers/>
      <NewProducts/>
      <OffersNew/>
    </div>
  )
}

export default Shop