// Footer Component

class FooterComponent {
    constructor() {
        this.footerData = {
            logo: {
                text: 'Marigold Education Foundation'
            },
            description: 'Empowering minds and building futures through excellence in education since 1995.',
            socialLinks: [
                { icon: 'facebook', url: '#', label: 'Facebook' },
                { icon: 'instagram', url: '#', label: 'Instagram' },
                { icon: 'twitter', url: '#', label: 'Twitter' },
                { icon: 'youtube', url: '#', label: 'YouTube' }
            ],
            quickLinks: [
                { text: 'Home', url: '/' },
                { text: 'About Us', url: '/about.html' },
                { text: 'Academics', url: '/academics.html' },
                { text: 'Events', url: '/events.html' },
                { text: 'Gallery', url: '/gallery.html' },
                { text: 'Contact', url: '/contact.html' }
            ],
            contactInfo: [
                { icon: 'map-pin', text: '123 Education Street, Kathmandu, Nepal 44600' },
                { icon: 'phone', text: '+977-1-4XXXXXX' },
                { icon: 'mail', text: 'info@marigoldebs.edu.np' },
                { icon: 'clock', text: 'Mon - Fri: 9:00 AM - 4:00 PM' }
            ],
            copyright: '© 2024 Marigold Education Foundation. All rights reserved.',
            bottomLinks: [
                { text: 'Privacy Policy', url: '#' },
                { text: 'Terms of Service', url: '#' },
                { text: 'Sitemap', url: '#' }
            ]
        };
        
        this.init();
    }

    async init() {
        await this.loadSchoolSettings();
        await this.loadContactContent();
        this.render();
        this.setupEventListeners();
        this.setupBackToTop();
    }

    async loadSchoolSettings() {
        try {
            // console.log('🔍 Loading school settings for footer...');
            const response = await fetch('/api/school-settings');
            const data = await response.json();
            
            if (data.success) {
                // console.log('✅ School settings loaded:', data);
                
                // Update footer data with school settings
                if (data.schoolName) {
                    this.footerData.logo.text = data.schoolName;
                }
                if (data.schoolDescription) {
                    this.footerData.description = data.schoolDescription;
                }
                
                // Update contact info if available
                if (data.mainContactEmail) {
                    this.footerData.contactInfo = this.footerData.contactInfo.map(contact => {
                        if (contact.icon === 'mail') {
                            return { ...contact, text: data.mainContactEmail };
                        }
                        return contact;
                    });
                }
                
                if (data.mainContactPhone) {
                    this.footerData.contactInfo = this.footerData.contactInfo.map(contact => {
                        if (contact.icon === 'phone') {
                            return { ...contact, text: data.mainContactPhone };
                        }
                        return contact;
                    });
                }
                
                if (data.schoolAddress) {
                    this.footerData.contactInfo = this.footerData.contactInfo.map(contact => {
                        if (contact.icon === 'map-pin') {
                            return { ...contact, text: data.schoolAddress };
                        }
                        return contact;
                    });
                }
                
                // Update copyright with school name
                if (data.schoolName) {
                    this.footerData.copyright = `© 2024 ${data.schoolName}. All rights reserved.`;
                }
                
                // Social links will be updated in loadContactContent method
                
                // console.log('📝 Updated footer data:', this.footerData);
            } else {
                console.warn('⚠️ Failed to load school settings, using defaults');
            }
        } catch (error) {
            console.error('❌ Error loading school settings:', error);
            console.warn('⚠️ Using default footer data');
        }
    }

    async loadContactContent() {
        try {
            // console.log('🔍 Loading contact content for footer...');
            const response = await fetch('/api/contact-content');
            const data = await response.json();
            
            if (data.success && data.contactInfo) {
                // console.log('✅ Contact content loaded:', data.contactInfo);
                
                // Update contact info with data from ContactContent table
                const contactInfo = data.contactInfo;
                
                // Update email
                if (contactInfo.email && contactInfo.email.content) {
                    this.footerData.contactInfo = this.footerData.contactInfo.map(contact => {
                        if (contact.icon === 'mail') {
                            return { 
                                ...contact, 
                                text: contactInfo.email.content,
                                linkUrl: contactInfo.email.linkUrl || `mailto:${contactInfo.email.content}`
                            };
                        }
                        return contact;
                    });
                }
                
                // Update phone
                if (contactInfo.phone && contactInfo.phone.content) {
                    this.footerData.contactInfo = this.footerData.contactInfo.map(contact => {
                        if (contact.icon === 'phone') {
                            return { 
                                ...contact, 
                                text: contactInfo.phone.content,
                                linkUrl: contactInfo.phone.linkUrl || `tel:${contactInfo.phone.content}`
                            };
                        }
                        return contact;
                    });
                }
                
                // Update address
                if (contactInfo.address && contactInfo.address.content) {
                    this.footerData.contactInfo = this.footerData.contactInfo.map(contact => {
                        if (contact.icon === 'map-pin') {
                            return { 
                                ...contact, 
                                text: contactInfo.address.content
                            };
                        }
                        return contact;
                    });
                }
                
                // Update hours
                if (contactInfo.hours && contactInfo.hours.content) {
                    this.footerData.contactInfo = this.footerData.contactInfo.map(contact => {
                        if (contact.icon === 'clock') {
                            return { 
                                ...contact, 
                                text: contactInfo.hours.content
                            };
                        }
                        return contact;
                    });
                }
                
                // Update social media links
                if (contactInfo.socialMedia) {
                    this.footerData.socialLinks = this.footerData.socialLinks.map(link => {
                        const socialMedia = contactInfo.socialMedia;
                        
                        switch (link.icon) {
                            case 'facebook':
                                if (socialMedia.facebook && socialMedia.facebook.linkUrl) {
                                    return { ...link, url: socialMedia.facebook.linkUrl };
                                }
                                break;
                            case 'instagram':
                                if (socialMedia.instagram && socialMedia.instagram.linkUrl) {
                                    return { ...link, url: socialMedia.instagram.linkUrl };
                                }
                                break;
                            case 'twitter':
                                if (socialMedia.twitter && socialMedia.twitter.linkUrl) {
                                    return { ...link, url: socialMedia.twitter.linkUrl };
                                }
                                break;
                            case 'youtube':
                                if (socialMedia.youtube && socialMedia.youtube.linkUrl) {
                                    return { ...link, url: socialMedia.youtube.linkUrl };
                                }
                                break;
                        }
                        return link;
                    });
                }
                
                // console.log('📝 Updated contact info from ContactContent:', this.footerData.contactInfo);
                // console.log('📝 Updated social links from ContactContent:', this.footerData.socialLinks);
            } else {
                console.warn('⚠️ Failed to load contact content, using defaults');
            }
        } catch (error) {
            console.error('❌ Error loading contact content:', error);
            console.warn('⚠️ Using default contact data');
        }
    }

    render() {
        const footerContainer = document.querySelector('.footer');
        if (!footerContainer) {
            console.error('❌ Footer container not found!');
            return;
        }
        
        // console.log('🎨 Rendering footer with data:', this.footerData.contactInfo);
        
        footerContainer.innerHTML = `
            <div class="container">
                <div class="footer-content">
                    <div class="footer-section logo-container">
                        <div class="footer-logo">
                            <span>${this.footerData.logo.text}</span>
                        </div>
                        <p>${this.footerData.description}</p>
                        <div class="social-links">
                            ${this.footerData.socialLinks.map(link => `
                                <a href="${link.url}" target="_blank" aria-label="${link.label}">
                                    <i data-lucide="${link.icon}"></i>
                                </a>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="footer-section">
                        <h4>Quick Links</h4>
                        <ul class="footer-links">
                            ${this.footerData.quickLinks.map(link => `
                                <li><a href="${link.url}">${link.text}</a></li>
                            `).join('')}
                        </ul>
                    </div>
                    
                    <div class="footer-section">
                        <h4>Contact Info</h4>
                        <ul class="footer-contact">
                            ${this.footerData.contactInfo.map(contact => `
                                <li>
                                    <i data-lucide="${contact.icon}"></i>
                                    ${contact.linkUrl ? `<a href="${contact.linkUrl}" target="_blank" rel="noopener">${contact.text}</a>` : `<span>${contact.text}</span>`}
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                    
                    <div class="footer-section newsletter-container">
                        <h4>Newsletter</h4>
                        <p>Subscribe to our newsletter for updates and news.</p>
                        <form class="newsletter-form" id="newsletter-form">
                            <input type="email" placeholder="Enter your email" required>
                            <button type="submit">
                                <i data-lucide="send"></i>
                            </button>
                        </form>
                    </div>
                </div>
                
                <div class="footer-bottom">
                    <div class="footer-bottom-content">
                        <p>${this.footerData.copyright}</p>
                        <div class="footer-bottom-links">
                            ${this.footerData.bottomLinks.map(link => `
                                <a href="${link.url}">${link.text}</a>
                            `).join('')}
                        </div>
                    </div>
                    <div class="footer-credit">
                        Built by <a href="https://safaloli.com.np" target="_blank" rel="noopener noreferrer">Safal Oli</a>
                    </div>
                </div>
            </div>
            
        `;

        // Initialize Lucide icons for the footer
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        } else {
            console.warn('Lucide not available for footer icons');
        }
    }

    setupEventListeners() {
        // Newsletter form submission
        const newsletterForm = document.getElementById('newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleNewsletterSubmit(e);
            });
        }

        // Social links click tracking
        const socialLinks = document.querySelectorAll('.social-links a');
        socialLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                this.trackSocialClick(e.target.closest('a').getAttribute('aria-label'));
            });
        });

        // Footer links click tracking
        const footerLinks = document.querySelectorAll('.footer-links a, .footer-bottom-links a');
        footerLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                this.trackFooterLinkClick(e.target.textContent);
            });
        });
    }

    setupBackToTop() {
        const backToTopBtn = document.getElementById('back-to-top');
        if (!backToTopBtn) return;

        // Show/hide back to top button based on scroll position
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        // Smooth scroll to top when clicked
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    handleNewsletterSubmit(e) {
        const form = e.target;
        const emailInput = form.querySelector('input[type="email"]');
        const submitBtn = form.querySelector('button[type="submit"]');
        const email = emailInput.value.trim();

        if (!email || !this.isValidEmail(email)) {
            this.showToast('Please enter a valid email address.', 'error');
            return;
        }

        // Show loading state
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i data-lucide="loader-2" class="animate-spin"></i>';
        submitBtn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            this.showToast('Thank you for subscribing to our newsletter!', 'success');
            form.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            // Reinitialize icons
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }, 2000);
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showToast(message, type = 'info') {
        if (typeof showToast === 'function') {
            showToast(message, type);
        } else {
        }
    }

    trackSocialClick(platform) {
        // Add analytics tracking here
    }

    trackFooterLinkClick(linkText) {
        // Add analytics tracking here
    }

    // Method to update footer data dynamically
    updateFooterData(newData) {
        this.footerData = { ...this.footerData, ...newData };
        this.render();
        this.setupEventListeners();
    }

    // Method to get current footer data
    getFooterData() {
        return this.footerData;
    }
}

// Initialize footer when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.footerComponent = new FooterComponent();
});

// Also try to initialize if DOM is already loaded
if (document.readyState === 'loading') {
} else {
    window.footerComponent = new FooterComponent();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FooterComponent;
}
