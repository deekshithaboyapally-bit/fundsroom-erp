import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Connect to your backend API
      const res = await axios.post('http://localhost:5000/auth/login', { email, password });
      
      // Save user info in browser memory
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      alert("Login Successful! ✅");
      navigate('/dashboard'); // Go to dashboard
    } catch (err) {
      alert("Invalid Credentials ❌");
    }
  };

  return (
    <div style={{ padding: '100px', textAlign: 'center', fontFamily: 'Arial' }}>
      <h1>Fundsroom ERP</h1>
      <div style={{ border: '1px solid #ccc', padding: '20px', display: 'inline-block', borderRadius: '10px' }}>
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input 
            type="email" 
            placeholder="Email" 
            style={{ padding: '10px', width: '250px' }}
            onChange={(e) => setEmail(e.target.value)} 
            required 
          /><br/><br/>
          <input 
            type="password" 
            placeholder="Password" 
            style={{ padding: '10px', width: '250px' }}
            onChange={(e) => setPassword(e.target.value)} 
            required 
          /><br/><br/>
          <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer', background: '#007bff', color: '#fff', border: 'none', borderRadius: '5px' }}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;