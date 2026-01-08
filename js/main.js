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
