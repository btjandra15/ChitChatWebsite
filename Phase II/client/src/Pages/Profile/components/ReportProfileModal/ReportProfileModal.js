import React, { useState } from 'react';
import './ReportProfileModal.scss';

const ReportProfileModal = ({ isOpen, onClose, onSubmit }) => {
  const [reason, setReason] = useState('');
  const [otherReason, setOtherReason] = useState('');

  const handleReasonChange = (e) => {
    setReason(e.target.value);
  };

  const handleOtherReasonChange = (e) => {
    setOtherReason(e.target.value);
  };

  const handleSubmit = async () => {
    const selectedReason = reason === 'other' ? otherReason : reason;
    onSubmit(selectedReason);
  };

  const renderOtherReasonInput = () => {
    if (reason === 'other') {
      return (
        <div>
          <label>Explain your reason:</label>
          <textarea
            value={otherReason}
            onChange={handleOtherReasonChange}
            placeholder="Type your reason here"
          />
        </div>
      );
    }
    return null;
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
        <h2>Report Profile</h2>
        <label>Why are you reporting this profile?</label>
        <select value={reason} onChange={handleReasonChange}>
          <option value="">Select a reason</option>
          <option value="inappropriate">It's inappropriate</option>
          <option value="misinformation">It's misinformation</option>
          <option value="other">Other</option>
        </select>
        {renderOtherReasonInput()}
        <button className="submit" onClick={handleSubmit}>
          Submit Report
        </button>
      </div>
    </div>
  );
};

export default ReportProfileModal;