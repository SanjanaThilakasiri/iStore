import React, { useState } from 'react'
import './CSS/LoginSignup.css'

const Login = () => {
  const [state, setState] = useState("Sign In");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    mobileNumber: "",
    address: {
      street: "",
      city: "",
      district: "",
      province: ""
    }
  });

  const changeHandler = (e) => {
    const { name, value } = e.target;
    
    
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [addressField]: value
        }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const login = async () => {
    console.log("Login Function Working", formData);
    let responseData;
    await fetch('http://localhost:4000/login', {
      method: 'POST',
      headers: {
        Accept: 'application/form-data',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    }).then((response) => response.json()).then((data) => responseData = data);
    
    if (responseData.success) {
      localStorage.setItem('auth-token', responseData.token);
      window.location.replace("/");
    } else {
      alert(responseData.errors);
    }
  };

  const signup = async () => {
    console.log("SignUp Function Working", formData);
    let responseData;
    await fetch('http://localhost:4000/signup', {
      method: 'POST',
      headers: {
        Accept: 'application/form-data',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    }).then((response) => response.json()).then((data) => responseData = data);
    
    if (responseData.success) {
      localStorage.setItem('auth-token', responseData.token);
      window.location.replace("/");
    } else {
      alert(responseData.errors);
    }
  };

  return (
    <div className='loginsignup'>
      <div className="loginsignup-container">
        <h1>{state}</h1>
        <div className="loginsignup-fields">
          {state === "Sign Up" ? (
            <>
              <input 
                name='username' 
                value={formData.username} 
                onChange={changeHandler} 
                type="text" 
                placeholder='Enter Your Name' 
                required
              />
              <input 
                name='email' 
                value={formData.email} 
                onChange={changeHandler} 
                type="email" 
                placeholder='Enter Your Email' 
                required
              />
              <input 
                name='password' 
                value={formData.password} 
                onChange={changeHandler} 
                type="password" 
                placeholder='Enter Your Password' 
                required
              />
              <input 
                name='mobileNumber' 
                value={formData.mobileNumber} 
                onChange={changeHandler} 
                type="tel" 
                placeholder='Enter Your Mobile Number' 
                required
              />
              
              
              {/* Address Fields */}
              <div className="address-section">
                <h3>Address Information</h3>
                <input 
                  name='address.street' 
                  value={formData.address.street} 
                  onChange={changeHandler} 
                  type="text" 
                  placeholder='Street' 
                  required
                />
                <div className="address-row">
                  <input 
                    name='address.city' 
                    value={formData.address.city} 
                    onChange={changeHandler} 
                    type="text" 
                    placeholder='City' 
                    required
                  />
                  <input 
                    name='address.district' 
                    value={formData.address.district} 
                    onChange={changeHandler} 
                    type="text" 
                    placeholder='District' 
                    required
                  />
                  
                </div>
                <div className="address-row">
                  <input 
                    name='address.province' 
                    value={formData.address.province} 
                    onChange={changeHandler} 
                    type="text" 
                    placeholder='Province' 
                    required
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <input 
                name='email' 
                value={formData.email} 
                onChange={changeHandler} 
                type="email" 
                placeholder='Enter Your Email' 
                required
              />
              <input 
                name='password' 
                value={formData.password} 
                onChange={changeHandler} 
                type="password" 
                placeholder='Enter Your Password' 
                required
              />
            </>
          )}
        </div>
        <button onClick={() => { state === "Sign In" ? login() : signup() }}>
          Continue
        </button>
        {state === "Sign Up" ? 
          <p className='loginsignup-login'>
            Already have an account? <span onClick={() => { setState("Sign In") }}>Sign In</span>
          </p>
          :
          <p className='loginsignup-login'>
            Don't have an account? <span onClick={() => { setState("Sign Up") }}>Sign Up</span>
          </p>
        }
      </div>
    </div>
  );
};

export default Login;