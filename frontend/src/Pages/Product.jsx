import React, { useContext, useEffect, useState} from 'react';
import { ShopContext } from '../Context/ShopContext';
import { useParams } from 'react-router-dom';
import Breadcrumb from '../Components/Breadcrumbs/Breadcrumb';
import ProductDisplay from '../Components/ProductDisplay/ProductDisplay';
import RelatedProducts from '../Components/RelatedProducts/RelatedProducts';
import './CSS/Product.css';


const Product = () => {
  const { all_product } = useContext(ShopContext);
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    // Find the product when all_product changes or when productId changes
    if (all_product.length > 0) {
      const foundProduct = all_product.find((e) => e.id === Number(productId));
      setProduct(foundProduct);
      setLoading(false);
    }
  }, [all_product, productId]);

  // Show loading state while waiting for product data
  if (loading) {
    return     <div className="loading"><h1>Loading Product...</h1></div>;
  }

  // Show error if product not found
  if (!product) {
    return <div className="error">Product not found</div>;
  }

  return (
    <div>
      <Breadcrumb product={product} />
      <ProductDisplay product={product} />
      <RelatedProducts />
    </div>
  );
};

export default Product;