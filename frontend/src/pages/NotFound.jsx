// src/pages/common/PageNotAvailable.jsx
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";
import applogo from "../assets/applogo.jpg";
const NotFound = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center transparent text-white px-4 text-center">
      {/* Spotify logo */}
      <img
        src={applogo}
        alt="Spotify"
        className=" rounded-full w-16 md:w-20 mb-8"
      />

      {/* Title */}
      <h1 className="text-3xl md:text-5xl font-extrabold mb-3">
        Page not available
      </h1>

      {/* Home button */}
      <Link
        to="/"
        className="px-10 py-3 mt-5 rounded-full bg-white text-black font-semibold hover:scale-105 transition-transform duration-200"
      >
        Home
      </Link>
    </div>
  );
};

export default NotFound;
