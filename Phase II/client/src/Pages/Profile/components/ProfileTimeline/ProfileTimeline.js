import React, { useRef } from 'react';
import './ProfileTimeline.scss';
import AddCircleIcon from '@mui/icons-material/AddCircle';

const ProfileTimeline = ({ userData }) => {
    // Check if userData is available
    // if (!userData) {
    //     return <div>Loading...</div>; // or any other loading state representation
    // }

    // Destructure necessary fields from userData
    const { profilePictureUrl, bannerUrl, bio, username } = userData;
    const inputRef = useRef(null);
    const triggerFileSelectPopup = () => inputRef.current.click();


    const onSelectFile = (e) => {
    }

    return (
        <div className="profile-timeline">
            {bannerUrl && <img src={bannerUrl} alt="Banner" className="profile-banner" />}

            <div className="profile-info">
                {profilePictureUrl && <img src={profilePictureUrl} alt={username} className="profile-picture-icon" />}

                <div className="add-profile-picture-icon">
                    {/* <img src={DefaultProfilePic} alt="" className='profile-picture'/> */}
                    <input type="file" accept='image/*' ref={inputRef} style={{display: 'none'}} onChange={onSelectFile}/>
                    <AddCircleIcon className='add-picture-icon' onClick={triggerFileSelectPopup}/>
                </div>
                
                <h2>{username}</h2>
                <p>{bio}</p>
            </div>
            {/* You can add more user details here */}
        </div>
    );
};

export default ProfileTimeline;
