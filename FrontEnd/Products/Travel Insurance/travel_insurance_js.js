// API Functions for backend integration
async function submitTravelQuoteRequest(data) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    // This would be replaced with actual API call
    // Example: const response = await fetch('/api/travel-quote', { method: 'POST', body: JSON.stringify(data) });
    
    // Calculate estimated premium based on form data
    const basePremium = calculateEstimatedPremium(data);
    
    // Simulated response
    return {
        success: true,
        message: 'Travel quote request submitted successfully',
        quoteId: 'TQ' + Date.now(),
        estimatedPremium: basePremium,
        coverageDetails: getCoverageDetails(data.travelType)
    };
}

// Premium calculation logic
function calculateEstimatedPremium(data) {
    let basePremium = 0;
    const duration = parseInt(data.tripDuration) || 1;
    const travelers = parseInt(data.numberOfTravelers) || 1;
    
    // Base rates per day per person
    const rates = {
        domestic: 50,
        international: 500
    };
    
    basePremium = rates[data.travelType] * duration * travelers;
    
    // Age-based multipliers
    const ageMultipliers = {
        '18-30': 1.0,
        '31-45': 1.2,
        '46-60': 1.5,
        '60+': 2.0
    };
    
    if (data.ageGroup && ageMultipliers[data.ageGroup]) {
        basePremium *= ageMultipliers[data.ageGroup];
    }
    
    // Coverage-based multipliers
    const coverageMultipliers = {
        basic: 1.0,
        standard: 1.5,
        premium: 2.0,
        comprehensive: 3.0
    };
    
    if (data.preferredCoverage && coverageMultipliers[data.preferredCoverage]) {
        basePremium *= coverageMultipliers[data.preferredCoverage];
    }
    
    return Math.round(basePremium);
}

// Get coverage details based on travel type
function getCoverageDetails(travelType) {
    const coverageDetails = {
        domestic: {
            medical: '₹5,00,000',
            baggage: '₹50,000',
            tripCancellation: '₹1,00,000'
        },
        international: {
            medical: '$100,000',
            baggage: '$5,000',
            tripCancellation: '$10,000'
        }
    };
    
    return coverageDetails[travelType] || coverageDetails.domestic;
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

// Set minimum date for departure date (tomorrow)
document.addEventListener('DOMContentLoaded', function() {
    const departureDateInput = document.getElementById('departureDate');
    if (departureDateInput) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        departureDateInput.min = tomorrow.toISOString().split('T')[0];
    }
});

// Dynamic destination suggestions based on travel type
document.getElementById('travelType').addEventListener('change', function() {
    const destinationInput = document.getElementById('destination');
    const travelType = this.value;
    
    if (travelType === 'domestic') {
        destinationInput.placeholder = 'e.g., Goa, Kerala, Rajasthan, Himachal Pradesh';
    } else if (travelType === 'international') {
        destinationInput.placeholder = 'e.g., Thailand, Dubai, Singapore, Europe';
    } else {
        destinationInput.placeholder = 'Where are you traveling to?';
    }
});

// Analytics and tracking
function trackEvent(eventName, eventData = {}) {
    // Placeholder for analytics tracking
    console.log('Event tracked:', eventName, eventData);
    
    // Here you would typically send data to your analytics service
    // Example: gtag('event', eventName, eventData);
}

// Track user interactions
document.querySelectorAll('.type-btn').forEach(button => {
    button.addEventListener('click', function() {
        const travelType = this.closest('.type-card').querySelector('h3').textContent;
        trackEvent('travel_plan_interest', {
            plan_type: travelType
        });
    });
});

document.querySelectorAll('.cta-button').forEach(button => {
    button.addEventListener('click', function() {
        trackEvent('cta_click', {
            button_text: this.textContent.trim(),
            page: 'travel_insurance'
        });
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

// Initialize everything when page loads
window.addEventListener('load', function() {
    // Remove loading states
    document.body.classList.add('loaded');
    
    // Start animations with staggered timing
    setTimeout(() => {
        document.querySelectorAll('.fade-in').forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('visible');
            }, index * 100);
        });
    }, 500);
    
    console.log('SAS Policy Value Hub - Travel Insurance page loaded successfully!');
});

// Additional travel-specific functions
function formatCurrency(amount, currency = 'INR') {
    const formatters = {
        INR: new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }),
        USD: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
    };
    
    return formatters[currency] ? formatters[currency].format(amount) : amount;
}

// Travel tips and alerts (could be populated from API)
const travelTips = {
    international: [
        'Check visa requirements for your destination',
        'Ensure passport validity for at least 6 months',
        'Research local customs and regulations',
        'Keep digital copies of important documents'
    ],
    domestic: [
        'Check weather conditions at destination',
        'Carry valid government ID',
        'Research local transportation options',
        'Pack according to climate and activities'
    ]
};

// Show travel tips based on selection
function showTravelTips(travelType) {
    const tips = travelTips[travelType];
    if (tips) {
        console.log(`Travel Tips for ${travelType}:`, tips);
        // You could display these in a modal or section
    }
} 

// Mobile menu toggle and header effects
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

// Quote modal functionality
function openQuoteModal(travelType) {
    const modal = document.getElementById('quoteModal');
    const content = document.getElementById('quoteModalContent');
    
    const travelTypeDetails = {
        international: {
            title: 'International Travel Insurance',
            icon: '🌍',
            description: 'Comprehensive coverage for overseas travel',
            features: [
                'Medical coverage up to $1,000,000',
                'Emergency evacuation coverage',
                'Repatriation of remains',
                '24/7 global assistance',
                'Coverage for adventure sports',
                'Personal liability coverage'
            ],
            startingPrice: '₹500/day'
        },
        domestic: {
            title: 'Domestic Travel Insurance',
            icon: '🏛️',
            description: 'Essential protection for travel within India',
            features: [
                'Medical coverage up to ₹5,00,000',
                'Trip cancellation protection',
                'Baggage and personal effects',
                'Travel delay compensation',
                'Personal accident coverage',
                'Hotel accommodation support'
            ],
            startingPrice: '₹50/day'
        },
        family: {
            title: 'Family Travel Insurance',
            icon: '👥',
            description: 'Cost-effective coverage for family trips',
            features: [
                'Coverage for entire family',
                'Child-friendly medical coverage',
                'Family trip cancellation',
                'Multiple baggage allowances',
                'Emergency childcare expenses',
                'Family reunion expenses'
            ],
            startingPrice: '₹200/day'
        },
        business: {
            title: 'Business Travel Insurance',
            icon: '💼',
            description: 'Specialized coverage for business travelers',
            features: [
                'Business equipment coverage',
                'Laptop and electronics protection',
                'Business trip cancellation',
                'Hijack and kidnap coverage',
                'Business meeting delays',
                'Executive medical coverage'
            ],
            startingPrice: '₹300/day'
        },
        adventure: {
            title: 'Adventure Travel Insurance',
            icon: '🏔️',
            description: 'Specialized coverage for high-risk activities',
            features: [
                'Adventure sports coverage',
                'Mountain rescue services',
                'Equipment rental coverage',
                'Emergency helicopter evacuation',
                'Search and rescue expenses',
                'Activity-specific medical coverage'
            ],
            startingPrice: '₹800/day'
        },
        senior: {
            title: 'Senior Citizen Travel Insurance',
            icon: '👴',
            description: 'Tailored coverage for travelers above 60 years',
            features: [
                'Pre-existing condition coverage',
                'Higher medical sum insured',
                'Companion benefits',
                'Extended hospital stays',
                'Prescription drug coverage',
                'Medical consultation coverage'
            ],
            startingPrice: '₹400/day'
        }
    };
    
    const details = travelTypeDetails[travelType];
    if (details) {
        content.innerHTML = `
            <div style="text-align: center; margin-bottom: 2rem;">
                <div style="font-size: 4rem; margin-bottom: 1rem;">${details.icon}</div>
                <h2 style="color: #1e40af; margin-bottom: 1rem;">${details.title}</h2>
                <p style="color: #64748b; font-size: 1.1rem; margin-bottom: 2rem;">${details.description}</p>
                <div style="background: linear-gradient(45deg, #1e40af, #3b82f6); color: white; padding: 1rem; border-radius: 15px; display: inline-block; margin-bottom: 2rem;">
                    <strong>Starting from ${details.startingPrice}</strong>
                </div>
            </div>
            
            <div style="margin-bottom: 2rem;">
                <h3 style="color: #1e293b; margin-bottom: 1rem;">Key Features</h3>
                <ul style="list-style: none; padding: 0;">
                    ${details.features.map(feature => `
                        <li style="margin-bottom: 0.8rem; padding-left: 25px; position: relative; color: #64748b; line-height: 1.6;">
                            <span style="position: absolute; left: 0; color: #3b82f6; font-weight: bold; font-size: 1.1rem;">✓</span>
                            ${feature}
                        </li>
                    `).join('')}
                </ul>
            </div>
            
            <div style="text-align: center; margin-top: 2rem;">
                <button class="cta-button primary" onclick="closeModal('quoteModal'); scrollToSection('quote-form');" style="margin-right: 1rem;">Get Quote Now</button>
                <button class="cta-button secondary" onclick="closeModal('quoteModal'); window.location.href='../index.html#contact';">Contact Us</button>
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

// Travel quote form submission
document.getElementById('travelQuoteForm').addEventListener('submit', async function(e) {
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
    
    // Validate departure date (should be in future)
    const departureDate = new Date(data.departureDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (departureDate <= today) {
        messageDiv.innerHTML = `
            <div class="message error">
                <strong>Invalid Date!</strong> Departure date must be in the future.
            </div>
        `;
        btnText.style.display = 'inline';
        loading.style.display = 'none';
        submitBtn.disabled = false;
        messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        return;
    }
    
    try {
        const response = await submitTravelQuoteRequest(data);
        
        if (response.success) {
            // Show success message
            messageDiv.innerHTML = `
                <div class="message success">
                    <strong>Quote Request Submitted!</strong> Your travel insurance quote request has been received. 
                    Our travel insurance specialists will contact you within 2 hours with personalized quotes and coverage options. 
                    <br><strong>Reference ID:</strong> ${response.quoteId}
                </div>
            `;
            
            // Reset form
            this.reset();
            
            // Track the quote request
            trackEvent('travel_quote_request', {
                travel_type: data.travelType,
                destination: data.destination,
                duration: data.tripDuration,
                travelers: data.numberOfTravelers
            });
            
        } else {
            throw new Error(response.message || 'Failed to submit travel quote request');
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
    } finally {
        // Reset button state
        btnText.style.display = 'inline';
        loading.style.display = 'none';
        submitBtn.disabled = false;
    }
});

//