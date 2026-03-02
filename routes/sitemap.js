const express = require('express');
const router = express.Router();
const { db } = require('../config/database');

/**
 * Dynamic Sitemap Generator
 * Generates XML sitemap for all dynamic content
 */

// Generate sitemap.xml
router.get('/sitemap.xml', async (req, res) => {
    try {
        const baseUrl = process.env.BASE_URL || 'https://marigoldebs.edu.np';
        const lastmod = new Date().toISOString().split('T')[0]; // Today's date in YYYY-MM-DD format

        // Static pages
        const staticPages = [
            {
                url: baseUrl,
                lastmod,
                changefreq: 'weekly',
                priority: '1.0'
            },
            {
                url: `${baseUrl}/about.html`,
                lastmod,
                changefreq: 'monthly',
                priority: '0.8'
            },
            {
                url: `${baseUrl}/academics.html`,
                lastmod,
                changefreq: 'monthly',
                priority: '0.8'
            },
            {
                url: `${baseUrl}/contact.html`,
                lastmod,
                changefreq: 'monthly',
                priority: '0.8'
            },
            {
                url: `${baseUrl}/gallery.html`,
                lastmod,
                changefreq: 'weekly',
                priority: '0.7'
            },
            {
                url: `${baseUrl}/events.html`,
                lastmod,
                changefreq: 'weekly',
                priority: '0.8'
            }
        ];

        // Get dynamic content
        const [events, galleryItems, blogPosts] = await Promise.all([
            // Get all active events and notices
            db.eventsContent.findMany({
                where: { isActive: true },
                select: {
                    id: true,
                    title: true,
                    section: true,
                    updatedAt: true,
                    eventDate: true
                },
                orderBy: { updatedAt: 'desc' }
            }),
            
            // Get featured gallery items
            db.gallery.findMany({
                where: { 
                    isActive: true,
                    isFeatured: true 
                },
                select: {
                    id: true,
                    title: true,
                    updatedAt: true
                },
                orderBy: { updatedAt: 'desc' },
                take: 20
            }),
            
            // Get published blog posts
            db.blogs.findMany({
                where: { status: 'PUBLISHED' },
                select: {
                    id: true,
                    title: true,
                    updatedAt: true,
                    publishedAt: true
                },
                orderBy: { updatedAt: 'desc' },
                take: 50
            })
        ]);

        // Build dynamic pages
        const dynamicPages = [];

        // Add events and notices
        events.forEach(event => {
            if (event.section === 'upcoming_events' || event.section === 'past_events') {
                const eventLastmod = event.eventDate ? 
                    new Date(event.eventDate).toISOString().split('T')[0] :
                    new Date(event.updatedAt).toISOString().split('T')[0];
                
                dynamicPages.push({
                    url: `${baseUrl}/eventsDetails.html#${event.id}`,
                    lastmod: eventLastmod,
                    changefreq: 'monthly',
                    priority: '0.6'
                });
            } else if (event.section === 'notices') {
                dynamicPages.push({
                    url: `${baseUrl}/noticeDetails.html#${event.id}`,
                    lastmod: new Date(event.updatedAt).toISOString().split('T')[0],
                    changefreq: 'weekly',
                    priority: '0.7'
                });
            }
        });

        // Add gallery items
        galleryItems.forEach(item => {
            dynamicPages.push({
                url: `${baseUrl}/gallery.html#${item.id}`,
                lastmod: new Date(item.updatedAt).toISOString().split('T')[0],
                changefreq: 'monthly',
                priority: '0.5'
            });
        });

        // Add blog posts
        blogPosts.forEach(post => {
            const postLastmod = post.publishedAt ? 
                new Date(post.publishedAt).toISOString().split('T')[0] :
                new Date(post.updatedAt).toISOString().split('T')[0];
            
            dynamicPages.push({
                url: `${baseUrl}/blog/${post.id}`,
                lastmod: postLastmod,
                changefreq: 'monthly',
                priority: '0.6'
            });
        });

        // Combine all pages
        const allPages = [...staticPages, ...dynamicPages];

        // Generate XML sitemap
        const sitemap = generateSitemapXML(allPages, baseUrl);

        res.set('Content-Type', 'application/xml');
        res.set('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
        res.send(sitemap);

    } catch (error) {
        console.error('Error generating sitemap:', error);
        res.status(500).send('Error generating sitemap');
    }
});

// Generate sitemap index for large sites (future use)
router.get('/sitemap-index.xml', async (req, res) => {
    try {
        const baseUrl = process.env.BASE_URL || 'https://marigoldebs.edu.np';
        
        const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <sitemap>
        <loc>${baseUrl}/sitemap.xml</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    </sitemap>
</sitemapindex>`;

        res.set('Content-Type', 'application/xml');
        res.set('Cache-Control', 'public, max-age=3600');
        res.send(sitemapIndex);

    } catch (error) {
        console.error('Error generating sitemap index:', error);
        res.status(500).send('Error generating sitemap index');
    }
});

/**
 * Generate XML sitemap content
 */
function generateSitemapXML(pages, baseUrl) {
    const urlEntries = pages.map(page => `
    <url>
        <loc>${page.url}</loc>
        <lastmod>${page.lastmod}</lastmod>
        <changefreq>${page.changefreq}</changefreq>
        <priority>${page.priority}</priority>
    </url>`).join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urlEntries}
</urlset>`;
}

module.exports = router;
