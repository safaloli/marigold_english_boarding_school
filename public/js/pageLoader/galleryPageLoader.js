class GalleryPageLoader {
    constructor() {
        this.content = null;
        this.galleryData = [];
        this.videoAlbumsData = [];
        this.featuredMoments = [];
        this.heroData = {};
        this.currentVideoCollection = null;
        this.filteredGalleryData = [];
        this.filteredVideoData = [];
        this.currentFilters = {
            search: ''
        };
        this.currentVideoFilters = {
            search: ''
        };
        this.displayedPhotoCount = 6;
        this.displayedVideoCount = 6;
        this.init();
    }

    async init() {
        await this.loadContent();
        // Gallery page handles loading states in individual render methods
        this.renderContent();
        this.setupEventListeners();
    }

    async loadContent() {
        try {
            
            // Load gallery hero section data
            // Add cache-busting to always get fresh data
            const cacheBuster = `?t=${Date.now()}`;
            const heroResponse = await fetch(`/api/content/gallery/hero${cacheBuster}`, {
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                }
            });
            if (heroResponse.ok) {
                const heroData = await heroResponse.json();
                if (heroData.success && heroData.hero) {
                    this.heroData = heroData.hero;
                }
            }
            
            // Load photo albums data for photo-gallery-section
            const cacheBuster2 = `?t=${Date.now()}`;
            const photoAlbumsResponse = await fetch(`/api/content/gallery/photo-albums${cacheBuster2}`, {
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                }
            });
            if (photoAlbumsResponse.ok) {
                const photoAlbumsData = await photoAlbumsResponse.json();
                if (photoAlbumsData.success && photoAlbumsData.albums) {
                    this.galleryData = photoAlbumsData.albums
                        .map(album => {
                            return {
                                id: album.id,
                                title: album.title,
                                category: album.category || 'general',
                                image: album.imageUrl || album.coverImage,
                                description: album.description || '',
                                count: album.photoCount || album.itemCount || (album.items ? album.items.length : 0),
                                type: 'photoAlbum'
                            };
                        })
                        .filter(album => (album.count || 0) > 0)
                }
            }

            // Load video albums data for video-gallery-section
            const cacheBuster3 = `?t=${Date.now()}`;
            const videoAlbumsResponse = await fetch(`/api/content/gallery/video-albums${cacheBuster3}`, {
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                }
            });
            if (videoAlbumsResponse.ok) {
                const videoAlbumsData = await videoAlbumsResponse.json();
                if (videoAlbumsData.success && videoAlbumsData.albums) {
                    this.videoAlbumsData = videoAlbumsData.albums.
                        map(album => {
                            // Use videoCount (excludes featured) or fall back to itemCount
                            console.log(album)
                            const count = album.itemCount || 0;
                            return {
                                id: album.id,
                                title: album.title,
                                category: album.category || 'general',
                                image: album.imageUrl,
                                description: album.description || '',
                                count: count,
                                type: 'videoAlbum',
                                videos: album.items || []
                            };
                        })
                        .filter(album => (album.count || 0) > 0);
                }
            }

            // Load featured moments data
            const cacheBuster4 = `?t=${Date.now()}`;
            const momentsResponse = await fetch(`/api/content/featured-moments${cacheBuster4}`, {
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                }
            });
            if (momentsResponse.ok) {
                const momentsData = await momentsResponse.json();
                if (momentsData.success && momentsData.content) {
                    this.featuredMoments = momentsData.content;
                }
            }


        } catch (error) {
            console.error('❌ Error loading gallery content:', error);
            this.galleryData = [];
            this.videoAlbumsData = [];
            this.featuredMoments = [];
        }
        
        // Always hide loading placeholders after attempt
        setTimeout(() => {
            this.hideLoadingPlaceholders();
        }, 1000);
    }

    hideLoadingPlaceholders() {
        // Hide gallery loading
        const galleryLoading = document.getElementById('gallery-loading');
        if (galleryLoading) {
            galleryLoading.style.display = 'none';
        }

    }

    renderContent() {
        this.renderHeroSection();
        this.renderFeaturedBanner();
        this.renderGalleryGrid();
        this.renderVideoGallery();
        this.renderCTASection();
    }

    renderHeroSection() {
        // Only render if hero section is enabled
        if (!this.heroData.enabled) {
            const heroSection = document.querySelector('.gallery-hero');
            if (heroSection) {
                heroSection.style.display = 'none';
            }
            return;
        }

        // Get elements from the dynamic section
        const heroTitle = document.querySelector('#hero-dynamic .hero-title');
        const heroDescription = document.querySelector('#hero-dynamic .hero-description');
        const heroButton = document.querySelector('#hero-dynamic .hero-btn');
        const heroBg = document.querySelector('#hero-dynamic .hero-bg');

        // CRITICAL: Clear static content first (while hidden)
        if (heroTitle) heroTitle.textContent = '';
        if (heroDescription) heroDescription.textContent = '';
        if (heroButton) heroButton.textContent = '';

        // NOW populate with database content
        if (heroTitle && this.heroData.title) {
            heroTitle.textContent = this.heroData.title;
        }

        if (heroDescription && this.heroData.description) {
            heroDescription.textContent = this.heroData.description;
        }

        if (heroButton && this.heroData.buttonText) {
            heroButton.textContent = this.heroData.buttonText;
        }

        if (heroBg && this.heroData.backgroundImage) {
            heroBg.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${this.heroData.backgroundImage})`;
        }

        // Hide loading placeholder and show dynamic content
        const loadingEl = document.getElementById('hero-loading');
        const dynamicEl = document.getElementById('hero-dynamic');
        
        if (loadingEl) {
            loadingEl.style.display = 'none';
        }
        if (dynamicEl) {
            dynamicEl.style.display = 'block';
        }
    }

    renderFeaturedBanner() {
        const carouselContainer = document.getElementById('featured-banner-carousel');
        if (!carouselContainer) return;


        // Hide loading placeholder
        const loadingPlaceholder = document.getElementById('featured-banner-loading');
        if (loadingPlaceholder) {
            loadingPlaceholder.style.display = 'none';
        }

        if (this.featuredMoments.length === 0) {
            const bannerSection = document.querySelector('.featured-album-banner');
            if (bannerSection) {
                bannerSection.style.display = 'none';
            }
            return;
        }

        // Clear existing content and any duplicate navigation elements
        carouselContainer.innerHTML = '';
        
        // Also clear any remaining navigation elements that might be outside the container
        const globalNav = document.querySelectorAll('.simple-prev, .simple-next, .simple-dots');
        globalNav.forEach(nav => nav.remove());

        // Create featured banner items from database data
        this.featuredMoments.forEach((moment, index) => {
            const bannerItem = this.createFeaturedBannerItem(moment, index);
            carouselContainer.appendChild(bannerItem);
        });

        // Initialize carousel after content is loaded
        this.initializeFeaturedBannerCarousel();
    }

    createFeaturedBannerItem(moment, index) {
        const bannerItem = document.createElement('div');
        bannerItem.className = `featured-banner-item ${index === 0 ? '' : 'd-none'}`;
        bannerItem.style.cssText = `
            ${index === 0 ? 'display: block; opacity: 1; transform: translateX(0px);' : 'display: none; opacity: 0; transform: translateX(100%);'}
            transition: 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        `;

        // Get category display name and determine yearbook cover style
        const categoryDisplay = this.getCategoryDisplayName(moment.category || 'general');
        const yearbookStyle = this.getYearbookCoverStyle(moment.category || 'general');
        
        // Use year from database or fallback to current year
        const displayYear = moment.year || new Date().getFullYear();
        
        // Get primary tag from tags field or use category as fallback
        let primaryTag;
        if (moment.tags && moment.tags.trim()) {
            // If tags is a string, use it directly
            primaryTag = moment.tags.toUpperCase().replace(/-/g, ' ');
        } else if (moment.tags && Array.isArray(moment.tags) && moment.tags.length > 0) {
            // If tags is an array, use the first tag
            primaryTag = moment.tags[0].toUpperCase();
        } else {
            // Fallback to category
            primaryTag = categoryDisplay.toUpperCase();
        }

        // Create banner data object
        const bannerData = {
            displayYear: displayYear,
            primaryTag: primaryTag,
            yearbookStyle: yearbookStyle
        };

        bannerItem.innerHTML = `
            <div class="d-flex justify-content-between">
                <div class="banner-content">
                    <h2 class="banner-title">${moment.title}</h2>
                    <p class="banner-description">${moment.description || 'Discover amazing moments from our school events and activities.'}</p>
                    <button class="banner-btn" data-moment-id="${moment.id}">View Album</button>
                </div>
                <div class="banner-image">
                    <div class="yearbook-cover ${yearbookStyle}">
                        <div class="yearbook-text">${primaryTag}</div>
                        <div class="yearbook-subtitle">${displayYear}</div>
                    </div>
                </div>
            </div>
        `;

        // Add click event to banner button
        const bannerBtn = bannerItem.querySelector('.banner-btn');
        bannerBtn.addEventListener('click', () => {
            this.handleFeaturedBannerClick(moment);
        });

        return bannerItem;
    }

    getYearbookCoverStyle(category) {
        const categoryMap = {
            'science': 'science',
            'sports': 'sports', 
            'cultural': 'cultural',
            'academics': 'academics',
            'arts': 'cultural',
            'graduation': 'academics',
            'campus': 'cultural'
        };
        return categoryMap[category.toLowerCase()] || 'cultural';
    }

    async handleFeaturedBannerClick(moment) {
        
        try {
            // Get the album ID from the featured moment
            const albumId = moment.albumId;
            if (!albumId) {
                console.error('❌ No album ID found for featured moment:', moment.title);
                return;
            }


            // Fetch photos from the album
            const cacheBuster = `?t=${Date.now()}`;
            const response = await fetch(`/api/content/gallery/album/${albumId}/photos${cacheBuster}`, {
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                }
            });
            const data = await response.json();

            if (data.success && data.photos && data.photos.length > 0) {
                
                // Filter out featured moments (if any are mixed in)
                const albumPhotos = data.photos.filter(photo => !photo.isFeatured);
                
                if (albumPhotos.length > 0) {
                    // Open the lightbox with the album photos
                    this.openPhotoLightbox(albumPhotos, 0, moment.title);
                } else {
                    this.showNoPhotosMessage(moment.title);
                }
            } else {
                this.showNoPhotosMessage(moment.title);
            }
        } catch (error) {
            console.error('❌ Error fetching album photos:', error);
            this.showNoPhotosMessage(moment.title);
        }
    }

    initializeFeaturedBannerCarousel() {
        
        // Wait a bit for DOM to be ready
        setTimeout(() => {
            try {
                // Try to use Owl Carousel if available
                if (typeof $ !== 'undefined' && typeof $.fn.owlCarousel !== 'undefined') {
                    $('#featured-banner-carousel').owlCarousel({
                        items: 1,
                        loop: true,
                        autoplay: true,
                        autoplayTimeout: 5000,
                        autoplayHoverPause: true,
                        nav: true,
                        navText: ['', ''],
                        dots: true,
                        smartSpeed: 800,
                        animateOut: 'slideOutLeft',
                        animateIn: 'slideInRight'
                    });
                } else {
                    this.createSimpleFeaturedBannerCarousel();
                }
            } catch (error) {
                console.error('❌ Error initializing featured banner carousel:', error);
                this.createSimpleFeaturedBannerCarousel();
            }
        }, 100);
    }

    createSimpleFeaturedBannerCarousel() {
        const items = document.querySelectorAll('.featured-banner-item');
        const totalItems = items.length;
        
        if (totalItems === 0) {
            return;
        }

        // Check if carousel is already initialized
        const existingCarousel = document.querySelector('.simple-prev');
        if (existingCarousel) {
            return;
        }

        let currentItem = 0;

        // Hide all items except first
        items.forEach((item, index) => {
            item.style.display = index === 0 ? 'block' : 'none';
            item.style.opacity = index === 0 ? '1' : '0';
            item.style.transform = index === 0 ? 'translateX(0)' : 'translateX(100%)';
            item.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        });

        // Create navigation buttons
        const prevBtn = document.createElement('button');
        prevBtn.className = 'simple-prev';
        prevBtn.innerHTML = '‹';
        prevBtn.style.cssText = `
            position: absolute;
            left: -25px;
            top: 50%;
            transform: translateY(-50%);
            width: 50px;
            height: 50px;
            border-radius: 50%;
            border: none;
            background: rgba(255, 255, 255, 0.9);
            color: rgb(19, 127, 236);
            font-size: 24px;
            cursor: pointer;
            z-index: 10;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        `;

        const nextBtn = document.createElement('button');
        nextBtn.className = 'simple-next';
        nextBtn.innerHTML = '›';
        nextBtn.style.cssText = `
            position: absolute;
            right: -25px;
            top: 50%;
            transform: translateY(-50%);
            width: 50px;
            height: 50px;
            border-radius: 50%;
            border: none;
            background: rgba(255, 255, 255, 0.9);
            color: rgb(19, 127, 236);
            font-size: 24px;
            cursor: pointer;
            z-index: 10;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        `;

        const carousel = document.getElementById('featured-banner-carousel');
        
        // More aggressive cleanup - remove ALL navigation elements
        const existingNav = carousel.querySelectorAll('.simple-prev, .simple-next, .simple-dots');
        existingNav.forEach(nav => {
            nav.remove();
        });
        
        // Also clear any Owl Carousel generated elements
        const owlNav = carousel.querySelectorAll('.owl-nav, .owl-dots, .owl-prev, .owl-next');
        owlNav.forEach(nav => nav.remove());
        
        carousel.style.position = 'relative';
        carousel.appendChild(prevBtn);
        carousel.appendChild(nextBtn);

        // Create dots
        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'simple-dots';
        dotsContainer.style.cssText = `
            text-align: center;
            margin-top: 2rem;
        `;

        for (let i = 0; i < totalItems; i++) {
            const dot = document.createElement('span');
            dot.className = `simple-dot ${i === 0 ? 'active' : ''}`;
            dot.style.cssText = `
                width: 12px;
                height: 12px;
                border-radius: 50%;
                background: ${i === 0 ? 'rgb(19, 127, 236)' : 'rgb(222, 226, 230)'};
                margin: 0 5px;
                cursor: pointer;
                display: inline-block;
                transition: 0.3s;
            `;
            dot.addEventListener('click', () => this.goToFeaturedBannerSlide(i, items, dotsContainer));
            dotsContainer.appendChild(dot);
        }

        carousel.appendChild(dotsContainer);

        // Navigation functions
        const goToSlide = (index) => {
            this.goToFeaturedBannerSlide(index, items, dotsContainer);
            currentItem = index;
        };

        prevBtn.addEventListener('click', () => {
            const prevIndex = currentItem === 0 ? totalItems - 1 : currentItem - 1;
            goToSlide(prevIndex);
        });

        nextBtn.addEventListener('click', () => {
            const nextIndex = currentItem === totalItems - 1 ? 0 : currentItem + 1;
            goToSlide(nextIndex);
        });

        // Auto-play
        setInterval(() => {
            const nextIndex = currentItem === totalItems - 1 ? 0 : currentItem + 1;
            goToSlide(nextIndex);
        }, 5000);

    }

    goToFeaturedBannerSlide(index, items, dotsContainer) {
        const totalItems = items.length;
        
        // Update items
        items.forEach((item, i) => {
            if (i === index) {
                item.style.display = 'block';
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            } else {
                item.style.display = 'none';
                item.style.opacity = '0';
                item.style.transform = 'translateX(100%)';
            }
        });

        // Update dots
        const dots = dotsContainer.querySelectorAll('.simple-dot');
        dots.forEach((dot, i) => {
            dot.style.background = i === index ? 'rgb(19, 127, 236)' : 'rgb(222, 226, 230)';
        });
    }

    async renderCTASection() {
        try {
            // Load CTA data from the about page API
            const cacheBuster = `&t=${Date.now()}`;
            const response = await fetch(`/api/content/about?section=cta${cacheBuster}`, {
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.success && data.data && data.data.length > 0) {
                const ctaData = data.data[0]; // Get the first CTA item
                
                // Initialize CTA component if available
                if (window.CTAComponent) {
                    const ctaOptions = {
                        containerId: 'cta-container',
                        title: ctaData.title || 'Discover your Future',
                        subtitle: ctaData.content || 'Join the Marigold School community and give your child the best foundation for their future.',
                        primaryButton: {
                            text: 'Apply Now',
                            url: '#',
                            onclick: 'openApplicationModal' // Pass function name as string
                        },
                        secondaryButton: {
                            text: 'Schedule a Visit',
                            url: '/contact.html',
                            onclick: null
                        }
                    };
                    
                    const ctaComponent = new window.CTAComponent(ctaOptions);
                    ctaComponent.render();
                } else {
                    // Fallback if CTAComponent is not available
                    this.renderCTAFallback(ctaData);
                }
            } else {
                // Fallback with default content
                this.renderCTAFallback();
            }
        } catch (error) {
            console.error('Error loading CTA data:', error);
            // Fallback with default content
            this.renderCTAFallback();
        }
    }

    renderCTAFallback(ctaData = null) {
        const ctaContainer = document.getElementById('cta-container');
        const ctaLoading = document.getElementById('cta-loading');
        
        if (!ctaContainer) return;
        
        // Hide loading placeholder
        if (ctaLoading) {
            ctaLoading.style.display = 'none';
        }
        
        // Show the container by removing inline style
        ctaContainer.removeAttribute('style');
        ctaContainer.style.display = 'block';
        ctaContainer.style.visibility = 'visible';
        
        const title = ctaData?.title || 'Discover your Future';
        const subtitle = ctaData?.content || 'Join the Marigold School community and give your child the best foundation for their future.';
        
        ctaContainer.innerHTML = `
            <section class="cta-about section bg-primary text-white">
                <div class="container">
                    <div class="cta-content text-center">
                        <h2 class="cta-title">${title}</h2>
                        <p class="cta-subtitle">${subtitle}</p>
                        <div class="cta-buttons">
                            <button class="btn btn-white btn-large cta-apply-btn" data-action="apply">
                                <span class="btn-text">Apply Now</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="arrow-right" class="lucide lucide-arrow-right btn-icon"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                            </button>
                            <a href="/contact.html" class="btn btn-outline-white btn-large">
                                <span class="btn-text">Schedule a Visit</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="calendar" class="lucide lucide-calendar btn-icon"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path></svg>
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        `;
        
        // Add event listener for apply button (CSP-compliant)
        setTimeout(() => {
            const applyBtn = ctaContainer.querySelector('.cta-apply-btn');
            if (applyBtn && typeof openApplicationModal === 'function') {
                applyBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    openApplicationModal();
                });
            }
        }, 100);
        
        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    renderVideoGallery() {
        const videoGrid = document.getElementById('video-gallery-grid');
        if (!videoGrid) return;

        // Don't render if we're currently viewing a specific collection
        if (this.currentVideoCollection) {
            return;
        }

        // Hide loading placeholders
        const videoLoading = document.getElementById('video-loading');
        if (videoLoading) {
            videoLoading.style.display = 'none';
        }


        if (this.videoAlbumsData.length === 0) {
            videoGrid.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
                    <i data-lucide="video" style="width: 64px; height: 64px; margin: 0 auto 20px; opacity: 0.3;"></i>
                    <h3 style="margin-bottom: 10px; color: var(--color-text-secondary);">No Video Albums Yet</h3>
                    <p style="color: var(--color-text-tertiary);">Video albums added from the admin panel will appear here.</p>
                </div>
            `;
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
            return;
        }

        // Store for later use
        this.videoCollections = this.videoAlbumsData;

        // Initialize filtered data
        this.filteredVideoData = [...this.videoAlbumsData];

        // Reset displayed count
        this.displayedVideoCount = 6;

        // Clear the grid first
        videoGrid.innerHTML = '';

        // Limit to 6 cards for display
        const displayVideoData = this.videoAlbumsData.slice(0, 6);

        // Render video albums from API data (limited to 6)
        displayVideoData.forEach((item, index) => {
            const videoCard = this.createVideoGalleryCard(item);
            videoGrid.appendChild(videoCard);
        });

        // Update load more button
        this.updateVideoLoadMoreButton(this.videoAlbumsData.length);
    }

    renderGalleryGrid() {
        const galleryGrid = document.getElementById('gallery-grid');
        if (!galleryGrid) return;

        // Hide loading placeholders
        const photoLoading = document.getElementById('photo-loading');
        if (photoLoading) {
            photoLoading.style.display = 'none';
        }


        if (this.galleryData.length === 0) {
            galleryGrid.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
                    <i data-lucide="image" style="width: 64px; height: 64px; margin: 0 auto 20px; opacity: 0.3;"></i>
                    <h3 style="margin-bottom: 10px; color: var(--color-text-secondary);">No Photo Albums Yet</h3>
                    <p style="color: var(--color-text-tertiary);">Photo albums added from the admin panel will appear here.</p>
                </div>
            `;
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
            return;
        }

        // Store for later use
        this.galleryCollections = this.galleryData;

        // Initialize filtered data
        this.filteredGalleryData = [...this.galleryData];

        // Reset displayed count
        this.displayedPhotoCount = 6;

        // Limit to 6 cards for display
        const displayData = this.galleryData
            .filter(item => item.count > 0)
            .slice(0, 6);

        // Render photo albums from API data (limited to 6)
        displayData.forEach((item, index) => {
            const galleryItem = this.createGalleryItem(item);
            galleryGrid.appendChild(galleryItem);
        });

        // Update load more button
        this.updatePhotoLoadMoreButton(this.galleryData.length);
    }

    renderDefaultGallery() {
        const galleryGrid = document.getElementById('gallery-grid');
        if (!galleryGrid) return;

        const defaultGalleryData = [
            {
                id: 1,
                title: 'Science Exhibition 2024',
                category: 'academics',
                image: '/images/gallery/science-exhibition.jpg',
                description: 'Students showcasing innovative science projects'
            },
            {
                id: 2,
                title: 'Annual Sports Day',
                category: 'sports',
                image: '/images/gallery/sports-day.jpg',
                description: 'Exciting moments from our annual sports championship'
            },
            {
                id: 3,
                title: 'Cultural Festival',
                category: 'cultural',
                image: '/images/gallery/cultural-festival.jpg',
                description: 'Music, dance, and drama performances'
            },
            {
                id: 4,
                title: 'Library Corner',
                category: 'campus',
                image: '/images/gallery/library.jpg',
                description: 'Students enjoying our well-stocked library'
            },
            {
                id: 5,
                title: 'Computer Lab',
                category: 'academics',
                image: '/images/gallery/computer-lab.jpg',
                description: 'Modern computer lab with latest technology'
            },
            {
                id: 6,
                title: 'Playground Activities',
                category: 'student-life',
                image: '/images/gallery/playground.jpg',
                description: 'Students enjoying outdoor activities'
            },
            {
                id: 7,
                title: 'Art & Craft Workshop',
                category: 'cultural',
                image: '/images/gallery/art-workshop.jpg',
                description: 'Creative art and craft sessions'
            },
            {
                id: 8,
                title: 'School Assembly',
                category: 'student-life',
                image: '/images/gallery/assembly.jpg',
                description: 'Morning assembly with students and teachers'
            },
            {
                id: 9,
                title: 'Laboratory Sessions',
                category: 'academics',
                image: '/images/gallery/lab-session.jpg',
                description: 'Hands-on learning in our science laboratories'
            },
            {
                id: 10,
                title: 'Sports Training',
                category: 'sports',
                image: '/images/gallery/sports-training.jpg',
                description: 'Students practicing various sports activities'
            },
            {
                id: 11,
                title: 'Campus Garden',
                category: 'campus',
                image: '/images/gallery/campus-garden.jpg',
                description: 'Beautiful campus garden and green spaces'
            },
            {
                id: 12,
                title: 'Music Class',
                category: 'cultural',
                image: '/images/gallery/music-class.jpg',
                description: 'Students learning music and instruments'
            }
        ];

        defaultGalleryData.forEach(item => {
            const galleryItem = this.createGalleryItem(item);
            galleryGrid.appendChild(galleryItem);
        });
    }

    createGalleryItem(item) {
        const galleryItem = document.createElement('div');
        
        // Normalize category for CSS class (remove spaces, convert to lowercase)
        const categoryClass = (item.category || 'general').replace(/\s+/g, '-').toLowerCase();
        
        galleryItem.className = `gallery-item ${categoryClass}`;
        galleryItem.setAttribute('data-category', item.category || 'general');
        galleryItem.setAttribute('data-album-id', item.id);
        
        // Use placeholder image if the image doesn't exist
        const imageSrc = item.image || this.getPlaceholderImage(item.category);
        
        // Create description with photo count
        const photoCount = item.count || 0;
        const description = item.description || `${photoCount} photo${photoCount !== 1 ? 's' : ''} in this album`;
        
        // Get category display name
        const categoryName = this.getCategoryDisplayName(item.category);
        
        // Debug log for troubleshooting
        
        galleryItem.innerHTML = `
            <div class="gallery-image">
                <div class="gallery-badge ${categoryClass}">${categoryName}</div>
                <img src="${imageSrc}" alt="${item.title}" loading="lazy" data-fallback="${this.getPlaceholderImage(item.category)}">
                <div class="gallery-overlay">
                    <div class="gallery-info">
                        <h3>${item.title}</h3>
                        
                    </div>
                    <button class="gallery-view-btn" data-id="${item.id}">
                        <i data-lucide="eye"></i>
                    </button>
                </div>
            </div>
        `;

        // Add error handler for image without inline onerror
        const img = galleryItem.querySelector('img');
        if (img) {
            img.addEventListener('error', function() {
                const fallback = this.getAttribute('data-fallback');
                if (fallback && this.src !== fallback) {
                    this.src = fallback;
                }
            });
        }

        return galleryItem;
    }

    createVideoGalleryCard(item) {
        const videoCard = document.createElement('div');
        videoCard.className = 'video-gallery-card';
        videoCard.setAttribute('data-collection-id', item.id);
        
        // Extract year from createdAt date or use category
        let badgeText = item.category ? this.getCategoryDisplayName(item.category) : 'Videos';
        let badgeClass = item.category || 'general';
        
        // If we have a createdAt date, show the year instead
        if (item.createdAt) {
            const year = new Date(item.createdAt).getFullYear();
            badgeText = year.toString();
        }
        
        const actualVideoCount = item.count || (item.videos ? item.videos.length : 0);
        
        // Use album image as thumbnail background
        const thumbnailStyle = item.image ? `style="background-image: url('${item.image}'); background-size: cover; background-position: center;"` : '';
        
        videoCard.innerHTML = `
            <div class="video-gallery-thumbnail" ${thumbnailStyle}>
                <div class="video-badge video-badge-top-left ${badgeClass}">${badgeText}</div>
                <div class="video-overlay-content">
                    <h3 class="video-gallery-title">${item.title}</h3>
                    <p class="video-gallery-count">${actualVideoCount} Video${actualVideoCount !== 1 ? 's' : ''}</p>
                </div>
            </div>
        `;

        // Add click event to show videos in this collection
        videoCard.addEventListener('click', () => {
            this.showVideoCollection(item);
        });

        return videoCard;
    }

    showVideoCollection(collection) {
        const videoGrid = document.getElementById('video-gallery-grid');
        if (!videoGrid) return;


        // Store current state for back button
        this.currentVideoCollection = collection;

        // Create back button and collection header
        const backButton = document.createElement('button');
        backButton.className = 'video-collection-back-btn';
        backButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="arrow-left" class="lucide lucide-arrow-left"><path d="m12 19-7-7 7-7"></path><path d="M19 12H5"></path></svg>
        `;

        const collectionHeader = document.createElement('div');
        collectionHeader.className = 'video-title-container';
        collectionHeader.innerHTML = `
            <h2 class="video-collection-title">${collection.title}</h2>
            <p class="video-collection-subtitle">${collection.videos.length} videos in this collection</p>
        `;

        // Clear grid and add header
        videoGrid.innerHTML = '';

        const videoCollectionHeader = document.createElement('div');
        videoCollectionHeader.className = 'video-header-container';
        
        videoCollectionHeader.appendChild(backButton);
        videoCollectionHeader.appendChild(collectionHeader);

        videoGrid.appendChild(videoCollectionHeader);

        // Create video items
        collection.videos.forEach(video => {
            const videoItem = this.createVideoItem(video);
            videoGrid.appendChild(videoItem);
        });

        // Add back button event listener
        backButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.backToVideoGallery();
        });

        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    createVideoItem(video) {
        const videoItem = document.createElement('div');
        videoItem.className = 'video-item';
        
        // Use the thumbnail URL stored in the database (generated during upload)
        let thumbnail = video.imageUrl || video.thumbnail;
        
        // Final fallback if no thumbnail is stored
        if (!thumbnail) {
            thumbnail = 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&h=300&fit=crop&auto=format';
        }
        
        const videoUrl = video.videoUrl || video.url || '';
        
        videoItem.innerHTML = `
            <div class="video-item-thumbnail" data-title="${video.title}">
                <img src="${thumbnail}" alt="${video.title}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&h=300&fit=crop&auto=format'">
            </div>
            <div class="video-item-content">
                <h3 class="video-item-title">${video.title}</h3>
                ${video.description ? `<p class="video-item-description">${video.description}</p>` : ''}
                <div class="video-item-actions">
                    <button class="video-play-btn" data-video-url="${videoUrl}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="play" class="lucide lucide-play"><polygon points="5,3 19,12 5,21 5,3"></polygon></svg>
                        Play Video
                    </button>
                </div>
            </div>
        `;

        // Add click event to play video
        const playBtn = videoItem.querySelector('.video-play-btn');
        playBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.playVideo({
                ...video,
                url: videoUrl,
                thumbnail: thumbnail
            });
        });

        return videoItem;
    }

    backToVideoGallery() {
        const videoGrid = document.getElementById('video-gallery-grid');
        if (!videoGrid) return;


        // Clear current state
        this.currentVideoCollection = null;

        // Clear the grid completely
        videoGrid.innerHTML = '';

        // Re-render the main video gallery
        this.renderVideoGallery();
        
    }

    playVideo(video) {
        
        // Create video modal/lightbox
        const videoModal = document.createElement('div');
        videoModal.className = 'video-modal video-player-modal';
        videoModal.innerHTML = `
            <div class="video-modal-content">
                <button class="video-modal-close" aria-label="Close video">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="x" class="lucide lucide-x"><path d="M18 6 6 18"></path><path d="M6 6l12 12"></path></svg>
                </button>
                <div class="video-modal-player">
                    <video controls autoplay preload="metadata" poster="${video.thumbnail || ''}">
                        <source src="${video.url || video.videoUrl}" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                </div>
                <div class="video-modal-info">
                    <h3>${video.title}</h3>
                    ${video.description ? `<p style="margin: 8px 0 0 0; color: #ccc; font-size: 0.9rem;">${video.description}</p>` : ''}
                </div>
            </div>
        `;

        document.body.appendChild(videoModal);
        document.body.style.overflow = 'hidden';
        
        // Debug: Force modal to be visible
        videoModal.style.display = 'flex';
        videoModal.style.visibility = 'visible';
        videoModal.style.opacity = '1';
        videoModal.style.zIndex = '999999';
        videoModal.style.background = 'rgba(255, 0, 0, 0.8)'; // Temporary red background for debugging
        
        
        // Force a reflow to ensure styles are applied
        videoModal.offsetHeight;
        
        // Add a temporary alert to confirm modal creation
        setTimeout(() => {
        }, 100);

        // Close modal functionality
        const closeBtn = videoModal.querySelector('.video-modal-close');
        const videoElement = videoModal.querySelector('video');
        
        const closeModal = () => {
            // Pause video before closing
            if (videoElement) {
                videoElement.pause();
                videoElement.currentTime = 0;
            }
            videoModal.remove();
            document.body.style.overflow = '';
        };

        // Close button click
        closeBtn.addEventListener('click', closeModal);
        
        // Click outside modal to close
        videoModal.addEventListener('click', (e) => {
            if (e.target === videoModal) closeModal();
        });
        
        // ESC key to close
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', handleKeyDown);
            }
        };
        document.addEventListener('keydown', handleKeyDown);

        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
    }

    // ===== SEARCH AND FILTER FUNCTIONALITY =====

    /**
     * Filter photo gallery data based on current filters
     */
    filterGalleryData() {
        let filtered = [...this.galleryData];

        // Apply search filter
        if (this.currentFilters.search) {
            const searchTerm = this.currentFilters.search.toLowerCase();
            filtered = filtered.filter(album => 
                album.title.toLowerCase().includes(searchTerm) ||
                album.category.toLowerCase().includes(searchTerm) ||
                (album.description && album.description.toLowerCase().includes(searchTerm))
            );
        }

        this.filteredGalleryData = filtered;
        return filtered;
    }

    /**
     * Filter video gallery data based on current filters
     */
    filterVideoData() {
        let filtered = [...this.videoAlbumsData];

        // Apply search filter
        if (this.currentVideoFilters.search) {
            const searchTerm = this.currentVideoFilters.search.toLowerCase();
            filtered = filtered.filter(album => 
                album.title.toLowerCase().includes(searchTerm) ||
                album.category.toLowerCase().includes(searchTerm) ||
                (album.description && album.description.toLowerCase().includes(searchTerm))
            );
        }

        this.filteredVideoData = filtered;
        return filtered;
    }

    /**
     * Handle search input for photo gallery
     */
    handleGallerySearch(event) {
        this.currentFilters.search = event.target.value;
        this.applyGalleryFilters();
    }



    /**
     * Apply all filters to photo gallery and re-render
     */
    applyGalleryFilters() {
        const filteredData = this.filterGalleryData();
        this.renderFilteredGalleryGrid(filteredData);
    }

    /**
     * Handle search input for video gallery
     */
    handleVideoSearch(event) {
        this.currentVideoFilters.search = event.target.value;
        this.applyVideoFilters();
    }



    /**
     * Apply all filters to video gallery and re-render
     */
    applyVideoFilters() {
        const filteredData = this.filterVideoData();
        this.renderFilteredVideoGallery(filteredData);
    }

    /**
     * Render filtered photo gallery
     */
    renderFilteredGalleryGrid(filteredData) {
        const galleryGrid = document.getElementById('gallery-grid');
        if (!galleryGrid) return;

        // Clear current content
        galleryGrid.innerHTML = '';

        if (filteredData.length === 0) {
            galleryGrid.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
                    <i data-lucide="search-x" style="width: 64px; height: 64px; margin: 0 auto 20px; opacity: 0.3;"></i>
                    <h3 style="margin-bottom: 10px; color: var(--color-text-secondary);">No Albums Found</h3>
                    <p style="color: var(--color-text-tertiary);">Try adjusting your search or filter criteria.</p>
                </div>
            `;
        } else {
            // Reset displayed count for filtered results
            this.displayedPhotoCount = 6;
            
            // Limit filtered results to 6 cards as well
            const displayData = filteredData.slice(0, 6);
            
            displayData.forEach(album => {
                const galleryItem = this.createGalleryItem(album);
                galleryGrid.appendChild(galleryItem);
            });

            // Update load more button for filtered results
            this.updatePhotoLoadMoreButton(filteredData.length);
        }

        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    /**
     * Render filtered video gallery
     */
    renderFilteredVideoGallery(filteredData) {
        const videoGrid = document.getElementById('video-gallery-grid');
        if (!videoGrid) return;

        // Don't render if we're currently viewing a specific collection
        if (this.currentVideoCollection) {
            return;
        }

        // Clear current content
        videoGrid.innerHTML = '';

        if (filteredData.length === 0) {
            videoGrid.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
                    <i data-lucide="video-off" style="width: 64px; height: 64px; margin: 0 auto 20px; opacity: 0.3;"></i>
                    <h3 style="margin-bottom: 10px; color: var(--color-text-secondary);">No Video Albums Found</h3>
                    <p style="color: var(--color-text-tertiary);">Try adjusting your search or filter criteria.</p>
            </div>
        `;
        } else {
            // Reset displayed count for filtered results
            this.displayedVideoCount = 6;
            
            // Limit filtered results to 6 cards as well
            const displayData = filteredData.slice(0, 6);
            
            displayData.forEach(album => {
                const videoCard = this.createVideoGalleryCard(album);
                videoGrid.appendChild(videoCard);
            });

            // Update load more button for filtered results
            this.updateVideoLoadMoreButton(filteredData.length);
        }

        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    // ===== LOAD MORE FUNCTIONALITY =====

    /**
     * Load more photo albums
     */
    loadMorePhotoAlbums() {
        const galleryGrid = document.getElementById('gallery-grid');
        const loadMoreContainer = document.getElementById('photo-load-more-container');
        const loadMoreBtn = document.getElementById('photo-load-more-btn');
        
        if (!galleryGrid || !loadMoreContainer || !loadMoreBtn) return;

        // Get filtered data
        const filteredData = this.filterGalleryData();
        
        // Calculate how many more albums to show
        const remainingCount = filteredData.length - this.displayedPhotoCount;
        const albumsToShow = Math.min(6, remainingCount); // Show 6 more or remaining count
        

        // Add new albums to the grid
        for (let i = this.displayedPhotoCount; i < this.displayedPhotoCount + albumsToShow; i++) {
            if (i < filteredData.length) {
                const album = filteredData[i];
                const galleryItem = this.createGalleryItem(album);
                galleryGrid.appendChild(galleryItem);
            }
        }

        // Update displayed count
        this.displayedPhotoCount += albumsToShow;

        // Update button or hide it
        this.updatePhotoLoadMoreButton(filteredData.length);

        // Initialize Lucide icons for new elements
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    /**
     * Load more video albums
     */
    loadMoreVideoAlbums() {
        const videoGrid = document.getElementById('video-gallery-grid');
        const loadMoreContainer = document.getElementById('video-load-more-container');
        const loadMoreBtn = document.getElementById('video-load-more-btn');
        
        if (!videoGrid || !loadMoreContainer || !loadMoreBtn) return;

        // Don't load more if we're currently viewing a specific collection
        if (this.currentVideoCollection) {
            return;
        }

        // Get filtered data
        const filteredData = this.filterVideoData();
        
        // Calculate how many more albums to show
        const remainingCount = filteredData.length - this.displayedVideoCount;
        const albumsToShow = Math.min(6, remainingCount); // Show 6 more or remaining count
        

        // Add new albums to the grid
        for (let i = this.displayedVideoCount; i < this.displayedVideoCount + albumsToShow; i++) {
            if (i < filteredData.length) {
                const album = filteredData[i];
                const videoCard = this.createVideoGalleryCard(album);
                videoGrid.appendChild(videoCard);
            }
        }

        // Update displayed count
        this.displayedVideoCount += albumsToShow;

        // Update button or hide it
        this.updateVideoLoadMoreButton(filteredData.length);

        // Initialize Lucide icons for new elements
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    /**
     * Update photo load more button
     */
    updatePhotoLoadMoreButton(totalCount) {
        const loadMoreContainer = document.getElementById('photo-load-more-container');
        const loadMoreBtn = document.getElementById('photo-load-more-btn');
        const btnText = loadMoreBtn?.querySelector('.btn-text');
        
        if (!loadMoreContainer || !loadMoreBtn || !btnText) return;

        const remainingCount = totalCount - this.displayedPhotoCount;
        
        if (remainingCount > 0) {
            loadMoreContainer.style.display = 'block';
            btnText.textContent = `Load More Albums (${remainingCount} remaining)`;
        } else {
            loadMoreContainer.style.display = 'none';
        }
    }

    /**
     * Update video load more button
     */
    updateVideoLoadMoreButton(totalCount) {
        const loadMoreContainer = document.getElementById('video-load-more-container');
        const loadMoreBtn = document.getElementById('video-load-more-btn');
        const btnText = loadMoreBtn?.querySelector('.btn-text');
        
        if (!loadMoreContainer || !loadMoreBtn || !btnText) return;

        const remainingCount = totalCount - this.displayedVideoCount;
        
        if (remainingCount > 0) {
            loadMoreContainer.style.display = 'block';
            btnText.textContent = `Load More Albums (${remainingCount} remaining)`;
        } else {
            loadMoreContainer.style.display = 'none';
        }
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


    getCategoryDisplayName(category) {
        if (!category) return 'General';
        
        const categories = {
            'academics': 'Academics',
            'sports': 'Sports',
            'cultural': 'Cultural',
            'campus': 'Campus',
            'student-life': 'Student Life',
            'general': 'General',
            'photoAlbum': 'Photos',
            'videoAlbum': 'Videos'
        };
        
        // Check lowercase version first
        const lowerCategory = category.toLowerCase();
        if (categories[lowerCategory]) {
            return categories[lowerCategory];
        }
        
        // Return the category as-is if it's a custom category (like "Art Exhibition")
        return category;
    }

    createMomentSlide(moment, index) {
        const momentSlide = document.createElement('div');
        momentSlide.className = 'moment-slide';
        momentSlide.setAttribute('data-slide', index);

        momentSlide.innerHTML = `
            <div class="moment-image">
                <img src="${moment.image}" alt="${moment.title}" loading="lazy">
                <div class="moment-overlay">
                    <div class="moment-icon">
                        <i data-lucide="${moment.icon}"></i>
                    </div>
                </div>
            </div>
            <div class="moment-content">
                <h3>${moment.title}</h3>
                <p>${moment.description}</p>
                <span class="moment-date">${moment.date}</span>
            </div>
        `;

        return momentSlide;
    }

    updateCarouselDots() {
        const carouselDots = document.getElementById('carousel-dots');
        if (!carouselDots) return;

        const slides = document.querySelectorAll('.moment-slide');
        carouselDots.innerHTML = '';

        slides.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.className = `dot ${index === 0 ? 'active' : ''}`;
            dot.setAttribute('data-slide', index);
            carouselDots.appendChild(dot);
        });
    }

    setupEventListeners() {
        this.setupFilterButtons();
        this.setupGalleryItems();
        this.setupHeroButton();
        this.setupSearchAndFilters();
        this.setupGalleryLoadMoreButtons();
    }

    setupHeroButton() {
        // Handle hero explore button click (CSP-compliant)
        const heroBtn = document.getElementById('hero-explore-btn');
        if (heroBtn) {
            heroBtn.addEventListener('click', () => {
                const galleryFilter = document.querySelector('.gallery-filter');
                if (galleryFilter) {
                    galleryFilter.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
    }

    setupSearchAndFilters() {
        // Photo Gallery Search and Filters
        const photoGallerySearch = document.querySelector('.photo-gallery-section .gallery-search');
        if (photoGallerySearch) {
            let searchTimeout;
            photoGallerySearch.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.handleGallerySearch(e);
                }, 300);
            });
        }


        // Video Gallery Search and Filters
        const videoGallerySearch = document.querySelector('.video-gallery-section .gallery-search');
        if (videoGallerySearch) {
            let videoSearchTimeout;
            videoGallerySearch.addEventListener('input', (e) => {
                clearTimeout(videoSearchTimeout);
                videoSearchTimeout = setTimeout(() => {
                    this.handleVideoSearch(e);
                }, 300);
            });
        }


    }

    setupGalleryLoadMoreButtons() {
        // Photo Gallery Load More Button
        const photoLoadMoreBtn = document.getElementById('photo-load-more-btn');
        if (photoLoadMoreBtn) {
            photoLoadMoreBtn.addEventListener('click', () => {
                this.loadMorePhotoAlbums();
            });
        }

        // Video Gallery Load More Button
        const videoLoadMoreBtn = document.getElementById('video-load-more-btn');
        if (videoLoadMoreBtn) {
            videoLoadMoreBtn.addEventListener('click', () => {
                this.loadMoreVideoAlbums();
            });
        }

    }

    setupFilterButtons() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const filter = button.getAttribute('data-filter');
                this.filterGallery(filter);
                
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            });
        });
    }

    filterGallery(filter) {
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        galleryItems.forEach(item => {
            if (filter === 'all' || item.getAttribute('data-category') === filter) {
                item.style.display = 'block';
                item.style.opacity = '1';
            } else {
                item.style.display = 'none';
                item.style.opacity = '0';
            }
        });
    }


    setupCarousel() {
        let currentSlide = 0;
        const slides = document.querySelectorAll('.moment-slide');
        const dots = document.querySelectorAll('.dot');
        const prevBtn = document.getElementById('carousel-prev');
        const nextBtn = document.getElementById('carousel-next');

        if (slides.length === 0) return;

        const showSlide = (index) => {
            slides.forEach((slide, i) => {
                slide.style.transform = `translateX(${(i - index) * 100}%)`;
                slide.style.opacity = i === index ? '1' : '0.7';
            });

            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
        };

        const nextSlide = () => {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        };

        const prevSlide = () => {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(currentSlide);
        };

        // Event listeners
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentSlide = index;
                showSlide(currentSlide);
            });
        });

        // Auto-advance carousel
        setInterval(nextSlide, 5000);

        // Initialize first slide
        showSlide(0);
    }

    setupGalleryItems() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        galleryItems.forEach(item => {
            const viewBtn = item.querySelector('.gallery-view-btn');
            if (viewBtn) {
                viewBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.openGalleryLightbox(item);
                });
            }

            // Add click event for the entire gallery item
            item.addEventListener('click', () => {
                this.openGalleryLightbox(item);
            });

            // Add hover effects
            item.addEventListener('mouseenter', () => {
                item.style.transform = 'scale(1.05)';
            });

            item.addEventListener('mouseleave', () => {
                item.style.transform = 'scale(1)';
            });
        });
    }

    async openGalleryLightbox(item) {
        const albumId = item.getAttribute('data-album-id');
        const titleElement = item.querySelector('.gallery-info h3');
        
        if (!albumId || !titleElement) {
            console.error('Gallery item missing required data');
            return;
        }
        
        const albumTitle = titleElement.textContent;
        
        
        // Fetch photos from this specific album
        try {
            const response = await fetch(`/api/content/gallery/album/${albumId}/photos`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.success && data.photos && data.photos.length > 0) {
                // Filter out featured items (if any)
                const regularPhotos = data.photos.filter(photo => !photo.isFeatured);
                
                if (regularPhotos.length > 0) {
                    this.openPhotoLightbox(regularPhotos, 0, albumTitle);
        } else {
                    console.warn('No regular photos found in this album (only featured items)');
                    this.showNoPhotosMessage(albumTitle);
                }
            } else {
                console.warn('No photos found in this album');
                this.showNoPhotosMessage(albumTitle);
            }
        } catch (error) {
            console.error('Error loading album photos:', error);
            this.showNoPhotosMessage(albumTitle);
        }
    }
    
    openPhotoLightbox(photos, startIndex, albumTitle) {
        this.currentLightboxPhotos = photos;
        this.currentLightboxIndex = startIndex;
        this.currentAlbumTitle = albumTitle;
        
        // Create lightbox HTML
        const lightboxHTML = `
            <div class="gallery-lightbox" id="gallery-lightbox">
                <div class="lightbox-content">
                    <div class="lightbox-main-container">
                        <button class="lightbox-close" id="lightbox-close">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="x"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
                        </button>
                        
                        <button class="lightbox-nav-btn prev" id="lightbox-prev">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="chevron-left"><path d="m15 18-6-6 6-6"></path></svg>
                        </button>
                        
                        <button class="lightbox-nav-btn next" id="lightbox-next">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="chevron-right"><path d="m9 18 6-6-6-6"></path></svg>
                        </button>
                        
                        <div class="lightbox-main-image-container">
                            <img src="" alt="" class="lightbox-main-image" id="lightbox-main-image">
                            <div class="lightbox-image-overlay">
                                <h3 class="lightbox-image-title" id="lightbox-image-title"></h3>
                            </div>
                        </div>
                    </div>
                    
                    <div class="lightbox-thumbnails-container">
                        <div class="lightbox-thumbnails" id="lightbox-thumbnails">
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Remove existing lightbox if any
        const existingLightbox = document.getElementById('gallery-lightbox');
        if (existingLightbox) {
            existingLightbox.remove();
        }
        
        document.body.insertAdjacentHTML('beforeend', lightboxHTML);
        
        // Get elements
        const lightbox = document.getElementById('gallery-lightbox');
        const closeBtn = document.getElementById('lightbox-close');
        const prevBtn = document.getElementById('lightbox-prev');
        const nextBtn = document.getElementById('lightbox-next');
        
        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        // Render thumbnails
        this.renderLightboxThumbnails();
        
        // Show first image
        this.updateLightboxImage(startIndex);
        
        // Show lightbox
        setTimeout(() => {
            lightbox.classList.add('show');
        }, 10);
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        // Close functionality
        const closeLightbox = () => {
            lightbox.classList.remove('show');
            setTimeout(() => {
                lightbox.remove();
                document.body.style.overflow = '';
                this.currentLightboxPhotos = null;
                this.currentLightboxIndex = 0;
            }, 300);
        };
        
        // Event listeners
        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
        
        prevBtn.addEventListener('click', () => this.navigateLightbox(-1));
        nextBtn.addEventListener('click', () => this.navigateLightbox(1));
        
        // Keyboard navigation
        const handleKeydown = (e) => {
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowLeft') {
                this.navigateLightbox(-1);
            } else if (e.key === 'ArrowRight') {
                this.navigateLightbox(1);
            }
        };
        document.addEventListener('keydown', handleKeydown);
        
        // Store close handler for cleanup
        lightbox._closeHandler = () => {
            document.removeEventListener('keydown', handleKeydown);
        };
    }
    
    renderLightboxThumbnails() {
        const thumbnailsContainer = document.getElementById('lightbox-thumbnails');
        if (!thumbnailsContainer || !this.currentLightboxPhotos) return;
        
        thumbnailsContainer.innerHTML = '';
        
        this.currentLightboxPhotos.forEach((photo, index) => {
            const thumbnail = document.createElement('div');
            thumbnail.className = `lightbox-thumbnail ${index === this.currentLightboxIndex ? 'active' : ''}`;
            thumbnail.setAttribute('data-index', index);
            
            thumbnail.innerHTML = `
                <div class="lightbox-thumbnail-content">
                    <img src="${photo.imageUrl}" alt="${photo.title || ''}" onerror="this.src='https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop&auto=format'">
                </div>
            `;
            
            thumbnail.addEventListener('click', () => {
                this.updateLightboxImage(index);
            });
            
            thumbnailsContainer.appendChild(thumbnail);
        });
    }
    
    updateLightboxImage(index) {
        if (!this.currentLightboxPhotos || index < 0 || index >= this.currentLightboxPhotos.length) {
            return;
        }
        
        this.currentLightboxIndex = index;
        const photo = this.currentLightboxPhotos[index];
        
        // Update main image
        const mainImage = document.getElementById('lightbox-main-image');
        const imageTitle = document.getElementById('lightbox-image-title');
        const prevBtn = document.getElementById('lightbox-prev');
        const nextBtn = document.getElementById('lightbox-next');
        
        if (mainImage) {
            mainImage.src = photo.imageUrl;
            mainImage.alt = photo.title || this.currentAlbumTitle;
        }
        
        if (imageTitle) {
            imageTitle.textContent = photo.title || this.currentAlbumTitle;
        }
        
        // Update navigation buttons
        if (prevBtn) {
            prevBtn.disabled = index === 0;
        }
        if (nextBtn) {
            nextBtn.disabled = index === this.currentLightboxPhotos.length - 1;
        }
        
        // Update thumbnail active state
        document.querySelectorAll('.lightbox-thumbnail').forEach((thumb, i) => {
            thumb.classList.toggle('active', i === index);
        });
        
        // Scroll thumbnail into view
        const activeThumbnail = document.querySelector(`.lightbox-thumbnail[data-index="${index}"]`);
        if (activeThumbnail) {
            activeThumbnail.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    }
    
    navigateLightbox(direction) {
        const newIndex = this.currentLightboxIndex + direction;
        if (newIndex >= 0 && newIndex < this.currentLightboxPhotos.length) {
            this.updateLightboxImage(newIndex);
        }
    }
    
    showNoPhotosMessage(albumTitle) {
        const message = `
            <div class="gallery-lightbox" id="gallery-lightbox" style="display: flex; align-items: center; justify-content: center;">
                <div style="text-align: center; padding: 2rem; background: white; border-radius: 12px; max-width: 400px; box-shadow: 0 4px 20px rgba(0,0,0,0.15);">
                    <i data-lucide="image-off" style="width: 64px; height: 64px; margin: 0 auto 1rem; opacity: 0.3;"></i>
                    <h3 style="margin-bottom: 0.5rem; color: #1a202c;">No Photos Available</h3>
                    <p style="color: #64748b; margin-bottom: 1.5rem;">The album "${albumTitle}" doesn't have any photos yet.</p>
                    <button id="no-photos-close-btn" class="btn btn-primary">Close</button>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', message);
        document.body.style.overflow = 'hidden';
        
        const lightbox = document.getElementById('gallery-lightbox');
        
        // Add event listener for close button (CSP-compliant)
        const closeBtn = document.getElementById('no-photos-close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                lightbox.classList.remove('show');
                setTimeout(() => {
                    lightbox.remove();
                    document.body.style.overflow = '';
                }, 300);
            });
        }
        
        // Allow clicking outside to close
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.classList.remove('show');
                setTimeout(() => {
                    lightbox.remove();
                    document.body.style.overflow = '';
                }, 300);
            }
        });
        
        // Add keyboard close (Escape)
        const handleKeydown = (e) => {
            if (e.key === 'Escape') {
                lightbox.classList.remove('show');
                setTimeout(() => {
                    lightbox.remove();
                    document.body.style.overflow = '';
                }, 300);
                document.removeEventListener('keydown', handleKeydown);
            }
        };
        document.addEventListener('keydown', handleKeydown);
        
        setTimeout(() => {
            lightbox.classList.add('show');
        }, 10);
        
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
    
    createSimpleLightbox(imageUrl, title, description) {
        // Legacy method - kept for compatibility
        console.warn('Using legacy createSimpleLightbox - consider updating to openPhotoLightbox');
    }

    // Animation methods
    animateGalleryItems() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        galleryItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    animateFeaturedMoments() {
        const moments = document.querySelectorAll('.moment-slide');
        moments.forEach((moment, index) => {
            moment.style.opacity = '0';
            moment.style.transform = 'translateX(50px)';
            
            setTimeout(() => {
                moment.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                moment.style.opacity = '1';
                moment.style.transform = 'translateX(0)';
            }, index * 200);
        });
    }

    // Initialize animations when page is loaded
    initializeAnimations() {
        setTimeout(() => {
            this.animateGalleryItems();
            this.animateFeaturedMoments();
        }, 500);
    }
}

// Initialize the gallery page loader when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    window.galleryPageLoader = new GalleryPageLoader();
    
    // Initialize animations after a short delay
    setTimeout(() => {
        if (window.galleryPageLoader) {
            window.galleryPageLoader.initializeAnimations();
        }
    }, 1000);
});

