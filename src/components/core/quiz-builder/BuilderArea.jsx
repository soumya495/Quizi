import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuizDetails } from "../../../services/queryFunctions/quiz";
import CreateQuizForm from "../create-quiz/CreateQuizForm";
import AddQuizQuestion from "./AddQuizQuestion";
import Accordion from "../../common/Accordion";
import BuilderTabs from "./BuilderTabs";
import { useQuiz } from "../../../store/useQuiz";
import { truncate } from "../../../services/helpers";
import { useSearchParams } from "react-router-dom";

export default function BuilderArea({ setShowPreview, showModal }) {
  const [open, setOpen] = useState("preview-accordion");
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    quizDetails,
    questions: quizQuestions,
    currentPage,
    totalPages,
  } = useQuiz();

  const { id: quizId } = useParams();
  const { data, refetch: refetchQuizDetails } = useQuizDetails(quizId);
  const originalQuizData = data?.data?.data?.quiz;

  return (
    <div className="w-11/12 max-w-[600px] mx-auto flex-1 my-10 space-y-4">
      <BuilderTabs />
      <button
        onClick={() => setShowPreview(true)}
        className="btn btn-ghost btn-outline lg:hidden my-6"
      >
        Show Preview
      </button>
      {searchParams.get("tab") === "summary" && (
        <div className="bg-neutral bg-opacity-30 p-6 rounded-xl">
          <CreateQuizForm
            refetch={() => refetchQuizDetails()}
            originalQuizData={originalQuizData}
            preFill={quizDetails}
          />
        </div>
      )}
      {searchParams.get("tab") === "questions" && (
        <div>
          <Accordion
            title="Add New Question"
            elId="preview-accordion"
            open={open}
            setOpen={setOpen}
          >
            <AddQuizQuestion />
          </Accordion>
          <div className="flex items-center space-x-4 mt-6">
            <p className="text-lg text-neutral-300">Quiz Questions</p>
            <div className="h-[0.75px] flex-1 bg-neutral" />
          </div>
          {totalPages > 1 ? (
            <div className="flex justify-between items-center py-2 px-6 rounded-xl bg-neutral mt-6">
              <p className="text-xl">
                Page <span className="font-bold">{currentPage}</span> of{" "}
                <span className="font-bold">{totalPages}</span>
              </p>
              <div>
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
            </div>
          ) : null}
          <div className="mt-6 flex flex-col space-y-6">
            {quizQuestions?.length > 0 ? (
              <>
                {quizQuestions?.map((question, index) => {
                  return (
                    <Accordion
                      key={index}
                      title={
                        (currentPage - 1) * 10 +
                        index +
                        1 +
                        ". " +
                        truncate(question?.question, 35)
                      }
                      elId={`${question?._id}-accordion`}
                      open={open}
                      setOpen={setOpen}
                    >
                      <AddQuizQuestion
                        showModal={showModal}
                        preFill={question}
                      />
                    </Accordion>
                  );
                })}
              </>
            ) : (
              <div className="bg-neutral bg-opacity-30 p-6 px-10 rounded-xl">
                <p className="text-lg text-neutral-300">
                  Add a new question to get started
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
