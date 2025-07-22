import React, { useState } from "react";
import { Home, Search, Bell, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUserThunk } from "../../redux/slices/userSlice";
import appLogo from "../../assets/applogo.jpg";

const HeaderBar = () => {
  const [navOpen, setNavOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.myAuth);
  const isLoggedIn = Boolean(user);

  const toggleNav = () => setNavOpen(!navOpen);
  const handleLogout = () => {
    dispatch(logoutUserThunk());
    window.location.href = "/";
  };

  return (
    <div className="fixed top-0 left-0 w-full bg-black border-b border-[#282828] shadow-md z-[1000]">
      <div className="flex items-center justify-between px-4 py-2 h-16">
        {/* Left Section */}
        <div className="flex items-center">
          <div
            className="w-12 h-12 flex items-center justify-center cursor-pointer"
            onClick={() => (window.location.href = "/")}
          >
            <img
              src={appLogo}
              alt="logo"
              className="rounded-[30%] transition-transform duration-200 hover:scale-110"
            />
          </div>
        </div>

        {/* Center Section */}
        <div className="flex items-center gap-4 flex-1 max-w-[700px] mx-4 relative left-[12%] lg:left-0 lg:justify-center lg:px-3">
          <button
            className="w-12 h-12 bg-[#282828] rounded-full flex items-center justify-center text-[#b3b3b3] hover:bg-[#404040] hover:text-white transition-all"
            onClick={() => (window.location.href = "/")}
          >
            <Home size={25} className="cursor-pointer" />
          </button>

          <div className="flex-1 max-w-[500px] min-w-[350px]">
            <div className="flex items-center bg-[#282828] rounded-full px-4 py-3 border-2 border-transparent transition-all duration-500 hover:bg-[#2e2727] hover:border-white shadow-sm">
              <Search
                className="text-[#b3b3b3] mr-3 cursor-pointer"
                size={25}
                onClick={() => navigate(`/search`)}
              />
              <input
                type="text"
                placeholder="What do you want to play?"
                className="bg-transparent border-none outline-none text-white w-full placeholder-[#b3b3b3] text-[18px]"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {!isLoggedIn ? (
            <>
              <button className="text-[#b3b3b3] text-[17px] font-semibold px-4 py-2 rounded-full hover:text-white transition-transform hover:scale-[1.04]">
                Premium
              </button>
              <button className="text-[#b3b3b3] text-[17px] font-semibold px-4 py-2 rounded-full hover:text-white transition-transform hover:scale-[1.04]">
                Support
              </button>
              <div className="w-px h-6 bg-[#404040]" />
              <button
                className="text-[#b3b3b3] text-sm font-semibold px-5 py-2 rounded-full hover:text-white transition-transform hover:scale-[1.04]"
                onClick={() => (window.location.href = "/signup")}
              >
                Sign up
              </button>
              <button
                className="bg-white text-black text-sm font-semibold px-5 py-2 rounded-full hover:bg-[#f1f1f1] transition-transform hover:scale-[1.04]"
                onClick={() => (window.location.href = "/login")}
              >
                Log in
              </button>
            </>
          ) : (
            <>
              <button className="text-[#b3b3b3] text-[17px] font-semibold px-4 py-2 rounded-full hover:text-white transition-transform hover:scale-[1.04]">
                Premium
              </button>
              <button className="text-[#b3b3b3] text-[17px] font-semibold px-4 py-2 rounded-full hover:text-white transition-transform hover:scale-[1.04]">
                Support
              </button>
              <div className="w-px h-6 bg-[#404040]" />
              <div className="relative">
                <button className="w-8 h-8 bg-[#282828] rounded-full flex items-center justify-center text-[#b3b3b3] hover:bg-[#404040] hover:text-white transition-all relative">
                  <Bell size={20} />
                  <div className="absolute top-1 right-1 w-2 h-2 bg-[#1db954] rounded-full"></div>
                </button>
              </div>
              <div className="relative">
                <button className="w-8 h-8 bg-[#282828] rounded-full flex items-center justify-center text-[#b3b3b3] hover:bg-[#404040] hover:text-white transition-all">
                  <Users size={20} />
                </button>
              </div>
              <div className="relative">
                <button
                  onClick={toggleNav}
                  className="w-10 h-10 bg-[#282828] border-[6px] border-[#4e4d4c] rounded-full flex items-center justify-center text-white transition-all duration-150 active:scale-90"
                >
                  <img
                    src={user.avatarUrl || appLogo}
                    alt="User Profile"
                    className="cursor-pointer rounded-full w-7 h-7 object-cover"
                  />
                </button>
                <div
                  className={`absolute top-12 right-0 w-48 bg-[#282828] rounded-lg shadow-lg p-2 transition-all duration-200 ${
                    navOpen
                      ? "opacity-100 visible translate-y-0"
                      : "opacity-0 invisible -translate-y-2"
                  }`}
                >
                  <button className="w-full text-left px-4 py-3 text-white text-sm font-semibold hover:bg-[#404040]">
                    Account
                  </button>
                  <button
                    onClick={() => navigate(`/profile/${user._id}`)}
                    className="w-full text-left px-4 py-3 text-white text-sm font-semibold hover:bg-[#404040]"
                  >
                    Profile
                  </button>
                  <button className="w-full text-left px-4 py-3 text-white text-sm font-semibold hover:bg-[#404040]">
                    Upgrade to Premium
                  </button>
                  {user.role === "artist" && (
                    <button
                      onClick={() => navigate("/artist")}
                      className="w-full text-left px-4 py-3 text-white text-sm font-semibold hover:bg-[#404040]"
                    >
                      For Artist
                    </button>
                  )}
                  <button className="w-full text-left px-4 py-3 text-white text-sm font-semibold hover:bg-[#404040]">
                    Support
                  </button>
                  <div className="h-px bg-[#404040] my-2" />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-white text-sm font-semibold hover:bg-[#404040]"
                  >
                    Log out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeaderBar;
