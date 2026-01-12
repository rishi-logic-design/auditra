import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import SuperSidebar from "../components/superAdmin/SuperSidebar";
import "./superAdmin.scss";

const SuperAdmin = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="superadmin-root">
      <SuperSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <main
        className={`superadmin-main ${
          isSidebarOpen ? "sidebar-open" : "sidebar-closed"
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default SuperAdmin;
