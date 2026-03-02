// Academy Central Style Events & Notices Page Loader - Marigold School
// Handles dynamic content loading for the modern events and notices page

class EventsPageLoader {
    constructor() {
        this.baseUrl = '/api/content';
        this.init();
    }

    async init() {
        try {
            await this.loadPageContent();
            this.setupEventListeners();
            this.initializeComponents();
        } catch (error) {
            console.error('Error initializing events page:', error);
            this.showError('Failed to load page content. Please refresh the page.');
        }
    }

    async loadPageContent() {
        try {
            // Load all events and notices data
            const [eventsData, noticesData, announcementsData] = await Promise.all([
                this.fetchEventsData(),
                this.fetchNoticesData(),
                this.fetchAnnouncementsData()
            ]);

            // Populate content into HIDDEN sections FIRST
            this.renderFeaturedEvent(eventsData.featured);
            this.renderUpcomingEvents(eventsData.upcoming);
            this.renderPastEvents(eventsData.past);
            this.renderImportantNotices(noticesData);
            this.renderAnnouncements(announcementsData);
            this.renderPrincipalMessage();
            this.renderHighlights(eventsData.highlights);
            
            // THEN show all sections at once (no flash!)
            this.hideAllLoadingPlaceholders();

        } catch (error) {
            console.error('Error loading page content:', error);
            throw error;
        }
    }

    hideAllLoadingPlaceholders() {
        // Hide featured hero loading and show content
        this.hideFeaturedHeroLoading();
        
        // Hide upcoming events loading
        this.hideUpcomingEventsLoading();
        
        // Hide all other section loading placeholders
        const loadingElements = [
            'past-events-loading',
            'notices-loading',
            'highlights-loading'
        ];
        
        const contentElements = [
            'past-events-content',
            'notices-content',
            'highlights-content'
        ];
        
        loadingElements.forEach((loadingId, index) => {
            const loadingEl = document.getElementById(loadingId);
            const contentEl = document.getElementById(contentElements[index]);
            
            if (loadingEl) {
                loadingEl.style.display = 'none';
            }
            if (contentEl) {
                contentEl.style.display = 'block';
            }
        });
    }

    async fetchEventsData() {
        try {
            // Use cache manager for better performance
            const cacheManager = window.cacheManager;
            
            // Fetch featured hero data
            let featuredResult = null;
            if (cacheManager) {
                featuredResult = await cacheManager.fetch(`${this.baseUrl}/events-content?section=featured_hero`);
            } else {
                const featuredResponse = await fetch(`${this.baseUrl}/events-content?section=featured_hero`);
                featuredResult = await featuredResponse.json();
            }
            
            let featuredData = null;
            
            if (featuredResult) {
                
                // Check for data in both 'content' and 'data' fields
                const contentArray = featuredResult.content || featuredResult.data;
                
                if (featuredResult.success && contentArray && Array.isArray(contentArray)) {
                    
                    // Extract featured hero data
                    const titleData = contentArray.find(item => item.key === 'title');
                    const descriptionData = contentArray.find(item => item.key === 'description');
                    const buttonData = contentArray.find(item => item.key === 'button_text');
                    const imageData = contentArray.find(item => item.key === 'image');
                    
                    if (titleData && descriptionData) {
                        // Find past event ID if available
                        const pastEventIdData = contentArray.find(item => item.key === 'past_event_id');
                        const pastEventId = pastEventIdData?.content || null;
                        
                        featuredData = {
                            title: titleData.title || titleData.content || '',
                            description: descriptionData.content || descriptionData.title || '',
                            buttonText: buttonData?.content || buttonData?.title || 'Learn More',
                            image: imageData?.imageUrl || imageData?.content || '',
                            pastEventId: pastEventId,
                            enabled: true
                        };
                    } else {
                    }
                } else {
                }
            } else {
            }

            // Fetch all events and highlights in parallel
            let eventsResult, highlightsResult;
            
            if (cacheManager) {
                [eventsResult, highlightsResult] = await Promise.all([
                    cacheManager.fetch(`${this.baseUrl}/events`),
                    cacheManager.fetch(`${this.baseUrl}/events-content?section=highlights`)
                ]);
            } else {
            const [eventsResponse, highlightsResponse] = await Promise.all([
                    fetch(`${this.baseUrl}/events`),
                    fetch(`${this.baseUrl}/events-content?section=highlights`)
                ]);
                eventsResult = await eventsResponse.json();
                highlightsResult = await highlightsResponse.json();
            }

            let upcomingEvents = [];
            let pastEvents = [];
            let highlightsData = null;

            
            if (eventsResult && eventsResult.success && eventsResult.content) {
            upcomingEvents = eventsResult.content.upcoming || [];
            pastEvents = eventsResult.content.past || [];
            }

            
            if (highlightsResult) {
                if (highlightsResult.success && highlightsResult.data && highlightsResult.data.length > 0) {
                    highlightsData = highlightsResult.data[0]; // Get the first highlight
                } else {
                    // Try to use announcements as fallback for highlights
                    try {
                        let announcementsResult;
                        if (cacheManager) {
                            announcementsResult = await cacheManager.fetch(`${this.baseUrl}/events-content?section=announcements`);
                        } else {
                            const announcementsResponse = await fetch(`${this.baseUrl}/events-content?section=announcements`);
                            announcementsResult = await announcementsResponse.json();
                        }
                        
                        if (announcementsResult && announcementsResult.success && announcementsResult.data && announcementsResult.data.length > 0) {
                                const announcement = announcementsResult.data[0];
                                highlightsData = {
                                    title: announcement.title,
                                    content: announcement.content,
                                    badge: 'Announcement',
                                    imageUrl: announcement.imageUrl
                                };
                        }
                    } catch (fallbackError) {
                        console.error('Fallback announcements fetch error:', fallbackError);
                    }
                }
            } else {
            }

            return { 
                featured: featuredData, 
                upcoming: upcomingEvents, 
                past: pastEvents,
                highlights: highlightsData
            };
        } catch (error) {
            console.error('Error fetching events data:', error);
            return { featured: null, upcoming: [], past: [] };
        }
    }

    async fetchNoticesData() {
        try {
            const cacheManager = window.cacheManager;
            let data;
            
            if (cacheManager) {
                data = await cacheManager.fetch(`${this.baseUrl}/notices`);
            } else {
                const response = await fetch(`${this.baseUrl}/notices`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
                data = await response.json();
            }
            
            return data.content || [];
        } catch (error) {
            console.error('Error fetching notices data:', error);
            return [];
        }
    }

    async fetchAnnouncementsData() {
        try {
            const cacheManager = window.cacheManager;
            let data;
            
            if (cacheManager) {
                data = await cacheManager.fetch(`${this.baseUrl}/announcements`);
            } else {
                const response = await fetch(`${this.baseUrl}/announcements`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
                data = await response.json();
            }
            
            return data.content || [];
        } catch (error) {
            console.error('Error fetching announcements data:', error);
            return [];
        }
    }

    showFeaturedHeroLoading() {
        const loadingPlaceholder = document.getElementById('featured-hero-loading');
        const contentContainer = document.getElementById('featured-hero-content');
        
        if (loadingPlaceholder) {
            loadingPlaceholder.style.display = 'block';
        }
        if (contentContainer) {
            contentContainer.style.display = 'none';
        }
    }

    hideFeaturedHeroLoading() {
        const loadingPlaceholder = document.getElementById('featured-hero-loading');
        const contentContainer = document.getElementById('featured-hero-content');
        
        if (loadingPlaceholder) {
            loadingPlaceholder.style.display = 'none';
        }
        if (contentContainer) {
            contentContainer.style.cssText = 'display: block !important; opacity: 1;';
        }
    }

    showUpcomingEventsLoading() {
        const loadingContainer = document.getElementById('upcoming-events-loading');
        const contentContainer = document.getElementById('upcoming-events-content');
        const noResultsContainer = document.getElementById('upcoming-events-no-results');
        
        if (loadingContainer) {
            loadingContainer.style.display = 'block';
        }
        if (contentContainer) {
            contentContainer.style.display = 'none';
        }
        if (noResultsContainer) {
            noResultsContainer.style.display = 'none';
        }
    }

    hideUpcomingEventsLoading() {
        const loadingContainer = document.getElementById('upcoming-events-loading');
        const contentContainer = document.getElementById('upcoming-events-content');
        
        if (loadingContainer) {
            loadingContainer.style.display = 'none';
        }
        if (contentContainer) {
            contentContainer.style.cssText = 'display: block !important; opacity: 1;';
        }
    }

    renderFeaturedEvent(featuredEvent) {
        const heroSection = document.querySelector('.featured-hero .hero-content');
        if (!heroSection) return;

        if (featuredEvent && featuredEvent.title) {
            const heroTitle = heroSection.querySelector('.hero-title');
            const heroDescription = heroSection.querySelector('.hero-description');
            const heroBtn = heroSection.querySelector('.hero-btn');

            heroTitle.textContent = `Featured Event: ${featuredEvent.title}`;
            heroDescription.textContent = featuredEvent.description || '';
            heroBtn.textContent = featuredEvent.buttonText || 'Learn More';

            // Set background image if available
            const heroBg = document.querySelector('.hero-bg');
            if (featuredEvent.image && heroBg) {
                heroBg.style.backgroundImage = `url(${featuredEvent.image})`;
                heroBg.style.backgroundSize = 'cover';
                heroBg.style.backgroundPosition = 'center';
                heroBg.style.backgroundRepeat = 'no-repeat';
            }

            // Add click event to learn more button
            heroBtn.onclick = () => {
                this.showEventDetails(featuredEvent);
            };

        } else {
            // Show default featured event
            this.renderDefaultFeaturedEvent();
        }
    }

    renderDefaultFeaturedEvent() {
        const heroSection = document.querySelector('.featured-hero .hero-content');
        if (!heroSection) return;

        const heroTitle = heroSection.querySelector('.hero-title');
        const heroDescription = heroSection.querySelector('.hero-description');
        const heroBtn = heroSection.querySelector('.hero-btn');

        heroTitle.textContent = 'Featured Event: Annual Science Fair';
        heroDescription.textContent = 'Join us for an exciting showcase of student projects and scientific discoveries. Explore innovative exhibits and interactive demonstrations.';
        heroBtn.textContent = 'Learn More';
    }

    renderUpcomingEvents(upcomingEvents) {
        const eventsGrid = document.querySelector('.events-grid');
        const noResultsContainer = document.getElementById('upcoming-events-no-results');
        
        if (!eventsGrid) return;

        eventsGrid.innerHTML = '';

        // Sort events by date (closest first) and limit to 6
        const sortedEvents = (upcomingEvents || [])
            .sort((a, b) => new Date(a.eventDate || a.date) - new Date(b.eventDate || b.date))
            .slice(0, 6);


        if (sortedEvents && sortedEvents.length > 0) {
            sortedEvents.forEach(event => {
                const eventCard = this.createEventCard(event);
                eventsGrid.appendChild(eventCard);
            });
            
            // Hide no results message
            if (noResultsContainer) {
                noResultsContainer.style.display = 'none';
            }
        } else {
            // Show no results message
            if (noResultsContainer) {
                noResultsContainer.style.display = 'block';
            }
        }
    }

    createEventCard(event) {
        const card = document.createElement('div');
        card.className = 'event-card';
        
        // Generate gradient background based on event category
        const gradients = {
            'academic': 'linear-gradient(45deg, #667eea, #764ba2)',
            'social': 'linear-gradient(45deg, #f093fb, #f5576c)',
            'sports': 'linear-gradient(45deg, #4facfe, #00f2fe)',
            'cultural': 'linear-gradient(45deg, #43e97b, #38f9d7)',
            'default': 'linear-gradient(45deg, #667eea, #764ba2)'
        };
        
        const gradient = gradients[event.category?.toLowerCase()] || gradients.default;
        
        card.innerHTML = `
            <div class="event-image" style="background-image: ${event.image ? `url(${event.image})` : gradient};"></div>
            <div class="event-content">
                <h3 class="event-title">${event.title}</h3>
                <p class="event-description">${event.description}</p>
            </div>
        `;

        // Add click event
        card.addEventListener('click', () => {
            
            // Create a clean copy of the event data to prevent modification
            const cleanEventData = {
                id: event.id,
                title: event.title,
                description: event.description,
                date: event.date,
                time: event.time,
                location: event.location,
                image: event.image,
                category: event.category
            };
            
            this.navigateToEventDetails(cleanEventData);
        });

        return card;
    }

    renderDefaultUpcomingEvents() {
        const eventsGrid = document.querySelector('.events-grid');
        if (!eventsGrid) return;

        const defaultEvents = [
            {
                title: 'Debate Club Finals',
                description: 'Witness the final round of the debate competition.',
                category: 'academic',
                gradient: 'linear-gradient(45deg, #667eea, #764ba2)'
            },
            {
                title: 'Math Olympiad',
                description: 'Challenge your math skills in the annual Olympiad.',
                category: 'academic',
                gradient: 'linear-gradient(45deg, #f093fb, #f5576c)'
            },
            {
                title: 'Spring Dance',
                description: 'Celebrate the season with music and dance.',
                category: 'social',
                gradient: 'linear-gradient(45deg, #4facfe, #00f2fe)'
            },
            {
                title: 'Science Fair',
                description: 'Showcase innovative projects and discoveries.',
                category: 'academic',
                gradient: 'linear-gradient(45deg, #43e97b, #38f9d7)'
            },
            {
                title: 'Sports Day',
                description: 'Annual athletics and sports competition.',
                category: 'social',
                gradient: 'linear-gradient(45deg, #fa709a, #fee140)'
            },
            {
                title: 'Art Exhibition',
                description: 'Display of student artwork and creativity.',
                category: 'social',
                gradient: 'linear-gradient(45deg, #a8edea, #fed6e3)'
            }
        ];

        defaultEvents.forEach(event => {
            const card = this.createEventCard(event);
            eventsGrid.appendChild(card);
        });
    }

    renderPastEvents(pastEvents) {
        
        const loadingContainer = document.getElementById('past-events-loading');
        const contentContainer = document.getElementById('past-events-content');
        
        if (!loadingContainer || !contentContainer) {
            console.warn('Past events containers not found');
            return;
        }

        // Hide loading placeholder
        loadingContainer.style.display = 'none';
        
        // Clear existing content
        contentContainer.innerHTML = '';

        if (pastEvents && pastEvents.length > 0) {
            pastEvents.forEach(event => {
                const pastEventItem = this.createPastEventItem(event);
                contentContainer.appendChild(pastEventItem);
            });
        } else {
            // Show default past events
            this.renderDefaultPastEvents();
        }

        // Show the content
        contentContainer.style.display = 'flex';
    }

    createPastEventItem(event) {
        const item = document.createElement('div');
        item.className = 'past-event-item';
        
        // Store the complete event data in a data attribute for click handling
        item.setAttribute('data-event', JSON.stringify(event));
        
        const gradients = [
            'linear-gradient(45deg, #667eea, #764ba2)',
            'linear-gradient(45deg, #f093fb, #f5576c)',
            'linear-gradient(45deg, #4facfe, #00f2fe)',
            'linear-gradient(45deg, #43e97b, #38f9d7)',
            'linear-gradient(45deg, #fa709a, #fee140)'
        ];
        
        const randomGradient = gradients[Math.floor(Math.random() * gradients.length)];
        item.style.backgroundImage = event.image ? `url(${event.image})` : randomGradient;

        // Add overlay with event details
        const overlay = document.createElement('div');
        overlay.className = 'past-event-overlay';
        
        const title = document.createElement('div');
        title.className = 'past-event-title';
        title.textContent = event.title || 'Past Event';
                
        const date = document.createElement('div');
        date.className = 'past-event-date';
        date.textContent = event.date ? new Date(event.date).toLocaleDateString() : 'Past Event';
        
        overlay.appendChild(title);
        overlay.appendChild(date);
        item.appendChild(overlay);

        // Add click event - use the stored event data
        item.addEventListener('click', () => {
            this.navigateToEventDetails(event);
        });

        return item;
    }

    renderDefaultPastEvents() {
        const contentContainer = document.getElementById('past-events-content');
        if (!contentContainer) return;

        const gradients = [
            'linear-gradient(45deg, #667eea, #764ba2)',
            'linear-gradient(45deg, #f093fb, #f5576c)',
            'linear-gradient(45deg, #4facfe, #00f2fe)',
            'linear-gradient(45deg, #43e97b, #38f9d7)',
            'linear-gradient(45deg, #fa709a, #fee140)'
        ];

        const defaultEvents = [
            {
                title: 'Annual Science Fair 2024',
                description: 'Students showcased innovative projects and scientific discoveries in our annual science exhibition.',
                date: '2024-03-15',
                category: 'Academic'
            },
            {
                title: 'Cultural Day Celebration',
                description: 'A vibrant celebration of our diverse cultural heritage with performances and traditional displays.',
                date: '2024-02-28',
                category: 'Cultural'
            },
            {
                title: 'Sports Championship',
                description: 'Annual inter-house sports competition with exciting matches and athletic achievements.',
                date: '2024-01-20',
                category: 'Sports'
            },
            {
                title: 'Art Exhibition',
                description: 'Showcase of student creativity and artistic talent through various mediums and styles.',
                date: '2023-12-10',
                category: 'Cultural'
            },
            {
                title: 'Graduation Ceremony',
                description: 'Celebrating the achievements of our graduating students and their journey ahead.',
                date: '2023-11-25',
                category: 'Academic'
            }
        ];

        gradients.forEach((gradient, index) => {
            const item = document.createElement('div');
            item.className = 'past-event-item';
            item.style.backgroundImage = gradient;
            
            // Add overlay with event details
            const overlay = document.createElement('div');
            overlay.className = 'past-event-overlay';
            
            const title = document.createElement('div');
            title.className = 'past-event-title';
            title.textContent = defaultEvents[index]?.title || `Past Event ${index + 1}`;
            
            const description = document.createElement('div');
            description.textContent = defaultEvents[index]?.description || 'This was a past event that has already concluded.';
            
            const date = document.createElement('div');
            date.className = 'past-event-date';
            date.textContent = defaultEvents[index]?.date ? new Date(defaultEvents[index].date).toLocaleDateString() : 'Past Event';
            
            overlay.appendChild(title);
            overlay.appendChild(description);
            overlay.appendChild(date);
            item.appendChild(overlay);
            
            // Add click event for default past events
            item.addEventListener('click', () => {
                const eventData = {
                    id: `past-event-${index + 1}`,
                    title: defaultEvents[index]?.title || `Past Event ${index + 1}`,
                    description: defaultEvents[index]?.description || 'This was a past event that has already concluded.',
                    image: gradient,
                    type: 'past',
                    date: defaultEvents[index]?.date || '2024-06-10',
                    time: '2:00 PM - 5:00 PM',
                    venue: 'Main Campus Hall',
                    organizer: 'Event Organizer',
                    category: defaultEvents[index]?.category || 'Social'
                };
                this.navigateToEventDetails(eventData);
            });
            
            contentContainer.appendChild(item);
        });
    }

    renderImportantNotices(notices) {
        console.log(notices)
        
        const loadingContainer = document.getElementById('notices-loading');
        const contentContainer = document.getElementById('notices-content');
        
        if (!loadingContainer || !contentContainer) {
            console.warn('Notices containers not found');
            return;
        }

        // Hide loading placeholder
        loadingContainer.style.display = 'none';
        
        // Clear existing content
        contentContainer.innerHTML = '';

        if (notices && notices.length > 0) {
            // Show only first 6 notices initially
            const visibleCount = 6;
            const totalNotices = notices.length;
            
            notices.forEach((notice, index) => {
                const noticeItem = this.createNoticeItem(notice);
                // Hide notices beyond the first 6
                if (index >= visibleCount) {
                    noticeItem.style.display = 'none';
                    noticeItem.setAttribute('data-hidden', 'true');
                }
                contentContainer.appendChild(noticeItem);
            });
            
            // Add "Show All" button if there are more than 6 notices
            if (totalNotices > visibleCount) {
                const showAllButton = document.createElement('button');
                showAllButton.className = 'show-all-notices-btn';
                showAllButton.textContent = 'Show All';
                let isExpanded = false;
                
                showAllButton.addEventListener('click', (e) => {
                    e.stopPropagation(); // Prevent event bubbling
                    
                    // Get all notice items
                    const allNotices = contentContainer.querySelectorAll('.notice-item');
                    const hiddenNotices = Array.from(allNotices).filter(item => 
                        item.getAttribute('data-hidden') === 'true'
                    );
                    
                    if (isExpanded) {
                        // Hide notices beyond first 6
                        hiddenNotices.forEach(item => {
                            item.style.display = 'none';
                        });
                        showAllButton.textContent = 'Show All';
                        isExpanded = false;
                    } else {
                        // Show all notices
                        hiddenNotices.forEach(item => {
                            item.style.display = 'flex';
                        });
                        showAllButton.textContent = 'Show Less';
                        isExpanded = true;
                    }
                });
                contentContainer.appendChild(showAllButton);
            }
        } else {
            // Show default notices
            this.renderDefaultNotices();
        }

        // Show the content
        contentContainer.style.display = 'flex';
    }

    createNoticeItem(notice) {
        const item = document.createElement('div');
        item.className = 'notice-item';
        
        // Get appropriate icon based on category
        const iconMap = {
            'exam': 'file-text',
            'holiday': 'calendar',
            'admission': 'user-plus',
            'event': 'calendar',
            'urgent': 'alert-circle',
            'default': 'file-text'
        };
        
        const icon = iconMap[notice.category] || iconMap.default;
        
        // Format published date
        let publishedDate = '';
        if (notice.publishDate) {
            try {
                const date = new Date(notice.publishDate);
                publishedDate = date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                });
            } catch (e) {
                console.error('Error formatting date:', e);
            }
        }
        
        item.innerHTML = `
            <div class="notice-icon">
                <i data-lucide="${icon}"></i>
            </div>
            <div class="notice-content">
                <h4>${notice.title}</h4>
                <p>${notice.description}</p>
                ${publishedDate ? `<span class="notice-date">Published: ${publishedDate}</span>` : ''}
            </div>
        `;

        // Add click event to navigate to notice details
        item.style.cursor = 'pointer';
        item.addEventListener('click', () => {
            window.location.href = `/noticeDetails.html?id=${notice.id}`;
        });

        // Re-initialize icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        return item;
    }

    renderDefaultNotices() {
        const contentContainer = document.getElementById('notices-content');
        if (!contentContainer) return;

        const defaultNotices = [
            {
                id: 'default-1',
                title: 'Scholarship Applications Open',
                description: 'Deadline: May 15',
                category: 'exam'
            },
            {
                id: 'default-2',
                title: 'Parent-Teacher Conference',
                description: 'Meeting: May 20, 3 PM',
                category: 'event'
            },
            {
                id: 'default-3',
                title: 'Mid-Term Exam Schedule',
                description: 'Exams start from May 25',
                category: 'exam'
            },
            {
                id: 'default-4',
                title: 'Extended Library Hours',
                description: 'Library open until 8 PM during exams',
                category: 'event'
            }
        ];

        defaultNotices.forEach(notice => {
            const noticeItem = this.createNoticeItem(notice);
            contentContainer.appendChild(noticeItem);
        });
    }

    renderAnnouncements(announcements) {
        // Check if highlights content already exists (means highlights data was loaded)
        const highlightsContent = document.getElementById('highlights-content');
        if (highlightsContent && highlightsContent.style.display === 'block') {
            return;
        }

        const highlightsCard = document.querySelector('.highlights-card');
        if (!highlightsCard) return;

        if (announcements && announcements.length > 0) {
            const announcement = announcements[0]; // Show first announcement
            this.updateHighlightsCard(announcement);
        } else {
            // Show default announcement
            this.renderDefaultAnnouncement();
        }
    }

    updateHighlightsCard(announcement) {
        const highlightsBadge = document.querySelector('.highlights-badge');
        const highlightsTitle = document.querySelector('.highlights-title');
        const highlightsDescription = document.querySelector('.highlights-description');
        const highlightsImage = document.querySelector('.highlights-image');

        if (highlightsBadge) highlightsBadge.textContent = announcement.type || 'Announcement';
        if (highlightsTitle) highlightsTitle.textContent = announcement.title;
        if (highlightsDescription) highlightsDescription.textContent = announcement.description;
        if (highlightsImage) {
            highlightsImage.style.backgroundImage = announcement.image ? 
                `url(${announcement.image})` : 
                'linear-gradient(45deg, #667eea, #764ba2)';
        }
    }

    renderHighlights(highlightsData) {
        
        const loadingContainer = document.getElementById('highlights-loading');
        const contentContainer = document.getElementById('highlights-content');
        
        if (!loadingContainer || !contentContainer) {
            console.warn('Highlights containers not found');
            return;
        }

        // Hide loading placeholder
        loadingContainer.style.display = 'none';
        
        if (!highlightsData) {
            this.renderDefaultHighlights();
            contentContainer.style.display = 'block';
            return;
        }

        // Completely rebuild the highlights content with database data
        const badgeText = highlightsData.badge || highlightsData.description || 'Announcement';
        const titleText = highlightsData.title || 'New Robotics Lab';
        const descriptionText = highlightsData.content || 'Explore our state-of-the-art robotics lab, equipped with the latest technology for hands-on learning.';
        
        // Build the image style
        let imageStyle = 'background-image: linear-gradient(45deg, #667eea, #764ba2);';
        if (highlightsData.imageUrl && highlightsData.imageUrl !== 'null' && highlightsData.imageUrl.trim() !== '') {
            // Check if it's already a CSS value (like a gradient) or a URL
            if (highlightsData.imageUrl.includes('gradient') || highlightsData.imageUrl.startsWith('linear-') || highlightsData.imageUrl.startsWith('radial-')) {
                // It's already a CSS gradient, use it directly
                imageStyle = `background-image: ${highlightsData.imageUrl};`;
            } else {
                // It's a URL, wrap it in url()
                imageStyle = `background-image: url(${highlightsData.imageUrl}); background-size: cover; background-position: center; background-repeat: no-repeat;`;
            }
        } else {
        }

        // Rebuild the entire highlights card HTML
        contentContainer.innerHTML = `
            <div class="highlights-card">
                <div class="highlights-content">
                    <div class="highlights-badge">${badgeText}</div>
                    <h3 class="highlights-title">${titleText}</h3>
                    <p class="highlights-description">${descriptionText}</p>
                </div>
                <div class="highlights-image" style="${imageStyle}"></div>
            </div>
        `;
        

        // Show the content
        contentContainer.style.display = 'block';
    }

    renderDefaultHighlights() {
        const highlightsBadge = document.querySelector('.highlights-badge');
        const highlightsTitle = document.querySelector('.highlights-title');
        const highlightsDescription = document.querySelector('.highlights-description');

        if (highlightsBadge) highlightsBadge.textContent = 'Announcement';
        if (highlightsTitle) highlightsTitle.textContent = 'New Robotics Lab';
        if (highlightsDescription) highlightsDescription.textContent = 'Explore our state-of-the-art robotics lab, equipped with the latest technology for hands-on learning.';
    }

    renderDefaultAnnouncement() {
        const highlightsBadge = document.querySelector('.highlights-badge');
        const highlightsTitle = document.querySelector('.highlights-title');
        const highlightsDescription = document.querySelector('.highlights-description');

        if (highlightsBadge) highlightsBadge.textContent = 'Announcement';
        if (highlightsTitle) highlightsTitle.textContent = 'New Robotics Lab';
        if (highlightsDescription) highlightsDescription.textContent = 'Explore our state-of-the-art robotics lab, equipped with the latest technology for hands-on learning.';
    }

    renderPrincipalMessage() {
        const principalCard = document.querySelector('.principal-card');
        if (!principalCard) return;

        // This could be loaded from an API or kept as static content
        const principalTitle = document.querySelector('.principal-title');
        const principalDescription = document.querySelector('.principal-description');

        if (principalTitle) principalTitle.textContent = 'A Word from Principal Harper';
        if (principalDescription) principalDescription.textContent = 'Welcome to the new academic year! We are committed to fostering a supportive and challenging environment for all students.';
    }

    async showEventDetails(event) {
        
        let eventData = {
            id: this.generateEventId(event.title),
            title: event.title,
            description: event.description,
            image: event.image,
            type: 'featured',
            date: '2023-09-15',
            time: '2:00 PM - 5:00 PM',
            venue: 'Main Campus Hall',
            organizer: 'Event Organizer',
            category: 'Academic'
        };

        // If there's a past event ID, try to fetch more detailed information
        if (event.pastEventId) {
            try {
                const cacheManager = window.cacheManager;
                let pastEventResult;
                
                if (cacheManager) {
                    pastEventResult = await cacheManager.fetch(`${this.baseUrl}/events-content/${event.pastEventId}`);
                } else {
                    const response = await fetch(`${this.baseUrl}/events-content/${event.pastEventId}`);
                    pastEventResult = await response.json();
                }
                
                if (pastEventResult) {
                    if (pastEventResult.success && pastEventResult.data) {
                        const pastEvent = pastEventResult.data;
                        
                        // Merge past event data with featured event data
                        eventData = {
                            ...eventData,
                            id: pastEvent.id || eventData.id,
                            date: pastEvent.eventDate || eventData.date,
                            time: pastEvent.eventTime || eventData.time,
                            venue: pastEvent.venue || eventData.venue,
                            organizer: pastEvent.organizer || eventData.organizer,
                            category: pastEvent.category || eventData.category,
                            contactInfo: pastEvent.contactInfo || '',
                            eventSchedule: pastEvent.eventSchedule || null,
                            guests: pastEvent.guests || null,
                            registrationEnabled: pastEvent.registrationEnabled || false,
                            locationMap: pastEvent.locationMap || null,
                            helpDesk: pastEvent.helpDesk || ''
                        };
                    }
                }
            } catch (error) {
                console.error('❌ Error fetching past event details:', error);
                // Continue with default data if fetch fails
            }
        }

        // Navigate to event details page
        this.navigateToEventDetails(eventData);
    }

    setupEventListeners() {
        // Event card clicks
        this.setupEventCardClicks();

        // Calendar navigation
        const calendarNavs = document.querySelectorAll('.calendar-nav');
        calendarNavs.forEach(nav => {
            nav.addEventListener('click', (e) => {
                const direction = e.target.closest('.calendar-nav').querySelector('i').getAttribute('data-lucide');
                // Add calendar navigation logic here
            });
        });

        // Day cell clicks
        const dayCells = document.querySelectorAll('.day-cell');
        dayCells.forEach(cell => {
            if (cell.textContent.trim()) {
                cell.addEventListener('click', (e) => {
                    const day = e.target.textContent;
                    // Add day click logic here
                });
            }
        });
    }



    initializeComponents() {
        // Initialize any additional components
        this.initializeCountdown();
        this.initializeAnimations();
    }

    initializeCountdown() {
        // Add countdown timer for featured event if needed
    }

    initializeAnimations() {
        // Add scroll animations or other interactive elements
    }

    showError(message) {
        // Show error message to user
        console.error('Events Page Error:', message);
        
        // Create error display
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #fee2e2;
            color: #dc2626;
            padding: 1rem;
            border-radius: 8px;
            border: 1px solid #fecaca;
            z-index: 1000;
            max-width: 400px;
        `;
        errorDiv.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <i data-lucide="alert-circle" style="width: 20px; height: 20px;"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(errorDiv);
        
        // Re-initialize icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }

    setupEventCardClicks() {
        // Add click listeners to all event cards
        document.addEventListener('click', (e) => {
            const eventCard = e.target.closest('.event-card');
            const pastEventItem = e.target.closest('.past-event-item');
            
            // Only handle past event items, not event cards (they have their own listeners)
            if (pastEventItem) {
                e.preventDefault();
                this.handlePastEventClick(pastEventItem);
            }
            // Remove eventCard handling since it conflicts with specific listeners
        });
    }

    handleEventCardClick(eventCard) {
        // Get event data from the card
        const eventTitle = eventCard.querySelector('.event-title')?.textContent || 'Event';
        const eventDescription = eventCard.querySelector('.event-description')?.textContent || '';
        const eventImage = eventCard.querySelector('.event-image')?.style.backgroundImage || '';
        
        // Create event data object
        const eventData = {
            id: this.generateEventId(eventTitle),
            title: eventTitle,
            description: eventDescription,
            image: eventImage,
            type: 'upcoming',
            date: 'July 15, 2024',
            time: '10:00 AM - 4:00 PM',
            venue: 'Main Campus Hall',
            organizer: 'Science Department',
            category: 'Academic'
        };

        // Navigate to event details page
        this.navigateToEventDetails(eventData);
    }

    handlePastEventClick(pastEventItem) {
        // Get event data from the past event item
        const eventTitle = pastEventItem.querySelector('.past-event-title')?.textContent || 'Past Event';
        const eventDate = pastEventItem.querySelector('.past-event-date')?.textContent || '';
        const eventImage = pastEventItem.style.backgroundImage || '';
        
        // Extract the actual event data from the data attribute if available
        const eventDataAttr = pastEventItem.getAttribute('data-event');
        let eventData;
        
        if (eventDataAttr) {
            try {
                eventData = JSON.parse(eventDataAttr);
            } catch (e) {
                console.error('Error parsing event data:', e);
                eventData = null;
            }
        }
        
        // If no stored data, create from DOM elements
        if (!eventData) {
            eventData = {
                id: this.generateEventId(eventTitle),
                title: eventTitle,
                description: eventDescription,
                image: eventImage,
                type: 'past',
                date: eventDate,
                time: '2:00 PM - 5:00 PM',
                venue: 'Main Campus Hall',
                organizer: 'Event Organizer',
                category: 'Social'
            };
        }

        // Navigate to event details page
        this.navigateToEventDetails(eventData);
    }

    generateEventId(title) {
        // Generate a URL-friendly ID from the title
        return title.toLowerCase()
            .replace(/[^a-z0-9\s]/g, '')
            .replace(/\s+/g, '-')
            .substring(0, 50);
    }

    navigateToEventDetails(eventData) {
        
        // Store event data in sessionStorage for the details page
        sessionStorage.setItem('currentEventData', JSON.stringify(eventData));
        
        // Use the actual event ID from the database, or generate one if not available
        const eventId = eventData.id || this.generateEventId(eventData.title);
        
        
        // Navigate to event details page
        window.location.href = `/eventsDetails.html?id=${eventId}`;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new EventsPageLoader();
});
