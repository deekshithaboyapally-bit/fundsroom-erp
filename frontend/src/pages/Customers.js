import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', mobile: '', email: '',
    business_name: '', gst_number: '',
    customer_type: 'Retail', address: '',
    status: 'Lead', follow_up_date: '', notes: ''
  });

  const fetchCustomers = async () => {
    try {
      const res = await axios.get(`https://fundsroom-erp-cm0q.onrender.com/customers?search=${search}`);
      setCustomers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://fundsroom-erp-cm0q.onrender.com/customers', form);
      alert('Customer added ✅');
      setShowForm(false);
      fetchCustomers();
    } catch (err) {
      alert('Error adding customer ❌');
    }
  };

  return (
    <div style={{ fontFamily: 'Arial', padding: '20px' }}>
      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', background: '#007bff',
        color: 'white', padding: '10px 20px', marginBottom: '20px'
      }}>
        <h2>Fundsroom ERP</h2>
        <button onClick={() => navigate('/dashboard')}>← Back</button>
      </div>

      <h2>👥 Customers</h2>

      {/* Search and Add */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input
          placeholder="Search customers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: '8px', width: '300px' }}
        />
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            padding: '8px 16px', background: '#28a745',
            color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer'
          }}
        >
          + Add Customer
        </button>
      </div>

      {/* Add Customer Form */}
      {showForm && (
        <div style={{
          border: '1px solid #ddd', padding: '20px',
          borderRadius: '8px', marginBottom: '20px', background: '#f9f9f9'
        }}>
          <h3>Add New Customer</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <input placeholder="Name *" required
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                style={{ padding: '8px' }} />
              <input placeholder="Mobile"
                onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                style={{ padding: '8px' }} />
              <input placeholder="Email" type="email"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                style={{ padding: '8px' }} />
              <input placeholder="Business Name"
                onChange={(e) => setForm({ ...form, business_name: e.target.value })}
                style={{ padding: '8px' }} />
              <input placeholder="GST Number"
                onChange={(e) => setForm({ ...form, gst_number: e.target.value })}
                style={{ padding: '8px' }} />
              <select onChange={(e) => setForm({ ...form, customer_type: e.target.value })}
                style={{ padding: '8px' }}>
                <option value="Retail">Retail</option>
                <option value="Wholesale">Wholesale</option>
                <option value="Distributor">Distributor</option>
              </select>
              <input placeholder="Address"
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                style={{ padding: '8px' }} />
              <select onChange={(e) => setForm({ ...form, status: e.target.value })}
                style={{ padding: '8px' }}>
                <option value="Lead">Lead</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <input placeholder="Follow Up Date" type="date"
                onChange={(e) => setForm({ ...form, follow_up_date: e.target.value })}
                style={{ padding: '8px' }} />
              <input placeholder="Notes"
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                style={{ padding: '8px' }} />
            </div>
            <br />
            <button type="submit" style={{
              padding: '10px 20px', background: '#007bff',
              color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer'
            }}>
              Save Customer
            </button>
            <button type="button" onClick={() => setShowForm(false)} style={{
              marginLeft: '10px', padding: '10px 20px',
              cursor: 'pointer'
            }}>
              Cancel
            </button>
          </form>
        </div>
      )}

      {/* Customers Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f4f4f4' }}>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Name</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Mobile</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Business</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Type</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c) => (
            <tr key={c.id}>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{c.name}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{c.mobile}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{c.business_name}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{c.customer_type}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{c.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {customers.length === 0 && (
        <p style={{ textAlign: 'center', color: '#999' }}>No customers found.</p>
      )}
    </div>
  );
};

export default Customers;