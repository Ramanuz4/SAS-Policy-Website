// motor-insurance-backend.js
// Node.js Express backend for Motor Insurance service

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const validator = require('validator');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/motor_insurance', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Database schemas
const QuoteRequestSchema = new mongoose.Schema({
    vehicleType: { type: String, required: true },
    registrationNumber: String,
    make: String,
    model: String,
    manufacturingYear: Number,
    fuelType: String,
    fullName: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String, required: true },
    city: { type: String, required: true },
    policyType: { type: String, required: true },
    additionalInfo: String,
    estimatedPremium: Number,
    status: { type: String, default: 'pending' },
    source: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const ContactMessageSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, default: 'unread' },
    source: String,
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
const validateInput = {
    email: (email) => validator.isEmail(email),
    phone: (phone) => validator.isMobilePhone(phone, 'en-IN'),
    registrationNumber: (regNo) => /^[A-Z]{2}[0-9]{1,2}[A-Z]{0,3}[0-9]{1,4}$/.test(regNo),
    year: (year) => year >= 1990 && year <= new Date().getFullYear(),
    vehicleType: (type) => ['car', 'bike', 'commercial'].includes(type),
    policyType: (type) => ['comprehensive', 'third-party'].includes(type)
};

const calculatePremium = (data) => {
    let basePremium = 5000;
    
    // Base premium by vehicle type
    const vehiclePremiums = {
        car: 8000,
        bike: 3000,
        commercial: 15000
    };
    
    basePremium = vehiclePremiums[data.vehicleType] || 5000;
    
    // Age factor
    const currentYear = new Date().getFullYear();
    const vehicleAge = currentYear - parseInt(data.manufacturingYear);
    
    if (vehicleAge <= 3) {
        basePremium *= 1.0;
    } else if (vehicleAge <= 5) {
        basePremium *= 1.1;
    } else if (vehicleAge <= 10) {
        basePremium *= 1.3;
    } else {
        basePremium *= 1.5;
    }
    
    // Policy type factor
    if (data.policyType === 'third-party') {
        basePremium *= 0.25;
    }
    
    // Fuel type factor
    if (data.fuelType === 'diesel') {
        basePremium *= 1.1;
    } else if (data.fuelType === 'electric') {
        basePremium *= 0.9;
    }
    
    // City factor (simplified)
    const tierOneCities = ['mumbai', 'delhi', 'bangalore', 'chennai', 'kolkata', 'hyderabad', 'pune'];
    if (data.city && tierOneCities.includes(data.city.toLowerCase())) {
        basePremium *= 1.2;
    }
    
    return Math.round(basePremium);
};

const sendEmail = async (to, subject, html) => {
    try {
        await transporter.sendMail({
            from: process.env.SMTP_FROM || 'noreply@saspolicyvaluehub.com',
            to,
            subject,
            html
        });
        return true;
    } catch (error) {
        console.error('Email sending failed:', error);
        return false;
    }
};

// API Routes

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        service: 'Motor Insurance API'
    });
});

// Motor Quote Request API
app.post('/api/motor-quote', async (req, res) => {
    try {
        const {
            vehicleType,
            registrationNumber,
            make,
            model,
            manufacturingYear,
            fuelType,
            fullName,
            mobile,
            email,
            city,
            policyType,
            additionalInfo,
            source
        } = req.body;

        // Input validation
        const errors = [];

        if (!vehicleType || !validateInput.vehicleType(vehicleType)) {
            errors.push('Invalid vehicle type');
        }

        if (!fullName || fullName.trim().length < 2) {
            errors.push('Full name is required and must be at least 2 characters');
        }

        if (!mobile || !validateInput.phone(mobile)) {
            errors.push('Valid mobile number is required');
        }

        if (!email || !validateInput.email(email)) {
            errors.push('Valid email address is required');
        }

        if (!city || city.trim().length < 2) {
            errors.push('City is required');
        }

        if (!policyType || !validateInput.policyType(policyType)) {
            errors.push('Invalid policy type');
        }

        if (manufacturingYear && !validateInput.year(manufacturingYear)) {
            errors.push('Invalid manufacturing year');
        }

        if (registrationNumber && !validateInput.registrationNumber(registrationNumber)) {
            errors.push('Invalid registration number format');
        }

        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors
            });
        }

        // Calculate estimated premium
        const estimatedPremium = calculatePremium(req.body);

        // Create quote request
        const quoteRequest = new QuoteRequest({
            vehicleType,
            registrationNumber: registrationNumber?.toUpperCase(),
            make,
            model,
            manufacturingYear: parseInt(manufacturingYear),
            fuelType,
            fullName: fullName.trim(),
            mobile: mobile.trim(),
            email: email.toLowerCase().trim(),
            city: city.trim(),
            policyType,
            additionalInfo: additionalInfo?.trim(),
            estimatedPremium,
            source: source || 'motor-insurance-page'
        });

        const savedQuote = await quoteRequest.save();

        // Send confirmation email to customer
        const customerEmailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; padding: 30px; text-align: center;">
                    <h1>Motor Insurance Quote Request Received</h1>
                    <p>Thank you for choosing SAS Policy Value Hub Services</p>
                </div>
                
                <div style="padding: 30px; background: #f8fafc;">
                    <h2 style="color: #1e293b;">Hi ${fullName},</h2>
                    <p style="color: #64748b; line-height: 1.6;">
                        We have received your motor insurance quote request. Our experts are reviewing your requirements 
                        and will contact you within 2 hours with personalized quotes from top insurance companies.
                    </p>
                    
                    <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
                        <h3 style="color: #1e40af; margin-bottom: 15px;">Quote Details:</h3>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr><td style="padding: 8px 0; color: #64748b;"><strong>Quote ID:</strong></td><td style="padding: 8px 0;">MQ${savedQuote._id.toString().slice(-6).toUpperCase()}</td></tr>
                            <tr><td style="padding: 8px 0; color: #64748b;"><strong>Vehicle Type:</strong></td><td style="padding: 8px 0;">${vehicleType.charAt(0).toUpperCase() + vehicleType.slice(1)}</td></tr>
                            ${make ? `<tr><td style="padding: 8px 0; color: #64748b;"><strong>Make & Model:</strong></td><td style="padding: 8px 0;">${make} ${model || ''}</td></tr>` : ''}
                            <tr><td style="padding: 8px 0; color: #64748b;"><strong>Policy Type:</strong></td><td style="padding: 8px 0;">${policyType.charAt(0).toUpperCase() + policyType.slice(1)}</td></tr>
                            <tr><td style="padding: 8px 0; color: #64748b;"><strong>Estimated Premium:</strong></td><td style="padding: 8px 0; color: #1e40af; font-weight: bold;">₹${estimatedPremium.toLocaleString()}/year</td></tr>
                        </table>
                    </div>
                    
                    <div style="background: #e0f2fe; padding: 15px; border-radius: 8px; border-left: 4px solid #0284c7;">
                        <p style="margin: 0; color: #0c4a6e;">
                            <strong>What's Next?</strong><br>
                            • Our motor insurance expert will call you within 2 hours<br>
                            • You'll receive quotes from 3-5 top insurance companies<br>
                            • Choose the best plan that suits your needs and budget<br>
                            • Get instant policy issuance with digital documents
                        </p>
                    </div>
                    
                    <p style="color: #64748b; margin-top: 20px;">
                        For immediate assistance, please call us at <strong>+91 98765 43210</strong> or 
                        email us at <strong>motor@saspolicyvaluehub.com</strong>
                    </p>
                </div>
                
                <div style="background: #1e293b; color: #94a3b8; padding: 20px; text-align: center;">
                    <p style="margin: 0;">SAS Policy Value Hub Services | Your Trusted Insurance Partner</p>
                    <p style="margin: 5px 0 0 0; font-size: 14px;">123 Business Center, Insurance District, New Delhi, India 110001</p>
                </div>
            </div>
        `;

        await sendEmail(email, 'Motor Insurance Quote Request Received - SAS Policy Value Hub', customerEmailHtml);

        // Send notification email to admin
        const adminEmailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #1e40af;">New Motor Insurance Quote Request</h2>
                <div style="background: #f8fafc; padding: 20px; border-radius: 10px;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr><td style="padding: 8px 0; color: #64748b;"><strong>Quote ID:</strong></td><td style="padding: 8px 0;">MQ${savedQuote._id.toString().slice(-6).toUpperCase()}</td></tr>
                        <tr><td style="padding: 8px 0; color: #64748b;"><strong>Name:</strong></td><td style="padding: 8px 0;">${fullName}</td></tr>
                        <tr><td style="padding: 8px 0; color: #64748b;"><strong>Mobile:</strong></td><td style="padding: 8px 0;">${mobile}</td></tr>
                        <tr><td style="padding: 8px 0; color: #64748b;"><strong>Email:</strong></td><td style="padding: 8px 0;">${email}</td></tr>
                        <tr><td style="padding: 8px 0; color: #64748b;"><strong>City:</strong></td><td style="padding: 8px 0;">${city}</td></tr>
                        <tr><td style="padding: 8px 0; color: #64748b;"><strong>Vehicle Type:</strong></td><td style="padding: 8px 0;">${vehicleType}</td></tr>
                        ${registrationNumber ? `<tr><td style="padding: 8px 0; color: #64748b;"><strong>Registration:</strong></td><td style="padding: 8px 0;">${registrationNumber}</td></tr>` : ''}
                        ${make ? `<tr><td style="padding: 8px 0; color: #64748b;"><strong>Make & Model:</strong></td><td style="padding: 8px 0;">${make} ${model || ''}</td></tr>` : ''}
                        <tr><td style="padding: 8px 0; color: #64748b;"><strong>Manufacturing Year:</strong></td><td style="padding: 8px 0;">${manufacturingYear || 'Not specified'}</td></tr>
                        <tr><td style="padding: 8px 0; color: #64748b;"><strong>Fuel Type:</strong></td><td style="padding: 8px 0;">${fuelType || 'Not specified'}</td></tr>
                        <tr><td style="padding: 8px 0; color: #64748b;"><strong>Policy Type:</strong></td><td style="padding: 8px 0;">${policyType}</td></tr>
                        <tr><td style="padding: 8px 0; color: #64748b;"><strong>Estimated Premium:</strong></td><td style="padding: 8px 0; color: #1e40af; font-weight: bold;">₹${estimatedPremium.toLocaleString()}</td></tr>
                        ${additionalInfo ? `<tr><td style="padding: 8px 0; color: #64748b; vertical-align: top;"><strong>Additional Info:</strong></td><td style="padding: 8px 0;">${additionalInfo}</td></tr>` : ''}
                        <tr><td style="padding: 8px 0; color: #64748b;"><strong>Submitted:</strong></td><td style="padding: 8px 0;">${new Date().toLocaleString('en-IN')}</td></tr>
                    </table>
                </div>
                <p style="color: #dc2626; font-weight: bold;">Action Required: Contact customer within 2 hours</p>
            </div>
        `;

        await sendEmail(
            process.env.ADMIN_EMAIL || 'motor@saspolicyvaluehub.com',
            `New Motor Quote Request - ${fullName} (${vehicleType.toUpperCase()})`,
            adminEmailHtml
        );

        res.json({
            success: true,
            message: 'Motor insurance quote request submitted successfully',
            quoteId: `MQ${savedQuote._id.toString().slice(-6).toUpperCase()}`,
            estimatedPremium
        });

    } catch (error) {
        console.error('Motor quote request error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error. Please try again later.'
        });
    }
});

// Contact Message API
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, phone, subject, message, source } = req.body;

        // Input validation
        const errors = [];

        if (!name || name.trim().length < 2) {
            errors.push('Name is required and must be at least 2 characters');
        }

        if (!email || !validateInput.email(email)) {
            errors.push('Valid email address is required');
        }

        if (!subject || subject.trim().length < 2) {
            errors.push('Subject is required');
        }

        if (!message || message.trim().length < 10) {
            errors.push('Message is required and must be at least 10 characters');
        }

        if (phone && !validateInput.phone(phone)) {
            errors.push('Invalid phone number format');
        }

        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors
            });
        }

        // Create contact message
        const contactMessage = new ContactMessage({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            phone: phone?.trim(),
            subject: subject.trim(),
            message: message.trim(),
            source: source || 'motor-insurance-contact'
        });

        const savedMessage = await contactMessage.save();

        // Send confirmation email to customer
        const customerEmailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; padding: 30px; text-align: center;">
                    <h1>Message Received</h1>
                    <p>Thank you for contacting SAS Policy Value Hub Services</p>
                </div>
                
                <div style="padding: 30px; background: #f8fafc;">
                    <h2 style="color: #1e293b;">Hi ${name},</h2>
                    <p style="color: #64748b; line-height: 1.6;">
                        Thank you for reaching out to us. We have received your message and our motor insurance 
                        team will get back to you within 24 hours.
                    </p>
                    
                    <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
                        <h3 style="color: #1e40af; margin-bottom: 15px;">Your Message Details:</h3>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr><td style="padding: 8px 0; color: #64748b;"><strong>Message ID:</strong></td><td style="padding: 8px 0;">MC${savedMessage._id.toString().slice(-6).toUpperCase()}</td></tr>
                            <tr><td style="padding: 8px 0; color: #64748b;"><strong>Subject:</strong></td><td style="padding: 8px 0;">${subject}</td></tr>
                            <tr><td style="padding: 8px 0; color: #64748b; vertical-align: top;"><strong>Message:</strong></td><td style="padding: 8px 0;">${message}</td></tr>
                            <tr><td style="padding: 8px 0; color: #64748b;"><strong>Submitted:</strong></td><td style="padding: 8px 0;">${new Date().toLocaleString('en-IN')}</td></tr>
                        </table>
                    </div>
                    
                    <p style="color: #64748b;">
                        For urgent inquiries, please call us at <strong>+91 98765 43210</strong>
                    </p>
                </div>
                
                <div style="background: #1e293b; color: #94a3b8; padding: 20px; text-align: center;">
                    <p style="margin: 0;">SAS Policy Value Hub Services | Your Trusted Insurance Partner</p>
                </div>
            </div>
        `;

        await sendEmail(email, 'Your Message Has Been Received - SAS Policy Value Hub', customerEmailHtml);

        // Send notification to admin
        const adminEmailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #1e40af;">New Contact Message - Motor Insurance</h2>
                <div style="background: #f8fafc; padding: 20px; border-radius: 10px;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr><td style="padding: 8px 0; color: #64748b;"><strong>Message ID:</strong></td><td style="padding: 8px 0;">MC${savedMessage._id.toString().slice(-6).toUpperCase()}</td></tr>
                        <tr><td style="padding: 8px 0; color: #64748b;"><strong>Name:</strong></td><td style="padding: 8px 0;">${name}</td></tr>
                        <tr><td style="padding: 8px 0; color: #64748b;"><strong>Email:</strong></td><td style="padding: 8px 0;">${email}</td></tr>
                        ${phone ? `<tr><td style="padding: 8px 0; color: #64748b;"><strong>Phone:</strong></td><td style="padding: 8px 0;">${phone}</td></tr>` : ''}
                        <tr><td style="padding: 8px 0; color: #64748b;"><strong>Subject:</strong></td><td style="padding: 8px 0;">${subject}</td></tr>
                        <tr><td style="padding: 8px 0; color: #64748b; vertical-align: top;"><strong>Message:</strong></td><td style="padding: 8px 0;">${message}</td></tr>
                        <tr><td style="padding: 8px 0; color: #64748b;"><strong>Source:</strong></td><td style="padding: 8px 0;">${source}</td></tr>
                        <tr><td style="padding: 8px 0; color: #64748b;"><strong>Received:</strong></td><td style="padding: 8px 0;">${new Date().toLocaleString('en-IN')}</td></tr>
                    </table>
                </div>
            </div>
        `;

        await sendEmail(
            process.env.ADMIN_EMAIL || 'motor@saspolicyvaluehub.com',
            `New Contact Message: ${subject} - ${name}`,
            adminEmailHtml
        );

        res.json({
            success: true,
            message: 'Contact message sent successfully',
            messageId: `MC${savedMessage._id.toString().slice(-6).toUpperCase()}`
        });

    } catch (error) {
        console.error('Contact message error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error. Please try again later.'
        });
    }
});

// Get quote status (for customers to check their quote status)
app.get('/api/quote-status/:quoteId', async (req, res) => {
    try {
        const { quoteId } = req.params;
        
        // Extract MongoDB ObjectId from quote ID
        const objectId = quoteId.replace(/^MQ/, '');
        
        const quote = await QuoteRequest.findById(objectId).select('-_id -__v');
        
        if (!quote) {
            return res.status(404).json({
                success: false,
                message: 'Quote not found'
            });
        }

        res.json({
            success: true,
            quote: {
                quoteId: `MQ${quote._id.toString().slice(-6).toUpperCase()}`,
                status: quote.status,
                vehicleType: quote.vehicleType,
                policyType: quote.policyType,
                estimatedPremium: quote.estimatedPremium,
                createdAt: quote.createdAt
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

// Admin routes (basic implementation)
app.get('/api/admin/quotes', async (req, res) => {
    try {
        const { page = 1, limit = 10, status, vehicleType } = req.query;
        
        const filter = {};
        if (status) filter.status = status;
        if (vehicleType) filter.vehicleType = vehicleType;

        const quotes = await QuoteRequest.find(filter)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .select('-__v');

        const total = await QuoteRequest.countDocuments(filter);

        res.json({
            success: true,
            quotes: quotes.map(quote => ({
                ...quote.toObject(),
                quoteId: `MQ${quote._id.toString().slice(-6).toUpperCase()}`
            })),
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

// Update quote status
app.patch('/api/admin/quotes/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['pending', 'contacted', 'quoted', 'converted', 'rejected'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status'
            });
        }

        const quote = await QuoteRequest.findByIdAndUpdate(
            id,
            { status, updatedAt: new Date() },
            { new: true }
        );

        if (!quote) {
            return res.status(404).json({
                success: false,
                message: 'Quote not found'
            });
        }

        res.json({
            success: true,
            message: 'Quote status updated successfully',
            quote
        });

    } catch (error) {
        console.error('Update quote status error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Analytics endpoint
app.get('/api/analytics/dashboard', async (req, res) => {
    try {
        const today = new Date();
        const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

        const [
            totalQuotes,
            weeklyQuotes,
            monthlyQuotes,
            conversionRate,
            vehicleTypeBreakdown,
            policyTypeBreakdown
        ] = await Promise.all([
            QuoteRequest.countDocuments(),
            QuoteRequest.countDocuments({ createdAt: { $gte: lastWeek } }),
            QuoteRequest.countDocuments({ createdAt: { $gte: lastMonth } }),
            QuoteRequest.aggregate([
                {
                    $group: {
                        _id: '$status',
                        count: { $sum: 1 }
                    }
                }
            ]),
            QuoteRequest.aggregate([
                {
                    $group: {
                        _id: '$vehicleType',
                        count: { $sum: 1 },
                        avgPremium: { $avg: '$estimatedPremium' }
                    }
                }
            ]),
            QuoteRequest.aggregate([
                {
                    $group: {
                        _id: '$policyType',
                        count: { $sum: 1 }
                    }
                }
            ])
        ]);

        res.json({
            success: true,
            analytics: {
                totalQuotes,
                weeklyQuotes,
                monthlyQuotes,
                conversionRate,
                vehicleTypeBreakdown,
                policyTypeBreakdown
            }
        });

    } catch (error) {
        console.error('Analytics error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Motor Insurance API server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;