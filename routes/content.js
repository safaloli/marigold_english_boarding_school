const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');


// Import Database service
const { db } = require('../config/database');

// Import video thumbnail generator
const { generateVideoThumbnail, generateDisplayThumbnail } = require('../utils/videoThumbnailGenerator');

// Import middleware
const { authenticateToken, requireRole } = require('../middleware/auth');


// ===== HOMEPAGE CONTENT =====
router.get('/home', async (req, res) => {
    try {
        console.log('📥 Fetching homepage content...');
        
        // Set cache headers - no cache for admin to always get fresh data
        res.set({
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        });
        
        const allContent = await db.homepageContent.findAll();
        const organizedContent = {
            hero: {},
            quick_facts: {},
            why_choose: {},
            mission: {},
            programs: {},
            neb_toppers: {},
            alumni: {},
            testimonials: {},
            gallery: {},
            contact: {}
        };
        allContent.forEach(item => {
            if (!organizedContent[item.section]) {
                organizedContent[item.section] = {};
            }
            organizedContent[item.section][item.key] = item;
        });
        
        // Debug logging
        console.log('🔍 Hero main_title data:', organizedContent.hero.main_title);


        const content = {
                hero: {

                title: organizedContent.hero.main_title?.title || 'Where Learning Meets Excellence.',
                badge: organizedContent.hero.badge?.content || 'Excellence in Education Since 1995',
                description: organizedContent.hero.main_title?.content || 'Inspiring students with knowledge, values, and opportunities to grow.',
                primaryButton: {
                    text: organizedContent.hero.primary_button?.title || 'Apply Now',
                    link: organizedContent.hero.primary_button?.linkUrl || '/contact.html'
                },
                secondaryButton: {
                    text: organizedContent.hero.secondary_button?.title || 'Contact Us',
                    link: organizedContent.hero.secondary_button?.linkUrl || '/contact.html'
                },
                stats: organizedContent.hero.stats?.metadata ? JSON.parse(organizedContent.hero.stats.metadata) : {
                    students: '1500+',
                    label: 'Happy Students'
                },
                backgroundImage: organizedContent.hero.background_image?.imageUrl || '',
                enabled: Boolean(organizedContent.hero.main_title?.isActive)
            },
            quickFacts: {
                title: organizedContent.quick_facts.section_title?.title || 'Our results in numbers',
                facts: [],
                enabled: Boolean(organizedContent.quick_facts.section_title?.isActive)
            },
            whyChoose: {
                title: organizedContent.why_choose.section_title?.title || 'Why Choose Marigold?',
                subtitle: organizedContent.why_choose.section_title?.description || '',
                backgroundImage: organizedContent.why_choose.background_image?.imageUrl || '',
                benefits: [],
                enabled: Boolean(organizedContent.why_choose.section_title?.isActive)
            },
            mission: {
                title: organizedContent.mission.section_title?.title || 'Our Mission & Vision',
                mission: {
                    title: organizedContent.mission.mission_card?.title || 'Mission',
                    description: organizedContent.mission.mission_card?.description || 'To provide quality education that empowers students with knowledge, skills, and values to become responsible global citizens.'
                },
                vision: {
                    title: organizedContent.mission.vision_card?.title || 'Vision',
                    description: organizedContent.mission.vision_card?.description || 'To be a leading educational institution that inspires excellence, fosters innovation, and prepares students for global citizenship.'
                },
                values: {
                    title: organizedContent.mission.values_card?.title || 'Values',
                    description: organizedContent.mission.values_card?.description || 'Excellence, Integrity, Innovation, Compassion, and Respect - these core values guide everything we do.'
                },
                enabled: Boolean(organizedContent.mission.section_title?.isActive)
            },
            programs: {
                title: organizedContent.programs.section_title?.title || 'Academic Programs',
                subtitle: organizedContent.programs.section_title?.description || 'Comprehensive education from early years to secondary level',
                programs: [],
                enabled: Boolean(organizedContent.programs.section_title?.isActive)
                },
            nebToppers: {
                title: organizedContent.neb_toppers.section_title?.title || 'NEB Toppers',
                subtitle: organizedContent.neb_toppers.section_title?.description || 'Celebrating academic excellence',
                toppers: [],
                enabled: Boolean(organizedContent.neb_toppers.section_title?.isActive)
            },
            alumni: {
                title: organizedContent.alumni.section_title?.title || 'Marigold Alumni',
                subtitle: organizedContent.alumni.section_title?.description || 'Our alumni making a difference',
                alumni: [],
                enabled: Boolean(organizedContent.alumni.section_title?.isActive)
            },
                testimonials: {

                title: organizedContent.testimonials.section_title?.title || 'What Our Students Say',
                subtitle: organizedContent.testimonials.section_title?.description || 'Hear from our students about their experiences at Marigold English Boarding School',
                items: [],
                enabled: Boolean(organizedContent.testimonials.section_title?.isActive)
            },
            gallery: {
                title: organizedContent.gallery.section_title?.title || 'School Life in Pictures',
                subtitle: organizedContent.gallery.section_title?.description || 'A glimpse into our vibrant school community',
                items: [],
                enabled: Boolean(organizedContent.gallery.section_title?.isActive)
            },
            contact: {
                title: organizedContent.contact.section_title?.title || 'Get in Touch',
                subtitle: organizedContent.contact.section_title?.description || 'We would love to hear from you. Reach out to us for any inquiries.',
                info: organizedContent.contact.contact_info?.metadata ? JSON.parse(organizedContent.contact.contact_info.metadata) : {
                    address: '123 Education Street, City, State 123456',
                    phone: '+91-1234567890',
                    email: 'info@Marigoldschool.com',
                    hours: 'Mon - Fri: 8:00 AM - 3:00 PM'
                },
                enabled: Boolean(organizedContent.contact.section_title?.isActive)
            }
        };

        // Populate quick facts
        for (let i = 1; i <= 4; i++) {
            const fact = organizedContent.quick_facts[`fact_${i}`];
            if (fact && fact.isActive) {
                let icon = '';
                if (fact.metadata) {
                    try {
                        const parsed = JSON.parse(fact.metadata);
                        icon = parsed.icon || '';
                    } catch (e) {
                        icon = fact.metadata;
                    }
                }
                content.quickFacts.facts.push({
                    number: fact.title,
                    label: fact.content,
                    icon: icon
                });
            }
        }

        // Populate benefits
        for (let i = 1; i <= 4; i++) {
            const benefit = organizedContent.why_choose[`benefit_${i}`];
            if (benefit && benefit.isActive) {
                content.whyChoose.benefits.push({
                    title: benefit.title,
                    description: benefit.description,
                    icon: benefit.metadata
                });
            }
        }

        // Populate programs
        for (let i = 1; i <= 4; i++) {
            const program = organizedContent.programs[`program_${i}`];
            if (program && program.isActive) {
                // Extract Grade Level Key and icon from metadata
                let gradeLevelKey = null;
                let icon = null;
                if (program.metadata) {
                    try {
                        const metadata = JSON.parse(program.metadata);
                        gradeLevelKey = metadata.gradeLevelKey;
                        icon = metadata.icon;
                    } catch (e) {
                        // If parsing fails, treat metadata as icon (for backward compatibility)
                        icon = program.metadata;
                        console.warn('Failed to parse program metadata:', e);
                    }
                }
                
                content.programs.programs.push({
                    key: gradeLevelKey, // Grade level key for tracking
                    title: program.title,
                    description: program.content,
                    content: program.content, // For compatibility
                    icon: icon,
                    imageUrl: program.imageUrl || '', // Include image URL from database
                    image: program.imageUrl || '' // For compatibility with frontend
                });
            }
        }

        // Populate NEB Toppers
        for (let i = 1; i <= 6; i++) {
            const topper = organizedContent.neb_toppers[`topper_${i}`];
            if (topper && topper.isActive) {
                // Extract metadata
                let year = '';
                let score = '';
                let program = '';
                let quote = '';
                if (topper.metadata) {
                    try {
                        const metadata = JSON.parse(topper.metadata);
                        year = metadata.year || '';
                        score = metadata.score || '';
                        program = metadata.program || '';
                        quote = metadata.quote || '';
                    } catch (e) {
                        console.warn('Failed to parse topper metadata:', e);
                    }
                }
                
                content.nebToppers.toppers.push({
                    id: i,
                    name: topper.title,
                    score: score || topper.content,
                    year: year,
                    program: program,
                    quote: quote || topper.description,
                    message: quote || topper.description,
                    photo: topper.imageUrl,
                    imageUrl: topper.imageUrl
                });
            }
        }

        // Populate Alumni
        for (let i = 1; i <= 6; i++) {
            const alumnus = organizedContent.alumni[`alumni_${i}`];
            if (alumnus && alumnus.isActive) {
                // Extract metadata
                let graduationYear = '';
                let currentPosition = '';
                let achievement = '';
                if (alumnus.metadata) {
                    try {
                        const metadata = JSON.parse(alumnus.metadata);
                        graduationYear = metadata.graduationYear || '';
                        currentPosition = metadata.currentPosition || '';
                        achievement = metadata.achievement || '';
                    } catch (e) {
                        console.warn('Failed to parse alumni metadata:', e);
                    }
                }
                
                content.alumni.alumni.push({
                    id: i,
                    name: alumnus.title,
                    graduationYear: graduationYear,
                    currentPosition: currentPosition || alumnus.content,
                    achievement: achievement || alumnus.description,
                    photo: alumnus.imageUrl,
                    imageUrl: alumnus.imageUrl
                });
            }
        }

        // Populate testimonials
        for (let i = 1; i <= 6; i++) {
            const testimonial = organizedContent.testimonials[`testimonial_${i}`];
            if (testimonial && testimonial.isActive) {
                // Extract AboutContent ID from metadata
                let aboutContentId = null;
                if (testimonial.metadata) {
                    try {
                        const metadata = JSON.parse(testimonial.metadata);
                        aboutContentId = metadata.aboutContentId;
                    } catch (e) {
                        console.warn('Failed to parse testimonial metadata:', e);
                    }
                }
                
                content.testimonials.items.push({
                    id: aboutContentId, // AboutContent ID for tracking
                    name: testimonial.title,
                    handle: testimonial.content,
                    text: testimonial.description,
                    avatar: testimonial.imageUrl,
                    role: testimonial.content, // Add role for compatibility
                    content: testimonial.description, // Add content for compatibility
                    imageUrl: testimonial.imageUrl // Add imageUrl for compatibility
                });
            }
        }

        // Populate gallery - Fetch full album details from Gallery table
        for (let i = 1; i <= 6; i++) {
            const galleryItem = organizedContent.gallery[`gallery_item_${i}`];
            if (galleryItem && galleryItem.isActive) {
                // Extract Album ID from metadata
                let albumId = null;
                if (galleryItem.metadata) {
                    try {
                        const metadata = JSON.parse(galleryItem.metadata);
                        albumId = metadata.albumId;
                    } catch (e) {
                        console.warn('Failed to parse gallery item metadata:', e);
                    }
                }
                
                // If we have an albumId, fetch the full album details
                if (albumId) {
                    try {
                        const fullAlbum = await db.gallery.findUnique({
                            where: { id: albumId }
                        });
                        
                        if (fullAlbum) {
                            // Manually fetch items for this album
                            const items = await db.gallery.findMany({
                                where: {
                                    albumId: albumId,
                                    itemType: 'photo',
                                    isActive: true
                                }
                            });

                            content.gallery.items.push({
                                id: albumId,
                                title: fullAlbum.title,
                                description: fullAlbum.description,
                                imageUrl: fullAlbum.imageUrl,
                                image: fullAlbum.imageUrl, // For compatibility
                                category: fullAlbum.category,
                                itemCount: items.length
                            });
                        } else {
                            // Album not found, use saved data
                            content.gallery.items.push({
                                id: albumId,
                    title: galleryItem.title,
                    description: galleryItem.description,
                                imageUrl: galleryItem.imageUrl,
                                image: galleryItem.imageUrl,
                                category: null,
                                itemCount: 0
                            });
                        }
                    } catch (err) {
                        console.error('Error fetching album details:', err);
                        // Fallback to saved data
                        content.gallery.items.push({
                            id: albumId,
                            title: galleryItem.title,
                            description: galleryItem.description,
                            imageUrl: galleryItem.imageUrl,
                            image: galleryItem.imageUrl,
                            category: null,
                            itemCount: 0
                        });
                    }
                } else {
                    // No album ID, use saved data
                    content.gallery.items.push({
                        id: null,
                        title: galleryItem.title,
                        description: galleryItem.description,
                        imageUrl: galleryItem.imageUrl,
                        image: galleryItem.imageUrl,
                        category: null,
                        itemCount: 0
                    });
                }
            }
        }

        res.json({
            success: true,

            content: content
        });
    } catch (error) {

        console.error('❌ Error fetching homepage content:', error);
        res.status(500).json({
            success: false,

            error: 'Failed to fetch homepage content',
            message: error.message
        });
    }
});

// ===== ABOUT PAGE CONTENT =====
router.get('/about', async (req, res) => {
    try {
        console.log('📥 Fetching about page content...');
        
        // Set cache headers - no cache for admin to always get fresh data
        res.set({
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        });
        
        const { section } = req.query;
        
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
        console.error('❌ Error fetching about page content:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch about page content',
            message: error.message
        });
    }
});

router.post('/about', async (req, res) => {
    try {
        console.log('💾 Saving about page content...');
        console.log('📋 Request data:', req.body);
        
        const { section, data } = req.body;
        
        if (!section || !data || !Array.isArray(data)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid request data'
            });
        }
        
        // Save each item in the data array
        const savedItems = [];
        const deletedItems = [];
        
        for (const item of data) {
            try {
                console.log(`📋 Processing item:`, {
                    key: item.key,
                    section: section,
                    hasDeleteFlag: !!item._delete,
                    deleteFlag: item._delete
                });
                
                // Check if this item should be deleted
                if (item._delete === true) {
                    console.log(`🗑️ Deleting ${section}/${item.key} from database`);
                    
                    try {
                        // Delete from database
                        const deletedItem = await db.aboutContent.deleteBySectionAndKey(section, item.key);
                        if (deletedItem) {
                            deletedItems.push(deletedItem);
                        } else {
                            console.log(`⚠️ Item ${section}/${item.key} not found for deletion`);
                        }
                    } catch (deleteError) {
                        console.error(`❌ Error deleting ${section}/${item.key}:`, deleteError);
                        // Continue processing other items even if one deletion fails
                    }
                } else {
                    // Normal save/update
                    console.log(`📝 Upserting ${section}/${item.key} with data:`, {
                        ...item,
                        content: item.content?.substring(0, 50) + '...' // Truncate long content
                    });
                    
                    const savedItem = await db.aboutContent.upsertBySectionAndKey(
                        section, 
                        item.key, 
                        item
                    );
                    savedItems.push(savedItem);
                }
            } catch (itemError) {
                console.error(`❌ Error processing ${section}/${item.key}:`, itemError);
                throw itemError;
            }
        }
        
        
        res.json({
            success: true,
            message: 'About page content saved successfully',
            data: savedItems,
            deleted: deletedItems,
            summary: {
                saved: savedItems.length,
                deleted: deletedItems.length
            }
        });
        
    } catch (error) {
        console.error('❌ Error saving about page content:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to save about page content',
            message: error.message
        });
    }
});

// ===== ACADEMICS PAGE CONTENT =====
router.get('/academics', async (req, res) => {
    try {

        console.log('📥 Fetching academics page content...');
        // Fetch active content only (default behavior)
        const allContent = await db.academicsContent.findAll();
        
        const organizedContent = {
            academic_philosophy: {},
            curriculum_overview: {},
            grade_levels: {},
            teaching_methods: {},
            beyond_academics: {},
            academic_achievements: {},
            cta_section: {}
        };

        allContent.forEach(item => {
            if (!organizedContent[item.section]) {
                organizedContent[item.section] = {};
            }
            organizedContent[item.section][item.key] = item;
        });
        
        // Debug: Log all highlight keys found
        const highlightKeys = Object.keys(organizedContent.academic_philosophy).filter(key => key.startsWith('highlight_'));
        console.log('🔍 Found highlight keys:', highlightKeys);
        // Debug: Log details of each highlight
        highlightKeys.forEach(key => {
            const item = organizedContent.academic_philosophy[key];
            console.log(`  - ${key}: isActive=${item?.isActive}, hasTitle=${!!item?.title}, hasContent=${!!item?.content}`);
        });


        // Extract philosophy highlights
        const philosophyHighlights = [];
        Object.keys(organizedContent.academic_philosophy).forEach(key => {
            if (key.startsWith('highlight_')) {
                const item = organizedContent.academic_philosophy[key];
                // Only include active highlights with title and content
                // Note: findAll() already filters by isActive=true, but we double-check here for safety
                if (item && (item.isActive === true || item.isActive === 1) && (item.title || item.content)) {
                    let metadata = {};
                    if (item.metadata) {
                        try {
                            metadata = JSON.parse(item.metadata);
                        } catch (e) {
                            // If metadata is not valid JSON, treat it as a string
                            metadata = { icon: item.metadata };
                        }
                    }
                    // Extract index from key (e.g., highlight_0 -> 0, highlight_1 -> 1)
                    const match = key.match(/highlight_(\d+)/);
                    const index = match ? parseInt(match[1], 10) : 999; // Use 999 for non-numeric suffixes to sort last
                    
                    philosophyHighlights.push({
                        index: index,
                        title: item.title || '',
                        description: item.content || '',
                        icon: metadata.icon || 'brain'
                    });
                }
            }
        });
        // Sort highlights by their index to maintain order
        philosophyHighlights.sort((a, b) => a.index - b.index);
        // Remove index property before sending to client
        const sortedHighlights = philosophyHighlights.map(({ index, ...rest }) => rest);
        console.log('📝 Philosophy highlights populated:', sortedHighlights);

        const content = {
            academicPhilosophy: {
                title: organizedContent.academic_philosophy.section_title?.title || 'Our Academic Philosophy',
                description: organizedContent.academic_philosophy.philosophy_description?.content || 'At Marigold English Boarding School, we believe that true education goes beyond textbooks...',
                imageUrl: organizedContent.academic_philosophy.section_title?.imageUrl || '', // Include background image
                backgroundImage: organizedContent.academic_philosophy.section_title?.imageUrl || '', // Alias for compatibility
                highlights: sortedHighlights,
                enabled: Boolean(organizedContent.academic_philosophy.section_title?.isActive)
            },
            curriculumOverview: {
                title: organizedContent.curriculum_overview?.section_title?.title || 'Curriculum Overview',
                subtitle: organizedContent.curriculum_overview?.section_title?.description || 'Comprehensive curriculum designed for excellence',
                description: organizedContent.curriculum_overview?.section_title?.content || 'Our curriculum is designed to provide a well-rounded education...',
                items: [],
                enabled: Boolean(organizedContent.curriculum_overview?.section_title?.isActive)
            },
            gradeLevels: {
                title: organizedContent.grade_levels.section_title?.title || 'Academic Programs',
                subtitle: organizedContent.grade_levels.section_title?.content || 'Comprehensive education from early years to secondary level',
                levels: [],
                programs: [], // Will be populated below from program_X keys
                enabled: Boolean(organizedContent.grade_levels.section_title?.isActive)
            },
            teachingMethods: {
                title: organizedContent.teaching_methods?.section_title?.title || 'Teaching Methodologies',
                subtitle: organizedContent.teaching_methods?.section_title?.content || 'Innovative approaches to learning',
                description: organizedContent.teaching_methods?.methods_description?.content || 'We employ modern teaching methodologies...',
                methods: [],
                enabled: Boolean(organizedContent.teaching_methods?.section_title?.isActive)
            },
            beyondAcademics: {
                title: organizedContent.beyond_academics.section_title?.title || 'Beyond Academics',
                subtitle: organizedContent.beyond_academics.section_title?.content || 'Holistic development through extracurricular activities',
                activities: [],
                enabled: Boolean(organizedContent.beyond_academics.section_title?.isActive)
            },
            academicAchievements: {
                title: organizedContent.academic_achievements?.section_title?.title || 'Academic Achievements',
                subtitle: organizedContent.academic_achievements?.section_title?.content || 'Celebrating our students\' success',
                description: organizedContent.academic_achievements?.achievements_description?.content || 'Our students consistently achieve outstanding results...',
                achievements: [],
                enabled: Boolean(organizedContent.academic_achievements?.section_title?.isActive)
            },
            ctaSection: {
                title: '',
                description: '',
                primaryButton: { text: '', link: '' },
                secondaryButton: { text: '', link: '' },
                tertiaryButton: { text: '', action: '' },
                enabled: Boolean(organizedContent.cta_section.section_title?.isActive)
            }
        };

        // Populate philosophy highlights - check for highlights in metadata
        if (organizedContent.academic_philosophy.highlights?.content) {
            try {
                const highlights = JSON.parse(organizedContent.academic_philosophy.highlights.content);
                if (Array.isArray(highlights)) {
                    content.academicPhilosophy.highlights = highlights;
                }
            } catch (e) {
                console.log('⚠️ Could not parse highlights from metadata');
            }
        }
        
        // Fallback to individual highlight keys
        if (content.academicPhilosophy.highlights.length === 0) {
            ['highlight_critical_thinking', 'highlight_teamwork', 'highlight_creativity', 'highlight_character'].forEach((key, index) => {
                const highlight = organizedContent.academic_philosophy[key];
                if (highlight && highlight.isActive) {
                    content.academicPhilosophy.highlights.push({
                        title: highlight.title,
                        description: highlight.content,
                        icon: highlight.metadata || 'star'
                    });
                }
            });
        }
        
        console.log('📝 Philosophy highlights populated:', content.academicPhilosophy.highlights);

        // Populate grade levels - look for program_X keys
        const gradeLevelPrograms = [];
        Object.keys(organizedContent.grade_levels).forEach(key => {
            console.log('  - Checking key:', key, 'starts with program_?', key.startsWith('program_'));
            if (key.startsWith('program_')) {
                const program = organizedContent.grade_levels[key];
                console.log('    ✓ Found program:', key, 'isActive:', program?.isActive, 'title:', program?.title);
                if (program && program.isActive) {
                    let metadata = {};
                    if (program.metadata) {
                        try {
                            metadata = JSON.parse(program.metadata);
                        } catch (e) {
                            // If metadata is not valid JSON, treat it as a string
                            metadata = { icon: program.metadata };
                        }
                    }
                    const programData = {
                        title: program.title || '',
                        name: program.title || '',
                        description: program.content || '',
                        age: metadata.age || '',
                        ageRange: metadata.age || '',
                        imageUrl: program.imageUrl || '', // Include image URL from database
                        icon: metadata.icon || '', // Include icon from metadata
                        features: metadata.features || [] // Include features from metadata
                    };
                    console.log('    ✓ Adding program with imageUrl:', programData);
                    gradeLevelPrograms.push(programData);
                }
            }
        });
        content.gradeLevels.programs = gradeLevelPrograms;
        console.log('📚 Grade level programs populated:', gradeLevelPrograms);
        
        // Fallback to old structure for backwards compatibility
        ['pre_primary', 'primary', 'middle_school', 'secondary'].forEach((key, index) => {
            const level = organizedContent.grade_levels[key];
            if (level && level.isActive) {
                content.gradeLevels.levels.push({
                    title: level.title,
                    description: level.description,
                    content: level.content,
                    image: level.imageUrl,
                    icon: level.metadata
        });
    }
});

        console.log('📝 Academic programs populated:', content.gradeLevels.programs);


        // Populate curriculum items - look for curriculum_item_X keys
        Object.keys(organizedContent.curriculum_overview).forEach(key => {
            if (key.startsWith('curriculum_item_')) {
                const item = organizedContent.curriculum_overview[key];
                if (item && item.isActive) {
                content.curriculumOverview.items.push({
                        subject: item.title || '',
                        title: item.title || '',
                        description: item.content || '',
                        icon: item.metadata || 'book'
                    });
                }
            }
        });
        
        console.log('📚 Curriculum items populated:', content.curriculumOverview.items);

        // Populate teaching methods - look for method_X keys
        const teachingMethodsData = [];
        Object.keys(organizedContent.teaching_methods).forEach(key => {
            if (key.startsWith('method_')) {
                const method = organizedContent.teaching_methods[key];
                if (method && method.isActive) {
                    teachingMethodsData.push({
                        title: method.title || '',
                        description: method.content || ''
                    });
                }
            }
        });
        content.teachingMethods.methods = teachingMethodsData;
        console.log('📚 Teaching methods populated:', teachingMethodsData);
        
        // Fallback to old structure for backwards compatibility
        if (teachingMethodsData.length === 0) {
        ['digital_classrooms', 'activity_based_learning', 'stem_steam_education', 'continuous_assessment', 'collaborative_learning', 'personalized_learning'].forEach((key, index) => {
            const method = organizedContent.teaching_methods[key];
            if (method && method.isActive) {
                content.teachingMethods.methods.push({
                    title: method.title,
                    description: method.content,
                    icon: method.metadata
                });
            }
        });
        }

        // Populate beyond academics activities from the new structure
        const activitiesData = organizedContent.beyond_academics.activities;
        if (activitiesData && activitiesData.content) {
            try {
                const activities = JSON.parse(activitiesData.content);
                if (Array.isArray(activities)) {
                    content.beyondAcademics.activities = activities;
                    console.log('📝 Beyond academics activities populated:', activities);
                }
            } catch (error) {
                console.error('Error parsing activities data:', error);
            }
        } else {
            console.log('⚠️ No activities data found in beyond_academics section');
        }

        // Populate academic achievements - first check for JSON string in 'achievements' key
        console.log('🔍 Checking for achievements data...');
        console.log('🔍 organizedContent.academic_achievements keys:', Object.keys(organizedContent.academic_achievements || {}));
        const achievementsData = organizedContent.academic_achievements?.achievements;
        console.log('🔍 achievementsData:', achievementsData ? 'found' : 'not found');
        if (achievementsData) {
            console.log('🔍 achievementsData.content type:', typeof achievementsData.content);
            console.log('🔍 achievementsData.content (first 200 chars):', achievementsData.content ? achievementsData.content.substring(0, 200) : 'null');
        }
        
        if (achievementsData && achievementsData.content) {
            try {
                const achievements = JSON.parse(achievementsData.content);
                console.log('🔍 Parsed achievements:', achievements);
                console.log('🔍 Is array?', Array.isArray(achievements));
                if (Array.isArray(achievements)) {
                    content.academicAchievements.achievements = achievements;
                    console.log('✅ Academic achievements populated from JSON:', achievements.length, 'items');
                    console.log('✅ Achievement items:', achievements);
                } else {
                    console.warn('⚠️ Parsed achievements is not an array:', achievements);
                }
            } catch (error) {
                console.error('❌ Error parsing achievements data:', error);
                console.error('❌ Raw content:', achievementsData.content);
            }
        }
        
        // Fallback: Populate academic achievements from individual database rows
        if (content.academicAchievements.achievements.length === 0) {
            console.log('🔄 Falling back to individual achievement rows...');
            console.log('🔍 organizedContent.academic_achievements keys:', Object.keys(organizedContent.academic_achievements || {}));
            const achievementItems = [];
            Object.keys(organizedContent.academic_achievements || {}).forEach(key => {
                // Skip section_title, section_enabled, and achievements keys
                if (key !== 'section_title' && key !== 'section_enabled' && key !== 'achievements') {
                    const item = organizedContent.academic_achievements[key];
                    console.log(`  - Checking key "${key}":`, item ? 'found' : 'not found');
                    if (item && item.isActive) {
                        achievementItems.push({
                            number: item.content || '',  // e.g., '85%', '100%', '25+'
                            label: item.title || '',      // e.g., 'Students Score Distinction in SEE'
                            icon: item.metadata || 'trophy'  // Icon name stored in metadata
                        });
                    }
                }
            });
            
            if (achievementItems.length > 0) {
                content.academicAchievements.achievements = achievementItems;
                console.log('✅ Academic achievements populated from individual rows:', achievementItems.length, 'items');
            } else {
                console.log('⚠️ No achievement items found in academic_achievements section');
            }
        }
        
        console.log('📊 Final academicAchievements.achievements:', content.academicAchievements.achievements);
        console.log('📊 Final achievements length:', content.academicAchievements.achievements.length);

        // Populate CTA section from the new structure
        console.log('🔍 Checking for CTA data...');
        console.log('🔍 organizedContent.cta_section keys:', Object.keys(organizedContent.cta_section || {}));
        const ctaData = organizedContent.cta_section?.section_title;
        console.log('🔍 ctaData:', ctaData ? 'found' : 'not found');
        if (ctaData && ctaData.content) {
            console.log('🔍 ctaData.content:', ctaData.content.substring(0, 100));
            try {
                const cta = JSON.parse(ctaData.content);
                content.ctaSection = {
                    title: cta.title || '',
                    description: cta.description || '',
                    primaryButton: cta.primaryButton || { text: '', link: '' },
                    secondaryButton: cta.secondaryButton || { text: '', link: '' },
                    tertiaryButton: cta.tertiaryButton || { text: '', action: '' },
                    enabled: Boolean(ctaData.isActive)
                };
                console.log('📝 CTA section populated:', cta);
            } catch (error) {
                console.error('❌ Error parsing CTA data:', error);
            }
        } else {
            console.log('⚠️ No CTA data found in cta_section');
            console.log('   ctaData exists:', !!ctaData);
            console.log('   ctaData.content exists:', ctaData?.content ? 'yes' : 'no');
        }

        console.log('✅ Academics page content fetched successfully');
        res.json({
            success: true,
            content: content
        });
    } catch (error) {

        console.error('❌ Error fetching academics page content:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch academics page content',
            message: error.message
        });
    }
});

// ===== TEST FAQ DATA =====
router.get('/test-faq', async (req, res) => {
    try {
        console.log('🧪 Testing FAQ data retrieval...');
        
        // Get all FAQ data directly from database
        const allFaqData = await db.contactContent.findAll({ section: 'faq_section' });
        console.log('🧪 Direct FAQ query result:', JSON.stringify(allFaqData, null, 2));
        
        res.json({
            success: true,
            faqData: allFaqData
        });
    } catch (error) {
        console.error('❌ Error testing FAQ data:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ===== CONTACT PAGE CONTENT =====
router.get('/contact', async (req, res) => {
    try {

        console.log('📥 Fetching contact page content...');
        
        // Get all content
        const allContent = await db.contactContent.findAll({ isActive: undefined });
        
        const organizedContent = {
            contact_main: {},
            location_section: {},
            faq_section: {},
            social_media: {},
            cta_section: {},
            emergency_contact: {}
        };

        allContent.forEach(item => {
            if (!organizedContent[item.section]) {
                organizedContent[item.section] = {};
            }
            organizedContent[item.section][item.key] = item;
        });

        const content = {
            contactMain: {
                title: organizedContent.contact_main.section_title?.title || 'Get in Touch',
                subtitle: organizedContent.contact_main.section_title?.description || 'We\'d love to hear from you',
                description: organizedContent.contact_main.contact_description?.content || 'Have questions about our programs...',
                contactInfo: {

                    address: organizedContent.contact_main.contact_address?.content || '123 Education Street, Kathmandu, Nepal 44600',
                    phone: organizedContent.contact_main.contact_phone?.content || '+977-1-1234567',
                    email: organizedContent.contact_main.contact_email?.content || 'info@Marigoldschool.edu.np',
                    hours: organizedContent.contact_main.contact_hours?.content || 'Sunday - Thursday: 8:00 AM - 3:00 PM'
                },
                enabled: Boolean(organizedContent.contact_main.section_title?.isActive)
            },
            locationSection: (() => {
                const locationSection = {
                    title: organizedContent.location_section.section_title?.title || 'Our Location',
                    subtitle: organizedContent.location_section.section_title?.description || 'Connecting Near and Far',
                description: organizedContent.location_section.map_description?.content || 'Our campus is easily accessible...',
                    headquarters: {
                        organizationName: organizedContent.location_section.headquarters_name?.content || 'Marigold English Boarding School',
                        city: organizedContent.location_section.headquarters_city?.content || 'Kathmandu, Nepal',
                        streetAddress: organizedContent.location_section.headquarters_address?.content || '123 Education Street, Suite 456',
                        postalCode: organizedContent.location_section.headquarters_postal?.content || 'Kathmandu, NP 44600',
                        country: organizedContent.location_section.headquarters_country?.content || 'Nepal'
                    },
                    maps: {
                        embedUrl: organizedContent.location_section.map_embed_url?.content || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2936.6700551124654!2d82.29947430460153!3d28.13106831147718!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3997f47fc8c8a727%3A0xbe35592360fe8897!2sMarigold%20Deep%20College!5e1!3m2!1sen!2snp!4v1756340841090!5m2!1sen!2snp',
                        directUrl: organizedContent.location_section.map_direct_url?.content || 'https://maps.app.goo.gl/4947ysd5HHPvsiPd7'
                    },
                    enabled: Boolean(organizedContent.location_section.section_title?.isActive)
                };
                console.log('🔍 API Building locationSection:', JSON.stringify(locationSection, null, 2));
                return locationSection;
            })(),
            faqSection: (() => {
                const faqSection = {
                    title: organizedContent.faq_section.section_title?.title || 'Do you have any questions for us?',
                    subtitle: organizedContent.faq_section.section_title?.description || 'If there are questions you want to ask, we will answer all your questions.',
                faqs: [],
                enabled: Boolean(organizedContent.faq_section.section_title?.isActive)
                };

                // Populate FAQ items - get all FAQ items from database
                const faqItems = Object.keys(organizedContent.faq_section)
                    .filter(key => key.startsWith('faq_'))
                    .map(key => {
                        const faqData = organizedContent.faq_section[key];
                        const index = parseInt(key.replace('faq_', ''));
                        return { index, ...faqData };
                    })
                    .sort((a, b) => a.index - b.index);
                
                faqItems.forEach((faqData, i) => {
                    if (faqData && faqData.title) {
                        // Clean the data by trimming whitespace and removing any extra characters
                        const cleanQuestion = (faqData.title || '').trim().replace(/[^\w\s\?\.\!]/g, '');
                        const cleanAnswer = (faqData.content || '').trim().replace(/[^\w\s\?\.\!]/g, '');
                        
                        faqSection.faqs.push({
                            question: cleanQuestion,
                            answer: cleanAnswer
                        });
                    }
                });
                return faqSection;
            })(),
            socialMedia: {
                title: organizedContent.social_media.section_title?.title || 'Connect With Us',
                subtitle: organizedContent.social_media.section_title?.description || 'Follow us for updates and school news',
                links: [],
                enabled: Boolean(organizedContent.social_media.section_title?.isActive)
            },
            ctaSection: {
                title: organizedContent.cta_section.section_title?.title || 'Ready to Get Started?',
                subtitle: organizedContent.cta_section.section_title?.description || 'Join our community of learners and achievers',
                description: organizedContent.cta_section.cta_description?.content || 'Don\'t wait! Secure your child\'s future...',
                primaryButton: {
                    text: organizedContent.cta_section.primary_button?.title || 'Apply Now',
                    link: organizedContent.cta_section.primary_button?.linkUrl || '/apply.html'
                },
                secondaryButton: {
                    text: organizedContent.cta_section.secondary_button?.title || 'Schedule a Visit',
                    link: organizedContent.cta_section.secondary_button?.linkUrl || '/contact.html'
                },
                enabled: Boolean(organizedContent.cta_section.section_title?.isActive)
            },
            emergencyContact: {
                title: organizedContent.emergency_contact?.section_title?.title || 'Emergency Contact',
                subtitle: organizedContent.emergency_contact?.section_title?.description || '24/7 emergency support',
                description: organizedContent.emergency_contact?.emergency_description?.content || 'For urgent matters outside school hours...',
                contactInfo: {
                    phone: organizedContent.emergency_contact?.emergency_phone?.content || '+977-1-1234567',
                    email: organizedContent.emergency_contact?.emergency_email?.content || 'emergency@Marigoldschool.edu.np',
                    hours: organizedContent.emergency_contact?.emergency_hours?.content || '24/7 Emergency Line'
                },
                enabled: Boolean(organizedContent.emergency_contact?.section_title?.isActive)
            }
        };

        // FAQs are already populated in the faqSection object above

        // Populate social media links
        ['facebook_link', 'instagram_link', 'linkedin_link', 'youtube_link'].forEach((key, index) => {
            const social = organizedContent.social_media[key];
            if (social && social.isActive) {
                content.socialMedia.links.push({
                    platform: social.title,
                    url: social.linkUrl,
                    description: social.description,
                    icon: social.metadata
                });
            }
        });

        console.log('✅ Contact page content fetched successfully');
        res.json({
            success: true,
            content: content
        });
    } catch (error) {

        console.error('❌ Error fetching contact page content:', error);
        res.status(500).json({
            success: false,

            error: 'Failed to fetch contact page content',
            message: error.message
        });
    }
});


// ===== UPDATE HOMEPAGE CONTENT =====
router.put('/home', authenticateToken, requireRole(['admin']), [
    body('section').notEmpty().withMessage('Section is required'),
    body('key').notEmpty().withMessage('Key is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: 'Validation failed',
                details: errors.array()
            });
        }

        console.log('📝 Updating homepage content...', req.body);
        const { section, key, title, content, description, imageUrl, linkUrl, isActive, metadata } = req.body;

        // Upsert the content item
        const updatedContent = await db.homepageContent.upsertBySectionAndKey(
            section,
            key,
            {
                title,
                content,
                description,
                imageUrl,
                linkUrl,
                isActive: isActive !== false,
                metadata
            }
        );

        console.log('✅ Homepage content updated successfully');
        res.json({
            success: true,
            message: 'Homepage content updated successfully',
            content: updatedContent
        });
    } catch (error) {
        console.error('❌ Error updating homepage content:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update homepage content',
            message: error.message
        });
    }
});

// ===== BULK UPDATE HOMEPAGE CONTENT =====
router.put('/home/bulk', authenticateToken, requireRole(['admin']), async (req, res) => {
    try {
        console.log('📝 Bulk updating homepage content...');
        const { content } = req.body;

        if (!content || typeof content !== 'object') {
            return res.status(400).json({
                success: false,
                error: 'Invalid content format'
            });
        }

        const updates = [];

        // Process hero section
        if (content.hero) {
            const { title, badge, description, primaryButton, secondaryButton, stats, backgroundImage, enabled } = content.hero;
            
            // Main title
            updates.push(
                db.homepageContent.upsertBySectionAndKey('hero', 'main_title', {
                    title: title || 'Where Learning Meets Excellence.',
                    content: description || 'Inspiring students with knowledge, values, and opportunities to grow.',
                    isActive: enabled !== false
                })
            );

            // Badge
            updates.push(
                db.homepageContent.upsertBySectionAndKey('hero', 'badge', {
                    content: badge || 'Excellence in Education Since 1995',
                    isActive: enabled !== false
                })
            );

            // Primary button
            if (primaryButton) {
                updates.push(
                    db.homepageContent.upsertBySectionAndKey('hero', 'primary_button', {
                        title: primaryButton.text || 'Apply Now',
                        linkUrl: primaryButton.link || '/contact.html',
                        isActive: enabled !== false
                    })
                );
            }

            // Secondary button
            if (secondaryButton) {
                updates.push(
                    db.homepageContent.upsertBySectionAndKey('hero', 'secondary_button', {
                        title: secondaryButton.text || 'Contact Us',
                        linkUrl: secondaryButton.link || '/contact.html',
                        isActive: enabled !== false
                    })
                );
            }

            // Stats
            if (stats) {
                updates.push(
                    db.homepageContent.upsertBySectionAndKey('hero', 'stats', {
                        metadata: JSON.stringify(stats),
                        isActive: enabled !== false
                    })
                );
            }

            // Background Image (always update, even if empty string to allow removal)
            if (backgroundImage !== undefined) {
                updates.push(
                    db.homepageContent.upsertBySectionAndKey('hero', 'background_image', {
                        imageUrl: backgroundImage || '', // Allow empty string
                        isActive: enabled !== false
                    })
                );
            }

            // Section enabled
            updates.push(
                db.homepageContent.upsertBySectionAndKey('hero', 'section_enabled', {
                    isActive: enabled !== false
                })
            );
        }

        // Process quick facts section
        if (content.quickFacts) {
            const { title, facts, enabled } = content.quickFacts;
            
            // Section title
            updates.push(
                db.homepageContent.upsertBySectionAndKey('quick_facts', 'section_title', {
                    title: title || 'Our results in numbers',
                    isActive: enabled !== false
                })
            );

            // Section enabled
            updates.push(
                db.homepageContent.upsertBySectionAndKey('quick_facts', 'section_enabled', {
                    isActive: enabled !== false
                })
            );

            // Facts
            if (facts && Array.isArray(facts)) {
                facts.forEach((fact, index) => {
                    const factKey = `fact_${index + 1}`;
                    updates.push(
                        db.homepageContent.upsertBySectionAndKey('quick_facts', factKey, {
                            title: fact.number || '',
                            content: fact.label || '',
                            metadata: fact.icon || '',
                            isActive: enabled !== false
                        })
                    );
                });
            }
        }

        // Process why choose section
        if (content.whyChoose) {
            const { title, subtitle, benefits, backgroundImage, enabled } = content.whyChoose;
            
            console.log('🎯 Processing why_choose section');
            console.log('📸 Background Image:', backgroundImage);
            
            // Section title
            updates.push(
                db.homepageContent.upsertBySectionAndKey('why_choose', 'section_title', {
                    title: title || 'Why Choose Marigold?',
                    description: subtitle || '',
                    isActive: enabled !== false
                })
            );

            // Background Image (always update, even if empty string to allow removal)
            if (backgroundImage !== undefined) {
                console.log('✅ Adding background_image update to queue');
                updates.push(
                    db.homepageContent.upsertBySectionAndKey('why_choose', 'background_image', {
                        imageUrl: backgroundImage || '', // Allow empty string
                        isActive: enabled !== false
                    })
                );
            } else {
                console.log('❌ No backgroundImage provided (undefined)');
            }

            // Section enabled
            updates.push(
                db.homepageContent.upsertBySectionAndKey('why_choose', 'section_enabled', {
                    isActive: enabled !== false
                })
            );

            // Benefits
            if (benefits && Array.isArray(benefits)) {
                benefits.forEach((benefit, index) => {
                    const benefitKey = `benefit_${index + 1}`;
                    updates.push(
                        db.homepageContent.upsertBySectionAndKey('why_choose', benefitKey, {
                            title: benefit.title || '',
                            description: benefit.description || '',
                            metadata: benefit.icon || '',
                            isActive: enabled !== false
                        })
                    );
                });
            }
        }

        // Process mission section
        if (content.mission) {
            const { title, mission, vision, values, enabled } = content.mission;
            
            // Section title
            updates.push(
                db.homepageContent.upsertBySectionAndKey('mission', 'section_title', {
                    title: title || 'Our Mission & Vision',
                    isActive: enabled !== false
                })
            );
            
            // Mission card
            if (mission) {
                updates.push(
                    db.homepageContent.upsertBySectionAndKey('mission', 'mission_card', {
                        title: mission.title || 'Mission',
                        description: mission.description || 'To provide quality education that empowers students...',
                        isActive: enabled !== false
                    })
                );
            }

            // Vision card
            if (vision) {
                updates.push(
                    db.homepageContent.upsertBySectionAndKey('mission', 'vision_card', {
                        title: vision.title || 'Vision',
                        description: vision.description || 'To be a leading educational institution...',
                        isActive: enabled !== false
                    })
                );
            }

            // Values card
            if (values) {
                updates.push(
                    db.homepageContent.upsertBySectionAndKey('mission', 'values_card', {
                        title: values.title || 'Values',
                        description: values.description || 'Excellence, Integrity, Innovation...',
                        isActive: enabled !== false
                    })
                );
            }

            // Section enabled
            updates.push(
                db.homepageContent.upsertBySectionAndKey('mission', 'section_enabled', {
                    isActive: enabled !== false
                })
            );
        }

        // Process programs section
        if (content.programs) {
            const { title, subtitle, programs, enabled } = content.programs;
            
            console.log('📝 Processing programs section...');
            console.log('🔍 Programs items:', programs);
            
            // Section title
            updates.push(
                db.homepageContent.upsertBySectionAndKey('programs', 'section_title', {
                    title: title || 'Academic Programs',
                    description: subtitle || 'Comprehensive education from early years to secondary level',
                    isActive: enabled !== false
                })
            );

            // Section enabled
            updates.push(
                db.homepageContent.upsertBySectionAndKey('programs', 'section_enabled', {
                    isActive: enabled !== false
                })
            );

            // Programs - Save active programs
            if (programs && Array.isArray(programs) && programs.length > 0) {
                console.log(`✅ Saving ${programs.length} programs...`);
                programs.forEach((program, index) => {
                    const programKey = `program_${index + 1}`;
                    console.log(`💾 Saving ${programKey}:`, program.title, 'Grade Level Key:', program.key, 'Image URL:', program.imageUrl);
                    updates.push(
                        db.homepageContent.upsertBySectionAndKey('programs', programKey, {
                            title: program.title || '',
                            content: program.description || program.content || '',
                            imageUrl: program.imageUrl || '', // Store image URL from academics
                            metadata: JSON.stringify({ 
                                gradeLevelKey: program.key, 
                                icon: program.icon 
                            }), // Store reference to Academics grade level
                            isActive: enabled !== false
                        })
                    );
                });
                
                // Delete unused program slots (for slots beyond the current items)
                for (let i = programs.length + 1; i <= 4; i++) {
                    const programKey = `program_${i}`;
                    console.log(`🗑️ Attempting to delete ${programKey} from database`);
                    updates.push(
                        db.homepageContent.deleteBySectionAndKey('programs', programKey)
                            .then(() => {
                                console.log(`  ✅ Successfully deleted ${programKey}`);
                            })
                            .catch(err => {
                                if (err.code === 'P2025' || err.message.includes('Record to delete does not exist')) {
                                    console.log(`  ℹ️ ${programKey} doesn't exist (skipping)`);
                                } else {
                                    console.error(`  ❌ Failed to delete ${programKey}:`, err.message);
                                    throw err;
                                }
                            })
                    );
                }
            } else {
                console.log('⚠️ No programs provided (empty or null), deleting all program records');
                // If no items provided or empty array, delete all program slots
                for (let i = 1; i <= 4; i++) {
                    const programKey = `program_${i}`;
                    console.log(`🗑️ Attempting to delete ${programKey} from database`);
                    updates.push(
                        db.homepageContent.deleteBySectionAndKey('programs', programKey)
                            .then(() => {
                                console.log(`  ✅ Successfully deleted ${programKey}`);
                            })
                            .catch(err => {
                                if (err.code === 'P2025' || err.message.includes('Record to delete does not exist')) {
                                    console.log(`  ℹ️ ${programKey} doesn't exist (skipping)`);
                                } else {
                                    console.error(`  ❌ Failed to delete ${programKey}:`, err.message);
                                    throw err;
                                }
                            })
                    );
                }
            }
        }

        // Process NEB Toppers section
        if (content.nebToppers) {
            const { title, subtitle, toppers, enabled } = content.nebToppers;
            
            console.log('📝 Processing NEB toppers section...');
            console.log('🔍 Toppers items:', toppers);
            
            // Section title
            updates.push(
                db.homepageContent.upsertBySectionAndKey('neb_toppers', 'section_title', {
                    title: title || 'NEB Toppers',
                    description: subtitle || 'Celebrating academic excellence',
                    isActive: enabled !== false
                })
            );

            // Section enabled
            updates.push(
                db.homepageContent.upsertBySectionAndKey('neb_toppers', 'section_enabled', {
                    isActive: enabled !== false
                })
            );

            // NEB Toppers - Save active toppers
            if (toppers && Array.isArray(toppers) && toppers.length > 0) {
                console.log(`✅ Saving ${toppers.length} toppers...`);
                toppers.forEach((topper, index) => {
                    const topperKey = `topper_${index + 1}`;
                    console.log(`💾 Saving ${topperKey}:`, topper.name);
                    updates.push(
                        db.homepageContent.upsertBySectionAndKey('neb_toppers', topperKey, {
                            title: topper.name || '',
                            content: topper.score || '',
                            description: topper.quote || topper.message || '',
                            imageUrl: topper.photo || topper.imageUrl || '',
                            metadata: JSON.stringify({ 
                                year: topper.year,
                                score: topper.score,
                                program: topper.program,
                                quote: topper.quote || topper.message || ''
                            }),
                            isActive: enabled !== false
                        })
                    );
                });
                
                // Delete unused topper slots
                for (let i = toppers.length + 1; i <= 6; i++) {
                    const topperKey = `topper_${i}`;
                    console.log(`🗑️ Attempting to delete ${topperKey} from database`);
                    updates.push(
                        db.homepageContent.deleteBySectionAndKey('neb_toppers', topperKey)
                            .then(() => {
                                console.log(`  ✅ Successfully deleted ${topperKey}`);
                            })
                            .catch(err => {
                                if (err.code === 'P2025' || err.message.includes('Record to delete does not exist')) {
                                    console.log(`  ℹ️ ${topperKey} doesn't exist (skipping)`);
                                } else {
                                    console.error(`  ❌ Failed to delete ${topperKey}:`, err.message);
                                    throw err;
                                }
                            })
                    );
                }
            } else {
                console.log('⚠️ No toppers provided, deleting all topper records');
                for (let i = 1; i <= 6; i++) {
                    const topperKey = `topper_${i}`;
                    updates.push(
                        db.homepageContent.deleteBySectionAndKey('neb_toppers', topperKey)
                            .then(() => {
                                console.log(`  ✅ Successfully deleted ${topperKey}`);
                            })
                            .catch(err => {
                                if (err.code === 'P2025' || err.message.includes('Record to delete does not exist')) {
                                    console.log(`  ℹ️ ${topperKey} doesn't exist (skipping)`);
                                } else {
                                    console.error(`  ❌ Failed to delete ${topperKey}:`, err.message);
                                    throw err;
                                }
                            })
                    );
                }
            }
        }

        // Process Alumni section
        if (content.alumni) {
            const { title, subtitle, alumni, enabled } = content.alumni;
            
            console.log('📝 Processing alumni section...');
            console.log('🔍 Alumni items:', alumni);
            
            // Section title
            updates.push(
                db.homepageContent.upsertBySectionAndKey('alumni', 'section_title', {
                    title: title || 'Marigold Alumni',
                    description: subtitle || 'Our alumni making a difference',
                    isActive: enabled !== false
                })
            );

            // Section enabled
            updates.push(
                db.homepageContent.upsertBySectionAndKey('alumni', 'section_enabled', {
                    isActive: enabled !== false
                })
            );

            // Alumni - Save active alumni
            if (alumni && Array.isArray(alumni) && alumni.length > 0) {
                console.log(`✅ Saving ${alumni.length} alumni...`);
                alumni.forEach((alumnus, index) => {
                    const alumniKey = `alumni_${index + 1}`;
                    console.log(`💾 Saving ${alumniKey}:`, alumnus.name);
                    updates.push(
                        db.homepageContent.upsertBySectionAndKey('alumni', alumniKey, {
                            title: alumnus.name || '',
                            content: alumnus.currentPosition || '',
                            description: alumnus.achievement || '',
                            imageUrl: alumnus.photo || alumnus.imageUrl || '',
                            metadata: JSON.stringify({ 
                                graduationYear: alumnus.graduationYear,
                                currentPosition: alumnus.currentPosition,
                                achievement: alumnus.achievement
                            }),
                            isActive: enabled !== false
                        })
                    );
                });
                
                // Delete unused alumni slots
                for (let i = alumni.length + 1; i <= 6; i++) {
                    const alumniKey = `alumni_${i}`;
                    console.log(`🗑️ Attempting to delete ${alumniKey} from database`);
                    updates.push(
                        db.homepageContent.deleteBySectionAndKey('alumni', alumniKey)
                            .then(() => {
                                console.log(`  ✅ Successfully deleted ${alumniKey}`);
                            })
                            .catch(err => {
                                if (err.code === 'P2025' || err.message.includes('Record to delete does not exist')) {
                                    console.log(`  ℹ️ ${alumniKey} doesn't exist (skipping)`);
                                } else {
                                    console.error(`  ❌ Failed to delete ${alumniKey}:`, err.message);
                                    throw err;
                                }
                            })
                    );
                }
            } else {
                console.log('⚠️ No alumni provided, deleting all alumni records');
                for (let i = 1; i <= 6; i++) {
                    const alumniKey = `alumni_${i}`;
                    updates.push(
                        db.homepageContent.deleteBySectionAndKey('alumni', alumniKey)
                            .then(() => {
                                console.log(`  ✅ Successfully deleted ${alumniKey}`);
                            })
                            .catch(err => {
                                if (err.code === 'P2025' || err.message.includes('Record to delete does not exist')) {
                                    console.log(`  ℹ️ ${alumniKey} doesn't exist (skipping)`);
                                } else {
                                    console.error(`  ❌ Failed to delete ${alumniKey}:`, err.message);
                                    throw err;
                                }
                            })
                    );
                }
            }
        }

        // Process testimonials section
        if (content.testimonials) {
            const { title, subtitle, items, enabled } = content.testimonials;
            
            console.log('📝 Processing testimonials section...');
            console.log('🔍 Testimonials items:', items);
            
            // Section title
            updates.push(
                db.homepageContent.upsertBySectionAndKey('testimonials', 'section_title', {
                    title: title || 'What Our Students Say',
                    description: subtitle || 'Hear from our students about their experiences at Marigold English Boarding School',
                    isActive: enabled !== false
                })
            );

            // Section enabled
            updates.push(
                db.homepageContent.upsertBySectionAndKey('testimonials', 'section_enabled', {
                    isActive: enabled !== false
                })
            );

            // Testimonials - Save active testimonials
            if (items && Array.isArray(items) && items.length > 0) {
                console.log(`✅ Saving ${items.length} testimonials...`);
                items.forEach((testimonial, index) => {
                    const testimonialKey = `testimonial_${index + 1}`;
                    console.log(`💾 Saving ${testimonialKey}:`, testimonial.name, 'AboutContent ID:', testimonial.id);
                    updates.push(
                        db.homepageContent.upsertBySectionAndKey('testimonials', testimonialKey, {
                            title: testimonial.name || '',
                            content: testimonial.handle || '',
                            description: testimonial.text || '',
                            imageUrl: testimonial.avatar || '',
                            metadata: testimonial.id ? JSON.stringify({ aboutContentId: testimonial.id }) : null, // Store reference to AboutContent
                            isActive: enabled !== false
                        })
                    );
                });
                
                // Delete unused testimonial slots (for slots beyond the current items)
                for (let i = items.length + 1; i <= 6; i++) {
                    const testimonialKey = `testimonial_${i}`;
                    console.log(`🗑️ Attempting to delete ${testimonialKey} from database`);
                    updates.push(
                        db.homepageContent.deleteBySectionAndKey('testimonials', testimonialKey)
                            .then(() => {
                                console.log(`  ✅ Successfully deleted ${testimonialKey}`);
                            })
                            .catch(err => {
                                // Log but don't fail if record doesn't exist
                                if (err.code === 'P2025' || err.message.includes('Record to delete does not exist')) {
                                    console.log(`  ℹ️ ${testimonialKey} doesn't exist (skipping)`);
                                } else {
                                    console.error(`  ❌ Failed to delete ${testimonialKey}:`, err.message);
                                    throw err; // Re-throw other errors
                                }
                            })
                    );
                }
            } else {
                console.log('⚠️ No testimonials provided (empty or null), deleting all testimonial records');
                // If no items provided or empty array, delete all testimonial slots
                for (let i = 1; i <= 6; i++) {
                    const testimonialKey = `testimonial_${i}`;
                    console.log(`🗑️ Attempting to delete ${testimonialKey} from database`);
                    updates.push(
                        db.homepageContent.deleteBySectionAndKey('testimonials', testimonialKey)
                            .then(() => {
                                console.log(`  ✅ Successfully deleted ${testimonialKey}`);
                            })
                            .catch(err => {
                                // Log but don't fail if record doesn't exist
                                if (err.code === 'P2025' || err.message.includes('Record to delete does not exist')) {
                                    console.log(`  ℹ️ ${testimonialKey} doesn't exist (skipping)`);
                                } else {
                                    console.error(`  ❌ Failed to delete ${testimonialKey}:`, err.message);
                                    throw err; // Re-throw other errors
                                }
                            })
                    );
                }
            }
        }

        // Process gallery section
        if (content.gallery) {
            const { title, subtitle, items, enabled } = content.gallery;
            
            console.log('📝 Processing gallery section...');
            console.log('🔍 Gallery items:', items);
            
            // Section title
            updates.push(
                db.homepageContent.upsertBySectionAndKey('gallery', 'section_title', {
                    title: title || 'School Life in Pictures',
                    description: subtitle || 'A glimpse into our vibrant school community',
                    isActive: enabled !== false
                })
            );

            // Section enabled
            updates.push(
                db.homepageContent.upsertBySectionAndKey('gallery', 'section_enabled', {
                    isActive: enabled !== false
                })
            );

            // Gallery albums - Save active albums
            if (items && Array.isArray(items) && items.length > 0) {
                console.log(`✅ Saving ${items.length} gallery albums...`);
                items.forEach((album, index) => {
                    const albumKey = `gallery_item_${index + 1}`;
                    console.log(`💾 Saving ${albumKey}:`, album.title, 'Album ID:', album.id);
                    updates.push(
                        db.homepageContent.upsertBySectionAndKey('gallery', albumKey, {
                            title: album.title || '',
                            description: album.description || '',
                            imageUrl: album.imageUrl || '',
                            metadata: album.id ? JSON.stringify({ albumId: album.id }) : null, // Store reference to Gallery album
                            isActive: enabled !== false
                        })
                    );
                });
                
                // Delete unused gallery slots (for slots beyond the current items)
                for (let i = items.length + 1; i <= 6; i++) {
                    const albumKey = `gallery_item_${i}`;
                    console.log(`🗑️ Attempting to delete ${albumKey} from database`);
                    updates.push(
                        db.homepageContent.deleteBySectionAndKey('gallery', albumKey)
                            .then(() => {
                                console.log(`  ✅ Successfully deleted ${albumKey}`);
                            })
                            .catch(err => {
                                // Log but don't fail if record doesn't exist
                                if (err.code === 'P2025' || err.message.includes('Record to delete does not exist')) {
                                    console.log(`  ℹ️ ${albumKey} doesn't exist (skipping)`);
                                } else {
                                    console.error(`  ❌ Failed to delete ${albumKey}:`, err.message);
                                    throw err; // Re-throw other errors
                                }
                            })
                    );
                }
            } else {
                console.log('⚠️ No gallery albums provided (empty or null), deleting all gallery records');
                // If no items provided or empty array, delete all gallery slots
                for (let i = 1; i <= 6; i++) {
                    const albumKey = `gallery_item_${i}`;
                    console.log(`🗑️ Attempting to delete ${albumKey} from database`);
                    updates.push(
                        db.homepageContent.deleteBySectionAndKey('gallery', albumKey)
                            .then(() => {
                                console.log(`  ✅ Successfully deleted ${albumKey}`);
                            })
                            .catch(err => {
                                // Log but don't fail if record doesn't exist
                                if (err.code === 'P2025' || err.message.includes('Record to delete does not exist')) {
                                    console.log(`  ℹ️ ${albumKey} doesn't exist (skipping)`);
                                } else {
                                    console.error(`  ❌ Failed to delete ${albumKey}:`, err.message);
                                    throw err; // Re-throw other errors
                                }
                            })
                    );
                }
            }
        }

        // Process contact section
        if (content.contact) {
            const { title, subtitle, info, enabled } = content.contact;
            
            // Section title
            updates.push(
                db.homepageContent.upsertBySectionAndKey('contact', 'section_title', {
                    title: title || 'Get in Touch',
                    description: subtitle || 'We would love to hear from you. Reach out to us for any inquiries.',
                    isActive: enabled !== false
                })
            );

            // Contact info
            if (info) {
                updates.push(
                    db.homepageContent.upsertBySectionAndKey('contact', 'contact_info', {
                        metadata: JSON.stringify(info),
                        isActive: enabled !== false
                    })
                );
            }

            // Section enabled
            updates.push(
                db.homepageContent.upsertBySectionAndKey('contact', 'section_enabled', {
                    isActive: enabled !== false
                })
            );
        }

        // Execute all updates
        console.log(`⏳ Executing ${updates.length} database operations...`);
        const results = await Promise.allSettled(updates);
        
        // Log any failed operations
        const failed = results.filter(r => r.status === 'rejected');
        if (failed.length > 0) {
            console.warn(`⚠️ ${failed.length} operations failed:`);
            failed.forEach((f, idx) => {
                console.warn(`  ${idx + 1}. ${f.reason?.message || f.reason}`);
            });
        }
        
        const successful = results.filter(r => r.status === 'fulfilled');
        console.log(`✅ ${successful.length}/${updates.length} operations completed successfully`);

        res.json({
            success: true,
            message: 'Homepage content updated successfully'
        });
    } catch (error) {
        console.error('❌ Error bulk updating homepage content:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update homepage content',
            message: error.message
        });
    }
});

// ===== UPDATE ACADEMICS CONTENT =====
router.put('/academics', authenticateToken, requireRole(['admin']), [
    body('section').notEmpty().withMessage('Section is required'),
    body('key').notEmpty().withMessage('Key is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: 'Validation failed',
                details: errors.array()
            });
        }

        console.log('📝 Updating academics content...', req.body);
        const { section, key, title, content, description, imageUrl, linkUrl, metadata, isActive } = req.body;

        // Log metadata for debugging
        if (metadata) {
            console.log('📋 Metadata received:', metadata);
            try {
                const parsedMetadata = JSON.parse(metadata);
                console.log('📋 Parsed metadata:', parsedMetadata);
                console.log('🏷️ Features in metadata:', parsedMetadata.features);
            } catch (e) {
                console.warn('⚠️ Failed to parse metadata:', e);
            }
        }

        // Upsert the content item
        const updatedContent = await db.academicsContent.upsertBySectionAndKey(
            section,
            key,
            {
                title,
                content,
                description,
                imageUrl,
                linkUrl,
                metadata,
                isActive: isActive !== false
            }
        );
        
        console.log('✅ Content saved with metadata:', updatedContent.metadata);

        console.log('✅ Academics content updated successfully');
        res.json({
            success: true,

            message: 'Academics content updated successfully',
            content: updatedContent
        });
    } catch (error) {

        console.error('❌ Error updating academics content:', error);
        res.status(500).json({
            success: false,

            error: 'Failed to update academics content',
            message: error.message
        });
    }
});

// ===== DELETE ACADEMICS CONTENT =====
router.delete('/academics', authenticateToken, requireRole(['admin']), [
    body('section').notEmpty().withMessage('Section is required'),
    body('key').notEmpty().withMessage('Key is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: 'Validation failed',
                details: errors.array()
            });
        }

        console.log('🗑️ Deleting academics content...', req.body);
        const { section, key } = req.body;

        // Delete the content item
        const deletedContent = await db.academicsContent.deleteBySectionAndKey(section, key);

        console.log('✅ Academics content deleted successfully');
        res.json({
            success: true,
            message: 'Academics content deleted successfully',
            content: deletedContent
        });
    } catch (error) {
        console.error('❌ Error deleting academics content:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete academics content',
            message: error.message
        });
    }
});


// ===== UPDATE CONTACT CONTENT =====
router.put('/contact', authenticateToken, requireRole(['admin']), [
    body('section').notEmpty().withMessage('Section is required'),
    body('key').notEmpty().withMessage('Key is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: 'Validation failed',
                details: errors.array()
            });
        }

        const { section, key, title, content, description, imageUrl, linkUrl, isActive } = req.body;

        // Upsert the content item
        const updatedContent = await db.contactContent.upsertBySectionAndKey(
            section,
            key,
            {
                title,
                content,
                description,
                imageUrl,
                linkUrl,
                isActive: isActive !== false
            }
        );

        console.log('✅ Contact content updated successfully');
        res.json({
            success: true,

            message: 'Contact content updated successfully',
            content: updatedContent
        });
    } catch (error) {

        console.error('❌ Error updating contact content:', error);
        res.status(500).json({
            success: false,

            error: 'Failed to update contact content',
            message: error.message
        });
    }
});


// ===== BULK UPDATE ACADEMICS CONTENT =====
router.put('/academics/bulk', authenticateToken, requireRole(['admin']), async (req, res) => {
    try {
        console.log('📝 Bulk updating academics content...');
        const { content } = req.body;

        if (!content || typeof content !== 'object') {
            return res.status(400).json({
                success: false,
                error: 'Invalid content format'
            });
        }

        const updates = [];

        // Process academic philosophy section
        if (content.academicPhilosophy) {
            const { title, description, highlights, enabled } = content.academicPhilosophy;
            
            // Section title
            updates.push(
                db.academicsContent.upsertBySectionAndKey('academic_philosophy', 'section_title', {
                    title: title || 'Our Academic Philosophy',
                    isActive: enabled !== false
                })
            );

            // Philosophy description
            updates.push(
                db.academicsContent.upsertBySectionAndKey('academic_philosophy', 'philosophy_description', {
                    content: description || 'At Marigold English Boarding School, we believe that true education goes beyond textbooks...',
                    isActive: enabled !== false
                })
            );

            // Section enabled
            updates.push(
                db.academicsContent.upsertBySectionAndKey('academic_philosophy', 'section_enabled', {
                    isActive: enabled !== false
                })
            );

            // Philosophy highlights
            if (highlights && Array.isArray(highlights)) {
                highlights.forEach((highlight, index) => {
                    const highlightKeys = ['highlight_critical_thinking', 'highlight_teamwork', 'highlight_creativity', 'highlight_character'];
                    if (highlightKeys[index]) {
                        updates.push(
                            db.academicsContent.upsertBySectionAndKey('academic_philosophy', highlightKeys[index], {
                                title: highlight.title || '',
                                content: highlight.description || '',
                                metadata: highlight.icon || '',
                                isActive: enabled !== false
                            })
                        );
                    }
                });
            }
        }

        // Process grade levels section
        if (content.gradeLevels) {
            const { title, subtitle, levels, enabled } = content.gradeLevels;
            
            // Section title
            updates.push(
                db.academicsContent.upsertBySectionAndKey('grade_levels', 'section_title', {
                    title: title || 'Academic Programs',
                    description: subtitle || 'Comprehensive education from early years to secondary level',
                    isActive: enabled !== false
                })
            );

            // Section enabled
            updates.push(
                db.academicsContent.upsertBySectionAndKey('grade_levels', 'section_enabled', {
                    isActive: enabled !== false
                })
            );

            // Grade levels
            if (levels && Array.isArray(levels)) {
                const levelKeys = ['pre_primary', 'primary', 'middle_school', 'secondary'];
                levels.forEach((level, index) => {
                    if (levelKeys[index]) {
                        updates.push(
                            db.academicsContent.upsertBySectionAndKey('grade_levels', levelKeys[index], {
                                title: level.title || '',
                                description: level.description || '',
                                content: level.content || '',
                                imageUrl: level.image || '',
                                metadata: level.icon || '',
                                isActive: enabled !== false
                            })
                        );
                    }
                });
            }
        }

        // Process beyond academics section
        if (content.beyondAcademics) {
            const { title, subtitle, activities, enabled } = content.beyondAcademics;
            
            // Section title
            updates.push(
                db.academicsContent.upsertBySectionAndKey('beyond_academics', 'section_title', {
                    title: title || 'Beyond Academics',
                    description: subtitle || 'Holistic development through extracurricular activities',
                    isActive: enabled !== false
                })
            );

            // Section enabled
            updates.push(
                db.academicsContent.upsertBySectionAndKey('beyond_academics', 'section_enabled', {
                    isActive: enabled !== false
                })
            );

            // Activities
            if (activities && Array.isArray(activities)) {
                const activityKeys = ['sports_activities', 'arts_culture', 'clubs_societies'];
                activities.forEach((activity, index) => {
                    if (activityKeys[index]) {
                        updates.push(
                            db.academicsContent.upsertBySectionAndKey('beyond_academics', activityKeys[index], {
                                title: activity.title || '',
                                content: activity.description || '',
                                imageUrl: activity.image || '',
                                metadata: activity.icon || '',
                                isActive: enabled !== false
                            })
                        );
                    }
                });
            }
        }

        // Process CTA section
        if (content.ctaSection) {
            const { title, subtitle, description, primaryButton, secondaryButton, enabled } = content.ctaSection;
            
            // Section title
            updates.push(
                db.academicsContent.upsertBySectionAndKey('cta_section', 'section_title', {
                    title: title || 'Ready to Join Our Academic Journey?',
                    description: subtitle || 'Give your child the gift of quality education and holistic development',
                    isActive: enabled !== false
                })
            );

            // CTA description
            updates.push(
                db.academicsContent.upsertBySectionAndKey('cta_section', 'cta_description', {
                    content: description || 'Join hundreds of families who trust Marigold English Boarding School...',
                    isActive: enabled !== false
                })
            );

            // Primary button
            if (primaryButton) {
                updates.push(
                    db.academicsContent.upsertBySectionAndKey('cta_section', 'primary_button', {
                        title: primaryButton.text || 'Apply Now',
                        linkUrl: primaryButton.link || '/contact.html',
                        isActive: enabled !== false
                    })
                );
            }

            // Secondary button
            if (secondaryButton) {
                updates.push(
                    db.academicsContent.upsertBySectionAndKey('cta_section', 'secondary_button', {
                        title: secondaryButton.text || 'Contact Us',
                        linkUrl: secondaryButton.link || '/contact.html',
                        isActive: enabled !== false
                    })
                );
            }

            // Section enabled
            updates.push(
                db.academicsContent.upsertBySectionAndKey('cta_section', 'section_enabled', {
                    isActive: enabled !== false
                })
            );
        }

        // Execute all updates
        await Promise.all(updates);

        console.log('✅ Academics content bulk updated successfully');
        res.json({
            success: true,

            message: 'Academics content updated successfully'
        });
    } catch (error) {

        console.error('❌ Error bulk updating academics content:', error);
        res.status(500).json({
            success: false,

            error: 'Failed to update academics content',
            message: error.message
        });
    }
});


// ===== BULK UPDATE CONTACT CONTENT =====
router.put('/contact/bulk', authenticateToken, requireRole(['admin']), async (req, res) => {
    try {
        console.log('🚀 Backend - Bulk contact update started');
        console.log('🔍 Backend - Request headers:', req.headers);
        const { content } = req.body;
        console.log('🔍 Backend - Request body received:', JSON.stringify(content, null, 2));

        if (!content || typeof content !== 'object') {
            return res.status(400).json({
                success: false,

                error: 'Invalid content format'
            });
        }

        const updates = [];

        // Process contact main section
        if (content.contactMain) {
            const { title, subtitle, description, contactInfo, enabled } = content.contactMain;
            
            // Section title
            updates.push(
                db.contactContent.upsertBySectionAndKey('contact_main', 'section_title', {
                    title: title || 'Get in Touch',
                    description: subtitle || 'We\'d love to hear from you',
                    isActive: enabled !== false
                })
            );

            // Contact description
            updates.push(
                db.contactContent.upsertBySectionAndKey('contact_main', 'contact_description', {
                    content: description || 'Have questions about our programs...',
                    isActive: enabled !== false
                })
            );

            // Contact information
            if (contactInfo) {
                updates.push(
                    db.contactContent.upsertBySectionAndKey('contact_main', 'contact_address', {
                        content: contactInfo.address || '',
                        isActive: enabled !== false
                    })
                );
                updates.push(
                    db.contactContent.upsertBySectionAndKey('contact_main', 'contact_phone', {
                        content: contactInfo.phone || '',
                        isActive: enabled !== false
                    })
                );
                updates.push(
                    db.contactContent.upsertBySectionAndKey('contact_main', 'contact_email', {
                        content: contactInfo.email || '',
                        isActive: enabled !== false
                    })
                );
                updates.push(
                    db.contactContent.upsertBySectionAndKey('contact_main', 'contact_hours', {
                        content: contactInfo.hours || '',
                        isActive: enabled !== false
                    })
                );
            }

            // Section enabled
            updates.push(
                db.contactContent.upsertBySectionAndKey('contact_main', 'section_enabled', {
                    isActive: enabled !== false
                })
            );
        }

        // Process location section
        if (content.locationSection) {
            const { title, subtitle, description, headquarters, maps, enabled } = content.locationSection;
            
            // Section title
            updates.push(
                db.contactContent.upsertBySectionAndKey('location_section', 'section_title', {
                    title: title || 'Our Location',
                    description: subtitle || 'Connecting Near and Far',
                    isActive: enabled !== false
                })
            );

            // Map description
            updates.push(
                db.contactContent.upsertBySectionAndKey('location_section', 'map_description', {
                    content: description || 'Our campus is easily accessible...',
                    isActive: enabled !== false
                })
            );

            // Headquarters information
            if (headquarters) {
            updates.push(
                    db.contactContent.upsertBySectionAndKey('location_section', 'headquarters_name', {
                        content: headquarters.organizationName || 'Marigold English Boarding School',
                    isActive: enabled !== false
                })
            );
                
                updates.push(
                    db.contactContent.upsertBySectionAndKey('location_section', 'headquarters_city', {
                        content: headquarters.city || 'Kathmandu, Nepal',
                        isActive: enabled !== false
                    })
                );
                
                updates.push(
                    db.contactContent.upsertBySectionAndKey('location_section', 'headquarters_address', {
                        content: headquarters.streetAddress || '123 Education Street, Suite 456',
                        isActive: enabled !== false
                    })
                );
                
                updates.push(
                    db.contactContent.upsertBySectionAndKey('location_section', 'headquarters_postal', {
                        content: headquarters.postalCode || 'Kathmandu, NP 44600',
                        isActive: enabled !== false
                    })
                );
                
                updates.push(
                    db.contactContent.upsertBySectionAndKey('location_section', 'headquarters_country', {
                        content: headquarters.country || 'Nepal',
                        isActive: enabled !== false
                    })
                );
            }

            // Maps information
            if (maps) {
                updates.push(
                    db.contactContent.upsertBySectionAndKey('location_section', 'map_embed_url', {
                        content: maps.embedUrl || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2936.6700551124654!2d82.29947430460153!3d28.13106831147718!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3997f47fc8c8a727%3A0xbe35592360fe8897!2sMarigold%20Deep%20College!5e1!3m2!1sen!2snp!4v1756340841090!5m2!1sen!2snp',
                        isActive: enabled !== false
                    })
                );
                
                updates.push(
                    db.contactContent.upsertBySectionAndKey('location_section', 'map_direct_url', {
                        content: maps.directUrl || 'https://maps.app.goo.gl/4947ysd5HHPvsiPd7',
                        isActive: enabled !== false
                    })
                );
            }

            // Section enabled
            updates.push(
                db.contactContent.upsertBySectionAndKey('location_section', 'section_enabled', {
                    isActive: enabled !== false
                })
            );
        }

        // Process FAQ section
        if (content.faqSection) {
            const { title, subtitle, faqs, deletedFAQs, enabled } = content.faqSection;
            console.log('🔍 Backend - FAQ Section received:', { 
                title, 
                subtitle, 
                faqsCount: faqs?.length, 
                deletedFAQsCount: deletedFAQs?.length, 
                enabled,
                deletedFAQs: deletedFAQs
            });
            
            // Section title
            updates.push(
                db.contactContent.upsertBySectionAndKey('faq_section', 'section_title', {
                    title: title || 'Frequently Asked Questions',
                    description: subtitle || 'Quick answers to common questions',
                    isActive: enabled !== false
                })
            );

            // Section enabled
            updates.push(
                db.contactContent.upsertBySectionAndKey('faq_section', 'section_enabled', {
                    isActive: enabled !== false
                })
            );

            // Process deleted FAQs first (if any)
            if (deletedFAQs && Array.isArray(deletedFAQs) && deletedFAQs.length > 0) {
                console.log(`🗑️ Processing ${deletedFAQs.length} deleted FAQs for database cleanup`);
                
                try {
                    const existingFaqs = await db.contactContent.findAll({ section: 'faq_section' });
                    console.log(`🔍 Found ${existingFaqs.length} existing FAQ entries in database`);
                    
                    for (const deletedFAQ of deletedFAQs) {
                        console.log(`🔍 Processing deleted FAQ: "${deletedFAQ.question}"`);
                        
                        // Find and delete matching FAQ entries from database using more flexible matching
                        const matchingFaqs = existingFaqs.filter(item => {
                            if (!item.key.startsWith('faq_')) return false;
                            
                            // Clean the database values for comparison
                            const dbQuestion = (item.title || '').trim().replace(/[^\w\s\?\.\!]/g, '');
                            const dbAnswer = (item.content || '').trim().replace(/[^\w\s\?\.\!]/g, '');
                            const delQuestion = (deletedFAQ.question || '').trim().replace(/[^\w\s\?\.\!]/g, '');
                            const delAnswer = (deletedFAQ.answer || '').trim().replace(/[^\w\s\?\.\!]/g, '');
                            
                            // Check for exact match or very close match
                            const questionMatch = dbQuestion === delQuestion || dbQuestion.includes(delQuestion) || delQuestion.includes(dbQuestion);
                            const answerMatch = dbAnswer === delAnswer || dbAnswer.includes(delAnswer) || delAnswer.includes(dbAnswer);
                            
                            return questionMatch && answerMatch;
                        });
                        
                        console.log(`🔍 Found ${matchingFaqs.length} matching FAQ entries for: "${deletedFAQ.question}"`);
                        
                        for (const matchingFaq of matchingFaqs) {
                            try {
                                console.log(`🗑️ Deleting FAQ with ID: ${matchingFaq.id}, Key: ${matchingFaq.key}`);
                                await db.contactContent.delete(matchingFaq.id);
                                console.log(`✅ Successfully deleted FAQ from database: "${matchingFaq.title}"`);
                            } catch (deleteError) {
                                if (deleteError.code === 'P2025') {
                                    console.log(`ℹ️ FAQ already deleted: ${matchingFaq.key}`);
                                } else {
                                    console.error(`❌ Error deleting FAQ from database:`, deleteError);
                                }
                            }
                        }
                    }
                } catch (error) {
                    console.error('❌ Error processing deleted FAQs:', error);
                }
            }
            
            // FAQs - Use a more reliable approach: delete all FAQs and re-save current ones
            if (faqs && Array.isArray(faqs)) {
                // Get all existing FAQ entries
                const existingFaqs = await db.contactContent.findAll({ section: 'faq_section' });
                const existingFaqEntries = existingFaqs.filter(item => item.key.startsWith('faq_'));
                
                console.log(`🧹 FAQ Sync: Found ${existingFaqEntries.length} existing FAQ entries in database`);
                console.log(`💾 FAQ Sync: Will save ${faqs.length} current FAQ entries from UI`);
                
                // Delete ALL existing FAQ entries to ensure perfect sync
                for (const faqEntry of existingFaqEntries) {
                    try {
                        await db.contactContent.delete(faqEntry.id);
                        console.log(`🗑️ Deleted existing FAQ: ${faqEntry.key}`);
                    } catch (deleteError) {
                        console.error(`❌ Error deleting existing FAQ ${faqEntry.key}:`, deleteError);
                    }
                }
                
                console.log(`✅ All existing FAQs cleared from database`);
                
                // Now save the current FAQs from UI
                faqs.forEach((faq, index) => {
                    const faqKey = `faq_${index + 1}`;
                    
                    // Clean the data by removing extra characters and trimming
                    const cleanQuestion = (faq.question || '').trim().replace(/[^\w\s\?\.\!]/g, '');
                    const cleanAnswer = (faq.answer || '').trim().replace(/[^\w\s\?\.\!]/g, '');
                    
                    // Only save if there's actual content
                    if (cleanQuestion || cleanAnswer) {
                    updates.push(
                        db.contactContent.upsertBySectionAndKey('faq_section', faqKey, {
                                title: cleanQuestion,
                                content: cleanAnswer,
                            isActive: enabled !== false
                        })
                    );
                        console.log(`💾 Queued FAQ for save: ${faqKey} - "${cleanQuestion}"`);
                    }
                });
            } else {
                // If no FAQs are provided, delete all existing FAQs
                const existingFaqs = await db.contactContent.findAll({ section: 'faq_section' });
                const existingFaqEntries = existingFaqs.filter(item => item.key.startsWith('faq_'));
                
                console.log(`🧹 No FAQs provided, cleaning up ${existingFaqEntries.length} existing FAQ entries from database`);
                
                for (const faqEntry of existingFaqEntries) {
                    await db.contactContent.delete(faqEntry.id);
                }
            }
        }

        // Process social media section
        if (content.socialMedia) {
            const { title, subtitle, links, enabled } = content.socialMedia;
            
            // Section title
            updates.push(
                db.contactContent.upsertBySectionAndKey('social_media', 'section_title', {
                    title: title || 'Connect With Us',
                    description: subtitle || 'Follow us for updates and school news',
                    isActive: enabled !== false
                })
            );

            // Section enabled
            updates.push(
                db.contactContent.upsertBySectionAndKey('social_media', 'section_enabled', {
                    isActive: enabled !== false
                })
            );

            // Social media links
            if (links && Array.isArray(links)) {
                const linkKeys = ['facebook_link', 'instagram_link', 'linkedin_link', 'youtube_link'];
                links.forEach((link, index) => {
                    if (linkKeys[index]) {
                        updates.push(
                            db.contactContent.upsertBySectionAndKey('social_media', linkKeys[index], {
                                title: link.platform || '',
                                linkUrl: link.url || '',
                                description: link.description || '',
                                metadata: link.icon || '',
                                isActive: enabled !== false
                            })
                        );
                    }
                });
            }
        }

        // Process CTA section
        if (content.ctaSection) {
            const { title, subtitle, description, primaryButton, secondaryButton, enabled } = content.ctaSection;
            
            // Section title
            updates.push(
                db.contactContent.upsertBySectionAndKey('cta_section', 'section_title', {
                    title: title || 'Ready to Get Started?',
                    description: subtitle || 'Join our community of learners and achievers',
                    isActive: enabled !== false
                })
            );

            // CTA description
            updates.push(
                db.contactContent.upsertBySectionAndKey('cta_section', 'cta_description', {
                    content: description || 'Don\'t wait! Secure your child\'s future...',
                    isActive: enabled !== false
                })
            );

            // Primary button
            if (primaryButton) {
                updates.push(
                    db.contactContent.upsertBySectionAndKey('cta_section', 'primary_button', {
                        title: primaryButton.text || 'Apply Now',
                        linkUrl: primaryButton.link || '/apply.html',
                        isActive: enabled !== false
                    })
                );
            }

            // Secondary button
            if (secondaryButton) {
                updates.push(
                    db.contactContent.upsertBySectionAndKey('cta_section', 'secondary_button', {
                        title: secondaryButton.text || 'Schedule a Visit',
                        linkUrl: secondaryButton.link || '/contact.html',
                        isActive: enabled !== false
                    })
                );
            }

            // Section enabled
            updates.push(
                db.contactContent.upsertBySectionAndKey('cta_section', 'section_enabled', {
                    isActive: enabled !== false
                })
            );
        }

        // Execute all updates
        console.log('🔄 Executing database updates...');
        await Promise.all(updates);

        console.log('✅ Contact content bulk updated successfully');
        console.log('📊 Total updates processed:', updates.length);
        
        // Send response with detailed information
            res.json({
                success: true,
            message: 'Contact content updated successfully',
            updatesCount: updates.length,
            timestamp: new Date().toISOString()
            });
    } catch (error) {

        console.error('❌ Error bulk updating contact content:', error);
        res.status(500).json({
            success: false,

            error: 'Failed to update contact content',
            message: error.message
        });
    }
});

// ===== TOGGLE SECTION VISIBILITY =====

// Toggle homepage section visibility
router.put('/home/toggle/:section', authenticateToken, requireRole(['admin']), async (req, res) => {
    try {
        const { section } = req.params;
        const { enabled } = req.body;
        
        if (typeof enabled !== 'boolean') {
            return res.status(400).json({ error: 'enabled must be a boolean value' });
        }

        // Map frontend section names to database section names
        const sectionMapping = {
            'hero': 'hero',
            'quick-facts': 'quick_facts',
            'why-choose-us': 'why_choose',
            'mission': 'mission',
            'programs': 'programs',
            'testimonials': 'testimonials',
            'gallery': 'gallery',
            'contact': 'contact'
        };

        const dbSectionName = sectionMapping[section] || section;

        // Update all content items in this section
        const result = await db.homepageContent.updateMany(
            { section: dbSectionName },
            { isActive: enabled }
        );

        console.log(`📝 Toggling homepage section '${section}' to ${enabled ? 'active' : 'inactive'}`);
        console.log(`✅ Updated ${result.count} content items`);

            res.json({
                success: true,
            message: `Section '${section}' ${enabled ? 'enabled' : 'disabled'} successfully`,
            section,
            enabled,
            updatedCount: result.count
        });
    } catch (error) {
        console.error('Error toggling homepage section:', error);
        res.status(500).json({ error: 'Failed to toggle section' });
    }
});

// Toggle academics section visibility
router.put('/academics/toggle/:section', authenticateToken, requireRole(['admin']), async (req, res) => {
    try {
        const { section } = req.params;
        const { enabled } = req.body;
        
        if (typeof enabled !== 'boolean') {
            return res.status(400).json({ error: 'enabled must be a boolean value' });
        }

        // Map frontend section names to database section names
        const sectionMapping = {
            'philosophy': 'academic_philosophy',
            'curriculum': 'curriculum_overview',
            'grade-levels': 'grade_levels',
            'teaching-methods': 'teaching_methods',
            'beyond-academics': 'beyond_academics',
            'achievements': 'academic_achievements',
            'cta': 'cta_section'
        };

        const dbSectionName = sectionMapping[section] || section;
        console.log(`🔧 Mapping academics section '${section}' to database section '${dbSectionName}'`);

        // Update all content items in this section
        const result = await db.academicsContent.updateMany(
            { section: dbSectionName },
            { isActive: enabled }
        );

        console.log(`📝 Toggling academics section '${section}' to ${enabled ? 'active' : 'inactive'}`);
        console.log(`✅ Updated ${result.count} content items`);

        res.json({ 
            success: true, 
            message: `Section '${section}' ${enabled ? 'enabled' : 'disabled'} successfully`,
            section,
            enabled,
            updatedCount: result.count
        });
    } catch (error) {
        console.error('Error toggling academics section:', error);
        res.status(500).json({ error: 'Failed to toggle section' });
    }
});

// Toggle contact section visibility
router.put('/contact/toggle/:section', authenticateToken, requireRole(['admin']), async (req, res) => {
    try {
        const { section } = req.params;
        const { enabled } = req.body;
        
        if (typeof enabled !== 'boolean') {
            return res.status(400).json({ error: 'enabled must be a boolean value' });
        }

        // Map frontend section names to database section names
        const sectionMapping = {
            'contact-info': 'contact_main',
            'location': 'location_section',
            'social-media': 'social_media',
            'cta': 'cta_section',
            'faq': 'faq_section',
            'emergency': 'emergency_contact'
        };

        const dbSectionName = sectionMapping[section] || section;
        console.log(`🔧 Mapping contact section '${section}' to database section '${dbSectionName}'`);

        // Update all content items in this section
        const result = await db.contactContent.updateMany(
            { section: dbSectionName },
            { isActive: enabled }
        );

        console.log(`📝 Toggling contact section '${section}' to ${enabled ? 'active' : 'inactive'}`);
        console.log(`✅ Updated ${result.count} content items`);

        res.json({ 
            success: true, 
            message: `Section '${section}' ${enabled ? 'enabled' : 'disabled'} successfully`,
            section,
            enabled,
            updatedCount: result.count
        });
    } catch (error) {
        console.error('Error toggling contact section:', error);
        res.status(500).json({ error: 'Failed to toggle section' });
    }
});

// ===== EVENTS & NOTICES CONTENT =====

// Get all events
router.get('/events', async (req, res) => {
    try {
        const { type } = req.query;
        console.log('📥 Fetching events content... Type:', type);
        
        // If type is specified, return only that type
        if (type === 'past') {
            const pastEvents = await db.eventsContent.findMany({
                where: {
                    section: 'past_events',
                    isActive: true
                },
                orderBy: {
                    eventDate: 'desc'
                }
            });
            
            return res.json({
                success: true,
                content: {
                    past: pastEvents.map(event => ({
                        id: event.id,
                        title: event.title,
                        subtitle: (event.description || event.content || '').substring(0, 100) + '...',
                        description: event.description || event.content,
                        date: event.eventDate,
                        time: event.eventTime,
                        location: event.venue,
                        attendees: 'Many',
                        image: event.imageUrl,
                        imageUrl: event.imageUrl,
                        category: event.category
                    }))
                }
            });
        } else if (type === 'upcoming') {
            const upcomingEvents = await db.eventsContent.findMany({
                where: {
                    section: 'upcoming_events',
                    isActive: true
                },
                orderBy: {
                    eventDate: 'asc'
                }
            });
            
            return res.json({
                success: true,
                content: {
                    upcoming: upcomingEvents.map(event => ({
                        id: event.id,
                        title: event.title,
                        description: event.description || event.content,
                        date: event.eventDate,
                        time: event.eventTime,
                        location: event.venue,
                        image: event.imageUrl,
                        category: event.category
                    }))
                }
            });
        }
        
        // Default: Fetch all events (upcoming and past)
        // Fetch upcoming events from EventsContent
        const upcomingEvents = await db.eventsContent.findMany({
            where: {
                section: 'upcoming_events',
                isActive: true
            },
            orderBy: {
                eventDate: 'asc'
            }
        });

        console.log('🔍 Found upcoming events in database:', upcomingEvents.length);
        console.log('🔍 Upcoming events data:', upcomingEvents.map(e => ({ id: e.id, title: e.title, eventDate: e.eventDate })));

        // Fetch past events from EventsContent
        const pastEvents = await db.eventsContent.findMany({
            where: {
                section: 'past_events',
                isActive: true
            },
            orderBy: {
                eventDate: 'desc'
            },
            take: 6
        });

        // Find featured event (first upcoming event for now)
        const featuredEvent = upcomingEvents.length > 0 ? upcomingEvents[0] : null;
        console.log('🔍 Featured event:', featuredEvent ? { id: featuredEvent.id, title: featuredEvent.title } : 'None');
        console.log('🔍 Upcoming events after featured logic:', upcomingEvents.length);
        
        // Don't use upcoming events as featured events - keep them separate
        // This ensures upcoming events always show in the upcoming section

        const content = {
            featured: featuredEvent ? {
                id: featuredEvent.id,
                title: featuredEvent.title,
                description: featuredEvent.description || featuredEvent.content,
                date: featuredEvent.eventDate,
                time: featuredEvent.eventTime,
                location: featuredEvent.venue,
                image: featuredEvent.imageUrl,
                category: featuredEvent.category,
                badge: 'Featured Event'
            } : null,
            upcoming: (() => {
                // Don't slice - show all upcoming events
                const upcomingArray = upcomingEvents;
                console.log('🔍 Final upcoming array length:', upcomingArray.length);
                console.log('🔍 Final upcoming array:', upcomingArray.map(e => ({ id: e.id, title: e.title })));
                return upcomingArray.map(event => {
                    console.log('🔍 Mapping upcoming event:', { 
                        id: event.id, 
                        title: event.title, 
                        hasId: !!event.id,
                        idType: typeof event.id 
                    });
                    return {
                id: event.id,
                title: event.title,
                description: event.description || event.content,
                date: event.eventDate,
                time: event.eventTime,
                location: event.venue,
                image: event.imageUrl,
                category: event.category
                    };
                });
            })(),
            past: pastEvents.map(event => ({
                id: event.id,
                title: event.title,
                subtitle: (event.description || event.content || '').substring(0, 100) + '...',
                date: event.eventDate,
                attendees: 'Many',
                image: event.imageUrl
            }))
        };

        console.log('✅ Events content fetched successfully');
        res.json({
            success: true,
            content: content
        });

    } catch (error) {
        console.error('❌ Error fetching events content:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch events content'
        });
    }
});

// Get all notices
router.get('/notices', async (req, res) => {
    try {
        console.log('📥 Fetching notices content...');
        
        // Fetch notices from EventsContent with section 'notices'
        const noticesData = await db.eventsContent.findMany({
            where: {
                section: 'notices',
                isActive: true
            },
            orderBy: {
                updatedAt: 'desc'
            },
            take: 10
        });

        const notices = noticesData.map(notice => {
            let pdfFiles = null;
            if (notice.pdfFiles) {
                try {
                    pdfFiles = typeof notice.pdfFiles === 'string' 
                        ? JSON.parse(notice.pdfFiles) 
                        : notice.pdfFiles;
                } catch (e) {
                    console.log('📄 Error parsing PDF files for notice:', notice.id);
                }
            }
            
            return {
                id: notice.id,
                title: notice.title,
                description: notice.description || notice.content,
                category: notice.category || 'general',
                publishDate: notice.updatedAt,
                documentUrl: notice.imageUrl || null,
                pdfFiles: pdfFiles
            };
        });

        console.log('✅ Notices content fetched successfully');
        res.json({
            success: true,
            content: notices
        });

    } catch (error) {
        console.error('❌ Error fetching notices content:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch notices content'
        });
    }
});

// Get all announcements
router.get('/announcements', async (req, res) => {
    try {
        console.log('📥 Fetching announcements content...');
        
        // Fetch announcements from EventsContent with section 'announcements'
        const announcementsData = await db.eventsContent.findMany({
            where: {
                section: 'announcements',
                isActive: true
            },
            orderBy: {
                updatedAt: 'desc'
            },
            take: 10
        });

        const announcements = announcementsData.map(announcement => ({
            id: announcement.id,
            title: announcement.title,
            description: announcement.description || announcement.content,
            type: announcement.category || 'general',
            date: announcement.updatedAt
        }));

        console.log('✅ Announcements content fetched successfully');
        res.json({
            success: true,
            content: announcements
        });

    } catch (error) {
        console.error('❌ Error fetching announcements content:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch announcements content'
        });
    }
});

// ===== GALLERY CONTENT =====
router.get('/gallery', async (req, res) => {
    try {
        console.log('📥 Fetching gallery content from database...');
        
        // Fetch photo albums and individual photos from database
        const photoAlbumsData = await db.gallery.findMany({
            where: {
                itemType: 'photoAlbum',
                isActive: true,
                albumId: null // Only get albums, not individual photos within albums
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        const photoItemsData = await db.gallery.findMany({
            where: {
                itemType: 'photo',
                isActive: true,
                albumId: null // Only get standalone photos
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Combine and limit to 12 most recent
        const photoAlbums = [...photoAlbumsData, ...photoItemsData]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 12);

        console.log(`✅ Found ${photoAlbums.length} photo albums`);

        // Transform to gallery items format
        const galleryItems = photoAlbums.map(album => ({
            id: album.id,
            title: album.title,
            category: album.category || 'general',
            image: album.imageUrl || '/images/placeholder.jpg',
            description: album.description || '',
            date: album.createdAt
        }));

        console.log('✅ Gallery content fetched successfully');
        res.json({ success: true, content: galleryItems });
    } catch (error) {
        console.error('❌ Error fetching gallery content:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch gallery content' });
    }
});

// ===== PHOTO ALBUMS SECTION =====

// Get Photo Albums
router.get('/gallery/photo-albums', async (req, res) => {
    try {
        console.log('📥 Fetching photo albums...');
        
        // Set cache headers to prevent caching
        res.set({
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        });
        
        // Fetch photo albums from unified Gallery table
        const photoAlbums = await db.gallery.findMany({
            where: {
                itemType: 'photoAlbum',
                isActive: true
            },
            orderBy: { orderIndex: 'asc' }
        });

        // Manually fetch items for each album
        const albumsWithItems = await Promise.all(photoAlbums.map(async (album) => {
            const items = await db.gallery.findMany({
                where: {
                    albumId: album.id,
                    isActive: true
                },
                orderBy: { orderIndex: 'asc' }
            });
            return { ...album, items };
        }));

        console.log(`✅ Found ${photoAlbums.length} photo albums`);
        res.json({ 
            success: true, 
            albums: albumsWithItems 
        });
    } catch (error) {
        console.error('❌ Error fetching photo albums:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch photo albums' 
        });
    }
});

// Get individual album details
router.get('/gallery/album/:albumId', async (req, res) => {
    try {
        const { albumId } = req.params;
        console.log(`📥 Fetching album details: ${albumId}`);
        
        // Find album (check both photo and video albums)
        let album = await db.gallery.findFirst({
            where: {
                id: albumId,
                itemType: 'photoAlbum',
                isActive: true
            }
        });

        // If not found as photoAlbum, try videoAlbum
        if (!album) {
            album = await db.gallery.findFirst({
                where: {
                    id: albumId,
                    itemType: 'videoAlbum',
                    isActive: true
                }
            });
        }

        if (!album) {
            return res.status(404).json({
                success: false,
                error: 'Album not found'
            });
        }

        // Get the count of photos or videos in this album
        const itemType = album.itemType === 'photoAlbum' ? 'photo' : 'video';
        const items = await db.gallery.findMany({
            where: {
                albumId: albumId,
                itemType: itemType,
                isActive: true
            }
        });

        const itemCount = items.length;
        const countLabel = album.itemType === 'photoAlbum' 
            ? `${itemCount} Photo${itemCount !== 1 ? 's' : ''}`
            : `${itemCount} Video${itemCount !== 1 ? 's' : ''}`;

        console.log(`✅ Found album: ${album.title} (${album.itemType}) with ${itemCount} items`);
        console.log(`📊 Count details - itemCount: ${itemCount}, countLabel: ${countLabel}`);
        
        // Build response with explicit fields to avoid spread operator issues
        const albumResponse = {
            id: album.id,
            title: album.title,
            description: album.description,
            imageUrl: album.imageUrl,
            category: album.category,
            itemType: album.itemType,
            orderIndex: album.orderIndex,
            isActive: album.isActive,
            createdAt: album.createdAt,
            updatedAt: album.updatedAt,
            // Add count fields
            itemCount: itemCount,
            countLabel: countLabel,
            photoCount: album.itemType === 'photoAlbum' ? itemCount : undefined,
            videoCount: album.itemType === 'videoAlbum' ? itemCount : undefined
        };
        
        console.log(`📤 Sending response with count: ${albumResponse.countLabel}`);
        
        res.json({
            success: true,
            album: albumResponse
        });
    } catch (error) {
        console.error('❌ Error fetching album details:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch album details'
        });
    }
});

// Update album
router.put('/gallery/album/:albumId', async (req, res) => {
    try {
        const { albumId } = req.params;
        const updateData = req.body;
        
        console.log(`💾 Updating album: ${albumId}`, updateData);
        
        // Prepare update data
        const albumUpdateData = {
            title: updateData.title,
            description: updateData.description,
            category: updateData.category || 'general'
        };
        
        // Only update imageUrl if it's provided
        if (updateData.imageUrl !== undefined) {
            albumUpdateData.imageUrl = updateData.imageUrl;
            console.log('🖼️ Updating imageUrl to:', updateData.imageUrl);
        }
        
        console.log('💾 Update data being sent to DB:', albumUpdateData);
        
        // Update the album
        const updatedAlbum = await db.gallery.update(albumId, albumUpdateData);

        console.log(`✅ Album updated successfully: ${updatedAlbum.title}`);
        console.log('✅ Album imageUrl in DB:', updatedAlbum.imageUrl);
        
        res.json({
            success: true,
            album: updatedAlbum
        });
    } catch (error) {
        console.error('❌ Error updating album:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update album'
        });
    }
});

// Get photos for a specific album
router.get('/gallery/album/:albumId/photos', async (req, res) => {
    try {
        const { albumId } = req.params;
        console.log(`📥 Fetching photos for album: ${albumId}`);
        
        // Set cache headers to prevent caching
        res.set({
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        });
        
        // Fetch album details
        const album = await db.gallery.findFirst({
            where: {
                id: albumId,
                itemType: 'photoAlbum',
                isActive: true
            }
        });

        if (!album) {
            return res.status(404).json({
                success: false,
                error: 'Album not found'
            });
        }

        // Fetch photos in this album
        const photos = await db.gallery.findMany({
            where: {
                albumId: albumId,
                itemType: 'photo',
                isActive: true
            },
            orderBy: { orderIndex: 'asc' }
        });

        console.log(`✅ Found ${photos.length} photos for album: ${album.title}`);
        res.json({
            success: true,
            album: album,
            photos: photos
        });
    } catch (error) {
        console.error('❌ Error fetching album photos:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch album photos'
        });
    }
});

// Get available categories
router.get('/gallery/categories', async (req, res) => {
    try {
        console.log('📥 Fetching available categories...');
        
        // Fetch categories from dedicated categories row
        const categoriesRow = await db.gallery.findFirst({
            where: {
                itemType: 'categories',
                isActive: true
            }
        });

        let categoryList = [];
        
        if (categoriesRow && categoriesRow.tags) {
            // Parse categories from tags field (comma-separated)
            categoryList = categoriesRow.tags.split(',').map(tag => tag.trim()).filter(Boolean);
        } else {
            // Fallback: get distinct categories from existing gallery items
            console.log('⚠️ Categories row not found, falling back to existing items...');
            const allItems = await db.gallery.findMany({
                where: {
                    isActive: true
                }
            });
            
            // Extract unique categories manually
            const categoriesSet = new Set();
            allItems.forEach(item => {
                if (item.category) {
                    categoriesSet.add(item.category);
                }
            });
            categoryList = Array.from(categoriesSet);
        }
        
        console.log(`✅ Found ${categoryList.length} categories:`, categoryList);
        
        res.json({
            success: true,
            categories: categoryList
        });
    } catch (error) {
        console.error('❌ Error fetching categories:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch categories'
        });
    }
});

// Add new category
router.post('/gallery/categories', authenticateToken, requireRole(['admin']), async (req, res) => {
    try {
        const { category } = req.body;
        
        if (!category || !category.trim()) {
            return res.status(400).json({
                success: false,
                error: 'Category name is required'
            });
        }
        
        const categoryName = category.trim();
        console.log(`📝 Adding new category: ${categoryName}`);
        
        // Fetch categories row
        const categoriesRow = await db.gallery.findFirst({
            where: {
                itemType: 'categories',
                isActive: true
            }
        });

        if (!categoriesRow) {
            return res.status(404).json({
                success: false,
                error: 'Categories row not found'
            });
        }

        // Get current categories
        let categoryList = categoriesRow.tags ? categoriesRow.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [];
        
        // Check if category already exists (case-insensitive)
        const categoryExists = categoryList.some(cat => cat.toLowerCase() === categoryName.toLowerCase());
        
        if (categoryExists) {
            return res.json({
                success: true,
                message: 'Category already exists',
                categories: categoryList
            });
        }
        
        // Add new category
        categoryList.push(categoryName);
        
        console.log(`🔄 Updating categories row...`);
        console.log(`   Row ID: ${categoriesRow.id}`);
        console.log(`   Old tags: ${categoriesRow.tags}`);
        console.log(`   New tags: ${categoryList.join(', ')}`);
        
        // Update categories row
        const updated = await db.gallery.update(categoriesRow.id, {
            tags: categoryList.join(', ')
        });
        
        console.log(`✅ Category added successfully: ${categoryName}`);
        console.log(`   Updated row tags: ${updated.tags}`);
        
        res.json({
            success: true,
            message: 'Category added successfully',
            categories: categoryList
        });
    } catch (error) {
        console.error('❌ Error adding category:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to add category'
        });
    }
});

// ===== GALLERY HERO SECTION =====

// Get Gallery Hero Section
router.get('/gallery/hero', async (req, res) => {
    try {
        console.log('📥 Fetching gallery hero section...');
        
        // Fetch hero section from unified Gallery table
        const heroItem = await db.gallery.findFirst({
            where: {
                itemType: 'hero',
                isActive: true
            }
        });

        // Default hero data
        const heroData = {
            title: 'Photo Gallery',
            description: 'Explore our collection of memorable moments, school activities, and celebrations that showcase the vibrant life at Marigold English Boarding School.',
            buttonText: 'Explore Gallery',
            backgroundImage: '/images/science_project.jpg',
            enabled: true
        };

        // Override with database values if they exist
        if (heroItem) {
            heroData.title = heroItem.title || heroData.title;
            heroData.description = heroItem.description || heroData.description;
            // Extract button text from tags (assuming format: "buttonText,other,tags")
            const tagsArray = heroItem.tags ? heroItem.tags.split(',') : [];
            heroData.buttonText = tagsArray[0] && tagsArray[0] !== 'hero' && tagsArray[0] !== 'gallery' && tagsArray[0] !== 'banner' 
                ? tagsArray[0] 
                : heroData.buttonText;
            heroData.backgroundImage = heroItem.imageUrl || heroData.backgroundImage;
            heroData.enabled = heroItem.isActive;
        }

        console.log('✅ Gallery hero section fetched successfully');
        res.json({ 
            success: true, 
            hero: heroData 
        });
    } catch (error) {
        console.error('❌ Error fetching gallery hero section:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch gallery hero section' 
        });
    }
});

// Update Gallery Hero Section
router.put('/gallery/hero', async (req, res) => {
    try {
        console.log('💾 Updating gallery hero section...');
        
        const { title, description, buttonText, backgroundImage, enabled } = req.body;
        
        // Find existing hero item
        let heroItem = await db.gallery.findFirst({
            where: {
                itemType: 'hero'
            }
        });

        // Prepare update data
        const updateData = {
            title: title || 'Photo Gallery',
            description: description || '',
            imageUrl: backgroundImage || '',
            tags: buttonText || 'Explore Gallery', // Using tags field for button text
            isActive: enabled !== undefined ? enabled : true,
            category: 'hero',
            itemType: 'hero',
            orderIndex: 1
        };

        if (heroItem) {
            // Update existing hero item
            heroItem = await db.gallery.update(heroItem.id, updateData);
        } else {
            // Create new hero item
            heroItem = await db.gallery.create({
                title: updateData.title,
                description: updateData.description,
                imageUrl: updateData.imageUrl,
                videoUrl: updateData.videoUrl || null,
                category: updateData.category,
                itemType: updateData.itemType,
                albumId: updateData.albumId || null,
                icon: updateData.icon || null,
                orderIndex: updateData.orderIndex,
                tags: updateData.tags,
                isFeatured: updateData.isFeatured || false,
                isActive: updateData.isActive,
                uploadedBy: null // No specific uploader for system content
            });
        }

        console.log('✅ Gallery hero section updated successfully');
        res.json({ 
            success: true, 
            message: 'Gallery hero section updated successfully',
            hero: heroItem
        });
    } catch (error) {
        console.error('❌ Error updating gallery hero section:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to update gallery hero section' 
        });
    }
});

// ===== PHOTO ALBUMS CONTENT =====

// Get all photo albums
router.get('/gallery/photo-albums', async (req, res) => {
    try {
        console.log('📥 Fetching photo albums...');
        
        // Fetch photo albums from database (itemType: 'album', category: 'photo')
        const photoAlbums = await db.gallery.findMany({
            where: {
                itemType: 'photoAlbum',
                isActive: true
            },
            orderBy: { orderIndex: 'asc' }
        });

        // Manually fetch items and uploader for each album
        const albumsData = await Promise.all(photoAlbums.map(async (album) => {
            // Fetch items for this album
            const items = await db.gallery.findMany({
                where: {
                    albumId: album.id,
                    itemType: 'photo',
                    isActive: true
                },
                orderBy: { orderIndex: 'asc' }
            });

            // Fetch uploader if exists
            let uploader = null;
            if (album.uploadedBy) {
                uploader = await db.users.findById(album.uploadedBy);
            }

            // Count only non-featured items (exclude featured moments)
            const regularPhotos = items.filter(item => !item.isFeatured);
            const photoCount = regularPhotos.length;
            
            const transformedAlbum = {
                id: album.id,
                title: album.title,
                description: album.description,
                coverImage: album.imageUrl,
                imageUrl: album.imageUrl, // For compatibility
                photoCount: photoCount,
                itemCount: photoCount, // For compatibility
                category: album.category,
                tags: album.tags,
                isFeatured: album.isFeatured,
                createdAt: album.createdAt,
                updatedAt: album.updatedAt,
                uploadedBy: uploader ? `${uploader.firstName} ${uploader.lastName}` : 'System',
                totalItems: items.length, // Include total for debugging
                featuredItems: items.length - photoCount // Count of featured items
            };
            console.log(`📦 Transformed album "${album.title}": ${items.length} total items (${photoCount} regular + ${items.length - photoCount} featured) → photoCount: ${transformedAlbum.photoCount}`);
            return transformedAlbum;
        }));

        console.log(`✅ Found ${albumsData.length} photo albums`);
        console.log('📤 Sending response:', JSON.stringify(albumsData, null, 2));
        res.json({
            success: true,
            albums: albumsData
        });

    } catch (error) {
        console.error('❌ Error fetching photo albums:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch photo albums'
        });
    }
});

// Get single photo album with photos
router.get('/gallery/photo-albums/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`📥 Fetching photo album: ${id}`);
        
        const album = await db.gallery.findUnique({
            where: { id }
        });

        if (!album) {
            return res.status(404).json({
                success: false,
                error: 'Photo album not found'
            });
        }

        // Manually fetch related data (items and uploader)
        const items = await db.gallery.findMany({
            where: {
                albumId: id,
                itemType: 'photo',
                isActive: true
            },
            orderBy: { orderIndex: 'asc' }
        });

        let uploader = null;
        if (album.uploadedBy) {
            uploader = await db.users.findById(album.uploadedBy);
        }

        // Transform data for frontend
        const albumData = {
            id: album.id,
            title: album.title,
            description: album.description,
            coverImage: album.imageUrl, // For backwards compatibility
            imageUrl: album.imageUrl, // For consistency
            category: album.category,
            tags: album.tags,
            isFeatured: album.isFeatured,
            createdAt: album.createdAt,
            updatedAt: album.updatedAt,
            uploadedBy: uploader ? `${uploader.firstName} ${uploader.lastName}` : 'System',
            photos: items.map(photo => ({
                id: photo.id,
                title: photo.title,
                description: photo.description,
                imageUrl: photo.imageUrl,
                orderIndex: photo.orderIndex,
                isFeatured: photo.isFeatured,
                createdAt: photo.createdAt
            }))
        };

        console.log(`✅ Photo album fetched: ${album.title} (${items.length} photos)`);
        res.json({
            success: true,
            album: albumData
        });

    } catch (error) {
        console.error('❌ Error fetching photo album:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch photo album'
        });
    }
});

// Create new photo album
router.post('/gallery/photo-albums', async (req, res) => {
    try {
        console.log('📝 Creating new photo album...');
        console.log('📦 Request body:', req.body);
        
        const { title, description, coverImage, imageUrl, category, tags, isFeatured } = req.body;
        
        // Support both coverImage and imageUrl for backwards compatibility
        const thumbnailUrl = imageUrl || coverImage || '';
        
        console.log('🖼️ Thumbnail URL to save:', thumbnailUrl);

        if (!title) {
            return res.status(400).json({
                success: false,
                error: 'Album title is required'
            });
        }

        // Create album in database
        const albumData = {
            title,
            description: description || '',
            imageUrl: thumbnailUrl,
            category: category || 'general',
            itemType: 'photoAlbum',
            tags: tags || '',
            isFeatured: isFeatured || false,
            isActive: true,
            orderIndex: 0,
            uploadedBy: null // System created
        };
        
        console.log('💾 Creating album with data:', albumData);
        
        const newAlbum = await db.gallery.create(albumData);

        console.log(`✅ Photo album created: ${newAlbum.title}`);
        console.log('✅ Album imageUrl in DB:', newAlbum.imageUrl);
        
        res.json({
            success: true,
            message: 'Photo album created successfully',
            album: {
                id: newAlbum.id,
                title: newAlbum.title,
                description: newAlbum.description,
                coverImage: newAlbum.imageUrl,
                imageUrl: newAlbum.imageUrl, // Also return as imageUrl for consistency
                photoCount: 0,
                category: newAlbum.category,
                tags: newAlbum.tags,
                isFeatured: newAlbum.isFeatured,
                createdAt: newAlbum.createdAt,
                updatedAt: newAlbum.updatedAt,
                uploadedBy: 'System'
            }
        });

    } catch (error) {
        console.error('❌ Error creating photo album:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create photo album'
        });
    }
});

// Update photo album
router.put('/gallery/photo-albums/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`📝 Updating photo album: ${id}`);
        
        const { title, description, coverImage, category, tags, isFeatured } = req.body;

        const updatedAlbum = await db.gallery.update(id, {
            ...(title && { title }),
            ...(description !== undefined && { description }),
            ...(coverImage !== undefined && { imageUrl: coverImage }),
            ...(category && { category }),
            ...(tags !== undefined && { tags }),
            ...(isFeatured !== undefined && { isFeatured })
        });

        // Fetch items count and uploader for response
        const items = await db.gallery.findMany({
            where: {
                albumId: id,
                itemType: 'photo',
                isActive: true
            }
        });

        let uploader = null;
        if (updatedAlbum.uploadedBy) {
            uploader = await db.users.findById(updatedAlbum.uploadedBy);
        }

        console.log(`✅ Photo album updated: ${updatedAlbum.title}`);
        res.json({
            success: true,
            message: 'Photo album updated successfully',
            album: {
                id: updatedAlbum.id,
                title: updatedAlbum.title,
                description: updatedAlbum.description,
                coverImage: updatedAlbum.imageUrl,
                photoCount: items.length,
                category: updatedAlbum.category,
                tags: updatedAlbum.tags,
                isFeatured: updatedAlbum.isFeatured,
                createdAt: updatedAlbum.createdAt,
                updatedAt: updatedAlbum.updatedAt,
                uploadedBy: uploader ? `${uploader.firstName} ${uploader.lastName}` : 'System'
            }
        });

    } catch (error) {
        console.error('❌ Error updating photo album:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update photo album'
        });
    }
});

// Delete individual photo
router.delete('/gallery/photos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`🗑️ Deleting photo: ${id}`);
        
        // Get photo details first to get Cloudinary public_id
        const photo = await db.gallery.findUnique({
            where: { id }
        });

        if (!photo) {
            return res.status(404).json({
                success: false,
                error: 'Photo not found'
            });
        }

        // Delete from Cloudinary if imageUrl exists
        if (photo.imageUrl) {
            try {
                const { deleteImage } = require('../config/cloudinary');
                
                // Extract public_id from Cloudinary URL
                // URL format: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/folder/photo_name.jpg
                let publicId = photo.imageUrl;
                
                // Remove the base URL to get the path
                const urlPattern = /\/upload\/(?:v\d+\/)?(.+?)\.(jpg|jpeg|png|gif|webp)$/i;
                const match = photo.imageUrl.match(urlPattern);
                
                if (match && match[1]) {
                    publicId = match[1];
                } else {
                    // Fallback: extract filename from URL
                    const urlParts = photo.imageUrl.split('/');
                    publicId = urlParts[urlParts.length - 1].split('.')[0];
                }
                
                // Use the consistent deleteImage function (defaults to 'image' resource type)
                await deleteImage(publicId);
                
            } catch (cloudinaryError) {
                console.error('❌ Error deleting from Cloudinary:', cloudinaryError);
                
                // Check if it's a "not found" error - if so, it's okay to continue
                if (cloudinaryError.message && cloudinaryError.message.includes('not found')) {
                    console.log(`⚠️ Photo not found in Cloudinary (already deleted or never existed): ${photo.imageUrl}`);
                } else {
                    console.error('❌ Unexpected Cloudinary error:', cloudinaryError.message);
                }
                // Continue with database deletion even if Cloudinary fails
            }
        }

        // Delete from database
        await db.gallery.delete(id);

        console.log(`✅ Photo deleted from database: ${id}`);
        res.json({
            success: true,
            message: 'Photo deleted successfully'
        });

    } catch (error) {
        console.error('❌ Error deleting photo:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete photo'
        });
    }
});

// Delete photo album
router.delete('/gallery/photo-albums/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`🗑️ Deleting photo album: ${id}`);
        
        // Delete album and all its photos (cascade delete)
        await db.gallery.delete(id);

        console.log(`✅ Photo album deleted: ${id}`);
        res.json({
            success: true,
            message: 'Photo album deleted successfully'
        });

    } catch (error) {
        console.error('❌ Error deleting photo album:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete photo album'
        });
    }
});

// ===== FEATURED MOMENTS CONTENT =====
router.get('/featured-moments', async (req, res) => {
    try {
        console.log('📥 Fetching featured moments content from database...');
        
        // Fetch featured moments from database
        const featuredMomentsData = await db.gallery.findMany({
            where: {
                itemType: 'featured_moment',
                isActive: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Limit to 6 most recent featured moments
        const limitedMoments = featuredMomentsData.slice(0, 6);

        // Manually fetch album for each moment if albumId exists
        const momentsWithAlbums = await Promise.all(limitedMoments.map(async (moment) => {
            let album = null;
            if (moment.albumId) {
                album = await db.gallery.findUnique({
                    where: { id: moment.albumId }
                });
            }
            return { ...moment, album };
        }));

        console.log(`✅ Found ${momentsWithAlbums.length} featured moments from database`);
        console.log('📋 Featured moments raw data:', momentsWithAlbums.map(m => ({
            id: m.id,
            title: m.title,
            category: m.category,
            tags: m.tags,
            albumId: m.albumId,
            album: m.album ? { id: m.album.id, title: m.album.title } : null
        })));

        // Transform to featured moments format
        const featuredMoments = momentsWithAlbums.map(moment => ({
            id: moment.id,
            title: moment.title,
            description: moment.description || '',
            date: moment.createdAt,
            image: moment.imageUrl || '/images/placeholder.jpg',
            icon: moment.icon || 'calendar',
            category: moment.category || 'general',
            tags: moment.tags || [],
            year: new Date(moment.createdAt).getFullYear(),
            albumId: moment.albumId // Include album ID for navigation
        }));

        console.log('✅ Featured moments content fetched successfully');
        res.json({ success: true, content: featuredMoments });
    } catch (error) {
        console.error('❌ Error fetching featured moments content:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch featured moments content' });
    }
});

// Create featured moment
router.post('/gallery/featured-moments', async (req, res) => {
    try {
        console.log('⭐ Creating featured moment...');
        const featuredMomentData = req.body;
        
        console.log('📋 Featured moment data:', featuredMomentData);

        // Create featured moment in database
        const featuredMoment = await db.gallery.create(featuredMomentData);

        console.log('✅ Featured moment created successfully:', featuredMoment.id);
        res.json({
            success: true,
            message: 'Featured moment created successfully',
            featuredMoment: featuredMoment
        });

    } catch (error) {
        console.error('❌ Error creating featured moment:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create featured moment'
        });
    }
});

// Get featured moments from database
router.get('/gallery/featured-moments', async (req, res) => {
    try {
        console.log('📥 Fetching featured moments from database...');
        
        const featuredMomentsData = await db.gallery.findMany({
            where: {
                itemType: 'featured_moment',
                isActive: true
            },
            orderBy: {
                orderIndex: 'asc'
            }
        });

        // Manually fetch album and uploader for each moment
        const featuredMoments = await Promise.all(featuredMomentsData.map(async (moment) => {
            let album = null;
            let uploader = null;
            
            if (moment.albumId) {
                album = await db.gallery.findUnique({
                    where: { id: moment.albumId }
                });
            }
            
            if (moment.uploadedBy) {
                uploader = await db.users.findById(moment.uploadedBy);
            }
            
            return { ...moment, album, uploader };
        }));

        console.log(`✅ Found ${featuredMoments.length} featured moments`);
        res.json({
            success: true,
            featuredMoments: featuredMoments
        });

    } catch (error) {
        console.error('❌ Error fetching featured moments:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch featured moments'
        });
    }
});

// Delete featured moment
router.delete('/gallery/featured-moments/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`🗑️ Deleting featured moment: ${id}`);
        
        // Delete featured moment from database
        const deleted = await db.gallery.delete(id);
        
        if (!deleted) {
            return res.status(404).json({
                success: false,
                error: 'Featured moment not found'
            });
        }
        
        console.log(`✅ Featured moment deleted: ${id}`);
        res.json({
            success: true,
            message: 'Featured moment deleted successfully',
            deletedId: id
        });
        
    } catch (error) {
        console.error('❌ Error deleting featured moment:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete featured moment'
        });
    }
});

router.get('/albums', async (req, res) => {
    try {
        console.log('📥 Fetching albums content from database...');
        
        // Fetch all photo and video albums from database
        const photoAlbumsData = await db.gallery.findMany({
            where: {
                itemType: 'photoAlbum',
                isActive: true,
                albumId: null // Only get albums, not individual items
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        const videoAlbumsData = await db.gallery.findMany({
            where: {
                itemType: 'videoAlbum',
                isActive: true,
                albumId: null // Only get albums, not individual items
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Combine photo and video albums
        const albums = [...photoAlbumsData, ...videoAlbumsData]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        console.log(`✅ Found ${albums.length} albums from database`);

        // Transform to albums format with item count
        const albumsData = await Promise.all(albums.map(async (album) => {
            // Count child items in this album (photos or videos), excluding featured items
            const itemCount = await db.gallery.count({
                where: {
                    albumId: album.id,
                    isFeatured: false // Exclude featured moments from count
                }
            });

            return {
                id: album.id,
                title: album.title,
                category: album.category || 'general',
                image: album.imageUrl || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop&auto=format',
                count: itemCount,
                date: album.createdAt,
                type: album.itemType
            };
        }));

        console.log('✅ Albums content fetched successfully');
        res.json({ success: true, content: albumsData });
    } catch (error) {
        console.error('❌ Error fetching albums content:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch albums content' });
    }
});

// ===== EVENTS CONTENT =====
router.get('/events-content', async (req, res) => {
    try {
        const { section } = req.query;
        
        console.log('🔍 API Request - Section:', section);
        console.log('🔍 API Request - Query params:', req.query);
        
        if (section) {
            // Get specific section content
            console.log('🔍 Filtering by section:', section);
            const content = await db.eventsContent.findBySection(section);
            console.log('🔍 Found', content.length, 'records for section:', section);
            res.json({ success: true, data: content });
        } else {
            // Get all events content
            console.log('🔍 No section specified, returning all content');
            const allContent = await db.eventsContent.findAll();
            console.log('🔍 Found', allContent.length, 'total records');
            res.json({ success: true, data: allContent });
        }
    } catch (error) {
        console.error('Error fetching events content:', error);
        res.status(500).json({ error: 'Failed to fetch events content' });
    }
});

// Get single notice/event by ID
router.get('/events-content/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        console.log('🔍 Fetching event/notice with ID:', id);
        
        // Fetch from EventsContent table
        const notice = await db.eventsContent.findById(id);
        
        if (!notice) {
            return res.status(404).json({ 
                success: false,
                error: 'Notice not found' 
            });
        }
        
        // Parse metadata if it exists
        let metadata = {};
        if (notice.metadata) {
            try {
                metadata = typeof notice.metadata === 'string' ? JSON.parse(notice.metadata) : notice.metadata;
            } catch (e) {
                console.error('Error parsing metadata:', e);
            }
        }
        
        // Parse eventSchedule (highlights) if it exists
        let highlights = [];
        if (notice.eventSchedule) {
            try {
                highlights = typeof notice.eventSchedule === 'string' ? JSON.parse(notice.eventSchedule) : notice.eventSchedule;
            } catch (e) {
                console.error('Error parsing eventSchedule:', e);
            }
        }
        
        // Parse PDF files if they exist
        let pdfFiles = null;
        if (notice.pdfFiles) {
            try {
                pdfFiles = typeof notice.pdfFiles === 'string' ? JSON.parse(notice.pdfFiles) : notice.pdfFiles;
            } catch (e) {
                console.error('Error parsing PDF files:', e);
            }
        }
        
        // Prepare response with all fields
        const responseData = {
            ...notice,
            author: notice.organizer || 'Marigold English Boarding School',
            validUntil: metadata.validUntil || null,
            audience: metadata.audience || 'all',
            highlights: highlights,
            pdfFiles: pdfFiles
        };
        
        console.log('✅ Notice found:', responseData.title);
        
        res.json({ 
            success: true,
            data: responseData 
        });
        
    } catch (error) {
        console.error('Error fetching event/notice by ID:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to fetch event/notice',
            message: error.message 
        });
    }
});

router.post('/events-content', authenticateToken, requireRole(['ADMIN']), async (req, res) => {
    try {
        const { section, data } = req.body;
        console.log('🚀 POST /events-content route called');
        console.log('🔍 Request body section:', section);
        console.log('🔍 Request body data:', data);
        console.log('🔍 Data type:', typeof data);
        
        // For highlights, we use upsert so no need to delete existing content
        if (section === 'highlights') {
            console.log('🔍 Skipping destroy for highlights section, using upsert instead');
        } else {
            // Delete existing content for other sections
            console.log('🔍 Deleting existing content for section:', section);
        await db.eventsContent.destroy({ section });
        }
        
        // Insert new content
        const contentToInsert = [];
        
        if (section === 'featured_hero') {
            console.log('📝 Processing featured_hero data:', data);
            
            if (data.title) {
                console.log('📝 Adding title:', data.title);
                contentToInsert.push({
                    section,
                    key: 'title',
                    title: data.title.title,
                    content: data.title.content,
                    isActive: true,
                    orderIndex: 1
                });
            }
            if (data.button) {
                console.log('📝 Adding button:', data.button);
                contentToInsert.push({
                    section,
                    key: 'button',
                    title: data.button.title,
                    isActive: true,
                    orderIndex: 2
                });
            }
            if (data.background_image) {
                console.log('📝 Adding background_image:', data.background_image);
                contentToInsert.push({
                    section,
                    key: 'background_image',
                    content: data.background_image.content,
                    isActive: true,
                    orderIndex: 3
                });
            }
        } else if (section === 'upcoming_events' || section === 'past_events') {
            Object.values(data).forEach((event, index) => {
                if (event.title) {
                    contentToInsert.push({
                        section,
                        key: event.title.toLowerCase().replace(/\s+/g, '_'),
                        title: event.title,
                        content: event.content,
                        category: event.category,
                        eventDate: event.eventDate ? new Date(event.eventDate) : null,
                        imageUrl: event.imageUrl,
                        isActive: true,
                        orderIndex: index + 1
                    });
                }
            });
        } else if (section === 'notices') {
            Object.values(data).forEach((notice, index) => {
                if (notice.title) {
                    contentToInsert.push({
                        section,
                        key: notice.title.toLowerCase().replace(/\s+/g, '_'),
                        title: notice.title,
                        content: notice.content,
                        icon: notice.icon,
                        isActive: true,
                        orderIndex: index + 1
                    });
                }
            });
        } else if (section === 'highlights') {
            // Handle highlights section - data is a single highlight object
            const startTime = Date.now();
            console.log('🔍 Processing highlights section with data:', data);
            console.log('🔍 Data type:', typeof data);
            console.log('🔍 Data keys:', Object.keys(data || {}));
            console.log('🔍 ImageUrl in data:', data?.imageUrl);
            console.log('🔍 ImageUrl type:', typeof data?.imageUrl);
            
            if (data && data.title) {
                const highlightData = {
                    title: data.title,
                    content: data.content,
                    description: data.description,
                    imageUrl: data.imageUrl,
                    metadata: data.metadata,
                    isActive: true,
                    orderIndex: 1
                };
                console.log('🔍 Highlight data to upsert:', highlightData);
                console.log('🔍 ImageUrl in highlightData:', highlightData.imageUrl);
                
                // Use upsert for highlights to handle existing records
                console.log('⏱️ Starting upsert operation...');
                const upsertStartTime = Date.now();
                
                const result = await db.eventsContent.upsertBySectionAndKey(
                    section, 
                    data.key || 'main_highlight', 
                    highlightData
                );
                
                const upsertEndTime = Date.now();
                const totalTime = Date.now() - startTime;
                
                console.log('⏱️ Upsert operation completed in:', upsertEndTime - upsertStartTime, 'ms');
                console.log('⏱️ Total highlights processing time:', totalTime, 'ms');
                console.log('✅ Highlights upserted successfully:', result);
                
                // Send response to client
                res.json({ 
                    success: true, 
                    message: 'Highlights saved successfully',
                    data: result
                });
                return;
            } else {
                console.log('⚠️ No title found in highlights data:', data);
                throw new Error('No title found in highlights data');
            }
        }
        
        console.log('📦 Content to insert:', contentToInsert);
        
        if (contentToInsert.length > 0) {
            console.log('💾 Inserting content into database...');
            console.log('🔍 Content to insert:', JSON.stringify(contentToInsert, null, 2));
            try {
                const result = await db.eventsContent.bulkCreate(contentToInsert);
                console.log('✅ Content inserted successfully:', result);
            } catch (dbError) {
                console.error('❌ Database insert error:', dbError);
                console.error('❌ Error details:', dbError.message);
                console.error('❌ Error stack:', dbError.stack);
                throw dbError;
            }
        } else {
            console.log('⚠️ No content to insert');
        }
        
        res.json({ success: true, message: 'Events content saved successfully' });
    } catch (error) {
        console.error('❌ Error saving events content:', error);
        console.error('❌ Error message:', error.message);
        console.error('❌ Error stack:', error.stack);
        res.status(500).json({ error: 'Failed to save events content' });
    }
});

// Bulk update events content - MUST come before /:id route
router.put('/events-content/bulk', authenticateToken, requireRole(['admin']), async (req, res) => {
    try {
        console.log('📝 Bulk updating events content...');
        const { content } = req.body;

        if (!content || typeof content !== 'object') {
            return res.status(400).json({
                success: false,
                error: 'Invalid content format'
            });
        }

        const updates = [];

        // Process featured_hero section
        if (content.featured_hero) {
            const { title, description, buttonText, imageUrl, enabled, pastEventId } = content.featured_hero;
            console.log('🔍 Backend received featured_hero data:', { title, description, buttonText, imageUrl, enabled, pastEventId });
            
            // Title
            updates.push(
                db.eventsContent.upsertBySectionAndKey('featured_hero', 'title', {
                    title: title || 'Featured Event',
                    isActive: enabled !== false
                })
            );

            // Description
            updates.push(
                db.eventsContent.upsertBySectionAndKey('featured_hero', 'description', {
                    content: description || '',
                    isActive: enabled !== false
                })
            );

            // Button Text
            updates.push(
                db.eventsContent.upsertBySectionAndKey('featured_hero', 'button_text', {
                    content: buttonText || 'Learn More',
                    isActive: enabled !== false
                })
            );

            // Image
            if (imageUrl) {
                updates.push(
                    db.eventsContent.upsertBySectionAndKey('featured_hero', 'image', {
                        imageUrl: imageUrl,
                        isActive: enabled !== false
                    })
                );
            }

            // Past Event ID (reference to past event)
            if (pastEventId) {
                console.log('💾 Storing past event ID:', pastEventId);
                updates.push(
                    db.eventsContent.upsertBySectionAndKey('featured_hero', 'past_event_id', {
                        content: pastEventId,
                        isActive: enabled !== false
                    })
                );
            } else {
                console.log('ℹ️ No past event ID provided');
            }

            // Section enabled
            updates.push(
                db.eventsContent.upsertBySectionAndKey('featured_hero', 'section_enabled', {
                    isActive: enabled !== false
                })
            );
        }

        // Execute all updates
        await Promise.all(updates);

        console.log('✅ Events content bulk updated successfully');
        res.json({
            success: true,
            message: 'Events content updated successfully'
        });

    } catch (error) {
        console.error('❌ Error bulk updating events content:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update events content',
            message: error.message
        });
    }
});

// Toggle events content section visibility
router.put('/events-content/toggle/:section', authenticateToken, requireRole(['ADMIN']), async (req, res) => {
    try {
        const { section } = req.params;
        const { enabled } = req.body;
        
        // Update all content items in the section
        await db.eventsContent.updateMany(
            { section },
            { isActive: enabled }
        );
        
        const action = enabled ? 'enabled' : 'disabled';
        res.json({ 
            success: true, 
            message: `${section} section ${action} successfully` 
        });
    } catch (error) {
        console.error('Error toggling events content section:', error);
        res.status(500).json({ error: 'Failed to toggle section' });
    }
});

router.put('/events-content/:id', authenticateToken, requireRole(['ADMIN']), async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        
        console.log('📝 Updating events content with ID:', id);
        console.log('📝 Update data:', updateData);
        console.log('📝 PDF files in request:', updateData.pdfFiles);
        
                // Handle PDF files - store them in dedicated pdfFiles column
                if (updateData.pdfFiles && Array.isArray(updateData.pdfFiles)) {
                    console.log('📄 Processing PDF files:', updateData.pdfFiles);
                    
                    // Store PDF files in dedicated column
                    updateData.pdfFiles = JSON.stringify(updateData.pdfFiles);
                    
                    console.log('📄 PDF files stored in dedicated column:', updateData.pdfFiles);
                }
        
        console.log('📝 Final update data being sent to database:', updateData);
        
        // Update the record using MySQL database method
        const updatedRecord = await db.eventsContent.update(id, updateData);
        
        console.log('✅ Events content updated successfully:', updatedRecord.id);
        
        res.json({ 
            success: true, 
            message: 'Events content updated successfully',
            event: updatedRecord
        });
    } catch (error) {
        console.error('❌ Error updating events content:', error);
        console.error('❌ Update data:', req.body);
        console.error('❌ Event ID:', req.params.id);
        res.status(500).json({ 
            error: 'Failed to update events content',
            details: error.message 
        });
    }
});

router.delete('/events-content/:id', authenticateToken, requireRole(['ADMIN']), async (req, res) => {
    try {
        const { id } = req.params;
        
        await db.eventsContent.delete(id);
        
        res.json({ success: true, message: 'Events content deleted successfully' });
    } catch (error) {
        console.error('Error deleting events content:', error);
        res.status(500).json({ error: 'Failed to delete events content' });
    }
});

// Upload photos to album
router.post('/gallery/album/:albumId/photos', async (req, res) => {
    try {
        const { albumId } = req.params;
        const { photos } = req.body; // Array of photo data with imageUrl, title, description

        console.log(`📸 Uploading ${photos.length} photos to album: ${albumId}`);

        if (!photos || !Array.isArray(photos) || photos.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'No photos provided'
            });
        }

        // Verify album exists
        const album = await db.gallery.findFirst({
            where: {
                id: albumId,
                itemType: 'photoAlbum',
                isActive: true
            }
        });

        if (!album) {
            return res.status(404).json({
                success: false,
                error: 'Album not found'
            });
        }

        // Create photo records
        const photoPromises = photos.map((photo, index) => {
            return db.gallery.create({
                title: photo.title || `Photo ${index + 1}`,
                description: photo.description || '',
                imageUrl: photo.imageUrl,
                itemType: 'photo',
                category: album.category, // Inherit album category
                albumId: albumId,
                orderIndex: index,
                tags: photo.tags || '',
                isFeatured: false,
                isActive: true,
                uploadedBy: null // System uploaded
            });
        });

        const uploadedPhotos = await Promise.all(photoPromises);

        console.log(`✅ Uploaded ${uploadedPhotos.length} photos to album: ${album.title}`);

        res.json({
            success: true,
            message: `${uploadedPhotos.length} photos uploaded successfully`,
            photos: uploadedPhotos.map(photo => ({
                id: photo.id,
                title: photo.title,
                description: photo.description,
                imageUrl: photo.imageUrl,
                orderIndex: photo.orderIndex
            }))
        });

    } catch (error) {
        console.error('❌ Error uploading photos:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to upload photos'
        });
    }
});

// ===== VIDEO ALBUMS SECTION =====

// Get Video Albums
router.get('/gallery/video-albums', async (req, res) => {
    try {
        console.log('📥 Fetching video albums...');
        
        // Set cache headers to prevent caching
        res.set({
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        });
        
        // Fetch video albums from unified Gallery table
        const videoAlbums = await db.gallery.findMany({
            where: {
                itemType: 'videoAlbum',
                isActive: true
            },
            orderBy: { orderIndex: 'asc' }
        });

        // Manually fetch items for each album
        const albumsData = await Promise.all(videoAlbums.map(async (album) => {
            // Fetch items for this album
            const items = await db.gallery.findMany({
                where: {
                    albumId: album.id,
                    itemType: 'video',
                    isActive: true
                },
                orderBy: { orderIndex: 'asc' }
            });

            // Count only non-featured items
            const regularVideos = items.filter(item => !item.isFeatured);
            
            return {
                ...album,
                items: items, // Keep all items for detail view
                videoCount: regularVideos.length, // Count excluding featured
                itemCount: regularVideos.length, // For compatibility
                totalItems: items.length, // Total including featured
                featuredItems: items.length - regularVideos.length
            };
        }));

        console.log(`✅ Found ${videoAlbums.length} video albums`);
        
        res.json({
            success: true,
            albums: albumsData 
        });

    } catch (error) {
        console.error('❌ Error fetching video albums:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch video albums' 
        });
    }
});


// Update video album (DUPLICATE - should be removed or merged with photo album update above)
router.put('/gallery/video-album/:albumId', async (req, res) => {
    try {
        const { albumId } = req.params;
        const updateData = req.body;
        
        console.log(`💾 Updating video album: ${albumId}`, updateData);
        
        // Prepare update data
        const albumUpdateData = {
            title: updateData.title,
            description: updateData.description,
            category: updateData.category || 'general'
        };
        
        // Only update imageUrl if it's provided
        if (updateData.imageUrl !== undefined) {
            albumUpdateData.imageUrl = updateData.imageUrl;
            console.log('🖼️ Updating imageUrl to:', updateData.imageUrl);
        }
        
        console.log('💾 Update data being sent to DB:', albumUpdateData);
        
        // Update the album
        const updatedAlbum = await db.gallery.update(albumId, albumUpdateData);

        console.log(`✅ Video album updated successfully: ${updatedAlbum.title}`);
        console.log('✅ Album imageUrl in DB:', updatedAlbum.imageUrl);
        
        res.json({
            success: true,
            album: updatedAlbum
        });

    } catch (error) {
        console.error('❌ Error updating album:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update album'
        });
    }
});

// Get videos for a specific album
router.get('/gallery/album/:albumId/videos', async (req, res) => {
    try {
        const { albumId } = req.params;
        
        console.log(`📥 Fetching videos for album: ${albumId}`);
        
        // Set cache headers to prevent caching
        res.set({
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        });
        
        // Verify album exists
        const album = await db.gallery.findFirst({
            where: {
                id: albumId,
                itemType: 'videoAlbum',
                isActive: true
            }
        });

        if (!album) {
            return res.status(404).json({
                success: false,
                error: 'Album not found'
            });
        }

        // Fetch videos in this album
        const videos = await db.gallery.findMany({
            where: {
                albumId: albumId,
                itemType: 'video',
                isActive: true
            },
            orderBy: { orderIndex: 'asc' }
        });

        console.log(`✅ Found ${videos.length} videos for album: ${album.title}`);

        res.json({
            success: true,
            album: {
                id: album.id,
                title: album.title,
                description: album.description,
                category: album.category
            },
            videos: videos
        });

    } catch (error) {
        console.error('❌ Error fetching videos:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch videos'
        });
    }
});

// Create new video album
router.post('/gallery/video-albums', async (req, res) => {
    try {
        console.log('📝 Creating new video album...');
        
        const albumData = req.body;
        
        console.log('📋 Album data:', albumData);

        // Create new album
        const newAlbum = await db.gallery.create({
            title: albumData.title,
            description: albumData.description || '',
            imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1234567890/video-album-default.jpg',
            itemType: 'videoAlbum',
            category: albumData.category || 'general',
            orderIndex: 0,
            isActive: true,
            tags: '',
            isFeatured: false
        });

        console.log(`✅ Video album created: ${newAlbum.title}`);

        res.json({
            success: true,
            message: 'Video album created successfully',
            album: newAlbum
        });

    } catch (error) {
        console.error('❌ Error creating video album:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create video album'
        });
    }
});

// Delete individual video
router.delete('/gallery/videos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`🗑️ Deleting video: ${id}`);
        
        // Get video details first to get Cloudinary public_id
        const video = await db.gallery.findUnique({
            where: { id }
        });

        if (!video) {
            return res.status(404).json({
                success: false,
                error: 'Video not found'
            });
        }

        console.log(`🔍 Video details:`, {
            id: video.id,
            title: video.title,
            videoUrl: video.videoUrl,
            imageUrl: video.imageUrl
        });

        // Delete from Cloudinary if videoUrl exists
        if (video.videoUrl) {
            console.log(`🗑️ Video has videoUrl, proceeding with Cloudinary deletion: ${video.videoUrl}`);
            try {
                const { deleteImage } = require('../config/cloudinary');
                
                // Extract public_id from Cloudinary URL
                // URL format: https://res.cloudinary.com/cloud_name/video/upload/v1234567890/folder/video_name.mp4
                let publicId = video.videoUrl;
                
                // Remove the base URL to get the path
                const urlPattern = /\/upload\/(?:v\d+\/)?(.+?)\.(mp4|mov|avi|webm|mkv)$/i;
                const match = video.videoUrl.match(urlPattern);
                
                if (match && match[1]) {
                    publicId = match[1];
                } else {
                    // Fallback: extract filename from URL
                    const urlParts = video.videoUrl.split('/');
                    publicId = urlParts[urlParts.length - 1].split('.')[0];
                }
                
                console.log(`🗑️ Attempting to delete video from Cloudinary with publicId: ${publicId}`);
                // Use the consistent deleteImage function with video resource type
                const deleteResult = await deleteImage(publicId, 'video');
                console.log(`✅ Cloudinary deletion result:`, deleteResult);
                
            } catch (cloudinaryError) {
                console.error('❌ Error deleting from Cloudinary:', cloudinaryError);
                
                // Check if it's a "not found" error - if so, it's okay to continue
                if (cloudinaryError.message && cloudinaryError.message.includes('not found')) {
                    console.log(`⚠️ Video not found in Cloudinary (already deleted or never existed): ${video.videoUrl}`);
                } else {
                    console.error('❌ Unexpected Cloudinary error:', cloudinaryError.message);
                }
                // Continue with database deletion even if Cloudinary fails
            }
        } else {
            console.log(`⚠️ Video does not have videoUrl, skipping Cloudinary deletion`);
        }

        // Delete from database
        await db.gallery.delete(id);

        console.log(`✅ Video deleted from database: ${id}`);
        res.json({
            success: true,
            message: 'Video deleted successfully'
        });

    } catch (error) {
        console.error('❌ Error deleting video:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete video'
        });
    }
});

// Delete video album
router.delete('/gallery/video-albums/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`🗑️ Deleting video album: ${id}`);
        
        // Delete album and all its videos (cascade delete)
        await db.gallery.delete(id);

        console.log(`✅ Video album deleted: ${id}`);
        res.json({
            success: true,
            message: 'Video album deleted successfully'
        });

    } catch (error) {
        console.error('❌ Error deleting video album:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete video album'
        });
    }
});

// Upload videos to album
router.post('/gallery/album/:albumId/videos', async (req, res) => {
    try {
        const { albumId } = req.params;
        const { videos } = req.body; // Array of video data with videoUrl, title, description

        console.log(`📹 Uploading ${videos.length} videos to album: ${albumId}`);

        if (!videos || !Array.isArray(videos) || videos.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'No videos provided'
            });
        }

        // Verify album exists
        const album = await db.gallery.findFirst({
            where: {
                id: albumId,
                itemType: 'videoAlbum',
                isActive: true
            }
        });

        if (!album) {
            return res.status(404).json({
                success: false,
                error: 'Album not found'
            });
        }

        // Create video records
        console.log(`📥 Processing ${videos.length} videos for upload...`);
        const videoPromises = videos.map(async (video, index) => {
            console.log(`🎬 Processing video ${index + 1}/${videos.length}: ${video.title || 'Untitled'}`);
            console.log(`📹 Video URL: ${video.videoUrl}`);
            console.log(`🖼️ Existing thumbnail URL: ${video.thumbnailUrl || 'None'}`);
            
            let thumbnailUrl = video.thumbnailUrl;
            
            // Generate thumbnail if not provided or if it's a Cloudinary video
            if (!thumbnailUrl && video.videoUrl && video.videoUrl.includes('cloudinary.com')) {
                try {
                    console.log(`🎬 Generating thumbnail for video: ${video.title || `Video ${index + 1}`}`);
                    thumbnailUrl = await generateDisplayThumbnail(video.videoUrl);
                    console.log(`✅ Generated thumbnail: ${thumbnailUrl}`);
                } catch (error) {
                    console.error(`❌ Failed to generate thumbnail for video ${index + 1}:`, error);
                    console.error(`❌ Error details:`, error.message);
                    console.error(`❌ Error stack:`, error.stack);
                    // Use fallback thumbnail
                    thumbnailUrl = 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&h=300&fit=crop&auto=format';
                    console.log(`🔄 Using fallback thumbnail: ${thumbnailUrl}`);
                }
            } else if (!thumbnailUrl) {
                // Use fallback thumbnail for non-Cloudinary videos
                thumbnailUrl = 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&h=300&fit=crop&auto=format';
                console.log(`🔄 Using fallback thumbnail for non-Cloudinary video: ${thumbnailUrl}`);
            } else {
                console.log(`✅ Using provided thumbnail: ${thumbnailUrl}`);
            }

            const createdVideo = await db.gallery.create({
                title: video.title || `Video ${index + 1}`,
                description: video.description || '',
                imageUrl: thumbnailUrl,
                videoUrl: video.videoUrl,
                itemType: 'video',
                category: album.category, // Inherit album category
                albumId: albumId,
                orderIndex: index,
                tags: video.tags || '',
                isFeatured: false,
                isActive: true,
                uploadedBy: null // System uploaded
            });
            
            console.log(`✅ Video created in database: ${createdVideo.title}`);
            console.log(`🖼️ Thumbnail saved: ${createdVideo.imageUrl}`);
            console.log(`📹 Video URL saved: ${createdVideo.videoUrl}`);
            
            return createdVideo;
        });

        const uploadedVideos = await Promise.all(videoPromises);

        console.log(`✅ Uploaded ${uploadedVideos.length} videos to album: ${album.title}`);

        res.json({
            success: true,
            message: `${uploadedVideos.length} videos uploaded successfully`,
            videos: uploadedVideos.map(video => ({
                id: video.id,
                title: video.title,
                description: video.description,
                videoUrl: video.videoUrl,
                imageUrl: video.imageUrl,
                orderIndex: video.orderIndex
            }))
        });

    } catch (error) {
        console.error('❌ Error uploading videos:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to upload videos'
        });
    }
});


// Test route to verify thumbnail generation (no auth required for testing)
router.get('/gallery/test-thumbnail/:videoId', async (req, res) => {
    try {
        const { videoId } = req.params;
        
        // Get the video from database
        const video = await db.gallery.findUnique({
            where: { id: videoId }
        });

        if (!video || video.itemType !== 'video') {
            return res.status(404).json({
                success: false,
                error: 'Video not found'
            });
        }

        if (!video.videoUrl || !video.videoUrl.includes('cloudinary.com')) {
            return res.status(400).json({
                success: false,
                error: 'Not a Cloudinary video'
            });
        }

        // Generate thumbnail
        const thumbnailUrl = await generateDisplayThumbnail(video.videoUrl);

        res.json({
            success: true,
            video: {
                id: video.id,
                title: video.title,
                videoUrl: video.videoUrl,
                currentThumbnail: video.imageUrl
            },
            generatedThumbnail: thumbnailUrl
        });

    } catch (error) {
        console.error('❌ Test thumbnail generation error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get individual video details
router.get('/gallery/videos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`📹 Fetching video details: ${id}`);
        
        const video = await db.gallery.findUnique({
            where: { id }
        });

        if (!video) {
            return res.status(404).json({
                success: false,
                error: 'Video not found'
            });
        }

        res.json({
            success: true,
            video: video
        });
    } catch (error) {
        console.error('❌ Error fetching video:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch video details'
        });
    }
});

// Update individual video
router.put('/gallery/videos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title } = req.body;
        
        console.log(`✏️ Updating video title: ${id}`);
        console.log('Update data:', { title });

        // Validate required fields
        if (!title || title.trim() === '') {
            return res.status(400).json({
                success: false,
                error: 'Title is required'
            });
        }

        // Check if video exists
        const existingVideo = await db.gallery.findUnique({
            where: { id }
        });

        if (!existingVideo) {
            return res.status(404).json({
                success: false,
                error: 'Video not found'
            });
        }

        // Update video title only
        const updatedVideo = await db.gallery.update(id, {
            title: title.trim()
        });

        console.log(`✅ Video title updated successfully: ${id}`);

        res.json({
            success: true,
            message: 'Video title updated successfully',
            video: updatedVideo
        });
    } catch (error) {
        console.error('❌ Error updating video title:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update video title'
        });
    }
});

// ===== ALUMNI MANAGEMENT ROUTES =====

// Get all alumni with pagination, search, and filtering
router.get('/alumni', async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 20, 
            search = '', 
            filter = 'all',  // all, recent, top-achievers
            sortBy = 'batchYear',
            sortOrder = 'desc'
        } = req.query;

        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        // Build where clause based on search and filter
        let where = {};
        
        // Apply search filter
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { batchYear: { contains: search, mode: 'insensitive' } },
                { profession: { contains: search, mode: 'insensitive' } },
                { university: { contains: search, mode: 'insensitive' } }
            ];
        }
        
        // Apply category filter
        if (filter === 'recent') {
            const currentYear = new Date().getFullYear();
            const fiveYearsAgo = currentYear - 5;
            where.batchYear = { gte: fiveYearsAgo.toString() };
        } else if (filter === 'top-achievers') {
            where.isTopAchiever = true;
        }
        
        // Get total count for pagination
        const total = await db.alumni.count({ where });
        
        // Get alumni with pagination
        const alumni = await db.alumni.findMany({
            where,
            skip,
            take: parseInt(limit),
            orderBy: {
                [sortBy]: sortOrder
            }
        });
        
        res.json({
            success: true,
            alumni,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        console.error('❌ Error fetching alumni:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch alumni'
        });
    }
});

// Get single alumni by ID
router.get('/alumni/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const alumni = await db.alumni.findUnique({
            where: { id }
        });
        
        if (!alumni) {
            return res.status(404).json({
                success: false,
                error: 'Alumni not found'
            });
        }
        
        res.json({
            success: true,
            alumni
        });
    } catch (error) {
        console.error('❌ Error fetching alumni:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch alumni'
        });
    }
});

// Create new alumni
router.post('/alumni', authenticateToken, requireRole(['ADMIN', 'SUPER_ADMIN']), async (req, res) => {
    try {
        const { 
            name, 
            batchYear, 
            profession, 
            university, 
            quote, 
            testimonial,
            photoUrl,
            isFeatured = false,
            isTopAchiever = false,
            orderIndex = 0,
            isActive = true
        } = req.body;
        
        // Validate required fields
        if (!name || !batchYear || !profession) {
            return res.status(400).json({
                success: false,
                error: 'Name, batch year, and profession are required'
            });
        }
        
        // Create alumni
        const alumni = await db.alumni.create({
            name: name.trim(),
            batchYear: batchYear.trim(),
            profession: profession.trim(),
            university: university?.trim() || null,
            quote: quote?.trim() || null,
            testimonial: testimonial?.trim() || null,
            photoUrl: photoUrl || null,
            isFeatured,
            isTopAchiever,
            orderIndex: parseInt(orderIndex),
            isActive
        });
        
        console.log(`✅ Alumni created successfully: ${alumni.id}`);
        
        res.status(201).json({
            success: true,
            message: 'Alumni created successfully',
            alumni
        });
    } catch (error) {
        console.error('❌ Error creating alumni:', error);
        console.error('Error details:', error.message);
        console.error('Error stack:', error.stack);
        res.status(500).json({
            success: false,
            error: 'Failed to create alumni',
            message: error.message
        });
    }
});

// Update alumni
router.put('/alumni/:id', authenticateToken, requireRole(['ADMIN', 'SUPER_ADMIN']), async (req, res) => {
    try {
        const { id } = req.params;
        const { 
            name, 
            batchYear, 
            profession, 
            university, 
            quote, 
            testimonial,
            photoUrl,
            isFeatured,
            isTopAchiever,
            orderIndex,
            isActive
        } = req.body;
        
        // Check if alumni exists
        const existingAlumni = await db.alumni.findUnique({
            where: { id }
        });
        
        if (!existingAlumni) {
            return res.status(404).json({
                success: false,
                error: 'Alumni not found'
            });
        }
        
        // Build update data
        const updateData = {};
        if (name !== undefined) updateData.name = name.trim();
        if (batchYear !== undefined) updateData.batchYear = batchYear.trim();
        if (profession !== undefined) updateData.profession = profession.trim();
        if (university !== undefined) updateData.university = university?.trim() || null;
        if (quote !== undefined) updateData.quote = quote?.trim() || null;
        if (testimonial !== undefined) updateData.testimonial = testimonial?.trim() || null;
        if (photoUrl !== undefined) updateData.photoUrl = photoUrl || null;
        if (isFeatured !== undefined) updateData.isFeatured = isFeatured;
        if (isTopAchiever !== undefined) updateData.isTopAchiever = isTopAchiever;
        if (orderIndex !== undefined) updateData.orderIndex = parseInt(orderIndex);
        if (isActive !== undefined) updateData.isActive = isActive;
        
        // Update alumni (database.js method expects id and updates directly)
        const alumni = await db.alumni.update(id, updateData);
        
        console.log(`✅ Alumni updated successfully: ${id}`);
        
        res.json({
            success: true,
            message: 'Alumni updated successfully',
            alumni
        });
    } catch (error) {
        console.error('❌ Error updating alumni:', error);
        console.error('Error details:', error.message);
        console.error('Error stack:', error.stack);
        res.status(500).json({
            success: false,
            error: 'Failed to update alumni',
            message: error.message
        });
    }
});

// Delete alumni
router.delete('/alumni/:id', authenticateToken, requireRole(['ADMIN', 'SUPER_ADMIN']), async (req, res) => {
    try {
        const { id } = req.params;
        
        // Check if alumni exists
        const existingAlumni = await db.alumni.findUnique({
            where: { id }
        });
        
        if (!existingAlumni) {
            return res.status(404).json({
                success: false,
                error: 'Alumni not found'
            });
        }
        
        // Delete alumni (database.js method expects id directly)
        await db.alumni.delete(id);
        
        console.log(`✅ Alumni deleted successfully: ${id}`);
        
        res.json({
            success: true,
            message: 'Alumni deleted successfully'
        });
    } catch (error) {
        console.error('❌ Error deleting alumni:', error);
        console.error('Error details:', error.message);
        console.error('Error stack:', error.stack);
        res.status(500).json({
            success: false,
            error: 'Failed to delete alumni',
            message: error.message
        });
    }
});

// Get featured alumni for homepage
router.get('/alumni/featured/homepage', async (req, res) => {
    try {
        console.log('📥 Fetching top achiever alumni for homepage...');
        
        // Fetch ALL alumni with is_top_achiever = 1 (no limit)
        const alumni = await db.alumni.findMany({
            where: {
                isTopAchiever: true,
                isActive: true
            },
            orderBy: {
                orderIndex: 'asc',
                createdAt: 'desc'
            }
        });
        
        console.log(`✅ Found ${alumni.length} top achiever alumni`);
        
        res.json({
            success: true,
            alumni
        });
    } catch (error) {
        console.error('❌ Error fetching top achiever alumni:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch top achiever alumni',
            message: error.message
        });
    }
});

// ===== NEB TOPPERS MANAGEMENT =====

// Get all NEB toppers with pagination support
router.get('/neb-toppers', authenticateToken, requireRole(['ADMIN', 'SUPER_ADMIN']), async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            search = '', 
            filter = 'all'  // all, recent, top-achievers
        } = req.query;

        // Use a simpler approach - get all and filter client-side for now
        // This can be optimized later with proper SQL queries
        const allToppers = await db.nebToppers.findMany({
            orderBy: [
                { orderIndex: 'asc' },
                { createdAt: 'desc' }
            ]
        });
        
        // Apply filters client-side
        let filteredToppers = allToppers;
        
        // Apply search filter
        if (search) {
            const searchLower = search.toLowerCase();
            filteredToppers = filteredToppers.filter(topper => 
                topper.name?.toLowerCase().includes(searchLower) ||
                topper.batchYear?.toLowerCase().includes(searchLower) ||
                topper.gpa?.toLowerCase().includes(searchLower) ||
                topper.faculty?.toLowerCase().includes(searchLower) ||
                topper.quote?.toLowerCase().includes(searchLower)
            );
        }
        
        // Apply category filter
        if (filter === 'recent') {
            const currentYear = new Date().getFullYear();
            const threeYearsAgo = currentYear - 3;
            filteredToppers = filteredToppers.filter(topper => {
                const year = parseInt(topper.batchYear);
                return year >= threeYearsAgo;
            });
        } else if (filter === 'top-achievers') {
            filteredToppers = filteredToppers.filter(topper => {
                const gpa = parseFloat(topper.gpa);
                const percentageMatch = topper.gpa?.match(/(\d+)%/);
                return (gpa >= 3.8) || (percentageMatch && parseInt(percentageMatch[1]) >= 90);
            });
        }
        
        // Calculate pagination
        const total = filteredToppers.length;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const limitParam = parseInt(limit);
        const toppers = filteredToppers.slice(skip, skip + limitParam);
        
        res.json({
            success: true,
            toppers,
            pagination: {
                total,
                page: parseInt(page),
                limit: limitParam,
                totalPages: Math.ceil(total / limitParam)
            }
        });
    } catch (error) {
        console.error('❌ Error fetching NEB toppers:', error);
        console.error('Error details:', error.message);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch NEB toppers'
        });
    }
});

// Get single NEB topper
router.get('/neb-toppers/:id', authenticateToken, requireRole(['ADMIN', 'SUPER_ADMIN']), async (req, res) => {
    try {
        const { id } = req.params;
        
        const topper = await db.nebToppers.findUnique({
            where: { id }
        });
        
        if (!topper) {
            return res.status(404).json({
                success: false,
                error: 'NEB topper not found'
            });
        }
        
        res.json({
            success: true,
            topper
        });
    } catch (error) {
        console.error('❌ Error fetching NEB topper:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch NEB topper'
        });
    }
});

// Create new NEB topper
router.post('/neb-toppers', authenticateToken, requireRole(['ADMIN', 'SUPER_ADMIN']), [
    body('name').notEmpty().withMessage('Name is required'),
    body('batchYear').notEmpty().withMessage('Batch year is required'),
    body('gpa').notEmpty().withMessage('GPA is required')
], async (req, res) => {
    try {
        // Validate input
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }
        
        const { name, batchYear, gpa, faculty, quote, photoUrl, orderIndex, isActive } = req.body;
        
        // Create NEB topper
        const topper = await db.nebToppers.create({
            name,
            batchYear,
            gpa,
            faculty: faculty || null,
            quote: quote || null,
            photoUrl: photoUrl || null,
            orderIndex: orderIndex !== undefined ? parseInt(orderIndex) : 0,
            isActive: isActive !== undefined ? isActive : true
        });
        
        console.log(`✅ NEB topper created successfully: ${topper.name}`);
        
        res.status(201).json({
            success: true,
            message: 'NEB topper created successfully',
            topper
        });
    } catch (error) {
        console.error('❌ Error creating NEB topper:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create NEB topper'
        });
    }
});

// Update NEB topper
router.put('/neb-toppers/:id', authenticateToken, requireRole(['ADMIN', 'SUPER_ADMIN']), [
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('batchYear').optional().notEmpty().withMessage('Batch year cannot be empty'),
    body('gpa').optional().notEmpty().withMessage('GPA cannot be empty')
], async (req, res) => {
    try {
        // Validate input
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }
        
        const { id } = req.params;
        const { name, batchYear, gpa, faculty, quote, photoUrl, orderIndex, isActive } = req.body;
        
        // Check if topper exists
        const existingTopper = await db.nebToppers.findUnique({
            where: { id }
        });
        
        if (!existingTopper) {
            return res.status(404).json({
                success: false,
                error: 'NEB topper not found'
            });
        }
        
        // Build update data
        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (batchYear !== undefined) updateData.batchYear = batchYear;
        if (gpa !== undefined) updateData.gpa = gpa;
        if (faculty !== undefined) updateData.faculty = faculty || null;
        if (quote !== undefined) updateData.quote = quote || null;
        if (photoUrl !== undefined) updateData.photoUrl = photoUrl || null;
        if (orderIndex !== undefined) updateData.orderIndex = parseInt(orderIndex);
        if (isActive !== undefined) updateData.isActive = isActive;
        
        // Update topper (database.js method expects id and updates directly)
        const topper = await db.nebToppers.update(id, updateData);
        
        console.log(`✅ NEB topper updated successfully: ${topper.name}`);
        
        res.json({
            success: true,
            message: 'NEB topper updated successfully',
            topper
        });
    } catch (error) {
        console.error('❌ Error updating NEB topper:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update NEB topper'
        });
    }
});

// Delete NEB topper
router.delete('/neb-toppers/:id', authenticateToken, requireRole(['ADMIN', 'SUPER_ADMIN']), async (req, res) => {
    try {
        const { id } = req.params;
        
        // Check if topper exists
        const existingTopper = await db.nebToppers.findUnique({
            where: { id }
        });
        
        if (!existingTopper) {
            return res.status(404).json({
                success: false,
                error: 'NEB topper not found'
            });
        }
        
        // Delete topper
        await db.nebToppers.delete({
            where: { id }
        });
        
        console.log(`✅ NEB topper deleted successfully: ${id}`);
        
        res.json({
            success: true,
            message: 'NEB topper deleted successfully'
        });
    } catch (error) {
        console.error('❌ Error deleting NEB topper:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete NEB topper'
        });
    }
});

// Get featured NEB toppers for homepage
router.get('/neb-toppers/featured/homepage', async (req, res) => {
    try {
        const { limit = 6 } = req.query;
        
        const toppers = await db.nebToppers.findMany({
            where: {
                isActive: true
            },
            take: parseInt(limit),
            orderBy: {
                orderIndex: 'asc'
            }
        });
        
        res.json({
            success: true,
            toppers
        });
    } catch (error) {
        console.error('❌ Error fetching featured NEB toppers:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch featured NEB toppers'
        });
    }
});

// ===== NOTICES/ANNOUNCEMENTS =====

// Get active notices for homepage modal
router.get('/notices/active', async (req, res) => {
    try {
        console.log('📢 Fetching active notices...');
        
        // Set cache headers for 5 minutes
        res.set({
            'Cache-Control': 'public, max-age=300',
            'Expires': new Date(Date.now() + 300000).toUTCString()
        });
        
        // Fetch active popup notices from database
        let notices = [];
        try {
            notices = await db.popupNotices.findActive();
            console.log(`✅ Found ${notices.length} active notices`);
            
            // Transform notices to match expected structure
            notices = notices.map(notice => ({
                id: notice.id,
                title: notice.title || 'Announcement',
                description: notice.description || notice.content || '',
                content: notice.content || notice.description || '',
                imageUrl: notice.imageUrl || null,
                date: notice.createdAt || new Date().toISOString(),
                publishDate: notice.publishDate || notice.createdAt || new Date().toISOString(),
                createdAt: notice.createdAt || new Date().toISOString(),
                category: notice.category || 'general',
                priority: notice.priority || 'normal'
            }));
        } catch (dbError) {
            console.warn('⚠️ Could not fetch from popupNotices table, using empty array:', dbError.message);
            notices = [];
        }
        
        res.json({
            success: true,
            notices
        });
    } catch (error) {
        console.error('❌ Error fetching notices:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch notices'
        });
    }
});

module.exports = router;

