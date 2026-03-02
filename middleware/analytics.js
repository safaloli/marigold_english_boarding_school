/**
 * Google Analytics 4 and Search Console Integration
 * Provides analytics tracking and search console verification
 */

// Google Analytics 4 tracking code
function generateGoogleAnalytics(measurementId) {
    if (!measurementId) return '';
    
    return `
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=${measurementId}"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${measurementId}', {
            page_title: document.title,
            page_location: window.location.href,
            custom_map: {
                'custom_parameter_1': 'school_section',
                'custom_parameter_2': 'content_type'
            }
        });
        
        // Track dynamic content loads
        function trackContentLoad(section, contentType) {
            gtag('event', 'content_load', {
                'school_section': section,
                'content_type': contentType,
                'page_title': document.title,
                'page_location': window.location.href
            });
        }
        
        // Track event interactions
        function trackEventInteraction(eventName, eventId) {
            gtag('event', 'event_interaction', {
                'event_name': eventName,
                'event_id': eventId,
                'page_title': document.title,
                'page_location': window.location.href
            });
        }
        
        // Track gallery interactions
        function trackGalleryInteraction(imageId, action) {
            gtag('event', 'gallery_interaction', {
                'image_id': imageId,
                'action': action,
                'page_title': document.title,
                'page_location': window.location.href
            });
        }
        
        // Track contact form submissions
        function trackContactSubmission(formType) {
            gtag('event', 'form_submission', {
                'form_type': formType,
                'page_title': document.title,
                'page_location': window.location.href
            });
        }
        
        // Track page views for dynamic content
        function trackDynamicPageView(pageType, contentId) {
            gtag('event', 'page_view', {
                'page_type': pageType,
                'content_id': contentId,
                'page_title': document.title,
                'page_location': window.location.href
            });
        }
    </script>`;
}

// Google Search Console verification
function generateSearchConsoleVerification(verificationCode) {
    if (!verificationCode) return '';
    
    return `<meta name="google-site-verification" content="${verificationCode}">`;
}

// Enhanced event tracking for dynamic content
function generateEventTracking() {
    return `
    <script>
        // Enhanced tracking for dynamic content
        document.addEventListener('DOMContentLoaded', function() {
            // Track homepage content loads
            if (typeof loadDynamicContent === 'function') {
                const originalLoadDynamicContent = loadDynamicContent;
                loadDynamicContent = async function() {
                    const result = await originalLoadDynamicContent();
                    if (typeof trackContentLoad === 'function') {
                        trackContentLoad('homepage', 'dynamic_content');
                    }
                    return result;
                };
            }
            
            // Track events page interactions
            if (window.location.pathname.includes('events')) {
                // Track event card clicks
                document.addEventListener('click', function(e) {
                    const eventCard = e.target.closest('.event-card, .notice-card');
                    if (eventCard) {
                        const eventId = eventCard.dataset.eventId || eventCard.id;
                        if (typeof trackEventInteraction === 'function') {
                            trackEventInteraction('event_card_click', eventId);
                        }
                    }
                });
            }
            
            // Track gallery interactions
            if (window.location.pathname.includes('gallery')) {
                document.addEventListener('click', function(e) {
                    const galleryItem = e.target.closest('.gallery-item, .gallery-card');
                    if (galleryItem) {
                        const imageId = galleryItem.dataset.imageId || galleryItem.id;
                        if (typeof trackGalleryInteraction === 'function') {
                            trackGalleryInteraction(imageId, 'click');
                        }
                    }
                });
            }
            
            // Track contact form submissions
            const contactForms = document.querySelectorAll('form[data-form-type]');
            contactForms.forEach(form => {
                form.addEventListener('submit', function(e) {
                    const formType = form.dataset.formType || 'contact';
                    if (typeof trackContactSubmission === 'function') {
                        trackContactSubmission(formType);
                    }
                });
            });
            
            // Track navigation clicks
            document.addEventListener('click', function(e) {
                const navLink = e.target.closest('a[href]');
                if (navLink && navLink.hostname === window.location.hostname) {
                    gtag('event', 'navigation_click', {
                        'link_url': navLink.href,
                        'link_text': navLink.textContent.trim(),
                        'page_title': document.title,
                        'page_location': window.location.href
                    });
                }
            });
            
            // Track scroll depth
            let maxScroll = 0;
            window.addEventListener('scroll', function() {
                const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
                if (scrollPercent > maxScroll && scrollPercent % 25 === 0) {
                    maxScroll = scrollPercent;
                    gtag('event', 'scroll_depth', {
                        'scroll_percent': scrollPercent,
                        'page_title': document.title,
                        'page_location': window.location.href
                    });
                }
            });
        });
    </script>`;
}

// Core Web Vitals tracking
function generateCoreWebVitals() {
    return `
    <script>
        // Core Web Vitals tracking
        function sendToGoogleAnalytics({name, delta, value, id}) {
            gtag('event', name, {
                event_category: 'Web Vitals',
                event_label: id,
                value: Math.round(name === 'CLS' ? delta * 1000 : delta),
                non_interaction: true,
            });
        }
        
        // Load web-vitals library
        import('https://unpkg.com/web-vitals@3/dist/web-vitals.js').then(({onCLS, onFID, onFCP, onLCP, onTTFB}) => {
            onCLS(sendToGoogleAnalytics);
            onFID(sendToGoogleAnalytics);
            onFCP(sendToGoogleAnalytics);
            onLCP(sendToGoogleAnalytics);
            onTTFB(sendToGoogleAnalytics);
        });
    </script>`;
}

// Generate complete analytics integration
function generateAnalyticsIntegration(options = {}) {
    const {
        googleAnalyticsId = process.env.GOOGLE_ANALYTICS_ID,
        searchConsoleVerification = process.env.GOOGLE_SEARCH_CONSOLE_VERIFICATION,
        enableCoreWebVitals = true,
        enableEventTracking = true
    } = options;
    
    let analyticsCode = '';
    
    if (googleAnalyticsId) {
        analyticsCode += generateGoogleAnalytics(googleAnalyticsId);
    }
    
    if (searchConsoleVerification) {
        analyticsCode += generateSearchConsoleVerification(searchConsoleVerification);
    }
    
    if (enableEventTracking) {
        analyticsCode += generateEventTracking();
    }
    
    if (enableCoreWebVitals && googleAnalyticsId) {
        analyticsCode += generateCoreWebVitals();
    }
    
    return analyticsCode;
}

module.exports = {
    generateGoogleAnalytics,
    generateSearchConsoleVerification,
    generateEventTracking,
    generateCoreWebVitals,
    generateAnalyticsIntegration
};
