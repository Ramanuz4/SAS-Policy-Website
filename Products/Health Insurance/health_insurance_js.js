// Mobile menu functionality
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const header = document.getElementById('header');

if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
        }
    });
}

// Header scroll effect
window.addEventListener('scroll', () => {
    if (header) {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    // Update active nav link
    updateActiveNavLink();
});

// Smooth scrolling function
function scrollToSection(sectionId) {
    const target = document.getElementById(sectionId) || document.querySelector('.' + sectionId);
    if (target) {
        const headerHeight = header ? header.offsetHeight : 80;
        const targetPosition = target.offsetTop - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });

        // Close mobile menu if open
        if (navLinks && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
        }
    }
}

// Update active navigation link
function updateActiveNavLink() {
    const sections = ['overview', 'types', 'benefits', 'recommendations', 'get-quote'];
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const element = document.getElementById(section);
        if (element) {
            const rect = element.getBoundingClientRect();
            if (rect.top <= 100 && rect.bottom >= 100) {
                currentSection = section;
            }
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === '#' + currentSection) {
            link.classList.add('active');
        }
    });
}

// Enhanced Intersection Observer for fade-in animations with device-specific thresholds
const getObserverOptions = () => {
    const isMobile = window.innerWidth <= 768;
    return {
        threshold: isMobile ? 0.05 : 0.1,
        rootMargin: isMobile ? '0px 0px -30px 0px' : '0px 0px -50px 0px'
    };
};

let observer;

const initializeObserver = () => {
    if (observer) observer.disconnect();
    
    observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add staggered animation delay for better visual flow
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100);
            }
        });
    }, getObserverOptions());

    // Re-observe all fade-in elements
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
};

// Initialize observer on load and resize
document.addEventListener('DOMContentLoaded', initializeObserver);
window.addEventListener('resize', debounce(initializeObserver, 250));

// Debounce function for performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Enhanced animated counters for statistics with performance optimization
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const speed = window.innerWidth <= 768 ? 150 : 200; // Faster on mobile

    counters.forEach(counter => {
        const finalValue = +counter.getAttribute('data-count');
        const startValue = 0;
        const duration = 2000; // 2 seconds
        const increment = finalValue / (duration / 16); // 60fps
        let currentValue = startValue;

        const animate = () => {
            currentValue += increment;
            if (currentValue < finalValue) {
                counter.innerText = Math.ceil(currentValue).toLocaleString();
                requestAnimationFrame(animate);
            } else {
                counter.innerText = finalValue.toLocaleString();
            }
        };
        
        // Start animation with slight delay for better UX
        setTimeout(animate, 200);
    });
}

// Trigger counter animation when overview section is visible
const overviewSection = document.getElementById('overview');
if (overviewSection) {
    let hasAnimated = false;
    const overviewObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                animateCounters();
                hasAnimated = true;
                overviewObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    overviewObserver.observe(overviewSection);
}

// Enhanced modal functionality with better accessibility
function openPlanModal(planType) {
    const modal = document.getElementById('planModal');
    const content = document.getElementById('planModalContent');
    
    const planDetails = {
        individual: {
            title: 'Individual Health Insurance',
            icon: '👤',
            description: 'Personalized health coverage designed specifically for you',
            detailedFeatures: [
                'Coverage amount from ₹3 lakhs to ₹1 crore',
                'No waiting period for accidents and emergency treatments',
                'Cashless treatment at 5,000+ network hospitals nationwide',
                'Pre and post hospitalization expenses covered',
                'Day care procedures and outpatient treatments',
                'Annual preventive health check-ups included',
                'Tax benefits up to ₹25,000 under Section 80D',
                'Lifelong renewability with no upper age limit'
            ],
            benefits: [
                'Lower premium costs compared to family plans',
                'Faster claim processing and approval',
                'Customizable coverage based on individual needs',
                'No sharing of sum insured amount',
                'Personal medical history consideration'
            ],
            bestFor: [
                'Single working professionals',
                'College students and young adults',
                'Individuals with specific health needs',
                'Those seeking maximum coverage control'
            ]
        },
        family: {
            title: 'Family Floater Health Insurance',
            icon: '👨‍👩‍👧‍👦',
            description: 'Comprehensive health coverage for your entire family under one plan',
            detailedFeatures: [
                'Single premium covers entire family (up to 6 members)',
                'Shared sum insured from ₹3 lakhs to ₹50 lakhs',
                'Covers spouse, dependent children up to 25 years',
                'Option to include parents and in-laws',
                'Maternity and newborn baby coverage',
                'No individual medical tests for family members',
                'Cumulative bonus for claim-free years',
                'Easy addition/deletion of family members'
            ],
            benefits: [
                'Cost-effective compared to individual policies',
                'Convenient single policy management',
                'Higher sum insured at lower premium',
                'Automatic coverage for newborn babies',
                'Family health check-up benefits'
            ],
            bestFor: [
                'Nuclear families with 2-4 members',
                'Families planning to have children',
                'Those seeking cost-effective group coverage',
                'Families with similar health profiles'
            ]
        },
        senior: {
            title: 'Senior Citizen Health Insurance',
            icon: '👴',
            description: 'Specialized health coverage tailored for senior citizens above 60 years',
            detailedFeatures: [
                'Coverage for individuals above 60 years of age',
                'High sum insured options up to ₹50 lakhs',
                'Pre-existing disease coverage after waiting period',
                'Specialized treatments for age-related conditions',
                'Domiciliary hospitalization benefits',
                'AYUSH treatment coverage included',
                'Mental health and degenerative disease coverage',
                'Flexible premium payment options'
            ],
            benefits: [
                'No upper age limit for renewals',
                'Enhanced coverage for senior-specific ailments',
                'Reduced waiting periods for certain conditions',
                'Dedicated customer support for seniors',
                'Higher room rent limits and no capping'
            ],
            bestFor: [
                'Individuals above 60 years of age',
                'Senior citizens with pre-existing conditions',
                'Those requiring frequent medical attention',
                'Retirees seeking comprehensive health security'
            ]
        },
        group: {
            title: 'Group Health Insurance',
            icon: '🏢',
            description: 'Employer-sponsored health coverage for employees and their families',
            detailedFeatures: [
                'Employer-provided health insurance benefit',
                'Coverage extends to employee families',
                'No individual underwriting required',
                'Immediate coverage from joining date',
                'Portability options when changing jobs',
                'Group discounts on premium rates',
                'Wellness programs and health initiatives',
                'Corporate tie-ups with healthcare providers'
            ],
            benefits: [
                'Significantly lower premium costs',
                'No waiting periods for pre-existing diseases',
                'Easy enrollment process',
                'Tax benefits for both employer and employee',
                'Enhanced coverage limits'
            ],
            bestFor: [
                'Corporate employees',
                'Organizations looking to provide health benefits',
                'Employees with families to cover',
                'Those seeking immediate coverage without medical tests'
            ]
        },
        critical: {
            title: 'Critical Illness Insurance',
            icon: '⚕️',
            description: 'Specialized coverage for specific critical illnesses with lump sum payout',
            detailedFeatures: [
                'Coverage for 15-40 critical illnesses',
                'Lump sum payout upon diagnosis',
                'Coverage includes cancer, heart attack, stroke, kidney failure',
                'Independent of regular health insurance',
                'Option to buy as standalone or rider',
                'Survival period clause (usually 30 days)',
                'Premium waiver benefit available',
                'Global coverage for emergency treatments'
            ],
            benefits: [
                'Financial support during treatment and recovery',
                'Income replacement during illness',
                'Freedom to choose treatment options',
                'Tax benefits on premium paid and claim received',
                'Additional financial cushion beyond regular health insurance'
            ],
            bestFor: [
                'Individuals with family history of critical illnesses',
                'High-stress job professionals',
                'Those seeking income protection during illness',
                'People looking for comprehensive health security'
            ]
        },
        topup: {
            title: 'Top-up Health Insurance',
            icon: '💊',
            description: 'Additional health coverage that supplements your existing health insurance',
            detailedFeatures: [
                'Supplements existing health insurance coverage',
                'Activates after deductible amount is exceeded',
                'Higher coverage at much lower premium',
                'Can be bought independently or as add-on',
                'Covers hospitalization expenses beyond base policy',
                'Annual deductible limits from ₹1 lakh to ₹10 lakhs',
                'Cumulative bonus benefits available',
                'Flexible sum insured options'
            ],
            benefits: [
                'Cost-effective way to increase health coverage',
                'Protects against high medical inflation',
                'Lower premium compared to increasing base policy',
                'Tax benefits available',
                'Can be used for different family members'
            ],
            bestFor: [
                'Those with existing health insurance needing higher coverage',
                'People with basic employer health insurance',
                'Families with high medical expenses',
                'Those seeking affordable coverage enhancement'
            ]
        }
    };
    
    const plan = planDetails[planType];
    if (plan && modal && content) {
        content.innerHTML = generatePlanModalContent(plan);
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Set focus to modal for accessibility
        modal.setAttribute('tabindex', '-1');
        modal.focus();
        
        // Track modal open event
        trackEvent('plan_modal_open', { plan_type: planType });
    }
}

// Generate modal content with responsive design considerations
function generatePlanModalContent(plan) {
    const isMobile = window.innerWidth <= 768;
    const gridClass = isMobile ? 'grid-template-columns: 1fr;' : 'grid-template-columns: 1fr 1fr;';
    
    return `
        <div style="text-align: center; margin-bottom: 2rem;">
            <div style="font-size: ${isMobile ? '3rem' : '4rem'}; margin-bottom: 1rem;">${plan.icon}</div>
            <h2 style="color: #1e40af; margin-bottom: 1rem; font-size: ${isMobile ? '1.6rem' : '2rem'};">${plan.title}</h2>
            <p style="color: #64748b; font-size: ${isMobile ? '1rem' : '1.2rem'}; line-height: 1.6;">${plan.description}</p>
        </div>
        
        <div style="margin-bottom: 2rem;">
            <h3 style="color: #1e293b; margin-bottom: 1rem; font-size: ${isMobile ? '1.2rem' : '1.4rem'};">Detailed Features</h3>
            <ul style="list-style: none; padding: 0;">
                ${plan.detailedFeatures.map(feature => `
                    <li style="margin-bottom: 0.75rem; padding-left: 25px; position: relative; color: #64748b; line-height: 1.6; font-size: ${isMobile ? '0.9rem' : '1rem'};">
                        <span style="position: absolute; left: 0; color: #3b82f6; font-weight: bold; font-size: 1.2rem;">✓</span>
                        ${feature}
                    </li>
                `).join('')}
            </ul>
        </div>
        
        <div style="display: grid; ${gridClass} gap: ${isMobile ? '1.5rem' : '2rem'}; margin-bottom: 2rem;">
            <div>
                <h3 style="color: #1e293b; margin-bottom: 1rem; font-size: ${isMobile ? '1.1rem' : '1.2rem'};">Key Benefits</h3>
                <ul style="list-style: none; padding: 0;">
                    ${plan.benefits.map(benefit => `
                        <li style="margin-bottom: 0.5rem; padding-left: 20px; position: relative; color: #64748b; line-height: 1.5; font-size: ${isMobile ? '0.9rem' : '1rem'};">
                            <span style="position: absolute; left: 0; color: #f59e0b; font-weight: bold;">★</span>
                            ${benefit}
                        </li>
                    `).join('')}
                </ul>
            </div>
            
            <div>
                <h3 style="color: #1e293b; margin-bottom: 1rem; font-size: ${isMobile ? '1.1rem' : '1.2rem'};">Best For</h3>
                <ul style="list-style: none; padding: 0;">
                    ${plan.bestFor.map(item => `
                        <li style="margin-bottom: 0.5rem; padding-left: 20px; position: relative; color: #64748b; line-height: 1.5; font-size: ${isMobile ? '0.9rem' : '1rem'};">
                            <span style="position: absolute; left: 0; color: #059669; font-weight: bold;">→</span>
                            ${item}
                        </li>
                    `).join('')}
                </ul>
            </div>
        </div>
        
        <div style="text-align: center; margin-top: 2rem; padding-top: 2rem; border-top: 1px solid #e2e8f0;">
            <button class="cta-button primary" onclick="closeModal('planModal'); scrollToSection('get-quote');" style="margin-right: ${isMobile ? '0' : '1rem'}; margin-bottom: ${isMobile ? '1rem' : '0'}; ${isMobile ? 'width: 100%;' : ''}">Get Quote</button>
            <button class="cta-button secondary" onclick="closeModal('planModal'); openConsultationModal();" style="${isMobile ? 'width: 100%;' : ''}">Free Consultation</button>
        </div>
    `;
}

function openConsultationModal() {
    const modal = document.getElementById('consultationModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Set focus for accessibility
        modal.setAttribute('tabindex', '-1');
        modal.focus();
        
        // Track consultation modal open
        trackEvent('consultation_modal_open');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // Track modal close
        trackEvent('modal_close', { modal_id: modalId });
    }
}

// Enhanced modal event handling with better accessibility
window.addEventListener('click', (e) => {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (e.target === modal) {
            closeModal(modal.id);
        }
    });
});

// Handle escape key for modals
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const openModal = document.querySelector('.modal[style*="display: block"]');
        if (openModal) {
            closeModal(openModal.id);
        }
    }
});

// Request quote functionality with enhanced UX
function requestQuote(planId) {
    const planInfo = {
        'manipal-prohealth': {
            planType: 'individual',
            sumInsured: '500000'
        },
        'care-joy': {
            planType: 'individual',
            sumInsured: '300000'
        },
        'star-optima': {
            planType: 'family',
            sumInsured: '1000000'
        }
    };
    
    const info = planInfo[planId];
    if (info) {
        // Scroll to form
        scrollToSection('get-quote');
        
        // Pre-fill form after ensuring scroll completion
        setTimeout(() => {
            const planTypeSelect = document.getElementById('planType');
            const sumInsuredSelect = document.getElementById('sumInsured');
            
            if (planTypeSelect) planTypeSelect.value = info.planType;
            if (sumInsuredSelect) sumInsuredSelect.value = info.sumInsured;
            
            // Add visual feedback
            [planTypeSelect, sumInsuredSelect].forEach(element => {
                if (element) {
                    element.style.borderColor = '#3b82f6';
                    element.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                    setTimeout(() => {
                        element.style.borderColor = '';
                        element.style.boxShadow = '';
                    }, 2000);
                }
            });
        }, 800);
        
        // Track quote request
        trackEvent('quote_request_initiated', { plan_id: planId });
    }
}

// Enhanced health insurance quote form submission with better error handling
const healthQuoteForm = document.getElementById('healthQuoteForm');
if (healthQuoteForm) {
    healthQuoteForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitBtn = this.querySelector('.submit-btn');
        const btnText = submitBtn.querySelector('.btn-text');
        const loading = submitBtn.querySelector('.loading');
        const messageDiv = document.getElementById('quoteMessage');
        
        // Show loading state
        btnText.style.display = 'none';
        loading.style.display = 'inline-block';
        submitBtn.disabled = true;
        submitBtn.style.cursor = 'not-allowed';
        
        // Clear previous messages
        messageDiv.innerHTML = '';
        
        // Collect form data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        try {
            // Client-side validation
            const validationResult = validateFormData(data);
            if (!validationResult.isValid) {
                throw new Error(validationResult.message);
            }
            
            const response = await submitHealthQuoteRequest(data);
            
            if (response.success) {
                // Show success message
                messageDiv.innerHTML = `
                    <div class="message success">
                        <strong>Success!</strong> Your health insurance quote request has been submitted successfully. 
                        <br><strong>Quote ID:</strong> ${response.quoteId}
                        <br><strong>Estimated Premium:</strong> ₹${response.estimatedPremium.toLocaleString()}/year
                        <br>Our health insurance experts will contact you within 2 hours with personalized quotes and recommendations.
                    </div>
                `;
                
                // Reset form
                this.reset();
                
                // Track successful form submission
                trackEvent('health_quote_success', {
                    plan_type: data.planType,
                    sum_insured: data.sumInsured,
                    family_size: data.familySize,
                    estimated_premium: response.estimatedPremium,
                    quote_id: response.quoteId
                });
            } else {
                throw new Error(response.message || 'Failed to submit health insurance quote request');
            }
            
        } catch (error) {
            // Show error message
            messageDiv.innerHTML = `
                <div class="message error">
                    <strong>Error!</strong> ${error.message || 'Something went wrong. Please try again or contact us directly at +91 98765 43210.'}
                </div>
            `;
            
            // Track form submission error
            trackEvent('health_quote_error', {
                error_message: error.message,
                form_data: data
            });
        } finally {
            // Reset button state
            btnText.style.display = 'inline';
            loading.style.display = 'none';
            submitBtn.disabled = false;
            submitBtn.style.cursor = 'pointer';
            
            // Scroll to message
            setTimeout(() => {
                messageDiv.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'nearest',
                    inline: 'nearest'
                });
            }, 100);
        }
    });
}

// Enhanced form validation with better user feedback
function validateFormData(data) {
    const errors = [];
    
    // Required field validation
    const requiredFields = {
        firstName: 'First Name',
        lastName: 'Last Name',
        email: 'Email Address',
        phone: 'Phone Number',
        age: 'Age',
        planType: 'Plan Type',
        sumInsured: 'Sum Insured'
    };
    
    Object.entries(requiredFields).forEach(([field, label]) => {
        if (!data[field] || data[field].trim() === '') {
            errors.push(`${label} is required`);
        }
    });
    
    // Email validation
    if (data.email && !validateEmail(data.email)) {
        errors.push('Please enter a valid email address');
    }
    
    // Phone validation
    if (data.phone && !validatePhone(data.phone)) {
        errors.push('Please enter a valid phone number');
    }
    
    // Age validation
    const age = parseInt(data.age);
    if (data.age && (isNaN(age) || age < 18 || age > 100)) {
        errors.push('Age must be between 18 and 100 years');
    }
    
    // Plan type specific validations
    if (data.planType === 'family' && (!data.familySize || data.familySize === '1')) {
        errors.push('Family size must be greater than 1 for family floater plans');
    }
    
    return {
        isValid: errors.length === 0,
        message: errors.join('. ')
    };
}

// API Functions with enhanced error handling and retry logic
async function submitHealthQuoteRequest(data) {
    const maxRetries = 3;
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            // Simulate network delay based on connection
            const baseDelay = navigator.connection?.effectiveType === '4g' ? 1000 : 2000;
            await new Promise(resolve => setTimeout(resolve, baseDelay + (attempt * 500)));
            
            // Validate required fields
            const validation = validateFormData(data);
            if (!validation.isValid) {
                throw new Error(validation.message);
            }
            
            // This would be replaced with actual API call
            // const response = await fetch('/api/health-quote', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify(data)
            // });
            
            // Simulated successful response
            return {
                success: true,
                message: 'Health insurance quote request submitted successfully',
                quoteId: 'HQ' + Date.now(),
                estimatedPremium: calculateEstimatedPremium(data),
                data: data,
                timestamp: new Date().toISOString()
            };
            
        } catch (error) {
            lastError = error;
            
            if (attempt < maxRetries) {
                // Log retry attempt
                console.warn(`Quote submission attempt ${attempt} failed, retrying...`, error);
                continue;
            }
            
            throw lastError;
        }
    }
}

// Enhanced premium calculation with more factors
function calculateEstimatedPremium(data) {
    let basePremium = 5000;
    
    // Age factor
    const age = parseInt(data.age);
    if (age > 60) basePremium *= 2.5;
    else if (age > 50) basePremium *= 2;
    else if (age > 45) basePremium *= 1.5;
    else if (age > 35) basePremium *= 1.2;
    
    // Sum insured factor
    const sumInsured = parseInt(data.sumInsured);
    basePremium = basePremium * Math.sqrt(sumInsured / 500000);
    
    // Plan type factor
    const planMultipliers = {
        individual: 1,
        family: 0.7,
        senior: 2.2,
        critical: 0.5,
        topup: 0.3,
        group: 0.4
    };
    
    basePremium *= planMultipliers[data.planType] || 1;
    
    // Family size factor (only for family plans)
    if (data.planType === 'family' && data.familySize) {
        const familySize = parseInt(data.familySize);
        if (familySize > 2) {
            basePremium *= (1 + (familySize - 2) * 0.12);
        }
    }
    
    // Medical history factor
    if (data.medicalHistory && data.medicalHistory.trim().length > 50) {
        basePremium *= 1.3; // Increase premium for detailed medical history
    }
    
    // Add random variation for realism
    const variation = (Math.random() - 0.5) * 0.2; // ±10% variation
    basePremium *= (1 + variation);
    
    return Math.round(basePremium);
}

// Enhanced validation functions
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.toLowerCase());
}

function validatePhone(phone) {
    // Remove all non-digit characters for validation
    const cleanPhone = phone.replace(/\D/g, '');
    // Check for Indian phone number patterns
    return /^[6-9]\d{9}$/.test(cleanPhone) || /^91[6-9]\d{9}$/.test(cleanPhone);
}

// Enhanced real-time validation with visual feedback
document.addEventListener('DOMContentLoaded', () => {
    // Email validation with visual feedback
    document.querySelectorAll('input[type="email"]').forEach(input => {
        input.addEventListener('input', debounce(function() {
            const isValid = !this.value || validateEmail(this.value);
            updateFieldValidation(this, isValid, isValid ? '' : 'Please enter a valid email address');
        }, 300));
    });

    // Phone validation with formatting and visual feedback
    document.querySelectorAll('input[type="tel"]').forEach(input => {
        input.addEventListener('input', function() {
            // Format phone number as user types
            let value = this.value.replace(/\D/g, '');
            if (value.startsWith('91')) {
                value = '+91 ' + value.slice(2);
            } else if (value.length === 10) {
                value = '+91 ' + value;
            }
            
            if (value !== this.value) {
                const cursorPos = this.selectionStart;
                this.value = value;
                this.setSelectionRange(cursorPos, cursorPos);
            }
            
            const isValid = !this.value || validatePhone(this.value);
            updateFieldValidation(this, isValid, isValid ? '' : 'Please enter a valid 10-digit phone number');
        });
    });

    // Age validation with enhanced feedback
    const ageInput = document.getElementById('age');
    if (ageInput) {
        ageInput.addEventListener('input', function() {
            const age = parseInt(this.value);
            let isValid = true;
            let message = '';
            
            if (this.value && (isNaN(age) || age < 18 || age > 100)) {
                isValid = false;
                if (age < 18) message = 'Age must be at least 18 years';
                else if (age > 100) message = 'Please contact us directly for coverage above 100 years';
                else message = 'Please enter a valid age';
            }
            
            updateFieldValidation(this, isValid, message);
        });
    }

    // Family size validation for family plans
    const planTypeSelect = document.getElementById('planType');
    const familySizeSelect = document.getElementById('familySize');
    
    if (planTypeSelect && familySizeSelect) {
        planTypeSelect.addEventListener('change', function() {
            const isFamilyPlan = this.value === 'family';
            familySizeSelect.required = isFamilyPlan;
            
            if (isFamilyPlan) {
                familySizeSelect.style.borderColor = '#f59e0b';
                familySizeSelect.parentElement.querySelector('label').style.color = '#f59e0b';
            } else {
                familySizeSelect.style.borderColor = '';
                familySizeSelect.parentElement.querySelector('label').style.color = '';
            }
        });
    }

    // Clear validation on focus
    document.querySelectorAll('input, select, textarea').forEach(field => {
        field.addEventListener('focus', function() {
            this.setCustomValidity('');
            this.style.borderColor = '#3b82f6';
            this.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
        });
        
        field.addEventListener('blur', function() {
            if (!this.matches(':invalid')) {
                this.style.borderColor = '';
                this.style.boxShadow = '';
            }
        });
    });
});

// Update field validation with visual feedback
function updateFieldValidation(field, isValid, message) {
    field.setCustomValidity(message);
    
    if (isValid) {
        field.style.borderColor = field.value ? '#059669' : '';
        field.style.boxShadow = field.value ? '0 0 0 3px rgba(5, 150, 105, 0.1)' : '';
    } else {
        field.style.borderColor = '#dc2626';
        field.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)';
    }
}

// Enhanced analytics and tracking
function trackEvent(eventName, eventData = {}) {
    // Enhanced tracking with device and session information
    const trackingData = {
        ...eventData,
        timestamp: new Date().toISOString(),
        page: 'health_insurance',
        user_agent: navigator.userAgent,
        screen_size: `${screen.width}x${screen.height}`,
        viewport_size: `${window.innerWidth}x${window.innerHeight}`,
        device_type: getDeviceType(),
        connection: navigator.connection?.effectiveType || 'unknown'
    };
    
    console.log('Health Insurance Event tracked:', eventName, trackingData);
    
    // Here you would send data to your analytics service
    // Examples:
    // gtag('event', eventName, trackingData);
    // analytics.track(eventName, trackingData);
    // mixpanel.track(eventName, trackingData);
}

// Get device type for better analytics
function getDeviceType() {
    const width = window.innerWidth;
    if (width <= 480) return 'mobile';
    if (width <= 768) return 'tablet';
    if (width <= 1024) return 'laptop';
    return 'desktop';
}

// Enhanced user interaction tracking
document.addEventListener('DOMContentLoaded', () => {
    // Track CTA button clicks with enhanced context
    document.querySelectorAll('.cta-button').forEach(button => {
        button.addEventListener('click', function() {
            const section = this.closest('section');
            trackEvent('health_cta_click', {
                button_text: this.textContent.trim(),
                button_location: section?.id || section?.className || 'unknown',
                button_type: this.classList.contains('primary') ? 'primary' : 'secondary'
            });
        });
    });

    // Track plan interest with more details
    document.querySelectorAll('.plan-btn, .recommend-btn').forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.type-card, .recommendation-card');
            const planName = card?.querySelector('h3')?.textContent || 'unknown';
            const price = card?.querySelector('.price')?.textContent || 'unknown';
            
            trackEvent('health_plan_interest', {
                plan_name: planName,
                plan_price: price,
                action: this.classList.contains('plan-btn') ? 'learn_more' : 'get_quote',
                card_type: card?.classList.contains('popular') ? 'popular' : 
                          card?.classList.contains('premium') ? 'premium' : 'standard'
            });
        });
    });

    // Track section engagement time
    const sectionEngagement = {};
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const sectionId = entry.target.id;
            if (entry.isIntersecting) {
                sectionEngagement[sectionId] = Date.now();
            } else if (sectionEngagement[sectionId]) {
                const timeSpent = Date.now() - sectionEngagement[sectionId];
                if (timeSpent > 2000) { // Only track if spent more than 2 seconds
                    trackEvent('health_section_engagement', {
                        section: sectionId,
                        time_spent: timeSpent,
                        engagement_level: timeSpent > 10000 ? 'high' : timeSpent > 5000 ? 'medium' : 'low'
                    });
                }
                delete sectionEngagement[sectionId];
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('section[id]').forEach(section => {
        sectionObserver.observe(section);
    });

    // Track form field interactions
    const formFields = document.querySelectorAll('#healthQuoteForm input, #healthQuoteForm select, #healthQuoteForm textarea');
    formFields.forEach(field => {
        let fieldStartTime = null;
        
        field.addEventListener('focus', () => {
            fieldStartTime = Date.now();
        });
        
        field.addEventListener('blur', () => {
            if (fieldStartTime) {
                const timeSpent = Date.now() - fieldStartTime;
                trackEvent('form_field_interaction', {
                    field_name: field.name,
                    field_type: field.type,
                    time_spent: timeSpent,
                    has_value: !!field.value,
                    value_length: field.value?.length || 0
                });
                fieldStartTime = null;
            }
        });
    });
});

// Enhanced error handling and user feedback
window.addEventListener('error', function(e) {
    console.warn('Resource failed to load:', e.target);
    trackEvent('resource_load_error', {
        resource: e.target.src || e.target.href,
        error: e.message
    });
    
    // Implement graceful degradation for failed resources
    if (e.target.tagName === 'IMG') {
        e.target.style.display = 'none';
    }
});

// Network status handling
window.addEventListener('online', function() {
    console.log('Connection restored');
    trackEvent('connection_restored');
    
    // Show subtle notification
    showNetworkStatus('Connection restored', 'success');
});

window.addEventListener('offline', function() {
    console.log('Connection lost');
    trackEvent('connection_lost');
    
    // Show offline message
    showNetworkStatus('You are currently offline. Some features may not work properly.', 'warning');
});

// Show network status messages
function showNetworkStatus(message, type) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: ${type === 'success' ? '#059669' : '#f59e0b'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        font-size: 0.9rem;
        z-index: 10001;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        max-width: 300px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Animate out and remove
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Performance monitoring
function measurePerformance() {
    if ('performance' in window) {
        const navigation = performance.getEntriesByType('navigation')[0];
        const paint = performance.getEntriesByType('paint');
        
        trackEvent('page_performance', {
            load_time: navigation.loadEventEnd - navigation.loadEventStart,
            dom_content_loaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
            first_paint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
            first_contentful_paint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0
        });
    }
}

// Initialize everything when page loads
window.addEventListener('load', function() {
    // Remove loading states if any
    document.body.classList.add('loaded');
    
    // Measure performance
    setTimeout(measurePerformance, 100);
    
    // Start staggered animations
    setTimeout(() => {
        document.querySelectorAll('.fade-in').forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('visible');
            }, index * 50); // Reduced delay for better mobile experience
        });
    }, 200);
    
    console.log('SAS Policy Value Hub - Health Insurance page loaded successfully!');
    
    // Track page load with enhanced metrics
    trackEvent('health_page_load', {
        load_time: Date.now(),
        referrer: document.referrer,
        initial_viewport: `${window.innerWidth}x${window.innerHeight}`,
        user_agent: navigator.userAgent,
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    });
});

// Handle visibility change for better analytics
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        trackEvent('page_hidden');
    } else {
        trackEvent('page_visible');
    }
});

// Track page unload
window.addEventListener('beforeunload', function() {
    trackEvent('page_unload', {
        time_on_page: Date.now() - performance.timing.loadEventEnd
    });
});

// Smooth scroll polyfill for older browsers
if (!CSS.supports('scroll-behavior', 'smooth')) {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const targetPosition = target.offsetTop - (header ? header.offsetHeight : 80);
                const startPosition = window.pageYOffset;
                const distance = targetPosition - startPosition;
                const duration = 800;
                let startTime = null;

                function animation(currentTime) {
                    if (startTime === null) startTime = currentTime;
                    const timeElapsed = currentTime - startTime;
                    const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
                    window.scrollTo(0, run);
                    if (timeElapsed < duration) requestAnimationFrame(animation);
                }

                function easeInOutQuad(t, b, c, d) {
                    t /= d / 2;
                    if (t < 1) return c / 2 * t * t + b;
                    t--;
                    return -c / 2 * (t * (t - 2) - 1) + b;
                }

                requestAnimationFrame(animation);
            }
        });
    });
}