import ImageAvatar from "../components/common/ImageAvatar";
import { useProfile } from "../services/queryFunctions/profile";

export default function Profile() {
  const { data, isLoading, error } = useProfile();

  if (isLoading) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  console.log("profile data of user", data);

  const userData = data?.data?.data?.user;

  return (
    <div className="container mx-auto my-12">
      <div className="card w-96 bg-neutral text-neutral-content mx-auto">
        <div className="card-body items-center text-center">
          <div className="w-48 h-48 rounded-full overflow-hidden">
            <ImageAvatar userData={userData} />
          </div>
          <h2 className="card-title mt-10">{`${userData?.firstName} ${userData?.lastName}`}</h2>
          <p className="mb-4">{userData?.email}</p>
          <div className="card-actions justify-end"></div>
        </div>
      </div>
    </div>
  );
}
