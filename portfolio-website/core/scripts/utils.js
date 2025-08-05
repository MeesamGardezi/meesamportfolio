/**
 * UTILS.JS - Utility Functions and Helpers
 * Portfolio Website - Common utilities for DOM, API, data processing
 * Features: DOM manipulation, API requests, data formatting, validation
 */

class Utils {
  constructor() {
    this.cache = new Map();
    this.debounceTimers = new Map();
    this.throttleTimers = new Map();
  }

  /* ==========================================================================
     DOM UTILITIES
     ========================================================================== */

  /**
   * Query selector with optional context
   */
  $(selector, context = document) {
    return context.querySelector(selector);
  }

  /**
   * Query selector all with optional context
   */
  $$(selector, context = document) {
    return Array.from(context.querySelectorAll(selector));
  }

  /**
   * Create DOM element with attributes and content
   */
  createElement(tag, attributes = {}, content = '') {
    const element = document.createElement(tag);
    
    Object.entries(attributes).forEach(([key, value]) => {
      if (key === 'class' || key === 'className') {
        element.className = value;
      } else if (key === 'style' && typeof value === 'object') {
        Object.assign(element.style, value);
      } else if (key.startsWith('data-')) {
        element.setAttribute(key, value);
      } else if (key === 'innerHTML') {
        element.innerHTML = value;
      } else if (key === 'textContent') {
        element.textContent = value;
      } else {
        element.setAttribute(key, value);
      }
    });
    
    if (content) {
      element.innerHTML = content;
    }
    
    return element;
  }

  /**
   * Add event listener with automatic cleanup
   */
  on(element, event, handler, options = {}) {
    if (typeof element === 'string') {
      element = this.$(element);
    }
    
    if (!element) return null;
    
    const wrappedHandler = (e) => {
      try {
        return handler(e);
      } catch (error) {
        console.error('Event handler error:', error);
      }
    };
    
    element.addEventListener(event, wrappedHandler, options);
    
    // Return cleanup function
    return () => element.removeEventListener(event, wrappedHandler, options);
  }

  /**
   * Add event listener that fires once
   */
  once(element, event, handler) {
    return this.on(element, event, handler, { once: true });
  }

  /**
   * Wait for DOM to be ready
   */
  ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  /**
   * Add CSS class
   */
  addClass(element, className) {
    if (typeof element === 'string') {
      element = this.$(element);
    }
    if (element) element.classList.add(className);
  }

  /**
   * Remove CSS class
   */
  removeClass(element, className) {
    if (typeof element === 'string') {
      element = this.$(element);
    }
    if (element) element.classList.remove(className);
  }

  /**
   * Toggle CSS class
   */
  toggleClass(element, className) {
    if (typeof element === 'string') {
      element = this.$(element);
    }
    if (element) element.classList.toggle(className);
  }

  /**
   * Check if element has class
   */
  hasClass(element, className) {
    if (typeof element === 'string') {
      element = this.$(element);
    }
    return element ? element.classList.contains(className) : false;
  }

  /**
   * Show element
   */
  show(element, display = 'block') {
    if (typeof element === 'string') {
      element = this.$(element);
    }
    if (element) element.style.display = display;
  }

  /**
   * Hide element
   */
  hide(element) {
    if (typeof element === 'string') {
      element = this.$(element);
    }
    if (element) element.style.display = 'none';
  }

  /**
   * Toggle element visibility
   */
  toggle(element, display = 'block') {
    if (typeof element === 'string') {
      element = this.$(element);
    }
    if (!element) return;
    
    if (element.style.display === 'none') {
      this.show(element, display);
    } else {
      this.hide(element);
    }
  }

  /**
   * Smooth scroll to element
   */
  scrollTo(element, options = {}) {
    if (typeof element === 'string') {
      element = this.$(element);
    }
    
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        ...options
      });
    }
  }

  /* ==========================================================================
     API UTILITIES
     ========================================================================== */

  /**
   * Make HTTP request with error handling
   */
  async request(url, options = {}) {
    const defaults = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000
    };

    const config = { ...defaults, ...options };

    try {
      // Add timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), config.timeout);
      config.signal = controller.signal;

      const response = await fetch(url, config);
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      } else {
        return await response.text();
      }
    } catch (error) {
      console.error('Request failed:', error);
      throw error;
    }
  }

  /**
   * GET request
   */
  async get(url, params = {}) {
    const queryString = this.buildQueryString(params);
    const fullUrl = queryString ? `${url}?${queryString}` : url;
    return this.request(fullUrl);
  }

  /**
   * POST request
   */
  async post(url, data = {}, options = {}) {
    return this.request(url, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options
    });
  }

  /**
   * PUT request
   */
  async put(url, data = {}, options = {}) {
    return this.request(url, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options
    });
  }

  /**
   * DELETE request
   */
  async delete(url, options = {}) {
    return this.request(url, {
      method: 'DELETE',
      ...options
    });
  }

  /**
   * Build query string from object
   */
  buildQueryString(params) {
    const filtered = Object.entries(params)
      .filter(([key, value]) => value !== null && value !== undefined && value !== '')
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
    
    return filtered.join('&');
  }

  /* ==========================================================================
     DATA UTILITIES
     ========================================================================== */

  /**
   * Deep clone object
   */
  clone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    
    try {
      return JSON.parse(JSON.stringify(obj));
    } catch (error) {
      console.warn('Clone fallback to shallow copy:', error);
      return { ...obj };
    }
  }

  /**
   * Deep merge objects
   */
  merge(target, ...sources) {
    if (!sources.length) return target;
    const source = sources.shift();

    if (this.isObject(target) && this.isObject(source)) {
      for (const key in source) {
        if (this.isObject(source[key])) {
          if (!target[key]) Object.assign(target, { [key]: {} });
          this.merge(target[key], source[key]);
        } else {
          Object.assign(target, { [key]: source[key] });
        }
      }
    }

    return this.merge(target, ...sources);
  }

  /**
   * Check if value is object
   */
  isObject(item) {
    return item && typeof item === 'object' && !Array.isArray(item);
  }

  /**
   * Get nested property safely
   */
  get(obj, path, defaultValue = undefined) {
    const keys = path.split('.');
    let current = obj;
    
    for (const key of keys) {
      if (current === null || current === undefined || !(key in current)) {
        return defaultValue;
      }
      current = current[key];
    }
    
    return current;
  }

  /**
   * Set nested property
   */
  set(obj, path, value) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    let current = obj;
    
    for (const key of keys) {
      if (!(key in current) || !this.isObject(current[key])) {
        current[key] = {};
      }
      current = current[key];
    }
    
    current[lastKey] = value;
    return obj;
  }

  /**
   * Array unique values
   */
  unique(array) {
    return [...new Set(array)];
  }

  /**
   * Array shuffle
   */
  shuffle(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * Array chunk into smaller arrays
   */
  chunk(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  /* ==========================================================================
     STRING UTILITIES
     ========================================================================== */

  /**
   * Capitalize first letter
   */
  capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * Convert to camelCase
   */
  camelCase(str) {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => 
        index === 0 ? word.toLowerCase() : word.toUpperCase())
      .replace(/\s+/g, '');
  }

  /**
   * Convert to kebab-case
   */
  kebabCase(str) {
    return str
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/\s+/g, '-')
      .toLowerCase();
  }

  /**
   * Generate random string
   */
  randomString(length = 10, chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789') {
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Generate slug from string
   */
  slugify(str) {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  /**
   * Truncate string
   */
  truncate(str, length = 100, suffix = '...') {
    if (!str || str.length <= length) return str;
    return str.substring(0, length).trim() + suffix;
  }

  /* ==========================================================================
     DATE UTILITIES
     ========================================================================== */

  /**
   * Format date
   */
  formatDate(date, format = 'YYYY-MM-DD') {
    if (!date) return '';
    
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    
    const formats = {
      'YYYY': d.getFullYear(),
      'MM': String(d.getMonth() + 1).padStart(2, '0'),
      'DD': String(d.getDate()).padStart(2, '0'),
      'HH': String(d.getHours()).padStart(2, '0'),
      'mm': String(d.getMinutes()).padStart(2, '0'),
      'ss': String(d.getSeconds()).padStart(2, '0')
    };
    
    let result = format;
    Object.entries(formats).forEach(([pattern, value]) => {
      result = result.replace(new RegExp(pattern, 'g'), value);
    });
    
    return result;
  }

  /**
   * Time ago format
   */
  timeAgo(date) {
    if (!date) return '';
    
    const now = new Date();
    const past = new Date(date);
    const diffMs = now - past;
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffSecs < 60) return 'just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return this.formatDate(date, 'MMM DD, YYYY');
  }

  /* ==========================================================================
     VALIDATION UTILITIES
     ========================================================================== */

  /**
   * Validate email
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate URL
   */
  isValidURL(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Validate phone number (simple)
   */
  isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  }

  /* ==========================================================================
     PERFORMANCE UTILITIES
     ========================================================================== */

  /**
   * Debounce function
   */
  debounce(func, delay = 300, key = 'default') {
    return (...args) => {
      clearTimeout(this.debounceTimers.get(key));
      this.debounceTimers.set(key, setTimeout(() => func.apply(this, args), delay));
    };
  }

  /**
   * Throttle function
   */
  throttle(func, delay = 300, key = 'default') {
    return (...args) => {
      if (!this.throttleTimers.get(key)) {
        func.apply(this, args);
        this.throttleTimers.set(key, setTimeout(() => {
          this.throttleTimers.delete(key);
        }, delay));
      }
    };
  }

  /**
   * Memoize function results
   */
  memoize(func, keyGenerator = (...args) => JSON.stringify(args)) {
    const cache = new Map();
    
    return (...args) => {
      const key = keyGenerator(...args);
      
      if (cache.has(key)) {
        return cache.get(key);
      }
      
      const result = func.apply(this, args);
      cache.set(key, result);
      return result;
    };
  }

  /* ==========================================================================
     STORAGE UTILITIES
     ========================================================================== */

  /**
   * Local storage with JSON support
   */
  storage = {
    set: (key, value) => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (error) {
        console.warn('Storage set failed:', error);
        return false;
      }
    },
    
    get: (key, defaultValue = null) => {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
      } catch (error) {
        console.warn('Storage get failed:', error);
        return defaultValue;
      }
    },
    
    remove: (key) => {
      try {
        localStorage.removeItem(key);
        return true;
      } catch (error) {
        console.warn('Storage remove failed:', error);
        return false;
      }
    },
    
    clear: () => {
      try {
        localStorage.clear();
        return true;
      } catch (error) {
        console.warn('Storage clear failed:', error);
        return false;
      }
    }
  };

  /* ==========================================================================
     MISC UTILITIES
     ========================================================================== */

  /**
   * Sleep/delay function
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Generate UUID v4
   */
  uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  /**
   * Copy text to clipboard
   */
  async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.warn('Clipboard API failed, using fallback:', error);
      
      // Fallback method
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      try {
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        return successful;
      } catch (err) {
        document.body.removeChild(textArea);
        return false;
      }
    }
  }

  /**
   * Load script dynamically
   */
  loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  /**
   * Load CSS dynamically
   */
  loadCSS(href) {
    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.onload = resolve;
      link.onerror = reject;
      document.head.appendChild(link);
    });
  }
}

// Create global utils instance
window.Utils = new Utils();

console.log('✅ Utils initialized'); 
