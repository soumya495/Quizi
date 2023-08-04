import QuizDetails from "./QuizDetails";
import logo from "../../../assets/logo-black.png";
import { Link } from "react-router-dom";
import RenderQuestions from "./RenderQuestions";
import { useQuiz } from "../../../store/useQuiz";

export default function QuizDisplay({ setShowPreview }) {
  const { questions: quizQuestions, previewQuestion } = useQuiz();

  return (
    <div className="w-full h-full flex flex-col items-center">
      <div className="w-11/12 max-w-[600px] mx-auto flex-1">
        <button
          onClick={() => setShowPreview(false)}
          className="btn btn-ghost btn-outline lg:hidden mt-6"
        >
          Close Preview
        </button>
        {/* Quiz Details */}
        <QuizDetails />
        {(quizQuestions?.length > 0 ||
          Object.keys(previewQuestion).length > 0) && (
          <>
            <div className="h-[0.75px] w-full bg-neutral" />
            <RenderQuestions questions={quizQuestions} />
          </>
        )}
      </div>
      <div className="flex flex-col items-center gap-y-2 py-6">
        <p className="text-xs">This quiz is created using</p>
        <Link to="/">
          <img src={logo} alt="Quizi" width={90} loading="lazy" />
        </Link>
      </div>
    </div>
  );
}
