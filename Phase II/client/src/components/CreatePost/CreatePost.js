import React, { useEffect, useRef, useState } from 'react';
import "./CreatePost.scss";
import axios from 'axios';
import Cookies from 'universal-cookie';
import InsertPhotoOutlinedIcon from '@mui/icons-material/InsertPhotoOutlined';
import GifBoxOutlinedIcon from '@mui/icons-material/GifBoxOutlined';
import EmojiEmotionsOutlinedIcon from '@mui/icons-material/EmojiEmotionsOutlined';
import CropperImage from '../CropperImage/CropperImage';

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

const CreatePost = () => {
    const [ warning, setWarning ] = useState(false);
    const [ text, setText ] = useState('');
    const [ mediaFiles, setMediaFiles ] = useState([]);
    const [ userData, setUserData ] = useState();
    const [ totalWordCount, setTotalWordCount ] = useState();
    const [ selectKeyWords, setSelectedKeyWords ] = useState([]);
    const [ inputValue, setInputValue ] = useState('');
    const [ image, setImage ] = useState(null);
    const inputRef = useRef(null);

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

    const onSelectFile = (e) => {
        if(e.target.files && e.target.files.length > 0){
            const reader = new FileReader()

            reader.readAsDataURL(e.target.files[0]);

            reader.addEventListener('load', () => {
                console.log(reader.result);
                setImage(reader.result);
            })
        }
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

    const submitPost = async() => {
        // Define your list of taboo words
        const tabooWords = ['fuck', 'shit', 'ass']; // Update this list with your actual taboo words
    
        // Function to replace taboo words with asterisks
        const replaceTabooWords = (text, tabooWords) => {
            let tabooCount = 0;
            let processedText = text;
    
            tabooWords.forEach(word => {
                const regex = new RegExp(`\\b${word}\\b`, 'gi');
                if (processedText.match(regex)) {
                    tabooCount++;
                    if (tabooCount <= 2) {
                        processedText = processedText.replace(regex, '*');
                    }
                }
            });
    
            return { processedText, tabooCount };
        };
    
        // Process the text to handle taboo words
        const { processedText, tabooCount } = replaceTabooWords(text, tabooWords);
    
        // Check if there are more than two taboo words
        if (tabooCount > 2) {
            alert("Post contains too many taboo words!");

            const warningCount = userData.warningCount;

            axios.put(`http://localhost:3001/update-user/${userData._id}`, { fieldToUpdate: 'warningCount', newValue: warningCount + 1 })
                .then(() => {
                    console.log("Successfuly updated user");
                })
                .catch((err) => {
                    console.error(`Error updating User: ${err}`);
                });

            return;
        }
    
        // Check for word count limit
        if (warning) {
            alert("Lower the amount of characters you have!");
            return;
        }

        if(text === ""){
            alert("Please enter a caption!");
            return;
        }
        
        if(!image){
            alert("Please select an image!");
            return;
        }

    
        // // Configuration for the POST request
        // const configuration = {
        //     method: "POST",
        //     url: `http://localhost:3001/create-post`,
        //     data: {
        //         content: processedText, // Sending the processed text
        //         userFirstName: userData.firstName,
        //         userLastName: userData.lastName,
        //         username: userData.username,
        //         wordCount: totalWordCount,
        //         dateAndTime: currentDateTimeString,
        //         keywords: selectKeyWords,
        //     },
        //     headers: {
        //         Authorization: `Bearer ${token}`,
        //     },
        // };
    
        // // Making the POST request to submit the post
        // axios(configuration)
        //     .then((res) => {
        //         console.log(res);
        //         alert("Successfully made a post");
        //     })
        //     .catch((err) => {
        //         if (err.response && err.response.status === 400 && err.response.data.tabooWords) {
        //             // Handle taboo words error
        //             const tabooWords = err.response.data.tabooWords;
        //             alert(`Post contains taboo words: ${tabooWords}`);
        //         } else {
        //             // Handle other errors
        //             console.log(err);
        //             alert("Error creating post");
        //         }
        //     });
    };
    
    useEffect(() => {
        const configuration = {
            method: "GET",
            url: `http://localhost:3001/get-user`,
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
                                    <input type="file" accept='image/*' ref={inputRef} style={{display: 'none'}} onChange={onSelectFile}/>
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
