import React from "react";
import UploadSongForm from "./UploadSongForm.jsx";
import "./ArtistSection.scss";

const ArtistUploadSong = () => {
  // Bạn có thể truyền props hoặc xử lý upload ở đây
  const handleUploadSong = (data) => {
    alert("Upload song thành công!\n" + JSON.stringify(data, null, 2));
  };
  return (
    <div className="artist-upload-song-container">
      <h2>Upload Song</h2>
      <UploadSongForm onUpload={handleUploadSong} onCancel={() => {}} />
    </div>
  );
};

export default ArtistUploadSong;
