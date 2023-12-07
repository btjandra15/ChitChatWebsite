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
    passwordReset: {
        type: Boolean,
        default: false,
    },
    userType: {
        type: String,
        require: true,
        default: 'Surfer',
    },
    trendyUser: {
        type: Boolean,
        require: true,
        default: false,
    },
    adminUser: {
        type: Boolean,
        require: true,
        default: false,
    },
    subscribersList: {
        type: Array,
        require: true,
        default: []
    },
    followingList: {
        type: Array,
        require: true,
        default: []
    },
    warningCount: {
        type: Number,
        require: true,
        default: 0,
    },
    balance: {
        type: Number,
        require: true,
        default: 1000,
    },
    tips: {
        type: Number,
        require: true,
        default: 0,
    },
    trendyMessages: {
        type: Array,
        require: true,
        default: [],
    },
    profilePictureUrl: {
        type: String,
        required: false, 
        default: '' 
    },
    bannerUrl: {
        type: String,
        required: false,
        default: ''
    },
    bio: {
        type: String,
        required: false,
        default: ''
    },
    followedMessages: {
        type: Array,
        require: true,
        default: []
    },
    chargesAmount: {
        type: Array,
        require: true,
        default: [],
    },
    tippedUsers: {
        type: Array,
        require: true,
        default: []
    }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;