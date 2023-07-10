import { Link } from "react-router-dom";
import logo from "../assets/logo-small.png";
import TextInput from "../components/reusable/TextInput";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { apiConnector } from "../services/apiConnector";
import { SEND_OTP } from "../services/apis";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useUser } from "../store/useUser";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useState } from "react";

export default function ForgotPassword() {
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm();

  // states for password and confirm password
  // to show/hide password
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState("");

  // react-router navigate hook
  const navigate = useNavigate();

  // access zustand store
  const { setPayload, setOtpType } = useUser();

  // mutation to send otp to email
  const mutation = useMutation({
    mutationFn: (payload) => {
      return apiConnector("POST", SEND_OTP, payload);
    },
    onSuccess: () => {
      // show success toast
      toast.success("OTP sent successfully!");
      // set the email in global state (signupdata)
      setPayload({
        email: getValues().email,
        password: getValues().password,
      });
      // reset the form
      reset();
      // set otp type in global state
      setOtpType("forgot-password");
      // redirect to otp page
      navigate("/otp");
    },
    onError: (error) => {
      // show error toast
      toast.error(error?.response?.data?.message || "Something went wrong!");
    },
  });

  // handle form submit
  // send otp to email
  const onSubmit = (data) => {
    mutation.mutate({ email: data?.email, type: "forgot-password" });
  };

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
            We will send you an email to verify your account and reset your
            password.
          </p>
          <form
            className="w-11/12 mx-auto max-w-[500px] flex flex-col"
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* email */}
            <TextInput
              register={register}
              errors={errors}
              fieldName="email"
              label="Email"
              placeholder="Enter your email address"
              required={true}
              disabled={mutation.isLoading}
              validate={{
                maxLength: (v) =>
                  v.length <= 50 ||
                  "The email should have at most 50 characters",
                matchPattern: (v) =>
                  /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
                  "Email address must be a valid address",
              }}
            />
            <div className="flex gap-x-4">
              {/* password */}
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
            <button
              disabled={mutation.isLoading}
              className="btn btn-block btn-primary"
            >
              Submit
            </button>
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
