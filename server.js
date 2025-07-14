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
    
    console.log(`API called: page=${page}, limit=${limit}, offset=${offset}`);
    
    // Check if Vercel Blob is configured
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      // Get photos from Vercel Blob
      const { blobs } = await list({
        limit: 1000,
        prefix: 'photo-gallery/'
      });
      
      // Filter for image files and sort by creation date
      const imageBlobs = blobs
        .filter(blob => /\.(jpg|jpeg|png|gif|webp)$/i.test(blob.pathname))
        .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
      
      const allPhotos = imageBlobs.map((blob, index) => ({
        id: index,
        src: blob.url,
        alt: blob.pathname.split('/').pop() || `Photo ${index + 1}`,
        thumbnail: blob.url, // Vercel Blob serves optimized images automatically
        name: blob.pathname.split('/').pop(),
        size: blob.size,
        createdTime: blob.uploadedAt
      }));
      
      const paginatedPhotos = allPhotos.slice(offset, offset + limit);
      
      console.log(`Returning ${paginatedPhotos.length} photos from Vercel Blob, total: ${allPhotos.length}, hasMore: ${offset + limit < allPhotos.length}`);
      
      res.json({
        photos: paginatedPhotos,
        hasMore: offset + limit < allPhotos.length,
        total: allPhotos.length
      });
    } else {
      // Fallback to static photos if Vercel Blob not configured
      const allPhotos = [
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