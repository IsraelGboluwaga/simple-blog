var express = require('express');
var router = express.Router();
const BaseController = require('../controllers/base.ctrl')();
const PostController = require('../controllers/post.ctrl');


router.post('/', PostController.create);

router.post('/:post_id/like', BaseController.authenticateUser,
  PostController.like);

router.get('/posts', PostController.getAllPosts);

router.get('/:post_id', PostController.getSinglePostById);

router.get('/posts/:username', PostController.getPostsByAuthor);

module.exports = router;
