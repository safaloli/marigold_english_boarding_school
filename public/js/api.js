// ===== API JAVASCRIPT FILE =====

// ===== API CONFIGURATION =====
const API_CONFIG = {
    baseURL: window.location.origin,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
};

// ===== API UTILITY FUNCTIONS =====

// Rate limiting utility
const rateLimitCache = {
    lastRequest: {},
    retryAfter: {}
};

// Check if we should skip request due to rate limiting
function shouldSkipRequest(endpoint) {
    const now = Date.now();
    const lastRequest = rateLimitCache.lastRequest[endpoint];
    const retryAfter = rateLimitCache.retryAfter[endpoint];
    
    if (retryAfter && now < retryAfter) {
        return true;
    }
    
    // Skip if last request was less than 1 second ago (debounce)
    if (lastRequest && (now - lastRequest) < 1000) {
        return true;
    }
    
    rateLimitCache.lastRequest[endpoint] = now;
    return false;
}

// Set retry after for rate limited endpoint
function setRetryAfter(endpoint, retryAfterMs) {
    rateLimitCache.retryAfter[endpoint] = Date.now() + retryAfterMs;
}

// Generic API request function
async function apiRequest(endpoint, options = {}) {
    // Check if we should skip this request due to rate limiting
    if (shouldSkipRequest(endpoint)) {
        throw new Error('Request skipped due to rate limiting');
    }
    
    const url = `${API_CONFIG.baseURL}${endpoint}`;
    
    const config = {
        method: 'GET',
        headers: {
            ...API_CONFIG.headers,
            ...options.headers
        },
        timeout: API_CONFIG.timeout,
        ...options
    };
    
    // Add authentication token if available
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), config.timeout);
        
        const response = await fetch(url, {
            ...config,
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            // Handle rate limiting response
            if (response.status === 429) {
                const retryAfter = response.headers.get('Retry-After');
                if (retryAfter) {
                    setRetryAfter(endpoint, parseInt(retryAfter) * 1000);
                } else {
                    // Default retry after 15 minutes
                    setRetryAfter(endpoint, 15 * 60 * 1000);
                }
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
        
    } catch (error) {
        if (error.name === 'AbortError') {
            throw new Error('Request timeout');
        }
        throw error;
    }
}

// ===== AUTHENTICATION API =====

// Login user
async function loginUser(credentials) {
    try {
        const response = await apiRequest('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        });
        
        if (response.success && response.data.token) {
            localStorage.setItem('authToken', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        
        return response;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}

// Logout user
async function logoutUser() {
    try {
        await apiRequest('/api/auth/logout', {
            method: 'POST'
        });
    } catch (error) {
        console.error('Logout error:', error);
    } finally {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.location.href = '/';
    }
}

// Get current user
async function getCurrentUser() {
    try {
        const response = await apiRequest('/api/auth/me');
        return response;
    } catch (error) {
        console.error('Get current user error:', error);
        
        // Handle rate limiting specifically
        if (error.message.includes('429') || error.message.includes('Request skipped due to rate limiting')) {
            console.warn('Rate limit exceeded for auth endpoint. Using cached user data.');
            // Return cached user data if available
            const cachedUser = localStorage.getItem('user');
            if (cachedUser) {
                return {
                    success: true,
                    data: {
                        user: JSON.parse(cachedUser)
                    },
                    fromCache: true
                };
            }
            // If no cached data, return rate limited response
            return {
                success: false,
                message: 'Rate limit exceeded. Please wait before retrying.',
                rateLimited: true
            };
        }
        
        throw error;
    }
}

// Change password
async function changePassword(passwords) {
    try {
        const response = await apiRequest('/api/auth/change-password', {
            method: 'POST',
            body: JSON.stringify(passwords)
        });
        return response;
    } catch (error) {
        console.error('Change password error:', error);
        throw error;
    }
}

// ===== EVENTS API =====

// Get all events
async function getEvents(params = {}) {
    try {
        const queryString = new URLSearchParams(params).toString();
        const endpoint = `/api/events${queryString ? '?' + queryString : ''}`;
        const response = await apiRequest(endpoint);
        return response;
    } catch (error) {
        console.error('Get events error:', error);
        throw error;
    }
}

// Get single event
async function getEvent(eventId) {
    try {
        const response = await apiRequest(`/api/events/${eventId}`);
        return response;
    } catch (error) {
        console.error('Get event error:', error);
        throw error;
    }
}

// Create event (admin only)
async function createEvent(eventData) {
    try {
        const response = await apiRequest('/api/admin/events', {
            method: 'POST',
            body: JSON.stringify(eventData)
        });
        return response;
    } catch (error) {
        console.error('Create event error:', error);
        throw error;
    }
}

// Update event (admin only)
async function updateEvent(eventId, eventData) {
    try {
        const response = await apiRequest(`/api/admin/events/${eventId}`, {
            method: 'PUT',
            body: JSON.stringify(eventData)
        });
        return response;
    } catch (error) {
        console.error('Update event error:', error);
        throw error;
    }
}

// Delete event (admin only)
async function deleteEvent(eventId) {
    try {
        const response = await apiRequest(`/api/admin/events/${eventId}`, {
            method: 'DELETE'
        });
        return response;
    } catch (error) {
        console.error('Delete event error:', error);
        throw error;
    }
}

// ===== BLOG API =====

// Get all blog posts
async function getBlogPosts(params = {}) {
    try {
        const queryString = new URLSearchParams(params).toString();
        const endpoint = `/api/blog${queryString ? '?' + queryString : ''}`;
        const response = await apiRequest(endpoint);
        return response;
    } catch (error) {
        console.error('Get blog posts error:', error);
        throw error;
    }
}

// Get single blog post
async function getBlogPost(postId) {
    try {
        const response = await apiRequest(`/api/blog/${postId}`);
        return response;
    } catch (error) {
        console.error('Get blog post error:', error);
        throw error;
    }
}

// Create blog post (admin only)
async function createBlogPost(postData) {
    try {
        const response = await apiRequest('/api/admin/blog', {
            method: 'POST',
            body: JSON.stringify(postData)
        });
        return response;
    } catch (error) {
        console.error('Create blog post error:', error);
        throw error;
    }
}

// Update blog post (admin only)
async function updateBlogPost(postId, postData) {
    try {
        const response = await apiRequest(`/api/admin/blog/${postId}`, {
            method: 'PUT',
            body: JSON.stringify(postData)
        });
        return response;
    } catch (error) {
        console.error('Update blog post error:', error);
        throw error;
    }
}

// Delete blog post (admin only)
async function deleteBlogPost(postId) {
    try {
        const response = await apiRequest(`/api/admin/blog/${postId}`, {
            method: 'DELETE'
        });
        return response;
    } catch (error) {
        console.error('Delete blog post error:', error);
        throw error;
    }
}

// ===== GALLERY API =====

// Get all galleries
async function getGalleries(params = {}) {
    try {
        const queryString = new URLSearchParams(params).toString();
        const endpoint = `/api/gallery${queryString ? '?' + queryString : ''}`;
        const response = await apiRequest(endpoint);
        return response;
    } catch (error) {
        console.error('Get galleries error:', error);
        throw error;
    }
}

// Get single gallery
async function getGallery(galleryId) {
    try {
        const response = await apiRequest(`/api/gallery/${galleryId}`);
        return response;
    } catch (error) {
        console.error('Get gallery error:', error);
        throw error;
    }
}

// Create gallery (admin only)
async function createGallery(galleryData) {
    try {
        const response = await apiRequest('/api/admin/gallery', {
            method: 'POST',
            body: JSON.stringify(galleryData)
        });
        return response;
    } catch (error) {
        console.error('Create gallery error:', error);
        throw error;
    }
}

// Update gallery (admin only)
async function updateGallery(galleryId, galleryData) {
    try {
        const response = await apiRequest(`/api/admin/gallery/${galleryId}`, {
            method: 'PUT',
            body: JSON.stringify(galleryData)
        });
        return response;
    } catch (error) {
        console.error('Update gallery error:', error);
        throw error;
    }
}

// Delete gallery (admin only)
async function deleteGallery(galleryId) {
    try {
        const response = await apiRequest(`/api/admin/gallery/${galleryId}`, {
            method: 'DELETE'
        });
        return response;
    } catch (error) {
        console.error('Delete gallery error:', error);
        throw error;
    }
}

// Upload image to gallery (admin only)
async function uploadGalleryImage(galleryId, imageData) {
    try {
        const formData = new FormData();
        formData.append('image', imageData.file);
        formData.append('caption', imageData.caption || '');
        formData.append('alt', imageData.alt || '');
        
        const response = await apiRequest(`/api/admin/gallery/${galleryId}/images`, {
            method: 'POST',
            headers: {}, // Let browser set Content-Type for FormData
            body: formData
        });
        return response;
    } catch (error) {
        console.error('Upload gallery image error:', error);
        throw error;
    }
}

// ===== CONTACT API =====

// Send contact form
async function sendContactForm(formData) {
    try {
        const response = await apiRequest('/api/contact', {
            method: 'POST',
            body: JSON.stringify(formData)
        });
        return response;
    } catch (error) {
        console.error('Send contact form error:', error);
        throw error;
    }
}

// ===== FILE UPLOAD API =====

// Upload file
async function uploadFile(file, options = {}) {
    try {
        const formData = new FormData();
        formData.append('file', file);
        
        if (options.folder) {
            formData.append('folder', options.folder);
        }
        
        const response = await apiRequest('/api/upload', {
            method: 'POST',
            headers: {}, // Let browser set Content-Type for FormData
            body: formData
        });
        return response;
    } catch (error) {
        console.error('Upload file error:', error);
        throw error;
    }
}

// ===== CACHE MANAGEMENT =====

// Simple cache implementation
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

function getCachedData(key) {
    const cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.data;
    }
    return null;
}

function setCachedData(key, data) {
    cache.set(key, {
        data,
        timestamp: Date.now()
    });
}

function clearCache() {
    cache.clear();
}

function clearCacheByKey(key) {
    cache.delete(key);
}

// ===== CACHED API FUNCTIONS =====

// Get cached events
async function getCachedEvents(params = {}) {
    const cacheKey = `events_${JSON.stringify(params)}`;
    const cached = getCachedData(cacheKey);
    
    if (cached) {
        return cached;
    }
    
    const data = await getEvents(params);
    setCachedData(cacheKey, data);
    return data;
}

// Get cached blog posts
async function getCachedBlogPosts(params = {}) {
    const cacheKey = `blog_${JSON.stringify(params)}`;
    const cached = getCachedData(cacheKey);
    
    if (cached) {
        return cached;
    }
    
    const data = await getBlogPosts(params);
    setCachedData(cacheKey, data);
    return data;
}

// Get cached galleries
async function getCachedGalleries(params = {}) {
    const cacheKey = `galleries_${JSON.stringify(params)}`;
    const cached = getCachedData(cacheKey);
    
    if (cached) {
        return cached;
    }
    
    const data = await getGalleries(params);
    setCachedData(cacheKey, data);
    return data;
}

// ===== ERROR HANDLING =====

// Handle API errors
function handleApiError(error, context = '') {
    console.error(`API Error ${context}:`, error);
    
    let message = 'An error occurred while processing your request.';
    
    if (error.message.includes('401')) {
        message = 'You are not authorized to perform this action.';
        // Redirect to login if needed
        if (window.location.pathname.startsWith('/admin')) {
            window.location.href = '/admin/login';
        }
    } else if (error.message.includes('403')) {
        message = 'You do not have permission to perform this action.';
    } else if (error.message.includes('404')) {
        message = 'The requested resource was not found.';
    } else if (error.message.includes('422')) {
        message = 'Please check your input and try again.';
    } else if (error.message.includes('429')) {
        message = 'Too many requests. Please wait before trying again.';
    } else if (error.message.includes('500')) {
        message = 'Server error. Please try again later.';
    } else if (error.message.includes('timeout')) {
        message = 'Request timeout. Please check your connection and try again.';
    }
    
    // Show toast notification
    if (typeof showToast === 'function') {
        showToast(message, 'error');
    }
    
    return message;
}

// ===== UTILITY FUNCTIONS =====

// Check if user is authenticated
function isAuthenticated() {
    return !!localStorage.getItem('authToken');
}

// Get current user from localStorage
function getCurrentUserFromStorage() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

// Check if user has specific role
function hasRole(role) {
    const user = getCurrentUserFromStorage();
    return user && user.role === role;
}

// Check if user is admin
function isAdmin() {
    return hasRole('admin') || hasRole('super_admin');
}

// Format API response for display
function formatApiResponse(response, defaultMessage = '') {
    if (response.success) {
        return {
            success: true,
            data: response.data,
            message: response.message || defaultMessage
        };
    } else {
        return {
            success: false,
            message: response.message || 'An error occurred',
            errors: response.errors || []
        };
    }
}

// Debounce function for API calls
function debounceApiCall(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Retry function for failed API calls
async function retryApiCall(apiCall, maxRetries = 3, delay = 1000) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await apiCall();
        } catch (error) {
            if (i === maxRetries - 1) {
                throw error;
            }
            await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
        }
    }
}

// ===== EXPORT FUNCTIONS =====

// Export all API functions
window.API = {
    // Authentication
    loginUser,
    logoutUser,
    getCurrentUser,
    changePassword,
    
    // Events
    getEvents,
    getEvent,
    createEvent,
    updateEvent,
    deleteEvent,
    getCachedEvents,
    
    // Blog
    getBlogPosts,
    getBlogPost,
    createBlogPost,
    updateBlogPost,
    deleteBlogPost,
    getCachedBlogPosts,
    
    // Gallery
    getGalleries,
    getGallery,
    createGallery,
    updateGallery,
    deleteGallery,
    uploadGalleryImage,
    getCachedGalleries,
    
    // Contact
    sendContactForm,
    
    // File Upload
    uploadFile,
    
    // Cache Management
    clearCache,
    clearCacheByKey,
    
    // Utility Functions
    isAuthenticated,
    getCurrentUserFromStorage,
    hasRole,
    isAdmin,
    formatApiResponse,
    handleApiError,
    retryApiCall
};

// ===== INITIALIZATION =====

// Initialize API when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication status on page load
    if (isAuthenticated()) {
        // Verify token is still valid
        getCurrentUser().then(response => {
            // Handle rate limiting response
            if (response && response.rateLimited) {
                console.warn('Auth check rate limited - using cached user data');
                return;
            }
        }).catch(error => {
            if (error.message.includes('401')) {
                localStorage.removeItem('authToken');
                localStorage.removeItem('user');
                if (window.location.pathname.startsWith('/admin')) {
                    window.location.href = '/admin/login';
                }
            } else if (error.message.includes('429')) {
                console.warn('Auth check rate limited - continuing with cached data');
                // Don't redirect on rate limit, just continue
            }
        });
    }
    
    // Set up global error handler for API calls
    window.addEventListener('unhandledrejection', function(event) {
        if (event.reason && event.reason.message && event.reason.message.includes('fetch')) {
            handleApiError(event.reason, 'Global');
        }
    });
});

// ===== ADMIN PANEL HELPERS =====

// Admin panel specific functions
window.AdminAPI = {
    // Check if user can access admin panel
    canAccessAdmin() {
        return isAuthenticated() && isAdmin();
    },
    
    // Redirect to admin login if not authenticated
    requireAuth() {
        if (!isAuthenticated()) {
            window.location.href = '/admin/login';
            return false;
        }
        if (!isAdmin()) {
            window.location.href = '/admin/unauthorized';
            return false;
        }
        return true;
    },
    
    // Get admin dashboard data
    async getDashboardData() {
        try {
            const response = await apiRequest('/api/admin/dashboard');
            return response;
        } catch (error) {
            handleApiError(error, 'Dashboard');
            throw error;
        }
    },
    
    // Get admin statistics
    async getAdminStats() {
        try {
            const response = await apiRequest('/api/admin/stats');
            return response;
        } catch (error) {
            handleApiError(error, 'Stats');
            throw error;
        }
    }
};
