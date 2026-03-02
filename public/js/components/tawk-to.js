/**
 * Tawk.to Live Chat Widget Component
 * 
 * A reusable component for loading Tawk.to chat widget on any page.
 * 
 * Configuration:
 * - Property ID: 690456b2b3b5b4194fc4af4a
 * - Widget ID: 1j8sf5b7n
 * 
 * Usage:
 * - Include this script on any page before </body>
 * - The widget will automatically load
 * 
 * Advanced Usage:
 * - Access Tawk_API globally for customizations
 * - Use Tawk_API.hideWidget() to hide widget
 * - Use Tawk_API.showWidget() to show widget
 * - Use Tawk_API.setAttributes() to set visitor info
 */

(function() {
    'use strict';

    // Tawk.to Configuration
    const TAWK_PROPERTY_ID = '69a5384f53ed371c3a3bd392';
    const TAWK_WIDGET_ID = '1jimm7tum';
    const TAWK_EMBED_URL = `https://embed.tawk.to/${TAWK_PROPERTY_ID}/${TAWK_WIDGET_ID}`;

    // Initialize Tawk.to API object
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();

    /**
     * Load Tawk.to chat widget
     */
    function loadTawkTo() {
        // Check if already loaded
        if (document.getElementById('tawk-script')) {
            console.log('Tawk.to widget already loaded');
            return;
        }

        // Create script element
        const script = document.createElement('script');
        script.id = 'tawk-script';
        script.async = true;
        script.src = TAWK_EMBED_URL;
        script.charset = 'UTF-8';
        script.setAttribute('crossorigin', '*');

        // Insert script before first existing script tag
        const firstScript = document.getElementsByTagName('script')[0];
        if (firstScript && firstScript.parentNode) {
            firstScript.parentNode.insertBefore(script, firstScript);
        } else {
            // Fallback: append to body or head
            (document.body || document.head).appendChild(script);
        }

        // Optional: Add event handlers
        window.Tawk_API.onLoad = function() {
            console.log('Tawk.to chat widget loaded successfully');
        };

        window.Tawk_API.onChatStarted = function() {
            console.log('Chat started');
            // You can add analytics tracking here if needed
        };

        window.Tawk_API.onChatEnded = function() {
            console.log('Chat ended');
        };

        window.Tawk_API.onMinimized = function() {
            console.log('Chat widget minimized');
        };

        window.Tawk_API.onMaximized = function() {
            console.log('Chat widget maximized');
        };
    }

    /**
     * Initialize Tawk.to when DOM is ready
     */
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', loadTawkTo);
        } else {
            // DOM already loaded
            loadTawkTo();
        }
    }

    // Start initialization
    init();

    // Export for external access if needed
    window.TawkToLoader = {
        load: loadTawkTo,
        propertyId: TAWK_PROPERTY_ID,
        widgetId: TAWK_WIDGET_ID
    };

})();

