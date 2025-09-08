import React, { useContext } from 'react';
import { ShopContext } from '../../Context/ShopContext'; // Adjust path based on your folder structure
import './GlobalAlert.css'; // We'll create this CSS file

const GlobalAlert = () => {
    const { showAlert, alertMessage, alertType, closeAlert } = useContext(ShopContext);

    // Handle sign in button click
    const handleSignIn = () => {
        closeAlert();
        // Redirect to sign in page 
        window.location.href = '/login';
        

    };

    // Handle continue shopping button click
    const handleContinueShopping = () => {
        closeAlert();
        // Redirect to shop page 
        window.location.href = '/';
        

    };

    // Handle sign out confirmation
    const handleSignOut = () => {
        closeAlert();
        localStorage.removeItem('auth-token');
        window.location.replace('/');
    };

    // If alert is not visible, don't render anything
    if (!showAlert) return null;

    return (
        <div className="alert-overlay">
            <div className="alert-modal">
                <div className="alert-content">
                    {alertType === 'signin' ? (
                        <>
                            <h3>Sign In Required</h3>
                            <p>{alertMessage}</p>
                            <div className="alert-buttons">
                                <button className="btn-signin" onClick={handleSignIn}>
                                    Sign In
                                </button>
                                <button className="btn-cancel" onClick={closeAlert}>
                                    Cancel
                                </button>
                            </div>
                        </>
                    ) : alertType === 'signout' ? (
                        <>
                            <h3>Confirm Sign Out</h3>
                            <p>{alertMessage}</p>
                            <div className="alert-buttons">
                                <button className="btn-signout" onClick={handleSignOut}>
                                    Yes, Sign Out
                                </button>
                                <button className="btn-cancel" onClick={closeAlert}>
                                    Cancel
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <h3>Your Cart is Empty</h3>
                            <p>{alertMessage}</p>
                            <div className="alert-buttons">
                                <button className="btn-signin" onClick={handleContinueShopping}>
                                    Continue Shopping
                                </button>
                                <button className="btn-cancel" onClick={closeAlert}>
                                    Close
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GlobalAlert;