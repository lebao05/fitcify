import React, { useState } from "react";
import { Home, Search, Bell, Users } from "lucide-react";
import "./HeaderBar.scss";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../redux/slices/userSlice"; // Adjust path
import appLogo from "../../assets/applogo.jpg"; // Adjust path

const HeaderBar = () => {
  const [navOpen, setNavOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.user); // ✅ grab user from Redux
  const isLoggedIn = Boolean(user); // simple check

  const toggleNav = () => {
    setNavOpen(!navOpen);
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    window.location.href = "/"; // Adjust URL as needed
  };

  const signupButtonHandler = () => {
    window.location.href = "/signup"; // Adjust URL as needed
  };

  const loginButtonHandler = () => {
    window.location.href = "/login"; // Adjust URL as needed
  };

  return (
    <div className="header-bar">
      <div className="header-content">
        <div className="left-section">
          <div className="logo" onClick={() => (window.location.href = "/")}>
            <img src={appLogo} alt="logo" />
          </div>
        </div>

        <div className="center-section">
          <button className="home-btn" onClick={() => window.location.href = "/"}>
            <Home size={25} />
          </button>

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

        <div className="right-section">
          {!isLoggedIn ? (
            <>
              <button className="nav-button">Premium</button>
              <button className="nav-button">Support</button>
              <div className="divider"></div>
              <button className="signup-button" onClick={signupButtonHandler}>
                Sign up
              </button>
              <button className="login-button" onClick={loginButtonHandler}>
                Log in
              </button>
            </>
          ) : (
            <>
              <button className="nav-button">Premium</button>
              <button className="nav-button">Support</button>
              <div className="divider"></div>

              <div className="notifications">
                <button className="icon-button">
                  <Bell size={20} />
                  <div className="notification-dot"></div>
                </button>
              </div>

              <div className="friends">
                <button className="icon-button">
                  <Users size={20} />
                </button>
              </div>

              <div className="user-profile-container">
                <button className="user-profile" onClick={toggleNav}>
                  <span>{user?.name?.[0]?.toUpperCase() || "U"}</span>
                </button>

                <div className={`navigation-bar ${navOpen ? "active" : ""}`}>
                  <button className="dropdown-item">Account</button>
                  <button
                    className="dropdown-item"
                    onClick={() => navigate("/user-profile")}
                  >
                    Profile
                  </button>
                  <button className="dropdown-item">Upgrade to Premium</button>
                  <button className="dropdown-item">Support</button>
                  <button className="dropdown-item">Download</button>
                  <button className="dropdown-item">Settings</button>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item" onClick={handleLogout}>
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
