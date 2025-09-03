// life-insurance-backend.js
// Backend API for Life Insurance Services

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const moment = require('moment');

const app = express();
const PORT = process.env.PORT || 3000;

// Environment variables (use .env file in production)
const config = {
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/sas_life_insurance',
    JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    EMAIL_HOST: process.env.EMAIL_HOST || 'smtp.gmail.com',
    EMAIL_PORT: process.env.EMAIL_PORT || 587,
    EMAIL_USER: process.env.EMAIL_USER || 'your-email@gmail.com',
    EMAIL_PASS: process.env.EMAIL_PASS || 'your-app-password',
    ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@saspolicyvaluehub.com'
};

// Database connection
mongoose.connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Schemas
const consultationSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    age: { type: Number, min: 18, max: 100 },
    planInterest: { type: String, enum: ['term', 'whole', 'ulip', 'endowment', 'child', 'pension', 'consultation'] },
    message: { type: String, trim: true },
    status: { type: String, enum: ['pending', 'contacted', 'qualified', 'converted', 'closed'], default: 'pending' },
    source: { type: String, default: 'website' },
    assignedTo: { type: String },
    followUpDate: { type: Date },
    notes: [{ 
        text: String, 
        addedBy: String, 
        addedAt: { type: Date, default: Date.now } 
    }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const quoteRequestSchema = new mongoose.Schema({
    personalInfo: {
        name: { type: String, required: true, trim: true },
        phone: { type: String, required: true, trim: true },
        email: { type: String, required: true, trim: true, lowercase: true },
        age: { type: Number, required: true, min: 18, max: 100 },
        gender: { type: String, enum: ['male', 'female'], required: true },
        smokingStatus: { type: String, enum: ['yes', 'no'], required: true }
    },
    planDetails: {
        planType: { type: String, enum: ['term', 'whole', 'ulip', 'endowment'], required: true },
        coverageAmount: { type: Number, required: true, min: 100000 },
        policyTerm: { type: Number, required: true, min: 5, max: 40 }
    },
    calculatedPremium: {
        annual: { type: Number, required: true },
        monthly: { type: Number, required: true },
        total: { type: Number, required: true }
    },
    status: { type: String, enum: ['pending', 'quoted', 'proposal', 'issued'], default: 'pending' },
    quoteId: { type: String, unique: true },
    validTill: { type: Date },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const policyApplicationSchema = new mongoose.Schema({
    applicantInfo: {
        personalDetails: {
            firstName: { type: String, required: true, trim: true },
            lastName: { type: String, required: true, trim: true },
            dateOfBirth: { type: Date, required: true },
            gender: { type: String, enum: ['male', 'female'], required: true },
            maritalStatus: { type: String, enum: ['single', 'married', 'divorced', 'widowed'] },
            occupation: { type: String, required: true, trim: true },
            annualIncome: { type: Number, required: true, min: 0 }
        },
        contactDetails: {
            phone: { type: String, required: true, trim: true },
            email: { type: String, required: true, trim: true, lowercase: true },
            address: {
                street: { type: String, required: true, trim: true },
                city: { type: String, required: true, trim: true },
                state: { type: String, required: true, trim: true },
                pincode: { type: String, required: true, trim: true }
            }
        },
        identityProof: {
            type: { type: String, enum: ['aadhar', 'pan', 'passport', 'driving_license'], required: true },
            number: { type: String, required: true, trim: true }
        }
    },
    policyDetails: {
        planType: { type: String, enum: ['term', 'whole', 'ulip', 'endowment'], required: true },
        coverageAmount: { type: Number, required: true, min: 100000 },
        policyTerm: { type: Number, required: true, min: 5, max: 40 },
        premiumAmount: { type: Number, required: true },
        premiumFrequency: { type: String, enum: ['monthly', 'quarterly', 'half-yearly', 'yearly'], default: 'yearly' }
    },
    nominees: [{
        name: { type: String, required: true, trim: true },
        relationship: { type: String, required: true, trim: true },
        dateOfBirth: { type: Date, required: true },
        percentage: { type: Number, required: true, min: 1, max: 100 }
    }],
    medicalInfo: {
        height: { type: Number, required: true },
        weight: { type: Number, required: true },
        smokingStatus: { type: String, enum: ['yes', 'no'], required: true },
        medicalHistory: [{ condition: String, diagnosedDate: Date, treatment: String }],
        familyHistory: [{ condition: String, relationship: String }]
    },
    applicationStatus: { type: String, enum: ['draft', 'submitted', 'under_review', 'medical_pending', 'approved', 'rejected'], default: 'draft' },
    applicationId: { type: String, unique: true },
    submittedAt: { type: Date },
    approvedAt: { type: Date },
    policyNumber: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Models
const Consultation = mongoose.model('Consultation', consultationSchema);
const QuoteRequest = mongoose.model('QuoteRequest', quoteRequestSchema);
const PolicyApplication = mongoose.model('PolicyApplication', policyApplicationSchema);

// Middleware
app.use(helmet());
app.use(cors({
    origin: ['http://localhost:3000', 'https://saspolicyvaluehub.com'],
    credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: { error: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

// Email configuration
const emailTransporter = nodemailer.createTransporter({
    host: config.EMAIL_HOST,
    port: config.EMAIL_PORT,
    secure: false,
    auth: {
        user: config.EMAIL_USER,
        pass: config.EMAIL_PASS
    }
});

// Utility functions
function generateQuoteId() {
    return 'QT' + moment().format('YYYYMMDD') + Math.random().toString(36).substr(2, 6).toUpperCase();
}

function generateApplicationId() {
    return 'APP' + moment().format('YYYYMMDD') + Math.random().toString(36).substr(2, 8).toUpperCase();
}

function calculatePremium(age, gender, coverage, planType, term, smoking) {
    const baseRates = {
        term: 150,      // ₹150 per lakh per year
        whole: 800,     // ₹800 per lakh per year
        ulip: 600,      // ₹600 per lakh per year
        endowment: 1200 // ₹1200 per lakh per year
    };
    
    let baseRate = baseRates[planType] || 150;
    let coverageInLakhs = coverage / 100000;
    
    // Age factor
    let ageFactor = 1;
    if (age <= 25) ageFactor = 0.8;
    else if (age <= 35) ageFactor = 1;
    else if (age <= 45) ageFactor = 1.3;
    else if (age <= 55) ageFactor = 1.8;
    else ageFactor = 2.5;
    
    // Gender factor
    let genderFactor = gender === 'female' ? 0.9 : 1;
    
    // Smoking factor
    let smokingFactor = smoking === 'yes' ? 1.5 : 1;
    
    // Term factor
    let termFactor = 1;
    if (planType === 'term') {
        if (term >= 30) termFactor = 0.85;
        else if (term >= 20) termFactor = 0.9;
        else if (term >= 15) termFactor = 0.95;
    }
    
    let annualPremium = baseRate * coverageInLakhs * ageFactor * genderFactor * smokingFactor * termFactor;
    annualPremium = Math.round(annualPremium / 100) * 100;
    
    return {
        annual: annualPremium,
        monthly: Math.round(annualPremium / 12),
        total: annualPremium * term
    };
}

async function sendEmail(to, subject, html) {
    try {
        await emailTransporter.sendMail({
            from: `"SAS Policy Value Hub" <${config.EMAIL_USER}>`,
            to: to,
            subject: subject,
            html: html
        });
        console.log('Email sent successfully to:', to);
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}

// Validation middleware
function validateConsultation(req, res, next) {
    const { name, phone, email } = req.body;
    
    if (!name || name.trim().length < 2) {
        return res.status(400).json({ error: 'Name is required and must be at least 2 characters' });
    }
    
    if (!phone || !validator.isMobilePhone(phone, 'en-IN')) {
        return res.status(400).json({ error: 'Valid phone number is required' });
    }
    
    if (!email || !validator.isEmail(email)) {
        return res.status(400).json({ error: 'Valid email address is required' });
    }
    
    next();
}

function validateQuoteRequest(req, res, next) {
    const { age, gender, coverage, planType, term, smoking } = req.body;
    
    if (!age || age < 18 || age > 100) {
        return res.status(400).json({ error: 'Age must be between 18 and 100' });
    }
    
    if (!['male', 'female'].includes(gender)) {
        return res.status(400).json({ error: 'Gender must be male or female' });
    }
    
    if (!coverage || coverage < 100000) {
        return res.status(400).json({ error: 'Coverage amount must be at least ₹1 lakh' });
    }
    
    if (!['term', 'whole', 'ulip', 'endowment'].includes(planType)) {
        return res.status(400).json({ error: 'Invalid plan type' });
    }
    
    if (!term || term < 5 || term > 40) {
        return res.status(400).json({ error: 'Policy term must be between 5 and 40 years' });
    }
    
    if (!['yes', 'no'].includes(smoking)) {
        return res.status(400).json({ error: 'Smoking status must be yes or no' });
    }
    
    next();
}

// API Routes

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Submit consultation request
app.post('/api/consultation', validateConsultation, async (req, res) => {
    try {
        const consultationData = {
            name: req.body.name.trim(),
            phone: req.body.phone.trim(),
            email: req.body.email.trim().toLowerCase(),
            age: req.body.age,
            planInterest: req.body.planInterest,
            message: req.body.message?.trim()
        };
        
        const consultation = new Consultation(consultationData);
        await consultation.save();
        
        // Send confirmation email to client
        const clientEmailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #1e40af, #3b82f6); color: white; padding: 2rem; text-align: center;">
                    <h1>Thank You for Your Interest!</h1>
                    <p>Your consultation request has been received</p>
                </div>
                <div style="padding: 2rem;">
                    <h2>Dear ${consultationData.name},</h2>
                    <p>Thank you for reaching out to SAS Policy Value Hub Services for life insurance consultation.</p>
                    <p><strong>Your Request Details:</strong></p>
                    <ul>
                        <li><strong>Name:</strong> ${consultationData.name}</li>
                        <li><strong>Phone:</strong> ${consultationData.phone}</li>
                        <li><strong>Email:</strong> ${consultationData.email}</li>
                        ${consultationData.age ? `<li><strong>Age:</strong> ${consultationData.age}</li>` : ''}
                        ${consultationData.planInterest ? `<li><strong>Plan Interest:</strong> ${consultationData.planInterest}</li>` : ''}
                    </ul>
                    <p>Our expert will contact you within 24 hours to discuss your life insurance needs and provide personalized recommendations.</p>
                    <div style="background: #f8fafc; padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
                        <h3>What to Expect:</h3>
                        <ul>
                            <li>Personalized consultation call</li>
                            <li>Customized plan recommendations</li>
                            <li>Competitive premium quotes</li>
                            <li>Complete documentation assistance</li>
                        </ul>
                    </div>
                    <p>If you have any urgent queries, please call us at +91 98765 43210.</p>
                    <p>Best regards,<br>SAS Policy Value Hub Services Team</p>
                </div>
            </div>
        `;
        
        await sendEmail(consultationData.email, 'Life Insurance Consultation Request Received', clientEmailHtml);
        
        // Send notification email to admin
        const adminEmailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>New Life Insurance Consultation Request</h2>
                <p><strong>Request ID:</strong> ${consultation._id}</p>
                <p><strong>Received:</strong> ${moment().format('DD/MM/YYYY HH:mm')}</p>
                <h3>Customer Details:</h3>
                <ul>
                    <li><strong>Name:</strong> ${consultationData.name}</li>
                    <li><strong>Phone:</strong> ${consultationData.phone}</li>
                    <li><strong>Email:</strong> ${consultationData.email}</li>
                    ${consultationData.age ? `<li><strong>Age:</strong> ${consultationData.age}</li>` : ''}
                    ${consultationData.planInterest ? `<li><strong>Plan Interest:</strong> ${consultationData.planInterest}</li>` : ''}
                </ul>
                ${consultationData.message ? `<p><strong>Message:</strong> ${consultationData.message}</p>` : ''}
                <p><strong>Follow-up required within 24 hours</strong></p>
            </div>
        `;
        
        await sendEmail(config.ADMIN_EMAIL, 'New Life Insurance Consultation Request', adminEmailHtml);
        
        res.status(201).json({
            success: true,
            message: 'Consultation request submitted successfully',
            consultationId: consultation._id
        });
        
    } catch (error) {
        console.error('Error submitting consultation:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Calculate premium
app.post('/api/calculate-premium', validateQuoteRequest, async (req, res) => {
    try {
        const { age, gender, coverage, planType, term, smoking } = req.body;
        
        const premium = calculatePremium(age, gender, coverage, planType, term, smoking);
        
        res.json({
            success: true,
            premium: premium,
            calculatedAt: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Error calculating premium:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Submit quote request
app.post('/api/quote-request', validateQuoteRequest, async (req, res) => {
    try {
        const { name, phone, email, age, gender, coverage, planType, term, smoking } = req.body;
        
        // Calculate premium
        const premium = calculatePremium(age, gender, coverage, planType, term, smoking);
        
        const quoteData = {
            personalInfo: {
                name: name.trim(),
                phone: phone.trim(),
                email: email.trim().toLowerCase(),
                age: age,
                gender: gender,
                smokingStatus: smoking
            },
            planDetails: {
                planType: planType,
                coverageAmount: coverage,
                policyTerm: term
            },
            calculatedPremium: premium,
            quoteId: generateQuoteId(),
            validTill: moment().add(30, 'days').toDate()
        };
        
        const quoteRequest = new QuoteRequest(quoteData);
        await quoteRequest.save();
        
        // Send quote email to client
        const planNames = {
            term: 'Term Life Insurance',
            whole: 'Whole Life Insurance',
            ulip: 'Unit Linked Insurance Plan (ULIP)',
            endowment: 'Endowment Plan'
        };
        
        const quoteEmailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #1e40af, #3b82f6); color: white; padding: 2rem; text-align: center;">
                    <h1>Your Life Insurance Quote</h1>
                    <p>Quote ID: ${quoteData.quoteId}</p>
                </div>
                <div style="padding: 2rem;">
                    <h2>Dear ${quoteData.personalInfo.name},</h2>
                    <p>Thank you for your interest in our life insurance services. Here's your personalized quote:</p>
                    
                    <div style="background: #f8fafc; padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
                        <h3>Plan Details</h3>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><strong>Plan Type:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${planNames[planType]}</td></tr>
                            <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><strong>Coverage Amount:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">₹${(coverage/100000).toLocaleString()} Lakh</td></tr>
                            <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><strong>Policy Term:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${term} years</td></tr>
                            <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><strong>Age:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${age} years</td></tr>
                        </table>
                    </div>
                    
                    <div style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 2rem; border-radius: 8px; text-align: center; margin: 2rem 0;">
                        <h3 style="margin: 0;">Your Premium</h3>
                        <div style="font-size: 2rem; font-weight: bold; margin: 1rem 0;">₹${premium.monthly.toLocaleString()}/month</div>
                        <div style="opacity: 0.9;">or ₹${premium.annual.toLocaleString()}/year</div>
                        <div style="font-size: 0.9rem; margin-top: 1rem; opacity: 0.8;">Total Premium: ₹${premium.total.toLocaleString()}</div>
                    </div>
                    
                    <div style="background: #fef3c7; padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
                        <h4 style="color: #92400e; margin-top: 0;">Important Notes:</h4>
                        <ul style="color: #92400e; margin: 0;">
                            <li>This quote is valid till ${moment(quoteData.validTill).format('DD/MM/YYYY')}</li>
                            <li>Premium may vary based on medical examination</li>
                            <li>Additional riders available for enhanced coverage</li>
                            <li>Tax benefits available under Section 80C & 10(10D)</li>
                        </ul>
                    </div>
                    
                    <div style="text-align: center; margin: 2rem 0;">
                        <a href="tel:+919876543210" style="display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 25px; margin: 0 10px;">Call Now</a>
                        <a href="mailto:life@saspolicyvaluehub.com" style="display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 25px; margin: 0 10px;">Email Us</a>
                    </div>
                    
                    <p>Our expert will contact you within 24 hours to discuss your quote and answer any questions.</p>
                    <p>Best regards,<br>SAS Policy Value Hub Services Team</p>
                </div>
            </div>
        `;
        
        await sendEmail(quoteData.personalInfo.email, `Life Insurance Quote - ${quoteData.quoteId}`, quoteEmailHtml);
        
        // Send notification to admin
        const adminQuoteEmailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>New Life Insurance Quote Request</h2>
                <p><strong>Quote ID:</strong> ${quoteData.quoteId}</p>
                <p><strong>Generated:</strong> ${moment().format('DD/MM/YYYY HH:mm')}</p>
                <h3>Customer Details:</h3>
                <ul>
                    <li><strong>Name:</strong> ${quoteData.personalInfo.name}</li>
                    <li><strong>Phone:</strong> ${quoteData.personalInfo.phone}</li>
                    <li><strong>Email:</strong> ${quoteData.personalInfo.email}</li>
                    <li><strong>Age:</strong> ${quoteData.personalInfo.age}</li>
                    <li><strong>Gender:</strong> ${quoteData.personalInfo.gender}</li>
                    <li><strong>Smoking Status:</strong> ${quoteData.personalInfo.smokingStatus}</li>
                </ul>
                <h3>Plan Details:</h3>
                <ul>
                    <li><strong>Plan Type:</strong> ${planNames[planType]}</li>
                    <li><strong>Coverage:</strong> ₹${(coverage/100000)} Lakh</li>
                    <li><strong>Term:</strong> ${term} years</li>
                    <li><strong>Monthly Premium:</strong> ₹${premium.monthly.toLocaleString()}</li>
                    <li><strong>Annual Premium:</strong> ₹${premium.annual.toLocaleString()}</li>
                </ul>
                <p><strong>Follow-up required within 24 hours</strong></p>
            </div>
        `;
        
        await sendEmail(config.ADMIN_EMAIL, `New Quote Request - ${quoteData.quoteId}`, adminQuoteEmailHtml);
        
        res.status(201).json({
            success: true,
            message: 'Quote request submitted successfully',
            quoteId: quoteData.quoteId,
            premium: premium,
            validTill: quoteData.validTill
        });
        
    } catch (error) {
        console.error('Error submitting quote request:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get quote by ID
app.get('/api/quote/:quoteId', async (req, res) => {
    try {
        const quote = await QuoteRequest.findOne({ quoteId: req.params.quoteId });
        
        if (!quote) {
            return res.status(404).json({ error: 'Quote not found' });
        }
        
        res.json({
            success: true,
            quote: quote
        });
        
    } catch (error) {
        console.error('Error fetching quote:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Submit policy application
app.post('/api/policy-application', async (req, res) => {
    try {
        const applicationData = {
            ...req.body,
            applicationId: generateApplicationId(),
            submittedAt: new Date()
        };
        
        // Validate nominee percentages total to 100%
        const totalPercentage = applicationData.nominees.reduce((sum, nominee) => sum + nominee.percentage, 0);
        if (totalPercentage !== 100) {
            return res.status(400).json({ error: 'Nominee percentages must total 100%' });
        }
        
        const application = new PolicyApplication(applicationData);
        await application.save();
        
        // Send application confirmation email
        const applicationEmailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #1e40af, #3b82f6); color: white; padding: 2rem; text-align: center;">
                    <h1>Policy Application Submitted</h1>
                    <p>Application ID: ${applicationData.applicationId}</p>
                </div>
                <div style="padding: 2rem;">
                    <h2>Dear ${applicationData.applicantInfo.personalDetails.firstName} ${applicationData.applicantInfo.personalDetails.lastName},</h2>
                    <p>Your life insurance policy application has been successfully submitted and is now under review.</p>
                    
                    <div style="background: #f8fafc; padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
                        <h3>Application Summary</h3>
                        <ul>
                            <li><strong>Application ID:</strong> ${applicationData.applicationId}</li>
                            <li><strong>Plan Type:</strong> ${applicationData.policyDetails.planType}</li>
                            <li><strong>Coverage Amount:</strong> ₹${(applicationData.policyDetails.coverageAmount/100000)} Lakh</li>
                            <li><strong>Premium Amount:</strong> ₹${applicationData.policyDetails.premiumAmount.toLocaleString()}</li>
                            <li><strong>Policy Term:</strong> ${applicationData.policyDetails.policyTerm} years</li>
                        </ul>
                    </div>
                    
                    <div style="background: #fef3c7; padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
                        <h4 style="color: #92400e; margin-top: 0;">Next Steps:</h4>
                        <ol style="color: #92400e; margin: 0;">
                            <li>Document verification (1-2 business days)</li>
                            <li>Medical examination (if required)</li>
                            <li>Underwriting review (3-5 business days)</li>
                            <li>Policy approval and issuance</li>
                        </ol>
                    </div>
                    
                    <p>Our team will contact you within 24 hours with further instructions.</p>
                    <p>You can track your application status using Application ID: <strong>${applicationData.applicationId}</strong></p>
                    
                    <div style="text-align: center; margin: 2rem 0;">
                        <p>For any queries, contact us:</p>
                        <p>📞 +91 98765 43210 | ✉️ life@saspolicyvaluehub.com</p>
                    </div>
                    
                    <p>Best regards,<br>SAS Policy Value Hub Services Team</p>
                </div>
            </div>
        `;
        
        await sendEmail(
            applicationData.applicantInfo.contactDetails.email,
            `Policy Application Submitted - ${applicationData.applicationId}`,
            applicationEmailHtml
        );
        
        res.status(201).json({
            success: true,
            message: 'Policy application submitted successfully',
            applicationId: applicationData.applicationId
        });
        
    } catch (error) {
        console.error('Error submitting policy application:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get application status
app.get('/api/application/:applicationId', async (req, res) => {
    try {
        const application = await PolicyApplication.findOne({ 
            applicationId: req.params.applicationId 
        }).select('-applicantInfo.identityProof -medicalInfo');
        
        if (!application) {
            return res.status(404).json({ error: 'Application not found' });
        }
        
        res.json({
            success: true,
            application: application
        });
        
    } catch (error) {
        console.error('Error fetching application:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Admin routes (protected - would need authentication in production)
app.get('/api/admin/consultations', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        
        const consultations = await Consultation.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
            
        const total = await Consultation.countDocuments();
        
        res.json({
            success: true,
            consultations: consultations,
            pagination: {
                page: page,
                pages: Math.ceil(total / limit),
                total: total
            }
        });
        
    } catch (error) {
        console.error('Error fetching consultations:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/admin/quotes', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        
        const quotes = await QuoteRequest.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
            
        const total = await QuoteRequest.countDocuments();
        
        res.json({
            success: true,
            quotes: quotes,
            pagination: {
                page: page,
                pages: Math.ceil(total / limit),
                total: total
            }
        });
        
    } catch (error) {
        console.error('Error fetching quotes:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/admin/applications', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        
        const applications = await PolicyApplication.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
            
        const total = await PolicyApplication.countDocuments();
        
        res.json({
            success: true,
            applications: applications,
            pagination: {
                page: page,
                pages: Math.ceil(total / limit),
                total: total
            }
        });
        
    } catch (error) {
        console.error('Error fetching applications:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update consultation status
app.put('/api/admin/consultation/:id', async (req, res) => {
    try {
        const { status, assignedTo, followUpDate, notes } = req.body;
        
        const updateData = { updatedAt: new Date() };
        if (status) updateData.status = status;
        if (assignedTo) updateData.assignedTo = assignedTo;
        if (followUpDate) updateData.followUpDate = followUpDate;
        if (notes) {
            updateData.$push = { 
                notes: { 
                    text: notes, 
                    addedBy: req.body.addedBy || 'admin',
                    addedAt: new Date()
                }
            };
        }
        
        const consultation = await Consultation.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );
        
        if (!consultation) {
            return res.status(404).json({ error: 'Consultation not found' });
        }
        
        res.json({
            success: true,
            message: 'Consultation updated successfully',
            consultation: consultation
        });
        
    } catch (error) {
        console.error('Error updating consultation:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Analytics endpoint
app.get('/api/admin/analytics', async (req, res) => {
    try {
        const today = moment().startOf('day');
        const thisMonth = moment().startOf('month');
        const thisYear = moment().startOf('year');
        
        const analytics = {
            consultations: {
                today: await Consultation.countDocuments({ createdAt: { $gte: today.toDate() } }),
                thisMonth: await Consultation.countDocuments({ createdAt: { $gte: thisMonth.toDate() } }),
                thisYear: await Consultation.countDocuments({ createdAt: { $gte: thisYear.toDate() } }),
                total: await Consultation.countDocuments()
            },
            quotes: {
                today: await QuoteRequest.countDocuments({ createdAt: { $gte: today.toDate() } }),
                thisMonth: await QuoteRequest.countDocuments({ createdAt: { $gte: thisMonth.toDate() } }),
                thisYear: await QuoteRequest.countDocuments({ createdAt: { $gte: thisYear.toDate() } }),
                total: await QuoteRequest.countDocuments()
            },
            applications: {
                today: await PolicyApplication.countDocuments({ createdAt: { $gte: today.toDate() } }),
                thisMonth: await PolicyApplication.countDocuments({ createdAt: { $gte: thisMonth.toDate() } }),
                thisYear: await PolicyApplication.countDocuments({ createdAt: { $gte: thisYear.toDate() } }),
                total: await PolicyApplication.countDocuments()
            }
        };
        
        // Popular plan types
        const popularPlans = await QuoteRequest.aggregate([
            { $group: { _id: '$planDetails.planType', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);
        
        analytics.popularPlans = popularPlans;
        
        res.json({
            success: true,
            analytics: analytics
        });
        
    } catch (error) {
        console.error('Error fetching analytics:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Life Insurance Backend API running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`MongoDB: ${config.MONGODB_URI}`);
});

module.exports = app;