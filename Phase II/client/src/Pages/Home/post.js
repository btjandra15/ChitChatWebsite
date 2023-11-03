import React, { useState } from 'react';
import "./post.scss";

const Post = () => {
    const [warning, setWarning] = useState(false);
    const [text, setText] = useState('');
    const [mediaFiles, setMediaFiles] = useState([]);

    const handleTextChange = (inputText) => {
        setText(inputText);

        const wordCount = inputText.trim().split(/\s+/).length;
        const totalWordCount = wordCount + calculateMediaWordCount();

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

    return (
        <div className='Post'>
            <div className='text_body'>
                <div className='text_header'>
                    <div className='text_name'>
                        <h3>John Doe </h3>
                        <h3>@JohnDoe</h3>
                    </div>
                    <div className='text_description'>
                        <textarea
                            value={text}
                            onChange={(e) => handleTextChange(e.target.value)}
                            placeholder="Write your post here..."
                        />
                        <input type="file" onChange={handleFileUpload} accept="image/*, video/*" multiple />
                        {warning && <p style={{ color: 'red' }}>Warning: Exceeded word limit!</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Post;
