function HowItWorksUsers() {
    return (<div className="m-0 small text-dark">
        <ul className="ml-4 px-4">
            <li className="pb-2 mb-4">
                <b>How to create a new user account.</b>
                <br className="mb-2" />
                To create a new user account, click the "Add new user" button.
                For modifying an existing account, use the "pencil" icon under
                Actions.
                <br className="mb-2" />
                <b>Note:</b> User account management (creation, editing,
                deletion) is exclusive to administrators.
            </li>
        </ul>
        <ul className="ml-4 px-4">
            <b>User Roles:</b>
            <li className="mb-1 mt-1">
                <b>Viewer:</b> Can view schedules.
            </li>
            <li className="mb-1">
                <b>Moderator:</b> Can view, create, update, and delete
                schedules.
            </li>
            <li>
                <b>Administrator:</b> Can view, create, update, and delete
                schedules and users.
            </li>
        </ul>
        <ul className="ml-4 px-4 mt-4 mb-4">
            <b>Action Items:</b>
            <li className="mb-1 mt-1">
                <b>Activate/Deactivate:</b> Deactivate or activate a user's
                account.
            </li>
            <li className="mb-1">
                <b>Delete:</b> Delete a user's account.
            </li>
            <li>
                <b>Edit:</b> Update a user's role, name, picture, or password.
            </li>
        </ul>
        <ul className="ml-4 px-4 mt-4 mb-4">
            <b>User Status:</b>
            <li className="mb-1 mt-1">
                <b>Active:</b> The account is currently in good standing with
                no issues.
            </li>
            <li className="mb-1">
                <b>Deactivated:</b> A user account has been temporarily
                deactivated by an administrator and is temporarily unable to
                log in to the system. Reactivation is possible only by the
                administrator.
            </li>
            <li>
                <b>Deleted:</b> Users with deleted status are unable to log in to the system. However, administrators have the capability to reactivate these accounts.
            </li>
        </ul>
        <p className="mb-0">
            <b>Note:</b> To download a CSV copy of the displayed data in the
            datatable, click the "Export" button.
        </p>
    </div>
    )
}
export default HowItWorksUsers