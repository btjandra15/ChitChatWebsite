import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DisputeModal from '../DisputeModal/DisputeModal';
import "./UserComplaintsView.scss";

const UserComplaintsView = ({ userComplaints }) => {
  const [isDisputeModalOpen, setDisputeModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const handleDisputeClick = (complaint) => {
    setSelectedComplaint(complaint);
    setDisputeModalOpen(true);
  };

  const handleCloseDisputeModal = () => {
    setSelectedComplaint(null);
    setDisputeModalOpen(false);
  };

  const handleDisputeSubmit = async (disputeReason) => {
    if (!selectedComplaint || !selectedComplaint._id) {
      console.error('Selected complaint or its ID is undefined.');
      return;
    }

    try {
      // Update the dispute reason in the PostComplaint schema
      await axios.put(`http://localhost:3001/update-post-complaint/${selectedComplaint._id}`, {
        dispute: disputeReason,
      });
    } catch (error) {
      console.error('Error updating dispute reason', error);
    }
    handleCloseDisputeModal();
  };

  return (
    <div className="complaints-view">
      <div className="complaints-list">
        {userComplaints.map((complaint, index) => (
          <div key={index} className="complaint-item">
            <p>{`Complaint ${index + 1}: ${complaint.reason}`}</p>
            <button onClick={() => handleDisputeClick(complaint)}>Dispute</button>
          </div>
        ))}
        <DisputeModal
          isOpen={isDisputeModalOpen}
          onClose={handleCloseDisputeModal}
          onSubmit={handleDisputeSubmit}
        />
      </div>
    </div>
  );
};

export default UserComplaintsView;
