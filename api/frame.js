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

  // Create the Frame HTML with dynamic meta tags
  const frameHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Day One - Film Experience</title>
    
    <!-- Farcaster Mini App Meta Tags -->
    <meta name="fc:miniapp" content='{"version":"1","imageUrl":"${baseUrl}/frame-og.png","button":{"title":"View Slideshow","action":{"type":"launch_frame","name":"New Day One","url":"${baseUrl}/frame","splashImageUrl":"${baseUrl}/app-icon.png","splashBackgroundColor":"#FFFFFF"}}}' />
    
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', 'Roboto', sans-serif;
            background: #000;
            color: white;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }

        .header {
            background: rgba(0,0,0,0.8);
            padding: 1rem;
            text-align: center;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 100;
        }

        .title {
            font-size: 1.5rem;
            color: white;
            margin-bottom: 0.25rem;
            font-weight: 500;
            letter-spacing: -0.02em;
            text-transform: uppercase;
        }

        .subtitle {
            color: #ccc;
            font-size: 0.8rem;
            font-weight: 300;
            letter-spacing: 0.1em;
            text-transform: uppercase;
        }

        .slideshow-container {
            position: relative;
            width: 100vw;
            height: 100vh;
            background: #000;
            overflow: hidden;
        }

        .slide {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0;
            transition: opacity 0.8s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0;
        }

        .slide.active {
            opacity: 1;
        }

        .slide img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
            width: auto;
            height: auto;
            display: block;
            margin: 0;
        }

        .controls {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 1rem;
            background: rgba(0,0,0,0.8);
            padding: 0.75rem;
            border-radius: 25px;
            backdrop-filter: blur(10px);
        }

        .btn {
            background: rgba(255,255,255,0.9);
            border: none;
            color: #000;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            cursor: pointer;
            font-size: 0.9rem;
            transition: all 0.3s;
            font-weight: 500;
        }

        .btn:hover {
            background: white;
            transform: translateY(-1px);
        }

        .counter {
            color: white;
            display: flex;
            align-items: center;
            padding: 0 1rem;
            font-size: 0.9rem;
            font-weight: 500;
        }

        .loading {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
            color: white;
            font-size: 1.2rem;
        }

        .farcaster-info {
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0,0,0,0.8);
            padding: 0.5rem 1rem;
            border-radius: 15px;
            font-size: 0.8rem;
            color: #ccc;
            backdrop-filter: blur(10px);
        }
    </style>
</head>
<body>
    <header class="header">
        <h1 class="title">New Day One</h1>
        <p class="subtitle">A Film Experience</p>
    </header>

    <div class="farcaster-info">
        📸 Farcaster Frame
    </div>

    <div class="slideshow-container" id="slideshow">
        <div class="loading" id="loading">Loading Film Experience...</div>
    </div>

    <script>
        // Slideshow with images from Vercel Blob
        let images = [];
        async function loadImagesFromAPI() {
            try {
                updateStatus('Loading images from API...');
                const response = await fetch('/api/photos?folder=new-day-one&limit=50');
                
                if (!response.ok) {
                    throw new Error(\`API failed: \${response.status}\`);
                }
                
                const data = await response.json();
                const apiImages = data.photos || [];
                
                if (apiImages.length > 0) {
                    images = apiImages.map(photo => photo.src || photo.url);
                    updateStatus(\`Loaded \${images.length} images from API\`);
                } else {
                    // Fallback to placeholder images if no API images
                    images = [
                        'https://picsum.photos/800/600?random=1',
                        'https://picsum.photos/800/600?random=2',
                        'https://picsum.photos/800/600?random=3',
                        'https://picsum.photos/800/600?random=4',
                        'https://picsum.photos/800/600?random=5',
                        'https://picsum.photos/800/600?random=6'
                    ];
                    updateStatus('No API images, using placeholders');
                }
            } catch (error) {
                console.error('Error loading from API:', error);
                // Fallback to placeholder images
                images = [
                    'https://picsum.photos/800/600?random=1',
                    'https://picsum.photos/800/600?random=2',
                    'https://picsum.photos/800/600?random=3',
                    'https://picsum.photos/800/600?random=4',
                    'https://picsum.photos/800/600?random=5',
                    'https://picsum.photos/800/600?random=6'
                ];
                updateStatus('API failed, using placeholders');
            }
        }

        let currentSlide = 0;
        let autoPlayInterval = null;
        let slides = [];

        function updateStatus(message) {
            console.log('Status:', message);
        }

        function createSlides() {
            updateStatus('Creating slides...');
            const slideshow = document.getElementById('slideshow');
            slideshow.innerHTML = '';

            images.forEach((src, index) => {
                const slide = document.createElement('div');
                slide.className = 'slide';
                slide.id = \`slide\${index}\`;

                const img = document.createElement('img');
                img.src = src;
                img.alt = \`Slide \${index + 1}\`;

                img.onload = () => {
                    updateStatus(\`Image \${index + 1} loaded\`);
                };

                img.onerror = () => {
                    updateStatus(\`Image \${index + 1} failed\`);
                };

                slide.appendChild(img);
                slideshow.appendChild(slide);
                slides.push(slide);
            });

            updateStatus(\`Created \${slides.length} slides\`);
        }

        function showSlide(index) {
            updateStatus(\`Showing slide \${index + 1}\`);
            
            // Hide all slides
            slides.forEach((slide, i) => {
                slide.classList.remove('active');
            });
            
            // Show current slide
            slides[index].classList.add('active');
            
            currentSlide = index;
            updateCounter();
        }

        function nextSlide() {
            let next = currentSlide + 1;
            if (next >= slides.length) {
                next = 0;
            }
            showSlide(next);
        }

        function prevSlide() {
            let prev = currentSlide - 1;
            if (prev < 0) {
                prev = slides.length - 1;
            }
            showSlide(prev);
        }

        function updateCounter() {
            const counter = document.querySelector('.counter');
            if (counter) {
                counter.innerHTML = \`<span id="current">\${currentSlide + 1}</span> / <span id="total">\${slides.length}</span>\`;
            }
        }

        function startAutoPlay() {
            stopAutoPlay();
            autoPlayInterval = setInterval(nextSlide, 4000);
            updateStatus('Auto-play started');
        }

        function stopAutoPlay() {
            if (autoPlayInterval) {
                clearInterval(autoPlayInterval);
                autoPlayInterval = null;
            }
            updateStatus('Auto-play stopped');
        }

        function createControls() {
            const controls = document.createElement('div');
            controls.className = 'controls';

            const prevBtn = document.createElement('button');
            prevBtn.className = 'btn';
            prevBtn.textContent = '←';
            prevBtn.onclick = () => {
                prevSlide();
            };

            const counter = document.createElement('div');
            counter.className = 'counter';
            counter.innerHTML = '<span id="current">1</span> / <span id="total">' + slides.length + '</span>';

            const nextBtn = document.createElement('button');
            nextBtn.className = 'btn';
            nextBtn.textContent = '→';
            nextBtn.onclick = () => {
                nextSlide();
            };

            controls.appendChild(prevBtn);
            controls.appendChild(counter);
            controls.appendChild(nextBtn);

            document.body.appendChild(controls);
        }

        function hideLoading() {
            document.getElementById('loading').style.display = 'none';
        }

        // Farcaster Frame ready() call
        let readyCalled = false;

        function callReady() {
            if (readyCalled) return;
            
            console.log('🚀 Calling ready() to remove splash screen...');
            
            try {
                // Method 1: Try global ready function (primary method)
                if (typeof ready === 'function') {
                    ready();
                    console.log('✅ Global ready() function called');
                }
                // Method 2: Try window.farcaster.ready
                else if (window.farcaster && window.farcaster.ready) {
                    window.farcaster.ready();
                    console.log('✅ window.farcaster.ready() called');
                }
                // Method 3: Try postMessage to parent
                else if (window.parent && window.parent.postMessage) {
                    window.parent.postMessage({ type: 'ready' }, '*');
                    console.log('✅ postMessage ready sent to parent');
                }
                // Method 4: Try sdk.actions.ready if available
                else if (window.sdk && window.sdk.actions && window.sdk.actions.ready) {
                    window.sdk.actions.ready();
                    console.log('✅ window.sdk.actions.ready() called');
                }
                // Method 5: Try Farcaster mini app specific methods
                else if (window.farcaster && window.farcaster.actions && window.farcaster.actions.ready) {
                    window.farcaster.actions.ready();
                    console.log('✅ window.farcaster.actions.ready() called');
                }
                // Method 6: Try action.ready directly
                else if (typeof action !== 'undefined' && action && action.ready) {
                    action.ready();
                    console.log('✅ action.ready() called');
                }
                // Method 7: Try window.action.ready
                else if (window.action && window.action.ready) {
                    window.action.ready();
                    console.log('✅ window.action.ready() called');
                }
                else {
                    console.log('⚠️ No ready methods found, but continuing...');
                }
                
                readyCalled = true;
                console.log('🎉 Ready called - splash screen should be removed');
                
            } catch (error) {
                console.error('❌ Error calling ready():', error);
                readyCalled = true; // Prevent infinite retries
            }
        }

        // Initialize
        document.addEventListener('DOMContentLoaded', async () => {
            updateStatus('Frame loaded, initializing...');
            
            // Call ready() immediately when page loads
            console.log('🎯 Calling ready() immediately on page load');
            callReady();
            
            try {
                await loadImagesFromAPI();
                createSlides();
                createControls();
                showSlide(0);
                hideLoading();
                
                // Start auto-play immediately
                startAutoPlay();
                
                // Call ready() again after everything is loaded
                console.log('🎯 Calling ready() again after slideshow is ready');
                callReady();
                
                // Fallback: call ready after 1 second if not called yet
                setTimeout(() => {
                    if (!readyCalled) {
                        console.log('⏰ Fallback: calling ready() after timeout');
                        callReady();
                    }
                }, 1000);
                
            } catch (error) {
                console.error('❌ Initialization error:', error);
                // Still try to call ready() even if there's an error
                callReady();
            }
        });

        // Also call ready when window loads
        window.addEventListener('load', () => {
            console.log('🌐 Window loaded, calling ready()');
            callReady();
        });

        // Multiple fallback timeouts to ensure ready is called
        setTimeout(() => {
            console.log('⏰ 500ms timeout: calling ready()');
            callReady();
        }, 500);

        setTimeout(() => {
            console.log('⏰ 2s timeout: calling ready()');
            callReady();
        }, 2000);

        setTimeout(() => {
            console.log('⏰ 5s timeout: calling ready()');
            callReady();
        }, 5000);

        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    prevSlide();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    nextSlide();
                    break;
            }
        });
    </script>
</body>
</html>`;

  // Return the Frame HTML
  res.status(200).send(frameHtml);
} 