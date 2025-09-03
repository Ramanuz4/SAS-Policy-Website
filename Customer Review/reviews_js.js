// Sample review data
const reviewsData = [
    {
        id: 1,
        name: "Rajesh Kumar",
        rating: 5,
        title: "Excellent Health Insurance Support",
        text: "SAS Policy Value Hub Services helped me choose the perfect health insurance policy for my family. Their team was incredibly knowledgeable and patient in explaining all the options. The claim process was smooth and hassle-free.",
        category: "health",
        date: "2024-12-15",
        verified: true
    },
    {
        id: 2,
        name: "Priya Sharma",
        rating: 5,
        title: "Outstanding Life Insurance Guidance",
        text: "I was confused about which life insurance policy to choose, but the experts at SAS made it so easy. They analyzed my needs and suggested the best plan within my budget. Highly recommended!",
        category: "life",
        date: "2024-12-10",
        verified: true
    },
    {
        id: 3,
        name: "Amit Patel",
        rating: 4,
        title: "Great Motor Insurance Service",
        text: "Got my car insured through SAS Policy Value Hub Services. The process was quick and they got me competitive quotes from multiple insurers. Good experience overall.",
        category: "motor",
        date: "2024-12-08",
        verified: true
    },
    {
        id: 4,
        name: "Sunita Gupta",
        rating: 5,
        title: "Professional and Trustworthy",
        text: "The team at SAS is very professional and transparent. They helped me understand all the terms and conditions before I signed up for my health insurance. No hidden surprises!",
        category: "health",
        date: "2024-12-05",
        verified: true
    },
    {
        id: 5,
        name: "Vikram Singh",
        rating: 5,
        title: "Best Business Insurance Advice",
        text: "As a small business owner, I needed comprehensive insurance coverage. SAS Policy Value Hub Services provided excellent guidance and helped me get the right business insurance at affordable premiums.",
        category: "business",
        date: "2024-12-03",
        verified: true
    },
    {
        id: 6,
        name: "Meera Joshi",
        rating: 4,
        title: "Helpful and Knowledgeable Staff",
        text: "The staff is very helpful and answered all my questions patiently. They helped me compare different life insurance policies and choose the best one for my retirement planning.",
        category: "life",
        date: "2024-12-01",
        verified: true
    },
    {
        id: 7,
        name: "Rohit Verma",
        rating: 5,
        title: "Smooth Claim Settlement Process",
        text: "When I had to claim my motor insurance, SAS Policy Value Hub Services supported me throughout the process. They coordinated with the insurance company and ensured quick settlement.",
        category: "motor",
        date: "2024-11-28",
        verified: true
    },
    {
        id: 8,
        name: "Kavya Reddy",
        rating: 5,
        title: "Exceptional Customer Service",
        text: "From the initial consultation to policy activation, the service was exceptional. They even followed up to ensure I was satisfied with my health insurance coverage. Truly customer-centric approach!",
        category: "health",
        date: "2024-11-25",
        verified: true
    },
    {
        id: 9,
        name: "Arjun Mehta",
        rating: 4,
        title: "Good Value for Money",
        text: "SAS helped me find a comprehensive motor insurance policy that fits my budget perfectly. The coverage is excellent and the premium is reasonable. Good value for money.",
        category: "motor",
        date: "2024-11-22",
        verified: true
    },
    {
        id: 10,
        name: "Deepika Agarwal",
        rating: 5,
        title: "Transparent and Honest Advice",
        text: "What I appreciated most was their honesty. They didn't try to oversell and recommended exactly what I needed for my family's health insurance. Very transparent in their approach.",
        category: "health",
        date: "2024-11-20",
        verified: true
    },
    {
        id: 11,
        name: "Manoj Kumar",
        rating: 5,
        title: "Quick and Efficient Service",
        text: "Needed business insurance urgently for my startup. SAS Policy Value Hub Services processed everything quickly and efficiently. Got the best quotes from top insurers within 24 hours.",
        category: "business",
        date: "2024-11-18",
        verified: true
    },
    {
        id: 12,
        name: "Anita Desai",
        rating: 4,
        title: "Helpful During Renewal",
        text: "They helped me renew my life insurance policy and even suggested some beneficial add-ons. The team is very knowledgeable about policy benefits and exclusions.",
        category: "life",
        date: "2024-11-15",
        verified: true
    }
];

// Global variables
let currentFilter = 'all';
let displayedReviews = 6;
let currentRating = 0;

// DOM elements
const reviewsGrid = document.getElementById('reviewsGrid');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const filterBtns = document.querySelectorAll('.filter-btn');
const writeReviewBtn = document.getElementById('writeReviewBtn');
const reviewModal = document.getElementById('reviewModal');
const closeModal = document.getElementById('closeModal');
const reviewForm = document.getElementById('reviewForm');
const starRating = document.getElementById('starRating');

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    displayReviews();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Filter buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            currentFilter = this.getAttribute('data-filter');
            displayedReviews = 6; // Reset displayed count
            displayReviews();
        });
    });

    // Load more button
    loadMoreBtn.addEventListener('click', function() {
        displayedReviews += 6;
        displayReviews();
    });

    // Write review modal
    writeReviewBtn.addEventListener('click', function() {
        reviewModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });

    closeModal.addEventListener('click', function() {
        reviewModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        resetForm();
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === reviewModal) {
            reviewModal.style.display = 'none';
            document.body.style.overflow = 'auto';
            resetForm();
        }
    });

    // Star rating
    const stars = starRating.querySelectorAll('i');
    stars.forEach((star, index) => {
        star.addEventListener('click', function() {
            currentRating = parseInt(this.getAttribute('data-rating'));
            updateStarDisplay();
        });

        star.addEventListener('mouseover', function() {
            const hoverRating = parseInt(this.getAttribute('data-rating'));
            updateStarDisplay(hoverRating);
        });
    });

    starRating.addEventListener('mouseleave', function() {
        updateStarDisplay();
    });

    // Form submission
    reviewForm.addEventListener('submit', function(e) {
        e.preventDefault();
        submitReview();
    });
}

// Display reviews based on current filter
function displayReviews() {
    const filteredReviews = getFilteredReviews();
    const reviewsToShow = filteredReviews.slice(0, displayedReviews);
    
    reviewsGrid.innerHTML = '';
    
    reviewsToShow.forEach((review, index) => {
        const reviewCard = createReviewCard(review, index);
        reviewsGrid.appendChild(reviewCard);
    });

    // Update load more button
    if (displayedReviews >= filteredReviews.length) {
        loadMoreBtn.style.display = 'none';
    } else {
        loadMoreBtn.style.display = 'block';
    }

    // Add animation delay for smooth appearance
    const cards = reviewsGrid.querySelectorAll('.review-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
}

// Get filtered reviews
function getFilteredReviews() {
    if (currentFilter === 'all') {
        return reviewsData;
    }
    return reviewsData.filter(review => review.category === currentFilter);
}

// Create review card element
function createReviewCard(review, index) {
    const card = document.createElement('div');
    card.className = 'review-card';
    
    const stars = generateStars(review.rating);
    const categoryLabel = getCategoryLabel(review.category);
    const formattedDate = formatDate(review.date);
    
    card.innerHTML = `
        <div class="review-header">
            <div class="review-info">
                <h4>${review.name}</h4>
                <div class="review-meta">
                    ${review.verified ? '<i class="fas fa-check-circle" style="color: #10b981; margin-right: 0.3rem;"></i>Verified Customer' : 'Customer'}
                </div>
            </div>
            <div class="review-rating">
                ${stars}
            </div>
        </div>
        <div class="insurance-type">${categoryLabel}</div>
        <div class="review-title">${review.title}</div>
        <div class="review-text">${review.text}</div>
        <div class="review-date">${formattedDate}</div>
    `;
    
    return card;
}

// Generate star rating HTML
function generateStars(rating) {
    let starsHTML = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            starsHTML += '<i class="fas fa-star"></i>';
        } else {
            starsHTML += '<i class="far fa-star"></i>';
        }
    }
    return starsHTML;
}

// Get category label
function getCategoryLabel(category) {
    const labels = {
        'health': 'Health Insurance',
        'life': 'Life Insurance',
        'motor': 'Motor Insurance',
        'business': 'Business Insurance'
    };
    return labels[category] || category;
}

// Format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
}

// Update star display in modal
function updateStarDisplay(hoverRating = null) {
    const stars = starRating.querySelectorAll('i');
    const rating = hoverRating || currentRating;
    
    stars.forEach((star, index) => {
        const starRating = index + 1;
        if (starRating <= rating) {
            star.className = 'fas fa-star';
        } else {
            star.className = 'far fa-star';
        }
    });
}

// Submit new review
function submitReview() {
    const formData = new FormData(reviewForm);
    
    if (currentRating === 0) {
        alert('Please select a rating');
        return;
    }
    
    const newReview = {
        id: reviewsData.length + 1,
        name: formData.get('customerName'),
        rating: currentRating,
        title: formData.get('reviewTitle'),
        text: formData.get('reviewText'),
        category: formData.get('insuranceType'),
        date: new Date().toISOString().split('T')[0],
        verified: false
    };
    
    // Add to beginning of reviews array
    reviewsData.unshift(newReview);
    
    // Close modal
    reviewModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    
    // Reset form
    resetForm();
    
    // Refresh display
    displayedReviews = 6;
    displayReviews();
    
    // Show success message
    showSuccessMessage();
}

// Reset form
function resetForm() {
    reviewForm.reset();
    currentRating = 0;
    updateStarDisplay();
}

// Show success message
function showSuccessMessage() {
    const successDiv = document.createElement('div');
    successDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        animation: slideInRight 0.3s ease;
    `;
    successDiv.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <i class="fas fa-check-circle"></i>
            <span>Thank you! Your review has been submitted successfully.</span>
        </div>
    `;
    
    document.body.appendChild(successDiv);
    
    // Add animation style
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(100px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
    `;
    document.head.appendChild(style);
    
    // Remove after 3 seconds
    setTimeout(() => {
        successDiv.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(() => {
            document.body.removeChild(successDiv);
            document.head.removeChild(style);
        }, 300);
    }, 3000);
}

// Smooth scrolling for internal links
function smoothScroll(target) {
    const element = document.querySelector(target);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Add scroll-to-top functionality
function addScrollToTop() {
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: #1e40af;
        color: white;
        border: none;
        font-size: 1.2rem;
        cursor: pointer;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
    `;
    
    document.body.appendChild(scrollBtn);
    
    // Show/hide based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollBtn.style.opacity = '1';
            scrollBtn.style.visibility = 'visible';
        } else {
            scrollBtn.style.opacity = '0';
            scrollBtn.style.visibility = 'hidden';
        }
    });
    
    // Scroll to top when clicked
    scrollBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Initialize scroll-to-top button
document.addEventListener('DOMContentLoaded', function() {
    addScrollToTop();
});

// Add loading animation for better UX
function showLoading() {
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'loading';
    loadingDiv.innerHTML = '<i class="fas fa-spinner fa-spin" style="margin-right: 0.5rem;"></i>Loading reviews...';
    reviewsGrid.innerHTML = '';
    reviewsGrid.appendChild(loadingDiv);
}

// Lazy loading for images (if any are added later)
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Search functionality (can be added later)
function setupSearch() {
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search reviews...';
    searchInput.style.cssText = `
        width: 100%;
        max-width: 400px;
        padding: 0.75rem;
        border: 1px solid #d1d5db;
        border-radius: 8px;
        margin-bottom: 1rem;
        font-size: 1rem;
    `;
    
    // Add search functionality
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const filteredReviews = reviewsData.filter(review => 
            review.name.toLowerCase().includes(searchTerm) ||
            review.title.toLowerCase().includes(searchTerm) ||
            review.text.toLowerCase().includes(searchTerm)
        );
        
        // Display filtered results
        displaySearchResults(filteredReviews);
    });
}

// Performance optimization: Debounce function
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