import React, { useEffect, useState } from 'react'
import './NewProducts.css'
import Item from '../Item/Item'

const NewProducts = () => {

  const [new_collection, setNew_collection] = useState([]);

  useEffect(()=>{
    fetch('http://localhost:4000/newcollections')
    .then((response)=>response.json())
    .then((data)=>setNew_collection(data));

  },[])

  return (
    <div className='new-products'>
        <h1>New Arrivals</h1>
                {/* <hr />*/}
        <div className="products">
            {new_collection.map((item, i)=>{
                return <Item key={i} id={item.id} name={item.name} color ={item.color}  image={item.image} price={item.price}/>
            })}

        </div>
    </div>
  )
}

export default NewProducts