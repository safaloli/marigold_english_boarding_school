const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const { db } = require('../config/database');
const { sendPasswordResetEmail, sendOTPEmail, sendTestEmail } = require('../config/email');
const router = express.Router();

// Generate JWT Token
const generateToken = (userId, role) => {
    return jwt.sign(
        { userId, role },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
    );
};

// @route   POST /api/auth/login
// @desc    Admin login
// @access  Public
router.post('/login', [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
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

        const { email, password } = req.body;

        // Check if user exists
        const user = await db.users.findByEmail(email);
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check if user is active
        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Account is deactivated'
            });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Update last login (fail silently if this fails - don't block login)
        try {
            await db.users.update(user.id, { lastLogin: new Date() });
        } catch (updateError) {
            console.warn('Failed to update last login:', updateError.message);
            // Continue with login even if last login update fails
        }

        // Generate token
        const token = generateToken(user.id, user.role);

        // Remove password from response
        const { password: userPassword, ...userWithoutPassword } = user;

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                user: userWithoutPassword,
                token
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        console.error('Login error stack:', error.stack);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// @route   POST /api/auth/register
// @desc    Register new admin (super admin only)
// @access  Private
router.post('/register', [
    body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required')
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

        const { email, password, firstName, lastName, role = 'ADMIN' } = req.body;

        // Check if user already exists
        const existingUserByEmail = await db.users.findByEmail(email);
        if (existingUserByEmail) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create new user
        const userData = {
            email,
            password: hashedPassword,
            firstName,
            lastName,
            role,
            isActive: true,
        };

        const user = await db.users.create(userData);

        // Generate token
        const token = generateToken(user.id, user.role);

        // Remove password from response
        const { password: _, ...userWithoutPassword } = user;

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: userWithoutPassword,
                token
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No token provided'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        
        // Get user from database
        const user = await db.users.findById(decoded.userId);
        
        if (user) {
            // Remove password from response
            delete user.password;
        }

        if (!user || !user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }

        res.json({
            success: true,
            data: {
                user: user
            }
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
    }
});

// @route   POST /api/auth/change-password
// @desc    Change password
// @access  Private
router.post('/change-password', [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
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

        const { currentPassword, newPassword } = req.body;
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No token provided'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        
        // Get user with password
        const user = await db.users.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 12);

        // Update password
        await db.users.update(user.id, { 
            password: hashedPassword,
        });

        res.json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   POST /api/auth/logout
// @desc    Logout (client-side token removal)
// @access  Public
router.post('/logout', (req, res) => {
    res.json({
        success: true,
        message: 'Logged out successfully'
    });
});

// @route   POST /api/auth/forgot-password
// @desc    Send OTP code for password reset
// @access  Public
router.post('/forgot-password', [
    body('email').isEmail().withMessage('Please enter a valid email')
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

        const { email } = req.body;

        // Check if user exists
        const user = await db.users.findByEmail(email);
        
        if (!user) {
            // Don't reveal if user exists or not for security
            return res.json({
                success: true,
                message: 'If an account with that email exists, a password reset code has been sent.'
            });
        }

        // Generate 6-digit OTP
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Set expiration time (15 minutes from now)
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

        // Store OTP in database
        await db.passwordResetTokens.create({
            email: email,
            otpCode: otpCode,
            expiresAt: expiresAt,
            isUsed: false
        });

        // Send OTP email
        const emailResult = await sendOTPEmail(email, otpCode);

        if (emailResult.success) {
            console.log(`✅ OTP sent to: ${email}`);
            console.log(`📧 Message ID: ${emailResult.messageId}`);
            console.log(`🔑 OTP Code: ${otpCode} (for testing purposes)`);
        } else {
            console.error(`❌ Failed to send OTP to ${email}:`, emailResult.error);
        }

        res.json({
            success: true,
            message: 'If an account with that email exists, a password reset code has been sent.'
        });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   POST /api/auth/verify-otp
// @desc    Verify OTP code for password reset
// @access  Public
router.post('/verify-otp', [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('otpCode').isLength({ min: 6, max: 6 }).withMessage('OTP code must be 6 digits')
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

        const { email, otpCode } = req.body;

        // Find valid OTP token
        const tokens = await db.query(
            'SELECT * FROM password_reset_tokens WHERE email = ? AND otp_code = ? AND is_used = 0 AND expires_at > NOW() ORDER BY created_at DESC LIMIT 1',
            [email, otpCode]
        );
        const otpToken = tokens.length > 0 ? {
            id: tokens[0].id,
            email: tokens[0].email,
            otpCode: tokens[0].otp_code,
            expiresAt: tokens[0].expires_at,
            isUsed: tokens[0].is_used,
            createdAt: tokens[0].created_at
        } : null;

        if (!otpToken) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired OTP code'
            });
        }

        // Mark OTP as used
        await db.passwordResetTokens.update(otpToken.id, { isUsed: true });

        res.json({
            success: true,
            message: 'OTP verified successfully'
        });
    } catch (error) {
        console.error('Verify OTP error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   POST /api/auth/reset-password
// @desc    Reset password using OTP verification
// @access  Public
router.post('/reset-password', [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('otpCode').isLength({ min: 6, max: 6 }).withMessage('OTP code must be 6 digits'),
    body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
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

        const { email, otpCode, newPassword } = req.body;

        // Find valid OTP token
        const tokens = await db.query(
            'SELECT * FROM password_reset_tokens WHERE email = ? AND otp_code = ? AND is_used = 0 AND expires_at > NOW() ORDER BY created_at DESC LIMIT 1',
            [email, otpCode]
        );
        const otpToken = tokens.length > 0 ? {
            id: tokens[0].id,
            email: tokens[0].email,
            otpCode: tokens[0].otp_code,
            expiresAt: tokens[0].expires_at,
            isUsed: tokens[0].is_used,
            createdAt: tokens[0].created_at
        } : null;

        if (!otpToken) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired OTP code'
            });
        }

        // Check if user exists
        const user = await db.users.findByEmail(email);
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'User not found'
            });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 12);

        // Update password
        await db.users.update(user.id, { 
            password: hashedPassword
        });

        // Mark OTP as used
        await db.passwordResetTokens.update(otpToken.id, { 
            isUsed: true 
        });

        res.json({
            success: true,
            message: 'Password has been reset successfully'
        });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   POST /api/auth/test-email
// @desc    Test email functionality using direct SMTP
// @access  Public
router.post('/test-email', [
    body('email').isEmail().withMessage('Please enter a valid email')
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

        const { email } = req.body;

        // Test direct SMTP email functionality
        const emailResult = await sendTestEmail(email);

        if (emailResult.success) {
            console.log(`✅ Test email sent successfully to: ${email}`);
            console.log(`📧 Message ID: ${emailResult.messageId}`);
            
            res.json({
                success: true,
                message: 'Test email sent successfully'
            });
        } else {
            console.error('Test email error:', emailResult.error);
            res.status(400).json({
                success: false,
                message: 'Failed to send test email',
                error: emailResult.error
            });
        }
    } catch (error) {
        console.error('Test email error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

module.exports = router;
