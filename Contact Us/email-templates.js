// Email template utility functions
const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

// Contact form confirmation email to customer
const sendContactConfirmationEmail = (contact) => {
    const subjectMap = {
        general: 'General Inquiry',
        quote: 'Quote Request',
        policy: 'Policy Information',
        claim: 'Claim Support',
        complaint: 'Complaint/Feedback',
        partnership: 'Partnership Inquiry'
    };

    const insuranceTypeMap = {
        health: 'Health Insurance',
        life: 'Life Insurance',
        motor: 'Motor Insurance',
        travel: 'Travel Insurance',
        home: 'Home Insurance',
        multiple: 'Multiple Insurance Policies'
    };

    return {
        from: '"SAS Policy Value Hub Services" <noreply@saspolicyvaluehub.com>',
        to: contact.email,
        subject: 'Thank you for contacting SAS Policy Value Hub Services',
        html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Contact Confirmation</title>
                <style>
                    body {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        line-height: 1.6;
                        color: #333;
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                        background-color: #f8fafc;
                    }
                    .container {
                        background: white;
                        border-radius: 20px;
                        padding: 40px;
                        box-shadow: 0 10px 40px rgba(0,0,0,0.08);
                    }
                    .header {
                        text-align: center;
                        margin-bottom: 40px;
                        padding-bottom: 20px;
                        border-bottom: 3px solid #3b82f6;
                    }
                    .logo {
                        font-size: 24px;
                        font-weight: bold;
                        color: #1e40af;
                        margin-bottom: 10px;
                    }
                    .tagline {
                        color: #64748b;
                        font-size: 14px;
                    }
                    .content h2 {
                        color: #1e293b;
                        margin-bottom: 20px;
                    }
                    .info-table {
                        background: #f8fafc;
                        border-radius: 10px;
                        padding: 20px;
                        margin: 20px 0;
                    }
                    .info-row {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 10px;
                        border-bottom: 1px solid #e2e8f0;
                        padding-bottom: 10px;
                    }
                    .info-row:last-child {
                        border-bottom: none;
                        margin-bottom: 0;
                    }
                    .info-label {
                        font-weight: 600;
                        color: #374151;
                    }
                    .info-value {
                        color: #64748b;
                    }
                    .message-box {
                        background: #eff6ff;
                        border-left: 4px solid #3b82f6;
                        padding: 15px;
                        margin: 20px 0;
                        border-radius: 0 8px 8px 0;
                    }
                    .next-steps {
                        background: #f0fdf4;
                        border-radius: 10px;
                        padding: 20px;
                        margin: 30px 0;
                        border-left: 4px solid #10b981;
                    }
                    .contact-info {
                        background: #fef3c7;
                        border-radius: 10px;
                        padding: 20px;
                        margin: 30px 0;
                        text-align: center;
                    }
                    .footer {
                        text-align: center;
                        margin-top: 40px;
                        padding-top: 20px;
                        border-top: 1px solid #e2e8f0;
                        font-size: 12px;
                        color: #64748b;
                    }
                    .button {
                        display: inline-block;
                        background: linear-gradient(45deg, #1e40af, #3b82f6);
                        color: white;
                        padding: 12px 24px;
                        text-decoration: none;
                        border-radius: 25px;
                        font-weight: 600;
                        margin: 10px 0;
                    }
                    @media (max-width: 600px) {
                        body { padding: 10px; }
                        .container { padding: 20px; }
                        .info-row { flex-direction: column; }
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <div class="logo">🛡️ SAS Policy Value Hub Services</div>
                        <div class="tagline">Your Security, Our Commitment</div>
                    </div>
                    
                    <div class="content">
                        <h2>Thank you for contacting us, ${contact.firstName}!</h2>
                        
                        <p>We have received your message and appreciate you taking the time to reach out to us. Our team of insurance experts will review your inquiry and get back to you as soon as possible.</p>
                        
                        <div class="info-table">
                            <div class="info-row">
                                <span class="info-label">Name:</span>
                                <span class="info-value">${contact.firstName} ${contact.lastName}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Email:</span>
                                <span class="info-value">${contact.email}</span>
                            </div>
                            ${contact.phone ? `
                            <div class="info-row">
                                <span class="info-label">Phone:</span>
                                <span class="info-value">${contact.phone}</span>
                            </div>
                            ` : ''}
                            <div class="info-row">
                                <span class="info-label">Subject:</span>
                                <span class="info-value">${subjectMap[contact.subject] || contact.subject}</span>
                            </div>
                            ${contact.insuranceType ? `
                            <div class="info-row">
                                <span class="info-label">Insurance Type:</span>
                                <span class="info-value">${insuranceTypeMap[contact.insuranceType] || contact.insuranceType}</span>
                            </div>
                            ` : ''}
                            <div class="info-row">
                                <span class="info-label">Submitted:</span>
                                <span class="info-value">${formatDate(contact.createdAt)}</span>
                            </div>
                        </div>
                        
                        <div class="message-box">
                            <strong>Your Message:</strong><br>
                            ${contact.message}
                        </div>
                        
                        <div class="next-steps">
                            <h3 style="color: #059669; margin-top: 0;">What happens next?</h3>
                            <ul style="margin: 0; padding-left: 20px;">
                                <li>Our expert team will review your inquiry within 24 hours</li>
                                <li>We'll reach out to you via your preferred contact method</li>
                                <li>If you requested a quote, we'll provide personalized recommendations</li>
                                <li>Our team will guide you through the entire process</li>
                            </ul>
                        </div>
                        
                        <div class="contact-info">
                            <h3 style="color: #d97706; margin-top: 0;">Need immediate assistance?</h3>
                            <p><strong>📞 Phone:</strong> +91 98765 43210<br>
                            <strong>✉️ Email:</strong> support@saspolicyvaluehub.com<br>
                            <strong>🕒 Business Hours:</strong> Mon-Fri 9AM-7PM, Sat 10AM-5PM</p>
                        </div>
                        
                        ${contact.newsletter ? `
                        <p style="color: #059669;"><strong>✅ Newsletter Subscription:</strong> You've been subscribed to our newsletter for insurance tips and updates.</p>
                        ` : ''}
                    </div>
                    
                    <div class="footer">
                        <p>This is an automated confirmation email. Please do not reply to this email.</p>
                        <p>&copy; 2024 SAS Policy Value Hub Services Pvt Ltd. All rights reserved.</p>
                        <p>123 Business Center, Insurance District, New Delhi, India 110001</p>
                    </div>
                </div>
            </body>
            </html>
        `,
        text: `
            Thank you for contacting SAS Policy Value Hub Services!
            
            Dear ${contact.firstName},
            
            We have received your message and will get back to you within 24 hours.
            
            Your Details:
            - Name: ${contact.firstName} ${contact.lastName}
            - Email: ${contact.email}
            ${contact.phone ? `- Phone: ${contact.phone}` : ''}
            - Subject: ${subjectMap[contact.subject] || contact.subject}
            ${contact.insuranceType ? `- Insurance Type: ${insuranceTypeMap[contact.insuranceType] || contact.insuranceType}` : ''}
            - Submitted: ${formatDate(contact.createdAt)}
            
            Your Message:
            ${contact.message}
            
            For immediate assistance:
            Phone: +91 98765 43210
            Email: support@saspolicyvaluehub.com
            
            Best regards,
            SAS Policy Value Hub Services Team
        `
    };
};

// Contact form notification email to admin
const sendContactNotificationEmail = (contact) => {
    const subjectMap = {
        general: 'General Inquiry',
        quote: 'Quote Request',
        policy: 'Policy Information',
        claim: 'Claim Support',
        complaint: 'Complaint/Feedback',
        partnership: 'Partnership Inquiry'
    };

    return {
        from: '"SAS Contact System" <system@saspolicyvaluehub.com>',
        to: process.env.ADMIN_EMAIL || 'admin@saspolicyvaluehub.com',
        subject: `New Contact: ${subjectMap[contact.subject]} from ${contact.firstName} ${contact.lastName}`,
        html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>New Contact Submission</title>
                <style>
                    body {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        line-height: 1.6;
                        color: #333;
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                        background-color: #f8fafc;
                    }
                    .container {
                        background: white;
                        border-radius: 15px;
                        padding: 30px;
                        box-shadow: 0 8px 30px rgba(0,0,0,0.1);
                    }
                    .header {
                        background: linear-gradient(135deg, #1e40af, #3b82f6);
                        color: white;
                        padding: 20px;
                        border-radius: 10px;
                        text-align: center;
                        margin-bottom: 30px;
                    }
                    .priority-high {
                        border-left: 5px solid #dc2626;
                        background: #fef2f2;
                        padding: 15px;
                        margin: 20px 0;
                        border-radius: 0 8px 8px 0;
                    }
                    .contact-details {
                        background: #f8fafc;
                        border-radius: 10px;
                        padding: 20px;
                        margin: 20px 0;
                    }
                    .detail-row {
                        margin-bottom: 10px;
                        padding-bottom: 8px;
                        border-bottom: 1px solid #e2e8f0;
                    }
                    .detail-row:last-child {
                        border-bottom: none;
                        margin-bottom: 0;
                    }
                    .label {
                        font-weight: 600;
                        color: #374151;
                        display: inline-block;
                        min-width: 120px;
                    }
                    .value {
                        color: #64748b;
                    }
                    .message-box {
                        background: #f0f9ff;
                        border: 1px solid #0ea5e9;
                        border-radius: 8px;
                        padding: 15px;
                        margin: 20px 0;
                    }
                    .actions {
                        text-align: center;
                        margin: 30px 0;
                    }
                    .button {
                        display: inline-block;
                        background: linear-gradient(45deg, #1e40af, #3b82f6);
                        color: white;
                        padding: 12px 24px;
                        text-decoration: none;
                        border-radius: 25px;
                        font-weight: 600;
                        margin: 5px;
                    }
                    .technical-info {
                        background: #f1f5f9;
                        border-radius: 8px;
                        padding: 15px;
                        margin-top: 20px;
                        font-size: 12px;
                        color: #64748b;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h2>🔔 New Contact Submission</h2>
                        <p>Received: ${formatDate(contact.createdAt)}</p>
                    </div>
                    
                    ${['complaint', 'claim'].includes(contact.subject) ? `
                    <div class="priority-high">
                        <strong>⚠️ HIGH PRIORITY:</strong> This is a ${contact.subject} inquiry and requires immediate attention.
                    </div>
                    ` : ''}
                    
                    <div class="contact-details">
                        <div class="detail-row">
                            <span class="label">Name:</span>
                            <span class="value">${contact.firstName} ${contact.lastName}</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Email:</span>
                            <span class="value"><a href="mailto:${contact.email}">${contact.email}</a></span>
                        </div>
                        ${contact.phone ? `
                        <div class="detail-row">
                            <span class="label">Phone:</span>
                            <span class="value"><a href="tel:${contact.phone}">${contact.phone}</a></span>
                        </div>
                        ` : ''}
                        <div class="detail-row">
                            <span class="label">Subject:</span>
                            <span class="value">${subjectMap[contact.subject] || contact.subject}</span>
                        </div>
                        ${contact.insuranceType ? `
                        <div class="detail-row">
                            <span class="label">Insurance Type:</span>
                            <span class="value">${contact.insuranceType}</span>
                        </div>
                        ` : ''}
                        <div class="detail-row">
                            <span class="label">Newsletter:</span>
                            <span class="value">${contact.newsletter ? 'Yes' : 'No'}</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Status:</span>
                            <span class="value">${contact.status}</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Contact ID:</span>
                            <span class="value">${contact._id}</span>
                        </div>
                    </div>
                    
                    <div class="message-box">
                        <strong>Message:</strong><br>
                        ${contact.message}
                    </div>
                    
                    <div class="actions">
                        <a href="mailto:${contact.email}" class="button">Reply via Email</a>
                        ${contact.phone ? `<a href="tel:${contact.phone}" class="button">Call Customer</a>` : ''}
                    </div>
                    
                    <div class="technical-info">
                        <strong>Technical Details:</strong><br>
                        IP Address: ${contact.ipAddress || 'Not available'}<br>
                        User Agent: ${contact.userAgent ? contact.userAgent.substring(0, 100) + '...' : 'Not available'}
                    </div>
                </div>
            </body>
            </html>
        `,
        text: `
            New Contact Submission - ${subjectMap[contact.subject]}
            
            From: ${contact.firstName} ${contact.lastName}
            Email: ${contact.email}
            Phone: ${contact.phone || 'Not provided'}
            Subject: ${subjectMap[contact.subject] || contact.subject}
            Insurance Type: ${contact.insuranceType || 'Not specified'}
            Submitted: ${formatDate(contact.createdAt)}
            
            Message:
            ${contact.message}
            
            Contact ID: ${contact._id}
            IP Address: ${contact.ipAddress}
        `
    };
};

// Quote confirmation email to customer
const sendQuoteConfirmationEmail = (quote) => {
    const insuranceTypeMap = {
        health: 'Health Insurance',
        life: 'Life Insurance',
        motor: 'Motor Insurance',
        travel: 'Travel Insurance',
        home: 'Home Insurance'
    };

    return {
        from: '"SAS Policy Value Hub Services" <noreply@saspolicyvaluehub.com>',
        to: quote.email,
        subject: `Quote Request Confirmed - Reference: ${quote.quoteReference}`,
        html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Quote Request Confirmation</title>
                <style>
                    body {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        line-height: 1.6;
                        color: #333;
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                        background-color: #f8fafc;
                    }
                    .container {
                        background: white;
                        border-radius: 20px;
                        padding: 40px;
                        box-shadow: 0 10px 40px rgba(0,0,0,0.08);
                    }
                    .header {
                        text-align: center;
                        margin-bottom: 40px;
                    }
                    .quote-ref {
                        background: linear-gradient(45deg, #f59e0b, #d97706);
                        color: white;
                        padding: 15px 25px;
                        border-radius: 50px;
                        font-weight: bold;
                        font-size: 18px;
                        display: inline-block;
                        margin: 20px 0;
                    }
                    .quote-details {
                        background: #f8fafc;
                        border-radius: 15px;
                        padding: 25px;
                        margin: 25px 0;
                    }
                    .detail-grid {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 15px;
                        margin: 20px 0;
                    }
                    .detail-item {
                        background: white;
                        padding: 15px;
                        border-radius: 10px;
                        border-left: 4px solid #3b82f6;
                    }
                    .detail-label {
                        font-size: 12px;
                        color: #64748b;
                        text-transform: uppercase;
                        margin-bottom: 5px;
                    }
                    .detail-value {
                        font-weight: 600;
                        color: #1e293b;
                    }
                    .timeline {
                        background: #f0fdf4;
                        border-radius: 15px;
                        padding: 25px;
                        margin: 30px 0;
                        border-left: 4px solid #10b981;
                    }
                    .timeline-item {
                        display: flex;
                        align-items: center;
                        margin-bottom: 15px;
                    }
                    .timeline-icon {
                        width: 30px;
                        height: 30px;
                        background: #10b981;
                        border-radius: 50%;
                        color: white;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin-right: 15px;
                        font-weight: bold;
                    }
                    .contact-section {
                        background: #fef3c7;
                        border-radius: 15px;
                        padding: 25px;
                        text-align: center;
                        margin: 30px 0;
                    }
                    .footer {
                        text-align: center;
                        margin-top: 40px;
                        padding-top: 20px;
                        border-top: 1px solid #e2e8f0;
                        font-size: 12px;
                        color: #64748b;
                    }
                    @media (max-width: 600px) {
                        body { padding: 10px; }
                        .container { padding: 20px; }
                        .detail-grid { grid-template-columns: 1fr; }
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1 style="color: #1e40af; margin-bottom: 10px;">🎉 Quote Request Received!</h1>
                        <p style="color: #64748b; font-size: 16px;">Thank you for choosing SAS Policy Value Hub Services</p>
                        <div class="quote-ref">Reference: ${quote.quoteReference}</div>
                    </div>
                    
                    <div class="quote-details">
                        <h3 style="color: #1e293b; margin-bottom: 20px;">Your Quote Details</h3>
                        
                        <div class="detail-grid">
                            <div class="detail-item">
                                <div class="detail-label">Name</div>
                                <div class="detail-value">${quote.name}</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Insurance Type</div>
                                <div class="detail-value">${insuranceTypeMap[quote.insuranceType]}</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Email</div>
                                <div class="detail-value">${quote.email}</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Phone</div>
                                <div class="detail-value">${quote.phone}</div>
                            </div>
                            ${quote.age ? `
                            <div class="detail-item">
                                <div class="detail-label">Age</div>
                                <div class="detail-value">${quote.age} years</div>
                            </div>
                            ` : ''}
                            <div class="detail-item">
                                <div class="detail-label">Submitted</div>
                                <div class="detail-value">${formatDate(quote.createdAt)}</div>
                            </div>
                        </div>
                        
                        ${quote.requirements ? `
                        <div style="background: #eff6ff; padding: 15px; border-radius: 10px; margin-top: 20px;">
                            <div class="detail-label">Your Requirements</div>
                            <div class="detail-value">${quote.requirements}</div>
                        </div>
                        ` : ''}
                    </div>
                    
                    <div class="timeline">
                        <h3 style="color: #059669; margin-top: 0;">What happens next?</h3>
                        <div class="timeline-item">
                            <div class="timeline-icon">1</div>
                            <div>
                                <strong>Analysis & Review</strong><br>
                                Our experts analyze your requirements and compare policies from leading insurers
                            </div>
                        </div>
                        <div class="timeline-item">
                            <div class="timeline-icon">2</div>
                            <div>
                                <strong>Personalized Quote</strong><br>
                                We'll prepare a detailed quote with the best coverage options for your needs
                            </div>
                        </div>
                        <div class="timeline-item">
                            <div class="timeline-icon">3</div>
                            <div>
                                <strong>Expert Consultation</strong><br>
                                Our insurance advisor will contact you to discuss the quote and answer questions
                            </div>
                        </div>
                        <div class="timeline-item" style="margin-bottom: 0;">
                            <div class="timeline-icon">4</div>
                            <div>
                                <strong>Policy Purchase</strong><br>
                                Complete the application process and get your policy documents
                            </div>
                        </div>
                    </div>
                    
                    <div class="contact-section">
                        <h3 style="color: #d97706; margin-top: 0;">Questions? We're here to help!</h3>
                        <p><strong>📞 Direct Line:</strong> +91 98765 43210<br>
                        <strong>✉️ Email:</strong> quotes@saspolicyvaluehub.com<br>
                        <strong>💬 WhatsApp:</strong> +91 98765 43210</p>
                        <p style="font-size: 14px; color: #64748b; margin-top: 15px;">
                            Reference your quote number <strong>${quote.quoteReference}</strong> when contacting us
                        </p>
                    </div>
                </div>
                
                <div class="footer">
                    <p>This is an automated confirmation. Please save this email for your records.</p>
                    <p>&copy; 2024 SAS Policy Value Hub Services Pvt Ltd. All rights reserved.</p>
                </div>
            </body>
            </html>
        `,
        text: `
            Quote Request Confirmed - SAS Policy Value Hub Services
            
            Reference Number: ${quote.quoteReference}
            
            Dear ${quote.name},
            
            Thank you for your quote request! We've received your information and our expert team will prepare a personalized quote for you.
            
            Your Details:
            - Name: ${quote.name}
            - Email: ${quote.email}
            - Phone: ${quote.phone}
            - Insurance Type: ${insuranceTypeMap[quote.insuranceType]}
            ${quote.age ? `- Age: ${quote.age} years` : ''}
            - Submitted: ${formatDate(quote.createdAt)}
            
            ${quote.requirements ? `Requirements: ${quote.requirements}` : ''}
            
            What's Next:
            1. Our experts will analyze your requirements
            2. We'll prepare a personalized quote with best options
            3. Our advisor will contact you to discuss the quote
            4. Complete the application and get your policy
            
            Contact us anytime:
            Phone: +91 98765 43210
            Email: quotes@saspolicyvaluehub.com
            Reference: ${quote.quoteReference}
            
            Best regards,
            SAS Policy Value Hub Services Team
        `
    };
};

// Quote notification email to admin
const sendQuoteNotificationEmail = (quote) => {
    const insuranceTypeMap = {
        health: 'Health Insurance',
        life: 'Life Insurance',
        motor: 'Motor Insurance',
        travel: 'Travel Insurance',
        home: 'Home Insurance'
    };

    return {
        from: '"SAS Quote System" <system@saspolicyvaluehub.com>',
        to: process.env.QUOTE_EMAIL || 'quotes@saspolicyvaluehub.com',
        subject: `New Quote Request: ${insuranceTypeMap[quote.insuranceType]} - ${quote.name}`,
        html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>New Quote Request</title>
                <style>
                    body {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        line-height: 1.6;
                        color: #333;
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                        background-color: #f8fafc;
                    }
                    .container {
                        background: white;
                        border-radius: 15px;
                        padding: 30px;
                        box-shadow: 0 8px 30px rgba(0,0,0,0.1);
                    }
                    .header {
                        background: linear-gradient(135deg, #f59e0b, #d97706);
                        color: white;
                        padding: 25px;
                        border-radius: 10px;
                        text-align: center;
                        margin-bottom: 30px;
                    }
                    .quote-ref {
                        background: #1e40af;
                        color: white;
                        padding: 10px 20px;
                        border-radius: 25px;
                        font-weight: bold;
                        display: inline-block;
                        margin: 10px 0;
                    }
                    .priority-indicator {
                        padding: 10px 15px;
                        border-radius: 8px;
                        margin: 15px 0;
                        font-weight: 600;
                    }
                    .priority-high { background: #fef2f2; color: #dc2626; border-left: 4px solid #dc2626; }
                    .priority-medium { background: #fef3c7; color: #d97706; border-left: 4px solid #d97706; }
                    .priority-low { background: #f0fdf4; color: #059669; border-left: 4px solid #059669; }
                    .customer-details {
                        background: #f8fafc;
                        border-radius: 10px;
                        padding: 20px;
                        margin: 20px 0;
                    }
                    .detail-row {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 10px;
                        padding-bottom: 8px;
                        border-bottom: 1px solid #e2e8f0;
                    }
                    .detail-row:last-child { border-bottom: none; margin-bottom: 0; }
                    .label {
                        font-weight: 600;
                        color: #374151;
                        min-width: 120px;
                    }
                    .value {
                        color: #64748b;
                        text-align: right;
                    }
                    .requirements-box {
                        background: #f0f9ff;
                        border: 1px solid #0ea5e9;
                        border-radius: 8px;
                        padding: 15px;
                        margin: 20px 0;
                    }
                    .actions {
                        text-align: center;
                        margin: 30px 0;
                    }
                    .button {
                        display: inline-block;
                        background: linear-gradient(45deg, #1e40af, #3b82f6);
                        color: white;
                        padding: 12px 24px;
                        text-decoration: none;
                        border-radius: 25px;
                        font-weight: 600;
                        margin: 5px;
                    }
                    .technical-info {
                        background: #f1f5f9;
                        border-radius: 8px;
                        padding: 15px;
                        margin-top: 20px;
                        font-size: 12px;
                        color: #64748b;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h2>💰 New Quote Request</h2>
                        <div class="quote-ref">Reference: ${quote.quoteReference}</div>
                        <p>Received: ${formatDate(quote.createdAt)}</p>
                    </div>
                    
                    ${quote.age && quote.age >= 60 ? `
                    <div class="priority-indicator priority-high">
                        ⚠️ HIGH PRIORITY: Senior citizen (${quote.age} years) - Requires immediate attention
                    </div>
                    ` : quote.insuranceType === 'life' && quote.age >= 50 ? `
                    <div class="priority-indicator priority-medium">
                        📈 MEDIUM PRIORITY: Life insurance for mature customer (${quote.age} years)
                    </div>
                    ` : `
                    <div class="priority-indicator priority-low">
                        ✅ STANDARD PRIORITY: Regular quote request
                    </div>
                    `}
                    
                    <div class="customer-details">
                        <div class="detail-row">
                            <span class="label">Customer:</span>
                            <span class="value">${quote.name}</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Email:</span>
                            <span class="value"><a href="mailto:${quote.email}">${quote.email}</a></span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Phone:</span>
                            <span class="value"><a href="tel:${quote.phone}">${quote.phone}</a></span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Insurance Type:</span>
                            <span class="value">${insuranceTypeMap[quote.insuranceType]}</span>
                        </div>
                        ${quote.age ? `
                        <div class="detail-row">
                            <span class="label">Age:</span>
                            <span class="value">${quote.age} years</span>
                        </div>
                        ` : ''}
                        <div class="detail-row">
                            <span class="label">Status:</span>
                            <span class="value">${quote.status}</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Quote ID:</span>
                            <span class="value">${quote._id}</span>
                        </div>
                    </div>
                    
                    ${quote.requirements ? `
                    <div class="requirements-box">
                        <strong>Customer Requirements:</strong><br>
                        ${quote.requirements}
                    </div>
                    ` : ''}
                    
                    <div class="actions">
                        <a href="mailto:${quote.email}" class="button">Email Customer</a>
                        <a href="tel:${quote.phone}" class="button">Call Customer</a>
                    </div>
                    
                    <div class="technical-info">
                        <strong>Technical Details:</strong><br>
                        Reference: ${quote.quoteReference}<br>
                        IP Address: ${quote.ipAddress || 'Not available'}<br>
                        User Agent: ${quote.userAgent ? quote.userAgent.substring(0, 80) + '...' : 'Not available'}
                    </div>
                </div>
            </body>
            </html>
        `,
        text: `
            New Quote Request - ${insuranceTypeMap[quote.insuranceType]}
            
            Reference: ${quote.quoteReference}
            Customer: ${quote.name}
            Email: ${quote.email}
            Phone: ${quote.phone}
            Insurance Type: ${insuranceTypeMap[quote.insuranceType]}
            ${quote.age ? `Age: ${quote.age} years` : ''}
            Submitted: ${formatDate(quote.createdAt)}
            
            ${quote.requirements ? `Requirements:\n${quote.requirements}` : ''}
            
            Quote ID: ${quote._id}
            IP Address: ${quote.ipAddress}
            
            ${quote.age && quote.age >= 60 ? 'HIGH PRIORITY: Senior citizen customer' : ''}
        `
    };
};

module.exports = {
    sendContactConfirmationEmail,
    sendContactNotificationEmail,
    sendQuoteConfirmationEmail,
    sendQuoteNotificationEmail
};