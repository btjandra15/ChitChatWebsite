import React from 'react';
import "./Admin.css";
import ChitChatIcon from "../../images/ChitChat_Logo.jpg";
import DefaultProfileIcon from "../../images/defaultProfileIcon.jpg";

const Admin = () => {
  return (
    <div className="admin">
      <div className="admin-panel-wrapper">
        <div className="admin-panel-box">
          <img className="chitchat-logo" alt="Chitchat logo" src={ChitChatIcon} />
          <div className="main-panel"/>

          <div className="account-requests-box">
            <p className="account-requests-text">Account Reset Requests</p>

            <div className='users'>
              <div className='user'>
                <img className='profile-picture-icon' src={DefaultProfileIcon} alt='Default Profile Pic'/>

                <p className='username'>greg <br/> @greg16676935420</p>
                <p className='user-type'>Coropote User</p>
              </div>
            </div>
          </div>

          <div className="post-taboo-words-box">
            <p className="post-taboo-words-text">Post with Taboo Words</p>
          </div>

          <div className="admin-text">
            ADMIN
          </div>

          <div className="password-request-box">
            <p className="password-request-text">Password Reset Requests</p>
          </div>

          <div className="recent-traffic-box">
            <p className="recent-traffic-text">Recent Traffic</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Admin;