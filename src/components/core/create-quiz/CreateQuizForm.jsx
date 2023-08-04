import { useForm } from "react-hook-form";
import { useProfile } from "../../../services/queryFunctions/profile";
import { useMutation } from "@tanstack/react-query";
import { apiConnector } from "../../../services/apiConnector";
import { CREATE_QUIZ, UPDATE_QUIZ } from "../../../services/apis";
import { toast } from "react-hot-toast";
import TextInput from "../../reusable/TextInput";
import { useEffect } from "react";
import _ from "lodash";
import { useState } from "react";
import { useQuiz } from "../../../store/useQuiz";
import TimeInput from "./TimeInput";
import {
  convertToHoursMinutesSeconds,
  convertToMilliSeconds,
  scrollToEl,
} from "../../../services/helpers";
import { useNavigate } from "react-router-dom";

export default function CreateQuizForm({
  originalQuizData,
  preFill = null,
  refetch,
}) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const { data } = useProfile();
  const { setQuizDetails } = useQuiz();
  const navigate = useNavigate();

  const [updatedFields, setUpdatedFields] = useState({});
  const [isFormUpdated, setIsFormUpdated] = useState(false);

  useEffect(() => {
    // preFill => form used to update quiz details
    if (preFill) {
      const { hours, minutes, seconds } = convertToHoursMinutesSeconds(
        preFill.quizDuration
      );

      setValue("quizName", preFill.quizName);
      setValue("hours", hours);
      setValue("minutes", minutes);
      setValue("seconds", seconds);
      setValue("quizTopic", preFill.quizTopic);
      setValue("quizDescription", preFill.quizDescription);

      compareQuizzes(preFill);
    }
  }, [preFill]);

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
      // console.log("quiz data", data);
      refetch();
      if (!preFill) {
        toast.success("Quiz Created Successfully");
        window.create_quiz_modal.close();
        navigate(`/quiz-builder/${data?.data?.quiz?._id}?tab=questions`);
      } else {
        toast.success("Quiz Updated Successfully");
        setIsFormUpdated(false);
        setUpdatedFields({});
      }
    },
    onError: (error) => {
      console.log("error", error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    },
  });

  const onSubmit = (data) => {
    // console.log("form data", data);

    // Create new Quiz
    if (!preFill) {
      const durationInMilliseconds = convertToMilliSeconds(
        data.hours,
        data.minutes,
        data.seconds
      );

      // quiz duration should be atleast 1 minutes
      if (durationInMilliseconds < 60000) {
        toast.error("Quiz duration should be atleast 1 minute");
        return;
      }

      mutation.mutate({
        ...data,
        quizDuration: durationInMilliseconds,
        quizAdmin: userData._id,
      });
    } else {
      if (!isFormUpdated) {
        toast.error("No changes detected");
        return;
      }

      // console.log("updated fields", updatedFields);

      if (updatedFields?.quizDuration < 60000) {
        toast.error("Quiz duration should be atleast 1 minute");
        return;
      }

      mutation.mutate(updatedFields);
    }
  };

  const compareQuizzes = (updatedQuizDetails) => {
    const updatedFields = {};

    if (updatedQuizDetails.quizName !== originalQuizData.quizName) {
      updatedFields.quizName = updatedQuizDetails.quizName;
    }
    if (
      updatedQuizDetails.quizDescription !== originalQuizData.quizDescription
    ) {
      updatedFields.quizDescription = updatedQuizDetails.quizDescription;
    }
    if (updatedQuizDetails.quizDuration !== originalQuizData.quizDuration) {
      updatedFields.quizDuration = updatedQuizDetails.quizDuration;
    }
    if (updatedQuizDetails.quizTopic !== originalQuizData.quizTopic) {
      updatedFields.quizTopic = updatedQuizDetails.quizTopic;
    }

    // console.log(updatedFields);

    if (!_.isEmpty(updatedFields)) {
      setIsFormUpdated(true);
      setUpdatedFields(updatedFields);
    } else {
      setIsFormUpdated(false);
      setUpdatedFields({});
    }
  };

  const handleOnChange = () => {
    if (!preFill) return;
    const updatedQuizDetails = {
      ...preFill,
      quizName: watch("quizName"),
      quizDuration: convertToMilliSeconds(
        watch("hours"),
        watch("minutes"),
        watch("seconds")
      ),
      quizDescription: watch("quizDescription"),
      quizTopic: watch("quizTopic"),
    };

    compareQuizzes(updatedQuizDetails);
    scrollToEl("quiz-details-card", "preview-wrapper");
    setQuizDetails(updatedQuizDetails);
  };

  const resetFormChanges = () => {
    setValue("quizName", originalQuizData.quizName);
    setValue("hours", originalQuizData.hours);
    setValue("minutes", originalQuizData.minutes);
    setValue("seconds", originalQuizData.seconds);
    setValue("quizTopic", originalQuizData.quizTopic);
    setValue("quizDescription", originalQuizData.quizDescription);

    setQuizDetails(originalQuizData);

    setIsFormUpdated(false);
    setUpdatedFields({});
  };

  return (
    <form
      onChange={handleOnChange}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-2"
    >
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
      <div>
        <p className="label label-text text-base">Quiz Duration</p>
        <div className="flex items-start gap-x-4">
          <TimeInput
            register={register}
            errors={errors}
            label="Hour"
            fieldName="hours"
            setValue={setValue}
          />
          <TimeInput
            register={register}
            errors={errors}
            label="Minutes"
            fieldName="minutes"
            setValue={setValue}
          />
          <TimeInput
            register={register}
            errors={errors}
            label="Seconds"
            fieldName="seconds"
            setValue={setValue}
          />
        </div>
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
      <div className="flex gap-x-4">
        <button
          disabled={preFill && !isFormUpdated}
          className="btn btn-primary px-6"
        >
          {preFill ? "Save Changes" : "Proceed"}
        </button>
        {preFill && (
          <button
            onClick={resetFormChanges}
            type="button"
            disabled={!isFormUpdated}
            className="btn btn-accent"
          >
            Undo
          </button>
        )}
      </div>
    </form>
  );
}
