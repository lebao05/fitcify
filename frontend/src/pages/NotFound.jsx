// src/pages/common/PageNotAvailable.jsx
import { Link } from "react-router-dom";
import { assets } from "../assets/assets"; // you already import this elsewhere

const NotFound = () => {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-black text-white">
      {/* Spotify logo */}
      <img src={assets.spotify_logo} alt="Spotify" className="w-14 mb-10" />

      {/* title + sub‑text */}
      <h1 className="text-4xl md:text-5xl font-bold mb-4">
        Page not available
      </h1>
      <p className="text-[#a7a7a7] mb-10">
        Something went wrong, please try again later.
      </p>

      {/* actions */}
      <Link
        to="/"
        className="px-10 py-3 rounded-full bg-white text-black font-semibold hover:scale-105 transition"
      >
        Home
      </Link>

      <a
        href="https://support.spotify.com"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 text-white/70 underline hover:text-white"
      >
        Help
      </a>
    </div>
  );
};

export default NotFound;
