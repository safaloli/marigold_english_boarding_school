/**
 * Contact Content Loader
 * Handles dynamic loading and management of the contact content section
 */
class ContactContentLoader {
    constructor() {
        this.currentSubsection = null;
        this.sections = {
            'contact-info': { name: 'Contact Information', icon: '📞', enabled: true },
            'location': { name: 'Location Section', icon: '📍', enabled: true },
            'social-media': { name: 'Social Media', icon: '📱', enabled: true },
            'cta': { name: 'Call to Action', icon: '🎯', enabled: true },
            'faq': { name: 'FAQ Section', icon: '❓', enabled: true }
        };
        this.deletedFAQs = []; // Track deleted FAQs for database cleanup
        this.init();
    }

    init() {
        this.bindEvents();
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Contact content section click
        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-section="contact-content"]')) {
                e.preventDefault();
                this.loadContactContent();
            }
        });

        // Section menu item clicks will be set up in loadContactContent

        // Breadcrumb back button - handle data-action attribute
        document.addEventListener('click', (e) => {
            const backButton = e.target.closest('.back-button');
            if (backButton) {
                const action = backButton.getAttribute('data-action');
                if (action === 'back-to-section-list' && this.isContactContentContext(backButton)) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    this.showSectionList();
                    return;
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
            console.warn(`Save button not found for section: ${section}`);
            return null;
        }

        // Contact page typically doesn't have images, so set hasImages to false
        const hasImages = false;

        const saveButton = new SaveButton({
            target: saveButtonElement,
            dataSection: section,
            hasImages: hasImages,
            messages: {
                preparing: 'Preparing...',
                collecting: 'Collecting data...',
                saving: 'Saving to database...',
                success: 'Section saved successfully!'
            },
            percentages: {
                collecting: 25,
                saving: 50,
                success: 100
            },
            onSave: async (button) => {
                
                const token = localStorage.getItem('adminToken');
                if (!token) {
                    throw new Error('Authentication required');
                }

                button.setProgress('Collecting data...', 25);
                
                // Collect section data
                const sectionData = this.collectSectionData(section);
                
                if (!sectionData) {
                    throw new Error('Unable to save - please check your input');
                }

                button.setProgress('Saving to database...', 50);
                
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 15000);
                
                const response = await fetch('/api/content/contact/bulk', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ content: sectionData }),
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
                
                // Navigate back to contact section list after successful save
                setTimeout(() => {
                    this.showSectionList();
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
     * Load contact content section dynamically
     */
    async loadContactContent() {
        try {
            // Get contact content
            const content = this.getContactContent();
            
            // Inject content into page-content
            this.injectContent(content);
            
            // Initialize contact content functionality
            this.initializeContactContent();
            
            // Update navigation
            this.updateNavigation();
            
        } catch (error) {
            console.error('Error loading contact content section:', error);
            this.showError('Failed to load contact content section');
        }
    }

    /**
     * Get contact content HTML
     */
    getContactContent() {
        return `
            <section id="contact-content-section" class="content-section active">
                <div class="page-header">
                    <div class="page-title">
                        <h1>Contact Page Content Management</h1>
                        <p>Manage and organize your contact page sections with our intuitive editor.</p>
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
     * Check if we're in contact content context
     */
    isContactContentContext(backButton) {
        // First check if we're in the contact content section
        if (this.currentSection !== 'contact-content') {
            return false;
        }
        
        // Check if the back button is within a contact content context
        if (backButton && backButton.closest('#contact-content-section, .contact-content-editor, .section-editor')) {
            return true;
        }
        
        // Fallback: check if current content is contact content-related
        const pageContent = document.getElementById('page-content');
        if (!pageContent) return false;
        
        return pageContent.innerHTML.includes('contact-content-section') || 
               pageContent.querySelector('#contact-content-section, .contact-content-editor, .section-editor') !== null;
    }

    /**
     * Show section list (main contact overview)
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
        // Only handle contact content sections
        const contactSections = ['contact-info', 'location', 'faq', 'social-media', 'cta'];
        if (!contactSections.includes(section)) {
            return;
        }

        // Check if we're in contact content section
        const pageContent = document.getElementById('pageContent');
        if (!pageContent || !pageContent.innerHTML.includes('contact-content-section')) {
            return;
        }

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
            
            // Load section data
            this.loadSectionData(section);
            
            // Initialize SaveButton component for this section
            this.initializeSaveButton(section);
            
            // Reinitialize Lucide icons after content injection
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        } else {
            console.error('Section list or editor not found!');
        }
    }

    /**
     * Show toggle confirmation popup
     */
    showToggleConfirmation(section, sectionName, isEnabling, toggleElement) {
        const action = isEnabling ? 'enable' : 'disable';
        const actionColor = isEnabling ? '#10b981' : '#ef4444';
        const actionIcon = isEnabling ? '✓' : '⚠';
        
        // Create custom modal
        const modal = document.createElement('div');
        modal.className = 'custom-modal-overlay';
        modal.innerHTML = `
            <div class="custom-modal">
                <div class="custom-modal-header">
                    <div class="custom-modal-icon" style="background-color: ${actionColor}20; color: ${actionColor}">
                        ${actionIcon}
                    </div>
                    <h3>Confirm Section ${action.charAt(0).toUpperCase() + action.slice(1)}</h3>
                </div>
                <div class="custom-modal-body">
                    <p>Are you sure you want to <strong>${action}</strong> the <strong>"${sectionName}"</strong> section?</p>
                    <p class="custom-modal-subtitle">This action will ${isEnabling ? 'show' : 'hide'} this section on the website.</p>
                </div>
                <div class="custom-modal-footer">
                    <button class="btn btn-outline custom-modal-cancel">Cancel</button>
                    <button class="btn btn-primary custom-modal-confirm" style="background-color: ${actionColor}; border-color: ${actionColor}">
                        ${isEnabling ? 'Enable' : 'Disable'} Section
                    </button>
                </div>
            </div>
        `;
        
        // Add to page
        document.body.appendChild(modal);
        
        // Add event listeners
        const confirmBtn = modal.querySelector('.custom-modal-confirm');
        const cancelBtn = modal.querySelector('.custom-modal-cancel');
        
        const handleConfirm = () => {
            this.toggleSection(section, isEnabling);
            toggleElement.checked = isEnabling;
            this.closeCustomModal(modal);
        };
        
        const handleCancel = () => {
            toggleElement.checked = !isEnabling;
            this.closeCustomModal(modal);
        };
        
        confirmBtn.addEventListener('click', handleConfirm);
        cancelBtn.addEventListener('click', handleCancel);
        
        // Close on overlay click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                handleCancel();
            }
        });
        
        // Close on Escape key
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                handleCancel();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);
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
     * Navigate back to contact main page
     */
    navigateBackToContactMain() {
        try {
            // Navigate back to main Contact Page Content Management page
            window.location.hash = '#contact';
            
            // Reload the contact content to show the main management page
            setTimeout(() => {
                this.loadContactContent();
            }, 100);
        } catch (error) {
            console.error('Error navigating back:', error);
        }
    }

    /**
     * Toggle section visibility
     */
    async toggleSection(section, enabled) {
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                this.showNotification('error', 'Authentication required');
                return;
            }

            const response = await fetch(`/api/content/contact/toggle/${section}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ enabled })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to toggle section');
            }

            const result = await response.json();
            
            // Update local state
            this.sections[section].enabled = enabled;
            
            // Show success notification
            this.showNotification('success', result.message);
            
        } catch (error) {
            console.error('Error toggling section:', error);
            this.showNotification('error', `Failed to ${enabled ? 'enable' : 'disable'} section: ${error.message}`);
            
        }
    }


    /**
     * Get section editor HTML for specific section
     */
    getSectionEditor(section) {
        const breadcrumb = this.getBreadcrumbHTML(section);
        let editorContent = '';
        
        switch(section) {
            case 'contact-info':
                editorContent = this.getContactInfoEditor();
                break;
            case 'location':
                editorContent = this.getLocationEditor();
                break;
            case 'social-media':
                editorContent = this.getSocialMediaEditor();
                break;
            case 'cta':
                editorContent = this.getCtaEditor();
                break;
            case 'faq':
                editorContent = this.getFaqEditor();
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
                    <span>Contact Page</span>
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
     * Load section data (placeholder)
     */
    async loadSectionData(section) {
        try {
            // Load data with a small delay to ensure form is rendered
            setTimeout(async () => {
                if (this.contactData) {
                    this.populateSectionForm(section, this.contactData);
                } else {
                    // If contactData is not loaded yet, fetch it
                    // Add cache-busting to always get fresh data
                    const cacheBuster = `?t=${Date.now()}`;
                    const response = await fetch(`/api/content/contact${cacheBuster}`, {
                        headers: {
                            'Cache-Control': 'no-cache',
                            'Pragma': 'no-cache'
                        }
                    });
                    const data = await response.json();
                    
                    if (data.success && data.content) {
                        this.contactData = data.content;
                        this.populateSectionForm(section, data.content);
                    }
                }
            }, 100);
        } catch (error) {
            console.error('Error loading section data:', error);
        }
    }

    /**
     * Populate section form with data
     */
    populateSectionForm(section, content) {
        // Only handle contact content sections
        const contactSections = ['contact-info', 'location', 'faq', 'social-media', 'cta'];
        if (!contactSections.includes(section)) {
            return;
        }

        const form = document.querySelector('#sectionEditor form');
        if (!form) {
            return;
        }


        switch(section) {
            case 'contact-info':
                this.populateContactInfoForm(form, content);
                break;
            case 'location':
                this.populateLocationForm(form, content);
                break;
            case 'faq':
                this.populateFAQForm(form, content);
                break;
            case 'social-media':
                this.populateSocialMediaForm(form, content);
                break;
            case 'cta':
                this.populateCTAForm(form, content);
                break;
            default:
        }
    }

    /**
     * Populate Contact Info form
     */
    populateContactInfoForm(form, content) {
        const contactMain = content.contactMain;
        if (contactMain) {
            this.setFormField(form, 'contactTitle', contactMain.title);
            this.setFormField(form, 'contactDescription', contactMain.description);
            
            if (contactMain.contactInfo) {
                this.setFormField(form, 'contactEmail', contactMain.contactInfo.email);
                this.setFormField(form, 'contactPhone', contactMain.contactInfo.phone);
                this.setFormField(form, 'contactAddress', contactMain.contactInfo.address);
                this.setFormField(form, 'contactHours', contactMain.contactInfo.hours);
            }
        }
    }

    /**
     * Populate Location form
     */
    populateLocationForm(form, content) {
        const locationSection = content.locationSection;
        
        if (locationSection) {
            this.setFormField(form, 'locationTitle', locationSection.title);
            this.setFormField(form, 'locationSubtitle', locationSection.subtitle);
            this.setFormField(form, 'locationDescription', locationSection.description);
            
            // Populate headquarters information
            if (locationSection.headquarters) {
                this.setFormField(form, 'organizationName', locationSection.headquarters.organizationName);
                this.setFormField(form, 'city', locationSection.headquarters.city);
                this.setFormField(form, 'streetAddress', locationSection.headquarters.streetAddress);
                this.setFormField(form, 'postalCode', locationSection.headquarters.postalCode);
                this.setFormField(form, 'country', locationSection.headquarters.country);
            } else {
            }
            
            // Populate maps information
            if (locationSection.maps) {
                this.setFormField(form, 'mapEmbedUrl', locationSection.maps.embedUrl);
                this.setFormField(form, 'mapDirectUrl', locationSection.maps.directUrl);
            } else {
            }
        } else {
        }
    }

    /**
     * Populate FAQ form
     */
    populateFAQForm(form, content) {
        const faqSection = content.faqSection;
        
        if (faqSection) {
            // Clean the title and subtitle
            const cleanTitle = (faqSection.title || '').replace(/[^\w\s\?\.\!]/g, '').trim();
            const cleanSubtitle = (faqSection.subtitle || '').replace(/[^\w\s\?\.\!]/g, '').trim();
            
            this.setFormField(form, 'faqTitle', cleanTitle);
            this.setFormField(form, 'faqSubtitle', cleanSubtitle);
            
            // Clean FAQ items before rendering
            const cleanFaqs = (faqSection.faqs || []).map(faq => ({
                question: (faq.question || '').replace(/[^\w\s\?\.\!]/g, '').trim(),
                answer: (faq.answer || '').replace(/[^\w\s\?\.\!]/g, '').trim()
            })).filter(faq => faq.question || faq.answer);
            
            // Render FAQ items in the container
            this.renderFAQItems(cleanFaqs);
            
            // Attach Add FAQ button event listener
            this.attachAddFAQButtonListener();
            
            // Initialize FAQ event delegation (after container exists)
            this.initializeFAQEventDelegation();
        }
    }

    /**
     * Render FAQ items in the container
     */
    renderFAQItems(faqs) {
        const faqContainer = document.querySelector('#faqItems');
        const emptyState = document.querySelector('#faqEmptyState');
        
        if (!faqContainer) {
            return;
        }

        // Clear container completely to prevent duplicates
        faqContainer.innerHTML = '';
        
        if (faqs.length === 0) {
            faqContainer.style.display = 'none';
            if (emptyState) emptyState.style.display = 'block';
            return;
        }

        faqContainer.style.display = 'block';
        if (emptyState) emptyState.style.display = 'none';
        
        faqs.forEach((faq, index) => {
            const faqItem = document.createElement('div');
            faqItem.className = 'faq-item-card';
            faqItem.innerHTML = `
                <div class="faq-item-header">
                    <div class="faq-item-number">
                        <span class="faq-number">${index + 1}</span>
                    </div>
                    <div class="faq-item-actions">
                        <button type="button" class="btn btn-sm btn-outline-secondary move-up" data-index="${index}" title="Move up">
                            <i data-lucide="chevron-up"></i>
                        </button>
                        <button type="button" class="btn btn-sm btn-outline-secondary move-down" data-index="${index}" title="Move down">
                            <i data-lucide="chevron-down"></i>
                        </button>
                        <button type="button" class="btn btn-sm btn-danger remove-faq" data-index="${index}" title="Remove FAQ">
                            <i data-lucide="trash-2"></i>
                        </button>
                    </div>
                </div>
                <div class="faq-item-content">
                    <div class="form-group">
                        <label for="faq${index + 1}Question" class="form-label">
                            <i data-lucide="help-circle" class="label-icon"></i>
                            Question
                        </label>
                        <input type="text" id="faq${index + 1}Question" name="faq${index + 1}Question" class="form-input" placeholder="Enter your question here..." value="${(faq.question || '').replace(/"/g, '&quot;')}">
                    </div>
                    <div class="form-group">
                        <label for="faq${index + 1}Answer" class="form-label">
                            <i data-lucide="message-square" class="label-icon"></i>
                            Answer
                        </label>
                        <textarea id="faq${index + 1}Answer" name="faq${index + 1}Answer" class="form-textarea" rows="4" placeholder="Enter the answer here...">${(faq.answer || '').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</textarea>
                    </div>
                </div>
            `;
            faqContainer.appendChild(faqItem);
        });

        // Reinitialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        // Event listeners are handled by delegation in initializeFAQEventDelegation
    }

    /**
     * Initialize FAQ event delegation (one-time setup)
     */
    initializeFAQEventDelegation() {
        const faqContainer = document.querySelector('#faqItems');
        if (!faqContainer) return;

        // Check if event delegation is already set up to prevent duplicates
        if (faqContainer.hasAttribute('data-event-delegation-setup')) {
            return;
        }

        // Mark that event delegation is set up
        faqContainer.setAttribute('data-event-delegation-setup', 'true');

        // Use event delegation to handle all FAQ button clicks
        faqContainer.addEventListener('click', (e) => {
                e.preventDefault();
            
            // Handle remove FAQ buttons
            if (e.target.closest('.remove-faq')) {
                const btn = e.target.closest('.remove-faq');
                const index = parseInt(btn.dataset.index);
                this.confirmRemoveFAQ(index);
                return;
            }
            
            // Handle move up buttons
            if (e.target.closest('.move-up')) {
                const btn = e.target.closest('.move-up');
                const index = parseInt(btn.dataset.index);
                this.moveFAQUp(index);
                return;
            }
            
            // Handle move down buttons
            if (e.target.closest('.move-down')) {
                const btn = e.target.closest('.move-down');
                const index = parseInt(btn.dataset.index);
                this.moveFAQDown(index);
                return;
            }
        });

        // Add FAQ button event listener will be attached when FAQ form is populated
    }

    /**
     * Attach Add FAQ button event listener
     */
    attachAddFAQButtonListener() {
        const addFAQBtn = document.getElementById('addFAQ');
        if (addFAQBtn) {
            // Remove any existing event listeners to prevent duplicates
            addFAQBtn.onclick = null;
            
            // Add new event listener
            addFAQBtn.onclick = (e) => {
                e.preventDefault();
                this.addFAQItem();
            };
        }
    }

    /**
     * Confirm removal of FAQ item
     */
    confirmRemoveFAQ(index) {
        if (confirm('Are you sure you want to remove this FAQ item? This action cannot be undone.')) {
            this.removeFAQItem(index);
        }
    }

    /**
     * Remove FAQ item
     */
    removeFAQItem(index) {
        try {
        const faqContainer = document.querySelector('#faqItems');
            if (!faqContainer) {
                console.error('❌ FAQ container not found during deletion');
                return;
            }
            
        const faqItems = faqContainer.querySelectorAll('.faq-item-card');
            
        if (faqItems[index]) {
                const faqItem = faqItems[index];
                
                // Store the FAQ details before removing from UI
                const questionInput = faqItem.querySelector('input[type="text"]');
                const answerTextarea = faqItem.querySelector('textarea');
                
                if (questionInput && answerTextarea) {
                    const question = questionInput.value || '';
                    const answer = answerTextarea.value || '';
                    
                    // Store deleted FAQ details for database cleanup
                    this.deletedFAQs.push({
                        question: question.trim(),
                        answer: answer.trim(),
                        deletedAt: new Date().toISOString()
                    });
                }
                
                // Remove from UI
                faqItem.remove();
                
            // Re-render to update numbering and empty state
            this.refreshFAQDisplay();
            } else {
                console.error(`❌ FAQ item at index ${index} not found`);
            }
        } catch (error) {
            console.error('❌ Error removing FAQ item:', error);
        }
    }

    /**
     * Move FAQ item up
     */
    moveFAQUp(index) {
        const faqContainer = document.querySelector('#faqItems');
        const faqItems = faqContainer.querySelectorAll('.faq-item-card');
        if (index > 0 && faqItems[index] && faqItems[index - 1]) {
            const movingItem = faqItems[index];
            const targetItem = faqItems[index - 1];
            
            // Store the moving item's data to track it after DOM change
            const movingItemData = movingItem.dataset;
            const movingItemContent = {
                question: movingItem.querySelector('input').value,
                answer: movingItem.querySelector('textarea').value
            };
            
            // Move the item in the DOM first
            movingItem.parentNode.insertBefore(movingItem, targetItem);
            
            // Now animate to show the movement
            this.animateMove(movingItem, targetItem, 'up', () => {
                // Find the moved item by its content and focus on it
                this.focusOnMovedItem(movingItemContent);
            });
            
            // Update numbering after animation
            setTimeout(() => {
                this.updateFAQNumbering();
            }, 400);
        }
    }

    /**
     * Move FAQ item down
     */
    moveFAQDown(index) {
        const faqContainer = document.querySelector('#faqItems');
        const faqItems = faqContainer.querySelectorAll('.faq-item-card');
        if (index < faqItems.length - 1 && faqItems[index] && faqItems[index + 1]) {
            const movingItem = faqItems[index];
            const targetItem = faqItems[index + 1];
            
            // Store the moving item's data to track it after DOM change
            const movingItemData = movingItem.dataset;
            const movingItemContent = {
                question: movingItem.querySelector('input').value,
                answer: movingItem.querySelector('textarea').value
            };
            
            // Move the item in the DOM first
            targetItem.parentNode.insertBefore(movingItem, targetItem.nextSibling);
            
            // Now animate to show the movement
            this.animateMove(movingItem, targetItem, 'down', () => {
                // Find the moved item by its content and focus on it
                this.focusOnMovedItem(movingItemContent);
            });
            
            // Update numbering after animation
            setTimeout(() => {
                this.updateFAQNumbering();
            }, 400);
        }
    }

    /**
     * Simple animation focusing on the clicked card
     */
    animateMove(movingItem, targetItem, direction, callback) {
        // Calculate the height of one FAQ item (including margin)
        const itemHeight = movingItem.offsetHeight + 16; // 16px margin between items
        
        // Add simple animation class to the moving item
        movingItem.classList.add('faq-simple-moving');
        
        // Calculate the distance to travel (just one position)
        const slideDistance = direction === 'up' ? -itemHeight : itemHeight;
        
        // Apply simple sliding animation
        movingItem.style.transition = 'transform 0.3s ease-out';
        movingItem.style.transform = `translateY(${slideDistance}px)`;
        
        // Clean up after animation and add focus effect
        setTimeout(() => {
            // Reset transforms and styles
            movingItem.style.transition = '';
            movingItem.style.transform = '';
            movingItem.classList.remove('faq-simple-moving');
            
            // Execute callback to focus on the moved item
            if (callback && typeof callback === 'function') {
                callback();
            }
        }, 300);
    }

    /**
     * Focus on the moved item after animation
     */
    focusOnMovedItem(movingItemContent) {
        const faqContainer = document.querySelector('#faqItems');
        const allItems = faqContainer.querySelectorAll('.faq-item-card');
        
        // Find the item by its content
        let movedItem = null;
        allItems.forEach(item => {
            const questionInput = item.querySelector('input');
            const answerTextarea = item.querySelector('textarea');
            if (questionInput && answerTextarea && 
                questionInput.value === movingItemContent.question && 
                answerTextarea.value === movingItemContent.answer) {
                movedItem = item;
            }
        });
        
        if (movedItem) {
            // Add focus highlight to show the card moved
            movedItem.classList.add('faq-moved-focus');
            
            // Scroll the item into view
            movedItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Remove focus after a short time
            setTimeout(() => {
                movedItem.classList.remove('faq-moved-focus');
            }, 1500);
        }
    }

    /**
     * Update FAQ numbering without re-rendering
     */
    updateFAQNumbering() {
        const faqContainer = document.querySelector('#faqItems');
        const faqItems = faqContainer.querySelectorAll('.faq-item-card');
        
        // Update numbering and button states
        faqItems.forEach((item, index) => {
            const numberSpan = item.querySelector('.faq-number');
            if (numberSpan) {
                numberSpan.textContent = index + 1;
            }
            
            // Update data indices for buttons
            const buttons = item.querySelectorAll('[data-index]');
            buttons.forEach(btn => {
                btn.dataset.index = index;
            });

            // Enable/disable move buttons based on position
            const moveUpBtn = item.querySelector('.move-up');
            const moveDownBtn = item.querySelector('.move-down');
            
            if (moveUpBtn) {
                moveUpBtn.disabled = index === 0;
            }
            if (moveDownBtn) {
                moveDownBtn.disabled = index === faqItems.length - 1;
            }
        });
    }

    /**
     * Refresh FAQ display after changes
     */
    refreshFAQDisplay() {
        const faqContainer = document.querySelector('#faqItems');
        const faqItems = faqContainer.querySelectorAll('.faq-item-card');
        const emptyState = document.querySelector('#faqEmptyState');
        
        if (faqItems.length === 0) {
            faqContainer.style.display = 'none';
            if (emptyState) emptyState.style.display = 'block';
            return;
        }

        faqContainer.style.display = 'block';
        if (emptyState) emptyState.style.display = 'none';

        // Update numbering and button states
        faqItems.forEach((item, index) => {
            const numberSpan = item.querySelector('.faq-number');
            if (numberSpan) {
                numberSpan.textContent = index + 1;
            }
            
            // Update data indices for buttons
            const buttons = item.querySelectorAll('[data-index]');
            buttons.forEach(btn => {
                btn.dataset.index = index;
            });

            // Enable/disable move buttons based on position
            const moveUpBtn = item.querySelector('.move-up');
            const moveDownBtn = item.querySelector('.move-down');
            
            if (moveUpBtn) {
                moveUpBtn.disabled = index === 0;
            }
            if (moveDownBtn) {
                moveDownBtn.disabled = index === faqItems.length - 1;
            }
        });

        // Reinitialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    /**
     * Add new FAQ item
     */
    addFAQItem() {
        const faqContainer = document.querySelector('#faqItems');
        const emptyState = document.querySelector('#faqEmptyState');
        
        if (!faqContainer) return;

        const currentCount = faqContainer.querySelectorAll('.faq-item-card').length;
        const newIndex = currentCount + 1;

        const faqItem = document.createElement('div');
        faqItem.className = 'faq-item-card';
        faqItem.innerHTML = `
            <div class="faq-item-header">
                <div class="faq-item-number">
                    <span class="faq-number">${newIndex}</span>
                </div>
                <div class="faq-item-actions">
                    <button type="button" class="btn btn-sm btn-outline-secondary move-up" data-index="${currentCount}" title="Move up">
                        <i data-lucide="chevron-up"></i>
                    </button>
                    <button type="button" class="btn btn-sm btn-outline-secondary move-down" data-index="${currentCount}" title="Move down">
                        <i data-lucide="chevron-down"></i>
                    </button>
                    <button type="button" class="btn btn-sm btn-danger remove-faq" data-index="${currentCount}" title="Remove FAQ">
                        <i data-lucide="trash-2"></i>
                    </button>
                </div>
            </div>
            <div class="faq-item-content">
                <div class="form-group">
                    <label for="faq${newIndex}Question" class="form-label">
                        <i data-lucide="help-circle" class="label-icon"></i>
                        Question
                    </label>
                    <input type="text" id="faq${newIndex}Question" name="faq${newIndex}Question" class="form-input" placeholder="Enter your question here...">
                </div>
                <div class="form-group">
                    <label for="faq${newIndex}Answer" class="form-label">
                        <i data-lucide="message-square" class="label-icon"></i>
                        Answer
                    </label>
                    <textarea id="faq${newIndex}Answer" name="faq${newIndex}Answer" class="form-textarea" rows="4" placeholder="Enter the answer here..."></textarea>
                </div>
            </div>
        `;
        
        faqContainer.appendChild(faqItem);
        faqContainer.style.display = 'block';
        if (emptyState) emptyState.style.display = 'none';

        // Reinitialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        // Event listeners are handled by delegation, no need to reattach

        // Focus on the new question input
        const newQuestionInput = faqItem.querySelector('input[type="text"]');
        if (newQuestionInput) {
            newQuestionInput.focus();
        }
    }

    /**
     * Populate Social Media form
     */
    populateSocialMediaForm(form, content) {
        const socialMedia = content.socialMedia;
        
        if (socialMedia) {
            this.setFormField(form, 'socialMediaTitle', socialMedia.title);
            this.setFormField(form, 'socialMediaSubtitle', socialMedia.subtitle);
            
            // Render social media links
            if (socialMedia.links && socialMedia.links.length > 0) {
                // Add a small delay to ensure DOM is ready
                setTimeout(() => {
                    this.renderSocialMediaLinks(socialMedia.links);
                }, 100);
            } else {
                // Render default social media platforms
                this.renderDefaultSocialMediaLinks();
            }
        } else {
            // Render default social media platforms if no data
            this.renderDefaultSocialMediaLinks();
        }
    }

    /**
     * Populate CTA form
     */
    populateCTAForm(form, content) {
        const ctaSection = content.ctaSection;
        
        if (ctaSection) {
            this.setFormField(form, 'contactCtaTitle', ctaSection.title);
            this.setFormField(form, 'contactCtaSubtitle', ctaSection.subtitle);
            this.setFormField(form, 'contactCtaDescription', ctaSection.description);
            
            if (ctaSection.primaryButton) {
                this.setFormField(form, 'contactCtaPrimaryButton', ctaSection.primaryButton.text);
                this.setFormField(form, 'contactCtaPrimaryUrl', ctaSection.primaryButton.link);
            }
            if (ctaSection.secondaryButton) {
                this.setFormField(form, 'contactCtaSecondaryButton', ctaSection.secondaryButton.text);
                this.setFormField(form, 'contactCtaSecondaryUrl', ctaSection.secondaryButton.link);
            }
        } else {
        }
    }

    /**
     * Set form field value
     */
    setFormField(form, fieldName, value) {
        if (!value) return;
        
        const field = form.querySelector(`[name="${fieldName}"]`);
        if (field) {
            if (field.type === 'checkbox' || field.type === 'radio') {
                field.checked = value === 'true' || value === true;
            } else {
                field.value = value;
            }
        }
    }

    /**
     * Render default social media links
     */
    renderDefaultSocialMediaLinks() {
        const defaultLinks = [
            {
                platform: 'Facebook',
                url: '',
                description: 'Follow us for school updates and events',
                icon: 'facebook',
                color: '#1877f2'
            },
            {
                platform: 'Instagram',
                url: '',
                description: 'See daily moments from our school life',
                icon: 'instagram',
                color: '#e4405f'
            },
            {
                platform: 'YouTube',
                url: '',
                description: 'Watch videos of our events and activities',
                icon: 'youtube',
                color: '#ff0000'
            },
            {
                platform: 'LinkedIn',
                url: '',
                description: 'Connect with our professional network',
                icon: 'linkedin',
                color: '#0077b5'
            }
        ];
        this.renderSocialMediaLinks(defaultLinks);
    }

    /**
     * Render social media links
     */
    renderSocialMediaLinks(links) {
        const container = document.querySelector('#socialMediaLinks .link-items');
        
        if (!container) {
            console.error('❌ Social media links container not found!');
            return;
        }
        
        container.innerHTML = '';
        
        links.forEach((link, index) => {
            const linkItem = this.createSocialMediaLinkItem(link, index);
            container.appendChild(linkItem);
        });
        
        // Attach event listeners
        this.attachSocialMediaEventListeners();
    }

    /**
     * Create social media link item
     */
    createSocialMediaLinkItem(link, index) {
        const item = document.createElement('div');
        item.className = 'social-link-item';
        item.dataset.index = index;
        
        const platform = link.platform || '';
        const url = link.url || '';
        const description = link.description || '';
        
        // Get platform icon based on platform name
        const getPlatformIcon = (platformName) => {
            const name = platformName.toLowerCase();
            if (name.includes('facebook')) return 'facebook';
            if (name.includes('instagram')) return 'instagram';
            if (name.includes('youtube')) return 'youtube';
            if (name.includes('linkedin')) return 'linkedin';
            if (name.includes('twitter')) return 'twitter';
            if (name.includes('tiktok')) return 'video';
            return 'link';
        };
        
        // Get platform color based on platform name
        const getPlatformColor = (platformName) => {
            const name = platformName.toLowerCase();
            if (name.includes('facebook')) return '#1877f2';
            if (name.includes('instagram')) return '#e4405f';
            if (name.includes('youtube')) return '#ff0000';
            if (name.includes('linkedin')) return '#0077b5';
            if (name.includes('twitter')) return '#1da1f2';
            if (name.includes('tiktok')) return '#000000';
            return '#6366f1';
        };
        
        const icon = getPlatformIcon(platform);
        const color = getPlatformColor(platform);
        
        item.innerHTML = `
            <div class="social-link-card">
                <div class="social-link-header">
                    <div class="social-link-preview">
                        <div class="social-link-icon" style="background-color: ${color}">
                            <i data-lucide="${icon}"></i>
                        </div>
                        <div class="social-link-info">
                            <h4 class="platform-name">${platform || 'New Platform'}</h4>
                            <p class="platform-description">${description || 'Social media platform'}</p>
                        </div>
                    </div>
                    <div class="social-link-actions">
                        <!-- Delete button removed -->
                    </div>
                </div>
                
                <div class="social-link-content">
                    <div class="form-group">
                        <label>
                            <i data-lucide="hash"></i>
                            Platform Name
                        </label>
                        <input type="text" name="social${index + 1}Platform" class="form-input" placeholder="e.g., Facebook, Instagram" value="${platform}">
                    </div>
                    
                    <div class="form-group">
                        <label>
                            <i data-lucide="link"></i>
                            URL
                        </label>
                        <input type="url" name="social${index + 1}Url" class="form-input" placeholder="https://..." value="${url}">
                    </div>
                    
                    <div class="form-group">
                        <label>
                            <i data-lucide="message-square"></i>
                            Description
                        </label>
                        <input type="text" name="social${index + 1}Description" class="form-input" placeholder="Brief description of this platform" value="${description}">
                    </div>
                </div>
            </div>
        `;
        
        return item;
    }

    /**
     * Attach social media event listeners
     */
    attachSocialMediaEventListeners() {
        // Event listeners removed since add/delete buttons and icon/color inputs are removed
        // Only keeping this method for potential future use
    }

    /**
     * Add new social media link (removed - no longer needed)
     */

    /**
     * Remove social media link
     */
    // removeSocialMediaLink method removed - no longer needed

    /**
     * Collect section data for saving
     */
    collectSectionData(section) {
        const form = document.querySelector(`#sectionEditor form`);
        if (!form) {
            console.error('Form not found for section:', section);
            return {};
        }

        // Structure the data according to the section
        switch(section) {
            case 'contact-info':
                const contactFormData = new FormData(form);
                const contactData = Object.fromEntries(contactFormData);
                return {
                    contactMain: {
                        title: contactData.contactTitle || '',
                        description: contactData.contactDescription || '',
                        contactInfo: {
                            email: contactData.contactEmail || '',
                            phone: contactData.contactPhone || '',
                            address: contactData.contactAddress || '',
                            hours: contactData.contactHours || ''
                        },
                        enabled: true
                    }
                };
            case 'location':
                const locationFormData = new FormData(form);
                const locationData = Object.fromEntries(locationFormData);
                return {
                    locationSection: {
                        title: locationData.locationTitle || '',
                        subtitle: locationData.locationSubtitle || '',
                        description: locationData.locationDescription || '',
                        headquarters: {
                            organizationName: locationData.organizationName || '',
                            city: locationData.city || '',
                            streetAddress: locationData.streetAddress || '',
                            postalCode: locationData.postalCode || '',
                            country: locationData.country || ''
                        },
                        maps: {
                            embedUrl: locationData.mapEmbedUrl || '',
                            directUrl: locationData.mapDirectUrl || ''
                        },
                        enabled: true
                    }
                };
            case 'faq':
                // Collect FAQ items from the actual UI elements (not FormData)
                const faqs = [];
                const faqContainer = document.querySelector('#faqItems');
                
                if (faqContainer) {
                    const faqItems = faqContainer.querySelectorAll('.faq-item-card');
                    
                    faqItems.forEach((faqItem, index) => {
                        // Find the question input and answer textarea within this specific FAQ item
                        const questionInput = faqItem.querySelector('input[type="text"]');
                        const answerTextarea = faqItem.querySelector('textarea');
                    
                    if (questionInput && answerTextarea) {
                            const question = questionInput.value || '';
                            const answer = answerTextarea.value || '';
                            
                            // Clean the data by removing extra characters and trimming
                            const cleanQuestion = question.trim().replace(/[^\w\s\?\.\!]/g, '');
                            const cleanAnswer = answer.trim().replace(/[^\w\s\?\.\!]/g, '');
                            
                            // Only add FAQ if it has content
                            if (cleanQuestion || cleanAnswer) {
                        faqs.push({
                                    question: cleanQuestion,
                                    answer: cleanAnswer
                                });
                            }
                        }
                    });
                }
                
                // Get title and subtitle from form
                const faqFormData = new FormData(form);
                const faqData = Object.fromEntries(faqFormData);
                
                return {
                    faqSection: {
                        title: faqData.faqTitle || '',
                        subtitle: faqData.faqSubtitle || '',
                        faqs: faqs,
                        deletedFAQs: this.deletedFAQs, // Include deleted FAQs for backend processing
                        enabled: true
                    }
                };
        case 'social-media':
                const socialFormData = new FormData(form);
                const socialData = Object.fromEntries(socialFormData);
            // Collect social media links dynamically
            const socialLinks = [];
            let socialIndex = 1;
                while (socialData[`social${socialIndex}Platform`] || socialData[`social${socialIndex}Url`]) {
                    const platform = socialData[`social${socialIndex}Platform`] || '';
                    const url = socialData[`social${socialIndex}Url`] || '';
                    const description = socialData[`social${socialIndex}Description`] || '';
                
                // Only include links that have platform or URL
                if (platform || url) {
                    socialLinks.push({
                        platform: platform,
                        url: url,
                        description: description
                    });
                }
                socialIndex++;
            }
            
            return {
                socialMedia: {
                        title: socialData.socialMediaTitle || '',
                        subtitle: socialData.socialMediaSubtitle || '',
                    links: socialLinks,
                    enabled: true
                }
            };
            case 'cta':
                const ctaFormData = new FormData(form);
                const ctaData = Object.fromEntries(ctaFormData);
                return {
                    ctaSection: {
                        title: ctaData.contactCtaTitle || '',
                        subtitle: ctaData.contactCtaSubtitle || '',
                        description: ctaData.contactCtaDescription || '',
                        primaryButton: { 
                            text: ctaData.contactCtaPrimaryButton || '', 
                            link: ctaData.contactCtaPrimaryUrl || '' 
                        },
                        secondaryButton: { 
                            text: ctaData.contactCtaSecondaryButton || '', 
                            link: ctaData.contactCtaSecondaryUrl || '' 
                        },
                        enabled: true
                    }
                };
            default:
                console.error('Unknown section:', section);
        return {};
        }
    }

    /**
     * Get Contact Info Section Editor
     */
    getContactInfoEditor() {
        return `
            <div class="section-editor">
                <div class="editor-header">
                    <div class="editor-title">
                        <span class="section-icon">📞</span>
                        <h2>Contact Information</h2>
                    </div>
                    <p>Configure the main contact information section.</p>
                </div>
                
                <div class="editor-content">
                    <form class="section-form" id="contactInfoForm">
                                <div class="form-group">
                                    <label for="contactTitle">Section Title</label>
                                    <input type="text" id="contactTitle" name="contactTitle" class="form-input" placeholder="Get in Touch">
                                </div>
                        
                                <div class="form-group">
                                    <label for="contactDescription">Description</label>
                                    <textarea id="contactDescription" name="contactDescription" class="form-textarea" rows="3" placeholder="Enter contact description"></textarea>
                                </div>
                        
                                <div class="form-group">
                                    <label for="contactAddress">Address</label>
                                    <textarea id="contactAddress" name="contactAddress" class="form-textarea" rows="3" placeholder="Enter full address"></textarea>
                                </div>
                        
                                <div class="form-group">
                                    <label for="contactPhone">Phone Number</label>
                                    <input type="tel" id="contactPhone" name="contactPhone" class="form-input" placeholder="+977-1-1234567">
                                </div>
                        
                                <div class="form-group">
                                    <label for="contactEmail">Email Address</label>
                                    <input type="email" id="contactEmail" name="contactEmail" class="form-input" placeholder="info@marigoldebs.edu.np">
                                </div>
                        
                                <div class="form-group">
                                    <label for="contactHours">Office Hours</label>
                                    <textarea id="contactHours" name="contactHours" class="form-textarea" rows="3" placeholder="Sunday - Thursday: 8:00 AM - 3:00 PM"></textarea>
                                </div>
                            </form>
                    </div>

                <div class="editor-actions">
                    <button class="btn btn-primary save-section-btn" data-section="contact-info">
                        <i data-lucide="save"></i>
                        Save Contact Information
                    </button>
                            </div>
                        </div>
        `;
    }

    /**
     * Get Location Section Editor
     */
    getLocationEditor() {
        return `
            <div class="section-editor">
                <div class="editor-header">
                    <div class="editor-title">
                        <span class="section-icon">📍</span>
                        <h2>Location Section</h2>
                    </div>
                    <p>Configure the location information and Google Maps integration.</p>
                </div>
                
                <div class="editor-content">
                    <form class="section-form" id="locationForm">
                                <div class="form-group">
                                    <label for="locationTitle">Section Title</label>
                            <input type="text" id="locationTitle" name="locationTitle" class="form-input" placeholder="Our Location">
                                </div>
                        
                                <div class="form-group">
                                    <label for="locationSubtitle">Section Subtitle</label>
                            <input type="text" id="locationSubtitle" name="locationSubtitle" class="form-input" placeholder="Connecting Near and Far">
                                </div>
                        
                        <div class="headquarters-section">
                            <h4>Headquarters Information</h4>
                                <div class="form-group">
                                <label for="organizationName">Organization Name</label>
                                <input type="text" id="organizationName" name="organizationName" class="form-input" placeholder="Marigold English Boarding School">
                                </div>
                        
                                <div class="form-group">
                                <label for="city">City</label>
                                <input type="text" id="city" name="city" class="form-input" placeholder="Kathmandu, Nepal">
                            </div>
                            
                            <div class="form-group">
                                <label for="streetAddress">Street Address</label>
                                <input type="text" id="streetAddress" name="streetAddress" class="form-input" placeholder="123 Education Street, Suite 456">
                            </div>
                            
                            <div class="form-group">
                                <label for="postalCode">Postal Code</label>
                                <input type="text" id="postalCode" name="postalCode" class="form-input" placeholder="Kathmandu, NP 44600">
                            </div>
                            
                            <div class="form-group">
                                <label for="country">Country</label>
                                <input type="text" id="country" name="country" class="form-input" placeholder="Nepal">
                            </div>
                        </div>
                        
                        <div class="maps-section">
                            <h4>Google Maps Integration</h4>
                            <div class="form-group">
                                <label for="mapEmbedUrl">Google Maps Embed URL</label>
                                <input type="url" id="mapEmbedUrl" name="mapEmbedUrl" class="form-input" placeholder="https://www.google.com/maps/embed?pb=...">
                                <small class="form-help">Get this URL from Google Maps > Share > Embed a map</small>
                            </div>
                            
                            <div class="form-group">
                                <label for="mapDirectUrl">Google Maps Direct Link</label>
                                <input type="url" id="mapDirectUrl" name="mapDirectUrl" class="form-input" placeholder="https://maps.app.goo.gl/...">
                                <small class="form-help">Link that opens Google Maps in a new tab</small>
                            </div>
                                </div>
                            </form>
                    </div>

                <div class="editor-actions">
                    <button class="btn btn-primary save-section-btn" data-section="location">
                        <i data-lucide="save"></i>
                        Save Location Section
                    </button>
                            </div>
                        </div>
        `;
    }

    /**
     * Get Social Media Section Editor
     */
    getSocialMediaEditor() {
        return `
            <div class="section-editor">
                <div class="editor-header">
                    <div class="editor-title">
                        <span class="section-icon">📱</span>
                        <h2>Social Media</h2>
                    </div>
                    <p>Configure social media links and connections for your contact page.</p>
                </div>
                
                <div class="editor-content">
                    <form class="section-form" id="socialMediaForm">
                        <!-- Section Header -->
                        <div class="form-section">
                            <h3 class="form-section-title">
                                <i data-lucide="type"></i>
                                Section Header
                            </h3>
                                <div class="form-group">
                                <label for="socialMediaTitle">
                                    <i data-lucide="heading-2"></i>
                                    Section Title
                                </label>
                                <input type="text" id="socialMediaTitle" name="socialMediaTitle" class="form-input" placeholder="Stay Connected">
                                </div>
                        
                                <div class="form-group">
                                <label for="socialMediaSubtitle">
                                    <i data-lucide="subtitles"></i>
                                    Section Subtitle
                                </label>
                                <input type="text" id="socialMediaSubtitle" name="socialMediaSubtitle" class="form-input" placeholder="Stay connected with us on social media for the latest updates and events">
                            </div>
                                </div>
                        
                        <!-- Social Media Links -->
                        <div class="form-section">
                            <h3 class="form-section-title">
                                <i data-lucide="link"></i>
                                Social Media Links
                            </h3>
                               <div class="social-links-container">
                                   <div class="social-links-grid" id="socialMediaLinks">
                                       <div class="link-items">
                                           <!-- Dynamic social media links will be added here -->
                                       </div>
                                    </div>
                               </div>
                                </div>
                            </form>
                    </div>

                <div class="editor-actions">
                    <button class="btn btn-primary save-section-btn" data-section="social-media">
                        <i data-lucide="save"></i>
                        Save Social Media
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
            <div class="section-editor">
                <div class="editor-header">
                    <div class="editor-title">
                        <span class="section-icon">🎯</span>
                        <h2>Call to Action</h2>
                    </div>
                    <p>Configure the call-to-action section for conversions.</p>
                </div>
                
                <div class="editor-content">
                    <form class="section-form" id="contactCtaForm">
                                <div class="form-group">
                                    <label for="contactCtaTitle">Section Title</label>
                                    <input type="text" id="contactCtaTitle" name="contactCtaTitle" class="form-input" placeholder="Ready to Get Started?">
                                </div>
                        
                                <div class="form-group">
                                    <label for="contactCtaSubtitle">Section Subtitle</label>
                                    <input type="text" id="contactCtaSubtitle" name="contactCtaSubtitle" class="form-input" placeholder="Join our community of learners and achievers">
                                </div>
                        
                                <div class="form-group">
                                    <label for="contactCtaDescription">Description</label>
                                    <textarea id="contactCtaDescription" name="contactCtaDescription" class="form-textarea" rows="3" placeholder="Enter CTA description"></textarea>
                                </div>
                        
                                <div class="form-group">
                                    <label for="contactCtaPrimaryButton">Primary Button Text</label>
                                    <input type="text" id="contactCtaPrimaryButton" name="contactCtaPrimaryButton" class="form-input" placeholder="Apply Now">
                                </div>
                        
                                <div class="form-group">
                                    <label for="contactCtaPrimaryUrl">Primary Button URL</label>
                                    <input type="url" id="contactCtaPrimaryUrl" name="contactCtaPrimaryUrl" class="form-input" placeholder="/apply.html">
                                </div>
                        
                                <div class="form-group">
                                    <label for="contactCtaSecondaryButton">Secondary Button Text</label>
                                    <input type="text" id="contactCtaSecondaryButton" name="contactCtaSecondaryButton" class="form-input" placeholder="Schedule a Visit">
                                </div>
                        
                                <div class="form-group">
                                    <label for="contactCtaSecondaryUrl">Secondary Button URL</label>
                                    <input type="url" id="contactCtaSecondaryUrl" name="contactCtaSecondaryUrl" class="form-input" placeholder="/contact.html">
                                </div>
                            </form>
                    </div>

                <div class="editor-actions">
                    <button class="btn btn-primary save-section-btn" data-section="cta">
                        <i data-lucide="save"></i>
                        Save CTA Section
                    </button>
                            </div>
                        </div>
        `;
    }

    /**
     * Get FAQ Section Editor
     */
    getFaqEditor() {
        return `
            <div class="section-editor">
                <div class="editor-header">
                    <div class="editor-title">
                        <span class="section-icon">❓</span>
                        <h2>FAQ Section</h2>
                    </div>
                    <p>Configure frequently asked questions and answers.</p>
                </div>
                
                <div class="editor-content">
                    <form class="section-form" id="faqForm">
                                <div class="form-group">
                                    <label for="faqTitle">Section Title</label>
                            <input type="text" id="faqTitle" name="faqTitle" class="form-input" placeholder="Frequently Asked Questions">
                                </div>
                        
                                <div class="form-group">
                                    <label for="faqSubtitle">Section Subtitle</label>
                            <input type="text" id="faqSubtitle" name="faqSubtitle" class="form-input" placeholder="Find answers to common questions">
                                </div>
                        
                                <div class="faq-management-section">
                                    <div class="section-header">
                            <h4>FAQ Items</h4>
                                        <button type="button" class="btn btn-primary btn-sm" id="addFAQ">
                                            <i data-lucide="plus-circle"></i>
                                            Add New FAQ
                                    </button>
                                </div>
                                    <div class="faq-items-container">
                                        <div class="faq-items" id="faqItems">
                                        <!-- FAQ items will be dynamically added here -->
                    </div>
                                        <div class="faq-empty-state" id="faqEmptyState" style="display: none;">
                                            <div class="empty-state-content">
                                                <i data-lucide="help-circle" class="empty-icon"></i>
                                                <h5>No FAQ items yet</h5>
                                                <p>Click "Add New FAQ" to create your first FAQ item.</p>
                            </div>
                        </div>
                    </div>
                                </div>
                            </form>
                        </div>
                
                <div class="editor-actions">
                    <button class="btn btn-primary save-section-btn" data-section="faq">
                        <i data-lucide="save"></i>
                        Save FAQ Section
                    </button>
                    </div>
                </div>
        `;
    }

    /**
     * Initialize contact content functionality
     */
    initializeContactContent() {
        // Initialize any contact content-specific functionality
        this.loadContactData();
        
        // Set up section menu item clicks after content is loaded
        this.setupSectionMenuClicks();
        
        // Show section list by default
        this.showSectionList();
    }

    /**
     * Set up section menu item clicks
     */
    setupSectionMenuClicks() {
        // Use event delegation; capture phase to beat global nav handlers
        document.addEventListener('click', (e) => {
            const sectionMenuItem = e.target.closest('.section-menu-item');
            if (!sectionMenuItem) return;
            
            // Check if we're in contact content management
            const pageContent = document.getElementById('pageContent');
            const isContactContent = pageContent && pageContent.innerHTML.includes('contact-content-section');
            
            // Only proceed if we're in contact content section
            if (!isContactContent) {
                return;
            }
            
            if (isContactContent) {
                
                // Force in-place editor navigation; block default anchors/global handlers
                e.preventDefault();
                e.stopImmediatePropagation();
                e.stopPropagation();
                const section = sectionMenuItem.dataset.section;
                this.loadSection(section);
            }
        }, true); // capture=true
    }

    /**
     * Load contact data from API
     */
    async loadContactData() {
        try {
            // Add cache-busting to always get fresh data
            const cacheBuster = `?t=${Date.now()}`;
            const response = await fetch(`/api/content/contact${cacheBuster}`, {
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                }
            });
            const data = await response.json();
            
            if (data.success && data.content) {
                this.contactData = data.content;
                
                // Update section enabled states based on data
                Object.keys(this.sections).forEach(sectionKey => {
                    const sectionData = data.content[this.getSectionKey(sectionKey)];
                    if (sectionData && typeof sectionData.enabled === 'boolean') {
                        this.sections[sectionKey].enabled = sectionData.enabled;
                    }
                });
                
                // Remove shimmer placeholders and show actual content
                this.removeShimmerPlaceholders();
                
                // Update all toggle switches after setting all section states
                Object.keys(this.sections).forEach(sectionKey => {
                    this.updateSectionStatus(sectionKey);
                });
                
                this.populateForms(data.content);
            }
        } catch (error) {
            console.error('Error loading contact data:', error);
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
     * Update section status
     */
    updateSectionStatus(section) {
        // Toggle functionality removed - keeping method for potential future use
    }

    /**
     * Get section key for data mapping
     */
    getSectionKey(sectionKey) {
        const keyMap = {
            'contact-info': 'contactMain',
            'location': 'locationSection',
            'social-media': 'socialMedia',
            'cta': 'ctaSection',
            'faq': 'faqSection'
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

        // Populate contact information
        if (content.contactInfo) {
            const titleEl = document.getElementById('contactTitle');
            const subtitleEl = document.getElementById('contactSubtitle');
            const descEl = document.getElementById('contactDescription');
            const addressEl = document.getElementById('contactAddress');
            const phoneEl = document.getElementById('contactPhone');
            const emailEl = document.getElementById('contactEmail');
            const hoursEl = document.getElementById('contactHours');
            
            if (titleEl) titleEl.value = content.contactInfo.title || '';
            if (subtitleEl) subtitleEl.value = content.contactInfo.subtitle || '';
            if (descEl) descEl.value = content.contactInfo.description || '';
            if (addressEl) addressEl.value = content.contactInfo.address || '';
            if (phoneEl) phoneEl.value = content.contactInfo.phone || '';
            if (emailEl) emailEl.value = content.contactInfo.email || '';
            if (hoursEl) hoursEl.value = content.contactInfo.hours || '';
        }

        // Populate location section
        if (content.location) {
            const titleEl = document.getElementById('locationTitle');
            const subtitleEl = document.getElementById('locationSubtitle');
            const descEl = document.getElementById('locationDescription');
            const transportEl = document.getElementById('transportationInfo');
            
            if (titleEl) titleEl.value = content.location.title || '';
            if (subtitleEl) subtitleEl.value = content.location.subtitle || '';
            if (descEl) descEl.value = content.location.description || '';
            if (transportEl) transportEl.value = content.location.transportation || '';
        }

        // Populate social media
        if (content.socialMedia) {
            const titleEl = document.getElementById('socialMediaTitle');
            const subtitleEl = document.getElementById('socialMediaSubtitle');
            
            if (titleEl) titleEl.value = content.socialMedia.title || '';
            if (subtitleEl) subtitleEl.value = content.socialMedia.subtitle || '';
            this.renderSocialMediaLinks(content.socialMedia.links || []);
        }

        // Populate CTA section
        if (content.cta) {
            const titleEl = document.getElementById('contactCtaTitle');
            const subtitleEl = document.getElementById('contactCtaSubtitle');
            const descEl = document.getElementById('contactCtaDescription');
            const primaryEl = document.getElementById('contactCtaPrimaryButton');
            const secondaryEl = document.getElementById('contactCtaSecondaryButton');
            
            if (titleEl) titleEl.value = content.cta.title || '';
            if (subtitleEl) subtitleEl.value = content.cta.subtitle || '';
            if (descEl) descEl.value = content.cta.description || '';
            if (primaryEl) primaryEl.value = content.cta.primaryButton || '';
            if (secondaryEl) secondaryEl.value = content.cta.secondaryButton || '';
        }

        // Populate FAQ section
        if (content.faq) {
            const titleEl = document.getElementById('faqTitle');
            const subtitleEl = document.getElementById('faqSubtitle');
            
            if (titleEl) titleEl.value = content.faq.title || '';
            if (subtitleEl) subtitleEl.value = content.faq.subtitle || '';
            this.renderFAQs(content.faq.items || []);
        }

    }


    /**
     * Render FAQs
     */
    renderFAQs(faqs) {
        const container = document.querySelector('.faq-items');
        if (!container) return;

        container.innerHTML = '';
        
        faqs.forEach((faq, index) => {
            const faqHTML = `
                <div class="faq-item" data-index="${index}">
                    <div class="faq-header">
                        <h5>FAQ ${index + 1}</h5>
                        <button type="button" class="btn btn-danger btn-sm delete-faq" data-index="${index}">
                            <i data-lucide="trash-2"></i>
                            Delete
                        </button>
                    </div>
                    <div class="form-group">
                        <label for="faq${index}Question">Question</label>
                        <input type="text" id="faq${index}Question" name="faq${index}Question" class="form-input" placeholder="Enter question" value="${faq.question || ''}">
                    </div>
                    <div class="form-group">
                        <label for="faq${index}Answer">Answer</label>
                        <textarea id="faq${index}Answer" name="faq${index}Answer" class="form-textarea" rows="3" placeholder="Enter answer">${faq.answer || ''}</textarea>
                    </div>
                </div>
            `;
            container.innerHTML += faqHTML;
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
        
        // Add active class to contact content link
        const contactContentLink = document.querySelector('[data-section="contact-content"]');
        if (contactContentLink) {
            contactContentLink.classList.add('active');
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
     * Save updated FAQ data to database with correct indexing
     */
    async saveUpdatedFAQData() {
        try {
            
            // Collect current FAQ data from the form with correct indexing
            const faqData = this.collectSectionData('faq');
            
            // Save to database
            const response = await fetch('/api/content/contact/bulk', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(faqData)
            });

            if (response.ok) {
                this.showSaveSuccess('FAQ order updated successfully!');
            } else {
                console.error('❌ Failed to save FAQ data:', response.statusText);
                this.showSaveError('Failed to update FAQ order');
            }
        } catch (error) {
            console.error('❌ Error saving FAQ data:', error);
            this.showSaveError('Error updating FAQ order');
        }
    }

    /**
     * Show save success message
     */
    showSaveSuccess(message) {
        // Create or update success message
        let successMsg = document.querySelector('.save-success-message');
        if (!successMsg) {
            successMsg = document.createElement('div');
            successMsg.className = 'save-success-message';
            successMsg.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #10b981;
                color: white;
                padding: 12px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 1000;
                font-size: 14px;
                font-weight: 500;
            `;
            document.body.appendChild(successMsg);
        }
        
        successMsg.textContent = message;
        successMsg.style.display = 'block';
        
        // Hide after 3 seconds
        setTimeout(() => {
            successMsg.style.display = 'none';
        }, 3000);
    }

    /**
     * Show save error message
     */
    showSaveError(message) {
        // Create or update error message
        let errorMsg = document.querySelector('.save-error-message');
        if (!errorMsg) {
            errorMsg = document.createElement('div');
            errorMsg.className = 'save-error-message';
            errorMsg.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #ef4444;
                color: white;
                padding: 12px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 1000;
                font-size: 14px;
                font-weight: 500;
            `;
            document.body.appendChild(errorMsg);
        }
        
        errorMsg.textContent = message;
        errorMsg.style.display = 'block';
        
        // Hide after 5 seconds
        setTimeout(() => {
            errorMsg.style.display = 'none';
        }, 5000);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.contactContentLoader = new ContactContentLoader();
});
