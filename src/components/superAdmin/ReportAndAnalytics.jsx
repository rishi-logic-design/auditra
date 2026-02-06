import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import customerService from "../../services/customerService";
import subscriptionService from "../../services/subscriptionService";
import vendorService from "../../services/vendorService";
import "./ReportAndAnalytics.scss";

const ReportAndAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [vendorActivityData, setVendorActivityData] = useState([]);
  const [subscriptionTrendsData, setSubscriptionTrendsData] = useState([]);
  const [customerGrowthData, setCustomerGrowthData] = useState([]);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);

    // Get vendorId from localStorage
    const storedUser = localStorage.getItem("user");
    let vendorId = null;
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        vendorId = user.vendorId || user._id;
      } catch (e) {
        console.error("Error parsing user:", e);
      }
    }

    // Fetch vendors
    let vendors = [];
    try {
      const response = await vendorService.getAllVendors({
        page: 1,
        size: 1000,
      });
      
      if (response.success && response.data) {
        vendors = response.data.rows || response.data || [];
      }
    } catch (error) {
      console.error("Error fetching vendors:", error);
    }

    // Fetch subscriptions
    let subscriptions = [];
    try {
      const response = await subscriptionService.getSubscriptions({
        page: 1,
        size: 1000,
      });
      
      if (response.success && response.data) {
        subscriptions = response.data.rows || response.data || [];
      }
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
    }

    // Fetch customers for all vendors
    let allCustomers = [];
    try {
      // If we have vendors, fetch customers for each vendor
      if (vendors.length > 0) {
        for (const vendor of vendors) {
          try {
            const response = await customerService.getAllCustomers({
              vendorId: vendor.id,
              page: 1,
              size: 1000,
            });
            
            if (response.success && response.data) {
              const vendorCustomers = response.data.rows || [];
              allCustomers = [...allCustomers, ...vendorCustomers];
            }
          } catch (err) {
            console.error(`Error fetching customers for vendor ${vendor.id}:`, err);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
    }

    // Process vendor activity by year
    const vendorsByYear = processDataByYear(vendors, "createdAt");
    setVendorActivityData(vendorsByYear);

    // Process subscription trends
    const subscriptionsByYear = processSubscriptionTrends(subscriptions);
    setSubscriptionTrendsData(subscriptionsByYear);

    // Process customer growth
    const customersByYear = processDataByYear(allCustomers, "createdAt");
    setCustomerGrowthData(customersByYear);

    setLoading(false);
  };

  const processDataByYear = (data, dateField) => {
    const yearCounts = {};
    const currentYear = new Date().getFullYear();

    // Initialize last 5 years
    for (let i = 4; i >= 0; i--) {
      yearCounts[currentYear - i] = 0;
    }

    // Count items by year
    if (data && Array.isArray(data)) {
      data.forEach((item) => {
        if (item[dateField]) {
          const year = new Date(item[dateField]).getFullYear();
          if (yearCounts.hasOwnProperty(year)) {
            yearCounts[year]++;
          }
        }
      });
    }

    // Convert to array format for charts
    return Object.keys(yearCounts).map((year) => ({
      year: year,
      value: yearCounts[year],
    }));
  };

  const processSubscriptionTrends = (subscriptions) => {
    const yearData = {};
    const currentYear = new Date().getFullYear();

    // Initialize last 5 years
    for (let i = 4; i >= 0; i--) {
      yearData[currentYear - i] = { line1: 0, line2: 0 };
    }

    // Count active and expired subscriptions by year
    if (subscriptions && Array.isArray(subscriptions)) {
      subscriptions.forEach((sub) => {
        if (sub.startDate) {
          const year = new Date(sub.startDate).getFullYear();
          if (yearData.hasOwnProperty(year)) {
            if (sub.status === "active" || sub.status === "Active") {
              yearData[year].line1++;
            } else {
              yearData[year].line2++;
            }
          }
        }
      });
    }

    // Convert to array format
    return Object.keys(yearData).map((year) => ({
      year: year,
      line1: yearData[year].line1,
      line2: yearData[year].line2,
    }));
  };

  const handleDownloadCSV = () => {
    try {
      const csvData = [
        ["Report Type", "Year", "Value"],
        ...vendorActivityData.map((item) => [
          "Vendor Activity",
          item.year,
          item.value,
        ]),
        ...customerGrowthData.map((item) => [
          "Customer Growth",
          item.year,
          item.value,
        ]),
        ...subscriptionTrendsData.map((item) => [
          "Subscriptions Active",
          item.year,
          item.line1,
        ]),
        ...subscriptionTrendsData.map((item) => [
          "Subscriptions Other",
          item.year,
          item.line2,
        ]),
      ];

      const csvContent =
        "data:text/csv;charset=utf-8," +
        csvData.map((row) => row.join(",")).join("\n");

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute(
        "download",
        `analytics_report_${new Date().toISOString().split("T")[0]}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading CSV:", error);
    }
  };

  const handleDownloadPDF = () => {
    try {
      const reportContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Analytics Report</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #333; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
            th { background-color: #f5f5f5; }
          </style>
        </head>
        <body>
          <h1>Analytics Report - ${new Date().toLocaleDateString()}</h1>
          
          <h2>Vendor Activity by Year</h2>
          <table>
            <tr><th>Year</th><th>Count</th></tr>
            ${vendorActivityData
              .map((item) => `<tr><td>${item.year}</td><td>${item.value}</td></tr>`)
              .join("")}
          </table>

          <h2>Customer Growth by Year</h2>
          <table>
            <tr><th>Year</th><th>Count</th></tr>
            ${customerGrowthData
              .map((item) => `<tr><td>${item.year}</td><td>${item.value}</td></tr>`)
              .join("")}
          </table>

          <h2>Subscription Trends by Year</h2>
          <table>
            <tr><th>Year</th><th>Active</th><th>Other</th></tr>
            ${subscriptionTrendsData
              .map(
                (item) =>
                  `<tr><td>${item.year}</td><td>${item.line1}</td><td>${item.line2}</td></tr>`
              )
              .join("")}
          </table>
        </body>
        </html>
      `;

      const blob = new Blob([reportContent], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `analytics_report_${
        new Date().toISOString().split("T")[0]
      }.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      alert(
        "Report downloaded as HTML. You can open it in a browser and print to PDF."
      );
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  };

  if (loading) {
    return (
      <div className="report-analytics">
        <div className="charts-grid">
          <div className="chart-card">
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              height: '200px',
              fontSize: '16px',
              color: '#666'
            }}>
              Loading analytics data...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="report-analytics">
      <div className="charts-grid">
        <div className="chart-card vendor-activity">
          <h2 className="chart-title">Vendor Activity</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={vendorActivityData}>
                <CartesianGrid strokeDasharray="0" stroke="#f0f0f0" />
                <XAxis
                  dataKey="year"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#666", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#666", fontSize: 12 }}
                  domain={[0, "auto"]}
                />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#666"
                  strokeWidth={2}
                  dot={{ fill: "#666", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card">
          <h2 className="chart-title">Subscription Trends</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={subscriptionTrendsData}>
                <CartesianGrid strokeDasharray="0" stroke="#f0f0f0" />
                <XAxis
                  dataKey="year"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#666", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#666", fontSize: 12 }}
                  domain={[0, "auto"]}
                />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="line1"
                  stroke="#999"
                  strokeWidth={2}
                  dot={{ fill: "#999", r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="line2"
                  stroke="#ccc"
                  strokeWidth={2}
                  dot={{ fill: "#ccc", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card">
          <h2 className="chart-title">Customer Growth</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={customerGrowthData}>
                <CartesianGrid strokeDasharray="0" stroke="#f0f0f0" />
                <XAxis
                  dataKey="year"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#666", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#666", fontSize: 12 }}
                  domain={[0, "auto"]}
                />
                <Tooltip />
                <Bar dataKey="value" fill="#1e293b" radius={[0, 0, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card income-report">
          <h2 className="chart-title">Income Report</h2>
          <div className="download-buttons">
            <button className="download-btn" onClick={handleDownloadCSV}>
              Download CSV
            </button>
            <button className="download-btn" onClick={handleDownloadPDF}>
              Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportAndAnalytics;