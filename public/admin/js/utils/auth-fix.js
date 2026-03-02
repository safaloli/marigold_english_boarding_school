/**
 * Authentication Fix Utility
 * Fixes missing authentication tokens in admin API calls
 */
class AuthFix {
    constructor() {
        // Store the original fetch ONCE before any modifications
        this.originalFetch = window.fetch;
        this.init();
    }

    init() {
        // Set up the global interceptor first (it handles all API calls)
        this.addGlobalAuthInterceptor();
        
        // These are deprecated but kept for backwards compatibility
        this.fixAboutContentLoader();
    }

    /**
     * Fix authentication in aboutContentLoader.js
     * DEPRECATED - Now handled by global interceptor
     */
    fixAboutContentLoader() {
        // No longer needed - global interceptor handles all API calls
    }

    /**
     * Add global authentication interceptor
     */
    addGlobalAuthInterceptor() {
        const self = this;
        
        // Intercept all fetch calls to add auth token
        window.fetch = function(url, options = {}) {
            // Initialize options if not present
            if (!options) {
                options = {};
            }
            
            // Initialize headers if not present
            if (!options.headers) {
                options.headers = {};
            }
            
            // Convert Headers object to plain object if needed
            if (options.headers instanceof Headers) {
                const headerObj = {};
                options.headers.forEach((value, key) => {
                    headerObj[key] = value;
                });
                options.headers = headerObj;
            }
            
            // Add auth token to all API calls if not already present
            if (url.includes('/api/')) {
                const hasAuth = options.headers.Authorization || 
                               options.headers.authorization ||
                               (options.headers instanceof Headers && options.headers.has('Authorization'));
                
                if (!hasAuth) {
                const token = localStorage.getItem('adminToken');
                if (token) {
                        options.headers.Authorization = `Bearer ${token}`;
                        console.log('🔐 Auth token added to:', url);
                    } else {
                        console.error('❌ No adminToken found in localStorage for:', url);
                        console.error('Please log in to the admin panel');
                    }
                }
            }
            
            // Call the original fetch
            return self.originalFetch.call(window, url, options);
        };
        
        console.log('✅ Global authentication interceptor initialized');
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated() {
        const token = localStorage.getItem('adminToken');
        return !!token;
    }

    /**
     * Redirect to login if not authenticated
     */
    redirectToLogin() {
        if (!this.isAuthenticated()) {
            window.location.href = '/admin/login';
        }
    }
}

// Initialize immediately, before any other scripts load
// This ensures the fetch interceptor is ready before any API calls
    window.authFix = new AuthFix();

// Export for global access
window.AuthFix = AuthFix;
