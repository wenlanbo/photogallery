# Farcaster Frame Setup for New Day One Slideshow

## 🎯 Overview

This guide explains how to set up your New Day One slideshow as a Farcaster Frame - a mini-app that can be embedded in Farcaster posts.

## 📁 Files Created

- `frame.html` - The Frame HTML page
- `api/frame.js` - API endpoint for Frame interactions
- `frame-og.png` - Open Graph image (placeholder)
- `FARCASTER_FRAME_SETUP.md` - This setup guide

## 🚀 Setup Instructions

### 1. Deploy to Vercel

1. Push your code to GitHub
2. Deploy to Vercel (if not already done)
3. Note your Vercel domain (e.g., `your-app.vercel.app`)

### 2. Create Open Graph Image

Create a 1200x630 PNG image for your Frame and save it as `frame-og.png` in the root directory. This image will be displayed when the Frame is shared.

### 3. Update Frame Meta Tags

In `frame.html`, update the meta tags with your actual domain:

```html
<meta property="fc:frame:image" content="https://your-domain.vercel.app/frame-og.png" />
<meta property="fc:frame:post_url" content="https://your-domain.vercel.app/api/frame" />
```

Replace `your-domain.vercel.app` with your actual Vercel domain.

## 📱 How to Use the Frame

### Option 1: Direct Frame URL
Share this URL in Farcaster:
```
https://your-domain.vercel.app/frame
```

### Option 2: Frame Meta Tags
Add these meta tags to any HTML page to make it a Frame:

```html
<meta property="fc:frame" content="vNext" />
<meta property="fc:frame:image" content="https://your-domain.vercel.app/frame-og.png" />
<meta property="fc:frame:button:1" content="View Slideshow" />
<meta property="fc:frame:post_url" content="https://your-domain.vercel.app/api/frame" />
```

### Option 3: Frame Validator
Use the [Farcaster Frame Validator](https://warpcast.com/~/developers/frames) to test your Frame.

## 🎨 Frame Features

### Visual Design
- **Dark theme** optimized for mobile viewing
- **Full-screen slideshow** with no borders
- **Auto-play** with 4-second intervals
- **Navigation controls** (prev/next buttons)
- **Slide counter** showing current/total
- **Farcaster branding** indicator

### Technical Features
- **Responsive design** for all screen sizes
- **Keyboard navigation** (arrow keys)
- **API integration** with Vercel Blob
- **Fallback images** if API fails
- **CORS headers** for Farcaster compatibility

## 🔧 Customization

### Change Auto-play Speed
In `frame.html`, modify the interval in the `startAutoPlay()` function:

```javascript
autoPlayInterval = setInterval(nextSlide, 4000); // 4 seconds
```

### Change Button Text
Update the button text in the meta tags:

```html
<meta property="fc:frame:button:1" content="Your Custom Text" />
```

### Add More Buttons
You can add up to 4 buttons:

```html
<meta property="fc:frame:button:1" content="Button 1" />
<meta property="fc:frame:button:2" content="Button 2" />
<meta property="fc:frame:button:3" content="Button 3" />
<meta property="fc:frame:button:4" content="Button 4" />
```

## 🐛 Troubleshooting

### Frame Not Loading
1. Check that your domain is accessible
2. Verify the Open Graph image exists and is accessible
3. Test the Frame URL directly in a browser

### Images Not Loading
1. Check your Vercel Blob configuration
2. Verify the API endpoint `/api/photos` is working
3. Check browser console for errors

### CORS Issues
The Frame API includes CORS headers, but if you're still having issues:
1. Verify the `api/frame.js` file is properly deployed
2. Check that the route `/api/frame` is correctly configured in `vercel.json`

## 📊 Analytics

To track Frame usage, you can add analytics to the `api/frame.js` endpoint:

```javascript
// Add this to the handler function
console.log('Frame accessed:', new Date().toISOString());
```

## 🔗 Useful Links

- [Farcaster Frame Documentation](https://docs.farcaster.xyz/developers/frames)
- [Frame Validator](https://warpcast.com/~/developers/frames)
- [Vercel Deployment Guide](https://vercel.com/docs)

## 🎉 Success!

Once deployed, your New Day One slideshow will be available as a Farcaster Frame that users can interact with directly in their Farcaster feed! 