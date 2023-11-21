const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    postID: {
        type: String,
        require: true,
    },
    authorID: {
        type: String,
        require: true,
    },
    content: {
        type: String,
        require: true,
    }
});

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;