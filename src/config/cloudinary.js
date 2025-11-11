import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

// Ensure dotenv is loaded (in case this module is imported early)
dotenv.config();

// Debug: log environment variables (remove in production)
console.log("Cloudinary Config Debug:");
console.log(
  "- CLOUDINARY_CLOUD_NAME:",
  process.env.CLOUDINARY_CLOUD_NAME ? "✓ Set" : "✗ Missing"
);
console.log(
  "- CLOUDINARY_API_KEY:",
  process.env.CLOUDINARY_API_KEY ? "✓ Set" : "✗ Missing"
);
console.log(
  "- CLOUDINARY_API_SECRET:",
  process.env.CLOUDINARY_API_SECRET ? "✓ Set" : "✗ Missing"
);

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Verify configuration was successful
if (!cloudinary.config().cloud_name || !cloudinary.config().api_key) {
  console.error("⚠️ Cloudinary configuration failed - missing credentials!");
  console.error(
    "Make sure CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET are set in .env"
  );
} else {
  console.log("✅ Cloudinary configured successfully!");
}

// Helper function to upload file buffer to Cloudinary
export const uploadToCloudinary = async (
  fileBuffer,
  folder = "pakair/reports",
  mimeType = "image"
) => {
  return new Promise((resolve, reject) => {
    const resourceType = mimeType.startsWith("video/") ? "video" : "image";

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: resourceType,
        transformation:
          resourceType === "image"
            ? [
                { width: 1200, height: 1200, crop: "limit" },
                { quality: "auto" },
              ]
            : undefined,
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
    uploadStream.end(fileBuffer);
  });
};

// Helper function to delete from Cloudinary
export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    throw error;
  }
};

export { cloudinary };
