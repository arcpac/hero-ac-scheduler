import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

function Layout() {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed((prevCollapsed) => !prevCollapsed);
  };

  return (
    <>
      <Header collapsed={collapsed} toggleSidebar={toggleSidebar} />
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
    </>
  );
}

export default Layout;
