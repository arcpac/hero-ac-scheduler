const ActivityLogs = require("./activityLogs.mongo")

async function getAllActivityLogs() {
    return await ActivityLogs.find({})
}

async function saveActivityLog(params) {
    const newActivityLog = new ActivityLogs(params)
    await newActivityLog.save()
}

module.exports = {
    getAllActivityLogs,
    saveActivityLog,
}