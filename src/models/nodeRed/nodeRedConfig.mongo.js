const mongoose = require("mongoose");

const nodeRedConfigSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    databaseTopic: {
        type: String,
        required: true
    },
    edgeDeviceTopic: {
        type: String,
        required: true
    },
    broker: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});
module.exports = mongoose.model("NodeRedConfig", nodeRedConfigSchema)