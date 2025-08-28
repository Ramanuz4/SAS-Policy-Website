# Server Configuration
PORT=3000
NODE_ENV=production

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/sas_insurance
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/sas_insurance

# Email Configuration (Gmail example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@saspolicyvaluehub.com

# Admin Configuration
ADMIN_EMAIL=admin@saspolicyvaluehub.com

# JWT Secret (for future authentication features)
JWT_SECRET=your-super-secret-jwt-key-here

# API Keys (if needed for third-party integrations)
INSURANCE_API_KEY=your-insurance-api-key
PAYMENT_GATEWAY_KEY=your-payment-gateway-key
ANALYTICS_API_KEY=your-analytics-api-key

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads

# Rate Limiting
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100
FORM_RATE_LIMIT_WINDOW=60000
FORM_RATE_LIMIT_MAX=5

# Security
CORS_ORIGIN=https://saspolicyvaluehub.com
SESSION_SECRET=your-session-secret-here

# External Service URLs
QUOTE_PROCESSING_URL=https://api.insurance-partner.com/quotes
POLICY_VERIFICATION_URL=https://api.insurance-partner.com/verify

# Notification Settings
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/your/slack/webhook
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
TELEGRAM_CHAT_ID=your-telegram-chat-id

# Backup Configuration
BACKUP_SCHEDULE=0 2 * * *
BACKUP_RETENTION_DAYS=30

# Monitoring
SENTRY_DSN=your-sentry-dsn-here
LOG_LEVEL=info