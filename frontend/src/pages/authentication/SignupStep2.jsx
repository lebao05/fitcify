import { useState } from "react";
import { ChevronLeft, ChevronDown } from "lucide-react";

export default function SignupStep2() {
  const [name, setName] = useState("");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [gender, setGender] = useState("");
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Form validation
  const isValid =
    name.trim() !== "" &&
    day !== "" &&
    month !== "" &&
    year !== "" &&
    gender !== "";

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
          <ChevronLeft className="w-6 h-6 mr-4 cursor-pointer hover:text-gray-300" />
          <div>
            <div className="text-sm text-gray-400 mb-1">Step 2 of 3</div>
            <h1 className="text-2xl font-bold">Tell us about yourself</h1>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-800 h-1 rounded-full mb-8">
          <div className="bg-[#1DB954] h-1 rounded-full w-3/3"></div>
        </div>
      </div>

      {/* Form */}
      <div className="w-full max-w-md space-y-6">
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Name
          </label>
          <p className="text-xs text-gray-400 mb-2">
            This name will appear on your profile
          </p>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full h-12 bg-[#1a1a1a] border-2 border-gray-600 rounded text-white px-4 outline-none transition-colors hover:border-white focus:border-white"
          />
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Date of birth
          </label>
          <p className="text-xs text-gray-400 mb-2">
            Why do we need your date of birth?{" "}
            <a href="#" className="text-[#1DB954] underline hover:no-underline">
              Learn more
            </a>
            .
          </p>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="dd"
              value={day}
              onChange={(e) => setDay(e.target.value)}
              className="w-16 h-12 bg-[#1a1a1a] border-2 border-gray-600 rounded text-white px-3 text-center outline-none transition-colors hover:border-white focus:border-white"
              maxLength={2}
            />
            <div className="relative flex-1">
              <button
                type="button"
                onClick={() => setShowMonthDropdown(!showMonthDropdown)}
                className="w-full h-12 bg-[#1a1a1a] border-2 border-gray-600 rounded text-white px-4 outline-none transition-colors hover:border-white focus:border-white flex items-center justify-between"
              >
                <span className={month ? "text-white" : "text-gray-400"}>
                  {month || "Month"}
                </span>
                <ChevronDown className="w-4 h-4" />
              </button>
              {showMonthDropdown && (
                <div className="absolute top-full left-0 right-0 bg-[#1a1a1a] border-2 border-gray-600 rounded mt-1 max-h-48 overflow-y-auto z-10">
                  {months.map((monthName, index) => (
                    <button
                      key={monthName}
                      type="button"
                      onClick={() => {
                        setMonth(monthName);
                        setShowMonthDropdown(false);
                      }}
                      className="w-full px-4 py-2 text-left text-white hover:bg-gray-700 transition-colors"
                    >
                      {monthName}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <input
              type="text"
              placeholder="yyyy"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-20 h-12 bg-[#1a1a1a] border-2 border-gray-600 rounded text-white px-3 text-center outline-none transition-colors hover:border-white focus:border-white"
              maxLength={4}
            />
          </div>
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium mb-1">Gender</label>
          <p className="text-xs text-gray-400 mb-4">
            We use your gender to help personalize our content recommendations
            and ads for you.
          </p>
          <div className="space-y-3">
            <div className="flex flex-wrap gap-x-8 gap-y-3">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="man"
                  checked={gender === "man"}
                  onChange={(e) => setGender(e.target.value)}
                  className="sr-only"
                />
                <div
                  className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                    gender === "man" ? "border-[#1DB954]" : "border-gray-500"
                  }`}
                >
                  {gender === "man" && (
                    <div className="w-2 h-2 bg-[#1DB954] rounded-full"></div>
                  )}
                </div>
                <span className="text-sm text-white">Man</span>
              </label>

              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="woman"
                  checked={gender === "woman"}
                  onChange={(e) => setGender(e.target.value)}
                  className="sr-only"
                />
                <div
                  className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                    gender === "woman" ? "border-[#1DB954]" : "border-gray-500"
                  }`}
                >
                  {gender === "woman" && (
                    <div className="w-2 h-2 bg-[#1DB954] rounded-full"></div>
                  )}
                </div>
                <span className="text-sm text-white">Woman</span>
              </label>

              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="non-binary"
                  checked={gender === "non-binary"}
                  onChange={(e) => setGender(e.target.value)}
                  className="sr-only"
                />
                <div
                  className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                    gender === "non-binary"
                      ? "border-[#1DB954]"
                      : "border-gray-500"
                  }`}
                >
                  {gender === "non-binary" && (
                    <div className="w-2 h-2 bg-[#1DB954] rounded-full"></div>
                  )}
                </div>
                <span className="text-sm text-white">Non-binary</span>
              </label>
            </div>

            <div className="flex flex-wrap gap-x-8 gap-y-3">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="something-else"
                  checked={gender === "something-else"}
                  onChange={(e) => setGender(e.target.value)}
                  className="sr-only"
                />
                <div
                  className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                    gender === "something-else"
                      ? "border-[#1DB954]"
                      : "border-gray-500"
                  }`}
                >
                  {gender === "something-else" && (
                    <div className="w-2 h-2 bg-[#1DB954] rounded-full"></div>
                  )}
                </div>
                <span className="text-sm text-white">Something else</span>
              </label>

              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="prefer-not-to-say"
                  checked={gender === "prefer-not-to-say"}
                  onChange={(e) => setGender(e.target.value)}
                  className="sr-only"
                />
                <div
                  className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                    gender === "prefer-not-to-say"
                      ? "border-[#1DB954]"
                      : "border-gray-500"
                  }`}
                >
                  {gender === "prefer-not-to-say" && (
                    <div className="w-2 h-2 bg-[#1DB954] rounded-full"></div>
                  )}
                </div>
                <span className="text-sm text-white">Prefer not to say</span>
              </label>
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
