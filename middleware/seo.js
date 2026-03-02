const { db } = require('../config/database');
const { generateAnalyticsIntegration } = require('./analytics');

/**
 * SEO Middleware for Dynamic Content
 * Generates meta tags, structured data, and SEO elements for dynamic pages
 */

class SEOManager {
    constructor() {
        this.baseUrl = process.env.BASE_URL || 'https://gyanjyotischool.com';
        this.siteName = 'Gyan Jyoti School';
        this.siteDescription = 'Premier educational institution in Nepal offering comprehensive education from pre-primary to secondary levels. Excellence in Education since 1995.';
    }

    /**
     * Generate SEO meta tags for homepage
     */
    async generateHomepageSEO() {
        try {
            const homepageContent = await this.getHomepageContent();
            
            return {
                title: `${this.siteName} - Excellence in Education Since 1995`,
                description: this.siteDescription,
                keywords: 'Gyan Jyoti School, Nepal education, primary school, secondary school, quality education, academic excellence, student development',
                canonical: this.baseUrl,
                ogType: 'website',
                ogImage: homepageContent.hero?.imageUrl || `${this.baseUrl}/images/gyan-jyoti-school-building.jpg`,
                structuredData: this.generateHomepageStructuredData(homepageContent)
            };
        } catch (error) {
            console.error('Error generating homepage SEO:', error);
            return this.getDefaultSEO();
        }
    }

    /**
     * Generate SEO meta tags for events page
     */
    async generateEventsSEO() {
        try {
            const upcomingEvents = await this.getUpcomingEvents();
            const featuredEvent = upcomingEvents[0];

            const title = featuredEvent ? 
                `Events & Notices - ${featuredEvent.title} | ${this.siteName}` :
                `Events & Notices | ${this.siteName}`;

            const description = featuredEvent ?
                `${featuredEvent.description || featuredEvent.content} - Join us for upcoming events at ${this.siteName}` :
                `Stay updated with the latest events, notices, and announcements from ${this.siteName}.`;

            return {
                title,
                description,
                keywords: 'school events, educational events, student activities, school notices, Gyan Jyoti events, Nepal school events',
                canonical: `${this.baseUrl}/events.html`,
                ogType: 'website',
                ogImage: featuredEvent?.imageUrl || `${this.baseUrl}/images/gyan-jyoti-school-building.jpg`,
                structuredData: this.generateEventsStructuredData(upcomingEvents)
            };
        } catch (error) {
            console.error('Error generating events SEO:', error);
            return this.getDefaultSEO('Events & Notices');
        }
    }

    /**
     * Generate SEO meta tags for individual event
     */
    async generateEventDetailSEO(eventId) {
        try {
            const event = await this.getEventById(eventId);
            if (!event) return this.getDefaultSEO();

            const title = `${event.title} | ${this.siteName}`;
            const description = event.description || event.content || `Join us for ${event.title} at ${this.siteName}`;

            return {
                title,
                description,
                keywords: `${event.title}, school event, ${event.category || 'education'}, Gyan Jyoti School, Nepal`,
                canonical: `${this.baseUrl}/eventsDetails.html#${eventId}`,
                ogType: 'event',
                ogImage: event.imageUrl || `${this.baseUrl}/images/gyan-jyoti-school-building.jpg`,
                structuredData: this.generateEventStructuredData(event)
            };
        } catch (error) {
            console.error('Error generating event detail SEO:', error);
            return this.getDefaultSEO();
        }
    }

    /**
     * Generate SEO meta tags for about page
     */
    async generateAboutSEO() {
        try {
            const aboutContent = await this.getAboutContent();

            return {
                title: `About Us - Our Story, Mission & Vision | ${this.siteName}`,
                description: 'Learn about Gyan Jyoti School\'s rich history, educational philosophy, and commitment to excellence in Nepal. Discover our mission, vision, and values.',
                keywords: 'about Gyan Jyoti School, school history, educational philosophy, mission vision, Nepal education, school leadership',
                canonical: `${this.baseUrl}/about.html`,
                ogType: 'website',
                ogImage: `${this.baseUrl}/images/gyan-jyoti-school-building.jpg`,
                structuredData: this.generateAboutStructuredData(aboutContent)
            };
        } catch (error) {
            console.error('Error generating about SEO:', error);
            return this.getDefaultSEO('About Us');
        }
    }

    /**
     * Generate SEO meta tags for academics page
     */
    async generateAcademicsSEO() {
        try {
            const academicsContent = await this.getAcademicsContent();

            return {
                title: `Academic Programs & Curriculum | ${this.siteName}`,
                description: 'Explore our comprehensive academic programs from pre-primary to secondary level. Discover our modern teaching methodologies and holistic approach to education.',
                keywords: 'academic programs, curriculum, teaching methods, pre-primary, primary school, secondary school, Nepal education',
                canonical: `${this.baseUrl}/academics.html`,
                ogType: 'website',
                ogImage: `${this.baseUrl}/images/gyan-jyoti-school-building.jpg`,
                structuredData: this.generateAcademicsStructuredData(academicsContent)
            };
        } catch (error) {
            console.error('Error generating academics SEO:', error);
            return this.getDefaultSEO('Academics');
        }
    }

    /**
     * Generate SEO meta tags for contact page
     */
    async generateContactSEO() {
        try {
            const contactContent = await this.getContactContent();

            return {
                title: `Contact Us - Get in Touch | ${this.siteName}`,
                description: 'Contact Gyan Jyoti School for admissions, inquiries, or any questions about our educational programs. We\'re here to help you.',
                keywords: 'contact Gyan Jyoti School, school admissions, enrollment, Nepal school contact, education inquiry',
                canonical: `${this.baseUrl}/contact.html`,
                ogType: 'website',
                ogImage: `${this.baseUrl}/images/gyan-jyoti-school-building.jpg`,
                structuredData: this.generateContactStructuredData(contactContent)
            };
        } catch (error) {
            console.error('Error generating contact SEO:', error);
            return this.getDefaultSEO('Contact Us');
        }
    }

    /**
     * Generate SEO meta tags for gallery page
     */
    async generateGallerySEO() {
        try {
            const galleryContent = await this.getGalleryContent();

            return {
                title: `Photo Gallery - School Life & Events | ${this.siteName}`,
                description: 'Explore our photo gallery showcasing school events, activities, student life, and memorable moments at Gyan Jyoti School.',
                keywords: 'school gallery, photo gallery, school events, student activities, school life, Nepal school photos',
                canonical: `${this.baseUrl}/gallery.html`,
                ogType: 'website',
                ogImage: galleryContent[0]?.imageUrl || `${this.baseUrl}/images/gyan-jyoti-school-building.jpg`,
                structuredData: this.generateGalleryStructuredData(galleryContent)
            };
        } catch (error) {
            console.error('Error generating gallery SEO:', error);
            return this.getDefaultSEO('Gallery');
        }
    }

    /**
     * Generate default SEO fallback
     */
    getDefaultSEO(pageTitle = '') {
        return {
            title: pageTitle ? `${pageTitle} | ${this.siteName}` : `${this.siteName} - Excellence in Education`,
            description: this.siteDescription,
            keywords: 'Gyan Jyoti School, Nepal education, quality education, academic excellence',
            canonical: this.baseUrl,
            ogType: 'website',
            ogImage: `${this.baseUrl}/images/gyan-jyoti-school-building.jpg`,
            structuredData: this.generateOrganizationStructuredData()
        };
    }

    /**
     * Generate JSON-LD structured data for homepage
     */
    generateHomepageStructuredData(content) {
        const organization = {
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            "name": this.siteName,
            "alternateName": "Gyan Jyoti Education Foundation",
            "description": this.siteDescription,
            "url": this.baseUrl,
            "logo": `${this.baseUrl}/images/gyan-jyoti-school-building.jpg`,
            "image": `${this.baseUrl}/images/gyan-jyoti-school-building.jpg`,
            "address": {
                "@type": "PostalAddress",
                "addressCountry": "NP",
                "addressLocality": "Kathmandu",
                "addressRegion": "Bagmati"
            },
            "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+977-1-4XXXXXX",
                "contactType": "Admissions",
                "email": "info@gyanjyotischool.com"
            },
            "sameAs": [
                "https://www.facebook.com/gyan.joyti.5"
            ],
            "educationalLevel": ["PrePrimary", "Primary", "Secondary"],
            "curriculum": "Nepal National Curriculum",
            "foundingDate": "1995",
            "numberOfStudents": "1000+",
            "numberOfTeachers": "50+"
        };

        return JSON.stringify(organization);
    }

    /**
     * Generate JSON-LD structured data for events
     */
    generateEventsStructuredData(events) {
        const eventItems = events.slice(0, 5).map(event => ({
            "@type": "Event",
            "name": event.title,
            "description": event.description || event.content,
            "startDate": event.eventDate ? new Date(event.eventDate).toISOString() : undefined,
            "eventStatus": "EventScheduled",
            "eventAttendanceMode": "OfflineEventAttendanceMode",
            "location": {
                "@type": "Place",
                "name": event.venue || this.siteName,
                "address": {
                    "@type": "PostalAddress",
                    "addressCountry": "NP",
                    "addressLocality": "Kathmandu"
                }
            },
            "organizer": {
                "@type": "Organization",
                "name": event.organizer || this.siteName
            },
            "image": event.imageUrl
        })).filter(event => event.startDate);

        return JSON.stringify(eventItems);
    }

    /**
     * Generate JSON-LD structured data for individual event
     */
    generateEventStructuredData(event) {
        const eventData = {
            "@context": "https://schema.org",
            "@type": "Event",
            "name": event.title,
            "description": event.description || event.content,
            "startDate": event.eventDate ? new Date(event.eventDate).toISOString() : undefined,
            "eventStatus": "EventScheduled",
            "eventAttendanceMode": "OfflineEventAttendanceMode",
            "location": {
                "@type": "Place",
                "name": event.venue || this.siteName,
                "address": {
                    "@type": "PostalAddress",
                    "addressCountry": "NP",
                    "addressLocality": "Kathmandu"
                }
            },
            "organizer": {
                "@type": "Organization",
                "name": event.organizer || this.siteName,
                "url": this.baseUrl
            },
            "image": event.imageUrl,
            "offers": event.registrationEnabled ? {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "NPR",
                "availability": "InStock"
            } : undefined
        };

        return JSON.stringify(eventData);
    }

    /**
     * Generate JSON-LD structured data for about page
     */
    generateAboutStructuredData(content) {
        return this.generateOrganizationStructuredData();
    }

    /**
     * Generate JSON-LD structured data for academics page
     */
    generateAcademicsStructuredData(content) {
        return this.generateOrganizationStructuredData();
    }

    /**
     * Generate JSON-LD structured data for contact page
     */
    generateContactStructuredData(content) {
        return this.generateOrganizationStructuredData();
    }

    /**
     * Generate JSON-LD structured data for gallery page
     */
    generateGalleryStructuredData(content) {
        return this.generateOrganizationStructuredData();
    }

    /**
     * Generate organization structured data
     */
    generateOrganizationStructuredData() {
        const organization = {
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            "name": this.siteName,
            "alternateName": "Gyan Jyoti Education Foundation",
            "description": this.siteDescription,
            "url": this.baseUrl,
            "logo": `${this.baseUrl}/images/gyan-jyoti-school-building.jpg`,
            "image": `${this.baseUrl}/images/gyan-jyoti-school-building.jpg`,
            "address": {
                "@type": "PostalAddress",
                "addressCountry": "NP",
                "addressLocality": "Kathmandu",
                "addressRegion": "Bagmati"
            },
            "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+977-1-4XXXXXX",
                "contactType": "General",
                "email": "info@gyanjyotischool.com"
            },
            "sameAs": [
                "https://www.facebook.com/gyan.joyti.5"
            ]
        };

        return JSON.stringify(organization);
    }

    // Database query methods
    async getHomepageContent() {
        const content = await db.homepageContent.findAll({ isActive: true });
        return this.organizeContentBySection(content);
    }

    async getUpcomingEvents() {
        const allEvents = await db.eventsContent.findAll({ 
            section: 'upcoming_events',
            isActive: true 
        });
        // Filter future events and limit to 10
        const upcomingEvents = allEvents
            .filter(event => event.eventDate && new Date(event.eventDate) >= new Date())
            .sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate))
            .slice(0, 10);
        return upcomingEvents;
    }

    async getEventById(eventId) {
        return await db.eventsContent.findById(eventId);
    }

    async getAboutContent() {
        const content = await db.aboutContent.findAll({ isActive: true });
        return this.organizeContentBySection(content);
    }

    async getAcademicsContent() {
        const content = await db.academicsContent.findAll({ isActive: true });
        return this.organizeContentBySection(content);
    }

    async getContactContent() {
        const content = await db.contactContent.findAll({ isActive: true });
        return this.organizeContentBySection(content);
    }

    async getGalleryContent() {
        const allGallery = await db.gallery.findAll({ isActive: true });
        // Sort by orderIndex and limit to 12
        return allGallery
            .sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0))
            .slice(0, 12);
    }

    organizeContentBySection(content) {
        const organized = {};
        content.forEach(item => {
            if (!organized[item.section]) {
                organized[item.section] = {};
            }
            organized[item.section][item.key] = item;
        });
        return organized;
    }
}

/**
 * Middleware to inject SEO meta tags into HTML
 */
function injectSEOMiddleware(pageType) {
    return async (req, res, next) => {
        try {
            const seoManager = new SEOManager();
            let seoData;

            switch (pageType) {
                case 'homepage':
                    seoData = await seoManager.generateHomepageSEO();
                    break;
                case 'events':
                    seoData = await seoManager.generateEventsSEO();
                    break;
                case 'event-detail':
                    const eventId = req.params.id || req.query.id;
                    seoData = await seoManager.generateEventDetailSEO(eventId);
                    break;
                case 'about':
                    seoData = await seoManager.generateAboutSEO();
                    break;
                case 'academics':
                    seoData = await seoManager.generateAcademicsSEO();
                    break;
                case 'contact':
                    seoData = await seoManager.generateContactSEO();
                    break;
                case 'gallery':
                    seoData = await seoManager.generateGallerySEO();
                    break;
                default:
                    seoData = seoManager.getDefaultSEO();
            }

            req.seoData = seoData;
            next();
        } catch (error) {
            console.error('SEO middleware error:', error);
            req.seoData = new SEOManager().getDefaultSEO();
            next();
        }
    };
}

/**
 * Function to generate HTML meta tags from SEO data
 */
function generateMetaTags(seoData) {
    const analyticsCode = generateAnalyticsIntegration();
    
    return `
        <title>${seoData.title}</title>
        <meta name="description" content="${seoData.description}">
        <meta name="keywords" content="${seoData.keywords}">
        <link rel="canonical" href="${seoData.canonical}">
        
        <!-- Open Graph Meta Tags -->
        <meta property="og:title" content="${seoData.title}">
        <meta property="og:description" content="${seoData.description}">
        <meta property="og:type" content="${seoData.ogType}">
        <meta property="og:url" content="${seoData.canonical}">
        <meta property="og:image" content="${seoData.ogImage}">
        <meta property="og:site_name" content="Gyan Jyoti School">
        <meta property="og:locale" content="en_US">
        
        <!-- Twitter Card Meta Tags -->
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="${seoData.title}">
        <meta name="twitter:description" content="${seoData.description}">
        <meta name="twitter:image" content="${seoData.ogImage}">
        <meta name="twitter:site" content="@gyanjyotischool">
        
        <!-- Additional SEO Meta Tags -->
        <meta name="robots" content="index, follow">
        <meta name="author" content="Gyan Jyoti School">
        <meta name="publisher" content="Gyan Jyoti Education Foundation">
        <meta name="language" content="en">
        <meta name="geo.region" content="NP">
        <meta name="geo.placename" content="Kathmandu">
        <meta name="geo.position" content="27.7172;85.3240">
        <meta name="ICBM" content="27.7172, 85.3240">
        
        <!-- JSON-LD Structured Data -->
        <script type="application/ld+json">
            ${seoData.structuredData}
        </script>
        
        <!-- Google Analytics and Search Console -->
        ${analyticsCode}
    `;
}

module.exports = {
    SEOManager,
    injectSEOMiddleware,
    generateMetaTags
};
