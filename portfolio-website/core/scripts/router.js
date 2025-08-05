/**
 * ROUTER.JS - Client-Side Router with pushState
 * Portfolio Website - SPA routing without hash fragments
 * Features: pushState routing, route guards, transitions, lazy loading
 */

class Router {
  constructor() {
    this.routes = new Map();
    this.currentRoute = null;
    this.previousRoute = null;
    this.isInitialized = false;
    this.guards = [];
    this.hooks = {
      beforeEach: [],
      afterEach: [],
      beforeRouteEnter: [],
      beforeRouteLeave: []
    };
    
    // Router configuration
    this.config = {
      mode: 'history', // pushState mode
      base: '',
      linkActiveClass: 'router-link-active',
      linkExactActiveClass: 'router-link-exact-active',
      scrollBehavior: 'smooth',
      transitionDelay: 300
    };

    // Initialize
    this.init();
  }

  /**
   * Initialize router
   */
  init() {
    if (this.isInitialized) return;

    console.log('Initializing Router...');
    
    // Set up event listeners
    this.setupEventListeners();
    
    // Register default routes
    this.registerDefaultRoutes();
    
    // Handle initial navigation
    this.handleInitialNavigation();
    
    this.isInitialized = true;
    console.log('✅ Router initialized');
  }

  /**
   * Set up event listeners
   */
  setupEventListeners() {
    // Handle back/forward navigation
    window.addEventListener('popstate', (event) => {
      this.handlePopState(event);
    });

    // Handle link clicks
    document.addEventListener('click', (event) => {
      this.handleLinkClick(event);
    });

    // Handle form submissions for navigation
    document.addEventListener('submit', (event) => {
      this.handleFormSubmit(event);
    });
  }

  /**
   * Register a route
   */
  route(path, config) {
    if (typeof config === 'function') {
      config = { component: config };
    }

    const routeConfig = {
      path: this.normalizePath(path),
      component: config.component,
      name: config.name || this.generateRouteName(path),
      meta: config.meta || {},
      beforeEnter: config.beforeEnter,
      children: config.children || [],
      props: config.props || false,
      ...config
    };

    // Parse route parameters
    routeConfig.paramNames = this.extractParamNames(path);
    routeConfig.regex = this.pathToRegex(path);

    this.routes.set(routeConfig.name, routeConfig);
    
    console.log(`Route registered: ${path} -> ${routeConfig.name}`);
    return this;
  }

  /**
   * Navigate to a route
   */
  async push(to, replace = false) {
    try {
      const route = this.resolveRoute(to);
      
      if (!route) {
        console.error('Route not found:', to);
        this.push('/404', true);
        return;
      }

      // Run navigation guards
      const canNavigate = await this.runGuards(route, this.currentRoute);
      if (!canNavigate) {
        return; // Navigation cancelled
      }

      // Update browser history
      this.updateHistory(route, replace);
      
      // Perform navigation
      await this.navigateToRoute(route);
      
    } catch (error) {
      console.error('Navigation error:', error);
      this.handleNavigationError(error);
    }
  }

  /**
   * Replace current route
   */
  replace(to) {
    return this.push(to, true);
  }

  /**
   * Go back in history
   */
  back() {
    window.history.back();
  }

  /**
   * Go forward in history
   */
  forward() {
    window.history.forward();
  }

  /**
   * Go to specific position in history
   */
  go(n) {
    window.history.go(n);
  }

  /**
   * Resolve route from path or route object
   */
  resolveRoute(to) {
    if (typeof to === 'string') {
      return this.matchRoute(to);
    }

    if (to.name) {
      const route = this.routes.get(to.name);
      if (route) {
        return {
          ...route,
          path: this.buildPath(route.path, to.params || {}),
          params: to.params || {},
          query: to.query || {},
          hash: to.hash || ''
        };
      }
    }

    if (to.path) {
      return this.matchRoute(to.path);
    }

    return null;
  }

  /**
   * Match route by path
   */
  matchRoute(path) {
    const normalizedPath = this.normalizePath(path);
    const url = new URL(normalizedPath, window.location.origin);
    const pathname = url.pathname;
    const search = url.search;
    const hash = url.hash;

    for (const [name, route] of this.routes) {
      const match = pathname.match(route.regex);
      
      if (match) {
        const params = {};
        route.paramNames.forEach((paramName, index) => {
          params[paramName] = match[index + 1];
        });

        return {
          ...route,
          path: pathname,
          params,
          query: this.parseQuery(search),
          hash: hash.slice(1) // remove #
        };
      }
    }

    return null;
  }

  /**
   * Run navigation guards
   */
  async runGuards(to, from) {
    // Run global beforeEach guards
    for (const guard of this.hooks.beforeEach) {
      const result = await this.runGuard(guard, to, from);
      if (result === false) return false;
      if (typeof result === 'string') {
        this.push(result, true);
        return false;
      }
    }

    // Run route-specific beforeEnter guard
    if (to.beforeEnter) {
      const result = await this.runGuard(to.beforeEnter, to, from);
      if (result === false) return false;
      if (typeof result === 'string') {
        this.push(result, true);
        return false;
      }
    }

    // Run component beforeRouteEnter guards
    if (from) {
      for (const guard of this.hooks.beforeRouteLeave) {
        const result = await this.runGuard(guard, to, from);
        if (result === false) return false;
      }
    }

    return true;
  }

  /**
   * Run a single guard
   */
  async runGuard(guard, to, from) {
    try {
      return await guard(to, from, (route) => {
        if (route === false) return false;
        if (typeof route === 'string') return route;
        return true;
      });
    } catch (error) {
      console.error('Guard error:', error);
      return false;
    }
  }

  /**
   * Navigate to route
   */
  async navigateToRoute(route) {
    // Store previous route
    this.previousRoute = this.currentRoute;
    this.currentRoute = route;

    try {
      // Load and render component
      await this.renderRoute(route);
      
      // Update active links
      this.updateActiveLinks();
      
      // Handle scroll behavior
      this.handleScrollBehavior(route);
      
      // Run afterEach hooks
      this.runAfterEachHooks(route, this.previousRoute);
      
      // Track page view
      this.trackPageView(route);

    } catch (error) {
      console.error('Route rendering error:', error);
      throw error;
    }
  }

  /**
   * Render route component
   */
  async renderRoute(route) {
    const appContainer = document.getElementById('app') || document.body;
    
    // Show loading state
    this.showLoadingState(appContainer);
    
    try {
      let html = '';
      
      if (typeof route.component === 'function') {
        // Component function
        html = await route.component(route);
      } else if (typeof route.component === 'string') {
        // Component name - load via ComponentLoader
        html = await window.ComponentLoader.loadComponent(
          route.component, 
          'pages', 
          { route }
        );
      } else if (route.template) {
        // Template string
        html = window.TemplateEngine.render(route.template, { route });
      }
      
      // Process component tags in the rendered HTML
      if (window.ComponentLoader.processComponentTags) {
        html = await window.ComponentLoader.processComponentTags(html);
      }
      
      // Render with transition
      await this.renderWithTransition(appContainer, html);
      
    } catch (error) {
      console.error('Component rendering failed:', error);
      this.renderErrorPage(appContainer, error);
    }
  }

  /**
   * Render with transition effect
   */
  async renderWithTransition(container, html) {
    // Add fade-out class
    container.style.opacity = '0';
    container.style.transition = `opacity ${this.config.transitionDelay}ms ease`;
    
    // Wait for fade-out
    await window.Utils.sleep(this.config.transitionDelay);
    
    // Update content
    container.innerHTML = html;
    
    // Trigger component initialization
    this.initializePageComponents();
    
    // Fade-in
    container.style.opacity = '1';
  }

  /**
   * Initialize page components
   */
  initializePageComponents() {
    // Trigger any component initialization scripts
    const initScripts = document.querySelectorAll('[data-init]');
    initScripts.forEach(script => {
      try {
        const initFunction = window[script.dataset.init];
        if (typeof initFunction === 'function') {
          initFunction();
        }
      } catch (error) {
        console.error('Component initialization error:', error);
      }
    });
  }

  /**
   * Show loading state
   */
  showLoadingState(container) {
    container.innerHTML = `
      <div class="loading-container" style="
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 200px;
        font-family: system-ui, -apple-system, sans-serif;
      ">
        <div class="loading-spinner" style="
          width: 40px;
          height: 40px;
          border: 3px solid #f3f3f3;
          border-top: 3px solid #333;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        "></div>
      </div>
      <style>
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    `;
  }

  /**
   * Render error page
   */
  renderErrorPage(container, error) {
    container.innerHTML = `
      <div class="error-container" style="
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        min-height: 400px;
        padding: 20px;
        font-family: system-ui, -apple-system, sans-serif;
        text-align: center;
      ">
        <h1 style="color: #dc3545; margin-bottom: 20px;">Page Load Error</h1>
        <p style="color: #6c757d; margin-bottom: 20px;">
          Sorry, there was an error loading this page.
        </p>
        <button onclick="window.location.reload()" style="
          padding: 10px 20px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        ">
          Reload Page
        </button>
        ${window.ENV?.NODE_ENV !== 'production' ? `
          <details style="margin-top: 20px; text-align: left;">
            <summary>Error Details</summary>
            <pre style="color: #dc3545; font-size: 12px;">${error.stack}</pre>
          </details>
        ` : ''}
      </div>
    `;
  }

  /**
   * Update active links
   */
  updateActiveLinks() {
    const links = document.querySelectorAll('[data-router-link]');
    
    links.forEach(link => {
      const href = link.getAttribute('href') || link.getAttribute('data-href');
      if (!href) return;
      
      const isActive = this.isActiveLink(href);
      const isExactActive = this.isExactActiveLink(href);
      
      link.classList.toggle(this.config.linkActiveClass, isActive);
      link.classList.toggle(this.config.linkExactActiveClass, isExactActive);
    });
  }

  /**
   * Check if link is active
   */
  isActiveLink(href) {
    if (!this.currentRoute) return false;
    return this.currentRoute.path.startsWith(this.normalizePath(href));
  }

  /**
   * Check if link is exactly active
   */
  isExactActiveLink(href) {
    if (!this.currentRoute) return false;
    return this.currentRoute.path === this.normalizePath(href);
  }

  /**
   * Handle scroll behavior
   */
  handleScrollBehavior(route) {
    // Scroll to top by default
    if (route.hash) {
      // Scroll to element with ID
      const element = document.getElementById(route.hash);
      if (element) {
        window.Utils.scrollTo(element);
        return;
      }
    }
    
    // Scroll to top
    window.scrollTo({
      top: 0,
      behavior: this.config.scrollBehavior
    });
  }

  /**
   * Handle link clicks
   */
  handleLinkClick(event) {
    const link = event.target.closest('a[href]');
    if (!link) return;
    
    const href = link.getAttribute('href');
    
    // Skip external links
    if (this.isExternalLink(href)) return;
    
    // Skip if has target attribute
    if (link.hasAttribute('target')) return;
    
    // Skip if modifier keys are pressed
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    
    // Skip if right click
    if (event.button !== 0) return;
    
    // Prevent default and navigate
    event.preventDefault();
    this.push(href);
  }

  /**
   * Handle form submissions
   */
  handleFormSubmit(event) {
    const form = event.target;
    if (!form.hasAttribute('data-router-form')) return;
    
    event.preventDefault();
    
    const action = form.getAttribute('action') || form.getAttribute('data-action');
    if (action) {
      this.push(action);
    }
  }

  /**
   * Handle popstate events
   */
  handlePopState(event) {
    const path = window.location.pathname + window.location.search + window.location.hash;
    this.navigateToRoute(this.matchRoute(path) || this.getNotFoundRoute());
  }

  /**
   * Handle initial navigation
   */
  handleInitialNavigation() {
    const currentPath = window.location.pathname + window.location.search + window.location.hash;
    const route = this.matchRoute(currentPath) || this.getNotFoundRoute();
    this.navigateToRoute(route);
  }

  /**
   * Register default routes
   */
  registerDefaultRoutes() {
    // Home route
    this.route('/', {
      name: 'home',
      component: 'home/index',
      meta: { title: 'Home - Meesam Gardezi Portfolio' }
    });

    // Projects route
    this.route('/projects', {
      name: 'projects',
      component: 'projects/projects',
      meta: { title: 'Projects - Meesam Gardezi Portfolio' }
    });

    // Project detail route
    this.route('/projects/:id', {
      name: 'project-detail',
      component: 'project-detail/project-detail',
      meta: { title: 'Project - Meesam Gardezi Portfolio' }
    });

    // Contact route
    this.route('/contact', {
      name: 'contact',
      component: 'contact/contact',
      meta: { title: 'Contact - Meesam Gardezi Portfolio' }
    });

    // Admin routes (protected)
    this.route('/admin', {
      name: 'admin',
      component: 'admin/admin',
      meta: { title: 'Admin - Meesam Gardezi Portfolio', requiresAuth: true },
      beforeEnter: this.requireAuth
    });

    // 404 route
    this.route('/404', {
      name: '404',
      component: () => `
        <div class="not-found-container" style="
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          min-height: 50vh;
          text-align: center;
          font-family: system-ui, -apple-system, sans-serif;
        ">
          <h1 style="font-size: 4rem; margin: 0; color: #6c757d;">404</h1>
          <h2 style="margin: 20px 0; color: #333;">Page Not Found</h2>
          <p style="color: #6c757d; margin-bottom: 30px;">
            The page you're looking for doesn't exist.
          </p>
          <a href="/" data-router-link style="
            padding: 12px 24px;
            background: #007bff;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            transition: background 0.2s;
          ">
            Go Home
          </a>
        </div>
      `,
      meta: { title: 'Page Not Found - Meesam Gardezi Portfolio' }
    });
  }

  /**
   * Authentication guard
   */
  requireAuth = async (to, from, next) => {
    const isAuthenticated = window.FirebaseService?.isAuthenticated();
    
    if (isAuthenticated) {
      next();
    } else {
      console.log('Authentication required, redirecting to home');
      next('/');
    }
  };

  /**
   * Get not found route
   */
  getNotFoundRoute() {
    return this.routes.get('404');
  }

  /**
   * Utility methods
   */
  normalizePath(path) {
    if (!path) return '/';
    if (!path.startsWith('/')) path = '/' + path;
    return path;
  }

  generateRouteName(path) {
    return path.replace(/[^\w]/g, '_').replace(/^_+|_+$/g, '') || 'root';
  }

  extractParamNames(path) {
    const matches = path.match(/:(\w+)/g);
    return matches ? matches.map(match => match.slice(1)) : [];
  }

  pathToRegex(path) {
    const regexPath = path
      .replace(/:\w+/g, '([^/]+)')
      .replace(/\//g, '\\/');
    return new RegExp(`^${regexPath}$`);
  }

  buildPath(template, params) {
    let path = template;
    Object.entries(params).forEach(([key, value]) => {
      path = path.replace(`:${key}`, encodeURIComponent(value));
    });
    return path;
  }

  parseQuery(search) {
    const query = {};
    if (search.startsWith('?')) {
      search = search.slice(1);
    }
    
    search.split('&').forEach(param => {
      const [key, value] = param.split('=');
      if (key) {
        query[decodeURIComponent(key)] = value ? decodeURIComponent(value) : '';
      }
    });
    
    return query;
  }

  isExternalLink(href) {
    return /^https?:\/\//.test(href) || href.startsWith('mailto:') || href.startsWith('tel:');
  }

  updateHistory(route, replace) {
    const url = route.path + 
      (Object.keys(route.query).length ? '?' + new URLSearchParams(route.query).toString() : '') +
      (route.hash ? '#' + route.hash : '');
      
    if (replace) {
      window.history.replaceState({ route: route.name }, '', url);
    } else {
      window.history.pushState({ route: route.name }, '', url);
    }
    
    // Update page title
    if (route.meta && route.meta.title) {
      document.title = route.meta.title;
    }
  }

  runAfterEachHooks(to, from) {
    this.hooks.afterEach.forEach(hook => {
      try {
        hook(to, from);
      } catch (error) {
        console.error('AfterEach hook error:', error);
      }
    });
  }

  trackPageView(route) {
    // Track page view with Firebase Analytics
    if (window.FirebaseService?.trackPageView) {
      window.FirebaseService.trackPageView(route.path);
    }
  }

  handleNavigationError(error) {
    console.error('Navigation failed:', error);
    
    if (this.currentRoute?.name !== '404') {
      this.push('/404', true);
    }
  }

  /**
   * Add navigation guards and hooks
   */
  beforeEach(guard) {
    this.hooks.beforeEach.push(guard);
  }

  afterEach(hook) {
    this.hooks.afterEach.push(hook);
  }

  beforeRouteEnter(guard) {
    this.hooks.beforeRouteEnter.push(guard);
  }

  beforeRouteLeave(guard) {
    this.hooks.beforeRouteLeave.push(guard);
  }
}

// Create global router instance
window.Router = new Router();

// Convenience functions
window.navigateTo = (path) => window.Router.push(path);
window.redirectTo = (path) => window.Router.replace(path);

console.log('✅ Router initialized'); 
