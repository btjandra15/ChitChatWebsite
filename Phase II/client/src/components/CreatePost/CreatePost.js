import React, { useEffect, useState } from 'react';
import "./CreatePost.scss";
import axios from 'axios';
import Cookies from 'universal-cookie';
import InsertPhotoOutlinedIcon from '@mui/icons-material/InsertPhotoOutlined';
import GifBoxOutlinedIcon from '@mui/icons-material/GifBoxOutlined';
import EmojiEmotionsOutlinedIcon from '@mui/icons-material/EmojiEmotionsOutlined';
import S3FileUpload from 'react-s3';
import { Buffer } from 'buffer';

const cookies = new Cookies();
const token = cookies.get("TOKEN");
const currentDate = new Date();
const year = currentDate.getFullYear();
const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 to the month to make it 1-based
const day = currentDate.getDate().toString().padStart(2, '0');
const hours = currentDate.getHours().toString().padStart(2, '0');
const minutes = currentDate.getMinutes().toString().padStart(2, '0');
const seconds = currentDate.getSeconds().toString().padStart(2, '0');
const currentDateTimeString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

Buffer.from('anything', 'base64');
window.Buffer = window.Buffer || require('buffer').Buffer;

const CreatePost = () => {
    const [ warning, setWarning ] = useState(false);
    const [ text, setText ] = useState('');
    const [ mediaFiles, setMediaFiles ] = useState([]);
    const [ userData, setUserData ] = useState();
    const [ totalWordCount, setTotalWordCount ] = useState();
    const [ selectKeyWords, setSelectedKeyWords ] = useState([]);
    const [ inputValue, setInputValue ] = useState('');

    const config = {
        bucketName: 'chitchatwebsite',
        region: 'us-east-1',
        accessKeyId: 'AKIA5IQUIWIGA23UHNFQ',
        secretAccessKey: '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',
    }

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

    const handleKeywordsChange = (e) => {
        setInputValue(e.target.value);
    }

    const handleAddKeyword = () => {
        if(inputValue.trim() !== ''){
            if(selectKeyWords.length > 2){
                alert("Too many tags!");
            }else{
                setSelectedKeyWords([...selectKeyWords, inputValue]);
                setInputValue('');
            }
        }
    }

    const handleFileUpload = (event) => {
        const files = event.target.files;

        // Filter only image and video files
        const filteredFiles = Array.from(files).filter(file =>
            file.type.includes('image/') || file.type.includes('video/')
        );

        setMediaFiles(filteredFiles);
        updateWordCount();

        S3FileUpload
            .uploadFile(mediaFiles, config)
            .then((data) => {
                console.log(data);
                alert("Successfully uploaded image");
            })
            .catch((err) => {
                console.error(err);
            })
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
                    keywords: selectKeyWords,
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
                                <input
                                    value={text}
                                    onChange={(e) => handleTextChange(e.target.value)}
                                    placeholder="Spill the Tea ☕ What's the latest buzz in your world of chitchat?"
                                    cols="138"
                                    rows={5}
                                />
                            </div>
                        </form>

                        <div className="post_bottom">
                            <div className="post_icons">
                                <label className="media_upload">
                                    <input type="file" className="image_input" onChange={handleFileUpload} accept="image/*, video/*" multiple />
                                    {warning && <p style={{ color: 'red' }}>Warning: Exceeded word limit!</p>}
                                    <InsertPhotoOutlinedIcon className='icon'/>
                                </label>
                                
                                <label className="gif">
                                    <GifBoxOutlinedIcon className='icon'/>
                                </label>

                                <label className="emoji">
                                    <EmojiEmotionsOutlinedIcon className='icon'/>
                                </label>

                                <span>Keywords: </span>
                                <input type="text" value={inputValue} onChange={handleKeywordsChange} placeholder='Type keywords...'/>
                                <button onClick={handleAddKeyword}>Add keyword</button>

                                <ul>
                                    {selectKeyWords.map((item, index) => {
                                        return(
                                            <ul key={index}>{item}</ul>
                                        )
                                    })}
                                </ul>
                            </div>
                            
                            <button className='post_button' onClick={submitPost}>Post</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreatePost;
