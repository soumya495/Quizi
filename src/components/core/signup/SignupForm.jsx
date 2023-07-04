import { useState } from "react";
import { useForm } from "react-hook-form";
import TextInput from "../../reusable/TextInput";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export default function SignupForm() {
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
        />
        {/* last name */}
        <TextInput
          register={register}
          errors={errors}
          fieldName="lastName"
          label="Last Name"
          placeholder="Last Name"
          required={true}
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
      <button className="btn btn-block btn-primary">Signup</button>
    </form>
  );
}
