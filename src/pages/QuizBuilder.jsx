import BuilderHeader from "../components/core/quiz-builder/BuilderHeader";
import { useParams } from "react-router-dom";
import { useQuizDetails } from "../services/queryFunctions/quiz";
import QuizDisplay from "../components/core/quiz";
import BuilderArea from "../components/core/quiz-builder/BuilderArea";
import { useState } from "react";
import { useEffect } from "react";
import { useQuiz } from "../store/useQuiz";
import { useMutation } from "@tanstack/react-query";
import { apiConnector } from "../services/apiConnector";
import { DELETE_QUESTION } from "../services/apis";
import { toast } from "react-hot-toast";
import { useSearchParams } from "react-router-dom";

export default function QuizBuilder() {
  const { id: quizId } = useParams();

  const {
    setQuestions,
    setQuizDetails,
    setPreviewQuestion,
    setTotalPages,
    setCurrentPage,
  } = useQuiz();

  const [searchParams, setSearchParams] = useSearchParams();

  const {
    data,
    isLoading,
    error,
    refetch: refetchQuizDetails,
  } = useQuizDetails(quizId);
  const [showPreview, setShowPreview] = useState(false);
  const [questionId, setQuestionId] = useState(null);

  // deleting a single question by id
  const deleteQuestionMutation = useMutation({
    mutationFn: () => {
      return apiConnector(
        "DELETE",
        `${DELETE_QUESTION}/${quizId}/${questionId}`
      );
    },
    onSuccess: () => {
      // console.log(data);
      refetchQuizDetails();
      toast.success("Question deleted successfully");
    },
    onError: (error) => {
      console.log(error);
      toast.error("Something went wrong");
    },
  });

  // Function to be executed on component unmount
  const cleanUpFunction = () => {
    setQuestions([]);
    setQuizDetails({});
    setPreviewQuestion({});
  };
  useEffect(() => {
    return () => {
      // This will run when the component unmounts
      cleanUpFunction();
    };
  }, []);

  useEffect(() => {
    if (data) {
      console.log("...data fetched...", data?.data?.data);

      const totalPages = data?.data?.data?.totalPages;
      const currentPage = data?.data?.data?.currentPage;

      setTotalPages(totalPages);
      setCurrentPage(currentPage);

      const currentUrlPage = searchParams.get("page");
      if (parseInt(currentUrlPage) > totalPages) {
        searchParams.set("page", totalPages);
        setSearchParams(searchParams);
      }

      const quizData = data?.data?.data?.quiz;
      setQuizDetails({
        quizId: quizData?._id,
        quizName: quizData?.quizName,
        quizDescription: quizData?.quizDescription,
        quizDuration: quizData?.quizDuration,
        quizTopic: quizData?.quizTopic,
        quizAdmin: quizData?.quizAdmin,
      });
      setQuestions(quizData?.quizQuestions);
    }
  }, [data]);

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>{error.message}</div>;

  const showModal = (questionId) => {
    setQuestionId(questionId);
    window.delete_question_modal.showModal();
  };

  return (
    <>
      <div className="flex flex-col h-[100vh]">
        <BuilderHeader />
        <div className="mt-[80px] w-full flex-1 flex h-[calc(100vh-105px)]">
          {!showPreview && (
            <div className="flex-1 overflow-y-auto">
              <BuilderArea
                setShowPreview={setShowPreview}
                showModal={showModal}
              />
            </div>
          )}
          {/* Separator */}
          <div className="w-3 h-full bg-base-300 border-x-[0.1px] border-x-gray-700 border-opacity-60 hidden lg:block" />

          <div
            id="preview-wrapper"
            className={`flex-1 overflow-y-auto hidden lg:block ${
              showPreview && "!block"
            }`}
          >
            <QuizDisplay setShowPreview={setShowPreview} />
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
      <dialog id="delete_question_modal" className="modal">
        <form method="dialog" className="modal-box">
          <h3 className="font-bold text-lg">Delete Question!</h3>
          <p className="py-4">
            Are you sure you want to Delere the Question ? You Cannot Undo this!
          </p>
          <div className="space-x-4 mt-3">
            <button
              onClick={() => deleteQuestionMutation.mutate()}
              className="btn btn-primary"
            >
              Delete
            </button>
            <button className="btn">Cancel</button>
          </div>
        </form>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}
