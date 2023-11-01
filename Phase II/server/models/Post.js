const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    author: {
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
    }
});

const Post = mongoose.model('User', PostSchema);

module.exports = Post;