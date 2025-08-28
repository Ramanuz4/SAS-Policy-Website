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

// Navigate to home page
function goToHome() {
    window.location.href = '/';
}

// Update active navigation link
function updateActiveNavLink() {
    const sections = ['home', 'motor-types', 'features', 'benefits', 'quote', 'contact'];
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
document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// Vehicle data for quote form
const vehicleData = {
    car: {
        makes: ['Maruti Suzuki', 'Hyundai', 'Tata', 'Mahindra', 'Honda', 'Toyota', 'Ford', 'Volkswagen', 'Skoda', 'Renault'],
        models: {
            'Maruti Suzuki': ['Swift', 'Baleno', 'Alto', 'WagonR', 'Dzire', 'Vitara Brezza', 'Ertiga', 'Ciaz'],
            'Hyundai': ['i20', 'Creta', 'Verna', 'Grand i10', 'Venue', 'Elantra', 'Tucson'],
            'Tata': ['Nexon', 'Harrier', 'Safari', 'Altroz', 'Tiago', 'Tigor', 'Punch'],
            'Honda': ['City', 'Amaze', 'Jazz', 'WR-V', 'CR-V', 'Civic'],
            'Toyota': ['Innova Crysta', 'Fortuner', 'Camry', 'Glanza', 'Urban Cruiser', 'Yaris'],
            'Mahindra': ['XUV700', 'Scorpio', 'Bolero', 'Thar', 'XUV300', 'KUV100'],
            'Ford': ['EcoSport', 'Figo', 'Aspire', 'Endeavour'],
            'Volkswagen': ['Polo', 'Vento', 'Tiguan', 'T-Roc'],
            'Skoda': ['Rapid', 'Octavia', 'Superb', 'Kushaq'],
            'Renault': ['Kwid', 'Duster', 'Captur', 'Triber']
        }
    },
    bike: {
        makes: ['Hero', 'Honda', 'TVS', 'Bajaj', 'Royal Enfield', 'Yamaha', 'KTM', 'Suzuki'],
        models: {
            'Hero': ['Splendor Plus', 'HF Deluxe', 'Passion Pro', 'Glamour', 'Xtreme 160R', 'Xpulse 200'],
            'Honda': ['Activa 6G', 'CB Shine', 'Hornet 2.0', 'CB350RS', 'Dio', 'SP 125'],
            'TVS': ['Jupiter', 'Apache RTR 160', 'Apache RTR 200', 'Ntorq 125', 'Star City Plus'],
            'Bajaj': ['Pulsar 150', 'Pulsar NS200', 'Avenger Cruise 220', 'CT 100', 'Chetak'],
            'Royal Enfield': ['Classic 350', 'Bullet 350', 'Himalayan', 'Interceptor 650', 'Meteor 350'],
            'Yamaha': ['FZ-S', 'MT-15', 'R15 V4', 'Fascino 125', 'Ray ZR'],
            'KTM': ['Duke 200', 'Duke 390', 'RC 200', 'RC 390', 'Adventure 390'],
            'Suzuki': ['Access 125', 'Burgman Street', 'Gixxer', 'Gixxer SF', 'Avenis']
        }
    },
    commercial: {
        makes: ['Tata', 'Ashok Leyland', 'Mahindra', 'Eicher', 'Bharat Benz', 'Volvo', 'Force'],
        models: {
            'Tata': ['Ace Gold', 'Super Ace', '407', 'LPT 709', 'Signa', 'Prima'],
            'Ashok Leyland': ['Dost', 'Partner', 'Boss', 'Captain', 'Stallion'],
            'Mahindra': ['Bolero Pickup', 'Jeeto', 'Furio', 'Blazo'],
            'Eicher': ['Pro 1049', 'Pro 2049', 'Pro 3009', 'Pro 6025'],
            'Bharat Benz': ['914R', '1617R', '2523R', '3528C'],
            'Volvo': ['FM', 'FH', 'FMX'],
            'Force': ['Traveller', 'Trax', 'Cruiser', 'Tempo Traveller']
        }
    }
};

// Update vehicle options based on selected type
function updateVehicleOptions() {
    const vehicleType = document.getElementById('vehicleType').value;
    const makeSelect = document.getElementById('make');
    const modelSelect = document.getElementById('model');
    const vehicleDetailsRow = document.getElementById('vehicleDetailsRow');
    
    // Clear existing options
    makeSelect.innerHTML = '<option value="">Select Make</option>';
    modelSelect.innerHTML = '<option value="">Select Model</option>';
    
    if (vehicleType && vehicleData[vehicleType]) {
        // Show vehicle details row
        vehicleDetailsRow.style.display = 'grid';
        
        // Populate makes
        vehicleData[vehicleType].makes.forEach(make => {
            const option = document.createElement('option');
            option.value = make;
            option.textContent = make;
            makeSelect.appendChild(option);
        });
    } else {
        vehicleDetailsRow.style.display = 'none';
    }
}

// Update models based on selected make
function updateModels() {
    const vehicleType = document.getElementById('vehicleType').value;
    const selectedMake = document.getElementById('make').value;
    const modelSelect = document.getElementById('model');
    
    // Clear existing options
    modelSelect.innerHTML = '<option value="">Select Model</option>';
    
    if (vehicleType && selectedMake && vehicleData[vehicleType].models[selectedMake]) {
        vehicleData[vehicleType].models[selectedMake].forEach(model => {
            const option = document.createElement('option');
            option.value = model;
            option.textContent = model;
            modelSelect.appendChild(option);
        });
    }
}

// Populate manufacturing years
function populateYears() {
    const yearSelect = document.getElementById('manufacturingYear');
    const currentYear = new Date().getFullYear();
    
    for (let year = currentYear; year >= 1990; year--) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    }
}

// Format registration number
document.getElementById('registrationNumber').addEventListener('input', function(e) {
    this.value = this.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
});

// Format mobile number
document.getElementById('mobile').addEventListener('input', function(e) {
    this.value = this.value.replace(/[^0-9]/g, '').slice(0, 10);
});

// Modal functionality
function openQuoteModal() {
    const modal = document.getElementById('quoteModal');
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function openPlanModal(planType) {
    const modal = document.getElementById('planModal');
    const content = document.getElementById('planModalContent');
    
    const planDetails = {
        comprehensive: {
            title: 'Comprehensive Motor Insurance',
            icon: '🛡️',
            description: 'Complete protection for your vehicle with extensive coverage',
            coverage: [
                'Own damage due to accidents, collisions, fire, theft',
                'Third-party liability coverage (mandatory)',
                'Natural calamities: Flood, earthquake, cyclone, landslide',
                'Man-made perils: Riots, strikes, terrorism, vandalism',
                'Personal accident cover for owner-driver',
                'Medical expenses for accidents'
            ],
            addOns: [
                'Zero Depreciation Cover - Get full claim amount without depreciation',
                'Engine Protection Cover - Protection against water damage to engine',
                'Roadside Assistance - 24x7 emergency support',
                'Return to Invoice - Get invoice value in case of total loss',
                'Consumable Cover - Coverage for consumables during repairs',
                'Key Replacement Cover - Cost of duplicate keys',
                'Tyre Protection Cover - Protection against tyre damage'
            ],
            benefits: [
                'Cashless repairs at 5000+ network garages',
                'No-claim bonus up to 50%',
                'Multi-year policies available',
                'Instant policy issuance',
                '24/7 claim support'
            ],
            premiumRange: '₹8,000 - ₹25,000 annually'
        },
        'third-party': {
            title: 'Third-Party Liability Insurance',
            icon: '⚖️',
            description: 'Mandatory basic coverage as per Indian Motor Vehicle Act',
            coverage: [
                'Third-party bodily injury or death - Unlimited coverage',
                'Third-party property damage - Up to ₹7.5 lakhs',
                'Legal liability arising from vehicle use',
                'Court case expenses and legal costs'
            ],
            limitations: [
                'No coverage for own vehicle damage',
                'No theft protection',
                'No natural disaster coverage',
                'No personal accident cover',
                'No add-on benefits available'
            ],
            benefits: [
                'Legally mandatory coverage',
                'Most affordable option',
                'Valid across India',
                'Easy renewal process'
            ],
            premiumRange: '₹2,000 - ₹8,000 annually'
        },
        commercial: {
            title: 'Commercial Vehicle Insurance',
            icon: '🚛',
            description: 'Specialized insurance for business and commercial vehicles',
            coverage: [
                'Goods carrying vehicles: Trucks, tempos, mini trucks',
                'Passenger vehicles: Buses, taxis, auto-rickshaws',
                'Special purpose vehicles: Ambulances, fire engines',
                'Construction equipment and machinery',
                'Agricultural tractors and implements'
            ],
            features: [
                'Goods in Transit (GIT) coverage',
                'Driver and conductor personal accident cover',
                'Passenger liability coverage',
                'Loss of income due to vehicle breakdown',
                'Flexible payment terms and options'
            ],
            benefits: [
                'Customized coverage based on business needs',
                'Fleet insurance discounts',
                'Dedicated commercial vehicle claim support',
                'Business continuity protection',
                'Tax benefits for businesses'
            ],
            premiumRange: '₹15,000 - ₹50,000+ annually'
        },
        'two-wheeler': {
            title: 'Two-Wheeler Insurance',
            icon: '🏍️',
            description: 'Comprehensive protection for motorcycles and scooters',
            coverage: [
                'Own damage due to accidents and collisions',
                'Theft and burglary protection',
                'Fire and explosion damage',
                'Natural disasters coverage',
                'Third-party liability (mandatory)',
                'Personal accident cover for rider'
            ],
            features: [
                'Pillion rider coverage',
                'Medical expenses coverage',
                'Accessories coverage',
                'Zero depreciation add-on available',
                'Engine protection for premium bikes'
            ],
            benefits: [
                'Affordable premium rates',
                'Quick claim settlement',
                'Instant policy issuance',
                'Nationwide coverage',
                'No-claim bonus benefits'
            ],
            premiumRange: '₹1,500 - ₹8,000 annually'
        }
    };
    
    const plan = planDetails[planType];
    if (plan) {
        content.innerHTML = `
            <div style="text-align: center; margin-bottom: 2rem;">
                <div style="font-size: 4rem; margin-bottom: 1rem;">${plan.icon}</div>
                <h2 style="color: #1e40af; margin-bottom: 1rem;">${plan.title}</h2>
                <p style="color: #64748b; font-size: 1.1rem; line-height: 1.6;">${plan.description}</p>
                <div style="background: #f0f9ff; padding: 1rem; border-radius: 10px; margin-top: 1rem;">
                    <strong style="color: #1e40af;">Premium Range: ${plan.premiumRange}</strong>
                </div>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr; gap: 2rem; margin-bottom: 2rem;">
                ${plan.coverage ? `
                <div>
                    <h3 style="color: #1e293b; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                        <span style="color: #3b82f6;">🛡️</span> Coverage Details
                    </h3>
                    <ul style="list-style: none; padding: 0;">
                        ${plan.coverage.map(item => `
                            <li style="margin-bottom: 0.5rem; padding-left: 20px; position: relative; color: #64748b;">
                                <span style="position: absolute; left: 0; color: #10b981; font-weight: bold;">✓</span>
                                ${item}
                            </li>
                        `).join('')}
                    </ul>
                </div>
                ` : ''}
                
                ${plan.addOns ? `
                <div>
                    <h3 style="color: #1e293b; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                        <span style="color: #f59e0b;">⭐</span> Available Add-ons
                    </h3>
                    <ul style="list-style: none; padding: 0;">
                        ${plan.addOns.map(addon => `
                            <li style="margin-bottom: 0.75rem; padding-left: 20px; position: relative; color: #64748b; line-height: 1.5;">
                                <span style="position: absolute; left: 0; color: #f59e0b; font-weight: bold;">+</span>
                                ${addon}
                            </li>
                        `).join('')}
                    </ul>
                </div>
                ` : ''}
                
                ${plan.features ? `
                <div>
                    <h3 style="color: #1e293b; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                        <span style="color: #8b5cf6;">🎯</span> Special Features
                    </h3>
                    <ul style="list-style: none; padding: 0;">
                        ${plan.features.map(feature => `
                            <li style="margin-bottom: 0.5rem; padding-left: 20px; position: relative; color: #64748b;">
                                <span style="position: absolute; left: 0; color: #8b5cf6; font-weight: bold;">•</span>
                                ${feature}
                            </li>
                        `).join('')}
                    </ul>
                </div>
                ` : ''}
                
                ${plan.limitations ? `
                <div>
                    <h3 style="color: #1e293b; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                        <span style="color: #ef4444;">⚠️</span> Limitations
                    </h3>
                    <ul style="list-style: none; padding: 0;">
                        ${plan.limitations.map(limitation => `
                            <li style="margin-bottom: 0.5rem; padding-left: 20px; position: relative; color: #64748b;">
                                <span style="position: absolute; left: 0; color: #ef4444; font-weight: bold;">✗</span>
                                ${limitation}
                            </li>
                        `).join('')}
                    </ul>
                </div>
                ` : ''}
                
                <div>
                    <h3 style="color: #1e293b; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                        <span style="color: #10b981;">💎</span> Key Benefits
                    </h3>
                    <ul style="list-style: none; padding: 0;">
                        ${plan.benefits.map(benefit => `
                            <li style="margin-bottom: 0.5rem; padding-left: 20px; position: relative; color: #64748b;">
                                <span style="position: absolute; left: 0; color: #10b981; font-weight: bold;">✓</span>
                                ${benefit}
                            </li>
                        `).join('')}
                    </ul>
                </div>
            </div>
            
            <div style="text-align: center; margin-top: 2rem; padding-top: 2rem; border-top: 1px solid #e2e8f0;">
                <button class="cta-button primary" onclick="closeModal('planModal'); scrollToSection('quote');" style="margin-right: 1rem;">Get Quote Now</button>
                <button class="cta-button secondary" onclick="closeModal('planModal'); scrollToSection('contact');">Contact Expert</button>
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

// Quote form submission
document.getElementById('motorQuoteForm').addEventListener('submit', async function(e) {
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
        const response = await submitMotorQuoteRequest(data);
        
        if (response.success) {
            messageDiv.innerHTML = `
                <div class="message success">
                    <strong>Quote Request Submitted!</strong> Our motor insurance experts will contact you within 2 hours with personalized quotes from top insurers. Quote ID: ${response.quoteId}
                </div>
            `;
            this.reset();
            updateVehicleOptions(); // Reset dependent dropdowns
        } else {
            throw new Error(response.message || 'Failed to submit quote request');
        }
        
        messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
    } catch (error) {
        messageDiv.innerHTML = `
            <div class="message error">
                <strong>Error!</strong> ${error.message || 'Something went wrong. Please try again or call us at +91 98765 43210.'}
            </div>
        `;
    } finally {
        btnText.style.display = 'inline';
        loading.style.display = 'none';
        submitBtn.disabled = false;
    }
});

// Contact form submission
document.getElementById('contactForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const submitBtn = this.querySelector('.submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const loading = submitBtn.querySelector('.loading');
    const messageDiv = document.getElementById('contactMessage');
    
    // Show loading state
    btnText.style.display = 'none';
    loading.style.display = 'inline-block';
    submitBtn.disabled = true;
    
    // Collect form data
    const formData = new FormData(this);
    const data = Object.fromEntries(formData);
    
    try {
        const response = await submitContactMessage(data);
        
        if (response.success) {
            messageDiv.innerHTML = `
                <div class="message success">
                    <strong>Message Sent!</strong> Thank you for contacting us. Our motor insurance team will get back to you within 24 hours.
                </div>
            `;
            this.reset();
        } else {
            throw new Error(response.message || 'Failed to send message');
        }
        
        messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
    } catch (error) {
        messageDiv.innerHTML = `
            <div class="message error">
                <strong>Error!</strong> ${error.message || 'Failed to send message. Please try again or call us directly at +91 98765 43210.'}
            </div>
        `;
    } finally {
        btnText.style.display = 'inline';
        loading.style.display = 'none';
        submitBtn.disabled = false;
    }
});

// API Functions (Backend integration)
async function submitMotorQuoteRequest(data) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In production, this would be an actual API call
    try {
        const response = await fetch('/api/motor-quote', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...data,
                timestamp: new Date().toISOString(),
                source: 'motor-insurance-page'
            })
        });
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        return await response.json();
    } catch (error) {
        // Fallback for demo - in production, this would handle actual errors
        console.log('Quote request data:', data);
        return {
            success: true,
            message: 'Motor insurance quote request submitted successfully',
            quoteId: 'MQ' + Date.now(),
            estimatedPremium: calculateEstimatedPremium(data)
        };
    }
}

async function submitContactMessage(data) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...data,
                timestamp: new Date().toISOString(),
                source: 'motor-insurance-contact'
            })
        });
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        return await response.json();
    } catch (error) {
        // Fallback for demo
        console.log('Contact message data:', data);
        return {
            success: true,
            message: 'Contact message sent successfully',
            messageId: 'MC' + Date.now()
        };
    }
}

// Calculate estimated premium (simplified logic)
function calculateEstimatedPremium(data) {
    let basePremium = 5000;
    
    // Adjust based on vehicle type
    if (data.vehicleType === 'car') {
        basePremium = 8000;
    } else if (data.vehicleType === 'bike') {
        basePremium = 3000;
    } else if (data.vehicleType === 'commercial') {
        basePremium = 15000;
    }
    
    // Adjust based on manufacturing year
    const currentYear = new Date().getFullYear();
    const vehicleAge = currentYear - parseInt(data.manufacturingYear);
    if (vehicleAge > 5) {
        basePremium *= 1.2;
    }
    
    // Adjust based on policy type
    if (data.policyType === 'third-party') {
        basePremium *= 0.3;
    }
    
    return Math.round(basePremium);
}

// Form validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[0-9]{10}$/;
    return re.test(phone);
}

function validateRegistrationNumber(regNo) {
    // Basic validation for Indian registration numbers
    const re = /^[A-Z]{2}[0-9]{1,2}[A-Z]{0,3}[0-9]{1,4}$/;
    return re.test(regNo);
}

// Add real-time validation
document.getElementById('email').addEventListener('blur', function() {
    if (this.value && !validateEmail(this.value)) {
        this.setCustomValidity('Please enter a valid email address');
        this.style.borderColor = '#dc2626';
    } else {
        this.setCustomValidity('');
        this.style.borderColor = '';
    }
});

document.getElementById('mobile').addEventListener('blur', function() {
    if (this.value && !validatePhone(this.value)) {
        this.setCustomValidity('Please enter a valid 10-digit mobile number');
        this.style.borderColor = '#dc2626';
    } else {
        this.setCustomValidity('');
        this.style.borderColor = '';
    }
});

document.getElementById('registrationNumber').addEventListener('blur', function() {
    if (this.value && !validateRegistrationNumber(this.value)) {
        this.setCustomValidity('Please enter a valid registration number (e.g., DL01AB1234)');
        this.style.borderColor = '#dc2626';
    } else {
        this.setCustomValidity('');
        this.style.borderColor = '';
    }
});

// Clear validation messages on input
document.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('input', function() {
        this.setCustomValidity('');
        this.style.borderColor = '';
    });
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

// Analytics tracking
function trackEvent(eventName, eventData = {}) {
    console.log('Event tracked:', eventName, eventData);
    // In production, send to analytics service
    // gtag('event', eventName, eventData);
}

// Track important interactions
document.querySelectorAll('.cta-button').forEach(button => {
    button.addEventListener('click', function() {
        trackEvent('cta_click', {
            button_text: this.textContent.trim(),
            page: 'motor-insurance',
            section: this.closest('section')?.id || 'unknown'
        });
    });
});

document.querySelectorAll('.plan-btn').forEach(button => {
    button.addEventListener('click', function() {
        const planType = this.getAttribute('onclick')?.match(/openPlanModal\('(.+?)'\)/)?.[1];
        trackEvent('plan_interest', {
            plan_type: planType,
            page: 'motor-insurance'
        });
    });
});

// Track form submissions
document.getElementById('motorQuoteForm').addEventListener('submit', function() {
    trackEvent('motor_quote_submit', {
        vehicle_type: document.getElementById('vehicleType').value,
        policy_type: document.getElementById('policyType').value
    });
});

document.getElementById('contactForm').addEventListener('submit', function() {
    trackEvent('contact_submit', {
        subject: document.getElementById('contactSubject').value,
        page: 'motor-insurance'
    });
});

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Populate manufacturing years
    populateYears();
    
    // Start fade-in animations
    setTimeout(() => {
        document.querySelectorAll('.fade-in').forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('visible');
            }, index * 100);
        });
    }, 500);
    
    console.log('Motor Insurance page loaded successfully!');
});

// Error handling
window.addEventListener('error', function(e) {
    console.warn('Resource failed to load:', e.target);
    trackEvent('resource_error', {
        error: e.target.src || e.target.href,
        page: 'motor-insurance'
    });
});

// Connection status
window.addEventListener('online', function() {
    console.log('Connection restored');
});

window.addEventListener('offline', function() {
    console.log('Connection lost');
    // Show offline message if needed
});