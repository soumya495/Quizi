import { FiClock, FiUser } from "react-icons/fi";
import { MdOutlineSubject } from "react-icons/md";
import { useQuiz } from "../../../store/useQuiz";
import { convertToHoursMinutesSeconds } from "../../../services/helpers";

export default function QuizDetails() {
  const { quizDetails } = useQuiz();

  const msToTime = (duration) => {
    const { hours, minutes, seconds } = convertToHoursMinutesSeconds(duration);
    let str = "";
    if (hours) {
      str += `${hours} h `;
    }
    if (minutes) {
      str += `${minutes} m `;
    }
    if (seconds) {
      str += `${seconds} s`;
    }

    if (!str) {
      str = "0 s";
    }

    return str;
  };

  return (
    <div
      id="quiz-details-card"
      className="bg-neutral my-10 rounded-md px-10 py-10 border-t-8 border-t-primary"
    >
      <p className="text-2xl font-bold">
        {quizDetails?.quizName ? quizDetails?.quizName : "Quiz Name"}
      </p>
      <p className="text-base mt-3 mb-5">
        {quizDetails?.quizDescription
          ? quizDetails?.quizDescription
          : "A small description about the quiz"}
      </p>
      <div className="flex items-center gap-4 flex-wrap">
        <p className="text-sm flex items-center gap-x-2" title="Author">
          <FiUser className="text-lg" />
          <span className="font-bold">
            {quizDetails?.quizAdmin
              ? `${quizDetails?.quizAdmin?.firstName} ${quizDetails?.quizAdmin?.lastName}`
              : ""}
          </span>
        </p>
        <p className="text-sm flex items-center gap-x-2" title="Duration">
          <FiClock className="text-lg" />
          <span className="font-bold">
            {msToTime(quizDetails?.quizDuration)}
          </span>
        </p>
        <p className="text-sm flex items-center gap-x-2" title="Topic">
          <MdOutlineSubject className="text-lg" />
          <span className="font-bold">
            {quizDetails?.quizTopic ? quizDetails?.quizTopic : "topic"}
          </span>
        </p>
      </div>
    </div>
  );
}
