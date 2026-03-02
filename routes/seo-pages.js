const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs').promises;
const { injectSEOMiddleware, generateMetaTags } = require('../middleware/seo');

/**
 * SEO-Enhanced Page Routes
 * Serves HTML pages with dynamically injected SEO meta tags
 */

// Homepage with SEO
router.get('/', injectSEOMiddleware('homepage'), async (req, res) => {
    try {
        const htmlPath = path.join(__dirname, '../public/index.html');
        let html = await fs.readFile(htmlPath, 'utf8');
        
        // Inject SEO meta tags
        const seoMetaTags = generateMetaTags(req.seoData);
        
        // Replace the head section with SEO-enhanced version
        html = html.replace(
            /<head>([\s\S]*?)<\/head>/,
            `<head>
    ${seoMetaTags}
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- Content Security Policy - Managed by server -->
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://unboxicons.com https://embed.tawk.to https://*.tawk.to https://cdn.jsdelivr.net https://cdnjs.cloudflare.com; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://unpkg.com https://cdn.jsdelivr.net https://embed.tawk.to https://*.tawk.to; script-src-attr 'unsafe-inline'; connect-src 'self' https://embed.tawk.to https://*.tawk.to wss://*.tawk.to https://unpkg.com https://cdnjs.cloudflare.com https://cdn.jsdelivr.net https://api.cloudinary.com https://res.cloudinary.com; frame-src 'self' https://embed.tawk.to https://*.tawk.to https://tawk.to https://www.google.com https://maps.google.com; img-src 'self' data: https: blob:; font-src 'self' https://fonts.gstatic.com https://unboxicons.com https://embed.tawk.to https://*.tawk.to;">
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
    
    <!-- Preload critical resources -->
    <link rel="preload" href="https://unpkg.com/lucide@latest/dist/umd/lucide.js" as="script">
    <link rel="preload" href="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js" as="script">
    
    <!-- Lucide Icons - Load async -->
    <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js" async></script>
    
    <!-- jQuery - Load async -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js" async></script>
    
    <!-- Owl Carousel - Load async -->
    <link rel="preload" href="https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.carousel.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
    <link rel="preload" href="https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.theme.default.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/owl.carousel.min.js" async></script>
    
    <link rel="icon" type="image/x-icon" href="/images/favicon.ico">
    
    <!-- Stylesheets -->
    <link rel="stylesheet" href="/css/main.css">
    <link rel="stylesheet" href="/css/components.css">
    <link rel="stylesheet" href="/css/responsive.css">
</head>`
        );
        
        res.set('Content-Type', 'text/html');
        res.set('Cache-Control', 'public, max-age=300'); // Cache for 5 minutes
        res.send(html);
    } catch (error) {
        console.error('Error serving homepage:', error);
        res.status(500).send('Error loading page');
    }
});

// Events page with SEO
router.get('/events.html', injectSEOMiddleware('events'), async (req, res) => {
    try {
        const htmlPath = path.join(__dirname, '../public/events.html');
        let html = await fs.readFile(htmlPath, 'utf8');
        
        // Inject SEO meta tags
        const seoMetaTags = generateMetaTags(req.seoData);
        
        // Replace the head section
        html = html.replace(
            /<head>([\s\S]*?)<\/head>/,
            `<head>
    ${seoMetaTags}
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- Content Security Policy -->
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://unboxicons.com https://embed.tawk.to https://*.tawk.to https://cdn.jsdelivr.net https://cdnjs.cloudflare.com; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://unpkg.com https://cdn.jsdelivr.net https://embed.tawk.to https://*.tawk.to; script-src-attr 'unsafe-inline'; connect-src 'self' https://embed.tawk.to https://*.tawk.to wss://*.tawk.to https://unpkg.com https://cdnjs.cloudflare.com https://cdn.jsdelivr.net https://api.cloudinary.com https://res.cloudinary.com; frame-src 'self' https://embed.tawk.to https://*.tawk.to https://tawk.to https://www.google.com https://maps.google.com; img-src 'self' data: https: blob:; font-src 'self' https://fonts.gstatic.com https://unboxicons.com https://embed.tawk.to https://*.tawk.to;">
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
    
    <link rel="icon" type="image/x-icon" href="/images/favicon.ico">
    
    <!-- Stylesheets -->
    <link rel="stylesheet" href="/css/main.css">
    <link rel="stylesheet" href="/css/components.css">
    <link rel="stylesheet" href="/css/responsive.css">
</head>`
        );
        
        res.set('Content-Type', 'text/html');
        res.set('Cache-Control', 'public, max-age=300');
        res.send(html);
    } catch (error) {
        console.error('Error serving events page:', error);
        res.status(500).send('Error loading page');
    }
});

// Event detail page with SEO
router.get('/eventsDetails.html', injectSEOMiddleware('event-detail'), async (req, res) => {
    try {
        const htmlPath = path.join(__dirname, '../public/eventsDetails.html');
        let html = await fs.readFile(htmlPath, 'utf8');
        
        // Inject SEO meta tags
        const seoMetaTags = generateMetaTags(req.seoData);
        
        // Replace the head section
        html = html.replace(
            /<head>([\s\S]*?)<\/head>/,
            `<head>
    ${seoMetaTags}
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- Content Security Policy -->
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://unboxicons.com https://embed.tawk.to https://*.tawk.to https://cdn.jsdelivr.net https://cdnjs.cloudflare.com; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://unpkg.com https://cdn.jsdelivr.net https://embed.tawk.to https://*.tawk.to; script-src-attr 'unsafe-inline'; connect-src 'self' https://embed.tawk.to https://*.tawk.to wss://*.tawk.to https://unpkg.com https://cdnjs.cloudflare.com https://cdn.jsdelivr.net https://api.cloudinary.com https://res.cloudinary.com; frame-src 'self' https://embed.tawk.to https://*.tawk.to https://tawk.to https://www.google.com https://maps.google.com; img-src 'self' data: https: blob:; font-src 'self' https://fonts.gstatic.com https://unboxicons.com https://embed.tawk.to https://*.tawk.to;">
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
    
    <link rel="icon" type="image/x-icon" href="/images/favicon.ico">
    
    <!-- Stylesheets -->
    <link rel="stylesheet" href="/css/main.css">
    <link rel="stylesheet" href="/css/components.css">
    <link rel="stylesheet" href="/css/responsive.css">
</head>`
        );
        
        res.set('Content-Type', 'text/html');
        res.set('Cache-Control', 'public, max-age=300');
        res.send(html);
    } catch (error) {
        console.error('Error serving event detail page:', error);
        res.status(500).send('Error loading page');
    }
});

// About page with SEO
router.get('/about.html', injectSEOMiddleware('about'), async (req, res) => {
    try {
        const htmlPath = path.join(__dirname, '../public/about.html');
        let html = await fs.readFile(htmlPath, 'utf8 acquisition');
        
        // Inject SEO meta tags
        const seoMetaTags = generateMetaTags(req.seoData);
        
        // Replace the head section
        html = html.replace(
            /<head>([\s\S]*?)<\/head>/,
            `<head>
    ${seoMetaTags}
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- Content Security Policy -->
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://unboxicons.com https://embed.tawk.to https://*.tawk.to https://cdn.jsdelivr.net https://cdnjs.cloudflare.com; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://unpkg.com https://cdn.jsdelivr.net https://embed.tawk.to https://*.tawk.to; script-src-attr 'unsafe-inline'; connect-src 'self' https://embed.tawk.to https://*.tawk.to wss://*.tawk.to https://unpkg.com https://cdnjs.cloudflare.com https://cdn.jsdelivr.net https://api.cloudinary.com https://res.cloudinary.com; frame-src 'self' https://embed.tawk.to https://*.tawk.to https://tawk.to https://www.google.com https://maps.google.com; img-src 'self' data: https: blob:; font-src 'self' https://fonts.gstatic.com https://unboxicons.com https://embed.tawk.to https://*.tawk.to;">
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
    
    <link rel="icon" type="image/x-icon" href="/images/favicon.ico">
    
    <!-- Stylesheets -->
    <link rel="stylesheet" href="/css/main.css">
    <link rel="stylesheet" href="/css/components.css">
    <link rel="stylesheet" href="/css/responsive.css">
</head>`
        );
        
        res.set('Content-Type', 'text/html');
        res.set('Cache-Control', 'public, max-age=300');
        res.send(html);
    } catch (error) {
        console.error('Error serving about page:', error);
        res.status(500).send('Error loading page');
    }
});

// Academics page with SEO
router.get('/academics.html', injectSEOMiddleware('academics'), async (req, res) => {
    try {
        const htmlPath = path.join(__dirname, '../public/academics.html');
        let html = await fs.readFile(htmlPath, 'utf8');
        
        // Inject SEO meta tags
        const seoMetaTags = generateMetaTags(req.seoData);
        
        // Replace the head section
        html = html.replace(
            /<head>([\s\S]*?)<\/head>/,
            `<head>
    ${seoMetaTags}
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- Content Security Policy -->
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://unboxicons.com https://embed.tawk.to https://*.tawk.to https://cdn.jsdelivr.net https://cdnjs.cloudflare.com; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://unpkg.com https://cdn.jsdelivr.net https://embed.tawk.to https://*.tawk.to; script-src-attr 'unsafe-inline'; connect-src 'self' https://embed.tawk.to https://*.tawk.to wss://*.tawk.to https://unpkg.com https://cdnjs.cloudflare.com https://cdn.jsdelivr.net https://api.cloudinary.com https://res.cloudinary.com; frame-src 'self' https://embed.tawk.to https://*.tawk.to https://tawk.to https://www.google.com https://maps.google.com; img-src 'self' data: https: blob:; font-src 'self' https://fonts.gstatic.com https://unboxicons.com https://embed.tawk.to https://*.tawk.to;">
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
    
    <link rel="icon" type="image/x-icon" href="/images/favicon.ico">
    
    <!-- Stylesheets -->
    <link rel="stylesheet" href="/css/main.css">
    <link rel="stylesheet" href="/css/components.css">
    <link rel="stylesheet" href="/css/responsive.css">
</head>`
        );
        
        res.set('Content-Type', 'text/html');
        res.set('Cache-Control', 'public, max-age=300');
        res.send(html);
    } catch (error) {
        console.error('Error serving academics page:', error);
        res.status(500).send('Error loading page');
    }
});

// Contact page with SEO
router.get('/contact.html', injectSEOMiddleware('contact'), async (req, res) => {
    try {
        const htmlPath = path.join(__dirname, '../public/contact.html');
        let html = await fs.readFile(htmlPath, 'utf8');
        
        // Inject SEO meta tags
        const seoMetaTags = generateMetaTags(req.seoData);
        
        // Replace the head section
        html = html.replace(
            /<head>([\s\S]*?)<\/head>/,
            `<head>
    ${seoMetaTags}
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- Content Security Policy -->
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://unboxicons.com https://embed.tawk.to https://*.tawk.to https://cdn.jsdelivr.net https://cdnjs.cloudflare.com; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://unpkg.com https://cdn.jsdelivr.net https://embed.tawk.to https://*.tawk.to; script-src-attr 'unsafe-inline'; connect-src 'self' https://embed.tawk.to https://*.tawk.to wss://*.tawk.to https://unpkg.com https://cdnjs.cloudflare.com https://cdn.jsdelivr.net https://api.cloudinary.com https://res.cloudinary.com; frame-src 'self' https://embed.tawk.to https://*.tawk.to https://tawk.to https://www.google.com https://maps.google.com; img-src 'self' data: https: blob:; font-src 'self' https://fonts.gstatic.com https://unboxicons.com https://embed.tawk.to https://*.tawk.to;">
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
    
    <link rel="icon" type="image/x-icon" href="/images/favicon.ico">
    
    <!-- Stylesheets -->
    <link rel="stylesheet" href="/css/main.css">
    <link rel="stylesheet" href="/css/components.css">
    <link rel="stylesheet" href="/css/responsive.css">
</head>`
        );
        
        res.set('Content-Type', 'text/html');
        res.set('Cache-Control', 'public, max-age=300');
        res.send(html);
    } catch (error) {
        console.error('Error serving contact page:', error);
        res.status(500).send('Error loading page');
    }
});

// Gallery page with SEO
router.get('/gallery.html', injectSEOMiddleware('gallery'), async (req, res) => {
    try {
        const htmlPath = path.join(__dirname, '../public/gallery.html');
        let html = await fs.readFile(htmlPath, 'utf8');
        
        // Inject SEO meta tags
        const seoMetaTags = generateMetaTags(req.seoData);
        
        // Replace the head section
        html = html.replace(
            /<head>([\s\S]*?)<\/head>/,
            `<head>
    ${seoMetaTags}
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- Content Security Policy -->
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://unboxicons.com https://embed.tawk.to https://*.tawk.to https://cdn.jsdelivr.net https://cdnjs.cloudflare.com; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://unpkg.com https://cdn.jsdelivr.net https://embed.tawk.to https://*.tawk.to; script-src-attr 'unsafe-inline'; connect-src 'self' https://embed.tawk.to https://*.tawk.to wss://*.tawk.to https://unpkg.com https://cdnjs.cloudflare.com https://cdn.jsdelivr.net https://api.cloudinary.com https://res.cloudinary.com; frame-src 'self' https://embed.tawk.to https://*.tawk.to https://tawk.to https://www.google.com https://maps.google.com; img-src 'self' data: https: blob:; font-src 'self' https://fonts.gstatic.com https://unboxicons.com https://embed.tawk.to https://*.tawk.to;">
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
    
    <link rel="icon" type="image/x-icon" href="/images/favicon.ico">
    
    <!-- Stylesheets -->
    <link rel="stylesheet" href="/css/main.css">
    <link rel="stylesheet" href="/css/components.css">
    <link rel="stylesheet" href="/css/responsive.css">
</head>`
        );
        
        res.set('Content-Type', 'text/html');
        res.set('Cache-Control', 'public, max-age=300');
        res.send(html);
    } catch (error) {
        console.error('Error serving gallery page:', error);
        res.status(500).send('Error loading page');
    }
});

module.exports = router;
