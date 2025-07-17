import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

const ArtistHorizontalDots = ({ artist, ...props }) => {
  const [open, setOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  // Modal state
  const [cover, setCover] = useState(artist?.coverImage || "");
  const [stageName, setStageName] = useState(artist?.stageName || "");
  const [desc, setDesc] = useState(artist?.description || "");

  const handleEditClick = () => {
    setShowModal(true);
    setOpen(false);
  };

  const handleModalClose = () => setShowModal(false);

  const handleCoverChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setCover(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <div className="relative inline-block">
      <button
        className="cursor-pointer rounded-full p-2 transition flex items-center justify-center border-none bg-transparent"
        type="button"
        title="More options"
        onClick={() => setOpen((v) => !v)}
        {...props}
      >
        <span className="text-[1.7rem] leading-none text-white/70 font-bold select-none tracking-widest">···</span>
      </button>
      {open && (
        <div
          ref={menuRef}
          className="absolute left-1 top-full mt-2 min-w-[210px] bg-[#646464] rounded-lg shadow-lg py-2 z-50 flex flex-col"
        >
          <button className="text-white text-base px-5 py-2 text-left hover:bg-white/10 transition cursor-pointer" type="button" onClick={handleEditClick}>Edit artist profile</button>
          <button className="text-white text-base px-5 py-2 text-left hover:bg-white/10 transition cursor-pointer" type="button">Copy link to profile</button>
        </div>
      )}

      {/* Modal chỉnh sửa artist profile */}
      {showModal && createPortal(
        <>
          {/* Overlay che phủ toàn bộ trang */}
          <div className="fixed inset-0 w-full h-full z-[100001] flex items-center justify-center" onClick={handleModalClose}>
            <div className="fixed inset-0 w-full h-full bg-black/60 z-[100000] pointer-events-none" />
            <div
              className="bg-[#23242b] rounded-2xl p-8 min-w-[420px] max-w-[520px] w-full max-h-[85vh] shadow-2xl flex flex-col gap-7 relative overflow-y-auto border border-[#333] z-[100002]"
              onClick={e => e.stopPropagation()}
            >
              <button className="absolute top-4.5 right-8 text-[40px] text-gray-400 cursor-pointer hover:text-white font-extrabold rounded" onClick={handleModalClose}>&times;</button>
              <div className="mb-2 text-2xl font-bold text-white">Edit Artist Profile</div>
              <form className="flex flex-col gap-6 w-full">
                {/* Cover Image */}
                <div className="flex flex-col gap-1 w-full">
                  <label className="text-white text-base font-medium" htmlFor="edit-cover">Cover Image</label>
                  <div className="w-full h-24 bg-gray-700 rounded-lg overflow-hidden mb-2 ">
                    <img src={cover || artist?.coverImage} alt="cover" className="w-full h-full object-cover" />
                  </div>
                  <input
                    id="edit-cover"
                    type="file"
                    accept="image/*"
                    className="w-full rounded-lg px-4 py-[8px] bg-[#181a20] text-gray-200 border border-[#444] focus:outline-none focus:ring-2 focus:ring-blue-400 file:text-gray-400 text-lg"
                    onChange={handleCoverChange}
                  />
                </div>
                {/* Stage Name */}
                <div className="flex flex-col gap-1 w-full">
                  <label className="text-white text-base font-medium" htmlFor="edit-stage-name">Stage Name</label>
                  <input
                    id="edit-stage-name"
                    type="text"
                    value={stageName}
                    onChange={e => setStageName(e.target.value)}
                    placeholder={artist?.stageName || "No data"}
                    className="w-full rounded-lg px-4 py-[8px] bg-[#181a20] text-gray-200 border border-[#444] focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-gray-400 text-lg"
                  />
                </div>
                {/* Description */}
                <div className="flex flex-col gap-1 w-full">
                  <label className="text-white text-base font-medium" htmlFor="edit-desc">Description</label>
                  <textarea
                    id="edit-desc"
                    value={desc}
                    onChange={e => setDesc(e.target.value)}
                    rows={8}
                    placeholder={artist?.description || "No data"}
                    className="w-full rounded-lg px-4 py-[8px] bg-[#181a20] text-gray-200 border border-[#444] focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-gray-400 text-lg min-h-[120px]"
                  />
                </div>
                <div className="flex justify-end mt-2">
                  <button type="button" className="bg-blue-600 hover:cursor-pointer text-white px-10 py-2 rounded-full font-bold text-lg shadow transition" onClick={handleModalClose}>Save</button>
                </div>
              </form>
            </div>
          </div>
        </>,
        document.body
      )}
    </div>
  );
};

export default ArtistHorizontalDots;
