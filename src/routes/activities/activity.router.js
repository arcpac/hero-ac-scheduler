const express = require("express");
const { httpAddNewActivityLogs, httpGetActivityLogs } = require("../../controllers/activityLogs.controller");
const { authorizationUser } = require("../../middleware/authoriseUser");
const { checkUser } = require("../../utils/checkUserType");

const activityRouter = express.Router()
activityRouter.use(authorizationUser)

activityRouter.use(checkUser(["super_admin", "administrator"]))
activityRouter.get("/", httpGetActivityLogs)
activityRouter.post("/", httpAddNewActivityLogs)

module.exports = activityRouter