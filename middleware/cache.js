const { redisClient, isRedisEnabled } = require('../config/redis');

// Cache configuration
const CACHE_TTL = parseInt(process.env.REDIS_TTL) || 3600; // 1 hour default
const CACHE_ENABLED = process.env.REDIS_CACHE_ENABLED !== 'false' && isRedisEnabled;

// In-memory cache fallback (when Redis is not available)
const memoryCache = new Map();

// Cache keys prefixes
const CACHE_PREFIXES = {
    API: 'api:',
    DB: 'db:',
    SESSION: 'session:',
    STATIC: 'static:',
    USER: 'user:',
    EVENT: 'event:',
    BLOG: 'blog:',
    GALLERY: 'gallery:',
    CONTACT: 'contact:',
    HOMEPAGE: 'homepage:',
    ABOUT_CONTENT: 'about:',
    SCHOOL_SETTINGS: 'school_settings:'
};

/**
 * Generate cache key with prefix
 */
const generateCacheKey = (prefix, identifier, params = {}) => {
    const paramString = Object.keys(params).length > 0 
        ? `:${JSON.stringify(params)}` 
        : '';
    return `${prefix}${identifier}${paramString}`;
};

/**
 * Set cache with TTL
 */
const setCache = async (key, data, ttl = CACHE_TTL) => {
    if (!CACHE_ENABLED) return false;
    
    try {
        const serializedData = JSON.stringify({
            data,
            timestamp: Date.now(),
            ttl
        });

        // Try Redis first
        if (redisClient.isReady) {
            await redisClient.setEx(key, ttl, serializedData);
            return true;
        }
        
        // Fallback to memory cache
        const expiryTime = Date.now() + (ttl * 1000);
        memoryCache.set(key, {
            data: serializedData,
            expiry: expiryTime
        });
        
        // Clean up expired entries
        setTimeout(() => {
            memoryCache.delete(key);
        }, ttl * 1000);
        
        return true;
    } catch (error) {
        console.error('Cache set error:', error.message);
        return false;
    }
};

/**
 * Get cache data
 */
const getCache = async (key) => {
    if (!CACHE_ENABLED) return null;
    
    try {
        // Try Redis first
        if (redisClient.isReady) {
            const cached = await redisClient.get(key);
            if (!cached) return null;
            
            const parsed = JSON.parse(cached);
            return parsed.data;
        }
        
        // Fallback to memory cache
        const cached = memoryCache.get(key);
        if (!cached) return null;
        
        // Check if expired
        if (Date.now() > cached.expiry) {
            memoryCache.delete(key);
            return null;
        }
        
        const parsed = JSON.parse(cached.data);
        return parsed.data;
    } catch (error) {
        console.error('Cache get error:', error.message);
        return null;
    }
};

/**
 * Delete cache by key
 */
const deleteCache = async (key) => {
    if (!CACHE_ENABLED) return false;
    
    try {
        // Try Redis first
        if (redisClient.isReady) {
            await redisClient.del(key);
            return true;
        }
        
        // Fallback to memory cache
        memoryCache.delete(key);
        return true;
    } catch (error) {
        console.error('Cache delete error:', error.message);
        return false;
    }
};

/**
 * Clear cache by pattern
 */
const clearCacheByPattern = async (pattern) => {
    if (!CACHE_ENABLED) return false;
    
    try {
        // Try Redis first
        if (redisClient.isReady) {
            const keys = await redisClient.keys(pattern);
            if (keys.length > 0) {
                await redisClient.del(keys);
            }
            return true;
        }
        
        // Fallback to memory cache (simple pattern matching)
        const regex = new RegExp(pattern.replace('*', '.*'));
        for (const key of memoryCache.keys()) {
            if (regex.test(key)) {
                memoryCache.delete(key);
            }
        }
        return true;
    } catch (error) {
        console.error('Cache clear pattern error:', error.message);
        return false;
    }
};

/**
 * Clear all cache
 */
const clearAllCache = async () => {
    if (!CACHE_ENABLED) return false;
    
    try {
        // Try Redis first
        if (redisClient.isReady) {
            await redisClient.flushDb();
            return true;
        }
        
        // Fallback to memory cache
        memoryCache.clear();
        return true;
    } catch (error) {
        console.error('Cache clear all error:', error.message);
        return false;
    }
};

/**
 * Cache middleware for API responses
 */
const cacheMiddleware = (prefix, ttl = CACHE_TTL) => {
    return async (req, res, next) => {
        if (!CACHE_ENABLED) {
            return next();
        }

        // Skip caching for non-GET requests
        if (req.method !== 'GET') {
            return next();
        }

        const cacheKey = generateCacheKey(prefix, req.originalUrl, req.query);
        
        try {
            const cachedData = await getCache(cacheKey);
            if (cachedData) {
                console.log(`📦 Cache hit: ${cacheKey}`);
                return res.json(cachedData);
            }
            
            // Store original send method
            const originalSend = res.json;
            
            // Override send method to cache response
            res.json = function(data) {
                setCache(cacheKey, data, ttl);
                console.log(`💾 Cache set: ${cacheKey}`);
                return originalSend.call(this, data);
            };
            
            next();
        } catch (error) {
            console.error('Cache middleware error:', error.message);
            next();
        }
    };
};

/**
 * Database query cache middleware
 */
const dbCacheMiddleware = (model, prefix, ttl = CACHE_TTL) => {
    return async (req, res, next) => {
        if (!CACHE_ENABLED) {
            return next();
        }

        const cacheKey = generateCacheKey(prefix, `${model.modelName}:${req.originalUrl}`, req.query);
        
        try {
            const cachedData = await getCache(cacheKey);
            if (cachedData) {
                console.log(`📦 DB Cache hit: ${cacheKey}`);
                return res.json(cachedData);
            }
            
            // Store original send method
            const originalSend = res.json;
            
            // Override send method to cache response
            res.json = function(data) {
                setCache(cacheKey, data, ttl);
                console.log(`💾 DB Cache set: ${cacheKey}`);
                return originalSend.call(this, data);
            };
            
            next();
        } catch (error) {
            console.error('DB Cache middleware error:', error.message);
            next();
        }
    };
};

/**
 * Invalidate cache when data changes
 */
const invalidateCache = (patterns = []) => {
    return async (req, res, next) => {
        try {
            // Invalidate specific patterns
            for (const pattern of patterns) {
                await clearCacheByPattern(pattern);
                console.log(`🗑️  Cache invalidated: ${pattern}`);
            }
            next();
        } catch (error) {
            console.error('Cache invalidation error:', error.message);
            next();
        }
    };
};

/**
 * Cache statistics
 */
const getCacheStats = async () => {
    if (!CACHE_ENABLED) {
        return { enabled: false, message: 'Cache disabled' };
    }
    
    try {
        // Try Redis first
        if (redisClient.isReady) {
            const info = await redisClient.info();
            const keys = await redisClient.dbSize();
            
            return {
                enabled: true,
                type: 'redis',
                keys,
                info: info.split('\r\n').reduce((acc, line) => {
                    const [key, value] = line.split(':');
                    if (key && value) acc[key] = value;
                    return acc;
                }, {})
            };
        }
        
        // Fallback to memory cache stats
        return {
            enabled: true,
            type: 'memory',
            keys: memoryCache.size,
            info: {
                'cache_type': 'memory',
                'cache_size': memoryCache.size
            }
        };
    } catch (error) {
        return { enabled: false, error: error.message };
    }
};

module.exports = {
    CACHE_PREFIXES,
    generateCacheKey,
    setCache,
    getCache,
    deleteCache,
    clearCacheByPattern,
    clearAllCache,
    cacheMiddleware,
    dbCacheMiddleware,
    invalidateCache,
    getCacheStats
};
