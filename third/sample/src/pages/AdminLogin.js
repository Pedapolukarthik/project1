// AdminLogin.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserShield, FaLock, FaSignInAlt } from 'react-icons/fa';
import API from '../api';
import './Login.css';

function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const res = await API.post('/login', { username, password });
      if (res.status === 200 && res.data.user?.role === 'admin') {
        localStorage.setItem('token', res.data.token || '');
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userRole', 'admin');
        localStorage.setItem('userId', res.data.user?.id || '');
        localStorage.setItem('username', res.data.user?.username || username);
        navigate('/admin-dashboard');
      } else {
        alert('Invalid admin credentials');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container admin-login">
      <div className="login-card">
        <div className="login-header">
          <div className="login-icon">
            <FaUserShield />
          </div>
          <h2>Admin Portal</h2>
          <p>Access your administrative dashboard</p>
        </div>
        
        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <span className="input-icon"><FaUserShield /></span>
            <input
              type="text"
              placeholder="Admin Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          
          <div className="input-group">
            <span className="input-icon"><FaLock /></span>
            <input
              type="password"
              placeholder="Admin Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Authenticating...' : (
              <>
                <FaSignInAlt /> Login
              </>
            )}
          </button>
        </form>
        
        <div className="login-footer">
          <p>Forgot password? <a href="/reset-password">Reset here</a></p>
          <p className="secure-msg">
            <span>🔒</span> Secured by University System
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;