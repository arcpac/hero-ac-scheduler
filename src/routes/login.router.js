const express = require("express");
const { login } = require("../controllers/login/login.controller");
const { signInLimter } = require("../middleware/rateLimiter");

const loginRouter = express.Router();
loginRouter.get("/", (req, res) => {
    res.json({ message: "login page" })
});
loginRouter.post("/", signInLimter, login)

module.exports = loginRouter;