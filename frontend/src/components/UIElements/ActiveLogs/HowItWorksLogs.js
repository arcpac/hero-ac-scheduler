function HowItWorksLogs() {
    return (
        <div className="m-0 small text-dark">
            View a detailed breakdown of the activity each of your user performs
            within the web app.
            <ul className="mt-3 ml-4 px-4">
                <li className="pb-2">
                    <b>Option 1:</b>
                    <br />
                    Select the user or category you would like to filter by.
                </li>
                <li className="pb-2">
                    <b>Option 2:</b>
                    <br />
                    Select the action you would like to filter by.
                </li>
                <li className="pb-2">
                    <b>Option 3:</b>
                    <br />
                    Enter the date range you would like to filter by.
                </li>
            </ul>
            <p className="mb-0">
                <b>Note:</b> To download a CSV copy of the displayed data in the
                datatable, click the "Export" button.
            </p>
        </div>
    )
}

export default HowItWorksLogs