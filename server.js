const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config();

// Import Redis configuration
const { connectRedis, sessionConfig } = require('./config/redis');

// Import Database configuration
const { testConnection } = require('./config/database');

// Import Cloudinary configuration
const { testCloudinaryConnection } = require('./config/cloudinary');

// Import cache middleware
const { cacheMiddleware, invalidateCache, getCacheStats } = require('./middleware/cache');

const app = express();
const PORT = process.env.PORT || 3000;

// Import routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin-simple');
const apiRoutes = require('./routes/api');
const contentRoutes = require('./routes/content');
const pageRoutes = require('./routes/pages');
const {uploadRoutes} = require('./routes/upload');
const admissionRoutes = require('./routes/admission');
const adminUsersRoutes = require('./routes/admin-users');
const sitemapRoutes = require('./routes/sitemap');
const seoPagesRoutes = require('./routes/seo-pages');
const downloadsRoutes = require('./routes/downloads.router')

// Import middleware
const { authenticateToken } = require('./middleware/auth');
const { errorHandler } = require('./middleware/errorHandler');
const { performanceMiddleware } = require('./middleware/performance');


// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://unboxicons.com", "https://embed.tawk.to", "https://*.tawk.to", "https://cdn.jsdelivr.net", "https://cdnjs.cloudflare.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com", "https://unboxicons.com", "https://embed.tawk.to", "https://*.tawk.to"],
            imgSrc: ["'self'", "data:", "https:", "blob:"],
            mediaSrc: ["'self'", "blob:", "https:"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com", "https://unpkg.com", "https://cdn.jsdelivr.net", "https://embed.tawk.to", "https://*.tawk.to", "https://upload-widget.cloudinary.com"],
            scriptSrcAttr: ["'unsafe-inline'"],
            connectSrc: ["'self'", "https://embed.tawk.to", "https://*.tawk.to", "wss://*.tawk.to", "https://unpkg.com", "https://cdnjs.cloudflare.com", "https://cdn.jsdelivr.net", "https://api.cloudinary.com", "https://res.cloudinary.com"],
            frameSrc: ["'self'", "https://embed.tawk.to", "https://*.tawk.to", "https://tawk.to", "https://www.google.com", "https://maps.google.com"]
        }
    }
}));

// Rate limiting
app.use('/api/', rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // limit each IP to 1000 requests per windowMs (increased for development)
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
}));

// More lenient rate limiting for auth endpoints
app.use('/api/auth/', rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Increased limit for auth requests per windowMs
    message: {
        success: false,
        message: 'Too many authentication attempts from this IP, please try again later.',
        rateLimited: true,
        retryAfter: '15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
}));

// Middleware
app.use(cors());
app.use(cookieParser());
app.use(express.json({ limit: '200mb' })); // Increased for large video uploads
app.use(express.urlencoded({ extended: true, limit: '200mb' }));

// Performance middleware (includes compression)
app.use(performanceMiddleware());

// Session middleware (Redis-based)
app.use(session(sessionConfig));


// Database connection
testConnection().then(connected => {
    if (connected) {
    } else {
    }
});

// Connect to Redis
connectRedis().then(connected => {
    if (connected) {
    } else {
    }
});

// Test Cloudinary connection
testCloudinaryConnection().then(connected => {
    if (connected) {
    } else {
    }
});

// Cache statistics endpoint (admin only)
app.get('/api/cache/stats', authenticateToken, async (req, res) => {
    try {
        const stats = await getCacheStats();
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get cache statistics' });
    }
});

// Clear cache endpoint (admin only)
app.delete('/api/cache/clear', authenticateToken, async (req, res) => {
    try {
        const { clearCacheByPattern } = require('./middleware/cache');
        const pattern = req.query.pattern || '*';
        await clearCacheByPattern(pattern);
        res.json({ message: `Cache cleared for pattern: ${pattern}` });
    } catch (error) {
        res.status(500).json({ error: 'Failed to clear cache' });
    }
});

// Cache control middleware for static assets
app.use((req, res, next) => {
    // Skip admin HTML pages - let routes handle them
    if (req.path.startsWith('/admin/') && (req.path.endsWith('.html') || req.path === '/admin' || req.path === '/admin/')) {
        return next();
    }

    // Set cache headers based on file type
    const ext = path.extname(req.path).toLowerCase();

    // Long-term caching for immutable assets (1 year)
    if (['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.ico', '.woff', '.woff2', '.ttf', '.eot'].includes(ext)) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
    // Medium-term caching for scripts and styles (1 hour)
    else if (['.js', '.css'].includes(ext)) {
        res.setHeader('Cache-Control', 'public, max-age=3600, must-revalidate');
    }
    // Short-term caching for HTML (5 minutes)
    else if (ext === '.html') {
        res.setHeader('Cache-Control', 'public, max-age=300, must-revalidate');
    }
    // No cache for API and dynamic content
    else if (req.path.startsWith('/api/')) {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
    }

    // For all other files, use static middleware
    express.static(path.join(__dirname, 'public'))(req, res, next);
});

// Uploads with medium-term caching (1 day)
app.use('/uploads', (req, res, next) => {
    res.setHeader('Cache-Control', 'public, max-age=86400, must-revalidate');
    next();
}, express.static(path.join(__dirname, 'uploads')));

// API routes (must come before page routes to avoid wildcard conflicts)
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes); // Removed authenticateToken for admin dashboard access
app.use('/api/admin/users', adminUsersRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admission', admissionRoutes);
app.use('/api', apiRoutes);
app.use('/api/downloads', downloadsRoutes)

// SEO routes
app.use('/', sitemapRoutes);

// SEO-enhanced page routes (must come before static page routes)
app.use('/', seoPagesRoutes);

// Page routes (must come after static files and API routes)
app.use('/', pageRoutes);

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Start server
try {
    const server = app.listen(PORT, () => {
        console.log(`✅ Server running on port ${PORT}`);
    });
    // Increase server timeout for large video uploads (10 minutes)
    server.timeout = 600000; // 10 minutes
    server.keepAliveTimeout = 610000; // Slightly higher than timeout
    server.headersTimeout = 620000; // Slightly higher than keepAliveTimeout

    console.log('⏱️  Server timeouts configured: 10 minutes');
} catch (exception) {
    console.log("Error while running server in port: ", PORT)
}



module.exports = app;
