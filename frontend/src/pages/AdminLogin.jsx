import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin, adminRegister } from '../api';
import './AdminLogin.css';

const AdminLogin = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await adminLogin(formData.username, formData.password);
      } else {
        await adminRegister(formData.username, formData.email, formData.password);
      }
      window.location.href = '/admin';
    } catch (err) {
      alert('Admin Authentication failed. Check credentials and privileges.');
    }
  };

  return (
    <div className="admin-auth-container">
      <div className="admin-auth-box glass-panel animate-fade-in">
        <h2 className="admin-logo-gradient text-center" style={{marginBottom: '30px', fontSize: '32px'}}>Admin Portal</h2>
        <h3 style={{marginBottom: '20px', color: 'var(--text-secondary)'}}>
          {isLogin ? 'Secure Login' : 'Register New Admin'}
        </h3>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <input 
            type="text" 
            placeholder="Admin Username" 
            className="input-field" 
            value={formData.username}
            onChange={e => setFormData({...formData, username: e.target.value})}
            required
          />
          {!isLogin && (
            <input 
              type="email" 
              placeholder="Admin Email" 
              className="input-field animate-fade-in" 
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
          )}
          <input 
            type="password" 
            placeholder="Admin Password" 
            className="input-field" 
            value={formData.password}
            onChange={e => setFormData({...formData, password: e.target.value})}
            required
          />
          <button type="submit" className="btn btn-admin" style={{width: '100%', marginTop: '10px'}}>
            {isLogin ? 'Access Dashboard' : 'Create Admin Account'}
          </button>
        </form>

        <p className="auth-switch" style={{marginTop: '20px'}}>
          {isLogin ? "Need a new admin account? " : "Already an admin? "}
          <span onClick={() => setIsLogin(!isLogin)}>{isLogin ? 'Register' : 'Login'}</span>
        </p>

        <p className="auth-switch">
          Not an admin? <span onClick={() => navigate('/')}>Return to User Login</span>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
