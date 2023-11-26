import React, { useContext, useEffect, useState } from "react";
import "./Profile.scss"; 
import Cookies from 'universal-cookie';
import axios from 'axios';
import { DarkModeContext } from "../../context/darkModeContext";
import Navbar from "../../components/Navbar/Navbar.js"
import Leftbar from "../../components/LeftBar/Leftbar";
import Rightbar from "../../components/RightBar/Rightbar.js";
import PostComponent from "../../components/Post/PostComponent";
import ComplaintsView from "./components/ComplaintsView/ComplaintsView.js"

// New component for profile timeline
import ProfileTimeline from "./components/ProfileTimeline/ProfileTimeline.js";

const cookies = new Cookies();
const token = cookies.get("TOKEN");

const Profile = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);
    const [allUserData, setAllUserData] = useState([]);
    const { darkMode } = useContext(DarkModeContext);
    const [ postData, setPostData ] = useState([]);
    const [selectedPostId, setSelectedPostId] = useState(null);

    const handleViewComplaints = (postId) => {
        setSelectedPostId((prevId) => (prevId === postId ? null : postId));
    };

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

         // Checks the current logged in user
         axios(loggedInUserConfig)
         .then((res) => {
             setLoggedIn(true);
             setUserData(res.data);

             // Fetch posts for the logged-in user
             axios.get(`http://localhost:3001/api/posts/user/${res.data._id}`)
                 .then(response => {
                     setPostData(response.data);
                 })
                 .catch(error => console.error('Error fetching user posts', error));
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
    
    return (
        <div className={`theme-${darkMode ? 'dark' : 'light'}`}>
          <Navbar loggedIn={loggedIn} userData={userData} logout={logout} />
    
          <div className="main-content">
            <Leftbar loggedIn={loggedIn} userData={userData} logout={logout} />
    
            <div style={{ flex: 6 }}>
                <div className='middleBar'>
                {loggedIn && <ProfileTimeline userData={userData} />}
                {postData.map((post, index) => (
                    <div key={index}>
                    <PostComponent post={post} />
                    {post.userReported && post.userReported.length > 0 && (
                        <div>
                        <p>This post received complaint(s)</p>
                        <button onClick={() => handleViewComplaints(post._id)}>
                            {selectedPostId === post._id ? 'Hide Complaints' : 'View Complaints'}
                        </button>
                        {selectedPostId === post._id && <ComplaintsView postId={selectedPostId} />}
                        </div>
                    )}
                    </div>
                ))}
                </div>
            </div>
    
            <Rightbar loggedIn={loggedIn} post={postData} allUserData={allUserData} />
          </div>
        </div>
      );
};

export default Profile;














// import React from 'react'

// const Profile = () => {
//   return (
//     <div>Profile</div>
//   )
// }

// export default Profile