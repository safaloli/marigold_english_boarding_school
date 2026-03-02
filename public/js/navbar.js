// ===== NAVBAR COMPONENT =====

class Navbar {
    constructor() {
        this.currentPage = this.getCurrentPage();
        this.init();
    }

    getCurrentPage() {
        const path = window.location.pathname;
        if (path === '/' || path === '/index.html') return 'home';
        if (path.includes('academics')) return 'academics';
        if (path.includes('events')) return 'events';
        if (path.includes('gallery')) return 'gallery';
        if (path.includes('about')) return 'about';
        if (path.includes('contact')) return 'contact';
        if (path.includes('downloads')) return 'downloads';
        if (path.includes('components-demo')) return 'components';
        return 'home';
    }

    init() {
        this.createNavbar();
        this.initEventListeners();
        this.setActiveLink();
        this.loadSchoolSettings();
    }

    createNavbar() {
        const header = document.createElement('header');
        header.className = 'header';
        header.id = 'header';
        
        header.innerHTML = `
            <nav class="nav container">
                <a href="/" class="nav-logo" id="nav-logo">
                    <div class="logo-loading" id="logo-loading">
                        <div class="logo-skeleton"></div>
                        <div class="text-skeleton"></div>
                    </div>
                    <div class="logo-content" id="logo-content" style="display: none;">
                        <i data-lucide="graduation-cap" id="logo-icon"></i>
                    </div>
                </a>

                <div class="nav-menu" id="nav-menu">
                    <ul class="nav-list">
                        <li class="nav-item">
                            <a href="/" class="nav-link" data-page="home">Home</a>
                        </li>
                        <li class="nav-item">
                            <a href="/about" class="nav-link" data-page="about">About</a>
                        </li>
                        <li class="nav-item">
                            <a href="/academics" class="nav-link" data-page="academics">Academics</a>
                        </li>
                        <li class="nav-item">
                            <a href="/events" class="nav-link" data-page="events">Notices & Events</a>
                        </li>
                        <li class="nav-item">
                            <a href="/gallery" class="nav-link" data-page="gallery">Gallery</a>
                        </li>
                        <li class="nav-item">
                            <a href="/contact" class="nav-link" data-page="contact">Contact</a>
                        </li>
                        <li class="nav-item">
                            <a href="/downloads" class="nav-link" data-page="downloads">Downloads</a>
                        </li>
                        
                    </ul>
                </div>

                <div class="nav-actions">
                    <a href="/downloads#tab-content-container" class="enroll-btn" id="enroll-btn">
                        <span>View Results</span>
                    </a>
                    <button class="nav-toggle" id="nav-toggle" aria-label="Toggle navigation">
                        <i data-lucide="menu"></i>
                    </button>
                </div>
            </nav>
        `;

        // Insert at the beginning of the body
        document.body.insertBefore(header, document.body.firstChild);
    }

    async loadSchoolSettings() {
        try {
            // console.log('🏫 Loading school settings for navbar...');
            
            const response = await fetch('/api/school-settings');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            // console.log('📊 School settings response:', data);
            
            if (data.success) {
                this.updateNavbarLogo(data.schoolName, data.schoolNameSecond, data.schoolLogo);
            } else {
                console.error('❌ Failed to load school settings:', data.error);
                this.updateNavbarLogo('Marigold School', '', null);
            }
        } catch (error) {
            console.error('❌ Error loading school settings:', error);
            // Fallback to default values
            this.updateNavbarLogo('Marigold School', '', null);
        }
    }

    updateNavbarLogo(schoolName, schoolNameSecond, schoolLogo) {
        const logoLoading = document.getElementById('logo-loading');
        const logoContent = document.getElementById('logo-content');
        const logoIcon = document.getElementById('logo-icon');
        
        if (!logoLoading || !logoContent || !logoIcon) {
            console.error('❌ Logo elements not found');
            return;
        }
        
        // Update logo if available
        if (schoolLogo && schoolLogo.trim() !== '') {
            // If we have a logo URL, replace the icon with an image
            logoIcon.style.display = 'none';
            
            // Check if logo image already exists
            let logoImg = document.getElementById('logo-img');
            if (!logoImg) {
                logoImg = document.createElement('img');
                logoImg.id = 'logo-img';
                logoImg.className = 'school-logo';
                logoImg.alt = schoolName;
                logoIcon.parentNode.insertBefore(logoImg, logoIcon);
            }
            
            logoImg.src = schoolLogo;
            logoImg.onerror = () => {
                // If image fails to load, fallback to icon
                logoImg.style.display = 'none';
                logoIcon.style.display = 'inline';
            };
        } else {
            // No logo, use the default icon
            logoIcon.style.display = 'inline';
            const logoImg = document.getElementById('logo-img');
            if (logoImg) {
                logoImg.style.display = 'none';
            }
        }
        
        // Hide loading and show content
        logoLoading.style.display = 'none';
        logoContent.style.display = 'flex';
        
        // Reinitialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        // console.log('✅ Navbar logo updated:', { schoolName, schoolNameSecond, schoolLogo });
    }

    setActiveLink() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            const page = link.getAttribute('data-page');
            if (page === this.currentPage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    initEventListeners() {
        // Mobile menu toggle
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                document.body.classList.toggle('menu-open');
                
                // Update toggle button icon
                if (navMenu.classList.contains('active')) {
                    navToggle.innerHTML = `<i data-lucide="x"></i>`;
                } else {
                    navToggle.innerHTML = `<i data-lucide="menu"></i>`
                }
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
            });

            // Close menu when clicking on a link
            const navLinks = navMenu.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    navMenu.classList.remove('active');
                    document.body.classList.remove('menu-open');
                    
                    // Reset toggle button icon
                    const icon = navToggle.querySelector('i');
                    if (icon) {
                        icon.setAttribute('data-lucide', 'menu');
                        if (typeof lucide !== 'undefined') {
                            lucide.createIcons();
                        }
                    }
                });
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                    navMenu.classList.remove('active');
                    document.body.classList.remove('menu-open');
                    
                    // Reset toggle button icon
                    const icon = navToggle.querySelector('i');
                    if (icon) {
                        icon.setAttribute('data-lucide', 'menu');
                        if (typeof lucide !== 'undefined') {
                            lucide.createIcons();
                        }
                    }
                }
            });
        }

        // More dropdown functionality
        const moreDropdown = document.getElementById('more-dropdown');
        const moreDropdownMenu = document.getElementById('more-dropdown-menu');
        
        if (moreDropdown && moreDropdownMenu) {
            moreDropdown.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const isExpanded = moreDropdown.getAttribute('aria-expanded') === 'true';
                moreDropdown.setAttribute('aria-expanded', !isExpanded);
                moreDropdownMenu.classList.toggle('show');
                
                // Update dropdown icon
                const dropdownIcon = moreDropdown.querySelector('.dropdown-icon');
                if (dropdownIcon) {
                    dropdownIcon.setAttribute('data-lucide', isExpanded ? 'chevron-down' : 'chevron-up');
                    if (typeof lucide !== 'undefined') {
                        lucide.createIcons();
                    }
                }
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!moreDropdown.contains(e.target) && !moreDropdownMenu.contains(e.target)) {
                    moreDropdown.setAttribute('aria-expanded', 'false');
                    moreDropdownMenu.classList.remove('show');
                    
                    // Reset dropdown icon
                    const dropdownIcon = moreDropdown.querySelector('.dropdown-icon');
                    if (dropdownIcon) {
                        dropdownIcon.setAttribute('data-lucide', 'chevron-down');
                        if (typeof lucide !== 'undefined') {
                            lucide.createIcons();
                        }
                    }
                }
            });

            // Close dropdown when clicking on dropdown items
            const dropdownItems = moreDropdownMenu.querySelectorAll('.dropdown-link');
            dropdownItems.forEach(item => {
                item.addEventListener('click', () => {
                    moreDropdown.setAttribute('aria-expanded', 'false');
                    moreDropdownMenu.classList.remove('show');
                    
                    // Reset dropdown icon
                    const dropdownIcon = moreDropdown.querySelector('.dropdown-icon');
                    if (dropdownIcon) {
                        dropdownIcon.setAttribute('data-lucide', 'chevron-down');
                        if (typeof lucide !== 'undefined') {
                            lucide.createIcons();
                        }
                    }
                });
            });
        }

        // Theme toggle functionality (dropdown only)
        const themeToggleDropdown = document.getElementById('theme-toggle-dropdown');
        
        const toggleTheme = () => {
                const currentTheme = document.body.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                document.body.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
                
            // Update dropdown theme toggle
            if (themeToggleDropdown) {
                const icon = themeToggleDropdown.querySelector('.theme-icon');
                const text = themeToggleDropdown.querySelector('.theme-text');
                if (icon) {
                    icon.setAttribute('data-lucide', newTheme === 'dark' ? 'moon' : 'sun');
                    if (typeof lucide !== 'undefined') {
                        lucide.createIcons();
                    }
                }
                if (text) {
                    text.textContent = newTheme === 'dark' ? 'Dark Mode' : 'Light Mode';
                }
            }
        };
        
        if (themeToggleDropdown) {
            themeToggleDropdown.addEventListener('click', toggleTheme);
        }

        // Scroll effects
        let lastScrollTop = 0;
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const header = document.getElementById('header');
            
            // Add/remove scrolled class
            if (scrollTop > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            // Hide/show header on scroll
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                header.classList.add('header-hidden');
            } else {
                header.classList.remove('header-hidden');
            }
            
            lastScrollTop = scrollTop;
        });
    }
}

// Initialize navbar when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Navbar();
    
    // Initialize Lucide icons for navbar
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    // Add event listener for enroll button
    document.addEventListener('click', (e) => {
        if (e.target.closest('[data-action="open-application-modal"]')) {
            e.preventDefault();
            if (typeof window.openApplicationModal === 'function') {
                window.openApplicationModal();
            }
        }
    });

    // Add shaking animation functionality
    window.shakeEnrollButton = function() {
        const enrollBtn = document.getElementById('enroll-btn');
        if (enrollBtn) {
            enrollBtn.classList.add('shake');
            setTimeout(() => {
                enrollBtn.classList.remove('shake');
            }, 500);
        }
    };

    // Add continuous shaking animation
    window.toggleContinuousShake = function(enable = true) {
        const enrollBtn = document.getElementById('enroll-btn');
        if (enrollBtn) {
            if (enable) {
                enrollBtn.classList.add('continuous-shake');
            } else {
                enrollBtn.classList.remove('continuous-shake');
            }
        }
    };

    // Add pulse animation
    window.togglePulse = function(enable = true) {
        const enrollBtn = document.getElementById('enroll-btn');
        if (enrollBtn) {
            if (enable) {
                enrollBtn.classList.add('pulse');
            } else {
                enrollBtn.classList.remove('pulse');
            }
        }
    };

    // Add attention grabber animation (shake + pulse)
    window.toggleAttentionGrabber = function(enable = true) {
        const enrollBtn = document.getElementById('enroll-btn');
        if (enrollBtn) {
            if (enable) {
                enrollBtn.classList.add('attention-grabber');
            } else {
                enrollBtn.classList.remove('attention-grabber');
            }
        }
    };

    // Clear all animations
    window.clearEnrollAnimations = function() {
        const enrollBtn = document.getElementById('enroll-btn');
        if (enrollBtn) {
            enrollBtn.classList.remove('shake', 'continuous-shake', 'pulse', 'attention-grabber');
        }
    };

    // Auto-trigger shake animation every 10 seconds to draw attention
    setInterval(() => {
        const enrollBtn = document.getElementById('enroll-btn');
        if (enrollBtn && !enrollBtn.classList.contains('continuous-shake')) {
            window.shakeEnrollButton();
        }
    }, 10000); // Shake every 10 seconds
});

// Export for global use
window.Navbar = Navbar;
