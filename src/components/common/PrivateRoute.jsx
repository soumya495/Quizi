import { Navigate } from "react-router-dom";
import { useUser } from "../../store/useUser";

export default function PrivateRoute({ children }) {
  const { isAuthenticated } = useUser();

  if (isAuthenticated) {
    return children;
  } else {
    return <Navigate to="/login" />;
  }
}
