import "../styles/Login.css";
import logo from "../images/ac-logo-white.svg";
import React, { useLayoutEffect, useState } from "react";
import Input from "../components/Login/Input";
import {
  isNotEmpty,
  hasMinLength,
  hasUpperCase,
  hasLowerCase,
  hasDigit,
  hasSpecialChar,
} from "../utils/validation.js";
import bg from "../images/login-bg.svg";
import { useHistory, useLocation, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import "animate.css";

const PasswordReset = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const urlParam = searchParams.get("url");
  const history = useHistory();

  const [newPasswordValue, setNewPasswordValue] = useState("");
  const [newPasswordBlur, setNewPasswordBlur] = useState(false); // Track whether the new password field has been blurred
  const [confirmPasswordValue, setConfirmPasswordValue] = useState("");
  const [confirmPasswordBlur, setConfirmPasswordBlur] = useState(false); // Track whether the confirm password field has been blurred
  const [passwordResetError, setPasswordResetError] = useState(null);

  const newPasswordHasError = !hasMinLength(newPasswordValue, 4);

  const isPasswordValid = () => {
    return (
      hasMinLength(newPasswordValue, 8) &&
      hasUpperCase(newPasswordValue) &&
      hasLowerCase(newPasswordValue) &&
      hasDigit(newPasswordValue) &&
      hasSpecialChar(newPasswordValue)
    );
  };

  const confirmPasswordHasError =
    confirmPasswordValue !== newPasswordValue ||
    !isNotEmpty(confirmPasswordValue);

  const handleNewPasswordChange = (event) => {
    setNewPasswordValue(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPasswordValue(event.target.value);
  };

  const handleNewPasswordBlur = () => {
    setNewPasswordBlur(true);
  };

  const handleConfirmPasswordBlur = () => {
    setConfirmPasswordBlur(true);
  };

  const handleCancelClick = () => {
    history.goBack();
  };

  useLayoutEffect(() => {
    document.title = "Password Reset";
    document.body.style.backgroundImage = `url(${bg})`;
  });

  console.log(urlParam);
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isPasswordValid()) {
      setPasswordResetError("Password does not meet the requirements.");
      return;
    }

    const response = await fetch(
      `http://localhost:8000/reset-password/${urlParam}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: newPasswordValue,
          confirm_password: confirmPasswordValue,
        }),
      }
    );

    const responseData = await response.json();
    console.log(responseData);
    if (responseData.responseCode === 200) {
      Swal.fire({
        text: "Password successfully changed",
        icon: "success",
        confirmButtonColor: "#28a745",
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
      });
      history.push("/login");
    } else {
      Swal.fire({
        title: "Error",
        icon: "error",
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
      });
    }
  };

  return (
    <>
      <img
        src={logo}
        alt="Logo"
        className="img-fluid logo mx-auto d-block mt-4"
      />
      <div
        id="app"
        className="Auth-form-container row justify-content-center mt-2"
      >
        <form className="Auth-form" onSubmit={handleSubmit}>
          <div className="Auth-form-content my-2">
            <h3 className="Auth-form-title text-dark fw-bold text-left-align mb-4">
              Reset Password
            </h3>

            {passwordResetError && (
              <div className="alert alert-danger medium" role="alert">
                {passwordResetError}
              </div>
            )}
            <div>
              <div className="text-dark small text-left-align">
                Please enter your new password below, then save changes. <br />
                <br />
                The password must have at least 8 characters, at least 1
                digit(s), at least 1 lower case letter(s), at least 1 upper case
                letter(s), at least 1 non-alphanumeric character(s) such as as
                *, -, or #
              </div>
              <div className="input-group mt-4 d-grid">
                <Input
                  label="New password"
                  id="new-password"
                  type="password"
                  name="new-password"
                  onBlur={handleNewPasswordBlur}
                  onChange={handleNewPasswordChange}
                  value={newPasswordValue}
                  error={
                    newPasswordHasError &&
                    newPasswordBlur &&
                    "Please enter a valid password."
                  }
                  required
                />
                <Input
                  label="New password (again)"
                  id="new-confirm-password"
                  type="password"
                  name="new-confirm-password"
                  onBlur={handleConfirmPasswordBlur}
                  onChange={handleConfirmPasswordChange}
                  value={confirmPasswordValue}
                  error={
                    confirmPasswordHasError &&
                    confirmPasswordBlur &&
                    "Passwords do not match."
                  }
                  required
                />
              </div>

              <div className="d-flex justify-content-end gap-2 mt-3">
                <button type="submit" className="btn btn-primary">
                  Save changes
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCancelClick}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
      <footer id="sticky-footer" className="flex-shrink-0 py-4 text-white-50">
        <div className="container text-center">
          <small>Airconnect &copy; 2023 - Automated Holiday Scheduler</small>
        </div>
      </footer>
    </>
  );
};

export default PasswordReset;
