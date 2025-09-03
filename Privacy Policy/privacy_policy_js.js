// Privacy Policy JavaScript
// Author: Assistant
// Enhanced responsive functionality

(function() {
    'use strict';

    // DOM Elements
    const elements = {
        menuToggle: document.getElementById('menuToggle'),
        navLinks: document.getElementById('navLinks'),
        header: document.getElementById('header'),
        tocLinks: document.querySelectorAll('.table-of-contents a'),
        sections: document.querySelectorAll('.policy-section'),
        navLinksItems: document.querySelectorAll('.nav-links a')
    };

    // Mobile Menu Functionality
    function initMobileMenu() {
        if (!elements.menuToggle || !elements.navLinks) return;

        elements.menuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const isActive = elements.navLinks.classList.contains('active');
            
            if (isActive) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });

        // Close menu when clicking on nav links
        elements.navLinksItems.forEach(function(link) {
            link.addEventListener('click', function() {
                closeMobileMenu();
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            const isClickInsideNav = elements.navLinks.contains(e.target) || 
                                   elements.menuToggle.contains(e.target);
            
            if (!isClickInsideNav && elements.navLinks.classList.contains('active')) {
                closeMobileMenu();
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && elements.navLinks.classList.contains('active')) {
                closeMobileMenu();
            }
        });
    }

    function openMobileMenu() {
        elements.navLinks.classList.add('active');
        elements.menuToggle.classList.add('active');
        elements.menuToggle.setAttribute('aria-expanded', 'true');
        elements.menuToggle.setAttribute('aria-label', 'Close navigation menu');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
        elements.navLinks.classList.remove('active');
        elements.menuToggle.classList.remove('active');
        elements.menuToggle.setAttribute('aria-expanded', 'false');
        elements.menuToggle.setAttribute('aria-label', 'Open navigation menu');
        
        // Restore body scroll
        document.body.style.overflow = '';
    }

    // Smooth Scrolling for Table of Contents
    function initSmoothScrolling() {
        elements.tocLinks.forEach(function(anchor) {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const target = document.querySelector(targetId);
                
                if (target) {
                    const headerHeight = elements.header ? elements.header.offsetHeight : 80;
                    const targetPosition = target.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    // Update URL without triggering scroll
                    history.pushState(null, null, targetId);
                }
            });
        });
    }

    // Table of Contents Active State
    function initTocActiveState() {
        if (elements.sections.length === 0 || elements.tocLinks.length === 0) return;

        let ticking = false;

        function updateActiveSection() {
            if (!ticking) {
                requestAnimationFrame(function() {
                    const scrollPosition = window.scrollY + 200; // Offset for header
                    let current = '';

                    elements.sections.forEach(function(section) {
                        const sectionTop = section.offsetTop;
                        const sectionHeight = section.clientHeight;
                        
                        if (scrollPosition >= sectionTop && scrollPosition <= sectionTop + sectionHeight) {
                            current = section.getAttribute('id');
                        }
                    });

                    // Update active state
                    elements.tocLinks.forEach(function(link) {
                        link.classList.remove('active');
                        
                        if (link.getAttribute('href') === '#' + current) {
                            link.classList.add('active');
                        }
                    });

                    ticking = false;
                });
                ticking = true;
            }
        }

        window.addEventListener('scroll', updateActiveSection, { passive: true });
        window.addEventListener('resize', updateActiveSection, { passive: true });
        
        // Initial call
        updateActiveSection();
    }

    // Header Scroll Effect
    function initHeaderScrollEffect() {
        if (!elements.header) return;

        let lastScrollTop = 0;
        let ticking = false;

        function updateHeader() {
            if (!ticking) {
                requestAnimationFrame(function() {
                    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                    
                    if (scrollTop > 100) {
                        elements.header.style.background = 'rgba(30, 64, 175, 0.95)';
                        elements.header.style.backdropFilter = 'blur(20px)';
                    } else {
                        elements.header.style.background = 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)';
                        elements.header.style.backdropFilter = 'blur(10px)';
                    }

                    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
                    ticking = false;
                });
                ticking = true;
            }
        }

        window.addEventListener('scroll', updateHeader, { passive: true });
    }

    // Loading Animation
    function initLoadingAnimation() {
        // Remove loading class from body once page is loaded
        window.addEventListener('load', function() {
            document.body.classList.remove('loading');
        });

        // Add loading class initially if not present
        if (!document.body.classList.contains('loading')) {
            document.body.classList.add('loading');
        }
    }

    // Intersection Observer for Section Animations
    function initSectionAnimations() {
        if ('IntersectionObserver' in window) {
            const observerOptions = {
                root: null,
                rootMargin: '0px 0px -100px 0px',
                threshold: 0.1
            };

            const sectionObserver = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, observerOptions);

            elements.sections.forEach(function(section) {
                sectionObserver.observe(section);
            });
        }
    }

    // Responsive Utilities
    function initResponsiveUtils() {
        let resizeTimer;
        
        function handleResize() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                // Close mobile menu on resize to desktop
                if (window.innerWidth > 768 && elements.navLinks.classList.contains('active')) {
                    closeMobileMenu();
                }
                
                // Update table of contents position
                const toc = document.querySelector('.table-of-contents');
                if (toc && window.innerWidth <= 768) {
                    toc.style.position = 'static';
                } else if (toc) {
                    toc.style.position = 'sticky';
                }
            }, 250);
        }

        window.addEventListener('resize', handleResize, { passive: true });
        
        // Initial call
        handleResize();
    }

    // Accessibility Enhancements
    function initAccessibility() {
        // Add ARIA attributes to menu toggle
        if (elements.menuToggle) {
            elements.menuToggle.setAttribute('aria-expanded', 'false');
            elements.menuToggle.setAttribute('aria-label', 'Open navigation menu');
            elements.menuToggle.setAttribute('role', 'button');
        }

        // Add skip link functionality
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'sr-only';
        skipLink.style.position = 'absolute';
        skipLink.style.left = '-9999px';
        
        skipLink.addEventListener('focus', function() {
            this.style.left = '10px';
            this.style.top = '10px';
            this.style.zIndex = '9999';
            this.style.background = '#1e40af';
            this.style.color = 'white';
            this.style.padding = '0.5rem 1rem';
            this.style.borderRadius = '4px';
            this.style.textDecoration = 'none';
        });
        
        skipLink.addEventListener('blur', function() {
            this.style.left = '-9999px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);

        // Add main content ID for skip link
        const mainContent = document.querySelector('.privacy-content');
        if (mainContent) {
            mainContent.id = 'main-content';
            mainContent.setAttribute('tabindex', '-1');
        }

        // Enhanced keyboard navigation for TOC
        elements.tocLinks.forEach(function(link, index) {
            link.addEventListener('keydown', function(e) {
                if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                    e.preventDefault();
                    
                    let nextIndex;
                    if (e.key === 'ArrowDown') {
                        nextIndex = (index + 1) % elements.tocLinks.length;
                    } else {
                        nextIndex = (index - 1 + elements.tocLinks.length) % elements.tocLinks.length;
                    }
                    
                    elements.tocLinks[nextIndex].focus();
                }
            });
        });
    }

    // Error Handling and Fallbacks
    function initErrorHandling() {
        // Smooth scroll fallback
        if (!('scrollBehavior' in document.documentElement.style)) {
            elements.tocLinks.forEach(function(anchor) {
                anchor.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    const targetId = this.getAttribute('href');
                    const target = document.querySelector(targetId);
                    
                    if (target) {
                        const headerHeight = elements.header ? elements.header.offsetHeight : 80;
                        const targetPosition = target.offsetTop - headerHeight - 20;
                        
                        // Polyfill for smooth scrolling
                        const start = window.pageYOffset;
                        const distance = targetPosition - start;
                        const duration = 500;
                        let startTime = null;
                        
                        function animation(currentTime) {
                            if (startTime === null) startTime = currentTime;
                            const timeElapsed = currentTime - startTime;
                            const run = ease(timeElapsed, start, distance, duration);
                            window.scrollTo(0, run);
                            if (timeElapsed < duration) requestAnimationFrame(animation);
                        }
                        
                        function ease(t, b, c, d) {
                            t /= d / 2;
                            if (t < 1) return c / 2 * t * t + b;
                            t--;
                            return -c / 2 * (t * (t - 2) - 1) + b;
                        }
                        
                        requestAnimationFrame(animation);
                    }
                });
            });
        }
    }

    // Performance Monitoring
    function initPerformanceMonitoring() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver(function(list) {
                const entries = list.getEntries();
                entries.forEach(function(entry) {
                    if (entry.entryType === 'largest-contentful-paint') {
                        // Log LCP for debugging (remove in production)
                        console.log('LCP:', entry.startTime);
                    }
                });
            });
            
            try {
                observer.observe({ entryTypes: ['largest-contentful-paint'] });
            } catch (e) {
                // Silently fail if not supported
            }
        }
    }

    // Utility Functions
    function debounce(func, wait, immediate) {
        let timeout;
        return function executedFunction() {
            const context = this;
            const args = arguments;
            
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            
            if (callNow) func.apply(context, args);
        };
    }

    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Initialize all functionality
    function init() {
        try {
            initLoadingAnimation();
            initMobileMenu();
            initSmoothScrolling();
            initTocActiveState();
            initHeaderScrollEffect();
            initSectionAnimations();
            initResponsiveUtils();
            initAccessibility();
            initErrorHandling();
            initPerformanceMonitoring();
            
            console.log('Privacy Policy page initialized successfully');
        } catch (error) {
            console.error('Error initializing Privacy Policy page:', error);
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose utilities to global scope if needed
    window.PrivacyPolicy = {
        closeMobileMenu: closeMobileMenu,
        openMobileMenu: openMobileMenu,
        debounce: debounce,
        throttle: throttle
    };

})();