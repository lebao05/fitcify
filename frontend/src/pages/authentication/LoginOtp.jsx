import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import obfuscateEmail from "../../styles/utils/obfuscateEmail";
import { sendLoginOtp } from "../../services/authApi";
import { useDispatch } from "react-redux";
import { loginWithOtp } from "../../redux/slices/userSlice";
import logo from "../../assets/applogo.jpg"; // Adjust path if needed

export default function EmailVerification({ email }) {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  /* ----- handlers ----- */
  const handleInputChange = (index, value) => {
    if (value.length > 1) return;
    const next = [...code];
    next[index] = value;
    setCode(next);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0)
      inputRefs.current[index - 1]?.focus();
  };
  const handeResendOtp = async () => {
    try {
      await sendLoginOtp(email);
      alert("OTP resent successfully!");
    } catch (error) {
      alert(
        error?.response?.data?.message ||
          "Failed to resend OTP. Please try again."
      );
    }
  };
  const login = async () => {
    const otp = code.join("");
    if (otp.length !== 6) {
      alert("Please enter a valid 6-digit OTP.");
      return;
    }
    try {
      const result = await dispatch(loginWithOtp({ email, otp })).unwrap();
      console.log("Login successful:", result);
      navigate("/");
    } catch (error) {
      console.error("Error logging in with OTP:", error);
      alert(error || "Failed to log in with OTP. Please try again.");
    }
  };
  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").slice(0, 6);
    const next = [...code];
    for (let i = 0; i < pasted.length && i < 6; i++)
      if (/^\d$/.test(pasted[i])) next[i] = pasted[i];
    setCode(next);
    const empty = next.findIndex((d) => d === "");
    const focus = empty === -1 ? 5 : Math.min(empty, 5);
    inputRefs.current[focus]?.focus();
  };

  const ready = code.every((d) => d !== "");
  if (!email || !email.trim()) {
    window.location.href = "/login";
    return null;
  } else
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
        {/* “logo” */}
        <div className="absolute top-6 left-6">
          <img
            src={logo}
            alt="Fitcify Logo"
            className="w-12 h-12 rounded-full transition-all duration-300 cursor-pointer 
             hover:scale-110 hover:drop-shadow-[0_0_10px_#1DB954]"
          />
        </div>

        <div className="w-full max-w-md text-center space-y-8">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Enter the 6‑digit code sent to
            </h1>
            <h1 className="text-2xl font-bold">{obfuscateEmail(email)}</h1>
          </div>

          {/* six inputs */}
          <div className="flex justify-center gap-3">
            {code.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (inputRefs.current[i] = el)}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInputChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onPaste={handlePaste}
                className="w-12 h-12 bg-transparent border-2 border-gray-600 rounded text-white text-center text-xl font-bold outline-none transition-all transform
                         hover:border-white hover:scale-110 hover:text-2xl cursor-pointer"
              />
            ))}
          </div>

          {/* resend button */}
          <button
            className="px-6 py-2 border border-gray-600 rounded-full text-white transition-all transform
                           hover:border-white hover:text-lg cursor-pointer"
            onClick={handeResendOtp}
          >
            Resend code
          </button>

          {/* log‑in button */}
          <button
            disabled={!ready}
            className={`w-full h-12 rounded-full font-bold text-black transition-all transform ${
              ready
                ? "bg-[#1DB954] hover:bg-[#1ed760] hover:text-lg cursor-pointer"
                : "bg-gray-600 cursor-not-allowed"
            }`}
            onClick={login}
          >
            Log in
          </button>

          {/* alt login */}
          <button
            className="text-white transition-all transform
                           hover:text-lg cursor-pointer"
            onClick={() => navigate("/login?method=password")}
          >
            Log in with a password
          </button>
        </div>
      </div>
    );
}
