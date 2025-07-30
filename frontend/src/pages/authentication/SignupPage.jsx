import React, { useState } from "react";
import "./SignupPage.scss";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setEmail } from "../../redux/slices/signupSlice"; // adjust path
import logo from "../../assets/applogo.jpg"; // Adjust path if necessary
import { getGoogleOAuthUrl, getFacebookOAuthUrl } from "../../services/authApi";

export default function SpotifyLogin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux state
  const email = useSelector((state) => state.signup.email);

  // Local state
  const [showError, setShowError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    dispatch(setEmail(e.target.value));
    console.log("Email changed:", e.target.value);
    if (showError && e.target.value.trim()) {
      setShowError(false);
    }
  };

  const handleContinue = () => {
    if (!email.trim() || !validateEmail(email)) {
      setShowError(true);
      return;
    }

    navigate("/signup-step1");
  };

  const handleSignupWithGoogle = () => {
    window.location.href = getGoogleOAuthUrl(
      "http://localhost:5173",
      "http://localhost:5173/signup"
    );
  };

  const handleSignupWithFacebook = () => {
    window.location.href = getFacebookOAuthUrl(
      "http://localhost:5173",
      "http://localhost:5173/signup"
    );
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleContinue();
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="logo-container">
          <img
            src={logo}
            alt="Fitcify Logo"
            className="fitcify-logo"
            onClick={() => (window.location.href = "/")}
          />
        </div>
        <div className="title">Sign up to start listening</div>

        <div className="login-with">
          <div
            className="login-option google"
            role="button"
            tabIndex={0}
            onClick={handleSignupWithGoogle}
          >
            Continue with Google
          </div>

          <div
            className="login-option facebook"
            role="button"
            tabIndex={0}
            onClick={handleSignupWithFacebook}
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

          <div className="continue-button">
            <button onClick={handleContinue}>Next</button>
          </div>
        </div>

        <div className="further-options">
          <div className="no-account-registered">
            Already have an account?{" "}
            <span
              className="link"
              onClick={() => (window.location.href = "/login")}
              role="button"
              tabIndex={0}
            >
              Log in here.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
