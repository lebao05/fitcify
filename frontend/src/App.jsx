import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.scss";
import LoginPage from "./pages/authentication/LoginPage";
import Signuppage from "./pages/authentication/SignupPage";
import SignupStep1 from "./pages/authentication/SignupStep1";
import SignupStep2 from "./pages/authentication/SignupStep2";
import LoginOtp from "./pages/authentication/LoginOtp";
import MainPlayout from "./pages/user/MainPlayout";
import ArtistLayout from "./components/artist/ArtistLayout";
import ArtistProfile from "./pages/artist/ArtistProfile";
import ArtistDashboard from "./pages/artist/ArtistDashboard";
import ArtistPlaylist from "./components/artist/ArtistPlaylist";
import ArtistAlbum from "./components/artist/ArtistAlbum";
import ArtistSong from "./components/artist/ArtistSong";
import { Navigate } from "react-router-dom";

import { useState } from "react";
import NotFound from "./pages/NotFound";
function App() {
  const [email, setEmail] = useState("");
  return (
    <Router>
      <Routes>
        <Route path="/not-found" element={<NotFound />} />
        <Route
          path="/login"
          element={<LoginPage email={email} setEmail={setEmail} />}
        />
        <Route path="/loginotp" element={<LoginOtp email={email} />} />
        <Route path="/signup" element={<Signuppage />} />
        <Route path="/signup-step1" element={<SignupStep1 />} />
        <Route path="/signup-step2" element={<SignupStep2 />} />
        <Route path="/artist" element={<ArtistLayout />}>
          {/* <Route index element={<Navigate to="dashboard" replace />} /> */}
          <Route path="profile" element={<ArtistProfile isOwner={true}/>} />
          <Route path="dashboard" element={<ArtistDashboard />} />
          <Route path="playlists" element={<ArtistPlaylist playlists={[]} />} />
          <Route path="albums" element={<ArtistAlbum albums={[]} />} />
          <Route path="music" element={<ArtistSong songs={[]} />} />
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>
        <Route path="/*" element={<MainPlayout />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
export default App;
