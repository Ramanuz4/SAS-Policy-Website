const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
    quoteReference: {
        type: String,
        required: [true, 'Quote reference is required'],
        unique: true,
        trim: true,
        index: true
    },
    
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters'],
        maxlength: [100, 'Name cannot exceed 100 characters'],
        match: [/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces']
    },
    
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
        index: true
    },
    
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true,
        match: [/^[+]?[\d\s\-\(\)]{10,}$/, 'Please provide a valid phone number']
    },
    
    insuranceType: {
        type: String,
        required: [true, 'Insurance type is required'],
        enum: {
            values: ['health', 'life', 'motor', 'travel', 'home'],
            message: 'Insurance type must be one of: health, life, motor, travel, home'
        },
        index: true
    },
    
    age: {
        type: Number,
        min: [18, 'Age must be at least 18'],
        max: [100, 'Age cannot exceed 100']
    },
    
    requirements: {
        type: String,
        trim: true,
        maxlength: [500, 'Requirements cannot exceed 500 characters']
    },
    
    status: {
        type: String,
        enum: ['pending', 'processing', 'quoted', 'converted', 'declined'],
        default: 'pending',
        index: true
    },
    
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium',
        index: true
    },
    
    quoteAmount: {
        type: Number,
        min: [0, 'Quote amount cannot be negative']
    },
    
    quoteCurrency: {
        type: String,
        enum: ['INR', 'USD', 'EUR'],
        default: 'INR'
    },
    
    quoteValidUntil: {
        type: Date
    },
    
    adminNotes: {
        type: String,
        trim: true,
        maxlength: [1000, 'Admin notes cannot exceed 1000 characters']
    },
    
    assignedTo: {
        type: String,
        trim: true,
        maxlength: [100, 'Assigned to cannot exceed 100 characters']
    },
    
    followUpDate: {
        type: Date,
        index: true
    },
    
    quotedDate: {
        type: Date
    },
    
    convertedDate: {
        type: Date
    },
    
    policyNumber: {
        type: String,
        trim: true,
        sparse: true, // Allow multiple null values
        index: true
    },
    
    premiumAmount: {
        type: Number,
        min: [0, 'Premium amount cannot be negative']
    },
    
    coverageAmount: {
        type: Number,
        min: [0, 'Coverage amount cannot be negative']
    },
    
    ipAddress: {
        type: String,
        trim: true
    },
    
    userAgent: {
        type: String,
        trim: true
    },
    
    source: {
        type: String,
        enum: ['website', 'mobile-app', 'phone', 'email', 'walk-in', 'referral'],
        default: 'website'
    },
    
    utm: {
        source: String,
        medium: String,
        campaign: String,
        term: String,
        content: String
    },
    
    tags: [{
        type: String,
        trim: true,
        maxlength: [30, 'Tag cannot exceed 30 characters']
    }],
    
    documents: [{
        name: {
            type: String,
            required: true,
            trim: true
        },
        url: {
            type: String,
            required: true,
            trim: true
        },
        uploadedAt: {
            type: Date,
            default: Date.now
        },
        fileSize: Number,
        mimeType: String
    }],
    
    communicationLog: [{
        type: {
            type: String,
            enum: ['email', 'phone', 'sms', 'whatsapp', 'meeting'],
            required: true
        },
        direction: {
            type: String,
            enum: ['inbound', 'outbound'],
            required: true
        },
        summary: {
            type: String,
            required: true,
            trim: true,
            maxlength: [500, 'Communication summary cannot exceed 500 characters']
        },
        agent: {
            type: String,
            trim: true
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    }],
    
    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    },
    
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for better query performance
quoteSchema.index({ email: 1, insuranceType: 1, createdAt: -1 });
quoteSchema.index({ status: 1, priority: 1, createdAt: -1 });
quoteSchema.index({ assignedTo: 1, status: 1 });
quoteSchema.index({ followUpDate: 1, status: 1 });
quoteSchema.index({ createdAt: -1, insuranceType: 1 });

// Virtual for formatted quote amount
quoteSchema.virtual('formattedQuoteAmount').get(function() {
    if (!this.quoteAmount) return null;
    
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: this.quoteCurrency || 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(this.quoteAmount);
});

// Virtual for formatted premium amount
quoteSchema.virtual('formattedPremiumAmount').get(function() {
    if (!this.premiumAmount) return null;
    
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: this.quoteCurrency || 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(this.premiumAmount);
});

// Virtual for days since creation
quoteSchema.virtual('daysSinceCreation').get(function() {
    const now = new Date();
    const diffTime = Math.abs(now - this.createdAt);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual for quote validity status
quoteSchema.virtual('isQuoteValid').get(function() {
    if (!this.quoteValidUntil) return null;
    return new Date() <= this.quoteValidUntil;
});

// Virtual for processing time (if quoted)
quoteSchema.virtual('processingTime').get(function() {
    if (this.quotedDate && this.createdAt) {
        const diffTime = Math.abs(this.quotedDate - this.createdAt);
        const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
        return diffHours;
    }
    return null;
});

// Virtual for conversion time (if converted)
quoteSchema.virtual('conversionTime').get(function() {
    if (this.convertedDate && this.quotedDate) {
        const diffTime = Math.abs(this.convertedDate - this.quotedDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    }
    return null;
});

// Pre-save middleware
quoteSchema.pre('save', function(next) {
    if (this.isModified() && !this.isNew) {
        this.updatedAt = new Date();
    }
    
    // Auto-set quoted date when status changes to quoted
    if (this.isModified('status') && this.status === 'quoted' && !this.quotedDate) {
        this.quotedDate = new Date();
        
        // Set quote validity (30 days from quoted date)
        if (!this.quoteValidUntil) {
            this.quoteValidUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        }
    }
    
    // Auto-set converted date when status changes to converted
    if (this.isModified('status') && this.status === 'converted' && !this.convertedDate) {
        this.convertedDate = new Date();
    }
    
    // Auto-set priority based on age and insurance type
    if (this.isNew || this.isModified(['age', 'insuranceType'])) {
        if (this.age && this.age >= 60) {
            this.priority = 'high';
        } else if (this.insuranceType === 'life' && this.age && this.age >= 50) {
            this.priority = 'medium';
        } else {
            this.priority = this.priority || 'medium';
        }
    }
    
    next();
});

// Static methods
quoteSchema.statics.findByEmail = function(email) {
    return this.find({ email: new RegExp(email, 'i') });
};

quoteSchema.statics.findPending = function() {
    return this.find({ status: 'pending' }).sort({ createdAt: -1 });
};

quoteSchema.statics.findByInsuranceType = function(insuranceType) {
    return this.find({ insuranceType }).sort({ createdAt: -1 });
};

quoteSchema.statics.findHighPriority = function() {
    return this.find({ priority: { $in: ['high', 'urgent'] } })
               .sort({ priority: -1, createdAt: -1 });
};

quoteSchema.statics.findDueForFollowUp = function() {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    
    return this.find({
        followUpDate: { $lte: today },
        status: { $in: ['pending', 'processing', 'quoted'] }
    }).sort({ followUpDate: 1 });
};

quoteSchema.statics.findExpiredQuotes = function() {
    const today = new Date();
    
    return this.find({
        quoteValidUntil: { $lt: today },
        status: 'quoted'
    }).sort({ quoteValidUntil: 1 });
};

quoteSchema.statics.getConversionStats = function(startDate, endDate) {
    return this.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: startDate,
                    $lte: endDate
                }
            }
        },
        {
            $group: {
                _id: '$insuranceType',
                total: { $sum: 1 },
                quoted: {
                    $sum: { $cond: [{ $in: ['$status', ['quoted', 'converted']] }, 1, 0] }
                },
                converted: {
                    $sum: { $cond: [{ $eq: ['$status', 'converted'] }, 1, 0] }
                },
                avgQuoteAmount: {
                    $avg: { $cond: [{ $gt: ['$quoteAmount', 0] }, '$quoteAmount', null] }
                },
                totalPremium: {
                    $sum: { $cond: [{ $gt: ['$premiumAmount', 0] }, '$premiumAmount', 0] }
                }
            }
        }
    ]);
};

quoteSchema.statics.getMonthlyTrends = function(months = 12) {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);
    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);
    
    return this.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        {
            $group: {
                _id: {
                    year: { $year: '$createdAt' },
                    month: { $month: '$createdAt' },
                    insuranceType: '$insuranceType'
                },
                count: { $sum: 1 },
                converted: {
                    $sum: { $cond: [{ $eq: ['$status', 'converted'] }, 1, 0] }
                }
            }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);
};

// Instance methods
quoteSchema.methods.markAsQuoted = function(amount, currency = 'INR', validDays = 30) {
    this.status = 'quoted';
    this.quoteAmount = amount;
    this.quoteCurrency = currency;
    this.quotedDate = new Date();
    this.quoteValidUntil = new Date(Date.now() + validDays * 24 * 60 * 60 * 1000);
    return this.save();
};

quoteSchema.methods.markAsConverted = function(policyNumber, premiumAmount) {
    this.status = 'converted';
    this.convertedDate = new Date();
    this.policyNumber = policyNumber;
    this.premiumAmount = premiumAmount;
    return this.save();
};

quoteSchema.methods.addCommunicationLog = function(type, direction, summary, agent = null) {
    this.communicationLog.push({
        type,
        direction,
        summary,
        agent,
        timestamp: new Date()
    });
    return this.save();
};

quoteSchema.methods.setFollowUpDate = function(date) {
    this.followUpDate = new Date(date);
    return this.save();
};

quoteSchema.methods.addTag = function(tag) {
    if (!this.tags.includes(tag)) {
        this.tags.push(tag);
        return this.save();
    }
    return Promise.resolve(this);
};

quoteSchema.methods.removeTag = function(tag) {
    this.tags = this.tags.filter(t => t !== tag);
    return this.save();
};

quoteSchema.methods.addDocument = function(name, url, fileSize = null, mimeType = null) {
    this.documents.push({
        name,
        url,
        fileSize,
        mimeType,
        uploadedAt: new Date()
    });
    return this.save();
};

quoteSchema.methods.removeDocument = function(documentId) {
    this.documents = this.documents.filter(doc => doc._id.toString() !== documentId);
    return this.save();
};

// Export the model
module.exports = mongoose.model('Quote', quoteSchema);