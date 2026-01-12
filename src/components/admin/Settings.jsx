import React, { useState } from "react";
import Sidebar from "./Sidebar";
import "./Settings.scss";

const Settings = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [profileImage, setProfileImage] = useState(null);

  const [personalInfo, setPersonalInfo] = useState({
    adminName: "",
    email: "",
    mobile: "",
  });

  const [passwordInfo, setPasswordInfo] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState({ type: "", text: "" });

  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePersonalInfoSubmit = (e) => {
    e.preventDefault();
    // Add validation and API call here
    setMessage({
      type: "success",
      text: "Personal information updated successfully!",
    });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();

    if (passwordInfo.newPassword !== passwordInfo.confirmPassword) {
      setMessage({
        type: "error",
        text: "New password and confirm password do not match!",
      });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      return;
    }

    if (passwordInfo.newPassword.length < 6) {
      setMessage({
        type: "error",
        text: "Password must be at least 6 characters!",
      });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      return;
    }

    // Add API call here
    setMessage({ type: "success", text: "Password changed successfully!" });
    setPasswordInfo({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  return (
    <div className="settings-container">
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

        {message.text && (
          <div className={`alert ${message.type}`}>
            {message.type === "success" ? (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
            ) : (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            )}
            <span>{message.text}</span>
          </div>
        )}

        <div className="settings-content">
          <div className="settings-card">
            <h2>Personal Info</h2>
            <form onSubmit={handlePersonalInfoSubmit}>
              <div className="form-row">
                <div className="form-group-with-image">
                  <div className="form-fields">
                    <div className="form-group">
                      <label>Admin Name</label>
                      <input
                        type="text"
                        name="adminName"
                        value={personalInfo.adminName}
                        onChange={handlePersonalInfoChange}
                        placeholder="Enter Admin Name"
                      />
                    </div>

                    <div className="form-group">
                      <label>Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={personalInfo.email}
                        onChange={handlePersonalInfoChange}
                        placeholder="Enter Email Address"
                      />
                    </div>

                    <div className="form-group">
                      <label>Mobile Number</label>
                      <input
                        type="tel"
                        name="mobile"
                        value={personalInfo.mobile}
                        onChange={handlePersonalInfoChange}
                        placeholder="Enter Mobile Number"
                        maxLength="10"
                      />
                    </div>
                  </div>

                  <div className="profile-image-section">
                    <div className="profile-image">
                      {profileImage ? (
                        <img src={profileImage} alt="Profile" />
                      ) : (
                        <svg
                          width="64"
                          height="64"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        >
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                      )}
                      <label htmlFor="profile-upload" className="upload-icon">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                          <circle cx="12" cy="13" r="4" />
                        </svg>
                      </label>
                      <input
                        type="file"
                        id="profile-upload"
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{ display: "none" }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
            </form>
          </div>

          <div className="settings-card">
            <h2>Change Password</h2>
            <form onSubmit={handlePasswordSubmit}>
              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordInfo.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter Current Password"
                />
              </div>

              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordInfo.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter New Password"
                />
              </div>

              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordInfo.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter Confirm Password"
                />
              </div>

              <button type="submit" className="btn btn-primary">
                Change Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
