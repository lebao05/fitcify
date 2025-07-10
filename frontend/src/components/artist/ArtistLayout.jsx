import { Outlet } from "react-router-dom";
import ArtistSidebar from "./ArtistSidebar.jsx";
import "./ArtistLayout.scss";

const ArtistLayout = () => (
  <div className="artist-layout">
    <ArtistSidebar />
    <div className="artist-content">
      <Outlet />
    </div>
  </div>
);

export default ArtistLayout;
