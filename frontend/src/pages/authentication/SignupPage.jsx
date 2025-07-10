import React, { useState } from "react";
import "./SignupPage.scss";
import { Navigate, useNavigate } from "react-router-dom";

export default function SpotifyLogin() {
    const [email, setEmail] = useState("");
    const [showError, setShowError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const nagivate = useNavigate();
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
        if (!email.trim()) {
            setShowError(true);
            return;
        }

        if (!validateEmail(email)) {
            setShowError(true);
            return;
        }
        nagivate("/signup-step1");
    };

    const handleSignupWithGoogle = () => {
        window.location.href = "http://localhost:5000/api/auth/google"; // Adjust the URL to your backend endpoint
    };
    const handleSignupWithFacebook = () => {
        window.location.href = "http://localhost:5000/api/auth/facebook";
    }
    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleContinue();
        }
    };

    return (
        <div className="signup-page">
            <div className="signup-container">
                <div className="title">Sign up to start listening</div>
                <div className="login-with">
                    <div
                        className="login-option google"
                        role="button"
                        tabIndex={0}
                        onClick={() => handleSignupWithGoogle()}
                    >
                        Continue with Google
                    </div>

                    <div
                        className="login-option facebook"
                        role="button"
                        tabIndex={0}
                        onClick={() => handleSignupWithFacebook()}
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
                            onClick={() => nagivate("/login")}
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