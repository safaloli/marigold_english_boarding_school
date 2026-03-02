const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

// Import Database service
const { db } = require('../config/database');

// Import cache middleware
const { invalidateCache, CACHE_PREFIXES } = require('../middleware/cache');

// Import middleware
const { authenticateToken, requireRole } = require('../middleware/auth');

// ===== TEST ENDPOINT =====

// Simple test endpoint
router.get('/test', (req, res) => {
    res.json({
        success: true,
        message: 'API is working!',
        timestamp: new Date().toISOString()
    });
});

// ===== CACHE MANAGEMENT =====

// Clear client-side cache (public endpoint)
// This endpoint tells clients to clear their localStorage cache
router.post('/cache/clear-client', async (req, res) => {
    try {
        // Return response with cache invalidation header
        res.setHeader('X-Cache-Invalidate', 'true');
        res.json({
            success: true,
            message: 'Client cache invalidation signal sent',
            timestamp: Date.now()
        });
    } catch (error) {
        console.error('Cache clear error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to send cache invalidation signal' 
        });
    }
});

// ===== PUBLIC SCHOOL SETTINGS =====

// Get school settings for public use (navbar, footer, etc.)
router.get('/school-settings', async (req, res) => {
    try {
        
        // Get the latest general settings from database
        const settings = await db.generalSettings.findFirst();


        if (!settings) {
            console.log('⚠️ No settings found in database, returning defaults');
            // Return default values if no settings found
            return res.json({
                success: true,
                schoolName: 'Marigold English Boarding School',
                schoolNameSecond: '',
                schoolLogo: null,
                schoolDescription: 'Excellence in Education',
                siteFavicon: null,
                mainContactEmail: null,
                mainContactPhone: null,
                schoolAddress: null
            });
        }


        const response = {
            success: true,
            schoolName: settings.siteName || 'Marigold English Boarding School',
            schoolNameSecond: settings.siteNameSecond || '',
            schoolLogo: settings.siteLogo || null,
            schoolDescription: settings.siteDescription || 'Excellence in Education',
            mainContactEmail: settings.mainContactEmail || null,
            mainContactPhone: settings.mainContactPhone || null,
            schoolAddress: settings.schoolAddress || null,
            siteFavicon: settings.siteFavicon || null
        };

        console.log('📤 Sending response:', response);
        res.json(response);
    } catch (error) {
        console.error('❌ Error fetching school settings:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to fetch school settings',
            message: error.message 
        });
    }
});

// ===== CONTACT CONTENT API =====

// Get contact content for footer and other public use
router.get('/contact-content', async (req, res) => {
    try {
        
        // Get contact content from database, focusing on contact_main section
        const contactContent = await db.contactContent.findAll({
            section: 'contact_main',
            isActive: true
        });


        // Transform the data into a more usable format
        const contactInfo = {
            email: null,
            phone: null,
            support: null,
            address: null,
            hours: null,
            socialMedia: {
                facebook: null,
                instagram: null,
                twitter: null,
                youtube: null,
                linkedin: null
            }
        };

        // Process each contact item
        contactContent.forEach(item => {
            switch (item.key) {
                case 'contact_email':
                    contactInfo.email = {
                        title: item.title,
                        content: item.content,
                        description: item.description,
                        linkUrl: item.linkUrl,
                        icon: item.metadata
                    };
                    break;
                case 'contact_phone':
                    contactInfo.phone = {
                        title: item.title,
                        content: item.content,
                        description: item.description,
                        linkUrl: item.linkUrl,
                        icon: item.metadata
                    };
                    break;
                case 'contact_support':
                    contactInfo.support = {
                        title: item.title,
                        content: item.content,
                        description: item.description,
                        linkUrl: item.linkUrl,
                        icon: item.metadata
                    };
                    break;
                case 'contact_address':
                    contactInfo.address = {
                        title: item.title,
                        content: item.content,
                        description: item.description,
                        icon: item.metadata
                    };
                    break;
                case 'contact_hours':
                    contactInfo.hours = {
                        title: item.title,
                        content: item.content,
                        description: item.description,
                        icon: item.metadata
                    };
                    break;
            }
        });

        // Also get location section for address
        const locationContent = await db.contactContent.findAll({
            section: 'location_section',
            isActive: true
        });

        // Process location content (only as fallback if not already set)
        locationContent.forEach(item => {
            if (item.key === 'school_address' && !contactInfo.address) {
                contactInfo.address = {
                    title: item.title,
                    content: item.content,
                    description: item.description,
                    icon: item.metadata
                };
            }
            if (item.key === 'school_hours' && !contactInfo.hours) {
                contactInfo.hours = {
                    title: item.title,
                    content: item.content,
                    description: item.description,
                    icon: item.metadata
                };
            }
        });

        // Get social media links
        const socialMediaContent = await db.contactContent.findAll({
            section: 'social_media',
            isActive: true
        });

        // Process social media content
        socialMediaContent.forEach(item => {
            switch (item.key) {
                case 'facebook_link':
                    contactInfo.socialMedia.facebook = {
                        title: item.title,
                        content: item.content,
                        description: item.description,
                        linkUrl: item.linkUrl,
                        icon: item.metadata
                    };
                    break;
                case 'instagram_link':
                    contactInfo.socialMedia.instagram = {
                        title: item.title,
                        content: item.content,
                        description: item.description,
                        linkUrl: item.linkUrl,
                        icon: item.metadata
                    };
                    break;
                case 'twitter_link':
                    contactInfo.socialMedia.twitter = {
                        title: item.title,
                        content: item.content,
                        description: item.description,
                        linkUrl: item.linkUrl,
                        icon: item.metadata
                    };
                    break;
                case 'youtube_link':
                    contactInfo.socialMedia.youtube = {
                        title: item.title,
                        content: item.content,
                        description: item.description,
                        linkUrl: item.linkUrl,
                        icon: item.metadata
                    };
                    break;
                case 'linkedin_link':
                    contactInfo.socialMedia.linkedin = {
                        title: item.title,
                        content: item.content,
                        description: item.description,
                        linkUrl: item.linkUrl,
                        icon: item.metadata
                    };
                    break;
            }
        });

        console.log('📤 Sending contact content response:', contactInfo);

        res.json({
            success: true,
            contactInfo
        });
    } catch (error) {
        console.error('❌ Error fetching contact content:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to fetch contact content',
            message: error.message 
        });
    }
});

// ===== EVENTS API =====

// Get all events
router.get('/events', async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            category, 
            status = 'upcoming'
        } = req.query;

        // Build Prisma where clause
        const where = {
            isActive: true
        };
        
        // Set section based on status
        if (status === 'upcoming') {
            where.section = 'upcoming_events';
        } else if (status === 'past') {
            where.section = 'past_events';
        }
        
        if (category) {
            where.category = category;
        }

        // Fetch events with pagination
        const events = await db.eventsContent.findMany({
            where,
            orderBy: {
                eventDate: status === 'past' ? 'desc' : 'asc'
            },
            take: parseInt(limit),
            skip: (parseInt(page) - 1) * parseInt(limit)
        });

        // Get total count for pagination
        const allEvents = await db.eventsContent.findAll();
        // Filter by where conditions manually since count({where}) isn't supported
        const filtered = allEvents.filter(event => {
            if (where.section && event.section !== where.section) return false;
            if (where.category && event.category !== where.category) return false;
            if (where.isActive !== undefined && event.isActive !== where.isActive) return false;
            return true;
        });
        const total = filtered.length;

        res.json({
            success: true,
            events: events || [],
            totalPages: Math.ceil(total / parseInt(limit)),
            currentPage: parseInt(page),
            total: total
        });
    } catch (error) {
        console.error('Events API error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to fetch events',
            error: error.message 
        });
    }
});

// Get single event
router.get('/events/:id', async (req, res) => {
    try {
        const { data: event, error } = await supabase
            .from('events')
            .select('*')
            .eq('id', req.params.id)
            .single();
        
        if (error || !event) {
            return res.status(404).json({ 
                success: false,
                message: 'Event not found' 
            });
        }

        res.json({
            success: true,
            event
        });
    } catch (error) {
        console.error('Event API error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to fetch event',
            error: error.message 
        });
    }
});

// Create event (Admin only)
router.post('/events', authenticateToken, requireRole(['ADMIN', 'admin', 'moderator']), [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('date').isISO8601().withMessage('Valid event date is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success: false,
                errors: errors.array() 
            });
        }

        // Generate a unique key for this event (using timestamp + random)
        const eventKey = `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        // Determine section from request body, default to upcoming_events
        const section = req.body.section || 'upcoming_events';

        // Prepare metadata for fields that don't have dedicated columns
        const metadata = {};
        if (req.body.validUntil) {
            metadata.validUntil = req.body.validUntil;
        }
        if (req.body.audience) {
            metadata.audience = req.body.audience;
        }

        const eventData = {
            section: section,
            key: eventKey,
            title: req.body.title,
            description: req.body.description,
            category: req.body.category || 'other',
            eventDate: new Date(req.body.date),
            eventTime: req.body.time || null,
            venue: req.body.location || null,
            organizer: req.body.organizer || req.body.author || null,  // Support both organizer and author
            imageUrl: req.body.imageUrl || null,
            registrationEnabled: req.body.registrationEnabled || false,
            locationMap: req.body.locationMap || null,
            contactInfo: req.body.contactInfo || null,
            eventSchedule: req.body.schedule ? JSON.stringify(req.body.schedule) : (req.body.eventSchedule || null),
            guests: req.body.guests ? JSON.stringify(req.body.guests) : null,
            metadata: Object.keys(metadata).length > 0 ? JSON.stringify(metadata) : null,
            isActive: true,
            orderIndex: 0
        };

        console.log('📝 Creating event in EventsContent with data:', eventData);

        const event = await db.eventsContent.create(eventData);


        res.status(201).json({
            success: true,
            event
        });
    } catch (error) {
        console.error('❌ Create event error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to create event',
            error: error.message 
        });
    }
});

// Update event (Admin only)
router.put('/events/:id', authenticateToken, requireRole(['ADMIN', 'admin', 'moderator']), [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').optional(),
    body('content').optional()
], async (req, res) => {
    try {
        const eventId = req.params.id;
        
        console.log('🚀 Request headers:', req.headers);
        console.log('🚀 Event ID:', eventId);
        
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success: false,
                errors: errors.array() 
            });
        }
        
        if (!eventId || eventId.trim() === '') {
            return res.status(400).json({ 
                success: false,
                message: 'Invalid event ID' 
            });
        }

        // Prepare update data for EventsContent model
        const updateData = {
            title: req.body.title,
            description: req.body.description || req.body.content || '',
            category: req.body.category,
            section: req.body.section || 'notices',
            isActive: req.body.isActive !== undefined ? req.body.isActive : true,
            updatedAt: new Date()
        };

        // Add optional fields if provided
        if (req.body.date) {
            updateData.eventDate = new Date(req.body.date);
        }
        if (req.body.time) {
            updateData.eventTime = req.body.time;
        }
        if (req.body.location) {
            updateData.venue = req.body.location;
        }
        if (req.body.imageUrl) {
            updateData.imageUrl = req.body.imageUrl;
        }
        if (req.body.author) {
            // Store author in organizer field since there's no author field
            updateData.organizer = req.body.author;
        }
        if (req.body.eventSchedule) {
            updateData.eventSchedule = req.body.eventSchedule;
        }
        if (req.body.validUntil) {
            // Store validUntil in metadata as JSON since there's no validUntil field
            let existingMetadata = {};
            if (req.body.metadata) {
                try {
                    existingMetadata = typeof req.body.metadata === 'string' ? JSON.parse(req.body.metadata) : req.body.metadata;
                } catch (e) {
                    console.error('Error parsing metadata:', e);
                    existingMetadata = {};
                }
            }
            existingMetadata.validUntil = req.body.validUntil;
            updateData.metadata = JSON.stringify(existingMetadata);
        }
        if (req.body.audience) {
            // Store audience in metadata as JSON since there's no audience field
            let existingMetadata = {};
            if (updateData.metadata) {
                try {
                    existingMetadata = JSON.parse(updateData.metadata);
                } catch (e) {
                    console.error('Error parsing existing metadata:', e);
                    existingMetadata = {};
                }
            } else if (req.body.metadata) {
                try {
                    existingMetadata = typeof req.body.metadata === 'string' ? JSON.parse(req.body.metadata) : req.body.metadata;
                } catch (e) {
                    console.error('Error parsing metadata:', e);
                    existingMetadata = {};
                }
            }
            existingMetadata.audience = req.body.audience;
            updateData.metadata = JSON.stringify(existingMetadata);
        }
        
        // Handle PDF files - store them in dedicated pdfFiles column
        console.log('🔍 Checking PDF files condition...');
        console.log('🔍 req.body.pdfFiles exists:', !!req.body.pdfFiles);
        console.log('🔍 req.body.pdfFiles is array:', Array.isArray(req.body.pdfFiles));
        console.log('🔍 req.body.pdfFiles value:', req.body.pdfFiles);
        
        if (req.body.pdfFiles && Array.isArray(req.body.pdfFiles)) {
            console.log('📄 Processing PDF files in /api/events route:', req.body.pdfFiles);
            console.log('📄 PDF files count:', req.body.pdfFiles.length);
            
            // Store PDF files in dedicated column
            updateData.pdfFiles = JSON.stringify(req.body.pdfFiles);
            
            console.log('📄 PDF files stored in dedicated column:', req.body.pdfFiles);
        } else {
            console.log('❌ PDF files condition not met - PDF files not processed');
            console.log('❌ req.body.pdfFiles:', req.body.pdfFiles);
            console.log('❌ Array.isArray(req.body.pdfFiles):', Array.isArray(req.body.pdfFiles));
        }

        console.log('📝 Final update data for /api/events route:', updateData);
        console.log('📝 Metadata in update data:', updateData.metadata);
        console.log('📝 PDF files in update data:', updateData.pdfFiles);
        
        // Update the event in EventsContent table
        const updatedEvent = await db.eventsContent.update(eventId, updateData);
        
        console.log('✅ Event updated successfully via /api/events route:', updatedEvent.id);
        console.log('✅ Updated event metadata:', updatedEvent.metadata);

        res.json({
            success: true,
            event: updatedEvent
        });
    } catch (error) {
        console.error('Update event error:', error);
        
        // Handle record not found error
        if (error.code === 'P2025') {
            return res.status(404).json({ 
                success: false,
                message: 'Event/Notice not found' 
            });
        }
        
        res.status(500).json({ 
            success: false,
            message: 'Failed to update event',
            error: error.message 
        });
    }
});

// Delete event (Admin only)
router.delete('/events/:id', authenticateToken, requireRole(['admin']), async (req, res) => {
    console.log('🗑️ DELETE /api/events/:id called');
    console.log('Event ID:', req.params.id);
    console.log('User:', req.user);
    
    try {
        const eventId = req.params.id;
        
        if (!eventId || eventId.trim() === '') {
            console.log('❌ Invalid event ID');
            return res.status(400).json({ 
                success: false,
                message: 'Invalid event ID' 
            });
        }

        console.log(`🗑️ Attempting to delete event/notice with ID: ${eventId}`);
        
        // Delete the event from EventsContent table
        const deletedEvent = await db.eventsContent.delete(eventId);

        console.log('✅ Event/Notice deleted successfully:', deletedEvent.title);

        res.json({ 
            success: true,
            message: 'Event/Notice deleted successfully' 
        });
    } catch (error) {
        console.error('❌ Delete event error:', error.message);
        console.error('Error code:', error.code);
        console.error('Full error:', error);
        
        // Handle record not found error
        if (error.code === 'P2025') {
            return res.status(404).json({ 
                success: false,
                message: 'Event/Notice not found' 
            });
        }
        
        res.status(500).json({ 
            success: false,
            message: 'Failed to delete event/notice',
            error: error.message 
        });
    }
});

// ===== BLOG API =====

// Get all blog posts
router.get('/blog', async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            category, 
            tag,
            featured 
        } = req.query;

        // Build where conditions
        const whereConditions = {
            status: 'published'
        };
        
        if (category) {
            whereConditions.category = category;
        }
        if (featured === 'true') {
            whereConditions.is_featured = true;
        }

        // Get blogs from database
        const posts = await db.blogs.findMany({
            where: whereConditions,
            orderBy: { created_at: 'desc' },
            skip: (page - 1) * limit,
            take: limit
        });
        
        // Get total count (blogs.count with where not supported)
        const allBlogs = await db.blogs.findMany().catch(() => []);
        const filteredBlogs = allBlogs.filter(blog => {
            if (whereConditions.status && blog.status !== whereConditions.status) return false;
            if (whereConditions.isFeatured !== undefined && blog.isFeatured !== whereConditions.isFeatured) return false;
            return true;
        });
        const total = filteredBlogs.length;

        res.json({
            success: true,
            posts: posts || [],
            totalPages: Math.ceil((total || 0) / limit),
            currentPage: parseInt(page),
            total: total || 0
        });
    } catch (error) {
        console.error('Blog API error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to fetch blog posts',
            error: error.message 
        });
    }
});

// Get single blog post
router.get('/blog/:id', async (req, res) => {
    try {
        const { data: post, error } = await supabase
            .from('blogs')
            .select('*')
            .eq('id', req.params.id)
            .eq('status', 'published')
            .single();
        
        if (error || !post) {
            return res.status(404).json({ 
                success: false,
                message: 'Blog post not found' 
            });
        }

        res.json({
            success: true,
            post
        });
    } catch (error) {
        console.error('Blog post API error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to fetch blog post',
            error: error.message 
        });
    }
});

// Create blog post (Admin only)
router.post('/blog', authenticateToken, requireRole(['admin', 'moderator']), [
    body('title').notEmpty().withMessage('Title is required'),
    body('content').notEmpty().withMessage('Content is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success: false,
                errors: errors.array() 
            });
        }

        const blogData = {
            ...req.body,
            author_id: req.user.id,
            created_at: new Date().toISOString(),
            status: 'draft'
        };

        const { data: post, error } = await supabase
            .from('blogs')
            .insert([blogData])
            .select()
            .single();

        if (error) throw error;

        res.status(201).json({
            success: true,
            post
        });
    } catch (error) {
        console.error('Create blog error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to create blog post',
            error: error.message 
        });
    }
});

// Update blog post (Admin only)
router.put('/blog/:id', authenticateToken, requireRole(['admin', 'moderator']), [
    body('title').notEmpty().withMessage('Title is required'),
    body('content').notEmpty().withMessage('Content is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success: false,
                errors: errors.array() 
            });
        }

        const { data: post, error } = await supabase
            .from('blogs')
            .update({
                ...req.body,
                updated_at: new Date().toISOString()
            })
            .eq('id', req.params.id)
            .select()
            .single();

        if (error || !post) {
            return res.status(404).json({ 
                success: false,
                message: 'Blog post not found' 
            });
        }

        res.json({
            success: true,
            post
        });
    } catch (error) {
        console.error('Update blog error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to update blog post',
            error: error.message 
        });
    }
});

// Delete blog post (Admin only)
router.delete('/blog/:id', authenticateToken, requireRole(['admin']), async (req, res) => {
    try {
        const { error } = await supabase
            .from('blogs')
            .delete()
            .eq('id', req.params.id);
        
        if (error) throw error;

        res.json({ 
            success: true,
            message: 'Blog post deleted successfully' 
        });
    } catch (error) {
        console.error('Delete blog error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to delete blog post',
            error: error.message 
        });
    }
});

// ===== GALLERY API =====

// Get all gallery content
router.get('/gallery', async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 12, 
            category,
            itemType,
            featured 
        } = req.query;

        // Build where clause for Prisma
        const where = {};
        
        if (category) {
            where.category = category;
        }
        if (itemType) {
            where.itemType = itemType;
        }
        if (featured === 'true') {
            where.isFeatured = true;
        }
        // Only show active items by default
        where.isActive = true;

        // Calculate offset
        const offset = (parseInt(page) - 1) * parseInt(limit);

        // Fetch gallery items using Prisma
        const [items, total] = await Promise.all([
            db.gallery.findMany({
                where,
                skip: offset,
                take: parseInt(limit),
                orderBy: { orderIndex: 'asc' },
                include: {
                    album: true,
                    items: {
                        where: { isActive: true },
                        orderBy: { orderIndex: 'asc' }
                    }
                }
            }),
            db.gallery.count({ where })
        ]);

        res.json({
            success: true,
            galleries: items || [],
            totalPages: Math.ceil((total || 0) / parseInt(limit)),
            currentPage: parseInt(page),
            total: total || 0
        });
    } catch (error) {
        console.error('Gallery API error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to fetch gallery',
            error: error.message 
        });
    }
});

// Get single gallery item
router.get('/gallery/:id', async (req, res) => {
    try {
        const item = await db.gallery.findFirst({
            where: {
                id: req.params.id,
                isActive: true
            },
            include: {
                album: true,
                items: {
                    where: { isActive: true },
                    orderBy: { orderIndex: 'asc' }
                }
            }
        });
        
        if (!item) {
            return res.status(404).json({ 
                success: false,
                message: 'Gallery item not found' 
            });
        }

        res.json({
            success: true,
            item
        });
    } catch (error) {
        console.error('Gallery API error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to fetch gallery item',
            error: error.message 
        });
    }
});

// Create gallery item (Admin only)
router.post('/gallery', authenticateToken, requireRole(['admin', 'moderator']), [
    body('title').notEmpty().withMessage('Title is required'),
    body('itemType').notEmpty().withMessage('Item type is required'),
    body('imageUrl').notEmpty().withMessage('Image URL is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success: false,
                errors: errors.array() 
            });
        }

        const galleryData = {
            title: req.body.title,
            description: req.body.description || null,
            imageUrl: req.body.imageUrl,
            videoUrl: req.body.videoUrl || null,
            category: req.body.category || null,
            itemType: req.body.itemType,
            albumId: req.body.albumId || null,
            icon: req.body.icon || null,
            orderIndex: req.body.orderIndex || 0,
            tags: req.body.tags || '',
            isFeatured: req.body.isFeatured || false,
            isActive: req.body.isActive !== undefined ? req.body.isActive : true,
            uploadedBy: req.user.id
        };

        const newItem = await db.gallery.create(galleryData);

        res.status(201).json({
            success: true,
            message: 'Gallery item created successfully',
            item: newItem
        });
    } catch (error) {
        console.error('Create gallery error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to create gallery item',
            error: error.message 
        });
    }
});

// Update gallery item (Admin only)
router.put('/gallery/:id', authenticateToken, requireRole(['admin', 'moderator']), [
    body('title').notEmpty().withMessage('Title is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success: false,
                errors: errors.array() 
            });
        }

        const updateData = {
            title: req.body.title,
            description: req.body.description || null,
            imageUrl: req.body.imageUrl,
            videoUrl: req.body.videoUrl || null,
            category: req.body.category || null,
            itemType: req.body.itemType,
            albumId: req.body.albumId || null,
            icon: req.body.icon || null,
            orderIndex: req.body.orderIndex,
            tags: req.body.tags || '',
            isFeatured: req.body.isFeatured,
            isActive: req.body.isActive
        };

        // Remove undefined values
        Object.keys(updateData).forEach(key => {
            if (updateData[key] === undefined) {
                delete updateData[key];
            }
        });

        const updatedItem = await db.gallery.update(req.params.id, updateData);

        if (!updatedItem) {
            return res.status(404).json({ 
                success: false,
                message: 'Gallery item not found' 
            });
        }

        res.json({
            success: true,
            message: 'Gallery item updated successfully',
            item: updatedItem
        });
    } catch (error) {
        console.error('Update gallery error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to update gallery item',
            error: error.message 
        });
    }
});

// Delete gallery item (Admin only)
router.delete('/gallery/:id', authenticateToken, requireRole(['admin']), async (req, res) => {
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
            message: 'Failed to delete gallery item',
            error: error.message 
        });
    }
});

// ===== CONTACT API =====

// Import email functions
const { sendContactNotificationEmail, sendContactAutoReplyEmail } = require('../config/email');

// Submit contact form
router.post('/contact', [
    body('full-name').notEmpty().withMessage('Full name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('phone').notEmpty().withMessage('Phone number is required'),
    body('country-code').notEmpty().withMessage('Country code is required'),
    body('message').notEmpty().withMessage('Message is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success: false,
                errors: errors.array() 
            });
        }

        console.log('📧 Contact form submission received:', {
            name: req.body['full-name'],
            email: req.body.email,
            phone: req.body.phone,
            countryCode: req.body['country-code']
        });

        // Extract client information
        const clientIP = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'];
        const userAgent = req.headers['user-agent'];

        // Prepare contact submission data
        const contactData = {
            fullName: req.body['full-name'],
            email: req.body.email,
            countryCode: req.body['country-code'],
            phone: req.body.phone,
            message: req.body.message,
            ipAddress: clientIP,
            userAgent: userAgent,
            status: 'NEW'
        };

        // Save to database
        console.log('💾 Saving contact submission to database...');
        // MySQL wrapper expects data directly, not wrapped in { data: ... }
        const savedSubmission = await db.contactSubmissions.create(contactData);

        console.log('✅ Contact submission saved with ID:', savedSubmission.id);

        // Send emails asynchronously (don't wait for them)
        console.log('📤 Sending emails asynchronously...');
        
        // Send notification email to admins (fire and forget)
        sendContactNotificationEmail(savedSubmission)
            .then(result => {
                if (result.success) {
                    console.log('✅ Admin notification email sent successfully');
                } else {
                    console.error('❌ Failed to send admin notification email:', result.error);
                }
            })
            .catch(error => {
                console.error('❌ Admin notification email error:', error);
            });

        // Send auto-reply email to user (fire and forget)
        sendContactAutoReplyEmail(savedSubmission)
            .then(result => {
                if (result.success) {
                    console.log('✅ Auto-reply email sent successfully');
                } else {
                    console.error('❌ Failed to send auto-reply email:', result.error);
                }
            })
            .catch(error => {
                console.error('❌ Auto-reply email error:', error);
            });

        // Return success response
        res.json({ 
            success: true,
            message: 'Thank you for your message. We have received your inquiry and will contact you soon!',
            submissionId: savedSubmission.id
        });

    } catch (error) {
        console.error('❌ Contact API error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to send message. Please try again later.',
            error: error.message 
        });
    }
});

// ===== HEALTH CHECK =====

// Health check endpoint
router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'API is running',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// ===== ABOUT CONTENT API =====

// Get about content by section
router.get('/content/about', async (req, res) => {
    try {
        const { section } = req.query;
        console.log('🔍 API ROUTE: /api/content/about called with section:', section);
        console.log('🔍 Request headers:', req.headers);
        
        if (section) {
            // Get specific section content
            console.log('Fetching about content for section:', section);
            const content = await db.aboutContent.findBySection(section);
            console.log('About content found:', content);
            res.json({
                success: true,
                data: content
            });
        } else {
            // Get all about content
            console.log('Fetching all about content');
            const content = await db.aboutContent.findAll();
            console.log('All about content found:', content);
            res.json({
                success: true,
                data: content
            });
        }
    } catch (error) {
        console.error('Error fetching about content:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch about content'
        });
    }
});

// Create or update about content
router.post('/content/about', authenticateToken, async (req, res) => {
    try {
        const { section, data } = req.body;
        
        if (!section || !data) {
            return res.status(400).json({
                success: false,
                message: 'Section and data are required'
            });
        }

        // Handle different section types
        let result;
        if (Array.isArray(data)) {
            // Handle array of content items (like timeline, leadership, etc.)
            result = await db.aboutContent.bulkCreate(data);
        } else {
            // Handle single content item
            result = await db.aboutContent.create(data);
        }

        // Invalidate cache
        invalidateCache(CACHE_PREFIXES.ABOUT_CONTENT);

        res.json({
            success: true,
            message: 'About content saved successfully',
            data: result
        });
    } catch (error) {
        console.error('Error saving about content:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to save about content'
        });
    }
});

// Update specific about content item
router.put('/content/about/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const result = await db.aboutContent.update(id, updates);

        // Invalidate cache
        invalidateCache(CACHE_PREFIXES.ABOUT_CONTENT);

        res.json({
            success: true,
            message: 'About content updated successfully',
            data: result
        });
    } catch (error) {
        console.error('Error updating about content:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update about content'
        });
    }
});

// Delete about content item
router.delete('/content/about/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;

        await db.aboutContent.delete(id);

        // Invalidate cache
        invalidateCache(CACHE_PREFIXES.ABOUT_CONTENT);

        res.json({
            success: true,
            message: 'About content deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting about content:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete about content'
        });
    }
});


// Get downlods content by section
router.get('/content/downloads', async (req, res) => {
    try {
        const { section } = req.query;
        console.log('🔍 API ROUTE: /api/content/downloads called with section:', section);
        console.log('🔍 Request headers:', req.headers);
        
        if (section) {
            // Get specific section content
            console.log('Fetching downloads content for section:', section);
            const content = await db.aboutContent.findBySection(section);
            console.log('Downloads content found:', content);
            res.json({
                success: true,
                data: content
            });
        } else {
            // Get all about content
            console.log('Fetching all downloads content');
            const content = await db.aboutContent.findAll();
            console.log('All downloads content found:', content);
            res.json({
                success: true,
                data: content
            });
        }
    } catch (error) {
        console.error('Error fetching downloads content:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch downloads content'
        });
    }
});
module.exports = router;
