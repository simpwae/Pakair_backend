import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'your-cloud-name',
  api_key: process.env.CLOUDINARY_API_KEY || 'your-api-key',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'your-api-secret',
});

// Helper function to upload file buffer to Cloudinary
export const uploadToCloudinary = async (fileBuffer, folder = 'pakair/reports', mimeType = 'image') => {
  return new Promise((resolve, reject) => {
    const resourceType = mimeType.startsWith('video/') ? 'video' : 'image';
    
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: resourceType,
        transformation: resourceType === 'image' ? [
          { width: 1200, height: 1200, crop: 'limit' },
          { quality: 'auto' },
        ] : undefined,
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

