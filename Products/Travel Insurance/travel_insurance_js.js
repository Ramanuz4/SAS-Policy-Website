// Mobile Navigation
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');

    // Toggle mobile menu
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navToggle && navMenu) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navToggle && navMenu && !navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Header Background Change on Scroll
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (header) {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(241, 247, 246, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 223, 129, 0.1)';
        } else {
            header.style.background = 'rgba(241, 247, 246, 0.95)';
            header.style.boxShadow = 'none';
        }
    }
});

// Insurance Plan Selection
const selectButtons = document.querySelectorAll('.btn-select');
selectButtons.forEach(button => {
    button.addEventListener('click', function() {
        const plan = this.getAttribute('data-plan');
        selectInsurancePlan(plan);
        
        // Scroll to quote form
        const quoteForm = document.getElementById('quote-form');
        if (quoteForm) {
            quoteForm.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

function selectInsurancePlan(plan) {
    const tripTypeSelect = document.getElementById('tripType');
    const coverageSelect = document.getElementById('coverage');
    
    if (tripTypeSelect && coverageSelect) {
        // Set appropriate values based on selected plan
        switch(plan) {
            case 'individual':
                tripTypeSelect.value = 'leisure';
                coverageSelect.value = 'standard';
                break;
            case 'family':
                tripTypeSelect.value = 'leisure';
                coverageSelect.value = 'premium';
                break;
            case 'business':
                tripTypeSelect.value = 'business';
                coverageSelect.value = 'premium';
                break;
            case 'adventure':
                tripTypeSelect.value = 'adventure';
                coverageSelect.value = 'platinum';
                break;
            case 'annual':
                tripTypeSelect.value = 'leisure';
                coverageSelect.value = 'premium';
                break;
            case 'student':
                tripTypeSelect.value = 'study';
                coverageSelect.value = 'basic';
                break;
        }
    }
    
    showNotification(`${plan.charAt(0).toUpperCase() + plan.slice(1)} plan selected! Please complete the form below.`, 'success');
}

// Quote Form Functionality
const quoteForm = document.getElementById('insuranceQuoteForm');
if (quoteForm) {
    quoteForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const quoteData = {};
        formData.forEach((value, key) => {
            quoteData[key] = value;
        });

        // Basic form validation
        if (!validateQuoteForm(quoteData)) {
            return;
        }

        // Calculate and display quote
        calculateQuote(quoteData);
    });
}

function validateQuoteForm(data) {
    const required = ['tripType', 'travelers', 'destination', 'duration', 'departureDate', 'returnDate', 'age', 'coverage', 'email'];
    
    for (let field of required) {
        if (!data[field] || data[field].trim() === '') {
            showNotification(`Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} field.`, 'error');
            return false;
        }
    }

    // Validate email
    if (!isValidEmail(data.email)) {
        showNotification('Please enter a valid email address.', 'error');
        return false;
    }

    // Validate dates
    const departureDate = new Date(data.departureDate);
    const returnDate = new Date(data.returnDate);
    const today = new Date();
    
    if (departureDate < today) {
        showNotification('Departure date cannot be in the past.', 'error');
        return false;
    }
    
    if (returnDate <= departureDate) {
        showNotification('Return date must be after departure date.', 'error');
        return false;
    }

    // Validate age
    if (data.age < 1 || data.age > 100) {
        showNotification('Please enter a valid age between 1 and 100.', 'error');
        return false;
    }

    return true;
}

function calculateQuote(data) {
    const submitButton = quoteForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    // Show loading state
    submitButton.innerHTML = '<span class="loading"></span> Calculating...';
    submitButton.disabled = true;

    // Simulate API call delay
    setTimeout(() => {
        const quote = generateQuote(data);
        displayQuote(quote, data);
        
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }, 2500);
}

function generateQuote(data) {
    let basePrice = 25; // Base price
    
    // Adjust for trip type
    const tripMultipliers = {
        'leisure': 1,
        'business': 1.5,
        'adventure': 2.5,
        'study': 0.8
    };
    basePrice *= tripMultipliers[data.tripType] || 1;
    
    // Adjust for coverage level
    const coverageMultipliers = {
        'basic': 1,
        'standard': 1.5,
        'premium': 2,
        'platinum': 2.5
    };
    basePrice *= coverageMultipliers[data.coverage] || 1;
    
    // Adjust for number of travelers
    const travelers = parseInt(data.travelers) || 1;
    let travelerMultiplier = 1;
    if (travelers === 2) travelerMultiplier = 1.8;
    else if (travelers >= 3) travelerMultiplier = travelers * 0.85;
    basePrice *= travelerMultiplier;
    
    // Adjust for duration
    const duration = parseInt(data.duration) || 1;
    basePrice *= Math.sqrt(duration / 7); // Square root scaling for duration
    
    // Adjust for age
    const age = parseInt(data.age) || 25;
    if (age > 65) basePrice *= 1.5;
    else if (age > 50) basePrice *= 1.2;
    else if (age < 25) basePrice *= 0.9;
    
    // Add pre-existing conditions surcharge if applicable
    if (data.preexisting) {
        basePrice *= 1.3;
    }
    
    return Math.round(basePrice);
}

function displayQuote(price, data) {
    const quoteResult = `
        <div class="quote-result">
            <div class="quote-header">
                <h3>Your Travel Insurance Quote</h3>
                <div class="quote-price">$${price}</div>
            </div>
            <div class="quote-details">
                <div class="detail-item">
                    <span class="label">Trip Type:</span>
                    <span class="value">${data.tripType.charAt(0).toUpperCase() + data.tripType.slice(1)}</span>
                </div>
                <div class="detail-item">
                    <span class="label">Destination:</span>
                    <span class="value">${data.destination}</span>
                </div>
                <div class="detail-item">
                    <span class="label">Duration:</span>
                    <span class="value">${data.duration} days</span>
                </div>
                <div class="detail-item">
                    <span class="label">Coverage:</span>
                    <span class="value">${data.coverage.charAt(0).toUpperCase() + data.coverage.slice(1)}</span>
                </div>
                <div class="detail-item">
                    <span class="label">Travelers:</span>
                    <span class="value">${data.travelers}</span>
                </div>
            </div>
            <div class="quote-actions">
                <button class="btn-primary" onclick="purchasePolicy('${price}', '${JSON.stringify(data).replace(/'/g, "\\'")}')">Purchase Policy</button>
                <button class="btn-secondary" onclick="emailQuote('${price}', '${data.email}')">Email Quote</button>
            </div>
        </div>
    `;
    
    // Create and show modal
    showQuoteModal(quoteResult);
}

function showQuoteModal(content) {
    // Remove existing modal if any
    const existingModal = document.querySelector('.quote-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'quote-modal';
    modal.innerHTML = `
        <div class="quote-modal-overlay">
            <div class="quote-modal-content">
                <span class="quote-modal-close">&times;</span>
                ${content}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add modal styles
    const modalStyles = `
        .quote-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .quote-modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        
        .quote-modal-content {
            background: white;
            border-radius: 20px;
            padding: 2rem;
            max-width: 500px;
            width: 100%;
            position: relative;
            max-height: 90vh;
            overflow-y: auto;
        }
        
        .quote-modal-close {
            position: absolute;
            top: 15px;
            right: 20px;
            font-size: 2rem;
            cursor: pointer;
            color: #007978;
            line-height: 1;
        }
        
        .quote-result {
            text-align: center;
        }
        
        .quote-header h3 {
            color: #007978;
            margin-bottom: 1rem;
            font-size: 1.5rem;
        }
        
        .quote-price {
            font-size: 3rem;
            font-weight: 700;
            color: #00DF81;
            margin-bottom: 2rem;
        }
        
        .quote-details {
            text-align: left;
            margin-bottom: 2rem;
        }
        
        .detail-item {
            display: flex;
            justify-content: space-between;
            padding: 0.5rem 0;
            border-bottom: 1px solid #f0f0f0;
        }
        
        .detail-item .label {
            font-weight: 600;
            color: #007978;
        }
        
        .detail-item .value {
            color: #666;
        }
        
        .quote-actions {
            display: flex;
            gap: 1rem;
            justify-content: center;
            flex-wrap: wrap;
        }
    `;
    
    // Add styles to head if not already added
    if (!document.querySelector('#quote-modal-styles')) {
        const styleEl = document.createElement('style');
        styleEl.id = 'quote-modal-styles';
        styleEl.textContent = modalStyles;
        document.head.appendChild(styleEl);
    }
    
    // Close modal functionality
    const closeBtn = modal.querySelector('.quote-modal-close');
    const overlay = modal.querySelector('.quote-modal-overlay');
    
    closeBtn.addEventListener('click', () => modal.remove());
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) modal.remove();
    });
    
    // Close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') modal.remove();
    });
}

function purchasePolicy(price, dataStr) {
    // In a real application, this would redirect to a payment processor
    showNotification('Redirecting to secure payment portal...', 'info');
    
    setTimeout(() => {
        showNotification('This is a demo. In production, you would be redirected to complete payment.', 'info');
    }, 2000);
}

function emailQuote(price, email) {
    showNotification(`Quote emailed to ${email}`, 'success');
    
    // In a real application, this would send an email via backend API
    setTimeout(() => {
        showNotification('Quote details have been sent to your email address.', 'success');
    }, 1000);
}

// FAQ Functionality
const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', function() {
        const isActive = item.classList.contains('active');
        
        // Close all FAQ items
        faqItems.forEach(faqItem => {
            faqItem.classList.remove('active');
        });
        
        // Open clicked item if it wasn't active
        if (!isActive) {
            item.classList.add('active');
        }
    });
});

// Coverage Chart
function initializeCoverageChart() {
    const ctx = document.getElementById('coverageChart');
    if (ctx) {
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Individual', 'Family', 'Business', 'Adventure', 'Annual', 'Student'],
                datasets: [{
                    label: 'Medical Coverage (in millions)',
                    data: [1, 2, 5, 3, 2, 0.5],
                    backgroundColor: [
                        'rgba(0, 223, 129, 0.8)',
                        'rgba(0, 121, 120, 0.8)',
                        'rgba(0, 223, 129, 0.6)',
                        'rgba(0, 121, 120, 0.6)',
                        'rgba(0, 223, 129, 0.4)',
                        'rgba(0, 121, 120, 0.4)'
                    ],
                    borderColor: [
                        'rgba(0, 223, 129, 1)',
                        'rgba(0, 121, 120, 1)',
                        'rgba(0, 223, 129, 1)',
                        'rgba(0, 121, 120, 1)',
                        'rgba(0, 223, 129, 1)',
                        'rgba(0, 121, 120, 1)'
                    ],
                    borderWidth: 2,
                    borderRadius: 8,
                    borderSkipped: false,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Coverage Amount (USD Millions)'
                        },
                        grid: {
                            color: 'rgba(0, 223, 129, 0.1)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Insurance Plan Types'
                        },
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }
}

// Initialize chart when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Delay chart initialization to ensure Chart.js is loaded
    setTimeout(initializeCoverageChart, 100);
});

// Email validation helper function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Notification styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#00DF81' : type === 'error' ? '#ff4757' : '#007978'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        font-weight: 500;
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// Scroll Animation for Elements
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions);

// Add fade-in animation to elements
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.feature-card, .insurance-card, .coverage-item, .faq-item');
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
});

// Form Auto-fill based on URL parameters
function checkURLParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const plan = urlParams.get('plan');
    
    if (plan) {
        setTimeout(() => {
            selectInsurancePlan(plan);
            document.getElementById('quote-form')?.scrollIntoView({ behavior: 'smooth' });
        }, 1000);
    }
}

// Check URL params on load
document.addEventListener('DOMContentLoaded', checkURLParams);

// Date picker restrictions
document.addEventListener('DOMContentLoaded', function() {
    const departureDateInput = document.getElementById('departureDate');
    const returnDateInput = document.getElementById('returnDate');
    
    if (departureDateInput && returnDateInput) {
        // Set minimum date to today
        const today = new Date().toISOString().split('T')[0];
        departureDateInput.setAttribute('min', today);
        
        // Update return date minimum when departure date changes
        departureDateInput.addEventListener('change', function() {
            const departureDate = this.value;
            returnDateInput.setAttribute('min', departureDate);
            
            // Auto-calculate duration
            const durationInput = document.getElementById('duration');
            if (durationInput && returnDateInput.value) {
                const departure = new Date(departureDate);
                const returnDate = new Date(returnDateInput.value);
                const diffTime = Math.abs(returnDate - departure);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                durationInput.value = diffDays;
            }
        });
        
        returnDateInput.addEventListener('change', function() {
            // Auto-calculate duration
            const durationInput = document.getElementById('duration');
            if (durationInput && departureDateInput.value) {
                const departure = new Date(departureDateInput.value);
                const returnDate = new Date(this.value);
                const diffTime = Math.abs(returnDate - departure);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                durationInput.value = diffDays;
            }
        });
    }
});

// Parallax Effect for Hero Section
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector('.floating-shapes');
    const speed = scrolled * 0.3;
    
    if (parallax) {
        parallax.style.transform = `translateY(${speed}px)`;
    }
});

// Preloader (if added)
window.addEventListener('load', function() {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 300);
    }
});

// Keyboard Navigation Enhancement
document.addEventListener('keydown', function(e) {
    // ESC key closes mobile menu and modals
    if (e.key === 'Escape') {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu && navMenu.classList.contains('active')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
        
        const modal = document.querySelector('.quote-modal');
        if (modal) {
            modal.remove();
        }
    }
});

// Performance Optimization: Debounce Scroll Events
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

// Apply debounce to scroll events for better performance
const debouncedScrollHandler = debounce(function() {
    // Scroll handling code is already implemented above
}, 16); // ~60fps

// Insurance Calculator Helper Functions
function calculateRiskFactor(destination) {
    const highRiskCountries = ['afghanistan', 'syria', 'yemen', 'somalia', 'iraq'];
    const mediumRiskCountries = ['turkey', 'egypt', 'india', 'brazil', 'mexico'];
    
    const dest = destination.toLowerCase();
    
    if (highRiskCountries.some(country => dest.includes(country))) {
        return 1.8;
    } else if (mediumRiskCountries.some(country => dest.includes(country))) {
        return 1.3;
    }
    return 1;
}

function getSeasonMultiplier() {
    const month = new Date().getMonth();
    // Peak travel seasons (summer and winter holidays) have higher rates
    if (month >= 5 && month <= 8 || month === 11 || month === 0) {
        return 1.2;
    }
    return 1;
}

// Policy Management Functions (for future backend integration)
function saveQuoteToStorage(quoteData) {
    const quotes = JSON.parse(localStorage.getItem('travelQuotes') || '[]');
    const newQuote = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        ...quoteData
    };
    quotes.push(newQuote);
    localStorage.setItem('travelQuotes', JSON.stringify(quotes));
    return newQuote.id;
}

function getStoredQuotes() {
    return JSON.parse(localStorage.getItem('travelQuotes') || '[]');
}

// Console Welcome Message
console.log(`
🛡️ Welcome to SparkForge Travel Insurance!
✈️ Protecting travelers worldwide
🌍 Coverage in 195+ countries

Need help? Contact us at sparkforge2025@gmail.com
`);

// Error Handling
window.addEventListener('error', function(e) {
    console.error('SparkForge Travel Insurance Error:', e.error);
    showNotification('An unexpected error occurred. Please refresh and try again.', 'error');
});

// Service Worker Registration (for PWA functionality - optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/travel-insurance-sw.js')
            .then(function(registration) {
                console.log('Travel Insurance SW registered: ', registration);
            })
            .catch(function(registrationError) {
                console.log('Travel Insurance SW registration failed: ', registrationError);
            });
    });
}

// Insurance API Integration (Backend functions)
class TravelInsuranceAPI {
    constructor() {
        this.baseURL = 'https://api.sparkforge.com/travel-insurance'; // Replace with actual API URL
        this.apiKey = 'your-api-key'; // Replace with actual API key
    }
    
    async submitQuote(quoteData) {
        try {
            const response = await fetch(`${this.baseURL}/quote`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify(quoteData)
            });
            
            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Quote submission error:', error);
            throw error;
        }
    }
    
    async purchasePolicy(policyData) {
        try {
            const response = await fetch(`${this.baseURL}/purchase`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify(policyData)
            });
            
            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Policy purchase error:', error);
            throw error;
        }
    }
    
    async sendQuoteEmail(email, quoteData) {
        try {
            const response = await fetch(`${this.baseURL}/email-quote`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({ email, quoteData })
            });
            
            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Email sending error:', error);
            throw error;
        }
    }
}

// Initialize API client
const insuranceAPI = new TravelInsuranceAPI();

// Export functions for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        selectInsurancePlan,
        calculateQuote,
        showNotification,
        TravelInsuranceAPI
    };
}