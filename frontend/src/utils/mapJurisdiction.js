export default function mapJurisdiction(holidaysPerJurisdiction) {
    const jurisdictions = ["act", "vic", "nsw", "wa", "sa", "tas", "nt", "qld"]
    const indexes = []
    const tableContent = [];

    function parseObject(count, officialCount, jurisdiction, customCount) {
        return {
            count: count,
            jurisdiction: jurisdiction,
            officialCount: officialCount,
            customCount: customCount,
        }
    }

    holidaysPerJurisdiction.map((holiday) => {
        if (jurisdictions.includes(holiday.jurisdiction)) {
            indexes.push(jurisdictions.indexOf(holiday.jurisdiction))
            tableContent.push(parseObject(holiday.count, holiday.officialCount, holiday.jurisdiction, holiday.customCount))
        }
    })

    for (let index = 0; index < jurisdictions.length; index++) {
        !indexes.includes(index) && tableContent.push(parseObject(0, 0, jurisdictions[index], 0))
    }

    return tableContent
}