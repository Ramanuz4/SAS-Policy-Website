const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
    event: {
        type: String,
        required: [true, 'Event name is required'],
        trim: true,
        minlength: [1, 'Event name must be at least 1 character'],
        maxlength: [100, 'Event name cannot exceed 100 characters'],
        index: true
    },
    
    data: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    
    page: {
        type: String,
        trim: true,
        maxlength: [200, 'Page cannot exceed 200 characters'],
        index: true
    },
    
    sessionId: {
        type: String,
        trim: true,
        index: true
    },
    
    userId: {
        type: String,
        trim: true,
        index: true
    },
    
    ipAddress: {
        type: String,
        trim: true,
        index: true
    },
    
    userAgent: {
        type: String,
        trim: true
    },
    
    referrer: {
        type: String,
        trim: true
    },
    
    utm: {
        source: String,
        medium: String,
        campaign: String,
        term: String,
        content: String
    },
    
    device: {
        type: {
            type: String,
            enum: ['desktop', 'mobile', 'tablet', 'unknown'],
            default: 'unknown'
        },
        os: String,
        browser: String,
        version: String
    },
    
    location: {
        country: String,
        region: String,
        city: String,
        timezone: String
    },
    
    timestamp: {
        type: Date,
        default: Date.now,
        index: true
    }
}, {
    timestamps: false, // Using custom timestamp
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for better query performance
analyticsSchema.index({ event: 1, timestamp: -1 });
analyticsSchema.index({ page: 1, timestamp: -1 });
analyticsSchema.index({ sessionId: 1, timestamp: 1 });
analyticsSchema.index({ timestamp: -1, event: 1 });
analyticsSchema.index({ ipAddress: 1, timestamp: -1 });

// TTL index to auto-delete old analytics data (90 days)
analyticsSchema.index({ timestamp: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });

// Virtual for formatted timestamp
analyticsSchema.virtual('formattedTimestamp').get(function() {
    return this.timestamp.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
});

// Virtual for date only
analyticsSchema.virtual('dateOnly').get(function() {
    return this.timestamp.toISOString().split('T')[0];
});

// Virtual for hour of day
analyticsSchema.virtual('hourOfDay').get(function() {
    return this.timestamp.getHours();
});

// Virtual for day of week
analyticsSchema.virtual('dayOfWeek').get(function() {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[this.timestamp.getDay()];
});

// Pre-save middleware
analyticsSchema.pre('save', function(next) {
    // Parse User-Agent for device information
    if (this.userAgent && !this.device.browser) {
        this.device = parseUserAgent(this.userAgent);
    }
    
    next();
});

// Static methods
analyticsSchema.statics.getEventCounts = function(startDate, endDate, eventName = null) {
    const match = {
        timestamp: { $gte: startDate, $lte: endDate }
    };
    
    if (eventName) {
        match.event = eventName;
    }
    
    return this.aggregate([
        { $match: match },
        {
            $group: {
                _id: '$event',
                count: { $sum: 1 },
                uniqueIPs: { $addToSet: '$ipAddress' }
            }
        },
        {
            $project: {
                _id: 1,
                count: 1,
                uniqueVisitors: { $size: '$uniqueIPs' }
            }
        },
        { $sort: { count: -1 } }
    ]);
};

analyticsSchema.statics.getDailyStats = function(days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);
    
    return this.aggregate([
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
                events: { $sum: 1 },
                uniqueVisitors: { $addToSet: '$ipAddress' },
                pages: { $addToSet: '$page' }
            }
        },
        {
            $project: {
                _id: 1,
                events: 1,
                uniqueVisitors: { $size: '$uniqueVisitors' },
                uniquePages: { $size: '$pages' }
            }
        },
        { $sort: { '_id.date': 1 } }
    ]);
};

analyticsSchema.statics.getHourlyDistribution = function(days = 7) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    return this.aggregate([
        { $match: { timestamp: { $gte: startDate } } },
        {
            $group: {
                _id: { $hour: '$timestamp' },
                count: { $sum: 1 }
            }
        },
        { $sort: { '_id': 1 } }
    ]);
};

analyticsSchema.statics.getTopPages = function(startDate, endDate, limit = 10) {
    return this.aggregate([
        {
            $match: {
                timestamp: { $gte: startDate, $lte: endDate },
                page: { $exists: true, $ne: null, $ne: '' }
            }
        },
        {
            $group: {
                _id: '$page',
                views: { $sum: 1 },
                uniqueVisitors: { $addToSet: '$ipAddress' }
            }
        },
        {
            $project: {
                _id: 1,
                views: 1,
                uniqueVisitors: { $size: '$uniqueVisitors' }
            }
        },
        { $sort: { views: -1 } },
        { $limit: limit }
    ]);
};

analyticsSchema.statics.getUserJourney = function(sessionId) {
    return this.find({ sessionId })
        .sort({ timestamp: 1 })
        .select('event page data timestamp');
};

analyticsSchema.statics.getFunnelAnalysis = function(funnelSteps, startDate, endDate) {
    return Promise.all(
        funnelSteps.map(async (step) => {
            const count = await this.countDocuments({
                event: step,
                timestamp: { $gte: startDate, $lte: endDate }
            });
            return { step, count };
        })
    );
};

analyticsSchema.statics.getDeviceStats = function(startDate, endDate) {
    return this.aggregate([
        { $match: { timestamp: { $gte: startDate, $lte: endDate } } },
        {
            $group: {
                _id: {
                    deviceType: '$device.type',
                    os: '$device.os',
                    browser: '$device.browser'
                },
                count: { $sum: 1 },
                uniqueUsers: { $addToSet: '$ipAddress' }
            }
        },
        {
            $project: {
                _id: 1,
                count: 1,
                uniqueUsers: { $size: '$uniqueUsers' }
            }
        },
        { $sort: { count: -1 } }
    ]);
};

analyticsSchema.statics.getTrafficSources = function(startDate, endDate) {
    return this.aggregate([
        { 
            $match: { 
                timestamp: { $gte: startDate, $lte: endDate },
                event: 'page_view'
            } 
        },
        {
            $group: {
                _id: {
                    source: '$utm.source',
                    medium: '$utm.medium',
                    campaign: '$utm.campaign'
                },
                sessions: { $addToSet: '$sessionId' },
                events: { $sum: 1 }
            }
        },
        {
            $project: {
                _id: 1,
                sessions: { $size: '$sessions' },
                events: 1
            }
        },
        { $sort: { sessions: -1 } }
    ]);
};

// Instance methods
analyticsSchema.methods.isFromMobile = function() {
    return this.device.type === 'mobile';
};

analyticsSchema.methods.isFromBot = function() {
    if (!this.userAgent) return false;
    
    const botPatterns = [
        /bot/i, /crawler/i, /spider/i, /crawling/i,
        /google/i, /bing/i, /yahoo/i, /facebook/i,
        /twitter/i, /linkedin/i
    ];
    
    return botPatterns.some(pattern => pattern.test(this.userAgent));
};

analyticsSchema.methods.getTimeOnPage = function() {
    // This would need to be calculated by comparing with next event
    // Implementation depends on your specific tracking setup
    return null;
};

// Helper function to parse User-Agent
function parseUserAgent(userAgent) {
    const device = {
        type: 'unknown',
        os: 'unknown',
        browser: 'unknown',
        version: 'unknown'
    };
    
    // Device type detection
    if (/Mobile|Android|iPhone|iPad|iPod|Windows Phone/i.test(userAgent)) {
        device.type = /iPad|tablet/i.test(userAgent) ? 'tablet' : 'mobile';
    } else {
        device.type = 'desktop';
    }
    
    // OS detection
    if (/Windows NT/i.test(userAgent)) {
        device.os = 'Windows';
    } else if (/Mac OS X/i.test(userAgent)) {
        device.os = 'macOS';
    } else if (/Linux/i.test(userAgent)) {
        device.os = 'Linux';
    } else if (/Android/i.test(userAgent)) {
        device.os = 'Android';
    } else if (/iOS|iPhone|iPad/i.test(userAgent)) {
        device.os = 'iOS';
    }
    
    // Browser detection
    if (/Chrome/i.test(userAgent) && !/Edge|OPR/i.test(userAgent)) {
        device.browser = 'Chrome';
    } else if (/Firefox/i.test(userAgent)) {
        device.browser = 'Firefox';
    } else if (/Safari/i.test(userAgent) && !/Chrome/i.test(userAgent)) {
        device.browser = 'Safari';
    } else if (/Edge/i.test(userAgent)) {
        device.browser = 'Edge';
    } else if (/OPR/i.test(userAgent)) {
        device.browser = 'Opera';
    }
    
    return device;
}

// Export the model
module.exports = mongoose.model('Analytics', analyticsSchema);