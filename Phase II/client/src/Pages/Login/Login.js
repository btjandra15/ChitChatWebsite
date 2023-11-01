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
    <div className="home">
      <div className="home-top">
        <div className='home-top-left'>
          <img className='home-top-left-image' src={ChitChatHome} alt="ChitChat Logo" />
        </div>

        <div className="home-top-right">
          <img className='logo' src="" alt="" />
          <h1 className='home-top-right-header'>Happening now</h1>
          <h2 className='home-top-right-subheader'>Join ChitChat today!</h2>

          <div className="home-top-right-auth-buttons">
            <input type='text' className='signupFormInputBox' placeholder='Email...' onChange={(event) => { setEmail(event.target.value)}}/>
            <input type='password' className='signupFormInputBox' placeholder='Password...' onChange={(event) => { setPassword(event.target.value)}}/>
            
            <button className='signup-button' onClick={submitLogin}>Login</button>
          </div>

          <div className="home-top-right-login-buttons">
            <h2>Don't have an account?</h2>
            <Link className='signup-button' to="/signup">Sign up</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login;