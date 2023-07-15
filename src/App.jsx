import { BrowserRouter as Router } from "react-router-dom";
import { useState } from "react";
import { axiosInstance } from "./services/apiConnector";
import { useMemo } from "react";
import SessionExpired from "./components/common/SessionExpired";
import AppRoutes from "./components/common/AppRoutes";

export default function App() {
  const [sessionExpired, setSessionExpired] = useState(false);

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
        <SessionExpired setSessionExpired={setSessionExpired} />
      ) : (
        <AppRoutes />
      )}
    </Router>
  );
}
