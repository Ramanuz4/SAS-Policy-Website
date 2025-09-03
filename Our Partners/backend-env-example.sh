# Server Configuration
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/sas_insurance

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random

# Email Configuration (Gmail SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@saspolicyvaluehub.com

# Admin Configuration
ADMIN_EMAIL=admin@saspolicyvaluehub.com

# API Keys (if needed for external services)
# RAZORPAY_KEY_ID=your-razorpay-key
# RAZORPAY_KEY_SECRET=your-razorpay-secret

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads

# Redis Configuration (if using Redis for caching)
# REDIS_URL=redis://localhost:6379

# Production specific
# SSL_CERT_PATH=/path/to/ssl/cert
# SSL_KEY_PATH=/path/to/ssl/key