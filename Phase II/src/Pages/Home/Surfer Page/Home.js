import React from "react";
import "../Home/Home.css"
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SettingsIcon from '@mui/icons-material/Settings';
import DefaultProfileIcon from "../../images/defaultProfileIcon.jpg";
import { useAuth0 } from "@auth0/auth0-react";

const Home = () => {
    const { loginWithRedirect } = useAuth0();

    return(
        <div className="label">
            <div class="column">
                <p className="chit-chat">
                    <span className="text-wrapper">ChitChat</span>
                    <span className="span">&nbsp;</span>
                </p>

                <div className="rectangle">
                    <div className="box-content">
                        <HomeIcon sx={{fontSize: 40, padding: 2}}/>
                        <a className="home-text" href="/">Home</a>
                    </div>

                    <div className="box-content">
                        <SearchIcon sx={{fontSize: 40, padding: 2}}/>
                        <a className="home-text" href="/">Trending</a>
                    </div>

                    <div className="box-content">
                        <PersonIcon sx={{fontSize: 40, padding: 2}}/>
                        <a className="home-text" href="/">Profile</a>
                    </div>

                    <div className="box-content">
                        <ShoppingCartIcon sx={{fontSize: 40, padding: 2}}/>
                        <a className="home-text" href="/">Payment</a>
                    </div>

                    <div className="box-content">
                        <SettingsIcon sx={{fontSize: 40, padding: 2}}/>
                        <a className="home-text" href="/">Settings</a>
                    </div>

                    <div className="box-content">
                        <button className="post-button">Post</button>
                    </div>
                </div>

                <div className="profile-box">
                    <div className="profile-content">
                        <img src={DefaultProfileIcon} alt="defaultProfileIcon" className="profile-icon"/>
                        <button className="login-button" onClick={() => loginWithRedirect()}>Login</button>
                    </div>
                </div>
            </div>

            <div class="column">
                <div className="top-box">
                    <div className="top-content">
                        <h1>Home</h1>

                        <div className="text-content">
                            <a className="for-you-text" href="/">For You</a>
                            <a className="following-text" href="/">Following</a>
                        </div>
                    </div>
                </div>
            </div>

            <div class="column">
                <h2> Third column </h2>
                <p> This is third column of our grid system</p>
            </div>
        </div>
    )
};

export default Home;