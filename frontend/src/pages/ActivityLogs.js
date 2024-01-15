import React, { useContext, useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import useActivityLogs from "../hooks/useActivityLogs";
import { AuthContext } from "../context/auth-context";
import "../styles/ActivityLogs.css";
import moment from "moment";
import { TextField, InputAdornment } from "@mui/material";
import "react-data-table-component-extensions/dist/index.css";
import "../styles/Users.css";
import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { CSVLink } from "react-csv";
import { Button } from "primereact/button";
import { Select, MenuItem } from "@mui/material";
import { DateRangePicker } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import "primeicons/primeicons.css";
import HowItWorks from "../components/UIElements/Accordion";
import HowItWorksLogs from "../components/UIElements/ActiveLogs/HowItWorksLogs";
import { httpGetActivityLogs } from "../hooks/requests";
import { formatDescription } from "../utils/formatDescription";

function ActivityLogs() {
  const authCtx = useContext(AuthContext);
  const activityLogs = useActivityLogs(authCtx);
  const [searchText, setSearchText] = useState("");
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [selectedAction, setSelectedAction] = useState("All");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState(true);

  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };

  const handleClearSearch = () => {
    setSearchText("");
  };

  const handleActionChange = (event) => {
    setSelectedAction(event.target.value);
  };

  useEffect(() => {
    document.title = "Activity Logs - Airconnect";
    const fetchData = async () => {
      try {
        setLoading(true);
        const fetchedLogs = await httpGetActivityLogs(authCtx);
        setLogs(fetchedLogs);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const columns = [
    {
      field: "date",
      header: "Date",
      body: (rowData) => {
        const dateOptions = {
          year: "numeric",
          month: "long",
          day: "numeric",
        };
        const timeOptions = {
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        };

        const formattedDate = new Date(rowData.date).toLocaleDateString(
          "en-AU",
          dateOptions
        );
        const formattedTime = new Date(rowData.date).toLocaleTimeString(
          "en-AU", // You can use "en-AU" if "en-US" doesn't give AM/PM format
          timeOptions
        );

        return (
          <div>
            <div>{formattedDate},</div>
            <div>{formattedTime}</div>
          </div>
        );
      },
    },
    {
      field: "email",
      header: "User",
    },
    {
      field: "action",
      header: "Action",
      body: (rowData) => {
        let severity = "info";

        switch (rowData.action) {
          case "Created":
            severity = "success";
            break;
          case "Deleted":
            severity = "danger";
            break;
          case "Updated":
            severity = "info";
            break;
          case "View":
            severity = "warning";
            break;
          case "Login":
            severity = "help";
            break;
          case "Configure Node-RED":
            severity = "warning";
            break;
          case "Synchronised Database":
            severity = "success";
            break;
          case "Deactivate User":
            severity = "danger";
            break;
          case "Activate User":
            severity = "warning";
            break;
          default:
            severity = "info";
        }

        return (
          <div>
            <span className={`p-tag p-tag-rounded p-tag-${severity}`}>
              {rowData.action.charAt(0).toUpperCase() + rowData.action.slice(1)}
            </span>
          </div>
        );
      },
      style: { width: "200px" },
    },

    { field: "category", header: "Category" },
    {
      field: "description",
      header: "Description",
      style: { width: "30%", whiteSpace: "normal", wordWrap: "break-word" },
      body: (rowData) => <span>{formatDescription(rowData)}</span>,
    },
  ];

  useEffect(() => {
    let filtered = [...activityLogs];

    // Apply action filter
    if (selectedAction !== "All") {
      filtered = filtered.filter(
        (activityLog) =>
          activityLog.action.toLowerCase() === selectedAction.toLowerCase()
      );
    }

    // Apply search text filter
    if (searchText) {
      filtered = filtered.filter((activityLog) => {
        const activityMatch =
          activityLog.action.toLowerCase().includes(searchText.toLowerCase()) ||
          activityLog.category
            .toLowerCase()
            .includes(searchText.toLowerCase()) ||
          activityLog.email.toLowerCase().includes(searchText.toLowerCase()) ||
          activityLog.ip.toLowerCase().includes(searchText.toLowerCase());

        return activityMatch;
      });
    }

    // Apply date range filter
    if (startDate && endDate) {
      filtered = filtered.filter((activityLog) => {
        const logDate = new Date(activityLog.date);
        return logDate >= startDate && logDate <= endDate;
      });
    }

    setFilteredLogs(filtered);
  }, [searchText, selectedAction, activityLogs, startDate, endDate]);

  const handleDateRangeChange = (value) => {
    if (value && value.length === 2) {
      setStartDate(value[0]);
      setEndDate(value[1]);
    } else {
      setStartDate(null);
      setEndDate(null);
    }
  };

  const leftToolbarTemplate = () => {
    return (
      <div className="full-width-toolbar">
        <div className="d-flex justify-content-between align-items-center mt-4">
          <div className="d-flex gap-2 align-items-center">
            <TextField
              type="text"
              placeholder="Search by user or category"
              value={searchText}
              onChange={handleSearch}
              className="search-bar"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                className: "custom-input",
                endAdornment: searchText && (
                  <InputAdornment position="end">
                    <ClearIcon
                      onClick={handleClearSearch}
                      style={{ cursor: "pointer" }}
                    />
                  </InputAdornment>
                ),
              }}
            />
            <Select
              value={selectedAction}
              onChange={handleActionChange}
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
              className="select-action multi-select font-small"
            >
              <MenuItem value="All">All Actions</MenuItem>
              <MenuItem value="Created">Create</MenuItem>
              <MenuItem value="Viewed">View</MenuItem>
              <MenuItem value="Updated">Update</MenuItem>
              <MenuItem value="Deleted">Delete</MenuItem>
              <MenuItem value="Login">Login</MenuItem>
              <MenuItem value="Configure Node-RED">Configure Node-RED</MenuItem>
              <MenuItem value="Synchronised Database">
                Synchronised Database
              </MenuItem>
            </Select>
            <DateRangePicker
              onChange={handleDateRangeChange}
              placeholder="Start date - End date"
              className="date-picker"
            />
          </div>
          <div className="text-md-end">
            <CSVLink
              data={filteredLogs}
              filename={`activity-logs-${moment().format(
                "YYYYMMDD-HHmmss"
              )}.csv`}
            >
              <Button
                label="Export"
                icon="pi pi-download"
                className="p-button-help white-button"
              />
            </CSVLink>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="dt-card my-4">
      <h2>Activity logs</h2>
      <hr />
      <HowItWorks>
        <HowItWorksLogs />
      </HowItWorks>
      {leftToolbarTemplate()}
      <div className="mt-4">
        <DataTable
          stripedRows
          loading={loading}
          value={filteredLogs}
          rows={10}
          rowsPerPageOptions={[5, 10, 25, 50]}
          paginator
          autoLayout={false}
          sortMode="single"
          sortField="date"
          sortOrder={-1}
          paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} records"
          rowClassName="custom-row"
          tableClassName="custom-datatable"
        >
          {columns.map((col, index) => (
            <Column
              key={index}
              field={col.field}
              header={col.header}
              body={col.body}
              // sortable={col.sortable}
              style={col.style}
            />
          ))}
        </DataTable>
      </div>
    </div>
  );
}

export default ActivityLogs;
