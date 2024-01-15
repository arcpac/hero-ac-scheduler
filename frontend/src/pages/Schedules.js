import React, { useCallback, useContext, useEffect, useState } from "react";
import { Button } from "primereact/button";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { AuthContext } from "../context/auth-context";
import { httpGetSchedules } from "../hooks/requests";
import { CSVLink } from "react-csv";
import Swal from "sweetalert2";
import CreateScheduleModal from "../components/UIElements/Schedules/CreateScheduleModal";
import UpdateScheduleModal from "../components/UIElements/Schedules/UpdateScheduleModal";
import moment from "moment";
import "../styles/Schedules.css";
import { Tag } from "primereact/tag";
import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { MultiSelect } from "primereact/multiselect";
import { Dropdown } from "primereact/dropdown";
import { DateRangePicker } from "rsuite";
import { ToggleButton } from "primereact/togglebutton";
import { InputSwitch } from "primereact/inputswitch";
import SearchIcon from "@mui/icons-material/Search";
import { InputAdornment, TextField } from "@mui/material";
import { jurisdictions } from "../utils/jurisdictions";
import ClearIcon from "@mui/icons-material/Clear";
import "rsuite/dist/rsuite.min.css";
import HeaderTabs from "../components/UIElements/Schedules/HeaderTabs";
import { dayMonthYear } from "../utils/dayMonthYear";
import IconButton from "@mui/material/IconButton";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import HowItWorks from "../components/UIElements/Accordion";
import HowItWorksSchedules from "../components/UIElements/Schedules/HowItWorksSchedules";
import ResponseAlert from "../components/UIElements/ResponseAlert";

function Schedules() {
  const authCtx = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [schedules, setSchedules] = useState([]);
  const [schedule, setSelectedSchedule] = useState({ Date: "20240101" });
  const [editMode, setEditMode] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleCleared, setToggleCleared] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [selectedTab, setSelectedTab] = useState("All Source");
  const [selectedJurisdictions, setSelectedJurisdictions] = useState([]);
  const [allJurisdictions, setAllJurisdictions] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [statusValues, setStatusValues] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const statusOptions = ["All Status", "On", "Off"];
  const [multiDeleteCompleted, setMultiDeleteCompleted] = useState(false);
  const [officialFilters, setOfficialFilters] = useState({
    filterText: "",
    selectedJurisdictions: [],
    startDate: null,
    endDate: null,
  });

  const [customFilters, setCustomFilters] = useState({
    filterText: "",
    selectedJurisdictions: [],
    startDate: null,
    endDate: null,
  });

  const handleClearSelection = () => {
    setSelectedRows([]);
  };

  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);

  const toggleAdvancedFilter = () => {
    setShowAdvancedFilter((prev) => !prev);
  };

  useEffect(() => {
    const sortedJurisdictions = jurisdictions()
      .slice()
      .sort((a, b) => a.label.localeCompare(b.label));

    setAllJurisdictions(sortedJurisdictions);
  }, []);

  const handleTabClick = (tab) => {
    setSelectedTab(tab);

    setFilterText("");
    setSelectedJurisdictions([]);

    setOfficialFilters({
      filterText: "",
      selectedJurisdictions: [],
      startDate: null,
      endDate: null,
    });

    setCustomFilters({
      filterText: "",
      selectedJurisdictions: [],
      startDate: null,
      endDate: null,
    });
  };

  const getAllSchedules = useCallback(async () => {
    const fetchedSchedules = await httpGetSchedules(authCtx);
    setSchedules(fetchedSchedules);
  }, []);

  useEffect(() => {
    document.title = "Schedules - Airconnect";
    const fetchData = async () => {
      try {
        setLoading(true);
        const fetchedSchedules = await httpGetSchedules(authCtx);

        const currentYear = new Date().getFullYear();

        const sortedSchedules = fetchedSchedules.slice().sort((a, b) => {
          const dateA = moment(a.Date, "YYYYMMDD");
          const dateB = moment(b.Date, "YYYYMMDD");

          if (dateA.year() === dateB.year()) {
            return dateA.isBefore(dateB) ? -1 : 1;
          } else if (dateA.year() === currentYear) {
            return -1;
          } else {
            return 1;
          }
        });

        setSchedules(sortedSchedules);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [showModal, showUpdateModal, statusValues]);

  const handleViewSchedule = (data) => {
    setEditMode(false);
    setSelectedSchedule(data);
    setShowUpdateModal(true);
  };

  const handleCloseUpdateModal = () => setShowUpdateModal(false);

  const handleUpdateModal = (data) => {
    setEditMode(true);
    setSelectedSchedule(data);
    setShowUpdateModal(true);
  };

  const handleFilter = (e) => {
    if (selectedTab === "Official") {
      setOfficialFilters((prev) => ({ ...prev, filterText: e.target.value }));
    } else if (selectedTab === "Custom") {
      setCustomFilters((prev) => ({ ...prev, filterText: e.target.value }));
    } else {
      setFilterText(e.target.value);
    }
  };

  const handleJurisdictionChange = (e) => {
    if (selectedTab === "Official") {
      setOfficialFilters((prev) => ({
        ...prev,
        selectedJurisdictions: e.value,
      }));
    } else if (selectedTab === "Custom") {
      setCustomFilters((prev) => ({
        ...prev,
        selectedJurisdictions: e.value,
      }));
    } else {
      setSelectedJurisdictions(e.value);
    }
  };

  const handleDateRangeChange = (value) => {
    if (value && value.length === 2) {
      setStartDate(value[0]);
      setEndDate(value[1]);
    } else {
      setStartDate(null);
      setEndDate(null);
    }
  };

  const filteredSchedules = schedules.filter((item) => {
    const isWithinDateRange =
      (!startDate || moment(item.Date) >= startDate) &&
      (!endDate || moment(item.Date) <= endDate);

    const statusFilter =
      selectedStatus === "All Status" ||
      item.status === (selectedStatus === "On");

    if (selectedTab === "Official") {
      const jurisdictionFilter =
        officialFilters.selectedJurisdictions.length === 0 ||
        officialFilters.selectedJurisdictions.includes(
          item.Jurisdiction.toLowerCase()
        );

      const includesFilter = item["Holiday Name"]
        .toLowerCase()
        .includes(officialFilters.filterText.toLowerCase());

      return (
        isWithinDateRange &&
        jurisdictionFilter &&
        includesFilter &&
        item["source"] === "au" &&
        statusFilter
      );
    } else if (selectedTab === "Custom") {
      const jurisdictionFilter =
        customFilters.selectedJurisdictions.length === 0 ||
        customFilters.selectedJurisdictions.includes(
          item.Jurisdiction.toLowerCase()
        );

      const includesFilter = item["Holiday Name"]
        .toLowerCase()
        .includes(customFilters.filterText.toLowerCase());

      return (
        isWithinDateRange &&
        jurisdictionFilter &&
        includesFilter &&
        item["source"] !== "au" &&
        statusFilter
      );
    } else {
      const jurisdictionFilter =
        selectedJurisdictions.length === 0 ||
        selectedJurisdictions.includes(item.Jurisdiction.toLowerCase());

      const includesFilter = item["Holiday Name"]
        .toLowerCase()
        .includes(filterText.toLowerCase());

      return (
        isWithinDateRange &&
        jurisdictionFilter &&
        includesFilter &&
        statusFilter
      );
    }
  });

  const columns = [
    {
      field: "Date",
      header: "Date",
      sortable: true,
      body: (rowData) => dayMonthYear(rowData["Date"]),
      style: { width: "150px" },
    },
    {
      field: "Holiday Name",
      header: "Holiday name",
      sortable: true,
      body: (rowData) => (
        <Button
          className="buttonStyle"
          onClick={() => handleViewSchedule(rowData)}
        >
          {rowData["Holiday Name"]}
        </Button>
      ),
      style: { width: "300px" },
    },
    {
      field: "Jurisdiction",
      header: "Jurisdiction",
      sortable: true,
      filterMatchMode: "custom",
      filterFunction: {},
      filter: true,
      filterElement: (
        <MultiSelect
          value={selectedJurisdictions}
          options={allJurisdictions}
          onChange={handleJurisdictionChange}
          placeholder="Select Jurisdictions"
          optionLabel="label"
          optionValue="value"
        />
      ),
      body: (rowData) => rowData["Jurisdiction"].toUpperCase(),
      style: { width: "150px" },
    },
    {
      field: "source",
      header: "Source",
      sortable: true,
      body: (rowData) => (
        <Tag
          value={rowData["source"] === "au" ? "● OFFICIAL" : "● CUSTOM"}
          className={
            rowData["source"] === "au" ? "blueBackground" : "yellowBackground"
          }
        />
      ),
      style: { width: "150px" },
    },
    {
      field: "status",
      header: "Status",
      sortable: true,
      body: (rowData) => (
        <InputSwitch
          checked={rowData.status}
          onChange={() => handleStatusToggle(rowData)}
        />
      ),
      style: { width: "110px", textAlign: "left" },
    },
    {
      field: "Actions",
      header: "Actions",
      body: (rowData) => (
        <>
          {["super_admin", "administrator", "moderator"].includes(
            authCtx.activeUser.userType
          ) && (
              <OverlayTrigger
                overlay={
                  <Tooltip id={`tooltip-delete-${rowData.userId}`}>
                    Delete holiday
                  </Tooltip>
                }
              >
                <Button
                  icon="pi pi-trash no-padding"
                  outlined
                  id="no-padding"
                  onClick={() => handleDelete(rowData)}
                />
              </OverlayTrigger>
            )}
          {rowData.source !== "au" && (
            <OverlayTrigger
              overlay={
                <Tooltip id={`tooltip-edit-${rowData.userId}`}>Edit holiday</Tooltip>
              }
            >
              <Button
                icon="pi pi-pencil"
                outlined
                id="no-padding"
                onClick={() => handleUpdateModal(rowData)}
              />
            </OverlayTrigger>
          )}
        </>
      ),
      style: { width: "150px", textAlign: "left" },
    },
  ];

  const handleStatusToggle = async (rowData) => {
    const updatedStatusValues = { ...statusValues };
    updatedStatusValues[rowData._id] = !statusValues[rowData._id];
    setStatusValues(updatedStatusValues);
    const response = await fetch(
      `http://localhost:8000/admin/schedules/${rowData._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + authCtx.token,
        },
        body: JSON.stringify({ status: !rowData.status }),
      }
    );
    const responseData = await response.json();
    console.log(responseData)
  };

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  async function handleDelete(row) {
    Swal.fire({
      title: "Are you sure?",
      html: `You are about to delete ${row["Holiday Name"]} in ${row[
        "Jurisdiction"
      ].toUpperCase()}.<br/><strong>This action cannot be undone.</strong>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
      showClass: {
        popup: `
        animate__fadeInDown
        animate__faster
      `,
      },
      hideClass: {
        popup: `
        animate__animated
        animate__fadeOutUp
        animate__faster
      `,
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await fetch(
          `http://localhost:8000/admin/schedules/${row._id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + authCtx.token,
            },
          }
        );
        const responseData = await response.json();
        getAllSchedules();
        const alertDetails = {
          text: "The holiday schedule has successfully been deleted.",
          successIcon: "success",
          confirmButtonClass: "btn btn-success",
        };
        ResponseAlert(responseData, alertDetails);
      }
    });
  }

  const officialHolidaysCount = filteredSchedules.filter(
    (item) => item["source"] === "au"
  ).length;

  const customHolidaysCount = filteredSchedules.filter(
    (item) => item["source"] !== "au"
  ).length;

  const totalCount = officialHolidaysCount + customHolidaysCount;

  const calculateSelectedCount = () => {
    return selectedRows.length;
  };

  const handleMultiDelete = async () => {
    if (selectedRows.length === 0) {
      return;
    }

    Swal.fire({
      title: "Enter password",
      html: `You are about to delete ${selectedRows.length} holiday(s).<br/><strong>This action cannot be undone.</strong>`,
      input: "password",
      showClass: {
        popup: `
        animate__fadeInDown
        animate__faster
      `,
      },
      hideClass: {
        popup: `
        animate__animated
        animate__fadeOutUp
        animate__faster
      `,
      },
      inputPlaceholder: "Enter your password",
      inputAttributes: {
        maxlength: "50",
        autocapitalize: "off",
        autocorrect: "off",
      },
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Delete holiday(s)",
      showLoaderOnConfirm: true,
      preConfirm: async (enteredPassword) => {
        // console.log(enteredPassword)
        try {
          const deleteIds = selectedRows.map((row) => row._id);
          const response = await fetch(
            `http://localhost:8000/admin/schedules/multiple/delete?ids=${deleteIds}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + authCtx.token,
              },
              body: JSON.stringify({
                password: enteredPassword,
              }),
            }
          );
          const responseData = await response.json();
          getAllSchedules();
          return responseData;
        } catch (error) {
          Swal.showValidationMessage(`Request failed: ${error}`);
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then(async (result) => {
      if ("value" in result) {
        const response =
          "responseCode" in result.value ? result.value : { responseCode: 404 };
        if (response.responseCode === 404) {
          Swal.fire({
            position: "top-end",
            icon: "warning",
            text: `${result.value.message}`,
            showConfirmButton: false,
            timer: 1500,
          });
        }
        if (response.responseCode === 200) {
          setSelectedRows([]);
          Swal.fire({
            position: "top-end",
            icon: "success",
            text: `${result.value.message}`,
            showConfirmButton: false,
            timer: 1500,
          });
        }
      }
    });
  };

  const footer = (
    <div>
      <div className="p-d-flex p-jc-between p-my-3 p-2">
        <div>
          Total Holidays: {totalCount} | Official Holidays:{" "}
          {officialHolidaysCount} | Custom Holidays: {customHolidaysCount}
        </div>
      </div>
    </div>
  );

  const header = (
    <div className="row justify-content-between align-items-center mb-3">
      {selectedRows.length > 0 && !multiDeleteCompleted && (
        <div className="col-md-12" id="delete-bg">
          <Button
            onClick={handleMultiDelete}
            disabled={!selectedRows || !selectedRows.length}
            className="danger-button"
          >
            {calculateSelectedCount() > 0 && (
              <span>{`Delete selected (${calculateSelectedCount()})`}</span>
            )}
          </Button>
          <IconButton
            onClick={handleClearSelection}
            disabled={selectedRows.length === 0}
          >
            <FilterAltOffIcon />
          </IconButton>
        </div>
      )}
    </div>
  );

  const headerTabs = (
    <div className="">
      <HeaderTabs selectedTab={selectedTab} handleTabClick={handleTabClick} />
    </div>
  );

  const leftToolbarTemplate = () => {
    return (
      <div className="full-width-toolbar">
        <div className="d-flex justify-content-between align-items-center mt-4">
          <div className="d-flex gap-2 align-items-center">
            <TextField
              type="text"
              placeholder="Search by holiday name"
              value={
                selectedTab === "Official"
                  ? officialFilters.filterText
                  : selectedTab === "Custom"
                    ? customFilters.filterText
                    : filterText
              }
              onChange={handleFilter}
              className="search-bar"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    {filterText && (
                      <InputAdornment position="end">
                        <ClearIcon
                          onClick={() => {
                            setFilterText("");
                          }}
                          style={{ cursor: "pointer" }}
                        />
                      </InputAdornment>
                    )}
                  </InputAdornment>
                ),
                className: "custom-input",
              }}
            />
            {headerTabs}

            <ToggleButton
              checked={showAdvancedFilter}
              onChange={toggleAdvancedFilter}
              onIcon="pi pi-angle-up"
              offIcon="pi pi-angle-down"
              onLabel={"Advanced Search \u00a0"}
              offLabel={"Advanced Search \u00a0"}
              className="toggleButtonRightIcon no-color-btn"
            />
          </div>
          <div className="d-flex">
            <CSVLink
              data={filteredSchedules}
              filename={`schedule-list-${moment().format(
                "YYYYMMDD-HHmmss"
              )}.csv`}
            >
              <Button
                label="Export"
                icon="pi pi-download"
                className="p-button-help white-button"
              />
            </CSVLink>
            {["super_admin", "administrator", "moderator"].includes(
              authCtx.activeUser.userType
            ) && (
                <Button
                  label="Add new holiday"
                  icon="pi pi-plus"
                  className="blue-button"
                  onClick={handleShowModal}
                />
              )}
          </div>
        </div>
      </div>
    );
  };

  const advancedFilter = () => {
    return (
      showAdvancedFilter && (
        <div className="d-flex gap-2 align-items-center">
          <DateRangePicker
            onChange={handleDateRangeChange}
            placeholder="Start date - End date"
            className="date-picker"
          />
          <MultiSelect
            value={
              selectedTab === "Official"
                ? officialFilters.selectedJurisdictions
                : selectedTab === "Custom"
                  ? customFilters.selectedJurisdictions
                  : selectedJurisdictions
            }
            options={allJurisdictions}
            onChange={handleJurisdictionChange}
            placeholder="Select Jurisdictions"
            optionLabel="label"
            optionValue="value"
            className="multi-select"
            id="multi-select"
            style={{ height: "2.4rem", fontSize: "14px" }}
          />
          <Dropdown
            value={selectedStatus}
            options={statusOptions}
            onChange={(e) => setSelectedStatus(e.value)}
            placeholder="All status"
            className="dropdown-status"
          />
        </div>
      )
    );
  };

  return (
    <>
      <div className="dt-card my-4">
        <h2>Australian public holidays</h2>
        <hr />
        <HowItWorks>
          <HowItWorksSchedules />
        </HowItWorks>
        {leftToolbarTemplate()}
        <div className="">
          <div className="mt-4 ">
            {advancedFilter()}
            <DataTable
              // stripedRows
              loading={loading}
              tableClassName="custom-datatable"
              size="small"
              tableStyle={{ minWidth: "50rem" }}
              value={filteredSchedules}
              selection={selectedRows}
              onSelectionChange={(e) => setSelectedRows(e.value)}
              contextMenuSelection={selectedRows}
              rows={10}
              rowsPerPageOptions={[5, 10, 25, 50, 100]}
              paginator
              autoLayout={false}
              sortMode="multiple"
              removableSort
              header={header}
              footer={footer}
              scrollable
              resizableColumns
              paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
              currentPageReportTemplate="Showing {first} to {last} of {totalRecords} records"
              rowClassName="custom-row"
            >
              {["super_admin"].includes(authCtx.activeUser.userType) && (
                <Column
                  selectionMode="multiple"
                  headerStyle={{ width: "3rem", paddingLeft: "1rem" }}
                ></Column>
              )}
              {columns.map((col, index) => (
                <Column
                  key={index}
                  field={col.field}
                  header={col.header}
                  sortable={col.sortable}
                  body={col.body}
                  selectionMode={col.selection}
                  style={col.style}
                />
              ))}
            </DataTable>
            <CreateScheduleModal
              show={showModal}
              jurisdictions={jurisdictions()}
              handleClose={handleCloseModal}
            />
            <UpdateScheduleModal
              editMode={editMode}
              updateShow={showUpdateModal}
              updateHandleClose={handleCloseUpdateModal}
              jurisdictions={jurisdictions()}
              schedule={schedule}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Schedules;
