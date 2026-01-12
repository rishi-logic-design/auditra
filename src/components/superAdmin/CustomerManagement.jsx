import React, { useState, useEffect } from "react";
import customerService from "../../services/customerService";
import vendorService from "../../services/vendorService";
import "./CustomerManagement.scss";

const CustomerManagement = () => {
  const [vendors, setVendors] = useState([]);
  const [selectedVendorId, setSelectedVendorId] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [vendorCustomerCounts, setVendorCustomerCounts] = useState({});

  useEffect(() => {
    fetchVendors();
  }, []);

  useEffect(() => {
    if (selectedVendorId) {
      fetchCustomers();
    } else {
      setCustomers([]);
    }
  }, [selectedVendorId, searchQuery]);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await vendorService.getVendors({
        page: 1,
        size: 100,
      });

      if (response.success) {
        const vendorList = response.data.rows || [];
        setVendors(vendorList);
        
        await fetchCustomerCounts();
        
        if (vendorList.length > 0 && !selectedVendorId) {
          setSelectedVendorId(vendorList[0].id);
        }
      }
    } catch (err) {
      setError(err.message || "Failed to fetch vendors");
      console.error("Error fetching vendors:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomerCounts = async () => {
    try {
      const response = await customerService.getCustomerCountByVendor();
      if (response.success) {
        const counts = {};
        response.data.forEach(item => {
          counts[item.createdBy] = parseInt(item.customerCount);
        });
        setVendorCustomerCounts(counts);
      }
    } catch (err) {
      console.error("Error fetching customer counts:", err);
    }
  };

  const fetchCustomers = async () => {
    if (!selectedVendorId) return;

    try {
      setLoading(true);
      setError(null);
      const response = await customerService.getCustomers({
        vendorId: selectedVendorId,
        search: searchQuery,
        page: 1,
        size: 50,
      });

      if (response.success) {
        setCustomers(response.data.rows || []);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch customers");
      console.error("Error fetching customers:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleVendorSelect = (vendorId) => {
    setSelectedVendorId(vendorId);
    setSelectedCustomer(null);
    setSearchQuery("");
  };

  const handleRowClick = async (customer) => {
    setSelectedCustomer(customer);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getSelectedVendorName = () => {
    const vendor = vendors.find((v) => v.id === selectedVendorId);
    return vendor ? vendor.vendorName : "Select Vendor";
  };

  return (
    <div className="customer-management">
      <div className="cm-header">
        <div className="header-left">
          <h1 className="page-title">Customer Management</h1>
          {selectedVendorId && (
            <div className="selected-vendor-info">
              <span className="vendor-label">Selected Vendor:</span>
              <span className="vendor-name">{getSelectedVendorName()}</span>
              <span className="customer-count">
                ({customers.length} customers)
              </span>
            </div>
          )}
        </div>
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
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={!selectedVendorId}
          />
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="vendor-selection-section">
        <h2 className="section-title">Select Vendor</h2>
        <div className="vendor-grid">
          {vendors.length === 0 ? (
            <div className="no-vendors">No vendors available</div>
          ) : (
            vendors.map((vendor) => (
              <div
                key={vendor.id}
                className={`vendor-card ${
                  selectedVendorId === vendor.id ? "selected" : ""
                }`}
                onClick={() => handleVendorSelect(vendor.id)}
              >
                <div className="vendor-card-header">
                  <h3 className="vendor-name">{vendor.vendorName}</h3>
                  <span
                    className={`status-badge ${vendor.status?.toLowerCase()}`}
                  >
                    {vendor.status || "Active"}
                  </span>
                </div>
                <div className="vendor-card-body">
                  {vendor.businessName && (
                    <p className="business-name">{vendor.businessName}</p>
                  )}
                  <p className="vendor-mobile">{vendor.mobile}</p>
                  <div className="customer-count-badge">
                    <svg
                      width="16"
                      height="16"
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
                    <span>
                      {vendorCustomerCounts[vendor.id] || 0} Customers
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {selectedVendorId && (
        <div className="cm-content-full">
          <div className="customer-list-card">
            <h2 className="card-title">
              Customer List
              {loading && <span className="loading-spinner">Loading...</span>}
            </h2>
            <div className="table-wrapper">
              <table className="customer-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Mobile Number</th>
                    <th>Join Date</th>
                    <th>Business Name</th>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        style={{ textAlign: "center", padding: "40px" }}
                      >
                        {loading
                          ? "Loading customers..."
                          : "No customers found"}
                      </td>
                    </tr>
                  ) : (
                    customers.map((customer) => (
                      <tr
                        key={customer.id}
                        onClick={() => handleRowClick(customer)}
                        className={
                          selectedCustomer?.id === customer.id
                            ? "selected"
                            : ""
                        }
                      >
                        <td>{customer.customerName}</td>
                        <td>{customer.mobileNumber}</td>
                        <td>{formatDate(customer.createdAt)}</td>
                        <td>{customer.businessName || "N/A"}</td>
                        <td>{customer.email || "N/A"}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {selectedCustomer && (
            <div className="customer-details-card">
              <div className="details-header">
                <h3>Customer Details</h3>
              </div>

              <div className="details-content">
                {selectedCustomer.customerImage && (
                  <div className="customer-image-section">
                    <img
                      src={selectedCustomer.customerImage}
                      alt={selectedCustomer.customerName}
                      className="customer-image"
                    />
                  </div>
                )}

                <div className="detail-section">
                  <h4>{selectedCustomer.customerName}</h4>
                  <p className="customer-business">
                    {selectedCustomer.businessName || "N/A"}
                  </p>
                </div>

                <div className="detail-row">
                  <span className="detail-label">Mobile Number</span>
                  <span className="detail-value">
                    {selectedCustomer.mobileNumber}
                  </span>
                </div>

                {selectedCustomer.email && (
                  <div className="detail-row">
                    <span className="detail-label">Email</span>
                    <span className="detail-value">
                      {selectedCustomer.email}
                    </span>
                  </div>
                )}

                {selectedCustomer.gstNumber && (
                  <div className="detail-row">
                    <span className="detail-label">GST Number</span>
                    <span className="detail-value">
                      {selectedCustomer.gstNumber}
                    </span>
                  </div>
                )}

                {selectedCustomer.homeAddress && (
                  <div className="detail-row">
                    <span className="detail-label">Home Address</span>
                    <span className="detail-value">
                      {selectedCustomer.homeAddress}
                    </span>
                  </div>
                )}

                {selectedCustomer.officeAddress && (
                  <div className="detail-row">
                    <span className="detail-label">Office Address</span>
                    <span className="detail-value">
                      {selectedCustomer.officeAddress}
                    </span>
                  </div>
                )}

                {selectedCustomer.aadharNumber && (
                  <div className="detail-row">
                    <span className="detail-label">Aadhar Number</span>
                    <span className="detail-value">
                      {selectedCustomer.aadharNumber}
                    </span>
                  </div>
                )}

                {selectedCustomer.pricePerProduct && (
                  <div className="detail-row">
                    <span className="detail-label">Price Per Product</span>
                    <span className="detail-value">
                      ₹{selectedCustomer.pricePerProduct}
                    </span>
                  </div>
                )}

                <div className="detail-row">
                  <span className="detail-label">Join Date</span>
                  <span className="detail-value">
                    {formatDate(selectedCustomer.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomerManagement;