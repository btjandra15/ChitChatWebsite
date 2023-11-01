const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        require: true,
    },
    lastName: {
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
        default: 'Ordinary User',
    },
    followingList: {
        type: Array,
        require: true
    },
    warningCount: {
        type: Number,
        require: true,
        default: 0,
    }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;