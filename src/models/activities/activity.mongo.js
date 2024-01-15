const mongoose = require("mongoose")

const activitiesSchema = new mongoose.Schema({
    userId: {
        type: String,
    },
    email: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    action: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    ip: {
        type: String,
        required: false
    },
}, {
    timestamps: true
})

module.exports = mongoose.model("Activity", activitiesSchema) //Setting new collection as "activities" as MongoDB always pluralize and lowercase