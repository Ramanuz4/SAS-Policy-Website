// Mobile menu functionality
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const header = document.getElementById('header');

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

// Header scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    // Update active nav link
    updateActiveNavLink();
});

// Smooth scrolling function
function scrollToSection(sectionId) {
    const target = document.getElementById(sectionId) || document.querySelector('.' + sectionId);
    if (target) {
        const headerHeight = header.offsetHeight;
        const targetPosition = target.offsetTop - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// Update active navigation link
function updateActiveNavLink() {
    const sections = ['home', 'life-types', 'benefits', 'calculator', 'contact'];
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
        if (link.getAttribute('href') === '#' + currentSection) {
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
document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// Plan Details Modal
function openPlanModal(planType) {
    const modal = document.getElementById('planModal');
    const content = document.getElementById('planModalContent');
    
    const planDetails = {
        term: {
            title: 'Term Life Insurance',
            icon: '⚡',
            description: 'Pure life insurance coverage for a specific term with maximum coverage at minimum cost.',
            keyFeatures: [
                'High Sum Assured at low premiums',
                'Flexible policy terms (5-40 years)',
                'Renewable and convertible options',
                'Death benefit payout to nominees',
                'Tax benefits under Section 80C & 10(10D)',
                'Rider options available',
                'No maturity benefit',
                'Medical checkup may be required'
            ],
            benefits: [
                'Most affordable life insurance',
                'Highest coverage amount possible',
                'Simple and straightforward',
                'Tax efficient',
                'Flexible premium payment modes',
                'Online purchase available'
            ],
            whoShouldBuy: [
                'Young professionals starting career',
                'Individuals with financial dependents',
                'People with home loans/EMIs',
                'Those seeking maximum coverage at low cost',
                'Primary breadwinners of family'
            ],
            example: {
                age: '30 years old',
                coverage: '₹1 Crore',
                premium: '₹12,000/year',
                term: '30 years',
                totalPremium: '₹3.6 Lakhs',
                benefit: '₹1 Crore death benefit'
            }
        },
        whole: {
            title: 'Whole Life Insurance',
            icon: '🏦',
            description: 'Lifelong insurance coverage with cash value accumulation and investment component.',
            keyFeatures: [
                'Lifelong coverage till 99/100 years',
                'Cash value accumulation',
                'Fixed premium payments',
                'Guaranteed death benefit',
                'Loan facility against policy',
                'Surrender value available',
                'Bonus additions possible',
                'Estate planning tool'
            ],
            benefits: [
                'Permanent life insurance',
                'Builds cash value over time',
                'Predictable premiums',
                'Forced savings mechanism',
                'Tax-advantaged growth',
                'Legacy planning'
            ],
            whoShouldBuy: [
                'High net worth individuals',
                'Those seeking permanent coverage',
                'Estate planning requirements',
                'Long-term wealth creation goals',
                'Business owners for key person insurance'
            ],
            example: {
                age: '35 years old',
                coverage: '₹50 Lakhs',
                premium: '₹48,000/year',
                term: 'Lifetime',
                cashValue: '₹25 Lakhs after 20 years',
                benefit: '₹50 Lakhs + Bonuses'
            }
        },
        ulip: {
            title: 'Unit Linked Insurance Plans (ULIPs)',
            icon: '📈',
            description: 'Insurance cum investment plans that offer life cover and investment in market-linked funds.',
            keyFeatures: [
                'Life insurance + Investment',
                'Choice of multiple funds',
                'Flexibility to switch funds',
                'Top-up facility available',
                'Partial withdrawal options',
                'Lock-in period of 5 years',
                'Tax benefits available',
                'Transparency in charges'
            ],
            benefits: [
                'Dual benefit of insurance and investment',
                'Potential for higher returns',
                'Fund switching flexibility',
                'Tax efficiency',
                'Wealth creation opportunity',
                'Professional fund management'
            ],
            whoShouldBuy: [
                'Investors comfortable with market risk',
                'Long-term wealth creation goals',
                'Those seeking tax-efficient investments',
                'Young professionals with stable income',
                'People wanting flexibility in investments'
            ],
            example: {
                age: '28 years old',
                coverage: '₹75 Lakhs',
                premium: '₹36,000/year',
                term: '20 years',
                maturityValue: '₹18-25 Lakhs (market dependent)',
                benefit: '₹75 Lakhs life cover'
            }
        },
        endowment: {
            title: 'Endowment Plans',
            icon: '💎',
            description: 'Savings-cum-insurance plans that provide guaranteed returns along with life coverage.',
            keyFeatures: [
                'Guaranteed maturity benefit',
                'Life insurance coverage',
                'Bonus additions',
                'Disciplined savings',
                'Loan facility available',
                'Tax benefits',
                'Fixed premium payments',
                'Participation in profits'
            ],
            benefits: [
                'Guaranteed returns',
                'Capital protection',
                'Disciplined savings habit',
                'Tax benefits',
                'Bonus participation',
                'Financial security'
            ],
            whoShouldBuy: [
                'Conservative investors',
                'Those seeking guaranteed returns',
                'Risk-averse individuals',
                'Parents saving for child\'s future',
                'Pre-retirement planning'
            ],
            example: {
                age: '40 years old',
                coverage: '₹25 Lakhs',
                premium: '₹60,000/year',
                term: '15 years',
                maturityValue: '₹12-15 Lakhs',
                benefit: '₹25 Lakhs life cover'
            }
        },
        child: {
            title: 'Child Insurance Plans',
            icon: '🎓',
            description: 'Specialized plans designed to secure your child\'s education and future milestones.',
            keyFeatures: [
                'Education milestone benefits',
                'Waiver of premium benefit',
                'Flexible payout options',
                'Child coverage option',
                'Maturity benefit guaranteed',
                'Tax benefits available',
                'Life cover for parent',
                'Premium payment flexibility'
            ],
            benefits: [
                'Ensures child\'s education funding',
                'Protection against parent\'s demise',
                'Milestone-based payouts',
                'Guaranteed returns',
                'Tax efficiency',
                'Financial discipline'
            ],
            whoShouldBuy: [
                'Parents with young children',
                'Those planning child\'s education',
                'Families wanting financial security',
                'Parents seeking guaranteed returns',
                'Long-term planners'
            ],
            example: {
                age: 'Parent: 32 years, Child: 5 years',
                coverage: '₹50 Lakhs',
                premium: '₹30,000/year',
                term: '15 years',
                educationBenefit: '₹5 Lakhs at age 18, ₹10 Lakhs at age 21',
                benefit: '₹35 Lakhs maturity benefit'
            }
        },
        pension: {
            title: 'Pension Plans',
            icon: '🏖️',
            description: 'Retirement-focused plans ensuring regular income during your golden years.',
            keyFeatures: [
                'Regular pension income',
                'Immediate or deferred annuity',
                'Multiple annuity options',
                'Vesting benefit',
                'Surrender value',
                'Tax benefits during accumulation',
                'Inflation protection options',
                'Joint life options'
            ],
            benefits: [
                'Guaranteed retirement income',
                'Financial independence',
                'Tax-efficient retirement planning',
                'Inflation protection',
                'Peace of mind',
                'Multiple payout options'
            ],
            whoShouldBuy: [
                'Individuals planning retirement',
                'Self-employed professionals',
                'Those without adequate PF benefits',
                'People seeking regular income post-retirement',
                'Long-term financial planners'
            ],
            example: {
                age: '45 years old',
                premium: '₹1,00,000/year',
                term: '15 years (till 60)',
                totalInvestment: '₹15 Lakhs',
                monthlyPension: '₹15,000-20,000',
                benefit: 'Lifelong pension income'
            }
        }
    };
    
    const plan = planDetails[planType];
    if (plan) {
        content.innerHTML = `
            <div class="plan-modal-content">
                <div style="text-align: center; margin-bottom: 2rem;">
                    <div style="font-size: 4rem; margin-bottom: 1rem;">${plan.icon}</div>
                    <h2 style="color: #1e40af; margin-bottom: 1rem; font-size: 2.2rem;">${plan.title}</h2>
                    <p style="color: #64748b; font-size: 1.1rem; max-width: 600px; margin: 0 auto;">${plan.description}</p>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem;">
                    <div>
                        <h3 style="color: #1e293b; margin-bottom: 1rem; font-size: 1.4rem;">Key Features</h3>
                        <ul style="list-style: none; padding: 0;">
                            ${plan.keyFeatures.map(feature => `
                                <li style="margin-bottom: 0.5rem; padding-left: 20px; position: relative; color: #64748b;">
                                    <span style="position: absolute; left: 0; color: #3b82f6; font-weight: bold;">✓</span>
                                    ${feature}
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                    
                    <div>
                        <h3 style="color: #1e293b; margin-bottom: 1rem; font-size: 1.4rem;">Key Benefits</h3>
                        <ul style="list-style: none; padding: 0;">
                            ${plan.benefits.map(benefit => `
                                <li style="margin-bottom: 0.5rem; padding-left: 20px; position: relative; color: #64748b;">
                                    <span style="position: absolute; left: 0; color: #f59e0b; font-weight: bold;">★</span>
                                    ${benefit}
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                </div>

                <div style="background: #f8fafc; padding: 2rem; border-radius: 15px; margin-bottom: 2rem;">
                    <h3 style="color: #1e293b; margin-bottom: 1rem; font-size: 1.4rem;">Who Should Buy This Plan?</h3>
                    <ul style="list-style: none; padding: 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 0.5rem;">
                        ${plan.whoShouldBuy.map(item => `
                            <li style="padding-left: 20px; position: relative; color: #64748b;">
                                <span style="position: absolute; left: 0; color: #10b981; font-weight: bold;">●</span>
                                ${item}
                            </li>
                        `).join('')}
                    </ul>
                </div>

                <div style="background: linear-gradient(135deg, #1e40af, #3b82f6); color: white; padding: 2rem; border-radius: 15px; margin-bottom: 2rem;">
                    <h3 style="margin-bottom: 1rem; font-size: 1.4rem;">Example Scenario</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
                        ${Object.entries(plan.example).map(([key, value]) => `
                            <div style="text-align: center;">
                                <div style="font-size: 0.9rem; opacity: 0.8; margin-bottom: 0.25rem;">${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</div>
                                <div style="font-weight: bold; font-size: 1.1rem;">${value}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div style="text-align: center;">
                    <button class="cta-button primary" onclick="closeModal('planModal'); scrollToSection('calculator');" style="margin-right: 1rem;">Calculate Premium</button>
                    <button class="cta-button secondary" onclick="closeModal('planModal'); scrollToSection('contact');" style="background: #64748b; border: none;">Get Expert Advice</button>
                </div>
            </div>
        `;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
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

// Premium Calculator
document.getElementById('premiumCalculator').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const age = parseInt(document.getElementById('age').value);
    const gender = document.getElementById('gender').value;
    const coverage = parseInt(document.getElementById('coverage').value);
    const planType = document.getElementById('planType').value;
    const term = parseInt(document.getElementById('term').value);
    const smoking = document.getElementById('smoking').value;
    
    // Calculate premium based on various factors
    const premium = calculatePremium(age, gender, coverage, planType, term, smoking);
    
    displayPremiumResult(premium, coverage, planType, term);
});

function calculatePremium(age, gender, coverage, planType, term, smoking) {
    // Base rate per lakh of coverage
    let baseRates = {
        term: 150,      // ₹150 per lakh per year
        whole: 800,     // ₹800 per lakh per year
        ulip: 600,      // ₹600 per lakh per year
        endowment: 1200 // ₹1200 per lakh per year
    };
    
    let baseRate = baseRates[planType] || 150;
    let coverageInLakhs = coverage / 100000;
    
    // Age factor
    let ageFactor = 1;
    if (age <= 25) ageFactor = 0.8;
    else if (age <= 35) ageFactor = 1;
    else if (age <= 45) ageFactor = 1.3;
    else if (age <= 55) ageFactor = 1.8;
    else ageFactor = 2.5;
    
    // Gender factor (women generally get lower rates)
    let genderFactor = gender === 'female' ? 0.9 : 1;
    
    // Smoking factor
    let smokingFactor = smoking === 'yes' ? 1.5 : 1;
    
    // Term factor (longer terms get better rates for term insurance)
    let termFactor = 1;
    if (planType === 'term') {
        if (term >= 30) termFactor = 0.85;
        else if (term >= 20) termFactor = 0.9;
        else if (term >= 15) termFactor = 0.95;
    }
    
    // Calculate annual premium
    let annualPremium = baseRate * coverageInLakhs * ageFactor * genderFactor * smokingFactor * termFactor;
    
    // Round to nearest 100
    annualPremium = Math.round(annualPremium / 100) * 100;
    
    return {
        annual: annualPremium,
        monthly: Math.round(annualPremium / 12),
        total: annualPremium * term
    };
}

function displayPremiumResult(premium, coverage, planType, term) {
    const resultDiv = document.getElementById('calculatorResult');
    
    const planNames = {
        term: 'Term Life Insurance',
        whole: 'Whole Life Insurance',
        ulip: 'ULIP',
        endowment: 'Endowment Plan'
    };
    
    resultDiv.innerHTML = `
        <div class="result-content">
            <div class="premium-amount">₹${premium.monthly.toLocaleString()}</div>
            <div class="premium-period">per month</div>
            
            <div class="result-details">
                <div class="detail-row">
                    <span>Plan Type:</span>
                    <span>${planNames[planType]}</span>
                </div>
                <div class="detail-row">
                    <span>Coverage Amount:</span>
                    <span>₹${(coverage/100000).toLocaleString()} Lakh</span>
                </div>
                <div class="detail-row">
                    <span>Policy Term:</span>
                    <span>${term} years</span>
                </div>
                <div class="detail-row">
                    <span>Annual Premium:</span>
                    <span>₹${premium.annual.toLocaleString()}</span>
                </div>
                <div class="detail-row">
                    <span>Total Premium:</span>
                    <span>₹${premium.total.toLocaleString()}</span>
                </div>
            </div>
            
            <div style="margin-top: 1.5rem;">
                <button class="cta-button primary" onclick="scrollToSection('contact')" style="margin-right: 1rem;">Get This Plan</button>
                <button class="cta-button secondary" onclick="downloadQuote()" style="background: #64748b; border: none;">Download Quote</button>
            </div>
        </div>
    `;
    
    // Add animation
    resultDiv.style.animation = 'fadeInUp 0.5s ease';
}

function downloadQuote() {
    // This would typically generate and download a PDF quote
    alert('Quote download feature will be implemented with backend integration. Please contact our experts for detailed quote.');
}

// Recommendation tabs functionality
function showRecommendation(category) {
    // Hide all tabs
    document.querySelectorAll('.recommendation-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(category).classList.add('active');
    
    // Add active class to clicked button
    event.target.classList.add('active');
}

// Consultation form submission
document.getElementById('consultationForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const submitBtn = this.querySelector('.submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const loading = submitBtn.querySelector('.loading');
    const messageDiv = document.getElementById('consultationMessage');
    
    // Show loading state
    btnText.style.display = 'none';
    loading.style.display = 'inline-block';
    submitBtn.disabled = true;
    
    // Collect form data
    const formData = new FormData(this);
    const data = Object.fromEntries(formData);
    
    try {
        const response = await submitConsultationRequest(data);
        
        if (response.success) {
            messageDiv.innerHTML = `
                <div class="message success">
                    <strong>Success!</strong> Your consultation request has been submitted. Our expert will call you within 24 hours.
                </div>
            `;
            this.reset();
        } else {
            throw new Error(response.message || 'Failed to submit consultation request');
        }
        
        messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
    } catch (error) {
        messageDiv.innerHTML = `
            <div class="message error">
                <strong>Error!</strong> ${error.message || 'Something went wrong. Please try again or call us directly.'}
            </div>
        `;
    } finally {
        btnText.style.display = 'inline';
        loading.style.display = 'none';
        submitBtn.disabled = false;
    }
});

// API Functions (to be replaced with actual backend calls)
async function submitConsultationRequest(data) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // This would be replaced with actual API call
    // Example: const response = await fetch('/api/consultation', { method: 'POST', body: JSON.stringify(data) });
    
    // Simulated response
    return {
        success: true,
        message: 'Consultation request submitted successfully',
        consultationId: 'CONS' + Date.now()
    };
}

// Form validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[+]?[\d\s\-\(\)]{10,}$/;
    return re.test(phone);
}

// Add real-time validation to forms
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

// Enhanced form validation with custom messages
const validationMessages = {
    valueMissing: 'This field is required',
    typeMismatch: 'Please enter a valid value',
    tooShort: 'Please enter at least {minlength} characters',
    tooLong: 'Please enter no more than {maxlength} characters',
    patternMismatch: 'Please match the requested format'
};

function setupFormValidation() {
    document.querySelectorAll('input, select, textarea').forEach(field => {
        field.addEventListener('invalid', function(e) {
            e.preventDefault();
            const validity = this.validity;
            
            let message = '';
            if (validity.valueMissing) {
                message = validationMessages.valueMissing;
            } else if (validity.typeMismatch) {
                message = validationMessages.typeMismatch;
            } else if (validity.tooShort) {
                message = validationMessages.tooShort.replace('{minlength}', this.minLength);
            } else if (validity.tooLong) {
                message = validationMessages.tooLong.replace('{maxlength}', this.maxLength);
            } else if (validity.patternMismatch) {
                message = validationMessages.patternMismatch;
            }
            
            this.setCustomValidity(message);
        });
        
        field.addEventListener('input', function() {
            this.setCustomValidity('');
            this.style.borderColor = '';
        });
    });
}

// Initialize form validation
setupFormValidation();

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

// Analytics and tracking (placeholder)
function trackEvent(eventName, eventData = {}) {
    // Placeholder for analytics tracking
    console.log('Event tracked:', eventName, eventData);
    
    // Here you would typically send data to your analytics service
    // Example: gtag('event', eventName, eventData);
}

// Track important user interactions
document.querySelectorAll('.cta-button').forEach(button => {
    button.addEventListener('click', function() {
        trackEvent('cta_click', {
            button_text: this.textContent.trim(),
            button_location: this.closest('section')?.id || 'unknown'
        });
    });
});

document.querySelectorAll('.plan-btn').forEach(button => {
    button.addEventListener('click', function() {
        const planType = this.closest('.type-card')?.querySelector('h3')?.textContent || 'unknown';
        trackEvent('plan_interest', {
            plan_type: planType
        });
    });
});

// Track calculator usage
document.getElementById('premiumCalculator').addEventListener('submit', function() {
    trackEvent('premium_calculation', {
        plan_type: document.getElementById('planType').value,
        coverage_amount: document.getElementById('coverage').value,
        age: document.getElementById('age').value
    });
});

// Track consultation form submissions
document.getElementById('consultationForm').addEventListener('submit', function() {
    trackEvent('consultation_request', {
        plan_interest: document.getElementById('planInterest').value
    });
});

// Page load performance optimization
document.addEventListener('DOMContentLoaded', function() {
    // Lazy load images that are not in viewport
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
});

// Initialize everything when page loads
window.addEventListener('load', function() {
    // Remove loading states
    document.body.classList.add('loaded');
    
    // Start animations
    setTimeout(() => {
        document.querySelectorAll('.fade-in').forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('visible');
            }, index * 100);
        });
    }, 500);
    
    console.log('SAS Policy Value Hub Services - Life Insurance page loaded successfully!');
});

// Error handling for failed resource loads
window.addEventListener('error', function(e) {
    console.warn('Resource failed to load:', e.target);
    // You could implement fallback mechanisms here
});

// Handle connection status
window.addEventListener('online', function() {
    console.log('Connection restored');
    // You could show a notification or retry failed requests
});

window.addEventListener('offline', function() {
    console.log('Connection lost');
    // You could show an offline message
});

// Additional utility functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(amount);
}

function formatNumber(number) {
    return new Intl.NumberFormat('en-IN').format(number);
}

// Local storage for calculator preferences (if needed)
function saveCalculatorData(data) {
    try {
        localStorage.setItem('lifeInsuranceCalculator', JSON.stringify(data));
    } catch (e) {
        console.warn('Could not save calculator data:', e);
    }
}

function loadCalculatorData() {
    try {
        const data = localStorage.getItem('lifeInsuranceCalculator');
        return data ? JSON.parse(data) : null;
    } catch (e) {
        console.warn('Could not load calculator data:', e);
        return null;
    }
}

// Auto-save calculator inputs
function setupAutoSave() {
    const calculatorForm = document.getElementById('premiumCalculator');
    const inputs = calculatorForm.querySelectorAll('input, select');
    
    inputs.forEach(input => {
        input.addEventListener('change', function() {
            const formData = new FormData(calculatorForm);
            const data = Object.fromEntries(formData);
            saveCalculatorData(data);
        });
    });
    
    // Load saved data on page load
    const savedData = loadCalculatorData();
    if (savedData) {
        inputs.forEach(input => {
            if (savedData[input.name]) {
                input.value = savedData[input.name];
            }
        });
    }
}

// Initialize auto-save
setupAutoSave();

// Smooth reveal animations for sections
function revealSections() {
    const sections = document.querySelectorAll('section');
    const revealSection = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    };
    
    const sectionObserver = new IntersectionObserver(revealSection, {
        threshold: 0.15
    });
    
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
}

// Initialize section reveals
revealSections();

// Print functionality
function printPage() {
    window.print();
}

// Share functionality
function shareContent(platform) {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent('Life Insurance Services | SAS Policy Value Hub');
    const text = encodeURIComponent('Secure your family\'s financial future with comprehensive life insurance solutions.');
    
    let shareUrl = '';
    
    switch(platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
            break;
        case 'linkedin':
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
            break;
        case 'whatsapp':
            shareUrl = `https://wa.me/?text=${text}%20${url}`;
            break;
        default:
            // Native Web Share API
            if (navigator.share) {
                navigator.share({
                    title: 'Life Insurance Services | SAS Policy Value Hub',
                    text: 'Secure your family\'s financial future with comprehensive life insurance solutions.',
                    url: window.location.href
                });
                return;
            }
    }
    
    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
    }
}

// Advanced calculator features
function compareQuotes() {
    alert('Quote comparison feature will be available with multiple insurance providers. Contact our experts for detailed comparison.');
}

function scheduleCallback() {
    alert('Callback scheduling feature will be integrated with our CRM system. Please use the contact form for now.');
}

// Accessibility enhancements
function enhanceAccessibility() {
    // Add skip links
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: #000;
        color: #fff;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 1000;
    `;
    skipLink.addEventListener('focus', function() {
        this.style.top = '6px';
    });
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main content landmark
    const mainContent = document.querySelector('.hero');
    if (mainContent) {
        mainContent.id = 'main-content';
    }
    
    // Enhance focus indicators
    const style = document.createElement('style');
    style.textContent = `
        *:focus {
            outline: 3px solid #3b82f6 !important;
            outline-offset: 2px !important;
        }
    `;
    document.head.appendChild(style);
}

// Initialize accessibility enhancements
enhanceAccessibility();