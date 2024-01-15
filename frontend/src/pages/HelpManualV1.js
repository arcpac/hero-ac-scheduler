import React, { useState, useEffect } from "react";
import { Card } from "react-bootstrap";
import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import viewerIcon from "../images/viewer.svg";
import adminIcon from "../images/admin.svg";
import modIcon from "../images/moderator.svg";
import "../styles/HelpManual.css";
import { Link } from "react-router-dom";

const HelpManual = () => {
  const [searchText, setSearchText] = useState("");

  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };

  const handleClearSearch = () => {
    setSearchText("");
  };

  useEffect(() => {
    document.title = "Help Manual - Airconnect";
  }, []);

  return (
    <div className="dt-card my-4 container-fluid">
      <div className="text-center">
        <h3>What are you looking for?</h3>
        <TextField
          type="text"
          placeholder="Search by name or email"
          value={searchText}
          onChange={handleSearch}
          style={{ width: "70%" }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
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
      </div>

      <hr />
      <div className="row justify-content-between">
        {/* Administrator Card */}
        <div className="col-md-4 mb-4">
          <Card className="text-center help-card pr-0 mr-0">
            <Card.Img
              variant="top"
              src={adminIcon}
              style={{ width: "60%", margin: "auto" }}
            />
            <Card.Body className="body-card pb-1 bg-primary">
              <Card.Title>
                <h3 className="text-light">Administrator</h3>
              </Card.Title>
            </Card.Body>
          </Card>
        </div>

        {/* Moderator Card */}
        <div className="col-md-4 mb-4">
          <Link to="/help-moderator" style={{ textDecoration: "none" }}>
            <Card className="text-center help-card">
              <Card.Img
                variant="top"
                src={modIcon}
                style={{ width: "60%", margin: "auto" }}
              />
              <Card.Body className="body-card pb-1 bg-primary">
                <Card.Title>
                  <h3 className="text-light">Moderator</h3>
                </Card.Title>
              </Card.Body>
            </Card>
          </Link>
        </div>

        {/* Viewer Card */}
        <div className="col-md-4 mb-4">
          <Card className="text-center help-card">
            <Card.Img
              variant="top"
              src={viewerIcon}
              style={{ width: "60%", margin: "auto" }}
            />
             <Card.Body className="body-card pb-1 bg-primary">
              <Card.Title>
                <h3 className="text-light">Viewer</h3>
              </Card.Title>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HelpManual;
