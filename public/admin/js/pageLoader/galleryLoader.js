/**
 * ========================================
 * GALLERY ALBUM CATEGORIES CONFIGURATION
 * ========================================
 * Comprehensive list of all possible categories for school gallery albums
 * Store categories here (not in database) for easy management
 * 
 * Each category has:
 * - value: Unique identifier (used in database)
 * - label: Display name
 * - icon: Emoji icon for visual identification
 * - color: Color code for UI styling
 */

const GALLERY_ALBUM_CATEGORIES = [
    // Academic & Learning
    { value: 'classroom-activities', label: 'Classroom Activities', icon: '📚', color: '#3B82F6' },
    { value: 'science-lab', label: 'Science Lab', icon: '🔬', color: '#06B6D4' },
    { value: 'computer-lab', label: 'Computer Lab', icon: '💻', color: '#6366F1' },
    { value: 'library', label: 'Library', icon: '📖', color: '#8B5CF6' },
    { value: 'art-craft', label: 'Art & Craft', icon: '🎨', color: '#F59E0B' },
    { value: 'projects', label: 'Projects & Exhibitions', icon: '🏛️', color: '#14B8A6' },
    
    // Events & Functions
    { value: 'annual-function', label: 'Annual Function/Day', icon: '🎭', color: '#E17055' },
    { value: 'independence-day', label: 'Independence Day', icon: '🇮🇳', color: '#FF6B6B' },
    { value: 'republic-day', label: 'Republic Day', icon: '🎖️', color: '#4ECDC4' },
    { value: 'teachers-day', label: 'Teachers Day', icon: '👨‍🏫', color: '#A29BFE' },
    { value: 'childrens-day', label: 'Childrens Day', icon: '👶', color: '#FD79A8' },
    { value: 'founders-day', label: 'Founders Day', icon: '🎂', color: '#FDCB6E' },
    { value: 'graduation', label: 'Graduation Ceremony', icon: '🎓', color: '#6C5CE7' },
    { value: 'prize-distribution', label: 'Prize Distribution', icon: '🏆', color: '#EAB308' },
    
    // Cultural & Festivals
    { value: 'cultural-program', label: 'Cultural Programs', icon: '🎪', color: '#A855F7' },
    { value: 'diwali', label: 'Diwali Celebration', icon: '🪔', color: '#F97316' },
    { value: 'holi', label: 'Holi Celebration', icon: '🎨', color: '#EC4899' },
    { value: 'christmas', label: 'Christmas Celebration', icon: '🎄', color: '#10B981' },
    { value: 'eid', label: 'Eid Celebration', icon: '🌙', color: '#00B894' },
    { value: 'festivals', label: 'Festivals & Celebrations', icon: '🎊', color: '#FF7675' },
    { value: 'traditional-day', label: 'Traditional Day', icon: '👘', color: '#74B9FF' },
    
    // Sports & Athletics
    { value: 'sports-day', label: 'Sports Day', icon: '⚽', color: '#10B981' },
    { value: 'athletics', label: 'Athletics Meet', icon: '🏃', color: '#00B894' },
    { value: 'yoga', label: 'Yoga & Exercise', icon: '🧘', color: '#55EFC4' },
    { value: 'indoor-games', label: 'Indoor Games', icon: '🏓', color: '#74B9FF' },
    { value: 'outdoor-games', label: 'Outdoor Games', icon: '🏏', color: '#0EA5E9' },
    { value: 'tournaments', label: 'Tournaments', icon: '🏅', color: '#FDCB6E' },
    
    // Co-curricular Activities
    { value: 'dance', label: 'Dance Performances', icon: '💃', color: '#FD79A8' },
    { value: 'music', label: 'Music Programs', icon: '🎵', color: '#A29BFE' },
    { value: 'drama', label: 'Drama & Theater', icon: '🎬', color: '#6C5CE7' },
    { value: 'debate', label: 'Debate & Elocution', icon: '🗣️', color: '#8B5CF6' },
    { value: 'quiz', label: 'Quiz Competition', icon: '❓', color: '#06B6D4' },
    
    // Field Trips & Excursions
    { value: 'field-trip', label: 'Field Trips', icon: '🚌', color: '#55EFC4' },
    { value: 'educational-tour', label: 'Educational Tours', icon: '🗺️', color: '#81ECEC' },
    { value: 'picnic', label: 'School Picnic', icon: '🏕️', color: '#00B894' },
    { value: 'nature-walk', label: 'Nature Walk', icon: '🌳', color: '#96CEB4' },
    
    // Special Days
    { value: 'orientation', label: 'Orientation Program', icon: '📋', color: '#3B82F6' },
    { value: 'parent-meeting', label: 'Parent-Teacher Meeting', icon: '👨‍👩‍👧', color: '#74B9FF' },
    { value: 'farewell', label: 'Farewell Ceremony', icon: '👋', color: '#E17055' },
    { value: 'assembly', label: 'Morning Assembly', icon: '🎤', color: '#0EA5E9' },
    { value: 'workshop', label: 'Workshops & Seminars', icon: '💼', color: '#6366F1' },
    
    // Infrastructure & Facilities
    { value: 'campus', label: 'School Campus', icon: '🏫', color: '#96CEB4' },
    { value: 'infrastructure', label: 'Infrastructure', icon: '🏗️', color: '#B2BEC3' },
    { value: 'playground', label: 'Playground & Sports Facilities', icon: '🏟️', color: '#10B981' },
    { value: 'cafeteria', label: 'Cafeteria & Dining', icon: '🍽️', color: '#F59E0B' },
    
    // Social & Community
    { value: 'social-service', label: 'Social Service', icon: '🤝', color: '#EC4899' },
    { value: 'plantation', label: 'Plantation Drive', icon: '🌱', color: '#00B894' },
    { value: 'cleanliness', label: 'Cleanliness Campaign', icon: '🧹', color: '#55EFC4' },
    { value: 'awareness', label: 'Awareness Programs', icon: '📢', color: '#0984E3' },
    
    // Achievements
    { value: 'awards', label: 'Awards & Honors', icon: '🏆', color: '#EAB308' },
    { value: 'achievements', label: 'Student Achievements', icon: '🌟', color: '#FDCB6E' },
    { value: 'medals', label: 'Medals & Trophies', icon: '🥇', color: '#F97316' },
    
    // General
    { value: 'general', label: 'General Gallery', icon: '📷', color: '#94A3B8' },
    { value: 'memories', label: 'School Memories', icon: '💝', color: '#FD79A8' },
    { value: 'highlights', label: 'Year Highlights', icon: '✨', color: '#A29BFE' },
    { value: 'other', label: 'Other', icon: '📸', color: '#DFE6E9' }
];

/**
 * Gallery Manager - Modern Admin Interface
 * Handles dynamic loading and management of gallery sections matching public gallery design
 */
class GalleryManager {
    // Spinner SVG constant for loading states
    static get SPINNER_SVG() {
        return '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-loader-2 animate-spin" style="display: inline-block; vertical-align: middle; margin-right: 0.5rem;"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>';
    }
    
    constructor() {
        this.currentSection = 'gallery';
        this.currentSubSection = null;
        this.currentAlbumId = null;
        this.currentAlbumTitle = null;
        this.selectedFiles = [];
        this.selectedVideoFiles = [];
        this.galleryStats = {
            photoAlbums: 0,
            totalPhotos: 0,
            videoAlbums: 0,
            totalVideos: 0,
            featuredMoments: 0
        };
        this.albumCategories = GALLERY_ALBUM_CATEGORIES; // Store categories for easy access
        this.init();
    }

    init() {
        this.bindEvents();
    }

    /**
     * Helper: Get category details by value
     */
    getCategoryDetails(categoryValue) {
        if (!categoryValue) return null;
        return GALLERY_ALBUM_CATEGORIES.find(cat => cat.value === categoryValue);
    }

    /**
     * Helper: Get category label
     */
    getCategoryLabel(categoryValue) {
        const category = this.getCategoryDetails(categoryValue);
        return category ? category.label : categoryValue;
    }

    /**
     * Helper: Get category icon
     */
    getCategoryIcon(categoryValue) {
        const category = this.getCategoryDetails(categoryValue);
        return category ? category.icon : '📷';
    }

    /**
     * Helper: Get category color
     */
    getCategoryColor(categoryValue) {
        const category = this.getCategoryDetails(categoryValue);
        return category ? category.color : '#94A3B8';
    }

    /**
     * Helper: Format category display with icon
     */
    formatCategoryDisplay(categoryValue) {
        const category = this.getCategoryDetails(categoryValue);
        if (!category) return categoryValue || 'General';
        return `${category.icon} ${category.label}`;
    }

    /**
     * Initialize searchable select for category dropdowns
     */
    initializeSearchableSelects() {
        // Check if SearchableSelect class is available
        if (typeof SearchableSelect === 'undefined') {
            console.warn('SearchableSelect class not loaded yet');
            return;
        }

        // Find all category select elements that aren't already initialized
        const selectors = [
            '#album-category',
            '#video-album-category',
            'select[name="category"]'
        ];

        selectors.forEach(selector => {
            const selectElement = document.querySelector(selector);
            
            if (selectElement && !selectElement.classList.contains('searchable-select-initialized')) {
                try {
                    new SearchableSelect(selectElement, {
                        placeholder: 'Search album categories...',
                        noResultsText: 'No matching categories found',
                        maxHeight: '300px'
                    });
                    console.log(`✅ Initialized searchable select for gallery: ${selector}`);
                } catch (error) {
                    console.error(`❌ Failed to initialize searchable select for ${selector}:`, error);
                }
            }
        });
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Gallery section click
        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-section="gallery"]')) {
                e.preventDefault();
                this.loadGallery();
            }
        });

        // Gallery action buttons handler
        document.addEventListener('click', (e) => {
            const actionButton = e.target.closest('[data-action]');
            if (actionButton) {
                const action = actionButton.getAttribute('data-action');
                
                if (action === 'edit-hero') {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    this.openHeroEditor();
                    return;
                }
                
                if (action === 'edit-photo-gallery') {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    this.loadGallerySubSection('photo-gallery');
                    return;
                }

                
                if (action === 'save-hero-section') {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    // SaveButton component will handle this
                    return;
                }
                
                if (action === 'cancel-hero-section') {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    this.loadGallery();
                    return;
                }
                
                if (action === 'open-image-upload') {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    this.openImageUpload();
                    return;
                }
                
                if (action === 'remove-hero-image') {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    this.removeHeroImage();
                    return;
                }
            }
        });

        // Upload button handler for empty state
        document.addEventListener('click', (e) => {
            if (e.target.closest('#upload-photos-btn-empty')) {
                e.preventDefault();
                e.stopImmediatePropagation();
                this.openImageUpload();
                return;
            }
        });

        // Back button handler - handle data-action attributes
        document.addEventListener('click', (e) => {
            const backButton = e.target.closest('.back-button');
            if (backButton) {
                const action = backButton.getAttribute('data-action');
                
                if (action === 'back-to-gallery-main') {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    this.backToGalleryMain();
                    return;
                }
                
                if (action === 'back-to-photo-albums') {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    this.backToPhotoAlbums();
                    return;
                }
                
                if (action === 'back-to-video-albums') {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    this.backToVideoAlbums();
                    return;
                }
                
                // Fallback: check if we're in gallery context
                if (this.isGalleryContext(backButton)) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    this.backToGalleryMain();
                }
            }
        });
    }

    /**
     * Open image upload modal
     */
    openImageUpload() {
        this.showUploadModal();
    }

    /**
     * Load gallery section dynamically
     */
    async loadGallery() {
        try {
            // Get gallery content
            const content = this.getGalleryContent();
            
            // Inject content into page-content
            this.injectContent(content);
            
            // Initialize gallery functionality
            this.initializeGallery();
            
            // Update navigation
            this.updateNavigation();
            
            // Load comprehensive gallery statistics
            this.fetchGalleryStats();
            
        } catch (error) {
            console.error('Error loading gallery section:', error);
            this.showError('Failed to load gallery section');
        }
    }

    /**
     * Get gallery content HTML - Modern Design
     */
    getGalleryContent() {
        return `
            <section id="gallery-section" class="content-section active">
                <div class="page-header">
                    <div class="page-title">
                        <h1>Gallery Management</h1>
                        <p>Manage photo and video galleries with modern, interactive interface</p>
                    </div>
                </div>

                <!-- Gallery Sections Grid -->
                <div class="gallery-sections-grid">
                    <!-- Gallery Hero Section -->
                    <div class="gallery-section-card" data-subsection="gallery-hero">
                        <div class="gallery-card-header">
                            <div class="gallery-card-icon">
                                <i data-lucide="image"></i>
                            </div>
                            <div class="gallery-card-info">
                                <h3>Gallery Hero Section</h3>
                                <p>Edit the main banner and hero content of the gallery page</p>
                            </div>
                        </div>
                        <div class="gallery-card-stats">
                            <div class="stat-item">
                                <span class="stat-number">1</span>
                                <span class="stat-label">Hero Banner</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-number">Active</span>
                                <span class="stat-label">Status</span>
                            </div>
                        </div>
                        <div class="gallery-card-actions">
                            <button class="btn btn-primary btn-sm" data-action="edit-hero">
                                <i data-lucide="edit"></i>
                                Edit Hero Section
                            </button>
                        </div>
                    </div>

                    <!-- Photo Album Section -->
                    <div class="gallery-section-card" data-subsection="photo-gallery">
                        <div class="gallery-card-header">
                            <div class="gallery-card-icon">
                                <i data-lucide="images"></i>
                            </div>
                            <div class="gallery-card-info">
                                <h3>Photo Album</h3>
                                <p>Manage photo collections and albums</p>
                            </div>
                        </div>
                        <div class="gallery-card-stats">
                            <div class="stat-item">
                                <span class="stat-number" id="photo-albums-count">0</span>
                                <span class="stat-label">Albums</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-number" id="photo-count">0</span>
                                <span class="stat-label">Photos</span>
                            </div>
                        </div>
                        <div class="gallery-card-actions">
                            <button class="btn btn-primary btn-sm" data-action="edit-photo-gallery">
                                <i data-lucide="edit"></i>
                                Edit Gallery
                        </button>
                    </div>
                </div>

                    <!-- Video Album Section -->
                    <div class="gallery-section-card" data-subsection="video-gallery">
                        <div class="gallery-card-header">
                            <div class="gallery-card-icon">
                                <i data-lucide="video"></i>
                        </div>
                            <div class="gallery-card-info">
                                <h3>Video Album</h3>
                                <p>Manage video collections and playlists</p>
                        </div>
                    </div>
                        <div class="gallery-card-stats">
                            <div class="stat-item">
                                <span class="stat-number" id="video-collections-count">0</span>
                                <span class="stat-label">Collections</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-number" id="video-count">0</span>
                                <span class="stat-label">Videos</span>
                            </div>
                    </div>
                        <div class="gallery-card-actions">
                            <button class="btn btn-primary btn-sm">
                                <i data-lucide="edit"></i>
                                Edit Gallery
                            </button>
                        </div>
                </div>

                    <!-- Featured Moments Section -->
                    <div class="gallery-section-card" data-subsection="featured-moments">
                        <div class="gallery-card-header">
                            <div class="gallery-card-icon">
                                <i data-lucide="star"></i>
                            </div>
                            <div class="gallery-card-info">
                                <h3>Featured Moments</h3>
                                <p>Highlight special moments and achievements</p>
                            </div>
                        </div>
                        <div class="gallery-card-stats">
                            <div class="stat-item">
                                <span class="stat-number" id="featured-moments-count">0</span>
                                <span class="stat-label">Moments</span>
                        </div>
                    </div>
                        <div class="gallery-card-actions">
                            <button class="btn btn-primary btn-sm">
                                <i data-lucide="edit"></i>
                                Edit Moments
                            </button>
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
     * Initialize gallery functionality
     */
    initializeGallery() {
        // Add click handlers for gallery section cards
        document.querySelectorAll('.gallery-section-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const subsection = card.getAttribute('data-subsection');
                this.loadGallerySubSection(subsection);
            });
        });

        // Add click handlers for album cards
        document.querySelectorAll('.photo-album-card').forEach(card => {
            card.addEventListener('click', (e) => {
                // Don't open if clicking on action buttons
                if (e.target.closest('.album-actions')) {
                    return;
                }
                const albumId = card.getAttribute('data-album-id');
                const albumTitle = card.querySelector('.album-title').textContent;
                this.openAlbumEditor(albumId, albumTitle);
            });
        });

        // Add click handler for add album button
        const addAlbumBtn = document.getElementById('add-album-btn');
        if (addAlbumBtn) {
            addAlbumBtn.addEventListener('click', async () => {
                await this.showAddAlbumModal();
            });
        }

        // Add click handler for refresh albums button
        const refreshAlbumsBtn = document.getElementById('refresh-albums-btn');
        if (refreshAlbumsBtn) {
            refreshAlbumsBtn.addEventListener('click', () => {
                this.loadPhotoAlbums();
            });
        }

        // Add click handler for add first album button
        const addFirstAlbumBtn = document.getElementById('add-first-album-btn');
        if (addFirstAlbumBtn) {
            addFirstAlbumBtn.addEventListener('click', async () => {
                await this.showAddAlbumModal();
            });
        }

        // Load photo albums if we're in photo gallery section
        if (this.currentSubSection === 'photo-gallery') {
            this.loadPhotoAlbums();
        }

        // Load video albums if we're in video gallery section
        if (this.currentSubSection === 'video-gallery') {
            this.loadVideoAlbums();
        }

        // Add click handler for add video album button
        const addVideoAlbumBtn = document.getElementById('add-video-album-btn');
        if (addVideoAlbumBtn) {
            addVideoAlbumBtn.addEventListener('click', async () => {
                await this.showAddVideoAlbumModal();
            });
        }

        // Add click handler for add first video album button
        const addFirstVideoAlbumBtn = document.getElementById('add-first-video-album-btn');
        if (addFirstVideoAlbumBtn) {
            addFirstVideoAlbumBtn.addEventListener('click', async () => {
                await this.showAddVideoAlbumModal();
            });
        }

        // Add click handlers for delete album buttons
        document.querySelectorAll('.delete-album-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent card click event
                const albumCard = btn.closest('.photo-album-card');
                const albumId = albumCard.getAttribute('data-album-id');
                const albumTitle = albumCard.querySelector('.album-title').textContent;
                this.showAlbumDeleteConfirmation(albumId, albumTitle);
            });
        });

        // Add click handlers for edit album buttons
        document.querySelectorAll('.edit-album-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent card click event
                const albumCard = btn.closest('.photo-album-card');
                const albumId = albumCard.getAttribute('data-album-id');
                const albumTitle = albumCard.querySelector('.album-title').textContent;
                this.openAlbumEditor(albumId, albumTitle);
            });
        });

        // Add click handlers for video album cards
        document.querySelectorAll('.video-album-card').forEach(card => {
            card.addEventListener('click', (e) => {
                // Don't open if clicking on action buttons
                if (e.target.closest('.album-actions')) {
                    return;
                }
                const albumId = card.getAttribute('data-album-id');
                const albumTitle = card.querySelector('.album-title').textContent;
                this.openVideoAlbumEditor(albumId, albumTitle);
            });
        });

        // Add click handlers for delete video album buttons
        document.querySelectorAll('.delete-video-album-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent card click event
                const albumCard = btn.closest('.video-album-card');
                const albumId = albumCard.getAttribute('data-album-id');
                const albumTitle = albumCard.querySelector('.album-title').textContent;
                this.showDeleteVideoAlbumConfirmation(albumId, albumTitle);
            });
        });

        // Add click handlers for edit video album buttons
        document.querySelectorAll('.edit-video-album-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent card click event
                const albumCard = btn.closest('.video-album-card');
                const albumId = albumCard.getAttribute('data-album-id');
                const albumTitle = albumCard.querySelector('.album-title').textContent;
                this.openVideoAlbumEditor(albumId, albumTitle);
            });
        });

        // Add click handler for add featured moment button
        const addFeaturedMomentBtn = document.getElementById('add-featured-moment-btn');
        if (addFeaturedMomentBtn) {
            addFeaturedMomentBtn.addEventListener('click', () => {
                this.showAddFeaturedMomentModal();
            });
        }

        // Initialize featured moments functionality
        this.initializeFeaturedMoments();
    }

    /**
     * Load specific gallery subsection
     */
    async loadGallerySubSection(subsection) {
        this.currentSubSection = subsection;
        
        let content = '';
        switch(subsection) {
            case 'photo-gallery':
                content = this.getPhotoGalleryEditor();
                break;
            case 'video-gallery':
                content = this.getVideoGalleryEditor();
                break;
            case 'featured-moments':
                content = this.getFeaturedMomentsEditor();
                break;
            default:
                content = this.getGalleryContent();
        }
        
        this.injectContent(content);
        this.initializeGallery();
        
        // Load featured moments data when featured moments section is activated
        if (subsection === 'featured-moments') {
            await this.loadFeaturedMoments();
        }
    }

    /**
     * Get Photo Gallery Editor
     */
    getPhotoGalleryEditor() {
        return `
            <section id="photo-gallery-editor" class="content-section active">
                <div class="page-header">
                    <button class="back-button">
                        <i data-lucide="arrow-left"></i>
                    </button>
                    <div class="page-title">
                        <h1>Photo Albums</h1>
                        <p>Manage and organize your photo albums</p>
                    </div>
                    <div class="page-actions">
                        <button class="btn btn-primary" id="add-album-btn">
                            <i data-lucide="plus"></i>
                            Add Album
                        </button>
                        <button class="btn btn-secondary" id="refresh-albums-btn">
                            <i data-lucide="refresh-cw"></i>
                            Refresh
                        </button>
                    </div>
                </div>

                <div class="photo-albums-grid" id="albums-loading" style="display: none;">
                    <!-- Placeholder album cards while loading -->
                    <div class="photo-album-card photo-album-placeholder">
                        <div class="album-info">
                            <div class="placeholder-line placeholder-title"></div>
                            <div class="placeholder-line placeholder-meta"></div>
                        </div>
                        <div class="album-actions">
                            <div class="placeholder-btn"></div>
                            <div class="placeholder-btn"></div>
                        </div>
                    </div>
                    <div class="photo-album-card photo-album-placeholder">
                        <div class="album-info">
                            <div class="placeholder-line placeholder-title"></div>
                            <div class="placeholder-line placeholder-meta"></div>
                        </div>
                        <div class="album-actions">
                            <div class="placeholder-btn"></div>
                            <div class="placeholder-btn"></div>
                        </div>
                    </div>
                    <div class="photo-album-card photo-album-placeholder">
                        <div class="album-info">
                            <div class="placeholder-line placeholder-title"></div>
                            <div class="placeholder-line placeholder-meta"></div>
                        </div>
                        <div class="album-actions">
                            <div class="placeholder-btn"></div>
                            <div class="placeholder-btn"></div>
                        </div>
                    </div>
                    <div class="photo-album-card photo-album-placeholder">
                        <div class="album-info">
                            <div class="placeholder-line placeholder-title"></div>
                            <div class="placeholder-line placeholder-meta"></div>
                        </div>
                        <div class="album-actions">
                            <div class="placeholder-btn"></div>
                            <div class="placeholder-btn"></div>
                        </div>
                        </div>
                    </div>

                <div class="empty-state" id="albums-empty" style="display: none;">
                    <div class="empty-icon">
                        <i data-lucide="images"></i>
                        </div>
                    <h3>No Photo Albums</h3>
                    <p>Create your first photo album to get started.</p>
                    <button class="btn btn-primary" id="add-first-album-btn">
                        <i data-lucide="plus"></i>
                        Create Album
                            </button>
                    </div>

                <!-- Photo Albums Grid -->
                <div class="photo-albums-grid" id="photo-albums-grid">
                    <!-- Photo albums will be loaded dynamically from database -->
                </div>
            </section>
        `;
    }

    /**
     * Get Video Gallery Editor
     */
    getVideoGalleryEditor() {
        return `
            <section id="video-gallery-editor" class="content-section active">
                <div class="page-header">
                    <button class="back-button" data-action="back-to-gallery-main">
                        <i data-lucide="arrow-left"></i>
                    </button>
                    <div class="page-title">
                        <h1>Video Albums</h1>
                        <p>Manage and organize your video albums</p>
                    </div>
                    <div class="page-actions">
                        <button class="btn btn-primary" id="add-video-album-btn">
                            <i data-lucide="plus"></i>
                            Add Album
                        </button>
                    </div>
                </div>

                <!-- Loading State -->
                <div id="albums-loading" style="display: none;">
                    <div class="video-album-placeholder">
                        <div class="placeholder-content">
                            <div class="placeholder-icon"></div>
                            <div class="placeholder-text"></div>
                            <div class="placeholder-text short"></div>
                        </div>
                    </div>
                    <div class="video-album-placeholder">
                        <div class="placeholder-content">
                            <div class="placeholder-icon"></div>
                            <div class="placeholder-text"></div>
                            <div class="placeholder-text short"></div>
                        </div>
                    </div>
                    <div class="video-album-placeholder">
                        <div class="placeholder-content">
                            <div class="placeholder-icon"></div>
                            <div class="placeholder-text"></div>
                            <div class="placeholder-text short"></div>
                        </div>
                    </div>
                    <div class="video-album-placeholder">
                        <div class="placeholder-content">
                            <div class="placeholder-icon"></div>
                            <div class="placeholder-text"></div>
                            <div class="placeholder-text short"></div>
                        </div>
                    </div>
                </div>

                <!-- Video Albums Grid -->
                <div class="video-albums-grid" id="video-albums-grid">
                    <!-- Video albums will be loaded dynamically -->
                </div>

                <!-- Empty State -->
                <div id="empty-video-albums" style="display: none;">
                    <div class="empty-state">
                        <div class="empty-icon">
                            <i data-lucide="video"></i>
                        </div>
                        <h3>No Video Albums Yet</h3>
                        <p>Create your first video album to get started</p>
                        <button class="btn btn-primary" id="add-first-video-album-btn">
                            <i data-lucide="plus"></i>
                            Add Video Album
                        </button>
                    </div>
                </div>
            </section>
        `;
    }

    /**
     * Get Featured Moments Editor
     */
    getFeaturedMomentsEditor() {
        return `
            <section id="featured-moments-editor" class="content-section active">
                <div class="page-header">
                    <button class="back-button" data-action="back-to-gallery-main">
                        <i data-lucide="arrow-left"></i>
                    </button>
                    <div class="page-title">
                        <h1>Manage Featured Moments</h1>
                        <p>Organize and manage featured moments for the gallery</p>
                    </div>
                    <div class="page-actions">
                        <button class="btn btn-primary" id="add-featured-moment-btn">
                            <i data-lucide="plus"></i>
                            Add Featured Moment
                        </button>
                    </div>
                </div>

                <!-- Featured Moments Table -->
                <div class="featured-moments-container">
                    <div class="featured-moments-card">
                        <div class="featured-moments-table">
                            <div class="table-header">
                                <div class="table-cell header-cell">Album</div>
                                <div class="table-cell header-cell">Description</div>
                                <div class="table-cell header-cell">Order</div>
                                <div class="table-cell header-cell">Actions</div>
                            </div>
                            
                            <div class="table-body" id="featured-moments-table-body">
                                <!-- Loading placeholder rows -->
                                <div class="table-row featured-moment-placeholder">
                                    <div class="table-cell">
                                        <div class="album-info">
                                            <div class="album-icon">
                                                <div class="placeholder-icon"></div>
                                            </div>
                                            <div class="placeholder-line placeholder-title"></div>
                                        </div>
                                    </div>
                                    <div class="table-cell">
                                        <div class="placeholder-line placeholder-description"></div>
                                    </div>
                                    <div class="table-cell">
                                        <div class="placeholder-line placeholder-order"></div>
                                    </div>
                                    <div class="table-cell">
                                        <div class="action-links">
                                            <div class="placeholder-btn"></div>
                                            <div class="placeholder-btn"></div>
                                        </div>
                                    </div>
                                </div>

                                <div class="table-row featured-moment-placeholder">
                                    <div class="table-cell">
                                        <div class="album-info">
                                            <div class="album-icon">
                                                <div class="placeholder-icon"></div>
                                            </div>
                                            <div class="placeholder-line placeholder-title"></div>
                                        </div>
                                    </div>
                                    <div class="table-cell">
                                        <div class="placeholder-line placeholder-description"></div>
                                    </div>
                                    <div class="table-cell">
                                        <div class="placeholder-line placeholder-order"></div>
                                    </div>
                                    <div class="table-cell">
                                        <div class="action-links">
                                            <div class="placeholder-btn"></div>
                                            <div class="placeholder-btn"></div>
                                        </div>
                                    </div>
                                </div>

                                <div class="table-row featured-moment-placeholder">
                                    <div class="table-cell">
                                        <div class="album-info">
                                            <div class="album-icon">
                                                <div class="placeholder-icon"></div>
                                            </div>
                                            <div class="placeholder-line placeholder-title"></div>
                                        </div>
                                    </div>
                                    <div class="table-cell">
                                        <div class="placeholder-line placeholder-description"></div>
                                    </div>
                                    <div class="table-cell">
                                        <div class="placeholder-line placeholder-order"></div>
                                    </div>
                                    <div class="table-cell">
                                        <div class="action-links">
                                            <div class="placeholder-btn"></div>
                                            <div class="placeholder-btn"></div>
                                        </div>
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
     * Check if we're in gallery context
     */
    isGalleryContext(backButton) {
        // First check if we're in the gallery section
        if (this.currentSection !== 'gallery') {
            return false;
        }
        
        // Check if the back button is within a gallery context
        if (backButton && backButton.closest('#gallery-editor, #photo-gallery-editor, #video-gallery-editor, #featured-moments-editor, #photo-album-editor, #video-album-editor')) {
            return true;
        }
        
        // Fallback: check if current content is gallery-related
        const pageContent = document.getElementById('page-content');
        if (!pageContent) return false;
        
        const galleryElements = pageContent.querySelector('#gallery-editor, #photo-gallery-editor, #video-gallery-editor, #featured-moments-editor, #photo-album-editor, #video-album-editor');
        return galleryElements !== null;
    }

    /**
     * Back to gallery main
     */
    backToGalleryMain() {
        // Cleanup ImageUpload component if it exists
        if (this.heroImageUpload) {
            this.heroImageUpload.destroy();
            this.heroImageUpload = null;
        }
        
        this.currentSubSection = null;
        const content = this.getGalleryContent();
        this.injectContent(content);
        this.initializeGallery();
    }

    /**
     * Show delete confirmation dialog for albums
     */
    showAlbumDeleteConfirmation(albumId, albumTitle) {
        
        // Create modal overlay
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'delete-confirmation-overlay';
        modalOverlay.innerHTML = `
            <div class="delete-confirmation-modal">
                <div class="modal-header">
                    <div class="modal-icon">
                        <i data-lucide="alert-triangle"></i>
                    </div>
                    <h3>Delete Album</h3>
                </div>
                <div class="modal-content">
                    <p>Are you sure you want to delete <strong>"${albumTitle}"</strong>?</p>
                    <p class="warning-text">This action cannot be undone and will permanently remove the album and all its photos.</p>
                </div>
                <div class="modal-actions">
                    <button class="btn btn-secondary cancel-delete-btn">
                        <i data-lucide="x"></i>
                        Cancel
                    </button>
                    <button class="btn btn-danger confirm-delete-btn" data-album-id="${albumId}">
                        <i data-lucide="trash-2"></i>
                        Delete Album
                    </button>
                </div>
            </div>
        `;

        // Add to page
        document.body.appendChild(modalOverlay);

        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        // Add event listeners
        const cancelBtn = modalOverlay.querySelector('.cancel-delete-btn');
        const confirmBtn = modalOverlay.querySelector('.confirm-delete-btn');

        const closeModal = () => {
            modalOverlay.remove();
        };

        cancelBtn.addEventListener('click', closeModal);
        confirmBtn.addEventListener('click', () => {
            this.deleteAlbum(albumId);
            closeModal();
        });

        // Close on overlay click
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });

        // Close on Escape key
        const handleKeydown = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', handleKeydown);
            }
        };
        document.addEventListener('keydown', handleKeydown);
    }

    /**
     * Delete album
     */
    async deleteAlbum(albumId) {
        try {

            // Delete album from database
            const response = await fetch(`/api/content/gallery/photo-albums/${albumId}`, {
                method: 'DELETE'
            });

            const data = await response.json();

            if (data.success) {
        // Find and remove the album card
        const albumCard = document.querySelector(`[data-album-id="${albumId}"]`);
        if (albumCard) {
            // Add removal animation
            albumCard.style.transition = 'all 0.3s ease';
            albumCard.style.transform = 'scale(0.8)';
            albumCard.style.opacity = '0';
            
            setTimeout(() => {
                albumCard.remove();
                        if (window.NotificationManager) {
                            window.NotificationManager.show('success', 'Success', 'Album deleted successfully');
                        }
                        
                        // Refresh gallery statistics
                        this.fetchGalleryStats();
            }, 300);
                }
            } else {
                if (window.NotificationManager) {
                    window.NotificationManager.show('error', 'Error', data.error || 'Failed to delete album');
                }
            }
        } catch (error) {
            console.error('Error deleting album:', error);
            if (window.NotificationManager) {
                window.NotificationManager.show('error', 'Error', 'Failed to delete album');
            }
        }
    }

    /**
     * Open album editor
     */
    openAlbumEditor(albumId, albumTitle) {
        this.currentAlbumId = albumId;
        this.currentAlbumTitle = albumTitle;
        
        const content = this.getAlbumEditor(albumId, albumTitle);
        this.injectContent(content);
        this.initializeAlbumEditor();
        this.loadAlbumPhotos(albumId, albumTitle);
    }

    /**
     * Get album editor content
     */
    getAlbumEditor(albumId, albumTitle) {
        return `
            <section id="album-editor" class="content-section active">
                <div class="page-header">
                    <button class="back-button" data-action="back-to-photo-albums">
                        <i data-lucide="arrow-left"></i>
                    </button>
                    <div class="page-title">
                        <h1>Album: ${albumTitle}</h1>
                        <p>Manage photos for this album. Select photos to perform actions.</p>
                    </div>
                    <div class="page-actions">
                        <button class="btn btn-primary" id="upload-photos-btn">
                            <i data-lucide="upload"></i>
                            Upload Photos
                        </button>
                    </div>
                </div>

                <!-- Photo Grid -->
                <div class="photo-grid-container">
                    <div class="photo-grid" id="photo-grid">
                        <!-- Placeholder boxes while loading -->
                        <div class="photo-placeholder" id="photo-placeholder-1">
                            <div class="placeholder-content">
                                <div class="placeholder-icon">
                                    <i data-lucide="image"></i>
                                </div>
                            </div>
                        </div>
                        <div class="photo-placeholder" id="photo-placeholder-2">
                            <div class="placeholder-content">
                                <div class="placeholder-icon">
                                    <i data-lucide="image"></i>
                                </div>
                            </div>
                        </div>
                        <div class="photo-placeholder" id="photo-placeholder-3">
                            <div class="placeholder-content">
                                <div class="placeholder-icon">
                                    <i data-lucide="image"></i>
                                </div>
                            </div>
                        </div>
                        <div class="photo-placeholder" id="photo-placeholder-4">
                            <div class="placeholder-content">
                                <div class="placeholder-icon">
                                    <i data-lucide="image"></i>
                                </div>
                            </div>
                        </div>
                        <div class="photo-placeholder" id="photo-placeholder-5">
                            <div class="placeholder-content">
                                <div class="placeholder-icon">
                                    <i data-lucide="image"></i>
                                </div>
                            </div>
                        </div>
                        <div class="photo-placeholder" id="photo-placeholder-6">
                            <div class="placeholder-content">
                                <div class="placeholder-icon">
                                    <i data-lucide="image"></i>
                                </div>
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
     * Initialize album editor
     */
    initializeAlbumEditor() {
        // Add click handlers for photo action buttons
        document.querySelectorAll('.photo-action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = btn.getAttribute('data-action');
                const photoCard = btn.closest('.photo-card');
                const photoId = photoCard.getAttribute('data-photo-id');
                this.handlePhotoAction(action, photoId);
            });
        });

        // Add click handler for upload photos button
        const uploadBtn = document.getElementById('upload-photos-btn');
        if (uploadBtn) {
            uploadBtn.addEventListener('click', () => {
                this.showUploadModal();
            });
        }
    }

    /**
     * Handle photo actions
     */
    handlePhotoAction(action, photoId) {
        switch(action) {
            case 'view':
                this.viewPhoto(photoId);
                break;
            case 'edit':
                this.editPhoto(photoId);
                break;
            case 'delete':
                this.deletePhoto(photoId);
                break;
        }
    }

    /**
     * View photo
     */
    viewPhoto(photoId) {
        alert(`View photo: ${photoId}`);
    }

    /**
     * Edit photo
     */
    editPhoto(photoId) {
        alert(`Edit photo: ${photoId}`);
    }

    /**
     * Delete photo
     */
    async deletePhoto(photoId) {
        
        const photoCard = document.querySelector(`[data-photo-id="${photoId}"]`);
        const photoTitle = photoCard ? photoCard.querySelector('img').alt || 'this photo' : 'this photo';
        
        
        // Show custom confirmation dialog
        const confirmed = await this.showDeleteConfirmation('Photo', photoTitle, 'photo');
        if (!confirmed) {
            return;
        }

        try {
            
            // Show progress indicator
            this.showDeleteProgress(photoCard, 'photo');
            
            // Start progress animation
            this.startDeleteProgressAnimation(photoCard);

            // Call API to delete photo from database and Cloudinary
            const response = await fetch(`/api/content/gallery/photos/${photoId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });


            // Stop progress animation
            this.stopDeleteProgressAnimation(photoCard);

            const result = await response.json();

            if (result.success) {
                
                // Remove from UI after successful deletion
                if (photoCard) {
                    setTimeout(() => {
                        photoCard.remove();
                        // Refresh photo count in album stats
                        this.refreshPhotoGrid();
                    }, 300);
                }
                
                window.NotificationManager.show('success', 'Success', 'Photo deleted successfully');
            } else {
                console.error(`❌ DELETE PHOTO: API returned error:`, result.error);
                throw new Error(result.error || 'Failed to delete photo');
            }

        } catch (error) {
            console.error('❌ DELETE PHOTO: Error deleting photo:', error);
            
            // Stop progress animation on error
            this.stopDeleteProgressAnimation(photoCard);
            
            // Reset UI state on error
            if (photoCard) {
                photoCard.style.transform = 'scale(1)';
                photoCard.style.opacity = '1';
            }
            
            window.NotificationManager.show('error', 'Error', `Failed to delete photo: ${error.message}`);
        }
    }

    /**
     * Back to photo albums
     */
    backToPhotoAlbums() {
        this.currentAlbumId = null;
        this.currentAlbumTitle = null;
        const content = this.getPhotoGalleryEditor();
        this.injectContent(content);
        this.initializeGallery();
    }

    /**
     * Show upload modal
     */
    showUploadModal() {
        // Create modal overlay
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'upload-modal-overlay';
        modalOverlay.innerHTML = this.getUploadModalHTML();
        
        // Add to page
        document.body.appendChild(modalOverlay);

        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        // Initialize upload functionality
        this.initializeUploadModal();
    }

    /**
     * Get upload modal HTML
     */
    getUploadModalHTML() {
        return `
            <div class="upload-modal">
                <div class="upload-modal-header">
                    <div class="upload-modal-title">
                        <h2>Upload Photos</h2>
                        <p>Add images to the album</p>
                    </div>
                    <button class="upload-modal-close" id="close-upload-modal">
                        <i data-lucide="x"></i>
                    </button>
                </div>

                <div class="upload-modal-content">
                    <!-- Drag and Drop Zone -->
                    <div class="upload-drop-zone" id="upload-drop-zone">
                        <div class="upload-icon">
                            <i data-lucide="cloud-upload"></i>
                        </div>
                        <div class="upload-text">
                            <p class="upload-main-text">Click to upload or drag and drop</p>
                            <p class="upload-sub-text">PNG, JPG, GIF up to 25MB</p>
                        </div>
                        <input type="file" id="file-input" multiple accept="image/*" style="display: none;">
                    </div>

                    <!-- Selected Files List -->
                    <div class="upload-files-list" id="upload-files-list">
                        <!-- Files will be added here dynamically -->
                    </div>
                </div>

                <div class="upload-modal-footer">
                    <button class="btn btn-secondary" id="cancel-upload-btn">Cancel</button>
                    <button class="btn btn-primary" id="confirm-upload-btn" disabled>
                        Upload <span id="file-count">0</span> files
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Initialize upload modal
     */
    initializeUploadModal() {
        const dropZone = document.getElementById('upload-drop-zone');
        const fileInput = document.getElementById('file-input');
        const filesList = document.getElementById('upload-files-list');
        const fileCount = document.getElementById('file-count');
        const confirmBtn = document.getElementById('confirm-upload-btn');
        const cancelBtn = document.getElementById('cancel-upload-btn');
        const closeBtn = document.getElementById('close-upload-modal');

        // Initialize selectedFiles as class property if not exists
        if (!this.selectedFiles) {
            this.selectedFiles = [];
        }

        // Click to upload
        dropZone.addEventListener('click', () => {
            fileInput.click();
        });

        // File input change
        fileInput.addEventListener('change', (e) => {
            this.handleFileSelection(e.target.files);
        });

        // Drag and drop
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('drag-over');
        });

        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('drag-over');
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('drag-over');
            this.handleFileSelection(e.dataTransfer.files);
        });

        // Cancel button
        cancelBtn.addEventListener('click', () => {
            this.closeUploadModal();
        });

        // Close button
        closeBtn.addEventListener('click', () => {
            this.closeUploadModal();
        });

        // Confirm upload button
        confirmBtn.addEventListener('click', () => {
            this.uploadFiles(this.selectedFiles);
        });

        // Close on overlay click
        document.querySelector('.upload-modal-overlay').addEventListener('click', (e) => {
            if (e.target.classList.contains('upload-modal-overlay')) {
                this.closeUploadModal();
            }
        });

        // Close on Escape key
        const handleKeydown = (e) => {
            if (e.key === 'Escape') {
                this.closeUploadModal();
                document.removeEventListener('keydown', handleKeydown);
            }
        };
        document.addEventListener('keydown', handleKeydown);
    }

    /**
     * Handle file selection
     */
    async handleFileSelection(files) {
        const filesList = document.getElementById('upload-files-list');
        const fileCount = document.getElementById('file-count');
        const confirmBtn = document.getElementById('confirm-upload-btn');
        
        // Initialize compressed files array if not exists
        this.compressedPhotoFiles = this.compressedPhotoFiles || [];
        
        // Convert FileList to Array and filter valid files
        const validFiles = Array.from(files).filter(file => this.validateFile(file));
        
        if (validFiles.length === 0) return;
        
        // Add files to selectedFiles immediately for UI display
                this.selectedFiles = this.selectedFiles || [];
        const startIndex = this.selectedFiles.length;
        this.selectedFiles.push(...validFiles);

        // Update UI to show files
        this.updateFilesList();
        this.updateUploadButton();
        
        // Disable upload button during compression
        confirmBtn.disabled = true;
        const originalBtnText = confirmBtn.innerHTML;
        confirmBtn.innerHTML = `<i data-lucide="loader-2" class="animate-spin"></i> Compressing ${validFiles.length} photo(s)...`;
        
        // Reinitialize Lucide icons for the spinner
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        // Start parallel compression for all new files
        
        const compressionPromises = validFiles.map((file, index) => {
            const fileIndex = startIndex + index;
            return this.compressPhotoWithUI(file, fileIndex);
        });
        
        // Wait for all compressions to complete
        try {
            const compressedResults = await Promise.all(compressionPromises);
            
            // Store compressed files
            this.compressedPhotoFiles.push(...compressedResults);
            
            // Re-enable upload button
            confirmBtn.disabled = false;
            confirmBtn.innerHTML = `<i data-lucide="upload"></i> Upload ${this.selectedFiles.length} Photo(s)`;
            
            // Reinitialize Lucide icons
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
            
        } catch (error) {
            console.error('❌ Error during parallel compression:', error);
            
            // Re-enable button even on error
            confirmBtn.disabled = false;
            confirmBtn.innerHTML = originalBtnText;
            
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }
    }

    /**
     * Validate file
     */
    validateFile(file) {
        const maxSize = 25 * 1024 * 1024; // 25MB
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        
        if (!allowedTypes.includes(file.type)) {
            if (window.NotificationManager) {
                window.NotificationManager.show('error', 'Invalid File Type', 'Please select PNG, JPG, or GIF files.');
            } else {
            }
            return false;
        }
        
        if (file.size > maxSize) {
            const fileSizeMB = (file.size / (1024 * 1024)).toFixed(1);
            if (window.NotificationManager) {
                window.NotificationManager.show('error', 'File Too Large', `File "${file.name}" is ${fileSizeMB}MB. Please select files under 25MB.`);
            } else {
            }
            return false;
        }
        
        return true;
    }

    /**
     * Compress photo with UI progress indicator
     */
    async compressPhotoWithUI(file, fileIndex) {
        const fileItem = document.querySelector(`[data-file-index="${fileIndex}"]`);
        if (!fileItem) {
            return file;
        }
        
        const fileInfo = fileItem.querySelector('.file-info');
        
        // Add compression status
        const statusDiv = document.createElement('div');
        statusDiv.className = 'file-compression-status';
        statusDiv.style.cssText = 'font-size: 12px; color: #6366f1; margin-top: 4px;';
        statusDiv.innerHTML = '🔧 Compressing...';
        fileInfo.appendChild(statusDiv);
        
        try {
            const compressedFile = await this.compressPhoto(file);
            
            // Update UI with compressed file info
            const compressedSize = (compressedFile.size / 1024 / 1024).toFixed(2);
            const originalSize = (file.size / 1024 / 1024).toFixed(2);
            const savings = ((1 - compressedFile.size / file.size) * 100).toFixed(0);
            
            statusDiv.style.color = '#10b981';
            statusDiv.innerHTML = `✅ Compressed: ${originalSize} MB → ${compressedSize} MB (${savings}% smaller)`;
            
            return compressedFile;
        } catch (error) {
            statusDiv.style.color = '#ef4444';
            statusDiv.innerHTML = '⚠️ Compression failed, using original';
            return file;
        }
    }

    /**
     * Compress photo using browser-side image compression
     */
    async compressPhoto(file) {
        
        return new Promise((resolve) => {
            const img = new Image();
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            img.onload = () => {
                // Set maximum dimensions - Higher quality for photos
                const maxWidth = 2560;  // 2K resolution
                const maxHeight = 1440; // 2K resolution
                let width = img.width;
                let height = img.height;
                
                // Only resize if image is larger than max dimensions
                if (width > maxWidth || height > maxHeight) {
                    const ratio = Math.min(maxWidth / width, maxHeight / height);
                    width = Math.floor(width * ratio);
                    height = Math.floor(height * ratio);
                } else {
                }
                
                canvas.width = width;
                canvas.height = height;
                
                // Use high-quality image rendering
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                
                // Draw image on canvas
                ctx.drawImage(img, 0, 0, width, height);
                
                // Convert to blob with high-quality compression
                canvas.toBlob((blob) => {
                    const compressedFile = new File([blob], file.name, {
                        type: 'image/jpeg',
                        lastModified: Date.now()
                    });
                    
                    const originalSize = file.size / 1024 / 1024;
                    const compressedSize = compressedFile.size / 1024 / 1024;
                    const savings = ((1 - compressedFile.size / file.size) * 100).toFixed(1);
                    
                    resolve(compressedFile);
                }, 'image/jpeg', 0.92); // 92% quality - Very high quality
            };
            
            img.onerror = (error) => {
                console.error('❌ Image load error:', error);
                resolve(file); // Fallback to original
            };
            
            img.src = URL.createObjectURL(file);
        });
    }

    /**
     * Update files list
     */
    updateFilesList() {
        const filesList = document.getElementById('upload-files-list');
        const selectedFiles = this.selectedFiles || [];
        
        filesList.innerHTML = '';
        
        selectedFiles.forEach((file, index) => {
            const fileItem = document.createElement('div');
            fileItem.className = 'upload-file-item';
            fileItem.setAttribute('data-file-index', index);
            fileItem.innerHTML = `
                <div class="file-thumbnail">
                    <i data-lucide="image"></i>
                </div>
                <div class="file-info">
                    <div class="file-name">${file.name}</div>
                    <div class="file-size">${this.formatFileSize(file.size)}</div>
                </div>
                <button class="file-remove-btn" data-index="${index}">
                    <i data-lucide="trash-2"></i>
                </button>
            `;
            
            // Add remove button event
            const removeBtn = fileItem.querySelector('.file-remove-btn');
            removeBtn.addEventListener('click', () => {
                this.removeFile(index);
            });
            
            filesList.appendChild(fileItem);
        });

        // Initialize Lucide icons for new elements
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    /**
     * Remove file from selection
     */
    removeFile(index) {
        this.selectedFiles.splice(index, 1);
        this.updateFilesList();
        this.updateUploadButton();
    }

    /**
     * Update upload button
     */
    updateUploadButton() {
        const fileCount = document.getElementById('file-count');
        const confirmBtn = document.getElementById('confirm-upload-btn');
        const selectedFiles = this.selectedFiles || [];
        
        fileCount.textContent = selectedFiles.length;
        confirmBtn.disabled = selectedFiles.length === 0;
    }

    /**
     * Format file size
     */
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    /**
     * Upload files
     */
    async uploadFiles(files) {
        if (!files || files.length === 0) return;
        
        // Show loading state with progress
        const confirmBtn = document.getElementById('confirm-upload-btn');
        const originalText = confirmBtn.innerHTML;
        confirmBtn.innerHTML = '<i data-lucide="loader-2" class="animate-spin"></i> Preparing upload...';
        confirmBtn.disabled = true;
        
        // Update progress with percentage
        const updateProgress = (current, total, status = '') => {
            const percentage = Math.round((current / total) * 100);
            let statusText = `Uploading ${current}/${total}`;
            if (status && status !== '') {
                statusText = status;
            }
            confirmBtn.innerHTML = `<i data-lucide="loader-2" class="animate-spin"></i> ${statusText} ${percentage}%`;
        };
        
        // Add intermediate progress updates for better interactivity
        let progressInterval;
        const startProgressAnimation = () => {
            let currentProgress = 0;
            progressInterval = setInterval(() => {
                if (currentProgress < 95) { // Don't go to 100% until actually complete
                    currentProgress += Math.random() * 3; // Random increment for realistic feel
                    const percentage = Math.min(Math.round(currentProgress), 95);
                    confirmBtn.innerHTML = `<i data-lucide="loader-2" class="animate-spin"></i> Uploading... ${percentage}%`;
                }
            }, 600); // Update every 600ms (faster for photos)
        };
        
        const stopProgressAnimation = () => {
            if (progressInterval) {
                clearInterval(progressInterval);
            }
        };
        
        try {
            
            // Use compressed files if available, otherwise use original files
            const filesToUpload = this.compressedPhotoFiles && this.compressedPhotoFiles.length === files.length
                ? this.compressedPhotoFiles
                : files;
            
            if (filesToUpload === this.compressedPhotoFiles) {
            } else {
            }
            
            // Start progress animation
            startProgressAnimation();
            
            // Upload files to Cloudinary and get URLs (parallel processing)
            const uploadedPhotos = [];
            
            // Process files in parallel for faster uploads
            const uploadPromises = filesToUpload.map(async (file, index) => {
                updateProgress(index + 1, filesToUpload.length);
                
                try {
                    // Add timeout to prevent hanging uploads
                    const uploadTimeout = new Promise((_, reject) => {
                        setTimeout(() => reject(new Error('Upload timeout')), 120000); // 120 seconds timeout (increased)
                    });
                    
                    const uploadPromise = this.uploadSingleFile(file, index + 1, filesToUpload.length);
                    
                    // Race between upload and timeout
                    const result = await Promise.race([uploadPromise, uploadTimeout]);
                    
                    return { success: true, result, fileName: file.name };
                    
                } catch (error) {
                    console.error(`❌ Failed to upload file ${index + 1}:`, error);
                    return { success: false, error: error.message, fileName: file.name };
                }
            });
            
            // Wait for all uploads to complete (even if some fail)
            const results = await Promise.allSettled(uploadPromises);
            
            // Extract successful uploads and failed uploads
            const successfulUploads = [];
            const failedUploads = [];
            
            results.forEach((result, index) => {
                if (result.status === 'fulfilled' && result.value.success) {
                    successfulUploads.push(result.value.result);
                } else if (result.status === 'fulfilled' && !result.value.success) {
                    failedUploads.push({
                        fileName: result.value.fileName,
                        error: result.value.error
                    });
                } else if (result.status === 'rejected') {
                    failedUploads.push({
                        fileName: filesToUpload[index].name,
                        error: result.reason.message
                    });
                }
            });
            
            uploadedPhotos.push(...successfulUploads);
            
            // Log summary
            if (failedUploads.length > 0) {
                console.warn(`⚠️ Failed uploads (${failedUploads.length}):`, failedUploads);
            }
            
            // Stop progress animation and show final progress
            stopProgressAnimation();
            updateProgress(filesToUpload.length, filesToUpload.length, 'Saving...');
            
            // Check if we have any photos to save
            if (uploadedPhotos.length === 0) {
                throw new Error('All uploads failed. Please check your connection and try again.');
            }
            
            
            const saveResponse = await fetch(`/api/content/gallery/album/${this.currentAlbumId}/photos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    photos: uploadedPhotos
                })
            });
            
            const saveData = await saveResponse.json();
            
            if (saveData.success) {
                
                // Show success or warning message based on upload results
                if (window.NotificationManager) {
                    if (failedUploads.length === 0) {
                        // All uploads succeeded
                        window.NotificationManager.show('success', 'Upload Complete', `${saveData.photos.length} photos uploaded successfully`);
                    } else {
                        // Some uploads failed
                        const failedFileNames = failedUploads.map(f => f.fileName).join(', ');
                        window.NotificationManager.show('warning', 'Partial Upload', 
                            `${saveData.photos.length} of ${filesToUpload.length} photos uploaded. Failed: ${failedFileNames}`);
                    }
                }
                
                // Close modal and refresh photo grid
                this.closeUploadModal();
                this.refreshPhotoGrid();
            } else {
                throw new Error(saveData.error || 'Failed to save photos to database');
            }
            
        } catch (error) {
            console.error('❌ Upload error:', error);
            
            // Stop progress animation
            stopProgressAnimation();
            
            // Show error message
            if (window.NotificationManager) {
                window.NotificationManager.show('error', 'Upload Failed', error.message || 'Failed to upload photos');
                
                // Debug notification element
                setTimeout(() => {
                    const notificationElement = document.querySelector('.notification');
                    if (notificationElement) {
                    } else {
                    }
                }, 100);
            }
            
            // Reset button state
            confirmBtn.innerHTML = originalText;
            confirmBtn.disabled = false;
        }
    }

    /**
     * Convert file to base64
     */
    fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    /**
     * Upload single file to Cloudinary
     */
    async uploadSingleFile(file, index, total) {
        // Convert file to base64
        const base64 = await this.fileToBase64(file);
        
        // Create folder path with album name
        const albumName = this.currentAlbumTitle ? this.currentAlbumTitle.replace(/[^a-zA-Z0-9\s-_]/g, '').replace(/\s+/g, '-').toLowerCase() : 'unknown-album';
        const folderPath = `marigold-school/gallery/photos/${albumName}`;
        
        // Upload to Cloudinary
        const uploadResponse = await fetch('/api/upload/image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                imageData: base64,
                fileName: file.name,
                folder: folderPath
            })
        });
        
        const uploadData = await uploadResponse.json();
        
        if (uploadData.success) {
            return {
                title: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
                description: '',
                imageUrl: uploadData.url,
                tags: ''
            };
        } else {
            throw new Error(`Failed to upload ${file.name}: ${uploadData.error}`);
        }
    }

    /**
     * Refresh photo grid
     */
    refreshPhotoGrid() {
        
        // Reload photos for the current album
        if (this.currentAlbumId) {
            
            // Clear existing photos grid first
            const photosGrid = document.getElementById('photo-grid');
            
            if (photosGrid) {
                photosGrid.innerHTML = '';
            }
            
            // Update gallery statistics
            this.fetchGalleryStats();
            
            // Force a small delay to ensure UI is cleared
            setTimeout(() => {
                // Reload photos
                this.loadAlbumPhotos(this.currentAlbumId, this.currentAlbumTitle);
            }, 100);
        } else {
            console.warn(`⚠️ REFRESH PHOTO GRID: No current album ID found`);
        }
    }

    /**
     * Close upload modal
     */
    closeUploadModal() {
        const modal = document.querySelector('.upload-modal-overlay');
        if (modal) {
            modal.remove();
        }
        this.selectedFiles = [];
        this.compressedPhotoFiles = [];
    }


    /**
     * Show add album modal
     */
    async showAddAlbumModal() {
        
        // Create modal overlay
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'add-album-modal-overlay';
        modalOverlay.innerHTML = this.getAddAlbumModalHTML();
        
        
        // Add to page
        document.body.appendChild(modalOverlay);

        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        // Initialize modal functionality
        await this.initializeAddAlbumModal();
        
        // Re-initialize Lucide icons AFTER ImageUpload to ensure icons work
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    /**
     * Get add album modal HTML
     */
    getAddAlbumModalHTML() {
        return `
            <div class="add-album-modal">
                <div class="add-album-modal-header">
                    <div class="add-album-modal-title">
                        <h2>Add New Album</h2>
                        <p>Create a new photo album</p>
                    </div>
                    <button class="add-album-modal-close" id="close-add-album-modal">
                        <i data-lucide="x"></i>
                    </button>
                </div>

                <div class="add-album-modal-content">
                    <form id="add-album-form">
                        <div class="form-group">
                            <label for="album-title" class="form-label">Album Title</label>
                            <input type="text" id="album-title" class="form-input" placeholder="Enter album title" required>
                        </div>

                        <div class="form-group">
                            <label for="album-description" class="form-label">Description (Optional)</label>
                            <textarea id="album-description" class="form-textarea" placeholder="Enter album description" rows="3"></textarea>
                        </div>

                        <div class="form-group">
                            <label for="album-category">Category *</label>
                            <select id="album-category" name="category" class="form-select" required>
                                <option value="">Select a category...</option>
                                ${GALLERY_ALBUM_CATEGORIES.map(cat => 
                                    `<option value="${cat.value}">${cat.icon} ${cat.label}</option>`
                                ).join('')}
                            </select>
                            <small class="form-help">Choose the most appropriate category for this album</small>
                        </div>

                        <div class="form-group">
                            <label for="album-thumbnail">Album Thumbnail</label>
                            <div class="image-upload-container">
                                <input type="file" id="album-thumbnail-upload" class="image-upload-input" accept="image/*" style="display: none;">
                                <input type="hidden" id="album-thumbnail-url" name="thumbnailUrl">
                                <button type="button" id="album-thumbnail-select-btn" class="btn btn-outline image-select-btn">
                                    <i data-lucide="image"></i>
                                    Select Thumbnail
                                </button>
                                <div class="image-preview-container" id="album-thumbnail-preview-container" style="display: none;">
                                    <img id="album-thumbnail-preview" class="image-preview" alt="Thumbnail Preview">
                                    <button type="button" id="album-thumbnail-remove-btn" class="image-remove-btn">
                                        <i data-lucide="x"></i>
                                    </button>
                                </div>
                            </div>
                            <small class="form-help">Upload a thumbnail image for the album (PNG, JPG, GIF up to 2MB)</small>
                        </div>
                    </form>
                </div>

                <div class="add-album-modal-footer">
                    <button class="btn btn-secondary" id="cancel-add-album-btn">Cancel</button>
                    <button class="btn btn-primary" id="create-album-btn">
                        <i data-lucide="plus"></i>
                        Create Album
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Initialize add album modal
     */
    async initializeAddAlbumModal() {
        const form = document.getElementById('add-album-form');
        const cancelBtn = document.getElementById('cancel-add-album-btn');
        const createBtn = document.getElementById('create-album-btn');
        const closeBtn = document.getElementById('close-add-album-modal');

        // Form validation
        const titleInput = document.getElementById('album-title');
        const createButton = document.getElementById('create-album-btn');

        titleInput.addEventListener('input', () => {
            createButton.disabled = !titleInput.value.trim();
        });

        // Initialize ImageUpload component for thumbnail
        try {
            this.albumThumbnailUpload = new ImageUpload({
                fileInputId: 'album-thumbnail-upload',
                urlInputId: 'album-thumbnail-url',
                selectBtnId: 'album-thumbnail-select-btn',
                previewContainerId: 'album-thumbnail-preview-container',
                previewImgId: 'album-thumbnail-preview',
                removeBtnId: 'album-thumbnail-remove-btn',
                uploadPath: '/api/upload/image',
                uploadFolder: 'marigold-school/gallery/thumbnails',
                maxSize: 2 * 1024 * 1024, // 2MB
                autoUpload: false,
                onUploadSuccess: (result) => {
                    document.getElementById('album-thumbnail-url').value = result.url;
                },
                onUploadError: (error) => {
                    console.error('❌ Album thumbnail upload error:', error);
                    window.NotificationManager.show('error', 'Upload Failed', 'Failed to upload thumbnail image');
                },
                showNotification: (type, title, message) => {
                    window.NotificationManager.show(type, title, message);
                }
            });
            this.albumThumbnailUpload.init();
            
        } catch (error) {
            console.error('❌ Error initializing album thumbnail upload:', error);
        }

        // Create album button
        createBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.createAlbum();
        });

        // Cancel button
        cancelBtn.addEventListener('click', () => {
            this.closeAddAlbumModal();
        });

        // Close button
        closeBtn.addEventListener('click', () => {
            this.closeAddAlbumModal();
        });

        // Close on overlay click
        document.querySelector('.add-album-modal-overlay').addEventListener('click', (e) => {
            if (e.target.classList.contains('add-album-modal-overlay')) {
                this.closeAddAlbumModal();
            }
        });

        // Close on Escape key
        const handleKeydown = (e) => {
            if (e.key === 'Escape') {
                this.closeAddAlbumModal();
                document.removeEventListener('keydown', handleKeydown);
            }
        };
        document.addEventListener('keydown', handleKeydown);

        // Initialize searchable select for category dropdown
        setTimeout(() => {
            this.initializeSearchableSelects();
        }, 100);

        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    /**
     * Load available categories for add modal
     */
    async loadCategoriesForAddModal() {
        // DEPRECATED: Categories are now stored in GALLERY_ALBUM_CATEGORIES array at the top of this file
        // No longer loading from database
        console.log('✅ Using predefined categories from GALLERY_ALBUM_CATEGORIES');
    }

    /**
     * Setup category selection functionality for add modal
     */
    setupCategorySelectionForAddModal() {
        // DEPRECATED: "Add New Category" functionality removed
        // Categories are managed in GALLERY_ALBUM_CATEGORIES array at the top of this file
        // Using searchable select instead
        console.log('✅ Using searchable select for categories');
    }

    /**
     * Create album
     */
    async createAlbum() {
        const title = document.getElementById('album-title').value.trim();
        const description = document.getElementById('album-description').value.trim();
        const category = document.getElementById('album-category').value;

        if (!title) {
            if (window.NotificationManager) {
                window.NotificationManager.show('error', 'Validation Error', 'Please enter an album title');
            } else {
                console.error('Album title is required');
            }
            return;
        }

        // Show loading state
        const createBtn = document.getElementById('create-album-btn');
        const originalText = createBtn.innerHTML;
        createBtn.innerHTML = '<i data-lucide="loader-2" class="animate-spin"></i> Creating...';
        createBtn.disabled = true;

        try {

            // Upload thumbnail if selected
            let thumbnailUrl = '';
            if (this.albumThumbnailUpload && this.albumThumbnailUpload.elements.fileInput.files.length > 0) {
                createBtn.innerHTML = '<i data-lucide="loader-2" class="animate-spin"></i> Uploading thumbnail...';
                
                try {
                    const file = this.albumThumbnailUpload.elements.fileInput.files[0];
                    const uploadResult = await this.albumThumbnailUpload.uploadFile(file);
                    thumbnailUrl = uploadResult.url;
                } catch (uploadError) {
                    console.error('❌ Thumbnail upload failed:', uploadError);
                    window.NotificationManager.show('warning', 'Warning', 'Album will be created without thumbnail');
                }
            }

            // Create album in database
            createBtn.innerHTML = '<i data-lucide="loader-2" class="animate-spin"></i> Creating album...';
            
            const albumData = {
                    title,
                    description,
                    category: category || 'general',
                imageUrl: thumbnailUrl || '',
                    tags: '',
                    isFeatured: false
            };
            
            
            const response = await fetch('/api/content/gallery/photo-albums', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(albumData)
            });

            const data = await response.json();

            if (data.success) {
            // Show success message
                if (window.NotificationManager) {
                    window.NotificationManager.show('success', 'Success', 'Album created successfully');
                }
            
            // Close modal
            this.closeAddAlbumModal();
            
            // Refresh gallery statistics
            this.fetchGalleryStats();
                
                // Reload albums to show the new one
                this.loadPhotoAlbums();
            } else {
                if (window.NotificationManager) {
                    window.NotificationManager.show('error', 'Error', data.error || 'Failed to create album');
                }
                
                // Reset button state
                createBtn.innerHTML = originalText;
                createBtn.disabled = false;
            }
        } catch (error) {
            console.error('Error creating album:', error);
            if (window.NotificationManager) {
                window.NotificationManager.show('error', 'Error', 'Failed to create album');
            }
            
            // Reset button state
            createBtn.innerHTML = originalText;
            createBtn.disabled = false;
        }
    }

    /**
     * Add album to grid
     */
    addAlbumToGrid(id, title, description, category) {
        const albumsGrid = document.querySelector('.photo-albums-grid');
        if (!albumsGrid) return;

        const albumCard = document.createElement('div');
        albumCard.className = 'photo-album-card';
        albumCard.setAttribute('data-album-id', id);
        albumCard.setAttribute('data-tooltip', title);
        
        albumCard.innerHTML = `
            <div class="album-info">
                <h3 class="album-title">${title}</h3>
                <p class="album-count">0 Photos</p>
            </div>
            <div class="album-actions">
                <button class="btn btn-sm btn-primary edit-album-btn">
                    <i data-lucide="edit"></i>
                </button>
                <button class="btn btn-sm btn-danger delete-album-btn">
                    <i data-lucide="trash-2"></i>
                </button>
            </div>
        `;

        // Add to grid
        albumsGrid.appendChild(albumCard);

        // Add event listeners for new card
        this.attachAlbumCardListeners(albumCard);

        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    /**
     * Attach event listeners to album card
     */
    attachAlbumCardListeners(card) {
        // Card click
        card.addEventListener('click', (e) => {
            if (e.target.closest('.album-actions')) {
                return;
            }
            const albumId = card.getAttribute('data-album-id');
            const albumTitle = card.querySelector('.album-title').textContent;
            this.openAlbumEditor(albumId, albumTitle);
        });

        // Edit button
        const editBtn = card.querySelector('.edit-album-btn');
        if (editBtn) {
            editBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const albumId = card.getAttribute('data-album-id');
                const albumTitle = card.querySelector('.album-title').textContent;
                this.openAlbumEditor(albumId, albumTitle);
            });
        }

        // Delete button
        const deleteBtn = card.querySelector('.delete-album-btn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const albumId = card.getAttribute('data-album-id');
                const albumTitle = card.querySelector('.album-title').textContent;
                this.showAlbumDeleteConfirmation(albumId, albumTitle);
            });
        }
    }

    /**
     * Close add album modal
     */
    closeAddAlbumModal() {
        // Clean up ImageUpload instance
        if (this.albumThumbnailUpload) {
            this.albumThumbnailUpload.destroy();
            this.albumThumbnailUpload = null;
        }
        
        const modal = document.querySelector('.add-album-modal-overlay');
        if (modal) {
            modal.remove();
        }
    }

    /**
     * Show add video album modal
     */
    async showAddVideoAlbumModal() {
        // Create modal overlay
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'add-video-album-modal-overlay';
        modalOverlay.innerHTML = this.getAddVideoAlbumModalHTML();
        
        // Add to page
        document.body.appendChild(modalOverlay);

        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        // Initialize modal functionality
        await this.initializeAddVideoAlbumModal();
    }

    /**
     * Get add video album modal HTML
     */
    getAddVideoAlbumModalHTML() {
        return `
            <div class="add-video-album-modal">
                <div class="add-video-album-modal-header">
                    <div class="add-video-album-modal-title">
                        <h2>Add New Video Album</h2>
                        <p>Create a new video album</p>
                    </div>
                    <button class="add-video-album-modal-close" id="close-add-video-album-modal">
                        <i data-lucide="x"></i>
                    </button>
                </div>

                <div class="add-video-album-modal-content">
                    <form id="add-video-album-form">
                        <div class="form-group">
                            <label for="video-album-title" class="form-label">Album Title</label>
                            <input type="text" id="video-album-title" class="form-input" placeholder="Enter album title" required>
                        </div>

                        <div class="form-group">
                            <label for="video-album-description" class="form-label">Description (Optional)</label>
                            <textarea id="video-album-description" class="form-textarea" placeholder="Enter album description" rows="3"></textarea>
                        </div>

                        <div class="form-group">
                            <label for="video-album-category">Category *</label>
                            <select id="video-album-category" name="category" class="form-select" required>
                                <option value="">Select a category...</option>
                                ${GALLERY_ALBUM_CATEGORIES.map(cat => 
                                    `<option value="${cat.value}">${cat.icon} ${cat.label}</option>`
                                ).join('')}
                            </select>
                            <small class="form-help">Choose the most appropriate category for this video album</small>
                        </div>

                        <div class="form-group">
                            <label for="video-album-thumbnail">Album Thumbnail</label>
                            <div class="image-upload-container">
                                <input type="file" id="video-album-thumbnail-upload" class="image-upload-input" accept="image/*" style="display: none;">
                                <input type="hidden" id="video-album-thumbnail-url" name="thumbnailUrl" value="">
                                <button type="button" id="video-album-thumbnail-select-btn" class="btn btn-outline image-select-btn">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="image" class="lucide lucide-image"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><circle cx="9" cy="9" r="2"></circle><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path></svg>
                                    Select Thumbnail
                                </button>
                                <div class="image-preview-container" id="video-album-thumbnail-preview-container" style="display: none;">
                                    <img id="video-album-thumbnail-preview" class="image-preview" src="" alt="Thumbnail Preview">
                                    <button type="button" id="video-album-thumbnail-remove-btn" class="image-remove-btn">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="x" class="lucide lucide-x"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
                                    </button>
                                </div>
                            </div>
                            <small class="form-help">Upload a thumbnail image for the album (PNG, JPG, GIF up to 2MB)</small>
                        </div>
                    </form>
                </div>

                <div class="add-video-album-modal-footer">
                    <button class="btn btn-secondary" id="cancel-add-video-album-btn">Cancel</button>
                    <button class="btn btn-primary" id="create-video-album-btn">
                        <i data-lucide="plus"></i>
                        Create Album
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Initialize add video album modal
     */
    async initializeAddVideoAlbumModal() {
        const form = document.getElementById('add-video-album-form');
        const cancelBtn = document.getElementById('cancel-add-video-album-btn');
        const createBtn = document.getElementById('create-video-album-btn');
        const closeBtn = document.getElementById('close-add-video-album-modal');

        // Initialize ImageUpload component for thumbnail
        this.videoAlbumThumbnailUpload = new ImageUpload({
            fileInputId: 'video-album-thumbnail-upload',
            urlInputId: 'video-album-thumbnail-url',
            selectBtnId: 'video-album-thumbnail-select-btn',
            previewContainerId: 'video-album-thumbnail-preview-container',
            previewImgId: 'video-album-thumbnail-preview',
            removeBtnId: 'video-album-thumbnail-remove-btn',
            uploadPath: '/api/upload/image',
            uploadFolder: 'marigold-school/gallery/thumbnails',
            maxSize: 2 * 1024 * 1024, // 2MB
            autoUpload: false,
            onUploadSuccess: (result) => {
                document.getElementById('video-album-thumbnail-url').value = result.url;
            },
            onUploadError: (error) => {
                console.error('❌ Video album thumbnail upload error:', error);
                window.NotificationManager.show('error', 'Upload Failed', 'Failed to upload thumbnail image');
            },
            showNotification: (type, title, message) => {
                window.NotificationManager.show(type, title, message);
            }
        });
        this.videoAlbumThumbnailUpload.init();

        // Initialize searchable select for category dropdown
        setTimeout(() => {
            this.initializeSearchableSelects();
        }, 100);

        // Form validation
        const titleInput = document.getElementById('video-album-title');
        const createButton = document.getElementById('create-video-album-btn');

        titleInput.addEventListener('input', () => {
            createButton.disabled = !titleInput.value.trim();
        });

        // Create album button
        createBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.createVideoAlbum();
        });

        // Cancel button
        cancelBtn.addEventListener('click', () => {
            this.closeAddVideoAlbumModal();
        });

        // Close button
        closeBtn.addEventListener('click', () => {
            this.closeAddVideoAlbumModal();
        });

        // Close on overlay click
        document.querySelector('.add-video-album-modal-overlay').addEventListener('click', (e) => {
            if (e.target.classList.contains('add-video-album-modal-overlay')) {
                this.closeAddVideoAlbumModal();
            }
        });

        // Close on Escape key
        const handleKeydown = (e) => {
            if (e.key === 'Escape') {
                this.closeAddVideoAlbumModal();
                document.removeEventListener('keydown', handleKeydown);
            }
        };
        document.addEventListener('keydown', handleKeydown);
    }

    /**
     * Load categories for add video album modal
     */
    async loadCategoriesForAddVideoModal() {
        // DEPRECATED: Categories are now stored in GALLERY_ALBUM_CATEGORIES array at the top of this file
        // No longer loading from database
        console.log('✅ Using predefined categories from GALLERY_ALBUM_CATEGORIES');
    }

    /**
     * Setup category selection for add video album modal
     */
    setupCategorySelectionForAddVideoModal() {
        // DEPRECATED: "Add New Category" functionality removed
        // Categories are managed in GALLERY_ALBUM_CATEGORIES array at the top of this file
        // Using searchable select instead
        console.log('✅ Using searchable select for video album categories');
    }

    /**
     * Create video album
     */
    async createVideoAlbum() {
        const title = document.getElementById('video-album-title').value.trim();
        const description = document.getElementById('video-album-description').value.trim();
        const category = document.getElementById('video-album-category').value;

        if (!title) {
            if (window.NotificationManager) {
                window.NotificationManager.show('error', 'Validation Error', 'Please enter an album title');
            } else {
                console.error('Album title is required');
            }
            return;
        }

        // Show loading state
        const createBtn = document.getElementById('create-video-album-btn');
        const originalText = createBtn.innerHTML;
        createBtn.innerHTML = '<i data-lucide="loader-2" class="animate-spin"></i> Creating...';
        createBtn.disabled = true;

        try {

            // Upload thumbnail if selected
            let thumbnailUrl = '';
            if (this.videoAlbumThumbnailUpload && this.videoAlbumThumbnailUpload.elements.fileInput.files.length > 0) {
                createBtn.innerHTML = '<i data-lucide="loader-2" class="animate-spin"></i> Uploading thumbnail...';
                
                try {
                    const file = this.videoAlbumThumbnailUpload.elements.fileInput.files[0];
                    const uploadResult = await this.videoAlbumThumbnailUpload.uploadFile(file);
                    thumbnailUrl = uploadResult.url;
                } catch (uploadError) {
                    console.error('❌ Thumbnail upload failed:', uploadError);
                    window.NotificationManager.show('warning', 'Warning', 'Album will be created without thumbnail');
                }
            }

        // Create video album via API
            createBtn.innerHTML = '<i data-lucide="loader-2" class="animate-spin"></i> Creating album...';
            const response = await fetch('/api/content/gallery/video-albums', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: title,
                description: description,
                    category: category || 'general',
                    imageUrl: thumbnailUrl || ''
                })
            });

            const data = await response.json();

            if (data.success) {
                
                // Show success message
                if (window.NotificationManager) {
                    window.NotificationManager.show('success', 'Success', 'Video album created successfully');
                }
                
                // Close modal
                this.closeAddVideoAlbumModal();
                
                // Refresh gallery statistics
                this.fetchGalleryStats();
                
                // Refresh video albums list
                this.loadVideoAlbums();
            } else {
                throw new Error(data.error || 'Failed to create video album');
            }
        } catch (error) {
            console.error('❌ Error creating video album:', error);
            
            // Show error message
            if (window.NotificationManager) {
                window.NotificationManager.show('error', 'Error', error.message || 'Failed to create video album');
            }
            
            // Reset button state
            createBtn.innerHTML = originalText;
            createBtn.disabled = false;
        }
    }

    /**
     * Add video album to grid
     */
    addVideoAlbumToGrid(id, title, description, category) {
        const albumsGrid = document.querySelector('.video-albums-grid');
        if (!albumsGrid) return;

        const albumCard = document.createElement('div');
        albumCard.className = 'video-album-card';
        albumCard.setAttribute('data-album-id', id);
        albumCard.setAttribute('data-tooltip', title);
        
        albumCard.innerHTML = `
            <div class="album-info">
                <h3 class="album-title">${title}</h3>
                <p class="album-count">0 Videos</p>
            </div>
            <div class="album-actions">
                <button class="btn btn-sm btn-primary edit-video-album-btn">
                    <i data-lucide="edit"></i>
                </button>
                <button class="btn btn-sm btn-danger delete-video-album-btn">
                    <i data-lucide="trash-2"></i>
                </button>
            </div>
        `;

        // Add to grid
        albumsGrid.appendChild(albumCard);

        // Add event listeners for new card
        this.attachVideoAlbumCardListeners(albumCard);

        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    /**
     * Attach event listeners to video album card
     */
    attachVideoAlbumCardListeners(card) {
        // Card click
        card.addEventListener('click', (e) => {
            if (e.target.closest('.album-actions')) {
                return;
            }
            const albumId = card.getAttribute('data-album-id');
            const albumTitle = card.querySelector('.album-title').textContent;
            this.openVideoAlbumEditor(albumId, albumTitle);
        });

        // Edit button
        const editBtn = card.querySelector('.edit-video-album-btn');
        if (editBtn) {
            editBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const albumId = card.getAttribute('data-album-id');
                const albumTitle = card.querySelector('.album-title').textContent;
                this.openVideoAlbumEditor(albumId, albumTitle);
            });
        }

        // Delete button
        const deleteBtn = card.querySelector('.delete-video-album-btn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const albumId = card.getAttribute('data-album-id');
                const albumTitle = card.querySelector('.album-title').textContent;
                this.showDeleteVideoAlbumConfirmation(albumId, albumTitle);
            });
        }
    }

    /**
     * Open video album editor
     */
    openVideoAlbumEditor(albumId, albumTitle) {
        
        // Store current album info
        this.currentVideoAlbumId = albumId;
        this.currentVideoAlbumTitle = albumTitle;
        
        const content = this.getVideoAlbumEditor(albumId, albumTitle);
        this.injectContent(content);
        this.initializeVideoAlbumEditor();
        
        // Load videos for this album
        this.loadAlbumVideos(albumId, albumTitle);
    }

    /**
     * Get video album editor content
     */
    getVideoAlbumEditor(albumId, albumTitle) {
        return `
            <section id="video-album-editor" class="content-section active">
                <div class="page-header">
                    <button class="back-button" data-action="back-to-video-albums">
                        <i data-lucide="arrow-left"></i>
                    </button>
                    <div class="page-title">
                        <h1>Album: ${albumTitle}</h1>
                        <p>Manage videos for this album. Select videos to perform actions.</p>
                    </div>
                    <div class="page-actions">
                        <button class="btn btn-primary" id="upload-videos-btn">
                            <i data-lucide="upload"></i>
                            Upload Videos
                        </button>
                    </div>
                </div>

                <!-- Loading State -->
                <div id="videos-loading" style="display: none;">
                    <div class="video-placeholder">
                        <div class="placeholder-content">
                            <div class="placeholder-icon"></div>
                            <div class="placeholder-text"></div>
                            <div class="placeholder-text short"></div>
                        </div>
                    </div>
                    <div class="video-placeholder">
                        <div class="placeholder-content">
                            <div class="placeholder-icon"></div>
                            <div class="placeholder-text"></div>
                            <div class="placeholder-text short"></div>
                        </div>
                    </div>
                    <div class="video-placeholder">
                        <div class="placeholder-content">
                            <div class="placeholder-icon"></div>
                            <div class="placeholder-text"></div>
                            <div class="placeholder-text short"></div>
                        </div>
                    </div>
                    <div class="video-placeholder">
                        <div class="placeholder-content">
                            <div class="placeholder-icon"></div>
                            <div class="placeholder-text"></div>
                            <div class="placeholder-text short"></div>
                        </div>
                    </div>
                    <div class="video-placeholder">
                        <div class="placeholder-content">
                            <div class="placeholder-icon"></div>
                            <div class="placeholder-text"></div>
                            <div class="placeholder-text short"></div>
                        </div>
                    </div>
                    <div class="video-placeholder">
                        <div class="placeholder-content">
                            <div class="placeholder-icon"></div>
                            <div class="placeholder-text"></div>
                            <div class="placeholder-text short"></div>
                        </div>
                    </div>
                </div>

                <!-- Video Grid -->
                <div class="video-grid-container">
                    <div class="video-grid" id="video-grid">
                        <!-- Videos will be loaded dynamically -->
                    </div>
                </div>

                <!-- Empty State -->
                <div id="empty-videos" style="display: none;">
                    <div class="empty-state">
                        <div class="empty-icon">
                            <i data-lucide="video"></i>
                        </div>
                        <h3>No Videos Yet</h3>
                        <p>Upload your first video to get started</p>
                        <button class="btn btn-primary" id="upload-first-video-btn">
                            <i data-lucide="upload"></i>
                            Upload Video
                        </button>
                    </div>
                </div>
            </section>
        `;
    }

    /**
     * Load album videos from database
     */
    async loadAlbumVideos(albumId, albumTitle) {
        try {
            
            // Show loading state
            this.showVideosLoading(true);
            
            const response = await fetch(`/api/content/gallery/album/${albumId}/videos?_t=${Date.now()}`);
            const data = await response.json();
            
            if (data.success) {
                
                // Update album title
                this.updateVideoAlbumTitle(data.album.title);
                
                // Render videos
                this.renderVideos(data.videos);
                
                // Show empty state if no videos
                if (data.videos.length === 0) {
                    this.showEmptyVideosState();
                }
            } else {
                console.error('❌ Failed to load videos:', data.error);
                this.showVideosError();
            }
        } catch (error) {
            console.error('❌ Error loading videos:', error);
            this.showVideosError();
        } finally {
            this.showVideosLoading(false);
        }
    }

    /**
     * Show/hide videos loading state
     */
    showVideosLoading(show) {
        const loadingElement = document.getElementById('videos-loading');
        if (loadingElement) {
            loadingElement.style.display = show ? 'grid' : 'none';
        }
    }

    /**
     * Update video album title
     */
    updateVideoAlbumTitle(title) {
        const titleElement = document.querySelector('#video-album-editor .page-title h1');
        if (titleElement) {
            titleElement.textContent = `Album: ${title}`;
        }
    }

    /**
     * Render videos in the grid
     */
    renderVideos(videos) {
        const videoGrid = document.getElementById('video-grid');
        if (!videoGrid) return;

        // Clear existing videos
        videoGrid.innerHTML = '';

        // Add video cards
        videos.forEach(video => {
            const videoCard = this.createVideoCard(video);
            videoGrid.appendChild(videoCard);
        });

        // Initialize Lucide icons for video action buttons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        // Attach event listeners
        this.attachVideoEventListeners();
    }

    /**
     * Create video card element
     */
    createVideoCard(video) {
        const videoCard = document.createElement('div');
        videoCard.className = 'video-card';
        videoCard.setAttribute('data-video-id', video.id);
        
        videoCard.innerHTML = `
            <div class="video-thumbnail">
                <img src="${video.imageUrl || 'https://res.cloudinary.com/demo/image/upload/v1234567890/video-thumbnail-default.jpg'}" alt="${video.title}" loading="lazy">
                <div class="video-overlay">
                    <button class="btn btn-sm btn-white video-action-btn" data-action="view">
                        <i data-lucide="play"></i>
                    </button>
                    <button class="btn btn-sm btn-white video-action-btn" data-action="edit">
                        <i data-lucide="edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger video-action-btn" data-action="delete">
                        <i data-lucide="trash-2"></i>
                    </button>
                </div>
            </div>
            <div class="video-info">
                <h4 class="video-title">${video.title}</h4>
                <p class="video-description">${video.description || ''}</p>
            </div>
        `;
        
        return videoCard;
    }

    /**
     * Attach event listeners to video cards
     */
    attachVideoEventListeners() {
        document.querySelectorAll('.video-action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = btn.getAttribute('data-action');
                const videoCard = btn.closest('.video-card');
                const videoId = videoCard.getAttribute('data-video-id');
                this.handleVideoAction(action, videoId);
            });
        });
    }

    /**
     * Show empty videos state
     */
    showEmptyVideosState() {
        const emptyState = document.getElementById('empty-videos');
        if (emptyState) {
            emptyState.style.display = 'block';
        }
    }

    /**
     * Show videos error state
     */
    showVideosError() {
        const videoGrid = document.getElementById('video-grid');
        if (videoGrid) {
            videoGrid.innerHTML = `
                <div class="error-state">
                    <div class="error-icon">
                        <i data-lucide="alert-circle"></i>
                    </div>
                    <h3>Error Loading Videos</h3>
                    <p>Failed to load videos for this album. Please try again.</p>
                    <button class="btn btn-primary" onclick="location.reload()">
                        <i data-lucide="refresh-cw"></i>
                        Retry
                    </button>
                </div>
            `;
        }
    }

    /**
     * Initialize video album editor
     */
    initializeVideoAlbumEditor() {
        // Add click handler for upload videos button
        const uploadBtn = document.getElementById('upload-videos-btn');
        if (uploadBtn) {
            uploadBtn.addEventListener('click', () => {
                this.showUploadVideosModal();
            });
        }

        // Add click handler for upload first video button
        const uploadFirstBtn = document.getElementById('upload-first-video-btn');
        if (uploadFirstBtn) {
            uploadFirstBtn.addEventListener('click', () => {
                this.showUploadVideosModal();
            });
        }
    }

    /**
     * Handle video actions
     */
    handleVideoAction(action, videoId) {
        switch(action) {
            case 'view':
                this.viewVideo(videoId);
                break;
            case 'edit':
                this.editVideo(videoId);
                break;
            case 'delete':
                this.deleteVideo(videoId);
                break;
        }
    }

    /**
     * View video
     */
    async viewVideo(videoId) {
        try {
            
            // Fetch video details
            const response = await fetch(`/api/content/gallery/videos/${videoId}`);
            const result = await response.json();
            
            if (result.success && result.video) {
                this.showVideoViewerModal(result.video);
            } else {
                throw new Error(result.error || 'Failed to load video details');
            }
        } catch (error) {
            console.error('❌ Error viewing video:', error);
            window.NotificationManager.show('error', 'Error', `Failed to load video: ${error.message}`);
        }
    }

    /**
     * Edit video
     */
    async editVideo(videoId) {
        try {
            
            // Fetch video details
            const response = await fetch(`/api/content/gallery/videos/${videoId}`);
            const result = await response.json();
            
            if (result.success && result.video) {
                this.showVideoEditModal(result.video);
            } else {
                throw new Error(result.error || 'Failed to load video details');
            }
        } catch (error) {
            console.error('❌ Error editing video:', error);
            window.NotificationManager.show('error', 'Error', `Failed to load video: ${error.message}`);
        }
    }

    /**
     * Delete video
     */
    async deleteVideo(videoId) {
        const videoCard = document.querySelector(`[data-video-id="${videoId}"]`);
        const videoTitle = videoCard ? videoCard.querySelector('img').alt || 'this video' : 'this video';
        
        // Show custom confirmation dialog
        const confirmed = await this.showDeleteConfirmation('Video', videoTitle, 'video');
        if (!confirmed) {
            return;
        }

        try {
            
            // Show progress indicator
            this.showDeleteProgress(videoCard, 'video');
            
            // Start progress animation
            this.startDeleteProgressAnimation(videoCard);

            // Call API to delete video from database and Cloudinary
            const response = await fetch(`/api/content/gallery/videos/${videoId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });


            // Stop progress animation
            this.stopDeleteProgressAnimation(videoCard);

            const result = await response.json();

            if (result.success) {
                
                // Remove from UI after successful deletion
                if (videoCard) {
                    setTimeout(() => {
                        videoCard.remove();
                        // Refresh video count in album stats
                        this.refreshVideoGrid();
                    }, 300);
                }
                
                window.NotificationManager.show('success', 'Success', 'Video deleted successfully');
            } else {
                console.error(`❌ DELETE VIDEO: API returned error:`, result.error);
                throw new Error(result.error || 'Failed to delete video');
            }

        } catch (error) {
            console.error('❌ Error deleting video:', error);
            
            // Stop progress animation on error
            this.stopDeleteProgressAnimation(videoCard);
            
            // Reset UI state on error
            if (videoCard) {
                videoCard.style.transform = 'scale(1)';
                videoCard.style.opacity = '1';
            }
            
            window.NotificationManager.show('error', 'Error', `Failed to delete video: ${error.message}`);
        }
    }

    /**
     * Show delete confirmation modal using global component
     */
    showDeleteConfirmation(itemType, itemTitle, itemCategory) {
        return new Promise((resolve) => {
            // Use global delete confirmation modal
            window.DeleteConfirmationModal.show({
                title: `Delete ${itemType}`,
                itemName: itemTitle,
                itemType: itemCategory,
                onConfirm: () => {
                    resolve(true);
                },
                onCancel: () => {
                    resolve(false);
                }
            });
        });
    }

    /**
     * Show delete progress indicator
     */
    showDeleteProgress(card, itemType) {
        if (!card) return;

        // Create progress overlay
        const progressOverlay = document.createElement('div');
        progressOverlay.className = 'delete-progress-overlay';
        progressOverlay.innerHTML = `
            <div class="delete-progress-content">
                <div class="progress-spinner">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="loader-2" class="lucide lucide-loader-2 animate-spin">
                        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                    </svg>
                </div>
                <div class="progress-text">
                    <div class="progress-status">Deleting ${itemType}...</div>
                    <div class="progress-percentage">0%</div>
                </div>
            </div>
        `;

        // Add to card
        card.style.position = 'relative';
        card.appendChild(progressOverlay);

        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    /**
     * Start delete progress animation
     */
    startDeleteProgressAnimation(card) {
        if (!card) return;

        const progressOverlay = card.querySelector('.delete-progress-overlay');
        if (!progressOverlay) return;

        const progressPercentage = progressOverlay.querySelector('.progress-percentage');
        const progressStatus = progressOverlay.querySelector('.progress-status');
        
        let percentage = 0;
        const interval = setInterval(() => {
            percentage += Math.random() * 15; // Random increment for realistic feel
            
            if (percentage >= 95) {
                percentage = 95; // Don't reach 100% until actually done
                clearInterval(interval);
            }
            
            progressPercentage.textContent = `${Math.round(percentage)}%`;
            
            // Update status messages
            if (percentage < 30) {
                progressStatus.textContent = 'Removing file...';
            } else if (percentage < 70) {
                progressStatus.textContent = 'Updating database...';
            } else {
                progressStatus.textContent = 'Finalizing deletion...';
            }
        }, 200);

        // Store interval reference for cleanup
        card._deleteProgressInterval = interval;
    }

    /**
     * Stop delete progress animation
     */
    stopDeleteProgressAnimation(card) {
        if (!card) return;

        // Clear interval
        if (card._deleteProgressInterval) {
            clearInterval(card._deleteProgressInterval);
            delete card._deleteProgressInterval;
        }

        const progressOverlay = card.querySelector('.delete-progress-overlay');
        if (progressOverlay) {
            const progressPercentage = progressOverlay.querySelector('.progress-percentage');
            const progressStatus = progressOverlay.querySelector('.progress-status');
            
            // Show final state
            progressPercentage.textContent = '100%';
            progressStatus.textContent = 'Deleted successfully!';
            
            // Remove overlay after a short delay
            setTimeout(() => {
                if (progressOverlay.parentNode) {
                    progressOverlay.remove();
                }
            }, 500);
        }
    }

    /**
     * Back to video albums
     */
    backToVideoAlbums() {
        this.currentAlbumId = null;
        this.currentAlbumTitle = null;
        const content = this.getVideoGalleryEditor();
        this.injectContent(content);
        this.initializeGallery();
    }

    /**
     * Show delete video album confirmation
     */
    showDeleteVideoAlbumConfirmation(albumId, albumTitle) {
        // Create modal overlay
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'delete-confirmation-overlay';
        modalOverlay.innerHTML = `
            <div class="delete-confirmation-modal">
                <div class="modal-header">
                    <div class="modal-icon">
                        <i data-lucide="alert-triangle"></i>
                    </div>
                    <h3>Delete Video Album</h3>
                </div>
                <div class="modal-content">
                    <p>Are you sure you want to delete <strong>"${albumTitle}"</strong>?</p>
                    <p class="warning-text">This action cannot be undone and will permanently remove the album and all its videos.</p>
                </div>
                <div class="modal-actions">
                    <button class="btn btn-secondary cancel-delete-btn">
                        <i data-lucide="x"></i>
                        Cancel
                    </button>
                    <button class="btn btn-danger confirm-delete-btn" data-album-id="${albumId}">
                        <i data-lucide="trash-2"></i>
                        Delete Album
                    </button>
                </div>
            </div>
        `;

        // Add to page
        document.body.appendChild(modalOverlay);

        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        // Add event listeners
        const cancelBtn = modalOverlay.querySelector('.cancel-delete-btn');
        const confirmBtn = modalOverlay.querySelector('.confirm-delete-btn');

        const closeModal = () => {
            modalOverlay.remove();
        };

        cancelBtn.addEventListener('click', closeModal);
        confirmBtn.addEventListener('click', async () => {
            await this.deleteVideoAlbum(albumId);
            closeModal();
        });
    }

    /**
     * Open video album edit modal
     */
    async openVideoAlbumEditModal(albumId, albumTitle) {
        try {
            
            // Fetch album details from database
            const response = await fetch(`/api/content/gallery/album/${albumId}`);
            const data = await response.json();
            
            if (data.success) {
                const album = data.album;
                this.currentVideoAlbumId = albumId;
                
                // Show modal
                this.showVideoAlbumEditModal(album);
            } else {
                console.error('❌ Error fetching video album details:', data.error);
                if (window.NotificationManager) {
                    window.NotificationManager.show('error', 'Error', 'Failed to load video album details');
                }
            }
        } catch (error) {
            console.error('❌ Error opening video album edit modal:', error);
            if (window.NotificationManager) {
                window.NotificationManager.show('error', 'Error', 'Failed to open video album edit modal');
            }
        }
    }

    /**
     * Show video album edit modal
     */
    showVideoAlbumEditModal(album) {
        
        // Create modal HTML
        const modalHTML = `
            <div id="video-album-edit-modal" class="modal-overlay" style="display: flex !important; opacity: 1 !important; visibility: visible !important; z-index: 999999 !important;">
                <div class="modal-container">
                    <div class="modal-header">
                        <h2>Edit Video Album: ${album.title}</h2>
                        <button class="modal-close-btn" id="close-video-album-edit-modal">
                            <i data-lucide="x"></i>
                        </button>
                    </div>
                    
                    <div class="modal-body">
                        <form id="video-album-edit-form" class="album-form">
                            <div class="form-section">
                                <h3>Album Information</h3>
                                
                                <div class="form-group">
                                    <label for="video-album-title">Album Title *</label>
                                    <input type="text" id="video-album-title" name="title" value="${album.title || ''}" required>
                                    <small class="form-help">Enter a descriptive title for the video album</small>
                                </div>
                                
                                <div class="form-group">
                                    <label for="video-album-description">Description</label>
                                    <textarea id="video-album-description" name="description" rows="3">${album.description || ''}</textarea>
                                    <small class="form-help">Optional description for the video album</small>
                                </div>
                                
                                <div class="form-group">
                                    <label for="video-album-category">Category *</label>
                                    <select id="video-album-category" name="category" class="form-select" required>
                                        <option value="">Select a category...</option>
                                        ${GALLERY_ALBUM_CATEGORIES.map(cat => 
                                            `<option value="${cat.value}" ${album.category === cat.value ? 'selected' : ''}>
                                                ${cat.icon} ${cat.label}
                                            </option>`
                                        ).join('')}
                                    </select>
                                    <small class="form-help">Choose the most appropriate category for this video album</small>
                                </div>

                                <div class="form-group">
                                    <label for="video-album-edit-thumbnail">Album Thumbnail</label>
                                    <div class="image-upload-container">
                                        <input type="file" id="video-album-edit-thumbnail-upload" class="image-upload-input" accept="image/*" style="display: none;">
                                        <input type="hidden" id="video-album-edit-thumbnail-url" name="thumbnailUrl" value="${album.imageUrl || ''}">
                                        <button type="button" id="video-album-edit-thumbnail-select-btn" class="btn btn-outline image-select-btn">
                                            <i data-lucide="image"></i>
                                            ${album.imageUrl ? 'Change Thumbnail' : 'Select Thumbnail'}
                                        </button>
                                        <div class="image-preview-container" id="video-album-edit-thumbnail-preview-container" style="display: ${album.imageUrl ? 'block' : 'none'};">
                                            <img id="video-album-edit-thumbnail-preview" class="image-preview" src="${album.imageUrl || ''}" alt="Thumbnail Preview">
                                            <button type="button" id="video-album-edit-thumbnail-remove-btn" class="image-remove-btn">
                                                <i data-lucide="x"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <small class="form-help">Upload a thumbnail image for the album (PNG, JPG, GIF up to 2MB)</small>
                                </div>
                            </div>
                        </form>
                    </div>
                    
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" id="cancel-video-album-edit">
                            <i data-lucide="x"></i>
                            Cancel
                        </button>
                        <button type="button" class="btn btn-primary" id="save-video-album-changes">
                            <i data-lucide="save"></i>
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Remove existing modal if any
        const existingModal = document.getElementById('video-album-edit-modal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Add modal to page
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Initialize modal
        this.initializeVideoAlbumEditModal(album);
    }

    /**
     * Initialize video album edit modal
     */
    async initializeVideoAlbumEditModal(album) {
        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        // Initialize ImageUpload component for thumbnail
        this.videoAlbumEditThumbnailUpload = new ImageUpload({
            fileInputId: 'video-album-edit-thumbnail-upload',
            urlInputId: 'video-album-edit-thumbnail-url',
            selectBtnId: 'video-album-edit-thumbnail-select-btn',
            previewContainerId: 'video-album-edit-thumbnail-preview-container',
            previewImgId: 'video-album-edit-thumbnail-preview',
            removeBtnId: 'video-album-edit-thumbnail-remove-btn',
            uploadPath: '/api/upload/image',
            uploadFolder: 'marigold-school/gallery/thumbnails',
            maxSize: 2 * 1024 * 1024, // 2MB
            autoUpload: false,
            onUploadSuccess: (result) => {
                document.getElementById('video-album-edit-thumbnail-url').value = result.url;
            },
            onUploadError: (error) => {
                console.error('❌ Video album thumbnail upload error:', error);
                window.NotificationManager.show('error', 'Upload Failed', 'Failed to upload thumbnail image');
            },
            showNotification: (type, title, message) => {
                window.NotificationManager.show(type, title, message);
            }
        });
        this.videoAlbumEditThumbnailUpload.init();
        
        // Initialize searchable select for category dropdown
        // Categories are pre-selected from the template above
        setTimeout(() => {
            this.initializeSearchableSelects();
        }, 100);
        
        // Close modal handlers
        const closeBtn = document.getElementById('close-video-album-edit-modal');
        const cancelBtn = document.getElementById('cancel-video-album-edit');
        const modalOverlay = document.getElementById('video-album-edit-modal');
        
        const closeModal = () => {
            modalOverlay.remove();
        };
        
        closeBtn.addEventListener('click', closeModal);
        cancelBtn.addEventListener('click', closeModal);
        
        // Close on overlay click
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });
        
        // Save changes handler
        const saveBtn = document.getElementById('save-video-album-changes');
        saveBtn.addEventListener('click', () => {
            this.saveVideoAlbumChanges();
        });
    }

    /**
     * Set current category for video album edit modal
     */
    setCurrentVideoAlbumCategory(category) {
        const categorySelect = document.getElementById('video-album-category');
        if (categorySelect && category) {
            categorySelect.value = category;
        }
    }

    /**
     * Setup category selection for video album edit modal
     */
    setupVideoAlbumCategorySelection() {
        // DEPRECATED: "Add New Category" functionality removed
        // Categories are managed in GALLERY_ALBUM_CATEGORIES array at the top of this file
        // Using searchable select instead
        
        // Initialize searchable select for category dropdown
        setTimeout(() => {
            this.initializeSearchableSelects();
        }, 100);
    }

    /**
     * Save video album changes
     */
    async saveVideoAlbumChanges() {
        const saveBtn = document.getElementById('save-video-album-changes');
        const originalHTML = saveBtn.innerHTML;
        
        try {
            const title = document.getElementById('video-album-title').value.trim();
            const description = document.getElementById('video-album-description').value.trim();
            const category = document.getElementById('video-album-category').value;
            
            if (!title) {
                if (window.NotificationManager) {
                    window.NotificationManager.show('error', 'Validation Error', 'Please enter a title for the video album');
                }
                return;
            }
            
            if (!category) {
                if (window.NotificationManager) {
                    window.NotificationManager.show('error', 'Validation Error', 'Please select or enter a category');
                }
                return;
            }

            // Show loading state
            saveBtn.innerHTML = '<i data-lucide="loader-2" class="animate-spin"></i> Saving...';
            saveBtn.disabled = true;
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }

            // Upload thumbnail if a new file is selected
            let thumbnailUrl = document.getElementById('video-album-edit-thumbnail-url').value;
            if (this.videoAlbumEditThumbnailUpload && this.videoAlbumEditThumbnailUpload.elements.fileInput.files.length > 0) {
                saveBtn.innerHTML = '<i data-lucide="loader-2" class="animate-spin"></i> Uploading thumbnail...';
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
                
                try {
                    const file = this.videoAlbumEditThumbnailUpload.elements.fileInput.files[0];
                    const uploadResult = await this.videoAlbumEditThumbnailUpload.uploadFile(file);
                    thumbnailUrl = uploadResult.url;
                } catch (uploadError) {
                    console.error('❌ Thumbnail upload failed:', uploadError);
                    window.NotificationManager.show('warning', 'Warning', 'Album will be updated without new thumbnail');
                }
            }
            
            const updateData = {
                title,
                description,
                category,
                imageUrl: thumbnailUrl
            };
            
            
            saveBtn.innerHTML = '<i data-lucide="loader-2" class="animate-spin"></i> Saving changes...';
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
            
            const response = await fetch(`/api/content/gallery/album/${this.currentVideoAlbumId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateData)
            });
            
            const data = await response.json();
            
            if (data.success) {
                if (window.NotificationManager) {
                    window.NotificationManager.show('success', 'Success', 'Video album updated successfully');
                }
                
                // Close modal
                const modal = document.getElementById('video-album-edit-modal');
                if (modal) {
                    modal.remove();
                }
                
                // Refresh video albums list
                this.loadVideoAlbums();
            } else {
                console.error('❌ Failed to update video album:', data.error);
                if (window.NotificationManager) {
                    window.NotificationManager.show('error', 'Error', 'Failed to update video album');
                }
                // Reset button state
                saveBtn.innerHTML = originalHTML;
                saveBtn.disabled = false;
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
            }
        } catch (error) {
            console.error('❌ Error saving video album changes:', error);
            if (window.NotificationManager) {
                window.NotificationManager.show('error', 'Error', 'Failed to save video album changes');
            }
            // Reset button state
            saveBtn.innerHTML = originalHTML;
            saveBtn.disabled = false;
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }
    }

    /**
     * Delete video album
     */
    async deleteVideoAlbum(albumId) {
        try {
            
            // Make API call to delete from database
            const response = await fetch(`/api/content/gallery/video-albums/${albumId}`, {
                method: 'DELETE'
            });

            const data = await response.json();

            if (data.success) {
                
                // Find and remove the album card
                const albumCard = document.querySelector(`[data-album-id="${albumId}"]`);
                if (albumCard) {
                    // Add removal animation
                    albumCard.style.transition = 'all 0.3s ease';
                    albumCard.style.transform = 'scale(0.8)';
                    albumCard.style.opacity = '0';
                    
                    setTimeout(() => {
                        albumCard.remove();
                        if (window.NotificationManager) {
                            window.NotificationManager.show('success', 'Success', 'Video album deleted successfully');
                        }
                        
                        // Refresh gallery statistics
                        this.fetchGalleryStats();
                    }, 300);
                }
            } else {
                console.error('❌ Failed to delete video album:', data.error);
                if (window.NotificationManager) {
                    window.NotificationManager.show('error', 'Error', 'Failed to delete video album');
                }
            }
        } catch (error) {
            console.error('❌ Error deleting video album:', error);
            if (window.NotificationManager) {
                window.NotificationManager.show('error', 'Error', 'Failed to delete video album');
            }
        }
    }

    /**
     * Close add video album modal
     */
    closeAddVideoAlbumModal() {
        const modal = document.querySelector('.add-video-album-modal-overlay');
        if (modal) {
            modal.remove();
        }
    }

    /**
     * Show upload videos modal
     */
    showUploadVideosModal() {
        // Create modal overlay
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'upload-videos-modal-overlay';
        modalOverlay.innerHTML = this.getUploadVideosModalHTML();
        
        // Add to page
        document.body.appendChild(modalOverlay);

        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        // Initialize upload functionality
        this.initializeUploadVideosModal();
    }

    /**
     * Get upload videos modal HTML
     */
    getUploadVideosModalHTML() {
        return `
            <div class="upload-videos-modal">
                <div class="upload-videos-modal-header">
                    <div class="upload-videos-modal-title">
                        <h2>Upload Videos</h2>
                        <p>Add videos to the album</p>
                    </div>
                    <button class="upload-videos-modal-close" id="close-upload-videos-modal">
                        <i data-lucide="x"></i>
                    </button>
                </div>

                <div class="upload-videos-modal-content">
                    <!-- Drag and Drop Zone -->
                    <div class="upload-drop-zone" id="upload-videos-drop-zone">
                        <div class="upload-icon">
                            <i data-lucide="video"></i>
                        </div>
                        <div class="upload-text">
                            <p class="upload-main-text">Click to upload or drag and drop</p>
                            <p class="upload-sub-text">MP4, MOV, AVI up to 200MB</p>
                        </div>
                        <input type="file" id="video-file-input" multiple accept="video/*" style="display: none;">
                    </div>

                    <!-- Selected Files List -->
                    <div class="upload-files-list" id="upload-videos-files-list">
                        <!-- Files will be added here dynamically -->
                    </div>
                </div>

                <div class="upload-videos-modal-footer">
                    <button class="btn btn-secondary" id="cancel-upload-videos-btn">Cancel</button>
                    <button class="btn btn-primary" id="confirm-upload-videos-btn" disabled>
                        Upload <span id="video-file-count">0</span> files
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Initialize upload videos modal
     */
    initializeUploadVideosModal() {
        const dropZone = document.getElementById('upload-videos-drop-zone');
        const fileInput = document.getElementById('video-file-input');
        const filesList = document.getElementById('upload-videos-files-list');
        const fileCount = document.getElementById('video-file-count');
        const confirmBtn = document.getElementById('confirm-upload-videos-btn');
        const cancelBtn = document.getElementById('cancel-upload-videos-btn');
        const closeBtn = document.getElementById('close-upload-videos-modal');

        // Initialize selectedVideoFiles as class property if not exists
        if (!this.selectedVideoFiles) {
            this.selectedVideoFiles = [];
        }

        // Click to upload
        dropZone.addEventListener('click', () => {
            fileInput.click();
        });

        // File input change
        fileInput.addEventListener('change', (e) => {
            this.handleVideoFileSelection(e.target.files);
        });

        // Drag and drop handlers
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('drag-over');
        });

        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('drag-over');
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('drag-over');
            this.handleVideoFileSelection(e.dataTransfer.files);
        });

        // Cancel button
        cancelBtn.addEventListener('click', () => {
            this.closeUploadVideosModal();
        });

        // Close button
        closeBtn.addEventListener('click', () => {
            this.closeUploadVideosModal();
        });

        // Confirm upload button (SINGLE listener only!)
        confirmBtn.addEventListener('click', () => {
            // Use compressed files if available, otherwise fall back to original files
            const filesToUpload = (this.compressedVideoFiles && this.compressedVideoFiles.length > 0) 
                ? this.compressedVideoFiles 
                : this.selectedVideoFiles || [];
            
            this.uploadVideos(filesToUpload);
        });

        // Close on overlay click
        document.querySelector('.upload-videos-modal-overlay').addEventListener('click', (e) => {
            if (e.target.classList.contains('upload-videos-modal-overlay')) {
                this.closeUploadVideosModal();
            }
        });

        // Close on Escape key
        const handleKeydown = (e) => {
            if (e.key === 'Escape') {
                this.closeUploadVideosModal();
                document.removeEventListener('keydown', handleKeydown);
            }
        };
        document.addEventListener('keydown', handleKeydown);
    }

    /**
     * Handle video file selection
     */
    // REMOVED: Old handleVideoFileSelection without compression
    // Using the newer version with compression below (around line 4738)

    /**
     * Validate video file
     */
    validateVideoFile(file) {
        const maxSize = 200 * 1024 * 1024; // 200MB (accounts for base64 encoding overhead)
        const allowedTypes = ['video/mp4', 'video/mov', 'video/avi', 'video/quicktime'];
        
        if (!allowedTypes.includes(file.type)) {
            if (window.NotificationManager) {
                window.NotificationManager.show('error', 'Invalid File Type', 'Please select MP4, MOV, or AVI files.');
            } else {
            }
            return false;
        }
        
        if (file.size > maxSize) {
            const fileSizeMB = (file.size / (1024 * 1024)).toFixed(1);
            if (window.NotificationManager) {
                window.NotificationManager.show('error', 'File Too Large', `File "${file.name}" is ${fileSizeMB}MB. Please select files under 200MB or compress your video.`);
            } else {
            }
            return false;
        }
        
        return true;
    }

    // REMOVED: Old updateVideosList without compression support
    // Using updateVideoFilesList() instead (around line 4842)

    /**
     * Upload videos to album
     */
    async uploadVideos(files) {
        if (!files || files.length === 0) return;
        
        // Show loading state with progress
        const confirmBtn = document.getElementById('confirm-upload-videos-btn');
        const originalText = confirmBtn.innerHTML;
        confirmBtn.innerHTML = `${GalleryManager.SPINNER_SVG}Preparing upload...`;
        confirmBtn.disabled = true;
        
        // Track real-time upload progress with speed calculation
        let startTime = Date.now();
        let lastUpdateTime = Date.now();
        let lastLoaded = 0;
        
        const updateProgress = (percentage, loaded, total, currentVideo = 1, totalVideos = 1) => {
            let statusText;
            const videoPrefix = totalVideos > 1 ? `Video ${currentVideo}/${totalVideos} - ` : '';
            
            // Files are already compressed, so we only show upload progress (0-100%)
            if (loaded > 0 && total > 0) {
                const now = Date.now();
                const elapsed = (now - startTime) / 1000; // seconds
                const speed = loaded / elapsed; // bytes per second
                const remaining = total - loaded;
                const eta = remaining / speed; // seconds
                
                const speedMBps = (speed / 1024 / 1024).toFixed(2);
                const etaMin = Math.floor(eta / 60);
                const etaSec = Math.floor(eta % 60);
                
                if (percentage >= 100) {
                    // Upload complete, waiting for server processing
                    // Estimate: ~15 seconds per MB
                    const fileSizeMB = (total / 1024 / 1024).toFixed(1);
                    const estimatedTime = Math.ceil(fileSizeMB * 15);
                    statusText = `${videoPrefix}Processing... (~${estimatedTime}s for ${fileSizeMB}MB)`;
                } else {
                    statusText = `${videoPrefix}Uploading... ${percentage}% (${speedMBps} MB/s`;
                    if (eta > 0 && eta < 3600) { // Only show ETA if less than 1 hour
                        statusText += `, ~${etaMin}m ${etaSec}s`;
                    }
                    statusText += ')';
                }
            } else {
                statusText = `${videoPrefix}Preparing upload... ${percentage}%`;
            }
            
            confirmBtn.innerHTML = `${GalleryManager.SPINNER_SVG}${statusText}`;
        };
        
        try {
            
            // Files passed to this function should already be compressed
            const filesToUpload = files;
            
            // Log file sizes to verify compression
            filesToUpload.forEach((file, idx) => {
            });
            
            
            // Upload files to Cloudinary and save immediately (one by one)
            const savedVideos = [];
            
            // Process files sequentially - upload to Cloudinary, then immediately save to database
            for (let index = 0; index < filesToUpload.length; index++) {
                const file = filesToUpload[index];
                const currentVideo = index + 1;
                const totalVideos = filesToUpload.length;
                
                // Reset timing for each file
                startTime = Date.now();
                lastUpdateTime = Date.now();
                lastLoaded = 0;
                
                try {
                    // STEP 1: Upload with real-time progress callback
                    const result = await this.uploadSingleVideo(file, currentVideo, totalVideos, (progress, loaded, total) => {
                        updateProgress(progress, loaded, total, currentVideo, totalVideos);
                    });
                    
                    
                    // STEP 2: Immediately save this video to database
                    confirmBtn.innerHTML = `<i data-lucide="loader-2" class="animate-spin"></i> Saving video ${currentVideo}/${totalVideos} to database...`;
                    
                    // Reinitialize Lucide icons
                    if (typeof lucide !== 'undefined') {
                        lucide.createIcons();
                    }
                    
                    const saveResponse = await fetch(`/api/content/gallery/album/${this.currentVideoAlbumId}/videos`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            videos: [result] // Save one video at a time
                        })
                    });
                    
                    if (!saveResponse.ok) {
                        const errorText = await saveResponse.text();
                        console.error(`❌ Failed to save video ${currentVideo} to database:`, saveResponse.status, errorText);
                        throw new Error(`Save failed: ${saveResponse.status} ${saveResponse.statusText}`);
                    }
                    
                    const saveData = await saveResponse.json();
                    
                    savedVideos.push(result);
                    
                } catch (error) {
                    console.error(`❌ Failed to upload/save video ${currentVideo}:`, error);
                    throw error;
                }
            }
            
            // All videos uploaded and saved
            
            // Update to 100%
            confirmBtn.innerHTML = `<i data-lucide="check" class="animate-pulse"></i> Complete!`;
            
            // Show success message
            if (window.NotificationManager) {
                window.NotificationManager.show('success', 'Upload Complete', `${savedVideos.length} videos uploaded successfully`);
            }
            
            // Wait a moment to show completion, then close
            setTimeout(() => {
                this.closeUploadVideosModal();
                this.refreshVideoGrid();
            }, 500);
            
        } catch (error) {
            console.error('❌ Upload error:', error);
            
            // Show error message
            if (window.NotificationManager) {
                window.NotificationManager.show('error', 'Upload Failed', error.message || 'Failed to upload videos');
            }
            
            // Reset button state
            confirmBtn.innerHTML = originalText;
            confirmBtn.disabled = false;
        }
    }

    /**
     * Compress/optimize video before upload (reduces file size by ~50-70%)
     * Note: For videos with audio, compression may be bypassed to preserve audio quality
     */
    async compressVideo(file, progressCallback) {
        
        return new Promise((resolve, reject) => {
            const video = document.createElement('video');
            video.preload = 'metadata';
            video.muted = true; // Mute video to prevent audio playback during compression
            video.playsInline = true; // Prevent fullscreen on mobile
            
            video.onloadedmetadata = async () => {
                try {
                    // Check if video has audio track using multiple methods
                    let hasAudio = false;
                    
                    // Method 1: Check for audio tracks
                    if (video.audioTracks && video.audioTracks.length > 0) {
                        hasAudio = true;
                    }
                    
                    // Method 2: Check browser-specific properties
                    if (video.webkitAudioDecodedByteCount > 0 || video.mozHasAudio) {
                        hasAudio = true;
                    }
                    
                    // Method 3: For most videos, assume they have audio unless proven otherwise
                    // This is a conservative approach to preserve audio
                    if (!hasAudio && file.size > 1024 * 1024) { // Files larger than 1MB likely have audio
                        hasAudio = true;
                    }
                    
                    if (hasAudio) {
                    }
                    
                    // Check video resolution and ALWAYS compress ALL videos to 480p
                    const videoWidth = video.videoWidth;
                    const videoHeight = video.videoHeight;
                    
                    
                    // Create canvas for video processing with high quality settings
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d', {
                        alpha: false, // Disable alpha for better performance
                        desynchronized: true, // Better performance for animations
                        willReadFrequently: false // Optimized for drawing
                    });
                    
                    // Enable image smoothing for better quality
                    ctx.imageSmoothingEnabled = true;
                    ctx.imageSmoothingQuality = 'high';
                    
                    // Always target 480p resolution (854x480) for consistent quality
                    const targetWidth = 854;
                    const targetHeight = 480;
                    
                    let width = video.videoWidth;
                    let height = video.videoHeight;
                    
                    // Calculate scaling to fit within 480p while maintaining aspect ratio
                    const ratio = Math.min(targetWidth / width, targetHeight / height);
                    
                    // Check if video is small enough to skip compression
                    const fileSizeMB = file.size / 1024 / 1024;
                    
                    // Only skip compression if video is under 5MB AND already at or below 480p
                    // If video is > 5MB, always compress regardless of resolution
                    if (fileSizeMB < 5 && video.videoWidth <= 854 && video.videoHeight <= 480) {
                        console.log(`📐 Video is already small (${fileSizeMB.toFixed(2)} MB, ${video.videoWidth}x${video.videoHeight}), skipping compression`);
                        resolve(file); // Return original file
                        return;
                    }
                    
                    // All videos > 5MB must be compressed
                    console.log(`📹 Video size: ${fileSizeMB.toFixed(2)} MB - will compress`);
                    
                    // Only downscale if video is larger than 480p
                    if (ratio < 1) {
                        width = Math.floor(width * ratio);
                        height = Math.floor(height * ratio);
                        console.log(`📐 Compressing from ${video.videoWidth}x${video.videoHeight} to ${width}x${height}`);
                    } else {
                        console.log(`📐 Video is smaller than 480p, keeping original size`);
                    }
                    
                    canvas.width = width;
                    canvas.height = height;
                    
                    // Determine the best codec based on original file type
                    const fileExtension = file.name.split('.').pop().toLowerCase();
                    let mimeType = 'video/webm;codecs=vp8';
                    let outputExtension = fileExtension;
                    
                    // Try to use MP4 codec if original is MP4
                    if (fileExtension === 'mp4') {
                        // Check if browser supports H.264 in MP4
                        if (MediaRecorder.isTypeSupported('video/mp4;codecs=h264')) {
                            mimeType = 'video/mp4;codecs=h264';
                            outputExtension = 'mp4';
                        } else if (MediaRecorder.isTypeSupported('video/mp4')) {
                            mimeType = 'video/mp4';
                            outputExtension = 'mp4';
                        } else {
                            outputExtension = 'webm';
                        }
                    }
                    
                    
                    // Create MediaRecorder stream with both video and audio
                    // Using higher frame rate capture for smoother playback
                    const canvasStream = canvas.captureStream(30); // 30 FPS for smooth playback
                    
                    let combinedStream;
                    let audioContext = null;
                    
                    try {
                        // Get audio track from original video
                        audioContext = new (window.AudioContext || window.webkitAudioContext)();
                        const source = audioContext.createMediaElementSource(video);
                        const destination = audioContext.createMediaStreamDestination();
                        source.connect(destination);
                        // Don't connect to audioContext.destination to prevent audio playback
                        
                        // Combine video and audio streams
                        combinedStream = new MediaStream([
                            ...canvasStream.getVideoTracks(),
                            ...destination.stream.getAudioTracks()
                        ]);
                        
                    } catch (audioError) {
                        console.warn('⚠️ Could not add audio track, using video only:', audioError);
                        // Fallback to video-only stream if audio processing fails
                        combinedStream = canvasStream;
                    }
                    
                    // Optimized bitrates for 480p - balanced quality and file size
                    // Lower bitrates to prevent file size increases while maintaining good quality
                    let videoBitrate, audioBitrate;
                    
                    // For 480p (854x480 = 409,920 pixels), use 1-1.5 Mbps based on content
                    if (ratio < 1) {
                        // Video is being downscaled - use lower bitrate
                        videoBitrate = 1200000; // 1.2 Mbps for downscaled videos
                    } else {
                        // Video is already small - use even lower bitrate
                        videoBitrate = 1000000; // 1 Mbps for small videos
                    }
                    
                    // Adjust based on file size to avoid increasing file size
                    if (file.size < 5 * 1024 * 1024) { // Files under 5MB - already well compressed
                        videoBitrate = 800000; // 0.8 Mbps - preserve existing compression
                    } else if (file.size > 50 * 1024 * 1024) { // Large files
                        videoBitrate = 1500000; // 1.5 Mbps for large files
                    }
                    
                    audioBitrate = 128000; // 128 kbps for all videos
                    
                    
                    const mediaRecorder = new MediaRecorder(combinedStream, {
                        mimeType: mimeType,
                        videoBitsPerSecond: videoBitrate,
                        audioBitsPerSecond: audioBitrate
                    });
                    
                    const chunks = [];
                    mediaRecorder.ondataavailable = (e) => {
                        if (e.data.size > 0) {
                            chunks.push(e.data);
                        }
                    };
                    
                    mediaRecorder.onstop = () => {
                        // Clean up audio context
                        if (audioContext && audioContext.state !== 'closed') {
                            audioContext.close().catch(console.warn);
                        }
                        
                        const outputMimeType = mimeType.split(';')[0];
                        const compressedBlob = new Blob(chunks, { type: outputMimeType });
                        
                        // Keep original filename with correct extension
                        const baseFileName = file.name.replace(/\.[^.]+$/, '');
                        const compressedFile = new File([compressedBlob], `${baseFileName}.${outputExtension}`, {
                            type: outputMimeType,
                            lastModified: Date.now()
                        });
                        
                        const originalSize = file.size / 1024 / 1024;
                        const compressedSize = compressedFile.size / 1024 / 1024;
                        const savingsPercent = ((1 - compressedSize / originalSize) * 100).toFixed(1);
                        
                        // If compression increased file size, use original file
                        if (compressedFile.size > file.size) {
                            console.log(`⚠️ Compression increased file size (${originalSize.toFixed(2)} MB → ${compressedSize.toFixed(2)} MB), using original file`);
                            resolve(file);
                        } else {
                            console.log(`✅ Compression complete: ${originalSize.toFixed(2)} MB → ${compressedSize.toFixed(2)} MB (${savingsPercent}% smaller)`);
                            resolve(compressedFile);
                        }
                    };
                    
                    mediaRecorder.onerror = (error) => {
                        // Clean up audio context
                        if (audioContext && audioContext.state !== 'closed') {
                            audioContext.close().catch(console.warn);
                        }
                        
                        console.error('❌ Compression error:', error);
                        resolve(file); // Fallback to original if compression fails
                    };
                    
                    // Start recording with optimized chunk interval
                    // Smaller interval for smoother video without glitches
                    mediaRecorder.start(50); // Collect data every 50ms for smoother video
                    
                    // Play video and draw frames to canvas
                    video.currentTime = 0;
                    video.play();
                    
                    const drawFrame = () => {
                        if (!video.paused && !video.ended) {
                            // Draw with high quality
                            ctx.drawImage(video, 0, 0, width, height);
                            requestAnimationFrame(drawFrame);
                            
                            // Update progress
                            if (progressCallback) {
                                const progress = Math.round((video.currentTime / video.duration) * 100);
                                progressCallback(progress);
                            }
                        } else if (video.ended) {
                            mediaRecorder.stop();
                        }
                    };
                    
                    drawFrame();
                    
                } catch (error) {
                    console.error('❌ Compression setup error:', error);
                    resolve(file); // Fallback to original
                }
            };
            
            video.onerror = (error) => {
                console.error('❌ Video load error:', error);
                resolve(file); // Fallback to original
            };
            
            video.src = URL.createObjectURL(file);
        });
    }

    /**
     * Upload single video file DIRECTLY to Cloudinary with REAL progress tracking
     */
    async uploadSingleVideo(file, index, total, progressCallback) {
        
        // File is already compressed during selection, use it directly
        
        // Create folder path with album name
        const albumName = this.currentVideoAlbumTitle ? this.currentVideoAlbumTitle.replace(/[^a-zA-Z0-9\s-_]/g, '').replace(/\s+/g, '-').toLowerCase() : 'unknown-album';
        const folderPath = `marigold-school/gallery/videos/${albumName}`;
        
        // Prepare form data for backend upload
        const formData = new FormData();
        formData.append('video', file);
        formData.append('folder', folderPath);
        
        // Upload through backend with REAL progress tracking using XMLHttpRequest
        
        const uploadUrl = '/api/upload/video-file';
        
        // Get auth token
        const token = localStorage.getItem('adminToken');
        if (!token) {
            throw new Error('Authentication token not found. Please login again.');
        }
        
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            
            // Track upload progress (reduce log spam - only log every 10%)
            let lastLoggedPercent = 0;
            let uploadComplete = false;
            
            xhr.upload.addEventListener('progress', (e) => {
                if (e.lengthComputable) {
                    const percentComplete = Math.round((e.loaded / e.total) * 100);
                    
                    // Only log every 10% to reduce console spam
                    if (percentComplete >= lastLoggedPercent + 10 || percentComplete === 100) {
                        lastLoggedPercent = percentComplete;
                    }
                    
                    // Call progress callback if provided (full 0-100% range since no compression here)
                    if (progressCallback) {
                        progressCallback(percentComplete, e.loaded, e.total);
                    }
                    
                    // Mark upload as complete when 100%
                    if (percentComplete === 100 && !uploadComplete) {
                        uploadComplete = true;
                        const fileSizeMB = (e.total / 1024 / 1024).toFixed(1);
                        const estimatedTime = Math.ceil(fileSizeMB * 15); // ~15 seconds per MB
                    }
                }
            });
            
            // Handle completion
            xhr.addEventListener('load', () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    try {
                        const response = JSON.parse(xhr.responseText);
                        const uploadDuration = ((Date.now() - Date.now()) / 1000).toFixed(0);
                        
                        // Backend response format: { success: true, url, thumbnailUrl, ... }
                        const videoData = {
                title: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
                description: '',
                            videoUrl: response.url,
                            thumbnailUrl: response.thumbnailUrl || response.thumbnail,
                tags: ''
                        };
                        
                        
                        resolve(videoData);
                    } catch (error) {
                        console.error('❌ Failed to parse response:', error);
                        reject(new Error('Failed to parse upload response'));
                    }
        } else {
                    console.error(`❌ Upload failed: ${xhr.status} ${xhr.statusText}`, xhr.responseText);
                    reject(new Error(`Upload failed with status ${xhr.status}`));
                }
            });
            
            // Handle errors
            xhr.addEventListener('error', () => {
                console.error('❌ Network error during upload');
                reject(new Error('Network error during upload'));
            });
            
            // Handle timeout
            xhr.addEventListener('timeout', () => {
                console.error('❌ Upload timeout');
                reject(new Error('Upload timeout'));
            });
            
            // Configure and send request
            xhr.open('POST', uploadUrl);
            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
            xhr.timeout = 600000; // 10 minutes timeout (Cloudinary needs time for large files)
            xhr.send(formData);
        });
    }

    /**
     * Refresh video grid after upload
     */
    refreshVideoGrid() {
        // Reload videos for the current album
        if (this.currentVideoAlbumId) {
            
            // Clear existing videos grid first
            const videosGrid = document.getElementById('video-grid');
            if (videosGrid) {
                videosGrid.innerHTML = '';
            }
            
            // Update gallery statistics
            this.fetchGalleryStats();
            
            // Force a small delay to ensure UI is cleared
            setTimeout(() => {
                // Reload videos
                this.loadAlbumVideos(this.currentVideoAlbumId, this.currentVideoAlbumTitle);
            }, 100);
        } else {
            console.warn('⚠️ Cannot refresh video grid: no current album ID');
        }
    }

    /**
     * Close upload videos modal
     */
    closeUploadVideosModal() {
        const modal = document.querySelector('.upload-videos-modal-overlay');
        if (modal) {
            modal.remove();
        }
        this.selectedVideoFiles = [];
        this.compressedVideoFiles = [];
        this.isCompressing = false;
    }

    /**
     * Handle video file selection
     */
    async handleVideoFileSelection(files) {
        const filesList = document.getElementById('upload-videos-files-list');
        const fileCount = document.getElementById('video-file-count');
        const confirmBtn = document.getElementById('confirm-upload-videos-btn');
        
        // Initialize compressed files array if not exists
        this.compressedVideoFiles = this.compressedVideoFiles || [];
        
        // Convert FileList to Array and filter valid files
        const validFiles = Array.from(files).filter(file => this.validateVideoFile(file));
        
        if (validFiles.length === 0) return;
        
        // Add files to selectedFiles immediately for UI display
                this.selectedVideoFiles = this.selectedVideoFiles || [];
        const startIndex = this.selectedVideoFiles.length;
        this.selectedVideoFiles.push(...validFiles);

        // Update UI to show files
        this.updateVideoFilesList();
        this.updateVideoUploadButton();
        
        // Disable upload button during compression
        if (confirmBtn) {
            confirmBtn.disabled = true;
            const originalBtnText = confirmBtn.innerHTML;
            confirmBtn.innerHTML = `<i data-lucide="loader-2" class="animate-spin"></i> Compressing ${validFiles.length} video(s)...`;
            
            // Reinitialize Lucide icons for the spinner
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }
        
        // Start parallel compression for all new files
        
        const compressionPromises = validFiles.map((file, index) => {
            const fileIndex = startIndex + index;
            return this.compressVideoWithUI(file, fileIndex);
        });
        
        // Wait for all compressions to complete
        try {
            const compressedResults = await Promise.all(compressionPromises);
            
            // Store compressed files
            this.compressedVideoFiles.push(...compressedResults);
            
            // Re-enable upload button
            if (confirmBtn) {
                confirmBtn.disabled = false;
                confirmBtn.innerHTML = `<i data-lucide="upload"></i> Upload ${this.selectedVideoFiles.length} Video(s)`;
                
                // Reinitialize Lucide icons
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
            }
            
        } catch (error) {
            console.error('❌ Error during parallel compression:', error);
            
            // Re-enable button even on error
            confirmBtn.disabled = false;
            confirmBtn.innerHTML = originalBtnText;
            
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }
    }


    /**
     * Compress video with UI progress indicator
     */
    async compressVideoWithUI(file, fileIndex) {
        const fileItem = document.querySelector(`[data-file-index="${fileIndex}"]`);
        if (!fileItem) {
            return file;
        }
        
        const fileInfo = fileItem.querySelector('.file-info');
        const originalSizeText = fileInfo.querySelector('.file-size').textContent;
        
        // Add compression status
        const statusDiv = document.createElement('div');
        statusDiv.className = 'file-compression-status';
        statusDiv.style.cssText = 'font-size: 12px; color: #6366f1; margin-top: 4px;';
        statusDiv.innerHTML = '🔧 Compressing... 0%';
        fileInfo.appendChild(statusDiv);
        
        try {
            const compressedFile = await this.compressVideo(file, (progress) => {
                statusDiv.innerHTML = `🔧 Compressing... ${progress}%`;
            });
            
            // Update UI with compressed file info
            const compressedSize = (compressedFile.size / 1024 / 1024).toFixed(2);
            const originalSize = (file.size / 1024 / 1024).toFixed(2);
            const savings = ((1 - compressedFile.size / file.size) * 100).toFixed(0);
            
            statusDiv.style.color = '#10b981';
            statusDiv.innerHTML = `✅ Compressed: ${originalSize} MB → ${compressedSize} MB (${savings}% smaller)`;
            
            return compressedFile;
        } catch (error) {
            statusDiv.style.color = '#ef4444';
            statusDiv.innerHTML = '⚠️ Compression failed, using original';
            return file;
        }
    }

    /**
     * Update video files list
     */
    updateVideoFilesList() {
        const filesList = document.getElementById('upload-videos-files-list');
        const selectedFiles = this.selectedVideoFiles || [];
        
        filesList.innerHTML = '';
        
        selectedFiles.forEach((file, index) => {
            const fileItem = document.createElement('div');
            fileItem.className = 'upload-file-item';
            fileItem.setAttribute('data-file-index', index);
            fileItem.innerHTML = `
                <div class="file-thumbnail">
                    <i data-lucide="video"></i>
                </div>
                <div class="file-info">
                    <div class="file-name">${file.name}</div>
                    <div class="file-size">${this.formatFileSize(file.size)}</div>
                </div>
                <button class="file-remove-btn" data-index="${index}">
                    <i data-lucide="trash-2"></i>
                </button>
            `;
            
            // Add remove button event
            const removeBtn = fileItem.querySelector('.file-remove-btn');
            removeBtn.addEventListener('click', () => {
                this.removeVideoFile(index);
            });
            
            filesList.appendChild(fileItem);
        });

        // Initialize Lucide icons for new elements
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    /**
     * Remove video file from selection
     */
    removeVideoFile(index) {
        this.selectedVideoFiles.splice(index, 1);
        this.updateVideoFilesList();
        this.updateVideoUploadButton();
    }

    /**
     * Update video upload button
     */
    updateVideoUploadButton() {
        const fileCount = document.getElementById('video-file-count');
        const confirmBtn = document.getElementById('confirm-upload-videos-btn');
        const selectedFiles = this.selectedVideoFiles || [];
        
        // Add null checks to prevent errors
        if (fileCount) {
            fileCount.textContent = selectedFiles.length;
        }
        
        if (confirmBtn) {
            confirmBtn.disabled = selectedFiles.length === 0;
        }
    }

    /**
     * Upload videos
     */


    /**
     * Close upload videos modal
     */
    closeUploadVideosModal() {
        const modal = document.querySelector('.upload-videos-modal-overlay');
        if (modal) {
            modal.remove();
        }
        this.selectedVideoFiles = [];
        this.compressedVideoFiles = [];
        this.isCompressing = false;
    }

    /**
     * Initialize featured moments functionality
     */
    initializeFeaturedMoments() {
        // Add drag and drop functionality
        this.setupDragAndDrop();
        
        // Add click handlers for action links
        this.setupFeaturedMomentActions();
    }

    /**
     * Setup drag and drop for reordering
     */
    setupDragAndDrop() {
        const tableBody = document.getElementById('featured-moments-table-body');
        if (!tableBody) return;

        let draggedElement = null;

        // Add drag event listeners to all rows
        tableBody.querySelectorAll('.table-row').forEach(row => {
            row.addEventListener('dragstart', (e) => {
                draggedElement = row;
                row.style.opacity = '0.5';
                e.dataTransfer.effectAllowed = 'move';
            });

            row.addEventListener('dragend', (e) => {
                row.style.opacity = '1';
                draggedElement = null;
            });

            row.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
            });

            row.addEventListener('drop', (e) => {
                e.preventDefault();
                if (draggedElement && draggedElement !== row) {
                    this.reorderFeaturedMoments(draggedElement, row);
                }
            });
        });
    }

    /**
     * Reorder featured moments
     */
    reorderFeaturedMoments(draggedElement, targetElement) {
        const tableBody = document.getElementById('featured-moments-table-body');
        const draggedOrder = parseInt(draggedElement.getAttribute('data-order'));
        const targetOrder = parseInt(targetElement.getAttribute('data-order'));

        // Insert dragged element before target element
        if (draggedOrder < targetOrder) {
            targetElement.parentNode.insertBefore(draggedElement, targetElement.nextSibling);
        } else {
            targetElement.parentNode.insertBefore(draggedElement, targetElement);
        }

        // Update order numbers
        this.updateOrderNumbers();
        
        // Show success message
        if (window.NotificationManager) {
            window.NotificationManager.show('success', 'Reordered', 'Featured moments reordered successfully');
        }
    }

    /**
     * Update order numbers after reordering
     */
    updateOrderNumbers() {
        const tableBody = document.getElementById('featured-moments-table-body');
        const rows = tableBody.querySelectorAll('.table-row');
        
        rows.forEach((row, index) => {
            const orderNumber = row.querySelector('.order-number');
            if (orderNumber) {
                orderNumber.textContent = index + 1;
            }
            row.setAttribute('data-order', index + 1);
        });
    }

    /**
     * Setup featured moment actions
     */
    setupFeaturedMomentActions() {
        // Remove links
        document.querySelectorAll('.remove-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const momentId = link.getAttribute('data-moment-id');
                const row = link.closest('.table-row');
                const albumTitle = row.querySelector('.album-title').textContent;
                this.showRemoveFeaturedMomentConfirmation(albumTitle, row, momentId);
            });
        });
    }

    /**
     * Load featured moments from database
     */
    async loadFeaturedMoments() {
        // Only load if the featured moments table exists (section is active)
        const tableBody = document.getElementById('featured-moments-table-body');
        if (!tableBody) {
            return;
        }

        try {
            const response = await fetch('/api/content/gallery/featured-moments');
            const data = await response.json();

            if (data.success && data.featuredMoments) {
                this.renderFeaturedMoments(data.featuredMoments);
            } else {
                console.error('❌ Failed to load featured moments:', data.error);
                window.NotificationManager.show('error', 'Error', 'Failed to load featured moments');
            }
        } catch (error) {
            console.error('❌ Error loading featured moments:', error);
            window.NotificationManager.show('error', 'Error', 'Failed to load featured moments');
        }
    }

    /**
     * Render featured moments in the table
     */
    renderFeaturedMoments(featuredMoments) {
        const tableBody = document.getElementById('featured-moments-table-body');
        if (!tableBody) {
            return;
        }

        // Clear existing content
        tableBody.innerHTML = '';

        if (featuredMoments.length === 0) {
            // Show empty state
            const emptyRow = document.createElement('div');
            emptyRow.className = 'table-row empty-state';
            emptyRow.innerHTML = `
                <div class="table-cell" colspan="4">
                    <div class="empty-state-content">
                        <i data-lucide="star" class="empty-icon"></i>
                        <p>No featured moments yet</p>
                        <small>Add your first featured moment using the button above</small>
                    </div>
                </div>
            `;
            tableBody.appendChild(emptyRow);
        } else {
            // Render each featured moment
            featuredMoments.forEach((moment, index) => {
                const row = this.createFeaturedMomentRow(moment, index + 1);
                tableBody.appendChild(row);
            });
        }

        // Initialize Lucide icons for the new content
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        // Re-initialize drag and drop and actions for new content
        this.setupDragAndDrop();
        this.setupFeaturedMomentActions();
    }

    /**
     * Create a featured moment table row
     */
    createFeaturedMomentRow(moment, orderIndex) {
        const row = document.createElement('div');
        row.className = 'table-row';
        row.setAttribute('data-order', orderIndex);
        row.setAttribute('data-moment-id', moment.id);
        row.draggable = true;

        // Get album title from the related album or use moment title
        const albumTitle = moment.album ? moment.album.title : moment.title.replace(' - Featured Moment', '');

        // Map invalid icon names to valid Lucide icons
        const validIcons = {
            'theater-masks': 'drama',
            'flask-conical': 'flask',
            'graduation-cap': 'graduation-cap',
            'trophy': 'trophy',
            'award': 'award',
            'star': 'star',
            'calendar': 'calendar',
            'camera': 'camera',
            'music': 'music',
            'heart': 'heart',
            'smile': 'smile'
        };
        
        const iconName = validIcons[moment.icon] || 'star';

        row.innerHTML = `
            <div class="table-cell">
                <div class="album-info">
                    <div class="album-icon">
                        <i data-lucide="${iconName}"></i>
                    </div>
                    <span class="album-title">${albumTitle}</span>
                </div>
            </div>
            <div class="table-cell">
                <span class="description-text">${moment.description || 'No description available'}</span>
            </div>
            <div class="table-cell">
                <span class="order-number">${moment.orderIndex || orderIndex}</span>
            </div>
            <div class="table-cell">
                <div class="action-links">
                    <a href="#" class="remove-link" data-moment-id="${moment.id}">Remove</a>
                </div>
            </div>
        `;

        return row;
    }

    /**
     * Show add featured moment modal
     */
    async showAddFeaturedMomentModal() {
        // Create modal overlay
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'add-featured-moment-modal-overlay';
        modalOverlay.innerHTML = this.getAddFeaturedMomentModalHTML();
        
        // Add to page
        document.body.appendChild(modalOverlay);

        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        // Initialize modal functionality
        await this.initializeAddFeaturedMomentModal();
    }

    /**
     * Get add featured moment modal HTML
     */
    getAddFeaturedMomentModalHTML() {
        return `
            <div class="add-featured-moment-modal">
                <div class="add-featured-moment-modal-header">
                    <div class="add-featured-moment-modal-title">
                        <h2>Add Featured Moment</h2>
                        <p>Add a new featured moment to the gallery</p>
                    </div>
                    <button class="add-featured-moment-modal-close" id="close-add-featured-moment-modal">
                        <i data-lucide="x"></i>
                    </button>
                </div>

                <div class="add-featured-moment-modal-content">
                    <form id="add-featured-moment-form">
                        <div class="form-group">
                            <label for="featured-moment-album" class="form-label">Select Album</label>
                            <select id="featured-moment-album" class="form-select" required>
                                <option value="">Choose an album</option>
                                <!-- Albums will be loaded dynamically -->
                            </select>
                        </div>

                        <!-- Album Details Section -->
                        <div id="album-details-section" class="album-details-section" style="display: none;">
                            <div class="form-section-header">
                                <h4>Selected Album Details</h4>
                            </div>
                            <div class="album-preview">
                                <div class="album-preview-info">
                                    <h5 id="album-preview-title"></h5>
                                    <p id="album-preview-description"></p>
                                    <div class="album-meta">
                                        <span id="album-preview-count"></span>
                                        <span id="album-preview-category"></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                <div class="add-featured-moment-modal-footer">
                    <button class="btn btn-secondary" id="cancel-add-featured-moment-btn">Cancel</button>
                    <button class="btn btn-primary" id="create-featured-moment-btn">
                        <i data-lucide="plus"></i>
                        Add Featured Moment
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Initialize add featured moment modal
     */
    async initializeAddFeaturedMomentModal() {
        const form = document.getElementById('add-featured-moment-form');
        const cancelBtn = document.getElementById('cancel-add-featured-moment-btn');
        const createBtn = document.getElementById('create-featured-moment-btn');
        const closeBtn = document.getElementById('close-add-featured-moment-modal');

        // Load photo albums into the select field
        await this.loadPhotoAlbumsForFeaturedMoment();

        // Form validation
        const albumSelect = document.getElementById('featured-moment-album');
        const createButton = document.getElementById('create-featured-moment-btn');

        albumSelect.addEventListener('change', async () => {
            const selectedAlbumId = albumSelect.value;
            if (selectedAlbumId) {
                await this.showAlbumDetails(selectedAlbumId);
                createButton.disabled = false;
            } else {
                this.hideAlbumDetails();
                createButton.disabled = true;
            }
        });

        // Create featured moment button
        createBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.createFeaturedMoment();
        });

        // Cancel button
        cancelBtn.addEventListener('click', () => {
            this.closeAddFeaturedMomentModal();
        });

        // Close button
        closeBtn.addEventListener('click', () => {
            this.closeAddFeaturedMomentModal();
        });

        // Close on overlay click
        document.querySelector('.add-featured-moment-modal-overlay').addEventListener('click', (e) => {
            if (e.target.classList.contains('add-featured-moment-modal-overlay')) {
                this.closeAddFeaturedMomentModal();
            }
        });

        // Close on Escape key
        const handleKeydown = (e) => {
            if (e.key === 'Escape') {
                this.closeAddFeaturedMomentModal();
                document.removeEventListener('keydown', handleKeydown);
            }
        };
        document.addEventListener('keydown', handleKeydown);
    }

    /**
     * Load photo albums for featured moment modal
     */
    async loadPhotoAlbumsForFeaturedMoment() {
        try {
            const response = await fetch('/api/content/gallery/photo-albums');
            const data = await response.json();

            if (data.success && data.albums) {
                const albumSelect = document.getElementById('featured-moment-album');
                
                // Clear existing options except the first one
                albumSelect.innerHTML = '<option value="">Choose an album</option>';
                
                // Add albums to select
                data.albums.forEach(album => {
                    const option = document.createElement('option');
                    option.value = album.id;
                    option.textContent = album.title;
                    albumSelect.appendChild(option);
                });
                
            } else {
                console.error('❌ Failed to load photo albums:', data.error);
                window.NotificationManager.show('error', 'Error', 'Failed to load photo albums');
            }
        } catch (error) {
            console.error('❌ Error loading photo albums:', error);
            window.NotificationManager.show('error', 'Error', 'Failed to load photo albums');
        }
    }

    /**
     * Show album details in featured moment modal
     */
    async showAlbumDetails(albumId) {
        try {
            const response = await fetch(`/api/content/gallery/album/${albumId}`);
            const data = await response.json();

            if (data.success && data.album) {
                const album = data.album;
                const detailsSection = document.getElementById('album-details-section');
                const previewTitle = document.getElementById('album-preview-title');
                const previewDescription = document.getElementById('album-preview-description');
                const previewCount = document.getElementById('album-preview-count');
                const previewCategory = document.getElementById('album-preview-category');

                // Update album preview
                previewTitle.textContent = album.title;
                previewDescription.textContent = album.description || 'No description available';
                previewCount.textContent = album.countLabel || `${album.itemCount || 0} Items`;
                previewCategory.textContent = album.category || 'Uncategorized';

                // Show the details section
                detailsSection.style.display = 'block';
                
            } else {
                console.error('❌ Failed to load album details:', data.error);
                window.NotificationManager.show('error', 'Error', 'Failed to load album details');
            }
        } catch (error) {
            console.error('❌ Error loading album details:', error);
            window.NotificationManager.show('error', 'Error', 'Failed to load album details');
        }
    }

    /**
     * Hide album details in featured moment modal
     */
    hideAlbumDetails() {
        const detailsSection = document.getElementById('album-details-section');
        detailsSection.style.display = 'none';
    }

    /**
     * Create featured moment
     */
    async createFeaturedMoment() {
        const albumId = document.getElementById('featured-moment-album').value;

        if (!albumId) {
            window.NotificationManager.show('error', 'Error', 'Please select an album');
            return;
        }

        // Show loading state
        const createBtn = document.getElementById('create-featured-moment-btn');
        const originalText = createBtn.innerHTML;
        createBtn.innerHTML = '<i data-lucide="loader-2" class="animate-spin"></i> Adding...';
        createBtn.disabled = true;

        try {

            // Get album details for the featured moment
            const albumSelect = document.getElementById('featured-moment-album');
            const selectedOption = albumSelect.options[albumSelect.selectedIndex];
            const albumTitle = selectedOption.textContent;

            // Get the album category from the preview
            const albumCategoryElement = document.getElementById('album-preview-category');
            const albumCategory = albumCategoryElement ? albumCategoryElement.textContent : 'general';

            // Create featured moment data
            const featuredMomentData = {
                title: `${albumTitle} - Featured Moment`,
                description: `Featured moment from ${albumTitle}`,
                imageUrl: '', // No album image available
                icon: 'star', // Default icon
                itemType: 'featured_moment',
                albumId: albumId,
                category: albumCategory, // Use album's category
                tags: albumCategory.toLowerCase().replace(/\s+/g, '-'), // Only save category as tag
                isFeatured: true,
                isActive: true,
                orderIndex: 0
            };

            // Save to database
            const response = await fetch('/api/content/gallery/featured-moments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(featuredMomentData)
            });

            const result = await response.json();

                if (result.success) {
                    
                    // Show success message
                    window.NotificationManager.show('success', 'Success', 'Featured moment added successfully');
                    
                    // Close modal
                    this.closeAddFeaturedMomentModal();
                    
                    // Refresh the featured moments list
                    this.loadFeaturedMoments();
                } else {
                    throw new Error(result.error || 'Failed to create featured moment');
                }

        } catch (error) {
            console.error('❌ Error creating featured moment:', error);
            window.NotificationManager.show('error', 'Error', `Failed to create featured moment: ${error.message}`);
        } finally {
            // Reset button state
            createBtn.innerHTML = originalText;
            createBtn.disabled = false;
        }
    }

    /**
     * Add featured moment to table
     */
    addFeaturedMomentToTable(albumTitle, description, icon) {
        const tableBody = document.getElementById('featured-moments-table-body');
        if (!tableBody) return;

        // Get next order number
        const existingRows = tableBody.querySelectorAll('.table-row');
        const nextOrder = existingRows.length + 1;

        const newRow = document.createElement('div');
        newRow.className = 'table-row';
        newRow.setAttribute('data-order', nextOrder);
        newRow.setAttribute('draggable', 'true');
        
        newRow.innerHTML = `
            <div class="table-cell">
                <div class="album-info">
                    <div class="album-icon">
                        <i data-lucide="${icon}"></i>
                    </div>
                    <span class="album-title">${albumTitle}</span>
                </div>
            </div>
            <div class="table-cell">
                <span class="description-text">${description}</span>
            </div>
            <div class="table-cell">
                <span class="order-number">${nextOrder}</span>
            </div>
            <div class="table-cell">
                <div class="action-links">
                    <a href="#" class="remove-link">Remove</a>
                </div>
            </div>
        `;

        // Add to table
        tableBody.appendChild(newRow);

        // Add event listeners for new row
        this.attachFeaturedMomentRowListeners(newRow);

        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    /**
     * Attach event listeners to featured moment row
     */
    attachFeaturedMomentRowListeners(row) {
        // Drag and drop
        row.addEventListener('dragstart', (e) => {
            row.style.opacity = '0.5';
            e.dataTransfer.effectAllowed = 'move';
        });

        row.addEventListener('dragend', (e) => {
            row.style.opacity = '1';
        });

        row.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        });

        row.addEventListener('drop', (e) => {
            e.preventDefault();
            const draggedElement = document.querySelector('.table-row[draggable="true"]:not([style*="opacity: 1"])');
            if (draggedElement && draggedElement !== row) {
                this.reorderFeaturedMoments(draggedElement, row);
            }
        });

        // Remove link
        const removeLink = row.querySelector('.remove-link');
        if (removeLink) {
            removeLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showRemoveFeaturedMomentConfirmation(row.querySelector('.album-title').textContent, row);
            });
        }
    }


    /**
     * Show remove featured moment confirmation
     */
    showRemoveFeaturedMomentConfirmation(albumTitle, row) {
        // Create modal overlay
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'delete-confirmation-overlay';
        modalOverlay.innerHTML = `
            <div class="delete-confirmation-modal">
                <div class="modal-header">
                    <div class="modal-icon">
                        <i data-lucide="alert-triangle"></i>
                    </div>
                    <h3>Remove Featured Moment</h3>
                </div>
                <div class="modal-content">
                    <p>Are you sure you want to remove <strong>"${albumTitle}"</strong> from featured moments?</p>
                    <p class="warning-text">This action cannot be undone.</p>
                </div>
                <div class="modal-actions">
                    <button class="btn btn-secondary cancel-delete-btn">
                        <i data-lucide="x"></i>
                        Cancel
                    </button>
                    <button class="btn btn-danger confirm-delete-btn">
                        <i data-lucide="trash-2"></i>
                        Remove
                    </button>
                </div>
            </div>
        `;

        // Add to page
        document.body.appendChild(modalOverlay);

        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        // Add event listeners
        const cancelBtn = modalOverlay.querySelector('.cancel-delete-btn');
        const confirmBtn = modalOverlay.querySelector('.confirm-delete-btn');

        const closeModal = () => {
            modalOverlay.remove();
        };

        cancelBtn.addEventListener('click', closeModal);
        confirmBtn.addEventListener('click', () => {
            this.removeFeaturedMoment(row);
            closeModal();
        });

        // Close on overlay click
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });

        // Close on Escape key
        const handleKeydown = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', handleKeydown);
            }
        };
        document.addEventListener('keydown', handleKeydown);
    }

    /**
     * Remove featured moment
     */
    async removeFeaturedMoment(row) {
        try {
            // Get featured moment ID from row
            const momentId = row.dataset.momentId;
            
            if (!momentId) {
                console.error('❌ No moment ID found on row');
                if (window.NotificationManager) {
                    window.NotificationManager.show('error', 'Delete Failed', 'Could not find featured moment ID');
                }
                return;
            }
            
            
            // Delete from database
            const response = await fetch(`/api/content/gallery/featured-moments/${momentId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to delete featured moment from database');
            }
            
            const data = await response.json();
            
        // Add removal animation
        row.style.transition = 'all 0.3s ease';
        row.style.transform = 'scale(0.8)';
        row.style.opacity = '0';
        
        setTimeout(() => {
            row.remove();
            this.updateOrderNumbers();
                
                if (window.NotificationManager) {
                    window.NotificationManager.show('success', 'Deleted', 'Featured moment removed successfully');
                }
        }, 300);
            
        } catch (error) {
            console.error('❌ Error deleting featured moment:', error);
            if (window.NotificationManager) {
                window.NotificationManager.show('error', 'Delete Failed', error.message || 'Failed to delete featured moment');
            }
        }
    }

    /**
     * Close add featured moment modal
     */
    closeAddFeaturedMomentModal() {
        const modal = document.querySelector('.add-featured-moment-modal-overlay');
        if (modal) {
            modal.remove();
        }
    }


    /**
     * Load photo albums from database
     */
    async loadPhotoAlbums() {
        try {
            // Show loading state
            this.showAlbumsLoading(true);
            this.showAlbumsEmpty(false);
            this.showAlbumsGrid(false);


            const response = await fetch('/api/content/gallery/photo-albums');
            const data = await response.json();

            if (data.success) {
                this.renderPhotoAlbums(data.albums);
            } else {
                console.error('❌ Failed to load photo albums:', data.error);
                if (window.NotificationManager) {
                    window.NotificationManager.show('error', 'Error', 'Failed to load photo albums');
                }
                this.showAlbumsEmpty(true);
            }
        } catch (error) {
            console.error('❌ Error loading photo albums:', error);
            if (window.NotificationManager) {
                window.NotificationManager.show('error', 'Error', 'Failed to load photo albums');
            }
            this.showAlbumsEmpty(true);
        } finally {
            this.showAlbumsLoading(false);
        }
    }

    /**
     * Load video albums from database
     */
    async loadVideoAlbums() {
        try {
            // Show loading state
            this.showAlbumsLoading(true);
            this.showAlbumsEmpty(false);
            this.showAlbumsGrid(false);


            const response = await fetch('/api/content/gallery/video-albums');
            const data = await response.json();

            if (data.success) {
                this.renderVideoAlbums(data.albums);
            } else {
                console.error('❌ Failed to load video albums:', data.error);
                if (window.NotificationManager) {
                    window.NotificationManager.show('error', 'Error', 'Failed to load video albums');
                }
                this.showAlbumsEmpty(true);
            }
        } catch (error) {
            console.error('❌ Error loading video albums:', error);
            if (window.NotificationManager) {
                window.NotificationManager.show('error', 'Error', 'Failed to load video albums');
            }
            this.showAlbumsEmpty(true);
        } finally {
            this.showAlbumsLoading(false);
        }
    }

    /**
     * Render photo albums in the grid
     */
    renderPhotoAlbums(albums) {
        const albumsGrid = document.getElementById('photo-albums-grid');
        if (!albumsGrid) return;

        if (albums.length === 0) {
            this.showAlbumsEmpty(true);
            this.showAlbumsGrid(false);
            return;
        }

        // Clear existing content
        albumsGrid.innerHTML = '';

        // Render each album
        albums.forEach(album => {
            const albumCard = this.createAlbumCard(album);
            albumsGrid.appendChild(albumCard);
        });

        this.showAlbumsGrid(true);
        this.showAlbumsEmpty(false);

        // Initialize Lucide icons for the new photo album cards
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        // Re-attach event listeners for the new album cards
        this.attachAlbumEventListeners();
    }

    /**
     * Render video albums in the grid
     */
    renderVideoAlbums(albums) {
        const albumsGrid = document.getElementById('video-albums-grid');
        if (!albumsGrid) {
            console.error('❌ Video albums grid element not found!');
            return;
        }

        if (albums.length === 0) {
            this.showAlbumsEmpty(true);
            this.showAlbumsGrid(false);
            return;
        }

        // Clear existing content
        albumsGrid.innerHTML = '';

        // Render each album
        albums.forEach(album => {
            const albumCard = this.createVideoAlbumCard(album);
            albumsGrid.appendChild(albumCard);
        });

        // Initialize Lucide icons for video album action buttons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        this.showAlbumsGrid(true);
        this.showAlbumsEmpty(false);

        this.attachVideoAlbumEventListeners();
    }

    /**
     * Create album card HTML
     */
    createAlbumCard(album) {
        const albumCard = document.createElement('div');
        albumCard.className = 'photo-album-card';
        albumCard.setAttribute('data-album-id', album.id);
        albumCard.setAttribute('data-tooltip', album.title);

        // Format date
        const createdDate = new Date(album.createdAt).toLocaleDateString();
        const photoCount = album.items ? album.items.length : 0;
        
        // Get cover image from first photo or use album image
        const coverImage = album.items && album.items.length > 0 
            ? album.items[0].imageUrl 
            : album.imageUrl;

        albumCard.innerHTML = `
            <div class="album-info">
                <h3 class="album-title">${album.title}</h3>
                <div class="album-meta">
                    <span class="album-count">${photoCount} Photo${photoCount !== 1 ? 's' : ''}</span>
                    <span class="album-date">${createdDate}</span>
                </div>
            </div>
            <div class="album-actions">
                <button class="btn btn-sm btn-primary edit-album-btn" title="Edit Album">
                    <i data-lucide="edit"></i>
                </button>
                <button class="btn btn-sm btn-danger delete-album-btn" title="Delete Album">
                    <i data-lucide="trash-2"></i>
                </button>
            </div>
        `;

        return albumCard;
    }

    /**
     * Create video album card HTML
     */
    createVideoAlbumCard(album) {
        const albumCard = document.createElement('div');
        albumCard.className = 'video-album-card';
        albumCard.setAttribute('data-album-id', album.id);
        albumCard.setAttribute('data-tooltip', album.title);

        // Format date
        const createdDate = new Date(album.createdAt).toLocaleDateString();
        const videoCount = album.items ? album.items.length : 0;
        
        // Get cover image from first video or use album image
        const coverImage = album.items && album.items.length > 0 
            ? album.items[0].imageUrl 
            : album.imageUrl;

        albumCard.innerHTML = `
            <div class="album-info">
                <h3 class="album-title">${album.title}</h3>
                <div class="album-meta">
                    <span class="album-count">${videoCount} Video${videoCount !== 1 ? 's' : ''}</span>
                    <span class="album-date">${createdDate}</span>
                </div>
            </div>
            <div class="album-actions">
                <button class="btn btn-sm btn-primary edit-video-album-btn" title="Edit Album">
                    <i data-lucide="edit"></i>
                </button>
                <button class="btn btn-sm btn-danger delete-video-album-btn" title="Delete Album">
                    <i data-lucide="trash-2"></i>
                </button>
            </div>
        `;
        
        return albumCard;
    }

    /**
     * Attach event listeners to album cards
     */
    attachAlbumEventListeners() {
        
        // Remove existing event listeners to prevent duplicates
        document.querySelectorAll('.photo-album-card').forEach(card => {
            const newCard = card.cloneNode(true);
            card.parentNode.replaceChild(newCard, card);
        });
        
        // Album card click handlers
        document.querySelectorAll('.photo-album-card').forEach(card => {
            card.addEventListener('click', (e) => {
                // Don't open if clicking on action buttons
                if (e.target.closest('.album-actions')) {
                    return;
                }
                const albumId = card.getAttribute('data-album-id');
                const albumTitle = card.querySelector('.album-title').textContent;
                this.openAlbumEditor(albumId, albumTitle);
            });
        });

        // Edit album button handlers
        document.querySelectorAll('.edit-album-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const albumCard = btn.closest('.photo-album-card');
                const albumId = albumCard.getAttribute('data-album-id');
                const albumTitle = albumCard.querySelector('.album-title').textContent;
                this.openAlbumEditModal(albumId, albumTitle);
            });
        });

        // Delete album button handlers
        document.querySelectorAll('.delete-album-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const albumCard = btn.closest('.photo-album-card');
                const albumId = albumCard.getAttribute('data-album-id');
                const albumTitle = albumCard.querySelector('.album-title').textContent;
                this.showAlbumDeleteConfirmation(albumId, albumTitle);
            });
        });

        // Initialize Lucide icons for new elements
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    /**
     * Attach event listeners to video album cards
     */
    attachVideoAlbumEventListeners() {
        // Video album card click handlers
        document.querySelectorAll('.video-album-card').forEach(card => {
            card.addEventListener('click', (e) => {
                // Don't open if clicking on action buttons
                if (e.target.closest('.album-actions')) {
                    return;
                }
                
                const albumId = card.getAttribute('data-album-id');
                const albumTitle = card.getAttribute('data-tooltip');
                this.openVideoAlbumEditor(albumId, albumTitle);
            });
        });

        // Edit video album button handlers
        document.querySelectorAll('.edit-video-album-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const albumCard = btn.closest('.video-album-card');
                const albumId = albumCard.getAttribute('data-album-id');
                const albumTitle = albumCard.getAttribute('data-tooltip');
                this.openVideoAlbumEditModal(albumId, albumTitle);
            });
        });

        // Delete video album button handlers
        document.querySelectorAll('.delete-video-album-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const albumCard = btn.closest('.video-album-card');
                const albumId = albumCard.getAttribute('data-album-id');
                const albumTitle = albumCard.getAttribute('data-tooltip');
                this.showDeleteVideoAlbumConfirmation(albumId, albumTitle);
            });
        });
    }

    /**
     * Show/hide loading state
     */
    showAlbumsLoading(show) {
        const loadingElement = document.getElementById('albums-loading');
        if (loadingElement) {
            loadingElement.style.display = show ? 'grid' : 'none';
        }
    }

    /**
     * Show/hide empty state
     */
    showAlbumsEmpty(show) {
        // Handle photo albums empty state
        const photoEmptyElement = document.getElementById('empty-photo-albums');
        if (photoEmptyElement) {
            photoEmptyElement.style.display = show ? 'flex' : 'none';
        }

        // Handle video albums empty state
        const videoEmptyElement = document.getElementById('empty-video-albums');
        if (videoEmptyElement) {
            videoEmptyElement.style.display = show ? 'flex' : 'none';
        }
    }

    /**
     * Show/hide albums grid
     */
    showAlbumsGrid(show) {
        
        // Handle photo albums grid
        const photoGridElement = document.getElementById('photo-albums-grid');
        if (photoGridElement) {
            photoGridElement.style.display = show ? 'grid' : 'none';
        }

        // Handle video albums grid (only if it exists)
        const videoGridElement = document.getElementById('video-albums-grid');
        if (videoGridElement) {
            videoGridElement.style.display = show ? 'grid' : 'none';
        } else {
        }
    }

    /**
     * Fetch comprehensive gallery statistics
     */
    async fetchGalleryStats() {
        try {
            // Fetch photo albums data
            const photoResponse = await fetch(`/api/content/gallery/photo-albums?_t=${Date.now()}`);
            const photoData = await photoResponse.json();

            // Fetch video albums data
            const videoResponse = await fetch(`/api/content/gallery/video-albums?_t=${Date.now()}`);
            const videoData = await videoResponse.json();

            // Calculate statistics
            if (photoData.success) {
                this.galleryStats.photoAlbums = photoData.albums.length;
                this.galleryStats.totalPhotos = photoData.albums.reduce((total, album) => {
                    return total + (album.items ? album.items.length : 0);
                }, 0);
            }

            if (videoData.success) {
                this.galleryStats.videoAlbums = videoData.albums.length;
                this.galleryStats.totalVideos = videoData.albums.reduce((total, album) => {
                    return total + (album.items ? album.items.length : 0);
                }, 0);
            }

            // Update the statistics display
            this.updateGalleryStatsDisplay();

        } catch (error) {
            console.error('Error fetching gallery stats:', error);
        }
    }

    /**
     * Update gallery statistics display
     */
    updateGalleryStatsDisplay() {
        // Update photo album statistics
        const photoAlbumsCountEl = document.getElementById('photo-albums-count');
        const photosCountEl = document.getElementById('photo-count');
        
        if (photoAlbumsCountEl) photoAlbumsCountEl.textContent = this.galleryStats.photoAlbums;
        if (photosCountEl) photosCountEl.textContent = this.galleryStats.totalPhotos;

        // Update video album statistics
        const videoCollectionsEl = document.getElementById('video-collections-count');
        const videoCountEl = document.getElementById('video-count');
        
        if (videoCollectionsEl) videoCollectionsEl.textContent = this.galleryStats.videoAlbums;
        if (videoCountEl) videoCountEl.textContent = this.galleryStats.totalVideos;

        // Update featured moments (for now, we'll use photo albums as featured moments)
        const featuredMomentsEl = document.getElementById('featured-moments-count');
        if (featuredMomentsEl) featuredMomentsEl.textContent = this.galleryStats.photoAlbums;
    }

    /**
     * Load photo album statistics for the main gallery page
     */
    async loadPhotoAlbumStats() {
        try {
            const response = await fetch('/api/content/gallery/photo-albums');
            const data = await response.json();

            if (data.success) {
                const albumsCount = data.albums.length;
                const totalPhotos = data.albums.reduce((total, album) => {
                    return total + (album.items ? album.items.length : 0);
                }, 0);

                // Update the statistics in the photo album card
                const albumsCountEl = document.getElementById('photo-albums-count');
                const photosCountEl = document.getElementById('photo-count');
                
                if (albumsCountEl) albumsCountEl.textContent = albumsCount;
                if (photosCountEl) photosCountEl.textContent = totalPhotos;
            }
        } catch (error) {
            console.error('Error loading photo album stats:', error);
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
        
        // Add active class to gallery link
        const galleryLink = document.querySelector('[data-section="gallery"]');
        if (galleryLink) {
            galleryLink.classList.add('active');
        }
    }

    /**
     * Open Gallery Hero Editor
     */
    openHeroEditor() {
        const heroEditorContent = this.getHeroEditorContent();
        this.injectContent(heroEditorContent);
        this.loadHeroData();
        this.bindHeroEditorEvents();
        
        // Initialize ImageUpload component for hero background image
        this.initializeHeroImageUpload();
        
        // Initialize SaveButton component for hero section
        this.initializeSaveButton('hero');
    }

    /**
     * Initialize ImageUpload component for hero background image
     */
    initializeHeroImageUpload() {
        // Destroy existing instance if any
        if (this.heroImageUpload) {
            this.heroImageUpload.destroy();
        }

        // Create new ImageUpload instance
        this.heroImageUpload = new ImageUpload({
            fileInputId: 'hero-background-image-upload',
            urlInputId: 'hero-background-image-url',
            selectBtnId: 'hero-background-image-select-btn',
            previewContainerId: 'hero-background-image-preview-container',
            previewImgId: 'hero-background-image-preview',
            removeBtnId: 'hero-background-image-remove-btn',
            uploadPath: '/api/upload/image',
            uploadFolder: 'marigold-school/gallery/hero',
            autoUpload: false, // Disable auto-upload, we'll handle it during save
            showNotification: (type, message) => {
                if (window.NotificationManager) {
                    window.NotificationManager.show(type, type === 'error' ? 'Error' : 'Success', message);
                } else {
                }
            },
            onUploadSuccess: (result) => {
                this.updateHeroPreview();
            },
            onUploadError: (error) => {
                console.error('Hero background image upload error:', error);
            }
        });

        // Initialize the component
        this.heroImageUpload.init();
    }

    /**
     * Get Hero Editor Content
     */
    getHeroEditorContent() {
        return `
            <section id="gallery-hero-editor" class="content-section active">
                <div class="page-header">
                    <button class="back-button" data-action="back-to-gallery-main">
                        <i data-lucide="arrow-left"></i>
                    </button>
                    <div class="page-title">
                        <h1>Gallery Hero Section</h1>
                        <p>Edit the main banner and hero content displayed on the public gallery page</p>
                    </div>
                </div>

                <div class="editor-container">
                    <div class="editor-form">
                        <form id="heroSectionForm" class="section-form">
                            <div class="form-section">
                                <h3 class="section-title">
                                    <i data-lucide="type"></i>
                                    Hero Content
                                </h3>
                                
                                <div class="form-group">
                                    <label for="heroTitle">Hero Title</label>
                                    <input type="text" id="heroTitle" name="heroTitle" class="form-input" 
                                           placeholder="Photo Gallery" maxlength="100">
                                    <small class="form-hint">Main title displayed in the hero banner</small>
                                </div>

                                <div class="form-group">
                                    <label for="heroDescription">Hero Description</label>
                                    <textarea id="heroDescription" name="heroDescription" class="form-textarea" 
                                              rows="4" placeholder="Explore our collection of memorable moments, school activities, and celebrations that showcase the vibrant life at Marigold School."></textarea>
                                    <small class="form-hint">Description text displayed below the title</small>
                                </div>

                                <div class="form-group">
                                    <label for="heroButtonText">Button Text</label>
                                    <input type="text" id="heroButtonText" name="heroButtonText" class="form-input" 
                                           placeholder="Explore Gallery" maxlength="50">
                                    <small class="form-hint">Text for the call-to-action button</small>
                                </div>
                            </div>

                            <div class="form-section">
                                <h3 class="section-title">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="image" class="lucide lucide-image"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><circle cx="9" cy="9" r="2"></circle><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path></svg>
                                    Background Image
                                </h3>
                                
                                <div class="form-group">
                                    <label for="heroBackgroundImage">Background Image</label>
                                    <div class="image-upload-container">
                                        <input type="file" id="hero-background-image-upload" class="image-upload-input" accept="image/*" style="display: none;">
                                        <input type="hidden" id="hero-background-image-url" value="">
                                        <button type="button" id="hero-background-image-select-btn" class="btn btn-outline image-select-btn" style="display: none;">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="image" class="lucide lucide-image"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><circle cx="9" cy="9" r="2"></circle><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path></svg>
                                            Select Image
                                        </button>
                                        <div class="image-preview-container" id="hero-background-image-preview-container" style="display: none;">
                                            <img id="hero-background-image-preview" class="image-preview" alt="Preview">
                                            <button type="button" id="hero-background-image-remove-btn" class="image-remove-btn">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="x" class="lucide lucide-x"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
                                        </button>
                                    </div>
                                </div>
                                    <small class="form-hint">PNG, JPG, GIF up to 25MB</small>
                                </div>
                            </div>


                            <div class="form-actions">
                                <button type="button" class="btn btn-primary" data-action="save-hero-section">
                                    <i data-lucide="save"></i>
                                    Save Hero Section
                                </button>
                                <button type="button" class="btn btn-secondary" data-action="cancel-hero-section">
                                    <i data-lucide="x"></i>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>

                    <div class="editor-preview">
                        <h3 class="preview-title">
                            <i data-lucide="eye"></i>
                            Preview
                        </h3>
                        <div class="preview-container">
                            <div class="hero-preview" id="heroPreview">
                                <div class="hero-bg-preview" id="heroBgPreview"></div>
                                <div class="hero-overlay-preview"></div>
                                <div class="hero-content-preview">
                                    <h1 class="hero-title-preview" id="heroTitlePreview">Photo Gallery</h1>
                                    <p class="hero-description-preview" id="heroDescriptionPreview">
                                        Explore our collection of memorable moments, school activities, and celebrations that showcase the vibrant life at Marigold School.
                                    </p>
                                    <button class="hero-btn-preview" id="heroBtnPreview">Explore Gallery</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    /**
     * Load photos for a specific album
     */
    async loadAlbumPhotos(albumId, albumTitle) {
        try {
            
            // Show loading state
            this.showPhotosLoading(true);
            
            const apiUrl = `/api/content/gallery/album/${albumId}/photos?_t=${Date.now()}`;
            const response = await fetch(apiUrl);
            
            const data = await response.json();
            
            if (data.success) {
                const { album, photos } = data;
                
                // Update album title in header
                this.updateAlbumTitle(album.title);
                
                // Render photos
                this.renderPhotos(photos);
                
                // Show empty state if no photos
                if (photos.length === 0) {
                    this.showEmptyPhotosState();
                }
            } else {
                console.error('❌ LOAD ALBUM PHOTOS: Error loading album photos:', data.error);
                window.NotificationManager.show('error', 'Error', 'Failed to load album photos');
                this.showPhotosError();
            }
        } catch (error) {
            console.error('❌ Error loading album photos:', error);
            window.NotificationManager.show('error', 'Error', 'Failed to load album photos');
            this.showPhotosError();
        } finally {
            this.showPhotosLoading(false);
        }
    }

    /**
     * Show/hide photos loading state
     */
    showPhotosLoading(show) {
        // Show/hide placeholder boxes
        for (let i = 1; i <= 6; i++) {
            const placeholder = document.getElementById(`photo-placeholder-${i}`);
            if (placeholder) {
                placeholder.style.display = show ? 'block' : 'none';
            }
        }
    }

    /**
     * Update album title in header
     */
    updateAlbumTitle(title) {
        const titleElement = document.querySelector('#album-editor .page-title h1');
        if (titleElement) {
            titleElement.textContent = `Album: ${title}`;
        }
    }

    /**
     * Render photos in the grid
     */
    renderPhotos(photos) {
        
        const photoGrid = document.getElementById('photo-grid');
        
        if (!photoGrid) {
            console.error(`🎨 RENDER PHOTOS: Photo grid not found!`);
            return;
        }

        // Clear all existing content
        photoGrid.innerHTML = '';

        if (photos.length === 0) {
            this.showEmptyPhotosState();
            return;
        }

        // Create photo cards
        photos.forEach((photo, index) => {
            const photoCard = this.createPhotoCard(photo);
            photoGrid.appendChild(photoCard);
        });


        // Initialize Lucide icons for new elements
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        // Attach photo event listeners
        this.attachPhotoEventListeners();
    }

    /**
     * Create a photo card element
     */
    createPhotoCard(photo) {
        const photoCard = document.createElement('div');
        photoCard.className = 'photo-card';
        photoCard.setAttribute('data-photo-id', photo.id);

        photoCard.innerHTML = `
            <div class="photo-thumbnail">
                <img src="${photo.imageUrl}" alt="${photo.title || 'Photo'}" loading="lazy">
                <div class="photo-overlay">
                    <button class="btn btn-sm btn-white photo-action-btn" data-action="view">
                        <i data-lucide="eye"></i>
                    </button>
                    <button class="btn btn-sm btn-white photo-action-btn" data-action="edit">
                        <i data-lucide="edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger photo-action-btn" data-action="delete">
                        <i data-lucide="trash-2"></i>
                    </button>
                </div>
            </div>
        `;

        return photoCard;
    }

    /**
     * Attach event listeners to photo cards
     */
    attachPhotoEventListeners() {
        const photoCards = document.querySelectorAll('.photo-card');
        photoCards.forEach(card => {
            const actionBtns = card.querySelectorAll('.photo-action-btn');
            actionBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const action = btn.getAttribute('data-action');
                    const photoId = card.getAttribute('data-photo-id');
                    this.handlePhotoAction(action, photoId);
                });
            });
        });
    }


    /**
     * Show empty photos state
     */
    showEmptyPhotosState() {
        const photoGrid = document.getElementById('photo-grid');
        if (!photoGrid) return;

        photoGrid.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">
                    <i data-lucide="images"></i>
                </div>
                <h3>No Photos Yet</h3>
                <p>This album doesn't have any photos yet. Upload some photos to get started.</p>
                <button class="btn btn-primary" id="upload-photos-btn-empty">
                    <i data-lucide="upload"></i>
                    Upload Photos
                </button>
            </div>
        `;

        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    /**
     * Show photos error state
     */
    showPhotosError() {
        const photoGrid = document.getElementById('photo-grid');
        if (!photoGrid) return;

        photoGrid.innerHTML = `
            <div class="error-state">
                <div class="error-icon">
                    <i data-lucide="alert-circle"></i>
                </div>
                <h3>Error Loading Photos</h3>
                <p>There was an error loading the photos for this album. Please try again.</p>
                <button class="btn btn-primary" onclick="window.location.reload()">
                    <i data-lucide="refresh-cw"></i>
                    Retry
                </button>
            </div>
        `;

        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    /**
     * Open album edit modal
     */
    async openAlbumEditModal(albumId, albumTitle) {
        try {
            
            // Fetch album details from database
            const response = await fetch(`/api/content/gallery/photo-albums/${albumId}`);
            const data = await response.json();
            
            if (data.success) {
                const album = data.album;
                this.currentAlbumId = albumId;
                
                // Show modal
                this.showAlbumEditModal(album);
            } else {
                console.error('❌ Error fetching album details:', data.error);
                window.NotificationManager.show('error', 'Error', 'Failed to load album details');
            }
        } catch (error) {
            console.error('❌ Error opening album edit modal:', error);
            window.NotificationManager.show('error', 'Error', 'Failed to open album edit modal');
        }
    }

    /**
     * Show album edit modal
     */
    showAlbumEditModal(album) {
        
        // Create modal HTML
        const modalHTML = `
            <div id="album-edit-modal" class="modal-overlay" style="display: flex !important; opacity: 1 !important; visibility: visible !important; z-index: 999999 !important;">
                <div class="modal-container">
                    <div class="modal-header">
                        <h2>Edit Album: ${album.title}</h2>
                        <button class="modal-close-btn" id="close-album-edit-modal">
                            <i data-lucide="x"></i>
                        </button>
                    </div>
                    
                    <div class="modal-body">
                        <form id="album-edit-form" class="album-form">
                            <div class="form-section">
                                <h3>Album Information</h3>
                                
                                <div class="form-group">
                                    <label for="album-title">Album Title *</label>
                                    <input type="text" id="album-title" name="title" value="${album.title || ''}" required>
                                </div>

                                <div class="form-group">
                                    <label for="album-description">Description</label>
                                    <textarea id="album-description" name="description" rows="4" placeholder="Enter album description...">${album.description || ''}</textarea>
                                </div>

                                <div class="form-group">
                                    <label for="album-category">Category *</label>
                                    <select id="album-category" name="category" class="form-select" required>
                                        <option value="">Select a category...</option>
                                        ${GALLERY_ALBUM_CATEGORIES.map(cat => 
                                            `<option value="${cat.value}" ${album.category === cat.value ? 'selected' : ''}>
                                                ${cat.icon} ${cat.label}
                                            </option>`
                                        ).join('')}
                                    </select>
                                    <small class="form-help">Choose the most appropriate category for this album</small>
                                </div>

                                <div class="form-group">
                                    <label for="album-edit-thumbnail">Album Thumbnail</label>
                                    <div class="image-upload-container">
                                        <input type="file" id="album-edit-thumbnail-upload" class="image-upload-input" accept="image/*" style="display: none;">
                                        <input type="hidden" id="album-edit-thumbnail-url" name="thumbnailUrl" value="${album.imageUrl || ''}">
                                        <button type="button" id="album-edit-thumbnail-select-btn" class="btn btn-outline image-select-btn">
                                            <i data-lucide="image"></i>
                                            ${album.imageUrl ? 'Change Thumbnail' : 'Select Thumbnail'}
                                        </button>
                                        <div class="image-preview-container" id="album-edit-thumbnail-preview-container" style="display: ${album.imageUrl ? 'block' : 'none'};">
                                            <img id="album-edit-thumbnail-preview" class="image-preview" src="${album.imageUrl || ''}" alt="Thumbnail Preview">
                                            <button type="button" id="album-edit-thumbnail-remove-btn" class="image-remove-btn">
                                                <i data-lucide="x"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <small class="form-help">Upload a thumbnail image for the album (PNG, JPG, GIF up to 2MB)</small>
                                </div>
                            </div>
                        </form>
                    </div>
                    
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" id="cancel-edit-album-btn">
                            <i data-lucide="x"></i>
                            Cancel
                        </button>
                        <button type="button" class="btn btn-primary" id="save-album-btn">
                            <i data-lucide="save"></i>
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Add modal to page
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Store current album data for later use
        this.currentAlbumData = album;
        
        // Initialize modal functionality
        this.initializeAlbumEditModal();
    }

    /**
     * Initialize album edit modal
     */
    async initializeAlbumEditModal() {
        const modal = document.getElementById('album-edit-modal');
        const closeBtn = document.getElementById('close-album-edit-modal');
        const cancelBtn = document.getElementById('cancel-edit-album-btn');
        const saveBtn = document.getElementById('save-album-btn');

        // Close modal handlers
        const closeModal = () => {
            modal.remove();
        };

        closeBtn.addEventListener('click', closeModal);
        cancelBtn.addEventListener('click', closeModal);

        // Close on overlay click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        // Close on Escape key
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);

        // Save button handler
        saveBtn.addEventListener('click', () => {
            this.saveAlbumChanges();
        });

        // Initialize ImageUpload component for thumbnail
        
        const thumbnailUrlInput = document.getElementById('album-edit-thumbnail-url');
        
        this.albumEditThumbnailUpload = new ImageUpload({
            fileInputId: 'album-edit-thumbnail-upload',
            urlInputId: 'album-edit-thumbnail-url',
            selectBtnId: 'album-edit-thumbnail-select-btn',
            previewContainerId: 'album-edit-thumbnail-preview-container',
            previewImgId: 'album-edit-thumbnail-preview',
            removeBtnId: 'album-edit-thumbnail-remove-btn',
            uploadPath: '/api/upload/image',
            uploadFolder: 'marigold-school/gallery/thumbnails',
            maxSize: 2 * 1024 * 1024, // 2MB
            autoUpload: false,
            onUploadSuccess: (result) => {
                document.getElementById('album-edit-thumbnail-url').value = result.url;
            },
            onUploadError: (error) => {
                console.error('❌ Album thumbnail upload error:', error);
                window.NotificationManager.show('error', 'Upload Failed', 'Failed to upload thumbnail image');
            },
            showNotification: (type, title, message) => {
                window.NotificationManager.show(type, title, message);
            }
        });
        this.albumEditThumbnailUpload.init();
        

        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        // Initialize searchable select for category dropdown
        setTimeout(() => {
            this.initializeSearchableSelects();
        }, 100);
        
        // Set current category after categories are loaded
        // Add a small delay to ensure DOM is updated
        setTimeout(() => {
        this.setCurrentCategory();
        }, 100);
    }

    /**
     * Save album changes
     */
    async saveAlbumChanges() {
        try {
            const form = document.getElementById('album-edit-form');
            if (!form) return;

            const saveBtn = document.getElementById('save-album-btn');
            const originalHTML = saveBtn.innerHTML;
            saveBtn.innerHTML = '<i data-lucide="loader-2" class="animate-spin"></i> Saving...';
            saveBtn.disabled = true;

            // Upload thumbnail if a new file is selected
            let thumbnailUrl = document.getElementById('album-edit-thumbnail-url').value;
            if (this.albumEditThumbnailUpload && this.albumEditThumbnailUpload.elements.fileInput.files.length > 0) {
                saveBtn.innerHTML = '<i data-lucide="loader-2" class="animate-spin"></i> Uploading thumbnail...';
                
                try {
                    const file = this.albumEditThumbnailUpload.elements.fileInput.files[0];
                    const uploadResult = await this.albumEditThumbnailUpload.uploadFile(file);
                    thumbnailUrl = uploadResult.url;
                } catch (uploadError) {
                    console.error('❌ Thumbnail upload failed:', uploadError);
                    window.NotificationManager.show('warning', 'Warning', 'Album will be updated without new thumbnail');
                }
            }

            const formData = new FormData(form);
            const albumData = {
                title: formData.get('title'),
                description: formData.get('description'),
                category: formData.get('category') || formData.get('newCategory'),
                imageUrl: thumbnailUrl || ''
            };


            saveBtn.innerHTML = '<i data-lucide="loader-2" class="animate-spin"></i> Saving changes...';
            const response = await fetch(`/api/content/gallery/album/${this.currentAlbumId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(albumData)
            });

            const data = await response.json();

            if (data.success) {
                window.NotificationManager.show('success', 'Success', 'Album updated successfully');
                
                // Close modal
                const modal = document.getElementById('album-edit-modal');
                if (modal) {
                    modal.remove();
                }
                
                // Refresh photo albums list
                setTimeout(() => {
                    this.loadPhotoAlbums();
                }, 500);
            } else {
                console.error('❌ Error saving album:', data.error);
                window.NotificationManager.show('error', 'Error', 'Failed to save album changes');
                saveBtn.innerHTML = originalHTML;
                saveBtn.disabled = false;
            }
        } catch (error) {
            console.error('❌ Error saving album:', error);
            window.NotificationManager.show('error', 'Error', 'Failed to save album changes');
            const saveBtn = document.getElementById('save-album-btn');
            if (saveBtn) {
                saveBtn.innerHTML = '<i data-lucide="save"></i> Save Changes';
                saveBtn.disabled = false;
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
            }
        }
    }

    /**
     * Load available categories
     */
    async loadCategories() {
        try {
            const response = await fetch('/api/content/gallery/categories');
            const data = await response.json();
            
            if (data.success) {
                const categorySelect = document.getElementById('album-category');
                if (categorySelect) {
                    // Clear existing options except the first one
                    categorySelect.innerHTML = '<option value="">Select a category...</option>';
                    
                    // Add categories to select
                    data.categories.forEach(category => {
                        const option = document.createElement('option');
                        option.value = category;
                        option.textContent = category;
                        categorySelect.appendChild(option);
                    });
                    
                }
            } else {
                console.error('❌ Error loading categories:', data.error);
            }
        } catch (error) {
            console.error('❌ Error loading categories:', error);
        }
    }

    /**
     * Load available categories for video album edit modal
     */
    async loadCategoriesForVideoAlbumEdit() {
        // DEPRECATED: Categories are now stored in GALLERY_ALBUM_CATEGORIES array at the top of this file
        // No longer loading from database
        console.log('✅ Using predefined categories from GALLERY_ALBUM_CATEGORIES');
    }

    /**
     * Setup category selection functionality
     */
    setupCategorySelection() {
        // DEPRECATED: "Add New Category" functionality removed
        // Categories are managed in GALLERY_ALBUM_CATEGORIES array at the top of this file
        // Using searchable select instead
        console.log('✅ Using searchable select for photo album categories');
    }

    /**
     * Set current category in the dropdown
     */
    setCurrentCategory() {
        
        if (this.currentAlbumData && this.currentAlbumData.category) {
            const categorySelect = document.getElementById('album-category');
            
            if (categorySelect) {
                categorySelect.value = this.currentAlbumData.category;
            }
        } else {
        }
    }

    /**
     * Save new category to database
     */
    async saveNewCategory(categoryName) {
        try {
            
            const token = localStorage.getItem('token');
            const response = await fetch('/api/content/gallery/categories', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ category: categoryName })
            });
            
            const data = await response.json();
            
            if (data.success) {
                return data;
            } else {
                console.error('❌ Failed to save category:', data.error);
                throw new Error(data.error || 'Failed to save category');
            }
        } catch (error) {
            console.error('❌ Error saving category:', error);
            throw error;
        }
    }

    /**
     * Load Hero Data
     */
    async loadHeroData() {
        try {
            const response = await fetch('/api/content/gallery/hero');
            const data = await response.json();
            
            if (data.success) {
                const heroData = data.hero || {};
                
                // Populate form fields
                document.getElementById('heroTitle').value = heroData.title || 'Photo Gallery';
                document.getElementById('heroDescription').value = heroData.description || '';
                document.getElementById('heroButtonText').value = heroData.buttonText || 'Explore Gallery';
                
                // Set background image URL in hidden input for ImageUpload component
                const bgImageUrlInput = document.getElementById('hero-background-image-url');
                if (bgImageUrlInput) {
                    bgImageUrlInput.value = heroData.backgroundImage || '';
                }
                
                // Update preview
                this.updateHeroPreview();
                
                // Set existing image in ImageUpload component if it exists
                if (heroData.backgroundImage && this.heroImageUpload) {
                    this.heroImageUpload.setImageUrl(heroData.backgroundImage);
                }
            }
        } catch (error) {
            console.error('Error loading hero data:', error);
            if (window.NotificationManager) {
                window.NotificationManager.show('error', 'Error', 'Error loading hero data');
            } else {
                console.error('Error loading hero data');
            }
        }
    }

    /**
     * Bind Hero Editor Events
     */
    bindHeroEditorEvents() {
        // Real-time preview updates
        const inputs = ['heroTitle', 'heroDescription', 'heroButtonText'];
        inputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input) {
                input.addEventListener('input', () => {
                    this.updateHeroPreview();
                });
            }
        });

        // Background image preview is now handled by ImageUpload component
        const bgImageUrlInput = document.getElementById('hero-background-image-url');
        if (bgImageUrlInput) {
            bgImageUrlInput.addEventListener('input', () => {
                this.updateHeroPreview();
            });
        }
    }

    /**
     * Update Hero Preview
     */
    updateHeroPreview() {
        const title = document.getElementById('heroTitle').value || 'Photo Gallery';
        const description = document.getElementById('heroDescription').value || 'Explore our collection of memorable moments, school activities, and celebrations that showcase the vibrant life at Marigold School.';
        const buttonText = document.getElementById('heroButtonText').value || 'Explore Gallery';
        const backgroundImage = document.getElementById('hero-background-image-url').value;

        // Update preview elements
        document.getElementById('heroTitlePreview').textContent = title;
        document.getElementById('heroDescriptionPreview').textContent = description;
        document.getElementById('heroBtnPreview').textContent = buttonText;

        // Update background image
        const bgPreview = document.getElementById('heroBgPreview');
        if (backgroundImage) {
            bgPreview.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${backgroundImage})`;
        } else {
            bgPreview.style.backgroundImage = 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(/images/science_project.jpg)';
        }
    }

    /**
     * Show Hero Image Preview
     */
    showHeroImagePreview(imageUrl) {
        const preview = document.getElementById('heroImagePreview');
        const previewImg = document.getElementById('heroPreviewImg');
        
        previewImg.src = imageUrl;
        preview.style.display = 'block';
    }

    /**
     * Hide Hero Image Preview
     */
    hideHeroImagePreview() {
        const preview = document.getElementById('heroImagePreview');
        preview.style.display = 'none';
    }

    /**
     * Remove Hero Image
     */
    removeHeroImage() {
        document.getElementById('hero-background-image-url').value = '';
        if (this.heroImageUpload) {
            this.heroImageUpload.clearImage();
        }
        this.updateHeroPreview();
    }

    /**
     * Save Hero Section
     */
    /**
     * Initialize SaveButton component for a section
     */
    initializeSaveButton(section) {
        const saveButtonElement = document.querySelector('.save-section-btn, [data-action="save-hero-section"]');
        if (!saveButtonElement) {
            console.warn(`Save button not found for section: ${section}`);
            return null;
        }

        // Gallery typically has images, so set hasImages to true
        const hasImages = true;

        const saveButton = new SaveButton({
            target: saveButtonElement,
            dataSection: section,
            hasImages: hasImages,
            uploadProgress: {
                start: 10,
                end: 40
            },
            messages: {
                preparing: 'Preparing...',
                collecting: 'Collecting data...',
                saving: 'Saving to database...',
                success: 'Section saved successfully!'
            },
            percentages: {
                collecting: 45,
                saving: 75,
                success: 100
            },
            onSave: async (button) => {
                
                const token = localStorage.getItem('adminToken');
                if (!token) {
                    throw new Error('Authentication required');
                }

                button.setProgress('Collecting data...', 45);
                
                // Collect section data based on section type
                let sectionData;
                if (section === 'hero') {
                    // Check if there's a pending image upload
                    if (this.heroImageUpload && this.heroImageUpload.hasPendingUpload()) {
                        const file = this.heroImageUpload.elements.fileInput.files[0];
                        if (file) {
                            const uploadResult = await this.heroImageUpload.uploadFile(file);
                        }
                    }
                    
                    sectionData = {
                        title: document.getElementById('heroTitle')?.value || '',
                        description: document.getElementById('heroDescription')?.value || '',
                        buttonText: document.getElementById('heroButtonText')?.value || '',
                        backgroundImage: document.getElementById('hero-background-image-url')?.value || '',
                        enabled: true
                    };
                } else {
                    // Handle other gallery sections
                    sectionData = this.collectSectionData(section);
                }
                
                if (!sectionData) {
                    throw new Error('Unable to save - please check your input');
                }

                button.setProgress('Saving to database...', 75);
                
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 15000);
                
                let endpoint = '/api/content/gallery/hero';
                if (section !== 'hero') {
                    endpoint = `/api/content/gallery/${section}`;
                }
                
                const response = await fetch(endpoint, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(sectionData),
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                if (!response.ok) {
                    const errorData = await response.json();
                    let errorMessage = 'Failed to save section';
                    
                    if (response.status === 401) {
                        errorMessage = 'Authentication failed - please log in again';
                    } else if (response.status === 500) {
                        errorMessage = 'Server error - please try again later';
                    } else if (errorData.error) {
                        errorMessage = errorData.error;
                    }
                    
                    throw new Error(errorMessage);
                }

                return await response.json();
            },
            onSuccess: (result) => {
                if (window.NotificationManager) {
                    window.NotificationManager.show('success', 'Success', 'Section saved successfully!');
                }
                
                // Navigate back to gallery main after successful save
                setTimeout(() => {
                    this.loadGallery();
                }, 1500);
            },
            onError: (error) => {
                console.error('❌ Save error:', error);
                
                if (window.NotificationManager) {
                    window.NotificationManager.show('error', 'Error', `Failed to save section: ${error.message}`);
                }
            }
        });

        return saveButton;
    }

    /**
     * Collect section data for gallery sections
     */
    collectSectionData(section) {
        // This method will be implemented based on specific gallery section requirements
        return {};
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


    /**
     * Show loading state
     */
    showLoadingState(message = 'Loading...') {
        // Create or update loading overlay
        let loadingOverlay = document.getElementById('loading-overlay');
        if (!loadingOverlay) {
            loadingOverlay = document.createElement('div');
            loadingOverlay.id = 'loading-overlay';
            loadingOverlay.className = 'loading-overlay';
            document.body.appendChild(loadingOverlay);
        }

        loadingOverlay.innerHTML = `
            <div class="loading-content">
                <div class="loading-spinner"></div>
                <p>${message}</p>
            </div>
        `;
        loadingOverlay.style.display = 'flex';
    }

    /**
     * Hide loading state
     */
    hideLoadingState() {
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.style.display = 'none';
        }
    }

    /**
     * Show success notification
     */
    showSuccessNotification(message) {
        this.showNotification(message, 'success');
    }

    /**
     * Show error notification
     */
    showErrorNotification(message) {
        this.showNotification(message, 'error');
    }

    /**
     * Show notification
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i data-lucide="${type === 'success' ? 'check-circle' : type === 'error' ? 'x-circle' : 'info'}"></i>
                <span>${message}</span>
            </div>
        `;

        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);

        // Hide notification after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 5000);

        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    /**
     * Show video viewer modal
     */
    showVideoViewerModal(video) {
        
        // Remove existing modal if any
        const existingModal = document.getElementById('video-viewer-modal');
        if (existingModal) {
            existingModal.remove();
        }

        const modalHTML = `
            <div id="video-viewer-modal" class="modal-overlay" style="display: flex !important; opacity: 1 !important; visibility: visible !important; z-index: 999999 !important;">
                <div class="modal-content video-viewer-modal">
                    <div class="modal-header">
                        <h3 class="modal-title">${video.title || 'Video'}</h3>
                        <button class="modal-close-btn" id="close-video-viewer-modal">
                            <i data-lucide="x"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="video-viewer-container">
                            <video 
                                controls 
                                preload="metadata" 
                                class="video-player"
                                poster="${video.imageUrl || ''}"
                                style="width: 100%; max-height: 70vh; border-radius: 8px;">
                                <source src="${video.videoUrl}" type="video/mp4">
                                Your browser does not support the video tag.
                            </video>
                        </div>
                        <div class="video-details" style="margin-top: 20px;">
                            <h4>Video Details</h4>
                            <div class="detail-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 10px;">
                                <div class="detail-item">
                                    <strong>Title:</strong> ${video.title || 'N/A'}
                                </div>
                                <div class="detail-item">
                                    <strong>Category:</strong> ${video.category || 'N/A'}
                                </div>
                                <div class="detail-item">
                                    <strong>Album:</strong> ${video.albumId || 'N/A'}
                                </div>
                                <div class="detail-item">
                                    <strong>Uploaded:</strong> ${video.createdAt ? new Date(video.createdAt).toLocaleDateString() : 'N/A'}
                                </div>
                            </div>
                            ${video.description ? `
                                <div class="detail-item" style="margin-top: 15px;">
                                    <strong>Description:</strong>
                                    <p style="margin-top: 5px; color: #666;">${video.description}</p>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.initializeVideoViewerModal();
    }

    /**
     * Initialize video viewer modal
     */
    initializeVideoViewerModal() {
        const closeBtn = document.getElementById('close-video-viewer-modal');
        const modalOverlay = document.getElementById('video-viewer-modal');

        // Close button handler
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modalOverlay.remove();
            });
        }

        // Close on overlay click
        if (modalOverlay) {
            modalOverlay.addEventListener('click', (e) => {
                if (e.target === modalOverlay) {
                    modalOverlay.remove();
                }
            });
        }

        // Close on Escape key
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                modalOverlay.remove();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);

        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    /**
     * Show video edit modal
     */
    showVideoEditModal(video) {
        
        // Remove existing modal if any
        const existingModal = document.getElementById('video-edit-modal');
        if (existingModal) {
            existingModal.remove();
        }

        const modalHTML = `
            <div id="video-edit-modal" class="modal-overlay" style="display: flex !important; opacity: 1 !important; visibility: visible !important; z-index: 999999 !important;">
                <div class="modal-content video-edit-modal" style="max-width: 500px;">
                    <div class="modal-header">
                        <h3 class="modal-title">Edit Video Title</h3>
                        <button class="modal-close-btn" id="close-video-edit-modal">
                            <i data-lucide="x"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form id="video-edit-form">
                            <div class="form-group">
                                <label for="video-title">Video Title</label>
                                <input type="text" id="video-title" name="title" value="${video.title || ''}" class="form-control" required placeholder="Enter video title">
                            </div>
                            
                            <div class="form-group">
                                <label>Current Video</label>
                                <div class="current-video-preview" style="margin-top: 10px;">
                                    <video controls style="width: 100%; max-height: 200px; border-radius: 8px;">
                                        <source src="${video.videoUrl}" type="video/mp4">
                                        Your browser does not support the video tag.
                                    </video>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" id="close-video-edit-modal-btn">Cancel</button>
                        <button class="btn btn-primary" id="save-video-changes-btn">
                            <i data-lucide="save"></i>
                            Save Title
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.initializeVideoEditModal(video);
    }

    /**
     * Initialize video edit modal
     */
    initializeVideoEditModal(video) {
        const closeBtn = document.getElementById('close-video-edit-modal');
        const closeBtnFooter = document.getElementById('close-video-edit-modal-btn');
        const saveBtn = document.getElementById('save-video-changes-btn');
        const modalOverlay = document.getElementById('video-edit-modal');

        // Close button handlers
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modalOverlay.remove();
            });
        }

        if (closeBtnFooter) {
            closeBtnFooter.addEventListener('click', () => {
                modalOverlay.remove();
            });
        }

        // Close on overlay click
        if (modalOverlay) {
            modalOverlay.addEventListener('click', (e) => {
                if (e.target === modalOverlay) {
                    modalOverlay.remove();
                }
            });
        }

        // Save changes handler
        if (saveBtn) {
            saveBtn.addEventListener('click', async () => {
                await this.saveVideoChanges(video.id);
            });
        }

        // Close on Escape key
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                modalOverlay.remove();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);

        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    /**
     * Save video changes
     */
    async saveVideoChanges(videoId) {
        try {
            const form = document.getElementById('video-edit-form');
            const formData = new FormData(form);
            
            const title = formData.get('title').trim();
            
            // Validate title
            if (!title) {
                window.NotificationManager.show('error', 'Error', 'Video title is required');
                return;
            }

            const videoData = {
                title: title
            };


            const response = await fetch(`/api/content/gallery/videos/${videoId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(videoData)
            });

            const result = await response.json();

            if (result.success) {
                window.NotificationManager.show('success', 'Success', 'Video title updated successfully');
                
                // Close modal
                const modal = document.getElementById('video-edit-modal');
                if (modal) {
                    modal.remove();
                }
                
                // Refresh the video grid
                this.refreshVideoGrid();
            } else {
                throw new Error(result.error || 'Failed to update video title');
            }
        } catch (error) {
            console.error('❌ Error saving video changes:', error);
            window.NotificationManager.show('error', 'Error', `Failed to update video title: ${error.message}`);
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.galleryManager = new GalleryManager();
});

