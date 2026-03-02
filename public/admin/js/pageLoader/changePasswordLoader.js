/**
 * Change Password Manager
 * Handles dynamic loading and management of the change password section
 */
class ChangePasswordManager {
    constructor() {
        this.currentSection = 'change-password';
        this.init();
    }

    init() {
        this.bindEvents();
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Change password section click
        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-section="change-password"]')) {
                e.preventDefault();
                this.loadChangePassword();
            }
        });

        // Change password dropdown button click
        document.addEventListener('click', (e) => {
            if (e.target.closest('#changePasswordDropdownBtn')) {
                e.preventDefault();
                this.loadChangePassword();
            }
        });
    }

    /**
     * Load change password section dynamically
     */
    async loadChangePassword() {
        try {
            // Get change password content
            const content = this.getChangePasswordContent();
            
            // Inject content into page-content
            this.injectContent(content);
            
            // Initialize change password functionality
            this.initializeChangePassword();
            
            // Update navigation
            this.updateNavigation();
            
        } catch (error) {
            console.error('Error loading change password section:', error);
            this.showError('Failed to load change password section');
        }
    }

    /**
     * Get change password content HTML
     */
    getChangePasswordContent() {
        return `
            <section id="change-password-section" class="content-section active">
                <div class="page-header">
                    <div class="page-title">
                        <h1>Change Password</h1>
                        <p>Update your account password to keep it secure.</p>
                    </div>
                </div>

                <div class="change-password-container">
                    <div class="password-form-card">
                        <div class="form-header">
                            <h3>Update Password</h3>
                            <p>Enter your current password and choose a new secure password</p>
                        </div>

                        <form class="password-form" id="changePasswordForm">
                            <div class="form-group">
                                <label for="currentPassword">Current Password</label>
                                <div class="input-wrapper">
                                    <input type="password" id="currentPassword" name="currentPassword" placeholder="Enter your current password" required>
                                    <button type="button" class="toggle-btn" data-target="currentPassword">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="eye" class="lucide lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                    </button>
                                </div>
                            </div>

                            <div class="form-group">
                                <label for="newPassword">New Password</label>
                                <div class="input-wrapper">
                                    <input type="password" id="newPassword" name="newPassword" placeholder="Enter your new password" required>
                                    <button type="button" class="toggle-btn" data-target="newPassword">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="eye" class="lucide lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                    </button>
                                </div>
                                
                                <!-- Password Strength -->
                                <div class="password-strength" id="passwordStrength">
                                    <div class="strength-bar">
                                        <div class="strength-fill" id="strengthFill"></div>
                                    </div>
                                    <span class="strength-text" id="strengthText">Enter a password</span>
                                </div>
                            </div>

                            <div class="form-group">
                                <label for="confirmPassword">Confirm New Password</label>
                                <div class="input-wrapper">
                                    <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Confirm your new password" required>
                                    <button type="button" class="toggle-btn" data-target="confirmPassword">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="eye" class="lucide lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                    </button>
                                </div>
                                <div class="password-match" id="passwordMatch" style="display: none;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="check-circle" class="lucide lucide-check-circle"><path d="M21.801 10A10 10 0 1 1 17 3.335"></path><path d="m9 11 3 3L22 4"></path></svg>
                                    <span>Passwords match</span>
                                </div>
                            </div>

                            <!-- Password Requirements -->
                            <div class="password-requirements" id="passwordRequirements">
                                <h4>Password Requirements:</h4>
                                <ul>
                                    <li id="reqLength">At least 8 characters</li>
                                    <li id="reqUppercase">One uppercase letter (A-Z)</li>
                                    <li id="reqLowercase">One lowercase letter (a-z)</li>
                                    <li id="reqNumber">One number (0-9)</li>
                                    <li id="reqSpecial">One special character (!@#$%^&*)</li>
                                </ul>
                            </div>

                            <!-- Form Actions -->
                            <div class="form-actions">
                                <button type="button" class="btn btn-outline" id="cancelBtn">
                                    Cancel
                                </button>
                                <button type="submit" class="btn btn-primary" id="changePasswordBtn">
                                    <span class="btn-text">Change Password</span>
                                    <div class="btn-loading" style="display: none;">
                                        <div class="loading-spinner"></div>
                                        <span>Updating...</span>
                                    </div>
                                </button>
                            </div>
                        </form>
                    </div>

                    <!-- Security Tips -->
                    <div class="security-tips">
                        <h4>Security Tips</h4>
                        <ul>
                            <li>Use a strong, unique password</li>
                            <li>Don't reuse passwords from other accounts</li>
                            <li>Consider using a password manager</li>
                            <li>Change your password regularly</li>
                        </ul>
                    </div>
                </div>

                <!-- Success Modal -->
                <div class="success-modal" id="successModal" style="display: none;">
                    <div class="modal-overlay" id="successModalOverlay">
                        <div class="modal-content">
                            <div class="success-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="check-circle" class="lucide lucide-check-circle"><path d="M21.801 10A10 10 0 1 1 17 3.335"></path><path d="m9 11 3 3L22 4"></path></svg>
                            </div>
                            <h3>Password Changed Successfully!</h3>
                            <p>Your password has been updated successfully.</p>
                            <button class="btn btn-primary" id="loginBtn">
                                Continue
                            </button>
                        </div>
                    </div>
                </div>
                
                <style>
                .success-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 9999;
                }
                
                .success-modal .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.6);
                    backdrop-filter: blur(4px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                    z-index: 10000;
                }
                
                .success-modal .modal-content {
                    background: white;
                    border-radius: 16px;
                    padding: 2rem;
                    text-align: center;
                    max-width: 400px;
                    width: 100%;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                    animation: modalSlideIn 0.3s ease-out;
                }
                
                .success-modal .success-icon {
                    color: #10b981;
                    margin-bottom: 1rem;
                    display: flex;
                    justify-content: center;
                }
                
                .success-modal h3 {
                    margin: 0 0 0.5rem 0;
                    font-size: 1.25rem;
                    font-weight: 600;
                    color: #111827;
                }
                
                .success-modal p {
                    margin: 0 0 1.5rem 0;
                    color: #6b7280;
                    font-size: 0.875rem;
                    line-height: 1.5;
                }
                
                @keyframes modalSlideIn {
                    from {
                        opacity: 0;
                        transform: scale(0.9) translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                }
                </style>
            </section>
        `;
    }

    /**
     * Inject content into page-content element
     */
    injectContent(content) {
        const pageContent = document.getElementById('pageContent');
        
        if (pageContent) {
            pageContent.innerHTML = content;
            
            // Reinitialize Lucide icons after content injection
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        } else {
            console.error('pageContent element not found!');
        }
    }

    /**
     * Initialize change password functionality
     */
    initializeChangePassword() {
        this.bindFormEvents();
        this.initializePasswordValidation();
    }

    /**
     * Bind form events
     */
    bindFormEvents() {
        // Password toggle visibility
        document.querySelectorAll('.toggle-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const target = e.target.closest('.toggle-btn').dataset.target;
                const input = document.getElementById(target);
                const svg = e.target.closest('.toggle-btn').querySelector('svg');
                
                if (input.type === 'password') {
                    input.type = 'text';
                    svg.innerHTML = '<path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path><line x1="2" y1="2" x2="22" y2="22"></line>';
                    svg.setAttribute('data-lucide', 'eye-off');
                } else {
                    input.type = 'password';
                    svg.innerHTML = '<path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle>';
                    svg.setAttribute('data-lucide', 'eye');
                }
                
                // Reinitialize Lucide icons
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
            });
        });

        // Form submission
        const form = document.getElementById('changePasswordForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handlePasswordChange();
            });
        }

        // Cancel button
        const cancelBtn = document.getElementById('cancelBtn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                this.goBack();
            });
        }

        // Continue button in success modal
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn) {
            loginBtn.addEventListener('click', () => {
                this.closeSuccessModal();
            });
        }

        // Click outside modal to close
        const successModalOverlay = document.getElementById('successModalOverlay');
        if (successModalOverlay) {
            successModalOverlay.addEventListener('click', (e) => {
                if (e.target === successModalOverlay) {
                    this.closeSuccessModal();
                }
            });
        }

        // ESC key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const successModal = document.getElementById('successModal');
                if (successModal && successModal.style.display !== 'none') {
                    this.closeSuccessModal();
                }
            }
        });
    }

    /**
     * Initialize password validation
     */
    initializePasswordValidation() {
        const newPasswordInput = document.getElementById('newPassword');
        const confirmPasswordInput = document.getElementById('confirmPassword');
        
        if (newPasswordInput) {
            newPasswordInput.addEventListener('input', () => {
                this.validatePasswordStrength();
                this.checkPasswordMatch();
            });
        }

        if (confirmPasswordInput) {
            confirmPasswordInput.addEventListener('input', () => {
                this.checkPasswordMatch();
            });
        }
    }

    /**
     * Validate password strength
     */
    validatePasswordStrength() {
        const password = document.getElementById('newPassword').value;
        const strengthFill = document.getElementById('strengthFill');
        const strengthText = document.getElementById('strengthText');
        const requirements = document.querySelectorAll('.requirement-item');

        // Reset requirements
        requirements.forEach(req => {
            req.classList.remove('valid');
        });

        if (!password) {
            strengthFill.style.width = '0%';
            strengthText.textContent = 'Enter a password';
            strengthText.className = 'strength-text';
            return;
        }

        let strength = 0;
        let score = 0;

        // Check length
        if (password.length >= 8) {
            document.getElementById('reqLength').classList.add('valid');
            strength += 20;
        }

        // Check uppercase
        if (/[A-Z]/.test(password)) {
            document.getElementById('reqUppercase').classList.add('valid');
            strength += 20;
        }

        // Check lowercase
        if (/[a-z]/.test(password)) {
            document.getElementById('reqLowercase').classList.add('valid');
            strength += 20;
        }

        // Check numbers
        if (/\d/.test(password)) {
            document.getElementById('reqNumber').classList.add('valid');
            strength += 20;
        }

        // Check special characters
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            document.getElementById('reqSpecial').classList.add('valid');
            strength += 20;
        }

        // Update strength indicator
        strengthFill.style.width = `${strength}%`;
        
        if (strength < 40) {
            strengthText.textContent = 'Weak';
            strengthText.className = 'strength-text weak';
            strengthFill.className = 'strength-fill weak';
        } else if (strength < 80) {
            strengthText.textContent = 'Medium';
            strengthText.className = 'strength-text medium';
            strengthFill.className = 'strength-fill medium';
        } else {
            strengthText.textContent = 'Strong';
            strengthText.className = 'strength-text strong';
            strengthFill.className = 'strength-fill strong';
        }
    }

    /**
     * Check password match
     */
    checkPasswordMatch() {
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const matchIndicator = document.getElementById('passwordMatch');

        if (!confirmPassword) {
            matchIndicator.style.display = 'none';
            return;
        }

        if (newPassword === confirmPassword && newPassword) {
            matchIndicator.style.display = 'flex';
            matchIndicator.className = 'password-match valid';
            matchIndicator.querySelector('span').textContent = 'Passwords match';
        } else if (confirmPassword) {
            matchIndicator.style.display = 'flex';
            matchIndicator.className = 'password-match invalid';
            matchIndicator.querySelector('span').textContent = 'Passwords do not match';
        } else {
            matchIndicator.style.display = 'none';
        }
    }

    /**
     * Handle password change
     */
    async handlePasswordChange() {
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const submitBtn = document.getElementById('changePasswordBtn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');

        // Validation
        if (!currentPassword || !newPassword || !confirmPassword) {
            this.showNotification('error', 'Please fill in all fields');
            return;
        }

        if (newPassword !== confirmPassword) {
            this.showNotification('error', 'Passwords do not match');
            return;
        }

        // Check password strength
        const strengthFill = document.getElementById('strengthFill');
        const strength = parseInt(strengthFill.style.width) || 0;
        
        if (strength < 60) {
            this.showNotification('error', 'Please choose a stronger password');
            return;
        }

        // Show loading state
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoading.style.display = 'flex';

        try {
            // Make API call to change password
            const response = await fetch('/api/auth/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                },
                body: JSON.stringify({
                    currentPassword,
                    newPassword
                })
            });

            const result = await response.json();

            if (result.success) {
                // Show success modal
                this.showSuccessModal();
                
                // Clear form
                document.getElementById('changePasswordForm').reset();
                this.validatePasswordStrength(); // Reset strength indicator
                
                this.showNotification('success', 'Password changed successfully!');
            } else {
                this.showNotification('error', result.message || 'Failed to change password');
            }
            
        } catch (error) {
            console.error('Change password error:', error);
            this.showNotification('error', 'Failed to change password. Please try again.');
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            btnText.style.display = 'flex';
            btnLoading.style.display = 'none';
        }
    }

    /**
     * Go back
     */
    goBack() {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            // Load dashboard if no history
            if (window.dashboardManager) {
                window.dashboardManager.loadDashboard();
            }
        }
    }

    /**
     * Show success modal
     */
    showSuccessModal() {
        const successModal = document.getElementById('successModal');
        if (successModal) {
            successModal.style.display = 'block';
            // Prevent body scroll
            document.body.style.overflow = 'hidden';
            
            // Auto-close after 5 seconds
            setTimeout(() => {
                this.closeSuccessModal();
            }, 5000);
        }
    }

    /**
     * Close success modal
     */
    closeSuccessModal() {
        const successModal = document.getElementById('successModal');
        if (successModal) {
            successModal.style.display = 'none';
            // Restore body scroll
            document.body.style.overflow = '';
            // Go back to previous page or dashboard
            this.goBack();
        }
    }

    /**
     * Show notification
     */
    showNotification(type, message) {
        // Use unified notification system
        const title = type === 'success' ? 'Success' : type === 'error' ? 'Error' : 'Notification';
        window.NotificationManager.show(type, title, message);
    }

    /**
     * Update navigation state
     */
    updateNavigation() {
        // Remove active class from all nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to change password link
        const changePasswordLink = document.querySelector('[data-section="change-password"]');
        if (changePasswordLink) {
            changePasswordLink.classList.add('active');
        }
    }

    /**
     * Show error message
     */
    showError(message) {
        const pageContent = document.getElementById('pageContent');
        if (pageContent) {
            pageContent.innerHTML = `
                <div class="error-container">
                    <div class="error-icon">
                        <i data-lucide="alert-circle"></i>
                    </div>
                    <h3>Error</h3>
                    <p>${message}</p>
                    <button class="btn btn-primary" onclick="location.reload()">Reload Page</button>
                </div>
            `;
            
            // Reinitialize Lucide icons
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.changePasswordManager = new ChangePasswordManager();
});
