import { useForm } from "react-hook-form";
import TextInput from "../../reusable/TextInput";
import { toast } from "react-hot-toast";
import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiConnector } from "../../../services/apiConnector";
import { ADD_QUESTION, UPDATE_QUESTION } from "../../../services/apis";
import { useParams } from "react-router-dom";
import { useQuiz } from "../../../store/useQuiz";
import Option from "./Option";
import { useQuizDetails } from "../../../services/queryFunctions/quiz";
import _ from "lodash";
import { useState } from "react";
import { useLocation } from "react-router-dom";

export default function AddQuizQuestion({ preFill, showModal }) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const location = useLocation();

  const [isQuestionUpdated, setIsQuestionUpdated] = useState(false);
  const [updatedFields, setUpdatedFields] = useState({});

  const { id: quizId } = useParams();

  const { data, refetch: refetchQuizDetails } = useQuizDetails(quizId);

  const { questions, setQuestions, setPreviewQuestion, previewQuestion } =
    useQuiz();

  // For editing question
  useEffect(() => {
    // pre-fill existing values to form
    if (preFill) {
      // console.log("prefill", preFill);
      setValue("question", preFill.question);
      setValue("questionPoints", preFill.points);
      preFill?.options?.forEach((option, index) => {
        setValue(`option${index + 1}`, option.option);
        setValue(`option${index + 1}-isCorrect`, option.correct);
      });
      checkFormUpdated(preFill);
    }
  }, []);

  // For new question
  // If tab switches and preview question is not empty
  useEffect(() => {
    // console.log("updatedFields", updatedFields);
    if (!preFill && Object.keys(previewQuestion).length > 0) {
      // console.log("previewQuestion", previewQuestion);
      setValue(
        "question",
        previewQuestion?.question ? previewQuestion?.question : ""
      );
      setValue(
        "questionPoints",
        previewQuestion?.points ? previewQuestion?.points : ""
      );
      previewQuestion?.options?.forEach((option, index) => {
        setValue(`option${index + 1}`, option.option);
        setValue(`option${index + 1}-isCorrect`, option.correct);
      });
      setIsQuestionUpdated(true);
    }
  }, [location?.search]);

  // mutation to create a new question
  const mutation = useMutation({
    mutationFn: (payload) => {
      return apiConnector("POST", `${ADD_QUESTION}/${quizId}`, payload);
    },
    onSuccess: () => {
      setPreviewQuestion({});
      setUpdatedFields({});
      setIsQuestionUpdated(false);
      refetchQuizDetails();
      reset();
      toast.success("Question added successfully");
    },
    onError: (error) => {
      console.log(error);
      toast.error("Something went wrong");
    },
  });

  // mutation to update an existing question
  const updateMutation = useMutation({
    mutationFn: (payload) => {
      return apiConnector(
        "PUT",
        `${UPDATE_QUESTION}/${quizId}/${preFill?._id}`,
        payload
      );
    },
    onSuccess: () => {
      refetchQuizDetails();
      setUpdatedFields({});
      setIsQuestionUpdated(false);
      toast.success("Question updated successfully");
    },
    onError: (error) => {
      console.log(error);
      toast.error("Something went wrong");
    },
  });

  // handle form submission
  const onSubmit = (data) => {
    // console.log(data);

    if (!preFill) {
      // check correct options
      let questionOptions = [];
      let correctOptions = 0;
      for (let i = 1; i <= 5; i++) {
        if (data[`option${i}`]) {
          questionOptions.push({
            option: data[`option${i}`],
            correct: data[`option${i}-isCorrect`],
          });
          if (data[`option${i}-isCorrect`]) {
            correctOptions++;
          }
        }
      }

      if (correctOptions === 0) {
        toast.error("Please select atleast one correct option");
        return;
      }

      const payload = {
        question: data.question,
        questionPoints: parseFloat(data.questionPoints),
        questionOptions: JSON.stringify(questionOptions),
      };
      mutation.mutate(payload);
      return;
    }

    const payload = updatedFields;
    updateMutation.mutate(payload);
  };

  // only for editing question
  const checkFormUpdated = (updatedQuestion) => {
    // find the index of question being edited
    const index = questions?.findIndex(
      (question) => question._id === preFill._id
    );
    // find the original / unmodified question from db
    const originalQuestion = data?.data?.data?.quiz?.quizQuestions[index];

    const updatedFields = {};
    if (updatedQuestion.question !== originalQuestion?.question) {
      updatedFields.question = updatedQuestion.question;
    }
    if (parseFloat(updatedQuestion.points) !== originalQuestion?.points) {
      updatedFields.points = updatedQuestion.points;
    }
    if (!_.isEqual(updatedQuestion.options, originalQuestion?.options)) {
      updatedFields.questionOptions = JSON.stringify(updatedQuestion.options);
    }

    // to check if the question is updated
    if (Object.keys(updatedFields).length > 0) {
      setUpdatedFields(updatedFields);
      setIsQuestionUpdated(true);
      // console.log(updatedFields);
    } else {
      setUpdatedFields({});
      setIsQuestionUpdated(false);
    }
  };

  const handleFormChange = () => {
    // Handle New Question Preview
    if (!preFill) {
      const previewQuestion = {};

      if (watch("question")) {
        previewQuestion.question = watch("question");
      }

      if (watch("questionPoints")) {
        previewQuestion.points = watch("questionPoints");
      }

      const options = [];

      for (let i = 1; i <= 5; i++) {
        if (watch(`option${i}`)) {
          options.push({
            option: watch(`option${i}`),
            correct: watch(`option${i}-isCorrect`),
          });
        }
      }

      if (options.length > 0) {
        const findCorrectOptions = options.filter(
          (option) => option.correct === true
        );
        if (findCorrectOptions.length <= 1) {
          previewQuestion.questionType = "Single Correct";
        } else {
          previewQuestion.questionType = "Multiple Correct";
        }
        previewQuestion.options = options;
      }

      if (Object.keys(previewQuestion).length > 0) {
        previewQuestion._id = Math.random().toString();
        setPreviewQuestion(previewQuestion);
        setIsQuestionUpdated(true);
        document.getElementById("preview-card")?.removeAttribute("hidden");
      } else {
        document.getElementById("preview-card")?.setAttribute("hidden", true);
        setPreviewQuestion({});
        setIsQuestionUpdated(false);
      }
    }
    // Handle Edit Question Preview
    else {
      // find the index of question being edited
      const index = questions.findIndex(
        (question) => question._id === preFill._id
      );
      // find the original / unmodified question from db
      const originalQuestion = data?.data?.data?.quiz?.quizQuestions[index];
      originalQuestion.options = originalQuestion?.options.map((option) => {
        return {
          option: option.option,
          correct: option.correct,
        };
      });

      // to keep track of the updated question
      const updatedQuestion = {
        ...preFill,
      };

      // checks to ensure that the question is updated (for real time preview)
      if (watch("questionPoints") !== preFill.points) {
        updatedQuestion.points = watch("questionPoints");
      }
      if (watch("question") !== preFill.question) {
        updatedQuestion.question = watch("question");
      }
      const options = [];
      for (let i = 1; i <= 5; i++) {
        if (
          watch(`option${i}`) &&
          watch(`option${i}` !== preFill?.options[i - 1]?.option)
        ) {
          options.push({
            option: watch(`option${i}`),
            correct: watch(`option${i}-isCorrect`),
          });
        }
      }
      if (options.length > 0) {
        const findCorrectOptions = options.filter(
          (option) => option.correct === true
        );
        if (findCorrectOptions.length <= 1) {
          updatedQuestion.questionType = "Single Correct";
        } else {
          updatedQuestion.questionType = "Multiple Correct";
        }
        updatedQuestion.options = options;
      }

      const newQuestions = [...questions];
      newQuestions[index] = updatedQuestion;

      checkFormUpdated(updatedQuestion);

      setQuestions(newQuestions);
    }
  };

  const resetForm = () => {
    setIsQuestionUpdated(false);
    if (!preFill) {
      setPreviewQuestion({});
      reset();
      document.getElementById("preview-card").setAttribute("hidden", true);
    } else {
      // find the index of question being edited
      const index = questions.findIndex(
        (question) => question._id === preFill._id
      );
      // find the original / unmodified question from db
      const originalQuestion = data?.data?.data?.quiz?.quizQuestions[index];
      const newQuestions = [...questions];
      newQuestions[index] = originalQuestion;

      setValue("question", originalQuestion.question);
      setValue("questionPoints", originalQuestion.points);
      originalQuestion?.options?.forEach((option, index) => {
        setValue(`option${index + 1}`, option.option);
        setValue(`option${index + 1}-isCorrect`, option.correct);
      });

      setQuestions(newQuestions);
    }
  };

  return (
    <>
      <form
        onChange={handleFormChange}
        onSubmit={handleSubmit(onSubmit)}
        className="pt-1 pb-4"
      >
        <div className="form-control w-[200px] ml-auto">
          <label className="label" htmlFor="quizPts">
            <span className="label-text">Points</span>
          </label>
          <input
            type="number"
            id="quizPts"
            placeholder="Points..."
            className={`input w-full max-w-none input-bordered ${
              errors.questionPoints ? "input-error" : "input-primary"
            } w-full`}
            {...register("questionPoints", {
              required: "Points is required",
              min: {
                value: 1,
                message: "Points cannot be less than 1",
              },
              maxLength: {
                value: 3,
                message: "Points cannot be more than 3 digits",
              },
            })}
            onChange={(e) => {
              if (e.target.value.length > 3) {
                e.target.value = e.target.value.slice(0, 3);
              }
              setValue("questionPoints", e.target.value);
            }}
          />
          {errors.questionPoints && (
            <span className="text-xs text-red-500 pt-1">
              {errors.questionPoints.message}
            </span>
          )}
        </div>
        <div className="mb-4">
          <TextInput
            register={register}
            errors={errors}
            fieldName="question"
            label="Question"
            placeholder="Question..."
            required={true}
          />
        </div>
        <Option
          register={register}
          errors={errors}
          fieldName="option1"
          checkFieldName="option1-isCorrect"
          label="Option 1"
          placeholder="Option 1..."
          required={true}
          setValue={setValue}
          watch={watch}
        />
        <Option
          register={register}
          errors={errors}
          fieldName="option2"
          checkFieldName="option2-isCorrect"
          label="Option 2"
          placeholder="Option 2..."
          required={true}
          setValue={setValue}
          watch={watch}
        />
        <Option
          register={register}
          errors={errors}
          fieldName="option3"
          checkFieldName="option3-isCorrect"
          label="Option 3"
          placeholder="Option 3..."
          setValue={setValue}
          watch={watch}
        />
        <Option
          register={register}
          errors={errors}
          fieldName="option4"
          checkFieldName="option4-isCorrect"
          label="Option 4"
          placeholder="Option 4..."
          setValue={setValue}
          watch={watch}
        />
        <Option
          register={register}
          errors={errors}
          fieldName="option5"
          checkFieldName="option5-isCorrect"
          label="Option 5"
          placeholder="Option 5..."
          setValue={setValue}
          watch={watch}
        />
        <div className="flex items-center space-x-4 mt-10">
          {preFill && (
            <button
              disabled={!isQuestionUpdated}
              type="submit"
              className="btn btn-primary btn-md block"
            >
              Update Question
            </button>
          )}

          {!preFill && (
            <button type="submit" className="btn btn-primary btn-md block">
              Add Question
            </button>
          )}
          <button
            type="button"
            onClick={resetForm}
            disabled={!isQuestionUpdated}
            className="btn btn-accent"
          >
            Undo
          </button>
          {preFill && (
            <button
              onClick={() => showModal(preFill?._id)}
              type="button"
              className="btn btn-error btn-md block"
            >
              Delete
            </button>
          )}
        </div>
      </form>
    </>
  );
}
