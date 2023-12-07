import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import ChitChatLogo2 from "../../images/ChitChatLogo2.png";
import ChitChatLogo2darkmode from "../../images/ChitChatLogo2-darkmode.png"
import HomeOutlined from '@mui/icons-material/HomeOutlined';
import DarkModeOutlined from '@mui/icons-material/DarkModeOutlined';
import WbSunnyOutlined from '@mui/icons-material/WbSunnyOutlined';
import GridViewOutlined from '@mui/icons-material/GridViewOutlined';
import Person2Outlined from '@mui/icons-material/Person2Outlined';
import EmailOutlined from '@mui/icons-material/EmailOutlined';
import NotificationsOutlined from '@mui/icons-material/NotificationsOutlined';
import { DarkModeContext } from '../../context/darkModeContext';
import './Navbar.scss';
import DefaultProfilePicture from '../../images/defaultProfileIcon.jpg';
import SearchBar from './SearchBar/SearchBar';

const Navbar = (props) => {
    const { darkMode, toggle } = useContext(DarkModeContext);
    const loggedIn = props.loggedIn;
    const userData = props.userData;

    const handleSearch = async (type, value) => {
        if (!props.onSearch) {
            console.error("onSearch is not defined in props");
        } else {

            if (!value) {
                // Reset the posts to show all posts
                props.onSearch(null);
                return;
            }

            if (type === 'author') {
                // For author filtering
                console.log("Selected Author:", value);
                props.onSearch(type, value);
            } else if (type === 'keyword') {
                console.log("Selected Keyword:", value);
                props.onSearch(type, value);
            } else {
                // Handle other types if needed
                props.onSearch(null);
            }
        }
    };

    const handleSort = (option) => {
        if (props.onSort) {
            props.onSort(option);
        } else {
            console.error("onSort is not defined in props");
        }
    };

    return (
        <div className='navbar'>
            <div className="left">
                {/* <img src={ChitChatLogo} alt="" /> */}
                <Link className="nav-logo" to="/" style={{ textDecoration: 'none' }}>
                    <img src={darkMode ? ChitChatLogo2darkmode : ChitChatLogo2} alt="ChitChat Logo 2" />
                </Link>

                <Link className='left-icons'>
                    <HomeOutlined />
                </Link>

                <Link className='left-icons'>
                    {darkMode ? <DarkModeOutlined onClick={toggle} /> : <WbSunnyOutlined onClick={toggle} />}
                </Link>

                <Link className='left-icons'>
                    <GridViewOutlined />
                </Link>

                <SearchBar onSelect={handleSearch} onSort={handleSort} />
            </div>

            <div className="right">
                <Link className='right-icons' to={`/profile/${userData?.username}`}>
                    <Person2Outlined />
                </Link>

                <Link className='right-icons'>
                    <EmailOutlined />
                </Link>

                <Link className='right-icons'>
                    <NotificationsOutlined />
                </Link>

                {loggedIn ?
                    <Link className="user" to={`/profile/${userData.username}`}>
                        <img src={userData.profilePictureUrl || DefaultProfilePicture} alt={`${userData.firstName}'s profile`} />
                        <span>{userData.username}</span>
                    </Link>
                    :
                    <Link className="user" to="/signup">
                        <img src={DefaultProfilePicture} alt="" />
                        <span>Log in</span>
                    </Link>
                }
            </div>
        </div>
    )
}

export default Navbar