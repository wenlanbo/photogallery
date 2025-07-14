# Vercel Blob Setup Guide

## 🚀 Quick Setup (3 minutes)

### 1. Install Vercel CLI
```bash
npm install -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Link Your Project
```bash
vercel link
```

### 4. Get Your Blob Token
```bash
vercel env pull .env
```

This will create a `.env` file with your `BLOB_READ_WRITE_TOKEN`.

### 5. Install Dependencies
```bash
npm install
```

### 6. Upload Your Photos
```bash
node upload-photos.js
```

## 🎯 Benefits of Vercel Blob

### ✅ **Perfect Vercel Integration**
- Seamless deployment with your existing Vercel setup
- No additional configuration needed
- Automatic environment variable management

### ✅ **Global CDN**
- Images served from Vercel's global edge network
- Fast loading worldwide
- Automatic caching and optimization

### ✅ **Simple Pricing**
- **Free tier**: 1GB storage, 100GB bandwidth/month
- **Paid**: $20/month for 100GB storage, 1TB bandwidth
- No hidden costs

### ✅ **Easy Management**
- Simple API for uploads and listing
- Automatic file organization
- Built-in security

## 🔧 Advanced Features

### Custom Domains
You can serve images from your own domain:
```javascript
const { url } = await put('photo.jpg', fileBuffer, {
  access: 'public',
  addRandomSuffix: false
});
// url: https://your-domain.com/photo.jpg
```

### Image Optimization
Vercel Blob automatically optimizes images:
- WebP format for modern browsers
- Automatic compression
- Responsive image serving

### Security
- Private blobs for sensitive content
- Access control per file
- Automatic HTTPS

## 🚀 Deploy to Vercel

### 1. Push to GitHub
```bash
git add .
git commit -m "Add Vercel Blob integration"
git push origin main
```

### 2. Deploy
Your project will automatically deploy when you push to GitHub.

### 3. Set Environment Variables
In your Vercel dashboard:
1. Go to your project settings
2. Add `BLOB_READ_WRITE_TOKEN` environment variable
3. Copy the value from your `.env` file

## 📁 File Organization

Your photos will be organized like this:
```
photo-gallery/
├── 724-10.JPG
├── 724-56.JPG
├── 724-62.JPG
└── ...
```

## 🔄 Upload New Photos

### Option 1: Command Line
```bash
node upload-photos.js
```

### Option 2: Programmatic Upload
```javascript
const { put } = require('@vercel/blob');
const fs = require('fs');

async function uploadPhoto(filePath, fileName) {
  const fileBuffer = fs.readFileSync(filePath);
  const { url } = await put(`photo-gallery/${fileName}`, fileBuffer, {
    access: 'public'
  });
  return url;
}
```

### Option 3: Vercel Dashboard
1. Go to your Vercel project
2. Navigate to Storage → Blob
3. Upload files directly

## 💰 Cost Comparison

| Service | Free Tier | Paid Plans |
|---------|-----------|------------|
| **Vercel Blob** | 1GB storage, 100GB bandwidth | $20/month for 100GB |
| **Cloudinary** | 25GB storage, 25GB bandwidth | $89/month for 225GB |
| **AWS S3** | 5GB storage | Pay per use |
| **GitHub + jsDelivr** | Unlimited | Free forever |

**Recommendation**: Vercel Blob is perfect for your setup since you're already using Vercel for deployment!

## 🛠️ Troubleshooting

### "BLOB_READ_WRITE_TOKEN not found"
1. Run `vercel env pull .env`
2. Check that the token is in your `.env` file
3. Restart your server

### "Upload failed"
1. Check your internet connection
2. Verify the file exists in the `images/` folder
3. Check file permissions

### "Images not loading"
1. Verify the upload was successful
2. Check the browser console for errors
3. Ensure the server is running

## 🎉 Next Steps

1. **Upload your photos**: `node upload-photos.js`
2. **Test locally**: `npm start`
3. **Deploy**: Push to GitHub
4. **Enjoy**: Your photos are now hosted on Vercel's global CDN! 