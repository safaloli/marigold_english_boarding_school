// Admin Panel JavaScript - Marigold School

class AdminPanel {
    constructor() {
        this.currentSection = 'dashboard';
        this.currentTheme = localStorage.getItem('admin-theme') || 'light';
        this.token = localStorage.getItem('adminToken');
        this.user = JSON.parse(localStorage.getItem('adminUser') || '{}');
        this.isAuthenticated = false;
        this.init();
    }

    async init() {
        // Check authentication first
        if (!await this.checkAuth()) {
            return;
        }
        
        // Set dashboard as default active section if no section is active
        this.setDefaultSection();
        
        this.initializeElements();
        this.bindEvents();
        
        // Initialize sidebar state based on screen size
        this.initializeSidebarState();
        
        // Ensure Lucide is loaded before initializing icons
        this.ensureLucideLoaded().then(() => {
            this.initializeLucideIcons();
        });
        
        // Initialize dashboard manager after admin panel is ready
        this.initializeDashboardLoader();
        this.applyTheme();
        this.updateUserInfo();
        this.updateSidebarSchoolName(); // Load and display school name from settings
        this.initializeUserDropdown();
        
        // Update request badges
        this.updateRequestBadges();
    }

    async checkAuth() {
        console.log('🔍 ADMIN PANEL: Starting authentication check...');
        
        if (!this.token) {
            console.log('❌ ADMIN PANEL: No token found, redirecting to login');
            console.log('🔄 ADMIN PANEL: About to redirect to /admin/login');
            window.location.href = '/admin/login?from=admin';
            return false;
        }

        console.log('🔑 ADMIN PANEL: Token exists, making auth request to /api/auth/me');

        try {
            const response = await fetch('/api/auth/me', {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            if (!response.ok) {
                // Handle rate limiting specifically
                if (response.status === 429) {
                    console.warn('⚠️ ADMIN PANEL: Rate limit exceeded for auth endpoint. Using cached user data.');
                    // Use cached user data instead of redirecting
                    const cachedUser = localStorage.getItem('adminUser');
                    if (cachedUser) {
                        this.user = JSON.parse(cachedUser);
                        this.isAuthenticated = true;
                        console.log('✅ ADMIN PANEL: Using cached user data due to rate limiting');
                        return true;
                    }
                    // If no cached user, still redirect to login
                    console.log('❌ ADMIN PANEL: No cached user data, redirecting to login');
                } else {
                    console.log('❌ ADMIN PANEL: Token invalid, clearing storage and redirecting to login');
                }

                // Token is invalid, redirect to login with from parameter
                localStorage.removeItem('adminToken');
                localStorage.removeItem('adminUser');
                console.log('🔄 ADMIN PANEL: About to redirect to /admin/login');
                window.location.href = '/admin/login?from=admin';
                return false;
            }

            // Authentication successful
            this.isAuthenticated = true;
            return true;
        } catch (error) {
            console.error('💥 ADMIN PANEL: Auth check error:', error);
            
            // Handle rate limiting in catch block as well
            if (error.message && error.message.includes('429')) {
                console.warn('⚠️ ADMIN PANEL: Rate limit exceeded for auth endpoint. Using cached user data.');
                const cachedUser = localStorage.getItem('adminUser');
                if (cachedUser) {
                    this.user = JSON.parse(cachedUser);
                    this.isAuthenticated = true;
                    console.log('✅ ADMIN PANEL: Using cached user data due to rate limiting error');
                    return true;
                }
            }
            
            // Clear invalid token and redirect to login with from parameter
            console.log('❌ ADMIN PANEL: Clearing invalid token and redirecting to login');
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminUser');
            console.log('🔄 ADMIN PANEL: About to redirect to /admin/login');
            window.location.href = '/admin/login?from=admin';
            return false;
        }
    }

    updateUserInfo() {
        const userProfile = document.querySelector('.user-profile');
        if (userProfile && this.user) {
            const userName = userProfile.querySelector('h4');
            const userRole = userProfile.querySelector('p');
            
            if (userName && (this.user.firstName || this.user.first_name)) {
                const firstName = this.user.firstName || this.user.first_name;
                const lastName = this.user.lastName || this.user.last_name;
                const fullName = `${firstName} ${lastName || ''}`.trim();
                userName.textContent = fullName;
                
                // Remove loading class
                userName.classList.remove('loading-text');
            }
            
            if (userRole && this.user.role) {
                const roleText = this.user.role === 'ADMIN' ? 'Administrator' : 'User';
                userRole.textContent = roleText;
                
                // Remove loading class
                userRole.classList.remove('loading-text');
            }

            // Update avatar with user's first letter
            this.updateUserAvatar();
        }
    }

    /**
     * Update sidebar school name from GeneralSettings
     */
    async updateSidebarSchoolName() {
        try {
            const response = await fetch('/api/admin/settings', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                const sidebarSchoolName = document.getElementById('sidebar-school-name');
                
                if (sidebarSchoolName && data && data.siteName) {
                    // Update the sidebar school name with data from GeneralSettings
                    // Extract only the first word for sidebar display
                    const firstName = data.siteName.split(' ')[0];
                    sidebarSchoolName.textContent = firstName;
                } else if (sidebarSchoolName) {
                    // Fallback to default if no siteName in settings
                    console.log('⚠️ No siteName found in settings, using default');
                }

                // Update favicon in sidebar
                const sidebarFavicon = document.getElementById('sidebar-favicon');
                const sidebarLogoFallback = document.getElementById('sidebar-logo-fallback');
                
                if (sidebarFavicon && sidebarLogoFallback) {
                    if (data && data.siteFavicon) {
                        // Show favicon, hide SVG fallback
                        sidebarFavicon.src = data.siteFavicon;
                        sidebarFavicon.style.display = 'block';
                        sidebarLogoFallback.style.display = 'none';
                        
                        // Add error handler to fallback to SVG if image fails to load
                        sidebarFavicon.onerror = function() {
                            sidebarFavicon.style.display = 'none';
                            sidebarLogoFallback.style.display = 'block';
                        };
                    } else {
                        // Show SVG fallback, hide favicon
                        sidebarFavicon.style.display = 'none';
                        sidebarLogoFallback.style.display = 'block';
                    }
                }
            }
        } catch (error) {
            console.error('❌ Error updating sidebar school name:', error);
            // Keep the default "Marigold" if there's an error
        }
    }

    /**
     * Update user avatar with initial
     */
    updateUserAvatar() {
        if (!this.user || (!this.user.firstName && !this.user.first_name)) {
            return;
        }

        const avatarImg = document.querySelector('.user-profile .user-avatar img');
        
        if (avatarImg) {
            // Create a simple avatar with user's initial
            const firstName = this.user.firstName || this.user.first_name;
            const initial = firstName.charAt(0).toUpperCase();
            
            avatarImg.style.display = 'none';
            
            // Get or create avatar placeholder
            let avatarPlaceholder = document.querySelector('.user-profile .user-avatar .avatar-placeholder');
            if (!avatarPlaceholder) {
                avatarPlaceholder = document.createElement('div');
                avatarPlaceholder.className = 'avatar-placeholder';
                avatarPlaceholder.style.cssText = `
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: 600;
                    font-size: 16px;
                `;
                avatarImg.parentNode.insertBefore(avatarPlaceholder, avatarImg);
            }
            
            // Remove loading classes and update content
            avatarPlaceholder.classList.remove('loading-placeholder');
            avatarPlaceholder.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            avatarPlaceholder.style.color = 'white';
            avatarPlaceholder.textContent = initial;
            
            // Remove loading dot if it exists
            const loadingDot = avatarPlaceholder.querySelector('.loading-dot');
            if (loadingDot) {
                loadingDot.remove();
            }
        }
    }

    /**
     * Update request badges with pending counts
     */
    async updateRequestBadges() {
        try {
            // Fetch admission requests pending count
            const admissionResponse = await fetch('/api/admission/applications', {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });
            
            if (admissionResponse.ok) {
                const admissionData = await admissionResponse.json();
                const pendingAdmissions = admissionData.applications.filter(app => 
                    app.status.toLowerCase() === 'pending'
                ).length;
                
                this.updateBadge('admission-badge', pendingAdmissions);
            }

            // Fetch contact requests pending count
            const contactResponse = await fetch('/api/admin/contact-requests?limit=1', {
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (contactResponse.ok) {
                const contactData = await contactResponse.json();
                console.log('📊 Contact Requests API Response:', contactData);
                console.log('📊 Stats from API:', contactData.stats);
                const pendingContacts = contactData.stats?.pending || 0;
                console.log('📊 Pending count:', pendingContacts);
                
                this.updateBadge('contact-badge', pendingContacts);
            }
        } catch (error) {
            console.error('Error updating request badges:', error);
        }
    }

    /**
     * Update a specific badge with count
     */
    updateBadge(badgeId, count) {
        const badge = document.getElementById(badgeId);
        console.log(`🔔 updateBadge called: ${badgeId} = ${count}`);
        if (badge) {
            if (count > 0) {
                badge.textContent = count;
                badge.style.display = '';
                console.log(`✅ Badge updated: ${badgeId} now shows ${count}`);
            } else {
                badge.style.display = 'none';
                console.log(`✅ Badge hidden: ${badgeId}`);
            }
        } else {
            console.error(`❌ Badge element not found: ${badgeId}`);
        }
    }

    updateTopBarTitle(section){
        const title = document.getElementById('pageTitle')
        title.textContent = section
    }

    initializeUserDropdown() {
        const userProfileToggle = document.getElementById('userProfileToggle');
        const userDropdownMenu = document.getElementById('userDropdownMenu');
        const userProfileDropdown = document.querySelector('.user-profile-dropdown');

        if (userProfileToggle && userDropdownMenu) {
            // Update user profile with actual data
            this.updateUserProfile();

            // Toggle dropdown on click
            userProfileToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                userProfileDropdown.classList.toggle('active');
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!userProfileDropdown.contains(e.target)) {
                    userProfileDropdown.classList.remove('active');
                }
            });

            // Handle dropdown item clicks
            const changePasswordBtn = document.getElementById('changePasswordDropdownBtn');
            const logoutBtn = document.getElementById('logoutDropdownBtn');

            if (changePasswordBtn) {
                changePasswordBtn.addEventListener('click', () => {
                    // Use the change password manager
                    if (window.changePasswordLoader) {
                        window.changePasswordLoader.loadChangePassword();
                    } else {
                        this.showChangePasswordModal();
                    }
                    userProfileDropdown.classList.remove('active');
                    
                    // Close mobile sidebar on mobile view
                    if (window.innerWidth <= 1023) {
                        this.sidebar.classList.remove('mobile-open');
                    }
                });
            }

            if (logoutBtn) {
                logoutBtn.addEventListener('click', () => {
                    this.showLogoutConfirmation();
                    
                    // Close mobile sidebar on mobile view
                    if (window.innerWidth <= 1023) {
                        this.sidebar.classList.remove('mobile-open');
                    }
                });
            }
        }
    }

    /**
     * Update user profile dropdown with actual user data
     */
    updateUserProfile() {
        // Force refresh user data from localStorage
        this.user = JSON.parse(localStorage.getItem('adminUser') || '{}');
        
        // Use the existing updateUserInfo method
        this.updateUserInfo();
        
        // Also try to update after a short delay in case data is still loading
        setTimeout(() => {
            this.user = JSON.parse(localStorage.getItem('adminUser') || '{}');
            this.updateUserInfo();
        }, 1000);
    }

    /**
     * Force update user profile (can be called from console for testing)
     */
    forceUpdateUserProfile() {
        this.updateUserProfile();
    }

    showChangePasswordModal() {
        // Create and show change password modal
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal">
                <div class="modal-header">
                    <h3>Change Password</h3>
                    <button class="modal-close" data-action="close-modal">
                        <i data-lucide="x"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <form id="changePasswordForm">
                        <div class="form-group">
                            <label for="currentPassword">Current Password</label>
                            <input type="password" id="currentPassword" required>
                        </div>
                        <div class="form-group">
                            <label for="newPassword">New Password</label>
                            <input type="password" id="newPassword" required>
                        </div>
                        <div class="form-group">
                            <label for="confirmPassword">Confirm New Password</label>
                            <input type="password" id="confirmPassword" required>
                        </div>
                        <div class="form-actions">
                            <button type="button" class="btn btn-outline" data-action="close-modal">Cancel</button>
                            <button type="submit" class="btn btn-primary">Change Password</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Initialize Lucide icons in the modal
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        // Attach modal close event listeners
        modal.addEventListener('click', (e) => {
            if (e.target.closest('[data-action="close-modal"]')) {
                modal.remove();
            }
        });

        // Handle form submission
        const form = modal.querySelector('#changePasswordForm');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const currentPassword = document.getElementById('currentPassword').value;
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (newPassword !== confirmPassword) {
                this.showToast('New passwords do not match', 'error');
                return;
            }

            try {
                const response = await this.authenticatedFetch('/api/auth/change-password', {
                    method: 'POST',
                    body: JSON.stringify({
                        currentPassword,
                        newPassword
                    })
                });

                if (response && response.ok) {
                    this.showToast('Password changed successfully', 'success');
                    modal.remove();
                } else {
                    this.showToast('Failed to change password', 'error');
                }
            } catch (error) {
                this.showToast('Error changing password', 'error');
                console.error('Change password error:', error);
            }
        });
    }

    showProfileModal() {
        // Implementation for profile modal
        this.showToast('Profile feature coming soon!', 'info');
    }

    showSettingsModal() {
        // Implementation for settings modal
        this.showToast('Settings feature coming soon!', 'info');
    }

    showLogoutConfirmation() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal logout-modal">
                <div class="modal-header">
                    <h3>Confirm Logout</h3>
                    <button class="modal-close" data-action="close-modal">
                        <i data-lucide="x"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="confirmation-content">
                        <div class="confirmation-text">
                            <p>Are you sure you want to logout?</p>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline" data-action="close-modal">Cancel</button>
                    <button type="button" class="btn btn-danger" data-action="confirm-logout">Logout</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        
        // Force the modal to be visible
        modal.style.display = 'flex';
        modal.style.opacity = '1';
        modal.style.visibility = 'visible';
        
        this.initializeLucideIcons();

        // Add event listeners
        const closeBtn = modal.querySelector('[data-action="close-modal"]');
        const cancelBtn = modal.querySelector('.btn-outline');
        const confirmBtn = modal.querySelector('[data-action="confirm-logout"]');

        const closeModal = () => {
            modal.remove();
        };

        closeBtn.addEventListener('click', closeModal);
        cancelBtn.addEventListener('click', closeModal);

        confirmBtn.addEventListener('click', () => {
            closeModal();
            this.handleLogout();
        });

        // Close on overlay click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        // Close on escape key
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
    }

    async handleLogout() {
        try {
            // Call logout API if available
            await fetch('/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });
        } catch (error) {
            console.error('Logout API error:', error);
        } finally {
            // Clear local storage and cookie
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminUser');
            
            // Clear admin token cookie
            document.cookie = 'adminToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
            
            window.location.href = '/admin/login';
        }
    }

    // Helper function for authenticated API calls
    async authenticatedFetch(url, options = {}) {
        const defaultOptions = {
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json',
                ...options.headers
            }
        };

        const response = await fetch(url, { ...defaultOptions, ...options });
        
        // If unauthorized, redirect to login
        if (response.status === 401) {
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminUser');
            window.location.href = '/admin/login';
            return null;
        }

        return response;
    }

    initializeElements() {
        // Sidebar elements
        this.sidebar = document.getElementById('sidebar');
        this.sidebarToggle = document.getElementById('sidebarToggle');
        
        
        // Navigation elements
        this.navLinks = document.querySelectorAll('.nav-link');
        this.contentSections = document.querySelectorAll('.content-section');
        
        // Action buttons
        this.addEventBtn = document.getElementById('addEventBtn');
        this.addGalleryBtn = document.getElementById('addGalleryBtn');
        this.addUserBtn = document.getElementById('addUserBtn');
        this.clearCacheBtn = document.getElementById('clearCacheBtn');
        this.logoutBtn = document.getElementById('logoutBtn');
        
        // Modal elements
        this.modalOverlay = document.getElementById('modalOverlay');
        this.modal = document.getElementById('modal');
        this.modalTitle = document.getElementById('modalTitle');
        this.modalBody = document.getElementById('modalBody');
        this.modalClose = document.getElementById('modalClose');
        
        // Toast container
        this.toastContainer = document.getElementById('toastContainer');
    }

    initializeSidebarState() {
        const isMobileView = window.innerWidth <= 1024;
        const toggleIcon = this.sidebarToggle?.querySelector('i');
        const desktopToggleBtn = document.getElementById('desktopSidebarToggle');
        const desktopToggleIcon = desktopToggleBtn?.querySelector('i');
        
        if (isMobileView) {
            // On mobile: sidebar should be closed by default
            this.sidebar?.classList.remove('mobile-open');
            this.sidebar?.classList.remove('collapsed');
            if (toggleIcon) {
                toggleIcon.setAttribute('data-lucide', 'menu');
            }
            if (this.sidebarToggle) {
                this.sidebarToggle.setAttribute('data-tooltip', 'Open Menu');
            }
        } else {
            // On desktop: sidebar should be open by default
            this.sidebar?.classList.remove('mobile-open');
            this.sidebar?.classList.remove('collapsed');
            if (toggleIcon) {
                toggleIcon.setAttribute('data-lucide', 'x');
            }
            if (this.sidebarToggle) {
                this.sidebarToggle.setAttribute('data-tooltip', 'Collapse Sidebar');
            }
            // Initialize desktop toggle button
            if (desktopToggleIcon) {
                desktopToggleIcon.setAttribute('data-lucide', 'panel-left-close');
            }
            if (desktopToggleBtn) {
                desktopToggleBtn.setAttribute('title', 'Collapse Sidebar');
            }
        }
    }

    bindEvents() {
        // Sidebar toggle
        this.sidebarToggle?.addEventListener('click', () => this.toggleSidebar());
        
        // Mobile sidebar toggle
        const mobileSidebarToggle = document.getElementById('mobileSidebarToggle');
        if (mobileSidebarToggle) {
            mobileSidebarToggle.addEventListener('click', () => this.toggleMobileMenu());
        }
        
        // Desktop sidebar toggle in header
        const desktopSidebarToggle = document.getElementById('desktopSidebarToggle');
        if (desktopSidebarToggle) {
            desktopSidebarToggle.addEventListener('click', () => this.toggleDesktopSidebar());
        }
        
        // Tooltip positioning for nav links
        this.setupTooltipPositioning();
        
        // Navigation
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.getAttribute('data-section');
                this.navigateToSection(section);
                this.updateTopBarTitle(section.split('-')[0].toUpperCase())
                
                // Close mobile sidebar on mobile view
                if (window.innerWidth <= 1023) {
                    this.sidebar.classList.remove('mobile-open');
                }
            });
        });
        
        // Modal events
        this.modalClose?.addEventListener('click', () => this.closeModal());
        this.modalOverlay?.addEventListener('click', (e) => {
            if (e.target === this.modalOverlay) this.closeModal();
        });
        
        // Action buttons
        this.addEventBtn?.addEventListener('click', () => this.showAddEventModal());
        this.addGalleryBtn?.addEventListener('click', () => this.showAddGalleryModal());
        this.addUserBtn?.addEventListener('click', () => this.showAddUserModal());
        this.clearCacheBtn?.addEventListener('click', () => this.clearCache());
        this.logoutBtn?.addEventListener('click', () => this.showLogoutConfirmation());
        
        // Content management events
        this.bindContentEvents();
        
        // Keyboard events
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
                // Close mobile menu on Escape key
                if (window.innerWidth <= 1024 && this.sidebar.classList.contains('mobile-open')) {
                    this.sidebar.classList.remove('mobile-open');
                }
            }
        });

        // Window resize handler to manage sidebar state
        window.addEventListener('resize', () => {
            const isMobileView = window.innerWidth <= 1024;
            
            // Update toggle icon and tooltip based on current state
            const toggleIcon = this.sidebarToggle?.querySelector('i');
            if (toggleIcon) {
                if (isMobileView) {
                    // Mobile view: show correct icon and tooltip based on mobile-open state
                    if (this.sidebar.classList.contains('mobile-open')) {
                        toggleIcon.setAttribute('data-lucide', 'x');
                        this.sidebarToggle.setAttribute('data-tooltip', 'Close Menu');
                    } else {
                        toggleIcon.setAttribute('data-lucide', 'menu');
                        this.sidebarToggle.setAttribute('data-tooltip', 'Open Menu');
                    }
                } else {
                    // Desktop view: show correct icon and tooltip based on collapsed state
                    if (this.sidebar.classList.contains('collapsed')) {
                        toggleIcon.setAttribute('data-lucide', 'menu');
                        this.sidebarToggle.setAttribute('data-tooltip', 'Expand Sidebar');
                    } else {
                        toggleIcon.setAttribute('data-lucide', 'x');
                        this.sidebarToggle.setAttribute('data-tooltip', 'Collapse Sidebar');
                    }
                }
                this.initializeLucideIcons();
            }
        });

        // Click outside sidebar to close on mobile
        document.addEventListener('click', (e) => {
            const isMobileView = window.innerWidth <= 1024;
            if (isMobileView && this.sidebar.classList.contains('mobile-open')) {
                // Check if click is outside sidebar and not on toggle buttons
                const isClickInsideSidebar = this.sidebar.contains(e.target);
                const isClickOnToggle = e.target.closest('#sidebarToggle');
                const isClickOnDesktopToggle = e.target.closest('#desktopSidebarToggle');
                const isClickOnMobileToggle = e.target.closest('#mobileSidebarToggle');
                
                if (!isClickInsideSidebar && !isClickOnToggle && !isClickOnDesktopToggle && !isClickOnMobileToggle) {
                    this.sidebar.classList.remove('mobile-open');
                }
            }
        });

        // Global event delegation for table action buttons
        document.addEventListener('click', (e) => {
            const action = e.target.closest('[data-action]')?.getAttribute('data-action');
            if (!action) return;

            switch (action) {
                case 'edit-event':
                    const eventId = e.target.closest('[data-event-id]')?.getAttribute('data-event-id');
                    if (eventId) this.editEvent(eventId);
                    break;
                case 'delete-event':
                    const deleteEventId = e.target.closest('[data-event-id]')?.getAttribute('data-event-id');
                    if (deleteEventId) this.deleteEvent(deleteEventId);
                    break;
                case 'edit-gallery':
                    const galleryId = e.target.closest('[data-gallery-id]')?.getAttribute('data-gallery-id');
                    if (galleryId) this.editGalleryItem(galleryId);
                    break;
                case 'delete-gallery':
                    const deleteGalleryId = e.target.closest('[data-gallery-id]')?.getAttribute('data-gallery-id');
                    if (deleteGalleryId) this.deleteGalleryItem(deleteGalleryId);
                    break;
                case 'remove-item':
                    const itemToRemove = e.target.closest('.edit-item, .feature-item, .highlight-item, .timeline-item, .team-item, .level-item, .activity-item, .link-item, .curriculum-item, .method-item, .achievement-item, .faq-item');
                    if (itemToRemove) {
                        itemToRemove.remove();
                    }
                    break;
            }
        });
    }

    initializeLucideIcons() {
        try {
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
                
                // Force re-render of icons in sidebar
                const sidebarIcons = this.sidebar.querySelectorAll('[data-lucide]');
                
                // Ensure icons are visible
                sidebarIcons.forEach(icon => {
                    const svg = icon.querySelector('svg');
                    if (svg) {
                        svg.style.display = 'block';
                        svg.style.width = '20px';
                        svg.style.height = '20px';
                    }
                });
            } else {
                console.warn('⚠️ Lucide library not loaded yet, retrying...');
                // Retry after a short delay
                setTimeout(() => {
                    if (typeof lucide !== 'undefined') {
                        lucide.createIcons();
                        console.log('✅ Lucide icons initialized on retry');
                    } else {
                        console.error('❌ Failed to load Lucide library after retry');
                        // Try to load Lucide manually
                        this.loadLucideManually();
                    }
                }, 200);
            }
        } catch (error) {
            console.error('❌ Error initializing Lucide icons:', error);
        }
    }

    async ensureLucideLoaded() {
        return new Promise((resolve) => {
            if (typeof lucide !== 'undefined') {
                resolve();
                return;
            }
            
            console.log('🔄 Waiting for Lucide to load...');
            let attempts = 0;
            const maxAttempts = 10;
            
            const checkLucide = () => {
                attempts++;
                if (typeof lucide !== 'undefined') {
                    console.log('✅ Lucide loaded after waiting');
                    resolve();
                } else if (attempts >= maxAttempts) {
                    console.warn('⚠️ Lucide not loaded after waiting, proceeding anyway');
                    resolve();
                } else {
                    setTimeout(checkLucide, 100);
                }
            };
            
            checkLucide();
        });
    }

    loadLucideManually() {
        console.log('🔄 Attempting to load Lucide manually...');
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/lucide@latest/dist/umd/lucide.js';
        script.onload = () => {
            console.log('✅ Lucide loaded manually');
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        };
        script.onerror = () => {
            console.error('❌ Failed to load Lucide from unpkg, trying jsdelivr...');
            const script2 = document.createElement('script');
            script2.src = 'https://cdn.jsdelivr.net/npm/lucide@latest/dist/umd/lucide.js';
            script2.onload = () => {
                console.log('✅ Lucide loaded from jsdelivr');
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
            };
            script2.onerror = () => {
                console.error('❌ Failed to load Lucide from all sources');
            };
            document.head.appendChild(script2);
        };
        document.head.appendChild(script);
    }

    toggleSidebar() {
        // Check if screen is mobile/tablet (below 1024px) or desktop
        const isMobileView = window.innerWidth <= 1024;
        
        console.log('🔄 Toggle Sidebar');
        console.log('   Screen Width:', window.innerWidth);
        console.log('   Is Mobile View:', isMobileView);
        
        if (isMobileView) {
            // On mobile/tablet: toggle mobile-open class
            this.sidebar.classList.toggle('mobile-open');
            console.log('   Mobile Mode: Toggled mobile-open class');
        } else {
            // On desktop: toggle collapsed class
            this.sidebar.classList.toggle('collapsed');
            console.log('   Desktop Mode: Toggled collapsed class');
        }
        
        console.log('   Sidebar Classes:', this.sidebar.className);
        console.log('   Has collapsed class:', this.sidebar.classList.contains('collapsed'));
        
        // Update the toggle button icon and tooltip based on sidebar state
        const toggleIcon = this.sidebarToggle.querySelector('i');
        if (toggleIcon) {
            if (isMobileView) {
                // For mobile: show menu icon when closed, x when open
                if (this.sidebar.classList.contains('mobile-open')) {
                    toggleIcon.setAttribute('data-lucide', 'x');
                    this.sidebarToggle.setAttribute('data-tooltip', 'Close Menu');
                } else {
                    toggleIcon.setAttribute('data-lucide', 'menu');
                    this.sidebarToggle.setAttribute('data-tooltip', 'Open Menu');
                }
            } else {
                // For desktop: show menu icon when collapsed, x when expanded
                if (this.sidebar.classList.contains('collapsed')) {
                    toggleIcon.setAttribute('data-lucide', 'menu');
                    this.sidebarToggle.setAttribute('data-tooltip', 'Expand Sidebar');
                    console.log('   ✅ Sidebar is COLLAPSED - Tooltips should work now!');
                } else {
                    toggleIcon.setAttribute('data-lucide', 'x');
                    this.sidebarToggle.setAttribute('data-tooltip', 'Collapse Sidebar');
                    console.log('   ℹ️ Sidebar is EXPANDED - Tooltips will not show (text is visible)');
                }
            }
        }
        
        // Reinitialize all Lucide icons in the sidebar after transition
        setTimeout(() => {
            this.initializeLucideIcons();
            
            // Debug: Check if icons are visible
            const navIcons = this.sidebar.querySelectorAll('.nav-link i');
            navIcons.forEach((icon, index) => {
                // Debug code if needed
            });
        }, 300); // Increased timeout to wait for CSS transition
    }

    toggleMobileMenu() {
        this.sidebar.classList.toggle('mobile-open');
        
        // Update the mobile toggle button icon
        const mobileToggleBtn = document.getElementById('mobileSidebarToggle');
        const mobileToggleIcon = mobileToggleBtn?.querySelector('i');
        
        if (mobileToggleIcon) {
            if (this.sidebar.classList.contains('mobile-open')) {
                mobileToggleIcon.setAttribute('data-lucide', 'x');
                mobileToggleBtn.setAttribute('title', 'Close Menu');
            } else {
                mobileToggleIcon.setAttribute('data-lucide', 'menu');
                mobileToggleBtn.setAttribute('title', 'Open Menu');
            }
            // Re-initialize Lucide icons
            this.initializeLucideIcons();
        }
        
        // Close mobile menu when clicking on a nav link
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.sidebar.classList.remove('mobile-open');
            });
        });
    }

    toggleDesktopSidebar() {
        const isMobileView = window.innerWidth <= 1023;
        const toggleBtn = document.getElementById('desktopSidebarToggle');
        const toggleIcon = toggleBtn?.querySelector('i');
        
        if (isMobileView) {
            // On mobile/tablet (≤ 1023px): toggle mobile-open class
            // Remove collapsed class if present (from desktop view)
            this.sidebar.classList.remove('collapsed');
            this.sidebar.classList.toggle('mobile-open');
            
            // Update icon based on mobile-open state
            if (toggleIcon) {
                if (this.sidebar.classList.contains('mobile-open')) {
                    toggleIcon.setAttribute('data-lucide', 'panel-left-open');
                    toggleBtn.setAttribute('title', 'Close Sidebar');
                } else {
                    toggleIcon.setAttribute('data-lucide', 'panel-left-close');
                    toggleBtn.setAttribute('title', 'Open Sidebar');
                }
                // Re-initialize Lucide icons
                this.initializeLucideIcons();
            }
        } else {
            // On desktop (> 1023px): toggle collapsed class
            // Remove mobile-open class if present (from mobile view)
            this.sidebar.classList.remove('mobile-open');
            this.sidebar.classList.toggle('collapsed');
            
            // Update icon based on collapsed state
            if (toggleIcon) {
                if (this.sidebar.classList.contains('collapsed')) {
                    toggleIcon.setAttribute('data-lucide', 'panel-left-open');
                    toggleBtn.setAttribute('title', 'Expand Sidebar');
                } else {
                    toggleIcon.setAttribute('data-lucide', 'panel-left-close');
                    toggleBtn.setAttribute('title', 'Collapse Sidebar');
                }
                // Re-initialize Lucide icons
                this.initializeLucideIcons();
            }
        }
    }

    setupTooltipPositioning() {
        // Create tooltip element as a real DOM element (not pseudo-element)
        const tooltip = document.createElement('div');
        tooltip.id = 'nav-tooltip';
        tooltip.style.cssText = `
            position: fixed;
            background: #1a202c;
            color: #ffffff;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 13px;
            font-weight: 500;
            white-space: nowrap;
            opacity: 0;
            visibility: hidden;
            pointer-events: none;
            transition: opacity 0.2s ease, visibility 0.2s ease;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        `;
        document.body.appendChild(tooltip);
        
        // Show/hide tooltip on hover
        this.navLinks.forEach(link => {
            link.addEventListener('mouseenter', (e) => {
                if (!this.sidebar.classList.contains('collapsed')) return;
                
                const tooltipText = link.getAttribute('data-tooltip');
                if (!tooltipText) return;
                
                const rect = link.getBoundingClientRect();
                const left = rect.right + 12;
                const top = rect.top + (rect.height / 2);
                
                tooltip.textContent = tooltipText;
                tooltip.style.left = left + 'px';
                tooltip.style.top = top + 'px';
                tooltip.style.transform = 'translateY(-50%)';
                tooltip.style.opacity = '1';
                tooltip.style.visibility = 'visible';
                
                console.log('✅ Tooltip shown:', tooltipText, 'at', left, top);
            });
            
            link.addEventListener('mouseleave', () => {
                tooltip.style.opacity = '0';
                tooltip.style.visibility = 'hidden';
            });
        });
        
        // Also hide on scroll
        this.sidebar.addEventListener('scroll', () => {
            tooltip.style.opacity = '0';
            tooltip.style.visibility = 'hidden';
        });
    }

    /**
     * Set default section (dashboard) when page loads
     */
    setDefaultSection() {
        // Check if any section is currently active
        const activeSection = document.querySelector('.content-section.active');
        const activeNavLink = document.querySelector('.nav-link.active');
        
        // If no section is active, set dashboard as default
        if (!activeSection && !activeNavLink) {
            // Don't call navigateToSection here, let dashboard manager handle it
        }
    }

    /**
     * Initialize dashboard manager
     */
    initializeDashboardLoader() {
        // Check if dashboard loader is ready
        if (window.dashboardLoader) {
            window.dashboardLoader.loadDashboard();
        }
    }

    navigateToSection(section) {
        // Handle dynamic sections with their respective managers
        if (section === 'dashboard' && window.dashboardLoader) {
            window.dashboardLoader.loadDashboard();
            this.currentSection = section;
            return;
        }
        
        if (section === 'analytics' && window.analyticsLoader) {
            window.analyticsLoader.loadAnalytics();
            this.currentSection = section;
            return;
        }
        
        if (section === 'admission-requests' && window.admissionRequestsManager) {
            window.admissionRequestsManager.loadAdmissionRequests();
            this.currentSection = section;
            // Update badges when viewing admission requests
            this.updateRequestBadges();
            return;
        }
        
        if (section === 'events' && window.eventsLoader) {
            window.eventsLoader.loadEvents();
            this.currentSection = section;
            return;
        }
        
        
        if (section === 'gallery' && window.galleryLoader) {
            // Check if we're in homepage content management
            const pageContent = document.getElementById('pageContent');
            if (pageContent && pageContent.innerHTML.includes('home-content-section')) {
                return; // Don't handle gallery clicks in homepage content management
            }
            window.galleryLoader.loadGallery();
            this.currentSection = section;
            return;
        }
        
        if (section === 'downloads' && window.downloadsContentManager) {
            window.downloadsContentManager.loadDownloadsContent();
            this.currentSection = section;            
            return;
        }

        if (section === 'users' && window.usersLoader) {
            window.usersLoader.loadUsers();
            this.currentSection = section;
            return;
        }
        
        if (section === 'change-password' && window.changePasswordLoader) {
            window.changePasswordLoader.loadChangePassword();
            this.currentSection = section;
            return;
        }
        
        
        if (section === 'website-settings' && window.websiteSettingsLoader) {
            window.websiteSettingsLoader.loadWebsiteSettings();
            this.currentSection = section;
            return;
        }
        
        
        // Handle content sections (homepage, about, academics, contact)
        if (section === 'home-content' && window.homepageContentLoader) {
            window.homepageContentLoader.loadHomepageContent();
            this.currentSection = section;
            return;
        }
        
        if (section === 'contact-content' && window.contactContentLoader) {
            window.contactContentLoader.loadContactContent();
            this.currentSection = section;
            return;
        }
        
        if (section === 'about-content' && window.aboutContentManager) {
            window.aboutContentManager.loadAboutContent();
            this.currentSection = section;
            return;
        }
        
        if (section === 'academics-content' && window.academicsContentLoader) {
            window.academicsContentLoader.loadAcademicsContent();
            this.currentSection = section;
            return;
        }
        
        if (section === 'contact-content' && window.contactContentLoader) {
            window.contactContentLoader.loadContactContent();
            this.currentSection = section;
            return;
        }
        
        // Fallback to static navigation for other sections
        this.navLinks.forEach(link => link.classList.remove('active'));
        document.querySelector(`[data-section="${section}"]`)?.classList.add('active');
        
        this.contentSections.forEach(sectionEl => sectionEl.classList.remove('active'));
        document.getElementById(`${section}-section`)?.classList.add('active');
        
        this.updatePageTitle(section);
        this.loadSectionData(section);
        this.currentSection = section;
    }

    updatePageTitle(section) {
        const titles = {
            'dashboard': 'Dashboard',
            'analytics': 'Analytics',
            'admission-requests': 'Admission Requests',
            'contact-requests': 'Contact Requests',
            'home-content': 'Homepage Content',
            'about-content': 'About Page Content',
            'academics-content': 'Academics Content',
            'contact-content': 'Contact Content',
            'events-content': 'Events & Notices',
            'events': 'Events Management',
            'gallery': 'Gallery',
            'users': 'User Management',
            'change-password': 'Change Password',
            'website-settings': 'Website Settings',
        };

        // Update page title in header (h2.page-title)
        const pageTitle = document.querySelector('.page-title');
        if (pageTitle) {
            pageTitle.textContent = titles[section] || 'Admin Panel';
        }
        
        // Also update browser title
        document.title = `${titles[section] || 'Admin Panel'} - Marigold School`;
    }

    loadSectionData(section) {
        switch (section) {
            case 'dashboard':
                this.loadDashboard();
                break;
            case 'home-content':
                this.loadHomeContent();
                break;
            case 'academics-content':
                this.loadAcademicsContent();
                break;
            case 'contact-content':
                this.loadContactContent();
                break;
            case 'website-settings':
                this.loadWebsiteSettings();
                break;
            case 'events':
                this.loadEvents();
                break;
            case 'gallery':
                this.loadGallery();
                break;
            case 'users':
                this.loadUsers();
                break;
            case 'contact-requests':
                this.loadContactRequests();
                break;
        }
    }

    // ===== CONTENT MANAGEMENT FUNCTIONS =====

    async loadHomeContent() {
        try {
            const response = await this.authenticatedFetch('/api/content/home');
            if (response && response.ok) {
                const data = await response.json();
                this.populateHomeContentForm(data.content);
            } else {
                this.showToast('Error loading home content', 'error');
            }
        } catch (error) {
            console.error('Error loading home content:', error);
            this.showToast('Failed to load home content', 'error');
        }
    }

    populateHomeContentForm(content) {
        // Hero Section
        if (content.hero) {
            const heroTitle = document.getElementById('heroTitle');
            if (heroTitle) heroTitle.value = content.hero.title || '';
            
            const heroSubtitle = document.getElementById('heroSubtitle');
            if (heroSubtitle) heroSubtitle.value = content.hero.subtitle || '';
            
            const heroDescription = document.getElementById('heroDescription');
            if (heroDescription) heroDescription.value = content.hero.description || '';
            
            const heroButton1Text = document.getElementById('heroButton1Text');
            if (heroButton1Text) heroButton1Text.value = content.hero.button1Text || '';
            
            const heroButton1Link = document.getElementById('heroButton1Link');
            if (heroButton1Link) heroButton1Link.value = content.hero.button1Link || '';
            
            const heroButton2Text = document.getElementById('heroButton2Text');
            if (heroButton2Text) heroButton2Text.value = content.hero.button2Text || '';
            
            const heroButton2Link = document.getElementById('heroButton2Link');
            if (heroButton2Link) heroButton2Link.value = content.hero.button2Link || '';
        }

        // Welcome Section
        // Welcome section - removed as it doesn't exist in the current admin panel

        // Why Choose Us Section
        if (content.whyChooseUs) {
            const whyChooseUsTitleEl = document.getElementById('whyChooseUsTitle');
            const whyChooseUsSubtitleEl = document.getElementById('whyChooseUsSubtitle');
            if (whyChooseUsTitleEl) whyChooseUsTitleEl.value = content.whyChooseUs.title || '';
            if (whyChooseUsSubtitleEl) whyChooseUsSubtitleEl.value = content.whyChooseUs.subtitle || '';
            this.renderWhyChooseUsFeatures(content.whyChooseUs.features || []);
        }

        // Latest News Section
        if (content.latestNews) {
            document.getElementById('latestNewsTitle').value = content.latestNews.title || '';
            document.getElementById('latestNewsSubtitle').value = content.latestNews.subtitle || '';
            document.getElementById('latestNewsCount').value = content.latestNews.count || 3;
            document.getElementById('latestNewsSource').value = content.latestNews.source || 'both';
        }

        // Student Life Section
        if (content.studentLife) {
            document.getElementById('studentLifeTitle').value = content.studentLife.title || '';
            document.getElementById('studentLifeSubtitle').value = content.studentLife.subtitle || '';
            document.getElementById('studentLifeDescription').value = content.studentLife.description || '';
            this.renderStudentLifeHighlights(content.studentLife.highlights || []);
        }

        // Testimonials Section
        if (content.testimonials) {
            document.getElementById('testimonialsTitle').value = content.testimonials.title || '';
            document.getElementById('testimonialsSubtitle').value = content.testimonials.subtitle || '';
            this.renderTestimonials(content.testimonials.items || []);
        }

        // CTA Section
        if (content.cta) {
            document.getElementById('ctaTitle').value = content.cta.title || '';
            document.getElementById('ctaSubtitle').value = content.cta.subtitle || '';
            document.getElementById('ctaDescription').value = content.cta.description || '';
            document.getElementById('ctaButtonText').value = content.cta.buttonText || '';
            document.getElementById('ctaButtonLink').value = content.cta.buttonLink || '';
            document.getElementById('ctaPhone').value = content.cta.phone || '';
        }
    }


    async loadAcademicsContent() {
        try {
            const response = await this.authenticatedFetch('/api/content/academics');
            if (response && response.ok) {
                const data = await response.json();
                this.populateAcademicsContentForm(data.content);
            } else {
                this.showToast('Error loading academics content', 'error');
            }
        } catch (error) {
            console.error('Error loading academics content:', error);
            this.showToast('Failed to load academics content', 'error');
        }
    }

    populateAcademicsContentForm(content) {
        // Academic Philosophy Section
        if (content.academicPhilosophy) {
            document.getElementById('academicsTitle').value = content.academicPhilosophy.title || '';
            document.getElementById('academicsDescription').value = content.academicPhilosophy.description || '';
            document.getElementById('academicsOverviewEnabled').checked = content.academicPhilosophy.enabled !== false;
            this.renderPhilosophyHighlights(content.academicPhilosophy.highlights || []);
        }

        // Grade Levels Section
        if (content.gradeLevels) {
            document.getElementById('gradeLevelsTitle').value = content.gradeLevels.title || '';
            document.getElementById('gradeLevelsSubtitle').value = content.gradeLevels.subtitle || '';
            document.getElementById('gradeLevelsEnabled').checked = content.gradeLevels.enabled !== false;
            this.renderGradeLevels(content.gradeLevels.levels || []);
        }

        // Beyond Academics Section
        if (content.beyondAcademics) {
            document.getElementById('beyondAcademicsTitle').value = content.beyondAcademics.title || '';
            document.getElementById('beyondAcademicsSubtitle').value = content.beyondAcademics.subtitle || '';
            document.getElementById('beyondAcademicsEnabled').checked = content.beyondAcademics.enabled !== false;
            this.renderBeyondAcademicsActivities(content.beyondAcademics.activities || []);
        }

        // CTA Section
        if (content.ctaSection) {
            document.getElementById('academicsCtaTitle').value = content.ctaSection.title || '';
            document.getElementById('academicsCtaSubtitle').value = content.ctaSection.subtitle || '';
            document.getElementById('academicsCtaDescription').value = content.ctaSection.description || '';
            document.getElementById('academicsCtaPrimaryButton').value = content.ctaSection.primaryButton?.text || '';
            document.getElementById('academicsCtaSecondaryButton').value = content.ctaSection.secondaryButton?.text || '';
            document.getElementById('academicsCtaEnabled').checked = content.ctaSection.enabled !== false;
        }
    }

    async loadContactContent() {
        try {
            const response = await this.authenticatedFetch('/api/content/contact');
            if (response && response.ok) {
                const data = await response.json();
                this.populateContactContentForm(data.content);
            } else {
                this.showToast('Error loading contact content', 'error');
            }
        } catch (error) {
            console.error('Error loading contact content:', error);
            this.showToast('Failed to load contact content', 'error');
        }
    }

    populateContactContentForm(content) {
        // Contact Main Section
        if (content.contactMain) {
            document.getElementById('contactTitle').value = content.contactMain.title || '';
            document.getElementById('contactSubtitle').value = content.contactMain.subtitle || '';
            document.getElementById('contactAddress').value = content.contactMain.contactInfo?.address || '';
            document.getElementById('contactPhone').value = content.contactMain.contactInfo?.phone || '';
            document.getElementById('contactEmail').value = content.contactMain.contactInfo?.email || '';
            document.getElementById('contactHours').value = content.contactMain.contactInfo?.hours || '';
            document.getElementById('contactInfoEnabled').checked = content.contactMain.enabled !== false;
        }

        // Location Section
        if (content.locationSection) {
            document.getElementById('locationTitle').value = content.locationSection.title || '';
            document.getElementById('locationSubtitle').value = content.locationSection.subtitle || '';
            document.getElementById('locationDescription').value = content.locationSection.description || '';
            document.getElementById('transportationInfo').value = content.locationSection.transportation || '';
            document.getElementById('locationEnabled').checked = content.locationSection.enabled !== false;
        }

        // FAQ Section
        if (content.faqSection) {
            document.getElementById('faqTitle').value = content.faqSection.title || '';
            document.getElementById('faqSubtitle').value = content.faqSection.subtitle || '';
            document.getElementById('faqEnabled').checked = content.faqSection.enabled !== false;
            this.renderFAQs(content.faqSection.faqs || []);
        }

        // Social Media Section
        if (content.socialMedia) {
            document.getElementById('socialMediaTitle').value = content.socialMedia.title || '';
            document.getElementById('socialMediaSubtitle').value = content.socialMedia.subtitle || '';
            document.getElementById('socialMediaEnabled').checked = content.socialMedia.enabled !== false;
            this.renderSocialMediaLinks(content.socialMedia.links || []);
        }

        // CTA Section
        if (content.ctaSection) {
            document.getElementById('contactCtaTitle').value = content.ctaSection.title || '';
            document.getElementById('contactCtaSubtitle').value = content.ctaSection.subtitle || '';
            document.getElementById('contactCtaDescription').value = content.ctaSection.description || '';
            document.getElementById('contactCtaPrimaryButton').value = content.ctaSection.primaryButton?.text || '';
            document.getElementById('contactCtaSecondaryButton').value = content.ctaSection.secondaryButton?.text || '';
            document.getElementById('contactCtaEnabled').checked = content.ctaSection.enabled !== false;
        }
    }

    async loadWebsiteSettings() {
        try {
            const response = await this.authenticatedFetch('/api/admin/settings');
            if (response && response.ok) {
                const data = await response.json();
                this.populateWebsiteSettingsForm(data.settings);
            } else {
                this.showToast('Error loading website settings', 'error');
            }
        } catch (error) {
            console.error('Error loading website settings:', error);
            this.showToast('Failed to load website settings', 'error');
        }
    }

    populateWebsiteSettingsForm(settings) {
        // General Settings - Skip form population as websiteSettingsLoader.js handles it
        // The websiteSettingsLoader.js will populate the form with proper data

    }

    // ===== SAVE CONTENT FUNCTIONS =====

    async saveHomeContent() {
        try {
            const content = {
                hero: {
                    title: document.getElementById('heroTitle')?.value || '',
                    subtitle: document.getElementById('heroSubtitle')?.value || '',
                    description: document.getElementById('heroDescription')?.value || '',
                    button1Text: document.getElementById('heroButton1Text')?.value || '',
                    button1Link: document.getElementById('heroButton1Link')?.value || '',
                    button2Text: document.getElementById('heroButton2Text')?.value || '',
                    button2Link: document.getElementById('heroButton2Link')?.value || ''
                },
                whyChooseUs: {
                    title: document.getElementById('whyChooseUsTitle')?.value || '',
                    subtitle: document.getElementById('whyChooseUsSubtitle')?.value || '',
                    features: this.getWhyChooseUsFeatures()
                },
                latestNews: {
                    title: document.getElementById('latestNewsTitle')?.value || '',
                    subtitle: document.getElementById('latestNewsSubtitle')?.value || '',
                    count: parseInt(document.getElementById('latestNewsCount')?.value || '0'),
                    source: document.getElementById('latestNewsSource')?.value || ''
                },
                studentLife: {
                    title: document.getElementById('studentLifeTitle')?.value || '',
                    subtitle: document.getElementById('studentLifeSubtitle')?.value || '',
                    description: document.getElementById('studentLifeDescription')?.value || '',
                    highlights: this.getStudentLifeHighlights()
                },
                testimonials: {
                    title: document.getElementById('testimonialsTitle')?.value || '',
                    subtitle: document.getElementById('testimonialsSubtitle')?.value || '',
                    items: this.getTestimonials()
                },
                cta: {
                    title: document.getElementById('ctaTitle')?.value || '',
                    subtitle: document.getElementById('ctaSubtitle')?.value || '',
                    description: document.getElementById('ctaDescription')?.value || '',
                    buttonText: document.getElementById('ctaButtonText')?.value || '',
                    buttonLink: document.getElementById('ctaButtonLink')?.value || '',
                    phone: document.getElementById('ctaPhone')?.value || ''
                }
            };

            const response = await this.authenticatedFetch('/api/admin/homepage-content/bulk', {
                method: 'POST',
                body: JSON.stringify({ content: [] }) // Empty for now since we're using the new system
            });

            if (response && response.ok) {
                this.showToast('Home content saved successfully', 'success');
            } else {
                this.showToast('Error saving home content', 'error');
            }
        } catch (error) {
            console.error('Error saving home content:', error);
            this.showToast('Failed to save home content', 'error');
        }
    }


    async saveAcademicsContent() {
        try {
            const content = {
                academicPhilosophy: {
                    title: document.getElementById('academicsTitle').value,
                    description: document.getElementById('academicsDescription').value,
                    highlights: this.getPhilosophyHighlights(),
                    enabled: document.getElementById('academicsOverviewEnabled').checked
                },
                gradeLevels: {
                    title: document.getElementById('gradeLevelsTitle').value,
                    subtitle: document.getElementById('gradeLevelsSubtitle').value,
                    levels: this.getGradeLevels(),
                    enabled: document.getElementById('gradeLevelsEnabled').checked
                },
                beyondAcademics: {
                    title: document.getElementById('beyondAcademicsTitle').value,
                    subtitle: document.getElementById('beyondAcademicsSubtitle').value,
                    activities: this.getBeyondAcademicsActivities(),
                    enabled: document.getElementById('beyondAcademicsEnabled').checked
                },
                ctaSection: {
                    title: document.getElementById('academicsCtaTitle').value,
                    subtitle: document.getElementById('academicsCtaSubtitle').value,
                    description: document.getElementById('academicsCtaDescription').value,
                    primaryButton: {
                        text: document.getElementById('academicsCtaPrimaryButton').value,
                        link: '/contact.html'
                    },
                    secondaryButton: {
                        text: document.getElementById('academicsCtaSecondaryButton').value,
                        link: '/contact.html'
                    },
                    enabled: document.getElementById('academicsCtaEnabled').checked
                }
            };

            const response = await this.authenticatedFetch('/api/content/academics/bulk', {
                method: 'PUT',
                body: JSON.stringify({ content })
            });

            if (response && response.ok) {
                this.showToast('Academics content saved successfully', 'success');
            } else {
                this.showToast('Error saving academics content', 'error');
            }
        } catch (error) {
            console.error('Error saving academics content:', error);
            this.showToast('Failed to save academics content', 'error');
        }
    }

    async saveContactContent() {
        try {
            const content = {
                contactMain: {
                    title: document.getElementById('contactTitle').value,
                    subtitle: document.getElementById('contactSubtitle').value,
                    description: document.getElementById('contactDescription').value,
                    contactInfo: {
                    address: document.getElementById('contactAddress').value,
                    phone: document.getElementById('contactPhone').value,
                    email: document.getElementById('contactEmail').value,
                    hours: document.getElementById('contactHours').value
                },
                    enabled: document.getElementById('contactInfoEnabled').checked
                },
                locationSection: {
                    title: document.getElementById('locationTitle').value,
                    subtitle: document.getElementById('locationSubtitle').value,
                    description: document.getElementById('locationDescription').value,
                    transportation: document.getElementById('transportationInfo').value,
                    enabled: document.getElementById('locationEnabled').checked
                },
                faqSection: {
                    title: document.getElementById('faqTitle').value,
                    subtitle: document.getElementById('faqSubtitle').value,
                    faqs: this.getFAQs(),
                    enabled: document.getElementById('faqEnabled').checked
                },
                socialMedia: {
                    title: document.getElementById('socialMediaTitle').value,
                    subtitle: document.getElementById('socialMediaSubtitle').value,
                    links: this.getSocialMediaLinks(),
                    enabled: document.getElementById('socialMediaEnabled').checked
                },
                ctaSection: {
                    title: document.getElementById('contactCtaTitle').value,
                    subtitle: document.getElementById('contactCtaSubtitle').value,
                    description: document.getElementById('contactCtaDescription').value,
                    primaryButton: {
                        text: document.getElementById('contactCtaPrimaryButton').value,
                        link: '/apply.html'
                    },
                    secondaryButton: {
                        text: document.getElementById('contactCtaSecondaryButton').value,
                        link: '/contact.html'
                    },
                    enabled: document.getElementById('contactCtaEnabled').checked
                }
            };

            const response = await this.authenticatedFetch('/api/content/contact/bulk', {
                method: 'PUT',
                body: JSON.stringify({ content })
            });

            if (response && response.ok) {
                this.showToast('Contact content saved successfully', 'success');
            } else {
                this.showToast('Error saving contact content', 'error');
            }
        } catch (error) {
            console.error('Error saving contact content:', error);
            this.showToast('Failed to save contact content', 'error');
        }
    }

    async saveWebsiteSettings() {
        // Save functionality is handled by websiteSettingsLoader.js
        // This method is disabled to prevent conflicts
        console.log('Save functionality handled by websiteSettingsLoader.js');
    }

    // ===== DYNAMIC ITEM MANAGEMENT =====

    // Why Choose Us Features
    renderWhyChooseUsFeatures(features) {
        const container = document.querySelector('#whyChooseUsFeatures .feature-items');
        container.innerHTML = '';
        
        features.forEach((feature, index) => {
            const featureItem = this.createFeatureItem(feature, index);
            container.appendChild(featureItem);
        });
    }

    getWhyChooseUsFeatures() {
        const features = [];
        document.querySelectorAll('#whyChooseUsFeatures .feature-item').forEach(item => {
            features.push({
                title: item.querySelector('[name="featureTitle"]').value,
                description: item.querySelector('[name="featureDescription"]').value
            });
        });
        return features;
    }

    // Student Life Highlights
    renderStudentLifeHighlights(highlights) {
        const container = document.querySelector('#studentLifeHighlights .highlight-items');
        container.innerHTML = '';
        
        highlights.forEach((highlight, index) => {
            const highlightItem = this.createHighlightItem(highlight, index);
            container.appendChild(highlightItem);
        });
    }

    getStudentLifeHighlights() {
        const highlights = [];
        document.querySelectorAll('#studentLifeHighlights .highlight-item').forEach(item => {
            highlights.push({
                title: item.querySelector('[name="highlightTitle"]').value,
                description: item.querySelector('[name="highlightDescription"]').value,
                icon: item.querySelector('[name="highlightIcon"]').value
            });
        });
        return highlights;
    }

    // Testimonials
    renderTestimonials(testimonials) {
        // Populate existing testimonial form fields
        testimonials.forEach((testimonial, index) => {
            const testimonialNum = index + 1;
            
            // Set testimonial name
            const nameField = document.getElementById(`testimonial${testimonialNum}Name`);
            if (nameField) nameField.value = testimonial.name || '';
            
            // Set testimonial handle
            const handleField = document.getElementById(`testimonial${testimonialNum}Handle`);
            if (handleField) handleField.value = testimonial.handle || '';
            
            // Set testimonial text
            const textField = document.getElementById(`testimonial${testimonialNum}Text`);
            if (textField) textField.value = testimonial.text || '';
            
            // Set testimonial avatar
            const avatarField = document.getElementById(`testimonial${testimonialNum}Avatar`);
            if (avatarField) avatarField.value = testimonial.avatar || '';
        });
    }

    getTestimonials() {
        const testimonials = [];
        
        // Get testimonials from existing testimonial items
        const testimonialItems = document.querySelectorAll('#testimonialItems .testimonial-item');
        testimonialItems.forEach((item, index) => {
            const nameField = item.querySelector('[name$="Name"]');
            const handleField = item.querySelector('[name$="Handle"]');
            const textField = item.querySelector('[name$="Text"]');
            const avatarField = item.querySelector('[name$="Avatar"]');
            
            if (nameField && nameField.value.trim()) {
            testimonials.push({
                    name: nameField.value,
                    handle: handleField ? handleField.value : '',
                    text: textField ? textField.value : '',
                    avatar: avatarField ? avatarField.value : ''
                });
            }
        });
        
        return testimonials;
    }

    // Add new testimonial
    addTestimonial() {
        const container = document.getElementById('testimonialItems');
        const existingItems = container.querySelectorAll('.testimonial-item');
        const newIndex = existingItems.length + 1;
        
        const testimonialHTML = `
            <div class="testimonial-item" data-testimonial="${newIndex}">
                <div class="testimonial-header">
                    <h5>Testimonial ${newIndex}</h5>
                    <button type="button" class="btn btn-danger btn-sm delete-testimonial" data-testimonial="${newIndex}">
                        <i data-lucide="trash-2"></i>
                        Delete
                    </button>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="testimonial${newIndex}Name">Name</label>
                        <input type="text" id="testimonial${newIndex}Name" name="testimonial${newIndex}Name" class="form-input" placeholder="Enter name">
                    </div>
                    <div class="form-group">
                        <label for="testimonial${newIndex}Handle">Handle</label>
                        <input type="text" id="testimonial${newIndex}Handle" name="testimonial${newIndex}Handle" class="form-input" placeholder="@handle">
                    </div>
                </div>
                <div class="form-group">
                    <label for="testimonial${newIndex}Text">Testimonial Text</label>
                    <textarea id="testimonial${newIndex}Text" name="testimonial${newIndex}Text" class="form-textarea" rows="3" placeholder="Enter testimonial text"></textarea>
                </div>
                <div class="form-group">
                    <label for="testimonial${newIndex}Avatar">Avatar URL</label>
                    <input type="url" id="testimonial${newIndex}Avatar" name="testimonial${newIndex}Avatar" class="form-input" placeholder="https://example.com/avatar.jpg">
                </div>
            </div>
        `;
        
        container.insertAdjacentHTML('beforeend', testimonialHTML);
        
        // Reinitialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    // Delete testimonial
    deleteTestimonial(testimonialIndex) {
        const testimonialItem = document.querySelector(`[data-testimonial="${testimonialIndex}"]`);
        if (testimonialItem) {
            testimonialItem.remove();
        }
    }

    // History Timeline
    renderHistoryTimeline(timeline) {
        const container = document.querySelector('#historyTimeline .timeline-items');
        container.innerHTML = '';
        
        timeline.forEach((event, index) => {
            const timelineItem = this.createTimelineItem(event, index);
            container.appendChild(timelineItem);
        });
    }

    getHistoryTimeline() {
        const timeline = [];
        document.querySelectorAll('#historyTimeline .timeline-item').forEach(item => {
            timeline.push({
                year: item.querySelector('[name="timelineYear"]').value,
                title: item.querySelector('[name="timelineTitle"]').value,
                description: item.querySelector('[name="timelineDescription"]').value
            });
        });
        return timeline;
    }

    // Team Members
    renderTeamMembers(members) {
        const container = document.querySelector('#teamContainer .team-items');
        container.innerHTML = '';
        
        members.forEach((member, index) => {
            const teamItem = this.createTeamItem(member, index);
            container.appendChild(teamItem);
        });
    }

    getTeamMembers() {
        const members = [];
        document.querySelectorAll('#teamContainer .team-item').forEach(item => {
            members.push({
                name: item.querySelector('[name="teamName"]').value,
                position: item.querySelector('[name="teamPosition"]').value,
                image: item.querySelector('[name="teamImage"]').value,
                description: item.querySelector('[name="teamDescription"]').value
            });
        });
        return members;
    }

    // Philosophy Highlights
    renderPhilosophyHighlights(highlights) {
        const container = document.querySelector('#philosophyHighlights .highlight-items');
        if (!container) return;
        container.innerHTML = '';
        
        highlights.forEach((highlight, index) => {
            const highlightItem = this.createHighlightItem(highlight, index);
            container.appendChild(highlightItem);
        });
    }

    getPhilosophyHighlights() {
        const highlights = [];
        document.querySelectorAll('#philosophyHighlights .highlight-item').forEach(item => {
            highlights.push({
                title: item.querySelector('[name="highlightTitle"]').value,
                description: item.querySelector('[name="highlightDescription"]').value,
                icon: item.querySelector('[name="highlightIcon"]').value
            });
        });
        return highlights;
    }

    createHighlightItem(highlight, index) {
        const item = document.createElement('div');
        item.className = 'highlight-item';
        item.innerHTML = `
            <div class="form-group">
                <label>Highlight Title</label>
                <input type="text" name="highlightTitle" value="${highlight.title || ''}" placeholder="Enter highlight title">
            </div>
            <div class="form-group">
                <label>Description</label>
                <textarea name="highlightDescription" rows="2" placeholder="Enter description">${highlight.description || ''}</textarea>
            </div>
            <div class="form-group">
                <label>Icon</label>
                <input type="text" name="highlightIcon" value="${highlight.icon || ''}" placeholder="Enter icon name">
            </div>
            <button type="button" class="btn btn-danger btn-sm remove-item">
                <i data-lucide="trash-2"></i>
            </button>
        `;
        return item;
    }

    // Grade Levels
    renderGradeLevels(levels) {
        const container = document.querySelector('#gradeLevels .level-items');
        if (!container) return;
        container.innerHTML = '';
        
        levels.forEach((level, index) => {
            const levelItem = this.createGradeLevelItem(level, index);
            container.appendChild(levelItem);
        });
    }

    getGradeLevels() {
        const levels = [];
        document.querySelectorAll('#gradeLevels .level-item').forEach(item => {
            levels.push({
                title: item.querySelector('[name="levelTitle"]').value,
                description: item.querySelector('[name="levelDescription"]').value,
                content: item.querySelector('[name="levelContent"]').value,
                image: item.querySelector('[name="levelImage"]').value,
                icon: item.querySelector('[name="levelIcon"]').value
            });
        });
        return levels;
    }

    createGradeLevelItem(level, index) {
        const item = document.createElement('div');
        item.className = 'level-item';
        item.innerHTML = `
            <div class="form-group">
                <label>Level Title</label>
                <input type="text" name="levelTitle" value="${level.title || ''}" placeholder="Enter level title">
            </div>
            <div class="form-group">
                <label>Description</label>
                <textarea name="levelDescription" rows="2" placeholder="Enter description">${level.description || ''}</textarea>
            </div>
            <div class="form-group">
                <label>Content</label>
                <textarea name="levelContent" rows="3" placeholder="Enter detailed content">${level.content || ''}</textarea>
            </div>
            <div class="form-group">
                <label>Image URL</label>
                <input type="url" name="levelImage" value="${level.image || ''}" placeholder="Enter image URL">
            </div>
            <div class="form-group">
                <label>Icon</label>
                <input type="text" name="levelIcon" value="${level.icon || ''}" placeholder="Enter icon name">
            </div>
            <button type="button" class="btn btn-danger btn-sm remove-item">
                <i data-lucide="trash-2"></i>
            </button>
        `;
        return item;
    }

    // Beyond Academics Activities
    renderBeyondAcademicsActivities(activities) {
        const container = document.querySelector('#beyondAcademicsActivities .activity-items');
        if (!container) return;
        container.innerHTML = '';
        
        activities.forEach((activity, index) => {
            const activityItem = this.createActivityItem(activity, index);
            container.appendChild(activityItem);
        });
    }

    getBeyondAcademicsActivities() {
        const activities = [];
        document.querySelectorAll('#beyondAcademicsActivities .activity-item').forEach(item => {
            activities.push({
                title: item.querySelector('[name="activityTitle"]').value,
                description: item.querySelector('[name="activityDescription"]').value,
                image: item.querySelector('[name="activityImage"]').value,
                icon: item.querySelector('[name="activityIcon"]').value
            });
        });
        return activities;
    }

    createActivityItem(activity, index) {
        const item = document.createElement('div');
        item.className = 'activity-item';
        item.innerHTML = `
            <div class="form-group">
                <label>Activity Title</label>
                <input type="text" name="activityTitle" value="${activity.title || ''}" placeholder="Enter activity title">
            </div>
            <div class="form-group">
                <label>Description</label>
                <textarea name="activityDescription" rows="2" placeholder="Enter description">${activity.description || ''}</textarea>
            </div>
            <div class="form-group">
                <label>Image URL</label>
                <input type="url" name="activityImage" value="${activity.image || ''}" placeholder="Enter image URL">
            </div>
            <div class="form-group">
                <label>Icon</label>
                <input type="text" name="activityIcon" value="${activity.icon || ''}" placeholder="Enter icon name">
            </div>
            <button type="button" class="btn btn-danger btn-sm remove-item">
                <i data-lucide="trash-2"></i>
            </button>
        `;
        return item;
    }

    // Social Media Links
    renderSocialMediaLinks(links) {
        const container = document.querySelector('#socialMediaLinks .link-items');
        if (!container) return;
        container.innerHTML = '';
        
        links.forEach((link, index) => {
            const linkItem = this.createSocialMediaLinkItem(link, index);
            container.appendChild(linkItem);
        });
    }

    getSocialMediaLinks() {
        const links = [];
        document.querySelectorAll('#socialMediaLinks .link-item').forEach(item => {
            links.push({
                platform: item.querySelector('[name="linkPlatform"]').value,
                url: item.querySelector('[name="linkUrl"]').value,
                description: item.querySelector('[name="linkDescription"]').value,
                icon: item.querySelector('[name="linkIcon"]').value
            });
        });
        return links;
    }

    createSocialMediaLinkItem(link, index) {
        const item = document.createElement('div');
        item.className = 'link-item';
        item.innerHTML = `
            <div class="form-group">
                <label>Platform</label>
                <input type="text" name="linkPlatform" value="${link.platform || ''}" placeholder="Enter platform name">
            </div>
            <div class="form-group">
                <label>URL</label>
                <input type="url" name="linkUrl" value="${link.url || ''}" placeholder="Enter URL">
            </div>
            <div class="form-group">
                <label>Description</label>
                <input type="text" name="linkDescription" value="${link.description || ''}" placeholder="Enter description">
            </div>
            <div class="form-group">
                <label>Icon</label>
                <input type="text" name="linkIcon" value="${link.icon || ''}" placeholder="Enter icon name">
            </div>
            <button type="button" class="btn btn-danger btn-sm remove-item">
                <i data-lucide="trash-2"></i>
            </button>
        `;
        return item;
    }

    // Curriculum Items
    renderCurriculumItems(items) {
        const container = document.querySelector('#curriculumContainer .curriculum-items');
        container.innerHTML = '';
        
        items.forEach((item, index) => {
            const curriculumItem = this.createCurriculumItem(item, index);
            container.appendChild(curriculumItem);
        });
    }

    getCurriculumItems() {
        const items = [];
        document.querySelectorAll('#curriculumContainer .curriculum-item').forEach(item => {
            items.push({
                subject: item.querySelector('[name="curriculumSubject"]').value,
                description: item.querySelector('[name="curriculumDescription"]').value,
                hours: item.querySelector('[name="curriculumHours"]').value
            });
        });
        return items;
    }

    // Teaching Methods
    renderTeachingMethods(methods) {
        const container = document.querySelector('#teachingMethodsContainer .method-items');
        container.innerHTML = '';
        
        methods.forEach((method, index) => {
            const methodItem = this.createMethodItem(method, index);
            container.appendChild(methodItem);
        });
    }

    getTeachingMethods() {
        const methods = [];
        document.querySelectorAll('#teachingMethodsContainer .method-item').forEach(item => {
            methods.push({
                name: item.querySelector('[name="methodName"]').value,
                description: item.querySelector('[name="methodDescription"]').value
            });
        });
        return methods;
    }

    // Achievements
    renderAchievements(achievements) {
        const container = document.querySelector('#achievementsContainer .achievement-items');
        container.innerHTML = '';
        
        achievements.forEach((achievement, index) => {
            const achievementItem = this.createAchievementItem(achievement, index);
            container.appendChild(achievementItem);
        });
    }

    getAchievements() {
        const achievements = [];
        document.querySelectorAll('#achievementsContainer .achievement-item').forEach(item => {
            achievements.push({
                title: item.querySelector('[name="achievementTitle"]').value,
                description: item.querySelector('[name="achievementDescription"]').value,
                year: item.querySelector('[name="achievementYear"]').value
            });
        });
        return achievements;
    }

    // FAQs
    renderFAQs(faqs) {
        const container = document.querySelector('#faqContainer .faq-items');
        container.innerHTML = '';
        
        faqs.forEach((faq, index) => {
            const faqItem = this.createFAQItem(faq, index);
            container.appendChild(faqItem);
        });
    }

    getFAQs() {
        const faqs = [];
        document.querySelectorAll('#faqContainer .faq-item').forEach(item => {
            faqs.push({
                question: item.querySelector('[name="faqQuestion"]').value,
                answer: item.querySelector('[name="faqAnswer"]').value
            });
        });
        return faqs;
    }

    // ===== CREATE DYNAMIC ITEMS =====

    createFeatureItem(feature = {}, index) {
        const div = document.createElement('div');
        div.className = 'feature-item dynamic-item';
        div.innerHTML = `
            <div class="dynamic-item-header">
                <span class="dynamic-item-title">Feature ${index + 1}</span>
                <div class="dynamic-item-actions">
                    <button type="button" class="edit-btn" data-action="remove-item">Delete</button>
                </div>
            </div>
            <div class="dynamic-item-content">
                <div class="form-group">
                    <label>Title</label>
                    <input type="text" name="featureTitle" class="form-input" value="${feature.title || ''}" placeholder="Feature title">
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea name="featureDescription" class="form-textarea" rows="2" placeholder="Feature description">${feature.description || ''}</textarea>
                </div>
            </div>
        `;
        return div;
    }

    createHighlightItem(highlight = {}, index) {
        const div = document.createElement('div');
        div.className = 'highlight-item dynamic-item';
        div.innerHTML = `
            <div class="dynamic-item-header">
                <span class="dynamic-item-title">Highlight ${index + 1}</span>
                <div class="dynamic-item-actions">
                    <button type="button" class="edit-btn" data-action="remove-item">Delete</button>
                </div>
            </div>
            <div class="dynamic-item-content">
                <div class="form-group">
                    <label>Title</label>
                    <input type="text" name="highlightTitle" class="form-input" value="${highlight.title || ''}" placeholder="Highlight title">
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea name="highlightDescription" class="form-textarea" rows="2" placeholder="Highlight description">${highlight.description || ''}</textarea>
                </div>
                <div class="form-group">
                    <label>Icon</label>
                    <input type="text" name="highlightIcon" class="form-input" value="${highlight.icon || ''}" placeholder="bx bx-icon">
                </div>
            </div>
        `;
        return div;
    }

    createTestimonialItem(testimonial = {}, index) {
        const div = document.createElement('div');
        div.className = 'testimonial-item dynamic-item';
        div.innerHTML = `
            <div class="dynamic-item-header">
                <span class="dynamic-item-title">Testimonial ${index + 1}</span>
                <div class="dynamic-item-actions">
                    <button type="button" class="edit-btn" data-action="remove-item">Delete</button>
                </div>
            </div>
            <div class="dynamic-item-content">
                <div class="form-group">
                    <label>Name</label>
                    <input type="text" name="testimonialName" class="form-input" value="${testimonial.name || ''}" placeholder="Person name">
                </div>
                <div class="form-group">
                    <label>Role</label>
                    <input type="text" name="testimonialRole" class="form-input" value="${testimonial.role || ''}" placeholder="Parent/Student">
                </div>
                <div class="form-group">
                    <label>Rating</label>
                    <input type="number" name="testimonialRating" class="form-input" value="${testimonial.rating || 5}" min="1" max="5">
                </div>
                <div class="form-group">
                    <label>Content</label>
                    <textarea name="testimonialContent" class="form-textarea" rows="3" placeholder="Testimonial content">${testimonial.content || ''}</textarea>
                </div>
            </div>
        `;
        return div;
    }

    createTimelineItem(event = {}, index) {
        const div = document.createElement('div');
        div.className = 'timeline-item dynamic-item';
        div.innerHTML = `
            <div class="dynamic-item-header">
                <span class="dynamic-item-title">Timeline Event ${index + 1}</span>
                <div class="dynamic-item-actions">
                    <button type="button" class="edit-btn" data-action="remove-item">Delete</button>
                </div>
            </div>
            <div class="dynamic-item-content">
                <div class="form-group">
                    <label>Year</label>
                    <input type="text" name="timelineYear" class="form-input" value="${event.year || ''}" placeholder="2023">
                </div>
                <div class="form-group">
                    <label>Title</label>
                    <input type="text" name="timelineTitle" class="form-input" value="${event.title || ''}" placeholder="Event title">
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea name="timelineDescription" class="form-textarea" rows="2" placeholder="Event description">${event.description || ''}</textarea>
                </div>
            </div>
        `;
        return div;
    }

    createTeamItem(member = {}, index) {
        const div = document.createElement('div');
        div.className = 'team-item dynamic-item';
        div.innerHTML = `
            <div class="dynamic-item-header">
                <span class="dynamic-item-title">Team Member ${index + 1}</span>
                <div class="dynamic-item-actions">
                    <button type="button" class="edit-btn" data-action="remove-item">Delete</button>
                </div>
            </div>
            <div class="dynamic-item-content">
                <div class="form-group">
                    <label>Name</label>
                    <input type="text" name="teamName" class="form-input" value="${member.name || ''}" placeholder="Member name">
                </div>
                <div class="form-group">
                    <label>Position</label>
                    <input type="text" name="teamPosition" class="form-input" value="${member.position || ''}" placeholder="Position/Title">
                </div>
                <div class="form-group">
                    <label>Image URL</label>
                    <input type="url" name="teamImage" class="form-input" value="${member.image || ''}" placeholder="https://example.com/image.jpg">
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea name="teamDescription" class="form-textarea" rows="2" placeholder="Member description">${member.description || ''}</textarea>
                </div>
            </div>
        `;
        return div;
    }

    createProgramItem(program = {}, index) {
        const div = document.createElement('div');
        div.className = 'program-item dynamic-item';
        div.innerHTML = `
            <div class="dynamic-item-header">
                <span class="dynamic-item-title">Program ${index + 1}</span>
                <div class="dynamic-item-actions">
                    <button type="button" class="edit-btn" data-action="remove-item">Delete</button>
                </div>
            </div>
            <div class="dynamic-item-content">
                <div class="form-group">
                    <label>Program Name</label>
                    <input type="text" name="programName" class="form-input" value="${program.name || ''}" placeholder="Program name">
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea name="programDescription" class="form-textarea" rows="2" placeholder="Program description">${program.description || ''}</textarea>
                </div>
                <div class="form-group">
                    <label>Grades</label>
                    <input type="text" name="programGrades" class="form-input" value="${program.grades || ''}" placeholder="1-5, 6-8, 9-12">
                </div>
            </div>
        `;
        return div;
    }

    createCurriculumItem(item = {}, index) {
        const div = document.createElement('div');
        div.className = 'curriculum-item dynamic-item';
        div.innerHTML = `
            <div class="dynamic-item-header">
                <span class="dynamic-item-title">Curriculum Item ${index + 1}</span>
                <div class="dynamic-item-actions">
                    <button type="button" class="edit-btn" data-action="remove-item">Delete</button>
                </div>
            </div>
            <div class="dynamic-item-content">
                <div class="form-group">
                    <label>Subject</label>
                    <input type="text" name="curriculumSubject" class="form-input" value="${item.subject || ''}" placeholder="Subject name">
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea name="curriculumDescription" class="form-textarea" rows="2" placeholder="Subject description">${item.description || ''}</textarea>
                </div>
                <div class="form-group">
                    <label>Hours per Week</label>
                    <input type="text" name="curriculumHours" class="form-input" value="${item.hours || ''}" placeholder="5 hours">
                </div>
            </div>
        `;
        return div;
    }

    createMethodItem(method = {}, index) {
        const div = document.createElement('div');
        div.className = 'method-item dynamic-item';
        div.innerHTML = `
            <div class="dynamic-item-header">
                <span class="dynamic-item-title">Teaching Method ${index + 1}</span>
                <div class="dynamic-item-actions">
                    <button type="button" class="edit-btn" data-action="remove-item">Delete</button>
                </div>
            </div>
            <div class="dynamic-item-content">
                <div class="form-group">
                    <label>Method Name</label>
                    <input type="text" name="methodName" class="form-input" value="${method.name || ''}" placeholder="Method name">
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea name="methodDescription" class="form-textarea" rows="2" placeholder="Method description">${method.description || ''}</textarea>
                </div>
            </div>
        `;
        return div;
    }

    createAchievementItem(achievement = {}, index) {
        const div = document.createElement('div');
        div.className = 'achievement-item dynamic-item';
        div.innerHTML = `
            <div class="dynamic-item-header">
                <span class="dynamic-item-title">Achievement ${index + 1}</span>
                <div class="dynamic-item-actions">
                    <button type="button" class="edit-btn" data-action="remove-item">Delete</button>
                </div>
            </div>
            <div class="dynamic-item-content">
                <div class="form-group">
                    <label>Achievement Title</label>
                    <input type="text" name="achievementTitle" class="form-input" value="${achievement.title || ''}" placeholder="Achievement title">
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea name="achievementDescription" class="form-textarea" rows="2" placeholder="Achievement description">${achievement.description || ''}</textarea>
                </div>
                <div class="form-group">
                    <label>Year</label>
                    <input type="text" name="achievementYear" class="form-input" value="${achievement.year || ''}" placeholder="2023">
                </div>
            </div>
        `;
        return div;
    }

    createFAQItem(faq = {}, index) {
        const div = document.createElement('div');
        div.className = 'faq-item dynamic-item';
        div.innerHTML = `
            <div class="dynamic-item-header">
                <span class="dynamic-item-title">FAQ ${index + 1}</span>
                <div class="dynamic-item-actions">
                    <button type="button" class="edit-btn" data-action="remove-item">Delete</button>
                </div>
            </div>
            <div class="dynamic-item-content">
                <div class="form-group">
                    <label>Question</label>
                    <input type="text" name="faqQuestion" class="form-input" value="${faq.question || ''}" placeholder="Frequently asked question">
                </div>
                <div class="form-group">
                    <label>Answer</label>
                    <textarea name="faqAnswer" class="form-textarea" rows="3" placeholder="Answer to the question">${faq.answer || ''}</textarea>
                </div>
            </div>
        `;
        return div;
    }

    // ===== UPDATED EVENT HANDLERS =====

    bindContentEvents() {
        // Save buttons
        // saveHomeContentBtn is handled by homepage-admin.js
        document.getElementById('saveAcademicsContentBtn')?.addEventListener('click', () => this.saveAcademicsContent());
        document.getElementById('saveContactContentBtn')?.addEventListener('click', () => this.saveContactContent());
        document.getElementById('saveWebsiteSettingsBtn')?.addEventListener('click', () => this.saveWebsiteSettings());

        // Add item buttons
        document.getElementById('addWhyChooseUsFeature')?.addEventListener('click', () => {
            const container = document.querySelector('#whyChooseUsFeatures .feature-items');
            const newItem = this.createFeatureItem({}, container.children.length);
            container.appendChild(newItem);
        });

        document.getElementById('addStudentLifeHighlight')?.addEventListener('click', () => {
            const container = document.querySelector('#studentLifeHighlights .highlight-items');
            const newItem = this.createHighlightItem({}, container.children.length);
            container.appendChild(newItem);
        });

        document.getElementById('addTestimonial')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.addTestimonial();
        });

        // Delete testimonial event delegation
        document.addEventListener('click', (e) => {
            if (e.target.closest('.delete-testimonial')) {
                e.preventDefault();
                const testimonialIndex = e.target.closest('.delete-testimonial').dataset.testimonial;
                this.deleteTestimonial(testimonialIndex);
            }
        });

        document.getElementById('addTimelineEvent')?.addEventListener('click', () => {
            const container = document.querySelector('#historyTimeline .timeline-items');
            const newItem = this.createTimelineItem({}, container.children.length);
            container.appendChild(newItem);
        });

        document.getElementById('addTeamMember')?.addEventListener('click', () => {
            const container = document.querySelector('#teamContainer .team-items');
            const newItem = this.createTeamItem({}, container.children.length);
            container.appendChild(newItem);
        });

        // Add Philosophy Highlight
        document.getElementById('addPhilosophyHighlight')?.addEventListener('click', () => {
            const container = document.querySelector('#philosophyHighlights .highlight-items');
            const newItem = this.createHighlightItem({}, container.children.length);
            container.appendChild(newItem);
        });

        // Add Grade Level
        document.getElementById('addGradeLevel')?.addEventListener('click', () => {
            const container = document.querySelector('#gradeLevels .level-items');
            const newItem = this.createGradeLevelItem({}, container.children.length);
            container.appendChild(newItem);
        });

        // Add Beyond Academics Activity
        document.getElementById('addBeyondAcademicsActivity')?.addEventListener('click', () => {
            const container = document.querySelector('#beyondAcademicsActivities .activity-items');
            const newItem = this.createActivityItem({}, container.children.length);
            container.appendChild(newItem);
        });

        // Add Social Media Link
        document.getElementById('addSocialMediaLink')?.addEventListener('click', () => {
            const container = document.querySelector('#socialMediaLinks .link-items');
            const newItem = this.createSocialMediaLinkItem({}, container.children.length);
            container.appendChild(newItem);
        });

        document.getElementById('addCurriculumItem')?.addEventListener('click', () => {
            const container = document.querySelector('#curriculumContainer .curriculum-items');
            const newItem = this.createCurriculumItem({}, container.children.length);
            container.appendChild(newItem);
        });

        document.getElementById('addTeachingMethod')?.addEventListener('click', () => {
            const container = document.querySelector('#teachingMethodsContainer .method-items');
            const newItem = this.createMethodItem({}, container.children.length);
            container.appendChild(newItem);
        });

        document.getElementById('addAchievement')?.addEventListener('click', () => {
            const container = document.querySelector('#achievementsContainer .achievement-items');
            const newItem = this.createAchievementItem({}, container.children.length);
            container.appendChild(newItem);
        });

        document.getElementById('addFAQ')?.addEventListener('click', () => {
            const container = document.querySelector('#faqContainer .faq-items');
            const newItem = this.createFAQItem({}, container.children.length);
            container.appendChild(newItem);
        });

    }

    async updateSectionVisibility(section, visible) {
        try {
            const currentSection = this.currentSection.replace('-content', '');
            const response = await this.authenticatedFetch('/api/admin/section-visibility', {
                method: 'PATCH',
                body: JSON.stringify({
                    page: currentSection,
                    section: section,
                    visible: visible
                })
            });

            if (response && response.ok) {
                this.showToast(`Section ${visible ? 'enabled' : 'disabled'} successfully`, 'success');
            } else {
                this.showToast('Error updating section visibility', 'error');
            }
        } catch (error) {
            console.error('Error updating section visibility:', error);
            this.showToast('Failed to update section visibility', 'error');
        }
    }

    async loadDashboard() {
        try {
            const response = await this.authenticatedFetch('/api/admin/dashboard');
            const data = await response.json();
            
            if (response.ok) {
                this.updateDashboardStats(data);
            } else {
                this.showToast('Error loading dashboard data', 'error');
            }
        } catch (error) {
            console.error('Error loading dashboard:', error);
            this.showToast('Failed to load dashboard data', 'error');
        }
    }

    updateDashboardStats(data) {
        // Update dashboard stats with real data
        const stats = {
            totalEvents: data.totalEvents || 0,
            totalGallery: data.totalGallery || 0,
            totalUsers: data.totalUsers || 0
        };

        // Find and update the stat values in the dashboard
        const statValues = document.querySelectorAll('.stat-value');
        if (statValues.length >= 4) {
            // Update events count (3rd card)
            statValues[2].textContent = stats.totalEvents.toLocaleString();
        }

        // Update the badges in the sidebar
        const eventBadge = document.querySelector('[data-section="events"] .badge');
        const galleryBadge = document.querySelector('[data-section="gallery"] .badge');
        
        if (eventBadge) eventBadge.textContent = stats.totalEvents;
        if (galleryBadge) galleryBadge.textContent = stats.totalGallery;
    }

    async loadEvents() {
        try {
            const response = await this.authenticatedFetch('/api/admin/events');
            const data = await response.json();
            
            if (response.ok) {
                this.renderEventsTable(data.events || []);
            } else {
                this.showToast('Error loading events', 'error');
            }
        } catch (error) {
            console.error('Error loading events:', error);
            this.showToast('Failed to load events', 'error');
        }
    }

    renderEventsTable(events) {
        const eventsTableBody = document.getElementById('eventsTableBody');
        if (!eventsTableBody) return;

        if (events.length === 0) {
            eventsTableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="empty-state">No events found</td>
                </tr>
            `;
            return;
        }

        eventsTableBody.innerHTML = events.map(event => `
            <tr>
                <td>
                    <div class="event-info">
                        <h4>${event.title}</h4>
                        <p>${event.description}</p>
                    </div>
                </td>
                <td>${this.formatDate(event.date)}</td>
                <td>${event.category}</td>
                <td><span class="status-badge ${event.status}">${event.status}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn-table edit" data-action="edit-event" data-event-id="${event.id}">
                            <i data-lucide="edit"></i>
                        </button>
                        <button class="action-btn-table delete" data-action="delete-event" data-event-id="${event.id}">
                            <i data-lucide="trash-2"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        this.initializeLucideIcons();
    }



    async loadGallery() {
        try {
            const response = await this.authenticatedFetch('/api/admin/gallery');
            const data = await response.json();
            
            if (response.ok) {
                this.renderGalleryGrid(data.galleries || []);
            } else {
                this.showToast('Error loading gallery', 'error');
            }
        } catch (error) {
            console.error('Error loading gallery:', error);
            this.showToast('Failed to load gallery', 'error');
        }
    }

    renderGalleryGrid(gallery) {
        const galleryGrid = document.getElementById('galleryGrid');
        if (!galleryGrid) return;

        if (gallery.length === 0) {
            galleryGrid.innerHTML = '<div class="empty-state">No gallery items found</div>';
            return;
        }

        galleryGrid.innerHTML = gallery.map(item => `
            <div class="gallery-item">
                <img src="${item.image_url}" alt="${item.title}" class="gallery-image">
                <div class="gallery-content">
                    <h4 class="gallery-title">${item.title}</h4>
                    <div class="gallery-meta">
                        <span>${item.category}</span>
                        <div class="action-buttons">
                            <button class="action-btn-table edit" data-action="edit-gallery" data-gallery-id="${item.id}">
                                <i data-lucide="edit"></i>
                            </button>
                            <button class="action-btn-table delete" data-action="delete-gallery" data-gallery-id="${item.id}">
                                <i data-lucide="trash-2"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        this.initializeLucideIcons();
    }

    async loadUsers() {
        // Show loading skeleton first
        this.showUsersLoadingSkeleton();
        
        try {
            const response = await this.authenticatedFetch('/api/admin/users');
            const data = await response.json();
            
            if (response.ok) {
                this.renderUsersTable(data.users || []);
            } else {
                this.showToast('Error loading users', 'error');
                this.showUsersErrorState();
            }
        } catch (error) {
            console.error('Error loading users:', error);
            this.showToast('Failed to load users', 'error');
            this.showUsersErrorState();
        }
    }

    renderUsersTable(users) {
        const usersTableBody = document.getElementById('usersTableBody');
        if (!usersTableBody) return;

        if (users.length === 0) {
            usersTableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="empty-state">No users found</td>
                </tr>
            `;
            return;
        }

        usersTableBody.innerHTML = users.map(user => `
            <tr>
                <td>
                    <div class="user-info">
                        ${user.avatar ? 
                            `<img src="${user.avatar}" alt="${user.name || 'User'}" class="user-avatar">` : 
                            `<div class="avatar-placeholder">${(user.name || 'U').charAt(0).toUpperCase()}</div>`
                        }
                        <div class="user-details">
                            <div class="user-name">${user.name || 'Unknown User'}</div>
                            <div class="user-id">ID: ${user.id}</div>
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
                        <button class="btn btn-sm btn-secondary edit-user-btn" data-user-id="${user.id}" title="Edit User">
                            <i data-lucide="edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger delete-user-btn" data-user-id="${user.id}" title="Delete User">
                            <i data-lucide="trash-2"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        this.initializeLucideIcons();
        this.attachUserActionListeners();
    }

    attachUserActionListeners() {
        // Edit user buttons
        document.querySelectorAll('.edit-user-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const userId = e.target.closest('.edit-user-btn').getAttribute('data-user-id');
                this.editUser(userId);
            });
        });

        // Delete user buttons
        document.querySelectorAll('.delete-user-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const userId = e.target.closest('.delete-user-btn').getAttribute('data-user-id');
                this.deleteUser(userId);
            });
        });
    }

    showUsersLoadingSkeleton() {
        const usersTableBody = document.getElementById('usersTableBody');
        if (!usersTableBody) return;

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
        
        usersTableBody.innerHTML = skeletonRows;
    }

    showUsersErrorState() {
        const usersTableBody = document.getElementById('usersTableBody');
        if (!usersTableBody) return;

        usersTableBody.innerHTML = `
            <tr>
                <td colspan="5" class="error-state">
                    <div style="display: flex; flex-direction: column; align-items: center; padding: 2rem; color: #ef4444;">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                        <span style="margin-top: 0.5rem; font-weight: 500;">Failed to load users</span>
                        <button class="retry-users-btn" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #ef4444; color: white; border: none; border-radius: 0.375rem; cursor: pointer;">
                            Retry
                        </button>
                    </div>
                </td>
            </tr>
        `;
        
        // Attach retry button event listener
        const retryBtn = usersTableBody.querySelector('.retry-users-btn');
        if (retryBtn) {
            retryBtn.addEventListener('click', () => {
                this.loadUsers();
            });
        }
    }


    // Modal functions
    showModal(title, content) {
        if (this.modalTitle) this.modalTitle.textContent = title;
        if (this.modalBody) this.modalBody.innerHTML = content;
        if (this.modalOverlay) this.modalOverlay.classList.add('active');
        
        this.initializeLucideIcons();
    }

    closeModal() {
        if (this.modalOverlay) this.modalOverlay.classList.remove('active');
    }

    // Action modals
    showAddEventModal() {
        const content = `
            <form id="addEventForm" class="modal-form">
                <div class="form-group">
                    <label for="eventTitle">Event Title</label>
                    <input type="text" id="eventTitle" name="title" required>
                </div>
                <div class="form-group">
                    <label for="eventDescription">Description</label>
                    <textarea id="eventDescription" name="description" rows="3"></textarea>
                </div>
                <div class="form-group">
                    <label for="eventDate">Date & Time</label>
                    <input type="datetime-local" id="eventDate" name="date" required>
                </div>
                <div class="form-group">
                    <label for="eventCategory">Category</label>
                    <select id="eventCategory" name="category">
                        <option value="academic">Academic</option>
                        <option value="sports">Sports</option>
                        <option value="cultural">Cultural</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn btn-outline" data-action="close-modal">Cancel</button>
                    <button type="submit" class="btn btn-primary">Create Event</button>
                </div>
            </form>
        `;
        
        this.showModal('Create New Event', content);
        
        // Bind form submission
        document.getElementById('addEventForm')?.addEventListener('submit', (e) => this.createEvent(e));
    }


    showAddGalleryModal() {
        const content = `
            <form id="addGalleryForm" class="modal-form">
                <div class="form-group">
                    <label for="galleryTitle">Title</label>
                    <input type="text" id="galleryTitle" name="title" required>
                </div>
                <div class="form-group">
                    <label for="galleryImage">Image</label>
                    <input type="file" id="galleryImage" name="image" accept="image/*" required>
                </div>
                <div class="form-group">
                    <label for="galleryCategory">Category</label>
                    <select id="galleryCategory" name="category">
                        <option value="events">Events</option>
                        <option value="students">Students</option>
                        <option value="faculty">Faculty</option>
                        <option value="campus">Campus</option>
                    </select>
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn btn-outline" data-action="close-modal">Cancel</button>
                    <button type="submit" class="btn btn-primary">Upload Image</button>
                </div>
            </form>
        `;
        
        this.showModal('Upload Image to Gallery', content);
        
        // Bind form submission
        document.getElementById('addGalleryForm')?.addEventListener('submit', (e) => this.createGalleryItem(e));
    }

    showAddUserModal() {
        const content = `
            <form id="addUserForm" class="modal-form">
                <div class="form-group">
                    <label for="userName">Full Name</label>
                    <input type="text" id="userName" name="name" required>
                </div>
                <div class="form-group">
                    <label for="userEmail">Email</label>
                    <input type="email" id="userEmail" name="email" required>
                </div>
                <div class="form-group">
                    <label for="userRole">Role</label>
                    <select id="userRole" name="role">
                        <option value="user">User</option>
                        <option value="moderator">Moderator</option>
                        <option value="admin">Administrator</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="userPassword">Password</label>
                    <input type="password" id="userPassword" name="password" required>
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn btn-outline" data-action="close-modal">Cancel</button>
                    <button type="submit" class="btn btn-primary">Create User</button>
                </div>
            </form>
        `;
        
        this.showModal('Create New User', content);
        
        // Bind form submission
        document.getElementById('addUserForm')?.addEventListener('submit', (e) => this.createUser(e));
    }

    // Form submission handlers
    async createEvent(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        
        try {
            const response = await fetch('/api/events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            
            if (response.ok) {
                this.showToast('Event created successfully', 'success');
                this.closeModal();
                this.loadEvents();
            } else {
                this.showToast('Failed to create event', 'error');
            }
        } catch (error) {
            console.error('Error creating event:', error);
            this.showToast('Failed to create event', 'error');
        }
    }


    async createGalleryItem(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        try {
            const response = await fetch('/api/gallery', {
                method: 'POST',
                body: formData
            });
            
            if (response.ok) {
                this.showToast('Image uploaded successfully', 'success');
                this.closeModal();
                this.loadGallery();
            } else {
                this.showToast('Failed to upload image', 'error');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            this.showToast('Failed to upload image', 'error');
        }
    }

    async createUser(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        
        try {
            const response = await fetch('/api/admin/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            
            if (response.ok) {
                this.showToast('User created successfully', 'success');
                this.closeModal();
                this.loadUsers();
            } else {
                this.showToast('Failed to create user', 'error');
            }
        } catch (error) {
            console.error('Error creating user:', error);
            this.showToast('Failed to create user', 'error');
        }
    }

    async clearCache() {
        try {
            const response = await fetch('/api/cache/clear', {
                method: 'DELETE'
            });
            
            if (response.ok) {
                this.showToast('Cache cleared successfully', 'success');
                this.loadCacheStats();
            } else {
                this.showToast('Failed to clear cache', 'error');
            }
        } catch (error) {
            console.error('Error clearing cache:', error);
            this.showToast('Failed to clear cache', 'error');
        }
    }

    // Edit and delete functions
    async editEvent(id) {
        try {
            const response = await fetch(`/api/admin/events/${id}`);
            const data = await response.json();
            
            if (response.ok) {
                this.showEditEventModal(data.event);
            } else {
                this.showToast('Error loading event data', 'error');
            }
        } catch (error) {
            console.error('Error loading event:', error);
            this.showToast('Failed to load event data', 'error');
        }
    }

    async deleteEvent(id) {
        if (confirm('Are you sure you want to delete this event?')) {
            try {
                const response = await fetch(`/api/admin/events/${id}`, {
                    method: 'DELETE'
                });
                
                if (response.ok) {
                    this.showToast('Event deleted successfully', 'success');
                    this.loadEvents();
                } else {
                    this.showToast('Failed to delete event', 'error');
                }
            } catch (error) {
                console.error('Error deleting event:', error);
                this.showToast('Failed to delete event', 'error');
            }
        }
    }


    async editGalleryItem(id) {
        try {
            const response = await fetch(`/api/admin/gallery/${id}`);
            const data = await response.json();
            
            if (response.ok) {
                this.showEditGalleryModal(data.gallery);
            } else {
                this.showToast('Error loading gallery data', 'error');
            }
        } catch (error) {
            console.error('Error loading gallery item:', error);
            this.showToast('Failed to load gallery data', 'error');
        }
    }

    async deleteGalleryItem(id) {
        if (confirm('Are you sure you want to delete this gallery item?')) {
            try {
                const response = await fetch(`/api/admin/gallery/${id}`, {
                    method: 'DELETE'
                });
                
                if (response.ok) {
                    this.showToast('Gallery item deleted successfully', 'success');
                    this.loadGallery();
                } else {
                    this.showToast('Failed to delete gallery item', 'error');
                }
            } catch (error) {
                console.error('Error deleting gallery item:', error);
                this.showToast('Failed to delete gallery item', 'error');
            }
        }
    }

    async editUser(id) {
        try {
            const response = await fetch(`/api/admin/users/${id}`);
            const data = await response.json();
            
            if (response.ok) {
                this.showEditUserModal(data.user);
            } else {
                this.showToast('Error loading user data', 'error');
            }
        } catch (error) {
            console.error('Error loading user:', error);
            this.showToast('Failed to load user data', 'error');
        }
    }

    async deleteUser(id) {
        if (confirm('Are you sure you want to delete this user?')) {
            try {
                const response = await fetch(`/api/admin/users/${id}`, {
                    method: 'DELETE'
                });
                
                if (response.ok) {
                    this.showToast('User deleted successfully', 'success');
                    this.loadUsers();
                } else {
                    this.showToast('Failed to delete user', 'error');
                }
            } catch (error) {
                console.error('Error deleting user:', error);
                this.showToast('Failed to delete user', 'error');
            }
        }
    }

    // Utility functions
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

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div class="toast-icon">
                <i data-lucide="${this.getToastIcon(type)}"></i>
            </div>
            <div class="toast-content">
                <div class="toast-title">${type.charAt(0).toUpperCase() + type.slice(1)}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close" aria-label="Close notification">
                <i data-lucide="x"></i>
            </button>
        `;
        
        // Add event listener for close button
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentElement) {
                    toast.remove();
                }
            }, 300);
        });
        
        this.toastContainer.appendChild(toast);
        
        // Initialize Lucide icons for the toast
        this.initializeLucideIcons();
        
        // Show toast
        setTimeout(() => toast.classList.add('show'), 100);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentElement) {
                    toast.remove();
                }
            }, 300);
        }, 5000);
    }

    getToastIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'x-circle',
            warning: 'alert-triangle',
            info: 'info'
        };
        return icons[type] || 'info';
    }

    // Edit modal methods
    showEditEventModal(event) {
        const content = `
            <form id="editEventForm" class="modal-form">
                <input type="hidden" name="id" value="${event._id}">
                <div class="form-group">
                    <label for="editEventTitle">Event Title</label>
                    <input type="text" id="editEventTitle" name="title" value="${event.title}" required>
                </div>
                <div class="form-group">
                    <label for="editEventDescription">Description</label>
                    <textarea id="editEventDescription" name="description" rows="3">${event.description}</textarea>
                </div>
                <div class="form-group">
                    <label for="editEventDate">Date & Time</label>
                    <input type="datetime-local" id="editEventDate" name="date" value="${event.date}" required>
                </div>
                <div class="form-group">
                    <label for="editEventCategory">Category</label>
                    <select id="editEventCategory" name="category">
                        <option value="academic" ${event.category === 'academic' ? 'selected' : ''}>Academic</option>
                        <option value="sports" ${event.category === 'sports' ? 'selected' : ''}>Sports</option>
                        <option value="cultural" ${event.category === 'cultural' ? 'selected' : ''}>Cultural</option>
                        <option value="other" ${event.category === 'other' ? 'selected' : ''}>Other</option>
                    </select>
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn btn-outline" data-action="close-modal">Cancel</button>
                    <button type="submit" class="btn btn-primary">Update Event</button>
                </div>
            </form>
        `;
        
        this.showModal('Edit Event', content);
        
        // Bind form submission
        document.getElementById('editEventForm')?.addEventListener('submit', (e) => this.updateEvent(e));
    }


    showEditGalleryModal(gallery) {
        const content = `
            <form id="editGalleryForm" class="modal-form">
                <input type="hidden" name="id" value="${gallery._id}">
                <div class="form-group">
                    <label for="editGalleryTitle">Title</label>
                    <input type="text" id="editGalleryTitle" name="title" value="${gallery.title}" required>
                </div>
                <div class="form-group">
                    <label for="editGalleryCategory">Category</label>
                    <select id="editGalleryCategory" name="category">
                        <option value="events" ${gallery.category === 'events' ? 'selected' : ''}>Events</option>
                        <option value="students" ${gallery.category === 'students' ? 'selected' : ''}>Students</option>
                        <option value="faculty" ${gallery.category === 'faculty' ? 'selected' : ''}>Faculty</option>
                        <option value="campus" ${gallery.category === 'campus' ? 'selected' : ''}>Campus</option>
                    </select>
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn btn-outline" data-action="close-modal">Cancel</button>
                    <button type="submit" class="btn btn-primary">Update Gallery Item</button>
                </div>
            </form>
        `;
        
        this.showModal('Edit Gallery Item', content);
        
        // Bind form submission
        document.getElementById('editGalleryForm')?.addEventListener('submit', (e) => this.updateGalleryItem(e));
    }

    showEditUserModal(user) {
        const content = `
            <form id="editUserForm" class="modal-form">
                <input type="hidden" name="id" value="${user._id}">
                <div class="form-group">
                    <label for="editUserName">Full Name</label>
                    <input type="text" id="editUserName" name="name" value="${user.name}" required>
                </div>
                <div class="form-group">
                    <label for="editUserEmail">Email</label>
                    <input type="email" id="editUserEmail" name="email" value="${user.email}" required>
                </div>
                <div class="form-group">
                    <label for="editUserRole">Role</label>
                    <select id="editUserRole" name="role">
                        <option value="user" ${user.role === 'user' ? 'selected' : ''}>User</option>
                        <option value="moderator" ${user.role === 'moderator' ? 'selected' : ''}>Moderator</option>
                        <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Administrator</option>
                    </select>
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn btn-outline" data-action="close-modal">Cancel</button>
                    <button type="submit" class="btn btn-primary">Update User</button>
                </div>
            </form>
        `;
        
        this.showModal('Edit User', content);
        
        // Bind form submission
        document.getElementById('editUserForm')?.addEventListener('submit', (e) => this.updateUser(e));
    }

    // Update form handlers
    async updateEvent(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        const id = data.id;
        delete data.id;
        
        try {
            const response = await fetch(`/api/admin/events/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            
            if (response.ok) {
                this.showToast('Event updated successfully', 'success');
                this.closeModal();
                this.loadEvents();
            } else {
                this.showToast('Failed to update event', 'error');
            }
        } catch (error) {
            console.error('Error updating event:', error);
            this.showToast('Failed to update event', 'error');
        }
    }


    async updateGalleryItem(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        const id = data.id;
        delete data.id;
        
        try {
            const response = await fetch(`/api/admin/gallery/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            
            if (response.ok) {
                this.showToast('Gallery item updated successfully', 'success');
                this.closeModal();
                this.loadGallery();
            } else {
                this.showToast('Failed to update gallery item', 'error');
            }
        } catch (error) {
            console.error('Error updating gallery item:', error);
            this.showToast('Failed to update gallery item', 'error');
        }
    }

    async updateUser(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        const id = data.id;
        delete data.id;
        
        try {
            const response = await fetch(`/api/admin/users/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            
            if (response.ok) {
                this.showToast('User updated successfully', 'success');
                this.closeModal();
                this.loadUsers();
            } else {
                this.showToast('Failed to update user', 'error');
            }
        } catch (error) {
            console.error('Error updating user:', error);
            this.showToast('Failed to update user', 'error');
        }
    }

    // Theme management
    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        this.updateThemeIcon();
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        localStorage.setItem('admin-theme', this.currentTheme);
        this.applyTheme();
        this.showToast(`Switched to ${this.currentTheme} mode`, 'success');
    }

    updateThemeIcon() {
        if (this.themeIcon) {
            this.themeIcon.setAttribute('data-lucide', this.currentTheme === 'light' ? 'moon' : 'sun');
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }
    }

    // Search functionality
    showSearchModal() {
        const searchContent = `
            <div class="search-container">
                <div class="search-input-wrapper">
                    <i data-lucide="search" class="search-icon"></i>
                    <input type="text" id="searchInput" placeholder="Search events, gallery, users..." class="search-input">
                </div>
                <div class="search-filters">
                    <select id="searchFilter" class="filter-select">
                        <option value="all">All Content</option>
                        <option value="events">Events</option>
                        <option value="gallery">Gallery</option>
                        <option value="users">Users</option>
                    </select>
                </div>
                <div id="searchResults" class="search-results">
                    <p class="search-placeholder">Start typing to search...</p>
                </div>
            </div>
        `;
        
        this.showModal('Search', searchContent);
        
        // Initialize search functionality
        const searchInput = document.getElementById('searchInput');
        const searchFilter = document.getElementById('searchFilter');
        const searchResults = document.getElementById('searchResults');
        
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.performSearch(e.target.value, searchFilter.value, searchResults));
            searchInput.focus();
        }
        
        if (searchFilter) {
            searchFilter.addEventListener('change', (e) => this.performSearch(searchInput.value, e.target.value, searchResults));
        }
        
        // Initialize Lucide icons in the modal
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    async performSearch(query, filter, resultsContainer) {
        if (!query.trim()) {
            resultsContainer.innerHTML = '<p class="search-placeholder">Start typing to search...</p>';
            return;
        }

        try {
            resultsContainer.innerHTML = '<div class="loading">Searching...</div>';
            
            // Perform search based on filter
            let searchResults = [];
            
            switch (filter) {
                case 'events':
                    searchResults = await this.searchEvents(query);
                    break;
                case 'gallery':
                    searchResults = await this.searchGallery(query);
                    break;
                case 'users':
                    searchResults = await this.searchUsers(query);
                    break;
                case 'all':
                default:
                    searchResults = await this.searchAll(query);
                    break;
            }
            
            this.displaySearchResults(searchResults, resultsContainer);
        } catch (error) {
            resultsContainer.innerHTML = '<p class="search-error">Error performing search. Please try again.</p>';
            console.error('Search error:', error);
        }
    }

    async searchAll(query) {
        const results = [];
        
        try {
            const [events, gallery, users] = await Promise.all([
                this.searchEvents(query),
                this.searchGallery(query),
                this.searchUsers(query)
            ]);

            results.push(...events.map(item => ({ ...item, type: 'event' })));
            results.push(...gallery.map(item => ({ ...item, type: 'gallery' })));
            results.push(...users.map(item => ({ ...item, type: 'user' })));
            
        } catch (error) {
            console.error('Search all error:', error);
        }
        
        return results;
    }

    async searchEvents(query) {
        try {
            const response = await fetch(`/api/admin/events?search=${encodeURIComponent(query)}`);
            const data = await response.json();
            return data.events || [];
        } catch (error) {
            console.error('Search events error:', error);
            return [];
        }
    }


    async searchGallery(query) {
        try {
            const response = await fetch(`/api/admin/gallery?search=${encodeURIComponent(query)}`);
            const data = await response.json();
            return data.gallery || [];
        } catch (error) {
            console.error('Search gallery error:', error);
            return [];
        }
    }

    async searchUsers(query) {
        try {
            const response = await fetch(`/api/admin/users?search=${encodeURIComponent(query)}`);
            const data = await response.json();
            return data.users || [];
        } catch (error) {
            console.error('Search users error:', error);
            return [];
        }
    }

    displaySearchResults(results, container) {
        if (results.length === 0) {
            container.innerHTML = '<p class="search-no-results">No results found.</p>';
            return;
        }

        const resultsHtml = results.map(result => {
            const icon = this.getSearchResultIcon(result.type);
            const title = result.title || result.name || result.username || 'Untitled';
            const description = result.description || result.content || result.email || '';
            
            return `
                <div class="search-result-item" data-type="${result.type}" data-id="${result._id}">
                    <div class="search-result-icon">
                        <i data-lucide="${icon}"></i>
                    </div>
                    <div class="search-result-content">
                        <h4 class="search-result-title">${title}</h4>
                        <p class="search-result-description">${description.substring(0, 100)}${description.length > 100 ? '...' : ''}</p>
                        <span class="search-result-type">${result.type}</span>
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = `
            <div class="search-results-list">
                ${resultsHtml}
            </div>
        `;

        // Add click handlers to search results
        container.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', () => {
                const type = item.dataset.type;
                const id = item.dataset.id;
                this.navigateToSearchResult(type, id);
            });
        });

        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    getSearchResultIcon(type) {
        const icons = {
            event: 'calendar-days',
            gallery: 'image',
            user: 'user'
        };
        return icons[type] || 'file';
    }

    navigateToSearchResult(type, id) {
        this.closeModal();
        
        // Navigate to the appropriate section
        this.navigateToSection(type + 's');
        
        // Highlight the specific item (this would need to be implemented based on your table/grid structure)
        setTimeout(() => {
            const item = document.querySelector(`[data-id="${id}"]`);
            if (item) {
                item.scrollIntoView({ behavior: 'smooth', block: 'center' });
                item.classList.add('highlight');
                setTimeout(() => item.classList.remove('highlight'), 2000);
            }
        }, 500);
    }

    // Notifications functionality
    showNotificationsModal() {
        const notificationsContent = `
            <div class="notifications-container">
                <div class="notifications-header">
                    <h4>Recent Notifications</h4>
                    <button class="btn btn-sm btn-outline" id="markAllReadBtn">
                        <i data-lucide="check"></i>
                        Mark All Read
                    </button>
                </div>
                <div id="notificationsList" class="notifications-list">
                    <div class="loading">Loading notifications...</div>
                </div>
            </div>
        `;
        
        this.showModal('Notifications', notificationsContent);
        
        // Load notifications
        this.loadNotifications();
        
        // Add event listener for mark all read
        const markAllReadBtn = document.getElementById('markAllReadBtn');
        if (markAllReadBtn) {
            markAllReadBtn.addEventListener('click', () => this.markAllNotificationsRead());
        }
        
        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    async loadNotifications() {
        const notificationsList = document.getElementById('notificationsList');
        
        try {
            // For now, we'll show sample notifications
            // In a real implementation, you'd fetch from your API
            const notifications = [
                {
                    id: 1,
                    type: 'info',
                    title: 'New Event Added',
                    message: 'Annual Sports Day has been scheduled for next month.',
                    time: '2 hours ago',
                    read: false
                },
                {
                    id: 2,
                    type: 'success',
                    title: 'Event Updated',
                    message: 'New event "Annual Sports Day" has been scheduled.',
                    time: '4 hours ago',
                    read: false
                },
                {
                    id: 3,
                    type: 'warning',
                    title: 'Gallery Update',
                    message: 'New photos have been added to the gallery.',
                    time: '1 day ago',
                    read: true
                },
                {
                    id: 4,
                    type: 'info',
                    title: 'System Update',
                    message: 'Admin panel has been updated with new features.',
                    time: '2 days ago',
                    read: true
                }
            ];
            
            this.displayNotifications(notifications);
        } catch (error) {
            notificationsList.innerHTML = '<p class="notifications-error">Error loading notifications.</p>';
            console.error('Load notifications error:', error);
        }
    }

    displayNotifications(notifications) {
        const notificationsList = document.getElementById('notificationsList');
        
        if (notifications.length === 0) {
            notificationsList.innerHTML = '<p class="notifications-empty">No notifications to display.</p>';
            return;
        }

        const notificationsHtml = notifications.map(notification => {
            const icon = this.getNotificationIcon(notification.type);
            const unreadClass = notification.read ? '' : 'unread';
            
            return `
                <div class="notification-item ${unreadClass}" data-id="${notification.id}">
                    <div class="notification-icon ${notification.type}">
                        <i data-lucide="${icon}"></i>
                    </div>
                    <div class="notification-content">
                        <h5 class="notification-title">${notification.title}</h5>
                        <p class="notification-message">${notification.message}</p>
                        <span class="notification-time">${notification.time}</span>
                    </div>
                    <button class="notification-close" data-action="close-notification">
                        <i data-lucide="x"></i>
                    </button>
                </div>
            `;
        }).join('');

        notificationsList.innerHTML = notificationsHtml;
        
        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        // Attach notification close event listeners
        notificationsList.addEventListener('click', (e) => {
            if (e.target.closest('[data-action="close-notification"]')) {
                const notificationItem = e.target.closest('.notification-item');
                if (notificationItem) {
                    notificationItem.remove();
                }
            }
        });
    }

    getNotificationIcon(type) {
        const icons = {
            info: 'info',
            success: 'check-circle',
            warning: 'alert-triangle',
            error: 'x-circle'
        };
        return icons[type] || 'bell';
    }

    async markAllNotificationsRead() {
        try {
            // In a real implementation, you'd make an API call here
            // await fetch('/api/admin/notifications/mark-all-read', { method: 'POST' });
            
            // For now, just update the UI
            const unreadNotifications = document.querySelectorAll('.notification-item.unread');
            unreadNotifications.forEach(notification => {
                notification.classList.remove('unread');
            });
            
            // Remove notification dot from the bell icon
            const notificationDot = document.querySelector('.notification-dot');
            if (notificationDot) {
                notificationDot.style.display = 'none';
            }
            
            this.showToast('All notifications marked as read', 'success');
        } catch (error) {
            this.showToast('Error marking notifications as read', 'error');
            console.error('Mark all read error:', error);
        }
    }

    // ===== CONTACT REQUESTS =====
    
    loadContactRequests() {
        // Update badges when loading contact requests
        this.updateRequestBadges();
        
        // Load the contact requests page content
        const pageContent = document.getElementById('pageContent');
        if (!pageContent) return;

        pageContent.innerHTML = `
            <div id="contact-requests-dynamic" class="contact-requests-page">
                <!-- Header -->
                <div class="contact-requests-header">
                    <h1 class="contact-requests-title">Contact Requests</h1>
                    <p class="contact-requests-subtitle">Manage and respond to user inquiries.</p>
                </div>

                <!-- Stats Cards -->
                <div class="stats-grid">
                    <div class="stat-card" id="totalRequests">
                        <div class="stat-header">
                            <span class="stat-title">Total Requests</span>
                            <div class="stat-icon total">
                                <i data-lucide="mail"></i>
                            </div>
                        </div>
                        <div class="stat-value">0</div>
                    </div>
                    <div class="stat-card" id="pendingRequests">
                        <div class="stat-header">
                            <span class="stat-title">Pending Replies</span>
                            <div class="stat-icon pending">
                                <i data-lucide="clock"></i>
                            </div>
                        </div>
                        <div class="stat-value">0</div>
                    </div>
                    <div class="stat-card" id="respondedRequests">
                        <div class="stat-header">
                            <span class="stat-title">Responded</span>
                            <div class="stat-icon responded">
                                <i data-lucide="check-circle"></i>
                            </div>
                        </div>
                        <div class="stat-value">0</div>
                    </div>
                </div>

                <!-- Search and Filter Bar -->
                <div class="search-filter-bar">
                    <div class="search-input-group">
                        <i data-lucide="search" class="search-icon"></i>
                        <input type="text" id="contactSearchInput" class="search-input" placeholder="Search by full name...">
                    </div>
                    <div class="filter-buttons">
                        <button class="filter-btn" id="contactFilterBtn">
                            <i data-lucide="filter"></i>
                            Filter by status
                        </button>
                        <button class="sort-btn" id="contactSortBtn">
                            <i data-lucide="menu"></i>
                            Sort by Date
                        </button>
                    </div>
                </div>

                <!-- Contact Requests Table -->
                <div class="contact-requests-table-container">
                    <table class="contact-requests-table" id="contactRequestsTable">
                        <thead>
                            <tr>
                                <th style="width: 40px; min-width: 40px; max-width: 40px;">S.N</th>
                                <th style="width: 40px; min-width: 40px; max-width: 40px;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin: 0 auto; display: block;">
                                        <circle cx="12" cy="12" r="3"></circle>
                                        <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1"></path>
                                    </svg>
                                </th>
                                <th>FULL NAME</th>
                                <th>CONTACT</th>
                                <th style="width: 300px;">MESSAGE</th>
                                <th style="width: 300px;">REPLIED MESSAGE</th>
                                <th style="width: 100px;">STATUS</th>
                                <th>SUBMITTED AT</th>
                            </tr>
                        </thead>
                        <tbody id="contactRequestsTableBody">
                            <tr>
                                <td colspan="8" class="text-center py-8">
                                    <div class="loading-spinner"></div>
                                    <p class="text-gray-500 mt-2">Loading contact requests...</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Pagination -->
                <div class="pagination-container">
                    <div class="pagination-info">
                        <span>Showing 1 to 3 of 120 results</span>
                    </div>
                    <div class="pagination-controls">
                        <button class="pagination-btn" disabled>Previous</button>
                        <button class="pagination-btn active">1</button>
                        <button class="pagination-btn">2</button>
                        <button class="pagination-btn">3</button>
                        <button class="pagination-btn">Next</button>
                    </div>
                </div>
            </div>
        `;

        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        // Initialize the contact requests loader with a small delay to ensure DOM is ready
        setTimeout(() => {
            if (window.ContactRequestsLoader) {
                // Only create if it doesn't exist or if we need to reinitialize
                if (!window.contactRequestsLoader) {
                    window.contactRequestsLoader = new ContactRequestsLoader();
                    console.log('ContactRequestsLoader initialized for contact requests page');
                } else {
                    // Reset the flags to allow re-initialization
                    window.contactRequestsLoader.eventsBound = false;
                    window.contactRequestsLoader.isInitialized = false;
                    window.contactRequestsLoader.init();
                    console.log('ContactRequestsLoader reinitialized for contact requests page');
                }
            } else {
                console.error('ContactRequestsLoader not available');
            }
        }, 100);
    }
}

// Initialize admin panel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.adminPanel = new AdminPanel();
    
    // Make badge update method available globally
    window.updateRequestBadges = () => {
        if (window.adminPanel) {
            window.adminPanel.updateRequestBadges();
        }
    };

    // Make force update method available globally for testing
    window.forceUpdateUserProfile = () => {
        if (window.adminPanel) {
            window.adminPanel.forceUpdateUserProfile();
        }
    };
});
