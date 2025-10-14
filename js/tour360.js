/**
 * 360° Virtual Tour Controller
 * Handles tour selection and fullscreen functionality
 */

class Tour360Controller {
    constructor() {
        this.viewer = document.querySelector('.tour360-viewer');
        this.iframe = document.getElementById('tour360Frame');
        this.loader = document.getElementById('tourLoader');
        this.fullscreenBtn = document.getElementById('fullscreenBtn');
        this.thumbnails = document.querySelectorAll('.tour-thumbnail');
        this.tourTitle = document.querySelector('.tour-title');
        this.tourDescription = document.querySelector('.tour-description');
        this.isLoading = false;
        
        this.init();
    }
    
    init() {
        // Initialize tour selection
        this.setupTourSelection();
        // Ensure initial active tour is applied
        this.applyInitialActiveTour();
        // Setup language change observer to update titles/descriptions on lang switch
        this.setupLangObserver();
        
        // Initialize fullscreen functionality
        this.setupFullscreen();
        
        // Handle fullscreen change events
        this.handleFullscreenChange();
        
        // Handle iframe load event
        this.setupIframeLoadHandler();
    }
    
    /**
     * Setup iframe load handler for better UX
     */
    setupIframeLoadHandler() {
        if (!this.iframe) return;
        
        // Show loader initially
        this.showLoader();
        
        // Hide loader when iframe loads
        this.iframe.addEventListener('load', () => {
            this.hideLoader();
            this.iframe.classList.add('loaded');
        });
        
        // Fallback: hide loader after 3 seconds if load event doesn't fire
        setTimeout(() => {
            if (this.isLoading) {
                this.hideLoader();
                this.iframe.classList.add('loaded');
            }
        }, 3000);
    }
    
    /**
     * Show loading indicator
     */
    showLoader() {
        if (this.loader) {
            this.isLoading = true;
            this.loader.classList.remove('hidden');
        }
    }
    
    /**
     * Hide loading indicator
     */
    hideLoader() {
        if (this.loader) {
            this.isLoading = false;
            setTimeout(() => {
                this.loader.classList.add('hidden');
            }, 300);
        }
    }
    
    /**
     * Setup tour selection functionality
     */
    setupTourSelection() {
        this.thumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('click', () => {
                this.selectTour(thumbnail);
            });
            
            // Keyboard accessibility
            thumbnail.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.selectTour(thumbnail);
                }
            });
            
            // Make thumbnails focusable
            thumbnail.setAttribute('tabindex', '0');
            thumbnail.setAttribute('role', 'button');
        });
    }
    
    /**
     * Select and load a tour
     * @param {HTMLElement} thumbnail - The clicked thumbnail element
     */
    selectTour(thumbnail) {
        // Prevent multiple rapid clicks
        if (this.isLoading) return;
        
        // Remove active class from all thumbnails
        this.thumbnails.forEach(t => t.classList.remove('active'));
        
        // Add active class to selected thumbnail
        thumbnail.classList.add('active');
        
        // Get tour data
        const tourUrl = thumbnail.dataset.tourUrl;
        const tourId = thumbnail.dataset.tourId;
        
        // Show loader before changing iframe
        this.showLoader();
        this.iframe.classList.remove('loaded');
        
        // Update iframe source with slight delay for smooth transition
        if (tourUrl && this.iframe) {
            // Use requestAnimationFrame for smoother updates
            requestAnimationFrame(() => {
                this.iframe.src = tourUrl;
            });
        }
        
        // Update tour info (title and description)
        this.updateTourInfo(tourId);
        
        // Smooth scroll to viewer
        this.viewer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    /**
     * Update tour information display
     * @param {string} tourId - The ID of the selected tour
     */
    updateTourInfo(tourId) {
        // Tour data mapping
        const tourData = {
            pyramids: {
                titleAr: 'الأهرامات وأبو الهول',
                titleEn: 'Pyramids & Sphinx',
                descriptionAr: 'استكشف أهرامات الجيزة وأبو الهول بتقنية 360 درجة',
                descriptionEn: 'Explore the Pyramids of Giza and Sphinx in 360°'
            },
            dahshur: {
                titleAr: 'أهرامات دهشور',
                titleEn: 'Dahshur Pyramids',
                descriptionAr: 'اكتشف الأهرامات الفريدة التي تمثل تطور فن بناء الأهرامات',
                descriptionEn: 'Discover the unique pyramids representing the evolution of pyramid building'
            },
            memphis: {
                titleAr: 'متحف ممفيس المفتوح',
                titleEn: 'Memphis Open Air Museum',
                descriptionAr: 'استكشف العاصمة القديمة لمصر الفرعونية وآثارها العظيمة',
                descriptionEn: 'Explore the ancient capital of Egypt and its magnificent monuments'
            },
            medinetHabu: {
                titleAr: 'معبد مدينة هابو',
                titleEn: 'Medinet Habu Temple',
                descriptionAr: 'اكتشف معبد رمسيس الثالث الضخم ونقوشه التاريخية',
                descriptionEn: 'Discover Ramesses III\'s massive temple and its historical reliefs'
            },
            kalabsha: {
                titleAr: 'معبد كلابشة',
                titleEn: 'Kalabsha Temple',
                descriptionAr: 'تجول في أكبر معبد نوبي مستقل في جنوب مصر',
                descriptionEn: 'Tour the largest free-standing Nubian temple in southern Egypt'
            },
            unfinishedObelisk: {
                titleAr: 'المسلة الناقصة',
                titleEn: 'The Unfinished Obelisk',
                descriptionAr: 'شاهد أكبر مسلة فرعونية واكتشف تقنيات النحت القديمة',
                descriptionEn: 'See the largest known ancient obelisk and discover ancient carving techniques'
            },
            saqqara: {
                titleAr: 'هرم سقارة المدرج',
                titleEn: 'Step Pyramid of Saqqara',
                descriptionAr: 'أقدم بناء حجري ضخم في العالم، هرم الملك زوسر المدرج',
                descriptionEn: 'The world\'s oldest known stone building complex, Step Pyramid of Djoser'
            }
            ,karnak: {
                titleAr: 'معبد الكرنك',
                titleEn: 'Karnak Temple',
                descriptionAr: 'جولة افتراضية داخل أكبر مجمع معابد في العالم',
                descriptionEn: 'Experience the world\'s largest temple complex in an immersive 360° tour'
            },
            abuSimbel: {
                titleAr: 'معبد أبو سمبل',
                titleEn: 'Abu Simbel Temple',
                descriptionAr: 'اكتشف معبد رمسيس الثاني المنحوت في الصخر',
                descriptionEn: 'Take a virtual tour of Ramesses II\'s magnificent rock-cut temples'
            },
            valleyOfKings: {
                titleAr: 'وادي الملوك',
                titleEn: 'Valley of the Kings',
                descriptionAr: 'استكشف مقابر الفراعنة العظماء',
                descriptionEn: 'Explore the royal tombs of ancient Egyptian pharaohs in 360°'
            },
            egyptianMuseum: {
                titleAr: 'المتحف المصري',
                titleEn: 'Egyptian Museum',
                descriptionAr: 'تجول في أقدم وأكبر متحف للآثار المصرية في العالم',
                descriptionEn: 'Explore the world\'s largest collection of pharaonic antiquities virtually'
            },
            grandMuseum: {
                titleAr: 'المتحف المصري الكبير',
                titleEn: 'Grand Egyptian Museum',
                descriptionAr: 'استكشف أكبر متحف أثري في العالم',
                descriptionEn: 'Take a virtual tour of the largest archaeological museum in the world'
            },
            AlexLe: {
                titleAr: 'مكتبة الإسكندرية',
                titleEn: 'Bibliotheca Alexandrina',
                descriptionAr: 'جولة افتراضية في صرح معماري حديث ومركز ثقافي عالمي',
                descriptionEn: 'Take a virtual tour through this modern architectural marvel and cultural hub'
            }
        };
        
        const tour = tourData[tourId];
        if (!tour) return;
        
        // Check current language
        const currentLang = document.documentElement.getAttribute('lang') || 'ar';
        const isArabic = currentLang === 'ar';
        
        // Update title and description
        if (this.tourTitle) {
            this.tourTitle.textContent = isArabic ? tour.titleAr : tour.titleEn;
        }
        
        if (this.tourDescription) {
            this.tourDescription.textContent = isArabic ? tour.descriptionAr : tour.descriptionEn;
        }
    }

    applyInitialActiveTour() {
        // Prefer an element with the .active class, otherwise fallback to the first thumbnail
        const active = document.querySelector('.tour-thumbnail.active') || this.thumbnails[0];
        if (active) {
            // Use selectTour to set iframe and update info
            this.selectTour(active);
        }
    }

    /**
     * Observe document `lang` attribute changes and update the tour info text accordingly.
     */
    setupLangObserver() {
        const html = document.documentElement;
        if (!window.MutationObserver) return;

        const observer = new MutationObserver(mutations => {
            for (const m of mutations) {
                if (m.type === 'attributes' && m.attributeName === 'lang') {
                    const active = document.querySelector('.tour-thumbnail.active');
                    if (active) {
                        const tourId = active.dataset.tourId;
                        this.updateTourInfo(tourId);
                    }
                }
            }
        });

        observer.observe(html, { attributes: true, attributeFilter: ['lang'] });
        this.langObserver = observer;
    }
    
    /**
     * Setup fullscreen functionality
     */
    setupFullscreen() {
        if (!this.fullscreenBtn) return;
        
        this.fullscreenBtn.addEventListener('click', () => {
            this.toggleFullscreen();
        });
        
        // Keyboard accessibility
        this.fullscreenBtn.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.toggleFullscreen();
            }
        });
    }
    
    /**
     * Toggle fullscreen mode
     */
    toggleFullscreen() {
        if (!this.viewer) return;
        
        if (!document.fullscreenElement) {
            // Enter fullscreen
            if (this.viewer.requestFullscreen) {
                this.viewer.requestFullscreen();
            } else if (this.viewer.webkitRequestFullscreen) {
                this.viewer.webkitRequestFullscreen();
            } else if (this.viewer.msRequestFullscreen) {
                this.viewer.msRequestFullscreen();
            }
            
            this.viewer.classList.add('fullscreen');
        } else {
            // Exit fullscreen
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
            
            this.viewer.classList.remove('fullscreen');
        }
    }
    
    /**
     * Handle fullscreen change events
     */
    handleFullscreenChange() {
        document.addEventListener('fullscreenchange', () => {
            if (!document.fullscreenElement) {
                this.viewer.classList.remove('fullscreen');
            }
        });
        
        document.addEventListener('webkitfullscreenchange', () => {
            if (!document.webkitFullscreenElement) {
                this.viewer.classList.remove('fullscreen');
            }
        });
        
        document.addEventListener('msfullscreenchange', () => {
            if (!document.msFullscreenElement) {
                this.viewer.classList.remove('fullscreen');
            }
        });
    }
}

// Initialize Tour360 Controller when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new Tour360Controller();
});
