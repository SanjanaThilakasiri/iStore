import React, {createContext, useEffect, useState} from "react";

export const ShopContext = createContext(null);

const getDefaultCart = ()=>{
    let cart = {};
    for (let index = 0; index < 300+1; index++) {
        cart[index] = 0;
    }
    return cart;
}

const ShopContextProvider = (props) =>{

    const [all_product,setAll_Product] = useState([]);
    const [cartItems,setCartItems] = useState(getDefaultCart());
    
    // State for custom alert 
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('signin'); 

    useEffect(()=>{
        fetch('http://localhost:4000/allproducts')
        .then((response)=>response.json())
        .then((data)=>setAll_Product(data))

        if(localStorage.getItem('auth-token')){
            fetch('http://localhost:4000/getcart',{
                method:'POST',
                headers:{
                    Accept:'application/form-data',
                    'auth-token':`${localStorage.getItem('auth-token')}`,
                    'Content-Type':'application/json',
                },
                body:"",
            }).then((response)=>response.json())
            .then((data)=>setCartItems(data));
        }
    },[])

    // Check if user is authenticated
    const isUserAuthenticated = () => {
        return localStorage.getItem('auth-token') !== null;
    }

    // Show custom alert with optional type
    const showCustomAlert = (message, type = 'signin') => {
        setAlertMessage(message);
        setAlertType(type);
        setShowAlert(true);
    }

    // showCustomAlert to match the Navbar component's  function name
    const showGlobalAlert = (message, type = 'signin') => {
        showCustomAlert(message, type);
    }

    // Close custom alert
    const closeAlert = () => {
        setShowAlert(false);
        setAlertMessage('');
        setAlertType('signin');
    }

    const addToCart = (itemID)=>{
        // Check authentication before adding to cart
        if (!isUserAuthenticated()) {
            showCustomAlert('Please sign in to add items to your cart.', 'signin');
            return;
        }

        setCartItems((prev)=>({...prev,[itemID]:prev[itemID]+1}));
        
        fetch('http://localhost:4000/addtocart',{
            method:'POST',
            headers:{
                Accept:'application/form-data',
                'auth-token':`${localStorage.getItem('auth-token')}`,
                'Content-Type':'application/json',
            },
            body:JSON.stringify({"itemId":itemID}) ,
        })
        .then((response)=>response.json())
        .then((data)=>console.log(data));
    }

    const removeFromCart = (itemID)=>{
        setCartItems((prev)=>({...prev,[itemID]:prev[itemID]-1}));
        if(localStorage.getItem('auth-token')){
            fetch('http://localhost:4000/removefromcart',{
                method:'POST',
                headers:{
                    Accept:'application/form-data',
                    'auth-token':`${localStorage.getItem('auth-token')}`,
                    'Content-Type':'application/json',
                },
                body:JSON.stringify({"itemId":itemID}) ,
            })
            .then((response)=>response.json())
            .then((data)=>console.log(data));
        }
    }

    // Clear cart function - both locally and on server
    const clearCart = async () => {
        try {
            // Clear cart locally first
            setCartItems(getDefaultCart());
            
            // If user is authenticated, also clear cart on server
            if (localStorage.getItem('auth-token')) {
                const response = await fetch('http://localhost:4000/clearcart', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/form-data',
                        'auth-token': `${localStorage.getItem('auth-token')}`,
                        'Content-Type': 'application/json',
                    },
                });
                
                const result = await response.json();
                if (result.success) {
                    console.log('Cart cleared successfully on server');
                    return true;
                } else {
                    console.error('Failed to clear cart on server:', result.errors);
                    return false;
                }
            }
            return true;
        } catch (error) {
            console.error('Error clearing cart:', error);
            return false;
        }
    }

    // Refresh cart from server 
    const refreshCart = async () => {
        if (localStorage.getItem('auth-token')) {
            try {
                const response = await fetch('http://localhost:4000/getcart', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/form-data',
                        'auth-token': `${localStorage.getItem('auth-token')}`,
                        'Content-Type': 'application/json',
                    },
                    body: "",
                });
                
                const data = await response.json();
                setCartItems(data);
                console.log('Cart refreshed from server');
                return true;
            } catch (error) {
                console.error('Error refreshing cart:', error);
                return false;
            }
        }
        return false;
    }

    const getTotalCartAmount = ()=>{
        let totalAmount =0;
        for(const item  in cartItems){
            if(cartItems[item]>0){
                let itemInfo = all_product.find((product)=>product.id===Number(item) );
                if (itemInfo) { 
                    totalAmount += itemInfo.price * cartItems[item];
                }
            }
        }
        return totalAmount;
    }

    const getTotalcartIems = () =>{
        let totalItem = 0;
        for(const item in cartItems){
            if(cartItems[item]>0){
                totalItem += cartItems[item];
            }
        }
        return totalItem
    }

    // Get cart items as array with product details 
    const getCartItemsArray = () => {
        const cartItemsArray = [];
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                const itemInfo = all_product.find((product) => product.id === Number(item));
                if (itemInfo) {
                    cartItemsArray.push({
                        ...itemInfo,
                        quantity: cartItems[item]
                    });
                }
            }
        }
        return cartItemsArray;
    }

    // Check if cart is empty
    const isCartEmpty = () => {
        return getTotalcartIems() === 0;
    }

    const contextValue = {
        all_product, 
        cartItems, 
        addToCart, 
        removeFromCart, 
        clearCart,               
        refreshCart,               
        getCartItemsArray,         
        isCartEmpty,               
        getTotalCartAmount, 
        getTotalcartIems,
        isUserAuthenticated,
        showAlert,
        alertMessage,
        alertType,
        closeAlert,
        showCustomAlert,
        showGlobalAlert  
    };

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;