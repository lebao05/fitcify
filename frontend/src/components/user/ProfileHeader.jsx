import image from "../../assets/unknown.jpg";

const ProfileHeader = ({ user, onEditClick, isArtist = false }) => {
  return (
    <div className="px-6 pt-6">
      <div className="flex items-center space-x-6">
        {/* Avatar Section */}
        <div 
          className="relative group cursor-pointer"
          onClick={onEditClick}
        >
          <img
            src={user.avatarUrl || image}
            alt="avatar"
            className="w-32 h-32 rounded-full object-cover border-2 border-gray-700"
          />
          {/* Edit Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            <span className="text-white text-sm mt-1">Choose Photo</span>
          </div>
        </div>

        {/* Profile Info */}
        <div className="flex flex-col justify-center">

          {/* Verified Badge */}
          {isArtist && (
            <div className="flex items-center space-x-2 text-white text-sm font-medium mb-1">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="white"
                  width="14"
                  height="14"
                >
                  <path d="M20.285 2.857l-11.429 11.43-5.714-5.715-3.142 3.143 8.856 8.857 14.571-14.572z"/>
                </svg>
              </span>
              <span>Nghệ sĩ được xác minh</span>
            </div>
          )}

          {/* Artist Name */}
          <h1 className="text-3xl font-bold">{user.username}</h1>

          {/* Stats */}
          <div className="flex items-center space-x-2 mt-2 text-gray-400">
            <span>{user.publicAlbums || 0} Album{user.publicAlbums !== 1 ? 's' : ''}</span>
            <span>•</span>
            <span>
              <strong>{user.following || 0} Following</strong>
            </span>
            {isArtist && user.totalPlays && (
              <>
                <span>•</span>
                <span>{user.totalPlays} Total Plays</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
