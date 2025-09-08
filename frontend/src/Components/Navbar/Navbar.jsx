import React, { useContext, useState, useEffect } from 'react'
import './Navbar.css'
import logo from '../Assets/logo.png'
import cart_icon from '../Assets/cart_icon.png'
import user_icon from '../Assets/images/icons/user.png' 
import { Link, useLocation } from 'react-router-dom'
import { ShopContext } from '../../Context/ShopContext'
import menu_icon from '../Assets/menu.png'

const Navbar = () => {
    const location = useLocation();
    const [menu, setMenu] = useState("home");
    const { getTotalcartIems, showGlobalAlert } = useContext(ShopContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth > 992);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('auth-token');

    // Update active menu based on current route
    useEffect(() => {
        const pathToMenu = {
            '/iphone': 'iphone',
            '/mac': 'mac',
            '/ipad': 'ipad',
            '/iwatch': 'iwatch',
            '/airpods': 'airpods',
            '/accessories': 'accessories',
            '/profile': 'profile'
        };
        setMenu(pathToMenu[location.pathname] || 'home');
    }, [location.pathname]);

    // Handle screen size changes
    useEffect(() => {
        const handleResize = () => {
            const isLarge = window.innerWidth > 992;
            setIsLargeScreen(isLarge);
            if (isLarge) {
                setIsMenuOpen(false);
                setIsUserMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Close menus when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.user-menu-container')) {
                setIsUserMenuOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    // Toggle mobile menu
    const toggleMobileMenu = () => {
        setIsMenuOpen(!isMenuOpen);
        setIsUserMenuOpen(false);
    };

    // Toggle user menu
    const toggleUserMenu = () => {
        setIsUserMenuOpen(!isUserMenuOpen);
    };

    // Close mobile menu and set menu state
    const handleNavClick = (menuItem) => {
        setMenu(menuItem);
        setIsMenuOpen(false);
        setIsUserMenuOpen(false);
    };

    // Handle sign out
    const handleSignOut = () => {
        setIsUserMenuOpen(false);
        showGlobalAlert('Are you sure you want to sign out?', 'signout');
    };

    // Navigation items
    const navItems = [
        { name: 'iPhone', path: '/iphone', key: 'iphone' },
        { name: 'Mac', path: '/mac', key: 'mac' },
        { name: 'iPad', path: '/ipad', key: 'ipad' },
        { name: 'iWatch', path: '/iwatch', key: 'iwatch' },
        { name: 'AirPods', path: '/airpods', key: 'airpods' },
        { name: 'Accessories', path: '/accessories', key: 'accessories' }
    ];

    // Render navigation items
    const renderNavItems = (isMobile = false) => (
        navItems.map(item => (
            <li key={item.key} onClick={() => handleNavClick(item.key)}>
                <Link className="nav-menu-link" to={item.path}>
                    {item.name}
                </Link>
                {!isMobile && menu === item.key && <hr className='nav-menu-link-hr'/>}
            </li>
        ))
    );

    return (
        <div className="navbar-container">
            <div className='navbar'>
                <div className="navbar-logo">
                    <Link to='/' onClick={() => handleNavClick("home")}>
                        <img className="istore-logo" src={logo} alt="iSTORE.Lk" />
                    </Link>
                </div>

                {isLargeScreen && (
                    <ul className="nav-menu">
                        {renderNavItems()}
                    </ul>
                )}

                <div className="nav-login-cart">
                    {isLoggedIn ? (
                        <div className="user-menu-container">
                            <button 
                                className="user-profile-button" 
                                onClick={toggleUserMenu}
                                aria-expanded={isUserMenuOpen}
                                aria-haspopup="true"
                            >
                                <img src={user_icon} alt="User Profile" className="user-icon" />
                                
                            </button>
                            
                            {isUserMenuOpen && (
                                <div className="user-dropdown-menu">
                                    <Link 
                                        to='/profile' 
                                        className="user-menu-item"
                                        onClick={() => handleNavClick("profile")}
                                    >
                                        My Profile
                                    </Link>
                                    <button 
                                        className="user-menu-item sign-out-item" 
                                        onClick={handleSignOut}
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link to='/login' onClick={() => handleNavClick("home")}>
                            <button className="login-button">Sign In</button>
                        </Link>
                    )}
                    
                    <Link to='/cart' onClick={() => handleNavClick("home")} className="cart-icon-container">
                        <img src={cart_icon} alt="Cart" />
                        <div className="nav-cart-count">{getTotalcartIems()}</div>
                    </Link>
                    
                    {!isLargeScreen && (
                        <img 
                            className={`nav-dropdown ${isMenuOpen ? 'open' : ''}`} 
                            onClick={toggleMobileMenu} 
                            src={menu_icon} 
                            alt="Menu toggle" 
                        />
                    )}
                </div>
            </div>

            {isMenuOpen && !isLargeScreen && (
                <ul className="mobile-nav-menu">
                    {renderNavItems(true)}
                    {isLoggedIn && (
                        <li onClick={() => handleNavClick("profile")}>
                            <Link className="nav-menu-link" to="/profile">
                                My Profile
                            </Link>
                        </li>
                    )}
                </ul>
            )}
        </div>
    );
};

export default Navbar;