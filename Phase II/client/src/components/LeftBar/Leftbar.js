import React from 'react'
import { Link } from 'react-router-dom'
import './Leftbar.scss'
import Logout from '@mui/icons-material/Logout';
import HomeOutlined from '@mui/icons-material/HomeOutlined';
import SearchOutlined from '@mui/icons-material/SearchOutlined';
import Person2Outlined from '@mui/icons-material/Person2Outlined';
import ShoppingCartOutlined from '@mui/icons-material/ShoppingCartOutlined';
import SettingsOutlined from '@mui/icons-material/SettingsOutlined';
import DefaultProfilePicture from '../../images/defaultProfileIcon.jpg'
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';

const Leftbar = ({userData, loggedIn, logout}) => {
    const items = [
        {
          id: 1,
          icon: HomeOutlined,
          text: 'Home',
          link: "/"
        },
        {
          id: 2,
          icon: SearchOutlined,
          text: 'Trending',
          link: "/trending"
        },
        {
            id: 3,
            icon: WorkOutlineOutlinedIcon,
            text: 'Postings',
            link: '/job-postings'
        },
        {
          id: 4,
          icon: Person2Outlined,
          text: 'Profile',
          link: `/profile/${userData ? userData.username : null}`
        },
        {
          id: 5,
          icon: ShoppingCartOutlined,
          text: 'Payment',
          link: "/payment"
        },
        {
          id: 6,
          icon: SettingsOutlined,
          text: 'Settings',
          link: "/settings"
        }
    ]

    return (
        <div className='leftbar'>
            <div className="container">
                <div className="menu">
                    <div className="user">
                        {loggedIn ?
                            <Link className='link' to={`/profile/${userData.username}`}>
                                <img src={userData.profilePictureUrl || DefaultProfilePicture} alt={`${userData.firstName}'s profile`} />
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
                        <div className="item2">
                            <Link className='logout-link' onClick={logout} to="/">
                                <Logout className='item-icon'/>
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

export default Leftbar