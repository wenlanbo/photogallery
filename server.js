const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static('.'));

// API endpoint to get photos from images folder
app.get('/api/photos', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const offset = (page - 1) * limit;
        
        // Check if images folder exists
        const imagesPath = path.join(__dirname, 'images');
        try {
            await fs.access(imagesPath);
        } catch (error) {
            // If images folder doesn't exist, return empty array
            return res.json({
                photos: [],
                hasMore: false,
                total: 0
            });
        }
        
        // Get all image files from the images folder
        const files = await fs.readdir(imagesPath);
        const imageFiles = files.filter(file => {
            const ext = path.extname(file).toLowerCase();
            return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
        });
        
        // Sort files by name
        imageFiles.sort();
        
        // Paginate results
        const paginatedFiles = imageFiles.slice(offset, offset + limit);
        
        // Create photo objects
        const photos = paginatedFiles.map((file, index) => ({
            id: offset + index,
            src: `/images/${file}`,
            alt: path.parse(file).name,
            thumbnail: `/images/${file}`
        }));
        
        res.json({
            photos,
            hasMore: offset + limit < imageFiles.length,
            total: imageFiles.length
        });
        
    } catch (error) {
        console.error('Error loading photos:', error);
        res.status(500).json({ error: 'Failed to load photos' });
    }
});

// Serve images with proper headers
app.use('/images', express.static('images', {
    setHeaders: (res, path) => {
        res.set('Cache-Control', 'public, max-age=31536000');
    }
}));

app.listen(PORT, () => {
    console.log(`Photo gallery server running on http://localhost:${PORT}`);
    console.log(`Make sure to create an 'images' folder and add your photos there!`);
}); 