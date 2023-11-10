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
    },
});

const Post = mongoose.model('Post', PostSchema);

const tabooWords = ['word1', 'word2', 'word3'];

const checkForTabooWords = (content) => {
    const contentArray = content.split(' ');
    const foundTabooWord = contentArray.some(word => tabooWords.includes(word));
    return foundTabooWord;
};

PostSchema.pre('save', async function (next) {
    const post = this;

    if (post.isModified('content')) {
        const containsTabooWords = checkForTabooWords(post.content);

        if (containsTabooWords) {
            // Additional actions you wish to perform
            post.trendyPost = false; // For example, mark the post as not trendy
           

            // You might also want to notify the author or take other actions

            // Prevent the post from being saved
            return next(new Error('Post contains taboo words and is not allowed.'));
        }
    }

    next();
});


module.exports = Post;