const mongoose = require("mongoose")

const embeddedUserSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: String,
    name: String
});

const schedulesSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.ObjectId,
        default: () => new mongoose.Types.ObjectId(),
    },
    "Date": {
        type: String,
        required: true
    },
    "Holiday Name": {
        type: String,
        required: true
    },
    "Information": {
        type: String,
        required: false
    },
    "More Information": {
        type: String,
        required: false
    },
    "Jurisdiction": {
        type: String,
        required: true
    },
    "source": {
        type: String,
        required: true
    },
    "status": {
        type: Boolean,
        default: true,
        required: true
    }, embeddedUser: {
        type: embeddedUserSchema,
        default: {}
    },
}, {
    timestamps: true
})

module.exports = mongoose.model("Schedule", schedulesSchema)