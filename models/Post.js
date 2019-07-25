const mongoose = require('mongoose');
const {Schema} = mongoose;

const postSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    author: {
        type:  Schema.Types.ObjectId,
        ref: 'User'
    },
    image_url: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        default: 0
    }
});

const postModel = mongoose.model('Post', postSchema);

module.exports = postModel;
