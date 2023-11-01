import React, { useState } from 'react'
import "./Signup.css"
import ChitChatHome from "../../images/ChitChat_Logo.jpg";
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
    <div className="home">
      <div className="home-top-grid">
        <div className='home-top-left'>
          <img className='home-top-left-image' src={ChitChatHome} alt="ChitChat Logo" />
        </div>

        <div className="home-top-right">
          <img className='logo' src="" alt="" />
          <h1 className='home-top-right-header'>Happening now</h1>
          <h2 className='home-top-right-subheader'>Join ChitChat today!</h2>

          {signupWithEmail ? 
            <div className="home-top-right-auth-buttons">
              <input type='text' className='signupFormInputBox' placeholder='First Name...' onChange={(event) => { setFirstName(event.target.value)}}/>
              <input type='text' className='signupFormInputBox' placeholder='Last Name...' onChange={(event) => { setLastName(event.target.value)}}/>
              <input type='text' className='signupFormInputBox' placeholder='Username... ' onChange={(event) => { setUsername(event.target.value)}}/>
              <input type='text' className='signupFormInputBox' placeholder='Email...' onChange={(event) => { setEmail(event.target.value)}}/>
              <input type='password' className='signupFormInputBox' placeholder='Password...' onChange={(event) => { setPassword(event.target.value)}}/>
              <button className='signup-button' onClick={addNewUser}>Sign up</button>

              <p className='policies'>
                By signing up, you agree to the <a href="/">Terms of Service</a> and <a href="/">Privacy Policy</a>, including <a href="/">Cookie Use</a>
              </p>
            </div>
            :

            <div className="home-top-right-auth-buttons">
              <button className='button-primary'>Sign up with Google</button>
              <button className='button-primary'>Sign up with Facebook</button>
              <button className='button-primary'>Sign up with Microsoft</button>
              <button className='button-primary' onClick={signupButton}>Sign up with phone and email</button>

              <p className='policies'>
                By signing up, you agree to the <a href="/">Terms of Service</a> and <a href="/">Privacy Policy</a>, including <a href="/">Cookie Use</a>
              </p>
            </div>
          }

          <div className="home-top-right-login-buttons">
            <h2>Already have an account?</h2>
            <Link className='login-button' to="/login">Login</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup