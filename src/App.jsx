import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Error from "./pages/Error";
import Otp from "./pages/Otp";
import ForgotPassword from "./pages/ForgotPassword";
import PublicRoute from "./components/common/PublicRoute";
import PrivateRoute from "./components/common/PrivateRoute";
import Profile from "./pages/Profile";
import { useState } from "react";
import { axiosInstance } from "./services/apiConnector";
import { useMemo } from "react";
import { useUser } from "./store/useUser";
import { Link } from "react-router-dom";
import logo from "./assets/logo-black.png";

export default function App() {
  const [sessionExpired, setSessionExpired] = useState(false);
  const { setIsAuthenticated } = useUser();

  useMemo(() => {
    // Add a response interceptor to catch session expiry
    axiosInstance.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        if (error.response.status === 401) {
          // Do something here
          setSessionExpired(true);
        }
        return Promise.reject(error);
      }
    );
  }, [setSessionExpired]);

  return (
    <Router>
      {sessionExpired ? (
        <div className="min-h-screen w-full grid place-content-center">
          <div className="card w-96 bg-neutral text-neutral-content">
            <div className="card-body items-center text-center">
              <img
                src={logo}
                width={200}
                loading="lazy"
                className="mx-auto lg:mx-0"
              />
              <h2 className="card-title">Session Expired!</h2>
              <p className="mb-4">Please Log In Again</p>
              <div className="card-actions justify-end">
                <Link
                  onClick={() => {
                    setSessionExpired(false);
                    setIsAuthenticated(false);
                  }}
                >
                  <button className="btn btn-primary">Login</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
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
          <Route path="*" element={<Error />} />
        </Routes>
      )}
    </Router>
  );
}
