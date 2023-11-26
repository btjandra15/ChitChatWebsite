import React, { useState } from 'react';
import './ApproveComplaint.scss'

const ApproveComplaint = ({ isOpen, onClose, onSubmit }) => {
  const [disputeDenyReason, setDisputeDenyReason] = useState('');

  const handleDisputeDenyReasonChange = (e) => {
    setDisputeDenyReason(e.target.value);
  };

  const handleDisputeDenySubmit = () => {
    onSubmit(disputeDenyReason);
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
      <h2>Approve Complaint</h2>
      <label>*IMP* This means the dispute is being denied.</label>
      <label>Provide reason for dispute denial:</label>
      <textarea
        value={disputeDenyReason}
        onChange={handleDisputeDenyReasonChange}
        placeholder="Type your reason here"
      />
      <button className="submit" onClick={handleDisputeDenySubmit}>
        Submit Denial
      </button>
    </div>
    </div>
  );
};

export default ApproveComplaint;
