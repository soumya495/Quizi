import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Error from "./pages/Error";
import Otp from "./pages/Otp";
import ForgotPasswordEmail from "./pages/ForgotPasswordEmail";
import ResetPassword from "./pages/ResetPassword";
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/otp" element={<Otp />} />
        <Route
          path="/forgot-password-email"
          element={<ForgotPasswordEmail />}
        />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </Router>
  );
}
