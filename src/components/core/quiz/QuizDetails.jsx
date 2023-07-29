import { FiClock, FiUser } from "react-icons/fi";
import { MdOutlineSubject } from "react-icons/md";

function msToTime(duration) {
  var seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  return hours + "h " + minutes + "m " + seconds + "s";
}

export default function QuizDetails({
  quizName,
  quizDescription,
  quizAuthor,
  quizDuration,
  quizTopic,
}) {
  return (
    <div className="bg-neutral my-10 rounded-md px-10 py-6 border-t-8 border-t-primary">
      <p className="text-2xl font-bold">{quizName}</p>
      <p className="text-base mt-3 mb-5">{quizDescription}</p>
      <div className="flex items-center gap-4 flex-wrap">
        <p className="text-sm flex items-center gap-x-2" title="Author">
          <FiUser className="text-lg" />
          <span className="font-bold">{quizAuthor}</span>
        </p>
        <p className="text-sm flex items-center gap-x-2" title="Duration">
          <FiClock className="text-lg" />
          <span className="font-bold">{msToTime(quizDuration)}</span>
        </p>
        <p className="text-sm flex items-center gap-x-2" title="Topic">
          <MdOutlineSubject className="text-lg" />
          <span className="font-bold">{quizTopic}</span>
        </p>
      </div>
    </div>
  );
}
