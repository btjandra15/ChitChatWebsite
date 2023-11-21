import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import ChitChatLogo2 from "../../images/ChitChatLogo2.png";
import ChitChatLogo2darkmode from "../../images/ChitChatLogo2-darkmode.png"
import HomeOutlined from '@mui/icons-material/HomeOutlined';
import DarkModeOutlined from '@mui/icons-material/DarkModeOutlined';
import WbSunnyOutlined from '@mui/icons-material/WbSunnyOutlined';
import GridViewOutlined from '@mui/icons-material/GridViewOutlined';
import SearchOutlined from '@mui/icons-material/SearchOutlined';
import Person2Outlined from '@mui/icons-material/Person2Outlined';
import EmailOutlined from '@mui/icons-material/EmailOutlined';
import NotificationsOutlined from '@mui/icons-material/NotificationsOutlined';
import { DarkModeContext } from '../../context/darkModeContext';
import './Navbar.scss'
import DefaultProfilePicture from '../../images/defaultProfileIcon.jpg'

const Navbar = (props) => {
    const { darkMode, toggle } = useContext(DarkModeContext);
    const loggedIn = props.loggedIn;
    const userData = props.userData;

    return (
        <div className='navbar'>
            <div className="left">
                {/* <img src={ChitChatLogo} alt="" /> */}
                <Link className="nav-logo" to="/" style={{ textDecoration: 'none' }}>
                    <img src={darkMode ? ChitChatLogo2darkmode : ChitChatLogo2} alt="ChitChat Logo 2" />
                </Link>

                <Link className='left-icons'>
                    <HomeOutlined/>
                </Link>

                <Link className='left-icons'>
                    {darkMode ? <DarkModeOutlined onClick={toggle}/> : <WbSunnyOutlined onClick={toggle}/>}
                </Link>

                <Link className='left-icons'>
                    <GridViewOutlined/>
                </Link>

                <div className="search">
                    <SearchOutlined/>
                    <input type="text" placeholder='Search...' className="search-input"/>
                </div>
            </div> 

            <div className="right">
                <Link className='right-icons'>
                    <Person2Outlined/>
                </Link>

                <Link className='right-icons'>
                    <EmailOutlined/>
                </Link>

                <Link className='right-icons'>
                    <NotificationsOutlined/>
                </Link>

                {loggedIn ? 
                    <Link className="user" to={`/profile/${userData.username}`}>
                        <img src={DefaultProfilePicture} alt="" />
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