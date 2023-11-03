import React, { useEffect, useState } from 'react';
import DefaultProfilePicture from '../../../../images/defaultProfileIcon.jpg'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import './Leftbar.scss';
import { Link } from 'react-router-dom';
import Cookies from 'universal-cookie';
import axios from 'axios';
import LogoutIcon from '@mui/icons-material/Logout';

const cookies = new Cookies();
const token = cookies.get("TOKEN");


const Leftbar = () => {
  const items = [
    {
      id: 1,
      icon: HomeOutlinedIcon,
      text: 'Home',
      link: "/"
    },
    {
      id: 2,
      icon: SearchOutlinedIcon,
      text: 'Trending',
      link: "/Trending"
    },
    {
      id: 3,
      icon: PersonOutlineOutlinedIcon,
      text: 'Profile',
      link: "/profile/:id"
    },
    {
      id: 4,
      icon: ShoppingCartOutlinedIcon,
      text: 'Payment',
      link: "/payment"
    },
    {
      id: 5,
      icon: SettingsOutlinedIcon,
      text: 'Settings',
      link: "/settings"
    }
  ]

  const [loggedIn, setLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  const logout = () => {
    cookies.remove("TOKEN", { path: "/" });
    setLoggedIn(false);
  }

  useEffect(() => {
      const configuration = {
          method: "GET",
          url: `http://localhost:3001/user`,
          headers: {
              Authorization: `Bearer ${token}`,
          },
      };
  
      axios(configuration)
          .then((result) => {
              setLoggedIn(true);
              setUserData(result.data);
          })
          .catch((error) => {
              error = new Error();
              
              console.log(error);
          })
  }, [])

  return (
    <div className='leftbar'>
        <div className="container">
          <div className="menu">
            <div className="user">

              {loggedIn ?
                  <Link className='link' to="/profile/:id">
                    <img src={DefaultProfilePicture} alt="" />
                    <span>{userData.firstName} {userData.lastName}</span>
                  </Link>
                  :
                  <div></div>
              }
            </div>
            
            {items.map((item) => {
              return(
                <div className="item" key={item.id}>
                  <Link className='link' to={item.link}>
                    <item.icon className='item-icon'/>
                    <span>{item.text}</span>
                  </Link>
                </div>
              )
            })}

              {loggedIn ?
                  <div className="item">
                    <Link className='link' onClick={logout}>
                      <LogoutIcon className='item-icon'/>
                      <span>Logout</span>
                    </Link>
                  </div>
                  :
                  <div></div>
              }
          </div>
        </div>
    </div>
  )
}

export default Leftbar;