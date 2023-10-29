const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        require: true,
    },
    username: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
    },
    password: {
        type: String,
        require: true,
    },
    userType: {
        type: String,
        require: true,
        default: 'Surfer',
    }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;