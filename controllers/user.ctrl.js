
const User = require('../models/User');
const BaseController = require('./base.ctrl');


class UserController extends BaseController {
    constructor() {
        super()
    }

    async create(req, res) {
        super.checkReqBody(req);
        try {
            const { username, password } = req.body;
            const existingUser = await User.findOne({ username });
            if (existingUser)
                return super.sendError(res, null, 'A user already exists with the same username', 400);

            const userParams = { username, password };
            const newUser = new User(userParams);
            let savedUser = await newUser.save();
            let tokenData = { userId: savedUser._id, username: savedUser.username }
            let token = super.generateToken(tokenData);
            savedUser = { token, user: savedUser }
            return super.sendSuccess(res, savedUser);
        } catch (err) {
            return super.sendError(res, err, err.message, err.status);
        }
    }

    async login(req, res) {
        super.checkReqBody(req);
        try {
            const { username, password } = req.body;
            let userInDb = await User.findOne({ username });
            if (userInDb && await super.comparePassword(password, userInDb.password)) {
                let tokenData = { userId: userInDb._id, username: userInDb.username }
                const token = super.generateToken(tokenData);
                userInDb = { token, user: userInDb }
                return super.sendSuccess(res, userInDb);
            }

            return super.sendError(res, null, 'Incorrect username or password', 400);
        } catch (err) {
            return super.sendError(res, err, err.message, err.status);
        }
    }

    async getSingleUserByUsername(req, res) {
        const username = req.params.username;
        try {
            const user = await User.findOne({ username });
            if (!user) {
                return super.sendError(res, null, 'User not found', 404);
            }
            return super.sendSuccess(res, user, 'Successful');
        } catch (err) {
            return super.sendError(res, err, err.message, err.status);
        }
    }
}

module.exports = new UserController();