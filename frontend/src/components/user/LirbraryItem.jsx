import { memo } from "react";
import { Play } from "lucide-react";

function LibraryItem({ cover, title, subtitle, onClick }) {
  return (
    <div
      onClick={onClick}
      className="
        group relative flex items-center gap-3 px-3 py-2 rounded-lg
        hover:bg-[#2a2a2a] cursor-pointer transition-colors duration-200
      "
    >
      {/* ── Album cover or fallback ── */}
      <div className="relative h-12 w-12 rounded overflow-hidden bg-[#333] flex items-center justify-center">
        {cover ? (
          <img src={cover} alt={title} className="h-full w-full object-cover" />
        ) : (
          <svg viewBox="0 0 24 24" width="20" height="20" className="fill-white/60">
            <path d="M8 2v20l13-10L8 2z" />
          </svg>
        )}

        {/* ── Play icon appears on hover ── */}
        <div
          className="
            absolute inset-0 flex items-center justify-center
            bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity
          "
        >
          <div className="bg-white text-black p-1.5 rounded-full">
            <Play size={16} />
          </div>
        </div>
      </div>

      {/* ── Text content ── */}
      <div className="flex flex-col overflow-hidden">
        <p className="truncate font-semibold text-white">{title}</p>
        <p className="truncate text-sm text-white/60">{subtitle}</p>
      </div>
    </div>
  );
}

export default memo(LibraryItem);
