/**
 * Parallax Scroll Animation System
 * Implements GPU-accelerated parallax effects with performance optimization
 * Requirements: 2.4, 13.3
 */

class ParallaxController {
    constructor() {
        this.parallaxLayers = [];
        this.isActive = false;
        this.ticking = false;
        this.lastScrollY = 0;
        this.observer = null;
        
        this.init();
    }

    /**
     * Initialize the parallax system
     */
    init() {
        // Find all parallax elements
        this.parallaxLayers = Array.from(document.querySelectorAll('[data-parallax]'));
        
        if (this.parallaxLayers.length === 0) {
            console.warn('No parallax elements found');
            return;
        }

        // Apply GPU acceleration hints
        this.applyGPUAcceleration();
        
        // Set up Intersection Observer for lazy activation
        this.setupIntersectionObserver();
        
        // Bind scroll handler
        this.handleScroll = this.handleScroll.bind(this);
        
        console.log(`Parallax Controller initialized with ${this.parallaxLayers.length} layers`);
    }

    /**
     * Apply GPU acceleration properties to parallax layers
     */
    applyGPUAcceleration() {
        this.parallaxLayers.forEach(layer => {
            // Use will-change for GPU acceleration
            layer.style.willChange = 'transform';
            
            // Force GPU layer creation
            layer.style.transform = 'translateZ(0)';
            
            // Ensure smooth rendering
            layer.style.backfaceVisibility = 'hidden';
            layer.style.perspective = '1000px';
        });
    }

    /**
     * Set up Intersection Observer for lazy parallax activation
     * Only activate parallax when hero section is in viewport
     */
    setupIntersectionObserver() {
        const heroSection = document.querySelector('.hero-section');
        
        if (!heroSection) {
            console.warn('Hero section not found, parallax will be always active');
            this.activateParallax();
            return;
        }

        // Create observer with threshold
        const observerOptions = {
            root: null,
            rootMargin: '100px',
            threshold: 0
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Hero section is visible, activate parallax
                    if (!this.isActive) {
                        this.activateParallax();
                    }
                } else {
                    // Hero section is not visible, deactivate parallax
                    if (this.isActive) {
                        this.deactivateParallax();
                    }
                }
            });
        }, observerOptions);

        // Observe the hero section
        this.observer.observe(heroSection);
    }

    /**
     * Activate parallax scrolling
     */
    activateParallax() {
        this.isActive = true;
        window.addEventListener('scroll', this.handleScroll, { passive: true });
        
        // Initial update
        this.updateParallax();
        
        console.log('Parallax activated');
    }

    /**
     * Deactivate parallax scrolling
     */
    deactivateParallax() {
        this.isActive = false;
        window.removeEventListener('scroll', this.handleScroll);
        
        console.log('Parallax deactivated');
    }

    /**
     * Handle scroll event with optimized throttling using requestAnimationFrame
     */
    handleScroll() {
        this.lastScrollY = window.pageYOffset || window.scrollY;

        // Throttle using requestAnimationFrame for 60fps performance
        if (!this.ticking) {
            this.ticking = true;
            window.requestAnimationFrame(() => {
                this.updateParallax();
                this.ticking = false;
            });
        }
    }

    /**
     * Update parallax positions based on scroll
     */
    updateParallax() {
        const scrolled = this.lastScrollY;

        this.parallaxLayers.forEach(layer => {
            // Get parallax speed from data attribute (default: 0.5)
            const speed = parseFloat(layer.dataset.parallaxSpeed) || 0.5;
            
            // Calculate parallax offset
            // Negative value to move in opposite direction of scroll
            const yPos = -(scrolled * speed);
            
            // Apply transform using GPU-accelerated translate3d
            layer.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });
    }

    /**
     * Destroy the parallax controller and clean up
     */
    destroy() {
        // Remove scroll listener
        if (this.isActive) {
            window.removeEventListener('scroll', this.handleScroll);
        }

        // Disconnect observer
        if (this.observer) {
            this.observer.disconnect();
        }

        // Reset transforms and remove will-change
        this.parallaxLayers.forEach(layer => {
            layer.style.transform = '';
            layer.style.willChange = '';
            layer.style.backfaceVisibility = '';
            layer.style.perspective = '';
        });

        this.parallaxLayers = [];
        this.isActive = false;
        
        console.log('Parallax Controller destroyed');
    }
}

// Initialize parallax when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Create global parallax controller instance
    window.parallaxController = new ParallaxController();
});

// Optional: Reinitialize on window resize (debounced)
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
        if (window.parallaxController) {
            // Update parallax on resize
            window.parallaxController.updateParallax();
        }
    }, 250);
});
