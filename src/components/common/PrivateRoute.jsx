import { Navigate } from "react-router-dom";
import { useUser } from "../../store/useUser";
import Sidebar from "./Sidebar";

export default function PrivateRoute({ children, sidebar = true }) {
  const { isAuthenticated } = useUser();

  if (isAuthenticated) {
    if (sidebar) {
      return (
        <>
          <Sidebar>{children}</Sidebar>
        </>
      );
    } else {
      return <>{children}</>;
    }
  } else {
    return <Navigate to="/login" />;
  }
}
