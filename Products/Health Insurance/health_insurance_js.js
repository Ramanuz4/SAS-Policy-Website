// Enhanced Mobile Navigation System
class MobileNavigation {
    constructor() {
        this.hamburgerMenu = document.getElementById('hamburgerMenu');
        this.mobileNavOverlay = document.getElementById('mobileNavOverlay');
        this.mobileNavClose = document.getElementById('mobileNavClose');
        this.mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
        this.header = document.getElementById('header');
        this.body = document.body;
        this.isOpen = false;

        this.init();
    }

    init() {
        if (!this.hamburgerMenu || !this.mobileNavOverlay) return;

        // Bind event listeners
        this.hamburgerMenu.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMenu();
        });

        this.mobileNavClose.addEventListener('click', () => {
            this.closeMenu();
        });

        // Close menu when clicking on overlay
        this.mobileNavOverlay.addEventListener('click', (e) => {
            if (e.target === this.mobileNavOverlay) {
                this.closeMenu();
            }
        });

        // Close menu when clicking on navigation links
        this.mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMenu();
                
                // Handle internal links
                const href = link.getAttribute('href');
                if (href.startsWith('#')) {
                    setTimeout(() => {
                        scrollToSection(href.substring(1));
                    }, 300);
                }
            });
        });

        // Handle keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeMenu();
            }
        });

        // Prevent body scroll when menu is open
        this.preventBodyScroll();
    }

    toggleMenu() {
        if (this.isOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }

    openMenu() {
        this.isOpen = true;
        this.hamburgerMenu.classList.add('active');
        this.mobileNavOverlay.classList.add('active');
        this.body.style.overflow = 'hidden';
        
        // Focus management for accessibility
        setTimeout(() => {
            this.mobileNavClose.focus();
        }, 100);

        // Animate menu items
        this.animateMenuItems(true);
        
        trackEvent('mobile_nav_open');
    }

    closeMenu() {
        this.isOpen = false;
        this.hamburgerMenu.classList.remove('active');
        this.mobileNavOverlay.classList.remove('active');
        this.body.style.overflow = '';
        
        // Return focus to hamburger menu
        setTimeout(() => {
            this.hamburgerMenu.focus();
        }, 100);

        trackEvent('mobile_nav_close');
    }

    animateMenuItems(show) {
        this.mobileNavLinks.forEach((link, index) => {
            if (show) {
                setTimeout(() => {
                    link.style.transform = 'translateY(0)';
                    link.style.opacity = '1';
                }, index * 100 + 200);
            } else {
                link.style.transform = 'translateY(20px)';
                link.style.opacity = '0';
            }
        });
    }

    preventBodyScroll() {
        let startY = 0;

        this.mobileNavOverlay.addEventListener('touchstart', (e) => {
            startY = e.touches[0].clientY;
        });

        this.mobileNavOverlay.addEventListener('touchmove', (e) => {
            if (this.isOpen) {
                e.preventDefault();
            }
        }, { passive: false });
    }
}

// Header Scroll Management
class HeaderManager {
    constructor() {
        this.header = document.getElementById('header');
        this.scrollThreshold = 100;
        this.isScrolled = false;
        this.lastScrollY = 0;
        
        this.init();
    }

    init() {
        if (!this.header) return;

        // Throttled scroll handler
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (!scrollTimeout) {
                scrollTimeout = setTimeout(() => {
                    this.handleScroll();
                    scrollTimeout = null;
                }, 10);
            }
        });
    }

    handleScroll() {
        const currentScrollY = window.scrollY;
        
        // Add/remove scrolled class based on scroll position
        if (currentScrollY > this.scrollThreshold && !this.isScrolled) {
            this.header.classList.add('scrolled');
            this.isScrolled = true;
        } else if (currentScrollY <= this.scrollThreshold && this.isScrolled) {
            this.header.classList.remove('scrolled');
            this.isScrolled = false;
        }

        // Update active navigation link
        this.updateActiveNavLink();
        
        this.lastScrollY = currentScrollY;
    }

    updateActiveNavLink() {
        const sections = ['overview', 'types', 'benefits', 'get-quote'];
        const navLinks = document.querySelectorAll('.desktop-nav a, .mobile-nav-link');

        let currentSection = '';
        const scrollPos = window.scrollY + 150;

        sections.forEach((section) => {
            const element = document.getElementById(section);
            if (element) {
                const elementTop = element.offsetTop;
                const elementBottom = elementTop + element.offsetHeight;

                if (scrollPos >= elementTop && scrollPos <= elementBottom) {
                    currentSection = section;
                }
            }
        });

        navLinks.forEach((link) => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === '#' + currentSection) {
                link.classList.add('active');
            }
        });
    }
}

// Enhanced Animation Observer
class AnimationObserver {
    constructor() {
        this.observer = null;
        this.init();
    }

    init() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px',
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Unobserve after animation for performance
                    this.observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        this.observeElements();
    }

    observeElements() {
        // Observe fade-in elements with staggered delays
        const fadeInElements = document.querySelectorAll('.fade-in');
        fadeInElements.forEach((el, index) => {
            // Add staggered animation delay
            el.style.animationDelay = `${index * 0.1}s`;
            this.observer.observe(el);
        });
    }
}

// Smooth Scrolling Utility
function scrollToSection(sectionId) {
    const target = document.getElementById(sectionId) || document.querySelector('.' + sectionId);
    if (target) {
        const headerHeight = document.getElementById('header')?.offsetHeight || 80;
        const targetPosition = target.offsetTop - headerHeight;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth',
        });

        trackEvent('section_scroll', { section: sectionId });
    }
}

// Counter Animation for Statistics
class CounterAnimation {
    constructor() {
        this.counters = document.querySelectorAll('.stat-number');
        this.hasAnimated = false;
        this.init();
    }

    init() {
        if (this.counters.length === 0) return;

        const overviewSection = document.getElementById('overview');
        if (!overviewSection) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !this.hasAnimated) {
                        this.animateCounters();
                        this.hasAnimated = true;
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.3 }
        );

        observer.observe(overviewSection);
    }

    animateCounters() {
        this.counters.forEach((counter) => {
            const target = +counter.getAttribute('data-count');
            const duration = 2000; // 2 seconds
            const startTime = performance.now();
            const startValue = 0;

            const animateValue = (currentTime) => {
                const elapsedTime = currentTime - startTime;
                const progress = Math.min(elapsedTime / duration, 1);
                
                // Easing function for smooth animation
                const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                const currentValue = Math.floor(startValue + (target - startValue) * easeOutQuart);

                counter.textContent = currentValue.toLocaleString();

                if (progress < 1) {
                    requestAnimationFrame(animateValue);
                } else {
                    counter.textContent = target.toLocaleString();
                }
            };

            requestAnimationFrame(animateValue);
        });
    }
}

// Enhanced Form Management
class FormManager {
    constructor() {
        this.form = document.getElementById('healthQuoteForm');
        this.submitBtn = null;
        this.messageDiv = null;
        this.init();
    }

    init() {
        if (!this.form) return;

        this.submitBtn = this.form.querySelector('.submit-btn');
        this.messageDiv = document.getElementById('quoteMessage');

        // Add real-time validation
        const fields = this.form.querySelectorAll('input, select, textarea');
        fields.forEach((field) => {
            field.addEventListener('blur', (e) => this.validateField(e.target));
            field.addEventListener('input', (e) => this.clearFieldError(e.target));
        });

        // Handle form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Add input formatting
        this.addInputFormatting();
    }

    addInputFormatting() {
        // Phone number formatting
        const phoneInput = this.form.querySelector('#phone');
        if (phoneInput) {
            phoneInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 10) value = value.slice(0, 10);
                
                if (value.length >= 6) {
                    value = value.replace(/(\d{5})(\d{0,5})/, '$1 $2');
                }
                e.target.value = value;
            });
        }

        // Name fields - prevent numbers
        ['firstName', 'lastName'].forEach(fieldId => {
            const field = this.form.querySelector(`#${fieldId}`);
            if (field) {
                field.addEventListener('input', (e) => {
                    e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                });
            }
        });
    }

    validateField(field) {
        this.clearFieldError(field);
        
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        switch (field.type || field.tagName.toLowerCase()) {
            case 'email':
                if (value && !this.validateEmail(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address';
                }
                break;
            case 'tel':
                if (value && !this.validatePhone(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid 10-digit phone number';
                }
                break;
            case 'number':
                const age = parseInt(value);
                if (value && (age < 18 || age > 100)) {
                    isValid = false;
                    errorMessage = 'Age must be between 18 and 100 years';
                }
                break;
        }

        if (!isValid) {
            this.setFieldError(field, errorMessage);
        }

        return isValid;
    }

    clearFieldError(field) {
        field.classList.remove('error');
        field.style.borderColor = '';
        
        const errorMsg = field.parentNode.querySelector('.error-message');
        if (errorMsg) {
            errorMsg.remove();
        }
    }

    setFieldError(field, message) {
        field.classList.add('error');
        field.style.borderColor = '#dc2626';

        let errorMsg = field.parentNode.querySelector('.error-message');
        if (!errorMsg) {
            errorMsg = document.createElement('div');
            errorMsg.className = 'error-message';
            errorMsg.style.cssText = 'color: #dc2626; font-size: 0.9rem; margin-top: 0.25rem;';
            field.parentNode.appendChild(errorMsg);
        }
        errorMsg.textContent = message;
    }

    async handleSubmit(event) {
        event.preventDefault();

        const btnText = this.submitBtn.querySelector('.btn-text');
        const loading = this.submitBtn.querySelector('.loading');

        // Show loading state
        this.setLoadingState(true, btnText, loading);

        try {
            // Validate all fields
            const formData = new FormData(this.form);
            const data = Object.fromEntries(formData);
            
            if (!this.validateFormData(data)) {
                throw new Error('Please fill in all required fields correctly');
            }

            // Simulate API call
            const response = await this.submitQuoteRequest(data);

            if (response.success) {
                this.showMessage('success', `
                    <strong>Success!</strong> Your health insurance quote request has been submitted successfully.<br>
                    Our experts will contact you within 2 hours.<br>
                    <strong>Reference ID:</strong> ${response.quoteId}<br>
                    <strong>Estimated Premium:</strong> ₹${response.estimatedPremium.toLocaleString()}/year
                `);
                
                this.form.reset();
                trackEvent('quote_success', {
                    plan_type: data.planType,
                    sum_insured: data.sumInsured,
                    estimated_premium: response.estimatedPremium
                });
            }
        } catch (error) {
            this.showMessage('error', `<strong>Error!</strong> ${error.message}`);
            trackEvent('quote_error', { error: error.message });
        } finally {
            this.setLoadingState(false, btnText, loading);
        }
    }

    setLoadingState(isLoading, btnText, loading) {
        if (isLoading) {
            btnText.style.display = 'none';
            loading.style.display = 'inline-block';
            this.submitBtn.disabled = true;
        } else {
            btnText.style.display = 'inline';
            loading.style.display = 'none';
            this.submitBtn.disabled = false;
        }
    }

    showMessage(type, message) {
        if (this.messageDiv) {
            this.messageDiv.innerHTML = `<div class="message ${type}">${message}</div>`;
            this.messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    validateFormData(data) {
        const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'age', 'planType'];
        return requiredFields.every(field => data[field] && data[field].trim());
    }

    validateEmail(email) {
        const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        return re.test(email);
    }

    validatePhone(phone) {
        const cleaned = phone.replace(/\D/g, '');
        return /^[6-9]\d{9}$/.test(cleaned);
    }

    async submitQuoteRequest(data) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

        // Simulate occasional failures
        if (Math.random() < 0.1) {
            throw new Error('Network error. Please try again.');
        }

        return {
            success: true,
            quoteId: 'HQ' + Date.now(),
            estimatedPremium: this.calculatePremium(data),
            timestamp: new Date().toISOString()
        };
    }

    calculatePremium(data) {
        let basePremium = 5000;
        const age = parseInt(data.age);
        
        // Age-based calculation
        if (age >= 60) basePremium *= 2.5;
        else if (age >= 50) basePremium *= 2.0;
        else if (age >= 40) basePremium *= 1.5;
        else if (age >= 30) basePremium *= 1.2;

        // Plan type multipliers
        const multipliers = {
            individual: 1.0,
            family: 1.2,
            senior: 2.2,
            critical: 0.8,
            topup: 0.4
        };

        basePremium *= (multipliers[data.planType] || 1);
        basePremium *= (0.9 + Math.random() * 0.2); // Add variation

        return Math.round(basePremium / 100) * 100;
    }
}

// Modal Management System
class ModalManager {
    constructor() {
        this.modals = document.querySelectorAll('.modal');
        this.init();
    }

    init() {
        // Add keyboard and click outside handlers
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });

        this.modals.forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal.id);
                }
            });
        });

        // Add close button handlers
        document.querySelectorAll('.close').forEach(closeBtn => {
            closeBtn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                if (modal) {
                    this.closeModal(modal.id);
                }
            });
        });
    }

    openModal(modalId, content = null) {
        const modal = document.getElementById(modalId);
        if (!modal) return;

        if (content && modalId === 'planModal') {
            const contentDiv = document.getElementById('planModalContent');
            if (contentDiv) {
                contentDiv.innerHTML = content;
            }
        }

        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';

        // Focus management
        setTimeout(() => {
            const firstFocusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (firstFocusable) {
                firstFocusable.focus();
            }
        }, 100);

        trackEvent('modal_open', { modal_id: modalId });
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;

        modal.style.display = 'none';
        document.body.style.overflow = '';

        trackEvent('modal_close', { modal_id: modalId });
    }

    closeAllModals() {
        this.modals.forEach(modal => {
            if (modal.style.display === 'block') {
                this.closeModal(modal.id);
            }
        });
    }
}

// Global Functions for Plan Modals
function openPlanModal(planType) {
    const planDetails = {
        individual: {
            title: "Individual Health Insurance",
            icon: "👤",
            description: "Personalized health coverage designed specifically for you",
            features: [
                "Coverage amount from ₹3 lakhs to ₹1 crore",
                "No waiting period for accidents",
                "Cashless treatment at 5,000+ hospitals",
                "Annual health check-ups included"
            ]
        },
        family: {
            title: "Family Floater Health Insurance",
            icon: "👨‍👩‍👧‍👦",
            description: "Comprehensive health coverage for your entire family",
            features: [
                "Single premium covers entire family",
                "Shared sum insured up to ₹50 lakhs",
                "Maternity and newborn coverage",
                "Cost-effective group coverage"
            ]
        },
        senior: {
            title: "Senior Citizen Health Insurance",
            icon: "👴",
            description: "Specialized coverage for seniors above 60 years",
            features: [
                "Coverage for individuals above 60 years",
                "Pre-existing disease coverage",
                "Higher sum insured options",
                "No upper age limit for renewals"
            ]
        }
    };

    const plan = planDetails[planType];
    if (!plan) return;

    const content = `
        <div style="text-align: center; margin-bottom: 2rem;">
            <div style="font-size: 4rem; margin-bottom: 1rem;">${plan.icon}</div>
            <h2 style="color: #1e40af; margin-bottom: 1rem;">${plan.title}</h2>
            <p style="color: #64748b; font-size: 1.1rem;">${plan.description}</p>
        </div>
        <div>
            <h3 style="color: #1e293b; margin-bottom: 1rem;">Key Features</h3>
            <ul style="list-style: none; padding: 0;">
                ${plan.features.map(feature => `
                    <li style="margin-bottom: 0.5rem; padding-left: 25px; position: relative; color: #64748b;">
                        <span style="position: absolute; left: 0; color: #3b82f6; font-weight: bold;">✓</span>
                        ${feature}
                    </li>
                `).join('')}
            </ul>
        </div>
        <div style="text-align: center; margin-top: 2rem; padding-top: 2rem; border-top: 1px solid #e2e8f0;">
            <button class="cta-button primary" onclick="modalManager.closeModal('planModal'); scrollToSection('get-quote');">Get Quote</button>
        </div>
    `;

    modalManager.openModal('planModal', content);
}

function closeModal(modalId) {
    modalManager.closeModal(modalId);
}

// Analytics and Tracking
function trackEvent(eventName, eventData = {}) {
    const data = {
        event: eventName,
        timestamp: new Date().toISOString(),
        page_url: window.location.href,
        user_agent: navigator.userAgent,
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        ...eventData
    };

    console.log('Event tracked:', data);

    // Send to analytics services
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, eventData);
    }
}

// Performance and Optimization
class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        // Lazy load images
        this.lazyLoadImages();
        
        // Preload critical resources
        this.preloadResources();
        
        // Optimize scroll performance
        this.optimizeScrollPerformance();
    }

    lazyLoadImages() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            imageObserver.unobserve(img);
                        }
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    preloadResources() {
        const criticalResources = [
            'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css'
        ];

        criticalResources.forEach(href => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = href;
            link.as = 'style';
            document.head.appendChild(link);
        });
    }

    optimizeScrollPerformance() {
        let ticking = false;

        function updateScrollPosition() {
            // Batch DOM reads/writes
            requestAnimationFrame(() => {
                ticking = false;
            });
        }

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollPosition);
                ticking = true;
            }
        });
    }
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    const mobileNav = new MobileNavigation();
    const headerManager = new HeaderManager();
    const animationObserver = new AnimationObserver();
    const counterAnimation = new CounterAnimation();
    const formManager = new FormManager();
    window.modalManager = new ModalManager();
    const performanceOptimizer = new PerformanceOptimizer();

    // Add accessibility improvements
    addAccessibilityFeatures();

    console.log('Health Insurance page initialized successfully!');
    trackEvent('page_load', {
        load_time: Date.now() - performance.timing.navigationStart
    });
});

// Accessibility Features
function addAccessibilityFeatures() {
    // Add skip link
    const skipLink = document.createElement('a');
    skipLink.href = '#overview';
    skipLink.textContent = 'Skip to main content';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: #000;
        color: #fff;
        padding: 8px;
        text-decoration: none;
        z-index: 10001;
        border-radius: 4px;
        transition: top 0.3s;
    `;

    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '6px';
    });

    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });

    document.body.insertBefore(skipLink, document.body.firstChild);

    // Enhance form labels
    document.querySelectorAll('input[required], select[required]').forEach(field => {
        field.setAttribute('aria-required', 'true');
    });
}

// Handle online/offline status
window.addEventListener('online', () => {
    trackEvent('connection_restored');
});

window.addEventListener('offline', () => {
    trackEvent('connection_lost');
    
    // Show offline notification
    const notification = document.createElement('div');
    notification.innerHTML = `
        <div style="position: fixed; top: 70px; left: 50%; transform: translateX(-50%); 
                    background: #dc2626; color: white; padding: 10px 20px; 
                    border-radius: 5px; z-index: 10000; font-size: 14px;">
            You're currently offline. Some features may not work.
        </div>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 5000);
});

// Smooth scroll polyfill for older browsers
if (!window.CSS || !CSS.supports('scroll-behavior', 'smooth')) {
    function smoothScrollPolyfill(element, target, duration) {
        const start = element.scrollTop;
        const change = target - start;
        const startTime = performance.now();

        function animateScroll(currentTime) {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            const easing = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;
            
            element.scrollTop = start + change * easing;

            if (progress < 1) {
                requestAnimationFrame(animateScroll);
            }
        }

        requestAnimationFrame(animateScroll);
    }

    // Override scrollToSection for older browsers
    window.originalScrollToSection = window.scrollToSection;
    window.scrollToSection = function(sectionId) {
        const target = document.getElementById(sectionId);
        if (target) {
            const headerHeight = 80;
            const targetPosition = target.offsetTop - headerHeight;
            smoothScrollPolyfill(document.documentElement, targetPosition, 800);
        }
    };
}