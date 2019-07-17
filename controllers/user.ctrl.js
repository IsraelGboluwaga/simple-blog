const bcrypt = require('bcryptjs');

const User = require('../models/User');
const BaseController = require('./base.ctrl');


class UserController extends BaseController {

    async comparePassword(password, hash) {
        return await bcrypt.comparePassword(password, hash);
    }

    async create(req, res) {
        this.checkReqBody(req);
        try {
            const {username, password} = req.body;
            const existingUser = await User.findOne({username});
            if (existingUser)
                return this.sendError(res, null, 'A user already exists with the same username', 400);
            
            const userParams = {username, password};
            const newUser = new User(userParams);
            const savedUser = await newUser.save();
            savedUser.token = this.generateToken(savedUser);
            return this.sendSuccess(savedUser);
        } catch (err) {
            return this.sendError(res, err, err.message, err.status);
        }
    }

    async login(req, res) {
        this.checkReqBody(req);
        try {
            const {username, password} = req.body;
            const userInDb = await User.findOne({username});
            if (userInDb && this.comparePassword(password, userInDb.password)) {
                const token = this.generateToken(userInDb);
                userInDb.token = token;
                return this.sendSuccess(userInDb);
            }
        
            return this.sendError(res, null, 'Incorrect username or password', 400);
        } catch (err) {
            return this.sendError(res, err, err.message, err.status);
        }
    }

    async getSingleUserByUsername(req, res) {
        const username = req.params.username;
        try {
            const user = await User.findOne({username});
            if (!user) {
                return this.sendError(res, null, 'User not found', 404);
            }
            return this.sendSuccess(res, user, 'Successful');
        } catch (err) {
            return this.sendError(res, err, err.message, err.status);
        } 
    }
}

module.exports = UserController();