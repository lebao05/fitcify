import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.scss";
import LoginPage from "./pages/authentication/LoginPage";
import Signuppage from "./pages/authentication/SignupPage";
import HomePage from "./pages/HomePage";
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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/loginotp" element={<LoginOtp />} />
        <Route path="/signup" element={<Signuppage />} />
        <Route path="/signup-step1" element={<SignupStep1 />} />
        <Route path="/signup-step2" element={<SignupStep2 />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/artist" element={<ArtistLayout />}>
          {/* <Route index element={<Navigate to="dashboard" replace />} /> */}
          <Route path="profile" element={<ArtistProfile isOwner={true}/>} />
          <Route path="dashboard" element={<ArtistDashboard />} />
          <Route path="playlists" element={<ArtistPlaylist playlists={[]} />} />
          <Route path="albums" element={<ArtistAlbum albums={[]} />} />
          <Route path="music" element={<ArtistSong songs={[]} />} />
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>
        <Route path="/*" element={<MainPlayout />}></Route>
      </Routes>
    </Router>
  );
}
export default App;
