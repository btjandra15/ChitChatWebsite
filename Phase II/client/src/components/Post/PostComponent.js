import React, { useEffect, useState } from 'react'
import './PostComponent.scss'
import axios from 'axios';
import Cookies from 'universal-cookie';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VisibilityIcon from '@mui/icons-material/Visibility';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import TestImage from '../../images/cityBackground.jpg';
import ModeCommentIcon from '@mui/icons-material/ModeComment';
import CreateComment from '../CreateComment/CreateComment';

const cookies = new Cookies();
const token = cookies.get("TOKEN");

const PostComponent = ({post, index}) => {
    const [ userData, setUserData ] = useState([]);
    const [ postData, setPostData ] = useState([]);
    const [ commentData, setCommentData ] = useState([]);
    const [ openComments, setOpenComments ] = useState(false);
    
    const openPost = (postId, userId) => {
      axios.post(`http://localhost:3001/view-post`, { postId, userId })
        .then(() => {
          setPostData(prevData => {
            const updatedData = [...prevData];
            const postIndex = updatedData.findIndex(post => post._id === postId);

            if(postIndex !== -1) updatedData[postIndex].views++;

            return updatedData;
          })
        })
        .catch((err) => {
          console.error("User already viewed this post");
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

    const followPost = (postId, userId) => {
      const followPostConfig = {
        method: "POST",
        url: `http://localhost:3001/follow-post`,
        data: {
          postId: postId,
          userId: userId,
        },
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

      axios(followPostConfig)
        .then(() => {
          alert("You have successfully followed this post!");
        })
        .catch((err) => {
          alert("You already followed this post!");
          console.log(err);
        })
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

    const dislikePost = (postId, userId) => {
      if (postData.some(post => post._id === postId && post.userLiked.includes(userId))) {
        // If the user has already liked the post, you can choose to do nothing or show a message
        console.log("User has already liked the post.");
        return;
      }
    
      axios.post(`http://localhost:3001/dislike-post`, { postId, userId })
        .then(() => {
          alert("You successfully disliked this post!");

          setPostData(prevData => {
            const updatedData = [...prevData];
            const postIndex = updatedData.findIndex(post => post._id === postId);
              
            if(postIndex !== -1) updatedData[postIndex].dislikes++;
    
            return updatedData;
          })
        })
        .catch((err) => {
          alert("You already disliked this post!");
          console.log(err);
        });
    }

    const deletePost = async(postId) => {
      try{
        if(userData.adminUser){
          const response = await fetch(`http://localhost:3001/delete-post/${postId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            }
          });
  
          if (!response.ok) {
            // Handle non-successful responses (e.g., show an error message)
            const errorData = await response.json();
            console.error('Error deleting post:', errorData.message);
          } else {
              // Handle successful response (e.g., update UI)
              console.log('Post deleted successfully');
          }
        }else{
          console.error("NO PERMISSION");
        }
      }catch(error){
        console.error(error);
      }
    }

    const openComment = () => {
      setOpenComments(!openComments);

      const commentConfig = {
        method: 'GET',
        url: 'http://localhost:3001/get-comments',
        data: {
          postID: post._id,
        }
      };

      axios(commentConfig)
        .then((res) => {
          // Filter comments with the same postID as the original post
          const filteredComments = res.data.filter((comment) => (
            comment.postID === post._id && comment.authorID === post.authorId
          ));
          
          setCommentData(filteredComments);
        })
        .catch((err) => {
          console.log(err);
        });
    }

    useEffect(() => {
      const getLoggedInUser = () => {
        const userConfig = {
          method: 'GET',
          url: 'http://localhost:3001/get-user',
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
          });
      }
    
      getLoggedInUser();
    }, [])

    return(
        <div className='post'>
          {/* <div className='Avatar_symbol'>
            <Avatar/>
          </div>  */}

          <div className='text-body' key={index}>
            <div className='text-header'>
              <div className='text-name'>
                <h3>{post.authorFirstName} {post.authorLastName}</h3>
                <h3 className='username'>@{post.authorUsername}</h3>
                <button onClick={() => followPost(post._id, userData._id)}>Follow</button>
                <button onClick={() => reportPost(post._id, userData._id)} className='report-button'>Report</button>
                
                { userData.adminUser || post.authorId === userData._id ? <button onClick={() => deletePost(post._id)}>Delete</button> : null }
              </div>
    
              <div className='text-description' onClick={() => openPost(post._id, userData._id)}>
                <p className='post-content'>{post.content}</p>
                <img src={post ? post.imageUrl : TestImage} alt="" className='post-image'/>
              </div>
            </div>

            <div className="text-bottom">
              <div className="text-footer">
                <div className="footer-content">
                  <VisibilityIcon className='icon'/>
                  <span>{post.views} Views</span>

                  <ThumbUpIcon className='icon' onClick={() => likePost(post._id, userData._id)}/>
                  <span>{post.likes} Likes</span>

                  <ThumbDownIcon className='icon' onClick={() => dislikePost(post._id, userData._id)}/>
                  <span>{post.dislikes} Dislikes</span>
                  
                  <ModeCommentIcon className='icon' onClick={openComment}/>
                  <span>{post.comments} Comments</span>

                  <WarningAmberIcon className='icon'/>
                  <span>{post.reports} Compliants</span>

                  <AccessTimeIcon className='icon'/>
                  <span>{post.dateAndTime}</span>
                </div>
              </div>
            </div>

            {
              openComments ? 
              <div className="comments">
                <h2>Comments</h2>

                <CreateComment post={post} userData={userData}/>

                {commentData.map((comment) => {
                  return(
                    <div className='text-header' key={comment._id}>
                      <div className='text-name'>
                        <h3>{post.authorFirstName} {post.authorLastName}</h3>
                        <h3 className='username'>@{post.authorUsername}</h3>
                        <button onClick={() => followPost(comment._id, userData._id)}>Follow</button>
                        <button onClick={() => reportPost(comment._id, userData._id)} className='report-button'>Report</button>
                        
                        { userData.adminUser ? <button onClick={() => deletePost(post._id)}>Delete</button> : null }
                      </div>
            
                      <div className='text-description' onClick={() => openPost(post._id, userData._id)}>
                        <p className='post-content'>{comment.content}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
              :
              null
            }
          </div>
        </div>
    )
}

export default PostComponent;