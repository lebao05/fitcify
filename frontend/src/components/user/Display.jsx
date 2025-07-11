import { Route, Routes, useLocation } from "react-router-dom";
import DisplayHome from "./DisplayHome";
import DisplayAlbum from "./DisplayAlbum";
import { useEffect, useRef } from "react";
import { albumsData } from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import UserProfile from "../../pages/user/UserProfile";

const Display = () => {
  const displayRef = useRef();
  const location = useLocation();
  const isAlbum = location.pathname.includes("album");
  const albumId = isAlbum ? location.pathname.slice(-1) : "";
  const bgColor = albumsData[Number(albumId)]?.bgColor;
  const nagivate = useNavigate();
  useEffect(() => {
    if (isAlbum && !albumsData[Number(albumId)]) {
      nagivate("/not-found");
      return;
    }
    if (isAlbum) {
      displayRef.current.style.background = `linear-gradient(${bgColor},#121212)`;
    } else {
      displayRef.current.style.background = "#121212";
    }
  });
  //   if (!isAlbum) {
  //     return (
  //       <div className="text-white h-full flex flex-col items-center justify-center">
  //         <Navbar />
  //         <h1 className="text-3xl font-bold mt-20">Album Not Found</h1>
  //         <p className="text-gray-400 mt-2">
  //           The album you're looking for doesn't exist.
  //         </p>
  //       </div>
  //     );
  //   }
  return (
    <div
      ref={displayRef}
      className="w-[100%] m-2 px-2 pt-4 rounded bg-[#121212] text-white overflow-auto lg:w-[75%] lg:ml-0"
    >
      <Routes>
        <Route path="/" element={<DisplayHome />} />
        <Route path="/album/:id" element={<DisplayAlbum />} />
        <Route path="/profile" element={<UserProfile/>} />
      </Routes>
    </div>
  );
};

export default Display;
