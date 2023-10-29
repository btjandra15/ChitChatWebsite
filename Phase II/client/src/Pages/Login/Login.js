import React from 'react';
import "./Login.css"

const Login = () => {
  return (
    <div className="container">
      <div className="div">
        <p className='chit-chat-text'>
          <span className='text-wrapper'>ChitChat</span>
          <span className='underline'>&nbsp;</span>
        </p>
      </div>

      <div className="login-form">
        <div className='background'/>
        <div className='login-signup-button'/>
        <div className="username-password-text-box">Username: </div>
        <div className="username=password-text-box">Password: </div>
      </div>
    </div>
  )
}

export default Login;