// ===== APPLICATION MODAL HANDLER =====

class ApplicationModal {
    constructor() {
        this.modal = null;
        this.form = null;
        this.currentStep = 1;
        this.totalSteps = 3;
        this.init();
    }

    init() {
        this.createModal();
        this.initEventListeners();
    }

    createModal() {
        // Create modal HTML
        const modalHTML = `
            <div class="modal application-modal" id="applicationModal">
                <div class="modal-content application-modal-content">
                    <div class="modal-header">
                        <h2>Apply for Admission</h2>
                        <button class="modal-close" id="closeApplicationModal">
                            <i data-lucide="x"></i>
                        </button>
                    </div>
                    
                    <div class="modal-body">
                        <!-- Progress Indicator -->
                        <div class="form-progress">
                            <div class="progress-step active" data-step="1">
                                <div class="step-number">1</div>
                                <span>Basic Info</span>
                            </div>
                            <div class="progress-step" data-step="2">
                                <div class="step-number">2</div>
                                <span>Contact</span>
                            </div>
                            <div class="progress-step" data-step="3">
                                <div class="step-number">3</div>
                                <span>Review</span>
                            </div>
                        </div>
                        
                        <form class="application-form-content" id="applicationForm" novalidate>
                            <!-- Step 1: Basic Information -->
                            <div class="form-step active" data-step="1">
                                <div class="step-header">
                                    <h3>Student Information</h3>
                                    <p>Tell us about the student for applying admission</p>
                                </div>
                                
                                <div class="form-grid">
                                    <div class="form-group">
                                        <label for="firstName">First Name *</label>
                                        <span class="input-group">
                                            <input type="text" id="firstName" name="firstName" required>
                                        </span>
                                        <div class="error-message" id="firstName-error"></div>
                                    </div>
                                    <div class="form-group">
                                        <label for="lastName">Last Name *</label>
                                        <span class="input-group">
                                            <input type="text" id="lastName" name="lastName" required>
                                        </span>
                                        <div class="error-message" id="lastName-error"></div>
                                    </div>
                                    <div class="form-group">
                                        <label for="dateOfBirth">Date of Birth *</label>
                                        <span class="input-group">
                                            <input type="date" id="dateOfBirth" name="dateOfBirth" required>
                                        </span>
                                        <div class="error-message" id="dateOfBirth-error"></div>
                                    </div>
                                    <div class="form-group">
                                        <label for="gender">Gender *</label>
                                        <span class="input-group">
                                            <select id="gender" name="gender" required>
                                                <option value="">Select Gender</option>
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </span>
                                        <div class="error-message" id="gender-error"></div>
                                    </div>
                                    <div class="form-group">
                                        <label for="grade">Grade Applying For *</label>
                                        <span class="input-group">
                                            <select id="grade" name="grade" required>
                                                <option value="">Select Grade</option>
                                                <optgroup label="Pre-Primary">
                                                    <option value="nursery">Nursery</option>
                                                    <option value="lkg">LKG</option>
                                                    <option value="ukg">UKG</option>
                                                </optgroup>
                                                <optgroup label="Primary (Classes 1-5)">
                                                    <option value="1">Class I</option>
                                                    <option value="2">Class II</option>
                                                    <option value="3">Class III</option>
                                                    <option value="4">Class IV</option>
                                                    <option value="5">Class V</option>
                                                </optgroup>
                                                <optgroup label="Middle (Classes 6-8)">
                                                    <option value="6">Class VI</option>
                                                    <option value="7">Class VII</option>
                                                    <option value="8">Class VIII</option>
                                                </optgroup>
                                                <optgroup label="Secondary (Classes 9-12)">
                                                    <option value="9">Class IX</option>
                                                    <option value="10">Class X</option>
                                                    <option value="11">Class XI</option>
                                                    <option value="12">Class XII</option>
                                                </optgroup>
                                            </select>
                                        </span>
                                        <div class="error-message" id="grade-error"></div>
                                    </div>
                                    <div class="form-group">
                                        <label for="currentSchool">Current School (if any)</label>
                                        <span class="input-group">
                                            <input type="text" id="currentSchool" name="currentSchool" placeholder="Name of current school">
                                        </span>
                                    </div>
                                </div>
                                
                                <div class="step-actions">
                                    <button type="button" class="btn btn-primary btn-large next-step">
                                        Next Step
                                        <i data-lucide="arrow-right"></i>
                                    </button>
                                </div>
                            </div>

                            <!-- Step 2: Contact Information -->
                            <div class="form-step" data-step="2">
                                <div class="step-header">
                                    <h3>Contact Information</h3>
                                    <p>Parent/Guardian contact details and address</p>
                                </div>
                                
                                <div class="form-grid">
                                    <div class="form-group">
                                        <label for="parentName">Parent/Guardian Name *</label>
                                        <span class="input-group">
                                            <input type="text" id="parentName" name="parentName" required>
                                        </span>
                                        <div class="error-message" id="parentName-error"></div>
                                    </div>
                                    <div class="form-group">
                                        <label for="parentPhone">Phone Number *</label>
                                        <span class="input-group">
                                            <input type="tel" id="parentPhone" name="parentPhone" required>
                                        </span>
                                        <div class="error-message" id="parentPhone-error"></div>
                                    </div>
                                    <div class="form-group">
                                        <label for="parentEmail">Email Address *</label>
                                        <span class="input-group">
                                            <input type="email" id="parentEmail" name="parentEmail" required>
                                        </span>
                                        <div class="error-message" id="parentEmail-error"></div>
                                    </div>
                                    <div class="form-group">
                                        <label for="parentOccupation">Occupation</label>
                                        <span class="input-group">
                                            <input type="text" id="parentOccupation" name="parentOccupation" placeholder="e.g., Engineer, Teacher, Business">
                                        </span>
                                    </div>
                                </div>
                                
                                <div class="form-group">
                                    <label for="address">Complete Address *</label>
                                    <span class="input-group">
                                        <textarea id="address" name="address" rows="3" required placeholder="Enter your complete residential address"></textarea>
                                    </span>
                                    <div class="error-message" id="address-error"></div>
                                </div>
                                
                                <div class="form-grid">
                                    <div class="form-group">
                                        <label for="city">City *</label>
                                        <span class="input-group">
                                            <input type="text" id="city" name="city" required>
                                        </span>
                                        <div class="error-message" id="city-error"></div>
                                    </div>
                                    <div class="form-group">
                                        <label for="state">State *</label>
                                        <span class="input-group">
                                            <input type="text" id="state" name="state" required>
                                        </span>
                                        <div class="error-message" id="state-error"></div>
                                    </div>
                                    <div class="form-group">
                                        <label for="pincode">Pincode *</label>
                                        <span class="input-group">
                                            <input type="text" id="pincode" name="pincode" required pattern="[0-9]{6}">
                                        </span>
                                        <div class="error-message" id="pincode-error"></div>
                                    </div>
                                </div>
                                
                                <div class="step-actions">
                                    <button type="button" class="btn btn-outline btn-large prev-step">
                                        <i data-lucide="arrow-left"></i>
                                        Previous
                                    </button>
                                    <button type="button" class="btn btn-primary btn-large next-step">
                                        Next Step
                                        <i data-lucide="arrow-right"></i>
                                    </button>
                                </div>
                            </div>

                            <!-- Step 3: Review & Submit -->
                            <div class="form-step" data-step="3">
                                <div class="step-header">
                                    <h3>Review & Submit</h3>
                                    <p>Please review your information and agree to our terms</p>
                                </div>
                                
                                <div class="review-summary">
                                    <div class="review-section">
                                        <h4>Student Information</h4>
                                        <div class="review-item">
                                            <span class="label">Name:</span>
                                            <span class="value" id="review-name"></span>
                                        </div>
                                        <div class="review-item">
                                            <span class="label">Date of Birth:</span>
                                            <span class="value" id="review-dob"></span>
                                        </div>
                                        <div class="review-item">
                                            <span class="label">Grade:</span>
                                            <span class="value" id="review-grade"></span>
                                        </div>
                                    </div>
                                    
                                    <div class="review-section">
                                        <h4>Contact Information</h4>
                                        <div class="review-item">
                                            <span class="label">Parent Name:</span>
                                            <span class="value" id="review-parent"></span>
                                        </div>
                                        <div class="review-item">
                                            <span class="label">Phone:</span>
                                            <span class="value" id="review-phone"></span>
                                        </div>
                                        <div class="review-item">
                                            <span class="label">Email:</span>
                                            <span class="value" id="review-email"></span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="form-group checkbox-group">
                                    <label class="checkbox-label">
                                        <input type="checkbox" id="termsAccepted" name="termsAccepted" required>
                                        <span class="checkmark"></span>
                                        I agree to the <a href="#" target="_blank">Terms and Conditions</a> and <a href="#" target="_blank">Privacy Policy</a> *
                                    </label>
                                    <div class="error-message" id="terms-error"></div>
                                </div>
                                
                                <div class="form-group checkbox-group">
                                    <label class="checkbox-label">
                                        <input type="checkbox" id="newsletter" name="newsletter">
                                        <span class="checkmark"></span>
                                        I would like to receive updates and newsletters from Marigold School
                                    </label>
                                </div>
                                
                                <div class="step-actions">
                                    <button type="button" class="btn btn-outline btn-large prev-step">
                                        <i data-lucide="arrow-left"></i>
                                        Previous
                                    </button>
                                    <button type="submit" class="btn btn-primary btn-large">
                                        <i data-lucide="send"></i>
                                        Submit Application
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <!-- Success Modal -->
            <div class="modal" id="successModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <div class="success-icon">
                            <i data-lucide="check-circle"></i>
                        </div>
                        <h3>Application Submitted!</h3>
                    </div>
                    <div class="modal-body">
                        <p>Thank you for your application. We have received your submission and will review it within 48 hours.</p>
                        <p>You will receive a confirmation email shortly with further instructions.</p>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-primary" id="closeSuccessModalBtn">Close</button>
                    </div>
                </div>
            </div>
        `;

        // Add modal to body
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Get references
        this.modal = document.getElementById('applicationModal');
        this.form = document.getElementById('applicationForm');
        
        // Add direct close button event listener
        const closeBtn = document.getElementById('closeApplicationModal');
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeModal();
            });
        }
        
        // Add success modal close button event listener
        const successCloseBtn = document.getElementById('closeSuccessModalBtn');
        if (successCloseBtn) {
            successCloseBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeSuccessModal();
            });
        }
        
        // Initialize form functionality
        this.initForm();
    }

    initForm() {
        this.initValidation();
        this.setupDateConstraints();
        this.initFormEventListeners();
    }

    initFormEventListeners() {
        // Next step buttons
        this.form.querySelectorAll('.next-step').forEach(button => {
            button.addEventListener('click', () => this.nextStep());
        });

        // Previous step buttons
        this.form.querySelectorAll('.prev-step').forEach(button => {
            button.addEventListener('click', () => this.prevStep());
        });

        // Form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Real-time validation and button state management
        this.form.querySelectorAll('input, select, textarea').forEach(field => {
            field.addEventListener('blur', () => this.validateField(field));
            field.addEventListener('input', () => {
                this.clearFieldError(field);
                this.updateNextButtonState();
            });
            field.addEventListener('change', () => this.updateNextButtonState());
        });

        // Progress step clicks
        this.form.querySelectorAll('.progress-step').forEach(step => {
            step.addEventListener('click', () => {
                const stepNumber = parseInt(step.dataset.step);
                this.goToStep(stepNumber);
            });
        });

        // Initial button state
        this.updateNextButtonState();
    }

    initEventListeners() {
        // Open modal when Apply Now buttons are clicked
        document.addEventListener('click', (e) => {
            if (e.target.matches('.btn-primary') && e.target.textContent.includes('Apply Now')) {
                e.preventDefault();
                this.openModal();
            }
        });

        // Close modal events - use more specific selectors
        document.addEventListener('click', (e) => {
            // Close application modal
            if (e.target.closest('#closeApplicationModal')) {
                e.preventDefault();
                this.closeModal();
            }
            // Close success modal
            if (e.target.closest('#closeSuccessModalBtn')) {
                e.preventDefault();
                this.closeSuccessModal();
            }
        });

        // Close modal on backdrop click
        document.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });

        // Close modal on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal && this.modal.classList.contains('show')) {
                this.closeModal();
            }
        });
    }

    openModal() {
        this.modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = '0px';
        this.resetForm();
    }

    closeModal() {
        if (this.modal) {
            this.modal.classList.remove('show');
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
            this.resetForm();
        }
    }

    closeSuccessModal() {
        const successModal = document.getElementById('successModal');
        successModal.classList.remove('show');
        document.body.style.overflow = '';
        this.closeModal(); // Also close the application modal
    }

    resetForm() {
        this.currentStep = 1;
        this.form.reset();
        this.updateStepDisplay();
        
        // Clear all errors
        this.form.querySelectorAll('.error').forEach(field => {
            field.classList.remove('error');
        });
        this.form.querySelectorAll('.error-message').forEach(error => {
            error.textContent = '';
            error.style.display = 'none';
        });
    }

    // Include all the validation and form handling methods from the original ApplicationForm class
    initValidation() {
        this.validationRules = {
            firstName: {
                required: true,
                minLength: 2,
                maxLength: 50,
                pattern: /^[a-zA-Z\s]+$/
            },
            lastName: {
                required: true,
                minLength: 2,
                maxLength: 50,
                pattern: /^[a-zA-Z\s]+$/
            },
            dateOfBirth: {
                required: true,
                custom: (value) => this.validateDateOfBirth(value)
            },
            gender: {
                required: true
            },
            grade: {
                required: true
            },
            parentName: {
                required: true,
                minLength: 2,
                maxLength: 100,
                pattern: /^[a-zA-Z\s]+$/
            },
            parentPhone: {
                required: true,
                pattern: /^[6-9]\d{9}$/
            },
            parentEmail: {
                required: true,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            },
            address: {
                required: true,
                minLength: 10
            },
            city: {
                required: true,
                minLength: 2
            },
            state: {
                required: true,
                minLength: 2
            },
            pincode: {
                required: true,
                pattern: /^[1-9][0-9]{5}$/
            }
        };

        this.errorMessages = {
            firstName: {
                required: 'First name is required',
                minLength: 'First name must be at least 2 characters',
                maxLength: 'First name cannot exceed 50 characters',
                pattern: 'First name can only contain letters and spaces'
            },
            lastName: {
                required: 'Last name is required',
                minLength: 'Last name must be at least 2 characters',
                maxLength: 'Last name cannot exceed 50 characters',
                pattern: 'Last name can only contain letters and spaces'
            },
            dateOfBirth: {
                required: 'Date of birth is required',
                custom: 'Student must be between 3 and 18 years old'
            },
            gender: {
                required: 'Please select a gender'
            },
            grade: {
                required: 'Please select a grade'
            },
            parentName: {
                required: 'Parent/Guardian name is required',
                minLength: 'Name must be at least 2 characters',
                maxLength: 'Name cannot exceed 100 characters',
                pattern: 'Name can only contain letters and spaces'
            },
            parentPhone: {
                required: 'Phone number is required',
                pattern: 'Please enter a valid 10-digit phone number'
            },
            parentEmail: {
                required: 'Email address is required',
                pattern: 'Please enter a valid email address'
            },
            address: {
                required: 'Address is required',
                minLength: 'Address must be at least 10 characters'
            },
            city: {
                required: 'City is required',
                minLength: 'City must be at least 2 characters'
            },
            state: {
                required: 'State is required',
                minLength: 'State must be at least 2 characters'
            },
            pincode: {
                required: 'Pincode is required',
                pattern: 'Please enter a valid 6-digit pincode'
            }
        };
    }

    setupDateConstraints() {
        const dateInput = document.getElementById('dateOfBirth');
        if (dateInput) {
            const today = new Date();
            const minDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
            const maxDate = new Date(today.getFullYear() - 3, today.getMonth(), today.getDate());
            
            dateInput.max = maxDate.toISOString().split('T')[0];
            dateInput.min = minDate.toISOString().split('T')[0];
        }
    }

    validateDateOfBirth(value) {
        if (!value) return false;
        
        const birthDate = new Date(value);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        
        return age >= 3 && age <= 18;
    }

    validateField(field) {
        const fieldName = field.name;
        const value = field.value.trim();
        const rules = this.validationRules[fieldName];
        
        if (!rules) return true;

        this.clearFieldError(field);

        if (rules.required && !value) {
            this.showFieldError(field, this.errorMessages[fieldName].required);
            return false;
        }

        if (!value && !rules.required) return true;

        if (rules.minLength && value.length < rules.minLength) {
            this.showFieldError(field, this.errorMessages[fieldName].minLength);
            return false;
        }

        if (rules.maxLength && value.length > rules.maxLength) {
            this.showFieldError(field, this.errorMessages[fieldName].maxLength);
            return false;
        }

        if (rules.pattern && !rules.pattern.test(value)) {
            this.showFieldError(field, this.errorMessages[fieldName].pattern);
            return false;
        }

        if (rules.custom && !rules.custom(value)) {
            this.showFieldError(field, this.errorMessages[fieldName].custom);
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

    validateStep(step) {
        const stepElement = document.querySelector(`[data-step="${step}"]`);
        const fields = stepElement.querySelectorAll('input, select, textarea');
        let isValid = true;

        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    nextStep() {
        if (this.validateStep(this.currentStep)) {
            if (this.currentStep < this.totalSteps) {
                this.currentStep++;
                this.updateStepDisplay();
            }
        } else {
            this.showStepError();
        }
    }

    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateStepDisplay();
        }
    }

    goToStep(step) {
        if (step <= this.currentStep) {
            this.currentStep = step;
            this.updateStepDisplay();
        }
    }

    updateStepDisplay() {
        document.querySelectorAll('.form-step').forEach(step => {
            step.classList.remove('active');
        });
        document.querySelector(`.form-step[data-step="${this.currentStep}"]`).classList.add('active');

        document.querySelectorAll('.progress-step').forEach(step => {
            step.classList.remove('active', 'completed');
        });

        for (let i = 1; i <= this.totalSteps; i++) {
            const stepElement = document.querySelector(`.progress-step[data-step="${i}"]`);
            if (i < this.currentStep) {
                stepElement.classList.add('completed');
            } else if (i === this.currentStep) {
                stepElement.classList.add('active');
            }
        }

        if (this.currentStep === 3) {
            this.updateReviewData();
        }

        this.updateNextButtonState();
    }

    updateNextButtonState() {
        const currentStepElement = document.querySelector(`.form-step[data-step="${this.currentStep}"]`);
        const nextButton = currentStepElement.querySelector('.next-step');
        
        if (!nextButton) return;

        const requiredFields = currentStepElement.querySelectorAll('input[required], select[required], textarea[required]');
        let allFieldsFilled = true;
        let hasErrors = false;

        requiredFields.forEach(field => {
            const value = field.value.trim();
            if (!value) {
                allFieldsFilled = false;
            }
        });

        const errorMessages = currentStepElement.querySelectorAll('.error-message');
        errorMessages.forEach(error => {
            if (error.style.display === 'block' && error.textContent.trim() !== '') {
                hasErrors = true;
            }
        });

        const fieldsWithErrors = currentStepElement.querySelectorAll('.error');
        if (fieldsWithErrors.length > 0) {
            hasErrors = true;
        }

        if (allFieldsFilled && !hasErrors) {
            nextButton.disabled = false;
            nextButton.classList.remove('disabled');
        } else {
            nextButton.disabled = true;
            nextButton.classList.add('disabled');
        }
    }

    updateReviewData() {
        const formData = new FormData(this.form);
        
        const firstName = formData.get('firstName') || '';
        const lastName = formData.get('lastName') || '';
        document.getElementById('review-name').textContent = `${firstName} ${lastName}`.trim();
        
        const dob = formData.get('dateOfBirth') || '';
        document.getElementById('review-dob').textContent = dob ? new Date(dob).toLocaleDateString() : '';
        
        const grade = formData.get('grade') || '';
        const gradeText = this.getGradeText(grade);
        document.getElementById('review-grade').textContent = gradeText;
        
        document.getElementById('review-parent').textContent = formData.get('parentName') || '';
        document.getElementById('review-phone').textContent = formData.get('parentPhone') || '';
        document.getElementById('review-email').textContent = formData.get('parentEmail') || '';
    }

    getGradeText(grade) {
        const gradeMap = {
            'nursery': 'Nursery',
            'lkg': 'LKG',
            'ukg': 'UKG',
            '1': 'Class I',
            '2': 'Class II',
            '3': 'Class III',
            '4': 'Class IV',
            '5': 'Class V',
            '6': 'Class VI',
            '7': 'Class VII',
            '8': 'Class VIII',
            '9': 'Class IX',
            '10': 'Class X',
            '11': 'Class XI',
            '12': 'Class XII'
        };
        return gradeMap[grade] || grade;
    }

    showStepError() {
        const firstError = document.querySelector('.error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        this.showToast('Please fix the errors before proceeding', 'error');
    }

    async handleSubmit(e) {
        e.preventDefault();

        const termsAccepted = document.getElementById('termsAccepted').checked;
        if (!termsAccepted) {
            this.showFieldError(document.getElementById('termsAccepted'), 'You must accept the terms and conditions');
            this.showToast('Please accept the terms and conditions', 'error');
            return;
        }

        for (let step = 1; step <= this.totalSteps; step++) {
            if (!this.validateStep(step)) {
                this.currentStep = step;
                this.updateStepDisplay();
                this.showToast('Please fix all errors before submitting', 'error');
                return;
            }
        }

        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i data-lucide="loader-2" class="animate-spin"></i> Submitting...';
        submitBtn.disabled = true;

        try {
            const formData = new FormData(this.form);
            const data = Object.fromEntries(formData.entries());

            const result = await this.submitApplication(data);
            this.showSuccessModal(result);

        } catch (error) {
            console.error('Submission error:', error);
            this.showToast('Failed to submit application. Please try again.', 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    async submitApplication(data) {
        console.log('📝 Submitting application data:', data);
        
        try {
            const response = await fetch('/api/admission/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstName: data.firstName,
                    lastName: data.lastName,
                    dateOfBirth: data.dateOfBirth,
                    gender: data.gender,
                    grade: data.grade,
                    currentSchool: data.currentSchool || null,
                    parentName: data.parentName,
                    parentPhone: data.parentPhone,
                    parentEmail: data.parentEmail,
                    parentOccupation: data.parentOccupation || null,
                    address: data.address,
                    city: data.city,
                    state: data.state,
                    pincode: data.pincode,
                    termsAccepted: data.termsAccepted === 'on' || data.termsAccepted === true,
                    newsletter: data.newsletter === 'on' || data.newsletter === true
                })
            });

            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.message || 'Failed to submit application');
            }

            console.log('✅ Application submitted successfully:', result);
            return result;

        } catch (error) {
            console.error('❌ Application submission error:', error);
            throw error;
        }
    }

    showSuccessModal(applicationData = null) {
        const modal = document.getElementById('successModal');
        
        // Update success message with application number if available
        if (applicationData && applicationData.application) {
            const applicationNumber = applicationData.application.applicationNumber;
            const studentName = applicationData.application.studentName;
            
            const modalBody = modal.querySelector('.modal-body');
            modalBody.innerHTML = `
                <p>Thank you for your application, <strong>${studentName}</strong>!</p>
                <p>Your application has been submitted successfully with Application Number: <strong>APP${String(applicationNumber).padStart(6, '0')}</strong></p>
                <p>We have received your submission and will review it within 48 hours.</p>
                <p>You will receive a confirmation email shortly with further instructions.</p>
            `;
        }
        
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i data-lucide="${type === 'error' ? 'alert-circle' : 'check-circle'}"></i>
                <span>${message}</span>
            </div>
        `;

        document.body.appendChild(toast);

        setTimeout(() => toast.classList.add('show'), 100);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 5000);

        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
}

// Initialize modal when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.applicationModalInstance = new ApplicationModal();
    
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});

// Global function to open modal
window.openApplicationModal = function() {
    if (window.applicationModalInstance) {
        window.applicationModalInstance.openModal();
    }
};

// Export for global use
window.ApplicationModal = ApplicationModal;
