import { Link } from "react-router-dom";
import logo from "../assets/logo-small.png";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export default function ResetPassword() {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState("");

  const onSubmit = (data) => console.log(data);

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="flex-1 h-full grid place-content-center">
        <div className="flex flex-col items-center text-neutral-content">
          <Link to="/">
            <img
              src={logo}
              width={60}
              loading="lazy"
              className="mx-auto lg:mx-0"
            />
          </Link>
          <h1 className="text-3xl font-bold mt-3 mb-1 tracking-wide">
            Reset your password
          </h1>
          <p className="mb-8 max-w-md text-center">
            Enter your new password below.
          </p>
          <form
            className="w-11/12 mx-auto md:w-[350px] flex flex-col space-y-2"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div>
              <div className="form-control w-full">
                <label className="label" htmlFor="password">
                  <span className="label-text">Password</span>
                </label>
                <div className="w-full relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="Password"
                    className={`input w-full max-w-none input-bordered ${
                      errors.password ? "input-error" : "input-primary"
                    } w-full pr-10`}
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 8,
                        message: "Password must have at least 8 characters",
                      },
                    })}
                  />
                  <span
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute top-1/2 -translate-y-1/2 right-3 z-[10] cursor-pointer"
                  >
                    {showPassword ? (
                      <AiOutlineEyeInvisible fontSize={20} fill="#AFB2BF" />
                    ) : (
                      <AiOutlineEye fontSize={20} fill="#AFB2BF" />
                    )}
                  </span>
                </div>
                {errors.password?.message && (
                  <span className="text-xs text-red-500 pt-1">
                    {errors.password?.message}
                  </span>
                )}
              </div>
              {/* confirm Password */}
              <div className="form-control w-full mb-6">
                <label className="label" htmlFor="confirmPassword">
                  <span className="label-text">Confirm Password</span>
                </label>
                <div className="w-full relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    placeholder="Confirm Password"
                    className={`input w-full max-w-none input-bordered ${
                      errors.confirmPassword ? "input-error" : "input-primary"
                    } w-full pr-10`}
                    {...register("confirmPassword", {
                      required: "Please Confirm The Password",
                      validate: (value) =>
                        value === getValues("password") ||
                        "The passwords do not match",
                    })}
                  />
                  <span
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute top-1/2 -translate-y-1/2 right-3 z-[10] cursor-pointer"
                  >
                    {showConfirmPassword ? (
                      <AiOutlineEyeInvisible fontSize={20} fill="#AFB2BF" />
                    ) : (
                      <AiOutlineEye fontSize={20} fill="#AFB2BF" />
                    )}
                  </span>
                </div>
                {errors.confirmPassword?.message && (
                  <span className="text-xs text-red-500 pt-1">
                    {errors.confirmPassword?.message}
                  </span>
                )}
              </div>
            </div>
            <button className="btn btn-block btn-primary">Submit</button>
          </form>
          <div className="text-sm mt-4">
            <Link to="/login">
              <span className="text-primary font-medium">
                {"<-"} Back to Login
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
