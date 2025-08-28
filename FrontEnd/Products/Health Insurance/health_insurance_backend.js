// health-insurance-backend.js
// Node.js Express backend for Health Insurance service

const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const validator = require('validator');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Quote request rate limiting (more restrictive)
const quoteLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // Limit each IP to 5 quote requests per hour
    message: 'Too many quote requests. Please try again after an hour.'
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sas_health_insurance', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Health Quote Schema
const healthQuoteSchema = new mongoose.Schema({
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true },
    phone: { type: String, required: true },
    age: { type: Number, required: true, min: 18, max: 100 },
    planType: { 
        type: String, 
        required: true,
        enum: ['individual', 'family', 'senior', 'critical', 'topup', 'group']
    },
    sumInsured: { type: Number, required: true },
    familySize: { type: Number, min: 1, max: 10 },
    medicalHistory: { type: String, trim: true },
    specificRequirements: { type: String, trim: true },
    estimatedPremium: { type: Number },
    status: { 
        type: String, 
        enum: ['pending', 'contacted', 'quoted', 'converted', 'closed'],
        default: 'pending'
    },
    source: { type: String, default: 'website' },
    ipAddress: { type: String },
    userAgent: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const HealthQuote = mongoose.model('HealthQuote', healthQuoteSchema);

// Contact Schema
const contactSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true },
    phone: { type: String },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: { 
        type: String, 
        enum: ['new', 'in_progress', 'resolved', 'closed'],
        default: 'new'
    },
    ipAddress: { type: String },
    userAgent: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Contact = mongoose.model('Contact', contactSchema);

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
const validateHealthQuoteData = (data) => {
    const errors = [];

    if (!data.firstName || data.firstName.length < 2) {
        errors.push('First name must be at least 2 characters long');
    }

    if (!data.lastName || data.lastName.length < 2) {
        errors.push('Last name must be at least 2 characters long');
    }

    if (!data.email || !validator.isEmail(data.email)) {
        errors.push('Valid email address is required');
    }

    if (!data.phone || !validator.isMobilePhone(data.phone, 'en-IN')) {
        errors.push('Valid Indian mobile number is required');
    }

    if (!data.age || data.age < 18 || data.age > 100) {
        errors.push('Age must be between 18 and 100 years');
    }

    if (!data.planType || !['individual', 'family', 'senior', 'critical', 'topup', 'group'].includes(data.planType)) {
        errors.push('Valid plan type is required');
    }

    if (!data.sumInsured || data.sumInsured < 100000 || data.sumInsured > 10000000) {
        errors.push('Sum insured must be between ₹1 lakh and ₹1 crore');
    }

    if (data.familySize && (data.familySize < 1 || data.familySize > 10)) {
        errors.push('Family size must be between 1 and 10 members');
    }

    return errors;
};

const calculatePremium = (data) => {
    let basePremium = 5000;
    
    // Age factor
    if (data.age > 60) basePremium *= 2.5;
    else if (data.age > 45) basePremium *= 1.8;
    else if (data.age > 35) basePremium *= 1.3;
    else if (data.age > 25) basePremium *= 1.1;
    
    // Sum insured factor
    basePremium = basePremium * (data.sumInsured / 500000);
    
    // Plan type factor
    const planMultipliers = {
        individual: 1,
        family: 0.75,
        senior: 2.2,
        critical: 0.6,
        topup: 0.35,
        group: 0.4
    };
    
    basePremium *= planMultipliers[data.planType] || 1;
    
    // Family size factor for family plans
    if (data.planType === 'family' && data.familySize) {
        if (data.familySize > 4) {
            basePremium *= (1 + (data.familySize - 4) * 0.2);
        }
    }
    
    // Medical history factor (simplified)
    if (data.medicalHistory && data.medicalHistory.length > 50) {
        basePremium *= 1.3; // Increase premium for detailed medical history
    }
    
    return Math.round(basePremium);
};

const sendQuoteConfirmationEmail = async (quoteData) => {
    const emailTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1e40af, #3b82f6); color: white; padding: 30px 20px; text-align: center; }
            .content { padding: 30px 20px; background: #f8fafc; }
            .quote-details { background: white; padding: 20px; margin: 20px 0; border-radius: 10px; border-left: 4px solid #3b82f6; }
            .detail-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
            .premium-highlight { background: #fbbf24; color: white; padding: 15px; text-align: center; border-radius: 8px; margin: 20px 0; }
            .footer { background: #1e293b; color: white; padding: 20px; text-align: center; }
            .next-steps { background: #e0f2fe; padding: 20px; border-radius: 8px; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🏥 Health Insurance Quote Request Received</h1>
                <p>Thank you for choosing SAS Policy Value Hub Services</p>
            </div>
            
            <div class="content">
                <h2>Dear ${quoteData.firstName} ${quoteData.lastName},</h2>
                <p>We have received your health insurance quote request and our experts are already working on preparing personalized quotes for you.</p>
                
                <div class="quote-details">
                    <h3>Your Quote Details:</h3>
                    <div class="detail-row">
                        <span><strong>Plan Type:</strong></span>
                        <span>${quoteData.planType.charAt(0).toUpperCase() + quoteData.planType.slice(1)} Insurance</span>
                    </div>
                    <div class="detail-row">
                        <span><strong>Sum Insured:</strong></span>
                        <span>₹${(quoteData.sumInsured / 100000).toFixed(0)} Lakhs</span>
                    </div>
                    <div class="detail-row">
                        <span><strong>Age:</strong></span>
                        <span>${quoteData.age} years</span>
                    </div>
                    ${quoteData.familySize ? `
                    <div class="detail-row">
                        <span><strong>Family Size:</strong></span>
                        <span>${quoteData.familySize} members</span>
                    </div>
                    ` : ''}
                </div>
                
                <div class="premium-highlight">
                    <h3>Estimated Premium: ₹${quoteData.estimatedPremium?.toLocaleString() || 'Calculating...'} per year</h3>
                    <p>*This is an estimated premium. Actual premium may vary based on detailed health assessment.</p>
                </div>
                
                <div class="next-steps">
                    <h3>What Happens Next?</h3>
                    <ul>
                        <li>Our health insurance expert will call you within 2 hours</li>
                        <li>We'll discuss your specific needs and preferences</li>
                        <li>You'll receive personalized quotes from top insurers</li>
                        <li>We'll help you compare plans and choose the best option</li>
                        <li>Complete assistance with policy purchase and documentation</li>
                    </ul>
                </div>
                
                <p>If you have any immediate questions, please don't hesitate to contact us:</p>
                <ul>
                    <li>📞 Phone: +91 98765 43210</li>
                    <li>📧 Email: health@saspolicyvaluehub.com</li>
                    <li>💬 WhatsApp: +91 98765 43210</li>
                </ul>
            </div>
            
            <div class="footer">
                <p>SAS Policy Value Hub Services Pvt Ltd</p>
                <p>Your Health, Our Priority</p>
                <p>123 Business Center, Insurance District, New Delhi, India 110001</p>
            </div>
        </div>
    </body>
    </html>
    `;

    const mailOptions = {
        from: `"SAS Policy Value Hub" <${process.env.SMTP_USER}>`,
        to: quoteData.email,
        subject: 'Health Insurance Quote Request Received - SAS Policy Value Hub',
        html: emailTemplate
    };

    return transporter.sendMail(mailOptions);
};

const sendInternalNotification = async (quoteData) => {
    const internalTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .urgent { background: #dc2626; color: white; padding: 15px; text-align: center; border-radius: 8px; margin-bottom: 20px; }
            .client-details { background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
            .priority-high { border-left: 4px solid #dc2626; }
            .priority-medium { border-left: 4px solid #f59e0b; }
            .priority-low { border-left: 4px solid #10b981; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="urgent">
                <h2>🚨 NEW HEALTH INSURANCE LEAD</h2>
                <p>Action Required: Contact within 2 hours</p>
            </div>
            
            <div class="client-details ${quoteData.age > 50 || quoteData.sumInsured > 1000000 ? 'priority-high' : 'priority-medium'}">
                <h3>Client Information:</h3>
                <div class="detail-grid">
                    <div><strong>Name:</strong> ${quoteData.firstName} ${quoteData.lastName}</div>
                    <div><strong>Email:</strong> ${quoteData.email}</div>
                    <div><strong>Phone:</strong> ${quoteData.phone}</div>
                    <div><strong>Age:</strong> ${quoteData.age} years</div>
                    <div><strong>Plan Type:</strong> ${quoteData.planType}</div>
                    <div><strong>Sum Insured:</strong> ₹${(quoteData.sumInsured / 100000)} Lakhs</div>
                    ${quoteData.familySize ? `<div><strong>Family Size:</strong> ${quoteData.familySize} members</div>` : ''}
                    <div><strong>Estimated Premium:</strong> ₹${quoteData.estimatedPremium?.toLocaleString()}</div>
                </div>
                
                ${quoteData.medicalHistory ? `
                <div style="margin-top: 15px;">
                    <strong>Medical History:</strong>
                    <p style="background: white; padding: 10px; border-radius: 4px; margin-top: 5px;">${quoteData.medicalHistory}</p>
                </div>
                ` : ''}
                
                ${quoteData.specificRequirements ? `
                <div style="margin-top: 15px;">
                    <strong>Specific Requirements:</strong>
                    <p style="background: white; padding: 10px; border-radius: 4px; margin-top: 5px;">${quoteData.specificRequirements}</p>
                </div>
                ` : ''}
                
                <div style="margin-top: 15px;">
                    <strong>Lead Priority:</strong> 
                    <span style="color: ${quoteData.age > 50 || quoteData.sumInsured > 1000000 ? '#dc2626' : '#f59e0b'}">
                        ${quoteData.age > 50 || quoteData.sumInsured > 1000000 ? 'HIGH' : 'MEDIUM'}
                    </span>
                </div>
                
                <div style="margin-top: 15px;">
                    <strong>Source:</strong> Health Insurance Service Page
                </div>
                
                <div style="margin-top: 15px;">
                    <strong>Submitted:</strong> ${new Date().toLocaleString('en-IN')}
                </div>
            </div>
            
            <div style="background: #3b82f6; color: white; padding: 15px; border-radius: 8px; text-align: center;">
                <h3>Immediate Actions Required:</h3>
                <ul style="text-align: left; margin: 10px 0;">
                    <li>Call the client within 2 hours</li>
                    <li>Prepare personalized quotes from at least 3 insurers</li>
                    <li>Update CRM with lead details</li>
                    <li>Schedule follow-up based on client preference</li>
                </ul>
            </div>
        </div>
    </body>
    </html>
    `;

    const mailOptions = {
        from: `"SAS Health Insurance System" <${process.env.SMTP_USER}>`,
        to: process.env.SALES_EMAIL || 'sales@saspolicyvaluehub.com',
        cc: process.env.MANAGER_EMAIL || 'manager@saspolicyvaluehub.com',
        subject: `🚨 URGENT: New Health Insurance Lead - ${quoteData.firstName} ${quoteData.lastName}`,
        html: internalTemplate
    };

    return transporter.sendMail(mailOptions);
};

// API Routes

// Health Insurance Quote Request
app.post('/api/health-quote', quoteLimiter, async (req, res) => {
    try {
        const quoteData = req.body;
        
        // Validate input data
        const validationErrors = validateHealthQuoteData(quoteData);
        if (validationErrors.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: validationErrors
            });
        }

        // Calculate estimated premium
        quoteData.estimatedPremium = calculatePremium(quoteData);
        
        // Add metadata
        quoteData.ipAddress = req.ip;
        quoteData.userAgent = req.get('User-Agent');

        // Save to database
        const healthQuote = new HealthQuote(quoteData);
        await healthQuote.save();

        // Send confirmation email to client (async)
        sendQuoteConfirmationEmail(quoteData).catch(err => {
            console.error('Error sending confirmation email:', err);
        });

        // Send internal notification (async)
        sendInternalNotification(quoteData).catch(err => {
            console.error('Error sending internal notification:', err);
        });

        res.status(200).json({
            success: true,
            message: 'Health insurance quote request submitted successfully',
            quoteId: healthQuote._id,
            estimatedPremium: quoteData.estimatedPremium,
            data: {
                firstName: quoteData.firstName,
                lastName: quoteData.lastName,
                planType: quoteData.planType,
                sumInsured: quoteData.sumInsured
            }
        });

    } catch (error) {
        console.error('Health quote submission error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error. Please try again later.'
        });
    }
});

// Contact form submission
app.post('/api/contact', limiter, async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;

        // Validation
        if (!name || name.length < 2) {
            return res.status(400).json({
                success: false,
                message: 'Name must be at least 2 characters long'
            });
        }

        if (!email || !validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: 'Valid email address is required'
            });
        }

        if (!subject || subject.length < 5) {
            return res.status(400).json({
                success: false,
                message: 'Subject must be at least 5 characters long'
            });
        }

        if (!message || message.length < 10) {
            return res.status(400).json({
                success: false,
                message: 'Message must be at least 10 characters long'
            });
        }

        if (phone && !validator.isMobilePhone(phone, 'en-IN')) {
            return res.status(400).json({
                success: false,
                message: 'Please enter a valid phone number'
            });
        }

        // Save to database
        const contactData = {
            name,
            email,
            phone,
            subject,
            message,
            ipAddress: req.ip,
            userAgent: req.get('User-Agent')
        };

        const contact = new Contact(contactData);
        await contact.save();

        res.status(200).json({
            success: true,
            message: 'Message sent successfully. We will get back to you within 24 hours.',
            contactId: contact._id
        });

    } catch (error) {
        console.error('Contact form submission error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error. Please try again later.'
        });
    }
});

// Get quote status
app.get('/api/quote-status/:quoteId', async (req, res) => {
    try {
        const { quoteId } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(quoteId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid quote ID'
            });
        }

        const quote = await HealthQuote.findById(quoteId).select('status firstName lastName createdAt estimatedPremium');
        
        if (!quote) {
            return res.status(404).json({
                success: false,
                message: 'Quote not found'
            });
        }

        res.json({
            success: true,
            data: {
                status: quote.status,
                firstName: quote.firstName,
                lastName: quote.lastName,
                submittedAt: quote.createdAt,
                estimatedPremium: quote.estimatedPremium
            }
        });

    } catch (error) {
        console.error('Quote status error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        service: 'SAS Health Insurance API',
        version: '1.0.0'
    });
});

// Admin endpoints (protected - implement authentication as needed)
app.get('/api/admin/quotes', async (req, res) => {
    try {
        const { page = 1, limit = 10, status, planType } = req.query;
        
        const filter = {};
        if (status) filter.status = status;
        if (planType) filter.planType = planType;

        const quotes = await HealthQuote.find(filter)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .select('-ipAddress -userAgent');

        const total = await HealthQuote.countDocuments(filter);

        res.json({
            success: true,
            data: quotes,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error('Admin quotes error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'API endpoint not found'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`SAS Health Insurance API server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('Shutting down gracefully...');
    await mongoose.connection.close();
    process.exit(0);
});

module.exports = app;