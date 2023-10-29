import React from 'react'
import "./Signup.css"
import ChitChatHome from "../../images/ChitChat_Logo.jpg";

const Signup = () => {
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
            <button className='button-primary'>Sign up with Google</button>
            <button className='button-primary'>Sign up with Facebook</button>
            <button className='button-primary'>Sign up with Microsoft</button>
            <button className='button-primary'>Sign up with phone and email</button>

            <p className='policies'>
              By signing up, you agree to the <a href="/">Terms of Service</a> and <a href="/">Privacy Policy</a>, including <a href="/">Cookie Use</a>
            </p>
          </div>

          <div className="home-top-right-login-buttons">
            <h2>Already have an account?</h2>
            <button className='button-primary'>Log in</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup