var express = require('express');
var router = express.Router();
const UserController = require('../controllers/user.ctrl');


router.post('/', UserController.create);

router.post('/login', UserController.login);

router.get(':/username', UserController.getSingleUserByUsername)

module.exports = router;
