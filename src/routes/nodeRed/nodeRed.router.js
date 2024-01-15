const express = require("express")
const { httpGetNodeRed, httpAddNodeRedConfig, httpUpdateNodeRedConfig } = require("../../controllers/nodeRed/nodeRed.controller")
const { checkUser } = require("../../utils/checkUserType")
const { authorizationUser } = require("../../middleware/authoriseUser")


const nodeRedRouter = express.Router()
nodeRedRouter.use(authorizationUser)

nodeRedRouter.use(checkUser(["super_admin", "administrator"]))
nodeRedRouter.get("/", httpGetNodeRed)

nodeRedRouter.use(checkUser(["super_admin"]))
nodeRedRouter.post("/", httpAddNodeRedConfig)
nodeRedRouter.put("/:id", httpUpdateNodeRedConfig)


module.exports = nodeRedRouter;