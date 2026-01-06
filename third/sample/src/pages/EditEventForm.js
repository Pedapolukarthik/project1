import React, { useState } from 'react';
import '../components/EditEventForm.css';
import axios from 'axios';

function EditEventForm({ event, onClose }) {
  const [formData, setFormData] = useState({ ...event });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/events/update/${formData.id}`, formData);
      onClose();
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  return (
    <div className="createEventFormContainer">
      <button onClick={onClose} style={{ position: 'absolute', top: '15px', right: '20px', fontSize: '1.5rem', border: 'none', background: 'blue', cursor: 'pointer' }}>
        &times;
      </button>
      <h2 className="createEventFormTitle">Edit Event</h2>
      <form onSubmit={handleSubmit} className="editEventForm">
        <input className="createEventFormInput" name="title" value={formData.title} onChange={handleChange} placeholder="Title" required />
        <textarea className="createEventFormTextarea" name="description" value={formData.description} onChange={handleChange} placeholder="Description" required />
        <input className="createEventFormInput" type="date" name="date" value={formData.date} onChange={handleChange} required />
        <input className="createEventFormInput" type="time" name="time" value={formData.time} onChange={handleChange} required />
        <input className="createEventFormInput" name="location" value={formData.location} onChange={handleChange} placeholder="Location" required />
        <input className="createEventFormInput" name="registration_link" value={formData.registration_link} onChange={handleChange} placeholder="Registration Link" required />
        <button type="submit" className="createEventFormSubmitBtn">Update Event</button>
      </form>
    </div>
  );
}

export default EditEventForm;
