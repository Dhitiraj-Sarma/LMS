import { v2 } from "cloudinary";

v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const uploadMediaToCloudinary = async (filePath) => {
  try {
    const result = await v2.uploader.upload(filePath, {
      resource_type: "auto",
    });

    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Error uploading to cloudinary");
  }
};

const deleteMediaFromCloudinary = async (publicId) => {
  try {
    await v2.uploader.destroy(publicId, {
      resource_type: "auto",
    });
  } catch (error) {
    console.log(error);
    throw new Error("Error deleting from cloudinary");
  }
};

export { uploadMediaToCloudinary, deleteMediaFromCloudinary };
