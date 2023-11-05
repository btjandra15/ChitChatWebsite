import React, { useState } from 'react';
import "./Login.scss"
import ChitChatHome from "../../images/ChitChatLogo.jpg";
import axios from 'axios';
import { Link } from 'react-router-dom';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const Login = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [login, setLogin] = useState(false);

  const submitLogin = (e) => {
    e.preventDefault();

    const configuration = {
      method: "POST",
      url: "http://localhost:3001/login",
      data: {
        email,
        password
      }
    };

    axios(configuration)
      .then((result) => { 
        setLogin(true);

        cookies.set("TOKEN", result.data.token, {
          path: "/",
        })

        window.location.href = "/";
      })
      .catch((e) => { 
        console.log(e); 
        alert('User not found!');
      })
  }

  return (
    <div className="split-screen">
      <div className="logo-section">
        <img src={ChitChatHome} alt="ChitChat Logo" className="logo"/>
      </div>
      <div className="form-section">
        <div className="form-header">
          <h1>What's Happening</h1>
          <p className="form-subheading">Stay connected with the latest chats.</p>
        </div>
        <form onSubmit={submitLogin} className="login-form">
          <input 
            type="text" 
            className="form-input" 
            placeholder="Email..." 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            type="password" 
            className="form-input" 
            placeholder="Password..." 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="login-button">Login</button>
        </form>
        <div className="login-links">
          <span>Don't have an account?</span>
          <Link to="/signup" className="signup-link">Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;