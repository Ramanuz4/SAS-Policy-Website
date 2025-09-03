const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const validator = require('validator');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Specific rate limit for quote submissions
const quoteLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // limit each IP to 5 quote requests per hour
    message: 'Too many quote requests from this IP, please try again later.'
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sas-insurance', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

// Email transporter setup
const transporter = nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// Mongoose Schemas
const QuoteRequestSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        validate: [validator.isEmail, 'Invalid email address']
    },
    phone: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /^\+?[\d\s\-\(\)]{10,15}$/.test(v);
            },
            message: 'Invalid phone number'
        }
    },
    age: {
        type: Number,
        required: true,
        min: 18,
        max: 100
    },
    serviceType: {
        type: String,
        required: true,
        enum: ['health', 'life', 'motor', 'travel', 'home', 'business', 'personal', 'general']
    },
    requirements: {
        type: String,
        maxLength: 1000
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'cancelled'],
        default: 'pending'
    },
    ipAddress: String,
    userAgent: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const ContactMessageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxLength: 100
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        validate: [validator.isEmail, 'Invalid email address']
    },
    phone: {
        type: String,
        validate: {
            validator: function(v) {
                return !v || /^\+?[\d\s\-\(\)]{10,15}$/.test(v);
            },
            message: 'Invalid phone number'
        }
    },
    subject: {
        type: String,
        required: true,
        enum: ['general', 'quote', 'claim', 'policy', 'complaint']
    },
    message: {
        type: String,
        required: true,
        maxLength: 2000
    },
    status: {
        type: String,
        enum: ['new', 'read', 'replied', 'closed'],
        default: 'new'
    },
    ipAddress: String,
    userAgent: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Admin User Schema
const AdminUserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minLength: 3,
        maxLength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Invalid email address']
    },
    password: {
        type: String,
        required: true,
        minLength: 8
    },
    role: {
        type: String,
        enum: ['admin', 'manager', 'agent'],
        default: 'agent'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Hash password before saving
AdminUserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Models
const QuoteRequest = mongoose.model('QuoteRequest', QuoteRequestSchema);
const ContactMessage = mongoose.model('ContactMessage', ContactMessageSchema);
const AdminUser = mongoose.model('AdminUser', AdminUserSchema);

// Middleware for authentication
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access token required' });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
};

// Input validation middleware
const validateQuoteRequest = (req, res, next) => {
    const { firstName, lastName, email, phone, age, serviceType } = req.body;
    
    const errors = [];
    
    if (!firstName || firstName.trim().length < 2) {
        errors.push('First name is required and must be at least 2 characters');
    }
    
    if (!lastName || lastName.trim().length < 2) {
        errors.push('Last name is required and must be at least 2 characters');
    }
    
    if (!email || !validator.isEmail(email)) {
        errors.push('Valid email address is required');
    }
    
    if (!phone || !/^\+?[\d\s\-\(\)]{10,15}$/.test(phone)) {
        errors.push('Valid phone number is required');
    }
    
    if (!age || age < 18 || age > 100) {
        errors.push('Age must be between 18 and 100');
    }
    
    const validServiceTypes = ['health', 'life', 'motor', 'travel', 'home', 'business', 'personal', 'general'];
    if (!serviceType || !validServiceTypes.includes(serviceType)) {
        errors.push('Valid service type is required');
    }
    
    if (errors.length > 0) {
        return res.status(400).json({ success: false, errors });
    }
    
    next();
};

// API Routes

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Quote request submission
app.post('/api/quote', quoteLimiter, validateQuoteRequest, async (req, res) => {
    try {
        const { firstName, lastName, email, phone, age, serviceType, requirements } = req.body;
        
        // Check for duplicate recent submissions
        const recentSubmission = await QuoteRequest.findOne({
            email: email.toLowerCase(),
            createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // 24 hours ago
        });
        
        if (recentSubmission) {
            return res.status(429).json({
                success: false,
                message: 'You have already submitted a quote request in the last 24 hours'
            });
        }
        
        // Create new quote request
        const quoteRequest = new QuoteRequest({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.toLowerCase().trim(),
            phone: phone.trim(),
            age: parseInt(age),
            serviceType,
            requirements: requirements ? requirements.trim() : '',
            ipAddress: req.ip,
            userAgent: req.get('User-Agent')
        });
        
        await quoteRequest.save();
        
        // Send confirmation email to customer
        const customerEmailTemplate = `
            <h2>Thank you for your quote request!</h2>
            <p>Dear ${firstName} ${lastName},</p>
            <p>We have received your quote request for <strong>${serviceType} insurance</strong>.</p>
            <p><strong>Request Details:</strong></p>
            <ul>
                <li>Service Type: ${serviceType}</li>
                <li>Age: ${age}</li>
                <li>Phone: ${phone}</li>
                ${requirements ? `<li>Requirements: ${requirements}</li>` : ''}
            </ul>
            <p>Our expert team will review your request and contact you within 24 hours with a personalized quote.</p>
            <p>Reference ID: <strong>QT${quoteRequest._id.toString().slice(-8).toUpperCase()}</strong></p>
            <p>Best regards,<br>SAS Policy Value Hub Services Team</p>
        `;
        
        // Send notification email to admin
        const adminEmailTemplate = `
            <h2>New Quote Request Received</h2>
            <p><strong>Customer Details:</strong></p>
            <ul>
                <li>Name: ${firstName} ${lastName}</li>
                <li>Email: ${email}</li>
                <li>Phone: ${phone}</li>
                <li>Age: ${age}</li>
                <li>Service Type: ${serviceType}</li>
                ${requirements ? `<li>Requirements: ${requirements}</li>` : ''}
            </ul>
            <p>Request ID: QT${quoteRequest._id.toString().slice(-8).toUpperCase()}</p>
            <p>Submitted on: ${new Date().toLocaleString('en-IN')}</p>
        `;
        
        // Send emails
        try {
            await Promise.all([
                transporter.sendMail({
                    from: process.env.SMTP_USER,
                    to: email,
                    subject: 'Quote Request Confirmation - SAS Policy Value Hub',
                    html: customerEmailTemplate
                }),
                transporter.sendMail({
                    from: process.env.SMTP_USER,
                    to: process.env.ADMIN_EMAIL || 'admin@saspolicyvaluehub.com',
                    subject: `New Quote Request - ${serviceType} Insurance`,
                    html: adminEmailTemplate
                })
            ]);
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
            // Continue without throwing error as quote is already saved
        }
        
        res.status(201).json({
            success: true,
            message: 'Quote request submitted successfully',
            quoteId: `QT${quoteRequest._id.toString().slice(-8).toUpperCase()}`
        });
        
    } catch (error) {
        console.error('Quote request error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error. Please try again later.'
        });
    }
});

// Contact form submission
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;
        
        // Validation
        const errors = [];
        
        if (!name || name.trim().length < 2) {
            errors.push('Name is required and must be at least 2 characters');
        }
        
        if (!email || !validator.isEmail(email)) {
            errors.push('Valid email address is required');
        }
        
        if (phone && !/^\+?[\d\s\-\(\)]{10,15}$/.test(phone)) {
            errors.push('Invalid phone number format');
        }
        
        if (!subject || !['general', 'quote', 'claim', 'policy', 'complaint'].includes(subject)) {
            errors.push('Valid subject is required');
        }
        
        if (!message || message.trim().length < 10) {
            errors.push('Message is required and must be at least 10 characters');
        }
        
        if (errors.length > 0) {
            return res.status(400).json({ success: false, errors });
        }
        
        // Create contact message
        const contactMessage = new ContactMessage({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            phone: phone ? phone.trim() : undefined,
            subject,
            message: message.trim(),
            ipAddress: req.ip,
            userAgent: req.get('User-Agent')
        });
        
        await contactMessage.save();
        
        // Send confirmation email
        const confirmationTemplate = `
            <h2>Message Received</h2>
            <p>Dear ${name},</p>
            <p>Thank you for contacting SAS Policy Value Hub Services. We have received your message and will respond within 24 hours.</p>
            <p><strong>Your Message:</strong></p>
            <p>${message}</p>
            <p>Reference ID: <strong>MSG${contactMessage._id.toString().slice(-8).toUpperCase()}</strong></p>
            <p>Best regards,<br>Customer Service Team</p>
        `;
        
        try {
            await transporter.sendMail({
                from: process.env.SMTP_USER,
                to: email,
                subject: 'Message Received - SAS Policy Value Hub',
                html: confirmationTemplate
            });
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
        }
        
        res.status(201).json({
            success: true,
            message: 'Message sent successfully',
            messageId: `MSG${contactMessage._id.toString().slice(-8).toUpperCase()}`
        });
        
    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error. Please try again later.'
        });
    }
});

// Admin login
app.post('/api/admin/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ success: false, message: 'Username and password are required' });
        }
        
        // Find admin user
        const admin = await AdminUser.findOne({ username: username.toLowerCase() });
        
        if (!admin || !admin.isActive) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        
        // Check password
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        
        // Update last login
        admin.lastLogin = new Date();
        await admin.save();
        
        // Generate JWT token
        const token = jwt.sign(
            { id: admin._id, username: admin.username, role: admin.role },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );
        
        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: admin._id,
                username: admin.username,
                email: admin.email,
                role: admin.role
            }
        });
        
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Get quote requests (Admin only)
app.get('/api/admin/quotes', authenticateToken, async (req, res) => {
    try {
        const { page = 1, limit = 20, status, serviceType, search } = req.query;
        
        const filter = {};
        
        if (status && ['pending', 'processing', 'completed', 'cancelled'].includes(status)) {
            filter.status = status;
        }
        
        if (serviceType && ['health', 'life', 'motor', 'travel', 'home', 'business', 'personal'].includes(serviceType)) {
            filter.serviceType = serviceType;
        }
        
        if (search) {
            filter.$or = [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } }
            ];
        }
        
        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        const [quotes, total] = await Promise.all([
            QuoteRequest.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit))
                .select('-ipAddress -userAgent'),
            QuoteRequest.countDocuments(filter)
        ]);
        
        res.json({
            success: true,
            data: quotes,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / parseInt(limit)),
                totalItems: total,
                hasNext: skip + quotes.length < total,
                hasPrev: parseInt(page) > 1
            }
        });
        
    } catch (error) {
        console.error('Get quotes error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Update quote status (Admin only)
app.put('/api/admin/quotes/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { status, notes } = req.body;
        
        if (!['pending', 'processing', 'completed', 'cancelled'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }
        
        const quote = await QuoteRequest.findByIdAndUpdate(
            id,
            { 
                status,
                updatedAt: new Date(),
                ...(notes && { notes })
            },
            { new: true }
        );
        
        if (!quote) {
            return res.status(404).json({ success: false, message: 'Quote not found' });
        }
        
        res.json({ success: true, data: quote });
        
    } catch (error) {
        console.error('Update quote error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Get contact messages (Admin only)
app.get('/api/admin/messages', authenticateToken, async (req, res) => {
    try {
        const { page = 1, limit = 20, status, subject, search } = req.query;
        
        const filter = {};
        
        if (status && ['new', 'read', 'replied', 'closed'].includes(status)) {
            filter.status = status;
        }
        
        if (subject && ['general', 'quote', 'claim', 'policy', 'complaint'].includes(subject)) {
            filter.subject = subject;
        }
        
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { message: { $regex: search, $options: 'i' } }
            ];
        }
        
        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        const [messages, total] = await Promise.all([
            ContactMessage.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit))
                .select('-ipAddress -userAgent'),
            ContactMessage.countDocuments(filter)
        ]);
        
        res.json({
            success: true,
            data: messages,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / parseInt(limit)),
                totalItems: total,
                hasNext: skip + messages.length < total,
                hasPrev: parseInt(page) > 1
            }
        });
        
    } catch (error) {
        console.error('Get messages error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Dashboard statistics (Admin only)
app.get('/api/admin/dashboard', authenticateToken, async (req, res) => {
    try {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        
        const [
            totalQuotes,
            todayQuotes,
            thisMonthQuotes,
            pendingQuotes,
            totalMessages,
            newMessages,
            serviceTypeStats,
            monthlyStats
        ] = await Promise.all([
            QuoteRequest.countDocuments(),
            QuoteRequest.countDocuments({ createdAt: { $gte: today } }),
            QuoteRequest.countDocuments({ createdAt: { $gte: thisMonth } }),
            QuoteRequest.countDocuments({ status: 'pending' }),
            ContactMessage.countDocuments(),
            ContactMessage.countDocuments({ status: 'new' }),
            QuoteRequest.aggregate([
                { $group: { _id: '$serviceType', count: { $sum: 1 } } },
                { $sort: { count: -1 } }
            ]),
            QuoteRequest.aggregate([
                {
                    $group: {
                        _id: {
                            year: { $year: '$createdAt' },
                            month: { $month: '$createdAt' }
                        },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { '_id.year': -1, '_id.month': -1 } },
                { $limit: 12 }
            ])
        ]);
        
        res.json({
            success: true,
            data: {
                overview: {
                    totalQuotes,
                    todayQuotes,
                    thisMonthQuotes,
                    pendingQuotes,
                    totalMessages,
                    newMessages
                },
                serviceTypeStats,
                monthlyStats: monthlyStats.reverse()
            }
        });
        
    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Export data (Admin only)
app.get('/api/admin/export/:type', authenticateToken, async (req, res) => {
    try {
        const { type } = req.params;
        const { startDate, endDate, format = 'json' } = req.query;
        
        let data;
        let filename;
        
        const dateFilter = {};
        if (startDate) dateFilter.$gte = new Date(startDate);
        if (endDate) dateFilter.$lte = new Date(endDate);
        
        const filter = Object.keys(dateFilter).length > 0 ? { createdAt: dateFilter } : {};
        
        switch (type) {
            case 'quotes':
                data = await QuoteRequest.find(filter).select('-ipAddress -userAgent').sort({ createdAt: -1 });
                filename = `quotes_export_${new Date().toISOString().split('T')[0]}`;
                break;
            case 'messages':
                data = await ContactMessage.find(filter).select('-ipAddress -userAgent').sort({ createdAt: -1 });
                filename = `messages_export_${new Date().toISOString().split('T')[0]}`;
                break;
            default:
                return res.status(400).json({ success: false, message: 'Invalid export type' });
        }
        
        if (format === 'csv') {
            const csv = convertToCSV(data);
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', `attachment; filename="${filename}.csv"`);
            return res.send(csv);
        }
        
        res.json({ success: true, data, filename });
        
    } catch (error) {
        console.error('Export error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Utility function to convert JSON to CSV
function convertToCSV(data) {
    if (data.length === 0) return '';
    
    const keys = Object.keys(data[0].toObject ? data[0].toObject() : data[0]);
    const csvHeader = keys.join(',');
    
    const csvRows = data.map(item => {
        const obj = item.toObject ? item.toObject() : item;
        return keys.map(key => {
            let value = obj[key];
            if (value === null || value === undefined) value = '';
            if (typeof value === 'string') value = `"${value.replace(/"/g, '""')}"`;
            return value;
        }).join(',');
    });
    
    return [csvHeader, ...csvRows].join('\n');
}

// Create default admin user if none exists
async function createDefaultAdmin() {
    try {
        const adminCount = await AdminUser.countDocuments();
        if (adminCount === 0) {
            const defaultAdmin = new AdminUser({
                username: 'admin',
                email: 'admin@saspolicyvaluehub.com',
                password: 'admin123', // This will be hashed by the pre-save middleware
                role: 'admin'
            });
            await defaultAdmin.save();
            console.log('Default admin user created: admin/admin123');
        }
    } catch (error) {
        console.error('Error creating default admin:', error);
    }
}

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { error: error.message })
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('Shutting down gracefully...');
    await mongoose.connection.close();
    process.exit(0);
});

// Start server
app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    await createDefaultAdmin();
});

module.exports = app;
        