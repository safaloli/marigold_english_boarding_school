/**
 * Homepage Content Manager - Redesigned
 * Handles dynamic loading and management of the homepage content section
 */
class HomepageContentLoader {
    constructor() {
        this.currentSection = 'home-content';
        this.currentSubsection = null;
        this.sections = {
            'hero': { name: 'Hero Section', icon: '🎯', enabled: true },
            'quick-facts': { name: 'Quick Facts', icon: '📊', enabled: true },
            'why-choose-us': { name: 'Why Choose Us', icon: '⭐', enabled: true },
            'mission': { name: 'Mission & Vision', icon: '🎯', enabled: true },
            'programs': { name: 'Academic Programs', icon: '📚', enabled: true },
            'neb-toppers': { name: 'See Toppers', icon: '🏆', enabled: true },
            'alumni': { name: 'Marigold Alumni', icon: '🎓', enabled: true },
            'testimonials': { name: 'Testimonials', icon: '💬', enabled: true },
            'gallery': { name: 'Gallery', icon: '🖼️', enabled: true },
            'contact': { name: 'Contact Section', icon: '📞', enabled: true },
            'popup-notice': { name: 'Pop-Up Notice', icon: '🔔', enabled: true }
        };
        this.init();
    }

    init() {
        this.bindEvents();
        this.bindTabEvents();
        this.bindAccordionEvents();
        // Clear any cached data on initialization to ensure fresh data
        this.homepageData = null;
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Homepage content section click
        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-section="home-content"]')) {
                e.preventDefault();
                this.loadHomepageContent();
            }
        });

        // Section menu item clicks will be set up in loadHomepageContent

        // Breadcrumb back button - handle data-action attribute
        document.addEventListener('click', (e) => {
            const backButton = e.target.closest('.back-button');
            if (backButton) {
                const action = backButton.getAttribute('data-action');
                if (action === 'back-to-section-list' && this.isHomepageContentContext(backButton)) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    this.showSectionList();
                    return;
                }
            }
        });



        // Section save buttons - now handled by SaveButton component
        // The SaveButton component will handle all save functionality
    }

    /**
     * Initialize ImageUpload component for hero section
     */
    initializeHeroImageUpload() {
        try {
            // Destroy existing instance if it exists to prevent duplicate event listeners
            if (window.heroImageUpload && typeof window.heroImageUpload.destroy === 'function') {
                window.heroImageUpload.destroy();
                window.heroImageUpload = null;
            }
            
            // Initialize the ImageUpload component for hero background image
            const heroImageUpload = new ImageUpload({
                container: document.getElementById('sectionEditor'),
                fileInputId: 'heroBackgroundImageUpload',
                urlInputId: 'heroBackgroundImage',
                selectBtnId: 'heroBackgroundImageSelect',
                previewContainerId: 'heroBackgroundImagePreview',
                previewImgId: 'heroBackgroundImagePreviewImg',
                removeBtnId: 'heroBackgroundImageRemove',
                maxSize: 200 * 1024 * 1024, // 200MB
                allowVideo: true, // Allow both images and videos
                uploadPath: '/api/upload/image',
                autoUpload: false, // Disable auto-upload - we'll handle it in save logic
                uploadFolder: 'marigold-school/homepage/hero',
                showNotification: (type, message) => {
                    this.showNotification(type, message);
                },
                onImageSelect: (file) => {
                    // Just show preview, don't upload yet
                },
                onImageRemove: () => {
                }
            });

            heroImageUpload.init();
            
            // Store globally for access during form population
            window.heroImageUpload = heroImageUpload;
            
            // Add video compression on file selection
            this.setupVideoCompression();
            
        } catch (error) {
            console.error('Error initializing hero ImageUpload component:', error);
        }
    }

    /**
     * Initialize SaveButton component for a section
     */
    initializeSaveButton(section) {
        const saveButtonElement = document.querySelector('.save-section-btn');
        if (!saveButtonElement) {
            console.warn(`Save button not found for section: ${section}`);
            return null;
        }

        // Determine if this section has images
        const sectionsWithImages = ['hero', 'gallery', 'testimonials', 'why-choose-us'];
        const hasImages = sectionsWithImages.includes(section);
        
        // Special handling for hero section with ImageUpload component
        const isHeroSection = section === 'hero';
        const isWhyChooseSection = section === 'why-choose-us';

        const saveButton = new SaveButton({
            target: saveButtonElement,
            dataSection: section,
            hasImages: hasImages,
            uploadProgress: {
                start: 10,
                end: 40
            },
            messages: {
                preparing: 'Preparing...',
                collecting: 'Collecting data...',
                saving: 'Saving to database...',
                success: 'Section saved successfully!'
            },
            percentages: {
                collecting: hasImages ? 45 : 25,
                saving: hasImages ? 75 : 50,
                success: 100
            },
            onSave: async (button) => {
                
                const token = localStorage.getItem('adminToken');
                if (!token) {
                    throw new Error('Authentication required');
                }

                button.setProgress('Collecting data...', hasImages ? 45 : 25);
                
                // Special handling for hero section with ImageUpload component
                if (isHeroSection && window.heroImageUpload) {
                    
                    // Check if there's a pending file upload
                    const hasPending = window.heroImageUpload.hasPendingUpload();
                    
                    if (hasPending) {
                        try {
                            // Get the selected file
                            const fileInput = document.getElementById('heroBackgroundImageUpload');
                            const file = fileInput.files[0];
                            
                            
                            if (file) {
                                // Detect if it's a video or image
                                const isVideo = file.type.startsWith('video/');
                                const mediaType = isVideo ? 'video' : 'image';
                                
                                button.setProgress(`Uploading hero background ${mediaType}...`, 0);
                                
                                // Upload the media with progress tracking
                                const uploadResult = await this.uploadHeroImage(file, (progress, message) => {
                                    // Update button with real-time progress and custom message if provided
                                    const displayMessage = message || `Uploading hero background ${mediaType}...`;
                                    button.updateProgress(displayMessage, progress);
                                });
                                
                                
                                // Update the hidden input with the uploaded URL
                                document.getElementById('heroBackgroundImage').value = uploadResult.url;
                                
                            }
                        } catch (error) {
                            console.error('❌ Hero media upload failed:', error);
                            const fileInput = document.getElementById('heroBackgroundImageUpload');
                            const file = fileInput?.files[0];
                            const isVideo = file?.type.startsWith('video/');
                            const mediaType = isVideo ? 'video' : 'image';
                            throw new Error(`Failed to upload hero background ${mediaType}: ${error.message}`);
                        }
                    } else {
                    }
                }
                
                // Special handling for why-choose-us section with custom image upload
                if (isWhyChooseSection && this.whyChooseSelectedFile) {
                    button.setProgress('Uploading background image...', 20);
                    
                    try {
                        const file = this.whyChooseSelectedFile;
                        
                        // Convert file to base64
                        const base64Data = await new Promise((resolve, reject) => {
                            const reader = new FileReader();
                            reader.onloadend = () => resolve(reader.result);
                            reader.onerror = reject;
                            reader.readAsDataURL(file);
                        });
                        
                        
                        // Prepare upload data
                        const uploadData = {
                            imageData: base64Data,
                            fileName: file.name,
                            folder: 'marigold-school/homepage/why-choose-us'
                        };
                        
                        // Upload using the backend API
                        const token = localStorage.getItem('adminToken');
                        const response = await fetch('/api/upload/image', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify(uploadData)
                        });
                        
                        if (!response.ok) {
                            throw new Error('Upload failed');
                        }
                        
                        const result = await response.json();
                        const imageUrl = result.url;
                        
                        
                        // Update the hidden input with the uploaded URL
                        const imageUrlInput = document.getElementById('why-choose-background-url');
                        if (imageUrlInput) {
                            imageUrlInput.value = imageUrl;
                        } else {
                            console.error('❌ Hidden input #why-choose-background-url not found!');
                        }
                        
                        // Clear the stored file after successful upload
                        this.whyChooseSelectedFile = null;
                    } catch (error) {
                        console.error('❌ Why Choose Us background image upload failed:', error);
                        throw new Error(`Failed to upload background image: ${error.message}`);
                    }
                }
                
                // Handle other image uploads for other sections
                let sectionData;
                if (hasImages && !isHeroSection && !isWhyChooseSection) {
                    // Handle image uploads first
                    const imageFiles = this.collectImageFiles(section);
                    if (imageFiles.length > 0) {
                        button.setProgress('Uploading images...', 10);
                        const uploadedUrls = await button.uploadImagesInParallel(imageFiles, async (file, progressCallback) => {
                            return await this.uploadImageToCloudinary(file, progressCallback);
                        });
                        
                        // Update form with uploaded URLs
                        this.updateFormWithUploadedUrls(section, uploadedUrls);
                    }
                }
                
                button.setProgress('Collecting data...', hasImages ? 45 : 25);
                sectionData = this.collectSectionData(section);
                
                
                if (!sectionData) {
                    throw new Error('Unable to save - please check your input');
                }

                button.setProgress('Saving to database...', hasImages ? 75 : 50);
                
                
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 15000);
                
                const response = await fetch('/api/content/home/bulk', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ content: sectionData }),
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                if (!response.ok) {
                    const errorData = await response.json();
                    let errorMessage = 'Failed to save section';
                    
                    if (response.status === 401) {
                        errorMessage = 'Authentication failed - please log in again';
                    } else if (response.status === 500) {
                        errorMessage = 'Server error - please try again later';
                    } else if (errorData.error) {
                        errorMessage = errorData.error;
                    }
                    
                    throw new Error(errorMessage);
                }

                const result = await response.json();
                return result;
            },
            onSuccess: (result) => {
                this.showNotification('success', 'Section saved successfully!');
                
                // Navigate back to homepage section list after successful save
                setTimeout(() => {
                    this.showSectionList();
                }, 1500);
            },
            onError: (error) => {
                console.error('❌ Save error:', error);
                
                if (error.message.includes('Authentication')) {
                    this.showNotification('error', error.message);
                } else if (error.name === 'AbortError') {
                    this.showNotification('error', 'Save request timed out - please try again');
                } else {
                    this.showNotification('error', `Failed to save section: ${error.message}`);
                }
            }
        });

        return saveButton;
    }

    /**
     * Collect image files for upload from the current section
     */
    collectImageFiles(section) {
        const imageFiles = [];
        
        // Look for file inputs with selected files
        const fileInputs = document.querySelectorAll('input[type="file"]');
        fileInputs.forEach(input => {
            if (input.files && input.files.length > 0) {
                for (let i = 0; i < input.files.length; i++) {
                    imageFiles.push(input.files[i]);
                }
            }
        });
        
        return imageFiles;
    }

    /**
     * Update form fields with uploaded image URLs
     */
    updateFormWithUploadedUrls(section, uploadedUrls) {
        // This method will be implemented based on specific section requirements
    }

    /**
     * Upload hero background media (image or video) using optimized upload methods
     */
    async uploadHeroImage(file, progressCallback) {
        try {
            const isVideo = file.type.startsWith('video/');
            const mediaType = isVideo ? 'video' : 'image';
            
            // Get authentication token
            const token = localStorage.getItem('adminToken');
            if (!token) {
                throw new Error('Authentication required');
            }

            // For videos, use FormData for faster upload (no base64 conversion)
            // For images, use base64 (smaller files, works well)
            if (isVideo) {
                return await this.uploadVideoWithFormData(file, token, progressCallback);
            } else {
                return await this.uploadImageWithBase64(file, token, progressCallback);
            }
        } catch (error) {
            const isVideo = file.type.startsWith('video/');
            const mediaType = isVideo ? 'video' : 'image';
            console.error(`❌ Hero ${mediaType} upload error:`, error);
            throw error;
        }
    }

    /**
     * Setup video compression on file selection (before save)
     */
    setupVideoCompression() {
        const fileInput = document.getElementById('heroBackgroundImageUpload');
        if (!fileInput) return;
        
        // Store reference to compressed video
        this.compressedVideo = null;
        this.isCompressing = false;
        
        fileInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file || !file.type.startsWith('video/')) {
                this.compressedVideo = null;
                this.isCompressing = false;
                this.enableSaveButton();
                return;
            }
            
            console.log(`📹 Video selected: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
            console.log(`🎬 Starting compression to 480p...`);
            
            // Disable save button during compression
            this.isCompressing = true;
            this.disableSaveButton('Compressing video...');
            
            // Show compression UI
            this.showCompressionProgress(0, 'Preparing compression...');
            
            try {
                // Compress video immediately
                this.compressedVideo = await this.compressVideoFast(file, (progress) => {
                    this.showCompressionProgress(progress, `Compressing to 480p... ${progress}%`);
                });
                
                const originalSize = (file.size / 1024 / 1024).toFixed(2);
                const compressedSize = (this.compressedVideo.size / 1024 / 1024).toFixed(2);
                
                // Check if compression actually reduced size
                if (this.compressedVideo.size > file.size) {
                    // Compression increased size, use original
                    console.log(`⚠️ Compression increased file size, using original`);
                    this.compressedVideo = file;
                    this.showCompressionProgress(100, `⚠️ Using original file (compression would increase size)`, true);
                } else {
                    const savings = ((1 - this.compressedVideo.size / file.size) * 100).toFixed(1);
                    console.log(`✅ Compression complete!`);
                    console.log(`   Original: ${originalSize} MB`);
                    console.log(`   Compressed: ${compressedSize} MB`);
                    console.log(`   Saved: ${savings}%`);
                    this.showCompressionProgress(100, `✅ Compressed: ${originalSize}MB → ${compressedSize}MB (${savings}% saved)`, true);
                }
                
                // Re-enable save button
                this.isCompressing = false;
                this.enableSaveButton();
                
                // Hide after 3 seconds
                setTimeout(() => this.hideCompressionProgress(), 3000);
                
            } catch (error) {
                console.error('❌ Compression failed:', error);
                this.compressedVideo = null;
                this.isCompressing = false;
                this.showCompressionProgress(0, '❌ Compression failed - will upload original', false);
                
                // Re-enable save button (will upload original)
                this.enableSaveButton();
                
                setTimeout(() => this.hideCompressionProgress(), 3000);
            }
        });
    }
    
    /**
     * Disable save button during compression
     */
    disableSaveButton(message = 'Compressing video...') {
        const saveBtn = document.querySelector('[data-section="hero"].save-section-btn');
        if (!saveBtn) return;
        
        saveBtn.disabled = true;
        saveBtn.style.opacity = '0.6';
        saveBtn.style.cursor = 'not-allowed';
        
        // Store original content
        if (!saveBtn.dataset.originalContent) {
            saveBtn.dataset.originalContent = saveBtn.innerHTML;
        }
        
        saveBtn.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px; justify-content: center;">
                <div style="width: 16px; height: 16px; border: 2px solid white; border-top-color: transparent; border-radius: 50%; animation: spin 0.6s linear infinite;"></div>
                <span>${message}</span>
            </div>
        `;
        
        // Add spin animation if not exists
        if (!document.getElementById('compression-spin-style')) {
            const style = document.createElement('style');
            style.id = 'compression-spin-style';
            style.textContent = `
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    /**
     * Enable save button after compression
     */
    enableSaveButton() {
        const saveBtn = document.querySelector('[data-section="hero"].save-section-btn');
        if (!saveBtn) return;
        
        saveBtn.disabled = false;
        saveBtn.style.opacity = '1';
        saveBtn.style.cursor = 'pointer';
        
        // Restore original content
        if (saveBtn.dataset.originalContent) {
            saveBtn.innerHTML = saveBtn.dataset.originalContent;
        }
    }
    
    /**
     * Show compression progress overlay
     */
    showCompressionProgress(progress, message, success = false) {
        let overlay = document.getElementById('video-compression-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'video-compression-overlay';
            overlay.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 10000;
                min-width: 300px;
                max-width: 400px;
            `;
            document.body.appendChild(overlay);
        }
        
        const color = success ? '#10b981' : '#6366f1';
        overlay.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px;">
                <div style="flex-shrink: 0;">
                    ${success ? '✅' : '🎬'}
                </div>
                <div style="flex: 1;">
                    <div style="font-weight: 600; color: #1f2937; margin-bottom: 8px;">
                        Video Compression
                    </div>
                    <div style="color: #6b7280; font-size: 14px; margin-bottom: 8px;">
                        ${message}
                    </div>
                    <div style="background: #e5e7eb; height: 6px; border-radius: 3px; overflow: hidden;">
                        <div style="background: ${color}; height: 100%; width: ${progress}%; transition: width 0.3s ease;"></div>
                    </div>
                </div>
            </div>
        `;
        overlay.style.display = 'block';
    }
    
    /**
     * Hide compression progress overlay
     */
    hideCompressionProgress() {
        const overlay = document.getElementById('video-compression-overlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
    }
    
    /**
     * Upload video using FormData (uses pre-compressed video if available)
     */
    async uploadVideoWithFormData(file, token, progressCallback) {
        try {
            // Use pre-compressed video if available, otherwise use original
            const fileToUpload = this.compressedVideo || file;
            const originalSize = (file.size / 1024 / 1024).toFixed(2);
            const uploadSize = (fileToUpload.size / 1024 / 1024).toFixed(2);
            
            if (this.compressedVideo) {
                console.log(`📤 Uploading compressed video: ${uploadSize} MB (was ${originalSize} MB)`);
            } else {
                console.log(`📤 Uploading original video: ${originalSize} MB`);
            }
            
            // Upload the file - using same approach as gallery (no server-side optimization)
        return new Promise((resolve, reject) => {
            const formData = new FormData();
                formData.append('video', fileToUpload);
            formData.append('folder', 'marigold-school/homepage/hero');
                // Note: NOT sending 'optimize' parameter to prevent server-side re-compression

            const xhr = new XMLHttpRequest();

            // Track upload progress
            xhr.upload.addEventListener('progress', (e) => {
                if (e.lengthComputable) {
                        const uploadPercent = Math.round((e.loaded / e.total) * 100);
                    if (progressCallback) {
                            progressCallback(uploadPercent, `Uploading... ${uploadPercent}%`);
                    }
                }
            });

            xhr.upload.addEventListener('load', () => {
                if (progressCallback) {
                        progressCallback(100, 'Finalizing...');
                }
            });

            xhr.addEventListener('load', () => {
                if (xhr.status === 200) {
                    try {
                        const result = JSON.parse(xhr.responseText);
                            console.log(`✅ Upload complete!`);
                            
                            // Clear compressed video after successful upload
                            this.compressedVideo = null;
                            
                        resolve({ url: result.url });
                    } catch (error) {
                        reject(new Error('Invalid server response'));
                    }
                } else {
                    try {
                        const errorData = JSON.parse(xhr.responseText);
                        reject(new Error(errorData.error || 'Upload failed'));
                    } catch (error) {
                        reject(new Error(`Upload failed with status ${xhr.status}`));
                    }
                }
            });

            xhr.addEventListener('error', () => {
                reject(new Error('Network error during upload'));
            });

            xhr.addEventListener('timeout', () => {
                reject(new Error('Upload timeout'));
            });

            xhr.open('POST', '/api/upload/video-file');
            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
                xhr.timeout = 900000;
            xhr.send(formData);
        });
        } catch (error) {
            console.error('❌ Video upload error:', error);
            throw error;
        }
    }

    /**
     * Upload image using base64 (works well for smaller files)
     */
    async uploadImageWithBase64(file, token, progressCallback) {
        
        // Convert file to base64 for upload
        const base64Data = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });

        if (progressCallback) progressCallback(30);


        // Prepare upload data
        const uploadData = {
            imageData: base64Data,
            fileName: file.name,
            folder: 'marigold-school/homepage/hero'
        };

        if (progressCallback) progressCallback(50);


        // Upload using the existing API endpoint
        const response = await fetch('/api/upload/image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(uploadData)
        });

        if (progressCallback) progressCallback(90);

        if (!response.ok) {
            const errorData = await response.json();
            console.error('❌ Upload failed:', errorData);
            throw new Error(errorData.message || 'Upload failed');
        }

        const result = await response.json();
        
        if (progressCallback) progressCallback(100);
        
        return { url: result.url };
    }

    /**
     * Upload image to Cloudinary
     */
    async uploadImageToCloudinary(file, progressCallback) {
        return new Promise((resolve, reject) => {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', 'marigold_school');
            formData.append('folder', `marigold-school/homepage`);
            
            const xhr = new XMLHttpRequest();
            
            xhr.upload.addEventListener('progress', (e) => {
                if (e.lengthComputable) {
                    const percentComplete = (e.loaded / e.total) * 100;
                    progressCallback(percentComplete);
                }
            });
            
            xhr.addEventListener('load', () => {
                if (xhr.status === 200) {
                    const response = JSON.parse(xhr.responseText);
                    resolve(response.secure_url);
                } else {
                    reject(new Error('Upload failed'));
                }
            });
            
            xhr.addEventListener('error', () => {
                reject(new Error('Upload failed'));
            });
            
            xhr.open('POST', 'https://api.cloudinary.com/v1_1/dtjr46kcg/image/upload');
            xhr.send(formData);
        });
    }

    /**
     * Bind tab navigation events
     */
    bindTabEvents() {
        // Tab navigation
        document.addEventListener('click', (e) => {
            if (e.target.closest('.tab-btn')) {
                e.preventDefault();
                const tab = e.target.closest('.tab-btn').dataset.tab;
                this.switchTab(tab);
            }
        });
    }

    /**
     * Bind accordion events
     */
    bindAccordionEvents() {
        // Accordion toggles
        document.addEventListener('click', (e) => {
            if (e.target.closest('.accordion-toggle')) {
                e.preventDefault();
                this.toggleAccordion(e.target.closest('.program-item'));
            }
        });
    }

    /**
     * Load homepage content section dynamically
     */
    async loadHomepageContent() {
        try {
            // Get homepage content
            const content = this.getHomepageContent();
            
            // Inject content into page-content
            this.injectContent(content);
            
            // Initialize homepage content functionality
            this.initializeHomepageContent();
            
            // Set up section menu item clicks after content is loaded
            this.setupSectionMenuClicks();
            
            // Load actual data from API
            await this.loadHomepageData();
            
            // Show section list by default
            this.showSectionList();
            
            // Update navigation
            this.updateNavigation();
            
        } catch (error) {
            console.error('Error loading homepage content section:', error);
            this.showError('Failed to load homepage content section');
        }
    }

    /**
     * Check if homepage content management is currently active
     */
    isHomepageContentActive() {
        const pageContent = document.getElementById('pageContent');
        return pageContent && pageContent.innerHTML.includes('home-content-section');
    }

    /**
     * Set up section menu item clicks
     */
    setupSectionMenuClicks() {
        // Remove any existing event listeners first
        const sectionMenuItems = document.querySelectorAll('.section-menu-item');
        sectionMenuItems.forEach(item => {
            item.addEventListener('click', async (e) => {
                
                e.preventDefault();
                e.stopPropagation();
                const section = item.dataset.homepageSection;
                await this.loadSection(section);
            });
        });
    }

    /**
     * Check if we're in homepage content context
     */
    isHomepageContentContext(backButton) {
        // First check if we're in the homepage content section
        if (this.currentSection !== 'homepage-content') {
            return false;
        }
        
        // Check if the back button is within a homepage content context
        if (backButton && backButton.closest('#home-content-section, .home-content-editor, .section-editor')) {
            return true;
        }
        
        // Fallback: check if current content is homepage content-related
        const pageContent = document.getElementById('page-content');
        if (!pageContent) return false;
        
        return pageContent.innerHTML.includes('home-content-section') || 
               pageContent.querySelector('#home-content-section, .home-content-editor, .section-editor') !== null;
    }

    /**
     * Show section list (main homepage overview)
     */
    showSectionList() {
        this.currentSubsection = null;
        const sectionList = document.getElementById('sectionList');
        const sectionEditor = document.getElementById('sectionEditor');
        const pageHeader = document.querySelector('.page-header');
        
        if (sectionList && sectionEditor) {
            sectionList.style.display = 'block';
            sectionEditor.style.display = 'none';
            
            // Show page header when returning to section list
            if (pageHeader) {
                pageHeader.style.display = 'block';
            }
        }
    }

    /**
     * Load specific section editor
     */
    async loadSection(section) {
        this.currentSubsection = section;
        const sectionList = document.getElementById('sectionList');
        const sectionEditor = document.getElementById('sectionEditor');
        const pageHeader = document.querySelector('.page-header');
        
        if (sectionList && sectionEditor) {
            sectionList.style.display = 'none';
            sectionEditor.style.display = 'block';
            
            // Hide page header when showing section editor
            if (pageHeader) {
                pageHeader.style.display = 'none';
            }
            
            // Load section content
            const editorContent = this.getSectionEditor(section);
            sectionEditor.innerHTML = editorContent;
            
            // Update breadcrumb
            this.updateBreadcrumb(section);
            
            // Initialize ImageUpload component for hero section BEFORE loading data
            if (section === 'hero') {
                this.initializeHeroImageUpload();
            }
            
            // Load section data from database
            await this.loadSectionData(section);
            
            // Initialize SaveButton component for this section
            this.initializeSaveButton(section);
            
            // Reinitialize Lucide icons after content injection
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        } else {
            console.error('Section list or editor not found!');
        }
    }


    /**
     * Close custom modal
     */
    closeCustomModal(modal) {
        modal.style.opacity = '0';
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 200);
    }





    /**
     * Get homepage content HTML
     */
    getHomepageContent() {
        return `
            <section id="home-content-section" class="content-section active">
                <div class="page-header">
                    <div class="page-title">
                        <h1>Homepage Content Management</h1>
                        <p>Manage and organize your homepage sections with our intuitive editor.</p>
                    </div>
                </div>

                <!-- Section List View -->
                <div id="sectionList" class="section-list-view">
                    <div class="sections-grid">
                        ${Object.entries(this.sections).map(([key, section]) => `
                            <div class="section-menu-item shimmer-placeholder" data-homepage-section="${key}">
                                <div class="section-header">
                                    <div class="section-icon shimmer-shape shimmer-circle">${section.icon}</div>
                                    <div class="section-info">
                                        <div class="shimmer-shape shimmer-text shimmer-title">${section.name}</div>
                                        <div class="shimmer-shape shimmer-text shimmer-subtitle">Manage ${section.name.toLowerCase()} content</div>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Section Editor View -->
                <div id="sectionEditor" class="section-editor-view" style="display: none;">
                    <!-- Breadcrumb -->
                    <div class="simple-breadcrumb breadcrumb-nav ">
                        <button class=" back-button breadcrumb-back">
                            <i data-lucide="arrow-left"></i>
                            Back to Sections
                        </button>
                        <div class="breadcrumb-path">
                            <span>Homepage</span>
                            <i data-lucide="chevron-right"></i>
                            <span id="currentSectionName">Section Name</span>
                        </div>
                    </div>
                    
                    <!-- Editor content will be loaded here -->
                </div>
            </section>
        `;
    }

    /**
     * Get section editor HTML for specific section
     */
    getSectionEditor(section) {
        const breadcrumb = this.getBreadcrumbHTML(section);
        let editorContent = '';
        
        switch(section) {
            case 'hero':
                editorContent = this.getHeroSectionEditor();
                break;
            case 'quick-facts':
                editorContent = this.getQuickFactsEditor();
                break;
            case 'why-choose-us':
                editorContent = this.getWhyChooseUsEditor();
                break;
            case 'mission':
                editorContent = this.getMissionEditor();
                break;
            case 'programs':
                editorContent = this.getProgramsEditor();
                break;
            case 'neb-toppers':
                editorContent = this.getNEBToppersEditor();
                break;
            case 'alumni':
                editorContent = this.getAlumniEditor();
                break;
            case 'testimonials':
                editorContent = this.getTestimonialsEditor();
                break;
            case 'gallery':
                editorContent = this.getGalleryEditor();
                break;
            case 'contact':
                editorContent = this.getContactEditor();
                break;
            case 'popup-notice':
                editorContent = this.getPopupNoticeEditor();
                break;
            default:
                return '<div class="editor-placeholder">Section editor not found</div>';
        }
        
        return breadcrumb + editorContent;
    }

    /**
     * Get breadcrumb HTML for section
     */
    getBreadcrumbHTML(section) {
        const sectionName = this.sections[section]?.name || 'Unknown Section';
        return `
            <!-- Simple Breadcrumb -->
            <div class="simple-breadcrumb">
                <button class="back-button" data-action="back-to-section-list">
                    <i data-lucide="arrow-left"></i>
                </button>
                <div class="breadcrumb-path">
                    <span>Homepage</span>
                    <i data-lucide="chevron-right"></i>
                    <span id="currentSectionName">${sectionName}</span>
                </div>
            </div>
        `;
    }

    /**
     * Get Hero Section Editor
     */
    getHeroSectionEditor() {
        return `
            <div class="section-editor">
                <div class="editor-header">
                    <div class="editor-title">
                        <span class="section-icon">🎯</span>
                        <h2>Hero Section</h2>
                    </div>
                    <p>Configure the main banner section that appears at the top of your homepage.</p>
                </div>
                
                <div class="editor-content">
                    <form class="section-form" id="heroForm">
                        <div class="form-group">
                            <label for="heroTitle">Main Title</label>
                            <input type="text" id="heroTitle" name="heroTitle" class="form-input" placeholder="Enter your main title">
                        </div>
                        
                        <div class="form-group">
                            <label for="heroSubtitle">Subtitle</label>
                            <input type="text" id="heroSubtitle" name="heroSubtitle" class="form-input" placeholder="Enter subtitle">
                        </div>
                        
                        <div class="form-group">
                            <label for="heroDescription">Description</label>
                            <textarea id="heroDescription" name="heroDescription" class="form-textarea" rows="4" placeholder="Enter description"></textarea>
                        </div>
                        
                            <div class="form-group">
                                <label for="heroButton1Text">Primary Button Text</label>
                                <input type="text" id="heroButton1Text" name="heroButton1Text" class="form-input" placeholder="Button text">
                        </div>
                        
                            <div class="form-group">
                                <label for="heroButton2Text">Secondary Button Text</label>
                                <input type="text" id="heroButton2Text" name="heroButton2Text" class="form-input" placeholder="Button text">
                        </div>
                        
                        <div class="form-group">
                            <label for="heroBackgroundImage">Background Media (Image or Video)</label>
                            ${ImageUpload.createHTML({
                                fileInputId: 'heroBackgroundImageUpload',
                                urlInputId: 'heroBackgroundImage',
                                selectBtnId: 'heroBackgroundImageSelect',
                                previewContainerId: 'heroBackgroundImagePreview',
                                previewImgId: 'heroBackgroundImagePreviewImg',
                                removeBtnId: 'heroBackgroundImageRemove',
                                buttonText: 'Select Background Media',
                                helpText: 'Images (PNG, JPG, GIF) or Videos (MP4, WebM, OGG, MOV) up to 200MB. Videos compressed to 720p immediately when selected.',
                                existingImageUrl: '',
                                allowVideo: true
                            })}
                        </div>
                    </form>
                </div>
                
                <div class="editor-actions">
                    <button class="btn btn-primary save-section-btn" data-section="hero">
                        <i data-lucide="save"></i>
                        Save Hero Section
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Get Quick Facts Editor
     */
    getQuickFactsEditor() {
        return `
            <div class="section-editor">
                <div class="editor-header">
                    <div class="editor-title">
                        <span class="section-icon">📊</span>
                        <h2>Quick Facts</h2>
                    </div>
                    <p>Manage the key statistics and facts displayed on your homepage.</p>
                </div>
                
                <div class="editor-content">
                    <div class="tabs-container">
                        <div class="tabs-nav">
                            <button class="tab-btn active" data-tab="fact1">Fact 1</button>
                            <button class="tab-btn" data-tab="fact2">Fact 2</button>
                            <button class="tab-btn" data-tab="fact3">Fact 3</button>
                            <button class="tab-btn" data-tab="fact4">Fact 4</button>
                        </div>
                        
                        <div class="tab-content active" id="fact1">
                            <form class="section-form">
                                <div class="form-group">
                                    <label for="fact1Number">Number</label>
                                    <input type="text" id="fact1Number" name="fact1Number" class="form-input" placeholder="250+">
                                </div>
                                <div class="form-group">
                                    <label for="fact1Label">Label</label>
                                    <input type="text" id="fact1Label" name="fact1Label" class="form-input" placeholder="Students">
                                </div>
                            </form>
                        </div>
                        
                        <div class="tab-content" id="fact2">
                            <form class="section-form">
                                <div class="form-group">
                                    <label for="fact2Number">Number</label>
                                    <input type="text" id="fact2Number" name="fact2Number" class="form-input" placeholder="50+">
                                </div>
                                <div class="form-group">
                                    <label for="fact2Label">Label</label>
                                    <input type="text" id="fact2Label" name="fact2Label" class="form-input" placeholder="Teachers">
                                </div>
                            </form>
                        </div>
                        
                        <div class="tab-content" id="fact3">
                            <form class="section-form">
                                <div class="form-group">
                                    <label for="fact3Number">Number</label>
                                    <input type="text" id="fact3Number" name="fact3Number" class="form-input" placeholder="15+">
                                </div>
                                <div class="form-group">
                                    <label for="fact3Label">Label</label>
                                    <input type="text" id="fact3Label" name="fact3Label" class="form-input" placeholder="Years Experience">
                                </div>
                            </form>
                        </div>
                        
                        <div class="tab-content" id="fact4">
                            <form class="section-form">
                                <div class="form-group">
                                    <label for="fact4Number">Number</label>
                                    <input type="text" id="fact4Number" name="fact4Number" class="form-input" placeholder="95%">
                                </div>
                                <div class="form-group">
                                    <label for="fact4Label">Label</label>
                                    <input type="text" id="fact4Label" name="fact4Label" class="form-input" placeholder="Success Rate">
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                
                <div class="editor-actions">
                    <button class="btn btn-primary save-section-btn" data-section="quick-facts">
                        <i data-lucide="save"></i>
                        Save Quick Facts
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Get Why Choose Us Editor
     */
    getWhyChooseUsEditor() {
        return `
            <div class="section-editor">
                <div class="editor-header">
                    <div class="editor-title">
                        <span class="section-icon">⭐</span>
                        <h2>Why Choose Us</h2>
                    </div>
                    <p>Highlight the key benefits and advantages of choosing your school.</p>
                </div>
                
                <div class="editor-content">
                    <form class="section-form" id="whyChooseUsForm">
                        <div class="form-group">
                            <label for="whyChooseUsTitle">Section Title</label>
                            <input type="text" id="whyChooseUsTitle" name="whyChooseUsTitle" class="form-input" placeholder="Why Choose Our School?">
                        </div>
                        
                        <div class="form-group">
                            <label for="why-choose-background">Background Image</label>
                            <div class="image-upload-container">
                                <input type="file" id="why-choose-background-upload" class="image-upload-input" accept="image/*" style="display: none;">
                                <button type="button" id="why-choose-background-select-btn" class="btn btn-outline image-select-btn">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="upload" class="lucide lucide-upload"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7,10 12,15 17,10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                                    Select Background Image
                                </button>
                                <div class="image-preview-container" id="why-choose-background-preview-container" style="display: none;">
                                    <img id="why-choose-background-preview" class="image-preview" alt="Preview">
                                    <button type="button" id="why-choose-background-remove-btn" class="btn btn-sm btn-danger image-remove-btn">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="trash-2" class="lucide lucide-trash-2"><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                        Remove
                                    </button>
                                </div>
                                <input type="hidden" id="why-choose-background-url" name="backgroundImageUrl">
                            </div>
                            <small class="form-help">Upload background image for Why Choose Us section (PNG, JPG, GIF up to 2MB)</small>
                        </div>
                        
                        <div class="benefits-container">
                            <h4>Benefits</h4>
                            <div class="benefit-item">
                                <div class="form-group">
                                    <label for="benefit1Title">Benefit 1 Title</label>
                                    <input type="text" id="benefit1Title" name="benefit1Title" class="form-input" placeholder="Expert Faculty">
                                </div>
                                <div class="form-group">
                                    <label for="benefit1Description">Benefit 1 Description</label>
                                    <textarea id="benefit1Description" name="benefit1Description" class="form-textarea" rows="2" placeholder="Description"></textarea>
                                </div>
                                <div class="form-group">
                                    <label for="benefit1Icon">Benefit 1 Icon</label>
                                    <input type="text" id="benefit1Icon" name="benefit1Icon" class="form-input" placeholder="users">
                                </div>
                            </div>
                            
                            <div class="benefit-item">
                                <div class="form-group">
                                    <label for="benefit2Title">Benefit 2 Title</label>
                                    <input type="text" id="benefit2Title" name="benefit2Title" class="form-input" placeholder="Modern Facilities">
                                </div>
                                <div class="form-group">
                                    <label for="benefit2Description">Benefit 2 Description</label>
                                    <textarea id="benefit2Description" name="benefit2Description" class="form-textarea" rows="2" placeholder="Description"></textarea>
                                </div>
                                <div class="form-group">
                                    <label for="benefit2Icon">Benefit 2 Icon</label>
                                    <input type="text" id="benefit2Icon" name="benefit2Icon" class="form-input" placeholder="building">
                                </div>
                            </div>
                            
                            <div class="benefit-item">
                                <div class="form-group">
                                    <label for="benefit3Title">Benefit 3 Title</label>
                                    <input type="text" id="benefit3Title" name="benefit3Title" class="form-input" placeholder="Holistic Development">
                                </div>
                                <div class="form-group">
                                    <label for="benefit3Description">Benefit 3 Description</label>
                                    <textarea id="benefit3Description" name="benefit3Description" class="form-textarea" rows="2" placeholder="Description"></textarea>
                                </div>
                                <div class="form-group">
                                    <label for="benefit3Icon">Benefit 3 Icon</label>
                                    <input type="text" id="benefit3Icon" name="benefit3Icon" class="form-input" placeholder="activity">
                                </div>
                            </div>
                            
                            <div class="benefit-item">
                                <div class="form-group">
                                    <label for="benefit4Title">Benefit 4 Title</label>
                                    <input type="text" id="benefit4Title" name="benefit4Title" class="form-input" placeholder="Student Success">
                                </div>
                                <div class="form-group">
                                    <label for="benefit4Description">Benefit 4 Description</label>
                                    <textarea id="benefit4Description" name="benefit4Description" class="form-textarea" rows="2" placeholder="Description"></textarea>
                                </div>
                                <div class="form-group">
                                    <label for="benefit4Icon">Benefit 4 Icon</label>
                                    <input type="text" id="benefit4Icon" name="benefit4Icon" class="form-input" placeholder="trophy">
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                
                <div class="editor-actions">
                    <button class="btn btn-primary save-section-btn" data-section="why-choose-us">
                        <i data-lucide="save"></i>
                        Save Why Choose Us
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Get Mission Editor
     */
    getMissionEditor() {
        return `
            <div class="section-editor">
                <div class="editor-header">
                    <div class="editor-title">
                        <span class="section-icon">🎯</span>
                        <h2>Mission & Vision</h2>
                    </div>
                    <p>Define your school's mission, vision, and core values.</p>
                </div>
                
                <div class="editor-content">
                    <form class="section-form" id="missionForm">
                        <div class="form-group">
                            <label for="missionTitle">Section Title</label>
                            <input type="text" id="missionTitle" name="missionTitle" class="form-input" placeholder="Our Mission & Vision">
                        </div>
                        
                        <div class="mission-grid">
                            <div class="mission-item">
                                <h4>Mission Statement</h4>
                                <div class="form-group">
                                    <label for="missionStatement">Mission</label>
                                    <textarea id="missionStatement" name="missionStatement" class="form-textarea" rows="4" placeholder="Our mission statement..."></textarea>
                                </div>
                            </div>
                            
                            <div class="mission-item">
                                <h4>Vision Statement</h4>
                                <div class="form-group">
                                    <label for="visionStatement">Vision</label>
                                    <textarea id="visionStatement" name="visionStatement" class="form-textarea" rows="4" placeholder="Our vision statement..."></textarea>
                                </div>
                            </div>
                        </div>
                        
                        <div class="values-container">
                            <h4>Core Values</h4>
                            <div class="form-group">
                                <label for="coreValues">Core Values</label>
                                <textarea id="coreValues" name="coreValues" class="form-textarea" rows="4" placeholder="Excellence, Integrity, Innovation, Compassion, and Respect"></textarea>
                            </div>
                        </div>
                    </form>
                </div>
                
                <div class="editor-actions">
                    <button class="btn btn-primary save-section-btn" data-section="mission">
                        <i data-lucide="save"></i>
                        Save Mission & Vision
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Get Programs Editor
     */
    getProgramsEditor() {
        return `
            <div class="section-editor">
                <div class="editor-header">
                    <div class="editor-title">
                        <span class="section-icon">📚</span>
                        <h2>Academic Programs</h2>
                    </div>
                    <p>Select grade levels from your academics page to display on the homepage.</p>
                </div>
                
                <div class="editor-content">
                    <form class="section-form" id="programsForm">
                        <div class="form-group">
                            <label for="programsTitle">Section Title</label>
                            <input type="text" id="programsTitle" name="programsTitle" class="form-input" placeholder="Our Academic Programs">
                        </div>
                        
                        <div class="form-group">
                            <label for="programsSubtitle">Section Subtitle</label>
                            <input type="text" id="programsSubtitle" name="programsSubtitle" class="form-input" placeholder="Comprehensive education for every student">
                        </div>
                        
                        <div class="gallery-selection-section">
                            <div class="section-header">
                                <h4>Selected Grade Levels</h4>
                                <p class="help-text">Select up to 4 grade levels to display on the homepage</p>
                            </div>
                            
                            <div id="selected-programs-container" class="selected-testimonials-grid">
                                <!-- Selected programs will be dynamically added here -->
                            </div>
                            
                            <button type="button" class="btn btn-secondary" id="add-program-btn">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="plus" class="lucide lucide-plus"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
                                Add Grade Level
                            </button>
                        </div>
                    </form>
                </div>
                
                <div class="editor-actions">
                    <button class="btn btn-primary save-section-btn" data-section="programs">
                        <i data-lucide="save"></i>
                        Save Academic Programs
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Get NEB Toppers Editor
     */
    getNEBToppersEditor() {
        return `
            <div class="section-editor">
                <div class="editor-header">
                    <div class="editor-title">
                        <span class="section-icon">🏆</span>
                        <h2>NEB Board Toppers</h2>
                    </div>
                    <button type="button" class="btn btn-primary" id="add-new-topper-btn" style="margin-left: auto;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 8v8"></path><path d="M8 12h8"></path></svg>
                        Add New Topper
                    </button>
                </div>
                
                <div class="editor-content">
                    <form class="section-form" id="nebToppersForm">
                        <div class="toppers-management-section">
                            <div class="neb-controls" style="margin-bottom: 24px;">
                                <div class="search-container" style="position: relative; margin-bottom: 20px;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: #9ca3af;">
                                        <circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.35-4.35"></path>
                                    </svg>
                                    <input type="text" id="toppers-search" class="form-input" placeholder="Search by name, year, GPA..." style="padding-left: 48px; border-radius: 12px; border: 1px solid #e5e7eb; height: 48px;">
                                </div>
                                
                                <div class="filter-tabs" style="display: flex; gap: 12px; border-bottom: 2px solid #f3f4f6; margin-bottom: 24px;">
                                    <button type="button" class="filter-tab active" data-filter="all" style="padding: 12px 24px; border: none; background: none; font-weight: 600; color: #2563eb; border-bottom: 2px solid #2563eb; margin-bottom: -2px; cursor: pointer; transition: all 0.2s;">All</button>
                                    <button type="button" class="filter-tab" data-filter="top-achievers" style="padding: 12px 24px; border: none; background: none; font-weight: 600; color: #6b7280; cursor: pointer; transition: all 0.2s;">Top Achievers</button>
                                </div>
                            </div>
                            
                            <div class="toppers-table-wrapper" style="background: white; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;">
                                <table class="toppers-table" style="width: 100%; border-collapse: collapse;">
                                    <thead style="background: #f9fafb; border-bottom: 1px solid #e5e7eb;">
                                        <tr>
                                            <th style="padding: 16px; text-align: left; font-weight: 600; font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Photo</th>
                                            <th style="padding: 16px; text-align: left; font-weight: 600; font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Name</th>
                                            <th style="padding: 16px; text-align: left; font-weight: 600; font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Year<br/>(Batch)</th>
                                            <th style="padding: 16px; text-align: left; font-weight: 600; font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">GPA /<br/>Percentage</th>
                                            <th style="padding: 16px; text-align: left; font-weight: 600; font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Quote / Message</th>
                                            <th style="padding: 16px; text-align: center; font-weight: 600; font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody id="toppers-table-body">
                                        <!-- Toppers will be dynamically added here -->
                                    </tbody>
                                </table>
                                <div id="toppers-empty-state" class="empty-state" style="padding: 4rem 2rem; text-align: center; display: none;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin: 0 auto 1rem; color: #d1d5db;">
                                        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
                                    </svg>
                                    <p style="color: #6b7280; font-size: 16px; margin: 0;">No NEB toppers added yet. Click "Add New Topper" to add top performers.</p>
                                </div>
                            </div>
                            
                            <div id="toppers-pagination" class="pagination-wrapper" style="display: none; margin-top: 1.5rem; justify-content: center; align-items: center; gap: 8px;">
                                <!-- Pagination will be added here -->
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        `;
    }

    /**
     * Get Alumni Editor
     */
    getAlumniEditor() {
        return `
            <div class="section-editor alumni-management">
                <div class="editor-header">
                    <div class="editor-title">
                        <span class="section-icon">🎓</span>
                        <h2>Marigold Alumni</h2>
                    </div>
                    <button type="button" class="btn btn-primary" id="add-new-alumni-btn" style="margin-left: auto;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 8v8"></path><path d="M8 12h8"></path></svg>
                        Add New Alumni
                    </button>
                </div>
                
                <div class="editor-content">
                    <!-- Search and Filters -->
                    <div class="alumni-controls" style="margin-bottom: 24px;">
                        <div class="search-container" style="position: relative; margin-bottom: 20px;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: #9ca3af;">
                                <circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.35-4.35"></path>
                            </svg>
                            <input type="text" id="alumni-search" class="form-input" placeholder="Search by name, batch, profession..." style="padding-left: 48px; border-radius: 12px; border: 1px solid #e5e7eb; height: 48px;">
                        </div>
                        
                        <div class="filter-tabs" style="display: flex; gap: 12px; border-bottom: 2px solid #f3f4f6; margin-bottom: 24px;">
                            <button class="filter-tab active" data-filter="all" style="padding: 12px 24px; border: none; background: none; font-weight: 600; color: #2563eb; border-bottom: 2px solid #2563eb; margin-bottom: -2px; cursor: pointer; transition: all 0.2s;">All</button>
                            <button class="filter-tab" data-filter="top-achievers" style="padding: 12px 24px; border: none; background: none; font-weight: 600; color: #6b7280; cursor: pointer; transition: all 0.2s;">Top Achievers</button>
                        </div>
                    </div>
                    
                    <!-- Alumni Table -->
                    <div class="alumni-table-container" style="background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                        <table class="alumni-table" style="width: 100%; border-collapse: collapse;">
                            <thead style="background: #f9fafb; border-bottom: 1px solid #e5e7eb;">
                                <tr>
                                    <th style="padding: 16px 24px; text-align: left; font-size: 12px; font-weight: 600; text-transform: uppercase; color: #6b7280; letter-spacing: 0.05em;">Photo</th>
                                    <th style="padding: 16px 24px; text-align: left; font-size: 12px; font-weight: 600; text-transform: uppercase; color: #6b7280; letter-spacing: 0.05em;">Name</th>
                                    <th style="padding: 16px 24px; text-align: left; font-size: 12px; font-weight: 600; text-transform: uppercase; color: #6b7280; letter-spacing: 0.05em;">Batch Year</th>
                                    <th style="padding: 16px 24px; text-align: left; font-size: 12px; font-weight: 600; text-transform: uppercase; color: #6b7280; letter-spacing: 0.05em;">Profession / University</th>
                                    <th style="padding: 16px 24px; text-align: left; font-size: 12px; font-weight: 600; text-transform: uppercase; color: #6b7280; letter-spacing: 0.05em;">Quote / Testimonial</th>
                                    <th style="padding: 16px 24px; text-align: right; font-size: 12px; font-weight: 600; text-transform: uppercase; color: #6b7280; letter-spacing: 0.05em;">Actions</th>
                                </tr>
                            </thead>
                            <tbody id="alumni-table-body">
                                <!-- Table rows will be populated here -->
                                <tr>
                                    <td colspan="6" style="padding: 60px 24px; text-align: center; color: #9ca3af;">
                                        <div style="display: flex; flex-direction: column; align-items: center; gap: 12px;">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                                                <circle cx="9" cy="7" r="4"></circle>
                                                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                                                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                            </svg>
                                            <p>Loading alumni...</p>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        
                        <!-- Pagination -->
                        <div class="alumni-pagination" style="display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; border-top: 1px solid #e5e7eb;">
                            <div class="pagination-info" style="color: #6b7280; font-size: 14px;">
                                Showing <span id="pagination-start">1</span> to <span id="pagination-end">10</span> of <span id="pagination-total">1</span> results
                            </div>
                            <div class="pagination-controls" style="display: flex; gap: 8px;" id="pagination-numbers">
                                <!-- Page numbers will be dynamically inserted here -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Get Testimonials Editor
     */
    getTestimonialsEditor() {
        return `
            <div class="section-editor">
                <div class="editor-header">
                    <div class="editor-title">
                        <span class="section-icon">💬</span>
                        <h2>Testimonials</h2>
                    </div>
                    <p>Manage student and parent testimonials displayed on your homepage.</p>
                </div>
                
                <div class="editor-content">
                    <form class="section-form" id="testimonialsForm">
                        <div class="form-group">
                            <label for="testimonialsTitle">Section Title</label>
                            <input type="text" id="testimonialsTitle" name="testimonialsTitle" class="form-input" placeholder="What Our Community Says">
                        </div>
                        
                        <div class="form-group">
                            <label for="testimonialsSubtitle">Section Subtitle</label>
                            <input type="text" id="testimonialsSubtitle" name="testimonialsSubtitle" class="form-input" placeholder="Hear from our community">
                            </div>
                            
                        <div class="testimonials-selection-section">
                            <div class="section-header">
                                <h4>Selected Testimonials</h4>
                                <p class="help-text">Select up to 6 testimonials to display on the homepage</p>
                                </div>
                            
                            <div id="selected-testimonials-container" class="selected-testimonials-grid">
                                <!-- Selected testimonials will be dynamically added here -->
                            </div>
                            
                            <button type="button" class="btn btn-secondary" id="add-testimonial-btn">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="plus" class="lucide lucide-plus"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
                                Add Testimonial
                            </button>
                        </div>
                    </form>
                </div>
                
                <div class="editor-actions">
                    <button class="btn btn-primary save-section-btn" data-section="testimonials">
                        <i data-lucide="save"></i>
                        Save Testimonials
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Get Gallery Editor
     */
    getGalleryEditor() {
        return `
            <div class="section-editor">
                <div class="editor-header">
                    <div class="editor-title">
                        <span class="section-icon">🖼️</span>
                        <h2>Gallery</h2>
                    </div>
                    <p>Select photo albums from your gallery to display on the homepage.</p>
                </div>
                
                <div class="editor-content">
                    <form class="section-form" id="galleryForm">
                        <div class="form-group">
                            <label for="galleryTitle">Section Title</label>
                            <input type="text" id="galleryTitle" name="galleryTitle" class="form-input" placeholder="School Gallery">
                        </div>
                        
                        <div class="form-group">
                            <label for="gallerySubtitle">Section Subtitle</label>
                            <input type="text" id="gallerySubtitle" name="gallerySubtitle" class="form-input" placeholder="Explore our campus and facilities">
                        </div>
                        
                        <div class="gallery-selection-section">
                            <div class="section-header">
                                <h4>Selected Photo Albums</h4>
                                <p class="help-text">Select up to 6 photo albums to display on the homepage</p>
                        </div>
                        
                            <div id="selected-albums-container" class="selected-testimonials-grid">
                                <!-- Selected albums will be dynamically added here -->
                            </div>
                            
                            <button type="button" class="btn btn-secondary" id="add-album-btn">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="plus" class="lucide lucide-plus"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
                                Add Photo Album
                            </button>
                        </div>
                    </form>
                </div>
                
                <div class="editor-actions">
                    <button class="btn btn-primary save-section-btn" data-section="gallery">
                        <i data-lucide="save"></i>
                        Save Gallery
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Get Contact Editor
     */
    getContactEditor() {
        return `
            <div class="section-editor">
                <div class="editor-header">
                    <div class="editor-title">
                        <span class="section-icon">📞</span>
                        <h2>Contact Section</h2>
                    </div>
                    <p>Configure the contact information displayed on your homepage.</p>
                </div>
                
                <div class="editor-content">
                    <form class="section-form" id="contactForm">
                        <div class="form-group">
                            <label for="contactTitle">Section Title</label>
                            <input type="text" id="contactTitle" name="contactTitle" class="form-input" placeholder="Get in Touch">
                        </div>
                        
                        <div class="form-group">
                            <label for="contactSubtitle">Section Subtitle</label>
                            <input type="text" id="contactSubtitle" name="contactSubtitle" class="form-input" placeholder="We'd love to hear from you">
                        </div>
                        
                        <div class="contact-grid">
                            <div class="contact-item">
                                <h4>Contact Information</h4>
                                <div class="form-group">
                                    <label for="contactPhone">Phone Number</label>
                                    <input type="text" id="contactPhone" name="contactPhone" class="form-input" placeholder="+1 (555) 123-4567">
                                </div>
                                <div class="form-group">
                                    <label for="contactEmail">Email Address</label>
                                    <input type="email" id="contactEmail" name="contactEmail" class="form-input" placeholder="info@school.com">
                                </div>
                                <div class="form-group">
                                    <label for="contactAddress">Address</label>
                                    <textarea id="contactAddress" name="contactAddress" class="form-textarea" rows="3" placeholder="123 School Street, City, State 12345"></textarea>
                                </div>
                            </div>
                            
                            <div class="contact-item">
                                <h4>Business Hours</h4>
                                <div class="form-group">
                                    <label for="businessHours">Hours</label>
                                    <textarea id="businessHours" name="businessHours" class="form-textarea" rows="4" placeholder="Monday - Friday: 8:00 AM - 5:00 PM&#10;Saturday: 9:00 AM - 2:00 PM&#10;Sunday: Closed"></textarea>
                                </div>
                            </div>
                        </div>
                        
                    </form>
                </div>
                
                <div class="editor-actions">
                    <button class="btn btn-primary save-section-btn" data-section="contact">
                        <i data-lucide="save"></i>
                        Save Contact Section
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Get Pop-Up Notice Editor
     */
    getPopupNoticeEditor() {
        return `
            <div class="section-editor">
                <div class="editor-header">
                    <div class="editor-title">
                        <span class="section-icon">🔔</span>
                        <h2>Pop-Up Notice</h2>
                    </div>
                    <p>Configure a pop-up notice that appears when visitors first arrive at your homepage.</p>
                </div>
                
                <div class="editor-content">
                    <div class="section-actions" style="margin-bottom: 20px;">
                        <button type="button" class="btn btn-primary" id="addPopupNoticeBtn">
                            <i data-lucide="plus"></i>
                            Add New Popup Notice
                        </button>
                    </div>
                    
                    <div class="table-container">
                        <table class="data-table" id="popupNoticesTable">
                            <thead>
                                <tr>
                                    <th style="width: 100px;">Preview</th>
                                    <th>Image URL</th>
                                    <th style="width: 100px;">Status</th>
                                    <th style="width: 120px; text-align: center;">Actions</th>
                                </tr>
                            </thead>
                            <tbody id="popupNoticesTableBody">
                                <tr>
                                    <td colspan="4" style="text-align: center; padding: 40px; color: #6b7280;">
                                        No popup notices yet. Click "Add New Popup Notice" to create one.
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            
            <!-- Popup Notice Modal -->
            <div id="popupNoticeModal" class="modal-overlay" style="display: none;">
                <div class="modal-content" style="max-width: 600px;">
                    <div class="modal-header">
                        <h3 id="popupNoticeModalTitle">Add Popup Notice</h3>
                        <button class="modal-close" id="closePopupNoticeModal">
                            <i data-lucide="x"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form id="popupNoticeForm">
                            <input type="hidden" id="popupNoticeEditId">
                            <input type="hidden" id="popupNoticeImageUrl">
                            
                            <div class="form-group">
                                <label for="popupNoticeImageUrl">Notice Image</label>
                                <div class="image-upload-container">
                                    <div class="image-preview" id="popupNoticeImagePreview" style="display: none; margin-bottom: 10px;">
                                        <img id="popupNoticePreviewImg" src="" alt="Preview" style="max-width: 100%; height: auto; border-radius: 8px; border: 1px solid #e5e7eb;">
                                        <button type="button" class="btn btn-sm btn-danger" id="removePopupNoticeImageBtn" style="margin-top: 10px;">
                                            <i data-lucide="x"></i>
                                            Remove Image
                                        </button>
                                    </div>
                                    <input type="file" id="popupNoticeImageFile" accept="image/*" style="display: none;">
                                    <button type="button" class="btn btn-secondary" id="selectPopupNoticeImageBtn">
                                        <i data-lucide="image"></i>
                                        Select Image
                                    </button>
                                    <small class="form-help">Select an image to display in the popup notice. Recommended size: 800x600px or similar aspect ratio.</small>
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label class="checkbox-label">
                                    <input type="checkbox" id="popupNoticeItemEnabled" checked>
                                    <span>Active</span>
                                </label>
                                <small class="form-help">Only active notices will be shown to visitors.</small>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" id="cancelPopupNoticeBtn">Cancel</button>
                        <button class="btn btn-primary" id="savePopupNoticeItemBtn">
                            <i data-lucide="save"></i>
                            Save Notice
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Switch tab content
     */
    switchTab(tabId) {
        // Remove active class from all tabs and content
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        
        // Add active class to selected tab and content
        document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
        document.getElementById(tabId).classList.add('active');
    }

    /**
     * Toggle accordion item
     */
    toggleAccordion(item) {
        const content = item.querySelector('.program-content');
        const toggle = item.querySelector('.accordion-toggle');
        
        if (content.style.display === 'none' || !content.style.display) {
            content.style.display = 'block';
            toggle.textContent = 'Collapse';
        } else {
            content.style.display = 'none';
            toggle.textContent = 'Expand';
        }
    }

    /**
     * Update breadcrumb navigation
     */
    updateBreadcrumb(section) {
        const sectionName = this.sections[section]?.name || 'Unknown Section';
        const currentSectionName = document.getElementById('currentSectionName');
        if (currentSectionName) {
            currentSectionName.textContent = sectionName;
        }
    }

    /**
     * Update section status indicator
     */
    updateSectionStatus(section) {
        const sectionItem = document.querySelector(`[data-homepage-section="${section}"]`);
        
        if (sectionItem) {
            const statusIndicator = sectionItem.querySelector('.status-indicator');
            
            if (statusIndicator) {
                // Update status indicator
                if (this.sections[section].enabled) {
                    statusIndicator.textContent = '🟢 Active';
                    statusIndicator.className = 'status-indicator active';
                } else {
                    statusIndicator.textContent = '🔴 Hidden';
                    statusIndicator.className = 'status-indicator inactive';
                }
            }
        }
    }

    /**
     * Load section data from API
     */
    async loadSectionData(section) {
        try {
            // Always fetch fresh data from API (no caching)
            
            // Add cache-busting parameter to force fresh data
            const cacheBuster = `?t=${Date.now()}`;
            const response = await fetch(`/api/content/home${cacheBuster}`, {
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                }
            });
            const data = await response.json();
            
            
            // Update in-memory data
            if (data.success && data.content) {
                this.homepageData = data.content;
            }
            
            if (data.success && data.content) {
                await this.populateSectionForm(section, data.content);
            }
        } catch (error) {
            console.error('Error loading section data:', error);
        }
    }

    /**
     * Populate section form with data
     */
    async populateSectionForm(section, content) {
        
        switch(section) {
            case 'hero':
                if (content.hero) {
                    if (document.getElementById('heroTitle')) document.getElementById('heroTitle').value = content.hero.title || '';
                    if (document.getElementById('heroSubtitle')) document.getElementById('heroSubtitle').value = content.hero.badge || '';
                    if (document.getElementById('heroDescription')) document.getElementById('heroDescription').value = content.hero.description || '';
                    if (document.getElementById('heroButton1Text')) document.getElementById('heroButton1Text').value = content.hero.primaryButton?.text || '';
                    if (document.getElementById('heroButton2Text')) document.getElementById('heroButton2Text').value = content.hero.secondaryButton?.text || '';
                    
                    // Handle background image with ImageUpload component
                    if (document.getElementById('heroBackgroundImage')) {
                        const backgroundImageUrl = content.hero.backgroundImage || '';
                        document.getElementById('heroBackgroundImage').value = backgroundImageUrl;
                        
                        // If ImageUpload component is initialized, update it
                        if (window.heroImageUpload && window.heroImageUpload.setImageUrl) {
                            window.heroImageUpload.setImageUrl(backgroundImageUrl);
                        }
                    }
                }
                break;
                
            case 'quick-facts':
                if (content.quickFacts) {
                    if (document.getElementById('quickFactsTitle')) document.getElementById('quickFactsTitle').value = content.quickFacts.title || '';
                    if (document.getElementById('quickFactsEnabled')) document.getElementById('quickFactsEnabled').checked = content.quickFacts.enabled !== false;
                    
                    if (content.quickFacts.facts) {
                        content.quickFacts.facts.forEach((fact, index) => {
                            const i = index + 1;
                            if (document.getElementById(`fact${i}Number`)) document.getElementById(`fact${i}Number`).value = fact.number || '';
                            if (document.getElementById(`fact${i}Label`)) document.getElementById(`fact${i}Label`).value = fact.label || '';
                            if (document.getElementById(`fact${i}Icon`)) document.getElementById(`fact${i}Icon`).value = fact.icon || '';
                        });
                    }
                }
                break;
                
            case 'why-choose-us':
                if (content.whyChoose) {
                    if (document.getElementById('whyChooseUsTitle')) {
                        document.getElementById('whyChooseUsTitle').value = content.whyChoose.title || '';
                    } else {
                    }
                    if (document.getElementById('whyChooseEnabled')) {
                        document.getElementById('whyChooseEnabled').checked = content.whyChoose.enabled !== false;
                    } else {
                    }
                    
                    // Handle background image
                    const backgroundImageUrl = content.whyChoose.backgroundImage || '';
                    const backgroundUrlInput = document.getElementById('why-choose-background-url');
                    if (backgroundUrlInput) {
                        backgroundUrlInput.value = backgroundImageUrl;
                    }
                    
                    // Display existing background image if available
                    if (backgroundImageUrl) {
                        const previewContainer = document.getElementById('why-choose-background-preview-container');
                        const previewImg = document.getElementById('why-choose-background-preview');
                        if (previewContainer && previewImg) {
                            previewImg.src = backgroundImageUrl;
                            previewContainer.style.display = 'block';
                        }
                    }
                    
                    // Setup background image upload handlers
                    this.setupWhyChooseBackgroundHandlers();
                    
                    if (content.whyChoose.benefits) {
                        content.whyChoose.benefits.forEach((benefit, index) => {
                            const i = index + 1;
                            if (document.getElementById(`benefit${i}Title`)) {
                                document.getElementById(`benefit${i}Title`).value = benefit.title || '';
                            } else {
                            }
                            if (document.getElementById(`benefit${i}Description`)) {
                                document.getElementById(`benefit${i}Description`).value = benefit.description || '';
                            } else {
                            }
                            if (document.getElementById(`benefit${i}Icon`)) {
                                document.getElementById(`benefit${i}Icon`).value = benefit.icon || '';
                            } else {
                            }
                        });
                    } else {
                    }
                } else {
                }
                break;
                
            case 'mission':
                if (content.mission) {
                    
                    // Add a delay to ensure DOM is ready and try multiple times
                    let attempts = 0;
                    const maxAttempts = 5;
                    const tryPopulate = () => {
                        attempts++;
                        
                        const titleField = document.getElementById('missionTitle');
                        if (titleField) {
                            // Try multiple possible locations for the title
                            const titleValue = content.mission.title || 
                                             content.mission.section_title || 
                                             'Our Mission & Vision'; // fallback
                            titleField.value = titleValue;
                        } else {
                            if (attempts < maxAttempts) {
                                setTimeout(tryPopulate, 200);
                                return;
                            }
                        }
                        
                        // Populate other fields
                        const missionField = document.getElementById('missionStatement');
                        if (missionField) {
                            missionField.value = content.mission.mission?.description || '';
                        } else {
                        }
                        
                        const visionField = document.getElementById('visionStatement');
                        if (visionField) {
                            visionField.value = content.mission.vision?.description || '';
                        } else {
                        }
                        
                        const valuesField = document.getElementById('coreValues');
                        if (valuesField) {
                            valuesField.value = content.mission.values?.description || '';
                        } else {
                        }
                    };
                    
                    // Start the retry process
                    setTimeout(tryPopulate, 100);
                } else {
                }
                break;
                
            case 'programs':
                if (content.programs) {
                    if (document.getElementById('programsTitle')) document.getElementById('programsTitle').value = content.programs.title || '';
                    if (document.getElementById('programsSubtitle')) document.getElementById('programsSubtitle').value = content.programs.subtitle || '';
                    
                    // Setup programs selection handlers
                    this.setupProgramsSelectionHandlers();
                    
                    // Display selected programs
                    const programs = (content.programs.programs && Array.isArray(content.programs.programs)) 
                        ? content.programs.programs 
                        : [];
                    this.displaySelectedPrograms(programs);
                }
                break;
                
            case 'neb-toppers':
                // Load toppers directly from NebTopper table
                this.setupToppersSelectionHandlers();
                await this.loadNebToppersFromDatabase();
                break;
                
            case 'alumni':
                // Setup alumni selection handlers (always needed for Add button)
                this.setupAlumniSelectionHandlers();
                
                if (content.alumni) {
                    if (document.getElementById('alumniTitle')) document.getElementById('alumniTitle').value = content.alumni.title || '';
                    if (document.getElementById('alumniSubtitle')) document.getElementById('alumniSubtitle').value = content.alumni.subtitle || '';
                    
                    // Display selected alumni
                    const alumni = (content.alumni.alumni && Array.isArray(content.alumni.alumni)) 
                        ? content.alumni.alumni 
                        : [];
                    this.displaySelectedAlumni(alumni);
                }
                break;
                
            case 'testimonials':
                if (content.testimonials) {
                    if (document.getElementById('testimonialsTitle')) {
                        document.getElementById('testimonialsTitle').value = content.testimonials.title || '';
                    }
                    if (document.getElementById('testimonialsSubtitle')) {
                        document.getElementById('testimonialsSubtitle').value = content.testimonials.subtitle || '';
                    }
                    
                    // Setup testimonial selection handlers and load selected testimonials
                    this.setupTestimonialSelectionHandlers();
                    
                    // Always display testimonials (even if empty) to show the empty state
                    const items = (content.testimonials.items && Array.isArray(content.testimonials.items)) 
                        ? content.testimonials.items 
                        : [];
                    this.displaySelectedTestimonials(items);
                }
                break;
                
            case 'gallery':
                if (content.gallery) {
                    if (document.getElementById('galleryTitle')) document.getElementById('galleryTitle').value = content.gallery.title || '';
                    if (document.getElementById('gallerySubtitle')) document.getElementById('gallerySubtitle').value = content.gallery.subtitle || '';
                    
                    // Setup gallery album selection handlers
                    this.setupGallerySelectionHandlers();
                    
                    // Load and display selected albums
                    const albums = (content.gallery.items && Array.isArray(content.gallery.items)) 
                        ? content.gallery.items 
                        : [];
                    
                    // Filter out albums with null IDs (legacy data issue)
                    const validAlbums = albums.filter(album => album && album.id !== null && album.id !== undefined);
                    
                    if (validAlbums.length !== albums.length) {
                        console.warn(`⚠️ Filtered out ${albums.length - validAlbums.length} albums with null IDs`);
                        console.warn('💡 These albums need to be re-selected to save with proper IDs');
                    }
                    
                    this.selectedAlbums = validAlbums; // Update the selectedAlbums array
                    this.displaySelectedAlbums(validAlbums);
                }
                break;
                
            case 'contact':
                if (content.contact) {
                    if (document.getElementById('contactTitle')) document.getElementById('contactTitle').value = content.contact.title || '';
                    if (document.getElementById('contactSubtitle')) document.getElementById('contactSubtitle').value = content.contact.subtitle || '';
                    if (document.getElementById('contactAddress')) document.getElementById('contactAddress').value = content.contact.info?.address || '';
                    if (document.getElementById('contactPhone')) document.getElementById('contactPhone').value = content.contact.info?.phone || '';
                    if (document.getElementById('contactEmail')) document.getElementById('contactEmail').value = content.contact.info?.email || '';
                    if (document.getElementById('businessHours')) document.getElementById('businessHours').value = content.contact.info?.hours || '';
                    // Contact section is always enabled (no checkbox in form)
                }
                break;
                
            case 'popup-notice':
                // Load popup notices from new API endpoint
                await this.loadPopupNotices();
                // Initialize button handlers after content is loaded
                this.initPopupNoticeHandlers();
                break;
        }
    }

    /**
     * Collect section data for saving
     */
    collectSectionData(section) {
        const data = {};
        
        switch(section) {
            case 'hero':
                const heroBackgroundValue = document.getElementById('heroBackgroundImage')?.value || '';
                
                data.hero = {
                    title: document.getElementById('heroTitle')?.value || '',
                    badge: document.getElementById('heroSubtitle')?.value || '',
                    description: document.getElementById('heroDescription')?.value || '',
                    primaryButton: {
                        text: document.getElementById('heroButton1Text')?.value || ''
                    },
                    secondaryButton: {
                        text: document.getElementById('heroButton2Text')?.value || ''
                    },
                    backgroundImage: heroBackgroundValue,
                    enabled: true // Hero section is always enabled
                };
                
                break;
                
            case 'quick-facts':
                data.quickFacts = {
                    title: document.getElementById('quickFactsTitle')?.value || '',
                    facts: [],
                    enabled: document.getElementById('quickFactsEnabled')?.checked !== false
                };
                
                // Collect facts
                for (let i = 1; i <= 4; i++) {
                    const number = document.getElementById(`fact${i}Number`)?.value;
                    const label = document.getElementById(`fact${i}Label`)?.value;
                    const icon = document.getElementById(`fact${i}Icon`)?.value;
                    
                    if (number || label) {
                        data.quickFacts.facts.push({
                            number: number || '',
                            label: label || '',
                            icon: icon || ''
                        });
                    }
                }
                break;
                
            case 'why-choose-us':
                data.whyChoose = {
                    title: document.getElementById('whyChooseUsTitle')?.value || '',
                    backgroundImage: document.getElementById('why-choose-background-url')?.value || '',
                    benefits: [],
                    enabled: document.getElementById('whyChooseEnabled')?.checked !== false
                };
                
                // Collect benefits
                for (let i = 1; i <= 4; i++) {
                    const title = document.getElementById(`benefit${i}Title`)?.value;
                    const description = document.getElementById(`benefit${i}Description`)?.value;
                    const icon = document.getElementById(`benefit${i}Icon`)?.value;
                    
                    if (title || description) {
                        data.whyChoose.benefits.push({
                            title: title || '',
                            description: description || '',
                            icon: icon || ''
                        });
                    }
                }
                break;
                
            case 'mission':
                
                const missionTitle = document.getElementById('missionTitle')?.value || '';
                const missionStatement = document.getElementById('missionStatement')?.value || '';
                const visionStatement = document.getElementById('visionStatement')?.value || '';
                const coreValues = document.getElementById('coreValues')?.value || '';
                
                
                data.mission = {
                    title: missionTitle,
                    mission: {
                        title: 'Mission',
                        description: missionStatement
                    },
                    vision: {
                        title: 'Vision',
                        description: visionStatement
                    },
                    values: {
                        title: 'Values',
                        description: coreValues
                    },
                    enabled: true // Always enabled since checkbox is removed
                };
                break;
                
            case 'programs':
                
                // Transform programs to include necessary data including imageUrl
                const transformedPrograms = (this.selectedPrograms || []).map(p => ({
                    key: p.key,
                    title: p.title || '',
                    description: p.description || '',
                    content: p.content || '',
                    icon: p.icon || '',
                    image: p.image || p.imageUrl || '',
                    imageUrl: p.imageUrl || '' // Include imageUrl from database
                }));
                
                
                data.programs = {
                    title: document.getElementById('programsTitle')?.value || '',
                    subtitle: document.getElementById('programsSubtitle')?.value || '',
                    programs: transformedPrograms,
                    enabled: true
                };
                break;
                
            case 'neb-toppers':
                
                // Transform toppers data
                const transformedToppers = (this.selectedToppers || []).map(t => ({
                    id: t.id,
                    name: t.name || '',
                    score: t.score || '',
                    year: t.year || '',
                    program: t.program || '',
                    quote: t.quote || t.message || '',
                    message: t.quote || t.message || '',
                    photo: t.photo || t.imageUrl || '',
                    imageUrl: t.imageUrl || ''
                }));
                
                
                data.nebToppers = {
                    title: 'NEB Board Toppers',
                    subtitle: 'Celebrating academic excellence',
                    toppers: transformedToppers,
                    enabled: true
                };
                break;
                
            case 'alumni':
                
                // Transform alumni data
                const transformedAlumni = (this.selectedAlumni || []).map(a => ({
                    id: a.id,
                    name: a.name || '',
                    graduationYear: a.graduationYear || '',
                    currentPosition: a.currentPosition || '',
                    achievement: a.achievement || '',
                    photo: a.photo || a.imageUrl || '',
                    imageUrl: a.imageUrl || ''
                }));
                
                
                data.alumni = {
                    title: document.getElementById('alumniTitle')?.value || '',
                    subtitle: document.getElementById('alumniSubtitle')?.value || '',
                    alumni: transformedAlumni,
                    enabled: true
                };
                break;
                
            case 'testimonials':
                
                // Transform testimonials from AboutContent format to HomePage format
                const transformedTestimonials = (this.selectedTestimonials || []).map(t => ({
                    id: t.id,
                    name: t.name || t.title || '',
                    handle: t.role || t.content || '',
                    text: t.content || t.description || '',
                    avatar: t.imageUrl || ''
                }));
                
                
                data.testimonials = {
                    title: document.getElementById('testimonialsTitle')?.value || '',
                    subtitle: document.getElementById('testimonialsSubtitle')?.value || '',
                    items: transformedTestimonials,
                    enabled: true
                };
                break;
                
            case 'gallery':
                
                // Transform albums to include necessary data
                const transformedAlbums = (this.selectedAlbums || []).map(a => ({
                    id: a.id,
                    title: a.title || '',
                    description: a.description || '',
                    imageUrl: a.imageUrl || a.thumbnailUrl || '',
                    category: a.category || '',
                    itemCount: a.itemCount || 0
                }));
                
                
                data.gallery = {
                    title: document.getElementById('galleryTitle')?.value || '',
                    subtitle: document.getElementById('gallerySubtitle')?.value || '',
                    items: transformedAlbums,
                    enabled: true
                };
                break;
                
            case 'contact':
                data.contact = {
                    title: document.getElementById('contactTitle')?.value || '',
                    subtitle: document.getElementById('contactSubtitle')?.value || '',
                    info: {
                        address: document.getElementById('contactAddress')?.value || '',
                        phone: document.getElementById('contactPhone')?.value || '',
                        email: document.getElementById('contactEmail')?.value || '',
                        hours: document.getElementById('businessHours')?.value || ''
                    },
                    enabled: true // Always enabled since no checkbox in form
                };
                break;
                
            // Popup notices are now managed separately via /api/admin/popup-notices
            // No longer saved through homecontent table
        }
        
        return data;
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
     * Initialize homepage content functionality
     */
    initializeHomepageContent() {
        // Initialize any homepage content-specific functionality
        this.loadHomepageData();
    }

    /**
     * Load homepage data from API
     */
    async loadHomepageData() {
        try {
            const response = await fetch('/api/content/home');
            const data = await response.json();
            
            if (data.success && data.content) {
                this.homepageData = data.content;
                
                
                // Update section enabled states based on data
                Object.keys(this.sections).forEach(sectionKey => {
                    const sectionData = data.content[this.getSectionKey(sectionKey)];
                    if (sectionData && typeof sectionData.enabled === 'boolean') {
                        this.sections[sectionKey].enabled = sectionData.enabled;
                    }
                });
                
                // Remove shimmer placeholders and show actual content
                this.removeShimmerPlaceholders();
                
                // Update all toggle switches after setting all section states
                Object.keys(this.sections).forEach(sectionKey => {
                    this.updateSectionStatus(sectionKey);
                });
                
                await this.populateForms(data.content);
            }
        } catch (error) {
            console.error('Error loading homepage data:', error);
        }
    }

    /**
     * Remove shimmer placeholders and show actual content
     */
    removeShimmerPlaceholders() {
        const sectionMenuItems = document.querySelectorAll('.section-menu-item.shimmer-placeholder');
        sectionMenuItems.forEach(item => {
            // Remove shimmer classes
            item.classList.remove('shimmer-placeholder');
            
            // Update the content with actual data
            const sectionKey = item.dataset.homepageSection;
            const section = this.sections[sectionKey];
            
            if (section) {
                // Update section info
                const sectionInfo = item.querySelector('.section-info');
                if (sectionInfo) {
                    sectionInfo.innerHTML = `
                        <h3>${section.name}</h3>
                        <p>Manage ${section.name.toLowerCase()} content</p>
                    `;
                }
                
            }
        });
    }

    /**
     * Get section key for data mapping
     */
    getSectionKey(sectionKey) {
        const keyMap = {
            'hero': 'hero',
            'quick-facts': 'quickFacts',
            'why-choose-us': 'whyChoose',
            'mission': 'mission',
            'programs': 'programs',
            'testimonials': 'testimonials',
            'gallery': 'gallery',
            'contact': 'contact'
        };
        return keyMap[sectionKey] || sectionKey;
    }

    /**
     * Populate forms with data
     */
    async populateForms(data) {
        // Store the data for later use when sections are loaded
        this.homepageData = data;
        
        // If we're currently viewing a section editor, populate it immediately
        const sectionEditor = document.getElementById('sectionEditor');
        if (sectionEditor && sectionEditor.style.display !== 'none' && this.currentSubsection) {
            await this.populateSectionForm(this.currentSubsection, data);
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

        // Add active class to current section
        const currentLink = document.querySelector('[data-section="home-content"]');
        if (currentLink) {
            currentLink.classList.add('active');
        }
    }

    /**
     * Initialize homepage content functionality
     */
    initializeHomepageContent() {
        // Initialize any additional functionality needed for homepage content
        // This method can be expanded as needed
    }

    /**
     * Set up section menu item click handlers
     */
    setupSectionMenuClicks() {
        // Add event delegation for section menu item clicks
        document.addEventListener('click', (e) => {
            const sectionMenuItem = e.target.closest('.section-menu-item');
            if (sectionMenuItem && sectionMenuItem.dataset.homepageSection) {
                e.preventDefault();
                const section = sectionMenuItem.dataset.homepageSection;
                this.loadSection(section);
            }
        });
    }

    /**
     * Show notification
     */
    showNotification(type, message) {
        // Use unified notification system
        const title = type === 'success' ? 'Success' : type === 'error' ? 'Error' : 'Notification';
        window.NotificationManager.show(type, title, message);
    }

    /**
     * Navigate back to main homepage content management page
     */
    navigateBackToHomepageMain() {
        try {
            // Navigate back to main Homepage Content Management page
            this.showSectionList();
        } catch (error) {
            console.error('Error navigating back:', error);
        }
    }

    /**
     * Show error message
     */
    showError(message) {
        console.error(message);
        this.showNotification('error', message);
    }

    /**
     * Setup testimonial selection handlers
     */
    setupTestimonialSelectionHandlers() {
        const addBtn = document.getElementById('add-testimonial-btn');
        if (!addBtn) {
            console.error('❌ Add testimonial button not found!');
            return;
        }
        
        
        // Initialize selected testimonials array
        if (!this.selectedTestimonials) {
            this.selectedTestimonials = [];
        }
        
        // Remove existing event listener by cloning
        const newBtn = addBtn.cloneNode(true);
        addBtn.parentNode.replaceChild(newBtn, addBtn);
        
        newBtn.addEventListener('click', async () => {
            await this.openTestimonialSelectionModal();
        });
        
    }

    /**
     * Display selected testimonials
     */
    displaySelectedTestimonials(testimonials) {
        const container = document.getElementById('selected-testimonials-container');
        if (!container) {
            console.error('❌ Testimonials container not found!');
            return;
        }
        
        this.selectedTestimonials = testimonials;
        container.innerHTML = '';
        
        if (testimonials.length === 0) {
            container.innerHTML = '<p class="empty-state">No testimonials selected. Click "Add Testimonial" to select testimonials from your collection.</p>';
            return;
        }
        
        
        testimonials.forEach((testimonial, index) => {
            const card = document.createElement('div');
            card.className = 'testimonial-selection-card';
            
            // Create fallback SVG for missing images
            const fallbackSvg = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Ccircle cx=%2250%22 cy=%2250%22 r=%2250%22 fill=%22%23ddd%22/%3E%3Ctext x=%2250%22 y=%2250%22 text-anchor=%22middle%22 dy=%22.3em%22 font-size=%2240%22 fill=%22%23999%22%3E' + (testimonial.name ? testimonial.name.charAt(0).toUpperCase() : '?') + '%3C/text%3E%3C/svg%3E';
            const avatarUrl = testimonial.imageUrl || fallbackSvg;
            
            card.innerHTML = `
                <div class="testimonial-card-header">
                    <img src="${avatarUrl}" alt="${testimonial.name}" class="testimonial-avatar">
                    <div class="testimonial-info">
                        <h5>${testimonial.name}</h5>
                        <p class="testimonial-role">${testimonial.role || ''}</p>
                    </div>
                    <button type="button" class="btn btn-sm btn-danger remove-testimonial-btn" data-index="${index}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="trash-2" class="lucide lucide-trash-2"><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                </div>
                <p class="testimonial-text">${testimonial.content ? testimonial.content.substring(0, 100) + '...' : ''}</p>
                <small class="testimonial-meta">Rating: ${testimonial.rating || 'N/A'} ★</small>
            `;
            container.appendChild(card);
            
            // Add error handler for image
            const img = card.querySelector('.testimonial-avatar');
            img.addEventListener('error', () => {
                img.src = fallbackSvg;
            });
            
            // Add remove handler
            const removeBtn = card.querySelector('.remove-testimonial-btn');
            removeBtn.addEventListener('click', () => {
                this.removeSelectedTestimonial(index);
            });
        });
        
        // Reinitialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    /**
     * Open testimonial selection modal
     */
    async openTestimonialSelectionModal() {
        try {
            
            // Fetch available testimonials from AboutContent
            const token = localStorage.getItem('adminToken');
            
            const response = await fetch('/api/content/about?section=testimonials', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            
            if (!response.ok) throw new Error('Failed to fetch testimonials');
            
            const result = await response.json();
            
            // Filter to only show actual testimonial items (exclude section_title, section_subtitle, etc.)
            const allRecords = result.data || [];
            const availableTestimonials = allRecords.filter(item => 
                item.key && item.key.startsWith('testimonial_')
            );
            
            // Create modal
            const modal = document.createElement('div');
            modal.className = 'modal-overlay';
            modal.style.display = 'block';
            modal.style.visibility = 'visible';
            modal.style.opacity = '1';
            modal.innerHTML = `
                <div class="modal-container" style="max-width: 800px;">
                    <div class="modal-header">
                        <h3>Select Testimonials</h3>
                        <button class="modal-close-btn" id="close-testimonial-modal">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
                        </button>
                    </div>
                    <div class="modal-body">
                        <p class="help-text">Select up to 6 testimonials to display on the homepage. Currently selected: ${this.selectedTestimonials.length}</p>
                        <div id="available-testimonials-list" class="testimonials-selection-list"></div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" id="cancel-testimonial-selection">Cancel</button>
                        <button class="btn btn-primary" id="confirm-testimonial-selection">Confirm Selection</button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Populate testimonials list
            const listContainer = document.getElementById('available-testimonials-list');
            const selectedIds = this.selectedTestimonials.map(t => t.id);
            
            if (availableTestimonials.length === 0) {
                listContainer.innerHTML = '<p class="empty-state">No testimonials available. Please create testimonials in the About page first.</p>';
            } else {
                availableTestimonials.forEach(testimonial => {
                    const isSelected = selectedIds.includes(testimonial.id);
                    const item = document.createElement('label');
                    item.className = 'testimonial-selection-item';
                    
                    // Create fallback SVG for missing images
                    const fallbackSvg = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Ccircle cx=%2250%22 cy=%2250%22 r=%2250%22 fill=%22%23ddd%22/%3E%3Ctext x=%2250%22 y=%2250%22 text-anchor=%22middle%22 dy=%22.3em%22 font-size=%2240%22 fill=%22%23999%22%3E' + (testimonial.name ? testimonial.name.charAt(0).toUpperCase() : '?') + '%3C/text%3E%3C/svg%3E';
                    const avatarUrl = testimonial.imageUrl || fallbackSvg;
                    
                    item.innerHTML = `
                        <input type="checkbox" ${isSelected ? 'checked' : ''} data-testimonial-id="${testimonial.id}" ${this.selectedTestimonials.length >= 6 && !isSelected ? 'disabled' : ''}>
                        <div class="testimonial-selection-content">
                            <img src="${avatarUrl}" alt="${testimonial.name}" class="testimonial-selection-avatar">
                            <div class="testimonial-selection-info">
                                <h5>${testimonial.name}</h5>
                                <p class="role">${testimonial.role || ''}</p>
                                <p class="content">${testimonial.content ? testimonial.content.substring(0, 80) + '...' : ''}</p>
                                <small>Rating: ${testimonial.rating || 'N/A'} ★</small>
                            </div>
                        </div>
                    `;
                    listContainer.appendChild(item);
                    
                    // Add error handler for image
                    const img = item.querySelector('.testimonial-selection-avatar');
                    img.addEventListener('error', () => {
                        img.src = fallbackSvg;
                    });
                });
            }
            
            // Store temp selection
            this.tempSelectedTestimonials = [...this.selectedTestimonials];
            
            // Handle checkbox changes
            listContainer.addEventListener('change', (e) => {
                if (e.target.type === 'checkbox') {
                    const testimonialId = e.target.getAttribute('data-testimonial-id');
                    const testimonial = availableTestimonials.find(t => t.id === testimonialId);
                    
                    if (e.target.checked) {
                        if (this.tempSelectedTestimonials.length < 6) {
                            this.tempSelectedTestimonials.push(testimonial);
                        } else {
                            e.target.checked = false;
                            window.NotificationManager.show('warning', 'Limit Reached', 'You can select up to 6 testimonials');
                        }
                    } else {
                        const index = this.tempSelectedTestimonials.findIndex(t => t.id === testimonialId);
                        if (index > -1) {
                            this.tempSelectedTestimonials.splice(index, 1);
                        }
                    }
                    
                    // Update counter
                    const helpText = modal.querySelector('.help-text');
                    helpText.textContent = `Select up to 6 testimonials to display on the homepage. Currently selected: ${this.tempSelectedTestimonials.length}`;
                    
                    // Enable/disable checkboxes based on limit
                    const checkboxes = listContainer.querySelectorAll('input[type="checkbox"]');
                    checkboxes.forEach(cb => {
                        if (!cb.checked && this.tempSelectedTestimonials.length >= 6) {
                            cb.disabled = true;
                        } else if (!cb.checked) {
                            cb.disabled = false;
                        }
                    });
                }
            });
            
            // Handle confirm
            document.getElementById('confirm-testimonial-selection').addEventListener('click', () => {
                this.selectedTestimonials = [...this.tempSelectedTestimonials];
                this.displaySelectedTestimonials(this.selectedTestimonials);
                modal.remove();
            });
            
            // Handle cancel/close
            const closeModal = () => {
                this.tempSelectedTestimonials = null;
                modal.remove();
            };
            
            document.getElementById('cancel-testimonial-selection').addEventListener('click', closeModal);
            document.getElementById('close-testimonial-modal').addEventListener('click', closeModal);
            modal.addEventListener('click', (e) => {
                if (e.target === modal) closeModal();
            });
            
            // Reinitialize Lucide icons
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
            
        } catch (error) {
            console.error('Error opening testimonial selection:', error);
            window.NotificationManager.show('error', 'Error', 'Failed to load testimonials');
        }
    }

    /**
     * Remove selected testimonial
     */
    removeSelectedTestimonial(index) {
        this.selectedTestimonials.splice(index, 1);
        this.displaySelectedTestimonials(this.selectedTestimonials);
    }

    /**
     * Setup Why Choose Us background image upload handlers
     */
    setupWhyChooseBackgroundHandlers() {
        const fileInput = document.getElementById('why-choose-background-upload');
        const selectBtn = document.getElementById('why-choose-background-select-btn');
        const previewContainer = document.getElementById('why-choose-background-preview-container');
        const previewImg = document.getElementById('why-choose-background-preview');
        const removeBtn = document.getElementById('why-choose-background-remove-btn');
        const imageUrlInput = document.getElementById('why-choose-background-url');
        
        if (!fileInput || !selectBtn || !previewContainer || !previewImg || !removeBtn) {
            console.warn('Why Choose Us background image upload elements not found');
            return;
        }
        
        // Initialize storage for selected file
        if (!this.whyChooseSelectedFile) {
            this.whyChooseSelectedFile = null;
        }
        
        // Remove existing event listeners by cloning elements
        const newSelectBtn = selectBtn.cloneNode(true);
        const newRemoveBtn = removeBtn.cloneNode(true);
        selectBtn.parentNode.replaceChild(newSelectBtn, selectBtn);
        removeBtn.parentNode.replaceChild(newRemoveBtn, removeBtn);
        
        // Select image button
        newSelectBtn.addEventListener('click', (e) => {
            e.preventDefault();
            fileInput.click();
        });
        
        // File input change - DON'T clone, we need to preserve the files
        if (this.whyChooseFileInputHandler) {
            fileInput.removeEventListener('change', this.whyChooseFileInputHandler);
        }
        
        this.whyChooseFileInputHandler = (e) => {
            const file = e.target.files[0];
            if (file) {
                // Validate file
                if (!['image/jpeg', 'image/jpg', 'image/png', 'image/gif'].includes(file.type)) {
                    this.showNotification('error', 'Please select a valid image file (PNG, JPG, GIF)');
                    fileInput.value = '';
                    this.whyChooseSelectedFile = null;
                    return;
                }
                
                if (file.size > 2 * 1024 * 1024) {
                    this.showNotification('error', 'Image size must be less than 2MB');
                    fileInput.value = '';
                    this.whyChooseSelectedFile = null;
                    return;
                }
                
                // Store the file for later upload
                this.whyChooseSelectedFile = file;
                
                // Preview image
                const reader = new FileReader();
                reader.onload = (event) => {
                    previewImg.src = event.target.result;
                    previewContainer.style.display = 'block';
                };
                reader.readAsDataURL(file);
            }
        };
        
        fileInput.addEventListener('change', this.whyChooseFileInputHandler);
        
        // Remove image button
        newRemoveBtn.addEventListener('click', (e) => {
            e.preventDefault();
            previewImg.src = '';
            previewContainer.style.display = 'none';
            if (imageUrlInput) imageUrlInput.value = '';
            fileInput.value = '';
            this.whyChooseSelectedFile = null;
        });
    }

    /**
     * Setup gallery album selection handlers
     */
    setupGallerySelectionHandlers() {
        
        // Initialize selected albums array
        this.selectedAlbums = this.selectedAlbums || [];
        
        const addAlbumBtn = document.getElementById('add-album-btn');
        if (!addAlbumBtn) {
            console.warn('⚠️ Add album button not found');
            return;
        }
        
        
        // Clone to remove existing listeners
        const newAddAlbumBtn = addAlbumBtn.cloneNode(true);
        addAlbumBtn.parentNode.replaceChild(newAddAlbumBtn, addAlbumBtn);
        
        newAddAlbumBtn.addEventListener('click', () => {
            this.openAlbumSelectionModal();
        });
        
    }

    /**
     * Display selected albums
     */
    displaySelectedAlbums(albums) {
        const container = document.getElementById('selected-albums-container');
        
        if (!container) {
            console.error('❌ Selected albums container not found');
            return;
        }
        
        container.innerHTML = '';
        
        if (!albums || albums.length === 0) {
            container.innerHTML = `
                <div class="testimonials-empty-state">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><circle cx="9" cy="9" r="2"></circle><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path></svg>
                    <p>No photo albums selected. Click "Add Photo Album" to select albums from your gallery.</p>
                </div>
            `;
            return;
        }
        
        
        albums.forEach((album, index) => {
            const card = document.createElement('div');
            card.className = 'testimonial-selection-card';
            
            // Use album thumbnail or placeholder
            const thumbnailUrl = album.imageUrl || album.thumbnailUrl || 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Crect width=%22100%22 height=%22100%22 fill=%22%23ddd%22/%3E%3Ctext x=%2250%22 y=%2250%22 text-anchor=%22middle%22 dy=%22.3em%22 font-size=%2240%22 fill=%22%23999%22%3E' + (album.title ? album.title.charAt(0).toUpperCase() : '?') + '%3C/text%3E%3C/svg%3E';
            
            card.innerHTML = `
                <div class="testimonial-card-header">
                    <img src="${thumbnailUrl}" alt="${album.title}" class="testimonial-avatar" style="border-radius: 8px;">
                    <div class="testimonial-info">
                        <h5>${album.title}</h5>
                        <p class="testimonial-role">${album.category || 'Uncategorized'}</p>
                    </div>
                    <button type="button" class="btn btn-sm btn-danger remove-testimonial-btn" data-album-id="${album.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="trash-2" class="lucide lucide-trash-2"><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                </div>
                <p class="testimonial-text">${album.description || 'No description'}</p>
            `;
            container.appendChild(card);
            
            // Add error handler for image
            const img = card.querySelector('.testimonial-avatar');
            const fallbackSvg = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Crect width=%22100%22 height=%22100%22 fill=%22%23ddd%22/%3E%3Ctext x=%2250%22 y=%2250%22 text-anchor=%22middle%22 dy=%22.3em%22 font-size=%2240%22 fill=%22%23999%22%3E' + (album.title ? album.title.charAt(0).toUpperCase() : '?') + '%3C/text%3E%3C/svg%3E';
            img.addEventListener('error', () => {
                img.src = fallbackSvg;
            });
            
            // Add remove handler
            const removeBtn = card.querySelector('.remove-testimonial-btn');
            removeBtn.addEventListener('click', (e) => {
                const albumId = e.currentTarget.getAttribute('data-album-id');
                this.removeSelectedAlbumById(albumId);
            });
        });
        
        // Reinitialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    /**
     * Open album selection modal
     */
    async openAlbumSelectionModal() {
        try {
            
            // Fetch available albums from Gallery
            const token = localStorage.getItem('adminToken');
            
            const response = await fetch('/api/content/gallery/photo-albums', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            
            if (!response.ok) throw new Error('Failed to fetch photo albums');
            
            const result = await response.json();
            
            const availableAlbums = result.albums || [];
            
            // Create modal
            const modal = document.createElement('div');
            modal.className = 'modal-overlay';
            modal.style.display = 'block';
            modal.style.visibility = 'visible';
            modal.style.opacity = '1';
            modal.innerHTML = `
                <div class="modal-container" style="max-width: 900px;">
                    <div class="modal-header">
                        <h3>Select Photo Albums</h3>
                        <button class="modal-close-btn" id="close-album-modal">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
                        </button>
                    </div>
                    <div class="modal-body">
                        <p class="help-text">Select up to 6 photo albums to display on the homepage. Currently selected: ${this.selectedAlbums.length}</p>
                        <div id="available-albums-list" class="testimonials-selection-list"></div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" id="cancel-album-selection">Cancel</button>
                        <button class="btn btn-primary" id="confirm-album-selection">Confirm Selection</button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Populate albums list
            const listContainer = document.getElementById('available-albums-list');
            const selectedIds = this.selectedAlbums.map(a => a.id);
            
            if (availableAlbums.length === 0) {
                listContainer.innerHTML = '<p class="empty-state">No photo albums available. Please create albums in the Gallery page first.</p>';
            } else {
                availableAlbums.forEach(album => {
                    const isSelected = selectedIds.includes(album.id);
                    const item = document.createElement('label');
                    item.className = 'testimonial-selection-item';
                    
                    // Create fallback SVG
                    const fallbackSvg = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Crect width=%22100%22 height=%22100%22 fill=%22%23ddd%22/%3E%3Ctext x=%2250%22 y=%2250%22 text-anchor=%22middle%22 dy=%22.3em%22 font-size=%2240%22 fill=%22%23999%22%3E' + (album.title ? album.title.charAt(0).toUpperCase() : '?') + '%3C/text%3E%3C/svg%3E';
                    const thumbnailUrl = album.imageUrl || album.thumbnailUrl || fallbackSvg;
                    
                    item.innerHTML = `
                        <input type="checkbox" ${isSelected ? 'checked' : ''} data-album-id="${album.id}">
                        <div class="testimonial-selection-content">
                            <img src="${thumbnailUrl}" alt="${album.title}" class="testimonial-selection-avatar" style="border-radius: 8px;">
                            <div class="testimonial-selection-info">
                                <h5>${album.title}</h5>
                                <p class="role">${album.category || 'Uncategorized'}</p>
                                <p class="content">${album.description || 'No description'}</p>
                            </div>
                        </div>
                    `;
                    listContainer.appendChild(item);
                    
                    // Add error handler for image
                    const img = item.querySelector('.testimonial-selection-avatar');
                    img.addEventListener('error', () => {
                        img.src = fallbackSvg;
                    });
                });
            }
            
            // Store temp selection
            this.tempSelectedAlbums = [...this.selectedAlbums];
            
            // Initial enable/disable state for checkboxes based on selection limit
            const checkboxes = listContainer.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(cb => {
                if (cb.checked) {
                    // Always enable checked checkboxes so they can be unchecked
                    cb.disabled = false;
                } else if (this.tempSelectedAlbums.length >= 6) {
                    // Disable unchecked checkboxes when limit is reached
                    cb.disabled = true;
                } else {
                    // Enable unchecked checkboxes when under the limit
                    cb.disabled = false;
                }
            });
            
            // Handle checkbox changes
            listContainer.addEventListener('change', (e) => {
                if (e.target.type === 'checkbox') {
                    const albumId = e.target.getAttribute('data-album-id');
                    const album = availableAlbums.find(a => a.id === albumId);
                    
                    if (e.target.checked) {
                        if (this.tempSelectedAlbums.length < 6) {
                            this.tempSelectedAlbums.push(album);
                        } else {
                            e.target.checked = false;
                            window.NotificationManager.show('warning', 'Limit Reached', 'You can select up to 6 photo albums');
                        }
                    } else {
                        const index = this.tempSelectedAlbums.findIndex(a => a.id === albumId);
                        if (index > -1) {
                            this.tempSelectedAlbums.splice(index, 1);
                        }
                    }
                    
                    // Update counter
                    const helpText = modal.querySelector('.help-text');
                    helpText.textContent = `Select up to 6 photo albums to display on the homepage. Currently selected: ${this.tempSelectedAlbums.length}`;
                    
                    // Enable/disable checkboxes based on limit
                    const checkboxes = listContainer.querySelectorAll('input[type="checkbox"]');
                    checkboxes.forEach(cb => {
                        if (cb.checked) {
                            // Always enable checked checkboxes so they can be unchecked
                            cb.disabled = false;
                        } else if (this.tempSelectedAlbums.length >= 6) {
                            // Disable unchecked checkboxes when limit is reached
                            cb.disabled = true;
                        } else {
                            // Enable unchecked checkboxes when under the limit
                            cb.disabled = false;
                        }
                    });
                }
            });
            
            // Handle confirm
            document.getElementById('confirm-album-selection').addEventListener('click', () => {
                this.selectedAlbums = [...this.tempSelectedAlbums];
                this.displaySelectedAlbums(this.selectedAlbums);
                modal.remove();
                window.NotificationManager.show('success', 'Albums Selected', `${this.selectedAlbums.length} album(s) selected`);
            });
            
            // Handle cancel & close
            const closeModal = () => modal.remove();
            document.getElementById('cancel-album-selection').addEventListener('click', closeModal);
            document.getElementById('close-album-modal').addEventListener('click', closeModal);
            modal.addEventListener('click', (e) => {
                if (e.target === modal) closeModal();
            });
            
        } catch (error) {
            console.error('❌ Error opening album selection modal:', error);
            window.NotificationManager.show('error', 'Error', 'Failed to load photo albums');
        }
    }

    /**
     * Remove selected album by ID
     */
    removeSelectedAlbumById(albumId) {
        
        // Log all album IDs in the array
        if (this.selectedAlbums && this.selectedAlbums.length > 0) {
        }
        
        const index = this.selectedAlbums.findIndex(a => a.id === albumId);
        
        if (index > -1) {
            this.selectedAlbums.splice(index, 1);
            this.displaySelectedAlbums(this.selectedAlbums);
        } else {
            console.warn('⚠️ Album not found in selected albums');
            console.warn('💡 This usually means the album ID doesn\'t match any album in the array');
        }
    }

    /**
     * Remove selected album (legacy method, kept for compatibility)
     */
    removeSelectedAlbum(index) {
        this.selectedAlbums.splice(index, 1);
        this.displaySelectedAlbums(this.selectedAlbums);
    }

    /**
     * Setup programs selection handlers
     */
    setupProgramsSelectionHandlers() {
        
        // Initialize selected programs array
        this.selectedPrograms = this.selectedPrograms || [];
        
        const addProgramBtn = document.getElementById('add-program-btn');
        if (!addProgramBtn) {
            console.warn('⚠️ Add program button not found');
            return;
        }
        
        
        // Clone to remove existing listeners
        const newAddProgramBtn = addProgramBtn.cloneNode(true);
        addProgramBtn.parentNode.replaceChild(newAddProgramBtn, addProgramBtn);
        
        newAddProgramBtn.addEventListener('click', () => {
            this.openProgramSelectionModal();
        });
        
    }

    /**
     * Display selected programs
     */
    displaySelectedPrograms(programs) {
        const container = document.getElementById('selected-programs-container');
        
        if (!container) {
            console.error('❌ Selected programs container not found');
            return;
        }
        
        container.innerHTML = '';
        
        if (!programs || programs.length === 0) {
            container.innerHTML = `
                <div class="testimonials-empty-state">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"></rect><path d="M2 7h20"></path><path d="M2 12h20"></path><path d="M2 17h20"></path></svg>
                    <p>No grade levels selected. Click "Add Grade Level" to select from your academics page.</p>
                </div>
            `;
            return;
        }
        
        
        programs.forEach((program, index) => {
            const card = document.createElement('div');
            card.className = 'testimonial-selection-card';
            
            // Use image if available, otherwise use icon or placeholder
            const avatarHtml = program.imageUrl 
                ? `<img src="${program.imageUrl}" alt="${program.title}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 12px;">` 
                : `<div style="font-size: 32px;">${program.icon || '📚'}</div>`;
            
            
            card.innerHTML = `
                <div class="testimonial-card-header">
                    <div class="testimonial-avatar" style="width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; background: #f0f0f0; border-radius: 12px; overflow: hidden;">
                        ${avatarHtml}
                    </div>
                    <div class="testimonial-info">
                        <h5>${program.title}</h5>
                        <p class="testimonial-role">${program.key || ''}</p>
                    </div>
                    <button type="button" class="btn btn-sm btn-danger remove-testimonial-btn" data-index="${index}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="trash-2" class="lucide lucide-trash-2"><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                </div>
                <p class="testimonial-text">${program.description || program.content || 'No description'}</p>
            `;
            container.appendChild(card);
            
            // Add remove handler
            const removeBtn = card.querySelector('.remove-testimonial-btn');
            removeBtn.addEventListener('click', () => {
                this.removeSelectedProgram(index);
            });
        });
        
        // Reinitialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    /**
     * Open program selection modal
     */
    async openProgramSelectionModal() {
        try {
            
            // Fetch available grade levels from Academics
            const token = localStorage.getItem('adminToken');
            
            const response = await fetch('/api/content/academics', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            
            if (!response.ok) throw new Error('Failed to fetch grade levels');
            
            const result = await response.json();
            
            // Get programs from the gradeLevels section
            const availablePrograms = result.content?.gradeLevels?.programs || [];
            
            // Create modal
            const modal = document.createElement('div');
            modal.className = 'modal-overlay';
            modal.style.display = 'block';
            modal.style.visibility = 'visible';
            modal.style.opacity = '1';
            modal.innerHTML = `
                <div class="modal-container" style="max-width: 800px;">
                    <div class="modal-header">
                        <h3>Select Grade Levels</h3>
                        <button class="modal-close-btn" id="close-program-modal">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
                        </button>
                    </div>
                    <div class="modal-body">
                        <p class="help-text">Select up to 4 grade levels to display on the homepage. Currently selected: ${this.selectedPrograms.length}</p>
                        <div id="available-programs-list" class="testimonials-selection-list"></div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" id="cancel-program-selection">Cancel</button>
                        <button class="btn btn-primary" id="confirm-program-selection">Confirm Selection</button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Populate programs list
            const listContainer = document.getElementById('available-programs-list');
            const selectedKeys = this.selectedPrograms.map(p => p.key || p.gradeLevelKey);
            
            if (availablePrograms.length === 0) {
                listContainer.innerHTML = '<p class="empty-state">No grade levels available. Please create grade levels in the Academics page first.</p>';
            } else {
                
                availablePrograms.forEach((program, index) => {
                    // Assign a unique identifier to each program
                    const programKey = program.key || program.gradeLevelKey || program.id || `program_${index}`;
                    program._indexKey = programKey; // Store it on the object for later lookup
                    
                    const isSelected = selectedKeys.includes(program.key) || selectedKeys.includes(program.gradeLevelKey) || selectedKeys.includes(program.id);
                    const item = document.createElement('label');
                    item.className = 'testimonial-selection-item';
                    
                    // Use image if available, otherwise use icon or default emoji
                    const avatarHtml = program.imageUrl 
                        ? `<img src="${program.imageUrl}" alt="${program.title}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 12px;">` 
                        : `<div style="font-size: 32px;">${program.icon || '📚'}</div>`;
                    
                    item.innerHTML = `
                        <input type="checkbox" ${isSelected ? 'checked' : ''} data-program-key="${programKey}" data-program-index="${index}" ${this.selectedPrograms.length >= 4 && !isSelected ? 'disabled' : ''}>
                        <div class="testimonial-selection-content">
                            <div class="testimonial-selection-avatar" style="width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; background: #f0f0f0; border-radius: 12px; overflow: hidden;">
                                ${avatarHtml}
                            </div>
                            <div class="testimonial-selection-info">
                                <h5>${program.title || 'Untitled Program'}</h5>
                                <p class="role">${programKey}</p>
                                <p class="content">${program.description || program.content || 'No description'}</p>
                            </div>
                        </div>
                    `;
                    listContainer.appendChild(item);
                });
            }
            
            // Store temp selection - match selected programs with available programs to get full data
            this.tempSelectedPrograms = [];
            if (this.selectedPrograms && this.selectedPrograms.length > 0) {
                this.selectedPrograms.forEach(selectedProg => {
                    const fullProgram = availablePrograms.find(p => 
                        p.key === selectedProg.key || 
                        p.gradeLevelKey === selectedProg.gradeLevelKey ||
                        p.id === selectedProg.id ||
                        p.key === selectedProg.gradeLevelKey || // Cross-match
                        p.gradeLevelKey === selectedProg.key
                    );
                    if (fullProgram) {
                        this.tempSelectedPrograms.push(fullProgram);
                    }
                });
            }
            
            // Handle checkbox changes
            listContainer.addEventListener('change', (e) => {
                if (e.target.type === 'checkbox') {
                    const programKey = e.target.getAttribute('data-program-key');
                    const programIndex = parseInt(e.target.getAttribute('data-program-index'));
                    
                    
                    // Find program - use index first for reliability, then try key-based matching
                    let program = availablePrograms[programIndex];
                    
                    if (!program) {
                        // Fallback to key-based search if index doesn't work
                        program = availablePrograms.find(p => 
                            p._indexKey === programKey ||
                            p.key === programKey || 
                            p.gradeLevelKey === programKey || 
                            p.id === programKey
                        );
                    }
                    
                    
                    if (e.target.checked) {
                        if (this.tempSelectedPrograms.length < 4) {
                            if (program) {
                                this.tempSelectedPrograms.push(program);
                            } else {
                                console.error('❌ Program not found for key:', programKey);
                            }
                        } else {
                            e.target.checked = false;
                            window.NotificationManager.show('warning', 'Limit Reached', 'You can select up to 4 grade levels');
                        }
                    } else {
                        // Handle multiple key types when removing
                        const index = this.tempSelectedPrograms.findIndex(p => 
                            p._indexKey === programKey ||
                            p.key === programKey || 
                            p.gradeLevelKey === programKey ||
                            p.id === programKey
                        );
                        if (index > -1) {
                            this.tempSelectedPrograms.splice(index, 1);
                        }
                    }
                    
                    // Update counter
                    const helpText = modal.querySelector('.help-text');
                    helpText.textContent = `Select up to 4 grade levels to display on the homepage. Currently selected: ${this.tempSelectedPrograms.length}`;
                    
                    // Enable/disable checkboxes based on limit
                    const checkboxes = listContainer.querySelectorAll('input[type="checkbox"]');
                    checkboxes.forEach(cb => {
                        if (!cb.checked && this.tempSelectedPrograms.length >= 4) {
                            cb.disabled = true;
                        } else if (!cb.checked) {
                            cb.disabled = false;
                        }
                    });
                }
            });
            
            // Handle confirm
            document.getElementById('confirm-program-selection').addEventListener('click', () => {
                this.selectedPrograms = [...this.tempSelectedPrograms];
                this.displaySelectedPrograms(this.selectedPrograms);
                modal.remove();
                window.NotificationManager.show('success', 'Programs Selected', `${this.selectedPrograms.length} grade level(s) selected`);
            });
            
            // Handle cancel & close
            const closeModal = () => modal.remove();
            document.getElementById('cancel-program-selection').addEventListener('click', closeModal);
            document.getElementById('close-program-modal').addEventListener('click', closeModal);
            modal.addEventListener('click', (e) => {
                if (e.target === modal) closeModal();
            });
            
        } catch (error) {
            console.error('❌ Error opening program selection modal:', error);
            window.NotificationManager.show('error', 'Error', 'Failed to load grade levels');
        }
    }

    /**
     * Remove selected program
     */
    removeSelectedProgram(index) {
        this.selectedPrograms.splice(index, 1);
        this.displaySelectedPrograms(this.selectedPrograms);
    }

    /**
     * Setup NEB Toppers selection handlers
     */
    setupToppersSelectionHandlers() {
        // Initialize toppers state
        this.toppersCurrentPage = 1;
        this.toppersSearchTerm = '';
        this.toppersFilter = 'all';
        this.selectedToppers = [];
        
        // Load toppers data
        this.loadNebToppersFromDatabase();
        
        // Setup add new topper button - clone to remove old event listeners
        const addTopperBtn = document.getElementById('add-new-topper-btn');
        if (addTopperBtn) {
            const newBtn = addTopperBtn.cloneNode(true);
            addTopperBtn.parentNode.replaceChild(newBtn, addTopperBtn);
            newBtn.addEventListener('click', () => this.openTopperModal());
        }
        
        // Setup search - clone to remove old event listeners
        const searchInput = document.getElementById('toppers-search');
        if (searchInput) {
            const newSearchInput = searchInput.cloneNode(true);
            searchInput.parentNode.replaceChild(newSearchInput, searchInput);
            
            let searchTimeout;
            newSearchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.toppersSearchTerm = e.target.value;
                    this.toppersCurrentPage = 1;
                    this.loadNebToppersFromDatabase();
                }, 300);
            });
        }
        
        // Setup filter tabs - clone to remove old event listeners
        const filterTabs = document.querySelectorAll('.neb-controls .filter-tab');
        filterTabs.forEach((tab) => {
            const newTab = tab.cloneNode(true);
            tab.parentNode.replaceChild(newTab, tab);
            
            newTab.addEventListener('click', (e) => {
                // Re-query tabs after replacement (scoped to neb-controls only)
                const allTabs = document.querySelectorAll('.neb-controls .filter-tab');
                allTabs.forEach(t => {
                    t.classList.remove('active');
                    t.style.color = '#6b7280';
                    t.style.borderBottom = 'none';
                    t.style.marginBottom = '0';
                });
                e.target.classList.add('active');
                e.target.style.color = '#2563eb';
                e.target.style.borderBottom = '2px solid #2563eb';
                e.target.style.marginBottom = '-2px';
                
                this.toppersFilter = e.target.dataset.filter;
                this.toppersCurrentPage = 1;
                this.loadNebToppersFromDatabase();
            });
        });
    }

    /**
     * Load NEB toppers directly from database table
     */
    async loadNebToppersFromDatabase() {
        const tableBody = document.getElementById('toppers-table-body');
        if (!tableBody) return;
        
        // Show loading
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" style="padding: 60px 24px; text-align: center; color: #9ca3af;">
                    <div style="display: flex; flex-direction: column; align-items: center; gap: 12px;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="spin">
                            <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
                        </svg>
                        <p>Loading toppers...</p>
                    </div>
                </td>
            </tr>
        `;
        
        try {
            const params = new URLSearchParams({
                page: this.toppersCurrentPage || 1,
                limit: 10,
                search: this.toppersSearchTerm || '',
                filter: this.toppersFilter || 'all'
            });
            
            const response = await fetch(`/api/content/neb-toppers?${params}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                }
            });
            
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.error || 'Failed to load NEB toppers');
            }
            
            this.toppersTotalPages = data.pagination.totalPages;
            this.displayToppersTable(data.toppers);
            this.updateToppersPaginationInfo(data.pagination);
            
        } catch (error) {
            console.error('❌ Error loading NEB toppers:', error);
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" style="padding: 60px 24px; text-align: center; color: #ef4444;">
                        <div style="display: flex; flex-direction: column; align-items: center; gap: 12px;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="15" y1="9" x2="9" y2="15"></line>
                                <line x1="9" y1="9" x2="15" y2="15"></line>
                            </svg>
                            <p>Failed to load toppers</p>
                        </div>
                    </td>
                </tr>
            `;
        }
    }
    
    /**
     * Apply filter to toppers table
     */
    applyToppersFilter() {
        const rows = document.querySelectorAll('#toppers-table-body tr');
        const currentYear = new Date().getFullYear();
        
        rows.forEach(row => {
            const yearCell = row.querySelector('td:nth-child(3)')?.textContent || '';
            const year = parseInt(yearCell);
            
            let shouldShow = true;
            
            switch(this.toppersFilter) {
                case 'top-achievers':
                    // Show toppers with GPA >= 3.8 or percentage >= 90
                    const scoreCell = row.querySelector('td:nth-child(4)')?.textContent || '';
                    const gpaMatch = scoreCell.match(/(\d+\.\d+)/);
                    const percentageMatch = scoreCell.match(/(\d+)%/);
                    
                    if (gpaMatch) {
                        shouldShow = parseFloat(gpaMatch[1]) >= 3.8;
                    } else if (percentageMatch) {
                        shouldShow = parseInt(percentageMatch[1]) >= 90;
                    }
                    break;
                case 'all':
                default:
                    shouldShow = true;
                    break;
            }
            
            row.style.display = shouldShow ? '' : 'none';
        });
    }

    /**
     * Display toppers in table format (similar to alumni table)
     */
    displayToppersTable(toppers) {
        const tableBody = document.getElementById('toppers-table-body');
        const emptyState = document.getElementById('toppers-empty-state');
        if (!tableBody) return;
        
        if (!toppers || toppers.length === 0) {
            if (emptyState) emptyState.style.display = 'block';
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" style="padding: 60px 24px; text-align: center; color: #9ca3af;">
                        <div style="display: flex; flex-direction: column; align-items: center; gap: 12px;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
                            </svg>
                            <p>No toppers found</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }
        
        if (emptyState) emptyState.style.display = 'none';
        
        tableBody.innerHTML = toppers.map(topper => {
            const photoUrl = topper.photoUrl || '';
            const photoHtml = photoUrl 
                ? `<img src="${photoUrl}" alt="${topper.name}" style="width: 48px; height: 48px; border-radius: 50%; object-fit: cover;">` 
                : `<div style="width: 48px; height: 48px; border-radius: 50%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-weight: 600; font-size: 18px;">${topper.name.charAt(0)}</div>`;
            
            const quote = topper.quote || '-';
            const truncatedQuote = quote.length > 50 ? quote.substring(0, 50) + '...' : quote;
            
            return `
                <tr style="border-bottom: 1px solid #e5e7eb; transition: background 0.2s;" onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background='white'">
                    <td style="padding: 16px 24px;">
                        ${photoHtml}
                    </td>
                    <td style="padding: 16px 24px;">
                        <div style="font-weight: 600; color: #1f2937;">${topper.name}</div>
                    </td>
                    <td style="padding: 16px 24px;">
                        <div style="color: #6b7280;">${topper.batchYear || 'N/A'}</div>
                    </td>
                    <td style="padding: 16px 24px;">
                        <div style="font-weight: 500; color: #111827;">${topper.gpa || 'N/A'}</div>
                    </td>
                    <td style="padding: 16px 24px;">
                        <div style="color: #6b7280; font-style: italic;" title="${quote}">${truncatedQuote}</div>
                    </td>
                    <td style="padding: 16px 24px; text-align: right;">
                        <div style="display: flex; gap: 8px; justify-content: flex-end;">
                            <button type="button" class="btn-icon" onclick="event.preventDefault(); event.stopPropagation(); window.homepageContentLoader.editTopperById('${topper.id}');" title="Edit" style="padding: 8px; border: none; background: none; cursor: pointer; color: #6b7280; transition: color 0.2s;" onmouseover="this.style.color='#2563eb'" onmouseout="this.style.color='#6b7280'">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                </svg>
                            </button>
                            <button type="button" class="btn-icon" onclick="event.preventDefault(); event.stopPropagation(); window.homepageContentLoader.deleteTopperById('${topper.id}');" title="Delete" style="padding: 8px; border: none; background: none; cursor: pointer; color: #6b7280; transition: color 0.2s;" onmouseover="this.style.color='#ef4444'" onmouseout="this.style.color='#6b7280'">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                </svg>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    /**
     * Display selected toppers in table format (backward compatibility)
     */
    displaySelectedToppers(toppers) {
        const tableBody = document.getElementById('toppers-table-body');
        const emptyState = document.getElementById('toppers-empty-state');
        
        if (!tableBody) {
            console.error('❌ Toppers table body not found');
            return;
        }
        
        tableBody.innerHTML = '';
        
        if (!toppers || toppers.length === 0) {
            if (emptyState) emptyState.style.display = 'block';
            this.selectedToppers = [];
            return;
        }
        
        if (emptyState) emptyState.style.display = 'none';
        
        toppers.forEach((topper, index) => {
            const row = document.createElement('tr');
            row.style.borderBottom = '1px solid #e5e7eb';
            row.style.transition = 'background-color 0.2s';
            row.onmouseenter = function() { this.style.backgroundColor = '#f9fafb'; };
            row.onmouseleave = function() { this.style.backgroundColor = 'transparent'; };
            
            // Truncate quote if too long
            const quote = topper.quote || topper.message || '';
            const truncatedQuote = quote.length > 60 ? quote.substring(0, 60) + '...' : quote;
            
            row.innerHTML = `
                <td style="padding: 16px;">
                    <div style="width: 48px; height: 48px; border-radius: 50%; overflow: hidden; background: #f3f4f6; display: flex; align-items: center; justify-content: center;">
                        ${topper.photo || topper.imageUrl 
                            ? `<img src="${topper.photo || topper.imageUrl}" alt="${topper.name}" style="width: 100%; height: 100%; object-fit: cover;">` 
                            : `<span style="font-size: 24px;">🏆</span>`
                        }
                    </div>
                </td>
                <td style="padding: 16px;">
                    <div style="font-weight: 500; color: #111827;">${topper.name}</div>
                </td>
                <td style="padding: 16px;">
                    <div style="color: #6b7280;">${topper.year || 'N/A'}</div>
                </td>
                <td style="padding: 16px;">
                    <div style="font-weight: 500; color: #111827;">${topper.score || 'N/A'}</div>
                </td>
                <td style="padding: 16px;">
                    <div style="color: #6b7280; max-width: 300px;" title="${quote}">${truncatedQuote || '-'}</div>
                </td>
                <td style="padding: 16px; text-align: center;">
                    <div style="display: flex; gap: 8px; justify-content: center;">
                        <button class="topper-edit-btn" data-index="${index}" style="padding: 8px; background: transparent; border: none; cursor: pointer; color: #6b7280; transition: color 0.2s;" onmouseover="this.style.color='#3b82f6'" onmouseout="this.style.color='#6b7280'" title="Edit">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                        </button>
                        <button class="topper-delete-btn" data-index="${index}" style="padding: 8px; background: transparent; border: none; cursor: pointer; color: #6b7280; transition: color 0.2s;" onmouseover="this.style.color='#ef4444'" onmouseout="this.style.color='#6b7280'" title="Delete">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                            </svg>
                        </button>
                    </div>
                </td>
            `;
            
            tableBody.appendChild(row);
            
            // Add event listeners
            row.querySelector('.topper-edit-btn').addEventListener('click', () => {
                this.editTopper(index);
            });
            
            row.querySelector('.topper-delete-btn').addEventListener('click', () => {
                this.removeSelectedTopper(index);
            });
        });
        
        this.selectedToppers = toppers;
        
        // Setup search functionality
        this.setupToppersSearch();
        
        // Apply current filter
        if (this.toppersFilter) {
            this.applyToppersFilter();
        }
    }

    /**
     * Open topper modal for adding new topper
     */
    openTopperModal(topperData = null) {
        const isEdit = topperData !== null;
        
        // Create a simple modal for adding topper details
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 600px;">
                <div class="modal-header">
                    <h3>${isEdit ? 'Edit NEB Topper' : 'Add New Topper'}</h3>
                    <button class="modal-close" id="close-topper-modal">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>
                <div class="modal-body modal-body-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                    <div class="form-group">
                        <label for="topperName">Student Name <span style="color: red;">*</span></label>
                        <input type="text" id="topperName" class="form-input" placeholder="Enter student name" value="${topperData?.name || ''}">
                    </div>
                    <div class="form-group">
                        <label for="topperYear">Year (Batch) <span style="color: red;">*</span></label>
                        <input type="text" id="topperYear" class="form-input" placeholder="e.g., 2023" value="${topperData?.year || ''}">
                    </div>
                    <div class="form-group">
                        <label for="topperScore">GPA / Percentage <span style="color: red;">*</span></label>
                        <input type="text" id="topperScore" class="form-input" placeholder="e.g., 4.0 GPA or 95%" value="${topperData?.score || ''}">
                    </div>
                    <div class="form-group">
                        <label for="topperProgram">Program/Stream</label>
                        <input type="text" id="topperProgram" class="form-input" placeholder="e.g., Science, Management" value="${topperData?.program || ''}">
                    </div>
                    <div class="form-group form-group-full" style="grid-column: 1 / -1;">
                        <label for="topperPhoto">Topper Photo</label>
                        <div class="image-upload-container">
                            <input type="file" id="topper-photo-upload" class="image-upload-input" accept="image/*" style="display: none;">
                            <button type="button" id="topper-photo-select-btn" class="btn btn-outline image-select-btn">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="upload" class="lucide lucide-upload"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7,10 12,15 17,10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                                Select Photo
                            </button>
                            <div class="image-preview-container" id="topper-photo-preview-container" style="display: ${topperData?.photo || topperData?.imageUrl ? 'block' : 'none'}; margin-top: 12px;">
                                <img id="topper-photo-preview" class="image-preview" alt="Preview" src="${topperData?.photo || topperData?.imageUrl || ''}" style="max-width: 100%; max-height: 200px; border-radius: 8px; border: 2px solid #e5e7eb;">
                                <button type="button" id="topper-photo-remove-btn" class="btn btn-sm btn-danger image-remove-btn">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="trash-2" class="lucide lucide-trash-2"><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                    Remove
                                </button>
                            </div>
                            <input type="hidden" id="topperPhoto" value="${topperData?.photo || topperData?.imageUrl || ''}">
                        </div>
                        <small class="form-help">Upload topper photo. Recommended size: 400x400px (square format).</small>
                    </div>
                    <div class="form-group" style="grid-column: 1 / -1;">
                        <label for="topperQuote">Quote / Message</label>
                        <textarea id="topperQuote" class="form-input" placeholder="Enter inspirational quote or message" rows="3">${topperData?.quote || topperData?.message || ''}</textarea>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" id="cancel-topper-add">Cancel</button>
                    <button class="btn btn-primary" id="confirm-topper-add">${isEdit ? 'Update Topper' : 'Add Topper'}</button>
                </div>
            </div>
        `;
        
        // Remove any existing modals first
        const existingModals = document.querySelectorAll('.modal-overlay');
        existingModals.forEach(m => m.remove());
        
        document.body.appendChild(modal);
        
        // Show modal with animation
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
        
        // Close modal function with animation
        const closeModal = () => {
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300); // Wait for animation to complete
        };
        
        // Setup topper photo upload handlers
        const fileInput = document.getElementById('topper-photo-upload');
        const selectBtn = document.getElementById('topper-photo-select-btn');
        const previewContainer = document.getElementById('topper-photo-preview-container');
        const previewImg = document.getElementById('topper-photo-preview');
        const removeBtn = document.getElementById('topper-photo-remove-btn');
        const photoUrlInput = document.getElementById('topperPhoto');
        let selectedTopperPhoto = null;
        
        // Hide select button if there's already an image
        if (previewContainer && previewContainer.style.display === 'block' && selectBtn) {
            selectBtn.style.display = 'none';
        }
        
        // Select photo button
        if (selectBtn) {
            selectBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (fileInput) fileInput.click();
            });
        }
        
        // File input change handler
        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    // Validate file
                    if (!['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
                        window.NotificationManager.show('error', 'Invalid File', 'Please select a valid image file (PNG, JPG, GIF, WEBP)');
                        fileInput.value = '';
                        selectedTopperPhoto = null;
                        return;
                    }
                    
                    if (file.size > 5 * 1024 * 1024) {
                        window.NotificationManager.show('error', 'File Too Large', 'Image size must be less than 5MB');
                        fileInput.value = '';
                        selectedTopperPhoto = null;
                        return;
                    }
                    
                    // Store the file for upload
                    selectedTopperPhoto = file;
                    
                    // Preview image
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        previewImg.src = event.target.result;
                        previewContainer.style.display = 'block';
                        if (selectBtn) selectBtn.style.display = 'none';
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
        
        // Remove photo button
        if (removeBtn) {
            removeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                previewImg.src = '';
                previewContainer.style.display = 'none';
                if (selectBtn) selectBtn.style.display = 'block';
                if (fileInput) fileInput.value = '';
                if (photoUrlInput) photoUrlInput.value = '';
                selectedTopperPhoto = null;
            });
        }
        
        // Handle confirm
        document.getElementById('confirm-topper-add').addEventListener('click', async () => {
            const name = document.getElementById('topperName').value.trim();
            const score = document.getElementById('topperScore').value.trim();
            const year = document.getElementById('topperYear').value.trim();
            const program = document.getElementById('topperProgram').value.trim();
            const quote = document.getElementById('topperQuote').value.trim();
            let photoUrl = document.getElementById('topperPhoto').value.trim();
            
            if (!name || !score || !year) {
                window.NotificationManager.show('error', 'Validation Error', 'Please fill in name, GPA/Percentage, and year');
                return;
            }
            
            // Disable button and show loading
            const confirmBtn = document.getElementById('confirm-topper-add');
            const originalBtnText = confirmBtn.innerHTML;
            confirmBtn.disabled = true;
            confirmBtn.style.opacity = '0.6';
            confirmBtn.style.cursor = 'not-allowed';
            confirmBtn.innerHTML = '<i data-lucide="loader-2" class="animate-spin"></i> Uploading... 0%';
            
            // Reinitialize Lucide icons
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
            
            try {
                // Upload image if a new file was selected
                if (selectedTopperPhoto) {
                    try {
                        // Convert file to base64 for the upload endpoint
                        const base64Promise = new Promise((resolve, reject) => {
                            const reader = new FileReader();
                            reader.onload = () => resolve(reader.result);
                            reader.onerror = reject;
                            reader.readAsDataURL(selectedTopperPhoto);
                        });
                        
                        // Show converting message
                        confirmBtn.innerHTML = '<i data-lucide="loader-2" class="animate-spin"></i> Preparing...';
                        if (typeof lucide !== 'undefined') {
                            lucide.createIcons();
                        }
                        
                        const base64Data = await base64Promise;
                        
                        // Create XMLHttpRequest for progress tracking
                        photoUrl = await new Promise((resolve, reject) => {
                            const xhr = new XMLHttpRequest();
                            
                            // Track upload progress
                            let progress = 0;
                            const progressInterval = setInterval(() => {
                                if (progress < 90) {
                                    progress += 5;
                                    confirmBtn.innerHTML = `<i data-lucide="loader-2" class="animate-spin"></i> Uploading... ${progress}%`;
                                    if (typeof lucide !== 'undefined') {
                                        lucide.createIcons();
                                    }
                                }
                            }, 100);
                            
                            xhr.addEventListener('load', () => {
                                clearInterval(progressInterval);
                                
                                if (xhr.status === 200) {
                                    const response = JSON.parse(xhr.responseText);
                                    if (response.success && response.url) {
                                        confirmBtn.innerHTML = '<i data-lucide="loader-2" class="animate-spin"></i> Uploading... 100%';
                                        if (typeof lucide !== 'undefined') {
                                            lucide.createIcons();
                                        }
                                        resolve(response.url);
                                    } else {
                                        reject(new Error(response.error || response.message || 'Upload failed'));
                                    }
                                } else {
                                    const errorResponse = JSON.parse(xhr.responseText || '{}');
                                    reject(new Error(errorResponse.error || errorResponse.message || 'Upload failed'));
                                }
                            });
                            
                            xhr.addEventListener('error', () => {
                                clearInterval(progressInterval);
                                reject(new Error('Network error during upload'));
                            });
                            
                            xhr.open('POST', '/api/upload/image');
                            xhr.setRequestHeader('Content-Type', 'application/json');
                            xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('adminToken')}`);
                            
                            // Send as JSON with base64 data
                            const requestBody = {
                                imageData: base64Data,
                                fileName: selectedTopperPhoto.name,
                                folder: 'marigold-school/neb-toppers'
                            };
                            
                            xhr.send(JSON.stringify(requestBody));
                        });
                        
                        // Update the hidden input with the uploaded URL
                        if (photoUrlInput) photoUrlInput.value = photoUrl;
                    } catch (uploadError) {
                        // Restore spiButton
                        confirmBtn.disabled = false;
                        confirmBtn.style.opacity = '1';
                        confirmBtn.style.cursor = 'pointer';
                        confirmBtn.innerHTML = originalBtnText;
                        if (typeof lucide !== 'undefined') {
                            lucide.createIcons();
                        }
                        
                        window.NotificationManager.show('error', 'Upload Failed', uploadError.message || 'Failed to upload image. Please try again.');
                        console.error('Image upload error:', uploadError);
                        return;
                    }
                }
                
                // Update button text to show saving
                confirmBtn.innerHTML = '<i data-lucide="loader-2" class="animate-spin"></i> Saving...';
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
                
                const topperDataToSave = {
                    name,
                    batchYear: year,
                    gpa: score,
                    faculty: program || null,
                    quote: quote || null,
                    photoUrl: photoUrl || null,
                    isActive: true
                };
                
                let response;
                if (isEdit && topperData.id) {
                    // Update existing topper
                    response = await fetch(`/api/content/neb-toppers/${topperData.id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                        },
                        body: JSON.stringify(topperDataToSave)
                    });
                } else {
                    // Create new topper
                    response = await fetch('/api/content/neb-toppers', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                        },
                        body: JSON.stringify(topperDataToSave)
                    });
                }
                
                const result = await response.json();
                
                if (result.success) {
                    window.NotificationManager.show('success', isEdit ? 'Topper Updated' : 'Topper Added', `${name} ${isEdit ? 'updated' : 'added'} successfully`);
                    
                    // Reload the toppers list
                    await this.loadNebToppersFromDatabase();
                } else {
                    throw new Error(result.error || 'Failed to save topper');
                }
                
                // Restore button
                confirmBtn.disabled = false;
                confirmBtn.style.opacity = '1';
                confirmBtn.style.cursor = 'pointer';
                confirmBtn.innerHTML = originalBtnText;
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
            } catch (error) {
                console.error('❌ Error saving topper:', error);
                window.NotificationManager.show('error', 'Save Failed', error.message || 'Failed to save NEB topper');
                confirmBtn.disabled = false;
                confirmBtn.style.opacity = '1';
                confirmBtn.style.cursor = 'pointer';
                confirmBtn.innerHTML = originalBtnText;
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
                return;
            }
            closeModal();
        });
        
        // Handle cancel & close (closeModal is already defined above)
        document.getElementById('cancel-topper-add').addEventListener('click', closeModal);
        document.getElementById('close-topper-modal').addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    /**
     * Edit existing topper
     */
    editTopper(index) {
        const topper = this.selectedToppers[index];
        if (topper) {
            this.openTopperModal({
                ...topper,
                index
            });
        }
    }

    /**
     * Setup search functionality for toppers
     */
    setupToppersSearch() {
        const searchInput = document.getElementById('toppers-search');
        if (!searchInput) return;
        
        // Remove existing listener
        searchInput.removeEventListener('input', this.toppersSearchHandler);
        
        // Create and store handler
        this.toppersSearchHandler = (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const rows = document.querySelectorAll('#toppers-table-body tr');
            
            rows.forEach(row => {
                const name = row.querySelector('td:nth-child(2)')?.textContent.toLowerCase() || '';
                const year = row.querySelector('td:nth-child(3)')?.textContent.toLowerCase() || '';
                const score = row.querySelector('td:nth-child(4)')?.textContent.toLowerCase() || '';
                
                const matches = name.includes(searchTerm) || 
                               year.includes(searchTerm) || 
                               score.includes(searchTerm);
                
                row.style.display = matches ? '' : 'none';
            });
        };
        
        searchInput.addEventListener('input', this.toppersSearchHandler);
    }

    /**
     * Remove selected topper
     */
    async removeSelectedTopper(index) {
        const topper = this.selectedToppers[index];
        if (!topper || !topper.id) {
            console.error('❌ Invalid topper data');
            return;
        }
        
        // Confirm deletion
        if (!confirm(`Are you sure you want to delete ${topper.name}?`)) {
            return;
        }
        
        try {
            const response = await fetch(`/api/content/neb-toppers/${topper.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                }
            });
            
            const result = await response.json();
            
            if (result.success) {
                window.NotificationManager.show('success', 'Topper Deleted', `${topper.name} deleted successfully`);
                
                // Reload the toppers list
                await this.loadNebToppersFromDatabase();
            } else {
                throw new Error(result.error || 'Failed to delete topper');
            }
        } catch (error) {
            console.error('❌ Error deleting topper:', error);
            window.NotificationManager.show('error', 'Delete Failed', error.message || 'Failed to delete NEB topper');
        }
    }

    /**
     * Edit topper by ID
     */
    async editTopperById(topperId) {
        try {
            const response = await fetch(`/api/content/neb-toppers/${topperId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                }
            });
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.error || 'Failed to load topper');
            }
            
            this.openTopperModal({
                id: data.topper.id,
                name: data.topper.name,
                year: data.topper.batchYear,
                score: data.topper.gpa,
                program: data.topper.faculty,
                quote: data.topper.quote,
                photo: data.topper.photoUrl,
                imageUrl: data.topper.photoUrl
            });
            
        } catch (error) {
            console.error('❌ Error loading topper:', error);
            window.NotificationManager.show('error', 'Error', error.message);
        }
    }

    /**
     * Delete topper by ID
     */
    async deleteTopperById(topperId) {
        const row = document.querySelector(`button[onclick*="${topperId}"]`)?.closest('tr');
        const topperName = row?.querySelector('td:nth-child(2)')?.textContent.trim() || 'this topper';
        
        const confirmed = await new Promise((resolve) => {
            if (window.DeleteConfirmationModal) {
                window.DeleteConfirmationModal.show({
                    title: 'Delete Topper',
                    itemName: topperName,
                    itemType: 'topper',
                    onConfirm: () => resolve(true),
                    onCancel: () => resolve(false)
                });
            } else {
                resolve(confirm(`Are you sure you want to delete ${topperName}?`));
            }
        });
        
        if (!confirmed) return;
        
        try {
            const response = await fetch(`/api/content/neb-toppers/${topperId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                }
            });
            
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.error || 'Failed to delete topper');
            }
            
            window.NotificationManager.show('success', 'Topper Deleted', 'Topper deleted successfully');
            this.loadNebToppersFromDatabase();
            
        } catch (error) {
            console.error('❌ Error deleting topper:', error);
            window.NotificationManager.show('error', 'Error', error.message);
        }
    }

    /**
     * Update toppers pagination info
     */
    updateToppersPaginationInfo(pagination) {
        const paginationWrapper = document.getElementById('toppers-pagination');
        if (!paginationWrapper) return;
        
        if (pagination.totalPages > 1) {
            paginationWrapper.style.display = 'flex';
            this.generateToppersPageNumbers(pagination);
        } else {
            paginationWrapper.style.display = 'none';
        }
    }

    /**
     * Generate toppers page number buttons
     */
    generateToppersPageNumbers(pagination) {
        const paginationWrapper = document.getElementById('toppers-pagination');
        if (!paginationWrapper) return;
        
        const currentPage = pagination.page;
        const totalPages = pagination.totalPages;
        
        paginationWrapper.innerHTML = '';
        
        const prevBtn = document.createElement('button');
        prevBtn.className = 'pagination-btn btn btn-secondary';
        prevBtn.innerHTML = `Previous`;
        prevBtn.disabled = currentPage <= 1;
        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                this.toppersCurrentPage = currentPage - 1;
                this.loadNebToppersFromDatabase();
            }
        });
        paginationWrapper.appendChild(prevBtn);
        
        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = 'pagination-btn btn btn-secondary';
            pageBtn.textContent = i;
            if (i === currentPage) {
                pageBtn.style.cssText = 'padding: 8px 16px; border-radius: 8px; font-weight: 600; background: #2563eb; color: white;';
            }
            pageBtn.addEventListener('click', () => {
                this.toppersCurrentPage = i;
                this.loadNebToppersFromDatabase();
            });
            paginationWrapper.appendChild(pageBtn);
        }
        
        const nextBtn = document.createElement('button');
        nextBtn.className = 'pagination-btn btn btn-secondary';
        nextBtn.innerHTML = `Next`;
        nextBtn.disabled = currentPage >= totalPages;
        nextBtn.addEventListener('click', () => {
            if (currentPage < totalPages) {
                this.toppersCurrentPage = currentPage + 1;
                this.loadNebToppersFromDatabase();
            }
        });
        paginationWrapper.appendChild(nextBtn);
    }

    /**
     * Setup Alumni selection handlers
     */
    setupAlumniSelectionHandlers() {
        // Initialize alumni state
        this.alumniCurrentPage = 1;
        this.alumniSearchTerm = '';
        this.alumniFilter = 'all';
        
        // Load alumni data
        this.loadAlumniData();
        
        // Setup add new alumni button - clone to remove old event listeners
        const addNewBtn = document.getElementById('add-new-alumni-btn');
        if (addNewBtn) {
            const newBtn = addNewBtn.cloneNode(true);
            addNewBtn.parentNode.replaceChild(newBtn, addNewBtn);
            newBtn.addEventListener('click', () => this.openAlumniModal());
        }
        
        // Setup search - clone to remove old event listeners
        const searchInput = document.getElementById('alumni-search');
        if (searchInput) {
            const newSearchInput = searchInput.cloneNode(true);
            searchInput.parentNode.replaceChild(newSearchInput, searchInput);
            
            let searchTimeout;
            newSearchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.alumniSearchTerm = e.target.value;
                    this.alumniCurrentPage = 1;
                    this.loadAlumniData();
                }, 300);
            });
        }
        
        // Setup filter tabs - clone to remove old event listeners (scoped to alumni-controls)
        const filterTabs = document.querySelectorAll('.alumni-controls .filter-tab');
        filterTabs.forEach((tab, index) => {
            const newTab = tab.cloneNode(true);
            tab.parentNode.replaceChild(newTab, tab);
            
            newTab.addEventListener('click', (e) => {
                // Re-query tabs after replacement (scoped to alumni-controls only)
                const allTabs = document.querySelectorAll('.alumni-controls .filter-tab');
                allTabs.forEach(t => {
                    t.classList.remove('active');
                    t.style.color = '#6b7280';
                    t.style.borderBottom = 'none';
                    t.style.marginBottom = '0';
                });
                e.target.classList.add('active');
                e.target.style.color = '#2563eb';
                e.target.style.borderBottom = '2px solid #2563eb';
                e.target.style.marginBottom = '-2px';
                
                this.alumniFilter = e.target.dataset.filter;
                this.alumniCurrentPage = 1;
                this.loadAlumniData();
            });
        });
        
        // Page numbers will be generated dynamically by updatePaginationInfo
    }

    /**
     * Load alumni data from API
     */
    async loadAlumniData() {
        const tableBody = document.getElementById('alumni-table-body');
        if (!tableBody) return;
        
        // Show loading
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" style="padding: 60px 24px; text-align: center; color: #9ca3af;">
                    <div style="display: flex; flex-direction: column; align-items: center; gap: 12px;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="spin">
                            <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
                        </svg>
                        <p>Loading alumni...</p>
                    </div>
                </td>
            </tr>
        `;
        
        try {
            const params = new URLSearchParams({
                page: this.alumniCurrentPage,
                limit: 10,
                search: this.alumniSearchTerm,
                filter: this.alumniFilter
            });
            
            const response = await fetch(`/api/content/alumni?${params}`);
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.error || 'Failed to load alumni');
            }
            
            this.alumniTotalPages = data.pagination.totalPages;
            this.displayAlumniTable(data.alumni);
            this.updatePaginationInfo(data.pagination);
            
        } catch (error) {
            console.error('❌ Error loading alumni:', error);
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" style="padding: 60px 24px; text-align: center; color: #ef4444;">
                        <div style="display: flex; flex-direction: column; align-items: center; gap: 12px;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="15" y1="9" x2="9" y2="15"></line>
                                <line x1="9" y1="9" x2="15" y2="15"></line>
                            </svg>
                            <p>Failed to load alumni</p>
                        </div>
                    </td>
                </tr>
            `;
        }
    }

    /**
     * Display alumni in table
     */
    displayAlumniTable(alumni) {
        const tableBody = document.getElementById('alumni-table-body');
        if (!tableBody) return;
        
        if (!alumni || alumni.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" style="padding: 60px 24px; text-align: center; color: #9ca3af;">
                        <div style="display: flex; flex-direction: column; align-items: center; gap: 12px;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                            </svg>
                            <p>No alumni found</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }
        
        tableBody.innerHTML = alumni.map(alumnus => {
            const photoUrl = alumnus.photoUrl || '';
            const photoHtml = photoUrl 
                ? `<img src="${photoUrl}" alt="${alumnus.name}" style="width: 48px; height: 48px; border-radius: 50%; object-fit: cover;">` 
                : `<div style="width: 48px; height: 48px; border-radius: 50%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-weight: 600; font-size: 18px;">${alumnus.name.charAt(0)}</div>`;
            
            const profession = alumnus.profession || '';
            const university = alumnus.university || '';
            const professionDisplay = university ? `${profession} at ${university}` : profession;
            
            const quote = alumnus.quote || alumnus.testimonial || '-';
            const truncatedQuote = quote.length > 50 ? quote.substring(0, 50) + '...' : quote;
            
            return `
                <tr style="border-bottom: 1px solid #e5e7eb; transition: background 0.2s;" onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background='white'">
                    <td style="padding: 16px 24px;">
                        ${photoHtml}
                    </td>
                    <td style="padding: 16px 24px;">
                        <div style="font-weight: 600; color: #1f2937;">${alumnus.name}</div>
                    </td>
                    <td style="padding: 16px 24px;">
                        <div style="color: #6b7280;">${alumnus.batchYear}</div>
                    </td>
                    <td style="padding: 16px 24px;">
                        <div style="color: #6b7280;">${professionDisplay}</div>
                    </td>
                    <td style="padding: 16px 24px;">
                        <div style="color: #6b7280; font-style: italic;" title="${quote}">${truncatedQuote}</div>
                    </td>
                    <td style="padding: 16px 24px; text-align: right;">
                        <div style="display: flex; gap: 8px; justify-content: flex-end;">
                            <button class="btn-icon" onclick="window.homepageContentLoader.editAlumni('${alumnus.id}')" title="Edit" style="padding: 8px; border: none; background: none; cursor: pointer; color: #6b7280; transition: color 0.2s;" onmouseover="this.style.color='#2563eb'" onmouseout="this.style.color='#6b7280'">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                </svg>
                            </button>
                            <button class="btn-icon" onclick="window.homepageContentLoader.deleteAlumni('${alumnus.id}')" title="Delete" style="padding: 8px; border: none; background: none; cursor: pointer; color: #6b7280; transition: color 0.2s;" onmouseover="this.style.color='#ef4444'" onmouseout="this.style.color='#6b7280'">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                </svg>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    /**
     * Update pagination info
     */
    updatePaginationInfo(pagination) {
        const startElem = document.getElementById('pagination-start');
        const endElem = document.getElementById('pagination-end');
        const totalElem = document.getElementById('pagination-total');
        const paginationControls = document.getElementById('pagination-numbers');
        
        if (startElem) {
            const start = (pagination.page - 1) * pagination.limit + 1;
            startElem.textContent = pagination.total > 0 ? start : 0;
        }
        
        if (endElem) {
            const end = Math.min(pagination.page * pagination.limit, pagination.total);
            endElem.textContent = end;
        }
        
        if (totalElem) {
            totalElem.textContent = pagination.total;
        }
        
        // Generate page number buttons
        if (paginationControls) {
            this.generatePageNumbers(pagination);
        }
    }

    /**
     * Generate page number buttons
     */
    generatePageNumbers(pagination) {
        const paginationControls = document.getElementById('pagination-numbers');
        if (!paginationControls) return;
        
        const currentPage = pagination.page;
        const totalPages = pagination.totalPages;
        
        // Clear existing buttons
        paginationControls.innerHTML = '';
        
        // Don't show pagination if there's only one page
        if (totalPages <= 1) {
            return;
        }
        
        // Calculate which page numbers to show
        const maxVisiblePages = 7; // Show at most 7 page numbers
        let startPage = Math.max(1, currentPage - 3);
        let endPage = Math.min(totalPages, currentPage + 3);
        
        // Adjust if we're near the beginning
        if (currentPage <= 4) {
            startPage = 1;
            endPage = Math.min(maxVisiblePages, totalPages);
        }
        
        // Adjust if we're near the end
        if (currentPage >= totalPages - 3) {
            startPage = Math.max(1, totalPages - maxVisiblePages + 1);
            endPage = totalPages;
        }
        
        // Previous button
        const prevBtn = document.createElement('button');
        prevBtn.className = 'pagination-btn btn btn-secondary';
        prevBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
            Previous
        `;
        prevBtn.disabled = currentPage <= 1;
        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                this.alumniCurrentPage = currentPage - 1;
                this.loadAlumniData();
            }
        });
        paginationControls.appendChild(prevBtn);
        
        // First page button (if not in visible range)
        if (startPage > 1) {
            const firstBtn = this.createPageNumberButton(1, currentPage);
            paginationControls.appendChild(firstBtn);
            
            // Add ellipsis if there's a gap
            if (startPage > 2) {
                const ellipsis = document.createElement('span');
                ellipsis.className = 'pagination-ellipsis';
                ellipsis.textContent = '...';
                ellipsis.style.cssText = 'padding: 8px 12px; color: #6b7280;';
                paginationControls.appendChild(ellipsis);
            }
        }
        
        // Page number buttons
        for (let i = startPage; i <= endPage; i++) {
            const pageBtn = this.createPageNumberButton(i, currentPage);
            paginationControls.appendChild(pageBtn);
        }
        
        // Last page button (if not in visible range)
        if (endPage < totalPages) {
            // Add ellipsis if there's a gap
            if (endPage < totalPages - 1) {
                const ellipsis = document.createElement('span');
                ellipsis.className = 'pagination-ellipsis';
                ellipsis.textContent = '...';
                ellipsis.style.cssText = 'padding: 8px 12px; color: #6b7280;';
                paginationControls.appendChild(ellipsis);
            }
            
            const lastBtn = this.createPageNumberButton(totalPages, currentPage);
            paginationControls.appendChild(lastBtn);
        }
        
        // Next button
        const nextBtn = document.createElement('button');
        nextBtn.className = 'pagination-btn btn btn-secondary';
        nextBtn.innerHTML = `
            Next
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
        `;
        nextBtn.disabled = currentPage >= totalPages;
        nextBtn.addEventListener('click', () => {
            if (currentPage < totalPages) {
                this.alumniCurrentPage = currentPage + 1;
                this.loadAlumniData();
            }
        });
        paginationControls.appendChild(nextBtn);
    }

    /**
     * Create a page number button
     */
    createPageNumberButton(pageNumber, currentPage) {
        const button = document.createElement('button');
        button.className = 'pagination-btn btn btn-secondary';
        button.textContent = pageNumber;
        
        // Style for active page
        if (pageNumber === currentPage) {
            button.style.cssText = 'padding: 8px 16px; border-radius: 8px; font-weight: 600; background: #2563eb; color: white; border: 2px solid #2563eb;';
        } else {
            button.style.cssText = 'padding: 8px 16px; border-radius: 8px; font-weight: 500;';
        }
        
        button.addEventListener('click', () => {
            this.alumniCurrentPage = pageNumber;
            this.loadAlumniData();
        });
        
        return button;
    }

    /**
     * Display selected alumni (for backward compatibility)
     */
    displaySelectedAlumni(alumni) {
        // This method is called when loading saved homepage content
        // Store the alumni for later use
        this.selectedAlumni = alumni || [];
    }

    /**
     * Open alumni modal for adding/editing
     */
    openAlumniModal(alumniData = null) {
        // Remove any existing alumni modals first
        const existingModals = document.querySelectorAll('.modal-overlay');
        existingModals.forEach(modal => modal.remove());
        
        const isEdit = !!alumniData;
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content modal-content-medium">
                <div class="modal-header">
                    <h3>${isEdit ? 'Edit Alumni' : 'Add New Alumni'}</h3>
                    <button class="modal-close" id="close-alumni-modal">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>
                <div class="modal-body modal-body-grid" style="text-align: start;">
                    <div class="form-group">
                        <label for="alumniName">Name *</label>
                        <input type="text" id="alumniName" class="form-input" placeholder="Enter alumni name" value="${alumniData?.name || ''}">
                    </div>
                    <div class="form-group">
                        <label for="alumniBatchYear">Batch Year *</label>
                        <input type="text" id="alumniBatchYear" class="form-input" placeholder="e.g., 2018" value="${alumniData?.batchYear || ''}">
                    </div>
                    <div class="form-group">
                        <label for="alumniProfession">Profession *</label>
                        <input type="text" id="alumniProfession" class="form-input" placeholder="e.g., Software Engineer" value="${alumniData?.profession || ''}">
                    </div>
                    <div class="form-group">
                        <label for="alumniUniversity">University / Company</label>
                        <input type="text" id="alumniUniversity" class="form-input" placeholder="e.g., Google" value="${alumniData?.university || ''}">
                    </div>
                    <div class="form-group form-group-full">
                        <label for="alumniPhoto">Alumni Photo</label>
                        <div class="image-upload-container">
                            <input type="file" id="alumni-photo-upload" class="image-upload-input" accept="image/*" style="display: none;">
                            <button type="button" id="alumni-photo-select-btn" class="btn btn-outline image-select-btn">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="upload" class="lucide lucide-upload"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7,10 12,15 17,10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                                Select Photo
                            </button>
                            <div class="image-preview-container" id="alumni-photo-preview-container" style="display: ${alumniData?.photoUrl ? 'block' : 'none'}; margin-top: 12px;">
                                <img id="alumni-photo-preview" class="image-preview" alt="Preview" src="${alumniData?.photoUrl || ''}" style="max-width: 100%; max-height: 200px; border-radius: 8px; border: 2px solid #e5e7eb;">
                                <button type="button" id="alumni-photo-remove-btn" class="btn btn-sm btn-danger image-remove-btn">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="trash-2" class="lucide lucide-trash-2"><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                    Remove
                                </button>
                            </div>
                            <input type="hidden" id="alumniPhoto" value="${alumniData?.photoUrl || ''}">
                        </div>
                        <small class="form-help">Upload alumni photo. Recommended size: 400x400px (square format).</small>
                    </div>
                    <div class="form-group form-group-full">
                        <label for="alumniQuote">Quote / Testimonial</label>
                        <textarea id="alumniQuote" class="form-input" placeholder="Enter a quote or testimonial" rows="3">${alumniData?.quote || alumniData?.testimonial || ''}</textarea>
                    </div>
                    <div class="form-group form-group-full">
                        <label class="checkbox-label">
                            <input type="checkbox" id="alumniTopAchiever" ${alumniData?.isTopAchiever ? 'checked' : ''}>
                            <span>Mark as Top Achiever</span>
                        </label>
                    </div>
                    ${isEdit ? `<input type="hidden" id="alumniId" value="${alumniData.id}">` : ''}
                </div>
                <div class="modal-footer">
                    <div></div>
                    <div class="modal-footer-actions">
                        <button class="btn btn-secondary" id="cancel-alumni-modal">Cancel</button>
                        <button class="btn btn-primary" id="save-alumni-btn">${isEdit ? 'Update' : 'Add'} Alumni</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Show modal with animation
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
        
        // Close modal function with animation
        const closeModal = () => {
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300); // Wait for animation to complete
        };
        
        // Setup alumni photo upload handlers
        const fileInput = document.getElementById('alumni-photo-upload');
        const selectBtn = document.getElementById('alumni-photo-select-btn');
        const previewContainer = document.getElementById('alumni-photo-preview-container');
        const previewImg = document.getElementById('alumni-photo-preview');
        const removeBtn = document.getElementById('alumni-photo-remove-btn');
        const photoUrlInput = document.getElementById('alumniPhoto');
        let selectedAlumniPhoto = null;
        
        // Hide select button if there's already an image
        if (previewContainer && previewContainer.style.display === 'block' && selectBtn) {
            selectBtn.style.display = 'none';
        }
        
        // Select photo button
        if (selectBtn) {
            selectBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (fileInput) fileInput.click();
            });
        }
        
        // File input change handler
        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    // Validate file
                    if (!['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
                        window.NotificationManager.show('error', 'Invalid File', 'Please select a valid image file (PNG, JPG, GIF, WEBP)');
                        fileInput.value = '';
                        selectedAlumniPhoto = null;
                        return;
                    }
                    
                    if (file.size > 5 * 1024 * 1024) {
                        window.NotificationManager.show('error', 'File Too Large', 'Image size must be less than 5MB');
                        fileInput.value = '';
                        selectedAlumniPhoto = null;
                        return;
                    }
                    
                    // Store the file for upload
                    selectedAlumniPhoto = file;
                    
                    // Preview image
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        previewImg.src = event.target.result;
                        previewContainer.style.display = 'block';
                        if (selectBtn) selectBtn.style.display = 'none';
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
        
        // Remove photo button
        if (removeBtn) {
            removeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                previewImg.src = '';
                previewContainer.style.display = 'none';
                if (selectBtn) selectBtn.style.display = 'block';
                if (fileInput) fileInput.value = '';
                if (photoUrlInput) photoUrlInput.value = '';
                selectedAlumniPhoto = null;
            });
        }
        
        // Handle save
        const saveBtn = document.getElementById('save-alumni-btn');
        saveBtn.addEventListener('click', async () => {
            const name = document.getElementById('alumniName').value.trim();
            const batchYear = document.getElementById('alumniBatchYear').value.trim();
            const profession = document.getElementById('alumniProfession').value.trim();
            const university = document.getElementById('alumniUniversity').value.trim();
            const quote = document.getElementById('alumniQuote').value.trim();
            let photoUrl = document.getElementById('alumniPhoto').value.trim();
            const isTopAchiever = document.getElementById('alumniTopAchiever').checked;
            
            if (!name || !batchYear || !profession) {
                window.NotificationManager.show('error', 'Validation Error', 'Name, batch year, and profession are required');
                return;
            }
            
            // Disable button and show loading
            const originalBtnText = saveBtn.innerHTML;
            saveBtn.disabled = true;
            saveBtn.style.opacity = '0.6';
            saveBtn.style.cursor = 'not-allowed';
            saveBtn.innerHTML = '<i data-lucide="loader-2" class="animate-spin"></i> Uploading... 0%';
            
            // Reinitialize Lucide icons
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
            
            try {
                // Upload image if a new file was selected
                if (selectedAlumniPhoto) {
                    try {
                        // Convert file to base64 for the upload endpoint
                        const base64Promise = new Promise((resolve, reject) => {
                            const reader = new FileReader();
                            reader.onload = () => resolve(reader.result);
                            reader.onerror = reject;
                            reader.readAsDataURL(selectedAlumniPhoto);
                        });
                        
                        // Show converting message
                        saveBtn.innerHTML = '<i data-lucide="loader-2" class="animate-spin"></i> Preparing...';
                        if (typeof lucide !== 'undefined') {
                            lucide.createIcons();
                        }
                        
                        const base64Data = await base64Promise;
                        
                        // Create XMLHttpRequest for progress tracking
                        photoUrl = await new Promise((resolve, reject) => {
                            const xhr = new XMLHttpRequest();
                            
                            // Track upload progress (approximate since base64 is larger)
                            let progress = 0;
                            const progressInterval = setInterval(() => {
                                if (progress < 90) {
                                    progress += 5;
                                    saveBtn.innerHTML = `<i data-lucide="loader-2" class="animate-spin"></i> Uploading... ${progress}%`;
                                    if (typeof lucide !== 'undefined') {
                                        lucide.createIcons();
                                    }
                                }
                            }, 100);
                            
                            xhr.addEventListener('load', () => {
                                clearInterval(progressInterval);
                                
                                if (xhr.status === 200) {
                                    const response = JSON.parse(xhr.responseText);
                                    if (response.success && response.url) {
                                        saveBtn.innerHTML = '<i data-lucide="loader-2" class="animate-spin"></i> Uploading... 100%';
                                        if (typeof lucide !== 'undefined') {
                                            lucide.createIcons();
                                        }
                                        resolve(response.url);
                                    } else {
                                        reject(new Error(response.error || response.message || 'Upload failed'));
                                    }
                                } else {
                                    const errorResponse = JSON.parse(xhr.responseText || '{}');
                                    reject(new Error(errorResponse.error || errorResponse.message || 'Upload failed'));
                                }
                            });
                            
                            xhr.addEventListener('error', () => {
                                clearInterval(progressInterval);
                                reject(new Error('Network error during upload'));
                            });
                            
                            xhr.open('POST', '/api/upload/image');
                            xhr.setRequestHeader('Content-Type', 'application/json');
                            xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('adminToken')}`);
                            
                            // Send as JSON with base64 data (endpoint expects this format)
                            const requestBody = {
                                imageData: base64Data,
                                fileName: selectedAlumniPhoto.name,
                                folder: 'marigold-school/alumni'
                            };
                            
                            xhr.send(JSON.stringify(requestBody));
                        });
                        
                        // Update the hidden input with the uploaded URL
                        if (photoUrlInput) photoUrlInput.value = photoUrl;
                    } catch (uploadError) {
                        // Restore button
                        saveBtn.disabled = false;
                        saveBtn.style.opacity = '1';
                        saveBtn.style.cursor = 'pointer';
                        saveBtn.innerHTML = originalBtnText;
                        if (typeof lucide !== 'undefined') {
                            lucide.createIcons();
                        }
                        
                        window.NotificationManager.show('error', 'Upload Failed', uploadError.message || 'Failed to upload image. Please try again.');
                        console.error('Image upload error:', uploadError);
                        return;
                    }
                }
                
                // Update button text to show saving
                saveBtn.innerHTML = '<i data-lucide="loader-2" class="animate-spin"></i> Saving...';
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
                
                const alumniPayload = {
                    name,
                    batchYear,
                    profession,
                    university,
                    quote,
                    photoUrl,
                    isTopAchiever
                };
                
                let response;
                if (isEdit) {
                    const alumniId = document.getElementById('alumniId').value;
                    response = await fetch(`/api/content/alumni/${alumniId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                        },
                        body: JSON.stringify(alumniPayload)
                    });
                } else {
                    response = await fetch('/api/content/alumni', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                        },
                        body: JSON.stringify(alumniPayload)
                    });
                }
                
                const data = await response.json();
                
                if (!data.success) {
                    throw new Error(data.error || 'Failed to save alumni');
                }
                
                // Restore button
                saveBtn.disabled = false;
                saveBtn.style.opacity = '1';
                saveBtn.style.cursor = 'pointer';
                saveBtn.innerHTML = originalBtnText;
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
                
                window.NotificationManager.show('success', isEdit ? 'Alumni Updated' : 'Alumni Added', `${name} ${isEdit ? 'updated' : 'added'} successfully`);
                closeModal();
                this.loadAlumniData();
                
            } catch (error) {
                // Restore button on error
                saveBtn.disabled = false;
                saveBtn.style.opacity = '1';
                saveBtn.style.cursor = 'pointer';
                saveBtn.innerHTML = originalBtnText;
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
                
                console.error('❌ Error saving alumni:', error);
                window.NotificationManager.show('error', 'Error', error.message);
            }
        });
        
        // Handle cancel & close
        document.getElementById('cancel-alumni-modal').addEventListener('click', closeModal);
        document.getElementById('close-alumni-modal').addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    /**
     * Edit alumni
     */
    async editAlumni(alumniId) {
        try {
            const response = await fetch(`/api/content/alumni/${alumniId}`);
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.error || 'Failed to load alumni');
            }
            
            this.openAlumniModal(data.alumni);
            
        } catch (error) {
            console.error('❌ Error loading alumni:', error);
            window.NotificationManager.show('error', 'Error', error.message);
        }
    }

    /**
     * Delete alumni
     */
    async deleteAlumni(alumniId) {
        // Get alumni name for confirmation dialog
        const row = document.querySelector(`button[onclick*="${alumniId}"]`)?.closest('tr');
        const alumniName = row?.querySelector('td:nth-child(2)')?.textContent.trim() || 'this alumni';
        
        // Show confirmation dialog
        const confirmed = await new Promise((resolve) => {
            window.DeleteConfirmationModal.show({
                title: 'Delete Alumni',
                itemName: alumniName,
                itemType: 'alumni',
                onConfirm: () => resolve(true),
                onCancel: () => resolve(false)
            });
        });
        
        if (!confirmed) return;
        
        try {
            const response = await fetch(`/api/content/alumni/${alumniId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.error || 'Failed to delete alumni');
            }
            
            window.NotificationManager.show('success', 'Alumni Deleted', 'Alumni deleted successfully');
            
            // Reload the alumni data
            this.loadAlumniData();
            
        } catch (error) {
            console.error('❌ Error deleting alumni:', error);
            window.NotificationManager.show('error', 'Error', error.message);
        }
    }

    /**
     * Remove selected alumni (for backward compatibility)
     */
    removeSelectedAlumni(index) {
        this.selectedAlumni.splice(index, 1);
        this.displaySelectedAlumni(this.selectedAlumni);
    }

    /**
     * Fast video compression to 720p (optimized for speed)
     * Reduces file size by 80-90% and compresses faster than 1080p
     */
    async compressVideoFast(file, progressCallback) {
        return new Promise((resolve, reject) => {
            const video = document.createElement('video');
            video.preload = 'metadata';
            video.muted = true; // Mute video to prevent audio playback during compression
            video.playsInline = true; // Prevent fullscreen on mobile
            
            video.onloadedmetadata = async () => {
                try {
                    // Check if video has audio track
                    let hasAudio = false;
                    
                    if (video.audioTracks && video.audioTracks.length > 0) {
                        hasAudio = true;
                    }
                    
                    if (video.webkitAudioDecodedByteCount > 0 || video.mozHasAudio) {
                        hasAudio = true;
                    }
                    
                    if (!hasAudio && file.size > 1024 * 1024) {
                        hasAudio = true;
                    }
                    
                    console.log(`🎬 Video info: ${video.videoWidth}x${video.videoHeight}, Audio: ${hasAudio ? 'Yes' : 'No'}`);
                    
                    // Create canvas for video processing
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d', {
                        alpha: false,
                        desynchronized: true,
                        willReadFrequently: false
                    });
                    
                    ctx.imageSmoothingEnabled = true;
                    ctx.imageSmoothingQuality = 'high'; // Use high quality to prevent glitches
                    
                    // Always target 480p resolution (854x480) for consistent quality - same as gallery
                    const targetWidth = 854;
                    const targetHeight = 480;
                    
                    let width = video.videoWidth;
                    let height = video.videoHeight;
                    
                    // Calculate scaling to fit within 480p while maintaining aspect ratio
                    const ratio = Math.min(targetWidth / width, targetHeight / height);
                    
                    // Check if video is small enough to skip compression
                    const fileSizeMB = file.size / 1024 / 1024;
                    
                    // Only skip compression if video is under 5MB AND already at or below 480p
                    // If video is > 5MB, always compress regardless of resolution
                    if (fileSizeMB < 5 && video.videoWidth <= 854 && video.videoHeight <= 480) {
                        console.log(`📐 Video is already small (${fileSizeMB.toFixed(2)} MB, ${video.videoWidth}x${video.videoHeight}), skipping compression`);
                        resolve(file); // Return original file
                        return;
                    }
                    
                    // All videos > 5MB must be compressed
                    console.log(`📹 Video size: ${fileSizeMB.toFixed(2)} MB - will compress`);
                    
                    // Only downscale if video is larger than 480p
                    if (ratio < 1) {
                        width = Math.floor(width * ratio);
                        height = Math.floor(height * ratio);
                        console.log(`📐 Compressing from ${video.videoWidth}x${video.videoHeight} to ${width}x${height}`);
                    } else {
                        console.log(`📐 Video is smaller than 480p, keeping original size`);
                    }
                    
                    canvas.width = width;
                    canvas.height = height;
                    
                    // For homepage hero videos, ALWAYS use MP4/H.264 for best autoplay/loop compatibility
                    // Gallery videos can use any format, but homepage needs MP4 for seamless looping
                    let mimeType = 'video/webm;codecs=vp8';
                    let outputExtension = 'webm';
                    
                    // Prioritize MP4/H.264 for homepage videos (best for autoplay/loop without glitches)
                    if (MediaRecorder.isTypeSupported('video/mp4;codecs=h264')) {
                        mimeType = 'video/mp4;codecs=h264';
                        outputExtension = 'mp4';
                        console.log('🎥 Using H.264/MP4 codec (best for autoplay/loop)');
                    } else if (MediaRecorder.isTypeSupported('video/mp4')) {
                        mimeType = 'video/mp4';
                        outputExtension = 'mp4';
                        console.log('🎥 Using MP4 format');
                    } else {
                        console.log('🎥 Fallback to VP8/WebM (MP4 not supported)');
                    }
                    
                    console.log(`📹 Output format: ${outputExtension} (${mimeType})`);
                    
                    // Create MediaRecorder stream with both video and audio
                    // Using higher frame rate capture for smoother playback
                    const canvasStream = canvas.captureStream(30); // 30 FPS for smooth playback
                    
                    let combinedStream;
                    let audioContext = null;
                    
                    try {
                        // Get audio track from original video
                        audioContext = new (window.AudioContext || window.webkitAudioContext)();
                        const source = audioContext.createMediaElementSource(video);
                        const destination = audioContext.createMediaStreamDestination();
                        source.connect(destination);
                        // Don't connect to audioContext.destination to prevent audio playback
                        
                        // Combine video and audio streams
                        combinedStream = new MediaStream([
                            ...canvasStream.getVideoTracks(),
                            ...destination.stream.getAudioTracks()
                        ]);
                        
                        console.log('🔊 Audio track added to output');
                    } catch (audioError) {
                        console.warn('⚠️ Could not add audio track, using video only:', audioError);
                        combinedStream = canvasStream;
                    }
                    
                    // Optimized bitrates for 480p - balanced quality and file size
                    // Lower bitrates to prevent file size increases while maintaining good quality
                    let videoBitrate, audioBitrate;
                    
                    // For 480p (854x480 = 409,920 pixels), use 1-1.5 Mbps based on content
                    if (ratio < 1) {
                        // Video is being downscaled - use lower bitrate
                        videoBitrate = 1200000; // 1.2 Mbps for downscaled videos
                    } else {
                        // Video is already small - use even lower bitrate
                        videoBitrate = 1000000; // 1 Mbps for small videos
                    }
                    
                    // Adjust based on file size to avoid increasing file size
                    if (file.size < 5 * 1024 * 1024) { // Files under 5MB - already well compressed
                        videoBitrate = 800000; // 0.8 Mbps - preserve existing compression
                    } else if (file.size > 50 * 1024 * 1024) { // Large files
                        videoBitrate = 1500000; // 1.5 Mbps for large files
                    }
                    
                    audioBitrate = 128000; // 128 kbps for all videos
                    
                    const mediaRecorder = new MediaRecorder(combinedStream, {
                        mimeType: mimeType,
                        videoBitsPerSecond: videoBitrate,
                        audioBitsPerSecond: audioBitrate
                    });
                    
                    const chunks = [];
                    mediaRecorder.ondataavailable = (e) => {
                        if (e.data.size > 0) {
                            chunks.push(e.data);
                        }
                    };
                    
                    mediaRecorder.onstop = () => {
                        // Clean up audio context
                        if (audioContext && audioContext.state !== 'closed') {
                            audioContext.close().catch(console.warn);
                        }
                        
                        const outputMimeType = mimeType.split(';')[0];
                        const compressedBlob = new Blob(chunks, { type: outputMimeType });
                        
                        // Keep original filename with correct extension - same as gallery
                        const baseFileName = file.name.replace(/\.[^.]+$/, '');
                        const compressedFile = new File([compressedBlob], `${baseFileName}.${outputExtension}`, {
                            type: outputMimeType,
                            lastModified: Date.now()
                        });
                        
                        const originalSize = file.size / 1024 / 1024;
                        const compressedSize = compressedFile.size / 1024 / 1024;
                        const savingsPercent = ((1 - compressedSize / originalSize) * 100).toFixed(1);
                        
                        // If compression increased file size, use original file
                        if (compressedFile.size > file.size) {
                            console.log(`⚠️ Compression increased file size (${originalSize.toFixed(2)} MB → ${compressedSize.toFixed(2)} MB), using original file`);
                            resolve(file);
                        } else {
                            console.log(`✅ Compression complete: ${originalSize.toFixed(2)} MB → ${compressedSize.toFixed(2)} MB (${savingsPercent}% smaller)`);
                            resolve(compressedFile);
                        }
                    };
                    
                    mediaRecorder.onerror = (error) => {
                        if (audioContext && audioContext.state !== 'closed') {
                            audioContext.close().catch(console.warn);
                        }
                        
                        console.error('❌ Compression error:', error);
                        console.log('⚠️ Falling back to original file');
                        resolve(file); // Fallback to original if compression fails
                    };
                    
                    // Start recording with optimized chunk interval
                    // Smaller interval for smoother video without glitches
                    mediaRecorder.start(50); // Collect data every 50ms for smoother video
                    
                    // Play video and draw frames to canvas
                    video.currentTime = 0;
                    video.play();
                    
                    const drawFrame = () => {
                        if (!video.paused && !video.ended) {
                            // Draw with high quality
                            ctx.drawImage(video, 0, 0, width, height);
                            requestAnimationFrame(drawFrame);
                            
                            // Update progress
                            if (progressCallback) {
                                const progress = Math.round((video.currentTime / video.duration) * 100);
                                progressCallback(progress);
                            }
                        } else if (video.ended) {
                            mediaRecorder.stop();
                        }
                    };
                    
                    // Start drawing frames
                    drawFrame();
                    
                } catch (error) {
                    console.error('❌ Compression setup error:', error);
                    resolve(file); // Fallback to original
                }
            };
            
            video.onerror = (error) => {
                console.error('❌ Video load error:', error);
                resolve(file); // Fallback to original
            };
            
            video.src = URL.createObjectURL(file);
        });
    }

    /**
     * Load Popup Notices from API
     */
    async loadPopupNotices() {
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                console.warn('No auth token found, skipping popup notices load');
                this.popupNotices = [];
                this.renderPopupNoticesTable();
                return;
            }

            // Let auth interceptor handle the token automatically
            const response = await fetch('/api/admin/popup-notices', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch popup notices');
            }

            const result = await response.json();
            if (result.success && result.notices) {
                // Map database fields to frontend format
                this.popupNotices = result.notices.map(notice => {
                    // Convert isEnabled to boolean (handle both 0/1 and true/false from database)
                    // Boolean() converts: 0 -> false, 1 -> true, null/undefined -> false, true/false -> unchanged
                    const isEnabled = Boolean(notice.isEnabled);
                    return {
                        id: notice.id,
                        imageUrl: notice.imageUrl,
                        enabled: isEnabled,
                        isEnabled: isEnabled,
                        orderIndex: notice.orderIndex || 0
                    };
                });
            } else {
                this.popupNotices = [];
            }
            
            this.renderPopupNoticesTable();
        } catch (error) {
            console.error('Error loading popup notices:', error);
            this.popupNotices = [];
            this.renderPopupNoticesTable();
            showNotification('Failed to load popup notices: ' + error.message, 'error');
        }
    }

    /**
     * Render Popup Notices Table
     */
    renderPopupNoticesTable() {
        const tbody = document.getElementById('popupNoticesTableBody');
        if (!tbody) return;

        if (!this.popupNotices || this.popupNotices.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="4" style="text-align: center; padding: 40px; color: #6b7280;">
                        No popup notices yet. Click "Add New Popup Notice" to create one.
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = this.popupNotices.map((notice, index) => `
            <tr>
                <td>
                    <div style="width: 80px; height: 60px; overflow: hidden; border-radius: 4px; border: 1px solid #e5e7eb;">
                        <img src="${notice.imageUrl || ''}" alt="Preview" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27100%27 height=%27100%27%3E%3Crect fill=%27%23e5e7eb%27 width=%27100%27 height=%27100%27/%3E%3Ctext x=%2750%25%27 y=%2750%25%27 text-anchor=%27middle%27 dy=%27.3em%27 fill=%27%239ca3af%27 font-family=%27sans-serif%27%3ENo Image%3C/text%3E%3C/svg%3E'">
                    </div>
                </td>
                <td>
                    <div style="max-width: 400px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${notice.imageUrl || ''}">
                        ${notice.imageUrl || 'No image URL'}
                    </div>
                </td>
                <td>
                    <span class="status-badge ${notice.enabled ? 'status-active' : 'status-inactive'}">
                        ${notice.enabled ? 'Active' : 'Inactive'}
                    </span>
                </td>
                <td style="text-align: center;">
                    <div style="display: flex; gap: 8px; justify-content: center;">
                        <button class="btn-icon edit-popup-notice-btn" data-index="${index}" title="Edit">
                            <i data-lucide="edit"></i>
                        </button>
                        <button class="btn-icon delete-popup-notice-btn" data-index="${index}" title="Delete">
                            <i data-lucide="trash-2"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        // Reinitialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    /**
     * Initialize Popup Notice Handlers
     */
    initPopupNoticeHandlers() {
        // Initialize popup notices array if not exists
        if (!this.popupNotices) {
            this.popupNotices = [];
        }

        // Add New Popup Notice Button
        const addBtn = document.getElementById('addPopupNoticeBtn');
        if (addBtn) {
            // Remove existing listeners
            const newAddBtn = addBtn.cloneNode(true);
            addBtn.parentNode.replaceChild(newAddBtn, addBtn);
            newAddBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Add popup notice button clicked');
                this.openPopupNoticeModal();
            });
        } else {
            console.warn('Add popup notice button not found');
        }

        // Close Modal Buttons
        const closeBtn = document.getElementById('closePopupNoticeModal');
        const cancelBtn = document.getElementById('cancelPopupNoticeBtn');
        if (closeBtn) {
            const newCloseBtn = closeBtn.cloneNode(true);
            closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);
            newCloseBtn.addEventListener('click', () => this.closePopupNoticeModal());
        }
        if (cancelBtn) {
            const newCancelBtn = cancelBtn.cloneNode(true);
            cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);
            newCancelBtn.addEventListener('click', () => this.closePopupNoticeModal());
        }

        // Save Popup Notice Item Button
        const saveBtn = document.getElementById('savePopupNoticeItemBtn');
        if (saveBtn) {
            const newSaveBtn = saveBtn.cloneNode(true);
            saveBtn.parentNode.replaceChild(newSaveBtn, saveBtn);
            newSaveBtn.addEventListener('click', () => this.savePopupNoticeItem());
        }

        // Select Image Button
        const selectBtn = document.getElementById('selectPopupNoticeImageBtn');
        const fileInput = document.getElementById('popupNoticeImageFile');
        if (selectBtn && fileInput) {
            selectBtn.addEventListener('click', () => {
                fileInput.click();
            });
            
            fileInput.addEventListener('change', (e) => {
                this.handlePopupNoticeImageSelect(e);
            });
        }

        // Remove Image Button
        const removeBtn = document.getElementById('removePopupNoticeImageBtn');
        if (removeBtn) {
            const newRemoveBtn = removeBtn.cloneNode(true);
            removeBtn.parentNode.replaceChild(newRemoveBtn, removeBtn);
            newRemoveBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Remove image button clicked');
                this.removePopupNoticeImage();
            });
        } else {
            console.warn('Remove popup notice image button not found in initPopupNoticeHandlers');
        }

        // Edit and Delete Buttons (using event delegation)
        const tbody = document.getElementById('popupNoticesTableBody');
        if (tbody) {
            tbody.addEventListener('click', (e) => {
                const editBtn = e.target.closest('.edit-popup-notice-btn');
                const deleteBtn = e.target.closest('.delete-popup-notice-btn');

                if (editBtn) {
                    const index = parseInt(editBtn.dataset.index);
                    this.openPopupNoticeModal(index);
                } else if (deleteBtn) {
                    const index = parseInt(deleteBtn.dataset.index);
                    this.deletePopupNotice(index);
                }
            });
        }
    }

    /**
     * Open Popup Notice Modal
     */
    openPopupNoticeModal(editIndex = null) {
        const modal = document.getElementById('popupNoticeModal');
        const modalTitle = document.getElementById('popupNoticeModalTitle');
        const editIdInput = document.getElementById('popupNoticeEditId');
        const imageUrlInput = document.getElementById('popupNoticeImageUrl');
        const fileInput = document.getElementById('popupNoticeImageFile');
        const enabledCheckbox = document.getElementById('popupNoticeItemEnabled');
        const previewContainer = document.getElementById('popupNoticeImagePreview');

        if (!modal) {
            console.error('Popup notice modal not found!');
            return;
        }
        
        console.log('Opening popup notice modal');

        // Reset form
        if (imageUrlInput) imageUrlInput.value = '';
        if (fileInput) fileInput.value = '';
        if (previewContainer) previewContainer.style.display = 'none';
        this.selectedPopupNoticeFile = null;

        if (editIndex !== null && this.popupNotices && this.popupNotices[editIndex]) {
            // Edit mode - populate with existing data
            if (modalTitle) modalTitle.textContent = 'Edit Popup Notice';
            const notice = this.popupNotices[editIndex];
            if (editIdInput) editIdInput.value = notice.id || '';
            if (imageUrlInput) imageUrlInput.value = notice.imageUrl || '';
            // Set checkbox based on actual database value
            if (enabledCheckbox) {
                // Use enabled property (already normalized in loadPopupNotices) or fallback to isEnabled
                enabledCheckbox.checked = notice.enabled === true || notice.isEnabled === true;
            }
            
            if (notice.imageUrl) {
                this.showPopupNoticeImagePreview(notice.imageUrl);
            }
        } else {
            // Add mode - set defaults
            if (modalTitle) modalTitle.textContent = 'Add Popup Notice';
            if (editIdInput) editIdInput.value = '';
            if (enabledCheckbox) enabledCheckbox.checked = true; // Default to enabled for new notices
        }

        if (modal) modal.style.display = 'flex';
        
        // Reinitialize handlers for this modal instance
        const selectBtn = document.getElementById('selectPopupNoticeImageBtn');
        const fileInputForModal = document.getElementById('popupNoticeImageFile');
        if (selectBtn && fileInputForModal) {
            // Remove existing listeners by cloning
            const newSelectBtn = selectBtn.cloneNode(true);
            selectBtn.parentNode.replaceChild(newSelectBtn, selectBtn);
            newSelectBtn.addEventListener('click', () => {
                fileInputForModal.click();
            });
            
            // Set up file input change handler
            fileInputForModal.addEventListener('change', (e) => {
                this.handlePopupNoticeImageSelect(e);
            });
        }
        
        const removeBtn = document.getElementById('removePopupNoticeImageBtn');
        if (removeBtn) {
            // Remove existing listeners by cloning
            const newRemoveBtn = removeBtn.cloneNode(true);
            removeBtn.parentNode.replaceChild(newRemoveBtn, removeBtn);
            newRemoveBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Remove image button clicked in modal');
                this.removePopupNoticeImage();
            });
            console.log('Remove button handler attached in openPopupNoticeModal');
        } else {
            console.warn('Remove popup notice image button not found in openPopupNoticeModal');
        }
        
        // Reinitialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    /**
     * Close Popup Notice Modal
     */
    closePopupNoticeModal() {
        const modal = document.getElementById('popupNoticeModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    /**
     * Show Image Preview
     */
    showPopupNoticeImagePreview(url) {
        const previewContainer = document.getElementById('popupNoticeImagePreview');
        const previewImg = document.getElementById('popupNoticePreviewImg');
        
        if (previewContainer && previewImg && url) {
            previewImg.src = url;
            previewContainer.style.display = 'block';
        }
    }

    /**
     * Handle Image File Selection
     */
    handlePopupNoticeImageSelect(event) {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            showNotification('Please select a valid image file', 'error');
            return;
        }

        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            showNotification('Image size must be less than 5MB', 'error');
            return;
        }

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
            const imageUrl = e.target.result;
            this.showPopupNoticeImagePreview(imageUrl);
            // Store the file for later upload
            this.selectedPopupNoticeFile = file;
        };
        reader.readAsDataURL(file);
    }

    /**
     * Remove Selected Image
     */
    removePopupNoticeImage() {
        console.log('removePopupNoticeImage called');
        const previewContainer = document.getElementById('popupNoticeImagePreview');
        const fileInput = document.getElementById('popupNoticeImageFile');
        const imageUrlInput = document.getElementById('popupNoticeImageUrl');
        const previewImg = document.getElementById('popupNoticePreviewImg');
        
        if (previewContainer) {
            previewContainer.style.display = 'none';
            console.log('Preview container hidden');
        } else {
            console.warn('Preview container not found');
        }
        
        if (fileInput) {
            fileInput.value = '';
            console.log('File input cleared');
        }
        
        if (imageUrlInput) {
            imageUrlInput.value = '';
            console.log('Image URL input cleared');
        }
        
        if (previewImg) {
            previewImg.src = '';
            console.log('Preview image src cleared');
        }
        
        this.selectedPopupNoticeFile = null;
        console.log('Selected file cleared');
    }

    /**
     * Save Popup Notice Item
     */
    async savePopupNoticeItem() {
        const editIdInput = document.getElementById('popupNoticeEditId');
        const imageUrlInput = document.getElementById('popupNoticeImageUrl');
        const enabledCheckbox = document.getElementById('popupNoticeItemEnabled');
        const saveBtn = document.getElementById('savePopupNoticeItemBtn');

        // Disable save button during upload
        if (saveBtn) {
            saveBtn.disabled = true;
            saveBtn.innerHTML = '<i data-lucide="loader"></i> Saving...';
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }

        try {
            let imageUrl = imageUrlInput?.value?.trim();

            // If a new file is selected, upload it first
            if (this.selectedPopupNoticeFile) {
                const reader = new FileReader();
                const base64Data = await new Promise((resolve, reject) => {
                    reader.onload = (e) => resolve(e.target.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(this.selectedPopupNoticeFile);
                });

                // Upload image to server
                const token = localStorage.getItem('adminToken');
                const response = await fetch('/api/upload/image', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        imageData: base64Data,
                        fileName: this.selectedPopupNoticeFile.name,
                        folder: 'marigold-school/popup-notices'
                    })
                });

                const result = await response.json();
                
                if (!result.success || !result.url) {
                    throw new Error(result.message || 'Image upload failed');
                }

                imageUrl = result.url;
                if (imageUrlInput) imageUrlInput.value = imageUrl;
                this.selectedPopupNoticeFile = null;
            }

            // If no image URL, check if editing and use existing
            if (!imageUrl) {
                const editIndex = editIdInput?.value;
                if (editIndex !== '' && editIndex !== null && editIndex !== undefined) {
                    const index = parseInt(editIndex);
                    if (this.popupNotices && this.popupNotices[index]) {
                        imageUrl = this.popupNotices[index].imageUrl;
                    }
                }
            }

            if (!imageUrl) {
                throw new Error('Please select an image');
            }

            const noticeData = {
                imageUrl: imageUrl,
                isEnabled: enabledCheckbox?.checked !== false,
                orderIndex: this.popupNotices ? this.popupNotices.length : 0
            };

                const token = localStorage.getItem('adminToken');
                if (!token) {
                    throw new Error('Authentication required');
                }

            const editId = editIdInput?.value?.trim();
            let savedNotice;

            if (editId && editId !== '') {
                // Update existing notice
                const response = await fetch(`/api/admin/popup-notices/${editId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(noticeData)
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to update popup notice');
                }

                const result = await response.json();
                if (!result.success) {
                    throw new Error(result.error || 'Failed to update popup notice');
                }

                savedNotice = result.notice;
                showNotification('Popup notice updated successfully!', 'success');
            } else {
                // Create new notice
                const response = await fetch('/api/admin/popup-notices', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(noticeData)
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to create popup notice');
                }

                const result = await response.json();
                if (!result.success) {
                    throw new Error(result.error || 'Failed to create popup notice');
                }

                savedNotice = result.notice;
                showNotification('Popup notice added successfully!', 'success');
            }

            // Reload notices from API to get updated data
            await this.loadPopupNotices();
            this.closePopupNoticeModal();
        } catch (error) {
            console.error('Save error:', error);
            showNotification(error.message || 'Failed to save popup notice', 'error');
        } finally {
            // Re-enable save button
            if (saveBtn) {
                saveBtn.disabled = false;
                saveBtn.innerHTML = '<i data-lucide="save"></i> Save Notice';
                if (typeof lucide !== 'undefined') lucide.createIcons();
            }
        }
    }

    /**
     * Delete Popup Notice
     */
    async deletePopupNotice(index) {
        if (!this.popupNotices || !this.popupNotices[index]) {
            showNotification('Popup notice not found', 'error');
            return;
        }

        const notice = this.popupNotices[index];
        if (!notice.id) {
            showNotification('Invalid popup notice', 'error');
            return;
        }

        // Get identifying information for the modal
        const noticeIdentifier = notice.imageUrl 
            ? `Popup Notice (Image: ${notice.imageUrl.split('/').pop().substring(0, 30)}...)`
            : `Popup Notice #${index + 1}`;

        // Show confirmation modal
        if (window.DeleteConfirmationModal) {
            window.DeleteConfirmationModal.show({
                title: 'Delete Popup Notice',
                itemName: noticeIdentifier,
                itemType: 'popup notice',
                warningText: 'This action cannot be undone and will permanently remove the popup notice from the database.',
                onConfirm: async () => {
                    await this.performDeletePopupNotice(notice.id, index);
                },
                onCancel: () => {
                    // User cancelled, do nothing
                }
            });
        } else {
            // Fallback to browser confirm if modal not available
            if (confirm('Are you sure you want to delete this popup notice? This action cannot be undone.')) {
                await this.performDeletePopupNotice(notice.id, index);
            }
        }
    }

    /**
     * Perform the actual popup notice deletion
     */
    async performDeletePopupNotice(noticeId, index) {
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                throw new Error('Authentication required');
            }

            const response = await fetch(`/api/admin/popup-notices/${noticeId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to delete popup notice');
            }

            const result = await response.json();
            if (!result.success) {
                throw new Error(result.error || 'Failed to delete popup notice');
            }
            
            // Reload notices from API to get updated data
            await this.loadPopupNotices();
            showNotification('Popup notice deleted successfully!', 'success');
        } catch (error) {
            console.error('Delete error:', error);
            showNotification('Failed to delete popup notice: ' + error.message, 'error');
        }
    }
}

// Initialize the homepage content manager
window.homepageContentLoader = new HomepageContentLoader();
