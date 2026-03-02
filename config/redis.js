const redis = require('redis');
const session = require('express-session');
const RedisStore = require('connect-redis').default;

// Check if Redis is enabled
const isRedisEnabled = process.env.REDIS_CACHE_ENABLED !== 'false';

// Redis client configuration
const redisClient = redis.createClient({
    url: process.env.REDIS_URL || `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`,
    password: process.env.REDIS_PASSWORD || undefined,
    database: parseInt(process.env.REDIS_DB) || 0,
    retry_strategy: (options) => {
        if (options.error && options.error.code === 'ECONNREFUSED') {
            console.error('Redis server refused connection');
            return new Error('Redis server refused connection');
        }
        if (options.total_retry_time > 1000 * 60 * 60) {
            return new Error('Retry time exhausted');
        }
        if (options.attempt > 10) {
            return undefined;
        }
        return Math.min(options.attempt * 100, 3000);
    }
});

// Fallback session configuration (when Redis is not available)
const fallbackSessionConfig = {
    secret: process.env.SESSION_SECRET || 'gyan-jyoti-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: parseInt(process.env.REDIS_SESSION_TTL) || 86400 * 1000 // 24 hours
    }
};

// Redis session store configuration
let redisStore = null;
let sessionConfig = fallbackSessionConfig;

// Connect to Redis
const connectRedis = async () => {
    if (!isRedisEnabled) {
        console.log('⚠️  Redis caching is disabled');
        return false;
    }

    try {
        await redisClient.connect();
        console.log('✅ Connected to Redis');
        
        // Test the connection
        await redisClient.ping();
        console.log('✅ Redis ping successful');
        
        // Initialize Redis store
        redisStore = new RedisStore({
            client: redisClient,
            prefix: 'sess:',
            ttl: parseInt(process.env.REDIS_SESSION_TTL) || 86400 // 24 hours
        });

        // Update session config to use Redis
        sessionConfig = {
            store: redisStore,
            secret: process.env.SESSION_SECRET || 'gyan-jyoti-secret-key',
            resave: false,
            saveUninitialized: false,
            cookie: {
                secure: process.env.NODE_ENV === 'production',
                httpOnly: true,
                maxAge: parseInt(process.env.REDIS_SESSION_TTL) || 86400 * 1000 // 24 hours
            }
        };
        
        return true;
    } catch (error) {
        console.error('❌ Redis connection failed:', error.message);
        console.log('⚠️  Continuing without Redis caching...');
        console.log('💡 To enable Redis:');
        console.log('   1. Install Redis server');
        console.log('   2. Start Redis service');
        console.log('   3. Set REDIS_CACHE_ENABLED=true in your .env file');
        return false;
    }
};

// Graceful shutdown
const disconnectRedis = async () => {
    try {
        if (redisClient.isOpen) {
            await redisClient.quit();
            console.log('✅ Redis disconnected gracefully');
        }
    } catch (error) {
        console.error('❌ Error disconnecting Redis:', error.message);
    }
};

// Handle process termination
process.on('SIGINT', disconnectRedis);
process.on('SIGTERM', disconnectRedis);

module.exports = {
    redisClient,
    redisStore,
    sessionConfig,
    connectRedis,
    disconnectRedis,
    isRedisEnabled
};
