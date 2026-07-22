import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div style={{ fontFamily: 'Arial' }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', background: '#007bff',
        color: 'white', padding: '10px 20px'
      }}>
        <h2>Fundsroom ERP</h2>
        <div>
          <span>{user?.name} ({user?.role})</span>
          <button onClick={handleLogout}
            style={{ marginLeft: '15px', padding: '5px 10px', cursor: 'pointer' }}>
            Logout
          </button>
        </div>
      </div>

      <div style={{ padding: '30px' }}>
        <h2>Welcome, {user?.name}! 👋</h2>
        <hr />
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '20px', marginTop: '20px'
        }}>
          <div style={{
            border: '1px solid #ddd', padding: '20px',
            borderRadius: '8px', textAlign: 'center'
          }}>
            <h3>👥 Customers</h3>
            <p>Manage leads and customers</p>
            <button onClick={() => navigate('/customers')}
              style={{
                padding: '8px 16px', background: '#007bff',
                color: 'white', border: 'none',
                borderRadius: '5px', cursor: 'pointer'
              }}>
              View Customers
            </button>
          </div>

          <div style={{
            border: '1px solid #ddd', padding: '20px',
            borderRadius: '8px', textAlign: 'center'
          }}>
            <h3>📦 Products</h3>
            <p>Track stock and inventory</p>
            <button onClick={() => navigate('/products')}
              style={{
                padding: '8px 16px', background: '#28a745',
                color: 'white', border: 'none',
                borderRadius: '5px', cursor: 'pointer'
              }}>
              View Products
            </button>
          </div>

          <div style={{
            border: '1px solid #ddd', padding: '20px',
            borderRadius: '8px', textAlign: 'center'
          }}>
            <h3>🧾 Challans</h3>
            <p>Create sales challans</p>
            <button onClick={() => navigate('/challans')}
              style={{
                padding: '8px 16px', background: '#dc3545',
                color: 'white', border: 'none',
                borderRadius: '5px', cursor: 'pointer'
              }}>
              View Challans
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;