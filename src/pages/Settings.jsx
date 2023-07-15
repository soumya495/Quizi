import DetailsUpdate from "../components/core/settings/DetailsUpdate";
import ImageUpload from "../components/core/settings/ImageUpload";

export default function Settings() {
  return (
    <div className="container mx-auto my-12 px-4">
      <h1 className="text-3xl md:text-5xl font-extrabold mb-20 text-center">
        Settings
      </h1>
      <div className="flex items-stretch justify-center flex-wrap gap-x-10 gap-y-10">
        {/* Image Upload Section */}
        <ImageUpload />
        {/* User Details Section */}
        <DetailsUpdate />
        {/* Password Change Section */}
      </div>
    </div>
  );
}
