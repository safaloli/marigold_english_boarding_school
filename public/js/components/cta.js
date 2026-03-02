/**
 * CTA Component for Marigold School Website
 * Dynamic Call-to-Action section with customizable content
 */

class CTAComponent {
    constructor(options = {}) {
        this.options = {
            title: 'Discover your Future',
            subtitle: 'Join the Marigold School community and give your child the best foundation for their future.',
            primaryButton: {
                text: 'Apply Now',
                url: '#',
                onclick: 'openApplicationModal()'
            },
            secondaryButton: {
                text: 'Schedule a Visit',
                url: '/contact.html',
                onclick: null
            },
            backgroundImage: null,
            cssClass: 'cta-about',
            containerId: 'cta-container',
            ...options
        };
    }

    /**
     * Generate CTA HTML
     */
    generateHTML() {
        const { title, subtitle, primaryButton, secondaryButton, backgroundImage, cssClass } = this.options;
        
        // Background style
        const backgroundStyle = backgroundImage ? `background-image: url('${backgroundImage}'); background-size: cover; background-position: center;` : '';
        
        // Always use button/anchor without inline onclick (will add event listeners later)
        return `
            <div class="container">
                <div class="cta-content text-center">
                    <h2 class="cta-title">${title}</h2>
                    <p class="cta-subtitle">${subtitle}</p>
                    <div class="cta-buttons">
                        ${primaryButton.onclick || primaryButton.url === '#' ? 
                            `<button class="btn btn-white btn-large btn-primary" data-action="primary">
                                <span class="btn-text">${primaryButton.text}</span>
                                <i data-lucide="arrow-right" class="btn-icon"></i>
                            </button>` :
                            `<a class="btn btn-white btn-large btn-primary" href="${primaryButton.url}">
                                <span class="btn-text">${primaryButton.text}</span>
                                <i data-lucide="arrow-right" class="btn-icon"></i>
                            </a>`
                        }
                        ${secondaryButton.onclick || secondaryButton.url === '#' ? 
                            `<button class="btn btn-outline-white btn-large btn-secondary" data-action="secondary">
                                <span class="btn-text">${secondaryButton.text}</span>
                                <i data-lucide="calendar" class="btn-icon"></i>
                            </button>` :
                            `<a class="btn btn-outline-white btn-large btn-secondary" href="${secondaryButton.url}">
                                <span class="btn-text">${secondaryButton.text}</span>
                                <i data-lucide="calendar" class="btn-icon"></i>
                            </a>`
                        }
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Render CTA to a container
     */
    render(containerId = null) {
        const targetId = containerId || this.options.containerId;
        const container = document.getElementById(targetId);
        
        if (!container) {
            console.error(`CTA Component: Container with ID '${targetId}' not found`);
            return false;
        }

        // Ensure container is visible
        container.removeAttribute('style');
        container.style.display = 'block';
        container.style.visibility = 'visible';
        
        container.innerHTML = this.generateHTML();
        
        // Hide loading placeholder if it exists
        const loadingElement = document.getElementById('cta-loading');
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }
        
        // Attach event listeners to buttons (avoids CSP violations)
        this.attachEventListeners(container);
        
        // Reinitialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        return true;
    }
    
    /**
     * Attach event listeners to buttons
     */
    attachEventListeners(container) {
        const { primaryButton, secondaryButton } = this.options;
        
        // Primary button
        const primaryBtn = container.querySelector('[data-action="primary"]');
        if (primaryBtn && primaryButton.onclick) {
            primaryBtn.addEventListener('click', (e) => {
                e.preventDefault();
                // Execute onclick if it's a function, or eval if it's a string
                if (typeof primaryButton.onclick === 'function') {
                    primaryButton.onclick();
                } else if (typeof primaryButton.onclick === 'string') {
                    // Try to find the function in window scope
                    const funcName = primaryButton.onclick.replace(/\(\)$/, '');
                    if (typeof window[funcName] === 'function') {
                        window[funcName]();
                    }
                }
            });
        }
        
        // Secondary button
        const secondaryBtn = container.querySelector('[data-action="secondary"]');
        if (secondaryBtn && secondaryButton.onclick) {
            secondaryBtn.addEventListener('click', (e) => {
                e.preventDefault();
                // Execute onclick if it's a function, or eval if it's a string
                if (typeof secondaryButton.onclick === 'function') {
                    secondaryButton.onclick();
                } else if (typeof secondaryButton.onclick === 'string') {
                    // Try to find the function in window scope
                    const funcName = secondaryButton.onclick.replace(/\(\)$/, '');
                    if (typeof window[funcName] === 'function') {
                        window[funcName]();
                    }
                }
            });
        }
    }

    /**
     * Update CTA content dynamically
     */
    update(newOptions = {}) {
        this.options = { ...this.options, ...newOptions };
        return this.render();
    }

    /**
     * Load CTA content from API
     */
    async loadFromAPI(apiEndpoint = '/api/content/about?section=cta') {
        try {
            const response = await fetch(apiEndpoint);
            const data = await response.json();
            
            if (data.success && data.data && data.data.length > 0) {
                const ctaData = data.data[0];
                let metadata = {};
                
                // Parse metadata if it exists
                if (ctaData.metadata) {
                    try {
                        metadata = JSON.parse(ctaData.metadata);
                    } catch (e) {
                        console.warn('Error parsing CTA metadata:', e);
                    }
                }
                
                // Update options with API data
                this.options = {
                    ...this.options,
                    title: ctaData.title || this.options.title,
                    subtitle: ctaData.content || this.options.subtitle,
                    primaryButton: {
                        text: metadata.primaryButtonText || this.options.primaryButton.text,
                        url: metadata.primaryButtonUrl || this.options.primaryButton.url,
                        onclick: metadata.primaryButtonOnclick || this.options.primaryButton.onclick
                    },
                    secondaryButton: {
                        text: metadata.secondaryButtonText || this.options.secondaryButton.text,
                        url: metadata.secondaryButtonUrl || this.options.secondaryButton.url,
                        onclick: metadata.secondaryButtonOnclick || this.options.secondaryButton.onclick
                    },
                    backgroundImage: ctaData.imageUrl || this.options.backgroundImage
                };
                
                return true;
            } else {
                console.warn('CTA Component: No data received from API');
                return false;
            }
        } catch (error) {
            console.error('CTA Component: Error loading from API:', error);
            return false;
        }
    }

    /**
     * Render with loading state
     */
    async renderWithLoading(containerId = null, showLoading = true) {
        const targetId = containerId || this.options.containerId;
        const container = document.getElementById(targetId);
        
        if (!container) {
            console.error(`CTA Component: Container with ID '${targetId}' not found`);
            return false;
        }

        if (showLoading) {
            container.innerHTML = this.generateLoadingHTML();
        }

        try {
            // Load data from API
            const loaded = await this.loadFromAPI();
            
            if (loaded) {
                // Render with loaded data
                this.render(targetId);
                return true;
            } else {
                // Fallback to default content
                this.render(targetId);
                return true;
            }
        } catch (error) {
            console.error('CTA Component: Error in renderWithLoading:', error);
            // Fallback to default content
            this.render(targetId);
            return false;
        }
    }

    /**
     * Generate loading placeholder HTML
     */
    generateLoadingHTML() {
        return `
            <div class="container">
                <div class="cta-content text-center">
                    <div class="loading-placeholder">
                        <div class="loading-box cta-title-box"></div>
                        <div class="loading-box cta-subtitle-box"></div>
                        <div class="loading-box cta-buttons-box"></div>
                    </div>
                </div>
            </div>
        `;
    }
}

/**
 * Global CTA Manager for easy access
 */
window.CTAManager = {
    instances: new Map(),
    
    /**
     * Create a new CTA instance
     */
    create(id, options = {}) {
        const cta = new CTAComponent(options);
        this.instances.set(id, cta);
        return cta;
    },
    
    /**
     * Get existing CTA instance
     */
    get(id) {
        return this.instances.get(id);
    },
    
    /**
     * Render CTA to container
     */
    async render(id, containerId, options = {}) {
        let cta = this.get(id);
        
        if (!cta) {
            cta = this.create(id, options);
        } else {
            cta.update(options);
        }
        
        return await cta.renderWithLoading(containerId);
    },
    
    /**
     * Update existing CTA
     */
    update(id, newOptions = {}) {
        const cta = this.get(id);
        if (cta) {
            return cta.update(newOptions);
        }
        return false;
    }
};

/**
 * Initialize default CTA component
 */
document.addEventListener('DOMContentLoaded', function() {
    // Auto-initialize if cta-container exists
    const ctaContainer = document.getElementById('cta-container');
    if (ctaContainer && !window.CTAManager.get('default')) {
        window.CTAManager.render('default', 'cta-container');
    }
});

/**
 * Export for module systems
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CTAComponent, CTAManager: window.CTAManager };
}
