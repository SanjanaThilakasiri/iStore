import React, { useState, useEffect } from 'react';
import './CSS/Checkout.css'
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useLocation, Navigate } from 'react-router-dom';
import CheckoutForm from './CheckoutForm';

// publishable key
const stripePromise = loadStripe('pk_test_51RUrBvBBC2Wlbvk78yNM00sIQPHThrEkdnjG7wQblRNqGg4dhUvuSkk5NEc2ramooWqXURaNK5LbUOle9MlyjYu100ONeSqUP1');

const Checkout = () => {
  const location = useLocation();
  const [clientSecret, setClientSecret] = useState('');
  const [paymentIntentId, setPaymentIntentId] = useState('');
  
 
  const { cartItems = [], totalAmount = 0 } = location.state || {};
  
  console.log('Checkout - Received cartItems:', cartItems);
  console.log('Checkout - Received totalAmount:', totalAmount);

  
  useEffect(() => {
    
    if (totalAmount > 0) {
      console.log('Creating payment intent for amount:', totalAmount);
      
      fetch('http://localhost:4000/api/payment/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: totalAmount }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log('Payment intent response:', data);
          if (data.clientSecret) {
            setClientSecret(data.clientSecret);
            
            const piId = data.clientSecret.split('_secret_')[0];
            setPaymentIntentId(piId);
          } else {
            console.error('Error:', data.error);
          }
        })
        .catch((error) => {
          console.error('Error creating payment intent:', error);
        });
    }
  }, [totalAmount]);

 
  useEffect(() => {
    if (cartItems && cartItems.length > 0) {
      sessionStorage.setItem('checkoutData', JSON.stringify({
        cartItems,
        totalAmount,
        paymentIntentId
      }));
    }
  }, [cartItems, totalAmount, paymentIntentId]);

 
  if (!location.state) {
    
    return <Navigate to="/cart" replace />;
  }

  const appearance = {
    theme: 'stripe',
  };

  const options = {
    clientSecret,
    appearance,
  };

  if (cartItems.length === 0) {
    return (
      <div className="checkout-container">
        <h2>Your cart is empty</h2>
        <p>Please add some items to your cart before checkout.</p>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      
      {/* Order Summary */}
      <div className="order-summary">
        <h3>Order Summary</h3>
        {cartItems.map(item => (
          <div key={item.id} className="order-item">
            <div className="item-details">
              <img 
                src={item.image} 
                alt={item.name} 
                className="item-image"
              />
              <span className="item-name">{item.name}</span>
            </div>
            <div className="item-price">
              LKR {item.price} x {item.quantity} = LKR {item.price * item.quantity}
            </div>
          </div>
        ))}
        <div className="total">
          Total: LKR {totalAmount}
        </div>
      </div>

      {/* Payment Form */}
      {clientSecret ? (
        <div className="payment-section">
          <h3>Payment Details</h3>
          <Elements options={options} stripe={stripePromise}>
            <CheckoutForm 
              cartItems={cartItems}
              totalAmount={totalAmount}
              paymentIntentId={paymentIntentId}
            />
          </Elements>
        </div>
      ) : totalAmount > 0 ? (
        <div className="loading">Loading payment form...</div>
      ) : (
        <div className="error">Invalid amount</div>
      )}
    </div>
  );
};

export default Checkout;
