/**
 * Dashboard Manager
 * Handles dynamic loading and management of the dashboard section
 */
class DashboardManager {
    constructor() {
        this.currentSection = 'dashboard';
        this.dashboardData = null;
        this.init();
    }

    init() {
        this.bindEvents();
        
        // Auto-load dashboard if it's the default section or no section is active
        this.autoLoadDashboard();
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Dashboard section click
        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-section="dashboard"]')) {
                e.preventDefault();
                this.loadDashboard();
            }
        });
    }

    /**
     * Auto-load dashboard on page load
     */
    autoLoadDashboard() {
        // Always auto-load dashboard on page load for now
        this.loadDashboard();
    }

    /**
     * Load dashboard section dynamically with optimized loading
     */
    async loadDashboard() {
        try {
            // Show loading state
            this.showLoadingState();
            
            // Fetch dashboard data with timeout protection
            await this.fetchDashboardData();
            
            // Get dashboard content
            const content = this.getDashboardContent();
            
            // Inject content into page-content
            this.injectContent(content);
            
            // Initialize dashboard functionality
            this.initializeDashboard();
            
            // Update navigation
            this.updateNavigation();
            
        } catch (error) {
            console.error('Error loading dashboard section:', error);
            this.showError('Failed to load dashboard section');
        }
    }

    /**
     * Show loading state
     */
    showLoadingState() {
        const pageContent = document.getElementById('pageContent');
        if (pageContent) {
            pageContent.innerHTML = `
                <div class="loading-container">
                    <div class="loading-spinner"></div>
                    <p>Loading dashboard...</p>
                </div>
            `;
        }
    }

    /**
     * Fetch dashboard data from API
     */
    async fetchDashboardData() {
        try {
            // Use AbortController for timeout protection
            const controller = new AbortController();
            const timeoutId = setTimeout(() => {
                controller.abort();
            }, 8000); // 8 second timeout
            
            const response = await fetch('/api/admin/dashboard', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            this.dashboardData = await response.json();
        } catch (error) {
            if (error.name === 'AbortError') {
            } else {
                console.error('❌ Error fetching dashboard data:', error);
            }
            // Use fallback data if API fails
            this.dashboardData = {
                totalUsers: 0,
                totalEvents: 0,
                totalGalleries: 0,
                featuredEvents: 0,
                featuredGalleries: 0,
                totalHomepageContent: 0,
                totalAboutContent: 0,
                totalContactContent: 0,
                totalAdmissionApplications: 0
            };
        }
    }

    /**
     * Get dashboard content HTML
     */
    getDashboardContent() {
        const data = this.dashboardData || {};
        
        return `
            <section id="dashboard-section" class="content-section active">
                <div class="page-header">
                    <div class="page-title">
                        <h1>Dashboard Overview</h1>
                        <p>Welcome back! Here's what's happening with your school today.</p>
                    </div>
                    <div class="page-actions">
                        <button class="btn btn-outline" id="refreshDashboard">
                            <i data-lucide="refresh-cw"></i>
                            Refresh Data
                        </button>
                    </div>
                </div>

                <!-- Stats Grid -->
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-header">
                            <div class="stat-icon primary">
                                <i data-lucide="users"></i>
                            </div>
                            <div class="stat-trend positive">
                                <i data-lucide="trending-up"></i>
                                <span>+12.5%</span>
                            </div>
                        </div>
                        <div class="stat-content">
                            <h3 class="stat-value">${data.totalUsers || 0}</h3>
                            <p class="stat-label">Total Users</p>
                        </div>
                    </div>

                    <div class="stat-card">
                        <div class="stat-header">
                            <div class="stat-icon success">
                                <i data-lucide="calendar"></i>
                            </div>
                            <div class="stat-trend positive">
                                <i data-lucide="trending-up"></i>
                                <span>+8.2%</span>
                            </div>
                        </div>
                        <div class="stat-content">
                            <h3 class="stat-value">${data.totalEvents || 0}</h3>
                            <p class="stat-label">Total Events</p>
                        </div>
                    </div>


                    <div class="stat-card">
                        <div class="stat-header">
                            <div class="stat-icon info">
                                <i data-lucide="image"></i>
                            </div>
                            <div class="stat-trend positive">
                                <i data-lucide="trending-up"></i>
                                <span>+15.3%</span>
                            </div>
                        </div>
                        <div class="stat-content">
                            <h3 class="stat-value">${data.totalGalleries || 0}</h3>
                            <p class="stat-label">Gallery Items</p>
                        </div>
                    </div>
                </div>


                <!-- Content Grid -->
                <div class="content-grid">
                    <!-- Recent Activity -->
                    <!--
                    <div class="content-card">
                        <div class="card-header">
                            <h3>Recent Activity</h3>
                            <button class="btn btn-sm btn-outline" id="viewAllActivity">View All</button>
                        </div>
                        <div class="card-content">
                            <div class="activity-list" id="activityList">
                                <div class="activity-item">
                                    <div class="activity-icon success">
                                        <i data-lucide="user-plus"></i>
                                    </div>
                                    <div class="activity-content">
                                        <h4>New User Registration</h4>
                                        <p>New user registered in the system</p>
                                        <span class="activity-time">2 minutes ago</span>
                                    </div>
                                </div>
                                <div class="activity-item">
                                    <div class="activity-icon primary">
                                        <i data-lucide="calendar"></i>
                                    </div>
                                    <div class="activity-content">
                                        <h4>Event Created</h4>
                                        <p>New event added to the calendar</p>
                                        <span class="activity-time">1 hour ago</span>
                                    </div>
                                </div>
                                <div class="activity-item">
                                    <div class="activity-icon info">
                                        <i data-lucide="image-plus"></i>
                                    </div>
                                    <div class="activity-content">
                                        <h4>Gallery Updated</h4>
                                        <p>New images added to gallery</p>
                                        <span class="activity-time">5 hours ago</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    -->

                    <!-- Quick Actions -->
                    <div class="content-card">
                        <div class="card-header">
                            <h3>Quick Actions</h3>
                        </div>
                        <div class="card-content">
                            <div class="quick-actions">
                                <button class="quick-action-btn" data-action="manage-users">
                                    <i data-lucide="users"></i>
                                    <span>Manage Users</span>
                                </button>
                                <button class="quick-action-btn" data-action="create-event">
                                    <i data-lucide="calendar-plus"></i>
                                    <span>Create Event</span>
                                </button>
                                <button class="quick-action-btn" data-action="upload-image">
                                    <i data-lucide="image-plus"></i>
                                    <span>Upload Image</span>
                                </button>
                                <button class="quick-action-btn" data-action="manage-gallery">
                                    <i data-lucide="image"></i>
                                    <span>Manage Gallery</span>
                                </button>
                                <button class="quick-action-btn" data-action="settings">
                                    <i data-lucide="settings"></i>
                                    <span>Settings</span>
                                </button>
                            </div>
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
     * Initialize dashboard functionality
     */
    initializeDashboard() {
        // Bind quick action buttons
        this.bindQuickActions();
        
        // Bind header action buttons
        this.bindHeaderActions();
        
        // Initialize any dashboard-specific functionality
        this.initializeStats();
        // this.initializeActivity(); // Commented out - Recent Activity card is commented out
    }

    /**
     * Bind header action button events
     */
    bindHeaderActions() {
        // Refresh dashboard button
        const refreshBtn = document.getElementById('refreshDashboard');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.refreshDashboard();
            });
        }

        // Export report button
        const exportBtn = document.getElementById('exportReport');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportReport();
            });
        }

        // Quick action button
        const quickActionBtn = document.getElementById('quickAction');
        if (quickActionBtn) {
            quickActionBtn.addEventListener('click', () => {
                this.showQuickActionMenu();
            });
        }
    }

    /**
     * Bind quick action button events
     */
    bindQuickActions() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.quick-action-btn')) {
                const button = e.target.closest('.quick-action-btn');
                const action = button.getAttribute('data-action');
                this.handleQuickAction(action);
            }
        });
    }

    /**
     * Handle quick action button clicks
     */
    handleQuickAction(action) {
        switch (action) {
            case 'manage-users':
                this.navigateToSection('users');
                break;
            case 'create-event':
                this.navigateToSection('events-content');
                break;
            case 'write-blog':
                this.showNotification('Write Blog', 'Blog editor will be opened');
                break;
            case 'upload-image':
                this.navigateToSection('gallery');
                break;
            case 'manage-gallery':
                this.navigateToSection('gallery');
                break;
            case 'settings':
                this.navigateToSection('website-settings');
                break;
            default:
                this.showNotification('Action', `${action} action will be implemented`);
        }
    }

    /**
     * Navigate to a specific section
     */
    navigateToSection(section) {
        const sectionLink = document.querySelector(`[data-section="${section}"]`);
        if (sectionLink) {
            sectionLink.click();
        }
    }

    /**
     * Refresh dashboard data
     */
    async refreshDashboard() {
        try {
            this.showLoadingState();
            await this.fetchDashboardData();
            const content = this.getDashboardContent();
            this.injectContent(content);
            this.initializeDashboard();
            this.showNotification('Success', 'Dashboard data refreshed successfully');
        } catch (error) {
            console.error('Error refreshing dashboard:', error);
            this.showNotification('Error', 'Failed to refresh dashboard data');
        }
    }

    /**
     * Export dashboard report
     */
    exportReport() {
        this.showNotification('Export Report', 'Report export functionality will be implemented');
    }

    /**
     * Show quick action menu
     */
    showQuickActionMenu() {
        this.showNotification('Quick Actions', 'Quick action menu will be implemented');
    }

    /**
     * Initialize stats functionality
     */
    initializeStats() {
        // Add animation to stat cards
        const statCards = document.querySelectorAll('.stat-card');
        statCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            card.classList.add('animate-in');
        });
    }

    /**
     * Initialize activity functionality
     */
    initializeActivity() {
        // Bind view all activity button
        const viewAllBtn = document.getElementById('viewAllActivity');
        if (viewAllBtn) {
            viewAllBtn.addEventListener('click', () => {
                this.showNotification('View All Activity', 'Activity log will be opened');
            });
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
        
        // Add active class to dashboard link
        const dashboardLink = document.querySelector('[data-section="dashboard"]');
        if (dashboardLink) {
            dashboardLink.classList.add('active');
        }
    }

    /**
     * Show notification
     */
    showNotification(title, message) {
        // Use unified notification system
        window.NotificationManager.info(title, message);
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

// Initialize immediately when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.dashboardManager = new DashboardManager();
    
    // Force load dashboard after a short delay
    setTimeout(() => {
        if (window.dashboardManager) {
            window.dashboardManager.loadDashboard();
        }
    }, 100);
});

// Fallback initialization on window load
window.addEventListener('load', () => {
    const pageContent = document.getElementById('pageContent');
    if (pageContent && (pageContent.innerHTML.trim() === '' || pageContent.innerHTML.includes('Content will be loaded dynamically'))) {
        if (window.dashboardManager) {
            window.dashboardManager.loadDashboard();
        } else {
            window.dashboardManager = new DashboardManager();
        }
    }
});
