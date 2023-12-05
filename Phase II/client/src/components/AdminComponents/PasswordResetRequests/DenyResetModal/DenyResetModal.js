import React, { useState } from 'react';
import './DenyResetModal.scss'

const DenyResetModal = ({ isOpen, onClose, onSubmit }) => {
  const [denyReason, setDenyReason] = useState('');

  const handleDenyReasonChange = (e) => {
    setDenyReason(e.target.value);
  };

  const handleDenySubmit = () => {
    onSubmit(denyReason);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className='overlay'>
    <div className={`modal ${isOpen ? 'open' : ''}`}>
      <button className="close" onClick={onClose}>
        X
      </button>
      <h2>Deny Request</h2>
      <label>Provide reason for password reset denial:</label>
      <textarea
        value={denyReason}
        onChange={handleDenyReasonChange}
        placeholder="Type your reason here"
      />
      <button className="submit" onClick={handleDenySubmit}>
        Submit Denial
      </button>
    </div>
    </div>
  );
};

export default DenyResetModal;