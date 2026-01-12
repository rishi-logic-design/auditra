import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import Dashboard from "./components/admin/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import VendorList from "./components/admin/VendorList";
import Subscription from "./components/admin/Subcription";
import Settings from "./components/admin/Settings";
import SuperAdmin from "./pages/SuperAdmin";
import SuperDashboard from "./components/superAdmin/SuperDashboard";
import VendorManagement from "./components/superAdmin/VendorManagement";
import SubscriptionManagement from "./components/superAdmin/SubscriptionManagement";
import CustomerManagement from "./components/superAdmin/CustomerManagement";
import ReportAndAnalytics from "./components/superAdmin/ReportAndAnalytics";
import SuperSettings from "./components/superAdmin/SuperSettings";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/login" element={<Navigate to="/login" replace />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Admin />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="vendor-list" element={<VendorList />} />
          <Route path="subscription" element={<Subscription />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        <Route
          path="/superadmin"
          element={
            <ProtectedRoute allowedRoles={["superadmin"]}>
              <SuperAdmin />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={<Navigate to="/superadmin/dashboard" replace />}
          />
          <Route path="dashboard" element={<SuperDashboard />} />
          <Route path="vendor-management" element={<VendorManagement />} />
          <Route
            path="subscription-management"
            element={<SubscriptionManagement />}
          />
          <Route path="customer-management" element={<CustomerManagement />} />
          <Route path="report-and-analytics" element={<ReportAndAnalytics />} />
          <Route path="settings" element={<SuperSettings />} />
        </Route>
        {/* 404 Page */}
        <Route
          path="*"
          element={
            <div style={{ padding: 40, textAlign: "center" }}>
              <h2>404 - Page Not Found</h2>
              <p>The page you're looking for doesn't exist.</p>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
