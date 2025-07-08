import React, { useState } from "react";
import "./LoginPage.scss";

export default function SpotifyLogin() {
    const [email, setEmail] = useState("");
    const [showError, setShowError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

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
    const handleLoginWithGoogle = () => {
        window.location.href = "http://localhost:5000/api/auth/google"; // Adjust the URL to your backend endpoint
    };
    const handleLoginWithFacebook = () => {
        window.location.href = "http://localhost:5000/api/auth/facebook";
    }
    const handleContinue = async () => {
        if (!email.trim()) {
            setShowError(true);
            return;
        }

        if (!validateEmail(email)) {
            setShowError(true);
            return;
        }

        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            console.log("Continue with email:", email);
            setIsLoading(false);
            // Handle login logic here
        }, 1500);
    };
    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleContinue();
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="title">Log in to Fitcify</div>
                <div className="login-with">
                    <div
                        className="login-option google"
                        role="button"
                        tabIndex={0}
                        onClick={() => handleLoginWithGoogle()}
                    >
                        Continue with Google
                    </div>

                    <div
                        className="login-option facebook"
                        role="button"
                        tabIndex={0}
                        onClick={() => handleLoginWithFacebook()}
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
                        <button
                            onClick={handleContinue}
                            disabled={isLoading}
                            aria-label={isLoading ? "Logging in..." : "Continue"}
                        >
                            {isLoading ? "Logging in..." : "Continue"}
                        </button>
                    </div>
                </div>
                <div className="further-options">
                    <div className="no-account-registered">
                        Don't have an account?{" "}
                        <span
                            className="link"
                            onClick={() => window.location.href	= "/signup"}
                            role="button"
                            tabIndex={0}
                            onKeyPress={(e) =>
                                e.key === "Enter" && console.log("Navigate to sign up")
                            }
                        >
                            Sign up for Spotify
                        </span>
                    </div>

                    <div
                        className="forgot-password"
                        onClick={() => console.log("Navigate to forgot password")}
                        role="button"
                        tabIndex={0}
                        onKeyPress={(e) =>
                            e.key === "Enter" && console.log("Navigate to forgot password")
                        }
                    >
                        Forgot your password?
                    </div>
                </div>
            </div>
        </div>
    );
}