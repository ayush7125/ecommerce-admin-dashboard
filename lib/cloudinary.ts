import { v2 as cloudinary } from 'cloudinary';

// Lazy configuration - only configure when actually used
function configureCloudinary() {
  const cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
  const api_key = process.env.CLOUDINARY_API_KEY;
  const api_secret = process.env.CLOUDINARY_API_SECRET;

  if (!cloud_name || !api_key || !api_secret) {
    throw new Error('Please define CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET environment variables');
  }

  cloudinary.config({
    cloud_name,
    api_key,
    api_secret,
  });
}

export default cloudinary;

export const uploadImage = async (buffer: Buffer): Promise<string> => {
  configureCloudinary();
  
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          resource_type: 'image',
          folder: 'ecommerce-products',
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else if (result) {
            resolve(result.secure_url);
          } else {
            reject(new Error('Upload failed'));
          }
        }
      )
      .end(buffer);
  });
};

export const deleteImage = async (imageUrl: string): Promise<void> => {
  configureCloudinary();
  const publicId = imageUrl.split('/').slice(-2).join('/').split('.')[0];
  await cloudinary.uploader.destroy(`ecommerce-products/${publicId}`);
};

