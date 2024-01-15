import React, { useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Select from "../../FormComponents/Select";
import "./UpdateScheduleModal.css";
import InfoIcon from "@mui/icons-material/Info";
import DOMPurify from "dompurify";
import dayjs from 'dayjs';

function ScheduleForm({
  editMode,
  newName,
  setNewName,
  newDate,
  setNewDate,
  newJurisdiction,
  setNewJurisdiction,
  newInfo,
  setNewInfo,
  newMoreInfo,
  setNewMoreInfo,
  jurisdictions,
}) {
  const [nameError, setNameError] = useState("");
  const [dateError, setDateError] = useState("");
  const today = new Date();

  const allowedCharactersRegex = /^[a-zA-Z0-9\s'\.,!@#\$%^&*()_+]*$/;

  const handleNameChange = (e) => {
    const value = e.target.value;

    const cleanedValue = value.replace(/\s+/g, " ");

    const filteredValue = cleanedValue
      .split("")
      .filter((char) => allowedCharactersRegex.test(char))
      .join("");

    if (filteredValue.length <= 75) {
      setNewName(filteredValue);
      if (filteredValue.length < 5) {
        setNameError("Please provide a holiday name.");
      } else {
        setNameError("");
      }
    } else {
      setNewName(filteredValue.slice(0, 75));
      setNameError("Please enter a shorter holiday name.");
    }
  };

  const handleNameBlur = () => {
    if (newName.length < 5 || newName.length > 75) {
      setNameError("Please provide a holiday name.");
    }
  };

  const handleInfoChange = (e, setFunction, maxLength) => {
    const value = e.target.value;

    const cleanedValue = value.replace(/\s+/g, " ");

    const filteredValue = cleanedValue
      .split("")
      .filter((char) => allowedCharactersRegex.test(char))
      .join("");

    if (filteredValue.length <= maxLength) {
      setFunction(filteredValue);
    } else {
      setFunction(filteredValue.slice(0, maxLength));
    }
  };

  return (
    <table className="table" id="view-modal">
      <tbody>
        {editMode ? (
          <tr>
            <td colSpan="2" id="modal-bg" className="p-4">
              <span className="info-container">
                <InfoIcon className="info-icon" />
                <span>
                  Each holiday can only have one jurisdiction selected. If you
                  wish to create the same holiday for other jurisdictions, you
                  need to create a new holiday schedule.
                </span>
              </span>
            </td>
          </tr>
        ) : (
          ""
        )}
        <tr>
          <th>
            <span style={{ color: "red" }}>*</span> Holiday Name:
          </th>
          <td>
            <input
              className="form-control"
              type="text"
              value={newName}
              onChange={handleNameChange}
              onBlur={handleNameBlur}
              disabled={!editMode}
            />
            {nameError && <div className="control-error">{nameError}</div>}
          </td>
        </tr>
        <tr>
          <th>
            <span style={{ color: "red" }}>*</span> Date:
          </th>
          <td className="custom-date-picker">
            {editMode ? (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  className="form-control fixed-width-date"
                  selected={newDate}
                  format="DD/MM/YYYY"
                  onChange={setNewDate}
                  value={dayjs(newDate)}
                  disablePast
                  slotProps={{
                    textField: {
                      helperText:
                        "Please select a future date in DD/MM/YYYY format.",
                      className: "no-bg",
                    },
                  }}
                />
              </LocalizationProvider>
            ) : (
              <div className="px-2 pb-3 text-medium">
                {new Date(newDate).toLocaleDateString("en-AU", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </div>
            )}
          </td>
        </tr>
        <tr>
          <th>
            <span style={{ color: "red" }}>*</span> Jurisdiction:
          </th>
          <td>
            {editMode ? (
              <Select
                list={jurisdictions}
                title="Select Jurisdiction"
                set={setNewJurisdiction}
                selected={newJurisdiction}
              />
            ) : (
              <div className="px-2 pb-3 text-medium">
                {jurisdictions.find((j) => j.value === newJurisdiction)?.label}
              </div>
            )}
          </td>
        </tr>
        <tr>
          <th>Information:</th>
          <td>
            {editMode ? (
              <textarea
                className="form-control"
                value={newInfo !== "undefined" ? newInfo : ""}
                rows="3"
                onChange={(e) => handleInfoChange(e, setNewInfo, 250)}
                disabled={!editMode}
              />
            ) : (
              <div className="px-2 pb-3 text-medium">
                {newInfo !== "undefined" ? newInfo : "N/A"}
              </div>
            )}
          </td>
        </tr>

        <tr>
          <th>More Information:</th>
          <td>
            {editMode ? (
              <textarea
                className="form-control"
                value={newMoreInfo !== "undefined" ? newMoreInfo : ""}
                rows="3"
                type="text"
                onChange={(e) => handleInfoChange(e, setNewMoreInfo, 250)}
                disabled={!editMode}
              />
            ) : (
              <div className="px-2 pb-3 text-medium">
                {newMoreInfo !== "undefined" ? newMoreInfo : "N/A"}
              </div>
            )}
          </td>
        </tr>
      </tbody>
      <span style={{ color: "red" }}>*</span>{" "}
      <i className="text-secondary"> required fields</i>
    </table>
  );
}

export default ScheduleForm;
