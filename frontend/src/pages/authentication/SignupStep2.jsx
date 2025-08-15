import React, { useState } from "react";
import { ChevronLeft, ChevronDown } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  setName,
  setDateOfBirth,
  setGender,
} from "../../redux/slices/signupSlice";
import applogo from "../../assets/applogo.jpg";
import { registerUser } from "../../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";

export default function SignupStep2() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const name = useSelector((state) => state.signup.name);
  const dateOfBirth = useSelector((state) => state.signup.dateOfBirth);
  const gender = useSelector((state) => state.signup.gender);
  const email = useSelector((state) => state.signup.email);
  const password = useSelector((state) => state.signup.password);
  const loading = useSelector((state) => state.user.loading);

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

  const handleDOBChange = (key, value) => {
    dispatch(setDateOfBirth({ ...dateOfBirth, [key]: value }));
  };
  const isValidDate = (day, monthName, year) => {
    const monthIndex = months.indexOf(monthName);
    if (monthIndex === -1) return false; // Invalid month

    const d = parseInt(day, 10);
    const y = parseInt(year, 10);

    // Year check: 1900 <= year <= current year
    const currentYear = new Date().getFullYear();
    if (isNaN(y) || y < 1900 || y > currentYear) return false;

    // Day check: must be between 1 and the max days in that month/year
    const maxDays = new Date(y, monthIndex + 1, 0).getDate();
    return d >= 1 && d <= maxDays;
  };
  const isValid =
    name.trim() !== "" &&
    dateOfBirth.day !== "" &&
    dateOfBirth.month !== "" &&
    dateOfBirth.year !== "" &&
    gender !== "" &&
    isValidDate(dateOfBirth.day, dateOfBirth.month, dateOfBirth.year);

  const handleRegister = async () => {
    if (!isValid) return;

    const monthIndex = months.indexOf(dateOfBirth.month);
    const dob = new Date(
      parseInt(dateOfBirth.year),
      monthIndex,
      parseInt(dateOfBirth.day)
    );

    try {
      const res = await dispatch(
        registerUser({
          username: name,
          email,
          password,
          gender,
          dateOfBirth: dob,
        })
      );

      if (res.meta.requestStatus === "fulfilled") {
        navigate("/"); // Redirect to homepage or dashboard
      }
    } catch (error) {
      console.error("Registration failed", error);
    }
  };

  return (
    <div className="signup-step1">
      {/* Spotify Logo */}
      <div className="mb-12">
        <div className="mb-12">
          <img
            src={applogo}
            alt="App Logo"
            className="w-32 h-32 rounded-full object-contain"
          />
        </div>
      </div>

      {/* Header */}
      <div className="w-full max-w-md mb-8">
        <div className="flex items-center mb-6">
          <ChevronLeft
            className="w-6 h-6 mr-4 cursor-pointer hover:text-gray-300"
            onClick={() => navigate("/signup-step1")}
          />
          <div>
            <div className="text-sm text-gray-400 mb-1">Step 2 of 2</div>
            <h1 className="text-2xl font-bold">Tell us about yourself</h1>
          </div>
        </div>
        <div className="w-full bg-gray-800 h-1 rounded-full mb-8">
          <div className="bg-[#1DB954] h-1 rounded-full w-3/3"></div>
        </div>
      </div>

      {/* Form */}
      <div className="w-full max-w-md space-y-6">
        {/* Name */}
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
            onChange={(e) => dispatch(setName(e.target.value))}
            className="w-full h-12 bg-[#1a1a1a] border-2 border-gray-600 rounded text-white px-4 outline-none transition-colors hover:border-white focus:border-white"
          />
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Date of birth
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="dd"
              value={dateOfBirth.day}
              onChange={(e) => handleDOBChange("day", e.target.value)}
              maxLength={2}
              className="w-16 h-12 bg-[#1a1a1a] border-2 border-gray-600 rounded text-white text-center px-3 outline-none hover:border-white focus:border-white"
            />
            <div className="relative flex-1">
              <button
                type="button"
                onClick={() => setShowMonthDropdown(!showMonthDropdown)}
                className="w-full h-12 bg-[#1a1a1a] border-2 border-gray-600 rounded text-white px-4 flex items-center justify-between hover:border-white focus:border-white"
              >
                <span
                  className={dateOfBirth.month ? "text-white" : "text-gray-400"}
                >
                  {dateOfBirth.month || "Month"}
                </span>
                <ChevronDown className="w-4 h-4" />
              </button>
              {showMonthDropdown && (
                <div className="absolute top-full left-0 right-0 bg-[#1a1a1a] border-2 border-gray-600 rounded mt-1 max-h-48 overflow-y-auto z-10">
                  {months.map((monthName) => (
                    <button
                      key={monthName}
                      type="button"
                      onClick={() => {
                        handleDOBChange("month", monthName);
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
              value={dateOfBirth.year}
              onChange={(e) => handleDOBChange("year", e.target.value)}
              maxLength={4}
              className="w-20 h-12 bg-[#1a1a1a] border-2 border-gray-600 rounded text-white text-center px-3 outline-none hover:border-white focus:border-white"
            />
          </div>
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium mb-1">Gender</label>
          <div className="space-y-3">
            <div className="flex flex-wrap gap-x-8 gap-y-3">
              {["man", "woman", "other"].map((g) => (
                <label key={g} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value={g}
                    checked={gender === g}
                    onChange={(e) => dispatch(setGender(e.target.value))}
                    className="sr-only"
                  />
                  <div
                    className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                      gender === g ? "border-[#1DB954]" : "border-gray-500"
                    }`}
                  >
                    {gender === g && (
                      <div className="w-2 h-2 bg-[#1DB954] rounded-full"></div>
                    )}
                  </div>
                  <span className="text-sm text-white capitalize">
                    {g.replace(/-/g, " ")}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Register Button */}
        <button
          onClick={handleRegister}
          disabled={!isValid || loading}
          className={`w-full h-12 cursor-pointer rounded-full font-bold text-black transition-all ${
            isValid
              ? "bg-[#1DB954] hover:bg-[#1ed760]"
              : "bg-gray-600 cursor-not-allowed"
          }`}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </div>
    </div>
  );
}
