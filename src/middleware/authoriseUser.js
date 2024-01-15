const jwt = require('jsonwebtoken');

const authorizationUser = (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    if (!token) {
        return res.sendStatus(401);
    }

    jwt.verify(token, 'supersecret_dont_share', (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }

        req.user = user;
        next();
    });
};

module.exports = {
    authorizationUser
}