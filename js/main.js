/**
 * Main JavaScript - Barbara Hendrickson Art
 * Handles navigation and general UI interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    // Dynamically create hero slides from gallery images
    if (window.paintings && window.paintings.length > 0) {
        const heroSlideshow = document.querySelector('.hero-slideshow');
        if (heroSlideshow) {
            heroSlideshow.innerHTML = '';
            window.paintings.forEach((painting, idx) => {
                const slide = document.createElement('div');
                slide.className = 'hero-slide' + (idx === 0 ? ' active' : '');
                slide.style.backgroundImage = `url('${painting.image}')`;
                heroSlideshow.appendChild(slide);
            });
        }
    }

    // --- PURE OVERLAPPING FADE SLIDESHOW ---
    let heroSlideIndex = 0;
    let heroSlideTimer = null;
    const FADE_DURATION = 24000; // ms (was 12000)
    const SLIDE_DURATION = 24000; // ms (was 12000)

    function startHeroSlideshow() {
        const slides = document.querySelectorAll('.hero-slide');
        if (slides.length === 0) return;
        slides.forEach((slide, idx) => {
            slide.style.position = 'absolute';
            slide.style.top = '0';
            slide.style.left = '0';
            slide.style.width = '100%';
            slide.style.height = '100%';
            slide.style.transition = `opacity ${FADE_DURATION/1000}s`;
            slide.style.opacity = idx === 0 ? '1' : '0';
            slide.style.zIndex = idx === 0 ? '2' : '1';
            slide.classList.remove('active');
            slide.style.transform = '';
            slide.style.animation = '';
        });
        slides[0].classList.add('active');
        // Apply pan animation to first slide
        const { keyframes, animation, keyframeName } = getRandomPanKeyframes();
        injectPanKeyframes(keyframes, keyframeName);
        slides[0].style.animation = animation;
        heroSlideIndex = 0;
        scheduleNextSlide();
    }

    function scheduleNextSlide() {
        clearTimeout(heroSlideTimer);
        heroSlideTimer = setTimeout(() => {
            crossfadeToNextHeroSlide();
        }, SLIDE_DURATION);
    }

    function getRandomPanKeyframes() {
        const xStart = Math.floor(Math.random() * 40 - 20); // -20 to 20px
        const yStart = Math.floor(Math.random() * 40 - 20); // -20 to 20px
        const xEnd = Math.floor(Math.random() * 40 - 20);   // -20 to 20px
        const yEnd = Math.floor(Math.random() * 40 - 20);   // -20 to 20px
        const keyframeName = 'pan_' + Math.floor(Math.random() * 1000000);
        // Zoom from 4x to 5x
        const keyframes = `@keyframes ${keyframeName} {\n  0% { transform: scale(4) translate(${xStart}px, ${yStart}px); }\n  100% { transform: scale(5) translate(${xEnd}px, ${yEnd}px); }\n}`;
        const animation = `${keyframeName} 24s linear forwards`; // was 12s
        return { keyframes, animation, keyframeName };
    }

    function injectPanKeyframes(keyframes, keyframeName) {
        let styleTag = document.getElementById('pan-keyframes-' + keyframeName);
        if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.id = 'pan-keyframes-' + keyframeName;
            document.head.appendChild(styleTag);
        }
        styleTag.textContent = keyframes;
    }

    function crossfadeToNextHeroSlide() {
        const slides = document.querySelectorAll('.hero-slide');
        const current = slides[heroSlideIndex];
        const nextIndex = (heroSlideIndex + 1) % slides.length;
        const next = slides[nextIndex];

        // Only reset outgoing slide's opacity/zIndex, not animation/transform
        current.classList.remove('active');
        current.style.zIndex = '1';
        current.style.opacity = '0';

        // Apply new pan animation to incoming slide only
        const { keyframes, animation, keyframeName } = getRandomPanKeyframes();
        injectPanKeyframes(keyframes, keyframeName);
        next.style.zIndex = '2';
        next.style.opacity = '1';
        next.classList.add('active');
        next.style.animation = animation;
        next.style.transform = '';

        heroSlideIndex = nextIndex;
        scheduleNextSlide();
    }

    // Start the slideshow
    startHeroSlideshow();
    
    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.nav');
    
    if (mobileMenuToggle && nav) {
        mobileMenuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });
        
        nav.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            });
        });
    }
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Header background on scroll
    const header = document.querySelector('.header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = 'none';
        }
        
        lastScroll = currentScroll;
    });
    
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.about-section, .contact-section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
    
    // Disable drag on all images (additional protection)
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('dragstart', (e) => {
            e.preventDefault();
            return false;
        });
    });
});

// Move hero fullscreen button outside .hero-slideshow
// Find .hero element and insert button if not present
function ensureHeroFullscreenBtn() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    let btn = document.querySelector('.hero-fullscreen-btn');
    if (!btn) {
        btn = document.createElement('button');
        btn.className = 'hero-fullscreen-btn';
        btn.setAttribute('aria-label', 'Fullscreen');
        btn.style.position = 'absolute';
        btn.style.top = '80px';
        btn.style.right = '20px';
        btn.style.zIndex = '9999';
        btn.style.background = 'none';
        btn.style.border = 'none';
        btn.style.cursor = 'pointer';
        btn.style.padding = '0';
        btn.style.opacity = '0.7';
        btn.innerHTML = `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"></rect><polyline points="9 3 9 9 3 9"></polyline><polyline points="15 21 15 15 21 15"></polyline></svg>`;
        hero.appendChild(btn);
    }
    // Make sure pointer-events are set
    btn.style.pointerEvents = 'auto';
    // Attach click event for fullscreen
    btn.onclick = function() {
        const slideshow = document.querySelector('.hero-slideshow');
        if (!slideshow) return;
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            if (slideshow.requestFullscreen) {
                slideshow.requestFullscreen();
            } else if (slideshow.webkitRequestFullscreen) {
                slideshow.webkitRequestFullscreen();
            }
        }
    };
}

// Run on DOMContentLoaded
window.addEventListener('DOMContentLoaded', ensureHeroFullscreenBtn);

// --- Ken Burns Effect Helper ---
function getRandomKenBurns() {
    // Randomize zoom (scale) and pan (translate)
    const scaleStart = 1.1 + Math.random() * 0.1; // 1.1 - 1.2
    const scaleEnd = 1.0 + Math.random() * 0.1;   // 1.0 - 1.1
    const xStart = Math.floor(Math.random() * 20 - 10); // -10 to 10
    const yStart = Math.floor(Math.random() * 20 - 10); // -10 to 10
    const xEnd = Math.floor(Math.random() * 20 - 10);   // -10 to 10
    const yEnd = Math.floor(Math.random() * 20 - 10);   // -10 to 10
    const keyframeName = 'kenburns_' + Math.floor(Math.random() * 1000000);
    const keyframes = `@keyframes ${keyframeName} {
      0% { transform: scale(${scaleStart}) translate(${xStart}px, ${yStart}px); }
      100% { transform: scale(${scaleEnd}) translate(${xEnd}px, ${yEnd}px); }
    }`;
    const animation = `${keyframeName} 6s linear forwards`;
    return { keyframes, animation };
}

function injectKeyframes(keyframes) {
    // Remove previous dynamic keyframes if needed
    let styleTag = document.getElementById('kenburns-keyframes');
    if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = 'kenburns-keyframes';
        document.head.appendChild(styleTag);
    }
    styleTag.textContent = keyframes;
}

// Add Gallery Fullscreen Button next to Gallery heading
window.addEventListener('DOMContentLoaded', function() {
    const gallerySection = document.querySelector('.gallery-section');
    const galleryGrid = document.getElementById('gallery-grid');
    const gallerySubtitle = gallerySection ? gallerySection.querySelector('.section-subtitle') : null;
    // Thumbnail mode toggle button below subtitle
    if (galleryGrid && gallerySubtitle && !document.querySelector('.gallery-thumb-toggle-btn')) {
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'gallery-thumb-toggle-btn';
        toggleBtn.textContent = 'Fill Thumbnail Positions';
        toggleBtn.style.fontSize = '1.1rem';
        toggleBtn.style.padding = '0.75rem 1.5rem';
        toggleBtn.style.border = '1px solid var(--color-accent)';
        toggleBtn.style.background = 'none';
        toggleBtn.style.color = 'var(--color-accent)';
        toggleBtn.style.cursor = 'pointer';
        toggleBtn.style.borderRadius = '4px';
        toggleBtn.style.transition = 'background 0.3s, color 0.3s';
        let fitMode = true;
        setTimeout(() => {
            const imgs = galleryGrid.querySelectorAll('img');
            imgs.forEach(img => {
                img.style.objectFit = 'contain';
                img.style.background = '#222';
            });
        }, 0);
        toggleBtn.onclick = function() {
            fitMode = !fitMode;
            const imgs = galleryGrid.querySelectorAll('img');
            imgs.forEach(img => {
                img.style.objectFit = fitMode ? 'contain' : 'cover';
                img.style.background = fitMode ? '#222' : 'none';
            });
            toggleBtn.textContent = fitMode ? 'Fill Thumbnail Positions' : 'Show Entire Image';
        };
        // Insert after gallery subtitle
        gallerySubtitle.parentNode.insertBefore(toggleBtn, gallerySubtitle.nextSibling);
    }
    // Slideshow button below gallery grid
    if (galleryGrid && !document.querySelector('.gallery-fullscreen-btn')) {
        const fsBtn = document.createElement('button');
        fsBtn.className = 'gallery-fullscreen-btn';
        fsBtn.setAttribute('aria-label', 'Fullscreen Gallery Slideshow');
        fsBtn.innerHTML = `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"></rect><polyline points="9 3 9 9 3 9"></polyline><polyline points="15 21 15 15 21 15"></polyline></svg> Slideshow`;
        fsBtn.style.position = 'static';
        fsBtn.style.margin = '2.5rem 0 0 0';
        fsBtn.style.verticalAlign = 'middle';
        fsBtn.style.fontSize = '1.1rem';
        fsBtn.style.display = 'inline-flex';
        fsBtn.style.alignItems = 'center';
        fsBtn.style.gap = '0.5rem';
        fsBtn.addEventListener('click', openGalleryFullscreen);
        // Insert after gallery grid
        galleryGrid.parentNode.insertBefore(fsBtn, galleryGrid.nextSibling);
    }
});

// Animated fullscreen gallery slideshow with 6s static, 6s crossfade, and delayed title
let gallerySlideshowTimer = null;
function openGalleryFullscreen() {
    let overlay = document.querySelector('.gallery-fullscreen-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'gallery-fullscreen-overlay';
        overlay.innerHTML = `
            <div class="gallery-fullscreen-slides">
                <img class="gallery-fullscreen-image" src="" alt="" draggable="false" style="opacity:1; position:absolute; left:0; top:0; width:100vw; height:100vh; object-fit:contain; background:#000; transition:opacity 6s;">
                <img class="gallery-fullscreen-image next" src="" alt="" draggable="false" style="opacity:0; position:absolute; left:0; top:0; width:100vw; height:100vh; object-fit:contain; background:#000; transition:opacity 6s;">
            </div>
            <div class="gallery-fullscreen-title" style="position:absolute;bottom:40px;left:40px;color:#fff;font-family:'Cormorant Garamond',serif;font-size:2.2rem;font-weight:400;opacity:0;pointer-events:none;text-align:left;text-shadow:0 2px 10px rgba(0,0,0,0.5);transition:opacity 1.5s;z-index:10002;"></div>
            <button class="gallery-fullscreen-exit" aria-label="Exit Fullscreen">&times;</button>
        `;
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';
        overlay.style.background = '#000';
        overlay.style.zIndex = '10000';
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        overlay.style.opacity = '0';
        overlay.style.visibility = 'hidden';
        overlay.style.transition = 'opacity 0.5s, visibility 0.5s';
        document.body.appendChild(overlay);
    }
    overlay.classList.add('active');
    overlay.style.opacity = '1';
    overlay.style.visibility = 'visible';
    document.body.style.overflow = 'hidden';
    let index = 0;
    const images = window.paintings.map(p => p.image);
    const titles = window.paintings.map(p => p.title);
    const slides = overlay.querySelector('.gallery-fullscreen-slides');
    const imgA = slides.querySelector('.gallery-fullscreen-image:not(.next)');
    const imgB = slides.querySelector('.gallery-fullscreen-image.next');
    const titleEl = overlay.querySelector('.gallery-fullscreen-title');
    let showingA = true;
    let titleTimeout = null;
    function crossfade(toIdx) {
        // Start crossfade
        if (showingA) {
            imgB.src = images[toIdx];
            imgB.style.opacity = '0';
            setTimeout(() => {
                imgB.style.transition = 'opacity 6s';
                imgB.style.opacity = '1';
                imgA.style.opacity = '0';
            }, 100);
        } else {
            imgA.src = images[toIdx];
            imgA.style.opacity = '0';
            setTimeout(() => {
                imgA.style.transition = 'opacity 6s';
                imgA.style.opacity = '1';
                imgB.style.opacity = '0';
            }, 100);
        }
        // Delay title overlay to announce next image
        if (titleTimeout) clearTimeout(titleTimeout);
        titleEl.style.opacity = '0';
        titleTimeout = setTimeout(() => {
            titleEl.textContent = `"${titles[toIdx] || ''}"`;
            titleEl.style.opacity = '1';
            setTimeout(() => {
                titleEl.style.opacity = '0';
            }, 5000); // Show for 5s
        }, 3000); // Show title 3s into crossfade
        showingA = !showingA;
    }
    // Initial image and title
    imgA.src = images[index];
    imgA.style.opacity = '1';
    imgB.style.opacity = '0';
    titleEl.textContent = `"${titles[index] || ''}"`;
    titleEl.style.opacity = '1';
    setTimeout(() => {
        titleEl.style.opacity = '0';
    }, 5000);
    if (gallerySlideshowTimer) clearInterval(gallerySlideshowTimer);
    gallerySlideshowTimer = setInterval(() => {
        index = (index + 1) % images.length;
        crossfade(index);
    }, 12000); // 6s static + 6s crossfade
    overlay.querySelector('.gallery-fullscreen-exit').onclick = closeGalleryFullscreen;
    function keyHandler(e) {
        if (!overlay.classList.contains('active')) return;
        if (e.key === 'Escape') closeGalleryFullscreen();
    }
    document.addEventListener('keydown', keyHandler);
    overlay._keyHandler = keyHandler;
    // Enter browser fullscreen
    if (overlay.requestFullscreen) {
        overlay.requestFullscreen();
    } else if (overlay.webkitRequestFullscreen) {
        overlay.webkitRequestFullscreen();
    }
}
function closeGalleryFullscreen() {
    const overlay = document.querySelector('.gallery-fullscreen-overlay');
    if (overlay) {
        overlay.classList.remove('active');
        overlay.style.opacity = '0';
        overlay.style.visibility = 'hidden';
        document.body.style.overflow = '';
        document.removeEventListener('keydown', overlay._keyHandler);
        if (gallerySlideshowTimer) clearInterval(gallerySlideshowTimer);
    }
}
