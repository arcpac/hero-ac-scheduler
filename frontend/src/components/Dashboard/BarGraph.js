import BarAnimation from "../../utils/BarAnimation";
import mapJurisdiction from "../../utils/mapJurisdiction";

export default function BarGraph({ selectedYear, setSelectedYear, schedules, holidaysPerJurisdiction }) {

    const mappedJurisdiction = mapJurisdiction(holidaysPerJurisdiction)

    function dropDownData() {
        const years = [
            ...new Set(
                schedules
                    .filter(
                        (entry) => entry["Date"] && entry["Date"].length === 8
                    )
                    .map((entry) => {
                        const year = entry["Date"].slice(0, 4);
                        return year;
                    })
            ),
        ]
        return years.concat(["All"])
    }

    return (
        <div className="d-grid col-6 border bd-radius p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <h5 className="fw-bold">Holidays per jurisdiction</h5>
                </div>
                <div className="d-flex align-items-center">
                    <label htmlFor="yearDropdown" className="form-label me-2">
                        Year:
                    </label>
                    <select
                        id="yearDropdown"
                        className="form-select"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                    >
                        {
                            dropDownData().map(year => {
                                return <option key={year} value={year} >
                                    {year}
                                </option>
                            })
                        }
                    </select>
                </div>
            </div>
            <BarAnimation holidaysPerJurisdiction={mappedJurisdiction} />
            <div className="mt-4"></div>
        </div>
    )
}
