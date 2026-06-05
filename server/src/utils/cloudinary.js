import { v2 as cloudinary } from "cloudinary";
import fs from "fs";


if (
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  throw new Error("Cloudinary environment variables are missing");
}


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadOnCloudinary = async (localFilePath) => {
  try {

    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: "expenseFlow"
    });

    if (fs.existsSync(localFilePath)) {
     await fs.promises.unlink(localFilePath);
    }

    return response;

  } catch (error) {

    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    console.error("Error in Cloudinary:", error);
    return null;
  }
};

export const deleteFromCloudinary = async (publicId) => {
  try {

    if (!publicId) return null;

    const response = await cloudinary.uploader.destroy(publicId);

    return response;

  } catch (error) {

    console.log("Error while deleting from cloudinary:", error);
    return null;

  }
};