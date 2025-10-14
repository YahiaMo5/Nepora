/**
 * Pharaonic Animations and Decorative Elements
 * Task 25 Implementation
 */

class PharaonicAnimations {
    constructor() {
        this.init();
    }

    init() {
        // Initialize all animation features
        this.initScrollAnimations();
        this.initCustomCursor();
        this.initHieroglyphicDecorations();
        this.initCardHoverEffects();
        this.initButtonAnimations();
    }

    /**
     * Initialize scroll-based animations for sections
     */
    initScrollAnimations() {
        // Create Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    
                    // Add stagger effect to children if applicable
                    if (entry.target.classList.contains('stagger-children')) {
                        const children = entry.target.children;
                        Array.from(children).forEach((child, index) => {
                            setTimeout(() => {
                                child.style.opacity = '1';
                            }, index * 100);
                        });
                    }
                }
            });
        }, observerOptions);

        // Observe all elements with animate-on-scroll class
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        animatedElements.forEach(el => observer.observe(el));

        // Add entrance animations to sections
        const sections = document.querySelectorAll('section');
        sections.forEach((section, index) => {
            section.classList.add('animate-on-scroll', 'fade-in-up');
            observer.observe(section);
        });

    // Add animations to cards
    const cards = document.querySelectorAll('.package-card, .card');
        cards.forEach((card, index) => {
            card.classList.add('animate-on-scroll', 'scale-in');
            card.style.animationDelay = `${index * 0.1}s`;
            observer.observe(card);
        });
    }

    /**
     * Initialize custom cursor effect (optional)
     */
    initCustomCursor() {
        // Check if user prefers reduced motion
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        // Check if device is touch-enabled (skip cursor on mobile)
        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
            return;
        }

        // Create cursor elements
        const cursorDot = document.createElement('div');
        cursorDot.className = 'cursor-dot';
        
        const cursorOutline = document.createElement('div');
        cursorOutline.className = 'cursor-outline';

        document.body.appendChild(cursorDot);
        document.body.appendChild(cursorOutline);
        document.body.classList.add('custom-cursor-active');

        let mouseX = 0, mouseY = 0;
        let outlineX = 0, outlineY = 0;

        // Update cursor position on mouse move
        const updateCursorPosition = (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            cursorDot.style.left = mouseX + 'px';
            cursorDot.style.top = mouseY + 'px';
        };

        document.addEventListener('mousemove', updateCursorPosition);
        
        // Also update on drag events (for swiper sliding)
        document.addEventListener('drag', updateCursorPosition);
        document.addEventListener('dragover', updateCursorPosition);
        
        // Update on touch move (converted to mouse position)
        document.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                const touch = e.touches[0];
                mouseX = touch.clientX;
                mouseY = touch.clientY;
                
                cursorDot.style.left = mouseX + 'px';
                cursorDot.style.top = mouseY + 'px';
            }
        }, { passive: true });

        // Smooth follow for outline
        const animateOutline = () => {
            outlineX += (mouseX - outlineX) * 0.15;
            outlineY += (mouseY - outlineY) * 0.15;
            
            cursorOutline.style.left = outlineX + 'px';
            cursorOutline.style.top = outlineY + 'px';
            
            requestAnimationFrame(animateOutline);
        };
        animateOutline();

        // Add hover effects - expanded to include more interactive elements
    const hoverElements = document.querySelectorAll('a, button, .btn, .card, input, textarea, select, .swiper-slide, .package-card, .tour360-container, .booking-form, .swiper-button-prev, .swiper-button-next, .swiper-pagination-bullet, label, .form-control, .form-select, iframe');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                document.body.classList.add('cursor-hover');
            });
            
            el.addEventListener('mouseleave', () => {
                document.body.classList.remove('cursor-hover');
            });
        });

        // Add click and drag effects
        let isDragging = false;
        
        document.addEventListener('mousedown', () => {
            document.body.classList.add('cursor-click');
            isDragging = false;
        });
        
        document.addEventListener('mousemove', (e) => {
            if (document.body.classList.contains('cursor-click')) {
                isDragging = true;
                document.body.classList.add('cursor-dragging');
            }
        });
        
        document.addEventListener('mouseup', () => {
            document.body.classList.remove('cursor-click');
            document.body.classList.remove('cursor-dragging');
            isDragging = false;
        });
        
        // Handle drag events for better swiper support
        document.addEventListener('dragstart', () => {
            document.body.classList.add('cursor-dragging');
        });
        
        document.addEventListener('dragend', () => {
            document.body.classList.remove('cursor-dragging');
        });

        // Special handling for Swiper dragging
        const swiperContainers = document.querySelectorAll('.swiper');
        swiperContainers.forEach(swiper => {
            swiper.addEventListener('mousedown', () => {
                document.body.classList.add('cursor-dragging');
            });
            
            swiper.addEventListener('mouseup', () => {
                document.body.classList.remove('cursor-dragging');
            });
            
            swiper.addEventListener('mouseleave', () => {
                document.body.classList.remove('cursor-dragging');
            });
        });

        // Re-apply hover effects to dynamically added elements
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) { // Element node
                        // Check if the node itself is interactive
                        if (node.matches && node.matches('a, button, .btn, .card, input, textarea, select, .swiper-slide, .package-card, .destination-card, .tour360-container, .booking-form, .swiper-button-prev, .swiper-button-next, .swiper-pagination-bullet, label, .form-control, .form-select, iframe')) {
                            node.addEventListener('mouseenter', () => {
                                document.body.classList.add('cursor-hover');
                            });
                            node.addEventListener('mouseleave', () => {
                                document.body.classList.remove('cursor-hover');
                            });
                        }
                        // Check for interactive children
                        const interactiveChildren = node.querySelectorAll('a, button, .btn, .card, input, textarea, select, .swiper-slide, .package-card, .tour360-container, .booking-form, .swiper-button-prev, .swiper-button-next, .swiper-pagination-bullet, label, .form-control, .form-select, iframe');
                        interactiveChildren.forEach(el => {
                            el.addEventListener('mouseenter', () => {
                                document.body.classList.add('cursor-hover');
                            });
                            el.addEventListener('mouseleave', () => {
                                document.body.classList.remove('cursor-hover');
                            });
                        });
                    }
                });
            });
        });

        // Observe the entire document for changes
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    /**
     * Add hieroglyphic decorations to sections
     */
    initHieroglyphicDecorations() {
        const sections = document.querySelectorAll('section');
        const hieroglyphicSymbols = ['☥', '𓂀', '𓆣', '𓋹', '𓇯', '𓆈'];

        sections.forEach((section, index) => {
            // Add hieroglyphic background to ALL sections including hero
            section.classList.add('hieroglyphic-bg');

            // Add floating symbols to all sections (not just even ones)
            // Add 1-2 symbols per section for variety
            const symbolCount = Math.random() > 0.5 ? 2 : 1;
            
            for (let i = 0; i < symbolCount; i++) {
                const symbol = document.createElement('div');
                symbol.className = 'floating-symbol';
                symbol.textContent = hieroglyphicSymbols[Math.floor(Math.random() * hieroglyphicSymbols.length)];
                symbol.style.top = `${Math.random() * 80 + 10}%`;
                symbol.style.left = `${Math.random() * 80 + 10}%`;
                symbol.style.animationDelay = `${Math.random() * 5}s`;
                symbol.style.animationDuration = `${15 + Math.random() * 10}s`;
                
                // Ensure section has relative positioning
                if (window.getComputedStyle(section).position === 'static') {
                    section.style.position = 'relative';
                }
                
                section.appendChild(symbol);
            }
        });
    }

    /**
     * Initialize card hover effects
     */
    initCardHoverEffects() {
    const cards = document.querySelectorAll('.package-card');
        
        cards.forEach(card => {
            // Add lift effect
            card.classList.add('card-hover-lift');

            // Add shine effect to buttons inside cards
            const buttons = card.querySelectorAll('.btn');
            buttons.forEach(btn => {
                btn.classList.add('btn-hover-shine');
            });

            // Add 3D tilt effect on mouse move
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    /**
     * Initialize button animations
     */
    initButtonAnimations() {
        // Add pulse animation to primary CTA buttons
        const ctaButtons = document.querySelectorAll('.btn-cta, .btn-pharaonic');
        ctaButtons.forEach((btn, index) => {
            if (index === 0) {
                // First button gets pulse effect
                btn.classList.add('btn-hover-pulse');
            }
        });

        // Add bounce effect to discover buttons
        const discoverButtons = document.querySelectorAll('.btn-discover');
        discoverButtons.forEach(btn => {
            btn.classList.add('btn-hover-bounce');
        });

        // Add icon rotation to buttons with icons
        const iconButtons = document.querySelectorAll('.btn svg, .social-link svg');
        iconButtons.forEach(icon => {
            icon.classList.add('icon-hover-rotate');
        });
    }

    /**
     * Show loading animation
     */
    static showLoading(type = 'spinner') {
        const overlay = document.createElement('div');
        overlay.className = 'loading-overlay';
        overlay.id = 'pharaonic-loading';

        let loader;
        switch (type) {
            case 'pulse':
                loader = document.createElement('div');
                loader.className = 'pharaonic-pulse-loader';
                loader.innerHTML = '<span></span><span></span><span></span>';
                break;
            case 'wave':
                loader = document.createElement('div');
                loader.className = 'pharaonic-wave-loader';
                loader.innerHTML = '<span></span><span></span><span></span><span></span><span></span>';
                break;
            case 'ankh':
                loader = document.createElement('div');
                loader.className = 'pharaonic-ankh-loader';
                break;
            default:
                loader = document.createElement('div');
                loader.className = 'pharaonic-spinner';
        }

        overlay.appendChild(loader);
        document.body.appendChild(overlay);
    }

    /**
     * Hide loading animation
     */
    static hideLoading() {
        const overlay = document.getElementById('pharaonic-loading');
        if (overlay) {
            overlay.style.opacity = '0';
            setTimeout(() => {
                overlay.remove();
            }, 300);
        }
    }

    /**
     * Add section divider with pharaonic decoration
     */
    static addSectionDivider(targetElement, icon = '☥') {
        const divider = document.createElement('div');
        divider.className = 'section-divider';
        divider.innerHTML = `<span class="section-divider-icon">${icon}</span>`;
        targetElement.appendChild(divider);
    }

    /**
     * Add pharaonic corners to element
     */
    static addPharaonicCorners(element) {
        element.classList.add('pharaonic-corners');
    }

    /**
     * Add pharaonic border to element
     */
    static addPharaonicBorder(element, position = 'top') {
        if (position === 'top') {
            element.classList.add('pharaonic-border-top');
        } else if (position === 'bottom') {
            element.classList.add('pharaonic-border-bottom');
        } else if (position === 'both') {
            element.classList.add('pharaonic-border-top', 'pharaonic-border-bottom');
        }
    }
}

// Initialize animations when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new PharaonicAnimations();
    });
} else {
    new PharaonicAnimations();
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PharaonicAnimations;
}
