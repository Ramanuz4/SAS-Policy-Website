# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SAS Policy Value Hub Services is an insurance solutions website with both frontend and backend components. The project provides tailored insurance services including Health, Life, and Motor insurance with a modern web interface and RESTful API backend.

## Development Commands

### Frontend & Root Commands
```bash
# Install dependencies
npm install

# Start development server (with auto-restart)
npm run dev

# Start production server
npm start

# Run tests
npm test

# Lint code
npm run lint

# Fix linting issues automatically
npm run lint:fix
```

### Backend Commands
```bash
# Navigate to backend directory
cd BackEnd

# Install backend dependencies
npm install

# Start backend development server
npm run dev

# Start backend production server
npm start

# Run backend tests
npm test

# Seed database with initial data
npm run seed
```

## Architecture Overview

### Project Structure
- **Frontend**: Static HTML/CSS/JS served from root directory
- **Backend**: Node.js Express API in `BackEnd/` directory
- **Database**: MongoDB with Mongoose ODM
- **Email**: Nodemailer integration for notifications

### Key Files & Directories
- `index.html` - Main application entry point
- `script.js` - Frontend JavaScript with API integration
- `styles.css` - All CSS styles and responsive design
- `frontend-integration.js` - API integration helper functions
- `BackEnd/server.js` - Express server with all API endpoints and database models
- Insurance-specific pages in directories: `Products/Health Insurance/`, `Products/Life Insurance/`, `Products/Motor Insurance/`, `Products/Travel Insurance/`, `Products/Home Insurance/`
- Static pages: `About Us/`, `Contact Us/`, `Our Services/`, `Our Partners/`, `Privacy Policy/`, `Customer Review/`

### Database Schema
Two main collections:
1. **Contact Messages** - Contact form submissions with status tracking
2. **Quote Requests** - Insurance quote requests with customer details

### API Architecture
- Base URL: `http://localhost:5000/api` (development)
- Rate limiting: 5 requests per 15 minutes per IP
- CORS enabled for frontend communication
- Security headers via Helmet.js
- Input validation using Validator.js

### Key API Endpoints
- `POST /api/contact` - Submit contact messages
- `POST /api/quote` - Submit insurance quote requests
- `POST /api/newsletter` - Newsletter subscriptions
- `GET /api/health` - Health check endpoint
- Admin endpoints for quote/message management

## Development Environment Setup

### Prerequisites
- Node.js v14+ and npm v6+
- MongoDB (local installation or Atlas cloud)
- Gmail account for email functionality

### Environment Configuration
Create `.env` file in `BackEnd/` directory with:
```env
MONGODB_URI=mongodb://localhost:27017/sas_policy_hub
FRONTEND_URL=http://localhost:3000
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@saspolicyvaluehub.com
ADMIN_EMAIL=admin@saspolicyvaluehub.com
PORT=5000
```

### Running the Application
1. Start MongoDB service
2. Run backend: `cd BackEnd && npm run dev` (port 5000)
3. Serve frontend on port 3000 or configure web server
4. Frontend communicates with backend API

## Code Patterns & Conventions

### Frontend JavaScript
- ES6+ syntax with async/await for API calls
- Modular functions for form handling and UI interactions
- API_BASE_URL constant for environment configuration
- Event-driven architecture for user interactions

### Backend Express Server
- Single-file server architecture in `BackEnd/server.js`
- Mongoose schemas defined inline
- Comprehensive error handling and validation
- Rate limiting and security middleware
- Email notification system integrated

### Security Implementation
- Input validation on all form submissions
- Rate limiting to prevent abuse
- Security headers via Helmet.js
- CORS configuration for cross-origin requests
- Environment-based configuration management

## Testing & Quality Assurance

- Jest test framework configured for both frontend and backend
- ESLint with Standard configuration for code quality
- Supertest for API endpoint testing
- Client-side form validation with server-side verification

## Deployment Considerations

The application supports multiple deployment strategies:
- Static hosting (Vercel/Netlify) for frontend with serverless functions
- Traditional VPS/cloud server deployment
- Heroku with MongoDB Atlas integration
- Docker containerization ready (though no Dockerfile currently exists)