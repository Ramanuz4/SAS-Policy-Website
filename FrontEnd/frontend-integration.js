// Updated script.js - Add this API integration code to your existing script.js file

// API Configuration
const API_BASE_URL = 'http://localhost:5000/api'; // Change this to your production URL

// Replace the existing submitContactMessage function with this:
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

// Replace the existing submitQuoteRequest function with this:
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

// Check API health when page loads
window.addEventListener('load', function() {
    checkAPIHealth();
});