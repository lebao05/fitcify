import React, { useState } from "react";

const ContextMenu = ({ x, y, options, onClose }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose}></div>

      <div
        className="fixed z-50 bg-[#282828] text-white rounded shadow-lg w-52 py-1"
        style={{ top: y, left: x }}
      >
        {options.map((opt, idx) => (
          <div
            key={idx}
            className="relative group"
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <button
              className="w-full text-left px-4 py-2 hover:bg-[#3e3e3e] text-sm flex justify-between items-center"
              onClick={() => {
                if (!opt.submenu) {
                  opt.onClick?.();
                  onClose();
                }
              }}
            >
              <span>{opt.label}</span>
              {opt.submenu && <span className="text-xs">▶</span>}
            </button>

            {opt.submenu && hoveredIndex === idx && (
              <div className="absolute top-0 left-[95%] ml-1 bg-[#282828] w-52 py-1 rounded shadow-lg z-50">
                {opt.submenu.map((sub, i) => (
                  <button
                    key={i}
                    className="w-full text-left px-4 py-2 hover:bg-[#3e3e3e] text-sm"
                    onClick={() => {
                      sub.onClick?.();
                      onClose();
                    }}
                  >
                    {sub.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default ContextMenu;
