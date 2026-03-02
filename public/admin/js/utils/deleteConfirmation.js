/**
 * Global Delete Confirmation Modal Component
 * Provides consistent delete confirmation dialogs across all admin pages
 */
class DeleteConfirmationModal {
    constructor() {
        this.modal = null;
        this.isOpen = false;
    }

    /**
     * Show delete confirmation modal
     * @param {Object} options - Configuration options
     * @param {string} options.title - Modal title (default: "Delete Item")
     * @param {string} options.itemName - Name of the item being deleted
     * @param {string} options.itemType - Type of item (e.g., "photo", "video", "team member")
     * @param {string} options.itemId - ID of the item (optional)
     * @param {Function} options.onConfirm - Callback function when user confirms deletion
     * @param {Function} options.onCancel - Callback function when user cancels (optional)
     * @param {string} options.warningText - Custom warning text (optional)
     */
    show(options = {}) {
        const {
            title = "Delete Item",
            itemName = "this item",
            itemType = "item",
            itemId = "",
            onConfirm = () => {},
            onCancel = () => {},
            warningText = null
        } = options;

        // Close any existing modal
        this.close();

        // Create modal HTML
        const modalHTML = `
            <div class="delete-confirmation-overlay" id="delete-confirmation-modal">
                <div class="delete-confirmation-modal">
                    <div class="modal-header">
                        <div class="modal-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="alert-triangle" class="lucide lucide-alert-triangle">
                                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"></path>
                                <path d="M12 9v4"></path>
                                <path d="M12 17h.01"></path>
                            </svg>
                        </div>
                        <h3>${title}</h3>
                    </div>
                    <div class="modal-content">
                        <p>Are you sure you want to delete <strong>"${itemName}"</strong>?</p>
                        <p class="warning-text">${warningText || `This action cannot be undone and will permanently remove the ${itemType} from Cloudinary and the database.`}</p>
                    </div>
                    <div class="modal-actions">
                        <button class="btn btn-secondary cancel-delete-btn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="x" class="lucide lucide-x">
                                <path d="M18 6 6 18"></path>
                                <path d="m6 6 12 12"></path>
                            </svg>
                            Cancel
                        </button>
                        <button class="btn btn-danger confirm-delete-btn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="trash-2" class="lucide lucide-trash-2">
                                <path d="M10 11v6"></path>
                                <path d="M14 11v6"></path>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                                <path d="M3 6h18"></path>
                                <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                            Delete 
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Add modal to DOM
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.modal = document.getElementById('delete-confirmation-modal');
        this.isOpen = true;

        // Initialize Lucide icons
        if (window.lucide) {
            lucide.createIcons();
        }

        // Add event listeners
        this.setupEventListeners(onConfirm, onCancel);

        // Focus on cancel button for accessibility
        const cancelBtn = this.modal.querySelector('.cancel-delete-btn');
        if (cancelBtn) {
            cancelBtn.focus();
        }
    }

    /**
     * Setup event listeners for the modal
     */
    setupEventListeners(onConfirm, onCancel) {
        if (!this.modal) return;

        // Confirm button
        const confirmBtn = this.modal.querySelector('.confirm-delete-btn');
        if (confirmBtn) {
            confirmBtn.addEventListener('click', async() => {

                 // Disable button to prevent double click
                confirmBtn.disabled = true;
                confirmBtn.classList.add('opacity-70', 'cursor-not-allowed');

                confirmBtn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" 
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10" stroke-dasharray="60" stroke-dashoffset="60">
                            <animate attributeName="stroke-dashoffset" values="60;0" dur="1s" repeatCount="indefinite"/>
                        </circle>
                    </svg>
                    Deleting...
                `;
                await onConfirm();
                this.close();
            });
        }

        // Cancel button
        const cancelBtn = this.modal.querySelector('.cancel-delete-btn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                onCancel();
                this.close();
            });
        }

        // Close on overlay click
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
                onCancel();
            }
        });

        // Close on Escape key
        const handleEscape = (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
                onCancel();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);
    }

    /**
     * Close the modal
     */
    close() {
        if (this.modal && this.isOpen) {
            this.modal.remove();
            this.modal = null;
            this.isOpen = false;
        }
    }

    /**
     * Check if modal is currently open
     */
    isModalOpen() {
        return this.isOpen;
    }
}

// Create global instance
window.DeleteConfirmationModal = new DeleteConfirmationModal();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DeleteConfirmationModal;
}
