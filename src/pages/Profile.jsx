import { Link } from "react-router-dom";
import ImageAvatar from "../components/common/ImageAvatar";
import { useProfile } from "../services/queryFunctions/profile";

// Stat Card Component
function StatCard({ title, stat, link = "/" }) {
  return (
    <div className="w-52 card md:h-full bg-neutral hover:bg-opacity-70 hover:rounded-xl transition-all duration-200 text-neutral-content">
      <Link to={link}>
        <div className="card-body items-center text-center">
          <p className="font-extrabold text-primary text-5xl">{stat}</p>
          <h2 className="mt-4 font-medium">{title}</h2>
        </div>
      </Link>
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
    <div className="container mx-auto min-h-[85vh] grid place-content-center py-10">
      <div className="flex gap-8 flex-col lg:flex-row items-center lg:items-stretch">
        {/* Profile Card */}
        <div className="card w-72 md:w-96 bg-neutral text-neutral-content">
          <div className="card-body items-center text-center">
            <div className="w-48 h-48 rounded-full overflow-hidden">
              <ImageAvatar userData={userData} />
            </div>
            <h2 className="card-title mt-10">{`${userData?.firstName} ${userData?.lastName}`}</h2>
            <p className="mb-4">{userData?.email}</p>
          </div>
        </div>
        {/* Stats Card Container */}
        <div className="flex flex-col gap-y-6">
          {/* Stats Card Quizzes */}
          <div className="h-1/2 flex items-center justify-center gap-6 flex-wrap">
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
          {/* Stats Card Groups */}
          <div className="h-1/2 flex items-center justify-center gap-6 flex-wrap">
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
