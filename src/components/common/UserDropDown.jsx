import { Link } from "react-router-dom";
import { useProfile } from "../../services/queryFunctions/profile";
import ImageAvatar from "./ImageAvatar";

export default function UserDropDown() {
  const { data } = useProfile();
  const userData = data?.data?.data?.user;

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
          <button onClick={() => window.logout_modal.showModal()}>
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
}
