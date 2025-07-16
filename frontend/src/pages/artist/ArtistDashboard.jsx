import React from "react";
import "./ArtistDashboard.scss";

const ArtistDashboard = () => {
  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Home</h1>
      <div className="dashboard-row">
        <div className="dashboard-card stats-card">
          <h2>Your Music Stats</h2>
          <p>Track your performance this month</p>
          <div className="growth-info">
            <span className="growth-icon">↗</span>
            <span className="growth-text">+15% growth</span>
          </div>
        </div>
        <div className="dashboard-card listeners-card">
          <div className="icon">👤</div>
          <div className="listeners-number">12.5K</div>
          <div className="listeners-label">Monthly Listeners</div>
        </div>
        <div className="dashboard-card plays-card">
          <div className="icon">▶️</div>
          <div className="plays-number">45.2K</div>
          <div className="plays-label">Total Plays</div>
        </div>
      </div>
      <div className="dashboard-row">
        <div className="dashboard-card release-card">
          <span className="heart">♥</span>
          <h3>Latest Release</h3>
          <p>Your newest track is performing well</p>

        </div>
        <div className="dashboard-card activity-card">
          <h3>Recent Activity</h3>
          <ul>
            <li><span className="dot green"></span> New follower from Vietnam</li>
            <li><span className="dot blue"></span> Track added to 5 playlists</li>
            <li><span className="dot purple"></span> Featured in Discover Weekly</li>
          </ul>
        </div>
      </div>
      <div className="dashboard-row grid-row">
        <div className="dashboard-placeholder"></div>
        <div className="dashboard-placeholder"></div>
        <div className="dashboard-placeholder"></div>
        <div className="dashboard-placeholder"></div>
      </div>
      <div className="dashboard-row grid-row">
        <div className="dashboard-placeholder"></div>
      </div>
    </div>
  );
};

export default ArtistDashboard;
