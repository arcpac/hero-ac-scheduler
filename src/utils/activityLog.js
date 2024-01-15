const ActivityLogs = require('../models/activities/activity.mongo')
const { saveActivityLog } = require('../models/users/activityLogs.model')

async function activityLog(user, action, category, object, ip) {
    const activityLogParams = {}
    const params = Object.assign(activityLogParams,
        {
            email: user.email,
            category: category,
            object: object,
            date: new Date(),
            action: await mapAction(action),
            description: await parseDesc(object),
            ip: `${ip}`
        })

    await saveActivityLog(params)
}

async function mapAction(action) {
    switch (action) {
        case "delete": return "Deleted"
        case "create": return "Created"
        case "update": return "Updated"
        case "view": return "Viewed"
        case "activate": return "Activate User"
        case "deactivate": return "Deactivate User"
        case "sync_edge_device": return "Synchronised Edge Device"
        case "sync_database": return "Synchronised Database"
        case "nodered": return "Configure Node-RED"
        case "login": return "Login"
        default: return "-"
    }
}

async function parseDesc(object) {
    return JSON.stringify(object)
}


module.exports = {
    activityLog, mapAction, parseDesc
}