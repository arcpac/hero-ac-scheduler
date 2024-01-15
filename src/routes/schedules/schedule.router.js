const express = require("express")
const { httpGetSchedules, httpGetSchedule, httpAddNewSchedule, httpUpdateSchedule, httpDeleteSchedule, httpMultiDeleteSchedule } = require("../../controllers/schedule.controller")
const { checkUser } = require("../../utils/checkUserType")
const { authorizationUser } = require("../../middleware/authoriseUser")
const { scheduleValidation } = require("../../utils/validator")

const scheduleRouter = express.Router()
scheduleRouter.use(authorizationUser)

scheduleRouter.use(checkUser(["super_admin", "administrator", "moderator", "viewer"]))
scheduleRouter.get("/", httpGetSchedules)
scheduleRouter.get("/:id", httpGetSchedule)

scheduleRouter.use(checkUser(["super_admin", "administrator", "moderator"]))
scheduleRouter.post("/", scheduleValidation, httpAddNewSchedule)
scheduleRouter.put("/:id", scheduleValidation, httpUpdateSchedule)
scheduleRouter.post("/multiple/delete", httpMultiDeleteSchedule)
scheduleRouter.delete("/:id", httpDeleteSchedule)


module.exports = scheduleRouter