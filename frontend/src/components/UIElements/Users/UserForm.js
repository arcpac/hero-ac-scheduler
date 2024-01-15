import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import { capitalizeFirstLetter } from "../../../utils/validation";
import InfoIcon from "@mui/icons-material/Info";
import DOMPurify from "dompurify";

const allowedCharactersRegex = /^[a-zA-Z0-9\s'\.,!@#\$%^&*()_+-]*$/;

function UserForm({
  editMode,
  email,
  setEmail,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  userType,
  setUserType,
  password,
  setPassword,
}) {
  const [generatePassword, setGeneratePassword] = useState(true);
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [showEmailError, setShowEmailError] = useState(false);
  const [showFirstNameError, setShowFirstNameError] = useState(false);
  const [showLastNameError, setShowLastNameError] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [showPasswordError, setShowPasswordError] = useState(false);

  const validatePassword = (inputPassword) => {
    // Password must have at least 8 characters, 1 digit, 1 lowercase letter,
    // 1 uppercase letter, and 1 non-alphanumeric character
    const passwordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/;
    return passwordRegex.test(inputPassword);
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setIsPasswordValid(validatePassword(newPassword));
    setShowPasswordError(false);
  };

  const handlePasswordBlur = () => {
    setShowPasswordError(true);
  };

  const generateRandomPassword = () => {
    const length = 8;
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789*-#";

    let password = "";
    const digit = "0123456789";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const nonAlphanumeric = "*-#";

    password += digit[Math.floor(Math.random() * digit.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password +=
      nonAlphanumeric[Math.floor(Math.random() * nonAlphanumeric.length)];

    for (let i = 4; i < length; i++) {
      password += charset[Math.floor(Math.random() * charset.length)];
    }

    setGeneratedPassword(password);
    setPassword(password);
  };

  const handleGeneratePasswordChange = () => {
    setGeneratePassword(!generatePassword);
    if (!generatePassword) {
      generateRandomPassword();
    }
  };

  const validateEmail = (inputEmail) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isLengthValid = inputEmail.length >= 6 && inputEmail.length <= 30;
    return emailRegex.test(inputEmail) && isLengthValid;
  };

  const handleInputChange = (e, setFunction, maxLength) => {
    const value = e.target.value;

    const cleanedValue = value.replace(/\s+/g, " ");

    const filteredValue = cleanedValue
      .split("")
      .filter((char) => allowedCharactersRegex.test(char))
      .join("");

    setFunction(filteredValue.slice(0, maxLength));
  };

  const handleEmailChange = (e) => {
    handleInputChange(e, setEmail, 30);
    setIsEmailValid(validateEmail(e.target.value));
    setShowEmailError(false);
  };

  const handleEmailBlur = () => {
    setShowEmailError(true);
  };

  useEffect(() => {
    if (generatePassword) {
      generateRandomPassword();
    }
  }, [generatePassword, setPassword]);

  const validateFirstName = (inputFirstName) => {
    return inputFirstName.length >= 2 && inputFirstName.length <= 20;
  };

  const handleFirstNameChange = (e) => {
    handleInputChange(e, setFirstName, 20);
    setShowFirstNameError(false);
  };

  const validateLastName = (inputLastName) => {
    return inputLastName.length >= 2 && inputLastName.length <= 20;
  };

  const handleLastNameChange = (e) => {
    handleInputChange(e, setLastName, 20);
    setShowLastNameError(false);
  };

  const isFormValid = () => {
    return (
      isEmailValid && validateFirstName(firstName) && validateLastName(lastName)
    );
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
                  The password must have at least 8 characters, at least 1
                  digit(s), at least 1 lower case letter(s), at least 1 upper
                  case letter(s), at least 1 non-alphanumeric character(s) such
                  as as *, -, or #
                </span>
              </span>
            </td>
          </tr>
        ) : (
          ""
        )}
        <tr>
          <th>
            <span style={{ color: "red" }}>*</span> Email:
          </th>
          <td>
            <input
              className={`form-control ${!isEmailValid && showEmailError ? "is-invalid" : ""
                }`}
              type="text"
              value={email}
              onChange={handleEmailChange}
              onBlur={handleEmailBlur}
              disabled={!editMode}
            />
            {!isEmailValid && showEmailError && (
              <div className="invalid-feedback">
                {email.length < 6
                  ? "Email must be at least 6 characters long."
                  : "Invalid email format"}
              </div>
            )}
          </td>
        </tr>
        <tr>
          <th>
            <span style={{ color: "red" }}>*</span> First Name:
          </th>
          <td>
            <input
              className={`form-control ${!validateFirstName(firstName) && showFirstNameError
                  ? "is-invalid"
                  : ""
                }`}
              type="text"
              value={firstName}
              onChange={(e) => handleFirstNameChange(e)}
              onBlur={() => setShowFirstNameError(true)}
              disabled={!editMode}
            />
            {!validateFirstName(firstName) && showFirstNameError && (
              <div className="invalid-feedback">
                {firstName.length < 2
                  ? "First name must be at least 2 characters long."
                  : "First name must be no more than 12 characters long."}
              </div>
            )}
          </td>
        </tr>
        <tr>
          <th>
            <span style={{ color: "red" }}>*</span> Last Name:
          </th>
          <td>
            <input
              className={`form-control ${!validateLastName(lastName) && showLastNameError
                  ? "is-invalid"
                  : ""
                }`}
              type="text"
              value={lastName}
              onChange={(e) => handleLastNameChange(e)}
              onBlur={() => setShowLastNameError(true)}
              disabled={!editMode}
            />
            {!validateLastName(lastName) && showLastNameError && (
              <div className="invalid-feedback">
                {lastName.length < 2
                  ? "Last name must be at least 2 characters long."
                  : "Last name must be no more than 18 characters long."}
              </div>
            )}
          </td>
        </tr>
        <tr>
          <th>
            <span style={{ color: "red" }}>*</span> User Type:
          </th>
          <td>
            {editMode ? (
              <Form.Select
                className="form-control"
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
              >
                <option disabled>Select user type</option>
                <option value="administrator">Administrator</option>
                <option value="moderator">Moderator</option>
                <option value="viewer">Viewer</option>
              </Form.Select>
            ) : (
              <div className="px-2 pb-3 text-medium">
                {userType === "super_admin"
                  ? "Super Administrator"
                  : capitalizeFirstLetter(userType)}
              </div>
            )}
          </td>
        </tr>
        {editMode && (
          <>
            <tr>
              <th>
                <span style={{ color: "red" }}>*</span> Password:
              </th>
              <td>
                <div className="pb-2">
                  {generatePassword ? (
                    <input
                      className={`form-control ${!isPasswordValid && showPasswordError
                          ? "is-invalid"
                          : ""
                        }`}
                      type="text"
                      value={generatedPassword}
                      readOnly
                    />
                  ) : (
                    <input
                      className={`form-control ${!isPasswordValid && showPasswordError
                          ? "is-invalid"
                          : ""
                        }`}
                      type="text"
                      value={password}
                      onChange={(e) => handlePasswordChange(e)}
                      onBlur={handlePasswordBlur}
                    />
                  )}
                </div>
                {editMode &&
                  !generatePassword &&
                  !isPasswordValid &&
                  showPasswordError && (
                    <div className="control-error">
                      Password must have at least 8 characters, at least 1
                      digit, at least 1 lower case letter, at least 1 upper case
                      letter, and at least 1 non-alphanumeric character.
                    </div>
                  )}
                <div className="form-check mb-0">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={generatePassword}
                    onChange={handleGeneratePasswordChange}
                  />
                  <p className="small pt-1">
                    Generate password and notify user
                  </p>
                </div>
              </td>
            </tr>
          </>
        )}
      </tbody>
      <span style={{ color: "red" }}>*</span>{" "}
      <i className="text-secondary"> required fields</i>
    </table>
  );
}

export default UserForm;
