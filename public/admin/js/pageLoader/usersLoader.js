/**
 * Users Manager
 * Handles dynamic loading and management of the users section
 */
class UsersManager {
    constructor() {
        this.currentSection = 'users';
        this.notificationManager = window.NotificationManager;
        this.init();
    }

    init() {
        this.bindEvents();
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Global click handler for users section and actions
        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-section="users"]')) {
                e.preventDefault();
                this.loadUsers();
            }
            
            // Handle reload page action
            if (e.target.closest('[data-action="reload-page"]')) {
                e.preventDefault();
                location.reload();
            }
        });
    }

    /**
     * Load users section dynamically
     */
    async loadUsers() {
        try {
            // Get users content
            const content = this.getUsersContent();
            
            // Inject content into page-content
            this.injectContent(content);
            
            // Initialize users functionality
            this.initializeUsers();
            
            // Load and display users data
            await this.loadUsersData();
            
            // Update navigation
            this.updateNavigation();
            
        } catch (error) {
            console.error('Error loading users section:', error);
            this.showError('Failed to load users section');
        }
    }

    /**
     * Get users content HTML
     */
    getUsersContent() {
        const currentUserRole = this.getCurrentUserRole();
        const isAdmin = currentUserRole === 'ADMIN';
        
        return `
            <section id="users-section" class="content-section active">
                <div class="page-header">
                    <div class="page-title">
                        <h1>User Management</h1>
                        <p>Manage user accounts, roles, and permissions.</p>
                    </div>
                    <div class="page-actions">
                        ${isAdmin ? `
                        <button class="btn btn-primary" id="addUserBtn">
                            <i data-lucide="user-plus"></i>
                            Add User
                        </button>
                        ` : ''}
                    </div>
                </div>

                <div class="content-card">
                    <div class="card-header">
                        <div class="search-bar">
                            <input type="text" placeholder="Search users..." id="userSearch">
                        </div>
                        <div class="filters">
                            <select class="filter-select" id="userRole">
                                <option value="">All Roles</option>
                                <option value="admin">Admin</option>
                                <option value="user">User</option>
                            </select>
                        </div>
                    </div>
                    <div class="card-content">
                        <div class="table-wrapper">
                            <table class="data-table" id="usersTable">
                                <thead>
                                    <tr>
                                        <th>User</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody id="usersTableBody">
                                    <tr>
                                        <td colspan="5" class="loading">Loading users...</td>
                                    </tr>
                                </tbody>
                            </table>
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
     * Initialize users functionality
     */
    initializeUsers() {
        // Add event handler for add user button
        const addUserBtn = document.getElementById('addUserBtn');
        if (addUserBtn) {
            addUserBtn.addEventListener('click', () => {
                this.showAddUserModal();
            });
        }

        // Add event handlers for user action buttons
        this.initializeUserActions();

        // Initialize search functionality
        this.initializeSearch();

        // Initialize filter functionality
        this.initializeFilters();
    }

    /**
     * Initialize user action buttons
     */
    initializeUserActions() {
        // Event delegation for user actions (handles dynamically created buttons)
        document.addEventListener('click', (e) => {
            if (e.target.closest('.edit-user-btn')) {
                const userId = e.target.closest('.edit-user-btn').getAttribute('data-user-id');
                this.editUser(userId);
            } else if (e.target.closest('.delete-user-btn')) {
                const userId = e.target.closest('.delete-user-btn').getAttribute('data-user-id');
                this.deleteUser(userId);
            }
        });
    }

    /**
     * Show add user modal
     */
    showAddUserModal() {
        // Remove any existing add user modals first to prevent duplicates
        const existingModals = document.querySelectorAll('.add-user-modal-overlay');
        existingModals.forEach(modal => modal.remove());
        
        // Create modal overlay
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'add-user-modal-overlay';
        modalOverlay.innerHTML = this.getAddUserModalHTML();
        
        // Add to page
        document.body.appendChild(modalOverlay);

        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        // Initialize modal functionality
        this.initializeAddUserModal();
    }

    /**
     * Get add user modal HTML
     */
    getAddUserModalHTML() {
        return `
            <div class="add-user-modal">
                <div class="add-user-modal-header">
                    <div class="add-user-modal-title">
                        <h2>Add New User</h2>
                        <p>Create a new user account</p>
                    </div>
                    <button class="add-user-modal-close" id="close-add-user-modal">
                        <i data-lucide="x"></i>
                    </button>
                </div>

                <div class="add-user-modal-content">
                    <form id="add-user-form">
                        <div class="form-group">
                            <label for="user-name" class="form-label">Full Name</label>
                            <input type="text" id="user-name" class="form-input" placeholder="Enter full name" required>
                        </div>

                        <div class="form-group">
                            <label for="user-email" class="form-label">Email Address</label>
                            <input type="email" id="user-email" class="form-input" placeholder="Enter email address" required>
                        </div>

                        <div class="form-group">
                            <label for="user-role" class="form-label">Role</label>
                            <select id="user-role" class="form-select" required>
                                <option value="">Select role</option>
                                <option value="admin">Admin</option>
                                <option value="user">User</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="user-password" class="form-label">Password</label>
                            <input type="password" id="user-password" class="form-input" placeholder="Enter password" required>
                        </div>

                        <div class="form-group">
                            <label for="user-confirm-password" class="form-label">Confirm Password</label>
                            <input type="password" id="user-confirm-password" class="form-input" placeholder="Confirm password" required>
                        </div>
                    </form>
                </div>

                <div class="add-user-modal-footer">
                    <button class="btn btn-secondary" id="cancel-add-user-btn">Cancel</button>
                    <button class="btn btn-primary" id="create-user-btn">
                        <i data-lucide="user-plus"></i>
                        Create User
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Initialize add user modal
     */
    initializeAddUserModal() {
        const cancelBtn = document.getElementById('cancel-add-user-btn');
        const createBtn = document.getElementById('create-user-btn');
        const closeBtn = document.getElementById('close-add-user-modal');

        // Cancel button
        cancelBtn.addEventListener('click', () => {
            this.closeAddUserModal();
        });

        // Close button
        closeBtn.addEventListener('click', () => {
            this.closeAddUserModal();
        });

        // Create user button
        createBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.createUser();
        });

        // Form submission
        const form = document.getElementById('add-user-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.createUser();
            });
        }

        // Close on overlay click
        document.querySelector('.add-user-modal-overlay').addEventListener('click', (e) => {
            if (e.target.classList.contains('add-user-modal-overlay')) {
                this.closeAddUserModal();
            }
        });

        // Close on Escape key
        const handleKeydown = (e) => {
            if (e.key === 'Escape') {
                this.closeAddUserModal();
                document.removeEventListener('keydown', handleKeydown);
            }
        };
        document.addEventListener('keydown', handleKeydown);
    }

    /**
     * Create new user
     */
    createUser() {
        
        const name = document.getElementById('user-name').value.trim();
        const email = document.getElementById('user-email').value.trim();
        const role = document.getElementById('user-role').value;
        const password = document.getElementById('user-password').value;
        const confirmPassword = document.getElementById('user-confirm-password').value;


        // Validation
        if (!name || !email || !role || !password || !confirmPassword) {
            this.notificationManager.error('Validation Error', 'Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            this.notificationManager.error('Validation Error', 'Passwords do not match');
            return;
        }

        if (password.length < 6) {
            this.notificationManager.error('Validation Error', 'Password must be at least 6 characters long');
            return;
        }

        // Show loading state
        const createBtn = document.getElementById('create-user-btn');
        const originalText = createBtn.innerHTML;
        createBtn.innerHTML = '<i data-lucide="loader-2" class="animate-spin"></i> Creating...';
        createBtn.disabled = true;

        // Create user via API
        this.createUserAPI(name, email, role, password, createBtn);
    }

    /**
     * Create user via API
     */
    async createUserAPI(name, email, role, password, createBtn) {
        
        try {
            const token = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
            
            if (!token) {
                this.notificationManager.error('Authentication Error', 'Authentication required');
                createBtn.innerHTML = '<i data-lucide="user-plus"></i> Create User';
                createBtn.disabled = false;
                return;
            }

            
            const response = await fetch('/api/admin/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name,
                    email,
                    role,
                    password
                })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Add new user to the beginning of the list
                this.users.unshift(data.user);
                
                // Update allUsers if it exists
                if (this.allUsers) {
                    this.allUsers.unshift(data.user);
                }
                
                this.notificationManager.success('User Created', 'User has been created successfully');
                this.closeAddUserModal();
                this.renderUsersTable();
            } else {
                this.notificationManager.error('Create User Failed', data.message || 'Failed to create user');
            }
        } catch (error) {
            console.error('Error creating user:', error);
            this.notificationManager.error('Create User Failed', 'Failed to create user');
        } finally {
            createBtn.innerHTML = '<i data-lucide="user-plus"></i> Create User';
            createBtn.disabled = false;
        }
    }

    /**
     * Close add user modal
     */
    closeAddUserModal() {
        const modal = document.querySelector('.add-user-modal-overlay');
        if (modal) {
            modal.remove();
        }
    }

    /**
     * Load users data from API
     */
    async loadUsersData() {
         try {
             // Show loading state with skeleton
             const tableBody = document.getElementById('usersTableBody');
             if (tableBody) {
                 tableBody.innerHTML = this.getLoadingSkeleton();
             }

            // Get token from localStorage or sessionStorage
            const token = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
            
            if (!token) {
                console.warn('No authentication token found');
                this.showConnectionError('Authentication required. Please log in again.');
                return;
            }

            // Fetch users from API
            const response = await fetch('/api/admin/users', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                
                if (data.success && data.users) {
                    this.users = data.users;
                } else {
                    console.warn('API returned no users:', data);
                    this.showConnectionError('No users found or server error occurred.');
                }
            } else {
                console.warn('API request failed:', response.status, response.statusText);
                this.showConnectionError(`Server error: ${response.status} ${response.statusText}`);
            }
            
            this.renderUsersTable();
        } catch (error) {
            console.error('Error loading users:', error);
            this.showConnectionError('Failed to connect to server. Please check your connection and try again.');
        }
    }

    /**
     * Show connection error message
     */
    showConnectionError(message) {
        const tableBody = document.getElementById('usersTableBody');
        if (!tableBody) return;

        tableBody.innerHTML = `
            <tr>
                <td colspan="5" class="error-state">
                    <div style="display: flex; flex-direction: column; align-items: center; padding: 3rem; text-align: center;">
                        <div style="width: 64px; height: 64px; background: #fef2f2; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 1rem;">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="15" y1="9" x2="9" y2="15"></line>
                                <line x1="9" y1="9" x2="15" y2="15"></line>
                            </svg>
                        </div>
                        <h3 style="color: #1f2937; margin-bottom: 0.5rem; font-size: 1.125rem; font-weight: 600;">Connection Error</h3>
                        <p style="color: #6b7280; margin-bottom: 1.5rem; font-size: 0.875rem;">${message}</p>
                        <div style="display: flex; gap: 0.75rem;">
                            <button class="retry-users-btn" style="padding: 0.5rem 1rem; background: #3b82f6; color: white; border: none; border-radius: 0.375rem; cursor: pointer; font-size: 0.875rem;">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 0.5rem;">
                                    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
                                    <path d="M21 3v5h-5"></path>
                                    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
                                    <path d="M3 21v-5h5"></path>
                                </svg>
                                Retry
                            </button>
                            <button class="reload-page-btn" style="padding: 0.5rem 1rem; background: #6b7280; color: white; border: none; border-radius: 0.375rem; cursor: pointer; font-size: 0.875rem;">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 0.5rem;">
                                    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
                                    <path d="M21 3v5h-5"></path>
                                    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
                                    <path d="M3 21v-5h5"></path>
                                </svg>
                                Reload Page
                            </button>
                        </div>
                    </div>
                </td>
            </tr>
        `;

        // Attach event listeners for retry and reload buttons
        const retryBtn = tableBody.querySelector('.retry-users-btn');
        const reloadBtn = tableBody.querySelector('.reload-page-btn');
        
        if (retryBtn) {
            retryBtn.addEventListener('click', () => {
                this.loadUsersData();
            });
        }
        
        if (reloadBtn) {
            reloadBtn.addEventListener('click', () => {
                location.reload();
            });
        }
    }

    /**
     * Get loading skeleton HTML
     */
    getLoadingSkeleton() {
        const skeletonRows = Array.from({ length: 4 }, () => `
            <tr class="loading-row">
                <td>
                    <div class="user-info">
                        <div class="user-avatar skeleton-avatar"></div>
                        <div class="user-details">
                            <div class="skeleton-text skeleton-name"></div>
                            <div class="skeleton-text skeleton-id"></div>
                        </div>
                    </div>
                </td>
                <td>
                    <div class="skeleton-text skeleton-email"></div>
                </td>
                <td>
                    <div class="skeleton-badge"></div>
                </td>
                <td>
                    <div class="skeleton-badge"></div>
                </td>
                <td>
                    <div class="action-buttons">
                        <div class="skeleton-button"></div>
                        <div class="skeleton-button"></div>
                    </div>
                </td>
            </tr>
        `).join('');
        
        return skeletonRows;
    }


    /**
     * Get current user ID from token
     */
    getCurrentUserId() {
        try {
            const token = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
            if (!token) return null;
            
            // Decode JWT token to get user ID
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.userId;
        } catch (error) {
            console.error('Error getting current user ID:', error);
            return null;
        }
    }

    /**
     * Get current user role from token
     */
    getCurrentUserRole() {
        try {
            const token = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
            if (!token) return null;
            
            // Decode JWT token to get user role
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.role;
        } catch (error) {
            console.error('Error getting current user role:', error);
            return null;
        }
    }

    /**
     * Render users table
     */
    renderUsersTable() {
        const tableBody = document.getElementById('usersTableBody');
        if (!tableBody) return;

        if (this.users.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5" class="no-data">No users found</td></tr>';
            return;
        }

        const currentUserId = this.getCurrentUserId();
        const currentUserRole = this.getCurrentUserRole();
        const isAdmin = currentUserRole === 'ADMIN';
        
        const usersHtml = this.users.map(user => {
            const isCurrentUser = user.id === currentUserId;
            return `
            <tr data-user-id="${user.id}">
                <td>
                    <div class="user-info">
                        <div class="user-avatar">
                            ${user.profileImage ? 
                                `<img src="${user.profileImage}" alt="${user.name || 'User'}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
                                 <div class="avatar-placeholder" style="display: none;">${(user.name || 'U').charAt(0).toUpperCase()}</div>` : 
                                `<div class="avatar-placeholder" style="display: flex;">${(user.name || 'U').charAt(0).toUpperCase()}</div>`
                            }
                        </div>
                        <div class="user-details">
                            <div class="user-name">${user.name || 'Unknown User'}</div>
                        </div>
                    </div>
                </td>
                <td>
                    <div class="user-email">${user.email}</div>
                </td>
                <td>
                    <span class="role-badge role-${user.role}">${(user.role || 'user').charAt(0).toUpperCase() + (user.role || 'user').slice(1)}</span>
                </td>
                <td>
                    <span class="status-badge status-${user.status}">${(user.status || 'active').charAt(0).toUpperCase() + (user.status || 'active').slice(1)}</span>
                </td>
                <td>
                    <div class="action-buttons">
                        ${isAdmin ? `
                            <button class="btn btn-sm btn-secondary edit-user-btn" data-user-id="${user.id}" title="Edit User">
                                <i data-lucide="edit"></i>
                            </button>
                            ${isCurrentUser ? 
                                '' : 
                                `<button class="btn btn-sm btn-danger delete-user-btn" data-user-id="${user.id}" title="Delete User">
                                    <i data-lucide="trash-2"></i>
                                </button>`
                            }
                        ` : `
                            <span class="text-muted">No actions available</span>
                        `}
                    </div>
                </td>
            </tr>
        `;
        }).join('');

        tableBody.innerHTML = usersHtml;

        // Reinitialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        // Reattach event listeners for new buttons
        this.initializeUserActions();
    }

    /**
     * Initialize search functionality
     */
    initializeSearch() {
        const searchInput = document.getElementById('userSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase();
                this.filterUsers(query, 'search');
            });
        }
    }

    /**
     * Initialize filter functionality
     */
    initializeFilters() {
        const roleFilter = document.getElementById('userRole');
        if (roleFilter) {
            roleFilter.addEventListener('change', (e) => {
                const role = e.target.value;
                this.filterUsers(role, 'role');
            });
        }

    }

    /**
     * Filter users based on search and filters
     */
    filterUsers(query, type) {
        if (!this.allUsers) {
            this.allUsers = [...this.users]; // Store original data
        }

        let filteredUsers = [...this.allUsers];

        // Apply search filter
        const searchInput = document.getElementById('userSearch');
        if (searchInput && searchInput.value) {
            const searchQuery = searchInput.value.toLowerCase();
            filteredUsers = filteredUsers.filter(user => 
                (user.name || '').toLowerCase().includes(searchQuery) ||
                (user.email || '').toLowerCase().includes(searchQuery)
            );
        }

        // Apply role filter
        const roleFilter = document.getElementById('userRole');
        if (roleFilter && roleFilter.value) {
            filteredUsers = filteredUsers.filter(user => user.role === roleFilter.value);
        }


        // Update users and re-render
        this.users = filteredUsers;
        this.renderUsersTable();
    }

    /**
     * Edit user
     */
    editUser(userId) {
        const user = this.users.find(u => u.id == userId);
        if (!user) {
            this.notificationManager.error('User Not Found', 'User not found');
            return;
        }

        this.showEditUserModal(user);
    }

    /**
     * Show edit user modal
     */
    showEditUserModal(user) {
        // Remove any existing edit user modals first to prevent duplicates
        const existingModals = document.querySelectorAll('.add-user-modal-overlay');
        existingModals.forEach(modal => modal.remove());
        
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'add-user-modal-overlay';
        modalOverlay.innerHTML = this.getEditUserModalHTML(user);
        
        document.body.appendChild(modalOverlay);

        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        this.initializeEditUserModal(user.id);
    }

    /**
     * Get edit user modal HTML
     */
    getEditUserModalHTML(user) {
        return `
            <div class="add-user-modal">
                <div class="add-user-modal-header">
                    <div class="add-user-modal-title">
                        <h2>Edit User</h2>
                        <p>Update user information</p>
                    </div>
                    <button class="add-user-modal-close" id="close-edit-user-modal">
                        <i data-lucide="x"></i>
                    </button>
                </div>

                <div class="add-user-modal-content">
                    <form id="edit-user-form">
                        <div class="form-group">
                            <label for="edit-user-name" class="form-label">Full Name</label>
                            <input type="text" id="edit-user-name" class="form-input" value="${user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || ''}" required>
                        </div>

                        <div class="form-group">
                            <label for="edit-user-email" class="form-label">Email Address</label>
                            <input type="email" id="edit-user-email" class="form-input" value="${user.email}" required>
                        </div>

                        <div class="form-group">
                            <label for="edit-user-role" class="form-label">Role</label>
                            <select id="edit-user-role" class="form-select" required>
                                <option value="">Select role</option>
                                <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin</option>
                                <option value="user" ${user.role === 'user' ? 'selected' : ''}>User</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="edit-user-status" class="form-label">Status</label>
                            <select id="edit-user-status" class="form-select" required>
                                <option value="active" ${user.status === 'active' ? 'selected' : ''}>Active</option>
                                <option value="inactive" ${user.status === 'inactive' ? 'selected' : ''}>Inactive</option>
                            </select>
                        </div>

                    </form>
                </div>

                <div class="add-user-modal-footer">
                    <button class="btn btn-secondary" id="cancel-edit-user-btn">Cancel</button>
                    <button class="btn btn-primary" id="update-user-btn">
                        <i data-lucide="save"></i>
                        Update User
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Initialize edit user modal
     */
    initializeEditUserModal(userId) {
        const cancelBtn = document.getElementById('cancel-edit-user-btn');
        const updateBtn = document.getElementById('update-user-btn');
        const closeBtn = document.getElementById('close-edit-user-modal');
        

        if (cancelBtn) {
            cancelBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeEditUserModal();
            });
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeEditUserModal();
            });
        }

        if (updateBtn) {
            updateBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.updateUser(userId);
            });
        }

        const overlay = document.querySelector('.add-user-modal-overlay');
        if (overlay) {
            overlay.addEventListener('click', (e) => {
                if (e.target.classList.contains('add-user-modal-overlay')) {
                    this.closeEditUserModal();
                }
            });
        }

        const handleKeydown = (e) => {
            if (e.key === 'Escape') {
                this.closeEditUserModal();
                document.removeEventListener('keydown', handleKeydown);
            }
        };
        document.addEventListener('keydown', handleKeydown);
    }

    /**
     * Update user
     */
    async updateUser(userId) {
        const name = document.getElementById('edit-user-name').value.trim();
        const email = document.getElementById('edit-user-email').value.trim();
        const role = document.getElementById('edit-user-role').value;
        const status = document.getElementById('edit-user-status').value;
        const passwordField = document.getElementById('edit-user-password');
        const password = passwordField ? passwordField.value : '';
        

        // Validation
        if (!name || !email || !role || !status) {
            this.notificationManager.error('Validation Error', 'Please fill in all required fields');
            return;
        }

        // Show loading state
        const updateBtn = document.getElementById('update-user-btn');
        const originalHTML = updateBtn.innerHTML;
        updateBtn.innerHTML = '<i data-lucide="loader-2" class="animate-spin"></i> Updating...';
        updateBtn.disabled = true;
        
        // Reinitialize Lucide icons for the spinner
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        try {
            const token = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
            
            if (!token) {
                this.notificationManager.error('Authentication Error', 'Authentication required');
                updateBtn.innerHTML = '<i data-lucide="save"></i> Update User';
                updateBtn.disabled = false;
                return;
            }

            const response = await fetch(`/api/admin/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name,
                    email,
                    role,
                    status,
                    password: password || undefined
                })
            });

            const data = await response.json();


            if (response.ok && data.success) {
                
                // Update user in local data
                const userIndex = this.users.findIndex(u => u.id == userId);
                if (userIndex !== -1) {
                    this.users[userIndex] = data.user;
                }

                // Update allUsers if it exists
                if (this.allUsers) {
                    const allUserIndex = this.allUsers.findIndex(u => u.id == userId);
                    if (allUserIndex !== -1) {
                        this.allUsers[allUserIndex] = data.user;
                    }
                }

                this.notificationManager.success('User Updated', 'User has been updated successfully');
                this.closeEditUserModal();
                this.renderUsersTable();
            } else {
                console.error('Update failed:', data.message);
                this.notificationManager.error('Update User Failed', data.message || 'Failed to update user');
                updateBtn.innerHTML = originalHTML;
                updateBtn.disabled = false;
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
            }
        } catch (error) {
            console.error('Error updating user:', error);
            console.error('Error details:', error.message, error.stack);
            this.notificationManager.error('Update User Failed', 'Failed to update user');
            updateBtn.innerHTML = originalHTML;
            updateBtn.disabled = false;
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }
    }

    /**
     * Close edit user modal
     */
    closeEditUserModal() {
        const modal = document.querySelector('.add-user-modal-overlay');
        if (modal) {
            modal.remove();
        } else {
            console.warn('❌ Modal not found in DOM');
        }
    }

    /**
     * Delete user
     */
    deleteUser(userId) {
        const user = this.users.find(u => u.id == userId);
        if (!user) {
            this.notificationManager.error('User Not Found', 'User not found');
            return;
        }

        this.showDeleteUserConfirmation(user);
    }

    /**
     * Show delete user confirmation
     */
    showDeleteUserConfirmation(user) {
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'delete-confirmation-overlay';
        modalOverlay.innerHTML = `
            <div class="delete-confirmation-modal">
                <div class="modal-header">
                    <div class="modal-icon">
                        <i data-lucide="alert-triangle"></i>
                    </div>
                    <h3>Delete User</h3>
                </div>
                <div class="modal-content">
                    <p>Are you sure you want to delete <strong>${user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'this user'}</strong>?</p>
                    <p class="warning-text">This action cannot be undone and will permanently remove the user from the system.</p>
                </div>
                <div class="modal-actions">
                    <button class="btn btn-secondary" id="cancel-delete-user">Cancel</button>
                    <button class="btn btn-danger" id="confirm-delete-user">Delete User</button>
                </div>
            </div>
        `;

        document.body.appendChild(modalOverlay);

        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        // Event listeners
        document.getElementById('cancel-delete-user').addEventListener('click', () => {
            modalOverlay.remove();
        });

        document.getElementById('confirm-delete-user').addEventListener('click', () => {
            this.confirmDeleteUser(user.id);
            modalOverlay.remove();
        });

        modalOverlay.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-confirmation-overlay')) {
                modalOverlay.remove();
            }
        });
    }

    /**
     * Confirm delete user
     */
    async confirmDeleteUser(userId) {
        try {
            const token = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
            
            if (!token) {
                this.notificationManager.error('Authentication Error', 'Authentication required');
                return;
            }

            // Show loading state
            this.notificationManager.info('Deleting User', 'Please wait while we delete the user...');

            const response = await fetch(`/api/admin/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Remove user from local data
                this.users = this.users.filter(u => u.id != userId);
                
                if (this.allUsers) {
                    this.allUsers = this.allUsers.filter(u => u.id != userId);
                }

                this.notificationManager.success('User Deleted', 'User has been deleted successfully');
                this.renderUsersTable();
            } else {
                this.notificationManager.error('Delete User Failed', data.message || 'Failed to delete user');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            this.notificationManager.error('Delete User Failed', 'Failed to delete user');
        }
    }

    /**
     * Show success message (deprecated - use notificationManager instead)
     */
    showSuccessMessage(message) {
        this.notificationManager.success('Success', message);
    }

    /**
     * Update navigation state
     */
    updateNavigation() {
        // Remove active class from all nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to users link
        const usersLink = document.querySelector('[data-section="users"]');
        if (usersLink) {
            usersLink.classList.add('active');
        }
    }

    /**
     * Show error message (deprecated - use notificationManager instead)
     */
    showError(message) {
        this.notificationManager.error('Error', message);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.usersManager = new UsersManager();
});
