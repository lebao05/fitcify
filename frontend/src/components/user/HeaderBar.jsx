import React, { useState } from "react";
import { Home, Search, Bell, Users } from "lucide-react";
import "../../styles/user/HeaderBar.scss";
import { useNavigate } from "react-router-dom";
const HeaderBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();
  const toggleNav = () => {
    setNavOpen(!navOpen);
  };
  const sigupButtonHandler = () => {
    navigate("/signup");
  };
  const toggleLogin = () => {
    setIsLoggedIn(!isLoggedIn);
  };

  return (
    <div className="header-bar">
      <div className="header-content">
        {/* Left Section - Logo */}
        <div className="left-section">
          <div className="logo" onClick={() => (window.location.href = "/")}>
            <img src="../../public/logo.jpg" />
          </div>
        </div>

        {/* Center Section - Navigation and Search */}
        <div className="center-section">
          {/* Home Button */}
          <button
            className="home-btn"
            onClick={() => (window.location.href = "/")}
          >
            <Home size={25} />
          </button>

          {/* Search Bar */}
          <div className="search-feature">
            <div className="search-wrapper">
              <Search className="search-icon" size={25} />
              <input
                type="text"
                placeholder="What do you want to play?"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="right-section">
          {!isLoggedIn ? (
            <>
              <button className="nav-button">Premium</button>
              <button className="nav-button">Support</button>
              <div className="divider"></div>
              <button className="signup-button" onClick={sigupButtonHandler}>
                Sign up
              </button>
              <button className="login-button" onClick={toggleLogin}>
                Log in
              </button>
            </>
          ) : (
            <>
              <button className="nav-button">Premium</button>
              <button className="nav-button">Support</button>
              <div className="divider"></div>

              {/* Notifications with Bell Icon */}
              <div className="notifications">
                <button className="icon-button">
                  <Bell size={20} />
                  <div className="notification-dot"></div>
                </button>
              </div>

              {/* Friends/Connections with Users Icon */}
              <div className="friends">
                <button className="icon-button">
                  <Users size={20} />
                </button>
              </div>

              {/* User Profile with Border */}
              <div className="user-profile-container">
                <button className="user-profile" onClick={toggleNav}>
                  <span>U</span>
                </button>

                {/* Dropdown Menu */}
                <div className={`navigation-bar ${navOpen ? "active" : ""}`}>
                  <button className="dropdown-item">Account</button>
                  <button
                    className="dropdown-item"
                    onClick={() => navigate("/profile")}
                  >
                    Profile
                  </button>
                  <button className="dropdown-item">Upgrade to Premium</button>
                  <button className="dropdown-item">Support</button>
                  <button className="dropdown-item">Download</button>
                  <button className="dropdown-item">Settings</button>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item" onClick={toggleLogin}>
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
