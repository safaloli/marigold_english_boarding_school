const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config()

// Configure Cloudinary - Use environment variables
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure multer storage for videos
const videoStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        resource_type: 'video',
        folder: (req, file) => req.body.folder || 'marigold-school/videos',
        public_id: (req, file) => `${Date.now()}_${file.originalname.replace(/\.[^/.]+$/, '')}`,
        allowed_formats: ['mp4', 'mov', 'avi', 'wmv', 'flv', 'webm'],
        // No transformation here - let the upload route handle it with better settings
        transformation: [],
    },
});

// Create multer upload middleware for videos
const videoUpload = multer({
    storage: videoStorage,
    limits: {
        fileSize: 200 * 1024 * 1024, // 200MB limit
        fieldSize: 200 * 1024 * 1024, // Allow large field sizes for video data
    },
    fileFilter: (req, file, cb) => {
        const allowedMimes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-ms-wmv', 'video/x-flv', 'video/webm'];
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only video files are allowed.'));
        }
    }
});

// Test the configuration
const testCloudinaryConnection = async () => {
    try {
        const result = await cloudinary.api.ping();
        console.log('✅ Cloudinary connection successful:', result);
        return true;
    } catch (error) {
        console.error('❌ Cloudinary connection failed:', error);
        return false;
    }
};

// Delete image from Cloudinary
const deleteImage = async (publicId, resourceType = 'image') => {
    try {
        console.log(`🗑️ Deleting ${resourceType} from Cloudinary: ${publicId}`);
        const result = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
        
        if (result.result === 'ok') {
            console.log(`✅ ${resourceType} deleted from Cloudinary: ${publicId}`);
        } else if (result.result === 'not found') {
            console.log(`⚠️ ${resourceType} not found in Cloudinary (already deleted or never existed): ${publicId}`);
        } else {
            console.log(`⚠️ Unexpected Cloudinary result: ${result.result} for ${publicId}`);
        }
        
        return result;
    } catch (error) {
        console.error(`❌ Error deleting ${resourceType} from Cloudinary:`, error);
        throw error;
    }
};

// Get image URL with transformations
const getImageUrl = async(publicId, transformations = {}) => {
    return await cloudinary.url(publicId, transformations);
};

// Get responsive image URLs
const getResponsiveImageUrls = (publicId) => {
    return {
        thumbnail: cloudinary.url(publicId, { width: 150, height: 150, crop: 'fill', quality: 'auto' }),
        small: cloudinary.url(publicId, { width: 300, height: 300, crop: 'fill', quality: 'auto' }),
        medium: cloudinary.url(publicId, { width: 600, height: 400, crop: 'fill', quality: 'auto' }),
        large: cloudinary.url(publicId, { width: 1200, height: 800, crop: 'fill', quality: 'auto' }),
        original: cloudinary.url(publicId, { quality: 'auto' })
    };
};

module.exports = {
    ...cloudinary,
    testCloudinaryConnection,
    videoUpload,
    deleteImage,
    getImageUrl,
    getResponsiveImageUrls
};