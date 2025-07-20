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
            const response = await fetch('/api/photos?folder=new-day-one');
            console.log('API Response status:', response.status);
            
            if (!response.ok) {
                throw new Error(`Failed to load photos: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('API Response data:', data);
            
            this.photos = data.photos || [];
            console.log('Photos loaded:', this.photos.length);
            
            // If no photos found, show a message
            if (this.photos.length === 0) {
                console.log('No photos found, showing message...');
                this.showNoPhotosMessage();
                return;
            }
            
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
        this.cardDeck.innerHTML = '';
        
        this.photos.forEach((photo, index) => {
            const card = document.createElement('div');
            card.className = 'card';
            card.dataset.index = index;
            
            // Add cover-card class to the first image
            if (index === 0) {
                card.classList.add('cover-card');
            }
            
            const img = document.createElement('img');
            img.src = photo.src || photo.url;
            img.alt = photo.alt || `Photo ${index + 1}`;
            img.loading = 'lazy';
            
            console.log(`Creating card ${index + 1}:`, img.src);
            
            card.appendChild(img);
            this.cardDeck.appendChild(card);
        });
        
        this.totalCountSpan.textContent = this.photos.length;
        console.log('Cards created, total count:', this.photos.length);
    }
    
    showCurrentCard() {
        const cards = this.cardDeck.querySelectorAll('.card');
        
        cards.forEach((card, index) => {
            card.classList.remove('active', 'prev', 'next');
            
            if (index === this.currentIndex) {
                card.classList.add('active');
            } else if (index === this.currentIndex - 1) {
                card.classList.add('prev');
            } else if (index === this.currentIndex + 1) {
                card.classList.add('next');
            }
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
        this.prevBtn.disabled = this.currentIndex === 0;
        this.nextBtn.disabled = this.currentIndex === this.photos.length - 1;
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
    // Suppress Vercel service worker errors
    window.addEventListener('error', (e) => {
        if (e.message.includes('mobx-state-tree') || e.message.includes('sw.js')) {
            e.preventDefault();
            return false;
        }
    });
    
    new CardDeckExperience();
}); 