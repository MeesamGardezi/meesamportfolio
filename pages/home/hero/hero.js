/**
 * Hero Section JavaScript
 * Handles animations, interactions, and dynamic content
 */

class HeroSection {
    constructor() {
        this.isInitialized = false;
        this.animationObserver = null;
        this.statsAnimated = false;
        
        this.init();
    }

    /**
     * Initialize hero section
     */
    init() {
        if (this.isInitialized) return;
        
        try {
            this.setupEventListeners();
            this.setupIntersectionObserver();
            this.initializeAnimations();
            this.setupScrollIndicator();
            
            this.isInitialized = true;
            console.log('Hero section initialized successfully');
        } catch (error) {
            console.error('Error initializing hero section:', error);
        }
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Button click handlers
        const viewProjectsBtn = document.getElementById('viewProjectsBtn');
        const contactBtn = document.getElementById('contactBtn');
        
        if (viewProjectsBtn) {
            viewProjectsBtn.addEventListener('click', this.handleViewProjectsClick.bind(this));
        }
        
        if (contactBtn) {
            contactBtn.addEventListener('click', this.handleContactClick.bind(this));
        }

        // Scroll indicator click
        const scrollIndicator = document.querySelector('.hero-scroll-indicator');
        if (scrollIndicator) {
            scrollIndicator.addEventListener('click', this.handleScrollClick.bind(this));
        }

        // Resize handler for responsive adjustments
        window.addEventListener('resize', this.handleResize.bind(this));
        
        // Mouse move for parallax effect
        document.addEventListener('mousemove', this.handleMouseMove.bind(this));
    }

    /**
     * Setup intersection observer for animations
     */
    setupIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        this.animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.statsAnimated) {
                    this.animateStats();
                    this.statsAnimated = true;
                }
            });
        }, options);

        const heroSection = document.getElementById('hero');
        if (heroSection) {
            this.animationObserver.observe(heroSection);
        }
    }

    /**
     * Initialize entrance animations
     */
    initializeAnimations() {
        // Add staggered animation delays to elements
        const textElements = document.querySelectorAll('.hero-text > *');
        textElements.forEach((element, index) => {
            element.style.animationDelay = `${index * 0.2}s`;
        });

        // Add typing effect to hero name
        this.addTypingEffect();
    }

    /**
     * Add typing effect to hero name
     */
    addTypingEffect() {
        const heroName = document.querySelector('.hero-name');
        if (!heroName) return;

        const originalText = heroName.textContent;
        heroName.textContent = '';
        heroName.style.borderRight = '3px solid #ffd700';
        
        let index = 0;
        const typeSpeed = 100;
        
        const typeWriter = () => {
            if (index < originalText.length) {
                heroName.textContent += originalText.charAt(index);
                index++;
                setTimeout(typeWriter, typeSpeed);
            } else {
                // Remove cursor after typing is complete
                setTimeout(() => {
                    heroName.style.borderRight = 'none';
                }, 1000);
            }
        };

        // Start typing after initial delay
        setTimeout(typeWriter, 1000);
    }

    /**
     * Animate statistics counters
     */
    animateStats() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // 60fps
            let current = 0;
            
            const updateStat = () => {
                current += increment;
                if (current < target) {
                    stat.textContent = Math.floor(current);
                    requestAnimationFrame(updateStat);
                } else {
                    stat.textContent = target;
                }
            };
            
            // Add staggered delay for each stat
            const delay = Array.from(statNumbers).indexOf(stat) * 200;
            setTimeout(updateStat, delay);
        });
    }

    /**
     * Setup scroll indicator functionality
     */
    setupScrollIndicator() {
        const scrollIndicator = document.querySelector('.hero-scroll-indicator');
        if (!scrollIndicator) return;

        // Hide scroll indicator when user scrolls
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                scrollIndicator.style.opacity = '0';
            } else {
                scrollIndicator.style.opacity = '1';
            }
            
            // Clear existing timeout
            clearTimeout(scrollTimeout);
            
            // Set new timeout to show indicator again
            scrollTimeout = setTimeout(() => {
                if (window.scrollY <= 100) {
                    scrollIndicator.style.opacity = '1';
                }
            }, 3000);
        });
    }

    /**
     * Handle view projects button click
     */
    handleViewProjectsClick(e) {
        e.preventDefault();
        
        // Add button click animation
        this.addButtonClickEffect(e.target);
        
        // Smooth scroll to projects section
        const projectsSection = document.getElementById('projects') || 
                              document.querySelector('.projects-section');
        
        if (projectsSection) {
            projectsSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        } else {
            // Navigate to projects page if section doesn't exist
            window.location.href = 'projects.html';
        }
    }

    /**
     * Handle contact button click
     */
    handleContactClick(e) {
        e.preventDefault();
        
        // Add button click animation
        this.addButtonClickEffect(e.target);
        
        // Smooth scroll to contact section
        const contactSection = document.getElementById('contact') || 
                              document.querySelector('.contact-section');
        
        if (contactSection) {
            contactSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        } else {
            // Fallback to contact page or show contact modal
            window.location.href = '#contact';
        }
    }

    /**
     * Handle scroll indicator click
     */
    handleScrollClick() {
        const nextSection = document.querySelector('.hero-section').nextElementSibling;
        if (nextSection) {
            nextSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    /**
     * Add button click effect
     */
    addButtonClickEffect(button) {
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = '';
        }, 150);
    }

    /**
     * Handle mouse move for parallax effect
     */
    handleMouseMove(e) {
        const heroImage = document.querySelector('.hero-image');
        const particles = document.querySelector('.hero-particles');
        
        if (!heroImage || !particles) return;

        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        // Subtle parallax movement
        const moveX = (mouseX - 0.5) * 20;
        const moveY = (mouseY - 0.5) * 20;
        
        heroImage.style.transform = `translate(${moveX}px, ${moveY}px)`;
        particles.style.transform = `translate(${moveX * 0.5}px, ${moveY * 0.5}px)`;
    }

    /**
     * Handle window resize
     */
    handleResize() {
        // Reset any transforms on mobile
        if (window.innerWidth <= 768) {
            const heroImage = document.querySelector('.hero-image');
            const particles = document.querySelector('.hero-particles');
            
            if (heroImage) heroImage.style.transform = '';
            if (particles) particles.style.transform = '';
        }
    }

    /**
     * Update hero content dynamically
     */
    updateContent(content) {
        if (content.name) {
            const heroName = document.querySelector('.hero-name');
            if (heroName) heroName.textContent = content.name;
        }
        
        if (content.role) {
            const heroRole = document.querySelector('.hero-role');
            if (heroRole) heroRole.textContent = content.role;
        }
        
        if (content.description) {
            const heroDesc = document.querySelector('.hero-description');
            if (heroDesc) heroDesc.textContent = content.description;
        }
        
        if (content.stats) {
            content.stats.forEach((stat, index) => {
                const statElements = document.querySelectorAll('.stat-number');
                if (statElements[index]) {
                    statElements[index].setAttribute('data-target', stat.value);
                }
                
                const statLabels = document.querySelectorAll('.stat-label');
                if (statLabels[index]) {
                    statLabels[index].textContent = stat.label;
                }
            });
        }
    }

    /**
     * Cleanup function
     */
    destroy() {
        if (this.animationObserver) {
            this.animationObserver.disconnect();
        }
        
        // Remove event listeners
        window.removeEventListener('resize', this.handleResize.bind(this));
        document.removeEventListener('mousemove', this.handleMouseMove.bind(this));
        
        this.isInitialized = false;
    }
}

// Initialize hero section when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.heroSection = new HeroSection();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HeroSection;
}