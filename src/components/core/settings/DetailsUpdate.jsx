import { useForm } from "react-hook-form";
import { useProfile } from "../../../services/queryFunctions/profile";
import TextInput from "../../reusable/TextInput";
import { useMutation } from "@tanstack/react-query";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useState } from "react";
import { apiConnector } from "../../../services/apiConnector";
import { UPDATE_USER } from "../../../services/apis";
import { toast } from "react-hot-toast";

export default function DetailsUpdate() {
  const { data, refetch } = useProfile();

  const userData = data?.data?.data?.user;

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm();

  // states for password and confirm password
  // to show/hide password
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showPassword, setShowPassword] = useState("");

  const mutation = useMutation({
    mutationFn: (payload) => {
      return apiConnector("PUT", UPDATE_USER, payload);
    },
    onSuccess: () => {
      // console.log(data);
      setValue("oldPassword", "");
      setValue("password", "");
      refetch();
      toast.success("Profile Updated Successfully");
    },
    onError: (error) => {
      console.log(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    },
  });

  const onSubmit = (data) => {
    const payload = {};
    if (data.firstName !== userData?.firstName) {
      payload.firstName = data.firstName;
    }
    if (data.lastName !== userData?.lastName) {
      payload.lastName = data.lastName;
    }
    if (data.oldPassword !== "") {
      payload.oldPassword = data.oldPassword;
    }
    if (data.password !== "") {
      payload.password = data.password;
    }
    if (Object.keys(payload).length === 0) {
      toast.error("No changes made");
      return;
    }
    mutation.mutate(payload);
  };

  return (
    <div className="card w-[98%] md:w-[600px] bg-neutral text-neutral-content p-10 md:px-20">
      <form
        className="flex flex-col space-y-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-4">
          {/* first name */}
          <TextInput
            register={register}
            defaultValue={userData?.firstName}
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
            defaultValue={userData?.lastName}
            errors={errors}
            fieldName="lastName"
            label="Last Name"
            placeholder="Last Name"
            required={true}
            disabled={mutation.isLoading}
          />
        </div>
        <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-4">
          {/*old password */}
          <div className="form-control w-full">
            <label className="label" htmlFor="oldPassword">
              <span className="label-text">Old Password</span>
            </label>
            <div className="w-full relative">
              <input
                type={showOldPassword ? "text" : "password"}
                id="oldPassword"
                placeholder="Old Password"
                className={`input w-full max-w-none input-bordered ${
                  errors.oldPassword ? "input-error" : "input-primary"
                } w-full pr-10`}
                disabled={mutation.isLoading}
                {...register("oldPassword", {
                  validate: (value) => {
                    const newPassword = getValues("password");
                    if (value && !newPassword) {
                      return "New Password is required";
                    }
                    return true;
                  },
                  minLength: {
                    value: 8,
                    message: "Password must have at least 8 characters",
                  },
                })}
              />
              <span
                onClick={() => setShowOldPassword((prev) => !prev)}
                className="absolute top-1/2 -translate-y-1/2 right-3 z-[10] cursor-pointer"
              >
                {showOldPassword ? (
                  <AiOutlineEyeInvisible fontSize={20} fill="#AFB2BF" />
                ) : (
                  <AiOutlineEye fontSize={20} fill="#AFB2BF" />
                )}
              </span>
            </div>
            {errors.oldPassword?.message && (
              <span className="text-xs text-red-500 pt-1">
                {errors.oldPassword?.message}
              </span>
            )}
          </div>
          {/* new Password */}
          <div className="form-control w-full mb-6">
            <label className="label" htmlFor="newPassword">
              <span className="label-text">New Password</span>
            </label>
            <div className="w-full relative">
              <input
                type={showPassword ? "text" : "password"}
                id="newPassword"
                placeholder="New Password"
                className={`input w-full max-w-none input-bordered ${
                  errors.password ? "input-error" : "input-primary"
                } w-full pr-10`}
                disabled={mutation.isLoading}
                {...register("password", {
                  validate: (value) => {
                    const oldPassword = getValues("oldPassword");
                    if (value && !oldPassword) {
                      return "Old Password is required";
                    }
                    return true;
                  },
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
        </div>
        <div className="w-full flex justify-center pt-4">
          <button
            type="submit"
            className="btn btn-primary btn-wide"
            disabled={mutation.isLoading}
          >
            {mutation.isLoading ? "Updating..." : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
}
