/**
 * Gallery Data - Barbara Hendrickson Art
 * 
 * Add your paintings to this array. Each painting object should have:
 * - id: unique identifier
 * - title: name of the painting
 * - medium: e.g., "Oil on Canvas"
 * - dimensions: e.g., "24\" x 36\""
 * - year: year created (optional)
 * - image: path to the web-resolution image (recommend 1200-1600px on longest side)
 * - thumbnail: path to thumbnail (optional, will use image if not provided)
 * - description: brief description (optional)
 * - available: boolean indicating if for sale (optional, for future use)
 * - price: price if available (optional, for future use)
 */

const paintings = [
    { id: 1, title: "Four Women", medium: "Oil on Canvas", image: "images/paintings/Hendrickson-06.jpg" },
    { id: 2, title: "Small Talk", medium: "Oil on Canvas", image: "images/paintings/Hendrickson-07.jpg" },
    { id: 3, title: "Jazz Dancer 1", medium: "Oil on Canvas", image: "images/paintings/Hendrickson-08.jpg" },
    { id: 4, title: "Stalking Dancer", medium: "Oil on Canvas", image: "images/paintings/Hendrickson-09.jpg" },
    { id: 5, title: "Untitled", medium: "Oil on Canvas", image: "images/paintings/Hendrickson-10.jpg" },
    { id: 6, title: "Man Relaxing with Flowers", medium: "Oil on Canvas", image: "images/paintings/Hendrickson-11.jpg" },
    { id: 7, title: "Sisters with a Black Cat", medium: "Oil on Canvas", image: "images/paintings/Hendrickson-12.jpg" },
    { id: 8, title: "Untitled", medium: "Oil on Canvas", image: "images/paintings/Hendrickson-13.jpg" },
    { id: 9, title: "Untitled", medium: "Oil on Canvas", image: "images/paintings/Hendrickson-14.jpg" },
    { id: 10, title: "Untitled", medium: "Oil on Canvas", image: "images/paintings/Hendrickson-15.jpg" },
    { id: 11, title: "Untitled", medium: "Oil on Canvas", image: "images/paintings/Hendrickson-16.jpg" },
    { id: 12, title: "Untitled", medium: "Oil on Canvas", image: "images/paintings/Hendrickson-17.jpg" },
    { id: 13, title: "Untitled", medium: "Oil on Canvas", image: "images/paintings/Hendrickson-18.jpg" },
    { id: 14, title: "Untitled", medium: "Oil on Canvas", image: "images/paintings/Hendrickson-19.jpg" },
    { id: 15, title: "Untitled", medium: "Charcoal", image: "images/paintings/Hendrickson-20.jpg" },
    { id: 16, title: "Untitled", medium: "Oil on Canvas", image: "images/paintings/Hendrickson-21.jpg" },
    { id: 17, title: "Untitled", medium: "Oil on Canvas", image: "images/paintings/Hendrickson-22.jpg" },
    { id: 18, title: "Untitled", medium: "Oil on Canvas", image: "images/paintings/Hendrickson-23.jpg" },
    { id: 19, title: "Untitled", medium: "Oil on Canvas", image: "images/paintings/Hendrickson-24.jpg" },
    { id: 20, title: "Untitled", medium: "Oil on Canvas", image: "images/paintings/Hendrickson-25.jpg" },
    { id: 21, title: "Untitled", medium: "Oil on Canvas", image: "images/paintings/Hendrickson-26.jpg" },
    { id: 22, title: "Untitled", medium: "Oil on Canvas", image: "images/paintings/Hendrickson-27.jpg" },
    { id: 23, title: "Untitled", medium: "Oil on Canvas", image: "images/paintings/Hendrickson-28.jpg" },
    { id: 24, title: "Untitled", medium: "Oil on Canvas", image: "images/paintings/Hendrickson-29.jpg" },
    { id: 25, title: "Untitled", medium: "Oil on Canvas", image: "images/paintings/Hendrickson-30.jpg" },
    { id: 26, title: "Untitled", medium: "Oil on Canvas", image: "images/paintings/Hendrickson-31.jpg" },
    { id: 27, title: "Untitled", medium: "Oil on Canvas", image: "images/paintings/Hendrickson-32.jpg" },
];

/**
 * Gallery Class - Handles gallery rendering and lightbox functionality
 */
class Gallery {
    constructor(paintings) {
        this.paintings = paintings;
        this.currentIndex = 0;
        this.galleryGrid = document.getElementById('gallery-grid');
        this.lightbox = document.getElementById('lightbox');
        this.lightboxImage = document.getElementById('lightbox-image');
        this.lightboxTitle = document.querySelector('.lightbox-title');
        this.lightboxDetails = document.querySelector('.lightbox-details');
        
        this.init();
    }
    
    init() {
        this.renderGallery();
        this.bindEvents();
    }
    
    /**
     * Render all gallery items to the grid
     */
    renderGallery() {
        if (!this.galleryGrid || this.paintings.length === 0) return;
        
        // Clear placeholder content
        this.galleryGrid.innerHTML = '';
        
        this.paintings.forEach((painting, index) => {
            const item = document.createElement('div');
            item.className = 'gallery-item';
            item.dataset.index = index;
            
            item.innerHTML = `
                <div class="gallery-item-inner">
                    <img src="${painting.thumbnail || painting.image}" 
                         alt="${painting.title}"
                         loading="lazy"
                         draggable="false">
                    <div class="gallery-overlay">
                        <span class="painting-title">${painting.title}</span>
                        <span class="painting-medium">${painting.medium}</span>
                    </div>
                </div>
            `;
            
            this.galleryGrid.appendChild(item);
        });
    }
    
    /**
     * Bind event listeners
     */
    bindEvents() {
        // Gallery item clicks
        if (this.galleryGrid) {
            this.galleryGrid.addEventListener('click', (e) => {
                const item = e.target.closest('.gallery-item');
                if (item) {
                    const index = parseInt(item.dataset.index, 10);
                    this.openLightbox(index);
                }
            });
        }
        
        // Lightbox controls
        if (this.lightbox) {
            // Close button
            this.lightbox.querySelector('.lightbox-close').addEventListener('click', () => {
                this.closeLightbox();
            });
            
            // Previous button
            this.lightbox.querySelector('.lightbox-prev').addEventListener('click', () => {
                this.previousImage();
            });
            
            // Next button
            this.lightbox.querySelector('.lightbox-next').addEventListener('click', () => {
                this.nextImage();
            });
            
            // Fullscreen button
            const fullscreenBtn = document.getElementById('fullscreen-btn');
            if (fullscreenBtn) {
                fullscreenBtn.addEventListener('click', () => {
                    this.toggleFullscreen();
                });
            }
            
            // Close on background click
            this.lightbox.addEventListener('click', (e) => {
                if (e.target === this.lightbox) {
                    this.closeLightbox();
                }
            });
            
            // Keyboard navigation
            document.addEventListener('keydown', (e) => {
                if (!this.lightbox.classList.contains('active')) return;
                
                switch (e.key) {
                    case 'Escape':
                        if (this.lightbox.classList.contains('fullscreen')) {
                            this.exitFullscreen();
                        } else {
                            this.closeLightbox();
                        }
                        break;
                    case 'ArrowLeft':
                        this.previousImage();
                        break;
                    case 'ArrowRight':
                        this.nextImage();
                        break;
                    case 'f':
                    case 'F':
                        this.toggleFullscreen();
                        break;
                }
            });
        }
        
        // Prevent right-click on images (additional protection)
        document.addEventListener('contextmenu', (e) => {
            if (e.target.tagName === 'IMG') {
                e.preventDefault();
                return false;
            }
        });
    }
    
    /**
     * Open lightbox with specified image
     */
    openLightbox(index) {
        if (index < 0 || index >= this.paintings.length) return;
        
        this.currentIndex = index;
        const painting = this.paintings[index];
        
        this.lightboxImage.src = painting.image;
        this.lightboxImage.alt = painting.title;
        this.lightboxTitle.textContent = painting.title;
        
        // Build details string
        let details = painting.medium;
        if (painting.dimensions) details += ` • ${painting.dimensions}`;
        if (painting.year) details += ` • ${painting.year}`;
        this.lightboxDetails.textContent = details;
        
        this.lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    /**
     * Close lightbox
     */
    closeLightbox() {
        this.lightbox.classList.remove('active');
        this.lightbox.classList.remove('fullscreen');
        document.body.style.overflow = '';
        
        // Exit browser fullscreen if active
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
    }
    
    /**
     * Toggle fullscreen mode
     */
    toggleFullscreen() {
        if (this.lightbox.classList.contains('fullscreen')) {
            this.exitFullscreen();
        } else {
            this.enterFullscreen();
        }
    }
    
    /**
     * Enter fullscreen mode
     */
    enterFullscreen() {
        this.lightbox.classList.add('fullscreen');
        
        // Request browser fullscreen for immersive experience
        if (this.lightbox.requestFullscreen) {
            this.lightbox.requestFullscreen();
        } else if (this.lightbox.webkitRequestFullscreen) {
            this.lightbox.webkitRequestFullscreen();
        }
    }
    
    /**
     * Exit fullscreen mode
     */
    exitFullscreen() {
        this.lightbox.classList.remove('fullscreen');
        
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else if (document.webkitFullscreenElement) {
            document.webkitExitFullscreen();
        }
    }
    
    /**
     * Show previous image
     */
    previousImage() {
        const newIndex = this.currentIndex === 0 
            ? this.paintings.length - 1 
            : this.currentIndex - 1;
        this.openLightbox(newIndex);
    }
    
    /**
     * Show next image
     */
    nextImage() {
        const newIndex = this.currentIndex === this.paintings.length - 1 
            ? 0 
            : this.currentIndex + 1;
        this.openLightbox(newIndex);
    }
}

// Initialize gallery when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize if there are paintings
    if (paintings && paintings.length > 0) {
        window.gallery = new Gallery(paintings);
    }
});
