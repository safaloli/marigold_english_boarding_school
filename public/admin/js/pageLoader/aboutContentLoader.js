/**
 * About Content Manager - Comprehensive
 * Handles dynamic loading and management of all about page content sections
 */
class AboutContentManager {
    constructor() {
        this.currentSection = 'about-content';
        this.selectedHeroImageFile = null; // Store selected image file for hero section
        this.deletedLeadershipMembers = []; // Track deleted leadership members for database cleanup
        this.deletedFacilities = []; // Track deleted facilities for database cleanup
        this.deletedAchievements = []; // Track deleted achievements for database cleanup
        this.deletedTestimonials = []; // Track deleted testimonials for database cleanup
        this.sections = {
            'hero': { name: 'Hero Section', icon: '🏠', enabled: true },
            'timeline': { name: 'Our Story Timeline', icon: '📅', enabled: true },
            'mission_vision_values': { name: 'Mission, Vision & Values', icon: '🎯', enabled: true },
            'principal': { name: 'Principal Message', icon: '👨‍🏫', enabled: true },
            'quick_facts': { name: 'Quick Facts', icon: '📊', enabled: true },
            'why_choose_us': { name: 'Why Choose Us', icon: '⭐', enabled: true },
            'leadership': { name: 'Leadership Team', icon: '👥', enabled: true },
            'facilities': { name: 'Infrastructure & Facilities', icon: '🏢', enabled: true },
            'achievements': { name: 'Achievements & Awards', icon: '🏆', enabled: true },
            'testimonials': { name: 'Testimonials', icon: '💬', enabled: true },
            'cta': { name: 'Call to Action', icon: '📞', enabled: true }
        };
        this.init();
    }

    init() {
        this.bindEvents();
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        // About content section click
        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-section="about-content"]')) {
                e.preventDefault();
                this.loadAboutContent();
            }
        });

        // Breadcrumb back button - handle data-action attribute
        document.addEventListener('click', (e) => {
            const backButton = e.target.closest('.back-button');
            if (backButton) {
                const action = backButton.getAttribute('data-action');
                if (action === 'back-to-section-list' && this.isAboutContentContext(backButton)) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    this.backToSectionList();
                    return;
                }
            }
        });
    }

    /**
     * Load about content section dynamically
     */
    async loadAboutContent() {
        try {
            // Get about content
            const content = this.getAboutContent();
            
            // Inject content into page-content
            this.injectContent(content);
            
            // Initialize about content functionality
            this.initializeAboutContent();
            
            // Update navigation
            this.updateNavigation();
            
        } catch (error) {
            console.error('Error loading about content section:', error);
            this.showError('Failed to load about content section');
        }
    }

    /**
     * Get about content HTML
     */
    getAboutContent() {
        return `
            <section id="about-content-section" class="content-section active">
                <div class="page-header">
                    <div class="page-title">
                        <h1>About Page Content Management</h1>
                        <p>Manage all content sections displayed on the About page.</p>
                    </div>
                </div>

                <!-- Section List View -->
                <div id="sectionList" class="section-list-view">
                    <div class="sections-grid">
                        ${Object.entries(this.sections).map(([key, section]) => `
                            <div class="section-menu-item" data-about-section="${key}">
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
     * Initialize about content functionality
     */
    initializeAboutContent() {
        this.setupSectionClickHandlers();
        this.setupSaveButtonHandlers();
        this.loadSectionStatuses();
    }
    
    /**
     * Setup save button handlers
     */
    setupSaveButtonHandlers() {
        // Save buttons are now handled by the SaveButton component
        // This method is kept for compatibility but does nothing
    }
    
    /**
     * Save section data
     */
    async saveSection(section, saveBtn) {
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                this.showNotification('error', 'Please log in to save changes');
                throw new Error('Authentication required');
            }

            // Show progress indicator
            this.showSaveProgress(saveBtn, 'Preparing...');

            // Handle hero section with image upload
            if (section === 'hero' && this.selectedHeroImageFile) {
                await this.saveHeroWithImageUpload(token, saveBtn);
            } else {
                // Collect data based on section - optimized
                this.updateSaveProgress(saveBtn, 'Saving...', 50);
                const sectionData = await this.collectSectionData(section);
            
            if (!sectionData) {
                    this.showNotification('error', 'Unable to save - please check your input');
                    throw new Error('Failed to collect section data');
            }

                // Save to API - single progress update with timeout
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
                
            const requestData = {
                section: section,
                data: sectionData
            };
            

            const response = await fetch('/api/content/about', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(requestData),
                signal: controller.signal
            });
                
                clearTimeout(timeoutId);

            if (!response.ok) {
                let errorMessage = 'Failed to save section data';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.error || errorData.message || errorMessage;
                } catch (e) {
                }
                throw new Error(errorMessage);
            }

            const result = await response.json();
                this.updateSaveProgress(saveBtn, 'Saved successfully!', 100);
            this.showNotification('success', 'Section saved successfully!');
                
            // Clear deleted members list after successful save
            if (section === 'leadership' && this.deletedLeadershipMembers.length > 0) {
                this.deletedLeadershipMembers = [];
            }
            
            // Clear deleted facilities list after successful save
            if (section === 'facilities' && this.deletedFacilities.length > 0) {
                this.deletedFacilities = [];
            }
            
            // Clear deleted achievements list after successful save
            if (section === 'achievements' && this.deletedAchievements.length > 0) {
                this.deletedAchievements = [];
            }
            
            // Clear deleted testimonials list after successful save
            if (section === 'testimonials' && this.deletedTestimonials.length > 0) {
                this.deletedTestimonials = [];
            }
                
                // Hide progress after a short delay and navigate back
                setTimeout(() => {
                    this.hideSaveProgress(saveBtn);
                    // Navigate back to about page content management
                    this.navigateToAboutPage();
                }, 800);
            }
            
        } catch (error) {
            console.error('Error saving section:', error);
            if (error.name === 'AbortError') {
                this.showNotification('error', 'Save request timed out - please try again');
            } else {
                this.showNotification('error', 'Failed to save changes - please try again');
            }
            this.hideSaveProgress(saveBtn);
            throw error; // Re-throw to be handled by the event handler
        }
    }

    /**
     * Save hero section with image upload
     */
    async saveHeroWithImageUpload(token, saveBtn) {
        try {
            // Upload image to Cloudinary first - optimized progress
            this.updateSaveProgress(saveBtn, 'Uploading image...', 15);
            const imageUrl = await this.uploadImageToCloudinary(this.selectedHeroImageFile, (progress) => {
                // Update progress during upload (15% to 75%) - reduced frequency
                if (progress % 25 === 0) { // Only update every 25%
                    const uploadProgress = 15 + (progress * 0.6);
                    this.updateSaveProgress(saveBtn, `Uploading image... ${Math.round(progress)}%`, uploadProgress);
                }
            });
            
            if (!imageUrl) {
                throw new Error('Failed to upload image');
            }


            // Update the hidden input with the uploaded image URL
            const imageUrlInput = document.getElementById('hero-image-url');
            if (imageUrlInput) {
                imageUrlInput.value = imageUrl;
            } else {
            }

            // Collect hero data (now includes the uploaded image URL) - faster
            this.updateSaveProgress(saveBtn, 'Saving to database...', 80);
            const sectionData = this.collectHeroData();
            
            if (!sectionData) {
                throw new Error('Failed to collect hero data');
            }

            // Save to API - single update with timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
            
            const response = await fetch('/api/content/about', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    section: 'hero',
                    data: sectionData
                }),
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error('Failed to save hero data');
            }

            const result = await response.json();
            
            // Clear the selected file after successful save
            this.selectedHeroImageFile = null;
            
            this.updateSaveProgress(saveBtn, 'Saved successfully!', 100);
            this.showNotification('success', 'Hero section saved successfully with image!');
            
            // Hide progress after a short delay and navigate back
            setTimeout(() => {
                this.hideSaveProgress(saveBtn);
                // Navigate back to about page content management
                this.navigateToAboutPage();
            }, 800);
            
        } catch (error) {
            console.error('Error saving hero with image:', error);
            if (error.name === 'AbortError') {
                this.showNotification('error', 'Image upload timed out - please try again');
            } else if (error.message.includes('upload')) {
                this.showNotification('error', 'Failed to upload image - please try again');
            } else {
                this.showNotification('error', 'Failed to save hero section - please try again');
            }
            this.hideSaveProgress(saveBtn);
            throw error; // Re-throw to be handled by the event handler
        }
    }
    
    /**
     * Collect section data based on section type
     */
    async collectSectionData(section) {
        switch (section) {
            case 'hero':
                return this.collectHeroData();
            case 'timeline':
                return this.collectTimelineData();
            case 'mission_vision_values':
                return this.collectMissionVisionValuesData();
            case 'principal':
                return this.collectPrincipalData();
            case 'quick_facts':
                return this.collectQuickFactsData();
            case 'why_choose_us':
                return await this.collectWhyChooseUsData();
            case 'leadership':
                return await this.collectLeadershipData();
            case 'facilities':
                return await this.collectFacilitiesData();
            case 'achievements':
                return this.collectAchievementsData();
            case 'testimonials':
                return this.collectTestimonialsData();
            case 'cta':
                return this.collectCTAData();
            default:
                return null;
        }
    }

    /**
     * Collect hero section data
     */
    collectHeroData() {
        const heroTitle = document.getElementById('hero-title')?.value || '';
        const heroSubtitle = document.getElementById('hero-subtitle')?.value || '';
        const heroImage = document.getElementById('hero-image-url')?.value || '';
        const applyText = document.getElementById('hero-apply-text')?.value || 'Apply Now';
        const visitText = document.getElementById('hero-visit-text')?.value || 'Schedule a Visit';
        
        
        return [
            {
            section: 'hero',
                key: 'hero_title',
                title: heroTitle,
                content: heroSubtitle,
                imageUrl: heroImage,
                orderIndex: 1,
                isActive: true
            },
            {
                section: 'hero',
                key: 'hero_apply_button',
                title: applyText,
                linkUrl: '/application',
                description: 'Start your educational journey with us',
                orderIndex: 2,
                isActive: true
            },
            {
                section: 'hero',
                key: 'hero_visit_button',
                title: visitText,
                linkUrl: '/contact',
                description: 'Come and see our campus',
                orderIndex: 3,
                isActive: true
            }
        ];
    }

    /**
     * Collect timeline section data
     */
    collectTimelineData() {
        const timelineEvents = [];
        const eventElements = document.querySelectorAll('.timeline-event-card');
        
        // Get section title and subtitle
        const sectionTitle = document.getElementById('timeline-title')?.value || '';
        const sectionSubtitle = document.getElementById('timeline-subtitle')?.value || '';
        
        // Add section title as first item
        if (sectionTitle || sectionSubtitle) {
            timelineEvents.push({
                section: 'timeline',
                key: 'timeline_title',
                title: sectionTitle,
                content: sectionSubtitle,
                orderIndex: 1,
                isActive: true
            });
        }
        
        eventElements.forEach((element, index) => {
            const title = element.querySelector('.timeline-event-title')?.value || '';
            const content = element.querySelector('.timeline-event-content-text')?.value || '';
            const date = element.querySelector('.timeline-event-date')?.value || '';
            const order = element.querySelector('.timeline-event-order')?.value || (index + 1);
            const originalKey = element.getAttribute('data-original-key');
            
            
            if (title || content || date) {
                timelineEvents.push({
                    section: 'timeline',
                    key: originalKey || `timeline_${date || index}`, // Use original key if available
                    title: title,
                    content: content,
                    date: date,
                    orderIndex: parseInt(order),
                    isActive: true
                });
            }
        });

        return timelineEvents;
    }

    /**
     * Collect mission/vision/values section data
     */
    collectMissionVisionValuesData() {
        const sectionTitle = document.getElementById('mission-title')?.value || 'Our Mission, Vision & Values';
        
        // Create mission vision values object
        const missionVisionValues = {
            mission: document.getElementById('mission-content')?.value,
            vision: document.getElementById('vision-content')?.value,
            values: document.getElementById('values-content')?.value
        };
        
        const missionData = [
            {
                section: 'mission_vision_values',
                key: 'section_title',
                title: sectionTitle,
                orderIndex: 1,
                isActive: true
            },
            {
                section: 'mission_vision_values',
                key: 'mission',
                title: 'Mission',
                content: document.getElementById('mission-content')?.value || '',
                icon: 'lightbulb',
                orderIndex: 1,
                isActive: true
            },
            {
                section: 'mission_vision_values',
                key: 'vision',
                title: 'Vision',
                content: document.getElementById('vision-content')?.value || '',
                icon: 'target',
                orderIndex: 2,
                isActive: true
            },
            {
                section: 'mission_vision_values',
                key: 'values',
                title: 'Values',
                content: document.getElementById('values-content')?.value || '',
                icon: 'heart',
                orderIndex: 3,
                isActive: true
            }
        ];

        return missionData;
    }

    /**
     * Collect principal section data
     */
    collectPrincipalData() {
        const sectionTitle = document.getElementById('principal-title')?.value || 'A Word from Our Principal';
        const imageUrl = document.getElementById('principal-image-url')?.value || '';
        
        // Create principal data object
        const principalData = {
            message: document.getElementById('principal-message')?.value,
            imageUrl: imageUrl,
            qualifications: document.getElementById('principal-qualifications')?.value
        };
        
        return [
            {
            section: 'principal',
                key: 'principal_section_title',
                title: sectionTitle,
                orderIndex: 1,
                isActive: true
            },
            {
                section: 'principal',
                key: 'principal_info',
                title: 'Principal',
            content: document.getElementById('principal-message')?.value || '',
            name: document.getElementById('principal-name')?.value || '',
            qualifications: document.getElementById('principal-qualifications')?.value || '',
            imageUrl: imageUrl,
                orderIndex: 1,
                isActive: true
            }
        ];
    }

    /**
     * Collect quick facts section data
     */
    collectQuickFactsData() {
        const sectionTitle = document.getElementById('quick-facts-title')?.value || 'Our results in numbers';
        
        const factsData = [
            {
                section: 'quick_facts',
                key: 'section_title',
                title: sectionTitle,
                orderIndex: 0
            }
        ];
        
        const factKeys = ['years_excellence', 'qualified_teachers', 'students_enrolled', 'awards_achievements'];
        
        factKeys.forEach((factKey, index) => {
            const number = document.getElementById(`fact${index + 1}Number`)?.value || '';
            const label = document.getElementById(`fact${index + 1}Label`)?.value || '';
            
            if (number || label) {
                factsData.push({
                    section: 'quick_facts',
                    key: factKey,
                    title: label,
                    content: number,
                    description: label,
                    orderIndex: index + 1
                });
            }
        });
        
        return factsData;
    }

    /**
     * Collect why choose us section data
     */
    async collectWhyChooseUsData() {
        const reasons = [];
        const reasonElements = document.querySelectorAll('.feature-card');
        const sectionTitle = document.getElementById('why-choose-title')?.value || 'Why Choose Us';
        
        // Process reason elements
        reasonElements.forEach((element, index) => {
            const title = element.querySelector('.feature-title')?.textContent?.trim();
            const description = element.querySelector('.feature-description')?.textContent?.trim();
            const icon = element.querySelector('.feature-icon')?.textContent?.trim();
            
            if (title && description) {
                reasons.push({
                    title: title,
                    content: description,
                    icon: icon || 'star',
                    orderIndex: index + 1,
                    isActive: true
                });
            }
        });
        
        // Add section title as first item
        reasons.push({
            section: 'why_choose_us',
            key: 'section_title',
            title: sectionTitle,
            orderIndex: 1,
            isActive: true
        });
        
        // First, collect all data and identify which features need image uploads
        const uploadPromises = [];
        const featureData = [];
        
        for (const [index, element] of reasonElements.entries()) {
            const title = element.querySelector('.why-choose-title')?.value || '';
            const content = element.querySelector('.why-choose-content')?.value || '';
            const imageUrlInput = element.querySelector('.why-choose-image-url');
            const originalKey = element.getAttribute('data-original-key');
            
            
            if (title || content) {
                let imageUrl = imageUrlInput?.value || '';
                
                // Check if there's a new image file to upload
                const selectedFileData = element.getAttribute('data-selected-file');
                if (selectedFileData) {
                    const fileInput = element.querySelector('.feature-image-upload');
                    const file = fileInput.files[0];
                    if (file) {
                        // Create upload promise
                        const uploadPromise = this.uploadFeatureImage(file, title)
                            .then(uploadedUrl => {
                                return { index, uploadedUrl };
                            })
                            .catch(error => {
                                throw new Error(`Failed to upload image for feature: ${title}`);
                            });
                        uploadPromises.push(uploadPromise);
                    }
                }
                
                featureData.push({
                    index,
                    section: 'why_choose_us',
                    key: originalKey || title.toLowerCase().replace(/\s+/g, '_') || `feature_${index + 1}`,
                    title: title,
                    content: content,
                    description: content,
                    imageUrl: imageUrl,
                    orderIndex: index + 1,
                    isActive: true
                });
            }
        }
        
        // Upload all images in parallel
        if (uploadPromises.length > 0) {
            
            // Create a progress tracking promise that resolves when all uploads complete
            const uploadResults = await Promise.all(uploadPromises.map((promise, i) => 
                promise.then(result => {
                    return result;
                })
            ));
            
            // Update image URLs with uploaded results
            uploadResults.forEach(({ index, uploadedUrl }) => {
                const feature = featureData.find(f => f.index === index);
                if (feature) {
                    feature.imageUrl = uploadedUrl;
                }
            });
            
        }
        
        // Add all feature data to reasons
        reasons.push(...featureData.map(f => ({
            section: f.section,
            key: f.key,
            title: f.title,
            content: f.content,
            description: f.description,
            imageUrl: f.imageUrl,
            orderIndex: f.orderIndex,
            isActive: f.isActive
        })));

        return reasons;
    }

    /**
     * Collect leadership section data
     */
    async collectLeadershipData() {
        const leaders = [];
        const leaderElements = document.querySelectorAll('.leader-card');
        const sectionTitle = document.getElementById('leadership-title')?.value || 'Our Leadership Team';
        const sectionSubtitle = document.getElementById('leadership-subtitle')?.value || 'Meet the dedicated professionals guiding our institution';
        
        // Add section title and subtitle as separate data items
        leaders.push({
            section: 'leadership',
            key: 'section_title',
            title: sectionTitle,
            content: sectionSubtitle,
            orderIndex: 1,
            isActive: true
        });
        
        // First, collect all data and identify which members need image uploads
        const uploadPromises = [];
        const memberData = [];
        
        leaderElements.forEach((element, index) => {
            const name = element.querySelector('.leader-name')?.value || '';
            const position = element.querySelector('.leader-position')?.value || '';
            const imageUrlInput = element.querySelector('.leader-image-url');
            const originalKey = element.getAttribute('data-original-key');
            
            
            if (name || position) {
                let imageUrl = imageUrlInput?.value || '';
                
                // Check if there's a new image file to upload
                const selectedFileData = element.getAttribute('data-selected-file');
                if (selectedFileData) {
                    const fileInput = element.querySelector('.leader-image-upload');
                    const file = fileInput.files[0];
                    if (file) {
                        // Create upload promise
                        const uploadPromise = this.uploadLeaderImage(file, name)
                            .then(uploadedUrl => {
                                return { index, uploadedUrl };
                            })
                            .catch(error => {
                                throw new Error(`Failed to upload image for leader: ${name}`);
                            });
                        // Store leader name for error reporting
                        uploadPromise.leaderName = name;
                        uploadPromises.push(uploadPromise);
                    }
                }
                
                // Generate unique key: use originalKey if exists, otherwise create timestamp-based key
                const uniqueKey = originalKey || `leader_${Date.now()}_${index}`;
                
                memberData.push({
                    index,
                    section: 'leadership',
                    key: uniqueKey,
                    name: name,
                    position: position,
                    role: position,
                    imageUrl: imageUrl,
                    orderIndex: index + 1,
                    isActive: true
                });
            }
        });
        
        // Upload all images in parallel
        if (uploadPromises.length > 0) {
            
            // Show progress in save button
            const saveBtn = document.querySelector('[data-section="leadership"] .save-section-btn');
            if (saveBtn) {
                saveBtn.innerHTML = `
                    <div class="save-progress">
                        <div class="progress-spinner"></div>
                        <div class="progress-text">Uploading ${uploadPromises.length} leader images...</div>
                        <div class="progress-percentage">0%</div>
                        <div class="progress-details">Preparing uploads...</div>
                    </div>
                `;
            }
            
            // Create a progress tracking promise that resolves when all uploads complete
            // Use Promise.allSettled to allow partial success (some uploads can fail)
            const uploadResults = await Promise.allSettled(uploadPromises.map((promise, i) => 
                promise.then(result => {
                    
                    // Update progress in save button
                    if (saveBtn) {
                        const progressPercentage = Math.round(((i + 1) / uploadPromises.length) * 100);
                        const progressPercent = saveBtn.querySelector('.progress-percentage');
                        const progressDetails = saveBtn.querySelector('.progress-details');
                        if (progressPercent) {
                            progressPercent.textContent = `${progressPercentage}%`;
                        }
                        if (progressDetails) {
                            progressDetails.textContent = `${i + 1}/${uploadPromises.length} completed`;
                        }
                    }
                    
                    return result;
                }).catch(error => {
                    
                    // Update progress to show failure
                    if (saveBtn) {
                        const progressDetails = saveBtn.querySelector('.progress-details');
                        if (progressDetails) {
                            progressDetails.textContent = `${i + 1}/${uploadPromises.length} completed (some failed)`;
                        }
                    }
                    
                    throw error;
                })
            ));
            
            // Count successful and failed uploads
            const successfulUploads = uploadResults.filter(result => result.status === 'fulfilled').length;
            const failedUploads = uploadResults.filter(result => result.status === 'rejected').length;
            
            // Collect failed leader names for detailed error reporting
            const failedLeaderNames = [];
            uploadResults.forEach((result, i) => {
                if (result.status === 'rejected') {
                    // Find the member by checking the original upload promise index
                    const originalPromise = uploadPromises[i];
                    if (originalPromise && originalPromise.leaderName) {
                        failedLeaderNames.push(originalPromise.leaderName);
                    }
                }
            });
            
            if (failedLeaderNames.length > 0) {
            }
            
            // Update image URLs with uploaded results (only successful ones)
            uploadResults.forEach((result, i) => {
                if (result.status === 'fulfilled' && result.value) {
                    const { index, uploadedUrl } = result.value;
                    const member = memberData.find(m => m.index === index);
                    if (member) {
                        member.imageUrl = uploadedUrl;
                    }
                } else {
                }
            });
            
            if (successfulUploads > 0) {
                if (failedUploads > 0) {
                    // Show UI notification for partial success with specific failed leaders
                    const failedNames = failedLeaderNames.length > 0 ? ` (${failedLeaderNames.join(', ')})` : '';
                    this.showNotification('warning', `Leadership saved! ${successfulUploads} images uploaded successfully, ${failedUploads} failed${failedNames}.`);
                } else {
                    // Show UI notification for full success
                    this.showNotification('success', `Leadership saved! All ${successfulUploads} images uploaded successfully.`);
                }
            } else if (failedUploads > 0) {
                // Show UI notification for complete failure with specific failed leaders
                const failedNames = failedLeaderNames.length > 0 ? ` (${failedLeaderNames.join(', ')})` : '';
                this.showNotification('error', `Leadership saved but all ${failedUploads} image uploads failed${failedNames}. Using existing images.`);
            }
        }
        
        // Add all member data to leaders
        leaders.push(...memberData.map(m => ({
            section: m.section,
            key: m.key,
            name: m.name,
            position: m.position,
            role: m.role,
            imageUrl: m.imageUrl,
            orderIndex: m.orderIndex,
            isActive: m.isActive
        })));

        // Add deleted members for database cleanup
        if (this.deletedLeadershipMembers.length > 0) {
            this.deletedLeadershipMembers.forEach(deletedMember => {
                const deleteItem = {
                    section: 'leadership',
                    key: deletedMember.key,
                    name: deletedMember.name,
                    position: '',
                    role: '',
                    imageUrl: '',
                    orderIndex: 0,
                    isActive: false, // Mark as inactive for deletion
                    _delete: true // Flag to indicate this should be deleted
                };
                leaders.push(deleteItem);
            });
        }

        return leaders;
    }

    /**
     * Collect facilities section data
     */
    async collectFacilitiesData() {
        const facilities = [];
        const facilityElements = document.querySelectorAll('.facility-card');
        const sectionTitle = document.getElementById('facilities-title')?.value || 'Our Facilities';
        
        // Collect facility data and handle image uploads
        const facilityData = [];
        const uploadPromises = [];
        
        facilityElements.forEach((element, index) => {
            const title = element.querySelector('.facility-title')?.value || '';
            const content = element.querySelector('.facility-content')?.value || '';
            const imageUrlInput = element.querySelector('.facility-image-url');
            const imageUrl = imageUrlInput?.value || '';
            const fileInput = element.querySelector('.facility-image-upload');
            const selectedFile = fileInput?.files?.[0];
            
            // Get original key from data attribute, or generate new one
            const originalKey = element.getAttribute('data-original-key');
            const key = originalKey || `facility_${Date.now()}_${index}`;
            
            if (title || content) {
                const facility = {
                    index: index,
                    section: 'facilities',
                    key: key,
                    title: title,
                    content: content,
                    imageUrl: imageUrl,
                    orderIndex: index + 1
                };
                
                // Check if there's a new image to upload
                if (selectedFile) {
                    const uploadPromise = this.uploadFacilityImage(selectedFile, title)
                        .then(uploadedUrl => {
                            return { index, uploadedUrl };
                        })
                        .catch(error => {
                            console.error(`Error uploading image for facility ${title}:`, error);
                            throw new Error(`Failed to upload image for facility: ${title}`);
                        });
                    uploadPromises.push(uploadPromise);
                }
                
                facilityData.push(facility);
            }
        });
        
        // Upload images in parallel if any
        if (uploadPromises.length > 0) {
            
            // Show progress in save button
            const saveBtn = document.querySelector('[data-section="facilities"] .save-section-btn');
            if (saveBtn) {
                saveBtn.innerHTML = `
                    <div class="save-progress">
                        <div class="progress-spinner"></div>
                        <div class="progress-text">Uploading ${uploadPromises.length} facility images...</div>
                        <div class="progress-percentage">0%</div>
                        <div class="progress-details">Preparing uploads...</div>
                    </div>
                `;
            }
            
            // Create a progress tracking promise that resolves when all uploads complete
            const uploadResults = await Promise.allSettled(uploadPromises.map((promise, i) => 
                promise.then(result => {
                    
                    // Update progress in save button
                    if (saveBtn) {
                        const progressPercentage = Math.round(((i + 1) / uploadPromises.length) * 100);
                        const progressPercent = saveBtn.querySelector('.progress-percentage');
                        const progressDetails = saveBtn.querySelector('.progress-details');
                        if (progressPercent) {
                            progressPercent.textContent = `${progressPercentage}%`;
                        }
                        if (progressDetails) {
                            progressDetails.textContent = `${i + 1}/${uploadPromises.length} completed`;
                        }
                    }
                    
                    return result;
                }).catch(error => {
                    console.error(`❌ Facility upload ${i + 1}/${uploadPromises.length} failed:`, error);
                    
                    // Update progress to show failure
                    if (saveBtn) {
                        const progressDetails = saveBtn.querySelector('.progress-details');
                        if (progressDetails) {
                            progressDetails.textContent = `${i + 1}/${uploadPromises.length} completed (some failed)`;
                        }
                    }
                    
                    throw error;
                })
            ));
            
            // Count successful and failed uploads
            const successfulUploads = uploadResults.filter(result => result.status === 'fulfilled').length;
            const failedUploads = uploadResults.filter(result => result.status === 'rejected').length;
            
            
            // Update image URLs with uploaded results (only successful ones)
            uploadResults.forEach((result, i) => {
                if (result.status === 'fulfilled' && result.value) {
                    const { index, uploadedUrl } = result.value;
                    const facility = facilityData.find(f => f.index === index);
                    if (facility) {
                        facility.imageUrl = uploadedUrl;
                    }
                } else {
                }
            });
            
            if (successfulUploads > 0) {
                if (failedUploads > 0) {
                }
            } else if (failedUploads > 0) {
            }
        }
        
        // Add deleted facilities for database cleanup
        if (this.deletedFacilities.length > 0) {
            this.deletedFacilities.forEach(deletedFacility => {
                const deleteItem = {
                    section: 'facilities',
                    key: deletedFacility.key,
                    title: '',
                    content: '',
                    imageUrl: '',
                    orderIndex: 0,
                    isActive: false, // Mark as inactive for deletion
                    _delete: true // Flag to indicate this should be deleted
                };
                facilities.push(deleteItem);
            });
        }

        // Add section title entry
        facilities.push({
            section: 'facilities',
            key: 'section_title',
            title: sectionTitle,
            orderIndex: 0,
            isActive: true
        });

        // Add all facility data to facilities
        facilities.push(...facilityData.map(f => ({
            section: f.section,
            key: f.key,
            title: f.title,
            content: f.content,
            imageUrl: f.imageUrl,
            orderIndex: f.orderIndex,
            isActive: true
        })));

        return facilities;
    }

    /**
     * Collect achievements section data
     */
    collectAchievementsData() {
        const achievements = [];
        const achievementElements = document.querySelectorAll('.achievement-card');
        const sectionTitle = document.getElementById('achievements-title')?.value || 'Our Achievements';
        
        // Add deleted achievements for database cleanup
        if (this.deletedAchievements.length > 0) {
            this.deletedAchievements.forEach(deletedAchievement => {
                const deleteItem = {
                    section: 'achievements',
                    key: deletedAchievement.key,
                    title: '',
                    content: '',
                    icon: '',
                    orderIndex: 0,
                    isActive: false, // Mark as inactive for deletion
                    _delete: true // Flag to indicate this should be deleted
                };
                achievements.push(deleteItem);
            });
        }

        // Add section title entry
        achievements.push({
            section: 'achievements',
            key: 'section_title',
            title: sectionTitle,
            orderIndex: 0,
            isActive: true
        });
        
        achievementElements.forEach((element, index) => {
            const title = element.querySelector('.achievement-title')?.value || '';
            const content = element.querySelector('.achievement-content')?.value || '';
            const icon = element.querySelector('.achievement-icon-select')?.value || 'award';
            
            // Get original key from data attribute, or generate new one
            const originalKey = element.getAttribute('data-original-key');
            const key = originalKey || `achievement_${Date.now()}_${index}`;
            
            if (title || content) {
                achievements.push({
                    section: 'achievements',
                    key: key,
                    title: title,
                    content: content,
                    icon: icon,
                    orderIndex: index + 1,
                    isActive: true
                });
            }
        });

        return achievements;
    }

    /**
     * Collect testimonials section data
     */
    async collectTestimonialsData() {
        const testimonials = [];
        const testimonialElements = document.querySelectorAll('.testimonial-card');
        const sectionTitle = document.getElementById('testimonials-title')?.value || 'What People Say';
        const sectionSubtitle = document.getElementById('testimonials-subtitle')?.value || 'Hear from our community';
        
        // Add deleted testimonials for database cleanup
        if (this.deletedTestimonials.length > 0) {
            this.deletedTestimonials.forEach(deletedTestimonial => {
                const deleteItem = {
                    section: 'testimonials',
                    key: deletedTestimonial.key,
                    name: '',
                    content: '',
                    role: '',
                    rating: null,
                    imageUrl: '',
                    orderIndex: 0,
                    isActive: false, // Mark as inactive for deletion
                    _delete: true // Flag to indicate this should be deleted
                };
                testimonials.push(deleteItem);
            });
        }

        // Add section title and subtitle entry
        testimonials.push({
            section: 'testimonials',
            key: 'section_title',
            title: sectionTitle,
            content: sectionSubtitle,
            orderIndex: 0,
            isActive: true
        });
        
        // Collect testimonial data and handle image uploads
        const testimonialData = [];
        const uploadPromises = [];
        
        testimonialElements.forEach((element, index) => {
            const name = element.querySelector('.testimonial-name')?.value || '';
            const content = element.querySelector('.testimonial-content')?.value || '';
            const role = element.querySelector('.testimonial-role')?.value || '';
            const rating = element.querySelector('.testimonial-rating')?.value || '';
            const imageUrlInput = element.querySelector('.testimonial-image-url');
            const imageUrl = imageUrlInput?.value || '';
            const fileInput = element.querySelector('.testimonial-image-upload');
            const selectedFile = fileInput?.files?.[0];
            
            // Get original key from data attribute, or generate new one
            const originalKey = element.getAttribute('data-original-key');
            const key = originalKey || `testimonial_${Date.now()}_${index}`;
            
            if (name || content) {
                const testimonial = {
                    index: index,
                    section: 'testimonials',
                    key: key,
                    name: name,
                    content: content,
                    role: role,
                    rating: rating ? parseInt(rating) : null,
                    imageUrl: imageUrl,
                    orderIndex: index + 1
                };
                
                // Check if there's a new image to upload
                if (selectedFile) {
                    const uploadPromise = this.uploadTestimonialImage(selectedFile, name)
                        .then(uploadedUrl => {
                            testimonial.imageUrl = uploadedUrl;
                        })
                        .catch(error => {
                            console.error(`❌ Image upload failed for ${name}:`, error);
                            // Continue with existing image URL if upload fails
                        });
                    uploadPromises.push(uploadPromise);
                }
                
                testimonialData.push(testimonial);
            }
        });

        // Wait for all image uploads to complete
        if (uploadPromises.length > 0) {
            try {
                await Promise.allSettled(uploadPromises);
            } catch (error) {
                console.error('❌ Some testimonial image uploads failed:', error);
            }
        }

        // Add all testimonial data to testimonials
        testimonials.push(...testimonialData.map(t => ({
            section: t.section,
            key: t.key,
            name: t.name,
            content: t.content,
            role: t.role,
            rating: t.rating,
            imageUrl: t.imageUrl,
            orderIndex: t.orderIndex,
            isActive: true
        })));

        return testimonials;
    }

    /**
     * Upload testimonial image to Cloudinary
     */
    async uploadTestimonialImage(file, testimonialName) {
        try {
            // Skip optimization for very small files to speed up upload
            let optimizedFile = file;
            if (file.size > 300000) { // Only optimize files larger than 300KB
                optimizedFile = await this.optimizeImageFile(file);
            }
            
            // Convert optimized file to base64
            const base64 = await this.fileToBase64(optimizedFile);
            
            if (!base64) {
                throw new Error('Failed to convert file to base64');
            }
            
            // Create sanitized folder name
            const sanitizedName = testimonialName.toLowerCase()
                .replace(/[^a-z0-9\s]/g, '')
                .replace(/\s+/g, '-')
                .substring(0, 50);
            
            const folder = `marigold-school/about/testimonials/${sanitizedName}`;
            
            
            // Add timeout and abort controller for faster failure detection
            const controller = new AbortController();
            const timeoutId = setTimeout(() => {
                console.error('Upload timeout - aborting request');
                controller.abort();
            }, 30000); // 30 second timeout - give enough time for upload
            
            const response = await fetch('/api/upload/image', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    imageData: base64,
                    fileName: `${sanitizedName}-${Date.now()}`,
                    folder: folder
                }),
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Upload failed');
            }
            
            const result = await response.json();
            return result.url;
            
        } catch (error) {
            console.error('Error uploading testimonial image:', error);
            throw error;
        }
    }

    /**
     * Collect CTA section data
     */
    collectCTAData() {
        const title = document.getElementById('cta-title')?.value || 'Ready to Join Our Community?';
        const content = document.getElementById('cta-content')?.value || 'Take the first step towards your child\'s bright future. Apply now or schedule a visit to experience our excellence firsthand.';
        const primaryButtonText = document.getElementById('cta-button-text')?.value || 'Apply Now';
        const primaryButtonUrl = document.getElementById('cta-button-url')?.value || '/application';
        const secondaryButtonText = document.getElementById('cta-secondary-text')?.value || 'Schedule a Visit';
        const secondaryButtonUrl = document.getElementById('cta-secondary-url')?.value || '/contact';
        
        return [
            {
                section: 'cta',
                key: 'cta_title',
                title: title,
                content: content,
                orderIndex: 1
            },
            {
                section: 'cta',
                key: 'cta_apply_button',
                title: primaryButtonText,
                linkUrl: primaryButtonUrl,
                description: 'Start your educational journey with us',
                orderIndex: 1
            },
            {
                section: 'cta',
                key: 'cta_visit_button',
                title: secondaryButtonText,
                linkUrl: secondaryButtonUrl,
                description: 'Come and see our campus',
                orderIndex: 2
            }
        ];
    }

    /**
     * Setup section click handlers
     */
    setupSectionClickHandlers() {
        document.addEventListener('click', (e) => {
            const sectionItem = e.target.closest('[data-about-section]');
            if (sectionItem) {
                const section = sectionItem.getAttribute('data-about-section');
                this.loadSection(section);
            }
        });
    }

    /**
     * Load specific section editor
     */
    async loadSection(section) {
        this.currentSection = section;
        
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
            this.initializeSaveButton(section);
            
            // Reinitialize Lucide icons after content injection
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
            
            // Setup section-specific event handlers
            if (section === 'hero') {
                this.setupHeroImageUploadHandlers();
            } else if (section === 'timeline') {
                this.setupTimelineEventHandlers();
            } else if (section === 'why_choose_us') {
                // No event handlers needed since add/remove buttons are removed
            } else if (section === 'leadership') {
                this.setupLeadershipEventHandlers();
            } else if (section === 'facilities') {
                this.setupFacilitiesEventHandlers();
            } else if (section === 'achievements') {
                this.setupAchievementsEventHandlers();
            } else if (section === 'testimonials') {
                this.setupTestimonialsEventHandlers();
            }
            
        } else {
            console.error('Section list or editor not found!');
        }
    }

    /**
     * Get section editor HTML
     */
    getSectionEditor(section) {
        const breadcrumb = this.getBreadcrumbHTML(section);
        let editorContent = '';

        switch (section) {
            case 'hero':
                editorContent = this.getHeroEditor();
                break;
            case 'timeline':
                editorContent = this.getTimelineEditor();
                break;
            case 'mission_vision_values':
                editorContent = this.getMissionVisionValuesEditor();
                break;
            case 'principal':
                editorContent = this.getPrincipalEditor();
                break;
            case 'quick_facts':
                editorContent = this.getQuickFactsEditor();
                break;
            case 'why_choose_us':
                editorContent = this.getWhyChooseUsEditor();
                break;
            case 'leadership':
                editorContent = this.getLeadershipEditor();
                break;
            case 'facilities':
                editorContent = this.getFacilitiesEditor();
                break;
            case 'achievements':
                editorContent = this.getAchievementsEditor();
                break;
            case 'testimonials':
                editorContent = this.getTestimonialsEditor();
                break;
            case 'cta':
                editorContent = this.getCTAEditor();
                break;
        }

        // Sections that have their own save buttons inside the form
        const sectionsWithOwnSaveButtons = ['timeline', 'mission_vision_values', 'principal', 'quick_facts', 'why_choose_us', 'leadership', 'facilities', 'achievements', 'testimonials'];

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
                
                ${!sectionsWithOwnSaveButtons.includes(section) ? `
                <div class="editor-actions">
                    <button class="btn btn-primary save-section-btn" data-section="${section}">
                        <i data-lucide="save"></i>
                        Save Changes
                    </button>
                    <button class="btn btn-outline preview-btn" data-section="${section}">
                        <i data-lucide="eye"></i>
                        Preview
                    </button>
                </div>
                ` : ''}
            </div>
        `;
    }

    /**
     * Get breadcrumb HTML
     */
    getBreadcrumbHTML(section) {
        return `
            <div class="breadcrumb">
                <button class="back-button" data-action="back-to-section-list">
                    <i data-lucide="arrow-left"></i>
                </button>
                <span class="breadcrumb-separator">/</span>
                <span class="breadcrumb-current">${this.sections[section].name}</span>
            </div>
        `;
    }

    /**
     * Check if we're in about content context
     */
    isAboutContentContext(backButton) {
        // First check if we're in the about content section
        if (this.currentSection !== 'about-content') {
            return false;
        }
        
        // Check if the back button is within an about content context
        if (backButton && backButton.closest('#about-content-section, .about-content-editor, .section-editor, .breadcrumb')) {
            return true;
        }
        
        // Fallback: check if current content is about content-related
        const pageContent = document.getElementById('page-content');
        if (!pageContent) return false;
        
        return pageContent.innerHTML.includes('about-content-section') || 
               pageContent.querySelector('#about-content-section, .about-content-editor, .section-editor, .breadcrumb') !== null;
    }

    /**
     * Back to section list
     */
    backToSectionList() {
        const sectionList = document.getElementById('sectionList');
        const sectionEditor = document.getElementById('sectionEditor');
        const pageHeader = document.querySelector('.page-header');
        
        if (sectionList && sectionEditor) {
            sectionList.style.display = 'block';
            sectionEditor.style.display = 'none';
            
            // Show page header
            if (pageHeader) {
                pageHeader.style.display = 'block';
            }
        }
    }

    /**
     * Update breadcrumb
     */
    updateBreadcrumb(section) {
        // Implementation for breadcrumb updates
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

            
            // Add cache-busting to always get fresh data
            const cacheBuster = `&t=${Date.now()}`;
            const response = await fetch(`/api/content/about?section=${section}${cacheBuster}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                }
            });
            

            if (!response.ok) {
                throw new Error('Failed to load section data');
            }

            const sectionData = await response.json();
            
            if (!sectionData.success) {
                throw new Error(sectionData.message || 'API request failed');
            }
            
            // Handle different response structures
            let data = sectionData.data || sectionData.content;
            
            if (!data) {
                console.warn('No data returned for section:', section);
                this.populateSectionEditor(section, []);
                return;
            }
            
            // If data is an object with nested structure, convert to array format
            if (typeof data === 'object' && !Array.isArray(data)) {
                // Convert object to array format for consistency
                const dataArray = [];
                for (const [key, value] of Object.entries(data)) {
                    if (typeof value === 'object' && value !== null) {
                        dataArray.push({
                            key: key,
                            ...value
                        });
                    }
                }
                data = dataArray;
            }
            
            this.populateSectionEditor(section, data);
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
            case 'hero':
                this.populateHeroEditor(data);
                break;
            case 'timeline':
                this.populateTimelineEditor(data);
                break;
            case 'mission_vision_values':
                this.populateMissionVisionValuesEditor(data);
                break;
            case 'principal':
                this.populatePrincipalEditor(data);
                break;
            case 'quick_facts':
                this.populateQuickFactsEditor(data);
                break;
            case 'why_choose_us':
                this.populateWhyChooseUsEditor(data);
                break;
            case 'leadership':
                this.populateLeadershipEditor(data);
                break;
            case 'facilities':
                this.populateFacilitiesEditor(data);
                break;
            case 'achievements':
                this.populateAchievementsEditor(data);
                break;
            case 'testimonials':
                this.populateTestimonialsEditor(data);
                break;
            case 'cta':
                this.populateCTAEditor(data);
                break;
        }
    }

    // Section Editors
    getHeroEditor() {
        return `
            <form class="section-editor-form">
                <div class="form-grid">
                    <div class="form-group">
                        <label for="hero-title">Title</label>
                        <input type="text" id="hero-title" class="form-input" placeholder="About Marigold School">
                    </div>
                    <div class="form-group">
                        <label for="hero-subtitle">Subtitle</label>
                        <input type="text" id="hero-subtitle" class="form-input" placeholder="Discover the rich history, values, and vibrant community...">
                    </div>
                    <div class="form-group full-width">
                        <label>Background Image</label>
                        <div class="image-upload-container">
                            <input type="file" id="hero-image-upload" class="image-upload-input" accept="image/*" style="display: none;">
                            <button type="button" id="hero-image-select-btn" class="btn btn-outline image-select-btn">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="upload" class="lucide lucide-upload"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7,10 12,15 17,10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                                Select Image
                            </button>
                            <div class="image-preview-container" id="hero-image-preview-container" style="display: none;">
                                <img id="hero-image-preview" class="image-preview" alt="Preview">
                                <button type="button" id="hero-image-remove-btn" class="btn btn-sm btn-danger image-remove-btn">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="trash-2" class="lucide lucide-trash-2"><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                    Remove
                                </button>
                            </div>
                            <input type="hidden" id="hero-image-url" name="imageUrl">
                        </div>
                        <small class="form-help">Upload a background image for the hero section (PNG, JPG, GIF up to 25MB)</small>
                                </div>
                                <div class="form-group">
                        <label for="hero-apply-text">Apply Now Button Text</label>
                        <input type="text" id="hero-apply-text" class="form-input" placeholder="Apply Now">
                                </div>
                                <div class="form-group">
                        <label for="hero-visit-text">Visit Button Text</label>
                        <input type="text" id="hero-visit-text" class="form-input" placeholder="Schedule a Visit">
                                </div>
                </div>
            </form>
        `;
    }

    getTimelineEditor() {
        return `
            <form class="section-editor-form">
                <div class="section-header">
                    <h3>Timeline Section</h3>
                    <p>Manage the school's history and key milestones</p>
                </div>
                
                <div class="form-grid">
                                <div class="form-group">
                        <label for="timeline-title">Section Title</label>
                        <input type="text" id="timeline-title" class="form-input" placeholder="Our Story">
                    </div>
                    <div class="form-group">
                        <label for="timeline-subtitle">Section Subtitle</label>
                        <input type="text" id="timeline-subtitle" class="form-input" placeholder="A legacy of excellence spanning over 25 years">
                    </div>
                </div>
                
                <div class="timeline-events-container">
                    <div class="section-header">
                        <h4>Timeline Events</h4>
                        <button type="button" class="btn btn-secondary" id="add-timeline-event-btn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="plus" class="lucide lucide-plus"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
                            Add Timeline Event
                        </button>
                    </div>
                    
                    <div id="timeline-events" class="timeline-events-list">
                        <!-- Timeline events will be populated here -->
                    </div>
                                </div>
                
                <div class="section-actions">
                    <button type="button" class="btn btn-primary save-section-btn" data-section="timeline">
                        <span class="btn-text">Save Changes</span>
                    </button>
                                </div>
                            </form>
        `;
    }

    getMissionVisionValuesEditor() {
        return `
            <form class="section-editor-form">
                <div class="form-group">
                    <label for="mission-title">Section Title</label>
                    <input type="text" id="mission-title" class="form-input" placeholder="Our Mission">
                        </div>
                <div class="mission-cards-container">
                    <div class="mission-card-editor">
                        <h4>Mission</h4>
                        <div class="form-group">
                            <label for="mission-content">Mission Statement</label>
                            <textarea id="mission-content" class="form-textarea" rows="3" placeholder="To provide quality education..."></textarea>
                    </div>
                    </div>
                    <div class="mission-card-editor">
                        <h4>Vision</h4>
                        <div class="form-group">
                            <label for="vision-content">Vision Statement</label>
                            <textarea id="vision-content" class="form-textarea" rows="3" placeholder="To be a leading educational institution..."></textarea>
                        </div>
                    </div>
                    <div class="mission-card-editor">
                        <h4>Values</h4>
                        <div class="form-group">
                            <label for="values-content">Core Values</label>
                            <textarea id="values-content" class="form-textarea" rows="3" placeholder="Excellence, Integrity, Innovation..."></textarea>
                        </div>
                    </div>
                </div>
                
                <div class="section-actions">
                    <button type="button" class="btn btn-primary save-section-btn" data-section="mission_vision_values">
                        <span class="btn-text">Save Changes</span>
                    </button>
                </div>
            </form>
        `;
    }

    getPrincipalEditor() {
        return `
            <form class="section-editor-form">
                <div class="form-grid">
                    <div class="form-group">
                        <label for="principal-title">Section Title</label>
                        <input type="text" id="principal-title" class="form-input" placeholder="A Word from Our Principal">
                            </div>
                    <div class="form-group">
                        <label for="principal-name">Principal Name</label>
                        <input type="text" id="principal-name" class="form-input" placeholder="Mrs. Sunita Sharma">
                        </div>
                    <div class="form-group full-width">
                        <label for="principal-message">Principal Message</label>
                        <textarea id="principal-message" class="form-textarea" rows="4" placeholder="Welcome to Marigold School..."></textarea>
                    </div>
                    <div class="form-group full-width">
                        <label for="principal-image">Principal Image</label>
                        <div class="image-upload-container">
                            <input type="file" id="principal-image-upload" class="image-upload-input" accept="image/*" style="display: none;">
                            <button type="button" id="principal-image-select-btn" class="btn btn-outline image-select-btn">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="upload" class="lucide lucide-upload"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7,10 12,15 17,10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                                Select Image
                            </button>
                            <div class="image-preview-container" id="principal-image-preview-container" style="display: none;">
                                <img id="principal-image-preview" class="image-preview" alt="Preview">
                                <button type="button" id="principal-image-remove-btn" class="btn btn-sm btn-danger image-remove-btn">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="trash-2" class="lucide lucide-trash-2"><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                    Remove
                                </button>
                            </div>
                            <input type="hidden" id="principal-image-url" name="imageUrl">
                        </div>
                        <small class="form-help">Upload principal image (PNG, JPG, GIF up to 25MB)</small>
                                </div>
                                <div class="form-group">
                        <label for="principal-qualifications">Qualifications (one per line)</label>
                        <textarea id="principal-qualifications" class="form-textarea" rows="3" placeholder="M.Ed. in Educational Leadership&#10;20+ Years Experience"></textarea>
                                </div>
                                    </div>
                
                <div class="section-actions">
                    <button type="button" class="btn btn-primary save-section-btn" data-section="principal">
                        <span class="btn-text">Save Changes</span>
                    </button>
                                    </div>
            </form>
        `;
    }

    getQuickFactsEditor() {
        return `
            <div class="section-editor">
                <div class="editor-header">
                    <div class="editor-title">
                        <span class="section-icon">📊</span>
                        <h2>Quick Facts</h2>
                    </div>
                    <p>Manage the key statistics and facts displayed on your about page.</p>
                </div>
                
                <div class="editor-content">
                    <div class="form-group">
                        <label for="quick-facts-title">Section Title</label>
                        <input type="text" id="quick-facts-title" class="form-input" placeholder="Our results in numbers">
                    </div>
                    
                    <div class="tabs-container">
                        <div class="tabs-nav">
                            <button class="tab-btn active" data-tab="fact1">Fact 1</button>
                            <button class="tab-btn" data-tab="fact2">Fact 2</button>
                            <button class="tab-btn" data-tab="fact3">Fact 3</button>
                            <button class="tab-btn" data-tab="fact4">Fact 4</button>
                        </div>
                        
                        <div class="tab-content active" id="fact1">
                            <form class="section-form">
                                <div class="form-group">
                                    <label for="fact1Number">Number</label>
                                    <input type="text" id="fact1Number" name="fact1Number" class="form-input" placeholder="25+">
                                </div>
                                <div class="form-group">
                                    <label for="fact1Label">Label</label>
                                    <input type="text" id="fact1Label" name="fact1Label" class="form-input" placeholder="Years of Excellence">
                                </div>
                            </form>
                        </div>
                        
                        <div class="tab-content" id="fact2">
                            <form class="section-form">
                                <div class="form-group">
                                    <label for="fact2Number">Number</label>
                                    <input type="text" id="fact2Number" name="fact2Number" class="form-input" placeholder="50+">
                                </div>
                                <div class="form-group">
                                    <label for="fact2Label">Label</label>
                                    <input type="text" id="fact2Label" name="fact2Label" class="form-input" placeholder="Qualified Teachers">
                                </div>
                            </form>
                        </div>
                        
                        <div class="tab-content" id="fact3">
                            <form class="section-form">
                                <div class="form-group">
                                    <label for="fact3Number">Number</label>
                                    <input type="text" id="fact3Number" name="fact3Number" class="form-input" placeholder="1000+">
                                </div>
                                <div class="form-group">
                                    <label for="fact3Label">Label</label>
                                    <input type="text" id="fact3Label" name="fact3Label" class="form-input" placeholder="Students Enrolled">
                                </div>
                            </form>
                        </div>
                        
                        <div class="tab-content" id="fact4">
                            <form class="section-form">
                                <div class="form-group">
                                    <label for="fact4Number">Number</label>
                                    <input type="text" id="fact4Number" name="fact4Number" class="form-input" placeholder="20+">
                                </div>
                                <div class="form-group">
                                    <label for="fact4Label">Label</label>
                                    <input type="text" id="fact4Label" name="fact4Label" class="form-input" placeholder="Awards & Achievements">
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                
                <div class="editor-actions">
                    <button class="btn btn-primary save-section-btn" data-section="quick_facts">
                        <i data-lucide="save"></i>
                        Save Changes
                    </button>
                    <button class="btn btn-outline preview-btn" data-section="quick_facts">
                        <i data-lucide="eye"></i>
                        Preview
                    </button>
                </div>
            </div>
        `;
    }

    getWhyChooseUsEditor() {
        return `
            <form class="section-editor-form">
                <div class="section-header">
                    <h3>Why Choose Us Section</h3>
                    <p>Manage the features that make your school unique</p>
                </div>
                
                <div class="form-grid">
                    <div class="form-group">
                        <label for="why-choose-title">Section Title</label>
                        <input type="text" id="why-choose-title" class="form-input" placeholder="Why Choose Us">
                        </div>
                    </div>

                <div class="features-container">
                    <div class="section-header">
                        <h4>Features</h4>
                        <button type="button" class="btn btn-secondary" id="add-feature-btn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="plus" class="lucide lucide-plus"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
                            Add Feature
                        </button>
                            </div>
                    
                    <div id="features-list" class="features-list">
                        <!-- Features will be populated here -->
                        </div>
                </div>
                
                <div class="section-actions">
                    <button type="button" class="btn btn-primary save-section-btn" data-section="why_choose_us">
                        <span class="btn-text">Save Changes</span>
                    </button>
                </div>
            </form>
        `;
    }

    getLeadershipEditor() {
        return `
            <form class="section-editor-form">
                <div class="section-header">
                    <h3>Leadership Team Section</h3>
                    <p>Manage your school's leadership and administration team</p>
                </div>
                
                <div class="form-grid">
                                <div class="form-group">
                        <label for="leadership-title">Section Title</label>
                        <input type="text" id="leadership-title" class="form-input" placeholder="Our Leadership Team">
                                </div>
                                <div class="form-group">
                        <label for="leadership-subtitle">Section Subtitle</label>
                        <input type="text" id="leadership-subtitle" class="form-input" placeholder="Meet the dedicated professionals guiding our institution">
                                </div>
                </div>
                
                <div class="leadership-container">
                    <div class="section-header">
                                    <h4>Team Members</h4>
                        <button type="button" class="btn btn-primary add-leader">
                            <i data-lucide="plus"></i> Add Member
                        </button>
                                    </div>
                    
                    <div id="leadership-list" class="leadership-list">
                        <!-- Leadership team will be populated here -->
                    </div>
                </div>
                
                <div class="form-actions">
                    <button type="button" class="btn btn-primary save-section-btn" data-section="leadership">
                        <i data-lucide="save"></i>
                        Save Changes
                    </button>
                    <button type="button" class="btn btn-outline preview-btn" data-section="leadership">
                        <i data-lucide="eye"></i>
                        Preview
                    </button>
                </div>
            </form>
        `;
    }

    getFacilitiesEditor() {
        return `
            <form class="section-editor-form">
                <div class="section-header">
                    <h3>Infrastructure & Facilities Section</h3>
                    <p>Manage your school's infrastructure and facilities information</p>
                </div>
                
                    <div class="form-group">
                        <label for="facilities-title">Section Title</label>
                        <input type="text" id="facilities-title" class="form-input" placeholder="Our Facilities">
                </div>
                
                <div class="facilities-container">
                    <div class="section-header">
                        <h4>Facilities</h4>
                        <button type="button" class="btn btn-primary add-facility">
                            <i data-lucide="plus"></i> Add Facility
                        </button>
                    </div>
                    
                    <div id="facilities-list" class="facilities-list">
                        <!-- Facilities will be populated here -->
                    </div>
                </div>
                
                <div class="section-actions">
                    <button type="button" class="btn btn-primary save-section-btn" data-section="facilities">
                        <i data-lucide="save"></i> Save Changes
                    </button>
                </div>
            </form>
        `;
    }

    getAchievementsEditor() {
        return `
            <form class="section-editor-form">
                <div class="section-header">
                    <h3>Achievements & Awards Section</h3>
                    <p>Manage your school's achievements, awards, and recognitions</p>
                        </div>
                
                <div class="form-grid">
                    <div class="form-group">
                        <label for="achievements-title">Section Title</label>
                        <input type="text" id="achievements-title" class="form-input" placeholder="Our Achievements">
                    </div>
                </div>
                
                <div class="achievements-container">
                    <div class="section-header">
                        <h4>Achievements</h4>
                        <button type="button" class="btn btn-primary add-achievement">
                            <i data-lucide="plus"></i> Add Achievement
                        </button>
                    </div>
                    
                    <div id="achievements-list" class="achievements-list">
                        <!-- Achievements will be populated here -->
                    </div>
                </div>
                
                <div class="section-actions">
                    <button type="button" class="btn btn-primary save-section-btn" data-section="achievements">
                        <i data-lucide="save"></i> Save Changes
                    </button>
                </div>
            </form>
        `;
    }

    getTestimonialsEditor() {
        return `
            <form class="section-editor-form">
                <div class="section-header">
                    <h3>Testimonials Section</h3>
                    <p>Manage testimonials from parents, students, and alumni</p>
                </div>
                
                <div class="form-grid">
                    <div class="form-group">
                        <label for="testimonials-title">Section Title</label>
                        <input type="text" id="testimonials-title" class="form-input" placeholder="What People Say">
                    </div>
                    <div class="form-group">
                        <label for="testimonials-subtitle">Section Subtitle</label>
                        <input type="text" id="testimonials-subtitle" class="form-input" placeholder="Hear from our community">
                    </div>
                </div>
                
                <div class="testimonials-container">
                    <div class="section-header">
                        <h4>Testimonials</h4>
                        <button type="button" class="btn btn-primary add-testimonial">
                            <i data-lucide="plus"></i> Add Testimonial
                        </button>
                    </div>
                    
                    <div id="testimonials-list" class="testimonials-list">
                        <!-- Testimonials will be populated here -->
                    </div>
                </div>
                
                <div class="section-actions">
                    <button type="button" class="btn btn-primary save-section-btn" data-section="testimonials">
                        <i data-lucide="save"></i> Save Changes
                    </button>
                </div>
            </form>
        `;
    }

    getCTAEditor() {
        return `
            <form class="section-editor-form">
                <div class="section-header">
                    <h3>Call to Action Section</h3>
                    <p>Configure the final call-to-action section that encourages visitors to take action</p>
                </div>
                
                <div class="cta-container">
                    <div class="form-group">
                        <label for="cta-title">Section Title</label>
                        <input type="text" id="cta-title" class="form-input" placeholder="Ready to Join Our Community?">
                    </div>
                    
                    <div class="form-group">
                        <label for="cta-content">Main Content</label>
                        <textarea id="cta-content" class="form-textarea" rows="3" placeholder="Take the first step towards your child's bright future. Apply now or schedule a visit to experience our excellence firsthand."></textarea>
                    </div>
                    
                    
                    <div class="form-grid">
                        <div class="form-group">
                            <label for="cta-button-text">Primary Button Text</label>
                            <input type="text" id="cta-button-text" class="form-input" placeholder="Apply Now">
                        </div>
                        <div class="form-group">
                            <label for="cta-button-url">Primary Button URL</label>
                            <input type="url" id="cta-button-url" class="form-input" placeholder="/application">
                        </div>
                    </div>
                    
                    <div class="form-grid">
                        <div class="form-group">
                            <label for="cta-secondary-text">Secondary Button Text</label>
                            <input type="text" id="cta-secondary-text" class="form-input" placeholder="Schedule a Visit">
                        </div>
                        <div class="form-group">
                            <label for="cta-secondary-url">Secondary Button URL</label>
                            <input type="url" id="cta-secondary-url" class="form-input" placeholder="/contact">
                        </div>
                    </div>
                </div>
            </form>
        `;
    }

    // Population methods for each section
    populateHeroEditor(data) {
        
        if (!Array.isArray(data)) {
            console.warn('Hero editor data is not an array:', data);
            return;
        }
        
        // Find specific hero data items
        const heroTitle = data.find(item => item.key === 'hero_title') || {};
        const heroApplyButton = data.find(item => item.key === 'hero_apply_button') || {};
        const heroVisitButton = data.find(item => item.key === 'hero_visit_button') || {};
        
        // Get form elements
        const titleInput = document.getElementById('hero-title');
        const subtitleInput = document.getElementById('hero-subtitle');
        const imageUrlInput = document.getElementById('hero-image-url');
        const imagePreviewContainer = document.getElementById('hero-image-preview-container');
        const imagePreview = document.getElementById('hero-image-preview');
        const applyTextInput = document.getElementById('hero-apply-text');
        const visitTextInput = document.getElementById('hero-visit-text');
        
        // Populate form fields
        if (titleInput) {
            titleInput.value = heroTitle.title || '';
        }
        
        if (subtitleInput) {
            subtitleInput.value = heroTitle.content || '';
        }
        
        // Handle image preview
        if (heroTitle.imageUrl && heroTitle.imageUrl.trim() !== '') {
            if (imageUrlInput) imageUrlInput.value = heroTitle.imageUrl;
            if (imagePreview) imagePreview.src = heroTitle.imageUrl;
            if (imagePreviewContainer) imagePreviewContainer.style.display = 'block';
        } else {
            if (imagePreviewContainer) imagePreviewContainer.style.display = 'none';
            if (imageUrlInput) imageUrlInput.value = '';
        }
        
        if (applyTextInput) {
            applyTextInput.value = heroApplyButton.title || 'Apply Now';
        }
        
        if (visitTextInput) {
            visitTextInput.value = heroVisitButton.title || 'Schedule a Visit';
        }
        
    }

    /**
     * Setup timeline event handlers
     */
    setupTimelineEventHandlers() {
        const addTimelineEventBtn = document.getElementById('add-timeline-event-btn');
        
        if (addTimelineEventBtn) {
            // Remove any existing event listeners by cloning the button
            const newBtn = addTimelineEventBtn.cloneNode(true);
            addTimelineEventBtn.parentNode.replaceChild(newBtn, addTimelineEventBtn);
            
            // Add the event listener to the new button
            newBtn.addEventListener('click', () => {
                this.addTimelineEvent();
            });
        }
    }

    /**
     * Add a new timeline event
     */
    addTimelineEvent() {
        const timelineContainer = document.getElementById('timeline-events');
        if (!timelineContainer) return;
        
        const eventCount = timelineContainer.children.length;
        const eventElement = document.createElement('div');
        eventElement.className = 'timeline-event-card';
        eventElement.setAttribute('data-original-key', `timeline_${Date.now()}`);
        
        eventElement.innerHTML = `
            <div class="timeline-event-header">
                <div class="timeline-event-number">${eventCount + 1}</div>
                <div class="timeline-event-info">
                    <h5>Timeline Event ${eventCount + 1}</h5>
                    <span class="timeline-event-date-badge">No date</span>
                </div>
                <button type="button" class="btn btn-sm btn-danger remove-timeline-event-btn" title="Remove Event">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="trash-2" class="lucide lucide-trash-2"><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
            </div>
            
            <div class="timeline-event-content">
                <div class="form-group">
                    <label>Event Title</label>
                    <input type="text" class="timeline-event-title form-input" placeholder="Enter event title">
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label>Event Date</label>
                        <input type="text" class="timeline-event-date form-input" placeholder="e.g., 1995">
                    </div>
                    <div class="form-group">
                        <label>Order</label>
                        <input type="number" class="timeline-event-order form-input" value="${eventCount + 2}" placeholder="Order">
                    </div>
                </div>
                
                <div class="form-group">
                    <label>Event Description</label>
                    <textarea class="timeline-event-content-text form-textarea" rows="3" placeholder="Describe this important milestone..."></textarea>
                </div>
            </div>
        `;
        
        timelineContainer.appendChild(eventElement);
        
        // Add event listener for remove button
        const removeBtn = eventElement.querySelector('.remove-timeline-event-btn');
        if (removeBtn) {
            removeBtn.addEventListener('click', () => {
                eventElement.remove();
                this.updateTimelineEventNumbers();
            });
        }
        
        // Reinitialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        this.showNotification('success', 'Timeline event added');
    }

    /**
     * Update timeline event numbers after adding/removing
     */
    updateTimelineEventNumbers() {
        const timelineContainer = document.getElementById('timeline-events');
        if (!timelineContainer) return;
        
        Array.from(timelineContainer.children).forEach((element, index) => {
            const numberElement = element.querySelector('.timeline-event-number');
            const titleElement = element.querySelector('.timeline-event-info h5');
            
            if (numberElement) numberElement.textContent = index + 1;
            if (titleElement) titleElement.textContent = `Timeline Event ${index + 1}`;
        });
    }

    /**
     * Setup hero image upload handlers
     */
    setupHeroImageUploadHandlers() {
        const imageUploadInput = document.getElementById('hero-image-upload');
        const imageSelectBtn = document.getElementById('hero-image-select-btn');
        const imagePreviewContainer = document.getElementById('hero-image-preview-container');
        const imagePreview = document.getElementById('hero-image-preview');
        const imageRemoveBtn = document.getElementById('hero-image-remove-btn');
        const imageUrlInput = document.getElementById('hero-image-url');

        if (!imageUploadInput || !imageSelectBtn) return;

        // Prevent duplicate event listeners by removing existing ones first
        const newSelectBtn = imageSelectBtn.cloneNode(true);
        imageSelectBtn.parentNode.replaceChild(newSelectBtn, imageSelectBtn);

        // Click select button to trigger file input
        newSelectBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            imageUploadInput.click();
        });

        // Handle file selection - just show preview, don't upload yet
        imageUploadInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            // Validate file
            if (!this.validateImageFile(file)) {
                // Reset file input if validation fails
                e.target.value = '';
                return;
            }

            // Store file for later upload
            this.selectedHeroImageFile = file;

            // Create preview using FileReader (data URL instead of blob URL)
            const reader = new FileReader();
            reader.onload = (event) => {
                const previewUrl = event.target.result;
                
                // Show preview
                if (imagePreview) imagePreview.src = previewUrl;
                if (imagePreviewContainer) imagePreviewContainer.style.display = 'block';
            };
            reader.readAsDataURL(file);
            
            // Clear any existing image URL (will be set after upload on save)
            if (imageUrlInput) imageUrlInput.value = '';
            
            this.showNotification('info', 'Image selected. Click Save to upload and save changes.');
        });

        // Handle image removal
        if (imageRemoveBtn) {
            // Prevent duplicate event listeners by removing existing ones first
            const newRemoveBtn = imageRemoveBtn.cloneNode(true);
            imageRemoveBtn.parentNode.replaceChild(newRemoveBtn, imageRemoveBtn);
            
            newRemoveBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                // Clear stored file
                this.selectedHeroImageFile = null;
                
                // Clear preview
                if (imagePreview) imagePreview.src = '';
                if (imagePreviewContainer) imagePreviewContainer.style.display = 'none';
                
                // Clear inputs
                if (imageUrlInput) imageUrlInput.value = '';
                if (imageUploadInput) imageUploadInput.value = '';
                
                this.showNotification('info', 'Image removed');
            });
        }
    }

    /**
     * Validate image file
     */
    validateImageFile(file) {
        const maxSize = 25 * 1024 * 1024; // 25MB
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

        if (!allowedTypes.includes(file.type)) {
            this.showNotification('error', 'Please select a valid image file (PNG, JPG, GIF)');
            return false;
        }

        if (file.size > maxSize) {
            this.showNotification('error', 'Image size must be less than 25MB');
            return false;
        }

        return true;
    }

    /**
     * Initialize SaveButton component for a section
     */
    initializeSaveButton(section) {
        const saveButtonElement = document.querySelector('.save-section-btn');
        if (!saveButtonElement) {
            console.warn(`Save button not found for section: ${section}`);
            return null;
        }

        // Determine if this section has images
        const sectionsWithImages = ['hero', 'principal', 'why_choose_us', 'leadership', 'facilities', 'testimonials'];
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
                collecting: hasImages ? 45 : 25,
                saving: hasImages ? 75 : 50,
                success: 100
            },
            onSave: async (button) => {
                
                const token = localStorage.getItem('adminToken');
                if (!token) {
                    throw new Error('Authentication required');
                }

                button.setProgress('Collecting data...', hasImages ? 45 : 25);
                
                // Collect section data
                let sectionData;
                if (hasImages) {
                    // Handle image uploads first
                    const imageFiles = this.collectImageFiles(section);
                    if (imageFiles.length > 0) {
                        button.setProgress('Uploading images...', 10);
                        const uploadedUrls = await button.uploadImagesInParallel(imageFiles, async (file, progressCallback) => {
                            return await this.uploadImageToCloudinary(file, progressCallback);
                        });
                        
                        // Update form with uploaded URLs
                        this.updateFormWithUploadedUrls(section, uploadedUrls);
                    }
                }
                
                button.setProgress('Collecting data...', hasImages ? 45 : 25);
                sectionData = await this.collectSectionData(section);
                
                if (!sectionData) {
                    throw new Error('Unable to save - please check your input');
                }

                button.setProgress('Saving to database...', hasImages ? 75 : 50);
                
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 15000);
                
                const response = await fetch('/api/content/about', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ section, data: sectionData }),
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
                this.showNotification('success', 'Section saved successfully!');
                
                // Navigate back to about page section list after successful save
                setTimeout(() => {
                    this.navigateToAboutPage();
                }, 1500);
            },
            onError: (error) => {
                console.error('❌ Save error:', error);
                
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
     * Collect image files for upload from the current section
     */
    collectImageFiles(section) {
        const imageFiles = [];
        
        // For principal section, check stored file first
        if (section === 'principal' && this.principalSelectedFile) {
            imageFiles.push(this.principalSelectedFile);
            return imageFiles;
        }
        
        // Look for file inputs with selected files
        const fileInputs = document.querySelectorAll('input[type="file"]');
        
        fileInputs.forEach((input, index) => {
            if (input.files && input.files.length > 0) {
                for (let i = 0; i < input.files.length; i++) {
                    imageFiles.push(input.files[i]);
                }
            }
        });
        
        return imageFiles;
    }

    /**
     * Update form fields with uploaded image URLs
     */
    updateFormWithUploadedUrls(section, uploadedUrls) {
        
        if (section === 'hero' && uploadedUrls.length > 0) {
            const heroImageInput = document.getElementById('hero-image-url');
            if (heroImageInput) {
                heroImageInput.value = uploadedUrls[0];
            } else {
                console.error('❌ hero-image-url input not found!');
            }
        }
        
        if (section === 'principal' && uploadedUrls.length > 0) {
            const principalImageInput = document.getElementById('principal-image-url');
            if (principalImageInput) {
                principalImageInput.value = uploadedUrls[0];
                // Clear the stored file after successful upload
                this.principalSelectedFile = null;
            } else {
                console.error('❌ principal-image-url input not found!');
            }
        }
    }

    /**
     * Setup principal image upload handlers
     */
    setupPrincipalImageUploadHandlers() {
        const fileInput = document.getElementById('principal-image-upload');
        const selectBtn = document.getElementById('principal-image-select-btn');
        const previewContainer = document.getElementById('principal-image-preview-container');
        const previewImg = document.getElementById('principal-image-preview');
        const removeBtn = document.getElementById('principal-image-remove-btn');
        const imageUrlInput = document.getElementById('principal-image-url');
        
        if (!fileInput || !selectBtn || !previewContainer || !previewImg || !removeBtn) {
            console.warn('Principal image upload elements not found');
            return;
        }
        
        // Initialize storage for selected file (to preserve it after cloning)
        if (!this.principalSelectedFile) {
            this.principalSelectedFile = null;
        }
        
        // Remove existing event listeners by cloning elements
        const newSelectBtn = selectBtn.cloneNode(true);
        const newRemoveBtn = removeBtn.cloneNode(true);
        selectBtn.parentNode.replaceChild(newSelectBtn, selectBtn);
        removeBtn.parentNode.replaceChild(newRemoveBtn, removeBtn);
        
        // Select image button
        newSelectBtn.addEventListener('click', (e) => {
            e.preventDefault();
            fileInput.click();
        });
        
        // File input change - DON'T clone this one, we need to preserve the files
        // Instead, remove old listeners by tracking them
        if (this.principalFileInputHandler) {
            fileInput.removeEventListener('change', this.principalFileInputHandler);
        }
        
        this.principalFileInputHandler = (e) => {
            const file = e.target.files[0];
            if (file) {
                // Validate file
                if (!['image/jpeg', 'image/jpg', 'image/png', 'image/gif'].includes(file.type)) {
                    this.showNotification('error', 'Please select a valid image file (PNG, JPG, GIF)');
                    fileInput.value = '';
                    this.principalSelectedFile = null;
                    return;
                }
                
                if (file.size > 25 * 1024 * 1024) {
                    this.showNotification('error', 'Image size must be less than 25MB');
                    fileInput.value = '';
                    this.principalSelectedFile = null;
                    return;
                }
                
                // Store the file for later upload
                this.principalSelectedFile = file;
                
                // Preview image
                const reader = new FileReader();
                reader.onload = (event) => {
                    previewImg.src = event.target.result;
                    previewContainer.style.display = 'block';
                };
                reader.readAsDataURL(file);
            }
        };
        
        fileInput.addEventListener('change', this.principalFileInputHandler);
        
        // Remove image button
        newRemoveBtn.addEventListener('click', (e) => {
            e.preventDefault();
            previewImg.src = '';
            previewContainer.style.display = 'none';
            if (imageUrlInput) imageUrlInput.value = '';
            fileInput.value = '';
            this.principalSelectedFile = null;
        });
    }

    /**
     * Upload image to Cloudinary
     */
    async uploadImageToCloudinary(file, progressCallback) {
        try {
            // Optimize file size before base64 conversion
            const optimizedFile = await this.optimizeImageFile(file);
            
            // Convert file to base64 with optimized settings
            const base64Data = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                    if (progressCallback) progressCallback(20);
                    resolve(reader.result);
                };
                reader.onerror = reject;
                reader.readAsDataURL(optimizedFile);
            });

            if (progressCallback) progressCallback(40);

            // Determine folder based on current section
            let folder = 'marigold-school/about/hero'; // default
            if (this.currentSection === 'principal') {
                folder = 'marigold-school/about/principal';
            } else if (this.currentSection === 'hero') {
                folder = 'marigold-school/about/hero';
            }

            const requestData = {
                imageData: base64Data,
                fileName: optimizedFile.name,
                folder: folder
            };

            if (progressCallback) progressCallback(60);

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout for image upload
            
            // Get authentication token
            const token = localStorage.getItem('adminToken');
            if (!token) {
                throw new Error('Access token required - please log in again');
            }

            const response = await fetch('/api/upload/image', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(requestData),
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);

            if (progressCallback) progressCallback(90);

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Upload failed: Access token required - please log in again');
                } else if (response.status === 403) {
                    throw new Error('Upload failed: Access denied - insufficient permissions');
                } else {
                    const errorData = await response.json();
                    throw new Error(`Upload failed: ${errorData.message || 'Unknown error'}`);
                }
            }

            const result = await response.json();
            if (progressCallback) progressCallback(100);
            return result.url; // Backend returns 'url', not 'imageUrl'
        } catch (error) {
            console.error('Upload error:', error);
            throw error;
        }
    }

    /**
     * Optimize image file for faster upload
     */
    async optimizeImageFile(file) {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            img.onload = () => {
                // Calculate optimal dimensions (max 1920px width, maintain aspect ratio)
                const maxWidth = 1920;
                const maxHeight = 1080;
                let { width, height } = img;
                
                if (width > maxWidth || height > maxHeight) {
                    const ratio = Math.min(maxWidth / width, maxHeight / height);
                    width = width * ratio;
                    height = height * ratio;
                }
                
                canvas.width = width;
                canvas.height = height;
                
                // Draw image with optimization
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                ctx.drawImage(img, 0, 0, width, height);
                
                // Convert to blob with high compression for speed
                canvas.toBlob((blob) => {
                    const optimizedFile = new File([blob], file.name, {
                        type: 'image/jpeg',
                        lastModified: Date.now()
                    });
                    resolve(optimizedFile);
                }, 'image/jpeg', 0.85); // 85% quality for good balance of size/speed
            };
            
            // Use FileReader instead of URL.createObjectURL to avoid CSP issues
            const reader = new FileReader();
            reader.onload = (e) => {
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });
    }

    populateTimelineEditor(data) {
        
        if (!Array.isArray(data)) {
            console.warn('Timeline editor data is not an array:', data);
            return;
        }
        
        // Find section title and subtitle from the data
        const titleEvent = data.find(item => item.key === 'timeline_title');
        const titleInput = document.getElementById('timeline-title');
        const subtitleInput = document.getElementById('timeline-subtitle');
        
        if (titleInput) titleInput.value = titleEvent?.title || 'Our Story';
        if (subtitleInput) subtitleInput.value = titleEvent?.content || 'A legacy of excellence spanning over 25 years';
        
        const timelineContainer = document.getElementById('timeline-events');
        
        if (!timelineContainer) {
            console.error('Timeline container not found!');
            return;
        }
        
        // Clear existing content
        timelineContainer.innerHTML = '';
        
        // Filter out the section title event and sort by orderIndex
        const timelineEvents = data.filter(item => item.key !== 'timeline_title')
                                  .sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
        
        
        // Populate timeline events with modern design
        timelineEvents.forEach((event, index) => {
            const eventElement = document.createElement('div');
            eventElement.className = 'timeline-event-card';
            eventElement.setAttribute('data-original-key', event.key); // Store original key
            eventElement.innerHTML = `
                <div class="timeline-event-header">
                    <div class="timeline-event-number">${index + 1}</div>
                    <div class="timeline-event-info">
                        <h5>Timeline Event ${index + 1}</h5>
                        <span class="timeline-event-date-badge">${event.date || 'No date'}</span>
                    </div>
                    <button type="button" class="btn btn-sm btn-danger remove-timeline-event-btn" title="Remove Event">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="trash-2" class="lucide lucide-trash-2"><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                </div>
                
                <div class="timeline-event-content">
                    <div class="form-group">
                        <label>Event Title</label>
                        <input type="text" class="timeline-event-title form-input" value="${event.title || ''}" placeholder="Enter event title">
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label>Event Date</label>
                            <input type="text" class="timeline-event-date form-input" value="${event.date || ''}" placeholder="e.g., 1995">
                        </div>
                        <div class="form-group">
                            <label>Order</label>
                            <input type="number" class="timeline-event-order form-input" value="${event.orderIndex || index + 1}" placeholder="Order">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label>Event Description</label>
                        <textarea class="timeline-event-content-text form-textarea" rows="3" placeholder="Describe this important milestone...">${event.content || ''}</textarea>
                    </div>
                </div>
            `;
            timelineContainer.appendChild(eventElement);
            
            // Add event listener for remove button
            const removeBtn = eventElement.querySelector('.remove-timeline-event-btn');
            if (removeBtn) {
                removeBtn.addEventListener('click', () => {
                    eventElement.remove();
                    this.updateTimelineEventNumbers();
                });
            }
        });
        
        
        // Reinitialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
    }


    populateMissionVisionValuesEditor(data) {
        if (!Array.isArray(data)) {
            console.warn('Mission/Vision/Values editor data is not an array:', data);
            return;
        }
        
        const sectionTitleData = data.find(item => item.key === 'section_title') || {};
        const missionData = data.find(item => item.key === 'mission') || {};
        const visionData = data.find(item => item.key === 'vision') || {};
        const valuesData = data.find(item => item.key === 'values') || {};
        
        // Populate section title
        const sectionTitleInput = document.getElementById('mission-title');
        if (sectionTitleInput) {
            sectionTitleInput.value = sectionTitleData.title || 'Our Mission, Vision & Values';
        }
        
        const missionInput = document.getElementById('mission-content');
        const visionInput = document.getElementById('vision-content');
        const valuesInput = document.getElementById('values-content');
        
        if (missionInput) missionInput.value = missionData.content || '';
        if (visionInput) visionInput.value = visionData.content || '';
        if (valuesInput) valuesInput.value = valuesData.content || '';
    }

    populatePrincipalEditor(data) {
        if (!Array.isArray(data)) {
            console.warn('Principal editor data is not an array:', data);
            return;
        }
        
        const sectionTitleData = data.find(item => item.key === 'principal_section_title') || {};
        const principalData = data.find(item => item.key === 'principal_info') || {};
        
        const titleInput = document.getElementById('principal-title');
        const nameInput = document.getElementById('principal-name');
        const messageInput = document.getElementById('principal-message');
        const imageUrlInput = document.getElementById('principal-image-url');
        const qualificationsInput = document.getElementById('principal-qualifications');
        
        if (titleInput) titleInput.value = sectionTitleData.title || 'A Word from Our Principal';
        if (nameInput) nameInput.value = principalData.name || '';
        if (messageInput) messageInput.value = principalData.content || '';
        if (imageUrlInput) imageUrlInput.value = principalData.imageUrl || '';
        if (qualificationsInput) qualificationsInput.value = principalData.qualifications || '';
        
        // Display existing image if available
        if (principalData.imageUrl) {
            const previewContainer = document.getElementById('principal-image-preview-container');
            const previewImg = document.getElementById('principal-image-preview');
            if (previewContainer && previewImg) {
                previewImg.src = principalData.imageUrl;
                previewContainer.style.display = 'block';
            }
        }
        
        // Setup image upload event handlers
        this.setupPrincipalImageUploadHandlers();
        
        // Reinitialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    populateQuickFactsEditor(data) {
        if (!Array.isArray(data)) {
            console.warn('Quick facts editor data is not an array:', data);
            return;
        }
        
        
        // Find section title
        const sectionTitleData = data.find(item => item.key === 'section_title');
        const factsData = data.filter(item => item.key !== 'section_title');
        
        // Populate section title
        const titleInput = document.getElementById('quick-facts-title');
        if (titleInput && sectionTitleData) {
            titleInput.value = sectionTitleData.title || 'Our results in numbers';
        }
        
        // Populate fact tabs
        const factKeys = ['years_excellence', 'qualified_teachers', 'students_enrolled', 'awards_achievements'];
        
        factsData.forEach((fact, index) => {
            const factKey = factKeys[index];
            if (factKey) {
                const numberInput = document.getElementById(`fact${index + 1}Number`);
                const labelInput = document.getElementById(`fact${index + 1}Label`);
                
                if (numberInput) numberInput.value = fact.content || '';
                if (labelInput) labelInput.value = fact.title || '';
            }
        });
        
        
        // Initialize tab functionality
        this.initializeQuickFactsTabs();
    }
    
    /**
     * Initialize tab functionality for quick facts
     */
    initializeQuickFactsTabs() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');
        
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.getAttribute('data-tab');
                
                // Remove active class from all tabs and contents
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                // Add active class to clicked tab and corresponding content
                btn.classList.add('active');
                const targetContent = document.getElementById(targetTab);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            });
        });
    }

    populateWhyChooseUsEditor(data) {
        if (!Array.isArray(data)) {
            console.warn('Why choose us editor data is not an array:', data);
            return;
        }
        
        const sectionTitleData = data.find(item => item.key === 'section_title') || {};
        const reasonsData = data.filter(item => item.section === 'why_choose_us' && item.key !== 'section_title');
        
        // Populate section title
        const sectionTitleInput = document.getElementById('why-choose-title');
        if (sectionTitleInput) {
            sectionTitleInput.value = sectionTitleData.title || 'Why Choose Us';
        }
        
        const reasonsContainer = document.getElementById('features-list');
        if (!reasonsContainer) return;
        
        // Clear existing content
        reasonsContainer.innerHTML = '';
        
        // Populate reasons
        reasonsData.forEach((reason, index) => {
            const reasonElement = document.createElement('div');
            reasonElement.className = 'feature-card';
            reasonElement.setAttribute('data-original-key', reason.key); // Store original key
            
            // Handle existing image display
            const existingImageHtml = reason.imageUrl ? `
                <div class="image-preview-container" style="display: block;">
                    <img class="image-preview" src="${reason.imageUrl}" alt="Preview" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px; margin-left: 10px;">
                    <button type="button" class="btn btn-sm btn-danger image-remove-btn" style="margin-left: 5px;">
                        <i data-lucide="x"></i>
                    </button>
                </div>
            ` : `
                <div class="image-preview-container" style="display: none;">
                    <img class="image-preview" src="" alt="Preview" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px; margin-left: 10px;">
                    <button type="button" class="btn btn-sm btn-danger image-remove-btn" style="margin-left: 5px;">
                        <i data-lucide="x"></i>
                    </button>
                </div>
            `;
            
            reasonElement.innerHTML = `
                <div class="feature-card-header">
                    <div class="feature-number">${index + 1}</div>
                    <h5>Feature ${index + 1}</h5>
                    <button type="button" class="btn btn-sm btn-danger remove-feature-btn" title="Remove Feature">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="trash-2" class="lucide lucide-trash-2"><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                </div>
                
                <div class="feature-card-content">
                    <div class="form-group">
                        <label>Feature Title</label>
                        <input type="text" class="why-choose-title form-input" value="${reason.title || ''}" placeholder="Enter feature title">
                    </div>
                    
                    <div class="form-group">
                        <label>Feature Description</label>
                        <textarea class="why-choose-content form-textarea" rows="2" placeholder="Describe this feature...">${reason.content || ''}</textarea>
                    </div>
                    
                    <div class="form-group">
                        <label>Feature Image</label>
                        <div class="image-upload-container">
                            <input type="file" class="feature-image-upload" accept="image/*" style="display: none;">
                            <button type="button" class="btn btn-outline image-select-btn">
                                <i data-lucide="upload"></i> Select Image
                            </button>
                            ${existingImageHtml}
                        </div>
                        <input type="hidden" class="why-choose-image-url" value="${reason.imageUrl || ''}">
                        <small class="form-help">PNG, JPG, GIF up to 25MB</small>
                    </div>
                </div>
            `;
            reasonsContainer.appendChild(reasonElement);
        });
        
        // Setup image upload handlers for each feature card
        this.setupFeatureImageUploadHandlers();
        
        // Setup "Add Feature" button handler
        this.setupFeatureEventHandlers();
        
        // Reinitialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
    }

    /**
     * Setup image upload handlers for feature cards
     */
    setupFeatureImageUploadHandlers() {
        const featureCards = document.querySelectorAll('.feature-card');
        
        featureCards.forEach(card => {
            const fileInput = card.querySelector('.feature-image-upload');
            const selectBtn = card.querySelector('.image-select-btn');
            const previewContainer = card.querySelector('.image-preview-container');
            const previewImg = card.querySelector('.image-preview');
            const removeBtn = card.querySelector('.image-remove-btn');
            const imageUrlInput = card.querySelector('.why-choose-image-url');
            
            if (!fileInput || !selectBtn || !previewContainer || !previewImg || !removeBtn || !imageUrlInput) return;
            
            // Remove existing event listeners by cloning elements
            const newSelectBtn = selectBtn.cloneNode(true);
            const newRemoveBtn = removeBtn.cloneNode(true);
            selectBtn.parentNode.replaceChild(newSelectBtn, selectBtn);
            removeBtn.parentNode.replaceChild(newRemoveBtn, removeBtn);
            
            // Select image button
            newSelectBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                fileInput.click();
            });
            
            // File input change
            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    this.validateFeatureImageFile(file, (valid, error) => {
                        if (valid) {
                            this.previewFeatureImage(file, previewImg, previewContainer);
                            // Store file for upload when save is clicked
                            card.setAttribute('data-selected-file', JSON.stringify({
                                name: file.name,
                                size: file.size,
                                type: file.type
                            }));
                        } else {
                            this.showNotification('error', error);
                            fileInput.value = '';
                        }
                    });
                }
            });
            
            // Remove image button
            newRemoveBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.removeFeatureImage(previewContainer, imageUrlInput, fileInput, card);
            });
        });
    }

    /**
     * Validate feature image file
     */
    validateFeatureImageFile(file, callback) {
        const maxSize = 25 * 1024 * 1024; // 25MB
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        
        if (!allowedTypes.includes(file.type)) {
            callback(false, 'Please select a valid image file (PNG, JPG, GIF)');
            return;
        }
        
        if (file.size > maxSize) {
            callback(false, 'Image size must be less than 25MB');
            return;
        }
        
        callback(true, null);
    }

    /**
     * Preview feature image
     */
    previewFeatureImage(file, previewImg, previewContainer) {
        const reader = new FileReader();
        reader.onload = (e) => {
            previewImg.src = e.target.result;
            previewContainer.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }

    /**
     * Remove feature image
     */
    removeFeatureImage(previewContainer, imageUrlInput, fileInput, card) {
        const previewImg = card.querySelector('.image-preview');
        if (previewImg) previewImg.src = '';
        previewContainer.style.display = 'none';
        imageUrlInput.value = '';
        fileInput.value = '';
        card.removeAttribute('data-selected-file');
    }

    /**
     * Setup feature event handlers
     */
    setupFeatureEventHandlers() {
        const addFeatureBtn = document.getElementById('add-feature-btn');
        
        if (addFeatureBtn) {
            // Remove any existing event listeners by cloning the button
            const newBtn = addFeatureBtn.cloneNode(true);
            addFeatureBtn.parentNode.replaceChild(newBtn, addFeatureBtn);
            
            // Add the event listener to the new button
            newBtn.addEventListener('click', () => {
                this.addFeature();
            });
        }

        // Setup remove button handlers
        const removeButtons = document.querySelectorAll('.remove-feature-btn');
        removeButtons.forEach((btn) => {
            btn.addEventListener('click', (e) => {
                const featureCard = e.target.closest('.feature-card');
                if (featureCard) {
                    featureCard.remove();
                    this.updateFeatureNumbers();
                }
            });
        });
    }

    /**
     * Add a new feature
     */
    addFeature() {
        const featuresContainer = document.getElementById('features-list');
        if (!featuresContainer) return;

        const featureCount = featuresContainer.querySelectorAll('.feature-card').length;
        const newFeatureIndex = featureCount + 1;

        const featureElement = document.createElement('div');
        featureElement.className = 'feature-card';
        featureElement.setAttribute('data-original-key', `feature_${Date.now()}`);

        featureElement.innerHTML = `
            <div class="feature-card-header">
                <div class="feature-number">${newFeatureIndex}</div>
                <h5>Feature ${newFeatureIndex}</h5>
                <button type="button" class="btn btn-sm btn-danger remove-feature-btn" title="Remove Feature">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="trash-2" class="lucide lucide-trash-2"><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
            </div>
            
            <div class="feature-card-content">
                <div class="form-group">
                    <label>Feature Title</label>
                    <input type="text" class="why-choose-title form-input" placeholder="Enter feature title">
                </div>
                
                <div class="form-group">
                    <label>Feature Description</label>
                    <textarea class="why-choose-content form-textarea" rows="2" placeholder="Describe this feature..."></textarea>
                </div>
                
                <div class="form-group">
                    <label>Feature Image</label>
                    <div class="image-upload-container">
                        <input type="file" class="feature-image-upload" accept="image/*" style="display: none;">
                        <button type="button" class="btn btn-outline image-select-btn">
                            <i data-lucide="upload"></i> Select Image
                        </button>
                        <div class="image-preview-container" style="display: none;">
                            <img class="image-preview" src="" alt="Preview" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px; margin-left: 10px;">
                            <button type="button" class="btn btn-sm btn-danger image-remove-btn" style="margin-left: 5px;">
                                <i data-lucide="x"></i>
                            </button>
                        </div>
                    </div>
                    <input type="hidden" class="why-choose-image-url" value="">
                    <small class="form-help">PNG, JPG, GIF up to 1.5MB</small>
                </div>
            </div>
        `;

        featuresContainer.appendChild(featureElement);

        // Re-setup image upload handlers
        this.setupFeatureImageUploadHandlers();
        
        // Re-setup event handlers
        this.setupFeatureEventHandlers();

        // Reinitialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    /**
     * Update feature numbers after adding/removing
     */
    updateFeatureNumbers() {
        const featureCards = document.querySelectorAll('.feature-card');
        featureCards.forEach((card, index) => {
            const featureNumber = card.querySelector('.feature-number');
            const featureTitle = card.querySelector('.feature-card-header h5');
            
            if (featureNumber) {
                featureNumber.textContent = index + 1;
            }
            if (featureTitle) {
                featureTitle.textContent = `Feature ${index + 1}`;
            }
        });
    }

    /**
     * Upload feature image to Cloudinary
     */
    async uploadFeatureImage(file, featureTitle) {
        try {
            // Convert file to base64
            const base64 = await this.fileToBase64(file);
            
            if (!base64) {
                throw new Error('Failed to convert file to base64');
            }
            
            // Create sanitized folder name
            const sanitizedTitle = featureTitle.toLowerCase()
                .replace(/[^a-z0-9\s]/g, '')
                .replace(/\s+/g, '-')
                .substring(0, 50);
            
            const folder = `marigold-school/about/why-choose-us/${sanitizedTitle}`;
            
            
            const response = await fetch('/api/upload/image', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    imageData: base64,
                    fileName: `${sanitizedTitle}-${Date.now()}`,
                    folder: folder
                })
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Upload failed');
            }
            
            const result = await response.json();
            return result.url;
            
        } catch (error) {
            console.error('Error uploading feature image:', error);
            throw error;
        }
    }

    async uploadLeaderImage(file, leaderName) {
        try {
            // Skip optimization for very small files to speed up upload
            let optimizedFile = file;
            if (file.size > 300000) { // Only optimize files larger than 300KB
                optimizedFile = await this.optimizeImageFile(file);
            }
            
            // Convert optimized file to base64
            const base64 = await this.fileToBase64(optimizedFile);
            
            if (!base64) {
                throw new Error('Failed to convert file to base64');
            }
            
            // Create sanitized folder name
            const sanitizedName = leaderName.toLowerCase()
                .replace(/[^a-z0-9\s]/g, '')
                .replace(/\s+/g, '-')
                .substring(0, 50);
            
            const folder = `marigold-school/about/leadership/${sanitizedName}`;
            
            
            // Add timeout and abort controller for faster failure detection
            const controller = new AbortController();
            const timeoutId = setTimeout(() => {
                console.error('Upload timeout - aborting request');
                controller.abort();
            }, 30000); // 30 second timeout - give enough time for upload
            
            const response = await fetch('/api/upload/image', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    imageData: base64,
                    fileName: `${sanitizedName}-${Date.now()}`,
                    folder: folder
                }),
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Upload failed');
            }
            
            const result = await response.json();
            return result.url;
            
        } catch (error) {
            console.error('Error uploading leader image:', error);
            throw error;
        }
    }

    /**
     * Show delete confirmation dialog for leadership member
     */
    showDeleteLeadershipConfirmation(memberCard, memberName) {
        // Use global delete confirmation modal
        window.DeleteConfirmationModal.show({
            title: "Delete Team Member",
            itemName: memberName,
            itemType: "team member",
            warningText: "This action cannot be undone.",
            onConfirm: () => {
                this.confirmDeleteLeadershipMember(memberCard, memberName);
            },
            onCancel: () => {
                // Optional: Add any cancel-specific logic here
            }
        });
    }
    
    /**
     * Confirm delete leadership member
     */
    confirmDeleteLeadershipMember(memberCard, memberName) {
        // Get the original key from the data attribute
        const originalKey = memberCard.getAttribute('data-original-key');
        
        if (originalKey) {
            // Track this member for database deletion
            this.deletedLeadershipMembers.push({
                key: originalKey,
                name: memberName,
                element: memberCard
            });
        }
        
        // Remove from DOM
        memberCard.remove();
        this.showNotification('success', `Team member "${memberName}" removed successfully`);
    }

    /**
     * Upload facility image to Cloudinary
     */
    async uploadFacilityImage(file, facilityName) {
        try {
            // Skip optimization for very small files to speed up upload
            let optimizedFile = file;
            if (file.size > 300000) { // Only optimize files larger than 300KB
                optimizedFile = await this.optimizeImageFile(file);
            }
            
            // Convert optimized file to base64
            const base64 = await this.fileToBase64(optimizedFile);
            
            if (!base64) {
                throw new Error('Failed to convert file to base64');
            }
            
            // Create sanitized folder name
            const sanitizedName = facilityName.toLowerCase()
                .replace(/[^a-z0-9\s]/g, '')
                .replace(/\s+/g, '-')
                .substring(0, 50);
            
            const folder = `marigold-school/about/facilities/${sanitizedName}`;
            
            
            // Add timeout and abort controller for faster failure detection
            const controller = new AbortController();
            const timeoutId = setTimeout(() => {
                console.error('Upload timeout - aborting request');
                controller.abort();
            }, 30000); // 30 second timeout - give enough time for upload
            
            const response = await fetch('/api/upload/image', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    imageData: base64,
                    fileName: `${sanitizedName}-${Date.now()}`,
                    folder: folder
                }),
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Upload failed');
            }
            
            const result = await response.json();
            return result.url;
            
        } catch (error) {
            console.error('Error uploading facility image:', error);
            throw error;
        }
    }

    /**
     * Convert file to base64
     */
    fileToBase64(file) {
        return new Promise((resolve, reject) => {
            // Add timeout for base64 conversion
            const timeout = setTimeout(() => {
                reject(new Error('Base64 conversion timeout'));
            }, 10000); // 10 second timeout - base64 conversion is working fine
            
            const reader = new FileReader();
            reader.onload = () => {
                clearTimeout(timeout);
                const result = reader.result;
                if (result && result.includes(',')) {
                    resolve(result.split(',')[1]); // Extract base64 part after comma
                } else {
                    reject(new Error('Invalid file data'));
                }
            };
            reader.onerror = (error) => {
                clearTimeout(timeout);
                console.error('FileReader error:', error);
                reject(error);
            };
            reader.readAsDataURL(file);
        });
    }


    populateLeadershipEditor(data) {
        if (!Array.isArray(data)) {
            console.warn('Leadership editor data is not an array:', data);
            return;
        }
        
        const leadershipData = data.filter(item => item.section === 'leadership');
        
        // Populate section title and subtitle
        const sectionTitleItem = leadershipData.find(item => item.key === 'section_title');
        const sectionTitleInput = document.getElementById('leadership-title');
        const sectionSubtitleInput = document.getElementById('leadership-subtitle');
        if (sectionTitleInput) {
            sectionTitleInput.value = sectionTitleItem?.title || 'Our Leadership Team';
        }
        if (sectionSubtitleInput) {
            sectionSubtitleInput.value = sectionTitleItem?.content || 'Meet the dedicated professionals guiding our institution';
        }
        
        const leadershipContainer = document.getElementById('leadership-list');
        if (!leadershipContainer) return;
        
        // Clear existing content
        leadershipContainer.innerHTML = '';
        
        // Filter out section_title and populate leadership members
        const memberData = leadershipData.filter(item => item.key !== 'section_title');
        memberData.forEach((leader, index) => {
            const leaderElement = document.createElement('div');
            leaderElement.className = 'leader-card';
            leaderElement.setAttribute('data-original-key', leader.key); // Store original key for updates
            leaderElement.innerHTML = `
                <div class="leader-card-header">
                    <div class="leader-avatar">
                        <div class="avatar-placeholder">
                            <i data-lucide="user"></i>
                        </div>
                    </div>
                    <h5>Member ${index + 1}</h5>
                    <button type="button" class="btn btn-danger btn-sm remove-leadership-member">
                        <i data-lucide="trash-2"></i>
                    </button>
                </div>
                
                <div class="leader-card-content">
                    <div class="form-group">
                        <label>Full Name</label>
                        <input type="text" class="leader-name form-input" value="${leader.name || ''}" placeholder="Enter full name">
                    </div>
                    
                    <div class="form-group">
                        <label>Position</label>
                        <input type="text" class="leader-position form-input" value="${leader.position || ''}" placeholder="e.g., Principal, Vice Principal">
                    </div>
                    
                    <div class="form-group">
                        <label>Profile Image</label>
                        <div class="image-upload-container">
                            <input type="file" class="leader-image-upload" accept="image/png,image/jpg,image/jpeg,image/gif" style="display: none;">
                            <input type="hidden" class="leader-image-url" value="${leader.imageUrl || ''}">
                            <button type="button" class="image-select-btn">
                                <i data-lucide="image"></i>
                                Select Image
                            </button>
                            <div class="image-preview-container" style="${leader.imageUrl ? 'display: block;' : 'display: none;'}">
                                <img src="${leader.imageUrl || ''}" alt="Leader preview" class="image-preview">
                                <button type="button" class="image-remove-btn">
                                    <i data-lucide="x"></i>
                                </button>
                            </div>
                        </div>
                        <small class="form-text">PNG, JPG, GIF up to 25MB</small>
                    </div>
                </div>
            `;
            leadershipContainer.appendChild(leaderElement);
        });
        
        // Reinitialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        // Setup leadership event handlers
        this.setupLeadershipEventHandlers();
        
        // Setup image upload handlers for leadership
        this.setupLeadershipImageUploadHandlers();
    }

    /**
     * Setup leadership event handlers
     */
    setupLeadershipEventHandlers() {
        // Add member button - prevent duplicate listeners
        const addMemberBtn = document.querySelector('.add-leader');
        if (addMemberBtn && !addMemberBtn.hasAttribute('data-listener-added')) {
            addMemberBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.addLeadershipMember();
            });
            addMemberBtn.setAttribute('data-listener-added', 'true');
        }

        // Remove member buttons - prevent duplicate listeners
        document.querySelectorAll('.remove-leadership-member').forEach(btn => {
            if (!btn.hasAttribute('data-listener-added')) {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const memberCard = btn.closest('.leader-card');
                    if (memberCard) {
                        // Get member name for confirmation dialog
                        const nameInput = memberCard.querySelector('.leader-name');
                        const memberName = nameInput ? nameInput.value || 'this member' : 'this member';
                        
                        // Show confirmation dialog
                        this.showDeleteLeadershipConfirmation(memberCard, memberName);
                    }
                });
                btn.setAttribute('data-listener-added', 'true');
            }
        });
    }

    /**
     * Add new leadership member
     */
    addLeadershipMember() {
        const leadershipContainer = document.getElementById('leadership-list');
        if (!leadershipContainer) return;

        const memberCount = leadershipContainer.children.length;
        const newMemberElement = document.createElement('div');
        newMemberElement.className = 'leader-card';
        // Set unique key for new member to avoid database conflicts
        newMemberElement.setAttribute('data-original-key', `leader_${Date.now()}_${memberCount}`);
        newMemberElement.innerHTML = `
            <div class="leader-card-header">
                <div class="leader-avatar">
                    <div class="avatar-placeholder">
                        <i data-lucide="user"></i>
                    </div>
                </div>
                <h5>Member ${memberCount + 1}</h5>
                <button type="button" class="btn btn-danger btn-sm remove-leadership-member">
                    <i data-lucide="trash-2"></i>
                </button>
            </div>
            
            <div class="leader-card-content">
                <div class="form-group">
                    <label>Full Name</label>
                    <input type="text" class="leader-name form-input" placeholder="Enter full name">
                </div>
                
                <div class="form-group">
                    <label>Position</label>
                    <input type="text" class="leader-position form-input" placeholder="e.g., Principal, Vice Principal">
                </div>
                
                <div class="form-group">
                    <label>Profile Image</label>
                    <div class="image-upload-container">
                        <input type="file" class="leader-image-upload" accept="image/png,image/jpg,image/jpeg,image/gif" style="display: none;">
                        <input type="hidden" class="leader-image-url">
                        <button type="button" class="image-select-btn">
                            <i data-lucide="image"></i>
                            Select Image
                        </button>
                        <div class="image-preview-container" style="display: none;">
                            <img alt="Leader preview" class="image-preview">
                            <button type="button" class="image-remove-btn">
                                <i data-lucide="x"></i>
                            </button>
                        </div>
                    </div>
                    <small class="form-text">PNG, JPG, GIF up to 25MB</small>
                </div>
            </div>
        `;
        
        leadershipContainer.appendChild(newMemberElement);
        
        // Reinitialize Lucide icons
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        
        // Setup image upload handlers for the new member
        this.setupLeaderImageUploadHandlers(newMemberElement);
        
        // Add event listener to the new remove button
        const removeBtn = newMemberElement.querySelector('.remove-leadership-member');
        if (removeBtn) {
            removeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                // Get member name for confirmation dialog
                const nameInput = newMemberElement.querySelector('.leader-name');
                const memberName = nameInput ? nameInput.value || 'this member' : 'this member';
                
                // Show confirmation dialog
                this.showDeleteLeadershipConfirmation(newMemberElement, memberName);
            });
        }
        
        // Focus on the new card and scroll to it
        setTimeout(() => {
            // Add a highlight effect to the new card
            newMemberElement.style.border = '2px solid #3b82f6';
            newMemberElement.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
            
            // Scroll to the new card
            newMemberElement.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
            
            // Focus on the first input field (Full Name)
            const nameInput = newMemberElement.querySelector('.leader-name');
            if (nameInput) {
                nameInput.focus();
            }
            
            // Remove the highlight effect after 3 seconds
            setTimeout(() => {
                newMemberElement.style.border = '';
                newMemberElement.style.boxShadow = '';
            }, 3000);
        }, 100);
        
        this.showNotification('success', 'New team member added');
    }

    /**
     * Setup image upload handlers for leadership
     */
    setupLeadershipImageUploadHandlers() {
        document.querySelectorAll('.leader-card').forEach(card => {
            this.setupLeaderImageUploadHandlers(card);
        });
    }

    /**
     * Setup image upload handlers for a single leader card
     */
    setupLeaderImageUploadHandlers(card) {
        const fileInput = card.querySelector('.leader-image-upload');
        const imageUrlInput = card.querySelector('.leader-image-url');
        const selectBtn = card.querySelector('.image-select-btn');
        const previewContainer = card.querySelector('.image-preview-container');
        const previewImg = card.querySelector('.image-preview');
        const removeBtn = card.querySelector('.image-remove-btn');

        if (!fileInput || !selectBtn || !previewContainer || !previewImg || !removeBtn) return;

        // Clone and replace buttons to prevent duplicate event listeners
        const newSelectBtn = selectBtn.cloneNode(true);
        const newRemoveBtn = removeBtn.cloneNode(true);
        
        selectBtn.parentNode.replaceChild(newSelectBtn, selectBtn);
        removeBtn.parentNode.replaceChild(newRemoveBtn, removeBtn);

        // Select button event listener
        newSelectBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            fileInput.click();
        });

        // File input change event
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                this.validateLeaderImageFile(file, (isValid, error) => {
                    if (isValid) {
                        card.setAttribute('data-selected-file', 'true');
                        this.previewLeaderImage(file, previewImg, previewContainer);
                        this.showNotification('success', 'Image selected successfully');
                    } else {
                        this.showNotification('error', error);
                        fileInput.value = '';
                    }
                });
            }
        });

        // Remove button event listener
        newRemoveBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.removeLeaderImage(previewContainer, imageUrlInput, fileInput, card);
        });
    }

    /**
     * Validate leader image file
     */
    validateLeaderImageFile(file, callback) {
        const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif'];
        const maxSize = 25 * 1024 * 1024; // 25MB

        if (!allowedTypes.includes(file.type)) {
            callback(false, 'Please select a valid image file (PNG, JPG, GIF)');
            return;
        }

        if (file.size > maxSize) {
            callback(false, 'Image size must be less than 25MB');
            return;
        }

        callback(true);
    }

    /**
     * Preview leader image
     */
    previewLeaderImage(file, previewImg, previewContainer) {
        const reader = new FileReader();
        reader.onload = (e) => {
            previewImg.src = e.target.result;
            previewContainer.style.display = 'block';
        };
        reader.onerror = (error) => {
            console.error('Error reading file for preview:', error);
        };
        reader.readAsDataURL(file);
    }

    /**
     * Remove leader image
     */
    removeLeaderImage(previewContainer, imageUrlInput, fileInput, card) {
        previewContainer.style.display = 'none';
        previewContainer.querySelector('.image-preview').src = '';
        imageUrlInput.value = '';
        fileInput.value = '';
        card.removeAttribute('data-selected-file');
        this.showNotification('info', 'Image removed');
    }

    populateFacilitiesEditor(data) {
        if (!Array.isArray(data)) {
            console.warn('Facilities editor data is not an array:', data);
            return;
        }
        
        const facilitiesData = data.filter(item => item.section === 'facilities');
        
        // Extract section title from section_title entry
        const sectionTitleEntry = facilitiesData.find(item => item.key === 'section_title');
        const sectionTitle = sectionTitleEntry?.title || 'Our Facilities';
        
        // Populate section title
        const sectionTitleInput = document.getElementById('facilities-title');
        if (sectionTitleInput) {
            sectionTitleInput.value = sectionTitle;
        }
        
        const facilitiesContainer = document.getElementById('facilities-list');
        if (!facilitiesContainer) return;
        
        // Clear existing content
        facilitiesContainer.innerHTML = '';
        
        // Filter out section_title entry and populate facilities
        const actualFacilities = facilitiesData.filter(item => item.key !== 'section_title');
        actualFacilities.forEach((facility, index) => {
            const facilityElement = document.createElement('div');
            facilityElement.className = 'facility-card';
            facilityElement.setAttribute('data-original-key', facility.key);
            facilityElement.innerHTML = `
                <div class="facility-card-header">
                    <div class="facility-icon">
                        <i data-lucide="building"></i>
                    </div>
                    <h5>Facility ${index + 1}</h5>
                    <button type="button" class="btn btn-danger btn-sm remove-facility">
                        <i data-lucide="trash-2"></i>
                    </button>
                </div>
                
                <div class="facility-card-content">
                    <div class="form-group">
                        <label>Facility Name</label>
                        <input type="text" class="facility-title form-input" value="${facility.title || ''}" placeholder="e.g., Library, Science Lab">
                    </div>
                    
                    <div class="form-group">
                        <label>Description</label>
                        <textarea class="facility-content form-textarea" rows="3" placeholder="Describe the facility features and benefits">${facility.content || ''}</textarea>
                    </div>
                    
                    <div class="form-group">
                        <label>Facility Image</label>
                        <div class="image-upload-container">
                            <input type="file" class="facility-image-upload" accept="image/png,image/jpg,image/jpeg,image/gif" style="display: none;">
                            <input type="hidden" class="facility-image-url" value="${facility.imageUrl || ''}">
                            <button type="button" class="image-select-btn">
                                <i data-lucide="image"></i>
                                Select Image
                            </button>
                            <div class="image-preview-container" style="display: ${facility.imageUrl ? 'block' : 'none'};">
                                <img src="${facility.imageUrl || ''}" alt="Facility preview" class="image-preview">
                                <button type="button" class="image-remove-btn">
                                    <i data-lucide="x"></i>
                                </button>
                            </div>
                        </div>
                        <small class="form-text">PNG, JPG, GIF up to 25MB</small>
                    </div>
                </div>
            `;
            facilitiesContainer.appendChild(facilityElement);
        });
        
        // Reinitialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        // Setup facilities event handlers
        this.setupFacilitiesEventHandlers();
        this.setupFacilitiesImageUploadHandlers();
    }

    /**
     * Setup facilities image upload handlers
     */
    setupFacilitiesImageUploadHandlers() {
        // Setup image upload handlers for all existing facility cards
        document.querySelectorAll('.facility-card').forEach(card => {
            this.setupFacilityImageUploadHandlers(card);
        });
    }

    /**
     * Setup image upload handlers for a single facility card
     */
    setupFacilityImageUploadHandlers(card) {
        const imageSelectBtn = card.querySelector('.image-select-btn');
        const imageRemoveBtn = card.querySelector('.image-remove-btn');
        const fileInput = card.querySelector('.facility-image-upload');
        const imageUrlInput = card.querySelector('.facility-image-url');
        const previewImg = card.querySelector('.image-preview');
        const previewContainer = card.querySelector('.image-preview-container');

        if (!imageSelectBtn || !fileInput) return;

        // Clone and replace buttons to prevent duplicate event listeners
        const newSelectBtn = imageSelectBtn.cloneNode(true);
        const newRemoveBtn = imageRemoveBtn?.cloneNode(true);
        
        imageSelectBtn.parentNode.replaceChild(newSelectBtn, imageSelectBtn);
        if (newRemoveBtn && imageRemoveBtn) {
            imageRemoveBtn.parentNode.replaceChild(newRemoveBtn, imageRemoveBtn);
        }

        // Select image button
        newSelectBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            fileInput.click();
        });

        // File input change
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                this.validateFacilityImageFile(file, (isValid, message) => {
                    if (isValid) {
                        this.previewFacilityImage(file, previewImg, previewContainer);
                        // Store the file for later upload
                        card.setAttribute('data-selected-file', 'true');
                    } else {
                        this.showNotification('error', message);
                        fileInput.value = '';
                    }
                });
            }
        });

        // Remove image button
        if (newRemoveBtn) {
            newRemoveBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.removeFacilityImage(previewContainer, imageUrlInput, fileInput, card);
            });
        }
    }

    /**
     * Validate facility image file
     */
    validateFacilityImageFile(file, callback) {
        const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif'];
        const maxSize = 25 * 1024 * 1024; // 25MB

        if (!allowedTypes.includes(file.type)) {
            callback(false, 'Please select a valid image file (PNG, JPG, GIF)');
            return;
        }

        if (file.size > maxSize) {
            callback(false, 'Image size must be less than 25MB');
            return;
        }

        callback(true);
    }

    /**
     * Preview facility image
     */
    previewFacilityImage(file, previewImg, previewContainer) {
        const reader = new FileReader();
        reader.onload = (e) => {
            previewImg.src = e.target.result;
            previewContainer.style.display = 'block';
        };
        reader.onerror = (error) => {
            console.error('Error reading file for preview:', error);
        };
        reader.readAsDataURL(file);
    }

    /**
     * Remove facility image
     */
    removeFacilityImage(previewContainer, imageUrlInput, fileInput, card) {
        previewContainer.style.display = 'none';
        previewContainer.querySelector('.image-preview').src = '';
        imageUrlInput.value = '';
        fileInput.value = '';
        card.removeAttribute('data-selected-file');
    }

    /**
     * Setup facilities event handlers
     */
    setupFacilitiesEventHandlers() {
        // Add facility button - prevent duplicate listeners
        const addFacilityBtn = document.querySelector('.add-facility');
        if (addFacilityBtn && !addFacilityBtn.hasAttribute('data-listener-added')) {
            addFacilityBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.addFacility();
            });
            addFacilityBtn.setAttribute('data-listener-added', 'true');
        }

        // Remove facility buttons - prevent duplicate listeners
        document.querySelectorAll('.remove-facility').forEach(btn => {
            if (!btn.hasAttribute('data-listener-added')) {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const facilityCard = btn.closest('.facility-card');
                    if (facilityCard) {
                        this.showDeleteFacilityConfirmation(facilityCard);
                    }
                });
                btn.setAttribute('data-listener-added', 'true');
            }
        });
    }

    /**
     * Show delete confirmation modal for facility
     */
    showDeleteFacilityConfirmation(facilityCard) {
        const facilityName = facilityCard.querySelector('.facility-title')?.value || 'Facility';
        const originalKey = facilityCard.getAttribute('data-original-key');
        
        // Use global delete confirmation modal
        window.DeleteConfirmationModal.show({
            title: 'Delete Facility',
            itemName: facilityName,
            itemType: 'facility',
            warningText: 'This action cannot be undone and will permanently remove the facility from the database.',
            onConfirm: () => {
                this.confirmDeleteFacility(facilityCard, facilityName, originalKey);
            },
            onCancel: () => {
            }
        });
    }

    /**
     * Confirm facility deletion
     */
    confirmDeleteFacility(facilityCard, facilityName, originalKey) {
        if (originalKey) {
            // Track this facility for database deletion
            this.deletedFacilities.push({
                key: originalKey,
                name: facilityName,
                element: facilityCard
            });
        }
        
        // Remove from DOM
        facilityCard.remove();
        this.showNotification('success', `Facility "${facilityName}" removed successfully`);
    }

    /**
     * Add new facility
     */
    addFacility() {
        const facilitiesContainer = document.getElementById('facilities-list');
        if (!facilitiesContainer) return;

        const facilityCount = facilitiesContainer.children.length;
        const newFacilityElement = document.createElement('div');
        newFacilityElement.className = 'facility-card';
        newFacilityElement.innerHTML = `
            <div class="facility-card-header">
                <div class="facility-icon">
                    <i data-lucide="building"></i>
                </div>
                <h5>Facility ${facilityCount + 1}</h5>
                <button type="button" class="btn btn-danger btn-sm remove-facility">
                    <i data-lucide="trash-2"></i>
                </button>
            </div>
            
            <div class="facility-card-content">
                <div class="form-group">
                    <label>Facility Name</label>
                    <input type="text" class="facility-title form-input" placeholder="e.g., Library, Science Lab">
                </div>
                
                <div class="form-group">
                    <label>Description</label>
                    <textarea class="facility-content form-textarea" rows="3" placeholder="Describe the facility features and benefits"></textarea>
                </div>
                
                <div class="form-group">
                    <label>Facility Image</label>
                    <div class="image-upload-container">
                        <input type="file" class="facility-image-upload" accept="image/png,image/jpg,image/jpeg,image/gif" style="display: none;">
                        <input type="hidden" class="facility-image-url" value="">
                        <button type="button" class="image-select-btn">
                            <i data-lucide="image"></i>
                            Select Image
                        </button>
                        <div class="image-preview-container" style="display: none;">
                            <img alt="Facility preview" class="image-preview">
                            <button type="button" class="image-remove-btn">
                                <i data-lucide="x"></i>
                            </button>
                        </div>
                    </div>
                    <small class="form-text">PNG, JPG, GIF up to 25MB</small>
                </div>
            </div>
        `;
        
        facilitiesContainer.appendChild(newFacilityElement);
        
        // Reinitialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        // Setup image upload handlers for the new facility
        this.setupFacilityImageUploadHandlers(newFacilityElement);
        
        // Add event listener to the new remove button
        const removeBtn = newFacilityElement.querySelector('.remove-facility');
        if (removeBtn) {
            removeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                newFacilityElement.remove();
                this.showNotification('success', 'Facility removed');
            });
        }
        
        // Focus on the new card and scroll to it
        setTimeout(() => {
            // Add a highlight effect to the new card
            newFacilityElement.style.border = '2px solid #3b82f6';
            newFacilityElement.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
            
            // Scroll to the new card
            newFacilityElement.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
            
            // Focus on the first input field (Facility Name)
            const titleInput = newFacilityElement.querySelector('.facility-title');
            if (titleInput) {
                titleInput.focus();
            }
            
            // Remove the highlight effect after 3 seconds
            setTimeout(() => {
                newFacilityElement.style.border = '';
                newFacilityElement.style.boxShadow = '';
            }, 3000);
        }, 100);
        
        this.showNotification('success', 'New facility added');
    }

    populateAchievementsEditor(data) {
        if (!Array.isArray(data)) {
            console.warn('Achievements editor data is not an array:', data);
            return;
        }
        
        const achievementsData = data.filter(item => item.section === 'achievements');
        
        // Extract section title from section_title entry
        const sectionTitleEntry = achievementsData.find(item => item.key === 'section_title');
        const sectionTitle = sectionTitleEntry?.title || 'Our Achievements';
        
        // Populate section title
        const sectionTitleInput = document.getElementById('achievements-title');
        if (sectionTitleInput) {
            sectionTitleInput.value = sectionTitle;
        }
        
        const achievementsContainer = document.getElementById('achievements-list');
        if (!achievementsContainer) return;
        
        // Clear existing content
        achievementsContainer.innerHTML = '';
        
        // Filter out section_title entry and populate achievements
        const actualAchievements = achievementsData.filter(item => item.key !== 'section_title');
        actualAchievements.forEach((achievement, index) => {
            const achievementElement = document.createElement('div');
            achievementElement.className = 'achievement-card';
            achievementElement.setAttribute('data-original-key', achievement.key);
            achievementElement.innerHTML = `
                <div class="achievement-card-header">
                    <div class="achievement-icon">
                        <i data-lucide="${achievement.icon || 'award'}"></i>
                    </div>
                    <h5>Achievement ${index + 1}</h5>
                    <button type="button" class="btn btn-danger btn-sm remove-achievement">
                        <i data-lucide="trash-2"></i>
                    </button>
                </div>
                
                <div class="achievement-card-content">
                    <div class="form-group">
                        <label>Achievement Title</label>
                        <input type="text" class="achievement-title form-input" value="${achievement.title || ''}" placeholder="e.g., Best School Award 2024">
                    </div>
                    
                    <div class="form-group">
                        <label>Description</label>
                        <textarea class="achievement-content form-textarea" rows="3" placeholder="Describe the achievement and its significance">${achievement.content || ''}</textarea>
                    </div>
                    
                    <div class="form-group">
                        <label>Icon</label>
                        <select class="achievement-icon-select form-input">
                            <option value="award" ${achievement.icon === 'award' ? 'selected' : ''}>Award</option>
                            <option value="trophy" ${achievement.icon === 'trophy' ? 'selected' : ''}>Trophy</option>
                            <option value="medal" ${achievement.icon === 'medal' ? 'selected' : ''}>Medal</option>
                            <option value="star" ${achievement.icon === 'star' ? 'selected' : ''}>Star</option>
                            <option value="crown" ${achievement.icon === 'crown' ? 'selected' : ''}>Crown</option>
                            <option value="target" ${achievement.icon === 'target' ? 'selected' : ''}>Target</option>
                            <option value="flag" ${achievement.icon === 'flag' ? 'selected' : ''}>Flag</option>
                        </select>
                    </div>
                </div>
            `;
            achievementsContainer.appendChild(achievementElement);
        });
        
        // Reinitialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        // Setup achievements event handlers
        this.setupAchievementsEventHandlers();
    }

    /**
     * Setup achievements event handlers
     */
    setupAchievementsEventHandlers() {
        // Add achievement button - prevent duplicate listeners
        const addAchievementBtn = document.querySelector('.add-achievement');
        if (addAchievementBtn && !addAchievementBtn.hasAttribute('data-listener-added')) {
            addAchievementBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.addAchievement();
            });
            addAchievementBtn.setAttribute('data-listener-added', 'true');
        }

        // Remove achievement buttons - prevent duplicate listeners
        document.querySelectorAll('.remove-achievement').forEach(btn => {
            if (!btn.hasAttribute('data-listener-added')) {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const achievementCard = btn.closest('.achievement-card');
                    if (achievementCard) {
                        this.showDeleteAchievementConfirmation(achievementCard);
                    }
                });
                btn.setAttribute('data-listener-added', 'true');
            }
        });

        // Icon change handlers
        document.querySelectorAll('.achievement-card select.achievement-icon-select').forEach(select => {
            if (!select.hasAttribute('data-listener-added')) {
                select.addEventListener('change', (e) => {
                    const iconElement = select.closest('.achievement-card').querySelector('.achievement-card-header .achievement-icon i');
                    if (iconElement) {
                        iconElement.setAttribute('data-lucide', e.target.value);
                        if (typeof lucide !== 'undefined') {
                            lucide.createIcons();
                        }
                    }
                });
                select.setAttribute('data-listener-added', 'true');
            }
        });
    }

    /**
     * Show delete confirmation modal for achievement
     */
    showDeleteAchievementConfirmation(achievementCard) {
        const achievementTitle = achievementCard.querySelector('.achievement-title')?.value || 'Achievement';
        const originalKey = achievementCard.getAttribute('data-original-key');
        
        // Use global delete confirmation modal
        window.DeleteConfirmationModal.show({
            title: 'Delete Achievement',
            itemName: achievementTitle,
            itemType: 'achievement',
            warningText: 'This action cannot be undone and will permanently remove the achievement from the database.',
            onConfirm: () => {
                this.confirmDeleteAchievement(achievementCard, achievementTitle, originalKey);
            },
            onCancel: () => {
            }
        });
    }

    /**
     * Confirm achievement deletion
     */
    confirmDeleteAchievement(achievementCard, achievementTitle, originalKey) {
        if (originalKey) {
            // Track this achievement for database deletion
            this.deletedAchievements.push({
                key: originalKey,
                name: achievementTitle,
                element: achievementCard
            });
        }
        
        // Remove from DOM
        achievementCard.remove();
        this.showNotification('success', `Achievement "${achievementTitle}" removed successfully`);
    }

    /**
     * Add new achievement
     */
    addAchievement() {
        const achievementsContainer = document.getElementById('achievements-list');
        if (!achievementsContainer) return;

        const achievementCount = achievementsContainer.children.length;
        const newAchievementElement = document.createElement('div');
        newAchievementElement.className = 'achievement-card';
        newAchievementElement.innerHTML = `
            <div class="achievement-card-header">
                <div class="achievement-icon">
                    <i data-lucide="award"></i>
                </div>
                <h5>Achievement ${achievementCount + 1}</h5>
                <button type="button" class="btn btn-danger btn-sm remove-achievement">
                    <i data-lucide="trash-2"></i>
                </button>
            </div>
            
            <div class="achievement-card-content">
                <div class="form-group">
                    <label>Achievement Title</label>
                    <input type="text" class="achievement-title form-input" placeholder="e.g., Best School Award 2024">
                </div>
                
                <div class="form-group">
                    <label>Description</label>
                    <textarea class="achievement-content form-textarea" rows="3" placeholder="Describe the achievement and its significance"></textarea>
                </div>
                
                <div class="form-group">
                    <label>Icon</label>
                    <select class="achievement-icon-select form-input">
                        <option value="award" selected>Award</option>
                        <option value="trophy">Trophy</option>
                        <option value="medal">Medal</option>
                        <option value="star">Star</option>
                        <option value="crown">Crown</option>
                        <option value="target">Target</option>
                        <option value="flag">Flag</option>
                    </select>
                </div>
            </div>
        `;
        
        achievementsContainer.appendChild(newAchievementElement);
        
        // Reinitialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        // Add event listeners to the new achievement
        const removeBtn = newAchievementElement.querySelector('.remove-achievement');
        const iconSelect = newAchievementElement.querySelector('.achievement-icon-select');
        
        if (removeBtn) {
            removeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                newAchievementElement.remove();
                this.showNotification('success', 'Achievement removed');
            });
        }
        
        if (iconSelect) {
            iconSelect.addEventListener('change', (e) => {
                const iconElement = newAchievementElement.querySelector('.achievement-card-header .achievement-icon i');
                if (iconElement) {
                    iconElement.setAttribute('data-lucide', e.target.value);
                    if (typeof lucide !== 'undefined') {
                        lucide.createIcons();
                    }
                }
            });
        }
        
        // Focus on the new card and scroll to it
        setTimeout(() => {
            // Add a highlight effect to the new card
            newAchievementElement.style.border = '2px solid #3b82f6';
            newAchievementElement.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
            
            // Scroll to the new card
            newAchievementElement.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
            
            // Focus on the first input field (Achievement Title)
            const titleInput = newAchievementElement.querySelector('.achievement-title');
            if (titleInput) {
                titleInput.focus();
            }
            
            // Remove the highlight effect after 3 seconds
            setTimeout(() => {
                newAchievementElement.style.border = '';
                newAchievementElement.style.boxShadow = '';
            }, 3000);
        }, 100);
        
        this.showNotification('success', 'New achievement added');
    }

    populateTestimonialsEditor(data) {
        if (!Array.isArray(data)) {
            console.warn('Testimonials editor data is not an array:', data);
            return;
        }
        
        const testimonialsData = data.filter(item => item.section === 'testimonials');
        
        // Extract section title and subtitle from section_title entry
        const sectionTitleEntry = testimonialsData.find(item => item.key === 'section_title');
        const sectionTitle = sectionTitleEntry?.title || 'What People Say';
        const sectionSubtitle = sectionTitleEntry?.content || 'Hear from our community';
        
        // Populate section title and subtitle
        const sectionTitleInput = document.getElementById('testimonials-title');
        const sectionSubtitleInput = document.getElementById('testimonials-subtitle');
        if (sectionTitleInput) {
            sectionTitleInput.value = sectionTitle;
        }
        if (sectionSubtitleInput) {
            sectionSubtitleInput.value = sectionSubtitle;
        }
        
        const testimonialsContainer = document.getElementById('testimonials-list');
        if (!testimonialsContainer) return;
        
        // Clear existing content
        testimonialsContainer.innerHTML = '';
        
        // Filter out section_title entry and populate testimonials
        const actualTestimonials = testimonialsData.filter(item => item.key !== 'section_title');
        actualTestimonials.forEach((testimonial, index) => {
            const testimonialElement = document.createElement('div');
            testimonialElement.className = 'testimonial-card';
            testimonialElement.setAttribute('data-original-key', testimonial.key);
            testimonialElement.innerHTML = `
                <div class="testimonial-card-header">
                    <h5>Testimonial ${index + 1}</h5>
                    <button type="button" class="btn btn-danger btn-sm remove-testimonial">
                            <i data-lucide="trash-2"></i>
                        </button>
                    </div>
                
                <div class="testimonial-card-content">
                        <div class="form-group">
                        <label>Name</label>
                        <input type="text" class="testimonial-name form-input" value="${testimonial.name || ''}" placeholder="e.g., John Smith">
                        </div>
                    
                        <div class="form-group">
                        <label>Role/Position</label>
                        <input type="text" class="testimonial-role form-input" value="${testimonial.role || ''}" placeholder="e.g., Parent of Class 8 Student">
                        </div>
                    
                    <div class="form-group">
                        <label>Testimonial</label>
                        <textarea class="testimonial-content form-textarea" rows="3" placeholder="Share your experience with our school...">${testimonial.content || ''}</textarea>
                    </div>
                    
                    <div class="form-group">
                        <label>Rating</label>
                        <select class="testimonial-rating form-input">
                            <option value="1" ${testimonial.rating == 1 ? 'selected' : ''}>1 Star</option>
                            <option value="2" ${testimonial.rating == 2 ? 'selected' : ''}>2 Stars</option>
                            <option value="3" ${testimonial.rating == 3 ? 'selected' : ''}>3 Stars</option>
                            <option value="4" ${testimonial.rating == 4 ? 'selected' : ''}>4 Stars</option>
                            <option value="5" ${testimonial.rating == 5 ? 'selected' : ''}>5 Stars</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label>Profile Image</label>
                        <div class="image-upload-container">
                            <input type="file" class="testimonial-image-upload" accept="image/png,image/jpg,image/jpeg,image/gif" style="display: none;">
                            <input type="hidden" class="testimonial-image-url" value="${testimonial.imageUrl || ''}">
                            <button type="button" class="image-select-btn">
                                <i data-lucide="image"></i>
                                Select Image
                            </button>
                            <div class="image-preview-container" style="display: ${testimonial.imageUrl ? 'block' : 'none'};">
                                <img src="${testimonial.imageUrl || ''}" alt="Testimonial preview" class="image-preview">
                                <button type="button" class="image-remove-btn">
                                    <i data-lucide="x"></i>
                                </button>
                            </div>
                        </div>
                        <small class="form-text">PNG, JPG, GIF up to 25MB</small>
                    </div>
                </div>
            `;
            testimonialsContainer.appendChild(testimonialElement);
        });

        // Reinitialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        // Setup image upload handlers for existing testimonials
        this.setupTestimonialImageUploadHandlers();
        
        // Setup testimonials event handlers
        this.setupTestimonialsEventHandlers();
    }

    /**
     * Setup testimonials event handlers
     */
    setupTestimonialsEventHandlers() {
        // Add testimonial button - prevent duplicate listeners
        const addTestimonialBtn = document.querySelector('.add-testimonial');
        if (addTestimonialBtn && !addTestimonialBtn.hasAttribute('data-listener-added')) {
            addTestimonialBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.addTestimonial();
            });
            addTestimonialBtn.setAttribute('data-listener-added', 'true');
        }

        // Remove testimonial buttons - prevent duplicate listeners
        document.querySelectorAll('.remove-testimonial').forEach(btn => {
            if (!btn.hasAttribute('data-listener-added')) {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const testimonialCard = btn.closest('.testimonial-card');
                    if (testimonialCard) {
                        this.showDeleteTestimonialConfirmation(testimonialCard);
                    }
                });
                btn.setAttribute('data-listener-added', 'true');
            }
        });

        // Image upload handlers will be set up after testimonials are populated
    }

    /**
     * Show delete confirmation modal for testimonial
     */
    showDeleteTestimonialConfirmation(testimonialCard) {
        const testimonialName = testimonialCard.querySelector('.testimonial-name')?.value || 'Testimonial';
        const originalKey = testimonialCard.getAttribute('data-original-key');
        
        // Use global delete confirmation modal
        window.DeleteConfirmationModal.show({
            title: 'Delete Testimonial',
            itemName: testimonialName,
            itemType: 'testimonial',
            warningText: 'This action cannot be undone and will permanently remove the testimonial from the database.',
            onConfirm: () => {
                this.confirmDeleteTestimonial(testimonialCard, testimonialName, originalKey);
            },
            onCancel: () => {
            }
        });
    }

    /**
     * Confirm testimonial deletion
     */
    confirmDeleteTestimonial(testimonialCard, testimonialName, originalKey) {
        if (originalKey) {
            // Track this testimonial for database deletion
            this.deletedTestimonials.push({
                key: originalKey,
                name: testimonialName,
                element: testimonialCard
            });
        }
        
        // Remove from DOM
        testimonialCard.remove();
        this.showNotification('success', `Testimonial "${testimonialName}" removed successfully`);
    }

    /**
     * Setup testimonial image upload handlers
     */
    setupTestimonialImageUploadHandlers() {
        const testimonialCards = document.querySelectorAll('.testimonial-card');
        
        testimonialCards.forEach(card => {
            this.setupSingleTestimonialImageUpload(card);
        });
    }

    /**
     * Setup image upload handlers for a single testimonial card
     */
    setupSingleTestimonialImageUpload(card) {
        const imageSelectBtn = card.querySelector('.image-select-btn');
        const imageRemoveBtn = card.querySelector('.image-remove-btn');
        const fileInput = card.querySelector('.testimonial-image-upload');
        const imageUrlInput = card.querySelector('.testimonial-image-url');
        const previewContainer = card.querySelector('.image-preview-container');
        const previewImg = card.querySelector('.image-preview');

        if (!imageSelectBtn || !fileInput || !imageUrlInput) return;

        // Clone and replace to prevent duplicate listeners
        const newSelectBtn = imageSelectBtn.cloneNode(true);
        const newRemoveBtn = imageRemoveBtn ? imageRemoveBtn.cloneNode(true) : null;
        const newFileInput = fileInput.cloneNode(true);

        imageSelectBtn.parentNode.replaceChild(newSelectBtn, imageSelectBtn);
        if (newRemoveBtn && imageRemoveBtn) {
            imageRemoveBtn.parentNode.replaceChild(newRemoveBtn, imageRemoveBtn);
        }
        fileInput.parentNode.replaceChild(newFileInput, fileInput);

        // Handle file selection
        newFileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                this.validateTestimonialImageFile(file, (isValid, message) => {
                    if (isValid) {
                        this.previewTestimonialImage(file, previewImg, previewContainer);
                        card.setAttribute('data-selected-file', 'true');
                    } else {
                        this.showNotification('error', message);
                        e.target.value = '';
                    }
                });
            }
        });

        // Handle select button click
        newSelectBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            newFileInput.click();
        });

        // Handle remove button click
        if (newRemoveBtn) {
            newRemoveBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.removeTestimonialImage(previewContainer, imageUrlInput, newFileInput, card);
            });
        }
    }

    /**
     * Validate testimonial image file
     */
    validateTestimonialImageFile(file, callback) {
        const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif'];
        const maxSize = 25 * 1024 * 1024; // 25MB

        if (!allowedTypes.includes(file.type)) {
            callback(false, 'Please select a PNG, JPG, or GIF image file.');
            return;
        }

        if (file.size > maxSize) {
            callback(false, 'Image file size must be less than 25MB.');
            return;
        }

        callback(true, 'File is valid.');
    }

    /**
     * Preview testimonial image
     */
    previewTestimonialImage(file, previewImg, previewContainer) {
        const reader = new FileReader();
        reader.onload = (e) => {
            previewImg.src = e.target.result;
            previewContainer.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }

    /**
     * Remove testimonial image
     */
    removeTestimonialImage(previewContainer, imageUrlInput, fileInput, card) {
        previewContainer.style.display = 'none';
        imageUrlInput.value = '';
        fileInput.value = '';
        card.removeAttribute('data-selected-file');
        this.showNotification('info', 'Image removed');
    }

    /**
     * Add new testimonial
     */
    addTestimonial() {
        const testimonialsContainer = document.getElementById('testimonials-list');
        if (!testimonialsContainer) return;

        const testimonialCount = testimonialsContainer.children.length;
        const newTestimonialElement = document.createElement('div');
        newTestimonialElement.className = 'testimonial-card';
        newTestimonialElement.innerHTML = `
            <div class="testimonial-card-header">
                <h5>Testimonial ${testimonialCount + 1}</h5>
                <button type="button" class="btn btn-danger btn-sm remove-testimonial">
                            <i data-lucide="trash-2"></i>
                        </button>
                    </div>
            
            <div class="testimonial-card-content">
                        <div class="form-group">
                    <label>Name</label>
                    <input type="text" class="testimonial-name form-input" placeholder="e.g., John Smith">
                        </div>
                
                        <div class="form-group">
                    <label>Role/Position</label>
                    <input type="text" class="testimonial-role form-input" placeholder="e.g., Parent of Class 8 Student">
                        </div>
                
                        <div class="form-group">
                    <label>Testimonial</label>
                    <textarea class="testimonial-content form-textarea" rows="3" placeholder="Share your experience with our school..."></textarea>
                        </div>
                
                        <div class="form-group">
                    <label>Rating</label>
                    <select class="testimonial-rating form-input">
                        <option value="5" selected>5 Stars</option>
                        <option value="4">4 Stars</option>
                        <option value="3">3 Stars</option>
                        <option value="2">2 Stars</option>
                        <option value="1">1 Star</option>
                    </select>
                    </div>
                    
                    <div class="form-group">
                        <label>Profile Image</label>
                        <div class="image-upload-container">
                            <input type="file" class="testimonial-image-upload" accept="image/png,image/jpg,image/jpeg,image/gif" style="display: none;">
                            <input type="hidden" class="testimonial-image-url">
                            <button type="button" class="image-select-btn">
                                <i data-lucide="image"></i>
                                Select Image
                            </button>
                            <div class="image-preview-container" style="display: none;">
                                <img src="" alt="Testimonial preview" class="image-preview">
                                <button type="button" class="image-remove-btn">
                                    <i data-lucide="x"></i>
                                </button>
                            </div>
                        </div>
                        <small class="form-text">PNG, JPG, GIF up to 25MB</small>
                    </div>
                </div>
            `;
        
        testimonialsContainer.appendChild(newTestimonialElement);
        
        // Setup image upload handlers for the new testimonial
        this.setupSingleTestimonialImageUpload(newTestimonialElement);
        
        // Reinitialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        // Add event listener to the new remove button
        const removeBtn = newTestimonialElement.querySelector('.remove-testimonial');
        if (removeBtn) {
            removeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                newTestimonialElement.remove();
                this.showNotification('success', 'Testimonial removed');
            });
        }
        
        // Focus on the new card and scroll to it
        setTimeout(() => {
            // Add a highlight effect to the new card
            newTestimonialElement.style.border = '2px solid #3b82f6';
            newTestimonialElement.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
            
            // Scroll to the new card
            newTestimonialElement.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
            
            // Focus on the first input field (Name)
            const nameInput = newTestimonialElement.querySelector('.testimonial-name');
            if (nameInput) {
                nameInput.focus();
            }
            
            // Remove the highlight effect after 3 seconds
            setTimeout(() => {
                newTestimonialElement.style.border = '';
                newTestimonialElement.style.boxShadow = '';
            }, 3000);
        }, 100);
        
        this.showNotification('success', 'New testimonial added');
    }

    populateCTAEditor(data) {
        if (!Array.isArray(data)) {
            console.warn('CTA editor data is not an array:', data);
            return;
        }
        
        
        // Find the main CTA title entry
        const ctaTitleData = data.find(item => item.key === 'cta_title');
        const ctaApplyData = data.find(item => item.key === 'cta_apply_button');
        const ctaVisitData = data.find(item => item.key === 'cta_visit_button');
        
        
        // Populate form fields
        const titleInput = document.getElementById('cta-title');
        const contentInput = document.getElementById('cta-content');
        const buttonTextInput = document.getElementById('cta-button-text');
        const buttonUrlInput = document.getElementById('cta-button-url');
        const secondaryTextInput = document.getElementById('cta-secondary-text');
        const secondaryUrlInput = document.getElementById('cta-secondary-url');
        
        if (titleInput) titleInput.value = ctaTitleData?.title || 'Ready to Join Our Community?';
        if (contentInput) contentInput.value = ctaTitleData?.content || 'Take the first step towards your child\'s bright future. Apply now or schedule a visit to experience our excellence firsthand.';
        if (buttonTextInput) buttonTextInput.value = ctaApplyData?.title || 'Apply Now';
        if (buttonUrlInput) buttonUrlInput.value = ctaApplyData?.linkUrl || '/application';
        if (secondaryTextInput) secondaryTextInput.value = ctaVisitData?.title || 'Schedule a Visit';
        if (secondaryUrlInput) secondaryUrlInput.value = ctaVisitData?.linkUrl || '/contact';
        
    }

    /**
     * Load section statuses
     */
    async loadSectionStatuses() {
        // Implementation for loading section enabled/disabled statuses
    }

    /**
     * Update navigation state
     */
    updateNavigation() {
        // Remove active class from all nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to about content link
        const aboutContentLink = document.querySelector('[data-section="about-content"]');
        if (aboutContentLink) {
            aboutContentLink.classList.add('active');
        }
    }

    /**
     * Show notification
     */
    showNotification(type, message, duration = 3000) {
        // Use global NotificationManager if available
        if (window.NotificationManager && typeof window.NotificationManager.show === 'function') {
            window.NotificationManager.show(type, message, duration);
        } else {
            console.warn('Global NotificationManager not found, falling back to custom notification');
            // Fallback to custom notification
            this.showCustomNotification(type, message, duration);
        }
    }

    showCustomNotification(type, message, duration = 3000) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-icon">
                    <i data-lucide="${type === 'success' ? 'check-circle' : type === 'error' ? 'x-circle' : 'info'}"></i>
                </div>
                <div class="notification-text">
                    <span class="notification-message">${message}</span>
                </div>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                    <i data-lucide="x"></i>
                </button>
            </div>
        `;

        // Add to page
        document.body.appendChild(notification);

        // Auto remove after duration
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, duration);

        // Reinitialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
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
     * Navigate back to about page content management
     */
    navigateToAboutPage() {
        try {
            
            // Use the admin panel's navigation system
            if (window.adminPanel && typeof window.adminPanel.navigateToSection === 'function') {
                window.adminPanel.navigateToSection('about-content');
                return;
            }
            
            // Fallback: try to trigger the about page navigation link
            const aboutLink = document.querySelector('a[data-section="about-content"]');
            if (aboutLink) {
                aboutLink.click();
                return;
            }
            
            // Another fallback: look for any about-related link
            const aboutLinkAlt = document.querySelector('a[href*="about"]');
            if (aboutLinkAlt) {
                aboutLinkAlt.click();
                return;
            }
            
            // Last resort: try to reload to about section
            window.location.hash = '#about-content';
            
        } catch (error) {
            console.error('❌ Error navigating to about page:', error);
            // Final fallback
            window.location.hash = '#about-content';
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.aboutContentManager = new AboutContentManager();
});
