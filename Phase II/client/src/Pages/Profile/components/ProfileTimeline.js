import React from 'react';
import './ProfileTimeline.scss';
import DefaultProfilePic from '../../../images/defaultProfileIcon.jpg';
import AddCircleIcon from '@mui/icons-material/AddCircle';

const ProfileTimeline = ({ userData }) => {
    // Check if userData is available
    if (!userData) {
        return <div>Loading...</div>; // or any other loading state representation
    }

    // Destructure necessary fields from userData
    const { profilePictureUrl, bannerUrl, bio, username } = userData;

    return (
        <div className="profile-timeline">
            {bannerUrl && <img src={bannerUrl} alt="Banner" className="profile-banner" />}

            <div className="profile-info">
                {profilePictureUrl && <img src={profilePictureUrl} alt={username} className="profile-picture" />}

                <div className="profilepicture">
                    <img src={DefaultProfilePic} alt="" className='profile-picture'/>
                    <AddCircleIcon className='add-picture-icon'/>
                </div>
                
                <h2>{username}</h2>
                <p>{bio}</p>
            </div>
            {/* You can add more user details here */}
        </div>
    );
};

export default ProfileTimeline;
