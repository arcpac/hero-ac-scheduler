const bcrypt = require("bcryptjs");
const { callBroker } = require("../services/mqtt");
const Schedule = require("../models/schedule.mongo");
const User = require("../models/users/users.mongo");
const nodeRedConfigMongo = require("../models/nodeRed/nodeRedConfig.mongo");
const { passwordConfirmation } = require("../utils/passwordConfirmation");

async function httpSyncData(req, res) {
  const response = await passwordConfirmation(req);
  if (response.responseCode === 200) {
    const nodeRedConfig = await nodeRedConfigMongo
      .findOne()
      .sort({ createdAt: -1 });
    const fetchedResult = await fetch(nodeRedConfig.url);
    const parsedResult = await parseResult(fetchedResult);
    if (parsedResult) {
      await callBroker(
        req.user,
        parsedResult,
        nodeRedConfig.databaseTopic,
        nodeRedConfig.broker,
        "push"
      );
      return res.status(200).json({
        responseCode: 200,
        message: "Synchronise successful",
        count: parsedResult.length,
      });
    }
  } else {
    return res.status(response.responseCode).json(response);
  }
}

async function httpSyncEdge(req, res) {
  const response = await passwordConfirmation(req);
  if (response.responseCode === 200) {
    const nodeRedConfig = await nodeRedConfigMongo
      .findOne()
      .sort({ createdAt: -1 });
    const schedules = await Schedule.find({});
    const values = [];
    schedules.map((sched) => {
      const dateStr = sched["Date"];
      const dateObject = new Date(
        dateStr.substring(0, 4),
        dateStr.substring(4, 6) - 1,
        dateStr.substring(6, 8)
      );
      const status = sched["status"] ? 1 : 0;

      const formattedDate = dateObject.toISOString().slice(0, 10);
      const array = [
        formattedDate,
        sched["Holiday Name"],
        sched["Jurisdiction"],
        status
      ];
      values.push(array);
    });

    const placeholders = values.map(() => "(?,?,?,?)").join(",");
    const sql = `
        DELETE FROM schedules;
  
        INSERT INTO schedules (date, holiday_name, jurisdiction, status)
        VALUES ${placeholders}
        ON DUPLICATE KEY UPDATE
        date = VALUES(date),
        holiday_name = VALUES(holiday_name),
        jurisdiction = VALUES(jurisdiction)
        `;
    const flattenedValues = values.reduce((acc, val) => acc.concat(val), []);

    const message = {
      topic: sql,
      payload: flattenedValues,
    };
    await callBroker(
      req.user,
      message,
      nodeRedConfig.edgeDeviceTopic,
      nodeRedConfig.broker,
      "pull"
    );
    return res
      .status(200)
      .json({ responseCode: 200, message: "Synchronise successful" });
  } else {
    return res.status(response.responseCode).json(response);
  }
}

async function parseResult(result) {
  const response = await result.json();
  var mappedResult = response.result.records;

  if (mappedResult) {
    mappedResult.forEach((obj) => {
      delete obj._id;
      obj.source = "au";
      obj.status = true;
    });
  }
  return mappedResult;
}

module.exports = {
  httpSyncData,
  httpSyncEdge,
};
