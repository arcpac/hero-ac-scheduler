const mongoose = require("mongoose")

const activityLogsSchema = new mongoose.Schema({
    "date": {
        type: String,
        required: true
    },
    "email": {
        type: String,
        required: true
    },
    "action": {
        type: String,
        required: false
    },
    "description": {
        type: String,
        required: false
    },
    "category": {
        type: String,
        required: false
    },
    "ip": {
        type: String,
        required: false
    },
}, {
    timestamps: true
})

module.exports = mongoose.model("Activity Logs", activityLogsSchema)