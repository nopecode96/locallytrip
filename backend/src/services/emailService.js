const { MailerSend, EmailParams, Sender, Recipient } = require("mailersend");

class EmailService {
  constructor() {
    // Initialize MailerSend client
    this.apiKey = process.env.MAILERSEND_API_KEY || process.env.API_KEY;
    this.mailerSend = new MailerSend({
      apiKey: this.apiKey,
    });
    this.isAvailable = !!this.apiKey;
    
    if (!this.isAvailable) {
      console.warn('⚠️ MailerSend API key not configured. Email service not available.');
    }
  }

  // Legacy method for compatibility - now uses MailerSend
  createTransporter() {
    // This method is maintained for compatibility but no longer creates a nodemailer transporter
    return {
      sendMail: async (mailOptions) => {
        return await this.sendMailViaMailerSend(mailOptions);
      }
    };
  }

  // Internal method to send emails via MailerSend
  async sendMailViaMailerSend(mailOptions) {
    if (!this.isAvailable) {
      throw new Error('MailerSend API key not configured');
    }

    try {
      let senderEmail, senderName;
      
      if (typeof mailOptions.from === 'string') {
        // Parse "Name <email>" format
        const match = mailOptions.from.match(/^"?([^"]*)"?\s*<(.+)>$/);
        if (match) {
          senderName = match[1].trim();
          senderEmail = match[2].trim();
        } else {
          senderEmail = mailOptions.from;
          senderName = 'LocallyTrip.com';
        }
      } else if (mailOptions.from && typeof mailOptions.from === 'object') {
        senderEmail = mailOptions.from.address || mailOptions.from.email;
        senderName = mailOptions.from.name || 'LocallyTrip.com';
      } else {
        senderEmail = 'noreply@locallytrip.com';
        senderName = 'LocallyTrip.com';
      }

      const sentFrom = new Sender(senderEmail, senderName);

      const recipients = Array.isArray(mailOptions.to) ? 
        mailOptions.to.map(email => 
          typeof email === 'string' ? 
            new Recipient(email) : 
            new Recipient(email.address || email.email, email.name || email.display_name)
        ) : 
        [new Recipient(mailOptions.to)];

      const emailParams = new EmailParams()
        .setFrom(sentFrom)
        .setTo(recipients)
        .setReplyTo(sentFrom)
        .setSubject(mailOptions.subject);

      if (mailOptions.html) {
        emailParams.setHtml(mailOptions.html);
      }

      if (mailOptions.text) {
        emailParams.setText(mailOptions.text);
      }

      const response = await this.mailerSend.email.send(emailParams);
      
      // Return format compatible with nodemailer
      return { 
        messageId: response?.id || 'sent',
        response
      };
    } catch (error) {
      console.error('❌ MailerSend error:', error);
      throw error;
    }
  }

  // Initialize transporter (maintained for compatibility)
  get transporter() {
    return this.createTransporter();
  }

  async verifyConnection() {
    try {
      // For MailerSend, just check if API key is available
      if (!this.isAvailable) {
        throw new Error('MailerSend API key not configured');
      }
      
      // MailerSend doesn't need connection verification like SMTP
      return true;
    } catch (error) {
      console.error('❌ Email service error:', error.message);
      return false;
    }
  }

  async healthCheck() {
    if (!this.isAvailable) {
      return {
        service: 'email',
        status: 'disabled',
        reason: 'MailerSend API key not configured',
        provider: 'mailersend',
        timestamp: new Date().toISOString()
      };
    }

    try {
      const isHealthy = await this.verifyConnection();
      return {
        service: 'email',
        status: isHealthy ? 'healthy' : 'unhealthy',
        provider: 'mailersend',
        available: this.isAvailable,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        service: 'email',
        status: 'unhealthy',
        provider: 'mailersend',
        available: this.isAvailable,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  getSender(emailType = 'general') {
    const senders = {
      noreply: process.env.EMAIL_NOREPLY || process.env.EMAIL_USER || 'noreply@locallytrip.com',
      support: process.env.EMAIL_SUPPORT || 'support@locallytrip.com',
      booking: process.env.EMAIL_BOOKING || 'bookings@locallytrip.com',
      marketing: process.env.EMAIL_MARKETING || 'hello@locallytrip.com',
      admin: process.env.EMAIL_ADMIN || 'admin@locallytrip.com',
      general: process.env.EMAIL_GENERAL || process.env.EMAIL_USER || 'noreply@locallytrip.com'
    };

    const senderNames = {
      noreply: process.env.EMAIL_NOREPLY_NAME || 'LocallyTrip',
      support: process.env.EMAIL_SUPPORT_NAME || 'LocallyTrip Support',
      booking: process.env.EMAIL_BOOKING_NAME || 'LocallyTrip Bookings',
      marketing: process.env.EMAIL_MARKETING_NAME || 'LocallyTrip Marketing',
      admin: process.env.EMAIL_ADMIN_NAME || 'LocallyTrip Admin',
      general: 'LocallyTrip'
    };

    const email = senders[emailType] || senders.general;
    const name = senderNames[emailType] || senderNames.general;
    
    // Return format compatible with both nodemailer and MailerSend
    return {
      address: email,
      name: name,
      toString: () => `"${name}" <${email}>` // For backward compatibility
    };
  }

  generateEmailTemplate(content, userType = 'traveller') {
    const brandColor = userType === 'host' ? '#E11D48' : '#0EA5E9'; // Rose for hosts, Sky for travellers
    const brandName = userType === 'host' ? 'LocallyTrip for Hosts' : 'LocallyTrip';
    
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${brandName}</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #374151; background-color: #F9FAFB;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, ${brandColor} 0%, ${userType === 'host' ? '#BE185D' : '#0284C7'} 100%); padding: 30px 20px; text-align: center;">
          <h1 style="margin: 0; color: #FFFFFF; font-size: 28px; font-weight: 700;">${brandName}</h1>
          <p style="margin: 5px 0 0; color: #FFFFFF; opacity: 0.9; font-size: 16px;">Discover Local Experiences</p>
        </div>
        
        <!-- Content -->
        <div style="padding: 40px 20px;">
          ${content}
        </div>
        
        <!-- Footer -->
        <div style="background: #F9FAFB; padding: 20px; text-align: center; color: #6B7280; font-size: 12px;">
          <p style="margin: 0 0 10px;">© ${new Date().getFullYear()} LocallyTrip. All rights reserved.</p>
          <p style="margin: 0;">Connecting travelers with authentic local experiences worldwide.</p>
        </div>
      </div>
    </body>
    </html>`;
  }

  async sendVerificationEmail(userEmail, userName, verificationToken, userType = 'traveller') {
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`;
    
    const greeting = userType === 'host' 
      ? `Welcome to LocallyTrip, ${userName}! Ready to share your local expertise?`
      : `Welcome to LocallyTrip, ${userName}! Let's start your journey.`;
    
    const description = userType === 'host'
      ? 'You\'re just one step away from sharing your amazing local experiences with travelers from around the world.'
      : 'You\'re just one step away from discovering authentic local experiences curated by passionate local hosts.';

    const ctaText = userType === 'host' ? 'Verify & Start Hosting' : 'Verify & Start Exploring';
    
    const content = `
      <h2 style="color: #1F2937; margin: 0 0 20px; font-size: 24px;">${greeting}</h2>
      <p style="margin: 0 0 25px; font-size: 16px; color: #4B5563;">${description}</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verificationUrl}" style="display: inline-block; background: ${userType === 'host' ? '#E11D48' : '#0EA5E9'}; color: #FFFFFF; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: 600; font-size: 16px;">${ctaText}</a>
      </div>
      
      <p style="margin: 25px 0 0; font-size: 14px; color: #6B7280;">
        If the button doesn't work, copy and paste this link into your browser:<br>
        <a href="${verificationUrl}" style="color: ${userType === 'host' ? '#E11D48' : '#0EA5E9'}; word-break: break-all;">${verificationUrl}</a>
      </p>
      
      <div style="margin: 30px 0 0; padding: 15px; background: #F3F4F6; border-radius: 6px; border-left: 4px solid ${userType === 'host' ? '#E11D48' : '#0EA5E9'};">
        <p style="margin: 0; font-size: 14px; color: #374151;">
          <strong>Security Note:</strong> This verification link will expire in 24 hours. If you didn't create this account, please ignore this email.
        </p>
      </div>
    `;

    const mailOptions = {
      from: this.getSender('noreply'),
      to: userEmail,
      subject: `${userType === 'host' ? '🌟 Welcome Host!' : '✈️ Welcome Traveler!'} Please verify your LocallyTrip account`,
      html: this.generateEmailTemplate(content, userType)
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error(`❌ Failed to send verification email to ${userEmail}:`, error);
      return { success: false, error: error.message };
    }
  }

  async sendWelcomeEmail(userEmail, userName, userType = 'traveller') {
    const dashboardUrl = userType === 'host' 
      ? `${process.env.FRONTEND_URL || 'http://localhost:3000'}/host/dashboard`
      : `${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard`;
    
    const greeting = userType === 'host'
      ? `🎉 Welcome to the LocallyTrip Host Community, ${userName}!`
      : `🌍 Welcome to LocallyTrip, ${userName}!`;
    
    const message = userType === 'host'
      ? 'Your account is now verified! You can start creating amazing local experiences for travelers.'
      : 'Your account is now verified! You can start discovering authentic local experiences.';

    const ctaText = userType === 'host' ? 'Go to Host Dashboard' : 'Start Exploring';
    
    const content = `
      <h2 style="color: #1F2937; margin: 0 0 20px; font-size: 24px;">${greeting}</h2>
      <p style="margin: 0 0 25px; font-size: 16px; color: #4B5563;">${message}</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${dashboardUrl}" style="display: inline-block; background: ${userType === 'host' ? '#E11D48' : '#0EA5E9'}; color: #FFFFFF; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: 600; font-size: 16px;">${ctaText}</a>
      </div>
      
      <div style="margin: 30px 0;">
        <h3 style="color: #1F2937; font-size: 18px; margin: 0 0 15px;">What's Next?</h3>
        <ul style="margin: 0; padding: 0 0 0 20px; color: #4B5563;">
          ${userType === 'host' 
            ? `
            <li style="margin-bottom: 8px;">Create your first local experience</li>
            <li style="margin-bottom: 8px;">Set up your host profile</li>
            <li style="margin-bottom: 8px;">Start connecting with travelers</li>
            ` 
            : `
            <li style="margin-bottom: 8px;">Browse local experiences</li>
            <li style="margin-bottom: 8px;">Complete your traveler profile</li>
            <li style="margin-bottom: 8px;">Book your first adventure</li>
            `
          }
        </ul>
      </div>
    `;

    const mailOptions = {
      from: this.getSender('noreply'),
      to: userEmail,
      subject: `${userType === 'host' ? '🌟' : '🎊'} Your LocallyTrip account is ready!`,
      html: this.generateEmailTemplate(content, userType)
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error(`❌ Failed to send welcome email to ${userEmail}:`, error);
      return { success: false, error: error.message };
    }
  }

  async sendPasswordResetEmail(userEmail, userName, resetToken) {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    
    const content = `
      <h2 style="color: #1F2937; margin: 0 0 20px; font-size: 24px;">Password Reset Request</h2>
      <p style="margin: 0 0 25px; font-size: 16px; color: #4B5563;">Hello ${userName}, we received a request to reset your LocallyTrip account password.</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" style="display: inline-block; background: #0EA5E9; color: #FFFFFF; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: 600; font-size: 16px;">Reset My Password</a>
      </div>
      
      <p style="margin: 25px 0 0; font-size: 14px; color: #6B7280;">
        If the button doesn't work, copy and paste this link into your browser:<br>
        <a href="${resetUrl}" style="color: #0EA5E9; word-break: break-all;">${resetUrl}</a>
      </p>
      
      <div style="margin: 30px 0 0; padding: 15px; background: #FEF2F2; border-radius: 6px; border-left: 4px solid #EF4444;">
        <p style="margin: 0; font-size: 14px; color: #374151;">
          <strong>Security Note:</strong> This reset link will expire in 1 hour. If you didn't request this, please ignore this email and your password will remain unchanged.
        </p>
      </div>
    `;

    const mailOptions = {
      from: this.getSender('noreply'),
      to: userEmail,
      subject: '🔐 Reset your LocallyTrip password',
      html: this.generateEmailTemplate(content, 'traveller')
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error(`❌ Failed to send password reset email to ${userEmail}:`, error);
      return { success: false, error: error.message };
    }
  }

  // Newsletter-related email methods
  async sendNewsletterVerification(userEmail, userName, verificationToken) {
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/newsletter/verify/${verificationToken}`;
    
    const content = `
      <h2 style="color: #1F2937; margin: 0 0 20px; font-size: 24px;">🎉 Almost there, ${userName}!</h2>
      <p style="margin: 0 0 25px; font-size: 16px; color: #4B5563;">
        Thank you for subscribing to the LocallyTrip newsletter! We're excited to share amazing travel stories and local experiences with you.
      </p>
      
      <p style="margin: 0 0 25px; font-size: 16px; color: #4B5563;">
        Please click the button below to confirm your email address and complete your subscription:
      </p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verificationUrl}" style="display: inline-block; background: linear-gradient(135deg, #8B5CF6, #EC4899); color: #FFFFFF; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: 700; font-size: 16px; box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);">
          ✨ Verify My Email
        </a>
      </div>
      
      <div style="margin: 30px 0; padding: 20px; background: linear-gradient(135deg, #F3E8FF, #FCE7F3); border-radius: 12px; border-left: 4px solid #8B5CF6;">
        <p style="margin: 0 0 15px; font-size: 16px; color: #1F2937; font-weight: 600;">What you'll get:</p>
        <ul style="margin: 0; padding: 0 0 0 20px; color: #4B5563;">
          <li style="margin-bottom: 8px;">📚 Weekly travel stories from local experts</li>
          <li style="margin-bottom: 8px;">🎯 New experiences in your favorite destinations</li>
          <li style="margin-bottom: 8px;">💡 Insider tips and hidden gems</li>
          <li style="margin-bottom: 8px;">🎁 Exclusive offers and early access</li>
        </ul>
      </div>
      
      <div style="margin: 30px 0; padding: 15px; background: #FEF2F2; border-radius: 8px; border-left: 4px solid #EF4444;">
        <p style="margin: 0; font-size: 14px; color: #374151;">
          <strong>Important:</strong> This verification link will expire in 24 hours. If you didn't subscribe to our newsletter, you can safely ignore this email.
        </p>
      </div>
    `;

    const mailOptions = {
      from: this.getSender('marketing'),
      to: userEmail,
      subject: `${process.env.EMAIL_NEWSLETTER_VERIFICATION_SUBJECT || '✨ Verify your LocallyTrip newsletter subscription'}`,
      html: this.generateEmailTemplate(content, 'traveller')
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error(`❌ Failed to send newsletter verification email to ${userEmail}:`, error);
      return { success: false, error: error.message };
    }
  }

  async sendNewsletterWelcome(userEmail, userName) {
    const exploreUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/explore`;
    const storiesUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/stories`;
    const unsubscribeUrl = `${process.env.EMAIL_UNSUBSCRIBE_URL || 'http://localhost:3000/newsletter/unsubscribe'}`;
    
    const content = `
      <h2 style="color: #1F2937; margin: 0 0 20px; font-size: 24px;">🎉 Welcome to LocallyTrip Newsletter, ${userName}!</h2>
      <p style="margin: 0 0 25px; font-size: 16px; color: #4B5563;">
        Thank you for confirming your subscription! You're now part of our community of travel enthusiasts who love authentic local experiences.
      </p>
      
      <div style="margin: 30px 0; padding: 25px; background: linear-gradient(135deg, #F0FDF4, #ECFDF5); border-radius: 16px; border: 1px solid #10B981;">
        <h3 style="color: #065F46; margin: 0 0 15px; font-size: 18px;">🌟 What's next?</h3>
        <p style="margin: 0 0 20px; color: #047857;">
          While you wait for your first newsletter, why not explore what LocallyTrip has to offer?
        </p>
        
        <div style="display: flex; gap: 15px; margin: 20px 0; flex-wrap: wrap;">
          <a href="${exploreUrl}" style="display: inline-block; background: #10B981; color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 14px;">
            🔍 Explore Experiences
          </a>
          <a href="${storiesUrl}" style="display: inline-block; background: #8B5CF6; color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 14px;">
            📚 Read Stories
          </a>
        </div>
      </div>
      
      <div style="margin: 30px 0; padding: 20px; background: #F9FAFB; border-radius: 12px;">
        <h3 style="color: #1F2937; margin: 0 0 15px; font-size: 18px;">📬 Newsletter Schedule</h3>
        <ul style="margin: 0; padding: 0 0 0 20px; color: #4B5563;">
          <li style="margin-bottom: 8px;"><strong>Weekly Digest:</strong> Every Sunday with top stories and new experiences</li>
          <li style="margin-bottom: 8px;"><strong>Feature Updates:</strong> When exciting new destinations are added</li>
          <li style="margin-bottom: 8px;"><strong>Special Offers:</strong> Exclusive deals for newsletter subscribers</li>
        </ul>
      </div>
      
      <div style="margin: 30px 0; text-align: center; padding: 15px; background: #FEF3C7; border-radius: 8px;">
        <p style="margin: 0; font-size: 14px; color: #92400E;">
          💡 <strong>Tip:</strong> Add hello@locallytrip.com to your contacts to ensure you never miss our emails!
        </p>
      </div>
    `;

    const mailOptions = {
      from: this.getSender('marketing'),
      to: userEmail,
      subject: `${process.env.EMAIL_NEWSLETTER_WELCOME_SUBJECT || '🌍 Welcome to LocallyTrip Newsletter!'}`,
      html: this.generateEmailTemplate(content, 'traveller')
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error(`❌ Failed to send newsletter welcome email to ${userEmail}:`, error);
      return { success: false, error: error.message };
    }
  }

  async sendNewsletterUnsubscribeConfirmation(userEmail, userName) {
    const subscribeUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/newsletter/subscribe`;
    
    const content = `
      <h2 style="color: #1F2937; margin: 0 0 20px; font-size: 24px;">👋 Sorry to see you go, ${userName}</h2>
      <p style="margin: 0 0 25px; font-size: 16px; color: #4B5563;">
        You have been successfully unsubscribed from the LocallyTrip newsletter. You will no longer receive marketing emails from us.
      </p>
      
      <div style="margin: 30px 0; padding: 20px; background: #FEF2F2; border-radius: 12px; border-left: 4px solid #EF4444;">
        <p style="margin: 0 0 15px; font-size: 16px; color: #1F2937; font-weight: 600;">We'd love your feedback:</p>
        <p style="margin: 0; color: #4B5563; font-size: 14px;">
          If you unsubscribed because our emails weren't relevant or too frequent, we'd appreciate knowing how we can improve. 
          You can reply directly to this email with your thoughts.
        </p>
      </div>
      
      <div style="margin: 30px 0; padding: 20px; background: #F0F9FF; border-radius: 12px; border-left: 4px solid #0EA5E9;">
        <p style="margin: 0 0 15px; font-size: 16px; color: #1F2937; font-weight: 600;">You'll still receive:</p>
        <ul style="margin: 0; padding: 0 0 0 20px; color: #4B5563;">
          <li style="margin-bottom: 8px;">✅ Important account notifications (if you have an account)</li>
          <li style="margin-bottom: 8px;">✅ Booking confirmations and travel updates</li>
          <li style="margin-bottom: 8px;">✅ Essential service announcements</li>
        </ul>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <p style="margin: 0 0 15px; color: #4B5563;">Changed your mind? You can resubscribe anytime:</p>
        <a href="${subscribeUrl}" style="display: inline-block; background: linear-gradient(135deg, #8B5CF6, #EC4899); color: white; text-decoration: none; padding: 14px 28px; border-radius: 10px; font-weight: 600;">
          📬 Resubscribe to Newsletter
        </a>
      </div>
      
      <div style="margin: 30px 0; text-align: center; padding: 15px; background: #F9FAFB; border-radius: 8px;">
        <p style="margin: 0; font-size: 14px; color: #6B7280;">
          Thank you for being part of the LocallyTrip community. The platform is still available for you to explore amazing local experiences anytime!
        </p>
      </div>
    `;

    const mailOptions = {
      from: this.getSender('marketing'),
      to: userEmail,
      subject: `${process.env.EMAIL_NEWSLETTER_UNSUBSCRIBE_SUBJECT || '✓ Unsubscribed from LocallyTrip Newsletter'}`,
      html: this.generateEmailTemplate(content, 'traveller')
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log(`✅ Newsletter unsubscribe confirmation sent to ${userEmail}:`, info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error(`❌ Failed to send newsletter unsubscribe confirmation to ${userEmail}:`, error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new EmailService();
