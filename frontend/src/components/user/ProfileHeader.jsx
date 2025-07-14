import "./ProfileHeader.scss";
import image from "../../assets/unknown.jpg";

const ProfileHeader = ({ user, onEditClick }) => {
  return (
    <div>
      <div className="profile-header">
        <div className="avatar-section" onClick={onEditClick}>
          <img
            src={user.avatarUrl || image}
            alt="avatar"
            className="avatar cursor-pointer"
          />
          <div className="profile-header__overlay cursor-pointer">
            <i className="fa fa-pencil-alt" aria-hidden="true"></i>
            <span>Choose Photo</span>
          </div>
        </div>

        <div className="profile-info">
          <p>Profile</p>
          <p className="username">{user.username}</p>
          <p className="info">
            <span>{user.publicPlaylists} Public Playlist</span>
            <span className="dot">•</span>
            <span className="following">
              <strong>{user.following} Following</strong>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
