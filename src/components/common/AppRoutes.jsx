import { Route } from "react-router-dom";
import { Routes } from "react-router-dom";
import Home from "../../pages/Home";
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import Signup from "../../pages/Signup";
import Login from "../../pages/Login";
import Otp from "../../pages/Otp";
import ForgotPassword from "../../pages/ForgotPassword";
import Profile from "../../pages/Profile";
import Settings from "../../pages/Settings";
import Error from "../../pages/Error";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {/* Public Routes (accessible to only logged out user) */}
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        }
      />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/otp"
        element={
          <PublicRoute>
            <Otp />
          </PublicRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        }
      />
      {/* Private Routes (accessible to only logged in user) */}
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <PrivateRoute>
            <Settings />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<Error />} />
    </Routes>
  );
}
