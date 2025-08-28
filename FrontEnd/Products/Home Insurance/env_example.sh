# Server Configuration
PORT=3000
NODE_ENV=development

# Email Configuration (Gmail SMTP example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password

# Company Email for receiving quote notifications
COMPANY_EMAIL=quotes@saspolicyvaluehub.com

# Database Configuration (if using a real database)
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=sas_home_insurance
# DB_USER=your_db_user
# DB_PASS=your_db_password

# Security Configuration
JWT_SECRET=your-super-secret-jwt-key-here
BCRYPT_ROUNDS=12

# API Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# External API Keys (if needed)
# INSURANCE_API_KEY=your-insurance-provider-api-key
# PAYMENT_GATEWAY_KEY=your-payment-gateway-key

# Logging Configuration
LOG_LEVEL=info

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_DIR=./uploads

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:8080

# Admin Panel Configuration
ADMIN_USERNAME=admin
ADMIN_PASSWORD=secure-admin-password

# SMS Configuration (optional)
# SMS_API_KEY=your-sms-provider-api-key
# SMS_SENDER_ID=SASPVH