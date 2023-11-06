import React, { useContext, useEffect, useState } from "react";
import "./Home.scss"
import Cookies from 'universal-cookie';
import axios from 'axios';
import { DarkModeContext } from "../../context/darkModeContext";
import PostComponent from "../../components/PostComponent";
import Navbar from "./components/Navbar/Navbar";
import Leftbar from "./components/LeftBar/Leftbar";
import Post from "./components/Post/Post.js";
import Rightbar from "./components/RightBar/Rightbar.js";

const cookies = new Cookies();
const token = cookies.get("TOKEN");

const Home = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);
    const { darkMode } = useContext(DarkModeContext);
    const [ postData, setPostData ] = useState([]);

    const logout = () => {
        cookies.remove("TOKEN", { path: "/" });
        setLoggedIn(false);
    }

    useEffect(() => {
        const userConfig = {
            method: "GET",
            url: `http://localhost:3001/user`,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
    
        const postConfig = {
            method: 'GET',
            url: 'http://localhost:3001/get-post',
        }

        axios(userConfig)
            .then((result) => {
                setLoggedIn(true);
                setUserData(result.data);
            })
            .catch((error) => {
                error = new Error();
                
                console.log(error);
            });

        axios(postConfig)
            .then((res) => {
              setPostData(res.data);
            })
            .catch((err) => {
              console.log(err);
            })
    }, [])

    return(
        <div className={`theme-${darkMode ? 'dark' : 'light'}`}>
            {/* NAVBAR CONTENT */}
            <Navbar loggedIn={loggedIn} userData={userData}/>

            <div className="main-content">
                {/* LEFTBAR CONTENT */}
                <Leftbar loggedIn={loggedIn} userData={userData} logout={logout}/>

                {/* MIDDLE CONTENT */}
                <div style={{flex: 6}}>
                    <div className='middleBar'>
                        {loggedIn ? <Post/> : <div></div>}

                        {postData.map((post, index) => {
                            return(
                                <PostComponent post={post} index={index}/>
                            )
                        })}
                    </div>
                </div>

                {/* RIGHT CONTENT */}
                <Rightbar/>
            </div>
        </div>
    )
};

export default Home;
