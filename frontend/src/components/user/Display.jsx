import { Route, Routes, useLocation } from "react-router-dom";
import DisplayHome from "./DisplayHome";
import DisplayAlbum from "./DisplayAlbum";
import { useEffect, useRef } from "react";
import { albumsData } from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import UserProfile from "../../pages/user/UserProfile";
import DisplayPlaylist from "./DisplayPlayplist";
import SearchResult from "./SearchPage";
import AudioPlayer from "./AudioPlayer";
const Display = () => {
  const displayRef = useRef();
  const location = useLocation();
  const isAlbum = location.pathname.includes("album");
  const albumId = isAlbum ? location.pathname.slice(-1) : "";
  const bgColor = albumsData[Number(albumId)]?.bgColor;
  const nagivate = useNavigate();
  useEffect(() => {
    // if (isAlbum && !albumsData[Number(albumId)]) {
    //   nagivate("/not-found");
    //   return;
    // }
    if (isAlbum) {
      displayRef.current.style.background = `linear-gradient(${bgColor},#121212)`;
    } else {
      displayRef.current.style.background = "#121212";
    }
  });
  return (
    <div
      ref={displayRef}
      className="flex-1 h-full overflow-y-auto bg-[#121212] text-white px-2 pt-2 pb-32 mt-16"
    >
      <Routes>
        <Route path="/" element={<DisplayHome />} />
        <Route path="/album/:id" element={<DisplayAlbum />} />
        <Route path="/profile/:id" element={<UserProfile />} />
        <Route path="/playplist/:id" element={<DisplayPlaylist />} />
        <Route path="/search/*" element={<SearchResult />} />
      </Routes>{" "}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <AudioPlayer />
      </div>
    </div>
  );
};

export default Display;
