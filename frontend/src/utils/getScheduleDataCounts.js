async function getScheduleDataCounts(schedules, year) {
    const dataCounts = {}

    let auSchedules
    let appSchedules

    auSchedules = schedules.filter(
        (schedule) => schedule.source === "au"
    );
    appSchedules = schedules.filter(
        (schedule) => schedule.source === "app"
    );

    if (year !== "All") {
        auSchedules = auSchedules.filter(
            (schedule) => schedule["Date"].slice(0, 4) === String(year)
        );
        appSchedules = appSchedules.filter(
            (schedule) => schedule["Date"].slice(0, 4) === String(year)
        );
    }

    auSchedules.forEach((schedule) => {
        const jurisdiction = schedule["Jurisdiction"];
        dataCounts[jurisdiction] =
            dataCounts[jurisdiction] || {
                count: 0,
                officialCount: 0,
                customCount: 0,
            };
        dataCounts[jurisdiction].count += 1;
        dataCounts[jurisdiction].officialCount += 1;
    });

    appSchedules.forEach((schedule) => {
        const jurisdiction = schedule["Jurisdiction"];
        dataCounts[jurisdiction] =
            dataCounts[jurisdiction] || {
                count: 0,
                officialCount: 0,
                customCount: 0,
            };
        dataCounts[jurisdiction].count += 1;
        dataCounts[jurisdiction].customCount += 1;
    });

    const dataset = Object.entries(dataCounts).map(
        ([jurisdiction, counts]) => ({
            jurisdiction,
            count: counts.count,
            officialCount: counts.officialCount,
            customCount: counts.customCount,
        })
    );
    return dataset
}

export default getScheduleDataCounts