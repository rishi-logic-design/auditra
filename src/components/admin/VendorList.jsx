import React, { useState } from "react";
import Sidebar from "./Sidebar";
import "./VendorList.scss";

const VendorList = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const vendors = [
    {
      id: 1,
      name: "Shiv Rolla House",
      owner: "Rajesh Sarma",
      subscriptionDate: "15 May 2025",
      expiryDate: "15 December 2025",
      address: "201, Market Road, Surat, Gujrat",
      status: "Active",
    },
    {
      id: 2,
      name: "Maruti Rolla House",
      owner: "Rajesh Sarma",
      subscriptionDate: "15 May 2025",
      expiryDate: "15 December 2025",
      address: "201, Market Road, Surat, Gujrat",
      status: "Inactive",
    },
    {
      id: 3,
      name: "Maa Rolla Houe",
      owner: "Rajesh Sarma",
      subscriptionDate: "15 May 2025",
      expiryDate: "15 December 2025",
      address: "201, Market Road, Surat, Gujrat",
      status: "Active",
    },
    {
      id: 4,
      name: "Krishna Fast Food",
      owner: "Amit Patel",
      subscriptionDate: "10 June 2025",
      expiryDate: "10 January 2026",
      address: "45, Station Road, Ahmedabad, Gujarat",
      status: "Active",
    },
    {
      id: 5,
      name: "Royal Restaurant",
      owner: "Suresh Kumar",
      subscriptionDate: "20 April 2025",
      expiryDate: "20 November 2025",
      address: "89, Main Street, Vadodara, Gujarat",
      status: "Inactive",
    },
  ];

  const filteredVendors = vendors.filter(
    (vendor) =>
      vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewDetails = (vendorId) => {
    console.log("View details for vendor:", vendorId);
    // Navigate to vendor details page or open modal
  };

  const handleEdit = (vendorId) => {
    console.log("Edit vendor:", vendorId);
    // Navigate to edit page or open edit modal
  };

  return (
    <div className="vendor-list-container">
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
              placeholder="Search Here..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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

        <div className="vendor-list-section">
          {filteredVendors.length === 0 ? (
            <div className="no-vendors">
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4M12 16h.01" />
              </svg>
              <h3>No vendors found</h3>
              <p>Try adjusting your search query</p>
            </div>
          ) : (
            filteredVendors.map((vendor) => (
              <div key={vendor.id} className="vendor-card">
                <div className="vendor-header">
                  <div className="vendor-info">
                    <h3>{vendor.name}</h3>
                    <p className="owner-name">{vendor.owner}</p>
                  </div>
                  <span
                    className={`status-badge ${vendor.status.toLowerCase()}`}
                  >
                    {vendor.status}
                  </span>
                </div>

                <div className="vendor-details">
                  <div className="detail-row">
                    <div className="detail-item">
                      <span className="label">Subscriptions Date</span>
                      <span className="value">{vendor.subscriptionDate}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Expiry Date</span>
                      <span className="value">{vendor.expiryDate}</span>
                    </div>
                  </div>

                  <div className="address-section">
                    <span className="label">Address</span>
                    <span className="value">{vendor.address}</span>
                  </div>
                </div>

                <div className="vendor-actions">
                  <button
                    className="btn btn-secondary"
                    onClick={() => handleViewDetails(vendor.id)}
                  >
                    View Details
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleEdit(vendor.id)}
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorList;
