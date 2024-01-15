// AccountSettings.js

import React, { useContext, useState } from "react";
import { Button } from "react-bootstrap";
import { AuthContext } from "../context/auth-context";
import "../styles/AccountSettings.css";
import Input from "../components/Login/Input";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import Alert from "react-bootstrap/Alert";
import ResponseAlert from "../components/UIElements/ResponseAlert";
import {
  hasMinLength,
  hasDigit,
  hasLowerCase,
  hasUpperCase,
  hasSpecialChar,
  isNotEmpty,
} from "../utils/validation";
import { useHistory } from "react-router-dom";
import { parseDate } from "../utils/parseDate";
import moment from "moment";

const AccountSettings = () => {
  const authCtx = useContext(AuthContext);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [photo, setPhoto] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [show, setShow] = useState(true);
  const [passwordError, setPasswordError] = useState("");
  const [currentPasswordError, setCurrentPasswordError] = useState(null);
  const [newPasswordError, setNewPasswordError] = useState(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState(null);
  const history = useHistory();
  const activeUser = authCtx.activeUser;
  const lastPwdChange = activeUser
    ? activeUser.changedAt
      ? new Date(activeUser.changedAt)
      : new Date(activeUser.createdAt)
    : null;

  const currentDate = new Date();
  const daysSinceLastPwdChange = lastPwdChange
    ? Math.floor((currentDate - lastPwdChange) / (24 * 60 * 60 * 1000))
    : null;

    console.log(lastPwdChange );
    console.log(daysSinceLastPwdChange);

  const handleCancelClick = () => {
    history.goBack();
  };

  const handleCurrentPasswordBlur = () => {
    setCurrentPasswordError(
      !hasMinLength(currentPassword, 4) && "Please enter a valid password."
    );
  };

  const handleNewPasswordBlur = () => {
    setNewPasswordError(
      !hasMinLength(newPassword, 8) &&
      "Password must have at least 8 characters."
    );
  };

  const handleConfirmPasswordBlur = () => {
    setConfirmPasswordError(
      (confirmPassword !== newPassword || !isNotEmpty(confirmPassword)) &&
      "Passwords do not match."
    );
  };

  const onSubmitPassword = async (event) => {
    event.preventDefault();

    setCurrentPasswordError(null);
    setNewPasswordError(null);
    setConfirmPasswordError(null);

    // Validate new password
    if (
      !hasMinLength(newPassword, 8) ||
      !hasDigit(newPassword) ||
      !hasLowerCase(newPassword) ||
      !hasUpperCase(newPassword) ||
      !hasSpecialChar(newPassword)
    ) {
      // Password doesn't meet the requirements
      // Set the error state to show a message to the user
      setPasswordError(
        "Error: New password must have at least 8 characters, 1 digit, 1 lowercase letter, 1 uppercase letter, and 1 special character."
      );
      return;
    }

    // Check if new password and confirm password match
    if (newPassword !== confirmPassword) {
      // Passwords don't match
      // Set the error state to show a message to the user
      setPasswordError("Passwords do not match.");
      return;
    }

    const response = await fetch(
      "http://localhost:8000/admin/account/change-password",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + authCtx.token,
        },
        body: JSON.stringify({
          currentPassword: currentPassword,
          confirmPassword: confirmPassword,
          password: newPassword,
        }),
      }
    );
    const responseData = await response.json();
    if (responseData.alertError === 401) {
      setPasswordError(responseData.message);
    }
    const alertDetails = {
      text: `Password successfully updated`,
      successIcon: "success",
      confirmButtonClass: "btn btn-success",
    };
    ResponseAlert(responseData, alertDetails);
    if (responseData.responseCode === 200) {
      {
        authCtx.logoutUser();
      }
    }
  };

  const [fileName, setFileName] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setPhoto(file);
      setFileName(file.name);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setPhoto(file);
      setFileName(file.name); // Set the file name when a file is dropped
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleFileInputClick = () => {
    // Use the file input's click event to open the file selection dialog
    document.getElementById("fileInput").click();
  };

  const handlePhotoSubmit = async (e) => {
    e.preventDefault();
    // Simulate photo submission delay
    setUploadingImage(true);
    setTimeout(() => {
      setUploadingImage(false);
      // Handle the photo submission logic here
      console.log("Photo submitted:", photo);
    }, 2000);
  };

  const currentUser = authCtx.currentUser; // Assuming your AuthContext provides information about the current user

  const currentPicturePreview =
    currentUser && currentUser.photo ? (
      <div className="current-picture">
        <img src={currentUser.photo} alt="Current User" className="img-fluid" />
        <div className="caption">Current User</div>
      </div>
    ) : (
      <span>None</span>
    );

  return (
    <div className="mt-4">
      <h2 className="mb-4">Account Settings</h2>
      <div className="row gap-4 mx-1">
        <div className="account-container col-12 col-md-6 mb-4">
          <div className="header">
            <h5>Change Password</h5>
          </div>
          <Alert variant="warning" onClose={() => setShow(false)} dismissible>
            <p>
              It is good practice to update your password every 90 days. It has
              been{" "}
              {daysSinceLastPwdChange !== null
                ? `${daysSinceLastPwdChange} days`
                : "N/A"}{" "}
              since your password was last changed.
            </p>
          </Alert>
          {passwordError && (
            <Alert variant="danger" className="mt-2">
              {passwordError}
            </Alert>
          )}
          <div className="text-dark small mx-0 px-0 my-4">
            The password must have at least 8 characters, at least 1 digit(s),
            at least 1 lower case letter(s), at least 1 upper case letter(s), at
            least 1 non-alphanumeric character(s) such as as *, -, or #
          </div>
          <form className="d-flex flex-column" onSubmit={onSubmitPassword}>
            <Input
              label={
                <div>
                  Current Password <span style={{ color: "red" }}>*</span>
                </div>
              }
              id="currentPassword"
              type="password"
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              onBlur={handleCurrentPasswordBlur}
              error={currentPasswordError}
            />

            <Input
              label={
                <div>
                  New Password <span style={{ color: "red" }}>*</span>
                </div>
              }
              id="newPassword"
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              onBlur={handleNewPasswordBlur}
              error={newPasswordError}
            />
            <Input
              label={
                <div>
                  Confirm Password <span style={{ color: "red" }}>*</span>
                </div>
              }
              id="confirmPassword"
              type="password"
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onBlur={handleConfirmPasswordBlur}
              error={confirmPasswordError}
            />

            <div className="d-flex justify-content-end mt-4">
              <Button
                variant="secondary"
                className="white-button"
                onClick={handleCancelClick}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                className="ml-2 blue-button"
              >
                Update password
              </Button>
            </div>
          </form>
        </div>
        <div className="account-container text-dark col-12 col-md-5 mb-4">
          <div className="header">
            <h5>User Picture</h5>
          </div>
          <form
            encType="multipart/form-data"
            className="d-flex flex-column"
            onSubmit={handlePhotoSubmit}
          >
            <div className="d-flex justify-content-start gap-4 align-items-top">
              <div className="label">Current picture</div>
              {currentPicturePreview}
            </div>
            <div className="mt-4 mb-2 label">New picture</div>
            <div
              className="drag-drop-box border p-4 text-center d-flex flex-column align-items-center"
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={handleFileInputClick}
              style={{ cursor: "pointer" }}
            >
              {fileName ? (
                <>
                  <div className="current-picture mb-2">
                    <img
                      src={previewImage}
                      alt="Current User"
                      className="img-fluid"
                    />
                  </div>
                  <div className="caption">{fileName}</div>
                </>
              ) : (
                <>
                  <UploadFileIcon className="blue-color mb-4" />
                  <p className="mb-0 mt-2 text-grey">
                    <span className="blue-color label">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="mb-0 mt-2 text-grey">
                    SVG, PNG, JPG, or GIF (max, 800 X 800px)
                  </p>
                </>
              )}
              <input
                type="file"
                id="fileInput"
                onChange={handlePhotoChange}
                accept="image/*"
                className="d-none"
              />
            </div>

            <div className="d-flex justify-content-end mt-4">
              <Button
                variant="secondary"
                className="white-button"
                onClick={handleCancelClick}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                className="ml-2 blue-button"
                disabled={uploadingImage}
              >
                {uploadingImage ? "Uploading..." : "Update picture"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
