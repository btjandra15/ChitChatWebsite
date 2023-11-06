import React, { useEffect, useState } from 'react'
import './PostComponent.scss'
import axios from 'axios';
import Cookies from 'universal-cookie';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VisibilityIcon from '@mui/icons-material/Visibility';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const cookies = new Cookies();
const token = cookies.get("TOKEN");

const PostComponent = ({post, index}) => {
    const [ userData, setUserData ] = useState([]);
    const [ postData, setPostData ] = useState([]);

    const openPost = (postId, userId) => {
      console.log('viewed posted');

      axios.post(`http://localhost:3001/view-post`, { postId, userId })
        .then(() => {
          setPostData(prevData => {
            const updatedData = [...prevData];
            const postIndex = updatedData.findIndex(post => post._id === postId);

            if(postIndex !== -1) updatedData[postIndex].views++;

            return updatedData;
          })
        })
    }

    const likePost = (postId, userId) => {
      if (postData.some(post => post._id === postId && post.userLiked.includes(userId))) {
        // If the user has already liked the post, you can choose to do nothing or show a message
        console.log("User has already liked the post.");
        return;
      }
    
      axios.post(`http://localhost:3001/like-post`, { postId, userId })
        .then(() => {
          alert("You successfully liked this post!");

          setPostData(prevData => {
            const updatedData = [...prevData];
            const postIndex = updatedData.findIndex(post => post._id === postId);
              
            if(postIndex !== -1) updatedData[postIndex].likes++;
    
            return updatedData;
          })
        })
        .catch((err) => {
          alert("You already liked this post!");
          console.log(err);
        });
    }

    const reportPost = (postId, userId) => {
      if (postData.some(post => post._id === postId && post.userReported.includes(userId))) {
        // If the user has already liked the post, you can choose to do nothing or show a message
        console.log("User has already liked the post.");
        return;
      }

      axios.post(`http://localhost:3001/report-post`, { postId, userId })
        .then(() => {
          alert("You have successfully reported this post!");

          setPostData(prevData => {
            const updatedData = [...prevData];
            const postIndex = updatedData.findIndex(post => post._id === postId);

            if(postIndex !== -1) updatedData[postIndex].reports++;

            return updatedData;
          }); 
        })
        .catch((err) => {
          alert("You already reported this post!");
          console.log(err);
        });
    };

    const dislikePost = () => {
      console.log("Disliked!");
    }

    useEffect(() => {
      const userConfig = {
        method: 'GET',
        url: 'http://localhost:3001/user',
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

      axios(userConfig)
      .then((res) => {
        setUserData(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
    }, [])

    return(
        <div className='post' onClick={() => openPost(post._id, userData._id)}>
          {/* <div className='Avatar_symbol'>
            <Avatar/>
          </div>  */}

          <div className='text-body' key={index}>
            <div className='text-header'>
              <div className='text-name'>
                <h3>{post.authorFirstName} {post.authorLastName}</h3>
                <h3 className='username'>@{post.authorUsername}</h3>
                <button>Follow</button>
                <button onClick={() => reportPost(post._id, userData._id)} className='report-button'>Report</button>
              </div>
    
              <div className='text-description'>
                <p>{post.content}</p>
              </div>
            </div>

            <div className="text-bottom">
              <div className="text-footer">
                <div className="footer-content">
                  <VisibilityIcon className='icon'/>
                  <span>{post.views} Views</span>

                  <ThumbUpIcon className='icon' onClick={() => likePost(post._id, userData._id)}/>
                  <span>{post.likes} Likes</span>

                  <ThumbDownIcon className='icon' onClick={() => dislikePost(post._id)}/>
                  <span>{post.dislikes} Dislikes</span>

                  <WarningAmberIcon className='icon'/>
                  <span>{post.reports} Compliants</span>

                  <AccessTimeIcon className='icon'/>
                  <span>{post.dateAndTime}</span>

                </div>
              </div>
            </div>
          </div>
        </div>
    )
}

export default PostComponent;