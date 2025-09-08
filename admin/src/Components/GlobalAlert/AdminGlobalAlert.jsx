import React, { useContext } from 'react';
import { AdminContext } from '../../Context/AdminContext'; // Adjust path based on your folder structure
import './AdminGlobalAlert.css'; // We'll create this CSS file

const AdminGlobalAlert = () => {
    const { showAlert, alertMessage, alertType, closeAlert, confirmAction } = useContext(AdminContext);

    // Handle OK button for success/info alerts
    const handleOk = () => {
        closeAlert();
    };

    // Handle retry button for error alerts
    const handleRetry = () => {
        closeAlert();
        
    };

    // Handle confirmation for delete/confirm operations
    const handleConfirm = () => {
        if (confirmAction) {
            confirmAction(); // Execute the confirmation callback
        }
        closeAlert();
    };

    // If alert is not visible, don't render anything
    if (!showAlert) return null;

    return (
        <div className="alert-overlay">
            <div className="alert-modal">
                <div className="alert-content">
                    {alertType === 'success' ? (
                        <>
                            <h3>Success!</h3>
                            <p>{alertMessage}</p>
                            <div className="alert-buttons">
                                <button className="btn-success" onClick={handleOk}>
                                    OK
                                </button>
                            </div>
                        </>
                    ) : alertType === 'error' ? (
                        <>
                            <h3>Error</h3>
                            <p>{alertMessage}</p>
                            <div className="alert-buttons">
                                <button className="btn-retry" onClick={handleRetry}>
                                    Try Again
                                </button>
                                <button className="btn-cancel" onClick={closeAlert}>
                                    Cancel
                                </button>
                            </div>
                        </>
                    ) : alertType === 'delete' || alertType === 'confirm' ? (
                        <>
                            <h3>{alertType === 'delete' ? 'Confirm Delete' : 'Confirm Action'}</h3>
                            <p>{alertMessage}</p>
                            <div className="alert-buttons">
                                <button className="btn-confirm" onClick={handleConfirm}>
                                    {alertType === 'delete' ? 'Yes, Delete' : 'Yes, Continue'}
                                </button>
                                <button className="btn-cancel" onClick={closeAlert}>
                                    Cancel
                                </button>
                            </div>
                        </>
                    ) : alertType === 'validation' ? (
                        <>
                            <h3>Validation Required</h3>
                            <p>{alertMessage}</p>
                            <div className="alert-buttons">
                                <button className="btn-warning" onClick={handleOk}>
                                    OK
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <h3>Information</h3>
                            <p>{alertMessage}</p>
                            <div className="alert-buttons">
                                <button className="btn-info" onClick={handleOk}>
                                    OK
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminGlobalAlert;