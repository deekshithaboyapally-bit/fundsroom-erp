import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = 'https://fundsroom-erp-cm0q.onrender.com';

const Challans = () => {
  const [challans, setChallans] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState({ type: '', text: '' });
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const [form, setForm] = useState({
    customer_id: '',
    status: 'Draft',
    items: [{ product_id: '', quantity: 1 }]
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [cRes, pRes, chRes] = await Promise.all([
        axios.get(`${API_URL}/customers`),
        axios.get(`${API_URL}/products`),
        axios.get(`${API_URL}/challans`)
      ]);
      setCustomers(cRes.data);
      setProducts(pRes.data);
      setChallans(chRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addItem = () => {
    setForm({ ...form, items: [...form.items, { product_id: '', quantity: 1 }] });
  };

  const removeItem = (index) => {
    setForm({ ...form, items: form.items.filter((_, i) => i !== index) });
  };

  const updateItem = (index, field, value) => {
    const newItems = form.items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setForm({ ...form, items: newItems });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg({ type: '', text: '' });
    try {
      await axios.post(`${API_URL}/challans`, { ...form, created_by: user?.id });
      setMsg({ type: 'success', text: 'Challan created successfully ✅' });
      setShowForm(false);
      setForm({ customer_id: '', status: 'Draft', items: [{ product_id: '', quantity: 1 }] });
      fetchData();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to create challan ❌' });
    }
  };

  const statusBadge = (status) => {
    const colors = {
      Draft: { bg: '#fef3c7', text: '#92400e' },
      Confirmed: { bg: '#d1fae5', text: '#065f46' },
      Cancelled: { bg: '#fee2e2', text: '#991b1b' }
    };
    const c = colors[status] || colors.Draft;
    return <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '500', background: c.bg, color: c.text }}>{status}</span>;
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h2 style={styles.headerTitle}>Fundsroom ERP</h2>
        <button onClick={() => navigate('/dashboard')} style={styles.backBtn}>← Back to Dashboard</button>
      </div>

      <div style={styles.container}>
        <h2 style={styles.pageTitle}>🧾 Sales Challans</h2>

        {msg.text && <div style={msg.type === 'success' ? styles.successMsg : styles.errorMsg}>{msg.text}</div>}

        <div style={styles.toolbar}>
          <button onClick={() => setShowForm(!showForm)} style={styles.addBtn}>
            {showForm ? '✕ Cancel' : '+ Create Challan'}
          </button>
        </div>

        {showForm && (
          <div style={styles.formCard}>
            <h3 style={styles.formTitle}>Create New Challan</h3>
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.formRow}>
                <label style={styles.label}>Customer *</label>
                <select required onChange={(e) => setForm({ ...form, customer_id: e.target.value })} style={styles.input}>
                  <option value="">-- Select Customer --</option>
                  {customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div style={styles.formRow}>
                <label style={styles.label}>Status</label>
                <select onChange={(e) => setForm({ ...form, status: e.target.value })} style={styles.input}>
                  <option value="Draft">Draft</option>
                  <option value="Confirmed">Confirmed</option>
                </select>
              </div>

              <h4 style={{ margin: '15px 0 10px', color: '#334155' }}>Products:</h4>
              {form.items.map((item, index) => (
                <div key={index} style={styles.itemRow}>
                  <select required onChange={(e) => updateItem(index, 'product_id', e.target.value)} style={{ ...styles.input, flex: 2 }}>
                    <option value="">-- Select Product --</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id} disabled={p.current_stock <= 0}>
                        {p.name} (Stock: {p.current_stock})
                      </option>
                    ))}
                  </select>
                  <input type="number" placeholder="Qty" min="1" value={item.quantity}
                    onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
                    style={{ ...styles.input, flex: 0.5 }} />
                  {form.items.length > 1 && (
                    <button type="button" onClick={() => removeItem(index)} style={styles.removeBtn}>✕</button>
                  )}
                </div>
              ))}

              <button type="button" onClick={addItem} style={styles.addItemBtn}>+ Add Another Product</button>

              <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                <button type="submit" style={styles.submitBtn}>Save Challan</button>
                <button type="button" onClick={() => setShowForm(false)} style={styles.cancelBtn}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div style={styles.loading}>Loading challans...</div>
        ) : challans.length === 0 ? (
          <div style={styles.empty}>No challans found. Create your first one above.</div>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Challan No.</th>
                  <th style={styles.th}>Customer</th>
                  <th style={styles.th}>Total Qty</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Date</th>
                </tr>
              </thead>
              <tbody>
                {challans.map((c) => (
                  <tr key={c.id} style={styles.tr}>
                    <td style={styles.td}><strong>{c.challan_number}</strong></td>
                    <td style={styles.td}>{c.customer_name || '-'}</td>
                    <td style={styles.td}>{c.total_quantity}</td>
                    <td style={styles.td}>{statusBadge(c.status)}</td>
                    <td style={styles.td}>{new Date(c.created_at).toLocaleDateString()}</td>
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
  addBtn: { padding: '10px 18px', background: '#dc2626', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' },
  formCard: { background: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', marginBottom: '25px' },
  formTitle: { margin: '0 0 15px', fontSize: '16px', color: '#334155' },
  form: { display: 'flex', flexDirection: 'column', gap: '12px' },
  formRow: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '13px', fontWeight: '500', color: '#374151' },
  input: { padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', outline: 'none' },
  itemRow: { display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' },
  removeBtn: { padding: '8px 12px', background: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
  addItemBtn: { padding: '8px 14px', background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer', alignSelf: 'flex-start', marginTop: '5px' },
  submitBtn: { padding: '12px 20px', background: '#dc2626', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
  cancelBtn: { padding: '12px 20px', background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer' },
  successMsg: { background: '#d1fae5', color: '#065f46', padding: '10px', borderRadius: '6px', marginBottom: '15px', fontSize: '13px' },
  errorMsg: { background: '#fee2e2', color: '#991b1b', padding: '10px', borderRadius: '6px', marginBottom: '15px', fontSize: '13px' },
  loading: { textAlign: 'center', padding: '30px', color: '#64748b' },
  empty: { textAlign: 'center', padding: '40px', background: 'white', borderRadius: '10px', color: '#94a3b8' },
  tableWrapper: { background: 'white', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', minWidth: '600px' },
  th: { textAlign: 'left', padding: '14px 16px', borderBottom: '2px solid #e2e8f0', color: '#475569', fontSize: '13px', fontWeight: '600' },
  tr: { borderBottom: '1px solid #f1f5f9' },
  td: { padding: '12px 16px', fontSize: '14px', color: '#334155' }
};

export default Challans;