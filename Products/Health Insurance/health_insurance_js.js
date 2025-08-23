// Mobile menu functionality
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const header = document.getElementById("header");

if (menuToggle && navLinks) {
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

  // Close mobile menu when clicking outside
  document.addEventListener("click", (e) => {
    if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove("active");
      menuToggle.classList.remove("active");
    }
  });
}

// Header scroll effect with throttling
let scrollTimeout;
window.addEventListener("scroll", () => {
  if (!scrollTimeout) {
    scrollTimeout = setTimeout(() => {
      if (header) {
        if (window.scrollY > 100) {
          header.classList.add("scrolled");
        } else {
          header.classList.remove("scrolled");
        }
      }

      // Update active nav link
      updateActiveNavLink();
      scrollTimeout = null;
    }, 10);
  }
});

// Smooth scrolling function with better performance
function scrollToSection(sectionId) {
  const target =
    document.getElementById(sectionId) ||
    document.querySelector("." + sectionId);
  if (target) {
    const headerHeight = header ? header.offsetHeight : 80;
    const targetPosition = target.offsetTop - headerHeight;

    // Close mobile menu if open
    if (navLinks) {
      navLinks.classList.remove("active");
    }
    if (menuToggle) {
      menuToggle.classList.remove("active");
    }

    window.scrollTo({
      top: targetPosition,
      behavior: "smooth",
    });
  }
}

// Update active navigation link with improved performance
function updateActiveNavLink() {
  const sections = [
    "overview",
    "types",
    "benefits",
    "recommendations",
    "get-quote",
  ];
  const navLinks = document.querySelectorAll(".nav-links a");

  let currentSection = "";
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
    link.classList.remove("active");
    const href = link.getAttribute("href");
    if (href === "#" + currentSection) {
      link.classList.add("active");
    }
  });
}

// Enhanced Intersection Observer for fade-in animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      // Unobserve after animation to improve performance
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Lazy load animations
let animationTimeout;
function initializeAnimations() {
  clearTimeout(animationTimeout);
  animationTimeout = setTimeout(() => {
    document.querySelectorAll(".fade-in:not(.visible)").forEach((el) => {
      observer.observe(el);
    });
  }, 100);
}

// Initialize on DOM content loaded
document.addEventListener("DOMContentLoaded", () => {
  initializeAnimations();

  // Initialize other components
  initializeCounterAnimation();
  initializeFormValidation();
  initializeModalHandlers();
  initializeAccessibility();
});

// Enhanced animated counters for statistics
function initializeCounterAnimation() {
  const counters = document.querySelectorAll(".stat-number");
  const speed = 200;
  let hasAnimated = false;

  const animateCounters = () => {
    if (hasAnimated) return;
    hasAnimated = true;

    counters.forEach((counter) => {
      const target = +counter.getAttribute("data-count");
      let current = 0;
      const increment = target / speed;

      const updateCounter = () => {
        if (current < target) {
          current += increment;
          counter.innerText = Math.ceil(current);
          requestAnimationFrame(updateCounter);
        } else {
          counter.innerText = target;
        }
      };
      updateCounter();
    });
  };

  // Trigger counter animation when overview section is visible
  const overviewSection = document.getElementById("overview");
  if (overviewSection) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounters();
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    counterObserver.observe(overviewSection);
  }
}

// Enhanced modal functionality with better accessibility
function initializeModalHandlers() {
  // Add keyboard navigation support
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeAllModals();
    }
  });

  // Add click outside to close
  document.querySelectorAll(".modal").forEach((modal) => {
    modal.addEventListener("click", function (e) {
      if (e.target === modal) {
        closeModal(modal.id);
      }
    });
  });
}

function openPlanModal(planType) {
  const modal = document.getElementById("planModal");
  const content = document.getElementById("planModalContent");

  const planDetails = {
    individual: {
      title: "Individual Health Insurance",
      icon: "👤",
      description: "Personalized health coverage designed specifically for you",
      detailedFeatures: [
        "Coverage amount from ₹3 lakhs to ₹1 crore",
        "No waiting period for accidents and emergency treatments",
        "Cashless treatment at 5,000+ network hospitals nationwide",
        "Pre and post hospitalization expenses covered",
        "Day care procedures and outpatient treatments",
        "Annual preventive health check-ups included",
        "Tax benefits up to ₹25,000 under Section 80D",
        "Lifelong renewability with no upper age limit",
      ],
      benefits: [
        "Lower premium costs compared to family plans",
        "Faster claim processing and approval",
        "Customizable coverage based on individual needs",
        "No sharing of sum insured amount",
        "Personal medical history consideration",
      ],
      bestFor: [
        "Single working professionals",
        "College students and young adults",
        "Individuals with specific health needs",
        "Those seeking maximum coverage control",
      ],
    },
    family: {
      title: "Family Floater Health Insurance",
      icon: "👨‍👩‍👧‍👦",
      description:
        "Comprehensive health coverage for your entire family under one plan",
      detailedFeatures: [
        "Single premium covers entire family (up to 6 members)",
        "Shared sum insured from ₹3 lakhs to ₹50 lakhs",
        "Covers spouse, dependent children up to 25 years",
        "Option to include parents and in-laws",
        "Maternity and newborn baby coverage",
        "No individual medical tests for family members",
        "Cumulative bonus for claim-free years",
        "Easy addition/deletion of family members",
      ],
      benefits: [
        "Cost-effective compared to individual policies",
        "Convenient single policy management",
        "Higher sum insured at lower premium",
        "Automatic coverage for newborn babies",
        "Family health check-up benefits",
      ],
      bestFor: [
        "Nuclear families with 2-4 members",
        "Families planning to have children",
        "Those seeking cost-effective group coverage",
        "Families with similar health profiles",
      ],
    },
    senior: {
      title: "Senior Citizen Health Insurance",
      icon: "👴",
      description:
        "Specialized health coverage tailored for senior citizens above 60 years",
      detailedFeatures: [
        "Coverage for individuals above 60 years of age",
        "High sum insured options up to ₹50 lakhs",
        "Pre-existing disease coverage after waiting period",
        "Specialized treatments for age-related conditions",
        "Domiciliary hospitalization benefits",
        "AYUSH treatment coverage included",
        "Mental health and degenerative disease coverage",
        "Flexible premium payment options",
      ],
      benefits: [
        "No upper age limit for renewals",
        "Enhanced coverage for senior-specific ailments",
        "Reduced waiting periods for certain conditions",
        "Dedicated customer support for seniors",
        "Higher room rent limits and no capping",
      ],
      bestFor: [
        "Individuals above 60 years of age",
        "Senior citizens with pre-existing conditions",
        "Those requiring frequent medical attention",
        "Retirees seeking comprehensive health security",
      ],
    },
    group: {
      title: "Group Health Insurance",
      icon: "🏢",
      description:
        "Employer-sponsored health coverage for employees and their families",
      detailedFeatures: [
        "Employer-provided health insurance benefit",
        "Coverage extends to employee families",
        "No individual underwriting required",
        "Immediate coverage from joining date",
        "Portability options when changing jobs",
        "Group discounts on premium rates",
        "Wellness programs and health initiatives",
        "Corporate tie-ups with healthcare providers",
      ],
      benefits: [
        "Significantly lower premium costs",
        "No waiting periods for pre-existing diseases",
        "Easy enrollment process",
        "Tax benefits for both employer and employee",
        "Enhanced coverage limits",
      ],
      bestFor: [
        "Corporate employees",
        "Organizations looking to provide health benefits",
        "Employees with families to cover",
        "Those seeking immediate coverage without medical tests",
      ],
    },
    critical: {
      title: "Critical Illness Insurance",
      icon: "⚕️",
      description:
        "Specialized coverage for specific critical illnesses with lump sum payout",
      detailedFeatures: [
        "Coverage for 15-40 critical illnesses",
        "Lump sum payout upon diagnosis",
        "Coverage includes cancer, heart attack, stroke, kidney failure",
        "Independent of regular health insurance",
        "Option to buy as standalone or rider",
        "Survival period clause (usually 30 days)",
        "Premium waiver benefit available",
        "Global coverage for emergency treatments",
      ],
      benefits: [
        "Financial support during treatment and recovery",
        "Income replacement during illness",
        "Freedom to choose treatment options",
        "Tax benefits on premium paid and claim received",
        "Additional financial cushion beyond regular health insurance",
      ],
      bestFor: [
        "Individuals with family history of critical illnesses",
        "High-stress job professionals",
        "Those seeking income protection during illness",
        "People looking for comprehensive health security",
      ],
    },
    topup: {
      title: "Top-up Health Insurance",
      icon: "💊",
      description:
        "Additional health coverage that supplements your existing health insurance",
      detailedFeatures: [
        "Supplements existing health insurance coverage",
        "Activates after deductible amount is exceeded",
        "Higher coverage at much lower premium",
        "Can be bought independently or as add-on",
        "Covers hospitalization expenses beyond base policy",
        "Annual deductible limits from ₹1 lakh to ₹10 lakhs",
        "Cumulative bonus benefits available",
        "Flexible sum insured options",
      ],
      benefits: [
        "Cost-effective way to increase health coverage",
        "Protects against high medical inflation",
        "Lower premium compared to increasing base policy",
        "Tax benefits available",
        "Can be used for different family members",
      ],
      bestFor: [
        "Those with existing health insurance needing higher coverage",
        "People with basic employer health insurance",
        "Families with high medical expenses",
        "Those seeking affordable coverage enhancement",
      ],
    },
  };

  const plan = planDetails[planType];
  if (plan && modal && content) {
    content.innerHTML = generatePlanModalContent(plan);
    modal.style.display = "block";
    document.body.style.overflow = "hidden";

    // Focus management for accessibility
    const firstFocusable = modal.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (firstFocusable) {
      firstFocusable.focus();
    }

    // Track modal opening
    trackEvent("health_plan_modal_open", { plan_type: planType });
  }
}

function generatePlanModalContent(plan) {
  return `
        <div style="text-align: center; margin-bottom: 2rem;">
            <div style="font-size: clamp(3rem, 8vw, 4rem); margin-bottom: 1rem;">${
              plan.icon
            }</div>
            <h2 style="color: #1e40af; margin-bottom: 1rem; font-size: clamp(1.5rem, 4vw, 2rem);">${
              plan.title
            }</h2>
            <p style="color: #64748b; font-size: clamp(1rem, 2.5vw, 1.2rem); line-height: 1.6;">${
              plan.description
            }</p>
        </div>
        
        <div style="margin-bottom: 2rem;">
            <h3 style="color: #1e293b; margin-bottom: 1rem; font-size: clamp(1.2rem, 3vw, 1.4rem);">Detailed Features</h3>
            <ul style="list-style: none; padding: 0;">
                ${plan.detailedFeatures
                  .map(
                    (feature) => `
                    <li style="margin-bottom: 0.75rem; padding-left: 25px; position: relative; color: #64748b; line-height: 1.6; font-size: clamp(0.9rem, 2vw, 1rem);">
                        <span style="position: absolute; left: 0; color: #3b82f6; font-weight: bold; font-size: 1.2rem;">✓</span>
                        ${feature}
                    </li>
                `
                  )
                  .join("")}
            </ul>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; margin-bottom: 2rem;">
            <div>
                <h3 style="color: #1e293b; margin-bottom: 1rem; font-size: clamp(1.1rem, 2.5vw, 1.2rem);">Key Benefits</h3>
                <ul style="list-style: none; padding: 0;">
                    ${plan.benefits
                      .map(
                        (benefit) => `
                        <li style="margin-bottom: 0.5rem; padding-left: 20px; position: relative; color: #64748b; line-height: 1.5; font-size: clamp(0.9rem, 2vw, 1rem);">
                            <span style="position: absolute; left: 0; color: #f59e0b; font-weight: bold;">★</span>
                            ${benefit}
                        </li>
                    `
                      )
                      .join("")}
                </ul>
            </div>
            
            <div>
                <h3 style="color: #1e293b; margin-bottom: 1rem; font-size: clamp(1.1rem, 2.5vw, 1.2rem);">Best For</h3>
                <ul style="list-style: none; padding: 0;">
                    ${plan.bestFor
                      .map(
                        (item) => `
                        <li style="margin-bottom: 0.5rem; padding-left: 20px; position: relative; color: #64748b; line-height: 1.5; font-size: clamp(0.9rem, 2vw, 1rem);">
                            <span style="position: absolute; left: 0; color: #059669; font-weight: bold;">→</span>
                            ${item}
                        </li>
                    `
                      )
                      .join("")}
                </ul>
            </div>
        </div>
        
        <div style="text-align: center; margin-top: 2rem; padding-top: 2rem; border-top: 1px solid #e2e8f0;">
            <button class="cta-button primary" onclick="closeModal('planModal'); scrollToSection('get-quote');" style="margin-right: 1rem;">Get Quote</button>
            <button class="cta-button secondary" onclick="closeModal('planModal'); openConsultationModal();">Free Consultation</button>
        </div>
    `;
}

function openConsultationModal() {
  const modal = document.getElementById("consultationModal");
  if (modal) {
    modal.style.display = "block";
    document.body.style.overflow = "hidden";

    // Focus management
    const firstButton = modal.querySelector("button");
    if (firstButton) {
      firstButton.focus();
    }

    trackEvent("health_consultation_modal_open");
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = "none";
    document.body.style.overflow = "auto";

    // Return focus to trigger element if possible
    const triggerButton = document.querySelector(`[onclick*="${modalId}"]`);
    if (triggerButton) {
      triggerButton.focus();
    }

    trackEvent("health_modal_close", { modal_id: modalId });
  }
}

function closeAllModals() {
  document.querySelectorAll(".modal").forEach((modal) => {
    if (modal.style.display === "block") {
      closeModal(modal.id);
    }
  });
}

// Request quote functionality with enhanced UX
function requestQuote(planId) {
  const planInfo = {
    "manipal-prohealth": {
      planType: "individual",
      sumInsured: "500000",
    },
    "care-joy": {
      planType: "individual",
      sumInsured: "300000",
    },
    "star-optima": {
      planType: "family",
      sumInsured: "1000000",
    },
  };

  const info = planInfo[planId];
  if (info) {
    // Scroll to form with better UX
    scrollToSection("get-quote");

    // Show loading indicator briefly
    const quoteSection = document.getElementById("get-quote");
    if (quoteSection) {
      quoteSection.style.opacity = "0.7";

      // Pre-fill form after scroll animation completes
      setTimeout(() => {
        const planTypeSelect = document.getElementById("planType");
        const sumInsuredSelect = document.getElementById("sumInsured");

        if (planTypeSelect) {
          planTypeSelect.value = info.planType;
          planTypeSelect.dispatchEvent(new Event("change"));
        }
        if (sumInsuredSelect) {
          sumInsuredSelect.value = info.sumInsured;
          sumInsuredSelect.dispatchEvent(new Event("change"));
        }

        quoteSection.style.opacity = "1";

        // Focus on first name field
        const firstNameField = document.getElementById("firstName");
        if (firstNameField) {
          firstNameField.focus();
        }
      }, 800);
    }

    trackEvent("health_quote_prefill", { plan_id: planId });
  }
}

// Enhanced form validation and submission
function initializeFormValidation() {
  const healthQuoteForm = document.getElementById("healthQuoteForm");
  if (!healthQuoteForm) return;

  // Real-time validation
  const fields = healthQuoteForm.querySelectorAll("input, select, textarea");
  fields.forEach((field) => {
    field.addEventListener("blur", validateField);
    field.addEventListener("input", clearFieldError);
  });

  // Form submission
  healthQuoteForm.addEventListener("submit", handleFormSubmission);
}

function validateField(event) {
  const field = event.target;
  const value = field.value.trim();

  clearFieldError(event);

  switch (field.type || field.tagName.toLowerCase()) {
    case "email":
      if (value && !validateEmail(value)) {
        setFieldError(field, "Please enter a valid email address");
      }
      break;
    case "tel":
      if (value && !validatePhone(value)) {
        setFieldError(field, "Please enter a valid phone number");
      }
      break;
    case "number":
      const age = parseInt(value);
      if (value && (age < 18 || age > 100)) {
        setFieldError(field, "Age must be between 18 and 100 years");
      }
      break;
  }
}

function clearFieldError(event) {
  const field = event.target;
  field.setCustomValidity("");
  field.style.borderColor = "";

  // Remove error message if exists
  const errorMsg = field.parentNode.querySelector(".error-message");
  if (errorMsg) {
    errorMsg.remove();
  }
}

function setFieldError(field, message) {
  field.setCustomValidity(message);
  field.style.borderColor = "#dc2626";

  // Add visual error message
  let errorMsg = field.parentNode.querySelector(".error-message");
  if (!errorMsg) {
    errorMsg = document.createElement("div");
    errorMsg.className = "error-message";
    errorMsg.style.cssText =
      "color: #dc2626; font-size: 0.9rem; margin-top: 0.25rem;";
    field.parentNode.appendChild(errorMsg);
  }
  errorMsg.textContent = message;
}

async function handleFormSubmission(event) {
  event.preventDefault();

  const form = event.target;
  const submitBtn = form.querySelector(".submit-btn");
  const btnText = submitBtn.querySelector(".btn-text");
  const loading = submitBtn.querySelector(".loading");
  const messageDiv = document.getElementById("quoteMessage");

  // Show loading state
  setLoadingState(submitBtn, btnText, loading, true);

  // Collect and validate form data
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);

  try {
    // Validate required fields
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "age",
      "planType",
      "sumInsured",
    ];
    const missingFields = requiredFields.filter((field) => !data[field]);

    if (missingFields.length > 0) {
      throw new Error("Please fill in all required fields");
    }

    const response = await submitHealthQuoteRequest(data);

    if (response.success) {
      showMessage(
        messageDiv,
        "success",
        `<strong>Success!</strong> Your health insurance quote request has been submitted successfully. 
                Our health insurance experts will contact you within 2 hours with personalized quotes and recommendations.
                <br><br><strong>Reference ID:</strong> ${response.quoteId}
                <br><strong>Estimated Premium:</strong> ₹${response.estimatedPremium.toLocaleString()}/year`
      );

      form.reset();
      trackEvent("health_quote_success", {
        plan_type: data.planType,
        sum_insured: data.sumInsured,
        family_size: data.familySize,
        estimated_premium: response.estimatedPremium,
      });
    } else {
      throw new Error(
        response.message || "Failed to submit health insurance quote request"
      );
    }

    // Smooth scroll to message
    setTimeout(() => {
      messageDiv.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 100);
  } catch (error) {
    showMessage(
      messageDiv,
      "error",
      `<strong>Error!</strong> ${
        error.message ||
        "Something went wrong. Please try again or contact us directly at +91 98765 43210."
      }`
    );

    trackEvent("health_quote_error", {
      error_message: error.message,
      form_data: JSON.stringify(data),
    });
  } finally {
    setLoadingState(submitBtn, btnText, loading, false);
  }
}

function setLoadingState(btn, btnText, loading, isLoading) {
  if (isLoading) {
    btnText.style.display = "none";
    loading.style.display = "inline-block";
    btn.disabled = true;
  } else {
    btnText.style.display = "inline";
    loading.style.display = "none";
    btn.disabled = false;
  }
}

function showMessage(container, type, message) {
  container.innerHTML = `
        <div class="message ${type}">
            ${message}
        </div>
    `;
}

// Enhanced API simulation with better error handling
async function submitHealthQuoteRequest(data) {
  // Simulate network delay
  await new Promise((resolve) =>
    setTimeout(resolve, Math.random() * 2000 + 1000)
  );

  // Simulate occasional failures for testing
  if (Math.random() < 0.1) {
    throw new Error(
      "Network error. Please check your connection and try again."
    );
  }

  // Validate data
  if (!validateEmail(data.email)) {
    throw new Error("Please enter a valid email address");
  }

  if (!validatePhone(data.phone)) {
    throw new Error("Please enter a valid phone number");
  }

  const age = parseInt(data.age);
  if (age < 18 || age > 100) {
    throw new Error("Age must be between 18 and 100 years");
  }

  // Simulate successful response
  return {
    success: true,
    message: "Health insurance quote request submitted successfully",
    quoteId: "HQ" + Date.now(),
    estimatedPremium: calculateEstimatedPremium(data),
    data: data,
    timestamp: new Date().toISOString(),
  };
}

// Enhanced premium calculation
function calculateEstimatedPremium(data) {
  let basePremium = 5000;

  // Age-based calculation
  const age = parseInt(data.age);
  if (age >= 60) basePremium *= 2.5;
  else if (age >= 50) basePremium *= 2.0;
  else if (age >= 40) basePremium *= 1.5;
  else if (age >= 30) basePremium *= 1.2;

  // Sum insured factor
  const sumInsured = parseInt(data.sumInsured);
  const baseCoverage = 500000;
  basePremium = basePremium * Math.pow(sumInsured / baseCoverage, 0.8);

  // Plan type multipliers
  const planMultipliers = {
    individual: 1.0,
    family: 0.75,
    senior: 2.2,
    critical: 0.6,
    topup: 0.35,
  };

  basePremium *= planMultipliers[data.planType] || 1;

  // Family size adjustment
  if (data.familySize && data.planType === "family") {
    const familySize = parseInt(data.familySize);
    if (familySize > 2) {
      basePremium *= 1 + (familySize - 2) * 0.12;
    }
  }

  // Add some randomness for realism
  basePremium *= 0.9 + Math.random() * 0.2;

  return Math.round(basePremium / 100) * 100; // Round to nearest 100
}

// Enhanced validation functions
function validateEmail(email) {
  const re =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return re.test(email);
}

function validatePhone(phone) {
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, "");
  // Check if it's a valid Indian mobile number (10 digits) or with country code
  return /^(\+?91)?[6-9]\d{9}$/.test(cleaned);
}

// Accessibility enhancements
function initializeAccessibility() {
  // Skip to content link
  const skipLink = document.createElement("a");
  skipLink.href = "#overview";
  skipLink.textContent = "Skip to main content";
  skipLink.className = "skip-link";
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

  skipLink.addEventListener("focus", () => {
    skipLink.style.top = "6px";
  });

  skipLink.addEventListener("blur", () => {
    skipLink.style.top = "-40px";
  });

  document.body.insertBefore(skipLink, document.body.firstChild);

  // Enhance form accessibility
  enhanceFormAccessibility();

  // Add ARIA labels where needed
  addAriaLabels();
}

function enhanceFormAccessibility() {
  // Associate labels with form controls
  document.querySelectorAll("label[for]").forEach((label) => {
    const control = document.getElementById(label.getAttribute("for"));
    if (control && !control.hasAttribute("aria-describedby")) {
      // Create description if needed
      const helpText = label.parentNode.querySelector(".help-text");
      if (helpText && !helpText.id) {
        helpText.id = control.id + "-help";
        control.setAttribute("aria-describedby", helpText.id);
      }
    }
  });

  // Add required field indicators
  document
    .querySelectorAll("input[required], select[required], textarea[required]")
    .forEach((field) => {
      if (!field.hasAttribute("aria-required")) {
        field.setAttribute("aria-required", "true");
      }
    });
}

function addAriaLabels() {
  // Add labels to interactive elements without explicit labels
  document
    .querySelectorAll("button:not([aria-label]):not([aria-labelledby])")
    .forEach((button) => {
      if (button.textContent.trim()) {
        button.setAttribute("aria-label", button.textContent.trim());
      }
    });

  // Enhance modal accessibility
  document.querySelectorAll(".modal").forEach((modal) => {
    if (!modal.hasAttribute("role")) {
      modal.setAttribute("role", "dialog");
    }
    if (!modal.hasAttribute("aria-modal")) {
      modal.setAttribute("aria-modal", "true");
    }
  });
}

// Performance optimizations
function optimizePerformance() {
  // Lazy load images
  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute("data-src");
            imageObserver.unobserve(img);
          }
        }
      });
    });

    document.querySelectorAll("img[data-src]").forEach((img) => {
      imageObserver.observe(img);
    });
  }

  // Preload critical resources
  const preloadLinks = [
    "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css",
  ];

  preloadLinks.forEach((href) => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.href = href;
    link.as = "style";
    document.head.appendChild(link);
  });
}

// Analytics and tracking with enhanced data
function trackEvent(eventName, eventData = {}) {
  // Add common data
  const commonData = {
    timestamp: new Date().toISOString(),
    page_url: window.location.href,
    user_agent: navigator.userAgent,
    viewport_width: window.innerWidth,
    viewport_height: window.innerHeight,
    ...eventData,
  };

  console.log("Health Insurance Event tracked:", eventName, commonData);

  // Send to analytics service (replace with actual implementation)
  if (typeof gtag !== "undefined") {
    gtag("event", eventName, commonData);
  }

  // Send to custom analytics endpoint
  if (window.customAnalytics) {
    window.customAnalytics.track(eventName, commonData);
  }
}

// Enhanced user interaction tracking
function initializeTracking() {
  // Track CTA button clicks with more context
  document.addEventListener("click", (e) => {
    if (e.target.matches(".cta-button, .plan-btn, .recommend-btn")) {
      const button = e.target;
      const section = button.closest("section");
      const card = button.closest(".type-card, .recommendation-card");

      trackEvent("health_cta_click", {
        button_text: button.textContent.trim(),
        button_class: button.className,
        section_id: section?.id,
        card_title: card?.querySelector("h3")?.textContent,
      });
    }
  });

  // Track scroll depth
  let maxScroll = 0;
  let scrollTimeouts = {};

  window.addEventListener("scroll", () => {
    const scrollPercent = Math.round(
      (window.scrollY /
        (document.documentElement.scrollHeight - window.innerHeight)) *
        100
    );

    if (scrollPercent > maxScroll) {
      maxScroll = scrollPercent;

      // Track milestone scrolls (25%, 50%, 75%, 100%)
      [25, 50, 75, 100].forEach((milestone) => {
        if (scrollPercent >= milestone && !scrollTimeouts[milestone]) {
          scrollTimeouts[milestone] = true;
          trackEvent("health_scroll_depth", {
            scroll_depth: milestone,
            time_on_page: Date.now() - window.pageLoadTime,
          });
        }
      });
    }
  });

  // Track time spent in sections
  const sectionTimes = {};

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const sectionId = entry.target.id;

        if (entry.isIntersecting) {
          sectionTimes[sectionId] = Date.now();
        } else if (sectionTimes[sectionId]) {
          const timeSpent = Date.now() - sectionTimes[sectionId];
          if (timeSpent > 1000) {
            // Only track if spent more than 1 second
            trackEvent("health_section_time", {
              section_id: sectionId,
              time_spent: timeSpent,
            });
          }
          delete sectionTimes[sectionId];
        }
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll("section[id]").forEach((section) => {
    sectionObserver.observe(section);
  });
}

// Error handling and reporting
function initializeErrorHandling() {
  window.addEventListener("error", (e) => {
    trackEvent("health_js_error", {
      message: e.message,
      filename: e.filename,
      lineno: e.lineno,
      colno: e.colno,
      stack: e.error?.stack,
    });
  });

  window.addEventListener("unhandledrejection", (e) => {
    trackEvent("health_promise_rejection", {
      reason: e.reason?.toString(),
      stack: e.reason?.stack,
    });
  });
}

// Initialize everything when page loads
window.addEventListener("load", function () {
  window.pageLoadTime = Date.now();

  // Initialize all features
  optimizePerformance();
  initializeTracking();
  initializeErrorHandling();

  // Remove loading states
  document.body.classList.add("loaded");

  // Stagger animation initialization for better performance
  setTimeout(() => {
    const elements = document.querySelectorAll(".fade-in");
    elements.forEach((el, index) => {
      setTimeout(() => {
        if (!el.classList.contains("visible")) {
          el.classList.add("visible");
        }
      }, index * 50);
    });
  }, 300);

  console.log(
    "SAS Policy Value Hub - Health Insurance page loaded successfully!"
  );

  trackEvent("health_page_load", {
    load_time: Date.now() - performance.timing.navigationStart,
    dom_elements: document.querySelectorAll("*").length,
    images_count: document.querySelectorAll("img").length,
  });
});

// Handle connection status changes
window.addEventListener("online", () => {
  trackEvent("health_connection_restored");
  console.log("Connection restored");
});

window.addEventListener("offline", () => {
  trackEvent("health_connection_lost");
  console.log("Connection lost");

  // Show offline message
  const offlineMsg = document.createElement("div");
  offlineMsg.id = "offline-message";
  offlineMsg.innerHTML = `
        <div style="position: fixed; top: 70px; left: 50%; transform: translateX(-50%); 
                    background: #dc2626; color: white; padding: 10px 20px; 
                    border-radius: 5px; z-index: 10000; font-size: 14px;">
            You're currently offline. Some features may not work properly.
        </div>
    `;
  document.body.appendChild(offlineMsg);

  setTimeout(() => {
    const msg = document.getElementById("offline-message");
    if (msg) msg.remove();
  }, 5000);
});

// Smooth scroll polyfill for older browsers
if (!window.CSS || !CSS.supports("scroll-behavior", "smooth")) {
  const smoothScrollTo = (element, target, duration) => {
    const start = element.scrollTop;
    const change = target - start;
    const startTime = performance.now();

    const animateScroll = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);

      // Easing function
      const easeInOut =
        progress < 0.5
          ? 2 * progress * progress
          : -1 + (4 - 2 * progress) * progress;

      element.scrollTop = start + change * easeInOut;

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  };

  // Override scrollToSection for older browsers
  const originalScrollToSection = window.scrollToSection;
  window.scrollToSection = function (sectionId) {
    const target =
      document.getElementById(sectionId) ||
      document.querySelector("." + sectionId);
    if (target) {
      const headerHeight = header ? header.offsetHeight : 80;
      const targetPosition = target.offsetTop - headerHeight;
      smoothScrollTo(document.documentElement, targetPosition, 800);
    }
  };
}
