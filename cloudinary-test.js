const cloudinary = require('cloudinary').v2;

// Configure via environment variables only — never hardcode credentials here.
// Set CLOUDINARY_URL=cloudinary://<api_key>:<api_secret>@<cloud_name> in your .env file.
cloudinary.config({
  cloudinary_url: process.env.CLOUDINARY_URL,
});

async function runCloudinaryTest() {
  if (!process.env.CLOUDINARY_URL) {
    console.error('ERROR: CLOUDINARY_URL environment variable is not set.');
    console.error('Add it to your .env file and run again.');
    process.exit(1);
  }

  try {
    console.log('Uploading sample image...');
    const uploadResult = await cloudinary.uploader.upload(
      'https://res.cloudinary.com/demo/image/upload/sample.jpg',
      { public_id: 'sample_test_upload' }
    );

    console.log('\n--- Upload Results ---');
    console.log(`Secure URL: ${uploadResult.secure_url}`);
    console.log(`Public ID: ${uploadResult.public_id}`);
    console.log(`Width: ${uploadResult.width}px`);
    console.log(`Height: ${uploadResult.height}px`);
    console.log(`Format: ${uploadResult.format}`);
    console.log(`File size: ${uploadResult.bytes} bytes`);

    const transformedUrl = cloudinary.url(uploadResult.public_id, {
      fetch_format: 'auto',
      quality: 'auto',
    });

    console.log('\n--- Transformation ---');
    console.log(`Transformed URL: ${transformedUrl}`);
  } catch (error) {
    console.error('Error during Cloudinary operation:', error);
  }
}

runCloudinaryTest();
