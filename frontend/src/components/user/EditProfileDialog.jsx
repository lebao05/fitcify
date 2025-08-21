import React, { useState, useRef, useEffect } from "react";
import "./HorizontalDots.scss";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentProfileById, fetchUserFromCookie, updateUserProfile } from "../../redux/slices/userSlice";
import defaultAvatar from "../../assets/unknown.jpg"; // fallback image

const EditProfileDialog = ({ user, open, onClose }) => {
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState(user?.avatarUrl || defaultAvatar);
  const [avatarFile, setAvatarFile] = useState(null);
  const [error, setError] = useState(null);

  const dialogRef = useRef(null);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.user.loading);

  // Set values when dialog opens
  useEffect(() => {
    if (open) {
      setName(user?.username || "");
      setAvatar(user?.avatarUrl || defaultAvatar);
      setAvatarFile(null);
      setError(null);
    }
  }, [open, user]);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dialogRef.current && !dialogRef.current.contains(event.target)) {
        onClose();
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, onClose]);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setAvatar(ev.target.result);
      };
      reader.readAsDataURL(file);
      setAvatarFile(file);
    }
  };

  const handleSave = async () => {
    try {
      await dispatch(updateUserProfile({ username: name, avatarFile })).unwrap();
      await dispatch(fetchCurrentProfileById(user._id));
      if(user.avatarUrl !== "" && user.avatarRl !== null)
        setAvatar(user.avatarUrl);
      else 
        setAvatar(defaultAvatar);
      onClose();
    } catch (err) {
      setError(err || "Failed to update profile.");
    }
  };

  if (!open) return null;

  return (
    <div className="edit-dialog-backdrop" style={{ zIndex: 2000 }}>
      <div className="edit-dialog" ref={dialogRef}>
        <div className="edit-dialog-header">
          <h3>Profile details</h3>
          <button className="edit-dialog-close" onClick={onClose}>×</button>
        </div>

        <div className="edit-dialog-info">
          <div className="avatar-section">
            <img src={avatar} alt="avatar" className="avatar" />
            <div
              className="avatar-overlay"
              onClick={() => fileInputRef.current?.click()}
            >
              <i className="fas fa-pencil-alt"></i>
              <span>Choose Photo</span>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleAvatarChange}
              />
            </div>
          </div>

          <div className="info-section">
            <label htmlFor="edit-name">Name</label>
            <input
              id="edit-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              autoFocus
            />
          </div>
        </div>

        <div className="edit-dialog-actions">
          <button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>
        </div>

        {error && (
          <p style={{ color: "red", marginTop: "8px", textAlign: "center" }}>
            {error}
          </p>
        )}

        <p
          style={{
            color: "rgba(255,255,255,0.6)",
            fontSize: "12px",
            marginTop: "16px",
            textAlign: "center",
            lineHeight: "1.4",
          }}
        >
          By proceeding, you agree to give Fitcify access to the image you
          choose to upload. Please make sure you have the right to upload the
          image.
        </p>
      </div>
    </div>
  );
};

export default EditProfileDialog;
