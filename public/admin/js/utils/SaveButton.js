/**
 * SaveButton Component - Reusable save button with progress animation
 * Usage: const saveBtn = new SaveButton(options);
 */
class SaveButton {
    constructor(options = {}) {
        this.options = {
            // Button configuration
            text: options.text || 'Save Changes',
            icon: options.icon || 'save',
            variant: options.variant || 'primary', // primary, secondary, outline
            size: options.size || 'normal', // small, normal, large
            
            // Progress messages
            messages: {
                preparing: options.messages?.preparing || 'Preparing...',
                collecting: options.messages?.collecting || 'Collecting data...',
                saving: options.messages?.saving || 'Saving to database...',
                success: options.messages?.success || 'Saved successfully!'
            },
            
            // Progress percentages
            percentages: {
                collecting: options.percentages?.collecting || (options.hasImages ? 45 : 25),
                saving: options.percentages?.saving || (options.hasImages ? 75 : 50),
                success: options.percentages?.success || 100
            },
            
            // Timeout and behavior
            timeout: options.timeout || 15000, // 15 seconds
            autoHide: options.autoHide !== false, // Auto-hide after success
            hideDelay: options.hideDelay || 800, // Delay before hiding
            
            // Upload progress configuration
            hasImages: options.hasImages || false, // Whether this save includes image uploads
            uploadProgress: {
                start: options.uploadProgress?.start || 0,
                end: options.uploadProgress?.end || 40
            },
            
            // Callbacks
            onSave: options.onSave || null,
            onSuccess: options.onSuccess || null,
            onError: options.onError || null,
            onComplete: options.onComplete || null,
            onUploadProgress: options.onUploadProgress || null, // Callback for upload progress updates
            
            // DOM target
            target: options.target || null, // DOM element or selector
            className: options.className || 'save-section-btn',
            dataSection: options.dataSection || null
        };
        
        this.isSaving = false;
        this.originalContent = null;
        this.button = null;
        
        this.init();
    }
    
    /**
     * Initialize the save button
     */
    init() {
        if (this.options.target) {
            this.button = typeof this.options.target === 'string' 
                ? document.querySelector(this.options.target)
                : this.options.target;
        } else {
            this.createButton();
        }
        
        if (!this.button) {
            console.error('SaveButton: Target element not found');
            return;
        }
        
        this.setupButton();
        this.bindEvents();
    }
    
    /**
     * Create button element if target not provided
     */
    createButton() {
        this.button = document.createElement('button');
        this.button.className = `btn btn-${this.options.variant} ${this.options.className}`;
        
        if (this.options.dataSection) {
            this.button.setAttribute('data-section', this.options.dataSection);
        }
        
        // Add to DOM if needed
        const container = document.querySelector('.editor-actions') || document.body;
        container.appendChild(this.button);
    }
    
    /**
     * Setup button content and attributes
     */
    setupButton() {
        this.originalContent = `
            <i data-lucide="${this.options.icon}"></i>
            ${this.options.text}
        `;
        
        this.button.innerHTML = this.originalContent;
        this.button.disabled = false;
        this.button.classList.remove('saving');
        
        // Reinitialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
    
    /**
     * Bind event listeners
     */
    bindEvents() {
        this.button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            if (this.isSaving || this.button.disabled) {
                return;
            }
            
            this.save();
        });
    }
    
    /**
     * Main save method
     */
    async save() {
        try {
            this.isSaving = true;
            this.showProgress(this.options.messages.preparing);
            
            // Call the onSave callback
            if (this.options.onSave) {
                const result = await this.options.onSave(this);
                
                // Handle different result types
                if (result && typeof result === 'object') {
                    if (result.success) {
                        this.updateProgress(this.options.messages.success, this.options.percentages.success);
                        this.showSuccess();
                        
                        if (this.options.onSuccess) {
                            this.options.onSuccess(result);
                        }
                    } else {
                        throw new Error(result.message || 'Save failed');
                    }
                }
            }
            
        } catch (error) {
            console.error('SaveButton save error:', error);
            this.showError(error.message);
            
            if (this.options.onError) {
                this.options.onError(error);
            }
        } finally {
            this.isSaving = false;
            
            if (this.options.onComplete) {
                this.options.onComplete();
            }
        }
    }
    
    /**
     * Show progress indicator
     */
    showProgress(message) {
        this.button.classList.add('saving');
        this.button.disabled = true;
        
        this.button.innerHTML = `
            <div class="save-progress">
                <div class="progress-spinner"></div>
                <span class="progress-text">${message}</span>
                <span class="progress-percentage">0%</span>
            </div>
        `;
    }
    
    /**
     * Update progress
     */
    updateProgress(message, percentage) {
        const progressText = this.button.querySelector('.progress-text');
        const progressPercentage = this.button.querySelector('.progress-percentage');
        
        if (progressText) progressText.textContent = message;
        if (progressPercentage) progressPercentage.textContent = `${Math.round(percentage)}%`;
    }
    
    /**
     * Show success state
     */
    showSuccess() {
        this.updateProgress(this.options.messages.success, this.options.percentages.success);
        
        if (this.options.autoHide) {
            setTimeout(() => {
                this.hideProgress();
            }, this.options.hideDelay);
        }
    }
    
    /**
     * Show error state
     */
    showError(message) {
        this.button.innerHTML = `
            <div class="save-progress error">
                <div class="progress-spinner error"></div>
                <span class="progress-text">${message}</span>
            </div>
        `;
        
        setTimeout(() => {
            this.hideProgress();
        }, 3000); // Show error for 3 seconds
    }
    
    /**
     * Hide progress indicator
     */
    hideProgress() {
        this.button.classList.remove('saving');
        this.button.disabled = false;
        
        if (this.originalContent) {
            this.button.innerHTML = this.originalContent;
            
            // Reinitialize Lucide icons
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }
    }
    
    /**
     * Manual progress update (for custom save flows)
     */
    setProgress(message, percentage) {
        this.updateProgress(message, percentage);
    }
    
    /**
     * Set upload progress (for Cloudinary uploads)
     */
    setUploadProgress(message, uploadPercentage, totalImages = 1, currentImage = 1) {
        if (!this.options.hasImages) return;
        
        // Calculate overall percentage based on upload progress range
        const uploadRange = this.options.uploadProgress.end - this.options.uploadProgress.start;
        const overallPercentage = this.options.uploadProgress.start + (uploadPercentage * uploadRange / 100);
        
        // Format message for multiple images
        let progressMessage = message;
        if (totalImages > 1) {
            progressMessage = `${message} (${currentImage}/${totalImages})`;
        }
        
        this.updateProgress(progressMessage, overallPercentage);
        
        // Call upload progress callback if provided
        if (this.options.onUploadProgress) {
            this.options.onUploadProgress({
                message: progressMessage,
                uploadPercentage,
                overallPercentage,
                currentImage,
                totalImages
            });
        }
    }
    
    /**
     * Reset button to initial state
     */
    reset() {
        this.isSaving = false;
        this.hideProgress();
    }
    
    /**
     * Enable/disable button
     */
    setEnabled(enabled) {
        this.button.disabled = !enabled;
    }
    
    /**
     * Get button element
     */
    getElement() {
        return this.button;
    }
    
    /**
     * Upload multiple images in parallel with progress tracking
     */
    async uploadImagesInParallel(imageFiles, uploadFunction) {
        if (!imageFiles || imageFiles.length === 0) return [];
        
        const totalImages = imageFiles.length;
        const uploadPromises = [];
        const results = [];
        
        // Create upload promises with individual progress tracking
        imageFiles.forEach((file, index) => {
            const uploadPromise = uploadFunction(file, (progress) => {
                this.setUploadProgress('Uploading images...', progress, totalImages, index + 1);
            });
            
            uploadPromises.push(uploadPromise);
        });
        
        // Use Promise.allSettled to handle partial failures
        const settledResults = await Promise.allSettled(uploadPromises);
        
        // Process results and handle errors
        settledResults.forEach((result, index) => {
            if (result.status === 'fulfilled') {
                results.push(result.value);
            } else {
                console.error(`Image upload failed for file ${index + 1}:`, result.reason);
                results.push(null); // Placeholder for failed upload
            }
        });
        
        // Update progress to show upload completion
        this.setUploadProgress('Images uploaded', 100, totalImages, totalImages);
        
        return results;
    }
}

// Export for use in other files
window.SaveButton = SaveButton;
