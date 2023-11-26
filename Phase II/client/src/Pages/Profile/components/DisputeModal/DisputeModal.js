import React, { useState } from 'react';
import './DisputeModal.scss';

const DisputeModal = ({ isOpen, onClose, onSubmit }) => {
  const [disputeReason, setDisputeReason] = useState('');

  const handleDisputeReasonChange = (e) => {
    setDisputeReason(e.target.value);
  };

  const handleSubmit = () => {
    onSubmit(disputeReason);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="overlay">
      <div className="modal">
        <button className="close" onClick={onClose}>
          X
        </button>
        <h2>Dispute Complaint</h2>
        <label>Explain your dispute reason:</label>
        <textarea
          value={disputeReason}
          onChange={handleDisputeReasonChange}
          placeholder="Type your dispute reason here"
        />
        <button className="submit" onClick={handleSubmit}>
          Submit Dispute
        </button>
      </div>
    </div>
  );
};

export default DisputeModal;