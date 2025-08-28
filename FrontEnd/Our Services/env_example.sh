# Server Configuration
PORT=5000
NODE_ENV=production

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/sas-insurance

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random

# Email Configuration (Gmail SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-specific-password

# Admin Email (receives notifications)
ADMIN_EMAIL=admin@saspolicyvaluehub.com

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads

# Redis Configuration (for session management - optional)
REDIS_URL=redis://localhost:6379

# API Keys (if needed for third-party integrations)
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret

# Google reCAPTCHA (optional)
RECAPTCHA_SITE_KEY=your-recaptcha-site-key
RECAPTCHA_SECRET_KEY=your-recaptcha-secret-key

# Logging Configuration
LOG_LEVEL=info
LOG_FILE=logs/app.log

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Security
BCRYPT_ROUNDS=12
SESSION_SECRET=your-session-secret-key

# Database
DB_HOST=localhost
DB_PORT=27017
DB_NAME=sas_insurance
DB_USER=
DB_PASS=

# Third-party APIs
INSURANCE_API_KEY=your-insurance-api-key
SMS_API_KEY=your-sms-api-key
SMS_API_URL=https://api.textlocal.in/send/