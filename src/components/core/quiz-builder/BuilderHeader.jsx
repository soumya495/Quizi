import logo from "../../../assets/logo-black.png";
import { IoMdArrowBack } from "react-icons/io";
import ImageAvatar from "../../common/ImageAvatar";
import { useProfile } from "../../../services/queryFunctions/profile";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function BuilderHeader() {
  const { data } = useProfile();
  const navigate = useNavigate();
  const userData = data?.data?.data?.user;

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
            <button onClick={() => window.logout_modal.showModal()}>
              Logout
            </button>
          </li>
        </ul>
      </div>
    );
  }

  return (
    <div className="bg-base-300 min-h-[80px] border-b-[0.1px] border-b-gray-700 border-opacity-60 flex items-center fixed top-0 left-0 right-0 z-[1000]">
      <div className="container mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center">
          <button
            className="mr-8 btn btn-ghost rounded-full"
            onClick={() => navigate(-1)}
          >
            <IoMdArrowBack fontSize={28} className="text-primary" />
          </button>
          <div className="max-w-max flex items-center gap-x-2">
            <img src={logo} alt="Quizi" width={100} loading="lazy" />
            <p className="font-extrabold text-lg uppercase tracking-widest text-neutral-100">
              Quiz Builder
            </p>
          </div>
        </div>
        {/* <div className="flex items-center gap-x-2"> */}
        <UserDropDown />
        {/* <button className="btn btn-primary">Save Changes</button> */}
        {/* </div> */}
      </div>
    </div>
  );
}
