/**
 * Reusable Image Upload Component
 * Provides consistent image upload functionality across all admin pages
 */
if (typeof ImageUpload === 'undefined') {
class ImageUpload {
    constructor(options = {}) {
        this.options = {
            container: options.container || null,
            fileInputId: options.fileInputId || 'image-upload',
            urlInputId: options.urlInputId || 'image-url',
            selectBtnId: options.selectBtnId || 'image-select-btn',
            previewContainerId: options.previewContainerId || 'image-preview-container',
            previewImgId: options.previewImgId || 'image-preview',
            removeBtnId: options.removeBtnId || 'image-remove-btn',
            maxSize: options.maxSize || 25 * 1024 * 1024, // 25MB default
            acceptedTypes: options.acceptedTypes || ['image/png', 'image/jpg', 'image/jpeg', 'image/gif'],
            uploadPath: options.uploadPath || '/api/upload/image',
            uploadFolder: options.uploadFolder || 'marigold-school/events', // Default folder
            autoUpload: options.autoUpload !== false, // Default to true, can be disabled
            allowVideo: options.allowVideo || false, // Support video uploads
            onUploadStart: options.onUploadStart || null,
            onUploadProgress: options.onUploadProgress || null,
            onUploadSuccess: options.onUploadSuccess || null,
            onUploadError: options.onUploadError || null,
            onImageSelect: options.onImageSelect || null,
            onImageRemove: options.onImageRemove || null,
            showNotification: options.showNotification || null
        };
        
        // Add video types if allowVideo is enabled
        if (this.options.allowVideo) {
            this.options.acceptedTypes = [
                ...this.options.acceptedTypes,
                'video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'
            ];
        }
        
        this.isInitialized = false;
        this.currentMediaType = null; // Track if current file is image or video
    }

    /**
     * Initialize the image upload component
     */
    init() {
        if (this.isInitialized) {
            console.warn('ImageUpload component already initialized');
            return;
        }

        const container = this.options.container || document;
        
        // Get elements
        const fileInput = container.querySelector(`#${this.options.fileInputId}`);
        const urlInput = container.querySelector(`#${this.options.urlInputId}`);
        const selectBtn = container.querySelector(`#${this.options.selectBtnId}`);
        const previewContainer = container.querySelector(`#${this.options.previewContainerId}`);
        const previewImg = container.querySelector(`#${this.options.previewImgId}`);
        const removeBtn = container.querySelector(`#${this.options.removeBtnId}`);

        if (!fileInput || !selectBtn || !previewContainer || !previewImg || !removeBtn) {
            console.error('ImageUpload: Required elements not found', {
                fileInput: !!fileInput,
                selectBtn: !!selectBtn,
                previewContainer: !!previewContainer,
                previewImg: !!previewImg,
                removeBtn: !!removeBtn
            });
            return;
        }

        // Store references
        this.elements = {
            fileInput,
            urlInput,
            selectBtn,
            previewContainer,
            previewImg,
            removeBtn
        };

        // Setup event listeners
        this.setupEventListeners();
        
        // Show existing image if URL input has value
        if (urlInput && urlInput.value) {
            this.showImagePreview(urlInput.value);
        }

        this.isInitialized = true;
        console.log('ImageUpload component initialized');
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        const { fileInput, selectBtn, removeBtn } = this.elements;

        // Select button click handler
        selectBtn.addEventListener('click', () => {
            fileInput.click();
        });

        // File input change handler
        fileInput.addEventListener('change', (e) => {
            this.handleFileSelect(e.target.files[0]);
        });

        // Remove button click handler
        removeBtn.addEventListener('click', () => {
            this.removeImage();
        });
    }

    /**
     * Handle file selection
     */
    handleFileSelect(file) {
        if (!file) return;

        // Determine if file is image or video
        const isVideo = file.type.startsWith('video/');
        const isImage = file.type.startsWith('image/');
        const isSVG = file.type === 'image/svg+xml';
        
        // Validate file type
        if (!this.options.acceptedTypes.includes(file.type)) {
            const hasSVG = this.options.acceptedTypes.includes('image/svg+xml');
            const mediaTypes = this.options.allowVideo ? 
                (hasSVG ? 'PNG, JPG, JPEG, GIF, SVG images or MP4, WebM, OGG, MOV videos' : 'PNG, JPG, JPEG, GIF images or MP4, WebM, OGG, MOV videos') : 
                (hasSVG ? 'PNG, JPG, JPEG, GIF, or SVG image' : 'PNG, JPG, JPEG, or GIF image');
            this.showError(`Invalid file type. Please select a ${mediaTypes}.`);
            return;
        }

        // Validate file size
        if (file.size > this.options.maxSize) {
            const mediaType = this.options.allowVideo ? 'file' : 'image';
            this.showError(`File size too large. Please select a ${mediaType} smaller than ${(this.options.maxSize / 1024 / 1024).toFixed(1)}MB.`);
            return;
        }

        // Store current media type
        this.currentMediaType = isVideo ? 'video' : 'image';

        // For videos, use Blob URL to avoid CSP issues with data URLs
        // For images, use data URL (CSP-safe)
        if (isVideo) {
            const blobUrl = URL.createObjectURL(file);
            this.showMediaPreview(blobUrl, this.currentMediaType);
            
            // Store blob URL for cleanup later
            this.currentBlobUrl = blobUrl;
        } else {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.showMediaPreview(e.target.result, this.currentMediaType);
            };
            reader.readAsDataURL(file);
        }

        // Call callback if provided
        if (this.options.onImageSelect) {
            this.options.onImageSelect(file);
        }

        // Upload file only if autoUpload is enabled
        if (this.options.autoUpload) {
            this.uploadFile(file);
        }
    }

    /**
     * Upload file to server
     */
    async uploadFile(file) {
        if (this.options.onUploadStart) {
            this.options.onUploadStart(file);
        }

        try {
            // Convert file to base64 for upload
            const base64Data = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });

            // Prepare upload data
            const uploadData = {
                imageData: base64Data,
                fileName: file.name,
                folder: this.options.uploadFolder || 'marigold-school/events'
            };

            // Add progress tracking if supported
            const xhr = new XMLHttpRequest();
            
            if (this.options.onUploadProgress) {
                xhr.upload.addEventListener('progress', (e) => {
                    if (e.lengthComputable) {
                        const progress = (e.loaded / e.total) * 100;
                        this.options.onUploadProgress(progress);
                    }
                });
            }

            const uploadPromise = new Promise((resolve, reject) => {
                xhr.onload = () => {
                    if (xhr.status === 200) {
                        try {
                            const response = JSON.parse(xhr.responseText);
                            resolve(response);
                        } catch (e) {
                            reject(new Error('Invalid server response'));
                        }
                    } else {
                        reject(new Error(`Upload failed: ${xhr.status}`));
                    }
                };
                
                xhr.onerror = () => {
                    reject(new Error('Upload failed'));
                };
            });

            xhr.open('POST', this.options.uploadPath);
            xhr.setRequestHeader('Content-Type', 'application/json');
            
            // Add authorization header if token exists
            const token = localStorage.getItem('adminToken');
            if (token) {
                xhr.setRequestHeader('Authorization', `Bearer ${token}`);
            }

            xhr.send(JSON.stringify(uploadData));

            const result = await uploadPromise;
            
            // Update URL input with the uploaded image URL
            if (this.elements.urlInput && result.url) {
                this.elements.urlInput.value = result.url;
            }

            if (this.options.onUploadSuccess) {
                this.options.onUploadSuccess(result);
            }

            this.showSuccess('Image uploaded successfully');
            
            return result;

        } catch (error) {
            console.error('Image upload error:', error);
            
            if (this.options.onUploadError) {
                this.options.onUploadError(error);
            }
            
            this.showError(`Upload failed: ${error.message}`);
            throw error;
        }
    }

    /**
     * Show media preview (image or video)
     */
    showMediaPreview(mediaUrl, mediaType = 'image') {
        const { previewContainer, previewImg, selectBtn } = this.elements;
        
        // Detect media type from URL if not provided
        if (!mediaType && mediaUrl) {
            const isVideo = mediaUrl.match(/\.(mp4|webm|ogg|mov)$/i);
            mediaType = isVideo ? 'video' : 'image';
        }
        
        // Clear existing preview
        previewContainer.innerHTML = '';
        
        if (mediaType === 'video') {
            // Create video element
            const videoElement = document.createElement('video');
            videoElement.id = this.options.previewImgId;
            videoElement.className = 'image-preview';
            videoElement.src = mediaUrl;
            videoElement.controls = true;
            videoElement.autoplay = false;
            videoElement.muted = true;
            videoElement.loop = true;
            videoElement.style.cssText = 'width: 100%; height: 100%; object-fit: cover; border-radius: 8px;';
            
            previewContainer.appendChild(videoElement);
        } else {
            // Create image element
            const imageElement = document.createElement('img');
            imageElement.id = this.options.previewImgId;
            imageElement.className = 'image-preview';
            imageElement.src = mediaUrl;
            imageElement.alt = 'Preview';
            
            previewContainer.appendChild(imageElement);
        }
        
        // Add remove button
        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.id = this.options.removeBtnId;
        removeBtn.className = 'image-remove-btn';
        removeBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="x" class="lucide lucide-x">
                <path d="M18 6 6 18"></path>
                <path d="m6 6 12 12"></path>
            </svg>
        `;
        removeBtn.addEventListener('click', () => this.removeImage());
        previewContainer.appendChild(removeBtn);
        
        // Update element references
        this.elements.removeBtn = removeBtn;
        this.elements.previewImg = mediaType === 'video' ? 
            previewContainer.querySelector('video') : 
            previewContainer.querySelector('img');
        
        previewContainer.style.display = 'block';
        selectBtn.style.display = 'none';
        
        // Store current media type
        this.currentMediaType = mediaType;
    }
    
    /**
     * Show image preview (legacy method for backward compatibility)
     */
    showImagePreview(imageUrl) {
        this.showMediaPreview(imageUrl, 'image');
    }

    /**
     * Remove image
     */
    removeImage() {
        const { fileInput, urlInput, previewContainer, selectBtn } = this.elements;
        
        console.log('🗑️ Remove image called');
        console.log('🔍 URL input before clear:', urlInput ? urlInput.value : 'No URL input');
        
        // Revoke blob URL if exists to free memory
        if (this.currentBlobUrl) {
            URL.revokeObjectURL(this.currentBlobUrl);
            this.currentBlobUrl = null;
        }
        
        // Clear file input
        fileInput.value = '';
        
        // Clear URL input
        if (urlInput) {
            urlInput.value = '';
            console.log('✅ URL input cleared to empty string');
            console.log('🔍 URL input after clear:', urlInput.value);
            console.log('🔍 URL input ID:', urlInput.id);
        } else {
            console.warn('⚠️ No URL input found!');
        }
        
        // Hide preview
        previewContainer.style.display = 'none';
        selectBtn.style.display = 'block';

        // Call callback if provided
        if (this.options.onImageRemove) {
            this.options.onImageRemove();
        }
        
        console.log('✅ Remove image completed');
    }

    /**
     * Set image URL programmatically
     */
    setImageUrl(url) {
        const { urlInput } = this.elements;
        
        if (urlInput) {
            urlInput.value = url;
        }
        
        if (url) {
            // Detect media type from URL
            const isVideo = url.match(/\.(mp4|webm|ogg|mov)$/i);
            this.showMediaPreview(url, isVideo ? 'video' : 'image');
        } else {
            this.removeImage();
        }
    }

    /**
     * Get current image URL
     */
    getImageUrl() {
        const { urlInput } = this.elements;
        return urlInput ? urlInput.value : '';
    }

    /**
     * Check if there's a pending file upload
     */
    hasPendingUpload() {
        const { fileInput } = this.elements;
        return fileInput && fileInput.files && fileInput.files[0];
    }

    /**
     * Show success message
     */
    showSuccess(message) {
        if (this.options.showNotification) {
            this.options.showNotification('success', message);
        } else {
            console.log('Success:', message);
        }
    }

    /**
     * Show error message
     */
    showError(message) {
        if (this.options.showNotification) {
            this.options.showNotification('error', message);
        } else {
            console.error('Error:', message);
        }
    }

    /**
     * Destroy the component
     */
    destroy() {
        if (!this.isInitialized) return;
        
        // Remove event listeners by cloning elements
        const { fileInput, selectBtn, removeBtn } = this.elements;
        
        if (fileInput) {
            fileInput.replaceWith(fileInput.cloneNode(true));
        }
        
        if (selectBtn) {
            selectBtn.replaceWith(selectBtn.cloneNode(true));
        }
        
        if (removeBtn) {
            removeBtn.replaceWith(removeBtn.cloneNode(true));
        }
        
        this.isInitialized = false;
        this.elements = null;
    }

    /**
     * Static method to create HTML for image upload container
     */
    static createHTML(options = {}) {
        const {
            fileInputId = 'image-upload',
            urlInputId = 'image-url',
            selectBtnId = 'image-select-btn',
            previewContainerId = 'image-preview-container',
            previewImgId = 'image-preview',
            removeBtnId = 'image-remove-btn',
            buttonText = 'Select Image',
            helpText = 'PNG, JPG, GIF up to 25MB',
            existingImageUrl = '',
            allowVideo = false
        } = options;

        // Determine accept attribute and icon
        const acceptAttr = allowVideo ? 'image/*,video/*' : 'image/*';
        const iconSvg = allowVideo ? 
            '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="video" class="lucide lucide-video"><path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"></path><rect x="2" y="6" width="14" height="12" rx="2"></rect></svg>' :
            '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="image" class="lucide lucide-image"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><circle cx="9" cy="9" r="2"></circle><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path></svg>';
        
        // Detect if existing URL is a video
        const isExistingVideo = existingImageUrl && existingImageUrl.match(/\.(mp4|webm|ogg|mov)$/i);
        
        // Create preview element based on media type
        let previewElement = '';
        if (isExistingVideo) {
            previewElement = `<video id="${previewImgId}" class="image-preview" src="${existingImageUrl}" controls muted loop style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;"></video>`;
        } else {
            previewElement = `<img id="${previewImgId}" class="image-preview" alt="Preview" src="${existingImageUrl}">`;
        }

        return `
            <div class="image-upload-container">
                <input type="file" id="${fileInputId}" class="image-upload-input" accept="${acceptAttr}" style="display: none;">
                <input type="hidden" id="${urlInputId}" value="${existingImageUrl}">
                <button type="button" id="${selectBtnId}" class="btn btn-outline image-select-btn" style="${existingImageUrl ? 'display: none;' : ''}">
                    ${iconSvg}
                    ${buttonText}
                </button>
                <div class="image-preview-container" id="${previewContainerId}" style="${existingImageUrl ? 'display: block;' : 'display: none;'}">
                    ${previewElement}
                    <button type="button" id="${removeBtnId}" class="image-remove-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="x" class="lucide lucide-x"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
                    </button>
                </div>
            </div>
            ${helpText ? `<small class="form-help">${helpText}</small>` : ''}
        `;
    }
}

// Make it globally available
window.ImageUpload = ImageUpload;
}
