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
    const payload = {
      ...data,
      quizDuration: parseInt(data.quizDuration),
      quizAdmin: userData._id,
    };
    mutation.mutate(payload);
  };

  const allowOnlyNumber = (value) => {
    return value.replace(/[^0-9]/g, "");
  };

  return (
    <dialog id="create_quiz_modal" className="modal">
      <div method="dialog" className="modal-box">
        <p className="text-xl font-bold">Create Quiz</p>
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
              <span className="label-text">Quiz Duration</span>
            </label>
            <input
              id="quizDur"
              placeholder="Quiz Duration"
              className={`input w-full max-w-none input-bordered ${
                errors.quizDuration ? "input-error" : "input-primary"
              } w-full`}
              {...register("quizDuration", {
                required: "Quiz Duration is required",
                onChange: (e) => {
                  e.target.value = allowOnlyNumber(e.target.value);
                },
                pattern: {
                  value: /^[0-9]+$/,
                  message: "Please enter a number",
                },
              })}
            />
            {errors.quizDuration?.message && (
              <span className="text-xs text-red-500 pt-1">
                {errors.quizDuration?.message}
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
          <button className="btn btn-primary px-6">Submit</button>
        </form>
      </div>
    </dialog>
  );
}
