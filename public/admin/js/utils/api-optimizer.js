/**
 * API Optimizer for Admin Pages
 * Provides optimized API calls with timeout protection and caching
 */
class APIOptimizer {
    constructor() {
        this.defaultTimeout = 8000; // 8 seconds
        this.cache = new Map();
        this.cacheTimeout = 300000; // 5 minutes
    }

    /**
     * Add cache-busting parameter to URL
     */
    addCacheBuster(url) {
        const separator = url.includes('?') ? '&' : '?';
        return `${url}${separator}_t=${Date.now()}`;
    }

    /**
     * Override global fetch to always add cache-busting
     */
    overrideGlobalFetch() {
        const originalFetch = window.fetch;
        window.fetch = (url, options = {}) => {
            // Add cache-busting to all URLs
            const cacheBustedUrl = this.addCacheBuster(url);
            
            // Add no-cache headers to all requests
            const defaultOptions = {
                ...options,
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0',
                    ...options.headers
                }
            };
            
            return originalFetch(cacheBustedUrl, defaultOptions);
        };
    }

    /**
     * Optimized fetch with timeout protection and no caching
     */
    async optimizedFetch(url, options = {}) {
        // Add cache-busting parameter to ensure fresh data
        const cacheBustedUrl = this.addCacheBuster(url);
        
        // No caching - always fetch fresh data

        try {
            // Use AbortController for timeout protection
            const controller = new AbortController();
            const timeoutId = setTimeout(() => {
                console.log('⏰ API call timed out for:', url);
                controller.abort();
            }, this.defaultTimeout);

            const defaultOptions = {
                headers: {
                    'Content-Type': 'application/json'
                },
                signal: controller.signal
            };

            const response = await fetch(cacheBustedUrl, { ...defaultOptions, ...options });
            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            // No caching - data is fresh

            console.log('✅ API call successful for:', url);
            return data;

        } catch (error) {
            if (error.name === 'AbortError') {
                console.log('⏰ API call timed out for:', url);
                throw new Error('Request timeout - please try again');
            } else {
                console.error('❌ API call failed for:', url, error);
                throw error;
            }
        }
    }

    /**
     * Optimized GET request
     */
    async get(url, options = {}) {
        return this.optimizedFetch(url, { method: 'GET', ...options });
    }

    /**
     * Optimized POST request
     */
    async post(url, data, options = {}) {
        return this.optimizedFetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            ...options
        });
    }

    /**
     * Optimized PUT request
     */
    async put(url, data, options = {}) {
        return this.optimizedFetch(url, {
            method: 'PUT',
            body: JSON.stringify(data),
            ...options
        });
    }

    /**
     * Optimized DELETE request
     */
    async delete(url, options = {}) {
        return this.optimizedFetch(url, { method: 'DELETE', ...options });
    }

    /**
     * Clear cache
     */
    clearCache() {
        this.cache.clear();
        console.log('🗑️ API cache cleared');
    }

    /**
     * Get cache stats
     */
    getCacheStats() {
        return {
            size: this.cache.size,
            entries: Array.from(this.cache.keys())
        };
    }
}

// Create global instance
window.apiOptimizer = new APIOptimizer();

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = APIOptimizer;
}
