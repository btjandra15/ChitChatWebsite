const mongoose = require('mongoose');

const PostComplaintSchema = new mongoose.Schema({
    initiatorId: {
        type: String,
        required: true,
    },
    initiatorUsername: {
        type: String,
        required: true,
    },
    receiverId: {
        type: String,
        required: true,
    },
    receiverUsername: {
        type: String,
        required: true,
    },
    postId: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'approved', 'denied'],
        default: 'pending',
    },
    reason: {
        type: String,
        required: true,
    },
    dispute: {
        type: String,
        required: true,
        default: 'N/A',
    }
});

const PostComplaint = mongoose.model('PostComplaint', PostComplaintSchema);

module.exports = PostComplaint;