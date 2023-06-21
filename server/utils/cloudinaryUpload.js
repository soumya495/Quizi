import cloudinary from "cloudinary";

export default async function uploadImageToCloudinary(
  file,
  folder,
  height,
  quality
) {
  const options = { folder };
  if (height) {
    options.height = height;
  }
  if (quality) {
    options.quality = quality;
  }
  options.resource_type = "auto";
  console.log("OPTIONS", options);
  return await cloudinary.v2.uploader.upload(file.tempFilePath, options);
}
