require('dotenv').config();
const express = require('express');
const { list, put } = require('@vercel/blob');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('.'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Server is running',
    environment: process.env.NODE_ENV || 'development',
    vercelBlob: !!process.env.BLOB_READ_WRITE_TOKEN
  });
});

// API endpoint to get photos
app.get('/api/photos', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const offset = (page - 1) * limit;
    const folder = req.query.folder || 'photo-gallery';
    
    console.log(`API called: page=${page}, limit=${limit}, offset=${offset}, folder=${folder}`);
    
    // Check if Vercel Blob is configured
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      // Get photos from Vercel Blob
      const { blobs } = await list({
        limit: 1000,
        prefix: `${folder}/`
      });
      
      console.log(`Found ${blobs.length} blobs in ${folder}/`);
      
      // If no blobs found in specific folder, search for cover.jpg in all folders
      if (blobs.length === 0 && folder === 'new-day-one') {
        console.log('No blobs found in new-day-one folder, searching for cover.jpg in all folders...');
        const { blobs: allBlobs } = await list({
          limit: 1000
        });
        
        // Find cover.jpg in any folder
        const coverBlobs = allBlobs.filter(blob => 
          /\.(jpg|jpeg|png|gif|webp)$/i.test(blob.pathname) && 
          blob.pathname.toLowerCase().includes('cover')
        );
        
        console.log(`Found ${coverBlobs.length} cover images:`, coverBlobs.map(b => b.pathname));
        
        if (coverBlobs.length > 0) {
          // Use cover images found in any folder
          const imageBlobs = coverBlobs.concat(
            allBlobs.filter(blob => 
              /\.(jpg|jpeg|png|gif|webp)$/i.test(blob.pathname) && 
              !blob.pathname.toLowerCase().includes('cover')
            ).slice(0, 9) // Add up to 9 more images
          );
          
          const allPhotos = imageBlobs.map((blob, index) => ({
            id: index,
            src: blob.url,
            alt: blob.pathname.split('/').pop() || `Photo ${index + 1}`,
            thumbnail: blob.url,
            name: blob.pathname.split('/').pop(),
            size: blob.size,
            createdTime: blob.uploadedAt
          }));
          
          const paginatedPhotos = allPhotos.slice(offset, offset + limit);
          
          console.log(`Returning ${paginatedPhotos.length} photos (including covers), total: ${allPhotos.length}`);
          
          res.json({
            photos: paginatedPhotos,
            hasMore: offset + limit < allPhotos.length,
            total: allPhotos.length
          });
          return;
        }
      }
      
      // Filter for image files and sort with cover.jpg first
      const imageBlobs = blobs
        .filter(blob => /\.(jpg|jpeg|png|gif|webp)$/i.test(blob.pathname))
        .sort((a, b) => {
          // Always put cover.jpg first
          if (a.pathname.toLowerCase().includes('cover.jpg')) return -1;
          if (b.pathname.toLowerCase().includes('cover.jpg')) return 1;
          // Then sort by creation date
          return new Date(b.uploadedAt) - new Date(a.uploadedAt);
        });
      
      const allPhotos = imageBlobs.map((blob, index) => ({
        id: index,
        src: blob.url,
        alt: blob.pathname.split('/').pop() || `Photo ${index + 1}`,
        thumbnail: blob.url, // Vercel Blob serves optimized images automatically
        name: blob.pathname.split('/').pop(),
        size: blob.size,
        createdTime: blob.uploadedAt
      }));
      
      // For new-day-one folder, return all photos without pagination
      if (folder === 'new-day-one') {
        console.log(`Returning all ${allPhotos.length} photos for new-day-one folder`);
        res.json({
          photos: allPhotos,
          hasMore: false,
          total: allPhotos.length
        });
      } else {
        const paginatedPhotos = allPhotos.slice(offset, offset + limit);
        console.log(`Returning ${paginatedPhotos.length} photos from Vercel Blob, total: ${allPhotos.length}, hasMore: ${offset + limit < allPhotos.length}`);
        
        res.json({
          photos: paginatedPhotos,
          hasMore: offset + limit < allPhotos.length,
          total: allPhotos.length
        });
      }
    } else {
      // Fallback to static photos if Vercel Blob not configured
      let allPhotos = [];
      
      if (folder === 'new-day-one') {
        // Sample photos for new-day-one collection with cover.jpg first
        allPhotos = [
          { id: 0, src: '/images/cover.jpg', alt: 'New Day One - Cover', thumbnail: '/images/cover.jpg' },
          { id: 1, src: '/images/724-10.JPG', alt: 'New Day One - 1', thumbnail: '/images/724-10.JPG' },
          { id: 2, src: '/images/724-56.JPG', alt: 'New Day One - 2', thumbnail: '/images/724-56.JPG' },
          { id: 3, src: '/images/724-62.JPG', alt: 'New Day One - 3', thumbnail: '/images/724-62.JPG' },
          { id: 4, src: '/images/724-70.JPG', alt: 'New Day One - 4', thumbnail: '/images/724-70.JPG' },
          { id: 5, src: '/images/84190002.JPG', alt: 'New Day One - 5', thumbnail: '/images/84190002.JPG' },
          { id: 6, src: '/images/84190003.JPG', alt: 'New Day One - 6', thumbnail: '/images/84190003.JPG' }
        ];
      } else {
        // Default photo-gallery collection
        allPhotos = [
          { id: 0, src: '/images/724-10.JPG', alt: '724-10', thumbnail: '/images/724-10.JPG' },
          { id: 1, src: '/images/724-56.JPG', alt: '724-56', thumbnail: '/images/724-56.JPG' },
          { id: 2, src: '/images/724-62.JPG', alt: '724-62', thumbnail: '/images/724-62.JPG' },
          { id: 3, src: '/images/724-70.JPG', alt: '724-70', thumbnail: '/images/724-70.JPG' },
          { id: 4, src: '/images/84190002.JPG', alt: '84190002', thumbnail: '/images/84190002.JPG' },
          { id: 5, src: '/images/84190003.JPG', alt: '84190003', thumbnail: '/images/84190003.JPG' },
          { id: 6, src: '/images/84190004.JPG', alt: '84190004', thumbnail: '/images/84190004.JPG' },
          { id: 7, src: '/images/84190006.JPG', alt: '84190006', thumbnail: '/images/84190006.JPG' },
          { id: 8, src: '/images/84190007.JPG', alt: '84190007', thumbnail: '/images/84190007.JPG' },
          { id: 9, src: '/images/84190010.JPG', alt: '84190010', thumbnail: '/images/84190010.JPG' },
          { id: 10, src: '/images/84190014.JPG', alt: '84190014', thumbnail: '/images/84190014.JPG' },
          { id: 11, src: '/images/84190016.JPG', alt: '84190016', thumbnail: '/images/84190016.JPG' }
        ];
      }
      
      const paginatedPhotos = allPhotos.slice(offset, offset + limit);
      
      console.log(`Returning ${paginatedPhotos.length} static photos, total: ${allPhotos.length}, hasMore: ${offset + limit < allPhotos.length}`);
      
      res.json({
        photos: paginatedPhotos,
        hasMore: offset + limit < allPhotos.length,
        total: allPhotos.length
      });
    }
    
  } catch (error) {
    console.error('Error loading photos:', error);
    res.status(500).json({ 
      error: 'Failed to load photos',
      details: error.message
    });
  }
});

// API endpoint to search for cover images
app.get('/api/search-covers', async (req, res) => {
  try {
    console.log('Searching for cover images in Vercel Blob...');
    
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return res.json({ 
        covers: [],
        message: 'Vercel Blob not configured'
      });
    }
    
    // Search all blobs for cover images
    const { blobs } = await list({
      limit: 1000
    });
    
    const coverBlobs = blobs.filter(blob => 
      /\.(jpg|jpeg|png|gif|webp)$/i.test(blob.pathname) && 
      blob.pathname.toLowerCase().includes('cover')
    );
    
    console.log(`Found ${coverBlobs.length} cover images:`, coverBlobs.map(b => b.pathname));
    
    const covers = coverBlobs.map((blob, index) => ({
      id: index,
      src: blob.url,
      alt: blob.pathname.split('/').pop() || `Cover ${index + 1}`,
      pathname: blob.pathname,
      size: blob.size,
      createdTime: blob.uploadedAt
    }));
    
    res.json({
      covers,
      total: covers.length,
      message: `Found ${covers.length} cover images`
    });
    
  } catch (error) {
    console.error('Error searching for covers:', error);
    res.status(500).json({ 
      error: 'Failed to search for cover images',
      details: error.message
    });
  }
});

// Add error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    details: error.message
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    console.log('Using Vercel Blob for image hosting');
  } else {
    console.log('Using static photos (Vercel Blob not configured)');
  }
}); 