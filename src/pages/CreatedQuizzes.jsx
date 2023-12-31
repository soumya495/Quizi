import CreateQuizModal from "../components/core/create-quiz/CreateQuizModal";
import DisplayCreatedQuizzes from "../components/core/create-quiz/DisplayCreatedQuizzes";

export default function CreatedQuizzes() {
  return (
    <>
      <div className="w-full max-w-[100vw]">
        <div className="container mx-auto !px-6 lg:p-10 py-8">
          {/* Section Heading */}
          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-4">
              <h1 className="font-bold text-3xl text-center sm:text-left">
                Created Quizzes
              </h1>
              <p className="max-w-md text-base text-center sm:text-left">
                All the <span className="font-bold">public</span> quizzes
                created by you will be shown here. You can edit your existing
                quizzes or create new <span className="font-bold">public</span>{" "}
                quizzes from here.
              </p>
            </div>
            <button
              onClick={() => window.create_quiz_modal.showModal()}
              className="btn btn-primary"
            >
              Create Quiz
            </button>
          </div>
          <div className="w-full h-[0.1px] bg-neutral my-10"></div>
          {/* Display Created Quizzes */}
          <DisplayCreatedQuizzes />
        </div>
      </div>
      <CreateQuizModal />
    </>
  );
}
