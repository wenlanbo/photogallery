# Vercel Deployment Setup Guide (Service Account)

This guide will help you deploy your photo gallery to Vercel with automatic Google Drive integration using a service account.

## Step 1: Create a Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to your project
3. Go to "APIs & Services" → "Credentials"
4. Click "Create Credentials" → "Service Account"
5. Fill in the details:
   - Service account name: "photo-gallery-service"
   - Service account ID: auto-generated
   - Description: "Service account for photo gallery"
6. Click "Create and Continue"
7. Skip the optional steps and click "Done"

## Step 2: Generate Service Account Key

1. Click on your newly created service account
2. Go to the "Keys" tab
3. Click "Add Key" → "Create new key"
4. Choose "JSON" format
5. Click "Create"
6. Download the JSON file and extract the credentials

## Step 3: Share Your Google Drive Folder

1. Open Google Drive in your browser
2. Navigate to the folder containing your photos
3. Right-click the folder → "Share"
4. Add your service account email (found in the JSON file) with "Editor" permissions
5. Copy the folder ID from the URL: `https://drive.google.com/drive/folders/FOLDER_ID_HERE`

## Step 4: Deploy to Vercel

### Option A: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy your project:
   ```bash
   vercel
   ```

4. When prompted:
   - Set up and deploy: Yes
   - Which scope: Select your account
   - Link to existing project: No
   - Project name: your-vercel-domain
   - Directory: ./ (current directory)

### Option B: Deploy via GitHub

1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "New Project"
4. Import your GitHub repository
5. Configure the project:
   - Project Name: your-vercel-domain
   - Framework Preset: Node.js
   - Root Directory: ./
   - Build Command: (leave empty)
   - Output Directory: (leave empty)
   - Install Command: npm install

## Step 5: Configure Environment Variables

In your Vercel project dashboard:

1. Go to your project settings
2. Click on "Environment Variables"
3. Add the following variables:

### Environment Variables for Vercel:

| Variable Name | Value |
|---------------|-------|
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | `your-service-account@project.iam.gserviceaccount.com` |
| `GOOGLE_PRIVATE_KEY` | `-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n` |
| `GOOGLE_DRIVE_FOLDER_ID` | `your-google-drive-folder-id` |

### How to Add Environment Variables:

1. In Vercel dashboard, go to your project
2. Click "Settings" tab
3. Click "Environment Variables" in the left sidebar
4. Click "Add New"
5. For each variable:
   - **Name**: Enter the variable name (e.g., `GOOGLE_SERVICE_ACCOUNT_EMAIL`)
   - **Value**: Enter the corresponding value
   - **Environment**: Select "Production" (and optionally "Preview" and "Development")
   - Click "Save"

## Step 6: Deploy

After adding the environment variables:

1. Go to the "Deployments" tab
2. Click "Redeploy" on your latest deployment
3. Or push new changes to your GitHub repository for automatic deployment

## Step 7: Test Your Deployment

1. Visit your deployed site: `https://your-vercel-domain.vercel.app`
2. Your photos from Google Drive should load automatically!
3. No authentication required - photos load immediately

## Troubleshooting

### Environment variables not working
- Check that all 3 environment variables are set in Vercel
- Make sure they're set for the "Production" environment
- Redeploy after adding environment variables

### Photos not loading
- Check that you have photos in the specified Google Drive folder
- Verify the folder ID is correct
- Make sure the service account has access to the folder
- Check the browser console for error messages

### Service account authentication failed
- Verify your service account credentials are correct
- Check that the Google Drive API is enabled
- Ensure the private key is properly formatted with newlines

## File Structure for Vercel

Your project should have this structure:
```
website/
├── .env (local development)
├── .env.vercel.example (production reference)
├── server.js
├── package.json
├── index.html
├── styles.css
├── script.js
├── vercel.json
└── README.md
```

## Environment Variables Summary

**Local Development (.env):**
```env
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
GOOGLE_DRIVE_FOLDER_ID=your-google-drive-folder-id
```

**Vercel Production (.env.vercel.example):**
```env
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
GOOGLE_DRIVE_FOLDER_ID=your-google-drive-folder-id
```

## Next Steps

After successful deployment:
1. Upload new photos to your Google Drive folder
2. Verify they appear automatically on your website
3. Share your gallery with others!

Your photo gallery will now automatically fetch photos from Google Drive without any authentication required! 