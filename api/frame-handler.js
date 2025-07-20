export default function handler(req, res) {
  // Set CORS headers for Farcaster
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request for CORS
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Get the current domain from the request
  const protocol = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers.host;
  const baseUrl = `${protocol}://${host}`;

  // For POST requests (when user clicks the button), redirect to the frame
  if (req.method === 'POST') {
    // Return a redirect to the frame
    res.status(200).json({
      frames: [{
        image: `${baseUrl}/frame-og.png`,
        buttons: [
          {
            label: "View Slideshow",
            action: "post"
          }
        ],
        postUrl: `${baseUrl}/api/frame-handler`
      }]
    });
    return;
  }

  // For GET requests, redirect to the frame
  res.redirect(302, `${baseUrl}/frame`);
} 