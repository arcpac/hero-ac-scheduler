import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./index.css";
import App from "./App";
// import { BrowserRouter, Route, Routes } from "react-router-dom";
// import Login from "./pages/Login/Login";
// import Dashboard from "./pages/Dashboard";
// import Schedules from "./pages/Schedules";
// import Users from "./pages/Users";
// import useUsers from "./hooks/useUsers";
// import Header from "./components/Header";
// import Sidebar from "./components/Sidebar";


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
