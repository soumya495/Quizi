import { Navigate } from "react-router-dom";
import { useUser } from "../../store/useUser";
import Sidebar from "./Sidebar";

export default function PrivateRoute({ children }) {
  const { isAuthenticated } = useUser();

  if (isAuthenticated) {
    return (
      <>
        <Sidebar>{children}</Sidebar>
      </>
    );
  } else {
    return <Navigate to="/login" />;
  }
}
