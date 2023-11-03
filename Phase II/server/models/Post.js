const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    authorId: {
        type: String,
        required: true,
    },
    author: {
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
    time: {
        type: String,
        require: true,
    },
    date: {
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
    }
});

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;