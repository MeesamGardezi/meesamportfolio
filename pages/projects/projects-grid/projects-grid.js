 
/**
 * Projects Grid Component JavaScript
 * Handles filtering, searching, sorting, and project interactions
 */

class ProjectsGrid {
    constructor() {
        this.isInitialized = false;
        this.allProjects = [];
        this.filteredProjects = [];
        this.currentView = 'grid';
        this.itemsPerPage = 12;
        this.currentPage = 1;
        this.activeFilters = {
            search: '',
            category: 'all',
            technology: 'all',
            sort: 'newest'
        };
        
        // DOM elements
        this.projectsContainer = null;
        this.projectsList = null;
        this.searchInput = null;
        this.categoryFilter = null;
        this.technologyFilter = null;
        this.sortFilter = null;
        this.viewBtns = [];
        this.loadingEl = null;
        this.noResultsEl = null;
        this.previewModal = null;
        
        this.init();
    }

    /**
     * Initialize projects grid
     */
    init() {
        if (this.isInitialized) return;
        
        try {
            this.cacheElements();
            this.loadProjectsData();
            this.setupEventListeners();
            this.renderProjects();
            this.updateStats();
            
            this.isInitialized = true;
            console.log('Projects grid initialized successfully');
        } catch (error) {
            console.error('Error initializing projects grid:', error);
        }
    }

    /**
     * Cache DOM elements
     */
    cacheElements() {
        this.projectsContainer = document.getElementById('projectsGridContainer');
        this.projectsList = document.getElementById('projectsList');
        this.searchInput = document.getElementById('projectSearch');
        this.categoryFilter = document.getElementById('categoryFilter');
        this.technologyFilter = document.getElementById('technologyFilter');
        this.sortFilter = document.getElementById('sortFilter');
        this.viewBtns = document.querySelectorAll('.view-btn');
        this.loadingEl = document.getElementById('projectsLoading');
        this.noResultsEl = document.getElementById('noResults');
        this.previewModal = document.getElementById('projectPreviewModal');
        
        if (!this.projectsContainer) {
            throw new Error('Projects container not found');
        }
    }

    /**
     * Load projects data (mock data - replace with API call)
     */
    loadProjectsData() {
        // Mock project data - replace with actual API call
        this.allProjects = [
            {
                id: 1,
                title: 'E-Commerce Mobile App',
                description: 'A full-featured e-commerce mobile application built with Flutter, featuring user authentication, product catalog, shopping cart, and payment integration.',
                category: 'mobile',
                technologies: ['flutter', 'dart', 'firebase', 'stripe'],
                status: 'completed',
                date: '2024-01-15',
                popularity: 95,
                image: '../../assets/images/projects/project-1.jpg',
                githubUrl: 'https://github.com/project-1',
                demoUrl: 'https://demo.project-1.com',
                featured: true
            },
            {
                id: 2,
                title: 'Task Management Dashboard',
                description: 'A comprehensive task management dashboard with real-time collaboration, analytics, and team productivity insights built with React and Node.js.',
                category: 'web',
                technologies: ['react', 'nodejs', 'mongodb', 'socket.io'],
                status: 'in-progress',
                date: '2023-12-10',
                popularity: 88,
                image: '../../assets/images/projects/project-2.jpg',
                githubUrl: 'https://github.com/project-2',
                demoUrl: 'https://demo.project-2.com',
                featured: false
            },
            // Add more mock projects...
            {
                id: 3,
                title: 'Social Media App UI',
                description: 'Modern social media application UI design with clean aesthetics and smooth animations.',
                category: 'ui-ux',
                technologies: ['flutter', 'dart', 'figma'],
                status: 'completed',
                date: '2023-11-20',
                popularity: 78,
                image: '../../assets/images/projects/project-3.jpg',
                githubUrl: 'https://github.com/project-3',
                demoUrl: null,
                featured: false
            },
            // ... more projects would be added here
        ];
        
        this.filteredProjects = [...this.allProjects];
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Search input
        if (this.searchInput) {
            this.searchInput.addEventListener('input', this.debounce(this.handleSearch.bind(this), 300));
            
            // Search clear button
            const clearBtn = document.getElementById('searchClear');
            if (clearBtn) {
                clearBtn.addEventListener('click', this.clearSearch.bind(this));
            }
        }
        
        // Filter selects
        if (this.categoryFilter) {
            this.categoryFilter.addEventListener('change', this.handleCategoryFilter.bind(this));
        }
        
        if (this.technologyFilter) {
            this.technologyFilter.addEventListener('change', this.handleTechnologyFilter.bind(this));
        }
        
        if (this.sortFilter) {
            this.sortFilter.addEventListener('change', this.handleSortFilter.bind(this));
        }
        
        // View toggle buttons
        this.viewBtns.forEach(btn => {
            btn.addEventListener('click', this.handleViewToggle.bind(this));
        });
        
        // Reset filters button
        const resetBtn = document.getElementById('resetFilters');
        if (resetBtn) {
            resetBtn.addEventListener('click', this.resetAllFilters.bind(this));
        }
        
        // Shuffle button
        const shuffleBtn = document.getElementById('shuffleProjects');
        if (shuffleBtn) {
            shuffleBtn.addEventListener('click', this.shuffleProjects.bind(this));
        }
        
        // Load more button
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', this.loadMoreProjects.bind(this));
        }
        
        // Clear filters from no results
        const clearFiltersBtn = document.getElementById('clearFiltersBtn');
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', this.resetAllFilters.bind(this));
        }
        
        // Modal close
        const modalClose = document.getElementById('modalClose');
        if (modalClose) {
            modalClose.addEventListener('click', this.closePreviewModal.bind(this));
        }
        
        // Close modal on overlay click
        if (this.previewModal) {
            this.previewModal.addEventListener('click', (e) => {
                if (e.target.classList.contains('modal-overlay')) {
                    this.closePreviewModal();
                }
            });
        }
        
        // Keyboard shortcuts
        document.addEventListener('keydown', this.handleKeyPress.bind(this));
    }

    /**
     * Handle search input
     */
    handleSearch(e) {
        this.activeFilters.search = e.target.value.toLowerCase().trim();
        this.updateSearchClearButton();
        this.applyFilters();
        this.trackEvent('project_search', { query: this.activeFilters.search });
    }

    /**
     * Update search clear button visibility
     */
    updateSearchClearButton() {
        const clearBtn = document.getElementById('searchClear');
        if (clearBtn) {
            if (this.activeFilters.search) {
                clearBtn.classList.remove('hidden');
            } else {
                clearBtn.classList.add('hidden');
            }
        }
    }

    /**
     * Clear search
     */
    clearSearch() {
        this.searchInput.value = '';
        this.activeFilters.search = '';
        this.updateSearchClearButton();
        this.applyFilters();
    }

    /**
     * Handle category filter
     */
    handleCategoryFilter(e) {
        this.activeFilters.category = e.target.value;
        this.applyFilters();
        this.trackEvent('project_filter', { type: 'category', value: this.activeFilters.category });
    }

    /**
     * Handle technology filter
     */
    handleTechnologyFilter(e) {
        this.activeFilters.technology = e.target.value;
        this.applyFilters();
        this.trackEvent('project_filter', { type: 'technology', value: this.activeFilters.technology });
    }

    /**
     * Handle sort filter
     */
    handleSortFilter(e) {
        this.activeFilters.sort = e.target.value;
        this.applyFilters();
        this.trackEvent('project_sort', { value: this.activeFilters.sort });
    }

    /**
     * Handle view toggle
     */
    handleViewToggle(e) {
        const view = e.currentTarget.getAttribute('data-view');
        
        if (view === this.currentView) return;
        
        // Update button states
        this.viewBtns.forEach(btn => btn.classList.remove('active'));
        e.currentTarget.classList.add('active');
        
        // Update view
        this.currentView = view;
        this.updateViewLayout();
        
        this.trackEvent('view_toggle', { view: this.currentView });
    }

    /**
     * Update view layout
     */
    updateViewLayout() {
        if (this.currentView === 'list') {
            this.projectsList.classList.add('list-view');
        } else {
            this.projectsList.classList.remove('list-view');
        }
    }

    /**
     * Apply all active filters
     */
    applyFilters() {
        this.showLoading();
        
        // Simulate loading delay for better UX
        setTimeout(() => {
            this.filteredProjects = this.allProjects.filter(project => {
                // Search filter
                if (this.activeFilters.search) {
                    const searchTerm = this.activeFilters.search;
                    const searchableText = [
                        project.title,
                        project.description,
                        ...project.technologies
                    ].join(' ').toLowerCase();
                    
                    if (!searchableText.includes(searchTerm)) {
                        return false;
                    }
                }
                
                // Category filter
                if (this.activeFilters.category !== 'all') {
                    if (project.category !== this.activeFilters.category) {
                        return false;
                    }
                }
                
                // Technology filter
                if (this.activeFilters.technology !== 'all') {
                    if (!project.technologies.includes(this.activeFilters.technology)) {
                        return false;
                    }
                }
                
                return true;
            });
            
            // Apply sorting
            this.sortProjects();
            
            // Reset pagination
            this.currentPage = 1;
            
            // Update UI
            this.renderProjects();
            this.updateActiveFilters();
            this.updateResultsCount();
            this.hideLoading();
            
        }, 300);
    }

    /**
     * Sort projects based on current sort option
     */
    sortProjects() {
        switch (this.activeFilters.sort) {
            case 'newest':
                this.filteredProjects.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case 'oldest':
                this.filteredProjects.sort((a, b) => new Date(a.date) - new Date(b.date));
                break;
            case 'name-asc':
                this.filteredProjects.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'name-desc':
                this.filteredProjects.sort((a, b) => b.title.localeCompare(a.title));
                break;
            case 'popularity':
                this.filteredProjects.sort((a, b) => b.popularity - a.popularity);
                break;
        }
    }

    /**
     * Shuffle projects randomly
     */
    shuffleProjects() {
        this.filteredProjects = this.shuffleArray([...this.filteredProjects]);
        this.renderProjects();
        this.trackEvent('projects_shuffle');
        
        // Show feedback
        this.showToast('Projects shuffled!', 'success');
    }

    /**
     * Shuffle array utility
     */
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    /**
     * Reset all filters
     */
    resetAllFilters() {
        // Reset filter values
        this.activeFilters = {
            search: '',
            category: 'all',
            technology: 'all',
            sort: 'newest'
        };
        
        // Reset form elements
        if (this.searchInput) this.searchInput.value = '';
        if (this.categoryFilter) this.categoryFilter.value = 'all';
        if (this.technologyFilter) this.technologyFilter.value = 'all';
        if (this.sortFilter) this.sortFilter.value = 'newest';
        
        this.updateSearchClearButton();
        this.applyFilters();
        
        this.trackEvent('filters_reset');
        this.showToast('Filters reset', 'info');
    }

    /**
     * Update active filters display
     */
    updateActiveFilters() {
        const activeFiltersEl = document.getElementById('activeFilters');
        const filterTagsEl = document.getElementById('filterTags');
        
        if (!activeFiltersEl || !filterTagsEl) return;
        
        const activeFiltersList = [];
        
        if (this.activeFilters.search) {
            activeFiltersList.push({ type: 'search', value: this.activeFilters.search, label: `Search: "${this.activeFilters.search}"` });
        }
        
        if (this.activeFilters.category !== 'all') {
            activeFiltersList.push({ type: 'category', value: this.activeFilters.category, label: `Category: ${this.activeFilters.category}` });
        }
        
        if (this.activeFilters.technology !== 'all') {
            activeFiltersList.push({ type: 'technology', value: this.activeFilters.technology, label: `Tech: ${this.activeFilters.technology}` });
        }
        
        if (activeFiltersList.length > 0) {
            activeFiltersEl.classList.remove('hidden');
            filterTagsEl.innerHTML = activeFiltersList.map(filter => `
                <span class="filter-tag">
                    ${filter.label}
                    <button class="filter-tag-remove" data-filter-type="${filter.type}" aria-label="Remove ${filter.label} filter">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                </span>
            `).join('');
            
            // Add event listeners to remove buttons
            filterTagsEl.querySelectorAll('.filter-tag-remove').forEach(btn => {
                btn.addEventListener('click', this.removeFilter.bind(this));
            });
        } else {
            activeFiltersEl.classList.add('hidden');
        }
    }

    /**
     * Remove individual filter
     */
    removeFilter(e) {
        const filterType = e.currentTarget.getAttribute('data-filter-type');
        
        switch (filterType) {
            case 'search':
                this.clearSearch();
                break;
            case 'category':
                this.categoryFilter.value = 'all';
                this.activeFilters.category = 'all';
                break;
            case 'technology':
                this.technologyFilter.value = 'all';
                this.activeFilters.technology = 'all';
                break;
        }
        
        this.applyFilters();
    }

    /**
     * Update results count
     */
    updateResultsCount() {
        const resultsCountEl = document.getElementById('resultsCount');
        if (resultsCountEl) {
            const showing = Math.min(this.currentPage * this.itemsPerPage, this.filteredProjects.length);
            resultsCountEl.textContent = `Showing ${showing} of ${this.filteredProjects.length} projects`;
        }
        
        // Update load more button visibility
        const loadMoreContainer = document.getElementById('loadMoreContainer');
        if (loadMoreContainer) {
            if (this.filteredProjects.length > this.currentPage * this.itemsPerPage) {
                loadMoreContainer.classList.remove('hidden');
            } else {
                loadMoreContainer.classList.add('hidden');
            }
        }
    }

    /**
     * Update stats in header
     */
    updateStats() {
        const totalProjectsEl = document.getElementById('totalProjects');
        const totalTechnologiesEl = document.getElementById('totalTechnologies');
        const totalClientsEl = document.getElementById('totalClients');
        
        if (totalProjectsEl) {
            this.animateNumber(totalProjectsEl, this.allProjects.length);
        }
        
        if (totalTechnologiesEl) {
            const uniqueTechs = new Set();
            this.allProjects.forEach(project => {
                project.technologies.forEach(tech => uniqueTechs.add(tech));
            });
            this.animateNumber(totalTechnologiesEl, uniqueTechs.size);
        }
        
        if (totalClientsEl) {
            // Mock client count
            this.animateNumber(totalClientsEl, 18);
        }
    }

    /**
     * Animate number counting
     */
    animateNumber(element, target) {
        const duration = 1500;
        const increment = target / (duration / 16);
        let current = 0;
        
        const updateNumber = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.floor(current);
                requestAnimationFrame(updateNumber);
            } else {
                element.textContent = target;
            }
        };
        
        updateNumber();
    }

    /**
     * Render projects
     */
    renderProjects() {
        if (!this.projectsList) return;
        
        if (this.filteredProjects.length === 0) {
            this.showNoResults();
            return;
        }
        
        this.hideNoResults();
        
        // Get projects for current page
        const startIndex = 0;
        const endIndex = this.currentPage * this.itemsPerPage;
        const projectsToShow = this.filteredProjects.slice(startIndex, endIndex);
        
        // Clear existing projects
        this.projectsList.innerHTML = '';
        
        // Render projects
        projectsToShow.forEach((project, index) => {
            const projectCard = this.createProjectCard(project);
            projectCard.style.animationDelay = `${index * 0.1}s`;
            this.projectsList.appendChild(projectCard);
        });
        
        // Setup card interactions
        this.setupCardInteractions();
        
        // Update view layout
        this.updateViewLayout();
    }

    /**
     * Create project card element
     */
    createProjectCard(project) {
        const card = document.createElement('article');
        card.className = 'project-card';
        card.setAttribute('data-category', project.category);
        card.setAttribute('data-technologies', project.technologies.join(','));
        card.setAttribute('data-date', project.date);
        card.setAttribute('data-popularity', project.popularity);
        card.setAttribute('data-project-id', project.id);
        
        const statusClass = `status-${project.status.replace(' ', '-')}`;
        const formattedDate = new Date(project.date).toLocaleDateString('en-US', { 
            month: 'short', 
            year: 'numeric' 
        });
        
        card.innerHTML = `
            <div class="card-image">
                <img src="${project.image}" alt="${project.title}" loading="lazy">
                <div class="image-overlay">
                    <div class="overlay-content">
                        <button class="preview-btn" aria-label="Quick preview" data-project-id="${project.id}">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                <circle cx="12" cy="12" r="3"/>
                            </svg>
                        </button>
                        <a href="project-detail.html?id=${project.id}" class="view-btn" aria-label="View project details">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M7 17L17 7M17 7H7M17 7V17"/>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
            
            <div class="card-content">
                <div class="card-header">
                    <h3 class="project-title">${project.title}</h3>
                    <div class="project-status ${statusClass}">${project.status.replace('-', ' ')}</div>
                </div>
                
                <p class="project-description">${project.description}</p>
                
                <div class="project-technologies">
                    ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
                
                <div class="card-footer">
                    <div class="project-meta">
                        <span class="meta-item">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/>
                            </svg>
                            ${formattedDate}
                        </span>
                        <span class="meta-item">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M20 6L9 17l-5-5"/>
                            </svg>
                            ${project.category.replace('-', ' ')}
                        </span>
                    </div>
                    
                    <div class="project-links">
                        ${project.githubUrl ? `
                            <a href="${project.githubUrl}" class="project-link github" target="_blank" rel="noopener noreferrer" aria-label="View on GitHub">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                </svg>
                            </a>
                        ` : ''}
                        ${project.demoUrl ? `
                            <a href="${project.demoUrl}" class="project-link demo" target="_blank" rel="noopener noreferrer" aria-label="View live demo">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/>
                                </svg>
                            </a>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
        
        return card;
    }

    /**
     * Setup card interactions
     */
    setupCardInteractions() {
        // Preview buttons
        const previewBtns = document.querySelectorAll('.preview-btn');
        previewBtns.forEach(btn => {
            btn.addEventListener('click', this.handlePreviewClick.bind(this));
        });
        
        // Tech tag clicks
        const techTags = document.querySelectorAll('.tech-tag');
        techTags.forEach(tag => {
            tag.addEventListener('click', this.handleTechTagClick.bind(this));
        });
        
        // Project link tracking
        const projectLinks = document.querySelectorAll('.project-link');
        projectLinks.forEach(link => {
            link.addEventListener('click', this.handleProjectLinkClick.bind(this));
        });
    }

    /**
     * Handle preview button click
     */
    handlePreviewClick(e) {
        e.preventDefault();
        const projectId = parseInt(e.currentTarget.getAttribute('data-project-id'));
        this.showPreviewModal(projectId);
    }

    /**
     * Handle tech tag click (filter by technology)
     */
    handleTechTagClick(e) {
        const tech = e.currentTarget.textContent.toLowerCase();
        this.technologyFilter.value = tech;
        this.activeFilters.technology = tech;
        this.applyFilters();
        
        // Scroll to top of results
        this.projectsContainer.scrollIntoView({ behavior: 'smooth' });
    }

    /**
     * Handle project link clicks (for tracking)
     */
    handleProjectLinkClick(e) {
        const link = e.currentTarget;
        const linkType = link.classList.contains('github') ? 'github' : 'demo';
        const projectCard = link.closest('.project-card');
        const projectId = projectCard.getAttribute('data-project-id');
        
        this.trackEvent('project_link_click', {
            project_id: projectId,
            link_type: linkType,
            url: link.href
        });
    }

    /**
     * Show preview modal
     */
    showPreviewModal(projectId) {
        const project = this.allProjects.find(p => p.id === projectId);
        if (!project) return;
        
        const modalBody = document.getElementById('modalBody');
        if (!modalBody) return;
        
        modalBody.innerHTML = `
            <div class="modal-project-preview">
                <img src="${project.image}" alt="${project.title}" class="preview-image">
                <div class="preview-content">
                    <h2 class="preview-title">${project.title}</h2>
                    <p class="preview-description">${project.description}</p>
                    <div class="preview-technologies">
                        ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                    </div>
                    <div class="preview-actions">
                        ${project.githubUrl ? `<a href="${project.githubUrl}" class="btn btn-outline" target="_blank">View Code</a>` : ''}
                        ${project.demoUrl ? `<a href="${project.demoUrl}" class="btn btn-primary" target="_blank">Live Demo</a>` : ''}
                        <a href="project-detail.html?id=${project.id}" class="btn btn-primary">Full Details</a>
                    </div>
                </div>
            </div>
        `;
        
        this.previewModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        this.trackEvent('project_preview', { project_id: projectId });
    }

    /**
     * Close preview modal
     */
    closePreviewModal() {
        this.previewModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    /**
     * Load more projects
     */
    loadMoreProjects() {
        this.currentPage++;
        this.renderProjects();
        this.updateResultsCount();
        
        this.trackEvent('load_more_projects', { page: this.currentPage });
    }

    /**
     * Show loading state
     */
    showLoading() {
        if (this.loadingEl) {
            this.loadingEl.classList.remove('hidden');
        }
        if (this.projectsList) {
            this.projectsList.classList.add('loading');
        }
    }

    /**
     * Hide loading state
     */
    hideLoading() {
        if (this.loadingEl) {
            this.loadingEl.classList.add('hidden');
        }
        if (this.projectsList) {
            this.projectsList.classList.remove('loading');
        }
    }

    /**
     * Show no results message
     */
    showNoResults() {
        if (this.noResultsEl) {
            this.noResultsEl.classList.remove('hidden');
        }
        if (this.projectsList) {
            this.projectsList.style.display = 'none';
        }
    }

    /**
     * Hide no results message
     */
    hideNoResults() {
        if (this.noResultsEl) {
            this.noResultsEl.classList.add('hidden');
        }
        if (this.projectsList) {
            this.projectsList.style.display = 'grid';
        }
    }

    /**
     * Handle keyboard shortcuts
     */
    handleKeyPress(e) {
        // Escape key - close modal
        if (e.key === 'Escape' && this.previewModal.classList.contains('active')) {
            this.closePreviewModal();
        }
        
        // Ctrl/Cmd + K - focus search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            this.searchInput?.focus();
        }
    }

    /**
     * Show toast notification
     */
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `projects-toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <span class="toast-icon">${type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ'}</span>
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
            transition: 'transform 0.3s ease'
        });
        
        document.body.appendChild(toast);
        
        // Animate in
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 10);
        
        // Remove after 3 seconds
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    /**
     * Debounce utility function
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
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
        
        console.log(`Projects grid event: ${eventName}`, properties);
    }

    /**
     * Get current state
     */
    getState() {
        return {
            totalProjects: this.allProjects.length,
            filteredProjects: this.filteredProjects.length,
            currentView: this.currentView,
            currentPage: this.currentPage,
            activeFilters: { ...this.activeFilters }
        };
    }

    /**
     * Update projects data (for dynamic loading)
     */
    updateProjectsData(newProjects) {
        this.allProjects = newProjects;
        this.applyFilters();
        this.updateStats();
    }

    /**
     * Cleanup and destroy
     */
    destroy() {
        // Remove event listeners
        document.removeEventListener('keydown', this.handleKeyPress.bind(this));
        
        // Close modal if open
        if (this.previewModal.classList.contains('active')) {
            this.closePreviewModal();
        }
        
        // Remove toasts
        document.querySelectorAll('.projects-toast').forEach(toast => toast.remove());
        
        this.isInitialized = false;
    }
}

// Initialize projects grid when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.projectsGrid = new ProjectsGrid();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProjectsGrid;
}