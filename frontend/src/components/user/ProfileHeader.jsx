import "./ProfileHeader.scss";
import image from "../../assets/unknown.jpg";

const ProfileHeader = ({ user, isYou, onEditClick }) => {
  return (
    <div>
      <div className="profile-header">
        <div className="avatar-section" onClick={onEditClick}>
          <img
            src={user.avatarUrl || image}
            alt="avatar"
            className="avatar cursor-pointer"
          />
          {isYou && (
            <div className="profile-header__overlay cursor-pointer">
              <i className="fa fa-pencil-alt" aria-hidden="true"></i>
              <span>Choose Photo</span>
            </div>
          )}
        </div>

        <div className="profile-info">
          <p>Profile</p>
          <p onClick={onEditClick} className="cursor-pointer username">
            {user.username}
          </p>
          <p className="info">
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
