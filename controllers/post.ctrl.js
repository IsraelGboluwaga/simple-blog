const Post = require('../models/Post');
const User = require('../models/User');
const BaseController = require('./base.ctrl');


class PostController extends BaseController {

    async create(req, res) {
        this.checkReqBody(req);
        try {
            const { title, body, author_id } = req.body;
            const postParams = {
                title, body, author_id
            };
            const newPost = new User(postParams);
            const savedPost = await newPost.save();
            return this.sendSuccess(savedPost);
        } catch (err) {
            return this.sendError(res, err, err.message, err.status);
        }
    }

    async like(req, res) {
        const postId = this.params.post_id;
        try {
            const post = Post.findOne({ _id: postId });
            if (!post) {
                return this.sendError(res, null, 'Post not found', 404);
            }

            post.likes += 1
            const savedPost = post.save();
            return this.sendSuccess(res, savedPost, 'Liked');
        } catch (err) {
            return this.sendError(res, err, err.message, err.status);
        }
    }

    async getAllPosts(req, res) {
        try {
            const posts = await Post.find({});
            return this.sendSuccess(res, posts, 'Successful');
        } catch (err) {
            return this.sendError(res, err, err.message, err.status);
        }
    }

    async getSinglePostById(req, res) {
        const postId = this.params.post_id;
        try {
            const post = Post.findOne({ _id: postId });
            if (!post) {
                return this.sendError(res, null, 'Post not found', 404);
            }

            return this.sendSuccess(res, post, 'Successful');
        } catch (err) {
            return this.sendError(res, err, err.message, err.status);
        }
    }

    async getPostsByAuthor(req, res) {
        try {
            const username = req.params.username;
            const user = await User.findOne({username}).populate('posts');
            if (!user) {
                return this.sendError(res, null, 'Author does not exist');
            }
            return this.sendSuccess(res, user.posts, 'Successful');
        } catch (err) {
            return this.sendError(res, err, err.message, err.status);
        }
    }
}

module.exports = new PostController();