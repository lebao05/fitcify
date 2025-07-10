import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./LoginPage.scss";
import { loginWithPassword } from "../../redux/slices/userSlice";
import { sendLoginOtp } from "../../services/authApi";
import { useDispatch } from "react-redux";
// Utility to read query params
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function SpotifyLogin({ email, setEmail }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const query = useQuery();
  const method = query.get("method");
  const showPassword = method === "password";
  const [password, setPassword] = useState("");
  const [showError, setShowError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpError, setOtpError] = useState(""); // new

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (showError && e.target.value.trim()) {
      setShowError(false);
    }
  };

  const handleContinue = async () => {
    setOtpError(""); // Reset OTP error on new attempt
    if (!email.trim() || !validateEmail(email)) {
      setShowError(true);
      return;
    }
    try {
      if (showPassword) {
        setIsLoading(true);
        const result = await dispatch(
          loginWithPassword({ email, password })
        ).unwrap();
        console.log("Login successful:", result);
        setIsLoading(false);
        navigate("/");
      } else {
        const result = await sendLoginOtp(email);
        console.log("OTP sent:", result);
        navigate("/loginotp");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      setOtpError(
        error?.response?.data?.Message ||
          "Failed to send OTP. Please try again."
      );
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleContinue();
  };

  const handleLoginWithGoogle = () => {
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  const handleLoginWithFacebook = () => {
    window.location.href = "http://localhost:5000/api/auth/facebook";
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="title">Log in to Fitcify</div>

        <div className="login-with">
          <div className="login-option google" onClick={handleLoginWithGoogle}>
            Continue with Google
          </div>
          <div
            className="login-option facebook"
            onClick={handleLoginWithFacebook}
          >
            Continue with Facebook
          </div>
        </div>

        <div className="horizontal-line">
          <span>or</span>
        </div>

        <div className="email-container">
          <div className="email-input-container">
            <label htmlFor="email-input" className="email-label">
              Email or username
            </label>
            <input
              id="email-input"
              type="email"
              placeholder="Email or username"
              value={email}
              onChange={handleEmailChange}
              onKeyPress={handleKeyPress}
              className={`email-input ${showError ? "error" : ""}`}
              disabled={isLoading}
              autoComplete="email"
            />
            {showError && (
              <div className="error-message">
                {!email.trim()
                  ? "Please enter your email or username."
                  : "Please enter a valid email address."}
              </div>
            )}
          </div>

          {showPassword && (
            <div className="email-input-container">
              <label htmlFor="password-input" className="email-label">
                Password
              </label>
              <input
                id="password-input"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="email-input"
                disabled={isLoading}
                autoComplete="current-password"
              />
            </div>
          )}

          <div className="continue-button">
            <button
              onClick={handleContinue}
              disabled={isLoading}
              aria-label={isLoading ? "Logging in..." : "Continue"}
            >
              {isLoading ? "Logging in..." : "Continue"}
            </button>
          </div>
          {otpError && (
            <div className="text-red-500 text-sm mt-1 text-left font-medium">
              {otpError}
            </div>
          )}
        </div>
        {showPassword && (
          <div className="mb-4">
            <button
              className="text-white transition-all 
          hover:text-green-600 cursor-pointer underline"
              onClick={() => navigate("/login")}
            >
              Log in without password
            </button>
          </div>
        )}
        <div className="further-options">
          <div className="no-account-registered">
            Don't have an account?{" "}
            <span
              className="link"
              onClick={() => (window.location.href = "/signup")}
              role="button"
              tabIndex={0}
            >
              Sign up for Spotify
            </span>
          </div>

          <div
            className="forgot-password"
            onClick={() => console.log("Navigate to forgot password")}
            role="button"
            tabIndex={0}
          >
            Forgot your password?
          </div>
        </div>
      </div>
    </div>
  );
}
