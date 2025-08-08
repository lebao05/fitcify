import React, { useState } from "react";
import "./SignupPage.scss";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setEmail } from "../../redux/slices/signupSlice";
import logo from "../../assets/applogo.jpg";
import {
  getGoogleOAuthUrl,
  getFacebookOAuthUrl,
  checkEmailExists,
} from "../../services/authApi";

export default function SpotifyLogin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const email = useSelector((state) => state.signup.email);

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    dispatch(setEmail(e.target.value));
    if (error) {
      setError(""); // Clear error if user types again
    }
  };

  const handleContinue = async () => {
    setError("");
    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setIsLoading(true);
      const result = await checkEmailExists(email);
      console.log(result);
      // You can optionally validate the response here
      if (result) {
        setError("An account already exists with that email.");
        return;
      }

      navigate("/signup-step1");
    } catch (err) {
      if (err.response?.data?.Message == "No account with that email")
        navigate("/signup-step1");
      else setError("Please try again.Something went wrong!");
    } finally {
      setIsLoading(false);
    }
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
              className={`email-input ${error ? "error" : ""}`}
              disabled={isLoading}
              autoComplete="email"
            />
            {error && <div className="error-message">{error}</div>}
          </div>

          <div className="continue-button">
            <button onClick={handleContinue} disabled={isLoading}>
              {isLoading ? "Loading..." : "Continue to register"}
            </button>
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
