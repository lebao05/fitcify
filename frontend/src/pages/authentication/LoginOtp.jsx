import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function EmailVerification() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
      {/* “logo” */}
      <div className="absolute top-8 left-8">
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
          <div className="space-y-0.5">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-4 h-0.5 bg-black rounded" />
            ))}
          </div>
        </div>
      </div>

      <div className="w-full max-w-md text-center space-y-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">
            Enter the 6‑digit code sent to
          </h1>
          <h1 className="text-2xl font-bold">you at t**3@g***l.com.</h1>
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
        >
          Log in
        </button>

        {/* alt login */}
        <button
          className="text-white transition-all transform
                           hover:text-lg cursor-pointer"
          onClick={() => navigate("/loginpassword")}
        >
          Log in with a password
        </button>
      </div>
    </div>
  );
}
