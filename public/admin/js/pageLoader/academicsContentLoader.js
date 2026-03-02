/**
 * Academics Content Loader
 * Handles dynamic loading and management of the academics content section
 */
class AcademicsContentLoader {
    constructor() {
        this.currentSubsection = null;
        this.sections = {
            'philosophy': { name: 'Academic Philosophy', icon: '🧠', enabled: true },
            'curriculum': { name: 'Curriculum Overview', icon: '📖', enabled: true },
            'grade-levels': { name: 'Academic Programs', icon: '📚', enabled: true },
            'teaching-methods': { name: 'Teaching Methodologies', icon: '👨‍🏫', enabled: true },
            'achievements': { name: 'Academic Achievements', icon: '🏆', enabled: true },
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
        // Academics content section click
        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-section="academics-content"]')) {
                e.preventDefault();
                this.loadAcademicsContent();
            }
        });

        // Section menu item clicks will be set up in loadAcademicsContent

        // Breadcrumb back button - handle data-action attribute
        document.addEventListener('click', (e) => {
            const backButton = e.target.closest('.back-button');
            if (backButton) {
                const action = backButton.getAttribute('data-action');
                if (action === 'back-to-section-list' && this.isAcademicsContentContext(backButton)) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    this.showSectionList();
                    return;
                }
            }
        });



        // Section save buttons are now handled by the SaveButton component
        // The SaveButton component is initialized in initializeSaveButton() method
        // No need for manual event listeners here

        // Highlight management
        document.addEventListener('click', (e) => {
            // Add highlight button
            if (e.target.closest('#addHighlightBtn')) {
                e.preventDefault();
                this.addHighlight();
            }
            
            // Remove highlight button
            if (e.target.closest('.remove-highlight-btn')) {
                e.preventDefault();
                const index = parseInt(e.target.closest('.remove-highlight-btn').dataset.index);
                this.removeHighlight(index);
            }
        });

        // Curriculum management
        document.addEventListener('click', (e) => {
            // Add curriculum button
            if (e.target.closest('#addCurriculumBtn')) {
                        e.preventDefault();
                this.addCurriculumItem();
            }
            
            // Remove curriculum button
            if (e.target.closest('.remove-curriculum-btn')) {
                e.preventDefault();
                const index = parseInt(e.target.closest('.remove-curriculum-btn').dataset.index);
                this.removeCurriculumItem(index);
            }
        });

        // Grade Levels management
        document.addEventListener('click', (e) => {
            // Add grade level button
            if (e.target.closest('#addGradeLevelBtn')) {
                e.preventDefault();
                this.addGradeLevel();
            }
            
            // Remove grade level button
            if (e.target.closest('.remove-level-btn')) {
                e.preventDefault();
                const index = parseInt(e.target.closest('.remove-level-btn').dataset.index);
                this.removeGradeLevel(index);
            }
            
            // Add feature button
            if (e.target.closest('.add-feature-btn')) {
                e.preventDefault();
                const button = e.target.closest('.add-feature-btn');
                const levelIndex = parseInt(button.dataset.levelIndex);
                this.addFeatureToLevel(levelIndex);
            }
            
            // Remove feature button
            if (e.target.closest('.remove-feature-btn')) {
                e.preventDefault();
                const button = e.target.closest('.remove-feature-btn');
                button.closest('.feature-item-editor').remove();
            }
        });

        // Teaching Methods management
        document.addEventListener('click', (e) => {
            // Add teaching method button
            if (e.target.closest('#addTeachingMethodBtn')) {
                e.preventDefault();
                this.addTeachingMethod();
            }
            
            // Remove teaching method button
            if (e.target.closest('.remove-method-btn')) {
                e.preventDefault();
                const index = parseInt(e.target.closest('.remove-method-btn').dataset.index);
                this.removeTeachingMethod(index);
            }
        });

        // Beyond Academics Activities management
        document.addEventListener('click', (e) => {
            // Add activity button
            if (e.target.closest('#addActivityBtn')) {
                e.preventDefault();
                this.addActivity();
            }
            
            // Remove activity button
            if (e.target.closest('.remove-activity-btn')) {
                e.preventDefault();
                const index = parseInt(e.target.closest('.remove-activity-btn').dataset.index);
                this.removeActivity(index);
            }
        });

        // Activity option management
        document.addEventListener('click', (e) => {
            // Add option button
            if (e.target.closest('.add-option-btn')) {
                e.preventDefault();
                const activityIndex = e.target.closest('.add-option-btn').dataset.activityIndex;
                this.addActivityOption(activityIndex);
            }
            
            // Remove option button
            if (e.target.closest('.remove-option-btn')) {
                e.preventDefault();
                const optionIndex = e.target.closest('.remove-option-btn').dataset.optionIndex;
                const activityIndex = e.target.closest('.activity-item').dataset.index;
                this.removeActivityOption(activityIndex, optionIndex);
            }
        });

    }

    /**
     * Load academics content section dynamically
     */
    async loadAcademicsContent() {
        try {
            // Get academics content
            const content = this.getAcademicsContent();
            
            // Inject content into page-content
            this.injectContent(content);
            
            // Initialize academics content functionality
            this.initializeAcademicsContent();
            
            // Update navigation
            this.updateNavigation();
            
        } catch (error) {
            console.error('Error loading academics content section:', error);
            this.showError('Failed to load academics content section');
        }
    }

    /**
     * Get academics content HTML
     */
    getAcademicsContent() {
        return `
            <section id="academics-content-section" class="content-section active">
                <div class="page-header">
                    <div class="page-title">
                        <h1>Academics Page Content Management</h1>
                        <p>Manage and organize your academics page sections with our intuitive editor.</p>
                    </div>
                </div>

                <!-- Section List View -->
                <div id="sectionList" class="section-list-view">
                    <div class="sections-grid">
                        ${Object.entries(this.sections).map(([key, section]) => `
                            <div class="section-menu-item shimmer-placeholder" data-section="${key}">
                                <div class="section-header">
                                    <div class="section-icon shimmer-shape shimmer-circle">${section.icon}</div>
                                    <div class="section-info">
                                        <div class="shimmer-shape shimmer-text shimmer-title">${section.name}</div>
                                        <div class="shimmer-shape shimmer-text shimmer-subtitle">Manage ${section.name.toLowerCase()} content</div>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Section Editor View -->
                <div id="sectionEditor" class="section-editor-view" style="display: none;">
                    <!-- Breadcrumb will be added dynamically -->
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
     * Check if we're in academics content context
     */
    isAcademicsContentContext(backButton) {
        // First check if we're in the academics content section
        if (this.currentSection !== 'academics-content') {
            return false;
        }
        
        // Check if the back button is within an academics content context
        if (backButton && backButton.closest('#academics-content-section, .academics-content-editor, .section-editor')) {
            return true;
        }
        
        // Fallback: check if current content is academics content-related
        const pageContent = document.getElementById('page-content');
        if (!pageContent) return false;
        
        return pageContent.innerHTML.includes('academics-content-section') || 
               pageContent.querySelector('#academics-content-section, .academics-content-editor, .section-editor') !== null;
    }

    /**
     * Show section list (main academics overview)
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
    loadSection(section) {
        this.currentSubsection = section;
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
            
            // Load section data with a small delay to ensure form is rendered
            setTimeout(() => {
                this.loadSectionData(section);
            }, 100);
            
            // Reinitialize Lucide icons after content injection
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
            
            // Initialize SaveButton for this section
            this.initializeSaveButton(section);
        } else {
            console.error('Section list or editor not found!');
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
     * Show notification
     */
    showNotification(type, message) {
        // Use unified notification system
        const title = type === 'success' ? 'Success' : type === 'error' ? 'Error' : 'Notification';
        window.NotificationManager.show(type, title, message);
    }


    /**
     * Get section editor HTML for specific section
     */
    getSectionEditor(section) {
        const breadcrumb = this.getBreadcrumbHTML(section);
        let editorContent = '';
        
        switch(section) {
            case 'philosophy':
                editorContent = this.getPhilosophyEditor();
                break;
            case 'grade-levels':
                editorContent = this.getGradeLevelsEditor();
                break;
            case 'beyond-academics':
                editorContent = this.getBeyondAcademicsEditor();
                break;
            case 'cta':
                editorContent = this.getCtaEditor();
                break;
            case 'curriculum':
                editorContent = this.getCurriculumEditor();
                break;
            case 'teaching-methods':
                editorContent = this.getTeachingMethodsEditor();
                break;
            case 'achievements':
                editorContent = this.getAchievementsEditor();
                break;
            default:
                editorContent = '<div class="editor-content"><p>Section editor not found.</p></div>';
        }
        
        return breadcrumb + editorContent;
    }

    /**
     * Get breadcrumb HTML for section
     */
    getBreadcrumbHTML(section) {
        const sectionName = this.sections[section]?.name || 'Unknown Section';
        return `
            <!-- Simple Breadcrumb -->
            <div class="simple-breadcrumb">
                <button class="back-button" data-action="back-to-section-list">
                    <i data-lucide="arrow-left"></i>
                </button>
                <div class="breadcrumb-path">
                    <span>Academics Page</span>
                    <i data-lucide="chevron-right"></i>
                    <span id="currentSectionName">${sectionName}</span>
                </div>
            </div>
        `;
    }

    /**
     * Update breadcrumb section name
     */
    updateBreadcrumb(section) {
        const sectionNameElement = document.getElementById('currentSectionName');
        if (sectionNameElement) {
            sectionNameElement.textContent = this.sections[section]?.name || 'Unknown Section';
        }
    }

    /**
     * Load section data from database
     */
    async loadSectionData(section) {
        try {
            // Fetch academics content from API
            const response = await fetch('/api/content/academics');
            const data = await response.json();
            
            if (data.success) {
                // Populate form fields based on section
                this.populateSectionForm(section, data.content);
            } else {
                console.error('Failed to load section data:', data.error);
                this.showNotification('Error', 'Failed to load section data', 'error');
            }
        } catch (error) {
            console.error('Error loading section data:', error);
            this.showNotification('Error', 'Failed to load section data', 'error');
        }
    }


    /**
     * Populate section form with data
     */
    populateSectionForm(section, content) {
        const form = document.querySelector('#sectionEditor form');
        if (!form) {
            setTimeout(() => {
                this.populateSectionForm(section, content);
            }, 200);
            return;
        }

        switch(section) {
            case 'philosophy':
                this.populatePhilosophyForm(form, content);
                break;
            case 'curriculum':
                this.populateCurriculumForm(form, content);
                break;
            case 'grade-levels':
                this.populateGradeLevelsForm(form, content);
                break;
            case 'teaching-methods':
                this.populateTeachingMethodsForm(form, content);
                break;
            case 'beyond-academics':
                this.populateBeyondAcademicsForm(form, content);
                break;
            case 'achievements':
                this.populateAchievementsForm(form, content);
                break;
            case 'cta':
                this.populateCtaForm(form, content);
                break;
        }
    }

    /**
     * Populate Philosophy form
     */
    populatePhilosophyForm(form, content) {
        const philosophy = content.academicPhilosophy;
        
        if (philosophy) {
            this.setFormField(form, 'academicsTitle', philosophy.title);
            this.setFormField(form, 'academicsDescription', philosophy.description);
            
            // Populate highlights using the dynamic highlight system
            if (philosophy.highlights && philosophy.highlights.length > 0) {
                // Convert highlights to the format expected by renderHighlights
                const highlightsForRender = philosophy.highlights.map(highlight => ({
                    text: highlight.title,
                    description: highlight.description,
                    icon: highlight.icon
                }));
                this.renderHighlights(highlightsForRender);
            }
            
            // Initialize image upload after a short delay to ensure DOM is ready
            setTimeout(() => {
                this.initializePhilosophyImageUpload(philosophy.imageUrl || philosophy.backgroundImage || '');
            }, 100);
        }
    }
    
    /**
     * Initialize philosophy section image upload
     */
    initializePhilosophyImageUpload(existingImageUrl = '') {
        const container = document.getElementById('philosophy-image-upload-container');
        if (!container) {
            console.warn('⚠️ Philosophy image upload container not found');
            return;
        }
        
        // Create ImageUpload HTML
        const imageUploadHTML = window.ImageUpload.createHTML({
            fileInputId: 'philosophy-image-file',
            urlInputId: 'philosophy-image-url',
            previewImgId: 'philosophy-image-preview',
            selectBtnId: 'philosophy-select-image-btn',
            existingImageUrl: existingImageUrl
        });
        
        container.innerHTML = imageUploadHTML;
        
        // Initialize ImageUpload instance
        this.philosophyImageUpload = new ImageUpload({
            fileInputId: 'philosophy-image-file',
            urlInputId: 'philosophy-image-url',
            previewImgId: 'philosophy-image-preview',
            selectBtnId: 'philosophy-select-image-btn',
            uploadFolder: 'marigold-school/academics/philosophy',
            autoUpload: false
        });
        
        this.philosophyImageUpload.init();
    }

    /**
     * Populate Curriculum form
     */
    populateCurriculumForm(form, content) {
        const curriculum = content.curriculumOverview;
        
        if (curriculum) {
            // Manually set field values with logging
            const titleField = document.getElementById('curriculumTitle');
            const descField = document.getElementById('curriculumDescription');
            
            
            if (titleField) {
                titleField.value = curriculum.title || '';
            } else {
                console.warn('⚠️ Title field not found');
            }
            
            if (descField) {
                descField.value = curriculum.description || '';
        } else {
                console.warn('⚠️ Description field not found');
            }
            
            // Always render curriculum items (even if empty array)
            const items = curriculum.items || [];
            this.renderCurriculum(items);
        } else {
            console.warn('⚠️ No curriculum data found');
            // Render empty state
            this.renderCurriculum([]);
        }
    }

    /**
     * Populate Grade Levels form
     */
    populateGradeLevelsForm(form, content) {
        
        const gradeLevels = content.gradeLevels;
        if (gradeLevels) {
            // Use getElementById for direct access
            const titleField = document.getElementById('gradeLevelsTitle');
            const subtitleField = document.getElementById('gradeLevelsSubtitle');
            
            if (titleField) {
                titleField.value = gradeLevels.title || '';
            }
            if (subtitleField) {
                subtitleField.value = gradeLevels.subtitle || '';
            }
            
            // Check for programs data (new structure)
            if (gradeLevels.programs && gradeLevels.programs.length > 0) {
                this.renderGradeLevels(gradeLevels.programs);
            }
            // Fallback to old levels structure
            else if (gradeLevels.levels && gradeLevels.levels.length > 0) {
                this.renderGradeLevels(gradeLevels.levels);
            } else {
                this.renderGradeLevels([]);
            }
        } else {
            console.warn('⚠️ No gradeLevels data found');
            this.renderGradeLevels([]);
        }
    }

    /**
     * Populate Teaching Methods form
     */
    populateTeachingMethodsForm(form, content) {
        
        const teachingMethods = content.teachingMethods;
        if (teachingMethods) {
            // Use getElementById for direct access
            const titleField = document.getElementById('teachingMethodsTitle');
            const subtitleField = document.getElementById('teachingMethodsSubtitle');
            
            if (titleField) {
                titleField.value = teachingMethods.title || '';
            }
            if (subtitleField) {
                subtitleField.value = teachingMethods.subtitle || '';
            }
            
            // Populate methods - these are handled by the dynamic form system
            if (teachingMethods.methods && teachingMethods.methods.length > 0) {
                this.renderTeachingMethods(teachingMethods.methods);
            } else {
                this.renderTeachingMethods([]);
            }
        } else {
            console.warn('⚠️ No teachingMethods data found');
            this.renderTeachingMethods([]);
        }
    }

    /**
     * Populate Beyond Academics form
     */
    populateBeyondAcademicsForm(form, content) {
        const beyondAcademics = content.beyondAcademics;
        if (beyondAcademics) {
            this.setFormField(form, 'beyondAcademicsTitle', beyondAcademics.title);
            this.setFormField(form, 'beyondAcademicsSubtitle', beyondAcademics.subtitle);
            
            // Populate activities using the dynamic activity system
            if (beyondAcademics.activities && beyondAcademics.activities.length > 0) {
                this.renderActivities(beyondAcademics.activities);
            } else {
            }
        } else {
        }
    }

    /**
     * Populate Achievements form
     */
    populateAchievementsForm(form, content) {
        const achievements = content.academicAchievements;
        if (achievements) {
            this.setFormField(form, 'achievementsTitle', achievements.title);
            this.setFormField(form, 'achievementsSubtitle', achievements.subtitle);
            
            // Always render achievements (show 4 default cards if empty)
            const achievementsData = achievements.achievements || [];
            this.renderAchievements(achievementsData);
        } else {
            // Show 4 default empty cards if no data at all
            this.renderAchievements([]);
        }
    }

    /**
     * Populate CTA form
     */
    populateCtaForm(form, content) {
        const cta = content.ctaSection;
        if (cta) {
            this.setFormField(form, 'academicsCtaTitle', cta.title);
            this.setFormField(form, 'academicsCtaDescription', cta.description);
            this.setFormField(form, 'academicsCtaPrimaryButton', cta.primaryButton?.text);
            this.setFormField(form, 'academicsCtaSecondaryButton', cta.secondaryButton?.text);
            this.setFormField(form, 'academicsCtaTertiaryButton', cta.tertiaryButton?.text);
        } else {
        }
    }

    /**
     * Set form field value
     */
    setFormField(form, fieldName, value) {
        if (!value) {
            return;
        }
        
        const field = form.querySelector(`[name="${fieldName}"]`);
        if (field) {
            if (field.type === 'checkbox' || field.type === 'radio') {
                field.checked = value === 'true' || value === true;
            } else {
                field.value = value;
            }
        } else {
            console.error(`❌ Field not found: ${fieldName}`);
        }
    }

    /**
     * Collect section data for saving
     */
    collectSectionData(section) {
        // Get the correct form based on section
        let form;
        switch (section) {
            case 'philosophy':
                form = document.querySelector('#philosophyForm');
                break;
            case 'curriculum':
                form = document.querySelector('#curriculumSectionForm');
                break;
            case 'grade-levels':
                form = document.querySelector('#gradeLevelsForm');
                break;
            case 'teaching-methods':
                form = document.querySelector('#teachingMethodsForm');
                break;
            case 'beyond-academics':
                form = document.querySelector('#beyondAcademicsForm');
                break;
            case 'achievements':
                form = document.querySelector('#achievementsForm');
                break;
            case 'cta':
                form = document.querySelector('#academicsCtaForm');
                break;
            default:
                form = document.querySelector('#sectionEditor form');
        }
        
        if (!form) {
            console.error(`Form not found for section: ${section}`);
        return {};
        }

        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Add section information
        data.section = section;
        
        return data;
    }

    /**
     * Initialize SaveButton for a section
     */
    initializeSaveButton(section) {
        
        // Find the save button for this section
        const saveBtnElement = document.querySelector(`.save-section-btn[data-section="${section}"]`);
        if (!saveBtnElement) {
            console.warn(`⚠️ Save button not found for section: ${section}`);
            return;
        }
        
        const sectionName = this.getSectionName(section);
        
        // Create SaveButton instance
        const saveButton = new SaveButton({
            target: saveBtnElement,
            text: `Save ${sectionName}`,
            icon: 'save',
            variant: 'primary',
            dataSection: section,
            messages: {
                preparing: 'Preparing to save...',
                collecting: `Collecting ${sectionName.toLowerCase()} data...`,
                saving: `Saving ${sectionName.toLowerCase()} to database...`,
                success: `${sectionName} saved successfully!`
            },
            onSave: async (button) => {
                try {
                    // Update progress
                    button.updateProgress(`Collecting ${sectionName.toLowerCase()} data...`, 25);
            
            // Collect form data
            const formData = this.collectSectionData(section);
                    
                    // Update progress
                    button.updateProgress(`Saving ${sectionName.toLowerCase()} to database...`, 50);
                    
                    // Get auth token
                    const token = localStorage.getItem('adminToken');
                    if (!token) {
                        throw new Error('Authentication required. Please log in again.');
                    }
            
            // Special handling for philosophy section
            if (section === 'philosophy') {
                        await this.savePhilosophySection(formData, button);
                    } else if (section === 'curriculum') {
                        await this.saveCurriculumSection(formData, button);
                    } else if (section === 'grade-levels') {
                        await this.saveGradeLevelsSection(formData, button);
                    } else if (section === 'teaching-methods') {
                        await this.saveTeachingMethodsSection(formData, button);
                    } else if (section === 'beyond-academics') {
                        await this.saveBeyondAcademicsSection(formData, button);
                    } else if (section === 'achievements') {
                        await this.saveAchievementsSection(formData, button);
                    } else if (section === 'cta') {
                        await this.saveCtaSection(formData, button);
            } else {
                // Format data for individual section API
                const sectionData = this.formatSectionData(section, formData);
                
                // Send to individual section API
                const response = await fetch('/api/content/academics', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(sectionData)
                });
                        
                        if (!response.ok) {
                            const errorData = await response.json();
                            throw new Error(errorData.error || `Server error: ${response.status}`);
                        }
                
                const result = await response.json();
                
                if (!result.success) {
                    throw new Error(result.error || 'Failed to save section');
                }
                        
                    }
                    
                    // Update progress to success
                    button.updateProgress(`${sectionName} saved successfully!`, 100);
                    
                    return { success: true };
                    
                } catch (error) {
                    console.error('❌ Save error:', error);
                    throw error;
                }
            },
            onSuccess: (result) => {
            this.showNotification('Success', `${sectionName} saved successfully!`, 'success');
            
                // Navigate back to section list after successful save
                setTimeout(() => {
                    this.showSectionList();
                }, 1500); // Wait 1.5 seconds to show success message
            },
            onError: (error) => {
                console.error(`❌ Error saving ${sectionName}:`, error);
                this.showNotification('Error', `Failed to save ${sectionName}: ${error.message}`, 'error');
            }
        });
        
        // Store the SaveButton instance for later access if needed
        if (!this.saveButtons) {
            this.saveButtons = {};
        }
        this.saveButtons[section] = saveButton;
        
    }

    /**
     * Save philosophy section data (handles both section_title and philosophy_description)
     */
    async savePhilosophySection(formData, button = null) {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            throw new Error('Authentication required');
        }

        // Upload image first if a new one is selected
        let philosophyImageUrl = document.getElementById('philosophy-image-url')?.value || '';
        const philosophyImageFile = document.getElementById('philosophy-image-file');
        
        if (philosophyImageFile && philosophyImageFile.files && philosophyImageFile.files.length > 0) {
            if (button) {
                button.updateProgress('Uploading background image...', 30);
            }
            
            try {
                // Ensure the ImageUpload instance is initialized
                if (this.philosophyImageUpload) {
                    this.philosophyImageUpload.init();
                    const uploadResult = await this.philosophyImageUpload.uploadFile(philosophyImageFile.files[0]);
                    philosophyImageUrl = uploadResult.url;
                } else {
                    console.warn('⚠️ Philosophy ImageUpload instance not found');
                }
            } catch (error) {
                console.error('❌ Failed to upload philosophy image:', error);
                if (this.showNotification) {
                    this.showNotification('Error', `Failed to upload image: ${error.message}`, 'error');
                }
                // Continue without image
            }
        }

        // Update progress if button provided
        if (button) {
            button.updateProgress('Saving section title...', 60);
        }

        // Update section_title with image URL
        const sectionTitleResponse = await fetch('/api/content/academics', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                section: 'academic_philosophy',
                key: 'section_title',
                title: formData.academicsTitle || '',
                content: formData.academicsDescription || '',
                imageUrl: philosophyImageUrl, // ✅ Save image URL
                isActive: true
            })
        });

        if (!sectionTitleResponse.ok) {
            const errorData = await sectionTitleResponse.json();
            throw new Error(errorData.error || 'Failed to save section title');
        }

        const sectionTitleResult = await sectionTitleResponse.json();
        if (!sectionTitleResult.success) {
            throw new Error('Failed to save section title: ' + sectionTitleResult.error);
        }

        // Update progress if button provided
        if (button) {
            button.updateProgress('Saving philosophy description...', 80);
        }

        // Update philosophy_description
        const descriptionResponse = await fetch('/api/content/academics', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                section: 'academic_philosophy',
                key: 'philosophy_description',
                title: null,
                content: formData.academicsDescription || '',
                isActive: true
            })
        });

        if (!descriptionResponse.ok) {
            const errorData = await descriptionResponse.json();
            throw new Error(errorData.error || 'Failed to save philosophy description');
        }

        const descriptionResult = await descriptionResponse.json();
        if (!descriptionResult.success) {
            throw new Error('Failed to save philosophy description: ' + descriptionResult.error);
        }

        // Update progress if button provided
        if (button) {
            button.updateProgress('Saving philosophy highlights...', 90);
        }

        // Collect and save highlights
        const highlights = this.collectHighlights(formData);

        // Save each highlight
        for (let i = 0; i < highlights.length; i++) {
            const highlight = highlights[i];
            
            const highlightResponse = await fetch('/api/content/academics', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    section: 'academic_philosophy',
                    key: `highlight_${i}`,
                    title: highlight.title,
                    content: highlight.description,
                    metadata: JSON.stringify({ icon: highlight.icon }),
                    isActive: true
                })
            });

            if (!highlightResponse.ok) {
                const errorData = await highlightResponse.json();
                throw new Error(errorData.error || `Failed to save highlight ${i + 1}`);
            }

            const highlightResult = await highlightResponse.json();
            if (!highlightResult.success) {
                throw new Error(`Failed to save highlight ${i + 1}: ` + highlightResult.error);
            }
        }

        // Delete any highlights that were removed (if there were more before)
        // We need to check all possible highlight keys (0-9) and delete those not in current highlights
        const currentHighlightKeys = highlights.map((_, i) => `highlight_${i}`);
        
        // Check for highlights from 0 to 9 (reasonable maximum)
        const keysToCheck = Array.from({ length: 10 }, (_, i) => `highlight_${i}`);
        const keysToDelete = keysToCheck.filter(key => !currentHighlightKeys.includes(key));
        

        // Delete removed highlights
        for (const key of keysToDelete) {
            try {
                const deleteResponse = await fetch('/api/content/academics', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        section: 'academic_philosophy',
                        key: key
                    })
                });
                
                if (deleteResponse.ok) {
                } else {
                    const errorData = await deleteResponse.json();
                }
            } catch (error) {
                console.error(`❌ Error deleting ${key}:`, error);
            }
        }
        
    }

    /**
     * Save curriculum section with items
     */
    async saveCurriculumSection(formData, button = null) {
        
        const token = localStorage.getItem('adminToken');
        if (!token) {
            throw new Error('Authentication required');
        }

        // Save section title and description
        if (button) button.updateProgress('Saving section title...', 60);
        
        const titleResponse = await fetch('/api/content/academics', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                section: 'curriculum_overview',
                key: 'section_title',
                title: formData.curriculumTitle || '',
                content: formData.curriculumDescription || '',
                isActive: true
            })
        });

        if (!titleResponse.ok) {
            const errorData = await titleResponse.json();
            throw new Error(errorData.error || 'Failed to save section title');
        }

        const titleResult = await titleResponse.json();
        if (!titleResult.success) {
            throw new Error(titleResult.error || 'Failed to save section title');
        }


        // Save curriculum items
        if (button) button.updateProgress('Saving curriculum items...', 80);
        
        const curriculumItems = this.getCurrentCurriculumItems();

        for (let i = 0; i < curriculumItems.length; i++) {
            const item = curriculumItems[i];
            const key = `curriculum_item_${i}`;
            
            
            const itemResponse = await fetch('/api/content/academics', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    section: 'curriculum_overview',
                    key: key,
                    title: item.subject || item.title || '',
                    content: item.description || '',
                    isActive: true
                })
            });

            if (!itemResponse.ok) {
                const errorData = await itemResponse.json();
                throw new Error(`Failed to save curriculum item ${i + 1}: ` + errorData.error);
            }

            const itemResult = await itemResponse.json();
            if (!itemResult.success) {
                throw new Error(`Failed to save curriculum item ${i + 1}: ` + itemResult.error);
            }
        }

        // Delete any curriculum items that were removed
        const currentItemKeys = curriculumItems.map((_, i) => `curriculum_item_${i}`);
        
        // Check for items from 0 to 9 (reasonable maximum)
        const keysToCheck = Array.from({ length: 10 }, (_, i) => `curriculum_item_${i}`);
        const keysToDelete = keysToCheck.filter(key => !currentItemKeys.includes(key));
        

        // Delete removed curriculum items
        for (const key of keysToDelete) {
            try {
                const deleteResponse = await fetch('/api/content/academics', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        section: 'curriculum_overview',
                        key: key
                    })
                });
                
                if (deleteResponse.ok) {
                } else {
                    const errorData = await deleteResponse.json();
                }
            } catch (error) {
                console.error(`❌ Error deleting ${key}:`, error);
            }
        }
        
    }

    /**
     * Save grade levels section with programs
     */
    async saveGradeLevelsSection(formData, button = null) {
        
        const token = localStorage.getItem('adminToken');
        if (!token) {
            throw new Error('Authentication required');
        }

        // Save section title and subtitle
        if (button) button.updateProgress('Saving section title...', 60);
        
        const titleResponse = await fetch('/api/content/academics', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                section: 'grade_levels',
                key: 'section_title',
                title: formData.gradeLevelsTitle || '',
                content: formData.gradeLevelsSubtitle || '',
                isActive: true
            })
        });

        if (!titleResponse.ok) {
            const errorData = await titleResponse.json();
            throw new Error(errorData.error || 'Failed to save section title');
        }

        const titleResult = await titleResponse.json();
        if (!titleResult.success) {
            throw new Error(titleResult.error || 'Failed to save section title');
        }


        // Upload images for each level first
        if (button) button.updateProgress('Uploading program images...', 60);
        
        const gradeLevels = this.getCurrentGradeLevels();
        
        // Upload images for levels that have selected files
        for (let i = 0; i < gradeLevels.length; i++) {
            const fileInput = document.getElementById(`level${i}-image-file`);
            const urlInput = document.getElementById(`level${i}-image-url`);
            
            if (fileInput && fileInput.files && fileInput.files.length > 0) {
                if (button) button.updateProgress(`Uploading image for program ${i + 1}...`, 60 + (i * 5));
                
                try {
                    // Create ImageUpload instance and initialize it
                    const imageUpload = new ImageUpload({
                        fileInputId: `level${i}-image-file`,
                        urlInputId: `level${i}-image-url`,
                        previewImgId: `level${i}-image-preview`,
                        previewContainerId: `level${i}-preview-container`,
                        removeBtnId: `level${i}-remove-btn`,
                        selectBtnId: `level${i}-select-image-btn`,
                        uploadFolder: 'marigold-school/academics/programs',
                        autoUpload: false
                    });
                    
                    // Initialize to set up elements reference
                    imageUpload.init();
                    
                    // Upload the file
                    const uploadResult = await imageUpload.uploadFile(fileInput.files[0]);
                    gradeLevels[i].imageUrl = uploadResult.url;
                    
                } catch (error) {
                    console.error(`❌ Failed to upload image for level ${i}:`, error);
                    
                    // Show error notification
                    if (this.showNotification) {
                        this.showNotification(
                            'Error', 
                            `Failed to upload image for ${gradeLevels[i].name || `Program ${i + 1}`}: ${error.message}`,
                            'error'
                        );
                    }
                    
                    // Continue without image but throw if it's a critical error
                    if (button) {
                        button.updateProgress(`Image upload failed for program ${i + 1}, continuing...`, 60 + (i * 5));
                    }
                }
            } else if (urlInput && urlInput.value) {
                // Use existing URL if no new file selected
                gradeLevels[i].imageUrl = urlInput.value;
            }
        }

        // Save grade level programs
        if (button) button.updateProgress('Saving grade level programs...', 80);

        for (let i = 0; i < gradeLevels.length; i++) {
            const level = gradeLevels[i];
            const key = `program_${i}`;
            
            
            const requestBody = {
                section: 'grade_levels',
                key: key,
                title: level.name || level.title || '',
                content: level.description || '',
                imageUrl: level.imageUrl || '', // ✅ Save imageUrl
                metadata: JSON.stringify({ 
                    age: level.age || level.ageRange || '',
                    features: level.features || [] // ✅ Save features
                }),
                isActive: true
            };
            
            
            const levelResponse = await fetch('/api/content/academics', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(requestBody)
            });

            if (!levelResponse.ok) {
                const errorData = await levelResponse.json();
                throw new Error(`Failed to save grade level ${i + 1}: ` + errorData.error);
            }

            const levelResult = await levelResponse.json();
            if (!levelResult.success) {
                throw new Error(`Failed to save grade level ${i + 1}: ` + levelResult.error);
            }
        }

        // Delete any grade levels that were removed
        const currentLevelKeys = gradeLevels.map((_, i) => `program_${i}`);
        
        const keysToCheck = Array.from({ length: 10 }, (_, i) => `program_${i}`);
        const keysToDelete = keysToCheck.filter(key => !currentLevelKeys.includes(key));
        

        for (const key of keysToDelete) {
            try {
                const deleteResponse = await fetch('/api/content/academics', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        section: 'grade_levels',
                        key: key
                    })
                });
                
                if (deleteResponse.ok) {
                } else {
                    const errorData = await deleteResponse.json();
                }
            } catch (error) {
                console.error(`❌ Error deleting ${key}:`, error);
            }
        }
        
    }

    /**
     * Save teaching methods section
     */
    async saveTeachingMethodsSection(formData, button = null) {
        
        const token = localStorage.getItem('adminToken');
        if (!token) {
            throw new Error('Authentication required');
        }

        // Save section title and subtitle
        if (button) button.updateProgress('Saving section title...', 60);
        
        const titleResponse = await fetch('/api/content/academics', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                section: 'teaching_methods',
                key: 'section_title',
                title: formData.teachingMethodsTitle || '',
                content: formData.teachingMethodsSubtitle || '',
                isActive: true
            })
        });

        if (!titleResponse.ok) {
            const errorData = await titleResponse.json();
            throw new Error(errorData.error || 'Failed to save section title');
        }

        const titleResult = await titleResponse.json();
        if (!titleResult.success) {
            throw new Error(titleResult.error || 'Failed to save section title');
        }


        // Save teaching methods
        if (button) button.updateProgress('Saving teaching methods...', 80);
        
        const methods = this.getCurrentTeachingMethods();

        for (let i = 0; i < methods.length; i++) {
            const method = methods[i];
            const key = `method_${i}`;
            
            
            const methodResponse = await fetch('/api/content/academics', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    section: 'teaching_methods',
                    key: key,
                    title: method.title || '',
                    content: method.description || '',
                    isActive: true
                })
            });

            if (!methodResponse.ok) {
                const errorData = await methodResponse.json();
                throw new Error(`Failed to save teaching method ${i + 1}: ` + errorData.error);
            }

            const methodResult = await methodResponse.json();
            if (!methodResult.success) {
                throw new Error(`Failed to save teaching method ${i + 1}: ` + methodResult.error);
            }
        }

        // Delete any teaching methods that were removed
        const currentMethodKeys = methods.map((_, i) => `method_${i}`);
        
        const keysToCheck = Array.from({ length: 10 }, (_, i) => `method_${i}`);
        const keysToDelete = keysToCheck.filter(key => !currentMethodKeys.includes(key));
        

        for (const key of keysToDelete) {
            try {
                const deleteResponse = await fetch('/api/content/academics', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        section: 'teaching_methods',
                        key: key
                    })
                });
                
                if (deleteResponse.ok) {
                } else {
                    const errorData = await deleteResponse.json();
                }
            } catch (error) {
                console.error(`❌ Error deleting ${key}:`, error);
            }
        }
        
    }

    /**
     * Save beyond academics section (simplified - saves as JSON)
     */
    async saveBeyondAcademicsSection(formData, button = null) {
        
        const token = localStorage.getItem('adminToken');
        if (!token) {
            throw new Error('Authentication required');
        }

        // Save section title
        if (button) button.updateProgress('Saving section title...', 60);
        
        const titleResponse = await fetch('/api/content/academics', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                section: 'beyond_academics',
                key: 'section_title',
                title: formData.beyondAcademicsTitle || '',
                content: formData.beyondAcademicsSubtitle || '',
                isActive: true
            })
        });

        if (!titleResponse.ok) {
            const errorData = await titleResponse.json();
            throw new Error(errorData.error || 'Failed to save section title');
        }


        // Save activities as JSON
        if (button) button.updateProgress('Saving activities...', 80);
        
        // Get activities from the current form state
        const activities = this.getCurrentActivities();
        
        const activitiesResponse = await fetch('/api/content/academics', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                section: 'beyond_academics',
                key: 'activities',
                content: JSON.stringify(activities),
                isActive: true
            })
        });

        if (!activitiesResponse.ok) {
            const errorData = await activitiesResponse.json();
            throw new Error(errorData.error || 'Failed to save activities');
        }

    }

    /**
     * Save achievements section
     */
    async saveAchievementsSection(formData, button = null) {
        
        const token = localStorage.getItem('adminToken');
        if (!token) {
            throw new Error('Authentication required');
        }

        // Save section title
        if (button) button.updateProgress('Saving section title...', 30);
        
        const titleResponse = await fetch('/api/content/academics', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                section: 'academic_achievements',
                key: 'section_title',
                title: formData.achievementsTitle || '',
                content: formData.achievementsSubtitle || '',
                isActive: true
            })
        });

        if (!titleResponse.ok) {
            const errorData = await titleResponse.json();
            throw new Error(errorData.error || 'Failed to save section title');
        }


        // Save individual achievement cards
        if (button) button.updateProgress('Saving achievement cards...', 60);
        
        // Collect achievement cards from form data
        const achievements = [];
        let achievementIndex = 0;
        
        while (formData[`achievement${achievementIndex}Icon`] !== undefined) {
            const achievement = {
                icon: formData[`achievement${achievementIndex}Icon`] || 'trophy',
                number: formData[`achievement${achievementIndex}Number`] || '',
                label: formData[`achievement${achievementIndex}Label`] || ''
            };
            achievements.push(achievement);
            achievementIndex++;
        }
        
        
        // Save achievements as JSON
        const achievementsResponse = await fetch('/api/content/academics', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                section: 'academic_achievements',
                key: 'achievements',
                content: JSON.stringify(achievements),
                isActive: true
            })
        });

        if (!achievementsResponse.ok) {
            const errorData = await achievementsResponse.json();
            throw new Error(errorData.error || 'Failed to save achievements');
        }

    }

    /**
     * Save CTA section
     */
    async saveCtaSection(formData, button = null) {
        
        const token = localStorage.getItem('adminToken');
        if (!token) {
            throw new Error('Authentication required');
        }

        // Save CTA section data as JSON in section_title
        if (button) button.updateProgress('Saving CTA section...', 70);
        
        const ctaData = {
            title: formData.academicsCtaTitle || '',
            description: formData.academicsCtaDescription || '',
            primaryButton: {
                text: formData.academicsCtaPrimaryButton || '',
                link: '/documents/curriculum.pdf'
            },
            secondaryButton: {
                text: formData.academicsCtaSecondaryButton || '',
                link: '/contact.html'
            },
            tertiaryButton: {
                text: formData.academicsCtaTertiaryButton || '',
                action: 'openApplicationModal()'
            }
        };
        
        const response = await fetch('/api/content/academics', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                section: 'cta_section',
                key: 'section_title',
                title: '',
                content: JSON.stringify(ctaData),
                isActive: true
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to save CTA section');
        }

        const result = await response.json();
        if (!result.success) {
            throw new Error(result.error || 'Failed to save CTA section');
        }

    }

    /**
     * Get section display name
     */
    getSectionName(section) {
        const sectionNames = {
            'philosophy': 'Philosophy',
            'curriculum': 'Curriculum',
            'grade-levels': 'Grade Levels',
            'teaching-methods': 'Teaching Methods',
            'beyond-academics': 'Beyond Academics',
            'achievements': 'Achievements',
            'cta': 'Call to Action'
        };
        return sectionNames[section] || 'Section';
    }

    /**
     * Format data for individual section API
     */
    formatSectionData(section, formData) {
        const sectionMapping = {
            'philosophy': 'academic_philosophy',
            'curriculum': 'curriculum_overview',
            'grade-levels': 'grade_levels',
            'teaching-methods': 'teaching_methods',
            'beyond-academics': 'beyond_academics',
            'achievements': 'academic_achievements',
            'cta': 'cta_section'
        };

        const dbSection = sectionMapping[section];
        if (!dbSection) {
            throw new Error(`Unknown section: ${section}`);
        }

        // Return the first field for individual update
        // The API expects section, key, and the field data
        switch (section) {
            case 'philosophy':
                // For philosophy, we need to update both section_title and philosophy_description
                // We'll return the section_title first, and handle philosophy_description separately
                return {
                    section: dbSection,
                    key: 'section_title',
                    title: formData.academicsTitle || '',
                    content: formData.academicsDescription || '',
                    isActive: true
                };
            case 'curriculum':
                return {
                    section: dbSection,
                    key: 'section_title',
                    title: formData.curriculumTitle || '',
                    content: formData.curriculumDescription || '',
                    isActive: true
                };
            case 'grade-levels':
                // For now, just save the section title and subtitle
                // The programs data will be handled separately
                return {
                    section: dbSection,
                    key: 'section_title',
                    title: formData.gradeLevelsTitle || '',
                    content: formData.gradeLevelsSubtitle || '',
                    isActive: true
                };
            case 'teaching-methods':
                return {
                    section: dbSection,
                    key: 'section_title',
                    title: formData.teachingMethodsTitle || '',
                    content: formData.teachingMethodsSubtitle || '',
                    isActive: true
                };
            case 'beyond-academics':
                // Collect activities data
                const activities = [];
                const activityItems = document.querySelectorAll('.activity-item');
                
                activityItems.forEach((item, index) => {
                    const name = item.querySelector(`input[name="activity${index}Name"]`)?.value || '';
                    const category = item.querySelector(`input[name="activity${index}Category"]`)?.value || '';
                    const optionsList = item.querySelector(`#activity${index}OptionsList`);
                    const options = [];
                    
                    if (optionsList) {
                        const optionItems = optionsList.querySelectorAll('.activity-option-item');
                        optionItems.forEach(optionItem => {
                            const optionText = optionItem.querySelector('.option-text')?.textContent?.trim();
                            if (optionText) {
                                options.push(optionText);
                            }
                        });
                    }
                    
                    if (name || category || options.length > 0) {
                        activities.push({
                            name,
                            category,
                            options
                        });
                    }
                });
                
                return {
                    section: dbSection,
                    key: 'activities',
                    title: 'Extracurricular Activities',
                    content: JSON.stringify(activities),
                    isActive: true
                };
            case 'achievements':
                // Collect achievements data
                const achievements = [];
                const achievementItems = document.querySelectorAll('.achievement-card');
                
                achievementItems.forEach((item, index) => {
                    const icon = item.querySelector(`input[name="achievement${index}Icon"]`)?.value || '';
                    const number = item.querySelector(`input[name="achievement${index}Number"]`)?.value || '';
                    const label = item.querySelector(`input[name="achievement${index}Label"]`)?.value || '';
                    
                    if (icon || number || label) {
                        achievements.push({
                            icon,
                            number,
                            label
                        });
                    }
                });
                
                return {
                    section: dbSection,
                    key: 'section_title',
                    title: formData.achievementsTitle || '',
                    content: formData.achievementsSubtitle || '',
                    isActive: true
                };
            case 'cta':
                // Collect CTA button data
                const ctaData = {
                    title: formData.academicsCtaTitle || '',
                    description: formData.academicsCtaDescription || '',
                    primaryButton: {
                        text: formData.academicsCtaPrimaryButton || '',
                        link: '/documents/curriculum.pdf'
                    },
                    secondaryButton: {
                        text: formData.academicsCtaSecondaryButton || '',
                        link: '/contact.html'
                    },
                    tertiaryButton: {
                        text: formData.academicsCtaTertiaryButton || '',
                        action: 'openApplicationModal()'
                    }
                };
                
                return {
                    section: dbSection,
                    key: 'section_title',
                    title: ctaData.title,
                    content: JSON.stringify(ctaData),
                    isActive: true
                };
            default:
                throw new Error(`Unknown section: ${section}`);
        }
    }

    /**
     * Collect highlights from form data
     */
    collectHighlights(formData) {
        const highlights = [];
        let index = 0;
        
        while (formData[`highlight${index}Title`]) {
            highlights.push({
                title: formData[`highlight${index}Title`] || '',
                description: formData[`highlight${index}Description`] || '',
                icon: formData[`highlight${index}Icon`] || 'brain'
            });
            index++;
        }
        
        return highlights;
    }

    /**
     * Collect grade levels from form data
     */
    collectGradeLevels(formData) {
        const levels = [];
        let index = 0;
        
        while (formData[`level${index}Name`]) {
            levels.push({
                title: formData[`level${index}Name`] || '',
                description: formData[`level${index}Description`] || '',
                content: formData[`level${index}Content`] || '',
                age: formData[`level${index}Age`] || ''
            });
            index++;
        }
        
        return levels;
    }

    /**
     * Collect activities from form data
     */
    collectActivities(formData) {
        const activities = [];
        let index = 0;
        
        while (formData[`activity${index}Name`]) {
            activities.push({
                name: formData[`activity${index}Name`] || '',
                category: formData[`activity${index}Category`] || '',
                description: formData[`activity${index}Description`] || ''
            });
            index++;
        }
        
        return activities;
    }

    /**
     * Collect achievements from form data
     */
    collectAchievements(formData) {
        const achievements = [];
        let index = 0;
        
        while (formData[`achievement${index}Title`]) {
            achievements.push({
                title: formData[`achievement${index}Title`] || '',
                year: formData[`achievement${index}Year`] || '',
                description: formData[`achievement${index}Description`] || ''
            });
            index++;
        }
        
        return achievements;
    }


    /**
     * Show notification
     */
    showNotification(title, message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-icon">
                    ${type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ'}
                </div>
                <div class="notification-text">
                    <div class="notification-title">${title}</div>
                    <div class="notification-message">${message}</div>
                </div>
            </div>
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    /**
     * Get Philosophy Section Editor
     */
    getPhilosophyEditor() {
        return `
            <div class="section-editor">
                <div class="editor-header">
                    <div class="editor-title">
                        <span class="section-icon">🎓</span>
                        <h2>Academic Philosophy</h2>
                    </div>
                    <p>Configure the academic philosophy and educational approach.</p>
                </div>
                
                <div class="editor-content">
                    <form class="section-form" id="philosophyForm">
                                <div class="form-group">
                                    <label for="academicsTitle">Section Title</label>
                                    <input type="text" id="academicsTitle" name="academicsTitle" class="form-input" placeholder="Our Academic Philosophy">
                                </div>
                        
                                <div class="form-group">
                                    <label for="academicsDescription">Description</label>
                                    <textarea id="academicsDescription" name="academicsDescription" class="form-textarea" rows="4" placeholder="Enter philosophy description"></textarea>
                                </div>
                        
                                <div class="form-group">
                                    <label>Section Background Image</label>
                                    <div id="philosophy-image-upload-container"></div>
                                    <input type="hidden" id="philosophy-image-url" name="philosophyImageUrl" value="">
                                </div>
                        
                                <div class="highlights-container" id="philosophyHighlights">
                                    <div class="section-header">
                                    <h4>Philosophy Highlights</h4>
                                        <button type="button" class="btn btn-secondary btn-sm" id="addHighlightBtn">
                                            <i data-lucide="plus"></i>
                                            Add Highlight
                                        </button>
                                    </div>
                                    <div class="highlight-items">
                                        <!-- Highlight items will be dynamically added here -->
                                    </div>
                                </div>
                            </form>
                        </div>
                
                <div class="editor-actions">
                    <button class="btn btn-primary save-section-btn" data-section="philosophy">
                        <i data-lucide="save"></i>
                        Save Philosophy
                    </button>
                    </div>
            </div>
        `;
    }

    /**
     * Get Grade Levels Section Editor
     */
    getGradeLevelsEditor() {
        return `
            <div class="section-editor">
                <div class="editor-header">
                    <div class="editor-title">
                        <span class="section-icon">📚</span>
                        <h2>Grade Levels</h2>
                            </div>
                    <p>Configure the grade levels and academic programs offered.</p>
                        </div>
                
                <div class="editor-content">
                    <form class="section-form" id="gradeLevelsForm">
                                <div class="form-group">
                                    <label for="gradeLevelsTitle">Section Title</label>
                                    <input type="text" id="gradeLevelsTitle" name="gradeLevelsTitle" class="form-input" placeholder="Academic Programs">
                                </div>
                        
                                <div class="form-group">
                                    <label for="gradeLevelsSubtitle">Section Subtitle</label>
                                    <input type="text" id="gradeLevelsSubtitle" name="gradeLevelsSubtitle" class="form-input" placeholder="Comprehensive education from early years to secondary level">
                                </div>
                        
                                <div class="levels-container" id="gradeLevels">
                                    <div class="section-header">
                                    <h4>Academic Programs</h4>
                                        <button type="button" class="btn btn-secondary btn-sm" id="addGradeLevelBtn">
                                            <i data-lucide="plus"></i>
                                            Add Program
                                        </button>
                                    </div>
                                    <div class="level-items">
                                        <!-- Level items will be dynamically added here -->
                                    </div>
                                </div>
                            </form>
                        </div>
                
                <div class="editor-actions save-button-container">
                    <button class="btn btn-primary save-section-btn" data-section="grade-levels">
                        <i data-lucide="save"></i>
                        Save Grade Levels
                    </button>
                    </div>
            </div>
        `;
    }

    /**
     * Get Beyond Academics Section Editor
     */
    getBeyondAcademicsEditor() {
        return `
            <div class="section-editor structured-container">
                <div class="editor-header structured-section-header">
                    <div class="editor-title structured-section-title">
                        <span class="section-icon">🏃</span>
                        <h2>Beyond Academics</h2>
                            </div>
                    <p class="structured-section-subtitle">Configure holistic development through extracurricular activities and programs</p>
                        </div>
                
                <div class="editor-content structured-section">
                    <form class="section-form structured-form" id="beyondAcademicsForm">
                        <div class="structured-form-group">
                            <label for="beyondAcademicsTitle" class="structured-form-label">Section Title</label>
                            <input type="text" id="beyondAcademicsTitle" name="beyondAcademicsTitle" class="structured-form-input" placeholder="Beyond Academics">
                                </div>
                        
                        <div class="structured-form-group">
                            <label for="beyondAcademicsSubtitle" class="structured-form-label">Section Subtitle</label>
                            <input type="text" id="beyondAcademicsSubtitle" name="beyondAcademicsSubtitle" class="structured-form-input" placeholder="Holistic development through extracurricular activities and programs">
                                </div>
                        
                        <div class="activities-container structured-section">
                            <div class="structured-section-header">
                            <h4 class="structured-section-title">Extracurricular Activities</h4>
                                <button type="button" class="btn btn-secondary btn-sm" id="addActivityBtn">
                                    <i data-lucide="plus"></i>
                                    Add Activity
                                </button>
                            </div>
                            <div class="activities-items" id="beyondAcademicsActivities">
                                <!-- Activity categories will be dynamically added here -->
                                    </div>
                                </div>
                            </form>
                        </div>
                
                <div class="editor-actions save-button-container">
                    <button class="btn btn-primary structured-button structured-button-primary save-section-btn" data-section="beyond-academics">
                        <i data-lucide="save"></i>
                        Save Beyond Academics
                    </button>
                    </div>
            </div>
        `;
    }

    /**
     * Get CTA Section Editor
     */
    getCtaEditor() {
        return `
            <div class="section-editor structured-container">
                <div class="editor-header structured-section-header">
                    <div class="editor-title structured-section-title">
                        <span class="section-icon">🎯</span>
                        <h2>Call to Action</h2>
                            </div>
                    <p class="structured-section-subtitle">Configure the call-to-action section for academic enrollment</p>
                        </div>
                
                <div class="editor-content structured-section">
                    <form class="section-form structured-form" id="academicsCtaForm">
                        <div class="structured-form-group">
                            <label for="academicsCtaTitle" class="structured-form-label">Section Title</label>
                            <input type="text" id="academicsCtaTitle" name="academicsCtaTitle" class="structured-form-input" placeholder="Ready to Join Our Academic Excellence?">
                                </div>
                        
                        <div class="structured-form-group">
                            <label for="academicsCtaDescription" class="structured-form-label">Description</label>
                            <textarea id="academicsCtaDescription" name="academicsCtaDescription" class="structured-form-textarea" rows="3" placeholder="Discover how Marigold School can nurture your child's academic potential and prepare them for a bright future."></textarea>
                                </div>
                        
                        <div class="cta-buttons-container structured-section">
                            <div class="structured-section-header">
                                <h4 class="structured-section-title">Action Buttons</h4>
                                <p class="structured-section-subtitle">Configure the call-to-action buttons for enrollment</p>
                            </div>
                            <div class="cta-buttons-grid">
                                <div class="structured-form-group">
                                    <label for="academicsCtaPrimaryButton" class="structured-form-label">Primary Button Text</label>
                                    <input type="text" id="academicsCtaPrimaryButton" name="academicsCtaPrimaryButton" class="structured-form-input" placeholder="Download Curriculum">
                                </div>
                        
                                <div class="structured-form-group">
                                    <label for="academicsCtaSecondaryButton" class="structured-form-label">Secondary Button Text</label>
                                    <input type="text" id="academicsCtaSecondaryButton" name="academicsCtaSecondaryButton" class="structured-form-input" placeholder="Contact Us">
                                </div>
                        
                                <div class="structured-form-group">
                                    <label for="academicsCtaTertiaryButton" class="structured-form-label">Tertiary Button Text</label>
                                    <input type="text" id="academicsCtaTertiaryButton" name="academicsCtaTertiaryButton" class="structured-form-input" placeholder="Apply for Admission">
                                </div>
                            </div>
                                </div>
                            </form>
                        </div>
                
                <div class="editor-actions save-button-container">
                    <button class="btn btn-primary structured-button structured-button-primary save-section-btn" data-section="cta">
                        <i data-lucide="save"></i>
                        Save CTA Section
                    </button>
                    </div>
            </div>
        `;
    }

    /**
     * Get Curriculum Section Editor
     */
    getCurriculumEditor() {
        return `
            <div class="section-editor structured-section">
                <div class="editor-header structured-section-header">
                    <div class="editor-title">
                        <span class="section-icon">📖</span>
                        <h2 class="structured-section-title">Curriculum Overview</h2>
                        <p class="structured-section-subtitle">Configure the curriculum details and subject offerings</p>
                            </div>
                        </div>
                
                <div class="editor-content">
                    <form class="section-form structured-form" id="curriculumSectionForm">
                        <div class="structured-form-group">
                            <label for="curriculumTitle" class="structured-form-label">Section Title</label>
                            <input type="text" id="curriculumTitle" name="curriculumTitle" class="structured-form-input" placeholder="Our Curriculum">
                                </div>
                        
                        <div class="structured-form-group">
                            <label for="curriculumDescription" class="structured-form-label">Description</label>
                            <textarea id="curriculumDescription" name="curriculumDescription" class="structured-form-textarea" rows="4" placeholder="Enter curriculum description"></textarea>
                                </div>
                        
                        <div class="curriculum-container structured-section" id="curriculumContainer">
                            <div class="structured-section-header">
                                <h4 class="structured-section-title">Curriculum Subjects</h4>
                                <button type="button" class="btn btn-secondary btn-sm" id="addCurriculumBtn">
                                    <i data-lucide="plus"></i>
                                    Add Subject
                                </button>
                            </div>
                            <div class="curriculum-items structured-grid">
                                        <!-- Curriculum items will be dynamically added here -->
                                    </div>
                                </div>
                            </form>
                        </div>
                
                <div class="editor-actions save-button-container">
                    <button class="structured-button structured-button-primary save-section-btn" data-section="curriculum">
                        <i data-lucide="save"></i>
                        Save Curriculum
                    </button>
                    </div>
            </div>
        `;
    }

    /**
     * Get Teaching Methods Section Editor
     */
    getTeachingMethodsEditor() {
        return `
            <div class="section-editor structured-section">
                <div class="editor-header structured-section-header">
                    <div class="editor-title">
                        <span class="section-icon">👨‍🏫</span>
                        <h2 class="structured-section-title">Teaching Methodologies</h2>
                        <p class="structured-section-subtitle">Configure innovative approaches to make learning engaging and effective</p>
                            </div>
                        </div>
                
                <div class="editor-content">
                    <form class="section-form structured-form" id="teachingMethodsForm">
                        <div class="structured-form-group">
                            <label for="teachingMethodsTitle" class="structured-form-label">Section Title</label>
                            <input type="text" id="teachingMethodsTitle" name="teachingMethodsTitle" class="structured-form-input" placeholder="Modern Teaching Methodologies">
                                </div>
                        
                        <div class="structured-form-group">
                            <label for="teachingMethodsSubtitle" class="structured-form-label">Section Subtitle</label>
                            <input type="text" id="teachingMethodsSubtitle" name="teachingMethodsSubtitle" class="structured-form-input" placeholder="Innovative approaches to make learning engaging and effective">
                                </div>
                        
                        <div class="curriculum-container structured-section" id="teachingMethodsContainer">
                            <div class="structured-section-header">
                                <h4 class="structured-section-title">Teaching Methods</h4>
                                <button type="button" class="btn btn-secondary btn-sm" id="addTeachingMethodBtn">
                                    <i data-lucide="plus"></i>
                                    Add Method
                                </button>
                            </div>
                            <div class="methods-items structured-grid">
                                        <!-- Method items will be dynamically added here -->
                                    </div>
                                </div>
                            </form>
                        </div>
                
                <div class="editor-actions save-button-container">
                    <button class="structured-button structured-button-primary save-section-btn" data-section="teaching-methods">
                        <i data-lucide="save"></i>
                        Save Teaching Methods
                    </button>
                    </div>
            </div>
        `;
    }

    /**
     * Get Achievements Section Editor
     */
    getAchievementsEditor() {
        return `
            <div class="section-editor structured-container">
                <div class="editor-header structured-section-header">
                    <div class="editor-title structured-section-title">
                        <span class="section-icon">🏆</span>
                        <h2>Academic Achievements</h2>
                            </div>
                    <p class="structured-section-subtitle">Configure academic achievements and recognitions</p>
                        </div>
                
                <div class="editor-content structured-section">
                    <form class="section-form structured-form" id="achievementsForm">
                        <div class="structured-form-group">
                            <label for="achievementsTitle" class="structured-form-label">Section Title</label>
                            <input type="text" id="achievementsTitle" name="achievementsTitle" class="structured-form-input" placeholder="Academic Achievements">
                                </div>
                        
                        <div class="structured-form-group">
                            <label for="achievementsSubtitle" class="structured-form-label">Section Subtitle</label>
                            <input type="text" id="achievementsSubtitle" name="achievementsSubtitle" class="structured-form-input" placeholder="Celebrating our students' success and academic excellence">
                                </div>
                        
                        <div class="achievements-container structured-section">
                            <div class="structured-section-header">
                                <h4 class="structured-section-title">Achievement Cards</h4>
                                <p class="structured-section-subtitle">Configure achievement statistics and recognitions (SEE distinction rate, pass rate, competition winners)</p>
                            </div>
                            <div class="achievements-grid" id="achievementsContainer">
                                        <!-- Achievement items will be dynamically added here -->
                                    </div>
                                </div>
                            </form>
                        </div>
                
                <div class="editor-actions save-button-container">
                    <button class="btn btn-primary structured-button structured-button-primary save-section-btn" data-section="achievements">
                        <i data-lucide="save"></i>
                        Save Achievements
                    </button>
                    </div>
                </div>
        `;
    }

    /**
     * Initialize academics content functionality
     */
    initializeAcademicsContent() {
        // Initialize any academics content-specific functionality
        this.loadAcademicsData();
        
        // Set up section menu item clicks after content is loaded
        this.setupSectionMenuClicks();
        
        // Show section list by default
        this.showSectionList();
    }

    /**
     * Set up section menu item clicks
     */
    setupSectionMenuClicks() {
        // Use event delegation instead of direct event listeners
        document.addEventListener('click', (e) => {
            const sectionMenuItem = e.target.closest('.section-menu-item');
            if (!sectionMenuItem) return;
            
            // Check if we're in academics content management
            const pageContent = document.getElementById('pageContent');
            if (pageContent && pageContent.innerHTML.includes('academics-content-section')) {
                
                e.preventDefault();
                e.stopPropagation();
                const section = sectionMenuItem.dataset.section;
                this.loadSection(section);
            }
        });
    }

    /**
     * Load academics data from API
     */
    async loadAcademicsData() {
        try {
            // Add cache-busting to always get fresh data
            const cacheBuster = `?t=${Date.now()}`;
            const response = await fetch(`/api/content/academics${cacheBuster}`, {
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                }
            });
            const data = await response.json();
            
            if (data.success && data.content) {
                this.academicsData = data.content;
                
                // Update section enabled states based on data
                Object.keys(this.sections).forEach(sectionKey => {
                    const sectionData = data.content[this.getSectionKey(sectionKey)];
                    if (sectionData && typeof sectionData.enabled === 'boolean') {
                        this.sections[sectionKey].enabled = sectionData.enabled;
                    }
                });
                
                // Remove shimmer placeholders and show actual content
                this.removeShimmerPlaceholders();
                
                
                this.populateForms(data.content);
            }
        } catch (error) {
            console.error('Error loading academics data:', error);
        }
    }

    /**
     * Remove shimmer placeholders and show actual content
     */
    removeShimmerPlaceholders() {
        const sectionMenuItems = document.querySelectorAll('.section-menu-item');
        sectionMenuItems.forEach(item => {
            // Remove shimmer classes
            item.classList.remove('shimmer-placeholder');
            
            // Update the content with actual data
            const sectionKey = item.dataset.section;
            const section = this.sections[sectionKey];
            
            if (section) {
                // Update section info
                const sectionInfo = item.querySelector('.section-info');
                if (sectionInfo) {
                    sectionInfo.innerHTML = `
                        <h3>${section.name}</h3>
                        <p>Manage ${section.name.toLowerCase()} content</p>
                    `;
                }
                
            }
        });
    }


    /**
     * Get section key for data mapping
     */
    getSectionKey(sectionKey) {
        const keyMap = {
            'philosophy': 'academicPhilosophy',
            'curriculum': 'curriculumOverview',
            'grade-levels': 'gradeLevels',
            'teaching-methods': 'teachingMethods',
            'beyond-academics': 'beyondAcademics',
            'achievements': 'academicAchievements',
            'cta': 'ctaSection'
        };
        return keyMap[sectionKey] || sectionKey;
    }

    /**
     * Populate forms with data
     */
    populateForms(content) {
        // Only populate forms if they exist (when section editor is loaded)
        if (!document.getElementById('sectionEditor') || document.getElementById('sectionEditor').style.display === 'none') {
            return; // Don't populate if section editor is not visible
        }

        // Populate academic philosophy
        if (content.philosophy) {
            const titleEl = document.getElementById('academicsTitle');
            const descEl = document.getElementById('academicsDescription');
            if (titleEl) titleEl.value = content.philosophy.title || '';
            if (descEl) descEl.value = content.philosophy.description || '';
            this.renderHighlights(content.philosophy.highlights || []);
        }

        // Populate grade levels
        if (content.gradeLevels) {
            const titleEl = document.getElementById('gradeLevelsTitle');
            const subtitleEl = document.getElementById('gradeLevelsSubtitle');
            if (titleEl) titleEl.value = content.gradeLevels.title || '';
            if (subtitleEl) subtitleEl.value = content.gradeLevels.subtitle || '';
            this.renderGradeLevels(content.gradeLevels.levels || []);
        }

        // Populate beyond academics
        if (content.beyondAcademics) {
            const titleEl = document.getElementById('beyondAcademicsTitle');
            const subtitleEl = document.getElementById('beyondAcademicsSubtitle');
            if (titleEl) titleEl.value = content.beyondAcademics.title || '';
            if (subtitleEl) subtitleEl.value = content.beyondAcademics.subtitle || '';
            this.renderActivities(content.beyondAcademics.activities || []);
        }

        // Populate CTA section
        if (content.cta) {
            const titleEl = document.getElementById('academicsCtaTitle');
            const subtitleEl = document.getElementById('academicsCtaSubtitle');
            const descEl = document.getElementById('academicsCtaDescription');
            const primaryEl = document.getElementById('academicsCtaPrimaryButton');
            const secondaryEl = document.getElementById('academicsCtaSecondaryButton');
            if (titleEl) titleEl.value = content.cta.title || '';
            if (subtitleEl) subtitleEl.value = content.cta.subtitle || '';
            if (descEl) descEl.value = content.cta.description || '';
            if (primaryEl) primaryEl.value = content.cta.primaryButton || '';
            if (secondaryEl) secondaryEl.value = content.cta.secondaryButton || '';
        }

        // Populate curriculum section
        if (content.curriculum) {
            const titleEl = document.getElementById('curriculumTitle');
            const descEl = document.getElementById('curriculumDescription');
            if (titleEl) titleEl.value = content.curriculum.title || '';
            if (descEl) descEl.value = content.curriculum.description || '';
            this.renderCurriculum(content.curriculum.items || []);
        }

        // Populate teaching methods
        if (content.teachingMethods) {
            const titleEl = document.getElementById('teachingMethodsTitle');
            const descEl = document.getElementById('teachingMethodsDescription');
            if (titleEl) titleEl.value = content.teachingMethods.title || '';
            if (descEl) descEl.value = content.teachingMethods.description || '';
            this.renderTeachingMethods(content.teachingMethods.methods || []);
        }

        // Populate achievements
        if (content.achievements) {
            const titleEl = document.getElementById('achievementsTitle');
            const descEl = document.getElementById('achievementsDescription');
            if (titleEl) titleEl.value = content.achievements.title || '';
            if (descEl) descEl.value = content.achievements.description || '';
            this.renderAchievements(content.achievements.items || []);
        }
    }

    /**
     * Render philosophy highlights
     */
    renderHighlights(highlights) {
        // Try multiple selectors to find the container
        let container = document.querySelector('.highlight-items');
        if (!container) {
            container = document.querySelector('#philosophyHighlights .highlight-items');
        }
        if (!container) {
            container = document.querySelector('#philosophyHighlights');
        }
        if (!container) {
            return;
        }

        container.innerHTML = '';
        
        if (highlights.length === 0) {
            container.innerHTML = '<div class="empty-state">No highlights added yet. Click "Add Highlight" to create one.</div>';
            return;
        }
        
        highlights.forEach((highlight, index) => {
            const highlightHTML = `
                <div class="highlight-item" data-index="${index}">
                    <div class="highlight-header">
                        <h5>Highlight ${index + 1}</h5>
                        <button type="button" class="btn btn-sm btn-danger remove-highlight-btn" data-index="${index}">
                            <i data-lucide="trash-2"></i>
                            Remove
                        </button>
                    </div>
                    <div class="form-row">
                    <div class="form-group">
                            <label for="highlight${index}Title">Title</label>
                            <input type="text" id="highlight${index}Title" name="highlight${index}Title" class="form-input" placeholder="Critical Thinking" value="${highlight.text || highlight.title || ''}">
                        </div>
                        <div class="form-group">
                            <label for="highlight${index}Icon">Icon</label>
                            <select id="highlight${index}Icon" name="highlight${index}Icon" class="form-input">
                                <option value="brain" ${(highlight.icon === 'brain') ? 'selected' : ''}>🧠 Brain</option>
                                <option value="users" ${(highlight.icon === 'users') ? 'selected' : ''}>👥 Users</option>
                                <option value="palette" ${(highlight.icon === 'palette') ? 'selected' : ''}>🎨 Palette</option>
                                <option value="heart" ${(highlight.icon === 'heart') ? 'selected' : ''}>❤️ Heart</option>
                                <option value="star" ${(highlight.icon === 'star') ? 'selected' : ''}>⭐ Star</option>
                                <option value="trophy" ${(highlight.icon === 'trophy') ? 'selected' : ''}>🏆 Trophy</option>
                                <option value="lightbulb" ${(highlight.icon === 'lightbulb') ? 'selected' : ''}>💡 Lightbulb</option>
                                <option value="shield" ${(highlight.icon === 'shield') ? 'selected' : ''}>🛡️ Shield</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="highlight${index}Description">Description</label>
                        <textarea id="highlight${index}Description" name="highlight${index}Description" class="form-textarea" rows="2" placeholder="Enter highlight description">${highlight.description || ''}</textarea>
                    </div>
                </div>
            `;
            container.innerHTML += highlightHTML;
        });

        // Reinitialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        // Update button state after rendering
        this.updateAddHighlightButtonState();
    }

    /**
     * Add a new highlight
     */
    addHighlight() {
        
        // Get current highlights from the form
        const currentHighlights = this.getCurrentHighlights();
        
        // Check if limit reached (maximum 4 highlights)
        if (currentHighlights.length >= 4) {
            window.NotificationManager.show('Maximum limit reached', 'You can only add up to 4 philosophy highlights.', 'warning');
            console.warn('⚠️ Maximum highlight limit (4) reached');
            return;
        }
        
        // Add a new empty highlight
        currentHighlights.push({
            text: '',
            title: '',
            description: '',
            icon: 'brain'
        });
        
        // Re-render highlights
        this.renderHighlights(currentHighlights);
        
        
        // Update button state
        this.updateAddHighlightButtonState();
    }

    /**
     * Remove a highlight
     */
    removeHighlight(index) {
        
        // Get current highlights from the form
        const currentHighlights = this.getCurrentHighlights();
        
        // Remove the highlight at the specified index
        if (index >= 0 && index < currentHighlights.length) {
            currentHighlights.splice(index, 1);
            
            // Re-render highlights
            this.renderHighlights(currentHighlights);
            
            
            // Update button state
            this.updateAddHighlightButtonState();
        } else {
            console.warn(`⚠️ Invalid highlight index: ${index}`);
        }
    }

    /**
     * Update the state of the "Add Highlight" button based on current count
     */
    updateAddHighlightButtonState() {
        const addBtn = document.getElementById('addHighlightBtn');
        if (!addBtn) return;
        
        const currentHighlights = this.getCurrentHighlights();
        const isLimitReached = currentHighlights.length >= 4;
        
        if (isLimitReached) {
            addBtn.disabled = true;
            addBtn.style.opacity = '0.5';
            addBtn.style.cursor = 'not-allowed';
            addBtn.title = 'Maximum limit of 4 highlights reached';
        } else {
            addBtn.disabled = false;
            addBtn.style.opacity = '1';
            addBtn.style.cursor = 'pointer';
            addBtn.title = 'Add a new highlight';
        }
    }

    /**
     * Get current highlights from the form
     */
    getCurrentHighlights() {
        const highlights = [];
        let index = 0;
        
        // Loop through all highlight inputs
        while (document.getElementById(`highlight${index}Title`)) {
            const title = document.getElementById(`highlight${index}Title`)?.value || '';
            const description = document.getElementById(`highlight${index}Description`)?.value || '';
            const icon = document.getElementById(`highlight${index}Icon`)?.value || 'brain';
            
            highlights.push({
                text: title,
                title: title,
                description: description,
                icon: icon
            });
            
            index++;
        }
        
        return highlights;
    }

    /**
     * Add a new curriculum item
     */
    addCurriculumItem() {
        
        // Get current curriculum items from the form
        const currentItems = this.getCurrentCurriculumItems();
        
        // Add a new empty curriculum item
        currentItems.push({
            subject: '',
            title: '',
            description: '',
            icon: 'book'
        });
        
        // Re-render curriculum items
        this.renderCurriculum(currentItems);
        
    }

    /**
     * Remove a curriculum item
     */
    removeCurriculumItem(index) {
        
        // Get current curriculum items from the form
        const currentItems = this.getCurrentCurriculumItems();
        
        // Remove the item at the specified index
        if (index >= 0 && index < currentItems.length) {
            currentItems.splice(index, 1);
            
            // Re-render curriculum items
            this.renderCurriculum(currentItems);
            
        } else {
            console.warn(`⚠️ Invalid curriculum item index: ${index}`);
        }
    }

    /**
     * Get current curriculum items from form inputs
     */
    getCurrentCurriculumItems() {
        const items = [];
        const container = document.querySelector('.curriculum-items');
        
        if (!container) {
            console.warn('⚠️ Curriculum items container not found');
            return items;
        }
        
        const itemElements = container.querySelectorAll('.curriculum-item');
        
        itemElements.forEach((element, index) => {
            const titleInput = document.getElementById(`curriculum${index}Title`);
            const descriptionInput = document.getElementById(`curriculum${index}Description`);
            
            if (titleInput) {
                items.push({
                    subject: titleInput.value.trim(),
                    title: titleInput.value.trim(),
                    description: descriptionInput ? descriptionInput.value.trim() : '',
                    icon: 'book'
                });
            }
        });
        
        return items;
    }

    /**
     * Add a new grade level
     */
    addGradeLevel() {
        
        const currentLevels = this.getCurrentGradeLevels();
        
        currentLevels.push({
            name: '',
            age: '',
            description: ''
        });
        
        this.renderGradeLevels(currentLevels);
        
    }

    /**
     * Remove a grade level
     */
    removeGradeLevel(index) {
        
        const currentLevels = this.getCurrentGradeLevels();
        
        if (index >= 0 && index < currentLevels.length) {
            currentLevels.splice(index, 1);
            this.renderGradeLevels(currentLevels);
        } else {
            console.warn(`⚠️ Invalid grade level index: ${index}`);
        }
    }

    /**
     * Get current grade levels from form inputs
     */
    getCurrentGradeLevels() {
        const levels = [];
        const container = document.querySelector('.level-items');
        
        if (!container) {
            console.warn('⚠️ Grade levels container not found');
            return levels;
        }
        
        const levelElements = container.querySelectorAll('.level-item');
        
        levelElements.forEach((element, index) => {
            const nameInput = document.getElementById(`level${index}Name`);
            const ageInput = document.getElementById(`level${index}Age`);
            const descriptionInput = document.getElementById(`level${index}Description`);
            const imageUrlInput = document.getElementById(`level${index}-image-url`);
            
            // Collect features for this level
            const featuresContainer = document.getElementById(`level${index}-features-container`);
            const features = [];
            
            if (featuresContainer) {
                const featureInputs = featuresContainer.querySelectorAll('.feature-input');
                featureInputs.forEach(input => {
                    const featureText = input.value.trim();
                    if (featureText) {
                        features.push(featureText);
                    }
                });
            }
            
            if (nameInput) {
                const imageUrl = imageUrlInput ? imageUrlInput.value.trim() : '';
                
                levels.push({
                    name: nameInput.value.trim(),
                    title: nameInput.value.trim(),
                    age: ageInput ? ageInput.value.trim() : '',
                    ageRange: ageInput ? ageInput.value.trim() : '',
                    description: descriptionInput ? descriptionInput.value.trim() : '',
                    imageUrl: imageUrl, // ✅ Include imageUrl
                    features: features // ✅ Include features
                });
            }
        });
        
        return levels;
    }
    
    /**
     * Add a feature to a specific grade level
     */
    addFeatureToLevel(levelIndex) {
        
        const featureInput = document.getElementById(`level${levelIndex}-new-feature`);
        const featuresContainer = document.getElementById(`level${levelIndex}-features-container`);
        
        if (!featureInput || !featuresContainer) {
            console.warn('⚠️ Feature input or container not found');
            return;
        }
        
        const featureText = featureInput.value.trim();
        
        if (!featureText) {
            this.showNotification('Warning', 'Please enter a feature text', 'warning');
            return;
        }
        
        // Remove empty state if it exists
        const emptyState = featuresContainer.querySelector('.empty-state-small');
        if (emptyState) {
            emptyState.remove();
        }
        
        // Get current feature count for the index
        const currentFeatures = featuresContainer.querySelectorAll('.feature-item-editor');
        const featureIndex = currentFeatures.length;
        
        // Create new feature item
        const featureHTML = `
            <div class="feature-item-editor" data-feature-index="${featureIndex}">
                <input type="text" class="form-input feature-input" placeholder="Enter feature text" value="${featureText}" style="flex: 1; margin-right: 8px;">
                <button type="button" class="btn btn-sm btn-danger remove-feature-btn" data-feature-index="${featureIndex}">
                    <i data-lucide="x"></i>
                </button>
            </div>
        `;
        
        featuresContainer.insertAdjacentHTML('beforeend', featureHTML);
        
        // Clear input
        featureInput.value = '';
        
        // Reinitialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
    }

    /**
     * Add a new teaching method
     */
    addTeachingMethod() {
        
        const currentMethods = this.getCurrentTeachingMethods();
        
        currentMethods.push({
            title: '',
            description: ''
        });
        
        this.renderTeachingMethods(currentMethods);
        
    }

    /**
     * Remove a teaching method
     */
    removeTeachingMethod(index) {
        
        const currentMethods = this.getCurrentTeachingMethods();
        
        if (index >= 0 && index < currentMethods.length) {
            currentMethods.splice(index, 1);
            this.renderTeachingMethods(currentMethods);
        } else {
            console.warn(`⚠️ Invalid teaching method index: ${index}`);
        }
    }

    /**
     * Get current teaching methods from form inputs
     */
    getCurrentTeachingMethods() {
        const methods = [];
        const container = document.querySelector('.methods-items');
        
        if (!container) {
            console.warn('⚠️ Teaching methods container not found');
            return methods;
        }
        
        const methodElements = container.querySelectorAll('.curriculum-item');
        
        methodElements.forEach((element, index) => {
            const titleInput = document.getElementById(`method${index}Title`);
            const descriptionInput = document.getElementById(`method${index}Description`);
            
            if (titleInput) {
                methods.push({
                    title: titleInput.value.trim(),
                    description: descriptionInput ? descriptionInput.value.trim() : ''
                });
            }
        });
        
        return methods;
    }

    /**
     * Add a new activity
     */
    addActivity() {
        
        const currentActivities = this.getCurrentActivities();
        
        currentActivities.push({
            name: '',
            category: '',
            options: []
        });
        
        this.renderActivities(currentActivities);
        
    }

    /**
     * Remove an activity
     */
    removeActivity(index) {
        
        const currentActivities = this.getCurrentActivities();
        
        if (index >= 0 && index < currentActivities.length) {
            currentActivities.splice(index, 1);
            this.renderActivities(currentActivities);
        } else {
            console.warn(`⚠️ Invalid activity index: ${index}`);
        }
    }

    /**
     * Get current activities from form inputs
     */
    getCurrentActivities() {
        const activities = [];
        const container = document.querySelector('#beyondAcademicsActivities');
        
        if (!container) {
            console.warn('⚠️ Activities container not found');
            return activities;
        }
        
        const activityElements = container.querySelectorAll('.activity-item');
        
        activityElements.forEach((element, index) => {
            const nameInput = document.getElementById(`activity${index}Name`);
            const categoryInput = document.getElementById(`activity${index}Category`);
            
            // Get options for this activity
            const optionsList = element.querySelector('.activity-options-list');
            const options = [];
            
            if (optionsList) {
                const optionItems = optionsList.querySelectorAll('.activity-option-item .option-text');
                optionItems.forEach(optionEl => {
                    const optionText = optionEl.textContent.trim();
                    if (optionText) {
                        options.push(optionText);
                    }
                });
            }
            
            if (nameInput) {
                activities.push({
                    name: nameInput.value.trim(),
                    category: categoryInput ? categoryInput.value.trim() : '',
                    options: options
                });
            }
        });
        
        return activities;
    }

    /**
     * Render grade levels
     */
    renderGradeLevels(levels) {
        const container = document.querySelector('.level-items');
        if (!container) {
            return;
        }

        container.innerHTML = '';
        
        if (levels.length === 0) {
            container.innerHTML = '<div class="empty-state">No academic programs added yet. Click "Add Program" to create one.</div>';
            return;
        }
        
        levels.forEach((level, index) => {
            // Prepare features HTML
            const features = level.features || [];
            
            const featuresHTML = features.map((feature, fIndex) => `
                <div class="feature-item-editor" data-feature-index="${fIndex}">
                    <input type="text" class="form-input feature-input" placeholder="Enter feature text" value="${feature}" style="flex: 1; margin-right: 8px;">
                    <button type="button" class="btn btn-sm btn-danger remove-feature-btn" data-feature-index="${fIndex}">
                        <i data-lucide="x"></i>
                    </button>
                </div>
            `).join('');

            const levelHTML = `
                <div class="level-item" data-index="${index}" data-image-url="${level.imageUrl || ''}">
                    <div class="level-header">
                        <h5>Academic Program ${index + 1}</h5>
                        <button type="button" class="btn btn-sm btn-danger remove-level-btn" data-index="${index}">
                            <i data-lucide="trash-2"></i>
                            Remove
                        </button>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="level${index}Name">Program Name</label>
                            <input type="text" id="level${index}Name" name="level${index}Name" class="form-input" placeholder="Pre-Primary (Nursery - UKG)" value="${level.name || level.title || ''}">
                        </div>
                        <div class="form-group">
                            <label for="level${index}Age">Age Range</label>
                            <input type="text" id="level${index}Age" name="level${index}Age" class="form-input" placeholder="3-5 years" value="${level.age || level.ageRange || ''}">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="level${index}Description">Program Description</label>
                        <textarea id="level${index}Description" name="level${index}Description" class="form-textarea" rows="3" placeholder="Enter program description">${level.description || ''}</textarea>
                    </div>
                    <div class="form-group">
                        <label>Program Image</label>
                        <div id="level${index}-image-upload-container"></div>
                        <input type="hidden" id="level${index}-image-url" name="level${index}ImageUrl" value="${level.imageUrl || ''}">
                        </div>
                    <div class="form-group">
                        <label for="level${index}Features">Program Features</label>
                        <div class="features-container" id="level${index}-features-container">
                            ${featuresHTML || '<div class="empty-state-small">No features added yet</div>'}
                        </div>
                        <div class="add-feature-container" style="display: flex; gap: 8px; margin-top: 8px;">
                            <input type="text" id="level${index}-new-feature" class="form-input" placeholder="Add new feature..." style="flex: 1;">
                            <button type="button" class="btn btn-secondary add-feature-btn" data-level-index="${index}">
                                <i data-lucide="plus"></i>
                                Add Feature
                            </button>
                        </div>
                        <small class="form-help-text">Features highlight key aspects of this academic program</small>
                    </div>
                </div>
            `;
            container.innerHTML += levelHTML;
        });
        
        // Wait for DOM to be ready, then initialize ImageUpload components
        setTimeout(() => {
            levels.forEach((level, index) => {
                const imageContainer = document.querySelector(`#level${index}-image-upload-container`);
                if (imageContainer) {
                    
                    const imageUploadHTML = window.ImageUpload.createHTML({
                        fileInputId: `level${index}-image-file`,
                        urlInputId: `level${index}-image-url`,
                        previewImgId: `level${index}-image-preview`,
                        previewContainerId: `level${index}-preview-container`, // ✅ Unique ID
                        removeBtnId: `level${index}-remove-btn`, // ✅ Unique ID
                        selectBtnId: `level${index}-select-image-btn`,
                        existingImageUrl: level.imageUrl || ''
                    });
                    imageContainer.innerHTML = imageUploadHTML;
                    
                    // Initialize ImageUpload instance with setTimeout to ensure DOM is ready
                    setTimeout(() => {
                        const imageUpload = new ImageUpload({
                            fileInputId: `level${index}-image-file`,
                            urlInputId: `level${index}-image-url`,
                            previewImgId: `level${index}-image-preview`,
                            previewContainerId: `level${index}-preview-container`, // ✅ Unique ID
                            removeBtnId: `level${index}-remove-btn`, // ✅ Unique ID
                            selectBtnId: `level${index}-select-image-btn`,
                            uploadFolder: 'marigold-school/academics/programs',
                            autoUpload: false
                        });
                        imageUpload.init();
                    }, 50);
                }
            });
        }, 100);

        // Reinitialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    /**
     * Render activities
     */
    renderActivities(activities) {
        const container = document.querySelector('#beyondAcademicsActivities');
        if (!container) {
            return;
        }
        
        if (activities.length === 0) {
            container.innerHTML = '<div class="empty-state">No activities added yet. Click "Add Activity" to create one.</div>';
            return;
        }
        
        container.innerHTML = '';
        
        activities.forEach((activity, index) => {
            const activityHTML = `
                <div class="activity-item structured-section" data-index="${index}">
                    <div class="activity-header structured-section-header">
                        <div class="activity-icon">
                            <i data-lucide="activity"></i>
                    </div>
                        <div class="activity-title">
                            <h5 class="structured-section-title">Activity ${index + 1}</h5>
                            <span class="activity-category-badge">${activity.category || 'General'}</span>
                        </div>
                        <button type="button" class="btn btn-sm btn-danger remove-activity-btn" data-index="${index}">
                            <i data-lucide="trash-2"></i>
                            Remove
                        </button>
                        </div>
                    <div class="activity-content structured-section">
                        <div class="structured-form-group">
                            <label for="activity${index}Name" class="structured-form-label">Activity Name</label>
                            <input type="text" id="activity${index}Name" name="activity${index}Name" class="structured-form-input" placeholder="Sports" value="${activity.name || ''}">
                    </div>
                        <div class="structured-form-group">
                            <label for="activity${index}Category" class="structured-form-label">Category</label>
                            <input type="text" id="activity${index}Category" name="activity${index}Category" class="structured-form-input" placeholder="Physical" value="${activity.category || ''}">
                        </div>
                        <div class="structured-form-group">
                            <label for="activity${index}Options" class="structured-form-label">Activity Options</label>
                            <div class="activity-options-list" id="activity${index}OptionsList">
                                ${this.renderActivityOptions(activity.options || [])}
                            </div>
                            <div class="add-option-container">
                                <input type="text" id="activity${index}NewOption" class="structured-form-input" placeholder="Add new option..." style="margin-right: 8px; flex: 1;">
                                <button type="button" class="structured-button structured-button-secondary add-option-btn" data-activity-index="${index}">
                                    <i data-lucide="plus"></i> Add Option
                                </button>
                            </div>
                            <small class="form-help-text">Click the + button to add new activity options</small>
                        </div>
                    </div>
                </div>
            `;
            container.innerHTML += activityHTML;
        });

        // Reinitialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    /**
     * Render activity options as a list
     */
    renderActivityOptions(options) {
        if (!Array.isArray(options) || options.length === 0) {
            return '<div class="no-options">No options added yet</div>';
        }

        return options.map((option, optionIndex) => `
            <div class="activity-option-item" data-option-index="${optionIndex}">
                <span class="option-text">${option}</span>
                <button type="button" class="remove-option-btn" data-option-index="${optionIndex}">
                    <i data-lucide="x"></i>
                </button>
            </div>
        `).join('');
    }

    /**
     * Add a new activity option
     */
    addActivityOption(activityIndex) {
        const input = document.getElementById(`activity${activityIndex}NewOption`);
        const optionText = input.value.trim();
        
        if (!optionText) {
            this.showNotification('Warning', 'Please enter an option text', 'warning');
            return;
        }

        const optionsList = document.getElementById(`activity${activityIndex}OptionsList`);
        if (!optionsList) return;

        // Remove "no options" message if present
        const noOptions = optionsList.querySelector('.no-options');
        if (noOptions) {
            noOptions.remove();
        }

        // Add new option
        const optionHTML = `
            <div class="activity-option-item" data-option-index="${optionsList.children.length}">
                <span class="option-text">${optionText}</span>
                <button type="button" class="remove-option-btn" data-option-index="${optionsList.children.length}">
                    <i data-lucide="x"></i>
                </button>
            </div>
        `;
        optionsList.insertAdjacentHTML('beforeend', optionHTML);

        // Clear input
        input.value = '';

        // Reinitialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    /**
     * Remove an activity option
     */
    removeActivityOption(activityIndex, optionIndex) {
        const optionsList = document.getElementById(`activity${activityIndex}OptionsList`);
        if (!optionsList) return;

        const optionItem = optionsList.querySelector(`[data-option-index="${optionIndex}"]`);
        if (optionItem) {
            optionItem.remove();
        }

        // If no options left, show "no options" message
        if (optionsList.children.length === 0) {
            optionsList.innerHTML = '<div class="no-options">No options added yet</div>';
        }
    }

    /**
     * Render curriculum items
     */
    renderCurriculum(items) {
        const container = document.querySelector('.curriculum-items');
        if (!container) return;

        container.innerHTML = '';
        
        if (items.length === 0) {
            container.innerHTML = '<div class="empty-state">No curriculum subjects added yet. Click "Add Subject" to create one.</div>';
            return;
        }
        
        items.forEach((item, index) => {
            // Use subject field from API response, fallback to title
            const subjectTitle = item.subject || item.title || `Subject ${index + 1}`;
            const itemHTML = `
                <div class="curriculum-item structured-section" data-index="${index}">
                    <div class="curriculum-header structured-section-header">
                        <h5 class="structured-section-title">${subjectTitle}</h5>
                        <button type="button" class="btn btn-sm btn-danger remove-curriculum-btn" data-index="${index}">
                            <i data-lucide="trash-2"></i>
                            Remove
                        </button>
                        </div>
                    <div class="curriculum-content">
                        <div class="structured-form-group">
                            <label for="curriculum${index}Title" class="structured-form-label">Subject Title</label>
                            <input type="text" id="curriculum${index}Title" name="curriculum${index}Title" class="structured-form-input" placeholder="Mathematics" value="${subjectTitle}">
                        </div>
                        <div class="structured-form-group">
                            <label for="curriculum${index}Description" class="structured-form-label">Description</label>
                            <textarea id="curriculum${index}Description" name="curriculum${index}Description" class="structured-form-textarea" rows="3" placeholder="Enter curriculum description">${item.description || ''}</textarea>
                        </div>
                    </div>
                </div>
            `;
            container.innerHTML += itemHTML;
        });

        // Reinitialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    /**
     * Render teaching methods
     */
    renderTeachingMethods(methods) {
        const container = document.querySelector('.methods-items');
        if (!container) {
            console.warn('⚠️ Teaching methods container not found');
            return;
        }
        
        container.innerHTML = '';
        
        if (methods.length === 0) {
            container.innerHTML = '<div class="empty-state">No teaching methods added yet. Click "Add Method" to create one.</div>';
            return;
        }
        
        methods.forEach((method, index) => {
            const methodHTML = `
                <div class="curriculum-item structured-section" data-index="${index}">
                    <div class="curriculum-header structured-section-header">
                        <h5 class="structured-section-title">${method.title || 'Teaching Method'}</h5>
                        <button type="button" class="btn btn-sm btn-danger remove-method-btn" data-index="${index}">
                            <i data-lucide="trash-2"></i>
                            Remove
                        </button>
                        </div>
                    <div class="curriculum-content">
                        <div class="structured-form-group">
                            <label for="method${index}Title" class="structured-form-label">Method Title</label>
                            <input type="text" id="method${index}Title" name="method${index}Title" class="structured-form-input" placeholder="Teaching Method" value="${method.title || ''}">
                        </div>
                        <div class="structured-form-group">
                            <label for="method${index}Description" class="structured-form-label">Description</label>
                            <textarea id="method${index}Description" name="method${index}Description" class="structured-form-textarea" rows="3" placeholder="Enter method description">${method.description || ''}</textarea>
                        </div>
                    </div>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', methodHTML);
        });

        // Reinitialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    /**
     * Render achievements
     */
    renderAchievements(achievements) {
        const container = document.querySelector('#achievementsContainer');
        if (!container) return;

        container.innerHTML = '';
        
        // Ensure we always show at least 4 cards
        const minCards = 4;
        const achievementsToRender = [...achievements];
        
        // Add empty placeholders if fewer than 4 achievements
        while (achievementsToRender.length < minCards) {
            achievementsToRender.push({
                icon: '',
                number: '',
                label: ''
            });
        }
        
        achievementsToRender.forEach((achievement, index) => {
            const achievementHTML = `
                <div class="achievement-card structured-section" data-index="${index}">
                    <div class="achievement-header structured-section-header">
                        <div class="achievement-icon">
                            <i data-lucide="${achievement.icon || 'trophy'}"></i>
                    </div>
                        <div class="achievement-title">
                            <h5 class="structured-section-title">Achievement ${index + 1}</h5>
                        </div>
                        </div>
                    <div class="achievement-content structured-section">
                        <div class="structured-form-group">
                            <label for="achievement${index}Icon" class="structured-form-label">Icon</label>
                            <input type="text" id="achievement${index}Icon" name="achievement${index}Icon" class="structured-form-input" placeholder="trophy" value="${achievement.icon || ''}">
                    </div>
                        <div class="structured-form-group">
                            <label for="achievement${index}Number" class="structured-form-label">Number/Percentage</label>
                            <input type="text" id="achievement${index}Number" name="achievement${index}Number" class="structured-form-input" placeholder="95%" value="${achievement.number || ''}">
                        </div>
                        <div class="structured-form-group">
                            <label for="achievement${index}Label" class="structured-form-label">Achievement Label</label>
                            <input type="text" id="achievement${index}Label" name="achievement${index}Label" class="structured-form-input" placeholder="Students Score Distinction in SEE" value="${achievement.label || ''}">
                        </div>
                    </div>
                </div>
            `;
            container.innerHTML += achievementHTML;
        });

        // Reinitialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
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
        
        // Add active class to academics content link
        const academicsContentLink = document.querySelector('[data-section="academics-content"]');
        if (academicsContentLink) {
            academicsContentLink.classList.add('active');
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
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.academicsContentLoader = new AcademicsContentLoader();
});
