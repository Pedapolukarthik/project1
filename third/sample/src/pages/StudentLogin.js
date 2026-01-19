// StudentLogin.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserGraduate, FaLock, FaSignInAlt } from 'react-icons/fa';
import axios from 'axios'; // ✅ added for API call
import './Login.css';

function StudentLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // ✅ Make API call to backend
      const res = await axios.post('https://event-management-backend-production-152a.up.railway.app/api/login', {
        username,
        password
      });

      if (res.status === 200 && res.data.message === 'Login successful') {
        // Save username to localStorage so it can be used for registration
        localStorage.setItem('username', username);
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userRole', 'student');
        navigate('/student-dashboard'); // ✅ Navigate on success
      } else {
        alert('Login failed'); // unlikely, but fallback
      }

    } catch (err) {
      // ✅ Show backend error message
      if (err.response && err.response.data && err.response.data.message) {
        alert(err.response.data.message);
      } else {
        alert('Server error. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container student-login">
      <div className="login-card">
        <div className="login-header">
          <div className="login-icon">
            <FaUserGraduate />
          </div>
          <h2>Student Portal</h2>
          <p>Access your learning dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <span className="input-icon"><FaUserGraduate /></span>
            <input
              type="text"
              placeholder="Student Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <span className="input-icon"><FaLock /></span>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="remember-forgot">
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <a href="/forgot-password">Forgot password?</a>
          </div>

          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Signing in...' : (
              <>
                <FaSignInAlt /> Login
              </>
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>New student? <a href="/register">Create account</a></p>
          <p className="secure-msg">
            <span>🔒</span> Secured by University System
          </p>
        </div>
      </div>
    </div>
  );
}

export default StudentLogin;
