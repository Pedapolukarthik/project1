import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserGraduate, FaUserShield, FaCalendarAlt } from 'react-icons/fa';
import './Home.css';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="home-content">
        <div className="header-section">
          <div className="logo">
            <FaCalendarAlt />
          </div>
          <h1>College Event Management System</h1>
          <p className="subtitle">Connecting students and administrators through seamless event management</p>
        </div>

        <div className="login-options">
          <div className="login-card student" onClick={() => navigate('/student-login')}>
            <div className="card-icon">
              <FaUserGraduate />
            </div>
            <h2>Student Portal</h2>
            <p>Access event registrations, schedules, and campus activities</p>
            <button className="btn student-btn">
              Student Login
            </button>
          </div>

          <div className="login-card admin" onClick={() => navigate('/admin-login')}>
            <div className="card-icon">
              <FaUserShield />
            </div>
            <h2>Admin Portal</h2>
            <p>Manage events, registrations, and student activities</p>
            <button className="btn admin-btn">
              Admin Login
            </button>
          </div>
        </div>

        <div className="features-section">
          <h3>Why Choose Our System?</h3>
          <div className="features-grid">
            <div className="feature">
              <div className="feature-icon">📅</div>
              <h4>Event Management</h4>
              <p>Easily create and manage college events</p>
            </div>
            <div className="feature">
              <div className="feature-icon">👥</div>
              <h4>Student Engagement</h4>
              <p>Boost participation in campus activities</p>
            </div>
            <div className="feature">
              <div className="feature-icon">📊</div>
              <h4>Real-time Analytics</h4>
              <p>Track event participation and engagement</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;