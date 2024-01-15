const jwt = require("jsonwebtoken")
const User = require("../models/users/users.mongo")

module.exports = async (req, res, next) => {

    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            const error = { message: "Authentication failed", responseCode: 401 }
            return next(error)
        }
        const decodedToken = jwt.verify(token, "supersecret_dont_share")
        const user = await User.findById(decodedToken.userId)
        let parsedTokens;
        parsedTokens = user.tokens.map(t => t.token)
        if (parsedTokens.includes(token)) {
            req.userData = { userId: decodedToken.userId }
            next()
        } else {
            return res.status(404).json({ message: "Authentication failed" })
        }
    } catch (err) {
        return res.status(404).json(err)
    }

}