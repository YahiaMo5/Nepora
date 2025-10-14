class LazyLoader {
    constructor() {
        this.images = document.querySelectorAll('img[loading="lazy"]');
        this.iframes = document.querySelectorAll('iframe[loading="lazy"]');
        this.init();
    }

    init() {
        // Check if browser supports Intersection Observer
        if ('IntersectionObserver' in window) {
            this.observeImages();
        } else {
            // Fallback: load all images immediately
            this.loadAllImages();
        }
    }

    observeImages() {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    this.loadImage(img);
                    observer.unobserve(img);
                }
            });
        }, {
            // Start loading when image is 50px from viewport
            rootMargin: '50px 0px',
            threshold: 0.01
        });

        // Observe all lazy images
        this.images.forEach(img => {
            imageObserver.observe(img);
        });

        // Observe iframes (for maps, 360 tours, etc.)
        this.iframes.forEach(iframe => {
            imageObserver.observe(iframe);
        });
    }

    loadImage(img) {
        // Add loading class for fade-in effect
        img.classList.add('lazy-loading');

        // Handle image load success
        img.addEventListener('load', () => {
            img.classList.remove('lazy-loading');
            img.classList.add('lazy-loaded');
        });

        // Handle image load error
        img.addEventListener('error', () => {
            img.classList.remove('lazy-loading');
            img.classList.add('lazy-error');
            console.error(`Failed to load image: ${img.src}`);
        });

        // If image already has src, it's already loaded
        if (img.complete && img.naturalHeight !== 0) {
            img.classList.remove('lazy-loading');
            img.classList.add('lazy-loaded');
        }
    }

    loadAllImages() {
        // Fallback for browsers without Intersection Observer
        this.images.forEach(img => {
            this.loadImage(img);
        });
    }
}

// Initialize lazy loading when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new LazyLoader();
    });
} else {
    new LazyLoader();
}
