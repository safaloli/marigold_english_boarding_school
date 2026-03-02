// Gallery Functionality
class GalleryManager {
    constructor() {
        this.currentFilter = 'all';
        this.galleryData = [];
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.galleryGrid = document.getElementById('gallery-grid');
        this.loadingState = document.getElementById('gallery-loading');
        
        
        // Ensure gallery grid is visible
        if (this.galleryGrid) {
            this.galleryGrid.style.display = 'grid';
            this.galleryGrid.style.visibility = 'visible';
            this.galleryGrid.style.opacity = '1';
        }
        
        this.init();
    }
    
    init() {
        this.setupFilterButtons();
        this.loadGalleryData();
        this.setupCarousel();
        this.setupStatsAnimation();
    }
    
    setupFilterButtons() {
        this.filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const filter = button.getAttribute('data-filter');
                this.filterGallery(filter);
            });
        });
    }
    
    filterGallery(filter) {
        this.currentFilter = filter;
        
        // Update active button
        this.filterButtons.forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.closest('.filter-btn').classList.add('active');
        
        // Filter gallery items
        const galleryItems = this.galleryGrid.querySelectorAll('.gallery-item');
        
        let visibleCount = 0;
        galleryItems.forEach(item => {
            const itemCategory = item.getAttribute('data-category');
            
            if (filter === 'all' || itemCategory === filter) {
                item.style.display = 'block';
                item.style.visibility = 'visible';
                item.style.opacity = '1';
                item.style.transform = 'scale(1)';
                item.classList.add('animate-in');
                visibleCount++;
            } else {
                item.style.display = 'none';
                item.style.visibility = 'hidden';
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                item.classList.remove('animate-in');
            }
        });
        
        
        // Update gallery count
        this.updateGalleryCount();
        
        // Add visual feedback
        const countElement = document.querySelector('.gallery-count');
        if (countElement) {
            countElement.textContent = `${visibleCount} photos`;
            countElement.style.color = 'var(--primary-color)';
            setTimeout(() => {
                countElement.style.color = '';
            }, 500);
        }
        
        // Add a temporary visual indicator
        const activeButton = event.target.closest('.filter-btn');
        if (activeButton) {
            activeButton.style.backgroundColor = 'var(--primary-color)';
            activeButton.style.color = 'white';
            setTimeout(() => {
                activeButton.style.backgroundColor = '';
                activeButton.style.color = '';
            }, 300);
        }
    }
    
    updateGalleryCount() {
        const visibleItems = this.galleryGrid.querySelectorAll('.gallery-item').length;
        const countElement = document.querySelector('.gallery-count');
        if (countElement) {
            countElement.textContent = `${visibleItems} photos`;
        }
    }
    
    loadGalleryData() {
        // Sample gallery data with placeholder images
        this.galleryData = [
            {
                id: 1,
                title: "Science Lab Experiments",
                description: "Students conducting chemistry experiments in our modern science laboratory",
                category: "academics",
                image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop&auto=format",
                date: "2024-01-15"
            },
            {
                id: 2,
                title: "Basketball Championship",
                description: "Our school team celebrating victory in the inter-school basketball tournament",
                category: "sports",
                image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&auto=format",
                date: "2024-02-20"
            },
            {
                id: 3,
                title: "Annual Day Performance",
                description: "Cultural dance performance during our annual day celebration",
                category: "cultural",
                image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop&auto=format",
                date: "2024-03-10"
            },
            {
                id: 4,
                title: "School Library",
                description: "Students studying in our well-equipped library with modern facilities",
                category: "campus",
                image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop&auto=format",
                date: "2024-01-25"
            },
            {
                id: 5,
                title: "Art Class",
                description: "Students expressing creativity in our art and craft classes",
                category: "student-life",
                image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&h=300&fit=crop&auto=format",
                date: "2024-02-05"
            },
            {
                id: 6,
                title: "Mathematics Competition",
                description: "Students participating in the district mathematics competition",
                category: "academics",
                image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop&auto=format",
                date: "2024-02-15"
            },
            {
                id: 7,
                title: "Football Match",
                description: "Exciting football match between school houses",
                category: "sports",
                image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&auto=format",
                date: "2024-01-30"
            },
            {
                id: 8,
                title: "Music Concert",
                description: "Annual music concert featuring student performances",
                category: "cultural",
                image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop&auto=format",
                date: "2024-03-05"
            },
            {
                id: 9,
                title: "Computer Lab",
                description: "Students learning programming in our computer laboratory",
                category: "campus",
                image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop&auto=format",
                date: "2024-02-10"
            },
            {
                id: 10,
                title: "Student Council Meeting",
                description: "Student council members discussing school activities",
                category: "student-life",
                image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&h=300&fit=crop&auto=format",
                date: "2024-01-20"
            },
            {
                id: 11,
                title: "Physics Experiment",
                description: "Students learning about electricity and circuits",
                category: "academics",
                image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop&auto=format",
                date: "2024-02-25"
            },
            {
                id: 12,
                title: "Swimming Competition",
                description: "Annual swimming competition at our school pool",
                category: "sports",
                image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&auto=format",
                date: "2024-03-01"
            },
            {
                id: 13,
                title: "Drama Performance",
                description: "School play performance by drama club students",
                category: "cultural",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&auto=format",
                date: "2024-02-28"
            },
            {
                id: 14,
                title: "School Auditorium",
                description: "Our state-of-the-art auditorium for events and performances",
                category: "campus",
                image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop&auto=format",
                date: "2024-01-10"
            },
            {
                id: 15,
                title: "Debate Competition",
                description: "Students participating in inter-school debate competition",
                category: "student-life",
                image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&h=300&fit=crop&auto=format",
                date: "2024-02-12"
            },
            {
                id: 16,
                title: "Chemistry Lab",
                description: "Students working on chemistry experiments",
                category: "academics",
                image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop&auto=format",
                date: "2024-01-18"
            },
            {
                id: 17,
                title: "Athletics Meet",
                description: "Annual athletics meet with track and field events",
                category: "sports",
                image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&auto=format",
                date: "2024-02-22"
            },
            {
                id: 18,
                title: "Poetry Recitation",
                description: "Students reciting poems during cultural week",
                category: "cultural",
                image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop&auto=format",
                date: "2024-03-08"
            },
            {
                id: 19,
                title: "School Garden",
                description: "Students tending to our beautiful school garden",
                category: "campus",
                image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop&auto=format",
                date: "2024-01-28"
            },
            {
                id: 20,
                title: "Science Fair",
                description: "Students showcasing their science projects",
                category: "student-life",
                image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&h=300&fit=crop&auto=format",
                date: "2024-02-08"
            }
        ];
        
        this.renderGallery();
    }
    
    renderGallery() {
        if (!this.galleryGrid) {
            return;
        }
        
        
        // Ensure gallery grid is visible
        this.galleryGrid.style.display = 'grid';
        this.galleryGrid.style.visibility = 'visible';
        this.galleryGrid.style.opacity = '1';
        
        // Hide loading state
        if (this.loadingState) {
            this.loadingState.style.display = 'none';
        }
        
        // Don't replace existing HTML, just work with what's there
        const items = this.galleryGrid.querySelectorAll('.gallery-item');
        
        // Add data attributes and click event listeners to existing items
        items.forEach((item, index) => {
            // Skip if already processed
            if (item.hasAttribute('data-lightbox-processed')) {
                return;
            }
            
            // Add data attributes for modal functionality
            const img = item.querySelector('img');
            const overlay = item.querySelector('.gallery-overlay h3');
            const description = item.querySelector('.gallery-overlay p');
            
            if (img && overlay) {
                item.setAttribute('data-image', img.src);
                item.setAttribute('data-title', overlay.textContent);
                item.setAttribute('data-description', description ? description.textContent : '');
                
                // Get the actual category from the item's existing data-category or className
                let category = item.getAttribute('data-category');
                if (!category) {
                    // Try to get category from className
                    const classList = Array.from(item.classList);
                    const categoryClass = classList.find(cls => 
                        ['academics', 'sports', 'cultural', 'campus', 'student-life'].includes(cls)
                    );
                    category = categoryClass || 'gallery';
                }
                item.setAttribute('data-category', category);
                
                // Mark as processed
                item.setAttribute('data-lightbox-processed', 'true');
                
                // Add click event listener for lightbox
                item.addEventListener('click', () => {
                    const image = item.getAttribute('data-image');
                    const title = item.getAttribute('data-title');
                    const desc = item.getAttribute('data-description');
                    const category = item.getAttribute('data-category');
                    
                    if (window.galleryManager) {
                        window.galleryManager.openLightbox(image, title, desc, category);
                    } else {
                    }
                });
            }
        });
        
        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        // Update count
        this.updateGalleryCount();
    }
    
    getCategoryName(category) {
        const categories = {
            'academics': '📚 Academics',
            'sports': '⚽ Sports',
            'cultural': '🎭 Cultural',
            'campus': '🏫 Campus',
            'student-life': '✨ Student Life'
        };
        return categories[category] || category;
    }
    
    getPlaceholderImage(category) {
        const placeholders = {
            'academics': 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop&auto=format',
            'sports': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&auto=format',
            'cultural': 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop&auto=format',
            'campus': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop&auto=format',
            'student-life': 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&h=300&fit=crop&auto=format'
        };
        return placeholders[category] || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop&auto=format';
    }
    
    createSampleCollection(category, imageUrl, title, description) {
        const samplePhotos = {
            'academics': [
                { id: 1, title: 'Science Lab Experiments', description: 'Students conducting chemistry experiments', image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop&auto=format' },
                { id: 2, title: 'Mathematics Competition', description: 'Students participating in math competition', image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&h=300&fit=crop&auto=format' },
                { id: 3, title: 'Physics Laboratory', description: 'Students learning about electricity and circuits', image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=300&fit=crop&auto=format' },
                { id: 4, title: 'Computer Lab Session', description: 'Students learning programming and coding', image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop&auto=format' },
                { id: 5, title: 'Chemistry Experiments', description: 'Hands-on chemistry experiments in the lab', image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400&h=300&fit=crop&auto=format' }
            ],
            'sports': [
                { id: 1, title: 'Basketball Championship', description: 'School basketball team in action', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&auto=format' },
                { id: 2, title: 'Football Match', description: 'Exciting football match between school houses', image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=300&fit=crop&auto=format' },
                { id: 3, title: 'Swimming Competition', description: 'Annual swimming competition at school pool', image: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400&h=300&fit=crop&auto=format' },
                { id: 4, title: 'Athletics Meet', description: 'Track and field events and competitions', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&auto=format' },
                { id: 5, title: 'Sports Training', description: 'Students practicing various sports activities', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&auto=format' }
            ],
            'cultural': [
                { id: 1, title: 'Annual Day Performance', description: 'Cultural dance performance during annual day', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop&auto=format' },
                { id: 2, title: 'Music Concert', description: 'Annual music concert featuring student performances', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop&auto=format' },
                { id: 3, title: 'Drama Performance', description: 'School play performance by drama club students', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&auto=format' },
                { id: 4, title: 'Art Exhibition', description: 'Creative artwork displayed by students', image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop&auto=format' },
                { id: 5, title: 'Poetry Recitation', description: 'Students reciting poems during cultural week', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop&auto=format' }
            ],
            'campus': [
                { id: 1, title: 'School Library', description: 'Students studying in our well-equipped library', image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop&auto=format' },
                { id: 2, title: 'School Auditorium', description: 'State-of-the-art auditorium for events', image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&h=300&fit=crop&auto=format' },
                { id: 3, title: 'School Garden', description: 'Beautiful campus garden and green spaces', image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop&auto=format' },
                { id: 4, title: 'Playground', description: 'Students enjoying outdoor activities', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&auto=format' },
                { id: 5, title: 'Cafeteria', description: 'Students having lunch in the school cafeteria', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop&auto=format' }
            ],
            'student-life': [
                { id: 1, title: 'Art Class', description: 'Students expressing creativity in art classes', image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&h=300&fit=crop&auto=format' },
                { id: 2, title: 'Student Council Meeting', description: 'Student council members discussing activities', image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop&auto=format' },
                { id: 3, title: 'Debate Competition', description: 'Students participating in debate competition', image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&h=300&fit=crop&auto=format' },
                { id: 4, title: 'Science Fair', description: 'Students showcasing their science projects', image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop&auto=format' },
                { id: 5, title: 'School Assembly', description: 'Morning assembly with students and teachers', image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&h=300&fit=crop&auto=format' }
            ]
        };
        
        // Start with the clicked photo
        let collection = [{
            id: Date.now(),
            title: title,
            description: description,
            category: category,
            image: imageUrl,
            date: new Date().toISOString().split('T')[0]
        }];
        
        // Add more photos from the same category
        const categoryPhotos = samplePhotos[category] || samplePhotos['academics'];
        collection = collection.concat(categoryPhotos.slice(0, 4)); // Add 4 more photos
        
        return collection;
    }
    
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    }
    
    openLightbox(imageUrl, title, description, category) {
        
        // Get all photos from the same category
        let collectionPhotos = this.galleryData.filter(item => item.category === category);
        let currentIndex = collectionPhotos.findIndex(item => item.image === imageUrl);
        
        
        // If no collection photos found or current photo not found, create a collection with multiple photos
        if (collectionPhotos.length === 0 || currentIndex === -1) {
            collectionPhotos = this.createSampleCollection(category, imageUrl, title, description);
            currentIndex = 0;
        }
        
        
        // Create lightbox HTML
        const lightboxHTML = `
            <div class="gallery-lightbox" id="gallery-lightbox">
                <div class="lightbox-content">
                    <div class="lightbox-main-container">
                        <button class="lightbox-close" id="lightbox-close">
                        <i data-lucide="x"></i>
                    </button>
                        
                        <button class="lightbox-nav-btn prev" id="lightbox-prev" ${currentIndex === 0 ? 'disabled' : ''}>
                            <i data-lucide="chevron-left"></i>
                        </button>
                        
                        <button class="lightbox-nav-btn next" id="lightbox-next" ${currentIndex === collectionPhotos.length - 1 ? 'disabled' : ''}>
                            <i data-lucide="chevron-right"></i>
                        </button>
                        
                        <div class="lightbox-main-image-container">
                            <img src="${imageUrl}" alt="${title}" class="lightbox-main-image" id="lightbox-main-image">
                            <div class="lightbox-image-overlay">
                                <h3 class="lightbox-image-title">${title}</h3>
                            </div>
                        </div>
                    </div>
                    
                    <div class="lightbox-thumbnails-container">
                        <div class="lightbox-thumbnails">
                            ${collectionPhotos.map((photo, index) => `
                                <div class="lightbox-thumbnail ${index === currentIndex ? 'active' : ''}" data-index="${index}">
                                    <div class="lightbox-thumbnail-content">
                                        <img src="${photo.image}" alt="${photo.title}" onerror="this.src='${this.getPlaceholderImage(photo.category)}'">
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Add lightbox to body
        document.body.insertAdjacentHTML('beforeend', lightboxHTML);
        
        // Get lightbox elements
        const lightbox = document.getElementById('gallery-lightbox');
        const lightboxClose = document.getElementById('lightbox-close');
        
        // Store collection data for navigation
        this.currentLightboxCollection = {
            photos: collectionPhotos,
            currentIndex: currentIndex,
            category: category
        };
        
        // Add event listeners
        this.setupLightboxEventListeners();
        
        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        // Show lightbox with animation
        setTimeout(() => {
            if (lightbox) {
                lightbox.classList.add('show');
                
                // Debug: Check if thumbnails are visible
                const thumbnails = lightbox.querySelectorAll('.lightbox-thumbnail');
            }
        }, 10);
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        // Add keyboard navigation
        this.setupKeyboardNavigation();
        
        // Add touch/swipe support for mobile
        this.setupTouchNavigation();
    }
    
    setupLightboxEventListeners() {
        const lightbox = document.getElementById('gallery-lightbox');
        if (!lightbox) return;
        
        // Close button
        const closeBtn = document.getElementById('lightbox-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeLightbox());
        }
        
        // Background click to close
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                this.closeLightbox();
            }
        });
        
        // Navigation buttons
        const prevBtn = document.getElementById('lightbox-prev');
        const nextBtn = document.getElementById('lightbox-next');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.navigateLightbox('prev'));
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.navigateLightbox('next'));
        }
        
        // Thumbnail clicks
        const thumbnails = lightbox.querySelectorAll('.lightbox-thumbnail');
        thumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('click', () => {
                const index = parseInt(thumbnail.getAttribute('data-index'));
                this.navigateToLightboxPhoto(index);
            });
        });
    }
    
    setupKeyboardNavigation() {
        this.keyboardHandler = (e) => {
            if (!this.currentLightboxCollection) return;
            
            switch(e.key) {
                case 'Escape':
                    this.closeLightbox();
                    break;
                case 'ArrowLeft':
                    this.navigateLightbox('prev');
                    break;
                case 'ArrowRight':
                    this.navigateLightbox('next');
                    break;
            }
        };
        
        document.addEventListener('keydown', this.keyboardHandler);
    }
    
    setupTouchNavigation() {
        const lightbox = document.getElementById('gallery-lightbox');
        if (!lightbox) return;
        
        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;
        
        const handleTouchStart = (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        };
        
        const handleTouchEnd = (e) => {
            endX = e.changedTouches[0].clientX;
            endY = e.changedTouches[0].clientY;
            
            const diffX = startX - endX;
            const diffY = startY - endY;
            
            // Only trigger swipe if horizontal movement is greater than vertical
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    // Swipe left - next image
                    this.navigateLightbox('next');
                } else {
                    // Swipe right - previous image
                    this.navigateLightbox('prev');
                }
            }
        };
        
        lightbox.addEventListener('touchstart', handleTouchStart, { passive: true });
        lightbox.addEventListener('touchend', handleTouchEnd, { passive: true });
    }
    
    closeLightbox() {
        const lightbox = document.getElementById('gallery-lightbox');
        if (lightbox) {
            lightbox.classList.remove('show');
            setTimeout(() => {
                lightbox.remove();
                document.body.style.overflow = '';
                this.currentLightboxCollection = null;
                
                // Remove keyboard event listener
                if (this.keyboardHandler) {
                    document.removeEventListener('keydown', this.keyboardHandler);
                    this.keyboardHandler = null;
                }
            }, 300);
        }
    }
    
    navigateLightbox(direction) {
        if (!this.currentLightboxCollection) return;
        
        const { photos, currentIndex } = this.currentLightboxCollection;
        let newIndex;
        
        if (direction === 'prev') {
            newIndex = currentIndex > 0 ? currentIndex - 1 : photos.length - 1;
        } else {
            newIndex = currentIndex < photos.length - 1 ? currentIndex + 1 : 0;
        }
        
        this.navigateToLightboxPhoto(newIndex);
    }
    
    navigateToLightboxPhoto(index) {
        if (!this.currentLightboxCollection) return;
        
        const { photos, category } = this.currentLightboxCollection;
        const photo = photos[index];
        
        if (!photo) return;
        
        // Update current index
        this.currentLightboxCollection.currentIndex = index;
        
        // Update main image with fade effect
        const mainImage = document.getElementById('lightbox-main-image');
        if (mainImage) {
            mainImage.classList.add('loading');
            mainImage.style.opacity = '0.5';
            
            // Preload the new image
            const img = new Image();
            img.onload = () => {
                mainImage.src = photo.image;
                mainImage.alt = photo.title;
                mainImage.style.opacity = '1';
                mainImage.classList.remove('loading');
            };
            img.onerror = () => {
                mainImage.src = this.getPlaceholderImage(photo.category);
                mainImage.alt = photo.title;
                mainImage.style.opacity = '1';
                mainImage.classList.remove('loading');
            };
            img.src = photo.image;
        }
        
        // Update thumbnails
        const thumbnails = document.querySelectorAll('.lightbox-thumbnail');
        thumbnails.forEach((thumb, thumbIndex) => {
            thumb.classList.toggle('active', thumbIndex === index);
        });
        
        // Update navigation buttons
        const prevBtn = document.getElementById('lightbox-prev');
        const nextBtn = document.getElementById('lightbox-next');
        
        if (prevBtn) {
            prevBtn.disabled = index === 0;
        }
        if (nextBtn) {
            nextBtn.disabled = index === photos.length - 1;
        }
        
        // Update title
        const title = document.querySelector('.lightbox-image-title');
        if (title) title.textContent = photo.title;
        
        // Scroll active thumbnail into view
        const activeThumbnail = document.querySelector('.lightbox-thumbnail.active');
        if (activeThumbnail) {
            activeThumbnail.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'nearest', 
                inline: 'center' 
            });
        }
    }
    
    closeModal() {
        const modal = document.getElementById('gallery-modal');
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.remove();
                document.body.style.overflow = '';
                this.currentCollection = null;
            }, 300);
        }
    }
    
    navigateCollection(direction) {
        if (!this.currentCollection) return;
        
        const { photos, currentIndex } = this.currentCollection;
        let newIndex;
        
        if (direction === 'prev') {
            newIndex = currentIndex > 0 ? currentIndex - 1 : photos.length - 1;
        } else {
            newIndex = currentIndex < photos.length - 1 ? currentIndex + 1 : 0;
        }
        
        this.navigateToPhoto(newIndex);
    }
    
    navigateToPhoto(index) {
        if (!this.currentCollection) return;
        
        const { photos, category } = this.currentCollection;
        const photo = photos[index];
        
        if (!photo) return;
        
        // Update current index
        this.currentCollection.currentIndex = index;
        
        // Update main image
        const mainImage = document.getElementById('modal-main-image');
        if (mainImage) {
            mainImage.src = photo.image;
            mainImage.alt = photo.title;
        }
        
        // Update counter
        const counter = document.querySelector('.photo-counter');
        if (counter) {
            counter.textContent = `${index + 1} of ${photos.length}`;
        }
        
        // Update thumbnails
        const thumbnails = document.querySelectorAll('.thumbnail');
        thumbnails.forEach((thumb, thumbIndex) => {
            thumb.classList.toggle('active', thumbIndex === index);
        });
        
        // Update navigation buttons
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        
        if (prevBtn) {
            prevBtn.disabled = index === 0;
        }
        if (nextBtn) {
            nextBtn.disabled = index === photos.length - 1;
        }
    }
    
    setupCarousel() {
        const carousel = document.getElementById('moments-carousel');
        if (!carousel) return;
        
        const track = carousel.querySelector('.carousel-track');
        const slides = carousel.querySelectorAll('.moment-slide');
        const prevBtn = carousel.querySelector('.carousel-btn.prev');
        const nextBtn = carousel.querySelector('.carousel-btn.next');
        const dots = carousel.querySelectorAll('.carousel-dots .dot');
        
        let currentSlide = 0;
        const slideCount = slides.length;
        
        function updateCarousel() {
            track.style.transform = `translateX(-${currentSlide * 100}%)`;
            
            // Update dots
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentSlide);
            });
        }
        
        function nextSlide() {
            currentSlide = (currentSlide + 1) % slideCount;
            updateCarousel();
        }
        
        function prevSlide() {
            currentSlide = (currentSlide - 1 + slideCount) % slideCount;
            updateCarousel();
        }
        
        // Event listeners
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
        
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentSlide = index;
                updateCarousel();
            });
        });
        
        // Auto-play
        setInterval(nextSlide, 5000);
    }
    
    setupStatsAnimation() {
        const stats = document.querySelectorAll('.stat-number');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const finalValue = parseInt(target.getAttribute('data-target'));
                    this.animateNumber(target, 0, finalValue, 2000);
                    observer.unobserve(target);
                }
            });
        }, { threshold: 0.5 });
        
        stats.forEach(stat => observer.observe(stat));
    }
    
    animateNumber(element, start, end, duration) {
        const startTime = performance.now();
        
        function updateNumber(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const current = Math.floor(start + (end - start) * progress);
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            }
        }
        
        requestAnimationFrame(updateNumber);
    }
    
    // Manual function to force show gallery
    forceShowGallery() {
        if (this.galleryGrid) {
            this.galleryGrid.style.display = 'grid';
            this.galleryGrid.style.visibility = 'visible';
            this.galleryGrid.style.opacity = '1';
            return true;
        }
        return false;
    }
}

// Initialize gallery when DOM is loaded
let galleryManager;

document.addEventListener('DOMContentLoaded', function() {
    try {
    galleryManager = new GalleryManager();
    window.galleryManager = galleryManager;
    } catch (error) {
    }
});

// Also initialize if DOM is already loaded
if (document.readyState === 'loading') {
    // DOM is still loading, wait for DOMContentLoaded
} else {
    // DOM is already loaded, initialize immediately
    try {
    galleryManager = new GalleryManager();
    window.galleryManager = galleryManager;
    } catch (error) {
    }
}
