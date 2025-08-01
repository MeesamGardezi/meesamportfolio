 
 
/**
 * Footer Component JavaScript
 * Handles newsletter signup, back to top, navigation, and interactions
 */

class Footer {
    constructor() {
        this.isInitialized = false;
        this.isSubmittingNewsletter = false;
        this.backToTopVisible = false;
        this.scrollThreshold = 300;
        
        // DOM elements
        this.footer = null;
        this.newsletterForm = null;
        this.newsletterInput = null;
        this.newsletterBtn = null;
        this.backToTopBtn = null;
        this.footerLinks = [];
        this.socialLinks = [];
        this.contactLinks = [];
        
        this.init();
    }

    /**
     * Initialize footer functionality
     */
    init() {
        if (this.isInitialized) return;
        
        try {
            this.cacheElements();
            this.setupEventListeners();
            this.updateCurrentYear();
            this.setupScrollEffects();
            
            this.isInitialized = true;
            console.log('Footer initialized successfully');
        } catch (error) {
            console.error('Error initializing footer:', error);
        }
    }

    /**
     * Cache DOM elements
     */
    cacheElements() {
        this.footer = document.getElementById('footer');
        this.newsletterForm = document.getElementById('newsletterForm');
        this.newsletterInput = document.getElementById('newsletterEmail');
        this.newsletterBtn = document.getElementById('newsletterBtn');
        this.backToTopBtn = document.getElementById('backToTop');
        this.footerLinks = document.querySelectorAll('.footer-link');
        this.socialLinks = document.querySelectorAll('.social-link');
        this.contactLinks = document.querySelectorAll('.contact-value');
        
        if (!this.footer) {
            throw new Error('Footer element not found');
        }
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Newsletter form
        if (this.newsletterForm) {
            this.newsletterForm.addEventListener('submit', this.handleNewsletterSubmit.bind(this));
        }
        
        if (this.newsletterInput) {
            this.newsletterInput.addEventListener('input', this.handleNewsletterInput.bind(this));
            this.newsletterInput.addEventListener('blur', this.validateNewsletterEmail.bind(this));
        }
        
        // Back to top button
        if (this.backToTopBtn) {
            this.backToTopBtn.addEventListener('click', this.handleBackToTop.bind(this));
        }
        
        // Footer navigation links
        this.footerLinks.forEach(link => {
            link.addEventListener('click', this.handleFooterLinkClick.bind(this));
        });
        
        // Social links
        this.socialLinks.forEach(link => {
            link.addEventListener('click', this.handleSocialLinkClick.bind(this));
        });
        
        // Contact links (for copying)
        this.contactLinks.forEach(link => {
            if (link.tagName === 'A' && (link.href.startsWith('mailto:') || link.href.startsWith('tel:'))) {
                link.addEventListener('click', this.handleContactLinkClick.bind(this));
            }
        });
        
        // Scroll events
        window.addEventListener('scroll', this.handleScroll.bind(this));
    }

    /**
     * Setup scroll effects
     */
    setupScrollEffects() {
        // Throttled scroll handler for performance
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (scrollTimeout) {
                cancelAnimationFrame(scrollTimeout);
            }
            
            scrollTimeout = requestAnimationFrame(this.handleScroll.bind(this));
        }, { passive: true });
        
        // Initial scroll check
        this.handleScroll();
    }

    /**
     * Update current year in copyright
     */
    updateCurrentYear() {
        const yearElement = document.getElementById('currentYear');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
    }

    /**
     * Handle scroll events
     */
    handleScroll() {
        const scrollY = window.scrollY;
        
        // Show/hide back to top button
        if (scrollY > this.scrollThreshold && !this.backToTopVisible) {
            this.showBackToTop();
        } else if (scrollY <= this.scrollThreshold && this.backToTopVisible) {
            this.hideBackToTop();
        }
    }

    /**
     * Show back to top button
     */
    showBackToTop() {
        this.backToTopVisible = true;
        if (this.backToTopBtn) {
            this.backToTopBtn.classList.add('visible');
        }
    }

    /**
     * Hide back to top button
     */
    hideBackToTop() {
        this.backToTopVisible = false;
        if (this.backToTopBtn) {
            this.backToTopBtn.classList.remove('visible');
        }
    }

    /**
     * Handle back to top button click
     */
    handleBackToTop(e) {
        e.preventDefault();
        
        // Add click animation
        this.backToTopBtn.style.transform = 'translateY(-1px) scale(0.95)';
        setTimeout(() => {
            this.backToTopBtn.style.transform = '';
        }, 150);
        
        // Smooth scroll to top
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        // Track event
        this.trackEvent('back_to_top_click');
    }

    /**
     * Handle newsletter form submission
     */
    async handleNewsletterSubmit(e) {
        e.preventDefault();
        
        if (this.isSubmittingNewsletter) return;
        
        // Validate email
        if (!this.validateNewsletterEmail()) {
            return;
        }
        
        const email = this.newsletterInput.value.trim();
        
        try {
            this.isSubmittingNewsletter = true;
            this.showNewsletterLoading();
            
            // Submit newsletter signup
            const success = await this.submitNewsletterSignup(email);
            
            if (success) {
                this.showNewsletterSuccess();
                this.resetNewsletterForm();
                this.trackEvent('newsletter_signup', { email_domain: email.split('@')[1] });
            } else {
                throw new Error('Newsletter signup failed');
            }
            
        } catch (error) {
            console.error('Newsletter signup error:', error);
            this.showNewsletterError('Failed to subscribe. Please try again.');
        } finally {
            this.isSubmittingNewsletter = false;
            this.hideNewsletterLoading();
        }
    }

    /**
     * Handle newsletter input changes
     */
    handleNewsletterInput() {
        // Clear previous errors on input
        this.clearNewsletterError();
        
        // Reset button state
        if (this.newsletterInput.classList.contains('error')) {
            this.newsletterInput.classList.remove('error');
        }
    }

    /**
     * Validate newsletter email
     */
    validateNewsletterEmail() {
        const email = this.newsletterInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!email) {
            this.showNewsletterError('Email address is required.');
            return false;
        }
        
        if (!emailRegex.test(email)) {
            this.showNewsletterError('Please enter a valid email address.');
            return false;
        }
        
        this.clearNewsletterError();
        return true;
    }

    /**
     * Submit newsletter signup (replace with actual API)
     */
    async submitNewsletterSignup(email) {
        // This is a mock implementation
        // Replace with your actual newsletter service API
        
        return new Promise((resolve) => {
            setTimeout(() => {
                // Simulate success/failure
                const success = Math.random() > 0.1; // 90% success rate for demo
                resolve(success);
            }, 2000);
        });
        
        // Uncomment and modify for real API integration:
        /*
        const response = await fetch('/api/newsletter/subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        return result.success;
        */
    }

    /**
     * Show newsletter loading state
     */
    showNewsletterLoading() {
        const btnText = this.newsletterBtn.querySelector('.btn-text');
        const btnSpinner = this.newsletterBtn.querySelector('.btn-spinner');
        const btnIcon = this.newsletterBtn.querySelector('.btn-icon');
        
        this.newsletterBtn.disabled = true;
        btnText.style.opacity = '0';
        btnIcon.style.opacity = '0';
        btnSpinner.classList.remove('hidden');
    }

    /**
     * Hide newsletter loading state
     */
    hideNewsletterLoading() {
        const btnText = this.newsletterBtn.querySelector('.btn-text');
        const btnSpinner = this.newsletterBtn.querySelector('.btn-spinner');
        const btnIcon = this.newsletterBtn.querySelector('.btn-icon');
        
        this.newsletterBtn.disabled = false;
        btnText.style.opacity = '1';
        btnIcon.style.opacity = '1';
        btnSpinner.classList.add('hidden');
    }

    /**
     * Show newsletter success message
     */
    showNewsletterSuccess() {
        const successMessage = document.getElementById('newsletterSuccess');
        if (successMessage) {
            successMessage.classList.remove('hidden');
            
            // Hide after 5 seconds
            setTimeout(() => {
                successMessage.classList.add('hidden');
            }, 5000);
        }
    }

    /**
     * Show newsletter error
     */
    showNewsletterError(message) {
        const errorElement = document.getElementById('newsletterError');
        
        this.newsletterInput.classList.add('error');
        
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
    }

    /**
     * Clear newsletter error
     */
    clearNewsletterError() {
        const errorElement = document.getElementById('newsletterError');
        
        if (errorElement) {
            errorElement.classList.remove('show');
        }
    }

    /**
     * Reset newsletter form
     */
    resetNewsletterForm() {
        this.newsletterInput.value = '';
        this.newsletterInput.classList.remove('error');
        this.clearNewsletterError();
    }

    /**
     * Handle footer link clicks
     */
    handleFooterLinkClick(e) {
        const link = e.currentTarget;
        const href = link.getAttribute('href');
        
        // Handle internal section links
        if (href && href.startsWith('#')) {
            e.preventDefault();
            
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                this.scrollToSection(targetElement);
            }
        }
        // Handle same-page section links (index.html#section)
        else if (href && href.includes('#') && href.includes('index.html')) {
            const [page, section] = href.split('#');
            const currentPage = window.location.pathname;
            
            if (currentPage.endsWith('index.html') || currentPage === '/') {
                e.preventDefault();
                const targetElement = document.getElementById(section);
                
                if (targetElement) {
                    this.scrollToSection(targetElement);
                }
            }
        }
        
        // Track link clicks
        const linkText = link.textContent.trim();
        this.trackEvent('footer_link_click', { link: linkText });
    }

    /**
     * Handle social link clicks
     */
    handleSocialLinkClick(e) {
        const link = e.currentTarget;
        const platform = this.getSocialPlatform(link);
        
        // Add click animation
        link.style.transform = 'translateY(-2px) scale(0.95)';
        setTimeout(() => {
            link.style.transform = '';
        }, 150);
        
        // Track social link clicks
        this.trackEvent('social_link_click', { 
            platform: platform,
            location: 'footer'
        });
    }

    /**
     * Handle contact link clicks (for copying)
     */
    handleContactLinkClick(e) {
        const link = e.currentTarget;
        const href = link.href;
        
        if (href.startsWith('mailto:') || href.startsWith('tel:')) {
            // Also copy to clipboard for convenience
            const value = href.startsWith('mailto:') ? 
                         href.replace('mailto:', '') : 
                         href.replace('tel:', '');
            
            this.copyToClipboard(value, `${href.startsWith('mailto:') ? 'Email' : 'Phone'} copied to clipboard!`);
        }
        
        // Track contact clicks
        const contactType = href.startsWith('mailto:') ? 'email' : 'phone';
        this.trackEvent('contact_click', { 
            type: contactType,
            location: 'footer'
        });
    }

    /**
     * Get social platform name from link
     */
    getSocialPlatform(link) {
        if (link.classList.contains('github')) return 'GitHub';
        if (link.classList.contains('linkedin')) return 'LinkedIn';
        if (link.classList.contains('twitter')) return 'Twitter';
        if (link.classList.contains('instagram')) return 'Instagram';
        return 'Social';
    }

    /**
     * Smooth scroll to section
     */
    scrollToSection(element) {
        const navbar = document.querySelector('.navbar');
        const navbarHeight = navbar ? navbar.offsetHeight : 80;
        const elementPosition = element.offsetTop - navbarHeight - 20;
        
        window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
        });
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
        document.querySelectorAll('.footer-toast').forEach(toast => toast.remove());
        
        const toast = document.createElement('div');
        toast.className = `footer-toast toast-${type}`;
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
            bottom: '6rem',
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
            transform: 'translateY(20px)',
            opacity: '0',
            transition: 'all 0.3s ease',
            maxWidth: '300px'
        });
        
        document.body.appendChild(toast);
        
        // Animate in
        setTimeout(() => {
            toast.style.transform = 'translateY(0)';
            toast.style.opacity = '1';
        }, 10);
        
        // Remove after 4 seconds
        setTimeout(() => {
            toast.style.transform = 'translateY(20px)';
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }

    /**
     * Track analytics events
     */
    trackEvent(eventName, properties = {}) {
        // Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, properties);
        }
        
        // Custom analytics
        if (window.analytics) {
            window.analytics.track(eventName, properties);
        }
        
        console.log(`Footer event: ${eventName}`, properties);
    }

    /**
     * Show footer notification
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `footer-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close" aria-label="Close notification">×</button>
            </div>
        `;
        
        // Style notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '2rem',
            right: '2rem',
            background: type === 'error' ? '#ef4444' : type === 'success' ? '#10b981' : '#3b82f6',
            color: 'white',
            padding: '1rem 1.5rem',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: '10001',
            fontSize: '0.9rem',
            fontWeight: '500',
            maxWidth: '400px',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease'
        });
        
        document.body.appendChild(notification);
        
        // Close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        });
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // Auto-remove after 6 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 6000);
    }

    /**
     * Update footer configuration
     */
    updateConfig(config) {
        if (config.scrollThreshold !== undefined) {
            this.scrollThreshold = config.scrollThreshold;
        }
        
        if (config.newsletterEndpoint !== undefined) {
            this.newsletterEndpoint = config.newsletterEndpoint;
        }
    }

    /**
     * Get footer statistics
     */
    getStats() {
        return {
            isInitialized: this.isInitialized,
            backToTopVisible: this.backToTopVisible,
            isSubmittingNewsletter: this.isSubmittingNewsletter,
            scrollPosition: window.scrollY,
            linksCount: this.footerLinks.length,
            socialLinksCount: this.socialLinks.length
        };
    }

    /**
     * Force show back to top button
     */
    forceShowBackToTop() {
        this.showBackToTop();
    }

    /**
     * Force hide back to top button
     */
    forceHideBackToTop() {
        this.hideBackToTop();
    }

    /**
     * Cleanup and destroy
     */
    destroy() {
        // Remove event listeners
        window.removeEventListener('scroll', this.handleScroll.bind(this));
        
        // Remove toasts and notifications
        document.querySelectorAll('.footer-toast, .footer-notification').forEach(el => el.remove());
        
        // Reset form
        if (this.newsletterForm) {
            this.resetNewsletterForm();
        }
        
        // Hide back to top button
        this.hideBackToTop();
        
        this.isInitialized = false;
    }
}

// Initialize footer when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.footer = new Footer();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Footer;
}