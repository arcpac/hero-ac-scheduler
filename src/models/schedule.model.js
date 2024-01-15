const { activityLog } = require("../utils/activityLog");
const Schedule = require("./schedule.mongo")
const mqtt = require('mqtt');


async function getAllSchedules() {
    return await Schedule.find({})
}

async function saveSchedule(schedule) {
    const checkSchedule = await Schedule.findOne({ "Date": schedule["Date"], "Jurisdiction": schedule["Jurisdiction"] })

    if (checkSchedule) {
        return { responseCode: 404, type: "exist", message: "Holiday schedule already exists." }
    }
    const newSchedule = new Schedule(schedule)
    try {
        const savedSchedule = await newSchedule.save()
        if (savedSchedule) {
            return { responseCode: 201, message: savedSchedule }
        }
    } catch (err) {
        return { responseCode: 404, message: err }
    }
}

async function addNewSchedule(creator, scheduleParams) {
    const date = scheduleParams["Date"]
    const newSchedule = Object.assign(scheduleParams,
        {
            "Date": date,
            "source": "app",
            "status": true,
            embeddedUser: {
                name: `${creator.firstName} ${creator.lastName}`,
                email: `${creator.email}`
            }
        })
    const result = await saveSchedule(newSchedule)
    return result;
}

async function updateSchedule(scheduleId, scheduleParams) {
    try {
        const date = scheduleParams["Date"]
        const newScheduleParams = Object.keys(scheduleParams).length === 1 && "status" in scheduleParams ? scheduleParams : Object.assign(scheduleParams,
            {
                "Date": date,
                "source": "app"
            })
        const updatedSchedule = await Schedule.findByIdAndUpdate(scheduleId, newScheduleParams)

        if (!updatedSchedule) {
            return { responseCode: 404, message: "Error updating schedule." }
        }
        return { responseCode: 201, message: updatedSchedule }
    }
    catch (err) {
        return { responseCode: 404, message: err }
    }
}
async function deleteSchedule(scheduleId) {
    try {
        const deletedSchedule = await Schedule.findByIdAndDelete(scheduleId, { new: true })
        if (!deletedSchedule) {
            return { responseCode: 404, message: "Error deleting schedule." }
        }
        // await activityLog(req.user, "delete", "schedule", JSON.stringify(deletedSchedule), req.ip);

        return { responseCode: 200, message: `${deletedSchedule["Holiday Name"]} has been deleted` }
    } catch (err) {
        return { responseCode: 404, message: err }
    }
}

async function deleteMultipleSchedules(ids) {
    if (!ids || !ids.length) {
        return res.status(400).json({ error: 'No schedule selected.' });
    }
    const objectIds = ids.split(",")
    try {
        const schedulesId = await (await Schedule.find({ _id: { $in: objectIds } })).map(sched => sched._id)
        if (!schedulesId) {
            return { responseCode: 404, message: "No existing schedules" }
        }
        try {
            const multipleDeletedSchedules = await Schedule.deleteMany({ _id: { $in: schedulesId } })
            if (!multipleDeletedSchedules) {
                return { responseCode: 404, message: "Error deleting schedules." }
            }
            // await activityLog(req.user, "delete", "schedule", JSON.stringify(multipleDeletedSchedules), req.ip);

            return { responseCode: 200, message: `Deleted ${objectIds.length} holidays` }
        } catch (err) {
            return { responseCode: 404, message: err }
        }
    } catch (err) {
        return { responseCode: 404, message: err }
    }
}


async function getSchedule(scheduleId) {
    try {
        const schedule = await Schedule.findById(scheduleId)
        return { responseCode: 200, message: schedule }
    } catch (error) {
        return { responseCode: 404, message: err }
    }
}

// Utilities

function formatDateToCustomFormat(date) {
    const formattedDate = new Date(date)
    const year = formattedDate.getFullYear();
    const month = String(formattedDate.getMonth() + 1).padStart(2, '0');
    const day = String(formattedDate.getDate()).padStart(2, '0');

    const result = {
        formattedDate: `${year}${day}${month}`,
        year: `${year}`,
    }
    return result;
}

module.exports = {
    getAllSchedules,
    addNewSchedule,
    saveSchedule,
    updateSchedule,
    deleteSchedule,
    getSchedule,
    deleteMultipleSchedules
}