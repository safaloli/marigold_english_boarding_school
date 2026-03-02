// ===== NOTICE/ANNOUNCEMENT MODAL FOR HOMEPAGE =====

class NoticeModal {
    constructor() {
        this.modal = null;
        this.currentSlide = 0;
        this.notices = [];
        this.storageKey = 'noticeModalShown';
        this.init();
    }

    async init() {
        // Load notices
        await this.loadNotices();
        
        // Only show if we have notices
        if (this.notices.length > 0) {
            this.createModal();
            // 1 minute delay before showing modal (60000ms)
            setTimeout(() => {
                this.show();
            }, 3000);
        }
    }

    async loadNotices() {
        try {
            // Fetch from API - only show modal if there's data in popup_notices table
            const response = await fetch('/api/content/notices/active');
            if (response.ok) {
                const data = await response.json();
                if (data.success && data.notices && data.notices.length > 0) {
                    // Only set notices if we have actual data from database
                    this.notices = data.notices;
                    return;
                }
            }
            // If API returns no data or fails, keep notices empty (modal won't show)
            this.notices = [];
        } catch (error) {
            console.warn('Failed to load notices from API:', error);
            // If API fails, keep notices empty (modal won't show)
            this.notices = [];
        }
    }

    createModal() {
        // Helper function to get fallback image URL
        const getFallbackImageUrl = () => {
            if (window.getImageFallback) {
                return window.getImageFallback('Notice', 600, 400);
            }
            // Create inline SVG fallback if function not available
            const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
                <rect fill="#f3f4f6" width="600" height="400"/>
                <text x="50%" y="45%" text-anchor="middle" fill="#9ca3af" font-family="system-ui, sans-serif" font-size="18" font-weight="500">Notice</text>
                <circle cx="50%" cy="60%" r="30" fill="none" stroke="#9ca3af" stroke-width="2"/>
                <path d="M 288 232 L 300 260 L 312 232" fill="none" stroke="#9ca3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`;
            return `data:image/svg+xml;base64,${btoa(svg)}`;
        };

        const fallbackUrl = getFallbackImageUrl();

        // Create modal HTML with carousel for multiple notices (no header/footer)
        const modalHTML = `
            <div class="notice-modal-overlay" id="noticeModalOverlay">
                <div class="notice-modal-container">
                    <button class="notice-modal-close" id="noticeModalClose" aria-label="Close modal">
                        <i data-lucide="x"></i>
                    </button>
                    
                    <div class="notice-modal-content">
                        <!-- Slides Container -->
                        <div class="notice-slides-container">
                            ${this.notices.map((notice, index) => {
                                const imageUrl = (notice.imageUrl && notice.imageUrl.trim()) ? notice.imageUrl : fallbackUrl;
                                const title = notice.title || 'Announcement';
                                const description = notice.description || notice.content || '';
                                const date = notice.date || notice.publishDate || notice.createdAt || new Date().toISOString();
                                
                                return `
                                <div class="notice-slide ${index === 0 ? 'active' : ''}" data-slide="${index}">
                                    <div class="notice-image-container">
                                        <img src="${imageUrl}" 
                                             alt="${title}" 
                                             class="notice-image"
                                             loading="lazy"
                                             data-fallback="${fallbackUrl}"
                                             onerror="if(window.handleImageError){window.handleImageError(this,'Notice');}else{this.style.display='none';this.onerror=null;}">
                                    </div>
                                </div>
                            `;
                            }).join('')}
                        </div>

                        <!-- Navigation -->
                        ${this.notices.length > 1 ? `
                            <div class="notice-navigation">
                                <button class="notice-nav-btn notice-prev" id="noticePrevBtn" aria-label="Previous notice">
                                    <i data-lucide="chevron-left"></i>
                                </button>
                                
                                <div class="notice-indicators">
                                    ${this.notices.map((_, index) => `
                                        <button class="notice-indicator ${index === 0 ? 'active' : ''}" 
                                                data-slide="${index}" 
                                                aria-label="Go to notice ${index + 1}"></button>
                                    `).join('')}
                                </div>
                                
                                <button class="notice-nav-btn notice-next" id="noticeNextBtn" aria-label="Next notice">
                                    <i data-lucide="chevron-right"></i>
                                </button>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;

        // Add modal to body
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.modal = document.getElementById('noticeModalOverlay');
        
        // Initialize event listeners
        this.initEventListeners();

        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    initEventListeners() {
        // Close button (only way to close the modal)
        const closeBtn = document.getElementById('noticeModalClose');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }

        // Navigation buttons
        if (this.notices.length > 1) {
            const prevBtn = document.getElementById('noticePrevBtn');
            const nextBtn = document.getElementById('noticeNextBtn');
            
            if (prevBtn) {
                prevBtn.addEventListener('click', () => this.prevSlide());
            }
            if (nextBtn) {
                nextBtn.addEventListener('click', () => this.nextSlide());
            }

            // Indicator dots
            const indicators = document.querySelectorAll('.notice-indicator');
            indicators.forEach(indicator => {
                indicator.addEventListener('click', (e) => {
                    const slideIndex = parseInt(e.target.getAttribute('data-slide'));
                    this.goToSlide(slideIndex);
                });
            });

            // Keyboard navigation (only arrows, no escape)
            document.addEventListener('keydown', (e) => {
                if (!this.modal || !this.modal.classList.contains('show')) return;
                
                if (e.key === 'ArrowLeft') {
                    this.prevSlide();
                } else if (e.key === 'ArrowRight') {
                    this.nextSlide();
                }
            });
        }
    }

    show() {
        if (!this.modal) return;
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        // Show modal with animation
        requestAnimationFrame(() => {
            this.modal.classList.add('show');
        });
    }

    close() {
        if (!this.modal) return;

        // Hide modal with animation
        this.modal.classList.remove('show');
        
        // Restore body scroll
        setTimeout(() => {
            document.body.style.overflow = '';
            // Remove modal from DOM after animation
            if (this.modal) {
                this.modal.remove();
                this.modal = null;
            }
        }, 300);
    }

    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.notices.length;
        this.goToSlide(nextIndex);
    }

    prevSlide() {
        const prevIndex = (this.currentSlide - 1 + this.notices.length) % this.notices.length;
        this.goToSlide(prevIndex);
    }

    goToSlide(index) {
        if (index < 0 || index >= this.notices.length) return;

        // Update slides
        const slides = document.querySelectorAll('.notice-slide');
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });

        // Update indicators
        const indicators = document.querySelectorAll('.notice-indicator');
        indicators.forEach((indicator, i) => {
            indicator.classList.toggle('active', i === index);
        });

        this.currentSlide = index;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }
}

// Initialize notice modal when DOM is ready and only on homepage
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize on homepage (index.html or root path)
    const isHomepage = window.location.pathname === '/' || 
                       window.location.pathname === '/index.html' ||
                       window.location.pathname.endsWith('/');
    
    if (isHomepage) {
        // Small delay to ensure page content is loaded first
        setTimeout(() => {
            window.noticeModal = new NoticeModal();
        }, 500);
    }
});

