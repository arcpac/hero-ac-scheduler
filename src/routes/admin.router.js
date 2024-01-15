const express = require("express")
const jwt = require('jsonwebtoken');
const userRouter = require("./users/user.router");
const userTypeRouter = require("./users/userType.router");
const scheduleRouter = require("./schedules/schedule.router");
const activityRouter = require("./activities/activity.router");
const nodeRedRouter = require("./nodeRed/nodeRed.router");
const accountRouter = require("./account/account.router");
const dashboardRouter = require("./dashboard.router");
const { limiter } = require("../middleware/rateLimiter");

const admin = express.Router()

// admin.use(limiter);
admin.use("/users", userRouter);
admin.use("/user-types", userTypeRouter);
admin.use("/schedules", scheduleRouter);
admin.use("/node-red", nodeRedRouter);
admin.use("/activities", activityRouter);
admin.use("/account", accountRouter);
admin.use("/dashboard", dashboardRouter)

module.exports = admin;