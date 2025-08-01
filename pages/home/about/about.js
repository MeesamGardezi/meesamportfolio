 
/**
 * About Section JavaScript
 * Handles animations, skill bars, timeline interactions
 */

class AboutSection {
    constructor() {
        this.isInitialized = false;
        this.animationObserver = null;
        this.skillsAnimated = false;
        this.timelineAnimated = false;
        
        this.init();
    }

    /**
     * Initialize about section
     */
    init() {
        if (this.isInitialized) return;
        
        try {
            this.setupEventListeners();
            this.setupIntersectionObserver();
            this.initializeAnimations();
            
            this.isInitialized = true;
            console.log('About section initialized successfully');
        } catch (error) {
            console.error('Error initializing about section:', error);
        }
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // CTA button click handler
        const ctaBtn = document.querySelector('.about-cta-btn');
        if (ctaBtn) {
            ctaBtn.addEventListener('click', this.handleCtaClick.bind(this));
        }

        // Highlight items hover effects
        const highlightItems = document.querySelectorAll('.highlight-item');
        highlightItems.forEach(item => {
            item.addEventListener('mouseenter', this.handleHighlightHover.bind(this));
            item.addEventListener('mouseleave', this.handleHighlightLeave.bind(this));
        });

        // Timeline items click for mobile
        const timelineItems = document.querySelectorAll('.timeline-item');
        timelineItems.forEach((item, index) => {
            item.addEventListener('click', () => this.handleTimelineClick(item, index));
        });

        // Skill items click for details
        const skillItems = document.querySelectorAll('.skill-item');
        skillItems.forEach((item, index) => {
            item.addEventListener('click', () => this.handleSkillClick(item, index));
        });
    }

    /**
     * Setup intersection observer for scroll-triggered animations
     */
    setupIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '-50px',
            threshold: 0.1
        };

        this.animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    
                    if (target.classList.contains('skills-container') && !this.skillsAnimated) {
                        this.animateSkillBars();
                        this.skillsAnimated = true;
                    }
                    
                    if (target.classList.contains('experience-timeline') && !this.timelineAnimated) {
                        this.animateTimeline();
                        this.timelineAnimated = true;
                    }
                    
                    // Add fade-in animation to elements
                    target.classList.add('animate-in');
                }
            });
        }, options);

        // Observe skill and timeline containers
        const skillsContainer = document.querySelector('.skills-container');
        const timelineContainer = document.querySelector('.experience-timeline');
        const highlightItems = document.querySelectorAll('.highlight-item');
        
        if (skillsContainer) this.animationObserver.observe(skillsContainer);
        if (timelineContainer) this.animationObserver.observe(timelineContainer);
        
        highlightItems.forEach(item => {
            this.animationObserver.observe(item);
        });
    }

    /**
     * Initialize entrance animations
     */
    initializeAnimations() {
        // Add staggered delays to highlight items
        const highlightItems = document.querySelectorAll('.highlight-item');
        highlightItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.2}s`;
        });

        // Add staggered delays to timeline items
        const timelineItems = document.querySelectorAll('.timeline-item');
        timelineItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.3}s`;
        });
    }

    /**
     * Animate skill progress bars
     */
    animateSkillBars() {
        const skillItems = document.querySelectorAll('.skill-item');
        
        skillItems.forEach((item, index) => {
            const progressBar = item.querySelector('.skill-progress');
            const level = parseInt(item.getAttribute('data-level'));
            
            setTimeout(() => {
                progressBar.style.width = `${level}%`;
                
                // Add pulse effect when animation completes
                setTimeout(() => {
                    progressBar.style.boxShadow = '0 0 10px rgba(102, 126, 234, 0.5)';
                    setTimeout(() => {
                        progressBar.style.boxShadow = 'none';
                    }, 500);
                }, 1500);
                
            }, index * 200);
        });
    }

    /**
     * Animate timeline items
     */
    animateTimeline() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        
        timelineItems.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('animate-timeline');
                
                // Add a subtle highlight effect
                const content = item.querySelector('.timeline-content');
                content.style.transform = 'scale(1.02)';
                
                setTimeout(() => {
                    content.style.transform = 'scale(1)';
                }, 300);
                
            }, index * 400);
        });
    }

    /**
     * Handle CTA button click
     */
    handleCtaClick(e) {
        e.preventDefault();
        
        // Add click animation
        const button = e.currentTarget;
        button.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            button.style.transform = '';
        }, 150);
        
        // Smooth scroll to contact section
        const contactSection = document.getElementById('contact') || 
                              document.querySelector('.contact-section');
        
        if (contactSection) {
            contactSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        } else {
            // Fallback navigation
            window.location.href = '#contact';
        }
    }

    /**
     * Handle highlight item hover
     */
    handleHighlightHover(e) {
        const icon = e.currentTarget.querySelector('.highlight-icon');
        if (icon) {
            icon.style.transform = 'scale(1.1) rotate(5deg)';
        }
    }

    /**
     * Handle highlight item leave
     */
    handleHighlightLeave(e) {
        const icon = e.currentTarget.querySelector('.highlight-icon');
        if (icon) {
            icon.style.transform = 'scale(1) rotate(0deg)';
        }
    }

    /**
     * Handle timeline item click (mobile interaction)
     */
    handleTimelineClick(item, index) {
        // Only add interaction on mobile
        if (window.innerWidth <= 768) {
            const content = item.querySelector('.timeline-content');
            
            // Toggle expanded state
            const isExpanded = item.classList.contains('expanded');
            
            // Remove expanded class from all items
            document.querySelectorAll('.timeline-item').forEach(el => {
                el.classList.remove('expanded');
            });
            
            if (!isExpanded) {
                item.classList.add('expanded');
                content.style.background = '#667eea';
                content.style.color = 'white';
                
                // Reset after 3 seconds
                setTimeout(() => {
                    item.classList.remove('expanded');
                    content.style.background = '';
                    content.style.color = '';
                }, 3000);
            }
        }
    }

    /**
     * Handle skill item click
     */
    handleSkillClick(item, index) {
        const skillName = item.querySelector('.skill-name').textContent;
        const skillLevel = item.getAttribute('data-level');
        
        // Create and show skill details tooltip
        this.showSkillTooltip(item, skillName, skillLevel);
    }

    /**
     * Show skill details tooltip
     */
    showSkillTooltip(item, skillName, level) {
        // Remove existing tooltips
        document.querySelectorAll('.skill-tooltip').forEach(el => el.remove());
        
        const tooltip = document.createElement('div');
        tooltip.className = 'skill-tooltip';
        tooltip.innerHTML = `
            <div class="tooltip-content">
                <h4>${skillName}</h4>
                <p>Proficiency: ${level}%</p>
                <div class="tooltip-bar">
                    <div class="tooltip-progress" style="width: ${level}%"></div>
                </div>
            </div>
        `;
        
        // Position tooltip
        const rect = item.getBoundingClientRect();
        tooltip.style.position = 'fixed';
        tooltip.style.top = `${rect.top - 80}px`;
        tooltip.style.left = `${rect.left + rect.width / 2}px`;
        tooltip.style.transform = 'translateX(-50%)';
        tooltip.style.zIndex = '1000';
        tooltip.style.background = '#1a202c';
        tooltip.style.color = 'white';
        tooltip.style.padding = '1rem';
        tooltip.style.borderRadius = '8px';
        tooltip.style.fontSize = '0.9rem';
        tooltip.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        tooltip.style.opacity = '0';
        tooltip.style.transition = 'opacity 0.3s ease';
        
        document.body.appendChild(tooltip);
        
        // Animate in
        setTimeout(() => {
            tooltip.style.opacity = '1';
        }, 10);
        
        // Remove after 3 seconds
        setTimeout(() => {
            tooltip.style.opacity = '0';
            setTimeout(() => {
                tooltip.remove();
            }, 300);
        }, 3000);
    }

    /**
     * Update about content dynamically
     */
    updateContent(content) {
        if (content.heading) {
            const heading = document.querySelector('.about-heading');
            if (heading) heading.textContent = content.heading;
        }
        
        if (content.descriptions) {
            const descriptions = document.querySelectorAll('.about-description');
            content.descriptions.forEach((desc, index) => {
                if (descriptions[index]) {
                    descriptions[index].textContent = desc;
                }
            });
        }
        
        if (content.skills) {
            this.updateSkills(content.skills);
        }
        
        if (content.timeline) {
            this.updateTimeline(content.timeline);
        }
    }

    /**
     * Update skills dynamically
     */
    updateSkills(skills) {
        const skillItems = document.querySelectorAll('.skill-item');
        
        skills.forEach((skill, index) => {
            if (skillItems[index]) {
                const nameEl = skillItems[index].querySelector('.skill-name');
                const percentageEl = skillItems[index].querySelector('.skill-percentage');
                
                if (nameEl) nameEl.textContent = skill.name;
                if (percentageEl) percentageEl.textContent = `${skill.level}%`;
                
                skillItems[index].setAttribute('data-level', skill.level);
            }
        });
        
        // Re-animate skill bars
        this.skillsAnimated = false;
        this.animateSkillBars();
    }

    /**
     * Update timeline dynamically
     */
    updateTimeline(timelineData) {
        const timelineItems = document.querySelectorAll('.timeline-item');
        
        timelineData.forEach((item, index) => {
            if (timelineItems[index]) {
                const dateEl = timelineItems[index].querySelector('.timeline-date');
                const titleEl = timelineItems[index].querySelector('.timeline-title-item');
                const descEl = timelineItems[index].querySelector('.timeline-description');
                
                if (dateEl) dateEl.textContent = item.date;
                if (titleEl) titleEl.textContent = item.title;
                if (descEl) descEl.textContent = item.description;
            }
        });
    }

    /**
     * Reset animations (useful for dynamic content updates)
     */
    resetAnimations() {
        this.skillsAnimated = false;
        this.timelineAnimated = false;
        
        // Reset skill bars
        const progressBars = document.querySelectorAll('.skill-progress');
        progressBars.forEach(bar => {
            bar.style.width = '0%';
        });
        
        // Reset timeline items
        const timelineItems = document.querySelectorAll('.timeline-item');
        timelineItems.forEach(item => {
            item.classList.remove('animate-timeline');
        });
    }

    /**
     * Cleanup function
     */
    destroy() {
        if (this.animationObserver) {
            this.animationObserver.disconnect();
        }
        
        // Remove any tooltips
        document.querySelectorAll('.skill-tooltip').forEach(el => el.remove());
        
        this.isInitialized = false;
    }
}

// CSS for tooltip styling
const tooltipStyles = `
    .skill-tooltip .tooltip-content h4 {
        margin: 0 0 0.5rem 0;
        font-size: 1rem;
    }
    
    .skill-tooltip .tooltip-content p {
        margin: 0 0 0.5rem 0;
        opacity: 0.8;
    }
    
    .tooltip-bar {
        height: 4px;
        background: rgba(255,255,255,0.2);
        border-radius: 2px;
        overflow: hidden;
    }
    
    .tooltip-progress {
        height: 100%;
        background: #667eea;
        border-radius: 2px;
        transition: width 0.5s ease;
    }
    
    .animate-timeline {
        animation: slideInFromLeft 0.6s ease-out;
    }
    
    @keyframes slideInFromLeft {
        from {
            opacity: 0;
            transform: translateX(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    .animate-in {
        animation: fadeInUp 0.6s ease-out;
    }
`;

// Inject tooltip styles
const styleSheet = document.createElement('style');
styleSheet.textContent = tooltipStyles;
document.head.appendChild(styleSheet);

// Initialize about section when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.aboutSection = new AboutSection();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AboutSection;
}