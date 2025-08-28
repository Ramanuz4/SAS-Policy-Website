// Home Insurance Backend Server
// This is a Node.js Express server for handling home insurance quote requests

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static('public'));

// Email configuration (replace with your SMTP details)
const emailTransporter = nodemailer.createTransporter({
    host: 'smtp.gmail.com', // Replace with your SMTP server
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASS || 'your-app-password'
    }
});

// Database simulation (in production, use a real database)
class QuoteDatabase {
    constructor() {
        this.quotes = [];
        this.loadQuotes();
    }

    async loadQuotes() {
        try {
            const data = await fs.readFile('./quotes.json', 'utf8');
            this.quotes = JSON.parse(data);
        } catch (error) {
            console.log('No existing quotes file, starting fresh');
            this.quotes = [];
        }
    }

    async saveQuotes() {
        try {
            await fs.writeFile('./quotes.json', JSON.stringify(this.quotes, null, 2));
        } catch (error) {
            console.error('Error saving quotes:', error);
        }
    }

    addQuote(quote) {
        const quoteWithId = {
            ...quote,
            id: 'HI' + Date.now(),
            timestamp: new Date().toISOString(),
            status: 'pending'
        };
        
        this.quotes.push(quoteWithId);
        this.saveQuotes();
        return quoteWithId;
    }

    getQuote(id) {
        return this.quotes.find(quote => quote.id === id);
    }

    getAllQuotes() {
        return this.quotes;
    }

    updateQuoteStatus(id, status) {
        const quote = this.quotes.find(q => q.id === id);
        if (quote) {
            quote.status = status;
            quote.updatedAt = new Date().toISOString();
            this.saveQuotes();
            return quote;
        }
        return null;
    }
}

const quoteDB = new QuoteDatabase();

// Premium calculation function
function calculatePremium(data) {
    let basePremium = 0;
    const propertyValue = parseInt(data.propertyValue) || 0;
    const contentsValue = parseInt(data.contentsValue) || 0;
    
    // Base calculation (0.3% to 0.7% of property value based on coverage)
    const coverageRates = {
        'basic': 0.003,
        'comprehensive': 0.005,
        'premium': 0.007
    };
    
    basePremium = propertyValue * (coverageRates[data.coverageType] || 0.005);
    
    // Add contents premium (0.2% to 0.4% of contents value)
    if (contentsValue > 0) {
        const contentsRate = data.coverageType === 'premium' ? 0.004 : 
                           data.coverageType === 'comprehensive' ? 0.003 : 0.002;
        basePremium += contentsValue * contentsRate;
    }
    
    // Property age factor
    const ageFactor = {
        '0-5': 0.9,
        '6-10': 1.0,
        '11-20': 1.1,
        '21-30': 1.2,
        '30+': 1.3
    };
    
    basePremium *= (ageFactor[data.propertyAge] || 1.0);
    
    // Property type factor
    const typeFactor = {
        'apartment': 0.8,
        'independent-house': 1.0,
        'villa': 1.2,
        'penthouse': 1.3,
        'row-house': 0.9
    };
    
    basePremium *= (typeFactor[data.propertyType] || 1.0);
    
    // Minimum premium
    const minPremium = 3000;
    
    return Math.max(Math.round(basePremium), minPremium);
}

// Routes

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Home Insurance API is running' });
});

// Submit home insurance quote request
app.post('/api/home-insurance-quote', async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            phone,
            propertyType,
            propertyAge,
            propertyValue,
            contentsValue,
            coverageType,
            additionalRequirements
        } = req.body;

        // Validation
        if (!firstName || !lastName || !email || !phone || !propertyType || 
            !propertyAge || !propertyValue || !coverageType) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields',
                errors: ['All required fields must be provided']
            });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email format',
                errors: ['Please provide a valid email address']
            });
        }

        // Phone validation
        const phoneRegex = /^[+]?[\d\s\-\(\)]{10,}$/;
        if (!phoneRegex.test(phone)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid phone format',
                errors: ['Please provide a valid phone number']
            });
        }

        // Property value validation
        const propValue = parseInt(propertyValue);
        if (propValue < 100000 || propValue > 100000000) {
            return res.status(400).json({
                success: false,
                message: 'Invalid property value',
                errors: ['Property value should be between ₹1,00,000 and ₹10,00,00,000']
            });
        }

        // Calculate estimated premium
        const estimatedPremium = calculatePremium(req.body);

        // Save quote to database
        const quote = quoteDB.addQuote({
            ...req.body,
            estimatedPremium,
            ipAddress: req.ip,
            userAgent: req.get('User-Agent')
        });

        // Send confirmation email to customer
        await sendCustomerConfirmation(quote);

        // Send notification email to company
        await sendCompanyNotification(quote);

        res.json({
            success: true,
            message: 'Quote request submitted successfully',
            quoteId: quote.id,
            estimatedPremium: estimatedPremium,
            data: {
                firstName: quote.firstName,
                lastName: quote.lastName,
                email: quote.email,
                coverageType: quote.coverageType
            }
        });

    } catch (error) {
        console.error('Error processing quote request:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            errors: ['Something went wrong. Please try again later.']
        });
    }
});

// Get quote status
app.get('/api/quote/:id', (req, res) => {
    try {
        const quote = quoteDB.getQuote(req.params.id);
        
        if (!quote) {
            return res.status(404).json({
                success: false,
                message: 'Quote not found'
            });
        }

        // Return limited information for security
        res.json({
            success: true,
            quote: {
                id: quote.id,
                status: quote.status,
                timestamp: quote.timestamp,
                estimatedPremium: quote.estimatedPremium,
                coverageType: quote.coverageType
            }
        });

    } catch (error) {
        console.error('Error fetching quote:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Admin route to get all quotes (add authentication in production)
app.get('/api/admin/quotes', (req, res) => {
    try {
        // In production, add authentication middleware here
        const quotes = quoteDB.getAllQuotes();
        res.json({
            success: true,
            quotes: quotes,
            total: quotes.length
        });
    } catch (error) {
        console.error('Error fetching quotes:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Update quote status (admin only)
app.put('/api/admin/quote/:id/status', (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['pending', 'contacted', 'quoted', 'converted', 'rejected'];
        
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status'
            });
        }

        const updatedQuote = quoteDB.updateQuoteStatus(req.params.id, status);
        
        if (!updatedQuote) {
            return res.status(404).json({
                success: false,
                message: 'Quote not found'
            });
        }

        res.json({
            success: true,
            message: 'Quote status updated successfully',
            quote: updatedQuote
        });

    } catch (error) {
        console.error('Error updating quote status:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Email functions
async function sendCustomerConfirmation(quote) {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER || 'noreply@saspolicyvaluehub.com',
            to: quote.email,
            subject: `Home Insurance Quote Request Confirmation - ${quote.id}`,
            html: generateCustomerEmailHTML(quote)
        };

        await emailTransporter.sendMail(mailOptions);
        console.log('Confirmation email sent to customer:', quote.email);
    } catch (error) {
        console.error('Error sending customer confirmation email:', error);
    }
}

async function sendCompanyNotification(quote) {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER || 'noreply@saspolicyvaluehub.com',
            to: process.env.COMPANY_EMAIL || 'quotes@saspolicyvaluehub.com',
            subject: `New Home Insurance Quote Request - ${quote.id}`,
            html: generateCompanyEmailHTML(quote)
        };

        await emailTransporter.sendMail(mailOptions);
        console.log('Notification email sent to company');
    } catch (error) {
        console.error('Error sending company notification email:', error);
    }
}

function generateCustomerEmailHTML(quote) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1e40af, #3b82f6); color: white; padding: 20px; text-align: center; }
            .content { background: white; padding: 30px; border: 1px solid #e2e8f0; }
            .quote-details { background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #64748b; }
            .premium-highlight { background: linear-gradient(45deg, #f59e0b, #d97706); color: white; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>SAS Policy Value Hub Services</h1>
                <p>Home Insurance Quote Confirmation</p>
            </div>
            <div class="content">
                <h2>Dear ${quote.firstName} ${quote.lastName},</h2>
                <p>Thank you for your interest in our home insurance services. We have received your quote request and our team will contact you within 24 hours.</p>
                
                <div class="quote-details">
                    <h3>Quote Details:</h3>
                    <p><strong>Quote ID:</strong> ${quote.id}</p>
                    <p><strong>Property Type:</strong> ${quote.propertyType}</p>
                    <p><strong>Coverage Type:</strong> ${quote.coverageType}</p>
                    <p><strong>Property Value:</strong> ₹${parseInt(quote.propertyValue).toLocaleString('en-IN')}</p>
                    ${quote.contentsValue ? `<p><strong>Contents Value:</strong> ₹${parseInt(quote.contentsValue).toLocaleString('en-IN')}</p>` : ''}
                    <p><strong>Property Age:</strong> ${quote.propertyAge} years</p>
                </div>

                <div class="premium-highlight">
                    <h3>Estimated Annual Premium: ₹${quote.estimatedPremium.toLocaleString('en-IN')}</h3>
                    <p>This is a preliminary estimate. Final premium may vary based on detailed assessment.</p>
                </div>

                <h3>What happens next?</h3>
                <ul>
                    <li>Our home insurance expert will call you within 24 hours</li>
                    <li>We'll discuss your specific requirements in detail</li>
                    <li>You'll receive a personalized quote with multiple options</li>
                    <li>We'll help you compare and choose the best policy</li>
                </ul>

                <p>If you have any immediate questions, please don't hesitate to contact us:</p>
                <p><strong>Phone:</strong> +91 98765 43210<br>
                <strong>Email:</strong> homeinsurance@saspolicyvaluehub.com<br>
                <strong>WhatsApp:</strong> +91 92891 22401</p>

                <p>Best regards,<br>
                SAS Policy Value Hub Services Team</p>
            </div>
            <div class="footer">
                <p>&copy; 2025 SAS Policy Value Hub Services Pvt Ltd. All rights reserved.</p>
                <p>This is an automated email. Please do not reply to this email address.</p>
            </div>
        </div>
    </body>
    </html>
    `;
}

function generateCompanyEmailHTML(quote) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1e40af, #3b82f6); color: white; padding: 20px; text-align: center; }
            .content { background: white; padding: 30px; border: 1px solid #e2e8f0; }
            .quote-details { background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .urgent { background: #fee2e2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; }
            .customer-info { background: #e0f2fe; padding: 15px; border-radius: 8px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>New Home Insurance Quote Request</h1>
                <p>Quote ID: ${quote.id}</p>
            </div>
            <div class="content">
                <div class="urgent">
                    <h3>⚡ Action Required</h3>
                    <p>A new home insurance quote request has been submitted. Please contact the customer within 24 hours.</p>
                </div>

                <div class="customer-info">
                    <h3>Customer Information:</h3>
                    <p><strong>Name:</strong> ${quote.firstName} ${quote.lastName}</p>
                    <p><strong>Email:</strong> ${quote.email}</p>
                    <p><strong>Phone:</strong> ${quote.phone}</p>
                    <p><strong>Submitted:</strong> ${new Date(quote.timestamp).toLocaleString('en-IN')}</p>
                </div>

                <div class="quote-details">
                    <h3>Property Details:</h3>
                    <p><strong>Property Type:</strong> ${quote.propertyType}</p>
                    <p><strong>Property Age:</strong> ${quote.propertyAge} years</p>
                    <p><strong>Property Value:</strong> ₹${parseInt(quote.propertyValue).toLocaleString('en-IN')}</p>
                    ${quote.contentsValue ? `<p><strong>Contents Value:</strong> ₹${parseInt(quote.contentsValue).toLocaleString('en-IN')}</p>` : '<p><strong>Contents Value:</strong> Not specified</p>'}
                    <p><strong>Coverage Type:</strong> ${quote.coverageType}</p>
                    <p><strong>Estimated Premium:</strong> ₹${quote.estimatedPremium.toLocaleString('en-IN')} per year</p>
                </div>

                ${quote.additionalRequirements ? `
                <div class="quote-details">
                    <h3>Additional Requirements:</h3>
                    <p>${quote.additionalRequirements}</p>
                </div>
                ` : ''}

                <div class="quote-details">
                    <h3>Technical Information:</h3>
                    <p><strong>IP Address:</strong> ${quote.ipAddress || 'Not captured'}</p>
                    <p><strong>User Agent:</strong> ${quote.userAgent || 'Not captured'}</p>
                    <p><strong>Quote Status:</strong> ${quote.status}</p>
                </div>

                <h3>Recommended Next Steps:</h3>
                <ol>
                    <li>Call the customer within 2 hours if possible</li>
                    <li>Send SMS confirmation with quote ID</li>
                    <li>Prepare detailed quote based on requirements</li>
                    <li>Schedule property assessment if needed</li>
                    <li>Follow up within 3 days if no response</li>
                </ol>

                <p><strong>Priority Level:</strong> 
                ${parseInt(quote.propertyValue) > 5000000 ? 'HIGH (Property value > 50L)' : 
                  parseInt(quote.propertyValue) > 2000000 ? 'MEDIUM (Property value > 20L)' : 'NORMAL'}
                </p>
            </div>
        </div>
    </body>
    </html>
    `;
}

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        errors: ['Something went wrong. Please try again later.']
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🏠 Home Insurance API Server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log(`📧 Make sure to set EMAIL_USER and EMAIL_PASS environment variables`);
    console.log(`🔧 Admin panel: http://localhost:${PORT}/api/admin/quotes`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    process.exit(0);
});

module.exports = app;