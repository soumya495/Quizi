import { useForm } from "react-hook-form";
import { useQuiz } from "../../../store/useQuiz";

function QuestionCard({ index, question, register, fieldName }) {
  return (
    <div
      id={`card-${question?._id}`}
      className="bg-neutral my-10 rounded-md px-10 py-6"
    >
      <p className="text-sm font-bold text-right mb-2">
        {question?.points ?? 0} Points
      </p>
      <p className="text-xl font-bold break-words break-all">
        {index + 1 + ". " + (question?.question ?? "")}
      </p>

      {question?.questionImage && (
        <img
          src={question?.questionImage?.secure_url}
          alt="Question"
          className="w-full h-48 object-contain object-left mt-4"
        />
      )}

      <div className="mt-8 flex flex-col space-y-3">
        {question?.options?.map((option, index) => (
          <div key={index} className="flex items-center gap-2">
            {question?.questionType === "Single Correct" ? (
              <input
                type="radio"
                id={`${question?._id}-${index}`}
                value={option?.option}
                {...register(fieldName)}
                className="radio radio-primary"
              />
            ) : (
              <input
                type="checkbox"
                id={`${question?._id}-${index}`}
                value={option?.option}
                {...register(fieldName)}
                className="checkbox checkbox-primary"
              />
            )}
            <label htmlFor={`${question?._id}-${index}`}>
              {option?.option}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function RenderQuestions({ questions }) {
  const { register, handleSubmit } = useForm();

  const { previewQuestion } = useQuiz();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {questions?.map((question, index) => (
        <QuestionCard
          key={index}
          index={index}
          question={question}
          register={register}
          fieldName={`${question?._id}-selected`}
        />
      ))}
      <div
        id="preview-card"
        hidden={Object.keys(previewQuestion).length > 0 ? false : true}
      >
        <QuestionCard
          index={questions?.length}
          question={previewQuestion}
          register={register}
          fieldName={`${previewQuestion?._id}-selected`}
          preview={true}
        />
      </div>
      <button className="btn btn-primary">Submit</button>
    </form>
  );
}
