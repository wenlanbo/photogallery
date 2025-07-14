require('dotenv').config();
const express = require('express');
const { google } = require('googleapis');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('.'));

// Google Drive API setup
const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

// Store tokens in memory (in production, use a database)
let tokens = null;

// Initialize Google Drive API
const drive = google.drive({ version: 'v3', auth: oauth2Client });

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

// Google OAuth endpoints
app.get('/auth/google', (req, res) => {
    const scopes = [
        'https://www.googleapis.com/auth/drive.readonly'
    ];
    
    // For web applications, we can redirect directly
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        prompt: 'consent'
    });
    
    res.redirect(authUrl);
});

// Handle OAuth callback for installed application
app.get('/auth/google/callback', async (req, res) => {
    try {
        const { code } = req.query;
        const { tokens: newTokens } = await oauth2Client.getToken(code);
        tokens = newTokens;
        oauth2Client.setCredentials(tokens);
        
        res.send(`
            <html>
                <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
                    <h1 style="color: #4CAF50;">✅ Authentication Successful!</h1>
                    <p>You can now close this window and return to your photo gallery.</p>
                    <p>Your Google Drive photos will now load automatically!</p>
                    <script>
                        setTimeout(() => {
                            window.close();
                        }, 3000);
                    </script>
                </body>
            </html>
        `);
    } catch (error) {
        console.error('Error getting tokens:', error);
        res.status(500).send(`
            <html>
                <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
                    <h1 style="color: #f44336;">❌ Authentication Failed</h1>
                    <p>Error: ${error.message}</p>
                    <p>Please try again or check your Google Cloud Console settings.</p>
                </body>
            </html>
        `);
    }
});

// Alternative callback endpoint for web applications
app.get('/auth/google/callback/web', async (req, res) => {
    try {
        const { code } = req.query;
        const { tokens: newTokens } = await oauth2Client.getToken(code);
        tokens = newTokens;
        oauth2Client.setCredentials(tokens);
        
        res.send(`
            <html>
                <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
                    <h1 style="color: #4CAF50;">✅ Authentication Successful!</h1>
                    <p>You can now close this window and return to your photo gallery.</p>
                    <p>Your Google Drive photos will now load automatically!</p>
                    <script>
                        setTimeout(() => {
                            window.close();
                        }, 3000);
                    </script>
                </body>
            </html>
        `);
    } catch (error) {
        console.error('Error getting tokens:', error);
        res.status(500).send(`
            <html>
                <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
                    <h1 style="color: #f44336;">❌ Authentication Failed</h1>
                    <p>Error: ${error.message}</p>
                    <p>Please try again or check your Google Cloud Console settings.</p>
                </body>
            </html>
        `);
    }
});

// Check authentication status
app.get('/api/auth/status', (req, res) => {
    res.json({ 
        authenticated: !!tokens,
        hasCredentials: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)
    });
});

// API endpoint to get photos from Google Drive
app.get('/api/photos', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const offset = (page - 1) * limit;
        
        console.log(`API called: page=${page}, limit=${limit}, offset=${offset}`);
        
        // Check if authenticated
        if (!tokens) {
            return res.status(401).json({ 
                error: 'Not authenticated',
                message: 'Please authenticate with Google Drive first'
            });
        }
        
        // Build query for image files
        let query = "mimeType contains 'image/' and trashed=false";
        
        // If folder ID is specified, search only in that folder
        if (process.env.GOOGLE_DRIVE_FOLDER_ID) {
            query += ` and '${process.env.GOOGLE_DRIVE_FOLDER_ID}' in parents`;
        }
        
        // Get files from Google Drive
        const response = await drive.files.list({
            q: query,
            fields: 'files(id,name,mimeType,thumbnailLink,webContentLink,size,createdTime)',
            orderBy: 'createdTime desc',
            pageSize: 1000 // Get more files to allow for pagination
        });
        
        const files = response.data.files || [];
        console.log(`Found ${files.length} image files in Google Drive`);
        
        // Convert to photo format
        const allPhotos = files.map((file, index) => {
            const fileId = file.id;
            const directLink = `https://drive.google.com/uc?export=view&id=${fileId}`;
            
            return {
                id: index,
                src: directLink,
                alt: file.name || `Photo ${index + 1}`,
                thumbnail: directLink,
                name: file.name,
                size: file.size,
                createdTime: file.createdTime
            };
        });
        
        // Paginate results
        const paginatedPhotos = allPhotos.slice(offset, offset + limit);
        
        console.log(`Returning ${paginatedPhotos.length} photos, total: ${allPhotos.length}, hasMore: ${offset + limit < allPhotos.length}`);
        
        res.json({
            photos: paginatedPhotos,
            hasMore: offset + limit < allPhotos.length,
            total: allPhotos.length
        });
        
    } catch (error) {
        console.error('Error loading photos from Google Drive:', error);
        
        // If it's an authentication error, return 401
        if (error.code === 401) {
            tokens = null; // Clear invalid tokens
            return res.status(401).json({ 
                error: 'Authentication expired',
                message: 'Please re-authenticate with Google Drive'
            });
        }
        
        res.status(500).json({ 
            error: 'Failed to load photos from Google Drive',
            details: error.message
        });
    }
});

// Fallback to static photos if Google Drive is not configured
app.get('/api/photos/fallback', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const offset = (page - 1) * limit;
        
        // Static list of photos (your existing photos)
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
        
        res.json({
            photos: paginatedPhotos,
            hasMore: offset + limit < allPhotos.length,
            total: allPhotos.length
        });
        
    } catch (error) {
        console.error('Error loading fallback photos:', error);
        res.status(500).json({ 
            error: 'Failed to load fallback photos',
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
    console.log(`Google Drive API configured: ${!!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)}`);
    if (process.env.GOOGLE_DRIVE_FOLDER_ID) {
        console.log(`Using specific folder: ${process.env.GOOGLE_DRIVE_FOLDER_ID}`);
    }
}); 