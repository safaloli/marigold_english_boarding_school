// ===== MAIN JAVASCRIPT FILE =====

// DOM Elements
let header, navMenu, navToggle, themeToggle, backToTop, loadingScreen;
let contactForm, eventsGrid, galleryGrid;
let currentTheme = 'light';

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    initializeTheme();
    bindEvents();
    initializeAnimations();
    initializeContactFeatures();
    
    // Load dynamic content and hide loading screen when complete
    const loadingPromise = loadDynamicContent().then(() => {
        // Hide loading screen after all content is loaded
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }
    }).catch(() => {
        // Hide loading screen even if there's an error
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }
    });
    
    // Fallback: Hide loading screen after 5 seconds maximum
    setTimeout(() => {
        if (loadingScreen && !loadingScreen.classList.contains('hidden')) {
            loadingScreen.classList.add('hidden');
        }
    }, 5000);
});

// Initialize DOM elements
function initializeElements() {
    header = document.getElementById('header');
    navMenu = document.getElementById('nav-menu');
    navToggle = document.getElementById('nav-toggle');
    themeToggle = document.getElementById('theme-toggle');
    backToTop = document.getElementById('back-to-top');
    loadingScreen = document.getElementById('loading-screen');
    
    contactForm = document.getElementById('contact-form');
    eventsGrid = document.getElementById('events-grid');
    galleryGrid = document.getElementById('gallery-grid');
}

// Initialize theme from localStorage
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
}

// Set theme
function setTheme(theme) {
    currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Update theme toggle icon
    if (themeToggle) {
        const icon = themeToggle.querySelector('i');
        if (icon) {
            icon.className = theme === 'light' ? 'bx bx-sun' : 'bx bx-moon';
        }
    }
}

// Bind event listeners
function bindEvents() {
    // Navigation toggle
    if (navToggle) {
        navToggle.addEventListener('click', toggleNavigation);
    }
    
    // Theme toggle
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Smooth scrolling for navigation links (only for anchor links)
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', smoothScroll);
    });
    
    // Header scroll effect
    window.addEventListener('scroll', handleScroll);
    
    // Back to top button
    if (backToTop) {
        backToTop.addEventListener('click', scrollToTop);
    }
    
    // Contact form
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
        setupFormValidation();
    }
    
    // Gallery filtering
    initializeGalleryFilter();
    
    // Inquiry form
    const inquiryForm = document.getElementById('inquiry-form');
    if (inquiryForm) {
        inquiryForm.addEventListener('submit', handleInquirySubmit);
    }
    
    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSubmit);
    }
}

// Toggle navigation menu
function toggleNavigation() {
    navMenu.classList.toggle('show');
    
    // Update toggle icon
    const icon = navToggle.querySelector('i');
    if (icon) {
        icon.className = navMenu.classList.contains('show') ? 'bx bx-x' : 'bx bx-menu';
    }
}

// Toggle theme
function toggleTheme() {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
}

// Smooth scroll to section
function smoothScroll(e) {
    const targetId = this.getAttribute('href');
    
    // Only handle internal anchor links (starting with #)
    if (!targetId || !targetId.startsWith('#')) {
        return; // Let the browser handle external links normally
    }
    
    e.preventDefault();
    
    // Use try-catch to handle invalid selectors safely
    try {
    const targetSection = document.querySelector(targetId);
    
    if (targetSection) {
        const headerHeight = header ? header.offsetHeight : 80;
        const targetPosition = targetSection.offsetTop - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
        
        // Close mobile menu if open
        if (navMenu && navMenu.classList.contains('show')) {
            navMenu.classList.remove('show');
            const icon = navToggle.querySelector('i');
            if (icon) {
                icon.className = 'bx bx-menu';
            }
        }
        
        // Update active navigation link
        updateActiveNavLink(targetId);
        }
    } catch (error) {
        console.warn('Invalid selector for smooth scroll:', targetId);
        // Let the browser handle it normally if selector is invalid
    }
}

// Update active navigation link
function updateActiveNavLink(targetId) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    const activeLink = document.querySelector(`[href="${targetId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

// Handle scroll events
function handleScroll() {
    // Header scroll effect
    if (header) {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    // Back to top button
    if (backToTop) {
        if (window.scrollY > 500) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    }
    
    // Update active navigation link based on scroll position
    updateActiveNavLinkOnScroll();
}

// Update active nav link based on scroll position
function updateActiveNavLinkOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            updateActiveNavLink(`#${sectionId}`);
        }
    });
}

// Scroll to top
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Initialize animations
function initializeAnimations() {
    // Animate counters
    animateCounters();
    
    // Initialize image placeholders
    initializeImagePlaceholders();
    
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.feature-item, .academic-card, .event-card, .gallery-item').forEach(el => {
        observer.observe(el);
    });
}

/**
 * Generate a fallback placeholder image (SVG) when image fails to load
 * @param {string} text - Optional text to display (default: "Image")
 * @param {number} width - Image width (default: 400)
 * @param {number} height - Image height (default: 300)
 * @returns {string} - Data URI for SVG placeholder
 */
function getImageFallback(text = 'Image', width = 400, height = 300) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
        <rect fill="#f3f4f6" width="${width}" height="${height}"/>
        <text x="50%" y="45%" text-anchor="middle" fill="#9ca3af" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="500">${text}</text>
        <circle cx="50%" cy="60%" r="20" fill="none" stroke="#9ca3af" stroke-width="2"/>
        <path d="M ${width/2 - 12} ${height*0.6 - 8} L ${width/2} ${height*0.6 + 8} L ${width/2 + 12} ${height*0.6 - 8}" fill="none" stroke="#9ca3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
}

/**
 * Handle image error with fallback - prevents infinite loops
 * @param {HTMLImageElement} img - The image element that failed
 * @param {string} fallbackText - Optional text for placeholder
 */
function handleImageError(img, fallbackText = 'Image not available') {
    // Prevent infinite loop - check if already using fallback
    if (img.src && img.src.startsWith('data:image/svg+xml')) {
        return;
    }
    
    // Check if image has a data-fallback attribute
    const dataFallback = img.getAttribute('data-fallback');
    if (dataFallback && dataFallback.startsWith('data:image')) {
        img.src = dataFallback;
        return;
    }
    
    // Use SVG fallback
    const width = img.width || img.offsetWidth || 400;
    const height = img.height || img.offsetHeight || 300;
    img.src = getImageFallback(fallbackText, width, height);
    
    // Add a flag to prevent further error handling
    img.setAttribute('data-fallback-applied', 'true');
}

// Make functions globally available
window.getImageFallback = getImageFallback;
window.handleImageError = handleImageError;

// Initialize image placeholders for all images
function initializeImagePlaceholders() {
    // First, remove any existing image-placeholder elements that conflict with dummy cards
    const conflictingPlaceholders = document.querySelectorAll('.image-placeholder');
    conflictingPlaceholders.forEach(placeholder => {
        const img = placeholder.nextElementSibling;
        if (img && img.hasAttribute('data-dummy')) {
            placeholder.remove();
        }
    });
    
    const images = document.querySelectorAll('img[src]');
    
    images.forEach(img => {
        const parent = img.parentElement;
        
        // Skip if already has placeholder, is in dynamic content, or has dummy shimmer card
        if (parent.querySelector('.image-placeholder') || parent.querySelector('.dummy-image-card') || img.hasAttribute('data-dummy') || parent.classList.contains('event-image') || parent.classList.contains('gallery-item') || parent.classList.contains('testimonial-avatar') || parent.classList.contains('program-image')) {
            return;
        }
        
        // Create placeholder
        const placeholder = document.createElement('div');
        placeholder.className = 'image-placeholder';
        placeholder.innerHTML = `
            <i data-lucide="image"></i>
            <span>Loading...</span>
        `;
        
        // Insert placeholder before image
        parent.insertBefore(placeholder, img);
        
        // Set initial image display
        img.style.display = 'none';
        
        // Handle image load
        img.onload = function() {
            this.style.display = 'block';
            placeholder.style.display = 'none';
        };
        
        // Handle image error - prevent infinite loops
        img.onerror = function() {
            // Prevent infinite loop
            if (this.hasAttribute('data-fallback-applied')) {
                return;
            }
            
            this.style.display = 'none';
            placeholder.style.display = 'flex';
            placeholder.innerHTML = `
                <i data-lucide="image-off"></i>
                <span>Image not available</span>
            `;
            
            // Mark as fallback applied
            this.setAttribute('data-fallback-applied', 'true');
        };
    });
    
    // Initialize Lucide icons for placeholders
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Animate counters
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const originalText = counter.textContent;
        const hasPlus = originalText.includes('+');
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current) + (hasPlus ? '+' : '');
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target + (hasPlus ? '+' : '');
            }
        };
        
        // Start animation when counter is visible
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    counterObserver.unobserve(entry.target);
                }
            });
        });
        
        counterObserver.observe(counter);
    });
}

// Load dynamic content with optimized loading
async function loadDynamicContent() {
    try {
        // Use Promise.allSettled to prevent one failure from blocking others
        const results = await Promise.allSettled([
            loadEvents(),
            loadGallery()
        ]);
        
        // Log any failures but continue execution
        results.forEach((result, index) => {
            if (result.status === 'rejected') {
                console.warn(`Content loading failed for ${index === 0 ? 'events' : 'gallery'}:`, result.reason);
            }
        });
        
        // Initialize carousel after content is loaded
        initializeCarousel();
    } catch (error) {
        console.error('Error loading dynamic content:', error);
    }
}

// Initialize carousel
function initializeCarousel() {
    const carouselContainer = document.getElementById('moments-carousel');
    if (carouselContainer) {
        new Carousel('moments-carousel', {
            autoPlay: true,
            autoPlayInterval: 5000
        });
    }
}

// Load events from API with optimized loading
async function loadEvents() {
    if (!eventsGrid) return Promise.resolve();
    
    try {
        showLoadingState('events');
        
        // Use AbortController for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
        
        const response = await fetch('/api/events?limit=6&featured=true', {
            signal: controller.signal,
            headers: {
                'Cache-Control': 'max-age=300' // 5 minute cache
            }
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.events && data.events.length > 0) {
            displayEvents(data.events);
        } else {
            showEmptyState('events');
        }
    } catch (error) {
        if (error.name === 'AbortError') {
            console.warn('Events loading timed out');
        } else {
            console.error('Error loading events:', error);
        }
        showErrorState('events');
    }
}

// Display events
function displayEvents(events) {
    if (!eventsGrid) return;
    
    eventsGrid.innerHTML = events.map(event => `
        <div class="event-card animate-in">
            <div class="event-image">
                <div class="image-placeholder">
                    <i data-lucide="image"></i>
                    <span>Loading...</span>
                </div>
                <img src="${event.image || '/images/event-placeholder.jpg'}" alt="${event.title}" loading="lazy" 
                     onload="this.style.display='block'; this.previousElementSibling.style.display='none';" 
                     onerror="this.style.display='none'; this.previousElementSibling.style.display='flex';">
            </div>
            <div class="event-content">
                <div class="event-date">${formatDate(event.date)}</div>
                <h3 class="event-title">${event.title}</h3>
                <p class="event-description">${event.description || 'Join us for this exciting event!'}</p>
                <div class="event-meta">
                    <span><i data-lucide="clock"></i> ${event.time || 'TBD'}</span>
                    <span><i data-lucide="map-pin"></i> ${event.location || 'School Campus'}</span>
                </div>
            </div>
        </div>
    `).join('');
    
    hideLoadingState('events');
    
    // Initialize Lucide icons for the new content
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Load gallery from API with optimized loading
async function loadGallery() {
    if (!galleryGrid) return Promise.resolve();
    
    // Skip loading featured moments if we're on the gallery page (GalleryPageLoader handles it)
    if (window.location.pathname === '/gallery.html' || window.location.pathname.includes('gallery')) {
        console.log('🔄 Skipping featured moments load - GalleryPageLoader will handle gallery content');
        return Promise.resolve();
    }
    
    try {
        showLoadingState('gallery');
        
        // Use AbortController for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
        
        const response = await fetch('/api/gallery?limit=8&featured=true', {
            signal: controller.signal,
            headers: {
                'Cache-Control': 'max-age=300' // 5 minute cache
            }
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.galleries && data.galleries.length > 0) {
            displayGallery(data.galleries);
        } else {
            showEmptyState('gallery');
        }
    } catch (error) {
        if (error.name === 'AbortError') {
            console.warn('Gallery loading timed out');
        } else {
            console.error('Error loading gallery:', error);
        }
        showErrorState('gallery');
    }
}

// Display gallery
function displayGallery(galleries) {
    if (!galleryGrid) return;
    
    galleryGrid.innerHTML = galleries.map(item => `
        <div class="gallery-item animate-in" onclick="openGalleryModal('${item.image_url}', '${item.title}', '${item.description}')">
            <div class="image-placeholder">
                <i data-lucide="image"></i>
                <span>Loading...</span>
            </div>
            <img src="${item.image_url}" alt="${item.title}" loading="lazy"
                 onload="this.style.display='block'; this.previousElementSibling.style.display='none';" 
                 onerror="this.style.display='none'; this.previousElementSibling.style.display='flex';">
            <div class="gallery-overlay">
                <div class="gallery-info">
                    <h3 class="gallery-title">${item.title}</h3>
                    <p class="gallery-description">${item.description || ''}</p>
                </div>
            </div>
        </div>
    `).join('');
    
    hideLoadingState('gallery');
    
    // Initialize Lucide icons for the new content
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Show loading state
function showLoadingState(type) {
    const loadingEl = document.getElementById(`${type}-loading`);
    const gridEl = document.getElementById(`${type}-grid`);
    const emptyEl = document.getElementById(`${type}-empty`);
    const errorEl = document.getElementById(`${type}-error`);
    
    if (loadingEl) loadingEl.style.display = 'block';
    if (gridEl) gridEl.style.display = 'none';
    if (emptyEl) emptyEl.style.display = 'none';
    if (errorEl) errorEl.style.display = 'none';
}

// Hide loading state
function hideLoadingState(type) {
    const loadingEl = document.getElementById(`${type}-loading`);
    const gridEl = document.getElementById(`${type}-grid`);
    
    if (loadingEl) loadingEl.style.display = 'none';
    if (gridEl) gridEl.style.display = 'grid';
}

// Show empty state
function showEmptyState(type) {
    const loadingEl = document.getElementById(`${type}-loading`);
    const gridEl = document.getElementById(`${type}-grid`);
    const emptyEl = document.getElementById(`${type}-empty`);
    const errorEl = document.getElementById(`${type}-error`);
    
    if (loadingEl) loadingEl.style.display = 'none';
    if (gridEl) gridEl.style.display = 'none';
    if (emptyEl) emptyEl.style.display = 'block';
    if (errorEl) errorEl.style.display = 'none';
}

// Show error state
function showErrorState(type) {
    const loadingEl = document.getElementById(`${type}-loading`);
    const gridEl = document.getElementById(`${type}-grid`);
    const emptyEl = document.getElementById(`${type}-empty`);
    const errorEl = document.getElementById(`${type}-error`);
    
    if (loadingEl) loadingEl.style.display = 'none';
    if (gridEl) gridEl.style.display = 'none';
    if (emptyEl) emptyEl.style.display = 'none';
    if (errorEl) errorEl.style.display = 'block';
}

// Setup form validation
function setupFormValidation() {
    if (!contactForm) return;
    
    const inputs = contactForm.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
}

// Validate individual field
function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    const fieldName = field.name;
    const errorEl = document.getElementById(`${fieldName}-error`);
    
    let isValid = true;
    let errorMessage = '';
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    }
    
    // Email validation
    if (fieldName === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }
    
    // Phone validation
    if (fieldName === 'phone' && value) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(value.replace(/\s/g, ''))) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }
    }
    
    // Show/hide error
    if (errorEl) {
        if (!isValid) {
            errorEl.textContent = errorMessage;
            errorEl.classList.add('show');
            field.classList.add('error');
        } else {
            errorEl.classList.remove('show');
            field.classList.remove('error');
        }
    }
    
    return isValid;
}

// Clear field error
function clearFieldError(e) {
    const field = e.target;
    const fieldName = field.name;
    const errorEl = document.getElementById(`${fieldName}-error`);
    
    if (errorEl) {
        errorEl.classList.remove('show');
    }
    field.classList.remove('error');
}

// Handle contact form submission
async function handleContactSubmit(e) {
    e.preventDefault();
    
    if (!contactForm) return;
    
    // Validate all fields
    const inputs = contactForm.querySelectorAll('input, select, textarea');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateField({ target: input })) {
            isValid = false;
        }
    });
    
    if (!isValid) {
        showToast('Please fix the errors in the form', 'error');
        return;
    }
    
    // Get form data
    const formData = new FormData(contactForm);
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    try {
        // Show loading state
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline-flex';
        submitBtn.disabled = true;
        
        // Submit form
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(Object.fromEntries(formData))
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showToast('Thank you! Your message has been sent successfully.', 'success');
            contactForm.reset();
        } else {
            throw new Error(result.error || 'Failed to send message');
        }
        
    } catch (error) {
        console.error('Error submitting form:', error);
        showToast('Sorry, there was an error sending your message. Please try again.', 'error');
    } finally {
        // Reset button state
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
        submitBtn.disabled = false;
    }
}

// Handle newsletter subscription
async function handleNewsletterSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const email = form.querySelector('input[type="email"]').value;
    
    if (!email) {
        showToast('Please enter your email address', 'error');
        return;
    }
    
    try {
        showToast('Thank you for subscribing to our newsletter!', 'success');
        form.reset();
    } catch (error) {
        showToast('Sorry, there was an error. Please try again.', 'error');
    }
}

// Show toast notification
function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const iconMap = {
        success: 'bx-check-circle',
        error: 'bx-error-circle',
        info: 'bx-info-circle'
    };
    
    toast.innerHTML = `
        <i class='bx ${iconMap[type] || iconMap.info} toast-icon'></i>
        <div class="toast-content">
            <div class="toast-title">${type.charAt(0).toUpperCase() + type.slice(1)}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" onclick="this.parentElement.remove()">
            <i class='bx bx-x'></i>
        </button>
    `;
    
    toastContainer.appendChild(toast);
    
    // Show toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
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

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

// Open gallery modal
function openGalleryModal(imageUrl, title, description) {
    // Create modal HTML
    const modalHTML = `
        <div class="modal-overlay" onclick="closeGalleryModal()">
            <div class="modal-content" onclick="event.stopPropagation()">
                <button class="modal-close" onclick="closeGalleryModal()">
                    <i class='bx bx-x'></i>
                </button>
                <img src="${imageUrl}" alt="${title}" class="modal-image">
                <div class="modal-info">
                    <h3>${title}</h3>
                    <p>${description || ''}</p>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.body.style.overflow = 'hidden';
    
    // Show modal with animation
    setTimeout(() => {
        const modal = document.querySelector('.modal-overlay');
        if (modal) {
            modal.classList.add('show');
        }
    }, 10);
}

// Close gallery modal
function closeGalleryModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
            document.body.style.overflow = '';
        }, 300);
    }
}

// Utility function to debounce
function debounce(func, wait) {
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

// Handle inquiry form submission
function handleInquirySubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const formObject = Object.fromEntries(formData);
    
    // Basic validation
    if (!formObject.name || !formObject.email || !formObject.subject || !formObject.message) {
        showToast('error', 'Please fill in all required fields');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formObject.email)) {
        showToast('error', 'Please enter a valid email address');
        return;
    }
    
    // Simulate form submission
    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    submitButton.innerHTML = '<i data-lucide="loader-2" class="animate-spin"></i> Sending...';
    submitButton.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        showToast('success', 'Thank you! Your inquiry has been sent successfully. We will get back to you within 24 hours.');
        event.target.reset();
        
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
    }, 2000);
}

// ===== CONTACT PAGE INTERACTIVE FEATURES =====

// Copy to clipboard functionality
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('Address copied to clipboard!', 'success');
    }).catch(() => {
        showToast('Failed to copy address', 'error');
    });
}

// Show call schedule modal
function showCallSchedule() {
    const scheduleHTML = `
        <div class="modal-overlay" onclick="closeModal()">
            <div class="modal-content" onclick="event.stopPropagation()">
                <button class="modal-close" onclick="closeModal()">
                    <i data-lucide="x"></i>
                </button>
                <h3>Call Schedule</h3>
                <div class="schedule-info">
                    <div class="schedule-item">
                        <span class="time">9:00 AM - 4:00 PM</span>
                        <span class="status open">Office Hours</span>
                    </div>
                    <div class="schedule-item">
                        <span class="time">4:00 PM - 9:00 PM</span>
                        <span class="status limited">Limited Support</span>
                    </div>
                    <div class="schedule-item">
                        <span class="time">9:00 PM - 9:00 AM</span>
                        <span class="status emergency">Emergency Only</span>
                    </div>
                </div>
                <p><strong>Note:</strong> For urgent matters outside office hours, please call our emergency line.</p>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', scheduleHTML);
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => {
        const modal = document.querySelector('.modal-overlay');
        if (modal) {
            modal.classList.add('show');
        }
    }, 10);
    
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Show email templates modal
function showEmailTemplates() {
    const templatesHTML = `
        <div class="modal-overlay" onclick="closeModal()">
            <div class="modal-content" onclick="event.stopPropagation()">
                <button class="modal-close" onclick="closeModal()">
                    <i data-lucide="x"></i>
                </button>
                <h3>Email Templates</h3>
                <div class="template-list">
                    <div class="template-item" onclick="useTemplate('admission')">
                        <h4>Admission Inquiry</h4>
                        <p>Template for admission-related questions</p>
                    </div>
                    <div class="template-item" onclick="useTemplate('general')">
                        <h4>General Information</h4>
                        <p>Template for general school information</p>
                    </div>
                    <div class="template-item" onclick="useTemplate('fees')">
                        <h4>Fees & Payment</h4>
                        <p>Template for fee-related inquiries</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', templatesHTML);
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => {
        const modal = document.querySelector('.modal-overlay');
        if (modal) {
            modal.classList.add('show');
        }
    }, 10);
    
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Use email template
function useTemplate(type) {
    const templates = {
        admission: {
            subject: 'Admission Inquiry',
            message: 'Dear Admissions Team,\n\nI am interested in enrolling my child at Marigold School. I would like to know more about:\n\n• Admission requirements and procedures\n• Available grade levels\n• School fees and payment options\n• Required documents\n• Application deadlines\n\nPlease provide detailed information about the admission process.\n\nThank you,\n[Your Name]'
        },
        general: {
            subject: 'General Information Request',
            message: 'Dear School Administration,\n\nI would like to learn more about Marigold School. Please provide information about:\n\n• School curriculum and academic programs\n• Extracurricular activities\n• School facilities and infrastructure\n• Student-teacher ratio\n• School achievements and recognition\n\nI look forward to hearing from you.\n\nBest regards,\n[Your Name]'
        },
        fees: {
            subject: 'Fees & Payment Inquiry',
            message: 'Dear Finance Department,\n\nI have questions regarding school fees and payment:\n\n• Current fee structure\n• Payment methods and schedules\n• Scholarship opportunities\n• Fee waiver policies\n• Additional costs (uniforms, books, etc.)\n\nPlease provide detailed information about the fee structure.\n\nThank you,\n[Your Name]'
        }
    };
    
    const template = templates[type];
    if (template) {
        const subjectField = document.getElementById('subject');
        const messageField = document.getElementById('message');
        
        // Only apply template if the form fields exist
        if (subjectField && messageField) {
            subjectField.value = template.subject;
            messageField.value = template.message;
            updateCharCount();
            closeModal();
            showToast('Template applied successfully!', 'success');
        }
    }
}

// Show response time modal
function showResponseTime() {
    const responseHTML = `
        <div class="modal-overlay" onclick="closeModal()">
            <div class="modal-content" onclick="event.stopPropagation()">
                <button class="modal-close" onclick="closeModal()">
                    <i data-lucide="x"></i>
                </button>
                <h3>Response Time</h3>
                <div class="response-info">
                    <div class="response-item">
                        <span class="type">General Inquiries</span>
                        <span class="time">24-48 hours</span>
                    </div>
                    <div class="response-item">
                        <span class="type">Admission Queries</span>
                        <span class="time">2-4 hours</span>
                    </div>
                    <div class="response-item">
                        <span class="type">Urgent Matters</span>
                        <span class="time">1-2 hours</span>
                    </div>
                    <div class="response-item">
                        <span class="type">Emergency</span>
                        <span class="time">Immediate</span>
                    </div>
                </div>
                <p><strong>Note:</strong> Response times may vary during holidays and weekends.</p>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', responseHTML);
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => {
        const modal = document.querySelector('.modal-overlay');
        if (modal) {
            modal.classList.add('show');
        }
    }, 10);
    
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Show holiday calendar modal
function showHolidayCalendar() {
    const calendarHTML = `
        <div class="modal-overlay" onclick="closeModal()">
            <div class="modal-content" onclick="event.stopPropagation()">
                <button class="modal-close" onclick="closeModal()">
                    <i data-lucide="x"></i>
                </button>
                <h3>Holiday Calendar 2024</h3>
                <div class="holiday-list">
                    <div class="holiday-item">
                        <span class="date">January 15</span>
                        <span class="holiday">Maghe Sankranti</span>
                    </div>
                    <div class="holiday-item">
                        <span class="date">February 19</span>
                        <span class="holiday">Prajatantra Diwas</span>
                    </div>
                    <div class="holiday-item">
                        <span class="date">March 8</span>
                        <span class="holiday">International Women's Day</span>
                    </div>
                    <div class="holiday-item">
                        <span class="date">April 14</span>
                        <span class="holiday">Nepali New Year</span>
                    </div>
                    <div class="holiday-item">
                        <span class="date">May 1</span>
                        <span class="holiday">International Labor Day</span>
                    </div>
                    <div class="holiday-item">
                        <span class="date">June 15</span>
                        <span class="holiday">Summer Break Begins</span>
                    </div>
                </div>
                <p><strong>Note:</strong> School will be closed on all national holidays and during scheduled breaks.</p>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', calendarHTML);
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => {
        const modal = document.querySelector('.modal-overlay');
        if (modal) {
            modal.classList.add('show');
        }
    }, 10);
    
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Check office status
function checkOfficeStatus() {
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const hour = now.getHours();
    
    let status = 'Closed';
    let message = 'The office is currently closed.';
    
    if (day >= 0 && day <= 5) { // Sunday to Friday
        if (hour >= 9 && hour < 16) {
            status = 'Open';
            message = 'The office is currently open.';
        } else if (hour >= 16 && hour < 21) {
            status = 'Limited';
            message = 'Limited support available.';
        }
    } else if (day === 6) { // Saturday
        if (hour >= 9 && hour < 13) {
            status = 'Open';
            message = 'The office is currently open.';
        }
    }
    
    showToast(`${status}: ${message}`, status === 'Open' ? 'success' : 'info');
}

// Update character count
function updateCharCount() {
    const textarea = document.getElementById('message');
    const counter = document.getElementById('char-count');
    
    // Guard clause: only run if both elements exist
    if (!textarea || !counter) {
        return;
    }
    
    const charCount = textarea.value.length;
    
    counter.textContent = charCount;
    
    if (charCount > 900) {
        counter.parentElement.classList.add('error');
    } else if (charCount > 800) {
        counter.parentElement.classList.add('warning');
    } else {
        counter.parentElement.classList.remove('warning', 'error');
    }
}

// Close modal
function closeModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
            document.body.style.overflow = '';
        }, 300);
    }
}

// Initialize contact page features
function initializeContactFeatures() {
    // Character counter for message textarea
    const messageTextarea = document.getElementById('message');
    if (messageTextarea) {
        messageTextarea.addEventListener('input', updateCharCount);
    }
    
    // Form validation enhancements
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            const urgentCheckbox = document.getElementById('urgent');
            if (urgentCheckbox && urgentCheckbox.checked) {
                if (!confirm('You have marked this as urgent. Are you sure you want to submit?')) {
                    e.preventDefault();
                    return;
                }
            }
        });
    }
}

// Export functions for global access
window.openGalleryModal = openGalleryModal;
window.closeGalleryModal = closeGalleryModal;
window.copyToClipboard = copyToClipboard;
window.showCallSchedule = showCallSchedule;
window.showEmailTemplates = showEmailTemplates;
window.useTemplate = useTemplate;
window.showResponseTime = showResponseTime;
window.showHolidayCalendar = showHolidayCalendar;
window.checkOfficeStatus = checkOfficeStatus;
window.closeModal = closeModal;
window.switchMapView = switchMapView;
window.getDirections = getDirections;
window.shareLocation = shareLocation;
window.openInMaps = openInMaps;
window.copyCoordinates = copyCoordinates;
window.copyAddress = copyAddress;
window.showNearbyLandmarks = showNearbyLandmarks;
window.showTransportGuide = showTransportGuide;
window.scheduleVisit = scheduleVisit;
window.showOpenHouseSchedule = showOpenHouseSchedule;
window.showLocationInfo = showLocationInfo;
window.addToContacts = addToContacts;
window.composeEmail = composeEmail;
window.showCallTips = showCallTips;
window.showEmailTips = showEmailTips;
window.showVisitTips = showVisitTips;

// ===== ENHANCED CONTACT FEATURES =====

// Show location info modal
function showLocationInfo() {
    const locationHTML = `
        <div class="modal-overlay" onclick="closeModal()">
            <div class="modal-content" onclick="event.stopPropagation()">
                <button class="modal-close" onclick="closeModal()">
                    <i data-lucide="x"></i>
                </button>
                <h3>Location Information</h3>
                <div class="location-details">
                    <div class="detail-item">
                        <h4><i data-lucide="map-pin"></i> Address</h4>
                        <p>123 Education Street<br>Kathmandu, Nepal 44600</p>
                    </div>
                    <div class="detail-item">
                        <h4><i data-lucide="navigation"></i> Landmark</h4>
                        <p>Near Central Bus Park (5 minutes walk)</p>
                    </div>
                    <div class="detail-item">
                        <h4><i data-lucide="clock"></i> Best Time to Visit</h4>
                        <p>Weekdays: 9:00 AM - 4:00 PM<br>Saturday: 9:00 AM - 1:00 PM</p>
                    </div>
                    <div class="detail-item">
                        <h4><i data-lucide="car"></i> Parking</h4>
                        <p>Free parking available on campus</p>
                    </div>
                </div>
                <div class="location-actions">
                    <button class="btn btn-primary" onclick="getDirections()">
                        <i data-lucide="navigation"></i>
                        Get Directions
                    </button>
                    <button class="btn btn-outline" onclick="copyAddress()">
                        <i data-lucide="copy"></i>
                        Copy Address
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', locationHTML);
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => {
        const modal = document.querySelector('.modal-overlay');
        if (modal) {
            modal.classList.add('show');
        }
    }, 10);
    
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Add to contacts functionality
function addToContacts(name, phone) {
    if (navigator.contacts) {
        navigator.contacts.create({
            name: name,
            tel: [phone]
        }).then(() => {
            showToast(`${name} added to contacts!`, 'success');
        }).catch(() => {
            copyToClipboard(phone);
        });
    } else {
        // Fallback: copy to clipboard
        copyToClipboard(phone);
        showToast(`Phone number copied! Add "${name}" to your contacts manually.`, 'info');
    }
}

// Compose email functionality
function composeEmail(email, subject) {
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
    window.open(mailtoLink);
    showToast('Opening email client...', 'info');
}

// Show call tips modal
function showCallTips() {
    const tipsHTML = `
        <div class="modal-overlay" onclick="closeModal()">
            <div class="modal-content" onclick="event.stopPropagation()">
                <button class="modal-close" onclick="closeModal()">
                    <i data-lucide="x"></i>
                </button>
                <h3>Call Tips</h3>
                <div class="tips-list">
                    <div class="tip-item">
                        <div class="tip-icon">📞</div>
                        <div class="tip-content">
                            <h4>Best Time to Call</h4>
                            <p>Call between 9:00 AM - 4:00 PM for immediate assistance</p>
                        </div>
                    </div>
                    <div class="tip-item">
                        <div class="tip-icon">🗣️</div>
                        <div class="tip-content">
                            <h4>Language Support</h4>
                            <p>We can assist you in English, Nepali, and Hindi</p>
                        </div>
                    </div>
                    <div class="tip-item">
                        <div class="tip-icon">📝</div>
                        <div class="tip-content">
                            <h4>Prepare Your Questions</h4>
                            <p>Have your questions ready for faster assistance</p>
                        </div>
                    </div>
                    <div class="tip-item">
                        <div class="tip-icon">⏰</div>
                        <div class="tip-content">
                            <h4>Call Duration</h4>
                            <p>Average call duration: 5-10 minutes</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', tipsHTML);
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => {
        const modal = document.querySelector('.modal-overlay');
        if (modal) {
            modal.classList.add('show');
        }
    }, 10);
    
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Show email tips modal
function showEmailTips() {
    const tipsHTML = `
        <div class="modal-overlay" onclick="closeModal()">
            <div class="modal-content" onclick="event.stopPropagation()">
                <button class="modal-close" onclick="closeModal()">
                    <i data-lucide="x"></i>
                </button>
                <h3>Email Tips</h3>
                <div class="tips-list">
                    <div class="tip-item">
                        <div class="tip-icon">📧</div>
                        <div class="tip-content">
                            <h4>Clear Subject Line</h4>
                            <p>Use a descriptive subject line for faster response</p>
                        </div>
                    </div>
                    <div class="tip-item">
                        <div class="tip-icon">📝</div>
                        <div class="tip-content">
                            <h4>Be Specific</h4>
                            <p>Include relevant details and your contact information</p>
                        </div>
                    </div>
                    <div class="tip-item">
                        <div class="tip-icon">⏰</div>
                        <div class="tip-content">
                            <h4>Response Time</h4>
                            <p>We typically respond within 2-4 hours during office hours</p>
                        </div>
                    </div>
                    <div class="tip-item">
                        <div class="tip-icon">📎</div>
                        <div class="tip-content">
                            <h4>Attachments</h4>
                            <p>Feel free to attach relevant documents if needed</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', tipsHTML);
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => {
        const modal = document.querySelector('.modal-overlay');
        if (modal) {
            modal.classList.add('show');
        }
    }, 10);
    
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Show visit tips modal
function showVisitTips() {
    const tipsHTML = `
        <div class="modal-overlay" onclick="closeModal()">
            <div class="modal-content" onclick="event.stopPropagation()">
                <button class="modal-close" onclick="closeModal()">
                    <i data-lucide="x"></i>
                </button>
                <h3>Visit Tips</h3>
                <div class="tips-list">
                    <div class="tip-item">
                        <div class="tip-icon">📅</div>
                        <div class="tip-content">
                            <h4>Schedule in Advance</h4>
                            <p>Call or email to schedule your visit at least 24 hours ahead</p>
                        </div>
                    </div>
                    <div class="tip-item">
                        <div class="tip-icon">🕐</div>
                        <div class="tip-content">
                            <h4>Best Time to Visit</h4>
                            <p>Weekdays 9:00 AM - 4:00 PM for full campus access</p>
                        </div>
                    </div>
                    <div class="tip-item">
                        <div class="tip-icon">🚗</div>
                        <div class="tip-content">
                            <h4>Parking</h4>
                            <p>Free parking available on campus near the main entrance</p>
                        </div>
                    </div>
                    <div class="tip-item">
                        <div class="tip-icon">👥</div>
                        <div class="tip-content">
                            <h4>What to Expect</h4>
                            <p>Campus tour, meet teachers, view facilities, Q&A session</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', tipsHTML);
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => {
        const modal = document.querySelector('.modal-overlay');
        if (modal) {
            modal.classList.add('show');
        }
    }, 10);
    
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// ===== LOCATION & MAP INTERACTIVE FEATURES =====

// Switch map view
function switchMapView(view) {
    const mapBtns = document.querySelectorAll('.map-btn');
    const mapIframe = document.getElementById('school-map');
    
    // Update active button
    mapBtns.forEach(btn => btn.classList.remove('active'));
    event.target.closest('.map-btn').classList.add('active');
    
    // Update map URL based on view type
    const baseUrl = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.1234567890123!2d85.317278!3d27.7172!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb19c0b8a5c5b5%3A0x1234567890abcdef!Marigold%20Jyoti%20School!5e0!3m2!1sen!2snp!4v1234567890123';
    
    let newUrl = baseUrl;
    if (view === 'satellite') {
        newUrl = baseUrl + '&t=k';
    } else if (view === 'street') {
        newUrl = baseUrl + '&t=h';
    }
    
    mapIframe.src = newUrl;
    showToast(`Switched to ${view} view`, 'info');
}

// Get directions
function getDirections() {
    const address = 'Marigold+School,Kathmandu,Nepal';
    const url = `https://www.google.com/maps/dir/?api=1&destination=${address}`;
    window.open(url, '_blank');
    showToast('Opening Google Maps directions', 'info');
}

// Share location
function shareLocation() {
    const locationData = {
        title: 'Marigold School',
        text: 'Visit our school at 123 Education Street, Tulsipur, Nepal',
        url: 'https://maps.google.com/?q=Marigold+School,Tulsipur'
    };
    
    if (navigator.share) {
        navigator.share(locationData).then(() => {
            showToast('Location shared successfully!', 'success');
        }).catch(() => {
            copyLocationToClipboard();
        });
    } else {
        copyLocationToClipboard();
    }
}

// Copy location to clipboard
function copyLocationToClipboard() {
    const locationText = 'Marigold School\n123 Education Street\nKathmandu, Nepal 44600\n\nGoogle Maps: https://maps.google.com/?q=Marigold+School,Tulsipur';
    
    navigator.clipboard.writeText(locationText).then(() => {
        showToast('Location copied to clipboard!', 'success');
    }).catch(() => {
        showToast('Failed to copy location', 'error');
    });
}

// Open in maps
function openInMaps() {
    const url = 'https://maps.google.com/?q=Marigold+School,Kathmandu';
    window.open(url, '_blank');
    showToast('Opening in Google Maps', 'info');
}

// Copy coordinates
function copyCoordinates() {
    const coordinates = '27.7172, 85.317278';
    navigator.clipboard.writeText(coordinates).then(() => {
        showToast('Coordinates copied to clipboard!', 'success');
    }).catch(() => {
        showToast('Failed to copy coordinates', 'error');
    });
}

// Copy address
function copyAddress() {
    const address = '123 Education Street, Kathmandu, Nepal 44600';
    navigator.clipboard.writeText(address).then(() => {
        showToast('Address copied to clipboard!', 'success');
    }).catch(() => {
        showToast('Failed to copy address', 'error');
    });
}

// Show nearby landmarks
function showNearbyLandmarks() {
    const landmarksHTML = `
        <div class="modal-overlay" onclick="closeModal()">
            <div class="modal-content" onclick="event.stopPropagation()">
                <button class="modal-close" onclick="closeModal()">
                    <i data-lucide="x"></i>
                </button>
                <h3>Nearby Landmarks</h3>
                <div class="landmarks-list">
                    <div class="landmark-item">
                        <div class="landmark-icon">🏛️</div>
                        <div class="landmark-info">
                            <h4>Central Bus Park</h4>
                            <p>5 minutes walk</p>
                        </div>
                    </div>
                    <div class="landmark-item">
                        <div class="landmark-icon">🏥</div>
                        <div class="landmark-info">
                            <h4>Central Hospital</h4>
                            <p>10 minutes walk</p>
                        </div>
                    </div>
                    <div class="landmark-item">
                        <div class="landmark-icon">🏪</div>
                        <div class="landmark-info">
                            <h4>City Mall</h4>
                            <p>15 minutes walk</p>
                        </div>
                    </div>
                    <div class="landmark-item">
                        <div class="landmark-icon">🚇</div>
                        <div class="landmark-info">
                            <h4>Metro Station</h4>
                            <p>20 minutes walk</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', landmarksHTML);
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => {
        const modal = document.querySelector('.modal-overlay');
        if (modal) {
            modal.classList.add('show');
        }
    }, 10);
    
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Show transport guide
function showTransportGuide() {
    const transportHTML = `
        <div class="modal-overlay" onclick="closeModal()">
            <div class="modal-content" onclick="event.stopPropagation()">
                <button class="modal-close" onclick="closeModal()">
                    <i data-lucide="x"></i>
                </button>
                <h3>Transportation Guide</h3>
                <div class="transport-guide">
                    <div class="transport-section">
                        <h4><i data-lucide="bus"></i> By Bus</h4>
                        <div class="route-list">
                            <div class="route-item">
                                <span class="route-number">Route 1</span>
                                <span class="route-details">Central Bus Park → School (5 min)</span>
                            </div>
                            <div class="route-item">
                                <span class="route-number">Route 3</span>
                                <span class="route-details">Airport → School (25 min)</span>
                            </div>
                            <div class="route-item">
                                <span class="route-number">Route 5</span>
                                <span class="route-details">City Center → School (10 min)</span>
                            </div>
                            <div class="route-item">
                                <span class="route-number">Route 8</span>
                                <span class="route-details">Suburbs → School (20 min)</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="transport-section">
                        <h4><i data-lucide="car"></i> By Car</h4>
                        <ul class="car-info">
                            <li>Free parking available on campus</li>
                            <li>Visitor parking near main entrance</li>
                            <li>Accessible parking spaces available</li>
                        </ul>
                    </div>
                    
                    <div class="transport-section">
                        <h4><i data-lucide="navigation"></i> Walking</h4>
                        <ul class="walking-info">
                            <li>5 minutes from Central Bus Park</li>
                            <li>10 minutes from City Center</li>
                            <li>Well-lit and safe pedestrian paths</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', transportHTML);
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => {
        const modal = document.querySelector('.modal-overlay');
        if (modal) {
            modal.classList.add('show');
        }
    }, 10);
    
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Schedule visit
function scheduleVisit() {
    const visitHTML = `
        <div class="modal-overlay" onclick="closeModal()">
            <div class="modal-content" onclick="event.stopPropagation()">
                <button class="modal-close" onclick="closeModal()">
                    <i data-lucide="x"></i>
                </button>
                <h3>Schedule a Visit</h3>
                <div class="visit-options">
                    <div class="visit-option">
                        <h4>📞 Call to Schedule</h4>
                        <p>Call our admissions office to schedule a personalized tour</p>
                        <a href="tel:+977-98XXXXXXXX" class="btn btn-primary">
                            <i data-lucide="phone"></i>
                            Call Now
                        </a>
                    </div>
                    
                    <div class="visit-option">
                        <h4>📧 Email Request</h4>
                        <p>Send us an email with your preferred date and time</p>
                        <a href="mailto:admissions@marigoldebs.edu.np" class="btn btn-outline">
                            <i data-lucide="mail"></i>
                            Send Email
                        </a>
                    </div>
                    
                    <div class="visit-option">
                        <h4>📅 Open House</h4>
                        <p>Join our monthly open house events</p>
                        <button class="btn btn-outline" onclick="showOpenHouseSchedule()">
                            <i data-lucide="calendar"></i>
                            View Schedule
                        </button>
                    </div>
                </div>
                
                <div class="visit-note">
                    <p><strong>Note:</strong> Please schedule your visit at least 24 hours in advance. Weekend visits are available by special arrangement.</p>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', visitHTML);
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => {
        const modal = document.querySelector('.modal-overlay');
        if (modal) {
            modal.classList.add('show');
        }
    }, 10);
    
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Show open house schedule
function showOpenHouseSchedule() {
    const scheduleHTML = `
        <div class="modal-overlay" onclick="closeModal()">
            <div class="modal-content" onclick="event.stopPropagation()">
                <button class="modal-close" onclick="closeModal()">
                    <i data-lucide="x"></i>
                </button>
                <h3>Open House Schedule</h3>
                <div class="open-house-schedule">
                    <div class="schedule-item">
                        <span class="date">Every First Saturday</span>
                        <span class="time">10:00 AM - 2:00 PM</span>
                    </div>
                    <div class="schedule-item">
                        <span class="date">Every Third Sunday</span>
                        <span class="time">11:00 AM - 3:00 PM</span>
                    </div>
                </div>
                <p><strong>What to expect:</strong> Campus tour, meet teachers, view facilities, Q&A session</p>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', scheduleHTML);
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => {
        const modal = document.querySelector('.modal-overlay');
        if (modal) {
            modal.classList.add('show');
        }
    }, 10);
    
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Gallery Filter Functionality
function initializeGalleryFilter() {
    const galleryTabs = document.querySelectorAll('.gallery-tab');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const category = tab.getAttribute('data-category');
            
            // Update active tab
            galleryTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Filter gallery items
            galleryItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                
                if (category === 'all' || itemCategory === category) {
                    item.style.display = 'block';
                    item.style.animation = 'fadeInUp 0.6s ease-out';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}


async function loadGallery() {

    if (!galleryGrid) return Promise.resolve();

    // Skip loading featured moments if we're on the gallery page (GalleryPageLoader handles it)
    if (window.location.pathname === '/gallery.html' || window.location.pathname.includes('gallery')) {
        console.log('🔄 Skipping featured moments load - GalleryPageLoader will handle gallery content');
        return Promise.resolve();
    }

    try {

        showLoadingState('gallery');

        

        const response = await fetch('/api/gallery?limit=8&featured=true');

        const data = await response.json();

        

        if (data.galleries && data.galleries.length > 0) {

            displayGallery(data.galleries);

        } else {

            showEmptyState('gallery');

        }

    } catch (error) {

        console.error('Error loading gallery:', error);

        showErrorState('gallery');

    }

}



// Display gallery

function displayGallery(galleries) {

    if (!galleryGrid) return;

    

    galleryGrid.innerHTML = galleries.map(item => `

        <div class="gallery-item animate-in" onclick="openGalleryModal('${item.image_url}', '${item.title}', '${item.description}')">

            <div class="image-placeholder">

                <i data-lucide="image"></i>

                <span>Loading...</span>

            </div>

            <img src="${item.image_url}" alt="${item.title}" loading="lazy"

                 onload="this.style.display='block'; this.previousElementSibling.style.display='none';" 

                 onerror="this.style.display='none'; this.previousElementSibling.style.display='flex';">

            <div class="gallery-overlay">

                <div class="gallery-info">

                    <h3 class="gallery-title">${item.title}</h3>

                    <p class="gallery-description">${item.description || ''}</p>

                </div>

            </div>

        </div>

    `).join('');

    

    hideLoadingState('gallery');

    

    // Initialize Lucide icons for the new content

    if (typeof lucide !== 'undefined') {

        lucide.createIcons();

    }

}



// Show loading state

function showLoadingState(type) {

    const loadingEl = document.getElementById(`${type}-loading`);

    const gridEl = document.getElementById(`${type}-grid`);

    const emptyEl = document.getElementById(`${type}-empty`);

    const errorEl = document.getElementById(`${type}-error`);

    

    if (loadingEl) loadingEl.style.display = 'block';

    if (gridEl) gridEl.style.display = 'none';

    if (emptyEl) emptyEl.style.display = 'none';

    if (errorEl) errorEl.style.display = 'none';

}



// Hide loading state

function hideLoadingState(type) {

    const loadingEl = document.getElementById(`${type}-loading`);

    const gridEl = document.getElementById(`${type}-grid`);

    

    if (loadingEl) loadingEl.style.display = 'none';

    if (gridEl) gridEl.style.display = 'grid';

}



// Show empty state

function showEmptyState(type) {

    const loadingEl = document.getElementById(`${type}-loading`);

    const gridEl = document.getElementById(`${type}-grid`);

    const emptyEl = document.getElementById(`${type}-empty`);

    const errorEl = document.getElementById(`${type}-error`);

    

    if (loadingEl) loadingEl.style.display = 'none';

    if (gridEl) gridEl.style.display = 'none';

    if (emptyEl) emptyEl.style.display = 'block';

    if (errorEl) errorEl.style.display = 'none';

}



// Show error state

function showErrorState(type) {

    const loadingEl = document.getElementById(`${type}-loading`);

    const gridEl = document.getElementById(`${type}-grid`);

    const emptyEl = document.getElementById(`${type}-empty`);

    const errorEl = document.getElementById(`${type}-error`);

    

    if (loadingEl) loadingEl.style.display = 'none';

    if (gridEl) gridEl.style.display = 'none';

    if (emptyEl) emptyEl.style.display = 'none';

    if (errorEl) errorEl.style.display = 'block';

}



// Setup form validation

function setupFormValidation() {

    if (!contactForm) return;

    

    const inputs = contactForm.querySelectorAll('input, select, textarea');

    

    inputs.forEach(input => {

        input.addEventListener('blur', validateField);

        input.addEventListener('input', clearFieldError);

    });

}



// Validate individual field

function validateField(e) {

    const field = e.target;

    const value = field.value.trim();

    const fieldName = field.name;

    const errorEl = document.getElementById(`${fieldName}-error`);

    

    let isValid = true;

    let errorMessage = '';

    

    // Required field validation

    if (field.hasAttribute('required') && !value) {

        isValid = false;

        errorMessage = 'This field is required';

    }

    

    // Email validation

    if (fieldName === 'email' && value) {

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(value)) {

            isValid = false;

            errorMessage = 'Please enter a valid email address';

        }

    }

    

    // Phone validation

    if (fieldName === 'phone' && value) {

        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;

        if (!phoneRegex.test(value.replace(/\s/g, ''))) {

            isValid = false;

            errorMessage = 'Please enter a valid phone number';

        }

    }

    

    // Show/hide error

    if (errorEl) {

        if (!isValid) {

            errorEl.textContent = errorMessage;

            errorEl.classList.add('show');

            field.classList.add('error');

        } else {

            errorEl.classList.remove('show');

            field.classList.remove('error');

        }

    }

    

    return isValid;

}



// Clear field error

function clearFieldError(e) {

    const field = e.target;

    const fieldName = field.name;

    const errorEl = document.getElementById(`${fieldName}-error`);

    

    if (errorEl) {

        errorEl.classList.remove('show');

    }

    field.classList.remove('error');

}



// Handle contact form submission

async function handleContactSubmit(e) {

    e.preventDefault();

    

    if (!contactForm) return;

    

    // Validate all fields

    const inputs = contactForm.querySelectorAll('input, select, textarea');

    let isValid = true;

    

    inputs.forEach(input => {

        if (!validateField({ target: input })) {

            isValid = false;

        }

    });

    

    if (!isValid) {

        showToast('Please fix the errors in the form', 'error');

        return;

    }

    

    // Get form data

    const formData = new FormData(contactForm);

    const submitBtn = contactForm.querySelector('button[type="submit"]');

    const btnText = submitBtn.querySelector('.btn-text');

    const btnLoading = submitBtn.querySelector('.btn-loading');

    

    try {

        // Show loading state

        btnText.style.display = 'none';

        btnLoading.style.display = 'inline-flex';

        submitBtn.disabled = true;

        

        // Submit form

        const response = await fetch('/api/contact', {

            method: 'POST',

            headers: {

                'Content-Type': 'application/json',

            },

            body: JSON.stringify(Object.fromEntries(formData))

        });

        

        const result = await response.json();

        

        if (response.ok) {

            showToast('Thank you! Your message has been sent successfully.', 'success');

            contactForm.reset();

        } else {

            throw new Error(result.error || 'Failed to send message');

        }

        

    } catch (error) {

        console.error('Error submitting form:', error);

        showToast('Sorry, there was an error sending your message. Please try again.', 'error');

    } finally {

        // Reset button state

        btnText.style.display = 'inline';

        btnLoading.style.display = 'none';

        submitBtn.disabled = false;

    }

}



// Handle newsletter subscription

async function handleNewsletterSubmit(e) {

    e.preventDefault();

    

    const form = e.target;

    const email = form.querySelector('input[type="email"]').value;

    

    if (!email) {

        showToast('Please enter your email address', 'error');

        return;

    }

    

    try {

        showToast('Thank you for subscribing to our newsletter!', 'success');

        form.reset();

    } catch (error) {

        showToast('Sorry, there was an error. Please try again.', 'error');

    }

}



// Show toast notification

function showToast(message, type = 'info') {

    const toastContainer = document.getElementById('toast-container');

    if (!toastContainer) return;

    

    const toast = document.createElement('div');

    toast.className = `toast ${type}`;

    

    const iconMap = {

        success: 'bx-check-circle',

        error: 'bx-error-circle',

        info: 'bx-info-circle'

    };

    

    toast.innerHTML = `

        <i class='bx ${iconMap[type] || iconMap.info} toast-icon'></i>

        <div class="toast-content">

            <div class="toast-title">${type.charAt(0).toUpperCase() + type.slice(1)}</div>

            <div class="toast-message">${message}</div>

        </div>

        <button class="toast-close" onclick="this.parentElement.remove()">

            <i class='bx bx-x'></i>

        </button>

    `;

    

    toastContainer.appendChild(toast);

    

    // Show toast

    setTimeout(() => {

        toast.classList.add('show');

    }, 100);

    

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



// Format date

function formatDate(dateString) {

    const date = new Date(dateString);

    return date.toLocaleDateString('en-US', {

        month: 'short',

        day: 'numeric',

        year: 'numeric'

    });

}



// Open gallery modal

function openGalleryModal(imageUrl, title, description) {

    // Create modal HTML

    const modalHTML = `

        <div class="modal-overlay" onclick="closeGalleryModal()">

            <div class="modal-content" onclick="event.stopPropagation()">

                <button class="modal-close" onclick="closeGalleryModal()">

                    <i class='bx bx-x'></i>

                </button>

                <img src="${imageUrl}" alt="${title}" class="modal-image">

                <div class="modal-info">

                    <h3>${title}</h3>

                    <p>${description || ''}</p>

                </div>

            </div>

        </div>

    `;

    

    // Add modal to body

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    document.body.style.overflow = 'hidden';

    

    // Show modal with animation

    setTimeout(() => {

        const modal = document.querySelector('.modal-overlay');

        if (modal) {

            modal.classList.add('show');

        }

    }, 10);

}



// Close gallery modal

function closeGalleryModal() {

    const modal = document.querySelector('.modal-overlay');

    if (modal) {

        modal.classList.remove('show');

        setTimeout(() => {

            modal.remove();

            document.body.style.overflow = '';

        }, 300);

    }

}



// Utility function to debounce

function debounce(func, wait) {

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



// Export functions for global access

window.openGalleryModal = openGalleryModal;

window.closeGalleryModal = closeGalleryModal;


// Gallery Filter Functionality
function initializeGalleryFilter() {
    const galleryTabs = document.querySelectorAll('.gallery-tab');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const category = tab.getAttribute('data-category');
            
            // Update active tab
            galleryTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Filter gallery items
            galleryItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                
                if (category === 'all' || itemCategory === category) {
                    item.style.display = 'block';
                    item.style.animation = 'fadeInUp 0.6s ease-out';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}



