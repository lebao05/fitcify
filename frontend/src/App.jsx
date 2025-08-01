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
import PaymentSubcribe from "./pages/payment/SubscribePage";
import PaymentSuccess from "./pages/payment/paymentSuccess";
import PaymentCancel from "./pages/payment/paymentCancel";
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

  const isInitialized = useSelector((state) => state.user.isInitialized);

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
          element={<LoginPage email={email} setEmail={setEmail} />}
        />
        <Route path="/loginotp" element={<LoginOtp email={email} />} />
        <Route path="/signup" element={<Signuppage />} />
        <Route path="/signup-step1" element={<SignupStep1 />} />
        <Route path="/signup-step2" element={<SignupStep2 />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/artist" element={<ArtistLayout />}>
          <Route path="profile" element={<ArtistProfile isOwner={true} />} />
          {/* <Route index element={<Navigate to="dashboard" replace />} /> */}
          <Route path="dashboard" element={<ArtistDashboard />} />
          <Route path="playlists" element={<ArtistPlaylist playlists={[]} />} />
          <Route path="albums" element={<ArtistAlbum />} />
          <Route path="music" element={<ArtistSong songs={[]} />} />
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>
        <Route path="/subscribe" element={<PaymentSubcribe />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-cancel" element={<PaymentCancel />} />
        <Route path="/*" element={<MainPlayout />} />
        <Route path="/not-found" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
