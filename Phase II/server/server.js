const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const app = express();
const User = require('./models/user.js');
const jwt = require('jsonwebtoken');
const auth = require('./auth.js');

app.use(express.json());
app.use(cors());
mongoose.connect('mongodb+srv://btjandra15:kZ2HglGxeMWfJj2h@csc322chitchat.zwl6xio.mongodb.net/Users?retryWrites=true&w=majority');

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    next();
});
  
app.listen(3001, () => {
    console.log('Server running');
});

app.post('/register', async (req, res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

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

app.get("/auth-endpoint", auth, (req, res) => {
    res.json({message: "You are authorized to access this endpoint"});
})