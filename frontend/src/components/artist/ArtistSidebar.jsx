import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./ArtistSidebar.scss";
import { useSelector } from "react-redux";
import defaultAvatar from "../../assets/unknown.jpg";
import logo from "../../assets/applogo.jpg";
const menu = [
  {
    label: "Dashboard",
    icon: (
      <svg
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d="M3 9.75L12 3l9 6.75V21a.75.75 0 01-.75.75h-5.25a.75.75 0 01-.75-.75v-4.5h-3v4.5a.75.75 0 01-.75.75H3.75A.75.75 0 013 21V9.75z" />
      </svg>
    ),
    path: "/artist/dashboard",
  },
  {
    label: "Music",
    icon: (
      <svg
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d="M9 18V5l12-2v13" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="18" cy="16" r="3" />
      </svg>
    ),
    path: "/artist/music",
  },
  {
    label: "Albums",
    icon: (
      <svg
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    path: "/artist/albums",
  },
  {
    label: "Playlists",
    icon: (
      <svg
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <rect x="3" y="4" width="14" height="2" />
        <rect x="3" y="10" width="14" height="2" />
        <rect x="3" y="16" width="10" height="2" />
        <circle cx="19" cy="17" r="2" />
      </svg>
    ),
    path: "/artist/playlists",
  },
  // {
  //   label: "Profile",
  //   icon: (
  //     <svg
  //       width="20"
  //       height="20"
  //       fill="none"
  //       stroke="currentColor"
  //       strokeWidth="2"
  //       viewBox="0 0 24 24"
  //     >
  //       <circle cx="12" cy="8" r="4" />
  //       <path d="M12 14c-4.418 0-8 1.79-8 4v2h16v-2c0-2.21-3.582-4-8-4z" />
  //     </svg>
  //   ),
  //   path: "/artist/profile",
  // },
];

const ArtistSidebar = () => {
  const myAuth = useSelector((state) => state.user.myAuth);
  const navigate = useNavigate();
  const location = useLocation();
  const active = location.pathname;
  const handleNav = (path) => {
    if (active !== path) navigate(path);
  };
  return (
    <aside className="artist-sidebar">
      <div className="artist-sidebar__header">
        <div className="artist-sidebar__logo">
          <span className="artist-sidebar__logo-circle">
            <img
              src={logo}
              alt="Fitcify"
              className="w-10 h-10 rounded-full shadow-md"
            />
          </span>
          <div>
            <div className="artist-sidebar__logo-title">Artist Panel</div>
            <div className="artist-sidebar__logo-desc">Fitcify for Artists</div>
          </div>
        </div>
      </div>
      <div className="artist-sidebar__section-title">ARTIST MENU</div>
      <nav className="artist-sidebar__nav">
        <ul>
          {menu.map((item) => (
            <li
              key={item.label}
              className={`artist-sidebar__menu-parent${
                active === item.path ? " active" : ""
              }`}
              onClick={() => handleNav(item.path)}
              tabIndex={0}
              role="button"
              onKeyDown={(e) =>
                (e.key === "Enter" || e.key === " ") && handleNav(item.path)
              }
            >
              <span className="artist-sidebar__icon">{item.icon}</span>
              <span className="artist-sidebar__label">{item.label}</span>
            </li>
          ))}
        </ul>
      </nav>
      <div className="artist-sidebar__footer">
        <div className="artist-sidebar__user" tabIndex={0}>
          <img
            className="artist-sidebar__user-avatar"
            src={myAuth.avatarUrl || defaultAvatar}
            alt="User avatar"
          />
          <span className="artist-sidebar__user-name">{myAuth.username}</span>
          <div className="artist-sidebar__user-dialog">
            <button
              className="artist-sidebar__logout-btn"
              onClick={() => navigate("/")}
            >
              Home
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default ArtistSidebar;
