 
/**
 * Navbar Component JavaScript
 * Handles navigation, mobile menu, scroll effects, and theme toggle
 */

class Navbar {
    constructor() {
        this.isInitialized = false;
        this.isMobileMenuOpen = false;
        this.currentTheme = 'light';
        this.scrollThreshold = 50;
        this.activeSection = 'home';
        
        // DOM elements
        this.navbar = null;
        this.navbarToggle = null;
        this.navbarOverlay = null;
        this.overlayClose = null;
        this.themeToggle = null;
        this.scrollProgress = null;
        this.navLinks = [];
        
        this.init();
    }

    /**
     * Initialize navbar functionality
     */
    init() {
        if (this.isInitialized) return;
        
        try {
            this.cacheElements();
            this.setupEventListeners();
            this.setupScrollEffects();
            this.setupActiveLinks();
            this.initializeTheme();
            
            this.isInitialized = true;
            console.log('Navbar initialized successfully');
        } catch (error) {
            console.error('Error initializing navbar:', error);
        }
    }

    /**
     * Cache DOM elements
     */
    cacheElements() {
        this.navbar = document.getElementById('navbar');
        this.navbarToggle = document.getElementById('navbarToggle');
        this.navbarOverlay = document.getElementById('navbarOverlay');
        this.overlayClose = document.getElementById('overlayClose');
        this.themeToggle = document.getElementById('themeToggle');
        this.scrollProgress = document.getElementById('scrollProgress');
        this.navLinks = document.querySelectorAll('.nav-link, .overlay-link');
        
        if (!this.navbar) {
            throw new Error('Navbar element not found');
        }
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Mobile menu toggle
        if (this.navbarToggle) {
            this.navbarToggle.addEventListener('click', this.toggleMobileMenu.bind(this));
        }
        
        if (this.overlayClose) {
            this.overlayClose.addEventListener('click', this.closeMobileMenu.bind(this));
        }
        
        // Navigation links
        this.navLinks.forEach(link => {
            link.addEventListener('click', this.handleNavClick.bind(this));
        });
        
        // Theme toggle
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', this.toggleTheme.bind(this));
        }
        
        // Overlay backdrop click
        if (this.navbarOverlay) {
            this.navbarOverlay.addEventListener('click', (e) => {
                if (e.target === this.navbarOverlay) {
                    this.closeMobileMenu();
                }
            });
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        
        // Window events
        window.addEventListener('scroll', this.handleScroll.bind(this));
        window.addEventListener('resize', this.handleResize.bind(this));
        
        // Page visibility change
        document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
    }

    /**
     * Setup scroll effects
     */
    setupScrollEffects() {
        // Initial scroll position check
        this.handleScroll();
        
        // Throttled scroll handler for performance
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (scrollTimeout) {
                cancelAnimationFrame(scrollTimeout);
            }
            
            scrollTimeout = requestAnimationFrame(this.handleScroll.bind(this));
        }, { passive: true });
    }

    /**
     * Setup active link highlighting
     */
    setupActiveLinks() {
        // Intersection observer for section detection
        const observerOptions = {
            root: null,
            rootMargin: '-80px 0px -60% 0px',
            threshold: 0.1
        };
        
        this.sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    this.setActiveLink(sectionId);
                }
            });
        }, observerOptions);
        
        // Observe sections
        const sections = document.querySelectorAll('section[id], main[id]');
        sections.forEach(section => {
            this.sectionObserver.observe(section);
        });
    }

    /**
     * Initialize theme
     */
    initializeTheme() {
        // Check for saved theme preference
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        this.currentTheme = savedTheme || (prefersDark ? 'dark' : 'light');
        this.applyTheme(this.currentTheme);
        
        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!savedTheme) {
                this.currentTheme = e.matches ? 'dark' : 'light';
                this.applyTheme(this.currentTheme);
            }
        });
    }

    /**
     * Handle scroll events
     */
    handleScroll() {
        const scrollY = window.scrollY;
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        
        // Update navbar appearance on scroll
        if (scrollY > this.scrollThreshold) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }
        
        // Update scroll progress
        if (this.scrollProgress && documentHeight > 0) {
            const progress = (scrollY / documentHeight) * 100;
            this.scrollProgress.style.width = `${Math.min(progress, 100)}%`;
        }
    }

    /**
     * Handle window resize
     */
    handleResize() {
        // Close mobile menu on desktop
        if (window.innerWidth > 768 && this.isMobileMenuOpen) {
            this.closeMobileMenu();
        }
    }

    /**
     * Handle visibility change
     */
    handleVisibilityChange() {
        // Close mobile menu when page becomes hidden
        if (document.hidden && this.isMobileMenuOpen) {
            this.closeMobileMenu();
        }
    }

    /**
     * Handle keyboard navigation
     */
    handleKeyDown(e) {
        // Close mobile menu with Escape key
        if (e.key === 'Escape' && this.isMobileMenuOpen) {
            this.closeMobileMenu();
        }
        
        // Handle focus trap in mobile menu
        if (this.isMobileMenuOpen && e.key === 'Tab') {
            this.handleFocusTrap(e);
        }
    }

    /**
     * Handle focus trap in mobile menu
     */
    handleFocusTrap(e) {
        const focusableElements = this.navbarOverlay.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
        }
    }

    /**
     * Toggle mobile menu
     */
    toggleMobileMenu() {
        if (this.isMobileMenuOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }

    /**
     * Open mobile menu
     */
    openMobileMenu() {
        this.isMobileMenuOpen = true;
        
        // Update UI
        this.navbarToggle.classList.add('active');
        this.navbarToggle.setAttribute('aria-expanded', 'true');
        this.navbarOverlay.classList.add('active');
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        // Focus first menu item
        setTimeout(() => {
            const firstLink = this.navbarOverlay.querySelector('.overlay-link');
            if (firstLink) firstLink.focus();
        }, 100);
        
        // Track analytics
        this.trackEvent('mobile_menu_open');
    }

    /**
     * Close mobile menu
     */
    closeMobileMenu() {
        this.isMobileMenuOpen = false;
        
        // Update UI
        this.navbarToggle.classList.remove('active');
        this.navbarToggle.setAttribute('aria-expanded', 'false');
        this.navbarOverlay.classList.remove('active');
        
        // Restore body scroll
        document.body.style.overflow = '';
        
        // Return focus to toggle button
        this.navbarToggle.focus();
        
        // Track analytics
        this.trackEvent('mobile_menu_close');
    }

    /**
     * Handle navigation link clicks
     */
    handleNavClick(e) {
        const link = e.currentTarget;
        const href = link.getAttribute('href');
        
        // Handle internal section links
        if (href && href.startsWith('#')) {
            e.preventDefault();
            
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                this.scrollToSection(targetElement, targetId);
            }
            
            // Close mobile menu if open
            if (this.isMobileMenuOpen) {
                this.closeMobileMenu();
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
                    this.scrollToSection(targetElement, section);
                }
                
                if (this.isMobileMenuOpen) {
                    this.closeMobileMenu();
                }
            }
        }
        
        // Track link clicks
        const linkText = link.textContent.trim();
        this.trackEvent('nav_link_click', { link: linkText });
    }

    /**
     * Smooth scroll to section
     */
    scrollToSection(element, sectionId) {
        const navbarHeight = this.navbar.offsetHeight;
        const elementPosition = element.offsetTop - navbarHeight - 20;
        
        window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
        });
        
        // Update active link immediately
        this.setActiveLink(sectionId);
        
        // Update URL hash
        if (history.pushState) {
            history.pushState(null, null, `#${sectionId}`);
        }
    }

    /**
     * Set active navigation link
     */
    setActiveLink(sectionId) {
        if (this.activeSection === sectionId) return;
        
        this.activeSection = sectionId;
        
        // Remove active class from all links
        this.navLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to current section links
        const activeLinks = document.querySelectorAll(`[data-section="${sectionId}"]`);
        activeLinks.forEach(link => {
            link.classList.add('active');
        });
        
        // Handle projects page
        if (window.location.pathname.includes('projects.html')) {
            const projectLinks = document.querySelectorAll('[data-page="projects"]');
            projectLinks.forEach(link => {
                link.classList.add('active');
            });
        }
    }

    /**
     * Toggle theme
     */
    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(this.currentTheme);
        
        // Save preference
        localStorage.setItem('theme', this.currentTheme);
        
        // Track theme change
        this.trackEvent('theme_toggle', { theme: this.currentTheme });
    }

    /**
     * Apply theme
     */
    applyTheme(theme) {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            this.themeToggle?.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
            this.themeToggle?.classList.remove('dark');
        }
        
        // Update meta theme color
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', theme === 'dark' ? '#1a202c' : '#ffffff');
        }
    }

    /**
     * Update navbar for different pages
     */
    updateForPage(pageName) {
        // Remove active class from all links
        this.navLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        // Set active link based on page
        const pageLinks = document.querySelectorAll(`[data-page="${pageName}"]`);
        pageLinks.forEach(link => {
            link.classList.add('active');
        });
    }

    /**
     * Show/hide navbar
     */
    setVisibility(visible) {
        if (visible) {
            this.navbar.style.transform = 'translateY(0)';
        } else {
            this.navbar.style.transform = 'translateY(-100%)';
        }
    }

    /**
     * Set navbar transparency
     */
    setTransparency(transparent) {
        if (transparent) {
            this.navbar.classList.add('transparent');
        } else {
            this.navbar.classList.remove('transparent');
        }
    }

    /**
     * Add notification badge to navbar
     */
    showNotification(message, type = 'info') {
        // Remove existing notifications
        document.querySelectorAll('.navbar-notification').forEach(el => el.remove());
        
        const notification = document.createElement('div');
        notification.className = `navbar-notification ${type}`;
        notification.textContent = message;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '90px',
            right: '2rem',
            background: type === 'error' ? '#ef4444' : type === 'success' ? '#10b981' : '#3b82f6',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: '1001',
            fontSize: '0.9rem',
            fontWeight: '500',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease'
        });
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // Remove after 4 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
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
        
        console.log(`Navbar event: ${eventName}`, properties);
    }

    /**
     * Get current navigation state
     */
    getState() {
        return {
            activeSection: this.activeSection,
            isMobileMenuOpen: this.isMobileMenuOpen,
            currentTheme: this.currentTheme,
            scrollPosition: window.scrollY,
            isScrolled: this.navbar.classList.contains('scrolled')
        };
    }

    /**
     * Update navbar configuration
     */
    updateConfig(config) {
        if (config.scrollThreshold !== undefined) {
            this.scrollThreshold = config.scrollThreshold;
        }
        
        if (config.theme !== undefined) {
            this.currentTheme = config.theme;
            this.applyTheme(this.currentTheme);
        }
        
        if (config.activeSection !== undefined) {
            this.setActiveLink(config.activeSection);
        }
    }

    /**
     * Cleanup and destroy
     */
    destroy() {
        // Remove event listeners
        window.removeEventListener('scroll', this.handleScroll.bind(this));
        window.removeEventListener('resize', this.handleResize.bind(this));
        document.removeEventListener('keydown', this.handleKeyDown.bind(this));
        document.removeEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
        
        // Disconnect observers
        if (this.sectionObserver) {
            this.sectionObserver.disconnect();
        }
        
        // Reset body overflow
        document.body.style.overflow = '';
        
        // Remove notifications
        document.querySelectorAll('.navbar-notification').forEach(el => el.remove());
        
        this.isInitialized = false;
    }
}

// Initialize navbar when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.navbar = new Navbar();
});

// Handle page load for SPA-like behavior
window.addEventListener('load', () => {
    if (window.navbar) {
        // Update active link based on URL hash
        const hash = window.location.hash.substring(1);
        if (hash) {
            window.navbar.setActiveLink(hash);
        }
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Navbar;
}