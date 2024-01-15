export function parseDate(rawDate) {
    const year = String(rawDate).substring(0, 4)
    const datemonth = String(rawDate).substring(4, 6)
    const day = String(rawDate).substring(6, 8)
    const completeDate = new Date(year, datemonth - 1, day)
    return completeDate
}