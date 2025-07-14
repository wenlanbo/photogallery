# Google Drive API Setup Guide

This guide will help you set up automatic photo fetching from your Google Drive without manually getting direct links.

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Name your project (e.g., "Photo Gallery API")
4. Click "Create"

## Step 2: Enable Google Drive API

1. In your new project, go to "APIs & Services" → "Library"
2. Search for "Google Drive API"
3. Click on it and press "Enable"

## Step 3: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth 2.0 Client IDs"
3. If prompted, configure the OAuth consent screen:
   - User Type: External
   - App name: Your photo gallery name
   - User support email: Your email
   - Developer contact information: Your email
   - Save and continue through the other sections

4. Create OAuth 2.0 Client ID:
   - Application type: Web application
   - Name: Photo Gallery Web Client
   - Authorized redirect URIs:
     - For local development: `http://localhost:3000/auth/google/callback`
     - For production: `https://your-domain.vercel.app/auth/google/callback`
   - Click "Create"

5. Copy the Client ID and Client Secret (you'll need these for the .env file)

## Step 4: Configure Environment Variables

1. Create a `.env` file in your project root (copy from `env.example`)
2. Add your credentials:

```env
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback

# Optional: Specific Google Drive folder ID
GOOGLE_DRIVE_FOLDER_ID=your_folder_id_here
```

## Step 5: Get Your Google Drive Folder ID (Optional)

If you want to fetch photos from a specific folder:

1. Open Google Drive in your browser
2. Navigate to the folder containing your photos
3. The folder ID is in the URL: `https://drive.google.com/drive/folders/FOLDER_ID_HERE`
4. Copy the FOLDER_ID_HERE part and add it to your .env file

## Step 6: Upload Photos to Google Drive

1. Upload your photos to Google Drive (either root or the specific folder)
2. Make sure the photos are accessible to your Google account
3. The API will automatically find all image files

## Step 7: Test Locally

1. Start your server: `npm start`
2. Open your browser to `http://localhost:3000`
3. Click "Connect to Google Drive" button
4. Complete the OAuth flow
5. Your photos should now load automatically from Google Drive!

## Step 8: Deploy to Production

### For Vercel:

1. Add your environment variables in Vercel dashboard:
   - Go to your project settings
   - Add environment variables:
     - `GOOGLE_CLIENT_ID`
     - `GOOGLE_CLIENT_SECRET`
     - `GOOGLE_REDIRECT_URI` (use your production domain)
     - `GOOGLE_DRIVE_FOLDER_ID` (optional)

2. Update your OAuth redirect URI in Google Cloud Console:
   - Add your production domain: `https://your-domain.vercel.app/auth/google/callback`

3. Deploy your changes

## How It Works

1. **Authentication**: Users click "Connect to Google Drive" to authenticate with Google
2. **Photo Fetching**: The server uses Google Drive API to fetch all image files
3. **Automatic Updates**: New photos uploaded to Google Drive will appear automatically
4. **Fallback**: If Google Drive is not configured, it falls back to your local images

## Features

- ✅ Automatic photo discovery from Google Drive
- ✅ OAuth 2.0 authentication
- ✅ Pagination and infinite scroll
- ✅ Fallback to local images
- ✅ Responsive design
- ✅ Modal view for full-size photos
- ✅ No manual link management needed

## Troubleshooting

### "Invalid redirect URI" error
- Make sure the redirect URI in Google Cloud Console matches exactly
- For local development: `http://localhost:3000/auth/google/callback`
- For production: `https://your-domain.vercel.app/auth/google/callback`

### "Authentication expired" error
- Click "Connect to Google Drive" again to re-authenticate
- Tokens expire periodically for security

### No photos showing
- Check that you have image files in your Google Drive
- Verify the folder ID is correct (if using a specific folder)
- Check browser console for error messages

### API quota exceeded
- Google Drive API has daily quotas
- For high usage, consider upgrading your Google Cloud project

## Security Notes

- Never commit your `.env` file to version control
- The `.env` file is already in `.gitignore`
- OAuth tokens are stored in memory and expire automatically
- Only read-only access to Google Drive is requested

## Next Steps

Once set up, you can:
1. Upload new photos to Google Drive and they'll appear automatically
2. Organize photos in folders and specify folder IDs
3. Share your gallery with others (they'll need to authenticate with their own Google accounts) 