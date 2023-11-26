import React, { useState } from 'react';
import './DenyComplaint.scss'

const DenyComplaint = ({ isOpen, onClose, onSubmit }) => {
  const [complaintDenyReason, setComplaintDenyReason] = useState('');

  const handleComplaintDenyReasonChange = (e) => {
    setComplaintDenyReason(e.target.value);
  };

  const handleComplaintDenySubmit = () => {
    onSubmit(complaintDenyReason);
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
      <h2>Deny Complaint</h2>
      <label>Provide reason for complaint denial:</label>
      <textarea
        value={complaintDenyReason}
        onChange={handleComplaintDenyReasonChange}
        placeholder="Type your reason here"
      />
      <button className="submit" onClick={handleComplaintDenySubmit}>
        Submit Denial
      </button>
    </div>
    </div>
  );
};

export default DenyComplaint;