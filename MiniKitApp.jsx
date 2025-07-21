import React, { useState, useEffect, useRef } from 'react';
import { useIsInMiniApp, useMiniAppSDK } from '@coinbase/minikit';

const MiniKitApp = () => {
  const [images, setImages] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [readyCalled, setReadyCalled] = useState(false);
  const autoPlayIntervalRef = useRef(null);
  
  const isInMiniApp = useIsInMiniApp();
  const sdk = useMiniAppSDK();

  // Call ready() to remove splash screen
  const callReady = async () => {
    if (readyCalled) return;
    
    console.log('🚀 Calling ready() to remove splash screen...');
    
    try {
      if (sdk && sdk.actions && sdk.actions.ready) {
        await sdk.actions.ready();
        console.log('✅ sdk.actions.ready() called successfully');
        setReadyCalled(true);
        return true;
      } else {
        console.log('⚠️ SDK ready() not available, using fallback');
        setReadyCalled(true);
        return true;
      }
    } catch (error) {
      console.log(`❌ Error calling ready(): ${error.message}`);
      setReadyCalled(true);
      return true;
    }
  };

  // Load images from API
  const loadImagesFromAPI = async () => {
    try {
      console.log('📸 Loading images from API...');
      
      const response = await fetch('/api/photos?folder=new-day-one&limit=50');
      
      if (!response.ok) {
        throw new Error(`API failed: ${response.status}`);
      }
      
      const data = await response.json();
      const apiImages = data.photos || [];
      
      if (apiImages.length > 0) {
        const imageUrls = apiImages.map(photo => photo.src || photo.url);
        setImages(imageUrls);
        console.log(`✅ Loaded ${imageUrls.length} images from API`);
      } else {
        throw new Error('No images found in API response');
      }
      
    } catch (error) {
      console.log(`❌ API failed: ${error.message}`);
      
      // Fallback to local images
      const fallbackImages = [
        '/images/L1000031.JPG',
        '/images/L1000032.JPG',
        '/images/L1000036.JPG',
        '/images/L1000039.jpg',
        '/images/L1000048.jpg',
        '/images/L1000057.jpg',
        '/images/L1000058.jpg',
        '/images/L1000111.jpg',
        '/images/L1000151.jpg',
        '/images/L1000172.jpg'
      ];
      setImages(fallbackImages);
      console.log(`⚠️ Using ${fallbackImages.length} fallback images`);
    }
  };

  // Navigation functions
  const nextSlide = () => {
    if (images.length === 0) return;
    
    let next = currentSlide + 1;
    if (next >= images.length) {
      next = 0;
    }
    setCurrentSlide(next);
  };

  const prevSlide = () => {
    if (images.length === 0) return;
    
    let prev = currentSlide - 1;
    if (prev < 0) {
      prev = images.length - 1;
    }
    setCurrentSlide(prev);
  };

  // Auto-play functions
  const startAutoPlay = () => {
    stopAutoPlay();
    autoPlayIntervalRef.current = setInterval(nextSlide, 4000);
    console.log('▶️ Auto-play started');
  };

  const stopAutoPlay = () => {
    if (autoPlayIntervalRef.current) {
      clearInterval(autoPlayIntervalRef.current);
      autoPlayIntervalRef.current = null;
    }
  };

  // Handle navigation with auto-play restart
  const handleNavigation = (direction) => {
    if (direction === 'next') {
      nextSlide();
    } else {
      prevSlide();
    }
    startAutoPlay();
  };

  // Initialize app
  useEffect(() => {
    console.log('🚀 MiniKit Mini App loaded, initializing...');
    console.log(`📍 Mini App environment: ${isInMiniApp}`);
    
    // Call ready immediately
    callReady();
    
    // Load images
    loadImagesFromAPI();
  }, [isInMiniApp]);

  // Start auto-play when images are loaded
  useEffect(() => {
    if (images.length > 0 && !isLoading) {
      setIsLoading(false);
      setTimeout(() => {
        startAutoPlay();
      }, 1000);
    }
  }, [images, isLoading]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAutoPlay();
    };
  }, []);

  // Handle visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopAutoPlay();
      } else {
        if (!isLoading && images.length > 0) {
          startAutoPlay();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isLoading, images.length]);

  // Handle keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isLoading) return;
      
      switch(e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          handleNavigation('prev');
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleNavigation('next');
          break;
        case ' ':
          e.preventDefault();
          if (autoPlayIntervalRef.current) {
            stopAutoPlay();
          } else {
            startAutoPlay();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isLoading]);

  // Touch controls
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);

  const handleTouchStart = (e) => {
    setTouchStartX(e.changedTouches[0].screenX);
  };

  const handleTouchEnd = (e) => {
    if (isLoading) return;
    
    setTouchEndX(e.changedTouches[0].screenX);
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        handleNavigation('next');
      } else {
        handleNavigation('prev');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <div>Loading Film Experience...</div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="error-message">
        <div>⚠️ No images available</div>
        <div style={{ marginTop: '1rem', fontSize: '0.8rem' }}>
          Please check your connection and try again.
        </div>
      </div>
    );
  }

  return (
    <div className="slideshow-container">
      {/* Current slide */}
      <div className="slide active">
        <img 
          src={images[currentSlide]} 
          alt={`Slide ${currentSlide + 1}`}
          onLoad={() => console.log(`✅ Image ${currentSlide + 1} loaded`)}
          onError={() => console.log(`❌ Image ${currentSlide + 1} failed`)}
        />
      </div>

      {/* Controls */}
      <div className="controls">
        <button 
          className="btn" 
          onClick={() => handleNavigation('prev')}
        >
          <i className="fas fa-chevron-left"></i>
        </button>
        
        <div className="counter">
          <span id="current">{currentSlide + 1}</span> / <span id="total">{images.length}</span>
        </div>
        
        <button 
          className="btn" 
          onClick={() => handleNavigation('next')}
        >
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>

      {/* Touch handlers */}
      <div 
        className="touch-area"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 10
        }}
      />
    </div>
  );
};

export default MiniKitApp; 