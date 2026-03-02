const express = require('express');
const { db } = require('../config/database');
const bcrypt = require('bcryptjs');
const { authenticateAdmin } = require('../middleware/auth');

const router = express.Router();

/**
 * GET /api/admin/users - Get all users
 */
router.get('/', authenticateAdmin, async (req, res) => {
    try {
        // Get all users (MySQL doesn't support select/orderBy like Prisma)
        let users = await db.users.findAll();
        
        // Sort by createdAt desc client-side
        users = users.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        // Remove password field from response
        users = users.map(({ password, ...user }) => user);

        // Transform users to match frontend format
        const transformedUsers = users.map(user => ({
            id: user.id,
            name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown User',
            email: user.email,
            role: user.role.toLowerCase(),
            status: user.isActive ? 'active' : 'inactive',
            avatar: user.profileImage,
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString(),
            lastLogin: user.lastLogin?.toISOString()
        }));

        res.json({
            success: true,
            users: transformedUsers,
            total: transformedUsers.length
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch users',
            error: error.message
        });
    }
});

/**
 * POST /api/admin/users - Create a new user
 */
router.post('/', authenticateAdmin, async (req, res) => {
    try {
        const { name, email, role, password } = req.body;

        // Validation
        if (!name || !email || !role || !password) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Check if user already exists
        const existingUser = await db.users.findByEmail(email);

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        // Parse name
        const nameParts = name.trim().split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(' ') || '';

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user
        const newUser = await db.users.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role: role.toUpperCase(),
            isActive: true
        });

        // Transform user to match frontend format
        const transformedUser = {
            id: newUser.id,
            name: `${newUser.firstName || ''} ${newUser.lastName || ''}`.trim() || 'Unknown User',
            email: newUser.email,
            role: newUser.role.toLowerCase(),
            status: newUser.isActive ? 'active' : 'inactive',
            avatar: newUser.profileImage,
            createdAt: newUser.createdAt.toISOString(),
            updatedAt: newUser.updatedAt.toISOString()
        };

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            user: transformedUser
        });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create user',
            error: error.message
        });
    }
});

/**
 * PUT /api/admin/users/:id - Update a user
 */
router.put('/:id', authenticateAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, role, status, password } = req.body;

        // Validation
        if (!name || !email || !role) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, and role are required'
            });
        }

        // Check if user exists
        const existingUser = await db.users.findById(id);

        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Check if email is already taken by another user
        const emailTaken = await db.users.findByEmail(email);
        
        if (emailTaken && emailTaken.id !== id) {
            return res.status(400).json({
                success: false,
                message: 'Email is already taken by another user'
            });
        }

        // Parse name
        const nameParts = name.trim().split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(' ') || '';

        // Prepare update data
        const updateData = {
            firstName,
            lastName,
            email,
            role: role.toUpperCase(),
            isActive: status === 'active'
        };

        // Add password to update if provided
        if (password && password.trim()) {
            updateData.password = await bcrypt.hash(password, 12);
        }

        // Update user
        const updatedUser = await db.users.update(id, updateData);

        // Transform user to match frontend format
        const transformedUser = {
            id: updatedUser.id,
            name: `${updatedUser.firstName || ''} ${updatedUser.lastName || ''}`.trim() || 'Unknown User',
            email: updatedUser.email,
            role: updatedUser.role.toLowerCase(),
            status: updatedUser.isActive ? 'active' : 'inactive',
            avatar: updatedUser.profileImage,
            createdAt: updatedUser.createdAt.toISOString(),
            updatedAt: updatedUser.updatedAt.toISOString()
        };

        res.json({
            success: true,
            message: 'User updated successfully',
            user: transformedUser
        });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update user',
            error: error.message
        });
    }
});

/**
 * DELETE /api/admin/users/:id - Delete a user
 */
router.delete('/:id', authenticateAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        // Check if user exists
        const existingUser = await db.users.findById(id);

        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Check if user is trying to delete themselves
        if (req.user.id === id) {
            return res.status(400).json({
                success: false,
                message: 'You cannot delete your own account'
            });
        }

        // Delete user
        await db.users.delete(id);

        res.json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete user',
            error: error.message
        });
    }
});

/**
 * GET /api/admin/users/:id - Get a single user
 */
router.get('/:id', authenticateAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        const user = await db.users.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Transform user to match frontend format
        const transformedUser = {
            id: user.id,
            name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown User',
            email: user.email,
            role: user.role.toLowerCase(),
            status: user.isActive ? 'active' : 'inactive',
            avatar: user.profileImage,
            phone: user.phone,
            address: user.address,
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString(),
            lastLogin: user.lastLogin?.toISOString()
        };

        res.json({
            success: true,
            user: transformedUser
        });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch user',
            error: error.message
        });
    }
});

module.exports = router;
