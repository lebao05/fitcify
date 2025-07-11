import React from "react";
import "./CreateDialog.scss";

const CreateDialog = ({ onSelect, onClose, showSongOption }) => {
  return (
    <div className="create-dialog-backdrop" onClick={onClose}>
      <div className="create-dialog" onClick={(e) => e.stopPropagation()}>
        <div
          className="create-dialog-option"
          onClick={() => onSelect("playlist")}
        >
          <div className="icon playlist-icon">🎵</div>
          <div>
            <div className="option-title">Playlist</div>
            <div className="option-desc">
              Build a playlist with songs, or episodes
            </div>
          </div>
        </div>
        <div className="divider" />
        <div className="create-dialog-option" onClick={() => onSelect("album")}>
          <div className="icon album-icon">💿</div>
          <div>
            <div className="option-title">Album</div>
            <div className="option-desc">Group your songs into an album</div>
          </div>
        </div>
        {showSongOption && (
          <>
            <div className="divider" />
            <div
              className="create-dialog-option"
              onClick={() => onSelect("song")}
            >
              <div className="icon song-icon">🎶</div>
              <div>
                <div className="option-title">Song</div>
                <div className="option-desc">
                  Add a single song to your library
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CreateDialog;
