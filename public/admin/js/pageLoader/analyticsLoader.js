/**
 * Analytics Manager
 * Handles dynamic loading and management of the analytics section
 */
class AnalyticsManager {
    constructor() {
        this.currentSection = 'analytics';
        this.charts = {};
        this.currentPeriod = '30d';
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadChartJS();
    }

    /**
     * Load Chart.js library dynamically
     */
    async loadChartJS() {
        if (typeof Chart !== 'undefined') {
            return; // Chart.js already loaded
        }

        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            // Use the UMD version instead of ES module version
            script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.js';
            script.onload = () => {
                resolve();
            };
            script.onerror = () => {
                console.error('❌ Failed to load Chart.js');
                // Try fallback CDN
                const fallbackScript = document.createElement('script');
                fallbackScript.src = 'https://unpkg.com/chart.js@4.4.0/dist/chart.umd.js';
                fallbackScript.onload = () => {
                    resolve();
                };
                fallbackScript.onerror = () => {
                    console.error('❌ All Chart.js CDNs failed');
                    reject(new Error('Failed to load Chart.js from all sources'));
                };
                document.head.appendChild(fallbackScript);
            };
            document.head.appendChild(script);
        });
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Analytics section click
        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-section="analytics"]')) {
                e.preventDefault();
                this.loadAnalytics();
            }
        });

        // Time filter change
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('analytics-time-filter')) {
                this.currentPeriod = e.target.value;
                this.loadAnalytics();
            }
        });

        // Refresh button
        document.addEventListener('click', (e) => {
            if (e.target.closest('.analytics-refresh-btn')) {
                e.preventDefault();
                this.loadAnalytics();
            }
        });
    }

    /**
     * Load analytics section dynamically
     */
    async loadAnalytics() {
        try {
            // Show loading state
            this.showLoadingState();
            
            // Ensure Chart.js is loaded
            await this.loadChartJS();
            
            // Fetch analytics data
            await this.fetchAnalyticsData();
            
            // Get analytics content
            const content = this.getAnalyticsContent();
            
            // Inject content into page-content
            this.injectContent(content);
            
            // Initialize analytics functionality
            await this.initializeAnalytics();
            
            // Update navigation
            this.updateNavigation();
            
        } catch (error) {
            console.error('Error loading analytics section:', error);
            this.showError('Failed to load analytics section');
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
                    <p>Loading analytics...</p>
                </div>
            `;
        }
    }

    /**
     * Fetch analytics data from API
     */
    async fetchAnalyticsData() {
        try {
            const response = await fetch(`/api/admin/analytics?period=${this.currentPeriod}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            this.analyticsData = await response.json();
        } catch (error) {
            console.error('Error fetching analytics data:', error);
            // Use fallback data if API fails
            this.analyticsData = {
                websiteTraffic: {
                    totalVisitors: 0,
                    pageViews: 0,
                    uniqueVisitors: 0,
                    bounceRate: 0
                },
                popularPages: [],
                trafficSources: [],
                deviceStats: {
                    desktop: 0,
                    mobile: 0,
                    tablet: 0
                },
                databaseMetrics: {},
                breakdowns: {},
                recentActivity: {}
            };
        }
    }

    /**
     * Get analytics content HTML
     */
    getAnalyticsContent() {
        const data = this.analyticsData || {};
        const traffic = data.websiteTraffic || {};
        const metrics = data.databaseMetrics || {};

        return `
            <section id="analytics-section" class="content-section active">
                <div class="page-header">
                    <div class="page-title">
                        <h1>Analytics Dashboard</h1>
                        <p>Comprehensive insights and data analysis for Marigold School.</p>
                    </div>
                    <div class="page-actions">
                        <div class="time-filter">
                            <select class="analytics-time-filter filter-select">
                                <option value="7d" ${this.currentPeriod === '7d' ? 'selected' : ''}>Last 7 days</option>
                                <option value="30d" ${this.currentPeriod === '30d' ? 'selected' : ''}>Last 30 days</option>
                                <option value="90d" ${this.currentPeriod === '90d' ? 'selected' : ''}>Last 90 days</option>
                                <option value="all" ${this.currentPeriod === 'all' ? 'selected' : ''}>All time</option>
                            </select>
                        </div>
                        <button class="btn btn-outline">
                            <i data-lucide="download"></i>
                            Export Data
                        </button>
                        <button class="btn btn-primary analytics-refresh-btn">
                            <i data-lucide="refresh-cw"></i>
                            Refresh
                        </button>
                    </div>
                </div>

                <!-- Analytics Grid -->
                <div class="analytics-grid">
                    <!-- Website Traffic Overview -->
                    <div class="content-card traffic-overview">
                        <div class="card-header">
                            <h3>Website Traffic</h3>
                            <div class="traffic-stats">
                                <span class="stat-item">
                                    <span class="stat-label">Total Visitors</span>
                                    <span class="stat-value">${traffic.totalVisitors?.toLocaleString() || '0'}</span>
                                </span>
                                <span class="stat-item">
                                    <span class="stat-label">Page Views</span>
                                    <span class="stat-value">${traffic.pageViews?.toLocaleString() || '0'}</span>
                                </span>
                                <span class="stat-item">
                                    <span class="stat-label">Unique Visitors</span>
                                    <span class="stat-value">${traffic.uniqueVisitors?.toLocaleString() || '0'}</span>
                                </span>
                                <span class="stat-item">
                                    <span class="stat-label">Bounce Rate</span>
                                    <span class="stat-value">${traffic.bounceRate || '0'}%</span>
                                </span>
                            </div>
                        </div>
                        <div class="card-content">
                            <div class="analytics-chart">
                                <canvas id="trafficChart" width="400" height="200"></canvas>
                            </div>
                        </div>
                    </div>

                    <!-- Database Metrics -->
                    <div class="content-card database-metrics">
                        <div class="card-header">
                            <h3>Database Metrics</h3>
                        </div>
                        <div class="card-content">
                            <div class="metrics-grid">
                                ${Object.entries(metrics).map(([key, metric]) => `
                                    <div class="metric-card">
                                        <div class="metric-icon">
                                            <i data-lucide="${this.getMetricIcon(key)}"></i>
                                        </div>
                                        <div class="metric-info">
                                            <h4>${metric.label || key}</h4>
                                            <p class="metric-value">${metric.count?.toLocaleString() || '0'}</p>
                                            <div class="metric-details">
                                                <span class="metric-recent">Recent: ${metric.recent || 0}</span>
                                                <span class="metric-growth ${metric.growth >= 0 ? 'positive' : 'negative'}">
                                                    ${metric.growth >= 0 ? '+' : ''}${metric.growth || 0}%
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>

                    <!-- Popular Pages -->
                    <div class="content-card">
                        <div class="card-header">
                            <h3>Popular Pages</h3>
                        </div>
                        <div class="card-content">
                            <div class="popular-pages">
                                ${(data.popularPages || []).map(page => `
                                    <div class="page-item">
                                        <div class="page-info">
                                            <h4>${page.name}</h4>
                                            <p>${page.percentage}% of total traffic</p>
                                        </div>
                                        <div class="page-stats">
                                            <span class="page-views">${page.views?.toLocaleString() || '0'} views</span>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>

                    <!-- Traffic Sources -->
                    <div class="content-card">
                        <div class="card-header">
                            <h3>Traffic Sources</h3>
                        </div>
                        <div class="card-content">
                            <div class="analytics-chart">
                                <canvas id="trafficSourcesChart" width="400" height="300"></canvas>
                            </div>
                        </div>
                    </div>

                    <!-- Device Statistics -->
                    <div class="content-card">
                        <div class="card-header">
                            <h3>Device Statistics</h3>
                        </div>
                        <div class="card-content">
                            <div class="analytics-chart">
                                <canvas id="deviceStatsChart" width="400" height="300"></canvas>
                            </div>
                        </div>
                    </div>

                    <!-- Status Breakdowns -->
                    <div class="content-card">
                        <div class="card-header">
                            <h3>Application Status</h3>
                        </div>
                        <div class="card-content">
                            <div class="status-breakdown">
                                <div class="breakdown-section">
                                    <h4>Admission Applications</h4>
                                    <canvas id="admissionStatusChart" width="300" height="200"></canvas>
                                </div>
                                <div class="breakdown-section">
                                    <h4>Contact Submissions</h4>
                                    <canvas id="contactStatusChart" width="300" height="200"></canvas>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Recent Activity -->
                    <div class="content-card recent-activity">
                        <div class="card-header">
                            <h3>Recent Activity</h3>
                        </div>
                        <div class="card-content">
                            <div class="activity-sections">
                                <div class="activity-section">
                                    <h4>Recent Admissions</h4>
                                    <div class="activity-list">
                                        ${(data.recentActivity?.admissions || []).map(item => `
                                            <div class="activity-item">
                                                <div class="activity-info">
                                                    <span class="activity-name">${item.firstName} ${item.lastName}</span>
                                                    <span class="activity-status status-${item.status?.toLowerCase()}">${item.status}</span>
                                                </div>
                                                <span class="activity-time">${this.formatDate(item.createdAt)}</span>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                                <div class="activity-section">
                                    <h4>Recent Contacts</h4>
                                    <div class="activity-list">
                                        ${(data.recentActivity?.contacts || []).map(item => `
                                            <div class="activity-item">
                                                <div class="activity-info">
                                                    <span class="activity-name">${item.fullName}</span>
                                                    <span class="activity-status status-${item.status?.toLowerCase()}">${item.status}</span>
                                                </div>
                                                <span class="activity-time">${this.formatDate(item.createdAt)}</span>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
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
     * Initialize analytics functionality
     */
    async initializeAnalytics() {
        // Wait for Chart.js to be available with retries
        let retries = 0;
        const maxRetries = 20; // 2 seconds max wait time
        
        while (typeof Chart === 'undefined' && retries < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, 100));
            retries++;
        }
        
        if (typeof Chart === 'undefined') {
            console.error('Chart.js failed to load after maximum retries');
            this.showChartError();
            return;
        }


        // Initialize all charts with error handling
        try {
            this.initializeTrafficChart();
            this.initializeTrafficSourcesChart();
            this.initializeDeviceStatsChart();
            this.initializeAdmissionStatusChart();
            this.initializeContactStatusChart();
        } catch (error) {
            console.error('❌ Error initializing charts:', error);
            this.showChartError();
        }
    }

    /**
     * Show chart error message
     */
    showChartError() {
        const chartContainers = document.querySelectorAll('.analytics-chart');
        chartContainers.forEach(container => {
            container.innerHTML = `
                <div class="chart-loading">
                    <i data-lucide="alert-circle"></i>
                    Failed to load charts. Please refresh the page.
                </div>
            `;
        });
        
        // Reinitialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    /**
     * Initialize traffic overview chart
     */
    initializeTrafficChart() {
        const ctx = document.getElementById('trafficChart');
        if (!ctx) return;

        // Destroy existing chart if it exists
        if (this.charts.trafficChart) {
            this.charts.trafficChart.destroy();
        }

        const data = this.analyticsData || {};
        const traffic = data.websiteTraffic || {};

        this.charts.trafficChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Visitors', 'Page Views', 'Unique Visitors'],
                datasets: [{
                    label: 'Traffic Metrics',
                    data: [
                        traffic.totalVisitors || 0,
                        traffic.pageViews || 0,
                        traffic.uniqueVisitors || 0
                    ],
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    /**
     * Initialize traffic sources pie chart
     */
    initializeTrafficSourcesChart() {
        const ctx = document.getElementById('trafficSourcesChart');
        if (!ctx) return;

        if (this.charts.trafficSourcesChart) {
            this.charts.trafficSourcesChart.destroy();
        }

        const data = this.analyticsData || {};
        const sources = data.trafficSources || [];

        this.charts.trafficSourcesChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: sources.map(s => s.source),
                datasets: [{
                    data: sources.map(s => s.percentage),
                    backgroundColor: [
                        '#3b82f6',
                        '#10b981',
                        '#f59e0b',
                        '#ef4444'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    /**
     * Initialize device statistics chart
     */
    initializeDeviceStatsChart() {
        const ctx = document.getElementById('deviceStatsChart');
        if (!ctx) return;

        if (this.charts.deviceStatsChart) {
            this.charts.deviceStatsChart.destroy();
        }

        const data = this.analyticsData || {};
        const deviceStats = data.deviceStats || {};

        this.charts.deviceStatsChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Desktop', 'Mobile', 'Tablet'],
                datasets: [{
                    data: [
                        deviceStats.desktop || 0,
                        deviceStats.mobile || 0,
                        deviceStats.tablet || 0
                    ],
                    backgroundColor: [
                        '#8b5cf6',
                        '#06b6d4',
                        '#84cc16'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    /**
     * Initialize admission status chart
     */
    initializeAdmissionStatusChart() {
        const ctx = document.getElementById('admissionStatusChart');
        if (!ctx) return;

        if (this.charts.admissionStatusChart) {
            this.charts.admissionStatusChart.destroy();
        }

        const data = this.analyticsData || {};
        const breakdowns = data.breakdowns || {};
        const admissionStatus = breakdowns.admissionStatus || [];

        if (admissionStatus.length === 0) return;

        this.charts.admissionStatusChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: admissionStatus.map(item => item.label),
                datasets: [{
                    label: 'Applications',
                    data: admissionStatus.map(item => item.value),
                    backgroundColor: [
                        '#3b82f6',
                        '#10b981',
                        '#f59e0b',
                        '#ef4444'
                    ],
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    /**
     * Initialize contact status chart
     */
    initializeContactStatusChart() {
        const ctx = document.getElementById('contactStatusChart');
        if (!ctx) return;

        if (this.charts.contactStatusChart) {
            this.charts.contactStatusChart.destroy();
        }

        const data = this.analyticsData || {};
        const breakdowns = data.breakdowns || {};
        const contactStatus = breakdowns.contactStatus || [];

        if (contactStatus.length === 0) return;

        this.charts.contactStatusChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: contactStatus.map(item => item.label),
                datasets: [{
                    label: 'Submissions',
                    data: contactStatus.map(item => item.value),
                    backgroundColor: [
                        '#8b5cf6',
                        '#06b6d4',
                        '#84cc16',
                        '#f59e0b'
                    ],
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    /**
     * Get icon for metric type
     */
    getMetricIcon(key) {
        const icons = {
            totalUsers: 'users',
            totalEvents: 'calendar',
            totalGallery: 'image',
            totalAdmissions: 'user-plus',
            totalContactSubmissions: 'mail',
            totalBlogs: 'file-text'
        };
        return icons[key] || 'bar-chart-3';
    }

    /**
     * Format date for display
     */
    formatDate(dateString) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    /**
     * Update navigation state
     */
    updateNavigation() {
        // Remove active class from all nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to analytics link
        const analyticsLink = document.querySelector('[data-section="analytics"]');
        if (analyticsLink) {
            analyticsLink.classList.add('active');
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
    window.analyticsManager = new AnalyticsManager();
});
