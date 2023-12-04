import React, { useState, useRef, useContext } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import './ProfileTimeline.scss';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { DarkModeContext } from '../../../../context/darkModeContext';

const ProfileTimeline = ({ userData, updateUser, setUserData }) => {
  const [editBio, setEditBio] = useState(false);
  const [bioValue, setBioValue] = useState(userData.bio || '');
  const profileImageRef = useRef(null);
  const bannerImageRef = useRef(null);
  const { darkMode } = useContext(DarkModeContext); // Use the darkMode value from context

  // Retrieve the token from cookies
  const cookies = new Cookies();
  const token = cookies.get('TOKEN');

  const uploadImage = async (file, isProfilePicture) => {
    const formData = new FormData();
    formData.append(isProfilePicture ? 'profileImage' : 'bannerImage', file);
    formData.append('userID', userData._id);

    try {
      const endpoint = isProfilePicture ? '/upload-profile-pic' : '/upload-banner-pic';
      const response = await axios.post(`http://localhost:3001${endpoint}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };



  // Function to handle image selection
  const onSelectFile = async (e, isProfilePicture) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        const response = await uploadImage(file, isProfilePicture);
        if (response.success) {
          const imageUrl = response.imageUrl;
          const fieldToUpdate = isProfilePicture ? 'profilePictureUrl' : 'bannerUrl';
          // Call the updateUser function to update the backend user document
          updateUser(userData._id, fieldToUpdate, imageUrl).then(() => {
            // Update the local state to reflect the changes
            setUserData({ ...userData, [fieldToUpdate]: imageUrl });
          });
        } else {
          // Handle the case where the success flag is not true
          console.error('Failed to upload image. Please try again.', response.message);
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Error uploading image. Please try again.');
      }
    }
  };






  const toggleEditBio = () => {
    setEditBio(!editBio);
    setBioValue(userData.bio || '');
  };

  const handleBioChange = (e) => {
    setBioValue(e.target.value);
  };

  const submitBio = () => {
    updateUser(userData._id, 'bio', bioValue)
      .then(() => {
        // Alert the user and refresh the page
        alert("Bio updated successfully.");
        window.location.reload(); // Refresh the page to show the updated bio
      })
      .catch((error) => {
        // Handle any errors here
        console.error("Error updating bio", error);
        alert("Failed to update bio.");
      });
  };


  return (
    <div className={`profile-timeline ${darkMode ? 'dark' : ''}`}>
      {/* Banner Image */}
      <div className={`banner-container ${darkMode ? 'dark' : ''}`}>
        {userData.bannerUrl ? (
          <img src={userData.bannerUrl} alt="Banner" className={`profile-banner ${darkMode ? 'dark' : ''}`} />
        ) : (
          <div className={`profile-banner-placeholder ${darkMode ? 'dark' : ''}`}>No Banner Image</div>
        )}
        <input
          type="file"
          accept='image/*'
          ref={bannerImageRef}
          style={{ display: 'none' }}
          onChange={(e) => onSelectFile(e, false)}
        />
        <button
          className={`change-banner-btn ${darkMode ? 'dark' : ''}`}
          onClick={() => bannerImageRef.current.click()}
        >
          Change Banner
        </button>

        {/* Profile Picture */}
        <div className="profile-picture-container">
          {userData.profilePictureUrl ? (
            <img
              src={userData.profilePictureUrl}
              alt={userData.username}
              className="profile-picture"
            />
          ) : (
            <div className="profile-picture-placeholder">No Profile Image</div>
          )}
          <input
            type="file"
            accept='image/*'
            ref={profileImageRef}
            style={{ display: 'none' }}
            onChange={(e) => onSelectFile(e, true)}
          />
          <AddCircleIcon
            className="change-profile-picture-icon"
            onClick={() => profileImageRef.current.click()}
          />
        </div>
      </div>

      {/* Profile Info */}
      <div className="profile-info">
        <h2 className={`usernamebio ${darkMode ? 'dark' : ''}`}>{userData.username}</h2>
        {/* Bio Section */}
        {editBio ? (
          <>
            <textarea
              value={bioValue}
              onChange={handleBioChange}
              className={`bio-textarea ${darkMode ? 'dark' : ''}`}
            />
            <button className={`save-bio-btn ${darkMode ? 'dark' : ''}`} onClick={submitBio}>Save Bio</button>
            <button className={`cancel-bio-btn ${darkMode ? 'dark' : ''}`} onClick={toggleEditBio}>Cancel</button>
          </>
        ) : (
          <>
            <p className={`bio ${darkMode ? 'dark' : ''}`}>{userData.bio}</p>
            <button className={`edit-bio-btn ${darkMode ? 'dark' : ''}`} onClick={toggleEditBio}>Edit Bio</button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileTimeline;


