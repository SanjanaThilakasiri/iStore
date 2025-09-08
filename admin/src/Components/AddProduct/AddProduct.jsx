import React, { useState, useContext } from 'react';
import './AddProduct.css';
import upload_icon from '../../assets/upload_icon.png';
import { AdminContext } from '../../Context/AdminContext'; 

const AddProduct = () => {
    const [images, setImages] = useState([]);
    const [productDetails, setProductDetails] = useState({
        name: "",
        image: "",
        images: [],
        category: "",
        color:"",
        price: "",
        description: ""
    });

    // Get alert functions from AdminContext
    const { showGlobalAlert } = useContext(AdminContext);

    const imageHandler = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            // Convert FileList to array
            const newFiles = Array.from(e.target.files);
            
            // Combine with existing images but limit to 4 total
            const updatedImages = [...images, ...newFiles].slice(0, 4);
            setImages(updatedImages);
        }
    };

    const changeHandler = (e) => {
        setProductDetails({...productDetails, [e.target.name]: e.target.value});
    };

    const Add_Product = async () => {
        console.log(productDetails);
        
        // Validate required fields
        if (!productDetails.name || !productDetails.price || !productDetails.category) {
            showGlobalAlert(
                "Please fill all required fields: Product Title, Price, and Category", 
                "validation"
            );
            return;
        }

        if (images.length === 0) {
            showGlobalAlert(
                "Please select at least one image before adding the product", 
                "validation"
            );
            return;
        }

        // Validate price is a number
        if (isNaN(productDetails.price) || parseFloat(productDetails.price) <= 0) {
            showGlobalAlert(
                "Please enter a valid price greater than 0", 
                "validation"
            );
            return;
        }

        let responseData;
        let product = productDetails;

        try {
            

            if (images.length > 0) {
                let formData = new FormData();
                
                // Append all images to form data
                images.forEach(image => {
                    formData.append('productImages', image);
                });
                
                // Upload multiple images
                const uploadResponse = await fetch('http://localhost:4000/uploadmultiple', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                    },
                    body: formData,
                });
                
                responseData = await uploadResponse.json();
                
                if (responseData.success) {
                    // Store the first image as the main image for backward compatibility
                    product.image = responseData.image_urls[0];
                    // Store all images in the images array
                    product.images = responseData.image_urls;
                    
                    console.log(product);
                    
                    // Send product data to server
                    const productResponse = await fetch('http://localhost:4000/addproducts', {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(product),
                    });
                    
                    const productData = await productResponse.json();
                    
                    if (productData.success) {
                        // Show success alert
                        showGlobalAlert(
                            `Product "${productDetails.name}" has been added successfully!`, 
                            "success"
                        );
                        
                        // Reset form after successful addition
                        setProductDetails({
                            name: "",
                            image: "",
                            images: [],
                            category: "",
                            color:"",
                            price: "",
                            description: ""
                        });
                        setImages([]);
                    } else {
                        showGlobalAlert(
                            "Failed to add product. Please try again.", 
                            "error"
                        );
                    }
                } else {
                    showGlobalAlert(
                        "Failed to upload images. Please try again with different images.", 
                        "error"
                    );
                }
            }
        } catch (error) {
            console.error('Error adding product:', error);
            showGlobalAlert(
                "An error occurred while adding the product. Please check your internet connection and try again.", 
                "error"
            );
        }
    };

    return (
        <div className='add-product'>
            <div className='add-product-item-field'>
                <p>Product Title</p>
                <input 
                    value={productDetails.name} 
                    onChange={changeHandler} 
                    type="text" 
                    name='name' 
                    placeholder='Product Title' 
                />
            </div>
            
            <div className='add-product-item-field'>
                <p>Product Color</p>
                <input 
                    value={productDetails.color} 
                    onChange={changeHandler} 
                    type="text" 
                    name='color' 
                    placeholder='Product Color' 
                />
            </div>
            
            <div className='add-product-item-field'>
                <p>Product Description</p>
                <textarea 
                    className='textarea'
                    value={productDetails.description} 
                    onChange={changeHandler} 
                    name='description' 
                    placeholder='Product Description'
                    rows="4"
                />
            </div>
            
            <div className='add-product-price_category'>
                <div className='add-product-item-field'>
                    <p>Price</p>
                    <input 
                        value={productDetails.price} 
                        onChange={changeHandler} 
                        type="number" 
                        name='price' 
                        placeholder='Price' 
                        min="0"
                        step="0.01"
                    />
                </div>
                <div className='add-product-item-field'>
                    <p>Product Category</p>
                    <select 
                        value={productDetails.category} 
                        onChange={changeHandler} 
                        name="category" 
                        className='add-product-selector'
                        required
                    >
                        <option value="" disabled>Select category</option>
                        <option value="iphone">iPhone</option>
                        <option value="mac">Mac</option>
                        <option value="ipad">iPad</option>
                        <option value="iwatch">iWatch</option>
                        <option value="airpod">AirPod</option>
                        <option value="accessories">Accessories</option>
                    </select>
                </div>
            </div>
            
            <div className='add-product-item-field'>
                <p>Product Images (Select up to 4 images)</p>
                <div className="add-product-image-container">
                    {/* Main upload area */}
                    <label htmlFor="file-input" className='image-upload-container'>
                        {images.length === 0 && (
                            <img src={upload_icon} className='add-product-upload-icon' alt="Upload" />
                        )}
                        {images.length === 1 && (
                            <img 
                                src={URL.createObjectURL(images[0])} 
                                className='add-product-main-preview' 
                                alt="Preview" 
                            />
                        )}
                        {images.length > 1 && (
                            <div className='image-preview-grid'>
                                {images.map((img, index) => (
                                    <img 
                                        key={index}
                                        src={URL.createObjectURL(img)} 
                                        className='image-preview' 
                                        alt={`Preview ${index}`} 
                                    />
                                ))}
                            </div>
                        )}
                        <div className="image-count-badge">
                            {images.length > 0 ? `${images.length}/4 images` : "No images"}
                        </div>
                    </label>
                    
                    {/* Thumbnail preview section */}
                    {images.length > 0 && (
                        <div className="add-product-thumbnails">
                            {images.map((img, index) => (
                                <div key={index} className="thumbnail-container">
                                    <img 
                                        src={URL.createObjectURL(img)} 
                                        className='thumbnail-preview' 
                                        alt={`Thumbnail ${index}`} 
                                    />
                                    <button 
                                        type="button" 
                                        className="remove-image-btn"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            // Remove this image from the images array
                                            const newImages = [...images];
                                            newImages.splice(index, 1);
                                            setImages(newImages);
                                        }}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                            {images.length < 4 && (
                                <label htmlFor="file-input" className="add-more-images">
                                    +
                                </label>
                            )}
                        </div>
                    )}
                </div>
                
                <input 
                    onChange={imageHandler} 
                    type="file" 
                    name="images" 
                    id="file-input" 
                    hidden
                    multiple // Allow multiple file selection
                    accept="image/*" // Accept only image files
                />
            </div>
            
            <button onClick={Add_Product} className='add-product-btn'>
                Add Product
            </button>
        </div>
    );
};

export default AddProduct;