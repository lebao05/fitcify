import { useState } from "react";
import { ChevronLeft, Eye, EyeOff } from "lucide-react";
import "./SignupStep1.scss";
import { useNavigate } from "react-router-dom";
export default function SignupStep1() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Password validation
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumberOrSpecial = /[0-9#?!&@$%^*()_+\-=[\]{};':"\\|,.<>/~`]/.test(
    password
  );
  const hasMinLength = password.length >= 10;
  const navigate = useNavigate();
  const isValid = hasLetter && hasNumberOrSpecial && hasMinLength;

  return (
    <div className="signup-step1">
      {/* Spotify Logo */}
      <div className="mb-12">
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
          <div className="space-y-1">
            <div className="w-6 h-0.5 bg-black rounded"></div>
            <div className="w-6 h-0.5 bg-black rounded"></div>
            <div className="w-6 h-0.5 bg-black rounded"></div>
          </div>
        </div>
      </div>

      {/* Progress and Header */}
      <div className="w-full max-w-md mb-8">
        <div className="flex items-center mb-6">
          <ChevronLeft
            className="w-6 h-6 mr-4 cursor-pointer hover:text-gray-300"
            onClick={() => {
              navigate("/signup");
            }}
          />
          <div>
            <div className="text-sm text-gray-400 mb-1">Step 1 of 2</div>
            <h1 className="text-2xl font-bold">Create a password</h1>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-800 h-1 rounded-full mb-8">
          <div className="bg-[#1DB954] h-1 rounded-full w-1/2"></div>
        </div>
      </div>

      {/* Password Form */}
      <div className="w-full max-w-md space-y-6">
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-2">
            Password
          </label>
          <div className="email-container">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="password-input"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Password Requirements */}
        <div>
          <p className="text-sm text-gray-300 mb-4">
            Your password must contain at least
          </p>
          <div className="space-y-3">
            <div className="flex items-center">
              <div
                className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                  hasLetter
                    ? "bg-[#1DB954] border-[#1DB954]"
                    : "border-gray-500"
                }`}
              >
                {hasLetter && (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
              </div>
              <span
                className={`text-sm ${
                  hasLetter ? "text-[#1DB954]" : "text-gray-400"
                }`}
              >
                1 letter
              </span>
            </div>

            <div className="flex items-center">
              <div
                className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                  hasNumberOrSpecial
                    ? "bg-[#1DB954] border-[#1DB954]"
                    : "border-gray-500"
                }`}
              >
                {hasNumberOrSpecial && (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
              </div>
              <span
                className={`text-sm ${
                  hasNumberOrSpecial ? "text-[#1DB954]" : "text-gray-400"
                }`}
              >
                {"1 number or special character (example: # ? ! &)"}
              </span>
            </div>

            <div className="flex items-center">
              <div
                className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                  hasMinLength
                    ? "bg-[#1DB954] border-[#1DB954]"
                    : "border-gray-500"
                }`}
              >
                {hasMinLength && (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
              </div>
              <span
                className={`text-sm ${
                  hasMinLength ? "text-[#1DB954]" : "text-gray-400"
                }`}
              >
                10 characters
              </span>
            </div>
          </div>
        </div>

        {/* Next Button */}
        <button
          className={`w-full h-12 rounded-full font-bold text-black transition-all ${
            isValid
              ? "bg-[#1DB954] hover:bg-[#1ed760]"
              : "bg-gray-600 cursor-not-allowed"
          }`}
          disabled={!isValid}
        >
          Next
        </button>
      </div>

      {/* Footer */}
      <div className="mt-16 text-center">
        <p className="text-xs text-gray-500">
          This site is protected by reCAPTCHA and the Google{" "}
          <a href="#" className="underline hover:text-gray-400">
            Privacy Policy
          </a>{" "}
          and{" "}
          <a href="#" className="underline hover:text-gray-400">
            Terms of Service
          </a>{" "}
          apply.
        </p>
      </div>
    </div>
  );
}
