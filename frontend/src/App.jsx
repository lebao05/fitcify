import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.scss";

import LoginPage from "./pages/authentication/LoginPage";
import Signuppage from "./pages/authentication/SignupPage";
import SignupStep1 from "./pages/authentication/SignupStep1";
import SignupStep2 from "./pages/authentication/SignupStep2";
import LoginOtp from "./pages/authentication/LoginOtp";
import MainPlayout from "./pages/user/MainPlayout";
import NotFound from "./pages/NotFound";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserFromCookie } from "./redux/slices/userSlice";

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
        <Route path="/*" element={<MainPlayout />} />
        <Route path="/not-found" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
