import { v2 as cloudinary } from "cloudinary";

// To Read, Write, Delete file (Manaege File)
import fs from "fs";

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET_KEY, // Click 'View API Keys' above to copy your API secret
});

// This is a utility to upload any kind of file to cloudinary
const uploadToCloudinary = async (localFilePath) => {
  if (!localFilePath) return; // Check of the local path exist or not

  try {
    const uploadedResult = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    console.log(
      "File has uploaded to cloudinary successfully: ",
      uploadedResult // Print the url
    );

    fs.unlinkSync(localFilePath);
    return uploadedResult; // Retirn the result
  } catch (error) {
    fs.unlinkSync(localFilePath); // remove the file form the server

    console.log("Error uplaoding the file to cloudinary: ", error);

    return null;
  }
};

const deleteFromCloudinary = async (image) => {
  const { public_id, resource_type } = image;

  if (!public_id) console.log("No Image is Provided!");

  try {
    const result = await cloudinary.uploader.destroy(public_id, {
      resource_type: resource_type || "image",
    });

    console.log("Image deleted from Cloudinary successfully!");
    return result;
  } catch (error) {
    console.error("Error deleting file form Cloudinary: ", error);
    return null;
  }
};

export { uploadToCloudinary, deleteFromCloudinary };
