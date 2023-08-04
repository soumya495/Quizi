/* eslint-disable no-unsafe-optional-chaining */
import { useCreatedQuizzes } from "../../../services/queryFunctions/quiz";
import { useNavigate } from "react-router-dom";
import { IoMdSearch } from "react-icons/io";

export default function DisplayCreatedQuizzes() {
  const { data, isLoading, error } = useCreatedQuizzes();
  const navigate = useNavigate();

  if (isLoading) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  const { quizzes, totalPages, currentPage, totalQuizzes } = data?.data?.data;

  return (
    <>
      {quizzes.length > 0 && (
        <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
          <div className="relative w-full max-w-md">
            <input
              className="input w-full border-2 border-neutral placeholder:text-sm pl-10"
              placeholder="Search using name, topic, etc"
            />
            <IoMdSearch className="absolute top-1/2 -translate-y-1/2 left-4" />
          </div>
        </div>
      )}
      <div className="w-full bg-neutral overflow-x-auto p-6 rounded-xl min-h-[312px]">
        {quizzes.length ? (
          <table className="table min-w-[900px] md:min-w-max">
            {/* head */}
            <thead>
              <tr>
                <th>Name</th>
                <th>Topic</th>
                <th>Status</th>
                <th>Attempted By</th>
                <th>Submitted By</th>
              </tr>
            </thead>
            <tbody>
              {/* rows */}
              {quizzes.map((quiz) => (
                <tr
                  key={quiz._id}
                  onClick={() =>
                    navigate(`/quiz-builder/${quiz._id}?tab=questions`)
                  }
                  className="cursor-pointer hover:bg-opacity-40 hover:bg-base-100 transition-all duration-200"
                >
                  <td>{quiz.quizName}</td>
                  <td>{quiz.quizTopic}</td>
                  <td>
                    <div
                      className={`badge ${
                        quiz.quizStatus === "Draft"
                          ? "badge-warning"
                          : "badge-success"
                      }`}
                    >
                      {quiz.quizStatus}
                    </div>
                  </td>
                  <td>{quiz.attemptedBy.length}</td>
                  <td>{quiz.submittedBy.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center space-y-2 py-20">
            <p className="text-2xl font-semibold">No quizzes created yet!</p>
            <p className="text-sm">
              Create a quiz by clicking on the button above.
            </p>
          </div>
        )}
      </div>
      {quizzes.length > 0 && (
        <div className="mt-3 flex items-center justify-between flex-wrap gap-4">
          <p className="text-sm">
            Showing {quizzes.length} of {totalQuizzes} quizzes | Page{" "}
            {currentPage} of {totalPages}
          </p>
          <div className="flex items-center justify-center gap-x-2">
            <button
              className={`btn btn-sm ${
                currentPage === 1 ? "btn-disabled" : "btn-primary"
              }`}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            <button
              className={`btn btn-sm ${
                currentPage === totalPages ? "btn-disabled" : "btn-primary"
              }`}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </>
  );
}
