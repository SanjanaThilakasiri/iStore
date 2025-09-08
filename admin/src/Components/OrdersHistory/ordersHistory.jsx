import React, { useState, useEffect } from 'react';
import './ordersHistory.css'

const AdminPaymentDashboard = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Statistics
  const [stats, setStats] = useState({
    total: 0,
    succeeded: 0,
    totalRevenue: 0,
    totalItemsSold: 0
  });

  // Fetch payment history from backend
  const fetchPaymentHistory = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:4000/paymenthistory');
      const data = await response.json();
      
      if (data.success) {
        setPayments(data.payments);
        calculateStats(data.payments);
      } else {
        setError('Failed to fetch payment history');
      }
    } catch (error) {
      console.error('Error fetching payment history:', error);
      setError('Error fetching payment history');
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const calculateStats = (paymentsData) => {
    const stats = {
      total: paymentsData.length,
      succeeded: paymentsData.filter(p => p.paymentStatus === 'succeeded').length,
      totalRevenue: paymentsData
        .filter(p => p.paymentStatus === 'succeeded')
        .reduce((sum, p) => sum + p.totalAmount, 0),
      totalItemsSold: paymentsData
        .filter(p => p.paymentStatus === 'succeeded')
        .reduce((sum, p) => sum + p.cartItems.reduce((itemSum, item) => itemSum + item.quantity, 0), 0)
    };
    setStats(stats);
  };



  // Format currency
  const formatCurrency = (amount) => {
    return `LKR ${amount.toLocaleString()}`;
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  // Get status badge class
  const getStatusBadge = (status) => {
    switch (status) {
      case 'succeeded':
        return 'status-badge success';
      case 'pending':
        return 'status-badge pending';
      case 'failed':
        return 'status-badge failed';
      default:
        return 'status-badge';
    }
  };

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  if (loading) {
    return <div className="admin-dashboard loading">Loading Orders History...</div>;
  }

  if (error) {
    return <div className="admin-dashboard error">Error: {error}</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Orders History</h1>
        <button onClick={fetchPaymentHistory} className="refresh-btn">
          Refresh
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Orders</h3>
          <p className="stat-number">{stats.total}</p>
        </div>
        <div className="stat-card success">
          <h3>Successful</h3>
          <p className="stat-number">{stats.succeeded}</p>
        </div>
        <div className="stat-card items">
          <h3>Total Items Sold</h3>
          <p className="stat-number">{stats.totalItemsSold}</p>
        </div>
        <div className="stat-card revenue">
          <h3>Total Revenue</h3>
          <p className="stat-number">{formatCurrency(stats.totalRevenue)}</p>
        </div>
      </div>

      {/* Payments Table */}
      <div className="payments-table-container">
        <table className="payments-table">
          <thead>
            <tr>
              <th>Order Number</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Items</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(payment => (
              <tr key={payment._id}>
                <td className="order-number">{payment.orderNumber}</td>
                <td>
                  <div className="customer-info">
                    <div className="customer-name">{payment.userName}</div>
                    <div className="customer-email">{payment.userEmail}</div>
                  </div>
                </td>
                <td>{formatDate(payment.paymentDate)}</td>
                <td className="amount">{formatCurrency(payment.totalAmount)}</td>
                <td>
                  <span className={getStatusBadge(payment.paymentStatus)}>
                    {payment.paymentStatus.toUpperCase()}
                  </span>
                </td>
                <td>
                  <div className="items-summary">
                    {payment.cartItems.map((item, index) => (
                      <div key={index} className="item-summary">
                        {item.productName} (x{item.quantity})
                      </div>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {payments.length === 0 && (
          <div className="no-data">
            <p>No payments found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPaymentDashboard;