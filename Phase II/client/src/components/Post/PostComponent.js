import React, { useEffect, useState } from 'react';
import './PostComponent.scss';
import axios from 'axios';
import Cookies from 'universal-cookie';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VisibilityIcon from '@mui/icons-material/Visibility';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const cookies = new Cookies();
const token = cookies.get("TOKEN");

const PostComponent = ({ post, index }) => {
  const [userData, setUserData] = useState([]);
  const [postData, setPostData] = useState([]);
  const [tabooWordNotification, setTabooWordNotification] = useState(null);

  const openPost = (postId, userId) => {
    axios.post(`http://localhost:3001/view-post`, { postId, userId })
      .then((response) => {
        console.log('Server Response:', response.data); // Add this line for debugging
  
        const containsTabooWords = response.data.tabooWords;
  
        if (containsTabooWords.length > 0) {
          console.log('Contains Taboo Words:', containsTabooWords); // Add this line for debugging
  
          setTabooWordNotification({
            type: 'error',
            message: `Post contains taboo words: ${containsTabooWords.join(', ')}`,
          });
        } else {
          console.log('Does not contain taboo words.'); // Add this line for debugging
  
          setPostData((prevData) => {
            const updatedData = [...prevData];
            const postIndex = updatedData.findIndex((post) => post._id === postId);
  
            if (postIndex !== -1) updatedData[postIndex].views++;
  
            return updatedData;
          });
        }
      })
      .catch((err) => {
        console.error('Error opening post:', err);
      });
  };
  

  const likePost = (postId, userId) => {
    if (postData.some((post) => post._id === postId && post.userLiked.includes(userId))) {
      console.log("User has already liked the post.");
      return;
    }

    axios.post(`http://localhost:3001/like-post`, { postId, userId })
      .then(() => {
        alert("You successfully liked this post!");

        setPostData((prevData) => {
          const updatedData = [...prevData];
          const postIndex = updatedData.findIndex((post) => post._id === postId);

          if (postIndex !== -1) updatedData[postIndex].likes++;

          return updatedData;
        });
      })
      .catch((err) => {
        alert("You already liked this post!");
        console.log(err);
      });
  };

  const reportPost = (postId, userId) => {
    if (postData.some((post) => post._id === postId && post.userReported.includes(userId))) {
      console.log("User has already reported the post.");
      return;
    }

    axios.post(`http://localhost:3001/report-post`, { postId, userId })
      .then(() => {
        alert("You have successfully reported this post!");

        setPostData((prevData) => {
          const updatedData = [...prevData];
          const postIndex = updatedData.findIndex((post) => post._id === postId);

          if (postIndex !== -1) updatedData[postIndex].reports++;

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
  };

  useEffect(() => {
    const userConfig = {
      method: 'GET',
      url: 'http://localhost:3001/get-user',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios(userConfig)
      .then((res) => {
        setUserData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className='post' onClick={() => openPost(post._id, userData._id)}>
      {tabooWordNotification && (
        <div className={`notification ${tabooWordNotification.type}`}>
          {tabooWordNotification.message}
          {/* <div className='Avatar_symbol'>
            <Avatar/>
          </div>  */}
        </div>
      )}

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
              <span>{post.reports} Complaints</span>

              <AccessTimeIcon className='icon'/>
              <span>{post.dateAndTime}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostComponent;
