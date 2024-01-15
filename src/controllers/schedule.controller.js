const { getAllSchedules, addNewSchedule, saveSchedule, updateSchedule, deleteSchedule, getSchedule, deleteMultipleSchedules } = require("../models/schedule.model");
const { callBroker } = require("../services/mqtt");
const { activityLog } = require("../utils/activityLog");
const { validationResult } = require('express-validator');

const { passwordConfirmation } = require("../utils/passwordConfirmation");
const { parseScheduleData } = require("../utils/scheduleParserData");

async function httpGetSchedules(req, res) {
    const schedules = await getAllSchedules();
    return res.status(200).json(schedules);
}

async function httpGetSchedule(req, res) {
    const scheduleId = req.params.id
    const result = await getSchedule(scheduleId);
    return res.status(result.responseCode).json(result);
}

async function httpAddNewSchedule(req, res) {
    const scheduleParams = req.body
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(404).json({ responseCode: 404, errors: errors.array() });
    }
    const result = await addNewSchedule(req.user, scheduleParams)
    if (result.responseCode === 201) {
        const mqttPayload = await parseScheduleData(scheduleParams)
        await callBroker(req.user, mqttPayload, "pull", "mqtt://localhost", "pull")
        await activityLog(req.user, "create", "schedule", scheduleParams, req.ip);
    }
    res.status(result.responseCode).json(result)
}

async function httpUpdateSchedule(req, res) {
    const scheduleId = req.params.id
    const scheduleParams = req.body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(404).json({ responseCode: 404, errors: errors.array() });
    }
    const result = await updateSchedule(scheduleId, scheduleParams)
    if (result.responseCode === 200) {
        await activityLog(req.user, "update", "schedule", result.message, req.ip);
    }
    res.status(result.responseCode).json(result)
}

async function httpDeleteSchedule(req, res) {
    const scheduleId = req.params.id
    const result = await deleteSchedule(scheduleId)
    res.status(result.responseCode).json(result)
}

async function httpMultiDeleteSchedule(req, res) {
    const response = await passwordConfirmation(req);
    if (response.responseCode === 200) {
        const { ids } = req.query;
        const result = await deleteMultipleSchedules(ids)
        if (result.responseCode === 200) {
            await activityLog(req.user, "delete", "schedule", result.message, req.ip);
        }
        res.status(result.responseCode).json(result)
    }
    else {
        return res.status(response.responseCode).json(response);
    }
}

module.exports = {
    httpGetSchedules,
    httpGetSchedule,
    httpAddNewSchedule,
    httpUpdateSchedule,
    httpDeleteSchedule,
    httpMultiDeleteSchedule
}