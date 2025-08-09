

import applogo from "../../assets/applogo.jpg";
import { useNavigate } from "react-router-dom";

const AccessDenied = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-900 px-4">
      <img src={applogo} alt="App Logo" className="h-16 w-16 rounded-full shadow mb-8 mt-2 border-1 border-white" />
      <h1 className="text-white text-4xl font-extrabold text-center mb-2">Access Denied</h1>
      <p className="text-gray-300 text-center mb-8 text-base">You are not allowed to access the Artist page.</p>
      <button
        className="px-6 py-3 rounded-full bg-white text-black font-bold text-lg shadow hover:bg-gray-100 transition-all cursor-pointer"
        onClick={() => navigate("/")}
      >
        Home
      </button>
    </div>
  );
};

export default AccessDenied;
