import { Navigate } from "react-router-dom";
import { useUser } from "../../store/useUser";
import Navbar from "./Navbar";

export default function PrivateRoute({ children }) {
  const { isAuthenticated } = useUser();

  if (isAuthenticated) {
    return (
      <>
        <Navbar />
        {children}
      </>
    );
  } else {
    return <Navigate to="/login" />;
  }
}
