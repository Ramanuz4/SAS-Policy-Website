const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Import routes
const contactRoutes = require('./routes/contact');
const quoteRoutes = require('./routes/quote');
const analyticsRoutes = require('./routes/analytics');

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sas-policy-hub', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'"],
            fontSrc: ["'self'"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"],
        },
    },
}));

app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://saspolicyvaluehub.com', 'https://www.saspolicyvaluehub.com']
        : ['http://localhost:3000', 'http://127.0.0.1:5500'],
    credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const createRateLimit = (windowMs, max, message) => rateLimit({
    windowMs,
    max,
    message: { success: false, message },
    standardHeaders: true,
    legacyHeaders: false,
});

// General rate limit
app.use(createRateLimit(15 * 60 * 1000, 100, 'Too many requests from this IP'));

// Specific rate limits for sensitive endpoints
const contactRateLimit = createRateLimit(15 * 60 * 1000, 5, 'Too many contact submissions');
const quoteRateLimit = createRateLimit(15 * 60 * 1000, 10, 'Too many quote requests');

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Email transporter setup
const createEmailTransporter = () => {
    if (process.env.NODE_ENV === 'production') {
        // Production email configuration
        return nodemailer.createTransporter({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });
    } else {
        // Development configuration using Ethereal Email
        return nodemailer.createTransporter({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: process.env.ETHEREAL_USER || 'ethereal.user@ethereal.email',
                pass: process.env.ETHEREAL_PASS || 'ethereal.pass'
            }
        });
    }
};

const emailTransporter = createEmailTransporter();

// Test email connection
emailTransporter.verify((error, success) => {
    if (error) {
        console.log('❌ Email transporter error:', error);
    } else {
        console.log('✅ Email transporter ready');
    }
});

// Make transporter available to routes
app.locals.emailTransporter = emailTransporter;

// Routes
app.use('/api/contact', contactRateLimit, contactRoutes);
app.use('/api/quote', quoteRateLimit, quoteRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'SAS Policy Value Hub API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Serve contact page
app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'contact.html'));
});

// Serve main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 404 handler
app.use('*', (req, res) => {
    if (req.originalUrl.startsWith('/api/')) {
        res.status(404).json({
            success: false,
            message: 'API endpoint not found'
        });
    } else {
        res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
    }
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Global error handler:', err);
    
    // Log error details
    console.error({
        error: err.message,
        stack: err.stack,
        url: req.originalUrl,
        method: req.method,
        ip: req.ip,
        timestamp: new Date().toISOString()
    });
    
    // Send appropriate response
    const statusCode = err.statusCode || 500;
    const message = process.env.NODE_ENV === 'production' 
        ? 'Internal server error' 
        : err.message;
    
    if (req.originalUrl.startsWith('/api/')) {
        res.status(statusCode).json({
            success: false,
            message,
            ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
        });
    } else {
        res.status(statusCode).sendFile(path.join(__dirname, 'public', '500.html'));
    }
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
        console.log('Process terminated');
        mongoose.connection.close(false, () => {
            console.log('MongoDB connection closed');
            process.exit(0);
        });
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT received. Shutting down gracefully...');
    server.close(() => {
        console.log('Process terminated');
        mongoose.connection.close(false, () => {
            console.log('MongoDB connection closed');
            process.exit(0);
        });
    });
});

const server = app.listen(PORT, () => {
    console.log(`🚀 SAS Policy Value Hub server running on port ${PORT}`);
    console.log(`📧 Email service: ${process.env.NODE_ENV === 'production' ? 'Production SMTP' : 'Development (Ethereal)'}`);
    console.log(`🗄️ Database: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
});

module.exports = app;