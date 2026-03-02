// Contact Requests Page Loader - Marigold School Admin Panel

class ContactRequestsLoader {
    constructor() {
        // Prevent multiple instances
        if (window.contactRequestsLoader) {
            return window.contactRequestsLoader;
        }
        
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.totalPages = 1;
        this.totalItems = 0;
        this.searchQuery = '';
        this.statusFilter = 'all';
        this.sortBy = 'createdAt';
        this.sortOrder = 'desc';
        this.contactRequests = [];
        this.selectedRequest = null;
        this.isLoading = false;
        this.eventsBound = false;
        this.retryCount = 0;
        this.maxRetries = 20;
        this.isInitialized = false;
        
        // Store instance globally
        window.contactRequestsLoader = this;
        
        this.init();
    }

    init() {
        // Prevent multiple initializations
        if (this.isInitialized) {
            return;
        }
        
        // Check if required DOM elements exist
        if (!this.checkDOMElements()) {
            this.retryCount++;
            if (this.retryCount >= this.maxRetries) {
                console.error('❌ Failed to initialize ContactRequestsLoader: DOM elements not found after maximum retries');
                return;
            }
            setTimeout(() => this.init(), 200);
            return;
        }
        
        this.isInitialized = true;
        this.loadContactRequests();
        this.bindEvents();
    }

    checkDOMElements() {
        const tableBody = document.getElementById('contactRequestsTableBody');
        const totalRequests = document.getElementById('totalRequests');
        const pendingRequests = document.getElementById('pendingRequests');
        const respondedRequests = document.getElementById('respondedRequests');
        
        // Check if we're on the contact requests page
        const contactRequestsPage = document.querySelector('#contact-requests-dynamic');
        if (!contactRequestsPage) {
            return false;
        }
        
        return tableBody && totalRequests && pendingRequests && respondedRequests;
    }

    async loadContactRequests() {
        if (this.isLoading) return;
        
        this.isLoading = true;
        this.showLoadingState();

        try {
            const params = new URLSearchParams({
                page: this.currentPage,
                limit: this.itemsPerPage,
                search: this.searchQuery,
                status: this.statusFilter,
                sortBy: this.sortBy,
                sortOrder: this.sortOrder
            });

            const response = await fetch(`/api/admin/contact-requests?${params}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error response:', errorText);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.success) {
                this.contactRequests = data.contactRequests || [];
                this.totalPages = data.totalPages || 1;
                this.totalItems = data.total || 0;
                this.stats = data.stats || { total: 0, pending: 0, responded: 0, archived: 0 };
                
                // console.log('Contact requests loaded:', this.contactRequests.length);
                this.renderContactRequests();
                this.updatePagination();
                this.updateStats();
            } else {
                throw new Error(data.message || 'Failed to load contact requests');
            }
        } catch (error) {
            console.error('Error loading contact requests:', error);
            this.showError('Failed to load contact requests. Please try again.');
        } finally {
            this.isLoading = false;
            this.hideLoadingState();
        }
    }

    showLoadingState() {
        const tableBody = document.querySelector('#contactRequestsTable tbody');
        if (tableBody) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="8" class="text-center py-8">
                        <div class="loading-spinner"></div>
                        <p class="text-gray-500 mt-2">Loading contact requests...</p>
                    </td>
                </tr>
            `;
        }
    }

    hideLoadingState() {
        // Loading state is replaced by actual content
    }

    renderContactRequests() {
        // console.log('📊 Contact requests data:', this.contactRequests.map(r => ({ id: r.id, status: r.status, fullName: r.fullName })));
        const tableBody = document.querySelector('#contactRequestsTable tbody');
        if (!tableBody) {
            console.warn('⚠️ Table body not found! This is normal if not on contact requests page');
            return;
        }

        if (this.contactRequests.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="8" class="text-center py-8">
                        <div class="empty-state">
                            <i data-lucide="mail" class="w-12 h-12 text-gray-400 mx-auto mb-4"></i>
                            <h3 class="text-lg font-medium text-gray-900 mb-2">No contact requests found</h3>
                            <p class="text-gray-500">No contact requests match your current filters.</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        tableBody.innerHTML = this.contactRequests.map((request, index) => `
            <tr class="contact-request-row" data-id="${request.id}">
                <td class="px-6 py-4 whitespace-nowrap text-center">
                    <div class="text-sm font-medium text-gray-900">${(this.currentPage - 1) * this.itemsPerPage + index + 1}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div class="flex items-center">
                        <button class="action-btn view-btn" data-id="${request.id}" title="View Details">
                            <i data-lucide="eye"></i>
                        </button>
                        <button class="action-btn reply-btn" data-id="${request.id}" title="Reply">
                            <i data-lucide="reply"></i>
                        </button>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">${request.fullName}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">${request.email}</div>
                    <div class="text-sm text-gray-500">${request.countryCode} ${request.phone}</div>
                </td>
                <td class="px-6 py-4" style="width: 300px;">
                    <div class="text-sm text-gray-900" title="${request.message}" style="word-wrap: break-word; max-width: 300px;">
                        ${request.message}
                    </div>
                </td>
                <td class="px-6 py-4" style="width: 300px;">
                    <div class="text-sm text-gray-900" title="${request.repliedMessage || 'No reply yet'}" style="word-wrap: break-word; max-width: 300px;">
                        ${request.repliedMessage || 'No reply yet'}
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center" style="width: 100px;">
                    <span class="status-badge status-${this.getStatusClass(request.status)}">
                        ${this.getStatusText(request.status)}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${this.formatDate(request.createdAt)}
                </td>
            </tr>
        `).join('');

        // Re-initialize Lucide icons for the new content
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        // Add direct event listeners to the new buttons as a fallback
        this.addDirectButtonListeners();
    }

    addDirectButtonListeners() {
        // Add direct click listeners to view buttons
        document.querySelectorAll('.view-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const requestId = button.dataset.id;
                if (requestId) {
                    this.viewContactRequest(requestId);
                }
            });
        });

        // Add direct click listeners to reply buttons
        document.querySelectorAll('.reply-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const requestId = button.dataset.id;
                if (requestId) {
                    this.replyToContactRequest(requestId);
                }
            });
        });
    }

    updateStats() {
        // Use stats from API response (total counts, not filtered)
        const total = this.stats?.total || 0;
        const pending = this.stats?.pending || 0;
        const responded = this.stats?.responded || 0;


        // Only update stats if we have valid data and elements exist
        if (typeof total === 'number') {
        this.updateStatCard('totalRequests', total);
        }
        if (typeof pending === 'number') {
        this.updateStatCard('pendingRequests', pending);
        }
        if (typeof responded === 'number') {
        this.updateStatCard('respondedRequests', responded);
        }
    }

    updateStatCard(cardId, value) {
        const card = document.getElementById(cardId);
        if (card) {
            const valueElement = card.querySelector('.stat-value');
            if (valueElement) {
                valueElement.textContent = value;
            } else {
                console.warn(`⚠️ Value element not found for ${cardId}`);
            }
        } else {
            console.warn(`⚠️ Stat card not found: ${cardId} - This is normal if not on contact requests page`);
        }
    }

    updatePagination() {
        const paginationContainer = document.querySelector('.pagination-container');
        if (!paginationContainer) return;

        const startItem = (this.currentPage - 1) * this.itemsPerPage + 1;
        const endItem = Math.min(this.currentPage * this.itemsPerPage, this.totalItems);

        paginationContainer.innerHTML = `
            <div class="pagination-info">
                <span class="text-sm text-gray-700">
                    Showing ${startItem} to ${endItem} of ${this.totalItems} results
                </span>
            </div>
            <div class="pagination-controls">
                <button class="pagination-btn" ${this.currentPage === 1 ? 'disabled' : ''} data-page="${this.currentPage - 1}">
                    Previous
                </button>
                ${this.generatePaginationButtons()}
                <button class="pagination-btn" ${this.currentPage === this.totalPages ? 'disabled' : ''} data-page="${this.currentPage + 1}">
                    Next
                </button>
            </div>
        `;
    }

    generatePaginationButtons() {
        const buttons = [];
        const maxVisiblePages = 5;
        let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            buttons.push(`
                <button class="pagination-btn ${i === this.currentPage ? 'active' : ''}" data-page="${i}">
                    ${i}
                </button>
            `);
        }

        return buttons.join('');
    }

    bindEvents() {
        // Only bind events once
        if (this.eventsBound) return;
        this.eventsBound = true;

        // Add drag scrolling functionality
        this.addDragScrolling();

        // Search functionality
        const searchInput = document.querySelector('#contactSearchInput');
        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.searchQuery = e.target.value;
                    this.currentPage = 1;
                    this.loadContactRequests();
                }, 500);
            });
        }

        // Filter functionality
        const filterBtn = document.querySelector('#contactFilterBtn');
        if (filterBtn) {
            filterBtn.addEventListener('click', () => {
                this.showFilterModal();
            });
        }

        // Sort functionality
        const sortBtn = document.querySelector('#contactSortBtn');
        if (sortBtn) {
            sortBtn.addEventListener('click', () => {
                this.showSortModal();
            });
        }

        // Pagination
        document.addEventListener('click', (e) => {
            if (e.target.matches('.pagination-btn')) {
                const page = parseInt(e.target.dataset.page);
                if (page && page !== this.currentPage && page >= 1 && page <= this.totalPages) {
                    this.currentPage = page;
                    this.loadContactRequests();
                }
            }
        });

        // Table actions - using event delegation for dynamically created content
        document.addEventListener('click', (e) => {
            // Only handle clicks on action buttons or their children
            if (e.target.closest('.action-btn')) {
                
                // Check if the clicked element is a view button or inside a view button
                if (e.target.closest('.view-btn')) {
                    e.preventDefault();
                    e.stopPropagation();
                    const button = e.target.closest('.view-btn');
                    const requestId = button.dataset.id;
                    if (requestId) {
                        this.viewContactRequest(requestId);
                    } else {
                        console.error('No request ID found on view button');
                    }
                } 
                // Check if the clicked element is a reply button or inside a reply button
                else if (e.target.closest('.reply-btn')) {
                    e.preventDefault();
                    e.stopPropagation();
                    const button = e.target.closest('.reply-btn');
                    const requestId = button.dataset.id;
                    if (requestId) {
                        this.replyToContactRequest(requestId);
                    } else {
                        console.error('No request ID found on reply button');
                    }
                }
            }
        });
    }

    addDragScrolling() {
        const tableContainer = document.querySelector('.contact-requests-table-container');
        if (!tableContainer) return;

        let isDown = false;
        let startX;
        let scrollLeft;

        tableContainer.addEventListener('mousedown', (e) => {
            // Don't activate drag scrolling if clicking on buttons or interactive elements
            if (e.target.closest('.action-btn') || e.target.closest('button') || e.target.closest('input') || e.target.closest('select')) {
                return;
            }
            
            isDown = true;
            tableContainer.classList.add('active');
            startX = e.pageX - tableContainer.offsetLeft;
            scrollLeft = tableContainer.scrollLeft;
        });

        tableContainer.addEventListener('mouseleave', () => {
            isDown = false;
            tableContainer.classList.remove('active');
        });

        tableContainer.addEventListener('mouseup', () => {
            isDown = false;
            tableContainer.classList.remove('active');
        });

        tableContainer.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - tableContainer.offsetLeft;
            const walk = (x - startX) * 2; // Scroll speed multiplier
            tableContainer.scrollLeft = scrollLeft - walk;
        });

        // Touch events for mobile devices
        tableContainer.addEventListener('touchstart', (e) => {
            // Don't activate drag scrolling if touching buttons or interactive elements
            if (e.target.closest('.action-btn') || e.target.closest('button') || e.target.closest('input') || e.target.closest('select')) {
                return;
            }
            
            isDown = true;
            startX = e.touches[0].pageX - tableContainer.offsetLeft;
            scrollLeft = tableContainer.scrollLeft;
        });

        tableContainer.addEventListener('touchend', () => {
            isDown = false;
        });

        tableContainer.addEventListener('touchmove', (e) => {
            if (!isDown) return;
            const x = e.touches[0].pageX - tableContainer.offsetLeft;
            const walk = (x - startX) * 2;
            tableContainer.scrollLeft = scrollLeft - walk;
        });
    }

    async viewContactRequest(requestId) {
        try {
            const response = await fetch(`/api/admin/contact-requests/${requestId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.success) {
                this.selectedRequest = data.contactRequest;
                this.showContactRequestModal();
            } else {
                throw new Error(data.message || 'Failed to load contact request');
            }
        } catch (error) {
            console.error('Error loading contact request:', error);
            this.showError('Failed to load contact request details.');
        }
    }

    showContactRequestModal() {
        if (!this.selectedRequest) return;

        // Remove any existing modals first
        const existingModals = document.querySelectorAll('.modal-overlay');
        existingModals.forEach(modal => modal.remove());

        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content contact-request-modal">
                <div class="modal-header">
                    <h2 class="modal-title">Contact Request Details</h2>
                    <button class="modal-close" data-action="close">
                        <i data-lucide="x"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="contact-details">
                        <div class="detail-row">
                            <span class="detail-label">Full Name</span>
                            <span class="detail-value">${this.selectedRequest.fullName}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Email</span>
                            <span class="detail-value">${this.selectedRequest.email}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Phone</span>
                            <span class="detail-value">${this.selectedRequest.countryCode} ${this.selectedRequest.phone}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Country Code</span>
                            <span class="detail-value">${this.selectedRequest.countryCode}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Message</span>
                            <span class="detail-value message-content">${this.selectedRequest.message}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Submitted At</span>
                            <span class="detail-value">${this.formatDate(this.selectedRequest.createdAt)}</span>
                        </div>
                        ${this.selectedRequest.repliedMessage ? `
                        <div class="admin-reply-card">
                            <div class="admin-reply-header">
                                <h4>Admin Reply</h4>
                                <div class="admin-reply-divider"></div>
                            </div>
                            <div class="admin-reply-content">
                                <div class="reply-message-section">
                                    <div class="reply-content-label">Reply Content</div>
                                    <div class="reply-message">${this.selectedRequest.repliedMessage}</div>
                                </div>
                                <div class="reply-timestamp">
                                    <span class="replied-at-label">Replied At</span>
                                    <span class="replied-at-time">${this.formatDate(this.selectedRequest.repliedAt || this.selectedRequest.updatedAt)}</span>
                                </div>
                            </div>
                        </div>
                        ` : ''}
                    </div>
                </div>
                <div class="modal-footer">
                    <div class="modal-actions">
                        <div class="modal-buttons">
                            <button class="btn btn-primary" data-action="reply">
                                <i data-lucide="reply"></i>
                                Reply
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        
        // Make modal visible
        modal.style.display = 'flex';
        modal.style.opacity = '1';
        modal.style.visibility = 'visible';
        
        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        // Bind modal events
        this.bindModalEvents(modal);
    }

    bindModalEvents(modal) {
        modal.addEventListener('click', (e) => {
            
            // Check for close button click
            if (e.target.matches('[data-action="close"]') || e.target.closest('[data-action="close"]')) {
                modal.remove();
                return;
            }
            
            
            // Check for reply button click
            if (e.target.matches('[data-action="reply"]') || e.target.closest('[data-action="reply"]')) {
                modal.remove();
                this.showReplyModal();
                return;
            }
            
            // Close modal when clicking on overlay (outside modal content)
            if (e.target === modal) {
                modal.remove();
            }
        });

    }

    async replyToContactRequest(requestId) {
        try {
            const response = await fetch(`/api/admin/contact-requests/${requestId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.success) {
                this.selectedRequest = data.contactRequest;
                this.showReplyModal();
            } else {
                throw new Error(data.message || 'Failed to load contact request');
            }
        } catch (error) {
            console.error('Error loading contact request for reply:', error);
            this.showError('Failed to load contact request details.');
        }
    }

    showReplyModal() {
        if (!this.selectedRequest) {
            console.error('No selected request for reply');
            return;
        }

        // Remove any existing modals first
        const existingModals = document.querySelectorAll('.modal-overlay');
        existingModals.forEach(modal => modal.remove());

        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content reply-modal">
                <div class="modal-header">
                    <h2 class="modal-title">Reply to Contact Request</h2>
                    <button class="modal-close" data-action="close">
                        <i data-lucide="x"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <form id="replyForm" class="reply-form">
                        <div class="form-group">
                            <label for="replyTo" class="form-label">To</label>
                            <div class="input-group">
                                <input type="email" id="replyTo" class="form-input" value="${this.selectedRequest.email}" readonly>
                                <i data-lucide="lock" class="input-icon"></i>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="replyMessage" class="form-label">Message</label>
                            <textarea id="replyMessage" class="form-textarea" placeholder="Type your message here..." rows="6"></textarea>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" id="sendReplyBtn">
                        <i data-lucide="send"></i>
                        Send Reply
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        
        // Make modal visible
        modal.style.display = 'flex';
        modal.style.opacity = '1';
        modal.style.visibility = 'visible';
        
        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        // Bind reply form events
        this.bindReplyFormEvents(modal);
    }

    bindReplyFormEvents(modal) {
        modal.addEventListener('click', (e) => {
            
            // Check for close button click
            if (e.target.matches('[data-action="close"]') || e.target.closest('[data-action="close"]')) {
                modal.remove();
                return;
            }
            
            // Close modal when clicking on overlay (outside modal content)
            if (e.target === modal) {
                modal.remove();
            }
        });

        const sendBtn = modal.querySelector('#sendReplyBtn');
        if (sendBtn) {
            sendBtn.addEventListener('click', async () => {
                await this.sendReply(modal);
            });
        }
    }

    async sendReply(modal) {
        const message = modal.querySelector('#replyMessage').value.trim();
        
        if (!message) {
            this.showError('Please enter a message.');
            return;
        }

        // Get the send button and store original content
        const sendBtn = modal.querySelector('#sendReplyBtn');
        const originalContent = sendBtn.innerHTML;

        // Show confirmation dialog
        const confirmed = await this.showConfirmationDialog(
            'Send Reply',
            'Are you sure you want to send this reply?',
            'This action will mark the contact request as responded and send the reply to the user.'
        );

        if (!confirmed) {
            // Restore button state if user cancels
            sendBtn.disabled = false;
            sendBtn.innerHTML = originalContent;
            return;
        }

        // Set loading state
        sendBtn.disabled = true;
        sendBtn.innerHTML = `
            <svg class="animate-spin" style="width: 1.25rem; height: 1.25rem; margin-right: 0.5rem; display: inline-block; vertical-align: middle;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle style="opacity: 0.25;" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path style="opacity: 0.75;" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Sending...
        `;

        try {
            const response = await fetch(`/api/admin/contact-requests/${this.selectedRequest.id}/reply`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: message
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.success) {
                this.showSuccess('Reply sent successfully!');
                modal.remove();
                // Small delay to ensure the database update is complete
                setTimeout(() => {
                    this.showLoadingState(); // Show loading state
                this.loadContactRequests(); // Refresh the list
                    // Update sidebar badges
                    if (window.updateRequestBadges) {
                        window.updateRequestBadges();
                    }
                }, 500);
            } else {
                throw new Error(data.message || 'Failed to send reply');
            }
        } catch (error) {
            console.error('Error sending reply:', error);
            this.showError('Failed to send reply. Please try again.');
        } finally {
            // Restore button state
            sendBtn.disabled = false;
            sendBtn.innerHTML = originalContent;
        }
    }

    async updateContactRequestStatus(requestId, status) {
        try {
            const response = await fetch(`/api/admin/contact-requests/${requestId}/status`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.success) {
                this.loadContactRequests(); // Refresh the list
                // Update sidebar badges
                if (window.updateRequestBadges) {
                    window.updateRequestBadges();
                }
            } else {
                throw new Error(data.message || 'Failed to update status');
            }
        } catch (error) {
            console.error('Error updating status:', error);
            this.showError('Failed to update status.');
        }
    }

    async deleteContactRequest(requestId) {
        if (!confirm('Are you sure you want to delete this contact request? This action cannot be undone.')) {
            return;
        }

        try {
            const response = await fetch(`/api/admin/contact-requests/${requestId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.success) {
                this.showSuccess('Contact request deleted successfully!');
                this.loadContactRequests(); // Refresh the list
            } else {
                throw new Error(data.message || 'Failed to delete contact request');
            }
        } catch (error) {
            console.error('Error deleting contact request:', error);
            this.showError('Failed to delete contact request.');
        }
    }

    showFilterModal() {
        // Create filter dropdown
        const filterBtn = document.querySelector('#contactFilterBtn');
        if (!filterBtn) return;

        // Remove existing dropdown if any
        const existingDropdown = document.querySelector('.filter-dropdown');
        if (existingDropdown) {
            existingDropdown.remove();
        }

        const dropdown = document.createElement('div');
        dropdown.className = 'filter-dropdown';

        dropdown.innerHTML = `
            <div style="padding: 12px;">
                <div style="margin-bottom: 8px; font-weight: 500; color: #374151; font-size: 0.875rem;">Filter by Status</div>
                <select id="statusFilterSelect">
                    <option value="all" ${this.statusFilter === 'all' ? 'selected' : ''}>All Requests</option>
                    <option value="pending" ${this.statusFilter === 'pending' ? 'selected' : ''}>Pending</option>
                    <option value="responded" ${this.statusFilter === 'responded' ? 'selected' : ''}>Responded</option>
                    <option value="archived" ${this.statusFilter === 'archived' ? 'selected' : ''}>Archived</option>
                </select>
                <div style="margin-top: 12px; display: flex; gap: 8px; justify-content: flex-end;">
                    <button id="clearFilterBtn">Clear</button>
                    <button id="applyFilterBtn">Apply</button>
                </div>
            </div>
        `;

        // Position dropdown relative to button
        const rect = filterBtn.getBoundingClientRect();
        filterBtn.style.position = 'relative';
        filterBtn.appendChild(dropdown);

        // Prevent dropdown from closing when clicking on select elements
        const selectElement = dropdown.querySelector('#statusFilterSelect');
        selectElement.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        selectElement.addEventListener('change', (e) => {
            e.stopPropagation();
        });

        // Event listeners
        dropdown.querySelector('#applyFilterBtn').addEventListener('click', () => {
            const selectedStatus = dropdown.querySelector('#statusFilterSelect').value;
            this.statusFilter = selectedStatus;
            this.currentPage = 1;
            this.updateFilterButtonText();
            this.loadContactRequests();
            dropdown.remove();
        });

        dropdown.querySelector('#clearFilterBtn').addEventListener('click', () => {
            this.statusFilter = 'all';
            this.currentPage = 1;
            this.updateFilterButtonText();
            this.loadContactRequests();
            dropdown.remove();
        });

        // Close dropdown when clicking outside (but not on select elements)
        const closeDropdown = (e) => {
            if (!filterBtn.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.remove();
                document.removeEventListener('click', closeDropdown);
            }
        };
        setTimeout(() => document.addEventListener('click', closeDropdown), 100);
    }

    showSortModal() {
        // Create sort dropdown
        const sortBtn = document.querySelector('#contactSortBtn');
        if (!sortBtn) return;

        // Remove existing dropdown if any
        const existingDropdown = document.querySelector('.sort-dropdown');
        if (existingDropdown) {
            existingDropdown.remove();
        }

        const dropdown = document.createElement('div');
        dropdown.className = 'sort-dropdown';

        dropdown.innerHTML = `
            <div style="padding: 12px;">
                <div style="margin-bottom: 8px; font-weight: 500; color: #374151; font-size: 0.875rem;">Sort by</div>
                <select id="sortBySelect">
                    <option value="createdAt" ${this.sortBy === 'createdAt' ? 'selected' : ''}>Date Created</option>
                    <option value="name" ${this.sortBy === 'name' ? 'selected' : ''}>Name</option>
                    <option value="email" ${this.sortBy === 'email' ? 'selected' : ''}>Email</option>
                    <option value="status" ${this.sortBy === 'status' ? 'selected' : ''}>Status</option>
                </select>
                <div style="margin-bottom: 8px; font-weight: 500; color: #374151; font-size: 0.875rem;">Sort Order</div>
                <select id="sortOrderSelect">
                    <option value="desc" ${this.sortOrder === 'desc' ? 'selected' : ''}>Newest First</option>
                    <option value="asc" ${this.sortOrder === 'asc' ? 'selected' : ''}>Oldest First</option>
                </select>
                <div style="display: flex; gap: 8px; justify-content: flex-end;">
                    <button id="clearSortBtn">Reset</button>
                    <button id="applySortBtn">Apply</button>
                </div>
            </div>
        `;

        // Position dropdown relative to button
        const rect = sortBtn.getBoundingClientRect();
        sortBtn.style.position = 'relative';
        sortBtn.appendChild(dropdown);

        // Prevent dropdown from closing when clicking on select elements
        const sortBySelect = dropdown.querySelector('#sortBySelect');
        const sortOrderSelect = dropdown.querySelector('#sortOrderSelect');
        
        [sortBySelect, sortOrderSelect].forEach(select => {
            select.addEventListener('click', (e) => {
                e.stopPropagation();
            });

            select.addEventListener('change', (e) => {
                e.stopPropagation();
            });
        });

        // Event listeners
        dropdown.querySelector('#applySortBtn').addEventListener('click', () => {
            const sortBy = dropdown.querySelector('#sortBySelect').value;
            const sortOrder = dropdown.querySelector('#sortOrderSelect').value;
            this.sortBy = sortBy;
            this.sortOrder = sortOrder;
            this.currentPage = 1;
            this.updateSortButtonText();
            this.loadContactRequests();
            dropdown.remove();
        });

        dropdown.querySelector('#clearSortBtn').addEventListener('click', () => {
            this.sortBy = 'createdAt';
            this.sortOrder = 'desc';
            this.currentPage = 1;
            this.updateSortButtonText();
            this.loadContactRequests();
            dropdown.remove();
        });

        // Close dropdown when clicking outside (but not on select elements)
        const closeDropdown = (e) => {
            if (!sortBtn.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.remove();
                document.removeEventListener('click', closeDropdown);
            }
        };
        setTimeout(() => document.addEventListener('click', closeDropdown), 100);
    }

    updateFilterButtonText() {
        const filterBtn = document.querySelector('#contactFilterBtn');
        if (filterBtn) {
            const statusText = this.statusFilter === 'all' ? 'All' : 
                              this.statusFilter === 'pending' ? 'Pending' :
                              this.statusFilter === 'responded' ? 'Responded' : 'Archived';
            filterBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="filter" class="lucide lucide-filter"><path d="M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z"></path></svg>
                Filter: ${statusText}
            `;
        }
    }

    updateSortButtonText() {
        const sortBtn = document.querySelector('#contactSortBtn');
        if (sortBtn) {
            const sortText = this.sortBy === 'createdAt' ? 'Date' :
                           this.sortBy === 'name' ? 'Name' :
                           this.sortBy === 'email' ? 'Email' : 'Status';
            const orderText = this.sortOrder === 'desc' ? '↓' : '↑';
            sortBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="menu" class="lucide lucide-menu"><path d="M4 5h16"></path><path d="M4 12h16"></path><path d="M4 19h16"></path></svg>
                Sort: ${sortText} ${orderText}
            `;
        }
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    getStatusText(status) {
        const statusMap = {
            'pending': 'Pending',
            'responded': 'Responded',
            'archived': 'Archived'
        };
        const result = statusMap[status] || 'Pending';
        // console.log(`🏷️ getStatusText: ${status} -> ${result}`);
        return result;
    }

    getStatusClass(status) {
        const classMap = {
            'pending': 'pending',
            'responded': 'responded',
            'archived': 'pending'
        };
        const result = classMap[status] || 'pending';
        // console.log(`🎨 getStatusClass: ${status} -> ${result}`);
        return result;
    }

    showError(message) {
        // Use NotificationManager for consistent styling
        if (window.NotificationManager) {
            window.NotificationManager.show('error', 'Error', message);
        } else if (window.showNotification) {
            window.showNotification('Error', message, 'error');
        } else {
            alert(message);
        }
    }

    showSuccess(message) {
        // Use NotificationManager for consistent styling
        if (window.NotificationManager) {
            window.NotificationManager.show('success', 'Success', message);
        } else if (window.showNotification) {
            window.showNotification('Success', message, 'success');
        } else {
            alert(message);
        }
    }

    showConfirmationDialog(title, message, details = '') {
        return new Promise((resolve) => {
            // Create modal overlay
            const overlay = document.createElement('div');
            overlay.className = 'confirmation-overlay';
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
            `;

            // Create dialog
            const dialog = document.createElement('div');
            dialog.className = 'confirmation-dialog';
            dialog.style.cssText = `
                background: white;
                border-radius: 12px;
                padding: 2rem;
                max-width: 500px;
                width: 90%;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
                transform: scale(0.9);
                transition: transform 0.2s ease;
            `;

            dialog.innerHTML = `
                <div class="confirmation-header" style="margin-bottom: 1rem;">
                    <h3 style="margin: 0; color: #1f2937; font-size: 1.25rem; font-weight: 600;">${title}</h3>
                </div>
                <div class="confirmation-body" style="margin-bottom: 2rem;">
                    <p style="margin: 0 0 0.5rem 0; color: #374151; line-height: 1.5;">${message}</p>
                    ${details ? `<p style="margin: 0; color: #6b7280; font-size: 0.875rem; line-height: 1.4;">${details}</p>` : ''}
                </div>
                <div class="confirmation-actions" style="display: flex; gap: 0.75rem; justify-content: flex-end;">
                    <button class="btn btn-secondary" id="cancelBtn" style="
                        padding: 0.75rem 1.5rem;
                        border: 1px solid #d1d5db;
                        background: white;
                        color: #374151;
                        border-radius: 8px;
                        cursor: pointer;
                        font-weight: 500;
                        transition: all 0.2s ease;
                    ">Cancel</button>
                    <button class="btn btn-primary" id="confirmBtn" style="
                        padding: 0.75rem 1.5rem;
                        border: none;
                        background: #3b82f6;
                        color: white;
                        border-radius: 8px;
                        cursor: pointer;
                        font-weight: 500;
                        transition: all 0.2s ease;
                    ">Confirm</button>
                </div>
            `;

            overlay.appendChild(dialog);
            document.body.appendChild(overlay);

            // Animate in
            setTimeout(() => {
                dialog.style.transform = 'scale(1)';
            }, 10);

            // Button handlers
            const cancelBtn = dialog.querySelector('#cancelBtn');
            const confirmBtn = dialog.querySelector('#confirmBtn');

            cancelBtn.addEventListener('click', () => {
                overlay.remove();
                resolve(false);
            });

            confirmBtn.addEventListener('click', () => {
                overlay.remove();
                resolve(true);
            });

            // Close on overlay click
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    overlay.remove();
                    resolve(false);
                }
            });

            // Close on escape key
            const handleEscape = (e) => {
                if (e.key === 'Escape') {
                    overlay.remove();
                    document.removeEventListener('keydown', handleEscape);
                    resolve(false);
                }
            };
            document.addEventListener('keydown', handleEscape);
        });
    }
}

// Make ContactRequestsLoader globally available
window.ContactRequestsLoader = ContactRequestsLoader;

// Note: Initialization is now handled in admin.js to prevent multiple instances

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ContactRequestsLoader;
}
