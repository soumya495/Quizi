import { useEffect } from "react";
import { BsChevronDown } from "react-icons/bs";
import { useSearchParams } from "react-router-dom";
import { scrollToEl } from "../../services/helpers";
import { useQuiz } from "../../store/useQuiz";

export default function Accordion({ title, children, elId }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { previewQuestion } = useQuiz();

  // Help open the add new question accordion on page load
  // useEffect(() => {
  //   if (
  //     !searchParams.get("open") ||
  //     searchParams.get("open") === "preview-accordion"
  //   ) {
  //     searchParams.set("open", "preview-accordion");
  //     setSearchParams(searchParams);
  //   }
  // }, []);

  useEffect(() => {
    if (searchParams.get("open") === elId) {
      searchParams.set("open", elId);
      setSearchParams(searchParams);

      if (elId !== "preview-accordion") {
        const questionCardId = `card-${elId.split("-")?.[0]}`;
        scrollToEl(questionCardId, "preview-wrapper");
      } else {
        document.getElementById("preview-card")?.removeAttribute("hidden");
        scrollToEl("preview-card", "preview-wrapper");
      }
    }
  }, [searchParams]);

  return (
    <details
      open={searchParams.get("open") === elId}
      onToggle={(e) => {
        if (e.target.open) {
          searchParams.set("open", elId);
          setSearchParams(searchParams);
        } else {
          searchParams.delete("open");
          setSearchParams(searchParams);
          if (!Object.keys(previewQuestion).length > 0)
            document
              .getElementById("preview-card")
              ?.setAttribute("hidden", true);
        }
      }}
      className={`rounded-xl overflow-hidden transition-all duration-200`}
    >
      <summary className="px-10 py-3 bg-neutral cursor-pointer flex items-center justify-between font-semibold">
        {title}
        <BsChevronDown className={`inline-block text-xl`} />
      </summary>
      {searchParams.get("open") === elId && (
        <div className="bg-neutral bg-opacity-30 px-6 py-4 rounded-b-xl">
          {children}
        </div>
      )}
    </details>
  );
}
