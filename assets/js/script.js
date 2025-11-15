/*
╔═══════════════════════════════════════════════════════════════════════════════╗
║                                                                               ║
║                           SKY DESIGN SOLUTIONS                                ║
║                       Professional JavaScript v1.0                            ║
║                                                                               ║
╚═══════════════════════════════════════════════════════════════════════════════╝

Author: Sky Design Solutions Team
Version: 1.0.0
Last Updated: 2025
Description: Main JavaScript file for Sky Design Solutions website

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TABLE OF CONTENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. NAVIGATION
   - Navbar height variable management
   - Mobile menu toggle
   - Responsive behavior

2. FAQ ACCORDION
   - FAQ item toggle functionality
   - Smooth open/close animations
   - ARIA accessibility support

3. FOOTER
   - Footer link interactions
   - Scroll-triggered animations

4. TEAM CAROUSEL
   - Bootstrap carousel initialization
   - Auto-play configuration
   - Touch/swipe gestures
   - Keyboard navigation
   - Accessibility enhancements
   - Performance optimization

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/

// ============================================================
// 1. NAVIGATION - WordPress Compatible
// ============================================================

// ------------------------------------------------------------
// NAVBAR HEIGHT VARIABLE -> CSS --nav-h
// Ensures hero height subtracts the actual navbar height
// ------------------------------------------------------------
function setNavHeightVar() {
    try {
        const nav = document.getElementById('skydesignsolNav');
        if (!nav) return;

        const height = Math.ceil(nav.getBoundingClientRect().height);
        document.documentElement.style.setProperty('--nav-h', `${height}px`);
    } catch (e) {
        console.warn('Failed to set --nav-h:', e);
    }
}

// ------------------------------------------------------------
// MAIN NAVIGATION LOGIC
// ------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    const skydesignsolMobileBtn = document.getElementById('skydesignsolMobileBtn');
    const skydesignsolNavLinks = document.getElementById('skydesignsolNavLinks');
    const skydesignsolOverlay = document.getElementById('skydesignsolOverlay');

    if (!(skydesignsolMobileBtn && skydesignsolNavLinks && skydesignsolOverlay)) return;

    console.log('Sky Design Solutions - Navigation initialized successfully');

    // Mobile menu toggle
    skydesignsolMobileBtn.addEventListener('click', () => {
        const isActive = skydesignsolNavLinks.classList.toggle('skydesignsol-active');
        skydesignsolMobileBtn.classList.toggle('skydesignsol-active');
        skydesignsolOverlay.classList.toggle('skydesignsol-active');

        document.body.style.overflow = isActive ? 'hidden' : '';
        setTimeout(setNavHeightVar, 50);
    });

    // Overlay click closes menu
    skydesignsolOverlay.addEventListener('click', () => {
        skydesignsolMobileBtn.classList.remove('skydesignsol-active');
        skydesignsolNavLinks.classList.remove('skydesignsol-active');
        skydesignsolOverlay.classList.remove('skydesignsol-active');
        document.body.style.overflow = '';
        setTimeout(setNavHeightVar, 50);
    });

    // --------------------------------------------------------
    // RESPONSIVE BEHAVIOR
    // --------------------------------------------------------
    window.addEventListener('resize', (() => {
        let rafId = null;

        return function onResize() {
            if (window.innerWidth > 991.98) {
                skydesignsolMobileBtn.classList.remove('skydesignsol-active');
                skydesignsolNavLinks.classList.remove('skydesignsol-active');
                skydesignsolOverlay.classList.remove('skydesignsol-active');
                document.body.style.overflow = '';
            }

            if (rafId) cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(setNavHeightVar);
        };
    })());

    // Initialize nav height on load
    setNavHeightVar();
});

// ============================================================
// 2. FAQ ACCORDION - Interactive FAQ Section
// ============================================================

/**
 * Initialize FAQ Accordion Functionality
 * - Handles click events on FAQ questions
 * - Toggles open/closed states with smooth animations
 * - Updates ARIA attributes for accessibility
 */
document.addEventListener('DOMContentLoaded', () => {
    const faqItems = document.querySelectorAll('.skydesignsol-faq-item');

    if (faqItems.length === 0) return;

    console.log('Sky Design Solutions - FAQ Accordion initialized');

    faqItems.forEach(item => {
        const questionButton = item.querySelector('.skydesignsol-faq-question');
        const answerDiv = item.querySelector('.skydesignsol-faq-answer');

        if (!questionButton || !answerDiv) return;

        // Initialize: Set max-height for items that are already open
        if (item.classList.contains('skydesignsol-faq-item-open')) {
            answerDiv.style.maxHeight = answerDiv.scrollHeight + 'px';
        }

        questionButton.addEventListener('click', () => {
            const isOpen = item.classList.contains('skydesignsol-faq-item-open');

            if (isOpen) {
                // Close the current item
                // First set to current scrollHeight for smooth transition
                answerDiv.style.maxHeight = answerDiv.scrollHeight + 'px';

                // Force browser reflow
                answerDiv.offsetHeight;

                // Then collapse to 0
                answerDiv.style.maxHeight = '0px';
                item.classList.remove('skydesignsol-faq-item-open');
                questionButton.setAttribute('aria-expanded', 'false');
            } else {
                // Optional: Close other open items (uncomment for accordion behavior)
                // faqItems.forEach(otherItem => {
                //     const otherAnswer = otherItem.querySelector('.skydesignsol-faq-answer');
                //     if (otherAnswer) {
                //         otherAnswer.style.maxHeight = '0px';
                //     }
                //     otherItem.classList.remove('skydesignsol-faq-item-open');
                //     const otherButton = otherItem.querySelector('.skydesignsol-faq-question');
                //     if (otherButton) otherButton.setAttribute('aria-expanded', 'false');
                // });

                // Open the clicked item with smooth animation
                // First ensure it's at 0
                answerDiv.style.maxHeight = '0px';
                item.classList.add('skydesignsol-faq-item-open');
                questionButton.setAttribute('aria-expanded', 'true');

                // Then animate to the actual content height
                setTimeout(() => {
                    answerDiv.style.maxHeight = answerDiv.scrollHeight + 'px';
                }, 10);
            }
        });

        // Keyboard accessibility - Enter and Space keys
        questionButton.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                questionButton.click();
            }
        });
    });
});

// ============================================================
// 3. FOOTER - Enhanced Interactions & Animations
// ============================================================

// ------------------------------------------------------------
// Footer Navigation Link Interactions
// ------------------------------------------------------------

const footerLinks = document.querySelectorAll('.skydesignsol-footer-link');

footerLinks.forEach(link => {
    link.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
        this.style.textShadow = '0 2px 10px rgba(184, 212, 50, 0.3)';
    });
    
    link.addEventListener('mouseleave', function() {
        this.style.transform = '';
        this.style.textShadow = '';
    });
});

// ------------------------------------------------------------
// Scroll-Triggered Animations with Intersection Observer
// ------------------------------------------------------------

        const footerElements = document.querySelectorAll('.skydesignsol-footer-contact, .skydesignsol-footer-locations, .skydesignsol-footer-bottom');
        
        const scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.transform = 'translateY(0)';
                        entry.target.style.opacity = '1';
                        entry.target.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                    }, index * 200);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -30px 0px'
        });
        
        footerElements.forEach(element => {
            if (element) {
                element.style.transform = 'translateY(20px)';
                element.style.opacity = '0.8';
                scrollObserver.observe(element);
            }
        });

// ============================================================
// 4. TEAM CAROUSEL - Bootstrap Enhanced
// ============================================================

// ------------------------------------------------------------
// Team Carousel Initialization & Custom Controls
// ------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    const teamCarousel = document.getElementById('teamCarousel');

    if (!teamCarousel) {
        console.log('Team carousel not found on this page');
        return;
    }

    console.log('Sky Design Solutions - Team Carousel initialized successfully');

    // --------------------------------------------------------
    // CAROUSEL AUTO-PLAY CONFIGURATION
    // --------------------------------------------------------
    const carouselInstance = new bootstrap.Carousel(teamCarousel, {
        interval: 5000,  // Auto-advance every 5 seconds
        pause: 'hover',  // Pause on hover
        wrap: true,      // Loop continuously
        touch: true,     // Enable touch/swipe gestures
        keyboard: true   // Enable keyboard navigation
    });

    // --------------------------------------------------------
    // SMOOTH SLIDE ANIMATIONS
    // --------------------------------------------------------
    teamCarousel.addEventListener('slide.bs.carousel', (event) => {
        const activeItem = event.relatedTarget;

        // Add entrance animation class
        if (activeItem) {
            activeItem.classList.add('carousel-entering');
        }
    });

    teamCarousel.addEventListener('slid.bs.carousel', (event) => {
        const activeItem = teamCarousel.querySelector('.carousel-item.active');

        // Remove animation class after transition
        if (activeItem) {
            setTimeout(() => {
                activeItem.classList.remove('carousel-entering');
            }, 600);
        }
    });

    // --------------------------------------------------------
    // KEYBOARD NAVIGATION ENHANCEMENTS
    // --------------------------------------------------------
    document.addEventListener('keydown', (e) => {
        // Only handle if carousel is in viewport
        const carouselRect = teamCarousel.getBoundingClientRect();
        const isInViewport = carouselRect.top < window.innerHeight && carouselRect.bottom > 0;

        if (!isInViewport) return;

        if (e.key === 'ArrowLeft') {
            carouselInstance.prev();
            e.preventDefault();
        } else if (e.key === 'ArrowRight') {
            carouselInstance.next();
            e.preventDefault();
        }
    });

    // --------------------------------------------------------
    // TOUCH/SWIPE GESTURES OPTIMIZATION
    // --------------------------------------------------------
    let touchStartX = 0;
    let touchEndX = 0;
    const minSwipeDistance = 50;

    teamCarousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    teamCarousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipeGesture();
    }, { passive: true });

    function handleSwipeGesture() {
        const swipeDistance = touchEndX - touchStartX;

        if (Math.abs(swipeDistance) < minSwipeDistance) return;

        if (swipeDistance > 0) {
            // Swipe right - previous slide
            carouselInstance.prev();
        } else {
            // Swipe left - next slide
            carouselInstance.next();
        }
    }

    // --------------------------------------------------------
    // PAUSE ON SOCIAL LINK INTERACTION
    // --------------------------------------------------------
    const socialLinks = teamCarousel.querySelectorAll('.skydesignsol-team-social a');

    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            carouselInstance.pause();
        });

        link.addEventListener('mouseleave', () => {
            carouselInstance.cycle();
        });
    });

    // --------------------------------------------------------
    // ACCESSIBILITY: ANNOUNCE SLIDE CHANGES
    // --------------------------------------------------------
    teamCarousel.addEventListener('slid.bs.carousel', (event) => {
        const activeItem = teamCarousel.querySelector('.carousel-item.active');
        const teamName = activeItem.querySelector('.skydesignsol-team-carousel-name');
        const teamRole = activeItem.querySelector('.skydesignsol-team-carousel-role');

        if (teamName && teamRole) {
            // Create accessible announcement
            const announcement = `Now showing: ${teamName.textContent}, ${teamRole.textContent}`;

            // Create or update live region for screen readers
            let liveRegion = document.getElementById('carousel-live-region');
            if (!liveRegion) {
                liveRegion = document.createElement('div');
                liveRegion.id = 'carousel-live-region';
                liveRegion.className = 'visually-hidden';
                liveRegion.setAttribute('aria-live', 'polite');
                liveRegion.setAttribute('aria-atomic', 'true');
                teamCarousel.appendChild(liveRegion);
            }

            liveRegion.textContent = announcement;
        }
    });

    // --------------------------------------------------------
    // PRELOAD IMAGES FOR SMOOTH TRANSITIONS
    // --------------------------------------------------------
    const carouselImages = teamCarousel.querySelectorAll('.skydesignsol-team-carousel-image img');

    carouselImages.forEach(img => {
        const imgElement = new Image();
        imgElement.src = img.src;
    });

    // --------------------------------------------------------
    // PERFORMANCE: PAUSE WHEN NOT IN VIEWPORT
    // --------------------------------------------------------
    const carouselObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                carouselInstance.cycle();
            } else {
                carouselInstance.pause();
            }
        });
    }, {
        threshold: 0.3
    });

    carouselObserver.observe(teamCarousel);
});

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                            END OF SCRIPT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Sky Design Solutions © 2025
For support, please contact: support@skydesignsol.com

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/
