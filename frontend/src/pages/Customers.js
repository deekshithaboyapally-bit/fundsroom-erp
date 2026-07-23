import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = 'https://fundsroom-erp-cm0q.onrender.com';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState({ type: '', text: '' });
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', mobile: '', email: '',
    business_name: '', gst_number: '',
    customer_type: 'Retail', address: '',
    status: 'Lead', follow_up_date: '', notes: ''
  });

    useEffect(() => {
    fetchCustomers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/customers?search=${search}`);
      setCustomers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg({ type: '', text: '' });
    try {
      await axios.post(`${API_URL}/customers`, form);
      setMsg({ type: 'success', text: 'Customer added successfully ✅' });
      setShowForm(false);
      setForm({ name: '', mobile: '', email: '', business_name: '', gst_number: '', customer_type: 'Retail', address: '', status: 'Lead', follow_up_date: '', notes: '' });
      fetchCustomers();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to add customer ❌' });
    }
  };

  const statusBadge = (status) => {
    const colors = {
      Lead: { bg: '#fef3c7', text: '#92400e' },
      Active: { bg: '#d1fae5', text: '#065f46' },
      Inactive: { bg: '#fee2e2', text: '#991b1b' }
    };
    const c = colors[status] || colors.Lead;
    return <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '500', background: c.bg, color: c.text }}>{status}</span>;
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h2 style={styles.headerTitle}>Fundsroom ERP</h2>
        <button onClick={() => navigate('/dashboard')} style={styles.backBtn}>← Back to Dashboard</button>
      </div>

      <div style={styles.container}>
        <h2 style={styles.pageTitle}>👥 Customers</h2>

        {msg.text && <div style={msg.type === 'success' ? styles.successMsg : styles.errorMsg}>{msg.text}</div>}

        <div style={styles.toolbar}>
          <input
            placeholder="Search by name, email or mobile..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
          <button onClick={() => setShowForm(!showForm)} style={styles.addBtn}>
            {showForm ? '✕ Cancel' : '+ Add Customer'}
          </button>
        </div>

        {showForm && (
          <div style={styles.formCard}>
            <h3 style={styles.formTitle}>Add New Customer</h3>
            <form onSubmit={handleSubmit} style={styles.formGrid}>
              <input placeholder="Full Name *" required onChange={(e) => setForm({ ...form, name: e.target.value })} style={styles.input} />
              <input placeholder="Mobile" onChange={(e) => setForm({ ...form, mobile: e.target.value })} style={styles.input} />
              <input placeholder="Email" type="email" onChange={(e) => setForm({ ...form, email: e.target.value })} style={styles.input} />
              <input placeholder="Business Name" onChange={(e) => setForm({ ...form, business_name: e.target.value })} style={styles.input} />
              <input placeholder="GST Number (Optional)" onChange={(e) => setForm({ ...form, gst_number: e.target.value })} style={styles.input} />
              <select onChange={(e) => setForm({ ...form, customer_type: e.target.value })} style={styles.input}>
                <option value="Retail">Retail</option>
                <option value="Wholesale">Wholesale</option>
                <option value="Distributor">Distributor</option>
              </select>
              <input placeholder="Address" onChange={(e) => setForm({ ...form, address: e.target.value })} style={styles.input} />
              <select onChange={(e) => setForm({ ...form, status: e.target.value })} style={styles.input}>
                <option value="Lead">Lead</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <input placeholder="Follow-up Date" type="date" onChange={(e) => setForm({ ...form, follow_up_date: e.target.value })} style={styles.input} />
              <input placeholder="Notes" onChange={(e) => setForm({ ...form, notes: e.target.value })} style={styles.input} />
              <button type="submit" style={styles.submitBtn}>Save Customer</button>
            </form>
          </div>
        )}

        {loading ? (
          <div style={styles.loading}>Loading customers...</div>
        ) : customers.length === 0 ? (
          <div style={styles.empty}>No customers found. Try adjusting your search or add a new one.</div>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Mobile</th>
                  <th style={styles.th}>Business</th>
                  <th style={styles.th}>Type</th>
                  <th style={styles.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.id} style={styles.tr}>
                    <td style={styles.td}><strong>{c.name}</strong></td>
                    <td style={styles.td}>{c.mobile || '-'}</td>
                    <td style={styles.td}>{c.business_name || '-'}</td>
                    <td style={styles.td}>{c.customer_type}</td>
                    <td style={styles.td}>{statusBadge(c.status)}</td>
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
  addBtn: { padding: '10px 18px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' },
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
  td: { padding: '12px 16px', fontSize: '14px', color: '#334155' }
};

export default Customers;