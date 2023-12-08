import React, { useEffect, useState } from "react";
import "./PostComponent.scss";
import axios from "axios";
import Cookies from "universal-cookie";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import VisibilityIcon from "@mui/icons-material/Visibility";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import TestImage from "../../images/cityBackground.jpg";
import ModeCommentIcon from "@mui/icons-material/ModeComment";
import CreateComment from "../CreateComment/CreateComment";
import ReportModal from "./ReportModal";
import { Link } from "react-router-dom";

// For generating random id for Surfer
const { v4: uuidv4 } = require("uuid");

const cookies = new Cookies();
const token = cookies.get("TOKEN");

const PostComponent = ({ post, index }) => {
  const [userData, setUserData] = useState([]);
  const [postData, setPostData] = useState([]);
  const [commentData, setCommentData] = useState([]);
  const [openComments, setOpenComments] = useState(false);
  const [isReportModalOpen, setReportModalOpen] = useState(false);

  const generateRandomId = (userData) => {
    let newId;

    // Generate a new id until it is not in userData
    do {
      newId = uuidv4();
    } while (userData.some((user) => user._id === newId));

    return newId;
  };

  // Function to call the backend and deduct balance
  const deductBalance = async (userId, amount) => {
    try {
      // Call to the backend to deduct amount from user's balance
      const response = await axios.put(
        `http://localhost:3001/update-user-balance/${userId}`,
        {
          amount: -amount, // send a negative value for deduction
        }
      );

      if (response.status === 200) {
        console.log("Balance deduction successful:", response.data);
        return response.data; // The updated user data is returned
      } else {
        throw new Error(
          `Failed to deduct balance: Status code ${response.status}`
        );
      }
    } catch (error) {
      console.error(
        "Error in deductBalance:",
        error.response ? error.response.data : error.message
      );
      throw error; // Rethrow the error to be handled by the calling function
    }
  };

  const handleDeductBalanceClick = async (event, postId, userId) => {
    event.preventDefault(); // Stop the default anchor link behavior

    try {
      const authorResponse = await axios.get(
        `http://localhost:3001/get-user/${post.authorId}`
      );
      const authorId = authorResponse.data._id;
      // deduct the balance
      await deductBalance(authorId, 0.1); // Deduct $0.1
      // If successful, open the job link in a new tab
      window.open(post.jobLink, "_blank");
    } catch (error) {
      // Handle errors (e.g., insufficient balance, network error, etc.)
      alert("There was a problem deducting the balance. Please try again.");
    }
  };

  const handleReportClick = () => {
    if (userData._id === post.authorId) {
      setReportModalOpen(false);
      window.alert("You can't report your own post!");
    } else {
      setReportModalOpen(true);
    }
  };

  const handleCloseReportModal = () => {
    setReportModalOpen(false);
  };

  const handleReportSubmit = (reason) => {
    console.log(`Report reason: ${reason}`);

    // Check if userData._id is null, generate a random id if necessary
    const initiatorId = userData._id || generateRandomId(userData);
    // Check if userData.username is null, initialize initiatorUsername to "Surfer"
    const initiatorUsername = userData.username || "Surfer";
    const receiverId = post.authorId;
    const receiverUsername = post.authorUsername;
    const postId = post._id;
    const content = post.content;

    // Create post complaint
    const createPostComplaint = async () => {
      try {
        await axios.post("http://localhost:3001/create-post-complaint", {
          initiatorId,
          initiatorUsername,
          receiverId,
          receiverUsername,
          postId,
          content,
          reason,
        });

        alert("You have successfully reported this post!");

        setPostData((prevData) => {
          const updatedData = [...prevData];
          const postIndex = updatedData.findIndex((p) => p._id === postId);

          if (postIndex !== -1) updatedData[postIndex].reports++;

          return updatedData;
        });
      } catch (error) {
        alert("An error occurred while reporting this post!");
        console.error(error);
      }

      try {
        // Assuming postId and receiverId are available
        await axios.post(
          `http://localhost:3001/add-warning-count-to-receiver/${receiverId}`,
          {
            reason: reason,
          }
        );
      } catch (error) {
        console.error("Error updating user warning count:", error);
      }
    };

    // Report the post and create a post complaint
    axios
      .post("http://localhost:3001/report-post", { postId, initiatorId })
      .then(() => createPostComplaint())
      .catch((err) => {
        alert("You have already reported this post!");
        console.log(err);
      });

    handleCloseReportModal();
  };

  const openPost = (postId, userId) => {
    axios
      .post(`http://localhost:3001/view-post`, { postId, userId })
      .then(() => {
        setPostData((prevData) => {
          const updatedData = [...prevData];
          const postIndex = updatedData.findIndex(
            (post) => post._id === postId
          );

          if (postIndex !== -1) updatedData[postIndex].views++;

          return updatedData;
        });
      })
      .catch((err) => {
        console.error("User already viewed this post");
      });
  };

  const likePost = (postId, userId) => {
    if (
      postData.some(
        (post) => post._id === postId && post.userLiked.includes(userId)
      )
    ) {
      // If the user has already liked the post, you can choose to do nothing or show a message
      console.log("User has already liked the post.");
      return;
    }

    axios
      .post(`http://localhost:3001/like-post`, { postId, userId })
      .then(() => {
        alert("You successfully liked this post!");

        setPostData((prevData) => {
          const updatedData = [...prevData];
          const postIndex = updatedData.findIndex(
            (post) => post._id === postId
          );

          if (postIndex !== -1) updatedData[postIndex].likes++;

          return updatedData;
        });
      })
      .catch((err) => {
        alert("You already liked this post!");
        console.log(err);
      });
  };

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
      })
      .catch((err) => {
        alert("You already followed this post!");
        console.log(err);
      });

    alert("You have successfully followed this post!");
  };

  const reportPost = (postId, userId) => {
    if (
      postData.some(
        (post) => post._id === postId && post.userReported.includes(userId)
      )
    ) {
      // If the user has already liked the post, you can choose to do nothing or show a message
      console.log("User has already liked the post.");
      return;
    }

    axios
      .post(`http://localhost:3001/report-post`, { postId, userId })
      .then(() => {
        alert("You have successfully reported this post!");

        setPostData((prevData) => {
          const updatedData = [...prevData];
          const postIndex = updatedData.findIndex(
            (post) => post._id === postId
          );

          if (postIndex !== -1) updatedData[postIndex].reports++;

          return updatedData;
        });
      })
      .catch((err) => {
        alert("You already reported this post!");
        console.log(err);
      });
  };

  const dislikePost = (postId, userId) => {
    if (
      postData.some(
        (post) => post._id === postId && post.userLiked.includes(userId)
      )
    ) {
      // If the user has already liked the post
      console.log("User has already liked the post.");
      return;
    }

    axios
      .post(`http://localhost:3001/dislike-post`, { postId, userId })
      .then(() => {
        alert("You successfully disliked this post!");

        setPostData((prevData) => {
          const updatedData = [...prevData];
          const postIndex = updatedData.findIndex(
            (post) => post._id === postId
          );

          if (postIndex !== -1) updatedData[postIndex].dislikes++;

          return updatedData;
        });
      })
      .catch((err) => {
        alert("You already disliked this post!");
        console.log(err);
      });
  };

  const deletePost = async (postId) => {
    try {
      if (userData.adminUser || userData._id === post.authorId) {
        const response = await fetch(
          `http://localhost:3001/delete-post/${postId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          // Handle non-successful responses (e.g., show an error message)
          const errorData = await response.json();
          console.error("Error deleting post:", errorData.message);
        } else {
          // Handle successful response (e.g., update UI)
          console.log("Post deleted successfully");
        }
      } else {
        console.error("NO PERMISSION");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const openComment = () => {
    setOpenComments((prevOpenComments) => !prevOpenComments);
  
    // Only fetch comments if we're about to open the comment section
    if (!openComments) {
      axios.get(`http://localhost:3001/get-comments-for-post/${post._id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the authorization token if your endpoint is protected
        },
      })
      .then((res) => {
        setCommentData(res.data); 
      })
      .catch((err) => {
        console.error("Error fetching comments:", err);
      });
    }
  };  
  

  useEffect(() => {
    const getLoggedInUser = () => {
      const userConfig = {
        method: "GET",
        url: "http://localhost:3001/get-user",
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
    };

    getLoggedInUser();
  }, []);

  return (
    <div className="post">
      <div className="text-body" key={index}>
        <div className="text-header">
          <div className="text-name">
            <h3>
              <Link to={`/profile/${post.authorUsername}`} className="profile-link">
                {post.authorFirstName} {post.authorLastName}
              </Link>
            </h3>
            <h3 className="username">@{post.authorUsername}</h3>
            <button onClick={() => followPost(post._id, userData._id)}>
              Follow
            </button>
            <button onClick={handleReportClick} className="report-button">
              Report
            </button>
            <ReportModal
              isOpen={isReportModalOpen}
              onClose={handleCloseReportModal}
              onSubmit={handleReportSubmit}
            />

            {userData.adminUser || post.authorId === userData._id ? (
              <button onClick={() => deletePost(post._id)}>Delete</button>
            ) : null}
          </div>

          <div
            className="text-description"
            onClick={() => openPost(post._id, userData._id)}
          >
            <p className="post-content">{post.content}</p>
            {post.jobPost === true && (
              <a
                href={post.jobLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(event) =>
                  handleDeductBalanceClick(event, post._id, userData._id)
                }
              >
                {post.jobLink}
              </a>
            )}

            {post.imageUrl && (
              <div className="post-image">
                {post.imageUrl != null ? (
                  <img
                    src={post ? post.imageUrl : TestImage}
                    alt=""
                    className="post-image"
                  />
                ) : (
                  <div></div>
                )}
              </div>
            )}

            {post.videoUrl != null ? (
              <video controls width="800" height="500" className="video-player">
                <source src={post.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <div></div>
            )}

            {/* Display keywords if they exist */}
            {post.keywords && post.keywords[0] !== "" && (
              <div className="keywords">
                {post.keywords.map((keyword, index) => (
                  <span key={index}>
                    {index > 0 && " "}{" "}
                    {/* Add comma and space for each keyword except the first one */}
                    #{keyword.trim()}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="text-bottom">
          <div className="text-footer">
            <div className="footer-content">
              <VisibilityIcon className="icon" />
              <span>{post.views} Views</span>

              <ThumbUpIcon
                className="icon"
                onClick={() => likePost(post._id, userData._id)}
              />
              <span>{post.likes} Likes</span>

              <ThumbDownIcon
                className="icon"
                onClick={() => dislikePost(post._id, userData._id)}
              />
              <span>{post.dislikes} Dislikes</span>

              <ModeCommentIcon className="icon" onClick={openComment} />
              <span>Comments</span>

              <WarningAmberIcon className="icon" />
              <span>{post.reports} Compliants</span>

              <AccessTimeIcon className="icon" />
              <span>{post.dateAndTime}</span>
            </div>
          </div>
        </div>

        {openComments ? (
          <div className="comments">
            <h2>Comments</h2>

            <CreateComment post={post} userData={userData} />

            {commentData.map((comment) => {
              return (
                <div className="text-header" key={comment._id}>
                  <div className="text-name">
                    <h3>
                      {comment.firstname} {comment.lastname}
                    </h3>
                    <h3 className="username">@{comment.authorUsername}</h3>
                    <button
                      onClick={() => followPost(comment._id, userData._id)}
                    >
                      Follow
                    </button>
                    <button
                      onClick={handleReportClick}
                      className="report-button"
                    >
                      Report
                    </button>
                    <ReportModal
                      isOpen={isReportModalOpen}
                      onClose={handleCloseReportModal}
                      onSubmit={handleReportSubmit}
                    />

                    {userData.adminUser ? (
                      <button onClick={() => deletePost(post._id)}>
                        Delete
                      </button>
                    ) : null}
                  </div>

                  <div
                    className="text-description"
                    onClick={() => openPost(post._id, userData._id)}
                  >
                    <p className="post-content">{comment.content}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default PostComponent;