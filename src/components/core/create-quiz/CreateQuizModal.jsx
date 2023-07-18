import { useForm } from "react-hook-form";
import TextInput from "../../reusable/TextInput";
import { useProfile } from "../../../services/queryFunctions/profile";
import { useMutation } from "@tanstack/react-query";
import { apiConnector } from "../../../services/apiConnector";
import { CREATE_QUIZ } from "../../../services/apis";
import { toast } from "react-hot-toast";

export default function CreateQuizModal() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { data, refetch } = useProfile();

  const userData = data?.data?.data?.user;

  const mutation = useMutation({
    mutationFn: (payload) => {
      return apiConnector("POST", CREATE_QUIZ, payload);
    },
    onSuccess: (data) => {
      console.log("quiz data", data);
      refetch();
      toast.success("Quiz Created Successfully");
      window.create_quiz_modal.close();
    },
    onError: (error) => {
      console.log("error", error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    },
  });

  const onSubmit = (data) => {
    console.log("form data", data);

    // convert hh:mm:ss to milliseconds
    const duration = data.quizDuration.split(":");
    const durationInMilliseconds =
      parseInt(duration[0]) * 60 * 60 * 1000 +
      parseInt(duration[1]) * 60 * 1000 +
      parseInt(duration[2]) * 1000;

    const payload = {
      ...data,
      quizDuration: durationInMilliseconds,
      quizAdmin: userData._id,
    };
    mutation.mutate(payload);
  };

  const validateDurationFormat = (value) => {
    const durationRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
    return (
      durationRegex.test(value) ||
      "Please enter a valid duration in the format hh:mm:ss"
    );
  };

  const allowOnlyNumber = (value) => {
    return value.replace(/[^0-9:]/g, "");
  };

  return (
    <dialog id="create_quiz_modal" className="modal">
      <div method="dialog" className="modal-box">
        <div className="flex items-center justify-between">
          <p className="text-xl font-bold">Create Quiz</p>
          <button
            onClick={() => {
              window.create_quiz_modal.close();
            }}
            className="btn btn-sm btn-circle btn-ghost"
          >
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-2">
          {/* Quiz Name */}
          <TextInput
            register={register}
            errors={errors}
            fieldName="quizName"
            label="Quiz Name"
            placeholder="Quiz Name"
            required={true}
          />
          {/* Quiz Duration */}
          <div className="form-control w-full">
            <label className="label" htmlFor="quizDur">
              <span className="label-text">Quiz Duration (hh:mm:ss)</span>
            </label>
            <input
              id="quizDur"
              placeholder="Quiz Duration"
              className={`input w-full max-w-none input-bordered ${
                errors.quizDuration ? "input-error" : "input-primary"
              } w-full`}
              {...register("quizDuration", {
                required: "Quiz Duration is required",
                validate: validateDurationFormat,
              })}
              onChange={(e) => {
                e.target.value = allowOnlyNumber(e.target.value);
              }}
            />
            {errors.quizDuration && (
              <span className="text-xs text-red-500 pt-1">
                {errors.quizDuration.message}
              </span>
            )}
          </div>
          {/* Quiz Description */}
          <div className="form-control w-full">
            <label className="label" htmlFor="quizDesc">
              <span className="label-text">Quiz Description</span>
            </label>
            <textarea
              id="quizDesc"
              placeholder="Quiz Description"
              className={`textarea textarea-bordered w-full max-w-none min-h-[100px] ${
                errors.quizDescription ? "textarea-error" : "textarea-primary"
              } w-full`}
              {...register("quizDescription", {
                required: "Quiz Description is required",
              })}
            />
            {errors.quizDescription?.message && (
              <span className="text-xs text-red-500 pt-1">
                {errors.quizDescription?.message}
              </span>
            )}
          </div>
          {/* Submit Button */}
          <button className="btn btn-primary px-6">Proceed</button>
        </form>
      </div>
    </dialog>
  );
}
