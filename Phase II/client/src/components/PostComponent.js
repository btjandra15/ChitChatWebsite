import React, { useEffect, useState } from 'react'
import './PostComponent.scss'
import axios from 'axios';
import Cookies from 'universal-cookie';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const cookies = new Cookies();
const token = cookies.get("TOKEN");

const PostComponent = ({post, index}) => {
    const [ userData, setUserData ] = useState([]);
    const [ postData, setPostData ] = useState([]);

    const likePost = (postId, userId) => {
      if (postData.some(post => post._id === postId && post.userLiked.includes(userId))) {
        // If the user has already liked the post, you can choose to do nothing or show a message
        console.log("User has already liked the post.");
        alert("You already liked this post!");
        return;
      }
    
      axios.post(`http://localhost:3001/like-post`, { postId, userId })
        .then(() => {
          setPostData(prevData => {
            const updatedData = [...prevData];
            const postIndex = updatedData.findIndex(post => post._id === postId);
              
            if(postIndex !== -1) updatedData[postIndex].likes++;
    
            return updatedData;
          })
        })
        .catch((err) => {
          console.log(err);
        });
    }

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
        <div className='post'>
           {/* <div className='Avatar_symbol'>
            <Avatar/>
          </div>  */}

          <div className='text_body' key={index}>
            <div className='text_header'>
              <div className='text_name'>
                <h3>{post.authorFirstName} {post.authorLastName}</h3>
                <h3>@{post.authorUsername}</h3>
              </div>
  
            <div className='text_description'>
                <p>{post.content}</p>
            </div>
            
            </div>
              <div className="text-bottom">
                <div className="text-footer">
                  <div className="footer-content">
                    <ThumbUpIcon className='icon' onClick={() => likePost(post._id, userData._id)}/>
                    <span>{post.likes} Likes</span>

                    <ThumbDownIcon className='icon' onClick={() => dislikePost(post._id)}/>
                    <span>{post.dislikes} Dislikes</span>

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