const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

// Import Database service
const { db } = require('../config/database');

// Import cache middleware
const { invalidateCache, CACHE_PREFIXES } = require('../middleware/cache');

// Import middleware
const { authenticateToken, requireRole } = require('../middleware/auth');

// ===== DASHBOARD =====

// Get dashboard stats (admin dashboard access - no auth required)
router.get('/dashboard', async (req, res) => {
    try {
        console.log('🔍 Dashboard route called');
        
        // Get counts from different tables using MySQL wrapper
        console.log('📊 Fetching dashboard data...');
        const [users, eventsContent, blogs, gallery, homepageContent, aboutContent, contactContent, admissionApplications] = await Promise.all([
            db.users.findAll().then(rows => { console.log('✅ Users:', rows.length); return rows.length; }).catch(err => { console.error('❌ Users error:', err.message); throw err; }),
            db.eventsContent.findAll().then(rows => { console.log('✅ Events:', rows.length); return rows.length; }).catch(err => { console.error('❌ Events error:', err.message); throw err; }),
            db.blogs.findMany().then(rows => { console.log('✅ Blogs:', rows.length); return rows.length; }).catch(err => { console.error('❌ Blogs error:', err.message); throw err; }),
            db.gallery.count().then(count => { console.log('✅ Gallery:', count); return count; }).catch(err => { console.error('❌ Gallery error:', err.message); throw err; }),
            db.homepageContent.findAll().then(rows => { console.log('✅ Homepage:', rows.length); return rows.length; }).catch(err => { console.error('❌ Homepage error:', err.message); throw err; }),
            db.aboutContent.findAll().then(rows => { console.log('✅ About:', rows.length); return rows.length; }).catch(err => { console.error('❌ About error:', err.message); throw err; }),
            db.contactContent.findAll().then(rows => { console.log('✅ Contact:', rows.length); return rows.length; }).catch(err => { console.error('❌ Contact error:', err.message); throw err; }),
            db.admissionApplications.count().then(count => { console.log('✅ Admissions:', count); return count; }).catch(err => { console.error('❌ Admissions error:', err.message); throw err; })
        ]);
        
        console.log('📊 Dashboard data fetched successfully');

        // Get featured counts
        const [allBlogs, allGallery] = await Promise.all([
            db.blogs.findMany().catch(() => []),
            db.gallery.findMany().catch(() => [])
        ]);

        const featuredBlogs = allBlogs.filter(blog => blog.status === 'PUBLISHED').length;
        const featuredGallery = allGallery.filter(item => item.isFeatured).length;

        res.json({
            totalUsers: users,
            totalEvents: eventsContent,
            totalBlogPosts: blogs,
            totalGalleries: gallery,
            featuredEvents: 0, // No events model, using content instead
            featuredBlogPosts: featuredBlogs,
            featuredGalleries: featuredGallery,
            totalHomepageContent: homepageContent,
            totalAboutContent: aboutContent,
            totalContactContent: contactContent,
            totalAdmissionApplications: admissionApplications
        });
    } catch (error) {
        console.error('❌ Dashboard error:', error);
        console.error('❌ Error stack:', error.stack);
        res.status(500).json({ 
            error: 'Failed to fetch dashboard stats', 
            details: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// Get analytics data
router.get('/analytics', async (req, res) => {
    try {
        // Simulate analytics data (in a real app, this would come from analytics service)
        const analyticsData = {
            websiteTraffic: {
                totalVisitors: 2847,
                pageViews: 12543,
                uniqueVisitors: 1923,
                bounceRate: 35.2
            },
            popularPages: [
                { name: 'Homepage', views: 1234, percentage: 45.2 },
                { name: 'About', views: 856, percentage: 31.4 },
                { name: 'Contact', views: 432, percentage: 15.8 },
                { name: 'Academics', views: 321, percentage: 11.8 }
            ],
            trafficSources: [
                { source: 'Direct', visitors: 1200, percentage: 42.1 },
                { source: 'Google', visitors: 800, percentage: 28.1 },
                { source: 'Social Media', visitors: 500, percentage: 17.5 },
                { source: 'Referral', visitors: 347, percentage: 12.2 }
            ],
            deviceStats: {
                desktop: 65.2,
                mobile: 28.7,
                tablet: 6.1
            }
        };

        res.json(analyticsData);
    } catch (error) {
        console.error('Analytics error:', error);
        res.status(500).json({ error: 'Failed to fetch analytics data' });
    }
});

// ===== USER MANAGEMENT =====

// Get all users - COMMENTED OUT: Using admin-users.js instead
// router.get('/users', async (req, res) => {
    // try {
    //     const { page = 1, limit = 20, role, search } = req.query;
    //     
    //     const options = {
    //         limit: parseInt(limit),
    //         offset: (page - 1) * limit,
    //         role: role || undefined
    //     };
    //     
    //     const users = await db.users.findAll(options);
    //     
    //     res.json({
    //         success: true,
    //         users: users.map(user => {
    //             const { password, ...userWithoutPassword } = user;
    //             return userWithoutPassword;
    //         }),
    //         totalPages: Math.ceil(users.length / limit),
    //         currentPage: parseInt(page),
    //         total: users.length
    //     });
    // } catch (error) {
    //     console.error('Get users error:', error);
    //     res.status(500).json({ error: 'Failed to fetch users' });
    // }
// });

// Get user by ID - COMMENTED OUT: Using admin-users.js instead
// router.get('/users/:id', async (req, res) => {
    // try {
    //     const { id } = req.params;
    //     const user = await db.users.findById(id);
    //     
    //     if (!user) {
    //         return res.status(404).json({ error: 'User not found' });
    //     }
    //     
    //     const { password, ...userWithoutPassword } = user;
    //     res.json({ success: true, user: userWithoutPassword });
    // } catch (error) {
    //     console.error('Get user error:', error);
    //     res.status(500).json({ error: 'Failed to fetch user' });
    // }
// });

// Update user - COMMENTED OUT: Using admin-users.js instead
// router.put('/users/:id', requireRole(['admin']), async (req, res) => {
    // try {
    //     const { id } = req.params;
    //     const updates = req.body;
    //     
    //     // Remove password from updates if present (should be handled separately)
    //     delete updates.password;
    //     
    //     const user = await db.users.update(id, updates);
    //     const { password, ...userWithoutPassword } = user;
    //     
    //     res.json({ success: true, user: userWithoutPassword });
    // } catch (error) {
    //     console.error('Update user error:', error);
    //     res.status(500).json({ error: 'Failed to update user' });
    // }
// });

// Delete user - COMMENTED OUT: Using admin-users.js instead
// router.delete('/users/:id', requireRole(['admin']), async (req, res) => {
    // try {
    //     const { id } = req.params;
    //     await db.users.delete(id);
    //     
    //     res.json({ success: true, message: 'User deleted successfully' });
    // } catch (error) {
    //     console.error('Delete user error:', error);
    //     res.status(500).json({ error: 'Failed to delete user' });
    // }
// });

// ===== EVENTS MANAGEMENT =====

// Get all events (admin dashboard access - no auth required)
router.get('/events', async (req, res) => {
    try {
        const { page = 1, limit = 20, category, status, featured } = req.query;
        
        const options = {
            limit: parseInt(limit),
            offset: (page - 1) * limit,
            category,
            status,
            featured: featured === 'true'
        };
        
        const events = await db.events.findAll(options);
        
        res.json({
            success: true,
            events,
            totalPages: Math.ceil(events.length / limit),
            currentPage: parseInt(page),
            total: events.length
        });
    } catch (error) {
        console.error('Get events error:', error);
        res.status(500).json({ error: 'Failed to fetch events' });
    }
});

// Create event
router.post('/events', requireRole(['admin']), [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('date').isISO8601().withMessage('Valid date is required'),
    body('location').notEmpty().withMessage('Location is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation errors',
                errors: errors.array()
            });
        }

        const eventData = {
            ...req.body,
            createdBy: req.user.id
        };

        const event = await db.events.create(eventData);
        
        res.status(201).json({ success: true, event });
    } catch (error) {
        console.error('Create event error:', error);
        res.status(500).json({ error: 'Failed to create event' });
    }
});

// Update event
router.put('/events/:id', requireRole(['admin']), async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        
        console.log('🚨 admin-simple.js route called - this should not happen for /api/events/:id');
        console.log('🚨 Request params:', req.params);
        console.log('🚨 Request body:', req.body);
        
        // This route should not be called for /api/events/:id
        // Redirect to the proper API route
        res.status(400).json({ 
            success: false, 
            error: 'This route is deprecated. Use /api/events/:id instead.',
            message: 'Route conflict detected'
        });
    } catch (error) {
        console.error('Update event error:', error);
        res.status(500).json({ error: 'Failed to update event' });
    }
});

// Delete event
router.delete('/events/:id', requireRole(['admin']), async (req, res) => {
    try {
        const { id } = req.params;
        await db.events.delete(id);
        
        res.json({ success: true, message: 'Event deleted successfully' });
    } catch (error) {
        console.error('Delete event error:', error);
        res.status(500).json({ error: 'Failed to delete event' });
    }
});

// ===== BLOGS MANAGEMENT =====

// Get all blogs (admin dashboard access - no auth required)
router.get('/blogs', async (req, res) => {
    try {
        const { page = 1, limit = 20, status, featured } = req.query;
        
        const options = {
            limit: parseInt(limit),
            offset: (page - 1) * limit,
            status,
            featured: featured === 'true'
        };
        
        const blogs = await db.blogs.findAll(options);
        
        res.json({
            success: true,
            blogs,
            totalPages: Math.ceil(blogs.length / limit),
            currentPage: parseInt(page),
            total: blogs.length
        });
    } catch (error) {
        console.error('Get blogs error:', error);
        res.status(500).json({ error: 'Failed to fetch blogs' });
    }
});

// Create blog
router.post('/blogs', requireRole(['admin']), [
    body('title').notEmpty().withMessage('Title is required'),
    body('content').notEmpty().withMessage('Content is required'),
    body('excerpt').notEmpty().withMessage('Excerpt is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation errors',
                errors: errors.array()
            });
        }

        const blogData = {
            ...req.body,
            authorId: req.user.id,
            tags: Array.isArray(req.body.tags) ? req.body.tags.join(',') : req.body.tags || ''
        };

        const blog = await db.blogs.create(blogData);
        
        res.status(201).json({ success: true, blog });
    } catch (error) {
        console.error('Create blog error:', error);
        res.status(500).json({ error: 'Failed to create blog' });
    }
});

// Update blog
router.put('/blogs/:id', requireRole(['admin']), async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        
        if (updates.tags && Array.isArray(updates.tags)) {
            updates.tags = updates.tags.join(',');
        }
        
        const blog = await db.blogs.update(id, updates);
        
        res.json({ success: true, blog });
    } catch (error) {
        console.error('Update blog error:', error);
        res.status(500).json({ error: 'Failed to update blog' });
    }
});

// Delete blog
router.delete('/blogs/:id', requireRole(['admin']), async (req, res) => {
    try {
        const { id } = req.params;
        await db.blogs.delete(id);
        
        res.json({ success: true, message: 'Blog deleted successfully' });
    } catch (error) {
        console.error('Delete blog error:', error);
        res.status(500).json({ error: 'Failed to delete blog' });
    }
});

// ===== GALLERY MANAGEMENT =====

// Get all gallery items (admin dashboard access - no auth required)
router.get('/gallery', async (req, res) => {
    try {
        const { page = 1, limit = 20, category, featured } = req.query;
        
        const options = {
            limit: parseInt(limit),
            offset: (page - 1) * limit,
            category,
            featured: featured === 'true'
        };
        
        // Build where clause for Prisma
        const where = {};
        
        if (category) {
            where.category = category;
        }
        if (featured === 'true') {
            where.isFeatured = true;
        }

        // Calculate offset
        const offset = (parseInt(page) - 1) * parseInt(limit);

        // Fetch gallery items using Prisma
        const [gallery, total] = await Promise.all([
            db.gallery.findMany({
                where,
                skip: offset,
                take: parseInt(limit),
                orderBy: { createdAt: 'desc' }
            }),
            db.gallery.count({ where })
        ]);
        
        res.json({
            success: true,
            gallery,
            totalPages: Math.ceil((total || 0) / parseInt(limit)),
            currentPage: parseInt(page),
            total: total || 0
        });
    } catch (error) {
        console.error('Get gallery error:', error);
        res.status(500).json({ error: 'Failed to fetch gallery' });
    }
});

// Create gallery item
router.post('/gallery', requireRole(['admin']), [
    body('title').notEmpty().withMessage('Title is required'),
    body('imageUrl').notEmpty().withMessage('Image URL is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation errors',
                errors: errors.array()
            });
        }

        const galleryData = {
            ...req.body,
            uploadedBy: req.user.id,
            tags: Array.isArray(req.body.tags) ? req.body.tags.join(',') : req.body.tags || ''
        };

        const galleryItem = await db.gallery.create(galleryData);
        
        res.status(201).json({ success: true, gallery: galleryItem });
    } catch (error) {
        console.error('Create gallery error:', error);
        res.status(500).json({ error: 'Failed to create gallery item' });
    }
});

// Update gallery item
router.put('/gallery/:id', requireRole(['admin']), async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        
        if (updates.tags && Array.isArray(updates.tags)) {
            updates.tags = updates.tags.join(',');
        }
        
        const galleryItem = await db.gallery.update(id, updates);
        
        res.json({ success: true, gallery: galleryItem });
    } catch (error) {
        console.error('Update gallery error:', error);
        res.status(500).json({ error: 'Failed to update gallery item' });
    }
});

// Delete gallery item
router.delete('/gallery/:id', requireRole(['admin']), async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`🗑️ Deleting gallery item: ${id}`);
        
        // Get gallery item details first to check for Cloudinary assets
        const galleryItem = await db.gallery.findUnique({
            where: { id }
        });

        if (!galleryItem) {
            return res.status(404).json({
                success: false,
                error: 'Gallery item not found'
            });
        }

        // Delete from Cloudinary if videoUrl or imageUrl exists
        if (galleryItem.videoUrl || galleryItem.imageUrl) {
            try {
                const { deleteImage } = require('../config/cloudinary');
                
                // Handle video deletion
                if (galleryItem.videoUrl) {
                    // Extract public_id from Cloudinary video URL
                    let publicId = galleryItem.videoUrl;
                    
                    // Remove the base URL to get the path
                    const urlPattern = /\/upload\/(?:v\d+\/)?(.+?)\.(mp4|mov|avi|webm|mkv)$/i;
                    const match = galleryItem.videoUrl.match(urlPattern);
                    
                    if (match && match[1]) {
                        publicId = match[1];
                    } else {
                        // Fallback: extract filename from URL
                        const urlParts = galleryItem.videoUrl.split('/');
                        publicId = urlParts[urlParts.length - 1].split('.')[0];
                    }
                    
                    // Use the consistent deleteImage function with video resource type
                    await deleteImage(publicId, 'video');
                }
                
                // Handle image deletion
                if (galleryItem.imageUrl) {
                    // Extract public_id from Cloudinary image URL
                    let publicId = galleryItem.imageUrl;
                    
                    // Remove the base URL to get the path
                    const urlPattern = /\/upload\/(?:v\d+\/)?(.+?)\.(jpg|jpeg|png|gif|webp)$/i;
                    const match = galleryItem.imageUrl.match(urlPattern);
                    
                    if (match && match[1]) {
                        publicId = match[1];
                    } else {
                        // Fallback: extract filename from URL
                        const urlParts = galleryItem.imageUrl.split('/');
                        publicId = urlParts[urlParts.length - 1].split('.')[0];
                    }
                    
                    // Use the consistent deleteImage function (defaults to 'image' resource type)
                    await deleteImage(publicId);
                }
            } catch (cloudinaryError) {
                console.error('❌ Error deleting from Cloudinary:', cloudinaryError);
                
                // Check if it's a "not found" error - if so, it's okay to continue
                if (cloudinaryError.message && cloudinaryError.message.includes('not found')) {
                    console.log(`⚠️ Asset not found in Cloudinary (already deleted or never existed): ${galleryItem.videoUrl || galleryItem.imageUrl}`);
                } else {
                    console.error('❌ Unexpected Cloudinary error:', cloudinaryError.message);
                }
                // Continue with database deletion even if Cloudinary fails
            }
        }

        // Delete from database
        await db.gallery.delete({
            where: { id }
        });

        console.log(`✅ Gallery item deleted from database: ${id}`);
        res.json({ 
            success: true, 
            message: 'Gallery item deleted successfully' 
        });
    } catch (error) {
        console.error('❌ Delete gallery error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to delete gallery item' 
        });
    }
});


// ===== HOMEPAGE CONTENT MANAGEMENT =====

// Update section visibility (no auth required for admin dashboard)
router.patch('/section-visibility', [
    body('page').isIn(['home', 'about', 'academics', 'contact']).withMessage('Valid page is required'),
    body('section').notEmpty().withMessage('Section is required'),
    body('visible').isBoolean().withMessage('Visible must be a boolean')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { page, section, visible } = req.body;

        // For homepage content, update the section_enabled item
        if (page === 'home') {
            const sectionEnabled = await db.homepageContent.findBySectionAndKey(section, 'section_enabled');
            
            if (sectionEnabled) {
                // Update existing section enabled record
                await db.homepageContent.update(sectionEnabled.id, {
                    isActive: visible,
                    updatedAt: new Date()
                });
            } else {
                // Create new section enabled record
                await db.homepageContent.create({
                    section: section,
                    key: 'section_enabled',
                    title: 'Section Enabled',
                    content: visible ? 'true' : 'false',
                    isActive: visible,
                    orderIndex: 0
                });
            }
        } else {
            // For other pages, we can implement similar logic later
            // For now, just return success
            console.log(`Section visibility update for ${page}/${section}: ${visible}`);
        }

        res.json({
            success: true,
            message: `Section ${section} ${visible ? 'enabled' : 'disabled'} successfully`
        });

    } catch (error) {
        console.error('Section visibility update error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to update section visibility' 
        });
    }
});

// Get all homepage content (admin dashboard access - no auth required)
router.get('/homepage-content', async (req, res) => {
    try {
        const { section } = req.query;
        const content = await db.homepageContent.findAll({ section });
        res.json(content);
    } catch (error) {
        console.error('Get homepage content error:', error);
        res.status(500).json({ error: 'Failed to fetch homepage content' });
    }
});

// Get homepage content by section (admin dashboard access - no auth required)
router.get('/homepage-content/:section', async (req, res) => {
    try {
        const { section } = req.params;
        const content = await db.homepageContent.findBySection(section);
        res.json(content);
    } catch (error) {
        console.error('Get homepage section content error:', error);
        res.status(500).json({ error: 'Failed to fetch homepage section content' });
    }
});

// Get specific homepage content item (admin dashboard access - no auth required)
router.get('/homepage-content/:section/:key', async (req, res) => {
    try {
        const { section, key } = req.params;
        const content = await db.homepageContent.findBySectionAndKey(section, key);
        
        if (!content) {
            return res.status(404).json({ error: 'Content not found' });
        }
        
        res.json(content);
    } catch (error) {
        console.error('Get homepage content item error:', error);
        res.status(500).json({ error: 'Failed to fetch homepage content item' });
    }
});

// Create or update homepage content
router.post('/homepage-content', requireRole(['admin']), [
    body('section').notEmpty().withMessage('Section is required'),
    body('key').notEmpty().withMessage('Key is required'),
    body('title').optional().isString(),
    body('content').optional().isString(),
    body('description').optional().isString(),
    body('imageUrl').optional().isURL().withMessage('Invalid image URL'),
    body('linkUrl').optional().isURL().withMessage('Invalid link URL'),
    body('orderIndex').optional().isInt().withMessage('Order index must be a number'),
    body('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
    body('metadata').optional().isString()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { section, key, ...data } = req.body;
        const content = await db.homepageContent.upsertBySectionAndKey(section, key, data);
        
        // Invalidate cache
        await invalidateCache(`${CACHE_PREFIXES.HOMEPAGE}:${section}`);
        
        res.json(content);
    } catch (error) {
        console.error('Create/update homepage content error:', error);
        res.status(500).json({ error: 'Failed to save homepage content' });
    }
});

// Update homepage content by ID
router.put('/homepage-content/:id', requireRole(['admin']), [
    body('title').optional().isString(),
    body('content').optional().isString(),
    body('description').optional().isString(),
    body('imageUrl').optional().isURL().withMessage('Invalid image URL'),
    body('linkUrl').optional().isURL().withMessage('Invalid link URL'),
    body('orderIndex').optional().isInt().withMessage('Order index must be a number'),
    body('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
    body('metadata').optional().isString()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        const content = await db.homepageContent.update(id, req.body);
        
        // Invalidate cache
        await invalidateCache(`${CACHE_PREFIXES.HOMEPAGE}:${content.section}`);
        
        res.json(content);
    } catch (error) {
        console.error('Update homepage content error:', error);
        res.status(500).json({ error: 'Failed to update homepage content' });
    }
});

// Delete homepage content
router.delete('/homepage-content/:id', requireRole(['admin']), async (req, res) => {
    try {
        const { id } = req.params;
        const content = await db.homepageContent.findById(id);
        
        if (!content) {
            return res.status(404).json({ error: 'Content not found' });
        }
        
        await db.homepageContent.delete(id);
        
        // Invalidate cache
        await invalidateCache(`${CACHE_PREFIXES.HOMEPAGE}:${content.section}`);
        
        res.json({ message: 'Content deleted successfully' });
    } catch (error) {
        console.error('Delete homepage content error:', error);
        res.status(500).json({ error: 'Failed to delete homepage content' });
    }
});

// Bulk update homepage content (admin dashboard access - no auth required for now)
router.post('/homepage-content/bulk', [
    body('content').isArray().withMessage('Content must be an array'),
    body('content.*.section').notEmpty().withMessage('Section is required for each item'),
    body('content.*.key').notEmpty().withMessage('Key is required for each item')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { content } = req.body;
        const updatedContent = [];
        
        for (const item of content) {
            const { section, key, ...data } = item;
            const result = await db.homepageContent.upsertBySectionAndKey(section, key, data);
            updatedContent.push(result);
        }
        
        // Invalidate all homepage cache
        await invalidateCache(`${CACHE_PREFIXES.HOMEPAGE}:*`);
        
        res.json(updatedContent);
    } catch (error) {
        console.error('Bulk update homepage content error:', error);
        res.status(500).json({ error: 'Failed to bulk update homepage content' });
    }
});

// ===== WEBSITE SETTINGS =====

// Get website settings
router.get('/settings', async (req, res) => {
    try {
        console.log('🔍 GET /api/admin/settings - Fetching website settings...');
        
        // Get the latest general settings from database
        const settings = await db.generalSettings.findFirst({
            orderBy: { createdAt: 'desc' }
        });

        console.log('📊 Database query result:', settings);

        if (!settings) {
            console.log('⚠️ No settings found in database, returning defaults');
            // Return default values if no settings found
            return res.json({
                id: null,
                siteName: 'Marigold English Boarding School',
                siteNameSecond: '',
                siteDescription: 'Excellence in Education',
                siteLogo: null,
                siteFavicon: null,
                mainContactEmail: null,
                mainContactPhone: null,
                schoolAddress: null,
                createdAt: new Date(),
                updatedAt: new Date()
            });
        }

        res.json({
            id: settings.id,
            siteName: settings.siteName,
            siteNameSecond: settings.siteNameSecond,
            siteDescription: settings.siteDescription,
            siteLogo: settings.siteLogo,
            siteFavicon: settings.siteFavicon,
            mainContactEmail: settings.mainContactEmail,
            mainContactPhone: settings.mainContactPhone,
            schoolAddress: settings.schoolAddress,
            createdAt: settings.createdAt,
            updatedAt: settings.updatedAt
        });
    } catch (error) {
        console.error('❌ Error fetching website settings:', error);
        res.status(500).json({
            error: 'Failed to fetch website settings',
            details: error.message
        });
    }
});

// Update website settings
router.put('/settings', [
    body('siteName').optional().isString().withMessage('Site name must be a string'),
    body('siteNameSecond').optional().isString().withMessage('Site name second must be a string'),
    body('siteDescription').optional().isString().withMessage('Site description must be a string'),
    body('siteLogo').optional().isString().withMessage('Site logo must be a string'),
    body('siteFavicon').optional().isString().withMessage('Site favicon must be a string'),
    body('mainContactEmail').optional().isEmail().withMessage('Main contact email must be a valid email'),
    body('mainContactPhone').optional().isString().withMessage('Main contact phone must be a string'),
    body('schoolAddress').optional().isString().withMessage('School address must be a string')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        console.log('💾 PUT /api/admin/settings - Updating website settings...');
        console.log('📝 Request body:', req.body);

        // Check if settings exist
        const existingSettings = await db.generalSettings.findFirst({
            orderBy: { createdAt: 'desc' }
        });

        let settings;
        if (existingSettings) {
            // Update existing settings - MySQL wrapper expects (id, updates)
            settings = await db.generalSettings.update(existingSettings.id, {
                siteName: req.body.siteName,
                siteNameSecond: req.body.siteNameSecond,
                siteDescription: req.body.siteDescription,
                siteLogo: req.body.siteLogo,
                siteFavicon: req.body.siteFavicon,
                mainContactEmail: req.body.mainContactEmail,
                mainContactPhone: req.body.mainContactPhone,
                schoolAddress: req.body.schoolAddress
            });
        } else {
            // Create new settings - MySQL wrapper expects just the data object
            settings = await db.generalSettings.create({
                siteName: req.body.siteName || 'Marigold School',
                siteNameSecond: req.body.siteNameSecond || '',
                siteDescription: req.body.siteDescription || 'Excellence in Education',
                siteLogo: req.body.siteLogo,
                siteFavicon: req.body.siteFavicon,
                mainContactEmail: req.body.mainContactEmail,
                mainContactPhone: req.body.mainContactPhone,
                schoolAddress: req.body.schoolAddress
            });
        }

        console.log('✅ Settings updated successfully:', settings);

        // Invalidate cache for school settings
        await invalidateCache(`${CACHE_PREFIXES.SCHOOL_SETTINGS}:*`);

        res.json(settings);
    } catch (error) {
        console.error('❌ Error updating website settings:', error);
        res.status(500).json({
            error: 'Failed to update website settings',
            details: error.message
        });
    }
});

// ===== CONTACT REQUESTS =====

// Helper function to get contact request stats
async function getContactRequestStats() {
    try {
        console.log('📊 Getting contact request stats...');
        const [total, pending, responded, archived] = await Promise.all([
            db.contactSubmissions.count(),
            db.contactSubmissions.count({ where: { status: 'NEW' } }),
            db.contactSubmissions.count({ where: { status: 'REPLIED' } }),
            db.contactSubmissions.count({ where: { status: 'ARCHIVED' } })
        ]);

        const stats = {
            total,
            pending,
            responded,
            archived
        };
        
        console.log('📊 Contact request stats:', stats);
        return stats;
    } catch (error) {
        console.error('❌ Error getting contact request stats:', error);
        return { total: 0, pending: 0, responded: 0, archived: 0 };
    }
}

// Helper function to map database status to frontend status
function mapDbStatusToFrontend(dbStatus) {
    const statusMapping = {
        'NEW': 'pending',
        'REPLIED': 'responded',
        'ARCHIVED': 'archived'
    };
    return statusMapping[dbStatus] || dbStatus.toLowerCase();
}

// Get all contact requests with pagination and filtering
router.get('/contact-requests', async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            search = '',
            status = 'all',
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;

        // Build where conditions
        const whereConditions = {};
        
        if (search) {
            // SQLite doesn't support mode: 'insensitive', so we'll use contains without it
            whereConditions.OR = [
                { fullName: { contains: search } },
                { email: { contains: search } },
                { message: { contains: search } }
            ];
        }
        
        if (status !== 'all') {
            // Map frontend status values to database status values
            const statusMapping = {
                'pending': 'NEW',
                'responded': 'REPLIED', 
                'archived': 'ARCHIVED'
            };
            
            const dbStatus = statusMapping[status] || status;
            whereConditions.status = dbStatus;
        }

        // Build order by - map frontend field names to database field names
        const orderBy = {};
        const fieldMapping = {
            'createdAt': 'createdAt',
            'name': 'fullName',
            'email': 'email',
            'status': 'status'
        };
        
        const dbField = fieldMapping[sortBy] || 'createdAt';
        orderBy[dbField] = sortOrder;

        // Get contact requests with pagination
        const [contactRequests, total] = await Promise.all([
            db.contactSubmissions.findMany({
                where: whereConditions,
                orderBy: orderBy,
                skip: (page - 1) * limit,
                take: parseInt(limit)
            }),
            db.contactSubmissions.count({ where: whereConditions })
        ]);

        const totalPages = Math.ceil(total / limit);

        // Map database status values back to frontend status values
        const mappedContactRequests = contactRequests.map(request => ({
            ...request,
            status: mapDbStatusToFrontend(request.status)
        }));

        // Add cache-busting headers
        res.set({
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        });

        // Get stats for all contact requests (not filtered)
        let stats = { total: 0, pending: 0, responded: 0, archived: 0 };
        try {
            stats = await getContactRequestStats();
            console.log('📊 Stats retrieved successfully:', stats);
        } catch (error) {
            console.error('❌ Error getting stats:', error);
        }

        res.json({
            success: true,
            contactRequests: mappedContactRequests,
            totalPages,
            currentPage: parseInt(page),
            total,
            stats
        });
    } catch (error) {
        console.error('Get contact requests error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch contact requests' 
        });
    }
});

// Get single contact request
router.get('/contact-requests/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        // MySQL wrapper expects findById
        const contactRequest = await db.contactSubmissions.findById(id);

        if (!contactRequest) {
            return res.status(404).json({ 
                success: false, 
                error: 'Contact request not found' 
            });
        }

        // Map database status to frontend status
        const mappedContactRequest = {
            ...contactRequest,
            status: mapDbStatusToFrontend(contactRequest.status)
        };

        res.json({
            success: true,
            contactRequest: mappedContactRequest
        });
    } catch (error) {
        console.error('Get contact request error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch contact request' 
        });
    }
});

// Update contact request status
router.patch('/contact-requests/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Map frontend status to database status
        const statusMapping = {
            'pending': 'NEW',
            'responded': 'REPLIED', 
            'archived': 'ARCHIVED'
        };
        
        const dbStatus = statusMapping[status] || status;
        
        if (!['NEW', 'READ', 'REPLIED', 'ARCHIVED'].includes(dbStatus)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid status value'
            });
        }

        // MySQL wrapper expects (id, updates)
        const updateData = { status: dbStatus };
        if (dbStatus === 'REPLIED') {
            updateData.repliedAt = new Date();
            updateData.repliedBy = 'admin'; // Since we don't have user context in admin-simple
        }
        
        const updatedRequest = await db.contactSubmissions.update(id, updateData);

        // Map database status back to frontend status
        const mappedContactRequest = {
            ...updatedRequest,
            status: mapDbStatusToFrontend(updatedRequest.status)
        };

        res.json({
            success: true,
            contactRequest: mappedContactRequest
        });
    } catch (error) {
        console.error('Update contact request status error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to update contact request status' 
        });
    }
});

// Test contact reply email
router.post('/test-contact-reply-email', async (req, res) => {
    try {
        const { email, fullName, message } = req.body;
        
        if (!email || !fullName || !message) {
            return res.status(400).json({
                success: false,
                error: 'Email, fullName, and message are required'
            });
        }

        const mockContactRequest = {
            email: email,
            fullName: fullName
        };

        const { sendContactReplyEmail } = require('../config/email');
        const emailResult = await sendContactReplyEmail(mockContactRequest, message);
        
        if (emailResult.success) {
            res.json({
                success: true,
                message: 'Test contact reply email sent successfully',
                messageId: emailResult.messageId
            });
        } else {
            res.status(400).json({
                success: false,
                error: emailResult.error
            });
        }
    } catch (error) {
        console.error('Test contact reply email error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to send test email'
        });
    }
});

// Reply to contact request
router.post('/contact-requests/:id/reply', async (req, res) => {
    try {
        const { id } = req.params;
        const { message } = req.body;

        if (!message || message.trim().length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Message is required'
            });
        }

        // Get the contact request - MySQL wrapper expects findById
        const contactRequest = await db.contactSubmissions.findById(id);

        if (!contactRequest) {
            return res.status(404).json({
                success: false,
                error: 'Contact request not found'
            });
        }

        // Update status to replied - MySQL wrapper expects (id, updates)
        await db.contactSubmissions.update(id, {
            status: 'REPLIED',
            repliedAt: new Date(),
            repliedBy: 'admin', // Since we don't have user context in admin-simple
            repliedMessage: message
        });

        // Send email reply to the contact request
        try {
            console.log('📧 Attempting to send reply email...');
            console.log('📧 Contact request:', {
                email: contactRequest.email,
                fullName: contactRequest.fullName,
                message: message
            });
            
            // Test if email module is available
            const emailModule = require('../config/email');
            console.log('📧 Email module loaded:', Object.keys(emailModule));
            
            const { sendContactReplyEmail } = emailModule;
            console.log('📧 sendContactReplyEmail function:', typeof sendContactReplyEmail);
            
            const emailResult = await sendContactReplyEmail(contactRequest, message);
            console.log('📧 Email result:', emailResult);
            
            if (emailResult.success) {
                console.log(`✅ Reply email sent successfully to ${contactRequest.email}: ${emailResult.messageId}`);
            } else {
                console.error(`❌ Failed to send reply email to ${contactRequest.email}:`, emailResult.error);
                // Don't fail the request if email fails, just log it
            }
        } catch (emailError) {
            console.error('❌ Email sending error:', emailError);
            console.error('❌ Email error stack:', emailError.stack);
            // Don't fail the request if email fails, just log it
        }

        res.json({
            success: true,
            message: 'Reply sent successfully'
        });
    } catch (error) {
        console.error('Reply to contact request error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to send reply' 
        });
    }
});

// Delete contact request
router.delete('/contact-requests/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        // MySQL wrapper expects findById
        const contactRequest = await db.contactSubmissions.findById(id);

        if (!contactRequest) {
            return res.status(404).json({
                success: false,
                error: 'Contact request not found'
            });
        }

        // MySQL wrapper expects just the id
        await db.contactSubmissions.delete(id);

        res.json({
            success: true,
            message: 'Contact request deleted successfully'
        });
    } catch (error) {
        console.error('Delete contact request error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to delete contact request' 
        });
    }
});

// ===== POPUP NOTICES =====

// Get all popup notices
router.get('/popup-notices', authenticateToken, requireRole(['admin']), async (req, res) => {
    try {
        const notices = await db.popupNotices.findMany({
            orderBy: { orderIndex: 'asc' }
        });
        res.json({
            success: true,
            notices
        });
    } catch (error) {
        console.error('Get popup notices error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch popup notices'
        });
    }
});

// Get active popup notices (for public API)
router.get('/popup-notices/active', async (req, res) => {
    try {
        const notices = await db.popupNotices.findActive();
        res.json({
            success: true,
            notices
        });
    } catch (error) {
        console.error('Get active popup notices error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch active popup notices'
        });
    }
});

// Get single popup notice
router.get('/popup-notices/:id', authenticateToken, requireRole(['admin']), async (req, res) => {
    try {
        const { id } = req.params;
        const notice = await db.popupNotices.findById(id);
        
        if (!notice) {
            return res.status(404).json({
                success: false,
                error: 'Popup notice not found'
            });
        }
        
        res.json({
            success: true,
            notice
        });
    } catch (error) {
        console.error('Get popup notice error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch popup notice'
        });
    }
});

// Create popup notice
router.post('/popup-notices', authenticateToken, requireRole(['admin']), [
    body('imageUrl').notEmpty().withMessage('Image URL is required'),
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }
        
        const { imageUrl, isEnabled, orderIndex } = req.body;
        
        const notice = await db.popupNotices.create({
            imageUrl,
            isEnabled: isEnabled !== undefined ? isEnabled : true,
            orderIndex: orderIndex || 0
        });
        
        // Invalidate cache
        invalidateCache(CACHE_PREFIXES.HOMEPAGE);
        
        res.status(201).json({
            success: true,
            notice
        });
    } catch (error) {
        console.error('Create popup notice error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create popup notice'
        });
    }
});

// Update popup notice
router.put('/popup-notices/:id', authenticateToken, requireRole(['admin']), async (req, res) => {
    try {
        const { id } = req.params;
        const { imageUrl, isEnabled, orderIndex } = req.body;
        
        const updates = {};
        if (imageUrl !== undefined) updates.imageUrl = imageUrl;
        if (isEnabled !== undefined) updates.isEnabled = isEnabled;
        if (orderIndex !== undefined) updates.orderIndex = orderIndex;
        
        const notice = await db.popupNotices.update(id, updates);
        
        if (!notice) {
            return res.status(404).json({
                success: false,
                error: 'Popup notice not found'
            });
        }
        
        // Invalidate cache
        invalidateCache(CACHE_PREFIXES.HOMEPAGE);
        
        res.json({
            success: true,
            notice
        });
    } catch (error) {
        console.error('Update popup notice error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update popup notice'
        });
    }
});

// Delete popup notice
router.delete('/popup-notices/:id', authenticateToken, requireRole(['admin']), async (req, res) => {
    try {
        const { id } = req.params;
        await db.popupNotices.delete(id);
        
        // Invalidate cache
        invalidateCache(CACHE_PREFIXES.HOMEPAGE);
        
        res.json({
            success: true,
            message: 'Popup notice deleted successfully'
        });
    } catch (error) {
        console.error('Delete popup notice error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete popup notice'
        });
    }
});

// Bulk update popup notices (for reordering)
router.put('/popup-notices/bulk', authenticateToken, requireRole(['admin']), async (req, res) => {
    try {
        const { notices } = req.body;
        
        if (!Array.isArray(notices)) {
            return res.status(400).json({
                success: false,
                error: 'Notices must be an array'
            });
        }
        
        // Update each notice
        for (const notice of notices) {
            if (notice.id) {
                await db.popupNotices.update(notice.id, {
                    orderIndex: notice.orderIndex || 0,
                    isEnabled: notice.isEnabled !== undefined ? notice.isEnabled : true
                });
            }
        }
        
        // Invalidate cache
        invalidateCache(CACHE_PREFIXES.HOMEPAGE);
        
        res.json({
            success: true,
            message: 'Popup notices updated successfully'
        });
    } catch (error) {
        console.error('Bulk update popup notices error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update popup notices'
        });
    }
});

module.exports = router;
