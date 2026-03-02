class AcademicsLoader {
    constructor() {
        this.content = null;
        this.init();
    }

    async init() {
        await this.loadContent();
        // Populate content into hidden sections FIRST
        this.renderContent();
        // THEN show all sections at once (no flash!)
        this.hideAllLoadingPlaceholders();
    }

    async loadContent() {
        try {
            // Add cache-busting to always get fresh data
            const cacheBuster = `?t=${Date.now()}`;
            const response = await fetch(`/api/content/academics${cacheBuster}`, {
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.success && data.content) {
                this.content = data.content;
                // Debug: Log philosophy highlights data
                if (data.content.academicPhilosophy) {
                    console.log('📊 Academic Philosophy data:', {
                        enabled: data.content.academicPhilosophy.enabled,
                        hasHighlights: !!data.content.academicPhilosophy.highlights,
                        highlightsCount: data.content.academicPhilosophy.highlights?.length || 0,
                        highlights: data.content.academicPhilosophy.highlights
                    });
                }
            } else {
                this.content = null;
                console.warn('⚠️ Failed to load academics content:', data);
            }
        } catch (error) {
            this.content = null;
        }
        
        // DON'T show sections yet - wait until content is populated
    }

    hideAllLoadingPlaceholders() {
        // Hide all section loading placeholders and show dynamic sections
        const sections = ['academic-philosophy', 'curriculum-overview', 'grade-levels', 'teaching-methods', 'beyond-academics', 'academic-achievements', 'cta'];
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

        // Render Academic Philosophy Section
        this.renderAcademicPhilosophySection();
        
        // Render Curriculum Overview Section
        this.renderCurriculumOverviewSection();
        
        // Render Grade Levels Section
        this.renderGradeLevelsSection();
        
        // Render Teaching Methods Section
        this.renderTeachingMethodsSection();
        
        // Render Beyond Academics Section
        this.renderBeyondAcademicsSection();
        
        // Render Academic Achievements Section
        this.renderAcademicAchievementsSection();
        
        // Render CTA Section
        this.renderCTASection();
    }

    renderAcademicPhilosophySection() {
        if (!this.content.academicPhilosophy || !this.content.academicPhilosophy.enabled) return;

        const philosophy = this.content.academicPhilosophy;
        
        // CRITICAL: Target elements in the DYNAMIC section (not loading placeholder)
        const dynamicSection = document.querySelector('#academic-philosophy-dynamic') || document.querySelector('.academic-philosophy-dynamic');
        const philosophyDescription = dynamicSection ? dynamicSection.querySelector('.philosophy-description') : null;
        const philosophyHighlights = dynamicSection ? dynamicSection.querySelector('.philosophy-highlights') : null;
        
        // Clear description immediately
        if (philosophyDescription) {
            philosophyDescription.textContent = '';
        }
        
        // Clear highlights immediately
        if (philosophyHighlights) {
            philosophyHighlights.innerHTML = '';
        }
        
        // NOW update with database content
        // Update section title
        const sectionTitle = dynamicSection ? dynamicSection.querySelector('.section-title') : null;
        if (sectionTitle && philosophy.title) {
            sectionTitle.textContent = philosophy.title;
        }

        // Update philosophy description with database content
        if (philosophyDescription && philosophy.description) {
            philosophyDescription.textContent = philosophy.description;
        }

        // Update philosophy background image
        const philosophyImage = dynamicSection ? dynamicSection.querySelector('.philosophy-image img') : null;
        const imagePlaceholder = dynamicSection ? dynamicSection.querySelector('.philosophy-image .image-placeholder') : null;
        const imageUrl = philosophy.imageUrl || philosophy.backgroundImage;
        
        if (imageUrl && philosophyImage) {
            philosophyImage.src = imageUrl;
            philosophyImage.style.display = 'block';
            if (imagePlaceholder) {
                imagePlaceholder.style.display = 'none';
            }
        } else if (imagePlaceholder) {
            imagePlaceholder.style.display = 'flex';
            if (philosophyImage) {
                philosophyImage.style.display = 'none';
            }
        }

        // Recreate philosophy highlights from database data
        if (philosophy.highlights && philosophy.highlights.length > 0 && philosophyHighlights) {
            console.log('🎨 Rendering', philosophy.highlights.length, 'philosophy highlights');
            philosophy.highlights.forEach((highlight, index) => {
                const highlightItem = document.createElement('div');
                highlightItem.className = 'highlight-item';
                
                highlightItem.innerHTML = `
                    <i data-lucide="${highlight.icon || 'circle'}"></i>
                    <h4>${highlight.title || ''}</h4>
                    <p>${highlight.description || ''}</p>
                `;
                
                philosophyHighlights.appendChild(highlightItem);
            });
            console.log('✅ Highlights rendered in DOM');
        } else {
            console.warn('⚠️ No highlights to render:', {
                hasHighlights: !!philosophy.highlights,
                highlightsLength: philosophy.highlights?.length || 0,
                hasContainer: !!philosophyHighlights
            });
        }
        
        // Reinitialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        // Section already shown by hideAllLoadingPlaceholders()
    }

    renderGradeLevelsSection() {
        if (!this.content.gradeLevels || !this.content.gradeLevels.enabled) return;

        const gradeLevels = this.content.gradeLevels;
        
        // Update section title and subtitle
        const sectionTitle = document.querySelector('.grade-levels .section-title');
        const sectionSubtitle = document.querySelector('.grade-levels .section-subtitle');
        if (sectionTitle && gradeLevels.title) {
            sectionTitle.textContent = gradeLevels.title;
        }
        if (sectionSubtitle && gradeLevels.subtitle) {
            sectionSubtitle.textContent = gradeLevels.subtitle;
        }

        // Dynamically render grade level cards from database
        const gradeLevelsGrid = document.querySelector('#grade-levels-dynamic .grade-levels-grid');
        const programs = gradeLevels.programs || gradeLevels.levels || [];
        
        
        if (gradeLevelsGrid && programs.length > 0) {
            // Clear existing static cards
            gradeLevelsGrid.innerHTML = '';
            
            // Create cards from database data
            programs.forEach((program, index) => {
                const title = program.title || program.name || '';
                const description = program.description || program.content || '';
                const imageUrl = program.imageUrl || program.image || '';
                const features = program.features || [];
                const ageRange = program.age || program.ageRange || '';
                
                
                // Alternate between normal and reverse layout
                const isReverse = index % 2 !== 0;
                
                const card = document.createElement('div');
                card.className = `grade-level-card ${isReverse ? 'reverse' : ''}`;
                card.innerHTML = `
                    <div class="grade-level-image">
                        ${imageUrl ? `
                            <img src="${imageUrl}" alt="${title}" loading="lazy">
                        ` : `
                            <div class="image-placeholder">
                                <i data-lucide="image"></i>
                                <span>No image</span>
                            </div>
                        `}
                    </div>
                    <div class="grade-level-content">
                        <h3>${title}</h3>
                        ${ageRange ? `<p class="age-range">${ageRange}</p>` : ''}
                        <p class="grade-description">${description || ''}</p>
                        ${features.length > 0 ? `
                            <div class="grade-features">
                                ${features.map(feature => `
                                    <div class="feature-item animate-in">
                                        <i data-lucide="check"></i>
                                        <span>${feature}</span>
                                    </div>
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>
                `;
                
                gradeLevelsGrid.appendChild(card);
            });
        } else if (gradeLevelsGrid && programs.length === 0) {
            gradeLevelsGrid.innerHTML = '<div class="empty-state">No grade level programs available</div>';
        }
        
        // Reinitialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        // Section already shown by hideAllLoadingPlaceholders()
    }

    renderBeyondAcademicsSection() {
        if (!this.content.beyondAcademics || !this.content.beyondAcademics.enabled) return;

        const beyondAcademics = this.content.beyondAcademics;
        
        // Update section title and subtitle
        const sectionTitle = document.querySelector('.beyond-academics .section-title');
        const sectionSubtitle = document.querySelector('.beyond-academics .section-subtitle');
        if (sectionTitle && beyondAcademics.title) {
            sectionTitle.textContent = beyondAcademics.title;
        }
        if (sectionSubtitle && beyondAcademics.subtitle) {
            sectionSubtitle.textContent = beyondAcademics.subtitle;
        }

        // Update activity cards
        const activityCards = document.querySelectorAll('.activity-card');
        beyondAcademics.activities.forEach((activity, index) => {
            if (activityCards[index]) {
                const activityTitle = activityCards[index].querySelector('.activity-title');
                const activityDescription = activityCards[index].querySelector('.activity-description');
                const activityIcon = activityCards[index].querySelector('.activity-icon i');
                const activityImage = activityCards[index].querySelector('.activity-image img');
                
                if (activityTitle) activityTitle.textContent = activity.title || activity.name;
                if (activityDescription) activityDescription.textContent = activity.description;
                if (activityIcon && activity.icon) {
                    activityIcon.setAttribute('data-lucide', activity.icon);
                }
                // Support both imageUrl and image field names
                const imageUrl = activity.imageUrl || activity.image;
                if (activityImage && imageUrl) {
                    activityImage.src = imageUrl;
                    activityImage.alt = activity.title || activity.name;
                }
            }
        });
        
        // Reinitialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        // Section already shown by hideAllLoadingPlaceholders()
    }

    renderCTASection() {
        if (!this.content.ctaSection || !this.content.ctaSection.enabled) return;

        const ctaSection = this.content.ctaSection;
        
        // Update section title and description
        const ctaTitle = document.querySelector('#cta-section-dynamic .cta-title');
        const ctaDescription = document.querySelector('#cta-section-dynamic .cta-description');
        
        if (ctaTitle && ctaSection.title) {
            ctaTitle.textContent = ctaSection.title;
        }
        if (ctaDescription && ctaSection.description) {
            ctaDescription.textContent = ctaSection.description;
        }

        // Update CTA buttons
        const ctaButtons = document.querySelector('#cta-section-dynamic .cta-buttons');
        
        if (ctaButtons) {
            // Clear existing buttons
            ctaButtons.innerHTML = '';
            
            // Add primary button (skip Download Curriculum button)
            if (ctaSection.primaryButton) {
                const buttonText = ctaSection.primaryButton.text || '';
                const buttonLink = ctaSection.primaryButton.link || '';
                
                // Skip Download Curriculum button
                if (!buttonText.toLowerCase().includes('download curriculum') && 
                    !buttonLink.toLowerCase().includes('curriculum.pdf')) {
                    const primaryBtn = document.createElement('a');
                    primaryBtn.href = buttonLink || '#';
                    primaryBtn.className = 'btn btn-primary';
                    if (buttonLink && buttonLink.includes('.pdf')) {
                        primaryBtn.setAttribute('download', '');
                    }
                    primaryBtn.innerHTML = `
                        <i data-lucide="download"></i>
                        ${buttonText}
                    `;
                    ctaButtons.appendChild(primaryBtn);
                }
            }
            
            // Add secondary button
            if (ctaSection.secondaryButton) {
                const secondaryBtn = document.createElement('a');
                secondaryBtn.href = ctaSection.secondaryButton.link || '#';
                secondaryBtn.className = 'btn btn-outline';
                secondaryBtn.innerHTML = `
                    <i data-lucide="phone"></i>
                    ${ctaSection.secondaryButton.text}
                `;
                ctaButtons.appendChild(secondaryBtn);
            }
            
            // Add tertiary button
            if (ctaSection.tertiaryButton) {
                const tertiaryBtn = document.createElement('button');
                tertiaryBtn.className = 'btn btn-secondary';
                tertiaryBtn.setAttribute('onclick', ctaSection.tertiaryButton.action || 'openApplicationModal()');
                tertiaryBtn.innerHTML = `
                    <i data-lucide="user-plus"></i>
                    ${ctaSection.tertiaryButton.text}
                `;
                ctaButtons.appendChild(tertiaryBtn);
            }
            
            // Reinitialize Lucide icons
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }
        
        // Section already shown by hideAllLoadingPlaceholders()
    }

    renderCurriculumOverviewSection() {
        if (!this.content.curriculumOverview || !this.content.curriculumOverview.enabled) return;

        const curriculum = this.content.curriculumOverview;
        
        // Update section title and subtitle
        const sectionTitle = document.querySelector('.curriculum-overview-dynamic .section-title');
        const sectionSubtitle = document.querySelector('.curriculum-overview-dynamic .section-subtitle');
        
        if (sectionTitle && curriculum.title) {
            sectionTitle.textContent = curriculum.title;
        }
        if (sectionSubtitle && curriculum.description) {
            sectionSubtitle.textContent = curriculum.description;
        }

        // Dynamically render curriculum cards from database
        const curriculumGrid = document.querySelector('#curriculum-overview-dynamic .curriculum-grid');
        const curriculumItems = curriculum.items || [];
        
        
        if (curriculumGrid && curriculumItems.length > 0) {
            // Clear existing static cards
            curriculumGrid.innerHTML = '';
            
            // Create cards from database data
            curriculumItems.forEach((item, index) => {
                
                const card = document.createElement('div');
                card.className = 'curriculum-card';
                card.innerHTML = `
                    <div class="curriculum-icon">
                        <i data-lucide="${item.icon || 'book'}"></i>
                    </div>
                    <h3>${item.subject || item.title}</h3>
                    <p>${item.description || ''}</p>
                `;
                
                curriculumGrid.appendChild(card);
            });
        } else if (curriculumGrid && curriculumItems.length === 0) {
            curriculumGrid.innerHTML = '<div class="empty-state">No curriculum items available</div>';
        }
        
        // Reinitialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        // Section already shown by hideAllLoadingPlaceholders()
    }

    renderTeachingMethodsSection() {
        if (!this.content.teachingMethods || !this.content.teachingMethods.enabled) return;

        const teachingMethods = this.content.teachingMethods;
        
        // Update section title and subtitle
        const sectionTitle = document.querySelector('#teaching-methods-dynamic .section-title');
        const sectionSubtitle = document.querySelector('#teaching-methods-dynamic .section-subtitle');
        
        if (sectionTitle && teachingMethods.title) {
            sectionTitle.textContent = teachingMethods.title;
        }
        if (sectionSubtitle && teachingMethods.subtitle) {
            sectionSubtitle.textContent = teachingMethods.subtitle;
        }

        // Dynamically render teaching method cards from database
        const methodsGrid = document.querySelector('#teaching-methods-dynamic .methods-grid');
        const methods = teachingMethods.methods || [];
        
        
        if (methodsGrid && methods.length > 0) {
            // Clear existing static cards
            methodsGrid.innerHTML = '';
            
            // Create cards from database data
            methods.forEach((method, index) => {
                
                const card = document.createElement('div');
                card.className = 'method-card';
                card.innerHTML = `
                    <div class="method-icon">
                        <i data-lucide="${method.icon || 'book'}"></i>
                    </div>
                    <h3>${method.title}</h3>
                    <p>${method.description || ''}</p>
                `;
                
                methodsGrid.appendChild(card);
            });
        } else if (methodsGrid && methods.length === 0) {
            methodsGrid.innerHTML = '<div class="empty-state">No teaching methods available</div>';
        }
        
        // Reinitialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        // Section already shown by hideAllLoadingPlaceholders()
    }

    renderAcademicAchievementsSection() {
        if (!this.content.academicAchievements || !this.content.academicAchievements.enabled) {
            // Section already shown by hideAllLoadingPlaceholders() - will show empty state
            return;
        }

        const achievementsSection = this.content.academicAchievements;
        
        // Update section title and subtitle
        const sectionTitle = document.querySelector('#academic-achievements-dynamic .section-title');
        const sectionSubtitle = document.querySelector('#academic-achievements-dynamic .section-subtitle');
        
        if (sectionTitle && achievementsSection.title) {
            sectionTitle.textContent = achievementsSection.title;
        }
        if (sectionSubtitle && achievementsSection.subtitle) {
            sectionSubtitle.textContent = achievementsSection.subtitle;
        }

        // Dynamically render achievement cards from database
        const achievementsGrid = document.querySelector('#academic-achievements-dynamic .achievements-grid');
        let achievementItems = achievementsSection.achievements || [];
        
        console.log('🔍 Raw achievements data:', achievementItems);
        console.log('🔍 Type of achievements:', typeof achievementItems);
        console.log('🔍 Is array?', Array.isArray(achievementItems));
        
        // Safety check: if achievements is a JSON string, parse it
        if (typeof achievementItems === 'string') {
            try {
                achievementItems = JSON.parse(achievementItems);
                console.log('✅ Parsed achievements from string:', achievementItems);
            } catch (e) {
                console.error('❌ Error parsing achievements JSON:', e);
                achievementItems = [];
            }
        }
        
        // Handle edge case: if it's an array with a single string element containing JSON
        if (Array.isArray(achievementItems) && achievementItems.length === 1 && typeof achievementItems[0] === 'string') {
            try {
                const parsed = JSON.parse(achievementItems[0]);
                if (Array.isArray(parsed)) {
                    console.log('✅ Parsed nested JSON string in array:', parsed);
                    achievementItems = parsed;
                }
            } catch (e) {
                console.warn('⚠️ Could not parse nested JSON string:', e);
            }
        }
        
        // Ensure it's an array
        if (!Array.isArray(achievementItems)) {
            console.warn('⚠️ achievements is not an array, converting to empty array');
            achievementItems = [];
        }
        
        console.log('✅ Final achievementItems:', achievementItems);
        console.log('✅ AchievementItems length:', achievementItems.length);
        
        if (achievementsGrid && achievementItems.length > 0) {
            // Clear existing static cards
            achievementsGrid.innerHTML = '';
            
            // Create cards from database data
            achievementItems.forEach((item, index) => {
                // Safety check: ensure item is an object with expected properties
                if (!item || typeof item !== 'object') {
                    console.warn(`⚠️ Skipping invalid achievement item at index ${index}:`, item);
                    return;
                }
                
                console.log(`📝 Creating achievement card ${index}:`, item);
                
                const card = document.createElement('div');
                card.className = 'achievement-card';
                card.innerHTML = `
                    <div class="achievement-icon">
                        <i data-lucide="${item.icon || 'trophy'}"></i>
                    </div>
                    <div class="achievement-number">${item.number || ''}</div>
                    <div class="achievement-label">${item.label || ''}</div>
                `;
                
                achievementsGrid.appendChild(card);
            });
        } else if (achievementsGrid && achievementItems.length === 0) {
            achievementsGrid.innerHTML = '<div class="empty-state">No achievements available</div>';
        }
        
        // Reinitialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        // Section already shown by hideAllLoadingPlaceholders()
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.academicsLoader = new AcademicsLoader();
});
