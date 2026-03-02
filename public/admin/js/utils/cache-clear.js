/**
 * Cache Clear Utility for Admin Panel
 * Allows admins to clear client-side cache after updating content
 */

class AdminCacheClear {
    constructor() {
        this.init();
    }
    
    init() {
        // Setup click handler for cache clear button
        this.setupCacheClearButton();
    }
    
    /**
     * Setup cache clear button click handler
     */
    setupCacheClearButton() {
        const button = document.getElementById('admin-cache-clear-btn');
        
        if (!button) {
            console.warn('Cache clear button not found');
            return;
        }
        
        button.addEventListener('click', () => this.clearCache());
        
        // Initialize Lucide icons if available
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
    
    /**
     * Clear client-side cache
     */
    async clearCache() {
        const button = document.getElementById('admin-cache-clear-btn');
        
        if (button) {
            button.disabled = true;
            button.innerHTML = '<i data-lucide="loader"></i> Clearing...';
            
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }
        
        try {
            // 1. Increment global cache version to invalidate all client caches
            const currentVersion = localStorage.getItem('gjef_global_cache_version') || '0';
            const newVersion = (parseInt(currentVersion) + 1).toString();
            localStorage.setItem('gjef_global_cache_version', newVersion);
            
            console.log(`🔄 Cache version updated: ${currentVersion} → ${newVersion}`);
            
            // 2. Clear cache in current browser (admin panel)
            this.clearLocalCache();
            
            // 3. Notify server (for any server-side cache)
            try {
                const response = await fetch('/api/cache/clear-client', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ version: newVersion })
                });
                
                const data = await response.json();
                
                if (!data.success) {
                    console.warn('Server cache clear warning:', data.error);
                }
            } catch (apiError) {
                console.warn('Server cache clear skipped:', apiError.message);
            }
            
            this.showNotification('✅ Client cache cleared! Public pages will load fresh data on next visit.', 'success');
            
        } catch (error) {
            console.error('Cache clear error:', error);
            this.showNotification('❌ Failed to clear cache: ' + error.message, 'error');
        } finally {
            if (button) {
                button.disabled = false;
                button.innerHTML = '<i data-lucide="trash-2"></i> Clear Client Cache';
                
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
            }
        }
    }
    
    /**
     * Clear cache in current browser
     */
    clearLocalCache() {
        try {
            // Clear all gjef_cache_ items
            const keys = Object.keys(localStorage);
            let cleared = 0;
            
            keys.forEach(key => {
                if (key.startsWith('gjef_cache_')) {
                    localStorage.removeItem(key);
                    cleared++;
                }
            });
            
            console.log(`🗑️  Cleared ${cleared} cache entries from localStorage`);
            return cleared;
        } catch (error) {
            console.error('Local cache clear error:', error);
            return 0;
        }
    }
    
    /**
     * Show notification
     */
    showNotification(message, type = 'info') {
        // Try to use existing notification system
        if (typeof showNotification === 'function') {
            showNotification(message, type);
            return;
        }
        
        // Fallback to simple alert
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            info: '#3b82f6'
        };
        
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors[type] || colors.info};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            z-index: 10000;
            max-width: 400px;
            animation: slideIn 0.3s ease-out;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.adminCacheClear = new AdminCacheClear();
    });
} else {
    window.adminCacheClear = new AdminCacheClear();
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    #admin-cache-clear-btn {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        white-space: nowrap;
    }
    
    #admin-cache-clear-btn i {
        width: 16px;
        height: 16px;
    }
`;
document.head.appendChild(style);

