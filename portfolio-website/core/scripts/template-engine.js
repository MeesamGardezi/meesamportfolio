/**
 * TEMPLATE-ENGINE.JS - Custom Handlebars-like Template Engine
 * Portfolio Website - Lightweight Component-Based System
 * Features: Variables, loops, conditionals, partials, data binding
 */

class TemplateEngine {
  constructor() {
    this.helpers = new Map();
    this.partials = new Map();
    this.cache = new Map();
    this.cacheEnabled = true;
    
    // Register default helpers
    this.registerDefaultHelpers();
  }

  /**
   * Render template with data
   * @param {string} template - Template string
   * @param {object} data - Data object
   * @param {object} options - Rendering options
   * @returns {string} Rendered HTML
   */
  render(template, data = {}, options = {}) {
    try {
      // Check cache first
      const cacheKey = this.getCacheKey(template, data);
      if (this.cacheEnabled && this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey);
      }

      // Create rendering context
      const context = {
        data: this.createDataContext(data),
        options: {
          escapeHtml: true,
          allowUnsafe: false,
          ...options
        }
      };

      // Process template
      let result = this.processTemplate(template, context);
      
      // Cache result
      if (this.cacheEnabled) {
        this.cache.set(cacheKey, result);
      }

      return result;
    } catch (error) {
      console.error('Template rendering error:', error);
      return `<div class="template-error">Template Error: ${error.message}</div>`;
    }
  }

  /**
   * Process template with context
   */
  processTemplate(template, context) {
    let result = template;

    // Process in order: partials, helpers, blocks, variables
    result = this.processPartials(result, context);
    result = this.processHelpers(result, context);
    result = this.processBlocks(result, context);
    result = this.processVariables(result, context);

    return result;
  }

  /**
   * Process template variables {{variable}}
   */
  processVariables(template, context) {
    const variableRegex = /\{\{(?!\#|\/)([^}]+)\}\}/g;
    
    return template.replace(variableRegex, (match, expression) => {
      try {
        const trimmed = expression.trim();
        const value = this.resolveExpression(trimmed, context.data);
        
        if (value === null || value === undefined) {
          return '';
        }

        // Escape HTML unless marked as safe
        if (context.options.escapeHtml && !context.options.allowUnsafe) {
          return this.escapeHtml(String(value));
        }

        return String(value);
      } catch (error) {
        console.warn('Variable resolution error:', error);
        return '';
      }
    });
  }

  /**
   * Process template blocks {{#if}}, {{#each}}, etc.
   */
  processBlocks(template, context) {
    let result = template;
    
    // Process nested blocks from inside out
    while (this.hasBlocks(result)) {
      result = this.processBlockIteration(result, context);
    }
    
    return result;
  }

  /**
   * Process one iteration of blocks
   */
  processBlockIteration(template, context) {
    // Each block
    template = this.processEachBlocks(template, context);
    
    // If/Unless blocks
    template = this.processConditionalBlocks(template, context);
    
    // With blocks
    template = this.processWithBlocks(template, context);
    
    return template;
  }

  /**
   * Process {{#each}} blocks
   */
  processEachBlocks(template, context) {
    const eachRegex = /\{\{#each\s+([^}]+)\}\}([\s\S]*?)\{\{\/each\}\}/g;
    
    return template.replace(eachRegex, (match, expression, content) => {
      try {
        const trimmed = expression.trim();
        const array = this.resolveExpression(trimmed, context.data);
        
        if (!Array.isArray(array)) {
          return '';
        }

        return array.map((item, index) => {
          const itemContext = {
            ...context,
            data: {
              ...context.data,
              this: item,
              '@index': index,
              '@first': index === 0,
              '@last': index === array.length - 1,
              '@length': array.length
            }
          };
          
          return this.processTemplate(content, itemContext);
        }).join('');
        
      } catch (error) {
        console.warn('Each block error:', error);
        return '';
      }
    });
  }

  /**
   * Process {{#if}} and {{#unless}} blocks
   */
  processConditionalBlocks(template, context) {
    // If blocks
    const ifRegex = /\{\{#if\s+([^}]+)\}\}([\s\S]*?)(?:\{\{else\}\}([\s\S]*?))?\{\{\/if\}\}/g;
    template = template.replace(ifRegex, (match, expression, ifContent, elseContent = '') => {
      try {
        const condition = this.resolveExpression(expression.trim(), context.data);
        const content = this.isTruthy(condition) ? ifContent : elseContent;
        return this.processTemplate(content, context);
      } catch (error) {
        console.warn('If block error:', error);
        return '';
      }
    });

    // Unless blocks
    const unlessRegex = /\{\{#unless\s+([^}]+)\}\}([\s\S]*?)(?:\{\{else\}\}([\s\S]*?))?\{\{\/unless\}\}/g;
    template = template.replace(unlessRegex, (match, expression, unlessContent, elseContent = '') => {
      try {
        const condition = this.resolveExpression(expression.trim(), context.data);
        const content = !this.isTruthy(condition) ? unlessContent : elseContent;
        return this.processTemplate(content, context);
      } catch (error) {
        console.warn('Unless block error:', error);
        return '';
      }
    });

    return template;
  }

  /**
   * Process {{#with}} blocks
   */
  processWithBlocks(template, context) {
    const withRegex = /\{\{#with\s+([^}]+)\}\}([\s\S]*?)\{\{\/with\}\}/g;
    
    return template.replace(withRegex, (match, expression, content) => {
      try {
        const value = this.resolveExpression(expression.trim(), context.data);
        
        if (value === null || value === undefined) {
          return '';
        }

        const withContext = {
          ...context,
          data: {
            ...context.data,
            this: value
          }
        };
        
        return this.processTemplate(content, withContext);
      } catch (error) {
        console.warn('With block error:', error);
        return '';
      }
    });
  }

  /**
   * Process template partials {{>partial}}
   */
  processPartials(template, context) {
    const partialRegex = /\{\{>\s*([^}]+)\}\}/g;
    
    return template.replace(partialRegex, (match, name) => {
      try {
        const partialName = name.trim();
        const partial = this.partials.get(partialName);
        
        if (!partial) {
          console.warn(`Partial '${partialName}' not found`);
          return '';
        }

        return this.processTemplate(partial, context);
      } catch (error) {
        console.warn('Partial processing error:', error);
        return '';
      }
    });
  }

  /**
   * Process template helpers {{helper param}}
   */
  processHelpers(template, context) {
    const helperRegex = /\{\{([a-zA-Z_$][a-zA-Z0-9_$]*)\s+([^}]+)\}\}/g;
    
    return template.replace(helperRegex, (match, helperName, params) => {
      try {
        const helper = this.helpers.get(helperName);
        
        if (!helper) {
          // Not a helper, let variable processing handle it
          return match;
        }

        const args = this.parseHelperParams(params, context.data);
        const result = helper.apply(context.data, args);
        
        return result !== null && result !== undefined ? String(result) : '';
      } catch (error) {
        console.warn('Helper processing error:', error);
        return '';
      }
    });
  }

  /**
   * Resolve expression in data context
   */
  resolveExpression(expression, data) {
    // Handle 'this' keyword
    if (expression === 'this') {
      return data.this || data;
    }

    // Handle @ variables
    if (expression.startsWith('@')) {
      return data[expression];
    }

    // Handle nested properties
    const parts = expression.split('.');
    let current = data;
    
    for (const part of parts) {
      if (current === null || current === undefined) {
        return undefined;
      }
      current = current[part];
    }
    
    return current;
  }

  /**
   * Parse helper parameters
   */
  parseHelperParams(paramString, data) {
    const params = [];
    const tokens = paramString.match(/(?:[^\s"']+|"[^"]*"|'[^']*')+/g) || [];
    
    for (const token of tokens) {
      if (token.startsWith('"') && token.endsWith('"')) {
        // String literal
        params.push(token.slice(1, -1));
      } else if (token.startsWith("'") && token.endsWith("'")) {
        // String literal
        params.push(token.slice(1, -1));
      } else if (!isNaN(token)) {
        // Number literal
        params.push(parseFloat(token));
      } else if (token === 'true' || token === 'false') {
        // Boolean literal
        params.push(token === 'true');
      } else {
        // Variable reference
        params.push(this.resolveExpression(token, data));
      }
    }
    
    return params;
  }

  /**
   * Check if template has unprocessed blocks
   */
  hasBlocks(template) {
    const blockRegex = /\{\{#(each|if|unless|with)\s+[^}]+\}\}/;
    return blockRegex.test(template);
  }

  /**
   * Check if value is truthy
   */
  isTruthy(value) {
    if (value === null || value === undefined || value === false) {
      return false;
    }
    if (value === 0 || value === '') {
      return false;
    }
    if (Array.isArray(value) && value.length === 0) {
      return false;
    }
    if (typeof value === 'object' && Object.keys(value).length === 0) {
      return false;
    }
    return true;
  }

  /**
   * Create data context with globals
   */
  createDataContext(data) {
    return {
      ...data,
      $global: window.TemplateGlobals || {},
      $env: window.ENV || {},
      $user: window.FirebaseService?.getCurrentUser() || null
    };
  }

  /**
   * Escape HTML characters
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Generate cache key
   */
  getCacheKey(template, data) {
    const templateHash = this.simpleHash(template);
    const dataHash = this.simpleHash(JSON.stringify(data));
    return `${templateHash}_${dataHash}`;
  }

  /**
   * Simple hash function
   */
  simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(36);
  }

  /**
   * Register template helper
   */
  registerHelper(name, fn) {
    this.helpers.set(name, fn);
  }

  /**
   * Register template partial
   */
  registerPartial(name, template) {
    this.partials.set(name, template);
  }

  /**
   * Register default helpers
   */
  registerDefaultHelpers() {
    // Date formatting
    this.registerHelper('formatDate', (date, format = 'MMM DD, YYYY') => {
      if (!date) return '';
      const d = new Date(date);
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    });

    // Uppercase
    this.registerHelper('upper', (str) => {
      return str ? String(str).toUpperCase() : '';
    });

    // Lowercase
    this.registerHelper('lower', (str) => {
      return str ? String(str).toLowerCase() : '';
    });

    // Capitalize
    this.registerHelper('capitalize', (str) => {
      if (!str) return '';
      return String(str).charAt(0).toUpperCase() + String(str).slice(1);
    });

    // Truncate
    this.registerHelper('truncate', (str, length = 100) => {
      if (!str) return '';
      const text = String(str);
      return text.length > length ? text.substring(0, length) + '...' : text;
    });

    // Join array
    this.registerHelper('join', (array, separator = ', ') => {
      if (!Array.isArray(array)) return '';
      return array.join(separator);
    });

    // Default value
    this.registerHelper('default', (value, defaultValue) => {
      return value !== null && value !== undefined && value !== '' ? value : defaultValue;
    });

    // Math operations
    this.registerHelper('add', (a, b) => Number(a) + Number(b));
    this.registerHelper('subtract', (a, b) => Number(a) - Number(b));
    this.registerHelper('multiply', (a, b) => Number(a) * Number(b));
    this.registerHelper('divide', (a, b) => Number(a) / Number(b));

    // Comparison
    this.registerHelper('eq', (a, b) => a === b);
    this.registerHelper('ne', (a, b) => a !== b);
    this.registerHelper('gt', (a, b) => Number(a) > Number(b));
    this.registerHelper('lt', (a, b) => Number(a) < Number(b));
    this.registerHelper('gte', (a, b) => Number(a) >= Number(b));
    this.registerHelper('lte', (a, b) => Number(a) <= Number(b));

    // JSON stringify
    this.registerHelper('json', (obj) => {
      try {
        return JSON.stringify(obj, null, 2);
      } catch (error) {
        return '';
      }
    });

    // URL encoding
    this.registerHelper('urlEncode', (str) => {
      return str ? encodeURIComponent(String(str)) : '';
    });
  }

  /**
   * Clear template cache
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * Enable/disable caching
   */
  setCacheEnabled(enabled) {
    this.cacheEnabled = enabled;
    if (!enabled) {
      this.clearCache();
    }
  }
}

// Create global template engine instance
window.TemplateEngine = new TemplateEngine();

// Template globals
window.TemplateGlobals = {
  siteName: 'Meesam Gardezi Portfolio',
  currentYear: new Date().getFullYear(),
  version: '1.0.0'
};

// Convenience function for quick rendering
window.renderTemplate = (template, data, options) => {
  return window.TemplateEngine.render(template, data, options);
};

console.log('✅ Template Engine initialized'); 
