const express = require("express");
const { httpAddNewUserType, httpGetUserTypes, httpDeleteUserType } = require("../../controllers/userType.controller");


const userTypeRouter = express.Router();
userTypeRouter.get("/", httpGetUserTypes)
userTypeRouter.post("/", httpAddNewUserType)
userTypeRouter.delete("/:id", httpDeleteUserType)

module.exports = userTypeRouter;
