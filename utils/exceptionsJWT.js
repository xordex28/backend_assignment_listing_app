const expressJwt = require('express-jwt');
const config = require('config.json');
const userService = require('../users/users.service');

const isRevoked = async (req, payload, done) => {
    const user = await userService.getUserById(payload.sub);
    if (!user) {
        return done(null, true);
    }
    done();
};

const jwt = () => {
    const secret = config.secret;
    return expressJwt({ secret, isRevoked }).unless({
        path: []
    });
}

module.exports = jwt;