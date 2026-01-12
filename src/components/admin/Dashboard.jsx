import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import "./Dashboard.scss";
import vendorService from "../../services/vendorService";

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [vendors, setVendors] = useState([]);

  const [filteredVendors, setFilteredVendors] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const loadVendors = async () => {
    try {
      setLoading(true);

      const response = await vendorService.getAllVendors();
      console.log("Vendor Fetch Response:", response);

      const vendorData = Array.isArray(response?.data?.rows)
        ? response.data.rows
        : [];

      console.log("Vendor Data:", vendorData);

      setVendors(vendorData);
      setFilteredVendors(vendorData);
    } catch (error) {
      console.error("Vendor Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const data = vendors.filter((v) =>
      `${v.name} ${v.email} ${v.phone}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
    setFilteredVendors(data);
  }, [search, vendors]);

  useEffect(() => {
    loadVendors();
  }, []);

  const statsCards = [
    {
      title: "Total Vendors",
      value: vendors?.length || 0,
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      color: "#8b5cf6",
    },
    {
      title: "Total Revenue",
      value: "₹12,000",
      subtitle: "(Year)",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
          <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
          <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
        </svg>
      ),
      color: "#10b981",
    },
    {
      title: "Total Revenue",
      value: "₹8,000",
      subtitle: "(Month)",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      ),
      color: "#3b82f6",
    },
    {
      title: "Total Revenue",
      value: "₹5,000",
      subtitle: "(Week)",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
          <polyline points="17 6 23 6 23 12" />
        </svg>
      ),
      color: "#f59e0b",
    },
  ];

  const analyticsData = [
    { month: "Jan", value1: 450, value2: 300 },
    { month: "Feb", value1: 380, value2: 280 },
    { month: "Mar", value1: 520, value2: 320 },
    { month: "Apr", value1: 900, value2: 250 },
    { month: "May", value1: 650, value2: 350 },
    { month: "Jun", value1: 750, value2: 280 },
    { month: "Jul", value1: 420, value2: 450 },
    { month: "Aug", value1: 520, value2: 220 },
    { month: "Sep", value1: 480, value2: 280 },
    { month: "Oct", value1: 620, value2: 300 },
    { month: "Nov", value1: 850, value2: 550 },
    { month: "Dec", value1: 720, value2: 600 },
  ];


  const maxValue = Math.max(
    ...analyticsData.flatMap((d) => [d.value1, d.value2])
  );

  return (
    <div className="dashboard-container">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div
        className={`main-content ${
          isSidebarOpen ? "sidebar-open" : "sidebar-closed"
        }`}
      >
        <div className="top-header">
          <div className="search-box">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search vendor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="header-actions">
            <div className="user-info">
              <span className="user-name">Admin Name</span>
              <div className="user-avatar">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
            </div>
            <div className="notification-icon">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span className="notification-badge"></span>
            </div>
          </div>
        </div>

        <div className="stats-grid">
          {statsCards.map((card, index) => (
            <div key={index} className="stat-card">
              <div
                className="stat-icon"
                style={{ background: `${card.color}15`, color: card.color }}
              >
                {card.icon}
              </div>
              <div className="stat-content">
                <h3>{card.title}</h3>
                <div className="stat-value">{card.value}</div>
                {card.subtitle && (
                  <span className="stat-subtitle">{card.subtitle}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="analytics-section">
          <h2>Analytics</h2>
          <div className="chart-container">
            <div className="chart-y-axis">
              <span>1000</span>
              <span>750</span>
              <span>500</span>
              <span>250</span>
              <span>0</span>
            </div>
            <div className="chart-bars">
              {analyticsData.map((data, index) => (
                <div key={index} className="bar-group">
                  <div className="bars">
                    <div
                      className="bar bar1"
                      style={{ height: `${(data.value1 / maxValue) * 100}%` }}
                    ></div>
                    <div
                      className="bar bar2"
                      style={{ height: `${(data.value2 / maxValue) * 100}%` }}
                    ></div>
                  </div>
                  <span className="bar-label">{index}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="recent-activity">
          <h2>Recent Activity</h2>

          {loading ? (
            <p>Loading vendors...</p>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Vendor</th>
                    <th>BusinessName</th>
                    <th>Mobile</th>
                    <th>Date</th>
                    <th>Address</th>
                    <th>Email</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVendors.length === 0 && (
                    <tr>
                      <td colSpan="5" style={{ textAlign: "center" }}>
                        No vendors found
                      </td>
                    </tr>
                  )}
                  {filteredVendors.map((vendor, index) => (
                    <tr key={vendor._id}>
                      <td>{index + 1}</td>
                      <td>{vendor.vendorName}</td>
                      <td>{vendor.businessName}</td>
                      <td>{vendor.mobile}</td>
                      <td>{vendor.createdAt}</td>
                      <td>{vendor.address}</td>
                      <td>{vendor.email}</td>
                      <td>
                        <span className={`status-badge ${vendor.status}`}>
                          {vendor.status || "active"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
