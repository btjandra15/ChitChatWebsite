import React, { useEffect, useState } from 'react';
import './PasswordResetRequests.scss';

function PasswordResetRequests() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/users-not-reset-password', {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((data) => {
        setData(data);
      });
  }, []);

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
        // Optionally, you can update the state or perform other actions upon successful reset request
      })
      .catch((error) => {
        console.error('Error:', error);
        // Handle errors if needed
      });
  };

  return (
    <div className="boxed-section">
      <div className="username-container">
        {data.map((user, id) => (
          <div className="username-row" key={id}>
            <div className="username">{user.username}</div>
            <div className="usertype">{user.userType}</div>

            <button
              className="delete-button"
              onClick={() => sendResetRequest(user._id)}
            >
              Accept
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PasswordResetRequests;
