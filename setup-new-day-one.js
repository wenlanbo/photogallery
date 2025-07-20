// Setup script for New Day One collection
// This script helps create the new-day-one folder in Vercel Blob

require('dotenv').config();
const { put } = require('@vercel/blob');
const fs = require('fs');
const path = require('path');

async function setupNewDayOne() {
    console.log('Setting up New Day One collection in Vercel Blob...');
    
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
        console.error('❌ BLOB_READ_WRITE_TOKEN not found in environment variables');
        console.log('Please add your Vercel Blob token to .env file');
        return;
    }
    
    try {
        // Get all images from the images folder
        const imagesDir = path.join(__dirname, 'images');
        let imageFiles = fs.readdirSync(imagesDir)
            .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
            .slice(0, 10); // Take first 10 images for the collection
        
        // Sort to put cover.jpg first if it exists
        imageFiles.sort((a, b) => {
            if (a.toLowerCase().includes('cover.jpg')) return -1;
            if (b.toLowerCase().includes('cover.jpg')) return 1;
            return 0;
        });
        
        console.log(`Found ${imageFiles.length} images to upload`);
        
        // Upload each image to the new-day-one folder
        for (let i = 0; i < imageFiles.length; i++) {
            const fileName = imageFiles[i];
            const filePath = path.join(imagesDir, fileName);
            const blobPath = `new-day-one/${fileName}`;
            
            console.log(`Uploading ${fileName} (${i + 1}/${imageFiles.length})...`);
            
            const fileBuffer = fs.readFileSync(filePath);
            const { url } = await put(blobPath, fileBuffer, {
                access: 'public',
                addRandomSuffix: false
            });
            
            console.log(`✅ Uploaded: ${url}`);
        }
        
        console.log('\n🎉 New Day One collection setup complete!');
        console.log('You can now visit /new-day-one.html to see your film experience');
        
    } catch (error) {
        console.error('❌ Error setting up New Day One collection:', error);
    }
}

// Run the setup
setupNewDayOne(); 