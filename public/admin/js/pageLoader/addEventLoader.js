// Add Event Page Loader - Marigold School Admin
// Handles the add event page functionality

class AddEventPageManager {
    constructor() {
        this.form = document.getElementById('addEventForm');
        this.imageUploadArea = document.getElementById('imageUploadArea');
        this.imagePreview = document.getElementById('imagePreview');
        this.imageUpload = document.getElementById('imageUpload');
        this.previewImage = document.getElementById('previewImage');
        this.removeImageBtn = document.getElementById('removeImageBtn');
        this.scheduleContainer = document.getElementById('scheduleContainer');
        this.addScheduleBtn = document.getElementById('addScheduleBtn');
        this.saveEventBtn = document.getElementById('saveEventBtn');
        this.saveDraftBtn = document.getElementById('saveDraftBtn');
        this.previewEventBtn = document.getElementById('previewEventBtn');
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.setupImageUpload();
        this.setupScheduleManagement();
        this.setupFormValidation();
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Form submission
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }

        // Save event button
        if (this.saveEventBtn) {
            this.saveEventBtn.addEventListener('click', () => this.saveEvent());
        }

        // Save draft button
        if (this.saveDraftBtn) {
            this.saveDraftBtn.addEventListener('click', () => this.saveDraft());
        }

        // Preview button
        if (this.previewEventBtn) {
            this.previewEventBtn.addEventListener('click', () => this.previewEvent());
        }

        // Image removal
        if (this.removeImageBtn) {
            this.removeImageBtn.addEventListener('click', () => this.removeImage());
        }

        // Add schedule button
        if (this.addScheduleBtn) {
            this.addScheduleBtn.addEventListener('click', () => this.addScheduleItem());
        }

        // Auto-save functionality
        this.setupAutoSave();
    }

    /**
     * Setup image upload functionality
     */
    setupImageUpload() {
        if (this.imageUploadArea && this.imageUpload) {
            // Click to upload
            this.imageUploadArea.addEventListener('click', () => {
                this.imageUpload.click();
            });

            // Drag and drop
            this.imageUploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                this.imageUploadArea.classList.add('drag-over');
            });

            this.imageUploadArea.addEventListener('dragleave', () => {
                this.imageUploadArea.classList.remove('drag-over');
            });

            this.imageUploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                this.imageUploadArea.classList.remove('drag-over');
                
                const files = e.dataTransfer.files;
                if (files.length > 0) {
                    this.handleImageUpload(files[0]);
                }
            });

            // File input change
            this.imageUpload.addEventListener('change', (e) => {
                if (e.target.files.length > 0) {
                    this.handleImageUpload(e.target.files[0]);
                }
            });
        }
    }

    /**
     * Handle image upload
     */
    handleImageUpload(file) {
        if (!file.type.startsWith('image/')) {
            this.showNotification('error', 'Please select a valid image file');
            return;
        }

        if (file.size > 10 * 1024 * 1024) { // 10MB limit
            this.showNotification('error', 'Image size must be less than 10MB');
            return;
        }

        // Show preview
        const reader = new FileReader();
        reader.onload = (e) => {
            this.previewImage.src = e.target.result;
            this.imageUploadArea.style.display = 'none';
            this.imagePreview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }

    /**
     * Remove uploaded image
     */
    removeImage() {
        this.imageUpload.value = '';
        this.previewImage.src = '';
        this.imagePreview.style.display = 'none';
        this.imageUploadArea.style.display = 'block';
    }

    /**
     * Setup schedule management
     */
    setupScheduleManagement() {
        // Handle remove schedule item clicks
        this.scheduleContainer.addEventListener('click', (e) => {
            if (e.target.closest('.remove-schedule-btn')) {
                e.preventDefault();
                const scheduleItem = e.target.closest('.schedule-item');
                if (scheduleItem) {
                    scheduleItem.remove();
                }
            }
        });
    }

    /**
     * Add new schedule item
     */
    addScheduleItem() {
        const scheduleItem = document.createElement('div');
        scheduleItem.className = 'schedule-item';
        scheduleItem.innerHTML = `
            <div class="form-row">
                <div class="form-group">
                    <label>Time</label>
                    <input type="time" name="scheduleTime[]" class="form-input">
                </div>
                <div class="form-group">
                    <label>Activity</label>
                    <input type="text" name="scheduleActivity[]" placeholder="Activity description" class="form-input">
                </div>
                <div class="form-group">
                    <label>Speaker/Person</label>
                    <input type="text" name="scheduleSpeaker[]" placeholder="Speaker name" class="form-input">
                </div>
                <div class="form-group">
                    <button type="button" class="btn-icon remove-schedule-btn">
                        <i data-lucide="trash-2"></i>
                    </button>
                </div>
            </div>
        `;

        this.scheduleContainer.appendChild(scheduleItem);
        
        // Reinitialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    /**
     * Setup form validation
     */
    setupFormValidation() {
        const requiredFields = this.form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            field.addEventListener('blur', () => {
                this.validateField(field);
            });
        });
    }

    /**
     * Validate individual field
     */
    validateField(field) {
        const value = field.value.trim();
        const isValid = value !== '';
        
        if (isValid) {
            field.classList.remove('error');
            field.classList.add('valid');
        } else {
            field.classList.remove('valid');
            field.classList.add('error');
        }
        
        return isValid;
    }

    /**
     * Validate entire form
     */
    validateForm() {
        const requiredFields = this.form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    }

    /**
     * Setup auto-save functionality
     */
    setupAutoSave() {
        const formData = this.getFormData();
        
        // Auto-save every 30 seconds
        setInterval(() => {
            const currentData = this.getFormData();
            if (JSON.stringify(currentData) !== JSON.stringify(formData)) {
                this.autoSave();
            }
        }, 30000);
    }

    /**
     * Auto-save form data
     */
    autoSave() {
        const formData = this.getFormData();
        localStorage.setItem('addEventDraft', JSON.stringify(formData));
    }

    /**
     * Get form data
     */
    getFormData() {
        const formData = new FormData(this.form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            if (key.endsWith('[]')) {
                const arrayKey = key.slice(0, -2);
                if (!data[arrayKey]) {
                    data[arrayKey] = [];
                }
                data[arrayKey].push(value);
            } else {
                data[key] = value;
            }
        }
        
        return data;
    }

    /**
     * Handle form submission
     */
    handleFormSubmit(e) {
        e.preventDefault();
        
        if (!this.validateForm()) {
            this.showNotification('error', 'Please fill in all required fields');
            return;
        }
        
        this.saveEvent();
    }

    /**
     * Save event
     */
    async saveEvent() {
        try {
            this.showLoading(true);
            
            const formData = this.getFormData();
            
            // Add status
            formData.status = 'upcoming';
            
            const response = await fetch('/api/content/events-content', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    section: 'upcoming_events',
                    data: formData
                })
            });
            
            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    this.showNotification('success', 'Event created successfully!');
                    
                    // Clear draft
                    localStorage.removeItem('addEventDraft');
                    
                    // Redirect to events list
                    setTimeout(() => {
                        window.location.href = '/admin/#events-content';
                    }, 1500);
                } else {
                    throw new Error(result.message || 'Failed to create event');
                }
            } else {
                throw new Error('Network error occurred');
            }
        } catch (error) {
            console.error('Error saving event:', error);
            this.showNotification('error', 'Failed to create event. Please try again.');
        } finally {
            this.showLoading(false);
        }
    }

    /**
     * Save as draft
     */
    async saveDraft() {
        try {
            const formData = this.getFormData();
            formData.status = 'draft';
            
            // Save to localStorage as backup
            localStorage.setItem('addEventDraft', JSON.stringify(formData));
            
            this.showNotification('success', 'Draft saved successfully!');
        } catch (error) {
            console.error('Error saving draft:', error);
            this.showNotification('error', 'Failed to save draft');
        }
    }

    /**
     * Preview event
     */
    previewEvent() {
        if (!this.validateForm()) {
            this.showNotification('error', 'Please fill in all required fields before previewing');
            return;
        }
        
        const formData = this.getFormData();
        
        // Store preview data
        sessionStorage.setItem('eventPreviewData', JSON.stringify(formData));
        
        // Open preview in new tab
        window.open('/eventsDetails.html?preview=true', '_blank');
    }

    /**
     * Show loading state
     */
    showLoading(show) {
        const buttons = [this.saveEventBtn, this.saveDraftBtn, this.previewEventBtn];
        
        buttons.forEach(btn => {
            if (btn) {
                btn.disabled = show;
                if (show) {
                    btn.innerHTML = '<i data-lucide="loader-2" class="animate-spin"></i> Loading...';
                } else {
                    // Restore original content
                    if (btn === this.saveEventBtn) {
                        btn.innerHTML = '<i data-lucide="save"></i> Save Event';
                    } else if (btn === this.saveDraftBtn) {
                        btn.innerHTML = '<i data-lucide="save"></i> Save as Draft';
                    } else if (btn === this.previewEventBtn) {
                        btn.innerHTML = '<i data-lucide="eye"></i> Preview';
                    }
                }
            }
        });
        
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    /**
     * Show notification
     */
    showNotification(type, message) {
        if (window.showNotification) {
            window.showNotification(type, message);
        } else {
            // Fallback notification
            const notification = document.createElement('div');
            notification.className = `toast toast-${type}`;
            notification.textContent = message;
            
            const container = document.getElementById('toastContainer');
            if (container) {
                container.appendChild(notification);
                
                setTimeout(() => {
                    notification.remove();
                }, 5000);
            }
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new AddEventPageManager();
});
