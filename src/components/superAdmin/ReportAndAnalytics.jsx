import React from "react";
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
import "./ReportAndAnalytics.scss";

const ReportAndAnalytics = () => {
  const vendorActivityData = [
    { year: "2021", value: 600 },
    { year: "2022", value: 200 },
    { year: "2023", value: 750 },
    { year: "2024", value: 500 },
    { year: "2025", value: 300 },
  ];

  const subscriptionTrendsData = [
    { year: "2021", line1: 400, line2: 600 },
    { year: "2022", line1: 200, line2: 700 },
    { year: "2023", line1: 650, line2: 300 },
    { year: "2024", line1: 700, line2: 700 },
    { year: "2025", line1: 150, line2: 200 },
  ];

  const customerGrowthData = [
    { year: "2021", value: 250 },
    { year: "2022", value: 250 },
    { year: "2023", value: 550 },
    { year: "2024", value: 750 },
    { year: "2025", value: 800 },
  ];

  const handleDownloadCSV = () => {
    console.log("Download CSV");
  };

  const handleDownloadPDF = () => {
    console.log("Download PDF");
  };

  return (
    <div className="report-analytics">
      <div className="search-header">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search Hear..."
            className="search-input"
          />
        </div>
        <button className="notification-btn">
          <span className="notification-icon">🔔</span>
        </button>
      </div>

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
                  domain={[0, 800]}
                  ticks={[0, 200, 400, 600, 800]}
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
                  domain={[0, 800]}
                  ticks={[0, 200, 400, 600, 800]}
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
                  domain={[0, 800]}
                  ticks={[0, 200, 400, 600, 800]}
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
