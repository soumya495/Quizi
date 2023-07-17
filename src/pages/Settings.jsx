import DetailsUpdate from "../components/core/settings/DetailsUpdate";
import ImageUpload from "../components/core/settings/ImageUpload";

export default function Settings() {
  return (
    <div className="w-full min-h-screen grid place-content-center py-10">
      <div className="flex flex-col items-center justify-center px-4 gap-10">
        {/* Image Upload Section */}
        <ImageUpload />
        {/* User Details Section */}
        <DetailsUpdate />
        {/* Password Change Section */}
      </div>
    </div>
  );
}
