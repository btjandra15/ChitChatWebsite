const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('./auth.js');
const User = require('./models/User.js');
const Post = require('./models/Post.js');
const dotenv = require('dotenv');
const path = require('path');
const reactViews = require('express-react-views');
const app = express();
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Generate a random secure string (32 bytes)
const JWT_SECRET = crypto.randomBytes(32).toString('hex');


dotenv.config();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

// Set up the view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jsx');
app.engine('jsx', reactViews.createEngine());


const updateCollection = async() => {
    try{
        const users = await User.find();
        const posts = await Post.find();

        for(const user of users){
            await user.save();
        }

        for(const post of posts){
            await post.save();
        }

        console.log("Users updated successfully | Posts updated successfully");
    }catch(err){
        console.error("Error updating collection", err);
    }finally{
        mongoose.connection.close();
    }
};

mongoose.connect(process.env.MONGODB_URI);

//THIS FUNCTION IS TO UPDATE THE USER'S DOUCEMENT WITH THE MOST RECENT USER SCHEMA
//USE THIS COMMAND IF YOU NEED TO UPDATE THE USER DOUCEMENTS 
// updateCollection();

const checkForTabooWords = (content) => {
    const tabooWords = ['fuck', 'word2', 'word3'];
    const contentWithoutSpaces = content.replace(/\s+/g, '').toLowerCase(); // Remove all spaces and convert to lowercase
    const foundTabooWord = tabooWords.some(word => contentWithoutSpaces.includes(word));
    return foundTabooWord;
};

const generateRandomPassword = (length = 20) => {
    const charSet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    let password = "";

    for(let i = 0; i < length; i++){
        const randomIndex = Math.floor(Math.random() * charSet.length);
        password += charSet.charAt(randomIndex);
    }

    return password;
};

app.listen(3001, () => {
    console.log(`Server running`);
});

// User Endpoints
//Gets all the users from the database
app.get('/get-all-users', (req, res) => {
    User.find()
        .then(users => {
            res.status(200).json(users);
        }) 
        .catch(err => {
            res.status(500).json({message: `Error: ${err}`});
        });
});

//Fetch user profile details
app.get('/api/user/profile/:userId', (req, res) => {
    const userId = req.params.userId;

    User.findById(userId)
        .then(user => {
            if (!user) return res.status(404).json({ message: "User not found." });

            res.status(200).json(user);
        })
        .catch(error => {
            res.status(500).json({ message: `Error ${error.message}` });
        });
});

// Gets users who haven't set their passwords
app.get('/users-not-reset-password', async (req, res) => {
    try {
        const usersNotResetPassword = await User.find({ passwordReset: false });
        res.status(200).json(usersNotResetPassword);
    } catch (err) {
        res.status(500).json({ message: `Error: ${err.message}` });
    }
});

// Gets users who have set their passwords
app.get('/users-reset-password', async (req, res) => {
    try {
        const usersResetPassword = await User.find({ passwordReset: true });
        res.status(200).json(usersResetPassword);
    } catch (err) {
        res.status(500).json({ message: `Error: ${err.message}` });
    }
});

//Gets a specific user by ID
app.get('/get-user', auth, (req, res) => {
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

//Gets all trendy users
app.get('/get-trendy-users', async(req, res) => {
    try{
        const trendyUsers = await User.find({userType: 'Trendy User'});

        res.status(200).json(trendyUsers);
    }catch(err) {
        res.status(500).json({message: `Error: ${err.message}`});
    }
});

//Creates new user
app.post('/register', (req, res) => {
    const { firstName, lastName, username, email, password, selectedUserType } = req.body;
    const randomPassword = generateRandomPassword();

    User.findOne({ $or: [{ email: email }, { username: username }]})
        .then((existingUser) => {
            if(existingUser) return res.status(409).send({ message: "User with the following email & user already exists" });

            const user = new User({
                firstName: firstName,
                lastName: lastName,
                username: username,
                email: email,
                password: randomPassword,
                userType: selectedUserType,
                balance: 5000
            });

            user.save()
                .then((result) => {

                    res.status(201).send({message: "User created Successfully", result});
                })
                .catch((error) => {
                    res.status(500).send({message: "Error creating user", error});
                });
        });

// Sends reset password link to a specific user who hasn't reset their password
app.post('/send-reset-link-to-user/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;

        // Find the specific user who hasn't reset their password
        const user = await User.findOne({ _id: userId, passwordReset: false });

        if (!user) {
            return res.status(404).json({ message: 'User not found or has already reset the password' });
        }

        // Generate a reset link for the user
        const secret = JWT_SECRET + user.password;
        const token = jwt.sign({ email: user.email, id: user._id }, secret, {
            expiresIn: '5m',
        });
        const link = `http://localhost:3001/reset-password/${user._id}/${token}`;

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS
            }
          });
          
          var mailOptions = {
            from: 'youremail@gmail.com',
            to: user.email,
            subject: 'Reset Your Password',
            text: `Click the following link to reset your password: ${link}`
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });

        console.log(`Reset link sent to ${user.email}: ${link}`);

    //     res.status(200).json({ message: 'Reset link sent successfully' });
    // } catch (err) {
    //     res.status(500).json({ message: `Error: ${err.message}` });
    // }
        res.send({ status: "Ok", data: "Reset link sent successfully" });
        } catch (error) {
            console.log(error);
            res.status(500).send({ status: "Error", data: "Failed to send reset link" });
        }
});

    // User.findOne({ $or: [{ email: email }, { username: username }]})
    //     .then((existingUser) => {
    //         if(existingUser) return res.status(409).send({ message: "User with the following email & user already exists" });

    //         bcrypt
    //             .hash(password, 10)
    //             .then((hashedPassword) => {
    //                 const user = new User({
    //                     firstName: firstName,
    //                     lastName: lastName,
    //                     username: username,
    //                     email: email,
    //                     password: hashedPassword,
    //                     userType: selectedUserType,
    //                 });

    //                 user.save()
    //                     .then((result) => {
    //                         res.status(201).send({message: "User created Successfully", result});
    //                     })
    //                     .catch((error) => {
    //                         res.status(500).send({message: "Error creating user", error});
    //                     });
    //         })
    //         .catch((e) => {
    //             res.status(500).send({message: "Password not hashed succesfully", e})
    //         });
    //     });
});

app.get("/reset-password/:id/:token", async (req, res) => {
    const { id, token } = req.params;
    console.log(req.params);
    const user = await User.findOne({ _id: id });
    const secret = JWT_SECRET + user.password;
    try {
        const verify = jwt.verify(token, secret);
        res.render("resetPassword", { email: verify.email, status:"Not Verified" });
    } catch (error) {
        console.log(error);
        res.send("Not Verified");
    }
})

app.post("/reset-password/:id/:token", async (req, res) => {
    const { id, token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({ _id: id });
    const secret = JWT_SECRET + user.password;
    try {
        const verify = jwt.verify(token, secret);
        const encryptedPassword = await bcrypt.hash(password, 10);
        await User.updateOne(
            {
                _id: id,
            },
            {
                $set: {
                    password: encryptedPassword,
                    passwordReset: true,
                },
            }
        );
        res.json({ status: "Password Set" });

        res.render("resetPassword", { email: verify.email, status:"Verified" });
    } catch (error) {
        console.log(error);
        res.send("Not Verified");
    }
})

//Logs user into the website
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

//Deletes user
app.post("/delete-user", async (req, res) => {
    const { userId } = req.body;
    try {
        const result = await User.deleteOne({ _id: userId });
        console.log(result);
        res.send({ status: "Ok", data: "Deleted" });
    } catch (error) {
        console.log(error);
        res.status(500).send({ status: "Error", data: "Failed to delete user" });
    }
});

//Updates user's fields based on ID
app.put('/update-user/:userId', async(req, res) => {
    const userId = req.params.userId;
    const { fieldToUpdate, newValue } = req.body;

    try{
        const updatedUser = await User.findByIdAndUpdate(
            userId, 
            { [fieldToUpdate]: newValue },
            { new: true }
        );

        if(!updatedUser) return res.status(404).json({ error: 'User not found' });

        res.json(updatedUser);
    }catch(err){
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }


});

// User Endpoints

// Post Endpoints
//Gets all posts]
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

//Gets top 3 liked posts
app.get('/get-top-liked-post', async(req, res) => {
    try{
        const topLikePosts = await Post.find().sort({ 'likes': -1 }).limit(3);

        res.status(200).json(topLikePosts);
    }catch(err){
        res.status(500).json({ message: `Error: ${err.message}` });
    }
})

//
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

//Adds +1 to likes field in the post document in the database
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

//Adds +1 to report field in the post document in the database
app.post('/report-post', async(req, res) => {
    const { postId, userId } = req.body;

    try{
        const post = await Post.findOne({ _id: postId });

        if(!post) return res.status(404).json({ message: 'Post not found' });
        if(post.userReported.includes(userId)) return res.status(400).json({message:'User reported liked the post'});

        post.userReported.push(userId);

        post.reports++;

        await post.save();
        res.json({ message: 'Post reported successfully!', likes: post.likes });
    }catch(error){
        console.error(error);
        res.status(500).json({ message: 'An error occurred while processing your request' });
    }
});

//Update a specific field in the Post doucment in the database
app.put('/update-post/:postId', async(req, res) => {
    const postId = req.params.postId;
    const { fieldToUpdate, newValue } = req.body;

    try{
        const updatedPost = await Post.findByIdAndUpdate(
            postId, 
            { [fieldToUpdate]: newValue },
            { new: true }
        );

        if(!updatedPost) return res.status(404).json({ error: 'Post not found' });

        res.json(updatedPost);
    }catch(err){
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

//Fetch current user posts
app.get('/api/posts/user/:userId', async (req, res) => {
    try {
        const posts = await Post.find({ authorId: req.params.userId });
        res.json(posts);
    } catch (error) {
        res.status(500).send('Server error');
    }
});

// Post Endpoints
