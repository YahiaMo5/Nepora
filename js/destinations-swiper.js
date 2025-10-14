// Destinations Swiper Configuration
let destinationsSwiper = null;

/**
 * Initialize or update Swiper based on current language direction
 */
function initDestinationsSwiper() {
    // Get current direction from HTML element
    const direction = document.documentElement.getAttribute('dir') || 'rtl';

    // Destroy existing swiper if it exists
    if (destinationsSwiper) {
        destinationsSwiper.destroy(true, true);
    }

    // Initialize new swiper with correct direction
    // Note: We set rtl to false for both languages to maintain consistent navigation
    // Right arrow always goes forward, left arrow always goes backward
    destinationsSwiper = new Swiper('.destinations-swiper', {
        direction: 'horizontal',
        rtl: false, // Always LTR for consistent navigation behavior

        // Responsive breakpoints
        slidesPerView: 1, // Mobile: 1 card per slide
        spaceBetween: 20,
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        breakpoints: {
            // Tablet: 2 cards per slide
            768: {
                slidesPerView: 2,
                spaceBetween: 30,
            },
            // Desktop: 3 cards per slide
            992: {
                slidesPerView: 3,
                spaceBetween: 30,
            },
        },
        // Navigation arrows
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        // Pagination
        pagination: {
            el: '.destinations-swiper-pagination',
            type: 'bullets',
            clickable: true,
        },
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function () {
    initDestinationsSwiper();
});

// Re-initialize when language changes
// Listen for direction changes on the document
const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'dir') {
            // Re-initialize swiper with new direction
            initDestinationsSwiper();
        }
    });
});

// Start observing the document element for attribute changes
observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['dir']
});
