import { useProfile } from "../services/queryFunctions/profile";

export default function Profile() {
  const { data, isLoading, error } = useProfile();

  if (isLoading) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  console.log("profile data of user", data);

  return (
    <div>
      <h1>Profile</h1>
    </div>
  );
}
