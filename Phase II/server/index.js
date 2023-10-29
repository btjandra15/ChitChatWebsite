const express = require('express');
const mongoose = require('mongoose');
const app = express();
const UserModel = require('./models/user.js');

app.use(express.json());
mongoose.connect('mongodb+srv://btjandra15:kZ2HglGxeMWfJj2h@csc322chitchat.zwl6xio.mongodb.net/Users?retryWrites=true&w=majority');

app.get('/', async (req, res) => {
    const user = new UserModel({
        fullName: 'Brandon Tjandra',
        username: 'Kohix',
        email: 'btjandra15@gmail.com',
        password: "Password123",        
    });

    try{
        await user.save();
        console.log("Added user");
    }catch(err){
        console.log(err);
    }
});

app.listen(3001, () => {
    console.log('Server running');
});