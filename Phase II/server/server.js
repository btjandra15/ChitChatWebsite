const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('./auth.js');
const User = require('./models/User.js');
const Post = require('./models/Post.js');
const dotenv = require('dotenv');
const app = express();

dotenv.config();
app.use(express.json());
app.use(cors());
mongoose.connect(process.env.MONGODB_URI);

app.listen(3001, () => {
    console.log('Server running');
});

const checkForTabooWords = (content) => {
    const tabooWords = ['fuck', 'word2', 'word3'];
    const contentWithoutSpaces = content.replace(/\s+/g, '').toLowerCase(); // Remove all spaces and convert to lowercase
    const foundTabooWord = tabooWords.some(word => contentWithoutSpaces.includes(word));
    return foundTabooWord;
};


// User Endpoints
app.post('/register', (req, res) => {
    const { firstName, lastName, username, email, password } = req.body;

    User.findOne({ $or: [{ email: email }, { username: username }]})
        .then((existingUser) => {
            if(existingUser) return res.status(409).send({ message: "User with the following email & user already exists" });

            bcrypt
                .hash(password, 10)
                .then((hashedPassword) => {
                    const user = new User({
                        firstName: firstName,
                        lastName: lastName,
                        username: username,
                        email: email,
                        password: hashedPassword
                    });

                    user
                        .save()
                        .then((result) => {
                            res.status(201).send({message: "User created Successfully", result});
                        })
                        .catch((error) => {
                            res.status(500).send({message: "Error creating user", error});
                        });
            })
            .catch((e) => {
                res.status(500).send({message: "Password not hashed succesfully", e})
            });
        });
});

app.post('/login', (req, res) => {
    User.findOne({email: req.body.email})
        .then((user) => {
            bcrypt.compare(req.body.password, user.password)
            .then((passwordCheck) => {
                if(!passwordCheck){
                    return res.status(400).send({message: "Password do not match"});
                };

                const token = jwt.sign(
                    {
                        userId: user._id,
                        userEmail: user.email,
                    },
                    "RANDOM-TOKEN",
                    { expiresIn: "24h"}
                )

                res.status(200).send({
                    message: "Login Successful",
                    email: user.email,
                    token
                });
            })
            .catch((e) => {
                res.status(400).send({
                    messsage: "Passwords do not match", 
                    e
                });
            });
        })
        .catch((e) => {
            res.status(404).send({
                message: "Email not found", 
                e
            });
        });
});

app.get("/free-endpoint", (req, res) => {
    res.json({message: "Free to access this endpoint at any time"})
});

app.get('/user', auth, (req, res) => {
    const userId = req.user.userId;

    User.findById(userId)
        .then(user => {
            if(!user) return res.status(404).json({message: "User not found."});

            res.status(200).json(user);
        })
        .catch(error => {
            res.status(500).json({message: `Error ${error.message}`});
        })
})
// User Endpoints

// Post Endpoints
app.post('/create-post', auth, (req, res) => {
    const { userFirstName, userLastName, username, content, wordCount, dateAndTime } = req.body;
    const userId = req.user.userId;

    const newPost = Post({
        authorId: userId,
        authorFirstName: userFirstName,
        authorLastName: userLastName,
        authorUsername: username,
        content: content,
        wordCount: wordCount,
        dateAndTime: dateAndTime,
    });

    newPost
        .save()
        .then((result) => {
            res.status(201).send({message: "Post created sucessfully", result});
        })
        .catch((error) => {
            res.status(500).send({message: "Error creating post", error});
        });
});

app.get('/get-post', async(req, res) => {
    try {
        // Use the `find` method and `await` the result
        const posts = await Post.find({}).exec();
    
        // Send the retrieved posts as a JSON response
        res.json(posts);
      } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving posts from the database');
      }
});

<<<<<<< Updated upstream
=======
//Gets top 3 liked posts
app.get('/get-top-liked-post', async(req, res) => {
    try{
        const topLikePosts = await Post.find().sort({ 'likes': -1 }).limit(3);

        res.status(200).json(topLikePosts);
    }catch(err){
        res.status(500).json({ message: `Error: ${err.message}` });
    }
})

// Creates new post
app.post('/create-post', auth, async (req, res) => {
    try {
        const { userFirstName, userLastName, username, content, wordCount, dateAndTime, keywords } = req.body;
        const userId = req.user.userId;

        const containsTabooWords = checkForTabooWords(content);

        if (containsTabooWords) {
            // Log a message to the console
            console.log('Taboo words detected in the post:', containsTabooWords);

            // Additional actions you wish to perform
            // For example, you can send an error response with the taboo words
            return res.status(400).json({ message: "Post contains taboo words and is not allowed.", tabooWords: containsTabooWords });
        }

        const newPost = new Post({
            authorId: userId,
            authorFirstName: userFirstName,
            authorLastName: userLastName,
            authorUsername: username,
            content: content,
            wordCount: wordCount,
            dateAndTime: dateAndTime,
            keywords: keywords,
        });

        const result = await newPost.save();
        res.status(201).json({ message: "Post created successfully", result });
    } catch (error) {
        console.error('Error in create-post route:', error);
        res.status(500).json({ message: "Error creating post", error });
    }
});





//Adds +1 to views field in the post document in the database
app.post('/view-post' , async(req, res) => {
    const { postId, userId } = req.body;

    try{
        const post = await Post.findOne({ _id: postId });

        if(!post) return res.status(404).json({ message: 'Post not found' });

        post.views++;

        await post.save();

        res.json({ message: 'Post viewed successfully', views: post.views });
    }catch(err){
        console.error(err);
        res.status(500).json({ message: 'An error occurred while processing your request' });
    }
});

//Adds +1 to likes field in the post document in the database
>>>>>>> Stashed changes
app.post('/like-post', async(req, res) => {
    const { postId, userId } = req.body;

    try {
        const post = await Post.findOne({ _id: postId });
    
        if (!post) {
          return res.status(404).json({ message: 'Post not found' });
        }

        if(post.userLiked.includes(userId)) return res.status(400).json({message:'User already liked the post'});
    
        post.userLiked.push(userId);
        post.likes++;
        
        await post.save();
    
        res.json({ message: 'Post liked successfully!', likes: post.likes });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while processing your request' });
      }
});
// Post Endpoints