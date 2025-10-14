// Main JavaScript file for Nepora Tourism Website
// General functionality and initialization

document.addEventListener('DOMContentLoaded', function () {
    console.log('Nepora Tourism Website Loaded');

    // Initialize Navigation
    // Main JavaScript file for Nepora Tourism Website
    // General functionality and initialization

    // Keep a reference to the testimonials swiper so we can re-init on direction/lang changes
    let testimonialsSwiper = null;

    document.addEventListener('DOMContentLoaded', function () {
        console.log('Nepora Tourism Website Loaded');

        // Initialize Navigation
        initNavigation();
    
        // Initialize Testimonials Swiper
        initTestimonialsSwiper();
    });

    /**
     * Navigation Component Initialization
     * Handles smooth scrolling, active link highlighting, and scroll effects
     */
    function initNavigation() {
        const navbar = document.getElementById('navbar');
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
        const navbarCollapse = document.querySelector('.navbar-collapse');
        const sections = document.querySelectorAll('section[id]');
        let scrollTimeout;
        let isScrolling = false;

        // Navbar scroll effect - add solid background on scroll
        // Using throttling for better performance
        window.addEventListener('scroll', function () {
            // Clear existing timeout
            if (scrollTimeout) {
                window.cancelAnimationFrame(scrollTimeout);
            }

            // Use requestAnimationFrame for smooth performance
            scrollTimeout = window.requestAnimationFrame(function () {
                // Add scrolled class when scrolled down more than 50px
                if (window.scrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            });
        });

        // Smooth scroll to sections when clicking nav links
        navLinks.forEach(link => {
            link.addEventListener('click', function (e) {
                const href = this.getAttribute('href');

                // Only handle internal links (starting with #)
                if (href && href.startsWith('#')) {
                    e.preventDefault();

                    const targetId = href.substring(1);
                    const targetSection = document.getElementById(targetId);

                    if (targetSection) {
                        // Set scrolling flag
                        isScrolling = true;

                        // Calculate offset for fixed navbar
                        const navbarHeight = navbar.offsetHeight;
                        const targetPosition = targetSection.offsetTop - navbarHeight;

                        // Smooth scroll to target
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });

                        // Update URL hash without jumping
                        updateURLHash(targetId);

                        // Close mobile menu if open
                        if (window.innerWidth < 992) {
                            const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                            if (bsCollapse) {
                                bsCollapse.hide();
                            } else {
                                // If no instance exists, create one and hide it
                                const newCollapse = new bootstrap.Collapse(navbarCollapse, {
                                    toggle: false
                                });
                                newCollapse.hide();
                            }
                        }

                        // Update active state immediately
                        updateActiveLink(this);

                        // Reset scrolling flag after animation completes
                        setTimeout(() => {
                            isScrolling = false;
                        }, 1000);
                    }
                }
            });
        });

        // Intersection Observer for section visibility detection
        const observerOptions = {
            root: null,
            rootMargin: `-${navbar.offsetHeight + 50}px 0px -50% 0px`,
            threshold: 0
        };

        const sectionObserver = new IntersectionObserver((entries) => {
            // Only update if not currently scrolling from a click
            if (isScrolling) return;

            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.getAttribute('id');
                    const correspondingLink = document.querySelector(`.navbar-nav .nav-link[href="#${sectionId}"]`);
                
                    if (correspondingLink) {
                        updateActiveLink(correspondingLink);
                        // Update URL hash without jumping
                        updateURLHash(sectionId);
                    }
                }
            });
        }, observerOptions);

        // Observe all sections
        sections.forEach(section => {
            sectionObserver.observe(section);
        });

        // Update active link styling
        function updateActiveLink(activeLink) {
            navLinks.forEach(link => link.classList.remove('active'));
            activeLink.classList.add('active');
        }

        // Update URL hash without causing page jump
        function updateURLHash(hash) {
            if (history.pushState) {
                // Use pushState to update URL without jumping
                history.pushState(null, null, `#${hash}`);
            } else {
                // Fallback for older browsers
                window.location.hash = hash;
            }
        }

        // Handle initial page load with hash in URL
        function handleInitialHash() {
            const hash = window.location.hash;
            if (hash) {
                const targetId = hash.substring(1);
                const targetSection = document.getElementById(targetId);
                const correspondingLink = document.querySelector(`.navbar-nav .nav-link[href="${hash}"]`);

                if (targetSection && correspondingLink) {
                    // Small delay to ensure page is fully loaded
                    setTimeout(() => {
                        const navbarHeight = navbar.offsetHeight;
                        const targetPosition = targetSection.offsetTop - navbarHeight;

                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });

                        updateActiveLink(correspondingLink);
                    }, 100);
                }
            }
        }

        // Handle browser back/forward buttons
        window.addEventListener('popstate', function() {
            handleInitialHash();
        });

        // Set initial active link based on URL hash or scroll position
        handleInitialHash();
    }


    /**
     * Initialize Testimonials Swiper
     */
    function initTestimonialsSwiper() {
        // Only initialize if the container exists
        const container = document.querySelector('.testimonials-swiper');
        if (!container) return;

        // Destroy existing instance if present
        if (testimonialsSwiper && testimonialsSwiper.destroy) {
            try { testimonialsSwiper.destroy(true, true); } catch (e) { /* ignore */ }
            testimonialsSwiper = null;
        }

        // Always use horizontal direction and rtl:false to keep navigation consistent
        testimonialsSwiper = new Swiper('.testimonials-swiper', {
            direction: 'horizontal',
            rtl: false,

            // Mobile default
            slidesPerView: 1,
            spaceBetween: 20,
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false
            },

            // Match destinations breakpoints: tablet -> 2, desktop -> 3
            breakpoints: {
                768: {
                    slidesPerView: 2,
                    spaceBetween: 30
                },
                992: {
                    slidesPerView: 3,
                    spaceBetween: 30
                }
            },

            // Use scoped nav selectors inside testimonials container
            navigation: {
                nextEl: '.testimonials-swiper .swiper-button-next',
                prevEl: '.testimonials-swiper .swiper-button-prev'
            },

            // Use the pagination inside the testimonials container
            pagination: {
                el: '.testimonials-swiper .swiper-pagination',
                type: 'bullets',
                clickable: true
            }
        });
    }

    // Re-initialize when language/direction changes (so Arabic/English behave the same)
    /**
     * Collapse the Bootstrap navbar if it's currently shown.
     * This ensures the mobile/toggle menu doesn't remain open after a language/dir change.
     */
    function collapseNavbar() {
        try {
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (!navbarCollapse) return;

            // If the collapse is currently visible (Bootstrap adds the 'show' class)
            if (navbarCollapse.classList.contains('show')) {
                const instance = bootstrap.Collapse.getInstance(navbarCollapse);
                if (instance) {
                    instance.hide();
                } else {
                    // Create a temporary instance and hide it without toggling
                    const tmp = new bootstrap.Collapse(navbarCollapse, { toggle: false });
                    tmp.hide();
                }

                // Keep the toggler aria state consistent
                const toggler = document.querySelector('.navbar-toggler');
                if (toggler) toggler.setAttribute('aria-expanded', 'false');
            }
        } catch (err) {
            // Ignore errors
        }
    }

    (function setupTestimonialsLangHandling(){
        // Use a single MutationObserver instance
        const observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'dir') {
                    initTestimonialsSwiper();
                    collapseNavbar();
                }
            });
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['dir']
        });

        // Also listen for custom language change event dispatched by language-switcher
        document.addEventListener('languageChanged', function (e) {
            initTestimonialsSwiper();
            collapseNavbar();
        });
    })();
    console.log('Nepora Tourism Website Loaded');

    // Initialize Navigation
    initNavigation();
    
    // Initialize Testimonials Swiper
    initTestimonialsSwiper();
});
            testimonialsSwiper = null;

        // Always use horizontal direction and rtl:false to keep navigation consistent
        testimonialsSwiper = new Swiper('.testimonials-swiper', {
            direction: 'horizontal',
            rtl: false,

            // Mobile default
            slidesPerView: 1,
            spaceBetween: 20,
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false
            },

            // Match destinations breakpoints: tablet -> 2, desktop -> 3
            breakpoints: {
                768: {
                    slidesPerView: 2,
                    spaceBetween: 30
                },
                992: {
                    slidesPerView: 3,
                    spaceBetween: 30
                }
            },

            // Use same global nav selectors as destinations
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev'
            },

            // Scoped pagination for testimonials
            pagination: {
                el: '.testimonials-pagination',
                type: 'bullets',
                clickable: true
            }
        });
    

    // Initialize on page load
    document.addEventListener('DOMContentLoaded', function () {
        initTestimonialsSwiper();
    });

    // Re-initialize when language/direction changes (so Arabic/English behave the same)
    const testimonialsDirObserver = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'dir') {
                initTestimonialsSwiper();
            }
        });
    });

    testimonialsDirObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['dir']
    });

    // Also listen for custom language change event dispatched by language-switcher
    document.addEventListener('languageChanged', function (e) {
        initTestimonialsSwiper();
    });
    
    // Intersection Observer for section visibility detection
    const observerOptions = {
        root: null,
        rootMargin: `-${navbar.offsetHeight + 50}px 0px -50% 0px`,
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        // Only update if not currently scrolling from a click
        if (isScrolling) return;

        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.getAttribute('id');
                const correspondingLink = document.querySelector(`.navbar-nav .nav-link[href="#${sectionId}"]`);
                
                if (correspondingLink) {
                    updateActiveLink(correspondingLink);
                    // Update URL hash without jumping
                    updateURLHash(sectionId);
                }
            }
        });
    }, observerOptions);

    // Observe all sections
    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // Update active link styling
    function updateActiveLink(activeLink) {
        navLinks.forEach(link => link.classList.remove('active'));
        activeLink.classList.add('active');
    }

    // Update URL hash without causing page jump
    function updateURLHash(hash) {
        if (history.pushState) {
            // Use pushState to update URL without jumping
            history.pushState(null, null, `#${hash}`);
        } else {
            // Fallback for older browsers
            window.location.hash = hash;
        }
    }

    // Handle initial page load with hash in URL
    function handleInitialHash() {
        const hash = window.location.hash;
        if (hash) {
            const targetId = hash.substring(1);
            const targetSection = document.getElementById(targetId);
            const correspondingLink = document.querySelector(`.navbar-nav .nav-link[href="${hash}"]`);

            if (targetSection && correspondingLink) {
                // Small delay to ensure page is fully loaded
                setTimeout(() => {
                    const navbarHeight = navbar.offsetHeight;
                    const targetPosition = targetSection.offsetTop - navbarHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    updateActiveLink(correspondingLink);
                }, 100);
            }
        }
    }

    // Handle browser back/forward buttons
    window.addEventListener('popstate', function() {
        handleInitialHash();
    });

    // Set initial active link based on URL hash or scroll position
    handleInitialHash();


/**
 * Initialize Testimonials Swiper
 */
function initTestimonialsSwiper() {
    // Make testimonials behave like destinations swiper (simple controls, same breakpoints)
    if (!document.querySelector('.testimonials-swiper')) return;

    // Destroy existing instance if present on the element (defensive)
    if (window.testimonialsSwiper && window.testimonialsSwiper.destroy) {
        try { window.testimonialsSwiper.destroy(true, true); } catch (e) { /* ignore */ }
    }

    // Initialize with the same behaviour as destinations-swiper
    window.testimonialsSwiper = new Swiper('.testimonials-swiper', {
        direction: 'horizontal',
        rtl: false,

        // Mobile default: 1 card
        slidesPerView: 1,
        spaceBetween: 20,
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false
        },

        // Breakpoints mirror destinations: tablet -> 2, desktop -> 3
        breakpoints: {
            768: {
                slidesPerView: 2,
                spaceBetween: 30
            },
            992: {
                slidesPerView: 3,
                spaceBetween: 30
            }
        },

        // Use the same global nav button selectors used by destinations
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
        },

        // Match destinations-style pagination but scoped to testimonials container
        pagination: {
            el: '.testimonials-pagination',
            type: 'bullets',
            clickable: true
        }
    });
}