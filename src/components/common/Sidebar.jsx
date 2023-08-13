import logo from "../../assets/logo-black.png";
import { Link } from "react-router-dom";
import { AiOutlineMenu } from "react-icons/ai";
import { FiSettings, FiLogOut } from "react-icons/fi";
import { useLocation } from "react-router-dom";
import LogoutModal from "./LogoutModal";
import UserDropDown from "./UserDropDown";

export default function Sidebar({ children }) {
  const location = useLocation();

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
