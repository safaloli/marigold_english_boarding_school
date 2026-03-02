class EventsDetailsPageLoader {
    constructor() {
        this.content = null;
        this.eventId = this.getEventIdFromUrl();
        this.init();
    }

    getEventIdFromUrl() {
        // Extract event ID from URL parameters or hash
        const urlParams = new URLSearchParams(window.location.search);
        let eventId = urlParams.get('id') || urlParams.get('eventId');
        
        // If no event ID in params, try to extract from hash or pathname
        if (!eventId) {
            const hash = window.location.hash.replace('#', '');
            const pathname = window.location.pathname;
            
            // Check hash first
            if (hash) {
                eventId = hash;
            }
            // Then check if pathname contains event details
            else if (pathname.includes('eventsDetails.html')) {
                // Try to get event ID from URL hash or default
                eventId = null; // Will be determined from available data
            }
        }
        
        
        return eventId || 'annual-science-fair'; // Default event ID
    }

    generateEventId(title) {
        // Generate a URL-friendly ID from the title
        return title.toLowerCase()
            .replace(/[^a-z0-9\s]/g, '')
            .replace(/\s+/g, '-')
            .substring(0, 50);
    }

    async init() {
        await this.loadContent();
        this.renderContent();
    }

    async loadContent() {
        try {
            // Always try to fetch real data from database first
            
            // Try multiple API endpoints to find the event
            let response = null;
            let data = null;
            
            // First, try to fetch by event ID from events-content
            try {
                const cacheBuster = `?t=${Date.now()}`;
                response = await fetch(`/api/content/events-content/${this.eventId}${cacheBuster}`, {
                    headers: {
                        'Cache-Control': 'no-cache',
                        'Pragma': 'no-cache'
                    }
                });
                if (response.ok) {
                    data = await response.json();
                }
            } catch (error) {
            }
            
            // If not found, try the general events API
            if (!data || !data.success) {
                try {
                    const cacheBuster = `?t=${Date.now()}`;
                    response = await fetch(`/api/events/${this.eventId}${cacheBuster}`, {
                        headers: {
                            'Cache-Control': 'no-cache',
                            'Pragma': 'no-cache'
                        }
                    });
                    if (response.ok) {
                        data = await response.json();
                    }
                } catch (error) {
                }
            }
            
            // If still not found, try the content API with different sections
            if (!data || !data.success) {
                const sections = ['notices', 'upcoming_events', 'past_events'];
                for (const section of sections) {
                    try {
                        const cacheBuster = `&t=${Date.now()}`;
                        response = await fetch(`/api/content/events-content?section=${section}${cacheBuster}`, {
                            headers: {
                                'Cache-Control': 'no-cache',
                                'Pragma': 'no-cache'
                            }
                        });
                        if (response.ok) {
                            data = await response.json();
                            
                            // Look for the event in the content
                            // Check both data.content and data.data for compatibility
                            const contentArray = data.content || data.data;
                            if (data.success && contentArray && Array.isArray(contentArray)) {
                                
                                const foundEvent = contentArray.find(event => {
                                    const idMatch = event.id === this.eventId;
                                    const titleMatch = event.title?.toLowerCase().includes(this.eventId.toLowerCase());
                                    const generatedIdMatch = this.generateEventId(event.title) === this.eventId;
                                    
                                    
                                    return idMatch || titleMatch || generatedIdMatch;
                                });
                                
                                if (foundEvent) {
                                    data = { success: true, data: foundEvent };
                                    break;
                                }
                                
                                // If no specific event found but we have events in this section, use the first one
                                if (contentArray.length > 0 && !foundEvent) {
                                    data = { success: true, data: contentArray[0] };
                                    break;
                                }
                            }
                        }
                    } catch (error) {
                    }
                }
            }
            
            // If we found data from database, use it
            if (data && data.success && data.data) {
                // Handle both single event object and array of events
                if (Array.isArray(data.data)) {
                    // If it's an array, use the first event
                    this.content = data.data[0];
                } else {
                    // If it's a single event object
                    this.content = data.data;
                }
                
                // Clear sessionStorage since we're using real database data
                sessionStorage.removeItem('currentEventData');
            } else {
                // Only fall back to sessionStorage if no database data found
                const eventData = sessionStorage.getItem('currentEventData');
                
                if (eventData) {
                    this.content = JSON.parse(eventData);
                } else {
                    this.content = null;
                }
            }
        } catch (error) {
            this.content = null;
        }
        
        // Always hide loading placeholders after attempt (success or failure)
        setTimeout(() => {
            this.hideAllLoadingPlaceholders();
        }, 1500); // Give a minimum loading time for better UX
    }

    hideAllLoadingPlaceholders() {
        // Hide all section loading placeholders
        const sections = ['event-hero', 'event-summary', 'about-event', 'schedule', 'guests', 'gallery', 'location', 'contact'];
        sections.forEach(section => {
            const loadingEl = document.getElementById(`${section}-loading`);
            const dynamicEl = document.getElementById(`${section}-dynamic`);
            
            if (loadingEl && dynamicEl) {
                loadingEl.style.display = 'none';
                dynamicEl.style.display = 'block';
            }
        });
        
        // Special handling for event-hero section
        const eventHeroLoading = document.getElementById('event-hero-loading');
        const eventHeroDynamic = document.getElementById('event-hero-dynamic');
        
        if (eventHeroLoading && eventHeroDynamic) {
            eventHeroLoading.style.display = 'none';
            eventHeroDynamic.style.display = 'block';
        }
    }

    renderContent() {
        if (!this.content) {
            // Use fallback content if no data is loaded
            this.renderFallbackContent();
            return;
        }

        // Render Hero Section
        this.renderHeroSection();
        
        // Render Event Summary Section
        this.renderEventSummarySection();
        
        // Render About Event Section
        this.renderAboutEventSection();
        
        // Render Schedule Section
        this.renderScheduleSection();
        
        // Render Guests Section
        this.renderGuestsSection();
        
        
        // Render Related Events Section
        this.renderRelatedEventsSection();
        
        
        // Render Location Section
        this.renderLocationSection();
        
        // Render PDF Documents Section
        this.renderPDFDocumentsSection();
        
        // Render Contact Section
        this.renderContactSection();
    }

    renderHeroSection() {
        if (!this.content) return;

        // Update event title in dynamic content
        const eventTitle = document.querySelector('#event-hero-dynamic .event-title');
        if (eventTitle && this.content.title) {
            eventTitle.textContent = this.content.title;
        }

        // Update hero background image in dynamic content
        const eventHero = document.querySelector('#event-hero-dynamic .event-hero');
        if (eventHero && (this.content.image || this.content.imageUrl)) {
            const imageUrl = this.content.imageUrl || this.content.image;
            if (imageUrl && imageUrl !== 'undefined') {
                // Create background with overlay gradient for better text visibility
                const overlayGradient = 'linear-gradient(0deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0) 40%)';
                let finalImageUrl;
                
                // Check if it's already a valid CSS background-image format
                if (imageUrl.startsWith('url(')) {
                    finalImageUrl = imageUrl;
                } else {
                    finalImageUrl = `url('${imageUrl}')`;
                }
                
                // Apply both gradient overlay and background image
                eventHero.style.backgroundImage = `${overlayGradient}, ${finalImageUrl}`;
                eventHero.style.backgroundSize = 'cover';
                eventHero.style.backgroundPosition = 'center';
                
            }
        }
    }

    renderFallbackContent() {
        // Show default content when no event data is available
        
        // Update the title to show a default message
        const eventTitle = document.querySelector('#event-hero-dynamic .event-title');
        if (eventTitle) {
            eventTitle.textContent = 'Event Details';
        }
        
        // Update the about text
        const aboutText = document.querySelector('.about-text');
        if (aboutText) {
            aboutText.textContent = 'Event details are not available at the moment. Please check back later.';
        }
    }

    renderEventSummarySection() {
        if (!this.content) return;


        // Update event summary grid with passed event data
        const dateElement = document.querySelector('.summary-item:nth-child(1) .summary-value');
        const timeElement = document.querySelector('.summary-item:nth-child(2) .summary-value');
        const venueElement = document.querySelector('.summary-item:nth-child(3) .summary-value');
        const organizerElement = document.querySelector('.summary-item:nth-child(4) .summary-value');

        // Format date properly
        let formattedDate = 'Date TBD';
        if (this.content.eventDate) {
            const date = new Date(this.content.eventDate);
            formattedDate = date.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
        } else if (this.content.date) {
            formattedDate = this.content.date;
        } else {
        }
        
        // Set time with proper fallback
        let timeValue = 'Time TBD';
        if (this.content.eventTime) {
            timeValue = this.content.eventTime;
        } else if (this.content.time) {
            timeValue = this.content.time;
        } else {
        }
        
        // Set venue with proper fallback
        let venueValue = 'Venue TBD';
        if (this.content.venue) {
            venueValue = this.content.venue;
        } else {
        }
        
        // Set organizer with proper fallback
        let organizerValue = 'Organizer TBD';
        if (this.content.organizer) {
            organizerValue = this.content.organizer;
        } else {
        }
        
        // Update DOM elements
        if (dateElement) {
            dateElement.textContent = formattedDate;
        }
        if (timeElement) {
            timeElement.textContent = timeValue;
        }
        if (venueElement) {
            venueElement.textContent = venueValue;
        }
        if (organizerElement) {
            organizerElement.textContent = organizerValue;
        }
    }

    renderAboutEventSection() {
        if (!this.content) return;

        // Update about text
        const aboutText = document.querySelector('.about-text');
        if (aboutText && this.content.description) {
            aboutText.textContent = this.content.description;
        }

        // Update about image
        const aboutImage = document.querySelector('.about-image');
        if (aboutImage && (this.content.image || this.content.imageUrl)) {
            const imageUrl = this.content.imageUrl || this.content.image;
            if (imageUrl && imageUrl !== 'undefined') {
                // Check if it's already a valid CSS background-image format
                if (imageUrl.startsWith('url(')) {
                    aboutImage.style.backgroundImage = imageUrl;
                } else {
                    aboutImage.style.backgroundImage = `url('${imageUrl}')`;
                }
            }
        }
    }

    renderScheduleSection() {
        // Debug: Log the entire content object to see what fields are available
        
        // Get schedule data from event object
        let scheduleData = [];
        
        // Try to parse eventSchedule or schedule field
        if (this.content.eventSchedule) {
            try {
                scheduleData = typeof this.content.eventSchedule === 'string' 
                    ? JSON.parse(this.content.eventSchedule) 
                    : this.content.eventSchedule;
            } catch (e) {
                scheduleData = [];
            }
        } else if (this.content.schedule) {
            scheduleData = Array.isArray(this.content.schedule) ? this.content.schedule : [];
        } else {
        }

        
        // Update schedule items
        const scheduleContainer = document.querySelector('#schedule-dynamic .schedule-grid');
        if (scheduleContainer && scheduleData.length > 0) {
            scheduleContainer.innerHTML = '';
            
            scheduleData.forEach((item, index) => {
                const scheduleItem = document.createElement('div');
                scheduleItem.className = 'schedule-time';
                scheduleItem.innerHTML = `
                    <div class="schedule-icon">
                        <span class="material-symbols-outlined">${item.icon || 'schedule'}</span>
                    </div>
                    <p class="schedule-time-text">${item.time || item}</p>
                `;
                
                const scheduleEvent = document.createElement('p');
                scheduleEvent.className = 'schedule-event';
                scheduleEvent.textContent = item.event || item.description || item;
                
                scheduleContainer.appendChild(scheduleItem);
                scheduleContainer.appendChild(scheduleEvent);
            });
            
        } else if (scheduleContainer) {
        } else {
        }
    }

    renderGuestsSection() {
        // Debug: Log the guests field specifically
        
        // Get guests data from event object
        let guestsData = [];
        
        // Try to parse guests field
        if (this.content.guests) {
            try {
                guestsData = typeof this.content.guests === 'string' 
                    ? JSON.parse(this.content.guests) 
                    : this.content.guests;
            } catch (e) {
                guestsData = [];
            }
        } else {
        }

        
        // Update guests grid - look in the guests section
        const guestsContainer = document.querySelector('.guests-grid');
        if (guestsContainer && guestsData.length > 0) {
            guestsContainer.innerHTML = '';
            
            guestsData.forEach(guest => {
                const guestCard = document.createElement('div');
                guestCard.className = 'guest-card';
                // Use a default user icon instead of placeholder image
                const hasCustomImage = guest.imageUrl || guest.image || guest.avatar;
                const avatarContent = hasCustomImage 
                    ? `<div class="guest-avatar" style="background-image: url('${guest.imageUrl || guest.image || guest.avatar}')"></div>`
                    : `<div class="guest-avatar guest-avatar-default">
                         <i data-lucide="user" class="guest-icon"></i>
                       </div>`;
                
                guestCard.innerHTML = `
                    ${avatarContent}
                    <div>
                        <p class="guest-name">${guest.name || 'Guest Name'}</p>
                        <p class="guest-role">${guest.role || guest.title || 'Role'}</p>
                    </div>
                `;
                guestsContainer.appendChild(guestCard);
            });
            
            
            // Initialize Lucide icons for the guest avatars
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        } else if (guestsContainer) {
        } else {
        }
    }


    renderGallerySection() {
        // This method is now replaced by renderRelatedEventsSection
    }

    renderRelatedEventsSection() {
        
        // Determine the section to fetch based on current event type
        const targetSection = this.content.section === 'past_events' ? 'past_events' : 'upcoming_events';
        
        // Fetch related events
        this.fetchRelatedEvents(targetSection);
    }

    async fetchRelatedEvents(section) {
        try {
            
            const cacheBuster = `&t=${Date.now()}`;
            const response = await fetch(`/api/content/events-content?section=${section}${cacheBuster}`, {
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                }
            });
            const data = await response.json();
            
            
            if (data.success && data.data && Array.isArray(data.data)) {
                // Filter out the current event and get up to 3 related events
                const currentEventId = this.content.id;
                const relatedEvents = data.data
                    .filter(event => event.id !== currentEventId)
                    .slice(0, 3);
                
                this.displayRelatedEvents(relatedEvents);
            } else {
                this.showNoRelatedEvents();
            }
        } catch (error) {
            console.error('❌ Error fetching related events:', error);
            this.showNoRelatedEvents();
        }
    }

    displayRelatedEvents(events) {
        const container = document.getElementById('related-events-container');
        if (!container) {
            return;
        }

        if (events.length === 0) {
            this.showNoRelatedEvents();
            return;
        }

        // Clear loading placeholders
        container.innerHTML = '';

        events.forEach(event => {
            const eventCard = document.createElement('div');
            eventCard.className = 'related-event-card';
            eventCard.setAttribute('data-event', JSON.stringify(event));
            
            // Format date
            const eventDate = event.eventDate ? new Date(event.eventDate).toLocaleDateString() : 'Date TBD';
            
            eventCard.innerHTML = `
                <div class="event-image" style="background-image: url('${event.imageUrl || 'https://via.placeholder.com/400x200'}')"></div>
                <div class="event-info">
                    <h3 class="event-title">${event.title || 'Event Title'}</h3>
                    <p class="event-date">${eventDate}</p>
                </div>
            `;
            
            // Add click handler
            eventCard.addEventListener('click', () => {
                this.navigateToRelatedEvent(event);
            });
            
            container.appendChild(eventCard);
        });

    }

    showNoRelatedEvents() {
        const container = document.getElementById('related-events-container');
        if (!container) return;

        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #6b7280;">
                <p>No related events found.</p>
            </div>
        `;
    }

    navigateToRelatedEvent(event) {
        
        // Store event data for the details page
        sessionStorage.setItem('currentEventData', JSON.stringify(event));
        
        // Navigate to event details page
        const eventId = event.id || this.generateEventId(event.title);
        window.location.href = `eventsDetails.html?eventId=${eventId}`;
    }


    renderLocationSection() {
        
        // Get location data from event object
        const venue = this.content.venue || '';
        const locationMap = this.content.locationMap || '';
        const contactInfo = this.content.contactInfo || '';
        
        
        // Update venue information
        const venueElement = document.getElementById('location-venue');
        if (venueElement) {
            if (venue) {
                venueElement.textContent = venue;
            } else {
                venueElement.textContent = 'Location TBD';
            }
        }
        
        // Update location description (using contactInfo if available)
        const descriptionElement = document.getElementById('location-description');
        if (descriptionElement) {
            if (contactInfo) {
                descriptionElement.textContent = contactInfo;
            } else {
                descriptionElement.textContent = 'More details will be provided closer to the event date.';
            }
        }
        
        // Update location map - only show if there's a valid Google Maps URL or venue
        const mapContainer = document.getElementById('location-map-container');
        if (mapContainer) {
            // Check if we have valid location data for Google Maps
            const hasValidLocationData = (locationMap && locationMap !== 'undefined') || venue;
            
            if (hasValidLocationData) {
                // Remove loading class
                mapContainer.classList.remove('loading');
                
                // Create clickable map button
                const mapButton = document.createElement('button');
                mapButton.className = 'map-button';
                mapButton.innerHTML = `
                    <div class="map-button-content">
                        <div class="map-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                <circle cx="12" cy="10" r="3"></circle>
                            </svg>
                        </div>
                        <div class="map-text">
                            <span class="map-title">View on Google Maps</span>
                            <span class="map-subtitle">Click to open location</span>
                        </div>
                    </div>
                `;
                
                // Add click handler to open Google Maps
                mapButton.addEventListener('click', () => {
                    this.openInGoogleMaps(venue, locationMap);
                });
                
                mapContainer.innerHTML = '';
                mapContainer.appendChild(mapButton);
            } else {
                // Hide the map container if no valid location data
                mapContainer.style.display = 'none';
            }
        }
        
        // Hide location section if no venue information AND no contact info
        // (We keep the section visible if there's at least venue or contact info, even without map)
        if (!venue && !contactInfo) {
            const locationSection = document.querySelector('section:nth-of-type(5)'); // Location section
            if (locationSection) {
                locationSection.style.display = 'none';
            }
        }
    }

    openInGoogleMaps(venue, locationMap) {
        
        let mapsUrl;
        
        if (locationMap && locationMap !== 'undefined') {
            // If we have a Google Maps URL, use it directly
            if (locationMap.includes('maps.google.com') || 
                locationMap.includes('goo.gl/maps') || 
                locationMap.includes('maps.app.goo.gl') ||
                locationMap.startsWith('https://maps.') ||
                locationMap.startsWith('http://maps.')) {
                mapsUrl = locationMap;
            } else {
                // If it's just coordinates or other format, construct Google Maps URL
                mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationMap)}`;
            }
        } else if (venue) {
            // If no specific map URL, search for the venue name
            mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue)}`;
        } else {
            // Fallback to general location search
            mapsUrl = 'https://www.google.com/maps';
        }
        
        
        // Open Google Maps in a new tab
        window.open(mapsUrl, '_blank');
    }

    renderPDFDocumentsSection() {
        if (!this.content) return;


        const pdfSection = document.getElementById('pdf-documents-section');
        const pdfContainer = document.getElementById('pdf-documents-container');
        
        if (!pdfSection || !pdfContainer) {
            return;
        }

        // Check if there are PDF files
        const pdfFiles = this.content.pdfFiles;
        if (!pdfFiles || !Array.isArray(pdfFiles) || pdfFiles.length === 0) {
            pdfSection.style.display = 'none';
            return;
        }


        // Show the section
        pdfSection.style.display = 'block';

        // Clear existing content
        pdfContainer.innerHTML = '';

        // Render each PDF file
        pdfFiles.forEach((pdfFile, index) => {
            
            const pdfCard = this.createPDFDocumentCard(pdfFile);
            pdfContainer.appendChild(pdfCard);
        });

    }

    createPDFDocumentCard(pdfFile) {
        const card = document.createElement('div');
        card.className = 'pdf-document-card';
        
        // Extract file name from URL or use provided name
        let fileName = pdfFile.name || 'Document';
        if (pdfFile.url) {
            const urlParts = pdfFile.url.split('/');
            const lastPart = urlParts[urlParts.length - 1];
            if (lastPart && lastPart.includes('.pdf')) {
                fileName = lastPart.replace('.pdf', '');
            }
        }
        
        // Format file size
        const fileSize = pdfFile.size || pdfFile.originalSize || 'Unknown size';
        
        card.innerHTML = `
            <div class="pdf-document-header">
                <div class="pdf-document-icon">
                    <i data-lucide="file-text"></i>
                </div>
                <div class="pdf-document-info">
                    <h3>${fileName}</h3>
                    <p class="pdf-document-size">${fileSize}</p>
                </div>
            </div>
            <div class="pdf-document-actions">
                <a href="${pdfFile.url}" target="_blank" class="pdf-download-btn" download="${fileName}.pdf">
                    <i data-lucide="download"></i>
                    Download
                </a>
                <a href="${pdfFile.url}" target="_blank" class="pdf-preview-btn">
                    <i data-lucide="eye"></i>
                    Preview
                </a>
            </div>
        `;
        
        return card;
    }

    renderContactSection() {
        // Get contact data from event object
        const contactData = this.content.contact || {};
        
        
        // Update contact information
        const contactText = document.querySelector('.contact-text');
        if (contactText) {
            if (this.content.contactInfo) {
                contactText.textContent = this.content.contactInfo;
            } else if (this.content.organizer) {
                contactText.textContent = `Contact: ${this.content.organizer}`;
            }
        }
    }

    // Utility method to show loading state
    showLoadingState() {
        const sections = ['event-summary', 'about-event', 'schedule', 'guests', 'gallery', 'location', 'contact'];
        sections.forEach(section => {
            const loadingEl = document.getElementById(`${section}-loading`);
            const dynamicEl = document.getElementById(`${section}-dynamic`);
            
            if (loadingEl && dynamicEl) {
                loadingEl.style.display = 'block';
                dynamicEl.style.display = 'none';
            }
        });
    }

    // Utility method to hide loading state
    hideLoadingState() {
        this.hideAllLoadingPlaceholders();
    }
}

// Initialize the loader when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    new EventsDetailsPageLoader();
});
