import React, { useContext } from 'react'
import './CartItems.css'
import { useNavigate } from 'react-router-dom'
import { ShopContext } from '../../Context/ShopContext'
import remove_icon from '../Assets/cart_cross_icon.png'

const CartItems = () => {
    const { 
        all_product, 
        cartItems, 
        removeFromCart, 
        getTotalCartAmount, 
        showCustomAlert 
    } = useContext(ShopContext);
    
    const navigate = useNavigate();

    
    const cartItemsArray = all_product.filter(product => cartItems[product.id] > 0)
        .map(product => ({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: cartItems[product.id]
        }));

    const totalAmount = getTotalCartAmount();

    const handleCheckout = () => {
        // Debug: Log the data being passed
        console.log('=== CHECKOUT DEBUG ===');
        console.log('all_product:', all_product);
        console.log('cartItems:', cartItems);
        console.log('cartItemsArray:', cartItemsArray);
        console.log('totalAmount:', totalAmount);
        console.log('======================');
        
        // Check if cart is empty - using custom alert instead of browser alert
        if (cartItemsArray.length === 0) {
            showCustomAlert('Add some items to continue.', 'info');
            return;
        }
        
        // Check if totalAmount is valid
        if (totalAmount <= 0) {
            showCustomAlert('Invalid total amount! Please refresh and try again.', 'info');
            return;
        }
        
        // Pass cart data to checkout page
        navigate('/checkout', {
            state: { 
                cartItems: cartItemsArray,
                totalAmount: totalAmount 
            }
        });
    };

    return (
        <div className='cartitems'>
            <div className="cartitems-format-main">
                <p>Products</p>
                <p>Title</p>
                <p>Price</p>
                <p>Quantity</p>
                <p>Total</p>
                <p>Remove</p>
            </div>
            <hr />
            {all_product.map((e) => {
                if (cartItems[e.id] > 0) {
                    return <div key={e.id}>
                        <div className="cartitems-format cartitems-format-main">
                            <img src={e.image} alt="" className='carticon-product-icon' />
                            <p>{e.name} </p>
                            <p>LKR {e.price} </p>
                            <button className='cartitems-quantity'>{cartItems[e.id]} </button>
                            <p>LKR {e.price * cartItems[e.id]} </p>
                            <img className='cartitems-remove-icon' src={remove_icon} onClick={() => { removeFromCart(e.id) }} alt="" />
                        </div>
                        <hr />
                    </div>
                }
                return null;
            })}
            <div className="cartitems-down">
                <div className="cartitems-total">
                    <h1>Cart Total</h1>
                    <div>
                        <div className="cartitems-total-item">
                            <p>Subtotal</p>
                            <p>LKR {totalAmount} </p>
                        </div>
                    </div>
                   
                    <button onClick={handleCheckout}>
                        Proceed To Checkout
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CartItems