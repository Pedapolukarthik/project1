import React from 'react';
import './Toast.css';

function Toast({ message, type = 'success', onClose }) {
  if (!message) return null;

  return (
    <div className={`toast toast-${type}`}>
      <span>{message}</span>
      <button type="button" className="toast-close" onClick={onClose}>
        ×
      </button>
    </div>
  );
}

export default Toast;
