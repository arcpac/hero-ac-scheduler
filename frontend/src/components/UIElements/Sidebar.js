//Hi there! I'm KC, the designer behind this app. If you're interested in collaboration, feel free to reach out to me via email at arcekc@gmail.com.

import React, { useLayoutEffect } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./Sidebar.css";

function Sidebar({ userType, collapsed }) {
  const location = useLocation();

  const isActiveLink = (path) => {
    return path !== "/settings" && location.pathname === path;
  };

  useLayoutEffect(() => {
    document.body.style.backgroundImage = `url()`;
    document.body.style.backgroundColor = "white";
  });

  return (
    <div
      className={`sidebar col-md-3 min-vh-100 col-lg-2 p-0 col-auto d-flex justify-content-between sidebar-container container-fluid flex-column ${collapsed ? "collapsed" : ""
        }`}
    >
      <div className="offcanvas-body d-md-flex flex-column pt-lg-3 overflow-y-auto offcanvas-md offcanvas-end row">
        <ul className="nav flex-column nav-pills mt-3 mt-sm-0 text-decoration-none">
          <li
            className={`nav-item text-white ${isActiveLink("/admin/dashboard") ? "active" : ""
              } ${collapsed && isActiveLink("/admin/dashboard")
                ? "border-left-active"
                : ""
              }`}
          >
            <Link
              className="nav-link d-flex align-items-center gap-3 active text-white  "
              to="/admin/dashboard"
            >
              <i className="fs-5 bi bi-grid text-white"></i>
              {!collapsed && <span>Dashboard</span>}
            </Link>
          </li>
          <li
            className={`nav-item text-white ${isActiveLink("/admin/schedules") ? "active" : ""
              } ${collapsed && isActiveLink("/admin/schedules")
                ? "border-left-active"
                : ""
              }`}
          >
            <Link
              className="nav-link d-flex align-items-center gap-3 active text-white"
              to="/admin/schedules"
            >
              <i className="fs-5 bi bi-calendar4-week text-white"></i>
              {!collapsed && <span>Holiday Schedules</span>}
            </Link>
          </li>
          {["super_admin", "administrator"].includes(userType) && (
            <>
              <li
                className={`nav-item text-white ${isActiveLink("/admin/users") ? "active" : ""
                  } ${collapsed && isActiveLink("/admin/users")
                    ? "border-left-active"
                    : ""
                  }`}
              >
                <Link
                  className="nav-link d-flex align-items-center gap-3 active text-white"
                  to="/admin/users"
                >
                  <i className="fs-5 bi bi-people text-white"></i>
                  {!collapsed && <span>Users</span>}
                </Link>
              </li>
              <li
                className={`nav-item text-white ${isActiveLink("/admin/logs") ? "active" : ""
                  } ${collapsed && isActiveLink("/admin/logs")
                    ? "border-left-active"
                    : ""
                  }`}
              >
                <Link
                  className="nav-link d-flex align-items-center gap-3 active text-white"
                  to="/admin/logs"
                >
                  <i className="fs-5 bi bi-journal-text text-white"></i>
                  {!collapsed && <span>Activity Logs</span>}
                </Link>
              </li>
              <li
                className={`nav-item text-white ${isActiveLink("/admin/node-red") ? "active" : ""
                  } ${collapsed && isActiveLink("/admin/node-red")
                    ? "border-left-active"
                    : ""
                  }`}
              >
                <Link
                  className="nav-link d-flex align-items-center gap-3 active text-white"
                  to="/admin/node-red"
                >
                  <i className="fs-5 bi bi-gear text-white"></i>
                  {!collapsed && <span>Node-RED Settings</span>}
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}
export default Sidebar;
