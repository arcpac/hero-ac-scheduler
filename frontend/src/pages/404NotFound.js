// NotFound.js
import React from "react";
import NotFoundImage from "../images/404.svg";
import { useHistory } from "react-router-dom";

const NotFound = () => {
  const history = useHistory();

  const handleBackToDashboard = () => {
    history.push("/admin/dashboard");
  };

  return (
    <div className="not-found-container text-dark">
      <img
        src={NotFoundImage}
        alt="404 Not Found"
        className="not-found-image"
      />
      <p className="my-4 fw-bold h2">Sorry, the page can't be found</p>
      <p>
        The page you were looking for appears to have been
        <br /> moved, deleted, or does not exist.
      </p>
      <button className="btn btn-primary mt-5" onClick={handleBackToDashboard}>
        <i className="bi bi-arrow-left"></i> Back to Dashboard
      </button>
    </div>
  );
};

export default NotFound;
