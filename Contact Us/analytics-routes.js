const express = require('express');
const { body, validationResult } = require('express-validator');
const Analytics = require('../models/Analytics');
const router = express.Router();

// Validation middleware
const validateAnalytics = [
    body('event')
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Event name must be between 1 and 100 characters'),
    
    body('data')
        .optional()
        .isObject()
        .withMessage('Data must be an object'),
    
    body('page')
        .optional()
        .trim()
        .isLength({ max: 200 })
        .withMessage('Page cannot exceed 200 characters')
];

// POST /api/analytics - Track analytics event
router.post('/', validateAnalytics, async (req, res) => {
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
        
        const { event, data, page } = req.body;
        
        // Create analytics record
        const analytics = new Analytics({
            event,
            data: data || {},
            page: page || req.get('Referer') || 'unknown',
            ipAddress: req.ip,
            userAgent: req.get('User-Agent'),
            timestamp: new Date()
        });
        
        await analytics.save();
        
        res.status(201).json({
            success: true,
            message: 'Analytics event tracked successfully'
        });
        
    } catch (error) {
        console.error('Analytics tracking error:', error);
        
        // Don't fail the request for analytics errors
        res.status(200).json({
            success: false,
            message: 'Analytics tracking failed, but request processed'
        });
    }
});

// GET /api/analytics/events - Get analytics events (admin only)
router.get('/events', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const skip = (page - 1) * limit;
        const event = req.query.event;
        const startDate = req.query.startDate;
        const endDate = req.query.endDate;
        
        // Build filter query
        const filter = {};
        if (event) filter.event = event;
        if (startDate || endDate) {
            filter.timestamp = {};
            if (startDate) filter.timestamp.$gte = new Date(startDate);
            if (endDate) filter.timestamp.$lte = new Date(endDate);
        }
        
        const events = await Analytics.find(filter)
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(limit)
            .select('-__v');
        
        const total = await Analytics.countDocuments(filter);
        
        res.json({
            success: true,
            data: events,
            pagination: {
                current: page,
                pages: Math.ceil(total / limit),
                total
            }
        });
    } catch (error) {
        console.error('Get analytics events error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve analytics events'
        });
    }
});

// GET /api/analytics/summary - Get analytics summary (admin only)
router.get('/summary', async (req, res) => {
    try {
        const days = parseInt(req.query.days) || 30;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        
        const [
            totalEvents,
            periodEvents,
            topEvents,
            topPages,
            dailyStats
        ] = await Promise.all([
            Analytics.countDocuments(),
            Analytics.countDocuments({ timestamp: { $gte: startDate } }),
            Analytics.aggregate([
                { $match: { timestamp: { $gte: startDate } } },
                { $group: { _id: '$event', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 10 }
            ]),
            Analytics.aggregate([
                { $match: { timestamp: { $gte: startDate } } },
                { $group: { _id: '$page', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 10 }
            ]),
            Analytics.aggregate([
                { $match: { timestamp: { $gte: startDate } } },
                {
                    $group: {
                        _id: {
                            date: {
                                $dateToString: {
                                    format: '%Y-%m-%d',
                                    date: '$timestamp'
                                }
                            }
                        },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { '_id.date': 1 } }
            ])
        ]);
        
        res.json({
            success: true,
            data: {
                summary: {
                    totalEvents,
                    periodEvents,
                    periodDays: days
                },
                topEvents: topEvents.map(event => ({
                    name: event._id,
                    count: event.count
                })),
                topPages: topPages.map(page => ({
                    name: page._id,
                    count: page.count
                })),
                dailyStats: dailyStats.map(stat => ({
                    date: stat._id.date,
                    count: stat.count
                }))
            }
        });
        
    } catch (error) {
        console.error('Analytics summary error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve analytics summary'
        });
    }
});

// GET /api/analytics/conversion-funnel - Get conversion funnel data (admin only)
router.get('/conversion-funnel', async (req, res) => {
    try {
        const days = parseInt(req.query.days) || 30;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        
        const funnelSteps = [
            'page_view',
            'service_interest',
            'cta_click',
            'quote_form_submit',
            'contact_form_submit'
        ];
        
        const funnelData = await Promise.all(
            funnelSteps.map(async (step) => {
                const count = await Analytics.countDocuments({
                    event: step,
                    timestamp: { $gte: startDate }
                });
                return { step, count };
            })
        );
        
        // Calculate conversion rates
        const funnelWithRates = funnelData.map((current, index) => {
            const conversionRate = index === 0 
                ? 100 
                : ((current.count / funnelData[0].count) * 100).toFixed(2);
                
            const stepRate = index === 0 
                ? 100 
                : funnelData[index - 1].count > 0
                    ? ((current.count / funnelData[index - 1].count) * 100).toFixed(2)
                    : 0;
            
            return {
                ...current,
                conversionRate: parseFloat(conversionRate),
                stepConversionRate: parseFloat(stepRate)
            };
        });
        
        res.json({
            success: true,
            data: {
                period: days,
                funnel: funnelWithRates
            }
        });
        
    } catch (error) {
        console.error('Conversion funnel error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve conversion funnel data'
        });
    }
});

// DELETE /api/analytics/cleanup - Clean up old analytics data (admin only)
router.delete('/cleanup', async (req, res) => {
    try {
        const daysToKeep = parseInt(req.query.days) || 90;
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
        
        const result = await Analytics.deleteMany({
            timestamp: { $lt: cutoffDate }
        });
        
        console.log(`🧹 Analytics cleanup: ${result.deletedCount} records deleted (older than ${daysToKeep} days)`);
        
        res.json({
            success: true,
            message: `Cleaned up ${result.deletedCount} analytics records`,
            deletedCount: result.deletedCount,
            cutoffDate: cutoffDate.toISOString()
        });
        
    } catch (error) {
        console.error('Analytics cleanup error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to cleanup analytics data'
        });
    }
});

module.exports = router;