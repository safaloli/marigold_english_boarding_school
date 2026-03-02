/**
 * SaveButton Component
 * A reusable save button component with loading states and notifications
 */
if (typeof SaveButton === 'undefined') {
    class SaveButton {
    constructor(options = {}) {
        this.options = {
            buttonId: options.buttonId || 'saveBtn',
            buttonText: options.buttonText || 'Save Changes',
            loadingText: options.loadingText || 'Saving...',
            successText: options.successText || 'Saved Successfully',
            errorText: options.errorText || 'Save Failed',
            icon: options.icon || 'save',
            className: options.className || 'btn btn-primary',
            onClick: options.onClick || null,
            onSuccess: options.onSuccess || null,
            onError: options.onError || null,
            ...options
        };
        
        this.isLoading = false;
        this.notificationManager = window.NotificationManager;
        this.init();
    }

    init() {
        this.createButton();
        this.bindEvents();
    }

    createButton() {
        // Remove existing button if it exists
        const existingButton = document.getElementById(this.options.buttonId);
        if (existingButton) {
            existingButton.remove();
        }

        // Create new button
        const button = document.createElement('button');
        button.id = this.options.buttonId;
        button.className = this.options.className;
        button.type = 'button';
        button.innerHTML = `
            <i data-lucide="${this.options.icon}"></i>
            <span class="button-text">${this.options.buttonText}</span>
        `;

        // Add to page
        const targetElement = document.querySelector(this.options.targetSelector);
        console.log('SaveButton: Target element found:', !!targetElement);
        console.log('SaveButton: Target element:', targetElement);
        
        if (targetElement) {
            targetElement.appendChild(button);
            console.log('SaveButton: Button appended to target');
            console.log('SaveButton: Target innerHTML after append:', targetElement.innerHTML);
        } else {
            console.error('SaveButton: Target element not found:', this.options.targetSelector);
            // Fallback to body if target not found
            document.body.appendChild(button);
            console.log('SaveButton: Button appended to body as fallback');
        }

        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        this.button = button;
        this.buttonText = button.querySelector('.button-text');
        this.buttonIcon = button.querySelector('i');
    }

    bindEvents() {
        if (this.button) {
            this.button.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleClick();
            });
        }
    }

    async handleClick() {
        if (this.isLoading) return;

        try {
            this.setLoading(true);
            
            if (this.options.onClick) {
                const result = await this.options.onClick();
                
                if (result && result.success !== false) {
                    this.showSuccess();
                    if (this.options.onSuccess) {
                        this.options.onSuccess(result);
                    }
                } else {
                    this.showError(result?.message || 'Save failed');
                    if (this.options.onError) {
                        this.options.onError(result);
                    }
                }
            }
        } catch (error) {
            console.error('SaveButton error:', error);
            this.showError(error.message || 'An unexpected error occurred');
            if (this.options.onError) {
                this.options.onError(error);
            }
        } finally {
            this.setLoading(false);
        }
    }

    setLoading(loading) {
        this.isLoading = loading;
        
        if (loading) {
            this.button.disabled = true;
            this.buttonIcon.setAttribute('data-lucide', 'loader-2');
            this.buttonIcon.classList.add('animate-spin');
            this.buttonText.textContent = this.options.loadingText;
        } else {
            this.button.disabled = false;
            this.buttonIcon.setAttribute('data-lucide', this.options.icon);
            this.buttonIcon.classList.remove('animate-spin');
            this.buttonText.textContent = this.options.buttonText;
        }

        // Reinitialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    showSuccess(message = null) {
        const successMessage = message || this.options.successText;
        this.notificationManager.success('Success', successMessage);
    }

    showError(message = null) {
        const errorMessage = message || this.options.errorText;
        this.notificationManager.error('Error', errorMessage);
    }

    showWarning(message) {
        this.notificationManager.warning('Warning', message);
    }

    showInfo(message) {
        this.notificationManager.info('Info', message);
    }

    // Public methods for external control
    enable() {
        this.button.disabled = false;
    }

    disable() {
        this.button.disabled = true;
    }

    destroy() {
        if (this.button && this.button.parentNode) {
            this.button.parentNode.removeChild(this.button);
        }
    }

    // Update button text
    updateText(text) {
        this.options.buttonText = text;
        if (this.buttonText) {
            this.buttonText.textContent = text;
        }
    }

    // Update button icon
    updateIcon(icon) {
        this.options.icon = icon;
        if (this.buttonIcon) {
            this.buttonIcon.setAttribute('data-lucide', icon);
        }
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
}

    // Export for module usage
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = SaveButton;
    }

    // Make available globally
    window.SaveButton = SaveButton;
}
