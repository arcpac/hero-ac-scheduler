const nodeRedConfigMongo = require("../../models/nodeRed/nodeRedConfig.mongo");
const { activityLog } = require("../../utils/activityLog");

async function httpGetNodeRed(req, res) {
    const result = await nodeRedConfigMongo.findOne().sort({ createdAt: -1 });
    return res.status(200).json(result);
}

async function httpAddNodeRedConfig(req, res) {
    const nodeRedParams = req.body
    console.log(nodeRedParams)
    const newNodeRedConfig = new nodeRedConfigMongo(nodeRedParams)
    try {
        const savedNodeRedConfig = await newNodeRedConfig.save()
        console.log(savedNodeRedConfig)

        if (savedNodeRedConfig) {
            return res.status(201).json(savedNodeRedConfig)
        }
    } catch (err) {
        return res.status(404).json(err)
    }
}

async function httpUpdateNodeRedConfig(req, res) {
    const nodeRedId = req.params.id
    const params = req.body
    const updatedNodeRedConfig = await nodeRedConfigMongo.findByIdAndUpdate(nodeRedId, params)
    try {
        if (!updatedNodeRedConfig) {
            return res.status(404).json({ responseCode: 404, message: "Update not successful" })
        }
        await activityLog(req.user, "nodered", "nodered", params, "123.123");
        return res.status(201).json({ responseCode: 201, message: updatedNodeRedConfig })
    } catch (err) {
        return res.status(404).json(err)
    }
}

module.exports = {
    httpGetNodeRed,
    httpAddNodeRedConfig,
    httpUpdateNodeRedConfig
}