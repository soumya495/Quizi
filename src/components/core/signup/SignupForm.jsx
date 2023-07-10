import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useUser } from "../../../store/useUser";
import { useNavigate } from "react-router-dom";
import TextInput from "../../reusable/TextInput";
import { apiConnector } from "../../../services/apiConnector";
import { SEND_OTP } from "../../../services/apis";
import toast from "react-hot-toast";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export default function SignupForm() {
  // react-hook-form
  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors },
  } = useForm();

  // react-router navigate hook
  const navigate = useNavigate();

  // states for password and confirm password
  // to show/hide password
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState("");

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
      // set payload(signup data) in global state
      setPayload(getValues());
      // set otp type in global state
      setOtpType("signup");
      // reset the form
      reset();
      // redirect to otp page
      navigate("/otp");
    },
    onError: (error) => {
      // show error toast
      toast.error(error?.response?.data?.message || "Something went wrong!");
    },
  });

  // handle form submission
  const onSubmit = (data) => {
    // send otp to email
    mutation.mutate({ email: data?.email, type: "signup" });
  };

  return (
    <form
      className="w-11/12 mx-auto max-w-[500px] flex flex-col space-y-1"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex items-center space-x-4">
        {/* first name */}
        <TextInput
          register={register}
          errors={errors}
          fieldName="firstName"
          label="First Name"
          placeholder="First Name"
          required={true}
          disabled={mutation.isLoading}
        />
        {/* last name */}
        <TextInput
          register={register}
          errors={errors}
          fieldName="lastName"
          label="Last Name"
          placeholder="Last Name"
          required={true}
          disabled={mutation.isLoading}
        />
      </div>
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
            v.length <= 50 || "The email should have at most 50 characters",
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
              } w-full max-w-xs pr-10`}
              disabled={mutation.isLoading}
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
              } w-full max-w-xs pr-10`}
              disabled={mutation.isLoading}
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
      {/* submit button */}
      <button
        disabled={mutation.isLoading}
        className="btn btn-block btn-primary"
      >
        {mutation.isLoading ? "Loading..." : "Signup"}
      </button>
    </form>
  );
}
