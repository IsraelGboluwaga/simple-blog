const Post = require('../models/Post');
const User = require('../models/User');
const BaseController = require('./base.ctrl');
const cloudinary = require('../cloudinary');


class PostController extends BaseController {

    async create(req, res) {
        let { user: { _id, posts } } = req;
        super.checkReqBody(req);
        if (!req.files) {
            return super.sendError(res, null, 'Request file body empty', 400);
        }

        try {
            postImage = req.files.image && req.files.image.path;
            cloudinaryUrl = cloudinary(postImage);
            const { title, body } = req.body;
            const postParams = {
                title, body, author: _id, image: cloudinaryUrl
            };
            const newPost = new Post(postParams);
            const savedPost = await newPost.save();
            await this._pushPostToUser(_id, savedPost._id)
            return super.sendSuccess(res, savedPost);
        } catch (err) {
            return super.sendError(res, err, err.message, err.status);
        }
    }

    async _pushPostToUser(user_id, post_id) {
        try {
            let user = await User.findById(user_id);
            user.posts.push(post_id);
            await user.save()
        } catch (error) {
            throw (error)
        }
    }

    async like(req, res) {
        const postId = req.params.post_id;
        try {
            let post = await Post.findOne({ _id: postId });
            if (!post) {
                return super.sendError(res, null, 'Post not found', 404);
            }

            let likes = post.likes;
            post.likes = likes + 1;
            let updatedPost = await post.save()

            return super.sendSuccess(res, updatedPost, 'Liked');
        } catch (err) {
            return super.sendError(res, err, err.message, err.status);
        }
    }

    async getAllPosts(req, res) {
        try {
            const posts = await Post.find({});;
            return super.sendSuccess(res, posts, 'Successful');
        } catch (err) {
            return super.sendError(res, err, err.message, err.status);
        }
    }

    async getSinglePostById(req, res) {
        const postId = req.params.post_id;
        try {
            const post = await Post.findOne({ _id: postId });
            if (!post) {
                return super.sendError(res, null, 'Post not found', 404);
            }

            return super.sendSuccess(res, post, 'Successful');
        } catch (err) {
            return super.sendError(res, err, err.message, err.status);
        }
    }

    async getPostsByAuthor(req, res) {
        try {
            const username = req.params.username;
            const user = await User.findOne({ username }).populate('posts');
            if (!user) {
                return super.sendError(res, null, 'Author does not exist');
            }
            return super.sendSuccess(res, user.posts, 'Successful');
        } catch (err) {
            return super.sendError(res, err, err.message, err.status);
        }
    }
}

module.exports = new PostController();