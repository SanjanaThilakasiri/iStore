import React, { useContext, useEffect, useState } from 'react'
import './CSS/ShopCategory.css'
import { ShopContext } from '../Context/ShopContext'
import dropdown_icon from '../Components/Assets/dropdown_icon.png'
import Item from '../Components/Item/Item'

const ShopCategory = (props) => {
  const { all_product } = useContext(ShopContext);
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [sortOption, setSortOption] = useState("default");
  const [visibleCount, setVisibleCount] = useState(8); //number of products to show
  
  // Filter products by category and handle sorting
  useEffect(() => {
    if (all_product.length > 0) {
      const filteredProducts = all_product.filter(item => item.category === props.category);
      
      // sorting 
      let sortedProducts = [...filteredProducts];
      if (sortOption === "price_asc") {
        sortedProducts.sort((a, b) => a.price - b.price);
      }
       else if (sortOption === "price_desc") {
        sortedProducts.sort((a, b) => b.price - a.price);
      }
      
      setCategoryProducts(sortedProducts);
    }
  }, [all_product, props.category, sortOption]);

  // Load more products
  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 8); // Show 8 more products
  };

  // Handle sort change
  const handleSortChange = () => {
    
    const sortOptions = ["default", "price_asc", "price_desc"];
    const currentIndex = sortOptions.indexOf(sortOption);
    const nextIndex = (currentIndex + 1) % sortOptions.length;
    setSortOption(sortOptions[nextIndex]);
  };

  // Get sort option display text
  const getSortText = () => {
    switch(sortOption) {
      case "price_asc": return "Price: Low to High";
      case "price_desc": return "Price: High to Low";
      default: return "Featured";
    }
  };

  return (
    <div className='shop-category'>
      <div className="shopcategory-indexSort">
        <p>
          <span>Showing {Math.min(visibleCount, categoryProducts.length)}</span> out of {categoryProducts.length} products
        </p>
        <div className="shopcategory-sort" onClick={handleSortChange}>
          Sort by: {getSortText()} <img src={dropdown_icon} alt="" />
        </div>
      </div>
      <div className="shopcategory-products">
        {categoryProducts.slice(0, visibleCount).map((item, i) => {
          return <Item 
            key={i} 
            id={item.id} 
            name={item.name} 
            color = {item.color}
            image={item.image} 
            price={item.price}
          />
        })}
      </div>
      {visibleCount < categoryProducts.length && (
        <div className="shopcategory-loadmore" onClick={handleLoadMore}>
          Explore more
        </div>
      )}
    </div>
  )
}

export default ShopCategory