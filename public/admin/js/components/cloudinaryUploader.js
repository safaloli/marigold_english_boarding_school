/**
 * Cloudinary Image Uploader Component
 * Handles image uploads to Cloudinary with progress tracking and preview
 */
class CloudinaryUploader {
    constructor() {
        this.uploadEndpoint = '/api/upload';
        this.uploadedImages = [];
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        // File input change events
        document.addEventListener('change', (e) => {
            if (e.target.matches('input[type="file"][data-cloudinary-upload]')) {
                this.handleFileSelection(e.target);
            }
        });

        // Upload button clicks
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-cloudinary-upload-btn]')) {
                e.preventDefault();
                this.triggerFileInput(e.target);
            }
        });

        // Delete image buttons
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-delete-image]')) {
                e.preventDefault();
                this.deleteImage(e.target);
            }
        });
    }

    /**
     * Create file input element
     */
    createFileInput(options = {}) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.multiple = options.multiple || false;
        input.setAttribute('data-cloudinary-upload', 'true');
        input.style.display = 'none';
        
        if (options.maxFiles) {
            input.setAttribute('data-max-files', options.maxFiles);
        }
        
        return input;
    }

    /**
     * Trigger file input
     */
    triggerFileInput(button) {
        const input = this.createFileInput({
            multiple: button.dataset.multiple === 'true',
            maxFiles: button.dataset.maxFiles || 1
        });
        
        document.body.appendChild(input);
        input.click();
        
        input.addEventListener('change', () => {
            this.handleFileSelection(input);
            document.body.removeChild(input);
        });
    }

    /**
     * Handle file selection
     */
    async handleFileSelection(input) {
        const files = Array.from(input.files);
        const maxFiles = parseInt(input.dataset.maxFiles) || 1;
        
        if (files.length > maxFiles) {
            this.showNotification('Error', `Maximum ${maxFiles} file(s) allowed`, 'error');
            return;
        }

        // Validate file types and sizes
        for (const file of files) {
            if (!this.validateFile(file)) {
                return;
            }
        }

        // Upload files
        await this.uploadFiles(files, input.dataset);
    }

    /**
     * Validate file
     */
    validateFile(file) {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        const maxSize = 25 * 1024 * 1024; // 25MB

        if (!allowedTypes.includes(file.type)) {
            this.showNotification('Error', 'Only image files are allowed', 'error');
            return false;
        }

        if (file.size > maxSize) {
            this.showNotification('Error', 'File size must be less than 25MB', 'error');
            return false;
        }

        return true;
    }

    /**
     * Upload files to Cloudinary
     */
    async uploadFiles(files, options = {}) {
        const formData = new FormData();
        
        // Add files to form data
        files.forEach(file => {
            formData.append(options.multiple === 'true' ? 'images' : 'image', file);
        });

        // Add additional options
        if (options.section) formData.append('section', options.section);
        if (options.key) formData.append('key', options.key);

        try {
            this.showUploadProgress(true);
            
            const response = await fetch(this.uploadEndpoint + (options.multiple === 'true' ? '/multiple' : '/single'), {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                }
            });

            const result = await response.json();
            
            if (result.success) {
                this.handleUploadSuccess(result.data, options);
            } else {
                throw new Error(result.message || 'Upload failed');
            }
        } catch (error) {
            console.error('Upload error:', error);
            this.showNotification('Upload Error', error.message, 'error');
        } finally {
            this.showUploadProgress(false);
        }
    }

    /**
     * Handle successful upload
     */
    handleUploadSuccess(data, options = {}) {
        const images = Array.isArray(data) ? data : [data];
        
        images.forEach(imageData => {
            this.uploadedImages.push(imageData);
            this.displayUploadedImage(imageData, options);
        });

        this.showNotification('Success', `${images.length} image(s) uploaded successfully`, 'success');
        
        // Trigger custom event
        document.dispatchEvent(new CustomEvent('cloudinaryUploadSuccess', {
            detail: { images: images, options: options }
        }));
    }

    /**
     * Display uploaded image
     */
    displayUploadedImage(imageData, options = {}) {
        const container = document.querySelector(options.container || '[data-image-container]');
        if (!container) return;

        const imageElement = document.createElement('div');
        imageElement.className = 'uploaded-image-item';
        imageElement.innerHTML = `
            <div class="image-preview">
                <img src="${imageData.secure_url}" alt="${imageData.metadata?.original_filename || 'Uploaded image'}" loading="lazy">
                <div class="image-overlay">
                    <button type="button" class="btn-delete" data-delete-image="${imageData.public_id}" data-content-id="${imageData.id}">
                        <i data-lucide="trash-2"></i>
                    </button>
                    <button type="button" class="btn-copy" data-copy-url="${imageData.secure_url}">
                        <i data-lucide="copy"></i>
                    </button>
                </div>
            </div>
            <div class="image-info">
                <p class="image-filename">${imageData.metadata?.original_filename || 'Image'}</p>
                <p class="image-size">${this.formatFileSize(imageData.metadata?.bytes || 0)}</p>
            </div>
            <input type="hidden" name="${options.inputName || 'imageUrl'}" value="${imageData.secure_url}">
            <input type="hidden" name="${options.publicIdName || 'publicId'}" value="${imageData.public_id}">
        `;

        container.appendChild(imageElement);
        
        // Initialize Lucide icons
        if (window.lucide) {
            lucide.createIcons();
        }
    }

    /**
     * Delete image
     */
    async deleteImage(button) {
        const publicId = button.dataset.deleteImage;
        const contentId = button.dataset.contentId;
        
        if (!confirm('Are you sure you want to delete this image?')) {
            return;
        }

        try {
            const response = await fetch(`${this.uploadEndpoint}/${publicId}?contentId=${contentId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                }
            });

            const result = await response.json();
            
            if (result.success) {
                button.closest('.uploaded-image-item').remove();
                this.showNotification('Success', 'Image deleted successfully', 'success');
            } else {
                throw new Error(result.message || 'Delete failed');
            }
        } catch (error) {
            console.error('Delete error:', error);
            this.showNotification('Delete Error', error.message, 'error');
        }
    }

    /**
     * Show upload progress
     */
    showUploadProgress(show) {
        let progressElement = document.querySelector('.upload-progress');
        
        if (show && !progressElement) {
            progressElement = document.createElement('div');
            progressElement.className = 'upload-progress';
            progressElement.innerHTML = `
                <div class="progress-content">
                    <div class="spinner"></div>
                    <p>Uploading images...</p>
                </div>
            `;
            document.body.appendChild(progressElement);
        } else if (!show && progressElement) {
            progressElement.remove();
        }
    }

    /**
     * Format file size
     */
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    /**
     * Show notification
     */
    showNotification(title, message, type = 'info') {
        // Use existing notification system if available
        if (window.showNotification) {
            window.showNotification(title, message, type);
        } else {
            alert(`${title}: ${message}`);
        }
    }

    /**
     * Get uploaded images
     */
    getUploadedImages() {
        return this.uploadedImages;
    }

    /**
     * Clear uploaded images
     */
    clearUploadedImages() {
        this.uploadedImages = [];
        const container = document.querySelector('[data-image-container]');
        if (container) {
            container.innerHTML = '';
        }
    }
}

// Initialize Cloudinary uploader
document.addEventListener('DOMContentLoaded', () => {
    window.cloudinaryUploader = new CloudinaryUploader();
});

// Export for module usage (only if module is defined)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CloudinaryUploader;
}
