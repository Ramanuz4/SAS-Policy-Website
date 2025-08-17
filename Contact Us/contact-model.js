const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true,
        minlength: [2, 'First name must be at least 2 characters'],
        maxlength: [50, 'First name cannot exceed 50 characters'],
        match: [/^[a-zA-Z\s]+$/, 'First name can only contain letters and spaces']
    },
    
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true,
        minlength: [2, 'Last name must be at least 2 characters'],
        maxlength: [50, 'Last name cannot exceed 50 characters'],
        match: [/^[a-zA-Z\s]+$/, 'Last name can only contain letters and spaces']
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
        trim: true,
        match: [/^[+]?[\d\s\-\(\)]{10,}$/, 'Please provide a valid phone number']
    },
    
    subject: {
        type: String,
        required: [true, 'Subject is required'],
        enum: {
            values: ['general', 'quote', 'policy', 'claim', 'complaint', 'partnership'],
            message: 'Subject must be one of: general, quote, policy, claim, complaint, partnership'
        },
        index: true
    },
    
    insuranceType: {
        type: String,
        enum: {
            values: ['health', 'life', 'motor', 'travel', 'home', 'multiple'],
            message: 'Insurance type must be one of: health, life, motor, travel, home, multiple'
        },
        index: true
    },
    
    message: {
        type: String,
        required: [true, 'Message is required'],
        trim: true,
        minlength: [10, 'Message must be at least 10 characters'],
        maxlength: [1000, 'Message cannot exceed 1000 characters']
    },
    
    newsletter: {
        type: Boolean,
        default: false
    },
    
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'resolved', 'closed'],
        default: 'pending',
        index: true
    },
    
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium',
        index: true
    },
    
    adminNotes: {
        type: String,
        trim: true,
        maxlength: [500, 'Admin notes cannot exceed 500 characters']
    },
    
    assignedTo: {
        type: String,
        trim: true,
        maxlength: [100, 'Assigned to cannot exceed 100 characters']
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
    
    tags: [{
        type: String,
        trim: true,
        maxlength: [30, 'Tag cannot exceed 30 characters']
    }],
    
    followUpDate: {
        type: Date
    },
    
    resolvedDate: {
        type: Date
    },
    
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
contactSchema.index({ email: 1, createdAt: -1 });
contactSchema.index({ subject: 1, status: 1 });
contactSchema.index({ createdAt: -1, status: 1 });
contactSchema.index({ priority: 1, status: 1 });

// Virtual for full name
contactSchema.virtual('fullName').get(function() {
    return `${this.firstName} ${this.lastName}`;
});

// Virtual for formatted creation date
contactSchema.virtual('formattedCreatedAt').get(function() {
    return this.createdAt.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
});

// Virtual for response time (if resolved)
contactSchema.virtual('responseTime').get(function() {
    if (this.resolvedDate && this.createdAt) {
        const diffTime = Math.abs(this.resolvedDate - this.createdAt);
        const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
        return diffHours;
    }
    return null;
});

// Pre-save middleware
contactSchema.pre('save', function(next) {
    if (this.isModified() && !this.isNew) {
        this.updatedAt = new Date();
    }
    
    // Auto-set resolved date when status changes to resolved
    if (this.isModified('status') && this.status === 'resolved' && !this.resolvedDate) {
        this.resolvedDate = new Date();
    }
    
    // Auto-set priority based on subject
    if (this.isNew || this.isModified('subject')) {
        switch (this.subject) {
            case 'complaint':
                this.priority = 'high';
                break;
            case 'claim':
                this.priority = 'high';
                break;
            case 'quote':
                this.priority = 'medium';
                break;
            default:
                this.priority = this.priority || 'medium';
        }
    }
    
    next();
});

// Static methods
contactSchema.statics.findByEmail = function(email) {
    return this.find({ email: new RegExp(email, 'i') });
};

contactSchema.statics.findPending = function() {
    return this.find({ status: 'pending' }).sort({ createdAt: -1 });
};

contactSchema.statics.findHighPriority = function() {
    return this.find({ priority: { $in: ['high', 'urgent'] } })
               .sort({ priority: -1, createdAt: -1 });
};

contactSchema.statics.getStatsByDateRange = function(startDate, endDate) {
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
                _id: {
                    status: '$status',
                    subject: '$subject'
                },
                count: { $sum: 1 }
            }
        }
    ]);
};

// Instance methods
contactSchema.methods.markAsResolved = function() {
    this.status = 'resolved';
    this.resolvedDate = new Date();
    return this.save();
};

contactSchema.methods.addTag = function(tag) {
    if (!this.tags.includes(tag)) {
        this.tags.push(tag);
        return this.save();
    }
    return Promise.resolve(this);
};

contactSchema.methods.removeTag = function(tag) {
    this.tags = this.tags.filter(t => t !== tag);
    return this.save();
};

// Export the model
module.exports = mongoose.model('Contact', contactSchema);