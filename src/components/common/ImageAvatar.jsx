import { useProfile } from "../../services/queryFunctions/profile";

export default function ImageAvatar({ preview }) {
  const { data } = useProfile();

  const userData = data?.data?.data?.user;

  const dicebearapi = "https://api.dicebear.com/6.x/initials/svg";

  let src;

  if (preview) {
    src = preview;
  } else if (userData?.profileImage) {
    src = userData?.profileImage?.secure_url;
  } else {
    src = `${dicebearapi}?seed=${userData?.firstName} ${userData?.lastName}&backgroundColor=00bf63&textColor=000000`;
  }

  return (
    <img
      src={src}
      className="object-cover w-[inherit] h-[inherit]"
      alt="user image"
    />
  );
}
