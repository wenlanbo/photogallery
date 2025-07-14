require('dotenv').config();
const { put } = require('@vercel/blob');
const fs = require('fs');
const path = require('path');

// Check if Vercel Blob is configured
if (!process.env.BLOB_READ_WRITE_TOKEN) {
  console.error('❌ Vercel Blob not configured!');
  console.log('Please set up your BLOB_READ_WRITE_TOKEN environment variable.');
  console.log('See VERCEL_BLOB_SETUP.md for instructions.');
  process.exit(1);
}

const imagesDir = './images';

// Check if images directory exists
if (!fs.existsSync(imagesDir)) {
  console.error(`❌ Images directory not found: ${imagesDir}`);
  process.exit(1);
}

// Get all image files
const imageFiles = fs.readdirSync(imagesDir).filter(file => 
  /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
);

if (imageFiles.length === 0) {
  console.log('No image files found in the images directory.');
  process.exit(0);
}

console.log(`📸 Found ${imageFiles.length} images to upload:`);
imageFiles.forEach(file => console.log(`  - ${file}`));
console.log('');

async function uploadImages() {
  let successCount = 0;
  let errorCount = 0;

  for (const file of imageFiles) {
    try {
      console.log(`📤 Uploading: ${file}...`);
      
      const filePath = path.join(imagesDir, file);
      const fileBuffer = fs.readFileSync(filePath);
      
      const { url } = await put(`photo-gallery/${file}`, fileBuffer, {
        access: 'public',
        addRandomSuffix: false
      });
      
      console.log(`✅ Success: ${file} → ${url}`);
      successCount++;
      
    } catch (error) {
      console.error(`❌ Failed to upload ${file}:`, error.message);
      errorCount++;
    }
    
    // Small delay to be nice to the API
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('');
  console.log('📊 Upload Summary:');
  console.log(`✅ Successfully uploaded: ${successCount}`);
  console.log(`❌ Failed: ${errorCount}`);
  console.log(`📸 Total processed: ${imageFiles.length}`);
  
  if (successCount > 0) {
    console.log('');
    console.log('🎉 Your photos are now available in your gallery!');
    console.log('Start your server with: npm start');
  }
}

// Run the upload
uploadImages().catch(error => {
  console.error('❌ Upload failed:', error.message);
  process.exit(1);
}); 