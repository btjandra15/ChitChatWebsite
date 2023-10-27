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
import { Link } from "react-router-dom";

const NavBarSide = () => {
    return(
        <nav className="navBarSide">
            <div className='navBarChitChatLogo'>
                <img src={ChitChatIcon} alt="ChitChatLogo"/>
            </div>

            <div className='contentContainer'>
                <NavBarSideOptions Icon={HomeIcon} text="Home"/>
                <NavBarSideOptions Icon={SearchIcon} text="Trending"/>
                <NavBarSideOptions Icon={PersonIcon} text="Profile"/>
                <NavBarSideOptions Icon={ShoppingCartIcon} text="Payment"/>
                <NavBarSideOptions Icon={SettingsIcon} text="Settings"/>
            </div>
            
            <Link className="profileBox" to="/signup">
                <img src={DefaultProfileIcon} alt="defaultProfileIcon" className="profileIcon"/>
                <h2 className="signup-text">Sign up</h2>
            </Link>
        </nav>
    )
};
export default NavBarSide
