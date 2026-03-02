const { v2: cloudinary } = require('cloudinary');

/**
 * Generate video thumbnail using Cloudinary's video transformation parameters
 * @param {string} videoUrl - The Cloudinary video URL
 * @param {Object} options - Thumbnail generation options
 * @returns {Promise<string>} - The thumbnail URL
 */
async function generateVideoThumbnail(videoUrl, options = {}) {
    try {
        // Default thumbnail options
        const defaultOptions = {
            width: 400,
            height: 300,
            crop: 'fill',
            gravity: 'center',
            startTime: 0, // Start at 0 seconds
            quality: 'auto',
            format: 'jpg'
        };

        // Merge with provided options
        const thumbnailOptions = { ...defaultOptions, ...options };

        // Extract public ID from Cloudinary URL
        const publicId = extractPublicIdFromUrl(videoUrl);
        if (!publicId) {
            throw new Error('Invalid Cloudinary video URL');
        }

        // For Cloudinary videos, generate thumbnail URL using the video transformation
        // Format: https://res.cloudinary.com/cloud_name/video/upload/w_400,h_300,c_fill,so_1/publicId.jpg
        const baseUrl = videoUrl.split('/upload/')[0];
        const transformations = [
            `w_${thumbnailOptions.width}`,
            `h_${thumbnailOptions.height}`,
            `c_${thumbnailOptions.crop}`,
            `g_${thumbnailOptions.gravity}`,
            `so_${thumbnailOptions.startTime}`,
            `q_${thumbnailOptions.quality}`,
            `f_${thumbnailOptions.format}`
        ].join(',');
        
        const finalThumbnailUrl = `${baseUrl}/upload/${transformations}/${publicId}`;

        console.log(`🎬 Generated thumbnail URL: ${finalThumbnailUrl}`);
        return finalThumbnailUrl;

    } catch (error) {
        console.error('❌ Error generating video thumbnail:', error);
        throw error;
    }
}

/**
 * Extract public ID from Cloudinary URL
 * @param {string} url - Cloudinary URL
 * @returns {string|null} - Public ID or null if invalid
 */
function extractPublicIdFromUrl(url) {
    try {
        // Handle different Cloudinary URL formats
        // Format: https://res.cloudinary.com/cloud_name/video/upload/v1234567890/folder/filename.mp4
        const match = url.match(/\/upload\/v\d+\/(.+)$/);
        if (match) {
            return match[1];
        }

        // Format: https://res.cloudinary.com/cloud_name/video/upload/folder/filename.mp4
        const match2 = url.match(/\/upload\/(.+)$/);
        if (match2) {
            return match2[1];
        }

        return null;
    } catch (error) {
        console.error('❌ Error extracting public ID:', error);
        return null;
    }
}

/**
 * Generate multiple thumbnails at different time points
 * @param {string} videoUrl - The Cloudinary video URL
 * @param {Array} timePoints - Array of time points in seconds
 * @returns {Promise<Array>} - Array of thumbnail URLs
 */
async function generateMultipleThumbnails(videoUrl, timePoints = [0, 5, 10, 15]) {
    try {
        const thumbnails = [];
        
        for (const timePoint of timePoints) {
            const thumbnailUrl = await generateVideoThumbnail(videoUrl, {
                startTime: timePoint,
                width: 200,
                height: 150
            });
            thumbnails.push({
                timePoint,
                url: thumbnailUrl
            });
        }

        return thumbnails;
    } catch (error) {
        console.error('❌ Error generating multiple thumbnails:', error);
        throw error;
    }
}

/**
 * Generate a poster frame (first frame) thumbnail
 * @param {string} videoUrl - The Cloudinary video URL
 * @returns {Promise<string>} - The poster thumbnail URL
 */
async function generatePosterThumbnail(videoUrl) {
    return generateVideoThumbnail(videoUrl, {
        startTime: 0,
        width: 400,
        height: 300,
        crop: 'fill',
        gravity: 'center'
    });
}

/**
 * Generate a high-quality thumbnail for display
 * @param {string} videoUrl - The Cloudinary video URL
 * @returns {Promise<string>} - The high-quality thumbnail URL
 */
async function generateDisplayThumbnail(videoUrl) {
    return generateVideoThumbnail(videoUrl, {
        startTime: 1, // Start at 1 second to avoid black frames
        width: 600,
        height: 400,
        crop: 'fill',
        gravity: 'center',
        quality: 'auto:best'
    });
}

module.exports = {
    generateVideoThumbnail,
    generateMultipleThumbnails,
    generatePosterThumbnail,
    generateDisplayThumbnail,
    extractPublicIdFromUrl
};
