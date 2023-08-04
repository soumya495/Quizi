import { useEffect } from "react";
import { BsChevronDown } from "react-icons/bs";
import { useSearchParams } from "react-router-dom";

export default function Accordion({ title, children, elId }) {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (!searchParams.get("open")) {
      searchParams.set("open", "preview-accordion");
      setSearchParams(searchParams);
    }
  }, []);

  useEffect(() => {
    if (searchParams.get("open") === elId) {
      searchParams.set("open", elId);
      setSearchParams(searchParams);
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
        }
      }}
      className={`rounded-xl overflow-hidden transition-all duration-200`}
    >
      <summary className="px-10 py-3 bg-neutral cursor-pointer flex items-center justify-between font-semibold">
        {title}
        <BsChevronDown className={`inline-block text-xl`} />
      </summary>
      <div className="bg-neutral bg-opacity-30 px-6 py-4 rounded-b-xl">
        {children}
      </div>
    </details>
  );
}
