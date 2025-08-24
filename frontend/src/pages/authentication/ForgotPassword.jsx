import React, { useState, useRef } from "react";
import { ArrowLeft, CheckCircle, AlertCircle, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { changePassword, sendForgotOtp } from "../../services/authApi";
import { useDispatch } from "react-redux";
import { verifyForgotOtpThunk } from "../../redux/slices/userSlice";
export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle, loading, otp, password, success, error
  const [errors, setErrors] = useState({});
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const navigate = useNavigate();
  const otpRefs = useRef([]);
  const dispatch = useDispatch();
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const maskEmail = (email) => {
    if (!email) return "";
    const [username, domain] = email.split("@");
    const maskedUsername =
      username.charAt(0) +
      "*".repeat(username.length - 2) +
      username.charAt(username.length - 1);
    const [domainName, extension] = domain.split(".");
    const maskedDomain =
      domainName.charAt(0) +
      "*".repeat(domainName.length - 2) +
      domainName.charAt(domainName.length - 1);
    return `${maskedUsername}@${maskedDomain}.${extension}`;
  };

  const handleSubmit = async () => {
    setErrors({});

    if (!email) {
      setErrors({ email: "Email is required" });
      return;
    }

    if (!validateEmail(email)) {
      setErrors({ email: "Please enter a valid email address" });
      return;
    }

    setStatus("loading");
    try {
      setErrors("");
      await sendForgotOtp(email);
      setStatus("");
      setStatus("otp");
    } catch (err) {
      console.log(err);
      setErrors({ email: err.response.data.Message });
      setStatus("");
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpSubmit = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      setErrors({ otp: "Please enter the complete 6-digit code" });
      return;
    }

    setErrors({});
    setStatus("loading");
    try {
      await dispatch(verifyForgotOtpThunk({ email, otp: otpCode }));
      setStatus("password");
    } catch (err) {
      console.log(err);
      setErrors({ otp: "Invalid code. Please try again." });
      setStatus("otp");
    }
  };

  const handlePasswordSubmit = async () => {
    setErrors({});

    if (!password) {
      setErrors({ password: "Password is required" });
      return;
    }

    if (password.length < 8) {
      setErrors({ password: "Password must be at least 8 characters long" });
      return;
    }

    if (password !== confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match" });
      return;
    }

    setStatus("loading");
    try {
      await changePassword(email, password);
      setStatus("success");
    } catch (err) {
      setStatus("password");
      setErrors({ generalError: "Please try again.Something went wrong!" });
    }
  };

  const handleResendCode = async () => {
    setResendCooldown(60);
    await sendForgotOtp(email);
    setOtp(["", "", "", "", "", ""]);
    setErrors({});

    // Simulate resend
    const timer = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // OTP Screen
  if (status === "otp") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#222222] to-[#040404] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#121212] rounded-lg p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <svg
                className="w-10 h-10 text-white"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z" />
              </svg>
            </div>

            <h1 className="text-2xl font-bold text-white mb-4">
              Enter the 6-digit code sent to you at {maskEmail(email)}.
            </h1>
          </div>

          {/* OTP Input */}
          <div className="flex justify-center space-x-3 mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (otpRefs.current[index] = el)}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                className={`w-12 h-12 text-center text-xl font-bold bg-gray-700 border ${
                  errors.otp ? "border-red-500" : "border-gray-600"
                } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent hover:border-gray-500 transition-all duration-200`}
              />
            ))}
          </div>

          {errors.otp && (
            <div className="flex items-center justify-center space-x-2 mb-4">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <p className="text-red-500 text-sm">{errors.otp}</p>
            </div>
          )}

          {/* Resend Code */}
          <div className="text-center mb-6">
            <button
              onClick={handleResendCode}
              disabled={resendCooldown > 0}
              className="bg-gray-700 cursor-pointer hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed text-white font-medium py-2 px-6 rounded-full transition-all duration-200 text-sm"
            >
              {resendCooldown > 0
                ? `Resend code (${resendCooldown}s)`
                : "Resend code"}
            </button>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleOtpSubmit}
            disabled={status === "loading"}
            className="w-full cursor-pointer bg-green-500 hover:bg-green-400 hover:scale-105 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:hover:scale-100 text-black font-bold py-3 px-6 rounded-full transition-all duration-200 flex items-center justify-center transform mb-6"
          >
            {status === "loading" ? (
              <>
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                Verifying...
              </>
            ) : (
              "Verify"
            )}
          </button>

          {/* Back Button */}
          <div className="text-center mt-6">
            <button
              onClick={() => {
                navigate("/login");
              }}
              className="inline-flex cursor-pointer items-center space-x-2 text-gray-400 hover:text-white text-sm font-medium transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Password Reset Screen
  if (status === "password") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#222222] to-[#040404] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#121212] rounded-lg p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <svg
                className="w-10 h-10 text-white"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z" />
              </svg>
            </div>

            <h1 className="text-3xl font-bold text-white mb-2">
              Create new password
            </h1>
            <p className="text-gray-400 text-sm">
              Choose a strong password for your account
            </p>
          </div>

          <div className="space-y-6">
            {/* New Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-white font-medium mb-2"
              >
                New Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-4 py-3 pr-12 bg-gray-700 border ${
                    errors.password ? "border-red-500" : "border-gray-600"
                  } rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent hover:border-gray-500 transition-all duration-200`}
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <div className="flex items-center space-x-2 mt-2">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <p className="text-red-500 text-sm">{errors.password}</p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-white font-medium mb-2"
              >
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full px-4 py-3 pr-12 bg-gray-700 border ${
                    errors.confirmPassword
                      ? "border-red-500"
                      : "border-gray-600"
                  } rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent hover:border-gray-500 transition-all duration-200`}
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <div className="flex items-center space-x-2 mt-2">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <p className="text-red-500 text-sm">
                    {errors.confirmPassword}
                  </p>
                </div>
              )}
              {errors.generalError && (
                <div className="flex items-center space-x-2 mt-2">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <p className="text-red-500 text-sm">{errors.generalError}</p>
                </div>
              )}{" "}
            </div>

            <button
              onClick={handlePasswordSubmit}
              disabled={status === "loading"}
              className="w-full cursor-pointer bg-green-500 hover:bg-green-400 hover:scale-105 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:hover:scale-100 text-black font-bold py-3 px-6 rounded-full transition-all duration-200 flex items-center justify-center transform"
            >
              {status === "loading" ? (
                <>
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                  Updating...
                </>
              ) : (
                "Reset Password"
              )}
            </button>
          </div>

          {/* Back Button */}
          <div className="text-center mt-6">
            <button
              onClick={() => {
                navigate("/");
              }}
              className="inline-flex cursor-pointer items-center space-x-2 text-gray-400 hover:text-white text-sm font-medium transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Home</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Success Screen
  if (status === "success") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#222222] to-[#040404] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#121212] rounded-lg p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-black" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Password updated!
            </h1>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your password has been successfully updated. You can now log in
              with your new password.
            </p>
          </div>

          <button
            onClick={() => navigate("/")}
            className="w-full cursor-pointer bg-green-500 hover:bg-green-400 hover:scale-105 text-black font-bold py-3 px-6 rounded-full transition-all duration-200 transform"
          >
            Go to Fitcify
          </button>
        </div>
      </div>
    );
  }

  // Initial Email Screen
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#222222] to-[#040404] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#121212] rounded-lg p-8">
        {/* Header */}
        <div className="text-center mb-8">
          {/* Spotify Logo */}
          <div className="flex justify-center mb-6">
            <svg
              className="w-10 h-10 text-white"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z" />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-white mb-2">
            Reset your password
          </h1>
          <p className="text-gray-400 text-sm">
            Enter your email address and we'll send you a link to reset your
            password.
          </p>
        </div>

        {/* Form */}
        <div className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-white font-medium mb-2"
            >
              Email or username
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-4 py-3 bg-gray-700 border ${
                errors.email ? "border-red-500" : "border-gray-600"
              } rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent hover:border-gray-500 transition-all duration-200`}
              placeholder="Email or username"
              disabled={status === "loading"}
            />
            {errors.email && (
              <div className="flex items-center space-x-2 mt-2">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <p className="text-red-500 text-sm">{errors.email}</p>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={status === "loading"}
            className="w-full cursor-pointer bg-green-500 hover:bg-green-400 hover:scale-105 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:hover:scale-100 text-black font-bold py-3 px-6 rounded-full transition-all duration-200 flex items-center justify-center transform"
          >
            {status === "loading" ? (
              <>
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                Sending...
              </>
            ) : (
              "Continue"
            )}
          </button>
        </div>

        {/* Back to login */}
        <div className="text-center mt-5">
          <button
            className="inline-flex cursor-pointer items-center space-x-2 text-gray-400 hover:text-white text-sm font-medium transition-colors duration-200"
            onClick={() => {
              navigate("/login");
            }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to login</span>
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 pt-6 border-t border-gray-600">
          <p className="text-gray-400 text-sm">
            Don't have an account?{" "}
            <button
              className="text-white cursor-pointer hover:text-green-400 font-medium transition-colors duration-200 underline"
              onClick={() => navigate("/signup")}
            >
              Sign up for Fitcify
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
