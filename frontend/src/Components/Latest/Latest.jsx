import React ,{ useEffect, useState }from 'react'
import './Latest.css'
import Item from '../Item/Item'

const Latest = () => {

   const [latest_product, setLatest_product] = useState([])
  
    useEffect(()=>{
      fetch('http://localhost:4000/latestarivals')
      .then((response)=>response.json())
      .then((data)=>setLatest_product(data));
  
    },[])


  return (
    <div className='latest'>
        <h1>Latest iPhones</h1>
        {/* <hr />*/}
        <div className="latest-item">
            {latest_product.map((item, i)=>{
                return <Item key={i} id={item.id} name={item.name} color ={item.color} image={item.image} price={item.price}/>
            })}
        </div>
    </div>
  )
}

export default Latest
