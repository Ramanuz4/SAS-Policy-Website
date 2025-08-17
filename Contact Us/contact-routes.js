const express = require('express');
const { body, validationResult } = require('express-validator');
const Contact = require('../models/Contact');
const { sendContactConfirmationEmail, sendContactNotificationEmail } = require('../utils/emailTemplates');
const router = express.Router();

// Validation middleware
const validateContact = [
    body('firstName')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('First name must be between 2 and 50 characters')
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('First name can only contain letters and spaces'),
    
    body('lastName')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Last name must be between 2 and 50 characters')
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('Last name can only contain letters and spaces'),
    
    body('email')
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    
    body('phone')
        .optional()
        .trim()
        .isMobilePhone('any', { strictMode: false })
        .withMessage('Please provide a valid phone number'),
    
    body('subject')
        .trim()
        .isIn(['general', 'quote', 'policy', 'claim', 'complaint', 'partnership'])
        .withMessage('Please select a valid subject'),
    
    body('insuranceType')
        .optional()
        .trim()
        .isIn(['health', 'life', 'motor', 'travel', 'home', 'multiple'])
        .withMessage('Please select a valid insurance type'),
    
    body('message')
        .trim()
        .isLength({ min: 10, max: 1000 })
        .withMessage('Message must be between 10 and 1000 characters'),
    
    body('newsletter')
        .optional()
        .isBoolean()
        .withMessage('Newsletter subscription must be a boolean value')
];

// GET /api/contact - Get all contact messages (admin only)
router.get('/', async (req, res) => {
    try {
        // In production, add authentication middleware here
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        
        const contacts = await Contact.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .select('-__v');
        
        const total = await Contact.countDocuments();
        
        res.json({
            success: true,
            data: contacts,
            pagination: {
                current: page,
                pages: Math.ceil(total / limit),
                total
            }
        });
    } catch (error) {
        console.error('Get contacts error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve contact messages'
        });
    }
});

// POST /api/contact - Submit contact form
router.post('/', validateContact, async (req, res) => {
    try {
        // Check validation results
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }
        
        const {
            firstName,
            lastName,
            email,
            phone,
            subject,
            insuranceType,
            message,
            newsletter
        } = req.body;
        
        // Check for duplicate submissions (same email and message in last 5 minutes)
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        const duplicateContact = await Contact.findOne({
            email,
            message,
            createdAt: { $gte: fiveMinutesAgo }
        });
        
        if (duplicateContact) {
            return res.status(429).json({
                success: false,
                message: 'Duplicate submission detected. Please wait before submitting again.'
            });
        }
        
        // Create contact record
        const contact = new Contact({
            firstName,
            lastName,
            email,
            phone,
            subject,
            insuranceType,
            message,
            newsletter: newsletter || false,
            ipAddress: req.ip,
            userAgent: req.get('User-Agent')
        });
        
        await contact.save();
        
        // Send emails asynchronously
        const emailTransporter = req.app.locals.emailTransporter;
        
        // Send confirmation email to customer
        try {
            const customerEmail = sendContactConfirmationEmail(contact);
            await emailTransporter.sendMail(customerEmail);
            console.log('✅ Confirmation email sent to:', email);
        } catch (emailError) {
            console.error('❌ Failed to send confirmation email:', emailError);
        }
        
        // Send notification email to admin
        try {
            const adminEmail = sendContactNotificationEmail(contact);
            await emailTransporter.sendMail(adminEmail);
            console.log('✅ Admin notification email sent');
        } catch (emailError) {
            console.error('❌ Failed to send admin notification email:', emailError);
        }
        
        // Log the contact submission
        console.log('📝 New contact submission:', {
            id: contact._id,
            name: `${firstName} ${lastName}`,
            email,
            subject,
            timestamp: contact.createdAt
        });
        
        res.status(201).json({
            success: true,
            message: 'Contact message sent successfully',
            data: {
                id: contact._id,
                timestamp: contact.createdAt
            }
        });
        
    } catch (error) {
        console.error('Contact submission error:', error);
        
        res.status(500).json({
            success: false,
            message: 'Failed to send contact message. Please try again later.'
        });
    }
});

// GET /api/contact/:id - Get specific contact message (admin only)
router.get('/:id', async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id).select('-__v');
        
        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact message not found'
            });
        }
        
        res.json({
            success: true,
            data: contact
        });
    } catch (error) {
        console.error('Get contact error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve contact message'
        });
    }
});

// PATCH /api/contact/:id - Update contact status (admin only)
router.patch('/:id', [
    body('status')
        .optional()
        .isIn(['pending', 'in-progress', 'resolved', 'closed'])
        .withMessage('Invalid status value'),
    
    body('adminNotes')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Admin notes cannot exceed 500 characters')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }
        
        const { status, adminNotes } = req.body;
        
        const contact = await Contact.findByIdAndUpdate(
            req.params.id,
            {
                ...(status && { status }),
                ...(adminNotes !== undefined && { adminNotes }),
                updatedAt: new Date()
            },
            { new: true }
        ).select('-__v');
        
        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact message not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Contact updated successfully',
            data: contact
        });
        
    } catch (error) {
        console.error('Update contact error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update contact message'
        });
    }
});

// DELETE /api/contact/:id - Delete contact message (admin only)
router.delete('/:id', async (req, res) => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id);
        
        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact message not found'
            });
        }
        
        console.log('🗑️ Contact message deleted:', {
            id: contact._id,
            email: contact.email,
            timestamp: new Date().toISOString()
        });
        
        res.json({
            success: true,
            message: 'Contact message deleted successfully'
        });
        
    } catch (error) {
        console.error('Delete contact error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete contact message'
        });
    }
});

// GET /api/contact/stats/summary - Get contact statistics (admin only)
router.get('/stats/summary', async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        const lastWeek = new Date(today);
        lastWeek.setDate(lastWeek.getDate() - 7);
        
        const lastMonth = new Date(today);
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        
        const [
            totalContacts,
            todayContacts,
            weekContacts,
            monthContacts,
            statusStats,
            subjectStats,
            insuranceTypeStats
        ] = await Promise.all([
            Contact.countDocuments(),
            Contact.countDocuments({ createdAt: { $gte: today } }),
            Contact.countDocuments({ createdAt: { $gte: lastWeek } }),
            Contact.countDocuments({ createdAt: { $gte: lastMonth } }),
            Contact.aggregate([
                { $group: { _id: '$status', count: { $sum: 1 } } }
            ]),
            Contact.aggregate([
                { $group: { _id: '$subject', count: { $sum: 1 } } }
            ]),
            Contact.aggregate([
                { $match: { insuranceType: { $exists: true, $ne: null } } },
                { $group: { _id: '$insuranceType', count: { $sum: 1 } } }
            ])
        ]);
        
        res.json({
            success: true,
            data: {
                counts: {
                    total: totalContacts,
                    today: todayContacts,
                    week: weekContacts,
                    month: monthContacts
                },
                statusBreakdown: statusStats.reduce((acc, stat) => {
                    acc[stat._id] = stat.count;
                    return acc;
                }, {}),
                subjectBreakdown: subjectStats.reduce((acc, stat) => {
                    acc[stat._id] = stat.count;
                    return acc;
                }, {}),
                insuranceTypeBreakdown: insuranceTypeStats.reduce((acc, stat) => {
                    acc[stat._id] = stat.count;
                    return acc;
                }, {})
            }
        });
        
    } catch (error) {
        console.error('Contact stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve contact statistics'
        });
    }
});

module.exports = router;