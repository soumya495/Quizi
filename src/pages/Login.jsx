import { Link } from "react-router-dom";
import { ReactComponent as SignupImage } from "../assets/svgs/signup.svg";
import LoginForm from "../components/core/login/LoginForm";
import logo from "../assets/logo-small.png";

export default function Login() {
  return (
    <div className="flex flex-col md:flex-row-reverse h-screen">
      <div className="h-full bg-base-200 hidden lg:w-[40%] lg:flex items-center justify-center">
        <div className="w-[600px] scale-x-[-1]">
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
          <h1 className="text-3xl font-bold mt-3 mb-8 tracking-wide">Log In</h1>
          <LoginForm />
          <p className="text-sm mt-4">
            Do not have an account?{" "}
            <Link to="/signup" className="link text-primary font-medium">
              Signup
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
