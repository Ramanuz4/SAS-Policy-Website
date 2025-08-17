# SAS Policy Value Hub Services - Our Partners Page

A comprehensive insurance partners webpage with complete frontend and backend implementation.

## 🚀 Features

- **Responsive Design**: Mobile-first approach with beautiful animations
- **Interactive Partner Cards**: Detailed information modals for each partner
- **Quote Request System**: Lead generation with email notifications
- **Contact Forms**: Customer inquiry management
- **Admin Dashboard**: Backend management for quotes and messages
- **Email Integration**: Automated confirmations and notifications
- **Database Storage**: MongoDB for data persistence
- **Security**: Rate limiting, input validation, and authentication

## 📁 Project Structure

```
sas-partners/
├── frontend/
│   ├── partners.html       # Main HTML file
│   ├── partners.css        # Styling
│   └── partners.js         # Frontend JavaScript
├── backend/
│   ├── server.js           # Main server file
│   ├── package.json        # Dependencies
│   ├── .env.example        # Environment variables template
│   └── scripts/
│       ├── seed.js         # Database seeding
│       └── create-admin.js # Admin user management
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Gmail account (for email functionality)

### Backend Setup

1. **Clone and Navigate**
   ```bash
   git clone <repository-url>
   cd sas-partners/backend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/sas_insurance
   JWT_SECRET=your-super-secret-key-here
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-gmail-app-password
   ADMIN_EMAIL=admin@saspolicyvaluehub.com
   ```

4. **Database Setup**
   ```bash
   # Seed partners data
   npm run seed
   
   # Create admin user
   npm run create-admin
   ```

5. **Start Server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

### Frontend Setup

1. **File Structure**
   ```
   frontend/
   ├── partners.html
   ├── partners.css
   ├── partners.js
   └── assets/
       └── SAS Logo.png
   ```

2. **Static File Serving**
   - Use a local server like `Live Server` extension in VS Code
   - Or serve via Node.js static middleware
   - Or deploy to a CDN/hosting service

3. **API Configuration**
   Update the API base URL in `partners.js` if needed:
   ```javascript
   const API_BASE_URL = 'http://localhost:3000/api';
   ```

## 📧 Email Setup (Gmail)

1. **Enable 2-Factor Authentication**
   - Go to your Gmail account settings
   - Enable 2FA in Security settings

2. **Generate App Password**
   - Go to Security → App passwords
   - Generate password for "Mail"
   - Use this password in `SMTP_PASS`

3. **Environment Variables**
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-16-character-app-password
   ```

## 🎯 API Endpoints

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/partners` | Get all partners |
| GET | `/api/partners/:id` | Get specific partner |
| POST | `/api/quote-request` | Submit quote request |
| POST | `/api/contact` | Submit contact message |

### Protected Admin Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/admin/login` | Admin login | No |
| GET | `/api/admin/quote-requests` | Get quote requests | Yes |
| GET | `/api/admin/contact-messages` | Get contact messages | Yes |
| PATCH | `/api/admin/quote-requests/:id` | Update quote status | Yes |
| GET | `/api/admin/analytics` | Get analytics data | Yes |

## 🏢 Insurance Partners

Our trusted partners include:

1. **HDFC ERGO** - General Insurance
2. **HDFC Life** - Life Insurance
3. **ICICI Lombard** - General Insurance
4. **Manipal Cigna** - Health Insurance
5. **Care Health Insurance** - Health Insurance
6. **Niva Bupa Health Insurance** - Health Insurance
7. **Star Health Insurance** - Health Insurance

## 💻 Usage Examples

### Frontend Integration

```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="partners.css">
</head>
<body>
    <!-- Page content -->
    <script src="partners.js"></script>
</body>
</html>
```

### API Usage

```javascript
// Get all partners
const partners = await fetch('/api/partners');

// Submit quote request
const quoteData = {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+91 9876543210',
    insuranceType: 'health',
    preferredPartner: 'hdfc-ergo'
};

const response = await fetch('/api/quote-request', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(quoteData)
});
```

## 🔐 Admin Panel Access

1. **Create Admin User**
   ```bash
   npm run create-admin
   ```

2. **Login Endpoint**
   ```javascript
   POST /api/admin/login
   {
       "username": "admin",
       "password": "your-password"
   }
   ```

3. **Use JWT Token**
   ```javascript
   fetch('/api/admin/quote-requests', {
       headers: {
           'Authorization': 'Bearer ' + token
       }
   })
   ```

## 🎨 Customization

### Color Palette

The design uses a consistent color scheme:

```css
:root {
    --primary-blue: #1e40af;
    --secondary-blue: #3b82f6;
    --accent-orange: #f59e0b;
    --text-dark: #1e293b;
    --text-light: #64748b;
    --background-light: #f8fafc;
}
```

### Adding New Partners

1. **Update Database**
   ```javascript
   // Add to scripts/seed.js
   const newPartner = {
       partnerId: 'new-partner',
       name: 'New Partner Name',
       type: 'Insurance Type',
       // ... other fields
   };
   ```

2. **Run Seed Script**
   ```bash
   npm run seed
   ```

## 🚀 Deployment

### Backend Deployment (Heroku)

```bash
# Install Heroku CLI
heroku create sas-policy-backend

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=mongodb+srv://...
heroku config:set JWT_SECRET=...

# Deploy
git push heroku main
```

### Frontend Deployment (Netlify/Vercel)

```bash
# Build and deploy
npm run build
netlify deploy --prod
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage
```

## 📊 Monitoring

### Health Check

```bash
curl http://localhost:3000/api/health
```

### Logs

```bash
# View logs
npm run logs

# Production logs (PM2)
pm2 logs sas-backend
```

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check MongoDB is running
   - Verify MONGODB_URI in .env

2. **Email Not Sending**
   - Verify Gmail app password
   - Check SMTP settings

3. **CORS Errors**
   - Update FRONTEND_URL in .env
   - Check origin in cors configuration

4. **Port Already in Use**
   ```bash
   # Kill process on port 3000
   lsof -ti:3000 | xargs kill -9
   ```

## 📞 Support

For technical support or questions:
- Email: tech@saspolicyvaluehub.com
- Phone: +91 98765 43210

## 📄 License

Copyright © 2024 SAS Policy Value Hub Services Pvt Ltd. All rights reserved.

---

**Happy Coding! 🚀**