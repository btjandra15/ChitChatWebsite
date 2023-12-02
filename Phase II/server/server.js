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
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const userController = require( './controllers/userController');
const Comment = require('./models/Comments.js');
const multer = require('multer');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const sharp = require('sharp');
const PostComplaint = require('./models/PostComplaints.js')

// Generate a random secure string (32 bytes)
const JWT_SECRET = process.env.JWT_SECRET;
const app = express();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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

const randomImageName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');

dotenv.config();
app.use(cors(), express.json(), express.urlencoded({ extended: false }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jsx');
app.engine('jsx', reactViews.createEngine());
mongoose.connect(process.env.MONGODB_URI);

//THIS FUNCTION IS TO UPDATE THE USER'S & POST'S DOUCEMENT WITH THE MOST RECENT USER SCHEMA
//USE THIS COMMAND IF YOU NEED TO UPDATE THE USER AND/OR POST DOUCEMENTS 
//updateCollection();

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
        const trendyUsers = await User.find({trendyUser: true});

        res.status(200).json(trendyUsers);
    }catch(err) {
        res.status(500).json({message: `Error: ${err.message}`});
    }
});

//Creates new user
app.post('/register', (req, res) => {
    const { firstName, lastName, username, email, password, selectedUserType } = req.body;
    // const randomPassword = generateRandomPassword();

    bcrypt.hash(password, 10)
        .then((hashedPassword) => {
            const user = new User({
                firstName: firstName,
                lastName: lastName,
                username: username,
                email: email,
                password: hashedPassword,
                userType: selectedUserType
            });

            user.save()
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

app.post('/upload-profile-pic', userController.setProfilePic, async(req, res) => {
});

//+1 warningCount to complaining user when complaint is denied
app.post('/add-warning-count-to-initiator/:initiatorId', async (req, res) => {
    const { initiatorId } = req.params;
  
    try {
      // Find the user by ID and update the warning count
      const user = await User.findByIdAndUpdate(initiatorId, { $inc: { warningCount: 1 } }, { new: true });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Send an email to the user
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
        subject: 'Your complaint has been denied',
        text: `Reason: ${req.body.reason}\nYou have been warned for false report`
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
  
      res.json({ message: 'User warning count updated successfully' });
    } catch (error) {
      console.error('Error updating user warning count:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
});

//+1 warningCount to receiving user when complaint is made
app.post('/add-warning-count-to-receiver/:receiverId', async (req, res) => {
    const { receiverId } = req.params;
  
    try {
      // Find the user by ID and update the warning count
      const user = await User.findByIdAndUpdate(receiverId, { $inc: { warningCount: 1 } }, { new: true });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const link = `http://localhost:3000/profile/${user.username}`;

      // Send an email to the user
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
        subject: 'You received a warning',
        text: `You received a complaint for reason: ${req.body.reason}\nClick on this link ${link} to dispute`
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
  
      res.json({ message: 'User warning count updated successfully' });
    } catch (error) {
      console.error('Error updating user warning count:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
});

//-1 warningCount to receiving user when dispute is won
app.post('/sub-warning-count/:receiverId', async (req, res) => {
    const { receiverId } = req.params;
  
    try {
      // Find the user by ID and update the warning count
      const user = await User.findByIdAndUpdate(receiverId, { $inc: { warningCount: -1 } }, { new: true });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Send an email to the user
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
        subject: 'You won the dispute',
        text: `Your warning has been removed.`
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
  
      res.json({ message: 'User warning count updated successfully' });
    } catch (error) {
      console.error('Error updating user warning count:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
});

//Follows User
app.post('/follow-user', auth, async(req, res) => {
    const { userID, trendyUserID } = req.body;

    try{
        User.findById({ _id: userID})
            .then(async(user) => {
                if(userID === trendyUserID) {
                    return res.status(400).json({ message: "User can't follow themselves" });
                }else if(user.followingList.includes(trendyUserID)) {
                    return res.status(400).json({message:'User followed the user already'});
                }

                user.followingList.push(trendyUserID);
                await user.save();
                res.json({ message: 'User followed the user successfully!'});
            })
            .catch((error) => {
                console.log(error);
            })
    }catch(error){
        console.error(error);
        res.status(500).json({ message: 'An error occurred while processing your request', error });
    }
});

app.post('/tip-user', auth, async(req, res) => {
    const { userID, trendyUserID, tipAmount } = req.body;

    try{
        User.findById({ _id: userID })
            .then(async(user) => {
                User.findById({ _id: trendyUserID })
                    .then(async(trendyUser) => {
                        user.balance -= tipAmount;
                        trendyUser.tips += tipAmount;

                        await user.save();
                        await trendyUser.save();
                        console.log('User tipped the user successfully!');
                    });
            })
            .catch((error) => {
                console.log(error);
            })
    }catch(err){
        console.error(err);
        res.status(500).json({ message: 'An error occurred while processing your request', err });
    }
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
//Gets all posts
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

//Fetch current user posts
app.get('/api/posts/user/:userId', async (req, res) => {
    try {
        const posts = await Post.find({ authorId: req.params.userId });
        res.json(posts);
    } catch (error) {
        res.status(500).send('Server error');
    }
});

// Creates Post
// app.post('/create-post', auth, upload.single('image'), async (req, res) => {
//     const buffer = await sharp(req.file.buffer)
//                             .resize({
//                                 height: 500,
//                                 width: 500,
//                                 fit: 'contain'
//                             })
//                             .toBuffer();

//     const imageName = `${randomImageName()}-${req.file.originalname}`

//     const params = {
//         Bucket: 'chit-chat-website-images',
//         Key: imageName,
//         Body: buffer,
//         ContentType: req.file.mimetype,
//         ACL: 'public-read',
//     };

//     const imageUrl = `https://${params.Bucket}.s3.amazonaws.com/${imageName}`;
//     const command = new PutObjectCommand(params);

//     await s3.send(command);

//     try {
//         const { userFirstName, userLastName, username, content, keywords, dateAndTime, wordCount } = req.body;
//         const { foundTabooWord, sanitizedContent, asteriskCount } = checkForTabooWords(content);
//         const userId = req.user.userId;

//         if (foundTabooWord && asteriskCount > 2) {
//             // Additional actions you wish to perform
//             // For example, you can send an error response with the taboo words
//             return res.status(400).json({ message: "Post contains too many asterisks and is not allowed.", sanitizedContent });
//         }

//         const newPost = new Post({
//             authorId: userId,
//             authorFirstName: userFirstName,
//             authorLastName: userLastName,
//             authorUsername: username,
//             content: content, // Save the sanitized content
//             wordCount: wordCount,
//             dateAndTime: dateAndTime,
//             keywords: keywords,
//             imageName: imageName,
//             imageUrl: imageUrl,
//         });

//         const result = await newPost.save();
//         res.status(201).json({ message: "Post created successfully", result });
//     } catch (error) {
//         console.error('Error in create-post route:', error);
//         res.status(500).json({ message: "Error creating post", error });
//     }
// });

app.post('/create-post', auth, upload.single('image'), async (req, res) => {
    try {
        let imageUrl = null;
        let imageName = null;

        if (req.file) {
            const buffer = await sharp(req.file.buffer)
                .resize({
                    height: 500,
                    width: 500,
                    fit: 'contain'
                })
                .toBuffer();

            imageName = `${randomImageName()}-${req.file.originalname}`;

            const params = {
                Bucket: 'chit-chat-website-images',
                Key: imageName,
                Body: buffer,
                ContentType: req.file.mimetype,
                ACL: 'public-read',
            };

            await s3.send(new PutObjectCommand(params));

            imageUrl = `https://${params.Bucket}.s3.amazonaws.com/${imageName}`;
        }

        const { userFirstName, userLastName, username, content, dateAndTime, wordCount } = req.body;
        const keywords = req.body.keywords.split(',');
        const { foundTabooWord, sanitizedContent, asteriskCount } = checkForTabooWords(content);
        const userId = req.user.userId;

        if (foundTabooWord && asteriskCount > 2) {
            return res.status(400).json({ message: "Post contains too many asterisks and is not allowed.", sanitizedContent });
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
            imageName: imageName,
            imageUrl: imageUrl,
        });

        const result = await newPost.save();
        res.status(201).json({ message: "Post created successfully", result });
    } catch (error) {
        console.error('Error in create-post route:', error);
        res.status(500).json({ message: "Error creating post", error });
    }
});


// Adds +1 to views like in the post doucment in the database
app.post('/view-post', async(req, res) => {
    const { postId, userId } = req.body;

    try {
        const post = await Post.findOne({ _id: postId });
    
        if (!post) {
          return res.status(404).json({ message: 'Post not found' });
        }

        if(post.userViewed.includes(userId)) return res.status(400).json({message:'User already viewed the post'});
    
        post.userViewed.push(userId);

        post.views++;
        
        await post.save();
        res.json({ message: 'Post viewed successfully!', views: post.views });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while processing your request' });
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

app.post('/dislike-post', async(req, res) => {
    const { postId, userId } = req.body;

    try {
        const post = await Post.findOne({ _id: postId });
    
        if (!post) {
          return res.status(404).json({ message: 'Post not found' });
        }

        if(post.userDisliked.includes(userId)) return res.status(400).json({message:'User already disliked the post'});
    
        post.userDisliked.push(userId);

        post.dislikes++;
        
        await post.save();
        res.json({ message: 'Post disliked successfully!', likes: post.likes });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while processing your request' });
      }
});

app.post('/follow-post', auth, async(req, res) => {
    const { userId, postId } = req.body;

    try{
        const post = await Post.findOne({ _id: postId });

        if(!post) return res.status(404).json({ message: 'Post not found' });

        User.findById({ _id: userId})
            .then(async(user) => {
                if(user.followedMessages.includes(postId)) return res.status(400).json({message:'User followed the post'});

                user.followedMessages.push(postId);
                await user.save();
                res.json({ message: 'User followed the post successfully!'});
            })
            .catch((error) => {
                console.log(error);
            })
    }catch(error){
        console.error(error);
        res.status(500).json({ message: 'An error occurred while processing your request', error });
    }
});

//Adds +1 to report field in the post document in the database
app.post('/report-post', async(req, res) => {
    const { postId, initiatorId } = req.body;

    try{
        const post = await Post.findOne({ _id: postId });

        if(!post) return res.status(404).json({ message: 'Post not found' });
        if(post.userReported.includes(initiatorId)) return res.status(400).json({message:'User reported the post'});

        post.userReported.push(initiatorId);

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

//Deletes a post
app.delete('/delete-post/:postId', auth, async(req, res) => {
    try{
        const postId = req.params.postId;

        // Check if the post belongs to the authenticated user
        const post = await Post.findOne({ _id: postId });

        if (!post) {
            return res.status(404).json({ message: "Post not found or unauthorized to delete" });
        }

        // Delete the post
        await post.deleteOne({ _id: postId });

        res.status(200).json({ message: "Post deleted successfully" });
    }catch(error){
        console.error('Error in delete-post route:', error);
        res.status(500).json({ message: "Error deleting post", error });
    }
});

// Remove the user from the array userReported
app.post('/remove-user-reported/:postId', async (req, res) => {
    const { postId } = req.params;
    const { initiatorId } = req.body;
  
    try {
      // Find the post by ID and update the userReported field
      const updatedPost = await Post.findByIdAndUpdate(postId, { $pull: { userReported: initiatorId } }, { new: true });
  
      if (!updatedPost) {
        return res.status(404).json({ error: 'Post not found' });
      }
  
      res.json({ message: 'Initiator ID removed from userReported successfully' });
    } catch (error) {
      console.error('Error removing initiator ID from userReported:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
});
// Post Endpoints

// Post Complaints Endpoints
app.get('/get-post-complaints', async (req, res) => {
    try {
      const postComplaints = await PostComplaint.find();
      res.json(postComplaints);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred while fetching post complaints' });
    }
  });

app.post('/create-post-complaint', async (req, res) => {
const { initiatorId, initiatorUsername, receiverId, receiverUsername, postId, content, reason } = req.body;

try {
    // Create a PostComplaint document
    const postComplaint = new PostComplaint({
    initiatorId,
    initiatorUsername,
    receiverId,
    receiverUsername,
    postId,
    content,
    reason,
    });

    await postComplaint.save();

    res.json({ message: 'Post complaint created successfully!' });
} catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while creating post complaint' });
}
});

// Update a post complaint
app.put('/update-post-complaint/:id', async (req, res) => {
    const { id } = req.params;
    const updateFields = req.body;
  
    try {
      // Validate if the provided ID is a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid post complaint ID' });
      }
  
      // Find the post complaint by ID and update the specified fields
      const updatedPostComplaint = await PostComplaint.findByIdAndUpdate(id, updateFields, {
        new: true, // Return the updated document
      });
  
      if (!updatedPostComplaint) {
        return res.status(404).json({ error: 'Post complaint not found' });
      }
  
      res.json(updatedPostComplaint);
    } catch (error) {
      console.error('Error updating post complaint:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  //Admin approves complaint (dispute gets denied if exists, receiver gets email)
  app.post('/approve-complaint/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      // Find the post complaint by ID and update the status to 'approved'
      const updatedComplaint = await PostComplaint.findByIdAndUpdate(id, { status: 'approved' }, { new: true });
  
      if (!updatedComplaint) {
        return res.status(404).json({ error: 'Post complaint not found' });
      }
  
      // Check if the complaint has a dispute before sending an email
      if (updatedComplaint.dispute) {
        // Fetch the receiver's email from the User schema
        const receiverUser = await User.findOne({ _id: updatedComplaint.receiverId });

        // Send an email to the user
        if (receiverUser) {
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.GMAIL_USER,
                    pass: process.env.GMAIL_PASS
                }
            });
            
            var mailOptions = {
                from: 'youremail@gmail.com',
                to: receiverUser.email,
                subject: 'Your dispute has been denied',
                text: `The reason for denial: ${req.body.disputeDenyReason}`
            };
            
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                console.log(error);
                } else {
                console.log('Email sent: ' + info.response);
                }
            });
        } else {
            console.error('Receiver user not found');
        }
      }
  
      res.json({ message: 'Complaint accepted successfully' });
    } catch (error) {
      console.error('Error accepting complaint:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

app.post('/deny-complaint/:id', async (req, res) => {
    const { id } = req.params;

    try {
    // Find the post complaint by ID and update the status to 'denied'
    const updatedComplaint = await PostComplaint.findByIdAndUpdate(id, { status: 'denied' }, { new: true });

    if (!updatedComplaint) {
        return res.status(404).json({ error: 'Post complaint not found' });
    }
    res.json({ message: 'Complaint denied successfully' });
    } catch (error) {
    console.error('Error denying complaint:', error);
    res.status(500).json({ error: 'Internal server error' });
    }
});

// Post Complaints Endpoints

//COMMENTS ENDPOINTS
app.get('/get-comments', async(req, res) => {
    try{
        const comments = await Comment.find({}).exec();

        res.json(comments);
    }catch(err){
        console.error(err);
    }
});

app.post('/create-comment', auth, async(req, res) => {
    const { postId, content } = req.body;
    const userId = req.user.userId;

    try{
        const newCommment = new Comment({
            postID: postId,
            authorID: userId,
            content: content,
        });

        const result = await newCommment.save();

        res.status(201).json({ message: "Comment created successfully", result });
    }catch(e){
        console.error(e);
    }
});
//COMMENTS ENDPOINTS

//Job Postings Endpoints
app.post('/create-job-post', auth, upload.single('image'), async (req, res) => {
    try {
        let imageUrl = null;
        let imageName = null;

        if (req.file) {
            const buffer = await sharp(req.file.buffer)
                .resize({
                    height: 500,
                    width: 500,
                    fit: 'contain'
                })
                .toBuffer();

            imageName = `${randomImageName()}-${req.file.originalname}`;

            const params = {
                Bucket: 'chit-chat-website-images',
                Key: imageName,
                Body: buffer,
                ContentType: req.file.mimetype,
                ACL: 'public-read',
            };

            await s3.send(new PutObjectCommand(params));

            imageUrl = `https://${params.Bucket}.s3.amazonaws.com/${imageName}`;
        }

        const { userFirstName, userLastName, username, content, dateAndTime, wordCount, jobLink } = req.body;
        const keywords = req.body.keywords.split(',');
        const { foundTabooWord, sanitizedContent, asteriskCount } = checkForTabooWords(content);
        const userId = req.user.userId;

        if (foundTabooWord && asteriskCount > 2) {
            return res.status(400).json({ message: "Post contains too many asterisks and is not allowed.", sanitizedContent });
        }

        const newPost = new Post({
            authorId: userId,
            authorFirstName: userFirstName,
            authorLastName: userLastName,
            authorUsername: username,
            content: content,
            wordCount: wordCount,
            jobPost: true, //Set to true
            jobLink: jobLink,
            dateAndTime: dateAndTime,
            keywords: keywords,
            imageName: imageName,
            imageUrl: imageUrl,
        });

        const result = await newPost.save();
        res.status(201).json({ message: "Post created successfully", result });
    } catch (error) {
        console.error('Error in create-post route:', error);
        res.status(500).json({ message: "Error creating post", error });
    }
});
//Job Postings Endpoints