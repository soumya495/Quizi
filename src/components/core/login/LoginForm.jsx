import { useState } from "react";
import { useForm } from "react-hook-form";
import TextInput from "../../reusable/TextInput";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link } from "react-router-dom";

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = (data) => console.log(data);

  return (
    <form
      className="w-11/12 mx-auto md:w-[350px] flex flex-col space-y-1"
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
      <Link to="/">
        <p className="text-xs text-primary mb-3 text-right">Forgot password?</p>
      </Link>
      {/* submit button */}
      <button className="btn btn-block btn-primary">Signup</button>
    </form>
  );
}
