import React, { useEffect, useState } from 'react'
import DefaultProfilePicture from '../../images/defaultProfileIcon.jpg';
import './Rightbar.scss';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { Link } from 'react-router-dom';

const cookies = new Cookies();
const token = cookies.get("TOKEN");

const Rightbar = ({loggedIn, userData}) => {
    const [trendyUsers, setTrendyUsers] = useState([]);
    const [mostLikedPosts, setMostLikedPosts] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [suggestedUsers, setSuggestedUsers] = useState([]);
 
    const followUser = (loggedInUserID, trendyUserID) => {
        if(!loggedIn){
            alert("You need to be logged in in order to follow this user");
        }else{
            const subscribeUserConfig = {
                method: "POST",
                url: `http://localhost:3001/follow-user`,
                data: {
                  userID: loggedInUserID,
                  trendyUserID: trendyUserID,
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }

            axios(subscribeUserConfig)
                .then((res) => {
                })
                .catch((err) => {
                    console.error(err);
                })

            alert("Successfully followed this user!");    
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const allUserResponse = await axios.get('http://localhost:3001/get-all-users');
                setAllUsers(allUserResponse.data);
    
                const trendyUsersResponse = await axios.get('http://localhost:3001/get-trendy-users');
                setTrendyUsers(trendyUsersResponse.data);
    
                const topThreePostsResponse = await axios.get('http://localhost:3001/get-top-liked-post');
                setMostLikedPosts(topThreePostsResponse.data);
    
                const shuffleUsers = allUserResponse.data.sort(() => Math.random() - 0.5);
                const suggested = shuffleUsers.slice(0, 3);
                
                setSuggestedUsers(suggested);
            } catch (error) {
                console.error(`Error: ${error}`);
            }
        };
    
        fetchData();
    }, []);
    
    return (
        <div className='rightbar'>
            <div className="container">
                <div className="item">
                    <span>{loggedIn ? 'Suggestions for You' : 'Trendy Users'}</span>

                    <div className="trendy-users">
                        {
                            loggedIn ? 
                            <div>
                                {suggestedUsers
                                    .filter((user) => user && userData && user._id !== userData._id) //TEMP LINE TO WORK ON THE WEBSITE WITHOUT ERROR
                                    // .filter((user) => user._id !== userData._id)
                                    .slice(0, 3)
                                    .map((user, index) => {
                                    return(
                                        <div className="user" key={index}>
                                            <div className="userInfo">
                                                <img src={DefaultProfilePicture} alt="" />
                                                <span>{user.firstName} {user.lastName}</span>
                                            </div>

                                            <div className="buttons">
                                                <button onClick={() => followUser(userData._id, user._id)}>Follow</button>
                                                <button>Dimiss</button>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                            :
                            <div>
                                {trendyUsers.map((user, index) => {
                                    return(
                                        <div className="user" key={index}>
                                            <div className="userInfo">
                                                <img src={DefaultProfilePicture} alt="" />

                                                <Link to={`/profile/${user.username}`}>
                                                    <span>{user.firstName} {user.lastName}</span>
                                                </Link>
                                            </div>

                                            <div className="buttons">
                                                <button onClick={() => followUser(userData._id, user._id)}>Follow</button>
                                                <button>Dimiss</button>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        }
                    </div>
                </div>

                <div className="item">
                    <span>Most Liked Posts</span>

                    {mostLikedPosts.map((post, index) => {
                        return(
                            <div className="most-liked-post" key={index}>
                                <div className="post-info">
                                    <p className='authorName'>{post.authorFirstName} {post.authorLastName}</p>
                                                
                                    <span className='post-content'>{post.content}</span>

                                    {post.imageUrl ? 
                                        <img src={post.imageUrl} alt="" className='post-image'/>
                                        :
                                        null
                                    }

                                    {post.videoUrl ? 
                                        <video controls width="800" height="500" className="video-player">
                                            <source src={post.videoUrl} type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>
                                        :
                                        null
                                    }
                                                
                                    <span className='post-footer'>
                                        <p className="data">Views: {post.views}</p>
                                        <p className="data">Likes: {post.likes}</p>
                                        <p className="data">Dislikes: {post.dislikes}</p>
                                    </span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default Rightbar