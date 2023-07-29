import { useForm } from "react-hook-form";
import { useProfile } from "../../../services/queryFunctions/profile";
import { useMutation } from "@tanstack/react-query";
import { apiConnector } from "../../../services/apiConnector";
import { CREATE_QUIZ, UPDATE_QUIZ } from "../../../services/apis";
import { toast } from "react-hot-toast";
import TextInput from "../../reusable/TextInput";
import { useEffect } from "react";

export default function CreateQuizForm({ preFill = null, refetch }) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const { data } = useProfile();

  useEffect(() => {
    // preFill => form used to update quiz details
    if (preFill) {
      // convert milliseconds to hh:mm:ss
      const durationInMilliseconds = preFill.quizDuration;
      const hours = Math.floor(
        (durationInMilliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor(
        (durationInMilliseconds % (1000 * 60 * 60)) / (1000 * 60)
      );
      const seconds = Math.floor((durationInMilliseconds % (1000 * 60)) / 1000);
      const duration = `${hours < 10 ? `0${hours}` : hours}:${
        minutes < 10 ? `0${minutes}` : minutes
      }:${seconds < 10 ? `0${seconds}` : seconds}`;

      setValue("quizName", preFill.quizName);
      setValue("quizDescription", preFill.quizDescription);
      setValue("quizDuration", duration);
      setValue("quizTopic", preFill.quizTopic);
    }
  }, []);

  const userData = data?.data?.data?.user;

  const mutation = useMutation({
    mutationFn: (payload) => {
      return apiConnector(
        !preFill ? "POST" : "PUT",
        !preFill ? CREATE_QUIZ : `${UPDATE_QUIZ}/${preFill?.quizId}`,
        payload
      );
    },
    onSuccess: (data) => {
      console.log("quiz data", data);
      refetch();
      if (!preFill) {
        toast.success("Quiz Created Successfully");
        window.create_quiz_modal.close();
      } else {
        toast.success("Quiz Updated Successfully");
      }
    },
    onError: (error) => {
      console.log("error", error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    },
  });

  const onSubmit = (data) => {
    console.log("form data", data);

    // Create new Quiz
    if (!preFill) {
      mutation.mutate({
        ...data,
        quizDuration: convertToMilliSeconds(data.quizDuration),
        quizAdmin: userData._id,
      });
    } else {
      // check if form is updated
      const isFormUpdated =
        data.quizName !== preFill.quizName ||
        data.quizDescription !== preFill.quizDescription ||
        convertToMilliSeconds(data.quizDuration) !== preFill.quizDuration ||
        data.quizTopic !== preFill.quizTopic;
      if (isFormUpdated) {
        // find fields to update
        const fieldsToUpdate = {};
        if (data.quizName !== preFill.quizName) {
          fieldsToUpdate.quizName = data.quizName;
        }
        if (data.quizDescription !== preFill.quizDescription) {
          fieldsToUpdate.quizDescription = data.quizDescription;
        }
        if (convertToMilliSeconds(data.quizDuration) !== preFill.quizDuration) {
          fieldsToUpdate.quizDuration = convertToMilliSeconds(
            data.quizDuration
          );
        }
        if (data.quizTopic !== preFill.quizTopic) {
          fieldsToUpdate.quizTopic = data.quizTopic;
        }
        console.log("updated fields", fieldsToUpdate);
        mutation.mutate(fieldsToUpdate);
      } else {
        toast.error("No changes made");
      }
    }
  };

  // convert hh:mm:ss to milliseconds
  const convertToMilliSeconds = (str) => {
    const duration = str.split(":");
    const durationInMilliseconds =
      parseInt(duration[0]) * 60 * 60 * 1000 +
      parseInt(duration[1]) * 60 * 1000 +
      parseInt(duration[2]) * 1000;
    return durationInMilliseconds;
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
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
      {/* Quiz Topic */}
      <TextInput
        register={register}
        errors={errors}
        fieldName="quizTopic"
        label="Quiz Topic"
        placeholder="Quiz Topic"
        required={true}
      />
      {/* Quiz Description */}
      <div className="form-control w-full pb-3">
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
      <button className="btn btn-primary px-6">
        {preFill ? "Save Changes" : "Proceed"}
      </button>
    </form>
  );
}
