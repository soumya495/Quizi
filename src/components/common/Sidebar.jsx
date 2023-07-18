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
import { AiOutlineMenu } from "react-icons/ai";
import { FiSettings, FiLogOut } from "react-icons/fi";
import { useLocation } from "react-router-dom";

export default function Sidebar({ children }) {
  const { data } = useProfile();
  const navigate = useNavigate();
  const location = useLocation();

  const userData = data?.data?.data?.user;

  const { setIsAuthenticated } = useUser();

  // mutation for logout
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

  // Component for user dropdown
  function UserDropDown() {
    return (
      <div className="dropdown dropdown-end">
        <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
          <div className="w-10 h-10 rounded-full">
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
            <button
              onClick={() => window.logout_modal.showModal()}
              disabled={mutation.isLoading}
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
    );
  }

  // Component for mobile navbar
  function MobileNavbar() {
    return (
      <div className="bg-[#191E24] lg:hidden fixed top-0 left-0 right-0 z-[1]">
        <div className="container min-h-[72px] px-6 mx-auto flex items-center justify-between">
          <div className="flex-1 flex justify-start">
            <Link to="/" className="w-max">
              <img width={150} src={logo} loading="lazy" />
            </Link>
          </div>
          <div className="flex items-center gap-x-2">
            <UserDropDown />
            <label
              htmlFor="my-drawer-2"
              className="drawer-button cursor-pointer"
            >
              <AiOutlineMenu fontSize={32} />
            </label>
          </div>
        </div>
      </div>
    );
  }

  function matchRoute(route) {
    return location.pathname === route;
  }

  // Component for rendering Links in sidebar
  function SidebarLink({ to, children }) {
    return (
      <Link to={to}>
        <div
          onClick={() => document.getElementById("my-drawer-2").click()}
          className={`py-3 px-4 rounded-md bg-base-100 ${
            matchRoute(to) ? "bg-opacity-100 font-semibold" : "bg-opacity-0"
          } hover:bg-opacity-30 transition-all duration-200`}
        >
          {children}
        </div>
      </Link>
    );
  }

  // Component for Logout Modal
  function LogoutModal() {
    return (
      <dialog id="logout_modal" className="modal">
        <form method="dialog" className="modal-box">
          <h3 className="font-bold text-lg">Logout !</h3>
          <p className="py-4">Are you sure you want to Logout </p>
          <div className="space-x-4 mt-3">
            <button onClick={mutation.mutate} className="btn btn-primary">
              Logout
            </button>
            <button className="btn">Cancel</button>
          </div>
        </form>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    );
  }

  return (
    <>
      <div className="drawer lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content mt-[72px] lg:mt-0">
          <MobileNavbar />
          {/* Page content here */}
          {children}
        </div>
        <div className="drawer-side bottom-0 z-10">
          <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
          <div className="menu justify-between p-4 py-8 w-72 h-full bg-base-200 text-base-content">
            {/* Sidebar content here */}
            <div className="space-y-20">
              <Link to="/" className="block w-max mx-auto">
                <img width={190} src={logo} loading="lazy" />
              </Link>
              <div className="flex flex-col text-base">
                <SidebarLink to="/profile">My Profile</SidebarLink>
                <SidebarLink to="/created-quizzes">Created Quizzes</SidebarLink>
                <SidebarLink to="/attempted-quizzes">
                  Attempted Quizzes
                </SidebarLink>
                <SidebarLink to="/created-groups">Created Groups</SidebarLink>
                <SidebarLink to="/joined-groups">Joined Groups</SidebarLink>
              </div>
            </div>

            <div className="flex flex-col text-base">
              <SidebarLink to="/settings">
                <div className="flex items-center">
                  <FiSettings className="inline-block mr-2" fontSize={18} />
                  Settings
                </div>
              </SidebarLink>
              <button
                onClick={() => window?.logout_modal?.showModal()}
                className={`py-3 px-4 rounded-md bg-base-100 bg-opacity-0 hover:bg-opacity-30 transition-all duration-200 text-left`}
              >
                <div className="flex items-center">
                  <FiLogOut className="inline-block mr-2" fontSize={18} />
                  Logout
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
      <LogoutModal />
    </>
  );
}
