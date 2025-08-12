/**
 * Main Application Controller
 * Dream Maker Developer Portfolio
 * 
 * This is the central controller that initializes and manages
 * the entire application lifecycle
 */

class App {
    constructor() {
        this.version = '1.0.0';
        this.isInitialized = false;
        this.currentPage = 'home';
        this.components = new Map();
        this.activeComponents = new Set();
        this.firebase = window.FirebaseService;
        this.router = null;
        this.componentLoader = null;
        this.siteConfig = null;
        this.performanceTrace = null;
        
        // Cache for frequently accessed data
        this.cache = {
            projects: null,
            testimonials: null,
            services: null,
            technologies: null,
            cacheTime: 5 * 60 * 1000 // 5 minutes
        };
        
        // Bind methods
        this.init = this.init.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        this.handleResize = this.handleResize.bind(this);
    }

    /**
     * Initialize the application
     */
    async init() {
        try {
            console.log('🚀 Initializing Dream Maker Portfolio...');
            
            // Start performance monitoring
            if (this.firebase && this.firebase.performance) {
                this.performanceTrace = this.firebase.startTrace('app_initialization');
            }

            // Load site configuration
            await this.loadSiteConfig();

            // Initialize core modules
            await this.initializeModules();

            // Setup global event listeners
            this.setupEventListeners();

            // Load initial components
            await this.loadInitialComponents();

            // Setup lazy loading for sections
            this.setupLazyLoading();

            // Initialize router
            await this.initializeRouter();

            // Mark app as ready
            this.markAppReady();

            // Log successful initialization
            console.log('✅ Dream Maker Portfolio initialized successfully!');
            
        } catch (error) {
            console.error('❌ Failed to initialize app:', error);
            this.handleInitError(error);
        }
    }

    /**
     * Load site configuration from Firebase
     */
    async loadSiteConfig() {
        try {
            this.siteConfig = await this.firebase.getSiteConfig();
            
            // Apply configuration to the page
            if (this.siteConfig) {
                this.applySiteConfig();
            }
        } catch (error) {
            console.warn('Could not load site config, using defaults:', error);
            this.siteConfig = this.getDefaultConfig();
        }
    }

    /**
     * Apply site configuration to the page
     */
    applySiteConfig() {
        // Update meta tags
        if (this.siteConfig.meta) {
            if (this.siteConfig.meta.title) {
                document.title = this.siteConfig.meta.title;
            }
            if (this.siteConfig.meta.description) {
                const metaDesc = document.querySelector('meta[name="description"]');
                if (metaDesc) metaDesc.content = this.siteConfig.meta.description;
            }
        }

        // Store config in window for component access
        window.siteConfig = this.siteConfig;
    }

    /**
     * Get default configuration if Firebase fails
     */
    getDefaultConfig() {
        return {
            hero: {
                mainTagline: "I can make your dreams come true",
                subtitle: "From concept to reality - I turn your boldest ideas into powerful digital solutions",
                ctaText: "Let's Build Your Dream"
            },
            about: {
                headline: "Every great app started as someone's dream",
                stats: {
                    projectsCompleted: 50,
                    dreamsRealized: 42,
                    technologiesMastered: 25
                }
            },
            contact: {
                email: "hello@dreammaker.dev",
                responseTime: "within 24 hours"
            }
        };
    }

    /**
     * Initialize core modules
     */
    async initializeModules() {
        // Initialize Component Loader
        if (typeof ComponentLoader !== 'undefined') {
            this.componentLoader = new ComponentLoader(this);
            window.componentLoader = this.componentLoader;
        }

        // Initialize Router
        if (typeof Router !== 'undefined') {
            this.router = new Router(this);
            window.router = this.router;
        }

        // Initialize other modules as needed
        this.initializeAnalytics();
        this.initializePerformanceMonitoring();
    }

    /**
     * Setup global event listeners
     */
    setupEventListeners() {
        // Scroll events for lazy loading and animations
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (scrollTimeout) {
                window.cancelAnimationFrame(scrollTimeout);
            }
            scrollTimeout = window.requestAnimationFrame(this.handleScroll);
        }, { passive: true });

        // Resize events for responsive components
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(this.handleResize, 250);
        });

        // Visibility change for performance optimization
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.onPageHidden();
            } else {
                this.onPageVisible();
            }
        });

        // Network status
        window.addEventListener('online', () => this.onNetworkOnline());
        window.addEventListener('offline', () => this.onNetworkOffline());
    }

    /**
     * Handle scroll events
     */
    handleScroll() {
        const scrollY = window.scrollY;
        const scrollPercentage = (scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;

        // Emit custom event for components
        window.dispatchEvent(new CustomEvent('app:scroll', {
            detail: { scrollY, scrollPercentage }
        }));

        // Check for lazy-loaded sections
        this.checkLazyLoadedSections();
    }

    /**
     * Handle resize events
     */
    handleResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        // Emit custom event for components
        window.dispatchEvent(new CustomEvent('app:resize', {
            detail: { width, height }
        }));

        // Update mobile/desktop specific features
        this.updateResponsiveFeatures(width);
    }

    /**
     * Update responsive features based on screen width
     */
    updateResponsiveFeatures(width) {
        const isMobile = width < 768;
        const isTablet = width >= 768 && width < 1024;
        const isDesktop = width >= 1024;

        document.body.classList.toggle('is-mobile', isMobile);
        document.body.classList.toggle('is-tablet', isTablet);
        document.body.classList.toggle('is-desktop', isDesktop);
    }

    /**
     * Setup lazy loading for sections
     */
    setupLazyLoading() {
        // Use Intersection Observer for lazy loading
        const options = {
            root: null,
            rootMargin: '50px',
            threshold: 0.1
        };

        this.lazyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadLazySection(entry.target);
                }
            });
        }, options);

        // Observe all lazy sections
        document.querySelectorAll('.lazy-section').forEach(section => {
            this.lazyObserver.observe(section);
        });
    }

    /**
     * Load a lazy section
     */
    async loadLazySection(section) {
        const componentName = section.dataset.component;
        
        if (!componentName || section.classList.contains('loaded')) {
            return;
        }

        try {
            // Load component if available
            if (this.componentLoader) {
                await this.componentLoader.loadComponent(componentName, section);
            }

            // Add visible class for animation
            section.classList.add('visible', 'loaded');

            // Stop observing this section
            this.lazyObserver.unobserve(section);

            // Log analytics
            this.firebase.logEvent('section_viewed', {
                section_name: componentName
            });

        } catch (error) {
            console.error(`Failed to load section ${componentName}:`, error);
        }
    }

    /**
     * Check lazy loaded sections (fallback for older browsers)
     */
    checkLazyLoadedSections() {
        if (!('IntersectionObserver' in window)) {
            const sections = document.querySelectorAll('.lazy-section:not(.loaded)');
            sections.forEach(section => {
                const rect = section.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    this.loadLazySection(section);
                }
            });
        }
    }

    /**
     * Load initial components
     */
    async loadInitialComponents() {
        const initialComponents = ['header', 'navigation', 'footer'];
        
        for (const component of initialComponents) {
            try {
                const mountPoint = document.getElementById(`${component}-mount`);
                if (mountPoint && this.componentLoader) {
                    await this.componentLoader.loadComponent(component, mountPoint);
                }
            } catch (error) {
                console.warn(`Could not load ${component}:`, error);
            }
        }
    }

    /**
     * Initialize router
     */
    async initializeRouter() {
        if (this.router) {
            await this.router.init();
        }
    }

    /**
     * Initialize analytics
     */
    initializeAnalytics() {
        // Log initial page view
        this.firebase.logPageView('Home');

        // Track performance metrics
        if ('performance' in window && 'getEntriesByType' in performance) {
            const perfData = performance.getEntriesByType('navigation')[0];
            if (perfData) {
                // Log page load performance
                this.firebase.logEvent('page_load_time', {
                    dns: Math.round(perfData.domainLookupEnd - perfData.domainLookupStart),
                    tcp: Math.round(perfData.connectEnd - perfData.connectStart),
                    request: Math.round(perfData.responseStart - perfData.requestStart),
                    response: Math.round(perfData.responseEnd - perfData.responseStart),
                    dom: Math.round(perfData.domInteractive - perfData.responseEnd),
                    load: Math.round(perfData.loadEventEnd - perfData.loadEventStart),
                    total: Math.round(perfData.loadEventEnd - perfData.fetchStart)
                });
            }
        }
    }

    /**
     * Initialize performance monitoring
     */
    initializePerformanceMonitoring() {
        // Monitor long tasks
        if ('PerformanceObserver' in window) {
            try {
                const observer = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        // Log long tasks to Firebase
                        if (entry.duration > 50) {
                            this.firebase.logEvent('long_task', {
                                duration: Math.round(entry.duration),
                                start_time: Math.round(entry.startTime)
                            });
                        }
                    }
                });
                observer.observe({ entryTypes: ['longtask'] });
            } catch (e) {
                // Silently fail if not supported
            }
        }
    }

    /**
     * Mark app as ready
     */
    markAppReady() {
        this.isInitialized = true;
        document.body.classList.add('app-ready');
        
        // Stop initialization performance trace
        if (this.performanceTrace) {
            this.performanceTrace.stop();
        }

        // Dispatch ready event
        window.dispatchEvent(new CustomEvent('app:ready', {
            detail: { version: this.version }
        }));
    }

    /**
     * Handle initialization errors
     */
    handleInitError(error) {
        console.error('Initialization error:', error);
        
        // Show user-friendly error message
        const errorContainer = document.createElement('div');
        errorContainer.className = 'init-error';
        errorContainer.innerHTML = `
            <div class="error-content">
                <h2>Oops! Something went wrong</h2>
                <p>We're having trouble loading the portfolio. Please try refreshing the page.</p>
                <button onclick="location.reload()" class="error-retry-btn">Refresh Page</button>
            </div>
        `;
        document.body.appendChild(errorContainer);
    }

    /**
     * Handle page hidden (tab switched)
     */
    onPageHidden() {
        // Pause animations, videos, etc.
        window.dispatchEvent(new CustomEvent('app:pause'));
    }

    /**
     * Handle page visible (tab active)
     */
    onPageVisible() {
        // Resume animations, videos, etc.
        window.dispatchEvent(new CustomEvent('app:resume'));
    }

    /**
     * Handle network online
     */
    onNetworkOnline() {
        console.log('📶 Network connection restored');
        document.body.classList.remove('offline');
        
        // Retry any failed requests
        window.dispatchEvent(new CustomEvent('app:online'));
    }

    /**
     * Handle network offline
     */
    onNetworkOffline() {
        console.log('📵 Network connection lost');
        document.body.classList.add('offline');
        
        // Notify components
        window.dispatchEvent(new CustomEvent('app:offline'));
    }

    /**
     * Get cached data with automatic refresh
     */
    async getCachedData(key, fetchFunction) {
        const cached = this.cache[key];
        const now = Date.now();

        if (cached && cached.timestamp && (now - cached.timestamp) < this.cache.cacheTime) {
            return cached.data;
        }

        // Fetch fresh data
        try {
            const data = await fetchFunction();
            this.cache[key] = {
                data: data,
                timestamp: now
            };
            return data;
        } catch (error) {
            // Return cached data if fetch fails and cache exists
            if (cached && cached.data) {
                console.warn(`Using stale cache for ${key} due to fetch error:`, error);
                return cached.data;
            }
            throw error;
        }
    }

    /**
     * Preload critical data
     */
    async preloadData() {
        const preloadPromises = [
            this.getCachedData('projects', () => this.firebase.getFeaturedProjects()),
            this.getCachedData('testimonials', () => this.firebase.getFeaturedTestimonials()),
            this.getCachedData('services', () => this.firebase.getServices())
        ];

        try {
            await Promise.all(preloadPromises);
            console.log('✅ Critical data preloaded');
        } catch (error) {
            console.warn('Some data preloading failed:', error);
        }
    }

    /**
     * Clean up resources
     */
    destroy() {
        // Remove event listeners
        window.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('resize', this.handleResize);
        
        // Disconnect observers
        if (this.lazyObserver) {
            this.lazyObserver.disconnect();
        }

        // Clear components
        this.components.clear();
        this.activeComponents.clear();

        // Clear cache
        this.cache = {};

        console.log('App destroyed');
    }
}

// Make App class available globally
window.App = App;