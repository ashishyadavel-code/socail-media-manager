import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../api';
import './Auth.css';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await login(formData.username, formData.password);
        window.location.href = '/';
      } else {
        await register(formData.username, formData.email, formData.password);
        setIsLogin(true); // switch to login after register
      }
    } catch (err) {
      alert('Authentication failed. Check credentials.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box glass-panel animate-fade-in">
        <h2 className="logo-gradient text-center" style={{marginBottom: '30px', fontSize: '32px'}}>Chai Wali Media</h2>
        <h3 style={{marginBottom: '20px', color: 'var(--text-secondary)'}}>{isLogin ? 'Welcome Back' : 'Create Account'}</h3>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <input 
            type="text" 
            placeholder="Username" 
            className="input-field" 
            value={formData.username}
            onChange={e => setFormData({...formData, username: e.target.value})}
            required
          />
          {!isLogin && (
            <input 
              type="email" 
              placeholder="Email" 
              className="input-field animate-fade-in" 
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
          )}
          <input 
            type="password" 
            placeholder="Password" 
            className="input-field" 
            value={formData.password}
            onChange={e => setFormData({...formData, password: e.target.value})}
            required
          />
          <button type="submit" className="btn btn-primary" style={{width: '100%', marginTop: '10px'}}>
            {isLogin ? 'Log In' : 'Sign Up'}
          </button>
        </form>

        <p className="auth-switch">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span onClick={() => setIsLogin(!isLogin)}>{isLogin ? 'Sign up' : 'Log in'}</span>
        </p>
      </div>
    </div>
  );
};

export default Auth;
