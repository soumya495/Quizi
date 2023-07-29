import QuizDetails from "./QuizDetails";
import logo from "../../../assets/logo-black.png";
import { Link } from "react-router-dom";

export default function QuizDisplay({ quizData, setShowPreview }) {
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
        <QuizDetails
          quizName={quizData?.quizName}
          quizDescription={quizData?.quizDescription}
          quizAuthor={`${quizData?.quizAdmin?.firstName} ${quizData?.quizAdmin?.lastName}`}
          quizDuration={quizData?.quizDuration}
          quizTopic={quizData?.quizTopic}
        />
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
