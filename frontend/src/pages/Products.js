import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', sku: '', category: '',
    unit_price: '', current_stock: '',
    min_stock_alert: '', location: ''
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/products?search=${search}`);
        setProducts(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, [search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/products', form);
      alert('Product added ✅');
      setShowForm(false);
      setSearch('');
    } catch (err) {
      alert('Error adding product ❌');
    }
  };

  return (
    <div style={{ fontFamily: 'Arial', padding: '20px' }}>
      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', background: '#28a745',
        color: 'white', padding: '10px 20px', marginBottom: '20px'
      }}>
        <h2>Fundsroom ERP</h2>
        <button onClick={() => navigate('/dashboard')}>← Back</button>
      </div>

      <h2>📦 Products</h2>

      {/* Search and Add */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: '8px', width: '300px' }}
        />
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            padding: '8px 16px', background: '#28a745',
            color: 'white', border: 'none',
            borderRadius: '5px', cursor: 'pointer'
          }}
        >
          + Add Product
        </button>
      </div>

      {/* Add Product Form */}
      {showForm && (
        <div style={{
          border: '1px solid #ddd', padding: '20px',
          borderRadius: '8px', marginBottom: '20px',
          background: '#f9f9f9'
        }}>
          <h3>Add New Product</h3>
          <form onSubmit={handleSubmit}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px'
            }}>
              <input placeholder="Product Name *" required
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                style={{ padding: '8px' }} />
              <input placeholder="SKU Code *" required
                onChange={(e) => setForm({ ...form, sku: e.target.value })}
                style={{ padding: '8px' }} />
              <input placeholder="Category"
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                style={{ padding: '8px' }} />
              <input placeholder="Unit Price" type="number"
                onChange={(e) => setForm({ ...form, unit_price: e.target.value })}
                style={{ padding: '8px' }} />
              <input placeholder="Current Stock" type="number"
                onChange={(e) => setForm({ ...form, current_stock: e.target.value })}
                style={{ padding: '8px' }} />
              <input placeholder="Min Stock Alert" type="number"
                onChange={(e) => setForm({ ...form, min_stock_alert: e.target.value })}
                style={{ padding: '8px' }} />
              <input placeholder="Location/Warehouse"
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                style={{ padding: '8px' }} />
            </div>
            <br />
            <button type="submit" style={{
              padding: '10px 20px', background: '#28a745',
              color: 'white', border: 'none',
              borderRadius: '5px', cursor: 'pointer'
            }}>
              Save Product
            </button>
            <button type="button"
              onClick={() => setShowForm(false)}
              style={{
                marginLeft: '10px',
                padding: '10px 20px', cursor: 'pointer'
              }}>
              Cancel
            </button>
          </form>
        </div>
      )}

      {/* Products Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f4f4f4' }}>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Name</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>SKU</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Category</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Price</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Stock</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Min Alert</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Location</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} style={{
              background: p.current_stock <= p.min_stock_alert ? '#fff3cd' : 'white'
            }}>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{p.name}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{p.sku}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{p.category}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>₹{p.unit_price}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                {p.current_stock <= p.min_stock_alert
                  ? `⚠️ ${p.current_stock}`
                  : p.current_stock}
              </td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{p.min_stock_alert}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{p.location}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {products.length === 0 && (
        <p style={{ textAlign: 'center', color: '#999' }}>
          No products found.
        </p>
      )}
    </div>
  );
};

export default Products;