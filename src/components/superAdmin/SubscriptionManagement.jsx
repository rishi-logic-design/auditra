import React, { useState, useEffect } from "react";
import subscriptionService from "../../services/subscriptionService";
import vendorService from "../../services/vendorService";
import "./SubscriptionManagement.scss";

const SubscriptionManagement = () => {
  const [plans, setPlans] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [selectedVendor, setSelectedVendor] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("");
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const [stats, setStats] = useState({
    active: 0,
    expiringSoon: 0,
    expired: 0,
    cancelled: 0,
  });

  const [planForm, setPlanForm] = useState({
    name: "",
    duration: "",
    durationUnit: "month",
    price: "",
    features: "",
    status: "Active",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchPlans(),
        fetchSubscriptions(),
        fetchVendors(),
        fetchStats(),
        fetchExpiringSubscriptions(),
      ]);
    } catch (err) {
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const fetchPlans = async () => {
    try {
      const response = await subscriptionService.getPlans();
      if (response.success) {
        setPlans(response.data);
      }
    } catch (err) {
      console.error("Error fetching plans:", err);
    }
  };

  const fetchSubscriptions = async () => {
    try {
      const response = await subscriptionService.getSubscriptions();
      if (response.success) {
        const subsWithDays = response.data.rows.map((sub) => ({
          ...sub,
          daysLeft: calculateDaysLeft(sub.endDate),
        }));
        setSubscriptions(subsWithDays);
      }
    } catch (err) {
      console.error("Error fetching subscriptions:", err);
    }
  };

  const fetchVendors = async () => {
    try {
      const response = await vendorService.getVendors({ size: 100 });
      if (response.success) {
        setVendors(response.data.rows);
      }
    } catch (err) {
      console.error("Error fetching vendors:", err);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await subscriptionService.getStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  const fetchExpiringSubscriptions = async () => {
    try {
      const response = await subscriptionService.getExpiringSubscriptions(7);
      if (response.success) {
        const alertList = response.data.map((sub) => {
          const daysLeft = calculateDaysLeft(sub.endDate);
          return {
            type: daysLeft === 0 ? "error" : "warning",
            message:
              daysLeft === 0
                ? `${
                    sub.vendor?.vendorName || "Unknown"
                  }'s subscription expires TODAY!`
                : `${
                    sub.vendor?.vendorName || "Unknown"
                  }'s subscription expires in ${daysLeft} day${
                    daysLeft !== 1 ? "s" : ""
                  }`,
            subscription: sub,
          };
        });
        setAlerts(alertList);
      }
    } catch (err) {
      console.error("Error fetching expiring subscriptions:", err);
    }
  };

  const calculateDaysLeft = (endDate) => {
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    const diffTime = end - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handlePlanSubmit = async () => {
    if (!planForm.name || !planForm.duration || !planForm.price) {
      setError("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const planData = {
        ...planForm,
        duration: parseInt(planForm.duration),
        price: parseFloat(planForm.price),
        features: planForm.features
          ? planForm.features
              .split(",")
              .map((f) => f.trim())
              .filter((f) => f)
          : [],
      };

      if (editingPlan) {
        const response = await subscriptionService.updatePlan(
          editingPlan.id,
          planData
        );
        if (response.success) {
          showSuccess("Plan updated successfully!");
          fetchPlans();
        }
      } else {
        const response = await subscriptionService.createPlan(planData);
        if (response.success) {
          showSuccess("Plan created successfully!");
          fetchPlans();
        }
      }

      setShowPlanModal(false);
      resetPlanForm();
    } catch (err) {
      setError(err.message || "Failed to save plan");
    } finally {
      setLoading(false);
    }
  };

  const handleAssignSubscription = async () => {
    if (!selectedVendor || !selectedPlan) {
      setError("Please select both vendor and plan");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await subscriptionService.assignSubscription({
        vendorId: parseInt(selectedVendor),
        planId: parseInt(selectedPlan),
      });

      if (response.success) {
        showSuccess("Subscription assigned successfully!");
        fetchSubscriptions();
        fetchStats();
        fetchExpiringSubscriptions();
        setShowAssignModal(false);
        setSelectedVendor("");
        setSelectedPlan("");
      }
    } catch (err) {
      setError(err.message || "Failed to assign subscription");
    } finally {
      setLoading(false);
    }
  };

  const resetPlanForm = () => {
    setPlanForm({
      name: "",
      duration: "",
      durationUnit: "month",
      price: "",
      features: "",
      status: "Active",
    });
    setEditingPlan(null);
  };

  const handleEditPlan = (plan) => {
    setPlanForm({
      name: plan.name,
      duration: plan.duration.toString(),
      durationUnit: plan.durationUnit,
      price: plan.price.toString(),
      features: Array.isArray(plan.features) ? plan.features.join(", ") : "",
      status: plan.status,
    });
    setEditingPlan(plan);
    setShowPlanModal(true);
  };

  const handleDeletePlan = async (planId) => {
    if (!window.confirm("Are you sure you want to delete this plan?")) {
      return;
    }

    try {
      setLoading(true);
      const response = await subscriptionService.deletePlan(planId);
      if (response.success) {
        showSuccess("Plan deleted successfully!");
        fetchPlans();
      }
    } catch (err) {
      setError(err.message || "Failed to delete plan");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async (subId) => {
    if (!window.confirm("Are you sure you want to cancel this subscription?")) {
      return;
    }

    try {
      setLoading(true);
      const response = await subscriptionService.cancelSubscription(subId);
      if (response.success) {
        showSuccess("Subscription cancelled successfully!");
        fetchSubscriptions();
        fetchStats();
      }
    } catch (err) {
      setError(err.message || "Failed to cancel subscription");
    } finally {
      setLoading(false);
    }
  };

  const handleRenewSubscription = async (sub) => {
    try {
      setLoading(true);
      const response = await subscriptionService.renewSubscription(
        sub.id,
        sub.planId
      );
      if (response.success) {
        showSuccess("Subscription renewed successfully!");
        fetchSubscriptions();
        fetchStats();
        fetchExpiringSubscriptions();
      }
    } catch (err) {
      setError(err.message || "Failed to renew subscription");
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    const statusMap = {
      active: "status-active",
      expired: "status-expired",
      cancelled: "status-cancelled",
      Active: "status-active",
      Inactive: "status-inactive",
    };
    return statusMap[status] || "";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="subscription-management">
      {/* Header */}
      <div className="header">
        <h1 className="title">Subscription Management</h1>
        <button
          className="btn-primary"
          onClick={() => setShowAssignModal(true)}
        >
          <span className="icon">+</span>
          Assign Subscription
        </button>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
      )}
      {error && <div className="alert alert-error">{error}</div>}

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="alerts-section">
          {alerts.map((alert, idx) => (
            <div key={idx} className={`alert-card ${alert.type}`}>
              <span className="alert-icon">⚠️</span>
              <span className="alert-message">{alert.message}</span>
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card stat-active">
          <div className="stat-content">
            <div className="stat-label">Active Subscriptions</div>
            <div className="stat-value">{stats.active}</div>
          </div>
          <div className="stat-icon">✓</div>
        </div>

        <div className="stat-card stat-expiring">
          <div className="stat-content">
            <div className="stat-label">Expiring Soon (7 days)</div>
            <div className="stat-value">{stats.expiringSoon}</div>
          </div>
          <div className="stat-icon">⏰</div>
        </div>

        <div className="stat-card stat-expired">
          <div className="stat-content">
            <div className="stat-label">Expired</div>
            <div className="stat-value">{stats.expired}</div>
          </div>
          <div className="stat-icon">✕</div>
        </div>

        <div className="stat-card stat-cancelled">
          <div className="stat-content">
            <div className="stat-label">Cancelled</div>
            <div className="stat-value">{stats.cancelled}</div>
          </div>
          <div className="stat-icon">⊗</div>
        </div>
      </div>

      {/* Plans Management */}
      <div className="plans-section">
        <div className="section-header">
          <h2 className="section-title">Subscription Plans</h2>
          <button
            className="btn-secondary"
            onClick={() => setShowPlanModal(true)}
          >
            <span className="icon">+</span>
            Add Plan
          </button>
        </div>

        <div className="plans-grid">
          {plans.map((plan) => (
            <div key={plan.id} className="plan-card">
              <div className="plan-header">
                <div className="plan-info">
                  <h3 className="plan-name">{plan.name}</h3>
                  <p className="plan-duration">
                    {plan.duration} {plan.durationUnit}
                    {plan.duration > 1 ? "s" : ""}
                  </p>
                </div>
                <span className={`plan-status ${getStatusClass(plan.status)}`}>
                  {plan.status}
                </span>
              </div>

              <div className="plan-price">₹{plan.price}</div>

              {plan.features &&
                Array.isArray(plan.features) &&
                plan.features.length > 0 && (
                  <ul className="plan-features">
                    {plan.features.slice(0, 3).map((feature, idx) => (
                      <li key={idx}>
                        <span className="feature-icon">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                )}

              <div className="plan-actions">
                <button
                  className="btn-edit"
                  onClick={() => handleEditPlan(plan)}
                >
                  Edit
                </button>
                <button
                  className="btn-delete"
                  onClick={() => handleDeletePlan(plan.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Subscriptions Table */}
      <div className="subscriptions-section">
        <h2 className="section-title">All Subscriptions</h2>

        <div className="table-container">
          <table className="subscriptions-table">
            <thead>
              <tr>
                <th>Vendor</th>
                <th>Plan</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Days Left</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.length === 0 ? (
                <tr>
                  <td colSpan="7" className="no-data">
                    {loading ? "Loading..." : "No subscriptions found"}
                  </td>
                </tr>
              ) : (
                subscriptions.map((sub) => (
                  <tr key={sub.id}>
                    <td className="vendor-name">
                      {sub.vendor?.vendorName || "Unknown"}
                    </td>
                    <td>{sub.plan?.name || "N/A"}</td>
                    <td>{formatDate(sub.startDate)}</td>
                    <td>{formatDate(sub.endDate)}</td>
                    <td>
                      <span
                        className={`days-left ${
                          sub.daysLeft < 0
                            ? "expired"
                            : sub.daysLeft <= 7
                            ? "warning"
                            : "safe"
                        }`}
                      >
                        {sub.daysLeft < 0
                          ? `${Math.abs(sub.daysLeft)} days ago`
                          : `${sub.daysLeft} days`}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`subscription-status ${getStatusClass(
                          sub.status
                        )}`}
                      >
                        {sub.status}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        {sub.status === "active" && (
                          <button
                            className="action-btn cancel"
                            onClick={() => handleCancelSubscription(sub.id)}
                            disabled={loading}
                          >
                            Cancel
                          </button>
                        )}
                        {(sub.status === "expired" ||
                          sub.status === "cancelled") && (
                          <button
                            className="action-btn renew"
                            onClick={() => handleRenewSubscription(sub)}
                            disabled={loading}
                          >
                            Renew
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Plan Modal */}
      {showPlanModal && (
        <div
          className="modal-overlay"
          onClick={() => !loading && setShowPlanModal(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingPlan ? "Edit Plan" : "Add New Plan"}</h2>
              <button
                className="modal-close"
                onClick={() => setShowPlanModal(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>Plan Name *</label>
                <input
                  type="text"
                  value={planForm.name}
                  onChange={(e) =>
                    setPlanForm({ ...planForm, name: e.target.value })
                  }
                  placeholder="e.g., 1 Month, 3 Months"
                  disabled={loading}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Duration *</label>
                  <input
                    type="number"
                    value={planForm.duration}
                    onChange={(e) =>
                      setPlanForm({ ...planForm, duration: e.target.value })
                    }
                    placeholder="e.g., 1, 3, 6"
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label>Unit *</label>
                  <select
                    value={planForm.durationUnit}
                    onChange={(e) =>
                      setPlanForm({ ...planForm, durationUnit: e.target.value })
                    }
                    disabled={loading}
                  >
                    <option value="month">Month</option>
                    <option value="year">Year</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Price (₹) *</label>
                <input
                  type="number"
                  value={planForm.price}
                  onChange={(e) =>
                    setPlanForm({ ...planForm, price: e.target.value })
                  }
                  placeholder="e.g., 999"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Features (comma separated)</label>
                <textarea
                  value={planForm.features}
                  onChange={(e) =>
                    setPlanForm({ ...planForm, features: e.target.value })
                  }
                  placeholder="e.g., Basic Features, Email Support, Analytics"
                  rows="3"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn-cancel"
                onClick={() => {
                  setShowPlanModal(false);
                  resetPlanForm();
                }}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="btn-submit"
                onClick={handlePlanSubmit}
                disabled={loading}
              >
                {loading
                  ? "Processing..."
                  : editingPlan
                  ? "Update Plan"
                  : "Create Plan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Subscription Modal */}
      {showAssignModal && (
        <div
          className="modal-overlay"
          onClick={() => !loading && setShowAssignModal(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Assign Subscription</h2>
              <button
                className="modal-close"
                onClick={() => setShowAssignModal(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>Select Vendor *</label>
                <select
                  value={selectedVendor}
                  onChange={(e) => setSelectedVendor(e.target.value)}
                  disabled={loading}
                >
                  <option value="">Choose a vendor</option>
                  {vendors.map((vendor) => (
                    <option key={vendor.id} value={vendor.id}>
                      {vendor.vendorName} - {vendor.mobile}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Select Plan *</label>
                <select
                  value={selectedPlan}
                  onChange={(e) => setSelectedPlan(e.target.value)}
                  disabled={loading}
                >
                  <option value="">Choose a plan</option>
                  {plans
                    .filter((p) => p.status === "Active")
                    .map((plan) => (
                      <option key={plan.id} value={plan.id}>
                        {plan.name} - ₹{plan.price}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn-cancel"
                onClick={() => {
                  setShowAssignModal(false);
                  setSelectedVendor("");
                  setSelectedPlan("");
                }}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="btn-submit"
                onClick={handleAssignSubscription}
                disabled={loading}
              >
                {loading ? "Processing..." : "Assign Subscription"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionManagement;
