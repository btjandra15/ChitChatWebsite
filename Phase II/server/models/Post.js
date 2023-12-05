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
    views: {
        type: Number,
        require: true,
        default: 0
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
    reports: {
        type: Number,
        require: true,
        default: 0,
    },
    dateAndTime: {
        type: String,
        require: true,
    },
    keywords: {
        type: Array,
        require: true,
        default: [],
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
    jobPost: {
        type: Boolean,
        require: true,
        default: false,
    },
    jobLink: {
        type: String,
        require: false,
        default: "",
    },
    userLiked: {
        type: Array,
        require: true,
        default: [],
    },
    userDisliked: {
        type: Array,
        require: true,
        default: []
    },
    userReported: {
        type: Array,
        require: true,
        default: [],
    },
    userViewed: {
        type: Array,
        require: true,
        default: [],
    },
    imageName: {
        type: String,
        require: true,
        default: ""
    },
    imageUrl: {
        type: String,
        require: true,
        default: ""
    },
    comments: {
        type: Array,
        require: true,
        default: []
    },
    videoUrl: {
        type: String,
        require: true,
        defualt: ""
    }
});

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;