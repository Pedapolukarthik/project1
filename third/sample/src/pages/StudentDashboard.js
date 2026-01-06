import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaCalendarAlt, FaMapMarkerAlt, FaUserGraduate, FaHome, FaSignOutAlt, FaClock, FaLink, FaCheckCircle } from 'react-icons/fa';
import { MdComputer, MdEvent, MdBook, MdAssignment, MdGrade, MdGroups } from 'react-icons/md';
import './Dashboard.css';

function StudentDashboard() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [registeringEventId, setRegisteringEventId] = useState(null);
  const [studentInfo, setStudentInfo] = useState(() => {
    // Get student info from localStorage
    // IMPORTANT: Each student must have a unique username
    const storedUsername = localStorage.getItem('username');
    
    if (!storedUsername) {
      // If no username found, generate a unique one based on timestamp
      // This ensures each student session gets a unique identifier
      const uniqueUsername = `student_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('username', uniqueUsername);
      return {
        username: uniqueUsername,
        name: uniqueUsername,
        email: `${uniqueUsername}@univ.edu`,
        department: 'CSE'
      };
    }
    
    return {
      username: storedUsername,
      name: storedUsername,
      email: `${storedUsername}@univ.edu`,
      department: 'CSE'
    };
  });

  useEffect(() => {
    axios.get('http://localhost:5000/api/events/all')
      .then(res => setEvents(res.data))
      .catch(() => alert('Failed to load events'));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    navigate('/');
  };

  const goHome = () => {
    navigate('/');
  };

  const handleRegister = async (eventId) => {
    setRegisteringEventId(eventId);
    try {
      const response = await axios.post(
        `http://localhost:5000/api/events/${eventId}/register`,
        studentInfo,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      alert('Successfully registered for the event!');
      console.log('Registration successful:', response.data);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          err.message || 
                          'Failed to register for event';
      alert(`Registration failed: ${errorMessage}`);
      console.error('Registration error:', err);
    } finally {
      setRegisteringEventId(null);
    }
  };

  return (
    <div className="dashboard-container student-dashboard-modern">
      {/* Modern Hero Header */}
      <header className="student-hero-header">
        <div className="hero-background"></div>
        <div className="hero-content">
          <div className="welcome-section">
            <h1 className="hero-title">
              Welcome back, <span className="highlight-text">Student!</span>
            </h1>
            <p className="hero-subtitle">Here's what's happening at your campus</p>
          </div>
          <div className="header-actions-modern">
            <button className="action-icon-btn" onClick={goHome} title="Home">
              <FaHome />
            </button>
            <button className="action-icon-btn" onClick={handleLogout} title="Logout">
              <FaSignOutAlt />
            </button>
            <div className="user-avatar-modern">
              <FaUserGraduate />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="student-content-wrapper">
        {/* Upcoming Events Section */}
        <section className="events-section-modern">
          <div className="section-header-modern">
            <div className="section-title-group">
              <div className="section-icon-wrapper">
                <MdEvent />
              </div>
              <div>
                <h2 className="section-title">Upcoming Events</h2>
                <p className="section-subtitle">{events.length} {events.length === 1 ? 'Event' : 'Events'} Available</p>
              </div>
            </div>
            <button className="view-all-btn-modern">
              View All
            </button>
          </div>

          {events.length === 0 ? (
            <div className="empty-events-state">
              <MdEvent className="empty-icon" />
              <h3>No Events Available</h3>
              <p>Check back later for upcoming events!</p>
            </div>
          ) : (
            <div className="events-grid-modern">
              {events.map((event, index) => (
                <div 
                  key={event.id} 
                  className="event-card-modern"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="event-card-glow"></div>
                  <div className="event-card-header-modern">
                    <div className="event-icon-modern">
                      <MdEvent />
                    </div>
                    <div className="event-badge">New</div>
                  </div>
                  
                  <div className="event-card-body">
                    <h3 className="event-title-modern">{event.title}</h3>
                    {event.description && (
                      <p className="event-description-text">{event.description.substring(0, 80)}...</p>
                    )}
                    
                    <div className="event-details-modern">
                      <div className="detail-row">
                        <FaCalendarAlt className="detail-icon" />
                        <div className="detail-content">
                          <span className="detail-label">Date</span>
                          <span className="detail-value">
                            {new Date(event.date).toLocaleDateString('en-US', { 
                              weekday: 'short', 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </span>
                        </div>
                      </div>
                      
                      {event.time && (
                        <div className="detail-row">
                          <FaClock className="detail-icon" />
                          <div className="detail-content">
                            <span className="detail-label">Time</span>
                            <span className="detail-value">{event.time}</span>
                          </div>
                        </div>
                      )}
                      
                      {event.location && (
                        <div className="detail-row">
                          <FaMapMarkerAlt className="detail-icon" />
                          <div className="detail-content">
                            <span className="detail-label">Location</span>
                            <span className="detail-value">{event.location}</span>
                          </div>
                        </div>
                      )}
                      
                      {event.registration_link && (
                        <div className="detail-row">
                          <FaLink className="detail-icon" />
                          <div className="detail-content">
                            <span className="detail-label">Registration</span>
                            <a 
                              href={event.registration_link} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="external-link-modern"
                            >
                              View Link →
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="event-card-footer">
                    <button 
                      className={`register-btn-modern ${registeringEventId === event.id ? 'registering' : ''}`}
                      onClick={() => handleRegister(event.id)}
                      disabled={registeringEventId === event.id}
                    >
                      {registeringEventId === event.id ? (
                        <>
                          <span className="spinner-small"></span>
                          Registering...
                        </>
                      ) : (
                        <>
                          <FaCheckCircle />
                          Register Now
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Quick Access Section */}
        <section className="quick-access-modern">
          <div className="section-header-modern">
            <div className="section-title-group">
              <div className="section-icon-wrapper">
                <MdGroups />
              </div>
              <div>
                <h2 className="section-title">Quick Access</h2>
                <p className="section-subtitle">Navigate to your resources</p>
              </div>
            </div>
          </div>

          <div className="quick-access-grid">
            <div className="quick-access-card">
              <div className="access-icon-wrapper" style={{ '--icon-color': '#4e79a7' }}>
                <MdBook />
              </div>
              <h3>Course Materials</h3>
              <p>Access your study resources</p>
            </div>
            
            <div className="quick-access-card">
              <div className="access-icon-wrapper" style={{ '--icon-color': '#f28e2b' }}>
                <MdAssignment />
              </div>
              <h3>Assignments</h3>
              <p>View and submit assignments</p>
            </div>
            
            <div className="quick-access-card">
              <div className="access-icon-wrapper" style={{ '--icon-color': '#e15759' }}>
                <MdGrade />
              </div>
              <h3>Grades</h3>
              <p>Check your academic progress</p>
            </div>
            
            <div className="quick-access-card">
              <div className="access-icon-wrapper" style={{ '--icon-color': '#76b7b2' }}>
                <MdGroups />
              </div>
              <h3>Clubs</h3>
              <p>Join student organizations</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default StudentDashboard;
