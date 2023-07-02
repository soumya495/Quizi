import { v2 as cloudinary } from "cloudinary";

export async function uploadImageToCloudinary(file, folderName) {
  const options = { folder: `${process.env.FOLDER_NAME}/${folderName}` };
  options.resource_type = "auto";
  return await cloudinary.uploader.upload(file.tempFilePath, options);
}

export async function deleteImageFromCloudinary(publicId) {
  return await cloudinary.uploader.destroy(publicId);
}
