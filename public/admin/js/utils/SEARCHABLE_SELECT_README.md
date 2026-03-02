# Searchable Select Component

A lightweight, accessible searchable dropdown component for select elements with many options.

## Features

✅ **Search Functionality** - Filter options as you type
✅ **Keyboard Navigation** - Arrow keys, Enter, Escape support  
✅ **Icon Support** - Display emojis and icons in options
✅ **Responsive** - Works on mobile and desktop
✅ **Accessible** - Follows accessibility best practices
✅ **CSP Compliant** - No inline scripts or styles
✅ **Auto-initialization** - Prevents duplicate initialization
✅ **Smooth Animations** - Professional slide-down effect

## Usage

### Basic Usage

```javascript
// Initialize a single select
const selectElement = document.getElementById('my-select');
new SearchableSelect(selectElement);
```

### With Options

```javascript
new SearchableSelect(selectElement, {
    placeholder: 'Search categories...',
    noResultsText: 'No matching categories found',
    maxHeight: '300px'
});
```

### Initialize All Selects with a Class

```javascript
SearchableSelect.initializeAll('.searchable-select');
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `placeholder` | String | 'Search...' | Placeholder text for search input |
| `noResultsText` | String | 'No results found' | Message shown when no matches |
| `maxHeight` | String | '300px' | Maximum height of dropdown |

## Implementation in Events Loader

The searchable select is automatically initialized for category dropdowns in:

1. **Add Notice Modal** - Notice category selection
2. **Edit Notice Modal** - Notice category selection
3. **Add Event Modal** - Event category selection
4. **Edit Event Modal** - Event category selection

### Initialization Points

- `initializeSearchableSelects()` - Main initialization method
- Called after modal/page content is rendered
- Automatically detects and converts category selects

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| **↓** | Move to next option |
| **↑** | Move to previous option |
| **Enter** | Select highlighted option |
| **Escape** | Close dropdown |
| **Type** | Filter options |

## Methods

### Instance Methods

```javascript
const searchableSelect = new SearchableSelect(element);

searchableSelect.open();           // Open dropdown
searchableSelect.close();          // Close dropdown
searchableSelect.toggle();         // Toggle open/close
searchableSelect.updateDisplay();  // Refresh display
searchableSelect.destroy();        // Remove component
```

### Static Methods

```javascript
// Initialize all selects with a specific selector
const instances = SearchableSelect.initializeAll('.my-select');
```

## Styling

The component uses `public/admin/css/searchable-select.css` for styling.

### CSS Classes

- `.searchable-select-wrapper` - Main container
- `.searchable-select-display` - Display button
- `.searchable-select-dropdown` - Dropdown container
- `.searchable-select-search` - Search input
- `.searchable-select-options` - Options container
- `.searchable-select-option` - Individual option
- `.searchable-select-option.selected` - Selected option
- `.searchable-select-option.highlighted` - Keyboard-highlighted option

### Customization

To customize styling, override CSS classes in your stylesheet:

```css
.searchable-select-display {
    /* Custom display button styles */
}

.searchable-select-option.selected {
    background: #your-color;
}
```

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers

## Styling Notes

- **Light mode only** - Dark mode styles have been intentionally removed
- Always displays with light background for consistency
- Maintains clean, professional appearance across all themes

## Dependencies

- **Lucide Icons** - For chevron icons (already loaded in admin panel)
- None - Pure vanilla JavaScript!

## File Structure

```
public/admin/
├── css/
│   └── searchable-select.css          # Component styles
├── js/
│   └── utils/
│       ├── SearchableSelect.js        # Component logic
│       └── SEARCHABLE_SELECT_README.md # This file
└── index.html                          # Includes CSS & JS
```

## Example HTML

Before initialization:
```html
<select id="category-select" class="form-input">
    <option value="">Select Category</option>
    <option value="academic">📚 Academic</option>
    <option value="sports">⚽ Sports</option>
    <option value="cultural">🎭 Cultural</option>
</select>
```

After initialization:
```html
<div class="searchable-select-wrapper">
    <select id="category-select" style="display: none;">...</select>
    <button class="searchable-select-display">
        <span class="searchable-select-value">Select Category</span>
        <i data-lucide="chevron-down"></i>
    </button>
    <div class="searchable-select-dropdown">
        <input type="text" class="searchable-select-search" placeholder="Search...">
        <div class="searchable-select-options">
            <div class="searchable-select-option">📚 Academic</div>
            <div class="searchable-select-option">⚽ Sports</div>
            <div class="searchable-select-option">🎭 Cultural</div>
        </div>
    </div>
</div>
```

## Performance

- ✅ Lightweight (~8KB unminified)
- ✅ No external dependencies
- ✅ Efficient DOM manipulation
- ✅ Debounced search filtering
- ✅ Lazy initialization (won't reinitialize)

## Accessibility

- ✅ Keyboard navigation support
- ✅ ARIA attributes (planned for v2)
- ✅ Focus management
- ✅ Screen reader friendly

## Troubleshooting

### Searchable select not initializing

**Solution:** Ensure SearchableSelect.js is loaded before calling initialization:
```javascript
if (typeof SearchableSelect !== 'undefined') {
    new SearchableSelect(element);
}
```

### Multiple initializations

The component automatically prevents re-initialization by adding `searchable-select-initialized` class.

### Dropdown not showing

Check z-index conflicts. The dropdown uses `z-index: 1000`.

## Future Enhancements

- [ ] Multi-select support
- [ ] Grouped options
- [ ] ARIA attributes
- [ ] RTL language support
- [ ] Virtual scrolling for 1000+ options
- [ ] Option templates

---

**Version:** 1.0.0  
**Last Updated:** 2025-10-30  
**Author:** Gyan Jyoti School Admin Team

