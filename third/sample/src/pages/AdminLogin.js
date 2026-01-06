// AdminLogin.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserShield, FaLock, FaSignInAlt } from 'react-icons/fa';
import './Login.css';

function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      if (username === '22a81a43b3' && password === 'karthik') {
        navigate('/admin-dashboard');
      } else {
        alert('Invalid admin credentials');
      }
      setIsLoading(false);
    }, 1000);
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