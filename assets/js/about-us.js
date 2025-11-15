/* ============================================
   ABOUT US PAGE - JavaScript
   Sky Design Solutions
   ============================================ */

// ============================================
// TYPING ANIMATION FOR TITLE
// ============================================

document.addEventListener('DOMContentLoaded', function() {

    // Typing Animation Configuration
    const typingElement = document.getElementById('typingWord');

    if (typingElement) {
        // Words to cycle through
        const words = ['designs', 'creates', 'innovates', 'builds', 'transforms', 'evolves'];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function typeWord() {
            const currentWord = words[wordIndex];
            let typingSpeed;

            if (isDeleting) {
                // DELETING: Remove characters one by one (backspace effect)
                charIndex--;
                typingElement.textContent = currentWord.substring(0, charIndex);
                typingSpeed = 80; // Fast deletion

                // When word is fully deleted
                if (charIndex === 0) {
                    isDeleting = false;
                    wordIndex = (wordIndex + 1) % words.length; // Move to next word
                    typingSpeed = 500; // Short pause before typing next word
                }
            } else {
                // TYPING: Add characters one by one (typewriter effect)
                charIndex++;
                typingElement.textContent = currentWord.substring(0, charIndex);
                typingSpeed = 120; // Moderate typing speed

                // When word is fully typed
                if (charIndex === currentWord.length) {
                    isDeleting = true;
                    typingSpeed = 2500; // Long pause to read the word
                }
            }

            // Continue the animation
            setTimeout(typeWord, typingSpeed);
        }

        // Start typing animation after 800ms
        setTimeout(typeWord, 800);

        console.log('✅ Typing animation initialized!');
    } else {
        console.warn('⚠️ Typing element #typingWord not found');
    }
});

// ============================================
// SCROLL ANIMATIONS (Future Enhancement)
// ============================================

// Add intersection observer for scroll animations if needed
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.skydesignsol-animate-in');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initScrollAnimations);

// ============================================
// STATS COUNTER ANIMATION (Future Enhancement)
// ============================================

function animateCounters() {
    const counters = document.querySelectorAll('.skydesignsol-about-stat-number');

    counters.forEach(counter => {
        const target = counter.innerText;
        const isPercentage = target.includes('%');
        const isPlus = target.includes('+');
        const hasM = target.includes('M');

        // Extract numeric value
        let numericValue = parseFloat(target.replace(/[^0-9.]/g, ''));

        // Animation configuration
        const duration = 2000; // 2 seconds
        const frameDuration = 1000 / 60; // 60 FPS
        const totalFrames = Math.round(duration / frameDuration);
        let frame = 0;

        const animate = () => {
            frame++;
            const progress = frame / totalFrames;
            const currentValue = numericValue * progress;

            // Format the number
            let displayValue = currentValue.toFixed(1);

            // Add suffix
            if (hasM) displayValue += 'M';
            if (isPlus) displayValue += '+';
            if (isPercentage) displayValue += '%';

            counter.innerText = displayValue;

            if (frame < totalFrames) {
                requestAnimationFrame(animate);
            } else {
                counter.innerText = target; // Set final value
            }
        };

        // Start animation when element is visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animate();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(counter);
    });
}

// Initialize counter animation
document.addEventListener('DOMContentLoaded', animateCounters);

console.log('About Us page JavaScript loaded successfully!');
