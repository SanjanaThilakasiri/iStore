import React, { useState, useEffect, useContext } from 'react';
import { ShopContext } from '../Context/ShopContext';
import userprofile from '../Components/Assets/user.png'
import useremail from '../Components/Assets/email.png'
import useraddress from '../Components/Assets/address.png'
import usermobile from '../Components/Assets/mobile.png'
import usersince from '../Components/Assets/calendar.png'
import userorders from '../Components/Assets/shopping-bag.png'
import emptycart from '../Components/Assets/emptycart.png'

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showGlobalAlert } = useContext(ShopContext);

  // Get token from localStorage
  const getToken = () => {
    return localStorage.getItem('auth-token');
  };

  // Fetch user data and payment history
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = getToken();
        if (!token) {
          setError('Please log in to view your profile');
          setLoading(false);
          return;
        }

        // Fetch user profile data
        const userResponse = await fetch('http://localhost:4000/userprofile', {
          method: 'POST',
          headers: {
            'auth-token': token,
            'Content-Type': 'application/json',
          },
        });

        const userData = await userResponse.json();
        
        if (userData.success) {
          setUser(userData.user);
        } else {
          setError(userData.errors || 'Failed to fetch user data');
        }

        // Fetch payment history
        const paymentResponse = await fetch('http://localhost:4000/userpaymenthistory', {
          method: 'POST',
          headers: {
            'auth-token': token,
            'Content-Type': 'application/json',
          },
        });

        const paymentData = await paymentResponse.json();
        if (paymentData.success) {
          setPaymentHistory(paymentData.payments);
        } else {
          if (!userData.success) {
            setError(paymentData.errors || 'Failed to fetch payment history');
          }
        }
      } catch (err) {
        setError('Network error. Please try again.');
        console.error('Error fetching user data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Download invoice
  const downloadInvoice = async (orderNumber) => {
    try {
      const response = await fetch(`http://localhost:4000/download-invoice/${orderNumber}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice_${orderNumber}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } else {
        alert('Invoice not found or error downloading');
      }
    } catch (err) {
      alert('Error downloading invoice');
      console.error('Download error:', err);
    }
  };

  // Get dynamic greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning!';
    if (hour < 17) return 'Good afternoon!';
    return 'Good evening!';
  };

  // Handle sign out
  const handleSignOut = () => {
    showGlobalAlert('Are you sure you want to sign out?', 'signout');
  };

  // Get status class
  const getStatusClass = (status) => {
    switch (status) {
      case 'succeeded': return 'status-success';
      case 'pending': return 'status-pending';
      case 'failed': return 'status-failed';
      case 'canceled': return 'status-canceled';
      default: return 'status-default';
    }
  };

  // Format address for display
  const formatAddress = (address) => {
    if (!address) return 'N/A';
    const { street, city, district, province } = address;
    return `${street || ''}, ${city || ''}, ${district || ''}, ${province || ''}`.replace(/^,\s*|,\s*$/g, '');
  };

  // Loading state
  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loader}></div>
        <p style={styles.loadingText}>Loading your profile...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div style={styles.errorContainer}>
        <div style={styles.errorIcon}>⚠️</div>
        <p style={styles.errorText}>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          style={styles.retryButton}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerContent}>
            <div style={styles.avatar}>
              <span style={styles.avatarIcon}><img src={userprofile} alt="" style={styles.contenticons} /></span>
            </div>
            <div style={styles.userInfo}>
              <h1 style={styles.userName}>{user?.name || 'User Profile'}</h1>
              <p style={styles.greeting}>{getGreeting()}</p>
            </div>
          </div>
          <button 
            onClick={handleSignOut}
            style={styles.signOutButton}
          >
            Sign Out
          </button>
        </div>

        {/* Main Content */}
        <div style={styles.content}>
          {/* Profile Details */}
          <div style={styles.profileSection}>
            <h2 style={styles.sectionTitle}>Profile Details</h2>
            
            <div style={styles.detailsGrid}>
              <div style={styles.detailCard}>
                <span style={styles.detailIcon}><img src={userprofile} alt="" style={styles.contenticons} /></span>
                <div style={styles.detailContent}>
                  <p style={styles.detailLabel}>Name</p>
                  <p style={styles.detailValue}>{user?.name || 'N/A'}</p>
                </div>
              </div>

              <div style={styles.detailCard}>
                <span style={styles.detailIcon}><img src={useremail} alt="" style={styles.contenticons} /></span>
                <div style={styles.detailContent}>
                  <p style={styles.detailLabel}>Email</p>
                  <p style={styles.detailValue}>{user?.email || 'N/A'}</p>
                </div>
              </div>

              <div style={styles.detailCard}>
                <span style={styles.detailIcon}><img src={usermobile} alt="" style={styles.contenticons} /></span>
                <div style={styles.detailContent}>
                  <p style={styles.detailLabel}>Mobile Number</p>
                  <p style={styles.detailValue}>{user?.mobileNumber || 'N/A'}</p>
                </div>
              </div>

              <div style={styles.detailCard}>
                <span style={styles.detailIcon}><img src={useraddress} alt="" style={styles.contenticons} /></span>
                <div style={styles.detailContent}>
                  <p style={styles.detailLabel}>Address</p>
                  <p style={styles.detailValue}>{formatAddress(user?.address)}</p>
                </div>
              </div>

              <div style={styles.detailCard}>
                <span style={styles.detailIcon}><img src={usersince} alt="" style={styles.contenticons} /></span>
                <div style={styles.detailContent}>
                  <p style={styles.detailLabel}>Member Since</p>
                  <p style={styles.detailValue}>
                    {user?.date ? new Date(user.date).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>

              <div style={styles.detailCard}>
                <span style={styles.detailIcon}><img src={userorders} alt="" style={styles.contenticons} /></span>
                <div style={styles.detailContent}>
                  <p style={styles.detailLabel}>Total Orders</p>
                  <p style={styles.detailValue}>{paymentHistory.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order History */}
          <div style={styles.ordersSection}>
            <h2 style={styles.sectionTitle}>Order History</h2>
            
            {paymentHistory.length === 0 ? (
              <div style={styles.emptyState}>
                <div><img src={emptycart} alt="" style={styles.contenticons} /></div>
                <p style={styles.emptyText}>No orders found</p>
              </div>
            ) : (
              <div style={styles.ordersList}>
                {paymentHistory.map((payment) => (
                  <div key={payment._id} style={styles.orderCard}>
                    {/* Order Header */}
                    <div style={styles.orderHeader}>
                      <div style={styles.orderInfo}>
                        <h3 style={styles.orderNumber}>Order #{payment.orderNumber}</h3>
                        <p style={styles.orderDate}>
                          {new Date(payment.paymentDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div style={styles.orderSummary}>
                        <span style={{
                          ...styles.orderStatus,
                          ...getStatusStyles(payment.paymentStatus)
                        }}>
                          {payment.paymentStatus.charAt(0).toUpperCase() + payment.paymentStatus.slice(1)}
                        </span>
                        <p style={styles.orderTotal}>
                          {payment.currency} {payment.totalAmount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    
                    {/* Order Items */}
                    <div style={styles.orderItems}>
                      {payment.cartItems.map((item, index) => (
                        <div key={index} style={styles.orderItem}>
                          <div style={styles.itemInfo}>
                            <img 
                              src={item.image} 
                              alt={item.productName}
                              style={styles.itemImage}
                            />
                            <span style={styles.itemName}>{item.productName}</span>
                          </div>
                          <div style={styles.itemDetails}>
                            Qty: {item.quantity} × {payment.currency} {item.price.toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Order Footer */}
                    <div style={styles.orderFooter}>
                      <div style={styles.cardInfo}>
                        {payment.cardDetails && (
                          <span>
                            {payment.cardDetails.brand} ****{payment.cardDetails.last4}
                          </span>
                        )}
                      </div>
                      <div>
                        {payment.invoicePath && (
                          <button
                            onClick={() => downloadInvoice(payment.orderNumber)}
                            style={styles.downloadButton}
                          >
                            📥 Download Invoice
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function for status styles
const getStatusStyles = (status) => {
  switch (status) {
    case 'succeeded': return { backgroundColor: '#e8f5e8', color: '#2e7d32' };
    case 'pending': return { backgroundColor: '#fff3e0', color: '#f57c00' };
    case 'failed': return { backgroundColor: '#ffebee', color: '#c62828' };
    case 'canceled': return { backgroundColor: '#f5f5f5', color: '#616161' };
    default: return { backgroundColor: '#f5f5f5', color: '#616161' };
  }
};

// Styles object
const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
    padding: '2rem 1rem'
  },
  wrapper: {
    maxWidth: '1200px',
    margin: '0 auto'
  },
  header: {
    backgroundColor: 'white',
    borderRadius: '1rem',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    padding: '2rem',
    marginBottom: '2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  headerContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  avatar: {
    width: '4rem',
    height: '4rem',
    backgroundColor: '#e3f2fd',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatarIcon: {
    fontSize: '2rem',
    color: '#1976d2'
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem'
  },
  userName: {
    fontSize: '1.75rem',
    fontWeight: '700',
    color: '#1a202c',
    margin: 0
  },
  greeting: {
    fontSize: '1rem',
    color: '#718096',
    margin: 0
  },
  signOutButton: {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease'
  },
  content: {
    display: 'grid',
    gridTemplateColumns: '1fr 2fr',
    gap: '2rem'
  },
  profileSection: {
    backgroundColor: 'white',
    borderRadius: '1rem',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    padding: '2rem'
  },
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#1a202c',
    marginBottom: '1.5rem',
    margin: 0
  },
  detailsGrid: {
    display: 'grid',
    gap: '1rem'
  },
  detailCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '0.5rem',
    borderLeft: '4px solid #1976d2'
  },
  detailIcon: {
    fontSize: '1.5rem',
    color: '#1976d2'
  },
  contenticons:{
    width: '25px',
    height: '25px'
  },
  detailContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem'
  },
  detailLabel: {
    fontSize: '0.875rem',
    color: '#718096',
    margin: 0
  },
  detailValue: {
    fontSize: '1rem',
    fontWeight: '500',
    color: '#1a202c',
    margin: 0
  },
  ordersSection: {
    backgroundColor: 'white',
    borderRadius: '1rem',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    padding: '2rem'
  },
  emptyState: {
    textAlign: 'center',
    padding: '4rem 2rem',
    color: '#718096'
  },
  emptyIcon: {
    fontSize: '4rem',
    marginBottom: '1rem'
  },
  emptyText: {
    fontSize: '1.125rem',
    margin: 0
  },
  ordersList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  orderCard: {
    border: '1px solid #e2e8f0',
    borderRadius: '0.75rem',
    padding: '1.5rem',
    backgroundColor: '#fafafa',
    transition: 'box-shadow 0.2s ease'
  },
  orderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'start',
    marginBottom: '1rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid #e2e8f0'
  },
  orderInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem'
  },
  orderNumber: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#1a202c',
    margin: 0
  },
  orderDate: {
    fontSize: '0.875rem',
    color: '#718096',
    margin: 0
  },
  orderSummary: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    textAlign: 'right'
  },
  orderStatus: {
    padding: '0.25rem 0.75rem',
    borderRadius: '1rem',
    fontSize: '0.75rem',
    fontWeight: '500',
    textTransform: 'uppercase'
  },
  orderTotal: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#1a202c',
    margin: 0
  },
  orderItems: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    marginBottom: '1rem'
  },
  orderItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem 0',
    borderBottom: '1px solid #f1f5f9'
  },
  itemInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  },
  itemImage: {
    width: '2.5rem',
    height: '2.5rem',
    objectFit: 'cover',
    borderRadius: '0.25rem'
  },
  itemName: {
    fontWeight: '500',
    color: '#1a202c'
  },
  itemDetails: {
    color: '#718096',
    fontSize: '0.875rem'
  },
  orderFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '1rem',
    borderTop: '1px solid #e2e8f0'
  },
  cardInfo: {
    color: '#718096',
    fontSize: '0.875rem'
  },
  downloadButton: {
    backgroundColor: '#1976d2',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease'
  },
  loadingContainer: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa'
  },
  loader: {
    width: '2rem',
    height: '2rem',
    border: '3px solid #f3f4f6',
    borderTop: '3px solid #1976d2',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '1rem'
  },
  loadingText: {
    color: '#718096',
    fontSize: '1rem'
  },
  errorContainer: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    textAlign: 'center'
  },
  errorIcon: {
    fontSize: '3rem',
    marginBottom: '1rem'
  },
  errorText: {
    color: '#dc3545',
    fontSize: '1.125rem',
    marginBottom: '1rem'
  },
  retryButton: {
    backgroundColor: '#1976d2',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '0.375rem',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease'
  }
};

export default UserProfile;