import React, { useState } from 'react'
import "./Signup.scss"
import ChitChatHome from "../../images/ChitChatLogo.jpg";
import axios from 'axios';
import { Link } from 'react-router-dom';

const Signup = () => {
  const [signupWithEmail, setSignupWithEmail] = useState();
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [username, setUsername] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  
  const signupButton = () => { 
    setSignupWithEmail(true); 
  };

  const addNewUser = (e) => {
    e.preventDefault();

    const configuration = {
      method: "POST",
      url: "http://localhost:3001/register",
      data: {
        firstName,
        lastName,
        username,
        email,
        password
      }
    };
    
    axios(configuration)
      .then((result) => { 
        console.log(result); 
        alert("Successfully signed up!");
      })
      .catch((e) => { console.log(e); })
  };

  return (
    <div className="split-screen">
      <div className="logo-section">
        <img src={ChitChatHome} alt="ChitChat Logo" className="logo"/>
      </div>
      <div className="form-section">
        <div className="form-header">
          <h1>Join ChitChat</h1>
          <p className="form-subheading">Create an account to get started.</p>
        </div>
        <form onSubmit={addNewUser} className="signup-form">
          <input
            type="text"
            className="form-input"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            type="text"
            className="form-input"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <input
            type="text"
            className="form-input"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="email"
            className="form-input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            className="form-input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="signup-button">Sign Up</button>
        </form>
        <div className="signup-links">
          <span>Already have an account?</span>
          <Link to="/login" className="login-link">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup