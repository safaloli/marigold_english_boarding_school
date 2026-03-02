/**
 * Unified Notification System for Admin Panel
 * Provides consistent notification styling and behavior across all admin pages
 */
class NotificationManager {
    constructor() {
        this.notifications = [];
        this.container = null;
        this.init();
    }

    /**
     * Initialize notification system
     */
    init() {
        this.createContainer();
        this.addStyles();
    }

    /**
     * Create notification container
     */
    createContainer() {
        // Remove existing container if any
        const existingContainer = document.getElementById('notification-container');
        if (existingContainer) {
            existingContainer.remove();
        }

        // Create new container
        this.container = document.createElement('div');
        this.container.id = 'notification-container';
        this.container.className = 'notification-container';
        document.body.appendChild(this.container);
    }

    /**
     * Add notification styles
     */
    addStyles() {
        if (document.getElementById('notification-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification-container {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                display: flex;
                flex-direction: column;
                gap: 12px;
                pointer-events: none;
            }

            .notification {
                position: relative;
                max-width: 400px;
                min-width: 300px;
                background: white;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                border-left: 4px solid;
                pointer-events: auto;
                transform: translateX(100%);
                opacity: 0;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }

            .notification.show {
                transform: translateX(0);
                opacity: 1;
            }

            .notification.success {
                border-left-color: #10b981;
            }

            .notification.error {
                border-left-color: #ef4444;
            }

            .notification.warning {
                border-left-color: #f59e0b;
            }

            .notification.info {
                border-left-color: #3b82f6;
            }

            .notification-content {
                display: flex;
                align-items: flex-start;
                gap: 12px;
                padding: 16px;
            }

            .notification-icon {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                flex-shrink: 0;
                margin-top: 2px;
            }

            .notification.success .notification-icon {
                background-color: #10b981;
                color: white;
            }

            .notification.error .notification-icon {
                background-color: #ef4444;
                color: white;
            }

            .notification.warning .notification-icon {
                background-color: #f59e0b;
                color: white;
            }

            .notification.info .notification-icon {
                background-color: #3b82f6;
                color: white;
            }

            .notification-body {
                flex: 1;
                min-width: 0;
            }

            .notification-title {
                font-size: 14px;
                font-weight: 600;
                color: #111827;
                margin: 0 0 4px 0;
                line-height: 1.4;
            }

            .notification-message {
                font-size: 13px;
                color: #6b7280;
                margin: 0;
                line-height: 1.4;
            }

            .notification-close {
                position: absolute;
                top: 8px;
                right: 8px;
                background: none;
                border: none;
                color: #9ca3af;
                cursor: pointer;
                padding: 4px;
                border-radius: 4px;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 24px;
                height: 24px;
            }

            .notification-close:hover {
                background-color: #f3f4f6;
                color: #374151;
            }

            .notification-progress {
                position: absolute;
                bottom: 0;
                left: 0;
                height: 3px;
                background-color: currentColor;
                border-radius: 0 0 8px 8px;
                transition: width linear;
            }

            .notification.success .notification-progress {
                background-color: #10b981;
            }

            .notification.error .notification-progress {
                background-color: #ef4444;
            }

            .notification.warning .notification-progress {
                background-color: #f59e0b;
            }

            .notification.info .notification-progress {
                background-color: #3b82f6;
            }

            /* Animation keyframes */
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }

            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }

            /* Responsive design */
            @media (max-width: 480px) {
                .notification-container {
                    top: 10px;
                    right: 10px;
                    left: 10px;
                }

                .notification {
                    max-width: none;
                    min-width: auto;
                }
            }
        `;
        document.head.appendChild(styles);
    }

    /**
     * Show notification
     * @param {string} type - success, error, warning, info
     * @param {string} title - Notification title
     * @param {string} message - Notification message
     * @param {Object} options - Additional options
     */
    show(type, title, message, options = {}) {
        const {
            duration = 5000,
            closable = true,
            showProgress = true
        } = options;

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const iconMap = {
            success: '✓',
            error: '⚠',
            warning: '⚠',
            info: 'ℹ'
        };

        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-icon">
                    ${iconMap[type] || 'ℹ'}
                </div>
                <div class="notification-body">
                    <div class="notification-title">${title}</div>
                    <div class="notification-message">${message}</div>
                </div>
            </div>
            ${closable ? '<button class="notification-close" aria-label="Close">×</button>' : ''}
            ${showProgress ? '<div class="notification-progress"></div>' : ''}
        `;

        // Add to container
        this.container.appendChild(notification);

        // Trigger animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        // Auto remove after duration
        if (duration > 0) {
            setTimeout(() => {
                this.remove(notification);
            }, duration);
        }

        // Add close button functionality
        if (closable) {
            const closeBtn = notification.querySelector('.notification-close');
            closeBtn.addEventListener('click', () => {
                this.remove(notification);
            });
        }

        // Add progress bar animation
        if (showProgress && duration > 0) {
            const progress = notification.querySelector('.notification-progress');
            if (progress) {
                progress.style.width = '100%';
                progress.style.transitionDuration = `${duration}ms`;
            }
        }

        return notification;
    }

    /**
     * Show success notification
     */
    success(title, message, options = {}) {
        return this.show('success', title, message, options);
    }

    /**
     * Show error notification
     */
    error(title, message, options = {}) {
        return this.show('error', title, message, options);
    }

    /**
     * Show warning notification
     */
    warning(title, message, options = {}) {
        return this.show('warning', title, message, options);
    }

    /**
     * Show info notification
     */
    info(title, message, options = {}) {
        return this.show('info', title, message, options);
    }

    /**
     * Remove notification
     */
    remove(notification) {
        if (!notification || !notification.parentNode) return;

        notification.classList.remove('show');
        notification.classList.add('hide');

        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    /**
     * Clear all notifications
     */
    clear() {
        const notifications = this.container.querySelectorAll('.notification');
        notifications.forEach(notification => {
            this.remove(notification);
        });
    }
}

// Create global instance
window.NotificationManager = new NotificationManager();

// Create global showNotification function for backward compatibility
window.showNotification = function(title, message, type = 'info', options = {}) {
    if (window.NotificationManager) {
        return window.NotificationManager.show(type, title, message, options);
    } else {
        console.warn('NotificationManager not available, falling back to alert');
        alert(`${title}: ${message}`);
    }
};

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NotificationManager;
}
