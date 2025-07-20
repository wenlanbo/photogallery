// New Day One - Card Deck Experience
class CardDeckExperience {
    constructor() {
        this.currentIndex = 0;
        this.photos = [];
        this.isLoading = true;
        
        // DOM elements
        this.cardDeck = document.getElementById('cardDeck');
        this.loading = document.getElementById('loading');
        this.navigation = document.getElementById('navigation');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.currentIndexSpan = document.getElementById('currentIndex');
        this.totalCountSpan = document.getElementById('totalCount');
        
        // Verify DOM elements exist
        if (!this.cardDeck) {
            console.error('Card deck element not found!');
            return;
        }
        if (!this.loading) {
            console.error('Loading element not found!');
            return;
        }
        if (!this.navigation) {
            console.error('Navigation element not found!');
            return;
        }
        
        console.log('All DOM elements found, initializing...');
        this.init();
    }
    
    async init() {
        console.log('Initializing New Day One experience...');
        
        // Try to load photos from API first
        await this.loadPhotos();
        this.setupEventListeners();
        this.updateNavigation();
        this.showCurrentCard();
    }
    
    async loadPhotos() {
        try {
            console.log('Attempting to load photos from API...');
            
            // Load photos from the /new-day-one folder in Vercel Blob
            const response = await fetch('/api/photos?folder=new-day-one&limit=100');
            console.log('API Response status:', response.status);
            
            if (!response.ok) {
                throw new Error(`Failed to load photos: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('API Response data:', data);
            console.log('Total photos available:', data.total);
            console.log('Photos in current page:', data.photos ? data.photos.length : 0);
            
            this.photos = data.photos || [];
            console.log('Photos loaded:', this.photos.length);
            
            // If no photos found, try to search for cover images
            if (this.photos.length === 0) {
                console.log('No photos in new-day-one folder, searching for cover images...');
                const coverResponse = await fetch('/api/search-covers');
                const coverData = await coverResponse.json();
                console.log('Cover search result:', coverData);
                
                if (coverData.covers && coverData.covers.length > 0) {
                    console.log('Found cover images, using them...');
                    this.photos = coverData.covers;
                } else {
                    console.log('No cover images found, showing message...');
                    this.showNoPhotosMessage();
                    return;
                }
            }
            
            console.log('Final photos array:', this.photos);
            this.createCards();
            this.hideLoading();
            
        } catch (error) {
            console.error('Error loading photos:', error);
            console.log('Falling back to local images...');
            // Fallback to local images if API fails
            this.loadFallbackPhotos();
        }
    }
    
    loadFallbackPhotos() {
        console.log('Loading fallback photos from local images...');
        
        // Use some local images as fallback
        this.photos = [
            { src: '/images/724-10.JPG', alt: 'New Day One - 1' },
            { src: '/images/724-56.JPG', alt: 'New Day One - 2' },
            { src: '/images/724-62.JPG', alt: 'New Day One - 3' },
            { src: '/images/724-70.JPG', alt: 'New Day One - 4' },
            { src: '/images/84190002.JPG', alt: 'New Day One - 5' },
            { src: '/images/84190003.JPG', alt: 'New Day One - 6' }
        ];
        
        console.log('Fallback photos set:', this.photos.length);
        this.createCards();
        this.hideLoading();
    }
    
    createCards() {
        console.log('Creating cards for', this.photos.length, 'photos');
        console.log('Photos array:', this.photos);
        
        if (!this.cardDeck) {
            console.error('Card deck element not found!');
            return;
        }
        
        this.cardDeck.innerHTML = '';
        
        if (this.photos.length === 0) {
            console.error('No photos to create cards for!');
            return;
        }
        
        this.photos.forEach((photo, index) => {
            const card = document.createElement('div');
            card.className = 'card';
            card.dataset.index = index;
            
            // Add cover-card class to the first image
            if (index === 0) {
                card.classList.add('cover-card', 'active');
            }
            
            const img = document.createElement('img');
            const imageSrc = photo.src || photo.url;
            img.src = imageSrc;
            img.alt = photo.alt || `Photo ${index + 1}`;
            img.loading = 'lazy';
            
            // Add error handling for images
            img.onerror = () => {
                console.error(`Failed to load image: ${imageSrc}`);
                img.src = '/images/724-10.JPG'; // Fallback image
            };
            
            // Add success handler for images
            img.onload = () => {
                console.log(`Image loaded successfully: ${imageSrc}`);
            };
            
            console.log(`Creating card ${index + 1}:`, imageSrc);
            
            card.appendChild(img);
            this.cardDeck.appendChild(card);
            
            // Force the card to be visible
            card.style.opacity = '1';
            card.style.transform = 'translateX(0) rotateY(0deg)';
        });
        
        this.totalCountSpan.textContent = this.photos.length;
        console.log('Cards created, total count:', this.photos.length);
        
        // Force a reflow to ensure cards are visible
        this.cardDeck.offsetHeight;
        
        // Show the first card immediately
        setTimeout(() => {
            this.showCurrentCard();
        }, 100);
    }
    
    showCurrentCard() {
        const cards = this.cardDeck.querySelectorAll('.card');
        
        // For now, show all cards since we're using simplified layout
        cards.forEach((card, index) => {
            card.classList.remove('active', 'prev', 'next');
            card.classList.add('active'); // Show all cards
        });
        
        this.currentIndexSpan.textContent = this.currentIndex + 1;
        this.updateNavigation();
    }
    
    nextCard() {
        if (this.currentIndex < this.photos.length - 1) {
            this.currentIndex++;
            this.showCurrentCard();
        }
    }
    
    prevCard() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.showCurrentCard();
        }
    }
    
    updateNavigation() {
        // For simplified layout, disable navigation since all cards are visible
        this.prevBtn.disabled = true;
        this.nextBtn.disabled = true;
        
        // Update counter to show total
        this.currentIndexSpan.textContent = this.photos.length;
    }
    
    setupEventListeners() {
        // Navigation buttons
        this.prevBtn.addEventListener('click', () => this.prevCard());
        this.nextBtn.addEventListener('click', () => this.nextCard());
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    this.prevCard();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.nextCard();
                    break;
            }
        });
        
        // Card click to advance
        this.cardDeck.addEventListener('click', (e) => {
            if (e.target.closest('.card')) {
                this.nextCard();
            }
        });
        
        // Touch/swipe support for mobile
        let startX = 0;
        let startY = 0;
        
        this.cardDeck.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });
        
        this.cardDeck.addEventListener('touchend', (e) => {
            if (!startX || !startY) return;
            
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            
            const diffX = startX - endX;
            const diffY = startY - endY;
            
            // Only trigger if horizontal swipe is more significant than vertical
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    this.nextCard();
                } else {
                    this.prevCard();
                }
            }
            
            startX = 0;
            startY = 0;
        });
    }
    
    hideLoading() {
        console.log('Hiding loading, showing navigation');
        this.loading.style.display = 'none';
        this.navigation.style.display = 'flex';
    }
    
    showNoPhotosMessage() {
        this.loading.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <i class="fas fa-images" style="font-size: 3rem; color: #ccc; margin-bottom: 1rem;"></i>
                <p>No photos found in the New Day One collection.</p>
                <p style="font-size: 0.8rem; margin-top: 0.5rem;">Please add photos to the /new-day-one folder in Vercel Blob.</p>
                <p style="font-size: 0.7rem; margin-top: 0.5rem; color: #999;">Using fallback images for now.</p>
            </div>
        `;
        
        // Load fallback photos after showing the message
        setTimeout(() => {
            this.loadFallbackPhotos();
        }, 2000);
    }
    
    showErrorMessage() {
        this.loading.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #ff6b6b; margin-bottom: 1rem;"></i>
                <p>Failed to load photos.</p>
                <p style="font-size: 0.8rem; margin-top: 0.5rem;">Please try refreshing the page.</p>
            </div>
        `;
    }
}

// Initialize the experience when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Suppress Vercel service worker errors and GraphQL warnings
    window.addEventListener('error', (e) => {
        if (e.message.includes('mobx-state-tree') || 
            e.message.includes('sw.js') ||
            e.message.includes('graphql-tag') ||
            e.message.includes('fragment with name')) {
            e.preventDefault();
            return false;
        }
    });
    
    // Suppress console warnings from Vercel analytics
    const originalWarn = console.warn;
    console.warn = function(...args) {
        const message = args.join(' ');
        if (message.includes('fragment with name') || 
            message.includes('graphql-tag') ||
            message.includes('BaseJam') ||
            message.includes('RecordingLink')) {
            return; // Suppress these warnings
        }
        originalWarn.apply(console, args);
    };
    
    new CardDeckExperience();
}); 