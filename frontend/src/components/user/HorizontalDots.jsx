import React, { useState, useRef, useEffect } from 'react';
import './HorizontalDots.scss';

const EditProfileDialog = ({ user, open, onClose, onSave }) => {
  const [value, setValue] = useState('');
  const [avatar, setAvatar] = useState(user.avatar);
  const dialogRef = useRef(null);
  const fileInputRef = useRef(null);
  // Update avatar if user prop changes
  useEffect(() => {
    setAvatar(user.avatar);
  }, [user.avatar]);

  const handleAvatarChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setAvatar(ev.target.result);
        // Optionally, call a prop or API to save avatar
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (open) {
      setValue(user?.name || '');
    }
  }, [open, user]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dialogRef.current && !dialogRef.current.contains(event.target)) {
        onClose();
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="edit-dialog-backdrop" style={{zIndex: 2000}}>
      <div className="edit-dialog" ref={dialogRef}>
        <h3>Profile Details</h3>
        <div className="edit-dialog-info"> 
          <div className="avatar-section">
            <img src={avatar} alt="avatar" className="avatar" />
            <div className="avatar-overlay" onClick={() => fileInputRef.current && fileInputRef.current.click()}>
              <i className="fas fa-pencil-alt" aria-hidden="true"></i>
              <span>Choose Photo</span>
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                ref={fileInputRef}
                onChange={handleAvatarChange}
              />
            </div>
          </div>

          <div className="info-section">
            <label htmlFor="edit-name">Name</label>
            <input
              id="edit-name"
              type="text"
              value={value}
              onChange={e => setValue(e.target.value)}
              placeholder={user.name}
              autoFocus
            />
          </div>
        </div>

        <div className="edit-dialog-actions">
          <button onClick={onClose}>Cancel</button>
          <button onClick={() => { onSave(value); onClose(); }}>Save</button>
        </div>

      </div>
    </div>
  );
};

const HorizontalDots = ({user}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  const handleEdit = () => {
    setDialogOpen(true);
    setMenuOpen(false);
  };

  const handleSave = (value) => {
    // Handle save logic here
    alert('Saved: ' + value);
  };

  return (
    <div className="horizontal-dots-wrapper">
      <div className="horizontal-dots" onClick={() => setMenuOpen(!menuOpen)}>
        <span>···</span>
      </div>
      {menuOpen && (
        <div className="dots-menu" ref={menuRef}>
          <div className="dots-menu-item" onClick={handleEdit}>Edit profile</div>
          <div className="dots-menu-item">Copy link to profile</div>
        </div>
      )}
      <EditProfileDialog user={user} open={dialogOpen} onClose={() => setDialogOpen(false)} onSave={handleSave} />
    </div>
  );
};

export default HorizontalDots;
