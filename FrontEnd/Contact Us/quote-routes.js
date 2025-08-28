const express = require('express');
const { body, validationResult } = require('express-validator');
const Quote = require('../models/Quote');
const { sendQuoteConfirmationEmail, sendQuoteNotificationEmail } = require('../utils/emailTemplates');
const router = express.Router();

// Validation middleware
const validateQuote = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters')
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('Name can only contain letters and spaces'),
    
    body('email')
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    
    body('phone')
        .trim()
        .isMobilePhone('any', { strictMode: false })
        .withMessage('Please provide a valid phone number'),
    
    body('insuranceType')
        .trim()
        .isIn(['health', 'life', 'motor', 'travel', 'home'])
        .withMessage('Please select a valid insurance type'),
    
    body('age')
        .optional()
        .isInt({ min: 18, max: 100 })
        .withMessage('Age must be between 18 and 100'),
    
    body('requirements')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Requirements cannot exceed 500 characters')
];

// POST /api/quote - Submit quote request
router.post('/', validateQuote, async (req, res) => {
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
            name,
            email,
            phone,
            insuranceType,
            age,
            requirements
        } = req.body;
        
        // Check for duplicate submissions (same email and insurance type in last 24 hours)
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const duplicateQuote = await Quote.findOne({
            email,
            insuranceType,
            createdAt: { $gte: twentyFourHoursAgo }
        });
        
        if (duplicateQuote) {
            return res.status(429).json({
                success: false,
                message: 'You have already requested a quote for this insurance type today. Please wait 24 hours before submitting another request.'
            });
        }
        
        // Generate quote reference number
        const quoteRef = 'QT' + Date.now() + Math.random().toString(36).substr(2, 4).toUpperCase();
        
        // Create quote record
        const quote = new Quote({
            quoteReference: quoteRef,
            name,
            email,
            phone,
            insuranceType,
            age,
            requirements,
            ipAddress: req.ip,
            userAgent: req.get('User-Agent')
        });
        
        await quote.save();
        
        // Send emails asynchronously
        const emailTransporter = req.app.locals.emailTransporter;
        
        // Send confirmation email to customer
        try {
            const customerEmail = sendQuoteConfirmationEmail(quote);
            await emailTransporter.sendMail(customerEmail);
            console.log('✅ Quote confirmation email sent to:', email);
        } catch (emailError) {
            console.error('❌ Failed to send quote confirmation email:', emailError);
        }
        
        // Send notification email to admin
        try {
            const adminEmail = sendQuoteNotificationEmail(quote);
            await emailTransporter.sendMail(adminEmail);
            console.log('✅ Quote admin notification email sent');
        } catch (emailError) {
            console.error('❌ Failed to send quote admin notification email:', emailError);
        }
        
        // Log the quote request
        console.log('💰 New quote request:', {
            id: quote._id,
            reference: quoteRef,
            name,
            email,
            insuranceType,
            timestamp: quote.createdAt
        });
        
        res.status(201).json({
            success: true,
            message: 'Quote request submitted successfully',
            data: {
                id: quote._id,
                quoteReference: quoteRef,
                timestamp: quote.createdAt
            }
        });
        
    } catch (error) {
        console.error('Quote submission error:', error);
        
        res.status(500).json({
            success: false,
            message: 'Failed to submit quote request. Please try again later.'
        });
    }
});

// GET /api/quote - Get all quote requests (admin only)
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const status = req.query.status;
        const insuranceType = req.query.insuranceType;
        
        // Build filter query
        const filter = {};
        if (status) filter.status = status;
        if (insuranceType) filter.insuranceType = insuranceType;
        
        const quotes = await Quote.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .select('-__v');
        
        const total = await Quote.countDocuments(filter);
        
        res.json({
            success: true,
            data: quotes,
            pagination: {
                current: page,
                pages: Math.ceil(total / limit),
                total
            }
        });
    } catch (error) {
        console.error('Get quotes error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve quote requests'
        });
    }
});

// GET /api/quote/:id - Get specific quote request
router.get('/:id', async (req, res) => {
    try {
        const quote = await Quote.findById(req.params.id).select('-__v');
        
        if (!quote) {
            return res.status(404).json({
                success: false,
                message: 'Quote request not found'
            });
        }
        
        res.json({
            success: true,
            data: quote
        });
    } catch (error) {
        console.error('Get quote error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve quote request'
        });
    }
});

// GET /api/quote/reference/:ref - Get quote by reference number
router.get('/reference/:ref', async (req, res) => {
    try {
        const quote = await Quote.findOne({ quoteReference: req.params.ref }).select('-__v');
        
        if (!quote) {
            return res.status(404).json({
                success: false,
                message: 'Quote reference not found'
            });
        }
        
        res.json({
            success: true,
            data: quote
        });
    } catch (error) {
        console.error('Get quote by reference error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve quote request'
        });
    }
});

// PATCH /api/quote/:id - Update quote request (admin only)
router.patch('/:id', [
    body('status')
        .optional()
        .isIn(['pending', 'processing', 'quoted', 'converted', 'declined'])
        .withMessage('Invalid status value'),
    
    body('quoteAmount')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Quote amount must be a positive number'),
    
    body('quoteCurrency')
        .optional()
        .isIn(['INR', 'USD', 'EUR'])
        .withMessage('Invalid currency'),
    
    body('adminNotes')
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Admin notes cannot exceed 1000 characters'),
    
    body('followUpDate')
        .optional()
        .isISO8601()
        .withMessage('Follow-up date must be a valid date')
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
        
        const {
            status,
            quoteAmount,
            quoteCurrency,
            adminNotes,
            followUpDate
        } = req.body;
        
        const updateData = {
            updatedAt: new Date()
        };
        
        if (status) updateData.status = status;
        if (quoteAmount !== undefined) updateData.quoteAmount = quoteAmount;
        if (quoteCurrency) updateData.quoteCurrency = quoteCurrency;
        if (adminNotes !== undefined) updateData.adminNotes = adminNotes;
        if (followUpDate) updateData.followUpDate = new Date(followUpDate);
        
        const quote = await Quote.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        ).select('-__v');
        
        if (!quote) {
            return res.status(404).json({
                success: false,
                message: 'Quote request not found'
            });
        }
        
        // Log the update
        console.log('📝 Quote updated:', {
            id: quote._id,
            reference: quote.quoteReference,
            status: quote.status,
            timestamp: new Date().toISOString()
        });
        
        res.json({
            success: true,
            message: 'Quote request updated successfully',
            data: quote
        });
        
    } catch (error) {
        console.error('Update quote error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update quote request'
        });
    }
});

// DELETE /api/quote/:id - Delete quote request (admin only)
router.delete('/:id', async (req, res) => {
    try {
        const quote = await Quote.findByIdAndDelete(req.params.id);
        
        if (!quote) {
            return res.status(404).json({
                success: false,
                message: 'Quote request not found'
            });
        }
        
        console.log('🗑️ Quote request deleted:', {
            id: quote._id,
            reference: quote.quoteReference,
            email: quote.email,
            timestamp: new Date().toISOString()
        });
        
        res.json({
            success: true,
            message: 'Quote request deleted successfully'
        });
        
    } catch (error) {
        console.error('Delete quote error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete quote request'
        });
    }
});

// GET /api/quote/stats/summary - Get quote statistics (admin only)
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
            totalQuotes,
            todayQuotes,
            weekQuotes,
            monthQuotes,
            statusStats,
            insuranceTypeStats,
            conversionStats,
            averageQuoteAmount
        ] = await Promise.all([
            Quote.countDocuments(),
            Quote.countDocuments({ createdAt: { $gte: today } }),
            Quote.countDocuments({ createdAt: { $gte: lastWeek } }),
            Quote.countDocuments({ createdAt: { $gte: lastMonth } }),
            Quote.aggregate([
                { $group: { _id: '$status', count: { $sum: 1 } } }
            ]),
            Quote.aggregate([
                { $group: { _id: '$insuranceType', count: { $sum: 1 } } }
            ]),
            Quote.aggregate([
                {
                    $group: {
                        _id: null,
                        total: { $sum: 1 },
                        converted: {
                            $sum: { $cond: [{ $eq: ['$status', 'converted'] }, 1, 0] }
                        }
                    }
                }
            ]),
            Quote.aggregate([
                { $match: { quoteAmount: { $exists: true, $gt: 0 } } },
                { $group: { _id: null, averageAmount: { $avg: '$quoteAmount' } } }
            ])
        ]);
        
        const conversionRate = conversionStats.length > 0 
            ? ((conversionStats[0].converted / conversionStats[0].total) * 100).toFixed(2)
            : 0;
            
        const avgAmount = averageQuoteAmount.length > 0 
            ? averageQuoteAmount[0].averageAmount 
            : 0;
        
        res.json({
            success: true,
            data: {
                counts: {
                    total: totalQuotes,
                    today: todayQuotes,
                    week: weekQuotes,
                    month: monthQuotes
                },
                statusBreakdown: statusStats.reduce((acc, stat) => {
                    acc[stat._id] = stat.count;
                    return acc;
                }, {}),
                insuranceTypeBreakdown: insuranceTypeStats.reduce((acc, stat) => {
                    acc[stat._id] = stat.count;
                    return acc;
                }, {}),
                conversionRate: parseFloat(conversionRate),
                averageQuoteAmount: Math.round(avgAmount || 0)
            }
        });
        
    } catch (error) {
        console.error('Quote stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve quote statistics'
        });
    }
});

// GET /api/quote/stats/monthly - Get monthly quote trends (admin only)
router.get('/stats/monthly', async (req, res) => {
    try {
        const months = parseInt(req.query.months) || 12;
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - months);
        startDate.setDate(1);
        startDate.setHours(0, 0, 0, 0);
        
        const monthlyStats = await Quote.aggregate([
            { $match: { createdAt: { $gte: startDate } } },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' }
                    },
                    count: { $sum: 1 },
                    converted: {
                        $sum: { $cond: [{ $eq: ['$status', 'converted'] }, 1, 0] }
                    }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);
        
        res.json({
            success: true,
            data: monthlyStats.map(stat => ({
                month: `${stat._id.year}-${String(stat._id.month).padStart(2, '0')}`,
                quotes: stat.count,
                converted: stat.converted,
                conversionRate: ((stat.converted / stat.count) * 100).toFixed(2)
            }))
        });
        
    } catch (error) {
        console.error('Monthly quote stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve monthly quote statistics'
        });
    }
});

module.exports = router;