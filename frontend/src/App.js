import Dashboard from "./pages/Dashboard";
import Header from "./components/UIElements/Header";
import Sidebar from "./components/UIElements/Sidebar";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import Schedules from "./pages/Schedules";
import ActivityLogs from "./pages/ActivityLogs";
import Users from "./pages/Users";
import Login from "./pages/Login";
import NodeRED from "./pages/NodeRED";
import React, { useCallback, useEffect, useState } from "react";
import "./index.css";
import { AuthContext } from "./context/auth-context";
import AccountSettings from "./pages/AccountSettings";
import PasswordReset from "./pages/PasswordReset";
import NotFound from "./pages/404NotFound";
import HelpManual from "./pages/HelpManual";

let logoutTimer;
function App() {
  const [userId, setUserId] = useState();
  const [tokenExpirationDate, setTokenExpirationDate] = useState();
  const [token, setToken] = useState();
  const [activeUser, setActiveUser] = useState();
  const [collapsed, setCollapsed] = useState(false);

  const onhandleLogIn = useCallback(
    (userId, token, activeUser, expirationDate) => {
      setToken(token);
      setUserId(userId);
      setActiveUser(activeUser);
      const tokenExpirationDate =
        expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
      setTokenExpirationDate(tokenExpirationDate);
      setToken(token);
      localStorage.setItem(
        "userData",
        JSON.stringify({
          userId: userId,
          token: token,
          activeUser: activeUser,
          expiration: tokenExpirationDate.toISOString(),
        })
      );
    },
    []
  );

  const onhandleLogOut = useCallback(() => {
    setToken(null);
    setUserId(null);
    setTokenExpirationDate(null);
    setActiveUser(null);
    localStorage.removeItem("userData");
  }, []);

  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime = tokenExpirationDate.getTime() - new Date();
      logoutTimer = setTimeout(onhandleLogOut, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, tokenExpirationDate, onhandleLogOut]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      onhandleLogIn(
        storedData.userId,
        storedData.token,
        storedData.activeUser,
        new Date(storedData.expiration)
      );
    }
  }, [onhandleLogIn]);

  let routes;
  if (token && activeUser) {
    routes = (
      <>
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />
        <div className="container-fluid">
          <div className="row">
            <Sidebar userType={activeUser.userType} collapsed={collapsed} />
            <main
              id="main-content"
              className="col-md-9 ms-sm-auto col-lg-10 px-md-4"
            >
              <Switch>
                <Route path="/admin/dashboard">
                  <Dashboard userType={activeUser.userType} />
                </Route>
                <Route path="/admin/schedules">
                  <Schedules />
                </Route>
                <>
                  <Route path="/admin/users">
                    <Users />
                  </Route>
                  <Route path="/admin/logs">
                    <ActivityLogs />
                  </Route>
                  <Route path="/admin/node-red">
                    <NodeRED userType={activeUser.userType} />
                  </Route>
                  <Route path="/settings">
                    <AccountSettings />
                  </Route>
                  <Route path="/404-not-found">
                    <NotFound />
                  </Route>
                  <Route path="/help">
                    <HelpManual />
                  </Route>
                </>
                <Redirect to="/dashboard" />
              </Switch>
            </main>
          </div>
        </div>
      </>
    );
  }

  if (!token) {
    routes = (
      <Switch>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/reset-password">
          <PasswordReset />
        </Route>
        <Route path="/404-not-found">
          <NotFound />
        </Route>
        <Route path="/help">
          <HelpManual />
        </Route>
        <Redirect to="/login" />
      </Switch>
    );
  }
  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        userId: userId,
        activeUser: activeUser,
        token: token,
        loginUser: onhandleLogIn,
        logoutUser: onhandleLogOut,
      }}
    >
      <div className="App">
        <Router>{routes}</Router>
      </div>
    </AuthContext.Provider>
  );
}

export default App;
