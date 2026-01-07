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
  try {
    configureCloudinary();
  } catch (configError) {
    console.error('Cloudinary configuration error:', configError);
    throw new Error('Cloudinary is not properly configured. Please check your environment variables.');
  }
  
  return new Promise((resolve, reject) => {
    try {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          folder: 'ecommerce-products',
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload stream error:', error);
            reject(new Error(error.message || 'Failed to upload image to Cloudinary'));
          } else if (result && result.secure_url) {
            resolve(result.secure_url);
          } else {
            console.error('Cloudinary upload returned no result');
            reject(new Error('Upload failed: No result from Cloudinary'));
          }
        }
      );
      
      uploadStream.on('error', (streamError) => {
        console.error('Upload stream error event:', streamError);
        reject(new Error(streamError.message || 'Stream error during upload'));
      });
      
      uploadStream.end(buffer);
    } catch (streamError) {
      console.error('Error creating upload stream:', streamError);
      reject(new Error('Failed to create upload stream'));
    }
  });
};

export const deleteImage = async (imageUrl: string): Promise<void> => {
  try {
    configureCloudinary();
    const publicId = imageUrl.split('/').slice(-2).join('/').split('.')[0];
    await cloudinary.uploader.destroy(`ecommerce-products/${publicId}`);
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    // Don't throw - image deletion failure shouldn't break the flow
    // Log the error but continue
  }
};


