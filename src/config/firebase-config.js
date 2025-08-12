/**
 * Firebase Configuration
 * Dream Maker Developer Portfolio
 * 
 * This file initializes Firebase services and provides
 * centralized configuration for the entire application
 */

// Firebase configuration object
// TODO: Replace with your actual Firebase project credentials
const firebaseConfig = {
    development: {
        apiKey: "YOUR_DEV_API_KEY",
        authDomain: "YOUR_DEV_AUTH_DOMAIN",
        projectId: "YOUR_DEV_PROJECT_ID",
        storageBucket: "YOUR_DEV_STORAGE_BUCKET",
        messagingSenderId: "YOUR_DEV_MESSAGING_SENDER_ID",
        appId: "YOUR_DEV_APP_ID",
        measurementId: "YOUR_DEV_MEASUREMENT_ID"
    },
    production: {
        apiKey: "YOUR_PROD_API_KEY",
        authDomain: "YOUR_PROD_AUTH_DOMAIN", 
        projectId: "YOUR_PROD_PROJECT_ID",
        storageBucket: "YOUR_PROD_STORAGE_BUCKET",
        messagingSenderId: "YOUR_PROD_MESSAGING_SENDER_ID",
        appId: "YOUR_PROD_APP_ID",
        measurementId: "YOUR_PROD_MEASUREMENT_ID"
    }
};

// Determine environment
const environment = window.location.hostname === 'localhost' || 
                   window.location.hostname === '127.0.0.1' 
                   ? 'development' 
                   : 'production';

// Initialize Firebase with the appropriate config
const config = firebaseConfig[environment];

// Check if Firebase is already initialized
if (!firebase.apps.length) {
    firebase.initializeApp(config);
} else {
    firebase.app(); // Use existing app
}

// Initialize Firebase services
const db = firebase.firestore();
const storage = firebase.storage();
const analytics = firebase.analytics();
const performance = firebase.performance();

// Enable Firestore offline persistence
db.enablePersistence({ synchronizeTabs: true })
    .catch((err) => {
        if (err.code === 'failed-precondition') {
            console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
        } else if (err.code === 'unimplemented') {
            console.warn('The current browser does not support offline persistence');
        }
    });

// Firestore settings for better performance
db.settings({
    cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED
});

/**
 * Firebase Service Class
 * Provides methods for interacting with Firebase services
 */
class FirebaseService {
    constructor() {
        this.db = db;
        this.storage = storage;
        this.analytics = analytics;
        this.performance = performance;
        this.FieldValue = firebase.firestore.FieldValue;
        this.Timestamp = firebase.firestore.Timestamp;
    }

    // ============== Firestore Methods ==============

    /**
     * Get a single document by ID
     * @param {string} collection - Collection name
     * @param {string} docId - Document ID
     * @returns {Promise<Object>} Document data
     */
    async getDocument(collection, docId) {
        try {
            const doc = await this.db.collection(collection).doc(docId).get();
            if (doc.exists) {
                return { id: doc.id, ...doc.data() };
            }
            return null;
        } catch (error) {
            console.error(`Error fetching document from ${collection}:`, error);
            throw error;
        }
    }

    /**
     * Get all documents from a collection with optional query
     * @param {string} collection - Collection name
     * @param {Object} queryOptions - Query parameters
     * @returns {Promise<Array>} Array of documents
     */
    async getCollection(collection, queryOptions = {}) {
        try {
            let query = this.db.collection(collection);

            // Apply query options
            if (queryOptions.where) {
                queryOptions.where.forEach(condition => {
                    query = query.where(...condition);
                });
            }

            if (queryOptions.orderBy) {
                query = query.orderBy(...queryOptions.orderBy);
            }

            if (queryOptions.limit) {
                query = query.limit(queryOptions.limit);
            }

            const snapshot = await query.get();
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error(`Error fetching collection ${collection}:`, error);
            throw error;
        }
    }

    /**
     * Get featured projects
     * @param {number} limit - Number of projects to fetch
     * @returns {Promise<Array>} Array of featured projects
     */
    async getFeaturedProjects(limit = 4) {
        return this.getCollection('projects', {
            where: [
                ['featured', '==', true],
                ['status', '==', 'completed']
            ],
            orderBy: ['displayOrder', 'asc'],
            limit: limit
        });
    }

    /**
     * Get all completed projects
     * @returns {Promise<Array>} Array of all projects
     */
    async getAllProjects() {
        return this.getCollection('projects', {
            where: [['status', '==', 'completed']],
            orderBy: ['year', 'desc']
        });
    }

    /**
     * Get projects by category
     * @param {string} category - Project category
     * @returns {Promise<Array>} Array of projects in category
     */
    async getProjectsByCategory(category) {
        return this.getCollection('projects', {
            where: [
                ['category', '==', category],
                ['status', '==', 'completed']
            ],
            orderBy: ['year', 'desc']
        });
    }

    /**
     * Get project by slug
     * @param {string} slug - Project slug
     * @returns {Promise<Object>} Project data
     */
    async getProjectBySlug(slug) {
        const projects = await this.getCollection('projects', {
            where: [['slug', '==', slug]],
            limit: 1
        });
        return projects[0] || null;
    }

    /**
     * Get featured testimonials
     * @param {number} limit - Number of testimonials to fetch
     * @returns {Promise<Array>} Array of testimonials
     */
    async getFeaturedTestimonials(limit = 5) {
        return this.getCollection('testimonials', {
            where: [['featured', '==', true]],
            orderBy: ['displayOrder', 'asc'],
            limit: limit
        });
    }

    /**
     * Get all services
     * @returns {Promise<Array>} Array of services
     */
    async getServices() {
        return this.getCollection('services', {
            orderBy: ['displayOrder', 'asc']
        });
    }

    /**
     * Get technologies/skills
     * @returns {Promise<Array>} Array of technologies
     */
    async getTechnologies() {
        return this.getCollection('technologies', {
            orderBy: ['category', 'asc']
        });
    }

    /**
     * Get site configuration
     * @returns {Promise<Object>} Site configuration object
     */
    async getSiteConfig() {
        return this.getDocument('siteConfig', 'main');
    }

    /**
     * Submit contact form
     * @param {Object} formData - Contact form data
     * @returns {Promise<Object>} Submission result
     */
    async submitContactForm(formData) {
        try {
            const submission = {
                ...formData,
                timestamp: this.Timestamp.now(),
                status: 'new',
                source: 'portfolio_website'
            };

            const result = await this.db.collection('contactSubmissions').add(submission);
            
            // Log analytics event
            this.analytics.logEvent('contact_form_submission', {
                form_type: formData.projectType || 'general'
            });

            return { success: true, id: result.id };
        } catch (error) {
            console.error('Error submitting contact form:', error);
            throw error;
        }
    }

    /**
     * Increment project view count
     * @param {string} projectId - Project ID
     */
    async incrementProjectView(projectId) {
        try {
            await this.db.collection('projects').doc(projectId).update({
                viewCount: this.FieldValue.increment(1),
                lastViewed: this.Timestamp.now()
            });

            // Log analytics event
            this.analytics.logEvent('project_view', {
                project_id: projectId
            });
        } catch (error) {
            console.error('Error incrementing project view:', error);
        }
    }

    // ============== Storage Methods ==============

    /**
     * Get storage URL for a file
     * @param {string} path - Storage path
     * @returns {Promise<string>} Download URL
     */
    async getStorageUrl(path) {
        try {
            const ref = this.storage.ref(path);
            return await ref.getDownloadURL();
        } catch (error) {
            console.error(`Error getting storage URL for ${path}:`, error);
            return null;
        }
    }

    /**
     * Preload images for better performance
     * @param {Array<string>} paths - Array of storage paths
     * @returns {Promise<Array>} Array of URLs
     */
    async preloadImages(paths) {
        const urlPromises = paths.map(path => this.getStorageUrl(path));
        return Promise.all(urlPromises);
    }

    // ============== Analytics Methods ==============

    /**
     * Log a custom analytics event
     * @param {string} eventName - Event name
     * @param {Object} parameters - Event parameters
     */
    logEvent(eventName, parameters = {}) {
        this.analytics.logEvent(eventName, parameters);
    }

    /**
     * Set user properties for analytics
     * @param {Object} properties - User properties
     */
    setUserProperties(properties) {
        Object.entries(properties).forEach(([key, value]) => {
            this.analytics.setUserProperties({ [key]: value });
        });
    }

    /**
     * Log page view
     * @param {string} pageName - Page name
     * @param {string} pageUrl - Page URL
     */
    logPageView(pageName, pageUrl = window.location.pathname) {
        this.analytics.logEvent('page_view', {
            page_title: pageName,
            page_location: pageUrl,
            page_path: pageUrl
        });
    }

    // ============== Performance Methods ==============

    /**
     * Create a custom trace for performance monitoring
     * @param {string} traceName - Trace name
     * @returns {Object} Trace object
     */
    startTrace(traceName) {
        const trace = this.performance.trace(traceName);
        trace.start();
        return trace;
    }

    /**
     * Mark a performance measure
     * @param {string} measureName - Measure name
     * @param {number} value - Measure value
     */
    markPerformance(measureName, value) {
        const trace = this.performance.trace('custom_metrics');
        trace.start();
        trace.putMetric(measureName, value);
        trace.stop();
    }
}

// Create and export singleton instance
const firebaseService = new FirebaseService();

// Export for use in other modules
window.FirebaseService = firebaseService;

// Log initialization
console.log(`🔥 Firebase initialized in ${environment} mode`);

// Export for ES6 modules if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = firebaseService;
}