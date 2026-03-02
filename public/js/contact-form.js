// ===== CONTACT FORM HANDLER =====

// Global form submission prevention for contact forms
document.addEventListener('submit', function(e) {
    if (e.target.classList.contains('contact-form')) {
        e.preventDefault();
        e.stopPropagation();
        
        // Try to find and call the ContactForm handleSubmit method
        if (window.contactFormInstance && typeof window.contactFormInstance.handleSubmit === 'function') {
            window.contactFormInstance.handleSubmit(e);
        } else {
            console.warn('ContactForm instance not found');
        }
        
        return false;
    }
});

class ContactForm {
    constructor() {
        this.form = null;
        this.isSubmitting = false; // Track submission state
        this.init();
    }

    init() {
        this.createContactForm();
        this.initEventListeners();
        this.initValidation();
    }

    createContactForm() {
        // Find all contact form containers
        const formContainers = document.querySelectorAll('.contact-form-column .contact-form-card');
        if (!formContainers.length) {
            return;
        }

        // Check if forms already exist and just need event listeners
        const existingForms = document.querySelectorAll('.contact-form');
        if (existingForms.length > 0) {
            return;
        }


        // Create the contact form HTML
        const formHTML = `
            <h3>Get in Touch</h3>
            <p class="form-subtitle">We'd love to hear from you</p>
            
            <form class="contact-form" novalidate>
                <div class="form-group">
                    <label for="full-name">Full name</label>
                    <span class="input-group">
                        <input type="text" id="full-name" name="full-name" placeholder="Enter your full name" required>
                    </span>
                    <div class="error-message" id="full-name-error"></div>
                </div>
                
                <div class="form-group">
                    <label for="email">Your email</label>
                    <span class="input-with-icon input-group">
                        <i data-lucide="mail"></i>
                        <input type="email" id="email" name="email" placeholder="Enter your email" required>
                    </span>
                    <div class="error-message" id="email-error"></div>
                </div>
                
                <div class="form-row number-group">
                    <div class="form-group">
                        <label for="country-code">Code</label>
                        <span class="input-group">
                            <select class="country-code" id="country-code" name="country-code">
                                <option value="+977">+977</option>
                                <option value="+91">+91</option>
                                <option value="+1">+1</option>
                            </select>
                        </span>
                    </div>
                    <div class="form-group">
                        <label for="phone">Phone number</label>
                        <span class="phone-input input-group">
                            <input type="tel" id="phone" name="phone" placeholder="98XXXXXXXX" maxlength="10" required>
                        </span>
                        <div class="error-message" id="phone-error"></div>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="message">How can we help?</label>
                    <span class="input-group">
                        <textarea id="message" name="message" rows="4" placeholder="Tell us about your inquiry..." maxlength="2000" required></textarea>
                    </span>
                    <div class="char-counter">0/2000</div>
                    <div class="error-message" id="message-error"></div>
                </div>
                
                <button type="submit" class="btn btn-primary btn-full">
                    Submit
                </button>
            </form>
            
            <p class="form-footer">
                By contacting us, you agree to our <a href="#">Terms of service</a> and <a href="#">Privacy Policy</a>
            </p>
        `;

        // Replace the content inside all form cards
        formContainers.forEach((container, index) => {
            
            // Find the form card within the container
            const formCard = container.querySelector('.contact-form-card') || container;
            formCard.innerHTML = formHTML;
            
            // Add protection against content being overwritten
            formCard.setAttribute('data-contact-form-protected', 'true');
            formCard.setAttribute('data-contact-form-index', index);
            
            // Make sure the container is visible
            container.style.display = 'block';
            container.style.opacity = '1';
            container.style.visibility = 'visible';
            
            // Monitor for content changes and restore if needed
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList') {
                        const currentContent = formCard.innerHTML.trim();
                        if (currentContent === '' || 
                            currentContent === '<!-- Contact form will be loaded dynamically by contact-form.js -->' ||
                            !currentContent.includes('contact-form')) {
                            setTimeout(() => {
                                formCard.innerHTML = formHTML;
                                formCard.setAttribute('data-contact-form-protected', 'true');
                            }, 100);
                        }
                    }
                });
            });
            
            observer.observe(formCard, { childList: true, subtree: true });
            
            // Periodic check to ensure forms stay visible (aggressive approach)
            setInterval(() => {
                const currentContent = formCard.innerHTML.trim();
                if (currentContent === '' || 
                    currentContent === '<!-- Contact form will be loaded dynamically by contact-form.js -->' ||
                    !currentContent.includes('contact-form')) {
                    formCard.innerHTML = formHTML;
                    formCard.setAttribute('data-contact-form-protected', 'true');
                }
            }, 5000); // Check every 5 seconds (less aggressive now)
            
            // Add unique IDs to each form to avoid conflicts
            const form = container.querySelector('.contact-form');
            const fullNameInput = container.querySelector('#full-name');
            const emailInput = container.querySelector('#email');
            const countryCodeSelect = container.querySelector('#country-code');
            const phoneInput = container.querySelector('#phone');
            const messageInput = container.querySelector('#message');
            const charCountSpan = container.querySelector('.char-counter');
            
            if (index > 0) {
                // Add index suffix to IDs to make them unique
                const suffix = `-${index}`;
                form.id = `contact-form${suffix}`;
                fullNameInput.id = `full-name${suffix}`;
                fullNameInput.name = `full-name${suffix}`;
                emailInput.id = `email${suffix}`;
                emailInput.name = `email${suffix}`;
                countryCodeSelect.id = `country-code${suffix}`;
                countryCodeSelect.name = `country-code${suffix}`;
                phoneInput.id = `phone${suffix}`;
                phoneInput.name = `phone${suffix}`;
                messageInput.id = `message${suffix}`;
                messageInput.name = `message${suffix}`;
                charCountSpan.id = `char-count${suffix}`;
            }
        });

        // Get reference to the first form (primary form)
        this.form = document.querySelector('.contact-form');

        // Initialize Lucide icons for the new content
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    initEventListeners() {
        // Add event listeners to all contact forms
        const forms = document.querySelectorAll('.contact-form');
        if (!forms.length) {
            return;
        }

        forms.forEach((form, index) => {

        // Add event listeners for real-time validation
            form.querySelectorAll('input, textarea').forEach(field => {
            field.addEventListener('blur', () => this.validateField(field));
            field.addEventListener('input', () => this.clearFieldError(field));
        });

            // Form submission is handled by the global event listener
            // No need for additional event listeners here
        });

        // Set the primary form reference for other methods
        this.form = forms[0];

        // Character counter for message textarea
        this.setupCharCounter();

        // FAQ email signup functionality
        this.setupFAQEmailSignup();
    }

    initValidation() {
        // Validation rules
        this.validationRules = {
            'full-name': {
                required: true,
                minLength: 2,
                maxLength: 100,
                pattern: /^[a-zA-Z\s]+$/
            },
            'email': {
                required: true,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            },
            'phone': {
                required: true,
                pattern: /^[6-9]\d{9}$/
            },
            'message': {
                required: true,
                minLength: 10,
                maxLength: 2000
            }
        };

        this.errorMessages = {
            'full-name': {
                required: 'Full name is required',
                minLength: 'Name must be at least 2 characters',
                maxLength: 'Name cannot exceed 100 characters',
                pattern: 'Name can only contain letters and spaces'
            },
            'email': {
                required: 'Email address is required',
                pattern: 'Please enter a valid email address'
            },
            'phone': {
                required: 'Phone number is required',
                pattern: 'Please enter a valid 10-digit phone number'
            },
            'message': {
                required: 'Message is required',
                minLength: 'Message must be at least 10 characters',
                maxLength: 'Message cannot exceed 2000 characters'
            }
        };
    }

    validateField(field) {
        const fieldName = field.name;
        const value = field.value.trim();
        const rules = this.validationRules[fieldName];
        
        if (!rules) return true;

        // Clear previous error
        this.clearFieldError(field);

        // Check required
        if (rules.required && !value) {
            this.showFieldError(field, this.errorMessages[fieldName].required);
            return false;
        }

        // Skip other validations if field is empty and not required
        if (!value && !rules.required) return true;

        // Check min length
        if (rules.minLength && value.length < rules.minLength) {
            this.showFieldError(field, this.errorMessages[fieldName].minLength);
            return false;
        }

        // Check max length
        if (rules.maxLength && value.length > rules.maxLength) {
            this.showFieldError(field, this.errorMessages[fieldName].maxLength);
            return false;
        }

        // Check pattern
        if (rules.pattern && !rules.pattern.test(value)) {
            this.showFieldError(field, this.errorMessages[fieldName].pattern);
            return false;
        }

        return true;
    }

    showFieldError(field, message) {
        field.classList.add('error');
        const errorElement = document.getElementById(`${field.name}-error`);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }

    clearFieldError(field) {
        field.classList.remove('error');
        const errorElement = document.getElementById(`${field.name}-error`);
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
    }

    validateForm() {
        const fields = this.form.querySelectorAll('input, textarea');
        let isValid = true;

        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        // Prevent duplicate submissions
        if (this.isSubmitting) {
            console.log('Form submission already in progress, ignoring duplicate');
            return;
        }
        
        this.isSubmitting = true;
        
        // Get the specific form that was submitted
        const submittedForm = e.target;
        
        // Temporarily set this.form to the submitted form for validation
        const originalForm = this.form;
        this.form = submittedForm;
        
        if (!this.validateForm()) {
            this.showToast('Please fix the errors before submitting', 'error');
            this.form = originalForm; // Restore original form reference
            this.isSubmitting = false; // Reset submission state
            return;
        }
        
        // Get form data from the submitted form
        const formData = new FormData(submittedForm);
        const data = Object.fromEntries(formData);
        
        // Show loading state
        const submitBtn = submittedForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent.trim();
        submitBtn.innerHTML = 'Sending...';
        submitBtn.disabled = true;
        
        let success = false;
        
        try {
            // Submit form to server
            const result = await this.submitContactForm(data);
            
            success = true;
            
            // Show success animation on button
            this.showSuccessAnimation(submitBtn);
            
            // Show success message from server
            this.showToast(result.message || 'Message sent successfully! We\'ll get back to you soon.', 'success');
            
            // Reset form
            submittedForm.reset();
            
            // Clear all error messages
            submittedForm.querySelectorAll('.error-message').forEach(error => {
                error.textContent = '';
                error.style.display = 'none';
            });
            
            // Reset character counter
            const counter = submittedForm.querySelector('.char-counter');
            if (counter) {
                counter.textContent = '0/2000';
                counter.style.color = 'var(--text-secondary)';
            }
            
            // Add form completion celebration
            this.showFormCompletionEffect();
            
        } catch (error) {
            console.error('Form submission error:', error);
            this.showToast('Failed to send message. Please try again.', 'error');
        } finally {
            // Reset submission state immediately
            this.isSubmitting = false;
            // Restore original form reference
            this.form = originalForm;
            
            // Reset button - delay on success to show animation, immediate on error
            if (success) {
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    // Reset any inline styles
                    submitBtn.style.background = '';
                    submitBtn.style.color = '';
                    submitBtn.style.transform = '';
                    submitBtn.style.boxShadow = '';
                }, 2100); // Slightly longer than the animation (2000ms)
            } else {
                // Reset immediately on error
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                submitBtn.style.background = '';
                submitBtn.style.color = '';
                submitBtn.style.transform = '';
                submitBtn.style.boxShadow = '';
            }
        }
    }

    async submitContactForm(data) {
        try {
            
            // Create AbortController for timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
            
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.message || 'Failed to send message');
            }
            
            return result;
        } catch (error) {
            console.error('Contact form submission error:', error);
            
            // Handle timeout specifically
            if (error.name === 'AbortError') {
                throw new Error('Request timed out. Please check your connection and try again.');
            }
            
            throw error;
        }
    }

    setupCharCounter() {
        // Setup character counter for all message textareas
        const textareas = document.querySelectorAll('#message, [id^="message-"]');
        
        textareas.forEach(textarea => {
            const counter = textarea.parentElement.querySelector('.char-counter');
            
            if (counter) {
            textarea.addEventListener('input', function() {
                const count = this.value.length;
                counter.textContent = `${count}/2000`;
                
                // Add visual feedback
                if (count > 1800) {
                    counter.style.color = 'var(--error-color)';
                } else if (count > 1500) {
                    counter.style.color = 'var(--warning-color)';
                } else {
                    counter.style.color = 'var(--text-secondary)';
                }
            });
        }
        });
    }

    setupFAQEmailSignup() {
        const emailInput = document.querySelector('.faq-email-signup input[type="email"]');
        const submitBtn = document.querySelector('.faq-email-signup .btn');
        
        if (emailInput && submitBtn) {
            // Add focus effects
            emailInput.addEventListener('focus', () => {
                emailInput.parentElement.style.borderColor = 'var(--primary-color)';
                emailInput.parentElement.style.boxShadow = '0 0 0 3px var(--primary-color-alpha)';
            });
            
            emailInput.addEventListener('blur', () => {
                emailInput.parentElement.style.borderColor = '';
                emailInput.parentElement.style.boxShadow = '';
            });
            
            // Add submit functionality
            submitBtn.addEventListener('click', (e) => {
                e.preventDefault();
                
                const email = emailInput.value.trim();
                if (!email || !this.isValidEmail(email)) {
                    // Add shake animation
                    submitBtn.style.animation = 'shake 0.5s ease-in-out';
                    setTimeout(() => {
                        submitBtn.style.animation = '';
                    }, 500);
                    return;
                }
                
                // Show success state
                submitBtn.innerHTML = '<i data-lucide="check"></i> Subscribed!';
                submitBtn.style.background = 'var(--success-color)';
                submitBtn.disabled = true;
                
                // Reset after 3 seconds
                setTimeout(() => {
                    submitBtn.innerHTML = 'Submit';
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                    emailInput.value = '';
                }, 3000);
            });
        }
        
        // Add shake animation CSS
        const style = document.createElement('style');
        style.textContent = `
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
            }
        `;
        document.head.appendChild(style);
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showSuccessAnimation(button) {
        // Add success styles to button
        button.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        button.style.color = 'white';
        button.innerHTML = '<span class="btn-success">✓ Message Sent!</span>';
        
        // Add celebration effect
        button.style.transform = 'scale(1.05)';
        button.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.4)';
        
        // Reset visual effects after animation (but not the text - that's handled by the finally block)
        setTimeout(() => {
            button.style.transform = 'scale(1)';
            button.style.boxShadow = '';
            button.style.background = '';
            button.style.color = '';
        }, 2000); // Show success message for 2 seconds
        
        // Add button success styles
        if (!document.getElementById('button-success-styles')) {
            const style = document.createElement('style');
            style.id = 'button-success-styles';
            style.textContent = `
                .btn-success {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    animation: successPulse 0.6s ease-out;
                }
                
                @keyframes successPulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                    100% { transform: scale(1); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    showFormCompletionEffect() {
        // Add a subtle glow effect to the form
        const formCard = document.querySelector('.contact-form-card');
        if (formCard) {
            formCard.style.transition = 'all 0.3s ease';
            formCard.style.boxShadow = '0 0 30px rgba(16, 185, 129, 0.3)';
            
            setTimeout(() => {
                formCard.style.boxShadow = '';
            }, 2000);
        }
        
        // Add floating celebration particles around the form
        this.createFloatingParticles();
    }

    createFloatingParticles() {
        const formCard = document.querySelector('.contact-form-card');
        if (!formCard) return;

        const particles = ['🎉', '✨', '💫', '⭐', '🌟'];
        const colors = ['#10b981', '#059669', '#34d399', '#6ee7b7', '#a7f3d0'];
        
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.innerHTML = particles[Math.floor(Math.random() * particles.length)];
            particle.style.position = 'absolute';
            particle.style.fontSize = '20px';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '1000';
            particle.style.opacity = '0';
            particle.style.transition = 'all 1.5s ease-out';
            
            // Random position around the form
            const rect = formCard.getBoundingClientRect();
            const x = rect.left + Math.random() * rect.width;
            const y = rect.top + Math.random() * rect.height;
            
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            
            document.body.appendChild(particle);
            
            // Animate particle
            setTimeout(() => {
                particle.style.opacity = '1';
                particle.style.transform = `translate(${(Math.random() - 0.5) * 200}px, ${(Math.random() - 0.5) * 200}px) scale(0)`;
            }, 100);
            
            // Remove particle
            setTimeout(() => {
                particle.remove();
            }, 1600);
        }
    }

    showToast(message, type = 'info') {
        // Remove any existing toasts
        const existingToasts = document.querySelectorAll('.toast');
        existingToasts.forEach(toast => toast.remove());

        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        // Enhanced success toast with celebration
        if (type === 'success') {
            toast.innerHTML = `
                <div class="toast-content">
                    <div class="toast-icon success-icon">
                        <i data-lucide="check-circle"></i>
                        <div class="success-particles"></div>
                    </div>
                    <div class="toast-message">
                        <div class="toast-title">🎉 Message Sent Successfully!</div>
                        <div class="toast-text">${message}</div>
                        <div class="toast-subtitle">Check your email for confirmation</div>
                    </div>
                    <button class="toast-close" onclick="this.parentElement.parentElement.remove()">
                        <i data-lucide="x"></i>
                    </button>
                </div>
                <div class="toast-progress"></div>
            `;
        } else {
            // Regular error/info toast
        toast.innerHTML = `
            <div class="toast-content">
                    <div class="toast-icon">
                        <i data-lucide="${type === 'error' ? 'alert-circle' : 'info'}"></i>
                    </div>
                    <div class="toast-message">
                        <div class="toast-title">${type === 'error' ? '⚠️ Error' : 'ℹ️ Info'}</div>
                        <div class="toast-text">${message}</div>
                    </div>
                    <button class="toast-close" onclick="this.parentElement.parentElement.remove()">
                        <i data-lucide="x"></i>
                    </button>
            </div>
                <div class="toast-progress"></div>
        `;
        }

        // Add to page
        document.body.appendChild(toast);

        // Add enhanced CSS for interactive toasts
        this.addToastStyles();

        // Show toast with animation
        setTimeout(() => toast.classList.add('show'), 100);

        // Auto-hide after 6 seconds for success, 5 seconds for others
        const hideDelay = type === 'success' ? 6000 : 5000;
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, hideDelay);

        // Initialize icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        // Add click-to-dismiss functionality
        toast.addEventListener('click', (e) => {
            if (!e.target.closest('.toast-close')) {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 300);
            }
        });

        // Add hover effects
        toast.addEventListener('mouseenter', () => {
            toast.querySelector('.toast-progress').style.animationPlayState = 'paused';
        });

        toast.addEventListener('mouseleave', () => {
            toast.querySelector('.toast-progress').style.animationPlayState = 'running';
        });
    }

    addToastStyles() {
        // Only add styles once
        if (document.getElementById('enhanced-toast-styles')) return;

        const style = document.createElement('style');
        style.id = 'enhanced-toast-styles';
        style.textContent = `
            /* Enhanced Toast Styles */
            .toast {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                max-width: 400px;
                background: white;
                border-radius: 12px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
                border: 1px solid rgba(0, 0, 0, 0.1);
                transform: translateX(100%) scale(0.8);
                opacity: 0;
                transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                overflow: hidden;
                cursor: pointer;
            }

            .toast.show {
                transform: translateX(0) scale(1);
                opacity: 1;
            }

            .toast-content {
                display: flex;
                align-items: flex-start;
                padding: 16px;
                gap: 12px;
            }

            .toast-icon {
                position: relative;
                flex-shrink: 0;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 20px;
                transition: transform 0.3s ease;
            }

            .toast:hover .toast-icon {
                transform: scale(1.1);
            }

            .toast-success .toast-icon {
                background: linear-gradient(135deg, #10b981, #059669);
                color: white;
            }

            .toast-error .toast-icon {
                background: linear-gradient(135deg, #ef4444, #dc2626);
                color: white;
            }

            .toast-info .toast-icon {
                background: linear-gradient(135deg, #3b82f6, #2563eb);
                color: white;
            }

            .toast-message {
                flex: 1;
                min-width: 0;
            }

            .toast-title {
                font-weight: 600;
                font-size: 14px;
                margin-bottom: 4px;
                color: #1f2937;
            }

            .toast-text {
                font-size: 13px;
                color: #6b7280;
                line-height: 1.4;
                margin-bottom: 2px;
            }

            .toast-subtitle {
                font-size: 12px;
                color: #9ca3af;
                font-style: italic;
            }

            .toast-close {
                background: none;
                border: none;
                color: #9ca3af;
                cursor: pointer;
                padding: 4px;
                border-radius: 4px;
                transition: all 0.2s ease;
                flex-shrink: 0;
            }

            .toast-close:hover {
                background: rgba(0, 0, 0, 0.1);
                color: #6b7280;
            }

            .toast-progress {
                position: absolute;
                bottom: 0;
                left: 0;
                height: 3px;
                background: linear-gradient(90deg, #10b981, #059669);
                border-radius: 0 0 12px 12px;
                animation: toastProgress 6s linear forwards;
            }

            .toast-error .toast-progress {
                background: linear-gradient(90deg, #ef4444, #dc2626);
                animation: toastProgress 5s linear forwards;
            }

            .toast-info .toast-progress {
                background: linear-gradient(90deg, #3b82f6, #2563eb);
                animation: toastProgress 5s linear forwards;
            }

            @keyframes toastProgress {
                from { width: 100%; }
                to { width: 0%; }
            }

            /* Success particles animation */
            .success-particles {
                position: absolute;
                width: 100%;
                height: 100%;
                pointer-events: none;
            }

            .success-particles::before,
            .success-particles::after {
                content: '';
                position: absolute;
                width: 4px;
                height: 4px;
                background: #10b981;
                border-radius: 50%;
                animation: particleFloat 1s ease-out forwards;
            }

            .success-particles::before {
                top: 10px;
                right: 10px;
                animation-delay: 0.2s;
            }

            .success-particles::after {
                top: 15px;
                right: 5px;
                animation-delay: 0.4s;
            }

            @keyframes particleFloat {
                0% {
                    opacity: 1;
                    transform: translate(0, 0) scale(1);
                }
                100% {
                    opacity: 0;
                    transform: translate(-20px, -20px) scale(0);
                }
            }

            /* Mobile responsiveness */
            @media (max-width: 480px) {
                .toast {
                    right: 10px;
                    left: 10px;
                    max-width: none;
                }
            }

            /* Dark mode support */
            @media (prefers-color-scheme: dark) {
                .toast {
                    background: #1f2937;
                    border-color: #374151;
                }

                .toast-title {
                    color: #f9fafb;
                }

                .toast-text {
                    color: #d1d5db;
                }

                .toast-subtitle {
                    color: #9ca3af;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize contact form function
function initializeContactForm() {
    // Prevent multiple initializations
    if (window.contactFormInstance) {
        console.log('ContactForm already initialized, skipping...');
        return;
    }
    
    // Add a small delay to ensure all content is loaded
    setTimeout(() => {
        try {
            window.contactFormInstance = new ContactForm();
        } catch (error) {
            console.error('❌ ContactForm: Initialization failed:', error);
        }
    }, 100);
    
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Immediate initialization attempt
initializeContactForm();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeContactForm);
} else {
    // DOM is already loaded
    initializeContactForm();
}

// Export for global use
window.ContactForm = ContactForm;
window.initializeContactForm = initializeContactForm;
