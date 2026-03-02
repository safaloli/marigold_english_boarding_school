
const uploadRoutes = require('express').Router();
const { authenticateToken } = require('../middleware/auth');
const cloudinary = require('../config/cloudinary');
const {getImageUrl} = require('../config/cloudinary');
const generatePublicId = require("../public/admin/js/utils/generatePublicId")

// Configure multer for PDF uploads
const multer = require('multer');
const pdfStorage = multer.memoryStorage();
const pdfUpload = multer({
    storage: pdfStorage,
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB limit
    },
    fileFilter: (req, file, cb) => {
        console.log('📄 File filter check:', {
            fieldname: file.fieldname,
            originalname: file.originalname,
            mimetype: file.mimetype,
            size: file.size
        });
        
        // Allow PDF files
        if (file.mimetype === 'application/pdf') {
            console.log('✅ PDF file accepted');
            cb(null, true);
        } else {
            console.log('❌ File type rejected:', file.mimetype);
            cb(new Error('Only PDF files are allowed'), false);
        }
    }
});


// Simple health check endpoint
uploadRoutes.get('/health', (req, res) => {
    res.json({ success: true, message: 'Upload service is running' });
});

// Test Cloudinary connection
uploadRoutes.get('/test-cloudinary', async (req, res) => {
    try {
        const { testCloudinaryConnection } = require('../config/cloudinary');
        const isConnected = await testCloudinaryConnection();
        
        res.json({
            success: isConnected,
            message: isConnected ? 'Cloudinary is connected' : 'Cloudinary connection failed'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Cloudinary test failed',
            error: error.message
        });
    }
});

// Test SVG upload - for debugging
uploadRoutes.post('/test-svg', authenticateToken, async (req, res) => {
    try {
        const { imageData, fileName } = req.body;
        
        console.log('🧪 TEST SVG Upload - Starting...');
        console.log('📝 File name:', fileName);
        console.log('📝 Data prefix:', imageData ? imageData.substring(0, 100) : 'No data');
        
        if (!imageData) {
            return res.status(400).json({
                success: false,
                message: 'No image data provided'
            });
        }
        
        // Try multiple detection methods
        const isSVGByData = imageData.includes('data:image/svg');
        const isSVGByFilename = fileName?.toLowerCase().endsWith('.svg');
        const isSVGByXML = imageData.includes('<svg');
        
        console.log('🔍 Detection results:', {
            isSVGByData,
            isSVGByFilename,
            isSVGByXML,
            finalDecision: isSVGByData || isSVGByFilename
        });
        
        const base64Data = imageData.includes(',') ? imageData.split(',')[1] : imageData;
        const buffer = Buffer.from(base64Data, 'base64');
        const bufferString = buffer.toString('utf8', 0, 100);
        
        console.log('📦 Buffer info:', {
            size: buffer.length,
            start: bufferString
        });
        
        res.json({
            success: true,
            detection: {
                isSVGByData,
                isSVGByFilename,
                isSVGByXML,
                final: isSVGByData || isSVGByFilename
            },
            buffer: {
                size: buffer.length,
                preview: bufferString
            }
        });
    } catch (error) {
        console.error('Test SVG error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Test PDF URL accessibility
uploadRoutes.get('/test-pdf-url', async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) {
            return res.status(400).json({
                success: false,
                message: 'URL parameter is required'
            });
        }

        console.log('🔍 Testing PDF URL:', url);
        
        // Test if the URL is accessible
        const response = await fetch(url, { method: 'HEAD' });
        
        res.json({
            success: response.ok,
            status: response.status,
            statusText: response.statusText,
            contentType: response.headers.get('content-type'),
            url: url
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to test PDF URL',
            error: error.message
        });
    }
});


// Base64 image/video upload endpoint (for CSP compliance) - OPTIMIZED
uploadRoutes.post('/image', authenticateToken, async (req, res) => {
    try {
        const { imageData, fileName, folder } = req.body;
        
        // Detect if this is a video, SVG, or regular image
        const isVideo = imageData?.startsWith('data:video/') || 
                       fileName?.match(/\.(mp4|webm|ogg|mov)$/i);
        const isSVG = imageData?.includes('data:image/svg') || 
                     fileName?.toLowerCase().endsWith('.svg');
        
        const mediaType = isVideo ? 'video' : 'image';
        
        console.log('Upload request received:', {
            hasImageData: !!imageData,
            imageDataLength: imageData ? imageData.length : 0,
            imageDataType: typeof imageData,
            fileName,
            folder,
            detectedType: mediaType,
            isSVG: isSVG
        });
        
        if (!imageData) {
            return res.status(400).json({
                success: false,
                message: 'No media data provided'
            });
        }
        
        // Convert base64 to buffer - optimized
        // Check if imageData already has the data: prefix or is just base64
        const base64Data = imageData.includes(',') ? imageData.split(',')[1] : imageData;
        console.log('Base64 processing:', {
            originalLength: imageData.length,
            base64DataLength: base64Data.length,
            hasComma: imageData.includes(','),
            mediaType,
            isSVG
        });
        
        const buffer = Buffer.from(base64Data, 'base64');
        console.log('Buffer created successfully, size:', buffer.length, 'bytes', `(${(buffer.length / 1024 / 1024).toFixed(2)} MB)`);
        
        // Set upload options based on media type
        const uploadOptions = {
            folder: folder || 'marigold-school/uploads',
            public_id: `${Date.now()}_${fileName || mediaType}${isSVG ? '.svg' : ''}`,
            resource_type: mediaType,
            use_filename: false,
            unique_filename: false,
            overwrite: true
        };
        
        // Add type-specific optimizations
        if (isVideo) {
            // Video-specific settings
            uploadOptions.chunk_size = 10000000; // 10MB chunks for videos
            uploadOptions.timeout = 600000; // 10 minutes timeout for videos
            uploadOptions.quality_analysis = false;
            uploadOptions.accessibility_analysis = false;
        } else if (isSVG) {
            // SVG-specific settings (vector graphics - no transformation)
            console.log('✅ SVG detected - uploading without transformations');
            uploadOptions.public_id = uploadOptions.public_id.replace('.svg', ''); // Remove .svg from public_id
            uploadOptions.format = 'svg'; // Explicitly set format to SVG
            uploadOptions.invalidate = true; // Invalidate CDN cache
            uploadOptions.flags = ['sanitize']; // Sanitize SVG but keep as SVG
            uploadOptions.timeout = 60000;
            uploadOptions.chunk_size = 6000000;
            // No transformations for SVG
            delete uploadOptions.transformation;
        } else {
            // Regular image-specific settings
            uploadOptions.transformation = []; // NO transformations for fastest upload
            uploadOptions.flags = ['progressive']; // Progressive loading
            uploadOptions.eager_async = true;
            uploadOptions.timeout = 60000; // 60 second timeout
            uploadOptions.chunk_size = 6000000; // 6MB chunks
        }
        
        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                uploadOptions,
                (error, result) => {
                    if (error) {
                        console.error('Upload error:', error);
                        reject(error);
                    } else {
                        console.log('Upload successful:', result.public_id);
                        resolve(result);
                    }
                }
            ).end(buffer);
        });
        
        res.json({
            success: true,
            message: `${mediaType.charAt(0).toUpperCase() + mediaType.slice(1)} uploaded successfully`,
            url: uploadResult.secure_url,
            format: uploadResult.format,
            isSVG: isSVG,
            data: uploadResult
        });
        
    } catch (error) {
        console.error('Base64 upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to upload media',
            error: error.message
        });
    }
});

// Logo upload endpoint with optimization for website logos
uploadRoutes.post('/logo', authenticateToken, async (req, res) => {
    try {
        const { imageData, fileName } = req.body;
        
        console.log('Logo upload request received:', {
            hasImageData: !!imageData,
            imageDataLength: imageData ? imageData.length : 0,
            fileName
        });
        
        if (!imageData) {
            return res.status(400).json({
                success: false,
                message: 'No image data provided'
            });
        }
        
        // Detect file type from the base64 data or filename
        const isSVG = imageData.includes('data:image/svg') || 
                     fileName?.toLowerCase().endsWith('.svg');
        
        console.log('🔍 SVG Detection:', {
            hasDataPrefix: imageData.includes('data:image/svg'),
            fileName: fileName,
            fileNameEndsWithSvg: fileName?.toLowerCase().endsWith('.svg'),
            isSVG: isSVG,
            dataStart: imageData.substring(0, 50)
        });
        
        // Convert base64 to buffer
        const base64Data = imageData.includes(',') ? imageData.split(',')[1] : imageData;
        const buffer = Buffer.from(base64Data, 'base64');
        console.log('Logo buffer created, size:', buffer.length, 'bytes');
        console.log('Logo type:', isSVG ? 'SVG (vector)' : 'Raster image');
        
        // Different upload settings for SVG vs raster images
        const uploadOptions = {
            folder: 'marigold-school/website-assets',
            public_id: `logo_${Date.now()}${isSVG ? '.svg' : ''}`,
            resource_type: 'image',
            timeout: 60000,
            chunk_size: 6000000,
            use_filename: false,
            unique_filename: false,
            overwrite: true
        };
        
        // SVG files should NOT be transformed (they're vector graphics)
        if (isSVG) {
            console.log('✅ SVG detected - uploading without transformations');
            // For SVG, we need to preserve the format and prevent auto-conversion
            uploadOptions.public_id = uploadOptions.public_id.replace('.svg', ''); // Remove .svg from public_id
            uploadOptions.format = 'svg'; // Explicitly set format
            uploadOptions.invalidate = true; // Invalidate CDN cache
            uploadOptions.resource_type = 'image'; // Keep as image type
            uploadOptions.flags = ['sanitize']; // Sanitize SVG but keep as SVG
            // No transformations for SVG
            delete uploadOptions.transformation;
        } else {
            console.log('✅ Raster image detected - applying optimizations');
            // For raster images (PNG, JPG, etc.), apply transformations
            uploadOptions.transformation = [
                {
                    width: 300, // Max width for logos
                    height: 100, // Max height for logos
                    crop: 'scale', // Scale proportionally
                    quality: 'auto:best', // Best quality for logos
                    fetch_format: 'auto', // Auto format selection
                    flags: ['progressive'] // Progressive loading
                }
            ];
            // Generate multiple sizes for responsive design
            uploadOptions.eager = [
                { width: 200, height: 67, crop: 'scale', quality: 'auto:best', fetch_format: 'auto' },
                { width: 150, height: 50, crop: 'scale', quality: 'auto:best', fetch_format: 'auto' },
                { width: 100, height: 33, crop: 'scale', quality: 'auto:best', fetch_format: 'auto' }
            ];
            uploadOptions.eager_async = true;
        }
        
        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                uploadOptions,
                (error, result) => {
                    if (error) {
                        console.error('❌ Logo upload error:', error);
                        reject(error);
                    } else {
                        console.log('✅ Logo uploaded successfully:', {
                            public_id: result.public_id,
                            format: result.format,
                            url: result.secure_url,
                            resource_type: result.resource_type
                        });
                        resolve(result);
                    }
                }
            ).end(buffer);
        });
        
        console.log('📊 Final upload result:', {
            format: uploadResult.format,
            url: uploadResult.secure_url,
            expected_svg: isSVG
        });
        
        res.json({
            success: true,
            message: 'Logo uploaded successfully',
            url: uploadResult.secure_url,
            format: uploadResult.format,
            isSVG: isSVG,
            data: uploadResult,
            // Provide different sizes for responsive use (only for raster images)
            sizes: isSVG ? {
                original: uploadResult.secure_url
            } : {
                original: uploadResult.secure_url,
                medium: uploadResult.eager && uploadResult.eager[0] ? uploadResult.eager[0].secure_url : uploadResult.secure_url,
                small: uploadResult.eager && uploadResult.eager[1] ? uploadResult.eager[1].secure_url : uploadResult.secure_url,
                tiny: uploadResult.eager && uploadResult.eager[2] ? uploadResult.eager[2].secure_url : uploadResult.secure_url
            }
        });
        
    } catch (error) {
        console.error('Logo upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to upload logo',
            error: error.message
        });
    }
});

// Upload video endpoint
uploadRoutes.post('/video', async (req, res) => {
    try {
        console.log('📹 Video upload request received');
        const { videoData, fileName, folder } = req.body;
        
        if (!videoData) {
            console.log('❌ No video data provided');
            return res.status(400).json({ success: false, error: 'No video data provided' });
        }
        
        console.log(`📤 Processing video: ${fileName}, Data size: ${videoData.length} characters`);
        
        // Convert base64 to buffer
        const base64Data = videoData.split(',')[1]; // Remove data:video/...;base64, prefix
        const buffer = Buffer.from(base64Data, 'base64');
        console.log(`📊 Buffer size: ${buffer.length} bytes (${(buffer.length / 1024 / 1024).toFixed(2)} MB)`);
        
        const cloudinary = require('../config/cloudinary');
        
        console.log('☁️ Starting Cloudinary upload...');
        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    folder: folder || 'marigold-school/uploads',
                    public_id: `${Date.now()}_${fileName || 'video'}`,
                    resource_type: 'video',
                    // NO transformation - video is already compressed to 480p on client side
                    // Ultra-fast upload with minimal processing
                    timeout: 900000, // 15 minutes timeout for large files
                    chunk_size: 20000000, // 20MB chunks for faster upload
                    use_filename: false,
                    unique_filename: false,
                    overwrite: true,
                    quality_analysis: false,
                    accessibility_analysis: false,
                    eager_async: true // Process asynchronously for faster response
                },
                (error, result) => {
                    if (error) {
                        console.error('❌ Cloudinary upload error:', error);
                        reject(error);
                    } else {
                        console.log('✅ Cloudinary upload successful:', result.public_id);
                        resolve(result);
                    }
                }
            ).end(buffer);
        });
        
        console.log('✅ Video upload completed successfully');
        res.json({
            success: true,
            message: 'Video uploaded successfully',
            url: uploadResult.secure_url,
            thumbnailUrl: uploadResult.eager && uploadResult.eager[0] ? uploadResult.eager[0].secure_url : null,
            public_id: uploadResult.public_id
        });
    } catch (error) {
        console.error('❌ Video upload error:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message || 'Failed to upload video',
            details: error.toString()
        });
    }
});

// NEW: Fast video upload using local multer + manual Cloudinary upload (avoids timeouts)
uploadRoutes.post('/video-file', (req, res) => {
    const multer = require('multer');
    const path = require('path');
    const fs = require('fs');
    
    // Use memory storage for faster processing
    const storage = multer.memoryStorage();
    const upload = multer({
        storage: storage,
        limits: { fileSize: 200 * 1024 * 1024 } // 200MB limit
    }).single('video');
    
    upload(req, res, async (err) => {
        if (err) {
            console.error('❌ Multer error:', err);
            return res.status(400).json({
                success: false,
                error: err.message || 'File upload failed'
            });
        }
        
        // Check authentication
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({
                    success: false,
                    message: 'No token provided'
                });
            }
            
            const token = authHeader.substring(7);
            const jwt = require('jsonwebtoken');
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
            req.user = decoded;
        } catch (authError) {
            console.error('❌ Authentication failed:', authError.message);
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }
        
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: 'No video file provided'
            });
        }
        
        const folder = req.body.folder || 'marigold-school/videos';
        const fileName = `${Date.now()}_${req.file.originalname.replace(/\.[^/.]+$/, '')}`;
        const shouldOptimize = req.body.optimize === 'true';
        
        console.log('📤 Uploading video to Cloudinary...');
        console.log('📹 File:', req.file.originalname);
        console.log('📊 Size:', (req.file.size / 1024 / 1024).toFixed(2), 'MB');
        console.log('📁 Folder:', folder);
        console.log('⚡ Server-side optimization:', shouldOptimize ? 'ENABLED' : 'disabled');
        
        try {
            // Upload to Cloudinary using stream with chunked upload
            const cloudinary = require('../config/cloudinary');
            
            console.log(`⏱️  Starting Cloudinary upload at ${new Date().toISOString()}`);
            const uploadStartTime = Date.now();
            
            // Build upload options
            const uploadOptions = {
                        resource_type: 'video',
                        folder: folder,
                        public_id: fileName,
                chunk_size: 20000000, // 20MB chunks for faster upload of large files
                timeout: 900000, // 15 minutes timeout for large files (200MB)
                        use_filename: false,
                        unique_filename: false,
                        overwrite: true,
                        quality_analysis: false,
                        accessibility_analysis: false,
                        notification_url: null
            };
            
            // Add optimization transformations if requested
            if (shouldOptimize) {
                console.log('🎬 Adding Cloudinary server-side optimization: 1080p, auto quality, H.264 codec');
                uploadOptions.eager = [
                    {
                        width: 1920,
                        height: 1080,
                        crop: 'limit',
                        quality: 'auto:good',
                        video_codec: 'h264',
                        audio_codec: 'aac',
                        format: 'mp4'
                    }
                ];
                uploadOptions.eager_async = true; // Process in background
            } else {
                uploadOptions.eager_async = true;
            }
            
            const uploadResult = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    uploadOptions,
                    (error, result) => {
                        const uploadDuration = ((Date.now() - uploadStartTime) / 1000).toFixed(2);
                        if (error) {
                            console.error(`❌ Cloudinary upload error after ${uploadDuration}s:`, error);
                            reject(error);
                        } else {
                            console.log(`✅ Video uploaded successfully in ${uploadDuration}s!`);
                            resolve(result);
                        }
                    }
                );
                
                // Write buffer to stream
                console.log(`📤 Writing ${req.file.buffer.length} bytes to Cloudinary stream...`);
                uploadStream.end(req.file.buffer);
            });
            
            // Generate thumbnail URL instantly using Cloudinary transformation
            // No need to wait for video processing - Cloudinary will generate it on-demand
            let thumbnailUrl;
            try {
                // Extract components from the upload result
                const videoUrl = uploadResult.secure_url;
                const publicId = uploadResult.public_id;
                
                // Extract cloud name from config or URL
                const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'dtjr46kcg';
                
                // For video thumbnails, we need to:
                // 1. Use the public_id WITHOUT any extension
                // 2. Change resource type from 'video' to generate image
                // 3. Add transformation parameters
                // 4. Append .jpg to get the image
                
                // Format: https://res.cloudinary.com/{cloud}/video/upload/{transformations}/{public_id}.jpg
                thumbnailUrl = `https://res.cloudinary.com/${cloudName}/video/upload/so_1,w_400,h_300,c_fill,g_auto,f_jpg/${publicId}.jpg`;
                
                console.log('✅ Generated thumbnail URL:', thumbnailUrl);
                console.log('📹 Video URL:', videoUrl);
                console.log('🆔 Public ID:', publicId);
            } catch (error) {
                console.error('❌ Error generating thumbnail URL:', error);
                // Fallback: use a placeholder image
                thumbnailUrl = 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&h=300&fit=crop&auto=format';
                console.log('🔄 Using fallback placeholder thumbnail');
            }
            
            res.json({
                success: true,
                message: 'Video uploaded successfully',
                url: uploadResult.secure_url,
                thumbnailUrl: thumbnailUrl,
                thumbnail: thumbnailUrl,
                publicId: uploadResult.public_id,
                size: req.file.size,
                format: uploadResult.format || 'video'
            });
        } catch (uploadError) {
            console.error('❌ Upload error:', uploadError);
            res.status(500).json({
                success: false,
                error: 'Failed to upload video to Cloudinary',
                details: uploadError.message
            });
        }
    });
});

// Cloudinary file upload endpoint (for PDFs and other files)
uploadRoutes.post('/cloudinary', authenticateToken, pdfUpload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file provided'
            });
        }

        const { folder = 'marigold-school/uploads', resource_type = 'raw' } = req.body;

        const securePublicId = generatePublicId(req.file.originalname)
        // Upload to Cloudinary with optimized settings for PDFs
        cloudinary.uploader.upload_stream(
            {
                folder: folder,
                resource_type: resource_type,
                unique_filename: false, 
                overwrite: true,
                public_id: req.file.originalname,
                access_mode: 'public',
                type: 'upload', 
                // No transformations for raw files
                tags: ['pdf', 'notice'], // Add tags for better organization
                context: {
                    alt: req.file.originalname,
                    caption: `PDF document: ${req.file.originalname}`
                }
            },
            (error, result) => {
                if (error) {
                    console.error('❌ Cloudinary upload error:', error);
                    return res.status(500).json({
                        success: false,
                        error: 'Failed to upload file to Cloudinary',
                        details: error.message
                    });
                }

            res.json({
                success: true,
                url: result.secure_url,
                public_id: result.public_id,
                format: result.format || 'pdf',
                bytes: result.bytes,
                originalName: req.file.originalname,
                size: req.file.size,
            });
            }
        ).end(req.file.buffer);
    } catch (error) {
        console.error('❌ Upload error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to upload file',
            details: error.message
        });
    }
});

module.exports = {
    uploadRoutes,
    pdfUpload
};
