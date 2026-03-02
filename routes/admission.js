const express = require('express');
const router = express.Router();
const { db } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const { sendAdmissionConfirmationEmail, sendAdmissionNotificationEmail } = require('../config/email');

// Submit admission application
router.post('/submit', async (req, res) => {
    try {
        console.log('📝 Admission application submission received:', req.body);
        
        const {
            firstName,
            lastName,
            dateOfBirth,
            gender,
            grade,
            currentSchool,
            parentName,
            parentPhone,
            parentEmail,
            parentOccupation,
            address,
            city,
            state,
            pincode,
            termsAccepted,
            newsletter
        } = req.body;

        // Validate required fields
        const requiredFields = [
            'firstName', 'lastName', 'dateOfBirth', 'gender', 'grade',
            'parentName', 'parentPhone', 'parentEmail', 'address', 'city', 'state', 'pincode'
        ];

        const missingFields = requiredFields.filter(field => !req.body[field]);
        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields',
                missingFields
            });
        }

        // Validate terms acceptance
        if (!termsAccepted) {
            return res.status(400).json({
                success: false,
                message: 'You must accept the terms and conditions to submit the application'
            });
        }

        // Validate gender
        const validGenders = ['male', 'female', 'other'];
        if (!validGenders.includes(gender.toLowerCase())) {
            return res.status(400).json({
                success: false,
                message: 'Invalid gender value'
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(parentEmail)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email format'
            });
        }

        // Validate phone format (basic validation)
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(parentPhone.replace(/\s/g, ''))) {
            return res.status(400).json({
                success: false,
                message: 'Invalid phone number format'
            });
        }

        // Create the application (application number is auto-generated in the database layer)
        const application = await db.admissionApplications.create({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            dateOfBirth: new Date(dateOfBirth),
            gender: gender.toUpperCase(),
            gradeAppliedFor: grade,
            currentSchool: currentSchool?.trim() || null,
            guardianName: parentName.trim(),
            guardianPhone: parentPhone.trim(),
            guardianEmail: parentEmail.trim(),
            guardianOccupation: parentOccupation?.trim() || null,
            addressLine: address.trim(),
            city: city.trim(),
            state: state.trim(),
            postalCode: pincode.trim(),
            newsletterConsent: newsletter === true || newsletter === 'true',
            termsAccepted: true,
            status: 'PENDING'
        });

        console.log('✅ Application created successfully:', application.id);

        // Send confirmation email to applicant (async, don't wait for it)
        sendAdmissionConfirmationEmail(application).catch(err => {
            console.error('⚠️ Failed to send confirmation email to applicant:', err.message);
        });

        // Send notification email to admin (async, don't wait for it)
        sendAdmissionNotificationEmail(application).catch(err => {
            console.error('⚠️ Failed to send notification email to admin:', err.message);
        });

        res.status(201).json({
            success: true,
            message: 'Application submitted successfully',
            application: {
                id: application.id,
                applicationNumber: application.applicationNumber,
                studentName: `${application.firstName} ${application.lastName}`,
                grade: application.gradeAppliedFor,
                status: application.status,
                submittedAt: application.createdAt
            }
        });

    } catch (error) {
        console.error('❌ Error submitting application:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to submit application',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// Get all admission applications (admin only)
router.get('/applications', authenticateToken, async (req, res) => {
    try {
        console.log('📋 Fetching admission applications...');
        
        const applications = await db.admissionApplications.findMany({
            orderBy: { createdAt: 'desc' }
        });

        // Transform data for frontend
        const transformedApplications = applications.map(app => ({
            id: app.id,
            studentName: `${app.firstName} ${app.lastName}`,
            parentName: app.guardianName,
            applicationId: `APP${String(app.applicationNumber).padStart(6, '0')}`,
            grade: app.gradeAppliedFor,
            status: app.status.toLowerCase(),
            email: app.guardianEmail,
            phone: app.guardianPhone,
            createdAt: app.createdAt,
            reviewedAt: app.reviewedAt,
            reviewedBy: app.reviewedBy
        }));

        console.log(`✅ Found ${applications.length} applications`);

        // Add cache-busting headers
        res.set({
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        });

        res.json({
            success: true,
            applications: transformedApplications
        });

    } catch (error) {
        console.error('❌ Error fetching applications:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch applications',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// Get single application details (admin only)
router.get('/applications/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        
        const application = await db.admissionApplications.findUnique({
            where: { id }
        });

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        res.json({
            success: true,
            application
        });

    } catch (error) {
        console.error('❌ Error fetching application:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch application',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// Update application status (admin only)
router.patch('/applications/:id/status', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { status, reviewedBy } = req.body;

        const validStatuses = ['PENDING', 'REVIEWED', 'ACCEPTED', 'REJECTED'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status value'
            });
        }

        const application = await db.admissionApplications.update(id, {
            status,
            reviewedAt: new Date(),
            reviewedBy: reviewedBy || req.user.email
        });

        res.json({
            success: true,
            message: 'Application status updated successfully',
            application: {
                id: application.id,
                status: application.status,
                reviewedAt: application.reviewedAt,
                reviewedBy: application.reviewedBy
            }
        });

    } catch (error) {
        console.error('❌ Error updating application status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update application status',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});


// Delete application (admin only)
router.delete('/applications/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;

        await db.admissionApplications.delete(id);

        res.json({
            success: true,
            message: 'Application deleted successfully'
        });

    } catch (error) {
        console.error('❌ Error deleting application:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete application',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

module.exports = router;
