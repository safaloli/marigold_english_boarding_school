/**
 * Homepage Content Management
 * Handles all homepage content CRUD operations
 */


class HomepageAdmin {
    constructor() {
        this.content = {};
        this.sections = [
            'hero',
            'quick_facts',
            'why_choose', 
            'mission',
            'programs',
            'testimonials',
            'gallery',
            'contact'
        ];
        
        this.init();
    }

    async init() {
        await this.loadAllContent();
        this.setupEventListeners();
        this.populateForms();
    }

    async loadAllContent() {
        try {
            // Load content for all sections
            for (const section of this.sections) {
                try {
                    const response = await fetch(`/api/admin/homepage-content/${section}`);
                    
                    if (response.ok) {
                        const sectionContent = await response.json();
                        this.content[section] = sectionContent;
                    } else {
                        this.content[section] = [];
                    }
                } catch (error) {
                    this.content[section] = [];
                }
            }
        } catch (error) {
            this.showNotification('Failed to load homepage content', 'error');
        }
    }

    setupEventListeners() {
        // Save button
        const saveBtn = document.getElementById('saveHomeContentBtn');
        if (saveBtn) {

            saveBtn.addEventListener('click', () => {

                this.saveAllContent();
            });
        } else {

        }

        // Form change listeners
        this.sections.forEach(section => {
            const form = document.getElementById(`${section}Form`);
            if (form) {
                form.addEventListener('input', () => this.markFormAsChanged(form));
                form.addEventListener('change', () => this.markFormAsChanged(form));
            }
        });

        // Section toggle listeners
        this.sections.forEach(section => {
            const toggle = document.getElementById(`${section}Enabled`);
            if (toggle) {
                toggle.addEventListener('change', (e) => {
                    this.toggleSection(section, e.target.checked);
                });
            }
        });
    }

    populateForms() {

        
        // Check if we have any content loaded
        const hasContent = Object.values(this.content).some(section => section && section.length > 0);
        
        if (!hasContent) {

            // The forms already have default values, so we don't need to do anything
            return;
        }
        
        // Hero Section
        this.populateHeroForm();
        
        // Quick Facts Section
        this.populateQuickFactsForm();
        
        // Why Choose Section
        this.populateWhyChooseForm();
        
        // Mission Section
        this.populateMissionForm();
        
        // Programs Section
        this.populateProgramsForm();
        
        // Testimonials Section
        this.populateTestimonialsForm();
        
        // Gallery Section
        this.populateGalleryForm();
        
        // Contact Section
        this.populateContactForm();
    }

    populateHeroForm() {
        const heroContent = this.content.hero || [];
        
        // Main title
        const titleContent = heroContent.find(item => item.key === 'main_title');
        if (titleContent) {
            document.getElementById('heroTitle').value = titleContent.title || '';
            document.getElementById('heroDescription').value = titleContent.content || '';
        }

        // Badge
        const badgeContent = heroContent.find(item => item.key === 'badge');
        if (badgeContent) {
            document.getElementById('heroSubtitle').value = badgeContent.content || '';
        }

        // Buttons
        const primaryBtn = heroContent.find(item => item.key === 'primary_button');
        if (primaryBtn) {
            document.getElementById('heroButton1Text').value = primaryBtn.title || '';
            document.getElementById('heroButton1Link').value = primaryBtn.linkUrl || '';
        }

        const secondaryBtn = heroContent.find(item => item.key === 'secondary_button');
        if (secondaryBtn) {
            document.getElementById('heroButton2Text').value = secondaryBtn.title || '';
            document.getElementById('heroButton2Link').value = secondaryBtn.linkUrl || '';
        }

        // Stats
        const statsContent = heroContent.find(item => item.key === 'stats');
        if (statsContent && statsContent.metadata) {
            try {
                const stats = JSON.parse(statsContent.metadata);
                // Populate stats if form fields exist
                const yearsEl = document.getElementById('heroStatsYears');
                const studentsEl = document.getElementById('heroStatsStudents');
                const teachersEl = document.getElementById('heroStatsTeachers');
                const achievementsEl = document.getElementById('heroStatsAchievements');
                
                if (stats.years && yearsEl) yearsEl.value = stats.years;
                if (stats.students && studentsEl) studentsEl.value = stats.students;
                if (stats.teachers && teachersEl) teachersEl.value = stats.teachers;
                if (stats.achievements && achievementsEl) achievementsEl.value = stats.achievements;
            } catch (error) {
                // Handle parsing error silently
            }
        }

        // Section enabled state
        const sectionEnabled = heroContent.find(item => item.key === 'section_enabled');
        if (sectionEnabled) {
            document.getElementById('heroEnabled').checked = sectionEnabled.isActive !== false;
        }
    }

    populateQuickFactsForm() {
        const quickFactsContent = this.content.quick_facts || [];
        
        // Section title
        const titleContent = quickFactsContent.find(item => item.key === 'section_title');
        if (titleContent) {
            const titleEl = document.getElementById('quickFactsTitle');
            if (titleEl) titleEl.value = titleContent.title || '';
        }

        // Fact 1 - Years of Excellence
        const fact1Content = quickFactsContent.find(item => item.key === 'fact_1');
        if (fact1Content) {
            const iconEl = document.getElementById('fact1Icon');
            const numberEl = document.getElementById('fact1Number');
            const labelEl = document.getElementById('fact1Label');
            if (iconEl) iconEl.value = fact1Content.metadata ? JSON.parse(fact1Content.metadata).icon || '' : '';
            if (numberEl) numberEl.value = fact1Content.title || '';
            if (labelEl) labelEl.value = fact1Content.content || '';
        }

        // Fact 2 - Qualified Teachers
        const fact2Content = quickFactsContent.find(item => item.key === 'fact_2');
        if (fact2Content) {
            const iconEl = document.getElementById('fact2Icon');
            const numberEl = document.getElementById('fact2Number');
            const labelEl = document.getElementById('fact2Label');
            if (iconEl) iconEl.value = fact2Content.metadata ? JSON.parse(fact2Content.metadata).icon || '' : '';
            if (numberEl) numberEl.value = fact2Content.title || '';
            if (labelEl) labelEl.value = fact2Content.content || '';
        }

        // Fact 3 - Students Enrolled
        const fact3Content = quickFactsContent.find(item => item.key === 'fact_3');
        if (fact3Content) {
            const iconEl = document.getElementById('fact3Icon');
            const numberEl = document.getElementById('fact3Number');
            const labelEl = document.getElementById('fact3Label');
            if (iconEl) iconEl.value = fact3Content.metadata ? JSON.parse(fact3Content.metadata).icon || '' : '';
            if (numberEl) numberEl.value = fact3Content.title || '';
            if (labelEl) labelEl.value = fact3Content.content || '';
        }

        // Fact 4 - Awards & Achievements
        const fact4Content = quickFactsContent.find(item => item.key === 'fact_4');
        if (fact4Content) {
            const iconEl = document.getElementById('fact4Icon');
            const numberEl = document.getElementById('fact4Number');
            const labelEl = document.getElementById('fact4Label');
            if (iconEl) iconEl.value = fact4Content.metadata ? JSON.parse(fact4Content.metadata).icon || '' : '';
            if (numberEl) numberEl.value = fact4Content.title || '';
            if (labelEl) labelEl.value = fact4Content.content || '';
        }

        // Section enabled state
        const sectionEnabled = quickFactsContent.find(item => item.key === 'section_enabled');
        if (sectionEnabled) {
            const enabledEl = document.getElementById('quickFactsEnabled');
            if (enabledEl) enabledEl.checked = sectionEnabled.isActive !== false;
        }
    }

    populateWhyChooseForm() {
        const whyChooseContent = this.content.why_choose || [];
        
        // Section title
        const titleContent = whyChooseContent.find(item => item.key === 'section_title');
        if (titleContent) {
            document.getElementById('whyChooseTitle').value = titleContent.title || '';
            document.getElementById('whyChooseSubtitle').value = titleContent.description || '';
        }

        // Benefits
        for (let i = 1; i <= 4; i++) {
            const benefitContent = whyChooseContent.find(item => item.key === `benefit_${i}`);
            if (benefitContent) {
                document.getElementById(`benefit${i}Title`).value = benefitContent.title || '';
                document.getElementById(`benefit${i}Description`).value = benefitContent.description || '';
                document.getElementById(`benefit${i}Icon`).value = benefitContent.metadata || '';
            }
        }

        // Section enabled state
        const sectionEnabled = whyChooseContent.find(item => item.key === 'section_enabled');
        if (sectionEnabled) {
            document.getElementById('whyChooseEnabled').checked = sectionEnabled.isActive !== false;
        }
    }

    populateMissionForm() {
        const missionContent = this.content.mission || [];
        
        // Mission card
        const missionCard = missionContent.find(item => item.key === 'mission_card');
        if (missionCard) {
            document.getElementById('missionTitle').value = missionCard.title || '';
            document.getElementById('missionDescription').value = missionCard.description || '';
        }

        // Vision card
        const visionCard = missionContent.find(item => item.key === 'vision_card');
        if (visionCard) {
            document.getElementById('visionTitle').value = visionCard.title || '';
            document.getElementById('visionDescription').value = visionCard.description || '';
        }

        // Values card
        const valuesCard = missionContent.find(item => item.key === 'values_card');
        if (valuesCard) {
            document.getElementById('valuesTitle').value = valuesCard.title || '';
            document.getElementById('valuesDescription').value = valuesCard.description || '';
        }

        // Section enabled state
        const sectionEnabled = missionContent.find(item => item.key === 'section_enabled');
        if (sectionEnabled) {
            document.getElementById('missionEnabled').checked = sectionEnabled.isActive !== false;
        }
    }

    populateProgramsForm() {
        const programsContent = this.content.programs || [];
        
        // Section title
        const titleContent = programsContent.find(item => item.key === 'section_title');
        if (titleContent) {
            document.getElementById('programsTitle').value = titleContent.title || '';
            document.getElementById('programsSubtitle').value = titleContent.description || '';
        }

        // Programs - use the correct keys from database (program_1, program_2, etc.)
        for (let i = 1; i <= 4; i++) {
            const programContent = programsContent.find(item => item.key === `program_${i}`);
            if (programContent) {
                const titleEl = document.getElementById(`program${i}Title`);
                const descEl = document.getElementById(`program${i}Description`);
                const iconEl = document.getElementById(`program${i}Icon`);
                
                if (titleEl) titleEl.value = programContent.title || '';
                if (descEl) descEl.value = programContent.content || '';
                if (iconEl) iconEl.value = programContent.metadata || '';
            }
        }

        // Section enabled state
        const sectionEnabled = programsContent.find(item => item.key === 'section_enabled');
        if (sectionEnabled) {
            document.getElementById('programsEnabled').checked = sectionEnabled.isActive !== false;
        }
    }

    populateTestimonialsForm() {
        const testimonialsContent = this.content.testimonials || [];
        
        // Section title
        const titleContent = testimonialsContent.find(item => item.key === 'section_title');
        if (titleContent) {
            document.getElementById('testimonialsTitle').value = titleContent.title || '';
            document.getElementById('testimonialsSubtitle').value = titleContent.description || '';
        }

        // Testimonials (up to 6)
        for (let i = 1; i <= 6; i++) {
            const testimonialContent = testimonialsContent.find(item => item.key === `testimonial_${i}`);
            if (testimonialContent) {
                const fields = [
                    `testimonial${i}Name`,
                    `testimonial${i}Handle`, 
                    `testimonial${i}Text`,
                    `testimonial${i}Avatar`
                ];
                
                fields.forEach(field => {
                    const element = document.getElementById(field);
                    if (element) {
                        const value = this.getTestimonialFieldValue(testimonialContent, field);
                        element.value = value;
                    }
                });
            }
        }

        // Section enabled state
        const sectionEnabled = testimonialsContent.find(item => item.key === 'section_enabled');
        if (sectionEnabled) {
            document.getElementById('testimonialsEnabled').checked = sectionEnabled.isActive !== false;
        }
    }

    getTestimonialFieldValue(content, field) {
        if (field.includes('Name')) return content.title || '';
        if (field.includes('Handle')) return content.metadata || '';
        if (field.includes('Text')) return content.description || '';
        if (field.includes('Avatar')) return content.imageUrl || '';
        return '';
    }

    populateGalleryForm() {
        const galleryContent = this.content.gallery || [];
        
        // Section title
        const titleContent = galleryContent.find(item => item.key === 'section_title');
        if (titleContent) {
            const galleryTitleEl = document.getElementById('galleryTitle');
            const gallerySubtitleEl = document.getElementById('gallerySubtitle');
            if (galleryTitleEl) galleryTitleEl.value = titleContent.title || '';
            if (gallerySubtitleEl) gallerySubtitleEl.value = titleContent.description || '';
        }

        // Gallery items (up to 6)
        for (let i = 1; i <= 6; i++) {
            const galleryItemContent = galleryContent.find(item => item.key === `gallery_item_${i}`);
            if (galleryItemContent) {
                const titleEl = document.getElementById(`gallery${i}Title`);
                const descEl = document.getElementById(`gallery${i}Description`);
                const imageEl = document.getElementById(`gallery${i}Image`);
                if (titleEl) titleEl.value = galleryItemContent.title || '';
                if (descEl) descEl.value = galleryItemContent.description || '';
                if (imageEl) imageEl.value = galleryItemContent.imageUrl || '';
            }
        }

        // Section enabled state
        const sectionEnabled = galleryContent.find(item => item.key === 'section_enabled');
        if (sectionEnabled) {
            const enabledEl = document.getElementById('galleryEnabled');
            if (enabledEl) enabledEl.checked = sectionEnabled.isActive !== false;
        }
    }

    populateContactForm() {
        const contactContent = this.content.contact || [];
        
        // Section title
        const titleContent = contactContent.find(item => item.key === 'section_title');
        if (titleContent) {
            const titleEl = document.getElementById('contactTitle');
            const subtitleEl = document.getElementById('contactSubtitle');
            if (titleEl) titleEl.value = titleContent.title || '';
            if (subtitleEl) subtitleEl.value = titleContent.description || '';
        }

        // Contact info
        const contactInfo = contactContent.find(item => item.key === 'contact_info');
        if (contactInfo && contactInfo.metadata) {
            try {
                const info = JSON.parse(contactInfo.metadata);
                const addressEl = document.getElementById('contactAddress');
                const phoneEl = document.getElementById('contactPhone');
                const emailEl = document.getElementById('contactEmail');
                const hoursEl = document.getElementById('contactHours');
                if (info.address && addressEl) addressEl.value = info.address;
                if (info.phone && phoneEl) phoneEl.value = info.phone;
                if (info.email && emailEl) emailEl.value = info.email;
                if (info.hours && hoursEl) hoursEl.value = info.hours;
            } catch (error) {

            }
        }

        // Section enabled state
        const sectionEnabled = contactContent.find(item => item.key === 'section_enabled');
        if (sectionEnabled) {
            const enabledEl = document.getElementById('contactEnabled');
            if (enabledEl) enabledEl.checked = sectionEnabled.isActive !== false;
        }
    }

    async saveAllContent() {
        try {

            this.showNotification('Saving homepage content...', 'info');

            const allContent = [];
            
            // Collect content from all sections
            this.sections.forEach(section => {

                const sectionContent = this.getFormDataForSection(section);

                allContent.push(...sectionContent);
            });



            // Send bulk update
            const response = await fetch('/api/admin/homepage-content/bulk', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: allContent })
            });

            if (response.ok) {
                const updatedContent = await response.json();

                this.showNotification('Homepage content saved successfully!', 'success');
                
                // Reload content to get latest data
                await this.loadAllContent();
                this.clearFormChanges();
            } else {
                const error = await response.json();
                throw new Error(error.message || 'Failed to save content');
            }
        } catch (error) {

            this.showNotification(`Failed to save content: ${error.message}`, 'error');
        }
    }

    getFormDataForSection(section) {
        const content = [];
        
        switch (section) {
            case 'hero':
                content.push(...this.getHeroFormData());
                break;
            case 'quick_facts':
                content.push(...this.getQuickFactsFormData());
                break;
            case 'why_choose':
                content.push(...this.getWhyChooseFormData());
                break;
            case 'mission':
                content.push(...this.getMissionFormData());
                break;
            case 'programs':
                content.push(...this.getProgramsFormData());
                break;
            case 'testimonials':
                content.push(...this.getTestimonialsFormData());
                break;
            case 'gallery':
                content.push(...this.getGalleryFormData());
                break;
            case 'contact':
                content.push(...this.getContactFormData());
                break;
        }
        
        return content;
    }

    getHeroFormData() {
        const content = [];
        
        // Get form elements with null checks
        const heroTitleEl = document.getElementById('heroTitle');
        const heroDescriptionEl = document.getElementById('heroDescription');
        const heroSubtitleEl = document.getElementById('heroSubtitle');
        const heroButton1TextEl = document.getElementById('heroButton1Text');
        const heroButton1LinkEl = document.getElementById('heroButton1Link');
        const heroButton2TextEl = document.getElementById('heroButton2Text');
        const heroButton2LinkEl = document.getElementById('heroButton2Link');
        const heroEnabledEl = document.getElementById('heroEnabled');
        
        // Main title
        content.push({
            section: 'hero',
            key: 'main_title',
            title: heroTitleEl ? heroTitleEl.value : '',
            content: heroDescriptionEl ? heroDescriptionEl.value : '',
            isActive: heroEnabledEl ? heroEnabledEl.checked : true
        });

        // Badge
        content.push({
            section: 'hero',
            key: 'badge',
            content: heroSubtitleEl ? heroSubtitleEl.value : '',
            isActive: heroEnabledEl ? heroEnabledEl.checked : true
        });

        // Primary button
        content.push({
            section: 'hero',
            key: 'primary_button',
            title: heroButton1TextEl ? heroButton1TextEl.value : '',
            linkUrl: heroButton1LinkEl ? heroButton1LinkEl.value : '',
            isActive: heroEnabledEl ? heroEnabledEl.checked : true
        });

        // Secondary button
        content.push({
            section: 'hero',
            key: 'secondary_button',
            title: heroButton2TextEl ? heroButton2TextEl.value : '',
            linkUrl: heroButton2LinkEl ? heroButton2LinkEl.value : '',
            isActive: heroEnabledEl ? heroEnabledEl.checked : true
        });

        // Stats
        const stats = {
            years: document.getElementById('heroStatsYears')?.value || '25+',
            students: document.getElementById('heroStatsStudents')?.value || '500+',
            teachers: document.getElementById('heroStatsTeachers')?.value || '50+',
            achievements: document.getElementById('heroStatsAchievements')?.value || '100+'
        };
        
        content.push({
            section: 'hero',
            key: 'stats',
            metadata: JSON.stringify(stats),
            isActive: heroEnabledEl ? heroEnabledEl.checked : true
        });

        // Section enabled
        content.push({
            section: 'hero',
            key: 'section_enabled',
            isActive: heroEnabledEl ? heroEnabledEl.checked : true
        });

        return content;
    }

    getQuickFactsFormData() {
        const content = [];
        
        const quickFactsTitleEl = document.getElementById('quickFactsTitle');
        const quickFactsEnabledEl = document.getElementById('quickFactsEnabled');
        
        content.push({
            section: 'quick_facts',
            key: 'section_title',
            title: quickFactsTitleEl ? quickFactsTitleEl.value : '',
            isActive: quickFactsEnabledEl ? quickFactsEnabledEl.checked : true
        });

        for (let i = 1; i <= 4; i++) {
            const iconEl = document.getElementById(`fact${i}Icon`);
            const numberEl = document.getElementById(`fact${i}Number`);
            const labelEl = document.getElementById(`fact${i}Label`);
            
            content.push({
                section: 'quick_facts',
                key: `fact_${i}`,
                title: numberEl ? numberEl.value : '',
                content: labelEl ? labelEl.value : '',
                metadata: JSON.stringify({ icon: iconEl ? iconEl.value : '' }),
                isActive: quickFactsEnabledEl ? quickFactsEnabledEl.checked : true,
                orderIndex: i
            });
        }
        return content;
    }

    getWhyChooseFormData() {
        const content = [];
        
        // Get form elements with null checks
        const whyChooseTitleEl = document.getElementById('whyChooseTitle');
        const whyChooseSubtitleEl = document.getElementById('whyChooseSubtitle');
        const whyChooseEnabledEl = document.getElementById('whyChooseEnabled');
        
        // Section title
        content.push({
            section: 'why_choose',
            key: 'section_title',
            title: whyChooseTitleEl ? whyChooseTitleEl.value : '',
            description: whyChooseSubtitleEl ? whyChooseSubtitleEl.value : '',
            isActive: whyChooseEnabledEl ? whyChooseEnabledEl.checked : true
        });

        // Benefits
        for (let i = 1; i <= 4; i++) {
            const benefitTitleEl = document.getElementById(`benefit${i}Title`);
            const benefitDescriptionEl = document.getElementById(`benefit${i}Description`);
            const benefitIconEl = document.getElementById(`benefit${i}Icon`);
            
            content.push({
                section: 'why_choose',
                key: `benefit_${i}`,
                title: benefitTitleEl ? benefitTitleEl.value : '',
                description: benefitDescriptionEl ? benefitDescriptionEl.value : '',
                metadata: benefitIconEl ? benefitIconEl.value : '',
                orderIndex: i,
                isActive: whyChooseEnabledEl ? whyChooseEnabledEl.checked : true
            });
        }

        // Section enabled
        content.push({
            section: 'why_choose',
            key: 'section_enabled',
            isActive: whyChooseEnabledEl ? whyChooseEnabledEl.checked : true
        });

        return content;
    }

    getMissionFormData() {
        const content = [];
        
        // Mission card
        content.push({
            section: 'mission',
            key: 'mission_card',
            title: document.getElementById('missionTitle').value,
            description: document.getElementById('missionDescription').value,
            isActive: document.getElementById('missionEnabled').checked
        });

        // Vision card
        content.push({
            section: 'mission',
            key: 'vision_card',
            title: document.getElementById('visionTitle').value,
            description: document.getElementById('visionDescription').value,
            isActive: document.getElementById('missionEnabled').checked
        });

        // Values card
        content.push({
            section: 'mission',
            key: 'values_card',
            title: document.getElementById('valuesTitle').value,
            description: document.getElementById('valuesDescription').value,
            isActive: document.getElementById('missionEnabled').checked
        });

        // Section enabled
        content.push({
            section: 'mission',
            key: 'section_enabled',
            isActive: document.getElementById('missionEnabled').checked
        });

        return content;
    }

    getProgramsFormData() {
        const content = [];
        
        // Section title
        content.push({
            section: 'programs',
            key: 'section_title',
            title: document.getElementById('programsTitle').value,
            description: document.getElementById('programsSubtitle').value,
            isActive: document.getElementById('programsEnabled').checked
        });

        // Programs - use the same keys as seeded data
        for (let i = 1; i <= 4; i++) {
            content.push({
                section: 'programs',
                key: `program_${i}`,
                title: document.getElementById(`program${i}Title`).value,
                content: document.getElementById(`program${i}Description`).value,
                metadata: document.getElementById(`program${i}Icon`).value,
                orderIndex: i,
                isActive: document.getElementById('programsEnabled').checked
            });
        }

        // Section enabled
        content.push({
            section: 'programs',
            key: 'section_enabled',
            isActive: document.getElementById('programsEnabled').checked
        });

        return content;
    }

    getTestimonialsFormData() {
        const content = [];
        
        // Section title
        content.push({
            section: 'testimonials',
            key: 'section_title',
            title: document.getElementById('testimonialsTitle').value,
            description: document.getElementById('testimonialsSubtitle').value,
            isActive: document.getElementById('testimonialsEnabled').checked
        });

        // Testimonials
        for (let i = 1; i <= 6; i++) {
            const name = document.getElementById(`testimonial${i}Name`)?.value;
            const handle = document.getElementById(`testimonial${i}Handle`)?.value;
            const text = document.getElementById(`testimonial${i}Text`)?.value;
            const avatar = document.getElementById(`testimonial${i}Avatar`)?.value;

            if (name || handle || text) {
                content.push({
                    section: 'testimonials',
                    key: `testimonial_${i}`,
                    title: name,
                    metadata: handle,
                    description: text,
                    imageUrl: avatar,
                    orderIndex: i,
                    isActive: document.getElementById('testimonialsEnabled').checked
                });
            }
        }

        // Section enabled
        content.push({
            section: 'testimonials',
            key: 'section_enabled',
            isActive: document.getElementById('testimonialsEnabled').checked
        });

        return content;
    }

    getGalleryFormData() {
        const content = [];
        
        // Section title
        content.push({
            section: 'gallery',
            key: 'section_title',
            title: document.getElementById('galleryTitle').value,
            description: document.getElementById('gallerySubtitle').value,
            isActive: document.getElementById('galleryEnabled').checked
        });

        // Gallery items
        for (let i = 1; i <= 6; i++) {
            const title = document.getElementById(`gallery${i}Title`)?.value;
            const description = document.getElementById(`gallery${i}Description`)?.value;
            const image = document.getElementById(`gallery${i}Image`)?.value;

            if (title || description || image) {
                content.push({
                    section: 'gallery',
                    key: `gallery_item_${i}`,
                    title: title,
                    description: description,
                    imageUrl: image,
                    orderIndex: i,
                    isActive: document.getElementById('galleryEnabled').checked
                });
            }
        }

        // Section enabled
        content.push({
            section: 'gallery',
            key: 'section_enabled',
            isActive: document.getElementById('galleryEnabled').checked
        });

        return content;
    }

    getContactFormData() {
        const content = [];
        
        // Section title
        const contactTitleEl = document.getElementById('contactTitle');
        const contactSubtitleEl = document.getElementById('contactSubtitle');
        const contactEnabledEl = document.getElementById('contactEnabled');
        
        content.push({
            section: 'contact',
            key: 'section_title',
            title: contactTitleEl ? contactTitleEl.value : '',
            description: contactSubtitleEl ? contactSubtitleEl.value : '',
            isActive: contactEnabledEl ? contactEnabledEl.checked : true
        });

        // Contact info
        const contactInfo = {
            address: document.getElementById('contactAddress')?.value || '',
            phone: document.getElementById('contactPhone')?.value || '',
            email: document.getElementById('contactEmail')?.value || '',
            hours: document.getElementById('contactHours')?.value || ''
        };

        content.push({
            section: 'contact',
            key: 'contact_info',
            metadata: JSON.stringify(contactInfo),
            isActive: contactEnabledEl ? contactEnabledEl.checked : true
        });

        // Section enabled
        content.push({
            section: 'contact',
            key: 'section_enabled',
            isActive: contactEnabledEl ? contactEnabledEl.checked : true
        });

        return content;
    }

    markFormAsChanged(form) {
        form.classList.add('form-changed');
        
        // Update save button state
        const saveBtn = document.getElementById('saveHomeContentBtn');
        if (saveBtn) {
            saveBtn.classList.add('btn-warning');
            saveBtn.innerHTML = '<i data-lucide="save"></i> Save Changes';
        }
    }

    clearFormChanges() {
        // Remove change indicators
        document.querySelectorAll('.form-changed').forEach(form => {
            form.classList.remove('form-changed');
        });

        // Reset save button
        const saveBtn = document.getElementById('saveHomeContentBtn');
        if (saveBtn) {
            saveBtn.classList.remove('btn-warning');
            saveBtn.innerHTML = '<i data-lucide="save"></i> Save All Changes';
        }
    }

    toggleSection(section, enabled) {

        
        // Update all form fields in this section
        const form = document.getElementById(`${section}Form`);
        if (form) {
            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.disabled = !enabled;
            });
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 16px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
            max-width: 400px;
        `;
        
        notification.innerHTML = `
            <div class="notification-content" style="display: flex; align-items: center; gap: 8px;">
                <i data-lucide="${type === 'success' ? 'check-circle' : type === 'error' ? 'x-circle' : 'info'}" style="width: 20px; height: 20px;"></i>
                <span>${message}</span>
            </div>
        `;

        // Add to page
        document.body.appendChild(notification);

        // Initialize icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 5000);

        // Add click to dismiss
        notification.addEventListener('click', () => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        });
    }
}

// Initialize when DOM is loaded and admin panel is ready

document.addEventListener('DOMContentLoaded', () => {

    
    // Function to initialize homepage admin
    const initializeHomepageAdmin = () => {
        const homeContentSection = document.getElementById('home-content-section');
        if (homeContentSection && !window.homepageAdmin) {

            window.homepageAdmin = new HomepageAdmin();
        } else if (!homeContentSection) {

        } else {

        }
    };
    
    // Try to initialize immediately
    initializeHomepageAdmin();
    
    // Also try to initialize when the home content section becomes visible
    // This handles the case where the section is hidden by default
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const homeContentSection = document.getElementById('home-content-section');
                if (homeContentSection && homeContentSection.classList.contains('active') && !window.homepageAdmin) {

                    window.homepageAdmin = new HomepageAdmin();
                }
            }
        });
    });
    
    // Start observing
    const homeContentSection = document.getElementById('home-content-section');
    if (homeContentSection) {
        observer.observe(homeContentSection, { attributes: true, attributeFilter: ['class'] });
    }
});

// Export for global access
window.HomepageAdmin = HomepageAdmin;
