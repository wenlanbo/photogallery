class PhotoGallery {
    constructor() {
        this.gallery = document.getElementById('gallery');
        this.loading = document.getElementById('loading');
        this.modal = document.getElementById('modal');
        this.modalImage = document.getElementById('modalImage');
        this.closeModalBtn = document.getElementById('closeModal');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        
        this.photos = [];
        this.currentPhotoIndex = 0;
        this.isLoading = false;
        this.page = 1;
        this.photosPerPage = 12;
        
        this.init();
    }
    
    async init() {
        this.loadPhotos();
        this.setupEventListeners();
        this.setupInfiniteScroll();
    }
    
    async loadPhotos() {
        if (this.isLoading) return;
        
        this.isLoading = true;
        this.showLoading(true);
        
        try {
            const newPhotos = await this.fetchPhotos();
            
            // If no more photos to load, stop infinite scroll
            if (newPhotos.length === 0) {
                this.showLoading(false);
                this.isLoading = false;
                return;
            }
            
            this.photos = [...this.photos, ...newPhotos];
            this.renderPhotos(newPhotos);
            this.page++;
            
        } catch (error) {
            console.error('Error loading photos:', error);
            this.showError('Failed to load photos. Please try again.');
        } finally {
            this.isLoading = false;
            this.showLoading(false);
        }
    }
    
    async fetchPhotos() {
        try {
            console.log(`Fetching photos: page=${this.page}, limit=${this.photosPerPage}`);
            
            const response = await fetch(`/api/photos?page=${this.page}&limit=${this.photosPerPage}`);
            
            if (!response.ok) {
                console.error(`API response not ok: ${response.status} ${response.statusText}`);
                throw new Error(`Failed to fetch photos: ${response.status}`);
            }
            
            const data = await response.json();
            console.log(`API response:`, data);
            
            // If no photos returned, use placeholder images
            if (data.photos.length === 0 && this.page === 1) {
                console.log('No photos returned from API, using placeholders');
                return this.getPlaceholderPhotos();
            }
            
            // Return empty array if no more photos (end of pagination)
            if (data.photos.length === 0) {
                console.log('No more photos available');
                return [];
            }
            
            console.log(`Returning ${data.photos.length} photos`);
            return data.photos;
            
        } catch (error) {
            console.error('Error fetching photos:', error);
            // Fall back to placeholder images if server is not running
            console.log('Using placeholder photos due to error');
            return this.getPlaceholderPhotos();
        }
    }
    
    getPlaceholderPhotos() {
        const startIndex = (this.page - 1) * this.photosPerPage;
        const endIndex = startIndex + this.photosPerPage;
        
        const photos = [];
        for (let i = startIndex; i < endIndex; i++) {
            photos.push({
                id: i,
                src: `https://picsum.photos/600/600?random=${i}`,
                alt: `Photo ${i + 1}`,
                thumbnail: `https://picsum.photos/300/300?random=${i}`
            });
        }
        
        return photos;
    }
    
    renderPhotos(photos) {
        photos.forEach(photo => {
            const galleryItem = this.createGalleryItem(photo);
            this.gallery.appendChild(galleryItem);
        });
        
        // Update observer for infinite scroll after adding new items
        this.observeLastItem();
    }
    
    createGalleryItem(photo) {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.dataset.photoId = photo.id;
        
        const img = document.createElement('img');
        img.src = photo.thumbnail;
        img.alt = photo.alt;
        img.loading = 'lazy';
        
        // Add click event to open modal
        item.addEventListener('click', () => {
            this.openModal(photo);
        });
        
        item.appendChild(img);
        return item;
    }
    
    openModal(photo) {
        this.currentPhotoIndex = this.photos.findIndex(p => p.id === photo.id);
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Hide buttons while loading
        this.hideModalButtons();
        
        // Load the full-size image
        this.modalImage.src = photo.src;
        this.modalImage.alt = photo.alt;
        
        // Show buttons when image loads
        this.modalImage.onload = () => {
            this.showModalButtons();
            this.updateNavigationButtons();
        };
        
        // Handle image load errors
        this.modalImage.onerror = () => {
            this.showModalButtons();
            this.updateNavigationButtons();
        };
    }
    
    closeModal() {
        this.modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    
    navigateModal(direction) {
        if (direction === 'prev') {
            this.currentPhotoIndex = this.currentPhotoIndex > 0 
                ? this.currentPhotoIndex - 1 
                : this.photos.length - 1;
        } else {
            this.currentPhotoIndex = this.currentPhotoIndex < this.photos.length - 1 
                ? this.currentPhotoIndex + 1 
                : 0;
        }
        
        const photo = this.photos[this.currentPhotoIndex];
        
        // Hide buttons while loading new image
        this.hideModalButtons();
        
        // Load the new image
        this.modalImage.src = photo.src;
        this.modalImage.alt = photo.alt;
        
        // Show buttons when image loads
        this.modalImage.onload = () => {
            this.showModalButtons();
            this.updateNavigationButtons();
        };
        
        // Handle image load errors
        this.modalImage.onerror = () => {
            this.showModalButtons();
            this.updateNavigationButtons();
        };
    }
    
    updateNavigationButtons() {
        this.prevBtn.style.display = this.photos.length > 1 ? 'block' : 'none';
        this.nextBtn.style.display = this.photos.length > 1 ? 'block' : 'none';
    }
    
    hideModalButtons() {
        this.closeModalBtn.style.display = 'none';
        this.prevBtn.style.display = 'none';
        this.nextBtn.style.display = 'none';
    }
    
    showModalButtons() {
        this.closeModalBtn.style.display = 'block';
        this.updateNavigationButtons();
    }
    
    setupEventListeners() {
        // Close modal events
        this.closeModalBtn.addEventListener('click', () => this.closeModal());
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.closeModal();
        });
        
        // Navigation events
        this.prevBtn.addEventListener('click', () => this.navigateModal('prev'));
        this.nextBtn.addEventListener('click', () => this.navigateModal('next'));
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!this.modal.classList.contains('active')) return;
            
            switch (e.key) {
                case 'Escape':
                    this.closeModal();
                    break;
                case 'ArrowLeft':
                    this.navigateModal('prev');
                    break;
                case 'ArrowRight':
                    this.navigateModal('next');
                    break;
            }
        });
    }
    
    setupInfiniteScroll() {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !this.isLoading) {
                        this.loadPhotos();
                    }
                });
            },
            {
                rootMargin: '200px'
            }
        );
        
        // Observe the loading element
        observer.observe(this.loading);
        
        // Also observe the last gallery item for better infinite scroll
        this.observeLastItem();
    }
    
    observeLastItem() {
        const galleryItems = this.gallery.querySelectorAll('.gallery-item');
        if (galleryItems.length > 0) {
            const lastItem = galleryItems[galleryItems.length - 1];
            
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting && !this.isLoading) {
                            this.loadPhotos();
                        }
                    });
                },
                {
                    rootMargin: '100px'
                }
            );
            
            observer.observe(lastItem);
        }
    }
    
    showLoading(show) {
        this.loading.style.display = show ? 'block' : 'none';
    }
    
    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            text-align: center;
            padding: 2rem;
            color: white;
            background: rgba(255, 0, 0, 0.1);
            border-radius: 8px;
            margin: 1rem 0;
        `;
        errorDiv.textContent = message;
        this.gallery.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }
}

// Initialize the gallery when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new PhotoGallery();
});

// Add some utility functions for better UX
window.addEventListener('load', () => {
    // Preload images for smoother experience
    const images = document.querySelectorAll('.gallery-item img');
    images.forEach(img => {
        if (img.complete) {
            img.style.opacity = '1';
        } else {
            img.addEventListener('load', () => {
                img.style.opacity = '1';
            });
        }
    });
}); 