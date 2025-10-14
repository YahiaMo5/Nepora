// Contact Form Validation and Submission
// Handles form validation, submission, and success/error messages

document.addEventListener('DOMContentLoaded', function () {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        initContactForm();
    }
});

/**
 * Initialize Contact Form
 * Sets up validation and submission handling
 */
function initContactForm() {
    const form = document.getElementById('contactForm');
    const nameInput = document.getElementById('contactName');
    const emailInput = document.getElementById('contactEmail');
    const phoneInput = document.getElementById('contactPhone');
    const messageInput = document.getElementById('contactMessage');
    const submitButton = form.querySelector('button[type="submit"]');
    const buttonText = submitButton.querySelector('.btn-text');
    const buttonSpinner = submitButton.querySelector('.btn-spinner');
    const messageAlert = document.getElementById('contactFormMessage');

    // Add real-time validation
    nameInput.addEventListener('blur', () => validateName(nameInput));
    emailInput.addEventListener('blur', () => validateEmail(emailInput));
    phoneInput.addEventListener('blur', () => validatePhone(phoneInput));
    messageInput.addEventListener('blur', () => validateMessage(messageInput));

    // Remove validation on input
    [nameInput, emailInput, phoneInput, messageInput].forEach(input => {
        input.addEventListener('input', function() {
            this.classList.remove('is-invalid', 'is-valid');
        });
    });

    // Handle form submission
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        
        // Validate all fields
        const isNameValid = validateName(nameInput);
        const isEmailValid = validateEmail(emailInput);
        const isPhoneValid = validatePhone(phoneInput);
        const isMessageValid = validateMessage(messageInput);

        // If all fields are valid, submit the form
        if (isNameValid && isEmailValid && isPhoneValid && isMessageValid) {
            submitForm(form, submitButton, buttonText, buttonSpinner, messageAlert);
        } else {
            // Scroll to first invalid field
            const firstInvalid = form.querySelector('.is-invalid');
            if (firstInvalid) {
                firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstInvalid.focus();
            }
        }
    });
}

/**
 * Validate Name Field
 * @param {HTMLInputElement} input - Name input element
 * @returns {boolean} - True if valid
 */
function validateName(input) {
    const value = input.value.trim();
    
    if (value === '') {
        setInvalid(input);
        return false;
    }
    
    if (value.length < 3) {
        setInvalid(input);
        return false;
    }
    
    setValid(input);
    return true;
}

/**
 * Validate Email Field
 * @param {HTMLInputElement} input - Email input element
 * @returns {boolean} - True if valid
 */
function validateEmail(input) {
    const value = input.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (value === '') {
        setInvalid(input);
        return false;
    }
    
    if (!emailRegex.test(value)) {
        setInvalid(input);
        return false;
    }
    
    setValid(input);
    return true;
}

/**
 * Validate Phone Field
 * @param {HTMLInputElement} input - Phone input element
 * @returns {boolean} - True if valid
 */
function validatePhone(input) {
    const value = input.value.trim();
    // Egyptian phone number formats: +20 XXX XXX XXXX or 01X XXXX XXXX
    const phoneRegex = /^(\+20|0)?1[0-2,5]\d{8}$/;
    
    if (value === '') {
        setInvalid(input);
        return false;
    }
    
    // Remove spaces and dashes for validation
    const cleanPhone = value.replace(/[\s-]/g, '');
    
    if (!phoneRegex.test(cleanPhone)) {
        setInvalid(input);
        return false;
    }
    
    setValid(input);
    return true;
}

/**
 * Validate Message Field
 * @param {HTMLInputElement} input - Message textarea element
 * @returns {boolean} - True if valid
 */
function validateMessage(input) {
    const value = input.value.trim();
    
    if (value === '') {
        setInvalid(input);
        return false;
    }
    
    if (value.length < 10) {
        setInvalid(input);
        return false;
    }
    
    setValid(input);
    return true;
}

/**
 * Set input as invalid
 * @param {HTMLInputElement} input - Input element
 */
function setInvalid(input) {
    input.classList.remove('is-valid');
    input.classList.add('is-invalid');
}

/**
 * Set input as valid
 * @param {HTMLInputElement} input - Input element
 */
function setValid(input) {
    input.classList.remove('is-invalid');
    input.classList.add('is-valid');
}

/**
 * Submit Form
 * Handles form submission with loading state and success/error messages
 * @param {HTMLFormElement} form - Form element
 * @param {HTMLButtonElement} button - Submit button
 * @param {HTMLElement} buttonText - Button text element
 * @param {HTMLElement} buttonSpinner - Button spinner element
 * @param {HTMLElement} messageAlert - Alert message element
 */
function submitForm(form, button, buttonText, buttonSpinner, messageAlert) {
    // Show loading state
    button.disabled = true;
    buttonText.textContent = getCurrentLanguage() === 'ar' ? 'جاري الإرسال...' : 'Sending...';
    buttonSpinner.classList.remove('d-none');

    // Get form data
    const formData = {
        name: document.getElementById('contactName').value.trim(),
        email: document.getElementById('contactEmail').value.trim(),
        phone: document.getElementById('contactPhone').value.trim(),
        message: document.getElementById('contactMessage').value.trim(),
        timestamp: new Date().toISOString()
    };

    // Log form data to console (since no backend)
    console.log('=== Contact Form Submitted ===');
    console.log('Form Data:', formData);
    console.log('Name:', formData.name);
    console.log('Email:', formData.email);
    console.log('Phone:', formData.phone);
    console.log('Message:', formData.message);
    console.log('Submitted at:', formData.timestamp);
    console.log('==============================');

    // Simulate API call (replace with actual API endpoint)
    setTimeout(() => {
        // Simulate successful submission (change to false to test error state)
        const success = true;

        if (success) {
            showSuccessMessage(messageAlert, form, button, buttonText, buttonSpinner, formData);
        } else {
            showErrorMessage(messageAlert, button, buttonText, buttonSpinner);
        }
    }, 2000);
}

/**
 * Show Success Message
 * @param {HTMLElement} messageAlert - Alert element
 * @param {HTMLFormElement} form - Form element
 * @param {HTMLButtonElement} button - Submit button
 * @param {HTMLElement} buttonText - Button text element
 * @param {HTMLElement} buttonSpinner - Button spinner element
 * @param {Object} formData - Submitted form data
 */
function showSuccessMessage(messageAlert, form, button, buttonText, buttonSpinner, formData) {
    const currentLang = getCurrentLanguage();
    const successMessage = currentLang === 'ar' 
        ? 'تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.'
        : 'Your message has been sent successfully! We will contact you soon.';

    messageAlert.className = 'alert alert-success';
    messageAlert.textContent = successMessage;
    messageAlert.classList.remove('d-none');

    // Clear form after successful submission
    form.reset();
    form.querySelectorAll('.is-valid').forEach(el => el.classList.remove('is-valid'));

    // Reset button
    button.disabled = false;
    buttonText.textContent = currentLang === 'ar' ? 'إرسال الرسالة' : 'Send Message';
    buttonSpinner.classList.add('d-none');

    // Scroll to message
    messageAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Hide message after 5 seconds
    setTimeout(() => {
        messageAlert.classList.add('d-none');
    }, 5000);
}

/**
 * Show Error Message
 * @param {HTMLElement} messageAlert - Alert element
 * @param {HTMLButtonElement} button - Submit button
 * @param {HTMLElement} buttonText - Button text element
 * @param {HTMLElement} buttonSpinner - Button spinner element
 */
function showErrorMessage(messageAlert, button, buttonText, buttonSpinner) {
    const currentLang = getCurrentLanguage();
    const errorMessage = currentLang === 'ar' 
        ? 'حدث خطأ أثناء إرسال رسالتك. يرجى المحاولة مرة أخرى.'
        : 'An error occurred while sending your message. Please try again.';

    messageAlert.className = 'alert alert-danger';
    messageAlert.textContent = errorMessage;
    messageAlert.classList.remove('d-none');

    // Reset button
    button.disabled = false;
    buttonText.textContent = currentLang === 'ar' ? 'إرسال الرسالة' : 'Send Message';
    buttonSpinner.classList.add('d-none');

    // Scroll to message
    messageAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Hide message after 5 seconds
    setTimeout(() => {
        messageAlert.classList.add('d-none');
    }, 5000);
}

/**
 * Get Current Language
 * @returns {string} - Current language code ('ar' or 'en')
 */
function getCurrentLanguage() {
    const html = document.documentElement;
    return html.getAttribute('lang') || 'ar';
}
