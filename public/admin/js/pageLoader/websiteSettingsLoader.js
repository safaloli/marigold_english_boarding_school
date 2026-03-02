/**
 * Website Settings Manager
 * Handles dynamic loading and management of the website settings section
 */
class WebsiteSettingsManager {
    constructor() {
        this.currentSection = 'website-settings';
        this.notificationManager = window.NotificationManager;
        this.saveButton = null;
        this.init();
    }

    init() {
        this.bindEvents();
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Website settings section click
        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-section="website-settings"]')) {
                e.preventDefault();
                this.loadWebsiteSettings();
            }
        });
    }

    /**
     * Load website settings section dynamically
     */
    async loadWebsiteSettings() {
        try {
            // Get website settings content
            const content = this.getWebsiteSettingsContent();
            
            // Inject content into page-content
            this.injectContent(content);
            
            // Initialize website settings functionality
            this.initializeWebsiteSettings();
            
            // Update navigation
            this.updateNavigation();
            
        } catch (error) {
            console.error('Error loading website settings section:', error);
            this.showError('Failed to load website settings section');
        }
    }

    /**
     * Get website settings content HTML
     */
    getWebsiteSettingsContent() {
        return `
            <section id="website-settings-section" class="content-section active">
                <div class="page-header">
                    <div class="page-title">
                        <h1>Website General Settings</h1>
                        <p>Manage general website settings and configuration.</p>
                    </div>
                </div>

                <div class="content-grid">
                    <!-- General Settings -->
                    <div class="content-card">
                        <div class="card-header">
                            <h3>General Settings</h3>
                        </div>
                        <div class="card-content">
                            <form class="content-form" id="generalSettingsForm">
                                <div class="form-group">
                                    <label for="siteName">Site Name</label>
                                    <input type="text" id="siteName" name="siteName" class="form-input" placeholder="Marigold School">
                                </div>
                                <div class="form-group">
                                    <label for="siteDescription">Site Description</label>
                                    <textarea id="siteDescription" name="siteDescription" class="form-textarea" rows="3" placeholder="Excellence in Education"></textarea>
                                </div>
                                <div class="form-group">
                                    <label for="schoolAddress">School Address</label>
                                    <textarea id="schoolAddress" name="schoolAddress" class="form-textarea" rows="3" placeholder="Enter full school address"></textarea>
                                </div>
                                
                                <div class="form-group">
                                    <label for="mainContactEmail">Main Contact Email</label>
                                    <input type="email" id="mainContactEmail" name="mainContactEmail" class="form-input" placeholder="info@marigoldebs.edu">
                                </div>
                                <div class="form-group">
                                    <label for="mainContactPhone">Main Contact Phone</label>
                                    <input type="tel" id="mainContactPhone" name="mainContactPhone" class="form-input" placeholder="+91-1234567890">
                                </div>
                                <div class="form-group logo-upload-container">
                                    <label for="siteLogo">Website Logo</label>
                                    <div id="logo-upload-container">
                                        <!-- ImageUpload component will be inserted here -->
                                    </div>
                                </div>
                                
                                <div class="form-group favicon-upload-container">
                                    <label for="siteFavicon">Website Favicon</label>
                                    <div id="favicon-upload-container">
                                        <!-- ImageUpload component will be inserted here -->
                                    </div>
                                </div>

                                <!-- Save Button at Bottom -->
                                <div class="form-actions" id="saveButtonContainer">
                                    <!-- SaveButton component will be inserted here -->
                                </div>
                            </form>
                        </div>
                    </div>


                </div>
            </section>
        `;
    }

    /**
     * Inject content into page-content element
     */
    injectContent(content) {
        const pageContent = document.getElementById('pageContent');
        
        if (pageContent) {
            pageContent.innerHTML = content;
            
            // Reinitialize Lucide icons after content injection
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        } else {
            console.error('pageContent element not found!');
        }
    }

    /**
     * Initialize website settings functionality
     */
    initializeWebsiteSettings() {
        // Initialize SaveButton component with a delay to ensure DOM is ready
        setTimeout(() => {
            this.initializeSaveButton();
        }, 300);
        
        // Initialize logo upload component
        setTimeout(() => {
            this.initializeLogoUpload();
        }, 150);
        
        // Initialize favicon upload component
        setTimeout(() => {
            this.initializeFaviconUpload();
        }, 150);
        
        // Load existing settings with a delay to ensure DOM is ready
        setTimeout(() => {
            this.loadSettings();
        }, 200);
    }

    /**
     * Initialize SaveButton component
     */
    initializeSaveButton() {
        // Clean up existing save button if it exists
        if (this.saveButton && this.saveButton.button) {
            this.saveButton.button.remove();
        }


        if (typeof SaveButton === 'undefined') {
            console.error('SaveButton class not found! Make sure SaveButton.js is loaded.');
            this.createFallbackButton();
            return;
        }

        this.saveButton = new SaveButton({
            buttonId: 'saveWebsiteSettingsBtn',
            buttonText: 'Save All Changes',
            loadingText: 'Saving...',
            successText: 'Settings saved successfully',
            errorText: 'Failed to save settings',
            icon: 'save',
            className: 'btn btn-primary',
            targetSelector: '#saveButtonContainer',
            onClick: () => this.saveSettings(),
            onSuccess: (result) => {
                // Update sidebar school name after saving settings
                if (window.adminPanel && typeof window.adminPanel.updateSidebarSchoolName === 'function') {
                    window.adminPanel.updateSidebarSchoolName();
                }
            },
            onError: (error) => {
                console.error('Save failed:', error);
            }
        });

        
        // Verify the button was actually inserted
        setTimeout(() => {
            const insertedButton = document.querySelector('#saveWebsiteSettingsBtn');
            if (!insertedButton) {
                this.createFallbackButton();
            }
        }, 200);
    }

    /**
     * Initialize logo upload component
     */
    initializeLogoUpload() {
        
        const container = document.getElementById('logo-upload-container');
        if (!container) {
            console.error('Logo upload container not found!');
            return;
        }

        // Check if ImageUpload component is available
        if (typeof ImageUpload === 'undefined') {
            console.error('ImageUpload component not found! Make sure ImageUpload.js is loaded.');
            container.innerHTML = `
                <div class="error-message">
                    <p>Image upload component not available. Please refresh the page.</p>
                </div>
            `;
            return;
        }

        // Create the ImageUpload HTML
        container.innerHTML = ImageUpload.createHTML({
            fileInputId: 'logo-upload-input',
            urlInputId: 'logo-url-input',
            selectBtnId: 'logo-select-btn',
            previewContainerId: 'logo-preview-container',
            previewImgId: 'logo-preview-img',
            removeBtnId: 'logo-remove-btn',
            buttonText: 'Select Logo',
            helpText: 'PNG, JPG, GIF, SVG up to 25MB. Recommended: 300x100px or similar aspect ratio. Image will be uploaded when you save.',
            existingImageUrl: ''
        });

        // Initialize the ImageUpload component
        this.logoUpload = new ImageUpload({
            container: container,
            fileInputId: 'logo-upload-input',
            urlInputId: 'logo-url-input',
            selectBtnId: 'logo-select-btn',
            previewContainerId: 'logo-preview-container',
            previewImgId: 'logo-preview-img',
            removeBtnId: 'logo-remove-btn',
            maxSize: 25 * 1024 * 1024, // 25MB
            acceptedTypes: ['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'image/svg+xml'],
            uploadPath: '/api/upload/logo',
            uploadFolder: 'marigold-school/website-assets',
            autoUpload: false, // Disable auto-upload, will upload on save
            onUploadStart: (file) => {
                if (this.notificationManager) {
                    this.notificationManager.info('Uploading', 'Uploading logo...');
                }
            },
            onUploadProgress: (progress) => {
            },
            onUploadSuccess: (result) => {
                if (this.notificationManager) {
                    this.notificationManager.success('Success', 'Logo uploaded successfully');
                }
            },
            onUploadError: (error) => {
                console.error('Logo upload error:', error);
                if (this.notificationManager) {
                    this.notificationManager.error('Upload Failed', error.message || 'Failed to upload logo');
                }
            },
            onImageSelect: (file) => {
            },
            onImageRemove: () => {
            },
            showNotification: (type, message) => {
                if (this.notificationManager) {
                    this.notificationManager[type](type === 'error' ? 'Error' : 'Success', message);
                }
            }
        });

        this.logoUpload.init();
    }

    /**
     * Initialize favicon upload component
     */
    initializeFaviconUpload() {
        
        const container = document.getElementById('favicon-upload-container');
        if (!container) {
            console.error('Favicon upload container not found!');
            return;
        }

        // Check if ImageUpload component is available
        if (typeof ImageUpload === 'undefined') {
            console.error('ImageUpload component not found! Make sure ImageUpload.js is loaded.');
            container.innerHTML = `
                <div class="error-message">
                    <p>Image upload component not available. Please refresh the page.</p>
                </div>
            `;
            return;
        }

        // Create the ImageUpload HTML
        container.innerHTML = ImageUpload.createHTML({
            fileInputId: 'favicon-upload-input',
            urlInputId: 'favicon-url-input',
            selectBtnId: 'favicon-select-btn',
            previewContainerId: 'favicon-preview-container',
            previewImgId: 'favicon-preview-img',
            removeBtnId: 'favicon-remove-btn',
            buttonText: 'Select Favicon',
            helpText: 'PNG, ICO, SVG up to 2MB. Recommended: 32x32px or 48x48px. SVG format is fully supported. Image will be uploaded when you save.',
            existingImageUrl: ''
        });

        // Initialize the ImageUpload component
        this.faviconUpload = new ImageUpload({
            container: container,
            fileInputId: 'favicon-upload-input',
            urlInputId: 'favicon-url-input',
            selectBtnId: 'favicon-select-btn',
            previewContainerId: 'favicon-preview-container',
            previewImgId: 'favicon-preview-img',
            removeBtnId: 'favicon-remove-btn',
            maxSize: 2 * 1024 * 1024, // 2MB
            acceptedTypes: ['image/png', 'image/x-icon', 'image/vnd.microsoft.icon', 'image/svg+xml'],
            uploadPath: '/api/upload/logo',
            uploadFolder: 'marigold-school/website-assets',
            autoUpload: false, // Disable auto-upload, will upload on save
            onUploadStart: (file) => {
                if (this.notificationManager) {
                    this.notificationManager.info('Uploading', 'Uploading favicon...');
                }
            },
            onUploadProgress: (progress) => {
            },
            onUploadSuccess: (result) => {
                if (this.notificationManager) {
                    this.notificationManager.success('Success', 'Favicon uploaded successfully');
                }
            },
            onUploadError: (error) => {
                console.error('Favicon upload error:', error);
                if (this.notificationManager) {
                    this.notificationManager.error('Upload Failed', error.message || 'Failed to upload favicon');
                }
            },
            onImageSelect: (file) => {
            },
            onImageRemove: () => {
            },
            showNotification: (type, message) => {
                if (this.notificationManager) {
                    this.notificationManager[type](type === 'error' ? 'Error' : 'Success', message);
                }
            }
        });

        this.faviconUpload.init();
    }

    /**
     * Create fallback button if SaveButton component is not available
     */
    createFallbackButton() {
        const container = document.querySelector('#saveButtonContainer');
        if (!container) return;

        container.innerHTML = `
            <button class="btn btn-primary" id="saveWebsiteSettingsBtn">
                <i data-lucide="save"></i>
                Save All Changes
            </button>
        `;

        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        // Add click event
        const button = document.getElementById('saveWebsiteSettingsBtn');
        if (button) {
            button.addEventListener('click', async (e) => {
                e.preventDefault();
                try {
                    button.disabled = true;
                    button.innerHTML = '<i data-lucide="loader-2" class="animate-spin"></i> Saving...';
                    if (typeof lucide !== 'undefined') {
                        lucide.createIcons();
                    }
                    
                    await this.saveSettings();
                    this.notificationManager.success('Success', 'Settings saved successfully');
                    
                    // Update sidebar school name after saving settings
                    if (window.adminPanel && typeof window.adminPanel.updateSidebarSchoolName === 'function') {
                        window.adminPanel.updateSidebarSchoolName();
                    }
                } catch (error) {
                    console.error('Save error:', error);
                    this.notificationManager.error('Error', error.message || 'Failed to save settings');
                } finally {
                    button.disabled = false;
                    button.innerHTML = '<i data-lucide="save"></i> Save All Changes';
                    if (typeof lucide !== 'undefined') {
                        lucide.createIcons();
                    }
                }
            });
        } else {
            console.error('Fallback button not found!');
        }
    }

    /**
     * Load existing settings from API
     */
    async loadSettings() {
        try {
            const token = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
            if (!token) {
                console.error('❌ No authentication token found');
                this.notificationManager.error('Authentication Error', 'Authentication required');
                return;
            }

            const response = await fetch('/api/admin/settings', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                if (data && data.siteName) {
                    this.populateForm(data);
                } else {
                }
            } else {
                console.error('❌ API request failed:', response.status);
                this.notificationManager.error('Load Failed', 'Failed to load settings');
            }
        } catch (error) {
            console.error('❌ Error loading settings:', error);
            this.notificationManager.error('Load Failed', 'Failed to load settings');
        }
    }

    /**
     * Populate form with settings data
     */
    populateForm(settings) {
        if (settings) {
            const { siteName, siteDescription, siteLogo, siteFavicon, mainContactEmail, mainContactPhone, schoolAddress } = settings;
            
            const siteNameInput = document.getElementById('siteName');
            const siteDescriptionInput = document.getElementById('siteDescription');
            const mainContactEmailInput = document.getElementById('mainContactEmail');
            const mainContactPhoneInput = document.getElementById('mainContactPhone');
            const schoolAddressInput = document.getElementById('schoolAddress');

            if (siteNameInput) {
                siteNameInput.value = siteName || '';
            }
            if (siteDescriptionInput) {
                siteDescriptionInput.value = siteDescription || '';
            }
            // Set logo using the ImageUpload component
            if (this.logoUpload && siteLogo) {
                this.logoUpload.setImageUrl(siteLogo);
            }
            // Set favicon using the ImageUpload component
            if (this.faviconUpload && siteFavicon) {
                this.faviconUpload.setImageUrl(siteFavicon);
            }
            if (mainContactEmailInput) {
                mainContactEmailInput.value = mainContactEmail || '';
            }
            if (mainContactPhoneInput) {
                mainContactPhoneInput.value = mainContactPhone || '';
            }
            if (schoolAddressInput) {
                schoolAddressInput.value = schoolAddress || '';
            }
        } else {
        }
    }

    /**
     * Save settings to API
     */
    async saveSettings() {
        try {
            const token = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
            if (!token) {
                throw new Error('Authentication required');
            }

            let logoUrl = '';
            let faviconUrl = '';
            
            // Handle logo upload if there's a pending file
            if (this.logoUpload && this.logoUpload.hasPendingUpload()) {
                try {
                    const uploadResult = await this.logoUpload.uploadFile(this.logoUpload.elements.fileInput.files[0]);
                    logoUrl = uploadResult.url;
                } catch (uploadError) {
                    console.error('❌ Logo upload failed:', uploadError);
                    throw new Error('Failed to upload logo: ' + uploadError.message);
                }
            } else if (this.logoUpload) {
                // Use existing logo URL if no new file selected
                logoUrl = this.logoUpload.getImageUrl();
            }

            // Handle favicon upload if there's a pending file
            if (this.faviconUpload && this.faviconUpload.hasPendingUpload()) {
                try {
                    const uploadResult = await this.faviconUpload.uploadFile(this.faviconUpload.elements.fileInput.files[0]);
                    faviconUrl = uploadResult.url;
                } catch (uploadError) {
                    console.error('❌ Favicon upload failed:', uploadError);
                    throw new Error('Failed to upload favicon: ' + uploadError.message);
                }
            } else if (this.faviconUpload) {
                // Use existing favicon URL if no new file selected
                faviconUrl = this.faviconUpload.getImageUrl();
            }

            // Collect form data
            const settings = {
                siteName: document.getElementById('siteName').value.trim(),
                siteDescription: document.getElementById('siteDescription').value.trim(),
                siteLogo: logoUrl,
                siteFavicon: faviconUrl,
                mainContactEmail: document.getElementById('mainContactEmail').value.trim(),
                mainContactPhone: document.getElementById('mainContactPhone').value.trim(),
                schoolAddress: document.getElementById('schoolAddress').value.trim()
            };
            

            // Validate required fields
            if (!settings.siteName) {
                throw new Error('Site name is required');
            }

            if (!settings.mainContactEmail) {
                throw new Error('Main contact email is required');
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (settings.mainContactEmail && !emailRegex.test(settings.mainContactEmail)) {
                throw new Error('Please enter a valid email address');
            }

            const response = await fetch('/api/admin/settings', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(settings)
            });

            const data = await response.json();

            if (response.ok && data.siteName) {
                return { success: true, message: 'Settings saved successfully' };
            } else {
                console.error('❌ Save failed:', data.error || 'Unknown error');
                throw new Error(data.error || 'Failed to save settings');
            }
        } catch (error) {
            console.error('Error saving settings:', error);
            throw error;
        }
    }

    /**
     * Update navigation state
     */
    updateNavigation() {
        // Remove active class from all nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to website settings link
        const websiteSettingsLink = document.querySelector('[data-section="website-settings"]');
        if (websiteSettingsLink) {
            websiteSettingsLink.classList.add('active');
        }
    }

    /**
     * Show error message
     */
    showError(message) {
        const pageContent = document.getElementById('pageContent');
        if (pageContent) {
            pageContent.innerHTML = `
                <div class="error-container">
                    <div class="error-icon">
                        <i data-lucide="alert-circle"></i>
                    </div>
                    <h3>Error</h3>
                    <p>${message}</p>
                    <button class="btn btn-primary" onclick="location.reload()">Reload Page</button>
                </div>
            `;
            
            // Reinitialize Lucide icons
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.websiteSettingsManager = new WebsiteSettingsManager();
});
