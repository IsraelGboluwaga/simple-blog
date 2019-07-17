var express = require('express');
var router = express.Router();
let baseCtrl = require('../controllers/base.ctrl')
const BaseController = new baseCtrl();
const PostController = require('../controllers/post.ctrl');


router.post('/', BaseController.authenticateUser.bind(BaseController), PostController.create.bind(PostController));

router.post('/:post_id/like', BaseController.authenticateUser.bind(BaseController),
  PostController.like);

router.get('/', PostController.getAllPosts);

router.get('/:post_id', PostController.getSinglePostById);

router.get('/author/:username', PostController.getPostsByAuthor);

module.exports = router;
