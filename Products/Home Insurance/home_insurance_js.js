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

// Trigger counter animation when stats section is visible
const statsSection = document.querySelector('.stats-overlay');
if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statsObserver.observe(statsSection);
}

// Plan selection functionality
function selectPlan(planType) {
    // Set the selected plan in the quote form
    const coverageSelect = document.getElementById('coverageType');
    if (coverageSelect) {
        switch(planType) {
            case 'basic':
                coverageSelect.value = 'basic';
                break;
            case 'comprehensive':
                coverageSelect.value = 'comprehensive';
                break;
            case 'premium':
                coverageSelect.value = 'premium';
                break;
        }
    }
    
    // Scroll to quote form
    scrollToSection('quote-section');
    
    // Show a brief confirmation
    showNotification(`${planType.charAt(0).toUpperCase() + planType.slice(1)} plan selected! Please fill out the form below.`, 'success');
}

// Quote form submission
document.getElementById('homeQuoteForm').addEventListener('submit', async function(e) {
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
    
    // Basic form validation
    if (!validateQuoteForm(data)) {
        resetSubmitButton(submitBtn, btnText, loading);
        return;
    }
    
    try {
        const response = await submitHomeQuoteRequest(data);
        
        if (response.success) {
            // Show success message
            messageDiv.innerHTML = `
                <div class="message success">
                    <strong>Quote Request Submitted!</strong> Thank you for your interest in home insurance. 
                    Our experts will analyze your requirements and contact you within 24 hours with a 
                    personalized quote. Quote ID: ${response.quoteId}
                </div>
            `;
            
            // Reset form
            this.reset();
            
            // Track the quote submission
            trackEvent('home_insurance_quote_submitted', {
                property_type: data.propertyType,
                coverage_type: data.coverageType,
                property_value: data.propertyValue
            });
        } else {
            throw new Error(response.message || 'Failed to submit quote request');
        }
        
        // Scroll to message
        messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
    } catch (error) {
        // Show error message
        messageDiv.innerHTML = `
            <div class="message error">
                <strong>Submission Failed!</strong> ${error.message || 'Something went wrong. Please try again or contact us directly at +91 98765 43210.'}
            </div>
        `;
    } finally {
        resetSubmitButton(submitBtn, btnText, loading);
    }
});

// Form validation
function validateQuoteForm(data) {
    const errors = [];
    
    // Required fields validation
    if (!data.firstName?.trim()) errors.push('First name is required');
    if (!data.lastName?.trim()) errors.push('Last name is required');
    if (!data.email?.trim()) errors.push('Email is required');
    if (!data.phone?.trim()) errors.push('Phone number is required');
    if (!data.propertyType) errors.push('Property type is required');
    if (!data.propertyAge) errors.push('Property age is required');
    if (!data.propertyValue) errors.push('Property value is required');
    if (!data.coverageType) errors.push('Coverage type is required');
    
    // Email validation
    if (data.email && !validateEmail(data.email)) {
        errors.push('Please enter a valid email address');
    }
    
    // Phone validation
    if (data.phone && !validatePhone(data.phone)) {
        errors.push('Please enter a valid phone number');
    }
    
    // Property value validation
    if (data.propertyValue && (parseInt(data.propertyValue) < 100000 || parseInt(data.propertyValue) > 100000000)) {
        errors.push('Property value should be between ₹1,00,000 and ₹10,00,00,000');
    }
    
    // Contents value validation (if provided)
    if (data.contentsValue && parseInt(data.contentsValue) < 0) {
        errors.push('Contents value cannot be negative');
    }
    
    if (errors.length > 0) {
        showNotification(errors.join('<br>'), 'error');
        return false;
    }
    
    return true;
}

// Utility functions
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[+]?[\d\s\-\(\)]{10,}$/;
    return re.test(phone);
}

function resetSubmitButton(submitBtn, btnText, loading) {
    btnText.style.display = 'inline';
    loading.style.display = 'none';
    submitBtn.disabled = false;
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        z-index: 10000;
        max-width: 400px;
        background: ${type === 'success' ? '#d4edda' : type === 'error' ? '#f8d7da' : '#d1ecf1'};
        color: ${type === 'success' ? '#155724' : type === 'error' ? '#721c24' : '#0c5460'};
        border: 1px solid ${type === 'success' ? '#c3e6cb' : type === 'error' ? '#f5c6cb' : '#bee5eb'};
        border-radius: 8px;
        padding: 1rem;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        transform: translateX(450px);
        transition: transform 0.3s ease;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(450px)';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto close after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(450px)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// API Functions (to be replaced with actual backend calls)
async function submitHomeQuoteRequest(data) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // This would be replaced with actual API call to your backend
    // Example: const response = await fetch('/api/home-insurance-quote', { 
    //     method: 'POST', 
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(data) 
    // });
    
    // Simulated response - replace with actual API response handling
    const simulatedSuccess = Math.random() > 0.1; // 90% success rate for demo
    
    if (simulatedSuccess) {
        return {
            success: true,
            message: 'Home insurance quote request submitted successfully',
            quoteId: 'HI' + Date.now(),
            estimatedPremium: calculateEstimatedPremium(data)
        };
    } else {
        throw new Error('Service temporarily unavailable. Please try again.');
    }
}

// Calculate estimated premium (simplified calculation for demo)
function calculateEstimatedPremium(data) {
    let basePremium = 0;
    const propertyValue = parseInt(data.propertyValue) || 0;
    const contentsValue = parseInt(data.contentsValue) || 0;
    
    // Base calculation (0.5% of property value)
    basePremium = propertyValue * 0.005;
    
    // Add contents premium (0.3% of contents value)
    if (contentsValue > 0) {
        basePremium += contentsValue * 0.003;
    }
    
    // Coverage type multiplier
    switch(data.coverageType) {
        case 'basic':
            basePremium *= 0.8;
            break;
        case 'comprehensive':
            basePremium *= 1.0;
            break;
        case 'premium':
            basePremium *= 1.3;
            break;
    }
    
    // Property age factor
    switch(data.propertyAge) {
        case '0-5':
            basePremium *= 0.9;
            break;
        case '6-10':
            basePremium *= 1.0;
            break;
        case '11-20':
            basePremium *= 1.1;
            break;
        case '21-30':
            basePremium *= 1.2;
            break;
        case '30+':
            basePremium *= 1.3;
            break;
    }
    
    return Math.round(basePremium);
}

// Real-time form validation
document.querySelectorAll('#homeQuoteForm input[type="email"]').forEach(input => {
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

document.querySelectorAll('#homeQuoteForm input[type="tel"]').forEach(input => {
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

document.getElementById('propertyValue')?.addEventListener('input', function() {
    const value = parseInt(this.value);
    const warningDiv = document.getElementById('propertyValueWarning') || createWarningDiv('propertyValueWarning');
    
    if (value > 0 && value < 100000) {
        warningDiv.innerHTML = '<small style="color: #f59e0b;">⚠️ Minimum property value should be ₹1,00,000</small>';
        this.parentNode.appendChild(warningDiv);
    } else if (value > 100000000) {
        warningDiv.innerHTML = '<small style="color: #f59e0b;">⚠️ For high-value properties above ₹10 Crores, please contact us directly</small>';
        this.parentNode.appendChild(warningDiv);
    } else {
        warningDiv.remove();
    }
});

function createWarningDiv(id) {
    const div = document.createElement('div');
    div.id = id;
    div.style.marginTop = '0.5rem';
    return div;
}

// Property type specific suggestions
document.getElementById('propertyType')?.addEventListener('change', function() {
    const suggestionDiv = document.getElementById('propertyTypeSuggestion') || createSuggestionDiv('propertyTypeSuggestion');
    
    const suggestions = {
        'apartment': 'For apartments, consider coverage for interiors and contents. Building structure is usually covered by society insurance.',
        'independent-house': 'Independent houses need comprehensive structure coverage along with contents protection.',
        'villa': 'Villas typically require higher coverage limits due to their value and size.',
        'penthouse': 'Penthouses may need special coverage for terraces and high-value interiors.',
        'row-house': 'Row houses should include coverage for shared walls and individual structure elements.'
    };
    
    if (suggestions[this.value]) {
        suggestionDiv.innerHTML = `<small style="color: #3b82f6;"><i class="fas fa-info-circle"></i> ${suggestions[this.value]}</small>`;
        this.parentNode.appendChild(suggestionDiv);
    } else {
        suggestionDiv.remove();
    }
});

function createSuggestionDiv(id) {
    const div = document.createElement('div');
    div.id = id;
    div.style.marginTop = '0.5rem';
    return div;
}

// Analytics and tracking
function trackEvent(eventName, eventData = {}) {
    // Placeholder for analytics tracking
    console.log('Event tracked:', eventName, eventData);
    
    // Here you would typically send data to your analytics service
    // Example: gtag('event', eventName, eventData);
    // Or: analytics.track(eventName, eventData);
}

// Track important user interactions
document.querySelectorAll('.cta-button').forEach(button => {
    button.addEventListener('click', function() {
        trackEvent('cta_click', {
            button_text: this.textContent.trim(),
            button_location: this.closest('section')?.className || 'unknown',
            page: 'home_insurance'
        });
    });
});

document.querySelectorAll('.select-plan-btn').forEach(button => {
    button.addEventListener('click', function() {
        const planType = this.closest('.type-card').querySelector('h3').textContent;
        trackEvent('plan_selected', {
            plan_type: planType,
            page: 'home_insurance'
        });
    });
});

document.querySelectorAll('.contact-btn').forEach(button => {
    button.addEventListener('click', function() {
        trackEvent('contact_initiated', {
            contact_method: this.textContent.trim(),
            page: 'home_insurance'
        });
    });
});

// Scroll progress indicator
function createScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(45deg, #f59e0b, #d97706);
        z-index: 10001;
        transition: width 0.3s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        progressBar.style.width = Math.min(scrollPercent, 100) + '%';
    });
}

// Initialize scroll progress
createScrollProgress();

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    // ESC key to close notifications
    if (e.key === 'Escape') {
        document.querySelectorAll('.notification').forEach(notification => {
            notification.style.transform = 'translateX(450px)';
            setTimeout(() => notification.remove(), 300);
        });
    }
});

// Form auto-save (save to sessionStorage)
const AUTOSAVE_KEY = 'home_insurance_form_data';

function saveFormData() {
    const form = document.getElementById('homeQuoteForm');
    if (form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        sessionStorage.setItem(AUTOSAVE_KEY, JSON.stringify(data));
    }
}

function loadFormData() {
    const savedData = sessionStorage.getItem(AUTOSAVE_KEY);
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            const form = document.getElementById('homeQuoteForm');
            
            Object.keys(data).forEach(key => {
                const field = form.querySelector(`[name="${key}"]`);
                if (field && data[key]) {
                    field.value = data[key];
                }
            });
        } catch (error) {
            console.warn('Error loading saved form data:', error);
        }
    }
}

// Auto-save form data on input
document.addEventListener('DOMContentLoaded', function() {
    loadFormData();
    
    const form = document.getElementById('homeQuoteForm');
    if (form) {
        form.addEventListener('input', debounce(saveFormData, 1000));
        
        // Clear saved data on successful submission
        form.addEventListener('submit', function() {
            setTimeout(() => {
                sessionStorage.removeItem(AUTOSAVE_KEY);
            }, 2000);
        });
    }
});

// Debounce function for auto-save
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

// Error handling for failed resource loads
window.addEventListener('error', function(e) {
    console.warn('Resource failed to load:', e.target);
    // You could implement fallback mechanisms here
});

// Handle connection status
window.addEventListener('online', function() {
    showNotification('Connection restored', 'success');
});

window.addEventListener('offline', function() {
    showNotification('You are offline. Form data will be saved locally.', 'info');
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
    
    console.log('Home Insurance Page - SAS Policy Value Hub Services loaded successfully!');
    
    // Track page load
    trackEvent('page_loaded', {
        page: 'home_insurance',
        user_agent: navigator.userAgent,
        timestamp: new Date().toISOString()
    });
});

// Back to top button functionality
function createBackToTopButton() {
    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border: none;
        border-radius: 50%;
        background: linear-gradient(45deg, #1e40af, #3b82f6);
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        box-shadow: 0 4px 20px rgba(30, 64, 175, 0.3);
        transition: all 0.3s ease;
        opacity: 0;
        visibility: hidden;
        z-index: 1000;
    `;
    
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        trackEvent('back_to_top_clicked', { page: 'home_insurance' });
    });
    
    document.body.appendChild(backToTopBtn);
    
    // Show/hide based on scroll position
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTopBtn.style.opacity = '1';
            backToTopBtn.style.visibility = 'visible';
        } else {
            backToTopBtn.style.opacity = '0';
            backToTopBtn.style.visibility = 'hidden';
        }
    });
}

// Initialize back to top button
createBackToTopButton();