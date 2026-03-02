# CTA Component Documentation

## Overview

The CTA (Call-to-Action) component is a reusable JavaScript module that creates dynamic, customizable call-to-action sections for the Marigold School website. It supports loading content from APIs, custom styling, and multiple instances.

## Features

- ✅ **Dynamic Content Loading** - Load CTA content from APIs
- ✅ **Customizable Buttons** - Primary and secondary action buttons
- ✅ **Background Images** - Support for hero backgrounds
- ✅ **Multiple Instances** - Manage multiple CTAs on the same page
- ✅ **Loading States** - Built-in loading placeholders
- ✅ **Responsive Design** - Mobile-friendly layouts
- ✅ **Icon Support** - Lucide icons integration
- ✅ **Fallback Content** - Default content when API fails

## Basic Usage

### 1. Include the Script

```html
<script src="/js/components/cta.js"></script>
```

### 2. Create HTML Container

```html
<section class="cta-about section bg-primary text-white">
    <div id="cta-container">
        <!-- CTA content will be loaded here -->
    </div>
</section>
```

### 3. Initialize CTA

```javascript
// Basic CTA with default content
const cta = new CTAComponent();
cta.render('cta-container');
```

## Advanced Usage

### Custom CTA Configuration

```javascript
const cta = new CTAComponent({
    title: 'Join Our Community Today!',
    subtitle: 'Experience excellence in education and give your child the best start in life.',
    primaryButton: {
        text: 'Apply Now',
        url: '/apply.html',
        onclick: null
    },
    secondaryButton: {
        text: 'Schedule Visit',
        url: '/contact.html',
        onclick: null
    },
    backgroundImage: 'https://example.com/hero-bg.jpg',
    cssClass: 'cta-custom'
});
```

### Load from API

```javascript
const cta = new CTAComponent();
await cta.renderWithLoading('cta-container');
```

### Using CTAManager (Recommended)

```javascript
// Create and render in one step
window.CTAManager.render('about-cta', 'cta-container', {
    title: 'Discover Your Future',
    subtitle: 'Join our educational community',
    primaryButton: {
        text: 'Apply Now',
        onclick: 'openApplicationModal()'
    }
});

// Update existing CTA
window.CTAManager.update('about-cta', {
    title: 'Updated Title'
});
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `title` | String | 'Discover your Future' | Main CTA heading |
| `subtitle` | String | 'Join the Marigold School...' | Supporting text |
| `primaryButton` | Object | `{text: 'Apply Now', url: '#', onclick: 'openApplicationModal()'}` | Primary action button |
| `secondaryButton` | Object | `{text: 'Learn More', url: '/about'}` | Secondary action button |
| `backgroundImage` | String | null | Background image URL |
| `cssClass` | String | 'cta-about' | CSS class for styling |
| `containerId` | String | 'cta-container' | Target container ID |

## Button Configuration

### Primary Button

```javascript
primaryButton: {
    text: 'Apply Now',           // Button text
    url: '/apply.html',          // Link URL (if not using onclick)
    onclick: 'openModal()'       // JavaScript function (if not using URL)
}
```

### Secondary Button

```javascript
secondaryButton: {
    text: 'Learn More',          // Button text
    url: '/about.html',          // Link URL (if not using onclick)
    onclick: null                // JavaScript function (if not using URL)
}
```

## API Integration

The component automatically loads content from the about page API endpoint:

```javascript
// Load from default API endpoint
await cta.loadFromAPI();

// Load from custom endpoint
await cta.loadFromAPI('/api/custom/cta');
```

### Expected API Response

```json
{
    "success": true,
    "data": [{
        "title": "Discover your Future",
        "content": "Join the Marigold School community...",
        "imageUrl": "https://example.com/bg.jpg",
        "metadata": "{\"primaryButtonText\":\"Apply Now\",\"primaryButtonUrl\":\"/apply\"}"
    }]
}
```

## Styling

### CSS Classes

- `.cta-about` - Main CTA container
- `.cta-content` - Content wrapper
- `.cta-title` - Main heading
- `.cta-subtitle` - Supporting text
- `.cta-buttons` - Button container
- `.btn-white` - Primary button style
- `.btn-outline-white` - Secondary button style

### Loading States

```css
.cta-loading .cta-title-box {
    height: 40px;
    width: 400px;
    margin: 0 auto 1rem;
}
```

## Examples

### Homepage CTA

```javascript
window.CTAManager.render('homepage-cta', 'homepage-cta-container', {
    title: 'Welcome to Excellence',
    subtitle: 'Discover what makes us special',
    primaryButton: {
        text: 'Explore School',
        url: '/about.html'
    },
    secondaryButton: {
        text: 'View Gallery',
        url: '/gallery.html'
    }
});
```

### Application CTA

```javascript
window.CTAManager.render('apply-cta', 'apply-cta-container', {
    title: 'Ready to Apply?',
    subtitle: 'Start your journey with us today',
    primaryButton: {
        text: 'Start Application',
        onclick: 'openApplicationModal()'
    },
    secondaryButton: {
        text: 'Download Brochure',
        url: '/documents/brochure.pdf'
    }
});
```

### Contact CTA

```javascript
window.CTAManager.render('contact-cta', 'contact-cta-container', {
    title: 'Get in Touch',
    subtitle: 'We would love to hear from you',
    primaryButton: {
        text: 'Send Message',
        url: '#contact-form'
    },
    secondaryButton: {
        text: 'Call Us',
        onclick: 'window.location.href = \"tel:+1234567890\"'
    }
});
```

## Integration with About Page

The CTA component is automatically integrated with the about page loader:

```javascript
// In aboutPageLoader.js
renderCTASection() {
    // Load CTA data from API
    const ctaData = this.content?.cta || null;
    
    if (ctaData) {
        // Configure and render CTA
        window.CTAManager.render('about-cta', 'cta-container', {
            title: ctaData.title,
            subtitle: ctaData.content,
            // ... other options
        });
    }
}
```

## Error Handling

The component includes built-in error handling:

- **API Failures**: Falls back to default content
- **Missing Containers**: Logs warnings to console
- **Invalid Data**: Uses fallback values
- **Loading States**: Shows placeholders during load

## Browser Support

- ✅ Chrome 60+
- ✅ Firefox 60+
- ✅ Safari 12+
- ✅ Edge 79+

## Dependencies

- **Lucide Icons**: For button icons
- **Fetch API**: For loading content from APIs
- **ES6 Classes**: Modern JavaScript syntax

## Performance

- **Lazy Loading**: Content loads only when needed
- **Caching**: CTAManager caches instances
- **Minimal DOM**: Efficient HTML generation
- **Async Loading**: Non-blocking API calls

## Troubleshooting

### CTA Not Rendering

1. Check if container exists: `document.getElementById('cta-container')`
2. Verify script is loaded: `typeof window.CTAManager`
3. Check console for errors

### API Not Loading

1. Verify API endpoint is accessible
2. Check network tab for failed requests
3. Ensure API returns expected format

### Styling Issues

1. Check CSS classes are loaded
2. Verify container has proper structure
3. Inspect element for conflicting styles

## Contributing

To extend the CTA component:

1. Add new configuration options to constructor
2. Update `generateHTML()` method for new features
3. Add corresponding CSS styles
4. Update documentation

## License

Part of the Marigold School Website project.
