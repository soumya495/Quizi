import BuilderHeader from "../components/core/quiz-builder/BuilderHeader";
import { useParams } from "react-router-dom";
import { useQuizDetails } from "../services/queryFunctions/quiz";
import QuizDisplay from "../components/core/quiz";
import BuilderArea from "../components/core/quiz-builder/BuilderArea";
import { useState } from "react";

export default function QuizBuilder() {
  const { id: quizId } = useParams();

  const { data, isLoading, error } = useQuizDetails(quizId);
  const [showPreview, setShowPreview] = useState(false);

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>{error.message}</div>;

  const quizData = data?.data?.data?.quiz;

  return (
    <div className="flex flex-col h-[100vh]">
      <BuilderHeader />
      <div className="mt-[80px] w-full flex-1 flex h-[calc(100vh-105px)]">
        {!showPreview && (
          <div className="flex-1 overflow-y-auto">
            <BuilderArea quizData={quizData} setShowPreview={setShowPreview} />
          </div>
        )}
        {/* Separator */}
        <div className="w-3 h-full bg-base-300 border-x-[0.1px] border-x-gray-700 border-opacity-60 hidden lg:block" />

        <div
          className={`flex-1 overflow-y-auto hidden lg:block ${
            showPreview && "!block"
          }`}
        >
          <QuizDisplay quizData={quizData} setShowPreview={setShowPreview} />
        </div>
      </div>
      {/* Footer */}
      <div className="w-full h-[25px] bg-base-300 border-t-[0.1px] border-t-gray-700 border-opacity-60 flex items-center">
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center">
            <p className="text-neutral-100 text-xs uppercase">
              Quiz Id:{" "}
              <span className="font-bold normal-case tracking-wider">
                {quizId}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
