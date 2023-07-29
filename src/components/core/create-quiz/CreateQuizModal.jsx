import { useCreatedQuizzes } from "../../../services/queryFunctions/quiz";
import CreateQuizForm from "./CreateQuizForm";

export default function CreateQuizModal() {
  const { refetch: refetchQuizData } = useCreatedQuizzes();

  return (
    <dialog id="create_quiz_modal" className="modal">
      <div method="dialog" className="modal-box">
        <div className="flex items-center justify-between mb-5">
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
        <CreateQuizForm refetch={() => refetchQuizData()} />
      </div>
    </dialog>
  );
}
