export function dayMonthYear(rawDate) {
    try {
        const year = String(rawDate).substring(0, 4);
        const month = String(rawDate).substring(4, 6);
        const day = String(rawDate).substring(6, 8);
        const completeDate = new Date(`${year}-${month}-${day}T00:00:00`);
        const formattedDate = new Intl.DateTimeFormat("en-AU", {
            month: "short",
            day: "numeric",
            year: "numeric",
        }).format(completeDate);
        return formattedDate;
    } catch (error) {
        return "Invalid Date";
    }
}