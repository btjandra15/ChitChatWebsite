import React, { useContext, useEffect, useState } from "react";
import "./Trending.scss"
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

const Trending = () => {
  const [loggedIn, setLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);
    const [allUserData, setAllUserData] = useState([]);
    const { darkMode } = useContext(DarkModeContext);
    const [ postData, setPostData ] = useState([]);

    const logout = () => {
        cookies.remove("TOKEN", { path: "/" });
        setLoggedIn(false);
    }

    const updateUser = (userId, fieldToUpdateParam, newValueParam) => {
        axios.put(`http://localhost:3001/update-user/${userId}`, { fieldToUpdate: fieldToUpdateParam, newValue: newValueParam })
            .then(() => {
                console.log("Successfuly updated user");
            })
            .catch((err) => {
                console.error(`Error updating User: ${err}`);
            });
    }

    useEffect(() => {
        const loggedInUserConfig = {
            method: "GET",
            url: `http://localhost:3001/get-user`,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        const allUserConfig = {
            method: "GET",
            url: `http://localhost:3001/get-all-users`,
        }
    
        const postConfig = {
            method: 'GET',
            url: 'http://localhost:3001/get-post',
        }

        //Gets all Users & checks to see if they meet the trendy requirements
        axios(allUserConfig)
            .then((res) => {
                setAllUserData(res.data);

                res.data.map((user) => {
                    const subscribedUsersCount = user.subscribersList.length;
                    const likeDislikeDifference = user.likes - user.dislikes;
                    const trendyMessagesCount = user.trendyMessages.length;

                    if(user.userType !== 'Trendy User'){
                        if(subscribedUsersCount > 10 && trendyMessagesCount > 2 && (likeDislikeDifference > 10 || user.tips > 100))
                           updateUser(user._id, 'trendyUser', true);
                        else
                            updateUser(user._id, 'trendyUser', false);
                    }

                    return null;
                });
            })
            .catch((err) => {
                console.log(err);
            });

        //Checks the current logged in user
        axios(loggedInUserConfig)
            .then((res) => {
                setLoggedIn(true);
                setUserData(res.data);
            })
            .catch((error) => {
                console.log(error);
            });

        //Gets all post & checks to see if they meet the trendy requirements
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
              });
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
                        <h1>Trending Page</h1>
                        {/* {loggedIn ? <CreatePost/> : <div></div>} */}
                        {postData
                          .filter((post) => post.trendyPost) // Filter out posts that are not trendy
                          .map((post, index) => (
                           <PostComponent post={post} key={index} />
                        ))}

                        {/* {postData.map((post, index) => {
                            return(
                                <PostComponent post={post} key={index}/>
                            )
                        })} */}
                    </div>
                </div>

                {/* RIGHT CONTENT */}
                <Rightbar loggedIn={loggedIn} userData={userData} post={postData} allUserData={allUserData}/>
                {/* <Rightbar loggedIn={loggedIn} post={postData} allUserData={allUserData}/> */}
            </div>
        </div>
    )
};

export default Trending;