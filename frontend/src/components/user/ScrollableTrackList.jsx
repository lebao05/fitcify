import React, { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react"; // or any icon library you use

const ScrollableTrackList = ({ children }) => {
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const scrollByAmount = 300; // px per arrow click

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1; // scroll speed multiplier
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const scrollLeftClick = () => {
    scrollRef.current.scrollBy({ left: -scrollByAmount, behavior: "smooth" });
  };

  const scrollRightClick = () => {
    scrollRef.current.scrollBy({ left: scrollByAmount, behavior: "smooth" });
  };

  return (
    <div className="relative w-full group">
      {/* Left Arrow */}
      <button
        onClick={scrollLeftClick}
        className="absolute cursor-pointer left-0 top-1/2 -translate-y-1/2 z-10 bg-black bg-opacity-50 p-2 rounded-full hidden group-hover:flex items-center justify-center"
      >
        <ChevronLeft size={20} className="text-white" />
      </button>

      {/* Scrollable Content */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto scrollbar-hide gap-4 cursor-grab select-none px-6"
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        {children}
      </div>

      {/* Right Arrow */}
      <button
        onClick={scrollRightClick}
        className="absolute  cursor-pointer right-0 top-1/2 -translate-y-1/2 z-10 bg-black bg-opacity-50 p-2 rounded-full hidden group-hover:flex items-center justify-center"
      >
        <ChevronRight size={20} className="text-white" />
      </button>
    </div>
  );
};

export default ScrollableTrackList;
