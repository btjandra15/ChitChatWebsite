import React, { useEffect, useRef, useState } from 'react';
import "./CreatePost.scss";
import axios from 'axios';
import Cookies from 'universal-cookie';
import InsertPhotoOutlinedIcon from '@mui/icons-material/InsertPhotoOutlined';
import GifBoxOutlinedIcon from '@mui/icons-material/GifBoxOutlined';
import EmojiEmotionsOutlinedIcon from '@mui/icons-material/EmojiEmotionsOutlined';
import { updateUser } from '../../utils/updateUser';

const cookies = new Cookies();
const token = cookies.get("TOKEN");
const currentDate = new Date();
const year = currentDate.getFullYear();
const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 to the month to make it 1-based
const day = currentDate.getDate().toString().padStart(2, '0');
let hours = currentDate.getHours();
const ampm = hours >= 12 ? 'PM' : 'AM';

hours = hours % 12;
hours = hours || 12;

const minutes = currentDate.getMinutes().toString().padStart(2, '0');
const seconds = currentDate.getSeconds().toString().padStart(2, '0');

const currentDateTimeString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds} ${ampm}`;

const CreatePost = () => {
    const [ warning, setWarning ] = useState(false);
    const [ text, setText ] = useState('');
    const [ userData, setUserData ] = useState();
    const [ totalWordCount, setTotalWordCount ] = useState();
    const [ selectKeyWords, setSelectedKeyWords ] = useState([]);
    const [ inputValue, setInputValue ] = useState('');
    const [ file, setFile ] = useState(null);
    const [ videoFile, setVideoFile ] = useState(null);

    const inputRef = useRef(null);

    const handleTextChange = (inputText) => {
        setText(inputText);

        const wordCount = inputText.trim().split(/\s+/).length;
        setTotalWordCount(wordCount);
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

    const selectFile = (e) => {
        const file = e.target.files[0];

        if(file.type.includes('image')){
            setFile(file);
            setVideoFile(null);
        }else if(file.type.includes('video')){
            setVideoFile(file);
            setFile(null);
        }
    }

    const submitPost = async() => {
        // // Define your list of taboo words
        // const tabooWords = ['fuck', 'shit', 'ass']; // Update this list with your actual taboo words
    
        // // Function to replace taboo words with asterisks
        // const replaceTabooWords = (text, tabooWords) => {
        //     let tabooCount = 0;
        //     let processedText = text;
    
        //     tabooWords.forEach(word => {
        //         const regex = new RegExp(`\\b${word}\\b`, 'gi');
        //         if (processedText.match(regex)) {
        //             tabooCount++;
        //             if (tabooCount <= 2) {
        //                 processedText = processedText.replace(regex, '*');
        //             }
        //         }
        //     });
    
        //     return { processedText, tabooCount };
        // };
    
        // // Process the text to handle taboo words
        // const { processedText, tabooCount } = replaceTabooWords(text, tabooWords);
    
        // // Check if there are more than two taboo words
        // if (tabooCount > 2) {
        //     alert("Post contains too many taboo words!");

        //     const warningCount = userData.warningCount;

        //     axios.put(`http://localhost:3001/update-user/${userData._id}`, { fieldToUpdate: 'warningCount', newValue: warningCount + 1 })
        //         .then(() => {
        //             console.log("Successfuly updated user");
        //         })
        //         .catch((err) => {
        //             console.error(`Error updating User: ${err}`);
        //         });

        //     return;
        // }

        // Fetch taboo words from the server
        const fetchTabooWords = async () => {
            try {
            const response = await axios.get('http://localhost:3001/get-all-taboo-words');
            return response.data;
            } catch (error) {
            console.error('Error fetching taboo words:', error);
            return [];
            }
        };

        // Fetch taboo words
        const tabooWords = await fetchTabooWords();

        const replaceTabooWords = (text, tabooWords) => {
            let processedText = text;
            let tabooCount = 0;
          
            tabooWords.forEach((word) => {
              const regex = new RegExp(`\\b${word.word}\\b`, 'gi');
              const matches = processedText.match(regex);
          
              if (matches) {
                // Increment tabooCount only once for each unique taboo word
                tabooCount += matches.length;
              }
          
              processedText = processedText.replace(regex, '*');
            });
          
            return { processedText, tabooCount };
          };
          
          // Process the text to handle taboo words
          const { processedText, tabooCount } = replaceTabooWords(text, tabooWords);
          
          // Check if there are two or more taboo words
          if (tabooCount > 2) {
            alert('Post contains too many taboo words!');
          
            // Issue a warning to the user
            const warningCount = userData.warningCount;
          
            axios
              .put(`http://localhost:3001/update-user/${userData._id}`, {
                fieldToUpdate: 'warningCount',
                newValue: warningCount + 1,
              })
              .then(() => {
                console.log('Successfully updated user');
              })
              .catch((err) => {
                console.error(`Error updating User: ${err}`);
              });
          
            // Block the message and return
            return;
          }
    
        if(text === ""){
            alert("Please enter a caption!");
            return;
        }
        
        if (file){
            setTotalWordCount(totalWordCount + 10);
        }else if(videoFile){
            setTotalWordCount(totalWordCount + 15);
        }

        let totalCost = 0;

        if(totalWordCount > 20){
            if(userData.balance <= 0){
                updateUser(userData._id, 'warningCount', userData.warningCount + 1);
                window.location.href = '/payment';
            }
            
            if(userData.userType === 'Corporate User'){
                totalCost = userData.chargesAmount + (totalWordCount * 1);
            }else{
                totalCost = userData.chargesAmount + ((totalWordCount - 20) * 0.1);
            }

            updateUser(userData._id, 'chargesAmount', totalCost)
        }

        const formData = new FormData();

        formData.append('userFirstName', userData.firstName);
        formData.append('userLastName', userData.lastName);
        formData.append('username', userData.username);
        formData.append("content", processedText);

        if (file) {
            formData.append("media", file);
        }else if(videoFile){
            formData.append('media', videoFile);
        }
        
        formData.append("keywords", selectKeyWords.join(','));
        formData.append('dateAndTime', currentDateTimeString);
        formData.append("wordCount", totalWordCount);

        await axios.post('http://localhost:3001/create-post', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(() => {
            alert("Successfully made a post");
            window.location.reload(false);
        });
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
                                    <input type="file" accept='image/*, video/*' ref={inputRef} style={{display: 'none'}} onChange={selectFile}/>
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
                                <input type="text" value={inputValue} onChange={handleKeywordsChange} placeholder='Type keywords...' className='keywords-input'/>
                                <button onClick={handleAddKeyword}>Add keyword</button>

                                <ul>
                                    {selectKeyWords.map((item, index) => {
                                        return(
                                            <ul key={index}>{item}</ul>
                                        )
                                    })}
                                </ul>

                                {
                                    file || videoFile ?
                                    <p>Uploaded image successfully</p>
                                    :
                                    null
                                }
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