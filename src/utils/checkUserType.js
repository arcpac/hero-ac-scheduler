const checkUserType = (required) => async (req, res, next) => {
    if (req.user.userType === required) {
        next();
    } else {
        return res.status(404).json({ responseCode: 401, message: "Page not found." });
    }
}

const checkUser = (list) => async (req, res, next) => {
    if (list.includes(req.user.userType)) {
        next();
    } else {
        return res.status(404).json({ responseCode: 401, message: "Unauthorised access" });
    }
}


module.exports = { checkUserType, checkUser };
