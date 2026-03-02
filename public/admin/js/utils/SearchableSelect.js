/**
 * Searchable Select Component
 * Converts regular select elements into searchable dropdowns
 * Perfect for long lists like categories
 */

class SearchableSelect {
    constructor(selectElement, options = {}) {
        this.select = selectElement;
        this.options = {
            placeholder: options.placeholder || 'Search...',
            noResultsText: options.noResultsText || 'No results found',
            maxHeight: options.maxHeight || '300px',
            ...options
        };
        
        this.isOpen = false;
        this.selectedValue = this.select.value;
        this.filteredOptions = [];
        
        this.init();
    }

    init() {
        // Don't initialize if already initialized
        if (this.select.classList.contains('searchable-select-initialized')) {
            return;
        }

        this.createWrapper();
        this.createElements();
        this.bindEvents();
        this.select.classList.add('searchable-select-initialized');
        
        // Update display with current value
        this.updateDisplay();
    }

    createWrapper() {
        // Create wrapper
        this.wrapper = document.createElement('div');
        this.wrapper.className = 'searchable-select-wrapper';
        
        // Wrap the select element
        this.select.parentNode.insertBefore(this.wrapper, this.select);
        this.wrapper.appendChild(this.select);
        
        // Hide original select
        this.select.style.display = 'none';
    }

    createElements() {
        // Create display button
        this.displayButton = document.createElement('button');
        this.displayButton.type = 'button';
        this.displayButton.className = 'searchable-select-display form-input';
        this.displayButton.innerHTML = `
            <span class="searchable-select-value">Select an option</span>
            <i data-lucide="chevron-down" class="searchable-select-icon"></i>
        `;
        
        // Create dropdown container
        this.dropdown = document.createElement('div');
        this.dropdown.className = 'searchable-select-dropdown';
        this.dropdown.style.maxHeight = this.options.maxHeight;
        
        // Create search input
        this.searchInput = document.createElement('input');
        this.searchInput.type = 'text';
        this.searchInput.className = 'searchable-select-search';
        this.searchInput.placeholder = this.options.placeholder;
        
        // Create options container
        this.optionsContainer = document.createElement('div');
        this.optionsContainer.className = 'searchable-select-options';
        
        // Build dropdown
        this.dropdown.appendChild(this.searchInput);
        this.dropdown.appendChild(this.optionsContainer);
        
        // Add to wrapper
        this.wrapper.appendChild(this.displayButton);
        this.wrapper.appendChild(this.dropdown);
        
        // Populate options
        this.populateOptions();
        
        // Initialize icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    populateOptions() {
        this.optionsContainer.innerHTML = '';
        this.filteredOptions = [];
        
        const selectOptions = Array.from(this.select.options);
        
        selectOptions.forEach((option, index) => {
            if (option.value === '') return; // Skip placeholder option
            
            const optionElement = document.createElement('div');
            optionElement.className = 'searchable-select-option';
            optionElement.dataset.value = option.value;
            optionElement.dataset.index = index;
            optionElement.textContent = option.textContent.trim();
            
            if (option.value === this.selectedValue) {
                optionElement.classList.add('selected');
            }
            
            this.optionsContainer.appendChild(optionElement);
            this.filteredOptions.push(optionElement);
        });
    }

    bindEvents() {
        // Toggle dropdown
        this.displayButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.toggle();
        });

        // Search input
        this.searchInput.addEventListener('input', (e) => {
            this.filterOptions(e.target.value);
        });

        // Prevent dropdown close when clicking search input
        this.searchInput.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // Option selection
        this.optionsContainer.addEventListener('click', (e) => {
            const option = e.target.closest('.searchable-select-option');
            if (option) {
                this.selectOption(option.dataset.value);
            }
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!this.wrapper.contains(e.target)) {
                this.close();
            }
        });

        // Keyboard navigation
        this.searchInput.addEventListener('keydown', (e) => {
            this.handleKeyboard(e);
        });

        // Original select change (for programmatic updates)
        this.select.addEventListener('change', () => {
            this.selectedValue = this.select.value;
            this.updateDisplay();
        });
    }

    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        this.isOpen = true;
        this.wrapper.classList.add('open');
        this.dropdown.style.display = 'block';
        this.searchInput.value = '';
        this.filterOptions('');
        this.searchInput.focus();
        
        // Update chevron
        const icon = this.displayButton.querySelector('[data-lucide]');
        if (icon) {
            icon.setAttribute('data-lucide', 'chevron-up');
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }
    }

    close() {
        this.isOpen = false;
        this.wrapper.classList.remove('open');
        this.dropdown.style.display = 'none';
        
        // Update chevron
        const icon = this.displayButton.querySelector('[data-lucide]');
        if (icon) {
            icon.setAttribute('data-lucide', 'chevron-down');
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }
    }

    filterOptions(searchTerm) {
        const term = searchTerm.toLowerCase().trim();
        let hasResults = false;
        
        this.filteredOptions.forEach(option => {
            const text = option.textContent.toLowerCase();
            const matches = text.includes(term);
            
            option.style.display = matches ? 'block' : 'none';
            if (matches) hasResults = true;
        });

        // Show no results message
        let noResults = this.optionsContainer.querySelector('.no-results');
        if (!hasResults) {
            if (!noResults) {
                noResults = document.createElement('div');
                noResults.className = 'no-results';
                noResults.textContent = this.options.noResultsText;
                this.optionsContainer.appendChild(noResults);
            }
            noResults.style.display = 'block';
        } else {
            if (noResults) {
                noResults.style.display = 'none';
            }
        }
    }

    selectOption(value) {
        this.selectedValue = value;
        this.select.value = value;
        
        // Trigger change event on original select
        const event = new Event('change', { bubbles: true });
        this.select.dispatchEvent(event);
        
        this.updateDisplay();
        this.close();
    }

    updateDisplay() {
        const selectedOption = Array.from(this.select.options).find(opt => opt.value === this.selectedValue);
        const valueSpan = this.displayButton.querySelector('.searchable-select-value');
        
        if (selectedOption && selectedOption.value !== '') {
            valueSpan.textContent = selectedOption.textContent.trim();
            this.displayButton.classList.add('has-value');
        } else {
            valueSpan.textContent = this.select.options[0]?.textContent || 'Select an option';
            this.displayButton.classList.remove('has-value');
        }

        // Update selected class on options
        this.filteredOptions.forEach(option => {
            if (option.dataset.value === this.selectedValue) {
                option.classList.add('selected');
            } else {
                option.classList.remove('selected');
            }
        });
    }

    handleKeyboard(e) {
        const visibleOptions = this.filteredOptions.filter(opt => opt.style.display !== 'none');
        const currentIndex = visibleOptions.findIndex(opt => opt.classList.contains('highlighted'));

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                this.highlightOption(visibleOptions, currentIndex + 1);
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.highlightOption(visibleOptions, currentIndex - 1);
                break;
            case 'Enter':
                e.preventDefault();
                const highlighted = visibleOptions.find(opt => opt.classList.contains('highlighted'));
                if (highlighted) {
                    this.selectOption(highlighted.dataset.value);
                }
                break;
            case 'Escape':
                e.preventDefault();
                this.close();
                break;
        }
    }

    highlightOption(visibleOptions, index) {
        // Remove previous highlight
        this.filteredOptions.forEach(opt => opt.classList.remove('highlighted'));

        // Add new highlight
        if (index >= 0 && index < visibleOptions.length) {
            visibleOptions[index].classList.add('highlighted');
            visibleOptions[index].scrollIntoView({ block: 'nearest' });
        }
    }

    destroy() {
        // Remove wrapper and restore original select
        this.select.style.display = '';
        this.select.classList.remove('searchable-select-initialized');
        this.wrapper.parentNode.insertBefore(this.select, this.wrapper);
        this.wrapper.remove();
    }

    // Static method to initialize all searchable selects
    static initializeAll(selector = '.searchable-select') {
        const selects = document.querySelectorAll(selector);
        const instances = [];
        
        selects.forEach(select => {
            if (!select.classList.contains('searchable-select-initialized')) {
                instances.push(new SearchableSelect(select));
            }
        });
        
        return instances;
    }
}

// Export for use in other files
if (typeof window !== 'undefined') {
    window.SearchableSelect = SearchableSelect;
}

