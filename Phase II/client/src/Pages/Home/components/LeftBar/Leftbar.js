import React from 'react';
import DefaultProfilePicture from '../../../../images/defaultProfileIcon.jpg'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import './Leftbar.scss';
import { Link } from 'react-router-dom';

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
  
  return (
    <div className='leftbar'>
        <div className="container">
          <div className="menu">
            <div className="user">
              <Link className='link' to="/profile/:id">
                <img src={DefaultProfilePicture} alt="" />
                <span>John Doe</span>
              </Link>
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
          </div>
        </div>
    </div>
  )
}

export default Leftbar;