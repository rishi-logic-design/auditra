import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../firebase";
import axios from "axios";
import "./Login.scss";

const API_URL =
  import.meta.env.VITE_API_URL || "https://accountsoft.onrender.com";

const Login = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState("enterPhone");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user") || "null");
    if (user) {
      navigate("/admin/dashboard");
    }
  }, [navigate]);

  useEffect(() => {
    if (step === "enterPhone" && !window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier = new RecaptchaVerifier(
          auth,
          "recaptcha-container",
          {
            size: "invisible",
            callback: () => {
              console.log("reCAPTCHA solved");
            },
          }
        );
      } catch (error) {
        console.error("reCAPTCHA error:", error);
      }
    }
  }, [step]);

  const checkUserRole = async (mobileNumber) => {
    try {
      const response = await axios({
        method: "post",
        url: `${API_URL}/auth/check-user-role`,
        data: { mobile: mobileNumber },
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data.data.user;
    } catch (error) {
      console.error("Role check error:", error);
      const errorMsg =
        error.response?.data?.message || "User verification failed";
      throw new Error(errorMsg);
    }
  };

  const sendOtp = async () => {
    setMessage("");

    if (!/^[0-9]{10}$/.test(mobile)) {
      setMessage("Please enter a valid 10-digit mobile number");
      return;
    }

    setLoading(true);
    try {
      const backendUser = await checkUserRole(mobile);

      if (!backendUser) {
        setMessage("User not found in system");
        setLoading(false);
        return;
      }

      if (backendUser.role !== "admin" && backendUser.role !== "superadmin") {
        setMessage("You are not authorized to access admin panel");
        setLoading(false);
        return;
      }

      const phoneNumber = `+91${mobile}`;
      const appVerifier = window.recaptchaVerifier;

      const confirmation = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        appVerifier
      );
      setConfirmationResult(confirmation);
      setStep("enterOtp");
      setMessage("OTP sent successfully!");
    } catch (error) {
      console.error("Error sending OTP:", error);
      setMessage(error.message || "Failed to send OTP");

      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    setMessage("");
    const otpValue = otp.join("");

    if (otpValue.length !== 6) {
      setMessage("Please enter complete 6-digit OTP");
      return;
    }

    if (!confirmationResult) {
      setMessage("Please request OTP first");
      return;
    }

    setLoading(true);
    try {
      // Verify with Firebase
      const result = await confirmationResult.confirm(otpValue);
      const firebaseUser = result.user;

      // Exchange Firebase auth for backend JWT token
      const response = await axios.post(
        `${API_URL}/auth/exchange-firebase-token`,
        {
          mobile: mobile,
          firebaseUid: firebaseUser.uid,
        }
      );

      if (response.data.success) {
        const { token, user } = response.data.data;

        // Store token in localStorage (for API calls)
        localStorage.setItem("token", token);

        // Store user data in sessionStorage
        sessionStorage.setItem("user", JSON.stringify(user));

        setMessage("Login successful!");

        setTimeout(() => {
          if (user.role === "superadmin") {
            navigate("/superadmin/dashboard", { replace: true });
          } else if (user.role === "admin") {
            navigate("/admin/dashboard", { replace: true });
          } else {
            navigate("/login", { replace: true });
          }
        }, 500);
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setMessage(
        error.response?.data?.message || "Invalid OTP. Please try again."
      );
      setOtp(["", "", "", "", "", ""]);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^[0-9]+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split("").forEach((char, i) => {
      if (i < 6) newOtp[i] = char;
    });
    setOtp(newOtp);
  };

  return (
    <div className="login-page">
      <div className="background-pattern"></div>

      <div className="login-card">
        <div className="icon-wrapper">
          <div className="icon-circle">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
        </div>

        <h2>Welcome Back</h2>
        <p className="subtitle">
          {step === "enterPhone"
            ? "Enter your mobile number to receive OTP"
            : "Enter the verification code sent to your phone"}
        </p>

        {step === "enterPhone" && (
          <div className="form-container">
            <div className="input-group">
              <label>Mobile Number</label>
              <div className="phone-input-wrapper">
                <span className="country-code">+91</span>
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) =>
                    setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))
                  }
                  placeholder="Enter 10-digit number"
                  className="phone-input"
                  maxLength={10}
                />
                <svg
                  className="phone-icon"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
            </div>

            <button
              className="btn"
              onClick={sendOtp}
              disabled={loading || mobile.length !== 10}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Sending OTP...
                </>
              ) : (
                <>
                  Send OTP
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </button>

            <div className="security-note">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <span>Your data is secure and encrypted</span>
            </div>
          </div>
        )}

        {step === "enterOtp" && (
          <div className="form-container">
            <div className="otp-section">
              <label>Verification Code</label>
              <div className="otp-boxes" onPaste={handleOtpPaste}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    maxLength={1}
                    className="otp-box"
                  />
                ))}
              </div>
            </div>

            <button className="btn" onClick={verifyOtp} disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Verifying...
                </>
              ) : (
                <>
                  Verify OTP
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
                </>
              )}
            </button>

            <div className="otp-actions">
              <button
                className="resend-btn"
                onClick={sendOtp}
                disabled={loading}
              >
                Resend OTP
              </button>
              <button
                className="change-number"
                onClick={() => setStep("enterPhone")}
              >
                Change Number
              </button>
            </div>
          </div>
        )}

        {message && (
          <div
            className={`message ${
              message.includes("success") ? "success" : "error"
            }`}
          >
            {message}
          </div>
        )}

        <div id="recaptcha-container"></div>
      </div>
    </div>
  );
};

export default Login;
