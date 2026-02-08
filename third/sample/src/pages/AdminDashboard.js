import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import { FaCalendarAlt, FaMapMarkerAlt, FaUserTie, FaUsers, FaClock, FaLink, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { MdEventAvailable, MdPeople, MdEvent, MdPendingActions, MdTrendingUp } from 'react-icons/md';
import CreateEventForm from './CreateEventForm';
import API from '../api';
import Toast from '../components/Toast';

function AdminDashboard() {
  const [events, setEvents] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showRegistrations, setShowRegistrations] = useState(false);
  const [registrations, setRegistrations] = useState([]);
  const [loadingRegistrations, setLoadingRegistrations] = useState(false);
  const [analytics, setAnalytics] = useState({
    total_events: 0,
    total_registrations: 0,
    active_events: 0,
    completed_events: 0
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('latest');
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    registration_link: '',
    capacity: ''
  });

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
      setLoadError('Failed to fetch events');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await API.get('/events/analytics/admin');
      setAnalytics(res.data);
    } catch (err) {
      console.error('Failed to fetch analytics', err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [searchQuery, statusFilter, sortOrder]);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const handleCreateClick = () => setShowCreateForm(true);
  const handleFormClose = () => {
    setShowCreateForm(false);
    setShowEditModal(false);
    fetchEvents();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await API.delete(`/events/delete/${id}`);
        setEvents(events.filter(e => e.id !== id));
        showToast('Event deleted successfully', 'success');
      } catch (error) {
        console.error("Delete failed", error);
        showToast('Failed to delete event', 'error');
      }
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData(event); // Pre-fill form
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/events/update/${editingEvent.id}`, {
        ...formData,
        capacity: formData.capacity ? Number(formData.capacity) : null,
      });
      setShowEditModal(false);
      fetchEvents();
      showToast('Event updated successfully', 'success');
    } catch (error) {
      console.error("Update failed", error);
      showToast('Failed to update event', 'error');
    }
  };

  const handleViewRegistrations = async (event) => {
    setSelectedEvent(event);
    setShowRegistrations(true);
    setLoadingRegistrations(true);
    setRegistrations([]);

    try {
      const response = await API.get(`/events/${event.id}/registrations`);
      setRegistrations(response.data.registrations || []);
    } catch (error) {
      console.error("Failed to fetch registrations", error);
      alert('Failed to load registered students');
      setRegistrations([]);
    } finally {
      setLoadingRegistrations(false);
    }
  };

  const handleCloseRegistrations = () => {
    setShowRegistrations(false);
    setSelectedEvent(null);
    setRegistrations([]);
  };

  const handleExportRegistrations = async () => {
    if (!selectedEvent) return;
    try {
      const response = await API.get(`/events/${selectedEvent.id}/registrations`, {
        params: { format: 'csv' },
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `event_${selectedEvent.id}_registrations.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      showToast('Failed to export registrations', 'error');
    }
  };

  // Admin analytics from API
  const totalRegistrations = analytics.total_registrations || 0;
  const activeEventsCount = analytics.active_events || 0;
  const completedEventsCount = analytics.completed_events || 0;
  const totalEventsCount = analytics.total_events || 0;

  const stats = [
    { 
      title: 'Total Events', 
      value: totalEventsCount.toString(), 
      change: `+${totalEventsCount}`, 
      trend: 'up',
      icon: <MdEvent />,
      color: 'var(--stat-blue)'
    },
    { 
      title: 'Active Events', 
      value: activeEventsCount.toString(), 
      change: `+${activeEventsCount}`, 
      trend: 'up',
      icon: <MdPendingActions />,
      color: 'var(--stat-purple)'
    },
    { 
      title: 'Completed Events', 
      value: completedEventsCount.toString(), 
      change: `+${completedEventsCount}`, 
      trend: 'up',
      icon: <MdTrendingUp />,
      color: 'var(--stat-orange)'
    },
    { 
      title: 'Total Registrations', 
      value: totalRegistrations.toString(), 
      change: `+${totalRegistrations}`, 
      trend: 'up',
      icon: <MdPeople />,
      color: 'var(--stat-green)'
    }
  ];

  return (
    <div className="dashboard-container admin-dashboard">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      {/* Modern Gradient Header */}
      <header className="dashboard-header-modern">
        <div className="header-content">
          <div className="welcome-message-modern">
            <h1>Karthik Dashboard</h1>
            <p>Welcome back, <span className="admin-name">Administrator</span></p>
          </div>
          <div className="header-actions-modern">
            <button className="notification-btn-modern">
              <span className="notification-icon">🔔</span>
              <span className="badge-modern">3</span>
            </button>
            <div className="user-avatar-modern">
              <FaUserTie />
            </div>
          </div>
        </div>
      </header>

      {/* Statistics Cards */}
      <section className="stats-grid-modern">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card-modern" style={{ '--stat-color': stat.color }}>
            <div className="stat-icon-wrapper">
              {stat.icon}
            </div>
            <div className="stat-content">
              <h3 className="stat-title">{stat.title}</h3>
              <div className="stat-value-modern">{stat.value}</div>
              <div className={`stat-change-modern ${stat.trend}`}>
                <span className="change-value">{stat.change}</span>
                <span className="change-arrow">{stat.trend === 'up' ? '↑' : '↓'}</span>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Events Section */}
      <section className="events-section-modern">
        <div className="section-header-modern">
          <div className="section-title-wrapper">
            <FaCalendarAlt className="section-icon" />
            <h2>Upcoming Events</h2>
            <span className="event-count-badge">{events.length} Events</span>
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
            <button className="create-btn-modern" onClick={handleCreateClick}>
              <span className="btn-icon">+</span>
              Create Event
            </button>
          </div>
        </div>

        {isLoading && (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading events...</p>
          </div>
        )}
        {loadError && !isLoading && (
          <div className="empty-events">
            <MdEventAvailable className="empty-icon" />
            <p>{loadError}</p>
          </div>
        )}

        {!isLoading && !loadError && (
          events.length === 0 ? (
            <div className="empty-events">
              <MdEventAvailable className="empty-icon" />
              <p>No events yet. Create your first event!</p>
              <button className="create-btn-modern" onClick={handleCreateClick}>
                <span className="btn-icon">+</span>
                Create Event
              </button>
            </div>
          ) : (
            <div className="admin-events-grid-modern">
              {events.map((event, index) => (
                <div key={event.id} className="admin-event-card-modern" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="event-card-header">
                    <div className="event-icon-modern">
                      <MdEventAvailable />
                    </div>
                    <div className="event-title-section">
                      <h3>{event.title}</h3>
                      {event.description && (
                        <p className="event-description">{event.description.substring(0, 60)}...</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="event-details-modern">
                    <div className="detail-item">
                      <FaCalendarAlt className="detail-icon" />
                      <div>
                        <span className="detail-label">Date</span>
                        <span className="detail-value">{new Date(event.date).toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}</span>
                      </div>
                    </div>
                    {event.time && (
                      <div className="detail-item">
                        <FaClock className="detail-icon" />
                        <div>
                          <span className="detail-label">Time</span>
                          <span className="detail-value">{event.time}</span>
                        </div>
                      </div>
                    )}
                    {event.location && (
                      <div className="detail-item">
                        <FaMapMarkerAlt className="detail-icon" />
                        <div>
                          <span className="detail-label">Location</span>
                          <span className="detail-value">{event.location}</span>
                        </div>
                      </div>
                    )}
                    {event.capacity !== null && (
                      <div className="detail-item">
                        <FaUsers className="detail-icon" />
                        <div>
                          <span className="detail-label">Capacity</span>
                          <span className="detail-value">
                            {event.registrations_count}/{event.capacity}
                          </span>
                        </div>
                      </div>
                    )}
                    {event.registration_link && (
                      <div className="detail-item">
                        <FaLink className="detail-icon" />
                        <div>
                          <span className="detail-label">Registration</span>
                          <a href={event.registration_link} target="_blank" rel="noopener noreferrer" className="detail-link">
                            View Link
                          </a>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="event-actions-modern">
                    <button 
                      className="action-btn view-btn" 
                      onClick={() => handleViewRegistrations(event)}
                      title="View Registrations"
                    >
                      <FaEye />
                      <span>View</span>
                    </button>
                    <button 
                      className="action-btn edit-btn" 
                      onClick={() => handleEdit(event)}
                      title="Edit Event"
                    >
                      <FaEdit />
                      <span>Edit</span>
                    </button>
                    <button 
                      className="action-btn delete-btn" 
                      onClick={() => handleDelete(event.id)}
                      title="Delete Event"
                    >
                      <FaTrash />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </section>

      {/* Create Event Modal */}
      {showCreateForm && (
        <div className="modal-overlay" onClick={handleFormClose}>
          <div onClick={(e) => e.stopPropagation()}>
            <CreateEventForm
              onClose={handleFormClose}
              onEventCreated={handleFormClose}
              onToast={showToast}
            />
          </div>
        </div>
      )}

      {/* Edit Event Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={handleFormClose}>
          <div className="createEventFormContainer" onClick={e => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={handleFormClose}>&times;</button>
            <div className="modal-header">
              <h2>Edit Event</h2>
              <p>Update event details</p>
            </div>
            <form onSubmit={handleEditSubmit} className="modern-form">
              <div className="form-group">
                <label>Event Title</label>
                <input type="text" name="title" value={formData.title} onChange={handleEditChange} placeholder="Enter event title" required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea name="description" value={formData.description} onChange={handleEditChange} placeholder="Enter event description" rows="4" required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Date</label>
                  <input type="date" name="date" value={formData.date} onChange={handleEditChange} required />
                </div>
                <div className="form-group">
                  <label>Time</label>
                  <input type="time" name="time" value={formData.time} onChange={handleEditChange} required />
                </div>
              </div>
              <div className="form-group">
                <label>Location</label>
                <input type="text" name="location" value={formData.location} onChange={handleEditChange} placeholder="Enter event location" required />
              </div>
              <div className="form-group">
                <label>Registration Link</label>
                <input type="url" name="registration_link" value={formData.registration_link} onChange={handleEditChange} placeholder="https://..." required />
              </div>
              <div className="form-group">
                <label>Capacity</label>
                <input type="number" name="capacity" value={formData.capacity || ''} onChange={handleEditChange} min="1" />
              </div>
              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={handleFormClose}>Cancel</button>
                <button type="submit" className="btn-submit">Update Event</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Registrations Modal */}
      {showRegistrations && selectedEvent && (
        <div className="modal-overlay" onClick={handleCloseRegistrations}>
          <div className="registrations-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={handleCloseRegistrations}>&times;</button>
            <div className="modal-header">
              <h2>Registered Students</h2>
              <p className="event-title-modal">{selectedEvent.title}</p>
            </div>
            <div className="modal-actions">
              <button className="create-btn-modern" onClick={handleExportRegistrations}>
                Export CSV
              </button>
            </div>
            <div className="modal-event-info">
              <div className="info-item">
                <FaCalendarAlt />
                <span>{new Date(selectedEvent.date).toLocaleDateString()}</span>
              </div>
              {selectedEvent.location && (
                <div className="info-item">
                  <FaMapMarkerAlt />
                  <span>{selectedEvent.location}</span>
                </div>
              )}
            </div>
            
            {loadingRegistrations ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading registrations...</p>
              </div>
            ) : registrations.length === 0 ? (
              <div className="empty-registrations">
                <FaUsers className="empty-icon-large" />
                <p>No students have registered for this event yet.</p>
              </div>
            ) : (
              <>
                <div className="registrations-count">
                  <FaUsers />
                  <span>Total: <strong>{registrations.length}</strong> {registrations.length === 1 ? 'Student' : 'Students'}</span>
                </div>
                <div className="registrations-table-wrapper">
                  <table className="registrations-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Department</th>
                        <th>Registered At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {registrations.map((reg) => (
                        <tr key={reg.registration_id}>
                          <td>{reg.student_id}</td>
                          <td><strong>{reg.name || reg.username}</strong></td>
                          <td>{reg.username}</td>
                          <td>{reg.email || 'N/A'}</td>
                          <td>{reg.department || 'N/A'}</td>
                          <td className="date-cell">{new Date(reg.registered_at).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
