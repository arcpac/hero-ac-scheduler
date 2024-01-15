const Activity = require("./activity.mongo")

async function getAllActivities() {
    try {
        const activity = await Activity.find({}) //Activity being the schema created 
        return { responseCode: 200, message: activity }
    } catch (err) {
        return { responseCode: 404, message: err }
    }
}

async function addNewActivity(activityParams) {

    const newActivity = new Activity(activityParams)
    try {
        const savedActivity = await newActivity.save()
        if (savedActivity) {
            return { responseCode: 201, message: savedActivity }
        }
    } catch (err) {
        return { responseCode: 404, message: err }
    }
}

module.exports = {
    getAllActivities,
    addNewActivity,
}