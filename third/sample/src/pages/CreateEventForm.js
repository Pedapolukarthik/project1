import React, { useState } from 'react';
import axios from 'axios';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaLink, FaPaperPlane, FaTimes } from 'react-icons/fa';
import styles from './CreateEventForm.module.css';

function CreateEventForm({ onClose, onEventCreated }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    registration_link: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post('http://localhost:5000/api/events/create', formData);
      alert('Event created successfully!');
      onEventCreated(); // close form + refresh
    } catch (err) {
      alert(`Event creation failed: ${err.response?.data?.message || err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.createEventFormContainer}>
      <button
        type="button"
        className={styles.closeBtn}
        onClick={onClose}
        aria-label="Cancel"
      >
        <FaTimes />
      </button>

      <h2 className={styles.createEventFormTitle}>Create New Event</h2>
      <form onSubmit={handleSubmit} className={styles.createEventForm}>
        <div className={styles.createEventFormGroup}>
          <label htmlFor="title" className={styles.createEventFormLabel}>
            <FaCalendarAlt className={styles.createEventFormIcon} /> Event Title
          </label>
          <input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className={styles.createEventFormInput}
          />
        </div>

        <div className={styles.createEventFormGroup}>
          <label htmlFor="description" className={styles.createEventFormLabel}>Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className={styles.createEventFormTextarea}
          />
        </div>

        <div className={styles.createEventFormRow}>
          <div className={styles.createEventFormGroup}>
            <label htmlFor="date" className={styles.createEventFormLabel}>
              <FaCalendarAlt className={styles.createEventFormIcon} /> Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className={styles.createEventFormInput}
            />
          </div>
          <div className={styles.createEventFormGroup}>
            <label htmlFor="time" className={styles.createEventFormLabel}>
              <FaClock className={styles.createEventFormIcon} /> Time
            </label>
            <input
              type="time"
              id="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className={styles.createEventFormInput}
            />
          </div>
        </div>

        <div className={styles.createEventFormGroup}>
          <label htmlFor="location" className={styles.createEventFormLabel}>
            <FaMapMarkerAlt className={styles.createEventFormIcon} /> Location
          </label>
          <input
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className={styles.createEventFormInput}
          />
        </div>

        <div className={styles.createEventFormGroup}>
          <label htmlFor="registration_link" className={styles.createEventFormLabel}>
            <FaLink className={styles.createEventFormIcon} /> Registration Link
          </label>
          <input
            id="registration_link"
            name="registration_link"
            type="url"
            value={formData.registration_link}
            onChange={handleChange}
            className={styles.createEventFormInput}
          />
        </div>

        <button
          type="submit"
          className={styles.createEventFormSubmitBtn}
          disabled={isSubmitting}
        >
          <FaPaperPlane className={styles.createEventFormSubmitIcon} />
          {isSubmitting ? 'Creating...' : 'Create Event'}
        </button>
      </form>
    </div>
  );
}

export default CreateEventForm;
