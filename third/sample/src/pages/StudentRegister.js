// StudentRegister.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import './Login.css'; // Reuse login styles

function StudentRegister() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      alert("Username and Password are required.");
      return;
    }

    try {
      const res = await API.post('/register', {
        username,
        password,
      });

      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userRole', res.data.user?.role || 'student');
        localStorage.setItem('userId', res.data.user?.id || '');
      }
      alert(res.data.message || 'Registration successful');
      navigate('/student-dashboard');
    } catch (err) {
      console.error("Register Error:", err); // ✅ Debug log
      const msg =
        err.response?.data?.message || "Registration failed. Try again.";
      alert(msg);
    }
  };

  return (
    <div className="login-container student-login">
      <div className="login-card">
        <div className="login-header">
          <h2>Create Student Account</h2>
          <p>Fill in your credentials</p>
        </div>

        <form onSubmit={handleRegister} className="login-form">
          <div className="input-group">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit">Register</button>
        </form>

        <div className="login-footer">
          <p>
            Already have an account? <a href="/">Login</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default StudentRegister;
