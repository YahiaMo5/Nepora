/**
 * Language Switcher for Nepora Tourism Website
 * Handles bilingual support (Arabic/English) with RTL/LTR layout switching
 */

class LanguageSwitcher {
    constructor() {
        this.currentLang = 'ar'; // Default language is Arabic
        this.translations = null;
        this.langToggleBtn = document.getElementById('langToggle');
        this.init();
    }

    /**
     * Initialize the language switcher
     */
    async init() {
        try {
            // Load translations from JSON file
            await this.loadTranslations();
            
            // Load saved language preference or use default
            const savedLang = this.getSavedLanguage();
            if (savedLang) {
                this.currentLang = savedLang;
            }
            
            // Apply the current language
            this.applyLanguage(this.currentLang);
            
            // Set up event listener for language toggle button
            if (this.langToggleBtn) {
                this.langToggleBtn.addEventListener('click', () => this.toggleLanguage());
            }
            
            console.log('Language switcher initialized successfully');
        } catch (error) {
            console.error('Error initializing language switcher:', error);
        }
    }

    /**
     * Load translations from JSON file
     */
    async loadTranslations() {
        try {
            const response = await fetch('data/translations.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.translations = await response.json();
        } catch (error) {
            console.error('Error loading translations:', error);
            throw error;
        }
    }

    /**
     * Toggle between Arabic and English
     */
    toggleLanguage() {
        this.currentLang = this.currentLang === 'ar' ? 'en' : 'ar';
        this.applyLanguage(this.currentLang);
        this.saveLanguagePreference();
    }

    /**
     * Apply language to the entire page
     * @param {string} lang - Language code ('ar' or 'en')
     */
    applyLanguage(lang) {
        if (!this.translations || !this.translations[lang]) {
            console.error(`Translations not available for language: ${lang}`);
            return;
        }

        // Update all elements with data-i18n attribute
        this.updateTextContent(lang);
        
        // Update all placeholders with data-i18n-placeholder attribute
        this.updatePlaceholders(lang);
        
        // Update aria-label attributes
        this.updateAriaLabels(lang);
        
        // Update title attributes
        this.updateTitles(lang);
        
        // Update meta tags (description, keywords)
        this.updateMetaTags(lang);
        
        // Update text direction (RTL for Arabic, LTR for English)
        this.updateDirection(lang);
        
        // Update language toggle button text
        this.updateToggleButton(lang);
        
        // Update HTML lang attribute
        document.documentElement.setAttribute('lang', lang);
            // Dispatch an event so other modules can react to language changes
            try {
                document.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
            } catch (e) {
                // ignore if CustomEvent not supported
            }
    }

    /**
     * Update text content for all elements with data-i18n attribute
     * @param {string} lang - Language code
     */
    updateTextContent(lang) {
        const elements = document.querySelectorAll('[data-i18n]');
        
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.getNestedTranslation(key, lang);
            
            if (translation) {
                element.textContent = translation;
            } else {
                console.warn(`Translation not found for key: ${key} in language: ${lang}`);
            }
        });
    }

    /**
     * Update placeholders for all input elements with data-i18n-placeholder attribute
     * @param {string} lang - Language code
     */
    updatePlaceholders(lang) {
        const elements = document.querySelectorAll('[data-i18n-placeholder]');
        
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            const translation = this.getNestedTranslation(key, lang);
            
            if (translation) {
                element.setAttribute('placeholder', translation);
            } else {
                console.warn(`Placeholder translation not found for key: ${key} in language: ${lang}`);
            }
        });
    }

    /**
     * Update aria-label attributes for accessibility
     * @param {string} lang - Language code
     */
    updateAriaLabels(lang) {
        const elements = document.querySelectorAll('[data-i18n-aria-label]');
        
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n-aria-label');
            const translation = this.getNestedTranslation(key, lang);
            
            if (translation) {
                element.setAttribute('aria-label', translation);
            }
        });
    }

    /**
     * Update title attributes for tooltips
     * @param {string} lang - Language code
     */
    updateTitles(lang) {
        const elements = document.querySelectorAll('[data-i18n-title]');
        
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n-title');
            const translation = this.getNestedTranslation(key, lang);
            
            if (translation) {
                // If element is the title tag, update document title
                if (element.tagName.toLowerCase() === 'title') {
                    document.title = translation;
                } else {
                    element.setAttribute('title', translation);
                }
            }
        });
    }

    /**
     * Update meta tags (description, keywords, etc.)
     * @param {string} lang - Language code
     */
    updateMetaTags(lang) {
        const metaElements = document.querySelectorAll('meta[data-i18n-meta]');
        
        metaElements.forEach(element => {
            const key = element.getAttribute('data-i18n-meta');
            const translation = this.getNestedTranslation(key, lang);
            
            if (translation) {
                element.setAttribute('content', translation);
            } else {
                console.warn(`Meta translation not found for key: ${key} in language: ${lang}`);
            }
        });
    }

    /**
     * Update text direction (RTL for Arabic, LTR for English)
     * @param {string} lang - Language code
     */
    updateDirection(lang) {
        const direction = lang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.setAttribute('dir', direction);
        document.body.setAttribute('dir', direction);
    }

    /**
     * Update language toggle button text
     * @param {string} lang - Current language code
     */
    updateToggleButton(lang) {
        if (!this.langToggleBtn) return;
        
        const langText = this.langToggleBtn.querySelector('.lang-text');
        if (langText) {
            // Show the opposite language (if Arabic is active, show EN button)
            langText.textContent = lang === 'ar' ? 'EN' : 'AR';
        }
    }

    /**
     * Get nested translation value from translations object
     * @param {string} key - Dot-notation key (e.g., 'nav.home')
     * @param {string} lang - Language code
     * @returns {string|null} - Translation string or null if not found
     */
    getNestedTranslation(key, lang) {
        if (!this.translations || !this.translations[lang]) {
            return null;
        }

        const keys = key.split('.');
        let value = this.translations[lang];

        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                return null;
            }
        }

        return typeof value === 'string' ? value : null;
    }

    /**
     * Save language preference to localStorage
     */
    saveLanguagePreference() {
        try {
            localStorage.setItem('preferredLanguage', this.currentLang);
        } catch (error) {
            console.error('Error saving language preference:', error);
        }
    }

    /**
     * Get saved language preference from localStorage
     * @returns {string|null} - Saved language code or null
     */
    getSavedLanguage() {
        try {
            return localStorage.getItem('preferredLanguage');
        } catch (error) {
            console.error('Error retrieving language preference:', error);
            return null;
        }
    }

    /**
     * Get current language
     * @returns {string} - Current language code
     */
    getCurrentLanguage() {
        return this.currentLang;
    }

    /**
     * Set language programmatically
     * @param {string} lang - Language code ('ar' or 'en')
     */
    setLanguage(lang) {
        if (lang !== 'ar' && lang !== 'en') {
            console.error(`Invalid language code: ${lang}`);
            return;
        }

        this.currentLang = lang;
        this.applyLanguage(lang);
        this.saveLanguagePreference();
    }
}

// Initialize language switcher when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.languageSwitcher = new LanguageSwitcher();
});
