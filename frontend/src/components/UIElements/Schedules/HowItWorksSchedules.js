function HowItWorksSchedules() {
  return (
    <div className="m-0 small text-dark">
      <ul className="ml-4 px-4">
        <li className="pb-2 mb-4">
          <strong>How to create a new holiday schedule:</strong>
          <br className="mb-2" />
          To add a new holiday, click the "Add new holiday" button. For
          modifications to existing holidays, use the "pencil" icon under
          Actions.
          <br className="mb-2" />
          <strong>Note:</strong> Holiday management (creation, editing,
          deletion) is exclusive to administrators and moderators.{" "}
          <span className="text-danger">
            Additionally, each holiday can only have one jurisdiction selected.
            If you wish to create the same holiday for other jurisdictions, you need to create a new holiday schedule.
          </span>
        </li>
      </ul>
      <ul className="ml-4 px-4">
        <strong>Holiday Sources:</strong>
        <li className="mb-1 mt-1">
          <strong>Official:</strong> These holidays are official public holidays
          from the Australian Government (www.data.gov.au).
        </li>
        <li className="mb-1">
          <strong>Custom:</strong> Holiday schedules added by system users
          (administrators/moderators).
        </li>
      </ul>
      <ul className="ml-4 px-4 mt-4 mb-4">
        <strong>Holiday Status:</strong>
        <li className="mb-1 mt-1">
          <strong>On:</strong> The holiday is currently active and will run as
          scheduled.
        </li>
        <li className="mb-1">
          <strong>Off:</strong> The holiday is currently inactive and will not
          run as scheduled.
        </li>
        <li>
          <strong>Deleted:</strong> Once a holiday is deleted, data cannot be
          recovered.
        </li>
      </ul>
      <ul className="ml-4 px-4 mt-4 mb-4">
        <strong>Action Items:</strong>
        <li className="mb-1">
          <strong>Delete:</strong> Remove a holiday schedule.
        </li>
        <li>
        <strong>Edit:</strong> This action is applicable only to custom holidays. You can update a holiday schedule's name, information, or date.
        </li>
      </ul>
      <ul className="ml-4 px-4 mt-4 mb-4">
        <strong>Filter Options:</strong>
        <li className="mb-1">
          <strong>Basic Search:</strong> Search by holiday name and source
          types.
        </li>
        <li>
          <strong>Advanced Search:</strong> Click on "Advanced Search" to access
          additional filtering options such as date range, jurisdiction
          dropdown, and status dropdown.
        </li>
      </ul>
      <p className="mb-0">
        <strong>Note:</strong> To download a CSV copy of the displayed data in
        the datatable, click the "Export" button.
      </p>
    </div>
  );
}

export default HowItWorksSchedules;
