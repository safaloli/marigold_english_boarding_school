// ===== ANNOUNCEMENT MODAL =====
// Shows announcements/notices on first visit to homepage

class AnnouncementModal {
    constructor() {
        this.modal = null;
        this.announcements = [];
        this.currentIndex = 0;
        this.hasShown = false;
        this.storageKey = 'marigold_announcement_shown';
        this.init();
    }

    async init() {
        // Check if modal has already been shown
        if (this.hasBeenShown()) {
            console.log('📢 Announcement modal already shown in this session');
            return;
        }

        // Fetch announcements
        await this.fetchAnnouncements();

        // Only show if we have announcements
        if (this.announcements.length > 0) {
            this.createModal();
            this.showModal();
            this.markAsShown();
        }
    }

    hasBeenShown() {
        // Check sessionStorage (shows once per session)
        // Change to localStorage if you want to show only once ever
        return sessionStorage.getItem(this.storageKey) === 'true';
    }

    markAsShown() {
        // Use sessionStorage for once per session
        // Change to localStorage for once per browser/device
        sessionStorage.setItem(this.storageKey, 'true');
        this.hasShown = true;
    }

    async fetchAnnouncements() {
        try {
            console.log('📢 Fetching announcements...');
            
            const cacheManager = window.cacheManager;
            let data;
            
            if (cacheManager) {
                data = await cacheManager.fetch('/api/content/announcements');
            } else {
                const response = await fetch('/api/content/announcements');
                if (!response.ok) {
                    throw new Error('Failed to fetch announcements');
                }
                data = await response.json();
            }

            if (data && data.success && data.content && data.content.length > 0) {
                // Filter announcements that have images
                this.announcements = data.content.filter(a => a.imageUrl || a.description);
                console.log(`📢 Loaded ${this.announcements.length} announcements`);
            }
        } catch (error) {
            console.warn('Failed to load announcements:', error);
            this.announcements = [];
        }
    }

    createModal() {
        const modalHTML = `
            <div class="announcement-modal-overlay" id="announcementModalOverlay">
                <div class="announcement-modal" id="announcementModal">
                    <button class="announcement-modal-close" id="closeAnnouncementModal" aria-label="Close announcement">
                        <i data-lucide="x"></i>
                    </button>
                    
                    <div class="announcement-modal-content">
                        <div class="announcement-modal-header">
                            <div class="announcement-badge">
                                <i data-lucide="megaphone"></i>
                                <span>Important Announcements</span>
                            </div>
                        </div>
                        
                        <div class="announcement-modal-body" id="announcementModalBody">
                            <!-- Announcements will be loaded here -->
                        </div>
                        
                        ${this.announcements.length > 1 ? `
                            <div class="announcement-modal-navigation">
                                <button class="announcement-nav-btn" id="announcementPrev" aria-label="Previous announcement">
                                    <i data-lucide="chevron-left"></i>
                                </button>
                                <div class="announcement-indicators" id="announcementIndicators"></div>
                                <button class="announcement-nav-btn" id="announcementNext" aria-label="Next announcement">
                                    <i data-lucide="chevron-right"></i>
                                </button>
                            </div>
                        ` : ''}
                        
                        <div class="announcement-modal-footer">
                            <label class="announcement-checkbox">
                                <input type="checkbox" id="dontShowAgain">
                                <span>Don't show this again</span>
                            </label>
                            <button class="btn btn-primary" id="closeAnnouncementBtn">
                                Got it!
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Get references
        this.modal = document.getElementById('announcementModal');
        this.overlay = document.getElementById('announcementModalOverlay');
        
        // Render announcements
        this.renderAnnouncement();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    renderAnnouncement() {
        const body = document.getElementById('announcementModalBody');
        const announcement = this.announcements[this.currentIndex];
        
        if (!announcement) return;

        const imageUrl = announcement.imageUrl || announcement.documentUrl || (window.getImageFallback ? window.getImageFallback('Announcement', 600, 400) : '');
        const fallbackUrl = window.getImageFallback ? window.getImageFallback('Announcement', 600, 400) : '';
        const title = announcement.title || 'Announcement';
        const description = announcement.description || announcement.content || '';
        const category = announcement.category || announcement.type || 'general';
        const date = announcement.date || announcement.publishDate || new Date().toISOString();

        body.innerHTML = `
            <div class="announcement-item">
                <div class="announcement-image-container">
                    <img src="${imageUrl}" alt="${title}" class="announcement-image" loading="eager" data-fallback="${fallbackUrl}" onerror="if(window.handleImageError){window.handleImageError(this,'Announcement');}else{this.style.display='none';this.onerror=null;}">
                    <div class="announcement-category ${category.toLowerCase()}">
                        ${category}
                    </div>
                </div>
                <div class="announcement-details">
                    <h2 class="announcement-title">${title}</h2>
                    ${description ? `<p class="announcement-description">${description}</p>` : ''}
                    <div class="announcement-meta">
                        <span class="announcement-date">
                            <i data-lucide="calendar"></i>
                            ${new Date(date).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                            })}
                        </span>
                    </div>
                </div>
            </div>
        `;

        // Update indicators if multiple announcements
        if (this.announcements.length > 1) {
            this.updateIndicators();
        }

        // Reinitialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    updateIndicators() {
        const indicatorsContainer = document.getElementById('announcementIndicators');
        if (!indicatorsContainer) return;

        indicatorsContainer.innerHTML = this.announcements.map((_, index) => `
            <button class="announcement-indicator ${index === this.currentIndex ? 'active' : ''}" 
                    data-index="${index}" 
                    aria-label="Go to announcement ${index + 1}">
            </button>
        `).join('');

        // Add click listeners to indicators
        indicatorsContainer.querySelectorAll('.announcement-indicator').forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                this.currentIndex = index;
                this.renderAnnouncement();
            });
        });
    }

    setupEventListeners() {
        // Close button
        const closeBtn = document.getElementById('closeAnnouncementModal');
        const closeBtnFooter = document.getElementById('closeAnnouncementBtn');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeModal());
        }
        
        if (closeBtnFooter) {
            closeBtnFooter.addEventListener('click', () => this.closeModal());
        }

        // Navigation buttons (if multiple announcements)
        if (this.announcements.length > 1) {
            const prevBtn = document.getElementById('announcementPrev');
            const nextBtn = document.getElementById('announcementNext');
            
            if (prevBtn) {
                prevBtn.addEventListener('click', () => this.previousAnnouncement());
            }
            
            if (nextBtn) {
                nextBtn.addEventListener('click', () => this.nextAnnouncement());
            }

            // Keyboard navigation
            document.addEventListener('keydown', this.handleKeyPress.bind(this));
        }

        // Close on overlay click
        if (this.overlay) {
            this.overlay.addEventListener('click', (e) => {
                if (e.target === this.overlay) {
                    this.closeModal();
                }
            });
        }

        // Don't show again checkbox
        const dontShowCheckbox = document.getElementById('dontShowAgain');
        if (dontShowCheckbox) {
            dontShowCheckbox.addEventListener('change', (e) => {
                if (e.target.checked) {
                    // Save to localStorage for permanent hiding
                    localStorage.setItem(this.storageKey, 'true');
                }
            });
        }

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.overlay && this.overlay.classList.contains('show')) {
                this.closeModal();
            }
        });
    }

    handleKeyPress(e) {
        if (!this.overlay || !this.overlay.classList.contains('show')) return;

        if (e.key === 'ArrowLeft') {
            this.previousAnnouncement();
        } else if (e.key === 'ArrowRight') {
            this.nextAnnouncement();
        }
    }

    nextAnnouncement() {
        this.currentIndex = (this.currentIndex + 1) % this.announcements.length;
        this.renderAnnouncement();
    }

    previousAnnouncement() {
        this.currentIndex = (this.currentIndex - 1 + this.announcements.length) % this.announcements.length;
        this.renderAnnouncement();
    }

    showModal() {
        if (!this.overlay) return;

        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        // Show modal with animation
        setTimeout(() => {
            this.overlay.classList.add('show');
        }, 500); // Small delay so it doesn't show immediately on page load
    }

    closeModal() {
        if (!this.overlay) return;

        // Hide modal with animation
        this.overlay.classList.remove('show');
        
        // Restore body scroll
        setTimeout(() => {
            document.body.style.overflow = '';
            // Remove from DOM
            if (this.overlay && this.overlay.parentNode) {
                this.overlay.parentNode.removeChild(this.overlay);
            }
        }, 300);
    }
}

// Initialize on homepage only
if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            // Initialize after a short delay to let page content load first
            setTimeout(() => {
                window.announcementModal = new AnnouncementModal();
            }, 1000);
        });
    } else {
        // DOM is already ready
        setTimeout(() => {
            window.announcementModal = new AnnouncementModal();
        }, 1000);
    }
}

// Export for global use
window.AnnouncementModal = AnnouncementModal;

