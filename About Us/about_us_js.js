// Mobile menu functionality
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const header = document.getElementById("header");

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("active");
  menuToggle.classList.toggle("active");
});

// Close mobile menu when clicking on a link
document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("active");
    menuToggle.classList.remove("active");
  });
});

// Header scroll effect
window.addEventListener("scroll", () => {
  if (window.scrollY > 100) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }

  // Update active nav link
  updateActiveNavLink();
});

// Update active navigation link based on scroll position
function updateActiveNavLink() {
  const sections = ["about"];
  const navLinks = document.querySelectorAll(".nav-links a");

  let currentSection = "about";

  // Check if we're at the top of the page
  if (window.scrollY < 300) {
    currentSection = "about";
  }

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === "#" + currentSection) {
      link.classList.add("active");
    }
  });
}

// Smooth scrolling function
function scrollToSection(sectionId) {
  const target =
    document.getElementById(sectionId) ||
    document.querySelector("." + sectionId);
  if (target) {
    const headerHeight = header.offsetHeight;
    const targetPosition = target.offsetTop - headerHeight;

    window.scrollTo({
      top: targetPosition,
      behavior: "smooth",
    });
  }
}

// Intersection Observer for fade-in animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, observerOptions);

// Observe all fade-in elements
document.querySelectorAll(".fade-in").forEach((el) => {
  observer.observe(el);
});

// Animated counters for hero stats
function animateCounters() {
  const counters = document.querySelectorAll(".stat-number");
  const speed = 200;

  counters.forEach((counter) => {
    const animate = () => {
      const value = +counter.getAttribute("data-count");
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

// Trigger counter animation when hero section is visible
const heroSection = document.querySelector(".about-hero");
const heroObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setTimeout(animateCounters, 800); // Delay for better effect
        heroObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.3 }
);

if (heroSection) {
  heroObserver.observe(heroSection);
}

// Add parallax effect to hero section
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset;
  const parallaxElements = document.querySelectorAll(".about-hero");

  parallaxElements.forEach((element) => {
    const speed = 0.5;
    element.style.transform = `translateY(${scrolled * speed}px)`;
  });
});

// Enhanced scroll animations with staggered timing
function initStaggeredAnimations() {
  const animatedSections = [
    ".mvv-grid .mvv-card",
    ".apart-grid .apart-item",
    ".team-grid .team-member",
    ".approach-steps .step",
    ".why-points .why-point",
  ];

  animatedSections.forEach((sectionSelector) => {
    const elements = document.querySelectorAll(sectionSelector);
    elements.forEach((element, index) => {
      element.style.transitionDelay = `${index * 0.1}s`;
    });
  });
}

// Team member interaction effects
function initTeamInteractions() {
  const teamMembers = document.querySelectorAll(".team-member");

  teamMembers.forEach((member) => {
    member.addEventListener("mouseenter", function () {
      // Add subtle animation to expertise tags
      const expertiseTags = this.querySelectorAll(".expertise-tag");
      expertiseTags.forEach((tag, index) => {
        setTimeout(() => {
          tag.style.transform = "scale(1.05)";
        }, index * 50);
      });
    });

    member.addEventListener("mouseleave", function () {
      const expertiseTags = this.querySelectorAll(".expertise-tag");
      expertiseTags.forEach((tag) => {
        tag.style.transform = "scale(1)";
      });
    });
  });
}

// Progressive enhancement for step animations
function initStepAnimations() {
  const steps = document.querySelectorAll(".step");

  steps.forEach((step, index) => {
    // Add progressive reveal animation
    step.style.animationDelay = `${index * 0.2}s`;

    // Add hover effects for step numbers
    const stepNumber = step.querySelector(".step-number");
    if (stepNumber) {
      step.addEventListener("mouseenter", () => {
        stepNumber.style.transform = "scale(1.1) rotate(5deg)";
      });

      step.addEventListener("mouseleave", () => {
        stepNumber.style.transform = "scale(1) rotate(0deg)";
      });
    }
  });
}

// Add typing effect to main headings
function initTypingEffect() {
  const mainHeading = document.querySelector(".about-hero h1");
  if (mainHeading) {
    const text = mainHeading.textContent;
    mainHeading.textContent = "";
    mainHeading.style.borderRight = "2px solid #fbbf24";

    let i = 0;
    const typeWriter = () => {
      if (i < text.length) {
        mainHeading.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, 50);
      } else {
        // Remove cursor after typing is complete
        setTimeout(() => {
          mainHeading.style.borderRight = "none";
        }, 1000);
      }
    };

    // Start typing effect after page load
    setTimeout(typeWriter, 1000);
  }
}

// Add scroll progress indicator
function initScrollProgress() {
  const progressBar = document.createElement("div");
  progressBar.className = "scroll-progress";
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

  window.addEventListener("scroll", () => {
    const winScroll =
      document.body.scrollTop || document.documentElement.scrollTop;
    const height =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    progressBar.style.width = scrolled + "%";
  });
}

// Add floating action button for quick navigation
function initFloatingNav() {
  const fab = document.createElement("div");
  fab.className = "floating-nav";
  fab.innerHTML = `
        <div class="fab-main">
            <span>📍</span>
        </div>
        <div class="fab-options">
            <a href="#about" title="Top">🔝</a>
            <a href="index.html#contact" title="Contact">📞</a>
            <a href="index.html#services" title="Services">🛡️</a>
            <a href="index.html" title="Home">🏠</a>
        </div>
    `;

  fab.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        z-index: 1000;
        display: none;
    `;

  document.body.appendChild(fab);

  // Add CSS for floating navigation
  const fabStyles = document.createElement("style");
  fabStyles.textContent = `
        .floating-nav {
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        
        .fab-main {
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #1e40af, #3b82f6);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            box-shadow: 0 8px 25px rgba(30, 64, 175, 0.3);
            transition: all 0.3s ease;
        }
        
        .fab-main:hover {
            transform: scale(1.1);
            box-shadow: 0 12px 35px rgba(30, 64, 175, 0.4);
        }
        
        .fab-options {
            display: flex;
            flex-direction: column;
            gap: 10px;
            margin-bottom: 15px;
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.3s ease;
            pointer-events: none;
        }
        
        .floating-nav.active .fab-options {
            opacity: 1;
            transform: translateY(0);
            pointer-events: all;
        }
        
        .fab-options a {
            width: 45px;
            height: 45px;
            background: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            text-decoration: none;
            font-size: 1.2rem;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
        }
        
        .fab-options a:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 20px rgba(0,0,0,0.15);
        }
        
        @media (max-width: 768px) {
            .floating-nav {
                bottom: 20px;
                right: 20px;
            }
            .fab-main {
                width: 50px;
                height: 50px;
                font-size: 1.2rem;
            }
            .fab-options a {
                width: 40px;
                height: 40px;
                font-size: 1rem;
            }
        }
    `;
  document.head.appendChild(fabStyles);

  // Show FAB when scrolled down
  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      fab.style.display = "flex";
    } else {
      fab.style.display = "none";
    }
  });

  // Toggle FAB options
  const fabMain = fab.querySelector(".fab-main");
  fabMain.addEventListener("click", () => {
    fab.classList.toggle("active");
  });

  // Handle option clicks
  fab.querySelectorAll(".fab-options a").forEach((option) => {
    option.addEventListener("click", () => {
      fab.classList.remove("active");
    });
  });
}

// Initialize all interactive features
function initializeInteractiveFeatures() {
  initStaggeredAnimations();
  initTeamInteractions();
  initStepAnimations();
  initScrollProgress();
  initFloatingNav();

  // Add smooth reveal animations for content sections
  const contentSections = document.querySelectorAll("section");
  contentSections.forEach((section, index) => {
    section.style.animationDelay = `${index * 0.1}s`;
  });
}

// Add loading animation
function initLoadingAnimation() {
  document.body.classList.add("loading");

  const loadingStyles = document.createElement("style");
  loadingStyles.textContent = `
        body.loading {
            overflow: hidden;
        }
        
        body.loading::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 1;
            transition: opacity 0.5s ease;
        }
        
        body.loading::after {
            content: '🏢';
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 4rem;
            z-index: 10001;
            animation: pulse 1.5s infinite;
        }
        
        body.loaded::before,
        body.loaded::after {
            opacity: 0;
            pointer-events: none;
        }
        
        @keyframes pulse {
            0%, 100% { transform: translate(-50%, -50%) scale(1); }
            50% { transform: translate(-50%, -50%) scale(1.1); }
        }
    `;
  document.head.appendChild(loadingStyles);
}

// Error handling for failed resource loads
window.addEventListener("error", function (e) {
  console.warn("Resource failed to load:", e.target);
});

// Handle connection status
window.addEventListener("online", function () {
  console.log("Connection restored");
});

window.addEventListener("offline", function () {
  console.log("Connection lost");
});

// Keyboard navigation support
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    // Close any open modals or menus
    const activeElements = document.querySelectorAll(".active");
    activeElements.forEach((el) => {
      if (
        el.classList.contains("nav-links") ||
        el.classList.contains("menu-toggle")
      ) {
        el.classList.remove("active");
      }
    });
  }
});

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  initLoadingAnimation();
  initializeInteractiveFeatures();

  // Add entrance animations with delays
  setTimeout(() => {
    document.querySelectorAll(".fade-in").forEach((el, index) => {
      setTimeout(() => {
        el.classList.add("visible");
      }, index * 100);
    });
  }, 500);
});

// Initialize everything when page loads
window.addEventListener("load", function () {
  // Remove loading state
  document.body.classList.add("loaded");
  document.body.classList.remove("loading");

  // Initialize typing effect after load
  setTimeout(initTypingEffect, 500);

  console.log(
    "SAS Policy Value Hub Services - About Us page loaded successfully!"
  );
});

  document.addEventListener("mouseleave", () => {
    cursor.style.opacity = "0";
  });

  // Enhance cursor for interactive elements
  const interactiveElements = document.querySelectorAll(
    "a, button, .team-member, .mvv-card, .apart-item"
  );
  interactiveElements.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      cursor.style.transform = "scale(1.5)";
      cursor.style.backgroundColor = "rgba(59, 130, 246, 0.1)";
    });

    el.addEventListener("mouseleave", () => {
      cursor.style.transform = "scale(1)";
      cursor.style.backgroundColor = "transparent";
    });
  });


// Initialize custom cursor on desktop only
if (window.innerWidth > 768) {
  initCustomCursor();
}

// Add performance monitoring
const perfObserver = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.entryType === "measure") {
      console.log(
        `Performance: ${entry.name} took ${entry.duration.toFixed(2)}ms`
      );
    }
  }
});

if ("PerformanceObserver" in window) {
  perfObserver.observe({ entryTypes: ["measure"] });
}
