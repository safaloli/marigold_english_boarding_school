/**
 * Dynamic Favicon Loader
 * Loads and updates the website favicon from database settings
 */

(function() {
    'use strict';

    /**
     * Load and update favicon from school settings
     */
    async function loadFavicon() {
        try {
            // console.log('🔍 Loading dynamic favicon from settings...');
            
            const response = await fetch('/api/school-settings');
            if (!response.ok) {
                console.warn('Failed to load school settings for favicon');
                return;
            }
            
            const data = await response.json();
            
            if (data.success && data.siteFavicon) {
                // console.log('✅ Favicon URL found:', data.siteFavicon);
                updateFavicon(data.siteFavicon);
            } else {
                console.log('ℹ️ No custom favicon found in settings, using default');
            }
        } catch (error) {
            console.error('❌ Error loading favicon:', error);
            // Silently fail - keep default favicon
        }
    }

    /**
     * Update favicon link in the document head
     * @param {string} faviconUrl - URL of the favicon image
     */
    function updateFavicon(faviconUrl) {
        if (!faviconUrl) return;

        // Detect file type from URL
        const isSVG = faviconUrl.toLowerCase().includes('.svg');
        const isPNG = faviconUrl.toLowerCase().includes('.png');
        const isICO = faviconUrl.toLowerCase().includes('.ico');
        
        // Determine MIME type
        let mimeType = 'image/x-icon'; // default
        if (isSVG) {
            mimeType = 'image/svg+xml';
        } else if (isPNG) {
            mimeType = 'image/png';
        }

        // Remove existing favicon links
        const existingLinks = document.querySelectorAll('link[rel*="icon"]');
        existingLinks.forEach(link => link.remove());

        // Create and add new favicon link
        const link = document.createElement('link');
        link.rel = 'icon';
        link.type = mimeType;
        link.href = faviconUrl;
        
        document.head.appendChild(link);

        // For better browser support, also add shortcut icon
        const shortcutLink = document.createElement('link');
        shortcutLink.rel = 'shortcut icon';
        shortcutLink.type = mimeType;
        shortcutLink.href = faviconUrl;
        
        document.head.appendChild(shortcutLink);

        // For Apple devices
        if (isPNG || isSVG) {
            const appleLink = document.createElement('link');
            appleLink.rel = 'apple-touch-icon';
            appleLink.href = faviconUrl;
            document.head.appendChild(appleLink);
        }

        // console.log('✅ Favicon updated successfully');
        // console.log('   Type:', mimeType);
        // console.log('   URL:', faviconUrl);
    }

    /**
     * Preload favicon for faster loading
     * @param {string} faviconUrl - URL of the favicon image
     */
    function preloadFavicon(faviconUrl) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = faviconUrl;
        document.head.appendChild(link);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadFavicon);
    } else {
        // DOM is already loaded
        loadFavicon();
    }

    // Export for global access if needed
    window.FaviconLoader = {
        load: loadFavicon,
        update: updateFavicon
    };
})();

