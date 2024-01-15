const { getAllActivityLogs, saveActivityLog } = require("../models/users/activityLogs.model");
const { mapAction, parseDesc } = require("../utils/activityLog");

async function httpGetActivityLogs(req, res) {
    const activityLogs = await getAllActivityLogs();
    return res.status(200).json(activityLogs)
}

async function httpAddNewActivityLogs(req, res) {
    const activityLogParams = req.body
    const params = Object.assign(activityLogParams,
        {
            date: new Date(),
            action: await mapAction(activityLogParams.action),
            description: await parseDesc(activityLogParams.object),
            ip: `${req.ip}`

        })
    await saveActivityLog(params)
}
module.exports = {
    httpAddNewActivityLogs,
    httpGetActivityLogs
}