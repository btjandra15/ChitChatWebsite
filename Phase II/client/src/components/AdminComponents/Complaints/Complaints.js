import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ApproveComplaint from './ComplaintModal/ApproveComplaint';
import DenyComplaint from './ComplaintModal/DenyComplaint';
import './Complaints.scss';

const Complaints = () => {
    const [postComplaints, setPostComplaints] = useState([]);
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [isApproveModalOpen, setApproveModalOpen] = useState(false);
    const [isDenyModalOpen, setDenyModalOpen] = useState(false);
    const [userData, setUserData] = useState(null);
  
    const handleApproveClick = (complaint) => {
      setSelectedComplaint(complaint);
      setApproveModalOpen(true);
    };
  
    const handleDenyClick = (complaint) => {
      setSelectedComplaint(complaint);
      setDenyModalOpen(true);
    };
  
    const handleCloseApproveModal = () => {
      setSelectedComplaint(null);
      setApproveModalOpen(false);
    };
  
    const handleCloseDenyModal = () => {
      setSelectedComplaint(null);
      setDenyModalOpen(false);
    };  

    const handleDisputeDenySubmit = async (complaint, disputeDenyReason) => {
      try {
          // Update the dispute denial reason in the PostComplaint schema
          await axios.post(`http://localhost:3001/approve-complaint/${complaint._id}`, {
              disputeDenyReason,
          });
  
          // Get user details
          const user = await axios.get(`http://localhost:3001/get-user/${complaint.receiverId}`);
  
          // Check if the user is an ordinary user or corporate user with 3 warnings
          if (user.data.warningCount === 3 && ['Corporate User', 'Ordinary User'].includes(user.data.userType)) {

            const fineAmountPerWarning = 50; // fine amount per warning

            const totalFineAmount = fineAmountPerWarning * user.data.warningCount; //total fine amount

            // Prompt the user with options to pay the fine or be removed from the system
            const userDecision = window.confirm(`You have 3 outstanding warnings. Choose an option:\n1. Pay ${totalFineAmount} to remove complaints\n2. Be removed from the system`);
  
              if (userDecision) {
                  // User chooses to pay the fine
                  const paymentResponse = await axios.post(`http://localhost:3001/handle-warnings/${complaint.receiverId}`, {
                      userDecision: 'pay-fine',
                  });
                  console.log(paymentResponse.data.message);
              } else {
                  // User chooses to be removed from the system
                  const removalResponse = await axios.post(`http://localhost:3001/handle-warnings/${complaint.receiverId}`, {
                      userDecision: 'remove-from-system',
                  });
                  console.log(removalResponse.data.message);
              }
          } else {
              //Check if user is a Trendy User has 3 warnings, if so demote to OU 
              if (user.data.userType === 'Trendy' && user.data.warningCount === 3) {
                  await axios.post(`http://localhost:3001/demote-to-ordinary/${complaint.receiverId}`);
              }
          }
  
      } catch (error) {
          console.error('Error denying dispute:', error);
      }
      handleCloseApproveModal();
  };
  

  const handleComplaintDenySubmit = async (complaint, complaintDenyReason) => {
    try {
      // Update the dispute denial reason in the PostComplaint schema
      await axios.post(`http://localhost:3001/deny-complaint/${complaint._id}`, {
        complaintDenyReason,
        
      });
  
      // API call to add +1 warningCount to the complaining user when complaint is denied
      const addWarningCountToInitiator = axios.post(`http://localhost:3001/add-warning-count-to-initiator/${complaint.initiatorId}`, {
        reason: complaintDenyReason, // Assuming you want to include the reason in the request body
      });
  
      
      // API call to subtract -1 warningCount from the receiving user when dispute is won
      const subWarningCountToReceiver = axios.post(`http://localhost:3001/sub-warning-count/${complaint.receiverId}`);
  
      // API call to remove the initiatorId from the userReported field in Post schema
      const removeInitiatorIdFromUserReported = axios.post(`http://localhost:3001/remove-user-reported/${complaint.postId}`);
  
      // Execute all API calls concurrently
      await Promise.all([addWarningCountToInitiator, subWarningCountToReceiver, removeInitiatorIdFromUserReported]);
    } catch (error) {
      console.error('Error denying complaint:', error);
    }
    handleCloseDenyModal();
  };
  

  useEffect(() => {
    // Fetch post complaints from the server
    axios.get('http://localhost:3001/get-post-complaints')
      .then((response) => {
        setPostComplaints(response.data);
      })
      .catch((error) => {
        console.error('Error fetching post complaints:', error);
      });
  }, []); // Empty dependency array ensures this effect runs only once on component mount

  return (
    <div className="complaints">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Initiator</th>
            <th>Receiver</th>
            <th>Content</th>
            <th>Reason</th>
            <th>Dispute</th>
            <th>Status</th>
            <th>Resolve</th>
          </tr>
        </thead>
        <tbody>
          {postComplaints.map((complaint) => (
            <tr key={complaint._id} className="complaint-item">
              <td>{complaint._id}</td>
              <td>{complaint.initiatorUsername}</td>
              <td>{complaint.receiverUsername}</td>
              <td>{complaint.content}</td>
              <td>{complaint.reason}</td>
              <td>{complaint.dispute}</td>
              <td>{complaint.status}</td>
              <td>
                <button onClick={() => handleApproveClick(complaint)}>Approve</button>
                <button onClick={() => handleDenyClick(complaint)}>Deny</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedComplaint && (
        <ApproveComplaint
          isOpen={isApproveModalOpen}
          onClose={handleCloseApproveModal}
          onSubmit={(disputeDenyReason) => handleDisputeDenySubmit(selectedComplaint, disputeDenyReason)}
        />
      )}

      {selectedComplaint && (
        <DenyComplaint
          isOpen={isDenyModalOpen}
          onClose={handleCloseDenyModal}
          onSubmit={(complaintDenyReason) => handleComplaintDenySubmit(selectedComplaint, complaintDenyReason)}
        />
      )}
    </div>
  );
};

export default Complaints;
