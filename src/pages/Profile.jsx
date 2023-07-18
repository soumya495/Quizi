import ImageAvatar from "../components/common/ImageAvatar";
import { useProfile } from "../services/queryFunctions/profile";

function nFormatter(num, digits) {
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "k" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "G" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  var item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      return num >= item.value;
    });
  return item
    ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol
    : "0";
}

// Stat Card Component
function StatCard({ title, stat }) {
  const dispStat = String(nFormatter(stat));

  return (
    <div className="bg-neutral rounded-2xl w-40 h-full grid place-content-center">
      <p
        className={`${
          dispStat.length >= 4 ? "text-5xl" : "text-6xl"
        } text-primary font-extrabold text-center break-all`}
      >
        {dispStat}
      </p>
      <p className="text-center text-sm mt-2 font-semibold">{title}</p>
    </div>
  );
}

export default function Profile() {
  const { data, isLoading, error } = useProfile();

  if (isLoading) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  console.log("profile data of user", data);

  const userData = data?.data?.data?.user;

  return (
    <div className="w-full min-h-screen grid place-content-center py-10">
      <div className="flex items-center flex-col xl:flex-row gap-6 justify-center">
        {/* Profile Card */}
        <div className="bg-neutral w-[344px] xl:w-96 rounded-2xl p-8 space-y-8">
          <div className="w-48 h-48 overflow-hidden rounded-full mx-auto">
            <ImageAvatar userData={userData} />
          </div>
          <div>
            <p className="text-2xl font-semibold text-center">
              {userData?.firstName} {userData?.lastName}
            </p>
            <p className="text-center text-base mt-2">{userData?.email}</p>
          </div>
        </div>
        {/* Stats */}
        <div className="h-[352px] xl:h-full flex flex-col gap-y-6">
          <div className="h-1/2 flex gap-6">
            <StatCard
              title="Quizzes created"
              stat={userData?.createdQuizzes?.length}
              link="/created-quizzes"
            />
            <StatCard
              title="Quizzes taken"
              stat={
                userData?.attemptedQuizzes?.length +
                userData?.submittedQuizzes?.length
              }
            />
          </div>
          <div className="h-1/2 flex gap-6">
            <StatCard
              title="Groups joined"
              stat={userData?.attemptedQuizzes?.length}
            />
            <StatCard
              title="Groups created"
              stat={userData?.createdGroups?.length}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
