import React, { useContext, useEffect, useState } from "react";
import "./Home.scss"
import "../../styles.scss"
import { Link } from "react-router-dom";
import HomeOutlined from "@mui/icons-material/HomeOutlined";
import DarkModeOutlined from "@mui/icons-material/DarkModeOutlined";
import GridViewOutlined from "@mui/icons-material/GridViewOutlined";
import SearchOutlined from "@mui/icons-material/SearchOutlined";
import Person2Outlined from "@mui/icons-material/Person2Outlined";
import EmailOutlined from "@mui/icons-material/EmailOutlined";
import NotificationsOutlined from "@mui/icons-material/NotificationsOutlined";
import Cookies from 'universal-cookie';
import axios from 'axios';
import DefaultProfilePicture from '../../images/defaultProfileIcon.jpg'
import ShoppingCartOutlined from "@mui/icons-material/ShoppingCartOutlined";
import SettingsOutlined from "@mui/icons-material/SettingsOutlined";
import LogoutIcon from '@mui/icons-material/Logout';
import "./Leftbar.scss"
import "./MiddleBar.scss"
import "./Navbar.scss"
import "./RightBar.scss"
import { DarkModeContext } from "../../context/darkModeContext";
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import Post from "./post.js";
import ChitChatLogo2 from "../../images/ChitChatLogo2.png";
import ChitChatLogo2darkmode from "../../images/ChitChatLogo2-darkmode.png"
import PostComponent from "../../components/PostComponent";

const cookies = new Cookies();
const token = cookies.get("TOKEN");

const Home = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);
    const { darkMode, toggle } = useContext(DarkModeContext);

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
          link: "/Trending"
        },
        {
          id: 3,
          icon: Person2Outlined,
          text: 'Profile',
          link: "/profile/:id"
        },
        {
          id: 4,
          icon: ShoppingCartOutlined,
          text: 'Payment',
          link: "/payment"
        },
        {
          id: 5,
          icon: SettingsOutlined,
          text: 'Settings',
          link: "/settings"
        }
    ]

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
            });
    }, [])

    return(
        <div className={`theme-${darkMode ? 'dark' : 'light'}`}>
            {/* NAVBAR CONTENT */}
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
                        {darkMode ? <DarkModeOutlined onClick={toggle}/> : <WbSunnyOutlinedIcon onClick={toggle}/>}
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
                        <Link className="user" to={`/profile/${userData._id}`}>
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

            <div className="main-content">
                {/* LEFTBAR CONTENT */}
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

                {/* MIDDLE CONTENT */}
                <div style={{flex: 6}}>
                    <div className='middleBar'>
                        {loggedIn ? <Post/> : <div></div>}
                        <PostComponent/>
                    </div>
                </div>

                {/* RIGHT CONTENT */}
                <div className='rightbar'>
                    <div className="container">
                        <div className="item">
                            <span>Suggestions For You</span>

                            <div className="user">
                                <div className="userInfo">
                                    <img src={DefaultProfilePicture} alt="" />
                                    <span>Jane Doe</span>
                            </div>

                            <div className="buttons">
                                <button>Follow</button>
                                <button>Dimiss</button>
                            </div>
                        </div>

                        <div className="user">
                            <div className="userInfo">
                                <img src={DefaultProfilePicture} alt="" />
                                <span>Jane Doe</span>
                            </div>

                            <div className="buttons">
                                <button>Follow</button>
                                <button>Dimiss</button>
                            </div>
                        </div>
                    </div>

                    <div className="item">
                        <span>Latest Activities</span>

                        <div className="user">
                            <div className="userInfo">
                                <img src={DefaultProfilePicture} alt="" />

                                <p>
                                    <span>Jane Doe</span> changed their cover picture
                                </p>
                            </div>

                            <span>1 min ago</span>
                        </div>

                        <div className="user">
                            <div className="userInfo">
                                <img src={DefaultProfilePicture} alt="" />
                                <p>
                                <span>Jane Doe</span> liked your photo
                                </p>
                            </div>

                            <span>20 min ago</span>
                        </div>

                        <div className="user">
                            <div className="userInfo">
                                <img src={DefaultProfilePicture} alt="" />
                                <p>
                                <span>Jane Doe</span> change their profile picture
                                </p>
                            </div>

                            <span>50 mins ago</span>
                            </div>

                        <div className="user">
                            <div className="userInfo">
                                <img src={DefaultProfilePicture} alt="" />
                                <p>
                                    <span>Jane Doe</span> posted a new video
                                </p>
                            </div>

                            <span>12 hrs ago</span>
                            </div>
                        </div>

                        <div className="item">
                            <span>Online Friends</span>

                            <div className="user">
                            <div className="userInfo">
                                <img src={DefaultProfilePicture} alt="" />
                                <div className='online'/>
                                <span>Jane Doe</span>
                            </div>
                            </div>
                            
                            <div className="user">
                                <div className="userInfo">
                                    <img src={DefaultProfilePicture} alt="" />
                                    <div className='online'/>
                                    <span>Jane Doe</span>
                                </div>
                            </div>
                            
                            <div className="user">
                                <div className="userInfo">
                                    <img src={DefaultProfilePicture} alt="" />
                                    <div className='online'/>
                                    <span>Jane Doe</span>
                                </div>
                            </div>

                            <div className="user">
                                <div className="userInfo">
                                    <img src={DefaultProfilePicture} alt="" />
                                    <div className='online'/>
                                    <span>Jane Doe</span>
                                </div>
                            </div>
                            
                            <div className="user">
                                <div className="userInfo">
                                    <img src={DefaultProfilePicture} alt="" />
                                    <div className='online'/>
                                    <span>Jane Doe</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Home;
