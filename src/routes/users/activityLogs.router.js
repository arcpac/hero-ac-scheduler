const express = require("express");
const { httpAddNewActivityLogs, httpGetActivityLogs } = require("../../controllers/activityLogs.controller");
const { getAllActivityLogs } = require("../../models/users/activityLogs.model");


const activityLogsRouter = express.Router();
activityLogsRouter.get("/", httpGetActivityLogs)
activityLogsRouter.post("/", httpAddNewActivityLogs)

module.exports = activityLogsRouter;
