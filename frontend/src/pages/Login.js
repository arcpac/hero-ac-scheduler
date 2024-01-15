import "../styles/Login.css";
import logo from "../images/ac-logo-white.svg";
import React, { useContext, useLayoutEffect, useState } from "react";
import Input from "../components/Login/Input";
import { isEmail, isNotEmpty, hasMinLength } from "../utils/validation.js";
import { useInput } from "../hooks/useInput";
import bg from "../images/login-bg.svg";
import { AuthContext } from "../context/auth-context";
import LoadingSpinner from "../components/UIElements/LoadingSpinner.js";
import { FaEnvelope } from "react-icons/fa";
import { useHistory } from "react-router-dom";
import ResponseAlert from "../components/UIElements/ResponseAlert.js";

const Login = () => {
  const authCtx = useContext(AuthContext);
  const history = useHistory();

  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);

  const {
    value: emailValue,
    handleInputChange: handleEmailChange,
    handleInputBlur: handleEmailBlur,
    hasError: emailHasError,
  } = useInput("", (value) => isEmail(value) && isNotEmpty(value));

  const {
    value: passwordValue,
    handleInputChange: handlePasswordChange,
    handleInputBlur: handlePasswordBlur,
    hasError: passwordHasError,
  } = useInput("", (value) => hasMinLength(value, 4));

  useLayoutEffect(() => {
    document.title = "Airconnect - Automated Holiday Scheduler";
    document.body.style.backgroundImage = `url(${bg})`;
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoginError(null);

    if (forgotPasswordMode) {
    } else {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:8000/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: emailValue,
            password: passwordValue,
          }),
        });
        const responseData = await response.json();
        if (responseData.message === "Logged in" && response.ok) {
          setLoading(false);
          authCtx.loginUser(
            responseData.userId,
            responseData.token,
            responseData.user
          );
          history.push("/admin/dashboard")
        } else {
          setLoading(false);
          setLoginError(responseData.message);
        }
      } catch (err) {
        setLoading(false);
        setLoginError("An error occurred. Please try again later.");
      }
    }
    setLoading(false);
  };

  const handleForgotPasswordClick = () => {
    setForgotPasswordMode(true);
  };

  const handleBackToLoginClick = () => {
    setForgotPasswordMode(false);
  };

  const handleForgotPasswordSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8000/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: emailValue,
        }),
      });
      const responseData = await response.json();
      const alertDetails = {
        text: "The link has been sent to your email.",
        successIcon: "success",
        confirmButtonClass: "btn btn-success",
      }
      ResponseAlert(responseData, alertDetails)
    } catch (err) {
      setLoading(false);
      setLoginError("An error occurred. Please try again later.");
    }
    setLoading(false);
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
        {isLoading && <LoadingSpinner asOverlay />}
        <form
          onSubmit={
            forgotPasswordMode ? handleForgotPasswordSubmit : handleSubmit
          }
          className="Auth-form"
        >
          <div className="Auth-form-content my-2">
            <h3 className="Auth-form-title text-dark fw-bold text-left-align mb-4">
              {forgotPasswordMode ? "Forgot Password" : "Sign in"}
            </h3>

            {loginError && (
              <div className="alert alert-danger medium" role="alert">
                {loginError}
              </div>
            )}

            {forgotPasswordMode ? (
              <div>
                <div className="text-dark small text-left-align">
                  Steps to recover your password:
                  <ol className="mx-4 mt-1">
                    <li>Submit your e-mail address </li>
                    <li>
                      An e-mail will be sent to you with instructions on
                      resetting your password
                    </li>
                  </ol>
                </div>
                <div className="input-group mt-4">
                  <div className="input-group-prepend">
                    <span className="input-group-text" id="basic-addon">
                      <FaEnvelope />
                    </span>
                  </div>

                  <input
                    label="Email"
                    className="form-control"
                    id="email"
                    type="email"
                    name="email"
                    onBlur={handleEmailBlur}
                    onChange={handleEmailChange}
                    aria-describedby="basic-addon"
                    value={emailValue}
                    error={emailHasError && "Please enter a valid email address."}
                    required
                  />
                </div>

                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-primary">
                    Submit
                  </button>
                </div>

                <br />
                {/* Back to Login button */}
                <span
                  className="forgot-password"
                  onClick={handleBackToLoginClick}
                >
                  Back to Login
                </span>
              </div>
            ) : (
              <div>
                <Input
                  label="Email"
                  id="email"
                  type="email"
                  name="email"
                  onBlur={handleEmailBlur}
                  onChange={handleEmailChange}
                  value={emailValue}
                  error={emailHasError && "Please enter a valid email address."}
                />
                <Input
                  label="Password"
                  id="password"
                  type="password"
                  name="password"
                  onBlur={handlePasswordBlur}
                  onChange={handlePasswordChange}
                  value={passwordValue}
                  error={passwordHasError && "Please enter a valid password."}
                />

                <div className="d-grid gap-2 mt-4">
                  <button type="submit" className="btn btn-primary">
                    Sign in
                  </button>
                </div>

                <div className="mt-4">
                  <span
                    className="forgot-password"
                    onClick={handleForgotPasswordClick}
                  >
                    Forgot your password?
                  </span>
                </div>
              </div>
            )}
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

export default Login;
