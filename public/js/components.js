// ===== REUSABLE UI COMPONENTS =====

// Carousel Component
class Carousel {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.track = this.container?.querySelector('.carousel-track');
        this.slides = this.track?.querySelectorAll('.moment-slide') || [];
        this.prevBtn = this.container?.querySelector('.carousel-btn.prev');
        this.nextBtn = this.container?.querySelector('.carousel-btn.next');
        this.dots = this.container?.querySelectorAll('.carousel-dots .dot');
        
        this.currentSlide = 0;
        this.totalSlides = this.slides.length;
        this.autoPlay = options.autoPlay || false;
        this.autoPlayInterval = options.autoPlayInterval || 5000;
        this.autoPlayTimer = null;
        
        this.init();
    }
    
    init() {
        if (!this.container || !this.track) return;
        
        // Set initial position
        this.updateSlide();
        
        // Add event listeners
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prev());
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.next());
        }
        
        // Add dot navigation
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Auto-play functionality
        if (this.autoPlay) {
            this.startAutoPlay();
            
            // Pause on hover
            this.container.addEventListener('mouseenter', () => this.stopAutoPlay());
            this.container.addEventListener('mouseleave', () => this.startAutoPlay());
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prev();
            if (e.key === 'ArrowRight') this.next();
        });
    }
    
    updateSlide() {
        if (!this.track) return;
        
        const translateX = -this.currentSlide * 100;
        this.track.style.transform = `translateX(${translateX}%)`;
        
        // Update dots
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide);
        });
    }
    
    next() {
        this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
        this.updateSlide();
    }
    
    prev() {
        this.currentSlide = this.currentSlide === 0 ? this.totalSlides - 1 : this.currentSlide - 1;
        this.updateSlide();
    }
    
    goToSlide(index) {
        this.currentSlide = index;
        this.updateSlide();
    }
    
    startAutoPlay() {
        if (this.autoPlayTimer) return;
        this.autoPlayTimer = setInterval(() => this.next(), this.autoPlayInterval);
    }
    
    stopAutoPlay() {
        if (this.autoPlayTimer) {
            clearInterval(this.autoPlayTimer);
            this.autoPlayTimer = null;
        }
    }
}

// Toast Notification Component
class Toast {
    constructor() {
        this.container = this.createContainer();
    }

    createContainer() {
        const container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
        return container;
    }

    show(message, type = 'info', duration = 5000) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const iconMap = {
            success: 'check-circle',
            error: 'x-circle',
            warning: 'alert-triangle',
            info: 'info'
        };

        toast.innerHTML = `
            <div class="toast-content">
                <i data-lucide="${iconMap[type] || iconMap.info}" class="toast-icon"></i>
                <div class="toast-message">${message}</div>
                <button class="toast-close" onclick="this.parentElement.parentElement.remove()">
                    <i data-lucide="x"></i>
                </button>
            </div>
        `;

        this.container.appendChild(toast);
        
        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        // Show animation
        setTimeout(() => toast.classList.add('show'), 100);

        // Auto remove
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentElement) {
                    toast.remove();
                }
            }, 300);
        }, duration);

        return toast;
    }
}

// Modal Component
class Modal {
    constructor(id) {
        this.id = id;
        this.modal = document.getElementById(id);
        this.overlay = this.modal?.querySelector('.modal-overlay');
        this.closeBtn = this.modal?.querySelector('.modal-close');
        this.init();
    }

    init() {
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.close());
        }
        if (this.overlay) {
            this.overlay.addEventListener('click', (e) => {
                if (e.target === this.overlay) this.close();
            });
        }
    }

    open() {
        if (this.modal) {
            this.modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    }

    close() {
        if (this.modal) {
            this.modal.classList.remove('show');
            document.body.style.overflow = '';
        }
    }
}

// Loading Component
class Loading {
    constructor() {
        this.loadingScreen = document.getElementById('loading-screen');
    }

    show(element, text = 'Loading...') {
        if (element) {
            const loading = document.createElement('div');
            loading.className = 'loading-overlay';
            loading.innerHTML = `
                <div class="loading-spinner"></div>
                <p>${text}</p>
            `;
            element.appendChild(loading);
            element.classList.add('loading');
        }
    }

    hide(element) {
        if (element) {
            const loading = element.querySelector('.loading-overlay');
            if (loading) {
                loading.remove();
            }
            element.classList.remove('loading');
        }
    }

    showPage() {
        if (this.loadingScreen) {
            this.loadingScreen.classList.remove('hidden');
        }
    }

    hidePage() {
        if (this.loadingScreen) {
            this.loadingScreen.classList.add('hidden');
        }
    }
}

// Form Validator Component
class FormValidator {
    constructor(form) {
        this.form = form;
        this.fields = form.querySelectorAll('input, select, textarea');
        this.errors = new Map();
        this.init();
    }

    init() {
        this.fields.forEach(field => {
            field.addEventListener('blur', () => this.validateField(field));
            field.addEventListener('input', () => this.clearFieldError(field));
        });

        this.form.addEventListener('submit', (e) => {
            if (!this.validateForm()) {
                e.preventDefault();
            }
        });
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';

        // Required validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }

        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }

        // Phone validation
        if (field.type === 'tel' && value) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(value.replace(/\s/g, ''))) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number';
            }
        }

        this.showFieldError(field, errorMessage);
        return isValid;
    }

    showFieldError(field, message) {
        this.clearFieldError(field);
        
        if (message) {
            field.classList.add('error');
            const errorEl = document.createElement('div');
            errorEl.className = 'field-error';
            errorEl.textContent = message;
            field.parentNode.appendChild(errorEl);
            this.errors.set(field.name, message);
        }
    }

    clearFieldError(field) {
        field.classList.remove('error');
        const errorEl = field.parentNode.querySelector('.field-error');
        if (errorEl) {
            errorEl.remove();
        }
        this.errors.delete(field.name);
    }

    validateForm() {
        let isValid = true;
        this.fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        return isValid;
    }

    getErrors() {
        return this.errors;
    }
}

// Header Component
class Header {
    constructor() {
        this.header = document.getElementById('header');
        this.navMenu = document.getElementById('nav-menu');
        this.navToggle = document.getElementById('nav-toggle');
        this.themeToggle = document.getElementById('theme-toggle');
        this.init();
    }

    init() {
        this.initMobileMenu();
        this.initThemeToggle();
        this.initScrollEffects();
    }

    initMobileMenu() {
        if (this.navToggle && this.navMenu) {
            this.navToggle.addEventListener('click', () => {
                this.navMenu.classList.toggle('active');
            });

            // Close menu when clicking on a link
            const navLinks = this.navMenu.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    this.navMenu.classList.remove('active');
                });
            });
        }
    }

    initThemeToggle() {
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => {
                const currentTheme = document.body.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                document.body.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
                
                // Update icon
                const icon = this.themeToggle.querySelector('i');
                icon.setAttribute('data-lucide', newTheme === 'dark' ? 'moon' : 'sun');
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
            });
        }
    }

    initScrollEffects() {
        let lastScrollTop = 0;
        // window.addEventListener('scroll', () => {
        //     const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
        //     // Add/remove scrolled class
        //     if (scrollTop > 50) {
        //         // this.header.classList.add('scrolled');
        //     } else {
        //         this.header.classList.remove('scrolled');
        //     }
            
        //     // Hide/show header on scroll
        //     if (scrollTop > lastScrollTop && scrollTop > 100) {
        //         // this.header.classList.add('header-hidden');
        //     } else {
        //         // this.header.classList.remove('header-hidden');
        //     }
            
        //     lastScrollTop = scrollTop;
        // });
    }
}

// Footer Component
class Footer {
    constructor() {
        this.footer = document.querySelector('.footer');
        // Only initialize if footer content exists (not just placeholder)
        if (this.footer && !this.footer.innerHTML.includes('Footer content will be dynamically generated')) {
            this.init();
        }
    }

    init() {
        this.initSocialLinks();
        this.initNewsletterForm();
    }

    initSocialLinks() {
        const socialLinks = this.footer?.querySelectorAll('.social-link');
        socialLinks?.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const platform = link.querySelector('i').getAttribute('data-lucide');
                // Handle social media links
                console.log(`Opening ${platform} link`);
            });
        });
    }

    initNewsletterForm() {
        const newsletterForm = this.footer?.querySelector('.newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = newsletterForm.querySelector('input[type="email"]').value;
                // Handle newsletter subscription
                console.log('Newsletter subscription:', email);
            });
        }
    }
}

// Card Component
class Card {
    static create(options = {}) {
        const {
            title = '',
            subtitle = '',
            content = '',
            image = '',
            imageAlt = '',
            icon = '',
            link = '',
            className = '',
            onClick = null
        } = options;

        const card = document.createElement('div');
        card.className = `card ${className}`;
        
        let cardHTML = '<div class="card-content">';
        
        if (image) {
            cardHTML += `
                <div class="card-image">
                    <img src="${image}" alt="${imageAlt}" loading="lazy">
                </div>
            `;
        }
        
        if (icon) {
            cardHTML += `
                <div class="card-icon">
                    <i data-lucide="${icon}"></i>
                </div>
            `;
        }
        
        if (title) {
            cardHTML += `<h3 class="card-title">${title}</h3>`;
        }
        
        if (subtitle) {
            cardHTML += `<p class="card-subtitle">${subtitle}</p>`;
        }
        
        if (content) {
            cardHTML += `<div class="card-body">${content}</div>`;
        }
        
        cardHTML += '</div>';
        
        card.innerHTML = cardHTML;
        
        if (link) {
            card.addEventListener('click', () => {
                window.location.href = link;
            });
            card.style.cursor = 'pointer';
        }
        
        if (onClick) {
            card.addEventListener('click', onClick);
        }
        
        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        return card;
    }
}

// Button Component
class Button {
    static create(options = {}) {
        const {
            text = 'Button',
            type = 'primary',
            size = 'medium',
            icon = '',
            iconPosition = 'left',
            link = '',
            onClick = null,
            className = '',
            disabled = false
        } = options;

        const button = document.createElement(link ? 'a' : 'button');
        button.className = `btn btn-${type} btn-${size} ${className}`;
        
        if (link) {
            button.href = link;
        }
        
        if (disabled) {
            button.disabled = true;
            button.classList.add('disabled');
        }
        
        let buttonHTML = '';
        
        if (icon && iconPosition === 'left') {
            buttonHTML += `<i data-lucide="${icon}"></i>`;
        }
        
        buttonHTML += `<span>${text}</span>`;
        
        if (icon && iconPosition === 'right') {
            buttonHTML += `<i data-lucide="${icon}"></i>`;
        }
        
        button.innerHTML = buttonHTML;
        
        if (onClick) {
            button.addEventListener('click', onClick);
        }
        
        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        return button;
    }
}

// Section Component
class Section {
    static create(options = {}) {
        const {
            title = '',
            subtitle = '',
            content = '',
            className = '',
            background = '',
            container = true
        } = options;

        const section = document.createElement('section');
        section.className = `section ${className}`;
        
        if (background) {
            section.classList.add(`bg-${background}`);
        }
        
        let sectionHTML = '';
        
        if (container) {
            sectionHTML += '<div class="container">';
        }
        
        if (title || subtitle) {
            sectionHTML += '<div class="section-header text-center">';
            if (title) {
                sectionHTML += `<h2 class="section-title">${title}</h2>`;
            }
            if (subtitle) {
                sectionHTML += `<p class="section-subtitle">${subtitle}</p>`;
            }
            sectionHTML += '</div>';
        }
        
        if (content) {
            sectionHTML += `<div class="section-content">${content}</div>`;
        }
        
        if (container) {
            sectionHTML += '</div>';
        }
        
        section.innerHTML = sectionHTML;
        
        return section;
    }
}

// Stats Component
class Stats {
    static create(options = {}) {
        const {
            stats = [],
            className = '',
            animated = true
        } = options;

        const statsContainer = document.createElement('div');
        statsContainer.className = `stats-grid ${className}`;
        
        let statsHTML = '';
        
        stats.forEach(stat => {
            statsHTML += `
                <div class="stat-item">
                    <div class="stat-number" data-target="${stat.value}">0</div>
                    <div class="stat-label">${stat.label}</div>
                </div>
            `;
        });
        
        statsContainer.innerHTML = statsHTML;
        
        if (animated) {
            this.animateNumbers(statsContainer);
        }
        
        return statsContainer;
    }

    static animateNumbers(container) {
        const numbers = container.querySelectorAll('.stat-number');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const number = entry.target;
                    const target = parseInt(number.getAttribute('data-target'));
                    this.animateNumber(number, target);
                    observer.unobserve(number);
                }
            });
        });
        
        numbers.forEach(number => observer.observe(number));
    }

    static animateNumber(element, target) {
        // Use intersection observer to trigger animation when element is visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.startCounterAnimation(entry.target, target);
                    observer.unobserve(entry.target); // Only animate once
                }
            });
        }, { 
            threshold: 0.5,
            rootMargin: '0px 0px -50px 0px'
        });

        observer.observe(element);
    }
    
    static startCounterAnimation(element, target) {
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current);
        }, 30);
    }
}

// Testimonial Component
class Testimonial {
    static create(options = {}) {
        const {
            quote = '',
            author = '',
            position = '',
            image = '',
            rating = 0,
            className = ''
        } = options;

        const testimonial = document.createElement('div');
        testimonial.className = `testimonial-card ${className}`;
        
        let starsHTML = '';
        for (let i = 0; i < 5; i++) {
            starsHTML += `<i data-lucide="${i < rating ? 'star' : 'star'}" class="${i < rating ? 'filled' : ''}"></i>`;
        }
        
        testimonial.innerHTML = `
            <div class="testimonial-content">
                <div class="testimonial-quote">
                    <i data-lucide="quote"></i>
                    <p>${quote}</p>
                </div>
                <div class="testimonial-rating">
                    ${starsHTML}
                </div>
                <div class="testimonial-author">
                    ${image ? `<img src="${image}" alt="${author}" class="author-image">` : ''}
                    <div class="author-info">
                        <h4>${author}</h4>
                        ${position ? `<p>${position}</p>` : ''}
                    </div>
                </div>
            </div>
        `;
        
        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        return testimonial;
    }
}

// Gallery Component
class Gallery {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.images = options.images || [];
        this.columns = options.columns || 3;
        this.gap = options.gap || 16;
        this.init();
    }

    init() {
        if (!this.container) return;
        
        this.render();
        this.initLightbox();
    }

    render() {
        this.container.style.display = 'grid';
        this.container.style.gridTemplateColumns = `repeat(${this.columns}, 1fr)`;
        this.container.style.gap = `${this.gap}px`;
        
        this.images.forEach(image => {
            const item = this.createGalleryItem(image);
            this.container.appendChild(item);
        });
    }

    createGalleryItem(image) {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        
        item.innerHTML = `
            <img src="${image.src}" alt="${image.alt || ''}" loading="lazy">
            ${image.caption ? `<div class="gallery-caption">${image.caption}</div>` : ''}
        `;
        
        item.addEventListener('click', () => this.openLightbox(image));
        
        return item;
    }

    initLightbox() {
        // Create lightbox container
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-overlay"></div>
            <div class="lightbox-content">
                <button class="lightbox-close">
                    <i data-lucide="x"></i>
                </button>
                <img class="lightbox-image" src="" alt="">
                <div class="lightbox-caption"></div>
            </div>
        `;

        document.body.appendChild(lightbox);
        
        // Close lightbox
        lightbox.addEventListener('click', (e) => {
            if (e.target.classList.contains('lightbox-overlay') || 
                e.target.closest('.lightbox-close')) {
                lightbox.classList.remove('show');
            }
        });
        
        this.lightbox = lightbox;
    }

    openLightbox(image) {
        const lightboxImage = this.lightbox.querySelector('.lightbox-image');
        const lightboxCaption = this.lightbox.querySelector('.lightbox-caption');
        
        lightboxImage.src = image.src;
        lightboxImage.alt = image.alt || '';
        lightboxCaption.textContent = image.caption || '';
        
        this.lightbox.classList.add('show');

        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
}

// Tabs Component
class Tabs {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.tabs = this.container?.querySelectorAll('.tab');
        this.panels = this.container?.querySelectorAll('.tab-panel');
        this.init();
    }

    init() {
        if (!this.container) return;
        
        this.tabs.forEach((tab, index) => {
            tab.addEventListener('click', () => this.switchTab(index));
        });
        
        // Show first tab by default
        if (this.tabs.length > 0) {
            this.switchTab(0);
        }
    }

    switchTab(index) {
        // Remove active class from all tabs and panels
        this.tabs.forEach(tab => tab.classList.remove('active'));
        this.panels.forEach(panel => panel.classList.remove('active'));
        
        // Add active class to selected tab and panel
        this.tabs[index]?.classList.add('active');
        this.panels[index]?.classList.add('active');
    }
}

// Accordion Component
class Accordion {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.items = this.container?.querySelectorAll('.accordion-item');
        this.init();
    }

    init() {
        if (!this.container) return;
        
        this.items.forEach(item => {
            const trigger = item.querySelector('.accordion-trigger');
            const content = item.querySelector('.accordion-content');
            
            trigger?.addEventListener('click', () => {
                const isOpen = item.classList.contains('active');
                
                // Close all other items
                this.items.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                        const otherContent = otherItem.querySelector('.accordion-content');
                        otherContent.style.maxHeight = '0px';
                    }
                });
                
                // Toggle current item
                if (isOpen) {
                    item.classList.remove('active');
                    content.style.maxHeight = '0px';
                } else {
                    item.classList.add('active');
                    content.style.maxHeight = content.scrollHeight + 'px';
                }
            });
        });
    }
}

// FAQ Accordion Component
class FAQAccordion {
    constructor(container) {
        this.container = container;
        this.items = container.querySelectorAll('.faq-item');
        this.init();
    }

    init() {
        this.items.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            const icon = item.querySelector('.faq-question i');

            question.addEventListener('click', () => {
                const isOpen = item.classList.contains('active');
                
                // Close all other items
                this.items.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                        const otherAnswer = otherItem.querySelector('.faq-answer');
                        const otherIcon = otherItem.querySelector('.faq-question i');
                        otherAnswer.style.maxHeight = '0';
                        otherIcon.style.transform = 'rotate(0deg)';
                    }
                });

                // Toggle current item
                if (isOpen) {
                    item.classList.remove('active');
                    answer.style.maxHeight = '0';
                    icon.style.transform = 'rotate(0deg)';
                } else {
                    item.classList.add('active');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                    icon.style.transform = 'rotate(180deg)';
                }
            });
        });
    }
}

// Initialize components when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize global components
    window.toast = new Toast();
    window.loading = new Loading();
    
    // Initialize header and footer
    new Header();
    new Footer();
    
    // Initialize carousels
    document.querySelectorAll('.carousel').forEach(carousel => {
        new Carousel(carousel.id, {
            autoPlay: true,
            autoPlayInterval: 5000
        });
    });
    
    // Initialize modals
    document.querySelectorAll('.modal').forEach(modal => {
        new Modal(modal.id);
    });
    
    // Initialize form validators
    document.querySelectorAll('form').forEach(form => {
        new FormValidator(form);
    });
    
    // Initialize tabs
    document.querySelectorAll('.tabs').forEach(tabs => {
        new Tabs(tabs.id);
    });
    
    // Initialize accordions
    document.querySelectorAll('.accordion').forEach(accordion => {
        new Accordion(accordion.id);
    });

    // Initialize FAQ accordions (only if not on contact page - contact page handles its own FAQ)
    if (!window.location.pathname.includes('contact')) {
        const faqContainers = document.querySelectorAll('.faq-grid');
        faqContainers.forEach(container => {
            new FAQAccordion(container);
        });
    }

    // Initialize counters
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        if (target) {
            Stats.animateNumber(counter, target);
        }
    });
});

// Global utility functions
window.showToast = (message, type = 'info', duration = 5000) => {
    if (window.toast) {
        return window.toast.show(message, type, duration);
    }
};

window.showLoading = (element, text = 'Loading...') => {
    if (window.loading) {
        window.loading.show(element, text);
    }
};

window.hideLoading = (element) => {
    if (window.loading) {
        window.loading.hide(element);
    }
};

// Export components for global use
window.Components = {
    Carousel,
        Toast,
        Modal,
        Loading,
        FormValidator,
    Header,
    Footer,
    Card,
    Button,
    Section,
    Stats,
    Testimonial,
        Gallery,
    Tabs,
    Accordion
    };
