/**
 * CONSTANTS.JS - Application Constants and Configuration
 * Portfolio Website - Central configuration file
 * Features: Firebase config, API endpoints, UI constants, environment settings
 */

// Firebase Configuration (from your provided config)
export const FIREBASE_CONFIG = {
  apiKey: "AIzaSyCBUX2wKjdwYSw61T5_xGONXj34j5C5q2I",
  authDomain: "mesog-portfolio.firebaseapp.com",
  projectId: "mesog-portfolio",
  storageBucket: "mesog-portfolio.firebasestorage.app",
  messagingSenderId: "364503690658",
  appId: "1:364503690658:web:cf39d35305364365ed16fb",
  measurementId: "G-WYZYKX4RJL"
};

// Environment Configuration
export const ENV = {
  NODE_ENV: process?.env?.NODE_ENV || 'development',
  PRODUCTION: process?.env?.NODE_ENV === 'production',
  DEVELOPMENT: process?.env?.NODE_ENV !== 'production'
};

// Site Configuration
export const SITE_CONFIG = {
  name: 'Meesam Gardezi Portfolio',
  title: 'Meesam Gardezi - Flutter Developer',
  description: 'Portfolio website of Meesam Gardezi, a skilled Flutter developer creating beautiful mobile applications.',
  author: 'Meesam Gardezi',
  url: 'https://mesog-portfolio.web.app',
  version: '1.0.0',
  keywords: ['Flutter', 'Mobile Development', 'App Development', 'Portfolio', 'Meesam Gardezi'],
  language: 'en',
  locale: 'en_US'
};

// Contact Information
export const CONTACT_INFO = {
  email: 'contact@meesamgardezi.com',
  phone: '+92-XXX-XXXXXXX',
  location: 'Sargodha, Punjab, Pakistan',
  linkedin: 'https://linkedin.com/in/meesamgardezi',
  github: 'https://github.com/meesamgardezi',
  twitter: 'https://twitter.com/meesamgardezi',
  instagram: 'https://instagram.com/meesamgardezi'
};

// API Configuration
export const API_CONFIG = {
  baseURL: ENV.PRODUCTION 
    ? 'https://api.meesamgardezi.com' 
    : 'http://localhost:3000',
  
  endpoints: {
    projects: '/api/projects',
    contacts: '/api/contacts',
    auth: '/api/auth',
    upload: '/api/upload',
    analytics: '/api/analytics'
  },
  
  timeout: 10000,
  retryAttempts: 3,
  retryDelay: 1000
};

// Firebase Collections
export const COLLECTIONS = {
  PROJECTS: 'projects',
  CONTACTS: 'contacts',
  ANALYTICS: 'analytics',
  USERS: 'users',
  SETTINGS: 'settings'
};

// Project Categories
export const PROJECT_CATEGORIES = {
  MOBILE: 'mobile',
  WEB: 'web',
  DESKTOP: 'desktop',
  BACKEND: 'backend',
  FULLSTACK: 'fullstack'
};

// Project Status
export const PROJECT_STATUS = {
  DRAFT: 'draft',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  PUBLISHED: 'published',
  ARCHIVED: 'archived'
};

// Technologies
export const TECHNOLOGIES = {
  FLUTTER: {
    name: 'Flutter',
    icon: 'flutter',
    color: '#02569B',
    category: 'mobile'
  },
  DART: {
    name: 'Dart',
    icon: 'dart',
    color: '#0175C2',
    category: 'language'
  },
  FIREBASE: {
    name: 'Firebase',
    icon: 'firebase',
    color: '#FFCA28',
    category: 'backend'
  },
  JAVASCRIPT: {
    name: 'JavaScript',
    icon: 'javascript',
    color: '#F7DF1E',
    category: 'language'
  },
  TYPESCRIPT: {
    name: 'TypeScript',
    icon: 'typescript',
    color: '#3178C6',
    category: 'language'
  },
  REACT: {
    name: 'React',
    icon: 'react',
    color: '#61DAFB',
    category: 'web'
  },
  NODE_JS: {
    name: 'Node.js',
    icon: 'nodejs',
    color: '#339933',
    category: 'backend'
  },
  PYTHON: {
    name: 'Python',
    icon: 'python',
    color: '#3776AB',
    category: 'language'
  },
  JAVA: {
    name: 'Java',
    icon: 'java',
    color: '#ED8B00',
    category: 'language'
  },
  KOTLIN: {
    name: 'Kotlin',
    icon: 'kotlin',
    color: '#7F52FF',
    category: 'language'
  },
  SWIFT: {
    name: 'Swift',
    icon: 'swift',
    color: '#FA7343',
    category: 'language'
  },
  GIT: {
    name: 'Git',
    icon: 'git',
    color: '#F05032',
    category: 'tool'
  }
};

// UI Constants
export const UI_CONSTANTS = {
  // Breakpoints (px)
  breakpoints: {
    xs: 480,
    sm: 768,
    md: 1024,
    lg: 1200,
    xl: 1400
  },
  
  // Grid
  grid: {
    maxWidth: 1200,
    gutterWidth: 24,
    columns: 12
  },
  
  // Spacing scale (px)
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64
  },
  
  // Animation durations (ms)
  animations: {
    fast: 150,
    normal: 300,
    slow: 500,
    verySlow: 1000
  },
  
  // Z-index scale
  zIndex: {
    dropdown: 1000,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
    notification: 1080,
    loading: 1090
  },
  
  // Border radius (px)
  borderRadius: {
    small: 4,
    medium: 8,
    large: 12,
    circle: '50%'
  }
};

// Color Palette
export const COLORS = {
  // Primary colors
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e'
  },
  
  // Grayscale
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827'
  },
  
  // Semantic colors
  semantic: {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6'
  },
  
  // Brand colors
  brand: {
    flutter: '#02569B',
    firebase: '#FFCA28',
    github: '#181717'
  }
};

// Typography
export const TYPOGRAPHY = {
  fontFamilies: {
    primary: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
  },
  
  fontSizes: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
    '6xl': '3.75rem'  // 60px
  },
  
  fontWeights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800
  },
  
  lineHeights: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75
  }
};

// Navigation Menu
export const NAVIGATION = {
  primary: [
    { name: 'Home', path: '/', exact: true },
    { name: 'Projects', path: '/projects' },
    { name: 'Contact', path: '/contact' }
  ],
  
  footer: [
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Terms of Service', path: '/terms' },
    { name: 'Sitemap', path: '/sitemap' }
  ],
  
  admin: [
    { name: 'Dashboard', path: '/admin', exact: true },
    { name: 'Projects', path: '/admin/projects' },
    { name: 'Contacts', path: '/admin/contacts' },
    { name: 'Analytics', path: '/admin/analytics' }
  ]
};

// Error Messages
export const ERROR_MESSAGES = {
  // Network errors
  NETWORK_ERROR: 'Network error. Please check your connection.',
  TIMEOUT_ERROR: 'Request timeout. Please try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  
  // Authentication errors
  AUTH_REQUIRED: 'Authentication required.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  SESSION_EXPIRED: 'Session expired. Please sign in again.',
  
  // Validation errors
  REQUIRED_FIELD: 'This field is required.',
  INVALID_EMAIL: 'Please enter a valid email address.',
  INVALID_PHONE: 'Please enter a valid phone number.',
  MESSAGE_TOO_SHORT: 'Message must be at least 10 characters.',
  MESSAGE_TOO_LONG: 'Message cannot exceed 1000 characters.',
  
  // Upload errors
  FILE_TOO_LARGE: 'File size must be less than 5MB.',
  INVALID_FILE_TYPE: 'Invalid file type. Please upload an image.',
  UPLOAD_FAILED: 'Upload failed. Please try again.',
  
  // General errors
  SOMETHING_WENT_WRONG: 'Something went wrong. Please try again.',
  PAGE_NOT_FOUND: 'Page not found.',
  ACCESS_DENIED: 'Access denied.'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  CONTACT_SENT: 'Thank you! Your message has been sent successfully.',
  PROJECT_SAVED: 'Project saved successfully.',
  PROJECT_DELETED: 'Project deleted successfully.',
  SETTINGS_UPDATED: 'Settings updated successfully.',
  IMAGE_UPLOADED: 'Image uploaded successfully.',
  SIGNED_IN: 'Signed in successfully.',
  SIGNED_OUT: 'Signed out successfully.'
};

// Loading Messages
export const LOADING_MESSAGES = {
  LOADING: 'Loading...',
  SENDING: 'Sending...',
  UPLOADING: 'Uploading...',
  SAVING: 'Saving...',
  DELETING: 'Deleting...',
  SIGNING_IN: 'Signing in...',
  PROCESSING: 'Processing...'
};

// Regular Expressions
export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[\+]?[1-9][\d]{0,15}$/,
  URL: /^https?:\/\/.+/,
  SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  HEX_COLOR: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
};

// File Upload Settings
export const UPLOAD_SETTINGS = {
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  allowedDocTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  thumbnailSize: { width: 300, height: 200 },
  compressionQuality: 0.8
};

// Cache Settings
export const CACHE_SETTINGS = {
  // Cache duration in milliseconds
  durations: {
    short: 5 * 60 * 1000,      // 5 minutes
    medium: 30 * 60 * 1000,    // 30 minutes
    long: 24 * 60 * 60 * 1000, // 24 hours
    permanent: Infinity
  },
  
  // Cache keys
  keys: {
    projects: 'cache_projects',
    featuredProjects: 'cache_featured_projects',
    userSettings: 'cache_user_settings',
    components: 'cache_components'
  }
};

// Rate Limiting
export const RATE_LIMITS = {
  contactForm: {
    maxAttempts: 3,
    windowMs: 60 * 60 * 1000 // 1 hour
  },
  
  searchApi: {
    maxAttempts: 100,
    windowMs: 15 * 60 * 1000 // 15 minutes
  },
  
  authAttempts: {
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000 // 15 minutes
  }
};

// Component Preload List (for performance)
export const PRELOAD_COMPONENTS = [
  { name: 'navbar', type: 'components' },
  { name: 'footer', type: 'components' },
  { name: 'hero', type: 'sections' },
  { name: 'project-card', type: 'components' }
];

// SEO Meta Data Templates
export const SEO_TEMPLATES = {
  home: {
    title: 'Meesam Gardezi - Flutter Developer',
    description: 'Portfolio of Meesam Gardezi, a skilled Flutter developer creating beautiful mobile applications.',
    keywords: 'Flutter, Mobile Development, App Development, Portfolio'
  },
  
  projects: {
    title: 'Projects - Meesam Gardezi Portfolio',
    description: 'Browse through my Flutter and mobile development projects.',
    keywords: 'Flutter Projects, Mobile Apps, Portfolio'
  },
  
  contact: {
    title: 'Contact - Meesam Gardezi',
    description: 'Get in touch with Meesam Gardezi for Flutter development projects.',
    keywords: 'Contact, Flutter Developer, Hire Developer'
  }
};

// Development Tools
export const DEV_TOOLS = {
  enableDebugMode: ENV.DEVELOPMENT,
  enablePerfMonitoring: true,
  enableErrorReporting: ENV.PRODUCTION,
  enableAnalytics: ENV.PRODUCTION,
  logLevel: ENV.DEVELOPMENT ? 'debug' : 'error'
};

// Create global constants object
window.CONSTANTS = {
  FIREBASE_CONFIG,
  ENV,
  SITE_CONFIG,
  CONTACT_INFO,
  API_CONFIG,
  COLLECTIONS,
  PROJECT_CATEGORIES,
  PROJECT_STATUS,
  TECHNOLOGIES,
  UI_CONSTANTS,
  COLORS,
  TYPOGRAPHY,
  NAVIGATION,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  LOADING_MESSAGES,
  REGEX,
  UPLOAD_SETTINGS,
  CACHE_SETTINGS,
  RATE_LIMITS,
  PRELOAD_COMPONENTS,
  SEO_TEMPLATES,
  DEV_TOOLS
};

// Also create individual global references for convenience
window.ENV = ENV;
window.FIREBASE_CONFIG = FIREBASE_CONFIG;
window.COLORS = COLORS;
window.UI_CONSTANTS = UI_CONSTANTS;

console.log('✅ Constants initialized'); 
