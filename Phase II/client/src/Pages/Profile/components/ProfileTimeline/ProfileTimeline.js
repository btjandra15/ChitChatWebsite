import React, { useRef, useState } from 'react';
import './ProfileTimeline.scss';
import DefaultProfilePic from '../../../../images/defaultProfileIcon.jpg';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CropperImage from '../CropperImage/CropperImage';
import Close from '@mui/icons-material/Close';

const ProfileTimeline = ({ userData }) => {
    // Check if userData is available
    // if (!userData) {
    //     return <div>Loading...</div>; // or any other loading state representation
    // }

    // Destructure necessary fields from userData
    const { profilePictureUrl, bannerUrl, bio, username } = userData;
    const inputRef = useRef(null);
    const triggerFileSelectPopup = () => inputRef.current.click();
    const [ image, setImage ] = useState(null);

    const onSelectFile = (e) => {
        if(e.target.files && e.target.files.length > 0){
            const reader = new FileReader()

            reader.readAsDataURL(e.target.files[0]);

            reader.addEventListener('load', () => {
                console.log(reader.result);
                setImage(reader.result);
            })
        }
    }

    return (
        <div className="profile-timeline">
            {bannerUrl && <img src={bannerUrl} alt="Banner" className="profile-banner" />}

            {
                image ? 
                <CropperImage image={image} userData={userData}/>
                : 
                null
            }

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
