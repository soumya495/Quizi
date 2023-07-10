import { useState } from "react";
import { useForm } from "react-hook-form";
import TextInput from "../../reusable/TextInput";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { apiConnector } from "../../../services/apiConnector";
import { LOGIN } from "../../../services/apis";
// import { useUser } from "../../../store/useUser";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../store/useUser";

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // state to toggle password visibility
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // access zustand store
  const { setIsAuthenticated } = useUser();

  // mutation to login
  const mutation = useMutation({
    mutationFn: (payload) => {
      return apiConnector("POST", LOGIN, payload);
    },
    onSuccess: () => {
      toast.success("Login successful!");
      setIsAuthenticated(true);
      navigate("/profile");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Something went wrong!");
    },
  });

  // handle form submit
  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    <form
      className="w-11/12 mx-auto md:w-[350px] flex flex-col space-y-2"
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
            v.length <= 50 || "The email should have at most 50 characters",
          matchPattern: (v) =>
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
            "Email address must be a valid address",
        }}
      />
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
            disabled={mutation.isLoading}
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
      {/* forgot password */}
      <Link
        to="/forgot-password"
        className="text-xs text-primary max-w-max ml-auto"
      >
        <p>Forgot password?</p>
      </Link>
      {/* submit button */}
      <button
        disabled={mutation.isLoading}
        className="btn btn-block btn-primary"
      >
        Login
      </button>
    </form>
  );
}
