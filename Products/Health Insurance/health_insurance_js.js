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

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all fade-in elements
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
});

// Animated counters for statistics
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const speed = 200;

    counters.forEach(counter => {
        const animate = () => {
            const value = +counter.getAttribute('data-count');
            const data = +counter.innerText;
            const time = value / speed;
            
            if (data < value) {
                counter.innerText = Math.ceil(data + time);
                setTimeout(animate, 1);
            } else {
                counter.innerText = value;
            }
        };
        animate();
    });
}

// Trigger counter animation when overview section is visible
const overviewSection = document.getElementById('overview');
if (overviewSection) {
    const overviewObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                overviewObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    overviewObserver.observe(overviewSection);
}

// Modal functionality
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
        content.innerHTML = `
            <div style="text-align: center; margin-bottom: 2rem;">
                <div style="font-size: 4rem; margin-bottom: 1rem;">${plan.icon}</div>
                <h2 style="color: #1e40af; margin-bottom: 1rem; font-size: 2rem;">${plan.title}</h2>
                <p style="color: #64748b; font-size: 1.2rem; line-height: 1.6;">${plan.description}</p>
            </div>
            
            <div style="margin-bottom: 2rem;">
                <h3 style="color: #1e293b; margin-bottom: 1rem; font-size: 1.4rem;">Detailed Features</h3>
                <ul style="list-style: none; padding: 0;">
                    ${plan.detailedFeatures.map(feature => `
                        <li style="margin-bottom: 0.75rem; padding-left: 25px; position: relative; color: #64748b; line-height: 1.6;">
                            <span style="position: absolute; left: 0; color: #3b82f6; font-weight: bold; font-size: 1.2rem;">✓</span>
                            ${feature}
                        </li>
                    `).join('')}
                </ul>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem;">
                <div>
                    <h3 style="color: #1e293b; margin-bottom: 1rem; font-size: 1.2rem;">Key Benefits</h3>
                    <ul style="list-style: none; padding: 0;">
                        ${plan.benefits.map(benefit => `
                            <li style="margin-bottom: 0.5rem; padding-left: 20px; position: relative; color: #64748b; line-height: 1.5;">
                                <span style="position: absolute; left: 0; color: #f59e0b; font-weight: bold;">★</span>
                                ${benefit}
                            </li>
                        `).join('')}
                    </ul>
                </div>
                
                <div>
                    <h3 style="color: #1e293b; margin-bottom: 1rem; font-size: 1.2rem;">Best For</h3>
                    <ul style="list-style: none; padding: 0;">
                        ${plan.bestFor.map(item => `
                            <li style="margin-bottom: 0.5rem; padding-left: 20px; position: relative; color: #64748b; line-height: 1.5;">
                                <span style="position: absolute; left: 0; color: #059669; font-weight: bold;">→</span>
                                ${item}
                            </li>
                        `).join('')}
                    </ul>
                </div>
            </div>
            
            <div style="text-align: center; margin-top: 2rem; padding-top: 2rem; border-top: 1px solid #e2e8f0;">
                <button class="cta-button primary" onclick="closeModal('planModal'); scrollToSection('get-quote');" style="margin-right: 1rem;">Get Quote</button>
                <button class="cta-button secondary" onclick="closeModal('planModal'); openConsultationModal();">Free Consultation</button>
            </div>
        `;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function openConsultationModal() {
    const modal = document.getElementById('consultationModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (e.target === modal) {
            closeModal(modal.id);
        }
    });
});

// Request quote functionality
function requestQuote(planId) {
    // Pre-fill the form with plan information
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
        
        // Pre-fill form after a short delay to ensure scroll completion
        setTimeout(() => {
            const planTypeSelect = document.getElementById('planType');
            const sumInsuredSelect = document.getElementById('sumInsured');
            
            if (planTypeSelect) planTypeSelect.value = info.planType;
            if (sumInsuredSelect) sumInsuredSelect.value = info.sumInsured;
        }, 500);
    }
}

// Health insurance quote form submission
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
        
        // Collect form data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        try {
            const response = await submitHealthQuoteRequest(data);
            
            if (response.success) {
                // Show success message
                messageDiv.innerHTML = `
                    <div class="message success">
                        <strong>Success!</strong> Your health insurance quote request has been submitted successfully. Our health insurance experts will contact you within 2 hours with personalized quotes and recommendations.
                    </div>
                `;
                
                // Reset form
                this.reset();
                
                // Track successful form submission
                trackEvent('health_quote_success', {
                    plan_type: data.planType,
                    sum_insured: data.sumInsured,
                    family_size: data.familySize
                });
            } else {
                throw new Error(response.message || 'Failed to submit health insurance quote request');
            }
            
            // Scroll to message
            messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            
        } catch (error) {
            // Show error message
            messageDiv.innerHTML = `
                <div class="message error">
                    <strong>Error!</strong> ${error.message || 'Something went wrong. Please try again or contact us directly at +91 98765 43210.'}
                </div>
            `;
            
            // Track form submission error
            trackEvent('health_quote_error', {
                error_message: error.message
            });
        } finally {
            // Reset button state
            btnText.style.display = 'inline';
            loading.style.display = 'none';
            submitBtn.disabled = false;
        }
    });
}

// API Functions (to be replaced with actual backend calls)
async function submitHealthQuoteRequest(data) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Validate required fields
    if (!data.firstName || !data.lastName || !data.email || !data.phone || !data.age || !data.planType || !data.sumInsured) {
        throw new Error('Please fill in all required fields');
    }
    
    // Validate email format
    if (!validateEmail(data.email)) {
        throw new Error('Please enter a valid email address');
    }
    
    // Validate phone format
    if (!validatePhone(data.phone)) {
        throw new Error('Please enter a valid phone number');
    }
    
    // Validate age
    if (data.age < 18 || data.age > 100) {
        throw new Error('Age must be between 18 and 100 years');
    }
    
    // This would be replaced with actual API call
    // Example: const response = await fetch('/api/health-quote', { method: 'POST', body: JSON.stringify(data) });
    
    // Simulated successful response
    return {
        success: true,
        message: 'Health insurance quote request submitted successfully',
        quoteId: 'HQ' + Date.now(),
        estimatedPremium: calculateEstimatedPremium(data),
        data: data
    };
}

// Calculate estimated premium (simplified calculation for demo)
function calculateEstimatedPremium(data) {
    let basePremium = 5000;
    
    // Age factor
    if (data.age > 45) basePremium *= 1.5;
    else if (data.age > 35) basePremium *= 1.2;
    
    // Sum insured factor
    const sumInsured = parseInt(data.sumInsured);
    basePremium = basePremium * (sumInsured / 500000);
    
    // Plan type factor
    const planMultipliers = {
        individual: 1,
        family: 0.7,
        senior: 2,
        critical: 0.5,
        topup: 0.3
    };
    
    basePremium *= planMultipliers[data.planType] || 1;
    
    // Family size factor
    if (data.familySize) {
        const familySize = parseInt(data.familySize);
        if (familySize > 2) {
            basePremium *= (1 + (familySize - 2) * 0.15);
        }
    }
    
    return Math.round(basePremium);
}

// Form validation functions
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[+]?[\d\s\-\(\)]{10,}$/;
    return re.test(phone);
}

// Add real-time validation to forms
document.addEventListener('DOMContentLoaded', () => {
    // Email validation
    document.querySelectorAll('input[type="email"]').forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value && !validateEmail(this.value)) {
                this.setCustomValidity('Please enter a valid email address');
                this.style.borderColor = '#dc2626';
            } else {
                this.setCustomValidity('');
                this.style.borderColor = '';
            }
        });
    });

    // Phone validation
    document.querySelectorAll('input[type="tel"]').forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value && !validatePhone(this.value)) {
                this.setCustomValidity('Please enter a valid phone number');
                this.style.borderColor = '#dc2626';
            } else {
                this.setCustomValidity('');
                this.style.borderColor = '';
            }
        });
    });

    // Age validation
    const ageInput = document.getElementById('age');
    if (ageInput) {
        ageInput.addEventListener('blur', function() {
            const age = parseInt(this.value);
            if (this.value && (age < 18 || age > 100)) {
                this.setCustomValidity('Age must be between 18 and 100 years');
                this.style.borderColor = '#dc2626';
            } else {
                this.setCustomValidity('');
                this.style.borderColor = '';
            }
        });
    }

    // Clear validation on input
    document.querySelectorAll('input, select, textarea').forEach(field => {
        field.addEventListener('input', function() {
            this.setCustomValidity('');
            this.style.borderColor = '';
        });
    });
});

// Analytics and tracking
function trackEvent(eventName, eventData = {}) {
    // Placeholder for analytics tracking
    console.log('Health Insurance Event tracked:', eventName, eventData);
    
    // Here you would typically send data to your analytics service
    // Example: gtag('event', eventName, eventData);
}

// Track important user interactions
document.addEventListener('DOMContentLoaded', () => {
    // Track CTA button clicks
    document.querySelectorAll('.cta-button').forEach(button => {
        button.addEventListener('click', function() {
            trackEvent('health_cta_click', {
                button_text: this.textContent.trim(),
                button_location: this.closest('section')?.id || 'unknown'
            });
        });
    });

    // Track plan interest
    document.querySelectorAll('.plan-btn, .recommend-btn').forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.type-card, .recommendation-card');
            const planName = card?.querySelector('h3')?.textContent || 'unknown';
            trackEvent('health_plan_interest', {
                plan_name: planName,
                action: 'learn_more_or_quote'
            });
        });
    });

    // Track section views
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                trackEvent('health_section_view', {
                    section: entry.target.id || 'unknown'
                });
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('section[id]').forEach(section => {
        sectionObserver.observe(section);
    });
});

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        // Close any open modals
        document.querySelectorAll('.modal').forEach(modal => {
            if (modal.style.display === 'block') {
                closeModal(modal.id);
            }
        });
    }
});

// Error handling for failed resource loads
window.addEventListener('error', function(e) {
    console.warn('Resource failed to load:', e.target);
    // You could implement fallback mechanisms here
});

// Initialize everything when page loads
window.addEventListener('load', function() {
    // Remove loading states if any
    document.body.classList.add('loaded');
    
    // Start animations after a short delay
    setTimeout(() => {
        document.querySelectorAll('.fade-in').forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('visible');
            }, index * 100);
        });
    }, 300);
    
    console.log('SAS Policy Value Hub - Health Insurance page loaded successfully!');
    
    // Track page load
    trackEvent('health_page_load', {
        load_time: Date.now(),
        user_agent: navigator.userAgent
    });
});

// Handle connection status
window.addEventListener('online', function() {
    console.log('Connection restored');
    // Show notification if form submission failed due to network
});

window.addEventListener('offline', function() {
    console.log('Connection lost');
    // Show offline message if needed
});

// Smooth scroll polyfill for older browsers
if (!CSS.supports('scroll-behavior', 'smooth')) {
    // Polyfill for smooth scrolling
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const targetPosition = target.offsetTop - (header ? header.offsetHeight : 80);
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}