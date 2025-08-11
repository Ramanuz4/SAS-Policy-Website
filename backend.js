const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const validator = require('validator');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet({
    contentSecurityPolicy: false // Allow inline styles and scripts for development
}));
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // Serve static files

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});

const formLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5, // limit each IP to 5 form submissions per minute
    message: 'Too many form submissions, please try again later.'
});

app.use(limiter);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sas_insurance', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('MongoDB connection error:', err);
});

// Database schemas
const QuoteRequestSchema = new mongoose.Schema({
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    insuranceType: { type: String, required: true, enum: ['health', 'life', 'motor', 'multiple'] },
    age: { type: Number, required: true, min: 18, max: 100 },
    requirements: { type: String, trim: true },
    status: { type: String, default: 'pending', enum: ['pending', 'contacted', 'quoted', 'closed'] },
    quoteId: { type: String, unique: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const ContactMessageSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    subject: { type: String, required: true, enum: ['general', 'quote', 'claim', 'policy', 'complaint'] },
    message: { type: String, required: true, trim: true },
    status: { type: String, default: 'new', enum: ['new', 'read', 'replied', 'closed'] },
    messageId: { type: String, unique: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const QuoteRequest = mongoose.model('QuoteRequest', QuoteRequestSchema);
const ContactMessage = mongoose.model('ContactMessage', ContactMessageSchema);

// Email configuration
const transporter = nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// Utility functions
function generateQuoteId() {
    return 'QT' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
}

function generateMessageId() {
    return 'MSG' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
}

function validateQuoteData(data) {
    const errors = [];
    
    if (!data.firstName || data.firstName.trim().length < 2) {
        errors.push('First name must be at least 2 characters long');
    }
    if (!data.lastName || data.lastName.trim().length < 2) {
        errors.push('Last name must be at least 2 characters long');
    }
    if (!data.email || !validator.isEmail(data.email)) {
        errors.push('Please provide a valid email address');
    }
    if (!data.phone || !validator.isMobilePhone(data.phone, 'any')) {
        errors.push('Please provide a valid phone number');
    }
    if (!data.insuranceType || !['health', 'life', 'motor', 'multiple'].includes(data.insuranceType)) {
        errors.push('Please select a valid insurance type');
    }
    if (!data.age || data.age < 18 || data.age > 100) {
        errors.push('Age must be between 18 and 100');
    }
    
    return errors;
}

function validateContactData(data) {
    const errors = [];
    
    if (!data.name || data.name.trim().length < 2) {
        errors.push('Name must be at least 2 characters long');
    }
    if (!data.email || !validator.isEmail(data.email)) {
        errors.push('Please provide a valid email address');
    }
    if (data.phone && !validator.isMobilePhone(data.phone, 'any')) {
        errors.push('Please provide a valid phone number');
    }
    if (!data.subject || !['general', 'quote', 'claim', 'policy', 'complaint'].includes(data.subject)) {
        errors.push('Please select a valid subject');
    }
    if (!data.message || data.message.trim().length < 10) {
        errors.push('Message must be at least 10 characters long');
    }
    
    return errors;
}

// API Routes

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

// Quote request endpoint
app.post('/api/quote', formLimiter, async (req, res) => {
    try {
        const validationErrors = validateQuoteData(req.body);
        if (validationErrors.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: validationErrors
            });
        }

        const quoteId = generateQuoteId();
        const quoteRequest = new QuoteRequest({
            ...req.body,
            quoteId,
            email: req.body.email.toLowerCase(),
            firstName: req.body.firstName.trim(),
            lastName: req.body.lastName.trim(),
            phone: req.body.phone.trim(),
            requirements: req.body.requirements ? req.body.requirements.trim() : ''
        });

        await quoteRequest.save();

        // Send confirmation email to customer
        const customerEmailTemplate = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #1e40af; color: white; padding: 20px; text-align: center; }
                .content { padding: 20px; background: #f9f9f9; }
                .footer { padding: 20px; text-align: center; background: #333; color: white; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>SAS Policy Value Hub</h1>
                    <p>Your Insurance Partner</p>
                </div>
                <div class="content">
                    <h2>Dear ${quoteRequest.firstName} ${quoteRequest.lastName},</h2>
                    <p>Thank you for your interest in our insurance services. We have received your quote request with the following details:</p>
                    
                    <p><strong>Quote ID:</strong> ${quoteId}</p>
                    <p><strong>Insurance Type:</strong> ${quoteRequest.insuranceType.charAt(0).toUpperCase() + quoteRequest.insuranceType.slice(1)}</p>
                    <p><strong>Age:</strong> ${quoteRequest.age}</p>
                    ${quoteRequest.requirements ? `<p><strong>Additional Requirements:</strong> ${quoteRequest.requirements}</p>` : ''}
                    
                    <p>Our insurance experts will review your requirements and contact you within 24 hours with a personalized quote.</p>
                    <p>If you have any questions, feel free to contact us at info@saspolicyvaluehub.com or call us at +91 98765 43210.</p>
                    
                    <p>Best regards,<br>SAS Policy Value Hub Team</p>
                </div>
                <div class="footer">
                    <p>&copy; 2025 SAS Policy Value Hub Services. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>`;

        // Send admin notification email
        const adminEmailTemplate = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #1e40af; color: white; padding: 20px; text-align: center; }
                .content { padding: 20px; background: #f9f9f9; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>New Quote Request</h1>
                </div>
                <div class="content">
                    <h2>Quote Request Details</h2>
                    <p><strong>Quote ID:</strong> ${quoteId}</p>
                    <p><strong>Name:</strong> ${quoteRequest.firstName} ${quoteRequest.lastName}</p>
                    <p><strong>Email:</strong> ${quoteRequest.email}</p>
                    <p><strong>Phone:</strong> ${quoteRequest.phone}</p>
                    <p><strong>Insurance Type:</strong> ${quoteRequest.insuranceType}</p>
                    <p><strong>Age:</strong> ${quoteRequest.age}</p>
                    ${quoteRequest.requirements ? `<p><strong>Requirements:</strong> ${quoteRequest.requirements}</p>` : ''}
                    <p><strong>Submitted:</strong> ${new Date().toLocaleString('en-IN')}</p>
                </div>
            </div>
        </body>
        </html>`;

        // Send emails
        try {
            await transporter.sendMail({
                from: process.env.SMTP_FROM || process.env.SMTP_USER,
                to: quoteRequest.email,
                subject: 'Quote Request Confirmation - SAS Policy Value Hub',
                html: customerEmailTemplate
            });

            await transporter.sendMail({
                from: process.env.SMTP_FROM || process.env.SMTP_USER,
                to: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
                subject: `New Quote Request - ${quoteId}`,
                html: adminEmailTemplate
            });
        } catch (emailError) {
            console.error('Email sending error:', emailError);
            // Don't fail the request if email fails
        }

        res.json({
            success: true,
            message: 'Quote request submitted successfully',
            quoteId: quoteId
        });

    } catch (error) {
        console.error('Quote submission error:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while submitting your quote request'
        });
    }
});

// Contact message endpoint
app.post('/api/contact', formLimiter, async (req, res) => {
    try {
        const validationErrors = validateContactData(req.body);
        if (validationErrors.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: validationErrors
            });
        }

        const messageId = generateMessageId();
        const contactMessage = new ContactMessage({
            ...req.body,
            messageId,
            email: req.body.email.toLowerCase(),
            name: req.body.name.trim(),
            phone: req.body.phone ? req.body.phone.trim() : '',
            message: req.body.message.trim()
        });

        await contactMessage.save();

        // Send confirmation email to customer
        const customerEmailTemplate = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #1e40af; color: white; padding: 20px; text-align: center; }
                .content { padding: 20px; background: #f9f9f9; }
                .footer { padding: 20px; text-align: center; background: #333; color: white; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>SAS Policy Value Hub</h1>
                    <p>Your Insurance Partner</p>
                </div>
                <div class="content">
                    <h2>Dear ${contactMessage.name},</h2>
                    <p>Thank you for contacting SAS Policy Value Hub Services. We have received your message and will get back to you within 24 hours.</p>
                    
                    <p><strong>Message ID:</strong> ${messageId}</p>
                    <p><strong>Subject:</strong> ${contactMessage.subject.charAt(0).toUpperCase() + contactMessage.subject.slice(1)}</p>
                    <p><strong>Your Message:</strong> ${contactMessage.message}</p>
                    
                    <p>Our team will review your inquiry and respond appropriately. For urgent matters, please call us at +91 98765 43210.</p>
                    
                    <p>Best regards,<br>SAS Policy Value Hub Team</p>
                </div>
                <div class="footer">
                    <p>&copy; 2025 SAS Policy Value Hub Services. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>`;

        // Send admin notification email
        const adminEmailTemplate = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #1e40af; color: white; padding: 20px; text-align: center; }
                .content { padding: 20px; background: #f9f9f9; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>New Contact Message</h1>
                </div>
                <div class="content">
                    <h2>Contact Message Details</h2>
                    <p><strong>Message ID:</strong> ${messageId}</p>
                    <p><strong>Name:</strong> ${contactMessage.name}</p>
                    <p><strong>Email:</strong> ${contactMessage.email}</p>
                    ${contactMessage.phone ? `<p><strong>Phone:</strong> ${contactMessage.phone}</p>` : ''}
                    <p><strong>Subject:</strong> ${contactMessage.subject}</p>
                    <p><strong>Message:</strong> ${contactMessage.message}</p>
                    <p><strong>Submitted:</strong> ${new Date().toLocaleString('en-IN')}</p>
                </div>
            </div>
        </body>
        </html>`;

        // Send emails
        try {
            await transporter.sendMail({
                from: process.env.SMTP_FROM || process.env.SMTP_USER,
                to: contactMessage.email,
                subject: 'Message Received - SAS Policy Value Hub',
                html: customerEmailTemplate
            });

            await transporter.sendMail({
                from: process.env.SMTP_FROM || process.env.SMTP_USER,
                to: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
                subject: `New Contact Message - ${messageId}`,
                html: adminEmailTemplate
            });
        } catch (emailError) {
            console.error('Email sending error:', emailError);
            // Don't fail the request if email fails
        }

        res.json({
            success: true,
            message: 'Message sent successfully',
            messageId: messageId
        });

    } catch (error) {
        console.error('Contact submission error:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while sending your message'
        });
    }
});

// Admin endpoints (you may want to add authentication middleware)
app.get('/api/admin/quotes', async (req, res) => {
    try {
        const quotes = await QuoteRequest.find().sort({ createdAt: -1 });
        res.json({ success: true, data: quotes });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching quotes' });
    }
});

app.get('/api/admin/messages', async (req, res) => {
    try {
        const messages = await ContactMessage.find().sort({ createdAt: -1 });
        res.json({ success: true, data: messages });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching messages' });
    }
});

// Serve static files (HTML, CSS, JS)
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
