import { v2 as cloudinary } from 'cloudinary';

const CLOUDINARY_URL = process.env.CLOUDINARY_URL;

if (CLOUDINARY_URL) {
  cloudinary.config({
    cloudinary_url: CLOUDINARY_URL,
  });
}

export async function uploadImage(file: File): Promise<string | null> {
  if (!CLOUDINARY_URL) {
    console.warn('cloudinary.skip: CLOUDINARY_URL not configured');
    return null;
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'sellsnap/products',
          resource_type: 'image',
          transformation: [{ width: 1200, height: 1200, crop: 'limit', quality: 'auto' }],
        },
        (error, result) => {
          if (error) {
            console.error('cloudinary.upload.failed', { error });
            reject(error);
            return;
          }
          resolve(result?.secure_url ?? null);
        }
      );

      uploadStream.end(buffer);
    });
  } catch (error) {
    console.error('cloudinary.upload.error', { error });
    return null;
  }
}
