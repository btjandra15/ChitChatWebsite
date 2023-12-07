import React, { useEffect, useState } from 'react';
import DenyResetModal from './DenyResetModal/DenyResetModal.js'
import './PasswordResetRequests.scss';

function PasswordResetRequests() {
  const [data, setData] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDenyModalOpen, setDenyModalOpen] = useState(false);

  const handleDenyClick = (userId) => {
    setSelectedUser(userId);
    setDenyModalOpen(true);
  }

  const handleCloseDenyModal = () => {
    setSelectedUser(null);
    setDenyModalOpen(false);
  };

  const sendResetRequest = (id) => {
    const userIdToReset = id;

    fetch(`http://localhost:3001/send-reset-link-to-user/${userIdToReset}`, {
        method: "POST",
        crossDomain: true,
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
            userId: id
        }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result.message);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };
  
  const handleDenyResetRequest = (userId, denyReason) => {
    // Proceed with the deny-reset-request API call
    fetch(`http://localhost:3001/deny-reset-request/${userId}`, {
      method: 'POST',
      crossDomain: true,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        denyReason: denyReason,
      }),
    })
      .then((res) => res.json())
      .then(() => {
          // Make API call to delete user from the database
          fetch(`http://localhost:3001/delete-user`, {
            method: "POST",
            crossDomain: true,
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
              userId: userId,
            }),
          })
          .then((res) => res.json())
          .then((result) => {
            console.log(result.message);
          })
          .catch((error) => {
            console.error('Error deleting user:', error);
          });
      })
      .catch((error) => {
        console.error('Error sending email:', error);
      });
  };
  

  useEffect(() => {
    fetch('http://localhost:3001/users-not-reset-password', {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((data) => {
        setData(data);
      });
  }, []);

  return (
    <div className="boxed-section">
          <div className="username-container">
            {data.map((user, id) => (
              <div className="username-row" key={id}>
                <div className="username">{user.username}</div>
                <div className="usertype">{user.userType}</div>
                <div className="button-options">
                  <button
                    className="button"
                    onClick={() => sendResetRequest(user._id)}
                  >✓</button>
                  <button
                    className="button"
                    onClick={() => handleDenyClick(user._id)}
                  >X</button>
                </div>
              </div>
            ))}
          </div>
          {selectedUser && (
            <DenyResetModal
              isOpen={isDenyModalOpen}
              onClose={handleCloseDenyModal}
              onSubmit={(denyReason) => handleDenyResetRequest(selectedUser, denyReason)}
            />
          )}
      </div>
  );
}


export default PasswordResetRequests;
