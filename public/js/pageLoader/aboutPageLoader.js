class AboutPageLoader {
    constructor() {
        this.content = null;
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
                data = await cacheManager.fetch('/api/content/about');
            } else {
                // Fallback to direct fetch with timeout
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 10000);
                
                const response = await fetch('/api/content/about', {
                    signal: controller.signal
                });
                
                clearTimeout(timeoutId);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                data = await response.json();
            }
            
            if (data && data.success && data.data) {
                // Organize the data by section for easier access
                this.content = {};
                data.data.forEach(item => {
                    if (!this.content[item.section]) {
                        this.content[item.section] = [];
                    }
                    this.content[item.section].push(item);
                });
            } else {
                this.content = null;
            }
        } catch (error) {
            if (error.name === 'AbortError') {
                console.warn('About page content load timeout');
            } else {
                console.warn('❌ Failed to load about page content:', error);
            }
            this.content = null;
        }
        
        // Always hide loading placeholders after attempt (success or failure)
        this.hideAllLoadingPlaceholders();
    }

    hideAllLoadingPlaceholders() {
        // Hide all section loading placeholders
        const sections = ['hero', 'timeline', 'mission', 'quick-facts', 'why-choose', 'leadership', 'facilities', 'achievements', 'testimonials'];
        sections.forEach(section => {
            const loadingEl = document.getElementById(`${section}-loading`);
            const dynamicEl = document.getElementById(`${section}-dynamic`);
            
            if (loadingEl && dynamicEl) {
                loadingEl.style.display = 'none';
                dynamicEl.style.display = 'block';
            }
        });
    }

    renderContent() {
        if (!this.content) {
            return;
        }

        // Render Hero Section
        this.renderHeroSection();
        
        // Render Our Story Timeline Section
        this.renderTimelineSection();
        
        // Render Mission Section
        this.renderMissionSection();
        
        // Render Principal Section
        this.renderPrincipalSection();
        
        // Render Quick Facts Section
        this.renderQuickFactsSection();
        
        // Render Why Choose Us Section
        this.renderWhyChooseSection();
        
        // Render Leadership Section
        this.renderLeadershipSection();
        
        // Render Facilities Section
        this.renderFacilitiesSection();
        
        // Render Achievements Section
        this.renderAchievementsSection();
        
        // Render Testimonials Section
        this.renderTestimonialsSection();
        
        // Render CTA Section
        this.renderCTASection();

        // Initialize counter animations after content is rendered
        setTimeout(() => {
            this.initializeCounterAnimations();
        }, 500);
    }

    renderHeroSection() {
        
        if (!this.content.hero || this.content.hero.length === 0) {
            return;
        }

        const heroData = this.content.hero;
        
        // Update content FIRST (while hidden)
            this.updateHeroContent(heroData);
        
        // THEN show dynamic content and hide loading placeholder
        this.showDynamicContent('hero-dynamic', 'hero-loading');
    }

    updateHeroContent(heroData) {

        // CRITICAL: Clear ALL static content first to prevent flash
        const heroTitle = document.getElementById('hero-title');
        const heroSubtitle = document.getElementById('hero-subtitle');
        const heroActions = document.getElementById('hero-actions');
        
        // Clear static content immediately
        if (heroTitle) heroTitle.textContent = '';
        if (heroSubtitle) heroSubtitle.textContent = '';
        if (heroActions) heroActions.innerHTML = '';

        // Get the main hero data (hero_title key)
        const mainHero = heroData.find(item => item.key === 'hero_title') || heroData[0];
        const applyButton = heroData.find(item => item.key === 'hero_apply_button');
        const visitButton = heroData.find(item => item.key === 'hero_visit_button');

        // NOW update with database content
        // Update hero title
        if (heroTitle && mainHero && mainHero.title) {
            heroTitle.textContent = mainHero.title;
        }

        // Update hero subtitle
        if (heroSubtitle && mainHero && mainHero.content) {
            heroSubtitle.textContent = mainHero.content;
        }

        // Recreate hero action buttons from database data
        if (heroActions && (applyButton || visitButton)) {
            let buttonsHTML = '';
            
            // Create apply button if data exists
            if (applyButton && applyButton.title) {
                buttonsHTML += `
                    <button class="btn btn-primary btn-large" id="hero-apply-btn" onclick="openApplicationModal()">
                        <span class="btn-text">${applyButton.title}</span>
                        <i data-lucide="arrow-right" class="btn-icon"></i>
                    </button>
                `;
            }
            
            // Create visit button if data exists
            if (visitButton && visitButton.title) {
                const visitLink = visitButton.linkUrl || '/contact.html';
                buttonsHTML += `
                    <a href="${visitLink}" class="btn btn-outline-white btn-large" id="hero-visit-btn">
                        <span class="btn-text">${visitButton.title}</span>
                        <i data-lucide="calendar" class="btn-icon"></i>
                    </a>
                `;
            }
            
            heroActions.innerHTML = buttonsHTML;
            
            // Reinitialize Lucide icons for buttons
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }

        // Update background image if available
        if (mainHero && mainHero.imageUrl) {
            const heroSection = document.querySelector('.hero-about');
            if (heroSection) {
                // Use !important to override CSS background
                heroSection.style.setProperty('background', `url('${mainHero.imageUrl}')`, 'important');
                heroSection.style.setProperty('background-size', 'cover', 'important');
                heroSection.style.setProperty('background-position', 'center', 'important');
                heroSection.style.setProperty('background-repeat', 'no-repeat', 'important');
                
                // Debug: Check if the background was actually applied
                setTimeout(() => {
                    const computedStyle = window.getComputedStyle(heroSection);
                }, 100);
            }
        }
    }

    renderTimelineSection() {
        
        // Always hide loading and show dynamic content
        this.showDynamicContent('timeline-dynamic', 'timeline-loading');
        
        if (!this.content.timeline || this.content.timeline.length === 0) {
            return;
        }

        const timelineData = this.content.timeline;

        // Get the timeline title and subtitle
        const timelineTitle = timelineData.find(item => item.key === 'timeline_title');
        
        // Get all timeline events (exclude the title)
        const timelineEvents = timelineData.filter(item => item.key !== 'timeline_title');


        // Update timeline title
        const sectionTitle = document.getElementById('timeline-section-title');
        if (sectionTitle && timelineTitle && timelineTitle.title) {
            sectionTitle.textContent = timelineTitle.title;
        }

        // Update timeline subtitle
        const sectionSubtitle = document.getElementById('timeline-section-subtitle');
        if (sectionSubtitle && timelineTitle && timelineTitle.content) {
            sectionSubtitle.textContent = timelineTitle.content;
        }

        // Update timeline events
        const timelineEventsContainer = document.getElementById('timeline-events');
        if (timelineEventsContainer && timelineEvents.length > 0) {
            
            // Clear existing events
            timelineEventsContainer.innerHTML = '';
            
            // Sort events by orderIndex
            const sortedEvents = timelineEvents.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
            
            sortedEvents.forEach((event, index) => {
                const timelineEvent = this.createTimelineEvent(event, index);
                timelineEventsContainer.appendChild(timelineEvent);
            });
            
        }
    }

    createTimelineEvent(event, index) {
        const timelineEvent = document.createElement('div');
        
        // Alternate between left and right positioning
        const isLeft = index % 2 === 0;
        timelineEvent.className = `timeline-event ${isLeft ? 'timeline-event-left' : 'timeline-event-right'}`;
        
        timelineEvent.innerHTML = `
            ${isLeft ? `
                <div class="timeline-content">
                    <h3 class="timeline-title">${event.title || 'Timeline Event'}</h3>
                    <p class="timeline-description">${event.content || ''}</p>
                    <p class="timeline-date">${event.date || ''}</p>
                </div>
                <div class="timeline-marker"></div>
            ` : `
                <div class="timeline-marker"></div>
                <div class="timeline-content">
                    <h3 class="timeline-title">${event.title || 'Timeline Event'}</h3>
                    <p class="timeline-description">${event.content || ''}</p>
                    <p class="timeline-date">${event.date || ''}</p>
                </div>
            `}
        `;
        
        return timelineEvent;
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

    /**
     * Show dynamic content container and hide loading placeholder
     */
    showDynamicContent(containerId, loadingId = null) {
        
        const container = document.getElementById(containerId);
        
        if (container) {
            // Force remove the inline style and set display to block
            container.removeAttribute('style');
            container.style.display = 'block';
            container.style.visibility = 'visible';
        } else {
        }
        
        // Hide loading placeholder if provided
        if (loadingId) {
            const loadingElement = document.getElementById(loadingId);
            if (loadingElement) {
                loadingElement.style.display = 'none';
            } else {
            }
        }
    }

    renderMissionSection() {
        
        if (!this.content.mission_vision_values || this.content.mission_vision_values.length === 0) {
            return;
        }

        const missionData = this.content.mission_vision_values;
        
        // Show dynamic content and hide loading placeholder
        this.showDynamicContent('mission-dynamic', 'mission-loading');

        // Get the section title (look for section_title key)
        const sectionTitle = missionData.find(item => item.key === 'section_title');
        
        // Get mission, vision, and values data
        const missionItem = missionData.find(item => item.key === 'mission');
        const visionItem = missionData.find(item => item.key === 'vision');
        const valuesItem = missionData.find(item => item.key === 'values');


        // Update section title
        const titleElement = document.getElementById('mission-section-title');
        if (titleElement && sectionTitle && sectionTitle.title) {
            titleElement.textContent = sectionTitle.title;
        }

        // Update mission cards
        const missionCardsContainer = document.getElementById('mission-cards');
        if (missionCardsContainer) {
            
            // Clear existing cards (keep the connector)
            missionCardsContainer.innerHTML = '<div class="mission-connector"></div>';
            
            // Create mission card
            if (missionItem) {
                const missionCard = this.createMissionCard(missionItem, 'mission');
                missionCardsContainer.appendChild(missionCard);
            }
            
            // Create vision card
            if (visionItem) {
                const visionCard = this.createMissionCard(visionItem, 'vision');
                missionCardsContainer.appendChild(visionCard);
            }
            
            // Create values card
            if (valuesItem) {
                const valuesCard = this.createMissionCard(valuesItem, 'values');
                missionCardsContainer.appendChild(valuesCard);
            }
            
        }

        // Reinitialize Lucide icons for the new content
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    createMissionCard(item, cardType) {
        const missionCard = document.createElement('div');
        missionCard.className = `mission-card ${cardType}`;
        
        // Map icon names to valid Lucide icons
        const validIcons = {
            'lightbulb': 'lightbulb',
            'target': 'target', 
            'heart': 'heart',
            'star': 'star',
            'award': 'award',
            'users': 'users',
            'book-open': 'book-open',
            'graduation-cap': 'graduation-cap'
        };
        
        const iconName = validIcons[item.icon] || item.icon || 'lightbulb';
        
        missionCard.innerHTML = `
                    <div class="mission-card-icon">
                <i data-lucide="${iconName}"></i>
                    </div>
            <div class="mission-card-title">${item.title || 'Mission'}</div>
            <div class="mission-card-description">${item.content || 'No description available'}</div>
        `;
        
        return missionCard;
    }

    renderPrincipalSection() {
        
        if (!this.content.principal || this.content.principal.length === 0) {
            return;
        }

        const principalData = this.content.principal;
        
        // Show dynamic content and hide loading placeholder
        this.showDynamicContent('principal-dynamic', 'principal-loading');

        // Get the section title and principal info
        const sectionTitle = principalData.find(item => item.key === 'principal_section_title');
        const principalInfo = principalData.find(item => item.key === 'principal_info');


        // Update section title
        const titleElement = document.getElementById('principal-section-title');
        if (titleElement && sectionTitle && sectionTitle.title) {
            titleElement.textContent = sectionTitle.title;
        }

        // Update principal info
        if (principalInfo) {
            // Update principal name
            const nameElement = document.getElementById('principal-name');
            if (nameElement && principalInfo.name) {
                nameElement.textContent = principalInfo.name;
            }

            // Update principal message
            const messageElement = document.getElementById('principal-message-text');
            if (messageElement && principalInfo.content) {
                messageElement.textContent = principalInfo.content;
            }

            // Update principal image
            const imageElement = document.getElementById('principal-image');
            if (imageElement && principalInfo.imageUrl) {
                imageElement.src = principalInfo.imageUrl;
                imageElement.alt = `${principalInfo.name || 'Principal'} - Principal`;
                
                // Handle image loading
                imageElement.onload = () => {
                    const dummyElement = document.getElementById('principal-dummy');
                    if (dummyElement) {
                        dummyElement.style.display = 'none';
                    }
                    imageElement.style.display = 'block';
                };
                
                imageElement.onerror = () => {
                    console.warn('❌ Failed to load principal image:', principalInfo.imageUrl);
                    // Keep dummy placeholder visible
                };
                
                // Check if image is already loaded (cached)
                if (imageElement.complete && imageElement.naturalHeight !== 0) {
                    const dummyElement = document.getElementById('principal-dummy');
                    if (dummyElement) {
                        dummyElement.style.display = 'none';
                    }
                    imageElement.style.display = 'block';
                }
                
                // Force show image after a short delay as fallback
                setTimeout(() => {
                    if (imageElement.src && imageElement.style.display === 'none') {
                        const dummyElement = document.getElementById('principal-dummy');
                        if (dummyElement) {
                            dummyElement.style.display = 'none';
                        }
                        imageElement.style.display = 'block';
                    }
                }, 1000);
            }

            // Update qualifications
            const qualificationsContainer = document.getElementById('principal-qualifications');
            if (qualificationsContainer && principalInfo.qualifications) {
                
                // Clear existing qualifications
                qualificationsContainer.innerHTML = '';
                
                // Split qualifications by comma and create tags
                const qualifications = principalInfo.qualifications.split(',').map(q => q.trim()).filter(q => q);
                
                qualifications.forEach((qualification, index) => {
                    const tag = document.createElement('span');
                    tag.className = 'qualification-tag';
                    
                    // Choose icon based on qualification type
                    let iconName = 'graduation-cap';
                    if (qualification.toLowerCase().includes('experience') || qualification.toLowerCase().includes('years')) {
                        iconName = 'clock';
                    } else if (qualification.toLowerCase().includes('award') || qualification.toLowerCase().includes('certification')) {
                        iconName = 'award';
                    }
                    
                    tag.innerHTML = `
                        <i data-lucide="${iconName}"></i>
                        ${qualification}
                    `;
                    
                    qualificationsContainer.appendChild(tag);
                });
                
            }
            
        }

        // Reinitialize Lucide icons for the new content
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        // Handle image loading for content
        if (typeof handleImageLoading === 'function') {
            setTimeout(() => handleImageLoading(), 100);
        }
    }

    renderQuickFactsSection() {
        
        if (!this.content.quick_facts || this.content.quick_facts.length === 0) {
            return;
        }

        const quickFactsData = this.content.quick_facts;
        
        // Show dynamic content and hide loading placeholder
        this.showDynamicContent('quick-facts-dynamic', 'quick-facts-loading');

        // Get the section title
        const sectionTitle = quickFactsData.find(item => item.key === 'section_title');
        
        // Get fact items (filter out section_title and items with empty titles)
        const factItems = quickFactsData.filter(item => 
            item.key !== 'section_title' && 
            item.title && 
            item.title.trim() !== '' && 
            item.content && 
            item.content.trim() !== ''
        );


        // Update section title
        const titleElement = document.getElementById('quick-facts-section-title');
        if (titleElement && sectionTitle && sectionTitle.title && sectionTitle.title !== 'test') {
            titleElement.textContent = sectionTitle.title;
        } else {
            // Use default title if section title is not available or is test
            titleElement.textContent = 'Our Results in Numbers';
        }

        // Update fact cards
        const factsGrid = document.getElementById('quick-facts-grid');
        if (factsGrid && factItems.length > 0) {
            
            // Clear existing cards
            factsGrid.innerHTML = '';
            
            // Sort fact items by orderIndex
            const sortedFactItems = factItems.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
            
            sortedFactItems.forEach((fact, index) => {
                const factCard = this.createQuickFactCard(fact);
                factsGrid.appendChild(factCard);
            });
            
        }

        // Reinitialize Lucide icons for the new content
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        // Initialize counter animations for the new content
        setTimeout(() => {
            this.initializeCounterAnimations();
        }, 100);
        
        // Handle image loading for new content
        if (typeof handleImageLoading === 'function') {
            setTimeout(() => handleImageLoading(), 100);
        }
    }

    createQuickFactCard(fact) {
        const factCard = document.createElement('div');
        factCard.className = 'fact-card';
        
        // Map icon names to valid Lucide icons
        const validIcons = {
            'award': 'award',
            'users': 'users',
            'graduation-cap': 'graduation-cap',
            'trophy': 'trophy',
            'star': 'star',
            'book-open': 'book-open',
            'heart': 'heart',
            'clock': 'clock'
        };
        
        const iconName = validIcons[fact.icon] || fact.icon || 'award';
        
        // Extract number from content (remove + and other non-numeric characters)
        const factNumber = fact.content ? fact.content.replace(/[^0-9]/g, '') : '0';
        const hasPlus = fact.content && fact.content.includes('+');
        
        factCard.innerHTML = `
            <div class="fact-icon">
                <i data-lucide="${iconName}"></i>
            </div>
            <div class="fact-number">
                <span class="counter-number" data-target="${factNumber}">0</span>
                ${hasPlus ? '<span class="fact-accent">+</span>' : ''}
            </div>
            <div class="fact-label">${fact.title}</div>
        `;
        
        return factCard;
    }

    renderWhyChooseSection() {
        
        if (!this.content.why_choose_us || this.content.why_choose_us.length === 0) {
            return;
        }

        const whyChooseData = this.content.why_choose_us;
        
        // Show dynamic content and hide loading placeholder
        this.showDynamicContent('why-choose-dynamic', 'why-choose-loading');

        // Get the section title
        const sectionTitle = whyChooseData.find(item => item.key === 'section_title');
        
        // Get feature items (filter out section_title)
        const featureItems = whyChooseData.filter(item => 
            item.key !== 'section_title' && 
            item.title && 
            item.title.trim() !== '' && 
            item.content && 
            item.content.trim() !== ''
        );


        // Create dynamic content
        const dynamicTitle = sectionTitle && sectionTitle.title && sectionTitle.title !== 'test' 
            ? sectionTitle.title 
            : 'Why Choose Us';
            

        // Sort feature items by orderIndex
        const sortedFeatureItems = featureItems.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
        
        let dynamicContent = `
            <div class="section-header">
                <h2 class="section-title">${dynamicTitle}</h2>
            </div>
            
            <div class="features-grid">
        `;

        sortedFeatureItems.forEach((feature, index) => {
            const featureCard = this.createWhyChooseFeatureCard(feature, index);
            dynamicContent += featureCard.outerHTML;
        });

        dynamicContent += `</div>`;

        // Replace static content with dynamic content
        const dynamicContainer = document.getElementById('why-choose-dynamic');
        if (dynamicContainer) {
            dynamicContainer.innerHTML = dynamicContent;
            
            // Handle image loading for each feature card after DOM insertion
            this.setupWhyChooseImageLoading(sortedFeatureItems);
        }
        
        // Handle image loading for new content
        if (typeof handleImageLoading === 'function') {
            setTimeout(() => handleImageLoading(), 100);
        }
    }

    createWhyChooseFeatureCard(feature, index) {
        const featureCard = document.createElement('div');
        featureCard.className = 'feature-card';
        
            const featureTitle = feature.title || 'Feature';
            const featureDescription = feature.content || 'Description';
            const featureImage = feature.imageUrl || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop&auto=format';
            
        featureCard.innerHTML = `
                    <div class="feature-image">
                        <div class="dummy-image-card feature-dummy" id="dynamic-feature-${index}-dummy"></div>
                <img src="${featureImage}" alt="${featureTitle}" class="img-fluid" loading="lazy" data-dummy="dynamic-feature-${index}-dummy" style="display: none;" id="dynamic-feature-${index}-image">
                    </div>
                    <h3 class="feature-title">${featureTitle}</h3>
                    <p class="feature-description">${featureDescription}</p>
        `;
        
        return featureCard;
    }

    setupWhyChooseImageLoading(featureItems) {
        
        featureItems.forEach((feature, index) => {
            const imageElement = document.getElementById(`dynamic-feature-${index}-image`);
            const dummyElement = document.getElementById(`dynamic-feature-${index}-dummy`);
            
            if (!imageElement || !dummyElement) {
                console.warn(`❌ Could not find image or dummy elements for feature card ${index + 1}`);
                return;
            }
            
            const featureImage = feature.imageUrl;
            
            // Check if image is already loaded (cached)
            if (imageElement.complete && imageElement.naturalHeight !== 0) {
                dummyElement.style.display = 'none';
                imageElement.style.display = 'block';
                return;
            }
            
            // Set up image loading handlers
            imageElement.onload = () => {
                dummyElement.style.display = 'none';
                imageElement.style.display = 'block';
            };
            
            imageElement.onerror = () => {
                console.warn(`❌ Failed to load feature image ${index + 1}:`, featureImage);
                // Keep dummy placeholder visible
            };
            
            // Force show image after a short delay as fallback
            setTimeout(() => {
                if (imageElement.src && imageElement.style.display === 'none') {
                    dummyElement.style.display = 'none';
                    imageElement.style.display = 'block';
                }
            }, 1000);
        });
    }

    renderLeadershipSection() {
        
        if (!this.content.leadership || this.content.leadership.length === 0) {
            return;
        }

        const leadershipData = this.content.leadership;
        
        // Show dynamic content and hide loading placeholder
        this.showDynamicContent('leadership-dynamic', 'leadership-loading');

        // Get the section title
        const sectionTitle = leadershipData.find(item => item.key === 'section_title');
        
        // Get leadership members (filter out section_title)
        const leadershipMembers = leadershipData.filter(item => 
            item.key !== 'section_title' && 
            (item.name || item.title) && 
            (item.name || item.title).trim() !== ''
        );


        // Create dynamic content
        const dynamicTitle = sectionTitle && sectionTitle.title && sectionTitle.title !== 'test' 
            ? sectionTitle.title 
            : 'Our Leadership Team';
            
        const dynamicSubtitle = sectionTitle && sectionTitle.content && sectionTitle.content !== 'test'
            ? sectionTitle.content
            : 'Meet the dedicated professionals guiding our institution';
            

        // Sort leadership members by orderIndex
        const sortedLeadershipMembers = leadershipMembers.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
        
        let dynamicContent = `
            <div class="section-header">
                <h2 class="section-title">${dynamicTitle}</h2>
                <p class="section-subtitle">${dynamicSubtitle}</p>
            </div>
            
            <div class="leadership-grid">
        `;

        sortedLeadershipMembers.forEach((member, index) => {
            const leadershipCard = this.createLeadershipCard(member, index);
            dynamicContent += leadershipCard.outerHTML;
        });

        dynamicContent += `</div>`;

        // Replace static content with dynamic content
        const dynamicContainer = document.getElementById('leadership-dynamic');
        if (dynamicContainer) {
            dynamicContainer.innerHTML = dynamicContent;
            
            // Handle image loading for each leadership card after DOM insertion
            this.setupLeadershipImageLoading(sortedLeadershipMembers);
        }
        
        // Handle image loading for new content
        if (typeof handleImageLoading === 'function') {
            setTimeout(() => handleImageLoading(), 100);
        }
    }

    createLeadershipCard(member, index) {
        const leadershipCard = document.createElement('div');
        leadershipCard.className = 'leader-card';
        
        const memberName = member.name || member.title || 'Team Member';
        const memberPosition = member.position || member.role || 'Position';
            const memberImage = member.imageUrl || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&auto=format';
            
        leadershipCard.innerHTML = `
                    <div class="leader-image">
                        <div class="dummy-image-card leader-dummy" id="dynamic-leader-${index}-dummy"></div>
                <img src="${memberImage}" alt="${memberName}" class="img-fluid" loading="lazy" data-dummy="dynamic-leader-${index}-dummy" style="display: none;" id="dynamic-leader-${index}-image">
                        <div class="leader-image-overlay">${memberName}</div>
                    </div>
                    <h3 class="leader-name">${memberName}</h3>
                    <p class="leader-position">${memberPosition}</p>
        `;
        
        return leadershipCard;
    }

    setupLeadershipImageLoading(leadershipMembers) {
        
        leadershipMembers.forEach((member, index) => {
            const imageElement = document.getElementById(`dynamic-leader-${index}-image`);
            const dummyElement = document.getElementById(`dynamic-leader-${index}-dummy`);
            
            if (!imageElement || !dummyElement) {
                console.warn(`❌ Could not find image or dummy elements for leadership card ${index + 1}`);
                return;
            }
            
            const memberImage = member.imageUrl;
            
            // Check if image is already loaded (cached)
            if (imageElement.complete && imageElement.naturalHeight !== 0) {
                dummyElement.style.display = 'none';
                imageElement.style.display = 'block';
                return;
            }
            
            // Set up image loading handlers
            imageElement.onload = () => {
                dummyElement.style.display = 'none';
                imageElement.style.display = 'block';
            };
            
            imageElement.onerror = () => {
                console.warn(`❌ Failed to load leadership image ${index + 1}:`, memberImage);
                // Keep dummy placeholder visible
            };
            
            // Force show image after a short delay as fallback
            setTimeout(() => {
                if (imageElement.src && imageElement.style.display === 'none') {
                    dummyElement.style.display = 'none';
                    imageElement.style.display = 'block';
                }
            }, 1000);
        });
    }

    renderFacilitiesSection() {
        
        if (!this.content.facilities || this.content.facilities.length === 0) {
            return;
        }

        const facilitiesData = this.content.facilities;
        
        // Show dynamic content and hide loading placeholder
        this.showDynamicContent('facilities-dynamic', 'facilities-loading');

        // Get facility items (all items in the facilities section)
        const facilityItems = facilitiesData.filter(item => 
            item.imageUrl && 
            item.imageUrl.trim() !== ''
        );


        // Update facilities grid
        const facilitiesGrid = document.getElementById('facilities-grid');
        if (facilitiesGrid && facilityItems.length > 0) {
            
            // Clear existing items
            facilitiesGrid.innerHTML = '';
            
            // Sort facility items by orderIndex
            const sortedFacilityItems = facilityItems.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
            
            // Create facility items based on order
            sortedFacilityItems.forEach((facility, index) => {
                // Determine the facility item class based on index
                let facilityClass = 'facility-small';
                if (index === 0) {
                    facilityClass = 'facility-main';
                } else if (index === 1) {
                    facilityClass = 'facility-secondary';
                }
                
                const facilityItem = this.createFacilityItem(facility, index, facilityClass);
                facilitiesGrid.appendChild(facilityItem);
            });
            
        }

        // Handle image loading for new content
        if (typeof handleImageLoading === 'function') {
            setTimeout(() => handleImageLoading(), 100);
        }
    }

    createFacilityItem(facility, index, facilityClass) {
        const facilityItem = document.createElement('div');
        facilityItem.className = facilityClass;
        
        const facilityTitle = facility.title || 'Facility';
        const facilityImage = facility.imageUrl || '/images/marigold-school-building2.png';
        
        facilityItem.innerHTML = `
            <div class="dummy-image-card ${facilityClass}-dummy" id="dynamic-facility-${index}-dummy"></div>
            <img src="${facilityImage}" alt="${facilityTitle}" class="img-fluid" loading="lazy" data-dummy="dynamic-facility-${index}-dummy" style="display: none;" id="dynamic-facility-${index}-image">
            <div class="facility-image-overlay">${facilityTitle}</div>
        `;
        
        // Set up image loading handler
        setTimeout(() => {
            const imageElement = document.getElementById(`dynamic-facility-${index}-image`);
            const dummyElement = document.getElementById(`dynamic-facility-${index}-dummy`);
            
            if (!imageElement || !dummyElement) {
                console.warn(`❌ Could not find image or dummy elements for facility ${index + 1}`);
                return;
            }
            
            // Check if image is already loaded (cached)
            if (imageElement.complete && imageElement.naturalHeight !== 0) {
                dummyElement.style.display = 'none';
                imageElement.style.display = 'block';
                return;
            }
            
            // Set up image loading handlers
            imageElement.onload = () => {
                dummyElement.style.display = 'none';
                imageElement.style.display = 'block';
            };
            
            imageElement.onerror = () => {
                console.warn(`❌ Failed to load facility image ${index + 1}:`, facilityImage);
                // Keep dummy placeholder visible
            };
            
            // Force show image after a short delay as fallback
            setTimeout(() => {
                if (imageElement.src && imageElement.style.display === 'none') {
                    dummyElement.style.display = 'none';
                    imageElement.style.display = 'block';
                }
            }, 1000);
        }, 100);
        
        return facilityItem;
    }

    renderAchievementsSection() {
        
        if (!this.content.achievements || this.content.achievements.length === 0) {
            return;
        }

        const achievementsData = this.content.achievements;
        
        // Show dynamic content and hide loading placeholder
        this.showDynamicContent('achievements-dynamic', 'achievements-loading');

        // Get the section title
        const sectionTitle = achievementsData.find(item => item.key === 'section_title');
        
        // Get achievement items (filter out section_title)
        const achievementItems = achievementsData.filter(item => 
            item.key !== 'section_title' && 
            item.title && 
            item.title.trim() !== '' && 
            item.content && 
            item.content.trim() !== ''
        );


        // Create dynamic content
        const dynamicTitle = sectionTitle && sectionTitle.title && sectionTitle.title !== 'test' 
            ? sectionTitle.title 
            : 'Achievements & Awards';
            

        // Sort achievement items by orderIndex
        const sortedAchievementItems = achievementItems.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
        
        let dynamicContent = `
            <div class="section-header">
                <h2 class="section-title">${dynamicTitle}</h2>
            </div>
            
            <div class="achievements-grid">
        `;

        sortedAchievementItems.forEach((achievement, index) => {
            const achievementCard = this.createAchievementCard(achievement);
            dynamicContent += achievementCard.outerHTML;
        });

        dynamicContent += `</div>`;

        // Replace static content with dynamic content
        const dynamicContainer = document.getElementById('achievements-dynamic');
        if (dynamicContainer) {
        dynamicContainer.innerHTML = dynamicContent;
        }

        // Reinitialize Lucide icons for the new content
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    createAchievementCard(achievement) {
        const achievementCard = document.createElement('div');
        achievementCard.className = 'achievement-card';
        
            const achievementTitle = achievement.title || 'Achievement';
            const achievementDescription = achievement.content || 'Description';
            const achievementIcon = achievement.icon || 'trophy';
            
        achievementCard.innerHTML = `
                    <div class="achievement-icon">
                        <i data-lucide="${achievementIcon}"></i>
                    </div>
                    <h3 class="achievement-title">${achievementTitle}</h3>
                    <p class="achievement-description">${achievementDescription}</p>
        `;
        
        return achievementCard;
    }

    renderTestimonialsSection() {
        
        if (!this.content.testimonials || this.content.testimonials.length === 0) {
            // Show empty state if no testimonials
            this.showDynamicContent('testimonials-dynamic', 'testimonials-loading');
            return;
        }

        const testimonialsData = this.content.testimonials;

        // Get the section title and subtitle
        const sectionTitle = testimonialsData.find(item => item.key === 'section_title');
        
        // Get testimonial items (filter out section_title and items with empty content)
        const testimonialItems = testimonialsData.filter(item => 
            item.key !== 'section_title' && 
            item.key.startsWith('testimonial_') &&
            item.content && 
            item.content.trim() !== '' &&
            item.name &&
            item.name.trim() !== ''
        );


        // CRITICAL: Clear ALL static content first (while hidden)
        const titleElement = document.querySelector('.testimonials-title');
        const subtitleElement = document.querySelector('.testimonials-subtitle');
        
        // Clear static content immediately
        if (titleElement) titleElement.textContent = '';
        if (subtitleElement) subtitleElement.textContent = '';
        
        // NOW update with database content
        if (titleElement && sectionTitle && sectionTitle.title && sectionTitle.title !== 'test') {
            titleElement.textContent = sectionTitle.title;
        }

        if (subtitleElement && sectionTitle && sectionTitle.content && sectionTitle.content !== 'test') {
            subtitleElement.textContent = sectionTitle.content;
        }

        // Update testimonials carousel with database data (while hidden)
        if (testimonialItems.length > 0) {
            this.updateTestimonialsCarousel(testimonialItems);
        }

        // Reinitialize Lucide icons for the content
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        // Handle image loading for content
        if (typeof handleImageLoading === 'function') {
            setTimeout(() => handleImageLoading(), 100);
        }
        
        // NOW show dynamic content with database data already loaded
        this.showDynamicContent('testimonials-dynamic', 'testimonials-loading');
        
        // Initialize testimonials carousel after content is shown
        setTimeout(() => {
            if (typeof window.initializeTestimonialsCarousel === 'function') {
                window.initializeTestimonialsCarousel();
            }
        }, 500);
    }

    updateTestimonialsCarousel(testimonialItems) {
        
        const carousel = document.getElementById('testimonials-carousel');
        if (!carousel) {
            console.warn('❌ Testimonials carousel not found');
            return;
        }

        // Sort testimonial items by orderIndex
        const sortedTestimonialItems = testimonialItems.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
        
        // Clear ALL existing testimonial cards (both static and owl-generated)
        carousel.innerHTML = '';

        // Create testimonial cards from database data
        sortedTestimonialItems.forEach((testimonial, index) => {
            const testimonialCard = this.createTestimonialCard(testimonial, index);
            carousel.appendChild(testimonialCard);
        });

    }

    createTestimonialCard(testimonial, index) {
        const testimonialCard = document.createElement('div');
        testimonialCard.className = 'testimonial-card';
        
        const testimonialName = testimonial.name || 'Testimonial';
        const testimonialRole = testimonial.role || 'Community Member';
        const testimonialContent = testimonial.content || 'Great experience!';
        const testimonialImage = testimonial.imageUrl || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=60&h=60&fit=crop&auto=format';
        const testimonialRating = testimonial.rating || 5;
        
        // Create star rating HTML
        const starsHTML = Array.from({ length: 5 }, (_, i) => 
            `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="star" class="lucide lucide-star star ${i < testimonialRating ? 'filled' : ''}"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path></svg>`
        ).join('');
        
        testimonialCard.innerHTML = `
            <div class="testimonial-quote">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="quote" class="lucide lucide-quote"><path d="M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"></path><path d="M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"></path></svg>
            </div>
            <blockquote class="testimonial-text">
                "${testimonialContent}"
            </blockquote>
            <div class="testimonial-author">
                <div class="author-image">
                    <div class="dummy-image-card testimonial-author-dummy" id="testimonial-${index + 1}-dummy" style="display: none;"></div>
                    <img src="${testimonialImage}" alt="${testimonialName}" class="img-fluid" loading="lazy" data-dummy="testimonial-${index + 1}-dummy" style="display: block;" id="testimonial-${index + 1}-image">
                </div>
                <div class="author-info">
                    <h4 class="author-name">${testimonialName}</h4>
                    <div class="author-rating">
                        ${starsHTML}
                    </div>
                    <p class="author-role">${testimonialRole}</p>
                </div>
            </div>
        `;
        
        return testimonialCard;
    }

    /**
     * Render CTA Section
     */
    renderCTASection() {
        
        const ctaSection = document.querySelector('.cta-about');
        if (!ctaSection) {
            console.warn('CTA section not found in DOM');
            return;
        }

        if (!this.content.cta || this.content.cta.length === 0) {
            this.renderCTAFallback();
            return;
        }

        const ctaData = this.content.cta;

        // Show CTA container and hide loading placeholder
        this.showDynamicContent('cta-container', 'cta-loading');

        // Extract CTA data from database
        const ctaTitle = ctaData.find(item => item.key === 'cta_title');
        const ctaSectionData = ctaData.find(item => item.key === 'cta_section');
        const applyButton = ctaData.find(item => item.key === 'cta_apply_button');
        const visitButton = ctaData.find(item => item.key === 'cta_visit_button');


            // Configure CTA component options
            const ctaOptions = {
            title: ctaTitle?.title || ctaSectionData?.title || 'Discover your Future',
            subtitle: ctaTitle?.content || ctaSectionData?.content || 'Join the Marigold School community and give your child the best foundation for their future.',
                primaryButton: {
                text: applyButton?.title || 'Apply Now',
                url: applyButton?.linkUrl || '#',
                    onclick: 'openApplicationModal()'
                },
                secondaryButton: {
                text: visitButton?.title || 'Schedule a Visit',
                url: visitButton?.linkUrl || '/contact.html',
                    onclick: null
                },
            backgroundImage: ctaTitle?.imageUrl || ctaSectionData?.imageUrl || null
            };


            // Initialize CTA component
            if (typeof window.CTAManager !== 'undefined') {
                window.CTAManager.render('about-cta', 'cta-container', ctaOptions);
            } else {
                console.warn('CTA Manager not available, using fallback rendering');
                this.renderCTAFallback(ctaOptions);
        }
    }

    /**
     * Fallback CTA rendering when CTA Manager is not available
     */
    renderCTAFallback(options = {}) {
        const ctaContainer = document.getElementById('cta-container');
        if (!ctaContainer) {
            console.error('CTA container not found in fallback');
            return;
        }
        
        // Show container and hide loading placeholder
        this.showDynamicContent('cta-container', 'cta-loading');

        const {
            title = 'Discover your Future',
            subtitle = 'Join the Marigold School community and give your child the best foundation for their future.',
            primaryButton = { text: 'Apply Now', onclick: 'openApplicationModal()' },
            secondaryButton = { text: 'Schedule a Visit', url: '/contact.html' },
            backgroundImage = null
        } = options;

        const backgroundStyle = backgroundImage ? `style="background-image: url('${backgroundImage}'); background-size: cover; background-position: center;"` : '';

        ctaContainer.innerHTML = `
            <div class="container">
                <div class="cta-content text-center">
                    <h2 class="cta-title">${title}</h2>
                    <p class="cta-subtitle">${subtitle}</p>
                    <div class="cta-buttons">
                        <button class="btn btn-white btn-large" onclick="${primaryButton.onclick}">
                            <span class="btn-text">${primaryButton.text}</span>
                            <i data-lucide="arrow-right" class="btn-icon"></i>
                        </button>
                        <a href="${secondaryButton.url}" class="btn btn-outline-white btn-large">
                            <span class="btn-text">${secondaryButton.text}</span>
                            <i data-lucide="calendar" class="btn-icon"></i>
                        </a>
                    </div>
                </div>
            </div>
        `;

        // Reinitialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.aboutPageLoader = new AboutPageLoader();
});
