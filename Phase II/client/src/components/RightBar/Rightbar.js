import React, { useEffect, useState } from 'react'
import DefaultProfilePicture from '../../images/defaultProfileIcon.jpg';
import './Rightbar.scss';
import axios from 'axios';

const Rightbar = ({loggedIn, userData, postData, allUserData}) => {
    const [trendyUsers, setTrendyUsers] = useState([]);
    const [mostLikedPosts, setMostLikedPosts] = useState([]);

    useEffect(() => {
        const fetchTrendyUsers = async() => {
            try{
                const res = await axios.get('http://localhost:3001/get-trendy-users');

                setTrendyUsers(res.data);
            }catch(err){
                console.error(`Error: ${err}`);
            };
        };

        const fetchTopThreePosts = async() => {
            try{
                const res = await axios.get('http://localhost:3001/get-top-liked-post');

                setMostLikedPosts(res.data);
            }catch(err){
                console.error(`Error: ${err}`);
            };
        }

        fetchTrendyUsers();
        fetchTopThreePosts();
    }, []);

    return (
        <div className='rightbar'>
            <div className="container">
                <div className="item">
                    <span>{loggedIn ? 'Suggestions for You' : 'Trendy Users'}</span>

                    <div className="trendy-users">
                        {trendyUsers.map((user, index) => {
                            return(
                                <div className="user" key={index}>
                                    <div className="userInfo">
                                        <img src={DefaultProfilePicture} alt="" />
                                        <span>{user.firstName} {user.lastName}</span>
                                    </div>

                                    <div className="buttons">
                                        <button>Follow</button>
                                        <button>Dimiss</button>
                                    </div>
                                </div>
                            )
                        })}
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