/**
 * Contact Section JavaScript
 * Handles form validation, submission, and interactions
 */

class ContactSection {
    constructor() {
        this.isInitialized = false;
        this.form = null;
        this.submitBtn = null;
        this.isSubmitting = false;
        this.validationRules = {
            firstName: {
                required: true,
                minLength: 2,
                pattern: /^[a-zA-Z\s]+$/
            },
            lastName: {
                required: true,
                minLength: 2,
                pattern: /^[a-zA-Z\s]+$/
            },
            email: {
                required: true,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            },
            phone: {
                required: false,
                pattern: /^[\+]?[\d\s\-\(\)]+$/
            },
            projectType: {
                required: true
            },
            message: {
                required: true,
                minLength: 10,
                maxLength: 1000
            }
        };
        
        this.init();
    }

    /**
     * Initialize contact section
     */
    init() {
        if (this.isInitialized) return;
        
        try {
            this.form = document.getElementById('contactForm');
            this.submitBtn = document.getElementById('submitBtn');
            
            if (!this.form || !this.submitBtn) {
                console.warn('Contact form elements not found');
                return;
            }
            
            this.setupEventListeners();
            this.setupRealTimeValidation();
            this.setupCharacterCounter();
            
            this.isInitialized = true;
            console.log('Contact section initialized successfully');
        } catch (error) {
            console.error('Error initializing contact section:', error);
        }
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Form submission
        this.form.addEventListener('submit', this.handleFormSubmit.bind(this));
        
        // Social links tracking
        const socialLinks = document.querySelectorAll('.social-link');
        socialLinks.forEach(link => {
            link.addEventListener('click', this.handleSocialClick.bind(this));
        });
        
        // Contact method interactions
        const contactMethods = document.querySelectorAll('.contact-method');
        contactMethods.forEach(method => {
            method.addEventListener('click', this.handleContactMethodClick.bind(this));
        });
        
        // Prevent form submission on Enter in input fields (except textarea)
        const inputs = this.form.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.focusNextField(input);
                }
            });
        });
    }

    /**
     * Setup real-time validation
     */
    setupRealTimeValidation() {
        const fields = this.form.querySelectorAll('input, select, textarea');
        
        fields.forEach(field => {
            // Validate on blur
            field.addEventListener('blur', () => {
                this.validateField(field);
            });
            
            // Clear errors on input
            field.addEventListener('input', () => {
                this.clearFieldError(field);
                
                // Live validation for email
                if (field.type === 'email' && field.value.length > 0) {
                    setTimeout(() => this.validateField(field), 500);
                }
            });
        });
    }

    /**
     * Setup character counter for message field
     */
    setupCharacterCounter() {
        const messageField = document.getElementById('message');
        const counter = document.querySelector('.character-count');
        
        if (messageField && counter) {
            messageField.addEventListener('input', () => {
                const length = messageField.value.length;
                const maxLength = this.validationRules.message.maxLength;
                
                counter.textContent = `${length} / ${maxLength}`;
                
                if (length > maxLength * 0.9) {
                    counter.style.color = '#ef4444';
                } else if (length > maxLength * 0.7) {
                    counter.style.color = '#f59e0b';
                } else {
                    counter.style.color = '#9ca3af';
                }
            });
        }
    }

    /**
     * Handle form submission
     */
    async handleFormSubmit(e) {
        e.preventDefault();
        
        if (this.isSubmitting) return;
        
        // Validate all fields
        const isValid = this.validateForm();
        if (!isValid) {
            this.showFormError('Please fix the errors above and try again.');
            return;
        }
        
        await this.submitForm();
    }

    /**
     * Validate entire form
     */
    validateForm() {
        let isValid = true;
        const fields = this.form.querySelectorAll('input[required], select[required], textarea[required]');
        
        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    }

    /**
     * Validate individual field
     */
    validateField(field) {
        const fieldName = field.name;
        const value = field.value.trim();
        const rules = this.validationRules[fieldName];
        
        if (!rules) return true;
        
        let errorMessage = '';
        
        // Required validation
        if (rules.required && !value) {
            errorMessage = `${this.getFieldLabel(fieldName)} is required.`;
        }
        // Min length validation
        else if (rules.minLength && value.length < rules.minLength) {
            errorMessage = `${this.getFieldLabel(fieldName)} must be at least ${rules.minLength} characters.`;
        }
        // Max length validation
        else if (rules.maxLength && value.length > rules.maxLength) {
            errorMessage = `${this.getFieldLabel(fieldName)} must not exceed ${rules.maxLength} characters.`;
        }
        // Pattern validation
        else if (rules.pattern && value && !rules.pattern.test(value)) {
            errorMessage = this.getPatternError(fieldName);
        }
        
        if (errorMessage) {
            this.showFieldError(field, errorMessage);
            return false;
        } else {
            this.showFieldSuccess(field);
            return true;
        }
    }

    /**
     * Get field label for error messages
     */
    getFieldLabel(fieldName) {
        const labels = {
            firstName: 'First name',
            lastName: 'Last name',
            email: 'Email address',
            phone: 'Phone number',
            projectType: 'Project type',
            message: 'Message'
        };
        return labels[fieldName] || fieldName;
    }

    /**
     * Get pattern-specific error messages
     */
    getPatternError(fieldName) {
        const errors = {
            firstName: 'First name should only contain letters.',
            lastName: 'Last name should only contain letters.',
            email: 'Please enter a valid email address.',
            phone: 'Please enter a valid phone number.'
        };
        return errors[fieldName] || 'Invalid format.';
    }

    /**
     * Show field error
     */
    showFieldError(field, message) {
        const errorElement = document.getElementById(`${field.name}Error`);
        
        field.classList.add('error');
        field.classList.remove('success');
        
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
    }

    /**
     * Show field success
     */
    showFieldSuccess(field) {
        const errorElement = document.getElementById(`${field.name}Error`);
        
        field.classList.remove('error');
        field.classList.add('success');
        
        if (errorElement) {
            errorElement.classList.remove('show');
        }
    }

    /**
     * Clear field error
     */
    clearFieldError(field) {
        const errorElement = document.getElementById(`${field.name}Error`);
        
        field.classList.remove('error', 'success');
        
        if (errorElement) {
            errorElement.classList.remove('show');
        }
    }

    /**
     * Focus next field
     */
    focusNextField(currentField) {
        const fields = Array.from(this.form.querySelectorAll('input, select, textarea'));
        const currentIndex = fields.indexOf(currentField);
        
        if (currentIndex < fields.length - 1) {
            fields[currentIndex + 1].focus();
        }
    }

    /**
     * Submit form
     */
    async submitForm() {
        this.isSubmitting = true;
        this.showSubmitLoading();
        
        try {
            const formData = this.getFormData();
            
            // Simulate API call - replace with actual endpoint
            const response = await this.sendToAPI(formData);
            
            if (response.success) {
                this.showSuccessMessage();
                this.resetForm();
            } else {
                throw new Error(response.message || 'Submission failed');
            }
            
        } catch (error) {
            console.error('Form submission error:', error);
            this.showErrorMessage(error.message);
        } finally {
            this.isSubmitting = false;
            this.hideSubmitLoading();
        }
    }

    /**
     * Get form data
     */
    getFormData() {
        const formData = new FormData(this.form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        // Add timestamp
        data.timestamp = new Date().toISOString();
        data.userAgent = navigator.userAgent;
        data.referrer = document.referrer;
        
        return data;
    }

    /**
     * Send data to API (replace with actual implementation)
     */
    async sendToAPI(data) {
        // This is a mock implementation
        // Replace with your actual API endpoint
        
        return new Promise((resolve) => {
            setTimeout(() => {
                // Simulate success/failure
                const success = Math.random() > 0.1; // 90% success rate for demo
                
                resolve({
                    success: success,
                    message: success ? 'Message sent successfully!' : 'Failed to send message.'
                });
            }, 2000);
        });
        
        // Uncomment and modify for real API integration:
        /*
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
        */
    }

    /**
     * Show submit loading state
     */
    showSubmitLoading() {
        const btnText = this.submitBtn.querySelector('.btn-text');
        const btnSpinner = this.submitBtn.querySelector('.btn-spinner');
        const btnIcon = this.submitBtn.querySelector('.btn-icon');
        
        this.submitBtn.disabled = true;
        btnText.style.opacity = '0';
        btnIcon.style.opacity = '0';
        btnSpinner.classList.remove('hidden');
    }

    /**
     * Hide submit loading state
     */
    hideSubmitLoading() {
        const btnText = this.submitBtn.querySelector('.btn-text');
        const btnSpinner = this.submitBtn.querySelector('.btn-spinner');
        const btnIcon = this.submitBtn.querySelector('.btn-icon');
        
        this.submitBtn.disabled = false;
        btnText.style.opacity = '1';
        btnIcon.style.opacity = '1';
        btnSpinner.classList.add('hidden');
    }

    /**
     * Show success message
     */
    showSuccessMessage() {
        const successMessage = document.getElementById('successMessage');
        const errorMessage = document.getElementById('errorMessage');
        
        errorMessage.classList.add('hidden');
        successMessage.classList.remove('hidden');
        
        // Scroll to message
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Hide after 10 seconds
        setTimeout(() => {
            successMessage.classList.add('hidden');
        }, 10000);
    }

    /**
     * Show error message
     */
    showErrorMessage(message = null) {
        const errorMessage = document.getElementById('errorMessage');
        const successMessage = document.getElementById('successMessage');
        
        if (message) {
            const messageContent = errorMessage.querySelector('.message-content p');
            if (messageContent) {
                messageContent.textContent = message;
            }
        }
        
        successMessage.classList.add('hidden');
        errorMessage.classList.remove('hidden');
        
        // Scroll to message
        errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Hide after 8 seconds
        setTimeout(() => {
            errorMessage.classList.add('hidden');
        }, 8000);
    }

    /**
     * Show form error (for validation errors)
     */
    showFormError(message) {
        // Create temporary error message
        const tempError = document.createElement('div');
        tempError.className = 'form-message error-message';
        tempError.innerHTML = `
            <div class="message-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="15" y1="9" x2="9" y2="15"/>
                    <line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
            </div>
            <div class="message-content">
                <h4>Validation Error</h4>
                <p>${message}</p>
            </div>
        `;
        
        this.form.appendChild(tempError);
        
        // Remove after 5 seconds
        setTimeout(() => {
            tempError.remove();
        }, 5000);
    }

    /**
     * Reset form
     */
    resetForm() {
        this.form.reset();
        
        // Clear all validation states
        const fields = this.form.querySelectorAll('input, select, textarea');
        fields.forEach(field => {
            this.clearFieldError(field);
        });
        
        // Reset character counter
        const counter = document.querySelector('.character-count');
        if (counter) {
            counter.textContent = '0 / 1000';
            counter.style.color = '#9ca3af';
        }
    }

    /**
     * Handle social link clicks
     */
    handleSocialClick(e) {
        const link = e.currentTarget;
        const platform = link.classList.contains('github') ? 'GitHub' :
                        link.classList.contains('linkedin') ? 'LinkedIn' :
                        link.classList.contains('twitter') ? 'Twitter' :
                        link.classList.contains('instagram') ? 'Instagram' : 'Social';
        
        // Add click animation
        link.style.transform = 'scale(0.95)';
        setTimeout(() => {
            link.style.transform = '';
        }, 150);
        
        // Track analytics (if available)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'social_click', {
                platform: platform,
                url: link.href
            });
        }
        
        console.log(`Social link clicked: ${platform}`);
    }

    /**
     * Handle contact method clicks
     */
    handleContactMethodClick(e) {
        const method = e.currentTarget;
        const methodType = method.querySelector('.method-title').textContent;
        const methodValue = method.querySelector('.method-value').textContent;
        
        // Add click animation
        method.style.transform = 'scale(1.02)';
        setTimeout(() => {
            method.style.transform = '';
        }, 200);
        
        // Handle different contact methods
        if (methodType === 'Email') {
            this.copyToClipboard(methodValue, 'Email address copied to clipboard!');
        } else if (methodType === 'Phone') {
            this.copyToClipboard(methodValue, 'Phone number copied to clipboard!');
        } else if (methodType === 'Location') {
            // Open in Google Maps
            const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(methodValue)}`;
            window.open(mapsUrl, '_blank');
        }
    }

    /**
     * Copy text to clipboard
     */
    async copyToClipboard(text, successMessage) {
        try {
            await navigator.clipboard.writeText(text);
            this.showToast(successMessage, 'success');
        } catch (error) {
            console.error('Failed to copy to clipboard:', error);
            this.showToast('Failed to copy to clipboard', 'error');
        }
    }

    /**
     * Show toast notification
     */
    showToast(message, type = 'info') {
        // Remove existing toasts
        document.querySelectorAll('.toast').forEach(toast => toast.remove());
        
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <div class="toast-icon">
                    ${type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ'}
                </div>
                <span class="toast-message">${message}</span>
            </div>
        `;
        
        // Style the toast
        Object.assign(toast.style, {
            position: 'fixed',
            top: '2rem',
            right: '2rem',
            background: type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6',
            color: 'white',
            padding: '1rem 1.5rem',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            zIndex: '10000',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.9rem',
            fontWeight: '500',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease',
            maxWidth: '300px'
        });
        
        document.body.appendChild(toast);
        
        // Animate in
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 10);
        
        // Remove after 4 seconds
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }

    /**
     * Update contact information dynamically
     */
    updateContactInfo(info) {
        if (info.email) {
            const emailValue = document.querySelector('.contact-method:nth-child(1) .method-value');
            if (emailValue) emailValue.textContent = info.email;
        }
        
        if (info.phone) {
            const phoneValue = document.querySelector('.contact-method:nth-child(2) .method-value');
            if (phoneValue) phoneValue.textContent = info.phone;
        }
        
        if (info.location) {
            const locationValue = document.querySelector('.contact-method:nth-child(3) .method-value');
            if (locationValue) locationValue.textContent = info.location;
        }
        
        if (info.socialLinks) {
            Object.keys(info.socialLinks).forEach(platform => {
                const link = document.querySelector(`.social-link.${platform}`);
                if (link) {
                    link.href = info.socialLinks[platform];
                }
            });
        }
    }

    /**
     * Enable/disable form
     */
    setFormEnabled(enabled) {
        const fields = this.form.querySelectorAll('input, select, textarea, button');
        fields.forEach(field => {
            field.disabled = !enabled;
        });
        
        if (enabled) {
            this.form.style.opacity = '1';
            this.form.style.pointerEvents = 'auto';
        } else {
            this.form.style.opacity = '0.6';
            this.form.style.pointerEvents = 'none';
        }
    }

    /**
     * Get form analytics data
     */
    getAnalytics() {
        const fields = this.form.querySelectorAll('input, select, textarea');
        const analytics = {
            totalFields: fields.length,
            completedFields: 0,
            errors: 0,
            completionRate: 0
        };
        
        fields.forEach(field => {
            if (field.value.trim()) {
                analytics.completedFields++;
            }
            if (field.classList.contains('error')) {
                analytics.errors++;
            }
        });
        
        analytics.completionRate = (analytics.completedFields / analytics.totalFields) * 100;
        
        return analytics;
    }

    /**
     * Cleanup function
     */
    destroy() {
        // Remove event listeners
        if (this.form) {
            this.form.removeEventListener('submit', this.handleFormSubmit.bind(this));
        }
        
        // Remove any toasts
        document.querySelectorAll('.toast').forEach(toast => toast.remove());
        
        // Reset flags
        this.isInitialized = false;
        this.isSubmitting = false;
    }
}

// Initialize contact section when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.contactSection = new ContactSection();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ContactSection;
} 
