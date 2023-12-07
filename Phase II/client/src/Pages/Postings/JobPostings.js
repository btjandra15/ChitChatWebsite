import React, { useContext, useEffect, useState } from 'react';
import './JobPostings.scss';
import Navbar from '../../components/Navbar/Navbar';
import Leftbar from '../../components/LeftBar/Leftbar';
import CreateJobPost from '../../components/CreateJobPost/CreateJobPost'
import PostComponent from '../../components/Post/PostComponent';
import Rightbar from '../../components/RightBar/Rightbar';
import Cookies from 'universal-cookie';
import axios from 'axios';
import { DarkModeContext } from '../../context/darkModeContext';

const cookies = new Cookies();
const token = cookies.get("TOKEN");

const JobPostings = ({ onSearch, filteredPosts: homeFilteredPosts }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [allUserData, setAllUserData] = useState([]);
  const [postData, setPostData] = useState([]);
  const { darkMode } = useContext(DarkModeContext);
  const [sortOption, setSortOption] = useState('asc');

  const filterAndSortPosts = () => {
    let filtered = [...postData];
  
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

  const updatePost = (postId, fieldToUpdateParam, newValueParam) => {
    axios.put(`http://localhost:3001/update-post/${postId}`, { fieldToUpdate: fieldToUpdateParam, newValue: newValueParam })
        .then(() => {
            console.log("Successfuly updated post");
        })
        .catch((err) => {
            console.error(`Error updating Post: ${err}`);
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

  return (
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
                  {loggedIn ? <CreateJobPost/> : <div></div>}
                  {/* {postData && postData.length > 0 && (
                    postData
                        .filter(post => post.jobPost === true)
                        .map((post, index) => (
                        <PostComponent post={post} key={index} />
                        ))
                    )} */}
                    {filterAndSortPosts()
                        .filter(post => post.jobPost === true)
                        .map((post, index) => (
                            <PostComponent post={post} key={index} />
                    ))}
              </div>
          </div>

          {/* RIGHT CONTENT */}
          <Rightbar loggedIn={loggedIn} userData={userData} post={postData} allUserData={allUserData}/>
      </div>
    </div>
  )
}

export default JobPostings;