const nodemailer = require('nodemailer');
require('dotenv').config();

// School configuration constants
const SCHOOL_CONFIG = {
    name: 'Marigold English Boarding School',
    shortName: 'Marigold English Boarding School',
    contactNumber: process.env.SCHOOL_PHONE || '082-520986',
    schoolHours: 'Sunday - Friday, 10:00 AM - 5:00 PM',
    email: process.env.EMAIL_USER || 'noreply@marigoldebs.edu.np',
    // Get first email from comma-separated list or use default
    contactAdminEmail: process.env.CONTACT_ADMIN_EMAILS ? 
        process.env.CONTACT_ADMIN_EMAILS.split(',')[0].trim() : 
        'info@marigoldebs.edu.np',
    // Get first email from comma-separated list or use default
    admissionAdminEmail: process.env.ADMISSION_ADMIN_EMAILS ? 
        process.env.ADMISSION_ADMIN_EMAILS.split(',')[0].trim() : 
        'admissions@marigoldebs.edu.np'
};

// Create transporter with connection pooling for better performance
const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_PORT) || 587,
        secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER, // Use environment variable
            pass: process.env.EMAIL_PASS   // Use environment variable
        },
        tls: {
            rejectUnauthorized: false
        },
        // Connection pooling for better performance
        pool: true,
        maxConnections: 5,
        maxMessages: 100,
        rateLimit: 14, // 14 emails per second max
        // Connection timeout settings
        connectionTimeout: 60000, // 60 seconds
        greetingTimeout: 30000,   // 30 seconds
        socketTimeout: 60000,     // 60 seconds
    });
};

// Send password reset email
const sendPasswordResetEmail = async (email, resetToken, resetUrl) => {
    try {
        const transporter = createTransporter();
        
        const mailOptions = {
            from: `"${SCHOOL_CONFIG.shortName}" <${SCHOOL_CONFIG.email}>`,
            to: email,
            subject: `Reset Your Password - ${SCHOOL_CONFIG.shortName}`,
            headers: {
                'X-Auto-Response-Suppress': 'All',
                'Precedence': 'bulk',
                'Auto-Submitted': 'auto-generated'
            },
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 24px;">${SCHOOL_CONFIG.name}</h1>
                        <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Password Reset Request</p>
                    </div>
                    
                    <div style="background: white; padding: 30px; border-radius: 10px; margin-top: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                        <h2 style="color: #333; margin-bottom: 20px;">Reset Your Password</h2>
                        
                        <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                            Hello,
                        </p>
                        
                        <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                            You requested to reset your password for the ${SCHOOL_CONFIG.name} admin panel.
                        </p>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${resetUrl}" 
                               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                                      color: white; 
                                      padding: 15px 30px; 
                                      text-decoration: none; 
                                      border-radius: 8px; 
                                      display: inline-block; 
                                      font-weight: bold;
                                      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);">
                                Reset Password
                            </a>
                        </div>
                        
                        <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                            This link will expire in 1 hour for security reasons.
                        </p>
                        
                        <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                            If you didn't request this password reset, please ignore this email.
                        </p>
                        
                        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                        
                        <p style="color: #999; font-size: 14px; text-align: center; margin: 0;">
                            Best regards,<br>
                            <strong>${SCHOOL_CONFIG.name} Team</strong>
                        </p>
                    </div>
                    
                    <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
                        <p>This is an automated email. Please do not reply to this message.</p>
                    </div>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Email sending failed:', error);
        return { success: false, error: error.message };
    }
};

// Send OTP email for password reset
const sendOTPEmail = async (email, otpCode) => {
    try {
        const transporter = createTransporter();
        
        const mailOptions = {
            from: `"${SCHOOL_CONFIG.shortName}" <${SCHOOL_CONFIG.email}>`,
            to: email,
            subject: `Password Reset OTP - ${SCHOOL_CONFIG.shortName}`,
            headers: {
                'X-Auto-Response-Suppress': 'All',
                'Precedence': 'bulk',
                'Auto-Submitted': 'auto-generated'
            },
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 24px;">${SCHOOL_CONFIG.name}</h1>
                        <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Password Reset Code</p>
                    </div>
                    
                    <div style="background: white; padding: 30px; border-radius: 10px; margin-top: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                        <h2 style="color: #333; margin-bottom: 20px;">Your Password Reset Code</h2>
                        
                        <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                            Hello,
                        </p>
                        
                        <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                            You requested to reset your password for the ${SCHOOL_CONFIG.name} admin panel. Use the following 6-digit code to reset your password:
                        </p>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <div style="background: #f8f9fa; border: 2px solid #e9ecef; border-radius: 12px; padding: 20px; display: inline-block;">
                                <div style="font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                                    ${otpCode}
                                </div>
                            </div>
                        </div>
                        
                        <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 20px 0;">
                            <p style="color: #856404; margin: 0; font-weight: bold;">⏰ This code will expire in 15 minutes</p>
                        </div>
                        
                        <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                            If you didn't request this password reset, please ignore this email and your password will remain unchanged.
                        </p>
                        
                        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                        
                        <p style="color: #999; font-size: 14px; text-align: center; margin: 0;">
                            Best regards,<br>
                            <strong>${SCHOOL_CONFIG.name} Team</strong>
                        </p>
                    </div>
                    
                    <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
                        <p>This is an automated email. Please do not reply to this message.</p>
                    </div>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('OTP email sent successfully:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('OTP email sending failed:', error);
        return { success: false, error: error.message };
    }
};

// Send test email
const sendTestEmail = async (email) => {
    try {
        const transporter = createTransporter();
        
        const mailOptions = {
            from: `"${SCHOOL_CONFIG.shortName}" <${SCHOOL_CONFIG.email}>`,
            to: email,
            subject: `Test Email - ${SCHOOL_CONFIG.shortName}`,
            headers: {
                'X-Auto-Response-Suppress': 'All',
                'Precedence': 'bulk',
                'Auto-Submitted': 'auto-generated'
            },
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 24px;">${SCHOOL_CONFIG.name}</h1>
                        <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Email Test Successful</p>
                    </div>
                    
                    <div style="background: white; padding: 30px; border-radius: 10px; margin-top: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                        <h2 style="color: #333; margin-bottom: 20px;">Email Configuration Working!</h2>
                        
                        <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                            Hello,
                        </p>
                        
                        <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                            This is a test email to confirm that the Gmail SMTP configuration is working correctly for the ${SCHOOL_CONFIG.name} website.
                        </p>
                        
                        <div style="background: #f0fff4; border: 1px solid #c6f6d5; padding: 15px; border-radius: 8px; margin: 20px 0;">
                            <p style="color: #2f855a; margin: 0; font-weight: bold;">✅ Email service is working properly!</p>
                        </div>
                        
                        <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                            You should now receive password reset emails when requested through the admin panel.
                        </p>
                        
                        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                        
                        <p style="color: #999; font-size: 14px; text-align: center; margin: 0;">
                            Best regards,<br>
                            <strong>${SCHOOL_CONFIG.name} Team</strong>
                        </p>
                    </div>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Test email sent successfully:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Test email sending failed:', error);
        return { success: false, error: error.message };
    }
};

// Send contact form notification to admins
const sendContactNotificationEmail = async (contactData) => {
    try {
        const transporter = createTransporter();
        
        // Get admin emails from environment
        const adminEmails = process.env.CONTACT_ADMIN_EMAILS ? 
            process.env.CONTACT_ADMIN_EMAILS.split(',').map(email => email.trim()) : 
            [process.env.EMAIL_USER];
        
        const mailOptions = {
            from: `"${SCHOOL_CONFIG.shortName} Contact Form" <${SCHOOL_CONFIG.email}>`,
            to: adminEmails.join(','),
            subject: `New Contact Form Submission - ${contactData.fullName}`,
            headers: {
                'X-Auto-Response-Suppress': 'All',
                'Precedence': 'bulk',
                'Auto-Submitted': 'auto-generated'
            },
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 24px;">${SCHOOL_CONFIG.name}</h1>
                        <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">New Contact Form Submission</p>
                    </div>
                    
                    <div style="background: white; padding: 30px; border-radius: 10px; margin-top: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                        <h2 style="color: #333; margin-bottom: 20px;">Contact Form Details</h2>
                        
                        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                            <h3 style="color: #495057; margin-top: 0;">Contact Information</h3>
                            <p style="margin: 8px 0; color: #666;"><strong>Name:</strong> ${contactData.fullName}</p>
                            <p style="margin: 8px 0; color: #666;"><strong>Email:</strong> <a href="mailto:${contactData.email}" style="color: #667eea;">${contactData.email}</a></p>
                            <p style="margin: 8px 0; color: #666;"><strong>Phone:</strong> ${contactData.countryCode} ${contactData.phone}</p>
                            <p style="margin: 8px 0; color: #666;"><strong>Submitted:</strong> ${new Date(contactData.createdAt).toLocaleString()}</p>
                        </div>
                        
                        <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                            <h3 style="color: #856404; margin-top: 0;">Message</h3>
                            <p style="color: #856404; line-height: 1.6; margin: 0; white-space: pre-wrap;">${contactData.message}</p>
                        </div>
                        
                        <div style="background: #e2e3e5; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                            <p style="color: #6c757d; margin: 0; font-size: 14px;">
                                <strong>Submission ID:</strong> ${contactData.id}<br>
                                <strong>Status:</strong> ${contactData.status}
                            </p>
                        </div>
                        
                        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                        
                        <p style="color: #999; font-size: 14px; text-align: center; margin: 0;">
                            This is an automated notification from the ${SCHOOL_CONFIG.name} contact form.<br>
                            Please respond to the user's inquiry as soon as possible.
                        </p>
                    </div>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Contact notification email sent successfully:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Contact notification email sending failed:', error);
        return { success: false, error: error.message };
    }
};

// Send auto-reply confirmation email to user
const sendContactAutoReplyEmail = async (contactData) => {
    try {
        const transporter = createTransporter();
        
        const mailOptions = {
            from: `"${SCHOOL_CONFIG.shortName}" <${SCHOOL_CONFIG.email}>`,
            to: contactData.email,
            subject: process.env.CONTACT_AUTO_REPLY_SUBJECT || `Thank you for contacting ${SCHOOL_CONFIG.shortName}`,
            headers: {
                'X-Auto-Response-Suppress': 'All',
                'Precedence': 'bulk',
                'Auto-Submitted': 'auto-generated'
            },
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 24px;">${SCHOOL_CONFIG.name}</h1>
                        <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Thank You for Contacting Us</p>
                    </div>
                    
                    <div style="background: white; padding: 30px; border-radius: 10px; margin-top: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                        <h2 style="color: #333; margin-bottom: 20px;">Thank You, ${contactData.fullName}!</h2>
                        
                        <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                            We have successfully received your message and truly appreciate you taking the time to reach out to us.
                        </p>
                        
                        <div style="background: #f0fff4; border: 1px solid #c6f6d5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <h3 style="color: #2f855a; margin-top: 0;">What happens next?</h3>
                            <ul style="color: #2f855a; line-height: 1.8; margin: 0; padding-left: 20px;">
                                <li>Our team will review your inquiry carefully</li>
                                <li>We will contact you soon with a detailed response</li>
                                <li>You can expect to hear from us within 24-48 hours</li>
                            </ul>
                        </div>
                        
                        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <h3 style="color: #495057; margin-top: 0;">Your Message Summary</h3>
                            <p style="margin: 8px 0; color: #666;"><strong>Submitted:</strong> ${new Date(contactData.createdAt).toLocaleString()}</p>
                            <p style="margin: 8px 0; color: #666;"><strong>Phone:</strong> ${contactData.countryCode} ${contactData.phone}</p>
                            <div style="margin-top: 15px;">
                                <p style="margin: 0; color: #666; font-weight: bold;">Your Message:</p>
                                <p style="margin: 8px 0 0 0; color: #666; font-style: italic; background: #fff; padding: 10px; border-radius: 4px; border-left: 3px solid #667eea;">"${contactData.message}"</p>
                            </div>
                        </div>
                        
                        <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <h3 style="color: #1976d2; margin-top: 0;">Need Immediate Assistance?</h3>
                            <p style="color: #1976d2; margin: 0; line-height: 1.6;">
                                If your inquiry is urgent, please feel free to call us directly at <strong>${SCHOOL_CONFIG.contactNumber}</strong> 
                                during school hours (${SCHOOL_CONFIG.schoolHours}).
                            </p>
                        </div>
                        
                        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                        
                        <p style="color: #999; font-size: 14px; text-align: center; margin: 0;">
                            Best regards,<br>
                            <strong>${SCHOOL_CONFIG.name} Team</strong><br>
                            <a href="mailto:${SCHOOL_CONFIG.contactAdminEmail}" style="color: #667eea;">${SCHOOL_CONFIG.contactAdminEmail}</a>
                        </p>
                    </div>
                    
                    <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
                        <p>This is an automated response. Please do not reply to this email.</p>
                    </div>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Contact auto-reply email sent successfully:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Contact auto-reply email sending failed:', error);
        return { success: false, error: error.message };
    }
};

// Send reply email to contact request
const sendContactReplyEmail = async (contactRequest, replyMessage) => {
    try {
        console.log('📧 sendContactReplyEmail called with:', {
            email: contactRequest.email,
            fullName: contactRequest.fullName,
            replyMessage: replyMessage
        });
        
        const transporter = createTransporter();
        
        const mailOptions = {
            from: `"${SCHOOL_CONFIG.shortName}" <${SCHOOL_CONFIG.email}>`,
            to: contactRequest.email,
            subject: `Re: Your inquiry to ${SCHOOL_CONFIG.name}`,
            headers: {
                'X-Auto-Response-Suppress': 'All',
                'Precedence': 'bulk',
                'Auto-Submitted': 'auto-generated'
            },
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 24px;">${SCHOOL_CONFIG.name}</h1>
                        <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Response to Your Inquiry</p>
                    </div>
                    
                    <div style="background: white; padding: 30px; border-radius: 10px; margin-top: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                        <h2 style="color: #333; margin-bottom: 20px;">Thank you for contacting us!</h2>
                        
                        <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                            Dear ${contactRequest.fullName},
                        </p>
                        
                        <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                            Thank you for reaching out to ${SCHOOL_CONFIG.name}. We have received your inquiry and are pleased to provide you with the following response:
                        </p>
                        
                        <div style="background: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0; border-radius: 0 8px 8px 0;">
                            <h3 style="color: #333; margin-top: 0; margin-bottom: 15px;">Our Response:</h3>
                            <div style="color: #555; line-height: 1.6; white-space: pre-wrap;">${replyMessage}</div>
                        </div>
                        
                        <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                            If you have any further questions or need additional information, please don't hesitate to contact us.
                        </p>
                        
                        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <h4 style="color: #333; margin-top: 0; margin-bottom: 10px;">Contact Information:</h4>
                            <p style="color: #666; margin: 5px 0;"><strong>Phone:</strong> ${SCHOOL_CONFIG.contactNumber}</p>
                            <p style="color: #666; margin: 5px 0;"><strong>Email:</strong> ${SCHOOL_CONFIG.contactAdminEmail}</p>
                            <p style="color: #666; margin: 5px 0;"><strong>School Hours:</strong> ${SCHOOL_CONFIG.schoolHours}</p>
                        </div>
                        
                        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                        
                        <p style="color: #999; font-size: 14px; text-align: center; margin: 0;">
                            Best regards,<br>
                            <strong>${SCHOOL_CONFIG.name} Team</strong>
                        </p>
                    </div>
                    
                    <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
                        <p>This is an automated response to your inquiry. Please do not reply to this email directly.</p>
                    </div>
                </div>
            `
        };

        console.log('📧 Sending email with options:', {
            from: mailOptions.from,
            to: mailOptions.to,
            subject: mailOptions.subject
        });
        
        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Contact reply email sent successfully:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Contact reply email sending failed:', error);
        return { success: false, error: error.message };
    }
};

// Send admission confirmation email to applicant
const sendAdmissionConfirmationEmail = async (applicationData) => {
    try {
        const transporter = createTransporter();
        
        const applicationNumber = String(applicationData.applicationNumber).padStart(6, '0');
        const studentName = `${applicationData.firstName} ${applicationData.lastName}`;
        
        const mailOptions = {
            from: `"${SCHOOL_CONFIG.shortName}" <${SCHOOL_CONFIG.email}>`,
            to: applicationData.guardianEmail,
            subject: `Admission Application Received - ${SCHOOL_CONFIG.shortName}`,
            headers: {
                'X-Auto-Response-Suppress': 'All',
                'Precedence': 'bulk',
                'Auto-Submitted': 'auto-generated'
            },
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 24px;">${SCHOOL_CONFIG.name}</h1>
                        <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Admission Application Confirmation</p>
                    </div>
                    
                    <div style="background: white; padding: 30px; border-radius: 10px; margin-top: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                        <h2 style="color: #333; margin-bottom: 20px;">Thank You for Your Application!</h2>
                        
                        <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                            Dear ${applicationData.guardianName},
                        </p>
                        
                        <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                            Thank you for submitting an admission application for <strong>${studentName}</strong> to ${SCHOOL_CONFIG.name}. 
                            We have successfully received your application and it is now under review.
                        </p>
                        
                        <div style="background: #f0fff4; border: 1px solid #c6f6d5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <h3 style="color: #2f855a; margin-top: 0;">Application Details</h3>
                            <p style="margin: 8px 0; color: #2f855a;"><strong>Application Number:</strong> APP${applicationNumber}</p>
                            <p style="margin: 8px 0; color: #2f855a;"><strong>Student Name:</strong> ${studentName}</p>
                            <p style="margin: 8px 0; color: #2f855a;"><strong>Grade Applied For:</strong> ${applicationData.gradeAppliedFor}</p>
                            <p style="margin: 8px 0; color: #2f855a;"><strong>Submitted On:</strong> ${new Date(applicationData.createdAt).toLocaleString()}</p>
                            <p style="margin: 8px 0; color: #2f855a;"><strong>Status:</strong> <span style="background: #ffd93d; color: #333; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: bold;">PENDING REVIEW</span></p>
                        </div>
                        
                        <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <h3 style="color: #1976d2; margin-top: 0;">What Happens Next?</h3>
                            <ul style="color: #1976d2; line-height: 1.8; margin: 0; padding-left: 20px;">
                                <li>Our admissions team will review your application within <strong>48-72 hours</strong></li>
                                <li>We will contact you via email or phone with the admission decision</li>
                                <li>If approved, we will send you further instructions for enrollment</li>
                                <li>You may be required to attend an interview or provide additional documents</li>
                            </ul>
                        </div>
                        
                        <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 20px 0;">
                            <p style="color: #856404; margin: 0;">
                                <strong>📝 Important:</strong> Please save your application number <strong>APP${applicationNumber}</strong> for future reference. 
                                You may need it when contacting our admissions office.
                            </p>
                        </div>
                        
                        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <h3 style="color: #495057; margin-top: 0;">Contact Information</h3>
                            <p style="color: #666; margin: 5px 0;"><strong>Admissions Office:</strong> ${SCHOOL_CONFIG.contactNumber}</p>
                            <p style="color: #666; margin: 5px 0;"><strong>Email:</strong> ${SCHOOL_CONFIG.admissionAdminEmail}</p>
                            <p style="color: #666; margin: 5px 0;"><strong>Office Hours:</strong> ${SCHOOL_CONFIG.schoolHours}</p>
                        </div>
                        
                        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                        
                        <p style="color: #999; font-size: 14px; text-align: center; margin: 0;">
                            Best regards,<br>
                            <strong>${SCHOOL_CONFIG.name} Admissions Team</strong><br>
                            <a href="mailto:${SCHOOL_CONFIG.admissionAdminEmail}" style="color: #667eea;">${SCHOOL_CONFIG.admissionAdminEmail}</a>
                        </p>
                    </div>
                    
                    <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
                        <p>This is an automated confirmation email. Please do not reply to this message.</p>
                        <p>If you have questions, please contact us at ${SCHOOL_CONFIG.contactNumber}</p>
                    </div>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Admission confirmation email sent successfully:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Admission confirmation email sending failed:', error);
        return { success: false, error: error.message };
    }
};

// Send admission notification to school admin
const sendAdmissionNotificationEmail = async (applicationData) => {
    try {
        const transporter = createTransporter();
        
        // Get admin emails from environment
        const adminEmails = process.env.ADMISSION_ADMIN_EMAILS ? 
            process.env.ADMISSION_ADMIN_EMAILS.split(',').map(email => email.trim()) : 
            [process.env.EMAIL_USER];
        
        const applicationNumber = String(applicationData.applicationNumber).padStart(6, '0');
        const studentName = `${applicationData.firstName} ${applicationData.lastName}`;
        
        const mailOptions = {
            from: `"${SCHOOL_CONFIG.shortName} Admissions" <${SCHOOL_CONFIG.email}>`,
            to: adminEmails.join(','),
            subject: `New Admission Application - ${studentName} (Grade ${applicationData.gradeAppliedFor})`,
            headers: {
                'X-Auto-Response-Suppress': 'All',
                'Precedence': 'bulk',
                'Auto-Submitted': 'auto-generated'
            },
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 24px;">${SCHOOL_CONFIG.name}</h1>
                        <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">New Admission Application Received</p>
                    </div>
                    
                    <div style="background: white; padding: 30px; border-radius: 10px; margin-top: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                        <h2 style="color: #333; margin-bottom: 20px;">New Application Notification</h2>
                        
                        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                            <h3 style="color: #495057; margin-top: 0;">Application Details</h3>
                            <p style="margin: 8px 0; color: #666;"><strong>Application Number:</strong> APP${applicationNumber}</p>
                            <p style="margin: 8px 0; color: #666;"><strong>Status:</strong> <span style="background: #ffd93d; color: #333; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: bold;">PENDING</span></p>
                            <p style="margin: 8px 0; color: #666;"><strong>Submitted:</strong> ${new Date(applicationData.createdAt).toLocaleString()}</p>
                        </div>
                        
                        <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                            <h3 style="color: #1976d2; margin-top: 0;">Student Information</h3>
                            <p style="margin: 8px 0; color: #1976d2;"><strong>Name:</strong> ${studentName}</p>
                            <p style="margin: 8px 0; color: #1976d2;"><strong>Date of Birth:</strong> ${new Date(applicationData.dateOfBirth).toLocaleDateString()}</p>
                            <p style="margin: 8px 0; color: #1976d2;"><strong>Gender:</strong> ${applicationData.gender}</p>
                            <p style="margin: 8px 0; color: #1976d2;"><strong>Grade Applied For:</strong> ${applicationData.gradeAppliedFor}</p>
                            ${applicationData.currentSchool ? `<p style="margin: 8px 0; color: #1976d2;"><strong>Current School:</strong> ${applicationData.currentSchool}</p>` : ''}
                        </div>
                        
                        <div style="background: #f0fff4; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                            <h3 style="color: #2f855a; margin-top: 0;">Parent/Guardian Information</h3>
                            <p style="margin: 8px 0; color: #2f855a;"><strong>Name:</strong> ${applicationData.guardianName}</p>
                            <p style="margin: 8px 0; color: #2f855a;"><strong>Email:</strong> <a href="mailto:${applicationData.guardianEmail}" style="color: #2f855a;">${applicationData.guardianEmail}</a></p>
                            <p style="margin: 8px 0; color: #2f855a;"><strong>Phone:</strong> ${applicationData.guardianPhone}</p>
                            ${applicationData.guardianOccupation ? `<p style="margin: 8px 0; color: #2f855a;"><strong>Occupation:</strong> ${applicationData.guardianOccupation}</p>` : ''}
                        </div>
                        
                        <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                            <h3 style="color: #856404; margin-top: 0;">Address</h3>
                            <p style="margin: 0; color: #856404;">
                                ${applicationData.addressLine}<br>
                                ${applicationData.city}${applicationData.state ? `, ${applicationData.state}` : ''}${applicationData.postalCode ? ` - ${applicationData.postalCode}` : ''}
                            </p>
                        </div>
                        
                        <div style="background: #e2e3e5; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                            <p style="color: #6c757d; margin: 0; font-size: 14px;">
                                <strong>Application ID:</strong> ${applicationData.id}<br>
                                <strong>Newsletter Consent:</strong> ${applicationData.newsletterConsent ? 'Yes' : 'No'}
                            </p>
                        </div>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <p style="color: #666; margin-bottom: 15px;">Please review this application in the admin panel</p>
                        </div>
                        
                        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                        
                        <p style="color: #999; font-size: 14px; text-align: center; margin: 0;">
                            This is an automated notification from the ${SCHOOL_CONFIG.name} admissions system.<br>
                            Please review and respond to the application within 48-72 hours.
                        </p>
                    </div>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Admission notification email sent to admin:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Admission notification email sending failed:', error);
        return { success: false, error: error.message };
    }
};

module.exports = {
    sendPasswordResetEmail,
    sendOTPEmail,
    sendTestEmail,
    sendContactNotificationEmail,
    sendContactAutoReplyEmail,
    sendContactReplyEmail,
    sendAdmissionConfirmationEmail,
    sendAdmissionNotificationEmail
};
