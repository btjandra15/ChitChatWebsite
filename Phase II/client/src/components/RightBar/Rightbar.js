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
    const [openTipBox, setOpenTipBox] = useState(false);
    const [tipAmount, setTipAmount] = useState(0);
 
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
                    console.log("Successfully followed this user!");
                })
                .catch((err) => {
                    console.error(err);
                })
        }
    }

    const tipUser = (userID, trendyUserID) => {
        // console.log(tipAmount);
        // console.log(trendyUserID);

        if(tipAmount > 0){
            setTipAmount(parseInt(tipAmount));
            
            const updateTipAmountConfig = {
                method: "POST",
                url: `http://localhost:3001/tip-user`,
                data: {
                    userID: userID,
                    trendyUserID: trendyUserID,
                    tipAmount: tipAmount
                },
                headers: {
                    Authorization: `Bearer: ${token}`
                }
            }

            axios(updateTipAmountConfig)
                .then((res) => {
                    console.log(res);
                    alert("You have successfully tipped the user");
                })
                .catch((err) => {
                    console.error(err);
                })
        }else{
            alert("Tip an amount greater than 0");
        }
    }

    const showPoup = () => {
        setOpenTipBox(!openTipBox);
    }

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

                                        <Link to={`/profile/${user.username}`}>
                                            <span>{user.firstName} {user.lastName}</span>
                                        </Link>
                                    </div>

                                    <div className="buttons">
                                        <button onClick={() => followUser(userData._id, user._id)}>Follow</button>
                                        <button>Dimiss</button>
                                        <button onClick={showPoup}>Tip</button>

                                        {
                                            openTipBox ?
                                            <div className="popup">
                                                <div className="popup-inner">
                                                    <h3>Tip User</h3>
                                                    <input type="number" value={tipAmount} onChange={(e) => setTipAmount(e.target.value)}/>
                                                    <button onClick={() => tipUser(userData._id, user._id)}>Tip</button>
                                                    <button className='close-button' onClick={showPoup}>Close</button>
                                                </div>
                                            </div>
                                            :
                                            null
                                        }
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