import mapJurisdiction from "../../utils/mapJurisdiction"

export default function JurisdictionTable({ holidaysPerJurisdiction }) {

    const mappedJurisdiction = mapJurisdiction(holidaysPerJurisdiction)

    return (
        <div className="d-grid col-6 border bd-radius p-4">
            <h5 className="fw-bold">Count of holidays per jurisdiction</h5>
            <table className="table">
                <thead>
                    <tr>
                        <th className="gray-bg">Jurisdiction</th>
                        <th className="gray-bg text-center">Total Holidays</th>
                        <th className="gray-bg text-center">Official Holidays</th>
                        <th className="gray-bg text-center">Custom Holidays</th>
                    </tr>
                </thead>
                <tbody>
                    {mappedJurisdiction.map((entry) => (
                        <tr key={entry.jurisdiction}>
                            <td>{entry.jurisdiction.toUpperCase()}</td>
                            <td className="text-center">{entry.count}</td>
                            <td className="text-center">{entry.officialCount}</td>
                            <td className="text-center">{entry.customCount}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}