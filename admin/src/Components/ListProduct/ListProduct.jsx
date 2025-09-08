import React, { useEffect, useState, useContext } from 'react';
import './ListProduct.css';
import delete_product from '../../assets/delete_product.png';
import { AdminContext } from '../../Context/AdminContext';

const ListProduct = () => {
    const [allproducts, setAllProducts] = useState([]);
    
    // Get context functions
    const { showGlobalAlert } = useContext(AdminContext);

    const fetchInfo = async () => {
        try {
            await fetch('http://localhost:4000/allproducts')
                .then((res) => res.json())
                .then((data) => { setAllProducts(data) });
        } catch (error) {
            showGlobalAlert('Failed to fetch products. Please try again.', 'error');
        }
    };

    useEffect(() => {
        fetchInfo();
    }, []);

    //removal function
    const remove_product = async (id) => {
        try {
            const response = await fetch('http://localhost:4000/removeproduct', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: id })
            });

            if (response.ok) {
                await fetchInfo(); // Refresh the product list
                showGlobalAlert('Product deleted successfully!', 'success');
            } else {
                showGlobalAlert('Failed to delete product. Please try again.', 'error');
            }
        } catch (error) {
            showGlobalAlert('Network error. Please check your connection and try again.', 'error');
        }
    };

    // Function to initiate product removal
    const initiateRemoveProduct = (id, productName) => {
        showGlobalAlert(
            `Are you sure you want to delete "${productName}"? This action cannot be undone.`,
            'delete',
            () => remove_product(id) 
        );
    };

    return (
        <div className='list-product'>
            <h1>All Product List</h1>
            <div className='listproduct-format-main'>
                <p>Product</p>
                <p>Title</p>
                <p>Price</p>
                <p>Category</p>
                <p>Remove</p>
            </div>
            <div className='listproduct-allproduct'>
                <hr />
                {allproducts.map((product, index) => {
                    return (
                        <div key={index} className='listproduct-format-main product-format'>
                            <img className='listproduct-product-img' src={product.image} alt="" />
                            <p>{product.name + "-" + product.color}</p>
                            <p>LKR{product.price}</p>
                            <p>{product.category}</p>
                            <p>
                                <img 
                                    onClick={() => {
                                        initiateRemoveProduct(product.id, product.name + "-" + product.color)
                                    }} 
                                    className='listproduct-removeicon' 
                                    src={delete_product} 
                                    alt="Delete product" 
                                />
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ListProduct;