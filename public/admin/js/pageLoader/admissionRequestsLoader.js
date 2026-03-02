/**
 * Admission Requests Manager
 * Handles dynamic loading and management of the admission requests section
 */
class AdmissionRequestsManager {
    constructor() {
        this.currentSection = 'admission-requests';
        this.notificationManager = window.NotificationManager;
        this.saveButton = null;
        this.currentPage = 1;
        this.totalPages = 1;    
        this.itemsPerPage = 10;
        this.currentFilters = {};
        this.init();
    }

    init() {
        this.bindEvents();
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Admission requests section click
        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-section="admission-requests"]')) {
                e.preventDefault();
                this.loadAdmissionRequests();
            }
        });
    }

    /**
     * Load admission requests section dynamically
     */
    async loadAdmissionRequests() {
        try {
            // Get admission requests content
            const content = this.getAdmissionRequestsContent();
            
            // Inject content into page-content
            this.injectContent(content);
            
            // Initialize admission requests functionality
            this.initializeAdmissionRequests();
            
            // Update navigation
            this.updateNavigation();
            
        } catch (error) {
            console.error('Error loading admission requests section:', error);
            this.showError('Failed to load admission requests section');
        }
    }

    /**
     * Get admission requests content HTML
     */
    getAdmissionRequestsContent() {
        return `
            <section id="admission-requests-section" class="content-section active">
                <div class="page-header">
                    <div class="page-title">
                        <h1>Admission Applications</h1>
                        <p>Manage all student admission submissions.</p>
                    </div>
                </div>

                <div class="content-card">
                    <!-- Filter and Action Bar -->
                    <div class="filter-action-bar">
                        <div class="filters">
                            <button class="filter-btn" id="gradeFilterBtn">
                                Filter by Grade
                                <i data-lucide="chevron-down"></i>
                            </button>
                            <button class="filter-btn" id="statusFilterBtn">
                                Filter by Status
                                <i data-lucide="chevron-down"></i>
                            </button>
                        </div>
                        <button class="btn btn-primary bulk-action-btn" id="bulkActionBtn" disabled  >
                            <i data-lucide="check-square"></i>
                            Bulk Action
                        </button>
                    </div>

                    <!-- Applications Table -->
                    <div class="applications-table-container">
                        <table class="applications-table">
                            <thead>
                                <tr>
                                    <th class="checkbox-col">
                                        <input type="checkbox" id="selectAll" class="table-checkbox">
                                    </th>
                                    <th>STUDENT NAME</th>
                                    <th>APPLICATION ID</th>
                                    <th>GRADE</th>
                                    <th>STATUS</th>
                                    <th>CONTACT</th>
                                    <th>ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody id="applicationsTableBody">
                                <tr class="loading-row">
                                    <td colspan="7" class="loading-cell">
                                        <div class="loading-spinner"></div>
                                        <span>Loading applications...</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- Pagination -->
                    <div class="pagination-container">
                        <div class="pagination-info">
                            <span id="paginationInfo">No applications found</span>
                        </div>
                        <div class="pagination-controls">
                            <button class="pagination-btn" id="prevBtn" disabled>
                                <i data-lucide="chevron-left"></i>
                                Previous
                            </button>
                            <div class="page-numbers">
                                <!-- Page numbers will be populated dynamically -->
                            </div>
                            <button class="pagination-btn" id="nextBtn" disabled>
                                Next
                                <i data-lucide="chevron-right"></i>
                            </button>
                        </div>
                     </div>
                 </div>
                 
                 <style>
                 .applications-table-container {
                     overflow-x: auto;
                     -webkit-overflow-scrolling: touch;
                     border-radius: 0.75rem;
                     border: 1px solid #e5e7eb;
                     background: #ffffff;
                     margin-top: 1rem;
                 }
                 
                 .applications-table-container::-webkit-scrollbar {
                     height: 8px;
                 }
                 
                 .applications-table-container::-webkit-scrollbar-track {
                     background: #f1f5f9;
                     border-radius: 4px;
                 }
                 
                 .applications-table-container::-webkit-scrollbar-thumb {
                     background: #cbd5e1;
                     border-radius: 4px;
                 }
                 
                 .applications-table-container::-webkit-scrollbar-thumb:hover {
                     background: #94a3b8;
                 }
                 
                 .applications-table {
                     min-width: 800px; /* Minimum width to prevent cramping */
                     width: 100%;
                     border-collapse: collapse;
                 }
                 
                 .applications-table th,
                 .applications-table td {
                     padding: 1rem;
                     text-align: left;
                     border-bottom: 1px solid #e5e7eb;
                     white-space: nowrap;
                 }
                 
                 /* Column width constraints */
                 .checkbox-col {
                     width: 60px;
                     min-width: 60px;
                 }
                 
                 .student-name {
                     min-width: 200px;
                 }
                 
                 .application-id {
                     min-width: 120px;
                 }
                 
                 .grade {
                     min-width: 80px;
                 }
                 
                 .status {
                     min-width: 100px;
                 }
                 
                 .contact {
                     min-width: 150px;
                 }
                 
                 .actions {
                     min-width: 100px;
                 }
                 
                 .applications-table th {
                     background-color: #f9fafb;
                     font-weight: 600;
                     color: #374151;
                     text-transform: uppercase;
                     font-size: 0.75rem;
                     letter-spacing: 0.05em;
                 }
                 
                 .applications-table tr:hover {
                     background-color: #f9fafb;
                 }
                 
                 .status-badge {
                     display: inline-flex;
                     align-items: center;
                     padding: 0.25rem 0.75rem;
                     border-radius: 9999px;
                     font-size: 0.75rem;
                     font-weight: 500;
                     text-transform: uppercase;
                     letter-spacing: 0.05em;
                 }
                 
                 .status-pending {
                     background-color: #fef3c7;
                     color: #92400e;
                 }
                 
                 .status-reviewed {
                     background-color: #dbeafe;
                     color: #1e40af;
                 }
                 
                 .status-accepted {
                     background-color: #d1fae5;
                     color: #065f46;
                 }
                 
                 .status-rejected {
                     background-color: #fee2e2;
                     color: #991b1b;
                 }
                 
                 .table-container {
                     overflow-x: auto;
                     border-radius: 0.5rem;
                     border: 1px solid #e5e7eb;
                 }
                 
                 .application-row {
                     cursor: pointer;
                 }
                 
                 .student-info {
                     display: flex;
                     align-items: center;
                     gap: 0.75rem;
                 }
                 
                 .student-avatar {
                     width: 40px;
                     height: 40px;
                     border-radius: 50%;
                     overflow: hidden;
                     flex-shrink: 0;
                 }
                 
                 .student-avatar img {
                     width: 100%;
                     height: 100%;
                     object-fit: cover;
                 }
                 
                 .student-details .name {
                     font-weight: 500;
                     color: #111827;
                 }
                 
                 .student-details .parent {
                     font-size: 0.875rem;
                     color: #6b7280;
                 }
                 
                 .contact-info .email,
                 .contact-info .phone {
                     font-size: 0.875rem;
                     color: #374151;
                 }
                 
                 .action-buttons {
                     display: flex;
                     gap: 0.5rem;
                 }
                 
                 .action-link {
                     background: none;
                     border: none;
                     color: #3b82f6;
                     cursor: pointer;
                     font-size: 0.875rem;
                     font-weight: 500;
                     text-decoration: underline;
                     padding: 0;
                 }
                 
                 .action-link:hover {
                     color: #1d4ed8;
                 }
                 
                 .filter-action-bar {
                     display: flex;
                     justify-content: space-between;
                     align-items: center;
                     padding: 1rem 0;
                     border-bottom: 1px solid #e5e7eb;
                     margin-bottom: 1rem;
                 }
                 
                 .filters {
                     display: flex;
                     gap: 0.5rem;
                 }
                 
                 .filter-btn {
                     position: relative;
                     display: flex;
                     align-items: center;
                     gap: 0.5rem;
                     padding: 0.5rem 1rem;
                     background: white;
                     border: 1px solid #d1d5db;
                     border-radius: 0.375rem;
                     font-size: 0.875rem;
                     color: #374151;
                     cursor: pointer;
                     transition: all 0.2s;
                 }
                 
                 .filter-btn:hover {
                     border-color: #9ca3af;
                     background: #f9fafb;
                 }
                 
                 .filter-menu {
                     position: absolute;
                     top: 100%;
                     left: 0;
                     background: white;
                     border: 1px solid #d1d5db;
                     border-radius: 0.5rem;
                     box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                     z-index: 50;
                     min-width: 150px;
                 }
                 
                 .filter-menu-header {
                     display: flex;
                     justify-content: space-between;
                     align-items: center;
                     padding: 0.75rem 1rem;
                     border-bottom: 1px solid #e5e7eb;
                     background: #f9fafb;
                     border-radius: 0.5rem 0.5rem 0 0;
                 }
                 
                 .filter-menu-header span {
                     font-size: 0.875rem;
                     font-weight: 600;
                     color: #374151;
                 }
                 
                 .close-filter {
                     background: none;
                     border: none;
                     color: #6b7280;
                     cursor: pointer;
                     font-size: 1.25rem;
                     line-height: 1;
                     padding: 0;
                     width: 1.5rem;
                     height: 1.5rem;
                     display: flex;
                     align-items: center;
                     justify-content: center;
                     border-radius: 0.25rem;
                     transition: all 0.2s;
                 }
                 
                 .close-filter:hover {
                     background: #e5e7eb;
                     color: #374151;
                 }
                 
                 .filter-options {
                     padding: 0.5rem 0;
                 }
                 
                 .filter-option {
                     padding: 0.5rem 1rem;
                     cursor: pointer;
                     font-size: 0.875rem;
                     color: #374151;
                     transition: all 0.2s;
                     border-left: 3px solid transparent;
                 }
                 
                 .filter-option:hover {
                     background: #f3f4f6;
                     border-left-color: #3b82f6;
                 }
                 
                 .filter-option.show-all {
                     font-weight: 600;
                     color: #3b82f6;
                     border-bottom: 1px solid #e5e7eb;
                     margin-bottom: 0.25rem;
                 }
                 
                 .filter-option.show-all:hover {
                     background: #eff6ff;
                     border-left-color: #3b82f6;
                 }
                 
                 .bulk-action-btn {
                     display: flex;
                     align-items: center;
                     gap: 0.5rem;
                     padding: 0.5rem 1rem;
                     background: #3b82f6;
                     color: white;
                     border: none;
                     border-radius: 0.375rem;
                     font-size: 0.875rem;
                     font-weight: 500;
                     cursor: pointer;
                     transition: all 0.2s;
                 }
                 
                 .bulk-action-btn:hover:not(:disabled) {
                     background: #2563eb;
                 }
                 
                 .bulk-action-btn:disabled {
                     background: #9ca3af;
                     cursor: not-allowed;
                 }
                 
                 .pagination-container {
                     display: flex;
                     justify-content: space-between;
                     align-items: center;
                     padding: 1rem 0;
                     border-top: 1px solid #e5e7eb;
                     margin-top: 1rem;
                 }
                 
                 .pagination-controls {
                     display: flex;
                     align-items: center;
                     gap: 0.5rem;
                 }
                 
                 .pagination-btn {
                     display: flex;
                     align-items: center;
                     gap: 0.5rem;
                     padding: 0.5rem 1rem;
                     background: white;
                     border: 1px solid #d1d5db;
                     border-radius: 0.375rem;
                     font-size: 0.875rem;
                     color: #374151;
                     cursor: pointer;
                     transition: all 0.2s;
                 }
                 
                 .pagination-btn:hover:not(:disabled) {
                     border-color: #9ca3af;
                     background: #f9fafb;
                 }
                 
                 .pagination-btn:disabled {
                     background: #f3f4f6;
                     color: #9ca3af;
                     cursor: not-allowed;
                 }
                 
                 .page-numbers {
                     display: flex;
                     gap: 0.25rem;
                 }
                 
                 .page-number {
                     width: 2rem;
                     height: 2rem;
                     background: white;
                     border: 1px solid #d1d5db;
                     border-radius: 0.375rem;
                     font-size: 0.875rem;
                     color: #374151;
                     cursor: pointer;
                     transition: all 0.2s;
                 }
                 
                 .page-number:hover {
                     border-color: #9ca3af;
                     background: #f9fafb;
                 }
                 
                 .page-number.active {
                     background: #3b82f6;
                     color: white;
                     border-color: #3b82f6;
                 }
                 
                 .empty-state {
                     text-align: center;
                     padding: 3rem 1rem;
                     color: #6b7280;
                 }
                 
                 .empty-icon {
                     margin-bottom: 1rem;
                     color: #9ca3af;
                 }
                 
                 .empty-state h3 {
                     margin: 0 0 0.5rem 0;
                     font-size: 1.125rem;
                     font-weight: 600;
                     color: #374151;
                 }
                 
                 .empty-state p {
                     margin: 0;
                     font-size: 0.875rem;
                 }
                 
                 .loading-cell {
                     text-align: center;
                     padding: 3rem 1rem;
                     color: #6b7280;
                 }
                 
                 .loading-spinner {
                     width: 2rem;
                     height: 2rem;
                     border: 2px solid #e5e7eb;
                     border-top: 2px solid #3b82f6;
                     border-radius: 50%;
                     animation: spin 1s linear infinite;
                     margin: 0 auto 1rem auto;
                 }
                 
                 .error-cell {
                     text-align: center;
                     padding: 3rem 1rem;
                     color: #dc2626;
                 }
                 
                 .error-state {
                     display: flex;
                     flex-direction: column;
                     align-items: center;
                     gap: 1rem;
                 }
                 
                 .error-icon {
                     color: #dc2626;
                     font-size: 3rem;
                 }
                 
                 .error-state h3 {
                     margin: 0;
                     font-size: 1.125rem;
                     font-weight: 600;
                     color: #dc2626;
                 }
                 
                 .error-state p {
                     margin: 0;
                     font-size: 0.875rem;
                     color: #6b7280;
                     max-width: 400px;
                 }
                 
                 .retry-btn {
                     margin-top: 1rem;
                 }
                 
                 @keyframes spin {
                     0% { transform: rotate(0deg); }
                     100% { transform: rotate(360deg); }
                 }
                 </style>
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
     * Initialize admission requests functionality
     */
    initializeAdmissionRequests() {
        // Initialize event listeners
        this.initializeEventListeners();
        
        // Load admission requests data
        this.loadAdmissionRequestsData();
    }

    /**
     * Initialize event listeners
     */
    initializeEventListeners() {
        // Refresh button
        const refreshBtn = document.getElementById('refreshRequestsBtn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.loadAdmissionRequestsData();
            });
        }

        // Export button
        const exportBtn = document.getElementById('exportRequestsBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportRequests();
            });
        }

        // Apply filters button
        const applyFiltersBtn = document.getElementById('applyFiltersBtn');
        if (applyFiltersBtn) {
            applyFiltersBtn.addEventListener('click', () => {
                this.applyFilters();
            });
        }

        // Search input
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                if (e.target.value.length > 2 || e.target.value.length === 0) {
                    this.applyFilters();
                }
            });
        }
    }

    /**
     * Show loading state
     */
    showLoadingState() {
        const tableBody = document.getElementById('applicationsTableBody');
        const paginationInfo = document.getElementById('paginationInfo');
        
        if (tableBody) {
            tableBody.innerHTML = `
                <tr class="loading-row">
                    <td colspan="7" class="loading-cell">
                        <div class="loading-spinner"></div>
                        <span>Loading applications...</span>
                    </td>
                </tr>
            `;
            
            // Update pagination info
            if (paginationInfo) {
                paginationInfo.textContent = 'Loading...';
            }
            
            // Disable pagination controls
            const prevBtn = document.getElementById('prevBtn');
            const nextBtn = document.getElementById('nextBtn');
            if (prevBtn) prevBtn.disabled = true;
            if (nextBtn) nextBtn.disabled = true;
        }
    }

    /**
     * Load admission requests data from API
     */
    async loadAdmissionRequestsData() {
        try {
            // Show loading state
            this.showLoadingState();
            
            // Get auth token
            const token = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
            if (!token) {
                throw new Error('Authentication required');
            }

            const response = await fetch(`/api/admission/applications`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Authentication failed. Please log in again.');
                } else if (response.status === 403) {
                    throw new Error('Access denied. You do not have permission to view admission applications.');
                } else if (response.status >= 500) {
                    throw new Error('Server error. Please try again later.');
                } else {
                    throw new Error(`Failed to load data. Error: ${response.status}`);
                }
            }

            const result = await response.json();
            
            if (!result.success) {
                throw new Error(result.message || 'Failed to load applications');
            }

            // console.log('📡 Admission requests data:', result);
            // console.log('📊 Applications count:', result.applications?.length || 0);
            
            // Apply filters and pagination
            let filteredApplications = this.applyFiltersToData(result.applications || []);
            // console.log('📊 Filtered applications count:', filteredApplications.length);
            
            // Check if we have any applications
            if (filteredApplications.length === 0) {
                this.displayEmptyState();
            } else {
                this.displayAdmissionRequests(filteredApplications);
            }
            
        } catch (error) {
            console.error('❌ Error loading admission requests:', error);
            
            // Show proper error state instead of fallback data
            this.showErrorState('Failed to load admission applications. Please check your connection and try again.');
            
            // Show error notification
            if (this.notificationManager) {
                this.notificationManager.error('Load Failed', 'Unable to load admission applications. Please try again later.');
            }
        }
    }

    /**
     * Apply filters to data
     */
    applyFiltersToData(applications) {
        let filtered = [...applications];
        
        // Apply grade filter
        if (this.currentFilters.grade) {
            filtered = filtered.filter(app => app.grade === this.currentFilters.grade);
        }
        
        // Apply status filter
        if (this.currentFilters.status) {
            filtered = filtered.filter(app => app.status === this.currentFilters.status);
        }
        
        return filtered;
    }

    /**
     * Display empty state when no applications are found
     */
    displayEmptyState() {
        const tableBody = document.getElementById('applicationsTableBody');
        const paginationInfo = document.getElementById('paginationInfo');
        
        if (tableBody) {
            tableBody.innerHTML = `
                <tr class="empty-row">
                    <td colspan="7" class="empty-cell">
                        <div class="empty-state">
                            <div class="empty-icon">
                                <i data-lucide="user-plus"></i>
                            </div>
                            <h3>No Applications Found</h3>
                            <p>No admission applications found matching your criteria.</p>
                        </div>
                    </td>
                </tr>
            `;
            
            // Update pagination info
            if (paginationInfo) {
                paginationInfo.textContent = 'No applications to display';
            }
            
            // Disable pagination controls
            const prevBtn = document.getElementById('prevBtn');
            const nextBtn = document.getElementById('nextBtn');
            if (prevBtn) prevBtn.disabled = true;
            if (nextBtn) nextBtn.disabled = true;
            
            // Reinitialize Lucide icons
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }
    }

    /**
     * Display admission requests in the UI
     */
    displayAdmissionRequests(requests) {
        // console.log('🎨 Displaying admission requests:', requests.length);
        const tableBody = document.getElementById('applicationsTableBody');
        const paginationInfo = document.getElementById('paginationInfo');
        
        if (!tableBody) {
            console.error('❌ Table body not found!');
            return;
        }

        // This method assumes we have data to display
        if (requests.length === 0) {
            this.displayEmptyState();
            return;
        }

        // Calculate pagination
        this.totalPages = Math.ceil(requests.length / this.itemsPerPage);
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const paginatedRequests = requests.slice(startIndex, endIndex);

        // Generate table rows HTML
        const tableRowsHTML = paginatedRequests.map(request => this.generateTableRowHTML(request)).join('');
        
        tableBody.innerHTML = tableRowsHTML;

        // Update pagination info
        if (paginationInfo) {
            const startItem = startIndex + 1;
            const endItem = Math.min(endIndex, requests.length);
            paginationInfo.textContent = `Showing ${startItem}-${endItem} of ${requests.length}`;
        }

        // Update pagination controls
        this.updatePaginationControls();

        // Reinitialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        // Add event listeners for action buttons
        this.attachRequestActionListeners();
        
        // Setup avatar fallback handlers
        this.setupAvatarFallbacks();
    }

    /**
     * Update pagination controls
     */
    updatePaginationControls() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const pageNumbers = document.querySelector('.page-numbers');
        
        // Update previous button
        if (prevBtn) {
            prevBtn.disabled = this.currentPage === 1;
        }
        
        // Update next button
        if (nextBtn) {
            nextBtn.disabled = this.currentPage === this.totalPages;
        }
        
        // Update page numbers
        if (pageNumbers && this.totalPages > 1) {
            let pageNumbersHTML = '';
            for (let i = 1; i <= this.totalPages; i++) {
                const isActive = i === this.currentPage ? 'active' : '';
                pageNumbersHTML += `<button class="page-number ${isActive}" data-page="${i}">${i}</button>`;
            }
            pageNumbers.innerHTML = pageNumbersHTML;
        }
    }

    /**
     * Setup avatar fallback handlers for images that fail to load
     */
    setupAvatarFallbacks() {
        const avatarImages = document.querySelectorAll('img[data-fallback-avatar="true"]');
        
        avatarImages.forEach(img => {
            // Add error handler using arrow function to maintain context
            img.addEventListener('error', (event) => {
                const targetImg = event.target;
                
                // Prevent infinite loop if fallback also fails
                if (targetImg.src.includes('data:image/svg+xml')) {
                    return;
                }
                
                // Create fallback avatar SVG
                const fallbackAvatar = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNGM0Y0RjYiLz4KPHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSI4IiB5PSI4Ij4KPHBhdGggZD0iTTIwIDIxdi0yYTQgNCAwIDAgMC00LTRIOGE0IDQgMCAwIDAtNCA0djIiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPGNpcmNsZSBjeD0iMTIiIGN5PSI3IiByPSI0IiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo8L3N2Zz4K';
                
                // Replace with fallback
                targetImg.src = fallbackAvatar;
                targetImg.style.backgroundColor = '#F3F4F6';
                targetImg.style.borderRadius = '50%';
                targetImg.style.display = 'flex';
                targetImg.style.alignItems = 'center';
                targetImg.style.justifyContent = 'center';
            });
        });
    }

    /**
     * Generate HTML for a single table row
     */
    generateTableRowHTML(request) {
        const statusClass = this.getStatusClass(request.status);
        const statusText = this.formatStatus(request.status);
        
        return `
            <tr class="application-row" data-request-id="${request.id}">
                <td class="checkbox-col">
                    <input type="checkbox" class="table-checkbox row-checkbox" data-request-id="${request.id}">
                </td>
                <td class="student-name">
                    <div class="student-info">
                        <div class="student-avatar">
                            <img src="https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000) + 1500000000000}?w=40&h=40&fit=crop&crop=face" 
                                 alt="${request.studentName}"
                                 data-fallback-avatar="true">
                        </div>
                        <div class="student-details">
                            <div class="name">${request.studentName}</div>
                            <div class="parent">${request.parentName}</div>
                        </div>
                    </div>
                </td>
                <td class="application-id">${request.applicationId || `APP${String(request.id).padStart(6, '0')}`}</td>
                <td class="grade">${request.grade}</td>
                 <td class="status">
                     <span class="status-badge status-${request.status}">${statusText}</span>
                 </td>
                <td class="contact">
                    <div class="contact-info">
                        <div class="email">${request.email}</div>
                        <div class="phone">${request.phone}</div>
                    </div>
                </td>
                <td class="actions">
                    <div class="action-buttons">
                        <button class="action-link details-link" data-request-id="${request.id}">
                            Details
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }

    /**
     * Get status icon for a given status
     */
    getStatusIcon(status) {
        const icons = {
            'pending': 'clock',
            'approved': 'check-circle',
            'rejected': 'x-circle',
            'under-review': 'search'
        };
        return icons[status] || 'help-circle';
    }

    /**
     * Format status text
     */
    formatStatus(status) {
        const statusMap = {
            'PENDING': 'Pending',
            'REVIEWED': 'Reviewed',
            'ACCEPTED': 'Accepted',
            'REJECTED': 'Rejected'
        };
        return statusMap[status] || status;
    }

    /**
     * Get status class for styling
     */
    getStatusClass(status) {
        const statusClassMap = {
            'PENDING': 'status-pending',
            'REVIEWED': 'status-reviewed',
            'ACCEPTED': 'status-accepted',
            'REJECTED': 'status-rejected'
        };
        return statusClassMap[status] || 'status-pending';
    }

    /**
     * Attach event listeners to request action buttons
     */
    attachRequestActionListeners() {
        // Details buttons
        document.querySelectorAll('.details-link').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const requestId = e.target.closest('.details-link').dataset.requestId;
                this.viewRequestDetails(requestId);
            });
        });


        // Row checkboxes
        document.querySelectorAll('.row-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                this.updateBulkActionState();
            });
        });

        // Select all checkbox
        const selectAllCheckbox = document.getElementById('selectAll');
        if (selectAllCheckbox) {
            selectAllCheckbox.addEventListener('change', (e) => {
                const isChecked = e.target.checked;
                document.querySelectorAll('.row-checkbox').forEach(checkbox => {
                    checkbox.checked = isChecked;
                });
                this.updateBulkActionState();
            });
        }

         // Filter buttons
         const gradeFilterBtn = document.getElementById('gradeFilterBtn');
         if (gradeFilterBtn) {
             gradeFilterBtn.addEventListener('click', (e) => {
                 e.stopPropagation();
                 this.showGradeFilter(e.target);
             });
         }

         const statusFilterBtn = document.getElementById('statusFilterBtn');
         if (statusFilterBtn) {
             statusFilterBtn.addEventListener('click', (e) => {
                 e.stopPropagation();
                 this.showStatusFilter(e.target);
             });
         }

        // Bulk action button
        const bulkActionBtn = document.getElementById('bulkActionBtn');
        if (bulkActionBtn) {
            bulkActionBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.showBulkActionMenu();
            });
        }

        // Pagination buttons
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.goToPreviousPage();
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.goToNextPage();
            });
        }

        // Page number buttons
        document.querySelectorAll('.page-number').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const page = parseInt(e.target.dataset.page);
                this.goToPage(page);
            });
        });
    }

    /**
     * View request details
     */
    viewRequestDetails(requestId) {
        this.showApplicationDetailsModal(requestId);
    }

    /**
     * Update application status
     */
    async updateApplicationStatus(requestId, newStatus) {
        try {
            
            const token = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
            if (!token) {
                throw new Error('Authentication required');
            }

            const response = await fetch(`/api/admission/applications/${requestId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    status: newStatus.toUpperCase(),
                    reviewedBy: 'Admin'
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            
            if (result.success) {
                this.notificationManager.success('Status Updated', `Application status updated to ${newStatus}`);
                // Refresh the data with a small delay to ensure database update is complete
                setTimeout(() => {
                    this.loadAdmissionRequestsData();
                    // Update sidebar badges
                    if (window.updateRequestBadges) {
                        window.updateRequestBadges();
                    }
                }, 500);
            } else {
                throw new Error(result.message || 'Failed to update status');
            }
            
        } catch (error) {
            console.error('❌ Error updating application status:', error);
            this.notificationManager.error('Update Failed', 'Failed to update application status');
            // Revert the select value
            const selectElement = document.querySelector(`[data-request-id="${requestId}"]`);
            if (selectElement) {
                selectElement.value = selectElement.dataset.currentStatus;
            }
        }
    }

    /**
     * Delete admission request
     */
    async deleteRequest(requestId) {
        try {
            // TODO: Implement deletion logic
            this.notificationManager.success('Request Deleted', 'Admission request has been deleted.');
            this.loadAdmissionRequestsData(); // Refresh the list
        } catch (error) {
            console.error('Error deleting request:', error);
            this.notificationManager.error('Deletion Failed', 'Failed to delete the request.');
        }
    }

    /**
     * Update bulk action button state
     */
    updateBulkActionState() {
        const selectedCheckboxes = document.querySelectorAll('.row-checkbox:checked');
        const bulkActionBtn = document.getElementById('bulkActionBtn');
        
        if (bulkActionBtn) {
            if (selectedCheckboxes.length > 0) {
                bulkActionBtn.disabled = false;
                bulkActionBtn.textContent = `Bulk Action (${selectedCheckboxes.length})`;
            } else {
                bulkActionBtn.disabled = true;
                bulkActionBtn.innerHTML = '<i data-lucide="check-square"></i> Bulk Action';
            }
        }
    }

    /**
     * Download request details
     */
    downloadRequest(requestId) {
        // TODO: Implement download functionality
        this.notificationManager.info('Feature Coming Soon', 'Download functionality will be implemented soon.');
    }

     /**
      * Show grade filter dropdown
      */
     showGradeFilter(buttonElement) {
         const grades = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
         const filterMenu = this.createFilterMenu('Grade', grades, 'grade');
         this.showFilterMenu(filterMenu, buttonElement);
     }

     /**
      * Show status filter dropdown
      */
     showStatusFilter(buttonElement) {
         const statuses = ['pending', 'reviewed'];
         const filterMenu = this.createFilterMenu('Status', statuses, 'status');
         this.showFilterMenu(filterMenu, buttonElement);
     }

     /**
      * Create filter menu HTML
      */
     createFilterMenu(title, options, filterType) {
         const optionsHTML = options.map(option => 
             `<div class="filter-option" data-value="${option}">${option}</div>`
         ).join('');
         
         return `
             <div class="filter-menu" data-filter-type="${filterType}">
                 <div class="filter-menu-header">
                     <span>Filter by ${title}</span>
                     <button class="close-filter">×</button>
                 </div>
                 <div class="filter-options">
                     <div class="filter-option show-all" data-value="">Show All</div>
                     ${optionsHTML}
                 </div>
             </div>
         `;
     }

     /**
      * Show filter menu
      */
     showFilterMenu(menuHTML, buttonElement) {
         // Remove existing filter menu
         const existingMenu = document.querySelector('.filter-menu');
         if (existingMenu) {
             existingMenu.remove();
         }

         // Add new filter menu
         if (buttonElement) {
             buttonElement.insertAdjacentHTML('afterend', menuHTML);
         } else {
             const filterActionBar = document.querySelector('.filter-action-bar');
             if (filterActionBar) {
                 filterActionBar.insertAdjacentHTML('beforeend', menuHTML);
             }
         }
         
         // Add event listeners
         this.attachFilterMenuListeners();
     }

     /**
      * Attach filter menu event listeners
      */
     attachFilterMenuListeners() {
         // Close button
         const closeBtn = document.querySelector('.close-filter');
         if (closeBtn) {
             closeBtn.addEventListener('click', () => {
                 document.querySelector('.filter-menu').remove();
             });
         }

         // Filter options
         document.querySelectorAll('.filter-option').forEach(option => {
             option.addEventListener('click', (e) => {
                 const filterType = document.querySelector('.filter-menu').dataset.filterType;
                 const filterValue = e.target.dataset.value;
                 this.applyFilter(filterType, filterValue);
                 document.querySelector('.filter-menu').remove();
             });
         });

         // Close menu when clicking outside
         setTimeout(() => {
             document.addEventListener('click', (e) => {
                 const filterMenu = document.querySelector('.filter-menu');
                 if (filterMenu && !filterMenu.contains(e.target)) {
                     filterMenu.remove();
                 }
             }, { once: true });
         }, 0);
     }

     /**
      * Apply filter
      */
     applyFilter(filterType, filterValue) {
         this.currentFilters = this.currentFilters || {};
         
         // If filterValue is empty (Show All), remove the filter
         if (filterValue === '') {
             delete this.currentFilters[filterType];
         } else {
             this.currentFilters[filterType] = filterValue;
         }
         
         this.loadAdmissionRequestsData();
     }

    /**
     * Show bulk action menu
     */
    showBulkActionMenu() {
        const selectedCheckboxes = document.querySelectorAll('.row-checkbox:checked');
        if (selectedCheckboxes.length === 0) {
            this.notificationManager.warning('No Selection', 'Please select applications first');
            return;
        }

        const menuHTML = `
            <div class="bulk-action-menu">
                <div class="bulk-action-header">
                    <span>Bulk Actions (${selectedCheckboxes.length} selected)</span>
                    <button class="close-bulk-menu">×</button>
                </div>
                <div class="bulk-actions">
                    <button class="bulk-menu-btn" data-action="pending">Mark as Pending</button>
                    <button class="bulk-menu-btn" data-action="review">Mark as Reviewed</button>
                    <button class="bulk-menu-btn" data-action="print">Print Selected</button>
                </div>
            </div>
        `;

        // Remove existing menu
        const existingMenu = document.querySelector('.bulk-action-menu');
        if (existingMenu) {
            existingMenu.remove();
        }

        // Add new menu
        const filterActionBar = document.querySelector('.filter-action-bar');
        if (filterActionBar) {
            filterActionBar.insertAdjacentHTML('beforeend', menuHTML);
            this.attachBulkActionListeners();
        }
    }

    /**
     * Attach bulk action event listeners
     */
    attachBulkActionListeners() {
        // Close button
        const closeBtn = document.querySelector('.close-bulk-menu');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                document.querySelector('.bulk-action-menu').remove();
            });
        }

        // Bulk action buttons
        document.querySelectorAll('.bulk-menu-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                this.performBulkAction(action);
                document.querySelector('.bulk-action-menu').remove();
            });
        });
    }

    /**
     * Perform bulk action
     */
    async performBulkAction(action) {
        const selectedCheckboxes = document.querySelectorAll('.row-checkbox:checked');
        const requestIds = Array.from(selectedCheckboxes).map(cb => cb.dataset.requestId);
        
        try {
            switch (action) {
                case 'pending':
                    for (const requestId of requestIds) {
                        await this.updateApplicationStatus(requestId, 'pending');
                    }
                    this.notificationManager.success('Bulk Action Complete', `Marked ${requestIds.length} applications as pending`);
                    break;
                    
                case 'review':
                    for (const requestId of requestIds) {
                        await this.updateApplicationStatus(requestId, 'reviewed');
                    }
                    this.notificationManager.success('Bulk Action Complete', `Marked ${requestIds.length} applications as reviewed`);
                    break;
                    
                case 'print':
                    await this.printSelectedApplications(requestIds);
                    break;
                    
                default:
                    this.notificationManager.warning('Unknown Action', 'The selected action is not supported');
            }
        } catch (error) {
            console.error('❌ Error performing bulk action:', error);
            this.notificationManager.error('Bulk Action Failed', 'Some applications could not be processed');
        }
    }

    /**
     * Download selected applications as PDF
     */
    async downloadSelectedAsPDF(requestIds) {
        try {
            
            // Get application data
            const applications = await this.getApplicationsByIds(requestIds);
            
            // Create PDF content
            const pdfContent = this.generatePDFContent(applications);
            
            // Create and download PDF
            this.downloadPDF(pdfContent, `admission-applications-${new Date().toISOString().split('T')[0]}.pdf`);
            
            this.notificationManager.success('PDF Generated', `PDF downloaded for ${requestIds.length} applications`);
            
        } catch (error) {
            console.error('❌ Error generating PDF:', error);
            this.notificationManager.error('PDF Generation Failed', 'Could not generate PDF for selected applications');
        }
    }

    /**
     * Print preview for selected applications
     */
    async printPreviewApplications(requestIds) {
        try {
            
            // Get application data
            const applications = await this.getApplicationsByIds(requestIds);
            
            // Create print content
            const printContent = this.generatePrintContent(applications);
            
            // Open preview window
            this.openPrintPreviewWindow(printContent);
            
            this.notificationManager.success('Preview Ready', `Print preview opened for ${requestIds.length} applications`);
            
        } catch (error) {
            console.error('❌ Error showing print preview:', error);
            this.notificationManager.error('Preview Failed', 'Could not prepare applications for preview');
        }
    }

    /**
     * Print selected applications
     */
    async printSelectedApplications(requestIds) {
        try {
            // Get application data
            const applications = await this.getApplicationsByIds(requestIds);
            
            // Create print content
            const printContent = this.generatePrintContent(applications);
            
            // Open print window
            this.openPrintWindow(printContent);
            
            this.notificationManager.success('Print Ready', `Print dialog opened for ${requestIds.length} applications`);
            
        } catch (error) {
            console.error('❌ Error printing applications:', error);
            this.notificationManager.error('Print Failed', 'Could not prepare applications for printing');
        }
    }

    /**
     * Get applications by IDs
     */
    async getApplicationsByIds(requestIds) {
        const token = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
        if (!token) {
            throw new Error('Authentication required');
        }

        const applications = [];
        
        for (const requestId of requestIds) {
            try {
                const response = await fetch(`/api/admission/applications/${requestId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const result = await response.json();
                    if (result.success) {
                        applications.push(result.application);
                    }
                }
            } catch (error) {
                console.error(`Error fetching application ${requestId}:`, error);
            }
        }
        
        return applications;
    }

    /**
     * Generate PDF content
     */
    generatePDFContent(applications) {
        const currentDate = new Date().toLocaleDateString();
        
        let content = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Admission Applications Report</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    .header { text-align: center; margin-bottom: 30px; }
                    .header h1 { color: #333; margin-bottom: 10px; }
                    .header p { color: #666; }
                    .application { margin-bottom: 30px; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
                    .application h3 { color: #2c3e50; margin-bottom: 15px; }
                    .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
                    .detail-item { margin-bottom: 10px; }
                    .detail-item label { font-weight: bold; color: #555; }
                    .detail-item span { color: #333; }
                    .section { margin-bottom: 20px; }
                    .section h4 { color: #34495e; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
                    @media print { body { margin: 0; } }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Marigold School</h1>
                    <h2>Admission Applications Report</h2>
                    <p>Generated on: ${currentDate}</p>
                    <p>Total Applications: ${applications.length}</p>
                </div>
        `;

        applications.forEach((app, index) => {
            content += `
                <div class="application">
                    <h3>Application #${app.applicationNumber} - ${app.firstName} ${app.lastName}</h3>
                    
                    <div class="section">
                        <h4>Student Information</h4>
                        <div class="detail-grid">
                            <div class="detail-item">
                                <label>Name:</label> <span>${app.firstName} ${app.lastName}</span>
                            </div>
                            <div class="detail-item">
                                <label>Date of Birth:</label> <span>${new Date(app.dateOfBirth).toLocaleDateString()}</span>
                            </div>
                            <div class="detail-item">
                                <label>Gender:</label> <span>${app.gender}</span>
                            </div>
                            <div class="detail-item">
                                <label>Grade Applied For:</label> <span>${app.gradeAppliedFor}</span>
                            </div>
                            <div class="detail-item">
                                <label>Current School:</label> <span>${app.currentSchool || 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="section">
                        <h4>Parent/Guardian Information</h4>
                        <div class="detail-grid">
                            <div class="detail-item">
                                <label>Name:</label> <span>${app.guardianName}</span>
                            </div>
                            <div class="detail-item">
                                <label>Phone:</label> <span>${app.guardianPhone}</span>
                            </div>
                            <div class="detail-item">
                                <label>Email:</label> <span>${app.guardianEmail || 'N/A'}</span>
                            </div>
                            <div class="detail-item">
                                <label>Occupation:</label> <span>${app.guardianOccupation || 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="section">
                        <h4>Address Information</h4>
                        <div class="detail-grid">
                            <div class="detail-item">
                                <label>Address:</label> <span>${app.addressLine}</span>
                            </div>
                            <div class="detail-item">
                                <label>City:</label> <span>${app.city}</span>
                            </div>
                            <div class="detail-item">
                                <label>State:</label> <span>${app.state || 'N/A'}</span>
                            </div>
                            <div class="detail-item">
                                <label>Postal Code:</label> <span>${app.postalCode || 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="section">
                        <h4>Application Status</h4>
                        <div class="detail-grid">
                            <div class="detail-item">
                                <label>Status:</label> <span>${app.status}</span>
                            </div>
                            <div class="detail-item">
                                <label>Submitted:</label> <span>${new Date(app.createdAt).toLocaleString()}</span>
                            </div>
                            <div class="detail-item">
                                <label>Reviewed At:</label> <span>${app.reviewedAt ? new Date(app.reviewedAt).toLocaleString() : 'Not reviewed'}</span>
                            </div>
                            <div class="detail-item">
                                <label>Reviewed By:</label> <span>${app.reviewedBy || 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });

        content += `
            </body>
            </html>
        `;

        return content;
    }

    /**
     * Generate print content with enhanced styling
     */
    generatePrintContent(applications) {
        const currentDate = new Date().toLocaleDateString();
        const currentTime = new Date().toLocaleTimeString();
        
        let content = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Admission Applications Report - Marigold School</title>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    /* Import the print styles from admin-responsive.css */
                    @media print {
                        .sidebar, .top-header, .page-actions, .action-buttons, .filters, .toast-container, .bulk-action-menu, .filter-menu {
                            display: none !important;
                        }
                        
                        .print-header {
                            text-align: center;
                            margin-bottom: 1rem;
                            border-bottom: 1px solid #333;
                            padding-bottom: 0.5rem;
                        }
                        
                        .print-header h1 {
                            font-size: 1.2rem;
                            font-weight: bold;
                            color: #333;
                            margin: 0 0 0.25rem 0;
                        }
                        
                        .print-header .school-info {
                            font-size: 0.8rem;
                            color: #666;
                            margin: 0;
                        }
                        
                        .print-header .print-date {
                            font-size: 0.8rem;
                            color: #888;
                            margin: 0.5rem 0 0 0;
                        }
                        
                        .print-application {
                            margin: 1rem 0.5rem 1rem 0.5rem;
                            padding: 0.5rem;
                            border: 1px solid #ddd;
                            border-radius: 4px;
                            page-break-inside: avoid;
                        }
                        
                        .print-application .print-header {
                            margin-bottom: 0.5rem;
                            border-bottom: 1px solid #333;
                            padding-bottom: 0.25rem;
                        }
                        
                        .print-application:last-child {
                            margin-bottom: 0;
                        }
                        
                        .print-application h3 {
                            font-size: 0.9rem;
                            font-weight: bold;
                            color: #333;
                            margin: 0 0 0.5rem 0;
                            border-bottom: 1px solid #eee;
                            padding-bottom: 0.25rem;
                        }
                        
                        .print-detail-grid {
                            display: grid;
                            grid-template-columns: 1fr 1fr;
                            gap: 0.25rem 0.75rem;
                            margin-bottom: 0.5rem;
                        }
                        
                        .print-detail-item {
                            display: flex;
                            flex-direction: column;
                            margin-bottom: 0.25rem;
                        }
                        
                        .print-detail-item label {
                            font-size: 0.7rem;
                            font-weight: bold;
                            color: #555;
                            text-transform: uppercase;
                            letter-spacing: 0.05em;
                            margin-bottom: 0.15rem;
                        }
                        
                        .print-detail-item span {
                            font-size: 0.75rem;
                            color: #333;
                            font-weight: 500;
                        }
                        
                        .print-section {
                            margin-bottom: 0.75rem;
                        }
                        
                        .print-section h4 {
                            font-size: 0.8rem;
                            font-weight: bold;
                            color: #444;
                            margin: 0 0 0.5rem 0;
                            border-bottom: 1px solid #ddd;
                            padding-bottom: 0.25rem;
                        }
                        
                        .print-status {
                            display: inline-block;
                            padding: 0.15rem 0.4rem;
                            border-radius: 3px;
                            font-size: 0.65rem;
                            font-weight: bold;
                            text-transform: uppercase;
                        }
                        
                        .print-status.pending {
                            background: #fef3c7;
                            color: #92400e;
                            border: 1px solid #f59e0b;
                        }
                        
                        .print-status.reviewed {
                            background: #dbeafe;
                            color: #1e40af;
                            border: 1px solid #3b82f6;
                        }
                        
                        .print-status.accepted {
                            background: #d1fae5;
                            color: #065f46;
                            border: 1px solid #10b981;
                        }
                        
                        .print-status.rejected {
                            background: #fee2e2;
                            color: #991b1b;
                            border: 1px solid #ef4444;
                        }
                        
                        .print-footer {
                            margin-top: 2rem;
                            padding-top: 1rem;
                            border-top: 1px solid #ddd;
                            text-align: center;
                            font-size: 0.8rem;
                            color: #666;
                        }
                        
                        .no-print {
                            display: none !important;
                        }
                        
                        .print-application {
                            page-break-inside: avoid;
                        }
                        
                        .print-section {
                            page-break-inside: avoid;
                        }
                        
                        body {
                            font-family: Arial, sans-serif;
                            font-size: 12px;
                            line-height: 1.4;
                            color: #333;
                            margin: 0.5rem;
                            padding: 0.5rem;
                        }
                        
                        @page {
                            margin: 0.5in;
                            size: A4;
                        }
                    }
                    
                    /* Screen styles for preview */
                    body {
                        font-family: Arial, sans-serif;
                        font-size: 14px;
                        line-height: 1.6;
                        color: #333;
                        margin: 20px;
                        background: #f5f5f5;
                    }
                    
                    .print-header {
                        text-align: center;
                        margin-bottom: 1rem;
                        border-bottom: 1px solid #333;
                        padding-bottom: 0.5rem;
                        background: white;
                        padding: 1rem;
                        border-radius: 8px;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    }
                    
                    .print-application {
                        margin: 1rem 0.5rem 1.5rem 0.5rem;
                        padding: 1rem;
                        border: 1px solid #ddd;
                        border-radius: 8px;
                        background: white;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    }
                    
                    .print-application .print-header {
                        margin-bottom: 0.75rem;
                        border-bottom: 1px solid #333;
                        padding-bottom: 0.5rem;
                        background: #f8f9fa;
                        padding: 0.75rem;
                        border-radius: 4px;
                    }
                    
                    .print-detail-grid {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 0.5rem 1.5rem;
                        margin-bottom: 0.75rem;
                    }
                    
                    .print-detail-item {
                        display: flex;
                        flex-direction: column;
                        margin-bottom: 0.5rem;
                    }
                    
                    .print-detail-item label {
                        font-size: 0.8rem;
                        font-weight: bold;
                        color: #555;
                        text-transform: uppercase;
                        letter-spacing: 0.05em;
                        margin-bottom: 0.25rem;
                    }
                    
                    .print-detail-item span {
                        font-size: 0.9rem;
                        color: #333;
                        font-weight: 500;
                    }
                    
                    .print-section {
                        margin-bottom: 1rem;
                    }
                    
                    .print-section h4 {
                        font-size: 0.9rem;
                        font-weight: bold;
                        color: #444;
                        margin: 0 0 0.75rem 0;
                        border-bottom: 1px solid #ddd;
                        padding-bottom: 0.25rem;
                    }
                    
                    .print-status {
                        display: inline-block;
                        padding: 0.25rem 0.75rem;
                        border-radius: 4px;
                        font-size: 0.7rem;
                        font-weight: bold;
                        text-transform: uppercase;
                    }
                    
                    .print-status.pending {
                        background: #fef3c7;
                        color: #92400e;
                        border: 1px solid #f59e0b;
                    }
                    
                    .print-status.reviewed {
                        background: #dbeafe;
                        color: #1e40af;
                        border: 1px solid #3b82f6;
                    }
                    
                    .print-status.accepted {
                        background: #d1fae5;
                        color: #065f46;
                        border: 1px solid #10b981;
                    }
                    
                    .print-status.rejected {
                        background: #fee2e2;
                        color: #991b1b;
                        border: 1px solid #ef4444;
                    }
                    
                    .print-footer {
                        margin-top: 2rem;
                        padding-top: 1rem;
                        border-top: 1px solid #ddd;
                        text-align: center;
                        font-size: 0.9rem;
                        color: #666;
                        background: white;
                        padding: 1.5rem;
                        border-radius: 8px;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    }
                    
                    .print-controls {
                        position: fixed;
                        top: 20px;
                        right: 20px;
                        background: white;
                        padding: 1rem;
                        border-radius: 8px;
                        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                        z-index: 1000;
                    }
                    
                    .print-controls button {
                        background: #3b82f6;
                        color: white;
                        border: none;
                        padding: 0.5rem 1rem;
                        border-radius: 4px;
                        cursor: pointer;
                        margin-right: 0.5rem;
                        font-size: 0.9rem;
                    }
                    
                    .print-controls button:hover {
                        background: #2563eb;
                    }
                </style>
            </head>
            <body>
                <div class="print-controls no-print">
                    <button onclick="window.print()">🖨️ Print</button>
                    <button onclick="window.close()">❌ Close</button>
                </div>
        `;

        applications.forEach((app, index) => {
            const statusClass = this.getPrintStatusClass(app.status);
            const statusText = this.formatStatus(app.status);
            
            content += `
                <div class="print-application">
                    <div class="print-header">
                        <h1>Marigold Secondary School</h1>
                        <p class="school-info">Online Admission Application</p>
                    </div>
                    <h3>Application #${app.applicationNumber || `APP${String(app.id).padStart(6, '0')}`} - ${app.firstName} ${app.lastName}</h3>
                    
                    <div class="print-section">
                        <h4>Student Information</h4>
                        <div class="print-detail-grid">
                            <div class="print-detail-item">
                                <label>Full Name</label>
                                <span>${app.firstName} ${app.lastName}</span>
                            </div>
                            <div class="print-detail-item">
                                <label>Date of Birth</label>
                                <span>${new Date(app.dateOfBirth).toLocaleDateString()}</span>
                            </div>
                            <div class="print-detail-item">
                                <label>Gender</label>
                                <span>${app.gender}</span>
                            </div>
                            <div class="print-detail-item">
                                <label>Grade Applied For</label>
                                <span>${app.gradeAppliedFor}</span>
                            </div>
                            <div class="print-detail-item">
                                <label>Current School</label>
                                <span>${app.currentSchool || 'Not specified'}</span>
                            </div>
                            <div class="print-detail-item">
                                <label>Application Status</label>
                                <span class="print-status ${statusClass}">${statusText}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="print-section">
                        <h4>Parent/Guardian Information</h4>
                        <div class="print-detail-grid">
                            <div class="print-detail-item">
                                <label>Parent Name</label>
                                <span>${app.guardianName}</span>
                            </div>
                            <div class="print-detail-item">
                                <label>Phone Number</label>
                                <span>${app.guardianPhone}</span>
                            </div>
                            <div class="print-detail-item">
                                <label>Email Address</label>
                                <span>${app.guardianEmail || 'Not provided'}</span>
                            </div>
                            <div class="print-detail-item">
                                <label>Occupation</label>
                                <span>${app.guardianOccupation || 'Not specified'}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="print-section">
                        <h4>Address Information</h4>
                        <div class="print-detail-grid">
                            <div class="print-detail-item">
                                <label>Full Address</label>
                                <span>${app.addressLine}</span>
                            </div>
                            <div class="print-detail-item">
                                <label>City</label>
                                <span>${app.city}</span>
                            </div>
                            <div class="print-detail-item">
                                <label>State</label>
                                <span>${app.state || 'Not specified'}</span>
                            </div>
                            <div class="print-detail-item">
                                <label>Postal Code</label>
                                <span>${app.postalCode || 'Not specified'}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="print-section">
                        <h4>Application Details</h4>
                        <div class="print-detail-grid">
                            <div class="print-detail-item">
                                <label>Submitted On</label>
                                <span>${new Date(app.createdAt).toLocaleString()}</span>
                            </div>
                            <div class="print-detail-item">
                                <label>Reviewed At</label>
                                <span>${app.reviewedAt ? new Date(app.reviewedAt).toLocaleString() : 'Not reviewed'}</span>
                            </div>
                            <div class="print-detail-item">
                                <label>Reviewed By</label>
                                <span>${app.reviewedBy || 'N/A'}</span>
                            </div>
                            <div class="print-detail-item">
                                <label>Application ID</label>
                                <span>${app.applicationNumber || `APP${String(app.id).padStart(6, '0')}`}</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });

        content += `
            </body>
            </html>
        `;

        return content;
    }
    
    /**
     * Get print status class for styling
     */
    getPrintStatusClass(status) {
        const statusClassMap = {
            'PENDING': 'pending',
            'REVIEWED': 'reviewed',
            'ACCEPTED': 'accepted',
            'REJECTED': 'rejected'
        };
        return statusClassMap[status] || 'pending';
    }

    /**
     * Download PDF
     */
    downloadPDF(content, filename) {
        try {
            // Create a new window for PDF generation
            const printWindow = window.open('', '_blank', 'width=800,height=600');
            
            if (!printWindow) {
                throw new Error('Popup blocked. Please allow popups for this site.');
            }
            
            printWindow.document.write(content);
            printWindow.document.close();
            
            // Wait for content to load, then trigger print
            printWindow.onload = function() {
                setTimeout(() => {
                    // Focus the window and trigger print
                    printWindow.focus();
                    printWindow.print();
                    
                    // Close the window after a delay
                    setTimeout(() => {
                        if (!printWindow.closed) {
                            printWindow.close();
                        }
                    }, 2000);
                }, 1000);
            };
            
            // Handle window close event
            printWindow.onbeforeunload = function() {
                return 'Are you sure you want to close? The PDF download will be cancelled.';
            };
            
        } catch (error) {
            console.error('Error opening print window:', error);
            
            // Fallback: Download as HTML file
            const blob = new Blob([content], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename.replace('.pdf', '.html');
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            // Show notification about fallback
            if (this.notificationManager) {
                this.notificationManager.info('Download as HTML', 'PDF generation failed. Downloaded as HTML file instead.');
            }
        }
    }

    /**
     * Open print preview window
     */
    openPrintPreviewWindow(content) {
        const previewWindow = window.open('', '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');
        previewWindow.document.write(content);
        previewWindow.document.close();
        previewWindow.focus();
        
        // Add title to the preview window
        previewWindow.document.title = 'Print Preview - Admission Applications';
    }

    /**
     * Open print window
     */
    openPrintWindow(content) {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(content);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
    }

    /**
     * Show application details modal
     */
    async showApplicationDetailsModal(requestId) {
        try {
            const token = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
            if (!token) {
                throw new Error('Authentication required');
            }

            const response = await fetch(`/api/admission/applications/${requestId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            
            if (result.success) {
                this.displayApplicationDetailsModal(result.application);
            } else {
                throw new Error(result.message || 'Failed to load application details');
            }
            
        } catch (error) {
            console.error('❌ Error loading application details:', error);
            this.notificationManager.error('Load Failed', 'Failed to load application details');
        }
    }

    /**
     * Display application details modal
     */
    displayApplicationDetailsModal(application) {
        const modalHTML = `
            <div class="modal-overlay" id="applicationDetailsModal">
                <div class="modal-content admission-detail-modal">
                    <div class="modal-header">
                        <div class="modal-title-section">
                            <h2>Admission Application Details</h2>
                            <p>Review and manage the application for ${application.firstName} ${application.lastName}.</p>
                        </div>
                        <button class="modal-close-btn close-modal">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                    
                    <div class="modal-body">
                        <div class="detail-section">
                            <h3>Student Information</h3>
                            <div class="detail-grid">
                                <div class="detail-item">
                                    <label>Name</label>
                                    <span>${application.firstName} ${application.lastName}</span>
                                </div>
                                <div class="detail-item">
                                    <label>Date of Birth</label>
                                    <span>${new Date(application.dateOfBirth).toLocaleDateString('en-US', { 
                                        year: 'numeric', 
                                        month: 'long', 
                                        day: 'numeric' 
                                    })}</span>
                                </div>
                                <div class="detail-item">
                                    <label>Gender</label>
                                    <span>${application.gender}</span>
                                </div>
                                <div class="detail-item">
                                    <label>Grade Applying For</label>
                                    <span>${application.gradeAppliedFor}</span>
                                </div>
                                <div class="detail-item">
                                    <label>Current School</label>
                                    <span>${application.currentSchool || 'Not specified'}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="detail-section">
                            <h3>Parent Information</h3>
                            <div class="detail-grid">
                                <div class="detail-item">
                                    <label>Parent Name</label>
                                    <span>${application.guardianName}</span>
                                </div>
                                <div class="detail-item">
                                    <label>Phone Number</label>
                                    <span>${application.guardianPhone}</span>
                                </div>
                                <div class="detail-item">
                                    <label>Email Address</label>
                                    <span>${application.guardianEmail || 'Not provided'}</span>
                                </div>
                                <div class="detail-item full-width">
                                    <label>Occupation</label>
                                    <span>${application.guardianOccupation || 'Not specified'}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="detail-section">
                            <h3>Address Information</h3>
                            <div class="detail-grid">
                                <div class="detail-item full-width">
                                    <label>Full Address</label>
                                    <span>${application.addressLine}</span>
                                </div>
                                <div class="detail-item">
                                    <label>City</label>
                                    <span>${application.city}</span>
                                </div>
                                <div class="detail-item">
                                    <label>State</label>
                                    <span>${application.state || 'Not specified'}</span>
                                </div>
                                <div class="detail-item">
                                    <label>Postal Code</label>
                                    <span>${application.postalCode || 'Not specified'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="modal-footer">
                        <div class="action-buttons-right">
                            <button class="btn btn-secondary" id="downloadPDF" data-request-id="${application.id}">
                                Download PDF
                            </button>
                            <button class="btn btn-primary" id="markReviewed" data-request-id="${application.id}">
                                Mark as Reviewed
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <style>
            .admission-detail-modal {
                max-width: 800px;
                width: 90%;
                max-height: 90vh;
                overflow: hidden;
                display: flex;
                flex-direction: column;
            }
            
            .modal-header {
                padding: 2rem 2rem 1rem 2rem;
                border-bottom: 1px solid #e5e7eb;
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                flex-shrink: 0;
            }
            
            .modal-title-section h2 {
                margin: 0 0 0.5rem 0;
                font-size: 1.5rem;
                font-weight: 600;
                color: #111827;
            }
            
            .modal-title-section p {
                margin: 0;
                color: #6b7280;
                font-size: 0.875rem;
            }
            
            .modal-close-btn {
                background: none;
                border: none;
                color: #6b7280;
                cursor: pointer;
                padding: 0.5rem;
                border-radius: 0.375rem;
                transition: all 0.2s;
            }
            
            .modal-close-btn:hover {
                background: #f3f4f6;
                color: #374151;
            }
            
            .modal-body {
                padding: 2rem;
                overflow-y: auto;
                flex: 1;
            }
            
            .detail-section {
                margin-bottom: 2rem;
            }
            
            .detail-section h3 {
                margin: 0 0 1rem 0;
                font-size: 1.125rem;
                font-weight: 600;
                color: #111827;
            }
            
            .detail-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 1rem 2rem;
            }
            
            .detail-item {
                display: flex;
                flex-direction: column;
                gap: 0.25rem;
            }
            
            .detail-item.full-width {
                grid-column: 1 / -1;
            }
            
            .detail-item label {
                font-size: 0.75rem;
                font-weight: 500;
                color: #6b7280;
                text-transform: uppercase;
                letter-spacing: 0.05em;
            }
            
            .detail-item span {
                font-size: 0.875rem;
                color: #111827;
                font-weight: 500;
            }
            
            .modal-footer {
                padding: 1.5rem 2rem;
                border-top: 1px solid #e5e7eb;
                display: flex;
                justify-content: space-between;
                align-items: center;
                flex-shrink: 0;
                gap: 1rem;
            }
            
            .action-buttons-left,
            .action-buttons-right {
                display: flex;
                gap: 0.75rem;
            }
            
            .btn {
                padding: 0.75rem 1.5rem;
                border-radius: 0.5rem;
                font-size: 0.875rem;
                font-weight: 500;
                border: none;
                cursor: pointer;
                transition: all 0.2s;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                text-decoration: none;
            }
            
            .btn-success {
                background: #10b981;
                color: white;
            }
            
            .btn-success:hover {
                background: #059669;
                transform: translateY(-1px);
            }
            
            .btn-danger {
                background: #ef4444;
                color: white;
            }
            
            .btn-danger:hover {
                background: #dc2626;
                transform: translateY(-1px);
            }
            
            .btn-secondary {
                background: #6b7280;
                color: white;
            }
            
            .btn-secondary:hover {
                background: #4b5563;
                transform: translateY(-1px);
            }
            
            .btn-primary {
                background: #3b82f6;
                color: white;
            }
            
            .btn-primary:hover {
                background: #2563eb;
                transform: translateY(-1px);
            }
            
            @media (max-width: 768px) {
                .admission-detail-modal {
                    width: 95%;
                    max-height: 95vh;
                }
                
                .modal-header,
                .modal-body,
                .modal-footer {
                    padding: 1rem;
                }
                
                .detail-grid {
                    grid-template-columns: 1fr;
                    gap: 1rem;
                }
                
                .modal-footer {
                    flex-direction: column;
                    gap: 1rem;
                }
                
                .action-buttons-left,
                .action-buttons-right {
                    width: 100%;
                    justify-content: stretch;
                }
                
                .action-buttons-left .btn,
                .action-buttons-right .btn {
                    flex: 1;
                }
            }
            </style>
        `;

        // Remove existing modal
        const existingModal = document.getElementById('applicationDetailsModal');
        if (existingModal) {
            existingModal.remove();
        }

        // Add new modal
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Add event listeners
        this.setupModalEventListeners();
    }

    /**
     * Setup modal event listeners
     */
    setupModalEventListeners() {
        // Close modal buttons
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', () => {
                this.closeModal();
            });
        });

        // Close on overlay click
        const modalOverlay = document.querySelector('#applicationDetailsModal .modal-overlay');
        if (modalOverlay) {
            modalOverlay.addEventListener('click', (e) => {
                if (e.target === modalOverlay) {
                    this.closeModal();
                }
            });
        }

        // ESC key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const modal = document.getElementById('applicationDetailsModal');
                if (modal) {
                    this.closeModal();
                }
            }
        });

        // Action buttons
        const acceptBtn = document.getElementById('acceptApplication');
        if (acceptBtn) {
            acceptBtn.addEventListener('click', () => {
                const requestId = acceptBtn.dataset.requestId;
                this.handleApplicationAction(requestId, 'accepted');
            });
        }

        const rejectBtn = document.getElementById('rejectApplication');
        if (rejectBtn) {
            rejectBtn.addEventListener('click', () => {
                const requestId = rejectBtn.dataset.requestId;
                this.handleApplicationAction(requestId, 'rejected');
            });
        }

        const reviewedBtn = document.getElementById('markReviewed');
        if (reviewedBtn) {
            reviewedBtn.addEventListener('click', () => {
                const requestId = reviewedBtn.dataset.requestId;
                this.handleApplicationAction(requestId, 'reviewed');
            });
        }

        const downloadBtn = document.getElementById('downloadPDF');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => {
                const requestId = downloadBtn.dataset.requestId;
                this.downloadApplicationPDF(requestId);
            });
        }
    }

    /**
     * Close modal
     */
    closeModal() {
        const modal = document.getElementById('applicationDetailsModal');
        if (modal) {
            modal.remove();
        }
    }

    /**
     * Handle application action (accept, reject, review)
     */
    async handleApplicationAction(requestId, action) {
        try {
            // Show loading state
            const button = document.querySelector(`[data-request-id="${requestId}"]`);
            const originalText = button.textContent;
            button.disabled = true;
            button.textContent = 'Processing...';

            await this.updateApplicationStatus(requestId, action);
            
            // Close modal and refresh data
            this.closeModal();
            this.loadAdmissionRequestsData();
            
            this.notificationManager.success('Success', `Application ${action} successfully`);
            
        } catch (error) {
            console.error('Error handling application action:', error);
            this.notificationManager.error('Error', 'Failed to update application status');
            
            // Restore button state
            const button = document.querySelector(`[data-request-id="${requestId}"]`);
            if (button) {
                button.disabled = false;
                button.textContent = originalText;
            }
        }
    }

    /**
     * Download application PDF
     */
    async downloadApplicationPDF(requestId) {
        try {
            const token = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
            if (!token) {
                throw new Error('Authentication required');
            }

            const response = await fetch(`/api/admission/applications/${requestId}/pdf`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Create blob and download
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `application-${requestId}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            this.notificationManager.success('Success', 'PDF downloaded successfully');
            
        } catch (error) {
            console.error('Error downloading PDF:', error);
            this.notificationManager.error('Error', 'Failed to download PDF');
        }
    }

    /**
     * Pagination methods
     */
    goToPreviousPage() {
        if (this.currentPage > 1) {
            this.goToPage(this.currentPage - 1);
        }
    }

    goToNextPage() {
        if (this.currentPage < this.totalPages) {
            this.goToPage(this.currentPage + 1);
        }
    }

    goToPage(page) {
        this.currentPage = page;
        this.loadAdmissionRequestsData();
    }

    /**
     * Apply filters
     */
    applyFilters() {
        this.loadAdmissionRequestsData();
    }

    /**
     * Export requests
     */
    exportRequests() {
        // TODO: Implement export functionality
        this.notificationManager.info('Feature Coming Soon', 'Export functionality will be implemented soon.');
    }

    /**
     * Show error state
     */
    showErrorState(message) {
        const tableBody = document.getElementById('applicationsTableBody');
        const paginationInfo = document.getElementById('paginationInfo');
        
        if (tableBody) {
            tableBody.innerHTML = `
                <tr class="error-row">
                    <td colspan="7" class="error-cell">
                        <div class="error-state">
                            <div class="error-icon">
                                <i data-lucide="alert-circle"></i>
                            </div>
                            <h3>Error Loading Applications</h3>
                            <p>${message}</p>
                            <button class="btn btn-primary retry-btn" onclick="window.admissionRequestsManager.loadAdmissionRequestsData()">
                                <i data-lucide="refresh-cw"></i>
                                Try Again
                            </button>
                        </div>
                    </td>
                </tr>
            `;
            
            // Update pagination info
            if (paginationInfo) {
                paginationInfo.textContent = 'Error loading data';
            }
            
            // Disable pagination controls
            const prevBtn = document.getElementById('prevBtn');
            const nextBtn = document.getElementById('nextBtn');
            if (prevBtn) prevBtn.disabled = true;
            if (nextBtn) nextBtn.disabled = true;
            
            // Reinitialize Lucide icons
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
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
        
        // Add active class to admission requests link
        const admissionRequestsLink = document.querySelector('[data-section="admission-requests"]');
        if (admissionRequestsLink) {
            admissionRequestsLink.classList.add('active');
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
    window.admissionRequestsManager = new AdmissionRequestsManager();
});
