import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { FaCalendarAlt, FaMapMarkerAlt, FaUserGraduate, FaHome, FaSignOutAlt, FaClock, FaLink, FaCheckCircle, FaUsers } from 'react-icons/fa';
import { MdComputer, MdEvent, MdBook, MdAssignment, MdGrade, MdGroups } from 'react-icons/md';
import './Dashboard.css';
import Toast from '../components/Toast';

function StudentDashboard() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [registeringEventId, setRegisteringEventId] = useState(null);
  const [registeredEventIds, setRegisteredEventIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('latest');
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [analytics, setAnalytics] = useState({
    registrations_count: 0,
    upcoming_events: [],
  });
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  const fetchEvents = async () => {
    setIsLoading(true);
    setLoadError('');
    try {
      const params = {};
      if (searchQuery.trim()) params.q = searchQuery.trim();
      if (statusFilter !== 'all') params.status = statusFilter;
      if (sortOrder) params.sort = sortOrder;
      const res = await API.get('/events/all', { params });
      setEvents(res.data);
    } catch (err) {
      setLoadError('Failed to load events');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRegistrations = async () => {
    try {
      const res = await API.get('/events/registrations/my');
      setRegisteredEventIds(res.data.event_ids || []);
    } catch (err) {
      console.error('Failed to load registrations', err);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await API.get('/events/analytics/student');
      setAnalytics(res.data);
    } catch (err) {
      console.error('Failed to load analytics', err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [searchQuery, statusFilter, sortOrder]);

  useEffect(() => {
    fetchRegistrations();
    fetchAnalytics();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/');
  };

  const goHome = () => {
    navigate('/');
  };

  const handleRegister = async (eventId) => {
    setRegisteringEventId(eventId);
    try {
      const response = await API.post(`/events/${eventId}/register`);
      setRegisteredEventIds((prev) => Array.from(new Set([...prev, eventId])));
      showToast('Successfully registered for the event!', 'success');
      console.log('Registration successful:', response.data);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          err.message || 
                          'Failed to register for event';
      showToast(`Registration failed: ${errorMessage}`, 'error');
      console.error('Registration error:', err);
    } finally {
      setRegisteringEventId(null);
    }
  };

  return (
    <div className="dashboard-container student-dashboard-modern">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      {/* Modern Hero Header */}
      <header className="student-hero-header">
        <div className="hero-background"></div>
        <div className="hero-content">
          <div className="welcome-section">
            <h1 className="hero-title">
              Welcome back, <span className="highlight-text">Student!</span>
            </h1>
            <p className="hero-subtitle">Here's what's happening at your campus</p>
            <p className="hero-meta">Registered events: {analytics.registrations_count}</p>
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
            <div className="event-filters">
              <input
                className="filter-input"
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <select
                className="filter-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
              </select>
              <select
                className="filter-select"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="latest">Latest</option>
                <option value="oldest">Oldest</option>
              </select>
            </div>
          </div>

          {isLoading && (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading events...</p>
            </div>
          )}
          {loadError && !isLoading && (
            <div className="empty-events-state">
              <MdEvent className="empty-icon" />
              <h3>{loadError}</h3>
              <p>Please try again later.</p>
            </div>
          )}

          {!isLoading && !loadError && (
            events.length === 0 ? (
              <div className="empty-events-state">
                <MdEvent className="empty-icon" />
                <h3>No Events Available</h3>
                <p>Check back later for upcoming events!</p>
              </div>
            ) : (
              <div className="events-grid-modern">
                {events.map((event, index) => {
                  const isRegistered = registeredEventIds.includes(event.id);
                  const isClosed = event.is_full === 1 || event.status !== 'Upcoming';
                  return (
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
                        <div className={`event-badge event-badge-${(event.status || '').toLowerCase()}`}>
                          {event.status || 'Upcoming'}
                        </div>
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

                          {event.capacity !== null && (
                            <div className="detail-row">
                              <FaUsers className="detail-icon" />
                              <div className="detail-content">
                                <span className="detail-label">Capacity</span>
                                <span className="detail-value">
                                  {event.registrations_count}/{event.capacity}
                                </span>
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
                          disabled={registeringEventId === event.id || isClosed || isRegistered}
                        >
                          {registeringEventId === event.id ? (
                            <>
                              <span className="spinner-small"></span>
                              Registering...
                            </>
                          ) : isRegistered ? (
                            <>
                              <FaCheckCircle />
                              Registered
                            </>
                          ) : isClosed ? (
                            'Registration Closed'
                          ) : (
                            <>
                              <FaCheckCircle />
                              Register Now
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          )}
        </section>

        <section className="registered-events-modern">
          <div className="section-header-modern">
            <div className="section-title-group">
              <div className="section-icon-wrapper">
                <FaCheckCircle />
              </div>
              <div>
                <h2 className="section-title">Your Upcoming Registrations</h2>
                <p className="section-subtitle">
                  {analytics.upcoming_events.length} upcoming event(s)
                </p>
              </div>
            </div>
          </div>

          {analytics.upcoming_events.length === 0 ? (
            <div className="empty-events-state">
              <FaCheckCircle className="empty-icon" />
              <h3>No upcoming registrations</h3>
              <p>Register for events to see them here.</p>
            </div>
          ) : (
            <div className="registered-events-grid">
              {analytics.upcoming_events.map((event) => (
                <div key={event.id} className="registered-event-card">
                  <h3>{event.title}</h3>
                  <p>{new Date(event.date).toLocaleDateString()}</p>
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
