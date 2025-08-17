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
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Animated counters for overview stats
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const speed = 200;

    counters.forEach(counter => {
        const target = +counter.getAttribute('data-count');
        const count = +counter.innerText;
        const increment = target / speed;
        
        if (count < target) {
            counter.innerText = Math.ceil(count + increment);
            setTimeout(() => animateCounters(), 1);
        } else {
            counter.innerText = target;
        }
    });
}

// Intersection Observer for animations
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

// Observe fade-in elements
document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// Trigger counter animation when overview section is visible
const overviewSection = document.querySelector('.services-overview');
if (overviewSection) {
    const overviewObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                overviewObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    overviewObserver.observe(overviewSection);
}

// Service details data
const serviceDetails = {
    health: {
        title: 'Health Insurance',
        icon: '🏥',
        description: 'Comprehensive medical coverage for individuals and families with extensive hospital network and cashless facilities.',
        features: [
            'Cashless treatment at 10,000+ network hospitals nationwide',
            'Pre and post hospitalization expenses coverage up to policy limit',
            'Day care procedures and outpatient treatments',
            'Ambulance charges coverage up to specified limits',
            'Annual health check-ups for preventive care',
            'Critical illness riders for additional protection',
            'Maternity and newborn coverage with waiting periods',
            'Mental health treatment and therapy coverage',
            'Organ transplant coverage including donor expenses',
            'Home healthcare services for post-surgery recovery'
        ],
        benefits: [
            'Sum insured options from ₹2 Lakhs to ₹1 Crore',
            'No waiting period for accidental hospitalization',
            'Lifetime renewability with no age limit',
            'Tax benefits under Section 80D up to ₹25,000',
            'Cumulative bonus for claim-free years',
            'Coverage for pre-existing diseases after waiting period'
        ],
        plans: [
            { name: 'Basic Plan', coverage: '₹2-5 Lakhs', premium: '₹150/month' },
            { name: 'Standard Plan', coverage: '₹5-10 Lakhs', premium: '₹250/month' },
            { name: 'Premium Plan', coverage: '₹10-25 Lakhs', premium: '₹400/month' },
            { name: 'Super Premium', coverage: '₹25 Lakhs-1 Crore', premium: '₹800/month' }
        ]
    },
    life: {
        title: 'Life Insurance',
        icon: '👨‍👩‍👧‍👦',
        description: 'Secure your family\'s financial future with comprehensive life insurance plans including term, whole life, and investment options.',
        features: [
            'High coverage amounts up to ₹10 Crores at affordable premiums',
            'Term life insurance with pure protection benefits',
            'Whole life insurance with savings component',
            'Endowment policies combining insurance and investment',
            'Unit-linked insurance plans (ULIPs) for wealth creation',
            'Child education and marriage benefit plans',
            'Retirement and pension plans for golden years',
            'Accidental death and disability benefit riders',
            'Critical illness and terminal illness riders',
            'Waiver of premium in case of disability'
        ],
        benefits: [
            'Flexible premium payment options - monthly, quarterly, yearly',
            'Tax benefits under Section 80C up to ₹1.5 Lakhs',
            'Tax-free maturity benefits under Section 10(10D)',
            'Loan facility against policy after 3 years',
            'Guaranteed additions and bonuses',
            'Free look period of 15-30 days'
        ],
        plans: [
            { name: 'Term Life', coverage: '₹25 Lakhs-10 Crores', premium: '₹500/month' },
            { name: 'Whole Life', coverage: '₹10-50 Lakhs', premium: '₹1,200/month' },
            { name: 'Endowment', coverage: '₹5-25 Lakhs', premium: '₹2,000/month' },
            { name: 'ULIP', coverage: '₹10 Lakhs-1 Crore', premium: '₹3,000/month' }
        ]
    },
    motor: {
        title: 'Motor Insurance',
        icon: '🚗',
        description: 'Complete vehicle protection with comprehensive coverage, third-party liability, and value-added services.',
        features: [
            'Comprehensive damage coverage for own vehicle',
            'Third-party liability coverage as per Motor Vehicle Act',
            'Theft and fire protection with 24/7 claim support',
            'Natural disaster coverage including floods and earthquakes',
            'Personal accident cover for owner-driver',
            'Zero depreciation add-on for new vehicles',
            'Engine protection cover against water damage',
            'Roadside assistance including towing and battery jumpstart',
            'Key replacement and lock repair coverage',
            'Return to invoice coverage for total loss cases'
        ],
        benefits: [
            'Instant policy issuance within 5 minutes online',
            'Cashless garage network of 5,000+ authorized centers',
            'No-claim bonus up to 50% for claim-free years',
            'Easy online renewal with just few clicks',
            'Quick claim settlement within 7 working days',
            'Mobile app for easy policy management'
        ],
        plans: [
            { name: 'Third Party Only', coverage: 'Legal Liability Only', premium: '₹2,500/year' },
            { name: 'Comprehensive', coverage: 'Own Damage + Third Party', premium: '₹6,000/year' },
            { name: 'Super Comprehensive', coverage: 'All Damages + Add-ons', premium: '₹9,000/year' }
        ]
    },
    travel: {
        title: 'Travel Insurance',
        icon: '✈️',
        description: 'Comprehensive travel protection for domestic and international trips with medical emergencies and trip-related benefits.',
        features: [
            'Medical emergency coverage up to specified limits worldwide',
            'Emergency medical evacuation and repatriation',
            'Trip cancellation and interruption benefits',
            'Flight delay and missed connection compensation',
            'Baggage loss, delay, and damage coverage',
            'Personal liability coverage during travel',
            'Adventure sports coverage for specific activities',
            '24/7 global assistance helpline in multiple languages',
            'Coverage for pre-existing medical conditions',
            'Hijack and kidnap coverage for high-risk destinations'
        ],
        benefits: [
            'Worldwide coverage including USA, Europe, and Asia',
            'Instant policy issuance for last-minute travel',
            'Multi-trip annual policies for frequent travelers',
            'Family plans covering spouse and dependent children',
            'Senior citizen plans with enhanced medical coverage',
            'Student travel plans with extended duration coverage'
        ],
        plans: [
            { name: 'Domestic Travel', coverage: '₹1-5 Lakhs', premium: '₹99/trip' },
            { name: 'Asia Travel', coverage: '₹2-10 Lakhs', premium: '₹299/trip' },
            { name: 'Worldwide Travel', coverage: '₹5-50 Lakhs', premium: '₹999/trip' },
            { name: 'Annual Multi-trip', coverage: '₹10-25 Lakhs', premium: '₹2,999/year' }
        ]
    },
    home: {
        title: 'Home Insurance',
        icon: '🏠',
        description: 'Protect your home and belongings against fire, theft, natural disasters, and other unforeseen events.',
        features: [
            'Structure coverage against fire, explosion, and natural disasters',
            'Contents insurance for household items and electronics',
            'Theft and burglary coverage with police report requirement',
            'Public liability coverage for third-party injuries',
            'Temporary accommodation expenses during repairs',
            'Electronic equipment and gadget protection',
            'Jewelry and valuables coverage with proper valuation',
            'Home loan protection in case of total loss',
            'Legal expenses coverage for property disputes',
            'Identity theft and credit card fraud protection'
        ],
        benefits: [
            'Sum insured options from ₹5 Lakhs to ₹2 Crores',
            'No depreciation on building structure claims',
            'Replacement cost coverage for contents',
            'Easy documentation with minimal paperwork',
            'Quick claim settlement with approved vendors',
            'Annual property maintenance services'
        ],
        plans: [
            { name: 'Basic Home', coverage: '₹5-15 Lakhs', premium: '₹1,500/year' },
            { name: 'Standard Home', coverage: '₹15-50 Lakhs', premium: '₹3,500/year' },
            { name: 'Premium Home', coverage: '₹50 Lakhs-2 Crores', premium: '₹8,000/year' }
        ]
    },
    business: {
        title: 'Business Insurance',
        icon: '🏢',
        description: 'Comprehensive coverage for businesses including property, liability, and key person insurance.',
        features: [
            'Commercial property insurance for buildings and equipment',
            'Public liability coverage for customer injuries',
            'Product liability insurance for manufacturing defects',
            'Professional indemnity for service-based businesses',
            'Key person insurance for critical employees',
            'Business interruption coverage for lost income',
            'Cyber liability insurance for data breaches',
            'Directors and officers liability coverage',
            'Employment practices liability insurance',
            'Commercial vehicle coverage for company fleet'
        ],
        benefits: [
            'Customized coverage based on business type and size',
            'Risk assessment and management services',
            'Claims management with dedicated business claim handlers',
            'Legal support for liability claims',
            'Business continuity planning assistance',
            'Premium discounts for good safety records'
        ],
        plans: [
            { name: 'Small Business', coverage: '₹10-50 Lakhs', premium: '₹5,000/year' },
            { name: 'Medium Business', coverage: '₹50 Lakhs-5 Crores', premium: '₹15,000/year' },
            { name: 'Large Enterprise', coverage: '₹5-50 Crores', premium: '₹50,000/year' }
        ]
    },
    personal: {
        title: 'Personal Accident Insurance',
        icon: '🛡️',
        description: 'Individual and group personal accident insurance with disability and accidental death benefits.',
        features: [
            'Accidental death benefit for nominees',
            'Permanent total disability coverage',
            'Permanent partial disability benefits',
            'Temporary total disability coverage',
            'Accidental medical expenses reimbursement',
            'Hospitalization daily cash allowance',
            'Ambulance expenses coverage',
            'Burns and fracture benefits',
            'Coma benefit for extended unconsciousness',
            'Education benefit for dependent children'
        ],
        benefits: [
            'Coverage from ₹1 Lakh to ₹1 Crore',
            'Worldwide coverage 24/7',
            'No medical examination required',
            'Quick claim settlement process',
            'Family plans available',
            'Group coverage for employees'
        ],
        plans: [
            { name: 'Individual PA', coverage: '₹1-10 Lakhs', premium: '₹200/year' },
            { name: 'Family PA', coverage: '₹5-25 Lakhs', premium: '₹500/year' },
            { name: 'Group PA', coverage: '₹2-50 Lakhs', premium: '₹100/person/year' }
        ]
    }
};

// Open service details modal
function openServiceDetails(serviceType) {
    const modal = document.getElementById('serviceDetailsModal');
    const content = document.getElementById('serviceDetailsContent');
    
    const service = serviceDetails[serviceType];
    if (service) {
        content.innerHTML = `
            <div class="service-details">
                <div class="service-details-header">
                    <div class="service-icon-large">${service.icon}</div>
                    <h2>${service.title}</h2>
                    <p class="service-details-description">${service.description}</p>
                </div>
                
                <div class="service-details-content">
                    <div class="details-section">
                        <h3>Key Features</h3>
                        <ul class="features-list">
                            ${service.features.map(feature => `<li>${feature}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="details-section">
                        <h3>Key Benefits</h3>
                        <ul class="benefits-list">
                            ${service.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="details-section">
                        <h3>Available Plans</h3>
                        <div class="plans-grid">
                            ${service.plans.map(plan => `
                                <div class="plan-card">
                                    <h4>${plan.name}</h4>
                                    <p class="coverage">Coverage: ${plan.coverage}</p>
                                    <p class="premium">Premium: ${plan.premium}</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
                
                <div class="details-actions">
                    <button class="btn-primary large" onclick="closeModal('serviceDetailsModal'); openQuoteModal('${serviceType}');">Get Quote for ${service.title}</button>
                    <button class="btn-secondary large" onclick="closeModal('serviceDetailsModal'); window.location.href='contact.html';">Contact Expert</button>
                </div>
            </div>
        `;
        
        // Add dynamic styles for the modal content
        const style = document.createElement('style');
        style.textContent = `
            .service-details-header {
                text-align: center;
                margin-bottom: 2rem;
            }
            
            .service-icon-large {
                font-size: 4rem;
                margin-bottom: 1rem;
            }
            
            .service-details h2 {
                color: #1e40af;
                margin-bottom: 1rem;
                font-size: 2rem;
            }
            
            .service-details-description {
                color: #64748b;
                font-size: 1.1rem;
                line-height: 1.6;
            }
            
            .details-section {
                margin-bottom: 2rem;
            }
            
            .details-section h3 {
                color: #1e293b;
                margin-bottom: 1rem;
                font-size: 1.3rem;
                font-weight: 600;
            }
            
            .features-list, .benefits-list {
                list-style: none;
                padding: 0;
            }
            
            .features-list li, .benefits-list li {
                color: #64748b;
                margin-bottom: 0.8rem;
                padding-left: 20px;
                position: relative;
                line-height: 1.6;
            }
            
            .features-list li::before {
                content: '✓';
                position: absolute;
                left: 0;
                color: #3b82f6;
                font-weight: bold;
            }
            
            .benefits-list li::before {
                content: '★';
                position: absolute;
                left: 0;
                color: #f59e0b;
                font-weight: bold;
            }
            
            .plans-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 1rem;
            }
            
            .plan-card {
                background: #f8fafc;
                padding: 1.5rem;
                border-radius: 10px;
                border: 1px solid #e2e8f0;
                text-align: center;
            }
            
            .plan-card h4 {
                color: #1e40af;
                margin-bottom: 0.5rem;
                font-weight: 600;
            }
            
            .coverage, .premium {
                color: #64748b;
                margin-bottom: 0.5rem;
                font-size: 0.9rem;
            }
            
            .premium {
                font-weight: 600;
                color: #1e40af;
            }
            
            .details-actions {
                text-align: center;
                margin-top: 2rem;
                padding-top: 2rem;
                border-top: 1px solid #e2e8f0;
            }
            
            .details-actions .btn-primary,
            .details-actions .btn-secondary {
                margin: 0.5rem;
            }
        `;
        document.head.appendChild(style);
        
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

// Open quote modal
function openQuoteModal(serviceType) {
    const modal = document.getElementById('quoteModal');
    const serviceTypeField = document.getElementById('serviceType');
    
    if (serviceTypeField) {
        serviceTypeField.value = serviceType || 'general';
    }
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Close modal
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

// Quote form submission
document.getElementById('quoteForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const submitBtn = this.querySelector('.btn-primary');
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
        const response = await submitQuoteRequest(data);
        
        if (response.success) {
            messageDiv.innerHTML = `
                <div class="message success">
                    <strong>Success!</strong> Your quote request has been submitted. Our team will contact you within 24 hours with a personalized quote.
                </div>
            `;
            this.reset();
        } else {
            throw new Error(response.message || 'Failed to submit quote request');
        }
        
        messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
    } catch (error) {
        messageDiv.innerHTML = `
            <div class="message error">
                <strong>Error!</strong> ${error.message || 'Something went wrong. Please try again or contact us directly.'}
            </div>
        `;
    } finally {
        btnText.style.display = 'inline';
        loading.style.display = 'none';
        submitBtn.disabled = false;
    }
});

// API function to submit quote request
async function submitQuoteRequest(data) {
    try {
        const response = await fetch('/api/quote', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        // Simulate API response for demo
        await new Promise(resolve => setTimeout(resolve, 2000));
        return {
            success: true,
            message: 'Quote request submitted successfully',
            quoteId: 'QT' + Date.now()
        };
    }
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

// Real-time form validation
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

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = header.offsetHeight;
            const targetPosition = target.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Service card hover effects
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Additional card hover effects
document.querySelectorAll('.additional-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px)';
        this.style.boxShadow = '0 15px 40px rgba(0,0,0,0.1)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 8px 30px rgba(0,0,0,0.06)';
    });
});

// Step card animations
document.querySelectorAll('.step-card').forEach((card, index) => {
    card.style.animationDelay = `${index * 0.2}s`;
    card.classList.add('fade-in');
});

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal').forEach(modal => {
            if (modal.style.display === 'block') {
                closeModal(modal.id);
            }
        });
    }
});

// Service search functionality
function createSearchFilter() {
    const searchContainer = document.querySelector('.main-services .container');
    if (searchContainer) {
        const searchDiv = document.createElement('div');
        searchDiv.className = 'search-container';
        searchDiv.style.cssText = `
            text-align: center;
            margin-bottom: 2rem;
            padding: 1rem;
            background: #f8fafc;
            border-radius: 15px;
        `;
        
        searchDiv.innerHTML = `
            <input type="text" id="serviceSearch" placeholder="Search services..." style="
                padding: 12px 20px;
                border: 1px solid #d1d5db;
                border-radius: 25px;
                width: 300px;
                max-width: 100%;
                font-size: 1rem;
                outline: none;
                transition: all 0.3s ease;
            ">
        `;
        
        const sectionTitle = searchContainer.querySelector('.section-title');
        sectionTitle.parentNode.insertBefore(searchDiv, sectionTitle.nextSibling);
        
        // Search functionality
        const searchInput = document.getElementById('serviceSearch');
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const serviceCards = document.querySelectorAll('.service-card, .additional-card');
            
            serviceCards.forEach(card => {
                const title = card.querySelector('h3, h4').textContent.toLowerCase();
                const description = card.querySelector('p').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || description.includes(searchTerm)) {
                    card.style.display = 'block';
                    card.style.opacity = '1';
                } else {
                    card.style.opacity = '0.3';
                }
            });
        });
        
        searchInput.addEventListener('focus', function() {
            this.style.borderColor = '#3b82f6';
            this.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
        });
        
        searchInput.addEventListener('blur', function() {
            this.style.borderColor = '#d1d5db';
            this.style.boxShadow = 'none';
        });
    }
}

// Analytics tracking
function trackEvent(eventName, eventData = {}) {
    console.log('Event tracked:', eventName, eventData);
    // Here you would typically send data to your analytics service
    // Example: gtag('event', eventName, eventData);
}

// Track user interactions
document.querySelectorAll('.btn-primary, .btn-secondary').forEach(button => {
    button.addEventListener('click', function() {
        trackEvent('button_click', {
            button_text: this.textContent.trim(),
            button_location: this.closest('section')?.className || 'unknown'
        });
    });
});

document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('click', function() {
        const serviceName = this.querySelector('h3').textContent;
        trackEvent('service_card_click', {
            service_name: serviceName
        });
    });
});

// Page load performance
document.addEventListener('DOMContentLoaded', function() {
    // Initialize search filter
    createSearchFilter();
    
    // Lazy load images
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
    document.body.classList.add('loaded');
    
    // Stagger fade-in animations
    setTimeout(() => {
        document.querySelectorAll('.fade-in').forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('visible');
            }, index * 100);
        });
    }, 300);
    
    console.log('SAS Policy Value Hub Services - Services page loaded successfully!');
});

// Error handling
window.addEventListener('error', function(e) {
    console.warn('Resource failed to load:', e.target);
});

// Connection status handling
window.addEventListener('online', function() {
    console.log('Connection restored');
});

window.addEventListener('offline', function() {
    console.log('Connection lost');
    const offlineMessage = document.createElement('div');
    offlineMessage.style.cssText = `
        position: fixed;
        top: 80px;
        left: 50%;
        transform: translateX(-50%);
        background: #fee2e2;
        color: #dc2626;
        padding: 1rem 2rem;
        border-radius: 10px;
        z-index: 10001;
        border: 1px solid #fecaca;
    `;
    offlineMessage.textContent = 'You are currently offline. Some features may not work.';
    document.body.appendChild(offlineMessage);
    
    setTimeout(() => {
        if (document.body.contains(offlineMessage)) {
            document.body.removeChild(offlineMessage);
        }
    }, 5000);
});