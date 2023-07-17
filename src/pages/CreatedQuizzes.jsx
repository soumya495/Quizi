import CreateQuizModal from "../components/core/create-quiz/CreateQuizModal";

export default function CreatedQuizzes() {
  return (
    <>
      <div className="container mx-auto my-12 px-4">
        <div className="mb-20 flex items-center justify-between">
          <h1 className="text-3xl md:text-5xl font-extrabold">
            Created Quizzes
          </h1>
          <button
            onClick={() => window.create_quiz_modal.showModal()}
            className="btn btn-primary"
          >
            Create Quiz
          </button>
        </div>
      </div>
      <CreateQuizModal />
    </>
  );
}
