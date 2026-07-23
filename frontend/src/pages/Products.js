import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = 'https://fundsroom-erp-cm0q.onrender.com';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState({ type: '', text: '' });
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', sku: '', category: '',
    unit_price: '', current_stock: '',
    min_stock_alert: '', location: ''
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/products?search=${search}`);
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg({ type: '', text: '' });
    try {
      await axios.post(`${API_URL}/products`, form);
      setMsg({ type: 'success', text: 'Product added successfully ✅' });
      setShowForm(false);
      setForm({ name: '', sku: '', category: '', unit_price: '', current_stock: '', min_stock_alert: '', location: '' });
      fetchProducts();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to add product ❌' });
    }
  };

  const stockBadge = (current, min) => {
    if (current <= 0) return <span style={styles.badgeRed}>Out of Stock</span>;
    if (current <= min) return <span style={styles.badgeYellow}>⚠️ Low Stock ({current})</span>;
    return <span style={styles.badgeGreen}>{current}</span>;
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h2 style={styles.headerTitle}>Fundsroom ERP</h2>
        <button onClick={() => navigate('/dashboard')} style={styles.backBtn}>← Back to Dashboard</button>
      </div>

      <div style={styles.container}>
        <h2 style={styles.pageTitle}>📦 Products & Inventory</h2>

        {msg.text && <div style={msg.type === 'success' ? styles.successMsg : styles.errorMsg}>{msg.text}</div>}

        <div style={styles.toolbar}>
          <input
            placeholder="Search by name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
          <button onClick={() => setShowForm(!showForm)} style={styles.addBtn}>
            {showForm ? '✕ Cancel' : '+ Add Product'}
          </button>
        </div>

        {showForm && (
          <div style={styles.formCard}>
            <h3 style={styles.formTitle}>Add New Product</h3>
            <form onSubmit={handleSubmit} style={styles.formGrid}>
              <input placeholder="Product Name *" required onChange={(e) => setForm({ ...form, name: e.target.value })} style={styles.input} />
              <input placeholder="SKU Code *" required onChange={(e) => setForm({ ...form, sku: e.target.value })} style={styles.input} />
              <input placeholder="Category" onChange={(e) => setForm({ ...form, category: e.target.value })} style={styles.input} />
              <input placeholder="Unit Price (₹)" type="number" min="0" onChange={(e) => setForm({ ...form, unit_price: e.target.value })} style={styles.input} />
              <input placeholder="Current Stock" type="number" min="0" onChange={(e) => setForm({ ...form, current_stock: e.target.value })} style={styles.input} />
              <input placeholder="Min Stock Alert" type="number" min="0" onChange={(e) => setForm({ ...form, min_stock_alert: e.target.value })} style={styles.input} />
              <input placeholder="Warehouse Location" onChange={(e) => setForm({ ...form, location: e.target.value })} style={styles.input} />
              <button type="submit" style={styles.submitBtn}>Save Product</button>
            </form>
          </div>
        )}

        {loading ? (
          <div style={styles.loading}>Loading products...</div>
        ) : products.length === 0 ? (
          <div style={styles.empty}>No products found. Try adjusting your search or add a new one.</div>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>SKU</th>
                  <th style={styles.th}>Category</th>
                  <th style={styles.th}>Price</th>
                  <th style={styles.th}>Stock</th>
                  <th style={styles.th}>Location</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} style={styles.tr}>
                    <td style={styles.td}><strong>{p.name}</strong></td>
                    <td style={styles.td}>{p.sku}</td>
                    <td style={styles.td}>{p.category || '-'}</td>
                    <td style={styles.td}>₹{p.unit_price}</td>
                    <td style={styles.td}>{stockBadge(p.current_stock, p.min_stock_alert)}</td>
                    <td style={styles.td}>{p.location || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  page: { fontFamily: "'Segoe UI', sans-serif", background: '#f8fafc', minHeight: '100vh' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0f172a', color: 'white', padding: '15px 30px' },
  headerTitle: { margin: 0, fontSize: '20px' },
  backBtn: { padding: '8px 14px', background: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '6px', cursor: 'pointer' },
  container: { maxWidth: '1100px', margin: '30px auto', padding: '0 20px' },
  pageTitle: { margin: '0 0 20px', color: '#1e293b' },
  toolbar: { display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' },
  searchInput: { flex: 1, minWidth: '250px', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px' },
  addBtn: { padding: '10px 18px', background: '#059669', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' },
  formCard: { background: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', marginBottom: '25px' },
  formTitle: { margin: '0 0 15px', fontSize: '16px', color: '#334155' },
  formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' },
  input: { padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', outline: 'none' },
  submitBtn: { gridColumn: '1 / -1', padding: '12px', background: '#059669', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', marginTop: '10px' },
  successMsg: { background: '#d1fae5', color: '#065f46', padding: '10px', borderRadius: '6px', marginBottom: '15px', fontSize: '13px' },
  errorMsg: { background: '#fee2e2', color: '#991b1b', padding: '10px', borderRadius: '6px', marginBottom: '15px', fontSize: '13px' },
  loading: { textAlign: 'center', padding: '30px', color: '#64748b' },
  empty: { textAlign: 'center', padding: '40px', background: 'white', borderRadius: '10px', color: '#94a3b8' },
  tableWrapper: { background: 'white', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', minWidth: '600px' },
  th: { textAlign: 'left', padding: '14px 16px', borderBottom: '2px solid #e2e8f0', color: '#475569', fontSize: '13px', fontWeight: '600' },
  tr: { borderBottom: '1px solid #f1f5f9' },
  td: { padding: '12px 16px', fontSize: '14px', color: '#334155' },
  badgeGreen: { padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '500', background: '#d1fae5', color: '#065f46' },
  badgeYellow: { padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '500', background: '#fef3c7', color: '#92400e' },
  badgeRed: { padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '500', background: '#fee2e2', color: '#991b1b' }
};

export default Products;