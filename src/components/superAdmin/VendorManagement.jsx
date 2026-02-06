import React, { useState, useEffect } from "react";
import vendorService from "../../services/vendorService";
import subscriptionService from "../../services/subscriptionService";
import "./VendorManagement.scss";

const VendorManagement = () => {
  const [vendors, setVendors] = useState([]);
  const [plans, setPlans] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    vendorName: "",
    businessName: "",
    mobile: "",
    email: "",
    gst: "",
    address: "",
    bankAccount: "",
    planId: "",
  });

  useEffect(() => {
    fetchVendors();
    fetchPlans();
  }, []);

  const fetchVendors = async (search = "") => {
    try {
      setLoading(true);
      setError(null);
      const response = await vendorService.getAllVendors({
        search,
        page: 1,
        size: 50,
      });

      if (response.success) {
        setVendors(response.data.rows || []);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch vendors");
      console.error("Error fetching vendors:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPlans = async () => {
    try {
      const response = await subscriptionService.getPlans();
      if (response.success) {
        // No filtering - show all plans
        console.log("📦 Plans loaded:", response.data);
        setPlans(response.data || []);
      }
    } catch (err) {
      console.error("Error fetching plans:", err);
      setError("Failed to load subscription plans");
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery !== undefined) {
        fetchVendors(searchQuery);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleRowClick = async (vendor) => {
    setSelectedVendor(vendor);
    setIsEditing(false);
    setFormData({
      vendorName: vendor.vendorName || "",
      businessName: vendor.businessName || "",
      mobile: vendor.mobile || "",
      email: vendor.email || "",
      gst: vendor.gst || "",
      address: vendor.address || "",
      bankAccount: vendor.bankAccount || "",
      planId: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const clearForm = () => {
    setFormData({
      vendorName: "",
      businessName: "",
      mobile: "",
      email: "",
      gst: "",
      address: "",
      bankAccount: "",
      planId: "",
    });
    setSelectedVendor(null);
    setIsEditing(false);
    setError(null);
  };

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleAddVendor = async (e) => {
    e.preventDefault();

    if (!formData.vendorName || !formData.mobile) {
      setError("Vendor name and mobile number are required");
      return;
    }

    if (!formData.planId) {
      setError("Please select a subscription plan");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const vendorResponse = await vendorService.createVendor({
        vendorName: formData.vendorName,
        businessName: formData.businessName,
        mobile: formData.mobile,
        email: formData.email,
        gst: formData.gst,
        address: formData.address,
        bankAccount: formData.bankAccount,
        status: "Active",
      });

      if (vendorResponse.success) {
        const newVendor = vendorResponse.data;

        try {
          const subscriptionResponse =
            await subscriptionService.assignSubscription({
              vendorId: newVendor.id,
              planId: parseInt(formData.planId),
            });

          if (subscriptionResponse.success) {
            showSuccess("Vendor and subscription added successfully!");
          } else {
            showSuccess(
              "Vendor added but subscription assignment failed. Please assign manually."
            );
          }
        } catch (subErr) {
          console.error("Subscription assignment error:", subErr);
          showSuccess(
            "Vendor added but subscription assignment failed. Please assign manually."
          );
        }

        clearForm();
        fetchVendors(searchQuery);
      }
    } catch (err) {
      setError(err.message || "Failed to add vendor");
      console.error("Error adding vendor:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateVendor = async (e) => {
    e.preventDefault();

    if (!selectedVendor) return;

    try {
      setLoading(true);
      setError(null);

      const response = await vendorService.updateVendor(selectedVendor.id, {
        vendorName: formData.vendorName,
        businessName: formData.businessName,
        mobile: formData.mobile,
        email: formData.email,
        gst: formData.gst,
        address: formData.address,
        bankAccount: formData.bankAccount,
      });

      if (response.success) {
        showSuccess("Vendor updated successfully!");
        setIsEditing(false);
        fetchVendors(searchQuery);
        setSelectedVendor(response.data);
      }
    } catch (err) {
      setError(err.message || "Failed to update vendor");
      console.error("Error updating vendor:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVendor = async () => {
    if (!selectedVendor) return;

    if (
      !window.confirm(
        `Are you sure you want to delete ${selectedVendor.vendorName}?`
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await vendorService.deleteVendor(selectedVendor.id);

      if (response.success) {
        showSuccess("Vendor deleted successfully!");
        clearForm();
        fetchVendors(searchQuery);
      }
    } catch (err) {
      setError(err.message || "Failed to delete vendor");
      console.error("Error deleting vendor:", err);
    } finally {
      setLoading(false);
    }
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

  return (
    <div className="vendor-management">
      <div className="vm-header">
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
            placeholder="Search vendors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
        </button>
      </div>

      {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
      )}

      {error && <div className="alert alert-error">{error}</div>}

      <div className="vm-stats">
        <div className="stat-card">
          <div className="stat-label">Total Vendors</div>
          <div className="stat-value">{vendors.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Active Vendors</div>
          <div className="stat-value">
            {vendors.filter((v) => v.status === "Active").length}
          </div>
        </div>
      </div>

      <div className="vm-content">
        <div className="left-section">
          <div className="vendor-list-card">
            <h2 className="card-title">
              Vendor List
              {loading && <span className="loading-spinner">Loading...</span>}
            </h2>
            <div className="table-wrapper">
              <table className="vendor-table">
                <thead>
                  <tr>
                    <th>Vendor</th>
                    <th>Mobile Number</th>
                    <th>Join Date</th>
                    <th>Expiry Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {vendors.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        style={{ textAlign: "center", padding: "40px" }}
                      >
                        {loading ? "Loading vendors..." : "No vendors found"}
                      </td>
                    </tr>
                  ) : (
                    vendors.map((vendor) => (
                      <tr
                        key={vendor.id}
                        onClick={() => handleRowClick(vendor)}
                        className={
                          selectedVendor?.id === vendor.id ? "selected" : ""
                        }
                      >
                        <td>{vendor.vendorName}</td>
                        <td>{vendor.mobile}</td>
                        <td>{formatDate(vendor.createdAt)}</td>
                        <td>{formatDate(vendor.expiryDate)}</td>
                        <td>
                          <span
                            className={`status-badge ${vendor.status?.toLowerCase()}`}
                          >
                            {vendor.status || "Active"}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {selectedVendor && (
            <div className="vendor-details-card">
              <div className="details-header">
                <h3>Vendor Details</h3>
                <span
                  className={`status-badge ${selectedVendor.status?.toLowerCase()}`}
                >
                  {selectedVendor.status || "Active"}
                </span>
              </div>

              <div className="details-content">
                <div className="detail-section">
                  <h4>{selectedVendor.vendorName}</h4>
                  <p className="vendor-owner">
                    {selectedVendor.businessName || "N/A"}
                  </p>
                </div>

                <div className="detail-row">
                  <span className="detail-label">Mobile Number</span>
                  <span className="detail-value">{selectedVendor.mobile}</span>
                </div>

                {selectedVendor.email && (
                  <div className="detail-row">
                    <span className="detail-label">Email</span>
                    <span className="detail-value">{selectedVendor.email}</span>
                  </div>
                )}

                {selectedVendor.expiryDate && (
                  <div className="detail-row">
                    <span className="detail-label">Subscription Expiry</span>
                    <span className="detail-value">
                      {formatDate(selectedVendor.expiryDate)}
                    </span>
                  </div>
                )}

                {selectedVendor.gst && (
                  <div className="detail-row">
                    <span className="detail-label">GST Number</span>
                    <span className="detail-value">{selectedVendor.gst}</span>
                  </div>
                )}

                {selectedVendor.address && (
                  <div className="detail-row">
                    <span className="detail-label">Address</span>
                    <span className="detail-value">
                      {selectedVendor.address}
                    </span>
                  </div>
                )}

                {selectedVendor.bankAccount && (
                  <div className="detail-row">
                    <span className="detail-label">Bank Account Number</span>
                    <span className="detail-value">
                      {selectedVendor.bankAccount}
                    </span>
                  </div>
                )}
              </div>

              <div className="details-actions">
                <button
                  className="edit-btn"
                  onClick={() => setIsEditing(true)}
                  disabled={loading}
                >
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={handleDeleteVendor}
                  disabled={loading}
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="right-section">
          <div className="add-vendor-card">
            <div className="form-header">
              <h3 className="card-title">
                {isEditing ? "Edit Vendor" : "Add Vendor"}
              </h3>
              {(isEditing || selectedVendor) && (
                <button className="clear-btn" onClick={clearForm} type="button">
                  Clear
                </button>
              )}
            </div>

            <div className="vendor-form">
              <div className="form-group">
                <label>Vendor Name *</label>
                <input
                  type="text"
                  name="vendorName"
                  placeholder="Enter Vendor Name"
                  value={formData.vendorName}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Business Name</label>
                <input
                  type="text"
                  name="businessName"
                  placeholder="Enter Business Name"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Mobile Number *</label>
                <input
                  type="tel"
                  name="mobile"
                  placeholder="Enter Mobile Number"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  required
                  pattern="[0-9]{10}"
                  title="Please enter a valid 10-digit mobile number"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>GST Number</label>
                <input
                  type="text"
                  name="gst"
                  placeholder="Enter GST Number"
                  value={formData.gst}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Address</label>
                <input
                  type="text"
                  name="address"
                  placeholder="Enter Address"
                  value={formData.address}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Bank Account Number</label>
                <input
                  type="text"
                  name="bankAccount"
                  placeholder="Enter Account Number"
                  value={formData.bankAccount}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>

              {!isEditing && (
                <div className="form-group subscription-group">
                  <label>Subscription Plan *</label>
                  <select
                    name="planId"
                    value={formData.planId}
                    onChange={handleInputChange}
                    required
                    disabled={loading || plans.length === 0}
                    className="plan-select"
                  >
                    <option value="">
                      {plans.length === 0
                        ? "No plans available"
                        : "Select Subscription Plan"}
                    </option>
                    {plans.map((plan) => (
                      <option key={plan.id} value={plan.id}>
                        {plan.name} - ₹{plan.price} ({plan.duration}{" "}
                        {plan.durationUnit}
                        {plan.duration > 1 ? "s" : ""})
                      </option>
                    ))}
                  </select>
                  {/* <span className="form-hint">
                    Subscription will be automatically assigned to the vendor
                  </span> */}
                </div>
              )}

              <button
                type="button"
                className="submit-btn"
                disabled={loading}
                onClick={isEditing ? handleUpdateVendor : handleAddVendor}
              >
                {loading
                  ? "Processing..."
                  : isEditing
                  ? "Update Vendor"
                  : "Add Vendor with Subscription"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorManagement;
