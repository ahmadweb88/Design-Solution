/**
 * Contact Form JavaScript
 * Sky Design Solutions
 * Handles all form interactions and validations
 */

(function() {
    'use strict';

    // Wait for DOM to be fully loaded
    document.addEventListener('DOMContentLoaded', function() {
        initCustomDropdowns();
        initFormValidation();
        initFormSubmission();
    });

    /**
     * Initialize Custom Dropdowns (Country Code & Source)
     */
    function initCustomDropdowns() {
        const dropdowns = document.querySelectorAll('.custom-dropdown');

        dropdowns.forEach(function(dropdown) {
            const toggle = dropdown.querySelector('.custom-dropdown-toggle');
            const list = dropdown.querySelector('.custom-dropdown-list');
            const options = dropdown.querySelectorAll('.custom-dropdown-option');
            const hiddenInput = dropdown.querySelector('input[type="hidden"]');
            const selectName = dropdown.dataset.selectName;

            if (!toggle || !list) return;

            // Toggle dropdown on click
            toggle.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();

                // Close other dropdowns
                closeAllDropdowns();

                // Toggle current dropdown
                const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
                toggle.setAttribute('aria-expanded', !isExpanded);
                list.style.display = isExpanded ? 'none' : 'block';
            });

            // Handle option selection
            options.forEach(function(option) {
                option.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();

                    const value = this.dataset.value;
                    const label = this.dataset.label;
                    const flag = this.dataset.flag;

                    // Remove active class from all options
                    options.forEach(opt => {
                        opt.classList.remove('is-active');
                        opt.removeAttribute('aria-selected');
                    });

                    // Add active class to selected option
                    this.classList.add('is-active');
                    this.setAttribute('aria-selected', 'true');

                    // Update toggle button display
                    const labelElement = toggle.querySelector('.custom-dropdown-label');
                    if (labelElement) {
                        if (flag) {
                            // For country code dropdown with flag
                            // Build flag image src based on unicode
                            const flagCode = flag.codePointAt(0).toString(16) + '-' +
                                            flag.codePointAt(2).toString(16);

                            // Replace entire label content with flag and code structure
                            labelElement.innerHTML = `
                                <span class="country-flag">
                                    <img draggable="false" role="img" class="emoji" alt="${flag}"
                                         src="https://s.w.org/images/core/emoji/16.0.1/svg/${flagCode}.svg">
                                </span>
                                <span class="country-code">${label}</span>
                            `;
                        } else {
                            // For regular dropdown
                            labelElement.textContent = label;
                        }
                    }

                    // Update hidden input
                    if (hiddenInput) {
                        hiddenInput.value = value;
                    }

                    // Close dropdown
                    toggle.setAttribute('aria-expanded', 'false');
                    list.style.display = 'none';
                });
            });
        });

        // Close dropdowns when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.custom-dropdown')) {
                closeAllDropdowns();
            }
        });

        // Close dropdowns on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeAllDropdowns();
            }
        });
    }

    /**
     * Close all open dropdowns
     */
    function closeAllDropdowns() {
        const toggles = document.querySelectorAll('.custom-dropdown-toggle');
        const lists = document.querySelectorAll('.custom-dropdown-list');

        toggles.forEach(toggle => {
            toggle.setAttribute('aria-expanded', 'false');
        });

        lists.forEach(list => {
            list.style.display = 'none';
        });
    }

    /**
     * Initialize Form Validation
     */
    function initFormValidation() {
        const form = document.getElementById('contactForm');
        if (!form) return;

        const inputs = form.querySelectorAll('input[required], textarea[required]');

        inputs.forEach(function(input) {
            // Validate on blur
            input.addEventListener('blur', function() {
                validateField(this);
            });

            // Remove error on input
            input.addEventListener('input', function() {
                if (this.classList.contains('is-invalid')) {
                    this.classList.remove('is-invalid');
                }
            });
        });
    }

    /**
     * Validate individual field
     */
    function validateField(field) {
        let isValid = true;
        const value = field.value.trim();

        // Check if required field is empty
        if (field.hasAttribute('required') && value === '') {
            isValid = false;
        }

        // Email validation
        if (field.type === 'email' && value !== '') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
            }
        }

        // Phone validation (basic)
        if (field.type === 'tel' && value !== '') {
            const phoneRegex = /^[0-9\s\-\(\)]+$/;
            if (!phoneRegex.test(value) || value.length < 6) {
                isValid = false;
            }
        }

        // Update field status
        if (isValid) {
            field.classList.remove('is-invalid');
            field.classList.add('is-valid');
        } else {
            field.classList.remove('is-valid');
            field.classList.add('is-invalid');
        }

        return isValid;
    }

    /**
     * Initialize Form Submission with Comprehensive Validation
     */
    function initFormSubmission() {
        const form = document.getElementById('contactForm');
        if (!form) return;

        form.addEventListener('submit', function(e) {
            e.preventDefault();

            // Clear all previous error states
            clearAllErrors();

            // Validation array to collect all errors
            const errors = [];
            let isFormValid = true;

            // 1. Validate Name
            const nameField = form.querySelector('#name');
            if (!nameField.value.trim()) {
                errors.push('Please enter your name');
                addFieldError(nameField, 'Name is required');
                isFormValid = false;
            } else if (nameField.value.trim().length < 2) {
                errors.push('Please enter a valid name');
                addFieldError(nameField, 'Name must be at least 2 characters');
                isFormValid = false;
            } else {
                addFieldSuccess(nameField);
            }

            // 2. Validate Email
            const emailField = form.querySelector('#email');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailField.value.trim()) {
                errors.push('Please enter your email address');
                addFieldError(emailField, 'Email is required');
                isFormValid = false;
            } else if (!emailRegex.test(emailField.value.trim())) {
                errors.push('Please enter a valid email address');
                addFieldError(emailField, 'Invalid email format');
                isFormValid = false;
            } else {
                addFieldSuccess(emailField);
            }

            // 3. Validate Country Code
            const countryCodeInput = form.querySelector('input[name="country_code"]');
            if (!countryCodeInput.value) {
                errors.push('Please select a country code');
                addDropdownError(countryCodeInput.closest('.custom-dropdown'));
                isFormValid = false;
            } else {
                addDropdownSuccess(countryCodeInput.closest('.custom-dropdown'));
            }

            // 4. Validate Phone
            const phoneField = form.querySelector('#phone');
            const phoneRegex = /^[0-9\s\-\(\)]+$/;
            if (!phoneField.value.trim()) {
                errors.push('Please enter your phone number');
                addFieldError(phoneField, 'Phone number is required');
                isFormValid = false;
            } else if (!phoneRegex.test(phoneField.value.trim()) || phoneField.value.trim().length < 6) {
                errors.push('Please enter a valid phone number');
                addFieldError(phoneField, 'Invalid phone number');
                isFormValid = false;
            } else {
                addFieldSuccess(phoneField);
            }

            // 5. Validate Services (at least one checkbox)
            const serviceCheckboxes = form.querySelectorAll('input[name="services"]:checked');
            const servicesContainer = form.querySelector('.form-checkbox-grid');
            if (serviceCheckboxes.length === 0) {
                errors.push('Please select at least one service');
                addCheckboxGroupError(servicesContainer);
                isFormValid = false;
            } else {
                addCheckboxGroupSuccess(servicesContainer);
            }

            // 6. Validate Project Details
            const projectField = form.querySelector('#project');
            if (!projectField.value.trim()) {
                errors.push('Please tell us about your project');
                addFieldError(projectField, 'Project details are required');
                isFormValid = false;
            } else if (projectField.value.trim().length < 10) {
                errors.push('Please provide more details about your project');
                addFieldError(projectField, 'Please provide at least 10 characters');
                isFormValid = false;
            } else {
                addFieldSuccess(projectField);
            }

            // 7. Validate Budget (at least one radio)
            const budgetRadios = form.querySelectorAll('input[name="budget"]:checked');
            const budgetContainer = form.querySelector('.form-radio-grid');
            if (budgetRadios.length === 0) {
                errors.push('Please select your budget range');
                addRadioGroupError(budgetContainer);
                isFormValid = false;
            } else {
                addRadioGroupSuccess(budgetContainer);
            }

            // 8. Validate Source dropdown
            const sourceInput = form.querySelector('input[name="source"]');
            if (!sourceInput.value || sourceInput.value === '') {
                errors.push('Please tell us how you heard about us');
                addDropdownError(sourceInput.closest('.custom-dropdown'));
                isFormValid = false;
            } else {
                addDropdownSuccess(sourceInput.closest('.custom-dropdown'));
            }

            if (isFormValid) {
                // Get form data
                const formData = new FormData(form);
                const formObject = {};

                formData.forEach((value, key) => {
                    if (formObject[key]) {
                        // Handle multiple values (like checkboxes)
                        if (Array.isArray(formObject[key])) {
                            formObject[key].push(value);
                        } else {
                            formObject[key] = [formObject[key], value];
                        }
                    } else {
                        formObject[key] = value;
                    }
                });

                console.log('Form Data:', formObject);

                // Show success message
                showFormMessage('success', '✓ Success! Your message has been sent. We\'ll contact you within 24 hours.');

                // Reset form
                setTimeout(function() {
                    form.reset();
                    clearAllErrors();
                    // Reset dropdowns
                    form.querySelectorAll('.custom-dropdown-toggle .custom-dropdown-label').forEach(label => {
                        const dropdown = label.closest('.custom-dropdown');
                        const placeholder = dropdown.dataset.placeholder || 'Select';
                        label.textContent = placeholder;
                    });
                }, 2000);

                // TODO: Replace with actual form submission to your backend
                // Example:
                // fetch('/api/contact', {
                //     method: 'POST',
                //     headers: { 'Content-Type': 'application/json' },
                //     body: JSON.stringify(formObject)
                // })
                // .then(response => response.json())
                // .then(data => {
                //     showFormMessage('success', 'Message sent successfully!');
                // })
                // .catch(error => {
                //     showFormMessage('error', 'Something went wrong. Please try again.');
                // });

            } else {
                // Show error message with count
                const errorCount = errors.length;
                const errorMessage = errorCount === 1
                    ? '⚠ Please fix the error below to submit the form.'
                    : `⚠ Please fix ${errorCount} errors below to submit the form.`;

                showFormMessage('error', errorMessage);

                // Show detailed errors list
                showErrorsList(errors);

                // Scroll to first error
                scrollToFirstError();
            }
        });
    }

    /**
     * Clear all error states
     */
    function clearAllErrors() {
        const form = document.getElementById('contactForm');

        // Clear field errors
        form.querySelectorAll('.is-valid, .is-invalid').forEach(function(field) {
            field.classList.remove('is-valid', 'is-invalid');
        });

        // Clear error messages
        form.querySelectorAll('.field-error-message').forEach(function(msg) {
            msg.remove();
        });

        // Clear dropdown errors
        form.querySelectorAll('.custom-dropdown').forEach(function(dropdown) {
            dropdown.classList.remove('has-error', 'has-success');
        });

        // Clear checkbox/radio group errors
        form.querySelectorAll('.form-checkbox-grid, .form-radio-grid').forEach(function(group) {
            group.classList.remove('has-error', 'has-success');
            const errorMsg = group.parentElement.querySelector('.group-error-message');
            if (errorMsg) errorMsg.remove();
        });

        // Remove errors list
        const errorsList = document.querySelector('.form-errors-list');
        if (errorsList) errorsList.remove();
    }

    /**
     * Add error state to field
     */
    function addFieldError(field, message) {
        field.classList.add('is-invalid');
        field.classList.remove('is-valid');

        // Add error message below field
        const errorMsg = document.createElement('div');
        errorMsg.className = 'field-error-message';
        errorMsg.innerHTML = `<i class="bi bi-exclamation-circle-fill"></i> ${message}`;
        field.parentElement.appendChild(errorMsg);
    }

    /**
     * Add success state to field
     */
    function addFieldSuccess(field) {
        field.classList.add('is-valid');
        field.classList.remove('is-invalid');
    }

    /**
     * Add error state to dropdown
     */
    function addDropdownError(dropdown) {
        dropdown.classList.add('has-error');
        dropdown.classList.remove('has-success');
    }

    /**
     * Add success state to dropdown
     */
    function addDropdownSuccess(dropdown) {
        dropdown.classList.add('has-success');
        dropdown.classList.remove('has-error');
    }

    /**
     * Add error state to checkbox group
     */
    function addCheckboxGroupError(container) {
        container.classList.add('has-error');
        container.classList.remove('has-success');

        const errorMsg = document.createElement('div');
        errorMsg.className = 'group-error-message';
        errorMsg.innerHTML = '<i class="bi bi-exclamation-circle-fill"></i> Please select at least one service';
        container.parentElement.appendChild(errorMsg);
    }

    /**
     * Add success state to checkbox group
     */
    function addCheckboxGroupSuccess(container) {
        container.classList.add('has-success');
        container.classList.remove('has-error');
    }

    /**
     * Add error state to radio group
     */
    function addRadioGroupError(container) {
        container.classList.add('has-error');
        container.classList.remove('has-success');

        const errorMsg = document.createElement('div');
        errorMsg.className = 'group-error-message';
        errorMsg.innerHTML = '<i class="bi bi-exclamation-circle-fill"></i> Please select your budget range';
        container.parentElement.appendChild(errorMsg);
    }

    /**
     * Add success state to radio group
     */
    function addRadioGroupSuccess(container) {
        container.classList.add('has-success');
        container.classList.remove('has-error');
    }

    /**
     * Show errors list
     */
    function showErrorsList(errors) {
        const form = document.getElementById('contactForm');
        const submitButton = form.querySelector('.form-submit-btn');

        const errorsList = document.createElement('div');
        errorsList.className = 'form-errors-list';
        errorsList.innerHTML = `
            <div class="errors-list-header">
                <i class="bi bi-exclamation-triangle-fill"></i>
                <strong>Please fix the following errors:</strong>
            </div>
            <ul class="errors-list-items">
                ${errors.map(error => `<li>${error}</li>`).join('')}
            </ul>
        `;

        submitButton.parentElement.insertBefore(errorsList, submitButton);

        // Animate in
        setTimeout(() => {
            errorsList.classList.add('show');
        }, 10);
    }

    /**
     * Scroll to first error
     */
    function scrollToFirstError() {
        const firstError = document.querySelector('.is-invalid, .has-error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // Focus on input if it's a field
            if (firstError.tagName === 'INPUT' || firstError.tagName === 'TEXTAREA') {
                setTimeout(() => firstError.focus(), 500);
            }
        }
    }

    /**
     * Show form message (success or error)
     */
    function showFormMessage(type, message) {
        // Remove existing messages
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create message element
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message alert alert-${type === 'success' ? 'success' : 'danger'} mt-3`;
        messageDiv.innerHTML = `
            <div class="d-flex align-items-center">
                <i class="bi bi-${type === 'success' ? 'check-circle-fill' : 'exclamation-circle-fill'} me-2"></i>
                <span>${message}</span>
            </div>
        `;

        // Insert message after submit button
        const form = document.getElementById('contactForm');
        const submitButton = form.querySelector('.form-submit-btn');
        submitButton.parentNode.insertBefore(messageDiv, submitButton.nextSibling);

        // Auto-remove after 5 seconds
        setTimeout(function() {
            messageDiv.style.transition = 'opacity 0.3s ease';
            messageDiv.style.opacity = '0';
            setTimeout(function() {
                messageDiv.remove();
            }, 300);
        }, 5000);
    }

    /**
     * Checkbox and Radio styling enhancement
     */
    const checkboxPills = document.querySelectorAll('.form-checkbox-pill');
    checkboxPills.forEach(function(pill) {
        const checkbox = pill.querySelector('input[type="checkbox"]');
        if (checkbox) {
            checkbox.addEventListener('change', function() {
                if (this.checked) {
                    pill.classList.add('active');
                } else {
                    pill.classList.remove('active');
                }
            });
        }
    });

    const radioPills = document.querySelectorAll('.form-radio-pill');
    radioPills.forEach(function(pill) {
        const radio = pill.querySelector('input[type="radio"]');
        if (radio) {
            radio.addEventListener('change', function() {
                // Remove active class from all radio pills with same name
                const name = this.name;
                document.querySelectorAll(`input[name="${name}"]`).forEach(function(r) {
                    r.closest('.form-radio-pill').classList.remove('active');
                });

                // Add active class to selected pill
                if (this.checked) {
                    pill.classList.add('active');
                }
            });
        }
    });

})();
