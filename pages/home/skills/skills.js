 /**
 * Skills Section JavaScript
 * Handles tab navigation, progress bars, and interactions
 */

class SkillsSection {
    constructor() {
        this.isInitialized = false;
        this.animationObserver = null;
        this.progressAnimated = false;
        this.statsAnimated = false;
        this.currentActiveTab = 'mobile';
        this.animationTimeouts = [];
        
        this.init();
    }

    /**
     * Initialize skills section
     */
    init() {
        if (this.isInitialized) return;
        
        try {
            this.setupEventListeners();
            this.setupIntersectionObserver();
            this.initializeTabNavigation();
            
            this.isInitialized = true;
            console.log('Skills section initialized successfully');
        } catch (error) {
            console.error('Error initializing skills section:', error);
        }
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Tab navigation buttons
        const navButtons = document.querySelectorAll('.skill-nav-btn');
        navButtons.forEach(button => {
            button.addEventListener('click', this.handleTabClick.bind(this));
        });

        // Skill cards interactions
        const skillCards = document.querySelectorAll('.skill-card');
        skillCards.forEach(card => {
            card.addEventListener('mouseenter', this.handleSkillCardHover.bind(this));
            card.addEventListener('mouseleave', this.handleSkillCardLeave.bind(this));
            card.addEventListener('click', this.handleSkillCardClick.bind(this));
        });

        // CTA button
        const ctaBtn = document.querySelector('.skills-cta-btn');
        if (ctaBtn) {
            ctaBtn.addEventListener('click', this.handleCtaClick.bind(this));
        }

        // Keyboard navigation
        document.addEventListener('keydown', this.handleKeyNavigation.bind(this));
    }

    /**
     * Setup intersection observer for scroll-triggered animations
     */
    setupIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '-100px',
            threshold: 0.2
        };

        this.animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    
                    if (target.classList.contains('skills-panel') && target.classList.contains('active') && !this.progressAnimated) {
                        this.animateProgressBars(target);
                        this.progressAnimated = true;
                    }
                    
                    if (target.classList.contains('summary-stats') && !this.statsAnimated) {
                        this.animateStats();
                        this.statsAnimated = true;
                    }
                }
            });
        }, options);

        // Observe active panel and stats
        const activePanel = document.querySelector('.skills-panel.active');
        const statsSection = document.querySelector('.summary-stats');
        
        if (activePanel) this.animationObserver.observe(activePanel);
        if (statsSection) this.animationObserver.observe(statsSection);
    }

    /**
     * Initialize tab navigation
     */
    initializeTabNavigation() {
        // Set initial active states
        const firstTab = document.querySelector('.skill-nav-btn[data-category="mobile"]');
        const firstPanel = document.querySelector('.skills-panel[data-panel="mobile"]');
        
        if (firstTab && firstPanel) {
            firstTab.classList.add('active');
            firstPanel.classList.add('active');
        }
    }

    /**
     * Handle tab click navigation
     */
    handleTabClick(e) {
        const button = e.currentTarget;
        const category = button.getAttribute('data-category');
        
        if (category === this.currentActiveTab) return;
        
        // Add click animation
        this.addButtonClickEffect(button);
        
        // Switch tabs
        this.switchTab(category);
        
        // Track analytics
        this.trackTabSwitch(category);
    }

    /**
     * Switch between skill tabs
     */
    switchTab(category) {
        // Remove active states
        document.querySelectorAll('.skill-nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        document.querySelectorAll('.skills-panel').forEach(panel => {
            panel.classList.remove('active');
        });
        
        // Add active states
        const activeButton = document.querySelector(`.skill-nav-btn[data-category="${category}"]`);
        const activePanel = document.querySelector(`.skills-panel[data-panel="${category}"]`);
        
        if (activeButton && activePanel) {
            activeButton.classList.add('active');
            
            // Delay panel activation for smooth transition
            setTimeout(() => {
                activePanel.classList.add('active');
                
                // Re-observe the new active panel for animations
                if (this.animationObserver) {
                    this.animationObserver.observe(activePanel);
                }
                
                // Reset progress animation flag for new panel
                this.progressAnimated = false;
                
                // Animate progress bars if in viewport
                setTimeout(() => {
                    if (this.isElementInViewport(activePanel)) {
                        this.animateProgressBars(activePanel);
                        this.progressAnimated = true;
                    }
                }, 300);
                
            }, 100);
        }
        
        this.currentActiveTab = category;
    }

    /**
     * Animate progress bars in a panel
     */
    animateProgressBars(panel) {
        const progressBars = panel.querySelectorAll('.level-progress');
        
        progressBars.forEach((bar, index) => {
            const level = parseInt(bar.getAttribute('data-level'));
            
            // Clear any existing timeout
            if (this.animationTimeouts[index]) {
                clearTimeout(this.animationTimeouts[index]);
            }
            
            // Animate with staggered delay
            this.animationTimeouts[index] = setTimeout(() => {
                bar.style.width = `${level}%`;
                
                // Add pulse effect when animation completes
                setTimeout(() => {
                    bar.style.boxShadow = '0 0 15px rgba(102, 126, 234, 0.6)';
                    setTimeout(() => {
                        bar.style.boxShadow = 'none';
                    }, 600);
                }, 1500);
                
            }, index * 150);
        });
    }

    /**
     * Animate statistics counters
     */
    animateStats() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        statNumbers.forEach((stat, index) => {
            const target = parseInt(stat.getAttribute('data-target'));
            const duration = 2500;
            const increment = target / (duration / 16);
            let current = 0;
            
            const updateStat = () => {
                current += increment;
                if (current < target) {
                    stat.textContent = Math.floor(current);
                    requestAnimationFrame(updateStat);
                } else {
                    stat.textContent = target;
                    
                    // Add completion effect
                    stat.style.transform = 'scale(1.1)';
                    setTimeout(() => {
                        stat.style.transform = 'scale(1)';
                    }, 200);
                }
            };
            
            // Staggered animation start
            setTimeout(() => {
                updateStat();
            }, index * 200);
        });
    }

    /**
     * Handle skill card hover
     */
    handleSkillCardHover(e) {
        const card = e.currentTarget;
        const skillName = card.querySelector('.skill-name').textContent;
        
        // Add hover effect to icon
        const icon = card.querySelector('.skill-icon');
        if (icon) {
            icon.style.transform = 'scale(1.1) rotate(5deg)';
        }
        
        // Show skill tooltip (optional)
        this.showSkillTooltip(card, skillName);
    }

    /**
     * Handle skill card leave
     */
    handleSkillCardLeave(e) {
        const card = e.currentTarget;
        const icon = card.querySelector('.skill-icon');
        
        if (icon) {
            icon.style.transform = '';
        }
        
        // Hide tooltip
        this.hideSkillTooltip();
    }

    /**
     * Handle skill card click
     */
    handleSkillCardClick(e) {
        const card = e.currentTarget;
        const skillName = card.querySelector('.skill-name').textContent;
        const skillLevel = card.querySelector('.level-progress').getAttribute('data-level');
        
        // Add click animation
        card.style.transform = 'scale(0.98)';
        setTimeout(() => {
            card.style.transform = '';
        }, 150);
        
        // Show detailed skill info
        this.showSkillDetails(skillName, skillLevel, card);
        
        // Track click
        this.trackSkillClick(skillName);
    }

    /**
     * Show skill tooltip
     */
    showSkillTooltip(card, skillName) {
        // Remove existing tooltips
        document.querySelectorAll('.skill-tooltip').forEach(el => el.remove());
        
        const tooltip = document.createElement('div');
        tooltip.className = 'skill-tooltip';
        tooltip.innerHTML = `
            <div class="tooltip-content">
                <strong>${skillName}</strong>
                <p>Click for more details</p>
            </div>
        `;
        
        // Position tooltip
        const rect = card.getBoundingClientRect();
        tooltip.style.position = 'fixed';
        tooltip.style.top = `${rect.top - 60}px`;
        tooltip.style.left = `${rect.left + rect.width / 2}px`;
        tooltip.style.transform = 'translateX(-50%)';
        tooltip.style.zIndex = '1000';
        tooltip.style.background = '#1a202c';
        tooltip.style.color = 'white';
        tooltip.style.padding = '0.75rem 1rem';
        tooltip.style.borderRadius = '8px';
        tooltip.style.fontSize = '0.85rem';
        tooltip.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        tooltip.style.opacity = '0';
        tooltip.style.transition = 'opacity 0.3s ease';
        tooltip.style.whiteSpace = 'nowrap';
        
        document.body.appendChild(tooltip);
        
        // Animate in
        setTimeout(() => {
            tooltip.style.opacity = '1';
        }, 10);
    }

    /**
     * Hide skill tooltip
     */
    hideSkillTooltip() {
        const tooltips = document.querySelectorAll('.skill-tooltip');
        tooltips.forEach(tooltip => {
            tooltip.style.opacity = '0';
            setTimeout(() => {
                tooltip.remove();
            }, 300);
        });
    }

    /**
     * Show detailed skill information
     */
    showSkillDetails(skillName, level, card) {
        // Create detailed modal/popup
        const modal = document.createElement('div');
        modal.className = 'skill-detail-modal';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${skillName}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="skill-level-detail">
                        <span>Proficiency Level: ${level}%</span>
                        <div class="detail-progress-bar">
                            <div class="detail-progress" style="width: ${level}%"></div>
                        </div>
                    </div>
                    <div class="skill-projects">
                        <h4>Projects using ${skillName}:</h4>
                        <ul>
                            <li>Project Alpha - E-commerce Mobile App</li>
                            <li>Project Beta - Social Media Platform</li>
                            <li>Project Gamma - Real-time Chat Application</li>
                        </ul>
                    </div>
                    <div class="skill-certifications">
                        <h4>Related Certifications:</h4>
                        <p>Google Developer Certification, Advanced ${skillName} Course</p>
                    </div>
                </div>
            </div>
        `;
        
        // Style the modal
        this.styleSkillModal(modal);
        
        document.body.appendChild(modal);
        
        // Add event listeners
        const closeBtn = modal.querySelector('.modal-close');
        const overlay = modal.querySelector('.modal-overlay');
        
        closeBtn.addEventListener('click', () => this.closeSkillModal(modal));
        overlay.addEventListener('click', () => this.closeSkillModal(modal));
        
        // Animate in
        setTimeout(() => {
            modal.style.opacity = '1';
            modal.querySelector('.modal-content').style.transform = 'scale(1)';
        }, 10);
    }

    /**
     * Style skill detail modal
     */
    styleSkillModal(modal) {
        Object.assign(modal.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            zIndex: '10000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: '0',
            transition: 'opacity 0.3s ease'
        });
        
        const overlay = modal.querySelector('.modal-overlay');
        Object.assign(overlay.style, {
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(5px)'
        });
        
        const content = modal.querySelector('.modal-content');
        Object.assign(content.style, {
            background: 'white',
            borderRadius: '16px',
            padding: '2rem',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto',
            position: 'relative',
            transform: 'scale(0.9)',
            transition: 'transform 0.3s ease'
        });
        
        // Style other elements
        const closeBtn = modal.querySelector('.modal-close');
        Object.assign(closeBtn.style, {
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            color: '#64748b'
        });
    }

    /**
     * Close skill detail modal
     */
    closeSkillModal(modal) {
        modal.style.opacity = '0';
        modal.querySelector('.modal-content').style.transform = 'scale(0.9)';
        
        setTimeout(() => {
            modal.remove();
        }, 300);
    }

    /**
     * Handle CTA button click
     */
    handleCtaClick(e) {
        e.preventDefault();
        
        // Add click animation
        const button = e.currentTarget;
        this.addButtonClickEffect(button);
        
        // Smooth scroll to contact
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            contactSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    /**
     * Handle keyboard navigation
     */
    handleKeyNavigation(e) {
        if (e.target.closest('.skills-section')) {
            const tabs = ['mobile', 'frontend', 'backend', 'tools'];
            const currentIndex = tabs.indexOf(this.currentActiveTab);
            
            if (e.key === 'ArrowLeft' && currentIndex > 0) {
                this.switchTab(tabs[currentIndex - 1]);
            } else if (e.key === 'ArrowRight' && currentIndex < tabs.length - 1) {
                this.switchTab(tabs[currentIndex + 1]);
            }
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
     * Check if element is in viewport
     */
    isElementInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    /**
     * Track tab switch for analytics
     */
    trackTabSwitch(category) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'skills_tab_switch', {
                category: category,
                previous_tab: this.currentActiveTab
            });
        }
        
        console.log(`Skills tab switched to: ${category}`);
    }

    /**
     * Track skill click for analytics
     */
    trackSkillClick(skillName) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'skill_click', {
                skill_name: skillName,
                category: this.currentActiveTab
            });
        }
        
        console.log(`Skill clicked: ${skillName}`);
    }

    /**
     * Update skills data dynamically
     */
    updateSkillsData(skillsData) {
        Object.keys(skillsData).forEach(category => {
            const panel = document.querySelector(`.skills-panel[data-panel="${category}"]`);
            if (panel && skillsData[category]) {
                this.updatePanelSkills(panel, skillsData[category]);
            }
        });
    }

    /**
     * Update skills in a specific panel
     */
    updatePanelSkills(panel, skills) {
        const skillsGrid = panel.querySelector('.skills-grid');
        if (!skillsGrid) return;
        
        skillsGrid.innerHTML = '';
        
        skills.forEach((skill, index) => {
            const skillCard = this.createSkillCard(skill, index === 0);
            skillsGrid.appendChild(skillCard);
        });
        
        // Re-attach event listeners to new cards
        const newCards = skillsGrid.querySelectorAll('.skill-card');
        newCards.forEach(card => {
            card.addEventListener('mouseenter', this.handleSkillCardHover.bind(this));
            card.addEventListener('mouseleave', this.handleSkillCardLeave.bind(this));
            card.addEventListener('click', this.handleSkillCardClick.bind(this));
        });
    }

    /**
     * Create skill card element
     */
    createSkillCard(skill, featured = false) {
        const card = document.createElement('div');
        card.className = `skill-card ${featured ? 'featured' : ''}`;
        
        card.innerHTML = `
            <div class="skill-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L2 7v10c0 5.55 3.84 10 9 11 5.16-1 9-5.45 9-11V7l-10-5z" fill="${skill.color || '#667eea'}"/>
                </svg>
            </div>
            <div class="skill-info">
                <h4 class="skill-name">${skill.name}</h4>
                <p class="skill-description">${skill.description}</p>
                <div class="skill-level">
                    <span class="level-label">${skill.levelLabel}</span>
                    <div class="level-bar">
                        <div class="level-progress" data-level="${skill.level}"></div>
                    </div>
                    <span class="level-percentage">${skill.level}%</span>
                </div>
                <div class="skill-experience">${skill.experience}</div>
            </div>
        `;
        
        return card;
    }

    /**
     * Reset all animations
     */
    resetAnimations() {
        this.progressAnimated = false;
        this.statsAnimated = false;
        
        // Clear timeouts
        this.animationTimeouts.forEach(timeout => clearTimeout(timeout));
        this.animationTimeouts = [];
        
        // Reset progress bars
        document.querySelectorAll('.level-progress').forEach(bar => {
            bar.style.width = '0%';
        });
        
        // Reset stats
        document.querySelectorAll('.stat-number').forEach(stat => {
            stat.textContent = '0';
        });
    }

    /**
     * Cleanup function
     */
    destroy() {
        if (this.animationObserver) {
            this.animationObserver.disconnect();
        }
        
        // Clear timeouts
        this.animationTimeouts.forEach(timeout => clearTimeout(timeout));
        
        // Remove event listeners
        document.removeEventListener('keydown', this.handleKeyNavigation.bind(this));
        
        // Remove tooltips and modals
        document.querySelectorAll('.skill-tooltip, .skill-detail-modal').forEach(el => el.remove());
        
        this.isInitialized = false;
    }
}

// Initialize skills section when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.skillsSection = new SkillsSection();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SkillsSection;
}