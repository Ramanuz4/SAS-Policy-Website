const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
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
app.use(limiter);

// Specific rate limiting for quote requests
const quoteLimit = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // limit each IP to 5 quote requests per hour
    message: 'Too many quote requests. Please try again after an hour.'
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sas_insurance', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Database schemas
const QuoteRequestSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    insuranceType: { type: String, required: true },
    preferredPartner: { type: String },
    age: { type: Number },
    requirements: { type: String },
    status: { type: String, default: 'pending' },
    assignedAgent: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const ContactMessageSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, default: 'unread' },
    createdAt: { type: Date, default: Date.now }
});

const PartnerSchema = new mongoose.Schema({
    partnerId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    type: { type: String, required: true },
    description: { type: String, required: true },
    products: [{ type: String }],
    keyFeatures: [{ type: String }],
    stats: {
        experience: String,
        customers: String,
        claimSettlement: String,
        networkHospitals: String,
        branches: String
    },
    established: { type: Number },
    specialty: { type: String },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const AdminUserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'agent'], default: 'agent' },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

// Create models
const QuoteRequest = mongoose.model('QuoteRequest', QuoteRequestSchema);
const ContactMessage = mongoose.model('ContactMessage', ContactMessageSchema);
const Partner = mongoose.model('Partner', PartnerSchema);
const AdminUser = mongoose.model('AdminUser', AdminUserSchema);

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
const sendEmail = async (to, subject, html) => {
    try {
        const mailOptions = {
            from: process.env.SMTP_FROM || 'noreply@saspolicyvaluehub.com',
            to,
            subject,
            html
        };
        
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Email sending failed:', error);
        return false;
    }
};

const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

const validatePhone = (phone) => {
    const re = /^[+]?[\d\s\-\(\)]{10,}$/;
    return re.test(phone);
};

// Middleware for authentication
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
};

// Routes

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        service: 'SAS Policy Value Hub API'
    });
});

// Quote request endpoint
app.post('/api/quote-request', quoteLimit, async (req, res) => {
    try {
        const { name, email, phone, insuranceType, preferredPartner, age, requirements } = req.body;

        // Validation
        if (!name || !email || !phone || !insuranceType) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        if (!validateEmail(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        if (!validatePhone(phone)) {
            return res.status(400).json({ error: 'Invalid phone number format' });
        }

        // Create quote request
        const quoteRequest = new QuoteRequest({
            name,
            email,
            phone,
            insuranceType,
            preferredPartner: preferredPartner || null,
            age: age || null,
            requirements: requirements || null
        });

        await quoteRequest.save();

        // Send confirmation email to customer
        const customerEmailHTML = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #1e40af, #3b82f6); color: white; padding: 30px; text-align: center;">
                    <h1>Quote Request Received</h1>
                    <p>Thank you for choosing SAS Policy Value Hub Services</p>
                </div>
                <div style="padding: 30px; background: #f8fafc;">
                    <h2 style="color: #1e293b;">Hello ${name},</h2>
                    <p style="color: #64748b; line-height: 1.6;">
                        We have received your quote request for <strong>${insuranceType}</strong> insurance.
                        Our expert team will review your requirements and contact you within 24 hours with personalized quotes from our trusted partners.
                    </p>
                    <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
                        <h3 style="color: #1e293b; margin-bottom: 15px;">Your Request Details:</h3>
                        <p><strong>Insurance Type:</strong> ${insuranceType}</p>
                        ${preferredPartner ? `<p><strong>Preferred Partner:</strong> ${preferredPartner}</p>` : ''}
                        ${age ? `<p><strong>Age:</strong> ${age}</p>` : ''}
                        <p><strong>Contact:</strong> ${email} | ${phone}</p>
                    </div>
                    <p style="color: #64748b;">
                        If you have any immediate questions, please don't hesitate to contact us at 
                        <a href="tel:+919876543210">+91 98765 43210</a> or 
                        <a href="mailto:info@saspolicyvaluehub.com">info@saspolicyvaluehub.com</a>
                    </p>
                </div>
                <div style="background: #1e293b; color: white; padding: 20px; text-align: center;">
                    <p>SAS Policy Value Hub Services - Your Security, Our Commitment</p>
                </div>
            </div>
        `;

        // Send notification email to admin
        const adminEmailHTML = `
            <div style="font-family: Arial, sans-serif;">
                <h2>New Quote Request Received</h2>
                <div style="background: #f8fafc; padding: 20px; border-radius: 10px;">
                    <h3>Customer Details:</h3>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Phone:</strong> ${phone}</p>
                    <p><strong>Insurance Type:</strong> ${insuranceType}</p>
                    ${preferredPartner ? `<p><strong>Preferred Partner:</strong> ${preferredPartner}</p>` : ''}
                    ${age ? `<p><strong>Age:</strong> ${age}</p>` : ''}
                    ${requirements ? `<p><strong>Requirements:</strong> ${requirements}</p>` : ''}
                    <p><strong>Request ID:</strong> ${quoteRequest._id}</p>
                    <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
                </div>
            </div>
        `;

        // Send emails
        await sendEmail(email, 'Quote Request Confirmation - SAS Policy Value Hub', customerEmailHTML);
        await sendEmail(process.env.ADMIN_EMAIL || 'admin@saspolicyvaluehub.com', 'New Quote Request', adminEmailHTML);

        res.json({ 
            success: true, 
            message: 'Quote request submitted successfully',
            requestId: quoteRequest._id
        });

    } catch (error) {
        console.error('Quote request error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Contact message endpoint
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;

        // Validation
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        if (!validateEmail(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        // Create contact message
        const contactMessage = new ContactMessage({
            name,
            email,
            phone: phone || null,
            subject,
            message
        });

        await contactMessage.save();

        // Send confirmation email
        const confirmationHTML = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #1e40af, #3b82f6); color: white; padding: 30px; text-align: center;">
                    <h1>Message Received</h1>
                    <p>Thank you for contacting SAS Policy Value Hub Services</p>
                </div>
                <div style="padding: 30px; background: #f8fafc;">
                    <h2 style="color: #1e293b;">Hello ${name},</h2>
                    <p style="color: #64748b;">
                        We have received your message and will respond within 24 hours.
                    </p>
                    <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
                        <h3 style="color: #1e293b;">Your Message:</h3>
                        <p><strong>Subject:</strong> ${subject}</p>
                        <p><strong>Message:</strong> ${message}</p>
                    </div>
                </div>
            </div>
        `;

        await sendEmail(email, 'Message Confirmation - SAS Policy Value Hub', confirmationHTML);

        res.json({ 
            success: true, 
            message: 'Contact message sent successfully',
            messageId: contactMessage._id
        });

    } catch (error) {
        console.error('Contact message error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get partners endpoint
app.get('/api/partners', async (req, res) => {
    try {
        const partners = await Partner.find({ isActive: true }).select('-__v');
        res.json({ success: true, partners });
    } catch (error) {
        console.error('Partners fetch error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get specific partner endpoint
app.get('/api/partners/:partnerId', async (req, res) => {
    try {
        const partner = await Partner.findOne({ 
            partnerId: req.params.partnerId, 
            isActive: true 
        }).select('-__v');
        
        if (!partner) {
            return res.status(404).json({ error: 'Partner not found' });
        }

        res.json({ success: true, partner });
    } catch (error) {
        console.error('Partner fetch error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Admin login endpoint
app.post('/api/admin/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password required' });
        }

        const user = await AdminUser.findOne({ username, isActive: true });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user._id, username: user.username, role: user.role },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Protected admin routes
app.get('/api/admin/quote-requests', authenticateToken, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const quoteRequests = await QuoteRequest.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await QuoteRequest.countDocuments();

        res.json({
            success: true,
            quoteRequests,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error('Quote requests fetch error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/admin/contact-messages', authenticateToken, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const messages = await ContactMessage.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await ContactMessage.countDocuments();

        res.json({
            success: true,
            messages,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error('Messages fetch error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update quote request status
app.patch('/api/admin/quote-requests/:id', authenticateToken, async (req, res) => {
    try {
        const { status, assignedAgent } = req.body;
        
        const quoteRequest = await QuoteRequest.findByIdAndUpdate(
            req.params.id,
            { 
                status: status || undefined,
                assignedAgent: assignedAgent || undefined,
                updatedAt: new Date()
            },
            { new: true }
        );

        if (!quoteRequest) {
            return res.status(404).json({ error: 'Quote request not found' });
        }

        res.json({ success: true, quoteRequest });

    } catch (error) {
        console.error('Quote request update error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Analytics endpoint
app.get('/api/admin/analytics', authenticateToken, async (req, res) => {
    try {
        const totalQuotes = await QuoteRequest.countDocuments();
        const totalMessages = await ContactMessage.countDocuments();
        const pendingQuotes = await QuoteRequest.countDocuments({ status: 'pending' });
        const completedQuotes = await QuoteRequest.countDocuments({ status: 'completed' });

        // Get quotes by insurance type
        const quotesByType = await QuoteRequest.aggregate([
            { $group: { _id: '$insuranceType', count: { $sum: 1 } } }
        ]);

        // Get quotes by preferred partner
        const quotesByPartner = await QuoteRequest.aggregate([
            { $match: { preferredPartner: { $ne: null } } },
            { $group: { _id: '$preferredPartner', count: { $sum: 1 } } }
        ]);

        res.json({
            success: true,
            analytics: {
                totalQuotes,
                totalMessages,
                pendingQuotes,
                completedQuotes,
                quotesByType,
                quotesByPartner
            }
        });

    } catch (error) {
        console.error('Analytics error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Initialize default admin user
const initializeAdmin = async () => {
    try {
        const adminExists = await AdminUser.findOne({ role: 'admin' });
        if (!adminExists) {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            const admin = new AdminUser({
                username: 'admin',
                email: 'admin@saspolicyvaluehub.com',
                password: hashedPassword,
                role: 'admin'
            });
            await admin.save();
            console.log('Default admin user created: username: admin, password: admin123');
        }
    } catch (error) {
        console.error('Admin initialization error:', error);
    }
};

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    await initializeAdmin();
    console.log('Database connected and initialized');
});

module.exports = app;