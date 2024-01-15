// Users.js
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Button } from "primereact/button";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import Swal from "sweetalert2";
import { TextField, InputAdornment } from "@mui/material";
import "react-data-table-component-extensions/dist/index.css";
import { AuthContext } from "../context/auth-context";
import { httpGetUsers } from "../hooks/requests";
import UserModal from "../components/UIElements/Users/UserModal";
import UserUpdateModal from "../components/UIElements/Users/UserUpdateModal";
import "../styles/Users.css";
import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { Tag } from "primereact/tag";
import { CSVLink } from "react-csv";
import moment from "moment";
import IconButton from "@mui/material/IconButton";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import HowItWorksUsers from "../components/UIElements/Users/HowItWorksUsers";
import HowItWorks from "../components/UIElements/Accordion";
import ResponseAlert from "../components/UIElements/ResponseAlert";
import { capitalizeFirstLetter } from "../utils/validation";

function Users() {
  const authCtx = useContext(AuthContext);
  const [searchText, setSearchText] = useState("");
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState("All Status");
  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleCleared, setToggleCleared] = useState(false);
  const [editMode, setEditMode] = useState(true);
  const [user, setSelectedUser] = useState({
    email: "",
    firstName: "",
    lastName: "",
    userType: "viewer",
  });
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    let filtered = [];
    switch (selectedTab) {
      case "All Status":
        filtered = users.map((user) => user);
        break;
      case "Active":
        filtered = users.filter(
          (user) => user.active === true && user.deleted !== true
        );
        break;
      case "Deactivated":
        filtered = users.filter(
          (user) => user.active === false && user.deleted !== true
        );
        break;
      case "Deleted":
        filtered = users.filter(
          (user) => user.active === false && user.deleted === true
        );
        break;
      default:
        filtered = users.map((user) => user);
    }

    if (searchText) {
      filtered = filtered.filter((user) => {
        const nameMatch =
          user.firstName.toLowerCase().includes(searchText.toLowerCase()) ||
          user.lastName.toLowerCase().includes(searchText.toLowerCase());

        const emailMatch = user.email
          .toLowerCase()
          .includes(searchText.toLowerCase());

        return nameMatch || emailMatch;
      });
    }

    setFilteredUsers(filtered);
  }, [searchText, users, selectedTab]);

  const handleClearSelection = () => {
    setSelectedRows([]);
  };

  const getAllUsers = useCallback(async () => {
    const fetchedUsers = await httpGetUsers(authCtx);
    if (fetchedUsers.responseCode === 404) {
      Swal.fire({
        title: "Error",
        text: `${fetchedUsers.message}`,
        icon: "error",
      });
      return setUsers([]);
    }
    return setUsers(fetchedUsers);
  }, []);

  useEffect(() => {
    getAllUsers();
  }, [showModal, showUpdateModal]);

  const handleCloseUpdateModal = () => setShowUpdateModal(false);

  const handleUpdateModal = (data) => {
    setEditMode(true);
    setSelectedUser(data);
    setShowUpdateModal(true);
  };

  const handleViewUser = (data) => {
    setEditMode(false);
    setSelectedUser(data);
    setShowUpdateModal(true);
  };

  const contextActions = React.useMemo(() => {
    const handleMultiDelete = async () => {
      if (
        window.confirm(
          `Are you sure you want to delete:\r ${selectedRows.map(
            (r) => r["email"]
          )}?`
        )
      ) {
        setToggleCleared(!toggleCleared);
        const deleteIds = selectedRows.map((row) => row._id);
        const response = await fetch(
          `http://localhost:8000/admin/users?ids=${deleteIds}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + authCtx.token,
            },
          }
        );
        const responseData = await response.json();
        getAllUsers();
        const alertDetails = {
          text: responseData.message,
          successIcon: "success",
          confirmButtonClass: "btn btn-success",
        };
        ResponseAlert(responseData, alertDetails);
      }
    };

    return (
      <>
        <Button
          icon="pi pi-trash"
          onClick={handleMultiDelete}
          className="p-button-danger"
        />
      </>
    );
  }, [selectedRows, toggleCleared]);

  function parseCreator(row) {
    if ("embeddedUser" in row) {
      const name = "email" in row.embeddedUser ? row.embeddedUser : "";
      return name.email;
    }
    return "-";
  }

  const columns = [
    {
      field: "firstName",
      header: "Full name",
      sortable: true,
      body: (rowData) => (
        <Button className="buttonStyle" onClick={() => handleViewUser(rowData)}>
          <span>{`${rowData.firstName} ${rowData.lastName}`}</span>
        </Button>
      ),
    },
    { field: "email", header: "Email", sortable: true },
    {
      field: "userType",
      header: "User type",
      sortable: true,
      body: (rowData) => (
        <span>
          {rowData.userType === "super_admin"
            ? "Site Administrator"
            : capitalizeFirstLetter(rowData.userType)}
        </span>
      ),
    },

    {
      field: "active",
      header: "Status",
      sortable: true,
      body: (rowData) => (
        <Tag
          value={
            rowData["deleted"] === true
              ? "● DELETED"
              : rowData["active"] === true
                ? "● ACTIVE"
                : "● DEACTIVATED"
          }
          className={
            rowData["deleted"] === true
              ? "deletedBackground"
              : rowData["active"] === true
                ? "greenBackground"
                : "redBackground"
          }
        />
      ),
      style: { width: "150px" },
    },
    {
      field: "updatedAt",
      header: "Last access",
      sortable: true,
      body: (rowData) => {
        const lastLoginTime = rowData.loggedIn
          ? moment(rowData.loggedIn)
          : null;
        const timeDifference = lastLoginTime
          ? moment.duration(moment().diff(lastLoginTime))
          : null;

        const formatTimeDifference = () => {
          if (!timeDifference) return "Never";

          const days = timeDifference.days();
          const hours = timeDifference.hours();
          const minutes = timeDifference.minutes();
          const seconds = timeDifference.seconds();

          if (days > 0) {
            return `${days} day${days > 1 ? "s" : ""} ${hours} hour${hours > 1 ? "s" : ""
              }`;
          } else if (hours > 0) {
            return `${hours} hour${hours > 1 ? "s" : ""} ${minutes} min${minutes > 1 ? "s" : ""
              }`;
          } else if (minutes > 0) {
            return `${minutes} min${minutes > 1 ? "s" : ""} ${seconds} sec`;
          } else {
            return `${seconds} sec`;
          }
        };

        const tooltipContent = lastLoginTime
          ? lastLoginTime.format(`DD MMMM YYYY, hh:mma`)
          : "No record";

        return (
          <OverlayTrigger
            placement="top"
            overlay={
              <Tooltip id={`tooltip-${rowData._id}`}>{tooltipContent}</Tooltip>
            }
          >
            <span>{formatTimeDifference()}</span>
          </OverlayTrigger>
        );
      },
      style: { width: "150px" },
    },
    {
      field: "Actions",
      className: "margin-left",
      header: "Actions",
      body: (rowData) => {
        if (rowData.deleted) {
          return (
            <>
              <OverlayTrigger
                overlay={
                  <Tooltip id={`tooltip-activate-${rowData.userId}`}>
                    Reactivate user account
                  </Tooltip>
                }
              >
                <Button
                  icon="pi pi-ban"
                  outlined
                  id="no-padding"
                  onClick={() => handleDeactivate(rowData)}
                />
              </OverlayTrigger>{" "}
              <Button icon="bi bi-dash" outlined id="no-padding" disabled />
              <Button icon="bi bi-dash" outlined id="no-padding" disabled />
            </>
          );
        } else {
          return (
            <>
              <OverlayTrigger
                overlay={
                  <Tooltip id={`tooltip-deactivate-${rowData.userId}`}>
                    {rowData.active
                      ? "Deactivate user account"
                      : "Activate user account"}
                  </Tooltip>
                }
              >
                <Button
                  icon={rowData.active ? "pi pi-eye" : "pi pi-eye-slash"}
                  outlined
                  id="no-padding"
                  onClick={() => handleDeactivate(rowData)}
                />
              </OverlayTrigger>

              <OverlayTrigger
                overlay={
                  <Tooltip id={`tooltip-delete-${rowData.userId}`}>
                    Delete user account
                  </Tooltip>
                }
              >
                <Button
                  icon="pi pi-trash"
                  outlined
                  id="no-padding"
                  onClick={() => handleDelete(rowData)}
                />
              </OverlayTrigger>

              <OverlayTrigger
                overlay={
                  <Tooltip id={`tooltip-edit-${rowData.userId}`}>Edit user account</Tooltip>
                }
              >
                <Button
                  icon="pi pi-pencil"
                  outlined
                  id="no-padding"
                  onClick={() => handleUpdateModal(rowData)}
                />
              </OverlayTrigger>
            </>
          );
        }
      },
      style: { width: "150px", textAlign: "left" },
    },
  ];

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  useEffect(() => {
    document.title = "Users - Airconnect";
    const fetchData = async () => {
      try {
        setLoading(true);

        const fetchedUsers = await httpGetUsers(authCtx);
        const sortedUsers = [...fetchedUsers].sort((a, b) =>
          a.firstName.localeCompare(b.firstName)
        );

        setUsers(sortedUsers);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [showModal, showUpdateModal]);

  const handleDeactivate = async (row) => {
    const response = await fetch(
      `http://localhost:8000/admin/users/deactivate/${row._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + authCtx.token,
        },
      }
    );
    const responseData = await response.json();
    getAllUsers();
  };

  const handleDelete = (row) => {
    Swal.fire({
      title: "Are you sure?",
      html: `You are about to delete user ${row["email"]}.<br/><strong>This action cannot be undone.</strong>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
      showClass: {
        popup: `
        animate__animated
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
          `http://localhost:8000/admin/users/${row._id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + authCtx.token,
            },
          }
        );
        const responseData = await response.json();
        const alertDetails = {
          text: responseData.message,
          successIcon: "success",
          confirmButtonClass: "btn btn-success",
        };
        ResponseAlert(responseData, alertDetails);
        getAllUsers();
      }
    });
  };

  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };

  const handleClearSearch = () => {
    setSearchText("");
  };

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };

  const calculateSelectedCount = () => {
    return selectedRows.length;
  };

  const headerTabs = (
    <div className="">
      <div className="btn-group">
        <button
          type="button"
          className={`btn header-tab ${selectedTab === "All Status" ? "active-head" : ""
            }`}
          onClick={() => handleTabClick("All Status")}
        >
          All
        </button>
        <button
          type="button"
          className={`btn header-tab ${selectedTab === "Deleted" ? "active-head" : ""
            }`}
          onClick={() => handleTabClick("Deleted")}
        >
          Deleted
        </button>
        <button
          type="button"
          className={`btn header-tab ${selectedTab === "Active" ? "active-head" : ""
            }`}
          onClick={() => handleTabClick("Active")}
        >
          Active
        </button>
        <button
          type="button"
          className={`btn header-tab ${selectedTab === "Deactivated" ? "active-head" : ""
            }`}
          onClick={() => handleTabClick("Deactivated")}
        >
          Deactivated
        </button>
      </div>
    </div>
  );

  const leftToolbarTemplate = () => {
    return (
      <div className="full-width-toolbar">
        <div className="d-flex justify-content-between align-items-center mt-4">
          <div className="d-flex gap-2 align-items-center">
            <TextField
              type="text"
              placeholder="Search by name or email"
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
            {headerTabs}
          </div>
          <div className="col-md-6 text-md-end">
            <CSVLink
              data={filteredUsers}
              filename={`user-list-${moment().format("YYYYMMDD-HHmmss")}.csv`}
            >
              <Button
                label="Export"
                icon="pi pi-download"
                className="p-button-help white-button"
              />
            </CSVLink>
            {["super_admin", "administrator"].includes(
              authCtx.activeUser.userType
            ) && (
                <Button
                  label="Add new user"
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

  const handleMultiDelete = async () => {
    if (
      window.confirm(
        `Are you sure you want to delete:\r ${selectedRows.map(
          (r) => r["email"]
        )}?`
      )
    ) {
      setToggleCleared(!toggleCleared);
      const deleteIds = selectedRows.map((row) => row._id);
      const response = await fetch(
        `http://localhost:8000/admin/users?ids=${deleteIds}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + authCtx.token,
          },
        }
      );
      const responseData = await response.json();
      const alertDetails = {
        text: responseData.message,
        successIcon: "success",
        confirmButtonClass: "btn btn-success",
      };
      ResponseAlert(responseData, alertDetails);
      getAllUsers();
    }
  };

  const header = (
    <div className="row justify-content-between align-items-center mb-3">
      {selectedRows.length > 0 && (
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

  const footer = (
    <div>
      <div className="p-d-flex p-jc-between p-mt-3"></div>
    </div>
  );

  return (
    <>
      <div className="dt-card my-4">
        <h2>Users</h2>
        <hr />
        <HowItWorks>
          <HowItWorksUsers />
        </HowItWorks>

        {leftToolbarTemplate()}
        <div className="mt-4 ">
          <DataTable
            loading={loading}
            contextMenu={contextActions}
            selection={selectedRows}
            onSelectionChange={(e) => setSelectedRows(e.value)}
            tableClassName="custom-datatable"
            size="small"
            tableStyle={{ minWidth: "50rem" }}
            value={filteredUsers}
            resizableColumns
            rows={10}
            rowsPerPageOptions={[5, 10, 25, 50]}
            paginator
            autoLayout={false}
            header={header}
            footer={footer}
            sortMode="multiple"
            removableSort
            sortField="firstName"
            sortOrder={1}
            paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} records"
            rowClassName="custom-row"
          >
            {columns.map((col, index) => (
              <Column
                key={index}
                field={col.field}
                header={col.header}
                sortable={col.sortable}
                body={col.body}
                selectionMode={col.selection}
              />
            ))}
          </DataTable>

          <UserModal show={showModal} handleClose={handleCloseModal} userType />
          <UserUpdateModal
            editMode={editMode}
            updateShow={showUpdateModal}
            updateHandleClose={handleCloseUpdateModal}
            user={user}
          />
        </div>
      </div>
    </>
  );
}

export default Users;
