import React from 'react'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { Link } from 'react-router-dom';
import DefaultProfilePicture from '../../../../images/defaultProfileIcon.jpg'
import ChitChatLogo from "../../../../images/ChitChatLogo.jpg";
import "./Navbar.scss"

const Navbar = () => {
  return (
    <div className='navbar'>
        <div className="left">
            {/* <img src={ChitChatLogo} alt="" /> */}

            <Link to="/" style={{ textDecoration: 'none' }}>
                <span>ChitChat</span>
            </Link>

            <Link className='left-icons'>
                <HomeOutlinedIcon/>
            </Link>

            <Link className='left-icons'>
                <DarkModeOutlinedIcon/>
            </Link>

            <Link className='left-icons'>
                <GridViewOutlinedIcon/>
            </Link>

            <div className="search">
                <SearchOutlinedIcon/>
                <input type="text" placeholder='Search...'/>
            </div>
        </div>

        <div className="right">
            <Link className='right-icons'>
                <Person2OutlinedIcon/>
            </Link>

            <Link className='right-icons'>
                <EmailOutlinedIcon/>
            </Link>

            <Link className='right-icons'>
                <NotificationsOutlinedIcon/>
            </Link>

            <Link className="user" to="/signup">
                <img src={DefaultProfilePicture} alt="" />
                <span>Log in</span>
            </Link>
        </div>
    </div>
  )
}

export default Navbar