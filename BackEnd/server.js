// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const validator = require('validator');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: 'Too many submissions from this IP, please try again later.'
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sas_policy_hub', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB successfully');
}).catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});

// Contact Message Schema
const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        validate: [validator.isEmail, 'Invalid email address']
    },
    phone: {
        type: String,
        trim: true,
        validate: {
            validator: function(v) {
                return !v || /^[\d\s\-\+\(\)]+$/.test(v);
            },
            message: 'Invalid phone number format'
        }
    },
    subject: {
        type: String,
        required: true,
        enum: ['general', 'quote', 'claim', 'policy', 'complaint'],
        default: 'general'
    },
    message: {
        type: String,
        required: true,
        trim: true,
        maxlength: 2000
    },
    status: {
        type: String,
        enum: ['pending', 'read', 'responded', 'archived'],
        default: 'pending'
    },
    ipAddress: String,
    userAgent: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    respondedAt: Date,
    notes: String
});

// Quote Request Schema
const quoteSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        validate: [validator.isEmail, 'Invalid email address']
    },
    phone: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: function(v) {
                return /^[\d\s\-\+\(\)]{10,}$/.test(v);
            },
            message: 'Invalid phone number'
        }
    },
    insuranceType: {
        type: String,
        required: true,
        enum: ['health', 'life', 'motor', 'multiple']
    },
    age: {
        type: Number,
        required: true,
        min: 18,
        max: 100
    },
    requirements: {
        type: String,
        trim: true,
        maxlength: 1000
    },
    status: {
        type: String,
        enum: ['pending', 'contacted', 'quoted', 'converted', 'archived'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    contactedAt: Date,
    quotedAmount: Number,
    notes: String
});

const Contact = mongoose.model('Contact', contactSchema);
const Quote = mongoose.model('Quote', quoteSchema);

// Email configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Helper function to send notification email
async function sendNotificationEmail(type, data) {
    try {
        let subject, html;
        
        if (type === 'contact') {
            subject = `New Contact Form Submission - ${data.subject}`;
            html = `
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${data.name}</p>
                <p><strong>Email:</strong> ${data.email}</p>
                <p><strong>Phone:</strong> ${data.phone || 'Not provided'}</p>
                <p><strong>Subject:</strong> ${data.subject}</p>
                <p><strong>Message:</strong></p>
                <p>${data.message}</p>
                <hr>
                <p><small>Submitted at: ${new Date().toLocaleString()}</small></p>
            `;
        } else if (type === 'quote') {
            subject = `New Quote Request - ${data.insuranceType}`;
            html = `
                <h2>New Quote Request</h2>
                <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
                <p><strong>Email:</strong> ${data.email}</p>
                <p><strong>Phone:</strong> ${data.phone}</p>
                <p><strong>Insurance Type:</strong> ${data.insuranceType}</p>
                <p><strong>Age:</strong> ${data.age}</p>
                <p><strong>Additional Requirements:</strong></p>
                <p>${data.requirements || 'None specified'}</p>
                <hr>
                <p><small>Submitted at: ${new Date().toLocaleString()}</small></p>
            `;
        }
        
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.NOTIFICATION_EMAIL || 'mannguptagx@gmail.com',
            subject: subject,
            html: html
        };
        
        await transporter.sendMail(mailOptions);
        console.log('Notification email sent successfully');
        
        // Send confirmation email to user
        const userMailOptions = {
            from: process.env.EMAIL_USER,
            to: data.email,
            subject: 'Thank you for contacting SAS Policy Value Hub',
            html: `
                <h2>Thank you for reaching out!</h2>
                <p>Dear ${data.name || data.firstName},</p>
                <p>We have received your ${type === 'contact' ? 'message' : 'quote request'} and will get back to you within 24 hours.</p>
                <p>If you have any urgent queries, please feel free to call us at +91 98765 43210.</p>
                <br>
                <p>Best regards,<br>SAS Policy Value Hub Services Team</p>
            `
        };
        
        await transporter.sendMail(userMailOptions);
        
    } catch (error) {
        console.error('Error sending email:', error);
        // Don't throw error to prevent API failure
    }
}

// API Routes

// Contact form submission
app.post('/api/contact', limiter, async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;
        
        // Validate required fields
        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                success: false,
                message: 'Please fill in all required fields'
            });
        }
        
        // Create contact document
        const contact = new Contact({
            name: validator.escape(name),
            email,
            phone: phone ? validator.escape(phone) : '',
            subject,
            message: validator.escape(message),
            ipAddress: req.ip,
            userAgent: req.get('user-agent')
        });
        
        // Save to database
        await contact.save();
        
        // Send notification email
        await sendNotificationEmail('contact', contact);
        
        res.status(201).json({
            success: true,
            message: 'Your message has been sent successfully',
            messageId: contact._id
        });
        
    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred. Please try again later.'
        });
    }
});

// Quote request submission
app.post('/api/quote', limiter, async (req, res) => {
    try {
        const { firstName, lastName, email, phone, insuranceType, age, requirements } = req.body;
        
        // Validate required fields
        if (!firstName || !lastName || !email || !phone || !insuranceType || !age) {
            return res.status(400).json({
                success: false,
                message: 'Please fill in all required fields'
            });
        }
        
        // Create quote document
        const quote = new Quote({
            firstName: validator.escape(firstName),
            lastName: validator.escape(lastName),
            email,
            phone: validator.escape(phone),
            insuranceType,
            age: parseInt(age),
            requirements: requirements ? validator.escape(requirements) : ''
        });
        
        // Save to database
        await quote.save();
        
        // Send notification email
        await sendNotificationEmail('quote', quote);
        
        res.status(201).json({
            success: true,
            message: 'Your quote request has been submitted successfully',
            quoteId: quote._id
        });
        
    } catch (error) {
        console.error('Quote request error:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred. Please try again later.'
        });
    }
});

// Get all contacts (protected route - add authentication in production)
app.get('/api/admin/contacts', async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.json({ success: true, contacts });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching contacts' });
    }
});

// Get all quotes (protected route - add authentication in production)
app.get('/api/admin/quotes', async (req, res) => {
    try {
        const quotes = await Quote.find().sort({ createdAt: -1 });
        res.json({ success: true, quotes });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching quotes' });
    }
});

// Update contact status
app.patch('/api/admin/contacts/:id', async (req, res) => {
    try {
        const { status, notes } = req.body;
        const contact = await Contact.findByIdAndUpdate(
            req.params.id,
            { 
                status, 
                notes,
                ...(status === 'responded' && { respondedAt: new Date() })
            },
            { new: true }
        );
        res.json({ success: true, contact });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating contact' });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        success: true, 
        message: 'Server is running',
        database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});