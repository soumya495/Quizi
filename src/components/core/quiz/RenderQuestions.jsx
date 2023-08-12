import { useForm } from "react-hook-form";
import { useQuiz } from "../../../store/useQuiz";
import { useSearchParams } from "react-router-dom";

function QuestionCard({ index, question, register, fieldName, currentPage }) {
  const questionNumber = (currentPage - 1) * 10 + index + 1;

  return (
    <div
      id={`card-${question?._id}`}
      className="bg-neutral my-10 rounded-md px-10 py-6"
    >
      <p className="text-sm font-bold text-right mb-2">
        {question?.points ?? 0} Points
      </p>
      <p className="text-xl font-bold break-words break-all">
        {questionNumber + ". " + (question?.question ?? "")}
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

  const { previewQuestion, currentPage, totalPages } = useQuiz();
  const [searchParams, setSearchParams] = useSearchParams();

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
          currentPage={currentPage}
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
          currentPage={currentPage}
        />
      </div>
      <div className="flex items-center gap-x-2">
        {totalPages > 1 && currentPage > 1 ? (
          <button
            type="button"
            onClick={() => {
              searchParams.set("page", currentPage - 1);
              setSearchParams(searchParams);
            }}
            className="btn btn-primary"
          >
            Prev
          </button>
        ) : null}
        {currentPage === totalPages ? (
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        ) : null}
        {totalPages > 1 && currentPage < totalPages ? (
          <button
            type="button"
            onClick={() => {
              searchParams.set("page", currentPage + 1);
              setSearchParams(searchParams);
            }}
            className="btn btn-primary"
          >
            Next
          </button>
        ) : null}
      </div>
    </form>
  );
}
