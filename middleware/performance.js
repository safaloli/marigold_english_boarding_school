/**
 * Performance Optimization Middleware
 * Implements Core Web Vitals optimizations and performance enhancements
 */

const compression = require('compression');
const { performance } = require('perf_hooks');

/**
 * Performance monitoring middleware
 */
function performanceMonitoring(req, res, next) {
    const startTime = performance.now();
    
    // Add performance headers (only if not already sent)
    if (!res.headersSent) {
        res.set('X-Content-Type-Options', 'nosniff');
        res.set('X-Frame-Options', 'DENY');
        res.set('X-XSS-Protection', '1; mode=block');
        res.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    }
    
    // Override res.end to measure response time
    const originalEnd = res.end;
    res.end = function(chunk, encoding) {
        const endTime = performance.now();
        const responseTime = endTime - startTime;
        
        // Only set headers if they haven't been sent yet
        if (!res.headersSent) {
            try {
                res.set('X-Response-Time', `${responseTime.toFixed(2)}ms`);
                res.set('Server-Timing', `total;dur=${responseTime.toFixed(2)}`);
            } catch (error) {
                // Silently ignore header setting errors to prevent crashes
                console.warn('Warning: Could not set performance headers:', error.message);
            }
        }
        
        // Log slow requests
        if (responseTime > 1000) {
            console.warn(`🐌 Slow request: ${req.method} ${req.url} - ${responseTime.toFixed(2)}ms`);
        }
        
        originalEnd.call(this, chunk, encoding);
    };
    
    next();
}

/**
 * Resource hints middleware for critical resources
 */
function resourceHints(req, res, next) {
    // Add resource hints for better performance
    const hints = [
        'Link: </css/main.css>; rel=preload; as=style',
        'Link: </css/components.css>; rel=preload; as=style',
        'Link: </js/main.js>; rel=preload; as=script',
        'Link: <https://fonts.googleapis.com>; rel=dns-prefetch',
        'Link: <https://fonts.gstatic.com>; rel=dns-prefetch',
        'Link: <https://unpkg.com>; rel=dns-prefetch',
        'Link: <https://cdnjs.cloudflare.com>; rel=dns-prefetch'
    ];
    
    if (!res.headersSent) {
        hints.forEach(hint => {
            res.set('Link', hint);
        });
    }
    
    next();
}

/**
 * Cache control middleware
 */
function cacheControl(req, res, next) {
    // Only set cache headers if they haven't been sent yet
    if (!res.headersSent) {
        // Set appropriate cache headers based on content type
        if (req.url.match(/\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/)) {
            // Static assets - cache for 1 year
            res.set('Cache-Control', 'public, max-age=31536000, immutable');
        } else if (req.url.match(/\.html$/)) {
            // HTML pages - cache for 5 minutes
            res.set('Cache-Control', 'public, max-age=300');
        } else if (req.url.startsWith('/api/')) {
            // Admin API endpoints - no cache to ensure fresh data
            if (req.url.startsWith('/api/admin')) {
                res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
                res.set('Pragma', 'no-cache');
                res.set('Expires', '0');
            }
            // API endpoints - cache based on content type
            else if (req.url.includes('/api/events') || req.url.includes('/api/gallery')) {
                res.set('Cache-Control', 'public, max-age=300'); // 5 minutes
            } else {
                res.set('Cache-Control', 'public, max-age=60'); // 1 minute
            }
        }
    }
    
    next();
}

/**
 * Compression middleware with optimization
 */
function optimizedCompression() {
    return compression({
        level: 6, // Balanced compression level
        threshold: 1024, // Only compress files larger than 1KB
        filter: (req, res) => {
            // Don't compress if already compressed
            if (req.headers['x-no-compression']) {
                return false;
            }
            
            // Use compression for text-based content
            return compression.filter(req, res);
        }
    });
}

/**
 * Image optimization middleware
 */
function imageOptimization(req, res, next) {
    // Add image optimization headers (only if not already sent)
    if (!res.headersSent && req.url.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
        res.set('Vary', 'Accept');
        res.set('X-Image-Optimization', 'enabled');
        
        // Add WebP support header
        if (req.headers.accept && req.headers.accept.includes('image/webp')) {
            res.set('X-WebP-Support', 'true');
        }
    }
    
    next();
}

/**
 * Preload critical resources middleware
 */
function preloadCriticalResources(req, res, next) {
    if (req.url === '/' || req.url === '/index.html') {
        const criticalResources = [
            '/css/main.css',
            '/css/components.css',
            '/js/main.js',
            '/images/gyan-jyoti-school-building.jpg'
        ];
        
        const preloadLinks = criticalResources.map(resource => 
            `<${resource}>; rel=preload; as=${resource.includes('.css') ? 'style' : resource.includes('.js') ? 'script' : 'image'}`
        ).join(', ');
        
        if (preloadLinks && !res.headersSent) {
            res.set('Link', preloadLinks);
        }
    }
    
    next();
}

/**
 * Bundle all performance middleware
 */
function performanceMiddleware() {
    return [
        performanceMonitoring,
        resourceHints,
        cacheControl,
        optimizedCompression(),
        imageOptimization,
        preloadCriticalResources
    ];
}

/**
 * Generate performance optimization HTML
 */
function generatePerformanceHTML() {
    return `
    <!-- Performance optimization scripts -->
    <script>
        // Preload critical resources
        function preloadCriticalResources() {
            const criticalResources = [
                { href: '/css/main.css', as: 'style' },
                { href: '/css/components.css', as: 'style' },
                { href: '/js/main.js', as: 'script' }
            ];
            
            criticalResources.forEach(resource => {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.href = resource.href;
                link.as = resource.as;
                document.head.appendChild(link);
            });
        }
        
        // Lazy load non-critical resources
        function lazyLoadResources() {
            // Lazy load images
            const images = document.querySelectorAll('img[data-src]');
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => imageObserver.observe(img));
            
            // Lazy load CSS for non-critical sections
            const lazyCSS = document.querySelectorAll('link[data-href]');
            const cssObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const link = entry.target;
                        link.href = link.dataset.href;
                        link.removeAttribute('data-href');
                        observer.unobserve(link);
                    }
                });
            });
            
            lazyCSS.forEach(link => cssObserver.observe(link));
        }
        
        // Initialize performance optimizations
        document.addEventListener('DOMContentLoaded', function() {
            preloadCriticalResources();
            lazyLoadResources();
        });
        
        // Service Worker registration for caching
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                        console.log('ServiceWorker registration successful');
                    })
                    .catch(function(err) {
                        console.log('ServiceWorker registration failed');
                    });
            });
        }
    </script>
    `;
}

module.exports = {
    performanceMiddleware,
    performanceMonitoring,
    resourceHints,
    cacheControl,
    optimizedCompression,
    imageOptimization,
    preloadCriticalResources,
    generatePerformanceHTML
};
