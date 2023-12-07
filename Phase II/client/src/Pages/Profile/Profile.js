import React, { useContext, useEffect, useState } from "react";
import "./Profile.scss";
import Cookies from "universal-cookie";
import axios from "axios";
import { DarkModeContext } from "../../context/darkModeContext";
import Navbar from "../../components/Navbar/Navbar.js";
import Leftbar from "../../components/LeftBar/Leftbar";
import Rightbar from "../../components/RightBar/Rightbar.js";
import PostComponent from "../../components/Post/PostComponent";
import ComplaintsView from "./components/ComplaintsView/ComplaintsView.js";
import { useParams } from "react-router-dom";
import ProfileTimeline from "./components/ProfileTimeline/ProfileTimeline.js";
import UserComplaintsView from "./components/UserComplaintsView/UserComplaintsView.js";

const cookies = new Cookies();
const token = cookies.get("TOKEN");

const Profile = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [otherUserData, setOtherUserData] = useState(null);
  const { darkMode } = useContext(DarkModeContext);
  const [postData, setPostData] = useState([]);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const { username } = useParams();
  const [selectedUserComplaints, setSelectedUserComplaints] = useState(null);
  const [userComplaints, setUserComplaints] = useState([]);

  const handleViewProfileComplaints = (userComplaints) => {
    setSelectedUserComplaints((prevId) => (prevId === userComplaints ? null : userComplaints));
  }
  
  const handleViewComplaints = (postId) => {
    setSelectedPostId((prevId) => (prevId === postId ? null : postId));
  };

  const logout = () => {
    cookies.remove("TOKEN", { path: "/" });
    setLoggedIn(false);
  };

  const updateUser = (userId, fieldToUpdateParam, newValueParam) => {
    return axios
      .put(`http://localhost:3001/update-user/${userId}`, {
        fieldToUpdate: fieldToUpdateParam,
        newValue: newValueParam,
      })
      .then(() => {
        console.log("Successfully updated user");
      })
      .catch((err) => {
        console.error(`Error updating User: ${err}`);
      });
  };

  // Fetch the logged-in user data
  useEffect(() => {
    axios
      .get(`http://localhost:3001/get-user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setLoggedIn(true);
        setUserData(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [token]);

  // Fetch user's own posts when on their profile
  useEffect(() => {
    if (userData && userData.username === username) {
      axios
        .get(`http://localhost:3001/api/posts/user/${userData._id}`)
        .then((response) => {
          setPostData(response.data);
        })
        .catch((error) => console.error("Error fetching user posts", error));
    }

    setIsOwnProfile(userData && username === userData.username);
  }, [userData, username]);

  // Fetch someone else's profile data and posts
  useEffect(() => {
    if (username && (!userData || (userData && userData.username !== username))) {
      axios
        .get(`http://localhost:3001/get-other-user/${username}`)
        .then((res) => {
          // setLoggedIn(true);
          setOtherUserData(res.data);

          axios
            .get(`http://localhost:3001/api/posts/user/${res.data._id}`)
            .then((response) => {
              setPostData(response.data);
            })
            .catch((error) =>
              console.error("Error fetching user posts", error)
            );
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [username, userData]);

  useEffect(() => {
    if (userData) {
      axios
        .get(`http://localhost:3001/get-user-complaints/${userData._id}`)
        .then((response) => {
          const profileComplaints = response.data.filter(
            (complaint) => complaint.content === 'Profile'
          );
          setUserComplaints(profileComplaints);
        })
        .catch((error) => console.error('Error fetching user complaints', error));
    }
  }, [userData]);

  return (
    <div className={`theme-${darkMode ? "dark" : "light"}`}>
      <Navbar loggedIn={loggedIn} userData={userData} logout={logout} />
      <div className="main-content">
        <Leftbar loggedIn={loggedIn} userData={userData} logout={logout} />
        
        <div style={{ flex: 6 }}>
          <div className="middleBar">
            {/* <ProfileTimeline
              userData={userData}
              updateUser={updateUser}
              setUserData={setUserData}
            /> */}
            <ProfileTimeline
              userData={isOwnProfile ? userData : otherUserData} // Pass userData only if it's the user's own profile
              updateUser={updateUser}
              setUserData={isOwnProfile ? setUserData : setOtherUserData}
              username={isOwnProfile ? null : username} // Pass the username only if it's someone else's profile
              isOwnProfile={isOwnProfile}
              reportInitiator={userData}
            />
            
            {isOwnProfile && userComplaints && userComplaints.length > 0 && (
              <div>
                <p>This profile has received complaints</p>
                <button onClick={() => handleViewProfileComplaints(userComplaints)}>
                  {selectedUserComplaints === userComplaints ? 'Hide Complaints' : 'View Complaints'}
                </button>
                {selectedUserComplaints === userComplaints && (
                  <UserComplaintsView userComplaints={userComplaints} />
                )}
              </div>
            )}

            {postData.map((post, index) => (
              <div key={index}>
                <PostComponent post={post} />
                {isOwnProfile && post.userReported && post.userReported.length > 0 && (
                  <div>
                    <p>This post received complaint(s)</p>
                    <button onClick={() => handleViewComplaints(post._id)}>
                      {selectedPostId === post._id
                        ? "Hide Complaints"
                        : "View Complaints"}
                    </button>
                    {selectedPostId === post._id && (
                      <ComplaintsView postId={selectedPostId} />
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <Rightbar loggedIn={loggedIn} userData={userData}/>
      </div>
    </div>
  );
};

export default Profile;
