const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('./auth.js');
const User = require('./models/User.js');
const Post = require('./models/Post.js');

const app = express();

app.use(express.json());
app.use(cors());
mongoose.connect('mongodb+srv://btjandra15:kZ2HglGxeMWfJj2h@csc322chitchat.zwl6xio.mongodb.net/Users?retryWrites=true&w=majority');

app.listen(3001, () => {
    console.log('Server running');
});

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
app.post('/create-post', auth, async(req, res) => {
    const { username, content } = req.body;
    const userId = req.user.userId;

    const newPost = Post({
        authorId: userId,
        author: username,
        content: content,
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
// Post Endpoints