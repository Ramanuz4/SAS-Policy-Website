# Environment Configuration for SAS Policy Value Hub Backend
# Copy this file to .env and fill in your actual values

# Application Settings
NODE_ENV=development
PORT=3000
APP_NAME="SAS Policy Value Hub Services"
APP_URL=http://localhost:3000

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/sas-policy-hub
# For MongoDB Atlas (Production):
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sas-policy-hub?retryWrites=true&w=majority

# Email Configuration (Production SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
# Note: For Gmail, use App Password instead of regular password

# Admin Notification Emails
ADMIN_EMAIL=admin@saspolicyvaluehub.com
QUOTE_EMAIL=quotes@saspolicyvaluehub.com
SUPPORT_EMAIL=support@saspolicyvaluehub.com

# Development Email Configuration (Ethereal Email for testing)
ETHEREAL_USER=your-ethereal-email@ethereal.email
ETHEREAL_PASS=your-ethereal-password
# Get credentials from https://ethereal.email/create

# Security Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
BCRYPT_ROUNDS=12

# Rate Limiting (requests per window)
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
CONTACT_RATE_LIMIT_MAX=5
QUOTE_RATE_LIMIT_MAX=10

# File Upload Configuration
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=pdf,doc,docx,jpg,jpeg,png

# Analytics Configuration
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
FACEBOOK_PIXEL_ID=123456789012345

# External API Keys (if needed)
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_PHONE_NUMBER=+1234567890

RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
RAZORPAY_KEY_SECRET=your-razorpay-secret

# Logging Configuration
LOG_LEVEL=info
LOG_FILE=./logs/app.log

# SSL Configuration (Production)
SSL_CERT_PATH=/path/to/ssl/cert.pem
SSL_KEY_PATH=/path/to/ssl/private.key

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,https://saspolicyvaluehub.com,https://www.saspolicyvaluehub.com

# Session Configuration
SESSION_SECRET=your-session-secret-key
SESSION_NAME=sas-session
SESSION_COOKIE_MAX_AGE=86400000

# Redis Configuration (if using Redis for sessions/caching)
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=your-redis-password

# Backup Configuration
BACKUP_SCHEDULE=0 2 * * *
BACKUP_RETENTION_DAYS=30
AWS_S3_BUCKET=sas-policy-backups
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=ap-south-1

# Monitoring and Error Reporting
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
NEW_RELIC_LICENSE_KEY=your-new-relic-license-key

# Feature Flags
ENABLE_EMAIL_NOTIFICATIONS=true
ENABLE_SMS_NOTIFICATIONS=false
ENABLE_ANALYTICS=true
ENABLE_FILE_UPLOADS=true
ENABLE_ADMIN_PANEL=true

# Development Settings (Development only)
DEBUG=true
VERBOSE_LOGGING=true
MOCK_EMAIL=true
DISABLE_RATE_LIMITING=false