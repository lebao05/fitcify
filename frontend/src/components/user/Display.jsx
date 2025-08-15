import { Route, Routes, useLocation } from "react-router-dom";
import DisplayHome from "./DisplayHome";
import DisplayAlbum from "./DisplayAlbum";
import { useEffect, useRef } from "react";
import { albumsData } from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import UserProfile from "../../pages/user/UserProfile";
import AccountPage from "../../pages/user/AccountPage";
import ArtistProfile from "../../pages/artist/ArtistProfile";
import DisplayPlaylist from "./DisplayPlayplist";
import SearchResult from "./SearchPage";
import AudioPlayer from "./AudioPlayer";
import SubscriptionPage from "../../pages/payment/SubscribePage";
import PaymentSuccess from "../../pages/payment/paymentSuccess";
import PaymentCancel from "../../pages/payment/paymentCancel";
import DisplaySong from "./DisplaySong";
import DisplayLikedSongs from "./DisplayLikedSongs";
import NotFound from "../../pages/NotFound";
const Display = () => {
  const displayRef = useRef();
  const location = useLocation();
  const isAlbum = location.pathname.includes("album");
  const isPlaylist = location.pathname.includes("playlist");
  const isSong = location.pathname.includes("song");
  const isLikedTrack = location.pathname.includes("likedtrack");

  useEffect(() => {
    displayRef.current.style.background = `linear-gradient(${"#3d4e56"},#070606)`;
  });
  return (
    <div
      ref={displayRef}
      className="flex-1 h-full overflow-y-auto bg-[#121212] text-white pb-32 mt-16"
    >
      <Routes>
        <Route path="/" element={<DisplayHome />} />
        <Route path="/subscribe/" element={<SubscriptionPage />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-cancel" element={<PaymentCancel />} />
        <Route path="/album/:id" element={<DisplayAlbum />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/profile/:id" element={<UserProfile />} />
        <Route path="/artist/:artistId" element={<ArtistProfile />} />
        <Route path="/playlist/:id" element={<DisplayPlaylist />} />
        <Route path="/song/:id" element={<DisplaySong />} />
        <Route path="/search/*" element={<SearchResult />} />
        <Route path="/likedtrack" element={<DisplayLikedSongs />} />
        <Route path="*" element={<NotFound></NotFound>} />
      </Routes>
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <AudioPlayer />
      </div>
    </div>
  );
};

export default Display;
