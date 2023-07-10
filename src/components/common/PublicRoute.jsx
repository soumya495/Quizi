import { Navigate } from "react-router-dom";
import { useUser } from "../../store/useUser";

export default function PublicRoute({ children }) {
  const { isAuthenticated } = useUser();

  if (!isAuthenticated) {
    return children;
  } else {
    return <Navigate to="/profile" />;
  }
}
