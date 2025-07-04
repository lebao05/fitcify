import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "./App.scss";
import LoginPage from "./pages/authentication/LoginPage";
import Signuppage from "./pages/authentication/SignupPage";
import HomePage from './pages/HomePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<Signuppage />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  );
}
export default App;