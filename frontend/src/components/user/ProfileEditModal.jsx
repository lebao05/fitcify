// src/components/user/ProfileEditModal.jsx
import React from "react";

const ProfileEditModal = ({ user, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-[#121212] p-8 rounded-lg w-full max-w-md text-white relative">
        <button
          className="absolute top-2 right-3 text-gray-400 hover:text-white"
          onClick={onClose}
        >
          ✕
        </button>
        <div className="flex flex-col items-center">
          <img
            src={user.avatar}
            alt="avatar"
            className="w-24 h-24 rounded-full mb-4"
          />
          <input
            className="w-full bg-gray-800 text-white p-2 rounded mb-4"
            defaultValue={user.name}
          />
          <button className="bg-green-500 px-4 py-2 rounded font-semibold">
            Save
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-4">
          By proceeding, you agree to give access to the image and info you
          upload.
        </p>
      </div>
    </div>
  );
};

export default ProfileEditModal;
