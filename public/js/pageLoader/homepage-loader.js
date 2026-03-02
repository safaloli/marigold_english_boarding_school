class HomepageLoader {
    constructor() {
        this.content = null;
        this.heroVisualShown = false;
        this.heroVisualLoadStartTime = null;
        this.currentLightboxPhotos = null;
        this.currentLightboxIndex = 0;
        this.currentAlbumTitle = '';
        this.init();
    }

    async init() {
        await this.loadContent();
        this.renderContent();
    }

    async loadContent() {
        try {
            const cacheManager = window.cacheManager;
            let data;
            
            if (cacheManager) {
                // Use cache manager for better performance
                data = await cacheManager.fetch('/api/content/home');
            } else {
                // Fallback to direct fetch with timeout
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 5000);
                
                const response = await fetch('/api/content/home', {
                    signal: controller.signal
                });
                
                clearTimeout(timeoutId);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                data = await response.json();
            }
            
            if (data && data.success && data.content) {
                this.content = data.content;
            } else {
                this.content = null;
            }
        } catch (error) {
            console.warn('Failed to load homepage content:', error);
            this.content = null;
        }
        
        // Hide loading placeholders immediately after content load attempt
        this.hideAllLoadingPlaceholders();
    }

    hideAllLoadingPlaceholders() {
        // Hide hero loading
        this.hideHeroLoading();
        
        // Hide all section loading placeholders
        const sections = ['quick-facts', 'why-choose', 'mission', 'programs', 'testimonials', 'gallery', 'contact'];
        sections.forEach(section => {
            const loadingEl = document.getElementById(`${section}-loading`);
            const dynamicEl = document.getElementById(`${section}-dynamic`);
            
            if (loadingEl && dynamicEl) {
                // Special handling for contact section to preserve the form
                if (section === 'contact') {
                    this.preserveContactForm(loadingEl, dynamicEl);
                } else {
                    loadingEl.style.display = 'none';
                    dynamicEl.style.display = 'block';
                }
            }
        });
        
    }
    
    preserveContactForm(loadingEl, dynamicEl) {
        // Get the contact form from the loading section
        const contactFormCard = loadingEl.querySelector('.contact-form-card');
        const contactForm = contactFormCard ? contactFormCard.innerHTML : '';
        
        // Hide loading section
        loadingEl.style.display = 'none';
        
        // Show dynamic section
        dynamicEl.style.display = 'block';
        
        // Preserve the contact form in the dynamic section
        const dynamicContactFormCard = dynamicEl.querySelector('.contact-form-card');
        if (dynamicContactFormCard && contactForm) {
            dynamicContactFormCard.innerHTML = contactForm;
        }
    }

    renderContent() {
        if (!this.content) {
            return;
        }


        // Render Hero Section
        this.renderHeroSection();
        
        // Render Quick Facts Section
        this.renderQuickFactsSection();
        
        // Render Why Choose Us Section
        this.renderWhyChooseSection();
        
        // Render Mission Section
        this.renderMissionSection();
        
        // Render Programs Section
        this.renderProgramsSection();
        
        // Render NEB Toppers Section
        this.renderNebToppersSection();
        
        // Render Alumni Section
        this.renderAlumniSection();
        
        // Render Testimonials Section
        this.renderTestimonialsSection();
        
        // Render Gallery Section
        this.renderGallerySection();
        
        // Render Contact Section
        this.renderContactSection();

        // Initialize counter animations after content is rendered
        setTimeout(() => {
            this.initializeCounterAnimations();
        }, 500);
        
    }
    
    initializeCounterAnimations() {
        const counterNumbers = document.querySelectorAll('.counter-number');
        
        if (counterNumbers.length === 0) {
            return;
        }
        
        // Create intersection observer to trigger animation when section is visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target); // Only animate once
                }
            });
        }, { 
            threshold: 0.5, // Trigger when 50% of the element is visible
            rootMargin: '0px 0px -100px 0px' // Start animation slightly before element is fully visible
        });

        // Observe all counter numbers
        counterNumbers.forEach(counter => {
            observer.observe(counter);
        });
        
    }
    
    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const startTime = performance.now();
        
        // Add animating class for visual feedback
        element.classList.add('animating');
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Use easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(target * easeOutQuart);
            
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.textContent = target; // Ensure final value is exact
                element.classList.remove('animating'); // Remove animating class when done
            }
        };
        
        requestAnimationFrame(animate);
    }

    renderHeroSection() {
        if (!this.content.hero || !this.content.hero.enabled) {
            // Hide loading and show static content if hero is disabled
            this.hideHeroLoading();
            this.showHeroVisual(); // Show visual even if hero content is disabled
            return;
        }

        const hero = this.content.hero;
        
        // Track minimum display time for placeholder
        this.heroVisualLoadStartTime = Date.now();
        
        // Update hero main image (display in .hero-main-image div)
        const heroMainImage = document.querySelector('.hero-main-image');
        const heroVisualLoading = document.getElementById('hero-visual-loading');
        
        if (heroMainImage && hero.backgroundImage) {
            // Check if the backgroundImage is a video file
            const isVideo = hero.backgroundImage.match(/\.(mp4|webm|ogg|mov)$/i);
            
            if (isVideo) {
                // Determine video type from URL extension
                const videoUrl = hero.backgroundImage;
                const extension = videoUrl.split('.').pop().toLowerCase().split('?')[0]; // Remove query params
                let videoType = 'video/mp4'; // Default to MP4
                
                if (extension === 'webm') {
                    videoType = 'video/webm';
                } else if (extension === 'ogg' || extension === 'ogv') {
                    videoType = 'video/ogg';
                } else if (extension === 'mov') {
                    videoType = 'video/quicktime';
                }
                
                heroMainImage.innerHTML = `<video 
                    autoplay 
                    muted 
                    loop 
                    playsinline 
                    preload="metadata"
                    disablePictureInPicture
                    controlsList="nodownload nofullscreen noremoteplayback"
                    style="width: 100%; height: 100%; object-fit: cover;">
                    <source src="${videoUrl}" type="${videoType}">
                    Your browser does not support the video tag.
                </video>`;
                
                // Handle video loading and smooth playback
                const video = heroMainImage.querySelector('video');
                if (video) {
                    let videoLoaded = false;
                    
                    const handleVideoReady = () => {
                        if (!videoLoaded) {
                            videoLoaded = true;
                            this.showHeroVisualWithMinDelay();
                        }
                    };
                    
                    // Multiple event listeners to catch different loading states
                    video.addEventListener('canplay', handleVideoReady, { once: true });
                    video.addEventListener('loadeddata', handleVideoReady, { once: true });
                    video.addEventListener('canplaythrough', handleVideoReady, { once: true });
                    
                    // Handle error case
                    video.addEventListener('error', (e) => {
                        console.warn('Video playback error, attempting reload:', e);
                        video.load();
                        handleVideoReady();
                    }, { once: true });
                    
                    // Check if video is already loaded (cached)
                    if (video.readyState >= 3) { // HAVE_FUTURE_DATA or HAVE_ENOUGH_DATA
                        handleVideoReady();
                    }
                    
                    // Force load the video
                    video.load();
                    
                    // Timeout fallback - show after 2 seconds max
                    setTimeout(() => {
                        if (!videoLoaded) {
                            console.warn('Video loading timeout, showing visual');
                            handleVideoReady();
                        }
                    }, 2000);
                }
            } else {
                heroMainImage.innerHTML = `<img src="${hero.backgroundImage}" alt="Marigold School - Hero Image" style="width: 100%; height: 100%; object-fit: cover; border-radius: 16px;">`;
                
                // Handle image loading
                const img = heroMainImage.querySelector('img');
                if (img) {
                    img.addEventListener('load', () => {
                        this.showHeroVisualWithMinDelay();
                    }, { once: true });
                    
                    // Fallback if image fails to load
                    img.addEventListener('error', () => {
                        this.showHeroVisualWithMinDelay();
                    }, { once: true });
                    
                    // Check if image is already loaded (cached)
                    if (img.complete && img.naturalHeight > 0) {
                        this.showHeroVisualWithMinDelay();
                    }
                    
                    // Timeout fallback
                    setTimeout(() => {
                        this.showHeroVisual();
                    }, 3000);
                }
            }
        } else {
            // No background image, show visual after minimum delay
            this.showHeroVisualWithMinDelay();
        }
        
        // Update hero badge
        const heroBadge = document.querySelector('#hero-dynamic .hero-badge span');
        if (heroBadge && hero.badge) {
            heroBadge.textContent = hero.badge;
        }

        // Update hero title
        const heroTitle = document.querySelector('#hero-dynamic .hero-title .main-title');
        if (heroTitle && hero.title) {
            heroTitle.innerHTML = hero.title.replace(/\n/g, '<br>');
        }

        // Update hero description
        const heroDescription = document.querySelector('#hero-dynamic .hero-description');
        if (heroDescription && hero.description) {
            heroDescription.textContent = hero.description;
        }

        // Update primary button
        const primaryButton = document.querySelector('#hero-dynamic .hero-buttons .btn-primary');
        if (primaryButton && hero.primaryButton) {
            primaryButton.textContent = hero.primaryButton.text;
            if (hero.primaryButton.link) {
                primaryButton.setAttribute('href', hero.primaryButton.link);
            }
        }

        // Update secondary button
        const secondaryButton = document.querySelector('#hero-dynamic .hero-buttons .btn-outline');
        if (secondaryButton && hero.secondaryButton) {
            secondaryButton.textContent = hero.secondaryButton.text;
            if (hero.secondaryButton.link) {
                secondaryButton.setAttribute('href', hero.secondaryButton.link);
            }
        }

        // Update hero stats
        const statNumber = document.querySelector('#hero-dynamic .stat-number');
        const statLabel = document.querySelector('#hero-dynamic .stat-label');
        if (statNumber && statLabel && hero.stats) {
            statNumber.textContent = hero.stats.students || '1500+';
            statLabel.textContent = hero.stats.label || 'Happy Students';
        }

        // Hide loading and show dynamic content
        this.hideHeroLoading();

    }

    hideHeroLoading() {
        const loadingElement = document.getElementById('hero-loading');
        const dynamicElement = document.getElementById('hero-dynamic');
        
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }
        
        if (dynamicElement) {
            dynamicElement.style.display = 'block';
        }
    }

    showHeroVisualWithMinDelay() {
        // Ensure placeholder shows for at least 800ms for better UX
        const minDisplayTime = 800; // milliseconds
        const elapsedTime = Date.now() - (this.heroVisualLoadStartTime || 0);
        const remainingTime = Math.max(0, minDisplayTime - elapsedTime);
        
        if (remainingTime > 0) {
            setTimeout(() => {
                this.showHeroVisual();
            }, remainingTime);
        } else {
            this.showHeroVisual();
        }
    }

    showHeroVisual() {
        // Prevent multiple calls
        if (this.heroVisualShown) return;
        this.heroVisualShown = true;
        
        const heroVisualLoading = document.getElementById('hero-visual-loading');
        const heroMainImage = document.getElementById('hero-main-image');
        
        if (heroVisualLoading) {
            // Fade out effect
            heroVisualLoading.style.transition = 'opacity 0.3s ease-out';
            heroVisualLoading.style.opacity = '0';
            setTimeout(() => {
                heroVisualLoading.style.display = 'none';
            }, 300);
        }
        
        if (heroMainImage) {
            // Fade in effect
            heroMainImage.style.opacity = '0';
            heroMainImage.style.display = 'block';
            heroMainImage.style.transition = 'opacity 0.3s ease-in';
            setTimeout(() => {
                heroMainImage.style.opacity = '1';
            }, 10);
        }
    }

    renderQuickFactsSection() {
        if (!this.content.quickFacts || !this.content.quickFacts.enabled) return;

        const quickFacts = this.content.quickFacts;
        const dynamicContainer = document.getElementById('quick-facts-dynamic');
        if (!dynamicContainer) return;

        // Create dynamic content
        let dynamicContent = `
            <h2 class="quick-facts-title">${quickFacts.title || 'Our results in numbers'}</h2>
            <div class="quick-facts-grid">
        `;

        // Create fact cards
        quickFacts.facts.forEach((fact, index) => {
            const factNumber = fact.number || '0';
            const factLabel = fact.label || 'Fact';
            const factIcon = fact.icon || 'award';
            
            dynamicContent += `
                <div class="fact-card">
                    <div class="fact-icon">
                        <i data-lucide="${factIcon}"></i>
                    </div>
                    <div class="fact-number">
                        <span class="counter-number" data-target="${factNumber.replace('+', '')}">0</span>
                        ${factNumber.includes('+') ? '<span class="fact-accent">+</span>' : ''}
                    </div>
                    <div class="fact-label">${factLabel}</div>
                </div>
            `;
        });

        dynamicContent += `</div>`;

        // Replace static content with dynamic content
        dynamicContainer.innerHTML = dynamicContent;

        // Show the dynamic content and hide loading placeholder
        const loadingContainer = document.getElementById('quick-facts-loading');
        if (loadingContainer) {
            loadingContainer.style.display = 'none';
        }
        dynamicContainer.style.display = 'block';

        // Reinitialize Lucide icons for the new content
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    renderWhyChooseSection() {
        if (!this.content.whyChoose || !this.content.whyChoose.enabled) return;

        const whyChoose = this.content.whyChoose;
        const dynamicContainer = document.getElementById('why-choose-dynamic');
        if (!dynamicContainer) return;

        // Create dynamic content
        let dynamicContent = `
            <div class="section-header text-center">
                <h2 class="section-title">${whyChoose.title || 'Why Choose Marigold?'}</h2>
                <div class="title-accent"></div>
            </div>
            
            <div class="why-choose-content">
                <div class="benefits-list">
        `;

        // Create benefit cards
        whyChoose.benefits.forEach((benefit, index) => {
            const benefitTitle = benefit.title || 'Benefit';
            const benefitDescription = benefit.description || 'Description';
            const benefitIcon = benefit.icon || 'users';
            
            dynamicContent += `
                <div class="benefit-card">
                    <div class="benefit-icon">
                        <i data-lucide="${benefitIcon}"></i>
                    </div>
                    <div class="benefit-content">
                        <h3>${benefitTitle}</h3>
                        <p>${benefitDescription}</p>
                    </div>
                </div>
            `;
        });

        // Add image section
        const whyChooseImageUrl = whyChoose.backgroundImage || (window.getImageFallback ? window.getImageFallback('School Building', 600, 400) : '');
        const whyChooseFallback = window.getImageFallback ? window.getImageFallback('School Building', 600, 400) : '';
        
        dynamicContent += `
                </div>
                
                <div class="why-choose-image">
                    <img src="${whyChooseImageUrl}" alt="Marigold School - Modern Learning Environment" data-fallback="${whyChooseFallback}" onerror="if(window.handleImageError){window.handleImageError(this,'School Building');}else{this.style.display='none';this.onerror=null;}">
                </div>
            </div>
        `;

        // Replace static content with dynamic content
        dynamicContainer.innerHTML = dynamicContent;

        // Show the dynamic content and hide loading placeholder
        const loadingContainer = document.getElementById('why-choose-loading');
        if (loadingContainer) {
            loadingContainer.style.display = 'none';
        }
        dynamicContainer.style.display = 'block';

        // Reinitialize Lucide icons for the new content
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    renderMissionSection() {
        if (!this.content.mission || !this.content.mission.enabled) return;

        const mission = this.content.mission;
        
        // Update mission card
        const missionCard = document.querySelector('.mission-card.mission');
        if (missionCard && mission.mission) {
            const title = missionCard.querySelector('.mission-card-title');
            const description = missionCard.querySelector('.mission-card-description');
            if (title) title.textContent = mission.mission.title;
            if (description) description.textContent = mission.mission.description;
        }

        // Update vision card
        const visionCard = document.querySelector('.mission-card.vision');
        if (visionCard && mission.vision) {
            const title = visionCard.querySelector('.mission-card-title');
            const description = visionCard.querySelector('.mission-card-description');
            if (title) title.textContent = mission.vision.title;
            if (description) description.textContent = mission.vision.description;
        }

        // Update values card
        const valuesCard = document.querySelector('.mission-card.values');
        if (valuesCard && mission.values) {
            const title = valuesCard.querySelector('.mission-card-title');
            const description = valuesCard.querySelector('.mission-card-description');
            if (title) title.textContent = mission.values.title;
            if (description) description.textContent = mission.values.description;
        }

    }

    renderProgramsSection() {
        if (!this.content.programs || !this.content.programs.enabled) return;

        const programs = this.content.programs;
        const dynamicContainer = document.getElementById('programs-dynamic');
        if (!dynamicContainer) return;

        // Create dynamic content
        let dynamicContent = `
            <div class="section-header text-center">
                <h2 class="section-title">${programs.title || 'Academic Programs'}</h2>
                <p class="section-subtitle">${programs.subtitle || 'Comprehensive education from early years to secondary level'}</p>
            </div>
            
            <div class="programs-grid">
        `;

        // Create program cards
        programs.programs.forEach((program, index) => {
            const programTitle = program.title || 'Program';
            const programDescription = program.description || 'Description';
            const programIcon = program.icon || 'graduation-cap';
            const programImage = program.image || program.imageUrl || (window.getImageFallback ? window.getImageFallback('Program', 400, 300) : '');
            const programFallback = window.getImageFallback ? window.getImageFallback('Program', 400, 300) : '';
            
            
            dynamicContent += `
                <div class="program-card">
                    <div class="program-image">
                        <img src="${programImage}" alt="${programTitle}" data-fallback="${programFallback}" onerror="if(window.handleImageError){window.handleImageError(this,'Program');}else{this.style.display='none';this.onerror=null;}">
                        <div class="program-overlay">
                            <div class="program-icon">
                                <i data-lucide="${programIcon}"></i>
                            </div>
                        </div>
                    </div>
                    <div class="program-content">
                        <h3>${programTitle}</h3>
                        <p>${programDescription}</p>
                        <a href="/academics.html" class="program-link">
                            Learn More <i data-lucide="arrow-right"></i>
                        </a>
                    </div>
                </div>
            `;
        });

        dynamicContent += `</div>`;

        // Replace static content with dynamic content
        dynamicContainer.innerHTML = dynamicContent;

        // Show the dynamic content and hide loading placeholder
        const loadingContainer = document.getElementById('programs-loading');
        if (loadingContainer) {
            loadingContainer.style.display = 'none';
        }
        dynamicContainer.style.display = 'block';

        // Reinitialize Lucide icons for the new content
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    async renderNebToppersSection() {
        try {
            // Fetch featured NEB toppers from API
            const cacheManager = window.cacheManager;
            let data;
            
            if (cacheManager) {
                data = await cacheManager.fetch('/api/content/neb-toppers/featured/homepage?limit=6');
            } else {
                const response = await fetch('/api/content/neb-toppers/featured/homepage?limit=6');
                data = await response.json();
            }
            
            if (!data.success || !data.toppers || data.toppers.length === 0) {
                console.log('No featured NEB toppers to display');
                return;
            }
            
            const toppers = data.toppers;
            const toppersCarousel = document.getElementById('toppers-carousel');
            if (!toppersCarousel) {
                console.warn('Toppers carousel container not found');
                return;
            }
            
            // Generate topper cards
            let toppersHTML = '';
            toppers.forEach(topper => {
                const photoUrl = topper.photoUrl || (window.getImageFallback ? window.getImageFallback('Student Photo', 300, 300) : '');
                const quote = topper.quote || 'Success is the result of hard work and dedication.';
                const faculty = topper.faculty ? `, ${topper.faculty}` : '';
                const fallbackUrl = window.getImageFallback ? window.getImageFallback('Student Photo', 300, 300) : '';
                
                toppersHTML += `
                    <div class="topper-card">
                        <div class="topper-image-wrapper">
                            <div class="topper-image">
                                <img src="${photoUrl}" alt="${topper.name}" loading="lazy" data-fallback="${fallbackUrl}" onerror="if(window.handleImageError){window.handleImageError(this,'Student Photo');}else{this.style.display='none';this.onerror=null;}">
                            </div>
                        </div>
                        <div class="topper-content">
                            <h3 class="topper-name">${topper.name}</h3>
                            <p class="topper-details">Batch ${topper.batchYear}, GPA: ${topper.gpa}${faculty}</p>
                            <blockquote class="topper-quote">
                                "${quote}"
                            </blockquote>
                        </div>
                    </div>
                `;
            });
            
            // Update carousel content
            toppersCarousel.innerHTML = toppersHTML;
            
            // Reinitialize Owl Carousel after dynamic content is loaded
            setTimeout(() => {
                if (typeof initializeToppersCarousel === 'function') {
                    initializeToppersCarousel();
                }
            }, 500);
            
        } catch (error) {
            console.error('Error loading NEB toppers:', error);
        }
    }

    async renderAlumniSection() {
        try {
            const alumniCarousel = document.getElementById('alumni-carousel');
            if (!alumniCarousel) {
                console.warn('Alumni carousel container not found');
                return;
            }
            
            // Fetch featured alumni from API
            const cacheManager = window.cacheManager;
            let data;
            
            try {
                if (cacheManager) {
                    data = await cacheManager.fetch('/api/content/alumni/featured/homepage');
                } else {
                    const response = await fetch('/api/content/alumni/featured/homepage');
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    data = await response.json();
                }
            } catch (fetchError) {
                console.error('Error fetching alumni data:', fetchError);
                // Clear static content even on error
                alumniCarousel.innerHTML = '';
                return;
            }
            
            if (!data.success || !data.alumni || data.alumni.length === 0) {
                console.log('No featured alumni to display');
                // Clear static content if no data
                alumniCarousel.innerHTML = '';
                return;
            }
            
            const alumni = data.alumni;
            
            // Generate alumni cards
            let alumniHTML = '';
            alumni.forEach(alumnus => {
                const photoUrl = alumnus.photoUrl || (window.getImageFallback ? window.getImageFallback('Alumni Photo', 300, 300) : '');
                const quote = alumnus.quote || alumnus.testimonial || 'Proud to be a Marigold alumnus!';
                const university = alumnus.university ? ` at ${alumnus.university}` : '';
                const fallbackUrl = window.getImageFallback ? window.getImageFallback('Alumni Photo', 300, 300) : '';
                
                alumniHTML += `
                    <div class="alumni-card">
                        <div class="alumni-image">
                            <img src="${photoUrl}" alt="${alumnus.name}" loading="lazy" data-fallback="${fallbackUrl}" onerror="if(window.handleImageError){window.handleImageError(this,'Alumni Photo');}else{this.style.display='none';this.onerror=null;}">
                        </div>
                        <div class="alumni-content">
                            <h3 class="alumni-name">${alumnus.name}</h3>
                            <p class="alumni-batch">Batch ${alumnus.batchYear}</p>
                            <p class="alumni-position">${alumnus.profession}${university}</p>
                            <blockquote class="alumni-quote">
                                "${quote}"
                            </blockquote>
                        </div>
                    </div>
                `;
            });
            
            // Update carousel content - this will replace the static content
            alumniCarousel.innerHTML = alumniHTML;
            
            // Reinitialize Owl Carousel after dynamic content is loaded
            setTimeout(() => {
                if (typeof initializeAlumniCarousel === 'function') {
                    initializeAlumniCarousel();
                }
            }, 500);
            
        } catch (error) {
            console.error('Error loading alumni:', error);
            // Clear static content on error
            const alumniCarousel = document.getElementById('alumni-carousel');
            if (alumniCarousel) {
                alumniCarousel.innerHTML = '';
            }
        }
    }

    renderTestimonialsSection() {
        if (!this.content.testimonials || !this.content.testimonials.enabled) return;

        const testimonials = this.content.testimonials;
        const dynamicContainer = document.getElementById('testimonials-dynamic');
        if (!dynamicContainer) return;

           // Create dynamic content with new design matching about page
           let dynamicContent = `
               <div class="testimonials-header text-center">
                   <div class="testimonials-badge">Testimonials</div>
                   <h2 class="testimonials-title">${testimonials.title || 'Our trusted parents & students'}</h2>
                   <p class="testimonials-subtitle">${testimonials.subtitle || 'Our mission is to drive progress and enhance the lives of our students by delivering superior education and holistic development that exceeds expectations.'}</p>
               </div>
               
               <div class="testimonials-carousel-container">
                   <div class="testimonials-carousel owl-carousel owl-theme" id="testimonials-carousel">
           `;

        // Create testimonial cards with new design
        testimonials.items.forEach((testimonial, index) => {
            const testimonialName = testimonial.name || 'Parent';
            const testimonialHandle = testimonial.handle || 'parent_of_student';
            const testimonialText = testimonial.text || 'Great school!';
            const testimonialAvatar = testimonial.avatar || testimonial.imageUrl || '/images/testimonial-2.jpg';
            const testimonialRating = testimonial.rating || 5;
            
            // Generate star rating
            let starsHtml = '';
            for (let i = 1; i <= 5; i++) {
                if (i <= testimonialRating) {
                    starsHtml += `<i data-lucide="star" class="star filled" fill="currentColor"></i>`;
                } else {
                    starsHtml += `<i data-lucide="star" class="star"></i>`;
                }
            }
            
           dynamicContent += `
               <div class="testimonial-card">
                   <div class="testimonial-quote">
                       <i data-lucide="quote"></i>
                   </div>
                   <blockquote class="testimonial-text">
                       "${testimonialText}"
                   </blockquote>
                   <div class="testimonial-author">
                       <div class="author-image">
                           <div class="dummy-image-card testimonial-author-dummy" id="testimonial-${index + 1}-dummy"></div>
                           <img src="${testimonialAvatar}" alt="${testimonialName}" class="img-fluid" loading="lazy" data-dummy="testimonial-${index + 1}-dummy" style="display: none;">
                       </div>
                       <div class="author-info">
                           <h4 class="author-name">${testimonialName}</h4>
                           <div class="author-rating">
                               ${starsHtml}
                           </div>
                           <p class="author-role">${testimonialHandle}</p>
                       </div>
                   </div>
               </div>
           `;
        });

        dynamicContent += `
                   </div>
                   
                   <!-- Navigation Arrows -->
                   <div class="testimonials-nav">
                       <button class="testimonials-nav-btn testimonials-nav-prev" aria-label="Previous testimonials">
                           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                               <path d="m15 18-6-6 6-6"></path>
                           </svg>
                       </button>
                       <button class="testimonials-nav-btn testimonials-nav-next" aria-label="Next testimonials">
                           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                               <path d="m9 18 6-6-6-6"></path>
                           </svg>
                       </button>
                   </div>
                   
                   <!-- Pagination Dots -->
                   <div class="testimonials-dots" id="testimonials-dots"></div>
               </div>
        `;

        // Replace static content with dynamic content
        dynamicContainer.innerHTML = dynamicContent;

        // Show the dynamic content and hide loading placeholder
        const loadingContainer = document.getElementById('testimonials-loading');
        if (loadingContainer) {
            loadingContainer.style.display = 'none';
        }
        dynamicContainer.style.display = 'block';

        // Handle image loading for testimonials
        if (typeof window.handleImageLoading === 'function') {
            window.handleImageLoading();
        }

        // Reinitialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        // Reinitialize Owl Carousel after dynamic content is loaded
        setTimeout(() => {
            if (typeof initializeTestimonialsCarousel === 'function') {
                initializeTestimonialsCarousel();
            }
        }, 500);
    }

    renderGallerySection() {
        if (!this.content.gallery || !this.content.gallery.enabled) return;

        const gallery = this.content.gallery;
        const dynamicContainer = document.getElementById('gallery-dynamic');
        if (!dynamicContainer) return;

        // Create dynamic content
        let dynamicContent = `
            <div class="section-header text-center">
                <h2 class="section-title">${gallery.title || 'School Life in Pictures'}</h2>
                <p class="section-subtitle">${gallery.subtitle || 'A glimpse into our vibrant school community'}</p>
            </div>
            
            <div class="gallery-grid">
        `;

        // Create gallery items
        gallery.items.forEach((item, index) => {
            const itemTitle = item.title || 'Gallery Item';
            const itemDescription = item.description || 'Description';
            const itemImage = item.image || item.imageUrl || (window.getImageFallback ? window.getImageFallback('Gallery', 400, 300) : '');
            const itemFallback = window.getImageFallback ? window.getImageFallback('Gallery', 400, 300) : '';
            const albumId = item.id || null;
            
            
            dynamicContent += `
                <div class="gallery-item" ${albumId ? `data-album-id="${albumId}"` : ''}>
                    <img src="${itemImage}" alt="${itemTitle}" data-fallback="${itemFallback}" onerror="if(window.handleImageError){window.handleImageError(this,'Gallery');}else{this.style.display='none';this.onerror=null;}">
                    <div class="gallery-overlay">
                        <h3>${itemTitle}</h3>
                    </div>
                </div>
            `;
        });

        dynamicContent += `
            </div>
            
            <div class="gallery-cta text-center">
                <a href="/gallery.html" class="btn btn-primary">
                    <i data-lucide="image"></i>
                    View Full Gallery
                </a>
            </div>
        `;

        // Replace static content with dynamic content
        dynamicContainer.innerHTML = dynamicContent;

        // Show the dynamic content and hide loading placeholder
        const loadingContainer = document.getElementById('gallery-loading');
        if (loadingContainer) {
            loadingContainer.style.display = 'none';
        }
        dynamicContainer.style.display = 'block';

        // Add click handlers to gallery items
        this.setupGalleryClickHandlers();
    }

    setupGalleryClickHandlers() {
        const galleryItems = document.querySelectorAll('.gallery-item[data-album-id]');
        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                this.openGalleryLightbox(item);
            });
        });
    }

    renderContactSection() {
        if (!this.content.contact || !this.content.contact.enabled) return;

        const contact = this.content.contact;
        const dynamicContainer = document.getElementById('contact-dynamic');
        if (!dynamicContainer) return;

        // Create dynamic content
        let dynamicContent = `
            <div class="contact-content">
                <div class="contact-info">
                    <div class="section-header">
                        <h2 class="section-title">${contact.title || 'Get in Touch'}</h2>
                        <p class="section-subtitle">${contact.subtitle || 'We\'d love to hear from you'}</p>
                    </div>
                    
                    <div class="contact-items">
        `;

        // Create contact items
        if (contact.info) {
            if (contact.info.address) {
                dynamicContent += `
                    <div class="contact-item">
                        <div class="contact-icon">
                            <i data-lucide="map-pin"></i>
                        </div>
                        <div class="contact-text">
                            <h4>Address</h4>
                            <p>${contact.info.address}</p>
                        </div>
                    </div>
                `;
            }
            
            if (contact.info.phone) {
                dynamicContent += `
                    <div class="contact-item">
                        <div class="contact-icon">
                            <i data-lucide="phone"></i>
                        </div>
                        <div class="contact-text">
                            <h4>Phone</h4>
                            <p>${contact.info.phone}</p>
                        </div>
                    </div>
                `;
            }
            
            if (contact.info.email) {
                dynamicContent += `
                    <div class="contact-item">
                        <div class="contact-icon">
                            <i data-lucide="mail"></i>
                        </div>
                        <div class="contact-text">
                            <h4>Email</h4>
                            <p>${contact.info.email}</p>
                        </div>
                    </div>
                `;
            }
            
            if (contact.info.hours) {
                dynamicContent += `
                    <div class="contact-item">
                        <div class="contact-icon">
                            <i data-lucide="clock"></i>
                        </div>
                        <div class="contact-text">
                            <h4>Office Hours</h4>
                            <p>${contact.info.hours}</p>
                        </div>
                    </div>
                `;
            }
        }

        dynamicContent += `
                    </div>
                </div>
                
                <!-- Right Column - Contact Form -->
                <div class="contact-form-column">
                    <div class="contact-form-card">
                        <!-- Contact form will be loaded dynamically by contact-form.js -->
                    </div>
                </div>
            </div>
        `;

        // Preserve existing contact forms before replacing content
        const existingContactForms = dynamicContainer.querySelectorAll('.contact-form');
        const preservedForms = [];
        existingContactForms.forEach(form => {
            const formCard = form.closest('.contact-form-card');
            if (formCard) {
                preservedForms.push(formCard.innerHTML);
            }
        });

        // Replace static content with dynamic content
        dynamicContainer.innerHTML = dynamicContent;

        // Restore preserved contact forms
        const contactFormCards = dynamicContainer.querySelectorAll('.contact-form-card');
        contactFormCards.forEach((card, index) => {
            if (preservedForms[index]) {
                card.innerHTML = preservedForms[index];
            }
        });

        // Show the dynamic content and hide loading placeholder
        const loadingContainer = document.getElementById('contact-loading');
        if (loadingContainer) {
            loadingContainer.style.display = 'none';
        }
        dynamicContainer.style.display = 'block';

        // Reinitialize Lucide icons for the new content
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        // Reinitialize contact forms after homepage content is loaded
        setTimeout(() => {
            if (window.contactFormInstance && typeof window.contactFormInstance.createContactForm === 'function') {
                window.contactFormInstance.createContactForm();
                window.contactFormInstance.initEventListeners();
            }
        }, 500);
    }

    async openGalleryLightbox(item) {
        const albumId = item.getAttribute('data-album-id');
        const titleElement = item.querySelector('.gallery-overlay h3');
        
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
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.homepageLoader = new HomepageLoader();
});
