import logo from "../../../assets/logo-black.png";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import UserDropDown from "../../common/UserDropDown";
import LogoutModal from "../../common/LogoutModal";

export default function BuilderHeader() {
  const navigate = useNavigate();

  return (
    <>
      <div className="bg-base-300 min-h-[80px] border-b-[0.1px] border-b-gray-700 border-opacity-60 flex items-center fixed top-0 left-0 right-0 z-[1000]">
        <div className="container mx-auto px-2 lg:px-6 flex items-center justify-between">
          <div className="flex items-center">
            <button
              className="mr-1 lg:mr-8 btn btn-ghost rounded-full"
              onClick={() => navigate("/created-quizzes")}
            >
              <IoMdArrowBack fontSize={28} className="text-primary" />
            </button>
            <div className="max-w-max flex items-center gap-x-2">
              <img src={logo} alt="Quizi" width={100} loading="lazy" />
              <p className="font-extrabold lg:text-lg uppercase tracking-widest text-neutral-100">
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
      <LogoutModal />
    </>
  );
}
