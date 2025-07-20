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
        await this.loadPhotos();
        this.setupEventListeners();
        this.updateNavigation();
        this.showCurrentCard();
    }
    
    async loadPhotos() {
        try {
            // Load photos from the /new-day-one folder in Vercel Blob
            const response = await fetch('/api/photos?folder=new-day-one');
            if (!response.ok) {
                throw new Error('Failed to load photos');
            }
            
            const data = await response.json();
            this.photos = data.photos || [];
            
            // If no photos found, show a message
            if (this.photos.length === 0) {
                this.showNoPhotosMessage();
                return;
            }
            
            this.createCards();
            this.hideLoading();
            
        } catch (error) {
            console.error('Error loading photos:', error);
            this.showErrorMessage();
        }
    }
    
    createCards() {
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
            
            card.appendChild(img);
            this.cardDeck.appendChild(card);
        });
        
        this.totalCountSpan.textContent = this.photos.length;
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
        this.loading.style.display = 'none';
        this.navigation.style.display = 'flex';
    }
    
    showNoPhotosMessage() {
        this.loading.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <i class="fas fa-images" style="font-size: 3rem; color: #ccc; margin-bottom: 1rem;"></i>
                <p>No photos found in the New Day One collection.</p>
                <p style="font-size: 0.8rem; margin-top: 0.5rem;">Please add photos to the /new-day-one folder.</p>
            </div>
        `;
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
    new CardDeckExperience();
}); 