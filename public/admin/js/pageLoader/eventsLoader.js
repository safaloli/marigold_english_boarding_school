/**
 * ========================================
 * CATEGORIES CONFIGURATION
 * ========================================
 * Comprehensive list of all possible categories for school website
 * Store categories here (not in database) for easy management
 * 
 * Each category has:
 * - value: Unique identifier (used in database)
 * - label: Display name
 * - icon: Emoji icon for visual identification
 * - color: Color code for UI styling
 */

/**
 * EVENT CATEGORIES
 * Categories for school events, programs, and activities
 */
const EVENT_CATEGORIES = [
    { value: 'academic', label: 'Academic', icon: '📚', color: '#3B82F6' },
    { value: 'sports', label: 'Sports & Athletics', icon: '⚽', color: '#10B981' },
    { value: 'cultural', label: 'Cultural Programs', icon: '🎭', color: '#A855F7' },
    { value: 'science', label: 'Science & Technology', icon: '🔬', color: '#06B6D4' },
    { value: 'arts', label: 'Arts & Crafts', icon: '🎨', color: '#F59E0B' },
    { value: 'technology', label: 'Technology & Innovation', icon: '💻', color: '#6366F1' },
    { value: 'community', label: 'Community Service', icon: '🤝', color: '#EC4899' },
    { value: 'competition', label: 'Competitions', icon: '🏆', color: '#EAB308' },
    { value: 'workshop', label: 'Workshops & Training', icon: '💼', color: '#8B5CF6' },
    { value: 'celebration', label: 'Celebrations & Festivals', icon: '🎉', color: '#F97316' },
    { value: 'assembly', label: 'School Assembly', icon: '🎤', color: '#0EA5E9' },
    { value: 'exhibition', label: 'Exhibition & Fair', icon: '🏛️', color: '#14B8A6' },
    { value: 'other', label: 'Other', icon: '📌', color: '#94A3B8' }
];

/**
 * NOTICE CATEGORIES
 * Comprehensive categories for all types of school notices
 */
const NOTICE_CATEGORIES = [
    // Academic Related
    { value: 'examination', label: 'Examination', icon: '📝', color: '#FF6B6B' },
    { value: 'results', label: 'Results/Marks', icon: '📊', color: '#4ECDC4' },
    { value: 'syllabus', label: 'Syllabus/Curriculum', icon: '📚', color: '#45B7D1' },
    { value: 'timetable', label: 'Time Table/Schedule', icon: '📅', color: '#96CEB4' },
    { value: 'assignments', label: 'Assignments/Homework', icon: '✏️', color: '#FFEAA7' },
    { value: 'projects', label: 'Projects/Practicals', icon: '🔬', color: '#DFE6E9' },
    { value: 'class-test', label: 'Class Test/Unit Test', icon: '📄', color: '#74B9FF' },
    
    // Admission & Registration
    { value: 'admission', label: 'Admission/New Admission', icon: '🎓', color: '#A29BFE' },
    { value: 'registration', label: 'Registration/Enrollment', icon: '📋', color: '#FD79A8' },
    { value: 'new-session', label: 'New Session/Academic Year', icon: '🆕', color: '#FDCB6E' },
    { value: 'transfer', label: 'Transfer Certificate/TC', icon: '📜', color: '#6C5CE7' },
    
    // Events & Activities
    { value: 'event', label: 'School Event/Program', icon: '🎉', color: '#00B894' },
    { value: 'competition', label: 'Competition/Contest', icon: '🏆', color: '#FDCB6E' },
    { value: 'celebration', label: 'Celebration/Festival', icon: '🎊', color: '#FF7675' },
    { value: 'annual-function', label: 'Annual Function/Day', icon: '🎭', color: '#E17055' },
    { value: 'sports-day', label: 'Sports Day/Athletic Meet', icon: '⚽', color: '#00B894' },
    { value: 'cultural', label: 'Cultural Activities/Programs', icon: '🎨', color: '#A29BFE' },
    { value: 'educational-trip', label: 'Educational Trip/Excursion', icon: '🚌', color: '#55EFC4' },
    { value: 'workshop', label: 'Workshop/Seminar', icon: '💼', color: '#81ECEC' },
    
    // Holiday & Leave
    { value: 'holiday', label: 'Holiday/Vacation', icon: '🏖️', color: '#74B9FF' },
    { value: 'school-closure', label: 'School Closure', icon: '🚫', color: '#FF7675' },
    { value: 'leave', label: 'Leave Notice', icon: '📅', color: '#DFE6E9' },
    { value: 'early-dismissal', label: 'Early Dismissal/Half Day', icon: '🕐', color: '#FAB1A0' },
    
    // Fee Related
    { value: 'fee-payment', label: 'Fee Payment/Submission', icon: '💰', color: '#00B894' },
    { value: 'fee-due', label: 'Fee Due/Pending', icon: '💳', color: '#FF7675' },
    { value: 'fee-structure', label: 'Fee Structure/Details', icon: '💵', color: '#FDCB6E' },
    { value: 'scholarship', label: 'Scholarship/Financial Aid', icon: '🎖️', color: '#A29BFE' },
    
    // Important & Urgent
    { value: 'urgent', label: 'Urgent/Emergency', icon: '🚨', color: '#D63031' },
    { value: 'important', label: 'Important Notice', icon: '⚠️', color: '#E17055' },
    { value: 'circular', label: 'Circular/Memo', icon: '📢', color: '#0984E3' },
    
    // Parent & Meeting
    { value: 'ptm', label: 'Parent-Teacher Meeting', icon: '👥', color: '#6C5CE7' },
    { value: 'parent-workshop', label: 'Parent Workshop/Orientation', icon: '👨‍👩‍👧', color: '#A29BFE' },
    { value: 'meeting', label: 'Meeting/Assembly', icon: '🤝', color: '#74B9FF' },
    
    // Student Activities
    { value: 'student-council', label: 'Student Council/Cabinet', icon: '👨‍🎓', color: '#6C5CE7' },
    { value: 'clubs', label: 'Clubs/Societies', icon: '🎪', color: '#FD79A8' },
    { value: 'extra-curricular', label: 'Extra-Curricular Activities', icon: '🎯', color: '#55EFC4' },
    
    // Infrastructure & Facilities
    { value: 'maintenance', label: 'Maintenance/Repair Work', icon: '🔧', color: '#DFE6E9' },
    { value: 'facility', label: 'Facility Update/New Facility', icon: '🏫', color: '#96CEB4' },
    { value: 'infrastructure', label: 'Infrastructure Development', icon: '🏗️', color: '#B2BEC3' },
    
    // Health & Safety
    { value: 'health', label: 'Health & Hygiene', icon: '🏥', color: '#00B894' },
    { value: 'safety', label: 'Safety Guidelines', icon: '🛡️', color: '#0984E3' },
    { value: 'medical', label: 'Medical Checkup/Vaccination', icon: '💉', color: '#74B9FF' },
    
    // Transport & Library
    { value: 'transport', label: 'Transport/Bus Route', icon: '🚌', color: '#FDCB6E' },
    { value: 'library', label: 'Library Notice', icon: '📖', color: '#A29BFE' },
    
    // Sports & Achievements
    { value: 'sports', label: 'Sports/Games', icon: '🏅', color: '#00B894' },
    { value: 'achievement', label: 'Achievements/Recognition', icon: '🌟', color: '#FDCB6E' },
    { value: 'awards', label: 'Awards/Honors', icon: '🏆', color: '#E17055' },
    
    // Discipline & Rules
    { value: 'discipline', label: 'Discipline/Code of Conduct', icon: '⚖️', color: '#636E72' },
    { value: 'dress-code', label: 'Dress Code/Uniform', icon: '👔', color: '#74B9FF' },
    { value: 'rules', label: 'Rules & Regulations', icon: '📏', color: '#B2BEC3' },
    
    // Staff Related
    { value: 'staff-meeting', label: 'Staff Meeting', icon: '👨‍🏫', color: '#6C5CE7' },
    { value: 'teacher-training', label: 'Teacher Training/Development', icon: '📚', color: '#A29BFE' },
    
    // General
    { value: 'general', label: 'General Notice', icon: '📌', color: '#B2BEC3' },
    { value: 'information', label: 'Information/Announcement', icon: 'ℹ️', color: '#74B9FF' },
    { value: 'other', label: 'Other', icon: '📄', color: '#DFE6E9' }
];

/**
 * Events Content Manager - Redesigned
 * Handles dynamic loading and management of the events content section
 */
class EventsContentLoader {
    constructor() {
        this.currentSection = 'events-content';
        this.currentSubsection = null;
        this.sections = {
            'featured_hero': { name: 'Featured Hero', icon: '⭐', enabled: true },
            'upcoming_events': { name: 'Upcoming Events', icon: '📅', enabled: true },
            'past_events': { name: 'Past Events', icon: '📆', enabled: true },
            'notices': { name: 'Notices', icon: '📢', enabled: true },
            'highlights': { name: 'Highlights', icon: '🌟', enabled: true }
        };
        this.selectedPastEventId = null; // Track selected past event ID
        this.noticeCategories = NOTICE_CATEGORIES; // Store notice categories for easy access
        this.eventCategories = EVENT_CATEGORIES; // Store event categories for easy access
        this.init();
    }

    init() {
        this.setupGlobalEventDelegation();
        this.bindEvents();
    }

    /**
     * Helper: Get category details by value
     */
    getCategoryDetails(categoryValue) {
        if (!categoryValue) return null;
        return NOTICE_CATEGORIES.find(cat => cat.value === categoryValue);
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
        return category ? category.icon : '📌';
    }

    /**
     * Helper: Get category color
     */
    getCategoryColor(categoryValue) {
        const category = this.getCategoryDetails(categoryValue);
        return category ? category.color : '#B2BEC3';
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
     * Setup global event delegation for CSP compliance
     */
    setupGlobalEventDelegation() {
        document.addEventListener('click', (e) => {
            const action = e.target.closest('[data-action]')?.getAttribute('data-action');
            if (!action) return;

            switch (action) {
                case 'close-add-event-modal':
                    this.closeAddEventModal();
                    break;
                case 'close-add-notice-modal':
                    this.closeAddNoticeModal();
                    break;
                case 'close-notification':
                    e.target.closest('.notification')?.remove();
                    break;
                case 'reload-page':
                    window.location.reload();
                    break;
                case 'remove-image':
                    e.target.closest('.image-preview')?.remove();
                    break;
            }
        });
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Events content section click
        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-section="events-content"]')) {
                e.preventDefault();
                this.loadEventsContent();
            }
        });

        // Section menu item clicks will be set up in loadEventsContent

        // Breadcrumb back button - handle data-action attribute
        document.addEventListener('click', (e) => {
            const backButton = e.target.closest('.back-button');
            if (backButton) {
                const action = backButton.getAttribute('data-action');
                if (action === 'back-to-section-list') {
                e.preventDefault();
                    e.stopImmediatePropagation();
                    this.showSectionList();
                    return;
                }
                
                // Fallback: check if we're in events context
                if (this.isEventsContext(backButton)) {
                    // Check if we're in an event detail or add event view
                    const pageContent = document.getElementById('page-content');
                    const isInEventDetail = pageContent && (
                        pageContent.querySelector('.event-detail-editor') ||
                        pageContent.innerHTML.includes('Add New Event') ||
                        pageContent.innerHTML.includes('Edit Event')
                    );
                    
                    if (isInEventDetail) {
                        // Let specific handlers in openAddEvent/openEventDetail handle this
                        return;
                    }
                    
                    e.preventDefault();
                    e.stopImmediatePropagation();
                
                    // Handle section list navigation
                    this.showSectionList();
                }
            }
        });



        // Section save buttons - now handled by SaveButton component
        // The SaveButton component will handle all save functionality
    }

    /**
     * Initialize SaveButton component for a section
     */
    initializeSaveButton(section) {
        const saveButtonElement = document.querySelector('.save-section-btn');
        if (!saveButtonElement) {
            return null;
        }

        const sectionsWithImages = ['featured_hero'];
        const hasImages = sectionsWithImages.includes(section);

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
                collecting: hasImages ? 40 : 25,
                saving: hasImages ? 85 : 75,
                success: 100
            },
            onSave: async (button) => {
                
                const token = localStorage.getItem('adminToken');
                if (!token) {
                    throw new Error('Authentication required');
                }

                button.setProgress('Collecting data...', 25);
                
                // Handle image upload for featured_hero section
                if (section === 'featured_hero' && this.heroImageUpload) {
                    // Check if there's a selected file that needs to be uploaded
                    if (this.heroImageUpload.hasPendingUpload()) {
                        button.setProgress('Uploading image...', 10);
                        
                        try {
                            // Get the file from the ImageUpload component
                            const fileInput = document.getElementById('hero-image-upload');
                            const file = fileInput.files[0];
                            
                            // Upload the image using the ImageUpload component
                            await this.heroImageUpload.uploadFile(file);
                            
                            // Wait for the URL to be properly set
                            await new Promise(resolve => setTimeout(resolve, 200));
                            
                            button.setProgress('Image uploaded, collecting data...', 35);
                        } catch (error) {
                            throw new Error('Failed to upload image');
                        }
                    } else {
                        button.setProgress('Collecting data...', 25);
                    }
                } else {
                    button.setProgress('Collecting data...', 25);
                }
                
                const formData = this.collectSectionData(section);
                
                if (!formData) {
                    throw new Error('Unable to save - please check your input');
                }

                button.setProgress('Saving to database...', hasImages ? 50 : 30);
                
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 15000);
                
                const response = await fetch('/api/content/events-content', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ section, data: formData }),
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
            onSuccess: async (result) => {
                // Add a small delay to ensure database operation is truly complete
                await new Promise(resolve => setTimeout(resolve, 300));
                
                this.showNotification('success', 'Section saved successfully!');
                
                // Navigate back to events section list after successful save
                setTimeout(() => {
                    this.showSectionList();
                }, 1500);
            },
            onError: (error) => {
                
                if (error.message.includes('Authentication')) {
                    this.showNotification('error', error.message);
                } else if (error.name === 'AbortError') {
                    this.showNotification('error', 'Save request timed out - please try again');
                } else {
                    this.showNotification('error', `Failed to save section: ${error.message}`);
            }
            }
        });

        return saveButton;
    }

    /**
     * Load events content section dynamically
     */
    async loadEventsContent() {
        try {
            // Get events content
            const content = this.getEventsContent();
            
            // Inject content into page-content
            this.injectContent(content);
            
            // Initialize events content functionality
            this.initializeEventsContent();
            
            // Set up section menu item clicks after content is loaded
            this.setupSectionMenuClicks();
            
            // Show section list by default
            this.showSectionList();
            
            // Update navigation
            this.updateNavigation();
            
        } catch (error) {
            console.error('Error loading events content section:', error);
            this.showError('Failed to load events content section');
        }
    }

    /**
     * Check if events content management is currently active
     */
    isEventsContentActive() {
        const pageContent = document.getElementById('pageContent');
        return pageContent && pageContent.innerHTML.includes('events-content-section');
    }

    /**
     * Set up section menu item clicks
     */
    setupSectionMenuClicks() {
        // Remove any existing event listeners first
        const sectionMenuItems = document.querySelectorAll('.section-menu-item');
        
        sectionMenuItems.forEach(item => {
            // Clone the element to remove all existing event listeners
            const newItem = item.cloneNode(true);
            item.parentNode.replaceChild(newItem, item);
            
            newItem.addEventListener('click', async (e) => {
                // Prevent default and stop propagation immediately
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                
                const section = newItem.dataset.eventsSection;
                
                // Ensure no buttons are accidentally triggered
                const clickedElement = e.target;
                if (clickedElement.closest('button') || clickedElement.matches('button')) {
                    return;
                }
                
                await this.loadSection(section);
            });
        });
    }

    /**
     * Check if we're in events context
     */
    isEventsContext(backButton) {
        // First check if we're in the events section
        if (this.currentSection !== 'events') {
            return false;
        }
        
        // Check if the back button is within an events context
        if (backButton && backButton.closest('#events-content-section, .events-content-editor, .section-editor, .simple-breadcrumb')) {
            return true;
        }
        
        // Fallback: check if current content is events-related
        const pageContent = document.getElementById('page-content');
        if (!pageContent) return false;
        
        return pageContent.innerHTML.includes('events-content-section') || 
               pageContent.querySelector('#events-content-section, .events-content-editor, .section-editor, .simple-breadcrumb') !== null;
    }

    /**
     * Show section list (main events overview)
     */
    showSectionList() {
        this.currentSubsection = null;
        const sectionList = document.getElementById('sectionList');
        const sectionEditor = document.getElementById('sectionEditor');
        const pageHeader = document.querySelector('.page-header');
        
        if (sectionList && sectionEditor) {
            sectionList.style.display = 'block';
            sectionEditor.style.display = 'none';
            
            // Show page header when returning to section list
            if (pageHeader) {
                pageHeader.style.display = 'block';
            }
        }
    }

    /**
     * Load specific section editor
     */
    async loadSection(section) {
        this.currentSubsection = section;
        this.currentSection = section; // Store current section for navigation
        
        const sectionList = document.getElementById('sectionList');
        const sectionEditor = document.getElementById('sectionEditor');
        const pageHeader = document.querySelector('.page-header');
        
        if (sectionList && sectionEditor) {
            sectionList.style.display = 'none';
            sectionEditor.style.display = 'block';
            
            // Hide page header when showing section editor
            if (pageHeader) {
                pageHeader.style.display = 'none';
            }
            
            // Load section content
            const editorContent = this.getSectionEditor(section);
            sectionEditor.innerHTML = editorContent;
            
            // Update breadcrumb
            this.updateBreadcrumb(section);
            
            // Load section data from database
            await this.loadSectionData(section);
            
            // Initialize SaveButton component for this section
            if (section === 'highlights') {
                // Highlights section has its own save button initialization
            } else if (section === 'featured_hero') {
                // Featured hero section has its own save button initialization
            } else {
                this.initializeSaveButton(section);
            }
            
            // Initialize hero editor functionality if it's the featured hero section
            if (section === 'featured_hero') {
                this.initializeHeroEditor();
            }
            
            // Initialize events interactivity for events sections
            if (section === 'upcoming_events' || section === 'past_events') {
                this.initializeEventsSectionInteractivity();
            }
            
            // Initialize notices interactivity for notices section
            if (section === 'notices') {
                this.initializeNoticesInteractivity();
            }
            
            // Initialize highlights interactivity for highlights section
            if (section === 'highlights') {
                await this.initializeHighlightsInteractivity();
            }
            
            // Reinitialize Lucide icons after content injection
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        } else {
        }
    }


    /**
     * Close custom modal
     */
    closeCustomModal(modal) {
        modal.style.opacity = '0';
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 200);
    }


    /**
     * Update section status in UI
     */
    updateSectionStatus(section) {
        // Toggle functionality removed - keeping method for potential future use
    }

    /**
     * Update breadcrumb
     */
    updateBreadcrumb(section) {
        const sectionNameElement = document.getElementById('currentSectionName');
        if (sectionNameElement) {
            sectionNameElement.textContent = this.sections[section]?.name || 'Section';
        }
    }

    /**
     * Load section data from database
     */
    async loadSectionData(section) {
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                this.showNotification('error', 'Authentication required');
                return;
            }

            let response;
            let sectionData;

            // For upcoming_events and past_events, fetch from the events API
            if (section === 'upcoming_events' || section === 'past_events') {
                const status = section === 'upcoming_events' ? 'upcoming' : 'past';
                // Add cache-busting to always get fresh data
                const cacheBuster = `&t=${Date.now()}`;
                response = await fetch(`/api/events?status=${status}&limit=100${cacheBuster}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Cache-Control': 'no-cache',
                        'Pragma': 'no-cache'
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to load events data');
                }

                const apiResponse = await response.json();
                
                // Extract events array from the API response
                sectionData = apiResponse.events || [];
            } else {
                // For other sections, fetch from events-content API
                // Add cache-busting to always get fresh data
                const cacheBuster = `&t=${Date.now()}`;
                response = await fetch(`/api/content/events-content?section=${section}${cacheBuster}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to load section data');
            }

            const apiResponse = await response.json();
            if (apiResponse.data) {
            }
            
            // Extract the actual data array from the API response
                sectionData = apiResponse.data || apiResponse;
            }
            
            this.populateSectionEditor(section, sectionData);
        } catch (error) {
            console.error('Error loading section data:', error);
            this.showNotification('error', 'Failed to load section data');
        }
    }

    /**
     * Populate section editor with data
     */
    populateSectionEditor(section, data) {
        switch (section) {
            case 'featured_hero':
                this.populateFeaturedHeroEditor(data);
                break;
            case 'upcoming_events':
            case 'past_events':
                this.populateEventsEditor(data);
                break;
            case 'notices':
                this.populateNoticesEditor(data);
                break;
            case 'highlights':
                this.populateHighlightsEditor(data);
                break;
        }
    }

    /**
     * Populate featured hero editor
     */
    populateFeaturedHeroEditor(data) {
        const titleData = data.find(item => item.key === 'title') || {};
        const descriptionData = data.find(item => item.key === 'description') || {};
        const buttonData = data.find(item => item.key === 'button_text') || {};
        const imageData = data.find(item => item.key === 'image') || {};
        const pastEventIdData = data.find(item => item.key === 'past_event_id') || {};

        document.getElementById('hero-title').value = titleData.title || '';
        document.getElementById('hero-description').value = descriptionData.content || '';
        document.getElementById('hero-button-text').value = buttonData.content || '';
        
        // Load stored past event ID
        const storedPastEventId = pastEventIdData.content || null;
        this.selectedPastEventId = storedPastEventId;
        
        // Set image value using ImageUpload component
        const imageUrl = imageData.imageUrl || '';
        
            if (imageUrl) {
            // Initialize ImageUpload component with existing image
            this.initializeHeroImageUpload(imageUrl);
        } else {
            // Initialize ImageUpload component without existing image
            this.initializeHeroImageUpload();
        }
    }

    /**
     * Populate events editor with enhanced UI
     */
    populateEventsEditor(data) {
        const eventsContainer = document.getElementById('events-list');
        const emptyState = document.getElementById('events-empty-state');
        if (!eventsContainer) return;

        
        // Log the first event to see its structure
        if (Array.isArray(data) && data.length > 0) {
        }

        // Store events data for navigation
        this.currentEventsData = data;

        // Clear skeleton loaders and any existing content
        eventsContainer.innerHTML = '';
        
        if (!data || data.length === 0) {
            if (emptyState) emptyState.style.display = 'block';
            return;
        }
        
        if (emptyState) emptyState.style.display = 'none';
        
        data.forEach((event, index) => {
            // EventsContent model field mappings
            const eventDate = event.eventDate || event.event_date ? 
                new Date(event.eventDate || event.event_date).toLocaleDateString() : 'No date set';
            const eventTime = event.eventTime || event.event_time || 'No time set';
            const eventLocation = event.venue || 'No location set';
            const eventCategory = event.category || 'Uncategorized';
            
            const eventHtml = `
                <div class="event-list-item" data-index="${index}" data-event-id="${event.id || index}">
                    <div class="event-info">
                        <div class="event-main">
                            <h4 class="event-name">${event.title || 'Untitled Event'}</h4>
                            <div class="event-meta">
                                <span class="event-category">${eventCategory}</span>
                                <span class="event-date">${eventDate}</span>
                                <span class="event-time">${eventTime}</span>
                        </div>
                        </div>
                        <div class="event-details">
                            <p class="event-location">
                                <i data-lucide="map-pin"></i>
                                ${eventLocation}
                            </p>
                            <p class="event-description">${event.description ? event.description.substring(0, 100) + '...' : 'No description'}</p>
                        </div>
                        </div>
                    <div class="event-actions">
                        <button class="btn-icon edit-btn" title="Edit Event">
                            <i data-lucide="edit"></i>
                        </button>
                        <button class="btn-icon delete-btn" title="Delete Event">
                                <i data-lucide="trash-2"></i>
                            </button>
                    </div>
                </div>
            `;
            eventsContainer.insertAdjacentHTML('beforeend', eventHtml);
        });
        
        // Initialize drag and drop
        this.initializeDragAndDrop();
        
        // Initialize search and filter
        this.initializeSearchAndFilter();
        
        // Initialize bulk actions
        this.initializeBulkActions();
        
        // Setup add event modal functionality
        setTimeout(() => {
            this.setupAddEventModal();
        }, 100);
        
        // Setup event item click handlers
        this.setupEventItemHandlers();
    }

    /**
     * Setup event item click handlers
     */
    setupEventItemHandlers() {
        const eventsContainer = document.getElementById('events-list');
        if (!eventsContainer) return;
        
        // Remove existing listeners to prevent duplicates
        eventsContainer.removeEventListener('click', this.handleEventItemClick);
        
        // Add event delegation for event item clicks
        eventsContainer.addEventListener('click', this.handleEventItemClick.bind(this));
        
    }
    
    /**
     * Handle event item click
     */
    handleEventItemClick(e) {
        const eventItem = e.target.closest('.event-list-item');
        if (!eventItem) return;
        
        // Don't trigger if clicking on action buttons
        if (e.target.closest('.event-actions')) {
            return;
        }
        
        this.openEventDetail(eventItem);
    }

    /**
     * Populate notices editor with enhanced UI
     */
    populateNoticesEditor(data) {
        const noticesContainer = document.getElementById('notices-list');
        const emptyState = document.getElementById('notices-empty-state');
        if (!noticesContainer) return;

        // Store notices data for navigation
        this.currentNoticesData = data;

        noticesContainer.innerHTML = '';
        
        if (!data || data.length === 0) {
            if (emptyState) emptyState.style.display = 'block';
            return;
        }
        
        if (emptyState) emptyState.style.display = 'none';
        
        data.forEach((notice, index) => {
            const noticeDate = notice.date ? new Date(notice.date).toLocaleDateString() : 'No date set';
            const categoryDetails = this.getCategoryDetails(notice.category);
            const noticeCategory = categoryDetails ? `${categoryDetails.icon} ${categoryDetails.label}` : notice.category || 'General';
            const categoryColor = categoryDetails ? categoryDetails.color : '#B2BEC3';
            const noticePriority = notice.priority || 'normal';
            const priorityColor = noticePriority === 'urgent' ? 'urgent' : noticePriority === 'high' ? 'high' : 'normal';
            
            const noticeHtml = `
                <div class="event-list-item notice-card" data-index="${index}" data-notice-id="${notice.id || index}">
                    <div class="event-info">
                        <div class="event-main">
                            <h4 class="event-name">${notice.title || 'Untitled Notice'}</h4>
                            <div class="event-meta">
                                <span class="event-category" style="background-color: ${categoryColor}20; color: ${categoryColor}; border: 1px solid ${categoryColor}40;">${noticeCategory}</span>
                                <span class="event-date">${noticeDate}</span>
                                <span class="notice-priority priority-${priorityColor}">
                                    <i data-lucide="${noticePriority === 'urgent' ? 'alert-triangle' : noticePriority === 'high' ? 'alert-circle' : 'info'}"></i>
                                    ${noticePriority.toUpperCase()}
                            </span>
                        </div>
                    </div>
                        <div class="event-details">
                            <p class="notice-audience">
                                <i data-lucide="users"></i>
                                ${notice.audience || 'All Students & Parents'}
                            </p>
                            <p class="event-description">${notice.description ? notice.description.substring(0, 100) + '...' : 'No description'}</p>
                        </div>
                            </div>
                    <div class="event-actions">
                        <button class="btn-icon edit-notice-btn" title="Edit Notice">
                            <i data-lucide="edit"></i>
                        </button>
                        <button class="btn-icon delete-notice-btn" title="Delete Notice">
                                <i data-lucide="trash-2"></i>
                            </button>
                    </div>
                </div>
                <style>
                    .notice-card {
                        border-left: 4px solid #e5e7eb;
                        transition: all 0.2s ease;
                        cursor: pointer;
                    }
                    
                    .notice-card:hover {
                        border-left-color: #3b82f6;
                        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
                        transform: translateY(-2px);
                    }
                    
                    .notice-priority {
                        display: inline-flex;
                        align-items: center;
                        gap: 4px;
                        padding: 2px 8px;
                        border-radius: 12px;
                        font-size: 11px;
                        font-weight: 600;
                        text-transform: uppercase;
                    }
                    
                    .notice-priority.priority-urgent {
                        background-color: #fef2f2;
                        color: #dc2626;
                        border: 1px solid #fecaca;
                    }
                    
                    .notice-priority.priority-high {
                        background-color: #fffbeb;
                        color: #d97706;
                        border: 1px solid #fed7aa;
                    }
                    
                    .notice-priority.priority-normal {
                        background-color: #f0f9ff;
                        color: #0284c7;
                        border: 1px solid #bae6fd;
                    }
                    
                    .notice-audience {
                        display: flex;
                        align-items: center;
                        gap: 6px;
                        color: #6b7280;
                        font-size: 14px;
                        margin: 4px 0;
                    }
                    
                    .notice-audience i {
                        width: 16px;
                        height: 16px;
                    }
                    
                    .notice-card .event-name {
                        color: #1f2937;
                        margin-bottom: 8px;
                    }
                    
                    .notice-card .event-meta {
                        gap: 8px;
                    }
                    
                    .notice-card .event-category {
                        padding: 4px 10px;
                        border-radius: 12px;
                        font-size: 12px;
                        font-weight: 500;
                        display: inline-flex;
                        align-items: center;
                        gap: 4px;
                        transition: all 0.2s ease;
                    }
                    
                    .notice-card .event-category:hover {
                        transform: scale(1.05);
                        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                    }
                </style>
            `;
            noticesContainer.insertAdjacentHTML('beforeend', noticeHtml);
        });
        
        // Initialize drag and drop
        this.initializeDragAndDrop();
        
        // Initialize search and filter
        this.initializeSearchAndFilter();
        
        // Initialize bulk actions
        this.initializeBulkActions();
        
        // Setup add notice modal
        this.setupAddNoticeModal();
        
        // Initialize icon preview updates
        this.initializeIconPreview();
    }

    /**
     * Setup add notice modal functionality
     */
    setupAddNoticeModal() {
        const addNoticeBtn = document.querySelector('.add-notice-btn');
        const modal = document.getElementById('add-notice-modal');
        const form = document.getElementById('add-notice-form');
        
        if (addNoticeBtn && modal) {
            addNoticeBtn.addEventListener('click', () => {
                modal.style.display = 'flex';
                this.initializePDFUpload('add-notice-pdf-upload', 'add-notice-pdf-list');
                
                // Initialize searchable select for category dropdown
                setTimeout(() => {
                    this.initializeSearchableSelects();
                }, 100);
            });
        }
        
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAddNotice();
            });
        }
    }
    
    /**
     * Handle add notice form submission
     */
    async handleAddNotice() {
        const form = document.getElementById('add-notice-form');
        const formData = new FormData(form);
        
        try {
            // Upload PDF files first
            const pdfFiles = await this.uploadAllPDFFiles();
            
            const noticeData = {
                title: formData.get('title'),
                category: formData.get('category'),
                description: formData.get('description'),
                date: formData.get('date'),
                priority: formData.get('priority'),
                pdfFiles: pdfFiles,
                isActive: true
            };
            
            
            // Close modal
            this.closeAddNoticeModal();
            
            // Show success message
            this.showNotification('success', 'Notice added successfully!');
        } catch (error) {
            console.error('Error adding notice:', error);
            this.showNotification('error', 'Failed to add notice: ' + error.message);
        }
    }
    
    /**
     * Close add notice modal
     */
    closeAddNoticeModal() {
        const modal = document.getElementById('add-notice-modal');
        if (modal) {
            modal.style.display = 'none';
            // Reset form
            const form = document.getElementById('add-notice-form');
            if (form) {
                form.reset();
            }
        }
    }

    /**
     * Populate highlights editor
     */
    populateHighlightsEditor(data) {
        const highlightsContainer = document.getElementById('highlights-list');
        if (!highlightsContainer) return;

        highlightsContainer.innerHTML = '';
        data.forEach((highlight, index) => {
            const highlightHtml = `
                <div class="highlight-item" data-index="${index}">
                    <div class="form-grid">
                        <div class="form-group">
                            <label>Title</label>
                            <input type="text" name="title" value="${highlight.title || ''}" required>
                        </div>
                        <div class="form-group">
                            <label>Badge</label>
                            <input type="text" name="badge" value="${highlight.badge || ''}">
                        </div>
                        <div class="form-group full-width">
                            <label>Description</label>
                            <textarea name="content" rows="3">${highlight.content || ''}</textarea>
                        </div>
                        <div class="form-group full-width">
                            <label>Image URL</label>
                            <input type="url" name="imageUrl" value="${highlight.imageUrl || ''}">
                        </div>
                        <div class="form-group">
                            <button type="button" class="btn btn-danger remove-highlight-btn">
                                <i data-lucide="trash-2"></i>
                                Remove
                            </button>
                        </div>
                    </div>
                </div>
            `;
            highlightsContainer.insertAdjacentHTML('beforeend', highlightHtml);
        });
    }

    /**
     * Populate principal message editor
     */
    populatePrincipalMessageEditor(data) {
        const messageData = data[0] || {};
        
        document.getElementById('principal-title').value = messageData.title || '';
        document.getElementById('principal-content').value = messageData.content || '';
        document.getElementById('principal-image').value = messageData.imageUrl || '';
    }


    /**
     * Collect section data from form
     */
    collectSectionData(section) {
        switch (section) {
            case 'featured_hero':
                // Get image URL from ImageUpload component or fallback to input
                let imageUrl = '';
                if (this.heroImageUpload) {
                    imageUrl = this.heroImageUpload.getImageUrl();
                } else {
                    const imageUrlInput = document.getElementById('hero-image-url');
                    imageUrl = imageUrlInput ? imageUrlInput.value : '';
                }
                
                const formData = {
                    title: {
                        title: document.getElementById('hero-title').value,
                        content: document.getElementById('hero-description').value
                    },
                    button: {
                        title: document.getElementById('hero-button-text').value
                    },
                    background_image: {
                        content: imageUrl
                    }
                };
                
                return formData;
            case 'upcoming_events':
            case 'past_events':
                const events = [];
                document.querySelectorAll('.event-item').forEach((item, index) => {
                    const eventData = {
                        title: item.querySelector('input[name="title"]').value,
                        content: item.querySelector('textarea[name="content"]').value,
                        category: item.querySelector('select[name="category"]').value,
                        eventDate: item.querySelector('input[name="eventDate"]').value,
                        imageUrl: item.querySelector('input[name="imageUrl"]').value
                    };
                    if (eventData.title) events.push(eventData);
                });
                return events;
            case 'notices':
                const notices = [];
                document.querySelectorAll('.notice-item').forEach((item, index) => {
                    const noticeData = {
                        title: item.querySelector('input[name="title"]').value,
                        content: item.querySelector('input[name="content"]').value,
                        icon: item.querySelector('select[name="icon"]').value
                    };
                    if (noticeData.title) notices.push(noticeData);
                });
                return notices;
            case 'highlights':
                return {
                    highlight: {
                        badge: document.getElementById('highlight-badge')?.value || '',
                        title: document.getElementById('highlight-title')?.value || '',
                        description: document.getElementById('highlight-description')?.value || '',
                        relatedEvent: document.getElementById('highlight-event')?.value || ''
                    }
                };
            default:
                return {};
        }
    }

    /**
     * Initialize events content functionality
     */
    initializeEventsContent() {
        // Add event listeners for dynamic content
        this.setupDynamicContentListeners();
        
        // Load section statuses immediately
        this.loadSectionStatuses();
        
        // Also try to load section statuses after a short delay to ensure DOM is ready
        setTimeout(() => {
            this.loadSectionStatuses();
        }, 100);
        
        // Fallback: Remove shimmer effects after 2 seconds regardless of API status
        setTimeout(() => {
            this.removeShimmerEffects();
        }, 2000);
    }

    /**
     * Setup dynamic content listeners
     */
    setupDynamicContentListeners() {
        // Add event listeners for add/remove buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.add-event-btn')) {
                // This is now handled in initializeEventsInteractivity
                return;
            } else if (e.target.closest('.remove-event-btn')) {
                this.removeEventItem(e.target.closest('.event-item'));
            } else if (e.target.closest('.add-notice-btn')) {
                this.addNoticeItem();
            } else if (e.target.closest('.remove-notice-btn')) {
                this.removeNoticeItem(e.target.closest('.notice-item'));
            } else if (e.target.closest('.add-highlight-btn')) {
                this.addHighlightItem();
            } else if (e.target.closest('.remove-highlight-btn')) {
                this.removeHighlightItem(e.target.closest('.highlight-item'));
            } else if (e.target.closest('.duplicate-btn')) {
                this.duplicateItem(e.target.closest('.event-item, .notice-item, .highlight-item'));
            } else if (e.target.closest('.preview-btn')) {
                this.previewItem(e.target.closest('.event-item, .notice-item, .highlight-item'));
            } else if (e.target.closest('.image-upload-btn')) {
                const imageInputGroup = e.target.closest('.image-input-group');
                if (imageInputGroup) {
                    const input = imageInputGroup.querySelector('input');
                    if (input) {
                        this.openImageUploader(input);
                    }
                }
            }
        });
    }

    /**
     * Initialize drag and drop functionality
     */
    initializeDragAndDrop() {
        const sortableList = document.querySelector('.sortable-list');
        if (!sortableList) return;

        let draggedElement = null;

        // Add drag event listeners
        sortableList.addEventListener('dragstart', (e) => {
            if (e.target.closest('.event-item, .notice-item, .highlight-item')) {
                draggedElement = e.target.closest('.event-item, .notice-item, .highlight-item');
                draggedElement.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
            }
        });

        sortableList.addEventListener('dragend', (e) => {
            if (draggedElement) {
                draggedElement.classList.remove('dragging');
                draggedElement = null;
            }
        });

        sortableList.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            
            const afterElement = this.getDragAfterElement(sortableList, e.clientY);
            if (afterElement == null) {
                sortableList.appendChild(draggedElement);
            } else {
                sortableList.insertBefore(draggedElement, afterElement);
            }
        });

        sortableList.addEventListener('drop', (e) => {
            e.preventDefault();
            if (draggedElement) {
                this.updateItemOrder();
                this.showNotification('success', 'Items reordered successfully');
            }
        });
    }

    /**
     * Get element after which to insert dragged element
     */
    getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.event-item, .notice-item, .highlight-item:not(.dragging)')];
        
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    /**
     * Update item order after drag and drop
     */
    updateItemOrder() {
        const items = document.querySelectorAll('.event-item, .notice-item, .highlight-item');
        items.forEach((item, index) => {
            item.dataset.index = index;
        });
    }

    /**
     * Initialize search and filter functionality
     */
    initializeSearchAndFilter() {
        const searchInput = document.getElementById('events-search') || document.getElementById('notices-search');
        const sortButton = document.getElementById('sort-events') || document.getElementById('sort-notices');

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                // Use contextual search for events
                if (searchInput.id === 'events-search') {
                    this.filterEvents(e.target.value);
                } else {
                    // Use generic filter for notices
                    this.filterItems(e.target.value, 'search');
                }
            });
        }

        if (sortButton) {
            sortButton.addEventListener('click', () => {
                this.showSortOptions();
            });
        }
    }

    /**
     * Filter items based on search term and category
     */
    filterItems(value, type) {
        const items = document.querySelectorAll('.event-item, .notice-item, .highlight-item');
        const searchTerm = value.toLowerCase();

        items.forEach(item => {
            const title = item.querySelector('input[name="title"]')?.value.toLowerCase() || '';
            const content = item.querySelector('textarea[name="content"], input[name="content"]')?.value.toLowerCase() || '';
            const category = item.querySelector('select[name="category"]')?.value || '';
            const icon = item.querySelector('select[name="icon"]')?.value || '';

            let showItem = true;

            if (type === 'search' && searchTerm) {
                showItem = title.includes(searchTerm) || content.includes(searchTerm);
            } else if (type === 'category' && value) {
                showItem = category === value || icon === value;
            }

            item.style.display = showItem ? 'block' : 'none';
        });

        // Update empty state visibility
        this.updateEmptyStateVisibility();
    }

    /**
     * Show sort options
     */
    showSortOptions() {
        const sortOptions = [
            { label: 'Title A-Z', value: 'title-asc' },
            { label: 'Title Z-A', value: 'title-desc' },
            { label: 'Date (Newest)', value: 'date-desc' },
            { label: 'Date (Oldest)', value: 'date-asc' },
            { label: 'Category', value: 'category' }
        ];

        // Create dropdown menu
        const dropdown = document.createElement('div');
        dropdown.className = 'sort-dropdown';
        dropdown.innerHTML = sortOptions.map(option => 
            `<div class="sort-option" data-value="${option.value}">${option.label}</div>`
        ).join('');

        // Position and show dropdown
        const sortButton = document.getElementById('sort-events') || document.getElementById('sort-notices');
        const rect = sortButton.getBoundingClientRect();
        dropdown.style.position = 'fixed';
        dropdown.style.top = `${rect.bottom + 5}px`;
        dropdown.style.left = `${rect.left}px`;
        dropdown.style.zIndex = '1000';

        document.body.appendChild(dropdown);

        // Add click handlers
        dropdown.addEventListener('click', (e) => {
            if (e.target.classList.contains('sort-option')) {
                this.sortItems(e.target.dataset.value);
                dropdown.remove();
            }
        });

        // Close on outside click
        setTimeout(() => {
            document.addEventListener('click', function closeDropdown() {
                dropdown.remove();
                document.removeEventListener('click', closeDropdown);
            });
        }, 100);
    }

    /**
     * Sort items
     */
    sortItems(sortBy) {
        const container = document.querySelector('.sortable-list');
        const items = Array.from(container.querySelectorAll('.event-item, .notice-item, .highlight-item'));

        items.sort((a, b) => {
            switch (sortBy) {
                case 'title-asc':
                    return a.querySelector('input[name="title"]')?.value.localeCompare(b.querySelector('input[name="title"]')?.value);
                case 'title-desc':
                    return b.querySelector('input[name="title"]')?.value.localeCompare(a.querySelector('input[name="title"]')?.value);
                case 'date-desc':
                    return new Date(b.querySelector('input[name="eventDate"]')?.value || 0) - new Date(a.querySelector('input[name="eventDate"]')?.value || 0);
                case 'date-asc':
                    return new Date(a.querySelector('input[name="eventDate"]')?.value || 0) - new Date(b.querySelector('input[name="eventDate"]')?.value || 0);
                case 'category':
                    return a.querySelector('select[name="category"]')?.value.localeCompare(b.querySelector('select[name="category"]')?.value);
                default:
                    return 0;
            }
        });

        // Re-append sorted items
        items.forEach(item => container.appendChild(item));
        this.updateItemOrder();
    }

    /**
     * Initialize bulk actions
     */
    initializeBulkActions() {
        const bulkActionsBtn = document.getElementById('bulk-actions-btn');
        const bulkActionsPanel = document.getElementById('bulk-actions-panel');
        const checkboxes = document.querySelectorAll('.item-checkbox');

        if (bulkActionsBtn && bulkActionsPanel) {
            bulkActionsBtn.addEventListener('click', () => {
                const isVisible = bulkActionsPanel.style.display !== 'none';
                bulkActionsPanel.style.display = isVisible ? 'none' : 'block';
                bulkActionsBtn.textContent = isVisible ? 'Bulk Actions' : 'Hide Actions';
            });
        }

        // Handle checkbox changes
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.updateBulkActionsState();
            });
        });

        // Handle bulk action buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('#bulk-delete')) {
                this.bulkDelete();
            } else if (e.target.closest('#bulk-publish')) {
                this.bulkPublish();
            } else if (e.target.closest('#bulk-unpublish')) {
                this.bulkUnpublish();
            }
        });
    }

    /**
     * Update bulk actions state
     */
    updateBulkActionsState() {
        const selectedItems = document.querySelectorAll('.item-checkbox:checked');
        const selectedCount = selectedItems.length;
        const selectedCountElement = document.querySelector('.selected-count');
        
        if (selectedCountElement) {
            selectedCountElement.textContent = `${selectedCount} item${selectedCount !== 1 ? 's' : ''} selected`;
        }

        // Enable/disable bulk action buttons
        const bulkButtons = document.querySelectorAll('#bulk-actions-panel button');
        bulkButtons.forEach(button => {
            button.disabled = selectedCount === 0;
        });
    }

    /**
     * Initialize icon preview updates
     */
    initializeIconPreview() {
        document.addEventListener('change', (e) => {
            if (e.target.name === 'icon') {
                const iconPreview = e.target.closest('.icon-selector').querySelector('.icon-preview i');
                if (iconPreview) {
                    iconPreview.setAttribute('data-lucide', e.target.value);
                    if (typeof lucide !== 'undefined') {
                        lucide.createIcons();
                    }
                }
            }
        });
    }

    /**
     * Duplicate item
     */
    duplicateItem(item) {
        if (!item) return;

        const clonedItem = item.cloneNode(true);
        const titleInput = clonedItem.querySelector('input[name="title"]');
        if (titleInput) {
            titleInput.value = titleInput.value + ' (Copy)';
        }

        item.parentNode.insertBefore(clonedItem, item.nextSibling);
        this.updateItemOrder();
        this.showNotification('success', 'Item duplicated successfully');
    }

    /**
     * Preview item
     */
    previewItem(item) {
        if (!item) return;

        const title = item.querySelector('input[name="title"]')?.value || 'Untitled';
        const content = item.querySelector('textarea[name="content"], input[name="content"]')?.value || 'No content';
        const category = item.querySelector('select[name="category"]')?.value || '';
        const date = item.querySelector('input[name="eventDate"]')?.value || '';

        // Create preview modal
        const modal = document.createElement('div');
        modal.className = 'preview-modal-overlay';
        modal.innerHTML = `
            <div class="preview-modal">
                <div class="preview-modal-header">
                    <h3>Preview: ${title}</h3>
                    <button class="preview-close">&times;</button>
                </div>
                <div class="preview-modal-body">
                    <div class="preview-content">
                        <h4>${title}</h4>
                        ${category ? `<span class="preview-category">${category}</span>` : ''}
                        ${date ? `<span class="preview-date">${new Date(date).toLocaleDateString()}</span>` : ''}
                        <p>${content}</p>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Close modal handlers
        modal.querySelector('.preview-close').addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }

    /**
     * Open image uploader with Cloudinary integration
     */
    openImageUploader(inputElement) {
        // Create Cloudinary upload widget
        const cloudinaryWidget = cloudinary.createUploadWidget({
            cloudName: window.CLOUDINARY_CLOUD_NAME,
            uploadPreset: window.CLOUDINARY_UPLOAD_PRESET,
            sources: ['local', 'url', 'camera'],
            multiple: false,
            cropping: true,
            croppingAspectRatio: 4/3,
            croppingShowDimensions: true,
            showAdvancedOptions: false,
            folder: 'marigold-school/events',
            resourceType: 'image',
            maxFileSize: 25000000, // 25MB
            clientAllowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
            theme: 'minimal',
            styles: {
                palette: {
                    window: "#FFFFFF",
                    sourceBg: "#f4f4f5",
                    windowBorder: "#90a0b3",
                    tabIcon: "#000000",
                    inactiveTabIcon: "#555a5f",
                    menuIcons: "#555a5f",
                    link: "#0433ff",
                    action: "#339393",
                    inProgress: "#0433ff",
                    complete: "#20b832",
                    error: "#cc2727",
                    textDark: "#000000",
                    textLight: "#FFFFFF"
                },
                fonts: {
                    default: null,
                    "'Inter', sans-serif": {
                        url: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap",
                        active: true
                    }
                }
            }
        }, (error, result) => {
            if (error) {
                console.error('Cloudinary upload error:', error);
                this.showNotification('error', 'Failed to upload image: ' + error.message);
                return;
            }
            
            if (result && result.event === 'success') {
                const imageUrl = result.info.secure_url;
                inputElement.value = imageUrl;
                
                // Show preview
                this.showImagePreview(inputElement, imageUrl);
                
                this.showNotification('success', 'Image uploaded successfully!');
            }
        });

        // Open the widget
        cloudinaryWidget.open();
    }

    /**
     * Show image preview
     */
    showImagePreview(inputElement, imageUrl) {
        // Remove existing preview if any
        const existingPreview = inputElement.parentNode.querySelector('.image-preview');
        if (existingPreview) {
            existingPreview.remove();
        }

        // Create preview element
        const preview = document.createElement('div');
        preview.className = 'image-preview';
        preview.innerHTML = `
            <div class="image-preview-container">
                <img src="${imageUrl}" alt="Preview" style="max-width: 100px; max-height: 60px; border-radius: 4px; object-fit: cover;">
                <button type="button" class="remove-image-btn" data-action="remove-image">
                    <i data-lucide="x"></i>
                </button>
            </div>
        `;

        // Add styles for preview
        const style = document.createElement('style');
        style.textContent = `
            .image-preview {
                margin-top: 8px;
            }
            .image-preview-container {
                position: relative;
                display: inline-block;
            }
            .remove-image-btn {
                position: absolute;
                top: -8px;
                right: -8px;
                background: #ef4444;
                color: white;
                border: none;
                border-radius: 50%;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                font-size: 12px;
            }
            .remove-image-btn:hover {
                background: #dc2626;
            }
        `;
        
        if (!document.querySelector('#image-preview-styles')) {
            style.id = 'image-preview-styles';
            document.head.appendChild(style);
        }

        // Insert preview after input
        inputElement.parentNode.insertBefore(preview, inputElement.nextSibling);
        
        // Reinitialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    /**
     * Update empty state visibility
     */
    updateEmptyStateVisibility() {
        const items = document.querySelectorAll('.event-item, .notice-item, .highlight-item');
        const visibleItems = Array.from(items).filter(item => item.style.display !== 'none');
        const emptyState = document.getElementById('events-empty-state') || document.getElementById('notices-empty-state');
        
        if (emptyState) {
            emptyState.style.display = visibleItems.length === 0 ? 'block' : 'none';
        }
    }

    /**
     * Bulk delete selected items
     */
    bulkDelete() {
        const selectedItems = document.querySelectorAll('.item-checkbox:checked');
        if (selectedItems.length === 0) return;

        if (confirm(`Are you sure you want to delete ${selectedItems.length} item(s)?`)) {
            selectedItems.forEach(checkbox => {
                checkbox.closest('.event-item, .notice-item, .highlight-item').remove();
            });
            this.updateBulkActionsState();
            this.showNotification('success', `${selectedItems.length} item(s) deleted successfully`);
        }
    }

    /**
     * Bulk publish selected items
     */
    bulkPublish() {
        const selectedItems = document.querySelectorAll('.item-checkbox:checked');
        selectedItems.forEach(checkbox => {
            const statusBadge = checkbox.closest('.event-item, .notice-item, .highlight-item').querySelector('.status-badge');
            if (statusBadge) {
                statusBadge.className = 'status-badge active';
                statusBadge.innerHTML = '<i data-lucide="eye"></i>Published';
            }
        });
        this.showNotification('success', `${selectedItems.length} item(s) published successfully`);
    }

    /**
     * Bulk unpublish selected items
     */
    bulkUnpublish() {
        const selectedItems = document.querySelectorAll('.item-checkbox:checked');
        selectedItems.forEach(checkbox => {
            const statusBadge = checkbox.closest('.event-item, .notice-item, .highlight-item').querySelector('.status-badge');
            if (statusBadge) {
                statusBadge.className = 'status-badge inactive';
                statusBadge.innerHTML = '<i data-lucide="eye-off"></i>Draft';
            }
        });
        this.showNotification('success', `${selectedItems.length} item(s) unpublished successfully`);
    }

    /**
     * Add event item
     */
    addEventItem() {
        const container = document.getElementById('events-list');
        const index = container.children.length;
        const eventHtml = `
            <div class="event-item" data-index="${index}">
                <div class="form-grid">
                    <div class="form-group">
                        <label>Event Title</label>
                        <input type="text" name="title" required>
                    </div>
                    <div class="form-group">
                        <label>Category</label>
                        <select name="category">
                            <option value="Academic">Academic</option>
                            <option value="Social">Social</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Event Date</label>
                        <input type="date" name="eventDate">
                    </div>
                    <div class="form-group">
                        <label>Image URL</label>
                        <input type="url" name="imageUrl">
                    </div>
                    <div class="form-group full-width">
                        <label>Description</label>
                        <textarea name="content" rows="2"></textarea>
                    </div>
                    <div class="form-group">
                        <button type="button" class="btn btn-danger remove-event-btn">
                            <i data-lucide="trash-2"></i>
                            Remove
                        </button>
                    </div>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', eventHtml);
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    /**
     * Remove event item
     */
    removeEventItem(item) {
        item.remove();
    }

    /**
     * Add notice item
     */
    addNoticeItem() {
        const container = document.getElementById('notices-list');
        const index = container.children.length;
        const noticeHtml = `
            <div class="notice-item" data-index="${index}">
                <div class="form-grid">
                    <div class="form-group">
                        <label>Notice Title</label>
                        <input type="text" name="title" required>
                    </div>
                    <div class="form-group">
                        <label>Icon</label>
                        <select name="icon">
                            <option value="file-text">File Text</option>
                            <option value="users">Users</option>
                            <option value="calendar">Calendar</option>
                            <option value="book-open">Book Open</option>
                        </select>
                    </div>
                    <div class="form-group full-width">
                        <label>Content</label>
                        <input type="text" name="content" required>
                    </div>
                    <div class="form-group">
                        <button type="button" class="btn btn-danger remove-notice-btn">
                            <i data-lucide="trash-2"></i>
                            Remove
                        </button>
                    </div>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', noticeHtml);
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    /**
     * Remove notice item
     */
    removeNoticeItem(item) {
        item.remove();
    }

    /**
     * Add highlight item
     */
    addHighlightItem() {
        const container = document.getElementById('highlights-list');
        const index = container.children.length;
        const highlightHtml = `
            <div class="highlight-item" data-index="${index}">
                <div class="form-grid">
                    <div class="form-group">
                        <label>Title</label>
                        <input type="text" name="title" required>
                    </div>
                    <div class="form-group">
                        <label>Badge</label>
                        <input type="text" name="badge">
                    </div>
                    <div class="form-group full-width">
                        <label>Description</label>
                        <textarea name="content" rows="3"></textarea>
                    </div>
                    <div class="form-group full-width">
                        <label>Image URL</label>
                        <input type="url" name="imageUrl">
                    </div>
                    <div class="form-group">
                        <button type="button" class="btn btn-danger remove-highlight-btn">
                            <i data-lucide="trash-2"></i>
                            Remove
                        </button>
                    </div>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', highlightHtml);
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    /**
     * Remove highlight item
     */
    removeHighlightItem(item) {
        item.remove();
    }

    /**
     * Load section statuses from database
     */
    async loadSectionStatuses() {
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                // If no token, set default statuses and remove shimmer
                this.setDefaultSectionStatuses();
                return;
            }

            // Add cache-busting to always get fresh data
            const cacheBuster = `?t=${Date.now()}`;
            const response = await fetch(`/api/content/events-content${cacheBuster}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                }
            });

            if (!response.ok) {
                // If API fails, set default statuses and remove shimmer
                this.setDefaultSectionStatuses();
                return;
            }

            const allContent = await response.json();
            
            // Group by section and check if any content is active
            const sectionStatuses = {};
            if (allContent && Array.isArray(allContent)) {
            allContent.forEach(item => {
                if (!sectionStatuses[item.section]) {
                    sectionStatuses[item.section] = false;
                }
                if (item.isActive) {
                    sectionStatuses[item.section] = true;
                }
            });
            }

            // Update section statuses
            Object.keys(this.sections).forEach(section => {
                this.sections[section].enabled = sectionStatuses[section] !== false;
                this.updateSectionStatus(section);
            });

            // Remove shimmer effects after loading
            this.removeShimmerEffects();

        } catch (error) {
            console.error('Error loading section statuses:', error);
            // Set default statuses and remove shimmer on error
            this.setDefaultSectionStatuses();
        }
    }

    /**
     * Set default section statuses and remove shimmer
     */
    setDefaultSectionStatuses() {
        Object.keys(this.sections).forEach(section => {
            this.sections[section].enabled = true; // Default to enabled
            this.updateSectionStatus(section);
        });
        this.removeShimmerEffects();
    }

    /**
     * Remove shimmer effects from section items
     */
    removeShimmerEffects() {
        const sectionItems = document.querySelectorAll('.section-menu-item');
        sectionItems.forEach(item => {
            // Remove shimmer classes
            item.classList.remove('shimmer-placeholder');
            
            // Remove shimmer elements
            const shimmerElements = item.querySelectorAll('.shimmer-shape, .shimmer-circle, .shimmer-text, .shimmer-title, .shimmer-subtitle, .shimmer-toggle');
            shimmerElements.forEach(el => el.remove());
            
            // Restore proper content
            this.restoreSectionContent(item);
        });
    }

    /**
     * Restore proper section content after removing shimmer
     */
    restoreSectionContent(sectionItem) {
        const section = sectionItem.dataset.eventsSection;
        const sectionData = this.sections[section];
        
        if (!sectionData) return;

        // Update section header
        const sectionHeader = sectionItem.querySelector('.section-header');
        if (sectionHeader) {
            sectionHeader.innerHTML = `
                <div class="section-icon">${sectionData.icon}</div>
                <div class="section-info">
                    <div class="section-title">${sectionData.name}</div>
                    <div class="section-subtitle">Manage ${sectionData.name.toLowerCase()} content</div>
                </div>
            `;
        }
    }

    /**
     * Get events content HTML
     */
    getEventsContent() {
        return `
            <section id="events-content-section" class="content-section active">
                <div class="page-header">
                    <div class="page-title">
                        <h1>Events & Notices Content Management</h1>
                        <p>Manage and organize your events and notices sections with our intuitive editor.</p>
                    </div>
                </div>

                <!-- Section List View -->
                <div id="sectionList" class="section-list-view">
                    <div class="sections-grid">
                        ${Object.entries(this.sections).map(([key, section]) => `
                            <div class="section-menu-item" data-events-section="${key}">
                                <div class="section-header">
                                    <div class="section-icon">${section.icon}</div>
                                    <div class="section-info">
                                        <div class="section-title">${section.name}</div>
                                        <div class="section-subtitle">Manage ${section.name.toLowerCase()} content</div>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Section Editor View -->
                <div id="sectionEditor" class="section-editor-view" style="display: none;">
                    <!-- Editor content will be loaded here -->
                </div>
            </section>
        `;
    }

    /**
     * Get section editor HTML for specific section
     */
    getSectionEditor(section) {
        const breadcrumb = this.getBreadcrumbHTML(section);
        let editorContent = '';
        
        switch(section) {
            case 'featured_hero':
                editorContent = this.getFeaturedHeroEditor();
                break;
            case 'upcoming_events':
            case 'past_events':
                editorContent = this.getEventsEditor(section);
                break;
            case 'notices':
                editorContent = this.getNoticesEditor();
                break;
            case 'highlights':
                editorContent = this.getHighlightsEditor();
                break;
        }

        return `
            ${breadcrumb}
            <div class="section-editor">
                
                <div class="editor-header">
                    <h2>Edit ${this.sections[section].name}</h2>
                    <p>Configure the content and settings for this section.</p>
                </div>
                
                <div class="editor-content">
                    ${editorContent}
                </div>
                
            </div>
        `;
    }

    /**
     * Get breadcrumb HTML for section
     */
    getBreadcrumbHTML(section, eventName = null) {
        const sectionName = this.sections[section]?.name || 'Unknown Section';
        
        if (eventName) {
            return `
                <!-- Simple Breadcrumb with Event -->
                <div class="simple-breadcrumb">
                    <button class="back-button" data-action="back-to-section-list">
                        <i data-lucide="arrow-left"></i>
                    </button>
                    <div class="breadcrumb-path">
                        <span>Events & Notices</span>
                        <i data-lucide="chevron-right"></i>
                        <span>${sectionName}</span>
                        <i data-lucide="chevron-right"></i>
                        <span id="currentSectionName">${eventName}</span>
                    </div>
                </div>
            `;
        }
        
        return `
            <!-- Simple Breadcrumb -->
            <div class="simple-breadcrumb">
                <button class="back-button" data-action="back-to-section-list">
                    <i data-lucide="arrow-left"></i>
                </button>
                <div class="breadcrumb-path">
                    <span>Events & Notices</span>
                    <i data-lucide="chevron-right"></i>
                    <span id="currentSectionName">${sectionName}</span>
                </div>
            </div>
        `;
    }

    /**
     * Initialize hero editor functionality
     */
    initializeHeroEditor() {
        
        // Wait a bit for DOM to be ready
        setTimeout(() => {
            // Initialize ImageUpload component for hero image
            this.initializeHeroImageUpload();
            
            // Initialize save button for featured hero section
            this.initializeFeaturedHeroSaveButton();
            
            // Initialize event selector functionality
            this.initializeEventSelector();
            
            // Initialize manual form change tracking
            this.initializeManualFormChangeTracking();
            
        }, 100);
    }

    /**
     * Initialize hero image upload using ImageUpload component
     */
    initializeHeroImageUpload(existingImageUrl = '') {
        // Destroy existing instance if any
        if (this.heroImageUpload) {
            this.heroImageUpload.destroy();
        }

        // Create new ImageUpload instance
        this.heroImageUpload = new ImageUpload({
            fileInputId: 'hero-image-upload',
            urlInputId: 'hero-image-url',
            selectBtnId: 'hero-image-select-btn',
            previewContainerId: 'hero-image-preview-container',
            previewImgId: 'hero-image-preview',
            removeBtnId: 'hero-image-remove-btn',
            uploadPath: '/api/upload/image',
            uploadFolder: 'marigold-school/events/featured-hero',
            autoUpload: false, // Disable auto-upload, we'll handle it during save
            showNotification: (type, message) => this.showNotification(type, message),
            onUploadSuccess: (result) => {
            },
            onUploadError: (error) => {
                console.error('Hero image upload error:', error);
            }
        });

        // Initialize the component
        this.heroImageUpload.init();

        // Set existing image if provided
        if (existingImageUrl) {
            this.heroImageUpload.setImageUrl(existingImageUrl);
        }
    }

    /**
     * Initialize save button for featured hero section
     */
    initializeFeaturedHeroSaveButton() {
        const container = document.getElementById('save-button-container');
        if (!container) {
            console.error('❌ Save button container not found for featured hero');
            return;
        }


        // Create a button element first
        const saveButton = document.createElement('button');
        saveButton.className = 'btn btn-primary save-section-btn';
        saveButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="save" class="lucide lucide-save">
                <path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"></path>
                <path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"></path>
                <path d="M7 3v4a1 1 0 0 0 1 1h7"></path>
            </svg>
            Save Featured Hero
        `;
        container.appendChild(saveButton);

        // Initialize SaveButton component
        const saveButtonComponent = new SaveButton({
            target: saveButton,
            dataSection: 'featured_hero',
            hasImages: true,
            uploadProgress: {
                start: 10,
                end: 40
            },
            messages: {
                preparing: 'Preparing...',
                collecting: 'Collecting data...',
                saving: 'Saving to database...',
                success: 'Featured Hero saved successfully!'
            },
            percentages: {
                collecting: 40,
                saving: 85,
                success: 100
            },
            onSave: async (button) => {
                try {
                    const token = localStorage.getItem('adminToken');
                    if (!token) {
                        throw new Error('Authentication required');
                    }

                    button.setProgress('Collecting data...', 25);
                    
                    // Handle image upload for featured_hero section
                    if (this.heroImageUpload && this.heroImageUpload.hasPendingUpload()) {
                        button.setProgress('Uploading image...', 10);
                        
                        try {
                            const fileInput = document.getElementById('hero-image-upload');
                            const file = fileInput.files[0];
                            if (file) {
                                const uploadResult = await this.heroImageUpload.uploadFile(file);
                                
                                // Ensure the URL input is updated
                                const urlInput = document.getElementById('hero-image-url');
                                if (urlInput && uploadResult.url) {
                                    urlInput.value = uploadResult.url;
                                }
                            }
                        } catch (uploadError) {
                            console.error('❌ Image upload failed:', uploadError);
                            throw new Error(`Failed to upload image: ${uploadError.message}`);
                        }
                    }

                    button.setProgress('Collecting data...', 40);
                    
                    // Collect hero data
                    const heroData = this.collectFeaturedHeroData();

                    button.setProgress('Saving to database...', 75);
                    
                    
                    const response = await fetch('/api/content/events-content/bulk', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ content: heroData })
                    });
                    

                    if (!response.ok) {
                        const errorData = await response.json();
                        console.error('❌ API error response:', errorData);
                        throw new Error(errorData.message || 'Failed to save featured hero');
                    }

                    const result = await response.json();
                    
                    button.setProgress('Featured Hero saved successfully!', 100);
                    
                    // Navigate back to section list after successful save
                    setTimeout(() => {
                        this.showSectionList();
                    }, 1500); // Wait 1.5 seconds to show success message
                    
                    return result;

                } catch (error) {
                    throw error;
                }
            }
        });

    }

    /**
     * Initialize event selector functionality
     */
    async initializeEventSelector() {
        
        const eventSelector = document.getElementById('event-selector');
        if (!eventSelector) {
            console.warn('❌ Event selector not found');
            return;
        }

        // Load past events
        await this.loadPastEvents();

        // Set up event listener for selection
        eventSelector.addEventListener('change', (e) => {
            const selectedEventId = e.target.value;
            if (selectedEventId && selectedEventId !== 'loading') {
                this.autoFillFromPastEvent(selectedEventId);
            }
        });

    }

    /**
     * Load past events into the selector dropdown
     */
    async loadPastEvents() {
        
        const eventSelector = document.getElementById('event-selector');
        if (!eventSelector) {
            console.warn('❌ Event selector not found');
            return;
        }

        try {
            // Update selector to show loading state
            eventSelector.innerHTML = '<option value="loading" disabled>Loading past events...</option>';

            // Fetch past events data
            const response = await fetch('/api/content/events?type=past', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success && data.content && data.content.past && data.content.past.length > 0) {
                // Clear loading option and add past events
                eventSelector.innerHTML = '<option value="">Choose a past event to auto-fill...</option>';
                
                data.content.past.forEach(event => {
                    const option = document.createElement('option');
                    option.value = event.id;
                    option.textContent = `${event.title} (${new Date(event.date).toLocaleDateString()})`;
                    option.dataset.eventData = JSON.stringify(event);
                    eventSelector.appendChild(option);
                });

                
                // Set the selected value if there's a stored past event ID
                if (this.selectedPastEventId) {
                    eventSelector.value = this.selectedPastEventId;
                }
            } else {
                eventSelector.innerHTML = '<option value="">No past events found</option>';
            }

        } catch (error) {
            console.error('❌ Error loading past events:', error);
            eventSelector.innerHTML = '<option value="">Error loading events</option>';
            this.showNotification('error', 'Failed to load past events');
        }
    }

    /**
     * Auto-fill form fields from selected past event
     */
    autoFillFromPastEvent(eventId) {
        
        const eventSelector = document.getElementById('event-selector');
        const selectedOption = eventSelector.querySelector(`option[value="${eventId}"]`);
        
        if (!selectedOption || !selectedOption.dataset.eventData) {
            console.warn('❌ No event data found for selected event');
            return;
        }

        try {
            const eventData = JSON.parse(selectedOption.dataset.eventData);

            // Store the selected past event ID
            this.selectedPastEventId = eventId;

            // Fill form fields
            const titleField = document.getElementById('hero-title');
            const descriptionField = document.getElementById('hero-description');
            const buttonTextField = document.getElementById('hero-button-text');

            if (titleField && eventData.title) {
                titleField.value = eventData.title;
            }

                    if (descriptionField && (eventData.description || eventData.subtitle)) {
                        descriptionField.value = eventData.description || eventData.subtitle;
                    }

            if (buttonTextField) {
                buttonTextField.value = eventData.buttonText || 'Learn More';
            }

                    // Handle image if available
                    if ((eventData.image || eventData.imageUrl) && this.heroImageUpload) {
                        const imageUrl = eventData.image || eventData.imageUrl;
                        this.heroImageUpload.setImageUrl(imageUrl);
                    }

            this.showNotification('success', `Auto-filled form with data from "${eventData.title}"`);

        } catch (error) {
            console.error('❌ Error auto-filling form:', error);
            this.showNotification('error', 'Failed to auto-fill form data');
        }
    }

    /**
     * Initialize manual form change tracking to clear selectedPastEventId
     */
    initializeManualFormChangeTracking() {
        
        // Track changes to form fields
        const titleField = document.getElementById('hero-title');
        const descriptionField = document.getElementById('hero-description');
        const buttonTextField = document.getElementById('hero-button-text');
        
        const clearPastEventId = () => {
            if (this.selectedPastEventId) {
                this.selectedPastEventId = null;
            }
        };
        
        if (titleField) {
            titleField.addEventListener('input', clearPastEventId);
            titleField.addEventListener('change', clearPastEventId);
        }
        
        if (descriptionField) {
            descriptionField.addEventListener('input', clearPastEventId);
            descriptionField.addEventListener('change', clearPastEventId);
        }
        
        if (buttonTextField) {
            buttonTextField.addEventListener('input', clearPastEventId);
            buttonTextField.addEventListener('change', clearPastEventId);
        }
        
    }

    /**
     * Collect featured hero data from form
     */
    collectFeaturedHeroData() {
        const title = document.getElementById('hero-title')?.value || '';
        const description = document.getElementById('hero-description')?.value || '';
        const buttonText = document.getElementById('hero-button-text')?.value || '';
        
        // Get image URL from ImageUpload component or fallback to input
        let imageUrl = '';
        if (this.heroImageUpload) {
            imageUrl = this.heroImageUpload.getImageUrl();
        } else {
            imageUrl = document.getElementById('hero-image-url')?.value || '';
        }
        

        const heroData = {
            featured_hero: {
                title: title,
                description: description,
                buttonText: buttonText,
                imageUrl: imageUrl,
                enabled: true,
                pastEventId: this.selectedPastEventId // Include the selected past event ID
            }
        };


        return heroData;
    }

    /**
     * Setup hero image upload handlers (legacy method - now uses ImageUpload component)
     */
    setupHeroImageUploadHandlers() {
        // This method is now handled by initializeHeroImageUpload
    }

    /**
     * Open image uploader for hero image
     */
    openImageUploader(inputElement, previewElement, removeBtn) {
        
        // Create a file input for image selection
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';
        document.body.appendChild(fileInput);
        
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                // Validate file size (25MB max)
                if (file.size > 25 * 1024 * 1024) {
                    this.showNotification('error', 'File size too large. Please select an image smaller than 25MB.');
                    document.body.removeChild(fileInput);
                    return;
                }
                
                // Validate file type
                if (!file.type.startsWith('image/')) {
                    this.showNotification('error', 'Please select a valid image file.');
                    document.body.removeChild(fileInput);
                    return;
                }
                
                // Convert file to base64 for preview (CSP-safe)
                const reader = new FileReader();
                reader.onload = (e) => {
                    const base64Url = e.target.result;
                    
                    // Store the file for later upload
                    inputElement.dataset.selectedFile = JSON.stringify({
                        name: file.name,
                        size: file.size,
                        type: file.type,
                        base64: base64Url
                    });
                    
                    // Show preview
                    this.updateImagePreview(base64Url, previewElement, removeBtn);
                };
                reader.readAsDataURL(file);
                
                // Show notification
                this.showNotification('success', 'Image selected! Click "Save Changes" to upload to Cloudinary.');
            }
            document.body.removeChild(fileInput);
        });
        
        fileInput.click();
    }

    /**
     * Update image preview
     */
    updateImagePreview(imageUrl, previewElement, removeBtn) {
        if (imageUrl && previewElement) {
            previewElement.innerHTML = `
                <img src="${imageUrl}" alt="Hero background" style="width: 200px; height: 150px; object-fit: cover; border-radius: 8px; border: 1px solid #e5e7eb;">
            `;
            if (removeBtn) {
                removeBtn.style.display = 'inline-flex';
            }
        } else {
            previewElement.innerHTML = `
                <div class="image-upload-placeholder">
                    <i data-lucide="image"></i>
                    <span>No image selected</span>
                </div>
            `;
            if (removeBtn) {
                removeBtn.style.display = 'none';
            }
        }
        
        // Reinitialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    /**
     * Remove image
     */
    removeImage(inputElement, previewElement, removeBtn) {
        inputElement.value = '';
        delete inputElement.dataset.selectedFile;
        this.updateImagePreview('', previewElement, removeBtn);
        this.showNotification('info', 'Image removed');
    }


    /**
     * Upload file via server to avoid CSP issues
     */
    async uploadViaServer(fileData) {
        try {
            // Send base64 data to server for upload
            const response = await fetch('/api/upload/image', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                },
                body: JSON.stringify({
                    imageData: fileData.base64,
                    fileName: fileData.name,
                    folder: 'marigold-school/events/hero'
                })
            });
            
            if (response.ok) {
                const result = await response.json();
                return result.url;
            } else {
                const errorText = await response.text();
                console.error('Server upload failed:', response.status, errorText);
                throw new Error(`Server upload failed: ${response.status}`);
            }
        } catch (error) {
            console.error('Server upload error:', error);
            throw error;
        }
    }

    /**
     * Fallback: Save image as base64 (when server upload fails)
     */
    saveImageAsBase64(fileData) {
        return fileData.base64;
    }

    /**
     * Get Featured Hero Editor
     */
    getFeaturedHeroEditor() {
        return `
            <!-- Event Selector -->
            <div class="event-selector-container" style="margin-bottom: 2rem; padding: 1.5rem; background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0;">
                <div class="event-selector-header" style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
                    <i data-lucide="history" style="color: #64748b; width: 20px; height: 20px;"></i>
                    <h3 style="margin: 0; font-size: 1.125rem; font-weight: 600; color: #1e293b;">Quick Fill from Past Events</h3>
                </div>
                <div class="form-group">
                    <label for="event-selector" style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #374151;">Select Past Event</label>
                    <select id="event-selector" style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 8px; background: white; font-size: 0.875rem; color: #374151;">
                        <option value="">Choose a past event to auto-fill...</option>
                        <option value="loading" disabled>Loading past events...</option>
                    </select>
                    <p style="margin-top: 0.5rem; font-size: 0.75rem; color: #6b7280;">Select a past event to automatically fill the form fields below</p>
                </div>
            </div>

            <form class="section-editor-form">
                <div class="form-grid">
                    <div class="form-group full-width">
                        <label for="hero-title">Hero Title</label>
                        <input type="text" id="hero-title" required>
                    </div>
                    
                    <div class="form-group full-width">
                        <label for="hero-description">Hero Description</label>
                        <input type="text" id="hero-description">
                        
                    </div>
                    
                    <div class="form-group">
                        <label for="hero-button-text">Button Text</label>
                        <input type="text" id="hero-button-text">
                    </div>
                    
                    <div class="form-group full-width">
                        <label for="hero-image">Background Image</label>
                        ${ImageUpload.createHTML({
                            fileInputId: 'hero-image-upload',
                            urlInputId: 'hero-image-url',
                            selectBtnId: 'hero-image-select-btn',
                            previewContainerId: 'hero-image-preview-container',
                            previewImgId: 'hero-image-preview',
                            removeBtnId: 'hero-image-remove-btn',
                            buttonText: 'Select Image',
                            helpText: 'PNG, JPG, GIF up to 25MB'
                        })}
                    </div>
                </div>
                
                <div class="form-actions">
                    <div id="save-button-container"></div>
                </div>
            </form>
        `;
    }

    /**
     * Generate skeleton loader HTML for events list
     */
    getEventsSkeletonLoader(count = 6) {
        let skeletons = '';
        for (let i = 0; i < count; i++) {
            skeletons += `
                <div class="skeleton-event-item">
                    <div class="skeleton-event-info">
                        <div class="skeleton-title skeleton"></div>
                        <div class="skeleton-meta">
                            <div class="skeleton-category skeleton"></div>
                            <div class="skeleton-date skeleton"></div>
                            <div class="skeleton-time skeleton"></div>
                        </div>
                        <div class="skeleton-location skeleton"></div>
                        <div class="skeleton-description skeleton"></div>
                    </div>
                    <div class="skeleton-actions">
                        <div class="skeleton-action-btn skeleton"></div>
                        <div class="skeleton-action-btn skeleton"></div>
                    </div>
                </div>
            `;
        }
        return skeletons;
    }

    /**
     * Get Events Editor with enhanced UI
     */
    getEventsEditor(section) {
        return `
            <div class="events-list-view">
                <div class="list-header">
                    <div class="header-content">
                        <h3>${section === 'upcoming_events' ? 'Upcoming' : 'Past'} Events</h3>
                        <p class="header-subtitle">Click on an event to edit its details</p>
                    </div>
                    <div class="header-actions">
                        <button type="button" class="btn btn-primary add-event-btn">
                            <i data-lucide="plus"></i> Add Event
                        </button>
                    </div>
                    </div>
                    
                <div class="search-bar">
                    <input type="text" id="events-search" placeholder="Search events..." class="search-input">
                </div>
                
                <div id="events-list" class="events-list-container">
                        <!-- Skeleton loaders shown while data is loading -->
                        ${this.getEventsSkeletonLoader(6)}
                    </div>
                
                <div id="events-empty-state" class="empty-state" style="display: none;">
                    <div class="empty-icon">
                        <i data-lucide="calendar"></i>
                </div>
                    <h4>No events yet</h4>
                    <p>Add your first event to get started</p>
                    <button type="button" class="btn btn-primary add-event-btn">
                        <i data-lucide="plus"></i> Add Event
                    </button>
                </div>
            </div>
            
            <!-- Add Event Modal -->
            <div id="add-event-modal" class="modal-overlay" style="display: none;">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Add New Event</h3>
                        <button type="button" class="modal-close" data-action="close-add-event-modal">
                            <i data-lucide="x"></i>
                        </button>
                    </div>
                    <div class="modal-body" style="height: 400px; overflow-y: scroll; border: 3px solid blue; background: #f0f0f0;">
                        <form id="add-event-form">
                                    <!-- Hero Section -->
                                    <div class="form-section">
                                        <h4>Hero Section</h4>
                                        <div class="form-group">
                                            <label>Event Title</label>
                                            <input type="text" name="title" placeholder="Enter event title" class="form-input" required>
                                        </div>
                                        <div class="form-group">
                                            <label>Event Category</label>
                                            <select name="category" class="form-input">
                                                <option value="">Select Category</option>
                                                ${EVENT_CATEGORIES.map(cat => 
                                                    `<option value="${cat.value}">${cat.icon} ${cat.label}</option>`
                                                ).join('')}
                                            </select>
                                            <small class="form-help">Choose the most appropriate category for this event</small>
                                        </div>
                                        <div class="form-group">
                                            <label>Hero Background Image</label>
                                            <div class="image-upload-container">
                                                <div class="image-upload-preview">
                                                    <div class="image-upload-placeholder">
                                                        <i data-lucide="image"></i>
                                                        <span>No image selected</span>
                                                    </div>
                                                </div>
                                                <div class="image-input-group">
                                                    <input type="file" name="hero-image-upload" accept="image/*" style="display: none;">
                                                    <input type="text" name="hero-image-url" placeholder="Image URL" class="form-input" style="margin-bottom: 10px;">
                                                    <button type="button" class="btn btn-secondary image-upload-btn">
                                                        <i data-lucide="upload"></i> Select Image
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <!-- Event Summary -->
                                    <div class="form-section">
                                        <h4>Event Summary</h4>
                                        <div class="form-row">
                                            <div class="form-group">
                                                <label>Date</label>
                                                <input type="date" name="date" class="form-input" required>
                                            </div>
                                            <div class="form-group">
                                                <label>Time</label>
                                                <input type="text" name="time" placeholder="e.g., 10:00 AM - 4:00 PM" class="form-input">
                                            </div>
                                        </div>
                                        <div class="form-row">
                                            <div class="form-group">
                                                <label>Venue</label>
                                                <input type="text" name="venue" placeholder="Event venue" class="form-input">
                                            </div>
                                            <div class="form-group">
                                                <label>Organized by</label>
                                                <input type="text" name="organizer" placeholder="Event organizer" class="form-input">
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <!-- About Event -->
                                    <div class="form-section">
                                        <h4>About the Event</h4>
                                        <div class="form-group">
                                            <label>Event Description</label>
                                            <textarea name="description" rows="4" placeholder="Detailed event description..." class="form-textarea"></textarea>
                                        </div>
                                    </div>
                                    
                                    <!-- Event Schedule -->
                                    <div class="form-section">
                                        <h4>Event Schedule</h4>
                                        <div class="section-description">
                                            <p>Add timeline items for your event schedule. Each item will appear in the event timeline.</p>
                                        </div>
                                        <div id="add-schedule-items" class="dynamic-items-container">
                                            <div class="schedule-item" data-index="0" draggable="true">
                                                <div class="item-header">
                                                    <div class="item-header-content">
                                                        <button type="button" class="btn-drag" title="Drag to reorder">
                                                            <i data-lucide="grip-vertical"></i>
                                                        </button>
                                                        <span>Schedule Item 1</span>
                                                    </div>
                                                    <div class="item-actions">
                                                        <button type="button" class="btn btn-sm btn-danger remove-schedule-item" title="Remove this schedule item">
                                                            <i data-lucide="trash-2"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                                <div class="form-row">
                                                    <div class="form-group">
                                                        <label>Time</label>
                                                        <input type="text" name="schedule-time" value="10:00 AM" placeholder="e.g., 10:00 AM" class="form-input">
                                                    </div>
                                                    <div class="form-group">
                                                        <label>Event Name</label>
                                                        <input type="text" name="schedule-event" value="Opening Ceremony" placeholder="Event name" class="form-input">
                                                    </div>
                                                    <div class="form-group">
                                                        <label>Icon</label>
                                                        <select name="schedule-icon" class="form-input">
                                                            <option value="celebration">🎉 Celebration</option>
                                                            <option value="slideshow">📊 Slideshow</option>
                                                            <option value="mic">🎤 Microphone</option>
                                                            <option value="emoji_events">🏆 Trophy</option>
                                                            <option value="schedule">⏰ Schedule</option>
                                                            <option value="group">👥 Group</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="add-item-section">
                                            <button type="button" class="btn btn-secondary add-schedule-item">
                                                <i data-lucide="plus"></i> Add Schedule Item
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <!-- Guests & Performers -->
                                    <div class="form-section">
                                        <h4>Guests & Performers</h4>
                                        <div class="section-description">
                                            <p>Add guests, speakers, and performers for your event. Each guest will appear in the guests section.</p>
                                        </div>
                                        <div id="add-guests-items" class="dynamic-items-container">
                                            <div class="guest-item" data-index="0" draggable="true">
                                                <div class="item-header">
                                                    <div class="item-header-content">
                                                        <button type="button" class="btn-drag" title="Drag to reorder">
                                                            <i data-lucide="grip-vertical"></i>
                                                        </button>
                                                        <h5>Guest 1</h5>
                                                    </div>
                                                    <div class="item-actions">
                                                        <button type="button" class="btn btn-sm btn-danger remove-guest-item" title="Remove this guest">
                                                            <i data-lucide="trash-2"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                                <div class="form-row">
                                                    <div class="form-group">
                                                        <label>Guest Name</label>
                                                        <input type="text" name="guest-name" value="Dr. Evelyn Reed" placeholder="Guest name" class="form-input">
                                                    </div>
                                                    <div class="form-group">
                                                        <label>Role/Title</label>
                                                        <input type="text" name="guest-role" value="Keynote Speaker" placeholder="e.g., Keynote Speaker, Judge, Performer" class="form-input">
                                                    </div>
                                                    <div class="form-group">
                                                        <label>Avatar Image URL</label>
                                                        <input type="url" name="guest-avatar" value="" placeholder="https://example.com/avatar.jpg" class="form-input">
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="add-item-section">
                                            <button type="button" class="btn btn-secondary add-guest-item">
                                                <i data-lucide="plus"></i> Add Guest
                                            </button>
                                        </div>
                                    </div>
                                    
                                    
                                    <!-- Location -->
                                    <div class="form-section">
                                        <h4>Location</h4>
                                        <div class="form-group">
                                            <label>Map Image URL</label>
                                            <input type="url" name="location-map" placeholder="Map image URL" class="form-input">
                                        </div>
                                    </div>
                                    
                                    <!-- Contact & Help Desk -->
                                    <div class="form-section">
                                        <h4>Contact & Help Desk</h4>
                                        <div class="form-group">
                                            <label>Contact Information</label>
                                            <textarea name="contact-info" rows="3" placeholder="Contact information..." class="form-textarea">For any inquiries or assistance, please contact us or call us at (555) 123-4567. Our help desk is available Monday to Friday, 9:00 AM to 5:00 PM.</textarea>
                                        </div>
                                    </div>
                                    
                                    <!-- Test Section for Scrolling -->
                                    <div class="form-section">
                                        <h4>Test Section</h4>
                                        <div class="form-group">
                                            <label>Test Field 1</label>
                                            <input type="text" name="test1" placeholder="Test field 1" class="form-input">
                                        </div>
                                        <div class="form-group">
                                            <label>Test Field 2</label>
                                            <input type="text" name="test2" placeholder="Test field 2" class="form-input">
                                        </div>
                                        <div class="form-group">
                                            <label>Test Field 3</label>
                                            <input type="text" name="test3" placeholder="Test field 3" class="form-input">
                                        </div>
                                        <div class="form-group">
                                            <label>Test Field 4</label>
                                            <input type="text" name="test4" placeholder="Test field 4" class="form-input">
                                        </div>
                                        <div class="form-group">
                                            <label>Test Field 5</label>
                                            <input type="text" name="test5" placeholder="Test field 5" class="form-input">
                                        </div>
                                        <div class="form-group">
                                            <label>Test Field 6</label>
                                            <input type="text" name="test6" placeholder="Test field 6" class="form-input">
                                        </div>
                                        <div class="form-group">
                                            <label>Test Field 7</label>
                                            <input type="text" name="test7" placeholder="Test field 7" class="form-input">
                                        </div>
                                        <div class="form-group">
                                            <label>Test Field 8</label>
                                            <input type="text" name="test8" placeholder="Test field 8" class="form-input">
                                        </div>
                                        <div class="form-group">
                                            <label>Test Field 9</label>
                                            <input type="text" name="test9" placeholder="Test field 9" class="form-input">
                                        </div>
                                        <div class="form-group">
                                            <label>Test Field 10</label>
                                            <input type="text" name="test10" placeholder="Test field 10" class="form-input">
                                        </div>
                                    </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-action="close-add-event-modal">Cancel</button>
                        <button type="submit" form="add-event-form" class="btn btn-primary">
                            <i data-lucide="plus"></i> Add Event
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Get Event Detail Editor
     */
    getAddEventEditor(section) {
        // Determine the title based on the section
        const eventType = section === 'past_events' ? 'Past' : 'Upcoming';
        const title = `Add New ${eventType} Event`;
        
        const breadcrumb = this.getBreadcrumbHTML(section, title);
        
        return `
            ${breadcrumb}
            <div class="event-detail-editor">
                <div class="editor-header">
                    <h3>${title}</h3>
                </div>
                
                <div class="event-form">
                    <!-- Hero Section -->
                    <div class="form-section">
                        <h4>Hero Section</h4>
                            <div class="form-group">
                                <label>Event Title <span class="required">*</span></label>
                                <input type="text" id="event-title" value="" placeholder="Enter event title" class="form-input" required>
                            </div>
                            <div class="form-group">
                                <label>Event Category <span class="required">*</span></label>
                                <select id="event-category" class="form-input" required>
                                    <option value="">Select Category</option>
                                    ${EVENT_CATEGORIES.map(cat => 
                                        `<option value="${cat.value}">${cat.icon} ${cat.label}</option>`
                                    ).join('')}
                                </select>
                                <small class="form-help">Choose the most appropriate category for this event</small>
                            </div>
                            <div class="form-group">
                                <label>Hero Background Image</label>
                                <div id="hero-image-upload-container" class="image-upload-container">
                                    <input type="file" id="hero-image-upload" accept="image/*" style="display: none;">
                                    <input type="hidden" id="hero-image-url" value="">
                                    <button type="button" id="hero-image-select-btn" class="image-select-btn">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="image" class="lucide lucide-image"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><circle cx="9" cy="9" r="2"></circle><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path></svg>
                                        Select Image
                                    </button>
                                    <div id="hero-image-preview-container" class="image-preview-container" style="display: none;">
                                        <img id="hero-image-preview" src="" alt="Hero background preview" class="image-preview">
                                        <button type="button" id="hero-image-remove-btn" class="image-remove-btn">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="x" class="lucide lucide-x"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
                                    </button>
                                </div>
                            </div>
                                <small class="form-text">PNG, JPG, GIF up to 25MB</small>
                        </div>
                    </div>
                    
                    <!-- Event Summary -->
                    <div class="form-section">
                        <h4>Event Summary</h4>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Date <span class="required">*</span></label>
                                <input type="date" id="event-date" value="" class="form-input" required>
                            </div>
                            <div class="form-group">
                                <label>Time <span class="optional">(Optional)</span></label>
                                <input type="text" id="event-time" value="" placeholder="e.g., 10:00 AM - 4:00 PM" class="form-input">
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Venue <span class="optional">(Optional)</span></label>
                                <input type="text" id="event-venue" value="" placeholder="Event venue" class="form-input">
                            </div>
                            <div class="form-group">
                                <label>Organized by <span class="optional">(Optional)</span></label>
                                <input type="text" id="event-organizer" value="" placeholder="Event organizer" class="form-input">
                            </div>
                        </div>
                    </div>
                    
                    <!-- About Event -->
                    <div class="form-section">
                        <h4>About the Event</h4>
                        <div class="form-group">
                            <label>Event Description <span class="required">*</span></label>
                            <textarea id="event-description" rows="4" placeholder="Detailed event description..." class="form-textarea" required></textarea>
                        </div>
                    </div>
                    
                    <!-- Event Schedule -->
                    <div class="form-section">
                        <h4>Event Schedule</h4>
                        <div class="section-description">
                            <p>Add timeline items for your event schedule. Each item will appear in the event timeline.</p>
                        </div>
                        <div id="schedule-items" class="dynamic-items-container">
                            <div class="schedule-item" data-index="0" draggable="true">
                                <div class="item-header">
                                    <div class="item-header-content">
                                        <button type="button" class="btn-drag" title="Drag to reorder"><i data-lucide="grip-vertical"></i>
                                            </button>
                                        <span>Schedule Item 1</span>
                                    </div>
                                    <div class="item-actions">
                                        
                                        <button type="button" class="btn btn-sm btn-danger remove-schedule-item" title="Remove this schedule item">
                                            <i data-lucide="trash-2"></i>
                                        </button>
                                    </div>
                                </div>
                                <div class="form-row">
                                    <div class="form-group">
                                        <label>Time</label>
                                        <input type="text" name="schedule-time" value="10:00 AM" placeholder="e.g., 10:00 AM" class="form-input">
                                    </div>
                                    <div class="form-group">
                                        <label>Event Name</label>
                                        <input type="text" name="schedule-event" value="Opening Ceremony" placeholder="Event name" class="form-input">
                                    </div>
                                    <div class="form-group">
                                        <label>Icon</label>
                                        <select name="schedule-icon" class="form-input">
                                            <option value="celebration">🎉 Celebration</option>
                                            <option value="slideshow">📊 Slideshow</option>
                                            <option value="mic">🎤 Microphone</option>
                                            <option value="emoji_events">🏆 Trophy</option>
                                            <option value="schedule">⏰ Schedule</option>
                                            <option value="group">👥 Group</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="add-item-section">
                            <button type="button" class="btn btn-secondary add-schedule-item">
                                <i data-lucide="plus"></i> Add Schedule Item
                            </button>
                        </div>
                    </div>
                    
                    <!-- Guests & Performers -->
                    <div class="form-section">
                        <h4>Guests & Performers</h4>
                        <div class="section-description">
                            <p>Add guests, speakers, and performers for your event. Each guest will appear in the guests section.</p>
                        </div>
                        <div id="guests-items" class="dynamic-items-container">
                            <div class="guest-item" data-index="0" draggable="true">
                                <div class="item-header">
                                    <div class="item-header-content">
                                        <button type="button" class="btn-drag" title="Drag to reorder">
                                            <i data-lucide="grip-vertical"></i>
                                        </button>
                                        <h5>Guest 1</h5>
                                    </div>
                                    
                                    <div class="item-actions">
                                        
                                        <button type="button" class="btn btn-sm btn-danger remove-guest-item" title="Remove this guest">
                                            <i data-lucide="trash-2"></i>
                                        </button>
                                    </div>
                                </div>
                                <div class="form-row">
                                    <div class="form-group">
                                        <label>Guest Name</label>
                                        <input type="text" name="guest-name" value="Dr. Evelyn Reed" placeholder="Guest name" class="form-input">
                                    </div>
                                    <div class="form-group">
                                        <label>Role/Title</label>
                                        <input type="text" name="guest-role" value="Keynote Speaker" placeholder="e.g., Keynote Speaker, Judge, Performer" class="form-input">
                                    </div>
                                    <div class="form-group">
                                        <label>Avatar Image URL</label>
                                        <input type="url" name="guest-avatar" value="" placeholder="https://example.com/avatar.jpg" class="form-input">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="add-item-section">
                            <button type="button" class="btn btn-secondary add-guest-item">
                                <i data-lucide="plus"></i> Add Guest
                            </button>
                        </div>
                    </div>
                    
                    
                    
                    <!-- Location -->
                    <div class="form-section">
                        <h4>Location</h4>
                        <div class="form-group">
                            <label>Map Image URL</label>
                            <input type="url" id="location-map" value="" placeholder="Map image URL" class="form-input">
                        </div>
                    </div>
                    
                    <!-- Contact & Help Desk -->
                    <div class="form-section">
                        <h4>Contact & Help Desk</h4>
                        <div class="form-group">
                            <label>Contact Information</label>
                            <textarea id="contact-info" rows="3" placeholder="Contact information..." class="form-textarea">School office: 082-520986 | Email: info@marigoldebs.edu.np</textarea>
                        </div>
                    </div>
                </div>
                
                <div class="form-actions">
                    <div id="save-button-container">
                    <button type="button" class="btn btn-primary save-event-btn">
                        <i data-lucide="plus"></i> Create Event
                    </button>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Get Event Detail Editor (for editing existing events)
     */
    getEventDetailEditor(event, section) {
        const breadcrumb = this.getBreadcrumbHTML(section, event.title || 'Edit Event');
        
        return `
            ${breadcrumb}
            <div class="event-detail-editor">
                <div class="editor-header">
                    <h3>Edit Event</h3>
                </div>
                
                <div class="event-form">
                    <!-- Hero Section -->
                    <div class="form-section">
                        <h4>Hero Section</h4>
                            <div class="form-group">
                                <label>Event Title</label>
                                <input type="text" id="event-title" value="${event.title || ''}" placeholder="Enter event title" class="form-input">
                            </div>
                            <div class="form-group">
                                <label>Event Category</label>
                                <select id="event-category" class="form-input">
                                    <option value="">Select Category</option>
                                    ${EVENT_CATEGORIES.map(cat => 
                                        `<option value="${cat.value}" ${event.category === cat.value ? 'selected' : ''}>
                                            ${cat.icon} ${cat.label}
                                        </option>`
                                    ).join('')}
                                </select>
                                <small class="form-help">Choose the most appropriate category for this event</small>
                            </div>
                            <div class="form-group">
                                <label>Hero Background Image</label>
                                <div id="hero-image-upload-container" class="image-upload-container">
                                    <input type="file" id="hero-image-upload" accept="image/*" style="display: none;">
                                    <input type="hidden" id="hero-image-url" value="${event.imageUrl || ''}">
                                    <button type="button" id="hero-image-select-btn" class="image-select-btn">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="image" class="lucide lucide-image"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><circle cx="9" cy="9" r="2"></circle><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path></svg>
                                        Select Image
                                    </button>
                                    <div id="hero-image-preview-container" class="image-preview-container" ${event.imageUrl ? 'style="display: block;"' : 'style="display: none;"'}>
                                        <img id="hero-image-preview" src="${event.imageUrl || ''}" alt="Hero background preview" class="image-preview">
                                        <button type="button" id="hero-image-remove-btn" class="image-remove-btn">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="x" class="lucide lucide-x"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
                                        </button>
                                    </div>
                                </div>
                                <small class="form-text">PNG, JPG, GIF up to 25MB</small>
                            </div>
                    </div>
                    
                    <!-- Event Summary -->
                    <div class="form-section">
                        <h4>Event Summary</h4>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Date</label>
                                <input type="date" id="event-date" value="${event.eventDate ? new Date(event.eventDate).toISOString().split('T')[0] : ''}" class="form-input">
                            </div>
                            <div class="form-group">
                                <label>Time</label>
                                <input type="text" id="event-time" value="${event.time || ''}" placeholder="e.g., 10:00 AM - 4:00 PM" class="form-input">
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Venue</label>
                                <input type="text" id="event-venue" value="${event.location || ''}" placeholder="Event venue" class="form-input">
                            </div>
                            <div class="form-group">
                                <label>Organized by</label>
                                <input type="text" id="event-organizer" value="${event.organizer || ''}" placeholder="Event organizer" class="form-input">
                            </div>
                        </div>
                    </div>
                    
                    <!-- About Event -->
                    <div class="form-section">
                        <h4>About the Event</h4>
                        <div class="form-group">
                            <label>Event Description</label>
                            <textarea id="event-description" rows="4" placeholder="Detailed event description..." class="form-textarea">${event.content || ''}</textarea>
                        </div>
                    </div>
                    
                    <!-- Event Schedule -->
                    <div class="form-section">
                        <h4>Event Schedule</h4>
                        <div class="section-description">
                            <p>Add timeline items for your event schedule. Each item will appear in the event timeline.</p>
                        </div>
                        <div id="schedule-items" class="dynamic-items-container">
                            <div class="schedule-item" data-index="0" draggable="true">
                                <div class="item-header">
                                    <div class="item-header-content">
                                        <button type="button" class="btn-drag" title="Drag to reorder"><i data-lucide="grip-vertical"></i>
                                            </button>
                                        <span>Schedule Item 1</span>
                                    </div>
                                    <div class="item-actions">
                                        
                                        <button type="button" class="btn btn-sm btn-danger remove-schedule-item" title="Remove this schedule item">
                                            <i data-lucide="trash-2"></i>
                                        </button>
                                    </div>
                                </div>
                                <div class="form-row">
                                    <div class="form-group">
                                        <label>Time</label>
                                        <input type="text" name="schedule-time" value="10:00 AM" placeholder="e.g., 10:00 AM" class="form-input">
                                    </div>
                                    <div class="form-group">
                                        <label>Event Name</label>
                                        <input type="text" name="schedule-event" value="Opening Ceremony" placeholder="Event name" class="form-input">
                                    </div>
                                    <div class="form-group">
                                        <label>Icon</label>
                                        <select name="schedule-icon" class="form-input">
                                            <option value="celebration">🎉 Celebration</option>
                                            <option value="slideshow">📊 Slideshow</option>
                                            <option value="mic">🎤 Microphone</option>
                                            <option value="emoji_events">🏆 Trophy</option>
                                            <option value="schedule">⏰ Schedule</option>
                                            <option value="group">👥 Group</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="add-item-section">
                            <button type="button" class="btn btn-secondary add-schedule-item">
                                <i data-lucide="plus"></i> Add Schedule Item
                            </button>
                        </div>
                    </div>
                    
                    <!-- Guests & Performers -->
                    <div class="form-section">
                        <h4>Guests & Performers</h4>
                        <div class="section-description">
                            <p>Add guests, speakers, and performers for your event. Each guest will appear in the guests section.</p>
                        </div>
                        <div id="guests-items" class="dynamic-items-container">
                            <div class="guest-item" data-index="0" draggable="true">
                                <div class="item-header">
                                    <div class="item-header-content">
                                        <button type="button" class="btn-drag" title="Drag to reorder">
                                            <i data-lucide="grip-vertical"></i>
                                        </button>
                                        <h5>Guest 1</h5>
                                    </div>
                                    
                                    <div class="item-actions">
                                        
                                        <button type="button" class="btn btn-sm btn-danger remove-guest-item" title="Remove this guest">
                                            <i data-lucide="trash-2"></i>
                                        </button>
                                    </div>
                                </div>
                                <div class="form-row">
                                    <div class="form-group">
                                        <label>Guest Name</label>
                                        <input type="text" name="guest-name" value="Dr. Evelyn Reed" placeholder="Guest name" class="form-input">
                                    </div>
                                    <div class="form-group">
                                        <label>Role/Title</label>
                                        <input type="text" name="guest-role" value="Keynote Speaker" placeholder="e.g., Keynote Speaker, Judge, Performer" class="form-input">
                                    </div>
                                    <div class="form-group">
                                        <label>Avatar Image URL</label>
                                        <input type="url" name="guest-avatar" value="" placeholder="https://example.com/avatar.jpg" class="form-input">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="add-item-section">
                            <button type="button" class="btn btn-secondary add-guest-item">
                                <i data-lucide="plus"></i> Add Guest
                            </button>
                        </div>
                    </div>
                    
                    
                    
                    <!-- Location -->
                    <div class="form-section">
                        <h4>Location</h4>
                        <div class="form-group">
                            <label>Map Image URL</label>
                            <input type="url" id="location-map" value="${event.locationMap || ''}" placeholder="Map image URL" class="form-input">
                        </div>
                    </div>
                    
                    <!-- Contact & Help Desk -->
                    <div class="form-section">
                        <h4>Contact & Help Desk</h4>
                        <div class="form-group">
                            <label>Contact Information</label>
                            <textarea id="contact-info" rows="3" placeholder="Contact information..." class="form-textarea">${event.contactInfo || 'For any inquiries or assistance, please contact the Science Department at science@academy.edu or call us at (555) 123-4567. Our help desk is available Monday to Friday, 9:00 AM to 5:00 PM.'}</textarea>
                        </div>
                    </div>
                </div>
                
                <div class="form-actions">
                    <div id="save-button-container"></div>
                </div>
            </div>
        `;
    }

    /**
     * Get Notice Detail Editor (for editing existing notices)
     */
    getNoticeDetailEditor(notice) {
        const breadcrumb = this.getBreadcrumbHTML('notices', notice.title || 'Edit Notice');
        
        // Parse highlights from metadata or content
        const highlights = this.parseNoticeHighlights(notice);
        
        // Parse metadata for validUntil
        let validUntil = '';
        if (notice.metadata) {
            try {
                const metadata = typeof notice.metadata === 'string' ? JSON.parse(notice.metadata) : notice.metadata;
                validUntil = metadata.validUntil || '';
            } catch (e) {
                console.error('Error parsing notice metadata:', e);
            }
        }
        
        return `
            ${breadcrumb}
            <div class="notice-detail-editor">
                <div class="editor-header">
                    <h3>Edit Notice</h3>
                    <p class="editor-subtitle">Update notice information</p>
                </div>
                
                <form class="notice-form" id="edit-notice-form">
                    <!-- Notice Header Section -->
                    <div class="form-section">
                        <h4>Notice Header</h4>
                        
                        <div class="form-group">
                            <label><span class="required">*</span> Notice Title</label>
                            <input type="text" id="notice-title" value="${notice.title || ''}" placeholder="Enter notice title" class="form-input" required>
                            <small class="form-help">This will be displayed as the main heading on the notice details page</small>
                        </div>
                        
                        <div class="form-row">
                        <div class="form-group">
                                <label><span class="required">*</span> Category</label>
                                <select id="notice-category" class="form-input" required>
                                    <option value="">Select Category</option>
                                    ${NOTICE_CATEGORIES.map(cat => 
                                        `<option value="${cat.value}" ${notice.category === cat.value ? 'selected' : ''}>
                                            ${cat.icon} ${cat.label}
                                        </option>`
                                    ).join('')}
                                </select>
                                <small class="form-help">Choose the most appropriate category for this notice</small>
                            </div>
                            
                            <div class="form-group">
                                <label>Author Name</label>
                                <input type="text" id="notice-author" value="${notice.organizer || notice.author || ''}" placeholder="e.g., Principal, Administration" class="form-input">
                                <small class="form-help">Leave empty to use default</small>
                        </div>
                        </div>
                        
                        <div class="form-group">
                            <label>Header Image <span class="optional">(Optional)</span></label>
                            <div id="notice-image-upload-container">
                                <!-- ImageUpload component will be inserted here -->
                                </div>
                            <small class="form-help">Upload an image for the notice header (recommended: 1200x600px)</small>
                        </div>
                        
                        <div class="form-group">
                            <label>PDF Documents <span class="optional">(Optional)</span></label>
                            <div class="pdf-upload-container">
                                <div class="pdf-upload-list" id="edit-notice-pdf-list">
                                    <!-- PDF files will be added here -->
                                </div>
                                <div class="pdf-upload-controls">
                                    <input type="file" id="edit-notice-pdf-upload" accept=".pdf" multiple style="display: none;">
                                    <button type="button" class="btn btn-secondary pdf-upload-btn" data-target="edit-notice-pdf-upload">
                                        <i data-lucide="file-text"></i> Add PDF Documents
                                    </button>
                                    <small class="form-help">Upload PDF documents related to this notice (max 10MB each)</small>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Notice Content Section -->
                    <div class="form-section">
                        <h4>Notice Content</h4>
                        
                        <div class="form-group full-width">
                            <label><span class="required">*</span> Notice Description</label>
                            <textarea id="notice-content" rows="6" placeholder="Enter the full notice description..." class="form-textarea" required>${notice.description || notice.content || ''}</textarea>
                            <small class="form-help">Provide complete details about the notice</small>
                        </div>
                    </div>
                    
                    <!-- Notice Highlights (Optional) -->
                    <div class="form-section">
                        <div class="section-header-with-btn">
                            <div>
                                <h4>Notice Highlights <span class="optional">(Optional)</span></h4>
                                <small class="form-help">Add key points or important highlights</small>
                        </div>
                            <button type="button" class="btn btn-sm btn-secondary" id="add-highlight-btn">
                                <i data-lucide="plus"></i> Add Highlight
                            </button>
                        </div>
                        
                        <div id="highlights-container" class="highlights-list">
                            ${highlights.map((highlight, index) => `
                                <div class="highlight-input-group" data-index="${index}">
                                    <input type="text" value="${highlight}" placeholder="Enter highlight point..." class="form-input highlight-input">
                                    <button type="button" class="btn btn-sm btn-danger remove-highlight-btn" data-index="${index}">
                                        <i data-lucide="trash-2"></i>
                                    </button>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <!-- Meta Information -->
                    <div class="form-section">
                        <h4>Additional Information</h4>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label>Publish Date</label>
                                <input type="date" id="notice-date" value="${notice.date ? new Date(notice.date).toISOString().split('T')[0] : notice.eventDate ? new Date(notice.eventDate).toISOString().split('T')[0] : ''}" class="form-input">
                                <small class="form-help">Leave empty to use today's date</small>
                            </div>
                            
                            <div class="form-group">
                                <label>Valid Until</label>
                                <input type="date" id="notice-valid-until" value="${validUntil}" class="form-input">
                                <small class="form-help">Optional expiry date</small>
                            </div>
                        </div>
                        
                </div>
                
                <div class="form-actions">
                        <button type="button" class="btn btn-secondary back-button" data-action="back-to-section-list">
                            <i data-lucide="arrow-left"></i>
                            Back
                    </button>
                        <div id="notice-save-button-container">
                            <!-- SaveButton will be initialized here -->
                </div>
                    </div>
                </form>
            </div>
        `;
    }

    /**
     * Parse notice highlights from metadata or content
     */
    parseNoticeHighlights(notice) {
        try {
            // Try to get highlights from metadata
            if (notice.metadata) {
                const metadata = typeof notice.metadata === 'string' ? JSON.parse(notice.metadata) : notice.metadata;
                if (metadata.highlights && Array.isArray(metadata.highlights)) {
                    return metadata.highlights;
                }
            }
            
            // Try to get from eventSchedule
            if (notice.eventSchedule) {
                const schedule = typeof notice.eventSchedule === 'string' ? JSON.parse(notice.eventSchedule) : notice.eventSchedule;
                if (Array.isArray(schedule)) {
                    return schedule;
                }
            }
            
            return [];
        } catch (error) {
            console.error('Error parsing highlights:', error);
            return [];
        }
    }

    /**
     * Get Notices Editor with enhanced UI
     */
    getNoticesEditor() {
        return `
            <div class="events-list-view">
                <div class="list-header">
                    <div class="header-content">
                            <h3>School Notices</h3>
                        <p class="header-subtitle">Click on a notice to edit its details</p>
                        </div>
                    <div class="header-actions">
                        <button type="button" class="btn btn-primary add-notice-btn">
                            <i data-lucide="plus"></i> Add Notice
                        </button>
                        </div>
                    </div>
                    
                <div class="search-bar">
                    <input type="text" id="notices-search" placeholder="Search notices..." class="search-input">
                </div>
                
                <div id="notices-list" class="events-list-container">
                    <!-- Notices will be populated here -->
                </div>
                
                <div id="notices-empty-state" class="empty-state" style="display: none;">
                    <div class="empty-icon">
                        <i data-lucide="file-text"></i>
                    </div>
                    <h4>No notices yet</h4>
                    <p>Add your first notice to get started</p>
                    <button type="button" class="btn btn-primary add-notice-btn">
                        <i data-lucide="plus"></i> Add Notice
                            </button>
                        </div>
                    </div>
                    
            <!-- Add Notice Modal -->
            <div id="add-notice-modal" class="modal-overlay" style="display: none;">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Add New Notice</h3>
                        <button type="button" class="modal-close" data-action="close-add-notice-modal">
                            <i data-lucide="x"></i>
                                </button>
                    </div>
                    <div class="modal-body" style="height: 400px; overflow-y: scroll;">
                        <form id="add-notice-form">
                            <!-- Notice Header Section -->
                            <div class="form-section">
                                <h4>Notice Header</h4>
                                <div class="form-group">
                                    <label>Notice Title</label>
                                    <input type="text" name="title" placeholder="Enter notice title" class="form-input" required>
                                </div>
                                <div class="form-group">
                                    <label>Notice Category <span class="required">*</span></label>
                                    <select name="category" class="form-input" required>
                                        <option value="">Select Category</option>
                                        ${NOTICE_CATEGORIES.map(cat => 
                                            `<option value="${cat.value}">${cat.icon} ${cat.label}</option>`
                                        ).join('')}
                                    </select>
                                    <small class="form-help">Choose the most appropriate category for this notice</small>
                                </div>
                                <div class="form-group">
                                    <label>Notice Header Image</label>
                                    <div class="image-upload-container">
                                        <div class="image-upload-preview">
                                            <div class="image-upload-placeholder">
                                                <i data-lucide="image"></i>
                                                <span>No image selected</span>
                                            </div>
                                        </div>
                                        <div class="image-input-group">
                                            <input type="file" name="notice-image-upload" accept="image/*" style="display: none;">
                                            <input type="text" name="notice-image-url" placeholder="Image URL" class="form-input" style="margin-bottom: 10px;">
                                            <button type="button" class="btn btn-secondary image-upload-btn">
                                                <i data-lucide="upload"></i> Select Image
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label>PDF Documents <span class="optional">(Optional)</span></label>
                        <div class="pdf-upload-container">
                            <div class="pdf-upload-list" id="add-notice-pdf-list">
                                <!-- PDF files will be added here -->
                            </div>
                            <div class="pdf-upload-controls">
                                <input type="file" id="add-notice-pdf-upload" accept=".pdf" multiple style="display: none;">
                                <button type="button" class="btn btn-secondary pdf-upload-btn" data-target="add-notice-pdf-upload">
                                    <i data-lucide="file-text"></i> Add PDF Documents
                                </button>
                                <small class="form-help">Upload PDF documents related to this notice (max 10MB each)</small>
                            </div>
                        </div>
                    </div>
                    </div>
                    
                            <!-- Notice Details -->
                            <div class="form-section">
                                <h4>Notice Details</h4>
                                <div class="form-group">
                                    <label>Notice Description</label>
                                    <textarea name="description" rows="4" placeholder="Detailed notice description..." class="form-textarea"></textarea>
                        </div>
                                <div class="form-row">
                                    <div class="form-group">
                                        <label>Publish Date</label>
                                        <input type="date" name="date" class="form-input" required>
                                    </div>
                                    <div class="form-group">
                                        <label>Priority Level</label>
                                        <select name="priority" class="form-input">
                                            <option value="normal">Normal</option>
                                            <option value="high">High</option>
                                            <option value="urgent">Urgent</option>
                                            <option value="critical">Critical</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="form-row">
                                    <div class="form-group">
                                        <label>Target Audience</label>
                                        <select name="audience" class="form-input">
                                            <option value="all">All Students & Parents</option>
                                            <option value="students">Students Only</option>
                                            <option value="parents">Parents Only</option>
                                            <option value="staff">Staff Only</option>
                                            <option value="specific">Specific Grade/Class</option>
                                        </select>
                                    </div>
                                    <div class="form-group">
                                        <label>Valid Until</label>
                                        <input type="date" name="validUntil" class="form-input">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label>Additional Information</label>
                                    <textarea name="additionalInfo" rows="3" placeholder="Any additional information or instructions..." class="form-textarea"></textarea>
                    </div>
                </div>
            </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-action="close-add-notice-modal">Cancel</button>
                        <button type="submit" form="add-notice-form" class="btn btn-primary">
                            <i data-lucide="plus"></i> Add Notice
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Get Highlights Editor
     */
    getHighlightsEditor() {
        return `
            <form class="section-editor-form">
                <div class="editor-section">
                    <div class="section-header">
                        <h3>Highlights</h3>
                        <p class="section-description">Configure the main highlight section that appears on the events page.</p>
                    </div>
                    
                    <div class="form-grid">
                        <div class="form-group full-width">
                            <label for="highlight-event">Select Event to Auto-Populate</label>
                            <select id="highlight-event" class="form-input">
                                <option value="">Select an event to auto-fill the form...</option>
                                <!-- Event options will be populated dynamically -->
                            </select>
                            <small class="form-help">Choose an event to automatically populate the form fields below</small>
                        </div>
                        
                        <div class="form-group">
                            <label for="highlight-badge">Badge Text</label>
                            <input type="text" id="highlight-badge" placeholder="e.g., Announcement, News, Update" class="form-input">
                        </div>
                        
                        <div class="form-group">
                            <label for="highlight-title">Title</label>
                            <input type="text" id="highlight-title" placeholder="Highlight title" class="form-input">
                        </div>
                        
                        <div class="form-group full-width">
                            <label for="highlight-description">Description</label>
                            <textarea id="highlight-description" rows="3" placeholder="Highlight description..." class="form-textarea"></textarea>
                        </div>
                        
                        <div class="form-group full-width">
                            <label>Event Image Preview</label>
                            <div id="highlight-image-preview" class="image-preview-container" style="display: none;">
                                <img id="highlight-preview-image" src="" alt="Event image preview" class="image-preview">
                            </div>
                            <div id="highlight-no-image" class="no-image-placeholder" style="display: block;">
                                <div class="no-image-content">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="image" class="lucide lucide-image"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><circle cx="9" cy="9" r="2"></circle><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path></svg>
                                    <p>Select an event to see its image</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-actions">
                        <div id="save-button-container">
                            <!-- SaveButton component will be inserted here -->
                        </div>
                    </div>
                </div>
            </form>
        `;
    }

    /**
     * Populate highlights editor with data
     */
    populateHighlightsEditor(data) {
        
        // Store current section data for highlights
        this.currentSectionData = { highlights: data };
        
        // Find highlight data
        const highlightData = data.find(item => item.key === 'main_highlight') || {};
        
        // Populate form fields
        const badgeInput = document.getElementById('highlight-badge');
        const titleInput = document.getElementById('highlight-title');
        const descriptionInput = document.getElementById('highlight-description');
        const eventSelect = document.getElementById('highlight-event');
        
        if (badgeInput) badgeInput.value = highlightData.description || '';
        if (titleInput) titleInput.value = highlightData.title || '';
        if (descriptionInput) descriptionInput.value = highlightData.content || '';
        
        // Parse metadata to get event ID
        let eventId = '';
        if (highlightData.metadata) {
            try {
                const metadata = JSON.parse(highlightData.metadata);
                eventId = metadata.eventId || '';
            } catch (error) {
                console.error('Error parsing highlights metadata:', error);
            }
        }
        
        if (eventSelect) {
            
            // If we have an event ID, set it after events are loaded
            if (eventId) {
                // Wait for events to be loaded before setting value and auto-filling
                setTimeout(() => {
                    eventSelect.value = eventId;
                    this.autoFillHighlightForm(eventId);
                }, 200); // Increased timeout to ensure events are loaded
            } else {
                eventSelect.value = '';
            }
        }
    }




    /**
     * Clear highlight form
     */
    clearHighlightForm() {
        const badgeInput = document.getElementById('highlight-badge');
        const titleInput = document.getElementById('highlight-title');
        const descriptionInput = document.getElementById('highlight-description');
        const eventSelect = document.getElementById('highlight-event');
        
        if (badgeInput) badgeInput.value = '';
        if (titleInput) titleInput.value = '';
        if (descriptionInput) descriptionInput.value = '';
        if (eventSelect) eventSelect.value = '';
        
        this.showNotification('info', 'Highlight form cleared');
    }


    /**
     * Show notification with improved styling and functionality
     */
    showNotification(type, message, duration = 3000) {
        // Create notification element with enhanced styling
        const notification = document.createElement('div');
        notification.className = `notification notification-${type} notification-enhanced`;
        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-icon">
                    <i data-lucide="${type === 'success' ? 'check-circle' : type === 'error' ? 'x-circle' : 'info'}"></i>
            </div>
                <div class="notification-text">
                    <span class="notification-message">${message}</span>
                </div>
                <button class="notification-close" data-action="close-notification">
                    <i data-lucide="x"></i>
                </button>
            </div>
            <div class="notification-progress"></div>
        `;

        // Add enhanced styles
        const style = document.createElement('style');
        style.textContent = `
            .notification-enhanced {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                min-width: 300px;
                max-width: 400px;
                background: white;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                border-left: 4px solid ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
                transform: translateX(100%);
                transition: all 0.3s ease;
                overflow: hidden;
            }
            .notification-enhanced.show {
                transform: translateX(0);
            }
            .notification-content {
                display: flex;
                align-items: center;
                padding: 16px;
                gap: 12px;
            }
            .notification-icon {
                flex-shrink: 0;
                color: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            }
            .notification-text {
                flex: 1;
            }
            .notification-message {
                font-weight: 500;
                color: #374151;
            }
            .notification-close {
                background: none;
                border: none;
                color: #6b7280;
                cursor: pointer;
                padding: 4px;
                border-radius: 4px;
                transition: all 0.2s ease;
            }
            .notification-close:hover {
                background: #f3f4f6;
                color: #374151;
            }
            .notification-progress {
                height: 3px;
                background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
                width: 100%;
                animation: notificationProgress ${duration}ms linear;
            }
            @keyframes notificationProgress {
                from { width: 100%; }
                to { width: 0%; }
            }
            
            /* Enhanced Events & Notices Styles */
            .section-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 24px;
                padding-bottom: 16px;
                border-bottom: 1px solid #e5e7eb;
            }
            
            .section-title h3 {
                margin: 0 0 4px 0;
                font-size: 1.5rem;
                font-weight: 600;
                color: #111827;
            }
            
            .section-description {
                margin: 0;
                color: #6b7280;
                font-size: 0.875rem;
            }
            
            .section-actions {
                display: flex;
                gap: 12px;
                align-items: center;
            }
            
            .search-filter-bar {
                display: flex;
                gap: 16px;
                margin-bottom: 24px;
                padding: 16px;
                background: #f9fafb;
                border-radius: 8px;
                border: 1px solid #e5e7eb;
            }
            
            .search-box {
                position: relative;
                flex: 1;
                max-width: 300px;
            }
            
            .search-box i {
                position: absolute;
                left: 12px;
                top: 50%;
                transform: translateY(-50%);
                color: #6b7280;
                width: 16px;
                height: 16px;
            }
            
            .search-box input {
                width: 100%;
                padding: 8px 12px 8px 36px;
                border: 1px solid #d1d5db;
                border-radius: 6px;
                font-size: 0.875rem;
            }
            
            .filter-controls {
                display: flex;
                gap: 8px;
                align-items: center;
            }
            
            .filter-controls select {
                padding: 8px 12px;
                border: 1px solid #d1d5db;
                border-radius: 6px;
                font-size: 0.875rem;
                background: white;
            }
            
            .bulk-actions-panel {
                background: #fef3c7;
                border: 1px solid #f59e0b;
                border-radius: 8px;
                padding: 16px;
                margin-bottom: 24px;
            }
            
            .bulk-actions-content {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .bulk-actions-buttons {
                display: flex;
                gap: 8px;
            }
            
            .enhanced-event-item, .enhanced-notice-item {
                background: white;
                border: 1px solid #e5e7eb;
                border-radius: 12px;
                margin-bottom: 16px;
                overflow: hidden;
                transition: all 0.2s ease;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            }
            
            .enhanced-event-item:hover, .enhanced-notice-item:hover {
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                border-color: #3b82f6;
            }
            
            .enhanced-event-item.dragging {
                opacity: 0.5;
                transform: rotate(5deg);
            }
            
            .event-item-header, .notice-item-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 16px;
                background: #f9fafb;
                border-bottom: 1px solid #e5e7eb;
            }
            
            .event-item-controls, .notice-item-controls {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            
            .checkbox-container {
                position: relative;
                cursor: pointer;
            }
            
            .checkbox-container input {
                opacity: 0;
                position: absolute;
            }
            
            .checkmark {
                width: 18px;
                height: 18px;
                border: 2px solid #d1d5db;
                border-radius: 4px;
                display: inline-block;
                position: relative;
                transition: all 0.2s ease;
            }
            
            .checkbox-container input:checked + .checkmark {
                background: #3b82f6;
                border-color: #3b82f6;
            }
            
            .checkbox-container input:checked + .checkmark::after {
                content: '';
                position: absolute;
                left: 5px;
                top: 2px;
                width: 4px;
                height: 8px;
                border: solid white;
                border-width: 0 2px 2px 0;
                transform: rotate(45deg);
            }
            
            .drag-handle {
                cursor: grab;
                color: #6b7280;
                padding: 4px;
                border-radius: 4px;
                transition: all 0.2s ease;
            }
            
            .drag-handle:hover {
                background: #e5e7eb;
                color: #374151;
            }
            
            .status-badge {
                display: inline-flex;
                align-items: center;
                gap: 4px;
                padding: 4px 8px;
                border-radius: 6px;
                font-size: 0.75rem;
                font-weight: 500;
            }
            
            .status-badge.active {
                background: #dcfce7;
                color: #166534;
            }
            
            .status-badge.inactive {
                background: #fee2e2;
                color: #991b1b;
            }
            
            .event-item-content, .notice-item-content {
                padding: 20px;
            }
            
            .form-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 16px;
            }
            
            .form-group.full-width {
                grid-column: 1 / -1;
            }
            
            .form-group label {
                display: block;
                margin-bottom: 6px;
                font-weight: 500;
                color: #374151;
                font-size: 0.875rem;
            }
            
            .form-group input, .form-group select, .form-group textarea {
                width: 100%;
                padding: 8px 12px;
                border: 1px solid #d1d5db;
                border-radius: 6px;
                font-size: 0.875rem;
                transition: border-color 0.2s ease;
            }
            
            .form-group input:focus, .form-group select:focus, .form-group textarea:focus {
                outline: none;
                border-color: #3b82f6;
                box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
            }
            
            .image-input-group {
                display: flex;
                gap: 8px;
            }
            
            .image-input-group input {
                flex: 1;
            }
            
            .icon-selector {
                display: flex;
                gap: 8px;
                align-items: center;
            }
            
            .icon-preview {
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: #f3f4f6;
                border-radius: 6px;
                color: #6b7280;
            }
            
            .event-item-actions, .notice-item-actions {
                display: flex;
                gap: 8px;
                padding: 16px;
                background: #f9fafb;
                border-top: 1px solid #e5e7eb;
            }
            
            .empty-state {
                text-align: center;
                padding: 48px 24px;
                color: #6b7280;
            }
            
            .empty-state-icon {
                width: 64px;
                height: 64px;
                margin: 0 auto 16px;
                background: #f3f4f6;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #9ca3af;
            }
            
            .empty-state h3 {
                margin: 0 0 8px 0;
                font-size: 1.25rem;
                font-weight: 600;
                color: #374151;
            }
            
            .empty-state p {
                margin: 0 0 24px 0;
                font-size: 0.875rem;
            }
            
            .sort-dropdown {
                background: white;
                border: 1px solid #d1d5db;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                overflow: hidden;
            }
            
            .sort-option {
                padding: 12px 16px;
                cursor: pointer;
                transition: background-color 0.2s ease;
                font-size: 0.875rem;
            }
            
            .sort-option:hover {
                background: #f3f4f6;
            }
            
            .preview-modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
            }
            
            .preview-modal {
                background: white;
                border-radius: 12px;
                max-width: 500px;
                width: 90%;
                max-height: 80vh;
                overflow: hidden;
                box-shadow: 0 20px 25px rgba(0, 0, 0, 0.1);
            }
            
            .preview-modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px;
                border-bottom: 1px solid #e5e7eb;
            }
            
            .preview-modal-header h3 {
                margin: 0;
                font-size: 1.25rem;
                font-weight: 600;
            }
            
            .preview-close {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: #6b7280;
                padding: 4px;
                border-radius: 4px;
                transition: all 0.2s ease;
            }
            
            .preview-close:hover {
                background: #f3f4f6;
                color: #374151;
            }
            
            .preview-modal-body {
                padding: 20px;
            }
            
            .preview-content h4 {
                margin: 0 0 12px 0;
                font-size: 1.125rem;
                font-weight: 600;
                color: #111827;
            }
            
            .preview-category, .preview-date {
                display: inline-block;
                padding: 4px 8px;
                background: #e5e7eb;
                color: #374151;
                border-radius: 4px;
                font-size: 0.75rem;
                font-weight: 500;
                margin-right: 8px;
                margin-bottom: 8px;
            }
            
            .preview-content p {
                margin: 12px 0 0 0;
                color: #6b7280;
                line-height: 1.5;
            }
            
            /* Simple Breadcrumb Styling - Matching Homepage */
            .simple-breadcrumb {
                display: flex;
                align-items: center;
                gap: 16px;
                padding: 16px 0;
                margin-bottom: 24px;
                border-bottom: 1px solid #e5e7eb;
            }
            
            .back-button {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 40px;
                height: 40px;
                background: #f3f4f6;
                border: 1px solid #d1d5db;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.2s ease;
                color: #6b7280;
            }
            
            .back-button:hover {
                background: #e5e7eb;
                border-color: #9ca3af;
                color: #374151;
            }
            
            .breadcrumb-path {
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 0.875rem;
                color: #6b7280;
            }
            
            .breadcrumb-path span {
                color: #374151;
                font-weight: 500;
            }
            
            .breadcrumb-path i {
                width: 16px;
                height: 16px;
                color: #9ca3af;
            }
            
            /* Section Menu Styling */
            .sections-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 20px;
                margin-top: 24px;
            }
            
            .section-menu-item {
                background: white;
                border: 1px solid #e5e7eb;
                border-radius: 12px;
                padding: 20px;
                transition: all 0.2s ease;
                cursor: pointer;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            }
            
            .section-menu-item:hover {
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                border-color: #3b82f6;
                transform: translateY(-2px);
            }
            
            .section-header {
                display: flex;
                align-items: center;
                gap: 16px;
            }
            
            .section-icon {
                width: 48px;
                height: 48px;
                background: #f3f4f6;
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
                color: #6b7280;
                flex-shrink: 0;
            }
            
            .section-info {
                flex: 1;
                min-width: 0;
            }
            
            .section-title {
                font-size: 1.125rem;
                font-weight: 600;
                color: #111827;
                margin: 0 0 4px 0;
            }
            
            .section-subtitle {
                font-size: 0.875rem;
                color: #6b7280;
                margin: 0;
            }
            
            .section-toggle {
                flex-shrink: 0;
            }
            
            .toggle-switch {
                position: relative;
                display: inline-block;
                width: 44px;
                height: 24px;
                cursor: pointer;
            }
            
            .toggle-switch input {
                opacity: 0;
                width: 0;
                height: 0;
            }
            
            .toggle-slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: #d1d5db;
                transition: 0.3s;
                border-radius: 24px;
            }
            
            .toggle-slider:before {
                position: absolute;
                content: "";
                height: 18px;
                width: 18px;
                left: 3px;
                bottom: 3px;
                background-color: white;
                transition: 0.3s;
                border-radius: 50%;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            }
            
            .toggle-switch input:checked + .toggle-slider {
                background-color: #3b82f6;
            }
            
            .toggle-switch input:checked + .toggle-slider:before {
                transform: translateX(20px);
            }
            
            .toggle-switch:hover .toggle-slider {
                box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
            }
            
            /* Modern Interactive Form Styles */
            .section-description {
                margin-bottom: 1.5rem;
                padding: 1rem;
                background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
                border-radius: 12px;
                border-left: 4px solid #3b82f6;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            }
            
            .section-description p {
                margin: 0;
                color: #64748b;
                font-size: 0.875rem;
                line-height: 1.5;
            }
            
            .dynamic-items-container {
                margin-bottom: 1.5rem;
                display: flex;
                flex-direction: column;
                gap: 1rem;
            }
            
            .schedule-item, .guest-item {
                background: #ffffff;
                border: 1px solid #e2e8f0;
                border-radius: 16px;
                padding: 1.5rem;
                margin-bottom: 0;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                position: relative;
                overflow: hidden;
            }
            
            .schedule-item::before, .guest-item::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 3px;
                background: linear-gradient(90deg, #3b82f6, #8b5cf6);
                transform: scaleX(0);
                transition: transform 0.3s ease;
            }
            
            .schedule-item:hover, .guest-item:hover {
                border-color: #3b82f6;
                box-shadow: 0 10px 25px rgba(59, 130, 246, 0.15);
                transform: translateY(-2px);
            }
            
            .schedule-item:hover::before, .guest-item:hover::before {
                transform: scaleX(1);
            }
            
            .item-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 1rem;
                margin-bottom: 1.5rem;
                padding-bottom: 1rem;
                border-bottom: 1px solid #f1f5f9;
                position: relative;
            }
            
            .item-header-content {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                flex: 1;
            }
            
            .item-header-content span,
            .item-header-content h5 {
                margin: 0;
                font-size: 1.125rem;
                font-weight: 700;
                color: #1e293b;
                letter-spacing: -0.025em;
            }
            
            .item-actions {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            
            .btn-drag {
                background: #f8fafc;
                border: 1px solid #e2e8f0;
                border-radius: 6px;
                padding: 0.5rem;
                cursor: grab;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #64748b;
            }
            
            .btn-drag:hover {
                background: #f1f5f9;
                border-color: #cbd5e1;
                color: #475569;
                transform: scale(1.05);
            }
            
            .btn-drag:active {
                cursor: grabbing;
                transform: scale(0.95);
            }
            
            .btn-drag i {
                width: 16px;
                height: 16px;
            }
            
            .add-item-section {
                display: flex;
                align-items: center;
                gap: 1rem;
                padding: 1.5rem;
                background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
                border: 2px dashed #cbd5e1;
                border-radius: 16px;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                cursor: pointer;
                position: relative;
                overflow: hidden;
            }
            
            .add-item-section::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.1), transparent);
                transition: left 0.5s ease;
            }
            
            .add-item-section:hover {
                border-color: #3b82f6;
                background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
                transform: translateY(-1px);
                box-shadow: 0 8px 25px rgba(59, 130, 246, 0.15);
            }
            
            .add-item-section:hover::before {
                left: 100%;
            }
            
            .add-item-hint {
                color: #64748b;
                font-size: 0.875rem;
                font-weight: 500;
            }
            
            .btn-sm {
                padding: 0.5rem 0.75rem;
                font-size: 0.75rem;
                border-radius: 8px;
                font-weight: 600;
                transition: all 0.2s ease;
            }
            
            .btn-danger {
                background: linear-gradient(135deg, #ef4444, #dc2626);
                color: white;
                border: none;
                border-radius: 8px;
                padding: 0.5rem 0.75rem;
                cursor: pointer;
                transition: all 0.2s ease;
                box-shadow: 0 2px 4px rgba(239, 68, 68, 0.2);
            }
            
            .btn-danger:hover {
                background: linear-gradient(135deg, #dc2626, #b91c1c);
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
            }
            
            .btn-secondary {
                background: linear-gradient(135deg, #3b82f6, #1d4ed8);
                color: white;
                border: none;
                border-radius: 10px;
                padding: 0.75rem 1.5rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            
            .btn-secondary:hover {
                background: linear-gradient(135deg, #1d4ed8, #1e40af);
                transform: translateY(-2px);
                box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
            }
            
            .form-row {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 1rem;
                margin-bottom: 1rem;
            }
            
            .form-group {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
            }
            
            .form-group label {
                font-weight: 600;
                color: #374151;
                font-size: 0.875rem;
                margin-bottom: 0.25rem;
            }
            
            .form-input, .form-textarea {
                padding: 0.75rem 1rem;
                border: 2px solid #e5e7eb;
                border-radius: 8px;
                font-size: 0.875rem;
                transition: all 0.2s ease;
                background: #ffffff;
            }
            
            .form-input:focus, .form-textarea:focus {
                outline: none;
                border-color: #3b82f6;
                box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
                transform: translateY(-1px);
            }
            
            .form-textarea {
                resize: vertical;
                min-height: 80px;
            }
            
            /* Animation for new items */
            .schedule-item, .guest-item {
                animation: slideInUp 0.3s ease-out;
            }
            
            @keyframes slideInUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            /* Drag and drop visual feedback */
            .schedule-item.dragging, .guest-item.dragging {
                opacity: 0.7;
                transform: rotate(2deg) scale(1.02);
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
                z-index: 1000;
                border-color: #3b82f6;
            }
            
            .schedule-item.drag-over, .guest-item.drag-over {
                border-color: #10b981;
                background: #f0fdf4;
                transform: scale(1.02);
            }
            
            /* Drag handle specific styles */
            .btn-drag {
                user-select: none;
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
            }
            
            .btn-drag:focus {
                outline: 2px solid #3b82f6;
                outline-offset: 2px;
            }
            
            /* Disable text selection on drag handles */
            .item-actions {
                user-select: none;
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
            }
            
            /* Category Selector Styles */
            .category-selector {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            
            .category-selector select {
                flex: 1;
            }
            
            .add-category-btn {
                padding: 0.5rem;
                min-width: auto;
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .add-category-form {
                background: #f8fafc;
                border: 1px solid #e2e8f0;
                border-radius: 8px;
                padding: 1rem;
                animation: slideDown 0.3s ease-out;
            }
            
            @keyframes slideDown {
                from {
                    opacity: 0;
                    transform: translateY(-10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .add-category-form .form-row {
                margin-bottom: 0;
            }
            
            .add-category-form .form-group:last-child {
                display: flex;
                gap: 0.5rem;
                align-items: center;
            }
            
            .add-category-form .btn {
                padding: 0.5rem 1rem;
                font-size: 0.875rem;
            }
            
            /* Add Event Modal Styles */
            .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
                backdrop-filter: blur(4px);
                overflow: hidden;
            }
            
            /* Prevent body scroll when modal is open */
            body.modal-open {
                overflow: hidden;
                position: fixed;
                width: 100%;
            }
            
            #add-event-modal .modal-content {
                background: white !important;
                border-radius: 12px !important;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15) !important;
                max-width: 1200px !important;
                width: 95% !important;
                height: 95vh !important;
                max-height: 95vh !important;
                animation: modalSlideIn 0.3s ease-out !important;
                display: flex !important;
                flex-direction: column !important;
            }
            
            #add-event-modal .modal-header {
                flex-shrink: 0 !important;
                padding: 20px !important;
                border-bottom: 1px solid #e5e7eb !important;
                background: #f9fafb !important;
                display: flex !important;
                justify-content: space-between !important;
                align-items: center !important;
            }
            
            #add-event-modal .modal-content .modal-body {
                height: 400px !important;
                overflow-y: scroll !important;
                overflow-x: hidden !important;
                padding: 20px !important;
                border: 3px solid red !important; /* Temporary debug border */
                background: #f0f0f0 !important; /* Temporary debug background */
            }
            
            #add-event-modal .modal-footer {
                flex-shrink: 0 !important;
                padding: 20px !important;
                border-top: 1px solid #e5e7eb !important;
                background: #f9fafb !important;
                display: flex !important;
                justify-content: flex-end !important;
                gap: 10px !important;
            }
            
            /* Custom scrollbar for modal */
            #add-event-modal .modal-content .modal-body::-webkit-scrollbar {
                width: 8px !important;
            }
            
            #add-event-modal .modal-content .modal-body::-webkit-scrollbar-track {
                background: #f1f5f9 !important;
                border-radius: 4px !important;
            }
            
            #add-event-modal .modal-content .modal-body::-webkit-scrollbar-thumb {
                background: #cbd5e1 !important;
                border-radius: 4px !important;
            }
            
            #add-event-modal .modal-content .modal-body::-webkit-scrollbar-thumb:hover {
                background: #94a3b8 !important;
            }
            
            /* Smooth scrolling */
            #add-event-modal .modal-content .modal-body {
                scroll-behavior: smooth !important;
            }
            
            /* Ensure form sections have proper spacing */
            #add-event-modal .modal-content .modal-body .form-section {
                margin-bottom: 30px !important;
            }
            
            #add-event-modal .modal-content .modal-body .form-section:last-child {
                margin-bottom: 0 !important;
            }
            
            @keyframes modalSlideIn {
                from {
                    opacity: 0;
                    transform: scale(0.9) translateY(-20px);
                }
                to {
                    opacity: 1;
                    transform: scale(1) translateY(0);
                }
            }
            
            .modal-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 1.5rem;
                border-bottom: 1px solid #e5e7eb;
            }
            
            .modal-header h3 {
                margin: 0;
                font-size: 1.25rem;
                font-weight: 700;
                color: #1f2937;
            }
            
            .modal-close {
                background: none;
                border: none;
                padding: 0.5rem;
                border-radius: 6px;
                cursor: pointer;
                color: #6b7280;
                transition: all 0.2s ease;
            }
            
            .modal-close:hover {
                background: #f3f4f6;
                color: #374151;
            }
            
            .modal-body {
                padding: 1.5rem;
            }
            
            .modal-body .event-form {
                display: flex;
                flex-direction: column;
                gap: 1rem;
            }
            
            .modal-body .form-group {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
            }
            
            .modal-body .form-group label {
                font-weight: 600;
                color: #374151;
                font-size: 0.875rem;
            }
            
            .modal-body .form-input,
            .modal-body .form-textarea {
                padding: 0.75rem 1rem;
                border: 2px solid #e5e7eb;
                border-radius: 8px;
                font-size: 0.875rem;
                transition: all 0.2s ease;
                background: #ffffff;
            }
            
            .modal-body .form-input:focus,
            .modal-body .form-textarea:focus {
                outline: none;
                border-color: #3b82f6;
                box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
            }
            
            .modal-body .form-textarea {
                resize: vertical;
                min-height: 80px;
            }
            
            .modal-body .form-actions {
                display: flex;
                gap: 0.75rem;
                justify-content: flex-end;
                margin-top: 1.5rem;
                padding-top: 1.5rem;
                border-top: 1px solid #e5e7eb;
            }
            
            /* Registration Toggle Styles */
            .toggle-label {
                display: flex;
                align-items: center;
                justify-content: space-between;
                cursor: pointer;
                margin: 0;
                padding: 0.75rem 0;
            }
            
            .toggle-text {
                font-weight: 500;
                color: #1f2937;
                font-size: 1rem;
            }
            
            
            /* Image Upload Styling */
            .image-upload-container {
                border: 2px dashed #d1d5db;
                border-radius: 8px;
                padding: 20px;
                text-align: center;
                transition: all 0.2s ease;
                background: #fafafa;
            }
            
            .image-upload-container:hover {
                border-color: #3b82f6;
                background: #f8fafc;
            }
            
            .image-upload-preview {
                margin-bottom: 16px;
                min-height: 120px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 8px;
                overflow: hidden;
                background: #f3f4f6;
            }
            
            .image-upload-placeholder {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 8px;
                color: #9ca3af;
            }
            
            .image-upload-placeholder i {
                width: 32px;
                height: 32px;
            }
            
            .image-upload-preview img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                border-radius: 8px;
            }
            
            .image-upload-controls {
                display: flex;
                gap: 12px;
                justify-content: center;
                align-items: center;
            }
            
            .image-upload-btn {
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .image-remove-btn {
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .form-help {
                display: block;
                margin-top: 6px;
                font-size: 0.875rem;
                color: #6b7280;
                line-height: 1.4;
            }
        `;
        
        if (!document.querySelector('#notification-styles')) {
            style.id = 'notification-styles';
            document.head.appendChild(style);
        }

        // Add to page
        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);

        // Hide and remove after specified duration
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, duration);

        // Reinitialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
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
     * Update navigation state
     */
    updateNavigation() {
        // Remove active class from all nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to events content link
        const eventsLink = document.querySelector('[data-section="events-content"]');
        if (eventsLink) {
            eventsLink.classList.add('active');
        }
    }

    /**
     * Upload image to Cloudinary via server
     */
    async uploadToCloudinary(fileData) {
        try {
            const response = await fetch('/api/upload/image', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                },
                body: JSON.stringify({
                    imageData: fileData.base64,
                    fileName: fileData.name,
                    folder: 'marigold-school/events'
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Upload failed');
            }

            const result = await response.json();
            return result.url;
        } catch (error) {
            console.error('Cloudinary upload error:', error);
            throw error;
        }
    }

    /**
     * Show notification using global notification component
     */
    showNotification(type, message, duration = 3000) {
        // Get or create notification container
        let container = document.getElementById('notification-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notification-container';
            container.className = 'notification-container';
            document.body.appendChild(container);
        }

        // Remove existing notifications of the same type to avoid duplicates
        const existingNotifications = container.querySelectorAll(`.notification.${type}`);
        existingNotifications.forEach(notification => notification.remove());

        // Set notification content based on type
        let icon, title;
        switch(type) {
            case 'success':
                icon = '✓';
                title = 'Success';
                break;
            case 'error':
                icon = '✕';
                title = 'Error';
                break;
            case 'warning':
                icon = '⚠';
                title = 'Warning';
                break;
            case 'info':
                icon = 'ℹ';
                title = 'Info';
                break;
            default:
                icon = 'ℹ';
                title = 'Notification';
        }

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-icon">${icon}</div>
                <div class="notification-body">
                    <div class="notification-title">${title}</div>
                    <div class="notification-message">${message}</div>
                </div>
            </div>
            <button class="notification-close" aria-label="Close">×</button>
            <div class="notification-progress" style="width: 100%; transition-duration: ${duration}ms;"></div>
        `;

        // Add to container
        container.appendChild(notification);

        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);

        // Auto remove
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, duration);

        // Close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        });
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
                    <button class="btn btn-primary" data-action="reload-page">Reload Page</button>
                </div>
            `;
            
            // Reinitialize Lucide icons
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }
    }

    /**
     * Initialize events section interactivity (called when events section is loaded)
     */
    initializeEventsSectionInteractivity() {
        
        // Set a flag to prevent modal from opening during initialization
        this.isInitializingEventsSection = true;
        
        // Use setTimeout to ensure DOM is fully ready and avoid click event conflicts
        setTimeout(() => {
            // Add event button functionality for this specific section
            const addEventBtns = document.querySelectorAll('.add-event-btn');
            
            addEventBtns.forEach(btn => {
                // Remove any existing listeners to avoid duplicates
                const newBtn = btn.cloneNode(true);
                btn.parentNode.replaceChild(newBtn, btn);
                
                newBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.showAddEventModal();
                });
            });
            
            // Clear the initialization flag after a longer delay
            setTimeout(() => {
                this.isInitializingEventsSection = false;
            }, 500);
        }, 100);
    }

    /**
     * Initialize notices section interactivity
     */
    initializeNoticesInteractivity() {
        
        // Add notice button functionality for this specific section
        const addNoticeBtns = document.querySelectorAll('.add-notice-btn');
        addNoticeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.showAddNoticeModal();
            });
        });
        
        // Add notice card click handlers
        this.setupNoticeCardClickHandlers();
        
        // Setup notices search and filter functionality
        this.setupNoticesSearchAndFilter();
    }

    /**
     * Setup notice card click handlers
     */
    setupNoticeCardClickHandlers() {
        
        // Use event delegation on the notices list container
        const noticesList = document.getElementById('notices-list');
        if (!noticesList) {
            return;
        }

        // Remove any existing listeners to prevent duplicates
        if (this.noticeCardClickHandler) {
            noticesList.removeEventListener('click', this.noticeCardClickHandler);
        }

        // Create the click handler
        this.noticeCardClickHandler = (e) => {
            // Check if clicking on a notice card (but not delete button)
            const noticeCard = e.target.closest('.notice-card');
            const deleteBtn = e.target.closest('.delete-notice-btn');
            
            if (noticeCard && !deleteBtn) {
                e.preventDefault();
                e.stopPropagation();
                this.openNoticeDetail(noticeCard);
            }
            
            // Handle delete button
            if (deleteBtn) {
                e.preventDefault();
                e.stopPropagation();
                const noticeCard = deleteBtn.closest('.notice-card');
                if (noticeCard) {
                    this.deleteNoticeItem(noticeCard);
                }
            }
        };

        // Add the event listener
        noticesList.addEventListener('click', this.noticeCardClickHandler);
    }

    /**
     * Initialize highlights section interactivity
     */
    async initializeHighlightsInteractivity() {
        
        // Setup highlights form functionality
        await this.setupHighlightsFormHandlers();
    }

    /**
     * Initialize events interactivity (global, called once)
     */
    initializeEventsInteractivity() {
        // Remove existing event listeners to prevent duplicates
        if (this.eventsInteractivityInitialized) {
            return;
        }
        this.eventsInteractivityInitialized = true;

        // Add event button functionality (using event delegation)
        document.addEventListener('click', (e) => {
            // Only handle clicks within events content management
            const pageContent = document.getElementById('pageContent');
            if (!pageContent || !pageContent.innerHTML.includes('events-content-section')) {
                return;
            }

            if (e.target.closest('.add-event-btn')) {
                e.preventDefault();
                e.stopPropagation();
                this.showAddEventModal();
            }
        });

        // Search functionality
        const searchInput = document.getElementById('events-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterEvents(e.target.value);
            });
        }

        // Clear search button functionality
        document.addEventListener('click', (e) => {
            if (e.target.closest('.clear-search-btn')) {
                e.preventDefault();
                const searchInput = document.getElementById('events-search');
                if (searchInput) {
                    searchInput.value = '';
                    this.filterEvents('');
                } else {
                }
            }
        });

        // Category filter removed - search functionality handles all filtering

        // Event list item functionality
        document.addEventListener('click', (e) => {
            if (e.target.closest('.edit-btn') || e.target.closest('.event-list-item')) {
                const eventItem = e.target.closest('.event-list-item');
                if (eventItem && !e.target.closest('.delete-btn')) {
                    this.openEventDetail(eventItem);
                }
            }
            
            if (e.target.closest('.delete-btn')) {
                const eventItem = e.target.closest('.event-list-item');
                if (eventItem) {
                    this.deleteEventItem(eventItem);
                }
            }

            // Notice list item functionality
            if (e.target.closest('.edit-notice-btn') || e.target.closest('.notice-card')) {
                const noticeItem = e.target.closest('.notice-card');
                if (noticeItem && !e.target.closest('.delete-notice-btn')) {
                    this.openNoticeDetail(noticeItem);
                }
            }
            
            if (e.target.closest('.delete-notice-btn')) {
                const noticeItem = e.target.closest('.notice-card');
                if (noticeItem) {
                    this.deleteNoticeItem(noticeItem);
                }
            }
            
        });
        
        // Note: Modal setup will be done when events list is loaded
    }

    /**
     * Add new event item
     */
    addEventItem() {
        const eventsContainer = document.getElementById('events-list');
        if (!eventsContainer) return;

        const newEventHtml = `
            <div class="simple-event-item" data-index="new">
                <div class="event-header">
                    <div class="event-title">
                        <input type="text" name="title" placeholder="Event title" class="title-input">
                    </div>
                    <div class="event-actions">
                        <button class="btn-icon delete-btn" title="Delete">
                            <i data-lucide="trash-2"></i>
                        </button>
                    </div>
                </div>
                
                <div class="event-content">
                    <div class="form-row">
                        <div class="form-group">
                            <label>Category</label>
                            <select name="category" class="form-input">
                                <option value="Academic">Academic</option>
                                <option value="Social">Social</option>
                                <option value="Sports">Sports</option>
                                <option value="Cultural">Cultural</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Date</label>
                            <input type="date" name="eventDate" class="form-input">
                        </div>
                        <div class="form-group">
                            <label>Time</label>
                            <input type="time" name="time" class="form-input">
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label>Location</label>
                            <input type="text" name="location" placeholder="Event location" class="form-input">
                        </div>
                        <div class="form-group">
                            <label>Image URL</label>
                            <input type="url" name="imageUrl" placeholder="Image URL" class="form-input">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label>Description</label>
                        <textarea name="content" rows="3" placeholder="Event description..." class="form-textarea"></textarea>
                    </div>
                </div>
            </div>
        `;

        eventsContainer.insertAdjacentHTML('beforeend', newEventHtml);
        
        // Hide empty state if visible
        const emptyState = document.getElementById('events-empty-state');
        if (emptyState) {
            emptyState.style.display = 'none';
        }

        // Reinitialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        this.showNotification('success', 'New event added!');
    }

    /**
     * Delete event item
     */
    deleteEventItem(eventItem) {
        if (confirm('Are you sure you want to delete this event?')) {
            eventItem.remove();
            this.showNotification('success', 'Event deleted successfully!');
            
            // Show empty state if no events left
            const eventsContainer = document.getElementById('events-list');
            if (eventsContainer && eventsContainer.children.length === 0) {
                const emptyState = document.getElementById('events-empty-state');
                if (emptyState) {
                    emptyState.style.display = 'block';
                }
            }
        }
    }

    /**
     * Filter events by search term - contextual to current section
     */
    filterEvents(searchTerm) {

        // Get all event list items
        const eventItems = document.querySelectorAll('.event-list-item');
        const term = searchTerm.toLowerCase().trim();

        // If search term is empty, show all events
        if (!term) {
            eventItems.forEach(item => {
                item.style.display = 'block';
            });
            // Hide empty state when clearing search
            const emptyState = document.getElementById('events-empty-state');
            if (emptyState) {
                emptyState.style.display = 'none';
            }
            return;
        }

        // Filter events based on search term
        let visibleCount = 0;
        eventItems.forEach(item => {
            const eventIndex = parseInt(item.dataset.index);
            const event = this.currentEventsData && this.currentEventsData[eventIndex];
            
            if (!event) {
                item.style.display = 'none';
                return;
            }

            // Search in multiple fields including date
            const eventDate = event.eventDate ? new Date(event.eventDate).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            }) : '';
            
            const searchableText = [
                event.title || '',
                event.description || '',
                event.venue || '',
                event.organizer || '',
                event.category || '',
                event.eventTime || '',
                event.contactInfo || '',
                eventDate || '',
                event.eventDate || '', // Raw date for different formats
                event.date || '' // Alternative date field
            ].join(' ').toLowerCase();

            if (searchableText.includes(term)) {
                item.style.display = 'block';
                visibleCount++;
            } else {
                item.style.display = 'none';
            }
        });

        // Show/hide empty state based on results
        const emptyState = document.getElementById('events-empty-state');
        if (emptyState) {
            if (visibleCount === 0 && term) {
                emptyState.style.display = 'block';
                emptyState.innerHTML = `
                    <div class="empty-icon">
                        <i data-lucide="search"></i>
                    </div>
                    <h3>No events found</h3>
                    <p>No events match your search "${searchTerm}"</p>
                    <button class="btn btn-outline clear-search-btn">
                        Clear search
                    </button>
                `;
                // Re-initialize Lucide icons for the new content
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
            } else {
                emptyState.style.display = 'none';
            }
        }

    }


    /**
     * Open event detail editor
     */
    openEventDetail(eventItem) {
        const eventIndex = eventItem.dataset.index;
        const eventId = eventItem.dataset.eventId;
        
        // Get event data from the current events data
        const eventsData = this.currentEventsData || [];
        const event = eventsData[eventIndex] || {};
        
        
        // Use the already-set currentSection, or fall back to getCurrentSection
        if (!this.currentSection) {
        this.currentSection = this.getCurrentSection();
        }
        
        // Get the event detail editor HTML
        const eventDetailHTML = this.getEventDetailEditor(event, this.currentSection);
        
        // Update the page content
        const pageContent = document.getElementById('pageContent');
        if (pageContent) {
            pageContent.innerHTML = eventDetailHTML;
            
            // Reinitialize Lucide icons
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
            
            // Store current event data for saving
            this.currentEventData = event;
            this.currentEventIndex = eventIndex;
            
        
        // Populate form fields with existing data (with delay to ensure DOM is ready)
        setTimeout(() => {
            this.populateEventDetailForm(event);
        }, 200);
            
            // Add direct event listener for the back button in this specific context
            const backButton = pageContent.querySelector('.back-button');
            if (backButton) {
                backButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation(); // Prevent global handler from firing
                    this.backToEventsList();
                });
            }

            // Initialize interactive features
            this.initializeEventDetailInteractivity();
        }
    }

    /**
     * Open notice detail editor
     */
    openNoticeDetail(noticeItem) {
        const noticeIndex = noticeItem.dataset.index;
        const noticeId = noticeItem.dataset.noticeId;
        
        // Get notice data from the current notices data
        const noticesData = this.currentNoticesData || [];
        const notice = noticesData[noticeIndex] || {};
        
        // Store current section for navigation
        this.currentSection = 'notices';
        
        // Get the notice detail editor HTML
        const noticeDetailHTML = this.getNoticeDetailEditor(notice);
        
        // Update the page content
        const pageContent = document.getElementById('pageContent');
        if (pageContent) {
            pageContent.innerHTML = noticeDetailHTML;
            
            // Reinitialize Lucide icons
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
            
            // Store current notice data for saving
            this.currentNoticeData = notice;
            this.currentNoticeId = notice.id;
            this.currentNoticeIndex = noticeIndex;
            
            // Add direct event listener for the back button in this specific context
            const backButton = pageContent.querySelector('.back-button');
            if (backButton) {
                backButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation(); // Prevent global handler from firing
                    this.backToNoticesList();
                });
            }

            // Initialize interactive features
            this.initializeNoticeDetailInteractivity();
        }
    }

    /**
     * Open add event editor
     */
    openAddEvent() {
        console.trace('🚀 Call stack for openAddEvent:');
        
        // Use the already-set currentSection, or fall back to getCurrentSection
        if (!this.currentSection) {
        this.currentSection = this.getCurrentSection();
        }
        
        // Get the add event editor HTML
        const addEventHTML = this.getAddEventEditor(this.currentSection);
        
        // Update the page content
        const pageContent = document.getElementById('pageContent');
        if (pageContent) {
            pageContent.innerHTML = addEventHTML;
            
            // Reinitialize Lucide icons
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
            
            // Store current section for saving
            this.currentAddEventSection = this.currentSection;
            
            // Add direct event listener for the back button in this specific context
            const backButton = pageContent.querySelector('.back-button');
            if (backButton) {
                backButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation(); // Prevent global handler from firing
                    this.backToEventsList();
                });
            }

            // Initialize ImageUpload component for hero image
            this.initializeAddEventImageUpload();

            // Initialize interactive features (without save button)
            this.initializeEventDetailInteractivityWithoutSaveButton();
            
            // Initialize save button for add event
            this.initializeAddEventSaveButton();
        }
    }

    /**
     * Initialize interactive features for event detail editor (without save button)
     */
    initializeEventDetailInteractivityWithoutSaveButton() {
        
        // Schedule items functionality
        this.setupScheduleInteractivity();
        
        // Guests functionality
        this.setupGuestsInteractivity();
        
        // Registration toggle functionality
        this.setupRegistrationToggle();
        
        // Initialize searchable select for category dropdown
        this.initializeSearchableSelects();
        
    }

    /**
     * Initialize interactive features for event detail editor
     */
    initializeEventDetailInteractivity() {
        
        // Schedule items functionality
        this.setupScheduleInteractivity();
        
        // Guests functionality
        this.setupGuestsInteractivity();
        
        // Initialize global ImageUpload component for hero image
        this.initializeHeroImageUploadForEventDetail();
        
        // Registration toggle functionality
        this.setupRegistrationToggle();
        
        // Initialize searchable select for category dropdown
        this.initializeSearchableSelects();
        
        // Initialize global SaveButton component
        this.initializeEventDetailSaveButton();
        
    }

    /**
     * Initialize ImageUpload component for event detail hero image
     */
    initializeHeroImageUploadForEventDetail() {
        const container = document.getElementById('hero-image-upload-container');
        if (!container) {
            console.error('❌ Hero image upload container not found');
            return;
        }
        
        
        const existingImageUrl = document.getElementById('hero-image-url').value;
        
        this.heroImageUpload = new ImageUpload({
            container: container,
            fileInputId: 'hero-image-upload',
            urlInputId: 'hero-image-url',
            selectBtnId: 'hero-image-select-btn',
            previewContainerId: 'hero-image-preview-container',
            previewImgId: 'hero-image-preview',
            removeBtnId: 'hero-image-remove-btn',
            uploadPath: '/api/upload/image',
            uploadFolder: 'marigold-school/events/hero-images',
            autoUpload: false, // Don't auto-upload, let SaveButton handle it
            onUploadStart: () => {
            },
            onUploadSuccess: (result) => {
                document.getElementById('hero-image-url').value = result.url;
            },
            onUploadError: (error) => {
                console.error('❌ Hero image upload failed:', error);
                let errorMessage = 'Failed to upload image. Please try again.';
                
                if (error.message && error.message.includes('File size too large')) {
                    errorMessage = 'Image file is too large. Please select an image smaller than 25MB.';
                } else if (error.message && error.message.includes('Invalid file type')) {
                    errorMessage = 'Invalid file type. Please select a PNG, JPG, or GIF image.';
                }
                
                this.showNotification('error', errorMessage);
            }
        });
        
        // Initialize the component
        this.heroImageUpload.init();
        
        // Set existing image if available (skip linear gradients and empty URLs)
        if (existingImageUrl && 
            !existingImageUrl.startsWith('linear-gradient') && 
            existingImageUrl.trim() !== '' &&
            existingImageUrl !== 'null' &&
            existingImageUrl !== 'undefined') {
            this.heroImageUpload.setImageUrl(existingImageUrl);
        }
    }
    
    /**
     * Initialize ImageUpload component for add event hero image
     */
    initializeAddEventImageUpload() {
        const container = document.getElementById('hero-image-upload-container');
        if (!container) {
            console.error('❌ Hero image upload container not found');
            return;
        }
        
        
        this.heroImageUpload = new ImageUpload({
            container: container,
            fileInputId: 'hero-image-upload',
            urlInputId: 'hero-image-url',
            selectBtnId: 'hero-image-select-btn',
            previewContainerId: 'hero-image-preview-container',
            previewImgId: 'hero-image-preview',
            removeBtnId: 'hero-image-remove-btn',
            uploadPath: '/api/upload/image',
            uploadFolder: 'marigold-school/events/hero-images',
            autoUpload: false, // Don't auto-upload, let SaveButton handle it
            onUploadStart: () => {
            },
            onUploadSuccess: (result) => {
                document.getElementById('hero-image-url').value = result.url;
            },
            onUploadError: (error) => {
                console.error('❌ Hero image upload failed:', error);
                let errorMessage = 'Failed to upload image. Please try again.';
                
                if (error.message && error.message.includes('File size too large')) {
                    errorMessage = 'Image file is too large. Please select an image smaller than 25MB.';
                } else if (error.message && error.message.includes('Invalid file type')) {
                    errorMessage = 'Invalid file type. Please select a PNG, JPG, or GIF image.';
                }
                
                this.showNotification('error', errorMessage);
            }
        });
        
        // Initialize the component
        this.heroImageUpload.init();
    }
    
    /**
     * Initialize SaveButton component for add event
     */
    initializeAddEventSaveButton() {
        const saveBtn = document.querySelector('.save-event-btn');
        if (!saveBtn) {
            console.error('❌ Save event button not found');
            return;
        }
        
        
        // Create SaveButton component
        this.eventSaveButton = new SaveButton({
            target: saveBtn,
            dataSection: 'add_event',
            hasImages: true,
            messages: {
                preparing: 'Preparing event data...',
                collecting: 'Collecting event information...',
                saving: 'Creating event...',
                success: 'Event created successfully!'
            },
            onSave: async (button) => {
                try {
                    const token = localStorage.getItem('adminToken');
                    if (!token) {
                        throw new Error('Authentication required');
                    }

                    button.updateProgress('Collecting event data...', 25);
                    
                    // Handle image upload if there's a pending upload
                    if (this.heroImageUpload && this.heroImageUpload.hasPendingUpload()) {
                        button.updateProgress('Uploading hero image...', 10);
                        
                        try {
                            const fileInput = document.getElementById('hero-image-upload');
                            const file = fileInput.files[0];
                            if (file) {
                                const uploadResult = await this.heroImageUpload.uploadFile(file);
                                
                                // Ensure the URL input is updated
                                const urlInput = document.getElementById('hero-image-url');
                                if (urlInput && uploadResult.url) {
                                    urlInput.value = uploadResult.url;
                                }
                            }
                        } catch (uploadError) {
                            console.error('❌ Image upload failed:', uploadError);
                            throw new Error(`Failed to upload image: ${uploadError.message}`);
                        }
                    }

                    button.updateProgress('Collecting event data...', 40);
                    
                    // Collect event data
                    const eventData = this.collectAddEventData();
                    
                    // Validate required fields
                    const validationErrors = [];
                    
                    // Required: Event Title
                    if (!eventData.title || eventData.title.trim() === '') {
                        validationErrors.push('Event Title is required');
                        // Highlight the field
                        document.getElementById('event-title')?.classList.add('error');
                    } else {
                        document.getElementById('event-title')?.classList.remove('error');
                    }
                    
                    // Required: Event Category
                    if (!eventData.category || eventData.category.trim() === '') {
                        validationErrors.push('Event Category is required');
                        document.getElementById('event-category')?.classList.add('error');
                    } else {
                        document.getElementById('event-category')?.classList.remove('error');
                    }
                    
                    // Required: Event Description
                    if (!eventData.description || eventData.description.trim() === '') {
                        validationErrors.push('Event Description is required');
                        document.getElementById('event-description')?.classList.add('error');
                    } else {
                        document.getElementById('event-description')?.classList.remove('error');
                    }
                    
                    // Required: Event Date
                    if (!eventData.date || eventData.date.trim() === '') {
                        validationErrors.push('Event Date is required');
                        document.getElementById('event-date')?.classList.add('error');
                    } else {
                        document.getElementById('event-date')?.classList.remove('error');
                    }
                    
                    if (validationErrors.length > 0) {
                        console.error('❌ Validation errors:', validationErrors);
                        
                        // Show notification with errors
                        this.showNotification('error', `Please fill in all required fields:\n• ${validationErrors.join('\n• ')}`);
                        
                        // Scroll to first error field
                        const firstErrorField = document.querySelector('.error');
                        if (firstErrorField) {
                            firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            firstErrorField.focus();
                        }
                        
                        throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
                    }

                    button.updateProgress('Creating event...', 75);
                    
                    // Send to API
                    const response = await fetch('/api/events', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify(eventData)
                    });
                    

                    if (!response.ok) {
                        const errorData = await response.json();
                        console.error('❌ API error response:', errorData);
                        if (errorData.errors && Array.isArray(errorData.errors)) {
                            console.error('❌ Validation errors:', errorData.errors);
                            console.error('❌ Validation errors details:', JSON.stringify(errorData.errors, null, 2));
                            const errorMessages = errorData.errors.map(e => {
                                if (typeof e === 'string') return e;
                                if (e.message) return e.message;
                                if (e.msg) return e.msg;
                                return JSON.stringify(e);
                            });
                            throw new Error(`Validation failed: ${errorMessages.join(', ')}`);
                        }
                        throw new Error(errorData.message || 'Failed to create event');
                    }

                    const result = await response.json();
                    
                    button.updateProgress('Event created successfully!', 100);
                    
                    // Navigate back to events list after successful save
                    setTimeout(() => {
                        this.backToEventsList();
                    }, 1500); // Wait 1.5 seconds to show success message
                    
                    return result;

                } catch (error) {
                    throw error;
                }
            }
        });

    }
    
    /**
     * Collect add event data from form
     */
    collectAddEventData() {
        // Get form values
        const title = document.getElementById('event-title')?.value || '';
        const category = document.getElementById('event-category')?.value || '';
        const eventDate = document.getElementById('event-date')?.value || '';
        const time = document.getElementById('event-time')?.value || '';
        const venue = document.getElementById('event-venue')?.value || '';
        const organizer = document.getElementById('event-organizer')?.value || '';
        const description = document.getElementById('event-description')?.value || '';
        const registrationEnabled = false; // Registration section removed
        const locationMap = document.getElementById('location-map')?.value || '';
        const contactInfo = document.getElementById('contact-info')?.value || '';
        
        // Get image URL from ImageUpload component or fallback to input
        let imageUrl = '';
        if (this.heroImageUpload) {
            imageUrl = this.heroImageUpload.getImageUrl();
        } else {
            imageUrl = document.getElementById('hero-image-url')?.value || '';
        }
        
        // Collect schedule items
        const scheduleItems = [];
        const scheduleItemElements = document.querySelectorAll('.schedule-item');
        scheduleItemElements.forEach((item, index) => {
            const scheduleTime = item.querySelector('[name="schedule-time"]')?.value || '';
            const scheduleEvent = item.querySelector('[name="schedule-event"]')?.value || '';
            const scheduleIcon = item.querySelector('[name="schedule-icon"]')?.value || '';
            
            if (scheduleTime && scheduleEvent) {
                scheduleItems.push({
                    time: scheduleTime,
                    event: scheduleEvent,
                    icon: scheduleIcon
                });
            }
        });
        
        // Collect guests
        const guests = [];
        const guestItemElements = document.querySelectorAll('.guest-item');
        guestItemElements.forEach((item, index) => {
            const guestName = item.querySelector('[name="guest-name"]')?.value || '';
            const guestRole = item.querySelector('[name="guest-role"]')?.value || '';
            const guestAvatar = item.querySelector('[name="guest-avatar"]')?.value || '';
            
            if (guestName) {
                guests.push({
                    name: guestName,
                    role: guestRole,
                    avatar: guestAvatar
                });
            }
        });
        
        return {
            title,
            category,
            date: eventDate,  // API expects 'date' not 'eventDate'
            time,
            location: venue,
            organizer,
            description: description,  // API expects 'description' not 'content'
            imageUrl,
            registrationEnabled,
            locationMap,
            contactInfo,
            schedule: scheduleItems,
            guests,
            section: this.currentSection || 'upcoming_events'  // Include the current section
        };
    }
    
    /**
     * Initialize SaveButton component for event detail
     */
    initializeEventDetailSaveButton() {
        const container = document.getElementById('save-button-container');
        if (!container) {
            console.error('❌ Save button container not found');
            return;
        }
        
        
        
        // Create a button element first
        const saveButton = document.createElement('button');
        saveButton.className = 'btn btn-primary save-event-btn';
        saveButton.innerHTML = '<i data-lucide="save"></i> Save Changes';
        container.appendChild(saveButton);
        
        this.eventDetailSaveButton = new SaveButton({
            target: saveButton,
            text: 'Save Changes',
            hasImages: true,
            percentages: {
                collecting: 20,
                uploading: 70,
                saving: 90
            },
            onSave: async () => {
                
                // Upload hero image first if there's a pending upload
                if (this.heroImageUpload && this.heroImageUpload.hasPendingUpload()) {
                    this.eventDetailSaveButton.updateProgress('Uploading image...', 30);
                    
                    const uploadResult = await this.heroImageUpload.uploadFile(this.heroImageUpload.elements.fileInput.files[0]);
                    
                    this.eventDetailSaveButton.updateProgress('Image uploaded successfully', 60);
                    
                    // Wait a moment for the URL to be updated in the form
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
                
                // Collect form data AFTER image upload to get updated URL
                this.eventDetailSaveButton.updateProgress('Collecting data...', 70);
                const eventData = this.collectEventDetailData();
                
                // Save to server
                this.eventDetailSaveButton.updateProgress('Saving to database...', 80);
                const result = await this.saveEventDetailToServer(eventData);
                
                return result;
            },
            onSuccess: (result) => {
                this.showNotification('success', 'Event updated successfully!');
                
                // Navigate back to events list after a short delay
                setTimeout(() => {
                    this.backToEventsList();
                }, 1500);
            },
            onError: (error) => {
                console.error('❌ Failed to save event detail:', error);
                this.showNotification('error', 'Failed to save event. Please try again.');
            }
        });
        
    }
    
    /**
     * Collect event detail form data
     */
    collectEventDetailData() {
        // Collect schedule items
        const scheduleItems = this.collectScheduleItems();
        
        // Collect guest items
        const guestItems = this.collectGuestItems();
        
        // Check registration enabled status
        const registrationEnabled = false; // Registration section removed
        
        const imageUrl = document.getElementById('hero-image-url')?.value || '';
        
        return {
            title: document.getElementById('event-title')?.value || '',
            category: document.getElementById('event-category')?.value || '',
            imageUrl: imageUrl,
            date: document.getElementById('event-date')?.value || '',
            time: document.getElementById('event-time')?.value || '',
            venue: document.getElementById('event-venue')?.value || '',
            organizer: document.getElementById('event-organizer')?.value || '',
            description: document.getElementById('event-description')?.value || '',
            contactInfo: document.getElementById('contact-info')?.value || '',
            schedule: scheduleItems,
            guests: guestItems,
            registrationEnabled: registrationEnabled,
            locationMap: document.getElementById('location-map')?.value || ''
        };
    }

    /**
     * Populate event detail form with existing data
     */
    populateEventDetailForm(event) {
        
        // Basic fields
        const titleField = document.getElementById('event-title');
        const categoryField = document.getElementById('event-category');
        const dateField = document.getElementById('event-date');
        const timeField = document.getElementById('event-time');
        const venueField = document.getElementById('event-venue');
        const organizerField = document.getElementById('event-organizer');
        const descriptionField = document.getElementById('event-description');
        const contactField = document.getElementById('contact-info');
        const locationMapField = document.getElementById('location-map');
        // Registration field removed
        
        if (titleField) titleField.value = event.title || '';
        if (categoryField) categoryField.value = event.category || '';
        if (dateField) dateField.value = event.eventDate ? new Date(event.eventDate).toISOString().split('T')[0] : '';
        if (timeField) timeField.value = event.eventTime || '';
        if (venueField) venueField.value = event.venue || '';
        if (organizerField) organizerField.value = event.organizer || '';
        if (descriptionField) descriptionField.value = event.description || event.content || '';
        if (contactField) contactField.value = event.contactInfo || '';
        if (locationMapField) locationMapField.value = event.locationMap || '';
        // Registration field handling removed
        
        // Populate schedule items
        this.populateScheduleItems(event.eventSchedule);
        
        // Populate guest items
        this.populateGuestItems(event.guests);
    }

    /**
     * Populate schedule items from JSON data
     */
    populateScheduleItems(scheduleData) {
        
        if (!scheduleData) {
            return;
        }
        
        try {
            let scheduleItems;
            if (typeof scheduleData === 'string') {
                scheduleItems = JSON.parse(scheduleData);
            } else if (Array.isArray(scheduleData)) {
                scheduleItems = scheduleData;
            } else {
                return;
            }
            
            const scheduleContainer = document.getElementById('schedule-items');
            
            if (scheduleContainer && Array.isArray(scheduleItems)) {
                // Clear existing items except the first one
                const existingItems = scheduleContainer.querySelectorAll('.schedule-item');
                existingItems.forEach((item, index) => {
                    if (index > 0) item.remove();
                });
                
                // Populate first item
                const firstItem = scheduleContainer.querySelector('.schedule-item');
                if (firstItem && scheduleItems[0]) {
                    const firstSchedule = scheduleItems[0];
                    
                    const timeInput = firstItem.querySelector('input[name="schedule-time"]');
                    const eventInput = firstItem.querySelector('input[name="schedule-event"]');
                    const iconSelect = firstItem.querySelector('select[name="schedule-icon"]');
                    
                    
                    if (timeInput) {
                        timeInput.value = firstSchedule.time || '';
                    }
                    if (eventInput) {
                        eventInput.value = firstSchedule.event || '';
                    }
                    if (iconSelect) {
                        iconSelect.value = firstSchedule.icon || '';
                    }
                }
                
                // Add and populate additional items (without showing success notifications)
                scheduleItems.slice(1).forEach((schedule, index) => {
                    this.addScheduleItemSilently();
                    // Get the newly added item and populate it
                    const newItems = scheduleContainer.querySelectorAll('.schedule-item');
                    const newItem = newItems[newItems.length - 1];
                    if (newItem && schedule) {
                        
                        const timeInput = newItem.querySelector('input[name="schedule-time"]');
                        const eventInput = newItem.querySelector('input[name="schedule-event"]');
                        const iconSelect = newItem.querySelector('select[name="schedule-icon"]');
                        
                        if (timeInput) {
                            timeInput.value = schedule.time || '';
                        }
                        if (eventInput) {
                            eventInput.value = schedule.event || '';
                        }
                        if (iconSelect) {
                            iconSelect.value = schedule.icon || '';
                        }
                    }
                });
            }
        } catch (error) {
            console.error('Error populating schedule items:', error);
        }
    }

    /**
     * Populate guest items from JSON data
     */
    populateGuestItems(guestsData) {
        
        if (!guestsData) {
            return;
        }
        
        try {
            let guestItems;
            if (typeof guestsData === 'string') {
                guestItems = JSON.parse(guestsData);
            } else if (Array.isArray(guestsData)) {
                guestItems = guestsData;
            } else {
                return;
            }
            
            const guestsContainer = document.getElementById('guests-items');
            
            if (guestsContainer && Array.isArray(guestItems)) {
                // Clear existing items except the first one
                const existingItems = guestsContainer.querySelectorAll('.guest-item');
                existingItems.forEach((item, index) => {
                    if (index > 0) item.remove();
                });
                
                // Populate first item
                const firstItem = guestsContainer.querySelector('.guest-item');
                if (firstItem && guestItems[0]) {
                    const firstGuest = guestItems[0];
                    
                    const nameInput = firstItem.querySelector('input[name="guest-name"]');
                    const roleInput = firstItem.querySelector('input[name="guest-role"]');
                    const avatarInput = firstItem.querySelector('input[name="guest-avatar"]');
                    
                    
                    if (nameInput) {
                        nameInput.value = firstGuest.name || '';
                    }
                    if (roleInput) {
                        roleInput.value = firstGuest.role || '';
                    }
                    if (avatarInput) {
                        avatarInput.value = firstGuest.avatar || '';
                    }
                }
                
                // Add and populate additional items (without showing success notifications)
                guestItems.slice(1).forEach((guest, index) => {
                    this.addGuestItemSilently();
                    // Get the newly added item and populate it
                    const newItems = guestsContainer.querySelectorAll('.guest-item');
                    const newItem = newItems[newItems.length - 1];
                    if (newItem && guest) {
                        
                        const nameInput = newItem.querySelector('input[name="guest-name"]');
                        const roleInput = newItem.querySelector('input[name="guest-role"]');
                        const avatarInput = newItem.querySelector('input[name="guest-avatar"]');
                        
                        if (nameInput) {
                            nameInput.value = guest.name || '';
                        }
                        if (roleInput) {
                            roleInput.value = guest.role || '';
                        }
                        if (avatarInput) {
                            avatarInput.value = guest.avatar || '';
                        }
                    }
                });
            }
        } catch (error) {
            console.error('Error populating guest items:', error);
        }
    }

    /**
     * Collect schedule items from the form
     */
    collectScheduleItems() {
        const scheduleItems = [];
        const scheduleContainer = document.getElementById('schedule-items');
        
        if (scheduleContainer) {
            const scheduleElements = scheduleContainer.querySelectorAll('.schedule-item');
            scheduleElements.forEach((item, index) => {
                const time = item.querySelector('input[name="schedule-time"]')?.value || '';
                const eventName = item.querySelector('input[name="schedule-event"]')?.value || '';
                const icon = item.querySelector('select[name="schedule-icon"]')?.value || '';
                
                if (time || eventName) {
                    scheduleItems.push({
                        id: `schedule_${index}`,
                        time: time,
                        event: eventName,
                        icon: icon
                    });
                }
            });
        }
        
        return scheduleItems;
    }

    /**
     * Collect guest items from the form
     */
    collectGuestItems() {
        const guestItems = [];
        const guestsContainer = document.getElementById('guests-items');
        
        if (guestsContainer) {
            const guestElements = guestsContainer.querySelectorAll('.guest-item');
            guestElements.forEach((item, index) => {
                const name = item.querySelector('input[name="guest-name"]')?.value || '';
                const role = item.querySelector('input[name="guest-role"]')?.value || '';
                const avatar = item.querySelector('input[name="guest-avatar"]')?.value || '';
                
                if (name || role) {
                    guestItems.push({
                        id: `guest_${index}`,
                        name: name,
                        role: role,
                        avatar: avatar
                    });
                }
            });
        }
        
        return guestItems;
    }

    /**
     * Save event detail to server
     */
    async saveEventDetailToServer(eventData) {
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                throw new Error('Authentication required');
            }
            
            // Get current event ID and section
            const eventId = this.currentEventData?.id;
            const section = this.currentSection || 'upcoming_events';
            
            
            if (!eventId) {
                throw new Error('Event ID not found');
            }
            
            
            // Prepare the update data
            const updateData = {
                title: eventData.title,
                description: eventData.description,
                category: eventData.category,
                imageUrl: eventData.imageUrl,
                eventDate: eventData.date ? new Date(eventData.date) : null,
                eventTime: eventData.time,
                venue: eventData.venue,
                organizer: eventData.organizer,
                contactInfo: eventData.contactInfo,
                eventSchedule: JSON.stringify(eventData.schedule),
                guests: JSON.stringify(eventData.guests),
                registrationEnabled: eventData.registrationEnabled,
                locationMap: eventData.locationMap,
                helpDesk: eventData.contactInfo // Using contactInfo as helpDesk for now
            };
            
            
            // Send update request
            const response = await fetch(`/api/content/events-content/${eventId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updateData)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to save event');
            }
            
            const result = await response.json();
            
            return result;
            
        } catch (error) {
            console.error('❌ Error saving event detail:', error);
            throw error;
        }
    }

    /**
     * Initialize interactive features for notice detail editor
     */
    initializeNoticeDetailInteractivity() {
        const form = document.getElementById('edit-notice-form');
        if (!form) return;

        // Initialize highlights functionality with existing highlights
        this.noticeHighlights = [];
        
        // Collect existing highlights from the form
        const existingHighlights = form.querySelectorAll('.highlight-input');
        existingHighlights.forEach((input, index) => {
            this.noticeHighlights.push(input.value);
            
            // Add event listener for changes
            input.addEventListener('input', (e) => {
                this.noticeHighlights[index] = e.target.value;
            });
            
            // Add event listener for remove button
            const removeBtn = input.closest('.highlight-input-group')?.querySelector('.remove-highlight-btn');
            if (removeBtn) {
                removeBtn.addEventListener('click', () => {
                    const highlightIndex = parseInt(removeBtn.dataset.index);
                    this.removeNoticeHighlight(highlightIndex);
                });
            }
        });
        
        this.setupNoticeHighlights();

        // Initialize image upload with existing image
        this.initializeNoticeImageUploadForEdit();

        // Initialize PDF upload
        this.initializePDFUpload('edit-notice-pdf-upload', 'edit-notice-pdf-list');

        // Initialize SaveButton for editing
        this.initializeNoticeEditSaveButton();

        // Initialize searchable select for category dropdown
        this.initializeSearchableSelects();
    }

    /**
     * Initialize notice image upload for edit mode
     */
    initializeNoticeImageUploadForEdit() {
        
        const container = document.getElementById('notice-image-upload-container');
        if (!container) {
            console.error('❌ Notice image upload container not found');
            return;
        }

        // Get existing image URL
        const existingImageUrl = this.currentNoticeData?.imageUrl || '';

        // Create ImageUpload instance
        const uploadHTML = ImageUpload.createHTML({
            fileInputId: 'notice-image-file',
            urlInputId: 'notice-image-url',
            selectBtnId: 'notice-select-image-btn',
            previewContainerId: 'notice-image-preview-container',
            previewImgId: 'notice-image-preview',
            removeBtnId: 'notice-image-remove-btn',
            existingImageUrl: existingImageUrl
        });

        container.innerHTML = uploadHTML;

        // Initialize ImageUpload
        this.noticeImageUpload = new ImageUpload({
            fileInputId: 'notice-image-file',
            urlInputId: 'notice-image-url',
            selectBtnId: 'notice-select-image-btn',
            previewContainerId: 'notice-image-preview-container',
            previewImgId: 'notice-image-preview',
            removeBtnId: 'notice-image-remove-btn',
            uploadFolder: 'marigold-school/notices',
            autoUpload: false
        });

        // Initialize the component to set up event listeners
        this.noticeImageUpload.init();

    }

    /**
     * Initialize SaveButton for editing notice
     */
    initializeNoticeEditSaveButton() {
        
        const container = document.getElementById('notice-save-button-container');
        if (!container) {
            console.error('❌ Save button container not found');
            return;
        }

        // Create a button element
        const saveBtn = document.createElement('button');
        saveBtn.type = 'button';
        saveBtn.className = 'btn btn-primary';
        container.appendChild(saveBtn);

        // Initialize SaveButton
        this.noticeEditSaveButton = new SaveButton({
            target: saveBtn,
            text: 'Update Notice',
            icon: 'save',
            hasImages: true,
            progressMessages: {
                uploading: 'Uploading image...',
                saving: 'Updating notice...',
                success: 'Notice updated successfully!'
            },
            onSave: async () => {
                await this.updateNoticeWithValidation();
            }
        });

    }

    /**
     * Update notice with validation
     */
    async updateNoticeWithValidation() {

        // Validate required fields
        const title = document.getElementById('notice-title')?.value.trim();
        const category = document.getElementById('notice-category')?.value;
        const content = document.getElementById('notice-content')?.value.trim();

        const errors = [];
        if (!title) errors.push('Title is required');
        if (!category) errors.push('Category is required');
        if (!content) errors.push('Content/Description is required');

        if (errors.length > 0) {
            // Highlight error fields
            if (!title) document.getElementById('notice-title')?.classList.add('error');
            if (!category) document.getElementById('notice-category')?.classList.add('error');
            if (!content) document.getElementById('notice-content')?.classList.add('error');

            this.showNotification('error', 'Please fix the following errors:\n' + errors.join('\n'));
            throw new Error('Validation failed');
        }

        try {
            // Remove error classes
            document.getElementById('notice-title')?.classList.remove('error');
            document.getElementById('notice-category')?.classList.remove('error');
            document.getElementById('notice-content')?.classList.remove('error');

            // Upload image if changed
            let imageUrl = document.getElementById('notice-image-url')?.value || '';
            const fileInput = document.getElementById('notice-image-file');
            const file = fileInput?.files[0];

            if (file && this.noticeImageUpload) {
                this.noticeEditSaveButton.updateProgress('Uploading image...', 30);
                const uploadResult = await this.noticeImageUpload.uploadFile(file);
                imageUrl = uploadResult.url || uploadResult.secure_url;
            }

            // Upload PDF files first
            this.noticeEditSaveButton.updateProgress('Uploading PDF files...', 50);
            const pdfFiles = await this.uploadAllPDFFiles();
            
            this.noticeEditSaveButton.updateProgress('Updating notice...', 70);

            // Collect notice data
            const noticeData = {
                title: title,
                category: category,
                author: document.getElementById('notice-author')?.value.trim() || 'Marigold School',
                description: content,
                content: content,
                date: document.getElementById('notice-date')?.value || new Date().toISOString().split('T')[0],
                time: '09:00',
                location: 'Marigold School',
                validUntil: document.getElementById('notice-valid-until')?.value || null,
                audience: 'all', // Default audience
                imageUrl: imageUrl,
                pdfFiles: pdfFiles,
                eventSchedule: JSON.stringify(this.noticeHighlights.filter(h => h.trim() !== '')),
                section: 'notices',
                isActive: true
            };


            // Get authentication token
            const token = localStorage.getItem('adminToken');
            if (!token) {
                this.showNotification('error', 'Authentication required. Please login again.');
                throw new Error('No auth token');
            }

            // Update notice via API
            
            const response = await fetch(`/api/events/${this.currentNoticeData.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(noticeData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('❌ Update failed:', errorData);
                throw new Error(errorData.message || 'Failed to update notice');
            }

            const result = await response.json();

            this.showNotification('success', 'Notice updated successfully!');

            // Navigate back after a short delay
            setTimeout(() => {
                this.backToNoticesList();
            }, 1500);

        } catch (error) {
            console.error('❌ Error updating notice:', error);
            this.showNotification('error', error.message || 'Failed to update notice');
            throw error;
        }
    }

    /**
     * Setup schedule items interactivity
     */
    setupScheduleInteractivity() {
        // Add schedule item
        const addScheduleBtn = document.querySelector('.add-schedule-item');
        if (addScheduleBtn) {
            addScheduleBtn.addEventListener('click', () => {
                this.addScheduleItem();
            });
        }

        // Remove schedule items (delegated event listener)
        document.addEventListener('click', (e) => {
            if (e.target.closest('.remove-schedule-item')) {
                e.preventDefault();
                const scheduleItem = e.target.closest('.schedule-item');
                if (scheduleItem) {
                    this.removeScheduleItem(scheduleItem);
                }
            }
        });

        // Add drag and drop functionality
        this.setupDragAndDrop('schedule-item');
        
        // Add keyboard shortcuts
        this.setupKeyboardShortcuts('schedule');
    }

    /**
     * Setup guests interactivity
     */
    setupGuestsInteractivity() {
        // Add guest
        const addGuestBtn = document.querySelector('.add-guest-item');
        if (addGuestBtn) {
            addGuestBtn.addEventListener('click', () => {
                this.addGuestItem();
            });
        }

        // Remove guests (delegated event listener)
        document.addEventListener('click', (e) => {
            if (e.target.closest('.remove-guest-item')) {
                e.preventDefault();
                const guestItem = e.target.closest('.guest-item');
                if (guestItem) {
                    this.removeGuestItem(guestItem);
                }
            }
        });

        // Add drag and drop functionality
        this.setupDragAndDrop('guest-item');
        
        // Add keyboard shortcuts
        this.setupKeyboardShortcuts('guest');
    }

    /**
     * Setup image upload interactivity
     */
    setupImageUploadInteractivity() {
        // Hero image upload
        const heroUploadBtn = document.querySelector('#hero-image-upload');
        const heroUploadInput = document.querySelector('#hero-image-upload');
        if (heroUploadBtn && heroUploadInput) {
            heroUploadBtn.addEventListener('click', () => {
                heroUploadInput.click();
            });
            
            heroUploadInput.addEventListener('change', (e) => {
                this.handleImageUpload(e, 'hero');
            });
        }
    }

    /**
     * Setup registration toggle functionality
     */
    setupRegistrationToggle() {
        const registrationToggle = document.querySelector('#registration-enabled');
        
        if (registrationToggle) {
            registrationToggle.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.showNotification('success', 'Registration form enabled');
                } else {
                    this.showNotification('info', 'Registration form disabled');
                }
            });
        }
    }

    /**
     * Setup category selector functionality
     */
    setupCategorySelector() {
        const addCategoryBtn = document.querySelector('.add-category-btn');
        const addCategoryForm = document.querySelector('.add-category-form');
        const saveCategoryBtn = document.querySelector('.save-category-btn');
        const cancelCategoryBtn = document.querySelector('.cancel-category-btn');
        const newCategoryInput = document.getElementById('new-category-name');
        const categorySelect = document.getElementById('event-category');

        if (addCategoryBtn && addCategoryForm) {
            // Show add category form
            addCategoryBtn.addEventListener('click', () => {
                addCategoryForm.style.display = 'block';
                newCategoryInput.focus();
            });

            // Save new category
            if (saveCategoryBtn && newCategoryInput && categorySelect) {
                saveCategoryBtn.addEventListener('click', () => {
                    const newCategoryName = newCategoryInput.value.trim();
                    if (newCategoryName) {
                        // Add new option to select
                        const newOption = document.createElement('option');
                        newOption.value = newCategoryName.toLowerCase().replace(/\s+/g, '-');
                        newOption.textContent = newCategoryName;
                        newOption.selected = true;
                        categorySelect.appendChild(newOption);
                        
                        // Clear form and hide
                        newCategoryInput.value = '';
                        addCategoryForm.style.display = 'none';
                        
                        this.showNotification('success', `Category "${newCategoryName}" added successfully`);
                    } else {
                        this.showNotification('error', 'Please enter a category name');
                    }
                });
            }

            // Cancel adding category
            if (cancelCategoryBtn) {
                cancelCategoryBtn.addEventListener('click', () => {
                    newCategoryInput.value = '';
                    addCategoryForm.style.display = 'none';
                });
            }

            // Handle Enter key in new category input
            if (newCategoryInput) {
                newCategoryInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        saveCategoryBtn.click();
                    }
                });
            }
        }
    }

    /**
     * Initialize searchable select for category dropdowns
     * Converts regular select elements into searchable dropdowns
     */
    initializeSearchableSelects() {
        // Check if SearchableSelect class is available
        if (typeof SearchableSelect === 'undefined') {
            console.warn('SearchableSelect class not loaded yet');
            return;
        }

        // Find all category select elements that aren't already initialized
        const selectors = [
            '#notice-category',
            '#event-category',
            'select[name="category"]'
        ];

        selectors.forEach(selector => {
            const selectElement = document.querySelector(selector);
            
            if (selectElement && !selectElement.classList.contains('searchable-select-initialized')) {
                try {
                    new SearchableSelect(selectElement, {
                        placeholder: 'Search categories...',
                        noResultsText: 'No matching categories found',
                        maxHeight: '300px'
                    });
                    console.log(`✅ Initialized searchable select for: ${selector}`);
                } catch (error) {
                    console.error(`❌ Failed to initialize searchable select for ${selector}:`, error);
                }
            }
        });
    }

    /**
     * Setup save event button functionality
     */
    setupSaveEventButton() {
        const saveEventBtn = document.querySelector('.save-event-btn');
        if (saveEventBtn) {
            saveEventBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.saveEvent();
            });
        }
    }

    /**
     * Save event (handles both new and existing events)
     */
    async saveEvent() {
        try {
            // Get form data
            const eventData = this.getEventFormData();
            
            // Determine if we're adding new event or editing existing
            const isNewEvent = this.currentAddEventSection !== undefined;
            const section = isNewEvent ? this.currentAddEventSection : this.currentSection;
            
            
            // Show loading state
            const saveBtn = document.querySelector('.save-event-btn');
            if (saveBtn) {
                saveBtn.disabled = true;
                saveBtn.innerHTML = '<i data-lucide="loader-2"></i> Saving...';
            }
            
            let response;
            if (isNewEvent) {
                // Create new event
                response = await fetch('/api/content/events-content', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        section: section,
                        data: eventData
                    })
                });
            } else {
                // Update existing event
                response = await fetch(`/api/content/events-content/${this.currentEventData.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        section: section,
                        data: eventData
                    })
                });
            }
            
            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    this.showNotification('success', isNewEvent ? 'Event created successfully!' : 'Event updated successfully!');
                    
                    // Clear add event context if it was a new event
                    if (isNewEvent) {
                        this.currentAddEventSection = undefined;
                    }
                    
                    // Return to events list
                    setTimeout(() => {
                        this.backToEventsList();
                    }, 1500);
                } else {
                    throw new Error(result.message || 'Failed to save event');
                }
            } else {
                throw new Error('Network error occurred');
            }
        } catch (error) {
            console.error('Error saving event:', error);
            this.showNotification('error', 'Failed to save event. Please try again.');
        } finally {
            // Reset button state
            const saveBtn = document.querySelector('.save-event-btn');
            if (saveBtn) {
                saveBtn.disabled = false;
                saveBtn.innerHTML = isNewEvent ? '<i data-lucide="plus"></i> Create Event' : '<i data-lucide="save"></i> Save Changes';
            }
        }
    }

    /**
     * Get event form data
     */
    getEventFormData() {
        return {
            title: document.getElementById('event-title')?.value || '',
            category: document.getElementById('event-category')?.value || '',
            imageUrl: document.getElementById('hero-image-url')?.value || '',
            eventDate: document.getElementById('event-date')?.value || '',
            time: document.getElementById('event-time')?.value || '',
            location: document.getElementById('event-venue')?.value || '',
            organizer: document.getElementById('event-organizer')?.value || '',
            description: document.getElementById('event-description')?.value || '',
            registrationEnabled: document.getElementById('registration-enabled')?.checked || false,
            locationMap: document.getElementById('location-map')?.value || '',
            contactInfo: document.getElementById('contact-info')?.value || '',
            schedule: this.getScheduleData(),
            guests: this.getGuestsData()
        };
    }

    /**
     * Get schedule data from form
     */
    getScheduleData() {
        const scheduleItems = document.querySelectorAll('.schedule-item');
        return Array.from(scheduleItems).map(item => ({
            time: item.querySelector('input[name="schedule-time"]')?.value || '',
            event: item.querySelector('input[name="schedule-event"]')?.value || '',
            icon: item.querySelector('select[name="schedule-icon"]')?.value || ''
        }));
    }

    /**
     * Get guests data from form
     */
    getGuestsData() {
        const guestItems = document.querySelectorAll('.guest-item');
        return Array.from(guestItems).map(item => ({
            name: item.querySelector('input[name="guest-name"]')?.value || '',
            role: item.querySelector('input[name="guest-role"]')?.value || '',
            avatar: item.querySelector('input[name="guest-avatar"]')?.value || ''
        }));
    }

    /**
     * Setup save notice button functionality
     */
    setupSaveNoticeButton() {
        const saveNoticeBtn = document.querySelector('.save-notice-btn');
        if (saveNoticeBtn) {
            saveNoticeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.saveNotice();
            });
        }
    }

    /**
     * Save notice (handles both new and existing notices)
     */
    async saveNotice() {
        try {
            // Get form data
            const noticeData = this.getNoticeFormData();
            
            // Determine if we're adding new notice or editing existing
            const isNewNotice = this.currentNoticeIndex === undefined;
            const section = 'notices';
            
            
            // Show loading state
            const saveBtn = document.querySelector('.save-notice-btn');
            if (saveBtn) {
                saveBtn.disabled = true;
                saveBtn.innerHTML = '<i data-lucide="loader-2"></i> Saving...';
            }
            
            let response;
            if (isNewNotice) {
                // Create new notice
                response = await fetch('/api/content/events-content', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        section: section,
                        data: noticeData
                    })
                });
            } else {
                // Update existing notice
                response = await fetch(`/api/content/events-content/${this.currentNoticeData.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        section: section,
                        data: noticeData
                    })
                });
            }
            
            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    this.showNotification('success', isNewNotice ? 'Notice created successfully!' : 'Notice updated successfully!');
                    
                    // Return to notices list
                    setTimeout(() => {
                        this.backToNoticesList();
                    }, 1500);
                } else {
                    throw new Error(result.message || 'Failed to save notice');
                }
            } else {
                throw new Error('Network error occurred');
            }
        } catch (error) {
            console.error('Error saving notice:', error);
            this.showNotification('error', 'Failed to save notice. Please try again.');
        } finally {
            // Reset button state
            const saveBtn = document.querySelector('.save-notice-btn');
            if (saveBtn) {
                saveBtn.disabled = false;
                saveBtn.innerHTML = '<i data-lucide="save"></i> Save Changes';
            }
        }
    }

    /**
     * Get notice form data
     */
    getNoticeFormData() {
        return {
            title: document.getElementById('notice-title')?.value || '',
            category: document.getElementById('notice-category')?.value || '',
            imageUrl: document.getElementById('notice-image-url')?.value || '',
            date: document.getElementById('notice-date')?.value || '',
            priority: document.getElementById('notice-priority')?.value || '',
            audience: 'all', // Default audience
            validUntil: document.getElementById('notice-valid-until')?.value || '',
            description: document.getElementById('notice-description')?.value || '',
            additionalInfo: document.getElementById('notice-additional-info')?.value || ''
        };
    }

    /**
     * Delete notice item
     */
    async deleteNoticeItem(noticeItem) {
        const noticeIndex = noticeItem.dataset.index;
        const noticeId = noticeItem.dataset.noticeId;
        const noticeTitle = noticeItem.querySelector('.event-name')?.textContent || 'this notice';
        
        // Show delete confirmation modal
        if (window.DeleteConfirmationModal) {
            window.DeleteConfirmationModal.show({
                title: "Delete Notice",
                itemName: noticeTitle,
                itemType: "notice",
                warningText: "This action cannot be undone and will permanently remove the notice from the database.",
                onConfirm: async () => {
                    await this.performDeleteNotice(noticeId, noticeItem);
                },
                onCancel: () => {
                }
            });
        } else {
            // Fallback to browser confirm if modal not available
        if (!confirm('Are you sure you want to delete this notice? This action cannot be undone.')) {
            return;
            }
            await this.performDeleteNotice(noticeId, noticeItem);
        }
        }
        
    /**
     * Perform the actual notice deletion
     */
    async performDeleteNotice(noticeId, noticeItem) {
        try {
            // Show loading state
            const deleteBtn = noticeItem.querySelector('.delete-notice-btn');
            if (deleteBtn) {
                deleteBtn.disabled = true;
                deleteBtn.innerHTML = '<i data-lucide="loader-2"></i>';
            }
            
            // Get authentication token
            const token = localStorage.getItem('adminToken');
            if (!token) {
                this.showNotification('error', 'Authentication required. Please login again.');
                return;
            }
            
            // Delete the notice
            const response = await fetch(`/api/events/${noticeId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    this.showNotification('success', 'Notice deleted successfully!');
                    
                    // Remove the item from the DOM
                    noticeItem.remove();
                    
                    // Update item indices
                    this.updateItemOrder();
                    
                    // Check if we need to show empty state
                    const noticesContainer = document.getElementById('notices-list');
                    if (noticesContainer && noticesContainer.children.length === 0) {
                        const emptyState = document.getElementById('notices-empty-state');
                        if (emptyState) {
                            emptyState.style.display = 'block';
                        }
                    }
                } else {
                    throw new Error(result.message || 'Failed to delete notice');
                }
            } else {
                throw new Error('Network error occurred');
            }
        } catch (error) {
            console.error('Error deleting notice:', error);
            this.showNotification('error', 'Failed to delete notice. Please try again.');
        } finally {
            // Reset button state
            const deleteBtn = noticeItem.querySelector('.delete-notice-btn');
            if (deleteBtn) {
                deleteBtn.disabled = false;
                deleteBtn.innerHTML = '<i data-lucide="trash-2"></i>';
            }
        }
    }

    /**
     * Add new schedule item
     */
    addScheduleItem() {
        const scheduleContainer = document.querySelector('#schedule-items');
        if (!scheduleContainer) return;

        const currentItems = scheduleContainer.querySelectorAll('.schedule-item');
        const newIndex = currentItems.length;

        const scheduleItemHTML = `
            <div class="schedule-item" data-index="${newIndex}">
                <div class="item-header">
                    <span class="item-number">${newIndex + 1}</span>
                    <h5>Schedule Item ${newIndex + 1}</h5>
                    <button type="button" class="btn btn-sm btn-danger remove-schedule-item" title="Remove this schedule item">
                        <i data-lucide="trash-2"></i>
                    </button>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Time</label>
                        <input type="text" name="schedule-time" value="" placeholder="e.g., 10:00 AM" class="form-input">
                    </div>
                    <div class="form-group">
                        <label>Event Name</label>
                        <input type="text" name="schedule-event" value="" placeholder="Event name" class="form-input">
                    </div>
                    <div class="form-group">
                        <label>Icon</label>
                        <select name="schedule-icon" class="form-input">
                            <option value="celebration">🎉 Celebration</option>
                            <option value="slideshow">📊 Slideshow</option>
                            <option value="mic">🎤 Microphone</option>
                            <option value="emoji_events">🏆 Trophy</option>
                            <option value="schedule">⏰ Schedule</option>
                            <option value="group">👥 Group</option>
                        </select>
                    </div>
                </div>
            </div>
        `;

        scheduleContainer.insertAdjacentHTML('beforeend', scheduleItemHTML);
        this.updateScheduleNumbers();
        this.showNotification('success', 'Schedule item added successfully');
    }

    /**
     * Remove schedule item
     */
    removeScheduleItem(item) {
        if (confirm('Are you sure you want to remove this schedule item?')) {
            item.remove();
            this.updateScheduleNumbers();
            this.showNotification('success', 'Schedule item removed');
        }
    }

    /**
     * Update schedule item numbers
     */
    updateScheduleNumbers() {
        const scheduleItems = document.querySelectorAll('.schedule-item');
        scheduleItems.forEach((item, index) => {
            const numberSpan = item.querySelector('.item-number');
            const titleH5 = item.querySelector('h5');
            if (numberSpan) numberSpan.textContent = index + 1;
            if (titleH5) titleH5.textContent = `Schedule Item ${index + 1}`;
            item.setAttribute('data-index', index);
        });
    }

    /**
     * Add new guest item
     */
    addGuestItem() {
        const guestsContainer = document.querySelector('#guests-items');
        if (!guestsContainer) return;

        const currentItems = guestsContainer.querySelectorAll('.guest-item');
        const newIndex = currentItems.length;

        const guestItemHTML = `
            <div class="guest-item" data-index="${newIndex}">
                <div class="item-header">
                    <span class="item-number">${newIndex + 1}</span>
                    <h5>Guest ${newIndex + 1}</h5>
                    <button type="button" class="btn btn-sm btn-danger remove-guest-item" title="Remove this guest">
                        <i data-lucide="trash-2"></i>
                    </button>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Guest Name</label>
                        <input type="text" name="guest-name" value="" placeholder="Guest name" class="form-input">
                    </div>
                    <div class="form-group">
                        <label>Role/Title</label>
                        <input type="text" name="guest-role" value="" placeholder="e.g., Keynote Speaker, Judge, Performer" class="form-input">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Avatar Image URL</label>
                        <input type="url" name="guest-avatar" value="" placeholder="https://example.com/avatar.jpg" class="form-input">
                    </div>
                </div>
            </div>
        `;

        guestsContainer.insertAdjacentHTML('beforeend', guestItemHTML);
        this.updateGuestNumbers();
        this.showNotification('success', 'Guest added successfully');
    }

    /**
     * Remove guest item
     */
    removeGuestItem(item) {
        if (confirm('Are you sure you want to remove this guest?')) {
            item.remove();
            this.updateGuestNumbers();
            this.showNotification('success', 'Guest removed');
        }
    }

    /**
     * Update guest item numbers
     */
    updateGuestNumbers() {
        const guestItems = document.querySelectorAll('.guest-item');
        guestItems.forEach((item, index) => {
            const numberSpan = item.querySelector('.item-number');
            const titleH5 = item.querySelector('h5');
            if (numberSpan) numberSpan.textContent = index + 1;
            if (titleH5) titleH5.textContent = `Guest ${index + 1}`;
            item.setAttribute('data-index', index);
        });
    }

    /**
     * Handle image upload
     */
    handleImageUpload(event, type) {
        const file = event.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            this.showNotification('error', 'Please select a valid image file');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const imageUrl = e.target.result;
            this.updateImagePreviewByType(type, imageUrl);
            this.showNotification('success', 'Image uploaded successfully');
        };
        reader.readAsDataURL(file);
    }

    /**
     * Update image preview by type
     */
    updateImagePreviewByType(type, imageUrl) {
        const previewContainer = document.querySelector(`#${type}-image-upload`).closest('.image-upload-container').querySelector('.image-upload-preview');
        if (previewContainer) {
            previewContainer.innerHTML = `<img src="${imageUrl}" alt="${type} image" style="width: 200px; height: 150px; object-fit: cover; border-radius: 8px; border: 1px solid #e5e7eb;">`;
        }
    }

    /**
     * Setup drag and drop functionality
     */
    setupDragAndDrop(itemClass) {
        const container = document.querySelector(`#${itemClass.replace('-item', '')}-items`);
        if (!container) return;

        let draggedElement = null;
        let draggedIndex = null;

        // Handle drag start from drag handle
        container.addEventListener('dragstart', (e) => {
            const dragHandle = e.target.closest('.btn-drag');
            if (dragHandle) {
                const item = dragHandle.closest(`.${itemClass}`);
                if (item) {
                    draggedElement = item;
                    draggedIndex = Array.from(container.children).indexOf(item);
                    item.classList.add('dragging');
                    e.dataTransfer.effectAllowed = 'move';
                    e.dataTransfer.setData('text/plain', draggedIndex.toString());
                }
            }
        });

        // Handle drag end
        container.addEventListener('dragend', (e) => {
            if (draggedElement) {
                draggedElement.classList.remove('dragging');
                draggedElement = null;
                draggedIndex = null;
            }
        });

        // Handle drag over
        container.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        });

        // Handle drag enter
        container.addEventListener('dragenter', (e) => {
            e.preventDefault();
        });

        // Handle drop
        container.addEventListener('drop', (e) => {
            e.preventDefault();
            
            if (!draggedElement) return;

            const dropY = e.clientY;
            const afterElement = this.getDragAfterElement(container, dropY, draggedElement);
            
            if (afterElement) {
                container.insertBefore(draggedElement, afterElement);
            } else {
                container.appendChild(draggedElement);
            }

            // Update item numbers and show success message
            this.updateItemNumbers(itemClass);
            this.showNotification('success', 'Items reordered successfully');
        });

        // Prevent drag on form inputs
        container.addEventListener('dragstart', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
                e.preventDefault();
            }
        });
    }

    /**
     * Get drag after element
     */
    getDragAfterElement(container, y, draggedElement) {
        const draggableElements = [...container.querySelectorAll('.schedule-item, .guest-item')];
        
        return draggableElements.reduce((closest, child) => {
            if (child === draggedElement) return closest;
            
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    /**
     * Setup keyboard shortcuts
     */
    setupKeyboardShortcuts(type) {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'n':
                        e.preventDefault();
                        if (type === 'schedule') {
                            this.addScheduleItem();
                        } else if (type === 'guest') {
                            this.addGuestItem();
                        }
                        break;
                    case 'Delete':
                    case 'Backspace':
                        e.preventDefault();
                        const activeElement = document.activeElement;
                        const item = activeElement.closest('.schedule-item, .guest-item');
                        if (item) {
                            if (type === 'schedule' && item.classList.contains('schedule-item')) {
                                this.removeScheduleItem(item);
                            } else if (type === 'guest' && item.classList.contains('guest-item')) {
                                this.removeGuestItem(item);
                            }
                        }
                        break;
                }
            }
        });
    }

    /**
     * Update item numbers after reordering
     */
    updateItemNumbers(itemClass) {
        const items = document.querySelectorAll(`.${itemClass}`);
        items.forEach((item, index) => {
            const titleSpan = item.querySelector('.item-header-content span');
            const titleH5 = item.querySelector('.item-header-content h5');
            if (titleSpan) {
                const type = itemClass.includes('schedule') ? 'Schedule Item' : 'Guest';
                titleSpan.textContent = `${type} ${index + 1}`;
            }
            if (titleH5) {
                const type = itemClass.includes('schedule') ? 'Schedule Item' : 'Guest';
                titleH5.textContent = `${type} ${index + 1}`;
            }
            item.setAttribute('data-index', index);
        });
    }

    /**
     * Add schedule item silently (without success notification) - used for populating existing data
     */
    addScheduleItemSilently() {
        const scheduleContainer = document.querySelector('#schedule-items');
        if (!scheduleContainer) return;

        const currentItems = scheduleContainer.querySelectorAll('.schedule-item');
        const newIndex = currentItems.length;

        const scheduleItemHTML = `
            <div class="schedule-item" data-index="${newIndex}" draggable="true">
                <div class="item-header">
                    <div class="item-header-content">
                        <button type="button" class="btn-drag" title="Drag to reorder">
                            <i data-lucide="grip-vertical"></i>
                        </button>
                        <span>Schedule Item ${newIndex + 1}</span>
                    </div>
                    <div class="item-actions">
                        <button type="button" class="btn btn-sm btn-danger remove-schedule-item" title="Remove this schedule item">
                            <i data-lucide="trash-2"></i>
                        </button>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Time</label>
                        <input type="text" name="schedule-time" value="" placeholder="e.g., 10:00 AM" class="form-input">
                    </div>
                    <div class="form-group">
                        <label>Event Name</label>
                        <input type="text" name="schedule-event" value="" placeholder="Event name" class="form-input">
                    </div>
                    <div class="form-group">
                        <label>Icon</label>
                        <select name="schedule-icon" class="form-input">
                            <option value="celebration">🎉 Celebration</option>
                            <option value="slideshow">📊 Slideshow</option>
                            <option value="mic">🎤 Microphone</option>
                            <option value="emoji_events">🏆 Trophy</option>
                            <option value="schedule">⏰ Schedule</option>
                            <option value="group">👥 Group</option>
                        </select>
                    </div>
                </div>
            </div>
        `;

        scheduleContainer.insertAdjacentHTML('beforeend', scheduleItemHTML);
        this.updateScheduleNumbers();
        
        // Re-initialize Lucide icons for the new item
        const newItem = scheduleContainer.lastElementChild;
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    /**
     * Enhanced add schedule item with animation
     */
    addScheduleItem() {
        const scheduleContainer = document.querySelector('#schedule-items');
        if (!scheduleContainer) return;

        const currentItems = scheduleContainer.querySelectorAll('.schedule-item');
        const newIndex = currentItems.length;

        const scheduleItemHTML = `
            <div class="schedule-item" data-index="${newIndex}" draggable="true">
                <div class="item-header">
                    <div class="item-header-content">
                        <button type="button" class="btn-drag" title="Drag to reorder">
                            <i data-lucide="grip-vertical"></i>
                        </button>
                        <span>Schedule Item ${newIndex + 1}</span>
                    </div>
                    <div class="item-actions">
                        <button type="button" class="btn btn-sm btn-danger remove-schedule-item" title="Remove this schedule item">
                            <i data-lucide="trash-2"></i>
                        </button>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Time</label>
                        <input type="text" name="schedule-time" value="" placeholder="e.g., 10:00 AM" class="form-input">
                    </div>
                    <div class="form-group">
                        <label>Event Name</label>
                        <input type="text" name="schedule-event" value="" placeholder="Event name" class="form-input">
                    </div>
                    <div class="form-group">
                        <label>Icon</label>
                        <select name="schedule-icon" class="form-input">
                            <option value="celebration">🎉 Celebration</option>
                            <option value="slideshow">📊 Slideshow</option>
                            <option value="mic">🎤 Microphone</option>
                            <option value="emoji_events">🏆 Trophy</option>
                            <option value="schedule">⏰ Schedule</option>
                            <option value="group">👥 Group</option>
                        </select>
                    </div>
                </div>
            </div>
        `;

        scheduleContainer.insertAdjacentHTML('beforeend', scheduleItemHTML);
        this.updateScheduleNumbers();
        this.showNotification('success', 'Schedule item added successfully');
        
        // Re-initialize Lucide icons for the new item
        const newItem = scheduleContainer.lastElementChild;
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        // Focus on the first input of the new item
        const firstInput = newItem.querySelector('input');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }
    }

    /**
     * Add guest item silently (without success notification) - used for populating existing data
     */
    addGuestItemSilently() {
        const guestsContainer = document.querySelector('#guests-items');
        if (!guestsContainer) return;

        const currentItems = guestsContainer.querySelectorAll('.guest-item');
        const newIndex = currentItems.length;

        const guestItemHTML = `
            <div class="guest-item" data-index="${newIndex}" draggable="true">
                <div class="item-header">
                    <div class="item-header-content">
                        <button type="button" class="btn-drag" title="Drag to reorder">
                            <i data-lucide="grip-vertical"></i>
                        </button>
                        <h5>Guest ${newIndex + 1}</h5>
                    </div>
                    <div class="item-actions">
                        <button type="button" class="btn btn-sm btn-danger remove-guest-item" title="Remove this guest">
                            <i data-lucide="trash-2"></i>
                        </button>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Guest Name</label>
                        <input type="text" name="guest-name" value="" placeholder="Guest name" class="form-input">
                    </div>
                    <div class="form-group">
                        <label>Role/Title</label>
                        <input type="text" name="guest-role" value="" placeholder="e.g., Keynote Speaker, Judge, Performer" class="form-input">
                    </div>
                    <div class="form-group">
                        <label>Avatar Image URL</label>
                        <input type="url" name="guest-avatar" value="" placeholder="https://example.com/avatar.jpg" class="form-input">
                    </div>
                </div>
            </div>
        `;

        guestsContainer.insertAdjacentHTML('beforeend', guestItemHTML);
        this.updateGuestNumbers();
        
        // Re-initialize Lucide icons for the new item
        const newItem = guestsContainer.lastElementChild;
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    /**
     * Enhanced add guest item with animation
     */
    addGuestItem() {
        const guestsContainer = document.querySelector('#guests-items');
        if (!guestsContainer) return;

        const currentItems = guestsContainer.querySelectorAll('.guest-item');
        const newIndex = currentItems.length;

        const guestItemHTML = `
            <div class="guest-item" data-index="${newIndex}" draggable="true">
                <div class="item-header">
                    <div class="item-header-content">
                        <button type="button" class="btn-drag" title="Drag to reorder">
                            <i data-lucide="grip-vertical"></i>
                        </button>
                        <h5>Guest ${newIndex + 1}</h5>
                    </div>
                    <div class="item-actions">
                        <button type="button" class="btn btn-sm btn-danger remove-guest-item" title="Remove this guest">
                            <i data-lucide="trash-2"></i>
                        </button>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Guest Name</label>
                        <input type="text" name="guest-name" value="" placeholder="Guest name" class="form-input">
                    </div>
                    <div class="form-group">
                        <label>Role/Title</label>
                        <input type="text" name="guest-role" value="" placeholder="e.g., Keynote Speaker, Judge, Performer" class="form-input">
                    </div>
                    <div class="form-group">
                        <label>Avatar Image URL</label>
                        <input type="url" name="guest-avatar" value="" placeholder="https://example.com/avatar.jpg" class="form-input">
                    </div>
                </div>
            </div>
        `;

        guestsContainer.insertAdjacentHTML('beforeend', guestItemHTML);
        this.updateGuestNumbers();
        this.showNotification('success', 'Guest added successfully');
        
        // Re-initialize Lucide icons for the new item
        const newItem = guestsContainer.lastElementChild;
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        // Focus on the first input of the new item
        const firstInput = newItem.querySelector('input');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }
    }

    /**
     * Back to events list
     */
    backToEventsList() {
        
        // Clear add event context if it exists
        if (this.currentAddEventSection !== undefined) {
            this.currentAddEventSection = undefined;
        }
        
        // Clear current event data if it exists
        if (this.currentEventData !== undefined) {
            this.currentEventData = undefined;
            this.currentEventIndex = undefined;
        }
        
        // Check if we're already in the events content management interface
        const pageContent = document.getElementById('pageContent');
        const isInEventsManagement = pageContent && pageContent.innerHTML.includes('events-content-section');
        
        if (isInEventsManagement) {
            // We're already in events management, just load the specific section
            let targetSection = this.currentSection || 'upcoming_events';
            this.loadSection(targetSection);
        } else {
            // We're not in events management, need to load the events content first
            this.loadEventsContent().then(() => {
                // After loading events content, load the specific section
                let targetSection = this.currentSection || 'upcoming_events';
                this.loadSection(targetSection);
            });
        }
    }

    /**
     * Back to notices list
     */
    backToNoticesList() {
        
        // Clear current notice data if it exists
        if (this.currentNoticeData !== undefined) {
            this.currentNoticeData = undefined;
            this.currentNoticeId = undefined;
            this.currentNoticeIndex = undefined;
        }
        
        // Check if we're already in the events content management interface
        const pageContent = document.getElementById('pageContent');
        const isInEventsManagement = pageContent && pageContent.innerHTML.includes('events-content-section');
        
        if (isInEventsManagement) {
            // We're already in events management, just load the notices section
            this.loadSection('notices');
        } else {
            // We're not in events management, need to load the events content first
            this.loadEventsContent().then(() => {
                // After loading events content, load the notices section
                this.loadSection('notices');
            });
        }
    }

    /**
     * Show add event modal (now redirects to dynamic content)
     */
    showAddEventModal() {
        console.trace('⚠️ Call stack for showAddEventModal:');
        
        // Prevent modal from opening if we're currently initializing the section
        if (this.isInitializingEventsSection) {
            console.warn('🚫 BLOCKED: Prevented modal from opening during section initialization');
            return;
        }
        
        // Call openAddEvent instead of showing modal
        this.openAddEvent();
    }

    /**
     * Show add notice modal
     */
    showAddNoticeModal() {
        this.openAddNotice();
    }

    /**
     * Open add notice editor
     */
    openAddNotice() {
        // Get current section for navigation
        this.currentSection = this.getCurrentSection();
        
        // Get the add notice editor HTML
        const addNoticeHTML = this.getAddNoticeEditor(this.currentSection);
        
        // Update the page content
        const pageContent = document.getElementById('pageContent');
        if (pageContent) {
            pageContent.innerHTML = addNoticeHTML;
            
            // Reinitialize Lucide icons
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
            
            // Store current section for saving
            this.currentAddNoticeSection = this.currentSection;
            
            // Add direct event listener for the back button in this specific context
            const backButton = pageContent.querySelector('.back-button');
            if (backButton) {
                backButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation(); // Prevent global handler from firing
                    this.backToNoticesList();
                });
            }
            
            // Initialize notice editor functionality
            this.initializeNoticeEditor();
        }
    }

    /**
     * Get add notice editor HTML
     */
    getAddNoticeEditor(section) {
        const breadcrumb = this.getBreadcrumbHTML(section, 'Add New Notice');
        
        return `
            ${breadcrumb}
            <div class="notice-detail-editor">
                <div class="editor-header">
                    <h3>Add New Notice</h3>
                    <p class="editor-subtitle">Create a new notice to inform students and parents</p>
                </div>
                
                <form class="notice-form" id="add-notice-form">
                    <!-- Notice Header Section -->
                    <div class="form-section">
                        <h4>Notice Header</h4>
                        
                        <div class="form-group">
                            <label><span class="required">*</span> Notice Title</label>
                            <input type="text" id="notice-title" placeholder="Enter notice title" class="form-input" required>
                            <small class="form-help">This will be displayed as the main heading on the notice details page</small>
                        </div>
                        
                        <div class="form-row">
                        <div class="form-group">
                                <label><span class="required">*</span> Category</label>
                                <select id="notice-category" class="form-input" required>
                                    <option value="">Select Category</option>
                                    ${NOTICE_CATEGORIES.map(cat => 
                                        `<option value="${cat.value}">${cat.icon} ${cat.label}</option>`
                                    ).join('')}
                            </select>
                            <small class="form-help">Choose the most appropriate category for this notice</small>
                        </div>
                        
                        <div class="form-group">
                                <label>Author Name</label>
                                <input type="text" id="notice-author" placeholder="e.g., Principal, Administration" class="form-input">
                                <small class="form-help">Leave empty to use default</small>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label>Header Image <span class="optional">(Optional)</span></label>
                            <div id="notice-image-upload-container">
                                <!-- ImageUpload component will be inserted here -->
                            </div>
                            <small class="form-help">Upload an image for the notice header (recommended: 1200x600px)</small>
                        </div>
                    </div>
                    
                    <!-- Notice Content Section -->
                    <div class="form-section">
                        <h4>Notice Content</h4>
                        
                        <div class="form-group full-width">
                            <label><span class="required">*</span> Notice Description</label>
                            <textarea id="notice-content" rows="6" placeholder="Enter the full notice description..." class="form-textarea" required></textarea>
                            <small class="form-help">Provide complete details about the notice</small>
                        </div>
                        </div>
                        
                    <!-- Notice Highlights (Optional) -->
                    <div class="form-section">
                        <div class="section-header-with-btn">
                            <div>
                                <h4>Notice Highlights <span class="optional">(Optional)</span></h4>
                                <small class="form-help">Add key points or important highlights</small>
                            </div>
                            <button type="button" class="btn btn-sm btn-secondary" id="add-highlight-btn">
                                <i data-lucide="plus"></i> Add Highlight
                            </button>
                        </div>
                        
                        <div id="highlights-container" class="highlights-list">
                            <!-- Highlights will be added here -->
                        </div>
                    </div>
                    
                    <!-- Meta Information -->
                    <div class="form-section">
                        <h4>Additional Information</h4>
                        
                        <div class="form-row">
                        <div class="form-group">
                                <label>Publish Date</label>
                            <input type="date" id="notice-date" class="form-input">
                                <small class="form-help">Leave empty to use today's date</small>
                        </div>
                        
                        <div class="form-group">
                            <label>Valid Until</label>
                            <input type="date" id="notice-valid-until" class="form-input">
                                <small class="form-help">Optional expiry date</small>
                            </div>
                        </div>
                        
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" class="btn btn-secondary back-button" data-action="back-to-section-list">
                            <i data-lucide="arrow-left"></i>
                            Back
                        </button>
                        <div id="notice-save-button-container">
                            <!-- SaveButton will be initialized here -->
                        </div>
                    </div>
                </form>
            </div>
        `;
    }

    /**
     * Back to notices list
     */
    backToNoticesList() {
        // Reload the entire events content section to restore the notices list
        this.currentSection = 'notices';
        this.loadEventsContent();
    }

    /**
     * Initialize notice editor functionality
     */
    initializeNoticeEditor() {
        const form = document.getElementById('add-notice-form');
        if (!form) return;

        // Initialize highlights functionality
        this.noticeHighlights = [];
        this.setupNoticeHighlights();

        // Initialize image upload
        this.initializeNoticeImageUpload();

        // Initialize SaveButton
        this.initializeNoticeSaveButton();
    }

    /**
     * Initialize notice image upload
     */
    initializeNoticeImageUpload() {
        const container = document.getElementById('notice-image-upload-container');
        if (!container) {
            console.error('❌ Notice image upload container not found');
            return;
        }

        // Create ImageUpload component HTML
        const imageUploadHTML = window.ImageUpload.createHTML({
            fileInputId: 'notice-image-file',
            urlInputId: 'notice-image-url',
            selectBtnId: 'notice-select-image-btn',
            previewContainerId: 'notice-image-preview-container',
            previewImgId: 'notice-image-preview',
            removeBtnId: 'notice-image-remove-btn',
            labelText: ''
        });

        container.innerHTML = imageUploadHTML;

        // Initialize ImageUpload instance
        this.noticeImageUpload = new window.ImageUpload({
            fileInputId: 'notice-image-file',
            urlInputId: 'notice-image-url',
            selectBtnId: 'notice-select-image-btn',
            previewContainerId: 'notice-image-preview-container',
            previewImgId: 'notice-image-preview',
            removeBtnId: 'notice-image-remove-btn',
            uploadFolder: 'marigold-school/notices',
            autoUpload: false // Don't auto-upload, we'll upload manually in saveNoticeWithValidation
        });

        // Initialize the component (sets up event listeners)
        this.noticeImageUpload.init();

    }

    /**
     * Initialize notice save button
     */
    initializeNoticeSaveButton() {
        const container = document.getElementById('notice-save-button-container');
        if (!container) {
            console.error('❌ Save button container not found');
            return;
        }


        // Create the button element
        const saveButton = document.createElement('button');
        saveButton.type = 'button';
        saveButton.className = 'btn btn-primary save-notice-btn';
        container.appendChild(saveButton);

        // Initialize SaveButton component
        this.noticeSaveButton = new SaveButton({
            target: saveButton,
            text: 'Save Notice',
            icon: 'save',
            hasImages: true,
            messages: {
                preparing: 'Preparing notice...',
                collecting: 'Uploading image...',
                saving: 'Saving to database...',
                success: 'Notice saved!'
            },
            percentages: {
                collecting: 50,
                saving: 75,
                success: 100
            },
            onSave: async () => {
                return await this.saveNoticeWithValidation();
            },
            onSuccess: () => {
                this.showNotification('success', 'Notice created successfully!');
                setTimeout(() => {
                    this.backToNoticesList();
                }, 1500);
            },
            onError: (error) => {
                console.error('❌ Error saving notice:', error);
                this.showNotification('error', `Failed to save notice: ${error.message}`);
            }
        });

    }

    /**
     * Setup notice highlights functionality
     */
    setupNoticeHighlights() {
        const addHighlightBtn = document.getElementById('add-highlight-btn');
        if (!addHighlightBtn) return;

        addHighlightBtn.addEventListener('click', () => {
            this.addNoticeHighlight();
        });
    }

    /**
     * Add a new notice highlight
     */
    addNoticeHighlight() {
        const container = document.getElementById('highlights-container');
        if (!container) return;

        const index = this.noticeHighlights.length;
        const highlightHtml = `
            <div class="highlight-item" data-index="${index}">
                <div class="highlight-input-group">
                    <input type="text" 
                           class="form-input" 
                           placeholder="Enter highlight text" 
                           data-highlight-index="${index}">
                    <button type="button" 
                            class="btn btn-sm btn-danger remove-highlight-btn" 
                            data-index="${index}">
                        <i data-lucide="trash-2"></i>
                    </button>
                </div>
            </div>
        `;

        container.insertAdjacentHTML('beforeend', highlightHtml);
        this.noticeHighlights.push('');

        // Reinitialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        // Add event listeners
        const highlightInput = container.querySelector(`input[data-highlight-index="${index}"]`);
        if (highlightInput) {
            highlightInput.addEventListener('input', (e) => {
                this.noticeHighlights[index] = e.target.value;
            });
        }

        const removeBtn = container.querySelector(`.remove-highlight-btn[data-index="${index}"]`);
        if (removeBtn) {
            removeBtn.addEventListener('click', () => {
                this.removeNoticeHighlight(index);
            });
        }
    }

    /**
     * Remove a notice highlight
     */
    removeNoticeHighlight(index) {
        const container = document.getElementById('highlights-container');
        if (!container) return;

        const highlightItem = container.querySelector(`.highlight-item[data-index="${index}"]`);
        if (highlightItem) {
            highlightItem.remove();
            this.noticeHighlights.splice(index, 1);
            
            // Re-index remaining highlights
            const remainingItems = container.querySelectorAll('.highlight-item');
            remainingItems.forEach((item, newIndex) => {
                item.setAttribute('data-index', newIndex);
                const input = item.querySelector('input');
                const btn = item.querySelector('.remove-highlight-btn');
                if (input) input.setAttribute('data-highlight-index', newIndex);
                if (btn) btn.setAttribute('data-index', newIndex);
            });
        }
    }

    /**
     * Setup notices search and filter functionality
     */
    setupNoticesSearchAndFilter() {
        // Search functionality
        const searchInput = document.getElementById('notices-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase();
                this.filterNotices(searchTerm);
            });
        }


        // Clear search button functionality
        document.addEventListener('click', (e) => {
            if (e.target.closest('.clear-notice-search-btn')) {
                e.preventDefault();
                const searchInput = document.getElementById('notices-search');
                if (searchInput) {
                    searchInput.value = '';
                    this.filterNotices('');
                } else {
                }
            }
        });

    }

    /**
     * Setup highlights form handlers
     */
    async setupHighlightsFormHandlers() {
        
        // Populate past events in the select dropdown first
        await this.populatePastEventsDropdown();
        
        // Event selection handler
        const eventSelect = document.getElementById('highlight-event');
        if (eventSelect) {
            eventSelect.addEventListener('change', (e) => {
                const selectedEventId = e.target.value;
                if (selectedEventId) {
                    this.autoFillHighlightForm(selectedEventId, true); // Show notification for manual selection
                } else {
                    this.clearHighlightForm();
                }
            });
        }
        

        // Initialize SaveButton for highlights
        this.initializeHighlightsSaveButton();
    }

    /**
     * Populate past events dropdown
     */
    async populatePastEventsDropdown() {
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                console.error('No authentication token found');
                return;
            }

            const response = await fetch('/api/content/events-content?section=past_events', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch past events');
            }

            const result = await response.json();
            const pastEvents = result.data || [];


            // Store events for auto-filling
            this.highlightEvents = pastEvents;

            const eventSelect = document.getElementById('highlight-event');
            if (eventSelect) {
                // Clear existing options except the first one
                eventSelect.innerHTML = '<option value="">Select an event to auto-fill the form...</option>';
                
                // Add past events to dropdown
                pastEvents.forEach(event => {
                    const option = document.createElement('option');
                    option.value = event.id;
                    option.textContent = event.title || 'Untitled Event';
                    eventSelect.appendChild(option);
                });
                
                
                // Store events for later use
                this.highlightEvents = pastEvents;
                
                // Check if there's a current selection to restore
                this.restoreCurrentSelection();
            }
        } catch (error) {
            console.error('Error populating past events dropdown:', error);
            this.showNotification('error', 'Failed to load past events');
        }
    }

    /**
     * Auto-fill highlight form with selected event data
     */
    async autoFillHighlightForm(eventId, showNotification = false) {
        try {
            
            // If events are not loaded yet, wait a bit and try again
            if (!this.highlightEvents || this.highlightEvents.length === 0) {
                await new Promise(resolve => setTimeout(resolve, 100));
                
                // Try to get events again
                if (!this.highlightEvents || this.highlightEvents.length === 0) {
                    console.warn('Events still not loaded after waiting');
                    if (showNotification) {
                        this.showNotification('warning', 'Events not loaded yet');
                    }
                    return;
                }
            }
            
            // Find the event in the already loaded events
            const event = this.highlightEvents?.find(e => e.id === eventId);
            
            
            if (event) {
                // Fill form fields
                const badgeField = document.getElementById('highlight-badge');
                const titleField = document.getElementById('highlight-title');
                const descriptionField = document.getElementById('highlight-description');
                
                if (badgeField) {
                    badgeField.value = event.category || '';
                }
                if (titleField) {
                    titleField.value = event.title || '';
                }
                if (descriptionField) {
                    descriptionField.value = event.description || '';
                }

                // Show event image preview
                this.showEventImagePreview(event.imageUrl || event.image_url);

                
                // Show notification only if requested (for manual selection)
                if (showNotification) {
                    this.showNotification('success', `Form auto-filled with: ${event.title}`);
                }
            } else {
                console.warn('Event not found in loaded events:', eventId);
                console.warn('Available event IDs:', this.highlightEvents?.map(e => e.id));
                
                // Only show notification for manual selections, not on page load
                if (showNotification) {
                    this.showNotification('warning', 'Event data not found');
                }
            }
        } catch (error) {
            console.error('Error auto-filling highlight form:', error);
            this.showNotification('error', 'Failed to load event data');
        }
    }

    /**
     * Show event image preview
     */
    showEventImagePreview(imageUrl) {
        const previewContainer = document.getElementById('highlight-image-preview');
        const noImageContainer = document.getElementById('highlight-no-image');
        const previewImage = document.getElementById('highlight-preview-image');

        if (imageUrl && imageUrl.trim() !== '' && !imageUrl.startsWith('linear-gradient')) {
            if (previewImage) {
                previewImage.src = imageUrl;
                previewImage.alt = 'Event image preview';
            }
            if (previewContainer) previewContainer.style.display = 'block';
            if (noImageContainer) noImageContainer.style.display = 'none';
        } else {
            if (previewContainer) previewContainer.style.display = 'none';
            if (noImageContainer) noImageContainer.style.display = 'block';
        }
    }

    /**
     * Restore current selection from saved data
     */
    restoreCurrentSelection() {
        
        // Get the current highlights data to find the selected event
        const highlightsData = this.currentSectionData?.highlights;
        if (highlightsData && highlightsData.length > 0) {
            const highlight = highlightsData[0];
            let eventId = null;
            
            // Try to get eventId from metadata
            if (highlight.metadata) {
                try {
                    const metadata = JSON.parse(highlight.metadata);
                    eventId = metadata.eventId;
                } catch (error) {
                    console.error('Error parsing metadata:', error);
                }
            }
            
            if (eventId) {
                const eventSelect = document.getElementById('highlight-event');
                if (eventSelect) {
                    // Set the dropdown value
                    eventSelect.value = eventId;
                    
                    // Find the selected option and show info
                    const selectedOption = eventSelect.querySelector(`option[value="${eventId}"]`);
                    if (selectedOption) {
                        
                        // Auto-fill the form with the selected event data (no notification on load)
                        this.autoFillHighlightForm(eventId, false);
                    } else {
                    }
                }
            } else {
            }
        } else {
        }
    }

    /**
     * Show current selection info
     */
    showCurrentSelection(eventId, eventName) {
        
        // Add visual indicators to the select element
        const eventSelect = document.getElementById('highlight-event');
        if (eventSelect) {
            // Add a visual indicator to the select element
            eventSelect.style.borderColor = '#10b981';
            eventSelect.style.backgroundColor = '#f0fdf4';
        }
    }

    /**
     * Clear highlight form
     */
    clearHighlightForm() {
        const badgeField = document.getElementById('highlight-badge');
        const titleField = document.getElementById('highlight-title');
        const descriptionField = document.getElementById('highlight-description');
        const eventSelect = document.getElementById('highlight-event');
        
        if (badgeField) badgeField.value = '';
        if (titleField) titleField.value = '';
        if (descriptionField) descriptionField.value = '';
        if (eventSelect) {
            eventSelect.value = '';
            // Reset visual indicators
            eventSelect.style.borderColor = '';
            eventSelect.style.backgroundColor = '';
        }

        // Hide image preview
        const previewContainer = document.getElementById('highlight-image-preview');
        const noImageContainer = document.getElementById('highlight-no-image');
        if (previewContainer) previewContainer.style.display = 'none';
        if (noImageContainer) noImageContainer.style.display = 'block';
    }

    /**
     * Initialize SaveButton for highlights
     */
    initializeHighlightsSaveButton() {
        const container = document.getElementById('save-button-container');
        if (!container) {
            console.error('❌ Save button container not found for highlights');
            return;
        }

        // Create a button element first
        const saveButton = document.createElement('button');
        saveButton.className = 'btn btn-primary save-highlight-btn';
        saveButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="save" class="lucide lucide-save"><path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"></path><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"></path><path d="M7 3v4a1 1 0 0 0 1 1h7"></path></svg> Save Highlights';
        container.appendChild(saveButton);

        this.highlightsSaveButton = new SaveButton({
            target: saveButton,
            text: 'Save Highlights',
            hasImages: false,
            percentages: {
                collecting: 30,
                saving: 90
            },
            onSave: async () => {
                
                // Collect form data
                const highlightData = this.collectHighlightsData();
                
                // Save to server
                const result = await this.saveHighlightsToServer(highlightData);
                
                return result;
            },
            onSuccess: (result) => {
                this.showNotification('success', 'Highlights updated successfully!');
                
                // Navigate back to section list after successful save
                setTimeout(() => {
                    this.showSectionList();
                }, 1500); // Wait 1.5 seconds to show success message
            },
            onError: (error) => {
                console.error('❌ Failed to save highlights:', error);
                this.showNotification('error', 'Failed to save highlights. Please try again.');
            }
        });

    }

    /**
     * Collect highlights form data
     */
    collectHighlightsData() {
        const eventSelect = document.getElementById('highlight-event');
        const badgeField = document.getElementById('highlight-badge');
        const titleField = document.getElementById('highlight-title');
        const descriptionField = document.getElementById('highlight-description');

        // Get image URL from preview image or existing data
        let imageUrl = '';
        
        // First, try to get image URL from the preview image
        const previewImage = document.getElementById('highlight-preview-image');
        
        if (previewImage && previewImage.src && previewImage.src !== '' && !previewImage.src.includes('data:image')) {
            imageUrl = previewImage.src;
        } else {
            // Fallback to existing image URL from current section data
            if (this.currentSectionData && this.currentSectionData.highlights) {
                const highlightData = this.currentSectionData.highlights.find(item => item.key === 'main_highlight');
                if (highlightData && highlightData.imageUrl && highlightData.imageUrl !== 'null' && highlightData.imageUrl.trim() !== '') {
                    imageUrl = highlightData.imageUrl;
                }
            }
        }
        

        const data = {
            eventId: eventSelect?.value || '',
            badge: badgeField?.value || '',
            title: titleField?.value || '',
            description: descriptionField?.value || '',
            imageUrl: imageUrl
        };


        return data;
    }

    /**
     * Save highlights to server
     */
    async saveHighlightsToServer(highlightData) {
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                throw new Error('Authentication required');
            }


            // Save highlights data to database
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
            
            const response = await fetch('/api/content/events-content', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    section: 'highlights',
                    data: {
                        key: 'main_highlight',
                        title: highlightData.title,
                        content: highlightData.description,
                        description: highlightData.badge,
                        imageUrl: highlightData.imageUrl,
                        metadata: JSON.stringify({
                            eventId: highlightData.eventId
                        })
                    }
                }),
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);


            if (!response.ok) {
                const errorData = await response.json();
                console.error('❌ Server error response:', errorData);
                throw new Error(errorData.error || 'Failed to save highlights');
            }

            const result = await response.json();

            return result;

        } catch (error) {
            if (error.name === 'AbortError') {
                console.error('❌ Request timed out after 10 seconds');
                throw new Error('Request timed out. Please try again.');
            } else {
                console.error('❌ Error saving highlights:', error);
                throw error;
            }
        }
    }

    /**
     * Filter notices by search term
     */
    filterNotices(searchTerm) {
        const notices = document.querySelectorAll('.notice-card');
        const term = searchTerm.toLowerCase().trim();
        
        if (!term) {
            notices.forEach(notice => {
                notice.style.display = 'block';
            });
            return;
        }
        
        let visibleCount = 0;
        notices.forEach(notice => {
            const title = notice.querySelector('.event-name')?.textContent.toLowerCase() || '';
            const description = notice.querySelector('.event-description')?.textContent.toLowerCase() || '';
            const category = notice.querySelector('.event-category')?.textContent.toLowerCase() || '';
            const audience = notice.querySelector('.notice-audience')?.textContent.toLowerCase() || '';
            
            const searchableText = [title, description, category, audience].join(' ');
            
            if (searchableText.includes(term)) {
                notice.style.display = 'block';
                visibleCount++;
            } else {
                notice.style.display = 'none';
            }
        });
        
        // Show/hide empty state based on results
        const emptyState = document.getElementById('notices-empty-state');
        if (emptyState) {
            if (visibleCount === 0 && term) {
                emptyState.style.display = 'block';
                emptyState.innerHTML = `
                    <div class="empty-icon">
                        <i data-lucide="search"></i>
                    </div>
                    <h4>No notices found</h4>
                    <p>No notices match your search "${searchTerm}"</p>
                    <button class="btn btn-outline clear-notice-search-btn">
                        Clear search
                    </button>
                `;
                // Re-initialize Lucide icons for the new content
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
            } else {
                emptyState.style.display = 'none';
            }
        }
    }



    /**
     * Clear highlight form
     */
    clearHighlightForm() {
        const form = document.querySelector('.section-editor-form');
        if (form) {
            form.reset();
        }
    }

    /**
     * Save notice with validation (used by SaveButton)
     */
    async saveNoticeWithValidation() {
        // Clear previous error states
        document.querySelectorAll('.form-input.error, .form-textarea.error').forEach(el => {
            el.classList.remove('error');
        });

        // Validate required fields
        const title = document.getElementById('notice-title')?.value?.trim();
        const category = document.getElementById('notice-category')?.value;
        const content = document.getElementById('notice-content')?.value?.trim();

        const errors = [];

        if (!title) {
            errors.push('Please enter a notice title');
            document.getElementById('notice-title')?.classList.add('error');
        }

        if (!category) {
            errors.push('Please select a category');
            document.getElementById('notice-category')?.classList.add('error');
        }

        if (!content) {
            errors.push('Please enter notice content');
            document.getElementById('notice-content')?.classList.add('error');
        }

        if (errors.length > 0) {
            throw new Error(errors.join(', '));
        }

        // Get authentication token
        const token = localStorage.getItem('adminToken');
        if (!token) {
            throw new Error('Authentication required. Please login again.');
        }

        // Upload image if one is selected
        let imageUrl = document.getElementById('notice-image-url')?.value || '';
        const imageFile = document.getElementById('notice-image-file')?.files[0];
        
        if (imageFile && this.noticeImageUpload) {
            try {
                this.noticeSaveButton?.updateProgress('Uploading image...', 20);
                const uploadResult = await this.noticeImageUpload.uploadFile(imageFile);
                imageUrl = uploadResult.url;
                this.noticeSaveButton?.updateProgress('Image uploaded, processing PDFs...', 40);
            } catch (uploadError) {
                console.error('❌ Image upload failed:', uploadError);
                throw new Error(`Image upload failed: ${uploadError.message}`);
            }
        } else {
            this.noticeSaveButton?.updateProgress('Processing PDFs...', 40);
        }

        // Upload PDF files if any
        let pdfFilesData = [];
        try {
            pdfFilesData = await this.uploadAllPDFFiles();
            this.noticeSaveButton?.updateProgress('PDFs uploaded, saving notice...', 60);
        } catch (pdfUploadError) {
            console.error('❌ PDF upload failed:', pdfUploadError);
            throw new Error(`PDF upload failed: ${pdfUploadError.message}`);
        }

        // Get the notice date or use today's date
        const noticeDate = document.getElementById('notice-date')?.value || new Date().toISOString().split('T')[0];

        // Collect form data
        const noticeData = {
            title: title,
            category: category,
            description: content,
            date: noticeDate,
            time: '00:00',
            location: 'School Notice Board',
            author: document.getElementById('notice-author')?.value?.trim() || 'Marigold School',
            imageUrl: imageUrl || null,
            validUntil: document.getElementById('notice-valid-until')?.value || null,
            audience: 'all', // Default audience
            eventSchedule: JSON.stringify(this.noticeHighlights.filter(h => h.trim() !== '')),
            pdfFiles: JSON.stringify(pdfFilesData), // Include PDF files data
            section: 'notices'
        };


        // Update progress
        this.noticeSaveButton?.updateProgress('Saving to database...', 80);

        // Save to database
        const response = await fetch('/api/events', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(noticeData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('❌ Server response:', errorData);
            
            // Format validation errors nicely
            if (errorData.errors && Array.isArray(errorData.errors)) {
                const errorMessages = errorData.errors.map(err => err.msg || err.message).join(', ');
                throw new Error(errorMessages);
            }
            
            throw new Error(errorData.message || 'Failed to save notice');
        }

        const result = await response.json();

        // Update progress to complete
        this.noticeSaveButton?.updateProgress('Notice saved!', 100);

        return result;
    }

    /**
     * Close add event modal
     */
    closeAddEventModal() {
        const modal = document.getElementById('add-event-modal');
        if (modal) {
            modal.classList.remove('active');
            // Restore body scrolling
            document.body.classList.remove('modal-open');
            // Use setTimeout to allow the transition to complete before hiding
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300); // Match the CSS transition duration
            // Reset form
            const form = document.getElementById('add-event-form');
            if (form) {
                form.reset();
            }
        }
    }

    /**
     * Setup add event modal functionality
     */
    setupAddEventModal() {
        const form = document.getElementById('add-event-form');
        const modal = document.getElementById('add-event-modal');
        
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAddEvent();
            });
        }

        // Close modal when clicking outside
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeAddEventModal();
                }
            });
        }

        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const modal = document.getElementById('add-event-modal');
                if (modal && modal.style.display === 'flex') {
                    this.closeAddEventModal();
                }
            }
        });

        // Initialize modal interactivity
        this.initializeModalInteractivity();
    }

    /**
     * Initialize modal interactivity
     */
    initializeModalInteractivity() {
        // Setup schedule interactivity
        this.setupModalScheduleInteractivity();
        
        // Setup guests interactivity
        this.setupModalGuestsInteractivity();
        
        // Setup image upload
        this.setupModalImageUpload();
        
        // Setup category selector
        this.setupModalCategorySelector();
        
        // Setup registration toggle
        this.setupModalRegistrationToggle();
    }

    /**
     * Setup modal schedule interactivity
     */
    setupModalScheduleInteractivity() {
        const addScheduleItemsContainer = document.querySelector('#add-schedule-items');
        if (addScheduleItemsContainer) {
            const addScheduleBtn = addScheduleItemsContainer.parentElement.querySelector('.add-schedule-item');
        if (addScheduleBtn) {
            addScheduleBtn.addEventListener('click', () => this.addModalScheduleItem());
            }
        }

        // Setup remove buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.remove-schedule-item')) {
                this.removeModalScheduleItem(e.target.closest('.schedule-item'));
            }
        });
    }

    /**
     * Setup modal guests interactivity
     */
    setupModalGuestsInteractivity() {
        const addGuestsItemsContainer = document.querySelector('#add-guests-items');
        if (addGuestsItemsContainer) {
            const addGuestBtn = addGuestsItemsContainer.parentElement.querySelector('.add-guest-item');
        if (addGuestBtn) {
            addGuestBtn.addEventListener('click', () => this.addModalGuestItem());
            }
        }

        // Setup remove buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.remove-guest-item')) {
                this.removeModalGuestItem(e.target.closest('.guest-item'));
            }
        });
    }

    /**
     * Setup modal image upload
     */
    setupModalImageUpload() {
        const uploadBtn = document.querySelector('#add-event-modal .image-upload-btn');
        const fileInput = document.querySelector('#add-event-modal input[type="file"]');
        
        if (uploadBtn && fileInput) {
            uploadBtn.addEventListener('click', () => fileInput.click());
            fileInput.addEventListener('change', (e) => this.handleModalImageUpload(e));
        }
    }

    /**
     * Setup modal category selector
     */
    setupModalCategorySelector() {
        const addCategoryBtn = document.querySelector('#add-event-modal .add-category-btn');
        const saveCategoryBtn = document.querySelector('#add-event-modal .save-category-btn');
        const cancelCategoryBtn = document.querySelector('#add-event-modal .cancel-category-btn');
        const categoryForm = document.querySelector('#add-event-modal .add-category-form');
        
        if (addCategoryBtn && categoryForm) {
            addCategoryBtn.addEventListener('click', () => {
                categoryForm.style.display = 'block';
            });
        }
        
        if (cancelCategoryBtn && categoryForm) {
            cancelCategoryBtn.addEventListener('click', () => {
                categoryForm.style.display = 'none';
            });
        }
        
        if (saveCategoryBtn) {
            saveCategoryBtn.addEventListener('click', () => {
                const newCategoryName = document.querySelector('#add-event-modal #new-category-name').value;
                if (newCategoryName.trim()) {
                    const select = document.querySelector('#add-event-modal select[name="category"]');
                    const newOption = document.createElement('option');
                    newOption.value = newCategoryName.toLowerCase().replace(/\s+/g, '_');
                    newOption.textContent = newCategoryName;
                    select.appendChild(newOption);
                    select.value = newOption.value;
                    categoryForm.style.display = 'none';
                    document.querySelector('#add-event-modal #new-category-name').value = '';
                }
            });
        }
    }

    /**
     * Setup modal registration toggle
     */
    setupModalRegistrationToggle() {
        const toggle = document.querySelector('#add-event-modal input[name="registration-enabled"]');
        if (toggle) {
            toggle.addEventListener('change', (e) => {
                // Handle registration toggle logic if needed
            });
        }
    }

    /**
     * Add modal schedule item
     */
    addModalScheduleItem() {
        const container = document.getElementById('add-schedule-items');
        const index = container.children.length;
        
        const scheduleItemHTML = `
            <div class="schedule-item" data-index="${index}" draggable="true">
                <div class="item-header">
                    <div class="item-header-content">
                        <button type="button" class="btn-drag" title="Drag to reorder">
                            <i data-lucide="grip-vertical"></i>
                        </button>
                        <span>Schedule Item ${index + 1}</span>
                    </div>
                    <div class="item-actions">
                        <button type="button" class="btn btn-sm btn-danger remove-schedule-item" title="Remove this schedule item">
                            <i data-lucide="trash-2"></i>
                        </button>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Time</label>
                        <input type="text" name="schedule-time" placeholder="e.g., 10:00 AM" class="form-input">
                    </div>
                    <div class="form-group">
                        <label>Event Name</label>
                        <input type="text" name="schedule-event" placeholder="Event name" class="form-input">
                    </div>
                    <div class="form-group">
                        <label>Icon</label>
                        <select name="schedule-icon" class="form-input">
                            <option value="celebration">🎉 Celebration</option>
                            <option value="slideshow">📊 Slideshow</option>
                            <option value="mic">🎤 Microphone</option>
                            <option value="emoji_events">🏆 Trophy</option>
                            <option value="schedule">⏰ Schedule</option>
                            <option value="group">👥 Group</option>
                        </select>
                    </div>
                </div>
            </div>
        `;
        
        container.insertAdjacentHTML('beforeend', scheduleItemHTML);
        lucide.createIcons();
    }

    /**
     * Remove modal schedule item
     */
    removeModalScheduleItem(item) {
        if (item) {
            item.remove();
            this.updateModalScheduleNumbers();
        }
    }

    /**
     * Update modal schedule numbers
     */
    updateModalScheduleNumbers() {
        const items = document.querySelectorAll('#add-schedule-items .schedule-item');
        items.forEach((item, index) => {
            item.setAttribute('data-index', index);
            const title = item.querySelector('.item-header-content span');
            if (title) {
                title.textContent = `Schedule Item ${index + 1}`;
            }
        });
    }

    /**
     * Add modal guest item
     */
    addModalGuestItem() {
        const container = document.getElementById('add-guests-items');
        const index = container.children.length;
        
        const guestItemHTML = `
            <div class="guest-item" data-index="${index}" draggable="true">
                <div class="item-header">
                    <div class="item-header-content">
                        <button type="button" class="btn-drag" title="Drag to reorder">
                            <i data-lucide="grip-vertical"></i>
                        </button>
                        <h5>Guest ${index + 1}</h5>
                    </div>
                    <div class="item-actions">
                        <button type="button" class="btn btn-sm btn-danger remove-guest-item" title="Remove this guest">
                            <i data-lucide="trash-2"></i>
                        </button>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Guest Name</label>
                        <input type="text" name="guest-name" placeholder="Guest name" class="form-input">
                    </div>
                    <div class="form-group">
                        <label>Role/Title</label>
                        <input type="text" name="guest-role" placeholder="e.g., Keynote Speaker, Judge, Performer" class="form-input">
                    </div>
                    <div class="form-group">
                        <label>Avatar Image URL</label>
                        <input type="url" name="guest-avatar" placeholder="https://example.com/avatar.jpg" class="form-input">
                    </div>
                </div>
            </div>
        `;
        
        container.insertAdjacentHTML('beforeend', guestItemHTML);
        lucide.createIcons();
    }

    /**
     * Remove modal guest item
     */
    removeModalGuestItem(item) {
        if (item) {
            item.remove();
            this.updateModalGuestNumbers();
        }
    }

    /**
     * Update modal guest numbers
     */
    updateModalGuestNumbers() {
        const items = document.querySelectorAll('#add-guests-items .guest-item');
        items.forEach((item, index) => {
            item.setAttribute('data-index', index);
            const title = item.querySelector('.item-header-content h5');
            if (title) {
                title.textContent = `Guest ${index + 1}`;
            }
        });
    }

    /**
     * Handle modal image upload
     */
    handleModalImageUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const preview = document.querySelector('#add-event-modal .image-upload-preview');
                if (preview) {
                    preview.innerHTML = `<img src="${e.target.result}" alt="Preview" style="width: 200px; height: 150px; object-fit: cover; border-radius: 8px; border: 1px solid #e5e7eb;">`;
                }
            };
            reader.readAsDataURL(file);
        }
    }

    /**
     * Handle add event form submission
     */
    handleAddEvent() {
        const form = document.getElementById('add-event-form');
        if (!form) return;

        const formData = new FormData(form);
        const eventData = {
            title: formData.get('title'),
            category: formData.get('category'),
            date: formData.get('date'),
            time: formData.get('time'),
            venue: formData.get('venue'),
            description: formData.get('description')
        };

        // Validate required fields
        if (!eventData.title || !eventData.date) {
            this.showNotification('error', 'Please fill in all required fields');
            return;
        }

        // Create new event item
        this.createNewEvent(eventData);
        
        // Close modal
        this.closeAddEventModal();
        
        // Show success message
        this.showNotification('success', 'Event added successfully');
    }

    /**
     * Create new event and add to list
     */
    createNewEvent(eventData) {
        const eventsList = document.getElementById('events-list');
        if (!eventsList) return;

        // Generate unique ID
        const eventId = 'event_' + Date.now();
        
        // Create event item HTML
        const eventItem = document.createElement('div');
        eventItem.className = 'event-item';
        eventItem.setAttribute('data-event-id', eventId);
        eventItem.innerHTML = `
            <div class="event-content">
                <h4 class="event-title">${eventData.title}</h4>
                <p class="event-meta">
                    <span class="event-date">${eventData.date}</span>
                    ${eventData.time ? `<span class="event-time">${eventData.time}</span>` : ''}
                    ${eventData.venue ? `<span class="event-venue">${eventData.venue}</span>` : ''}
                </p>
                ${eventData.description ? `<p class="event-description">${eventData.description}</p>` : ''}
                ${eventData.category ? `<span class="event-category">${eventData.category}</span>` : ''}
            </div>
            <div class="event-actions">
                <button class="btn btn-sm btn-primary edit-event-btn" data-event-id="${eventId}">
                    <i data-lucide="edit"></i> Edit
                </button>
                <button class="btn btn-sm btn-danger delete-event-btn" data-event-id="${eventId}">
                    <i data-lucide="trash-2"></i> Delete
                </button>
            </div>
        `;

        // Add to events list
        eventsList.appendChild(eventItem);
        
        // Re-initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        // Hide empty state if it's showing
        const emptyState = document.getElementById('events-empty-state');
        if (emptyState) {
            emptyState.style.display = 'none';
        }
    }

    /**
     * Get current section from URL or context
     */
    getCurrentSection() {
        // Try to get from URL hash
        const hash = window.location.hash;
        if (hash.includes('upcoming_events')) return 'upcoming_events';
        if (hash.includes('past_events')) return 'past_events';
        
        // Try to get from the current page content
        const pageContent = document.getElementById('pageContent');
        if (pageContent) {
            if (pageContent.innerHTML.includes('Upcoming Events')) return 'upcoming_events';
            if (pageContent.innerHTML.includes('Past Events')) return 'past_events';
        }
        
        // Default fallback
        return 'upcoming_events';
    }

    /**
     * Add loading spinner styles
     */
    addLoadingSpinnerStyles() {
        if (document.getElementById('loading-spinner-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'loading-spinner-styles';
        style.textContent = `
            .loading-spinner {
                display: inline-block;
                width: 16px;
                height: 16px;
                border: 2px solid #f3f3f3;
                border-top: 2px solid #3498db;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin-right: 8px;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            .save-section-btn:disabled {
                opacity: 0.7;
                cursor: not-allowed;
            }

            /* Events List View Styles */
            .events-list-view {
                background: #fff;
                border-radius: 8px;
            }

            .list-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                padding-bottom: 15px;
                border-bottom: 1px solid #e2e8f0;
            }

            .header-content h3 {
                margin: 0 0 5px 0;
                font-size: 20px;
                color: #1f2937;
            }

            .header-subtitle {
                margin: 0;
                color: #6b7280;
                font-size: 14px;
            }

            .events-list-container {
                display: flex;
                flex-direction: column;
                gap: 12px;
            }

            .event-list-item {
                background: #fff;
                border: 1px solid #e2e8f0;
                border-radius: 8px;
                padding: 16px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                transition: all 0.2s ease;
                cursor: pointer;
            }

            .event-list-item:hover {
                border-color: #3b82f6;
                box-shadow: 0 2px 8px rgba(59, 130, 246, 0.1);
                transform: translateY(-1px);
            }

            .event-info {
                flex: 1;
            }

            .event-main {
                margin-bottom: 8px;
            }

            .event-name {
                margin: 0 0 8px 0;
                font-size: 16px;
                font-weight: 600;
                color: #1f2937;
            }

            .event-meta {
                display: flex;
                gap: 12px;
                font-size: 12px;
                color: #6b7280;
            }

            .event-category {
                background: #f3f4f6;
                padding: 2px 8px;
                border-radius: 12px;
                font-weight: 500;
            }

            .event-details {
                margin-top: 8px;
            }

            .event-location {
                margin: 0 0 4px 0;
                font-size: 12px;
                color: #6b7280;
                display: flex;
                align-items: center;
                gap: 4px;
            }

            .event-description {
                margin: 0;
                font-size: 12px;
                color: #9ca3af;
                line-height: 1.4;
            }

            .event-actions {
                display: flex;
                gap: 8px;
            }

            /* Event Detail Editor Styles */
            .event-detail-editor {
                background: #fff;
                border-radius: 8px;
                padding: 20px;
                border: 1px solid #e2e8f0;
            }

            .editor-header {
                margin-bottom: 24px;
                padding-bottom: 16px;
                border-bottom: 1px solid #e2e8f0;
            }

            .editor-header h3 {
                margin: 0;
                font-size: 20px;
                color: #1f2937;
                text-align: center;
            }

            .form-actions {
                margin-top: 24px;
                padding-top: 20px;
                border-top: 1px solid #e2e8f0;
                display: flex;
                justify-content: center;
            }

            .event-form {
                display: flex;
                flex-direction: column;
                gap: 24px;
            }

            .form-section {
                background: #f8fafc;
                padding: 20px;
                border-radius: 8px;
                border: 1px solid #e2e8f0;
            }

            .form-section h4 {
                margin: 0 0 16px 0;
                font-size: 16px;
                color: #374151;
                font-weight: 600;
            }

            .form-row {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 16px;
                margin-bottom: 16px;
            }

            .form-row:last-child {
                margin-bottom: 0;
            }

            .form-group {
                display: flex;
                flex-direction: column;
            }

            .form-group label {
                font-size: 12px;
                font-weight: 600;
                color: #374151;
                margin-bottom: 6px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .form-input,
            .form-textarea {
                padding: 10px 12px;
                border: 1px solid #d1d5db;
                border-radius: 6px;
                font-size: 14px;
                transition: border-color 0.2s;
            }

            .form-input:focus,
            .form-textarea:focus {
                outline: none;
                border-color: #3b82f6;
                box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
            }

            .form-textarea {
                resize: vertical;
                min-height: 100px;
            }

            /* Responsive Design */
            @media (max-width: 768px) {
                .form-row {
                    grid-template-columns: 1fr;
                }
                
                .list-header {
                    flex-direction: column;
                    gap: 15px;
                    align-items: flex-start;
                }
                
                .event-list-item {
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 12px;
                }
                
                .event-actions {
                    align-self: flex-end;
                }
            }

            .editor-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                padding-bottom: 15px;
                border-bottom: 1px solid #e2e8f0;
            }

            .editor-header h3 {
                margin: 0;
                font-size: 20px;
                color: #1f2937;
            }

            .search-bar {
                display: flex;
                gap: 15px;
                margin-bottom: 20px;
                max-width: 100% !important;
                padding: 15px;
                background: #f8fafc;
                border-radius: 6px;
            }

            .search-input {
                flex: 1;
                padding: 10px 12px;
                border: 1px solid #d1d5db;
                border-radius: 6px;
                font-size: 14px;
            }

            .search-input:focus {
                outline: none;
                border-color: #3b82f6;
                box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
            }

            .filter-select {
                padding: 10px 12px;
                border: 1px solid #d1d5db;
                border-radius: 6px;
                background: white;
                font-size: 14px;
                min-width: 150px;
            }

            .events-list {
                display: flex;
                flex-direction: column;
                gap: 15px;
            }

            .simple-event-item {
                background: #fff;
                border: 1px solid #e2e8f0;
                border-radius: 8px;
                padding: 20px;
                transition: all 0.2s ease;
            }

            .simple-event-item:hover {
                border-color: #3b82f6;
                box-shadow: 0 2px 8px rgba(59, 130, 246, 0.1);
            }

            .event-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;
                padding-bottom: 10px;
                border-bottom: 1px solid #f1f5f9;
            }

            .event-title {
                flex: 1;
            }

            .title-input {
                width: 100%;
                padding: 8px 12px;
                border: 1px solid #d1d5db;
                border-radius: 6px;
                font-size: 16px;
                font-weight: 600;
                background: #f8fafc;
            }

            .title-input:focus {
                outline: none;
                border-color: #3b82f6;
                background: white;
                box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
            }

            .event-actions {
                display: flex;
                gap: 8px;
            }

            .btn-icon {
                width: 32px;
                height: 32px;
                border: none;
                background: transparent;
                border-radius: 6px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.2s;
                color: #64748b;
            }

            .btn-icon:hover {
                background: #f1f5f9;
                color: #334155;
            }

            .delete-btn:hover {
                background: #fef2f2;
                color: #dc2626;
            }

            .event-content {
                display: flex;
                flex-direction: column;
                gap: 15px;
            }

            .form-row {
                display: grid;
                grid-template-columns: 1fr 1fr 1fr;
                gap: 15px;
            }

            .form-group {
                display: flex;
                flex-direction: column;
            }

            .form-group label {
                font-size: 12px;
                font-weight: 600;
                color: #374151;
                margin-bottom: 5px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .form-input,
            .form-textarea {
                padding: 8px 12px;
                border: 1px solid #d1d5db;
                border-radius: 6px;
                font-size: 14px;
                transition: border-color 0.2s;
            }

            .form-input:focus,
            .form-textarea:focus {
                outline: none;
                border-color: #3b82f6;
                box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
            }

            .form-textarea {
                resize: vertical;
                min-height: 80px;
            }

            .empty-state {
                text-align: center;
                padding: 40px 20px;
                color: #6b7280;
            }

            .empty-icon {
                width: 60px;
                height: 60px;
                margin: 0 auto 15px;
                background: #f1f5f9;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #9ca3af;
            }

            .empty-state h4 {
                margin: 0 0 8px 0;
                font-size: 18px;
                color: #374151;
            }

            .empty-state p {
                margin: 0 0 20px 0;
                color: #6b7280;
            }

            /* Responsive Design */
            @media (max-width: 768px) {
                .form-row {
                    grid-template-columns: 1fr;
                }
                
                .search-bar {
                    flex-direction: column;
                }
                
                .editor-header {
                    flex-direction: column;
                    gap: 15px;
                    align-items: flex-start;
                }
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Initialize PDF upload functionality
     */
    initializePDFUpload(inputId, listId) {
        
        const fileInput = document.getElementById(inputId);
        const fileList = document.getElementById(listId);
        
        if (!fileInput || !fileList) {
            console.error('❌ PDF upload elements not found:', {
                inputId,
                listId,
                inputFound: !!fileInput,
                listFound: !!fileList
            });
            return;
        }


        // Store current PDF files
        this.currentPDFFiles = this.currentPDFFiles || [];
        
        // Clear existing files
        fileList.innerHTML = '';
        this.currentPDFFiles = [];
        
        // Load existing PDF files if in edit mode
        if (listId === 'edit-notice-pdf-list' && this.currentNoticeData) {
            this.loadExistingPDFFiles(listId);
        }

        // Remove existing event listener by cloning the input
        const newFileInput = fileInput.cloneNode(true);
        fileInput.parentNode.replaceChild(newFileInput, fileInput);
        
        // Add event listener for file selection on the new input
        newFileInput.addEventListener('change', (e) => {
            this.handlePDFFileSelection(e, listId);
        });
        

        // Add event delegation for remove buttons and filename changes
        fileList.addEventListener('click', (e) => {
            if (e.target.closest('.pdf-remove-btn')) {
                const button = e.target.closest('.pdf-remove-btn');
                const fileId = button.getAttribute('data-file-id');
                if (fileId) {
                    this.removePDFFile(fileId);
                }
            }
        });

        // Add event delegation for filename changes
        fileList.addEventListener('input', (e) => {
            if (e.target.classList.contains('pdf-file-name-input')) {
                const input = e.target;
                const fileId = input.getAttribute('data-file-id');
                const newName = input.value.trim();
                
                if (fileId && newName) {
                    this.updatePDFFileName(fileId, newName);
                }
            }
        });

        // Add event delegation for upload buttons with more robust selector
        const container = newFileInput.closest('.pdf-upload-container');
        const uploadButton = container?.querySelector('.pdf-upload-btn');
        
        if (uploadButton) {
            // Remove existing listeners by cloning
            const newButton = uploadButton.cloneNode(true);
            uploadButton.parentNode.replaceChild(newButton, uploadButton);
            
            // Add fresh event listener using the new file input
            newButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                newFileInput.click();
            });
        } else {
            console.warn('⚠️ PDF upload button not found for:', inputId);
        }
        
    }

    /**
     * Handle PDF file selection
     */
    handlePDFFileSelection(event, listId) {
        
        const files = Array.from(event.target.files);
        const fileList = document.getElementById(listId);
        
        if (!fileList) {
            console.error('❌ File list element not found:', listId);
            return;
        }
        
        
        files.forEach(file => {
            // Validate file type
            if (file.type !== 'application/pdf') {
                this.showNotification('error', `File "${file.name}" is not a PDF file.`);
                return;
            }
            
            // Validate file size (200MB limit)
            const maxSize = 200 * 1024 * 1024; // 200MB
            if (file.size > maxSize) {
                this.showNotification('error', `File "${file.name}" is too large. Maximum size is 200MB.`);
                return;
            }
            
            // Warn about large files
            if (file.size > 25 * 1024 * 1024) { // 25MB
                this.showNotification('warning', `File "${file.name}" is large (${this.formatFileSize(file.size)}). Upload may take longer.`);
            }
            
            // Add file to list
            this.addPDFFileToList(file, listId);
        });
        
        // Clear the input
        event.target.value = '';
    }

    /**
     * Load existing PDF files from notice data
     */
    loadExistingPDFFiles(listId) {
        
        if (!this.currentNoticeData) {
            return;
        }
        
        try {
            // Check for PDF files in the dedicated pdfFiles column first
            let pdfFiles = null;
            
            if (this.currentNoticeData.pdfFiles) {
                pdfFiles = typeof this.currentNoticeData.pdfFiles === 'string' 
                    ? JSON.parse(this.currentNoticeData.pdfFiles) 
                    : this.currentNoticeData.pdfFiles;
            } else if (this.currentNoticeData.metadata) {
                // Fallback to metadata field for backward compatibility
                const metadata = typeof this.currentNoticeData.metadata === 'string' 
                    ? JSON.parse(this.currentNoticeData.metadata) 
                    : this.currentNoticeData.metadata;
                
                if (metadata.pdfFiles && Array.isArray(metadata.pdfFiles)) {
                    pdfFiles = metadata.pdfFiles;
                }
            }
            
            if (!pdfFiles || !Array.isArray(pdfFiles)) {
                return;
            }
            
            
            // Add each existing PDF file to the list
            pdfFiles.forEach((pdfFile, index) => {
                this.addExistingPDFFileToList(pdfFile, listId, index);
            });
            
        } catch (error) {
            console.error('📄 Error loading existing PDF files:', error);
        }
    }

    /**
     * Add existing PDF file to the list (already uploaded)
     */
    addExistingPDFFileToList(pdfFile, listId, index) {
        const fileList = document.getElementById(listId);
        const fileId = 'existing_pdf_' + index + '_' + Date.now();
        
        // Create file item element for existing PDF
        const fileItem = document.createElement('div');
        fileItem.className = 'pdf-upload-item uploaded';
        fileItem.id = fileId;
        fileItem.innerHTML = `
            <div class="pdf-file-info">
                <div class="pdf-file-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="file-text">
                        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/>
                        <path d="M14 2v4a2 2 0 0 0 2 2h4"/>
                        <path d="M10 9H8"/>
                        <path d="M16 13H8"/>
                        <path d="M16 17H8"/>
                    </svg>
                </div>
                <div class="pdf-file-details">
                    <input type="text" class="pdf-file-name-input" value="${pdfFile.name}" data-file-id="${fileId}">
                    <p class="pdf-file-size">${pdfFile.size}</p>
                </div>
            </div>
            <div class="pdf-file-actions">
                <span class="pdf-file-status uploaded">Uploaded</span>
                <button type="button" class="pdf-remove-btn" data-file-id="${fileId}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="x">
                        <path d="M18 6L6 18"/>
                        <path d="M6 6l12 12"/>
                    </svg>
                </button>
            </div>
        `;
        
        fileList.appendChild(fileItem);
        
        // Store file data (already uploaded)
        this.currentPDFFiles = this.currentPDFFiles || [];
        this.currentPDFFiles.push({
            id: fileId,
            file: null, // No file object for existing files
            url: pdfFile.url,
            uploaded: true,
            existing: true, // Mark as existing file
            originalData: pdfFile // Store original data
        });
        
        // Reinitialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    /**
     * Add PDF file to the list (without uploading)
     */
    addPDFFileToList(file, listId) {
        const fileList = document.getElementById(listId);
        const fileId = 'pdf_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        
        // Create file item element
        const fileItem = document.createElement('div');
        fileItem.className = 'pdf-upload-item';
        fileItem.id = fileId;
        fileItem.innerHTML = `
            <div class="pdf-file-info">
                <div class="pdf-file-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="file-text">
                        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/>
                        <path d="M14 2v4a2 2 0 0 0 2 2h4"/>
                        <path d="M10 9H8"/>
                        <path d="M16 13H8"/>
                        <path d="M16 17H8"/>
                    </svg>
                </div>
                <div class="pdf-file-details">
                    <input type="text" class="pdf-file-name-input" value="${file.name}" data-file-id="${fileId}">
                    <p class="pdf-file-size">${this.formatFileSize(file.size)}</p>
                    <div class="pdf-file-progress" style="display: none;">
                        <div class="pdf-file-progress-bar"></div>
                    </div>
                </div>
            </div>
            <div class="pdf-file-actions">
                <span class="pdf-file-status pending">Ready to upload</span>
                <button type="button" class="pdf-remove-btn" data-file-id="${fileId}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="x">
                        <path d="M18 6L6 18"/>
                        <path d="M6 6l12 12"/>
                    </svg>
                </button>
            </div>
        `;
        
        fileList.appendChild(fileItem);
        
        // Store file data (not uploaded yet)
        this.currentPDFFiles = this.currentPDFFiles || [];
        this.currentPDFFiles.push({
            id: fileId,
            file: file,
            url: null,
            uploaded: false
        });
        
        // Reinitialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    /**
     * Upload PDF file to Cloudinary
     */
    async uploadPDFFile(file, fileId) {
        const fileItem = document.getElementById(fileId);
        const progressBar = fileItem?.querySelector('.pdf-file-progress-bar');
        const statusSpan = fileItem?.querySelector('.pdf-file-status');
        const progressContainer = fileItem?.querySelector('.pdf-file-progress');
        
        try {
            // Show progress
            if (progressContainer) progressContainer.style.display = 'block';
            if (progressBar) progressBar.style.width = '0%';
            if (statusSpan) {
                statusSpan.textContent = 'Uploading...';
                statusSpan.className = 'pdf-file-status uploading';
            }
            if (fileItem) fileItem.className = 'pdf-upload-item uploading';
            
            // Show upload progress
            this.showNotification('info', `Uploading PDF: ${file.name} (${this.formatFileSize(file.size)}) - Please wait...`);
            
            // Create FormData
            const formData = new FormData();
            formData.append('file', file);
            
            // Create folder path with notice ID if available
            let folderPath = 'marigold-school/notices/pdf';
            if (this.currentNoticeId) {
                folderPath = `marigold-school/notices/pdf/${this.currentNoticeId}`;
            } else {
                // For new notices, use a temporary folder
                folderPath = 'marigold-school/notices/pdf/temp';
            }
            formData.append('folder', folderPath);
            formData.append('resource_type', 'raw');
            
            // Get authentication token
            const token = localStorage.getItem('adminToken');
            
            if (!token) {
                throw new Error('Authentication required. Please login again.');
            }

            
            // Create AbortController for timeout handling
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 300000); // 5 minute timeout for faster feedback
            
            // Upload to Cloudinary with progress tracking
            const response = await fetch('/api/upload/cloudinary', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData,
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('📄 Upload failed:', {
                    status: response.status,
                    statusText: response.statusText,
                    errorText
                });
                throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
            }
            
            const result = await response.json();
            
            if (result.success && result.url) {
                // Use the URL as returned by Cloudinary (already has .pdf extension)
                const pdfUrl = result.url;
                
                // Update file data
                const fileData = this.currentPDFFiles.find(f => f.id === fileId);
                if (fileData) {
                    fileData.url = pdfUrl;
                    fileData.uploaded = true;
                }
                
                // Update UI
                if (progressBar) {
                    progressBar.style.width = '100%';
                    progressBar.classList.add('completed');
                }
                if (statusSpan) {
                    statusSpan.textContent = 'Uploaded';
                    statusSpan.className = 'pdf-file-status uploaded';
                }
                if (fileItem) {
                    fileItem.className = 'pdf-upload-item uploaded';
                }
                
                this.showNotification('success', 'PDF uploaded successfully');
            } else {
                console.error('📄 Invalid response structure:', result);
                throw new Error(`Invalid response: missing url field. Response: ${JSON.stringify(result)}`);
            }
            
        } catch (error) {
            console.error('PDF upload error:', error);
            
            // Update UI for error
            if (statusSpan) {
                if (error.name === 'AbortError') {
                    statusSpan.textContent = 'Upload Timeout';
                } else {
                    statusSpan.textContent = 'Upload Failed';
                }
                statusSpan.className = 'pdf-file-status error';
            }
            if (fileItem) {
                fileItem.className = 'pdf-upload-item error';
            }
            
            // Show appropriate error message
            if (error.name === 'AbortError') {
                this.showNotification('error', 'PDF upload timed out. Please try again with a smaller file.');
            } else {
                this.showNotification('error', 'PDF upload failed: ' + error.message);
            }
        }
    }

    /**
     * Remove PDF file from list
     */
    removePDFFile(fileId) {
        const fileItem = document.getElementById(fileId);
        if (fileItem) {
            fileItem.remove();
        }
        
        // Remove from currentPDFFiles array
        if (this.currentPDFFiles) {
            this.currentPDFFiles = this.currentPDFFiles.filter(f => f.id !== fileId);
        }
    }

    /**
     * Update PDF file name
     */
    updatePDFFileName(fileId, newName) {
        
        // Find and update the file in the array
        const fileData = this.currentPDFFiles.find(file => file.id === fileId);
        if (fileData) {
            // Store custom name separately since File.name is read-only
            fileData.customName = newName;
            
            // Update the original data name if it exists
            if (fileData.originalData) {
                fileData.originalData.name = newName;
            }
            
            // Update the input field value in the UI
            const inputField = document.querySelector(`input[data-file-id="${fileId}"]`);
            if (inputField) {
                inputField.value = newName;
            }
            
        } else {
            console.error('📄 PDF file not found for ID:', fileId);
        }
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
     * Download PDF file
     */
    downloadPDF(url, filename = null) {
        try {
            
            // Extract filename from URL if not provided
            if (!filename) {
                const urlParts = url.split('/');
                filename = urlParts[urlParts.length - 1];
                // Decode URL encoding
                filename = decodeURIComponent(filename);
            }
            
            // Create a temporary link element
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            link.target = '_blank'; // Fallback for browsers that don't support download
            
            // Append to body, click, and remove
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            
        } catch (error) {
            console.error('📄 Error downloading PDF:', error);
            this.showNotification('error', 'Failed to download PDF file');
        }
    }

    /**
     * Upload all pending PDF files and return data for form submission
     */
    async uploadAllPDFFiles() {
        
        if (!this.currentPDFFiles || this.currentPDFFiles.length === 0) {
            return [];
        }
        
        const pendingFiles = this.currentPDFFiles.filter(file => !file.uploaded && !file.existing);
        
        if (pendingFiles.length === 0) {
            return this.getPDFFilesData();
        }
        
        // Show progress notification
        this.showNotification('info', `Uploading ${pendingFiles.length} PDF file(s) - Please wait...`);
        
        // Upload all pending files in parallel
        const uploadPromises = pendingFiles.map(async (file, index) => {
            try {
                return await this.uploadPDFFile(file.file, file.id);
            } catch (error) {
                console.error(`📄 Failed to upload file ${file.file.name}:`, error);
                throw error;
            }
        });
        
        try {
            await Promise.all(uploadPromises);
            this.showNotification('success', 'All PDF files uploaded successfully!');
            
            return this.getPDFFilesData();
        } catch (error) {
            console.error('📄 Error uploading PDF files:', error);
            this.showNotification('error', 'Some PDF files failed to upload. Please try again.');
            throw error;
        }
    }

    /**
     * Get PDF files data for form submission (legacy method)
     */
    getPDFFilesData() {
        if (!this.currentPDFFiles || this.currentPDFFiles.length === 0) {
            return [];
        }
        
        return this.currentPDFFiles
            .filter(file => file.uploaded && file.url)
            .map(file => {
                // Handle existing files (no file object) vs new files
                if (file.existing && file.originalData) {
                    return file.originalData; // Return original data for existing files
                } else if (file.file) {
                    return {
                        name: file.customName || file.file.name, // Use custom name if available
                        url: file.url,
                        size: this.formatFileSize(file.file.size),
                        originalSize: file.file.size,
                        type: 'application/pdf'
                    };
                }
                return null;
            })
            .filter(file => file !== null);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.eventsContentLoader = new EventsContentLoader();
    window.eventsContentLoader.addLoadingSpinnerStyles();
    
    // Initialize interactive features after a short delay to ensure DOM is ready
// Note: Global events interactivity is now handled per-section to avoid conflicts
// setTimeout(() => {
//     if (window.eventsContentLoader) {
//         window.eventsContentLoader.initializeEventsInteractivity();
//     }
// }, 100);
});

// Global function for closing add event modal
function closeAddEventModal() {
    if (window.eventsContentLoader) {
        window.eventsContentLoader.closeAddEventModal();
    }
}

// Global function for downloading PDF files
function downloadPDF(url, filename = null) {
    try {
        
        // Extract filename from URL if not provided
        if (!filename) {
            const urlParts = url.split('/');
            filename = urlParts[urlParts.length - 1];
            // Decode URL encoding
            filename = decodeURIComponent(filename);
        }
        
        // Create a temporary link element
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.target = '_blank'; // Fallback for browsers that don't support download
        
        // Append to body, click, and remove
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        
    } catch (error) {
        console.error('📄 Error downloading PDF:', error);
        // Show a simple alert if notification system is not available
        alert('Failed to download PDF file');
    }
}
