import React, { useState, useRef, useEffect } from "react";
import "./HorizontalDots.scss";

const EditProfileDialog = ({ user, open, onClose, onSave }) => {
  const [value, setValue] = useState("");
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
      setValue(user?.name || "");
    }
  }, [open, user]);

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

  if (!open) return null;
  return (
    <div className="edit-dialog-backdrop" style={{ zIndex: 2000 }}>
      <div className="edit-dialog" ref={dialogRef}>
        <div
          className="edit-dialog-header"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <h3 style={{ margin: 0 }}>Profile details</h3>
          <button
            className="edit-dialog-close"
            style={{
              background: "none",
              border: "none",
              fontSize: 28,
              color: "#fff",
              cursor: "pointer",
              lineHeight: 1,
              padding: 0,
            }}
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div className="edit-dialog-info">
          <div className="avatar-section">
            <img src={avatar} alt="avatar" className="avatar" />
            <div
              className="avatar-overlay"
              onClick={() =>
                fileInputRef.current && fileInputRef.current.click()
              }
            >
              <i className="fas fa-pencil-alt" aria-hidden="true"></i>
              <span>Choose Photo</span>
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
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
              onChange={(e) => setValue(e.target.value)}
              placeholder={user.name}
              autoFocus
            />
          </div>
        </div>

        <div
          className="edit-dialog-actions"
          style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}
        >
          <button
            onClick={() => {
              onSave(value);
              onClose();
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

// Edit Personal Info Dialog
function EditPersonalInfoDialog({ open, onClose, onSave, user }) {
  const [form, setForm] = useState({
    username: user.username || "",
    email: user.email || "",
    password: "",
    gender: user.gender || "",
    day: user.day || "",
    month: user.month || "",
    year: user.year || "",
  });

  useEffect(() => {
    if (open) {
      setForm({
        username: user.username || "",
        email: user.email || "",
        password: "",
        gender: user.gender || "",
        day: user.day || "",
        month: user.month || "",
        year: user.year || "",
      });
    }
  }, [open, user]);

  if (!open) return null;
  return (
    <div className="edit-dialog-backdrop">
      <div className="edit-dialog edit-personal-info-dialog">
        <div className="edit-dialog-header">
          <h2>Edit Personal Information</h2>
          <button
            className="edit-dialog-close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave(form);
            onClose();
          }}
        >
          <div className="edit-dialog-fields">
            <div>
              <label>Username</label>
              <input type="text" value={form.username} placeholder="Username" />
            </div>
            <div>
              <label>Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
                placeholder="Email"
              />
            </div>
            <div>
              <label>Password</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) =>
                  setForm((f) => ({ ...f, password: e.target.value }))
                }
                placeholder="Password"
              />
            </div>
            <div>
              <label>Gender</label>
              <select
                value={form.gender}
                onChange={(e) =>
                  setForm((f) => ({ ...f, gender: e.target.value }))
                }
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label>Date of Birth</label>
              <div className="edit-dialog-dob-row">
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  min="1"
                  max="31"
                  placeholder="Day"
                  value={form.day}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, day: e.target.value }))
                  }
                />
                <select
                  value={form.month}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, month: e.target.value }))
                  }
                >
                  <option value="">Month</option>
                  <option value="1">January</option>
                  <option value="2">February</option>
                  <option value="3">March</option>
                  <option value="4">April</option>
                  <option value="5">May</option>
                  <option value="6">June</option>
                  <option value="7">July</option>
                  <option value="8">August</option>
                  <option value="9">September</option>
                  <option value="10">October</option>
                  <option value="11">November</option>
                  <option value="12">December</option>
                </select>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  min="1900"
                  max="2025"
                  placeholder="Year"
                  value={form.year}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, year: e.target.value }))
                  }
                />
              </div>
            </div>
          </div>
          <div className="edit-dialog-actions edit-dialog-actions-personal">
            <button className="save-btn">
              <span>Save</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
const HorizontalDots = ({ user }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [personalDialogOpen, setPersonalDialogOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  const handleEdit = () => {
    setDialogOpen(true);
    setMenuOpen(false);
  };

  const handleSave = (value) => {
    // Handle save logic here
    alert("Saved: " + value);
  };

  return (
    <div className="horizontal-dots-wrapper">
      <div className="horizontal-dots" onClick={() => setMenuOpen(!menuOpen)}>
        <span>···</span>
      </div>
      {menuOpen && (
        <div className="dots-menu" ref={menuRef}>
          <div className="dots-menu-item" onClick={handleEdit}>
            Edit profile
          </div>
          <div
            className="dots-menu-item"
            onClick={() => {
              setPersonalDialogOpen(true);
              setMenuOpen(false);
            }}
          >
            Edit personal information
          </div>
          <div className="dots-menu-item">Copy link to profile</div>
        </div>
      )}
      <EditProfileDialog
        user={user}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
      />
      <EditPersonalInfoDialog
        user={user}
        open={personalDialogOpen}
        onClose={() => setPersonalDialogOpen(false)}
        onSave={(data) => alert("Saved: " + JSON.stringify(data))}
      />
    </div>
  );
};
// ...existing code...
// End of EditPersonalInfoDialog and HorizontalDots
// Fix missing closing brace
export default HorizontalDots;
