import React, { useEffect, useState } from 'react'
import './AccountOptions.scss'

function AccountOptions() {
  const [data, setData] = useState([])
  
  useEffect(() => {
    fetch("http://localhost:3001/get-all-users", {
        method: "GET",
    })
    .then((res) => res.json())
    .then((data) => {
        // console.log(data, "userData")
        setData(data)
    })
  }, [])

  const handleDeleteAccount = (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}`)) {
        fetch("http://localhost:3001/delete-user", {
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
        .then((data) => {
            alert(data.data)
        })
    } else {

    }
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
                onClick={() => handleDeleteAccount(user._id, user.username)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
  );
}

export default AccountOptions