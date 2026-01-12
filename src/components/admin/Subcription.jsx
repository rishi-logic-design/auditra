import React, { useState } from "react";
import Sidebar from "./Sidebar";
import "./subcription.scss";

const Subscription = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const pricingPlans = [
    {
      name: "Basic Plan",
      price: "₹999",
      period: "/month",
      color: "#0ea5e9",
      features: [
        { text: "Up to 10 Vendor", included: true },
        { text: "Basic analytics", included: true },
        { text: "Email Support", included: true },
      ],
    },
    {
      name: "Pro Plan",
      price: "₹2,999",
      period: "/month",
      color: "#8b5cf6",
      popular: true,
      features: [
        { text: "Up to 100 Vendor", included: true },
        { text: "Advance analytics", included: true },
        { text: "Priority Support", included: true },
        { text: "Custom Report", included: true },
      ],
    },
    {
      name: "Enterprise Plan",
      price: "₹11,999",
      period: "/month",
      color: "#ec4899",
      features: [
        { text: "Unlimited Vendor", included: true },
        { text: "Full analytics", included: true },
        { text: "24/7 Support", included: true },
        { text: "Custom Integrations", included: true },
      ],
    },
  ];

  const activeSubscriptions = [
    {
      id: 1,
      vendorName: "Shiv Rolla House",
      plan: "Pro Plan",
      renewDate: "16 December 2025",
      status: "Active",
    },
    {
      id: 2,
      vendorName: "Maa Rolla House",
      plan: "Basic Plan",
      renewDate: "16 December 2025",
      status: "Active",
    },
    {
      id: 3,
      vendorName: "Ganesh Rolla House",
      plan: "Basic Plan",
      renewDate: "10 November 2025",
      status: "Inactive",
    },
    {
      id: 4,
      vendorName: "Krishna Fast Food",
      plan: "Enterprise Plan",
      renewDate: "20 January 2026",
      status: "Active",
    },
  ];

  const handleSelectPlan = (planName) => {
    console.log("Selected plan:", planName);
    // Handle plan selection
  };

  const handleEdit = (subscriptionId) => {
    console.log("Edit subscription:", subscriptionId);
    // Handle edit action
  };

  return (
    <div className="subscription-container">
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
            <input type="text" placeholder="Search Here..." />
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

        <div className="pricing-section">
          <div className="pricing-grid">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`pricing-card ${plan.popular ? "popular" : ""}`}
                style={{ borderTopColor: plan.color }}
              >
                {plan.popular && (
                  <div className="popular-badge">Most Popular</div>
                )}

                <div className="plan-header">
                  <h3 style={{ color: plan.color }}>{plan.name}</h3>
                  <div className="price">
                    <span className="amount">{plan.price}</span>
                    <span className="period">{plan.period}</span>
                  </div>
                </div>

                <div className="features-list">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="feature-item">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        style={{ color: plan.color }}
                      >
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                      <span>{feature.text}</span>
                    </div>
                  ))}
                </div>

                <button
                  className="select-btn"
                  style={{ background: plan.color }}
                  onClick={() => handleSelectPlan(plan.name)}
                >
                  Select Plan
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="active-subscriptions-section">
          <h2>Active Subscriptions</h2>
          <div className="subscriptions-list">
            {activeSubscriptions.map((subscription) => (
              <div key={subscription.id} className="subscription-item">
                <div className="subscription-info">
                  <div className="vendor-details">
                    <h4>{subscription.vendorName}</h4>
                    <p className="plan-name">{subscription.plan}</p>
                  </div>
                  <div className="subscription-meta">
                    <span className="renew-label">
                      Renew: {subscription.renewDate}
                    </span>
                    <span
                      className={`status-badge ${subscription.status.toLowerCase()}`}
                    >
                      {subscription.status}
                    </span>
                  </div>
                </div>
                <button
                  className="edit-btn"
                  onClick={() => handleEdit(subscription.id)}
                >
                  Edit
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
