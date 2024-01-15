import React, { useContext, useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, Navbar, Image, Nav, Dropdown } from "react-bootstrap";
import logo from "../../images/airconnect.webp";
import "./Header.css";
import { AuthContext } from "../../context/auth-context";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import LogoutIcon from "@mui/icons-material/Logout";
import { styled } from "@mui/system";
import pic from "../../images/user-2.png";
import { capitalizeFirstLetter } from "../../utils/validation";

const ColoredCircle = styled("div")({
  backgroundColor: "#EFF4FB",
  borderRadius: "50%",
  padding: "9px",
  display: "inline-block",
});

function Header({ collapsed, setCollapsed }) {
  const authCtx = useContext(AuthContext);
  const activeUser = authCtx.activeUser;
  const fullName = `${activeUser.firstName
    .charAt(0)
    .toUpperCase()}${activeUser.firstName.slice(1)} ${activeUser.lastName
    .charAt(0)
    .toUpperCase()}${activeUser.lastName.slice(1)}`;

  const userName = `${fullName}`;
  const userRole =
    activeUser.userType === "super_admin"
      ? "Site Administrator"
      : capitalizeFirstLetter(activeUser.userType);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [myAccountClicked, setMyAccountClicked] = useState(false);
  const getInitials = (fullName) =>
    fullName
      .split(" ")
      .map((name) => name.charAt(0).toUpperCase())
      .slice(0, 2)
      .join("");

      const Avatar = ({ fullName }) => (
        <div className="mx-2">
          <span className="avatar-circle">
            {getInitials(fullName)}
          </span>
        </div>
      );
      

  const toggleSidebar = () => {
    setCollapsed((prevCollapsed) => !prevCollapsed);

    const mainElement = document.querySelector("main");
    if (mainElement) {
      if (collapsed) {
        mainElement.className = "col-md-9 ms-sm-auto col-lg-10 px-md-4";
        mainElement.id = "";
      } else {
        mainElement.className = "col-lg-12 px-md-4";
        mainElement.id = "collapsed-body";
      }
    }
  };

  const handleLogout = async () => {
    const response = await fetch(`http://localhost:8000/admin/account/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + authCtx.token,
      },
      body: JSON.stringify({}),
    });
    const responseData = await response.json();
    if (responseData) {
      authCtx.logoutUser();
    }
  };

  const toggleDropdown = (event) => {
    event.preventDefault();
    setShowDropdown(!showDropdown);
  };

  const closeDropdown = () => {
    setShowDropdown(false);
  };

  const handleMyAccountClick = () => {
    setMyAccountClicked(true);
    closeDropdown(); // Close the dropdown when "My account" is clicked
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        if (!myAccountClicked) {
          closeDropdown();
        }
        setMyAccountClicked(false); // Reset the state after closing the dropdown
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef, myAccountClicked]);

  return (
    <Navbar className="bg-white bd-bottom nav-height fixed-top" expand="md">
      <Container fluid>
        <button className="btn btn-dark-blue" onClick={toggleSidebar}>
          <i className={`bi ${collapsed ? "bi-list" : "bi-list"} bi-2x`}></i>
        </button>

        <Link
          className="navbar-brand col-md-3 col-lg-2 me-0 fs-18 fw-bold"
          to="/admin/dashboard"
        >
          <Image src={logo} id="logo" />
        </Link>

        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Nav id="navLinks">
            <Nav.Link>
              <ColoredCircle>
                <NotificationsNoneIcon style={{ color: "#64748B" }} />
              </ColoredCircle>
            </Nav.Link>
            <Nav.Link as={Link} to="/help">
              <ColoredCircle>
                <HelpOutlineIcon style={{ color: "#64748B" }} />
              </ColoredCircle>
            </Nav.Link>
          </Nav>
          <div
            className="margin-left-30"
            id="user-profile"
            onClick={toggleDropdown}
            style={{ cursor: "pointer" }}
          >
            <div className="text-end mx-2">
              <div id="user-name">{userName}</div>
              <div id="user-role">{userRole}</div>
            </div>
            <Avatar fullName={fullName} />
            <Dropdown
              align="end"
              show={showDropdown}
              onClose={closeDropdown}
              ref={dropdownRef}
            >
              <Dropdown.Toggle
                as="div"
                id="dropdown-basic"
                onClick={toggleDropdown}
                style={{ cursor: "pointer" }}
              ></Dropdown.Toggle>
              <Dropdown.Menu
                style={{
                  marginTop: "10px",
                  borderRadius: "0px",
                  boxShadow: "0px 8px 16px 0px rgba(0,0,0,0.2)",
                }}
              >
                <Dropdown.Header style={{ marginBottom: "-5px" }}>
                  Settings
                </Dropdown.Header>
                <Dropdown.Divider />
                <Dropdown.Item>
                  <Link
                    to="/settings"
                    className="d-flex align-items-center gap-3 dropdown-item"
                    onClick={handleMyAccountClick}
                  >
                    <AccountBoxIcon />
                    My profile
                  </Link>
                </Dropdown.Item>
                <Dropdown.Item>
                  <button
                    className="d-flex align-items-center gap-3 dropdown-item"
                    id="button-dd"
                    onClick={handleLogout}
                  >
                    <LogoutIcon />
                    Logout
                  </button>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
