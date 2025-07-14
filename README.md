# W's Photo Gallery

A beautiful, responsive photo gallery website with infinite scroll, modal view, and dynamic grid layout.

## Features

- 📸 **Dynamic Photo Loading**: Automatically loads photos from the `/images` folder
- 🔄 **Infinite Scroll**: Seamlessly loads more photos as you scroll down
- 🖼️ **Modal View**: Click any photo to view it in full size with navigation
- 📱 **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- ⚡ **Fast Loading**: Optimized with lazy loading and efficient caching
- 🎨 **Modern UI**: Beautiful white background with artistic fonts
- ⌨️ **Keyboard Navigation**: Use arrow keys and Escape to navigate the modal

## Quick Start

### Option 1: Local Development
1. Install dependencies:
   ```bash
   npm install
   ```

2. Create an `images` folder and add your photos:
   ```bash
   mkdir images
   # Add your photos to the images folder
   ```

3. Start the server:
   ```bash
   npm start
   ```

4. Open your browser and go to `http://localhost:3000`

### Option 2: Deploy to Vercel (Recommended)

#### Step 1: Push to GitHub
1. Create a new repository on GitHub
2. Initialize git and push your code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Photo Gallery"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

#### Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) and sign up with GitHub
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will automatically detect it's a Node.js project
5. Click "Deploy"

Your gallery will be live at `https://your-project-name.vercel.app`

## File Structure

```
website/
├── index.html          # Main HTML file
├── styles.css          # CSS styles and responsive design
├── script.js           # JavaScript functionality
├── server.js           # Node.js server
├── package.json        # Node.js dependencies
├── vercel.json         # Vercel deployment configuration
├── .gitignore          # Git ignore rules
├── README.md           # This file
└── images/             # Your photos go here
    ├── photo1.jpg
    ├── photo2.png
    └── ...
```

## How It Works

### Photo Loading
- The website automatically scans the `images` folder for supported image formats
- Photos are loaded in batches of 12 for optimal performance
- Infinite scroll triggers when you reach the bottom of the page

### Modal View
- Click any photo thumbnail to open it in full size
- Use the arrow buttons or keyboard arrows to navigate between photos
- Click the X button or press Escape to close the modal
- Click outside the photo to close the modal

### Responsive Grid
- The grid automatically adjusts based on screen size
- Desktop: 4 columns
- Tablet: 3 columns  
- Mobile: 2 columns
- Small Mobile: 1 column

## Supported Image Formats

- JPEG (.jpg, .jpeg)
- PNG (.png)
- GIF (.gif)
- WebP (.webp)

## Customization

### Changing Colors
Edit the CSS variables in `styles.css`:
```css
body {
    background: #ffffff;
}
```

### Adjusting Grid Size
Modify the grid settings in `styles.css`:
```css
.gallery {
    columns: 4;
    column-gap: 1.5rem;
}
```

### Changing Photos Per Page
Edit the `photosPerPage` variable in `script.js`:
```javascript
this.photosPerPage = 12; // Change this number
```

## Deployment Tips

### For Vercel:
- Your `images` folder will be automatically deployed
- Photos are served through Vercel's global CDN
- Updates are automatic when you push to GitHub
- You can add a custom domain in Vercel settings

### Performance Optimization:
1. **Optimize your images** before adding them (recommended max 2MB each)
2. **Use WebP format** for better compression
3. **Keep image sizes reasonable** for faster loading
4. **Use descriptive filenames** as they become the alt text

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Troubleshooting

### Photos not loading?
- Make sure the `images` folder exists
- Check that your images are in supported formats
- If using Vercel, ensure the images folder is committed to GitHub

### Modal not working?
- Check browser console for JavaScript errors
- Ensure all files are in the same directory
- Try refreshing the page

### Slow loading?
- Optimize your image sizes
- Check your internet connection
- Consider using a CDN for large galleries

## License

MIT License - feel free to use this for your own projects!

## Contributing

Feel free to submit issues and enhancement requests! 