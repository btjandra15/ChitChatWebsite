const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    postID: {
        type: String,
        required: true,
    },
    authorID: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    authorUsername: {
        type: String,
        required: true,
    }
});


const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;