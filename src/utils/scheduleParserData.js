async function parseScheduleData(schedParams) {
    const dateStr = schedParams["Date"];
    const dateObject = new Date(dateStr.substring(0, 4), dateStr.substring(4, 6) - 1, dateStr.substring(6, 8));
    const formattedDate = dateObject.toISOString().slice(0, 10);
    const nestedArray = [
        [
            formattedDate,
            schedParams["Holiday Name"],
            schedParams["Jurisdiction"],
        ]
    ]
    const placeholders = nestedArray.map(() => '(?,?,?)').join(',');
    const sql = `INSERT INTO schedules (date, holiday_name, jurisdiction) VALUES ${placeholders} ON DUPLICATE KEY UPDATE date = VALUES(date), holiday_name = VALUES(holiday_name), jurisdiction = VALUES(jurisdiction)`;
    const flattenedValues = nestedArray.reduce((acc, val) => acc.concat(val), []);

    const message = {
        topic: sql,
        payload: flattenedValues
    }

    return message
}

module.exports = {
    parseScheduleData
}