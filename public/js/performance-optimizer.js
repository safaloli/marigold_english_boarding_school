// ===== PERFORMANCE OPTIMIZER =====
// This script optimizes page loading performance

class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        this.optimizeImages();
        this.optimizeFonts();
        this.optimizeAnimations();
        this.setupIntersectionObserver();
    }

    // Optimize image loading
    optimizeImages() {
        // Add loading="lazy" to images that don't have it
        const images = document.querySelectorAll('img:not([loading])');
        images.forEach(img => {
            img.setAttribute('loading', 'lazy');
        });

        // Preload critical images
        const criticalImages = document.querySelectorAll('img[data-critical]');
        criticalImages.forEach(img => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = img.src;
            document.head.appendChild(link);
        });
    }

    // Optimize font loading
    optimizeFonts() {
        // Note: Font preloading has been removed because Google Fonts already 
        // handles font loading efficiently. Dynamic preloading can cause warnings
        // when the preloaded font URL doesn't exactly match what Google Fonts loads.
        // The preconnect links in HTML are sufficient for optimal font loading.
    }

    // Optimize animations for better performance
    optimizeAnimations() {
        // Reduce animations for users who prefer reduced motion
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.documentElement.style.setProperty('--animation-duration', '0.01ms');
            document.documentElement.style.setProperty('--animation-iteration-count', '1');
        }

        // Pause animations when page is not visible
        document.addEventListener('visibilitychange', () => {
            const animations = document.querySelectorAll('*');
            animations.forEach(el => {
                if (document.hidden) {
                    el.style.animationPlayState = 'paused';
                } else {
                    el.style.animationPlayState = 'running';
                }
            });
        });
    }

    // Setup intersection observer for lazy loading
    setupIntersectionObserver() {
        const observerOptions = {
            root: null,
            rootMargin: '50px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    
                    // Load images
                    if (element.tagName === 'IMG' && element.dataset.src) {
                        element.src = element.dataset.src;
                        element.removeAttribute('data-src');
                    }
                    
                    // Trigger animations
                    if (element.classList.contains('animate-on-scroll')) {
                        element.classList.add('animate-in');
                    }
                    
                    observer.unobserve(element);
                }
            });
        }, observerOptions);

        // Observe elements that need lazy loading
        document.querySelectorAll('img[data-src], .animate-on-scroll').forEach(el => {
            observer.observe(el);
        });
    }
}

// Initialize performance optimizer when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new PerformanceOptimizer();
});

// Export for global access
window.PerformanceOptimizer = PerformanceOptimizer;
