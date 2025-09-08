
import React, { useEffect, useState, useRef, useContext } from 'react';
import './CSS/PaymentSuccess.css'
import { useLocation } from 'react-router-dom';
import checked from '../Components/Assets/checked.png'
import { ShopContext } from '../Context/ShopContext';

const PaymentSuccess = () => {
  const location = useLocation();
  const [message, setMessage] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [invoiceUrl, setInvoiceUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [cartCleared, setCartCleared] = useState(false);
  
  // Import ShopContext functions
  const { clearCart, refreshCart, getTotalcartIems } = useContext(ShopContext);
  
  // Use ref to prevent multiple API calls
  const hasProcessed = useRef(false);

  // Function to manually clear cart on frontend and context
  const clearCartOnFrontend = async () => {
    try {
      // Clear cart using ShopContext function 
      const success = await clearCart();
      if (success) {
        console.log('Cart cleared successfully via ShopContext');
        setCartCleared(true);
      } else {
        console.error('Failed to clear cart via ShopContext');
        
        await clearCartDirectly();
      }
    } catch (error) {
      console.error('Error clearing cart via ShopContext:', error);
      
      await clearCartDirectly();
    }
  };

  // Fallback function for direct API call
  const clearCartDirectly = async () => {
    try {
      const token = localStorage.getItem('auth-token');
      if (!token) return;

      const response = await fetch('http://localhost:4000/clearcart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': token,
        },
      });

      const result = await response.json();
      if (result.success) {
        console.log('Cart cleared successfully via direct API');
        setCartCleared(true);
        // Refresh cart from server to sync with context
        await refreshCart();
      } else {
        console.error('Failed to clear cart:', result.errors);
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  // Function to save payment details to database
  const savePaymentToDatabase = async (paymentIntentId, paymentData) => {
    try {
      const token = localStorage.getItem('auth-token');
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      const response = await fetch('http://localhost:4000/savepayment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': token,
        },
        body: JSON.stringify(paymentData),
      });

      const result = await response.json();
      
      if (result.success) {
        console.log('Payment saved successfully:', result.orderNumber);
        setOrderNumber(result.orderNumber);
        if (result.invoiceUrl) {
          setInvoiceUrl(result.invoiceUrl);
        }
        
        // Check if cart was cleared on backend
        if (result.cartCleared) {
          setCartCleared(true);
          console.log('Cart cleared on backend');
          
          // Refresh cart from server to sync with ShopContext
          await refreshCart();
        } else if (paymentData.paymentStatus === 'succeeded') {
          
          console.log('Backend did not clear cart, attempting manual clear...');
          await clearCartOnFrontend();
        }
        
        return result;
      } else {
        console.error('Failed to save payment:', result.errors);
        
        if (result.errors && result.errors.includes('duplicate')) {
          setMessage('Payment already processed successfully!');
          if (result.orderNumber) {
            setOrderNumber(result.orderNumber);
          }
          if (result.invoiceUrl) {
            setInvoiceUrl(result.invoiceUrl);
          }
          if (result.cartCleared) {
            setCartCleared(true);
            
            await refreshCart();
          }
        }
      }
    } catch (error) {
      console.error('Error saving payment:', error);
    }
  };

  // Function to download PDF invoice
  const downloadInvoice = async () => {
    if (!orderNumber) {
      alert('Order number not available');
      return;
    }

    setIsDownloading(true);
    try {
      const response = await fetch(`http://localhost:4000/download-invoice/${orderNumber}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/pdf',
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `invoice_${orderNumber}.pdf`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } else {
        const errorData = await response.json();
        alert(errorData.errors || 'Failed to download invoice');
      }
    } catch (error) {
      console.error('Error downloading invoice:', error);
      alert('Error downloading invoice. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  // Function to view PDF invoice in new tab
  const viewInvoice = () => {
    if (invoiceUrl) {
      window.open(invoiceUrl, '_blank');
    }
  };

  useEffect(() => {
    // Prevent multiple executions
    if (hasProcessed.current) {
      return;
    }

    const urlParams = new URLSearchParams(location.search);
    const paymentIntentClientSecret = urlParams.get('payment_intent_client_secret');
    const paymentIntent = urlParams.get('payment_intent');
    const redirectStatus = urlParams.get('redirect_status');

    const processPaymentSuccess = async () => {
      
      if (paymentIntentClientSecret && redirectStatus === 'succeeded' && !hasProcessed.current) {
        hasProcessed.current = true; 
        
        setMessage('Payment succeeded!');
        
        // Get stored checkout data
        const storedData = sessionStorage.getItem('checkoutData');
        if (storedData && paymentIntent) {
          const { cartItems, totalAmount } = JSON.parse(storedData);
          
          
          const processedPayments = JSON.parse(sessionStorage.getItem('processedPayments') || '[]');
          if (processedPayments.includes(paymentIntent)) {
            console.log('Payment already processed, skipping...');
            setMessage('Payment already processed successfully!');
            setCartCleared(true); 
            setIsLoading(false);
            return;
          }
          
          try {
            const paymentData = {
              cartItems: cartItems.map(item => ({
                productId: item.id,
                productName: item.name,
                quantity: item.quantity,
                price: item.price,
                image: item.image,
              })),
              totalAmount: totalAmount,
              currency: 'LKR',
              paymentIntentId: paymentIntent,
              paymentStatus: 'succeeded',
              cardDetails: null,
              billingAddress: {},
            };

            await savePaymentToDatabase(paymentIntent, paymentData);
            
            
            const updatedProcessedPayments = [...processedPayments, paymentIntent];
            sessionStorage.setItem('processedPayments', JSON.stringify(updatedProcessedPayments));
            
          } catch (error) {
            console.error('Error processing payment success:', error);
          }
          
          
          sessionStorage.removeItem('checkoutData');
        }
      } else if (redirectStatus === 'failed') {
        setMessage('Payment failed. Please try again.');
      } else if (redirectStatus === 'processing') {
        setMessage('Payment is being processed...');
        
        return;
      } else {
        setMessage('Processing payment...');
      }
      
      setIsLoading(false);
    };

    processPaymentSuccess();
  }, [location.search]); 

  if (isLoading) {
    return (
      <div className='payment-status'>
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Processing your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='payment-status'>
      <div className="success-content">
        <img src={checked} alt="Success" className="success-icon" />
        <h2>{message}</h2>
        
        {/* Cart Status Indicator */}
        {cartCleared && (
          <div className="cart-status">
            <p style={{color: 'green', fontSize: '14px', margin: '10px 0'}}>
               Your cart has been cleared after successful payment.
            </p>
          </div>
        )}
        
        {orderNumber && (
          <div className="order-info">
            <div className="order-details">
              <h3>Order Confirmation</h3>
              <p><strong>Order Number:</strong> {orderNumber}</p>
              <p><strong>Status:</strong> Payment Successful</p>
              <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
            </div>
            
            <div className="invoice-actions">
              <h4>Your Invoice</h4>
              <p>Your invoice has been generated and is ready for download.</p>
              
              <div className="button-group">
                {invoiceUrl && (
                  <button 
                    onClick={viewInvoice}
                    className="btn btn-secondary"
                    type="button"
                  >
                     View Invoice
                  </button>
                )}
                
                <button 
                  onClick={downloadInvoice}
                  disabled={isDownloading || !orderNumber}
                  className="btn btn-primary"
                  type="button"
                >
                  {isDownloading ? (
                    <>
                      <span className="download-spinner"></span>
                      Downloading...
                    </>
                  ) : (
                    <>
                       Download Invoice
                    </>
                  )}
                </button>
              </div>
              
              {isDownloading && (
                <p className="download-info">
                  Preparing your invoice for download...
                </p>
              )}
            </div>
            
            <div className="thank-you-message">
              <h4>Thank you for your purchase!</h4>
              <p>If you have any questions about your order, please contact our support team with your order number.</p>
            </div>
          </div>
        )}
        
        {!orderNumber && (
          <div className="no-order-info">
            <p>Order information is not available. Please check your email for confirmation details.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;