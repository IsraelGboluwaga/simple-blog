const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
let Constants = {
    SUCCESS: 200,
    ERROR: 500
}
let jwtSecret = 'Beckie';

module.exports = class BaseController {
    
    
    /**
     * Generic send success helper
     * @param res
     * @param data
     * @param message
     * @param token
     * @param status
     * @param header
     */
    sendSuccess(res, data, message, status, header) {
        let resp = { status: Constants.SUCCESS };

        if (message)
            resp.message = message;

        if (data || data === [] || data === {})
            resp.data = data;

        status = status ? status : 200;

        if (header) return res.header(header, token).status(status).json(resp);

        return res.status(status).json(resp);
    }

    /**
     * Generic send error helper
     * @param res
     * @param message
     * @param error
     * @param status
     */
    sendError(res, error, message, status) {
        let resp = { status: Constants.ERROR };
        resp.message = message ? message : 'An error occurred, please try again';

        if (error)
            resp.error = error.stack;

        status = status ? status : 500;

        return res.status(status).json(resp);
    }

    checkReqBody(req) {
        if (!req || !req.body) {
            this.sendError(res, null, 'Request body empty', 400);
        }
    }

    generateToken(userObject) {
        return jwt.sign(userObject, jwtSecret);
    }
    
    verifyToken(token) {
        return jwt.verify(token, jwtSecret);
    }

    async comparePassword(password, hash) {
        return await bcrypt.compare(password, hash);
    }

    // This shouldn't be here
    async authenticateUser(req, res, next) {
        try {
            if (!req.headers || !req.headers['auth-token']) {
                return this.sendError(res, null, 'You do not have access to this resource', 401);
            }
            
            const username = this.verifyToken(token).username;
            const user = await User.findOne({username});
            if (!user) {
                return this.sendError(res, null, 'You do not have access to this resource', 401);
            }
    
            req.user = user;
            next();
        } catch (err) {
            return this.sendError(res, err, err.message, err.status);
        }
    }
}
