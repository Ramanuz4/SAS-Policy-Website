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
});

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

// FAQ functionality
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        const faqItem = question.parentElement;
        const isActive = faqItem.classList.contains('active');
        
        // Close all other FAQ items
        document.querySelectorAll('.faq-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Toggle current item
        if (!isActive) {
            faqItem.classList.add('active');
        }
    });
});

// Form validation functions
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[+]?[\d\s\-\(\)]{10,}$/;
    return re.test(phone);
}

function showMessage(container, message, type) {
    container.innerHTML = `
        <div class="message ${type}">
            ${message}
        </div>
    `;
    container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Main contact form submission
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitBtn = this.querySelector('.submit-btn');
        const btnText = submitBtn.querySelector('.btn-text');
        const loading = submitBtn.querySelector('.loading');
        const messageContainer = document.getElementById('messageContainer');
        
        // Show loading state
        btnText.style.display = 'none';
        loading.style.display = 'inline-block';
        submitBtn.disabled = true;
        
        // Clear previous messages
        messageContainer.innerHTML = '';
        
        // Collect form data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        // Client-side validation
        if (!validateEmail(data.email)) {
            showMessage(messageContainer, '<strong>Error!</strong> Please enter a valid email address.', 'error');
            resetButtonState();
            return;
        }
        
        if (data.phone && !validatePhone(data.phone)) {
            showMessage(messageContainer, '<strong>Error!</strong> Please enter a valid phone number.', 'error');
            resetButtonState();
            return;
        }
        
        try {
            // Submit form data to backend
            const response = await submitContactForm(data);
            
            if (response.success) {
                showMessage(messageContainer, 
                    '<strong>Success!</strong> Thank you for contacting us! We\'ll get back to you within 24 hours.', 
                    'success'
                );
                
                // Reset form
                this.reset();
                
                // Track successful submission
                trackEvent('contact_form_submit', {
                    subject: data.subject,
                    insurance_type: data.insuranceType
                });
                
            } else {
                throw new Error(response.message || 'Failed to send message');
            }
            
        } catch (error) {
            console.error('Form submission error:', error);
            showMessage(messageContainer, 
                '<strong>Error!</strong> ' + (error.message || 'Something went wrong. Please try again or call us directly at +91 98765 43210.'), 
                'error'
            );
        } finally {
            resetButtonState();
        }
        
        function resetButtonState() {
            btnText.style.display = 'inline';
            loading.style.display = 'none';
            submitBtn.disabled = false;
        }
    });
}

// Quick quote modal functionality
function openQuoteModal() {
    const modal = document.getElementById('quoteModal');
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

// Quick quote form submission
const quickQuoteForm = document.getElementById('quickQuoteForm');
if (quickQuoteForm) {
    quickQuoteForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitBtn = this.querySelector('.submit-btn');
        const btnText = submitBtn.querySelector('.btn-text');
        const loading = submitBtn.querySelector('.loading');
        
        // Show loading state
        btnText.style.display = 'none';
        loading.style.display = 'inline-block';
        submitBtn.disabled = true;
        
        // Collect form data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        try {
            // Submit quote request
            const response = await submitQuoteRequest(data);
            
            if (response.success) {
                // Show success message and close modal
                closeModal('quoteModal');
                
                // Create and show success notification
                showGlobalNotification('Quote request submitted successfully! We\'ll contact you soon.', 'success');
                
                // Reset form
                this.reset();
                
                // Track successful submission
                trackEvent('quick_quote_submit', {
                    insurance_type: data.insuranceType
                });
                
            } else {
                throw new Error(response.message || 'Failed to submit quote request');
            }
            
        } catch (error) {
            console.error('Quote form submission error:', error);
            showGlobalNotification('Error submitting quote request. Please try again.', 'error');
        } finally {
            // Reset button state
            btnText.style.display = 'inline';
            loading.style.display = 'none';
            submitBtn.disabled = false;
        }
    });
}

// Global notification system
function showGlobalNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `global-notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Add styles if not already present
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .global-notification {
                position: fixed;
                top: 100px;
                right: 20px;
                z-index: 10001;
                padding: 1rem 1.5rem;
                border-radius: 10px;
                color: white;
                font-weight: 500;
                max-width: 400px;
                animation: slideInRight 0.5s ease;
                box-shadow: 0 8px 25px rgba(0,0,0,0.15);
            }
            
            .global-notification.success {
                background: linear-gradient(45deg, #059669, #10b981);
            }
            
            .global-notification.error {
                background: linear-gradient(45deg, #dc2626, #ef4444);
            }
            
            .notification-content {
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 1rem;
            }
            
            .notification-close {
                background: none;
                border: none;
                color: white;
                font-size: 1.2rem;
                cursor: pointer;
                padding: 0;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(styles);
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
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
    
    input.addEventListener('input', function() {
        this.setCustomValidity('');
        this.style.borderColor = '';
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
    
    input.addEventListener('input', function() {
        this.setCustomValidity('');
        this.style.borderColor = '';
    });
});

// API Functions for backend communication
async function submitContactForm(data) {
    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || 'Network response was not ok');
        }
        
        return result;
        
    } catch (error) {
        // Fallback for development/demo
        console.warn('Backend not available, using mock response:', error);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Simulated response
        return {
            success: true,
            message: 'Contact message sent successfully',
            messageId: 'MSG' + Date.now()
        };
    }
}

async function submitQuoteRequest(data) {
    try {
        const response = await fetch('/api/quote', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || 'Network response was not ok');
        }
        
        return result;
        
    } catch (error) {
        // Fallback for development/demo
        console.warn('Backend not available, using mock response:', error);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Simulated response
        return {
            success: true,
            message: 'Quote request submitted successfully',
            quoteId: 'QT' + Date.now()
        };
    }
}

// Analytics and tracking
function trackEvent(eventName, eventData = {}) {
    try {
        // Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, eventData);
        }
        
        // Facebook Pixel
        if (typeof fbq !== 'undefined') {
            fbq('track', eventName, eventData);
        }
        
        // Custom analytics
        console.log('Event tracked:', eventName, eventData);
        
        // You can also send to your own analytics endpoint
        fetch('/api/analytics', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                event: eventName,
                data: eventData,
                timestamp: new Date().toISOString(),
                page: window.location.pathname
            })
        }).catch(err => console.log('Analytics tracking failed:', err));
        
    } catch (error) {
        console.warn('Analytics tracking error:', error);
    }
}

// Track page view
document.addEventListener('DOMContentLoaded', function() {
    trackEvent('page_view', {
        page: 'contact',
        title: document.title
    });
});

// Track button clicks
document.querySelectorAll('.cta-button').forEach(button => {
    button.addEventListener('click', function() {
        trackEvent('cta_click', {
            button_text: this.textContent.trim(),
            button_location: 'contact_page'
        });
    });
});

// Track external links
document.querySelectorAll('a[href^="http"], a[href^="tel:"], a[href^="mailto:"]').forEach(link => {
    link.addEventListener('click', function() {
        trackEvent('external_link_click', {
            url: this.href,
            text: this.textContent.trim()
        });
    });
});

// Performance monitoring
window.addEventListener('load', function() {
    // Track page load time
    const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
    
    trackEvent('page_load_time', {
        load_time: loadTime,
        page: 'contact'
    });
    
    console.log('Contact page loaded successfully in', loadTime + 'ms');
});

// Error handling for failed resource loads
window.addEventListener('error', function(e) {
    console.warn('Resource failed to load:', e.target);
    
    trackEvent('resource_error', {
        resource: e.target.src || e.target.href,
        page: 'contact'
    });
});

// Handle connection status
window.addEventListener('online', function() {
    showGlobalNotification('Connection restored', 'success');
});

window.addEventListener('offline', function() {
    showGlobalNotification('Connection lost. Please check your internet connection.', 'error');
});

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Start fade-in animations
    setTimeout(() => {
        document.querySelectorAll('.fade-in').forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('visible');
            }, index * 100);
        });
    }, 500);
    
    console.log('SAS Policy Value Hub - Contact page initialized successfully!');
});