import { useSearchParams } from "react-router-dom";

export default function BuilderTabs() {
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <div className="tabs tabs-boxed bg-neutral max-w-max mx-auto mb-10">
      <button
        onClick={() => {
          searchParams.set("tab", "summary");
          setSearchParams(searchParams);
        }}
        className={`tab ${
          searchParams.get("tab") === "summary" && "tab-active !bg-primary"
        }`}
      >
        Summary
      </button>
      <button
        onClick={() => {
          searchParams.set("tab", "questions");
          setSearchParams(searchParams);
        }}
        className={`tab ${
          searchParams.get("tab") === "questions" && "tab-active !bg-primary"
        }`}
      >
        Questions
      </button>
      <button
        onClick={() => {
          searchParams.set("tab", "settings");
          setSearchParams(searchParams);
        }}
        className={`tab ${
          searchParams.get("tab") === "settings" && "tab-active !bg-primary"
        }`}
      >
        Settings
      </button>
    </div>
  );
}
