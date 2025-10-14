/**
 * About Us Section - Animated Statistics Counter
 * Triggers counter animation when section scrolls into view
 */

class StatisticsCounter {
    constructor() {
        this.counters = document.querySelectorAll('.stat-number');
        this.hasAnimated = false;
        this.init();
    }

    init() {
        if (this.counters.length === 0) return;

        // Create Intersection Observer
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.3 // Trigger when 30% of the element is visible
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.hasAnimated) {
                    this.animateCounters();
                    this.hasAnimated = true;
                }
            });
        }, observerOptions);

        // Observe the stats container
        const statsContainer = document.querySelector('.stats-container');
        if (statsContainer) {
            this.observer.observe(statsContainer);
        }
    }

    animateCounters() {
        this.counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // 60fps
            let current = 0;

            const updateCounter = () => {
                current += increment;
                
                if (current < target) {
                    counter.textContent = Math.floor(current).toLocaleString();
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target.toLocaleString();
                }
            };

            updateCounter();
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new StatisticsCounter();
});
