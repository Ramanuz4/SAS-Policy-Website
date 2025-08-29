# SAS Policy Value Hub - Database Setup Instructions

## Complete Setup Guide

This guide will help you set up the MongoDB database and backend server for handling contact form submissions and quote requests.

## Prerequisites

1. **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
2. **MongoDB** (v4.4 or higher) - Choose one:
   - Local installation: [Download MongoDB Community Edition](https://www.mongodb.com/try/download/community)
   - Cloud option: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (Free tier available)
3. **Gmail Account** with App-specific password enabled

## Step 1: MongoDB Setup

### Option A: Local MongoDB Installation
1. Install MongoDB Community Edition on your system
2. Start MongoDB service:
   ```bash
   # Windows
   mongod
   
   # Mac/Linux
   sudo systemctl start mongod
   ```
3. MongoDB will run on `mongodb://localhost:27017` by default

### Option B: MongoDB Atlas (Cloud)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier available)
3. Configure network access (allow your IP)
4. Create a database user with password
5. Get your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)

## Step 2: Gmail Setup for Email Notifications

1. Go to your Google Account settings
2. Navigate to Security → 2-Step Verification (must be enabled)
3. Go to App passwords
4. Generate a new app password for "Mail"
5. Copy this 16-character password (you'll need it for the `.env` file)

## Step 3: Backend Server Setup

1. Create a new folder for your backend:
   ```bash
   mkdir sas-backend
   cd sas-backend
   ```

2. Create the following file structure:
   ```
   sas-backend/
   ├── server.js
   ├── .env
   ├── package.json
   └── .gitignore
   ```

3. Copy all the provided files into their respective locations

4. Create a `.gitignore` file:
   ```
   node_modules/
   .env
   *.log
   ```

5. Install dependencies:
   ```bash
   npm install
   ```

6. Configure your `.env` file with your actual credentials:
   ```env
   # MongoDB (choose one)
   # For local MongoDB:
   MONGODB_URI=mongodb://localhost:27017/sas_policy_hub
   
   # For MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/sas_policy_hub?retryWrites=true&w=majority
   
   # Email configuration
   EMAIL_USER=your_gmail_account@gmail.com
   EMAIL_PASS=your_16_character_app_password
   NOTIFICATION_EMAIL=mannguptagx@gmail.com
   
   # Server
   PORT=5000
   FRONTEND_URL=http://localhost:3000
   ```

## Step 4: Frontend Integration

1. Update your existing `script.js` file with the provided frontend integration code
2. Make sure the `API_BASE_URL` in the script matches your backend URL:
   ```javascript
   const API_BASE_URL = 'http://localhost:5000/api';
   ```

## Step 5: Running the Application

1. Start the backend server:
   ```bash
   # Development mode (with auto-reload)
   npm run dev
   
   # Production mode
   npm start
   ```

2. Open your `index.html` file in a web browser (or serve it with a local server)

3. Test the forms - submissions should:
   - Be saved to MongoDB
   - Send email notification to `mannguptagx@gmail.com`
   - Send confirmation email to the user
   - Show success message on the frontend

## Step 6: Admin Dashboard

1. Open `admin.html` in your browser to view all submissions
2. Features include:
   - View all contact messages and quote requests
   - Filter by status, date, type
   - Update status of submissions
   - View detailed information

## Database Schema

### Contacts Collection
- `name`: String (required)
- `email`: String (required, validated)
- `phone`: String (optional)
- `subject`: String (enum: general, quote, claim, policy, complaint)
- `message`: String (required)
- `status`: String (pending, read, responded, archived)
- `createdAt`: Date
- `ipAddress`: String
- `userAgent`: String

### Quotes Collection
- `firstName`: String (required)
- `lastName`: String (required)
- `email`: String (required, validated)
- `phone`: String (required)
- `insuranceType`: String (health, life, motor, multiple)
- `age`: Number (18-100)
- `requirements`: String (optional)
- `status`: String (pending, contacted, quoted, converted, archived)
- `createdAt`: Date

## Security Features

- **Rate Limiting**: Maximum 5 submissions per IP every 15 minutes
- **Input Validation**: All inputs are sanitized and validated
- **XSS Protection**: HTML entities are escaped
- **CORS Configuration**: Only allows requests from specified frontend URL
- **Helmet.js**: Additional security headers

## Deployment Considerations

### For Production:
1. Use environment variables for all sensitive data
2. Enable HTTPS for both frontend and backend
3. Implement proper authentication for admin dashboard
4. Set up MongoDB backups
5. Use a process manager like PM2 for the Node.js server
6. Consider using a reverse proxy (Nginx/Apache)

### Recommended Hosting:
- **Backend**: Heroku, Railway, Render, or DigitalOcean
- **MongoDB**: MongoDB Atlas (managed cloud database)
- **Frontend**: Netlify, Vercel, or GitHub Pages

## Troubleshooting

### Common Issues:

1. **MongoDB Connection Error**:
   - Ensure MongoDB is running
   - Check connection string in `.env`
   - For Atlas, whitelist your IP address

2. **Email Not Sending**:
   - Verify Gmail app password is correct
   - Check if "Less secure app access" is needed
   - Ensure 2FA is enabled on Gmail account

3. **CORS Error**:
   - Update `FRONTEND_URL` in `.env` to match your frontend URL
   - Ensure backend server is running

4. **Forms Not Submitting**:
   - Check browser console for errors
   - Verify `API_BASE_URL` in frontend matches backend URL
   - Ensure backend server is running

## API Endpoints

- `POST /api/contact` - Submit contact form
- `POST /api/quote` - Submit quote request
- `GET /api/health` - Health check
- `GET /api/admin/contacts` - Get all contacts (needs auth in production)
- `GET /api/admin/quotes` - Get all quotes (needs auth in production)
- `PATCH /api/admin/contacts/:id` - Update contact status

## Support

For any issues or questions regarding the database setup, please contact the development team or refer to the documentation of the respective technologies:
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Documentation](https://expressjs.com/)
- [Nodemailer Documentation](https://nodemailer.com/)

---

**Note**: Remember to keep your `.env` file secure and never commit it to version control!