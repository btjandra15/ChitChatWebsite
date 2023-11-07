import React from 'react'
import DefaultProfilePicture from '../../images/defaultProfileIcon.jpg';
import './Rightbar.scss';

const Rightbar = () => {
  return (
    <div className='rightbar'>
    <div className="container">
        <div className="item">
            <span>Suggestions For You</span>

            <div className="user">
                <div className="userInfo">
                    <img src={DefaultProfilePicture} alt="" />
                    <span>Jane Doe</span>
            </div>

            <div className="buttons">
                <button>Follow</button>
                <button>Dimiss</button>
            </div>
        </div>

        <div className="user">
            <div className="userInfo">
                <img src={DefaultProfilePicture} alt="" />
                <span>Jane Doe</span>
            </div>

            <div className="buttons">
                <button>Follow</button>
                <button>Dimiss</button>
            </div>
        </div>
    </div>

    <div className="item">
        <span>Latest Activities</span>

        <div className="user">
            <div className="userInfo">
                <img src={DefaultProfilePicture} alt="" />

                <p>
                    <span>Jane Doe</span> changed their cover picture
                </p>
            </div>

            <span>1 min ago</span>
        </div>

        <div className="user">
            <div className="userInfo">
                <img src={DefaultProfilePicture} alt="" />
                <p>
                <span>Jane Doe</span> liked your photo
                </p>
            </div>

            <span>20 min ago</span>
        </div>

        <div className="user">
            <div className="userInfo">
                <img src={DefaultProfilePicture} alt="" />
                <p>
                <span>Jane Doe</span> change their profile picture
                </p>
            </div>

            <span>50 mins ago</span>
            </div>

        <div className="user">
            <div className="userInfo">
                <img src={DefaultProfilePicture} alt="" />
                <p>
                    <span>Jane Doe</span> posted a new video
                </p>
            </div>

            <span>12 hrs ago</span>
            </div>
        </div>

        <div className="item">
            <span>Online Friends</span>

            <div className="user">
            <div className="userInfo">
                <img src={DefaultProfilePicture} alt="" />
                <div className='online'/>
                <span>Jane Doe</span>
            </div>
            </div>
            
            <div className="user">
                <div className="userInfo">
                    <img src={DefaultProfilePicture} alt="" />
                    <div className='online'/>
                    <span>Jane Doe</span>
                </div>
            </div>
            
            <div className="user">
                <div className="userInfo">
                    <img src={DefaultProfilePicture} alt="" />
                    <div className='online'/>
                    <span>Jane Doe</span>
                </div>
            </div>

            <div className="user">
                <div className="userInfo">
                    <img src={DefaultProfilePicture} alt="" />
                    <div className='online'/>
                    <span>Jane Doe</span>
                </div>
            </div>
            
            <div className="user">
                <div className="userInfo">
                    <img src={DefaultProfilePicture} alt="" />
                    <div className='online'/>
                    <span>Jane Doe</span>
                </div>
            </div>
        </div>
    </div>
</div>
  )
}

export default Rightbar