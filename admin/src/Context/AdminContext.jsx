import React, { createContext, useState } from "react";

export const AdminContext = createContext(null);

const AdminContextProvider = (props) => {
    // Alert state management
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('');
    const [confirmAction, setConfirmAction] = useState(null); // Store confirmation callback

    // Function to show global alert
    const showGlobalAlert = (message, type = 'info', onConfirm = null) => {
        setAlertMessage(message);
        setAlertType(type);
        setShowAlert(true);
        
        // Store the confirmation callback if provided
        if (onConfirm) {
            setConfirmAction(() => onConfirm); 
        }
    };

    // Function to close alert
    const closeAlert = () => {
        setShowAlert(false);
        setAlertMessage('');
        setAlertType('');
        setConfirmAction(null); // Clear confirmation callback
    };

   

    const contextValue = {
        // Alert-related values
        showAlert,
        alertMessage,
        alertType,
        confirmAction,
        showGlobalAlert,
        closeAlert,
        
       
    };

    return (
        <AdminContext.Provider value={contextValue}>
            {props.children}
        </AdminContext.Provider>
    );
};

export default AdminContextProvider;