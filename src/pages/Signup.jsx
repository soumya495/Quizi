import { Link } from "react-router-dom";
import { ReactComponent as SignupImage } from "../assets/svgs/signup.svg";
import logo from "../assets/logo-small.png";
import SignupForm from "../components/core/signup/SignupForm";

export default function Signup() {
  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="h-full bg-base-200 hidden lg:w-[40%] lg:flex items-center justify-center">
        <div className="w-[600px]">
          <SignupImage />
        </div>
      </div>
      <div className="flex-1 h-full grid place-content-center">
        <div className="flex flex-col items-center">
          <Link to="/">
            <img
              src={logo}
              width={60}
              loading="lazy"
              className="mx-auto lg:mx-0"
            />
          </Link>
          <h1 className="text-3xl font-bold mt-3 mb-8 tracking-wide">
            Sign Up
          </h1>
          <SignupForm />
          <p className="text-sm mt-4">
            Already have an account?{" "}
            <Link to="/login">
              <span className="text-primary font-medium">Login</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
