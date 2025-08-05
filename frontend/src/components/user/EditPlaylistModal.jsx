import { useState, useRef, useEffect } from "react";
import defaultImg from "../../assets/default-music.png";
import { useSelector } from "react-redux";
const EditPlaylistModal = ({ isOpen, onClose, playlist, onSave }) => {
  const [name, setName] = useState(playlist.name || "");
  const [description, setDescription] = useState(playlist.description || "");
  const [imagePreview, setImagePreview] = useState(
    playlist.imageUrl || defaultImg
  );
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);
  const modalRef = useRef(null);
  const [isSaving, setIsSaving] = useState(false);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  if (!isOpen) return null;

  const handleSave = async () => {
    setIsSaving(true);
    await onSave({
      name,
      description,
      cover: imageFile, // send the File object
    });
    setIsSaving(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file); // store File object
      const reader = new FileReader();
      reader.onload = (event) => setImagePreview(event.target.result); // preview only
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
      <div
        ref={modalRef}
        className="bg-neutral-900 text-white rounded-lg w-[500px] p-6 shadow-2xl relative"
      >
        <button
          onClick={onClose}
          className="absolute cursor-pointer top-4 right-4 text-white text-3xl hover:opacity-80"
          aria-label="Close"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold mb-6">Edit details</h2>

        <div className="flex gap-4">
          <div
            className="relative w-48 h-36 rounded overflow-hidden group bg-neutral-800"
            onClick={() => fileInputRef.current.click()}
          >
            <img
              src={imagePreview}
              alt="playlist"
              className="w-full h-full object-cover opacity-70 group-hover:opacity-50 transition duration-300"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 bg-black/40 text-sm font-medium cursor-pointer">
              Change Image
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageChange}
            />
          </div>

          <div className="flex flex-col w-full">
            <input
              className="bg-neutral-800 text-white placeholder:text-neutral-400 rounded px-3 py-2 mb-3 outline-none"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <textarea
              className="bg-neutral-800 text-white placeholder:text-neutral-400 rounded px-3 py-2 resize-none outline-none"
              placeholder="Add an optional description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={handleSave}
            className="bg-white cursor-pointer text-black rounded-full px-6 py-2 font-semibold hover:scale-105 transition-transform shadow"
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>

        <p className="text-xs text-neutral-400 mt-4">
          By proceeding, you agree to give Fitcify access to the image you
          choose to upload. Please make sure you have the right to upload the
          image.
        </p>
      </div>
    </div>
  );
};

export default EditPlaylistModal;
