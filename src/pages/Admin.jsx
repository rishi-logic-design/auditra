import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/admin/Sidebar";
import "./admin.scss";

const Admin = () => {
  return (
    <div className="admin-root">
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
};

export default Admin;
