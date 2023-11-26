import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DisputeModal from '../DisputeModal/DisputeModal'
import "./ComplaintsView.scss"

const ComplaintsView = ({ postId }) => {
  const [complaints, setComplaints] = useState([]);
  const [isDisputeModalOpen, setDisputeModalOpen] = useState(false);

  const handleDisputeClick = () => {
    setDisputeModalOpen(true);
  };
  
  const handleCloseDisputeModal = () => {
    setDisputeModalOpen(false);
  };

  const handleDisputeSubmit = async (complaint, disputeReason) => {
    // if (!complaint || !complaint._id) {
    //   console.error('Selected complaint or its ID is undefined.');
    //   return;
    // }
    console.log('Submitting dispute:', complaint, disputeReason);
  
    try {
      // Update the dispute reason in the PostComplaint schema
      await axios.put(`http://localhost:3001/update-post-complaint/${complaint._id}`, {
        dispute: disputeReason,
      });
    } catch (error) {
      console.error('Error updating dispute reason', error);
    }
    handleCloseDisputeModal();
  };  

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/get-post-complaints/`);
        // Filter complaints based on the postId
        const filteredComplaints = response.data.filter(complaint => complaint.postId === postId);
        setComplaints(filteredComplaints);
      } catch (error) {
        console.error('Error fetching post complaints', error);
      }
    };

    fetchComplaints();
  }, [postId]);

  return (
    <div className="complaints-view">
      <div className="complaints-list">
        {complaints.map((complaint, index) => (
          <div key={index} className="complaint-item">
            <p>{`Complaint ${index + 1}: ${complaint.reason}`}</p>
            <button onClick={handleDisputeClick}>Dispute</button>
            <DisputeModal
              isOpen={isDisputeModalOpen}
              onClose={handleCloseDisputeModal}
              onSubmit={(disputeReason) => handleDisputeSubmit(complaint, disputeReason)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComplaintsView;
