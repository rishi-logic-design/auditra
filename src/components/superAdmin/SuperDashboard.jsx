import React, { useState, useEffect } from "react";
import "./superDashboard.scss";
import vendorService from "../../services/vendorService";
import customerService from "../../services/customerService";
import subscriptionService from "../../services/subscriptionService";

const SuperDashboard = () => {
  const [vendors, setVendors] = useState([]);
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [subscriptions, setSubscriptions] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [activeSubscriptions, setActiveSubscriptions] = useState(0);
  const [monthlyRevenueData, setMonthlyRevenueData] = useState([]);
  const [monthlyUserData, setMonthlyUserData] = useState([]);

  const loadVendors = async () => {
    try {
      setLoading(true);

      const response = await vendorService.getAllVendors();
      // console.log("Vendor Fetch Response:", response);

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

  const loadAllCustomers = async () => {
    try {
      setLoading(true);

      let allCustomers = [];

      // Fetch customers for each vendor
      for (let i = 0; i < vendors.length; i++) {
        const vendor = vendors[i];
        if (!vendor?.id) continue;

        try {
          const response = await customerService.getAllCustomers({
            vendorId: vendor.id,
          });

          const vendorCustomers = Array.isArray(response?.data?.rows)
            ? response.data.rows
            : Array.isArray(response?.data)
            ? response.data
            : [];

          // Add vendor info to each customer
          const customersWithVendor = vendorCustomers.map((customer) => ({
            ...customer,
            vendorName: vendor.vendorName,
            vendorBusiness: vendor.businessName,
          }));

          allCustomers = [...allCustomers, ...customersWithVendor];

          // console.log(
          //   `Customers for vendor ${vendor.vendorName}:`,
          //   vendorCustomers.length
          // );
        } catch (err) {
          console.error(
            `Error fetching customers for vendor ${vendor.id}:`,
            err
          );
        }
      }

      setCustomers(allCustomers);
      setTotalCustomers(allCustomers.length);

      console.log(`✅ Total customers loaded: ${allCustomers.length}`);
    } catch (error) {
      console.error("Customer Fetch Error:", error);
      setCustomers([]);
      setTotalCustomers(0);
    } finally {
      setLoading(false);
    }
  };

  const loadSubscriptions = async () => {
    try {
      const response = await subscriptionService.getSubscriptions();
      // console.log("📦 Full Subscriptions Response:", response);

      // Try different possible response structures
      let subscriptionData = [];

      if (Array.isArray(response?.data?.rows)) {
        subscriptionData = response.data.rows;
      } else if (Array.isArray(response?.data)) {
        subscriptionData = response.data;
      } else if (Array.isArray(response?.rows)) {
        subscriptionData = response.rows;
      } else if (Array.isArray(response)) {
        subscriptionData = response;
      }

      // console.log("📊 Total Subscriptions Found:", subscriptionData.length);

      setSubscriptions(subscriptionData);

      // Calculate total revenue (price is inside plan object)
      let revenue = 0;
      subscriptionData.forEach((sub) => {
        // Price can be in: sub.plan.price, sub.plan.priceMonthly, sub.plan.priceYearly
        const planPrice = parseFloat(sub.plan?.price || 0);
        const monthlyPrice = parseFloat(sub.plan?.priceMonthly || 0);
        const yearlyPrice = parseFloat(sub.plan?.priceYearly || 0);

        // Use the available price (prefer plan.price)
        const amount = planPrice || monthlyPrice || yearlyPrice;
        revenue += amount;

        // console.log(`💰 Subscription ID ${sub.id}:`, {
        //   planName: sub.plan?.name,
        //   price: amount,
        //   status: sub.status,
        // });
      });

      // Count active subscriptions
      const activeCount = subscriptionData.filter(
        (sub) => sub.status?.toLowerCase() === "active"
      ).length;

      setTotalRevenue(revenue);
      setActiveSubscriptions(activeCount);

      // Process monthly revenue data
      const revenueByMonth = processMonthlyRevenue(subscriptionData);
      setMonthlyRevenueData(revenueByMonth);

      // Process monthly user growth
      const usersByMonth = processMonthlyUsers([
        ...vendors,
        ...subscriptionData,
      ]);
      setMonthlyUserData(usersByMonth);

      // console.log(`✅ Subscriptions loaded: ${subscriptionData.length}`);
      // console.log(`💰 Total Revenue: ₹${revenue.toLocaleString("en-IN")}`);
      // console.log(`📊 Active Subscriptions: ${activeCount}`);
    } catch (error) {
      console.error("❌ Subscription Fetch Error:", error);
      setSubscriptions([]);
      setTotalRevenue(0);
      setActiveSubscriptions(0);
    }
  };

  const processMonthlyRevenue = (subscriptionData) => {
    const monthlyData = {};
    const currentDate = new Date();

    for (let i = 8; i >= 0; i--) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i,
        1
      );
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;
      monthlyData[monthKey] = 0;
    }

    subscriptionData.forEach((sub) => {
      if (sub.startDate) {
        const date = new Date(sub.startDate);
        const monthKey = `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, "0")}`;

        if (monthlyData.hasOwnProperty(monthKey)) {
          const amount = parseFloat(
            sub.plan?.price || sub.plan?.priceMonthly || 0
          );
          monthlyData[monthKey] += amount;
        }
      }
    });

    const values = Object.values(monthlyData);
    const maxValue = Math.max(...values, 1);

    return values.map((val) => Math.round((val / maxValue) * 100));
  };

  const processMonthlyUsers = (allData) => {
    const monthlyData = {};
    const currentDate = new Date();

    // Initialize last 9 months
    for (let i = 8; i >= 0; i--) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i,
        1
      );
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;
      monthlyData[monthKey] = 0;
    }

    // Count users per month based on creation dates
    allData.forEach((item) => {
      const dateField = item.createdAt || item.startDate;
      if (dateField) {
        const date = new Date(dateField);
        const monthKey = `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, "0")}`;

        if (monthlyData.hasOwnProperty(monthKey)) {
          monthlyData[monthKey]++;
        }
      }
    });

    // Convert to cumulative count
    const sortedMonths = Object.keys(monthlyData).sort();
    let cumulative = 0;
    const cumulativeData = sortedMonths.map((month) => {
      cumulative += monthlyData[month];
      return cumulative;
    });

    return cumulativeData;
  };

  useEffect(() => {
    const data = vendors.filter((v) =>
      `${v.vendorName || ""} ${v.email || ""} ${v.mobile || ""}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
    setFilteredVendors(data);
  }, [search, vendors]);

  useEffect(() => {
    loadVendors();
    loadSubscriptions();
  }, []);

  useEffect(() => {
    if (vendors.length > 0) {
      loadAllCustomers();
    }
  }, [vendors]);

  useEffect(() => {
    if (subscriptions.length > 0 && vendors.length > 0) {
      const revenueByMonth = processMonthlyRevenue(subscriptions);
      setMonthlyRevenueData(revenueByMonth);

      const usersByMonth = processMonthlyUsers([...vendors, ...subscriptions]);
      setMonthlyUserData(usersByMonth);
    }
  }, [subscriptions, vendors]);

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
    {
      label: "Revenue",
      value: loading
        ? "Loading..."
        : `₹${totalRevenue.toLocaleString("en-IN")}`,
      color: "#f59e0b",
    },
    {
      label: "Active Plans",
      value: loading ? "Loading..." : activeSubscriptions,
      color: "#10b981",
    },
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
            <span className="chart-subtitle">
              Last 9 months subscription revenue
            </span>
          </div>
          <div className="chart-placeholder">
            <div className="bar-chart">
              {monthlyRevenueData.length > 0
                ? monthlyRevenueData.map((height, i) => (
                    <div
                      key={i}
                      className="bar"
                      style={{ height: `${height}%` }}
                      title={`Month ${i + 1}: ${height}% of max`}
                    ></div>
                  ))
                : [65, 45, 50, 30, 60, 40, 80, 90, 85].map((height, i) => (
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
            <h3>Active Users</h3>
            <span className="chart-subtitle">Cumulative growth over time</span>
          </div>
          <div className="chart-placeholder">
            {monthlyUserData.length > 0 ? (
              <svg
                className="line-chart"
                viewBox="0 0 400 200"
                preserveAspectRatio="none"
              >
                <polyline
                  points={monthlyUserData
                    .map((count, i) => {
                      const x = (i / (monthlyUserData.length - 1)) * 400;
                      const maxCount = Math.max(...monthlyUserData, 1);
                      const y = 200 - (count / maxCount) * 180;
                      return `${x},${y}`;
                    })
                    .join(" ")}
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
            ) : (
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
            )}
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
                <tr key={vendor.id}>
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
                <th>Vendor</th>
                <th>CustomerName</th>
                <th>BusinessName</th>
                <th>Mobile</th>
                <th>Email</th>
                <th>GST Number</th>
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
                <tr key={customer.id}>
                  <td>{index + 1}</td>
                  <td>{customer.vendorName || "-"}</td>
                  <td>{customer.customerName}</td>
                  <td>{customer.businessName || "-"}</td>
                  <td>{customer.mobileNumber || customer.mobile}</td>
                  <td>{customer.email || "-"}</td>
                  <td>{customer.gstNumber || "-"}</td>
                  <td>{formatShortDate(customer.createdAt)}</td>
                  <td>
                    <span className="status active">Active</span>
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
