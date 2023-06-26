import cloudinary from "cloudinary";

export default async function uploadImageToCloudinary(file) {
  const options = { folder: process.env.FOLDER_NAME };
  options.resource_type = "auto";
  return await cloudinary.v2.uploader.upload(file.tempFilePath, options);
}
