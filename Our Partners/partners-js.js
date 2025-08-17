// Partners data
const partnersData = {
    'hdfc-ergo': {
        name: 'HDFC ERGO',
        type: 'General Insurance',
        logo: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23dc2626" rx="10"/><text x="50" y="25" text-anchor="middle" font-family="Arial" font-size="8" fill="white" font-weight="bold">HDFC</text><text x="50" y="40" text-anchor="middle" font-family="Arial" font-size="8" fill="white" font-weight="bold">ERGO</text><text x="50" y="60" text-anchor="middle" font-family="Arial" font-size="6" fill="white">GENERAL</text><text x="50" y="75" text-anchor="middle" font-family="Arial" font-size="6" fill="white">INSURANCE</text></svg>',
        description: 'A leading general insurance company in India, offering comprehensive motor, health, and travel insurance solutions.',
        products: ['Motor Insurance', 'Health Insurance', 'Travel Insurance', 'Home Insurance', 'Commercial Insurance'],
        keyFeatures: ['Cashless claim settlements', 'Wide network of hospitals and garages', '24/7 customer support', 'Online policy management', 'Instant policy issuance'],
        stats: {
            experience: '18+ Years',
            customers: '1.5 Crore+',
            claimSettlement: '95%',
            networkHospitals: '10,000+'
        },
        established: 2002,
        specialty: 'Comprehensive general insurance with innovative digital solutions'
    },
    'hdfc-life': {
        name: 'HDFC Life',
        type: 'Life Insurance',
        logo: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%231e40af" rx="10"/><text x="50" y="30" text-anchor="middle" font-family="Arial" font-size="8" fill="white" font-weight="bold">HDFC</text><text x="50" y="45" text-anchor="middle" font-family="Arial" font-size="8" fill="white" font-weight="bold">LIFE</text><text x="50" y="65" text-anchor="middle" font-family="Arial" font-size="6" fill="white">INSURANCE</text></svg>',
        description: 'One of India\'s leading life insurance companies, providing innovative life insurance solutions and retirement planning.',
        products: ['Term Life Insurance', 'Whole Life Insurance', 'ULIP Plans', 'Retirement Plans', 'Child Insurance Plans'],
        keyFeatures: ['High claim settlement ratio', 'Flexible premium payment options', 'Tax benefits under 80C and 10(10D)', 'Wide range of riders', 'Online policy servicing'],
        stats: {
            experience: '23+ Years',
            customers: '6.8 Crore+',
            claimSettlement: '98.1%',
            branches: '400+'
        },
        established: 2000,
        specialty: 'Innovative life insurance solutions with strong digital presence'
    },
    'icici-lombard': {
        name: 'ICICI Lombard',
        type: 'General Insurance',
        logo: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23059669" rx="10"/><text x="50" y="25" text-anchor="middle" font-family="Arial" font-size="7" fill="white" font-weight="bold">ICICI</text><text x="50" y="40" text-anchor="middle" font-family="Arial" font-size="7" fill="white" font-weight="bold">LOMBARD</text><text x="50" y="60" text-anchor="middle" font-family="Arial" font-size="6" fill="white">GENERAL</text><text x="50" y="75" text-anchor="middle" font-family="Arial" font-size="6" fill="white">INSURANCE</text></svg>',
        description: 'India\'s largest private sector general insurance company, known for innovative products and customer-centric approach.',
        products: ['Motor Insurance', 'Health Insurance', 'Home Insurance', 'Travel Insurance', 'Commercial Insurance'],
        keyFeatures: ['Advanced claim processing technology', 'Extensive service network', 'Customized insurance solutions', 'Digital-first approach', 'Quick claim settlements'],
        stats: {
            experience: '22+ Years',
            customers: '3.2 Crore+',
            claimSettlement: '97.8%',
            branches: '265+'
        },
        established: 2001,
        specialty: 'Technology-driven insurance solutions with comprehensive coverage'
    },
    'manipal-cigna': {
        name: 'Manipal Cigna',
        type: 'Health Insurance',
        logo: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="%23e11d48"/><text x="50" y="30" text-anchor="middle" font-family="Arial" font-size="8" fill="white" font-weight="bold">MANIPAL</text><text x="50" y="45" text-anchor="middle" font-family="Arial" font-size="8" fill="white">CIGNA</text><text x="50" y="60" text-anchor="middle" font-family="Arial" font-size="6" fill="white">HEALTH</text><text x="50" y="75" text-anchor="middle" font-family="Arial" font-size="6" fill="white">INSURANCE</text></svg>',
        description: 'A leading health insurance company focused on providing comprehensive health coverage and wellness solutions.',
        products: ['Individual Health Plans', 'Family Health Plans', 'Group Health Insurance', 'Critical Illness Plans', 'Senior Citizen Plans'],
        keyFeatures: ['Cashless hospitalization', 'Global coverage', 'Wellness programs', 'Preventive healthcare benefits', 'No sub-limits on room rent'],
        stats: {
            experience: '12+ Years',
            customers: '25 Lakh+',
            claimSettlement: '94.2%',
            networkHospitals: '6,500+'
        },
        established: 2012,
        specialty: 'Specialized health insurance with global standards and wellness focus'
    },
    'care-health': {
        name: 'Care Health Insurance',
        type: 'Health Insurance',
        logo: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%2306b6d4" rx="10"/><text x="50" y="30" text-anchor="middle" font-family="Arial" font-size="10" fill="white" font-weight="bold">CARE</text><text x="50" y="45" text-anchor="middle" font-family="Arial" font-size="8" fill="white">HEALTH</text><text x="50" y="60" text-anchor="middle" font-family="Arial" font-size="7" fill="white">INSURANCE</text></svg>',
        description: 'Dedicated health insurance company providing innovative and affordable health insurance solutions across India.',
        products: ['Individual Health Plans', 'Family Health Plans', 'Group Health Insurance', 'Top-up Plans', 'Personal Accident Plans'],
        keyFeatures: ['Affordable premiums', 'Quick claim processing', 'Wide hospital network', 'Alternative treatment coverage', 'Maternity benefits'],
        stats: {
            experience: '8+ Years',
            customers: '10 Lakh+',
            claimSettlement: '92.5%',
            networkHospitals: '8,000+'
        },
        established: 2016,
        specialty: 'Affordable health insurance with comprehensive coverage and quick service'
    },
    'niva-bupa': {
        name: 'Niva Bupa Health Insurance',
        type: 'Health Insurance',
        logo: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="%23f59e0b"/><text x="50" y="35" text-anchor="middle" font-family="Arial" font-size="9" fill="white" font-weight="bold">NIVA</text><text x="50" y="50" text-anchor="middle" font-family="Arial" font-size="9" fill="white" font-weight="bold">BUPA</text><text x="50" y="70" text-anchor="middle" font-family="Arial" font-size="6" fill="white">HEALTH</text></svg>',
        description: 'A pure-play health insurance company committed to making healthcare accessible and affordable for everyone.',
        products: ['Individual Health Plans', 'Family Health Plans', 'Senior Citizen Plans', 'Critical Illness Plans', 'Group Health Insurance'],
        keyFeatures: ['No waiting period for accidents', 'Restore benefit', 'Global coverage', 'Alternative medicine coverage', 'Pre and post hospitalization'],
        stats: {
            experience: '15+ Years',
            customers: '5 Lakh+',
            claimSettlement: '93.8%',
            networkHospitals: '6,000+'
        },
        established: 2008,
        specialty: 'Pure health insurance with innovative benefits and customer-centric approach'
    },
    'star-health': {
        name: 'Star Health Insurance',
        type: 'Health Insurance',
        logo: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><polygon points="50,10 60,40 90,40 68,58 78,88 50,70 22,88 32,58 10,40 40,40" fill="%23dc2626"/><text x="50" y="35" text-anchor="middle" font-family="Arial" font-size="7" fill="white" font-weight="bold">STAR</text><text x="50" y="50" text-anchor="middle" font-family="Arial" font-size="7" fill="white" font-weight="bold">HEALTH</text></svg>',
        description: 'India\'s largest standalone health insurance company, exclusively focused on health insurance solutions.',
        products: ['Individual Health Plans', 'Family Health Plans', 'Senior Citizen Plans', 'Diabetes Care Plans', 'Cardiac Care Plans'],
        keyFeatures: ['Specialized health focus', 'Disease-specific plans', 'Comprehensive coverage', 'Quick claim settlements', 'Wide network hospitals'],
        stats: {
            experience: '17+ Years',
            customers: '1.2 Crore+',
            claimSettlement: '91.5%',
            networkHospitals: '12,000+'
        },
        established: 2006,
        specialty: 'Largest standalone health insurer with specialized disease-specific plans'
    }
};

// DOM Elements
const partnersGrid = document.getElementById('partnersGrid');
const partnerModal = document.getElementById('partnerModal');
const quoteModal = document.getElementById('quoteModal');
const modalContent = document.getElementById('modalContent');
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const header = document.getElementById('header');

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    loadPartners();
    setupEventListeners();
    setupScrollAnimations();
    setupFormHandling();
});

// Load partners data and create cards
function loadPartners() {
    const partnersHTML = Object.entries(partnersData).map(([key, partner]) => {
        return `
            <div class="partner-card fade-in" onclick="openPartnerModal('${key}')">
                <div class="partner-logo">
                    <img src="${partner.logo}" alt="${partner.name} Logo">
                </div>
                <div class="partner-info">
                    <h3>${partner.name}</h3>
                    <div class="partner-type">${partner.type}</div>
                    <p class="partner-description">${partner.description}</p>
                    <ul class="partner-features">
                        ${partner.keyFeatures.slice(0, 3).map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                    <button class="learn-more-btn" onclick="event.stopPropagation(); openPartnerModal('${key}')">
                        Learn More
                    </button>
                </div>
            </div>
        `;
    }).join('');

    partnersGrid.innerHTML = partnersHTML;
}

// Setup event listeners
function setupEventListeners() {
    // Mobile menu toggle
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
        updateActiveNavLink();
    });

    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === partnerModal) {
            closeModal();
        }
        if (e.target === quoteModal) {
            closeQuoteModal();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
            closeQuoteModal();
        }
    });
}

// Setup scroll animations
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Trigger counter animation for stats
                if (entry.target.classList.contains('stats-row')) {
                    animateCounters();
                }
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
}

// Animate counters
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const speed = target > 100 ? 20 : 50;
        let current = 0;
        
        const increment = target / speed;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            counter.textContent = Math.floor(current);
        }, 50);
    });
}

// Open partner detail modal
function openPartnerModal(partnerId) {
    const partner = partnersData[partnerId];
    if (!partner) return;

    const modalHTML = `
        <div class="partner-detail-header">
            <div class="partner-detail-logo">
                <img src="${partner.logo}" alt="${partner.name} Logo">
            </div>
            <h2 class="partner-detail-title">${partner.name}</h2>
            <div class="partner-detail-type">${partner.type}</div>
        </div>
        
        <div class="partner-stats">
            <div class="stats-grid">
                <div class="stat-box">
                    <div class="number">${partner.stats.experience}</div>
                    <div class="label">Experience</div>
                </div>
                <div class="stat-box">
                    <div class="number">${partner.stats.customers}</div>
                    <div class="label">Customers</div>
                </div>
                <div class="stat-box">
                    <div class="number">${partner.stats.claimSettlement}</div>
                    <div class="label">Claim Settlement</div>
                </div>
                <div class="stat-box">
                    <div class="number">${partner.stats.networkHospitals || partner.stats.branches}</div>
                    <div class="label">${partner.stats.networkHospitals ? 'Network Hospitals' : 'Branches'}</div>
                </div>
            </div>
        </div>

        <div class="partner-detail-content">
            <div class="detail-section">
                <h3>Products & Services</h3>
                <ul>
                    ${partner.products.map(product => `<li>${product}</li>`).join('')}
                </ul>
            </div>
            <div class="detail-section">
                <h3>Key Features</h3>
                <ul>
                    ${partner.keyFeatures.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
            </div>
        </div>

        <div style="margin-top: 2rem; padding: 1.5rem; background: #f8fafc; border-radius: 10px;">
            <h3 style="color: #1e293b; margin-bottom: 1rem;">About ${partner.name}</h3>
            <p style="color: #64748b; line-height: 1.8; margin-bottom: 1rem;">${partner.description}</p>
            <p style="color: #64748b; line-height: 1.8;"><strong>Established:</strong> ${partner.established}</p>
            <p style="color: #64748b; line-height: 1.8;"><strong>Specialty:</strong> ${partner.specialty}</p>
        </div>

        <div style="text-align: center; margin-top: 2rem;">
            <button class="cta-button primary" onclick="closeModal(); openQuoteModal();">Get Quote from ${partner.name}</button>
            <button class="cta-button secondary" onclick="goToContact()" style="margin-left: 1rem;">Contact Us</button>
        </div>
    `;

    modalContent.innerHTML = modalHTML;
    partnerModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Close partner modal
function closeModal() {
    partnerModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Open quote modal
function openQuoteModal() {
    quoteModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Close quote modal
function closeQuoteModal() {
    quoteModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Setup form handling
function setupFormHandling() {
    const quoteForm = document.getElementById('quoteForm');
    if (quoteForm) {
        quoteForm.addEventListener('submit', handleQuoteSubmission);
    }
}

// Handle quote form submission
async function handleQuoteSubmission(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    const submitBtn = e.target.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    
    try {
        submitBtn.textContent = 'Submitting...';
        submitBtn.disabled = true;
        
        // Send data to backend
        const response = await fetch('/api/quote-request', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            alert('Quote request submitted successfully! Our team will contact you within 24 hours.');
            e.target.reset();
            closeQuoteModal();
        } else {
            throw new Error('Failed to submit quote request');
        }
        
    } catch (error) {
        alert('Error submitting quote request. Please try again or contact us directly.');
        console.error('Quote submission error:', error);
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// Navigation functions
function goHome() {
    window.location.href = 'index.html';
}

function goToContact() {
    window.location.href = 'contact.html';
}

// Update active navigation link
function updateActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(currentPage) || 
            (currentPage === 'partners.html' && link.getAttribute('href') === '#partners')) {
            link.classList.add('active');
        }
    });
}

// Smooth scrolling for anchor links
function smoothScroll(target) {
    const element = document.querySelector(target);
    if (element) {
        const headerHeight = header.offsetHeight;
        const targetPosition = element.offsetTop - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// Search functionality (if needed in the future)
function searchPartners(searchTerm) {
    const filteredPartners = Object.entries(partnersData).filter(([key, partner]) => {
        return partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
               partner.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
               partner.description.toLowerCase().includes(searchTerm.toLowerCase());
    });
    
    // Update the display with filtered results
    const partnersHTML = filteredPartners.map(([key, partner]) => {
        // Same card HTML generation logic as in loadPartners()
    }).join('');
    
    partnersGrid.innerHTML = partnersHTML;
}

// Analytics tracking (placeholder)
function trackEvent(eventName, eventData = {}) {
    console.log('Event tracked:', eventName, eventData);
    // Implement actual analytics tracking here
}

// Track partner interactions
document.addEventListener('click', (e) => {
    if (e.target.closest('.partner-card')) {
        const partnerCard = e.target.closest('.partner-card');
        const partnerName = partnerCard.querySelector('h3').textContent;
        trackEvent('partner_card_click', { partner: partnerName });
    }
    
    if (e.target.closest('.learn-more-btn')) {
        const partnerCard = e.target.closest('.partner-card');
        const partnerName = partnerCard.querySelector('h3').textContent;
        trackEvent('partner_learn_more', { partner: partnerName });
    }
});

// Error handling for failed resource loads
window.addEventListener('error', function(e) {
    console.warn('Resource failed to load:', e.target);
});

// Handle online/offline status
window.addEventListener('online', function() {
    console.log('Connection restored');
});

window.addEventListener('offline', function() {
    console.log('Connection lost');
});

// Initialize page on load
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    console.log('Partners page loaded successfully!');
});