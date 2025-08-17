# SAS Policy Value Hub Services - Contact Us System

A comprehensive contact and quote management system for SAS Policy Value Hub Services, built with modern web technologies and best practices.

## 🚀 Features

### Frontend
- **Responsive Design**: Mobile-first approach with modern UI/UX
- **Interactive Contact Form**: Real-time validation and user feedback
- **Quick Quote Modal**: Streamlined quote request process
- **FAQ Section**: Collapsible FAQ with smooth animations
- **Contact Information**: Multiple contact methods with click-to-call/email
- **Analytics Integration**: User behavior tracking and conversion funnel
- **Performance Optimized**: Lazy loading, caching, and optimized assets

### Backend
- **RESTful API**: Clean and well-documented endpoints
- **Data Validation**: Comprehensive input validation and sanitization
- **Email System**: Automated confirmation and notification emails
- **Rate Limiting**: Protection against spam and abuse
- **Analytics Tracking**: User interaction and conversion tracking
- **Database Models**: Robust MongoDB schemas with validation
- **Error Handling**: Comprehensive error handling and logging
- **Security**: Helmet, CORS, input validation, and rate limiting

## 🛠️ Tech Stack

### Frontend
- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Modern styling with Flexbox/Grid and animations
- **Vanilla JavaScript**: Clean, performant client-side code
- **Responsive Design**: Mobile-first approach

### Backend
- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database with Mongoose ODM
- **Nodemailer**: Email sending functionality
- **Express Validator**: Input validation and sanitization
- **Helmet**: Security middleware
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: Request rate limiting

## 📁 Project Structure

```
contact-us-system/
├── frontend/
│   ├── contact.html          # Main HTML file
│   ├── contact.css           # Stylesheet
│   ├── contact.js            # Client-side JavaScript
│   └── assets/               # Images and other assets
├── backend/
│   ├── server.js             # Main server file
│   ├── routes/
│   │   ├── contact.js        # Contact form routes
│   │   ├── quote.js          # Quote request routes
│   │   └── analytics.js      # Analytics routes
│   ├── models/
│   │   ├── Contact.js        # Contact model
│   │   ├── Quote.js          # Quote model
│   │   └── Analytics.js      # Analytics model
│   ├── utils/
│   │   └── emailTemplates.js # Email templates
│   ├── package.json          # Dependencies
│   ├── .env.example          # Environment variables template
│   └── README.md             # This file
```

## ⚡ Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB (v5+)
- npm or yarn

### Backend Setup

1. **Clone and navigate to backend directory**
```bash
git clone <repository-url>
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
# Edit .env file with your configuration
```

4. **Start MongoDB**
```bash
# If using local MongoDB
mongod

# Or start MongoDB service
sudo systemctl start mongod
```

5. **Start the server**
```bash
# Development mode
npm run dev

# Production mode
npm start
```

### Frontend Setup

1. **Serve the frontend files**
```bash
# Using a simple HTTP server
npx http-server frontend/ -p 8080

# Or using Live Server extension in VS Code
# Or serve through your web server (Apache/Nginx)
```

2. **Update API endpoints**
   - Ensure the frontend JavaScript points to the correct backend URL
   - Update CORS settings in backend if serving from different domain

## 🔧 Configuration

### Environment Variables

Copy `.env.example` to `.env` and configure:

#### Essential Configuration
```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb://localhost:27017/sas-policy-hub
ADMIN_EMAIL=admin@saspolicyvaluehub.com
```

#### Email Configuration
```env
# For production (Gmail example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# For development/testing
ETHEREAL_USER=test@ethereal.email
ETHEREAL_PASS=test-password
```

### Database Setup

1. **MongoDB Local Installation**
```bash
# Ubuntu/Debian
sudo apt-get install mongodb

# macOS
brew install mongodb/brew/mongodb-community

# Windows - Download from MongoDB website
```

2. **MongoDB Atlas (Cloud)**
   - Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create cluster and get connection string
   - Update `MONGODB_URI` in `.env`

## 📧 Email Templates

The system includes beautifully designed HTML email templates:

- **Contact Confirmation**: Sent to customers after form submission
- **Contact Notification**: Sent to admin team for new contacts
- **Quote Confirmation**: Sent to customers for quote requests
- **Quote Notification**: Sent to sales team for new quotes

Templates are responsive and include:
- Company branding
- Contact information
- Next steps
- Professional styling

## 🔐 Security Features

- **Input Validation**: Comprehensive validation using express-validator
- **Rate Limiting**: Prevents spam and abuse
- **CORS Protection**: Configured for specific origins
- **Helmet Security**: Sets various HTTP headers
- **Data Sanitization**: Cleans user input before database storage
- **Error Handling**: Prevents information disclosure

## 📊 Analytics & Tracking

Built-in analytics system tracks:
- Page views and user interactions
- Form submissions and conversions
- User journey and behavior
- Device and browser information
- Traffic sources and campaigns

## 🚀 Deployment

### Backend Deployment (Node.js)

1. **Environment Setup**
```bash
# Set production environment
export NODE_ENV=production

# Install production dependencies
npm install --only=production
```

2. **Process Management (PM2)**
```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start server.js --name "sas-backend"

# Save PM2 configuration
pm2 save
pm2 startup
```

3. **Nginx Configuration**
```nginx
server {
    listen 80;
    server_name api.saspolicyvaluehub.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Frontend Deployment

1. **Static File Hosting**
   - Upload files to web server (Apache/Nginx)
   - Configure proper MIME types
   - Enable gzip compression
   - Set up SSL certificate

2. **CDN Integration** (Optional)
   - Use CloudFlare or AWS CloudFront
   - Configure caching rules
   - Optimize images and assets

## 📱 API Documentation

### Contact Endpoints

#### POST /api/contact
Submit a new contact form
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+91 9876543210",
  "subject": "quote",
  "insuranceType": "health",
  "message": "I need health insurance for my family",
  "newsletter": true
}
```

#### GET /api/contact (Admin)
Retrieve contact messages with pagination
```
GET /api/contact?page=1&limit=10&status=pending
```

### Quote Endpoints

#### POST /api/quote
Submit a new quote request
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "+91 9876543210",
  "insuranceType": "life",
  "age": 35,
  "requirements": "Looking for term life insurance"
}
```

#### GET /api/quote (Admin)
Retrieve quote requests
```
GET /api/quote?page=1&limit=10&insuranceType=health
```

### Analytics Endpoints

#### POST /api/analytics
Track user events
```json
{
  "event": "contact_form_submit",
  "data": {
    "subject": "quote",
    "insurance_type": "health"
  },
  "page": "contact"
}
```

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test contact.test.js
```

### Manual Testing
1. Test all form validations
2. Verify email sending functionality
3. Test rate limiting
4. Verify database operations
5. Test API endpoints with different data

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `.env`
   - Verify network access for MongoDB Atlas

2. **Email Not Sending**
   - Check SMTP credentials
   - Verify email provider settings
   - Test with Ethereal Email first

3. **CORS Errors**
   - Update `ALLOWED_ORIGINS` in `.env`
   - Check frontend API URLs
   - Verify server is running

4. **Rate Limiting Issues**
   - Check rate limit configuration
   - Clear client cache
   - Verify IP addressing

### Debugging
```bash
# Enable debug mode
DEBUG=true npm run dev

# Check logs
tail -f logs/app.log

# Monitor MongoDB
mongotop
mongostat
```

## 📈 Performance Optimization

### Backend Optimizations
- Database indexing for frequently queried fields
- Connection pooling for MongoDB
- Response compression with gzip
- Efficient query aggregation
- Caching for static data

### Frontend Optimizations
- Lazy loading for non-critical elements
- Image optimization and WebP format
- CSS and JavaScript minification
- Progressive Web App features
- Service worker for offline functionality

## 🔄 Maintenance

### Regular Tasks
- Database backup and cleanup
- Log file rotation
- Security updates
- Performance monitoring
- Email deliverability checks

### Backup Strategy
```bash
# Database backup
mongodump --db sas-policy-hub --out ./backups/$(date +%Y%m%d)

# Automated backup script
0 2 * * * /path/to/backup-script.sh
```

## 📞 Support

For technical support or questions:
- **Email**: developers@saspolicyvaluehub.com
- **Documentation**: Internal wiki
- **Issues**: GitHub issue tracker

## 📄 License

This project is proprietary software owned by SAS Policy Value Hub Services Pvt Ltd.

---

**SAS Policy Value Hub Services** - Your Security, Our Commitment 🛡️