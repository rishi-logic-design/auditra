import React, { useState } from "react";
import "./SuperSettings.scss";

const SuperSettings = () => {
  const [themeMode, setThemeMode] = useState("light");
  const [adminRole, setAdminRole] = useState("superAdmin");
  const [autoBackup, setAutoBackup] = useState("daily");
  const [autoRenewal, setAutoRenewal] = useState(true);
  const [defaultLanguage, setDefaultLanguage] = useState("english");

  const [rolePermissions, setRolePermissions] = useState({
    dashboardAccess: true,
    editVendorCustomer: true,
    addEditDeleteData: true,
    subscriptionControls: true,
    reportsAccess: true,
    inviteNewAdmin: false,
  });

  const [vendorVerification, setVendorVerification] = useState({
    gst: true,
    businessLicense: false,
    aadharUpload: true,
  });

  const [customerVerification, setCustomerVerification] = useState({
    mobileOtp: true,
  });

  const [notifications, setNotifications] = useState({
    sms: true,
    email: true,
  });

  const [pushNotifications, setPushNotifications] = useState({
    moduleAlerts: true,
    criticalAlerts: true,
    customAlertMessages: false,
  });

  const [paymentGateways, setPaymentGateways] = useState({
    razorpay: true,
    paypal: true,
    gpay: true,
  });

  const [cloudStorage, setCloudStorage] = useState({
    googleDrive: true,
    dropbox: false,
    awsS3: false,
  });

  return (
    <div className="super-settings">
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

      <div className="settings-grid">
        <div className="settings-column">
          <div className="settings-card">
            <h2 className="card-title">General</h2>

            <div className="form-group">
              <label className="form-label">System Name</label>
              <input
                type="text"
                placeholder="Enter System Name"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Logo</label>
              <button className="upload-btn">Click to Upload</button>
            </div>

            <div className="form-group">
              <label className="form-label">Theme Mode</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="theme"
                    value="light"
                    checked={themeMode === "light"}
                    onChange={(e) => setThemeMode(e.target.value)}
                  />
                  <span>Light</span>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="theme"
                    value="dark"
                    checked={themeMode === "dark"}
                    onChange={(e) => setThemeMode(e.target.value)}
                  />
                  <span>Dark</span>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="theme"
                    value="auto"
                    checked={themeMode === "auto"}
                    onChange={(e) => setThemeMode(e.target.value)}
                  />
                  <span>Auto</span>
                </label>
              </div>
            </div>
          </div>

          <div className="settings-card">
            <h2 className="card-title">Vendor & Customer</h2>

            <div className="form-group">
              <label className="form-label">
                Vendor Verification Requirements
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={vendorVerification.gst}
                  onChange={(e) =>
                    setVendorVerification({
                      ...vendorVerification,
                      gst: e.target.checked,
                    })
                  }
                />
                <span>GST</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={vendorVerification.businessLicense}
                  onChange={(e) =>
                    setVendorVerification({
                      ...vendorVerification,
                      businessLicense: e.target.checked,
                    })
                  }
                />
                <span>Business License</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={vendorVerification.aadharUpload}
                  onChange={(e) =>
                    setVendorVerification({
                      ...vendorVerification,
                      aadharUpload: e.target.checked,
                    })
                  }
                />
                <span>Aadhar Upload</span>
              </label>
            </div>

            <div className="form-group">
              <label className="form-label">Customer Verification</label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={customerVerification.mobileOtp}
                  onChange={(e) =>
                    setCustomerVerification({
                      ...customerVerification,
                      mobileOtp: e.target.checked,
                    })
                  }
                />
                <span>Mobile OTP</span>
              </label>
            </div>
          </div>

          <div className="settings-card">
            <h2 className="card-title">Notifications & Alerts</h2>

            <div className="form-group">
              <label className="form-label">SMS Notifications</label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={notifications.sms}
                  onChange={(e) =>
                    setNotifications({
                      ...notifications,
                      sms: e.target.checked,
                    })
                  }
                />
                <span>SMS</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={notifications.email}
                  onChange={(e) =>
                    setNotifications({
                      ...notifications,
                      email: e.target.checked,
                    })
                  }
                />
                <span>Email</span>
              </label>
            </div>

            <div className="form-group">
              <label className="form-label">Push Notifications</label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={pushNotifications.moduleAlerts}
                  onChange={(e) =>
                    setPushNotifications({
                      ...pushNotifications,
                      moduleAlerts: e.target.checked,
                    })
                  }
                />
                <span>Module / Alerts</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={pushNotifications.criticalAlerts}
                  onChange={(e) =>
                    setPushNotifications({
                      ...pushNotifications,
                      criticalAlerts: e.target.checked,
                    })
                  }
                />
                <span>Critical Alerts</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={pushNotifications.customAlertMessages}
                  onChange={(e) =>
                    setPushNotifications({
                      ...pushNotifications,
                      customAlertMessages: e.target.checked,
                    })
                  }
                />
                <span>Custom Alert Messages</span>
              </label>
            </div>
          </div>

          <div className="settings-card">
            <h2 className="card-title">Backup & Restore</h2>

            <div className="form-group">
              <label className="form-label">Automatic Backup</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="backup"
                    value="daily"
                    checked={autoBackup === "daily"}
                    onChange={(e) => setAutoBackup(e.target.value)}
                  />
                  <span>Daily</span>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="backup"
                    value="weekly"
                    checked={autoBackup === "weekly"}
                    onChange={(e) => setAutoBackup(e.target.value)}
                  />
                  <span>Weekly</span>
                </label>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Backup Data</label>
              <button className="action-btn">Download Database Backup</button>
            </div>

            <div className="form-group">
              <label className="form-label">Cloud Storage Integrations</label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={cloudStorage.googleDrive}
                  onChange={(e) =>
                    setCloudStorage({
                      ...cloudStorage,
                      googleDrive: e.target.checked,
                    })
                  }
                />
                <span>Google Drive</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={cloudStorage.dropbox}
                  onChange={(e) =>
                    setCloudStorage({
                      ...cloudStorage,
                      dropbox: e.target.checked,
                    })
                  }
                />
                <span>Dropbox</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={cloudStorage.awsS3}
                  onChange={(e) =>
                    setCloudStorage({
                      ...cloudStorage,
                      awsS3: e.target.checked,
                    })
                  }
                />
                <span>AWS S3</span>
              </label>
            </div>
          </div>

          <div className="settings-card">
            <h2 className="card-title">Language</h2>

            <div className="form-group">
              <label className="form-label">Default Language</label>
              <select
                className="form-select"
                value={defaultLanguage}
                onChange={(e) => setDefaultLanguage(e.target.value)}
              >
                <option value="english">English</option>
                <option value="hindi">Hindi</option>
                <option value="spanish">Spanish</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Add New Language</label>
              <input
                type="text"
                placeholder="Add New Language"
                className="form-input"
              />
            </div>
          </div>
        </div>

        <div className="settings-column">
          <div className="settings-card">
            <h2 className="card-title">User & Role Management</h2>

            <div className="form-group">
              <label className="form-label">Admin Roles</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="role"
                    value="superAdmin"
                    checked={adminRole === "superAdmin"}
                    onChange={(e) => setAdminRole(e.target.value)}
                  />
                  <span>Super Admin</span>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="role"
                    value="admin"
                    checked={adminRole === "admin"}
                    onChange={(e) => setAdminRole(e.target.value)}
                  />
                  <span>Admin</span>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="role"
                    value="customer"
                    checked={adminRole === "customer"}
                    onChange={(e) => setAdminRole(e.target.value)}
                  />
                  <span>Customer</span>
                </label>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Role Permissions</label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={rolePermissions.dashboardAccess}
                  onChange={(e) =>
                    setRolePermissions({
                      ...rolePermissions,
                      dashboardAccess: e.target.checked,
                    })
                  }
                />
                <span>Dashboard Access</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={rolePermissions.editVendorCustomer}
                  onChange={(e) =>
                    setRolePermissions({
                      ...rolePermissions,
                      editVendorCustomer: e.target.checked,
                    })
                  }
                />
                <span>Edit Vendors/Customer</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={rolePermissions.addEditDeleteData}
                  onChange={(e) =>
                    setRolePermissions({
                      ...rolePermissions,
                      addEditDeleteData: e.target.checked,
                    })
                  }
                />
                <span>Add / Edit / Delete Data</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={rolePermissions.subscriptionControls}
                  onChange={(e) =>
                    setRolePermissions({
                      ...rolePermissions,
                      subscriptionControls: e.target.checked,
                    })
                  }
                />
                <span>Subscription Controls</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={rolePermissions.reportsAccess}
                  onChange={(e) =>
                    setRolePermissions({
                      ...rolePermissions,
                      reportsAccess: e.target.checked,
                    })
                  }
                />
                <span>Reports Access</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={rolePermissions.inviteNewAdmin}
                  onChange={(e) =>
                    setRolePermissions({
                      ...rolePermissions,
                      inviteNewAdmin: e.target.checked,
                    })
                  }
                />
                <span>Invite New Admin</span>
              </label>
            </div>
          </div>

          <div className="settings-card">
            <h2 className="card-title">Subscription & Billing</h2>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Price</label>
                <input
                  type="text"
                  placeholder="Enter Price"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Duration</label>
                <input
                  type="text"
                  placeholder="Enter Duration"
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Features</label>
              <input
                type="text"
                placeholder="Enter Features"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Payment Gateways</label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={paymentGateways.razorpay}
                  onChange={(e) =>
                    setPaymentGateways({
                      ...paymentGateways,
                      razorpay: e.target.checked,
                    })
                  }
                />
                <span>Razorpay</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={paymentGateways.paypal}
                  onChange={(e) =>
                    setPaymentGateways({
                      ...paymentGateways,
                      paypal: e.target.checked,
                    })
                  }
                />
                <span>PayPal</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={paymentGateways.gpay}
                  onChange={(e) =>
                    setPaymentGateways({
                      ...paymentGateways,
                      gpay: e.target.checked,
                    })
                  }
                />
                <span>GPay</span>
              </label>
            </div>

            <div className="form-group">
              <label className="form-label toggle-label">
                <span>Auto - Renewal</span>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={autoRenewal}
                    onChange={(e) => setAutoRenewal(e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </label>
            </div>

            <div className="form-group">
              <label className="form-label">Invoice Format</label>
              <input
                type="text"
                placeholder="Invoice Format"
                className="form-input"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Prefix</label>
                <input type="text" placeholder="INV" className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Start Count</label>
                <input type="text" placeholder="0001" className="form-input" />
              </div>
            </div>

            <div className="form-group">
              <button className="action-btn">
                Invoice Download Template(PDF)
              </button>
            </div>

            <div className="form-group">
              <label className="form-label">GST</label>
              <input type="text" placeholder="GST %" className="form-input" />
            </div>
          </div>

          <div className="settings-card">
            <h2 className="card-title">Support & Helpdesk</h2>

            <div className="form-group">
              <label className="form-label">Contact Support Email</label>
              <input
                type="email"
                placeholder="support@example.com"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">FAQ Editor</label>
              <button className="action-btn">Terms & Conditions Editor</button>
            </div>

            <div className="form-group">
              <label className="form-label">Privacy Policy Editor</label>
              <button className="action-btn">Privacy Policy Editor</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperSettings;
