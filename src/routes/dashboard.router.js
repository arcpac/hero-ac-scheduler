const express = require("express");
const { httpSyncData, httpSyncEdge } = require("../controllers/sync.controller");

const dashboardRouter = express.Router()
const { checkUserType, checkUser } = require("../utils/checkUserType");
const { authorizationUser } = require("../middleware/authoriseUser");
dashboardRouter.use(authorizationUser)

dashboardRouter.use(checkUser(["super_admin", "administrator"]))
dashboardRouter.post("/sync-data", httpSyncData);
dashboardRouter.post("/sync-edge-devices", httpSyncEdge);

module.exports = dashboardRouter;