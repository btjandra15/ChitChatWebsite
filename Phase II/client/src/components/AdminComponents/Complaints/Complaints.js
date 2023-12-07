import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ApproveComplaint from './ComplaintModal/ApproveComplaint';
import DenyComplaint from './ComplaintModal/DenyComplaint';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import './Complaints.scss';

const Complaints = () => {
    const [postComplaints, setPostComplaints] = useState([]);
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [isApproveModalOpen, setApproveModalOpen] = useState(false);
    const [isDenyModalOpen, setDenyModalOpen] = useState(false);
  
    const handleApproveClick = (complaint) => {
      if (complaint.dispute === "N/A") {
        setApproveModalOpen(false)
        handleDisputeDenySubmit(complaint, complaint.dispute);
        window.alert('Complaint has been approved');
      } else {
      setSelectedComplaint(complaint);
      setApproveModalOpen(true);
      }
    };
  
    const handleDenyClick = (complaint) => {
      if (complaint.initiatorUsername === "Surfer") {
        setDenyModalOpen(false)
        handleComplaintDenySubmit(complaint, "N/A");
        window.alert('Complaint has been denied')
      } else {
        setSelectedComplaint(complaint);
        setDenyModalOpen(true);
      }
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
      // Get user Id of recieving user
      const user = await axios.get(`http://localhost:3001/get-user/${complaint.receiverId}`);

      // if reciever is a TU and has 3 warnings, demote to OU
      if (user.data.userType === 'Trendy User' && user.data.warningCount >= 3) {
        await axios.post(`http://localhost:3001/demote-to-ordinary/${complaint.receiverId}`);
      }

      // Update the dispute denial reason in the PostComplaint schema
      await axios.post(`http://localhost:3001/approve-complaint/${complaint._id}`, {
        disputeDenyReason,
      });
    } catch (error) {
      console.error('Error denying dispute:', error);
    }
    handleCloseApproveModal();
  };

  const handleComplaintDenySubmit = async (complaint, complaintDenyReason) => {
    try {
      let user;
  
      // Get user Id of complaining user if initiator is not 'Surfer'
      if (complaint.initiatorUsername !== 'Surfer') {
        const userResponse = await axios.get(`http://localhost:3001/get-user/${complaint.initiatorId}`);
        user = userResponse.data;
        
        // if initiator is a TU and has 3 warnings, demote to OU
        if (user.data.userType === 'Trendy User' && user.data.warningCount >= 3) {
          await axios.post(`http://localhost:3001/demote-to-ordinary/${complaint.initiatorId}`);
        }
      }
  
      // if initiator is a Surfer, reward receiver 3 likes
      if (complaint.initiatorUsername === 'Surfer') {
          await axios.post(`http://localhost:3001/reward-likes-to-receiver/${complaint.receiverId}`, {
            postId: complaint.postId,
          });
      }
  
      // Update the dispute denial reason in the PostComplaint schema
      await axios.post(`http://localhost:3001/deny-complaint/${complaint._id}`, {
        complaintDenyReason,
      });
  
      // API call to add +1 warningCount to the complaining user when complaint is denied
      const addWarningCountToInitiator = axios.post(`http://localhost:3001/add-warning-count-to-initiator/${complaint.initiatorId}`, {
        reason: complaintDenyReason,
      });
  
      // API call to subtract -1 warningCount from the receiving user when dispute is won
      const subWarningCountToReceiver = axios.post(`http://localhost:3001/sub-warning-count/${complaint.receiverId}`, {
        dispute: complaint.dispute,
      });
  
      // API call to remove the initiatorId from the userReported field in Post schema
      const removeInitiatorIdFromUserReported = axios.post(`http://localhost:3001/remove-user-reported/${complaint.postId}`, {
        initiatorId: complaint.initiatorId,
      });
  
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
      <div className="table-container">
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
                {complaint.status === "pending" ? (
                  <div className='button-options'>
                    <button onClick={() => handleApproveClick(complaint)}>Approve</button>
                    <button onClick={() => handleDenyClick(complaint)}>Deny</button>
                  </div>
                ) : (
                  <div className='resolved'>
                    <CheckCircleOutlineRoundedIcon/>
                  </div>
                )}
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
    </div>
  );
};

export default Complaints;
