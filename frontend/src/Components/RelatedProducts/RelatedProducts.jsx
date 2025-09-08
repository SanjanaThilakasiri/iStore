import React, { useContext, useEffect, useState } from 'react';
import './RelatedProducts.css';
import Item from '../Item/Item';
import { ShopContext } from '../../Context/ShopContext';
import { useParams } from 'react-router-dom';

const RelatedProducts = () => {
  const { all_product } = useContext(ShopContext);
  const { productId } = useParams();
  const [relatedProducts, setRelatedProducts] = useState([]);
  
  useEffect(() => {
    // Find the current product to get its category
    if (all_product.length > 0 && productId) {
      const currentProduct = all_product.find((product) => product.id === Number(productId));
      
      if (currentProduct) {
        // Filter products with the same category, excluding the current product
        const related = all_product
          .filter(item => 
            item.category === currentProduct.category && 
            item.id !== currentProduct.id
          )
          .slice(0, 4); // Limit to 4 related products
        
        setRelatedProducts(related);
      }
    }
  }, [all_product, productId]);

  // Only render section if there are related products
  if (relatedProducts.length === 0) {
    return (
      <div className='relatedproducts'>
        <h1>Related Products</h1>
        <h4>Loading related products...</h4>
      </div>
    );
  }

  return (
    <div className='relatedproducts'>
      <h1>Related Products</h1>
      <div className="relatedproducts-item">
        {relatedProducts.map((item, i) => {
          return <Item 
            key={i} 
            id={item.id} 
            name={item.name} 
            color ={item.color} 
            image={item.image} 
            price={item.price}
          />
        })}
      </div>
    </div>
  );
};

export default RelatedProducts;