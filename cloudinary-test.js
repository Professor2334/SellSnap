const cloudinary = require('cloudinary').v2;

// 1. Configure Cloudinary
cloudinary.config({
  cloud_name: 'dyohfnehv',
  api_key: '731172843869739',
  api_secret: 'ZH3aiAnsUyqGz_DC75Q1ieDBiwQ'
});

async function runCloudinaryTest() {
  try {
    // 2. Upload an image
    console.log('Uploading sample image...');
    const uploadResult = await cloudinary.uploader.upload(
      'https://res.cloudinary.com/demo/image/upload/sample.jpg',
      { public_id: 'sample_test_upload' }
    );
    
    console.log('\n--- Upload Results ---');
    console.log(`Secure URL: ${uploadResult.secure_url}`);
    console.log(`Public ID: ${uploadResult.public_id}`);

    // 3. Get image details
    console.log('\n--- Image Metadata ---');
    console.log(`Width: ${uploadResult.width}px`);
    console.log(`Height: ${uploadResult.height}px`);
    console.log(`Format: ${uploadResult.format}`);
    console.log(`File size: ${uploadResult.bytes} bytes`);

    // 4. Transform the image
    // f_auto: Automatically converts the image to the most efficient format based on the requesting browser
    // q_auto: Automatically adjusts the compression quality to optimize file size without visible degradation
    const transformedUrl = cloudinary.url(uploadResult.public_id, {
      fetch_format: 'auto',
      quality: 'auto'
    });

    console.log('\n--- Transformation Success ---');
    console.log('Done! Click link below to see optimized version of the image. Check the size and the format.');
    console.log(`Transformed URL: ${transformedUrl}`);

  } catch (error) {
    console.error('Error during Cloudinary operation:', error);
  }
}

runCloudinaryTest();
