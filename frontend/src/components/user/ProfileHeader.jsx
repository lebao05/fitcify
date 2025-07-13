import './ProfileHeader.scss';

const ProfileHeader = ({user}) => {
  return (
    <div>
      <div className="profile-header">
        <div className="avatar-section">
          <img src={user.avatar} alt="avatar" className="avatar" />
          <div className="profile-header__overlay">
            <i className="fa fa-pencil-alt" aria-hidden="true"></i>
            <span>Choose Photo</span>
          </div>
        </div>

        <div className="profile-info">
          <p>Profile</p>
          <p className="username">{user.name}</p>
          <p className="info">
            <span>{user.publicPlaylists} Public Playlist</span>
            <span className="dot">•</span>
            <span className="following"><strong>{user.following} Following</strong> </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
