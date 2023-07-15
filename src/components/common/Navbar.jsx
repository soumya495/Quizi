import { useProfile } from "../../services/queryFunctions/profile";
import logo from "../../assets/logo-black.png";
import { Link } from "react-router-dom";
import ImageAvatar from "./ImageAvatar";
import { useMutation } from "@tanstack/react-query";
import { apiConnector } from "../../services/apiConnector";
import { LOGOUT } from "../../services/apis";
import { useUser } from "../../store/useUser";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function Navbar() {
  const { data } = useProfile();
  const navigate = useNavigate();

  const userData = data?.data?.data?.user;

  const { setIsAuthenticated } = useUser();

  const mutation = useMutation({
    mutationFn: () => {
      return apiConnector("POST", LOGOUT);
    },
    onSuccess: () => {
      setIsAuthenticated(false);
      navigate("/login");
      toast.success("Logged Out Successfully");
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  return (
    <div className="navbar bg-base-200">
      <div className="container mx-auto">
        <div className="flex-1 flex justify-start">
          <Link to="/" className="w-max">
            <img width={150} src={logo} loading="lazy" />
          </Link>
        </div>
        <div className="flex-none">
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <ImageAvatar userData={userData} />
              </div>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-200 rounded-box w-52"
            >
              <li>
                <Link to="/profile">Profile</Link>
              </li>
              <li>
                <Link to="/settings">Settings</Link>
              </li>
              <li>
                <button onClick={mutation.mutate} disabled={mutation.isLoading}>
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
