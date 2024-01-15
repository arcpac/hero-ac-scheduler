const mongoose = require("mongoose")

const userTypesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    create: {
        type: Boolean,
        required: true
    },
    delete: {
        type: Boolean,
        required: true
    },
    read: {
        type: Boolean,
        required: true
    },
    edit: {
        type: Boolean,
        required: true
    },
})

module.exports = mongoose.model("UserType", userTypesSchema)