# Health Insurance Service Setup Instructions

## File Structure
```
health-insurance-service/
├── index.html                    # Main HTML file
├── health-insurance-styles.css   # CSS styles
├── health-insurance-script.js    # Frontend JavaScript
├── health-insurance-backend.js   # Node.js backend
├── package.json                  # Dependencies
├── .env                          # Environment variables
└── README.md                     # This file
```

## Frontend Setup

### 1. HTML File (index.html)
- Place the HTML file in your web server directory
- Update the asset paths (logo, etc.) to match your file structure
- Ensure all CSS and JS files are properly linked

### 2. CSS File (health-insurance-styles.css)
- Contains all styling with the same color scheme as your main site
- Responsive design for mobile devices
- Modern animations and transitions

### 3. JavaScript File (health-insurance-script.js)
- Handles all frontend interactions
- Form validation and submission
- Modal functionality
- Analytics tracking

## Backend Setup

### 1. Prerequisites
Install Node.js (version 14 or higher) and npm.

### 2. Initialize Package.json
Create `package.json`:

```json
{
  "name": "sas-health-insurance-api",
  "version": "1.0.0",
  "description": "SAS Policy Value Hub - Health Insurance API",
  "main": "health-insurance-backend.js",
  "scripts": {
    "start": "node health-insurance-backend.js",
    "dev": "nodemon health-insurance-backend.js",
    "test": "jest"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "nodemailer": "^6.9.7",
    "express-rate-limit": "^6.10.0",
    "helmet": "^7.1.0",
    "validator": "^13.11.0",
    "mongoose": "^7.5.4",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1",
    "jest": "^29.7.0"
  },
  "keywords": ["health", "insurance", "api", "nodejs", "express"],
  "author": "SAS Policy Value Hub Services",
  "license": "MIT"
}
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Environment Variables
Create `.env` file:

```env
# Server Configuration
PORT=3000
NODE_ENV=production

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/sas_health_insurance

# Email Configuration (Gmail SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Internal Email Addresses
SALES_EMAIL=sales@saspolicyvaluehub.com
MANAGER_EMAIL=manager@saspolicyvaluehub.com

# Security
JWT_SECRET=your-super-secret-jwt-key
API_KEY=your-api-key-for-external-services

# Rate Limiting
QUOTE_REQUESTS_PER_HOUR=5
GENERAL_REQUESTS_PER_WINDOW=100

# External API Keys (if needed)
INSURANCE_API_KEY=your-insurance-partner-api-key
SMS_API_KEY=your-sms-service-api-key
```

### 5. Database Setup
1. Install MongoDB locally or use MongoDB Atlas
2. Create database: `sas_health_insurance`
3. The application will automatically create collections

### 6. Email Configuration
For Gmail SMTP:
1. Enable 2-factor authentication on your Gmail account
2. Generate an app password
3. Use the app password in `SMTP_PASS`

### 7. Start the Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## Frontend Integration

### Update JavaScript API calls
In `health-insurance-script.js`, update the API endpoints:

```javascript
// Replace the mock API functions with real API calls
async function submitHealthQuoteRequest(data) {
    const response = await fetch('/api/health-quote', {
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
}
```

## Security Considerations

### 1. HTTPS
- Use SSL/TLS certificates in production
- Redirect all HTTP traffic to HTTPS

### 2. Rate Limiting
- Implemented for both general API calls and quote requests
- Adjust limits in `.env` file as needed

### 3. Input Validation
- Server-side validation for all inputs
- XSS and injection protection

### 4. CORS Configuration
```javascript
// Update CORS settings for production
app.use(cors({
    origin: ['https://yourdomain.com', 'https://www.yourdomain.com'],
    credentials: true
}));
```

### 5. Environment Variables
- Never commit `.env` file to version control
- Use different configurations for dev/staging/production

## Testing

### API Testing with curl
```bash
# Test health endpoint
curl http://localhost:3000/api/health

# Test quote submission
curl -X POST http://localhost:3000/api/health-quote \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phone": "+919876543210",
    "age": 30,
    "planType": "individual",
    "sumInsured": 500000
  }'
```

## Deployment

### 1. Server Deployment (AWS, DigitalOcean, etc.)
```bash
# Install PM2 for process management
npm install -g pm2

# Start with PM2
pm2 start health-insurance-backend.js --name "health-insurance-api"

# Setup auto-restart on server reboot
pm2 startup
pm2 save
```

### 2. Database Deployment
- Use MongoDB Atlas for managed database
- Set up proper backup and monitoring

### 3. CDN Setup
- Serve static files (CSS, JS, images) via CDN
- Configure caching headers

## Monitoring and Analytics

### 1. Application Monitoring
- Use tools like New Relic, DataDog, or PM2 monitoring
- Set up error tracking with Sentry

### 2. Analytics Integration
Update the tracking functions in JavaScript:
```javascript
// Google Analytics 4
function trackEvent(eventName, eventData = {}) {
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, eventData);
    }
}

// Facebook Pixel
function trackConversion(eventName, eventData = {}) {
    if (typeof fbq !== 'undefined') {
        fbq('track', eventName, eventData);
    }
}
```

## Customization

### 1. Design Modifications
- Update colors in CSS variables
- Modify typography and spacing
- Add/remove sections as needed

### 2. Form Fields
- Add/remove fields in HTML, JavaScript validation, and backend schema
- Update email templates accordingly

### 3. Insurance Plans
- Modify plan details in JavaScript modal content
- Update recommendation cards with current offers

## Performance Optimization

### 1. Frontend
- Minify CSS and JavaScript files
- Optimize images (WebP format)
- Implement lazy loading

### 2. Backend
- Database indexing on frequently queried fields
- Implement caching (Redis)