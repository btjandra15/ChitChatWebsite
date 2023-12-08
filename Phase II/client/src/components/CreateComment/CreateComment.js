import React, { useEffect, useState } from 'react';
import "./CreateComment.scss";
import axios from 'axios';
import Cookies from 'universal-cookie';

const cookies = new Cookies();
const token = cookies.get("TOKEN");

const CreateComment = ({post}) => {
    const [ warning, setWarning ] = useState(false);
    const [ text, setText ] = useState('');
    const [ userData, setUserData ] = useState();
    const [ totalWordCount, setTotalWordCount ] = useState();

    const handleTextChange = (inputText) => {
        setText(inputText);

        const wordCount = inputText.trim().split(/\s+/).length;
        setTotalWordCount(wordCount);

        if (totalWordCount > 20) {
            setWarning(true);
        } else {
            setWarning(false);
        }
    };

    const submitComment = async() => {
        // Define your list of taboo words
        const tabooWords = ['fuck', 'shit', 'ass']; 
    
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

        // Configuration for the POST request
        const configuration = {
            method: "POST",
            url: `http://localhost:3001/create-comment`,
            data: {
                postId: post._id,
                content: processedText, // Sending the processed text
            },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
    
        // Making the POST request to submit the post
        axios(configuration)
            .then((res) => {
                console.log(res);
                alert("Successfully made a comment");
            })
            .catch((err) => {
                if (err.response && err.response.status === 400 && err.response.data.tabooWords) {
                    // Handle taboo words error
                    const tabooWords = err.response.data.tabooWords;
                    alert(`Comment contains taboo words: ${tabooWords}`);
                } else {
                    // Handle other errors
                    console.log(err);
                    alert("Error creating comment");
                }
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
                            <button className='post_button' onClick={submitComment}>Comment</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateComment;
