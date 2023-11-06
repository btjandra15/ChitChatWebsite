const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    authorId: {
        type: String,
        required: true,
    },
    authorFirstName: {
        type: String,
        require: true,
    },
    authorLastName: {
        type: String,
        require: true,
    },
    authorUsername: {
        type: String,
        require: true,
    },
    content: {
        type: String,
        require: true,
    },
    likes: {
        type: Number,
        require: true,
        default: 0
    },
    dislikes: {
        type: Number,
        require: true,
        default: 0
    },
    dateAndTime: {
        type: String,
        require: true,
    },
    keywords: {
        type: Array,
        require: true,
    },
    wordCount: {
        type: Number,
        require: true,
        default: 0,
    },
    trendyPost: {
        type: Boolean,
        require: true,
        default: false,
    },
    userLiked: {
        type: Array,
        require: true,
        default: [],
    }
});

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;