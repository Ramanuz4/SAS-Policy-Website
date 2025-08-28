# SAS Policy Value Hub Services

A comprehensive insurance solutions website built with modern web technologies, providing tailored insurance services including Health, Life, and Motor insurance.

## 🚀 Features

### Frontend Features
- **Responsive Design**: Mobile-first approach with modern UI/UX
- **Interactive Elements**: Smooth animations, hover effects, and scroll animations
- **Form Validation**: Real-time client-side validation with user-friendly error messages
- **Modal System**: Dynamic modals for service details and quotes
- **Performance Optimized**: Lazy loading, optimized animations, and fast loading times

### Backend Features
- **RESTful API**: Clean API endpoints for form submissions and data management
- **Database Integration**: MongoDB with Mongoose for data persistence
- **Email Integration**: Automated email notifications using Nodemailer
- **Security**: Rate limiting, input validation, and security headers
- **Admin Dashboard**: API endpoints for managing quotes and messages

## 📁 Project Structure

```
sas-policy-value-hub/
├── public/
│   ├── index.html          # Main HTML file
│   ├── styles.css          # All CSS styles
│   └── script.js           # Frontend JavaScript
├── server.js               # Backend Node.js server
├── package.json            # Dependencies and scripts
├── .env                    # Environment variables
└── README.md              # This file
```

## 🛠️ Technology Stack

### Frontend
- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Modern styling with flexbox, grid, animations, and gradients
- **JavaScript (ES6+)**: Modern JavaScript with async/await, modules, and DOM manipulation

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **MongoDB**: Database for storing quotes and messages
- **Mongoose**: ODM for MongoDB
- **Nodemailer**: Email sending functionality

### Security & Performance
- **Helmet.js**: Security headers
- **Express Rate Limit**: API rate limiting
- **CORS**: Cross-origin resource sharing
- **Validator.js**: Input validation
- **Compression**: Response compression

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Gmail account (for email functionality)

### Installation

1. **Clone or download the project files**
2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   - Copy the `.env` file and update with your actual values
   - Set up MongoDB connection string
   - Configure email settings (Gmail recommended)

4. **Start MongoDB** (if using local installation)
   ```bash
   mongod
   ```

5. **Run the application**
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

6. **Access the website**
   - Open your browser and go to `http://localhost:3000`

## 📧 Email Configuration

### Gmail Setup
1. Enable 2-factor authentication on your Gmail account
2. Generate an app password: Google Account → Security → App passwords
3. Use the app password in the `SMTP_PASS` environment variable

### Environment Variables for Email
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-character-app-password
SMTP_FROM=noreply@saspolicyvaluehub.com
ADMIN_EMAIL=admin@saspolicyvaluehub.com
```

## 🗄️ Database Schema

### Quote Requests
```javascript
{
  firstName: String (required),
  lastName: String (required),
  email: String (required, validated),
  phone: String (required),
  insuranceType: String (enum: health, life, motor, multiple),
  age: Number (18-100),
  requirements: String (optional),
  status: String (enum: pending, contacted, quoted, closed),
  quoteId: String (unique),
  createdAt: Date,
  updatedAt: Date
}
```

### Contact Messages
```javascript
{
  name: String (required),
  email: String (required, validated),
  phone: String (optional),
  subject: String (enum: general, quote, claim, policy, complaint),
  message: String (required),
  status: String (enum: new, read, replied, closed),
  messageId: String (unique),
  createdAt: Date,
  updatedAt: Date
}
```

## 🔌 API Endpoints

### Public Endpoints
- `POST /api/quote` - Submit quote request
- `POST /api/contact` - Submit contact message
- `POST /api/newsletter` - Newsletter subscription
- `GET /api/health` - Health check

### Admin Endpoints (Authentication recommended)
- `GET /api/admin/quotes` - Get all quote requests
- `GET /api/admin/messages` - Get all contact messages
- `PUT /api/admin/quote/:quoteId/status` - Update quote status
- `PUT /api/admin/message/:messageId/status` - Update message status
- `GET /api/analytics/dashboard` - Get analytics data

## 🎨 Customization

### Styling
- Modify `styles.css` to change colors, fonts, and layouts
- The color scheme uses CSS custom properties for easy theming
- All animations can be customized or disabled

### Content
- Update `index.html` to change text content, images, and structure
- Modify service details in `script.js` (serviceDetails object)
- Update contact information and business details

### Functionality
- Add new form fields by updating both frontend and backend validation
- Integrate with third-party APIs for real insurance quotes
- Add payment processing for premium payments

## 🔒 Security Features

- **Input Validation**: Server-side validation for all form inputs
- **Rate Limiting**: Prevents spam and abuse
- **Security Headers**: Helmet.js for security headers
- **SQL Injection Protection**: MongoDB queries are naturally protected
- **XSS Protection**: Input sanitization and validation

## 📱 Mobile Responsiveness

The website is fully responsive with:
- Mobile-first design approach
- Collapsible navigation menu
- Touch-friendly buttons and forms
- Optimized layouts for all screen sizes

## 🚀 Deployment Options

### Heroku
1. Create a Heroku app
2. Add MongoDB Atlas as database
3. Set environment variables in Heroku dashboard
4. Deploy using Git or GitHub integration

### Vercel/Netlify (Frontend only)
1. Deploy static files to Vercel or Netlify
2. Use serverless functions for API endpoints

### VPS/Cloud Server
1. Set up Node.js on your server
2. Install MongoDB or use MongoDB Atlas
3. Configure reverse proxy (Nginx recommended)
4. Set up SSL certificates

## 📈 Analytics & Monitoring

The backend includes basic analytics endpoints. For production, consider adding:
- Google Analytics
- Error tracking (Sentry)
- Performance monitoring
- User behavior analytics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For technical support or questions:
- Email: support@saspolicyvaluehub.com
- Phone: +91 98765 43210

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Built with ❤️ for SAS Policy Value Hub Services**