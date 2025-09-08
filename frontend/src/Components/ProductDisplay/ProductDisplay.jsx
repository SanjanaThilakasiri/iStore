import React, { useContext, useState } from 'react';
import './ProductDisplay.css';
import { ShopContext } from '../../Context/ShopContext';

const ProductDisplay = (props) => {
    const { product } = props;
    const { addToCart } = useContext(ShopContext); 
        
    // State to track the selected main image
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
        
    // Extract images from product 
    const productImages = product.images || [product.image];
        
    // Make sure  always have 4 images for display or repeat if needed
    const displayImages = [...productImages];
    while (displayImages.length < 4) {
        displayImages.push(productImages[0]);
    }
        
    // Handle image click from the thumbnails
    const handleImageClick = (index) => {
        setSelectedImageIndex(index);
    };

    return (
        <div className='productdisplay'>
            <div className="productdisplay-left">
                <div className="productdisplay-img-list">
                    {displayImages.map((img, index) => (
                        <img 
                            key={index}
                            src={img}
                            alt={`${product.name} view ${index + 1}`}
                            onClick={() => handleImageClick(index)}
                            className={selectedImageIndex === index ? 'selected-thumbnail' : ''}
                        />
                    ))}
                </div>
                <div className="productdisplay-img">
                    <img 
                        className='productdisplay-main-img'
                        src={displayImages[selectedImageIndex]}
                        alt={product.name}
                    />
                </div>
            </div>
            <div className="productdisplay-right">
                <h1>{product.name}</h1>
                <h2>Color - {product.color}</h2>
                <div className="productdisplay-right-discription">
                    <p>{product.description || 'No description available'}</p>
                </div>
                <div className="productdisplay-right-pricesdiv">
                    <div className="productdisplay-right-price">
                        LKR {product.price}
                    </div>
                </div>
                <button onClick={() => addToCart(product.id)}>Add To Cart</button>
            </div>
        </div>
    );
};

export default ProductDisplay;