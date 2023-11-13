import React from 'react';
import "./Admin.scss";
import TopBar from "../../components/AdminComponents/TopBar/TopBar.js"
import AccountOptions from '../../components/AdminComponents/AccountOptions/AccountOptions';
import PasswordResetRequests from '../../components/AdminComponents/PasswordResetRequests/PasswordResetRequests';

const Admin = () => {

  return (
    <div className="theme">
      <TopBar/>
      <div className= "main-content">
        <div className="content-glass">
          <div className="content-box">
            Account Control
            <AccountOptions/>
          </div>
          <div className="content-box">
            Password Reset Requests
            <PasswordResetRequests/>
          </div>
          <div className="content-box">Transactions</div>
          <div className="content-box">Disputes</div>
        </div>
      </div>
    </div>
  )
}

export default Admin;