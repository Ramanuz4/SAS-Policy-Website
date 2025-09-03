# SAS Policy Value Hub - Life Insurance Service Setup Guide

## 📁 File Structure
```
life-insurance-service/
├── frontend/
│   ├── index.html                  # Main HTML file
│   ├── life-insurance-styles.css   # Styling
│   ├── life-insurance-script.js    # Frontend JavaScript
│   └── assets/
│       └── SAS Logo.png
├── backend/
│   ├── life-insurance-backend.js   # Express.js API server
│   ├── package.json               # Dependencies
│   ├── .env                       # Environment variables
│   └── README.md
└── README.md
```

## 🚀 Backend Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Email service (Gmail/SMTP)

### Installation Steps

1. **Install Dependencies**
```bash
cd backend
npm install
```

2. **Environment Configuration**
Create a `.env` file in the backend directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/sas_life_insurance
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/sas_life_insurance

# JWT Secret (change in production)
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Email Configuration (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
ADMIN_EMAIL=admin@saspolicyvaluehub.com

# Server
PORT=3000
NODE_ENV=development

# Optional: API Keys for insurance providers
INSURANCE_API_KEY=your-insurance-api-key
PAYMENT_GATEWAY_KEY=your-payment-gateway-key
```

3. **Database Setup**
```bash
# Start MongoDB locally
mongod

# Or use MongoDB Atlas cloud service
# Update MONGODB_URI in .env file accordingly
```

4. **Email Configuration**
For Gmail, you need to:
- Enable 2-factor authentication
- Generate an App Password
- Use the App Password in EMAIL_PASS

5. **Start the Server**
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## 🎨 Frontend Setup

### File Locations
Place the frontend files in your web server directory:

```
your-website/
├── life-insurance/
│   ├── index.html
│   ├── life-insurance-styles.css
│   ├── life-insurance-script.js
│   └── assets/
│       └── SAS Logo.png
```

### API Configuration
Update the API base URL in `life-insurance-script.js`:

```javascript
// Update these URLs to match your backend server
const API_BASE_URL = 'http://localhost:3000/api'; // Development
// const API_BASE_URL = 'https://your-domain.com/api'; // Production
```

## 📧 Email Templates

The system includes responsive email templates for:
- Consultation confirmations
- Premium quotes
- Application submissions
- Status updates

## 🔒 Security Features

### Implemented Security Measures
- Helmet.js for security headers
- CORS configuration
- Rate limiting (100 requests per 15 minutes)
- Input validation and sanitization
- MongoDB injection prevention
- XSS protection

### Additional Security Recommendations
1. **SSL/HTTPS**: Always use HTTPS in production
2. **Environment Variables**: Never commit sensitive data
3. **Database Access**: Use MongoDB Atlas with IP whitelisting
4. **API Keys**: Rotate keys regularly
5. **Monitoring**: Implement logging and monitoring

## 📊 API Endpoints

### Public Endpoints
```
POST /api/consultation          # Submit consultation request
POST /api/calculate-premium     # Calculate insurance premium
POST /api/quote-request        # Submit quote request
GET  /api/quote/:quoteId       # Get quote by ID
POST /api/policy-application   # Submit policy application
GET  /api/application/:appId   # Get application status
```

### Admin Endpoints (Authentication Required)
```
GET  /api/admin/consultations  # List all consultations
GET  /api/admin/quotes         # List all quotes
GET  /api/admin/applications   # List all applications
PUT  /api/admin/consultation/:id # Update consultation
GET  /api/admin/analytics      # Get analytics data
```

## 🧪 Testing

### Manual Testing
1. **Consultation Form**: Submit and verify email delivery
2. **Premium Calculator**: Test with different age/coverage combinations
3. **Quote Request**: Verify quote generation and email
4. **Application**: Test complete policy application flow

### Automated Testing
```bash
# Run tests
npm test

# Test specific endpoints
npm run test:consultation
npm run test:calculator
npm run test:quotes
```

## 📈 Analytics & Monitoring

### Built-in Analytics
- Daily/Monthly/Yearly consultation counts
- Quote request statistics
- Popular plan types
- Conversion rates

### Monitoring Setup
```javascript
// Add to your monitoring service
app.use('/api', (req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});
```

## 🔧 Customization

### Adding New Plan Types
1. Update `calculatePremium()` function
2. Add plan details in `openPlanModal()`
3. Update validation in backend
4. Add to frontend plan grid

### Email Template Customization
Edit email templates in backend functions:
- `sendEmail()` function
- HTML templates in API routes

### Color Scheme Updates
The current color scheme uses:
- Primary Blue: `#1e40af` to `#3b82f6`
- Secondary Orange: `#f59e0b` to `#d97706`
- Success Green: `#10b981`
- Background Gray: `#f8fafc`

## 🚀 Deployment

### Frontend Deployment
1. **Static Hosting**: Upload to any web server
2. **CDN**: Use CloudFlare or similar for global distribution
3. **Domain**: Point your domain to the hosting service

### Backend Deployment

#### Option 1: Heroku
```bash
# Install Heroku CLI
npm install -g heroku

# Login and create app
heroku login
heroku create sas-life-insurance-api

# Set environment variables
heroku config:set MONGODB_URI=your-mongodb-atlas-uri
heroku config:set JWT_SECRET=your-jwt-secret
heroku config:set EMAIL_USER=your-email
heroku config:set EMAIL_PASS=your-email-password

# Deploy
git push heroku main
```

#### Option 2: Digital Ocean/AWS
1. Create a server instance
2. Install Node.js and MongoDB
3. Upload code and install dependencies
4. Configure environment variables
5. Set up PM2 for process management
6. Configure nginx as reverse proxy

#### Option 3: Vercel/Netlify Functions
Convert Express routes to serverless functions

## 📱 Mobile Responsiveness

The frontend is fully responsive with:
- Mobile-first design approach
- Touch-friendly interface
- Optimized forms for mobile input
- Progressive Web App (PWA) ready

## 🔄 Integration Options

### Insurance Provider APIs
```javascript
// Example integration with insurance provider
async function getInsuranceQuote(planDetails) {
    const response = await fetch('https://insurance-provider-api.com/quote', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${INSURANCE_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(planDetails)
    });
    return response.json();
}
```

### Payment Gateway Integration
```javascript
// Example Razorpay integration
async function createPaymentOrder(amount, customerInfo) {
    const options = {
        amount: amount * 100, // amount in smallest currency unit
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
        notes: {
            customer_name: customerInfo.name,
            policy_type: customerInfo.planType
        }
    };
    
    const order = await razorpay.orders.create(options);
    return order;
}
```

### CRM Integration
```javascript
// Example Salesforce integration
async function createLeadInCRM(consultationData) {
    const leadData = {
        FirstName: consultationData.name.split(' ')[0],
        LastName: consultationData.name.split(' ').slice(1).join(' '),
        Email: consultationData.email,
        Phone: consultationData.phone,
        Company: 'Individual',
        LeadSource: 'Website',
        Industry: 'Insurance'
    };
    
    // Send to CRM API
    const response = await salesforceApi.createLead(leadData);
    return response;
}
```

## 📊 Database Schema

### Collections Overview
```javascript
// Consultation Schema
{
    _id: ObjectId,
    name: String,
    phone: String,
    email: String,
    age: Number,
    planInterest: String,
    message: String,
    status: String, // pending, contacted, qualified, converted, closed
    source: String,
    assignedTo: String,
    followUpDate: Date,
    notes: [{ text: String, addedBy: String, addedAt: Date }],
    createdAt: Date,
    updatedAt: Date
}

// Quote Request Schema
{
    _id: ObjectId,
    personalInfo: {
        name: String,
        phone: String,
        email: String,
        age: Number,
        gender: String,
        smokingStatus: String
    },
    planDetails: {
        planType: String,
        coverageAmount: Number,
        policyTerm: Number
    },
    calculatedPremium: {
        annual: Number,
        monthly: Number,
        total: Number
    },
    status: String, // pending, quoted, proposal, issued
    quoteId: String,
    validTill: Date,
    createdAt: Date,
    updatedAt: Date
}

// Policy Application Schema
{
    _id: ObjectId,
    applicantInfo: {
        personalDetails: { ... },
        contactDetails: { ... },
        identityProof: { ... }
    },
    policyDetails: { ... },
    nominees: [{ ... }],
    medicalInfo: { ... },
    applicationStatus: String,
    applicationId: String,
    submittedAt: Date,
    approvedAt: Date,
    policyNumber: String,
    createdAt: Date,
    updatedAt: Date
}
```

## 🔧 Advanced Features

### 1. Multi-language Support
```javascript
// Add to frontend
const translations = {
    en: {
        title: "Life Insurance Services",
        calculate: "Calculate Premium"
    },
    hi: {
        title: "जीवन बीमा सेवाएं",
        calculate: "प्रीमियम की गणना करें"
    }
};

function translatePage(language) {
    // Implementation for translation
}
```

### 2. Progressive Web App (PWA)
Create `manifest.json`:
```json
{
    "name": "SAS Life Insurance",
    "short_name": "SAS Insurance",
    "description": "Life Insurance Services",
    "start_url": "/",
    "display": "standalone",
    "theme_color": "#1e40af",
    "background_color": "#ffffff",
    "icons": [
        {
            "src": "icons/icon-192x192.png",
            "sizes": "192x192",
            "type": "image/png"
        },
        {
            "src": "icons/icon-512x512.png",
            "sizes": "512x512",
            "type": "image/png"
        }
    ]
}
```

### 3. Real-time Chat Support
```javascript
// WebSocket integration for live chat
const io = require('socket.io')(server);

io.on('connection', (socket) => {
    socket.on('join-support', (userData) => {
        socket.join('support-room');
        // Handle chat logic
    });
    
    socket.on('chat-message', (message) => {
        // Handle message broadcasting
        io.to('support-room').emit('new-message', message);
    });
});
```

### 4. Document Upload & Management
```javascript
// Multer configuration for file uploads
const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/documents/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Invalid file type'));
        }
    }
});

app.post('/api/upload-documents', upload.array('documents', 5), (req, res) => {
    // Handle document upload
});
```

## 🔍 SEO Optimization

### Meta Tags Setup
```html
<!-- Add to HTML head -->
<meta property="og:title" content="Life Insurance Services | SAS Policy Value Hub">
<meta property="og:description" content="Secure your family's financial future with comprehensive life insurance solutions. Expert guidance, competitive rates.">
<meta property="og:image" content="https://yourdomain.com/assets/og-image.jpg">
<meta property="og:url" content="https://yourdomain.com/life-insurance">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Life Insurance Services | SAS Policy Value Hub">
<meta name="twitter:description" content="Secure your family's financial future with comprehensive life insurance solutions.">
<meta name="twitter:image" content="https://yourdomain.com/assets/twitter-image.jpg">

<!-- Structured Data -->
<script type="application/ld+json">
{
    "@context": "https://schema.org",
    "@type": "InsuranceAgency",
    "name": "SAS Policy Value Hub Services",
    "description": "Life Insurance Services Provider",
    "url": "https://yourdomain.com",
    "telephone": "+91-98765-43210",
    "address": {
        "@type": "PostalAddress",
        "streetAddress": "123 Business Center",
        "addressLocality": "New Delhi",
        "addressRegion": "Delhi",
        "postalCode": "110001",
        "addressCountry": "IN"
    },
    "sameAs": [
        "https://www.facebook.com/saspolicyvaluehub",
        "https://www.linkedin.com/company/saspolicyvaluehub"
    ]
}
</script>
```

## 📈 Performance Optimization

### Frontend Optimization
```javascript
// Lazy loading implementation
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            observer.unobserve(img);
        }
    });
}, observerOptions);

// Service Worker for caching
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
        .then(registration => console.log('SW registered'))
        .catch(error => console.log('SW registration failed'));
}
```

### Backend Optimization
```javascript
// Add compression middleware
const compression = require('compression');
app.use(compression());

// Database indexing
consultationSchema.index({ email: 1, createdAt: -1 });
quoteRequestSchema.index({ quoteId: 1 });
policyApplicationSchema.index({ applicationId: 1 });

// Caching with Redis (optional)
const redis = require('redis');
const client = redis.createClient();

app.get('/api/popular-plans', async (req, res) => {
    const cacheKey = 'popular-plans';
    const cached = await client.get(cacheKey);
    
    if (cached) {
        return res.json(JSON.parse(cached));
    }
    
    const data = await getPopularPlans();
    await client.setEx(cacheKey, 3600, JSON.stringify(data)); // Cache for 1 hour
    res.json(data);
});
```

## 🧪 Testing Strategy

### Unit Tests
```javascript
// test/calculator.test.js
const { calculatePremium } = require('../utils/calculator');

describe('Premium Calculator', () => {
    test('should calculate correct premium for term insurance', () => {
        const result = calculatePremium(30, 'male', 1000000, 'term', 20, 'no');
        expect(result.annual).toBeGreaterThan(0);
        expect(result.monthly).toBe(Math.round(result.annual / 12));
    });
    
    test('should apply smoking surcharge', () => {
        const nonSmoker = calculatePremium(30, 'male', 1000000, 'term', 20, 'no');
        const smoker = calculatePremium(30, 'male', 1000000, 'term', 20, 'yes');
        expect(smoker.annual).toBeGreaterThan(nonSmoker.annual);
    });
});
```

### Integration Tests
```javascript
// test/api.test.js
const request = require('supertest');
const app = require('../life-insurance-backend');

describe('API Endpoints', () => {
    test('POST /api/consultation should create consultation', async () => {
        const consultationData = {
            name: 'Test User',
            phone: '+919876543210',
            email: 'test@example.com',
            age: 30,
            planInterest: 'term'
        };
        
        const response = await request(app)
            .post('/api/consultation')
            .send(consultationData)
            .expect(201);
            
        expect(response.body.success).toBe(true);
        expect(response.body.consultationId).toBeDefined();
    });
});
```

## 🔒 Data Privacy & Compliance

### GDPR Compliance
```javascript
// Add privacy controls
app.post('/api/data-deletion-request', async (req, res) => {
    const { email, reason } = req.body;
    
    // Log deletion request
    await DataDeletionRequest.create({
        email,
        reason,
        requestedAt: new Date(),
        status: 'pending'
    });
    
    res.json({ message: 'Data deletion request submitted' });
});

// Data export functionality
app.get('/api/export-data/:email', async (req, res) => {
    const userEmail = req.params.email;
    
    const userData = {
        consultations: await Consultation.find({ email: userEmail }),
        quotes: await QuoteRequest.find({ 'personalInfo.email': userEmail }),
        applications: await PolicyApplication.find({ 'applicantInfo.contactDetails.email': userEmail })
    };
    
    res.json(userData);
});
```

## 📞 Support & Maintenance

### Logging Setup
```javascript
const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),
    defaultMeta: { service: 'life-insurance-api' },
    transports: [
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' })
    ]
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}
```

### Health Monitoring
```javascript
// Health check endpoint with detailed status
app.get('/api/health', async (req, res) => {
    const health = {
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV,
        version: process.env.npm_package_version,
        database: 'connected',
        email: 'configured'
    };
    
    try {
        await mongoose.connection.db.admin().ping();
    } catch (error) {
        health.database = 'disconnected';
        health.status = 'ERROR';
    }
    
    res.status(health.status === 'OK' ? 200 : 500).json(health);
});
```

## 🚀 Go Live Checklist

### Pre-Launch
- [ ] Environment variables configured
- [ ] Database backups set up
- [ ] SSL certificates installed
- [ ] Email templates tested
- [ ] API rate limits configured
- [ ] Error logging implemented
- [ ] Performance monitoring set up
- [ ] Security headers configured
- [ ] GDPR compliance implemented
- [ ] Mobile responsiveness tested

### Launch Day
- [ ] DNS records updated
- [ ] CDN configured
- [ ] Monitoring alerts set up
- [ ] Support team briefed
- [ ] Backup procedures tested
- [ ] Load testing completed

### Post-Launch
- [ ] Monitor error rates
- [ ] Track conversion metrics
- [ ] Gather user feedback
- [ ] Performance optimization
- [ ] Security audits
- [ ] Regular backups verified

## 📞 Support Contacts

### Technical Support
- **Backend Issues**: backend-support@saspolicyvaluehub.com
- **Frontend Issues**: frontend-support@saspolicyvaluehub.com
- **Database Issues**: db-admin@saspolicyvaluehub.com

### Business Support
- **General Queries**: info@saspolicyvaluehub.com
- **Sales Support**: sales@saspolicyvaluehub.com
- **Customer Service**: support@saspolicyvaluehub.com

---

**Note**: This is a comprehensive setup guide. Adapt the configurations based on your specific hosting environment and requirements. Always test thoroughly in a staging environment before deploying to production.