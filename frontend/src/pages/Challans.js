import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Challans = () => {
  const [challans, setChallans] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const [form, setForm] = useState({
    customer_id: '',
    status: 'Draft',
    items: [{ product_id: '', quantity: 1 }]
  });

  useEffect(() => {
    fetchChallans();
    fetchCustomers();
    fetchProducts();
  }, []);

  const fetchChallans = async () => {
    try {
      const res = await axios.get('https://fundsroom-erp-cm0q.onrender.com/challans');
      setChallans(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCustomers = async () => {
    try {
      const res = await axios.get('https://fundsroom-erp-cm0q.onrender.com/customers');
      setCustomers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get('https://fundsroom-erp-cm0q.onrender.com/products');
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addItem = () => {
    setForm({
      ...form,
      items: [...form.items, { product_id: '', quantity: 1 }]
    });
  };

  const removeItem = (index) => {
    const newItems = form.items.filter((_, i) => i !== index);
    setForm({ ...form, items: newItems });
  };

  const updateItem = (index, field, value) => {
    const newItems = form.items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setForm({ ...form, items: newItems });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://fundsroom-erp-cm0q.onrender.com/challans', {
        ...form,
        created_by: user?.id
      });
      alert('Challan created ✅');
      setShowForm(false);
      fetchChallans();
      setForm({
        customer_id: '',
        status: 'Draft',
        items: [{ product_id: '', quantity: 1 }]
      });
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating challan ❌');
    }
  };

  return (
    <div style={{ fontFamily: 'Arial', padding: '20px' }}>
      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', background: '#dc3545',
        color: 'white', padding: '10px 20px', marginBottom: '20px'
      }}>
        <h2>Fundsroom ERP</h2>
        <button onClick={() => navigate('/dashboard')}>← Back</button>
      </div>

      <h2>🧾 Sales Challans</h2>

      {/* Add Button */}
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            padding: '8px 16px', background: '#dc3545',
            color: 'white', border: 'none',
            borderRadius: '5px', cursor: 'pointer'
          }}
        >
          + Create Challan
        </button>
      </div>

      {/* Create Challan Form */}
      {showForm && (
        <div style={{
          border: '1px solid #ddd', padding: '20px',
          borderRadius: '8px', marginBottom: '20px',
          background: '#f9f9f9'
        }}>
          <h3>Create New Challan</h3>
          <form onSubmit={handleSubmit}>

            {/* Customer Select */}
            <div style={{ marginBottom: '10px' }}>
              <label>Select Customer: </label>
              <select
                required
                onChange={(e) => setForm({ ...form, customer_id: e.target.value })}
                style={{ padding: '8px', width: '300px', marginLeft: '10px' }}
              >
                <option value="">-- Select Customer --</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Status Select */}
            <div style={{ marginBottom: '15px' }}>
              <label>Status: </label>
              <select
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                style={{ padding: '8px', marginLeft: '10px' }}
              >
                <option value="Draft">Draft</option>
                <option value="Confirmed">Confirmed</option>
              </select>
            </div>

            {/* Products */}
            <h4>Products:</h4>
            {form.items.map((item, index) => (
              <div key={index} style={{
                display: 'flex', gap: '10px',
                marginBottom: '10px', alignItems: 'center'
              }}>
                <select
                  required
                  onChange={(e) => updateItem(index, 'product_id', e.target.value)}
                  style={{ padding: '8px', width: '250px' }}
                >
                  <option value="">-- Select Product --</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Stock: {p.current_stock})
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="Qty"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
                  style={{ padding: '8px', width: '80px' }}
                />
                {form.items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    style={{
                      padding: '8px', background: '#dc3545',
                      color: 'white', border: 'none',
                      borderRadius: '5px', cursor: 'pointer'
                    }}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={addItem}
              style={{
                padding: '6px 12px', background: '#6c757d',
                color: 'white', border: 'none',
                borderRadius: '5px', cursor: 'pointer',
                marginBottom: '15px'
              }}
            >
              + Add Another Product
            </button>

            <br />
            <button type="submit" style={{
              padding: '10px 20px', background: '#dc3545',
              color: 'white', border: 'none',
              borderRadius: '5px', cursor: 'pointer'
            }}>
              Save Challan
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              style={{
                marginLeft: '10px',
                padding: '10px 20px', cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      {/* Challans Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f4f4f4' }}>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Challan No.</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Customer</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Total Qty</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Status</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Date</th>
          </tr>
        </thead>
        <tbody>
          {challans.map((c) => (
            <tr key={c.id}>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{c.challan_number}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{c.customer_name}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{c.total_quantity}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                <span style={{
                  padding: '4px 8px',
                  borderRadius: '4px',
                  background: c.status === 'Confirmed' ? '#d4edda' :
                    c.status === 'Draft' ? '#fff3cd' : '#f8d7da',
                  color: c.status === 'Confirmed' ? '#155724' :
                    c.status === 'Draft' ? '#856404' : '#721c24'
                }}>
                  {c.status}
                </span>
              </td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                {new Date(c.created_at).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {challans.length === 0 && (
        <p style={{ textAlign: 'center', color: '#999' }}>
          No challans found.
        </p>
      )}
    </div>
  );
};

export default Challans;