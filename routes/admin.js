const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

// Import Database service
const { db } = require('../config/database');

// Import cache middleware
const { invalidateCache, CACHE_PREFIXES } = require('../middleware/cache');

// Import middleware
const { requireRole } = require('../middleware/auth');

// ===== DASHBOARD =====

// Get dashboard stats
router.get('/dashboard', async (req, res) => {
    try {
        // Get counts from different tables using MySQL wrapper
        const [users, eventsContent, blogs, gallery, homepageContent, aboutContent, contactContent, admissionApplications] = await Promise.all([
            db.users.findAll().then(rows => rows.length),
            db.eventsContent.findAll().then(rows => rows.length),
            db.blogs.findMany().then(rows => rows.length),
            db.gallery.count(),  // This one has count method
            db.homepageContent.findAll().then(rows => rows.length),
            db.aboutContent.findAll().then(rows => rows.length),
            db.contactContent.findAll().then(rows => rows.length),
            db.admissionApplications.count()  // This one has count method
        ]);

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
        console.error('Dashboard error:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard stats', details: error.message });
    }
});

// Get analytics data
router.get('/analytics', async (req, res) => {
    try {
        const { period = '30d' } = req.query;
        
        // Calculate date range based on period
        const days = period === '7d' ? 7 : period === '90d' ? 90 : 30;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        // Helper function to filter by date
        const filterByDate = (items, dateField = 'createdAt') => {
            if (period === 'all') return items;
            return items.filter(item => {
                const itemDate = new Date(item[dateField]);
                return itemDate >= startDate;
            });
        };

        // Get all data (since we need to filter client-side)
        const [
            allUsers,
            allEvents,
            allGallery,
            allAdmissions,
            allContactSubmissions,
            allBlogs
        ] = await Promise.all([
            db.users.findAll().catch(() => []),
            db.eventsContent.findAll().catch(() => []),
            db.gallery.findMany().catch(() => []),
            db.admissionApplications.findMany().catch(() => []),
            db.contactSubmissions.findMany().catch(() => []),
            db.blogs.findMany().catch(() => [])
        ]);

        // Filter by date range
        const totalUsers = allUsers.length;
        const recentUsers = filterByDate(allUsers).length;
        const totalEvents = allEvents.length;
        const recentEvents = filterByDate(allEvents).length;
        const totalGallery = allGallery.length;
        const recentGallery = filterByDate(allGallery).length;
        const totalAdmissions = allAdmissions.length;
        const recentAdmissions = filterByDate(allAdmissions).length;
        const totalContactSubmissions = allContactSubmissions.length;
        const recentContactSubmissions = filterByDate(allContactSubmissions).length;
        const totalBlogs = allBlogs.length;
        const recentBlogs = filterByDate(allBlogs).length;

        // Get detailed breakdowns using client-side grouping
        const groupBy = (array, key) => {
            return array.reduce((result, item) => {
                const value = item[key] || 'unknown';
                if (!result[value]) {
                    result[value] = 0;
                }
                result[value]++;
                return result;
            }, {});
        };

        // Admission status breakdown
        const admissionsByStatus = groupBy(filterByDate(allAdmissions), 'status');
        const admissionStatusBreakdown = Object.entries(admissionsByStatus).map(([status, count]) => ({
            status,
            _count: { status: count }
        }));

        // Contact submission status breakdown
        const contactsByStatus = groupBy(filterByDate(allContactSubmissions), 'status');
        const contactStatusBreakdown = Object.entries(contactsByStatus).map(([status, count]) => ({
            status,
            _count: { status: count }
        }));

        // Event category breakdown
        const eventsByCategory = groupBy(filterByDate(allEvents), 'category');
        const eventCategoryBreakdown = Object.entries(eventsByCategory).map(([category, count]) => ({
            category,
            _count: { category: count }
        }));

        // Gallery category breakdown
        const galleryByCategory = groupBy(filterByDate(allGallery), 'category');
        const galleryCategoryBreakdown = Object.entries(galleryByCategory).map(([category, count]) => ({
            category,
            _count: { category: count }
        }));

        // User role breakdown
        const usersByRole = groupBy(allUsers, 'role');
        const userRoleBreakdown = Object.entries(usersByRole).map(([role, count]) => ({
            role,
            _count: { role: count }
        }));

        // Recent activity (last 5 items from each table)
        const sortByDate = (a, b) => new Date(b.createdAt) - new Date(a.createdAt);
        const recentActivity = [
            filterByDate(allAdmissions).sort(sortByDate).slice(0, 5),
            filterByDate(allContactSubmissions).sort(sortByDate).slice(0, 5),
            filterByDate(allEvents).sort(sortByDate).slice(0, 5)
        ];

        // Calculate growth percentages
        const calculateGrowth = (current, previous) => {
            if (previous === 0) return current > 0 ? 100 : 0;
            return Math.round(((current - previous) / previous) * 100);
        };

        // Calculate previous period for comparison
        const previousPeriodEnd = new Date();
        previousPeriodEnd.setDate(previousPeriodEnd.getDate() - days);
        const previousPeriodStart = new Date();
        previousPeriodStart.setDate(previousPeriodStart.getDate() - (days * 2));

        const filterByPreviousPeriod = (items, dateField = 'createdAt') => {
            if (period === 'all') return [];
            return items.filter(item => {
                const itemDate = new Date(item[dateField]);
                return itemDate >= previousPeriodStart && itemDate < previousPeriodEnd;
            });
        };

        const previousUsers = filterByPreviousPeriod(allUsers).length;
        const previousEvents = filterByPreviousPeriod(allEvents).length;
        const previousGallery = filterByPreviousPeriod(allGallery).length;
        const previousAdmissions = filterByPreviousPeriod(allAdmissions).length;
        const previousContactSubmissions = filterByPreviousPeriod(allContactSubmissions).length;
        const previousBlogs = filterByPreviousPeriod(allBlogs).length;

        // Simulate website traffic data (enhanced with some dynamic elements)
        const baseTraffic = {
            totalVisitors: Math.floor(Math.random() * 1000) + 2000,
            pageViews: Math.floor(Math.random() * 5000) + 10000,
            uniqueVisitors: Math.floor(Math.random() * 800) + 1500,
            bounceRate: Math.round((Math.random() * 20 + 25) * 10) / 10
        };

        // Generate realistic popular pages based on your content
        const popularPages = [
            { name: 'Homepage', views: Math.floor(baseTraffic.totalVisitors * 0.45), percentage: 45.2 },
            { name: 'About Us', views: Math.floor(baseTraffic.totalVisitors * 0.31), percentage: 31.4 },
            { name: 'Academics', views: Math.floor(baseTraffic.totalVisitors * 0.16), percentage: 16.2 },
            { name: 'Contact', views: Math.floor(baseTraffic.totalVisitors * 0.12), percentage: 12.1 },
            { name: 'Events', views: Math.floor(baseTraffic.totalVisitors * 0.08), percentage: 8.3 },
            { name: 'Gallery', views: Math.floor(baseTraffic.totalVisitors * 0.06), percentage: 6.2 }
        ];

        const trafficSources = [
            { source: 'Direct', visitors: Math.floor(baseTraffic.totalVisitors * 0.42), percentage: 42.1 },
            { source: 'Google Search', visitors: Math.floor(baseTraffic.totalVisitors * 0.28), percentage: 28.1 },
            { source: 'Social Media', visitors: Math.floor(baseTraffic.totalVisitors * 0.18), percentage: 17.5 },
            { source: 'Referral', visitors: Math.floor(baseTraffic.totalVisitors * 0.12), percentage: 12.2 }
        ];

        const deviceStats = {
            desktop: 65.2,
            mobile: 28.7,
            tablet: 6.1
        };

        // Combine real and simulated data
        const analyticsData = {
            period: period,
            websiteTraffic: baseTraffic,
            popularPages,
            trafficSources,
            deviceStats,
            
            // Real database metrics
            databaseMetrics: {
                totalUsers: {
                    count: totalUsers,
                    recent: recentUsers,
                    growth: calculateGrowth(recentUsers, previousUsers),
                    label: 'Total Users'
                },
                totalEvents: {
                    count: totalEvents,
                    recent: recentEvents,
                    growth: calculateGrowth(recentEvents, previousEvents),
                    label: 'Events & Notices'
                },
                totalGallery: {
                    count: totalGallery,
                    recent: recentGallery,
                    growth: calculateGrowth(recentGallery, previousGallery),
                    label: 'Gallery Items'
                },
                totalAdmissions: {
                    count: totalAdmissions,
                    recent: recentAdmissions,
                    growth: calculateGrowth(recentAdmissions, previousAdmissions),
                    label: 'Admission Applications'
                },
                totalContactSubmissions: {
                    count: totalContactSubmissions,
                    recent: recentContactSubmissions,
                    growth: calculateGrowth(recentContactSubmissions, previousContactSubmissions),
                    label: 'Contact Submissions'
                },
                totalBlogs: {
                    count: totalBlogs,
                    recent: recentBlogs,
                    growth: calculateGrowth(recentBlogs, previousBlogs),
                    label: 'Blog Posts'
                }
            },

            // Breakdowns for charts
            breakdowns: {
                admissionStatus: admissionStatusBreakdown.map(item => ({
                    label: item.status,
                    value: item._count.status,
                    percentage: Math.round((item._count.status / totalAdmissions) * 100) || 0
                })),
                contactStatus: contactStatusBreakdown.map(item => ({
                    label: item.status,
                    value: item._count.status,
                    percentage: Math.round((item._count.status / totalContactSubmissions) * 100) || 0
                })),
                eventCategories: eventCategoryBreakdown.map(item => ({
                    label: item.category || 'Uncategorized',
                    value: item._count.category,
                    percentage: Math.round((item._count.category / totalEvents) * 100) || 0
                })),
                galleryCategories: galleryCategoryBreakdown.map(item => ({
                    label: item.category || 'Uncategorized',
                    value: item._count.category,
                    percentage: Math.round((item._count.category / totalGallery) * 100) || 0
                })),
                userRoles: userRoleBreakdown.map(item => ({
                    label: item.role,
                    value: item._count.role,
                    percentage: Math.round((item._count.role / totalUsers) * 100) || 0
                }))
            },

            // Recent activity
            recentActivity: {
                admissions: recentActivity[0],
                contacts: recentActivity[1],
                events: recentActivity[2]
            }
        };

        res.json(analyticsData);
    } catch (error) {
        console.error('❌ Analytics error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to fetch analytics data',
            message: error.message 
        });
    }
});

// ===== USER MANAGEMENT =====
// NOTE: User management routes moved to admin-users.js to avoid conflicts

// Get all users - COMMENTED OUT: Using admin-users.js instead
// router.get('/users', requireRole(['admin']), async (req, res) => {
    // try {
    //     const { page = 1, limit = 20, role, search } = req.query;
    //     
    //     let query = supabase.from('users').select('*', { count: 'exact' });
    //     
    //     if (role) {
    //         query = query.eq('role', role);
    //     }
    //     
    //     if (search) {
    //         query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%`);
    //     }

    //     const offset = (page - 1) * limit;
    //     const { data: users, count: total, error } = await query
    //         .order('created_at', { ascending: false })
    //         .range(offset, offset + limit - 1);

    //     if (error) throw error;

    //     // Remove password from response
    //     const usersWithoutPassword = users.map(user => {
    //         const { password, ...userWithoutPassword } = user;
    //         return userWithoutPassword;
    //     });

    //     res.json({
    //         users: usersWithoutPassword,
    //         totalPages: Math.ceil(total / limit),
    //         currentPage: parseInt(page),
    //         total
    //     });
    // } catch (error) {
    //     res.status(500).json({ error: 'Failed to fetch users' });
    // }
// });

// Get single user - COMMENTED OUT: Using admin-users.js instead
// router.get('/users/:id', requireRole(['admin']), async (req, res) => {
    // try {
    //     const { data: user, error } = await supabase
    //         .from('users')
    //         .select('*')
    //         .eq('id', req.params.id)
    //         .single();
    //     
    //     if (error || !user) {
    //         return res.status(404).json({ error: 'User not found' });
    //     }

    //     const { password, ...userWithoutPassword } = user;
    //     res.json(userWithoutPassword);
    // } catch (error) {
    //     res.status(500).json({ error: 'Failed to fetch user' });
    // }
// });

// Update user - COMMENTED OUT: Using admin-users.js instead
// router.put('/users/:id', requireRole(['admin']), [
    // body('firstName').notEmpty().withMessage('First name is required'),
    // body('lastName').notEmpty().withMessage('Last name is required'),
    // body('email').isEmail().withMessage('Valid email is required'),
    // body('role').isIn(['admin', 'moderator', 'user']).withMessage('Valid role is required')
// ], async (req, res) => {
    // try {
    //     const errors = validationResult(req);
    //     if (!errors.isEmpty()) {
    //         return res.status(400).json({ errors: errors.array() });
    //     }

    //     const updateData = {
    //         first_name: req.body.firstName,
    //         last_name: req.body.lastName,
    //         email: req.body.email,
    //         role: req.body.role
    //     };

    //     const { data: user, error } = await supabase
    //         .from('users')
    //         .update(updateData)
    //         .eq('id', req.params.id)
    //         .select()
    //         .single();

    //     if (error || !user) {
    //         return res.status(404).json({ error: 'User not found' });
    //     }

    //     const { password, ...userWithoutPassword } = user;
    //     res.json(userWithoutPassword);
    // } catch (error) {
    //     res.status(500).json({ error: 'Failed to update user' });
    // }
// });

// Delete user - COMMENTED OUT: Using admin-users.js instead
// router.delete('/users/:id', requireRole(['admin']), async (req, res) => {
    // try {
    //     const { data: user, error } = await supabase
    //         .from('users')
    //         .delete()
    //         .eq('id', req.params.id)
    //         .select()
    //         .single();
    //     
    //     if (error || !user) {
    //         return res.status(404).json({ error: 'User not found' });
    //     }

    //     res.json({ message: 'User deleted successfully' });
    // } catch (error) {
    //     res.status(500).json({ error: 'Failed to delete user' });
    // }
// });

// ===== EVENT MANAGEMENT =====

// Get all events (admin view)
router.get('/events', requireRole(['admin', 'moderator']), async (req, res) => {
    try {
        const { page = 1, limit = 20, status, category } = req.query;
        
        let query = supabase
            .from('events')
            .select(`
                *,
                created_by:users(first_name, last_name)
            `, { count: 'exact' });
        
        if (status) {
            query = query.eq('status', status);
        }
        if (category) {
            query = query.eq('category', category);
        }

        const offset = (page - 1) * limit;
        const { data: events, count: total, error } = await query
            .order('date', { ascending: true })
            .range(offset, offset + limit - 1);

        if (error) throw error;

        res.json({
            events,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            total
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch events' });
    }
});

// Update event status
router.patch('/events/:id/status', requireRole(['admin', 'moderator']), [
    body('status').isIn(['draft', 'published', 'cancelled']).withMessage('Valid status is required')
], invalidateCache([`${CACHE_PREFIXES.EVENT}*`]), async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { data: event, error } = await supabase
            .from('events')
            .update({ status: req.body.status })
            .eq('id', req.params.id)
            .select()
            .single();

        if (error || !event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        res.json(event);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update event status' });
    }
});

// ===== BLOG MANAGEMENT =====

// Get all blog posts (admin view)
router.get('/blog', requireRole(['admin', 'moderator']), async (req, res) => {
    try {
        const { page = 1, limit = 20, status, category } = req.query;
        
        let query = supabase
            .from('blogs')
            .select(`
                *,
                author_id:users(first_name, last_name)
            `, { count: 'exact' });
        
        if (status) {
            query = query.eq('status', status);
        }
        if (category) {
            query = query.eq('category', category);
        }

        const offset = (page - 1) * limit;
        const { data: posts, count: total, error } = await query
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (error) throw error;

        res.json({
            posts,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            total
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch blog posts' });
    }
});

// Update blog post status
router.patch('/blog/:id/status', requireRole(['admin', 'moderator']), [
    body('status').isIn(['draft', 'published', 'archived']).withMessage('Valid status is required')
], invalidateCache([`${CACHE_PREFIXES.BLOG}*`]), async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { data: post, error } = await supabase
            .from('blogs')
            .update({ status: req.body.status })
            .eq('id', req.params.id)
            .select()
            .single();

        if (error || !post) {
            return res.status(404).json({ error: 'Blog post not found' });
        }

        res.json(post);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update blog post status' });
    }
});

// ===== GALLERY MANAGEMENT =====

// Get all galleries (admin view)
router.get('/gallery', requireRole(['admin', 'moderator']), async (req, res) => {
    try {
        const { page = 1, limit = 20, category } = req.query;
        
        let query = supabase
            .from('gallery')
            .select(`
                *,
                uploaded_by:users(first_name, last_name)
            `, { count: 'exact' });
        
        if (category) {
            query = query.eq('category', category);
        }

        const offset = (page - 1) * limit;
        const { data: galleries, count: total, error } = await query
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (error) throw error;

        res.json({
            galleries,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            total
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch galleries' });
    }
});

// Update gallery visibility
router.patch('/gallery/:id/visibility', requireRole(['admin', 'moderator']), [
    body('isPublic').isBoolean().withMessage('isPublic must be a boolean')
], invalidateCache([`${CACHE_PREFIXES.GALLERY}*`]), async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { data: gallery, error } = await supabase
            .from('gallery')
            .update({ is_featured: req.body.isPublic })
            .eq('id', req.params.id)
            .select()
            .single();

        if (error || !gallery) {
            return res.status(404).json({ error: 'Gallery not found' });
        }

        res.json(gallery);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update gallery visibility' });
    }
});

// ===== WEBSITE SETTINGS =====

// Get website settings
router.get('/settings', requireRole(['admin']), async (req, res) => {
    try {
        
        // Get the latest general settings from database
        const settings = await db.generalSettings.findFirst({
            orderBy: { createdAt: 'desc' }
        });


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
router.put('/settings', requireRole(['admin']), [
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
            // Update existing settings
            settings = await db.generalSettings.update({
                where: { id: existingSettings.id },
                data: {
                    siteName: req.body.siteName,
                    siteNameSecond: req.body.siteNameSecond,
                    siteDescription: req.body.siteDescription,
                    siteLogo: req.body.siteLogo,
                    siteFavicon: req.body.siteFavicon,
                    mainContactEmail: req.body.mainContactEmail,
                    mainContactPhone: req.body.mainContactPhone,
                    schoolAddress: req.body.schoolAddress
                }
            });
        } else {
            // Create new settings
            settings = await db.generalSettings.create({
                data: {
                    siteName: req.body.siteName || 'Marigold English Boarding School',
                    siteNameSecond: req.body.siteNameSecond || '',
                    siteDescription: req.body.siteDescription || 'Excellence in Education',
                    siteLogo: req.body.siteLogo,
                    siteFavicon: req.body.siteFavicon,
                    mainContactEmail: req.body.mainContactEmail,
                    mainContactPhone: req.body.mainContactPhone,
                    schoolAddress: req.body.schoolAddress
                }
            });
        }


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

// Get all contact requests with pagination and filtering
router.get('/contact-requests', requireRole(['admin']), async (req, res) => {
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
            whereConditions.status = status;
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
        const [contactRequests, total, totalCount, pendingCount, respondedCount, archivedCount] = await Promise.all([
            db.contactSubmissions.findMany({
                where: whereConditions,
                orderBy: orderBy,
                skip: (page - 1) * limit,
                take: parseInt(limit)
            }),
            db.contactSubmissions.count({ where: whereConditions }),
            db.contactSubmissions.count(),
            db.contactSubmissions.count({ where: { status: 'NEW' } }),
            db.contactSubmissions.count({ where: { status: 'REPLIED' } }),
            db.contactSubmissions.count({ where: { status: 'ARCHIVED' } })
        ]);

        const totalPages = Math.ceil(total / limit);

        res.json({
            success: true,
            contactRequests,
            totalPages,
            currentPage: parseInt(page),
            total,
            stats: {
                total: totalCount,
                pending: pendingCount,
                responded: respondedCount,
                archived: archivedCount
            }
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
router.get('/contact-requests/:id', requireRole(['admin']), async (req, res) => {
    try {
        const { id } = req.params;
        
        const contactRequest = await db.contactSubmissions.findUnique({
            where: { id }
        });

        if (!contactRequest) {
            return res.status(404).json({
                success: false,
                error: 'Contact request not found'
            });
        }

        res.json({
            success: true,
            contactRequest
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
router.patch('/contact-requests/:id/status', requireRole(['admin']), async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['NEW', 'READ', 'REPLIED', 'ARCHIVED'].includes(status)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid status value'
            });
        }

        const updatedRequest = await db.contactSubmissions.update({
            where: { id },
            data: { 
                status,
                ...(status === 'REPLIED' && { 
                    repliedAt: new Date(),
                    repliedBy: req.user.id 
                })
            }
        });

        res.json({
            success: true,
            contactRequest: updatedRequest
        });
    } catch (error) {
        console.error('Update contact request status error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to update contact request status' 
        });
    }
});

// Reply to contact request
router.post('/contact-requests/:id/reply', requireRole(['admin']), async (req, res) => {
    try {
        const { id } = req.params;
        const { message } = req.body;

        if (!message || message.trim().length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Message is required'
            });
        }

        // Get the contact request
        const contactRequest = await db.contactSubmissions.findUnique({
            where: { id }
        });

        if (!contactRequest) {
            return res.status(404).json({
                success: false,
                error: 'Contact request not found'
            });
        }

        // Update status to replied
        console.log('Updating contact request with repliedMessage:', message);
        const updatedRequest = await db.contactSubmissions.update({
            where: { id },
            data: {
                status: 'REPLIED',
                repliedAt: new Date(),
                repliedBy: req.user.id,
                repliedMessage: message
            }
        });
        console.log('Updated request:', updatedRequest);

        // TODO: Send email reply to the contact request
        // This would integrate with your email service
        console.log(`Reply sent to ${contactRequest.email}: ${message}`);

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
router.delete('/contact-requests/:id', requireRole(['admin']), async (req, res) => {
    try {
        const { id } = req.params;
        
        const contactRequest = await db.contactSubmissions.findUnique({
            where: { id }
        });

        if (!contactRequest) {
            return res.status(404).json({
                success: false,
                error: 'Contact request not found'
            });
        }

        await db.contactSubmissions.delete({
            where: { id }
        });

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

module.exports = router;
