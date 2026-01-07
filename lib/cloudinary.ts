import { v2 as cloudinary } from 'cloudinary';

// Lazy configuration - only configure when actually used
function configureCloudinary() {
  const cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
  const api_key = process.env.CLOUDINARY_API_KEY;
  const api_secret = process.env.CLOUDINARY_API_SECRET;

  if (!cloud_name || !api_key || !api_secret) {
    throw new Error('Please define CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET environment variables');
  }

  // Validate that values are not empty strings
  if (cloud_name.trim() === '' || api_key.trim() === '' || api_secret.trim() === '') {
    throw new Error('Cloudinary environment variables cannot be empty');
  }

  try {
    cloudinary.config({
      cloud_name: cloud_name.trim(),
      api_key: api_key.trim(),
      api_secret: api_secret.trim(),
    });
  } catch (configError) {
    console.error('Cloudinary config error:', configError);
    throw new Error('Failed to configure Cloudinary. Please check your credentials.');
  }
}

export default cloudinary;

export const uploadImage = async (buffer: Buffer): Promise<string> => {
  try {
    configureCloudinary();
  } catch (configError) {
    console.error('Cloudinary configuration error:', configError);
    const errorMessage = configError instanceof Error ? configError.message : 'Cloudinary is not properly configured';
    throw new Error(errorMessage);
  }
  
  return new Promise((resolve, reject) => {
    try {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          folder: 'ecommerce-products',
          timeout: 60000, // 60 second timeout
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload stream error:', error);
            
            // Handle specific Cloudinary error codes
            if (error.http_code === 401) {
              reject(new Error('Cloudinary authentication failed. Please check your API key and secret.'));
            } else if (error.http_code === 400) {
              reject(new Error(`Invalid request to Cloudinary: ${error.message || 'Bad request'}`));
            } else if (error.http_code === 500) {
              reject(new Error('Cloudinary server error. This may be due to invalid credentials or account issues. Please verify your Cloudinary account and credentials.'));
            } else if (error.message && error.message.includes('invalid JSON')) {
              reject(new Error('Cloudinary returned an invalid response. Please verify your Cloudinary credentials and account status.'));
            } else {
              reject(new Error(error.message || `Failed to upload image to Cloudinary (HTTP ${error.http_code || 'unknown'})`));
            }
          } else if (result && result.secure_url) {
            resolve(result.secure_url);
          } else {
            console.error('Cloudinary upload returned no result:', result);
            reject(new Error('Upload failed: No result from Cloudinary'));
          }
        }
      );
      
      uploadStream.on('error', (streamError: Error) => {
        console.error('Upload stream error event:', streamError);
        reject(new Error(streamError.message || 'Stream error during upload'));
      });
      
      uploadStream.on('end', () => {
        // Stream ended - callback will handle result
      });
      
      uploadStream.end(buffer);
    } catch (streamError) {
      console.error('Error creating upload stream:', streamError);
      const errorMessage = streamError instanceof Error ? streamError.message : 'Failed to create upload stream';
      reject(new Error(errorMessage));
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


