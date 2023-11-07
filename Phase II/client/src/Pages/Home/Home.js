import React, { useContext, useEffect, useState } from "react";
import "./Home.scss"
import Cookies from 'universal-cookie';
import axios from 'axios';
import { DarkModeContext } from "../../context/darkModeContext";
import Navbar from "../../components/Navbar/Navbar";
import Leftbar from "../../components/LeftBar/Leftbar";
import PostComponent from "../../components/Post/PostComponent";
import CreatePost from "../../components/CreatePost/CreatePost";
import Rightbar from "../../components/RightBar/Rightbar";

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

              res.data.map((post) => {
                const difference = post.likes - post.dislikes;
                const views = post.views;

                if(difference > 3 && views > 10){
                    if(post.trendyPost === false){
                        axios.put(`http://localhost:3001/update-post/${post._id}`, { fieldToUpdate: 'trendyPost', newValue: true })
                            .then((res) => {
                                console.log("TrendyPost status updated sucessfully");
                            })
                            .catch((err) => {
                                console.error(`Error updating Trendypost: ${err}`);
                            })
                    }
                }

                return null;
              })
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
                        {loggedIn ? <CreatePost/> : <div></div>}

                        {postData.map((post, index) => {
                            return(
                                <PostComponent post={post} key={index}/>
                            )
                        })}
                    </div>
                </div>

                {/* RIGHT CONTENT */}
                <Rightbar loggedIn={loggedIn} post={postData}/>
            </div>
        </div>
    )
};

export default Home;
