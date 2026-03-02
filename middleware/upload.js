const { upload, deleteImage, getImageUrl, getResponsiveImageUrls } = require('../config/cloudinary');
const { db } = require('../config/database');

// Single image upload middleware
const uploadSingle = (fieldName = 'image') => {
    return upload.single(fieldName);
};

// Multiple images upload middleware
const uploadMultiple = (fieldName = 'images', maxCount = 10) => {
    return upload.array(fieldName, maxCount);
};

// Fields upload middleware (for multiple different fields)
const uploadFields = (fields) => {
    return upload.fields(fields);
};

// Error handling middleware for uploads
const handleUploadError = (error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'File too large. Maximum size is 25MB.'
            });
        }
        if (error.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({
                success: false,
                message: 'Too many files. Maximum allowed is 10 files.'
            });
        }
        if (error.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({
                success: false,
                message: 'Unexpected field name for file upload.'
            });
        }
    }
    
    if (error.message === 'Invalid file type. Only images are allowed.') {
        return res.status(400).json({
            success: false,
            message: 'Invalid file type. Only images are allowed.'
        });
    }
    
    next(error);
};

// Helper function to process uploaded file and return Cloudinary data
const processUploadedFile = (file) => {
    if (!file) return null;
    
    return {
        public_id: file.public_id,
        secure_url: file.secure_url,
        original_filename: file.originalname,
        format: file.format,
        bytes: file.bytes,
        width: file.width,
        height: file.height,
        created_at: new Date().toISOString()
    };
};

// Helper function to process multiple uploaded files
const processUploadedFiles = (files) => {
    if (!files || files.length === 0) return [];
    
    return files.map(file => processUploadedFile(file));
};

// Helper function to save image metadata to database
// NOTE: This function is not currently implemented for MySQL
// Images are managed directly by Cloudinary, not stored in database
const saveImageMetadata = async (imageData, section = null, key = null) => {
    // TODO: Implement if content metadata storage is needed
    console.warn('saveImageMetadata: Not implemented - images stored in Cloudinary only');
    return {
        success: true,
        message: 'Image uploaded to Cloudinary',
        data: imageData
    };
};

// Helper function to delete image from Cloudinary
// NOTE: Database deletion not implemented as images are stored in Cloudinary only
const deleteImageCompletely = async (publicId, contentId = null) => {
    try {
        // Delete from Cloudinary
        const cloudinaryResult = await deleteImage(publicId);
        
        // Database deletion not needed - images managed by Cloudinary
        if (contentId) {
            console.warn('deleteImageCompletely: Database deletion not implemented');
        }
        
        return cloudinaryResult;
    } catch (error) {
        console.error('Error deleting image from Cloudinary:', error);
        throw error;
    }
};

// Helper function to get responsive image URLs for a public_id
const getImageVariants = (publicId) => {
    return getResponsiveImageUrls(publicId);
};

// Middleware to add Cloudinary URLs to response
const addCloudinaryUrls = (req, res, next) => {
    if (req.file) {
        req.cloudinaryData = processUploadedFile(req.file);
        req.cloudinaryData.variants = getImageVariants(req.file.public_id);
    }
    
    if (req.files) {
        req.cloudinaryData = processUploadedFiles(req.files);
        req.cloudinaryData = req.cloudinaryData.map(data => ({
            ...data,
            variants: getImageVariants(data.public_id)
        }));
    }
    
    next();
};

// Validation middleware for image uploads
const validateImageUpload = (req, res, next) => {
    if (!req.file && !req.files) {
        return res.status(400).json({
            success: false,
            message: 'No image file provided'
        });
    }
    
    next();
};

module.exports = {
    uploadSingle,
    uploadMultiple,
    uploadFields,
    handleUploadError,
    processUploadedFile,
    processUploadedFiles,
    saveImageMetadata,
    deleteImageCompletely,
    getImageVariants,
    addCloudinaryUrls,
    validateImageUpload
};
