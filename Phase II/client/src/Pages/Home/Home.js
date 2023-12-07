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
import WarningModal from "./WarningModal/WarningModal";

const cookies = new Cookies();
const token = cookies.get("TOKEN");

const Home = ({ onSearch, filteredPosts: homeFilteredPosts }) => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);
    const [allUserData, setAllUserData] = useState([]);
    const { darkMode } = useContext(DarkModeContext);
    const [posts, setPosts] = useState([]);
    const [sortOption, setSortOption] = useState(null);

    const filterAndSortPosts = () => {
        let filtered = [...posts];
      
        // Apply filtering based on homeFilteredPosts
        if (homeFilteredPosts.length > 0) {
          filtered = homeFilteredPosts;
        }

        // Apply sorting based on sortOption
        if (sortOption === 'asc') {
          filtered.sort((a, b) => a.likes - b.likes);
        } else if (sortOption === 'desc') {
          filtered.sort((a, b) => b.likes - a.likes);
        }

        if (sortOption === 'imageTrue') {
            filtered = filtered.filter(post => post.imageUrl !== null);
        } else if (sortOption === 'imageFalse') {
            filtered = filtered.filter(post => post.imageUrl === null);
        }
    
        return filtered;
    };

    const handleSort = (option) => {
        setSortOption(option);
    };

    const handleWarningAction = (userId, action) => {
        const deleteUser = 'http://localhost:3001/delete-user';
        const confirmed = window.confirm('Are you sure you want to proceed?');
        
        if (confirmed) {
            if (action === "payFine") {
                // Redirect to the payment page
                window.location.href = 'http://localhost:3000/payment'; // Adjust the URL as needed
            } else if (action === "removeFromSystem") {
                // Make an API call to delete the user
                axios.post(deleteUser, { userId })
                    .then((response) => {
                        console.log('User deleted successfully:', response.data);
                        window.alert('You have been deleted from the system.');
                        // Redirect or perform any additional actions (e.g., log out the user)
                        window.location.href = 'http://localhost:3000/'; // Redirect to home or login page
                    })
                    .catch((error) => {
                        console.error('Error deleting user:', error);
                        window.alert('Failed to delete user. Please try again.');
                    });
            }
        }
    };

    const DemoteTrendyUser = (userData) => {
        if (userData && userData.trendyUser && userData.warningCount >= 3) {
            axios.post(`http://localhost:3001/demote-to-ordinary/${userData._id}`)
                .then(() => {
                    // Display a popup or some notification about the demotion
                    window.alert('You have been demoted to an Ordinary User.');
    
                    // Optionally, you can also update the local state or perform any other actions
                    setUserData({ ...userData, userType: 'Ordinary User' });
    
                    // Refresh the page
                    window.location.reload();
                })
                .catch((error) => {
                    console.error('Error demoting user:', error);
                    // Handle the error as needed
                });
        }
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

        //GETS ALL USERS AND CHECKS TO SEE IF THEY MEET THE TRENDY REQUIREMENTS
        const getAllUsers = () => {
            axios(allUserConfig)
            .then((res) => {
                setAllUserData(res.data);

                res.data.map((user) => {
                    const subscribedUsersCount = user.followingList.length;
                    const likeDislikeDifference = user.likes - user.dislikes;
                    const trendyMessagesCount = user.trendyMessages.length;

                    if(user.userType !== 'Trendy User'){
                        if(subscribedUsersCount > 10 && trendyMessagesCount >= 2 && (likeDislikeDifference > 10 || user.tips > 100))
                           updateUser(user._id, 'trendyUser', true);
                        else
                            updateUser(user._id, 'trendyUser', false);

                        if(user.warningCount >= 3){
                            updateUser(user._id, 'trendyUser', false);
                        }
                    }

                    return null;
                });
            })
            .catch((err) => {
                console.log(err);
            });
        }

        //CHECKS THE CURRENT LOGGED IN USER
        const getLoggedInUser = () => {
            axios(loggedInUserConfig)
                .then((res) => {
                    setLoggedIn(true);
                    setUserData(res.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }

        // GETS ALL POSTS & CHECKS TO SEE IF THEY MEET THE TRENDY REQUIREMENTS
        const getAllPosts = () => {
            axios(postConfig)
                .then((res) => {
                setPosts(res.data);

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
        }

        getAllUsers();
        getLoggedInUser();
        getAllPosts();
    }, [])

    useEffect(() => {
        DemoteTrendyUser(userData);
    }, [userData]);

    return(
        <div className={`theme-${darkMode ? 'dark' : 'light'}`}>
            {/* NAVBAR CONTENT */}
            <Navbar
                loggedIn={loggedIn}
                userData={userData}
                onSearch={onSearch}
                onSort={handleSort}
            />

            <div className="main-content">
                {/* LEFTBAR CONTENT */}
                <Leftbar loggedIn={loggedIn} userData={userData} logout={logout}/>

                {/* MIDDLE CONTENT */}
                <div style={{flex: 6}}>
                    <div className='middleBar'>
                        {loggedIn ? <CreatePost/> : <div></div>}
                            {filterAndSortPosts()
                                .filter(post => !post.jobPost)
                                .map((post, index) => (
                                    <PostComponent post={post} key={index} />
                            ))}
                    </div>
                </div>
                
                {/* Show the WarningModal if needed*/}
                {userData && userData.warningCount >= 3 && (userData.userType === 'Corporate User' || userData.userType === 'Ordinary User') && (
                    <WarningModal userId={userData._id} onConfirm={handleWarningAction} />
                )}

                {/* RIGHT CONTENT */}
                <Rightbar loggedIn={loggedIn} userData={userData}/>
            </div>
        </div>
    )
};

export default Home;
