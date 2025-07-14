# Google Drive API Setup Guide (Application Default Credentials)

This guide will help you set up automatic photo fetching from your Google Drive without requiring user authentication, using Application Default Credentials instead of service account keys.

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Name your project (e.g., "Photo Gallery API")
4. Click "Create"

## Step 2: Enable Google Drive API

1. In your new project, go to "APIs & Services" → "Library"
2. Search for "Google Drive API"
3. Click on it and press "Enable"

## Step 3: Set Up Application Default Credentials

### For Local Development:

1. Install Google Cloud CLI:
   ```bash
   # macOS
   brew install google-cloud-sdk
   
   # Or download from: https://cloud.google.com/sdk/docs/install
   ```

2. Login to your Google account:
   ```bash
   gcloud auth login
   ```

3. Set your project:
   ```bash
   gcloud config set project YOUR_PROJECT_ID
   ```

4. Set up application default credentials:
   ```bash
   gcloud auth application-default login
   ```

### For Vercel Deployment:

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth 2.0 Client IDs"
3. Application type: "Web application"
4. Add authorized redirect URIs:
   - `https://your-vercel-domain.vercel.app/auth/callback`
5. Download the client credentials

## Step 4: Share Your Google Drive Folder

1. Open Google Drive in your browser
2. Navigate to the folder containing your photos
3. Right-click the folder → "Share"
4. Add your Google account email with "Editor" permissions
5. Copy the folder ID from the URL: `https://drive.google.com/drive/folders/FOLDER_ID_HERE`

## Step 5: Configure Environment Variables

### For Local Development:
No environment variables needed - uses your logged-in Google account.

### For Vercel Deployment:
```env
GOOGLE_CLIENT_ID=your-oauth-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-oauth-client-secret
GOOGLE_DRIVE_FOLDER_ID=your_folder_id_here
```

## Step 6: Update Server Code

The server will be updated to use Application Default Credentials for local development and OAuth for production.

## Step 7: Test Locally

1. Start your server: `npm start`
2. Open your browser to `http://localhost:3000`
3. Your photos should load automatically from Google Drive!

## Step 8: Deploy to Vercel

1. Add the environment variables to your Vercel project settings
2. Deploy your code
3. Your photos will load automatically!

## Features

- ✅ Automatic photo discovery from Google Drive
- ✅ No user authentication required
- ✅ Works with organization policies
- ✅ Pagination and infinite scroll
- ✅ Responsive design
- ✅ Modal view for full-size photos
- ✅ No manual link management needed

## Security Notes

- Uses your personal Google account credentials
- Only accesses the specific folder you share
- Credentials are stored locally and securely
- No service account keys required

## Next Steps

Once set up, you can:
1. Upload new photos to your Google Drive folder and they'll appear automatically
2. Organize photos in folders and specify folder IDs
3. Share your gallery with others (no authentication needed) 