/**
 * Cache Manager - Intelligent caching for API responses
 * Reduces server load and improves page load performance
 */

class CacheManager {
    constructor() {
        this.CACHE_VERSION = '1.0.1'; // Increment to invalidate old caches
        this.CACHE_PREFIX = 'gjef_cache_';
        this.SHORT_TTL = 2 * 60 * 1000; // 2 minutes - for frequently updated content
        this.DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes
        this.LONG_TTL = 30 * 60 * 1000; // 30 minutes (reduced from 1 hour)
        
        // Cache TTL configuration by endpoint
        this.cacheTTL = {
            // Frequently updated content - SHORT cache
            '/api/content/events': this.SHORT_TTL,
            '/api/content/notices': this.SHORT_TTL,
            '/api/content/announcements': this.SHORT_TTL,
            '/api/content/events-content': this.SHORT_TTL,
            
            // Static content - LONG cache
            '/api/content/home': this.LONG_TTL,
            '/api/content/about': this.LONG_TTL,
            '/api/content/gallery': this.LONG_TTL,
            
            // Default
            'default': this.DEFAULT_TTL
        };
        
        // Check global cache version and clear if changed
        this.checkGlobalVersion();
        
        this.cleanupOldCaches();
    }
    
    /**
     * Check global cache version (set by admin panel)
     * If version changed, clear all cache
     */
    checkGlobalVersion() {
        try {
            const globalVersion = localStorage.getItem('gjef_global_cache_version');
            const lastKnownVersion = localStorage.getItem('gjef_last_known_version');
            
            if (globalVersion && lastKnownVersion && globalVersion !== lastKnownVersion) {
                console.log(`🔄 Global cache version changed: ${lastKnownVersion} → ${globalVersion}`);
                console.log('🗑️  Clearing all cache due to version change...');
                
                // Clear all cache
                this.clearAll();
                
                // Update last known version
                localStorage.setItem('gjef_last_known_version', globalVersion);
                
                console.log('✅ Cache cleared successfully!');
            } else if (globalVersion && !lastKnownVersion) {
                // First time - just store the version
                localStorage.setItem('gjef_last_known_version', globalVersion);
            }
        } catch (error) {
            console.error('Global version check error:', error);
        }
    }
    
    /**
     * Get cache key for an endpoint
     */
    getCacheKey(endpoint) {
        // Remove query parameters for cache key
        const cleanEndpoint = endpoint.split('?')[0];
        return `${this.CACHE_PREFIX}${cleanEndpoint}`;
    }
    
    /**
     * Get TTL for a specific endpoint
     */
    getTTL(endpoint) {
        const cleanEndpoint = endpoint.split('?')[0];
        return this.cacheTTL[cleanEndpoint] || this.cacheTTL['default'];
    }
    
    /**
     * Check if cached data is still valid
     */
    isValid(cacheData) {
        if (!cacheData || !cacheData.timestamp || !cacheData.data) {
            return false;
        }
        
        const now = Date.now();
        const age = now - cacheData.timestamp;
        const ttl = cacheData.ttl || this.DEFAULT_TTL;
        
        return age < ttl;
    }
    
    /**
     * Get cached data if valid
     */
    get(endpoint) {
        try {
            const cacheKey = this.getCacheKey(endpoint);
            const cachedString = localStorage.getItem(cacheKey);
            
            if (!cachedString) {
                return null;
            }
            
            const cacheData = JSON.parse(cachedString);
            
            if (this.isValid(cacheData)) {
                console.log(`✅ Cache HIT: ${endpoint} (age: ${Math.round((Date.now() - cacheData.timestamp) / 1000)}s)`);
                return cacheData.data;
            } else {
                console.log(`❌ Cache EXPIRED: ${endpoint}`);
                this.remove(endpoint);
                return null;
            }
        } catch (error) {
            console.error('Cache get error:', error);
            return null;
        }
    }
    
    /**
     * Set cached data
     */
    set(endpoint, data) {
        try {
            const cacheKey = this.getCacheKey(endpoint);
            const ttl = this.getTTL(endpoint);
            
            const cacheData = {
                version: this.CACHE_VERSION,
                timestamp: Date.now(),
                ttl: ttl,
                data: data
            };
            
            localStorage.setItem(cacheKey, JSON.stringify(cacheData));
            console.log(`💾 Cached: ${endpoint} (TTL: ${ttl / 1000}s)`);
            
            return true;
        } catch (error) {
            // Handle quota exceeded error
            if (error.name === 'QuotaExceededError') {
                console.warn('Cache quota exceeded, clearing old caches...');
                this.cleanupOldCaches();
                
                // Try one more time after cleanup
                try {
                    localStorage.setItem(cacheKey, JSON.stringify(cacheData));
                    return true;
                } catch (retryError) {
                    console.error('Cache set failed after cleanup:', retryError);
                    return false;
                }
            }
            
            console.error('Cache set error:', error);
            return false;
        }
    }
    
    /**
     * Remove cached data
     */
    remove(endpoint) {
        try {
            const cacheKey = this.getCacheKey(endpoint);
            localStorage.removeItem(cacheKey);
            return true;
        } catch (error) {
            console.error('Cache remove error:', error);
            return false;
        }
    }
    
    /**
     * Clear all caches for this app
     */
    clearAll() {
        try {
            const keys = Object.keys(localStorage);
            let cleared = 0;
            
            keys.forEach(key => {
                if (key.startsWith(this.CACHE_PREFIX)) {
                    localStorage.removeItem(key);
                    cleared++;
                }
            });
            
            console.log(`🗑️  Cleared ${cleared} cache entries`);
            return true;
        } catch (error) {
            console.error('Cache clear error:', error);
            return false;
        }
    }
    
    /**
     * Clean up old/expired caches
     */
    cleanupOldCaches() {
        try {
            const keys = Object.keys(localStorage);
            let removed = 0;
            
            keys.forEach(key => {
                if (key.startsWith(this.CACHE_PREFIX)) {
                    try {
                        const cacheData = JSON.parse(localStorage.getItem(key));
                        
                        // Remove if expired or wrong version
                        if (!this.isValid(cacheData) || cacheData.version !== this.CACHE_VERSION) {
                            localStorage.removeItem(key);
                            removed++;
                        }
                    } catch (error) {
                        // Remove corrupted cache entries
                        localStorage.removeItem(key);
                        removed++;
                    }
                }
            });
            
            if (removed > 0) {
                console.log(`🧹 Cleaned up ${removed} old cache entries`);
            }
        } catch (error) {
            console.error('Cache cleanup error:', error);
        }
    }
    
    /**
     * Fetch with cache
     * This is the main method to use for API calls
     */
    async fetch(endpoint, options = {}) {
        const {
            forceRefresh = false,
            useCache = true,
            ...fetchOptions
        } = options;
        
        // Check cache first (unless force refresh)
        if (useCache && !forceRefresh) {
            const cachedData = this.get(endpoint);
            if (cachedData !== null) {
                return cachedData;
            }
        }
        
        // Fetch from server
        try {
            console.log(`🌐 Fetching: ${endpoint}`);
            
            const response = await fetch(endpoint, {
                ...fetchOptions,
                headers: {
                    'Content-Type': 'application/json',
                    ...fetchOptions.headers
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Check if server sent cache-invalidation signal
            const cacheControl = response.headers.get('X-Cache-Invalidate');
            if (cacheControl) {
                console.log('🔄 Server requested cache invalidation');
                this.clearAll();
            }
            
            // Check data version and invalidate if changed
            if (data._version) {
                const cachedVersion = this.getVersion(endpoint);
                if (cachedVersion && cachedVersion !== data._version) {
                    console.log(`🔄 Version changed for ${endpoint}, invalidating cache`);
                    this.remove(endpoint);
                }
                this.setVersion(endpoint, data._version);
            }
            
            // Cache the response
            if (useCache) {
                this.set(endpoint, data);
            }
            
            return data;
        } catch (error) {
            console.error(`Fetch error for ${endpoint}:`, error);
            
            // Try to return stale cache as fallback
            const staleCache = this.getStale(endpoint);
            if (staleCache) {
                console.warn(`⚠️  Using stale cache for ${endpoint}`);
                return staleCache;
            }
            
            throw error;
        }
    }
    
    /**
     * Get version for an endpoint
     */
    getVersion(endpoint) {
        try {
            const versionKey = `${this.CACHE_PREFIX}version_${endpoint}`;
            return localStorage.getItem(versionKey);
        } catch (error) {
            return null;
        }
    }
    
    /**
     * Set version for an endpoint
     */
    setVersion(endpoint, version) {
        try {
            const versionKey = `${this.CACHE_PREFIX}version_${endpoint}`;
            localStorage.setItem(versionKey, version);
        } catch (error) {
            console.error('Version set error:', error);
        }
    }
    
    /**
     * Get stale cache (even if expired) as fallback
     */
    getStale(endpoint) {
        try {
            const cacheKey = this.getCacheKey(endpoint);
            const cachedString = localStorage.getItem(cacheKey);
            
            if (!cachedString) {
                return null;
            }
            
            const cacheData = JSON.parse(cachedString);
            return cacheData.data || null;
        } catch (error) {
            return null;
        }
    }
    
    /**
     * Prefetch and cache an endpoint
     */
    async prefetch(endpoint) {
        try {
            // Only prefetch if not already cached
            if (!this.get(endpoint)) {
                await this.fetch(endpoint);
            }
        } catch (error) {
            console.warn(`Prefetch failed for ${endpoint}:`, error);
        }
    }
    
    /**
     * Get cache stats
     */
    getStats() {
        try {
            const keys = Object.keys(localStorage);
            const cacheKeys = keys.filter(key => key.startsWith(this.CACHE_PREFIX));
            
            let totalSize = 0;
            let validCount = 0;
            let expiredCount = 0;
            
            cacheKeys.forEach(key => {
                const value = localStorage.getItem(key);
                totalSize += value.length;
                
                try {
                    const cacheData = JSON.parse(value);
                    if (this.isValid(cacheData)) {
                        validCount++;
                    } else {
                        expiredCount++;
                    }
                } catch (error) {
                    expiredCount++;
                }
            });
            
            return {
                total: cacheKeys.length,
                valid: validCount,
                expired: expiredCount,
                size: `${Math.round(totalSize / 1024)} KB`
            };
        } catch (error) {
            console.error('Stats error:', error);
            return null;
        }
    }
}

// Create global instance
window.cacheManager = new CacheManager();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CacheManager;
}
