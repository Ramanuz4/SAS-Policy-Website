// API Configuration
const API_BASE_URL = 'http://localhost:5000/api'; // Change this to your production URL

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
    const sections = ['home', 'services', 'about', 'associates', 'contact'];
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

// Animated counters
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

// Trigger counter animation when about section is visible
const aboutSection = document.getElementById('about');
const aboutObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            aboutObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

if (aboutSection) {
    aboutObserver.observe(aboutSection);
}

// Modal functionality
function openServiceModal(serviceType) {
    const modal = document.getElementById('serviceModal');
    const content = document.getElementById('serviceModalContent');
    
    const serviceDetails = {
        health: {
            title: 'Health Insurance',
            icon: '🏥',
            description: 'Comprehensive health coverage for you and your family',
            features: [
                'Cashless treatment at 10,000+ network hospitals',
                'Pre and post hospitalization expenses covered',
                'Day care procedures included',
                'Ambulance charges coverage',
                'Annual health check-ups',
                'Critical illness riders available',
                'Maternity and newborn coverage',
                'Mental health treatment coverage'
            ],
            benefits: [
                'Sum insured up to ₹1 Crore',
                'No waiting period for accidents',
                'Lifetime renewability',
                'Tax benefits under Section 80D'
            ]
        },
        life: {
            title: 'Life Insurance',
            icon: '👨‍👩‍👧‍👦',
            description: 'Secure your family\'s financial future with comprehensive life coverage',
            features: [
                'Term life insurance with high coverage',
                'Whole life insurance plans',
                'Endowment and money-back policies',
                'Unit-linked insurance plans (ULIPs)',
                'Child education and marriage plans',
                'Retirement and pension plans',
                'Accidental death benefit riders',
                'Critical illness riders'
            ],
            benefits: [
                'Coverage up to ₹10 Crores',
                'Flexible premium payment options',
                'Tax benefits under Section 80C and 10(10D)',
                'Loan facility against policy'
            ]
        },
        motor: {
            title: 'Motor Insurance',
            icon: '🚗',
            description: 'Complete protection for your vehicle with comprehensive coverage',
            features: [
                'Third-party liability coverage',
                'Own damage protection',
                'Theft and fire coverage',
                'Natural disaster protection',
                'Personal accident cover',
                'Zero depreciation add-on',
                'Engine protection cover',
                'Roadside assistance'
            ],
            benefits: [
                'Instant policy issuance',
                'Cashless garage network',
                'No-claim bonus protection',
                'Easy online renewal'
            ]
        }
    };
    
    const service = serviceDetails[serviceType];
    if (service) {
        content.innerHTML = `
            <div style="text-align: center; margin-bottom: 2rem;">
                <div style="font-size: 4rem; margin-bottom: 1rem;">${service.icon}</div>
                <h2 style="color: #1e40af; margin-bottom: 1rem;">${service.title}</h2>
                <p style="color: #64748b; font-size: 1.1rem;">${service.description}</p>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem;">
                <div>
                    <h3 style="color: #1e293b; margin-bottom: 1rem;">Key Features</h3>
                    <ul style="list-style: none; padding: 0;">
                        ${service.features.map(feature => `
                            <li style="margin-bottom: 0.5rem; padding-left: 20px; position: relative; color: #64748b;">
                                <span style="position: absolute; left: 0; color: #3b82f6; font-weight: bold;">✓</span>
                                ${feature}
                            </li>
                        `).join('')}
                    </ul>
                </div>
                
                <div>
                    <h3 style="color: #1e293b; margin-bottom: 1rem;">Key Benefits</h3>
                    <ul style="list-style: none; padding: 0;">
                        ${service.benefits.map(benefit => `
                            <li style="margin-bottom: 0.5rem; padding-left: 20px; position: relative; color: #64748b;">
                                <span style="position: absolute; left: 0; color: #f59e0b; font-weight: bold;">★</span>
                                ${benefit}
                            </li>
                        `).join('')}
                    </ul>
                </div>
            </div>
            
            <div style="text-align: center; margin-top: 2rem;">
                <button class="cta-button primary" onclick="closeModal('serviceModal'); scrollToSection('quote-form-section');">Get Free Quote</button>
                <button class="cta-button secondary" onclick="closeModal('serviceModal'); scrollToSection('contact');" style="margin-left: 1rem;">Contact Us</button>
            </div>
        `;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function openQuoteModal() {
    const modal = document.getElementById('quoteModal');
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
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

// API Functions for backend integration
async function submitContactMessage(data) {
    try {
        const response = await fetch(`${API_BASE_URL}/contact`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || 'Failed to send message');
        }
        
        return result;
    } catch (error) {
        console.error('Error submitting contact form:', error);
        throw error;
    }
}

async function submitQuoteRequest(data) {
    try {
        const response = await fetch(`${API_BASE_URL}/quote`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || 'Failed to submit quote request');
        }
        
        return result;
    } catch (error) {
        console.error('Error submitting quote request:', error);
        throw error;
    }
}

// Updated Contact form submission handler
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
    const formData = {
        name: document.getElementById('contactName').value,
        email: document.getElementById('contactEmail').value,
        phone: document.getElementById('contactPhone').value,
        subject: document.getElementById('contactSubject').value,
        message: document.getElementById('contactMessage').value
    };
    
    try {
        const response = await submitContactMessage(formData);
        
        if (response.success) {
            // Show success message
            messageDiv.innerHTML = `
                <div class="message success">
                    <strong>Message Sent!</strong> ${response.message}
                </div>
            `;
            
            // Reset form
            this.reset();
            
            // Auto-hide success message after 5 seconds
            setTimeout(() => {
                messageDiv.innerHTML = '';
            }, 5000);
        }
        
        // Scroll to message
        messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
    } catch (error) {
        // Show error message
        messageDiv.innerHTML = `
            <div class="message error">
                <strong>Error!</strong> ${error.message || 'Failed to send message. Please try again or call us directly.'}
            </div>
        `;
        
        // Auto-hide error message after 10 seconds
        setTimeout(() => {
            messageDiv.innerHTML = '';
        }, 10000);
    } finally {
        // Reset button state
        btnText.style.display = 'inline';
        loading.style.display = 'none';
        submitBtn.disabled = false;
    }
});

// Updated Quote form submission handler
document.getElementById('quoteForm').addEventListener('submit', async function(e) {
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
    const formData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        insuranceType: document.getElementById('insuranceType').value,
        age: document.getElementById('age').value,
        requirements: document.getElementById('requirements').value
    };
    
    try {
        const response = await submitQuoteRequest(formData);
        
        if (response.success) {
            // Show success message
            messageDiv.innerHTML = `
                <div class="message success">
                    <strong>Success!</strong> ${response.message}
                </div>
            `;
            
            // Reset form
            this.reset();
            
            // Auto-hide success message after 5 seconds
            setTimeout(() => {
                messageDiv.innerHTML = '';
            }, 5000);
        }
        
        // Scroll to message
        messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
    } catch (error) {
        // Show error message
        messageDiv.innerHTML = `
            <div class="message error">
                <strong>Error!</strong> ${error.message || 'Something went wrong. Please try again or contact us directly.'}
            </div>
        `;
        
        // Auto-hide error message after 10 seconds
        setTimeout(() => {
            messageDiv.innerHTML = '';
        }, 10000);
    } finally {
        // Reset button state
        btnText.style.display = 'inline';
        loading.style.display = 'none';
        submitBtn.disabled = false;
    }
});

// Function to check API health
async function checkAPIHealth() {
    try {
        const response = await fetch(`${API_BASE_URL}/health`);
        const data = await response.json();
        
        if (data.success) {
            console.log('API is running:', data);
        } else {
            console.warn('API health check failed');
        }
    } catch (error) {
        console.error('API is not reachable:', error);
        // You might want to show a notification to the user
    }
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

// Associate logo hover effects with names
document.querySelectorAll('.associate-logo').forEach(logo => {
    const name = logo.getAttribute('data-name');
    logo.addEventListener('mouseenter', function() {
        // Create tooltip
        const tooltip = document.createElement('div');
        tooltip.style.cssText = `
            position: absolute;
            background: #1e293b;
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 14px;
            white-space: nowrap;
            z-index: 1000;
            pointer-events: none;
            transform: translateX(-50%);
            top: -40px;
            left: 50%;
        `;
        tooltip.textContent = name;
        tooltip.className = 'tooltip';
        
        this.style.position = 'relative';
        this.appendChild(tooltip);
    });
    
    logo.addEventListener('mouseleave', function() {
        const tooltip = this.querySelector('.tooltip');
        if (tooltip) {
            tooltip.remove();
        }
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

// Service card floating animation with staggered timing
document.querySelectorAll('.service-card.floating').forEach((card, index) => {
    card.style.animationDelay = `${index * 0.5}s`;
});

// Preload form validation messages
const validationMessages = {
    valueMissing: 'This field is required',
    typeMismatch: 'Please enter a valid value',
    tooShort: 'Please enter at least {minlength} characters',
    tooLong: 'Please enter no more than {maxlength} characters',
    patternMismatch: 'Please match the requested format'
};

// Enhanced form validation with custom messages
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

document.querySelectorAll('.service-btn').forEach(button => {
    button.addEventListener('click', function() {
        trackEvent('service_interest', {
            service_type: this.closest('.service-card')?.querySelector('h3')?.textContent || 'unknown'
        });
    });
});

// Track form submissions
document.getElementById('quoteForm').addEventListener('submit', function() {
    trackEvent('quote_form_submit', {
        insurance_type: document.getElementById('insuranceType').value
    });
});

document.getElementById('contactForm').addEventListener('submit', function() {
    trackEvent('contact_form_submit', {
        subject: document.getElementById('contactSubject').value
    });
});

// Initialize everything when page loads
window.addEventListener('load', function() {
    // Check API health when page loads
    checkAPIHealth();
    
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
    
    console.log('SAS Policy Value Hub Services - Website loaded successfully!');
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