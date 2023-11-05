import React, { useEffect, useState } from 'react';
import "./post.scss";
import axios from 'axios';
import Cookies from 'universal-cookie';

const cookies = new Cookies();
const token = cookies.get("TOKEN");

const Post = () => {
    const [warning, setWarning] = useState(false);
    const [text, setText] = useState('');
    const [mediaFiles, setMediaFiles] = useState([]);
    const [userData, setUserData] = useState();
    const [totalWordCount, setTotalWordCount] = useState();

    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 to the month to make it 1-based
    const day = currentDate.getDate().toString().padStart(2, '0');
    const hours = currentDate.getHours().toString().padStart(2, '0');
    const minutes = currentDate.getMinutes().toString().padStart(2, '0');
    const seconds = currentDate.getSeconds().toString().padStart(2, '0');
    const currentDateTimeString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    const handleTextChange = (inputText) => {
        setText(inputText);

        const wordCount = inputText.trim().split(/\s+/).length;
        setTotalWordCount(wordCount + calculateMediaWordCount());

        if (totalWordCount > 20) {
            setWarning(true);
        } else {
            setWarning(false);
        }
    };

    const handleFileUpload = (event) => {
        const files = event.target.files;

        // Filter only image and video files
        const filteredFiles = Array.from(files).filter(file =>
            file.type.includes('image/') || file.type.includes('video/')
        );

        setMediaFiles(filteredFiles);
        updateWordCount();
    };

    const updateWordCount = () => {
        const wordCount = text.trim().split(/\s+/).length;
        const totalWordCount = wordCount + calculateMediaWordCount();

        if (totalWordCount > 20) {
            setWarning(true);
        } else {
            setWarning(false);
        }
    };

    const calculateMediaWordCount = () => {
        let mediaWordCount = 0;

        mediaFiles.forEach(file => {
            if (file.type.includes('image/')) {
                mediaWordCount += 10; // Image equivalent to 10 words
            } else if (file.type.includes('video/')) {
                mediaWordCount += 15; // Video equivalent to 15 words
            }
        });

        return mediaWordCount;
    };

    const submitPost = () => {
        if(!warning){
            const configuration = {
                method: "POST",
                url: `http://localhost:3001/create-post`,
                data: {
                    content: text,
                    userFirstName: userData.firstName,
                    userLastName: userData.lastName,
                    username: userData.username,
                    wordCount: totalWordCount,
                    dateAndTime: currentDateTimeString,
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
    
            axios(configuration)
                .then((res) => {
                    console.log(res);
                    alert("Successfully made a post");
                })
                .catch((err) => {
                    err = new Error();
    
                    console.log(err);
                });
        }else{
            alert("Lower the amount of characters you have!");
        }
    }

    useEffect(() => {
        const configuration = {
            method: "GET",
            url: `http://localhost:3001/user`,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
    
        axios(configuration)
            .then((result) => {
                setUserData(result.data);
            })
            .catch((error) => {
                error = new Error();
                
                console.log(error);
            });
    }, []);

    return (
        <div className='Post'>
            <div className='text_body'>
                <div className='text_header'>
                    <div className='text_name'>
                        <h3>{userData ? `${userData.firstName} ${userData.lastName}` : 'John Doe'}</h3>
                        <h3>@{userData ? userData.username : 'johnDoe123'}</h3>
                    </div>

                    <div className='text_description'>
                        <form>
                            <div className="formgroup" style={{display: 'block'}}>
                                <textarea
                                    value={text}
                                    onChange={(e) => handleTextChange(e.target.value)}
                                    placeholder="Write your post here..."
                                    cols="138"
                                    rows={5}
                                />
                            </div>
                        </form>

                        <input type="file" onChange={handleFileUpload} accept="image/*, video/*" multiple />
                        {warning && <p style={{ color: 'red' }}>Warning: Exceeded word limit!</p>}

                        <button className='submit-button' onClick={submitPost}>Submit</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Post;
