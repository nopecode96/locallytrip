const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = this.createTransporter();
  }

  createTransporter() {
    const config = {
      host: process.env.EMAIL_HOST || 'smtp.maileroo.com',
      port: parseInt(process.env.EMAIL_PORT) || 465,
      secure: true, // use TLS
      auth: {
        user: process.env.EMAIL_USER || 'noreply@locallytrip.com',
        pass: process.env.EMAIL_PASSWORD || '/* secret */'
      },
      debug: true,
      logger: true
    };

    return nodemailer.createTransport(config);
  }

  async verifyConnection() {
    try {
      await this.transporter.verify();
      console.log('✅ Email service ready');
      return true;
    } catch (error) {
      console.error('❌ Email service error:', error.message);
      return false;
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
    
    return `"${name}" <${email}>`;
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
      console.log(`✅ Verification email sent to ${userEmail}:`, info.messageId);
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
      console.log(`✅ Welcome email sent to ${userEmail}:`, info.messageId);
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
      console.log(`✅ Password reset email sent to ${userEmail}:`, info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error(`❌ Failed to send password reset email to ${userEmail}:`, error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new EmailService();
