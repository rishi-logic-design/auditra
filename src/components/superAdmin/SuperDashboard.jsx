import React, { useState, useEffect } from "react";
import "./SuperDashboard.scss";
import vendorService from "../../services/vendorService";
import customerService from "../../services/customerService";

const SuperDashboard = () => {
  const [dateRange] = useState("01 August 2025 - 31 August 2025");

  const [vendors, setVendors] = useState([]);
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [totalCustomers, setTotalCustomers] = useState(0);

  const loadVendors = async () => {
    try {
      setLoading(true);

      const response = await vendorService.getAllVendors();
      console.log("Vendor Fetch Response:", response);

      const vendorData = Array.isArray(response?.data?.rows)
        ? response.data.rows
        : [];

      setVendors(vendorData);
      setFilteredVendors(vendorData);
    } catch (error) {
      console.error("Vendor Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadCustomersVendorWise = async () => {
    try {
      setLoading(true);

      let allCustomers = [];

      for (let i = 0; i < vendors.length; i++) {
        const vendor = vendors[i];
        if (!vendor?._id) continue;

        try {
          const response = await customerService.getAllCustomers({
            vendorId: vendor._id,
          });

          const vendorCustomers = Array.isArray(response?.data)
            ? response.data
            : [];

          // Add all customers from this vendor
          allCustomers = [...allCustomers, ...vendorCustomers];

          console.log(`Customers for vendor ${vendor._id}:`, vendorCustomers);
        } catch (err) {
          console.error(
            `Error fetching customers for vendor ${vendor._id}:`,
            err
          );
        }
      }

      setCustomers(allCustomers);
      setTotalCustomers(allCustomers.length);
    } catch (error) {
      console.error("Customer Fetch Error:", error);
      setCustomers([]);
      setTotalCustomers(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const data = vendors.filter((v) =>
      `${v.name || ""} ${v.email || ""} ${v.phone || ""}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
    setFilteredVendors(data);
  }, [search, vendors]);

  useEffect(() => {
    loadVendors();
  }, []);

  useEffect(() => {
    if (vendors.length > 0) {
      loadCustomersVendorWise();
    }
  }, [vendors]);

  const formatShortDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const stats = [
    {
      label: "Total Vendors",
      value: loading ? "Loading..." : vendors.length,
      color: "#667eea",
    },
    {
      label: "Total Customers",
      value: loading ? "Loading..." : totalCustomers,
      color: "#764ba2",
    },
    { label: "Revenue", value: "₹24,500", color: "#f59e0b" },
    { label: "Active Plans", value: "27", color: "#10b981" },
  ];

  return (
    <div className="super-dashboard">
      <div className="dashboard-header">
        <div className="header-top">
          <div className="search-box">
            <svg
              width="18"
              height="18"
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
          <button className="notification-btn">
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
            <span className="badge">3</span>
          </button>
        </div>

        <div className="date-range">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span>{dateRange}</span>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="stat-card"
            style={{ borderTopColor: stat.color }}
          >
            <div className="stat-label">{stat.label}</div>
            <div className="stat-value" style={{ color: stat.color }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      <div className="charts-row">
        <div className="chart-card">
          <div className="card-header">
            <h3>Monthly Revenue</h3>
          </div>
          <div className="chart-placeholder">
            <div className="bar-chart">
              {[65, 45, 50, 30, 60, 40, 80, 90, 85].map((height, i) => (
                <div
                  key={i}
                  className="bar"
                  style={{ height: `${height}%` }}
                ></div>
              ))}
            </div>
          </div>
        </div>

        <div className="chart-card">
          <div className="card-header">
            <h3>Active User</h3>
          </div>
          <div className="chart-placeholder">
            <svg
              className="line-chart"
              viewBox="0 0 400 200"
              preserveAspectRatio="none"
            >
              <polyline
                points="0,150 50,120 100,140 150,90 200,110 250,70 300,100 350,60 400,80"
                fill="none"
                stroke="url(#lineGradient)"
                strokeWidth="3"
              />
              <defs>
                <linearGradient
                  id="lineGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#667eea" />
                  <stop offset="100%" stopColor="#764ba2" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>

      <div className="activity-table">
        <div className="table-header">
          <h3>Total Vendors</h3>
        </div>
        <div className="table-wrapper">
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
              {!loading && filteredVendors.length === 0 && (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center" }}>
                    No vendors found
                  </td>
                </tr>
              )}
              {filteredVendors.slice(0, 5).map((vendor, index) => (
                <tr key={vendor._id}>
                  <td>{index + 1}</td>
                  <td>{vendor.vendorName}</td>
                  <td>{vendor.businessName}</td>
                  <td>{vendor.mobile}</td>
                  <td>{formatShortDate(vendor.createdAt)}</td>
                  <td>{vendor.address}</td>
                  <td>{vendor.email}</td>
                  <td>
                    <span
                      className={`status ${(
                        vendor.status || "active"
                      ).toLowerCase()}`}
                    >
                      {vendor.status || "Active"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <br />
      <br />
      <div className="activity-table">
        <div className="table-header">
          <h3>Total Customers</h3>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>CustomerName</th>
                <th>BusinessName</th>
                <th>Mobile</th>
                <th>Email</th>
                <th>gstNumber</th>
                <th>aadharNumber</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {!loading && customers.length === 0 && (
                <tr>
                  <td colSpan="9" style={{ textAlign: "center" }}>
                    No customers found
                  </td>
                </tr>
              )}

              {customers.map((customer, index) => (
                <tr key={customer._id}>
                  <td>{index + 1}</td>
                  <td>{customer.customerName}</td>
                  <td>{customer.businessName}</td>
                  <td>{customer.mobile}</td>
                  <td>{customer.email}</td>
                  <td>{customer.gstNumber || "-"}</td>
                  <td>{customer.aadharNumber || "-"}</td>
                  <td>{formatShortDate(customer.createdAt)}</td>
                  <td>
                    <span
                      className={`status ${(
                        customer.status || "active"
                      ).toLowerCase()}`}
                    >
                      {customer.status || "Active"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SuperDashboard;
