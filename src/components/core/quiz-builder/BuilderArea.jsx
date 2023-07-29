import { useState } from "react";
import CreateQuizForm from "../create-quiz/CreateQuizForm";
import { BsChevronDown } from "react-icons/bs";
import { useQuizDetails } from "../../../services/queryFunctions/quiz";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

function Accordion({ title, children, index, open, setCurrentIndex }) {
  return (
    <details
      open={open[index]}
      className={`rounded-xl overflow-hidden transition-all duration-200`}
    >
      <summary
        onClick={() => setCurrentIndex((prev) => (prev === index ? -1 : index))}
        className="px-10 py-3 bg-neutral cursor-pointer flex items-center justify-between font-semibold"
      >
        {title}
        <BsChevronDown
          className={`inline-block text-xl ${
            open[index] ? "rotate-0" : "rotate-180"
          } transition-all duration-200`}
        />
      </summary>
      <div className="bg-neutral bg-opacity-30 px-6 py-4 rounded-b-xl">
        {children}
      </div>
    </details>
  );
}

export default function BuilderArea({ quizData, setShowPreview }) {
  const { id: quizId } = useParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [open, setOpen] = useState([true, false, false]);
  const { refetch: refetchQuizDetails } = useQuizDetails(quizId);

  useEffect(() => {
    setOpen((prev) => prev.map((_, i) => i === currentIndex));
  }, [currentIndex]);

  return (
    <div className="w-11/12 max-w-[600px] mx-auto flex-1 py-10 space-y-4">
      <button
        onClick={() => setShowPreview(true)}
        className="btn btn-ghost btn-outline lg:hidden mb-4"
      >
        Show Preview
      </button>
      <Accordion
        title="Quiz Details"
        index={0}
        open={open}
        setCurrentIndex={setCurrentIndex}
      >
        <CreateQuizForm
          refetch={() => refetchQuizDetails()}
          preFill={{
            quizId: quizData?._id,
            quizName: quizData?.quizName,
            quizDescription: quizData?.quizDescription,
            quizDuration: quizData?.quizDuration,
            quizTopic: quizData?.quizTopic,
          }}
        />
      </Accordion>
      <Accordion
        title="Quiz Questions"
        index={1}
        open={open}
        setCurrentIndex={setCurrentIndex}
      >
        Update Quiz Questions
      </Accordion>
      <Accordion
        title="Quiz Settings"
        index={2}
        open={open}
        setCurrentIndex={setCurrentIndex}
      >
        Update Quiz Settings
      </Accordion>
    </div>
  );
}
