import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.scss";

import LoginPage from "./pages/authentication/LoginPage";
import Signuppage from "./pages/authentication/SignupPage";
import SignupStep1 from "./pages/authentication/SignupStep1";
import SignupStep2 from "./pages/authentication/SignupStep2";
import LoginOtp from "./pages/authentication/LoginOtp";
import MainPlayout from "./pages/user/MainPlayout";
import {ProtectedRoute, GuestRoute} from './components/user/ProtectedRoute';
import AccessDenied from "./components/user/AccessDenied";
import ArtistLayout from "./components/artist/ArtistLayout";
import ArtistProfile from "./pages/artist/ArtistProfile";
import ArtistDashboard from "./pages/artist/ArtistDashboard";
import ArtistPlaylist from "./components/artist/ArtistPlaylist";
import ArtistAlbum from "./components/artist/ArtistAlbum";
import ArtistSong from "./components/artist/ArtistSong";
import { Navigate } from "react-router-dom";

import { useState, useEffect } from "react";
import NotFound from "./pages/NotFound";

import { useDispatch, useSelector } from "react-redux";
import { fetchUserFromCookie } from "./redux/slices/userSlice";
import UserProfile from "./pages/user/UserProfile";
import ForgotPassword from "./pages/authentication/ForgotPassword";

function App() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const user = useSelector((state) => state.user.myAuth);

  const isInitialized = useSelector((state) => state.user.isInitialized);
  useEffect(() => {
    const handleRightClick = (e) => {
      e.preventDefault();
    };
    document.addEventListener("contextmenu", handleRightClick);

    return () => {
      document.removeEventListener("contextmenu", handleRightClick);
    };
  }, []);
  useEffect(() => {
    dispatch(fetchUserFromCookie());
  }, [dispatch]);

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-screen bg-neutral-900">
        <div className="w-12 h-12 border-4 border-t-4 border-gray-200 border-t-green-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            <GuestRoute user={user}>
              <LoginPage email={email} setEmail={setEmail} />
            </GuestRoute>
          }
        />
        <Route path="/loginotp" element={
          <GuestRoute user={user}>
            <LoginOtp email={email}/>
          </GuestRoute>
        } />
        <Route path="/signup" element={<Signuppage />} />
        <Route path="/signup-step1" element={<SignupStep1 />} />
        <Route path="/signup-step2" element={<SignupStep2 />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route 
          path="/artist" 
          element={
            <ProtectedRoute allowedRoles={['artist']} userRole={user?.role}>
              <ArtistLayout />
            </ProtectedRoute>
          }
        >           
          <Route path="profile" element={<ArtistProfile isOwner={true} />} />           
          <Route path="dashboard" element={<ArtistDashboard />} />           
          <Route path="playlists" element={<ArtistPlaylist playlists={[]} />} />           
          <Route path="albums" element={<ArtistAlbum />} />           
          <Route path="music" element={<ArtistSong songs={[]} />} />           
          <Route index element={<Navigate to="dashboard" replace />} />         
        </Route>
        <Route path="/access-denied" element={<AccessDenied />} />
        <Route path="/*" element={<MainPlayout />} />
        <Route path="/not-found" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
