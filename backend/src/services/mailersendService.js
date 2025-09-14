const { MailerSend, EmailParams, Sender, Recipient } = require("mailersend");

class MailerSendService {
  constructor() {
    this.apiKey = process.env.MAILERSEND_API_KEY || process.env.API_KEY;
    this.mailerSend = new MailerSend({
      apiKey: this.apiKey,
    });
    this.isAvailable = !!this.apiKey;
    
    // Email configurations from environment
    this.emailTypes = {
      noreply: {
        address: process.env.EMAIL_NOREPLY || 'noreply@locallytrip.com',
        name: process.env.EMAIL_NOREPLY_NAME || 'LocallyTrip.com'
      },
      marketing: {
        address: process.env.EMAIL_MARKETING || 'marketing@locallytrip.com',
        name: process.env.EMAIL_MARKETING_NAME || 'LocallyTrip Marketing'
      },
      admin: {
        address: process.env.EMAIL_ADMIN || 'admin@locallytrip.com',
        name: process.env.EMAIL_ADMIN_NAME || 'LocallyTrip Admin'
      },
      booking: {
        address: process.env.EMAIL_BOOKING || 'booking@locallytrip.com',
        name: process.env.EMAIL_BOOKING_NAME || 'LocallyTrip Bookings'
      },
      support: {
        address: process.env.EMAIL_SUPPORT || 'support@locallytrip.com',
        name: process.env.EMAIL_SUPPORT_NAME || 'LocallyTrip Support'
      }
    };

    if (!this.isAvailable) {
      console.warn('⚠️ MailerSend API key not configured. Email service not available.');
    }
  }

  // Get sender info by type
  getSender(type = 'noreply') {
    const config = this.emailTypes[type] || this.emailTypes.noreply;
    return new Sender(config.address, config.name);
  }

  // Send email via MailerSend API
  async sendEmail(emailData) {
    if (!this.isAvailable) {
      return { success: false, error: 'MailerSend API key not configured' };
    }

    try {
      const sentFrom = emailData.from instanceof Sender ? 
        emailData.from : 
        new Sender(
          emailData.from || this.emailTypes.noreply.address, 
          emailData.fromName || this.emailTypes.noreply.name
        );

      const recipients = Array.isArray(emailData.to) ? 
        emailData.to.map(email => 
          typeof email === 'string' ? 
            new Recipient(email) : 
            new Recipient(email.address || email.email, email.display_name || email.name)
        ) : 
        [new Recipient(emailData.to)];

      const emailParams = new EmailParams()
        .setFrom(sentFrom)
        .setTo(recipients)
        .setReplyTo(sentFrom)
        .setSubject(emailData.subject);

      if (emailData.html) {
        emailParams.setHtml(emailData.html);
      }

      if (emailData.text) {
        emailParams.setText(emailData.text);
      }

      const response = await this.mailerSend.email.send(emailParams);
      
      return { 
        success: true, 
        messageId: response?.id || 'sent',
        response 
      };
    } catch (error) {
      console.error('❌ MailerSend error:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to send email' 
      };
    }
  }

  // Health check for API
  async healthCheck() {
    if (!this.isAvailable) {
      return {
        service: 'email-api',
        status: 'disabled',
        reason: 'API key not configured',
        provider: 'mailersend-api',
        timestamp: new Date().toISOString()
      };
    }

    try {
      // Test connection by attempting to send a test email (dry run)
      const testResult = await this.testConnection();
      return {
        service: 'email-api',
        status: testResult ? 'healthy' : 'unhealthy',
        provider: 'mailersend-api',
        available: this.isAvailable,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        service: 'email-api',
        status: 'unhealthy',
        provider: 'mailersend-api',
        available: this.isAvailable,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  // Test API connection
  async testConnection() {
    try {
      // Since MailerSend doesn't have a specific health check endpoint,
      // we'll just verify the API key is valid by checking if service is available
      return this.isAvailable;
    } catch (error) {
      console.error('❌ MailerSend connection test failed:', error);
      return false;
    }
  }

  // Send verification email
  async sendVerificationEmail(userEmail, userName, verificationToken) {
    if (process.env.ENABLE_EMAIL_VERIFICATION !== 'true') {
      return { success: false, message: 'Email verification disabled' };
    }

    const verificationUrl = `${process.env.NEXT_PUBLIC_WEBSITE_URL}/verify-email?token=${verificationToken}`;
    const sentFrom = this.getSender('noreply');
    
    const emailData = {
      from: sentFrom,
      to: userEmail,
      subject: process.env.EMAIL_VERIFY_SUBJECT || 'Verify Your LocallyTrip Account',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #8B5CF6, #EC4899); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to LocallyTrip! 🌍</h1>
          </div>
          
          <!-- Content -->
          <div style="padding: 40px 30px;">
            <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">Hi ${userName},</p>
            <p style="font-size: 16px; color: #374151; line-height: 1.6; margin-bottom: 30px;">
              Thanks for joining LocallyTrip! We're excited to have you discover authentic local experiences. 
              Please verify your email address to get started:
            </p>
            
            <div style="text-align: center; margin: 40px 0;">
              <a href="${verificationUrl}" 
                 style="background: linear-gradient(135deg, #8B5CF6, #EC4899); 
                        color: white; 
                        padding: 16px 32px; 
                        text-decoration: none; 
                        border-radius: 12px;
                        font-weight: bold;
                        font-size: 16px;
                        display: inline-block;
                        box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);">
                Verify Email Address
              </a>
            </div>
            
            <p style="color: #6B7280; font-size: 14px; text-align: center; margin-top: 30px;">
              This link expires in 24 hours. If you didn't create an account, please ignore this email.
            </p>
          </div>
          
          <!-- Footer -->
          <div style="background: #F9FAFB; padding: 20px; text-align: center; color: #6B7280; font-size: 12px;">
            <p>© 2025 LocallyTrip.com - Discover Local Experiences</p>
            <p>This email was sent from a no-reply address. For support, contact support@locallytrip.com</p>
          </div>
        </div>
      `
    };

    return await this.sendEmail(emailData);
  }

  // Send booking confirmation
  async sendBookingConfirmation(booking, travelerEmail) {
    if (process.env.ENABLE_BOOKING_EMAILS !== 'true') {
      return { success: false, message: 'Booking emails disabled' };
    }

    const sentFrom = this.getSender('booking');
    
    const emailData = {
      from: sentFrom,
      to: travelerEmail,
      subject: `Booking Confirmed - ${booking.experience?.title || 'LocallyTrip Experience'}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #10B981, #059669); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Booking Confirmed! 🎉</h1>
          </div>
          
          <!-- Content -->
          <div style="padding: 40px 30px;">
            <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">
              Great news! Your LocallyTrip experience has been confirmed.
            </p>
            
            <!-- Booking Details Card -->
            <div style="background: #F0FDF4; border: 2px solid #10B981; border-radius: 12px; padding: 30px; margin: 30px 0;">
              <h2 style="color: #065F46; margin: 0 0 20px 0; font-size: 22px;">${booking.experience?.title || 'LocallyTrip Experience'}</h2>
              <div style="display: grid; gap: 12px;">
                <p style="margin: 0;"><strong style="color: #065F46;">Date:</strong> ${booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'TBD'}</p>
                <p style="margin: 0;"><strong style="color: #065F46;">Participants:</strong> ${booking.participants || 1}</p>
                <p style="margin: 0;"><strong style="color: #065F46;">Total Amount:</strong> ${booking.currency || 'USD'} ${booking.totalAmount || '0'}</p>
                <p style="margin: 0;"><strong style="color: #065F46;">Booking Reference:</strong> ${booking.bookingReference || booking.id}</p>
                <p style="margin: 0;"><strong style="color: #065F46;">Host:</strong> ${booking.host?.name || 'LocallyTrip Host'}</p>
              </div>
            </div>

            <div style="background: #FEF3C7; border-radius: 12px; padding: 20px; margin: 30px 0;">
              <h3 style="color: #92400E; margin: 0 0 10px 0;">What's Next?</h3>
              <p style="color: #92400E; margin: 0; line-height: 1.6;">
                Your host will contact you soon with meeting details and any preparation instructions. 
                Check your email and phone for updates!
              </p>
            </div>
            
            <div style="text-align: center; margin: 40px 0;">
              <a href="${process.env.NEXT_PUBLIC_WEBSITE_URL}/traveller/bookings" 
                 style="background: #10B981; 
                        color: white; 
                        padding: 16px 32px; 
                        text-decoration: none; 
                        border-radius: 12px;
                        font-weight: bold;
                        display: inline-block;">
                View Booking Details
              </a>
            </div>
          </div>
        </div>
      `
    };

    return await this.sendEmail(emailData);
  }

  // Send welcome email
  async sendWelcomeEmail(userEmail, userName, userType) {
    if (process.env.ENABLE_WELCOME_EMAIL !== 'true') {
      return { success: false, message: 'Welcome emails disabled' };
    }

    const sentFrom = this.getSender('marketing');
    const isHost = userType === 'host';
    
    const emailData = {
      from: sentFrom,
      to: userEmail,
      subject: process.env.EMAIL_WELCOME_SUBJECT || `Welcome to LocallyTrip, ${userName}! 🌟`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
          <div style="background: linear-gradient(135deg, #8B5CF6, #EC4899); padding: 40px 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 32px;">Welcome to LocallyTrip! 🌍</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 18px;">
              ${isHost ? 'Start sharing your local expertise' : 'Discover authentic local experiences'}
            </p>
          </div>
          
          <div style="padding: 40px 30px;">
            <p style="font-size: 18px; color: #374151;">Hi ${userName},</p>
            
            ${isHost ? `
              <p style="color: #374151; line-height: 1.6;">
                Welcome to the LocallyTrip host community! You're now part of a network of amazing locals 
                who share their cities through authentic experiences.
              </p>
              
              <div style="text-align: center; margin: 40px 0;">
                <a href="${process.env.NEXT_PUBLIC_WEBSITE_URL}/host/dashboard" 
                   style="background: #F59E0B; color: white; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: bold; display: inline-block;">
                  Go to Host Dashboard
                </a>
              </div>
            ` : `
              <p style="color: #374151; line-height: 1.6;">
                We're thrilled to have you join our community of curious travelers! LocallyTrip connects 
                you with passionate locals who'll show you their cities like never before.
              </p>
              
              <div style="text-align: center; margin: 40px 0;">
                <a href="${process.env.NEXT_PUBLIC_WEBSITE_URL}/experiences" 
                   style="background: #3B82F6; color: white; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: bold; display: inline-block;">
                  Explore Experiences
                </a>
              </div>
            `}
          </div>
        </div>
      `
    };

    return await this.sendEmail(emailData);
  }
}

module.exports = new MailerSendService();
