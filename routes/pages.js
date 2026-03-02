const express = require('express');
const router = express.Router();
const path = require('path');
const jwt = require('jsonwebtoken');
const { db } = require('../config/database');

// ===== MAIN WEBSITE PAGES =====

// Home page
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// About page
router.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/about.html'));
});

// Academics page
router.get('/academics', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/academics.html'));
});

// Facilities page (redirect to about page since facilities info is there)
router.get('/facilities', (req, res) => {
    res.redirect('/about');
});

// Events page
router.get('/events', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/events.html'));
});

// Gallery page
router.get('/gallery', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/gallery.html'));
});

// Blog page (redirect to events page since blog posts are shown there)
router.get('/blog', (req, res) => {
    res.redirect('/events');
});

// Contact page
router.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/contact.html'));
});

// Contact page
router.get('/downloads', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/downloads.html'));
});

// ===== ADMIN PANEL =====

    // Admin login page
    router.get('/admin/login', (req, res) => {
        res.sendFile(path.join(__dirname, '../public/admin/login.html'));
    });

    // Admin forgot password page
    router.get('/admin/forgot-password', (req, res) => {
        res.sendFile(path.join(__dirname, '../public/admin/forgot-password.html'));
    });

    // Admin reset password page
    router.get('/admin/reset-password', (req, res) => {
        res.sendFile(path.join(__dirname, '../public/admin/reset-password.html'));
    });

// Middleware to check admin authentication
const checkAdminAuth = async (req, res, next) => {
    console.log('🔍 SERVER: Admin auth middleware triggered for:', req.path);
    
    try {
        // Check for token in cookies or Authorization header
        let token = req.cookies.adminToken || req.headers.authorization?.split(' ')[1];
        console.log('🔑 SERVER: Token exists:', !!token);
        
        if (!token) {
            console.log('❌ SERVER: No token found, redirecting to login');
            return res.redirect('/admin/login?from=admin');
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        console.log('✅ SERVER: Token verified, user ID:', decoded.userId);
        
        // Check if user exists and is active
        const user = await db.users.findById(decoded.userId);
        
        console.log('👤 SERVER: User found:', !!user, 'Active:', user?.isActive, 'Role:', user?.role);
        
        if (!user || !user.isActive || user.role !== 'ADMIN') {
            console.log('❌ SERVER: User invalid or not admin, redirecting to login');
            return res.redirect('/admin/login?from=admin');
        }

        console.log('✅ SERVER: Authentication successful, proceeding');
        req.user = user;
        next();
    } catch (error) {
        console.error('💥 SERVER: Admin auth check error:', error);
        console.log('❌ SERVER: Auth error, redirecting to login');
        return res.redirect('/admin/login?from=admin');
    }
};

// Admin panel main page - requires authentication
router.get('/admin', checkAdminAuth, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/admin/index.html'));
});

// Admin panel main page with trailing slash - requires authentication
router.get('/admin/', checkAdminAuth, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/admin/index.html'));
});

// Admin dashboard
router.get('/admin/dashboard', checkAdminAuth, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/admin/index.html'));
});

// Admin users management
router.get('/admin/users', checkAdminAuth, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/admin/index.html'));
});

// Admin events management
router.get('/admin/events', checkAdminAuth, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/admin/index.html'));
});

// Admin blog management
router.get('/admin/blog', checkAdminAuth, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/admin/index.html'));
});

// Admin gallery management
router.get('/admin/gallery', checkAdminAuth, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/admin/index.html'));
});

// Admin settings
router.get('/admin/settings', checkAdminAuth, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/admin/index.html'));
});

// ===== API DOCUMENTATION =====

// API documentation page
router.get('/api-docs', (req, res) => {
    res.json({
        message: 'Marigold School API Documentation',
        version: '1.0.0',
        baseUrl: '/api',
        endpoints: {
            auth: {
                'POST /auth/login': 'User login',
                'POST /auth/register': 'User registration',
                'GET /auth/me': 'Get current user',
                'POST /auth/change-password': 'Change password'
            },
            events: {
                'GET /events': 'Get all events',
                'GET /events/:slug': 'Get single event',
                'POST /events': 'Create event (Admin)',
                'PUT /events/:id': 'Update event (Admin)',
                'DELETE /events/:id': 'Delete event (Admin)'
            },
            blog: {
                'GET /blog': 'Get all blog posts',
                'GET /blog/:slug': 'Get single blog post',
                'POST /blog': 'Create blog post (Admin)',
                'PUT /blog/:id': 'Update blog post (Admin)',
                'DELETE /blog/:id': 'Delete blog post (Admin)'
            },
            gallery: {
                'GET /gallery': 'Get all galleries',
                'GET /gallery/:slug': 'Get single gallery',
                'POST /gallery': 'Create gallery (Admin)',
                'PUT /gallery/:id': 'Update gallery (Admin)',
                'DELETE /gallery/:id': 'Delete gallery (Admin)'
            },
            contact: {
                'POST /contact': 'Submit contact form'
            },
            admin: {
                'GET /admin/dashboard': 'Get dashboard stats',
                'GET /admin/users': 'Get all users',
                'GET /admin/events': 'Get all events (admin view)',
                'GET /admin/blog': 'Get all blog posts (admin view)',
                'GET /admin/gallery': 'Get all galleries (admin view)',
            },
            cache: {
                'GET /cache/stats': 'Get cache statistics (Admin)',
                'DELETE /cache/clear': 'Clear cache (Admin)'
            }
        },
        authentication: {
            type: 'JWT Bearer Token',
            header: 'Authorization: Bearer <token>'
        },
        caching: {
            enabled: process.env.REDIS_CACHE_ENABLED === 'true',
            ttl: process.env.REDIS_TTL || 3600,
            description: 'API responses are cached for performance. Cache is automatically invalidated when data is modified.'
        }
    });
});

// ===== HEALTH CHECK =====

// Health check endpoint
router.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        version: '1.0.0'
    });
});

// ===== 404 HANDLER =====

// Catch all other routes and return 404 (excluding static files)
router.get('*', (req, res) => {
    // Skip static file requests - let them be handled by express.static middleware
    if (req.path.match(/\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|pdf)$/)) {
        return res.status(404).send('File not found');
    }
    
    res.status(404).json({ 
        error: 'Page not found',
        message: 'The requested page does not exist.',
        availableRoutes: [
            '/',
            '/about',
            '/academics', 
            '/facilities',
            '/events',
            '/gallery',
            '/blog',
            '/contact',
            '/admin',
            '/api-docs',
            '/health'
        ]
    });
});

module.exports = router;
