class ContactLoader {
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
            const response = await fetch(`/api/content/contact${cacheBuster}`, {
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
            } else {
                this.content = null;
            }
        } catch (error) {
            this.content = null;
        }
        
        // DON'T show sections yet - wait until content is populated
    }

    hideAllLoadingPlaceholders() {
        // Hide all section loading placeholders
        const sections = ['contact-main', 'location-section', 'faq-section', 'social-media', 'cta-section'];
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

        // Render Contact Main Section
        this.renderContactMainSection();
        
        // Render Location Section
        this.renderLocationSection();
        
        // Render FAQ Section
        this.renderFAQSection();
        
        // Render Social Media Section
        this.renderSocialMediaSection();
        
        // Render CTA Section
        this.renderCTASection();
        
        // Initialize FAQ functionality after content is rendered
        this.initializeFAQFunctions();
    }

    renderContactMainSection() {
        if (!this.content.contactMain || !this.content.contactMain.enabled) {
            return;
        }

        const contactMain = this.content.contactMain;
        
        // Update section title and subtitle (matching actual HTML structure)
        const sectionTitle = document.querySelector('.contact-main-dynamic h2');
        const sectionDescription = document.querySelector('.contact-main-dynamic .contact-info-content p');
        
        if (sectionTitle && contactMain.title) {
            sectionTitle.textContent = contactMain.title;
        }
        if (sectionDescription && contactMain.description) {
            sectionDescription.textContent = contactMain.description;
        }

        // Update contact info (matching actual HTML structure)
        if (contactMain.contactInfo) {
            const emailItem = document.querySelector('.contact-detail-item:nth-child(1) .support-link');
            const phoneItem = document.querySelector('.contact-detail-item:nth-child(2) .support-link');
            const supportItem = document.querySelector('.contact-detail-item:nth-child(3) .support-link');
            
            if (emailItem && contactMain.contactInfo.email) {
                emailItem.textContent = contactMain.contactInfo.email;
                emailItem.setAttribute('href', `mailto:${contactMain.contactInfo.email}`);
            }
            if (phoneItem && contactMain.contactInfo.phone) {
                phoneItem.textContent = contactMain.contactInfo.phone;
                phoneItem.setAttribute('href', `tel:${contactMain.contactInfo.phone}`);
            }
            if (supportItem && contactMain.contactInfo.supportEmail) {
                supportItem.textContent = contactMain.contactInfo.supportEmail;
                supportItem.setAttribute('href', `mailto:${contactMain.contactInfo.supportEmail}`);
            }
        }
    }

    renderLocationSection() {
        if (!this.content.locationSection || !this.content.locationSection.enabled) return;

        const locationSection = this.content.locationSection;
        
        // Update section title and subtitle (matching actual HTML structure)
        const sectionTitle = document.querySelector('.location-section-dynamic h2');
        const sectionSubtitle = document.querySelector('.location-section-dynamic .location-subtitle');
        
        if (sectionTitle && locationSection.title) {
            sectionTitle.textContent = locationSection.title;
        }
        if (sectionSubtitle && locationSection.subtitle) {
            sectionSubtitle.textContent = locationSection.subtitle;
        }

        // Update headquarters information
        if (locationSection.headquarters) {
            const orgName = document.querySelector('.location-section-dynamic .address-details p:first-child strong');
            const city = document.querySelector('.location-section-dynamic .address-details p:nth-child(2)');
            const streetAddress = document.querySelector('.location-section-dynamic .address-details p:nth-child(3)');
            const postalCode = document.querySelector('.location-section-dynamic .address-details p:nth-child(4)');
            const country = document.querySelector('.location-section-dynamic .address-details p:nth-child(5)');
            
            if (orgName && locationSection.headquarters.organizationName) {
                orgName.textContent = locationSection.headquarters.organizationName;
            }
            if (city && locationSection.headquarters.city) {
                city.textContent = locationSection.headquarters.city;
            }
            if (streetAddress && locationSection.headquarters.streetAddress) {
                streetAddress.textContent = locationSection.headquarters.streetAddress;
            }
            if (postalCode && locationSection.headquarters.postalCode) {
                postalCode.textContent = locationSection.headquarters.postalCode;
            }
            if (country && locationSection.headquarters.country) {
                country.textContent = locationSection.headquarters.country;
            }
        }

        // Update map iframe if provided
        if (locationSection.maps && locationSection.maps.embedUrl) {
            const mapIframe = document.querySelector('.location-section-dynamic iframe');
            if (mapIframe) {
                mapIframe.setAttribute('src', locationSection.maps.embedUrl);
            }
            
            const mapLink = document.querySelector('.location-section-dynamic .map-overlay a');
            if (mapLink && locationSection.maps.directUrl) {
                mapLink.setAttribute('href', locationSection.maps.directUrl);
            }
        }
    }

    renderFAQSection() {
        if (!this.content.faqSection || !this.content.faqSection.enabled) return;

        const faqSection = this.content.faqSection;
        
        // Update section title and subtitle (matching actual HTML structure)
        const sectionTitle = document.querySelector('.faq-section-dynamic .faq-title');
        const sectionSubtitle = document.querySelector('.faq-section-dynamic .faq-subtitle');
        if (sectionTitle && faqSection.title) {
            sectionTitle.textContent = faqSection.title;
        }
        if (sectionSubtitle && faqSection.subtitle) {
            sectionSubtitle.textContent = faqSection.subtitle;
        }

        // Update FAQ items with show more functionality
        if (faqSection.faqs && Array.isArray(faqSection.faqs)) {
            this.renderFAQItemsWithShowMore(faqSection.faqs);
        }
    }

    renderFAQItemsWithShowMore(faqs) {
        const faqQuestionsContainer = document.querySelector('.faq-section-dynamic .faq-questions');
        if (!faqQuestionsContainer) {
            return;
        }

        // Clear existing content
        faqQuestionsContainer.innerHTML = '';

        // Show only first 6 FAQs initially
        const initialCount = 6;
        const hasMoreFAQs = faqs.length > initialCount;

        // Render all FAQ items
        faqs.forEach((faq, index) => {
            const faqItem = document.createElement('div');
            faqItem.className = 'faq-item';
            faqItem.setAttribute('tabindex', '0');
            
            // Hide items beyond the initial count
            if (index >= initialCount) {
                faqItem.style.display = 'none';
                faqItem.classList.add('faq-item-hidden');
            }

            faqItem.innerHTML = `
                <div class="faq-question">
                    <h4>${faq.question || ''}</h4>
                    <i data-lucide="chevron-down"></i>
                </div>
                <div class="faq-answer">
                    <p>${faq.answer || ''}</p>
                </div>
            `;

            faqQuestionsContainer.appendChild(faqItem);
        });

        // Add "See More" button if there are more FAQs
        if (hasMoreFAQs) {
            const seeMoreButton = document.createElement('div');
            seeMoreButton.className = 'faq-see-more-container';
            seeMoreButton.innerHTML = `
                <button class="btn btn-outline faq-see-more-btn" data-action="show-more">
                    <span class="btn-text">See More Questions</span>
                    <i data-lucide="chevron-down" class="btn-icon"></i>
                </button>
            `;
            faqQuestionsContainer.appendChild(seeMoreButton);

            // Add event listener for see more button
            const btn = seeMoreButton.querySelector('.faq-see-more-btn');
            btn.addEventListener('click', () => {
                this.toggleFAQShowMore(btn, faqs, initialCount);
            });
        }

        // Re-initialize Lucide icons for new elements
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        // Set up FAQ accordion functionality for the newly rendered items
        setTimeout(() => {
            this.setupFAQAccordion();
        }, 100);
    }

    toggleFAQShowMore(button, faqs, initialCount) {
        const hiddenItems = document.querySelectorAll('.faq-section-dynamic .faq-item-hidden');
        const btnText = button.querySelector('.btn-text');
        const btnIcon = button.querySelector('.btn-icon');
        const isShowingMore = hiddenItems[0] && hiddenItems[0].style.display !== 'none';

        if (isShowingMore) {
            // Hide additional FAQs
            hiddenItems.forEach(item => {
                item.style.display = 'none';
            });
            btnText.textContent = 'See More Questions';
            btnIcon.style.transform = 'rotate(0deg)';
        } else {
            // Show additional FAQs
            hiddenItems.forEach(item => {
                item.style.display = 'block';
            });
            btnText.textContent = 'See Less Questions';
            btnIcon.style.transform = 'rotate(180deg)';
        }
    }

    renderSocialMediaSection() {
        if (!this.content.socialMedia || !this.content.socialMedia.enabled) {
            return;
        }

        const socialMedia = this.content.socialMedia;
        
        // Update section title and subtitle (matching actual HTML structure)
        const sectionTitle = document.querySelector('.social-media-dynamic .section-title');
        const sectionSubtitle = document.querySelector('.social-media-dynamic .section-subtitle');
        if (sectionTitle && socialMedia.title) {
            sectionTitle.textContent = socialMedia.title;
        }
        if (sectionSubtitle && socialMedia.subtitle) {
            sectionSubtitle.textContent = socialMedia.subtitle;
        }

        // Update social media cards (matching actual HTML structure)
        const socialCards = document.querySelectorAll('.social-media-dynamic .social-card');
        if (socialMedia.links && Array.isArray(socialMedia.links)) {
        socialMedia.links.forEach((link, index) => {
                if (socialCards[index]) {
                    const card = socialCards[index];
                    const icon = card.querySelector('i');
                    const title = card.querySelector('h3');
                    const description = card.querySelector('p');
                    
                if (link.url) {
                        card.setAttribute('href', link.url);
                        card.setAttribute('target', '_blank');
                }
                if (icon && link.icon) {
                    icon.setAttribute('data-lucide', link.icon);
                }
                    if (title && link.platform) {
                        title.textContent = link.platform;
                    }
                    if (description && link.description) {
                        description.textContent = link.description;
                    }
                    card.setAttribute('aria-label', link.platform || link.description);
                }
            });
        }
    }

    renderCTASection() {
        if (!this.content.ctaSection || !this.content.ctaSection.enabled) {
            return;
        }

        const ctaSection = this.content.ctaSection;
        
        // Update section title (matching actual HTML structure)
        const sectionTitle = document.querySelector('.cta-section-dynamic h2');
        if (sectionTitle && ctaSection.title) {
            sectionTitle.textContent = ctaSection.title;
        }

        // Update CTA buttons (matching actual HTML structure)
        const primaryButton = document.querySelector('.cta-section-dynamic .btn-primary');
        const secondaryButton = document.querySelector('.cta-section-dynamic .btn-outline');
        
        if (primaryButton && ctaSection.primaryButton) {
            primaryButton.textContent = ctaSection.primaryButton.text;
            if (ctaSection.primaryButton.link) {
                primaryButton.setAttribute('href', ctaSection.primaryButton.link);
            }
        }
        
        if (secondaryButton && ctaSection.secondaryButton) {
            secondaryButton.textContent = ctaSection.secondaryButton.text;
            if (ctaSection.secondaryButton.link) {
                secondaryButton.setAttribute('href', ctaSection.secondaryButton.link);
            }
        }
    }

    initializeFAQFunctions() {
        // FAQ accordion functionality is now set up after content rendering
        // Re-initialize Lucide icons for any new icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    setupFAQAccordion() {
        // Get all FAQ items and add click events directly to them
        const faqItems = document.querySelectorAll('.faq-section-dynamic .faq-item');
        
        if (faqItems.length === 0) {
            return;
        }

        faqItems.forEach((faqItem) => {
            faqItem.addEventListener('click', (e) => {
                e.preventDefault();
                
                const answer = faqItem.querySelector('.faq-answer');
                const icon = faqItem.querySelector('.faq-question svg[data-lucide="chevron-down"]');
                
                if (answer && icon) {
                    // Toggle FAQ item
                    const isActive = faqItem.classList.contains('active');
                    
                    // Close all other items first
                    const allFaqItems = document.querySelectorAll('.faq-section-dynamic .faq-item');
                    allFaqItems.forEach((otherItem) => {
                        if (otherItem !== faqItem && otherItem.classList.contains('active')) {
                            otherItem.classList.remove('active');
                            const otherAnswer = otherItem.querySelector('.faq-answer');
                            const otherIcon = otherItem.querySelector('.faq-question svg[data-lucide="chevron-down"]');
                            if (otherAnswer && otherIcon) {
                                otherAnswer.style.maxHeight = '0';
                                otherIcon.style.transform = 'rotate(0deg)';
                            }
                        }
                    });
                    
                    // Toggle current item
                    if (isActive) {
                        faqItem.classList.remove('active');
                        answer.style.maxHeight = '0';
                        icon.style.transform = 'rotate(0deg)';
                    } else {
                        faqItem.classList.add('active');
                        answer.style.maxHeight = answer.scrollHeight + 'px';
                        icon.style.transform = 'rotate(45deg)';
                    }
                }
            });
        });
        
        // Direct events are working, no need for fallback delegation
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.contactLoader = new ContactLoader();
});
