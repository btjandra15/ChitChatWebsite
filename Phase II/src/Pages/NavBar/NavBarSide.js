import React from "react";
import './NavBar.css';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SettingsIcon from '@mui/icons-material/Settings';
import DefaultProfileIcon from "../../images/defaultProfileIcon.jpg";
import NavBarSideOptions from "./NavBarSideOptions";
import ChitChatIcon from "../../images/ChitChat_Logo.jpg"
import { useAuth0 } from "@auth0/auth0-react";

const NavBarSide = () => {
    const { loginWithRedirect } = useAuth0();

    return(
        <nav className="navBarSide">
            <div className='navBarChitChatLogo'>
                <img src={ChitChatIcon}/>
            </div>
            <div className='contentContainer'>
                <NavBarSideOptions Icon={HomeIcon} text="Home"/>
                <NavBarSideOptions Icon={SearchIcon} text="Trending"/>
                <NavBarSideOptions Icon={PersonIcon} text="Profile"/>
                <NavBarSideOptions Icon={ShoppingCartIcon} text="Payment"/>
                <NavBarSideOptions Icon={SettingsIcon} text="Settings"/>
            </div>
            <div className="profileBox">
                    <img src={DefaultProfileIcon} alt="defaultProfileIcon" className="profileIcon"/>
                    <button className="login-button" onClick={() => loginWithRedirect()}><h2>Login</h2></button>
            </div>
        </nav>
    )
};
export default NavBarSide
